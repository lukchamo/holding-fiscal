/**
 * Guion visual de «Del caos a la calma».
 * Doce papeles reales de una pyme (los del caso Andino Foods del prototipo)
 * empiezan desordenados; los agentes los apilan por especialidad, las
 * personas los firman y todo acaba bajo el símbolo de la marca.
 *
 * Línea de tiempo (progreso de scroll 0..1):
 *   0.00–0.24  El caos        papeles flotando, avisos urgentes
 *   0.14–0.32  Llegan los agentes (Alma coordina, cuatro especialistas)
 *   0.27–0.50  Cada papel vuela a su pila (escalonado)
 *   0.50–0.72  Personas: aparecen la abogada y el gestor; V.º B.º en cada pila
 *   0.74–0.84  Todo se recoge hacia el centro
 *   0.80–0.97  El símbolo de la marca abraza el resumen final
 */

export type AgentKey = "vera" | "nora" | "bruno" | "elio";

export interface DocDef {
  id: string;
  agent: AgentKey;
  type: string;
  title: string;
  badge?: { text: string; tone: "warn" | "info" };
  /** Estado tras la firma (solo el papel de arriba de cada pila). */
  after?: string;
}

export const DOCS: DocDef[] = [
  { id: "f1182", agent: "vera", type: "Factura", title: "FA-2026-1182", badge: { text: "Sin clasificar", tone: "warn" } },
  { id: "aeat", agent: "nora", type: "Notificación AEAT", title: "Requerimiento de IVA", badge: { text: "Sin leer", tone: "warn" }, after: "Respondida" },
  { id: "certss", agent: "nora", type: "Certificado", title: "Seguridad Social", badge: { text: "Caducado", tone: "warn" } },
  { id: "cuentas", agent: "nora", type: "Cuentas anuales", title: "Ejercicio 2025", badge: { text: "Sin depositar", tone: "warn" } },
  { id: "escFoods", agent: "elio", type: "Escritura", title: "Andino Foods SL" },
  { id: "bdns", agent: "bruno", type: "Convocatoria", title: "Inversión productiva", badge: { text: "Cierra el 15 dic", tone: "info" }, after: "Solicitada" },
  { id: "f1190", agent: "vera", type: "Factura", title: "FA-2026-1190", badge: { text: "¿Repetida?", tone: "warn" }, after: "Contabilizada" },
  { id: "nominas", agent: "vera", type: "Nóminas", title: "Octubre, 7 personas" },
  { id: "m303", agent: "nora", type: "Modelo 303", title: "IVA, 3.er trimestre", badge: { text: "Vence el 20", tone: "warn" } },
  { id: "escInm", agent: "elio", type: "Escritura", title: "Andino Inmuebles SL", badge: { text: "Sin holding", tone: "info" }, after: "Holding lista" },
  { id: "memoria", agent: "bruno", type: "Memoria técnica", title: "Obrador nuevo" },
  { id: "nave", agent: "elio", type: "Contrato", title: "Alquiler de la nave" },
];

export const AGENT_ORDER: AgentKey[] = ["vera", "nora", "bruno", "elio"];

export const AGENTS_META: Record<AgentKey, { name: string; initial: string; color: string; bin: string; count: string }> = {
  vera: { name: "Vera", initial: "V", color: "var(--ag-vera)", bin: "Facturas", count: "3 papeles" },
  nora: { name: "Nora", initial: "N", color: "var(--ag-nora)", bin: "Hacienda", count: "4 avisos" },
  bruno: { name: "Bruno", initial: "B", color: "var(--ag-bruno)", bin: "Ayudas", count: "54.000 €" },
  elio: { name: "Elio", initial: "E", color: "var(--ag-elio)", bin: "Sociedades", count: "3 escrituras" },
};

/** Orden de cada pila, de abajo arriba: el papel con estado «after» queda encima. */
export const PILES: Record<AgentKey, string[]> = {
  vera: ["nominas", "f1182", "f1190"],
  nora: ["m303", "cuentas", "certss", "aeat"],
  bruno: ["memoria", "bdns"],
  elio: ["nave", "escFoods", "escInm"],
};

export const SUMMARY_ROWS = ["Hacienda, al día", "12 papeles en su sitio", "54.000 € en ayudas", "Holding lista para firmar"];

/* ---------- Momentos clave de la línea de tiempo ---------- */
export const T = {
  almaIn: 0.14,
  agentsIn: 0.17,
  linesIn: 0.2,
  flyStart: 0.27,
  flyStagger: 0.011,
  flyDur: 0.11,
  countsIn: 0.45,
  humansIn: 0.5,
  stampStart: 0.57,
  stampStagger: 0.035,
  collapse: 0.74,
  collapsed: 0.83,
  cardIn: 0.8,
  markStem: 0.82,
  markArc: 0.85,
  markEnd: 0.95,
};

export const flyWindow = (i: number) => {
  const t1 = T.flyStart + i * T.flyStagger;
  return { t1, tm: t1 + T.flyDur * 0.48, t2: t1 + T.flyDur };
};

export const stampAt = (k: number) => T.stampStart + k * T.stampStagger;

/* ---------- Composiciones (coordenadas de diseño, como en motion graphics) ---------- */
export interface Comp {
  w: number;
  h: number;
  doc: { w: number; h: number };
  pileScale: number;
  chaos: Record<string, [number, number, number]>;
  pile: Record<AgentKey, { x: number; y: number }>;
  avatar: (k: AgentKey) => { x: number; y: number };
  label: (k: AgentKey) => { x: number; y: number };
  alma: { x: number; y: number };
  humans: { y: number; lawyer: number; advisor: number; r: number };
  center: { x: number; y: number };
  mark: { k: number; cx: number; cy: number; stroke: number };
  card: { w: number; h: number };
}

const DESK_PILE: Record<AgentKey, { x: number; y: number }> = {
  vera: { x: 92, y: 300 },
  nora: { x: 244, y: 300 },
  bruno: { x: 396, y: 300 },
  elio: { x: 548, y: 300 },
};

export const DESKTOP: Comp = {
  w: 640,
  h: 560,
  doc: { w: 150, h: 100 },
  pileScale: 0.84,
  chaos: {
    f1182: [128, 104, -13],
    aeat: [318, 88, 8],
    certss: [508, 126, -7],
    cuentas: [212, 232, 11],
    escFoods: [452, 244, -16],
    bdns: [104, 350, 6],
    f1190: [318, 326, -5],
    nominas: [530, 368, 14],
    m303: [196, 462, -9],
    escInm: [408, 468, 5],
    memoria: [556, 490, -11],
    nave: [92, 492, 15],
  },
  pile: DESK_PILE,
  avatar: (k) => ({ x: DESK_PILE[k].x, y: 176 }),
  label: (k) => ({ x: DESK_PILE[k].x, y: 380 }),
  alma: { x: 320, y: 64 },
  humans: { y: 474, lawyer: 268, advisor: 372, r: 34 },
  center: { x: 320, y: 300 },
  mark: { k: 17, cx: 320, cy: 284, stroke: 16 },
  card: { w: 272, h: 168 },
};

const MOB_PILE: Record<AgentKey, { x: number; y: number }> = {
  vera: { x: 112, y: 168 },
  nora: { x: 290, y: 168 },
  bruno: { x: 112, y: 372 },
  elio: { x: 290, y: 372 },
};

export const MOBILE: Comp = {
  w: 400,
  h: 540,
  doc: { w: 128, h: 88 },
  pileScale: 0.84,
  chaos: {
    f1182: [96, 82, -12],
    aeat: [262, 70, 9],
    certss: [316, 178, -8],
    cuentas: [118, 196, 12],
    escFoods: [236, 262, -15],
    bdns: [86, 318, 7],
    f1190: [302, 330, -6],
    nominas: [150, 404, 13],
    m303: [312, 436, -9],
    escInm: [92, 468, 6],
    memoria: [222, 470, -12],
    nave: [318, 486, 15],
  },
  pile: MOB_PILE,
  avatar: (k) => ({ x: MOB_PILE[k].x - 52, y: MOB_PILE[k].y - 50 }),
  label: (k) => ({ x: MOB_PILE[k].x, y: MOB_PILE[k].y + 58 }),
  alma: { x: 200, y: 270 },
  humans: { y: 478, lawyer: 158, advisor: 242, r: 24 },
  center: { x: 200, y: 270 },
  mark: { k: 11.4, cx: 200, cy: 262, stroke: 12 },
  card: { w: 210, h: 140 },
};

/** Posición y giro de un papel dentro de su pila. */
export function pileSlot(comp: Comp, id: string) {
  const doc = DOCS.find((d) => d.id === id)!;
  const order = PILES[doc.agent];
  const j = order.indexOf(id);
  const base = comp.pile[doc.agent];
  return {
    x: base.x + j * 3,
    y: base.y - j * 8,
    r: j % 2 === 0 ? -1.6 : 1.4,
    z: 100 + j,
    isTop: j === order.length - 1,
  };
}

/** Centro del símbolo de marca grande y su transformación para una geometría de 32 × 32. */
export function markTransform(comp: Comp, center: { x: number; y: number } = { x: 18.4, y: 17 }) {
  const { k, cx, cy } = comp.mark;
  return { k, ox: cx - center.x * k, oy: cy - center.y * k };
}
