import type { Metadata } from "next";
import { HeroChaos } from "@/components/hero/chaos/HeroChaos";
import { LandingPage } from "@/components/LandingPage";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `${SITE.name}: del caos a la calma (portada 2)`,
  description: "Variante de portada con una historia contada con el scroll: tus papeles pasan del caos al orden, las personas los firman y respiras.",
  alternates: { canonical: "/hero-2" },
  robots: { index: false, follow: true },
};

export default function HeroTwo() {
  return <LandingPage hero={<HeroChaos />} variant={2} />;
}
