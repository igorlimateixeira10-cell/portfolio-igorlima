import type { Dictionary } from "@/data/dictionaries/pt";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Cases({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionHeading eyebrow={dict.cases.eyebrow} title={dict.cases.title} />
        </Reveal>

        <div className="mt-12 flex flex-col divide-y divide-line border-y border-line">
          {projects.map((project, i) => {
            const name = dict.projects.items[project.slug].name;
            const study = dict.cases.items[project.slug];
            return (
              <Reveal key={project.slug} delay={i * 60}>
                <div className="grid gap-6 py-10 md:grid-cols-[220px_1fr]">
                  <h3 className="text-xl font-semibold text-ink">{name}</h3>

                  <dl className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                        {dict.cases.labels.objective}
                      </dt>
                      <dd className="mt-1.5 text-sm text-ink-soft">{study.objective}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                        {dict.cases.labels.tech}
                      </dt>
                      <dd className="mt-1.5 text-sm text-ink-soft">{project.tech.join(" · ")}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                        {dict.cases.labels.solution}
                      </dt>
                      <dd className="mt-1.5 text-sm text-ink-soft">{study.solution}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                        {dict.cases.labels.result}
                      </dt>
                      <dd className="mt-1.5 text-sm text-ink-soft">{study.result}</dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
