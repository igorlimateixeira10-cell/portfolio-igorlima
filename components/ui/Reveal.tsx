import type { ReactNode } from "react";

// Animação de entrada em CSS puro (ver .reveal em globals.css) — não precisa
// de "use client", de estado ou de observer: funciona mesmo se o JavaScript
// demorar para hidratar a página.
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
  return (
    <Tag className={`reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
