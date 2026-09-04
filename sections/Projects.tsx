import Image from "next/image";
import type { Dictionary } from "@/data/dictionaries/pt";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GitHubIcon, ArrowUpRightIcon } from "@/components/icons/SocialIcons";

export function Projects({ dict }: { dict: Dictionary }) {
  return (
    <section id="projects" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionHeading
            eyebrow={dict.projects.eyebrow}
            title={dict.projects.title}
            subtitle={dict.projects.subtitle}
          />
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {projects.map((project, i) => {
            const copy = dict.projects.items[project.slug];
            return (
              <Reveal key={project.slug} delay={i * 80}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(11,13,18,0.35)]">
                  <div className="relative aspect-[2/1] overflow-hidden border-b border-line bg-bg">
                    <Image
                      src={project.image}
                      alt={copy.name}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-mono text-[11px] uppercase tracking-wide text-accent-ink">
                      {copy.category}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-ink">{copy.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-ink-soft">{copy.description}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-bg px-2 py-1 font-mono text-[11px] text-ink-soft"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center gap-4 border-t border-line pt-4">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-accent-ink"
                      >
                        {dict.projects.viewProject}
                        <ArrowUpRightIcon className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${copy.name} — ${dict.projects.viewCode}`}
                        className="ml-auto text-ink-faint hover:text-ink"
                      >
                        <GitHubIcon className="h-4 w-4" />
                      </a>
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
            className="mt-10 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
          >
            {dict.projects.otherProjects}
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
