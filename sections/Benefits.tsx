import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";

// Faixa de benefícios logo abaixo do Hero — números grandes discretos,
// título curto e uma linha de apoio. Puramente CSS/Reveal, sem nenhuma
// biblioteca nova.
export function Benefits({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-b border-line bg-surface/70">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="sr-only">{dict.benefits.title}</h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {dict.benefits.items.map((item, i) => (
            <Reveal key={item.number} delay={i * 60}>
              <div className="flex flex-col gap-2 border-l border-line pl-5">
                <span className="font-mono text-sm text-accent-ink">{item.number}</span>
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
