/**
 * Guion de «La noche de Mariana» (historia ilustrativa con los datos de
 * ejemplo del prototipo). El scroll hace avanzar un reloj: de las 23:47 a las
 * 08:15. La noche se cuenta como una bitácora (hora, agente, acción) y la
 * mañana termina con el visto bueno de una persona.
 */
import type { Chapter } from "@/components/story/useStory";

export const CHAPTERS: Chapter[] = [
  { id: "inicio", label: "Esta noche", from: 0, to: 0.14 },
  { id: "cierre", label: "23:47", from: 0.14, to: 0.3 },
  { id: "noche", label: "00:12", from: 0.3, to: 0.56 },
  { id: "cafe", label: "07:30", from: 0.56, to: 0.78 },
  { id: "manana", label: "08:15", from: 0.78, to: 1 },
];

/** Reloj de la historia: [progreso, minutos desde las 23:00]. Entre 0.53 y 0.58, la noche pasa en un instante. */
export const CLOCK: [number, number][] = [
  [0, 47],
  [0.14, 47],
  [0.3, 72],
  [0.53, 280],
  [0.58, 510],
  [0.78, 532],
  [0.82, 555],
  [1, 555],
];

export function minutesAt(p: number) {
  if (p <= CLOCK[0][0]) return CLOCK[0][1];
  for (let i = 1; i < CLOCK.length; i++) {
    const [p1, m1] = CLOCK[i];
    const [p0, m0] = CLOCK[i - 1];
    if (p <= p1) return m0 + ((m1 - m0) * (p - p0)) / (p1 - p0 || 1);
  }
  return CLOCK[CLOCK.length - 1][1];
}

/** Progreso en el que el reloj marca una hora (inversa de minutesAt dentro de la noche). */
export function progressAt(minutes: number) {
  for (let i = 1; i < CLOCK.length; i++) {
    const [p1, m1] = CLOCK[i];
    const [p0, m0] = CLOCK[i - 1];
    if (minutes <= m1 && m1 !== m0) return p0 + ((minutes - m0) / (m1 - m0)) * (p1 - p0);
  }
  return 1;
}

export function formatClock(minutes: number) {
  const total = Math.floor(minutes);
  const h = (23 + Math.floor(total / 60)) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export type LogAgent = "alma" | "vera" | "nora" | "bruno";

export const AGENT_COLORS: Record<LogAgent, string> = {
  alma: "var(--ag-alma)",
  vera: "var(--ag-vera)",
  nora: "var(--ag-nora)",
  bruno: "var(--ag-bruno)",
};

export const AGENT_NAMES: Record<LogAgent, string> = { alma: "Alma", vera: "Vera", nora: "Nora", bruno: "Bruno" };

/** Bitácora de la noche: cada entrada aparece cuando el reloj llega a su hora. */
export const LOG: { m: number; agent: LogAgent; text: string }[] = [
  { m: 72, agent: "nora", text: "Lee la notificación de la DEHú: es un requerimiento de información del IVA." },
  { m: 91, agent: "vera", text: "Clasifica 12 facturas de octubre y aparta una repetida." },
  { m: 125, agent: "nora", text: "Prepara la renovación del certificado de la Seguridad Social." },
  { m: 198, agent: "bruno", text: "Encuentra una ayuda de hasta 54.000 € para el obrador nuevo." },
  { m: 278, agent: "alma", text: "Deja cuatro borradores en la mesa de la abogada." },
];

/** Borradores que la abogada revisa por la mañana. */
export const DRAFTS = [
  { title: "Respuesta al requerimiento de IVA", note: "Ajusta un matiz y la aprueba" },
  { title: "Renovación del certificado", note: "Aprobada" },
  { title: "Solicitud de la ayuda al obrador", note: "Aprobada" },
  { title: "Facturas de octubre", note: "Aprobadas" },
];

export const draftAt = (i: number) => 0.6 + i * 0.035;

export const MORNING_ROWS = ["La respuesta a Hacienda, lista para tu firma", "Tu certificado, en trámite", "Una ayuda de hasta 54.000 € para el obrador"];
