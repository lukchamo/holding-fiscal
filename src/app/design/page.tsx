import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE } from "@/content/site";
import s from "./design.module.css";

export const metadata: Metadata = {
  title: `${SITE.name}: panel operativo, tres alternativas de UI`,
  description: "Tres maneras de abrir la app de resguardo: Hoy (lo que te toca), Panel (cómo va el grupo) y Calendario (qué viene y cuándo), con los mismos datos.",
  alternates: { canonical: "/design" },
  robots: { index: false, follow: true },
};

const OPTIONS = [
  {
    key: "hoy",
    tag: "A",
    name: "Hoy",
    question: "¿Qué tengo que hacer yo hoy?",
    text: "Empieza por lo que solo puedes hacer tú: firmar o aprobar lo que ya han preparado los agentes y ha revisado una persona. Lo demás queda como contexto: lo que ha hecho el equipo, los próximos plazos y Alma.",
    points: ["Firmas y deshaces desde la propia tarjeta", "Cada tarea dice quién la preparó y quién la revisó", "Alma responde las dudas más habituales"],
    best: "La fundadora o el gerente que entra un par de veces por semana.",
  },
  {
    key: "panel",
    tag: "B",
    name: "Panel",
    question: "¿Cómo va mi grupo?",
    text: "Indicadores con su contexto y las gráficas justas. Un único filtro por sociedad gobierna todo lo de debajo, así las cifras siempre cuadran entre sí.",
    points: ["Plazos, facturas, ayudas y caja de un vistazo", "Cada gráfica tiene su tabla y se recorre con el teclado", "Exporta los datos a CSV"],
    best: "Quien lleva las finanzas o informa a los socios.",
  },
  {
    key: "calendario",
    tag: "C",
    name: "Calendario",
    question: "¿Qué viene y cuándo?",
    text: "Cada sociedad es un carril y cada plazo, una barra desde que el agente empieza a prepararlo hasta que vence. La línea de hoy separa lo hecho de lo que viene.",
    points: ["Plazos reales del calendario de la AEAT para 2026-27", "Ficha de cada plazo con sus pasos y quién interviene", "En el móvil se convierte en una agenda"],
    best: "Grupos con varias sociedades y muchos plazos.",
  },
] as const;

const COMPARE: readonly [string, string, string, string][] = [
  ["Qué va primero", "Lo que tienes que firmar o aprobar", "Indicadores del grupo", "El cronograma de plazos"],
  ["Interacción clave", "Firmar, deshacer y preguntar a Alma", "Filtrar por sociedad y leer cada gráfica", "Filtrar por estado y abrir la ficha de un plazo"],
  ["En el móvil", "Una lista de tarjetas: la más natural", "Indicadores de dos en dos y gráficas apiladas", "Agenda por meses (el cronograma, desde la tableta)"],
  ["Ideal para", "Fundadora o gerente", "Finanzas y socios", "Grupos con muchas sociedades"],
];

export default function DesignIndex() {
  return (
    <>
      <header className={s.top}>
        <div className="wrap">
          <Link href="/hero-5" className={s.back}>
            ← Volver a la portada
          </Link>
          <p className={s.eyebrow}>Propuesta de diseño · Panel operativo</p>
          <h1 className={s.title}>Tres maneras de abrir la app</h1>
          <p className="lede">
            Lo que verá Mariana al entrar en {SITE.name}. Las tres usan los mismos datos de Grupo Andino y el mismo armazón (barra lateral, búsqueda, avisos y tu equipo); cambia lo que se pone primero. Son prototipos navegables: prueba a firmar, filtrar o abrir un plazo.
          </p>
        </div>
      </header>

      <main className="wrap">
        <ul className={s.options}>
          {OPTIONS.map((o, i) => (
            <li key={o.key} className={s.option} data-flip={i % 2 === 1}>
              <Link href={`/design/${o.key}`} className={s.shots} prefetch={false} aria-label={`Abrir la alternativa ${o.tag}: ${o.name}`}>
                <span className={s.browser}>
                  <span className={s.dots} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <Image src={`/design/${o.key}-escritorio.webp`} alt="" width={1200} height={750} sizes="(min-width: 1000px) 640px, 92vw" priority={i === 0} />
                </span>
                <span className={s.phone}>
                  <Image src={`/design/${o.key}-movil.webp`} alt="" width={390} height={844} sizes="140px" />
                </span>
              </Link>
              <div className={s.text}>
                <p className={s.tagline}>
                  <span className={s.tag}>{o.tag}</span> Alternativa {o.tag}
                </p>
                <h2>{o.name}</h2>
                <p className={s.question}>«{o.question}»</p>
                <p>{o.text}</p>
                <ul className={s.points}>
                  {o.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p className={s.best}>
                  <b>Ideal para:</b> {o.best}
                </p>
                <Link href={`/design/${o.key}`} className={`btn btn-dark ${s.open}`} prefetch={false}>
                  Abrir la alternativa {o.tag} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <section className={s.compare} aria-labelledby="h-comparar">
          <h2 id="h-comparar">De un vistazo</h2>
          <div className={s.scrollX}>
            <table>
              <thead>
                <tr>
                  <td />
                  {OPTIONS.map((o) => (
                    <th key={o.key} scope="col">
                      {o.tag} · {o.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Pregunta que responde</th>
                  {OPTIONS.map((o) => (
                    <td key={o.key}>«{o.question}»</td>
                  ))}
                </tr>
                {COMPARE.map(([label, ...cells]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {cells.map((c, i) => (
                      <td key={i}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.reco} aria-labelledby="h-reco">
          <h2 id="h-reco">Nuestra recomendación</h2>
          <p>
            <b>A como pantalla de inicio.</b> Con una gestoría que trabaja por ti, lo que más valor da al entrar es saber qué te toca a ti; lo demás ya está en marcha. B y C no se descartan: encajan como las secciones «Indicadores» y «Calendario» de la misma app, con el mismo armazón.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
