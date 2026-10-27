"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { cubicBezier } from "motion";
import { BrandMark } from "@/components/brand/BrandLogo";
import { useBrand } from "@/components/brand/BrandProvider";
import { LawyerPortrait } from "@/components/sections/Portraits";
import { EASE } from "@/lib/motion";
import { AGENT_COLORS, AGENT_NAMES, DRAFTS, LOG, MORNING_ROWS, draftAt, formatClock, progressAt } from "./nightData";
import s from "./HeroNight.module.css";

const out = cubicBezier(...EASE.outExpo);
const stampEase = cubicBezier(...EASE.stamp);

/** El móvil de Mariana: pantalla de bloqueo, bitácora nocturna, revisión de la abogada y mensaje de buenos días. */
export function Phone({ p, clock }: { p: MotionValue<number>; clock: MotionValue<string> }) {
  const barColor = useTransform(p, [0.55, 0.6], ["#F3EEE7", "#2D2F34"]);
  return (
    <div className={s.phone}>
      <div className={s.screen}>
        <Layer p={p} range={[-1, 0, 0.27, 0.31]}>
          <Lock p={p} clock={clock} />
        </Layer>
        <Layer p={p} range={[0.28, 0.32, 0.54, 0.58]}>
          <NightLog p={p} />
        </Layer>
        <Layer p={p} range={[0.56, 0.6, 0.77, 0.8]}>
          <Review p={p} />
        </Layer>
        <Layer p={p} range={[0.78, 0.82, 2, 3]}>
          <Morning p={p} clock={clock} />
        </Layer>
        <motion.div className={s.statusBar} style={{ color: barColor }}>
          <motion.span>{clock}</motion.span>
          <span className={s.statusIcons} aria-hidden="true">
            <i />
            <i />
            <i />
            <b />
          </span>
        </motion.div>
      </div>
      <span className={s.island} aria-hidden="true" />
    </div>
  );
}

function Layer({ p, range, children }: { p: MotionValue<number>; range: [number, number, number, number]; children: ReactNode }) {
  const opacity = useTransform(p, range, [0, 1, 1, 0]);
  const visibility = useTransform(opacity, (o) => (o < 0.01 ? "hidden" : "visible"));
  return (
    <motion.div className={s.layer} style={{ opacity, visibility }}>
      {children}
    </motion.div>
  );
}

/* ---------- 23:47: pantalla de bloqueo ---------- */
function Notification({ p, at, app, when, text, tone }: { p: MotionValue<number>; at: number; app: string; when: string; text: string; tone: "warn" | "plain" }) {
  const opacity = useTransform(p, [at, at + 0.03], [0, 1]);
  const y = useTransform(p, [at, at + 0.04], [-18, 0], { ease: out });
  return (
    <motion.div className={s.notif} style={{ opacity, y }} data-tone={tone}>
      <span className={s.notifHead}>
        <b>{app}</b>
        <span>{when}</span>
      </span>
      <span className={s.notifText}>{text}</span>
    </motion.div>
  );
}

function Lock({ p, clock }: { p: MotionValue<number>; clock: MotionValue<string> }) {
  return (
    <div className={s.lock}>
      <span className={s.lockDate}>martes</span>
      <motion.span className={s.lockClock}>{clock}</motion.span>
      <div className={s.notifs}>
        <Notification p={p} at={-1} app="DEHú" when="hace 3 días" text="Tienes una notificación de la AEAT pendiente de leer." tone="warn" />
        <Notification p={p} at={0.15} app="Seguridad Social" when="ayer" text="Tu certificado electrónico ha caducado." tone="warn" />
        <Notification p={p} at={0.2} app="Correo" when="23:41" text="Distribuciones Levante: factura FA-2026-1190" tone="plain" />
      </div>
    </div>
  );
}

/* ---------- 00:12 → 03:40: la bitácora de la noche ---------- */
function NightLog({ p }: { p: MotionValue<number> }) {
  return (
    <div className={s.night}>
      <div className={s.nightHead}>
        <span className={s.moonIcon} aria-hidden="true" />
        <div>
          <b>Modo descanso</b>
          <span>Bitácora de esta noche</span>
        </div>
      </div>
      <ol className={s.log}>
        {LOG.map((e) => (
          <LogItem key={e.m} p={p} m={e.m} agent={e.agent} text={e.text} />
        ))}
      </ol>
    </div>
  );
}

function LogItem({ p, m, agent, text }: { p: MotionValue<number>; m: number; agent: keyof typeof AGENT_COLORS; text: string }) {
  const at = progressAt(m);
  const opacity = useTransform(p, [at - 0.006, at + 0.02], [0, 1]);
  const x = useTransform(p, [at - 0.006, at + 0.03], [14, 0], { ease: out });
  return (
    <motion.li style={{ opacity, x, "--c": AGENT_COLORS[agent] } as unknown as CSSProperties}>
      <span className={s.logTime}>{formatClock(m)}</span>
      <span className={s.logBody}>
        <b>{AGENT_NAMES[agent]}</b> {text}
      </span>
    </motion.li>
  );
}

/* ---------- 07:30: la abogada revisa con el primer café ---------- */
function Review({ p }: { p: MotionValue<number> }) {
  return (
    <div className={s.review}>
      <div className={s.reviewHead}>
        <span className={s.reviewFace}>
          <LawyerPortrait label="Tu abogada fiscal" />
        </span>
        <div>
          <b>Tu abogada</b>
          <span>Revisa 4 borradores</span>
        </div>
        <span className={s.coffee} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <ul className={s.drafts}>
        {DRAFTS.map((d, i) => (
          <Draft key={d.title} p={p} i={i} title={d.title} note={d.note} />
        ))}
      </ul>
    </div>
  );
}

function Draft({ p, i, title, note }: { p: MotionValue<number>; i: number; title: string; note: string }) {
  const at = draftAt(i);
  const pending = useTransform(p, [at, at + 0.01], [1, 0]);
  const done = useTransform(p, [at, at + 0.012], [0, 1]);
  const stamp = useTransform(p, [at, at + 0.016], [1.8, 1], { ease: stampEase });
  return (
    <li>
      <span className={s.draftTitle}>{title}</span>
      <span className={s.draftState}>
        <motion.span className={s.draftPending} style={{ opacity: pending }}>
          Pendiente
        </motion.span>
        <motion.span className={s.draftDone} style={{ opacity: done }}>
          ✓ {note}
        </motion.span>
      </span>
      <motion.span className={s.miniSeal} style={{ opacity: done, scale: stamp, rotate: -10 }} aria-hidden="true">
        V.º B.º
      </motion.span>
    </li>
  );
}

/* ---------- 08:15: buenos días ---------- */
function Morning({ p, clock }: { p: MotionValue<number>; clock: MotionValue<string> }) {
  const { brand } = useBrand();
  const cardY = useTransform(p, [0.8, 0.86], [26, 0], { ease: out });
  const cardO = useTransform(p, [0.8, 0.84], [0, 1]);
  return (
    <div className={s.morning}>
      <span className={s.lockDate} style={{ color: "#5E646E" }}>
        miércoles
      </span>
      <motion.span className={s.lockClock} style={{ color: "#2D2F34" }}>
        {clock}
      </motion.span>
      <motion.div className={s.alma} style={{ y: cardY, opacity: cardO }}>
        <div className={s.almaHead}>
          <span className={s.almaAvatar}>
            <BrandMark size={18} />
          </span>
          <b>Alma, de {brand.name}</b>
          <span>ahora</span>
        </div>
        <p className={s.almaHello}>Buenos días, Mariana. Mientras dormías:</p>
        <ul>
          {MORNING_ROWS.map((r, i) => (
            <MorningRow key={r} p={p} i={i} text={r} />
          ))}
        </ul>
        <p className={s.almaSigned}>Revisado por tu abogada a las 07:52.</p>
        <div className={s.almaActions}>
          <span>Firmar ahora</span>
          <span>Ver detalles</span>
        </div>
      </motion.div>
    </div>
  );
}

function MorningRow({ p, i, text }: { p: MotionValue<number>; i: number; text: string }) {
  const at = 0.84 + i * 0.022;
  const opacity = useTransform(p, [at, at + 0.02], [0, 1]);
  const x = useTransform(p, [at, at + 0.03], [-8, 0], { ease: out });
  return (
    <motion.li style={{ opacity, x }}>
      <span aria-hidden="true">✓</span>
      {text}
    </motion.li>
  );
}
