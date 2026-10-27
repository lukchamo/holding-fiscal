"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { Answers } from "./interviewData";

export type Mode = "ia" | "video" | "cafe";

interface InterviewApi {
  start: (pre: Answers) => void;
  isStarted: () => boolean;
}

interface StartCtx {
  mode: Mode;
  setMode: (m: Mode) => void;
  /** Cambia de modo y lleva al usuario a la sección «Empieza como prefieras». */
  goMode: (m: Mode) => void;
  /** Abre la entrevista virtual, opcionalmente con respuestas ya dadas en la portada. */
  goInterview: (pre?: Answers) => void;
  /** CTA global: enfoca el formulario de la portada si existe; si no, abre la entrevista. */
  focusStart: () => void;
  /** Empieza la entrevista solo si aún no ha empezado (al pulsar la pestaña). */
  ensureInterview: () => void;
  registerInterview: (api: InterviewApi | null) => void;
}

const Ctx = createContext<StartCtx | null>(null);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export const scrollToId = (id: string, block: ScrollLogicalPosition = "start") => {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block });
};

export function StartProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("ia");
  const interview = useRef<InterviewApi | null>(null);

  const registerInterview = useCallback((api: InterviewApi | null) => {
    interview.current = api;
  }, []);

  const goMode = useCallback((m: Mode) => {
    setMode(m);
    scrollToId("empezar");
  }, []);

  const goInterview = useCallback((pre: Answers = {}) => {
    setMode("ia");
    scrollToId("empezar");
    interview.current?.start(pre);
  }, []);

  const focusStart = useCallback(() => {
    const desc = document.getElementById("desc");
    if (desc) {
      scrollToId("inicio");
      window.setTimeout(() => desc.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 500);
      return;
    }
    setMode("ia");
    scrollToId("empezar");
    if (!interview.current?.isStarted()) interview.current?.start({});
  }, []);

  const ensureInterview = useCallback(() => {
    if (!interview.current?.isStarted()) interview.current?.start({});
  }, []);

  const value = useMemo(
    () => ({ mode, setMode, goMode, goInterview, focusStart, ensureInterview, registerInterview }),
    [mode, goMode, goInterview, focusStart, ensureInterview, registerInterview],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStart debe usarse dentro de <StartProvider>");
  return ctx;
}
