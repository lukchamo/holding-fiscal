"use client";

import { useState } from "react";
import { EXAMPLE, SOC_OPTIONS } from "@/components/start/interviewData";
import { useStart } from "@/components/start/StartProvider";
import s from "./HeroClassic.module.css";

/** Tarjeta de inicio de la portada 1: la entrevista empieza con lo que ya contaste aquí. */
export function StartCard() {
  const { goInterview } = useStart();
  const [desc, setDesc] = useState("");
  const [soc, setSoc] = useState(-1);

  const go = () => {
    const d = desc.trim();
    goInterview({
      ...(d ? { desc: { text: d, custom: true } } : {}),
      ...(soc >= 0 ? { soc } : {}),
    });
  };

  const example = () => {
    setDesc(EXAMPLE);
    setSoc(2);
    goInterview({ desc: { text: EXAMPLE, custom: false }, soc: 2, worry: 0, cert: 1 });
  };

  return (
    <div className={s.start} role="form" aria-label="Empieza tu diagnóstico">
      <label htmlFor="desc">¿Qué hace tu empresa?</label>
      <textarea id="desc" placeholder="Por ejemplo: elaboramos arepas para supermercados en Valencia" value={desc} onChange={(e) => setDesc(e.target.value)} />
      <p className={s.q} id="qsoc">
        ¿Cuántas sociedades tienes?
      </p>
      <div className="chips" role="group" aria-labelledby="qsoc">
        {SOC_OPTIONS.map((o, i) => (
          <button key={o} type="button" className="chip" aria-pressed={soc === i} onClick={() => setSoc(i)}>
            {o}
          </button>
        ))}
      </div>
      <div className={s.startActions}>
        <button type="button" className="btn btn-ember" onClick={go}>
          Empezar mi diagnóstico
        </button>
        <button type="button" className="linkbtn" onClick={example}>
          Probar con un ejemplo
        </button>
      </div>
      <small>Gratis y sin tarjeta. Te regalamos 50 € de crédito.</small>
    </div>
  );
}

export function TalkLinks({ className }: { className?: string }) {
  const { goMode } = useStart();
  return (
    <p className={className ?? s.talk}>
      ¿Prefieres hablar con una persona?{" "}
      <a
        href="#empezar"
        onClick={(e) => {
          e.preventDefault();
          goMode("video");
        }}
      >
        Agenda una videollamada
      </a>{" "}
      o{" "}
      <a
        href="#empezar"
        onClick={(e) => {
          e.preventDefault();
          goMode("cafe");
        }}
      >
        tómate un café con nosotros
      </a>
      .
    </p>
  );
}
