"use client";

import { useState, type CSSProperties } from "react";
import { AGENTS } from "@/content/data";
import { CASES, PEOPLE, personFor, type Person } from "./teamModel";
import { AgentAvatar, PersonPortrait, Seal, ServicesStrip, TeamHeader } from "./TeamParts";
import s from "./flow.module.css";

/** Centro (en % del ancho) de la columna i de los agentes. */
const agentX = (i: number) => ((i + 0.5) * 100) / AGENTS.length;

/** Columnas que ocupa cada persona: justo debajo de sus agentes (las del gestor primero). */
const LANES = PEOPLE.map((p) => {
  const idx = AGENTS.flatMap((a, i) => (a.validates === p.validates ? [i] : []));
  const from = Math.min(...idx);
  const to = Math.max(...idx);
  return { person: p, span: `${from + 1} / ${to + 2}`, x: (agentX(from) + agentX(to)) / 2 };
}).sort((a, b) => a.x - b.x);

const laneOf = (p: Person) => LANES.find((l) => l.person.key === p.key) ?? LANES[0];

/** Curva de (x1, 0) a (x2, h) en el sistema 0..100 del ancho. */
const wire = (x1: number, x2: number, h: number) => `M${x1} 0 C ${x1} ${h / 2}, ${x2} ${h / 2}, ${x2} ${h}`;

/**
 * Alternativa B · «El circuito». El recorrido entero en tres niveles: los
 * agentes proponen, las personas validan y firman, tú decides. Al tocar o
 * pasar por un agente, su camino se ilumina hasta ti y su persona estampa el V.º B.º.
 */
export function TeamFlow({ id = "equipo" }: { id?: string }) {
  const [active, setActive] = useState<string>("Nora");
  const agent = AGENTS.find((a) => a.name === active) ?? AGENTS[0];
  const person = personFor(agent);
  const example = CASES[agent.name];

  return (
    <section id={id} className="section" aria-labelledby={`h-${id}`}>
      <div className="wrap">
        <TeamHeader headingId={`h-${id}`} />

        <div className={s.flow} style={{ "--c": agent.color } as CSSProperties}>
          <p className={s.tier}>
            <b>1</b> Proponen
          </p>
          <ul className={s.agents}>
            {AGENTS.map((a) => (
              <li key={a.name}>
                <button
                  type="button"
                  className={s.node}
                  style={{ "--c": a.color } as CSSProperties}
                  aria-pressed={a.name === active}
                  onClick={() => setActive(a.name)}
                  onMouseEnter={() => setActive(a.name)}
                  onFocus={() => setActive(a.name)}
                >
                  <AgentAvatar agent={a} size={44} />
                  <b>{a.name}</b>
                  <small>{a.role}</small>
                </button>
              </li>
            ))}
          </ul>

          <svg className={s.wires} viewBox="0 0 100 64" preserveAspectRatio="none" aria-hidden="true">
            {AGENTS.map((a, i) => (
              <path key={a.name} d={wire(agentX(i), laneOf(personFor(a)).x, 64)} data-on={a.name === active} />
            ))}
          </svg>
          <span className={s.down} aria-hidden="true" />

          <p className={s.tier}>
            <b>2</b> Validan y firman
          </p>
          <div className={s.people}>
            {LANES.map(({ person: p, span }) => {
              const on = p.key === person.key;
              return (
                <article key={p.key} className={s.person} style={{ "--span": span } as CSSProperties} data-on={on} aria-labelledby={`${id}-${p.key}`}>
                  <span className={s.portrait}>
                    <PersonPortrait k={p.key} />
                  </span>
                  <div>
                    <h3 id={`${id}-${p.key}`}>{p.role}</h3>
                    <p>{p.name}</p>
                  </div>
                  {on ? <Seal key={agent.name} className={s.personSeal} /> : null}
                </article>
              );
            })}
          </div>

          <svg className={`${s.wires} ${s.wiresShort}`} viewBox="0 0 100 52" preserveAspectRatio="none" aria-hidden="true">
            {LANES.map(({ person: p, x }) => (
              <path key={p.key} d={wire(x, 50, 52)} data-on={p.key === person.key} />
            ))}
          </svg>
          <span className={s.down} aria-hidden="true" />

          <p className={s.tier}>
            <b>3</b> Tú decides
          </p>
          <div className={s.you}>
            <span className={s.youDot} aria-hidden="true">
              Tú
            </span>
            <p>Te llega revisado. Lo firmas tú, con tu certificado digital o mediante apoderamiento.</p>
          </div>
        </div>

        <div className={s.detail} style={{ "--c": agent.color } as CSSProperties} aria-live="polite">
          <AgentAvatar agent={agent} size={56} />
          <div key={agent.name} className={s.detailBody}>
            <p className={s.detailHead}>
              <strong>{agent.name}</strong>
              <span>{agent.role}</span>
            </p>
            <p>{agent.text}</p>
            <p className={s.example}>
              <b>Ejemplo</b> {example.arrives} <span aria-hidden="true">→</span> {example.result}
            </p>
          </div>
          <p className={s.who}>
            <span className={s.mini} aria-hidden="true">
              <PersonPortrait k={person.key} />
            </span>
            Lo valida {person.short}
          </p>
        </div>

        <ServicesStrip />
      </div>
    </section>
  );
}
