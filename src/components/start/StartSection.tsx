"use client";

import { useRef, type KeyboardEvent } from "react";
import { Interview } from "./Interview";
import { Scheduler } from "./Scheduler";
import { useStart, type Mode } from "./StartProvider";
import s from "./Start.module.css";

const TABS: { mode: Mode; title: string; sub: string }[] = [
  { mode: "ia", title: "Entrevista virtual", sub: "Ahora mismo, unos 2 minutos" },
  { mode: "video", title: "Videollamada", sub: "30 minutos con la abogada" },
  { mode: "cafe", title: "Un café", sub: "45 minutos en Valencia" },
];

/** «Empieza como prefieras»: entrevista virtual, videollamada o café. */
export function StartSection() {
  const { mode, setMode, ensureInterview } = useStart();
  const panelIa = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
    setMode(TABS[n].mode);
    tabRefs.current[n]?.focus();
  };

  return (
    <section id="empezar" className="section" aria-labelledby="h-empezar">
      <div className="wrap">
        <div className={s.diagHead}>
          <div>
            <h2 id="h-empezar">Empieza como prefieras</h2>
            <p className="lede">Una entrevista virtual de dos minutos, una videollamada con la abogada o un café. En los tres casos sales con tu diagnóstico.</p>
          </div>
        </div>
        <div className={s.modes} role="tablist" aria-label="Cómo quieres empezar">
          {TABS.map((t, i) => (
            <button
              key={t.mode}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              className={s.mode}
              id={`tab-${t.mode}`}
              aria-selected={mode === t.mode}
              aria-controls={`panel-${t.mode}`}
              tabIndex={mode === t.mode ? 0 : -1}
              onClick={() => {
                setMode(t.mode);
                if (t.mode === "ia") ensureInterview();
              }}
              onKeyDown={(e) => onKey(e, i)}
            >
              <b>{t.title}</b>
              <span>{t.sub}</span>
            </button>
          ))}
        </div>

        <div ref={panelIa} className={s.mpanel} id="panel-ia" role="tabpanel" aria-labelledby="tab-ia" hidden={mode !== "ia"}>
          <Interview panelRef={panelIa} />
        </div>
        <div className={s.mpanel} id="panel-video" role="tabpanel" aria-labelledby="tab-video" hidden={mode !== "video"}>
          <Scheduler kind="video" />
        </div>
        <div className={s.mpanel} id="panel-cafe" role="tabpanel" aria-labelledby="tab-cafe" hidden={mode !== "cafe"}>
          <Scheduler kind="cafe" />
        </div>
      </div>
    </section>
  );
}
