import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";

// Ícones locais, específicos desta faixa — mesmo padrão de WhyMe.tsx
// (ícone pequeno, definido ali mesmo, sem precisar de um arquivo
// compartilhado pra só 3 usos).
function OutdatedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function LostClientIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M6 6l12 12M6 18h6m-6 0V12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const icons = [OutdatedIcon, LostClientIcon, CheckIcon];

// Faixa logo abaixo do Hero: qualifica o visitante antes de vender
// qualquer coisa — "isso é pra você se..." — e fecha com prova social
// (nomes reais de clientes) em vez de repetir a proof-line do Hero.
export function Qualify({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
            {dict.qualify.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {dict.qualify.items.map((text, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={text} delay={i * 60}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-accent/10 text-accent-ink">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-lg font-semibold text-accent-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-soft">{text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200}>
          <p className="mt-14 border-t border-line pt-6 text-center font-mono text-xs uppercase tracking-wide text-ink-faint">
            {dict.qualify.proof}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
