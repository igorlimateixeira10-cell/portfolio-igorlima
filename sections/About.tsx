import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";

export function About({ dict }: { dict: Dictionary }) {
  return (
    <section id="about" className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-ink">
              {dict.about.eyebrow}
            </span>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-[2.75rem]">
              {dict.about.title}
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <div className="flex flex-col gap-5">
              <p className="text-lg leading-relaxed text-ink">{dict.about.lead}</p>
              {dict.about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              ))}

              <div className="mt-4 border-t border-line pt-6">
                <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                  {dict.about.principlesLabel}
                </p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {dict.about.principles.map((principle) => (
                    <li key={principle} className="flex gap-3 text-sm text-ink-soft">
                      <span className="mt-2 h-1 w-1 flex-none rounded-full bg-ink-faint" />
                      {principle}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
