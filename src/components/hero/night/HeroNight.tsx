"use client";

import { motion, useTransform } from "motion/react";
import { BrandName } from "@/components/brand/BrandProvider";
import { FounderPortrait } from "@/components/sections/Portraits";
import { useStart } from "@/components/start/StartProvider";
import { FitStage, ScrollCue, StoryChapter, StoryRail } from "@/components/story/StoryParts";
import { useStory } from "@/components/story/useStory";
import { useIsDark } from "@/lib/useTheme";
import { CHAPTERS, formatClock, minutesAt } from "./nightData";
import { Phone } from "./Phone";
import { DARK_SKY, LIGHT_SKY, Sky } from "./Sky";
import s from "./HeroNight.module.css";

const TOTAL = CHAPTERS.length;

/**
 * Portada 3 «La noche de Mariana». Una historia humana contada con el reloj:
 * de las 23:47 a las 08:15. De noche, una bitácora de lo que hacen los
 * agentes; por la mañana, la abogada lo revisa con el primer café.
 */
export function HeroNight() {
  const { ref, progress: p, chapter, reduced, jumpTo } = useStory(CHAPTERS);
  const dark = useIsDark();
  const { goInterview, goMode } = useStart();

  const clock = useTransform(p, (v) => formatClock(minutesAt(v)));
  const fg = useTransform(p, [0, 0.6, 0.64], dark ? ["#F3EEE7", "#F3EEE7", "#F3EEE7"] : ["#F3EEE7", "#F3EEE7", "#2D2F34"]);
  const accent = useTransform(p, [0, 0.6, 0.64], dark ? ["#F7A07D", "#F7A07D", "#F7A07D"] : ["#F7A07D", "#F7A07D", "#AE421A"]);
  const morning = chapter >= 3 && !dark;

  const chapterProps = (i: number) => ({ progress: p, chapter: CHAPTERS[i], index: i, total: TOTAL, active: chapter === i, onFocusHidden: jumpTo });

  return (
    <section ref={ref} id="inicio" className={s.track} aria-labelledby="h-hero" data-reduced={reduced}>
      <div className={s.sticky}>
        <Sky p={p} palette={dark ? DARK_SKY : LIGHT_SKY} />
        <motion.div className={s.inner} style={{ color: fg, "--fg": fg, "--accent": accent } as unknown as React.CSSProperties}>
          <div className={s.top}>
            <StoryRail chapters={CHAPTERS} progress={p} active={chapter} onJump={jumpTo} tone={morning ? "paper" : "night"} />
            <a className={s.skip} href="#empezar">
              Saltar la historia
            </a>
          </div>

          <div className={s.copy}>
            <motion.p className={s.clock} aria-hidden="true">
              {clock}
            </motion.p>
            <div className={s.chapters}>
              <StoryChapter {...chapterProps(0)}>
                <p className={s.eyebrow}>Una noche cualquiera</p>
                <h1 id="h-hero" className={s.h1}>
                  Tu empresa amanece en orden.
                </h1>
                <p className={s.body}>
                  <BrandName /> es la gestoría y la abogada fiscal de tu grupo de empresas. De noche, los agentes preparan el trabajo; por la mañana, una persona lo revisa y lo firma.
                </p>
              </StoryChapter>
              <StoryChapter {...chapterProps(1)}>
                <p className={s.eyebrow}>23:47 · El cierre</p>
                <h2 className={s.h2}>Mariana cierra el obrador.</h2>
                <p className={s.body}>Hoy han salido 2.400 arepas hacia tres supermercados. En el móvil la espera una carta de Hacienda que lleva tres días sin abrir.</p>
                <p className={s.person}>
                  <span className={s.personFace}>
                    <FounderPortrait />
                  </span>
                  <span>
                    <b>Mariana Ortega</b>, fundadora de Andino Foods
                    <small>Historia ilustrativa con datos de ejemplo</small>
                  </span>
                </p>
              </StoryChapter>
              <StoryChapter {...chapterProps(2)}>
                <p className={s.eyebrow}>00:12 – 03:40 · La noche</p>
                <h2 className={s.h2}>Ella duerme. La bitácora se va llenando.</h2>
                <p className={s.body}>
                  Los agentes trabajan con lo que ya tenemos: su correo, sus buzones oficiales y sus facturas. Cada paso queda anotado, con su hora y con quién lo hizo.
                </p>
              </StoryChapter>
              <StoryChapter {...chapterProps(3)}>
                <p className={s.eyebrow}>07:30 · El café</p>
                <h2 className={s.h2}>La abogada lo revisa con el primer café.</h2>
                <p className={s.body}>Corrige un matiz de la respuesta a Hacienda y da su visto bueno a los cuatro borradores. Ningún agente presenta nada sin una persona.</p>
              </StoryChapter>
              <StoryChapter {...chapterProps(4)}>
                <p className={s.eyebrow}>08:15 · Buenos días</p>
                <h2 className={s.h2}>Nos anticipamos. Tú solo firmas.</h2>
                <p className={s.body}>Así empieza el día cuando alguien se adelanta por ti. Empieza con una entrevista de dos minutos y 50 € de crédito, sin tarjeta.</p>
                <div className={s.ctas}>
                  <button type="button" className="btn btn-ember" onClick={() => goInterview({})}>
                    Empezar mi diagnóstico
                  </button>
                  <button type="button" className={`linkbtn ${s.link}`} onClick={() => goMode("cafe")}>
                    O tómate un café con la abogada
                  </button>
                </div>
                <p className={s.trust}>RGPD · Datos en la UE · Una persona firma cada paso</p>
              </StoryChapter>
            </div>
          </div>

          <div className={s.stage} aria-hidden="true">
            <FitStage width={300} height={616} max={1}>
              <Phone p={p} clock={clock} />
            </FitStage>
          </div>
        </motion.div>
        <ScrollCue progress={p} tone="night" label="Desliza para pasar la noche" />
      </div>
    </section>
  );
}
