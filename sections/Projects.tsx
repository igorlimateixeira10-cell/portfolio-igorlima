import type { Dictionary } from "@/data/dictionaries/pt";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { Button } from "@/components/ui/Button";
import { GitHubIcon, ArrowUpRightIcon } from "@/components/icons/SocialIcons";

export function Projects({ dict }: { dict: Dictionary }) {
  return (
    // bg-bg/92: mais opaco que o resto das sections — os cases de projeto
    // são texto denso e importante (prova social de verdade). Ainda deixa
    // o brilho do SiteBackground aparecer de leve, só que sem competir
    // com a leitura.
    <section id="projects" className="border-b border-line bg-bg/92">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={dict.projects.eyebrow}
            title={dict.projects.title}
            subtitle={dict.projects.subtitle}
          />
        </Reveal>

        <div className="mt-20 flex flex-col gap-10 sm:gap-14">
          {projects.map((project, i) => {
            const copy = dict.projects.items[project.slug];
            const reversed = i % 2 === 1;
            const index = String(i + 1).padStart(2, "0");

            return (
              <Reveal key={project.slug} delay={i * 60}>
                {/* Cada projeto vira um painel único (case study), não só
                    colunas soltas no fundo da seção — mesma linguagem de
                    card tecnológico do resto do site. O número gigante ao
                    fundo é decorativo (aria-hidden): o índice "de verdade",
                    lido por leitor de tela, é o texto no badge abaixo. */}
                <article className="tech-card relative overflow-hidden rounded-4xl p-6 sm:p-8 lg:p-10">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-10 right-2 select-none font-mono text-[8rem] font-bold leading-none text-accent/[0.07] sm:text-[12rem]"
                  >
                    {index}
                  </span>

                  {/* Cantos técnicos — mesmo motivo usado no anel do Hero,
                      aqui marcando o card inteiro como um "quadro" de case
                      (os 4 cantos, não só os de cima). */}
                  <span aria-hidden className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l border-t border-accent/50" />
                  <span aria-hidden className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-accent/50" />
                  <span aria-hidden className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-accent/50" />
                  <span aria-hidden className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 border-b border-r border-accent/50" />

                  <div
                    className={`grid items-center gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16 ${
                      reversed ? "md:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <ProjectVisual image={project.image} alt={copy.name} />

                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/50 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-accent-ink">
                        {dict.projects.caseLabel} {index} — {copy.category}
                      </span>
                      <h3 className="mt-4 text-[1.75rem] font-semibold leading-tight tracking-tight text-ink">
                        {copy.name}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-ink-soft">
                        {copy.description}
                      </p>

                      <dl className="mt-7 flex flex-col gap-5 border-t border-line pt-6">
                        <div>
                          <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                            {dict.projects.labels.objective}
                          </dt>
                          <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                            {copy.objective}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                            {dict.projects.labels.solution}
                          </dt>
                          <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                            {copy.solution}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                            {dict.projects.labels.result}
                          </dt>
                          <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                            {copy.result}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-6 flex flex-wrap gap-1.5">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md bg-bg/60 px-2 py-1 font-mono text-[11px] text-ink-soft ring-1 ring-line"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Button href={project.liveUrl} variant="accent" className="group">
                          {dict.projects.viewProject}
                          <span className="flex h-5 w-5 items-center justify-center rounded border border-ink/30 text-xs leading-none">
                            +
                          </span>
                        </Button>
                        <Button href={project.githubUrl} variant="secondary">
                          <GitHubIcon className="h-4 w-4" />
                          {dict.projects.viewCode}
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={280}>
          <a
            href="https://github.com/igorlimateixeira10-cell?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="link-underline mt-16 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
          >
            {dict.projects.otherProjects}
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
