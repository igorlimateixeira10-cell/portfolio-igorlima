import { ImageResponse } from "next/og";
import { isLocale, defaultLocale, getDictionary } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const dict = await getDictionary(locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#f7f8fa",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#2f5cf6" }} />
          <span style={{ fontSize: 26, color: "#4b5163", letterSpacing: 2 }}>IGOR.LIMA</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 30, color: "#1c3fc9", letterSpacing: 3 }}>
            {dict.hero.eyebrow.toUpperCase()}
          </span>
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#0b0d12",
              lineHeight: 1.15,
              maxWidth: 980,
            }}
          >
            {dict.meta.title.split("|")[0].trim()}
          </span>
          <span style={{ fontSize: 28, color: "#4b5163", maxWidth: 820 }}>
            React · Next.js · TypeScript
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
