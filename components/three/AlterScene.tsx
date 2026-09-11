"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { AlterCharacter } from "@/components/three/AlterCharacter";
import type { AlterAnimationState } from "@/components/three/alterAnimations";

/**
 * Palco 3D do ALTER — câmera, luz e o `<Canvas>` em si. Separado do
 * AlterCharacter de propósito: este arquivo cuida só de "onde a câmera
 * está e como a cena é iluminada", sem saber nada sobre o modelo — mais
 * fácil de reaproveitar/ajustar cada peça sem mexer na outra.
 *
 * Escala/câmera: o modelo vem em centímetros (~165cm de altura) — em vez
 * de escalar a malha, a câmera foi posicionada considerando essa unidade
 * "grande" direto (dezenas/centenas, não metros). O deslocamento que
 * centraliza o personagem é feito no group do AlterCharacter, não aqui —
 * assim a câmera só precisa mirar pro (0,0,0) de sempre.
 *
 * `state` (opcional) repassa pro AlterCharacter qual animação tocar —
 * ver alterAnimations.ts. Sem passar nada, usa o padrão de lá
 * ("reference-run", a corrida de teste).
 */
export function AlterScene({ state }: { state?: AlterAnimationState } = {}) {
  return (
    <div className="alter-canvas-stage tech-card relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl">
      {/* Estado de carregamento — o `<Suspense>` do R3F fica pendente
          enquanto o GLB (2,7MB) + as 3 texturas PBR baixam; sem isso o
          canvas fica em branco por 1-2s num carregamento real (e bem mais
          em conexão lenta). Fica atrás do Canvas (`absolute inset-0`,
          `-z-10`) — quando o modelo termina de carregar, o Canvas
          desenha por cima e cobre isso sozinho. */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-2 opacity-50" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-2" />
        </span>
      </div>

      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [90, 55, 360], fov: 28, near: 1, far: 2000 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0a0714"]} />

        {/* Luz principal — branco levemente frio, de cima/frente. */}
        <directionalLight position={[80, 200, 150]} intensity={2.4} color="#eef3ff" />
        {/* Preenchimento suave, evita sombras totalmente pretas. */}
        <ambientLight intensity={0.5} color="#3b82f6" />
        {/* Contorno azul por trás — reforça a identidade "neon" do site. */}
        <pointLight position={[-120, 120, -100]} intensity={1.8} color="#22d3ee" />

        <Suspense fallback={null}>
          <AlterCharacter state={state} />
          <Environment preset="city" environmentIntensity={0.4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
