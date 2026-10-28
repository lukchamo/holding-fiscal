"use client";

import type { CSSProperties } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { cubicBezier } from "motion";
import { geometryFor, type BrandKey } from "@/components/brand/brands";
import { EASE } from "@/lib/motion";
import { AdvisorPortrait, LawyerPortrait } from "@/components/sections/Portraits";
import { TEAM } from "@/content/data";
import {
  AGENT_ORDER,
  AGENTS_META,
  DOCS,
  PILES,
  SUMMARY_ROWS,
  T,
  flyWindow,
  markTransform,
  pileSlot,
  stampAt,
  type AgentKey,
  type Comp,
  type DocDef,
} from "./chaosData";
import s from "./HeroChaos.module.css";

const lin = (t: number) => t;
const out = cubicBezier(...EASE.outExpo);
const inOut = cubicBezier(...EASE.inOut);
const easeIn = cubicBezier(0.55, 0, 1, 0.45);

/** Escenario de la portada 2. Todo el movimiento deriva del progreso de scroll `p`. */
export function ChaosStage({ comp, p, chapter, brand }: { comp: Comp; p: MotionValue<number>; chapter: number; brand: BrandKey }) {
  return (
    <div className={s.scene} style={{ width: comp.w, height: comp.h }} data-chapter={chapter}>
      <Wires comp={comp} p={p} />
      <BigMark comp={comp} p={p} brand={brand} />
      <Alma comp={comp} p={p} working={chapter === 1} />
      {AGENT_ORDER.map((k, i) => (
        <Agent key={k} k={k} i={i} comp={comp} p={p} working={chapter === 1} />
      ))}
      {DOCS.map((d, i) => (
        <Doc key={d.id} d={d} i={i} comp={comp} p={p} />
      ))}
      {AGENT_ORDER.map((k, i) => (
        <Seal key={k} k={k} i={i} comp={comp} p={p} />
      ))}
      <Humans comp={comp} p={p} />
      <Summary comp={comp} p={p} brand={brand} />
    </div>
  );
}

/* ---------- Papeles ---------- */
function Doc({ d, i, comp, p }: { d: DocDef; i: number; comp: Comp; p: MotionValue<number> }) {
  const [cx, cy, cr] = comp.chaos[d.id];
  const slot = pileSlot(comp, d.id);
  const { t1, tm, t2 } = flyWindow(i);
  const lift = Math.min(cy, slot.y) - 56;

  const x = useTransform(p, [0, t1, tm, t2, T.collapse, T.collapsed], [cx, cx, (cx + slot.x) / 2, slot.x, slot.x, comp.center.x], {
    ease: [lin, out, inOut, lin, easeIn],
  });
  const y = useTransform(p, [0, t1, tm, t2, T.collapse, T.collapsed], [cy, cy, lift, slot.y, slot.y, comp.center.y], {
    ease: [lin, out, inOut, lin, easeIn],
  });
  const rotate = useTransform(p, [0, t1, t2, T.collapse, T.collapsed], [cr, cr, slot.r, slot.r, 0], { ease: [lin, inOut, lin, easeIn] });
  const scale = useTransform(p, [0, t1, tm, t2, T.collapse, T.collapsed], [1, 1, 1.07, comp.pileScale, comp.pileScale, 0.35], {
    ease: [lin, out, inOut, lin, easeIn],
  });
  const opacity = useTransform(p, [T.collapse, T.collapsed - 0.01], [1, 0]);
  const zIndex = useTransform(p, (v) => (v < t1 ? 10 + i : v < t2 ? 60 + i : slot.z));
  // Mientras hay caos, los papeles flotan; en cuanto alguien los coge, dejan de hacerlo.
  const amp = useTransform(p, [0, 0.16, t1], [1, 0.7, 0]);

  const stamp = slot.isTop ? stampAt(AGENT_ORDER.indexOf(d.agent)) : 2;
  const before = useTransform(p, [stamp, stamp + 0.012], [1, 0]);
  const after = useTransform(p, [stamp, stamp + 0.012], [0, 1]);

  const meta = AGENTS_META[d.agent];
  return (
    <motion.div
      className={s.doc}
      style={{ width: comp.doc.w, height: comp.doc.h, left: -comp.doc.w / 2, top: -comp.doc.h / 2, x, y, rotate, scale, opacity, zIndex, "--c": meta.color, "--amp": amp } as unknown as CSSProperties}
    >
      <div className={s.docInner} style={{ "--dur": `${5.6 + (i % 5) * 0.7}s`, "--delay": `${-i * 0.9}s` } as CSSProperties}>
        <span className={s.docType}>{d.type}</span>
        <span className={s.docTitle}>{d.title}</span>
        <span className={s.docLine} style={{ width: "86%" }} />
        <span className={s.docLine} style={{ width: "58%" }} />
        {d.badge ? (
          <span className={s.badges}>
            <motion.span className={`${s.badge} ${d.badge.tone === "warn" ? s.warn : s.info}`} style={{ opacity: before }}>
              {d.badge.text}
            </motion.span>
            {d.after ? (
              <motion.span className={`${s.badge} ${s.ok}`} style={{ opacity: after }}>
                ✓ {d.after}
              </motion.span>
            ) : null}
          </span>
        ) : null}
      </div>
    </motion.div>
  );
}

/* ---------- Agentes ---------- */
function Avatar({ initial, color, size, working }: { initial: string; color: string; size: number; working: boolean }) {
  return (
    <span className={s.avatar} data-working={working} style={{ width: size, height: size, "--c": color, fontSize: size * 0.46 } as CSSProperties}>
      {initial}
    </span>
  );
}

function Alma({ comp, p, working }: { comp: Comp; p: MotionValue<number>; working: boolean }) {
  const opacity = useTransform(p, [T.almaIn, T.almaIn + 0.05, T.collapse, T.collapse + 0.05], [0, 1, 1, 0]);
  const scale = useTransform(p, [T.almaIn, T.almaIn + 0.05], [0.5, 1], { ease: out });
  const size = comp.w > 500 ? 54 : 44;
  return (
    <motion.div className={s.agentWrap} style={{ left: comp.alma.x, top: comp.alma.y, opacity, scale, zIndex: 40, "--s": `${size}px` } as unknown as CSSProperties}>
      <Avatar initial="A" color="var(--ag-alma)" size={size} working={working} />
      <span className={s.agentName}>Alma coordina</span>
    </motion.div>
  );
}

function Agent({ k, i, comp, p, working }: { k: AgentKey; i: number; comp: Comp; p: MotionValue<number>; working: boolean }) {
  const meta = AGENTS_META[k];
  const a = T.agentsIn + i * 0.022;
  const opacity = useTransform(p, [a, a + 0.05, T.collapse, T.collapse + 0.05], [0, 1, 1, 0]);
  const scale = useTransform(p, [a, a + 0.05], [0.5, 1], { ease: out });
  const countOpacity = useTransform(p, [T.countsIn, T.countsIn + 0.04, T.collapse, T.collapse + 0.04], [0, 1, 1, 0]);
  const pos = comp.avatar(k);
  const lab = comp.label(k);
  const size = comp.w > 500 ? 46 : 38;
  return (
    <>
      <motion.div className={s.agentWrap} style={{ left: pos.x, top: pos.y, opacity, scale, zIndex: 120, "--s": `${size}px` } as unknown as CSSProperties}>
        <Avatar initial={meta.initial} color={meta.color} size={size} working={working} />
        <span className={s.agentName}>
          {meta.name} <span className={s.agentBin}>· {meta.bin}</span>
        </span>
      </motion.div>
      <motion.span className={s.count} style={{ left: lab.x, top: lab.y, opacity: countOpacity }}>
        {meta.count}
      </motion.span>
    </>
  );
}

function Wires({ comp, p }: { comp: Comp; p: MotionValue<number> }) {
  return (
    <svg className={s.wires} width={comp.w} height={comp.h} viewBox={`0 0 ${comp.w} ${comp.h}`} aria-hidden="true">
      {AGENT_ORDER.map((k, i) => (
        <Wire key={k} i={i} from={comp.alma} to={comp.avatar(k)} p={p} />
      ))}
    </svg>
  );
}

function Wire({ i, from, to, p }: { i: number; from: { x: number; y: number }; to: { x: number; y: number }; p: MotionValue<number> }) {
  const a = T.linesIn + i * 0.02;
  const pathLength = useTransform(p, [a, a + 0.09, T.collapse, T.collapse + 0.06], [0, 1, 1, 0], { ease: [out, lin, inOut] });
  const opacity = useTransform(p, [a, a + 0.02, T.collapse + 0.03, T.collapse + 0.06], [0, 1, 1, 0]);
  const mx = (from.x + to.x) / 2;
  const my = Math.min(from.y, to.y) + Math.abs(to.y - from.y) * 0.15 - 24;
  return <motion.path d={`M${from.x} ${from.y} Q${mx} ${my} ${to.x} ${to.y}`} className={s.wire} style={{ pathLength, opacity }} />;
}

/* ---------- Personas: firman ---------- */
function Seal({ k, i, comp, p }: { k: AgentKey; i: number; comp: Comp; p: MotionValue<number> }) {
  const at = stampAt(i);
  const top = PILES[k][PILES[k].length - 1];
  const slot = pileSlot(comp, top);
  const scale = useTransform(p, [at, at + 0.014, at + 0.024], [1.9, 0.92, 1], { ease: [out, inOut] });
  const opacity = useTransform(p, [at, at + 0.008, T.collapse, T.collapse + 0.05], [0, 1, 1, 0]);
  const size = comp.w > 500 ? 58 : 46;
  return (
    <motion.div
      className={s.seal}
      style={{ width: size, height: size, left: slot.x + comp.doc.w * 0.36 - size / 2, top: slot.y + comp.doc.h * 0.3 - size / 2, scale, opacity, rotate: -12, zIndex: 200 }}
    >
      V.º B.º
    </motion.div>
  );
}

function Humans({ comp, p }: { comp: Comp; p: MotionValue<number> }) {
  const opacity = useTransform(p, [T.humansIn, T.humansIn + 0.05, T.collapse, T.collapse + 0.05], [0, 1, 1, 0]);
  const y = useTransform(p, [T.humansIn, T.humansIn + 0.06], [36, 0], { ease: out });
  const { r } = comp.humans;
  return (
    <motion.div className={s.humans} style={{ top: comp.humans.y - r, left: 0, width: comp.w, opacity, y, zIndex: 210 }}>
      <div className={s.human} style={{ left: comp.humans.lawyer - r }}>
        <span className={s.face} style={{ width: r * 2, height: r * 2 }}>
          <LawyerPortrait label={`${TEAM.abogada.name}, tu abogada fiscal`} />
        </span>
        <span className={s.humanLabel}>
          {TEAM.abogada.first}
          <small>abogada</small>
        </span>
      </div>
      <div className={s.human} style={{ left: comp.humans.advisor - r }}>
        <span className={s.face} style={{ width: r * 2, height: r * 2 }}>
          <AdvisorPortrait label={`${TEAM.gestor.name}, tu gestor`} />
        </span>
        <span className={s.humanLabel}>
          {TEAM.gestor.first}
          <small>gestor</small>
        </span>
      </div>
    </motion.div>
  );
}

/* ---------- La calma: el símbolo de la marca abraza el resumen ---------- */
function BigMark({ comp, p, brand }: { comp: Comp; p: MotionValue<number>; brand: BrandKey }) {
  const g = geometryFor(brand);
  const { k, ox, oy } = markTransform(comp);
  // Grosor en unidades de la retícula de 32: así el trazo escala con el símbolo y pathLength sigue normalizado.
  const sw = comp.mark.stroke / k;
  const stem = useTransform(p, [T.markStem, T.markStem + 0.05], [0, 1], { ease: inOut });
  const arc = useTransform(p, [T.markArc, T.markEnd], [0, 1], { ease: out });
  const opacity = useTransform(p, [T.markStem - 0.01, T.markStem + 0.01], [0, 1]);
  const raysOpacity = useTransform(p, [T.markEnd - 0.02, T.markEnd + 0.02], [0, 1]);
  return (
    <motion.svg className={s.bigMark} width={comp.w} height={comp.h} viewBox={`0 0 ${comp.w} ${comp.h}`} style={{ opacity }} aria-hidden="true">
      <g transform={`translate(${ox} ${oy}) scale(${k})`}>
        {"stem" in g ? <motion.path d={g.stem} style={{ pathLength: stem }} strokeWidth={sw} /> : null}
        <motion.path d={g.arc} style={{ pathLength: arc }} strokeWidth={sw} />
        {"rays" in g ? <motion.path d={g.rays} className={s.bigRays} style={{ opacity: raysOpacity }} strokeWidth={sw * 0.55} /> : null}
      </g>
    </motion.svg>
  );
}

function Summary({ comp, p, brand }: { comp: Comp; p: MotionValue<number>; brand: BrandKey }) {
  const g = geometryFor(brand);
  const { k, ox, oy } = markTransform(comp);
  const cx = ox + g.dot.cx * k;
  const cy = oy + g.dot.cy * k + (comp.w > 500 ? 0 : 10);
  const opacity = useTransform(p, [T.cardIn, T.cardIn + 0.06], [0, 1]);
  const scale = useTransform(p, [T.cardIn, T.cardIn + 0.07], [0.86, 1], { ease: out });
  const y = useTransform(p, [T.cardIn, T.cardIn + 0.07], [22, 0], { ease: out });
  const dotY = useTransform(p, [0.93, 0.965], [-26, 0], { ease: cubicBezier(...EASE.stamp) });
  const dotOpacity = useTransform(p, [0.93, 0.945], [0, 1]);
  return (
    <motion.div className={s.summary} style={{ width: comp.card.w, minHeight: comp.card.h, left: cx - comp.card.w / 2, top: cy - comp.card.h / 2, opacity, scale, y, zIndex: 300 }}>
      <motion.span className={s.summaryDot} style={{ y: dotY, opacity: dotOpacity }} aria-hidden="true" />
      <span className={s.summaryKicker}>Grupo Andino</span>
      <span className={s.summaryTitle}>Todo en orden</span>
      <ul>
        {SUMMARY_ROWS.map((row, r) => (
          <SummaryRow key={row} text={row} r={r} p={p} />
        ))}
      </ul>
    </motion.div>
  );
}

function SummaryRow({ text, r, p }: { text: string; r: number; p: MotionValue<number> }) {
  const a = T.cardIn + 0.05 + r * 0.018;
  const opacity = useTransform(p, [a, a + 0.02], [0, 1]);
  const x = useTransform(p, [a, a + 0.03], [-10, 0], { ease: out });
  return (
    <motion.li style={{ opacity, x }}>
      <span className={s.tick} aria-hidden="true">
        ✓
      </span>
      {text}
    </motion.li>
  );
}
