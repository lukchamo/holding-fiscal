import { renderOgImage } from "@/lib/og/OgImage";

export const dynamic = "force-static";

/** /og.png: imagen para compartir, como archivo .png real (el hosting estático la sirve como image/png). */
export function GET() {
  return renderOgImage();
}
