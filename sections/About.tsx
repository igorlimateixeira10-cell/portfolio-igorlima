import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";

export function About({ dict }: { dict: Dictionary }) {
  return (
    <section id="about" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-ink">
              {dict.about.eyebrow}
            </span>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {dict.about.title}
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <div className="flex flex-col gap-5">
              {dict.about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
