import type { Metadata } from "next";
import { AppShell } from "@/components/dashboard/AppShell";
import { DashCalendario } from "@/components/dashboard/DashCalendario";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `${SITE.name}: panel operativo, alternativa C (Calendario)`,
  description: "Panel operativo centrado en el tiempo: cronograma por sociedad con cada plazo, quién lo prepara y quién lo revisa.",
  alternates: { canonical: "/design/calendario" },
  robots: { index: false, follow: true },
};

export default function DesignCalendario() {
  return (
    <AppShell current="calendario">
      <DashCalendario />
    </AppShell>
  );
}
