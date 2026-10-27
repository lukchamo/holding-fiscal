import { FAQ, SERVICES } from "@/content/data";
import { SITE, SITE_URL } from "@/content/site";

/**
 * Datos estructurados (schema.org). Solo hechos verificables: sin dirección
 * postal ni precios mientras sigan pendientes en el prototipo.
 */
export function JsonLd() {
  const org = `${SITE_URL}/#organizacion`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: SITE.name,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        slogan: SITE.tagline,
        description: SITE.description,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#web`,
        url: SITE_URL,
        name: SITE.name,
        inLanguage: "es-ES",
        publisher: { "@id": org },
      },
      {
        "@type": ["ProfessionalService", "AccountingService", "LegalService"],
        "@id": `${SITE_URL}/#servicio`,
        name: `${SITE.name}, gestoría y abogada fiscal para grupos de empresas`,
        url: SITE_URL,
        image: `${SITE_URL}/og.png`,
        description: SITE.description,
        parentOrganization: { "@id": org },
        areaServed: { "@type": "Country", name: "España" },
        address: { "@type": "PostalAddress", addressLocality: SITE.city, addressRegion: SITE.region, addressCountry: SITE.country },
        knowsLanguage: ["es"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios",
          itemListElement: SERVICES.map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQ.filter((f) => !f.a.includes("[")).map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}
