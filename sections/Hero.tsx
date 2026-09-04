import type { Dictionary } from "@/data/dictionaries/pt";
import { Button } from "@/components/ui/Button";
import {
  ReactIcon,
  NextIcon,
  TypeScriptIcon,
} from "@/components/icons/TechIcons";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section id="home" className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-ink-soft">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          {dict.hero.availability}
        </div>

        <p className="mt-8 font-mono text-sm uppercase tracking-[0.18em] text-accent-ink">
          {dict.hero.eyebrow}
        </p>

        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl">
          {dict.hero.title}
        </h1>

        <p className="mt-6 max-w-xl text-lg text-ink-soft">{dict.hero.subtitle}</p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="#projects" variant="primary">
            {dict.hero.ctaPrimary}
          </Button>
          <Button href="#contact" variant="secondary">
            {dict.hero.ctaSecondary}
          </Button>
        </div>

        <div className="mt-16 flex items-center gap-6 text-ink-faint sm:mt-24">
          <ReactIcon className="h-6 w-6" />
          <NextIcon className="h-6 w-6" />
          <TypeScriptIcon className="h-6 w-6" />
          <span className="h-5 w-px bg-line" />
          <p className="font-mono text-xs">React · Next.js · TypeScript</p>
        </div>
      </div>
    </section>
  );
}
