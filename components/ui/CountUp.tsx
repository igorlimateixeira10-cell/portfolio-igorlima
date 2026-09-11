"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Anima um número inteiro subindo de 0 até `value` quando entra na
 * viewport (mesmo IntersectionObserver "dispara uma vez" do
 * `Reveal.tsx`). `value` continua vindo de dados reais (ver About.tsx —
 * contagem de projetos/etapas/tecnologias, nada inventado); isto só
 * anima a APRESENTAÇÃO do número, não o número em si.
 *
 * Seguro por padrão: sem IntersectionObserver, com JS ainda não
 * hidratado, ou com `prefers-reduced-motion`, mostra `value` direto,
 * sem animar — nunca fica em branco nem exibe um número errado.
 */
export function CountUp({ value, durationMs = 900 }: { value: number; durationMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // `setState` aqui dentro é em resposta ao IntersectionObserver
        // disparar (um evento externo), não síncrono no corpo do efeito
        // — é o padrão aceito, mesmo esquema do resto do projeto.
        setDisplay(0);
        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min(1, (now - start) / durationMs);
          // ease-out cúbico — acelera e desacelera suave, não é linear
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return <span ref={ref}>{String(display).padStart(2, "0")}</span>;
}
