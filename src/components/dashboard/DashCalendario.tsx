"use client";

import { useEffect, useRef, useState } from "react";
import { AgentAvatar, PersonPortrait, Seal } from "@/components/sections/team/TeamParts";
import {
  agentOf,
  companyOf,
  COMPANIES,
  dayOf,
  daysFrom,
  dueLabel,
  monthLong,
  monthShort,
  OBLIGATIONS,
  reviewerOf,
  shortDate,
  STATE_LABEL,
  TODAY_ISO,
  toTime,
  weekday,
  type ObState,
  type Obligation,
} from "./dashData";
import { Icon } from "./Icons";
import s from "./calendario.module.css";

const START = "2026-10-01";
const END = "2027-03-05";
const DAYS = daysFrom(END, toTime(START)) + 1;
const MONTHS = ["2026-10-01", "2026-11-01", "2026-12-01", "2027-01-01", "2027-02-01", "2027-03-01"];
const LABEL_W = 168;
const MIN_PX = 5.6;
const ROW = 44;

type Filter = "all" | "you" | "doing" | "scheduled" | "done";
const FILTERS: readonly { key: Filter; label: string; match: (s: ObState) => boolean }[] = [
  { key: "all", label: "Todo", match: () => true },
  { key: "you", label: "Te necesita", match: (st) => st === "you" },
  { key: "doing", label: "En curso", match: (st) => st === "prep" || st === "review" },
  { key: "scheduled", label: "Programado", match: (st) => st === "scheduled" },
  { key: "done", label: "Hecho", match: (st) => st === "done" },
];

/** Ancho aproximado de la etiqueta (12,5 px, seminegrita) más el icono. */
const labelWidth = (text: string) => Math.ceil(text.length * 6.9) + 26;

/** Reparte los plazos de una sociedad en filas: ni las barras ni sus etiquetas se pisan. */
function pack(items: readonly Obligation[], x: (iso: string) => number, px: number) {
  const ends: number[] = [];
  return [...items]
    .sort((a, b) => toTime(a.from) - toTime(b.from))
    .map((o) => {
      const left = x(o.from);
      const barW = Math.max(px * 3, x(o.due) - left + px);
      const w = Math.max(barW, labelWidth(o.short));
      let row = ends.findIndex((end) => end + 12 < left);
      if (row < 0) row = ends.length;
      ends[row] = left + w;
      return { o, row, left, barW, w };
    });
}

const cap = (txt: string) => txt.charAt(0).toUpperCase() + txt.slice(1);

/**
 * Alternativa C · «Calendario». El tiempo manda: cada sociedad es un carril y
 * cada plazo, una barra desde que el agente empieza a prepararlo hasta que
 * vence. La línea de hoy separa lo hecho de lo que viene.
 */
export function DashCalendario() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Obligation | null>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const match = FILTERS.find((f) => f.key === filter)?.match ?? (() => true);
  const counts = (f: (typeof FILTERS)[number]) => OBLIGATIONS.filter((o) => f.match(o.state)).length;

  const show = (o: Obligation, from: HTMLElement) => {
    returnTo.current = from;
    setOpen(o);
  };
  const close = () => {
    setOpen(null);
    returnTo.current?.focus();
  };

  return (
    <div className={s.page}>
      <header className={s.head}>
        <h1>Calendario del grupo</h1>
        <p className={s.sub}>De octubre de 2026 a febrero de 2027: cada plazo, con quién lo prepara y quién lo revisa.</p>
      </header>

      <div className={s.toolbar}>
        <div className={s.filters} role="group" aria-label="Filtrar por estado">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)} data-kind={f.key}>
              {f.key !== "all" ? <i aria-hidden="true" /> : null}
              {f.label}
              <span className={s.n}>{counts(f)}</span>
            </button>
          ))}
        </div>
      </div>

      <Gantt match={match} onOpen={show} />
      <Agenda match={match} onOpen={show} />

      {open ? <Drawer o={open} onClose={close} /> : null}
    </div>
  );
}

/* ---------- Cronograma ---------- */
function Gantt({ match, onOpen }: { match: (s: ObState) => boolean; onOpen: (o: Obligation, el: HTMLElement) => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const px = Math.max(MIN_PX, (width - LABEL_W) / DAYS);
  const x = (iso: string) => daysFrom(iso, toTime(START)) * px;
  const canvas = LABEL_W + DAYS * px;
  const todayX = LABEL_W + x(TODAY_ISO) + px / 2;
  const lanes = COMPANIES.map((c) => {
    const placed = pack(
      OBLIGATIONS.filter((o) => o.company === c.key),
      x,
      px,
    );
    return { company: c, placed, rows: Math.max(1, ...placed.map((p) => p.row + 1)) };
  });

  const toToday = () => scroller.current?.scrollTo({ left: Math.max(0, todayX - LABEL_W - 120), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  // Al abrir en pantallas estrechas, hoy queda a la vista
  useEffect(() => {
    const el = scroller.current;
    if (el && el.scrollWidth > el.clientWidth) el.scrollLeft = Math.max(0, todayX - LABEL_W - 120);
  }, [todayX]);

  return (
    <section className={s.gantt} aria-labelledby="h-cronograma">
      <div className={s.ganttHead}>
        <h2 id="h-cronograma">Cronograma por sociedad</h2>
        <ul className={s.legend} aria-label="Leyenda">
          {(["you", "prep", "review", "scheduled", "done"] as const).map((st) => (
            <li key={st}>
              <i data-state={st} aria-hidden="true" />
              {STATE_LABEL[st]}
            </li>
          ))}
        </ul>
        <button type="button" className={s.todayBtn} onClick={toToday}>
          Ir a hoy
        </button>
      </div>

      <div ref={scroller} className={s.scroller}>
        <div className={s.canvas} style={{ width: canvas }}>
          {/* Meses */}
          <div className={s.months} style={{ marginLeft: LABEL_W }} aria-hidden="true">
            {MONTHS.map((m, i) => {
              const left = x(m);
              const right = i < MONTHS.length - 1 ? x(MONTHS[i + 1]) : DAYS * px;
              return (
                <span key={m} style={{ left, width: right - left }}>
                  {cap(monthLong(m))}
                  {m === "2027-01-01" ? " 2027" : ""}
                </span>
              );
            })}
          </div>

          {lanes.map(({ company: c, placed, rows }) => (
            <div key={c.key} className={s.lane} style={{ height: rows * ROW + 14 }}>
              <div className={s.laneLabel} style={{ width: LABEL_W }}>
                <i style={{ background: c.color }} aria-hidden="true" />
                <span>
                  <b>{c.name}</b>
                  <small>{c.note ?? `${placed.filter((p) => p.o.state !== "done").length} plazos por delante`}</small>
                </span>
              </div>
              <ul className={s.track} style={{ left: LABEL_W, width: DAYS * px }} aria-label={c.name}>
                {MONTHS.slice(1).map((m) => (
                  <li key={m} className={s.monthLine} style={{ left: x(m) }} aria-hidden="true" />
                ))}
                {placed.map(({ o, row, left, barW, w }) => (
                  <li key={o.id} className={s.item} style={{ left, top: 10 + row * ROW, width: w }}>
                    <button
                      type="button"
                      className={s.itemBtn}
                      data-state={o.state}
                      data-dim={!match(o.state)}
                      aria-label={`${o.short}: ${o.title}, ${c.short}, ${STATE_LABEL[o.state].toLowerCase()}, ${o.state === "done" ? `presentado el ${shortDate(o.due)}` : `vence el ${shortDate(o.due)}`}`}
                      onClick={(e) => onOpen(o, e.currentTarget)}
                    >
                      <span className={s.itemLabel}>
                        {o.state === "you" ? <Icon name="pen" size={13} /> : o.state === "done" ? <Icon name="check" size={13} /> : null}
                        {o.short}
                      </span>
                      <span className={s.thin} data-state={o.state} style={{ width: barW }}>
                        <span className={s.milestone} data-state={o.state} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={s.today} style={{ left: todayX }} aria-hidden="true">
            <span>Hoy · {shortDate(TODAY_ISO)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Agenda (la vista del móvil; en escritorio, las próximas semanas) ---------- */
function Agenda({ match, onOpen }: { match: (s: ObState) => boolean; onOpen: (o: Obligation, el: HTMLElement) => void }) {
  const list = [...OBLIGATIONS].filter((o) => match(o.state)).sort((a, b) => toTime(a.due) - toTime(b.due));
  const upcoming = list.filter((o) => daysFrom(o.due) >= 0);
  const past = list.filter((o) => daysFrom(o.due) < 0);
  const groups = new Map<string, Obligation[]>();
  upcoming.forEach((o) => {
    const k = o.due.slice(0, 7);
    groups.set(k, [...(groups.get(k) ?? []), o]);
  });

  return (
    <section className={s.agenda} aria-labelledby="h-agenda">
      <h2 id="h-agenda">Agenda</h2>
      {[...groups.entries()].map(([k, items]) => (
        <div key={k} className={s.agendaMonth} data-later={daysFrom(items[0].due) > 31}>
          <p className={s.agendaTitle}>
            {cap(monthLong(`${k}-01`))}
            {k === "2027-01" ? " 2027" : ""}
          </p>
          <ul>
            {items.map((o) => (
              <AgendaRow key={o.id} o={o} onOpen={onOpen} />
            ))}
          </ul>
        </div>
      ))}
      {!upcoming.length ? <p className={s.none}>Nada por delante con este filtro.</p> : null}
      {past.length ? (
        <details className={s.past}>
          <summary>Ya presentado ({past.length})</summary>
          <ul>
            {past.map((o) => (
              <AgendaRow key={o.id} o={o} onOpen={onOpen} />
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

function AgendaRow({ o, onOpen }: { o: Obligation; onOpen: (o: Obligation, el: HTMLElement) => void }) {
  const c = companyOf(o.company);
  const agent = agentOf(o.agent);
  return (
    <li>
      <button type="button" className={s.row} data-state={o.state} onClick={(e) => onOpen(o, e.currentTarget)}>
        <span className={s.date}>
          <small>{weekday(o.due)}</small>
          <b>{dayOf(o.due)}</b>
          <small>{monthShort(o.due)}</small>
        </span>
        <span className={s.rowBody}>
          <b>{o.title}</b>
          <span className={s.rowMeta}>
            <i style={{ background: c.color }} aria-hidden="true" />
            {c.short} · prepara {agent.name}, revisa {reviewerOf(o.reviewer).first}
          </span>
        </span>
        <span className={s.chip} data-state={o.state}>
          {o.state === "you" ? <Icon name="pen" size={14} /> : o.state === "done" ? <Icon name="check" size={14} /> : null}
          {STATE_LABEL[o.state]}
        </span>
      </button>
    </li>
  );
}

/* ---------- Ficha del plazo ---------- */
const STEPS: Record<ObState, readonly ("done" | "now" | "next")[]> = {
  done: ["done", "done", "done"],
  you: ["done", "done", "now"],
  review: ["done", "now", "next"],
  prep: ["now", "next", "next"],
  scheduled: ["next", "next", "next"],
};

function Drawer({ o, onClose }: { o: Obligation; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const c = companyOf(o.company);
  const agent = agentOf(o.agent);
  const person = reviewerOf(o.reviewer);
  const steps = STEPS[o.state];

  useEffect(() => {
    panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = [...panel.current.querySelectorAll<HTMLElement>("button, [href], [tabindex='0']")];
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, o.id]);

  return (
    <div className={s.overlay} onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={panel} className={s.drawer} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className={s.dHead}>
          <span className={s.company}>
            <i style={{ background: c.color }} aria-hidden="true" />
            {c.name}
          </span>
          <button type="button" className={s.close} onClick={onClose} aria-label="Cerrar" data-autofocus>
            <Icon name="close" />
          </button>
        </div>
        <h2 id="drawer-title">{o.title}</h2>
        <p className={s.dMeta}>
          <span className={s.chip} data-state={o.state}>
            {STATE_LABEL[o.state]}
          </span>
          {o.state === "done" ? `Presentado el ${shortDate(o.due)}` : `${dueLabel(o.due)} · ${shortDate(o.due)}`}
        </p>

        <ol className={s.steps}>
          <li data-step={steps[0]}>
            <AgentAvatar agent={agent} size={34} />
            <span>
              <b>Prepara {agent.name}</b>
              {steps[0] === "next" ? `Empieza el ${shortDate(o.from)}` : steps[0] === "now" ? `Desde el ${shortDate(o.from)}: reúne datos y redacta el borrador` : "Borrador listo, con las fuentes citadas"}
            </span>
          </li>
          <li data-step={steps[1]}>
            <span className={s.face} aria-hidden="true">
              <PersonPortrait k={o.reviewer} />
            </span>
            <span>
              <b>Revisa {person.first}</b>
              {steps[1] === "done" ? `Revisado por ${person.name}, ${person.role.toLowerCase()}` : steps[1] === "now" ? "Lo está revisando ahora" : "Cuando el borrador esté listo"}
            </span>
          </li>
          <li data-step={steps[2]}>
            <span className={s.you} aria-hidden="true">
              Tú
            </span>
            <span>
              <b>{o.state === "you" ? "Falta tu firma" : "Se presenta"}</b>
              {o.state === "done" ? "Con tu apoderamiento. El justificante está en Documentos." : o.state === "you" ? "Con tu certificado digital, o lo presentamos con tu apoderamiento." : `Antes del ${shortDate(o.due)}, con tu apoderamiento`}
            </span>
          </li>
        </ol>

        {o.state === "done" ? <Seal className={s.dSeal} /> : null}

        <div className={s.dActions}>
          {o.state === "you" ? (
            <button type="button" className={s.primary} onClick={onClose}>
              <Icon name="pen" size={18} /> Firmar ahora
            </button>
          ) : null}
          <button type="button" className={s.ghost} onClick={onClose}>
            {o.state === "done" ? "Ver el justificante" : o.state === "scheduled" ? "Qué vamos a necesitar" : "Ver el borrador"}
          </button>
        </div>
        <p className={s.dNote}>Prototipo: los botones cierran la ficha.</p>
      </div>
    </div>
  );
}

