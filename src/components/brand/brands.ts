/**
 * Marcas en estudio. "resguardo" es la principal; "lucero" es la alternativa que
 * proponemos; "sereno", "cauce" y "lacre" vienen del prototipo original.
 * (Descartadas tras comprobarlas: "cala", por cala.ai y dominios ocupados, y
 * "albor", por Albor Abogados. Detalle en docs/marca.md.)
 */
export type BrandKey = "resguardo" | "lucero" | "sereno" | "cauce" | "lacre";

export interface Brand {
  key: BrandKey;
  name: string;
  tagline: string;
  /** Propuesta nueva de esta versión (se marca en el selector). */
  proposal?: boolean;
}

export const BRANDS: Record<BrandKey, Brand> = {
  resguardo: { key: "resguardo", name: "resguardo", tagline: "Tus papeles, a resguardo." },
  lucero: { key: "lucero", name: "lucero", tagline: "Tu empresa amanece en orden.", proposal: true },
  sereno: { key: "sereno", name: "sereno", tagline: "Nos anticipamos. Hacienda, no." },
  cauce: { key: "cauce", name: "cauce", tagline: "Todo por su cauce." },
  lacre: { key: "lacre", name: "lacre", tagline: "Firme en lo fiscal, rápido en todo lo demás." },
};

export const BRAND_ORDER: BrandKey[] = ["resguardo", "lucero", "sereno", "cauce", "lacre"];
export const DEFAULT_BRAND: BrandKey = "resguardo";

export const isBrandKey = (v: string): v is BrandKey => Object.prototype.hasOwnProperty.call(BRANDS, v);

/** Sustituye el nombre de cualquier marca al inicio de un texto (títulos de pestaña). */
export const BRAND_PREFIX = new RegExp(`^(${BRAND_ORDER.join("|")})`);

/**
 * Geometría de los símbolos nuevos, en una retícula de 32 × 32.
 * Concepto «el abrazo»: un trazo de tinta (nosotros) que protege un punto
 * ámbar (tú y tu empresa).
 */
export const MARK_GEOMETRY = {
  resguardo: {
    // La «r»: un fuste y un hombro que se alarga como un alero sobre el punto.
    stem: "M9.5 27.5V13.5",
    arc: "M9.5 18C9.5 11.2 14 7.5 19.6 7.5C25 7.5 28 11.4 28 16.4",
    dot: { cx: 19.4, cy: 21.6, r: 3.5 },
  },
  lucero: {
    // La «u»: unas manos que sostienen la primera luz del día.
    arc: "M7 12C7 20.6 11 25.5 16 25.5C21 25.5 25 20.6 25 12",
    dot: { cx: 16, cy: 14.2, r: 3.7 },
    rays: "M16 5.2V7.6M10.4 7.6l1.4 1.7M21.6 7.6l-1.4 1.7",
  },
} as const;

/** Geometría del símbolo grande en los finales de las historias (las marcas sin símbolo nuevo usan el de resguardo). */
export const geometryFor = (k: BrandKey) => (k === "lucero" ? MARK_GEOMETRY.lucero : MARK_GEOMETRY.resguardo);
