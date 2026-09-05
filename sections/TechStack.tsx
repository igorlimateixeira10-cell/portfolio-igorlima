import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";
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

const stack = [
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
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
            {dict.techStack.eyebrow} — {dict.techStack.title}
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
          {stack.map(({ name, Icon }, i) => (
            <Reveal key={name} delay={i * 40}>
              <div className="group flex h-28 flex-col items-center justify-center gap-2.5 bg-surface px-2 text-center transition-colors hover:bg-bg">
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
