import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";

export const metadata: Metadata = {
  title: "Página no encontrada · resguardo",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="wrap" style={{ minHeight: "80vh", display: "grid", placeItems: "center", textAlign: "center", padding: "48px 18px" }}>
      <div style={{ display: "grid", justifyItems: "center", gap: 14, maxWidth: "34rem" }}>
        <LogoMark brand="resguardo" size={72} animated />
        <h1 style={{ fontSize: "clamp(34px, 3vw + 18px, 56px)", lineHeight: 1.08 }}>Esta página se ha traspapelado.</h1>
        <p className="lede" style={{ margin: 0 }}>
          A nosotros no se nos pierde una factura, pero esta dirección no existe. Volvamos a lo importante.
        </p>
        <Link href="/" className="btn btn-ember" style={{ marginTop: 8 }}>
          Ir a la portada
        </Link>
      </div>
    </main>
  );
}
