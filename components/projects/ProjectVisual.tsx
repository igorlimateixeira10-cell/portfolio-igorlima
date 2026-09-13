import Image from "next/image";

export function ProjectVisual({
  image,
  alt,
  href,
  linkLabel,
  detailsHref,
  detailsLabel,
  projectSlug,
}: {
  image: string;
  alt: string;
  href: string;
  linkLabel: string;
  detailsHref: string;
  detailsLabel: string;
  projectSlug: string;
}) {
  return (
    <div className={`ark-project-visual ark-project-visual--${projectSlug}`}>
      <Image
        src={image}
        alt={`Prévia de ${alt}`}
        fill
        quality={75}
        sizes="(min-width: 768px) 52vw, 92vw"
      />
      <a
        className="ark-project-action ark-project-visit-overlay"
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={`${linkLabel}: ${alt}`}
      >
        {linkLabel} <span aria-hidden>↗</span>
      </a>
      <a
        className="ark-project-action ark-project-details-overlay"
        href={detailsHref}
        target="_blank"
        rel="noreferrer"
        aria-label={`${detailsLabel}: ${alt}`}
      >
        {detailsLabel}
      </a>
    </div>
  );
}
