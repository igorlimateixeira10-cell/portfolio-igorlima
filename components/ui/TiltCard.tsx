"use client";

import { useRef, type ReactNode } from "react";

/**
 * Envolve um card existente (Benefits, Services, Projects) e aplica um
 * leve tilt 3D seguindo o cursor — mesma técnica já validada no palco
 * do Núcleo IA/vídeo do robô (perspective + rotateX/rotateY calculados
 * do mouse), só que em CSS/DOM puro, sem WebGL: reutilizar a lógica em
 * vez de reescrevê-la por card é o que faz o hover "combinar" com o
 * resto do site em vez de parecer um efeito solto.
 *
 * Só ativa em dispositivos com mouse de verdade (`hover:hover` +
 * `pointer:fine` — exclui touch/tablet) e nunca com
 * `prefers-reduced-motion`. Não muda nada do conteúdo/classes do card
 * em si — só embrulha.
 */
export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 7;
    const rotateX = (0.5 - py) * 7;
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className={`tilt-card ${className}`}>
      {children}
    </div>
  );
}
