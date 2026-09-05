"use client";

import { useEffect, useRef } from "react";
import { CutoutVideo } from "@/components/hero/CutoutVideo";

const HERO_VIDEO_SRC = "/projects/videos/estatua-alpha.mp4";
const HERO_POSTER_SRC = "/projects/estatua-poster.png";

/**
 * Papel de parede do site inteiro — `position: fixed`, renderizado UMA
 * VEZ em app/[lang]/page.tsx, antes do Header/main. Não é filho de
 * nenhuma section: assim ele nunca fica preso a um `overflow-hidden` ou
 * `isolation` de section específica (ver histórico disso em Hero.tsx),
 * e o mesmo `z-index: -1` funciona pra qualquer seção da página, sem
 * cada uma precisar declarar nada especial — só não podem ter um fundo
 * 100% opaco (ver comentário nas sections sobre a opacidade dos `bg-*`).
 *
 * Ao contrário da versão anterior (que só existia dentro do Hero e se
 * escondia ao rolar pra fora dele), este NUNCA se esconde — a pedida
 * agora é exatamente o oposto: o cenário fica parado na viewport o
 * tempo todo, enquanto Projetos/Serviços/Sobre/Contato sobem por cima
 * dele. Não tem parallax de mouse nem de scroll em nada aqui.
 *
 * Camadas:
 * 1) Glow ambiente verde — estático.
 * 2) "Ilhas" desfocadas (azul/roxo/verde) + linhas de energia (SVG,
 *    stroke-dashoffset) + o molho de 5 linhas de onda + partículas
 *    (Canvas2D) — todas com movimento contínuo, independente do
 *    mouse/scroll (mesmas classes de sempre: .hero-blob,
 *    .hero-energy-line, .hero-wave-group, ver globals.css).
 * 3) A estátua (recorte real por canal alfa — CutoutVideo). Fixa na
 *    mesma posição da tela o tempo todo; como o canvas dela nunca sai
 *    da viewport agora, o autoplay dela (IntersectionObserver interno,
 *    inalterado) mantém o vídeo tocando o tempo todo — é o "vivo" pedido.
 * 4) Glow cinematográfico atrás da estátua, integrando a iluminação dela
 *    com o resto do cenário.
 *
 * Performance: as partículas (Canvas2D) só pausam quando a aba fica
 * oculta — não há mais "esconder ao rolar", já que agora o cenário deve
 * ficar visível o tempo todo. prefers-reduced-motion desliga o canvas
 * inteiro; as animações CSS dos blobs/linhas já ficam congeladas pela
 * regra global em globals.css.
 */
export function SiteWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLORS = ["72,230,50", "96,150,255", "168,110,255", "255,255,255"];

    type Particle = {
      x: number;
      y: number;
      r: number;
      speed: number;
      drift: number;
      baseAlpha: number;
      twinkleSpeed: number;
      twinklePhase: number;
      color: string;
    };

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let running = false;

    function particleCount() {
      if (width < 640) return 16;
      if (width < 1024) return 30;
      return 46;
    }

    function seed() {
      const count = particleCount();
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.6,
        speed: Math.random() * 0.12 + 0.03,
        drift: (Math.random() - 0.5) * 0.06,
        baseAlpha: Math.random() * 0.35 + 0.15,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw(time: number) {
      if (!running) return;
      rafId = requestAnimationFrame(draw);
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -4) {
          p.y = height + 4;
          p.x = Math.random() * width;
        }
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;

        const twinkle = 0.5 + 0.5 * Math.sin(time * p.twinkleSpeed + p.twinklePhase);
        const alpha = p.baseAlpha * (0.5 + 0.5 * twinkle);
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${p.color},${alpha.toFixed(3)})`;
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(draw);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    resize();
    window.addEventListener("resize", resize);

    function onVisibilityChange() {
      if (document.hidden) stop();
      else start();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      {/* Camada 1: glow ambiente verde, sutil e estático. */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 74% 42%, rgba(72,230,50,0.16), transparent 62%)",
        }}
      />

      {/* Camada 2: ilhas grandes e desfocadas — azul, roxo, verde. A
          terceira (menor contribuição visual) some em telas pequenas. */}
      <div
        className="hero-blob"
        style={{
          left: "-10%",
          top: "6%",
          width: "34rem",
          height: "34rem",
          background: "radial-gradient(circle, rgba(96,150,255,0.20), transparent 70%)",
          animationDuration: "32s",
        }}
      />
      <div
        className="hero-blob"
        style={{
          right: "2%",
          top: "-8%",
          width: "30rem",
          height: "30rem",
          background: "radial-gradient(circle, rgba(168,110,255,0.18), transparent 70%)",
          animationDuration: "40s",
          animationDelay: "-12s",
        }}
      />
      <div
        className="hero-blob hidden md:block"
        style={{
          left: "22%",
          bottom: "-14%",
          width: "26rem",
          height: "26rem",
          background: "radial-gradient(circle, rgba(72,230,50,0.13), transparent 70%)",
          animationDuration: "36s",
          animationDelay: "-6s",
        }}
      />

      {/* Camada 2: linhas de energia fluindo (stroke-dasharray animado)
          + o molho de 5 linhas de onda coladas, balançando em grupo. */}
      <svg
        className="absolute inset-0 h-full w-full opacity-70"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="wallpaper-energy-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(96,150,255,0)" />
            <stop offset="50%" stopColor="rgba(96,150,255,0.5)" />
            <stop offset="100%" stopColor="rgba(96,150,255,0)" />
          </linearGradient>
          <linearGradient id="wallpaper-energy-b" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(168,110,255,0)" />
            <stop offset="50%" stopColor="rgba(168,110,255,0.45)" />
            <stop offset="100%" stopColor="rgba(168,110,255,0)" />
          </linearGradient>
          <linearGradient id="wallpaper-energy-c" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(72,230,50,0)" />
            <stop offset="50%" stopColor="rgba(72,230,50,0.4)" />
            <stop offset="100%" stopColor="rgba(72,230,50,0)" />
          </linearGradient>
        </defs>
        <path
          className="hero-energy-line"
          d="M-100 180 C 300 100, 700 260, 1100 140 S 1600 120, 1700 200"
          stroke="url(#wallpaper-energy-a)"
          strokeWidth="2"
          strokeDasharray="10 22"
          style={{ animationDuration: "9s" }}
        />
        <path
          className="hero-energy-line hidden sm:block"
          d="M-100 640 C 320 740, 760 540, 1120 660 S 1560 720, 1700 620"
          stroke="url(#wallpaper-energy-b)"
          strokeWidth="1.5"
          strokeDasharray="8 20"
          style={{ animationDuration: "12s", animationDelay: "-4s" }}
        />

        <g className="hero-wave-group" style={{ animationDuration: "7s" }}>
          <path
            className="hero-energy-line"
            d="M-100 444 Q 80 404, 260 444 T 620 444 T 980 444 T 1340 444 T 1700 444"
            stroke="url(#wallpaper-energy-a)"
            strokeWidth="1.3"
            strokeDasharray="7 16"
            style={{ animationDuration: "8s" }}
          />
          <path
            className="hero-energy-line hidden sm:block"
            d="M-100 452 Q 80 412, 260 452 T 620 452 T 980 452 T 1340 452 T 1700 452"
            stroke="url(#wallpaper-energy-b)"
            strokeWidth="1.3"
            strokeDasharray="7 16"
            style={{ animationDuration: "9.5s", animationDelay: "-2s" }}
          />
          <path
            className="hero-energy-line"
            d="M-100 460 Q 80 420, 260 460 T 620 460 T 980 460 T 1340 460 T 1700 460"
            stroke="url(#wallpaper-energy-c)"
            strokeWidth="1.4"
            strokeDasharray="7 16"
            style={{ animationDuration: "11s", animationDelay: "-5s" }}
          />
          <path
            className="hero-energy-line hidden md:block"
            d="M-100 468 Q 80 428, 260 468 T 620 468 T 980 468 T 1340 468 T 1700 468"
            stroke="url(#wallpaper-energy-a)"
            strokeWidth="1.3"
            strokeDasharray="7 16"
            style={{ animationDuration: "10s", animationDelay: "-7s" }}
          />
          <path
            className="hero-energy-line hidden sm:block"
            d="M-100 476 Q 80 436, 260 476 T 620 476 T 980 476 T 1340 476 T 1700 476"
            stroke="url(#wallpaper-energy-b)"
            strokeWidth="1.3"
            strokeDasharray="7 16"
            style={{ animationDuration: "12.5s", animationDelay: "-3s" }}
          />
        </g>
      </svg>

      {/* Camada 2: partículas pequenas, Canvas2D. */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Camada 4: glow cinematográfico atrás da estátua — azul/roxo/verde,
          integrando a iluminação dela com o resto do cenário. */}
      <div
        className="absolute inset-y-0 right-[-10%] w-[70%] lg:right-[-8%] lg:w-[54%]"
        style={{
          background:
            "radial-gradient(60% 55% at 62% 46%, rgba(72,230,50,0.30), transparent 68%), radial-gradient(45% 50% at 82% 30%, rgba(96,150,255,0.28), transparent 70%), radial-gradient(45% 55% at 70% 74%, rgba(168,110,255,0.22), transparent 70%)",
        }}
      />

      {/* Camada 3: a estátua. Mesma lógica responsiva de sempre —
          coluna estreita ao lado a partir do `lg`; abaixo disso, mais
          larga e discreta (cada section cuida da própria legibilidade
          por cima, ver comentário de opacidade nas sections). */}
      <div className="absolute inset-y-0 right-[-12%] flex w-[86%] items-center lg:right-[-10%] lg:w-[64%]">
        <CutoutVideo
          src={HERO_VIDEO_SRC}
          poster={HERO_POSTER_SRC}
          className="relative aspect-video w-full"
          style={{ filter: "brightness(1.14) contrast(1.16) saturate(1.35)" }}
        />
      </div>
    </div>
  );
}
