import type { Metadata } from "next";
import { HeroPlatform } from "@/components/hero/platform/HeroPlatform";
import { LandingPage } from "@/components/LandingPage";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `${SITE.name}: una sola plataforma para tu grupo de empresas (portada 5)`,
  description: "Variante de portada centrada en el producto: Hacienda, facturas, ayudas y holding en un mismo panel, con agentes que proponen y una abogada que firma.",
  alternates: { canonical: "/hero-5" },
  robots: { index: false, follow: true },
};

export default function HeroFive() {
  return <LandingPage hero={<HeroPlatform />} variant={5} />;
}
