"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const VIDEO_SRC = "/videos/robo-interativo 10.32.41.mp4";
const MAX_RENDER_WIDTH = 540;

export type ChromaKeyRobotVideoHandle = {
  setProgress: (progress: number) => void;
};

/**
 * Desenha o arquivo de vídeo original em canvas e troca somente o fundo verde
 * por transparência. O frame exibido é definido pela timeline de scroll da
 * seção Stack; o vídeo nunca toca sozinho.
 */
export const ChromaKeyRobotVideo = forwardRef<ChromaKeyRobotVideoHandle>(
  function ChromaKeyRobotVideo(_, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const hologramsRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef(0);
    const syncFrameRef = useRef<() => void>(() => {});
    const syncHologramsRef = useRef<(progress: number) => void>(() => {});
    const [shouldLoad, setShouldLoad] = useState(false);

    useImperativeHandle(ref, () => ({
      setProgress(progress) {
        progressRef.current = Math.max(0, Math.min(1, progress));
        syncFrameRef.current();
        syncHologramsRef.current(progressRef.current);
      },
    }), []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setShouldLoad(true);
        },
        { rootMargin: "300px 0px" },
      );

      observer.observe(container);
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      const holograms = hologramsRef.current;
      if (!holograms) return;

      const updateHolograms = (progress: number) => {
        holograms.querySelectorAll<HTMLElement>("[data-holo-start]").forEach((element) => {
          const start = Number(element.dataset.holoStart);
          const duration = Number(element.dataset.holoDuration ?? 0.16);
          const direction = Number(element.dataset.holoDirection ?? 1);
          const local = Math.max(0, Math.min(1, (progress - start) / duration));

          element.style.opacity = String(local);
          element.style.transform = `translate3d(${(1 - local) * direction * 14}px, ${(1 - local) * 10}px, 0) scale(${0.82 + local * 0.18})`;
        });

        holograms.querySelectorAll<SVGPathElement>("[data-holo-line]").forEach((line) => {
          const start = Number(line.dataset.holoLine);
          const local = Math.max(0, Math.min(1, (progress - start) / 0.18));
          line.style.opacity = String(local);
          line.style.strokeDashoffset = String((1 - local) * 100);
        });
      };

      syncHologramsRef.current = updateHolograms;
      updateHolograms(progressRef.current);

      return () => {
        syncHologramsRef.current = () => {};
      };
    }, []);

    useEffect(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !shouldLoad) return;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;

      const drawFrame = () => {
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !canvas.width) return;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = image.data;

        for (let index = 0; index < pixels.length; index += 4) {
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const greenDifference = green - (red + blue) / 2;

          if (green > 56 && greenDifference > 24) {
            const transparency = Math.min(1, (greenDifference - 24) / 34);
            pixels[index + 3] = Math.round(255 * (1 - transparency));
          }
        }

        context.putImageData(image, 0, 0);
      };

      const resizeCanvas = () => {
        const width = Math.min(MAX_RENDER_WIDTH, video.videoWidth);
        if (!width || !video.videoHeight) return;
        canvas.width = width;
        canvas.height = Math.round((width * video.videoHeight) / video.videoWidth);
      };

      const syncFrame = () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;
        const targetTime = progressRef.current * Math.max(0, video.duration - 0.001);
        if (Math.abs(video.currentTime - targetTime) > 0.01) video.currentTime = targetTime;
        else drawFrame();
      };

      syncFrameRef.current = syncFrame;

      const onLoadedMetadata = () => {
        resizeCanvas();
        syncFrame();
      };

      video.addEventListener("loadedmetadata", onLoadedMetadata);
      video.addEventListener("loadeddata", syncFrame);
      video.addEventListener("seeked", drawFrame);
      video.pause();
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) onLoadedMetadata();

      return () => {
        syncFrameRef.current = () => {};
        video.pause();
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        video.removeEventListener("loadeddata", syncFrame);
        video.removeEventListener("seeked", drawFrame);
      };
    }, [shouldLoad]);

    return (
      <div ref={containerRef} className="chroma-key-robot" aria-hidden="true">
        <video
          ref={videoRef}
          className="chroma-key-robot__source"
          src={shouldLoad ? VIDEO_SRC : undefined}
          muted
          playsInline
          preload="metadata"
        />
        <div ref={hologramsRef} className="robot-hud">
          <div className="robot-holograms robot-holograms--back">
            <svg viewBox="0 0 100 177.78" preserveAspectRatio="none" aria-hidden="true">
              <path data-holo-line="0.3" pathLength="100" d="M 4 91 L 25 91 L 39 74 L 51 81" />
              <path data-holo-line="0.42" pathLength="100" d="M 39 74 L 47 52 L 26 44" />
              <path data-holo-line="0.57" pathLength="100" d="M 52 81 L 68 72 L 94 72" />
              <path data-holo-line="0.68" pathLength="100" d="M 18 113 L 40 103 L 64 111 L 89 121" />
              <path data-holo-line="0.78" pathLength="100" d="M 72 111 L 84 96 L 96 96" />
            </svg>
            <i data-holo-start="0.36" data-holo-duration="0.1" className="robot-hologram-node robot-hologram-node--one" />
            <i data-holo-start="0.49" data-holo-duration="0.1" className="robot-hologram-node robot-hologram-node--two" />
            <i data-holo-start="0.61" data-holo-duration="0.1" className="robot-hologram-node robot-hologram-node--three" />
            <i data-holo-start="0.72" data-holo-duration="0.1" className="robot-hologram-node robot-hologram-node--four" />
            <i data-holo-start="0.82" data-holo-duration="0.1" className="robot-hologram-node robot-hologram-node--five" />
          </div>

          <canvas ref={canvasRef} className="chroma-key-robot__canvas" />

          <div className="robot-holograms robot-holograms--front">
            <div data-holo-start="0.32" data-holo-duration="0.28" data-holo-direction="0" className="robot-energy-core">
              <i className="robot-energy-core__ring robot-energy-core__ring--outer" />
              <i className="robot-energy-core__ring robot-energy-core__ring--inner" />
              <i className="robot-energy-core__spark robot-energy-core__spark--one" />
              <i className="robot-energy-core__spark robot-energy-core__spark--two" />
              <i className="robot-energy-core__spark robot-energy-core__spark--three" />
            </div>
            <div data-holo-start="0.42" data-holo-direction="-1" className="robot-hologram robot-hologram--system">
              <strong>{"// SYSTEM"}</strong>
              <span><i /> BUILD READY</span>
              <span><i /> DEPLOY</span>
              <span><i /> API.CONNECTED</span>
              <span><i /> STATUS 200</span>
              <em />
            </div>
            <div data-holo-start="0.56" data-holo-direction="1" className="robot-hologram robot-hologram--code">
              <code>const app = new Project()</code>
              <code>app.build()</code>
              <code>app.deploy()</code>
              <b>✓ Success</b>
              <div className="robot-hologram-chart"><i /><i /><i /><i /></div>
            </div>
            <div data-holo-start="0.67" data-holo-direction="-1" className="robot-hologram robot-hologram--sync">
              <div><strong>01</strong><small>SYNC<br />LIVE</small></div>
              <span className="robot-hologram-radar"><i /><i /></span>
              <em />
            </div>
            <div data-holo-start="0.79" data-holo-direction="1" className="robot-hologram robot-hologram--status">
              <strong>AI</strong>
              <span><i /> WEB</span>
              <span><i /> MOBILE</span>
              <span><i /> SCALABLE</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
