"use client";

import { useEffect, useRef } from "react";

/**
 * Vídeo com recorte de verdade (alfa por pixel) — não com máscara CSS nem
 * mix-blend-mode. Nenhum navegador expõe canal alfa de um <video> mp4/H.264
 * comum (é o formato universal; WebM com alfa existe, mas o suporte a
 * transparência real dentro do próprio <video> é inconsistente entre
 * navegadores). Por isso `src` aqui não é um vídeo normal: é um arquivo
 * "empilhado" gerado com ffmpeg — metade de cima é a cor (RGB), metade de
 * baixo é o canal alfa em escala de cinza (branco = opaco, preto =
 * transparente). A cada frame:
 *   1) desenha a metade de cima (cor) num canvas;
 *   2) desenha a metade de baixo (alfa) num canvas auxiliar, fora do DOM;
 *   3) copia o brilho do segundo como canal alfa real do primeiro.
 * O resultado é a estátua recortada de verdade, sem retângulo de vídeo e
 * sem precisar que o fundo do clipe combine com a cor da página.
 */
export function CutoutVideo({
  src,
  poster,
  className,
  style,
}: {
  src: string;
  poster: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const posterEl = posterRef.current;
    if (!canvas || !video || !posterEl) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Com prefers-reduced-motion, o vídeo empilhado nem chega a ser
    // baixado — o <img poster> (sempre no JSX, ver abaixo) fica como está.
    if (reduceMotion) return;

    // willReadFrequently em AMBOS os contextos: o visível também chama
    // getImageData/putImageData a cada frame (ver draw() abaixo). Sem essa
    // dica, o Chrome avisa no console e faz a leitura pela via mais lenta
    // (sync com a GPU) — em telas grandes isso pode travar a thread
    // principal por um frame inteiro bem na hora de um salto de scroll
    // grande, chegando a piscar preto por um instante.
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const alphaCanvas = document.createElement("canvas");
    const alphaCtx = alphaCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx || !alphaCtx) return;

    let rafId = 0;
    let intersecting = false;
    let halfHeight = 0;

    function resize() {
      const vw = video!.videoWidth;
      const vh = video!.videoHeight / 2;
      if (!vw || !vh) return;
      halfHeight = vh;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas!.clientWidth || vw;
      const displayHeight = canvas!.clientHeight || vh;
      canvas!.width = Math.round(displayWidth * dpr);
      canvas!.height = Math.round(displayHeight * dpr);
      alphaCanvas.width = canvas!.width;
      alphaCanvas.height = canvas!.height;
    }

    function draw() {
      rafId = requestAnimationFrame(draw);
      if (video!.paused || video!.ended || !halfHeight) return;
      const w = canvas!.width;
      const h = canvas!.height;
      if (!w || !h) return;
      // Metade de cima (cor) -> canvas visível.
      ctx!.drawImage(video!, 0, 0, video!.videoWidth, halfHeight, 0, 0, w, h);
      const frame = ctx!.getImageData(0, 0, w, h);
      // Metade de baixo (alfa em cinza) -> canvas auxiliar, fora da tela.
      alphaCtx!.drawImage(video!, 0, halfHeight, video!.videoWidth, halfHeight, 0, 0, w, h);
      const alpha = alphaCtx!.getImageData(0, 0, w, h);
      const data = frame.data;
      const adata = alpha.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i + 3] = adata[i];
      }
      ctx!.putImageData(frame, 0, 0);
    }

    function playVideo() {
      if (document.hidden || !intersecting) return;
      video!.play().catch(() => {
        // Autoplay pode falhar em navegadores restritivos — sem problema,
        // o poster continua exibido (evento "playing" abaixo nunca dispara).
      });
    }

    // O poster é só uma pose (uma foto). Enquanto ele fica por baixo do
    // canvas PRA SEMPRE, qualquer pixel que fazia parte da estátua naquela
    // pose mas não faz mais parte no frame atual (a mão que já saiu dali, o
    // notebook que "andou" com o leve zoom do clipe) continua visível por
    // trás — um fantasma da pose do poster sobreposto à pose real. Assim
    // que o vídeo realmente começa a tocar, o poster é escondido e as áreas
    // transparentes do canvas passam a revelar o fundo de verdade da
    // página, sem fantasma.
    function hidePoster() {
      posterEl!.style.opacity = "0";
    }
    video.addEventListener("playing", hidePoster);

    video.addEventListener("loadedmetadata", resize);
    window.addEventListener("resize", resize);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        if (intersecting) playVideo();
        else video!.pause();
      },
      { threshold: 0.15 }
    );
    intersectionObserver.observe(canvas);

    function onVisibilityChange() {
      if (document.hidden) video!.pause();
      else playVideo();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.src = src;
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      video!.removeEventListener("playing", hidePoster);
      video!.removeEventListener("loadedmetadata", resize);
      window.removeEventListener("resize", resize);
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [src]);

  return (
    <div className={className} style={style}>
      {/* Sempre presente: estado inicial (antes do JS/vídeo), fallback de
          prefers-reduced-motion, e o que preenche visualmente os pixels
          transparentes do canvas quando ele está por cima (mesmo recorte,
          já composto sobre a cor de fundo do site). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={posterRef}
        src={poster}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-contain object-top-right transition-opacity duration-300"
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full object-contain object-top-right"
      />
      {/* Fonte de decodificação, nunca mostrado diretamente — display:none
          arrisca pausar a decodificação em alguns navegadores, então ele
          fica com tamanho ~0 e opacidade 0 em vez de sumir do layout. */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="none"
        aria-hidden
        className="absolute h-px w-px opacity-0"
      />
    </div>
  );
}
