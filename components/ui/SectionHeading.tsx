export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-ink">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-balance text-4xl font-bold leading-[0.95] tracking-tight text-ink sm:text-5xl lg:text-[3.75rem]">
        {title}
      </h2>
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
