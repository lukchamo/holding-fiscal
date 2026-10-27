/** Contenido estructurado de la landing (fuente única para la página y el JSON-LD). */

export const AGENTS = [
  { initial: "A", name: "Alma", color: "var(--ag-alma)", role: "Coordina y te entrevista", text: "Organiza el trabajo de los demás agentes y te hace las preguntas justas.", validates: "tu gestor" },
  { initial: "V", name: "Vera", color: "var(--ag-vera)", role: "Correo y facturas", text: "Lee cada correo, reconoce facturas y contratos y los lleva a su sitio.", validates: "tu gestor" },
  { initial: "N", name: "Nora", color: "var(--ag-nora)", role: "Hacienda y plazos", text: "Vigila la DEHú y la Seguridad Social y avisa antes de que venza nada.", validates: "la abogada" },
  { initial: "B", name: "Bruno", color: "var(--ag-bruno)", role: "Subvenciones", text: "Busca ayudas, redacta memorias y prepara las justificaciones.", validates: "la abogada" },
  { initial: "E", name: "Elio", color: "var(--ag-elio)", role: "Sociedades y holding", text: "Ordena tu estructura y prepara propuestas de holding para la abogada.", validates: "la abogada" },
] as const;

export const SERVICES = [
  "Constitución y holding",
  "Contabilidad e impuestos",
  "Notificaciones de Hacienda y Seguridad Social",
  "Requerimientos",
  "Subvenciones y justificaciones",
  "Finanzas del grupo",
] as const;

export const CONNECTORS = [
  { title: "Contabilidad y facturación", note: "Lo que ya usa tu gestoría, sin migrar nada.", items: [["Ho", "Holded"], ["AW", "a3 (Wolters Kluwer)"], ["Sa", "Sage"], ["Co", "Contasol"], ["Qu", "Quipu"], ["Od", "Odoo"]] },
  { title: "Bancos", note: "Conexión de solo lectura mediante PSD2.", items: [["Bb", "BBVA"], ["Sa", "Santander"], ["Ca", "CaixaBank"], ["Sa", "Sabadell"], ["Ba", "Bankinter"], ["Qo", "Qonto"], ["Re", "Revolut Business"]] },
  { title: "Gastos y tickets", note: "Tickets fotografiados y gastos conciliados.", items: [["Kl", "Klik"], ["Pl", "Pleo"], ["Pa", "Payhawk"]] },
  { title: "Nóminas y equipo", note: "Nóminas y altas enlazadas con la contabilidad.", items: [["Fa", "Factorial"], ["Se", "Sesame HR"], ["A3", "a3nom"]] },
  { title: "Firma y documentos", note: "Firmas con validez legal y documentos en su sitio.", items: [["Si", "Signaturit"], ["Do", "Docusign"], ["Go", "Google Drive"], ["On", "OneDrive"], ["Dr", "Dropbox"]] },
  { title: "Administración pública", note: "Con tu apoderamiento: notificaciones y certificados al día.", items: [["De", "DEHú"], ["Se", "Seguridad Social"], ["Ae", "AEAT"], ["Re", "Registro Mercantil"], ["Cl", "Cl@ve"]] },
  { title: "Subvenciones", note: "Convocatorias abiertas y las que vuelven cada año.", items: [["Fa", "Fandit"], ["Bd", "BDNS"]] },
  { title: "Ventas y comunicación", note: "Cobros, pedidos y conversaciones ordenados por sociedad.", items: [["St", "Stripe"], ["Sh", "Shopify"], ["Hu", "HubSpot"], ["Gm", "Gmail"], ["Ou", "Outlook"], ["Wh", "WhatsApp Business"]] },
] as const;

export const FAQ = [
  { q: "¿Tengo que cambiar de herramientas?", a: "No. Nos conectamos a tu correo, a tu contabilidad y a los buzones oficiales. Tu equipo sigue trabajando igual." },
  { q: "¿Quién firma lo que se presenta?", a: "Tú, con tu certificado digital o mediante apoderamiento. La abogada revisa cada borrador antes de que salga nada." },
  {
    q: "¿Puedo crear la holding sin ir al notario?",
    a: "La vía telemática con estatutos tipo sirve cuando el caso lo permite. Si la holding se forma aportando participaciones, hace falta una escritura a medida y la abogada la coordina con la notaría.",
  },
  { q: "¿Qué pasa cuando se acaba el crédito?", a: "Pagas una cuota por sociedad, sin permanencia: [PRECIO POR SOCIEDAD]." },
  { q: "¿Quién ve mis datos?", a: "Solo tu equipo, la abogada y quien tú autorices. [POLÍTICA DE DATOS Y ALOJAMIENTO]" },
] as const;

export const TRUST = [
  { title: "RGPD", text: "Cumplimos el Reglamento General de Protección de Datos. Tus datos son tuyos: puedes consultarlos, llevártelos o borrarlos." },
  { title: "Servidores en la UE", text: "Alojamos y procesamos tus datos en la Unión Europea, cifrados en tránsito y en reposo." },
  { title: "Reglamento europeo de IA", text: "Siempre sabes cuándo trabaja un agente, y una persona valida cada decisión antes de que salga." },
  { title: "Datos personales protegidos", text: "Detectamos y sustituimos nombres, DNI, IBAN, correos y teléfonos antes de que ningún modelo los procese." },
] as const;
