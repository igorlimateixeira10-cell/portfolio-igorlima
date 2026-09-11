import type { Dictionary } from "@/data/dictionaries/pt";

export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pt: () => import("@/data/dictionaries/pt").then((m) => m.pt),
  en: () => import("@/data/dictionaries/en").then((m) => m.en),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
