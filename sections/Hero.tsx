import type { Dictionary } from "@/data/dictionaries/pt";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { ArrowUpRightIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";
import { WHATSAPP_NUMBER } from "@/lib/contact";

// Duas colunas a partir do `lg` — a coluna direita é o HeroVisual, que
// hoje mostra o CodeCard (padrão, no ar) e tem um botão pra testar o
// personagem 3D ALTER em cima dele sem tirar o CodeCard do lugar (ver
// HeroVisual.tsx). Fase de infraestrutura 3D — a cena final (ALTER
// sentado no MacBook) ainda não existe.
export function Hero({ dict }: { dict: Dictionary }) {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    dict.contact.whatsappMessage
  )}`;

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden">
      <div className="hero-vignette absolute inset-0" aria-hidden />

      <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-0 h-40 bg-gradient-to-b from-black/35 to-transparent" />

      <div className="hero-topline pointer-events-none absolute left-0 right-0 top-24 hidden lg:block" aria-hidden>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink-faint">Available for selected projects</span>
          <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.28em] text-ink-faint">
            <span className="h-px w-10 bg-accent/40" />
            2026 / FRONT-END
          </span>
        </div>
      </div>

      <div className="relative mx-auto grid min-h-[100svh] max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1fr_auto] lg:gap-8 lg:pt-28">
        <div className="max-w-2xl">
          <div
            className="hero-enter inline-flex items-center gap-2 rounded-full border border-line bg-bg/40 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.13em] text-ink-soft backdrop-blur-sm"
            style={{ animationDelay: "80ms" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {dict.hero.availability}
          </div>

          <p
            className="hero-enter mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-accent"
            style={{ animationDelay: "150ms" }}
          >
            {dict.hero.eyebrow}
          </p>

          <h1
            className="hero-enter mt-4 text-balance text-[2.75rem] font-bold leading-[0.98] tracking-[-0.055em] text-ink sm:text-6xl lg:text-[4.15rem] xl:text-[4.65rem]"
            style={{ animationDelay: "220ms" }}
          >
            {dict.hero.titleLines.map((line, i) => (
              <span key={i} className={`block ${line.accent ? "text-gradient-accent" : ""}`}>
                {line.text}
              </span>
            ))}
          </h1>

          <p
            className="hero-enter mt-7 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base"
            style={{ animationDelay: "300ms" }}
          >
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

          {/* Cards de métrica — mesma linguagem visual usada no resto do
              site (ver .tech-card em globals.css): número grande, rótulo
              curto, vidro escuro com fio de luz sutil no topo. */}
          <div className="hero-enter mt-10 grid grid-cols-3 gap-3 sm:max-w-md" style={{ animationDelay: "440ms" }}>
            {dict.hero.stats.map((stat) => (
              <div
                key={stat.label}
                className="tech-card rounded-2xl px-3.5 py-3.5 sm:px-4 sm:py-4"
              >
                <p className="font-mono text-xl font-semibold text-ink sm:text-2xl">{stat.value}</p>
                <p className="mt-1 text-[10px] uppercase leading-tight tracking-wide text-ink-faint sm:text-[11px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-enter" style={{ animationDelay: "260ms" }}>
          <HeroVisual />
        </div>
      </div>

      <div className="hero-scroll-cue pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 sm:flex" aria-hidden>
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink-faint">Scroll to explore</span>
        <span className="hero-scroll-line h-8 w-px bg-gradient-to-b from-accent/80 to-transparent" />
      </div>
    </section>
  );
}
