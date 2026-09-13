"use client";

import { useEffect, useState } from "react";

/** Destaca no menu a seção mais visível durante a rolagem normal. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target.id, entry.intersectionRatio);
        let best = ids[0];
        let ratio = 0;
        for (const [id, value] of ratios) {
          if (value > ratio) {
            best = id;
            ratio = value;
          }
        }
        if (ratio > 0.1) setActive(best);
      },
      { threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
