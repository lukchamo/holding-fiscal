"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import s from "./Scrolly.module.css";

export interface ScrollyStep {
  title: string;
  text: string;
}

const StepCtx = createContext(1);
export const useScrollyStep = () => useContext(StepCtx);

/**
 * Scrollytelling por pasos: el escenario queda fijo mientras los pasos
 * pasan por el centro de la pantalla. En móvil, los pasos se leen en el pie
 * del escenario y el texto original queda disponible para lectores de pantalla.
 */
export function Scrolly({ steps, children }: { steps: ScrollyStep[]; children: ReactNode }) {
  const [step, setStep] = useState(1);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const n = steps.length;

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 820px)");
    let io: IntersectionObserver | null = null;
    const observe = () => {
      io?.disconnect();
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) setStep(Number((en.target as HTMLElement).dataset.i));
          });
        },
        { rootMargin: wide.matches ? "-48% 0px -48% 0px" : "-55% 0px -40% 0px", threshold: 0 },
      );
      refs.current.forEach((el) => el && io!.observe(el));
    };
    observe();
    wide.addEventListener("change", observe);
    return () => {
      io?.disconnect();
      wide.removeEventListener("change", observe);
    };
  }, []);

  const cur = steps[step - 1];

  return (
    <StepCtx.Provider value={step}>
      <div className={s.scrolly}>
        <div className={s.stage} aria-hidden="true">
          {children}
          <div className={s.stageCap}>
            <p className={s.stK}>
              Paso {step} de {n}
            </p>
            <h3>{cur.title}</h3>
            <p className={s.capP}>{cur.text}</p>
          </div>
          <div className={s.dots}>
            {steps.map((_, i) => (
              <span key={i} className={i + 1 <= step ? s.dotOn : undefined} />
            ))}
          </div>
        </div>
        <div className={s.stepsCol}>
          {steps.map((st, i) => (
            <div
              key={st.title}
              className={`${s.st} ${step === i + 1 ? s.active : ""}`}
              data-i={i + 1}
              ref={(el) => {
                refs.current[i] = el;
              }}
            >
              <div className={s.stInner}>
                <p className={s.stK}>
                  Paso {i + 1} de {n}
                </p>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StepCtx.Provider>
  );
}

/** Pila de hojas: la del paso actual delante, las anteriores detrás. */
export function SheetStack({ children }: { children: ReactNode }) {
  return <div className={s.stack}>{children}</div>;
}

export function Sheet({ k, children }: { k: number; children: ReactNode }) {
  const step = useScrollyStep();
  const pos = k < step ? "behind" : k === step ? "front" : "next";
  return (
    <div className={s.sheet} data-pos={pos} style={{ "--d": Math.max(0, step - k), zIndex: k } as CSSProperties}>
      {children}
    </div>
  );
}

/** Diagrama de la holding: se dibuja a medida que avanzan los pasos. */
export function HoldingTree() {
  const step = useScrollyStep();
  const cls = [s.tree, step >= 1 ? s.s1 : "", step >= 2 ? s.s2 : "", step >= 3 ? s.s3 : "", step >= 4 ? s.s4 : ""].join(" ");
  return (
    <div className={cls}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <line className={s.lOld} x1="50" y1="12" x2="25" y2="78" />
        <line className={s.lOld} x1="50" y1="12" x2="75" y2="78" />
        <line className={s.lNew} x1="50" y1="12" x2="50" y2="46" />
        <line className={s.lNew} x1="50" y1="46" x2="25" y2="78" />
        <line className={s.lNew} x1="50" y1="46" x2="75" y2="78" />
      </svg>
      <div className={`${s.node} ${s.person}`}>Mariana Ortega</div>
      <div className={`${s.node} ${s.hold}`}>Andino Holding SL</div>
      <div className={s.subs}>
        <span className="tag">Medios propios</span>
        <span className="tag">Decisiones reales</span>
      </div>
      <div className={`${s.node} ${s.foods}`}>Andino Foods SL</div>
      <div className={`${s.node} ${s.inm}`}>Andino Inmuebles SL</div>
      <div className={s.tseal}>V.º B.º</div>
      <p className={s.tcap}>Escritura coordinada con la notaría</p>
    </div>
  );
}
