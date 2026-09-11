"use client";

import { Suspense, useRef, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Environment, Lightformer, OrbitControls, useProgress } from "@react-three/drei";
import { RobotCharacter } from "@/components/three/RobotCharacter";
import { useRobotHeroSequence } from "@/components/three/useRobotHeroSequence";

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * Luz do ambiente — sem carregar nenhum HDR externo (nada de rede: só
 * planos emissivos posicionados em volta do personagem, é o jeito do
 * drei de montar um ambiente de reflexo sem arquivo nenhum). `frames={1}`
 * cozinha o ambiente uma única vez (a cena não tem nada que precise de
 * reflexo atualizado quadro a quadro) — roda uma vez e para, sem custo
 * contínuo. As cores seguem a identidade azul do site (--accent-ink /
 * --accent-2), mais um plano branco neutro de key light pra não deixar
 * tudo azulado de mais ("não deixar o robô artificial demais").
 */
function RobotLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.3} color="#ffffff" />
      <pointLight position={[-3, 1.5, -2]} intensity={1.1} color="#3b82f6" />
      <pointLight position={[0, -1.2, 2.2]} intensity={0.3} color="#1d4ed8" />
      <Environment resolution={64} frames={1}>
        <Lightformer intensity={2} color="#ffffff" position={[0, 3, 3]} scale={[4, 4, 1]} form="rect" />
        <Lightformer intensity={1.4} color="#3b82f6" position={[-4, 1, -2]} scale={[3, 4, 1]} form="rect" />
        <Lightformer intensity={0.8} color="#22d3ee" position={[4, -1, -3]} scale={[3, 3, 1]} form="rect" />
      </Environment>
    </>
  );
}

/**
 * Rotação 360° horizontal — só azimute (`minPolarAngle === maxPolarAngle`
 * trava a inclinação vertical), sem zoom, sem pan. `enableDamping` dá o
 * movimento suave pedido ("não deixar a rotação travada ou brusca");
 * funciona igual no mouse (arrastar) e no toque (swipe de um dedo é
 * rotação por padrão no OrbitControls, sem configuração extra). Gira a
 * CÂMERA ao redor do personagem — nunca toca no AnimationMixer do robô
 * (ver RobotCharacter.tsx), por isso a rotação funciona independente de
 * qual animação estiver tocando.
 *
 * Um auto-giro bem lento roda quando ninguém está interagindo (mostra
 * que o robô é 3D/interativo mesmo sem o usuário mexer) e pausa assim
 * que o usuário toca nos controles, voltando alguns segundos depois de
 * soltar. Com `prefers-reduced-motion`, o auto-giro fica desligado.
 */
function RotationControls() {
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const [autoRotate, setAutoRotate] = useState(true);
  const resumeTimer = useRef<number | null>(null);

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI / 2.25}
      maxPolarAngle={Math.PI / 2.25}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.55}
      // Deriva direto de `reduceMotion` a cada render em vez de
      // sincronizar num efeito — não precisa de setState nenhum pra
      // isso, `reduceMotion` já é reativo (useSyncExternalStore).
      autoRotate={!reduceMotion && autoRotate}
      autoRotateSpeed={0.5}
      onStart={() => {
        if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
        setAutoRotate(false);
      }}
      onEnd={() => {
        if (reduceMotion) return;
        if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
        resumeTimer.current = window.setTimeout(() => setAutoRotate(true), 3500);
      }}
    />
  );
}

function RobotSceneContent() {
  const animState = useRobotHeroSequence();
  return (
    <>
      <RobotLighting />
      {/* `Bounds` enquadra a câmera automaticamente a partir da caixa
          delimitadora real do modelo (sem `observe`, roda só uma vez no
          bind pose — não recalcula a cada quadro animado, então não
          treme/reenquadra sozinho enquanto o robô se move). Isso evita
          ter que cravar posição/distância de câmera "no olho" pra um
          modelo cuja escala exportada do FBX é sempre um pouco
          imprevisível. */}
      <Bounds fit clip observe={false} margin={1.35}>
        <RobotCharacter state={animState} />
      </Bounds>
      <RotationControls />
    </>
  );
}

/** Indicador de carregamento discreto — some assim que o robô estiver
 * pronto, dando lugar a uma entrada suave (fade + leve escala, ver
 * `.robot3d-canvas` em globals.css). Fica por cima do wrapper (não do
 * Canvas), então nunca deixa uma área vazia enquanto o modelo baixa. */
function LoadingOverlay() {
  const { active, progress } = useProgress();
  // `progress` chega em 100 mesmo quando `active` nunca é observado como
  // `true` num render (ex.: tudo em cache, carregou rápido de mais pra
  // capturar o estado intermediário) — checar os dois direto, sem
  // guardar histórico em state/effect, cobre os dois casos.
  if (!active && progress >= 100) return null;
  return (
    <div className="robot3d-loading" role="status" aria-live="polite">
      <span className="robot3d-loading__ring" aria-hidden />
      <span className="robot3d-loading__label">
        Carregando robô 3D{progress > 0 ? ` — ${Math.round(progress)}%` : ""}
      </span>
    </div>
  );
}

export function Robot3D() {
  // Mesmo sinal (useProgress) que o LoadingOverlay usa pra sumir — a
  // entrada suave do Canvas (fade + leve escala) acontece exatamente
  // quando o indicador de carregamento sai, nunca antes nem depois. Não
  // precisa de state/effect próprio: nada mais dispara um novo
  // carregamento depois que este termina (os clipes de fundo em
  // RobotCharacter.tsx usam um LoadingManager separado, de propósito),
  // então `ready` é só uma leitura direta, sempre consistente.
  const { active, progress } = useProgress();
  const ready = !active && progress >= 100;

  return (
    <div className="robot3d-perspective w-full lg:w-auto">
      <div className="robot3d-stage relative mx-auto aspect-[3/4] w-full max-w-xs sm:max-w-sm md:max-w-md lg:mx-0 lg:aspect-auto lg:h-[72vh] lg:max-h-[760px] lg:min-h-[460px] lg:w-[38vw] lg:min-w-[380px] lg:max-w-[620px]">
        {/* Glow ambiente azul atrás — mesma linguagem visual do resto do
            site (é a mesma técnica usada em RobotVideo.tsx). */}
        <div className="robot3d-glow" aria-hidden />

        <LoadingOverlay />

        <div className={`robot3d-canvas ${ready ? "robot3d-canvas--ready" : ""}`}>
          <Canvas
            dpr={[1, 1.75]}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            camera={{ fov: 32, position: [0, 0, 5] }}
            performance={{ min: 0.5 }}
            // `gl={{alpha:true}}` sozinho já deveria bastar, mas em
            // alguns navegadores/GPUs o WebGLRenderer ainda limpa o
            // quadro com alpha=1 (opaco) por padrão — forçar a cor de
            // limpeza com alpha 0 explicitamente aqui é o jeito padrão
            // (e inofensivo onde já funcionava) de garantir transparência
            // de verdade em qualquer navegador, não só neste.
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
            }}
          >
            <Suspense fallback={null}>
              <RobotSceneContent />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
