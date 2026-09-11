import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Timeline horizontal conectada (referência: "My Process" do mockup
// enviado) — cada passo é um círculo numerado sobre uma linha contínua,
// em vez de colunas soltas com borda no topo. Mesmos 5 passos reais de
// sempre (dict.process.steps), só a apresentação visual mudou.
export function Process({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-b border-line bg-bg/80">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow={dict.process.eyebrow} title={dict.process.title} size="md" />
        </Reveal>

        <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {/* Linha conectando os círculos — só a partir do `lg` (colunas
              de verdade lado a lado); nas grades menores os passos empilham
              e a linha perderia o sentido. Um pulso de sinal percorre ela
              (mesma técnica do SignalDivider), reforçando a leitura de
              "processo em andamento" em vez de uma régua estática. */}
          <div
            aria-hidden
            className="signal-divider absolute left-0 right-0 top-6 hidden lg:block"
          >
            <span className="signal-divider__pulse" />
          </div>

          {dict.process.steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 60} as="li" className="relative flex flex-col gap-3">
              <span className="relative flex h-12 w-12 flex-none items-center justify-center rounded-full border border-accent/40 bg-surface font-mono text-sm text-accent-ink shadow-[0_0_20px_-4px_rgba(var(--accent-glow),0.5)]">
                {step.number}
              </span>
              <h3 className="mt-1 text-base font-semibold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{step.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
