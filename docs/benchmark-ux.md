# Benchmark de UX/UI y patrones aplicados

> Investigación del 27-10-2026 (webs revisadas en vivo). Sirvió para diseñar las portadas 2 y 3. Al final se indica cómo se aplicó cada patrón. El nombre «cala» se descartó tras este chequeo (ver `docs/marca.md`).


*Webs revisadas en vivo el 27-10-2026 (texto, HTML/JS y capturas). Lo que no pude comprobar va como «no verificado».*

## A. Servicios profesionales: IA + humanos

### 1. TaxDown — https://taxdown.es/
- **Hero:** «Tu equipo fiscal, todo el año.» y, al lado, una tarjeta con la foto de «Marta G., Fiscalista experta» y el CTA «Empezar ahora». Subtítulo: «Un fiscalista experto lleva tu caso y Luz, nuestra IA, acelera el proceso».
- **Motion:** chat guionizado entre Luz y el usuario, que se desactiva con `prefers-reduced-motion`. Carga GSAP con ScrollTrigger.
- **Confianza:** «Más de 300 asesores fiscales expertos» con avatares. Bajo el hero: «+2M declaraciones · 4,7★ (32K reseñas) · Colaborador Social de la Agencia Tributaria». También: «Nunca presentamos nada sin tu confirmación».
- **Conversión:** ocho tarjetas para elegir tu situación («Me ha escrito Hacienda»…).
- **Aplicar:** el chat dice «Preparo la respuesta y Marta, tu fiscalista, la revisa antes de enviarla». **Ojo:** su cierre, «Hacienda ya no es cosa tuya. Es cosa nuestra.», roza nuestra promesa; nos diferenciamos por *anticiparnos* y por las sociedades.

### 2. Lawhive — https://www.lawhive.co.uk/
- **Hero:** «Your modern law firm», con un campo libre «What can we help with?» que muestra ejemplos animados (p. ej. «resolving a dispute») y «Get a quote».
- **Humanos vs IA:** la home no nombra la IA. Enseña seis abogados con nombre, foto y especialidad, y «300+ trusted lawyers». Sin embargo, la empresa sí se presenta como plataforma con IA (https://tech.eu/2024/04/15/lawhive-raises-ps95m-for-ai-platform-for-lawyers/).
- **Confianza:** «30,000+ satisfied clients», Trustpilot y los sellos de la SRA y de Cyber Essentials.
- **Aplicar:** al cliente le presentamos personas; la IA es el «cómo».

### 3. Garfield.law — https://www.garfield.law/
- **Hero:** «Stop chasing, start recovering.», con «Authorised and regulated by the SRA.» ya en el subtítulo, y dos tarjetas-CTA según el caso.
- **Confianza:** según la SRA, que lo autorizó como primer despacho que trabaja mediante IA, «will only take a step where the client has approved it» y «named regulated solicitors will still ultimately be accountable» (https://www.sra.org.uk/news/news/releases/2025/garfield-ai-authorised/).
- **Conversión:** calculadora de costes con «Recovered if you win».
- **Aplicar:** ese mensaje es el nuestro, y hay que llevarlo al hero.

### 4. Pilot — https://pilot.com/
- **Hero:** «If you're buried in bookkeeping, who's leading the company?»
- **Humanos:** se define como «50/50 people and software» y presenta tres asesores con nombre, foto y cita.
- **Motion:** burbujas de chat que se suceden en bucle cada 5 s (GSAP), sin regla de *reduced motion* en su HTML.
- **Confianza y conversión:** «Trusted by 3,500+…», casos de clientes, «Explore what we do» / «Watch Demo» y guías gratuitas.
- **Aplicar:** un titular en forma de pregunta sobre el coste para el fundador.

### 5. Declarando — https://declarando.es/
- **Hero:** «El software con asesoría fiscal para autónomos», con «Empieza a ahorrar» / «Reserva una demo», una barra flotante «Habla con un experto» y «Te llamamos gratis».
- **Confianza:** «garantía antisanciones», sellos ISO y un «mentor» sin nombre ni cara.
- **Aplicar:** ya usan «Como una asesoría fiscal que nunca duerme» (ver patrón 7).

### 6. Doola — https://www.doola.com/
- **Hero:** tarjetas de estado en el visual (Form 5472 subiendo, LLC en trámite).
- **IA/humanos:** un «AI Co-Founder» que «Never Clocks Out» junto a «Real experts guiding every step», pero sin caras.
- **Conversión:** «100% Guaranteed Formation or Your Money Back», un quiz de 2 preguntas para elegir plan y Trustpilot 4.5/5.
- **Aplicar:** tarjetas de estado para el montaje del holding.

### 7. Stripe Atlas — https://stripe.com/atlas
- **Hero:** una mini-demo animada que pasa por «Available», «Starting company» y «Your company is ready», con los datos de la sociedad.
- **Proceso:** cuatro pasos numerados y «Incorporate in one business day».
- **Confianza y conversión:** «170,000+ founders», el aviso «not a law firm» y el precio anclado: «$500» frente a «over $50,000 in discounts».
- **Aplicar:** simular en el hero cómo queda montada tu holding.

## B. Storytelling con scroll y motion

### 8. Mercury — https://mercury.com/
- **Hero:** «Radically different banking», con email y «Open account», más «Launch demo» (demo del panel). El primer fotograma es un escritorio en una colina con niebla al amanecer.
- **Técnica (verificada en su JS):** contenedor de 250vh con la escena en `sticky`; el scroll mueve `video.currentTime` (`hero-scrub-*.mp4`). A partir de 1,5 pantallas el hero queda «completado» y se colapsa a 100vh. Si el vídeo falla en móvil, se salta.
- **Accesibilidad:** con *reduced motion* se muestra una sola pantalla con imagen fija.
- **Confianza:** el aviso legal («not an FDIC-insured bank») aparece dentro del propio hero.
- **Aplicar:** es el modelo técnico para «del caos a la calma».

### 9. Ramp — https://ramp.com/
- **Hero:** «Time is money. Save both.», con email. La ilustración muestra documentos con «MATCHING TO P.O.» y «SCANNING FOR FRAUD».
- **Motion:** franja «AGENTS AT WORK TODAY» con contadores animados (NumberFlow).
- **Conversión:** recomendaciones a partir de la URL de tu empresa y calculadoras de ahorro.
- **Aplicar:** un contador del trabajo de los agentes, solo con datos reales.

### 10. Linear — https://linear.app/
- **Hero:** «The product development system for teams and agents». La propia interfaz muestra un historial mixto: «Triage Intelligence added the labels… · 2min ago».
- **Motion y confianza:** figuras «Fig 0.1–0.3» con rejillas de puntos animadas por CSS, y «Linear powers over 40,000 product teams».
- **Aplicar:** una «bitácora nocturna» con hora, actor y acción.

### 11. Qonto (España) — https://qonto.com/es
- **Hero:** un móvil en el que se pide «Crea una factura para García & Asociados 4.200 €», con Trustpilot 4,7 sobre el H1.
- **Motion:** «Qonto AI. Tus reglas. Tus decisiones.», con pasos que avanzan solos cada 6 s y barra de progreso.
- **Confianza:** «Regulados por el Banco de España» e ISO 27001.
- **Aplicar:** dejar claro que el usuario controla a los agentes y mostrar el progreso.

## Patrones que aplicamos

1. **Una metáfora con scroll *scrubbed* y recorrido corto.** El hero se fija (~250vh), el progreso del scroll mueve los fotogramas (papeles → orden) y se completa una vez. *Fuente: Mercury.*
2. **Fotograma final como alternativa.** Con `prefers-reduced-motion` o si el vídeo falla, se ve el estado «calma» fijo. *Fuentes: Mercury, TaxDown, WCAG 2.3.3 (https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).*
3. **Saltar la historia.** Un enlace «Saltar la historia» (propuesta nuestra; Mercury lo hace con estados internos). Los bucles de más de 5 s necesitan pausa (WCAG 2.2.2: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html; Pilot es el contraejemplo).
4. **La persona aparece al aprobar.** Foto, nombre y rol junto al CTA y en el clímax del relato: «la IA prepara, [nombre] revisa y firma». *Fuentes: TaxDown, Pilot, Lawhive.*
5. **«Nada sale sin tu OK».** Control humano explícito y un responsable con nombre. *Fuentes: SRA/Garfield, TaxDown, Qonto.*
6. **La regulación, arriba.** Colegiación, colaborador social de la AEAT (si aplica) y datos en la UE, en el subtítulo. *Fuentes: Garfield, TaxDown, Mercury, Qonto.*
7. **Noche → mañana sin «nunca dormimos».** Ese mensaje ya lo usan Declarando, Doola y Ramp. Contamos la noche como bitácora y cerramos con el visto bueno humano por la mañana. *Fuentes: Linear, Ramp.*
8. **El usuario elige su caso.** Tarjetas como «Tengo varias sociedades», «Quiero montar un holding» o «Me ha llegado una notificación», más un campo libre. *Fuentes: TaxDown, Garfield, Lawhive.*
9. **Progreso visible.** Pasos numerados en las secciones fijadas y en el holding. *Fuentes: Qonto, Stripe Atlas.*
10. **Solo cifras verificables.** Contadores únicamente con datos reales y fechados. *Fuentes: Ramp; TaxDown, que matiza su «90%» en nota al pie.*

## Chequeo del nombre «cala» (descartado)

**Veredicto:** en España el nombre funciona por significado, pero es arriesgado como marca única: choca con Cala (cala.ai, IA y datos financieros y legales), se pierde en los buscadores y tiene .com, .io y .app ocupados. Si se mantiene, mejor como compuesto (holacala, calafiscal) y después de buscar en OEPM/EUIPO.

**Conflictos**
- **Cala** (https://www.cala.ai/) — riesgo alto: «At Cala we verify data… The preferred data layer for agents», con datos financieros y judiciales. La sociedad es Kosmos AI, Inc., de Delaware (https://www.cala.ai/terms). El Referente atribuye la fundación de una «Cala AI» a la española Elisenda Bou-Balust (https://elreferente.es/actualidad/las-mujeres-que-estan-cambiando-el-ecosistema/); probablemente es la misma (no verificado).
- **CALA, Citizens Against Lawsuit Abuse** (EE. UU., reforma legal), dueña de cala.com: https://cala.com
- **Asesoría Fiscal La Cala SL** (Mijas): https://www.einforma.com/informacion-empresa/asesoria-fiscal-cala
- **Marcas registradas:** no verificado (TMview no respondió).
- **SEO:** «cala» es un nombre común (playas, el municipio de Cala…).

**Dominios (RDAP + DNS, 27-10-2026)**

| Dominio | Estado |
|---|---|
| cala.com | Registrado desde 1995 (https://rdap.verisign.com/com/v1/domain/cala.com) |
| cala.io | Registrado, aparcado en GoDaddy/Afternic |
| cala.app | Registrado, aparcado (https://pubapi.registry.google/rdap/domain/cala.app) |
| somoscala.com | Registrado (tienda chilena «Somos Cala») |
| holacala.com | Probablemente libre (RDAP 404 + NXDOMAIN) |
| calafiscal.com | Probablemente libre (RDAP 404 + NXDOMAIN) |
| cala.legal | Probablemente libre; puede ser premium (no verificado) |
| holacala.es | Probablemente libre, no verificado (sin RDAP; NXDOMAIN) |
| cala.es | Registrado (Ayuntamiento de Cala, Huelva) |

**Significados**
- **ES:** «ensenada pequeña» y la flor, pero también «supositorio laxante» y, coloquialmente, «peseta» (https://dle.rae.es/cala). Riesgo bajo.
- **CA/VAL:** «entrada que fa el mar a la costa» (https://www.avl.gva.es/lexicval/?paraula=cala). Es positivo.
- **PT:** forma de «calar» («Não falar»), así que «cala!» equivale a «¡calla!» (https://dicionario.priberam.org/calar).
- **IT:** además de cala, es una forma de «calare» («to drop», «decrease») (https://en.wiktionary.org/wiki/calare). Riesgo bajo-medio en finanzas.
- **EN:** sin significado común. **Galés:** «cala» = pene (https://en.wiktionary.org/wiki/cala).

## Cómo se aplicó en esta versión

| Patrón | Dónde |
|---|---|
| 1. Una metáfora con scroll *scrubbed* y recorrido corto | Portada 2: un solo recorrido papeles → pilas → firma → calma (4 capítulos, unos 4 altos de pantalla). |
| 2. Fotograma final como alternativa | Con `prefers-reduced-motion`, ambas historias muestran el estado final y todos los textos, sin pista larga. La portada 5 no avanza sola y muestra cada pestaña ya resuelta. |
| 3. Saltar la historia | Enlace «Saltar la historia» en el raíl, que también permite saltar a cada capítulo; nada de bucles largos sin control. |
| 4. La persona aparece al aprobar | Portada 2: la abogada y el gestor entran justo cuando caen los V.º B.º. Portada 3: la abogada revisa con el primer café; el mensaje final dice «Revisado por tu abogada a las 07:52». Portada 5: en cada pestaña, cuando las tareas pasan a «Hecho», la tarjeta de la abogada estampa el V.º B.º. |
| 5. «Nada sale sin tu OK» | Textos: «Nada sale sin una persona detrás, y sin tu permiso», «Tú solo firmas». |
| 6. La regulación, arriba | Línea de confianza en el cierre de cada historia: «RGPD · Datos en la UE · Una persona firma cada paso». Solo afirmaciones que ya hacía el prototipo; no se añadió ninguna acreditación sin verificar. |
| 7. Noche → mañana sin «nunca dormimos» | Portada 3: la noche es una bitácora con hora, agente y acción, y se cierra con el visto bueno humano. |
| 8. El usuario elige su caso | Portada 1 (tarjeta de inicio), portada 4 («¿Por dónde empezamos?»: cuatro problemas que abren la entrevista con esa respuesta ya dada) y la entrevista con Alma («¿Qué te quita el sueño?»). |
| 9. Progreso visible | Raíl de capítulos en las historias e indicador de pasos en los scrollytelling de móvil. |
| 10. Solo cifras verificables | Las cifras son del caso ilustrativo y se marcan así («Historia ilustrativa con datos de ejemplo»). No hay contadores de clientes inventados. |
| Titular que nombra el problema (Pilot) | Portada 4: «Tres sociedades. Dos gestorías. Ningún plan.», con la corrección de la abogada (tachado, nota y V.º B.º) en lugar de una ilustración. |
| Producto en el hero con selector segmentado (referencia: plataforma para agencias) | Portada 5: panel de la plataforma con cuatro pestañas, una por agente, que avanzan solas con barra de progreso; tarjetas que sobresalen del marco (el aviso del agente y la firma de la abogada). Se pausa al pasar el ratón, al elegir pestaña o fuera de pantalla, y tiene botón de pausa. |
| Correo + CTA y anotaciones manuscritas (referencia: sync.ai) | Portada 5: correo con «Empezar gratis», línea de privacidad con escudo («Tus datos personales nunca llegan a la IA · Servidores en la UE») y dos notas a mano con flecha: «los agentes proponen» señala a los agentes de la barra lateral y «tu abogada firma», al sello «Revisado por tu abogada». |
