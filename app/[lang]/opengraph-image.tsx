import { readFile } from "fs/promises";
import path from "path";
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

  // Lido do disco e embutido como data URI — é o mesmo arquivo do favicon
  // (app/apple-icon.png, gerado a partir do public/logo.png), sem precisar
  // duplicar a arte nem fazer uma requisição de rede à parte.
  const logoBuffer = await readFile(path.join(process.cwd(), "app", "apple-icon.png"));
  const logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`;

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
          background: "#0a0714",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src={logoDataUrl} width={40} height={40} alt="" />
          <span style={{ fontSize: 26, color: "#b3aed1", letterSpacing: 2 }}>IGOR.LIMA</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 30, color: "#3b82f6", letterSpacing: 3 }}>
            {dict.hero.eyebrow.toUpperCase()}
          </span>
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#f6f4ff",
              lineHeight: 1.15,
              maxWidth: 980,
            }}
          >
            {dict.meta.title.split("|")[0].trim()}
          </span>
          <span style={{ fontSize: 28, color: "#b3aed1", maxWidth: 820 }}>
            React · Next.js · TypeScript
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
