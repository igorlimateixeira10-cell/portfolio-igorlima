"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

export function LanguageSwitch({ current }: { current: Locale }) {
  const pathname = usePathname();

  function hrefFor(locale: Locale) {
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-line p-0.5 font-mono text-xs">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={hrefFor(locale)}
          aria-current={locale === current ? "true" : undefined}
          className={`rounded-full px-2.5 py-1 uppercase tracking-wide transition-colors ${
            locale === current
              ? "bg-ink text-bg"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
