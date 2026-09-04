import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon simples (monograma "IL") gerado em runtime — sem depender de
// nenhuma arte/logo pronta, já que ainda não existe uma identidade visual
// definida para a marca pessoal.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0d12",
          color: "#f7f8fa",
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "monospace",
          borderRadius: 6,
        }}
      >
        IL
      </div>
    ),
    { ...size }
  );
}
