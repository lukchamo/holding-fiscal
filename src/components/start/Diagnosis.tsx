"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import { buildSteps, Skeleton, type StepDef } from "./diagnosisData";
import { prefersReducedMotion, useStart } from "./StartProvider";
import s from "./Start.module.css";

class Cancel extends Error {}

interface RunLog {
  verb?: string;
  what: string;
  res: string | null;
  note?: boolean;
}

interface RunStep {
  state: "pending" | "running" | "done";
  logs: RunLog[];
  body: boolean;
  result: boolean;
  resOn: boolean;
}

interface RunState {
  defs: StepDef[];
  steps: RunStep[];
}

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

/**
 * Motor del diagnóstico en directo: los agentes exploran fuente a fuente y,
 * al terminar cada paso, aparece lo que encontraron. Cancelable en cualquier
 * momento (nueva entrevista) y acelerable («Mostrar todo ya»).
 */
export function useDiagnosis() {
  const [run, setRun] = useState<RunState | null>(null);
  const [skipVisible, setSkipVisible] = useState(false);
  const runId = useRef(0);
  const instant = useRef(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const patch = useCallback((i: number, fn: (st: RunStep) => RunStep) => {
    setRun((r) => (r ? { ...r, steps: r.steps.map((st, k) => (k === i ? fn(st) : st)) } : r));
  }, []);

  const start = useCallback(
    async (desc: string, soc?: number, cert?: number) => {
      const id = ++runId.current;
      instant.current = false;
      const wait = (ms: number) =>
        new Promise<void>((resolve) => setTimeout(resolve, instant.current ? 0 : ms)).then(() => {
          if (id !== runId.current) throw new Cancel();
        });
      const smooth: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
      const defs = buildSteps(desc, soc, cert);

      setRun({ defs, steps: defs.map(() => ({ state: "pending", logs: [], body: false, result: false, resOn: false })) });
      setSkipVisible(true);
      await nextFrame();
      wrapRef.current?.scrollIntoView({ behavior: smooth, block: "start" });

      try {
        await wait(prefersReducedMotion() ? 0 : 700);
        for (let i = 0; i < defs.length; i++) {
          const def = defs[i];
          patch(i, (st) => ({ ...st, state: "running", body: true }));
          if (!instant.current) {
            await nextFrame();
            itemRefs.current[i]?.scrollIntoView({ behavior: smooth, block: "nearest" });
          }
          for (const lg of def.logs) {
            if (lg.note) {
              patch(i, (st) => ({ ...st, logs: [...st.logs, { what: lg.what, res: null, note: true }] }));
              await wait(lg.ms);
              continue;
            }
            patch(i, (st) => ({ ...st, logs: [...st.logs, { verb: lg.verb, what: lg.what, res: null }] }));
            await wait(lg.ms);
            patch(i, (st) => ({ ...st, logs: st.logs.map((l, k) => (k === st.logs.length - 1 ? { ...l, res: lg.res ?? "" } : l)) }));
            await wait(300);
          }
          await wait(600);
          patch(i, (st) => ({ ...st, result: true, state: "done" }));
          await nextFrame();
          patch(i, (st) => ({ ...st, resOn: true }));
          await wait(900);
        }
        setSkipVisible(false);
      } catch (e) {
        if (!(e instanceof Cancel)) throw e;
      }
    },
    [patch],
  );

  const cancel = useCallback(() => {
    runId.current++;
    setRun(null);
    setSkipVisible(false);
  }, []);

  const skip = useCallback(() => {
    instant.current = true;
    setSkipVisible(false);
  }, []);

  return { run, skipVisible, start, cancel, skip, wrapRef, itemRefs };
}

type Runner = ReturnType<typeof useDiagnosis>;

const CHECK = (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="var(--green)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function DiagnosisView({ runner, onAgain }: { runner: Runner; onAgain: () => void }) {
  const { run, skipVisible, skip, wrapRef, itemRefs } = runner;
  if (!run) return null;

  return (
    <div ref={wrapRef} className={s.runWrap}>
      <div className={s.diagHead} style={{ marginTop: 40 }}>
        <div>
          <h3 className={s.runTitle}>Tu diagnóstico, en directo</h3>
          <p className="lede" style={{ marginTop: 6 }}>
            El agente explora fuente a fuente. Mientras trabaja ves qué consulta; cuando termina, aparece lo que encontró.
          </p>
        </div>
        <div className={s.diagTools}>
          {skipVisible ? (
            <button type="button" className="btn" onClick={skip}>
              Mostrar todo ya
            </button>
          ) : null}
          <button type="button" className="btn" onClick={onAgain}>
            Empezar de nuevo
          </button>
        </div>
      </div>
      <ol className={s.runList}>
        {run.defs.map((def, i) => {
          const st = run.steps[i];
          return (
            <li
              key={def.title}
              className={s.rstep}
              data-state={st.state}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
            >
              <span className={s.rnum}>{i + 1}</span>
              <div className={s.rhead}>
                <h3>{def.title}</h3>
                <span className={s.ragent}>con {def.agent}</span>
                <span className={s.rstate}>{st.state === "pending" ? "En espera" : st.state === "running" ? "Explorando" : `Hecho: ${def.sum}`}</span>
              </div>
              {st.body ? (
                <div className={s.rbody}>
                  <ul className={s.logs} aria-live="polite">
                    {st.logs.map((lg, k) =>
                      lg.note ? (
                        <li key={k} className={`${s.lg} ${s.note}`}>
                          <span className={s.lgIc} aria-hidden="true" />
                          <span className={s.lgWhat}>{lg.what}</span>
                        </li>
                      ) : (
                        <li key={k} className={s.lg}>
                          <span className={s.lgIc}>{lg.res === null ? <span className={s.spin} aria-hidden="true" /> : CHECK}</span>
                          <span className={s.lgVerb}>{lg.verb}</span>
                          <span className={s.lgWhat}>{lg.what}</span>
                          <span className={s.lgRes}>{lg.res === null ? "…" : lg.res}</span>
                        </li>
                      ),
                    )}
                  </ul>
                  <div>{st.result ? <div className={`${s.res} ${st.resOn ? s.on : ""}`}><Result def={def} /></div> : <Skeleton kind={def.skel} />}</div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Grant({ name, org, fit, amount, deadline }: { name: string; org: string; fit: number; amount: string; deadline: string }) {
  return (
    <div className="card">
      <h4 style={{ fontSize: 19, lineHeight: 1.25 }}>{name}</h4>
      <span className="muted" style={{ fontSize: 14 }}>
        {org}
      </span>
      <div className="fit">
        <span>Encaje {fit} %</span>
        <span className="fitbar">
          <span style={{ "--w": `${fit}%` } as CSSProperties} />
        </span>
      </div>
      <div className="tags">
        <span className="tag ok">{amount}</span>
        <span className="tag">{deadline}</span>
      </div>
    </div>
  );
}

function Result({ def }: { def: StepDef }) {
  switch (def.result) {
    case "company":
      return (
        <div className="card">
          <div className={s.coHead}>
            <div>
              <h4>Andino Foods SL</h4>
              <span className="muted" style={{ fontSize: 15 }}>
                andinofoods.es
              </span>
            </div>
            <span className={s.found}>Encontrada</span>
          </div>
          <p className={s.coDesc}>Elabora arepas y empanadas para supermercados. Socia única: Mariana Ortega.</p>
          <div className="tags">
            <span className="tag">Constituida en 2023</span>
            <span className="tag">7 personas</span>
            <span className="tag">Valencia</span>
            <span className="tag warn">Facturación por confirmar</span>
          </div>
        </div>
      );
    case "structure":
      return (
        <div className="card">
          <div className={s.miniTree}>
            <span className={`${s.mtNode} ${s.person}`}>Mariana Ortega</span>
            <span className={s.mtV} />
            <span className={s.mtH} />
            <div className={s.mtDrops}>
              <span />
              <span />
            </div>
            <div className={s.mtKids}>
              <span className={s.mtNode}>Andino Foods SL</span>
              <span className={s.mtNode}>Andino Inmuebles SL</span>
            </div>
          </div>
          <p className={s.coDesc}>Una holding podría separar el riesgo del obrador del valor de la nave. Lo decide la abogada.</p>
        </div>
      );
    case "grants":
      return (
        <div className={s.grants}>
          <Grant name="Ayuda a la inversión productiva de pymes" org="Agencia autonómica de competitividad" fit={86} amount="Hasta 54.000 €" deadline="Cierra el 15 de diciembre" />
          <Grant name="Incentivo a la contratación indefinida de jóvenes" org="Servicio público de empleo autonómico" fit={78} amount="Hasta 24.000 €" deadline="Abierta todo el año" />
          <Grant name="Programa de digitalización de pymes" org="Cámara de Comercio" fit={71} amount="Hasta 7.000 €" deadline="Cierra el 30 de noviembre" />
        </div>
      );
    case "hacienda":
      return (
        <div className="card">
          <ul className={s.checks}>
            <CheckItem warn title="Hay una notificación de la AEAT sin leer" sub="Del 2 de octubre. La abogada la revisa hoy." />
            <CheckItem warn title="Certificado de la Seguridad Social caducado" sub="Lo pedimos con tu apoderamiento." />
            <CheckItem warn title="Cuentas de 2025 sin depositar" sub="Hacen falta para la ayuda a la inversión." />
            <CheckItem title="Certificado de la AEAT al corriente" sub="Te avisamos antes de que caduque." />
          </ul>
        </div>
      );
    case "plan":
      return (
        <>
          <div className="card">
            <ul className={s.plan}>
              <li>
                <b>Semana 1</b>
                <span>{def.week1}</span>
              </li>
              <li>
                <b>Semana 2</b>
                <span>Propuesta de holding revisada por la abogada.</span>
              </li>
              <li>
                <b>Semana 3</b>
                <span>Depositar las cuentas y solicitar la ayuda a la inversión.</span>
              </li>
            </ul>
          </div>
          <Credit />
        </>
      );
  }
}

function CheckItem({ warn = false, title, sub }: { warn?: boolean; title: string; sub: string }) {
  return (
    <li>
      <span className={`${s.ci} ${warn ? s.ciWarn : s.ciOk}`}>{warn ? "!" : "✓"}</span>
      <div>
        <p>{title}</p>
        <p className="muted">{sub}</p>
      </div>
    </li>
  );
}

function Credit() {
  const { goMode, email } = useStart();
  const [done, setDone] = useState(false);
  return (
    <div className={s.credit}>
      <h4>Te regalamos 50 € de crédito</h4>
      <p style={{ margin: 0, color: "var(--char)" }}>Sin tarjeta. Úsalo en una consulta exprés o en tu sesión con la abogada.</p>
      <label htmlFor="mail" style={{ fontWeight: 600, fontSize: 15 }}>
        Tu correo
      </label>
      <input id="mail" type="email" autoComplete="email" placeholder="tu@empresa.com" defaultValue={email} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button type="button" className="btn btn-ember" disabled={done} onClick={() => setDone(true)}>
          {done ? "Crédito activado" : "Activar mi crédito"}
        </button>
        <a
          className="btn"
          href="#empezar"
          onClick={(e) => {
            e.preventDefault();
            goMode("video");
          }}
        >
          Agendar videollamada
        </a>
      </div>
      <p role="status" style={{ margin: 0, color: "var(--green)", fontWeight: 600 }} hidden={!done}>
        {done ? "Crédito activado. Te escribimos hoy para agendar tu sesión con la abogada. Prototipo: no se envía ningún dato." : ""}
      </p>
    </div>
  );
}
