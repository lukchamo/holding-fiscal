import type { Metadata } from "next";
import { Brandbook } from "@/components/brandbook/Brandbook";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "resguardo: propuesta de marca y logotipo",
  description: "Propuesta de símbolo animado para resguardo y nombre alternativo, lucero, con su construcción, coreografía y comprobaciones.",
  alternates: { canonical: "/marca" },
  robots: { index: false, follow: true },
};

export default function MarcaPage() {
  return (
    <>
      <main>
        <Brandbook />
      </main>
      <SiteFooter />
    </>
  );
}
