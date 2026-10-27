import type { CSSProperties, ReactNode } from "react";
import { trunc } from "./interviewData";
import s from "./Start.module.css";

export type Skel = "card" | "tree" | "grid" | "list";

export interface LogDef {
  verb?: string;
  what: string;
  res?: string;
  ms: number;
  note?: boolean;
}

export interface StepDef {
  title: string;
  agent: string;
  sum: string;
  skel: Skel;
  logs: LogDef[];
  /** Clave del resultado; se pinta en DiagnosisView. */
  result: "company" | "structure" | "grants" | "hacienda" | "plan";
  week1?: string;
}

/** Pasos del diagnóstico en directo (mismos datos de ejemplo que el prototipo). */
export function buildSteps(desc: string, socSel: number | undefined, cert: number | undefined): StepDef[] {
  const socText = ["ninguna aún", "una", "de dos a cuatro", "cinco o más"][socSel ?? -1] ?? "sin indicar";
  const first: LogDef[] = [{ verb: "Leyendo", what: "tus respuestas", res: desc ? `«${trunc(desc)}»` : "obrador, supermercados, Castellón", ms: 1500 }];
  if (desc) first.push({ note: true, what: "Para esta demostración seguimos con una empresa de ejemplo: Andino Foods SL.", ms: 1200 });
  first.push(
    { verb: "Consultando", what: "BORME", res: "Andino Foods SL, constituida en 2023", ms: 1600 },
    { verb: "Abriendo", what: "andinofoods.es", res: "catálogo y clientes de gran distribución", ms: 1500 },
    { verb: "Comparando", what: "lo dicho con lo verificado", res: "1 dato por confirmar", ms: 1300 },
  );
  const week1 =
    cert === 1
      ? "Tramitar tu apoderamiento, responder la notificación de Hacienda y renovar el certificado."
      : "Responder la notificación de Hacienda y renovar el certificado.";

  return [
    { title: "Entender tu empresa", agent: "Alma", sum: "Andino Foods SL, 7 personas", skel: "card", logs: first, result: "company" },
    {
      title: "Mirar tu estructura",
      agent: "Elio",
      sum: "2 sociedades, sin holding",
      skel: "tree",
      logs: [
        { verb: "Leyendo", what: "tu respuesta", res: `sociedades: ${socText}`, ms: 1300 },
        { verb: "Consultando", what: "BORME", res: "Andino Inmuebles SL, misma socia", ms: 1600 },
        { verb: "Comparando", what: "las dos sociedades", res: "no hay nada que las una", ms: 1400 },
      ],
      result: "structure",
    },
    {
      title: "Buscar ayudas",
      agent: "Bruno",
      sum: "3 ayudas, hasta 85.000 €",
      skel: "grid",
      logs: [
        { verb: "Consultando", what: "BDNS", res: "412 convocatorias abiertas", ms: 1700 },
        { verb: "Consultando", what: "Fandit", res: "histórico de 6 años", ms: 1400 },
        { verb: "Filtrando", what: "por territorio, tamaño y sector", res: "9 encajan", ms: 1500 },
        { verb: "Ordenando", what: "por encaje y plazo", res: "3 recomendadas", ms: 1200 },
      ],
      result: "grants",
    },
    {
      title: "Anticiparnos a Hacienda",
      agent: "Nora",
      sum: "1 aviso urgente",
      skel: "list",
      logs: [
        { verb: "Consultando", what: "DEHú", res: "1 notificación sin leer", ms: 1600 },
        { verb: "Revisando", what: "certificados", res: "el de la Seguridad Social ha caducado", ms: 1500 },
        { verb: "Comprobando", what: "cuentas anuales", res: "las de 2025 no están depositadas", ms: 1400 },
      ],
      result: "hacienda",
    },
    {
      title: "Preparar tu plan",
      agent: "Alma",
      sum: "Listo para empezar",
      skel: "list",
      logs: [
        { verb: "Ordenando", what: "prioridades", res: "primero lo urgente, después el dinero", ms: 1400 },
        { verb: "Asignando", what: "a la abogada", res: "revisión en 48 h", ms: 1300 },
      ],
      result: "plan",
      week1,
    },
  ];
}

/* ---------- Esqueletos mientras el agente explora ---------- */

const sk = (style?: CSSProperties, extra = "") => <span className={`${s.sk} ${extra}`} style={style} />;

export function Skeleton({ kind }: { kind: Skel }): ReactNode {
  if (kind === "card")
    return (
      <div className={s.skel}>
        {sk({ width: "42%" }, s.skh)}
        {sk({ width: "94%" })}
        {sk({ width: "82%" })}
        <div className={s.skRow}>
          {sk(undefined, s.pill)}
          {sk(undefined, s.pill)}
          {sk(undefined, s.pill)}
        </div>
      </div>
    );
  if (kind === "tree")
    return (
      <div className={s.skel} style={{ justifyItems: "center" }}>
        {sk({ width: 160 }, s.skh)}
        {sk({ width: 2, height: 18 })}
        <div className={s.skRow} style={{ width: "100%", justifyContent: "space-around" }}>
          {sk({ width: "38%" }, s.skh)}
          {sk({ width: "38%" }, s.skh)}
        </div>
        {sk({ width: "70%" })}
      </div>
    );
  if (kind === "grid")
    return (
      <div className={s.skGrid}>
        {[
          ["80%", "60%", "90%", "50%"],
          ["75%", "55%", "90%", "45%"],
          ["70%", "60%", "85%", "50%"],
        ].map((w, i) => (
          <div className={s.skel} key={i}>
            {sk({ width: w[0] }, s.skh)}
            {sk({ width: w[1] })}
            {sk({ width: w[2] })}
            {sk({ width: w[3] })}
          </div>
        ))}
      </div>
    );
  return (
    <div className={s.skel}>
      {["70%", "62%", "76%"].map((w) => (
        <div className={s.skRow} style={{ alignItems: "center" }} key={w}>
          {sk({ width: 26, height: 26, borderRadius: "50%" })}
          {sk({ width: w })}
        </div>
      ))}
    </div>
  );
}
