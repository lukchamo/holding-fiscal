"use client";

import { useStart } from "@/components/start/StartProvider";
import s from "./HeroProblem.module.css";

/**
 * Se empieza por el problema: cada opción abre la entrevista con Alma con esa
 * respuesta ya dada («¿Qué te quita el sueño?»), en el mismo orden que el guion.
 */
const CASES = ["Me ha escrito Hacienda", "Quiero montar una holding", "Busco ayudas", "Mis facturas son un caos"];

export function ProblemChips() {
  const { goInterview, goMode } = useStart();
  return (
    <div className={s.start}>
      <p className={s.q} id="q-caso">
        ¿Por dónde empezamos?
      </p>
      <div className="chips" role="group" aria-labelledby="q-caso">
        {CASES.map((c, i) => (
          <button key={c} type="button" className={`chip ${s.case}`} onClick={() => goInterview({ worry: i })}>
            {c}
          </button>
        ))}
      </div>
      <p className={s.alt}>
        O, si lo prefieres,{" "}
        <a
          href="#empezar"
          onClick={(e) => {
            e.preventDefault();
            goMode("cafe");
          }}
        >
          tómate un café con nosotros en Valencia
        </a>
        .
      </p>
    </div>
  );
}
