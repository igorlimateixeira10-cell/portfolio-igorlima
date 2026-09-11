"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/data/dictionaries/pt";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { LogoCoin } from "@/components/layout/LogoCoin";
import { useActiveSection } from "@/components/layout/useActiveSection";
import { ArrowUpRightIcon } from "@/components/icons/SocialIcons";

export function Header({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  // Sem fundo sobre o Hero; ganha um véu (blur + borda) assim que a
  // página rola — sem isso o header (fixed) fica ilegível por cima do
  // conteúdo das outras seções. Os elementos (nav em pílula, botões) já
  // têm o próprio fundo, então o header em si pode ficar bem discreto.
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

  // Qual section está mais visível agora — os `id`s batem com os `href`
  // acima sem o "#" (ver os respectivos <section id="..."> em
  // sections/Hero.tsx, Projects.tsx, Services.tsx, About.tsx,
  // Contact.tsx). Antes, só "Início" ficava marcado, sempre.
  const activeId = useActiveSection(links.map((link) => link.href.slice(1)));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "bg-bg/70 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8 lg:h-24">
        <Link
          href={`/${locale}#home`}
          className="flex items-center gap-2.5 font-mono text-sm font-semibold tracking-[0.08em] text-ink"
        >
          <LogoCoin />
          IGOR<span className="text-accent">.</span>LIMA
        </Link>

        {/* Nav em pílula segmentada — cada link é sua própria cápsula
            dentro de um contêiner arredondado, com a âncora da section
            visível agora marcada em destaque (scroll-spy real, ver
            useActiveSection.ts — antes só "Início" ficava marcado). */}
        <nav className="hidden items-center gap-1 rounded-full border border-line bg-bg/40 p-1 backdrop-blur-sm lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.href.slice(1) === activeId ? "true" : undefined}
              className={`rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-wide transition-colors ${
                link.href.slice(1) === activeId
                  ? "bg-accent/15 text-accent-ink ring-1 ring-inset ring-accent/30"
                  : "text-ink-soft hover:bg-white/5 hover:text-ink"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitch current={locale} />
          <a
            href="#contact"
            className="group inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-ink shadow-[0_0_24px_-8px_rgba(var(--accent-glow),0.75)] transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_-6px_rgba(var(--accent-glow),0.8)]"
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
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-line bg-bg/40 lg:hidden"
        >
          <span
            className={`h-px w-4 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-4 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="px-5 pb-6 lg:hidden">
          <nav className="tech-card flex flex-col gap-1 rounded-2xl p-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-ink-soft transition-colors hover:bg-white/5 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex items-center justify-between gap-4 border-t border-line pt-4">
              <LanguageSwitch current={locale} />
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-ink"
              >
                {dict.nav.cta}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
