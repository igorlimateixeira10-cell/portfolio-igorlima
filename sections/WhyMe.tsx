import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
      <path
        d="m5 12.5 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WhyMe({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-ink">
            {dict.whyMe.eyebrow}
          </span>
          <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-[2.75rem]">
            {dict.whyMe.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {dict.whyMe.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 60}>
              <div className="flex gap-4">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent/10 text-accent-ink">
                  <CheckIcon />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
