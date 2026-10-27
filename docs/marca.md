# Marca: logotipo y nombre alternativo

Puedes verlo en vivo en https://resguardo.lc-45e.workers.dev/marca

## Concepto: «el abrazo»

Un trazo de tinta, que somos nosotros, cuida de un punto ámbar, que eres tú y tu empresa. El sistema es el mismo para la marca principal y para la alternativa. Solo cambia la forma del abrazo:

| | resguardo | lucero |
|---|---|---|
| Gesto | **proteger desde arriba**: la «r» alarga el hombro y se convierte en un alero | **sostener desde abajo**: una «u», como unas manos, sostiene una luz |
| Punto ámbar | tú y tu empresa, a cubierto | la primera luz del día (el lucero del alba) |
| Lema | Tus papeles, a resguardo. | Tu empresa amanece en orden. |

Geometría en `src/components/brand/brands.ts` (`MARK_GEOMETRY`): retícula de 32 × 32, trazo de 3,4, terminaciones redondas, ámbar `#F67748` y tinta `#2D2F34`. El símbolo se lee a 16 px. El favicon (`src/app/icon.svg`) cambia la tinta a papel en modo oscuro.

El símbolo anterior del prototipo era un documento con un tic: correcto, pero genérico en el sector.

## Animación del logotipo

Va en CSS (`Logo.module.css`), así que funciona antes de que cargue el JavaScript:

1. **0–280 ms:** el fuste se dibuja de abajo arriba (ease-in-out).
2. **200–960 ms:** el alero se despliega con desaceleración exponencial (ease-out-expo).
3. **660–1300 ms:** el punto cae, se aplasta al tocar (1,16 × 0,82) y se asienta. En *lucero*, la luz sube desde el fondo de las manos y destella.
4. **420 ms + 36 ms por letra:** el nombre sube letra a letra, de un ligero desenfoque a nítido.

El logotipo se reproduce al cargar, al cambiar de nombre y al pasar el ratón por la cabecera (como mucho una vez cada 1,5 s). Con «reducir movimiento» aparece completo y quieto. En las portadas 2 y 3, el mismo arco reaparece a gran escala: abraza el resumen final («Todo en orden») y es la bóveda por la que la luna se pone y sale el sol.

## Nombre alternativo: **lucero**

**Por qué:**
- El lucero del alba es la luz que aparece *antes* de que amanezca: la mejor imagen de «nos anticipamos», la promesa diferencial frente a otras gestorías online. Según el benchmark, TaxDown ya usa «Hacienda ya no es cosa tuya».
- Es una palabra de cariño («mi lucero»), cálida y cercana, de la misma familia que *Alma*, la agente que coordina.
- Cuenta la historia de la portada 3: la noche en la que todo se ordena y la mañana que llega en calma.
- Corta (tres sílabas), sin tildes y fácil de pronunciar también fuera de España.

**Comprobaciones (27-10-2026):**

| Dominio | Estado |
|---|---|
| holalucero.es, holalucero.com, lucero.legal | probablemente libres (RDAP 404 + sin DNS) |
| lucero.com, lucero.es, lucero.io, lucero.app | ocupados |

«Probablemente libre» no es una reserva: hay que registrarlos para asegurarlos. Para .es no hay RDAP público, así que solo se comprobó el DNS.

Otras marcas con ese nombre: lucero.ai (automatización de movilidad), Lucero (biotecnología, Suecia) y Lucero Legal (extranjería, Buenos Aires). Ninguna es gestoría, asesoría fiscal ni fintech en España. También existe la cantante mexicana Lucero: para posicionar la marca en LatAm conviene acompañarla de una palabra («lucero fiscal», «hola lucero»).

**Pendiente antes de decidir:** buscar la marca en OEPM y EUIPO (clases 35, 36 y 45).

### Descartados por el camino

- **cala**: Cala (cala.ai) ya vende «datos verificados para agentes de IA», incluidos datos financieros y judiciales; cala.com, .io, .app y .es están ocupados; y la RAE recoge también la acepción «supositorio laxante». Fuente: benchmark del 27-10-2026.
- **albor**: ya existe Albor Abogados (A Coruña), además de Albor Capital. Una pena, porque es anagrama de «árbol», como una holding.
- **sosiego**: queda de reserva. sosiego.es, .io y .app parecen libres, pero el significado se solapa con *sereno*, que ya está en estudio.

## Imagen para compartir (Open Graph)

`/og.png` (1200 × 630) se genera en el build con `next/og` y las fuentes de la marca (`src/lib/og/OgImage.tsx`). Incluye el titular «Crear una holding nunca fue tan fácil.» con el trazo a mano, el subtítulo, las etiquetas y la factura con el sello V.º B.º. Se sirve como `image/png` real, que es lo que necesitan WhatsApp, LinkedIn, Slack y X.
