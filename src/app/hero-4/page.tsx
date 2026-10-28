import type { Metadata } from "next";
import { HeroProblem } from "@/components/hero/problem/HeroProblem";
import { LandingPage } from "@/components/LandingPage";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `${SITE.name}: tres sociedades, dos gestorías, ningún plan (portada 4)`,
  description: "Variante de portada minimalista que empieza por el problema: tus sociedades bajo una holding, un solo equipo y un plan en tres semanas.",
  alternates: { canonical: "/hero-4" },
  robots: { index: false, follow: true },
};

export default function HeroFour() {
  return <LandingPage hero={<HeroProblem />} variant={4} />;
}
