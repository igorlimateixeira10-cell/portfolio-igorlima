"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ROBOT_HERO_SEQUENCE, type RobotAnimationState } from "@/components/three/robotAnimations";

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
 * Avança automaticamente pelos passos de ROBOT_HERO_SEQUENCE (ver
 * robotAnimations.ts) — devolve o estado atual pra passar direto pro
 * `<RobotCharacter state={...} />`, que cuida do crossfade em si. Este
 * hook só decide QUANDO trocar. Mesmo padrão do useAlterHeroSequence.
 *
 * Com `prefers-reduced-motion`, não cicla — fica parado em "idle" (a
 * postura neutra/em pé), sem gestos automáticos.
 */
export function useRobotHeroSequence(): RobotAnimationState {
  const [index, setIndex] = useState(0);
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (reduceMotion) return;

    const current = ROBOT_HERO_SEQUENCE[index % ROBOT_HERO_SEQUENCE.length];
    const timer = window.setTimeout(() => {
      setIndex((i) => (i + 1) % ROBOT_HERO_SEQUENCE.length);
    }, current.holdSeconds * 1000);

    return () => window.clearTimeout(timer);
  }, [index, reduceMotion]);

  if (reduceMotion) return "idle";
  return ROBOT_HERO_SEQUENCE[index % ROBOT_HERO_SEQUENCE.length].state;
}
