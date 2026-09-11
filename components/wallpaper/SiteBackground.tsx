"use client";

// Fundo do site inteiro — v5: os dois glows estáticos continuam (mesma
// base de sempre), e ganham uma rede de partículas leve por cima
// (canvas 2D, NÃO WebGL/Three — muito mais barato, faz sentido pra algo
// que fica atrás de TODA a página, não só da Hero).
//
// A v4 tinha virado Server Component (zero JS) de propósito, depois de
// uma versão anterior mais pesada (vídeo) ter sido removida por
// performance — essa preocupação continua valendo aqui: por isso o
// canvas é 2D simples (não WebGL), o número de partículas é pequeno
// (~46), o desenho pausa com a aba oculta, e a rede nem é criada se o
// visitante pedir `prefers-reduced-motion` (nesse caso, só os glows +
// overlay de sempre, sem nenhum canvas/JS de animação).
import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 46;
const MAX_LINK_DISTANCE = 150;
const PARTICLE_COLOR = "29, 78, 216"; // mesmo --accent-glow do resto do site

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let rafId = 0;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
      }));
    }

    function step() {
      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Reaparece do outro lado em vez de quicar — deriva contínua,
        // sem "parede" perceptível.
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > MAX_LINK_DISTANCE) continue;
          const opacity = (1 - dist / MAX_LINK_DISTANCE) * 0.16;
          ctx!.strokeStyle = `rgba(${PARTICLE_COLOR}, ${opacity})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }

      for (const p of particles) {
        ctx!.fillStyle = `rgba(${PARTICLE_COLOR}, 0.45)`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafId = requestAnimationFrame(step);
    }

    resize();
    seed();
    rafId = requestAnimationFrame(step);

    function onResize() {
      resize();
    }
    window.addEventListener("resize", onResize);

    function onVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(step);
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div aria-hidden className="site-bg fixed inset-0 -z-10 overflow-hidden bg-bg">
      <div className="site-bg__glow site-bg__glow--a absolute" />
      <div className="site-bg__glow site-bg__glow--b absolute" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="site-bg__overlay absolute inset-0" />
    </div>
  );
}
