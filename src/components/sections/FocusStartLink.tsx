"use client";

import type { ReactNode } from "react";
import { useStart } from "@/components/start/StartProvider";

/** Enlace a «empezar»: enfoca el formulario de la portada o abre la entrevista. */
export function FocusStartLink({ className, children }: { className?: string; children: ReactNode }) {
  const { focusStart } = useStart();
  return (
    <a
      className={className}
      href="#inicio"
      onClick={(e) => {
        e.preventDefault();
        focusStart();
      }}
    >
      {children}
    </a>
  );
}
