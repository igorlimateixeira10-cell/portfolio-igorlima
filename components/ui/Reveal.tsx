"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Reveal ao entrar na viewport, com IntersectionObserver — dispara uma
// única vez e permanece visível depois (rolar para cima de novo não faz o
// conteúdo sumir). Continua "seguro por padrão": enquanto o JS não
// hidratou, ou se o navegador não suporta IntersectionObserver, ou se o
// usuário prefere menos movimento, o conteúdo já nasce visível — nunca fica
// em branco.
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const [state, setState] = useState<"idle" | "pending" | "visible">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Já visível na tela no momento em que o JS carrega (ex.: conteúdo
    // acima da dobra) — não há por que animar, só mostra direto.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      return;
    }

    setState("pending");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const stateClass = state === "pending" ? "reveal--pending" : state === "visible" ? "reveal--visible" : "";

  return (
    <Tag
      ref={ref}
      className={`reveal ${stateClass} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
