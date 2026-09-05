import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon } from "@/components/icons/SocialIcons";
import {
  GlobeIcon,
  TargetIcon,
  BuildingIcon,
  CartIcon,
  TerminalIcon,
  WrenchIcon,
} from "@/components/icons/ServiceIcons";

const icons = [GlobeIcon, TargetIcon, BuildingIcon, CartIcon, TerminalIcon, WrenchIcon];

export function Services({ dict }: { dict: Dictionary }) {
  return (
    <section id="services" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={dict.services.eyebrow}
            title={dict.services.title}
            subtitle={dict.services.subtitle}
          />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {dict.services.items.map((service, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={service.title} delay={i * 50} className="h-full">
                <div className="glow-card group flex h-full flex-col gap-3 rounded-2xl border border-line bg-surface/60 p-7 backdrop-blur-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent-ink transition-transform duration-200 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-ink">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{service.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={300}>
          <a
            href={dict.services.ctaLink}
            className="link-underline mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent-ink"
          >
            {dict.services.ctaText}
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
