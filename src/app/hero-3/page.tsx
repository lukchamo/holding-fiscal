import type { Metadata } from "next";
import { HeroNight } from "@/components/hero/night/HeroNight";
import { LandingPage } from "@/components/LandingPage";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `${SITE.name}: tu empresa amanece en orden (portada 3)`,
  description: "Variante de portada con una historia humana: la noche de una fundadora mientras los agentes preparan el trabajo y, por la mañana, la abogada lo firma.",
  alternates: { canonical: "/hero-3" },
  robots: { index: false, follow: true },
};

export default function HeroThree() {
  return <LandingPage hero={<HeroNight />} variant={3} navTone="night" />;
}
