"use client";

import { useEffect, useRef, useState } from "react";
import s from "./Sections.module.css";

const PII = [
  ["Nombre", "[PERSONA_1]", "Mariana Ortega García"],
  ["DNI", "[DNI_1]", "12345678Z"],
  ["IBAN", "[IBAN_1]", "ES91 2100 0418 4502 0005 1332"],
  ["Correo", "[CORREO_1]", "mariana@andinofoods.es"],
  ["Teléfono", "[TELÉFONO_1]", "612 345 678"],
] as const;

const STEPS = [
  { t: "Paso 1 de 4: el texto original, tal como llega.", doc: "Lo que llega", side: "Qué hay en el texto" },
  { t: "Paso 2 de 4: detectamos los datos personales.", doc: "Detección", side: "5 datos personales detectados" },
  { t: "Paso 3 de 4: los sustituimos por marcadores.", doc: "Lo que ve el modelo de IA", side: "Tabla de equivalencias, cifrada en la UE" },
  { t: "Paso 4 de 4: devolvemos los datos reales al documento final.", doc: "Documento final, validado por la abogada", side: "Quién ve qué" },
];

function Side({ n }: { n: number }) {
  if (n === 1)
    return (
      <ul className={s.piiList}>
        <li>Andino Foods SL es un dato de la empresa: no es un dato personal.</li>
        <li>El nombre de Mariana, su DNI, su cuenta, su correo y su teléfono sí lo son.</li>
      </ul>
    );
  if (n === 2)
    return (
      <ul className={s.piiList}>
        {PII.map((p) => (
          <li key={p[0]}>
            <span className="tag warn">{p[0]}</span>
            {p[2]}
          </li>
        ))}
        <li className="muted" style={{ fontSize: 14 }}>
          Reglas para los formatos (DNI, NIE, IBAN, teléfonos) y un modelo que reconoce nombres.
        </li>
      </ul>
    );
  if (n === 3)
    return (
      <ul className={s.piiList}>
        {PII.map((p) => (
          <li key={p[0]}>
            <span className={s.k}>{p[1]}</span>
            <span className="muted">dato real cifrado</span>
          </li>
        ))}
        <li className="muted" style={{ fontSize: 14 }}>
          El modelo nunca ve esta tabla.
        </li>
      </ul>
    );
  return (
    <ul className={s.piiList}>
      <li>
        <b>Modelo de IA:</b> solo marcadores.
      </li>
      <li>
        <b>Tú y la abogada:</b> los datos reales.
      </li>
      <li>
        <b>Registro:</b> cada acceso queda anotado.
      </li>
    </ul>
  );
}

const T = ({ i }: { i: number }) => (
  <span className={s.piiT}>
    <span className={s.piiOrig}>{PII[i][2]}</span>
    <span className={s.piiTok}>{PII[i][1]}</span>
  </span>
);

/** Seudonimización explicada en cuatro pasos; avanza sola la primera vez que se ve. */
export function PiiDemo() {
  const [n, setN] = useState(1);
  const box = useRef<HTMLDivElement>(null);
  const auto = useRef<number | null>(null);

  const stopAuto = () => {
    if (auto.current !== null) {
      window.clearInterval(auto.current);
      auto.current = null;
    }
  };

  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && auto.current === null) {
            auto.current = window.setInterval(() => {
              setN((cur) => {
                if (cur >= 4) {
                  stopAuto();
                  return cur;
                }
                return cur + 1;
              });
            }, 3500);
            io.disconnect();
          }
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stopAuto();
    };
  }, []);

  const st = STEPS[n - 1];

  return (
    <div className={s.pii} ref={box} data-step={n}>
      <div className={s.piiHead}>
        <div>
          <h3>Así protegemos tus datos personales</h3>
          <p className="muted" aria-live="polite">
            {st.t}
          </p>
        </div>
        <div className={s.piiTools}>
          <button
            type="button"
            className="btn"
            disabled={n === 1}
            onClick={() => {
              stopAuto();
              setN((c) => Math.max(1, c - 1));
            }}
          >
            Paso anterior
          </button>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => {
              stopAuto();
              setN((c) => (c === 4 ? 1 : c + 1));
            }}
          >
            {n === 4 ? "Repetir" : "Paso siguiente"}
          </button>
        </div>
      </div>
      <div className={s.piiSeg} aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={i <= n ? s.on : undefined} />
        ))}
      </div>
      <div className={s.piiBody}>
        <div className={s.piiDoc}>
          <p className={s.piiLabel}>{st.doc}</p>
          <p className={s.piiText}>
            <T i={0} />, con DNI <T i={1} />, solicita la ayuda para Andino Foods SL. Cuenta: <T i={2} />. Contacto: <T i={3} />, <T i={4} />.
          </p>
        </div>
        <div className={s.piiSide}>
          <p className={s.piiLabel}>{st.side}</p>
          <div key={n}>
            <Side n={n} />
          </div>
        </div>
      </div>
      <p className={s.piiNote}>
        Técnicamente es seudonimización: el dato real nunca llega al modelo de IA, pero podemos devolverlo a tu documento final. Por eso la tabla de equivalencias va cifrada y separada, en servidores de la UE.
      </p>
    </div>
  );
}
