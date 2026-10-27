"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { BrandTagline, useBrand } from "@/components/brand/BrandProvider";
import { useStart } from "@/components/start/StartProvider";
import { FitStage, ScrollCue, StoryChapter, StoryRail } from "@/components/story/StoryParts";
import { useStory, type Chapter } from "@/components/story/useStory";
import { CalmMeter } from "./CalmMeter";
import { ChaosStage } from "./ChaosStage";
import { DESKTOP, MOBILE } from "./chaosData";
import s from "./HeroChaos.module.css";

const CHAPTERS: Chapter[] = [
  { id: "caos", label: "El caos", from: 0, to: 0.24 },
  { id: "orden", label: "El orden", from: 0.24, to: 0.5 },
  { id: "firma", label: "La firma", from: 0.5, to: 0.74 },
  { id: "calma", label: "La calma", from: 0.74, to: 1 },
];

/**
 * Portada 2 «Del caos a la calma». Una sola metáfora contada con el scroll:
 * los papeles de una pyme pasan del desorden a pilas ordenadas por agentes,
 * las personas los firman y todo acaba bajo el símbolo de la marca.
 */
export function HeroChaos() {
  const { ref, progress: p, chapter, reduced, jumpTo } = useStory(CHAPTERS);
  const { brand } = useBrand();
  const { goInterview, goMode } = useStart();

  return (
    <section ref={ref} id="inicio" className={s.track} aria-labelledby="h-hero" data-reduced={reduced}>
      <div className={s.sticky}>
        <div className={s.top}>
          <StoryRail chapters={CHAPTERS} progress={p} active={chapter} onJump={jumpTo} />
          <div className={s.meta}>
            <span className={s.onlyMobInline}>
              <CalmMeter p={p} chapter={chapter} compact />
            </span>
            <a className={s.skip} href="#empezar">
              Saltar la historia
            </a>
          </div>
        </div>

        <div className={s.stage} aria-hidden="true">
          <FitStage width={DESKTOP.w} height={DESKTOP.h} className={s.onlyDesk}>
            <ChaosStage comp={DESKTOP} p={p} chapter={chapter} brand={brand.key} />
          </FitStage>
          <FitStage width={MOBILE.w} height={MOBILE.h} className={s.onlyMob}>
            <ChaosStage comp={MOBILE} p={p} chapter={chapter} brand={brand.key} />
          </FitStage>
          <div className={s.meterSlot}>
            <CalmMeter p={p} chapter={chapter} />
          </div>
        </div>

        <div className={s.copy}>
          <div className={s.chapters}>
            <StoryChapter progress={p} chapter={CHAPTERS[0]} index={0} total={4} active={chapter === 0} onFocusHidden={jumpTo}>
              <p className={s.eyebrow}>Del caos a la calma</p>
              <h1 id="h-hero" className={s.h1}>
                Tienes una empresa, no una montaña de papeles.
              </h1>
              <p className={s.body}>
                Facturas en tres correos, una carta de Hacienda sin abrir, un certificado caducado y un plazo que vence mañana. Te ponemos al día: gestoría, abogada fiscal y holding en un solo sitio.
              </p>
            </StoryChapter>
            <StoryChapter progress={p} chapter={CHAPTERS[1]} index={1} total={4} active={chapter === 1} onFocusHidden={jumpTo}>
              <p className={s.eyebrow}>1 · Lo ordenamos</p>
              <h2 className={s.h2}>Cinco agentes lo leen todo y lo ponen en su sitio.</h2>
              <p className={s.body}>
                <Agent c="var(--ag-vera)">Vera</Agent> clasifica tus facturas, <Agent c="var(--ag-nora)">Nora</Agent> vigila Hacienda, <Agent c="var(--ag-bruno)">Bruno</Agent> busca ayudas y{" "}
                <Agent c="var(--ag-elio)">Elio</Agent> ordena tus sociedades. <Agent c="var(--ag-alma)">Alma</Agent> los coordina y te avisa antes de que venza nada.
              </p>
            </StoryChapter>
            <StoryChapter progress={p} chapter={CHAPTERS[2]} index={2} total={4} active={chapter === 2} onFocusHidden={jumpTo}>
              <p className={s.eyebrow}>2 · Lo firmamos</p>
              <h2 className={s.h2}>Personas de verdad lo revisan y lo firman.</h2>
              <p className={s.body}>Los agentes proponen; tu gestor y la abogada revisan, corrigen y dan el visto bueno. Nada sale sin una persona detrás, y sin tu permiso.</p>
            </StoryChapter>
            <StoryChapter progress={p} chapter={CHAPTERS[3]} index={3} total={4} active={chapter === 3} onFocusHidden={jumpTo}>
              <p className={s.eyebrow}>3 · Respiras</p>
              <h2 className={s.h2}>
                Crear una holding nunca fue tan <ScrollCircled p={p}>fácil</ScrollCircled>.
              </h2>
              <p className={s.body}>
                <BrandTagline /> Empieza con una entrevista de dos minutos y 50 € de crédito, sin tarjeta.
              </p>
              <div className={s.ctas}>
                <button type="button" className="btn btn-ember" onClick={() => goInterview({})}>
                  Empezar mi diagnóstico
                </button>
                <button type="button" className="linkbtn" onClick={() => goMode("cafe")}>
                  O tómate un café con nosotros
                </button>
              </div>
              <p className={s.trust}>RGPD · Datos en la UE · Una persona firma cada paso</p>
            </StoryChapter>
          </div>
        </div>

        <ScrollCue progress={p} />
      </div>
    </section>
  );
}

function Agent({ c, children }: { c: string; children: React.ReactNode }) {
  return (
    <b className={s.agentInline} style={{ "--c": c } as React.CSSProperties}>
      {children}
    </b>
  );
}

/** «fácil» rodeado a mano, dibujado al ritmo del scroll. */
function ScrollCircled({ p, children }: { p: MotionValue<number>; children: React.ReactNode }) {
  const pathLength = useTransform(p, [0.8, 0.9], [0, 1]);
  return (
    <span className={s.circ}>
      {children}
      <svg viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true">
        <motion.path d="M14 46 C10 22 62 8 112 9 C160 10 194 26 190 46 C186 68 128 77 80 74 C36 71 8 60 12 40 C15 28 40 18 70 14" style={{ pathLength }} />
      </svg>
    </span>
  );
}
