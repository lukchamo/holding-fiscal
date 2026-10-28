import { BrandName } from "@/components/brand/BrandProvider";
import { HoldingTree, Scrolly, Sheet, SheetStack } from "@/components/scrolly/Scrolly";
import f from "@/components/scrolly/Scrolly.module.css";

const Row = ({ k, v, className }: { k: string; v: React.ReactNode; className?: string }) => (
  <span className={`${f.shR} ${className ?? ""}`}>
    <span>{k}</span>
    <b>{v}</b>
  </span>
);

/** Del correo a la contabilidad: así viaja una factura por dentro. */
export function MailFlow() {
  return (
    <section id="correo" className="section" aria-labelledby="h-correo">
      <div className="wrap">
        <h2 id="h-correo">Del correo a la contabilidad, sin tocar nada</h2>
        <p className="lede">Baja despacio: así viaja una factura por dentro.</p>
        <Scrolly
          steps={[
            { title: "Llega a tu buzón", text: "Cada sociedad tiene su dirección. El proveedor envía la factura como siempre y nadie tiene que reenviarla." },
            { title: "Vera la lee", text: "Nuestra agente de correo abre el PDF y marca lo que importa: quién la emite, a quién va y cuánto suma." },
            { title: "Propone dónde va", text: "La asigna a Andino Foods, la clasifica como otros aprovisionamientos, comprueba que no esté repetida y que el IVA cuadre. Tu gestor lo aprueba con un clic." },
            { title: "La registra y la guarda", text: "Queda contabilizada en a3 y archivada en la bóveda del grupo, lista para justificar una ayuda si hace falta." },
          ]}
        >
          <SheetStack>
            <Sheet k={1}>
              <span className={f.shT}>Nuevo correo</span>
              <Row k="De" v="facturas@distribucioneslevante.es" />
              <Row
                k="Para"
                v={
                  <>
                    foods@andino.
                    <BrandName />
                    .io
                  </>
                }
              />
              <Row k="Asunto" v="Factura FA-2026-1182" />
              <Row k="Adjunto" v="FA-2026-1182.pdf" />
            </Sheet>
            <Sheet k={2}>
              <span className={f.shT}>Factura n.º FA-2026-1182</span>
              <span className={f.shR}>
                <span>Emisor</span>
                <b className={f.f}>Distribuciones Levante SL, B12345678</b>
              </span>
              <span className={f.shR}>
                <span>Cliente</span>
                <b className={`${f.f} ${f.d2}`}>Andino Foods SL</b>
              </span>
              <Row k="Concepto" v="Cajas de cartón para envíos" />
              <Row k="Base e IVA" v="410,00 € + 86,10 €" />
              <span className={f.shR}>
                <span>Total</span>
                <b className={`${f.f} ${f.d3}`}>496,10 €</b>
              </span>
            </Sheet>
            <Sheet k={3}>
              <span className={f.shT}>Lo que propone Vera</span>
              <Row className={`${f.appear} ${f.a1}`} k="Sociedad" v="Andino Foods SL" />
              <Row className={`${f.appear} ${f.a2}`} k="Cuenta" v="602, otros aprovisionamientos" />
              <Row className={`${f.appear} ${f.a3}`} k="¿Repetida?" v="No" />
              <Row className={`${f.appear} ${f.a4}`} k="¿Cuadra el IVA?" v="Sí, 21 % de 410 son 86,10" />
            </Sheet>
            <Sheet k={4}>
              <span className={f.shT}>Bóveda del grupo</span>
              <span className={f.path}>Andino Foods SL, Facturas recibidas, 2026</span>
              <Row k="FA-2026-1182.pdf" v="496,10 €" />
              <Row k="Contabilidad" v="Registrada en a3" />
              <span className={f.stamp}>Registrada</span>
            </Sheet>
          </SheetStack>
        </Scrolly>
      </div>
    </section>
  );
}

/** Así se crea tu holding: la estructura se dibuja a medida que bajas. */
export function HoldingFlow() {
  return (
    <section id="holding" className="section" aria-labelledby="h-holding">
      <div className="wrap">
        <h2 id="h-holding">Así se crea tu holding</h2>
        <p className="lede">La estructura se dibuja a medida que bajas.</p>
        <Scrolly
          steps={[
            { title: "Lo que tienes hoy", text: "Dos sociedades, cada una al 100 % de Mariana, sin nada que las una." },
            { title: "Elio propone la estructura", text: "Una holding por encima: Mariana aporta sus participaciones y controla las dos sociedades desde una sola." },
            { title: "Comprobamos la sustancia", text: "Una holding vacía es un riesgo ante Hacienda. Definimos qué medios y qué decisiones tendrá de verdad." },
            { title: "La abogada firma", text: "Revisa la operación y su régimen fiscal y coordina la escritura con la notaría. Tú solo firmas." },
          ]}
        >
          <HoldingTree />
        </Scrolly>
      </div>
    </section>
  );
}

/** Del café a la subvención: una conversación y un expediente que se escribe solo. */
export function GrantFlow() {
  return (
    <section id="subvencion" className="section" aria-labelledby="h-sub">
      <div className="wrap">
        <h2 id="h-sub">Del café a la subvención</h2>
        <p className="lede">
          Una conversación y un expediente que se escribe solo. <a href="https://claude.ai/artifact/RuHqWdysTskibbk6jgY7or">Ver la demo completa</a>
        </p>
        <Scrolly
          steps={[
            { title: "Escuchamos", text: "Grabamos la conversación con tu permiso. El agente marca lo que se puede financiar." },
            { title: "Bruno encuentra la ayuda", text: "Cruza tus proyectos con las convocatorias abiertas y te dice por qué encaja cada una." },
            { title: "Escribimos la memoria", text: "Redacta con lo que contaste y la puntúa como lo haría el evaluador." },
            { title: "La justificamos después", text: "Las facturas del proyecto ya están clasificadas, así que la cuenta justificativa sale sola." },
          ]}
        >
          <SheetStack>
            <Sheet k={1}>
              <span className={f.shT}>Café con Mariana</span>
              <span className={f.shR}>
                <span>08:15</span>
                <b className={f.f}>Queremos montar un obrador nuevo</b>
              </span>
              <span className={f.shR}>
                <span>08:22</span>
                <b className={`${f.f} ${f.d2}`}>La maquinaria sale por 180.000 €</b>
              </span>
              <span className={f.shR}>
                <span>11:02</span>
                <b className={`${f.f} ${f.d3}`}>Necesito contratar a tres personas</b>
              </span>
              <Row k="15:20" v="Compramos a proveedores de Valencia" />
            </Sheet>
            <Sheet k={2}>
              <span className={f.shT}>Ayuda a la inversión productiva de pymes</span>
              <span className={f.path}>Proyecto: obrador nuevo de Andino Foods</span>
              <div className="fit">
                <span>Encaje 86 %</span>
                <span className="fitbar">
                  <span />
                </span>
              </div>
              <Row className={`${f.appear} ${f.a2}`} k="Importe posible" v="Hasta 54.000 €" />
              <Row className={`${f.appear} ${f.a3}`} k="Por qué encaja" v="Pyme, maquinaria, Comunitat Valenciana" />
            </Sheet>
            <Sheet k={3}>
              <span className={f.shT}>Memoria técnica</span>
              <span className={f.path}>3. Descripción del proyecto</span>
              <span className={f.mline} style={{ width: "96%", transitionDelay: ".2s" }} />
              <span className={f.mline} style={{ width: "88%", transitionDelay: ".6s" }} />
              <span className={f.mline} style={{ width: "92%", transitionDelay: "1s" }} />
              <span className={f.mline} style={{ width: "70%", transitionDelay: "1.4s" }} />
              <Row className={`${f.appear} ${f.a4}`} k="Puntuación estimada" v="30 de 40" />
            </Sheet>
            <Sheet k={4}>
              <span className={f.shT}>Cuenta justificativa</span>
              <Row className={`${f.appear} ${f.a1}`} k="Facturas ligadas al proyecto" v="12" />
              <Row className={`${f.appear} ${f.a2}`} k="Gasto justificado" v="180.000 €" />
              <Row className={`${f.appear} ${f.a3}`} k="Revisión" v="Abogada, visto bueno" />
              <span className={f.stamp}>Lista</span>
            </Sheet>
          </SheetStack>
        </Scrolly>
      </div>
    </section>
  );
}
