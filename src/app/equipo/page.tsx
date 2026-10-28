import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Team } from "@/components/sections/Team";
import { TeamByPerson } from "@/components/sections/team/TeamByPerson";
import { TeamCases } from "@/components/sections/team/TeamCases";
import { TeamFlow } from "@/components/sections/team/TeamFlow";
import { SITE } from "@/content/site";
import s from "./equipo.module.css";

export const metadata: Metadata = {
  title: `${SITE.name}: alternativas para la sección del equipo`,
  description: "Las secciones de personas y agentes de la landing y tres alternativas de diseño para compararlas en el móvil y en el escritorio.",
  alternates: { canonical: "/equipo" },
  robots: { index: false, follow: true },
};

const OPTIONS = [
  { id: "actual", tag: "Actual", title: "Las dos secciones de ahora", text: "Personas y agentes por separado, con tarjetas grandes. En el móvil ocupan unos 3.400 px de alto." },
  { id: "alt-a", tag: "A", title: "Quién firma qué", text: "Una sola sección agrupada por la persona que valida. La más clara y la más corta en el móvil, y sin JavaScript." },
  { id: "alt-b", tag: "B", title: "El circuito", text: "El recorrido entero: los agentes proponen, las personas validan y tú decides. Toca un agente y su camino se ilumina hasta ti." },
  { id: "alt-c", tag: "C", title: "Un caso por agente", text: "Cada agente con un caso de principio a fin: qué llega, qué prepara, quién lo valida y el resultado." },
] as const;

function Banner({ option }: { option: (typeof OPTIONS)[number] }) {
  return (
    <div className={s.banner}>
      <div className={`wrap ${s.bannerIn}`}>
        <span className={s.tag}>{option.tag}</span>
        <div>
          <p className={s.bTitle}>{option.title}</p>
          <p className={s.bText}>{option.text}</p>
        </div>
      </div>
    </div>
  );
}

export default function EquipoPage() {
  const [actual, a, b, c] = OPTIONS;
  return (
    <>
      <header className={s.top}>
        <div className="wrap">
          <Link href="/hero-5" className={s.back}>
            ← Volver a la portada
          </Link>
          <p className={s.eyebrow}>Propuesta de diseño</p>
          <h1 className={s.title}>Equipo y agentes: tres alternativas</h1>
          <p className="lede">
            Las dos secciones de ahora («Despreocúpate de tenerlo todo bajo control» y «Los agentes que trabajan para ti») y tres maneras de mejorarlas. Mismos datos y misma cabecera en las tres, para comparar solo el diseño.
          </p>
        </div>
      </header>

      <nav className={s.switch} aria-label="Alternativas">
        <div className={`wrap ${s.switchIn}`}>
          {OPTIONS.map((o) => (
            <a key={o.id} href={`#${o.id}`}>
              <b>{o.tag}</b>
              <span>{o.title}</span>
            </a>
          ))}
        </div>
      </nav>

      <main>
        <div id={actual.id} className={s.block}>
          <Banner option={actual} />
          <Team />
        </div>
        <div id={a.id} className={s.block}>
          <Banner option={a} />
          <TeamByPerson id="equipo-a" />
        </div>
        <div id={b.id} className={s.block}>
          <Banner option={b} />
          <TeamFlow id="equipo-b" />
        </div>
        <div id={c.id} className={s.block}>
          <Banner option={c} />
          <TeamCases id="equipo-c" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
