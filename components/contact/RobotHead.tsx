// Ilustração decorativa (referência: a cabeça de IA/robô ao lado do
// formulário de contato do mockup enviado). 100% SVG desenhado à mão —
// silhueta de perfil "low-poly" (linhas retas, sem curvas orgânicas),
// combina com a linguagem técnica/wireframe do resto do site. Puramente
// decorativo — sem nenhuma alegação por trás, só ambientação visual.
//
// Três animações independentes (todas em globals.css, todas desligadas
// por `prefers-reduced-motion`):
// 1) .robot-float — a peça inteira flutua devagar (translateY).
// 2) .robot-circuit-flow — as linhas de circuito "correm" via
//    stroke-dashoffset, como um pulso de sinal percorrendo o traço.
// 3) .robot-ring-spin — o anel ao redor do "olho" gira continuamente.
// .robot-eye (já existia) continua pulsando.
export function RobotHead() {
  return (
    <div className="robot-float pointer-events-none relative mx-auto aspect-3/4 w-full max-w-72" aria-hidden>
      <div
        className="absolute inset-8 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(var(--accent-glow),0.4), transparent 70%)" }}
      />

      <svg viewBox="0 0 240 320" className="relative h-full w-full" fill="none">
        <defs>
          <linearGradient id="robot-stroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-2)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>

        {/* Silhueta — perfil de cabeça/busto, facetado. */}
        <path
          d="M100 24 L146 34 L168 66 L176 100 L172 128 L184 144 L170 158
             L160 178 L140 196 L118 204 L112 232 L118 260 L100 268
             L96 300 L150 312 L184 296 L188 258
             L150 250 L142 220 L150 196 L128 176 L112 150
             L96 122 L92 84 L100 24 Z"
          stroke="url(#robot-stroke)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* Linhas de circuito internas — o traço "corre" (stroke-dashoffset)
            como um pulso de sinal, mesmos nós (pontos) fixos nas pontas. */}
        <g className="robot-circuit-flow" stroke="var(--accent-2)" strokeWidth="1" opacity="0.8">
          <path d="M112 90 h28 M140 90 v20" />
          <path d="M108 140 h24 M132 140 l14 -14" />
          <path d="M120 190 h20 M140 190 v18" />
        </g>
        <g fill="var(--accent-2)">
          <circle cx="112" cy="90" r="2" />
          <circle cx="140" cy="110" r="2" />
          <circle cx="108" cy="140" r="2" />
          <circle cx="146" cy="126" r="2" />
          <circle cx="120" cy="190" r="2" />
          <circle cx="140" cy="208" r="2" />
        </g>

        {/* "Olho"/núcleo — pulsa devagar; o anel ao redor gira sem parar. */}
        <circle className="robot-eye" cx="150" cy="96" r="7" fill="var(--accent)" />
        <circle
          className="robot-ring-spin"
          cx="150"
          cy="96"
          r="13"
          stroke="var(--accent)"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
