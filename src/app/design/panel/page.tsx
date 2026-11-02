import type { Metadata } from "next";
import { AppShell } from "@/components/dashboard/AppShell";
import { DashPanel } from "@/components/dashboard/DashPanel";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `${SITE.name}: panel operativo, alternativa B (Panel)`,
  description: "Panel operativo centrado en los indicadores: plazos, facturas, ayudas, caja y agentes, con un filtro por sociedad.",
  alternates: { canonical: "/design/panel" },
  robots: { index: false, follow: true },
};

export default function DesignPanel() {
  return (
    <AppShell current="panel">
      <DashPanel />
    </AppShell>
  );
}
