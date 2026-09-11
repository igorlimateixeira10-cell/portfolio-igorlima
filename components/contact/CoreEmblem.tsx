/**
 * Ilustração decorativa do Contato — substitui o `RobotHead.tsx` (busto
 * de robô em SVG) por um emblema no MESMO idioma visual do Núcleo IA da
 * Hero (ver components/three/AiCore.tsx): núcleo facetado + anel
 * orbital + glow azul. Antes, o Contato "falava" uma linguagem visual
 * diferente da Hero (robô vs. núcleo abstrato) — isso fecha o círculo,
 * o site inteiro usa o mesmo vocabulário. `RobotHead.tsx` continua no
 * projeto, só sem uso (ver relatório final).
 *
 * 100% SVG + CSS (sem Three.js aqui — é decorativo, atrás do formulário,
 * não precisa do custo de WebGL pra isso). Três animações, todas
 * desligadas por `prefers-reduced-motion` (mesmas classes/keyframes já
 * usados no Núcleo IA e no `AiCoreFallback.tsx`, reaproveitados aqui de
 * propósito — é o mesmo motivo, não uma cópia divergente):
 * `.aicore-fallback-float` (flutua), `.aicore-fallback-ring-spin`
 * (anel gira), `.aicore-fallback-pulse` (núcleo pulsa).
 */
export function CoreEmblem() {
  return (
    <div className="aicore-fallback-float pointer-events-none relative mx-auto aspect-square w-full max-w-72" aria-hidden>
      <div
        className="absolute inset-8 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(var(--accent-glow),0.4), transparent 70%)" }}
      />

      <svg viewBox="0 0 240 240" className="relative h-full w-full" fill="none">
        <defs>
          <linearGradient id="core-emblem-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-2)" />
            <stop offset="100%" stopColor="var(--accent-ink)" />
          </linearGradient>
        </defs>

        <g className="aicore-fallback-ring-spin" style={{ transformOrigin: "120px 120px" }}>
          <ellipse cx="120" cy="120" rx="104" ry="40" stroke="url(#core-emblem-grad)" strokeWidth="1.2" opacity="0.6" />
        </g>
        <g
          className="aicore-fallback-ring-spin"
          style={{ transformOrigin: "120px 120px", animationDirection: "reverse", animationDuration: "9s" }}
        >
          <ellipse
            cx="120"
            cy="120"
            rx="40"
            ry="104"
            stroke="var(--accent-2)"
            strokeWidth="1"
            opacity="0.4"
            transform="rotate(28 120 120)"
          />
        </g>

        {/* Núcleo facetado — mesma silhueta do icosaedro 3D, achatada em 2D */}
        <path
          d="M120 52 L168 84 L168 156 L120 188 L72 156 L72 84 Z"
          fill="url(#core-emblem-grad)"
          opacity="0.85"
        />
        <path d="M120 52 L168 84 L168 156 L120 188 L72 156 L72 84 Z" stroke="var(--accent-2)" strokeWidth="1.4" />
        <path
          d="M120 52 L120 188 M72 84 L168 156 M168 84 L72 156 M72 84 L168 84 M72 156 L168 156"
          stroke="var(--accent-2)"
          strokeWidth="0.5"
          opacity="0.5"
        />

        {/* Nós emissivos nos vértices — ecoando os "sensores" dos anéis do Núcleo IA 3D */}
        {[
          [120, 52],
          [168, 84],
          [168, 156],
          [120, 188],
          [72, 156],
          [72, 84],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" fill="var(--accent-2)" />
        ))}

        <circle className="aicore-fallback-pulse" cx="120" cy="120" r="9" fill="var(--accent-2)" />
      </svg>
    </div>
  );
}
