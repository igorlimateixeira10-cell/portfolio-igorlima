"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { CinematicStage } from "@/components/three/CinematicStage";

/**
 * Versão "produto/experiência" de um projeto real: a mesma screenshot
 * usada no BrowserFrame plano (ver Projects.tsx), só que apresentada
 * como uma peça flutuando no mesmo palco cinematográfico do Hero (ver
 * CinematicStage.tsx) — luz de estúdio, névoa, bloom, vinheta — em vez
 * de um card estático. A ideia pedida foi "tratar cada projeto como um
 * produto/experiência visual"; isto é literalmente isso: o print vira
 * uma peça de vidro/metal iluminada, com borda de energia (mesma
 * técnica de fresnel do Núcleo IA), girando devagar e reagindo ao
 * cursor.
 *
 * O conteúdo em si (a imagem) é exatamente `project.image` — nenhum
 * asset novo, nenhuma textura inventada.
 */

const PANEL_VERTEX = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Moldura fresnel ao redor do painel — mesma receita do núcleo (borda
// acende, centro apaga), só que sem shimmer (aqui o "sujeito" é a
// screenshot, a borda só precisa emoldurar, não competir por atenção).
const FRAME_FRAGMENT = `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.2);
    gl_FragColor = vec4(uColor, fresnel * 0.9);
  }
`;

function ScreenshotPanel({ src, reduceMotion }: { src: string; reduceMotion: boolean }) {
  const texture = useTexture(src);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ pointer, clock }) => {
    if (reduceMotion || !groupRef.current) return;
    const idle = Math.sin(clock.elapsedTime * 0.4) * 0.03;
    const targetY = pointer.x * 0.25;
    const targetX = -pointer.y * 0.12 + idle;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
  });

  // Aspecto 2:1 — mesma proporção do BrowserFrame plano, pra a
  // screenshot nunca esticar/cortar diferente entre os dois modos.
  const width = 3.2;
  const height = 1.6;

  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial map={texture} roughness={0.35} metalness={0.1} clearcoat={0.6} clearcoatRoughness={0.25} />
      </mesh>
      {/* Moldura de energia, ligeiramente maior e atrás — dá a borda de
          brilho característica das referências (o "portal" luminoso). */}
      <mesh position={[0, 0, -0.02]} scale={[1.03, 1.06, 1]}>
        <planeGeometry args={[width, height]} />
        <shaderMaterial
          vertexShader={PANEL_VERTEX}
          fragmentShader={FRAME_FRAGMENT}
          uniforms={{ uColor: { value: new THREE.Color("#3b82f6") } }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function ProjectPanel3D({ image, reduceMotion }: { image: string; reduceMotion: boolean }) {
  // IMPORTANTE: `relative` + `aspect-[2/1]` + `min-w-0` + `overflow-hidden`
  // aqui (em vez de reaproveitar `.aicore-canvas`, que é `position:
  // absolute; inset: 0` — pensada pra viver dentro do `.aicore-stage` já
  // dimensionado do Hero, ver AiCoreScene.tsx) é o que evita um bug
  // clássico de R3F dentro de CSS Grid: um <canvas> tem largura/altura
  // "intrínsecas" como um <img> — se o elemento que o contém tiver seu
  // tamanho DERIVADO do próprio conteúdo (ex.: `aspect-ratio` calculado
  // em cima de um item de grid cuja largura ainda depende do conteúdo),
  // o ResizeObserver do R3F mede um tamanho, o Canvas cresce, o
  // container cresce, mede de novo — loop.
  //
  // A saída (mesma receita do `.aicore-stage`/`.aicore-canvas` do Hero):
  // o box de proporção usa `padding-top` (sempre relativo à LARGURA do
  // container, nunca ao conteúdo) pra ter altura, e o Canvas entra
  // `position: absolute; inset: 0` por cima — fora do fluxo, então é
  // IMPOSSÍVEL ele influenciar o tamanho do próprio pai, não importa o
  // que o ResizeObserver meça.
  return (
    <div className="relative w-full min-w-0 overflow-hidden rounded-xl bg-bg" style={{ paddingTop: "50%" }}>
      <div className="absolute inset-0">
        <Canvas
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          // z=3.3 com fov=32: enquadra o painel (3.2x1.6 + moldura até
          // 1.06x) preenchendo quase todo o quadro — câmera mais longe
          // deixava sobrar margem preta demais em volta da screenshot.
          camera={{ fov: 32, position: [0, 0, 3.3] }}
          performance={{ min: 0.5 }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
          }}
        >
          <Suspense fallback={null}>
            {/* `postprocessing={false}`: ver comentário completo em
                CinematicStage.tsx — só a Hero roda o EffectComposer de
                verdade; dois ao mesmo tempo na página (Hero + um painel
                de projeto) corrompiam o tamanho um do outro (bug
                verificado da própria lib). O brilho de borda do painel
                (ScreenshotPanel abaixo, blending aditivo) cobre boa
                parte do que o bloom faria aqui. */}
            <CinematicStage quality="low" reduceMotion={reduceMotion} postprocessing={false}>
              <ScreenshotPanel src={image} reduceMotion={reduceMotion} />
            </CinematicStage>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
