import type { CSSProperties } from "react";
import { BrandMark } from "@/components/brand/BrandLogo";
import { AGENTS, SERVICES, TEAM } from "@/content/data";
import { AdvisorPortrait, LawyerPortrait } from "./Portraits";
import s from "./Sections.module.css";

export function Team() {
  return (
    <section id="equipo" className="section" aria-labelledby="h-equipo" style={{ paddingTop: 24 }}>
      <div className="wrap">
        <h2 id="h-equipo">Despreocúpate de tenerlo todo bajo control</h2>
        <p className="lede">Personas de verdad con inteligencia operativa aumentada: los agentes proponen, las personas validan y aprueban. Nos anticipamos; Hacienda, no.</p>
        <div className={s.team}>
          <article className={s.member}>
            <figure className={s.portrait}>
              <LawyerPortrait label={`Ilustración de ${TEAM.abogada.name}, abogada fiscal`} />
            </figure>
            <h3>{TEAM.abogada.name}</h3>
            <p className={s.role}>{TEAM.abogada.role}</p>
            <p>Decide la estrategia y firma. Sus agentes le dejan los borradores preparados, con las fuentes citadas.</p>
            <span className="tag ok">Le preparan: borradores con fuentes</span>
          </article>
          <article className={s.member}>
            <figure className={s.portrait}>
              <AdvisorPortrait label={`Ilustración de ${TEAM.gestor.name}, gestor del grupo`} />
            </figure>
            <h3>{TEAM.gestor.name}</h3>
            <p className={s.role}>{TEAM.gestor.role}</p>
            <p>Lleva tu día a día. Sus agentes clasifican tus facturas y vigilan los plazos de todas tus sociedades.</p>
            <span className="tag ok">Le preparan: facturas y plazos</span>
          </article>
          <article className={s.member}>
            <figure className={`${s.portrait} ${s.agentmark}`}>
              <BrandMark size={64} title="Símbolo del asistente" />
            </figure>
            <h3>Tus agentes</h3>
            <p className={s.role}>Trabajan las 24 horas</p>
            <p>Cinco agentes especializados preparan el trabajo. Nunca presentan nada sin que una persona lo apruebe.</p>
            <span className="tag warn">Proponen; las personas aprueban</span>
          </article>
        </div>

        <div className={s.squadHead}>
          <h3>Los agentes que trabajan para ti</h3>
          <p>Cada uno propone en su especialidad; una persona valida y aprueba.</p>
        </div>
        <div className={s.squad}>
          {AGENTS.map((a) => (
            <article className={s.agent} key={a.name}>
              <span className={s.agAv} style={{ "--c": a.color } as CSSProperties} aria-hidden="true">
                {a.initial}
              </span>
              <h4>{a.name}</h4>
              <p className={s.agRole}>{a.role}</p>
              <p>{a.text}</p>
              <p className={s.agOk}>Valida: {a.validates}</p>
            </article>
          ))}
        </div>

        <div className={s.handle}>
          <h3>Nos encargamos de todo</h3>
          <div className="tags">
            {SERVICES.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
