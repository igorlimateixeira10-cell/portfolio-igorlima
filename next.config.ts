import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Evita que o Turbopack suba até /Users/igorlima procurando a raiz do
    // workspace por causa do package.json solto que existe lá fora.
    root: path.join(__dirname),
  },
};

export default nextConfig;
