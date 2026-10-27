import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { MARK_GEOMETRY } from "@/components/brand/brands";

import { OG_SIZE } from "@/content/site";

const PAPER = "#FDF9F4";
const INK = "#2D2F34";
const CHAR = "#3F434A";
const SLATE = "#5E646E";
const EMBER = "#F67748";
const EMBER_INK = "#AE421A";
const LINE = "#ECEDEF";

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

function Mark({ size: px }: { size: number }) {
  const g = MARK_GEOMETRY.resguardo;
  return (
    <svg width={px} height={px} viewBox="0 0 32 32">
      <path d={g.stem} fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
      <path d={g.arc} fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
      <circle cx={g.dot.cx} cy={g.dot.cy} r={g.dot.r} fill={EMBER} />
    </svg>
  );
}

function Row({ k, v, mark = false }: { k: string; v: string; mark?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, color: CHAR }}>
      <span>{k}</span>
      <span style={mark ? { background: "#FDE6DA", borderRadius: 6, padding: "1px 7px", margin: "-1px -7px" } : {}}>{v}</span>
    </div>
  );
}

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#2F7A3B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Imagen para compartir (1200 × 630), generada en el build con las fuentes de la marca. */
export async function renderOgImage() {
  const [serif, serifItalic, sans, sansBold] = await Promise.all([
    font("newsreader", "newsreader-latin-500-normal.woff"),
    font("newsreader", "newsreader-latin-600-italic.woff"),
    font("public-sans", "public-sans-latin-400-normal.woff"),
    font("public-sans", "public-sans-latin-600-normal.woff"),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: PAPER, padding: "56px 64px", fontFamily: "Public Sans", position: "relative" }}>
        {/* Columna de texto */}
        <div style={{ display: "flex", flexDirection: "column", width: 700, height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Mark size={50} />
            <span style={{ fontFamily: "Newsreader Italic", fontSize: 42, color: INK, letterSpacing: -0.5 }}>resguardo</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 44, fontFamily: "Newsreader", fontSize: 78, lineHeight: 1.02, letterSpacing: -2.4, color: INK }}>
            <span>Crear una holding</span>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <span>nunca fue tan&nbsp;</span>
              <div style={{ display: "flex", position: "relative" }}>
                <span>fácil</span>
                <svg width="198" height="92" viewBox="0 0 200 80" style={{ position: "absolute", left: -20, top: -1 }}>
                  <path d="M14 46 C10 22 62 8 112 9 C160 10 194 26 190 46 C186 68 128 77 80 74 C36 71 8 60 12 40 C15 28 40 18 70 14" fill="none" stroke={EMBER} strokeWidth="3.2" strokeLinecap="round" />
                </svg>
              </div>
              <span>.</span>
            </div>
          </div>

          <div style={{ display: "flex", marginTop: 28, fontSize: 27, lineHeight: 1.4, color: CHAR, maxWidth: 640 }}>
            La gestoría y la abogada de tu grupo de empresas. Los agentes se anticipan a Hacienda; una persona revisa y firma.
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: "auto", alignItems: "center" }}>
            {["Holding", "Gestoría", "Abogada fiscal"].map((t) => (
              <span key={t} style={{ display: "flex", whiteSpace: "nowrap", fontSize: 19, fontWeight: 600, color: CHAR, background: "#F9EFE4", borderRadius: 999, padding: "8px 16px" }}>
                {t}
              </span>
            ))}
            <span style={{ display: "flex", whiteSpace: "nowrap", fontSize: 19, fontWeight: 600, color: INK, background: EMBER, borderRadius: 999, padding: "8px 18px", marginLeft: 6 }}>
              50 € de crédito para empezar
            </span>
          </div>
        </div>

        {/* Papeles */}
        <div style={{ display: "flex", position: "absolute", right: 66, top: 86, width: 370, height: 440 }}>
          <div style={{ display: "flex", position: "absolute", left: 0, top: 0, width: 370, height: 440, background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 16, transform: "rotate(-7deg) translate(-26px, 14px)", boxShadow: "0 4px 18px rgba(0,0,0,0.08)" }} />
          <div style={{ display: "flex", position: "absolute", left: 0, top: 0, width: 370, height: 440, background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 16, transform: "rotate(4deg) translate(18px, -8px)", boxShadow: "0 4px 18px rgba(0,0,0,0.08)" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              position: "absolute",
              left: 0,
              top: 0,
              width: 370,
              height: 440,
              background: "#FFFFFF",
              border: `1px solid ${LINE}`,
              borderRadius: 16,
              padding: "28px 26px",
              transform: "rotate(-1deg)",
              boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
            }}
          >
            <span style={{ fontFamily: "Newsreader", fontSize: 26, color: INK }}>Factura FA-2026-1182</span>
            <Row k="Emisor" v="Distribuciones Levante SL" />
            <Row k="Cliente" v="Andino Foods SL" mark />
            <Row k="Base imponible" v="410,00 €" />
            <Row k="IVA (21 %)" v="86,10 €" />
            <Row k="Total" v="496,10 €" mark />
            <div style={{ display: "flex", height: 10, width: "62%", borderRadius: 5, background: LINE, marginTop: 10 }} />
            <div style={{ display: "flex", height: 10, width: "46%", borderRadius: 5, background: LINE }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto", fontSize: 16, color: SLATE }}>
              <div style={{ display: "flex", width: 22, height: 22, borderRadius: 11, background: "#E9F6EC", color: "#2F7A3B", alignItems: "center", justifyContent: "center" }}>
                <Check />
              </div>
              Aprobada por tu gestor
            </div>
          </div>
          <div
            style={{
              display: "flex",
              position: "absolute",
              right: -26,
              bottom: -22,
              width: 118,
              height: 118,
              borderRadius: 59,
              border: `3px solid ${EMBER}`,
              background: PAPER,
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(-12deg)",
              fontFamily: "Newsreader Italic",
              fontSize: 27,
              color: EMBER_INK,
            }}
          >
            <div style={{ display: "flex", position: "absolute", left: 7, top: 7, width: 98, height: 98, borderRadius: 49, border: `1.5px dashed ${EMBER}` }} />
            V.º B.º
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Newsreader", data: serif, weight: 500, style: "normal" },
        { name: "Newsreader Italic", data: serifItalic, weight: 600, style: "italic" },
        { name: "Public Sans", data: sans, weight: 400, style: "normal" },
        { name: "Public Sans", data: sansBold, weight: 600, style: "normal" },
      ],
    },
  );
}
