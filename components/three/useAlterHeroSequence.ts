"use client";

import { useEffect, useState } from "react";
import { getActiveHeroSequence, type AlterAnimationState } from "@/components/three/alterAnimations";

// Computado uma vez (dados estáticos, não muda em runtime) — evita criar
// um array novo a cada render, o que faria o efeito abaixo re-agendar o
// timer sem necessidade.
const ACTIVE_SEQUENCE = getActiveHeroSequence();

/**
 * Avança automaticamente pelos passos de ALTER_HERO_SEQUENCE (ver
 * alterAnimations.ts), devolvendo o estado atual pra passar direto pro
 * `<AlterCharacter state={...} />` — o crossfade em si já existe lá
 * (fadeIn/fadeOut 0.3s no useEffect de `state`), este hook só decide
 * QUANDO trocar.
 *
 * Com `prefers-reduced-motion`, não cicla — fica parado no primeiro
 * passo (hoje, "typing", que já é uma animação contínua/estável, não um
 * gesto brusco).
 *
 * Se só existir 1 passo ativo (é o caso hoje: só "typing" tem arquivo),
 * não agenda troca nenhuma — fica nele o tempo todo.
 */
export function useAlterHeroSequence(): AlterAnimationState {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (ACTIVE_SEQUENCE.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const current = ACTIVE_SEQUENCE[index % ACTIVE_SEQUENCE.length];
    const timer = window.setTimeout(() => {
      setIndex((i) => (i + 1) % ACTIVE_SEQUENCE.length);
    }, current.holdSeconds * 1000);

    return () => window.clearTimeout(timer);
  }, [index]);

  if (ACTIVE_SEQUENCE.length === 0) return "typing"; // nunca deve ocorrer — "typing" sempre tem clipe
  return ACTIVE_SEQUENCE[index % ACTIVE_SEQUENCE.length].state;
}
