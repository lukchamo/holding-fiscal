"use client";

import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LogoMark } from "@/components/brand/LogoMark";
import { useBrand } from "@/components/brand/BrandProvider";
import { LawyerPortrait } from "@/components/sections/Portraits";
import { EASE, INSTANT } from "@/lib/motion";
import { ChartCard, StatCard, SummaryCard, TasksCard } from "./PanelCards";
import { TABS, type TabData } from "./platformData";
import s from "./HeroPlatform.module.css";

const COMPANIES = [
  { name: "Andino Holding SL", c: "var(--ag-elio)" },
  { name: "Andino Foods SL", c: "var(--ag-vera)" },
  { name: "Andino Inmuebles SL", c: "var(--ag-bruno)" },
];

/** Ventana de la plataforma: el trabajo de cada agente, siempre revisado por una persona. */
export function PlatformWindow({ tab }: { tab: TabData }) {
  const { brand } = useBrand();
  const reduced = useReducedMotion();

  return (
    <div className={s.window}>
      <aside className={s.sidebar} aria-hidden="true">
        <span className={s.sideBrand}>
          <LogoMark brand={brand.key} size={22} />
        </span>
        {TABS.map((t) => (
          <span key={t.key} className={s.sideAgent} data-active={t.key === tab.key} style={{ "--c": t.agent.color } as CSSProperties} title={t.agent.name}>
            {t.agent.initial}
          </span>
        ))}
        <span className={s.sideSep} />
        <span className={s.sideHuman}>
          <LawyerPortrait label="Tu abogada" />
        </span>
      </aside>

      <div className={s.main}>
        <header className={s.winHead}>
          <div>
            <b className={s.group}>Grupo Andino</b>
            <span className={s.companies}>
              {COMPANIES.map((c) => (
                <span key={c.name} className={s.company}>
                  <i style={{ background: c.c }} />
                  {c.name}
                </span>
              ))}
            </span>
          </div>
          <span className={s.reviewed}>
            <i /> Revisado por tu abogada
          </span>
        </header>

        <nav className={s.subtabs} aria-hidden="true">
          {["Resumen", ...TABS.map((t) => t.label), "Documentos"].map((label) => {
            const on = label === tab.label;
            return (
              <span key={label} className={on ? s.subOn : undefined}>
                {label}
                {on ? <motion.i layoutId="subtab-line" className={s.subLine} transition={{ type: "spring", stiffness: 500, damping: 40 }} /> : null}
              </span>
            );
          })}
        </nav>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab.key}
            className={s.grid}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0, transition: reduced ? INSTANT : { duration: 0.45, ease: EASE.outExpo } }}
            exit={reduced ? undefined : { opacity: 0, y: -8, transition: { duration: 0.18, ease: EASE.inOut } }}
          >
            <div className={s.aStat}>
              <StatCard tab={tab} />
            </div>
            <div className={s.aSummary}>
              <SummaryCard tab={tab} />
            </div>
            <div className={s.aChart}>
              <ChartCard tab={tab} />
            </div>
            <div className={s.aTasks}>
              <TasksCard tab={tab} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Tarjeta que sobresale abajo a la derecha: la persona que firma lo que el agente propone. */
export function ApprovalPop({ tabKey }: { tabKey: string }) {
  const reduced = useReducedMotion();
  return (
    <div className={`${s.pop} ${s.popApproval}`} aria-hidden="true">
      <span className={s.popFace}>
        <LawyerPortrait label="Tu abogada" />
      </span>
      <span className={s.popText}>
        <b>Tu abogada</b>
        <span>Revisa y firma cada paso</span>
      </span>
      <motion.span
        key={tabKey}
        className={s.popSeal}
        initial={{ opacity: 0, scale: 1.8, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: -12 }}
        transition={reduced ? INSTANT : { delay: 2.7, duration: 0.5, ease: EASE.stamp }}
      >
        V.º&nbsp;B.º
      </motion.span>
    </div>
  );
}

/** Aviso que sobresale abajo a la izquierda: lo último que ha propuesto el agente de la pestaña. */
export function AgentToast({ tab }: { tab: TabData }) {
  const reduced = useReducedMotion();
  return (
    <div className={`${s.pop} ${s.popAgent}`} aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={tab.key}
          className={s.toast}
          initial={{ opacity: 0, x: -28, rotate: 0 }}
          animate={{ opacity: 1, x: 0, rotate: -2, transition: reduced ? INSTANT : { type: "spring", stiffness: 260, damping: 22, delay: 0.3 } }}
          exit={reduced ? undefined : { opacity: 0, x: -18, transition: { duration: 0.18 } }}
        >
          <span className={s.toastHead}>
            <span className={s.mini} style={{ "--c": tab.agent.color } as CSSProperties}>
              {tab.agent.initial}
            </span>
            <b>{tab.toast.source}</b>
            <span>ahora</span>
          </span>
          <span className={s.toastText}>{tab.toast.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
