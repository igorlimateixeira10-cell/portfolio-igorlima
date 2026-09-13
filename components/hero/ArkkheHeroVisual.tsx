import Image from "next/image";

export function ArkkheHeroVisual() {
  return (
    <div className="ark-hero-visual" aria-hidden="true">
      <span className="ark-hero-visual__slash ark-hero-visual__slash--back" />
      <span className="ark-hero-visual__note ark-hero-visual__note--top">IDEIAS<br />CÓDIGO<br />RESULTADOS<i /></span>
      <Image
        src="/arkkhe/astronaut.png"
        alt=""
        width={1240}
        height={1500}
        priority
        sizes="(min-width: 1024px) 52vw, 82vw"
        className="ark-hero-visual__image"
      />
      <span className="ark-hero-visual__note ark-hero-visual__note--bottom">DESENVOLVIMENTO<br />COM PROPÓSITO<i /></span>
      <span className="ark-hero-visual__slash ark-hero-visual__slash--front" />
    </div>
  );
}
