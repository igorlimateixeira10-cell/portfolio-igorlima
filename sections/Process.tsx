import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Process({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionHeading eyebrow={dict.process.eyebrow} title={dict.process.title} />
        </Reveal>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {dict.process.steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 60}>
              <li className="flex h-full flex-col gap-3 border-t-2 border-line pt-5">
                <span className="font-mono text-sm text-accent-ink">{step.number}</span>
                <h3 className="text-base font-semibold text-ink">{step.title}</h3>
                <p className="text-sm text-ink-soft">{step.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
