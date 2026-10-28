"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Consulta de medios solo en el cliente: en el servidor y durante la
 * hidratación devuelve false, y después el valor real. Sirve para montar
 * piezas decorativas solo en las pantallas donde se ven (no se hidratan ni se
 * animan en el móvil). Lo que defina el alto de la página no debe depender de
 * esto: aparecería tras la hidratación y movería el contenido.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
