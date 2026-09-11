import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  ReactIcon,
  NextIcon,
  TypeScriptIcon,
  JavaScriptIcon,
  HtmlIcon,
  CssIcon,
  TailwindIcon,
  ApiIcon,
} from "@/components/icons/TechIcons";

export const stack = [
  { name: "HTML5", Icon: HtmlIcon },
  { name: "CSS3", Icon: CssIcon },
  { name: "JavaScript", Icon: JavaScriptIcon },
  { name: "TypeScript", Icon: TypeScriptIcon },
  { name: "React", Icon: ReactIcon },
  { name: "Next.js", Icon: NextIcon },
  { name: "Tailwind CSS", Icon: TailwindIcon },
  { name: "APIs", Icon: ApiIcon },
];

export function TechStack({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-b border-line bg-surface/85">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow={dict.techStack.eyebrow} title={dict.techStack.title} size="md" />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stack.map(({ name, Icon }, i) => (
            <Reveal key={name} delay={i * 40}>
              <div className="tech-card tech-grid-cell group flex h-28 flex-col items-center justify-center gap-2.5 rounded-2xl px-2 text-center">
                <Icon className="h-6 w-6 text-ink-soft transition-colors duration-200 group-hover:text-accent-ink" />
                <span className="font-mono text-[11px] text-ink-soft">{name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
