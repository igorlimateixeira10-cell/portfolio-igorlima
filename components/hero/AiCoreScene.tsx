"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AiCore } from "@/components/three/AiCore";
import { CinematicStage } from "@/components/three/CinematicStage";
import { useReducedMotion } from "@/components/hooks/useReducedMotion";
import { useDesktopQuality } from "@/components/hooks/useDesktopQuality";

/**
 * Parallax 3D de verdade — a cena inteira inclina suave seguindo o
 * cursor, calculado DENTRO do Three.js (`state.pointer`, já normalizado
 * -1..1 pelo próprio sistema de eventos do R3F) em vez de CSS na `div`
 * de fora. Interpola (lerp) a cada quadro pro movimento nunca ser
 * brusco. Desligado com `prefers-reduced-motion` — a cena fica na
 * rotação de repouso, sem reagir ao mouse. Independente da deriva de
 * câmera do CinematicStage (uma move a CÂMERA, esta gira o SUJEITO) —
 * as duas se somam sem conflito.
 */
function ParallaxRig({ reduceMotion, children }: { reduceMotion: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ pointer }) => {
    if (reduceMotion || !ref.current) return;
    const targetY = pointer.x * 0.35;
    const targetX = -pointer.y * 0.22;
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.06;
    ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.06;
  });

  return <group ref={ref}>{children}</group>;
}

function AiCoreSceneContent({ reduceMotion, quality }: { reduceMotion: boolean; quality: "high" | "low" }) {
  return (
    <CinematicStage quality={quality} reduceMotion={reduceMotion} floorY={-1.6} focusDistance={0.018}>
      <ParallaxRig reduceMotion={reduceMotion}>
        <AiCore reduceMotion={reduceMotion} />
      </ParallaxRig>
    </CinematicStage>
  );
}

/**
 * Wrapper de Canvas do Núcleo IA — substitui Robot3D.tsx como o que
 * `HeroVisual.tsx` monta. Sem `useGLTF`/Suspense-de-rede de verdade:
 * como o núcleo é 100% procedural (nenhum .glb pra baixar), não existe
 * estado de "carregando" — a cena já nasce pronta, só com uma entrada
 * suave (fade + leve escala via CSS, ver `.aicore-canvas` em
 * globals.css) pra não "estourar" na tela de uma vez.
 *
 * `quality`: o palco cinematográfico completo (chão reflexivo +
 * profundidade de campo, ver CinematicStage.tsx) só roda em telas
 * grandes (`min-width: 1024px`) — são os dois passos mais caros do
 * pacote. Celular/tablet ganham bloom+vinheta (baratos) sem o resto.
 * Isso é ADEMAIS do fallback de conexão lenta que já existia (esse
 * continua intacto — ver HeroVisual.tsx): aqui é só sobre o CUSTO da
 * própria cena em quem já vai renderizar o Canvas de qualquer jeito.
 */
export function AiCoreScene() {
  const reduceMotion = useReducedMotion();
  const isDesktop = useDesktopQuality();
  const quality: "high" | "low" = isDesktop ? "high" : "low";

  return (
    <div className="aicore-perspective w-full lg:w-auto">
      <div className="aicore-stage relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm md:max-w-md lg:mx-0 lg:aspect-auto lg:h-[62vh] lg:max-h-[640px] lg:min-h-[400px] lg:w-[36vw] lg:min-w-[360px] lg:max-w-[560px]">
        <div className="aicore-glow" aria-hidden />
        <div className="aicore-canvas aicore-canvas--ready">
          <Canvas
            dpr={[1, 1.75]}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            camera={{ fov: 40, position: [0, 0, 6] }}
            performance={{ min: 0.5 }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.1;
            }}
          >
            <Suspense fallback={null}>
              <AiCoreSceneContent reduceMotion={reduceMotion} quality={quality} />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
