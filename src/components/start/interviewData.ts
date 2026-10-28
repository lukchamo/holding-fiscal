/** Guion de la entrevista virtual con Alma (idéntico al prototipo). */

export const EXAMPLE = "Elaboramos arepas y empanadas para supermercados en Valencia";

export type DescAnswer = { text: string; custom: boolean };
export type Answers = { desc?: DescAnswer; soc?: number; worry?: number; cert?: number };
export type QKey = keyof Answers;

export type Question =
  | { key: "desc"; text: string; type: "text" }
  | { key: Exclude<QKey, "desc">; text: string; type: "chips"; options: string[] };

export const QUESTIONS: Question[] = [
  { key: "desc", text: "¿A qué se dedica tu empresa?", type: "text" },
  { key: "soc", text: "¿Cuántas sociedades tienes?", type: "chips", options: ["Ninguna aún", "Una", "De dos a cuatro", "Cinco o más"] },
  { key: "worry", text: "¿Qué te quita el sueño ahora mismo?", type: "chips", options: ["Hacienda", "Montar una holding", "Pedir ayudas", "Las facturas"] },
  { key: "cert", text: "¿Tu empresa tiene certificado digital?", type: "chips", options: ["Sí", "No", "No lo sé"] },
];

export const SOC_OPTIONS = ["Ninguna aún", "Una", "De dos a cuatro", "Cinco o más"];

export function trunc(t: string) {
  const s = (t || "").trim().replace(/\s+/g, " ");
  return s.length > 70 ? `${s.slice(0, 70)}…` : s;
}

/** Respuesta de Alma y nota para «Lo que voy entendiendo»: [mensaje, etiqueta, valor]. */
export function ack(key: QKey, v: DescAnswer | number): [string, string, string] {
  if (key === "desc") {
    const d = v as DescAnswer;
    return d.custom
      ? [`Entendido: «${trunc(d.text)}». Para esta demostración seguiré con una empresa parecida de ejemplo, Andino Foods.`, "Actividad", trunc(d.text)]
      : ["Entendido: elaboráis arepas y empanadas para supermercados.", "Actividad", "Arepas y empanadas para supermercados"];
  }
  const i = v as number;
  if (key === "soc")
    return (
      [
        ["Perfecto: te ayudaremos a constituir la primera sociedad.", "Sociedades", "Ninguna aún: constituir la primera"],
        ["Con una sociedad, miraré si te conviene separar actividad y patrimonio.", "Sociedades", "Una: valorar separar patrimonio"],
        ["Con dos a cuatro sociedades, merece la pena ver si una holding os conviene.", "Sociedades", "De dos a cuatro: revisar holding"],
        ["Con cinco o más, ordenar el grupo es lo primero.", "Sociedades", "Cinco o más: ordenar el grupo"],
      ] as const
    )[i] as [string, string, string];
  if (key === "worry")
    return (
      [
        ["Anotado: vigilaré tus buzones de la DEHú y la Seguridad Social desde el primer día.", "Prioridad", "Hacienda: vigilar notificaciones"],
        ["Anotado: prepararé una primera propuesta de estructura para la abogada.", "Prioridad", "Montar una holding"],
        ["Anotado: buscaré convocatorias abiertas y las que vuelven cada año.", "Prioridad", "Pedir ayudas"],
        ["Anotado: tendrás un buzón para cada sociedad y nosotros ordenamos las facturas.", "Prioridad", "Ordenar las facturas"],
      ] as const
    )[i] as [string, string, string];
  return (
    [
      ["Bien: podrás firmar tú mismo cuando todo esté listo.", "Firma", "Con certificado propio"],
      ["Sin problema: lo tramitamos con un apoderamiento.", "Firma", "Con apoderamiento"],
      ["Lo comprobamos juntos en la primera sesión.", "Firma", "Por comprobar"],
    ] as const
  )[i] as [string, string, string];
}

export function answerLabel(q: Question, v: DescAnswer | number) {
  if (q.type === "text") return (v as DescAnswer).text;
  return q.options[v as number];
}
