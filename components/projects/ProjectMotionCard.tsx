"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Mantém a flutuação existente, mas a pausa quando o card não está visível. */
export function ProjectMotionCard({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry.isIntersecting),
      { rootMargin: "220px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      data-motion-active={isNearViewport ? "true" : "false"}
      className={className}
    >
      {children}
    </article>
  );
}
