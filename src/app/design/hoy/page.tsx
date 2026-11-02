import type { Metadata } from "next";
import { AppShell } from "@/components/dashboard/AppShell";
import { DashHoy } from "@/components/dashboard/DashHoy";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `${SITE.name}: panel operativo, alternativa A (Hoy)`,
  description: "Panel operativo centrado en la acción: lo que solo puedes hacer tú, lo que ha hecho tu equipo y los próximos plazos.",
  alternates: { canonical: "/design/hoy" },
  robots: { index: false, follow: true },
};

export default function DesignHoy() {
  return (
    <AppShell current="hoy">
      <DashHoy />
    </AppShell>
  );
}
