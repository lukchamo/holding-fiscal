import { ImageResponse } from "next/og";
import { MARK_GEOMETRY } from "@/components/brand/brands";

/** Icono cuadrado: el símbolo en papel sobre tinta (pantalla de inicio de iOS, favicon PNG). */
export function renderSquareIcon(px: number) {
  const g = MARK_GEOMETRY.resguardo;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#2D2F34" }}>
        <svg width={Math.round(px * 0.69)} height={Math.round(px * 0.69)} viewBox="0 0 32 32">
          <path d={g.stem} fill="none" stroke="#FDF9F4" strokeWidth={3.4} strokeLinecap="round" />
          <path d={g.arc} fill="none" stroke="#FDF9F4" strokeWidth={3.4} strokeLinecap="round" />
          <circle cx={g.dot.cx} cy={g.dot.cy} r={g.dot.r} fill="#F67748" />
        </svg>
      </div>
    ),
    { width: px, height: px },
  );
}
