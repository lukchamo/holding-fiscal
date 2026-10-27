"use client";

import { useState, useSyncExternalStore } from "react";
import { useStart } from "./StartProvider";
import s from "./Start.module.css";

const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function nextWeekdays(n: number) {
  const out: Date[] = [];
  let d = new Date();
  while (out.length < n) {
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
  }
  return out;
}

// Las fechas dependen del día en que se visita: solo se calculan en el navegador.
const noop = () => () => {};
let cachedDays: Date[] | null = null;
const getDays = () => (cachedDays ??= nextWeekdays(5));
const getServerDays = () => null;

const COPY = {
  video: {
    title: "Videollamada con la abogada",
    text: "30 minutos para revisar tu situación. Sales con un plan claro y sin compromiso.",
    list: ["La cubre tu crédito de bienvenida", "Te enviamos el enlace por correo", "Si antes haces la entrevista virtual, llegamos con tu diagnóstico preparado"],
    times: ["10:00", "11:30", "13:00", "16:30", "18:00"],
    cta: "Confirmar videollamada",
    done: "Videollamada confirmada",
  },
  cafe: {
    title: "Un café con la abogada",
    text: "45 minutos en Castellón de la Plana. Grabamos la conversación con tu permiso y el agente prepara tu expediente mientras habláis.",
    list: ["Invitamos nosotros", "Lugar: [DIRECCIÓN DE LA OFICINA]", "Si estás lejos, lo hacemos por videollamada"],
    times: ["09:30", "11:00", "17:00"],
    cta: "Confirmar el café",
    done: "Café confirmado",
  },
} as const;

export function Scheduler({ kind }: { kind: "video" | "cafe" }) {
  const c = COPY[kind];
  const days = useSyncExternalStore(noop, getDays, getServerDays);
  const { goInterview } = useStart();
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [ok, setOk] = useState<string | null>(null);

  const valid = Boolean(day && time && /.+@.+\..+/.test(mail));

  const confirm = () => {
    if (!day || !time) return;
    const who = name.trim() ? `${name.trim().split(" ")[0]}, ` : "";
    const when = `${DAYS[day.getDay()]} ${day.getDate()} de ${MONTHS[day.getMonth()]} a las ${time}`;
    setOk(
      (kind === "video"
        ? `Listo, ${who}videollamada con la abogada el ${when}. Te enviamos el enlace a ${mail}.`
        : `Listo, ${who}café con la abogada el ${when}. Te enviamos la dirección a ${mail}.`) + " Prototipo: no se envía nada.",
    );
  };

  return (
    <div className={s.schedCard}>
      <div className={s.schedInfo}>
        <h3>{c.title}</h3>
        <p>{c.text}</p>
        <ul>
          {c.list.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
      <div className={s.schedPick}>
        <p className={s.q}>Elige un día</p>
        <div className="chips" role="group" aria-label="Día">
          {days?.map((d) => (
            <button key={d.toISOString()} type="button" className="chip" aria-pressed={day?.getTime() === d.getTime()} onClick={() => setDay(d)}>
              {DAYS[d.getDay()]} {d.getDate()}
            </button>
          ))}
        </div>
        <p className={s.q}>Elige una hora</p>
        <div className="chips" role="group" aria-label="Hora">
          {c.times.map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={time === t} onClick={() => setTime(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className={s.fields}>
          <label>
            Tu nombre
            <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Tu correo
            <input type="email" autoComplete="email" placeholder="tu@empresa.com" value={mail} onChange={(e) => setMail(e.target.value)} />
          </label>
        </div>
        <div>
          <button type="button" className="btn btn-ember" disabled={!valid || ok !== null} onClick={confirm}>
            {ok ? c.done : c.cta}
          </button>
        </div>
        <div className={s.schedOk} role="status" hidden={!ok}>
          {ok ? (
            <>
              <p style={{ margin: 0 }}>{ok}</p>
              <button type="button" className="linkbtn" style={{ padding: "8px 0 0" }} onClick={() => goInterview({})}>
                Mientras, haz la entrevista virtual
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
