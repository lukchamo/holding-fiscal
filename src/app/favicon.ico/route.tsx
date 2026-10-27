import { renderSquareIcon } from "@/lib/og/AppleIcon";

export const dynamic = "force-static";

/** /favicon.ico para los navegadores que lo piden sin mirar el <link rel="icon"> (PNG dentro de .ico, lo aceptan todos). */
export function GET() {
  return renderSquareIcon(48);
}
