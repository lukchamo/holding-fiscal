"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AGENTS } from "@/content/data";
import { CASES, PEOPLE, personFor } from "./teamModel";
import { AgentAvatar, PersonPortrait, Seal, ServicesStrip, TeamHeader } from "./TeamParts";
import s from "./cases.module.css";

/**
 * Alternativa C · «Un caso por agente». A la izquierda, quién firma y quién
 * prepara; a la derecha, un caso real del agente elegido contado en cuatro
 * pasos: qué llega, qué prepara, quién lo firma y el resultado. Los pasos se
 * encadenan al entrar en pantalla y al cambiar de agente.
 */
export function TeamCases({ id = "equipo" }: { id?: string }) {
  const [index, setIndex] = useState(2);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const agent = AGENTS[index];
  const person = personFor(agent);
  const c = CASES[agent.name];

  // Los pasos esperan ocultos (solo con JavaScript) y se encadenan al entrar en pantalla.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.armed = "true";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.play = "true";
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = AGENTS.length - 1;
    const next = ["ArrowDown", "ArrowRight"].includes(e.key) ? (i === last ? 0 : i + 1) : ["ArrowUp", "ArrowLeft"].includes(e.key) ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    setIndex(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id={id} className="section" aria-labelledby={`h-${id}`}>
      <div className="wrap">
        <TeamHeader headingId={`h-${id}`} />

        <div ref={root} className={s.body}>
          <div className={s.roster}>
            <p className={`${s.kicker} ${s.peopleKicker}`}>Firman</p>
            <ul className={s.people}>
              {PEOPLE.map((p) => (
                <li key={p.key}>
                  <span className={s.portrait} aria-hidden="true">
                    <PersonPortrait k={p.key} />
                  </span>
                  <span>
                    <b>{p.name}</b>
                    <span>{p.role}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className={s.kicker} id={`${id}-agentes`}>
              Preparan
            </p>
            <div className={s.tabs} role="tablist" aria-labelledby={`${id}-agentes`}>
              {AGENTS.map((a, i) => {
                const on = i === index;
                return (
                  <button
                    key={a.name}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${id}-tab-${a.initial}`}
                    aria-selected={on}
                    aria-controls={`${id}-caso`}
                    tabIndex={on ? 0 : -1}
                    className={s.tab}
                    style={{ "--c": a.color } as CSSProperties}
                    onClick={() => setIndex(i)}
                    onKeyDown={(e) => onKey(e, i)}
                  >
                    <AgentAvatar agent={a} size={42} />
                    <span className={s.tabText}>
                      <b>{a.name}</b>
                      <small>{a.role}</small>
                    </span>
                    <span className={s.tabArrow} aria-hidden="true">
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div id={`${id}-caso`} role="tabpanel" aria-labelledby={`${id}-tab-${agent.initial}`} className={s.panel}>
            <article key={agent.name} className={s.case} style={{ "--c": agent.color } as CSSProperties}>
              <p className={s.caseKicker}>
                <i aria-hidden="true" /> Un caso de {agent.name} · {agent.role}
              </p>
              <h3>{c.title}</h3>

              <div className={s.timeline}>
                <span className={s.rail} aria-hidden="true" />
                <ol className={s.steps}>
                  <li className={s.step} data-k="in">
                    <span className={s.node} aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M4 6h16v12H4z M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <b>Llega</b>
                      <p>{c.arrives}</p>
                    </div>
                  </li>
                  <li className={s.step} data-k="work">
                    <AgentAvatar agent={agent} size={44} />
                    <div>
                      <b>Prepara</b>
                      <p>{c.work}</p>
                    </div>
                  </li>
                  <li className={s.step} data-k="check">
                    <span className={`${s.node} ${s.nodePortrait}`} aria-hidden="true">
                      <PersonPortrait k={person.key} />
                    </span>
                    <div>
                      <b>Valida</b>
                      <p>{c.check}</p>
                    </div>
                    <Seal className={s.stepSeal} />
                  </li>
                  <li className={s.step} data-k="done">
                    <span className={s.node} aria-hidden="true">
                      ✓
                    </span>
                    <div>
                      <b>Resultado</b>
                      <p>{c.result}</p>
                    </div>
                  </li>
                </ol>
              </div>
              <p className={s.note}>Caso ilustrativo con datos de ejemplo.</p>
            </article>
          </div>
        </div>

        <ServicesStrip />
      </div>
    </section>
  );
}
