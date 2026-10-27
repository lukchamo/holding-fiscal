/**
 * Sistema de movimiento. Las mismas curvas que en globals.css (--ease-*),
 * expresadas como arrays para Motion. Usarlas siempre desde aquí mantiene la
 * coreografía coherente entre CSS y JavaScript.
 */
export const EASE = {
  out: [0.2, 0.7, 0.2, 1] as const,
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  stamp: [0.3, 1.4, 0.5, 1] as const,
};

/** Suavizado del progreso de scroll: elimina los saltos de la rueda sin añadir retraso perceptible. */
export const SCROLL_SPRING = { stiffness: 170, damping: 32, mass: 0.6, restDelta: 0.0005 };

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Progreso local de un tramo [a, b] dentro de un progreso global 0..1. */
export const segment = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

/** Interpolación lineal. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
