"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import { Caveat } from "next/font/google";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useStart } from "@/components/start/StartProvider";
import { SCROLL_SPRING } from "@/lib/motion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { AgentToast, ApprovalPop, PlatformWindow } from "./PlatformPreview";
import { AUTOPLAY_MS, TABS } from "./platformData";
import s from "./HeroPlatform.module.css";

/* Letra manuscrita solo para las dos anotaciones (decorativa: sin precarga). */
const hand = Caveat({ subsets: ["latin"], weight: ["500", "600"], display: "swap", preload: false, variable: "--font-hand" });

/**
 * Portada 5 «La plataforma». Titular centrado, correo y CTA, y un panel de
 * producto que cambia con un selector segmentado (avanza solo, se pausa al
 * pasar el ratón o al elegir una pestaña). Notas manuscritas: los agentes
 * proponen; tu abogada firma.
 */
export function HeroPlatform() {
  const { goInterview, setEmail } = useStart();
  // Seguro para la hidratación: decide si se pinta el botón de pausa.
  const reduced = useReducedMotionSafe();
  // Notas y tarjetas flotantes: solo caben (y solo se montan) en pantallas anchas.
  const wide = useMediaQuery("(min-width: 1280px)");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = TABS[index];
  const running = playing && !hover && inView;

  // Solo avanza mientras el panel está a la vista.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // El panel llega inclinado y se endereza al acercarse al centro de la pantalla.
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "center center"] });
  const smooth = useSpring(scrollYProgress, SCROLL_SPRING);
  const rotateX = useTransform(smooth, [0, 1], reduced ? [0, 0] : [16, 0]);
  const scale = useTransform(smooth, [0, 1], reduced ? [1, 1] : [0.93, 1]);
  const y = useTransform(smooth, [0, 1], reduced ? [0, 0] : [40, 0]);

  const choose = (i: number) => {
    setIndex(i);
    setPlaying(false);
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = TABS.length - 1;
    const to = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(to);
    tabRefs.current[to]?.focus();
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = (new FormData(e.currentTarget).get("email") ?? "").toString().trim();
    if (v) setEmail(v);
    goInterview({});
  };

  return (
    <section id="inicio" className={`${s.hero} ${hand.variable}`} aria-labelledby="h-hero">
      <div className={`wrap ${s.head}`}>
        <p className={s.pill}>
          <i aria-hidden="true" /> Gestoría, abogada y agentes de IA
        </p>
        <h1 id="h-hero" className={s.title}>
          Una sola plataforma para ordenar tu grupo de empresas.
        </h1>
        <p className={s.sub}>¿Suena demasiado bien? Pruébalo con 50 € de crédito, sin tarjeta.</p>

        <form className={s.cta} onSubmit={submit}>
          <label htmlFor="hero-email" className="visually-hidden">
            Tu correo
          </label>
          <input id="hero-email" name="email" type="email" placeholder="tu@empresa.com" autoComplete="email" />
          <button type="submit" className="btn btn-dark">
            Empezar gratis <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className={s.privacy}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Tus datos personales nunca llegan a la IA · Servidores en la UE
        </p>
      </div>

      <div className={s.tabsRow}>
        <div className={s.segmented} role="tablist" aria-label="Qué quieres ver">
          {TABS.map((t, i) => {
            const on = i === index;
            return (
              <button
                key={t.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${t.key}`}
                aria-selected={on}
                aria-controls="panel-plataforma"
                tabIndex={on ? 0 : -1}
                className={s.seg}
                onClick={() => choose(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                {on ? <motion.span layoutId="seg-pill" className={s.segPill} transition={{ type: "spring", stiffness: 520, damping: 40 }} /> : null}
                <span className={s.segLabel}>
                  <i style={{ background: t.agent.color }} aria-hidden="true" />
                  {t.label}
                </span>
                {on ? (
                  <span
                    key={`p-${index}`}
                    className={s.segProgress}
                    aria-hidden="true"
                    style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: running ? "running" : "paused" } as CSSProperties}
                    onAnimationEnd={() => setIndex((x) => (x + 1) % TABS.length)}
                    data-playing={playing}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
        {!reduced ? (
          <button type="button" className={s.play} onClick={() => setPlaying((p) => !p)} aria-pressed={!playing} aria-label={playing ? "Pausar la demostración" : "Reanudar la demostración"}>
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /> : <path d="M8 5l11 7-11 7z" fill="currentColor" />}
            </svg>
          </button>
        ) : null}
      </div>

      <div ref={stage} className={s.stage} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <motion.div className={s.tilt} style={{ rotateX, scale, y, transformPerspective: 1400 }}>
          {wide ? <Notes /> : null}
          <div id="panel-plataforma" role="tabpanel" aria-labelledby={`tab-${tab.key}`} className={s.panelWrap}>
            <PlatformWindow tab={tab} />
          </div>
          {wide ? (
            <>
              <AgentToast tab={tab} />
              <ApprovalPop tabKey={tab.key} />
            </>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Anotaciones manuscritas sobre las esquinas de la ventana (solo en pantallas
 * anchas): la flecha izquierda rodea la esquina hasta los agentes de la barra
 * lateral; la derecha, hasta el sello «Revisado por tu abogada».
 */
function Notes() {
  return (
    <>
      <span className={`${s.note} ${s.noteText} ${s.noteL}`} aria-hidden="true">
        los agentes proponen
      </span>
      <svg className={`${s.note} ${s.arrow} ${s.arrowL}`} viewBox="0 0 84 210" fill="none" aria-hidden="true">
        <path pathLength={1} d="M46 6 C 16 36, 4 112, 34 152 C 46 166, 58 170, 74 170" />
        <path pathLength={1} className={s.arrowHead} d="M63 161 L74 170 L62 178" />
      </svg>
      <span className={`${s.note} ${s.noteText} ${s.noteR}`} aria-hidden="true">
        tu abogada firma
      </span>
      <svg className={`${s.note} ${s.arrow} ${s.arrowR}`} viewBox="0 0 84 110" fill="none" aria-hidden="true">
        <path pathLength={1} d="M44 4 C 70 22, 80 64, 52 84 C 40 92, 28 92, 14 91" />
        <path pathLength={1} className={s.arrowHead} d="M25 83 L14 91 L26 98" />
      </svg>
    </>
  );
}
