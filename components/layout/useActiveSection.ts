"use client";

import { useEffect, useState } from "react";

/**
 * Descobre qual `id` de section está mais visível na tela agora, pra o
 * Header destacar o link certo na pílula de navegação — hoje o link
 * "Início" ficava sempre marcado, mesmo rolando até Contato. Usa
 * IntersectionObserver (mesma técnica de sempre no projeto, ver
 * Reveal.tsx) observando todas as sections de uma vez, marcando a que
 * tiver maior `intersectionRatio` no momento.
 *
 * `ids[0]` (Início/Hero) é o valor inicial — antes de rolar, ou se o
 * observer nunca disparar (navegador sem suporte), o link de casa
 * continua marcado, que já era o comportamento de antes.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        // Se nada está visível o suficiente (ex.: entre duas sections
        // durante um scroll rápido), não mexe no estado — mantém a
        // última marcação em vez de "piscar" pra nenhuma.
        if (bestId && bestRatio > 0.1) setActive(bestId);
      },
      { threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
    // Depende do CONTEÚDO de `ids` (a string juntada), não da referência
    // do array — o Header cria esse array de novo a cada render, então
    // usar `ids` direto aqui re-criaria o observer toda hora à toa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return active;
}
