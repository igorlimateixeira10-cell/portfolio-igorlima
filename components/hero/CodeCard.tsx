"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Substitui o "bolão" de anéis genéricos por algo que faz sentido pra um
// portfólio de dev: um cartão de editor de código de verdade — com efeito
// de digitação e reagindo ao mouse (inclinação 3D + reflexo seguindo o
// cursor). O conteúdo é real (mesmos dados do resto do site: nome, cargo,
// stack), não um trecho decorativo genérico.
const CODE_LINES: { tokens: { text: string; cls?: string }[] }[] = [
  { tokens: [{ text: "const", cls: "text-accent" }, { text: " developer = {" }] },
  { tokens: [{ text: "  name", cls: "text-accent-2" }, { text: ": " }, { text: '"Igor Lima Teixeira"', cls: "text-ink" }, { text: "," }] },
  { tokens: [{ text: "  role", cls: "text-accent-2" }, { text: ": " }, { text: '"Front-End Developer"', cls: "text-ink" }, { text: "," }] },
  { tokens: [{ text: "  stack", cls: "text-accent-2" }, { text: ": [" }, { text: '"React"', cls: "text-ink" }, { text: ", " }, { text: '"Next.js"', cls: "text-ink" }, { text: ", " }, { text: '"TypeScript"', cls: "text-ink" }, { text: "]," }] },
  { tokens: [{ text: "  available", cls: "text-accent-2" }, { text: ": " }, { text: "true", cls: "text-accent" }, { text: "," }] },
  { tokens: [{ text: "};" }] },
];

const FULL_TEXT_LENGTH = CODE_LINES.reduce(
  (sum, line) => sum + line.tokens.reduce((s, t) => s + t.text.length, 0),
  0
);

// Corta o "código" no caractere `totalChars` — função pura, sem tocar em
// nada do estado do componente (a mutação de `budget` é só um contador
// local à própria chamada, não sobrevive nem é compartilhada entre
// renders). Isso evita mexer numa variável mutável no meio do JSX.
function sliceCodeLines(totalChars: number) {
  let budget = totalChars;
  return CODE_LINES.map((line) => ({
    tokens: line.tokens.map((token) => {
      if (budget <= 0) return { ...token, text: "" };
      const shown = token.text.slice(0, budget);
      budget -= token.text.length;
      return { ...token, text: shown };
    }),
  }));
}

// prefers-reduced-motion via useSyncExternalStore — em vez de
// useState+useEffect: funciona certo com SSR (o snapshot do servidor é
// sempre "false", já que o servidor não tem `window`) sem precisar de um
// efeito só pra copiar um valor de fora pro estado do React.
function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

export function CodeCard() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [typedCount, setTypedCount] = useState(0);
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Digita uma vez ao montar. Com prefers-reduced-motion o efeito nem
  // agenda o loop — o render usa FULL_TEXT_LENGTH direto (ver `charCount`
  // abaixo), texto já nasce completo.
  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    let start = 0;
    const CHARS_PER_SECOND = 26;
    function tick(time: number) {
      if (!start) start = time;
      const elapsed = (time - start) / 1000;
      const next = Math.min(FULL_TEXT_LENGTH, Math.floor(elapsed * CHARS_PER_SECOND));
      setTypedCount(next);
      if (next < FULL_TEXT_LENGTH) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  const charCount = reduceMotion ? FULL_TEXT_LENGTH : typedCount;
  const lines = sliceCodeLines(charCount);

  // Inclinação 3D + reflexo seguindo o cursor — manipulado direto via
  // ref (sem re-render a cada movimento do mouse) por performance.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduceMotion) return;

    function onMove(event: MouseEvent) {
      const rect = stage!.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 14;
      const rotateX = (0.5 - py) * 14;
      stage!.style.transition = "transform 0.12s ease-out";
      stage!.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      stage!.style.setProperty("--spot-x", `${px * 100}%`);
      stage!.style.setProperty("--spot-y", `${py * 100}%`);
      stage!.style.setProperty("--spot-o", "1");
    }
    function onLeave() {
      stage!.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
      stage!.style.transform = "rotateX(0deg) rotateY(0deg)";
      stage!.style.setProperty("--spot-o", "0");
    }
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, [reduceMotion]);

  return (
    <div className="code-card-perspective hidden lg:block" aria-hidden>
      <div ref={stageRef} className="code-card relative mx-auto max-w-sm">
        <div className="tech-card relative overflow-hidden rounded-2xl">
          {/* Barra da janela — mesma pele do BrowserFrame usado nos cases
              reais de projeto, pra manter a linguagem visual do site. */}
          <div className="flex items-center gap-1.5 border-b border-line bg-surface px-3.5 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="ml-2 font-mono text-[10px] text-ink-faint">developer.ts</span>
          </div>

          <pre className="px-5 py-6 font-mono text-[13px] leading-relaxed">
            <code>
              {lines.map((line, i) => (
                <span key={i} className="block">
                  {line.tokens.map((token, j) => (
                    <span key={j} className={token.cls ?? "text-ink-soft"}>
                      {token.text}
                    </span>
                  ))}
                </span>
              ))}
              <span className="code-card__cursor" />
            </code>
          </pre>

          {/* Reflexo seguindo o cursor — por cima do conteúdo (por isso
              vem depois no DOM), com blend-mode pra clarear em vez de
              esconder o código embaixo. */}
          <div className="code-card__spotlight pointer-events-none absolute inset-0" />
        </div>
      </div>
    </div>
  );
}
