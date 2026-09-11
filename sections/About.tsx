import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";
import { stack } from "@/sections/TechStack";

export function About({ dict }: { dict: Dictionary }) {
  // Números reais, derivados dos próprios dados do site (não inventados):
  // quantidade de projetos publicados, etapas do processo de trabalho e
  // tecnologias do stack — a mesma ideia da referência ("120+", "230+"),
  // só que com fatos verificáveis no próprio código.
  const stats = [
    { value: String(projects.length).padStart(2, "0"), label: dict.projects.title },
    { value: String(dict.process.steps.length).padStart(2, "0"), label: dict.process.title },
    { value: String(stack.length), label: dict.techStack.eyebrow },
  ];

  return (
    <section id="about" className="border-b border-line bg-surface/85">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-ink">
              {dict.about.eyebrow}
            </span>
            <h2 className="mt-3 text-balance text-4xl font-bold leading-[0.95] tracking-tight text-ink sm:text-5xl lg:text-[3.75rem]">
              {dict.about.title}
            </h2>

            {/* Bloco de dados — mesma linguagem de card tecnológico do
                resto do site, com bastante espaço negativo ao redor. */}
            <div className="mt-10 grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="tech-card rounded-2xl px-3 py-4">
                  <p className="font-mono text-2xl font-semibold text-ink">{stat.value}</p>
                  <p className="mt-1 text-[10px] uppercase leading-tight tracking-wide text-ink-faint">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="flex flex-col gap-5">
              <p className="text-lg leading-relaxed text-ink">{dict.about.lead}</p>
              {dict.about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              ))}

              <div className="tech-card mt-4 rounded-2xl p-6">
                <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                  {dict.about.principlesLabel}
                </p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {dict.about.principles.map((principle) => (
                    <li key={principle} className="flex gap-3 text-sm text-ink-soft">
                      <span className="mt-2 h-1 w-1 flex-none rounded-full bg-accent" />
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
