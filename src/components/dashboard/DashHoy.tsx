"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AgentAvatar, PersonPortrait, Seal } from "@/components/sections/team/TeamParts";
import { TEAM } from "@/content/data";
import { ACTIVITY, AGENT_LOAD, ALMA_QA, agentOf, companyOf, COMPANIES, DECISIONS, dayOf, dueLabel, daysFrom, FILINGS, GROUP, monthShort, reviewerOf, shortDate, STATE_LABEL, TODAY_LABEL, UPCOMING, USER, type CompanyKey, type Decision } from "./dashData";
import { Icon } from "./Icons";
import s from "./hoy.module.css";

type Phase = "idle" | "signing" | "done";

/** Presentaciones de 2026 de todo el grupo: en plazo / total. */
const FILED = Object.values(FILINGS).reduce<[number, number]>((acc, [a, b]) => [acc[0] + a, acc[1] + b], [0, 0]);

/**
 * Alternativa A · «Hoy». Empieza por lo que solo tú puedes hacer (firmar o
 * aprobar lo que ya han preparado los agentes y revisado una persona) y deja el
 * resto como contexto: lo que ha hecho el equipo, los próximos plazos y Alma.
 */
export function DashHoy() {
  const [signed, setSigned] = useState<string[]>([]);
  const [phase, setPhase] = useState<Record<string, Phase>>({});
  const [announce, setAnnounce] = useState("");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const pending = DECISIONS.filter((d) => !signed.includes(d.id));
  const done = DECISIONS.filter((d) => signed.includes(d.id));

  const sign = (d: Decision) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, reduce ? 0 : ms));
    setPhase((p) => ({ ...p, [d.id]: "signing" }));
    later(() => {
      setPhase((p) => ({ ...p, [d.id]: "done" }));
      setAnnounce(`${d.action === "Aprobar" ? "Aprobado" : "Firmado"}: ${d.title.replace(/^(Firma|Aprueba) /, "")}.`);
    }, 700);
    later(() => setSigned((xs) => [...xs, d.id]), 1900);
  };

  const undo = (d: Decision) => {
    setSigned((xs) => xs.filter((x) => x !== d.id));
    setPhase((p) => ({ ...p, [d.id]: "idle" }));
    setAnnounce(`Deshecho. «${d.title}» vuelve a tus pendientes.`);
  };

  return (
    <div className={s.page}>
      <header className={s.hello}>
        <p className={s.date}>
          {TODAY_LABEL} · {GROUP}
        </p>
        <h1>Buenos días, {USER.first}.</h1>
        <p className={s.summary}>
          {pending.length ? (
            <>
              Hay <b>{pending.length === 1 ? "una cosa" : `${pending.length} cosas`}</b> que solo puedes hacer tú. Lo demás lo llevamos nosotros.
            </>
          ) : (
            <>No tienes nada pendiente. Tu equipo sigue con lo demás.</>
          )}
        </p>
        <ul className={s.stats}>
          <li>
            <b>{AGENT_LOAD.reduce((n, a) => n + a.doneWeek, 0)}</b> tareas hechas por tu equipo esta semana
          </li>
          <li>
            <b>
              {FILED[0]} de {FILED[1]}
            </b>{" "}
            plazos de 2026 presentados a tiempo
          </li>
          <li>
            Próximo plazo: <b>{shortDate(UPCOMING.find((o) => daysFrom(o.due) >= 0)?.due ?? UPCOMING[0].due)}</b>
          </li>
        </ul>
      </header>

      <div className={s.cols}>
        <div className={s.mainCol}>
          <section aria-labelledby="h-necesita" className={s.block}>
            <div className={s.secHead}>
              <h2 id="h-necesita">Te necesitamos</h2>
              <span className={s.count} aria-label={`${pending.length} pendientes`}>
                {pending.length}
              </span>
            </div>

            {pending.length ? (
              <ul className={s.decisions}>
                {pending.map((d) => (
                  <DecisionCard key={d.id} d={d} phase={phase[d.id] ?? "idle"} onSign={() => sign(d)} />
                ))}
              </ul>
            ) : (
              <div className={s.empty}>
                <Seal className={s.emptySeal} />
                <p>
                  <b>Todo firmado.</b> {TEAM.abogada.first} y {TEAM.gestor.first} se encargan del resto; te avisamos si hace falta algo.
                </p>
              </div>
            )}

            {done.length ? (
              <div className={s.doneBox}>
                <p className={s.doneTitle}>Hecho hoy</p>
                <ul>
                  {done.map((d) => (
                    <li key={d.id}>
                      <span className={s.doneCheck} aria-hidden="true">
                        <Icon name="check" size={16} />
                      </span>
                      <span className={s.doneText}>
                        {d.action === "Aprobar" ? "Aprobaste" : "Firmaste"} «{d.title.replace(/^(Firma|Aprueba) (la |el )?/, "")}»
                      </span>
                      <button type="button" className={s.linkBtn} onClick={() => undo(d)}>
                        Deshacer
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <p className="visually-hidden" aria-live="polite">
              {announce}
            </p>
          </section>

          <Feed />
        </div>

        <aside className={s.rail} aria-label="Contexto">
          <Deadlines />
          <Team />
          <Alma />
        </aside>
      </div>
    </div>
  );
}

function DecisionCard({ d, phase, onSign }: { d: Decision; phase: Phase; onSign: () => void }) {
  const [open, setOpen] = useState(false);
  const c = companyOf(d.company);
  const agent = agentOf(d.agent);
  const person = reviewerOf(d.reviewer);
  const soon = daysFrom(d.due) <= 10;
  const verb = d.action === "Aprobar" ? "Aprobado" : "Firmado";

  return (
    <li className={s.decision} data-phase={phase}>
      <div className={s.dTop}>
        <span className={s.company}>
          <i style={{ background: c.color }} aria-hidden="true" />
          {c.name}
        </span>
        <span className={s.due} data-soon={soon}>
          <Icon name="clock" size={16} />
          {dueLabel(d.due)} · {shortDate(d.due)}
        </span>
      </div>
      <h3>{d.title}</h3>
      <p className={s.dText}>{d.text}</p>

      <ol className={s.chain} aria-label="Quién ha intervenido">
        <li>
          <AgentAvatar agent={agent} size={26} />
          <span>
            Preparado por <b>{agent.name}</b>
          </span>
        </li>
        <li>
          <span className={s.mini} aria-hidden="true">
            <PersonPortrait k={d.reviewer} />
          </span>
          <span>
            Revisado por <b>{person.first}</b>
          </span>
          <Icon name="check" size={16} className={s.ok} />
        </li>
        <li className={s.you}>
          <span className={s.youDot} aria-hidden="true" />
          <span>
            Falta tu <b>{d.action === "Aprobar" ? "aprobación" : "firma"}</b>
          </span>
        </li>
      </ol>

      {open ? (
        <ul className={s.preview} id={`prev-${d.id}`}>
          {d.preview.map((line) => (
            <li key={line}>
              <Icon name="doc" size={16} />
              {line}
            </li>
          ))}
        </ul>
      ) : null}

      <div className={s.actions}>
        <button type="button" className={s.ghostBtn} aria-expanded={open} aria-controls={`prev-${d.id}`} onClick={() => setOpen((o) => !o)}>
          {open ? "Ocultar" : d.secondary}
        </button>
        <button type="button" className={s.primaryBtn} onClick={onSign} disabled={phase !== "idle"}>
          <Icon name={d.action === "Aprobar" ? "check" : "pen"} size={18} />
          {phase === "signing" ? (d.action === "Aprobar" ? "Aprobando…" : "Firmando…") : d.action}
        </button>
      </div>

      {phase === "done" ? (
        <div className={s.doneLayer} aria-hidden="true">
          <Seal className={s.doneSeal} />
          <b>{verb} por ti</b>
          <span>Se lo decimos a {person.first} y lo presentamos hoy.</span>
        </div>
      ) : null}
    </li>
  );
}

function Feed() {
  const [scope, setScope] = useState<"all" | CompanyKey>("all");
  const items = ACTIVITY.filter((a) => scope === "all" || a.company === scope);
  const days = ["Hoy", "Ayer"] as const;
  return (
    <section aria-labelledby="h-hecho" className={s.block}>
      <div className={s.secHead}>
        <h2 id="h-hecho">Lo que ha hecho tu equipo</h2>
      </div>
      <div className={s.filters} role="group" aria-label="Filtrar por sociedad">
        <button type="button" aria-pressed={scope === "all"} onClick={() => setScope("all")}>
          Todo
        </button>
        {COMPANIES.map((c) => (
          <button key={c.key} type="button" aria-pressed={scope === c.key} onClick={() => setScope(c.key)}>
            <i style={{ background: c.color }} aria-hidden="true" />
            {c.short}
          </button>
        ))}
      </div>
      {days.map((day) => {
        const list = items.filter((a) => a.day === day);
        if (!list.length) return null;
        return (
          <div key={day} className={s.day}>
            <p className={s.dayTitle}>{day}</p>
            <ol className={s.feed}>
              {list.map((a) => {
                const agent = agentOf(a.agent);
                const c = a.company ? companyOf(a.company) : null;
                return (
                  <li key={a.id}>
                    <span className={s.time}>{a.time}</span>
                    <AgentAvatar agent={agent} size={34} />
                    <div className={s.feedBody}>
                      <p>
                        <b>{agent.name}</b> {a.text}
                      </p>
                      <p className={s.feedMeta}>
                        {c ? (
                          <span className={s.company}>
                            <i style={{ background: c.color }} aria-hidden="true" />
                            {c.short}
                          </span>
                        ) : null}
                        {a.review ? (
                          <span className={s.review} data-done={a.review.done}>
                            <Icon name={a.review.done ? "check" : "clock"} size={15} />
                            {a.review.done ? `Revisado por ${reviewerOf(a.review.by).first}` : `${reviewerOf(a.review.by).first}: ${a.review.note}`}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
      {!items.length ? <p className={s.none}>Sin actividad de esta sociedad en los dos últimos días.</p> : null}
    </section>
  );
}

function Deadlines() {
  const next = UPCOMING.filter((o) => daysFrom(o.due) >= 0).slice(0, 5);
  return (
    <section className={s.card} aria-labelledby="h-plazos">
      <h2 id="h-plazos" className={s.cardTitle}>
        Próximos plazos
      </h2>
      <ul className={s.deadlines}>
        {next.map((o) => {
          const c = companyOf(o.company);
          return (
            <li key={o.id}>
              <span className={s.dateBlock} data-you={o.state === "you"}>
                <b>{dayOf(o.due)}</b>
                {monthShort(o.due)}
              </span>
              <span className={s.dlText}>
                <b>{o.title}</b>
                <span>
                  <i style={{ background: c.color }} aria-hidden="true" />
                  {c.short} · {STATE_LABEL[o.state]}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Team() {
  return (
    <section className={s.card} aria-labelledby="h-tu-equipo">
      <h2 id="h-tu-equipo" className={s.cardTitle}>
        Tu equipo
      </h2>
      <ul className={s.people}>
        {(["abogada", "gestor"] as const).map((k) => (
          <li key={k}>
            <span className={s.face} aria-hidden="true">
              <PersonPortrait k={k} />
            </span>
            <span>
              <b>{TEAM[k].name}</b>
              <small>{TEAM[k].role}</small>
              <small className={s.status} data-on={k === "abogada"}>
                {k === "abogada" ? "Disponible ahora" : "En una reunión hasta las 11:00"}
              </small>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Alma() {
  const [asked, setAsked] = useState<number | null>(null);
  const [typing, setTyping] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const alma = agentOf("Alma");

  const ask = (i: number) => {
    setAsked(i);
    setTyping(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTyping(false), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900);
  };

  return (
    <section className={`${s.card} ${s.alma}`} aria-labelledby="h-alma" style={{ "--c": alma.color } as CSSProperties}>
      <h2 id="h-alma" className={s.cardTitle}>
        <Icon name="sparkle" size={18} /> Pregúntale a Alma
      </h2>
      <div className={s.chips}>
        {ALMA_QA.map((qa, i) => (
          <button key={qa.q} type="button" aria-pressed={asked === i} onClick={() => ask(i)}>
            {qa.q}
          </button>
        ))}
      </div>
      <div className={s.answer} aria-live="polite">
        {asked !== null ? (
          <>
            <AgentAvatar agent={alma} size={28} />
            <p>{typing ? <span className={s.typing} aria-label="Alma está escribiendo" /> : ALMA_QA[asked].a}</p>
          </>
        ) : (
          <p className={s.hint}>Elige una pregunta o escríbele por el chat: te responde al momento y, si hace falta, avisa a {TEAM.abogada.first} o a {TEAM.gestor.first}.</p>
        )}
      </div>
    </section>
  );
}
