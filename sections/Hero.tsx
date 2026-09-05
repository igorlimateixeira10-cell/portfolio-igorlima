import type { Dictionary } from "@/data/dictionaries/pt";
import { Button } from "@/components/ui/Button";
import { ArrowUpRightIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";
import { WHATSAPP_NUMBER } from "@/lib/contact";

// O cenário (estátua, glow, linhas, partículas) não vive mais aqui — é o
// <SiteWallpaper /> global (renderizado uma vez em app/[lang]/page.tsx,
// atrás do Header/main inteiro), fixo na viewport o tempo todo, inclusive
// depois que esta section rola pra fora de vista. Aqui sobra só o texto
// e a legibilidade LOCAL dele — a mesma lógica de sempre (coluna estreita
// ao lado da estátua a partir do `lg`; abaixo disso, texto por cima dela)
// continua fazendo sentido porque a estátua do wallpaper ocupa a mesma
// posição de tela que ocupava antes.
export function Hero({ dict }: { dict: Dictionary }) {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    dict.contact.whatsappMessage
  )}`;

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden">
      {/* Legibilidade do texto — duas versões, porque a composição muda no
          `lg`: até `md` (uma coluna só, texto por cima da estátua) precisa
          de uma faixa escura bem mais larga; no `lg` (estátua ao lado,
          não por baixo) o degradê esvai rápido, bem antes dela começar. */}
      <div
        aria-hidden
        className="absolute inset-0 lg:hidden"
        style={{
          backgroundImage:
            "linear-gradient(100deg, var(--bg) 0%, rgba(8,10,8,0.92) 45%, rgba(8,10,8,0.55) 62%, transparent 82%), linear-gradient(to top, var(--bg) 0%, transparent 16%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden lg:block"
        style={{
          backgroundImage:
            "linear-gradient(100deg, var(--bg) 0%, rgba(8,10,8,0.92) 20%, rgba(8,10,8,0.5) 30%, transparent 42%), linear-gradient(to top, var(--bg) 0%, transparent 16%)",
        }}
      />

      {/* Até o tablet a estátua fica atrás/ao redor do texto (uma coluna
          só) — um reforço extra de escurecimento mantém tudo legível. */}
      <div aria-hidden className="absolute inset-0 bg-bg/45 lg:hidden" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl items-center px-5 pb-16 pt-28 sm:px-8 lg:pt-24">
        <div className="max-w-xl">
          <div className="hero-enter inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.13em] text-ink-soft" style={{ animationDelay: "80ms" }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {dict.hero.availability}
          </div>

          <p className="hero-enter mt-7 font-mono text-[11px] uppercase tracking-[0.16em] text-accent" style={{ animationDelay: "150ms" }}>
            {dict.hero.eyebrow}
          </p>

          <h1 className="hero-enter mt-4 text-balance text-[2.75rem] font-bold leading-[0.98] tracking-[-0.055em] text-ink sm:text-6xl lg:text-[4.15rem] xl:text-[4.65rem]" style={{ animationDelay: "220ms" }}>
            {dict.hero.titleLines.map((line, i) => (
              <span key={i} className={`block ${line.accent ? "text-gradient-accent" : ""}`}>
                {line.text}
              </span>
            ))}
          </h1>

          <p className="hero-enter mt-7 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base" style={{ animationDelay: "300ms" }}>
            {dict.hero.subtitle}
          </p>

          <div className="hero-enter mt-8 flex flex-wrap gap-3" style={{ animationDelay: "380ms" }}>
            <Button href={whatsappHref} variant="accent" className="group">
              <WhatsAppIcon className="h-4 w-4" />
              {dict.hero.ctaWhatsapp}
              <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
            <Button href="#projects" variant="secondary">
              {dict.hero.ctaProjects}
            </Button>
          </div>

          <p className="hero-enter mt-8 font-mono text-[10px] uppercase tracking-[0.13em] text-ink-faint" style={{ animationDelay: "460ms" }}>
            {dict.hero.proof}
          </p>
        </div>
      </div>
    </section>
  );
}
