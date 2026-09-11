"use client";

import { useSyncExternalStore } from "react";

/**
 * `prefers-reduced-motion`, lido de forma segura para SSR/hidratação
 * (padrão já usado em vários pontos do projeto — AiCoreScene.tsx,
 * TiltCard.tsx, SmoothScroll.tsx). Extraído para cá pra não reescrever a
 * mesma leitura de matchMedia em cada componente novo que precisa dela
 * (ver ProjectPanel3D.tsx).
 */
function subscribe(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getServerSnapshot() {
  return false;
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
