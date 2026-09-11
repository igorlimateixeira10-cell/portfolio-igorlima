/**
 * `size` cria ritmo entre seções em vez de todas gritarem no mesmo
 * volume: "lg" (padrão) continua a escala grande de sempre — Projetos,
 * Serviços, Sobre, Contato, seções "principais". "md" é pra seções mais
 * contidas (Processo, Stack, FAQ) — mesma família tipográfica, um
 * degrau abaixo.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  size = "lg",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  size?: "lg" | "md";
}) {
  const titleClass =
    size === "lg"
      ? "mt-3 text-balance text-4xl font-bold leading-[0.95] tracking-tight text-ink sm:text-5xl lg:text-[3.75rem]"
      : "mt-3 text-balance text-3xl font-bold leading-[1] tracking-tight text-ink sm:text-4xl";

  return (
    <div className={align === "center" ? "text-center" : ""}>
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-ink">
        {eyebrow}
      </span>
      <h2 className={titleClass}>{title}</h2>
      {subtitle && (
        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed text-ink-soft ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
