"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Scroll suave com inércia (referência: `html.lenis` do DevClub — eles usam
 * a mesma lib). Só troca a FÍSICA da rolagem; não substitui nada do resto
 * do site (Reveal, o brilho do SiteBackground, etc. continuam funcionando
 * do mesmo jeito, só que respondendo a uma posição de scroll "suavizada"
 * em vez do scroll bruto do navegador).
 *
 * Sem elemento visual — monta uma vez no layout raiz (dentro do <body>,
 * ver app/[lang]/layout.tsx) e cuida só do loop de animação.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Com prefers-reduced-motion, nem instancia — o scroll nativo
    // (scroll-behavior: smooth, já desligado nesse caso via globals.css)
    // continua sendo o comportamento real.
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Os links de âncora do site (Header, Footer, CTAs do Hero — todos
    // `href="#id"`) continuam funcionando: em vez de deixar o navegador
    // pular direto (o que brigaria com o Lenis, que já está "segurando"
    // a posição de scroll), a gente intercepta o clique e pede pro Lenis
    // animar até lá. Sem offset manual — o próprio Lenis já lê o
    // `scroll-margin-top` do CSS (globals.css, compensa a altura do
    // header fixed) igual o scroll nativo faria; somar um offset aqui
    // descontaria a folga em dobro.
    function onClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement | null)?.closest('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement);
    }
    document.addEventListener("click", onClick);

    // Mesma ideia do resto do site (CoreEmblem, SiteBackground, etc.):
    // pausa o loop com a aba oculta, sem custo de rAF rodando à toa em
    // background.
    function onVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(raf);
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
