import type { CSSProperties } from "react";
import { ProblemChips } from "./ProblemChips";
import s from "./HeroProblem.module.css";

/**
 * El problema, con la corrección de la abogada al lado: se tacha y se anota,
 * como en un borrador revisado. El orden de la animación cuenta la historia:
 * aparece el problema, se tacha, se corrige y se firma (V.º B.º).
 */
const LINES = [
  { problem: "Tres sociedades.", fix: "bajo una holding" },
  { problem: "Dos gestorías.", fix: "un solo equipo" },
  { problem: "Ningún plan.", fix: "un plan en 3 semanas" },
];

/** Trazo a mano para tachar: ligeramente irregular, como hecho con pluma. */
const STRIKE = "M1 7.4 C 14 5.6, 27 8.2, 41 6.6 S 70 5.2, 84 6.9 S 96 7.6, 99 6.2";

/** Portada 4 «El problema, tachado»: minimalista y empieza por el problema. */
export function HeroProblem() {
  return (
    <section id="inicio" className={s.hero} aria-labelledby="h-hero">
      <div className={`wrap ${s.inner}`}>
        <p className={s.eyebrow}>
          <span className={s.dot} aria-hidden="true" />
          Para quien dirige más de una sociedad
        </p>

        <h1 id="h-hero" className={s.title}>
          {LINES.map((l, i) => (
            <span key={l.problem} className={s.line} style={{ "--i": i } as CSSProperties}>
              <span className={s.problem}>
                {l.problem}
                <svg className={s.strike} viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
                  <path pathLength={1} d={STRIKE} />
                </svg>
              </span>{" "}
              <span className={s.fix} aria-hidden="true">
                {l.fix}
              </span>
            </span>
          ))}
          <span className={s.seal} aria-hidden="true">
            V.º B.º
          </span>
        </h1>

        <p className={s.solution}>
          Lo ordenamos por ti: tus sociedades bajo una holding, un solo equipo para todo el grupo y un plan en tres semanas. Los agentes se anticipan a Hacienda; tu abogada revisa y firma.
        </p>

        <ProblemChips />

        <p className={s.trust}>RGPD · Datos en la UE · Una persona firma cada paso</p>
      </div>
    </section>
  );
}
