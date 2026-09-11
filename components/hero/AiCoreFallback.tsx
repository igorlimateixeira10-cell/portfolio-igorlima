/**
 * Substituto leve do Núcleo IA pra conexão ruim/"economia de dados"
 * (ver HeroVisual.tsx, que decide qual dos dois renderizar). Em vez de
 * baixar ~1,4MB de three.js/R3F/drei só pra montar a cena 3D, desenha o
 * mesmo conceito visual (núcleo facetado + anéis + brilho) em SVG puro
 * — zero requisição de rede, mesma identidade azul/ciano do resto do
 * site. As animações reaproveitam a mesma técnica (flutuar + girar) já
 * usada no RobotHead.tsx do Contact, com classes próprias (ver
 * globals.css) pra não depender de nada ligado ao robô antigo.
 */
export function AiCoreFallback() {
  return (
    <div className="aicore-perspective w-full lg:w-auto">
      <div className="aicore-stage relative mx-auto flex aspect-square w-full max-w-xs items-center justify-center sm:max-w-sm md:max-w-md lg:mx-0 lg:aspect-auto lg:h-[62vh] lg:max-h-[640px] lg:min-h-[400px] lg:w-[36vw] lg:min-w-[360px] lg:max-w-[560px]">
        <div className="aicore-glow" aria-hidden />
        <div className="aicore-fallback-float relative aspect-square w-2/3 max-w-64" aria-hidden>
          <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
            <defs>
              <linearGradient id="aicore-fallback-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--accent-2)" />
                <stop offset="100%" stopColor="var(--accent-ink)" />
              </linearGradient>
            </defs>

            <g className="aicore-fallback-ring-spin" style={{ transformOrigin: "100px 100px" }}>
              <ellipse cx="100" cy="100" rx="88" ry="34" stroke="url(#aicore-fallback-grad)" strokeWidth="1.2" opacity="0.7" />
            </g>
            <g
              className="aicore-fallback-ring-spin"
              style={{ transformOrigin: "100px 100px", animationDirection: "reverse", animationDuration: "8s" }}
            >
              <ellipse
                cx="100"
                cy="100"
                rx="34"
                ry="88"
                stroke="var(--accent-2)"
                strokeWidth="1"
                opacity="0.5"
                transform="rotate(30 100 100)"
              />
            </g>

            {/* núcleo facetado — mesmo espírito do icosaedro 3D, achatado em 2D */}
            <path
              d="M100 46 L142 74 L142 126 L100 154 L58 126 L58 74 Z"
              fill="url(#aicore-fallback-grad)"
              opacity="0.9"
            />
            <path
              d="M100 46 L142 74 L142 126 L100 154 L58 126 L58 74 Z"
              stroke="var(--accent-2)"
              strokeWidth="1.4"
            />
            <path d="M100 46 L100 154 M58 74 L142 126 M142 74 L58 126" stroke="var(--accent-2)" strokeWidth="0.6" opacity="0.6" />

            <circle className="aicore-fallback-pulse" cx="100" cy="100" r="8" fill="var(--accent-2)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
