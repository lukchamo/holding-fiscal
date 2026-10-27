"use client";

import { useSyncExternalStore } from "react";

/**
 * Tema efectivo: el elegido con el botón (data-theme) o, si no hay elección
 * explícita distinta de la de por defecto, el del sistema.
 */
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", cb);
  };
}

function isDark() {
  const t = document.documentElement.getAttribute("data-theme");
  if (t === "dark") return true;
  if (t === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useIsDark() {
  return useSyncExternalStore(subscribe, isDark, () => false);
}
