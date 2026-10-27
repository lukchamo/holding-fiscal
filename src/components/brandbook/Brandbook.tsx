import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/brand/LogoMark";
import { MARK_GEOMETRY } from "@/components/brand/brands";
import { LogoStage } from "./LogoStage";
import s from "./Brandbook.module.css";

const SIZES = [16, 24, 32, 48];

/** Retícula de construcción del símbolo, con anotaciones. */
function Construction({ brand }: { brand: "resguardo" | "lucero" }) {
  const lines = Array.from({ length: 9 }, (_, i) => i * 4);
  const notes =
    brand === "resguardo"
      ? [
          { x: 9.5, y: 27.5, t: "Fuste: la «r» de resguardo", dx: -2, dy: 3.6 },
          { x: 24, y: 8.4, t: "Alero: el trazo que protege", dx: 1, dy: -2.6 },
          { x: 19.4, y: 21.6, t: "Punto ámbar: tú y tu empresa", dx: 4.6, dy: 3.4 },
        ]
      : [
          { x: 8.2, y: 19, t: "Las manos: la «u» de lucero", dx: -6.2, dy: 9.4 },
          { x: 18.6, y: 15.6, t: "La primera luz: tú y tu empresa", dx: 10.4, dy: 5.4 },
          { x: 16, y: 6.2, t: "Destello: nos anticipamos", dx: 3.6, dy: -3.1 },
        ];
  const g = MARK_GEOMETRY[brand];
  return (
    <figure className={s.construction}>
      <svg viewBox="-8 -6 48 44" role="img" aria-label={`Construcción del símbolo de ${brand} en una retícula de 32 × 32`}>
        <rect x="0" y="0" width="32" height="32" className={s.gridBox} />
        {lines.map((v) => (
          <g key={v}>
            <line x1={v} y1="0" x2={v} y2="32" className={s.gridLine} />
            <line x1="0" y1={v} x2="32" y2={v} className={s.gridLine} />
          </g>
        ))}
        {"stem" in g ? <path d={g.stem} className={s.gStroke} /> : null}
        <path d={g.arc} className={s.gStroke} />
        <circle cx={g.dot.cx} cy={g.dot.cy} r={g.dot.r} className={s.gDot} />
        {"rays" in g ? <path d={g.rays} className={s.gRays} /> : null}
        <circle cx={g.dot.cx} cy={g.dot.cy} r={g.dot.r + 1.6} className={s.gGuide} />
        {notes.map((n) => (
          <g key={n.t}>
            <line x1={n.x} y1={n.y} x2={n.x + n.dx} y2={n.y + n.dy} className={s.leader} />
            <text x={n.x + n.dx + (n.dx < 0 ? -0.6 : 0.6)} y={n.y + n.dy + 0.7} textAnchor={n.dx < 0 ? "end" : "start"} className={s.note}>
              {n.t}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>Retícula de 32 × 32 · trazo de 3,4 · terminaciones redondas · punto ámbar #F67748</figcaption>
    </figure>
  );
}

function Variants({ brand, name }: { brand: "resguardo" | "lucero"; name: string }) {
  return (
    <div className={s.variants}>
      <div className={s.variant} data-tone="paper">
        <LogoMark brand={brand} size={56} />
        <Wordmark name={name} className={s.midWord} />
      </div>
      <div className={s.variant} data-tone="ink">
        <LogoMark brand={brand} size={56} ink="#FDF9F4" />
        <Wordmark name={name} className={s.midWord} />
      </div>
      <div className={s.variant} data-tone="ember">
        <span className={s.onEmber}>
          <LogoMark brand={brand} size={56} ink="#2D2F34" />
        </span>
        <Wordmark name={name} className={s.midWord} />
      </div>
      <div className={s.variant} data-tone="paper">
        <div className={s.sizes}>
          {SIZES.map((z) => (
            <span key={z}>
              <LogoMark brand={brand} size={z} />
              <small>{z} px</small>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Brandbook() {
  return (
    <div className={s.page}>
      <header className={`wrap ${s.head}`}>
        <Link href="/" className={s.back}>
          ← Volver a la portada
        </Link>
        <p className={s.kicker}>Propuesta de marca</p>
        <h1>Un trazo que protege un punto.</h1>
        <p className="lede">
          El símbolo nace de una idea sencilla: <b>el abrazo</b>. Un trazo de tinta, nosotros, que cuida de un punto ámbar, tú y tu empresa. Funciona igual para la marca principal y para el nombre alternativo que proponemos.
        </p>
      </header>

      <section className="section wrap" aria-labelledby="h-res">
        <div className={s.split}>
          <div>
            <p className={s.kicker}>Marca principal</p>
            <h2 id="h-res">resguardo</h2>
            <p className={s.copy}>
              La «r» de resguardo alarga el hombro hasta convertirse en un alero: protege el punto que tiene debajo. Es la promesa de la marca, «tus papeles, a resguardo», dibujada en un solo gesto. Se lee a 16 px y mantiene el ámbar del prototipo.
            </p>
            <ul className={s.facts}>
              <li>
                <b>Concepto</b> el abrazo: proteger desde arriba
              </li>
              <li>
                <b>Lema</b> Tus papeles, a resguardo.
              </li>
              <li>
                <b>Sustituye</b> al documento con un tic del prototipo, más genérico
              </li>
            </ul>
          </div>
          <LogoStage brand="resguardo" name="resguardo" />
        </div>
        <Construction brand="resguardo" />
        <Variants brand="resguardo" name="resguardo" />
      </section>

      <section className="section wrap" aria-labelledby="h-anim">
        <p className={s.kicker}>Animación</p>
        <h2 id="h-anim">Coreografía del logotipo</h2>
        <p className="lede">Cuatro tiempos, siempre en el mismo orden. Solo se anima la transformación y la opacidad (60 fps) y, con «reducir movimiento», el logotipo aparece completo y quieto.</p>
        <ol className={s.timeline}>
          <li style={{ ["--a" as string]: "0%", ["--b" as string]: "21%" }}>
            <b>0–280 ms</b> El fuste se dibuja de abajo arriba (curva de entrada y salida).
          </li>
          <li style={{ ["--a" as string]: "15%", ["--b" as string]: "74%" }}>
            <b>200–960 ms</b> El alero se despliega con desaceleración exponencial, como un brazo que abraza.
          </li>
          <li style={{ ["--a" as string]: "51%", ["--b" as string]: "100%" }}>
            <b>660–1300 ms</b> El punto cae bajo el alero, se aplasta al tocar (escala 1,16 × 0,82) y se asienta.
          </li>
          <li style={{ ["--a" as string]: "32%", ["--b" as string]: "98%" }}>
            <b>420 ms + 36 ms por letra</b> El nombre sube letra a letra, de un ligero desenfoque a nítido.
          </li>
        </ol>
        <p className={s.small}>
          Curvas compartidas en <code>src/lib/motion.ts</code> y <code>globals.css</code>: ease-out-expo (0,16, 1, 0,3, 1), ease-in-out (0,65, 0, 0,35, 1) y sello (0,3, 1,4, 0,5, 1). El logotipo vuelve a animarse al pasar el ratón por la cabecera y al cambiar de nombre en el pie.
        </p>
      </section>

      <section className="section wrap" aria-labelledby="h-luc">
        <div className={s.split}>
          <div>
            <p className={s.kicker}>Nombre alternativo</p>
            <h2 id="h-luc">lucero</h2>
            <p className={s.copy}>
              El lucero del alba es la luz que aparece <b>antes</b> de que amanezca: la mejor imagen de «nos anticipamos». Es también una palabra de cariño («mi lucero»), cercana como Alma, la agente que coordina. Y cuenta la historia de la portada 3: la noche en la que todo se ordena y la mañana que llega en calma.
            </p>
            <ul className={s.facts}>
              <li>
                <b>Concepto</b> el abrazo: sostener desde abajo una luz
              </li>
              <li>
                <b>Lema</b> Tu empresa amanece en orden.
              </li>
              <li>
                <b>Pruébalo</b> en el pie de la portada: «Probar otro nombre»
              </li>
            </ul>
          </div>
          <LogoStage brand="lucero" name="lucero" tone="ink" />
        </div>
        <Construction brand="lucero" />
        <Variants brand="lucero" name="lucero" />

        <h3 className={s.h3}>Comprobaciones (27-10-2026)</h3>
        <div className={s.checks}>
          <div>
            <h4>Dominios</h4>
            <ul>
              <li>
                <span className="tag ok">probablemente libres</span> holalucero.es · holalucero.com · lucero.legal
              </li>
              <li>
                <span className="tag warn">ocupados</span> lucero.com · lucero.es · lucero.io · lucero.app
              </li>
            </ul>
            <p className={s.small}>Comprobado por RDAP y DNS. «Probablemente libre» no es una reserva: hay que registrarlos para asegurarlos.</p>
          </div>
          <div>
            <h4>Otras marcas con el mismo nombre</h4>
            <ul>
              <li>lucero.ai, automatización de movilidad: otro sector</li>
              <li>Lucero, biotecnología en Suecia: otro sector</li>
              <li>Lucero Legal, abogados de extranjería en Buenos Aires: fuera de España</li>
            </ul>
            <p className={s.small}>Ninguna gestoría, asesoría fiscal ni fintech en España con ese nombre. Falta buscarlo en OEPM y EUIPO (clases 35, 36 y 45) antes de decidir.</p>
          </div>
          <div>
            <h4>Descartados por el camino</h4>
            <ul>
              <li>
                <b>cala</b>: cala.ai ya vende datos para agentes de IA; .com, .io, .app y .es ocupados; la RAE recoge otra acepción poco afortunada.
              </li>
              <li>
                <b>albor</b>: ya existe Albor Abogados (A Coruña). Una pena, porque es anagrama de «árbol», como una holding.
              </li>
              <li>
                <b>sosiego</b>: queda de reserva; sosiego.es parece libre, pero se acerca demasiado a «sereno».
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="h-app">
        <p className={s.kicker}>Aplicaciones</p>
        <h2 id="h-app">Imagen para compartir y favicon</h2>
        <p className="lede">La imagen Open Graph se genera en el build (1200 × 630) con las fuentes de la marca. Es lo que aparece al compartir el enlace en WhatsApp, LinkedIn o Slack.</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.og} src="/og.png" width={1200} height={630} alt="Imagen para compartir: Crear una holding nunca fue tan fácil" loading="lazy" />
        <div className={s.favicons}>
          {[16, 32, 64].map((z) => (
            <span key={z} className={s.favicon} style={{ width: z + 16, height: z + 16 }}>
              <LogoMark brand="resguardo" size={z} />
            </span>
          ))}
          <span className={`${s.favicon} ${s.app}`}>
            <LogoMark brand="resguardo" size={64} ink="#FDF9F4" />
          </span>
        </div>
      </section>
    </div>
  );
}
