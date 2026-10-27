# resguardo · landing

La gestoría y la abogada de tu grupo de empresas: agentes de IA que se anticipan a Hacienda y personas que revisan y firman.
Esta es la versión en producción del prototipo, construida con **Next.js 16** y desplegada en **Cloudflare**.

- **Producción:** https://resguardo.lc-45e.workers.dev
- **Portada 1 · Directa** (la que se indexa): https://resguardo.lc-45e.workers.dev/
- **Portada 2 · Del caos a la calma:** https://resguardo.lc-45e.workers.dev/hero-2
- **Portada 3 · La noche de Mariana:** https://resguardo.lc-45e.workers.dev/hero-3
- **Propuesta de marca y logotipo:** https://resguardo.lc-45e.workers.dev/marca
- **Probar el nombre alternativo:** https://resguardo.lc-45e.workers.dev/#lucero

> Prototipo con datos de ejemplo (Andino Foods, Mariana Ortega). Quedan marcadores del prototipo original por completar: `[Nombre de la abogada]`, `[Nombre del gestor]`, `[PRECIO POR SOCIEDAD]`, `[DIRECCIÓN DE LA OFICINA]` y `[POLÍTICA DE DATOS Y ALOJAMIENTO]`.

## Qué hay

| | |
|---|---|
| **Portada 1** | El prototipo tal cual: diagnóstico en la propia portada, papeles que entran en abanico y sello V.º B.º. |
| **Portada 2** | *Del caos a la calma.* Doce papeles reales de una pyme pasan del desorden a pilas ordenadas por cinco agentes; la abogada y el gestor firman (V.º B.º); todo acaba bajo el símbolo de la marca. Un «medidor de preocupación» se aplana con el scroll. |
| **Portada 3** | *La noche de Mariana.* Historia humana contada con un reloj que avanza con el scroll (23:47 → 08:15): cielo de la noche al amanecer, una bitácora nocturna de los agentes (hora, agente y acción) y el visto bueno de la abogada con el primer café. |
| **Resto de la página** | Igual en las tres: entrevista con Alma y diagnóstico en directo, videollamada o café, equipo y agentes, tres scrollytelling (correo, holding y subvención), conectores, privacidad (seudonimización paso a paso), precio y preguntas frecuentes. |
| **Marca** | Símbolo nuevo animado («el abrazo»), nombre alternativo **lucero** y selector de nombre en el pie. Detalle en [`docs/marca.md`](docs/marca.md). |

El pie incluye «Probar otro nombre» y «Probar otra portada»; en escritorio hay además un selector flotante 1 · 2 · 3.

## Stack

- **Next.js 16.4** (App Router, Turbopack, React 19.3 con React Compiler) en **export estático** (`output: "export"`).
- **Cloudflare Workers Static Assets**: el HTML prerenderizado se sirve desde la red de Cloudflare, sin servidor ni arranques en frío.
- **Motion 14** solo en las portadas 2 y 3 (scroll suavizado, transformaciones ligadas al scroll). La portada 1 no lo carga.
- **CSS Modules** con tokens de diseño en `globals.css` (claro y oscuro), sin dependencias de UI.
- **next/font**: Public Sans (variable) y Newsreader (variable con eje óptico para titulares, y una cursiva estática de 26 KB para el logotipo).

## Estructura

```
src/
  app/                    rutas: /, /hero-2, /hero-3, /marca, 404
    og.png/route.tsx      imagen para compartir (1200 × 630) como .png real
    apple-touch-icon.png/ favicon.ico/   iconos generados en el build
    icon.svg              favicon vectorial (se adapta al modo oscuro)
    sitemap.ts robots.ts manifest.ts
  components/
    LandingPage.tsx       página común; recibe la portada
    hero/                 HeroClassic (1) · chaos/ (2) · night/ (3)
    story/                motor de storytelling: useStory, capítulos, raíl, escenario escalable
    start/                entrevista con Alma, diagnóstico en directo, agenda
    scrolly/              scrollytelling por pasos (correo, holding, subvención)
    sections/             equipo, conectores, privacidad, precio, FAQ…
    brand/                marcas, logotipo animado, selector de nombre
    brandbook/            página /marca
  content/                textos y datos (una sola fuente para la página y el JSON-LD)
  lib/                    curvas de movimiento, JSON-LD, generación de imágenes, tema
```

## Motor de storytelling y movimiento

- **Scroll nativo, sin scroll-jacking.** Pistas altas con un escenario `sticky`; solo se lee el progreso (`useScroll`), suavizado con un muelle (`src/lib/motion.ts`).
- **Una línea de tiempo por historia** (`chaosData.ts`, `nightData.ts`): cada elemento interpola posición, giro, escala y opacidad a partir de ese progreso. Solo se animan `transform` y `opacity`.
- **Composiciones de diseño fijas** (como en motion graphics): `FitStage` las escala al hueco disponible. La portada 2 tiene una composición para escritorio y otra para móvil.
- **Capítulos accesibles:** todo el texto está en el HTML (SEO y lectores de pantalla). Si el teclado enfoca un capítulo oculto, la historia salta a él. Hay un raíl de progreso clicable y un enlace «Saltar la historia».
- **Reducir movimiento:** con `prefers-reduced-motion` no hay pista larga y se ve el fotograma final con todos los textos.
- **Curvas compartidas** entre CSS y Motion: `ease-out-expo`, `ease-in-out` y `sello` (rebote del V.º B.º).

## SEO y rendimiento

- Metadatos completos (título, descripción, canonical, Open Graph, Twitter), `lang="es"`, JSON-LD (`Organization`, `WebSite`, `ProfessionalService`/`AccountingService`/`LegalService` y `FAQPage` solo con datos verificables), `sitemap.xml`, `robots.txt` y manifest.
- Las portadas 2 y 3 y `/marca` llevan `noindex`: solo se indexa `/`. Para cambiar la portada principal, usa otro componente de portada en `src/app/page.tsx`.
- `/og.png` se genera en el build con las fuentes de la marca y se sirve como `image/png` (el `opengraph-image` sin extensión de un export estático no siempre lo hace).
- Cabeceras de seguridad y caché en `public/_headers` (`/_next/static/*` inmutable).
- Hidratación por tramos con `<Suspense>` por sección. Se precargan ~184 KB de fuentes (antes ~306 KB): la cursiva del logotipo es una instancia estática de 26 KB. Todas usan `swap` con métricas de respaldo ajustadas, así que el cambio de fuente no mueve el diseño (CLS 0).

Lighthouse sobre producción (27-10-2026; rendimiento · accesibilidad · buenas prácticas · SEO):

| Página | Móvil | Escritorio |
|---|---|---|
| `/` | 91–93 · 100 · 100 · 100 (CLS 0) | 100 · 100 · 100 · 100 (CLS 0) |
| `/hero-2` | 88–91 · 100 · 100 · *noindex* | 100 · 100 · 100 · *noindex* |
| `/hero-3` | 87–88 · 100 · 100 · *noindex* | 100 · 100 · 100 · *noindex* |

En las variantes, Lighthouse marca el SEO como «no indexable» porque llevan `noindex` a propósito.

## Desarrollo

```bash
npm ci
npm run dev          # http://localhost:3000
npm run lint && npm run typecheck
npm run build        # genera ./out
npm start            # sirve ./out con wrangler dev (como en producción)
```

> Si tu shell tiene `NODE_ENV=development` exportado, compila con `NODE_ENV=production npm run build`. Con NODE_ENV en development, el prerender falla con `useContext` nulo.

## Despliegue en Cloudflare

Desde local (necesita `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en el entorno; cuenta CooWeb):

```bash
npm run deploy           # build + wrangler deploy → https://resguardo.lc-45e.workers.dev
npm run deploy:preview   # sube una versión de prueba sin promoverla
```

Con GitHub Actions (`.github/workflows/deploy.yml`): en cada PR se ejecutan lint, typecheck y build; en `main`, además, se despliega. Configura en el repositorio:

- Secretos `CLOUDFLARE_API_TOKEN` (permiso *Workers Scripts: Edit*) y `CLOUDFLARE_ACCOUNT_ID`. Sin ellos, el despliegue se omite con un aviso.
- Variable opcional `SITE_URL` para canonical, OG y sitemap cuando haya dominio propio (por defecto, la URL de workers.dev).

**Dominio propio:** en Cloudflare, *Workers & Pages → resguardo → Settings → Domains & Routes → Add custom domain*. Después define `SITE_URL` (o `NEXT_PUBLIC_SITE_URL` en local) y vuelve a desplegar.
