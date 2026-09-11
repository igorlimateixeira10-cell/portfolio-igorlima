"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations, useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { FBXLoader, GLTFLoader, DRACOLoader, MeshoptDecoder } from "three-stdlib";
import * as THREE from "three";
import { ALTER_ANIMATIONS, listExternalAnimationFiles, type AlterAnimationState } from "@/components/three/alterAnimations";

const MODEL_URL = "/models/alter/alter.glb";
const ANIMATIONS_DIR = "/models/alter/animations/";

let dracoLoader: DRACOLoader | null = null;
function configureGLTFLoader(loader: GLTFLoader) {
  if (!dracoLoader) dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.5/");
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(typeof MeshoptDecoder === "function" ? MeshoptDecoder() : MeshoptDecoder);
}

/**
 * ALTER — personagem 3D. Este componente carrega SÓ a malha
 * (alter.glb) + monta o material PBR; de onde vêm as animações que ele
 * pode tocar é responsabilidade do registro em alterAnimations.ts, não
 * daqui — é isso que permite adicionar uma animação nova (baixada do
 * Mixamo, ver public/models/alter/animations/README.md) sem editar
 * este arquivo.
 *
 * `state` escolhe qual animação tocar (ver AlterAnimationState). Troca
 * de estado faz um crossfade suave (fadeOut da anterior, fadeIn da
 * nova) em vez de cortar seco. Estados sem `file`/`clipName` registrados
 * ainda (todos, exceto "reference-run", por enquanto) simplesmente não
 * fazem nada — nenhuma animação é inventada.
 */
export function AlterCharacter({ state = "reference-run" }: { state?: AlterAnimationState }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations: embeddedAnimations } = useGLTF(MODEL_URL);

  // Arquivos externos já registrados em alterAnimations.ts — hoje a
  // lista está vazia (ninguém baixou nada do Mixamo ainda), então os
  // dois `useLoader` abaixo resolvem pra um array vazio na hora, sem
  // baixar nada. Assim que um arquivo for registrado ali, ele passa a
  // ser carregado automaticamente — nenhuma mudança necessária aqui.
  const externalFiles = useMemo(
    () => listExternalAnimationFiles().map((file) => ANIMATIONS_DIR + file),
    []
  );
  const fbxFiles = useMemo(() => externalFiles.filter((f) => f.toLowerCase().endsWith(".fbx")), [externalFiles]);
  const glbFiles = useMemo(
    () => externalFiles.filter((f) => !f.toLowerCase().endsWith(".fbx")),
    [externalFiles]
  );

  const fbxResults = useLoader(FBXLoader, fbxFiles) as unknown as THREE.Group[];
  const glbResults = useLoader(GLTFLoader, glbFiles, configureGLTFLoader) as unknown as {
    animations: THREE.AnimationClip[];
  }[];

  const allClips = useMemo(() => {
    const fromFbx = fbxResults.flatMap((fbxGroup) => fbxGroup.animations);
    const fromGlb = glbResults.flatMap((g) => g.animations);
    const merged = [...embeddedAnimations, ...fromFbx, ...fromGlb];
    if (process.env.NODE_ENV !== "production" && (fromFbx.length || fromGlb.length)) {
      // Ajuda a preencher `clipName` no registro: mostra o nome real de
      // cada clipe assim que um arquivo novo é carregado.
      console.info(
        "[ALTER] clipes de animação disponíveis:",
        merged.map((c) => c.name)
      );
    }
    return merged;
  }, [embeddedAnimations, fbxResults, glbResults]);

  const { actions } = useAnimations(allClips, group);

  // O FBX original só conectou o mapa de cor base (Diffuse/Emissive) no
  // material — metallic/roughness/normal existiam como arquivos soltos,
  // sem ligação nenhuma. Carrego os três aqui e monto o material PBR de
  // verdade na malha já existente (ela já vem com o mapa de cor base,
  // esse eu reaproveito em vez de carregar de novo).
  const [metalnessMap, roughnessMap, normalMap] = useTexture([
    "/models/alter/metallic.png",
    "/models/alter/roughness.png",
    "/models/alter/normal.png",
  ]);

  useEffect(() => {
    // Texturas do three.js são objetos com estado mutável de propósito —
    // configurar depois de carregadas (colorSpace, flipY) é o jeito
    // padrão da própria biblioteca, não um valor de React sendo mutado.
    // O lint novo (react-hooks/immutability) não distingue os dois casos.
    /* eslint-disable react-hooks/immutability */
    metalnessMap.colorSpace = THREE.NoColorSpace;
    roughnessMap.colorSpace = THREE.NoColorSpace;
    normalMap.colorSpace = THREE.NoColorSpace;
    [metalnessMap, roughnessMap, normalMap].forEach((tex) => {
      tex.flipY = false;
      tex.needsUpdate = true;
    });
    /* eslint-enable react-hooks/immutability */

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;

      const current = child.material as THREE.MeshStandardMaterial | undefined;
      const baseMap = current?.map ?? null;
      if (baseMap) {
        baseMap.flipY = false;
        baseMap.needsUpdate = true;
      }

      child.material = new THREE.MeshStandardMaterial({
        map: baseMap,
        metalnessMap,
        roughnessMap,
        normalMap,
        metalness: 1,
        roughness: 1,
        // O emissive real do "glow" fica pro ajuste fino visual (etapa
        // seguinte) — por enquanto neutro, só a base PBR correta.
      });
    });
  }, [scene, metalnessMap, roughnessMap, normalMap]);

  // Sistema de estados: troca de `state` faz crossfade pro Action certo.
  // Estado sem clipe registrado (`clipName` null, ou o arquivo ainda não
  // existe) simplesmente não toca nada — sem fallback pra corrida nem
  // pra qualquer outra coisa, pra não fingir uma animação que não existe.
  const previousAction = useRef<THREE.AnimationAction | null>(null);
  // AnimationAction é um objeto de controle imperativo do three.js — mutar
  // reset/setLoop/clampWhenFinished/fadeIn é o jeito padrão da própria
  // biblioteca de tocar um clipe, não um valor de React sendo mutado
  // (mesmo caso das texturas, ver comentário acima). O lint novo
  // (react-hooks/immutability) não distingue os dois casos, e aqui ele
  // ancora o aviso no próprio `useEffect(`, então o disable cobre o
  // efeito inteiro em vez de só a linha que muta.
  /* eslint-disable react-hooks/immutability */
  useEffect(() => {
    const config = ALTER_ANIMATIONS[state];
    const action = config.clipName ? actions[config.clipName] : undefined;

    if (action) {
      action.reset();
      action.setLoop(config.loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
      action.clampWhenFinished = !config.loop;
      action.fadeIn(0.3).play();
    }

    const previous = previousAction.current;
    if (previous && previous !== action) {
      previous.fadeOut(0.3);
    }
    previousAction.current = action ?? null;

    return () => {
      action?.fadeOut(0.2);
    };
  }, [state, actions]);
  /* eslint-enable react-hooks/immutability */

  // O modelo vem em cm, com os pés perto do chão (y≈0) mas descentralizado
  // em X/Z, e o "meio do corpo" (útil pra mirar a câmera nele) fica a
  // ~82 unidades de altura. Esse deslocamento centraliza tudo isso na
  // origem — assim a câmera olhando pro (0,0,0) já enquadra o corpo
  // inteiro sem cálculo nenhum do lado da cena (ver AlterScene.tsx).
  // Valores tirados da bounding box real do arquivo (analisada antes).
  return (
    <group ref={group} dispose={null} position={[2.36, -82, -2.23]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
