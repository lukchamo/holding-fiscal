"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { BrandMark } from "@/components/brand/BrandLogo";
import { useBrand } from "@/components/brand/BrandProvider";
import { DiagnosisView, useDiagnosis } from "./Diagnosis";
import { ack, answerLabel, EXAMPLE, QUESTIONS, type Answers, type DescAnswer, type Question } from "./interviewData";
import { prefersReducedMotion, scrollToId, useStart } from "./StartProvider";
import s from "./Start.module.css";

class Cancel extends Error {}

type Msg = { id: number; who: "agent" | "user" | "typing"; text: string };
type Note = { label: string; value: string };

/**
 * Entrevista virtual con Alma: cuatro preguntas cortas y, al terminar,
 * el diagnóstico en directo. Las respuestas dadas en la portada se aceptan
 * solas, como en el prototipo.
 */
export function Interview({ panelRef }: { panelRef: React.RefObject<HTMLDivElement | null> }) {
  const { brand } = useBrand();
  const { registerInterview } = useStart();
  const runner = useDiagnosis();

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [asking, setAsking] = useState<Question | null>(null);

  const chatId = useRef(0);
  const msgSeq = useRef(0);
  const started = useRef(false);
  const resolver = useRef<((v: DescAnswer | number) => void) | null>(null);
  const brandName = useRef(brand.name);
  useEffect(() => {
    brandName.current = brand.name;
  }, [brand.name]);

  const { start: runDiagnosis, cancel: cancelDiagnosis } = runner;

  const start = useCallback(
    async (pre: Answers) => {
      const id = ++chatId.current;
      started.current = true;
      resolver.current = null;
      setMsgs([]);
      setNotes([]);
      setAsking(null);
      cancelDiagnosis();

      const wait = (ms: number) =>
        new Promise<void>((r) => setTimeout(r, prefersReducedMotion() ? 0 : ms)).then(() => {
          if (id !== chatId.current) throw new Cancel();
        });
      const push = (who: Msg["who"], text: string) => {
        const m = { id: ++msgSeq.current, who, text };
        setMsgs((list) => [...list, m]);
        return m.id;
      };
      const agentSay = async (text: string) => {
        const t = push("typing", "");
        await wait(900);
        setMsgs((list) => list.map((m) => (m.id === t ? { ...m, who: "agent", text } : m)));
      };

      const answers: Answers = {};
      try {
        await agentSay(`Hola, soy Alma, de ${brandName.current}. Te haré cuatro preguntas cortas y después mis compañeros y yo exploraremos tu empresa delante de ti.`);
        for (const q of QUESTIONS) {
          await agentSay(q.text);
          let v: DescAnswer | number;
          const given = pre[q.key];
          if (given !== undefined) {
            await wait(650);
            v = given;
          } else {
            v = await new Promise<DescAnswer | number>((res) => {
              resolver.current = res;
              setAsking(q);
            });
            if (id !== chatId.current) throw new Cancel();
            setAsking(null);
          }
          (answers as Record<string, DescAnswer | number>)[q.key] = v;
          push("user", answerLabel(q, v));
          const [say, label, value] = ack(q.key, v);
          await agentSay(say);
          setNotes((n) => [...n, { label, value }]);
          await wait(350);
        }
        await agentSay("Con esto tengo suficiente. Ahora exploramos con Elio, Bruno y Nora: mira cada fuente que consultamos. Nada sale sin que una persona lo apruebe.");
        await wait(500);
        void runDiagnosis(answers.desc?.custom ? answers.desc.text : "", answers.soc, answers.cert);
      } catch (e) {
        if (!(e instanceof Cancel)) throw e;
      }
    },
    [cancelDiagnosis, runDiagnosis],
  );

  useEffect(() => {
    registerInterview({ start: (pre) => void start(pre), isStarted: () => started.current });
    return () => registerInterview(null);
  }, [registerInterview, start]);

  // Arranque automático al llegar a la sección (35 % visible), solo una vez.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && !started.current && !el.hidden) {
            void start({});
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [panelRef, start]);

  const answer = (v: DescAnswer | number) => {
    const r = resolver.current;
    resolver.current = null;
    r?.(v);
  };

  const again = () => {
    cancelDiagnosis();
    void start({});
    scrollToId("empezar");
  };

  return (
    <>
      <div className={s.interview}>
        <div className={s.chat}>
          <div className={s.chatHead}>
            <span className={s.avatarIa} aria-hidden="true">
              <BrandMark size={24} />
            </span>
            <div>
              <b>
                Alma, de <span>{brand.name}</span>
              </b>
              <span className="muted">Te entrevista y coordina a los demás agentes</span>
            </div>
          </div>
          <ol className={s.msgs} aria-live="polite">
            {msgs.map((m) =>
              m.who === "typing" ? (
                <li key={m.id} className={`${s.msg} ${s.agent} ${s.typing}`} aria-label="El asistente está escribiendo">
                  <span />
                  <span />
                  <span />
                </li>
              ) : (
                <li key={m.id} className={`${s.msg} ${m.who === "agent" ? s.agent : s.user}`}>
                  {m.text}
                </li>
              ),
            )}
          </ol>
          <div className={s.composer}>{asking ? <Composer q={asking} onAnswer={answer} /> : null}</div>
        </div>
        <aside className={s.notes} aria-label="Lo que voy entendiendo">
          <h3>Lo que voy entendiendo</h3>
          <ul>
            {notes.length === 0 ? (
              <li className={s.noteEmpty}>Aún nada. Responde a la primera pregunta.</li>
            ) : (
              notes.map((n, i) => (
                <li key={i}>
                  <b>{n.label}</b>
                  <span>{n.value}</span>
                </li>
              ))
            )}
          </ul>
        </aside>
      </div>
      <DiagnosisView runner={runner} onAgain={again} />
    </>
  );
}

function Composer({ q, onAnswer }: { q: Question; onAnswer: (v: DescAnswer | number) => void }) {
  const input = useRef<HTMLInputElement>(null);

  if (q.type === "text") {
    const submit = (e: FormEvent) => {
      e.preventDefault();
      const val = input.current?.value.trim() ?? "";
      if (!val) {
        input.current?.focus();
        return;
      }
      onAnswer({ text: val, custom: true });
    };
    return (
      <>
        <form onSubmit={submit}>
          <label htmlFor="ans" className="visually-hidden">
            Tu respuesta
          </label>
          <input ref={input} id="ans" type="text" placeholder="Por ejemplo: elaboramos arepas para supermercados" autoComplete="off" />
          <button type="submit" className="btn btn-dark">
            Enviar
          </button>
        </form>
        <button type="button" className="linkbtn" style={{ alignSelf: "flex-start", padding: 0 }} onClick={() => onAnswer({ text: EXAMPLE, custom: false })}>
          Usar un ejemplo
        </button>
      </>
    );
  }

  return (
    <div className="chips" role="group" aria-label={q.text}>
      {q.options.map((o, i) => (
        <button key={o} type="button" className="chip" onClick={() => onAnswer(i)}>
          {o}
        </button>
      ))}
    </div>
  );
}
