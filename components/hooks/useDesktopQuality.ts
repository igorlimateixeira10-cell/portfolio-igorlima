"use client";

import { useState } from "react";

/**
 * `true` em telas grandes (`min-width: 1024px`) — usado pra decidir
 * quando vale a pena pagar o palco cinematográfico completo (chão
 * reflexivo + profundidade de campo, ver CinematicStage.tsx): só em
 * quem já tem tela/GPU de desktop. Celular/tablet ganham a versão leve
 * (ou, no caso dos painéis de projeto, o fallback plano — ver
 * Projects.tsx).
 *
 * Lido com `useState(initializer)` em vez de `useSyncExternalStore`
 * porque todo consumidor daqui já é montado só no cliente (via
 * `next/dynamic(ssr:false)`, ver HeroVisual.tsx/Projects.tsx) — sem
 * risco de mismatch de hidratação, e não precisamos reagir a resize
 * (a página não troca de "modo" no meio da visita).
 */
function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function useDesktopQuality(): boolean {
  const [isDesktop] = useState(getSnapshot);
  return isDesktop;
}
