/**
 * Datos globales del sitio. La URL pública se puede sobrescribir en el build
 * con NEXT_PUBLIC_SITE_URL (por ejemplo, al conectar un dominio propio).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://resguardo.lc-45e.workers.dev").replace(/\/$/, "");

export const SITE = {
  name: "resguardo",
  title: "resguardo: la gestoría y la abogada de tu grupo de empresas",
  shortTitle: "La gestoría y la abogada de tu grupo de empresas",
  description:
    "Gestoría y abogada fiscal para tu grupo de empresas, con agentes de IA que se anticipan a Hacienda. Crea tu holding, ordena facturas y consigue ayudas.",
  tagline: "Tus papeles, a resguardo.",
  locale: "es_ES",
  city: "Valencia",
  region: "Comunitat Valenciana",
  country: "ES",
  themeColor: "#FDF9F4",
  themeColorDark: "#1B1A18",
} as const;

/** Imagen para compartir (/og.png). */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_ALT = "resguardo. Crear una holding nunca fue tan fácil: la gestoría y la abogada de tu grupo de empresas.";

export const NAV_LINKS = [
  { href: "#empezar", label: "Empezar" },
  { href: "#equipo", label: "Equipo" },
  { href: "#correo", label: "Cómo trabaja" },
  { href: "#conectores", label: "Conectores" },
  { href: "#privacidad", label: "Seguridad" },
  { href: "#precio", label: "Precio" },
] as const;

/** Variantes de portada para comparar en revisión. Solo "/" se indexa. */
export const HERO_VARIANTS = [
  { href: "/", n: 1, label: "Directa", hint: "Diagnóstico en la portada" },
  { href: "/hero-2", n: 2, label: "Del caos a la calma", hint: "Historia con scroll" },
  { href: "/hero-3", n: 3, label: "La noche de Mariana", hint: "Historia humana" },
  { href: "/hero-4", n: 4, label: "El problema, tachado", hint: "Minimalista: empieza por el problema" },
] as const;

export type HeroVariant = (typeof HERO_VARIANTS)[number]["n"];
