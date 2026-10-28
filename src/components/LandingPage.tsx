import { Suspense, type ReactNode } from "react";
import { HeroSwitch } from "@/components/layout/HeroSwitch";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { GrantFlow, HoldingFlow, MailFlow } from "@/components/sections/Flows";
import { Connectors, Extras, Faq, Pricing, Privacy, Promises } from "@/components/sections/MoreSections";
import { TeamFlow } from "@/components/sections/team/TeamFlow";
import { StartSection } from "@/components/start/StartSection";
import type { HeroVariant } from "@/content/site";

/**
 * Página completa con la portada elegida. Las tres variantes comparten todo
 * lo demás, así se pueden comparar en igualdad de condiciones.
 */
export function LandingPage({ hero, variant, navTone = "paper" }: { hero: ReactNode; variant: HeroVariant; navTone?: "paper" | "night" }) {
  return (
    <>
      <a className="skip-link" href="#empezar">
        Saltar al diagnóstico
      </a>
      <div style={navTone === "night" ? { position: "absolute", top: 0, left: 0, right: 0, zIndex: 30 } : undefined}>
        <SiteNav tone={navTone} />
      </div>
      {/* Cada <Suspense> es un tramo de hidratación independiente: React 19 los
          hidrata por separado y cede el hilo principal entre ellos (menos TBT).
          La portada va fuera a propósito: si su módulo cliente tarda en cargar
          durante el prerender, un <Suspense> la sacaría del HTML inicial y React
          la insertaría después del primer pintado (LCP tardío en móvil). */}
      <main>
        {hero}
        <Suspense>
          <StartSection />
        </Suspense>
        <Suspense>
          {/* Equipo y agentes: «El circuito» (alternativa B de /equipo). Hueco corto tras «Empezar». */}
          <TeamFlow style={{ paddingTop: 24 }} />
        </Suspense>
        <Suspense>
          <MailFlow />
          <HoldingFlow />
          <GrantFlow />
        </Suspense>
        <Extras />
        <Promises />
        <Suspense>
          <Connectors />
          <Privacy />
        </Suspense>
        <Suspense>
          <Pricing />
          <Faq />
        </Suspense>
      </main>
      <SiteFooter hero={variant} />
      <HeroSwitch current={variant} />
    </>
  );
}
