"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader, MeshoptDecoder } from "three-stdlib";
import { ROBOT_ANIMATIONS, type RobotAnimationState } from "@/components/three/robotAnimations";

const MODEL_URL = "/models/robot/robot.glb";
const ANIMATIONS_DIR = "/models/robot/animations/";

// Carregador reaproveitado pros clipes que chegam em segundo plano (ver
// comentário abaixo) — evita instanciar um GLTFLoader novo por clipe.
// Usa um LoadingManager PRÓPRIO (não o THREE.DefaultLoadingManager) de
// propósito: o indicador de carregamento da Hero (useProgress, ver
// Robot3D.tsx) escuta o manager padrão — se estes clipes de fundo
// usassem o mesmo, a "entrada suave" do robô ficaria esperando salute/
// greeting terminarem de baixar à toa, em vez de aparecer assim que a
// malha + a animação idle (essas sim, via useGLTF/manager padrão)
// estiverem prontas.
//
// IMPORTANTE: precisa do decoder Meshopt registrado igual o useGLTF do
// drei já faz por baixo dos panos pro robot.glb/idle.glb — todo .glb em
// public/models/robot/animations/ foi comprimido com `gltfpack -cc`
// (EXT_meshopt_compression). Sem isso aqui, o GLTFLoader falha em
// silêncio (cai no onError) pra QUALQUER arquivo comprimido — foi
// exatamente isso que fazia greeting/salute/jog nunca chegarem a
// carregar (só "idle" funcionava, por passar pelo useGLTF).
const bgManager = new THREE.LoadingManager();
let bgLoader: GLTFLoader | null = null;
function getBgLoader() {
  if (!bgLoader) {
    bgLoader = new GLTFLoader(bgManager);
    bgLoader.setMeshoptDecoder(typeof MeshoptDecoder === "function" ? MeshoptDecoder() : MeshoptDecoder);
  }
  return bgLoader;
}

/**
 * Busca um clipe de animação FORA do Suspense do R3F — usado pros
 * estados com `preload: true` que não são "idle" (hoje: greeting,
 * salute e jog — ver ROBOT_HERO_SEQUENCE). "idle" é o único que
 * bloqueia o primeiro frame (via useGLTF normal, que suspende); os
 * outros chegam depois, sem atrasar a entrada do robô em cena.
 */
function loadClip(file: string, clipName: string): Promise<THREE.AnimationClip | null> {
  return new Promise((resolve) => {
    getBgLoader().load(
      `${ANIMATIONS_DIR}${file}`,
      (gltf) => {
        const clip = gltf.animations.find((a) => a.name === clipName) ?? gltf.animations[0] ?? null;
        resolve(clip ?? null);
      },
      undefined,
      () => resolve(null)
    );
  });
}

/**
 * O robô 3D (ver assets-source/robot/ — fonte original, fora de public/
 * de propósito, ver assets-source/README.md — e robotAnimations.ts, de
 * onde vem o registro de estados). Este componente só cuida de: (1)
 * carregar a malha (robot.glb) + o clipe ativo, (2) tocar a animação do
 * `state` pedido com crossfade suave entre trocas. Rotação de câmera
 * (o "360°") é responsabilidade de quem usa este componente (ver
 * Robot3D.tsx, que envolve isto num <OrbitControls>) — de propósito
 * separado: a rotação da câmera nunca toca no AnimationMixer, então
 * gira independente da animação estar tocando ou não.
 *
 * O AnimationMixer é gerenciado NA MÃO aqui (em vez do `useAnimations`
 * do drei) de propósito: `useAnimations` recria o cache de ações toda
 * vez que a IDENTIDADE do array `clips` muda — e como salute/greeting
 * chegam em segundo plano (ver loadClip acima), o array mudaria umas
 * duas vezes depois do "idle" já estar tocando, o que reseta o mixer
 * inteiro (`mixer.stopAllAction()`) e para a animação que já estava
 * rodando. Um `AnimationMixer` criado uma única vez (nunca recriado) e
 * um mapa de ações que só CRESCE (nunca é limpo) evita isso — cada
 * clipe ganha sua `AnimationAction` assim que chega e nunca mais é
 * descartada.
 */
export function RobotCharacter({ state }: { state: RobotAnimationState }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  // De propósito, SEM clonar: a Hero só monta UM RobotCharacter durante
  // toda a vida da página, então animar o objeto que já vem do cache do
  // useGLTF é seguro aqui (nunca existem duas instâncias competindo pelo
  // mesmo grafo). Cloná-lo traria complexidade sem necessidade real — e
  // `scene.clone(true)` (o clone padrão do Object3D) nem funcionaria
  // direito pra um personagem com esqueleto: o SkinnedMesh clonado
  // continua com `skeleton.bones` apontando pros bones ORIGINAIS
  // (pré-clone), então animar os bones da cópia não teria efeito visual
  // na malha. A alternativa correta seria `SkeletonUtils.clone` (do
  // three-stdlib), mas na prática ela devolveu uma malha invisível com
  // esta versão do three (conferido visualmente antes de descartar essa
  // rota) — mais um motivo pra não precisar dela aqui.
  const scenePayload = scene;

  useEffect(() => {
    scenePayload.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = false;
        obj.receiveShadow = false;
        obj.frustumCulled = false; // personagem gira em cena inteira; evita sumir por engano no clipping da câmera
      }
    });
  }, [scenePayload]);

  // "idle" é o único que bloqueia o Suspense (é o estado inicial).
  const idleGltf = useGLTF(`${ANIMATIONS_DIR}${ROBOT_ANIMATIONS.idle.file}`);
  const idleClip = useMemo(() => {
    const raw =
      idleGltf.animations.find((a) => a.name === ROBOT_ANIMATIONS.idle.clipName) ?? idleGltf.animations[0];
    if (!raw) return undefined;
    const clone = raw.clone();
    clone.name = "idle";
    return clone;
  }, [idleGltf]);

  const [extraClips, setExtraClips] = useState<Partial<Record<RobotAnimationState, THREE.AnimationClip>>>({});

  useEffect(() => {
    let cancelled = false;
    // Só os estados `preload: true` além de "idle" (hoje: salute e
    // greeting) — os de locomoção ficam de fora de propósito (ver
    // comentário grande em robotAnimations.ts) e nunca são buscados
    // automaticamente.
    const toLoad = (Object.keys(ROBOT_ANIMATIONS) as RobotAnimationState[]).filter(
      (key) => key !== "idle" && ROBOT_ANIMATIONS[key].preload
    );
    (async () => {
      for (const key of toLoad) {
        const source = ROBOT_ANIMATIONS[key];
        const clip = await loadClip(source.file, source.clipName);
        if (cancelled || !clip) continue;
        clip.name = key;
        setExtraClips((prev) => ({ ...prev, [key]: clip }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Criado uma única vez (root vai só depois, via clipAction — não
  // precisa de group.current já pronto aqui).
  const [mixer] = useState(() => new THREE.AnimationMixer(undefined as unknown as THREE.Object3D));
  useFrame((_state, delta) => mixer.update(delta));

  // Mapa de ações que só cresce — ver comentário grande no topo do
  // componente sobre por que não é o `useAnimations` do drei aqui.
  const actionsRef = useRef<Partial<Record<RobotAnimationState, THREE.AnimationAction>>>({});

  useEffect(() => {
    if (!group.current || !idleClip) return;
    if (!actionsRef.current.idle) {
      actionsRef.current.idle = mixer.clipAction(idleClip, group.current);
    }
  }, [idleClip, mixer]);

  useEffect(() => {
    if (!group.current) return;
    for (const key of Object.keys(extraClips) as RobotAnimationState[]) {
      const clip = extraClips[key];
      if (clip && !actionsRef.current[key]) {
        actionsRef.current[key] = mixer.clipAction(clip, group.current);
      }
    }
  }, [extraClips, mixer]);

  const currentState = useRef<RobotAnimationState | null>(null);

  useEffect(() => {
    const nextAction = actionsRef.current[state];
    // O clipe pedido ainda não chegou (estado promovido cedo de mais) —
    // mantém o que já está tocando até esta condição rodar de novo com
    // o clipe pronto (dispara de novo quando idleClip/extraClips mudam,
    // ver dependências abaixo).
    if (!nextAction) return;
    if (currentState.current === state) return;

    const previousAction = currentState.current ? actionsRef.current[currentState.current] : null;
    const source = ROBOT_ANIMATIONS[state];
    const CROSSFADE_SECONDS = 0.5;

    nextAction.reset();
    nextAction.setLoop(source.loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    nextAction.clampWhenFinished = !source.loop;
    nextAction.enabled = true;

    if (previousAction && previousAction !== nextAction) {
      // `crossFadeTo`/`crossFadeFrom` (API nativa do THREE.AnimationAction)
      // sincronizam o fadeOut da anterior com o fadeIn da próxima num
      // único gesto, em vez de dois fades independentes — é o jeito
      // "de manual" de fazer a transição, evita os dois clipes com pesos
      // temporariamente errados que fadeIn+fadeOut soltos podem produzir.
      nextAction.play();
      previousAction.crossFadeTo(nextAction, CROSSFADE_SECONDS, true);
    } else {
      nextAction.play();
      nextAction.fadeIn(CROSSFADE_SECONDS);
    }

    currentState.current = state;
  }, [state, idleClip, extraClips]);

  return (
    <group ref={group} dispose={null}>
      {/* Centralização/enquadramento de câmera ficam no <Bounds> de
          Robot3D.tsx, não aqui — evita dois mecanismos de auto-layout
          (este + Bounds) competindo pela mesma origem. */}
      <primitive object={scenePayload} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
useGLTF.preload(`${ANIMATIONS_DIR}${ROBOT_ANIMATIONS.idle.file}`);
