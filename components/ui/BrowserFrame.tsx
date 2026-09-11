import Image from "next/image";

// Moldura simples de janela de navegador (3 pontos, sem barra de endereço)
// para apresentar as screenshots reais dos projetos com um acabamento mais
// "produto" — só CSS, sem nenhuma biblioteca.
export function BrowserFrame({
  src,
  alt,
  priority = false,
  className = "",
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={`glow-card group overflow-hidden rounded-xl border border-line bg-surface shadow-[0_30px_70px_-24px_rgba(0,0,0,0.65)] ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-line bg-surface px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
      </div>
      <div className="relative aspect-[2/1] overflow-hidden bg-bg">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 40vw, 90vw"}
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
    </div>
  );
}
