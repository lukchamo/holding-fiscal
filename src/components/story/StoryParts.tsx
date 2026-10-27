"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { EASE } from "@/lib/motion";
import { cubicBezier } from "motion";
import type { Chapter } from "./useStory";
import s from "./Story.module.css";

const easeOut = cubicBezier(...EASE.outExpo);

/**
 * Texto de un capítulo: entra desde abajo, sale hacia arriba. Todos los
 * capítulos siguen en el HTML (buscadores y lectores de pantalla los leen);
 * si el foco del teclado entra en uno que no se ve, la historia salta a él.
 */
export function StoryChapter({
  progress,
  chapter,
  index,
  total,
  active,
  onFocusHidden,
  className,
  children,
}: {
  progress: MotionValue<number>;
  chapter: Chapter;
  index: number;
  total: number;
  active: boolean;
  onFocusHidden?: (index: number) => void;
  className?: string;
  children: ReactNode;
}) {
  const first = index === 0;
  const last = index === total - 1;
  // Secuencial, sin solaparse: el texto anterior sale antes de que entre el siguiente.
  const fade = 0.03;
  const inStart = first ? -1 : chapter.from + 0.004;
  const inEnd = first ? 0 : chapter.from + 0.004 + fade;
  const outStart = last ? 2 : chapter.to - 0.004 - fade;
  const outEnd = last ? 3 : chapter.to - 0.004;

  const opacity = useTransform(progress, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0]);
  const y = useTransform(progress, [inStart, inEnd, outStart, outEnd], [28, 0, 0, -22], { ease: [easeOut, (t) => t, (t) => t] });
  const blur = useTransform(progress, [inStart, inEnd, outStart, outEnd], [6, 0, 0, 4]);
  const filter = useTransform(blur, (b) => (b < 0.15 ? "none" : `blur(${b}px)`));

  return (
    <motion.div
      className={`${s.chapter} ${className ?? ""}`}
      style={{ opacity, y, filter, pointerEvents: active ? "auto" : "none" }}
      data-active={active}
      onFocusCapture={() => {
        if (!active) onFocusHidden?.(index);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Raíl de progreso por capítulos; cada tramo es un botón que lleva a su capítulo. */
export function StoryRail({
  chapters,
  progress,
  active,
  onJump,
  tone = "paper",
}: {
  chapters: Chapter[];
  progress: MotionValue<number>;
  active: number;
  onJump: (i: number) => void;
  tone?: "paper" | "night";
}) {
  return (
    <nav className={s.rail} data-tone={tone} aria-label="Capítulos de la historia">
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <button type="button" onClick={() => onJump(i)} aria-current={active === i ? "step" : undefined} aria-label={`Ir al capítulo ${i + 1}: ${c.label}`}>
              <RailFill progress={progress} from={c.from} to={c.to} />
              <span className={s.railLabel}>{c.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function RailFill({ progress, from, to }: { progress: MotionValue<number>; from: number; to: number }) {
  const scaleX = useTransform(progress, [from, to], [0, 1]);
  return (
    <span className={s.railTrack} aria-hidden="true">
      <motion.span className={s.railFill} style={{ scaleX }} />
    </span>
  );
}

/**
 * Escenario escalable: la composición se diseña en un tamaño fijo (como en
 * motion graphics) y se ajusta al hueco disponible sin deformarse.
 */
export function FitStage({ width, height, max = Infinity, className, children }: { width: number; height: number; max?: number; className?: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState<number | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width: cw, height: ch } = entry.contentRect;
      if (cw > 0 && ch > 0) setK(Math.min(cw / width, ch / height, max));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height, max]);

  return (
    <div ref={box} className={`${s.fit} ${className ?? ""}`}>
      <div
        className={s.comp}
        data-ready={k !== null}
        style={{ width, height, transform: `translate(-50%, -50%) scale(${k ?? 1})` } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

/** Indicación de scroll al inicio de la historia. */
export function ScrollCue({ progress, label = "Desliza para ver la historia", tone = "paper" }: { progress: MotionValue<number>; label?: string; tone?: "paper" | "night" }) {
  const opacity = useTransform(progress, [0, 0.035], [1, 0]);
  return (
    <motion.div className={s.cue} data-tone={tone} style={{ opacity }} aria-hidden="true">
      <span>{label}</span>
      <svg width="18" height="26" viewBox="0 0 18 26">
        <rect x="1.5" y="1.5" width="15" height="23" rx="7.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle className={s.cueDot} cx="9" cy="8" r="2" fill="currentColor" />
      </svg>
    </motion.div>
  );
}
