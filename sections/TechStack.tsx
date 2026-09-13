"use client";

import type { Dictionary } from "@/data/dictionaries/pt";
import { useEffect, useRef } from "react";
import {
  ChromaKeyRobotVideo,
  type ChromaKeyRobotVideoHandle,
} from "@/components/tech/ChromaKeyRobotVideo";
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
  const sectionRef = useRef<HTMLElement>(null);
  const robotRef = useRef<ChromaKeyRobotVideoHandle>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame: number | null = null;
    let isNearViewport = true;

    const updateProgress = () => {
      frame = null;
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / scrollDistance));
      // A curva acelera o começo da ação: o robô alcança o notebook e a
      // digitação mais cedo, mas continua evoluindo até o fim da seção.
      const robotProgress = Math.pow(progress, 0.68);

      robotRef.current?.setProgress(robotProgress);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const start = 0.15 + index * 0.095;
        const cardProgress = Math.max(0, Math.min(1, (progress - start) / 0.18));
        const direction = index % 2 === 0 ? -1 : 1;
        const signalProgress = Math.max(0, Math.min(1, (cardProgress - 0.96) / 0.04));

        card.style.opacity = String(cardProgress);
        card.style.transform = `translate3d(${(1 - cardProgress) * direction * 20}px, ${(1 - cardProgress) * 28}px, 0) scale(${0.92 + cardProgress * 0.08})`;
        card.style.setProperty("--stack-card-signal", String(signalProgress));
      });
    };

    const onScroll = () => {
      if (!isNearViewport) return;
      if (frame === null) frame = window.requestAnimationFrame(updateProgress);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry.isIntersecting;
        section.dataset.motionActive = entry.isIntersecting ? "true" : "false";
        if (entry.isIntersecting) onScroll();
      },
      { rootMargin: "360px 0px" },
    );

    updateProgress();
    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      observer.disconnect();
      delete section.dataset.motionActive;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} id="tech" className="ark-section ark-stack ark-stack--scroll">
      <div className="ark-stack__pin">
        <div className="ark-stack__inner mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:py-20">
          <div className="ark-stack__content">
            <div className="ark-stack__heading">
              <span>{dict.techStack.eyebrow}</span>
              <h2>{dict.techStack.title}</h2>
            </div>

            <div className="ark-stack__grid">
              {stack.map(({ name, Icon }, index) => (
                <div
                  key={name}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  className="ark-stack__card"
                >
                  <div className="tech-card tech-grid-cell group flex flex-col items-center justify-center gap-2 rounded-lg px-2 text-center">
                    <Icon className="h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-mono text-[11px]">{name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ChromaKeyRobotVideo ref={robotRef} />
        </div>
        <div className="ark-stack__ambient-nodes" aria-hidden="true">
          <i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
        </div>
      </div>
    </section>
  );
}
