"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/data/dictionaries/pt";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { ArrowUpRightIcon } from "@/components/icons/SocialIcons";

export function Header({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  // Transparente sobre o Hero; ganha fundo e borda assim que a página
  // rola — sem isso o header (fixed) fica ilegível por cima do conteúdo
  // das outras seções.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#home", label: dict.nav.home },
    { href: "#projects", label: dict.nav.projects },
    { href: "#services", label: dict.nav.services },
    { href: "#about", label: dict.nav.about },
    { href: "#contact", label: dict.nav.contact },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open
          ? "border-line bg-bg/85 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8 lg:h-24">
        <Link href={`/${locale}#home`} className="font-mono text-sm font-semibold tracking-[0.08em] text-ink">
          IGOR<span className="text-accent">.</span>LIMA
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link-underline text-[11px] uppercase tracking-wide text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitch current={locale} />
          <a
            href="#contact"
            className="group inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-bg shadow-[0_0_24px_-8px_rgba(72,230,50,0.75)] transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_-6px_rgba(72,230,50,0.8)]"
          >
            {dict.nav.cta}
            <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span
            className={`h-px w-5 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-5 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-bg/95 px-5 pb-6 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1 pt-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base text-ink-soft transition-colors hover:bg-surface hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between gap-4">
            <LanguageSwitch current={locale} />
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-white"
            >
              {dict.nav.cta}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
