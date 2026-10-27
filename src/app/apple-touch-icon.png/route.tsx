import { renderSquareIcon } from "@/lib/og/AppleIcon";

export const dynamic = "force-static";

/** /apple-touch-icon.png: la ruta que iOS pide por defecto. */
export function GET() {
  return renderSquareIcon(180);
}
