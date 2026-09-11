"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from "@react-three/postprocessing";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

// `RectAreaLight` precisa desse init (uniforms da aproximação LTC) uma
// única vez antes do primeiro render — módulo carrega só no cliente
// ("use client" acima), então não tem custo/risco nenhum no SSR.
// Rodar aqui, no topo do módulo, é o mesmo motivo de PARTICLE_POSITIONS
// em AiCore.tsx: efeito colateral fora do corpo de um componente, uma
// vez só, nunca durante o render.
if (typeof window !== "undefined") {
  RectAreaLightUniformsLib.init();
}

/**
 * "Palco" cinematográfico reutilizável — a peça central da reconstrução
 * visual pedida (ver referências analisadas: portal num jardim, carro
 * numa floresta — a receita comum é sempre a mesma: um sujeito bem
 * iluminado, chão com reflexo borrado, névoa dando profundidade,
 * câmera nunca 100% estática, e pós-processamento de verdade —
 * profundidade de campo, bloom, vinheta, grão). Isto NÃO é o sujeito em
 * si (o núcleo, um projeto...) — é o "estúdio fotográfico" ao redor
 * dele. `AiCoreScene.tsx` usa a versão `quality="high"` (a Hero merece
 * o palco completo); os painéis de projeto usam algo mais leve — ver
 * ProjectPanel3D.tsx — por isso o chão/pós-processamento pesado aqui
 * são opcionais via props, não embutidos à força.
 *
 * IMPORTANTE sobre performance: `DepthOfField` (desfoque real por
 * profundidade) e o chão reflexivo são os passos mais caros do pacote —
 * só entram com `quality="high"`, que por sua vez só é pedido em
 * desktop (ver AiCoreScene.tsx, checagem de `min-width: 1024px`).
 * Mobile e o fallback de conexão lenta continuam existindo do jeito que
 * já estavam — isto aqui só afeta quem já ia ver o Canvas de qualquer
 * forma.
 *
 * IMPORTANTE sobre `postprocessing` (novo prop, default `true`):
 * verificado e confirmado por eliminação (testes de 60s+ com/sem cada
 * peça) que ter DOIS `<EffectComposer>` (deste pacote,
 * @react-three/postprocessing) montados e renderizando AO MESMO TEMPO —
 * um no Hero, outro num painel de projeto, ver ProjectPanel3D.tsx — faz
 * um "herdar" o tamanho/aspecto do outro depois de alguns segundos (bug
 * de estado compartilhado na própria lib, não deste projeto). Como só
 * PODE existir um `<AiCoreScene>` na página (a Hero), mas potencialmente
 * vários painéis de projeto montados ao mesmo tempo (rolando a seção),
 * a saída segura é: só a Hero (`postprocessing` no default `true`) roda
 * o pipeline de bloom/DoF/vinheta de verdade; os painéis de projeto
 * passam `postprocessing={false}` — nunca mais de um EffectComposer
 * simultâneo em nenhum cenário. Os painéis continuam com iluminação,
 * materiais e câmera de verdade — só sem o passe de pós-processamento
 * por cima (compensado pela borda fresnel do próprio painel, que já usa
 * blending aditivo — ver ScreenshotPanel em ProjectPanel3D.tsx).
 */
export function CinematicStage({
  children,
  quality = "high",
  floorY = -1.7,
  focusDistance = 0.018,
  reduceMotion = false,
  postprocessing = true,
}: {
  children: React.ReactNode;
  quality?: "high" | "low";
  floorY?: number;
  focusDistance?: number;
  reduceMotion?: boolean;
  postprocessing?: boolean;
}) {
  const cameraRigRef = useRef<THREE.Group>(null);

  // Deriva de câmera bem lenta e contínua — a referência nunca fica com
  // a câmera 100% parada (mesmo nos frames "estáticos" existe leve
  // profundidade de campo sugerindo movimento). Aqui é sutil de
  // propósito: filma o sujeito, não chama atenção pra si. Desligada com
  // `prefers-reduced-motion` — a câmera fica no pouso inicial parada.
  useFrame((state) => {
    if (reduceMotion) return;
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.08) * 0.35;
    state.camera.position.y = 0.15 + Math.sin(t * 0.06) * 0.12;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Névoa — funde o fundo do "estúdio" com a distância, dá
          profundidade sem precisar desenhar um cenário de verdade. */}
      <fog attach="fog" args={["#05030d", 3, 11]} />

      <ambientLight intensity={0.3} />
      {/* Key light — a luz principal, forte, de um lado só (nunca luz
          "chapada" — é o que mais separa uma cena de estúdio de um
          objeto só iluminado por ambiente). */}
      <directionalLight position={[3.5, 4.5, 3]} intensity={2.2} color="#ffffff" />
      {/* Rim light — contorna o sujeito por trás, cria a "borda de luz"
          característica das referências (o brilho ao redor do carro/
          portal contra o fundo escuro). */}
      <pointLight position={[-3.5, 1.5, -3]} intensity={3} color="#3b82f6" distance={9} />
      {/* Preenchimento — fraco, só pra a sombra do lado oposto à key
          light não virar um buraco preto total. */}
      <pointLight position={[0, -1, 2.5]} intensity={0.4} color="#1d4ed8" distance={6} />

      {/* "Softbox" de estúdio fotográfico — três painéis retangulares de
          luz (grandes e suaves, não pontos de luz duros) via
          `<rectAreaLight>` nativo do three.js — mesma ideia visual dos
          Lightformers/`<Environment>` do drei, mas sem bake de cubemap
          (`<Environment>` foi cogitado e descartado aqui: adiciona um
          passe de render offscreen que não é necessário só pra 3
          painéis de luz retangulares). */}
      <rectAreaLight intensity={5} color="#ffffff" position={[0, 3, 3]} width={4} height={4} rotation={[-Math.PI / 4, 0, 0]} />
      <rectAreaLight intensity={3.5} color="#3b82f6" position={[-4, 1, -2]} width={3} height={4} rotation={[0, Math.PI / 2.4, 0]} />
      <rectAreaLight intensity={2} color="#22d3ee" position={[4, -1, -3]} width={3} height={3} rotation={[0, -Math.PI / 2.4, 0]} />

      {quality === "high" && (
        <mesh rotation-x={-Math.PI / 2} position={[0, floorY, 0]}>
          <planeGeometry args={[24, 24]} />
          <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={512}
            mixBlur={1}
            mixStrength={35}
            roughness={1}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050310"
            metalness={0.4}
            mirror={0}
          />
        </mesh>
      )}

      <group ref={cameraRigRef}>{children}</group>

      {postprocessing &&
        (quality === "high" ? (
          <EffectComposer multisampling={0}>
            <DepthOfField focusDistance={focusDistance} focalLength={0.04} bokehScale={3.2} height={480} />
            <Bloom intensity={0.55} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette eskil={false} offset={0.25} darkness={0.65} />
            <Noise opacity={0.025} />
          </EffectComposer>
        ) : (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.45} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
            <Vignette eskil={false} offset={0.25} darkness={0.55} />
          </EffectComposer>
        ))}
    </>
  );
}
