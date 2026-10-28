"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { EASE, INSTANT } from "@/lib/motion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { TASK_STEPS_MS, type Chart, type TabData } from "./platformData";
import s from "./HeroPlatform.module.css";

const NUM = new Intl.NumberFormat("es-ES", { useGrouping: true });
const fmt = (v: number) => (v >= 10000 ? NUM.format(v) : String(v));

/** Número que cuenta hasta su valor al aparecer (con «reducir movimiento», salta a él). */
function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${prefix}${fmt(Math.round(v))}${suffix}`);
  useEffect(() => {
    if (reduced) {
      mv.set(value);
      return;
    }
    const c = animate(mv, value, { duration: 1.1, ease: EASE.outExpo });
    return () => c.stop();
  }, [mv, value, reduced]);
  return <motion.span>{text}</motion.span>;
}

export function StatCard({ tab }: { tab: TabData }) {
  const reduced = useReducedMotion();
  const { stat } = tab;
  return (
    <div className={`${s.card} ${s.stat}`}>
      <span className={s.cardLabel}>{stat.label}</span>
      <span className={s.statValue}>
        <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
        {stat.total ? <span className={s.statTotal}> de {stat.total}</span> : null}
      </span>
      <span className={s.track}>
        <motion.span
          className={s.fill}
          style={{ background: tab.agent.color, transformOrigin: "left center" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: stat.progress / 100 }}
          transition={reduced ? INSTANT : { duration: 1.1, ease: EASE.outExpo, delay: 0.15 }}
        />
      </span>
      <span className={s.cardNote}>{stat.note}</span>
    </div>
  );
}

export function SummaryCard({ tab }: { tab: TabData }) {
  return (
    <div className={`${s.card} ${s.summary}`}>
      <span className={s.cardTitle}>{tab.summary.title}</span>
      <dl>
        {tab.summary.rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ---------- Gráficas ---------- */
export function ChartCard({ tab }: { tab: TabData }) {
  const c = tab.chart;
  // En el móvil la tarjeta va oculta: su gráfica ni se monta ni se anima. En el resto entra tras hidratar.
  const shown = useMediaQuery("(min-width: 760px)");
  return (
    <div className={`${s.card} ${s.chart}`}>
      <span className={s.cardTitle}>{c.title}</span>
      {/* Caja de proporción fija: las tres gráficas ocupan lo mismo y el panel no cambia de alto al rotar */}
      <div className={s.chartBox}>
        {!shown ? null : c.kind === "line" ? <LineChart chart={c} color={tab.agent.color} /> : c.kind === "bars" ? <Bars chart={c} color={tab.agent.color} /> : <Tree />}
      </div>
    </div>
  );
}

const W = 420;
const H = 150;
const PAD = { l: 8, r: 8, t: 16, b: 22 };

function LineChart({ chart, color }: { chart: Extract<Chart, { kind: "line" }>; color: string }) {
  const reduced = useReducedMotion();
  const max = Math.max(...chart.points);
  const min = Math.min(0, ...chart.points);
  const n = chart.points.length;
  const xy = chart.points.map((v, i) => {
    const x = PAD.l + (i * (W - PAD.l - PAD.r)) / (n - 1);
    const y = PAD.t + (1 - (v - min) / (max - min || 1)) * (H - PAD.t - PAD.b);
    return [x, y] as const;
  });
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${xy[n - 1][0].toFixed(1)} ${H - PAD.b} L${xy[0][0].toFixed(1)} ${H - PAD.b} Z`;
  const [lx, ly] = xy[n - 1];
  const d = reduced ? 0 : 1;

  return (
    <div className={s.lineWrap}>
      <svg viewBox={`0 0 ${W} ${H}`} className={s.lineSvg} aria-hidden="true">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={PAD.l} x2={W - PAD.r} y1={PAD.t + f * (H - PAD.t - PAD.b)} y2={PAD.t + f * (H - PAD.t - PAD.b)} className={s.gridLine} />
        ))}
        <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t} y2={PAD.t} className={s.gridDashed} />
        <motion.path d={area} style={{ fill: color }} className={s.area} initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ duration: 0.6 * d, delay: 0.7 * d }} />
        <motion.path
          d={line}
          className={s.line}
          style={{ stroke: color }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1 * d, ease: EASE.inOut }}
        />
        <motion.circle cx={lx} cy={ly} r={5} style={{ fill: color }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={reduced ? INSTANT : { delay: 1.05, type: "spring", stiffness: 500, damping: 18 }} />
        {chart.labels.map((l, i) => (
          <text key={l} x={xy[i][0]} y={H - 5} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} className={s.axis}>
            {l}
          </text>
        ))}
      </svg>
      {/* El ancla coloca el tooltip a la izquierda del punto: encima si el punto está abajo, debajo si está arriba. */}
      <div className={s.tipAnchor} data-place={ly > H / 2 ? "above" : "below"} style={{ left: `${(lx / W) * 100}%`, top: `${(ly / H) * 100}%` }}>
        <motion.div
          className={s.tooltip}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 * d, duration: 0.4 * d, ease: EASE.outExpo }}
        >
          <b>{chart.tooltip.title}</b>
          {chart.tooltip.rows.map(([k, v]) => (
            <span key={k}>
              {k}
              <i>{v}</i>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Bars({ chart, color }: { chart: Extract<Chart, { kind: "bars" }>; color: string }) {
  const reduced = useReducedMotion();
  return (
    <ul className={s.bars}>
      {chart.bars.map((b, i) => (
        <li key={b.label}>
          <span className={s.barHead}>
            <span>{b.label}</span>
            <b>{b.tag}</b>
          </span>
          <span className={s.track}>
            <motion.span
              className={s.fill}
              style={{ background: color, transformOrigin: "left center" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: b.value / 100 }}
              transition={reduced ? INSTANT : { duration: 1, ease: EASE.outExpo, delay: 0.2 + i * 0.15 }}
            />
          </span>
          <span className={s.cardNote}>Encaje {b.value} %</span>
        </li>
      ))}
    </ul>
  );
}

function Tree() {
  const reduced = useReducedMotion();
  const t = (delay: number) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: reduced ? INSTANT : { delay, duration: 0.4, ease: EASE.outExpo } });
  const grow = (delay: number, axis: "x" | "y") => ({
    initial: axis === "x" ? { scaleX: 0 } : { scaleY: 0 },
    animate: axis === "x" ? { scaleX: 1 } : { scaleY: 1 },
    transition: reduced ? INSTANT : { delay, duration: 0.35, ease: EASE.inOut },
  });
  return (
    <div className={s.tree}>
      <motion.span className={`${s.node} ${s.nodePerson}`} {...t(0.1)}>
        Mariana Ortega
      </motion.span>
      <motion.span className={s.vline} style={{ transformOrigin: "top" }} {...grow(0.45, "y")} />
      <motion.span className={`${s.node} ${s.nodeHold}`} {...t(0.75)}>
        Andino Holding SL
      </motion.span>
      <motion.span className={s.vline} style={{ transformOrigin: "top" }} {...grow(1.05, "y")} />
      <motion.span className={s.hline} {...grow(1.3, "x")} />
      <div className={s.kids}>
        <motion.span className={s.node} {...t(1.55)}>
          Andino Foods SL
        </motion.span>
        <motion.span className={s.node} {...t(1.7)}>
          Andino Inmuebles SL
        </motion.span>
      </div>
    </div>
  );
}

/* ---------- Tablero de tareas: de «Pendiente» a «Hecho» ---------- */
/** Posición de cada tarjeta, por id, para animar el cambio de columna. */
const snapshot = (root: HTMLElement | null) =>
  new Map([...(root?.querySelectorAll<HTMLElement>("[data-task]") ?? [])].map((el) => [el.dataset.task ?? "", el.getBoundingClientRect()]));

export function TasksCard({ tab }: { tab: TabData }) {
  const reduced = useReducedMotion();
  // Seguro para la hidratación: con «reducir movimiento» cambia qué tareas se pintan en cada columna.
  const settled = useReducedMotionSafe();
  const total = tab.tasks.length;
  const [doneCount, setDoneCount] = useState(0);
  const board = useRef<HTMLDivElement>(null);
  const before = useRef<Map<string, DOMRect> | null>(null);

  useEffect(() => {
    if (reduced) return;
    const timers = TASK_STEPS_MS.slice(0, total).map((ms, i) =>
      window.setTimeout(() => {
        before.current = snapshot(board.current);
        setDoneCount(i + 1);
      }, ms),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [reduced, total]);

  // FLIP: tras mover la tarea, cada tarjeta sale de donde estaba y llega a su sitio.
  // Web Animations solo con transform: lo mueve el compositor, sin JavaScript por fotograma.
  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    if (!prev) return;
    for (const [id, rect] of snapshot(board.current)) {
      const from = prev.get(id);
      const dx = from ? from.left - rect.left : 0;
      const dy = from ? from.top - rect.top : 0;
      if (!dx && !dy) continue;
      board.current?.querySelector<HTMLElement>(`[data-task="${id}"]`)?.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 560, easing: "cubic-bezier(0.22, 1.2, 0.36, 1)" });
    }
  }, [doneCount]);

  // Con «reducir movimiento», todo aparece ya resuelto.
  const shown = settled ? total : doneCount;
  const pending = tab.tasks.slice(shown);
  const done = tab.tasks.slice(0, shown).reverse();

  return (
    <div className={`${s.card} ${s.tasks}`}>
      <span className={s.cardTitle}>Tareas de {tab.agent.name}</span>
      <div ref={board} className={s.columns}>
        <div>
          <span className={s.colHead}>
            <i style={{ background: "var(--ember)" }} /> Pendiente <b>{pending.length}</b>
          </span>
          <ul>
            {pending.map((t) => (
              <li key={t.id} data-task={t.id} className={s.task}>
                <span className={s.taskTitle}>{t.title}</span>
                <span className={s.taskMeta}>
                  <span className={s.mini} style={{ "--c": tab.agent.color } as CSSProperties}>
                    {tab.agent.initial}
                  </span>
                  {tab.agent.name} lo prepara
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className={s.colHead}>
            <i style={{ background: "var(--green)" }} /> Hecho <b>{done.length}</b>
          </span>
          <ul>
            {done.map((t) => (
              <li key={t.id} data-task={t.id} className={`${s.task} ${s.taskDone}`}>
                <span className={s.taskTitle}>{t.title}</span>
                <span className={s.taskMeta}>
                  <span className={s.check}>✓</span>
                  {t.done}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
