"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { TiltCard } from "@/components/ui/TiltCard";
import { useReducedMotion } from "@/components/hooks/useReducedMotion";
import { useSlowConnection } from "@/components/hooks/useSlowConnection";
import { useDesktopQuality } from "@/components/hooks/useDesktopQuality";

/**
 * `next/dynamic(ssr:false)` obrigatório — mesmo motivo do Hero
 * (Canvas/WebGL não existe no servidor; separa o bundle do R3F/three do
 * JS principal). Cada projeto monta o SEU próprio Canvas sob demanda
 * (ver IntersectionObserver abaixo) — nenhum dos três paga o custo
 * antes de estar perto da viewport.
 */
const ProjectPanel3D = dynamic(
  () => import("@/components/three/ProjectPanel3D").then((mod) => mod.ProjectPanel3D),
  { ssr: false }
);

/**
 * Apresentação visual de um projeto: em telas de desktop, sem
 * `prefers-reduced-motion` e sem conexão lenta, vira o painel 3D
 * "produto" (ver ProjectPanel3D.tsx) — monta só quando o card se
 * aproxima da viewport (`rootMargin` positivo, antecipa antes de
 * entrar de fato). Em qualquer outro caso — mobile, motion reduzido,
 * conexão ruim, ou antes de montar no cliente — continua exatamente o
 * card plano de sempre (BrowserFrame com tilt CSS), sem regressão
 * nenhuma nesses casos.
 */
export function ProjectVisual({ image, alt }: { image: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const reduceMotion = useReducedMotion();
  const isSlowConnection = useSlowConnection();
  const isDesktop = useDesktopQuality();

  const wantsPanel = isDesktop && !reduceMotion && !isSlowConnection;

  useEffect(() => {
    const el = ref.current;
    if (!el || !wantsPanel || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [wantsPanel]);

  return (
    // `min-w-0`: item de grid (ver Projects.tsx, `md:grid-cols-[1.15fr_1fr]`)
    // — sem isso, o <canvas> do ProjectPanel3D (que tem largura "intrínseca"
    // como um <img>) poderia inflar a coluna do grid; ver comentário
    // completo em ProjectPanel3D.tsx.
    <div ref={ref} className="min-w-0">
      {wantsPanel && nearViewport ? (
        <ProjectPanel3D image={image} reduceMotion={reduceMotion} />
      ) : (
        <TiltCard>
          <BrowserFrame src={image} alt={alt} sizes="(min-width: 768px) 52vw, 92vw" />
        </TiltCard>
      )}
    </div>
  );
}
