"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

const subscribe = () => () => {};

/**
 * «Reducir movimiento» seguro para la hidratación. El servidor no conoce la
 * preferencia y pinta el estado animado; si el cliente pintara ya el estado en
 * calma, React no podría hidratar (error #418). Aquí, durante la hidratación,
 * devuelve false como el servidor y, justo después, la preferencia real.
 *
 * Úsalo cuando la preferencia cambia lo que se pinta (texto, elementos,
 * atributos). Para la duración de una transición basta useReducedMotion: las
 * transiciones no van en el HTML.
 */
export function useReducedMotionSafe(): boolean {
  const reduced = useReducedMotion() ?? false;
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return hydrated && reduced;
}
