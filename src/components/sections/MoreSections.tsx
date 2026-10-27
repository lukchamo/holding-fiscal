import { CONNECTORS, FAQ, TRUST } from "@/content/data";
import { FocusStartLink } from "./FocusStartLink";
import { PiiDemo } from "./PiiDemo";
import s from "./Sections.module.css";

export function Extras() {
  return (
    <section className="section" aria-labelledby="h-mas" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <h2 id="h-mas">Y además, todo en el mismo sitio</h2>
        <div className={s.extras}>
          <div className={s.xcard}>
            <h3>Notificaciones antes que nadie</h3>
            <p>Leemos tus buzones de la DEHú y la Seguridad Social. Te enteras por nosotros, nunca por Hacienda.</p>
          </div>
          <div className={s.xcard}>
            <h3>Las finanzas del grupo</h3>
            <p>Bancos, gastos y contabilidad conectados, con un calendario de plazos de todas tus sociedades.</p>
          </div>
          <div className={s.xcard}>
            <h3>Requerimientos en 48 h</h3>
            <p>Si te llega uno, Nora lo detecta al momento y la abogada lo responde contigo.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Promises() {
  return (
    <section className="section" aria-labelledby="h-prom" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <h2 id="h-prom" style={{ textAlign: "center" }}>
          Lo que te prometemos
        </h2>
        <div className={s.promises}>
          <div>
            <b>Al momento</b>
            <p>Respuesta a tus dudas comunes, con tus propios documentos.</p>
          </div>
          <div>
            <b>48 h</b>
            <p>Requerimientos de Hacienda y dudas complejas, resueltos con la abogada.</p>
          </div>
          <div>
            <b>0</b>
            <p>Plataformas nuevas para tu equipo: basta con reenviar el correo.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Connectors() {
  return (
    <section id="conectores" className="section" aria-labelledby="h-conectores" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <h2 id="h-conectores">Se conecta con lo que ya usas</h2>
        <p className="lede">Elegimos las herramientas más usadas por las pymes españolas en cada área. Tu equipo no cambia nada: nosotros nos conectamos.</p>
        <div className={s.connectors}>
          {CONNECTORS.map((c) => (
            <div className={s.ccat} key={c.title}>
              <h3>{c.title}</h3>
              <div className={s.clogos}>
                {c.items.map(([abbr, name]) => (
                  <span className={s.clogo} key={name}>
                    <i aria-hidden="true">{abbr}</i>
                    {name}
                  </span>
                ))}
              </div>
              <p className={s.cnote}>{c.note}</p>
            </div>
          ))}
        </div>
        <p className={s.fineprint}>Prototipo: los logotipos oficiales se añadirán con permiso de cada marca y solo para las integraciones disponibles.</p>
      </div>
    </section>
  );
}

export function Privacy() {
  return (
    <section id="privacidad" className="section" aria-labelledby="h-priv" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <h2 id="h-priv">Tus datos, a salvo</h2>
        <p className="lede">
          Inteligencia operativa aumentada con reglas claras: los agentes proponen, las personas validan y aprueban, y tus datos personales nunca llegan a la IA.
        </p>
        <div className={s.trust}>
          {TRUST.map((t) => (
            <div className={s.tcard} key={t.title}>
              <b>{t.title}</b>
              <p>{t.text}</p>
            </div>
          ))}
        </div>
        <PiiDemo />
      </div>
    </section>
  );
}

const Tick = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="var(--green)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Pricing() {
  return (
    <section id="precio" className="section" aria-labelledby="h-precio" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <div className={s.offer}>
          <div>
            <h2 id="h-precio">Empieza con 50 € de crédito</h2>
            <p className="lede" style={{ color: "var(--char)" }}>
              Sin tarjeta y sin permanencia. Cuando se acabe, pagas una cuota por sociedad: [PRECIO POR SOCIEDAD].
            </p>
            <p style={{ margin: "22px 0 0" }}>
              <FocusStartLink className="btn btn-ember">Empezar mi diagnóstico</FocusStartLink>
            </p>
          </div>
          <ul>
            {["Una consulta exprés a la abogada", "El diagnóstico de ayudas de tu grupo", "La revisión de tus notificaciones pendientes", "Tu buzón de facturas durante un mes"].map((t) => (
              <li key={t}>
                <Tick />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="section" aria-labelledby="h-faq" style={{ paddingTop: 24 }}>
      <div className="wrap">
        <h2 id="h-faq" style={{ textAlign: "center" }}>
          Preguntas frecuentes
        </h2>
        <div className={s.faq}>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
