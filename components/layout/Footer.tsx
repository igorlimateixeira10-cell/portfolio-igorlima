import Link from "next/link";
import type { Dictionary } from "@/data/dictionaries/pt";
import type { Locale } from "@/lib/i18n";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/SocialIcons";

export function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const year = new Date().getFullYear();

  const links = [
    { href: "#projects", label: dict.nav.projects },
    { href: "#services", label: dict.nav.services },
    { href: "#about", label: dict.nav.about },
    { href: "#contact", label: dict.nav.contact },
  ];

  return (
    // bg-bg/85 (não opaco): deixa o SiteWallpaper (fixo, atrás da página)
    // continuar visível de leve até o fim da página.
    <footer className="border-t border-line bg-bg/85">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          <Link href={`/${locale}#home`} className="font-mono text-sm font-semibold tracking-widest">
            IGOR<span className="text-accent">.</span>LIMA
          </Link>
          <p className="mt-2 text-sm text-ink-faint">{dict.footer.tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link-underline text-sm text-ink-soft hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/igorlimateixeira10-cell"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-ink-soft transition-colors hover:text-ink"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/igor-teixeira-4055232b8/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-ink-soft transition-colors hover:text-ink"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="border-t border-line px-5 py-6 sm:px-8">
        <p className="mx-auto max-w-6xl font-mono text-xs text-ink-faint">
          © {year} Igor Lima Teixeira. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
