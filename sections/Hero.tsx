import type { Dictionary } from "@/data/dictionaries/pt";
import { Button } from "@/components/ui/Button";
import { ArrowUpRightIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";
import {
  GlobeIcon,
  TargetIcon,
  BuildingIcon,
  CartIcon,
  TerminalIcon,
  WrenchIcon,
} from "@/components/icons/ServiceIcons";
import { WHATSAPP_NUMBER } from "@/lib/contact";

// Mesmos ícones e nomes da seção Serviços — reaproveitados aqui como o
// conteúdo do fundo "andando sozinho" (ver .hero-marquee no globals.css).
// Reusar em vez de inventar rótulos novos mantém tudo no dicionário e
// consistente com o resto do site.
const icons = [GlobeIcon, TargetIcon, BuildingIcon, CartIcon, TerminalIcon, WrenchIcon];

// Hero: fundo com duas fileiras de ícones de negócio deslizando em loop
// contínuo (puro CSS, sem JS, sem depender do mouse) atrás de um glow
// verde e um degradê escuro pra legibilidade. O título tem um trecho em
// degradê. Nada aqui precisa de "use client".
export function Hero({ dict }: { dict: Dictionary }) {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    dict.contact.whatsappMessage
  )}`;

  const chips = dict.services.items.map((item, i) => ({ label: item.title, Icon: icons[i] }));

  return (
    <section id="home" className="relative isolate min-h-[100svh] overflow-hidden border-b border-line bg-bg">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 72% 34%, rgba(72,230,50,0.16), transparent 60%)",
          }}
        />

        {/* As duas fileiras de ícones — deslizam sozinhas, sentidos opostos. */}
        <div className="absolute inset-x-0 top-[18%] flex flex-col gap-8 opacity-[0.16] sm:top-[14%]">
          {[false, true].map((reverse) => (
            <div key={String(reverse)} className="hero-marquee">
              <div className={`hero-marquee-track gap-8 ${reverse ? "hero-marquee-track--reverse" : ""}`}>
                {[...chips, ...chips].map(({ label, Icon }, i) => (
                  <div
                    key={`${label}-${i}`}
                    className="flex flex-none items-center gap-2.5 rounded-full border border-line px-5 py-2.5"
                  >
                    <Icon className="h-4 w-4 text-ink-soft" />
                    <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(100deg, var(--bg) 0%, rgba(8,10,8,0.94) 42%, rgba(8,10,8,0.55) 66%, rgba(8,10,8,0.18) 88%, transparent 100%), linear-gradient(to top, rgba(8,10,8,0.75) 0%, transparent 32%)",
          }}
        />
      </div>

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
