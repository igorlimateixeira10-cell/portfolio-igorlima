import type { Dictionary } from "@/data/dictionaries/pt";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { ProjectMotionCard } from "@/components/projects/ProjectMotionCard";
import { ArrowUpRightIcon } from "@/components/icons/SocialIcons";

export function Projects({ dict }: { dict: Dictionary }) {
  return (
    <section id="projects" className="ark-section ark-projects">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow={dict.projects.eyebrow}
            title={dict.projects.title}
            subtitle={dict.projects.subtitle}
          />
        </Reveal>

        <div className="mt-10 flex flex-col gap-8 sm:gap-10">
          {projects.map((project, i) => {
            const copy = dict.projects.items[project.slug];

            return (
              <Reveal key={project.slug} delay={i * 60}>
                <ProjectMotionCard
                  className={`ark-project-card ark-project-card--float-${i + 1} relative mx-auto w-full max-w-5xl overflow-hidden rounded-4xl`}
                >
                  <ProjectVisual
                    image={project.image}
                    alt={copy.name}
                    href={project.liveUrl}
                    linkLabel={dict.projects.viewProject}
                    detailsHref={project.githubUrl}
                    detailsLabel={dict.projects.viewDetails}
                    projectSlug={project.slug}
                  />
                </ProjectMotionCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={280}>
          <a
            href="https://github.com/igorlimateixeira10-cell?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="link-underline ark-projects-github-link mt-6 inline-flex items-center gap-1.5 text-sm text-ink-soft"
          >
            {dict.projects.otherProjects}
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
