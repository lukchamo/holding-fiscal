import { agentsFor, PEOPLE } from "./teamModel";
import { AgentAvatar, PersonPortrait, Seal, ServicesStrip, TeamHeader } from "./TeamParts";
import s from "./byPerson.module.css";

/**
 * Alternativa A · «Quién firma qué». Una sola sección agrupada por la persona
 * que valida: cada mesa lleva a su persona arriba, los agentes que le preparan
 * el trabajo colgando de un mismo trazo y, al pie, su regla con el V.º B.º.
 * Sin JavaScript: la entrada se anima con el scroll donde el navegador lo admite.
 */
export function TeamByPerson({ id = "equipo" }: { id?: string }) {
  return (
    <section id={id} className="section" aria-labelledby={`h-${id}`}>
      <div className="wrap">
        <TeamHeader headingId={`h-${id}`} />
        <div className={s.desks}>
          {PEOPLE.map((p) => (
            <article key={p.key} className={s.desk} aria-labelledby={`${id}-${p.key}`}>
              <header className={s.person}>
                <span className={s.portrait}>
                  <PersonPortrait k={p.key} />
                </span>
                <div>
                  <h3 id={`${id}-${p.key}`}>{p.role}</h3>
                  <p className={s.name}>{p.name}</p>
                </div>
              </header>
              <p className={s.does}>{p.does}</p>

              <p className={s.label}>Le preparan el trabajo</p>
              <div className={s.agentsWrap}>
                <ul className={s.agents}>
                  {agentsFor(p).map((a, i, list) => (
                    <li key={a.name} className={s.agent}>
                      {i < list.length - 1 ? <span className={s.link} aria-hidden="true" /> : null}
                      <AgentAvatar agent={a} />
                      <div>
                        <p className={s.agName}>
                          <strong>{a.name}</strong>
                          <span>{a.role}</span>
                        </p>
                        <p className={s.agText}>{a.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <footer className={s.foot}>
                <Seal className={s.footSeal} />
                <p>{p.rule}</p>
              </footer>
            </article>
          ))}
        </div>
        <ServicesStrip />
      </div>
    </section>
  );
}
