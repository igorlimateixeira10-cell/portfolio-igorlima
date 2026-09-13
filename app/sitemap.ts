import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return locales.map((locale) => ({
    url: new URL(`/${locale}`, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "pt" ? 1 : 0.9,
  }));
}
