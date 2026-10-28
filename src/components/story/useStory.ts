"use client";

import { useCallback, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent, useScroll, useSpring, type MotionValue } from "motion/react";
import { SCROLL_SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

export interface Chapter {
  /** Identificador corto para el raíl de progreso. */
  id: string;
  label: string;
  /** Tramo del progreso global (0..1) en el que el capítulo está activo. */
  from: number;
  to: number;
}

export interface Story {
  ref: React.RefObject<HTMLElement | null>;
  /** Progreso suavizado 0..1 a lo largo de la pista de scroll. */
  progress: MotionValue<number>;
  /** Capítulo activo (índice). */
  chapter: number;
  reduced: boolean;
  /** Lleva el scroll al inicio de un capítulo. */
  jumpTo: (i: number) => void;
}

/**
 * Motor de storytelling: una pista alta con un escenario fijo (sticky).
 * El scroll es nativo (nada de scroll-jacking); solo se lee su progreso,
 * se suaviza con un muelle y se reparte en capítulos.
 * Con «reducir movimiento», el progreso queda fijo al final (estado en calma).
 */
export function useStory(chapters: Chapter[]): Story {
  const ref = useRef<HTMLElement | null>(null);
  // Seguro para la hidratación: el capítulo final cambia el texto pintado.
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, SCROLL_SPRING);
  const done = useMotionValue(1);
  const progress = reduced ? done : smooth;

  const [chapter, setChapter] = useState(0);
  const pick = useCallback(
    (v: number) => {
      let idx = 0;
      chapters.forEach((c, i) => {
        if (v >= c.from - 0.0001) idx = i;
      });
      setChapter((cur) => (cur === idx ? cur : idx));
    },
    [chapters],
  );
  useMotionValueEvent(smooth, "change", pick);

  const jumpTo = useCallback(
    (i: number) => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const travel = el.offsetHeight - window.innerHeight;
      // Un poco dentro del capítulo para que su texto ya esté visible.
      const target = top + travel * Math.min(1, chapters[i].from + (i === 0 ? 0 : 0.035));
      window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
    },
    [chapters, reduced],
  );

  return { ref, progress, chapter: reduced ? chapters.length - 1 : chapter, reduced, jumpTo };
}
