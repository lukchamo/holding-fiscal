/**
 * Panel de demostración de la portada 5 («La plataforma»). Datos de ejemplo
 * del caso Andino Foods del prototipo, uno por especialidad: cada pestaña es
 * el trabajo de un agente, siempre con una persona que lo revisa.
 */
export type TabKey = "hacienda" | "facturas" | "ayudas" | "holding";

export interface Task {
  id: string;
  title: string;
  /** Lo que queda cuando se resuelve (con el visto bueno humano cuando aplica). */
  done: string;
}

export type Chart =
  | { kind: "line"; title: string; points: number[]; labels: string[]; tooltip: { title: string; rows: [string, string][] } }
  | { kind: "bars"; title: string; bars: { label: string; value: number; tag: string }[] }
  | { kind: "tree"; title: string };

export interface TabData {
  key: TabKey;
  label: string;
  agent: { initial: string; name: string; color: string; role: string };
  stat: { label: string; value: number; total?: number; prefix?: string; suffix?: string; progress: number; note: string };
  summary: { title: string; rows: [string, string][] };
  chart: Chart;
  tasks: Task[];
  toast: { source: string; text: string };
}

export const TABS: TabData[] = [
  {
    key: "hacienda",
    label: "Hacienda",
    agent: { initial: "N", name: "Nora", color: "var(--ag-nora)", role: "Hacienda y plazos" },
    stat: { label: "Plazos bajo control", value: 4, total: 4, progress: 100, note: "Próximo: modelo 303 del 4.º trimestre" },
    summary: {
      title: "Buzones oficiales",
      rows: [
        ["Notificaciones sin leer", "0"],
        ["Certificados al día", "2 de 2"],
      ],
    },
    chart: {
      kind: "line",
      title: "Avisos pendientes por semana",
      points: [6, 5, 5, 3, 2, 1, 0],
      labels: ["S1", "S2", "S3", "S4", "S5", "S6", "S7"],
      tooltip: {
        title: "Esta semana",
        rows: [
          ["Avisos pendientes", "0"],
          ["Requerimiento de IVA", "Respondido"],
        ],
      },
    },
    tasks: [
      { id: "h1", title: "Responder el requerimiento de IVA", done: "V.º\u00a0B.º de tu abogada" },
      { id: "h2", title: "Renovar el certificado de la Seguridad Social", done: "Tramitado con apoderamiento" },
      { id: "h3", title: "Depositar las cuentas de 2025", done: "Presentadas en el Registro" },
    ],
    toast: { source: "Nora · DEHú", text: "Notificación leída: requerimiento de IVA. Borrador listo para la abogada." },
  },
  {
    key: "facturas",
    label: "Facturas",
    agent: { initial: "V", name: "Vera", color: "var(--ag-vera)", role: "Correo y facturas" },
    stat: { label: "Facturas clasificadas", value: 128, total: 131, progress: 98, note: "3 esperan el visto bueno de tu gestor" },
    summary: {
      title: "Esta semana",
      rows: [
        ["Facturas recibidas", "34"],
        ["Repetidas apartadas", "1"],
      ],
    },
    chart: {
      kind: "line",
      title: "Facturas por mes",
      points: [84, 92, 101, 97, 118, 131],
      labels: ["May", "Jun", "Jul", "Ago", "Sep", "Oct"],
      tooltip: {
        title: "Octubre",
        rows: [
          ["Recibidas", "131"],
          ["Registradas en a3", "128"],
        ],
      },
    },
    tasks: [
      { id: "f1", title: "FA-2026-1190: ¿repetida?", done: "Apartada, no se paga dos veces" },
      { id: "f2", title: "FA-2026-1182 a la cuenta 602", done: "Aprobada por tu gestor" },
      { id: "f3", title: "Nóminas de octubre", done: "Registradas en a3" },
    ],
    toast: { source: "Vera · Correo", text: "Factura de Distribuciones Levante: clasificada en Andino Foods SL." },
  },
  {
    key: "ayudas",
    label: "Ayudas",
    agent: { initial: "B", name: "Bruno", color: "var(--ag-bruno)", role: "Subvenciones" },
    stat: { label: "Ayudas para tu grupo", value: 85000, prefix: "Hasta ", suffix: " €", progress: 78, note: "Encaje medio del 78 % en 3 convocatorias" },
    summary: {
      title: "Convocatorias",
      rows: [
        ["Abiertas en la BDNS", "412"],
        ["Encajan contigo", "9"],
      ],
    },
    chart: {
      kind: "bars",
      title: "Encaje con tu proyecto",
      bars: [
        { label: "Inversión productiva de pymes", value: 86, tag: "54.000 €" },
        { label: "Contratación indefinida de jóvenes", value: 78, tag: "24.000 €" },
        { label: "Digitalización de pymes", value: 71, tag: "7.000 €" },
      ],
    },
    tasks: [
      { id: "a1", title: "Redactar la memoria técnica", done: "Puntuación estimada: 30 de 40" },
      { id: "a2", title: "Solicitar la ayuda a la inversión", done: "Presentada, V.º\u00a0B.º de tu abogada" },
      { id: "a3", title: "Ligar las facturas del proyecto", done: "12 facturas, justificación lista" },
    ],
    toast: { source: "Bruno · BDNS", text: "Nueva convocatoria: inversión productiva de pymes. Encaje del 86 %." },
  },
  {
    key: "holding",
    label: "Holding",
    agent: { initial: "E", name: "Elio", color: "var(--ag-elio)", role: "Sociedades y holding" },
    stat: { label: "Estructura del grupo", value: 3, total: 4, progress: 75, note: "Falta la escritura con la notaría" },
    summary: {
      title: "Tu grupo",
      rows: [
        ["Sociedades", "3"],
        ["Socia única", "Mariana Ortega"],
      ],
    },
    chart: { kind: "tree", title: "Estructura propuesta" },
    tasks: [
      { id: "o1", title: "Proponer la estructura", done: "Holding sobre Foods e Inmuebles" },
      { id: "o2", title: "Comprobar la sustancia", done: "Medios y decisiones definidos" },
      { id: "o3", title: "Coordinar la escritura", done: "Cita con la notaría, V.º\u00a0B.º" },
    ],
    toast: { source: "Elio · BORME", text: "Andino Inmuebles SL tiene la misma socia. Propuesta de holding preparada." },
  },
];

/** Tiempo que permanece cada pestaña en la reproducción automática. */
export const AUTOPLAY_MS = 6500;
/** Cuándo pasa cada tarea de «Pendiente» a «Hecho» tras entrar en una pestaña. */
export const TASK_STEPS_MS = [900, 1700, 2500];
