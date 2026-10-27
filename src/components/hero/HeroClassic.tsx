import { StartCard, TalkLinks } from "./StartCard";
import s from "./HeroClassic.module.css";

/** Trazo a mano alrededor de una palabra. */
export function Circled({ children }: { children: React.ReactNode }) {
  return (
    <span className="circ">
      {children}
      <svg viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength={1} d="M14 46 C10 22 62 8 112 9 C160 10 194 26 190 46 C186 68 128 77 80 74 C36 71 8 60 12 40 C15 28 40 18 70 14" />
      </svg>
    </span>
  );
}

/** Portada 1 «Directa»: el diagnóstico empieza en la propia portada (prototipo original). */
export function HeroClassic() {
  return (
    <div className="wrap">
      <header className={s.hero} id="inicio">
        <div>
          <h1 className={s.title}>
            Crear una holding nunca fue tan{" "}
            <span style={{ whiteSpace: "nowrap" }}>
              <Circled>fácil</Circled>.
            </span>
          </h1>
          <p className={s.sub}>
            Despreocúpate de tenerlo todo bajo control. Un agente estudia tu empresa delante de ti, una abogada firma lo que haga falta y nos anticipamos a Hacienda.
          </p>
          <StartCard />
          <TalkLinks />
        </div>
        <div className={s.papers} aria-hidden="true">
          <div className={`${s.paper} ${s.p1}`}>
            <span className={s.ptitle}>Escritura de constitución</span>
            <span className={s.pline} style={{ width: "90%" }} />
            <span className={s.pline} style={{ width: "72%" }} />
            <span className={s.pline} style={{ width: "84%" }} />
          </div>
          <div className={`${s.paper} ${s.p2}`}>
            <span className={s.ptitle}>Notificación de la AEAT</span>
            <span className={s.pline} style={{ width: "80%" }} />
            <span className={s.pline} style={{ width: "66%" }} />
          </div>
          <div className={`${s.paper} ${s.p3}`}>
            <span className={s.ptitle}>Factura FA-2026-1182</span>
            <span className={s.prow}>
              <span>Emisor</span>
              <span>Distribuciones Levante SL</span>
            </span>
            <span className={s.prow}>
              <span>Cliente</span>
              <span className={s.mark}>Andino Foods SL</span>
            </span>
            <span className={s.prow}>
              <span>Base imponible</span>
              <span>410,00 €</span>
            </span>
            <span className={s.prow}>
              <span>IVA (21 %)</span>
              <span>86,10 €</span>
            </span>
            <span className={s.prow}>
              <span>
                <b>Total</b>
              </span>
              <span className={s.mark}>
                <b>496,10 €</b>
              </span>
            </span>
            <span className={s.pline} style={{ width: "60%", marginTop: 8 }} />
            <span className={s.pline} style={{ width: "45%" }} />
            <div className={s.seal}>V.º B.º</div>
          </div>
        </div>
      </header>
    </div>
  );
}
