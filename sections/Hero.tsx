import type { Dictionary } from "@/data/dictionaries/pt";
import { Button } from "@/components/ui/Button";
import { ArrowUpRightIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import { ArkkheHeroVisual } from "@/components/hero/ArkkheHeroVisual";
import { ViewportMotionObserver } from "@/components/ui/ViewportMotionObserver";

export function Hero({ dict }: { dict: Dictionary }) {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    dict.contact.whatsappMessage
  )}`;

  return (
    <section id="home" className="ark-hero">
      <ViewportMotionObserver targetId="home" rootMargin="160px 0px" />
      <div className="ark-hero__grid" aria-hidden="true" />
      <div className="ark-hero__content">
        <div className="ark-hero__copy">
          <p className="ark-eyebrow">{dict.hero.eyebrow}</p>
          <p className="ark-hero__availability">{dict.hero.availability}</p>
          <h1 className="ark-hero__title">
            {dict.hero.titleLines.map((line, i) => {
              if (!line.accent) return <span key={i}>{line.text}</span>;

              const words = line.text.split(" ");
              const opening = words.slice(0, 2).join(" ");
              const middle = words.slice(2, -2).join(" ");
              const ending = words.slice(-2).join(" ");

              return (
                <span key={i} className="ark-hero__title-accent">
                  <em>{opening}</em>{middle && ` ${middle} `}<strong>{ending}</strong>
                </span>
              );
            })}
          </h1>
          <p className="ark-hero__subtitle">{dict.hero.subtitle}</p>
          <div className="ark-hero__actions">
            <Button href={whatsappHref} variant="accent" className="group">
              <WhatsAppIcon className="h-4 w-4" />
              {dict.hero.ctaWhatsapp}
              <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
            <Button href="#projects" variant="secondary">
              {dict.hero.ctaProjects}
            </Button>
          </div>
          <div className="ark-hero__stats">
            {dict.hero.stats.map((stat) => (
              <div key={stat.label}>
                <b>{stat.value}</b><span>{stat.label}</span>
              </div>
            ))}
          </div>
          <video
            className="ark-hero__signature"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            width="640"
            height="360"
            aria-label="Assinatura animada de Igor Lima Teixeira"
          >
            <source src="/videos/assinatura-alpha.webm" type="video/webm" />
          </video>
        </div>
        <ArkkheHeroVisual />
      </div>
      <a className="ark-hero__scroll" href="#projects">scroll ↓</a>
    </section>
  );
}
