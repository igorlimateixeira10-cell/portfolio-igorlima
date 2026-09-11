// Fundo do site inteiro — v4: sem vídeo, sem textura. A referência (Zane
// Kairo) não tem foto/vídeo de fundo — é liso e escuro, só um brilho
// ambiente sutil atrás do conteúdo. `position: fixed` + `-z-10`, mesma
// técnica de sempre (nunca sai da viewport).
//
// 100% CSS de novo (sem <video>, sem JS) — volta a ser Server Component,
// zero JavaScript extra no bundle do cliente. `prefers-reduced-motion`
// é tratado inteiramente em globals.css.
export function SiteBackground() {
  return (
    <div aria-hidden className="site-bg fixed inset-0 -z-10 overflow-hidden bg-bg">
      <div className="site-bg__glow site-bg__glow--a absolute" />
      <div className="site-bg__glow site-bg__glow--b absolute" />
      <div className="site-bg__overlay absolute inset-0" />
    </div>
  );
}
