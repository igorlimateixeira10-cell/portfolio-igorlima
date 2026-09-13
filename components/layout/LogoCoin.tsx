// Logo do header (public/logo-igor-lima-transparent.png) girando em 3D feito "moeda" — só CSS
// (perspective + rotateY + preserve-3d; sem three.js/framer-motion, o
// projeto não tinha nenhuma lib de 3D/partículas instalada e a instrução
// foi não adicionar dependência à toa). O `backface-visibility` fica no
// padrão ("visible"), de propósito: é isso que faz a mesma imagem
// aparecer espelhada quando a rotação passa dos 90°/270°, simulando a
// "lateral" da moeda sem precisar desenhar uma segunda face.
//
// Puramente decorativo (`aria-hidden`) — o nome acessível do link já é o
// texto "IGOR.LIMA" ao lado, então a logo não precisa de alt text próprio.
export function LogoCoin() {
  return (
    <span
      className="logo-coin-stage relative inline-flex h-8 w-8 flex-none items-center justify-center sm:h-9 sm:w-9"
      aria-hidden
    >
      {/* Névoa/energia atrás — bem discreta, "respira" devagar. */}
      <span className="logo-coin__haze absolute inset-[-40%] rounded-full" />

      {/* Partículas soltando da borda — 6 pontos fixos ao redor do
          círculo (não centenas de elementos), cada um com sua própria
          direção de deriva via --px/--py. */}
      <span className="logo-coin__particle" style={{ top: "-2px", left: "50%", ["--px" as string]: "2px", ["--py" as string]: "-9px" }} />
      <span className="logo-coin__particle" style={{ top: "20%", right: "-3px", ["--px" as string]: "9px", ["--py" as string]: "-3px", animationDelay: "0.5s" }} />
      <span className="logo-coin__particle" style={{ bottom: "20%", right: "-3px", ["--px" as string]: "9px", ["--py" as string]: "3px", animationDelay: "1s" }} />
      <span className="logo-coin__particle" style={{ bottom: "-2px", left: "50%", ["--px" as string]: "-2px", ["--py" as string]: "9px", animationDelay: "1.5s" }} />
      <span className="logo-coin__particle hidden sm:block" style={{ bottom: "20%", left: "-3px", ["--px" as string]: "-9px", ["--py" as string]: "3px", animationDelay: "2s" }} />
      <span className="logo-coin__particle hidden sm:block" style={{ top: "20%", left: "-3px", ["--px" as string]: "-9px", ["--py" as string]: "-3px", animationDelay: "2.5s" }} />

      {/* A moeda em si. */}
      <span className="logo-coin-stage__spin relative block h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-igor-lima-transparent.png?v=20260913" alt="" className="logo-coin__img h-full w-full rounded-full object-cover" />
      </span>
    </span>
  );
}
