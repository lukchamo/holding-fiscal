import { AGENTS } from "@/content/data";

/**
 * Modelo del equipo para las alternativas de la sección «Equipo»: las dos
 * personas que validan y los agentes que les preparan el trabajo. Qué agente
 * va con qué persona sale de AGENTS (campo «validates»), la fuente única.
 */
export type TeamAgent = (typeof AGENTS)[number];
export type PersonKey = "abogada" | "gestor";

export interface Person {
  key: PersonKey;
  /** Cargo, que encabeza mientras no haya nombre real. */
  role: string;
  /** Forma corta para frases: «Lo valida tu abogada». */
  short: string;
  name: string;
  does: string;
  /** La regla que cumple: nada sale sin esta persona. */
  rule: string;
  validates: TeamAgent["validates"];
}

export const PEOPLE: readonly Person[] = [
  {
    key: "abogada",
    role: "Tu abogada fiscal",
    short: "tu abogada",
    name: "[Nombre de la abogada]",
    does: "Decide la estrategia y firma. Sus agentes le dejan los borradores preparados, con las fuentes citadas.",
    rule: "Nada se presenta sin su firma.",
    validates: "la abogada",
  },
  {
    key: "gestor",
    role: "Tu gestor",
    short: "tu gestor",
    name: "[Nombre del gestor]",
    does: "Lleva tu día a día. Sus agentes te entrevistan, leen tu correo y clasifican tus facturas.",
    rule: "Nada se registra sin su visto bueno.",
    validates: "tu gestor",
  },
];

export const agentsFor = (p: Person) => AGENTS.filter((a) => a.validates === p.validates);

export const personFor = (a: TeamAgent) => PEOPLE.find((p) => p.validates === a.validates) ?? PEOPLE[0];

export interface AgentCase {
  title: string;
  /** Qué llega. */
  arrives: string;
  /** Qué prepara el agente. */
  work: string;
  /** Qué hace la persona que valida. */
  check: string;
  result: string;
}

/** Un caso por agente, con los datos de ejemplo de Andino Foods (los mismos que la portada 5). */
export const CASES: Record<TeamAgent["name"], AgentCase> = {
  Alma: {
    title: "Tu primer diagnóstico",
    arrives: "Escribes: «Tengo tres sociedades y no sé por dónde empezar».",
    work: "Alma te hace cuatro preguntas, reparte el trabajo entre los agentes y prepara tu diagnóstico.",
    check: "Tu gestor lo revisa y lo ajusta contigo.",
    result: "Un plan en 3 semanas, con cada paso asignado.",
  },
  Vera: {
    title: "Una factura en el correo",
    arrives: "Llega la factura FA-2026-1182 de Distribuciones Levante.",
    work: "Vera la reconoce, la asigna a Andino Foods SL y propone la cuenta 602.",
    check: "Tu gestor aprueba el asiento.",
    result: "Registrada en a3, sin teclear nada.",
  },
  Nora: {
    title: "Un requerimiento de IVA",
    arrives: "Hacienda deja una notificación en la DEHú.",
    work: "Nora la lee el mismo día, reúne las facturas y redacta la respuesta con las fuentes citadas.",
    check: "Tu abogada revisa el borrador y lo firma.",
    result: "Respondido en plazo.",
  },
  Bruno: {
    title: "Una ayuda que encaja",
    arrives: "Se abre una convocatoria para la inversión productiva de pymes.",
    work: "Bruno calcula el encaje (86 %) y redacta la memoria técnica.",
    check: "Tu abogada revisa la solicitud y da el V.º B.º.",
    result: "Presentada a tiempo: hasta 54.000 €.",
  },
  Elio: {
    title: "Tres sociedades, una holding",
    arrives: "Andino Foods y Andino Inmuebles tienen la misma socia.",
    work: "Elio propone una holding y comprueba la sustancia: medios y decisiones.",
    check: "Tu abogada valida la estructura y coordina la escritura con la notaría.",
    result: "Andino Holding SL, sobre Foods e Inmuebles.",
  },
};
