"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { DOCS, flyWindow, stampAt, AGENT_ORDER } from "./chaosData";
import s from "./HeroChaos.module.css";

const W = 168;
const H = 40;
// Trazo de «pulso nervioso», determinista (sin aleatoriedad entre servidor y cliente).
const NOISE = [0, -0.35, 0.9, -1, 0.25, 0.8, -0.65, 0.15, -0.95, 0.55, -0.2, 1, -0.75, 0.35, -0.5, 0.85, -0.9, 0.2, 0.6, -0.4, 0.95, -0.6, 0.1, -0.85, 0.45, -0.15, 0.7, -1, 0.3];

function wave(a: number) {
  const step = W / (NOISE.length - 1);
  return NOISE.map((n, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${(H / 2 + n * a * (H / 2 - 3)).toFixed(1)}`).join(" ");
}

const LABELS = ["Alta", "Bajando", "Casi nada", "En calma"];

/** Indicador de preocupación: el trazo nervioso se aplana a medida que todo se ordena. */
export function CalmMeter({ p, chapter, compact = false }: { p: MotionValue<number>; chapter: number; compact?: boolean }) {
  const amp = useTransform(p, [0, 0.26, 0.52, 0.88], [1, 0.7, 0.3, 0]);
  const d = useTransform(amp, wave);
  const color = useTransform(p, [0, 0.45, 0.86], ["#F67748", "#D9A441", "#3E9A55"]);
  const pending = useTransform(p, (v) => {
    const docs = DOCS.filter((_, i) => v < flyWindow(i).t2).length;
    const seals = AGENT_ORDER.filter((_, k) => v < stampAt(k) + 0.01).length;
    const n = docs + seals;
    return n === 0 ? "Nada pendiente" : `${n} ${n === 1 ? "cosa pendiente" : "cosas pendientes"}`;
  });

  return (
    <div className={`${s.meter} ${compact ? s.meterCompact : ""}`} aria-hidden="true">
      <div className={s.meterHead}>
        <span>Tu preocupación</span>
        <b data-calm={chapter === 3}>{LABELS[chapter] ?? LABELS[0]}</b>
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <motion.path d={d} fill="none" style={{ stroke: color }} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <motion.span className={s.pending}>{pending}</motion.span>
    </div>
  );
}
