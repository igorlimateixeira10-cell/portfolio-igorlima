import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Evita que o Turbopack suba até /Users/igorlima procurando a raiz do
    // workspace por causa do package.json solto que existe lá fora.
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        source: "/arkkhe/:asset(astronaut\\.png)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
