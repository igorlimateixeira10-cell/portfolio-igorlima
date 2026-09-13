"use client";

import { useEffect } from "react";

/** Marca uma seção como ativa somente enquanto ela está perto da viewport. */
export function ViewportMotionObserver({
  targetId,
  rootMargin = "0px",
}: {
  targetId: string;
  rootMargin?: string;
}) {
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        target.dataset.motionActive = entry.isIntersecting ? "true" : "false";
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
      delete target.dataset.motionActive;
    };
  }, [rootMargin, targetId]);

  return null;
}
