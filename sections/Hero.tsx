import type { Dictionary } from "@/data/dictionaries/pt";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/Button";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { ArrowUpRightIcon } from "@/components/icons/SocialIcons";
import {
  ReactIcon,
  NextIcon,
  TypeScriptIcon,
} from "@/components/icons/TechIcons";

export function Hero({ dict }: { dict: Dictionary }) {
  const [front, back1, back2] = projects;
  const frontName = dict.projects.items[front.slug].name;

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

      <div className="mx-auto grid max-w-6xl gap-16 px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10">
        <div>
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

          <h1 className="mt-4 text-balance text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-5xl xl:text-[4.2rem]">
            {dict.hero.title}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            {dict.hero.subtitle}
          </p>

          {/* "Solicitar orçamento" é a ação que mais importa para conversão —
              por isso vem primeiro e com a cor de destaque do site. */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="#contact" variant="accent" className="group">
              {dict.hero.ctaSecondary}
              <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
            <Button href="#projects" variant="secondary">
              {dict.hero.ctaPrimary}
            </Button>
          </div>

          <div className="mt-16 flex items-center gap-6 text-ink-faint sm:mt-20 lg:mt-16">
            <ReactIcon className="h-6 w-6" />
            <NextIcon className="h-6 w-6" />
            <TypeScriptIcon className="h-6 w-6" />
            <span className="h-5 w-px bg-line" />
            <p className="font-mono text-xs">React · Next.js · TypeScript</p>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative mx-auto max-w-md">
            <BrowserFrame
              src={back2.image}
              alt=""
              priority={false}
              sizes="20vw"
              className="absolute -right-6 top-10 w-[78%] rotate-6 opacity-90"
            />
            <BrowserFrame
              src={back1.image}
              alt=""
              priority={false}
              sizes="24vw"
              className="absolute -left-8 top-2 w-[85%] -rotate-6 opacity-95"
            />
            <BrowserFrame
              src={front.image}
              alt={frontName}
              priority
              sizes="30vw"
              className="relative w-full transition-transform duration-500 hover:-translate-y-1"
            />
          </div>
          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-wide text-ink-faint">
            {dict.hero.proof}
          </p>
        </div>

        <div className="lg:hidden">
          <BrowserFrame src={front.image} alt={frontName} priority sizes="90vw" />
        </div>
      </div>
    </section>
  );
}
