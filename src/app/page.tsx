import { HeroClassic } from "@/components/hero/HeroClassic";
import { LandingPage } from "@/components/LandingPage";
import { JsonLd } from "@/lib/jsonld";

export default function Home() {
  return (
    <>
      <LandingPage hero={<HeroClassic />} variant={1} />
      <JsonLd />
    </>
  );
}
