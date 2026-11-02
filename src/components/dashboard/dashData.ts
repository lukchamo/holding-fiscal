import { AGENTS, TEAM } from "@/content/data";

/**
 * Datos de ejemplo del panel operativo (Grupo Andino, el caso del resto de la
 * web). Una sola fuente para las tres alternativas de /design, así se comparan
 * con la misma información. Fechas en ISO; el «hoy» del prototipo es fijo.
 */
export const TODAY_ISO = "2026-11-02";
export const TODAY_LABEL = "Lunes, 2 de noviembre";
export const USER = { name: "Mariana Ortega", first: "Mariana" };
export const GROUP = "Grupo Andino";

export type CompanyKey = "holding" | "foods" | "inmuebles";
export type AgentName = (typeof AGENTS)[number]["name"];
export type Reviewer = keyof typeof TEAM;

/** Colores de serie validados (claro y oscuro) con el validador de paletas: morado, verde y dorado. */
export const COMPANIES: readonly { key: CompanyKey; name: string; short: string; color: string; note?: string }[] = [
  { key: "holding", name: "Andino Holding SL", short: "Holding", color: "var(--co-holding)", note: "En constitución" },
  { key: "foods", name: "Andino Foods SL", short: "Foods", color: "var(--co-foods)" },
  { key: "inmuebles", name: "Andino Inmuebles SL", short: "Inmuebles", color: "var(--co-inmuebles)" },
];

export const companyOf = (k: CompanyKey) => COMPANIES.find((c) => c.key === k) ?? COMPANIES[0];
export const agentOf = (n: AgentName) => AGENTS.find((a) => a.name === n) ?? AGENTS[0];
export const reviewerOf = (r: Reviewer) => TEAM[r];

/* ---------- Fechas (UTC: el servidor y el navegador calculan lo mismo) ---------- */
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MONTHS_LONG = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const WEEKDAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const DAY = 86_400_000;

export const toTime = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
export const TODAY = toTime(TODAY_ISO);
export const daysFrom = (iso: string, from = TODAY) => Math.round((toTime(iso) - from) / DAY);
export const addDays = (iso: string, n: number) => new Date(toTime(iso) + n * DAY).toISOString().slice(0, 10);
export const dayOf = (iso: string) => new Date(toTime(iso)).getUTCDate();
export const monthShort = (iso: string) => MONTHS[new Date(toTime(iso)).getUTCMonth()];
export const monthLong = (iso: string) => MONTHS_LONG[new Date(toTime(iso)).getUTCMonth()];
export const weekday = (iso: string) => WEEKDAYS[new Date(toTime(iso)).getUTCDay()];
export const shortDate = (iso: string) => `${dayOf(iso)} ${monthShort(iso)}`;

export function dueLabel(iso: string) {
  const n = daysFrom(iso);
  if (n < 0) return `presentado el ${shortDate(iso)}`;
  if (n === 0) return "vence hoy";
  if (n === 1) return "vence mañana";
  return `vence en ${n} días`;
}

const EUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const NUM = new Intl.NumberFormat("es-ES", { useGrouping: true });
export const eur = (v: number) => EUR.format(v);
export const num = (v: number) => NUM.format(v);
/** Compacto para ejes y chips: 223.600 € → 224 k€. */
export const eurK = (v: number) => `${NUM.format(Math.round(v / 1000))}\u00a0k€`;

/* ---------- Lo que te necesita ---------- */
export interface Decision {
  id: string;
  company: CompanyKey;
  title: string;
  text: string;
  agent: AgentName;
  reviewer: Reviewer;
  due: string;
  action: string;
  secondary: string;
  /** Resumen del documento que se abre con el botón secundario. */
  preview: readonly string[];
}

export const DECISIONS: readonly Decision[] = [
  {
    id: "iva",
    company: "foods",
    title: "Firma la respuesta al requerimiento de IVA",
    text: "Nora la redactó con las facturas del segundo trimestre y las fuentes citadas.",
    agent: "Nora",
    reviewer: "abogada",
    due: "2026-11-11",
    action: "Firmar",
    secondary: "Ver borrador",
    preview: ["Respuesta de 2 páginas con 14 facturas adjuntas", "Fundamento: artículo 97 de la Ley 37/1992 del IVA", "Se presenta en la sede electrónica con tu certificado"],
  },
  {
    id: "ayuda",
    company: "foods",
    title: "Firma la solicitud de la ayuda a la inversión",
    text: "Bruno calculó un encaje del 86 % y redactó la memoria técnica. Hasta 54.000 €.",
    agent: "Bruno",
    reviewer: "abogada",
    due: "2026-11-20",
    action: "Firmar",
    secondary: "Ver solicitud",
    preview: ["Inversión prevista: 180.000 € en el obrador", "Ayuda solicitada: hasta 54.000 € (30 %)", "Memoria técnica de 12 páginas con la puntuación estimada"],
  },
  {
    id: "holding",
    company: "holding",
    title: "Aprueba la estructura de la holding",
    text: "Elio propone Andino Holding SL sobre Foods e Inmuebles. Hay cita en la notaría el 24 de noviembre.",
    agent: "Elio",
    reviewer: "abogada",
    due: "2026-11-24",
    action: "Aprobar",
    secondary: "Ver propuesta",
    preview: ["Andino Holding SL con el 100 % de Foods e Inmuebles", "Aportación de participaciones con el régimen de neutralidad fiscal", "Escritura en la notaría el 24 de noviembre a las 10:00"],
  },
];

/* ---------- Lo que ha hecho el equipo ---------- */
export interface Activity {
  id: string;
  day: "Hoy" | "Ayer";
  time: string;
  agent: AgentName;
  company: CompanyKey | null;
  text: string;
  /** Quién lo valida y si ya lo ha hecho. */
  review: { by: Reviewer; done: boolean; note?: string } | null;
}

export const ACTIVITY: readonly Activity[] = [
  { id: "a1", day: "Hoy", time: "07:52", agent: "Nora", company: "foods", text: "Leyó una notificación de la DEHú: requerimiento de IVA. Dejó listo el borrador de respuesta.", review: { by: "abogada", done: true } },
  { id: "a2", day: "Hoy", time: "06:30", agent: "Vera", company: "foods", text: "Clasificó 34 facturas del correo y apartó una repetida.", review: { by: "gestor", done: false, note: "3 esperan su visto bueno" } },
  { id: "a3", day: "Ayer", time: "23:47", agent: "Bruno", company: "foods", text: "Encontró 9 convocatorias abiertas; 3 encajan con tu proyecto.", review: { by: "abogada", done: true } },
  { id: "a4", day: "Ayer", time: "18:10", agent: "Elio", company: "holding", text: "Comprobó la sustancia de la holding: medios y decisiones.", review: { by: "abogada", done: true } },
  { id: "a5", day: "Ayer", time: "09:05", agent: "Alma", company: null, text: "Te dejó el resumen de la semana: todo en plazo.", review: null },
];

/* ---------- Calendario fiscal del grupo ---------- */
export type ObState = "done" | "you" | "review" | "prep" | "scheduled";

export const STATE_LABEL: Record<ObState, string> = {
  done: "Hecho",
  you: "Te necesita",
  review: "En revisión",
  prep: "Preparando",
  scheduled: "Programado",
};

export interface Obligation {
  id: string;
  company: CompanyKey;
  title: string;
  /** Nombre corto para el cronograma. */
  short: string;
  agent: AgentName;
  reviewer: Reviewer;
  /** Desde cuándo lo prepara el agente. */
  from: string;
  due: string;
  state: ObState;
}

/* Plazos reales del calendario de la AEAT para 2026-27 (si el último día cae en fin de semana, pasa al lunes). */
export const OBLIGATIONS: readonly Obligation[] = [
  { id: "303-3t-foods", company: "foods", title: "Modelo 303 · IVA del 3.er trimestre", short: "IVA 3T · 303", agent: "Nora", reviewer: "gestor", from: "2026-10-01", due: "2026-10-20", state: "done" },
  { id: "111-3t-foods", company: "foods", title: "Modelo 111 · Retenciones del 3.er trimestre", short: "Retenciones 3T · 111", agent: "Vera", reviewer: "gestor", from: "2026-10-05", due: "2026-10-20", state: "done" },
  { id: "303-3t-inm", company: "inmuebles", title: "Modelo 303 · IVA del 3.er trimestre", short: "IVA 3T · 303", agent: "Nora", reviewer: "gestor", from: "2026-10-01", due: "2026-10-20", state: "done" },
  { id: "holding", company: "holding", title: "Escritura de la holding", short: "Escritura de la holding", agent: "Elio", reviewer: "abogada", from: "2026-10-12", due: "2026-11-24", state: "you" },
  { id: "ayuda", company: "foods", title: "Ayuda a la inversión productiva", short: "Ayuda a la inversión", agent: "Bruno", reviewer: "abogada", from: "2026-10-19", due: "2026-11-20", state: "you" },
  { id: "req-iva", company: "foods", title: "Requerimiento de IVA", short: "Requerimiento de IVA", agent: "Nora", reviewer: "abogada", from: "2026-10-28", due: "2026-11-11", state: "you" },
  { id: "cierre-foods", company: "foods", title: "Cierre contable de octubre", short: "Cierre de octubre", agent: "Vera", reviewer: "gestor", from: "2026-11-01", due: "2026-11-10", state: "prep" },
  { id: "cierre-inm", company: "inmuebles", title: "Cierre contable de octubre", short: "Cierre de octubre", agent: "Vera", reviewer: "gestor", from: "2026-10-30", due: "2026-11-06", state: "review" },
  { id: "ss-oct", company: "foods", title: "Seguros sociales de octubre", short: "Seguros sociales", agent: "Vera", reviewer: "gestor", from: "2026-11-16", due: "2026-11-30", state: "scheduled" },
  { id: "036-holding", company: "holding", title: "Alta en Hacienda (modelo 036)", short: "Alta censal · 036", agent: "Elio", reviewer: "gestor", from: "2026-11-25", due: "2026-12-10", state: "scheduled" },
  { id: "cert-inm", company: "inmuebles", title: "Renovar el certificado digital", short: "Certificado digital", agent: "Alma", reviewer: "gestor", from: "2026-11-23", due: "2026-12-17", state: "scheduled" },
  { id: "202-foods", company: "foods", title: "Modelo 202 · 3.er pago a cuenta", short: "Pago a cuenta · 202", agent: "Nora", reviewer: "gestor", from: "2026-12-01", due: "2026-12-21", state: "scheduled" },
  { id: "202-inm", company: "inmuebles", title: "Modelo 202 · 3.er pago a cuenta", short: "Pago a cuenta · 202", agent: "Nora", reviewer: "gestor", from: "2026-12-01", due: "2026-12-21", state: "scheduled" },
  { id: "111-4t-foods", company: "foods", title: "Modelos 111 y 115 · Retenciones del 4.º trimestre", short: "Retenciones 4T · 111 y 115", agent: "Vera", reviewer: "gestor", from: "2027-01-02", due: "2027-01-20", state: "scheduled" },
  { id: "303-4t-foods", company: "foods", title: "Modelos 303 y 390 · IVA del 4.º trimestre y resumen anual", short: "IVA 4T y anual · 303 y 390", agent: "Nora", reviewer: "gestor", from: "2027-01-04", due: "2027-02-01", state: "scheduled" },
  { id: "303-4t-inm", company: "inmuebles", title: "Modelos 303 y 390 · IVA del 4.º trimestre y resumen anual", short: "IVA 4T y anual · 303 y 390", agent: "Nora", reviewer: "gestor", from: "2027-01-04", due: "2027-02-01", state: "scheduled" },
  { id: "347-foods", company: "foods", title: "Modelo 347 · Operaciones con terceros", short: "Terceros · 347", agent: "Vera", reviewer: "gestor", from: "2027-02-01", due: "2027-03-01", state: "scheduled" },
];

/** Lo que aún no está hecho, por fecha de vencimiento. */
export const UPCOMING = [...OBLIGATIONS].filter((o) => o.state !== "done").sort((a, b) => toTime(a.due) - toTime(b.due));

/* ---------- Indicadores (panel) ---------- */
export type Scope = "group" | CompanyKey;

export const MONTHS6 = ["may", "jun", "jul", "ago", "sep", "oct"] as const;
/** Facturas recibidas por mes (las que ve la portada 5: 84, 92, 101, 97, 118, 131 en total). */
export const INVOICES: Record<"foods" | "inmuebles", readonly number[]> = {
  foods: [74, 81, 88, 84, 103, 115],
  inmuebles: [10, 11, 13, 13, 15, 16],
};
/** Saldo a fin de mes, en euros. */
export const CASH: Record<"foods" | "inmuebles", readonly number[]> = {
  foods: [158_200, 166_000, 161_400, 171_900, 176_300, 182_400],
  inmuebles: [39_800, 39_100, 39_900, 40_600, 40_200, 41_200],
};
export const BANKS: readonly { bank: string; company: CompanyKey; balance: number }[] = [
  { bank: "BBVA", company: "foods", balance: 152_300 },
  { bank: "Sabadell", company: "foods", balance: 30_100 },
  { bank: "Santander", company: "inmuebles", balance: 41_200 },
];
/** Presentaciones de 2026: en plazo / total. */
export const FILINGS: Record<CompanyKey, readonly [number, number]> = { holding: [0, 0], foods: [9, 9], inmuebles: [3, 3] };
/** Facturas de octubre: clasificadas / recibidas. */
export const CLASSIFIED: Record<CompanyKey, readonly [number, number]> = { holding: [0, 0], foods: [112, 115], inmuebles: [16, 16] };

export const GRANTS: readonly { label: string; company: CompanyKey; amount: number; fit: number; state: string }[] = [
  { label: "Inversión productiva de pymes", company: "foods", amount: 54_000, fit: 86, state: "Falta tu firma" },
  { label: "Contratación indefinida de jóvenes", company: "foods", amount: 24_000, fit: 78, state: "Bruno la prepara" },
  { label: "Digitalización de pymes", company: "foods", amount: 7_000, fit: 71, state: "Bruno la prepara" },
];

export const AGENT_LOAD: readonly { agent: AgentName; doing: number; doneWeek: number; waiting: number; scope: CompanyKey[] }[] = [
  { agent: "Alma", doing: 1, doneWeek: 6, waiting: 0, scope: ["holding", "foods", "inmuebles"] },
  { agent: "Vera", doing: 2, doneWeek: 41, waiting: 3, scope: ["foods", "inmuebles"] },
  { agent: "Nora", doing: 1, doneWeek: 5, waiting: 0, scope: ["foods", "inmuebles"] },
  { agent: "Bruno", doing: 2, doneWeek: 2, waiting: 0, scope: ["foods"] },
  { agent: "Elio", doing: 1, doneWeek: 3, waiting: 0, scope: ["holding"] },
];

export const ALERTS: readonly { level: "attention" | "info"; title: string; text: string; company: CompanyKey }[] = [
  { level: "attention", title: "Requerimiento de IVA abierto", text: `Responde antes del 11 nov. El borrador está listo y revisado por ${TEAM.abogada.first}.`, company: "foods" },
  { level: "info", title: "El certificado digital caduca el 17 dic", text: "Alma lo renovará con tu apoderamiento; no tienes que hacer nada.", company: "inmuebles" },
  { level: "info", title: "3 facturas esperan el visto bueno", text: `Vera las clasificó; ${TEAM.gestor.first} las revisa hoy.`, company: "foods" },
];

/** Respuestas de ejemplo de Alma a las preguntas sugeridas. */
export const ALMA_QA: readonly { q: string; a: string }[] = [
  {
    q: "¿Por qué me escribe Hacienda?",
    a: `Piden justificar el IVA soportado del segundo trimestre de Andino Foods. Es habitual y lo tenemos todo: 14 facturas y la respuesta, revisada por ${TEAM.abogada.first}. Solo falta tu firma.`,
  },
  {
    q: "¿Qué falta para la holding?",
    a: `Tu aprobación y la firma en la notaría el 24 de noviembre. ${TEAM.abogada.first} ya validó la estructura y Elio tiene preparados los estatutos.`,
  },
  {
    q: "¿Cuánto IVA pagaré en enero?",
    a: `Con lo que llevamos del trimestre, unos 18.400 € entre Foods e Inmuebles. Nora lo afinará con las facturas de diciembre y ${TEAM.gestor.first} lo revisará antes del 1 de febrero.`,
  },
];
