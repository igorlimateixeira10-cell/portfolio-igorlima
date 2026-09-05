import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2";

const variants = {
  primary: "bg-ink text-bg hover:bg-accent-ink",
  secondary: "border border-line text-ink hover:border-ink hover:bg-surface bg-transparent",
  accent:
    "bg-accent text-white shadow-[0_10px_24px_-12px_rgba(47,92,246,0.6)] hover:bg-accent-ink hover:-translate-y-0.5",
};

type Variant = keyof typeof variants;

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
  ...props
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = href.startsWith("http");
  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}

export function ButtonAsButton({
  variant = "primary",
  children,
  className = "",
  ...props
}: {
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
