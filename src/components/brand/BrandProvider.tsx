"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { BRAND_PREFIX, BRANDS, DEFAULT_BRAND, isBrandKey, type Brand, type BrandKey } from "./brands";

/*
 * La marca elegida vive en un pequeño almacén externo: se inicializa desde el
 * hash (#cala, #sereno…) como en el prototipo y el servidor siempre pinta la
 * marca por defecto, así la hidratación no discrepa.
 */
let current: BrandKey | null = null;
const listeners = new Set<() => void>();

function readInitial(): BrandKey {
  const h = window.location.hash.slice(1);
  return isBrandKey(h) ? h : DEFAULT_BRAND;
}

const store = {
  get(): BrandKey {
    if (current === null) current = readInitial();
    return current;
  },
  set(k: BrandKey) {
    current = k;
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

interface BrandCtx {
  brand: Brand;
  setBrand: (k: BrandKey) => void;
}

const Ctx = createContext<BrandCtx>({ brand: BRANDS[DEFAULT_BRAND], setBrand: () => {} });

export function BrandProvider({ children }: { children: ReactNode }) {
  const key = useSyncExternalStore(store.subscribe, store.get, () => DEFAULT_BRAND);

  // El título lo gestiona Next.js y puede reescribirse al hidratar los metadatos:
  // se vigila y se reaplica la marca (solo cambia si el prefijo no coincide).
  useEffect(() => {
    const name = BRANDS[key].name;
    const apply = () => {
      const next = document.title.replace(BRAND_PREFIX, name);
      if (next !== document.title) document.title = next;
    };
    apply();
    const mo = new MutationObserver(apply);
    mo.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => mo.disconnect();
  }, [key]);

  const setBrand = useCallback((k: BrandKey) => {
    store.set(k);
    try {
      history.replaceState(null, "", `#${k}`);
    } catch {
      /* sin historial disponible: no pasa nada */
    }
  }, []);

  const value = useMemo(() => ({ brand: BRANDS[key], setBrand }), [key, setBrand]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useBrand = () => useContext(Ctx);

/** Nombre de la marca activa, para usar dentro de textos renderizados en servidor. */
export function BrandName() {
  return <>{useBrand().brand.name}</>;
}

export function BrandTagline() {
  return <>{useBrand().brand.tagline}</>;
}
