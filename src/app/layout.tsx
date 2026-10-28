import type { Metadata, Viewport } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import localFont from "next/font/local";
import { BrandProvider } from "@/components/brand/BrandProvider";
import { THEME_SCRIPT } from "@/components/layout/ThemeToggle";
import { StartProvider } from "@/components/start/StartProvider";
import { OG_ALT, OG_SIZE, SITE, SITE_URL } from "@/content/site";
import "./globals.css";

/*
 * Newsreader variable con eje óptico (opsz) para los titulares: a tamaño de
 * cartel gana contraste y finura. Se precarga y entra con swap; next/font
 * genera un respaldo con métricas ajustadas para que el cambio no mueva el diseño.
 */
const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
});

/* La cursiva solo se usa en el logotipo y los sellos: una instancia estática de 26 KB. */
const serifItalic = localFont({
  src: [{ path: "../../node_modules/@fontsource/newsreader/files/newsreader-latin-600-italic.woff2", weight: "600", style: "italic" }],
  variable: "--font-serif-italic",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const sans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE.title,
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "gestoría online",
    "abogada fiscal",
    "crear una holding",
    "holding familiar",
    "grupo de empresas",
    "subvenciones para pymes",
    "notificaciones de Hacienda",
    "DEHú",
    "gestoría Valencia",
    "agentes de IA",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: "/og.png", ...OG_SIZE, alt: OG_ALT, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [{ url: "/og.png", alt: OG_ALT }],
  },
  icons: {
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
  category: "business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: SITE.themeColor },
    { media: "(prefers-color-scheme: dark)", color: SITE.themeColorDark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" data-theme="light" className={`${serif.variable} ${serifItalic.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <BrandProvider>
          <StartProvider>{children}</StartProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
