import type { CSSProperties } from "react";
import { SERVICES } from "@/content/data";
import { AdvisorPortrait, LawyerPortrait } from "../Portraits";
import type { PersonKey, TeamAgent } from "./teamModel";
import t from "./team.module.css";

/** Cabecera común: el mismo texto en las tres alternativas, para comparar solo el diseño. */
export function TeamHeader({ headingId }: { headingId: string }) {
  return (
    <header className={t.head}>
      <p className={t.eyebrow}>Tu equipo</p>
      <h2 id={headingId}>Tú, despreocúpate. Lo tenemos todo bajo control.</h2>
      <p className="lede">Dos personas de verdad deciden y firman. Cinco agentes de IA les preparan el trabajo, día y noche. Nos anticipamos; Hacienda, no.</p>
    </header>
  );
}

export function PersonPortrait({ k, label }: { k: PersonKey; label?: string }) {
  return k === "abogada" ? <LawyerPortrait label={label ?? "Ilustración de tu abogada fiscal"} /> : <AdvisorPortrait label={label ?? "Ilustración de tu gestor"} />;
}

/** Avatar del agente: su inicial en un aro de su color. */
export function AgentAvatar({ agent, size = 40, className = "" }: { agent: TeamAgent; size?: number; className?: string }) {
  return (
    <span className={`${t.av} ${className}`} style={{ "--c": agent.color, "--size": `${size}px` } as CSSProperties} aria-hidden="true">
      {agent.initial}
    </span>
  );
}

/** Sello V.º B.º (decorativo: el texto de al lado ya dice quién firma). */
export function Seal({ className = "" }: { className?: string }) {
  return (
    <span className={`${t.seal} ${className}`} aria-hidden="true">
      V.º&nbsp;B.º
    </span>
  );
}

export function ServicesStrip() {
  return (
    <div className={t.services}>
      <h3>Nos encargamos de todo</h3>
      <ul className="tags">
        {SERVICES.map((item) => (
          <li className="tag" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
