import type { NextConfig } from "next";

/**
 * Export estático: cada ruta se prerenderiza a HTML en el build y se sirve
 * desde la red de Cloudflare (Workers Static Assets), sin servidor ni arranques en frío.
 */
const nextConfig: NextConfig = {
  output: "export",
  reactCompiler: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
