# CLAUDE.md — Rediseño frontend: Studio Fabián Díaz

## Objetivo

Rediseñar **solo el frontend** de este proyecto (hoy "Barbería El Vasco") para convertirlo en la web de **Fabián Díaz — Barbería & Estilismo Masculino / Maquillador**, Paso de los Libres, Corrientes (Instagram: `@studio_fabiandiaz`).

La experiencia tiene que ser una **landing de scroll moderna, visualmente impactante y adictiva** ("dopamínica"), que termina en el flujo de reserva de turnos que ya existe.

## Reglas inamovibles (NO tocar)

- **No modificar nada en `backend/`.** Ni endpoints, ni DTOs, ni migraciones, ni `.env`.
- **No cambiar la lógica funcional del frontend**: `src/services/api.js`, `src/utils/date.js`, `ProtectedRoute`, manejo de token (`elvasco_token`), llamadas a la API, estados del flujo de reserva (pasos 1–4), manejo del error 409 (horario ocupado), código de acceso, link `/mi-turno/:codigo`, generación del mensaje de WhatsApp.
- **No cambiar rutas**: `/`, `/mi-turno/:codigo`, `/admin/login`, `/admin/dashboard|horarios|servicios|finanzas`.
- Los contratos de datos se mantienen: `api.getServices()`, `api.getAvailableSlots(date, serviceId)`, `api.createBooking({ servicioId, nombreCliente, telefonoCliente, fecha, hora })`.
- No instalar librerías pesadas sin necesidad. Antes de agregar una dependencia, justificarla (ver sección Stack).
- Antes de cada cambio grande: `git status` limpio y trabajar en una rama `feat/rediseno-fabian`.

## Contexto del proyecto

- `frontend/`: React 19 + Vite 8 + react-router-dom 7 + vite-plugin-pwa. CSS plano (`src/index.css`, `src/App.css`, `src/styles/tokens.css`). JavaScript (`.jsx`).
- Páginas: `Booking.jsx` (pública, ruta `/`), `MyBooking.jsx`, `Admin*.jsx`.
- Componentes: `Button`, `Input`, `ProgressBar`, `ServiceListItem`, `TimeSlotPicker`, `AdminLayout`, `ProtectedRoute`.
- Variables de entorno: `VITE_API_URL`, `VITE_BARBERSHOP_NAME`, `VITE_WHATSAPP_NUMBER`.
- Hoy el tema es oscuro (`#111110`) con acento rojo (`#a63d2f`), tipografías Fraunces + Inter e imágenes de Unsplash.

## Identidad de marca (sacada de `@studio_fabiandiaz`)

Datos del perfil para usar en la web:

- Nombre: **Fabián Díaz** — "Barbería & Estilismo Masculino" · "Maquillador"
- Ubicación: **Paso de los Libres, Corrientes**
- Prueba social: **+70 clientes felices**
- Reservas por WhatsApp: `https://wa.me/message/LQ7AP3CDI4PRA1`
- Categorías de trabajo (destacados de IG): **Cortes**, **Cabellos**, **Makeup**
- Contexto: participa en eventos de barbería (ej. Barber Battle en Mercedes, Corrientes) → sección de "Comunidad / Eventos" opcional.
- Foto de perfil: Fabián con delantal oscuro, tatuajes, look barbero moderno.

Estilo visual observado:

- **Base negra / carbón**, muy oscura, premium y masculina.
- **Dorado / ámbar** como acento principal (los íconos de los destacados son negro + dorado: tijeras, silueta de cabello, "MAQUILLAJE").
- Fotografía de retratos con mucho contraste, fondos neutros y luz de estudio; cortes de cerca, antes/después, reels.
- Tipografía de cartelería **gruesa, expresiva, estilo pincel/graffiti** en los flyers (títulos grandes), combinada con texto limpio.
- Tono: cercano, argentino, profesional.

> Importante: no tenemos acceso a las fotos originales de Instagram desde el código. Dejar **placeholders bien armados** (carpeta `src/assets/gallery/`) y un archivo `src/data/gallery.js` para que el dueño cargue las fotos reales. No hotlinkear imágenes de Instagram.

## Dirección de diseño

### Paleta (actualizar `src/styles/tokens.css`)

```css
:root {
  --bg: #0a0a0a;
  --bg-alt: #141414;
  --surface: #1a1a1a;
  --text: #f5f1ea;
  --text-muted: #9c968c;
  --accent: #d4a24c;        /* dorado principal */
  --accent-strong: #f0c36b; /* hover / brillos */
  --accent-deep: #8a6a2a;   /* bordes y sombras doradas */
  --border: #2a2823;
  --font-display: 'Anton', 'Bebas Neue', Impact, sans-serif; /* títulos grandes */
  --font-script: 'Permanent Marker', cursive;                /* detalles tipo pincel, usar poco */
  --font-functional: 'Inter', Arial, sans-serif;
}
```

Ajustar `theme-color` de `index.html` y del manifest de `vite.config.js` al nuevo fondo, y actualizar nombre/`short_name` de la PWA a "Fabián Díaz". Mantener fuentes vía Google Fonts (ya se usa).

### Estructura de la landing (`/`), en orden de scroll

1. **Hero a pantalla completa**: nombre "FABIÁN DÍAZ" en tipografía display gigante, subtítulo "Barbería & Estilismo Masculino", foto/video de fondo con overlay oscuro, CTA dorado "Reservar turno" (scroll suave a la sección de reserva) y botón secundario WhatsApp. Indicador de scroll animado.
2. **Marquee infinito** (cinta dorada con texto: CORTES · BARBA · MAKEUP · ESTILISMO · +70 CLIENTES FELICES).
3. **Sobre Fabián**: foto + texto corto + contadores animados (ej. "+70 clientes felices").
4. **Servicios**: tarjetas grandes cargadas desde `api.getServices()` (nombre, duración, precio). Al tocar una, hace scroll al módulo de reserva con el servicio ya seleccionado. Mantener la lógica de selección actual.
5. **Galería de trabajos** por categorías (Cortes / Cabellos / Makeup): grilla tipo masonry o carrusel horizontal con scroll-snap, hover/tap con zoom, lightbox simple.
6. **Antes / Después** (slider de comparación arrastrable) — usar placeholders.
7. **Comunidad / Eventos** (opcional): bloque tipo flyer para eventos como el Barber Battle.
8. **Reservar turno**: el flujo de 3 pasos + confirmación actual (`Booking`), rediseñado como panel/card premium sticky, con la misma lógica. Barra de progreso dorada.
9. **Ubicación y contacto**: Paso de los Libres, Corrientes, horarios (si hay endpoint disponible usarlo; si no, texto estático configurable), botón WhatsApp, link a Instagram.
10. **Footer** minimalista.

Navbar fija translúcida (blur) con logo, anclas y botón "Reservar". En mobile: menú compacto y **botón flotante de WhatsApp/Reservar**.

### Movimiento y efectos "dopamínicos"

Priorizar CSS moderno y `IntersectionObserver`; sin librerías si se puede:

- Reveal al hacer scroll (fade + translateY + stagger) en cada sección.
- Parallax suave en el hero y en las imágenes.
- Títulos que se revelan por palabra/línea (clip / mask).
- Marquee infinito con `@keyframes`.
- Contadores que suben al entrar en viewport.
- Cursor/hover con brillo dorado en botones y tarjetas (desktop); feedback `:active` en mobile.
- Scroll suave (`scroll-behavior: smooth`) y `scroll-snap` donde tenga sentido.
- Micro-interacciones en el flujo de reserva: transición entre pasos, check animado al confirmar.
- Opcional: grano/ruido sutil sobre el fondo para look cinematográfico.
- **Respetar `prefers-reduced-motion`**: desactivar parallax y animaciones largas.

### Stack permitido

- Base: React + CSS propio. Se puede dividir `App.css` en archivos por componente/sección en `src/styles/`.
- Librería opcional, solo si aporta de verdad: `framer-motion` (animaciones de scroll) **o** `gsap` + `ScrollTrigger`. Elegir **una**, no ambas.
- Imágenes: formato `.webp`/`.avif`, `loading="lazy"`, `width/height` definidos para evitar layout shift.

## Estructura de archivos sugerida

```
frontend/src/
  pages/
    Booking.jsx            # se mantiene la lógica; se convierte en la landing completa
  components/
    landing/
      Navbar.jsx
      Hero.jsx
      Marquee.jsx
      About.jsx
      Services.jsx
      Gallery.jsx
      BeforeAfter.jsx
      Contact.jsx
      Footer.jsx
      FloatingCTA.jsx
    Reveal.jsx             # wrapper reutilizable de animación al scroll
  data/
    site.js                # nombre, bio, redes, WhatsApp, dirección, textos
    gallery.js             # listado de imágenes por categoría
  styles/
    tokens.css
    landing.css
```

Reglas de refactor: extraer el flujo de reserva a un componente (por ejemplo `BookingFlow.jsx`) **moviendo el código sin alterar su lógica**, y que `Booking.jsx` componga landing + `BookingFlow`.

## Admin y páginas secundarias

- `MyBooking`, `AdminLogin` y todo `/admin/*`: aplicar **solo el nuevo tema** (colores, tipografías, botones, inputs) vía tokens. No rediseñar su estructura ni lógica.
- Los gráficos de `recharts` en Finanzas deben seguir legibles con la nueva paleta (usar `--accent`).

## Contenido

- Idioma: español argentino (voseo: "Reservá", "Elegí", "Dejanos tus datos").
- Reemplazar toda mención a "El Vasco" por "Fabián Díaz" / "Studio Fabián Díaz" (textos, `<title>`, meta, manifest, `VITE_BARBERSHOP_NAME`, mensaje de WhatsApp).
- No inventar precios, horarios ni testimonios. Los servicios y precios vienen de la API. Lo que no se sepa, va en `src/data/site.js` marcado con `// TODO: confirmar con Fabián`.
- Mantener el mensaje de WhatsApp de confirmación con la misma estructura.

## Calidad

- **Mobile-first** (la mayoría del tráfico vendrá del Instagram en celular). Probar 360px, 390px, 768px y 1280px.
- Accesibilidad: contraste suficiente del dorado sobre negro, `alt` en imágenes, foco visible, botones con `aria-*` como hoy.
- Performance: Lighthouse móvil > 85; no bloquear render con fuentes ni imágenes grandes.
- `npm run lint` y `npm run build` (en `frontend/`) deben pasar sin errores.

## Comandos

```bash
cd frontend
npm install
npm run dev      # desarrollo
npm run lint     # oxlint
npm run build    # build de producción
```

El backend se levanta aparte (`backend/`, NestJS) y no se modifica.

## Forma de trabajo esperada

1. Leer el frontend actual y confirmar que entendés el flujo de reserva antes de tocar nada.
2. Proponer un plan corto por fases y esperar mi OK:
   - Fase 1: tokens, tipografías, navbar, hero, marquee.
   - Fase 2: secciones de contenido (sobre mí, servicios, galería, antes/después, contacto).
   - Fase 3: reserva integrada y rediseñada + confirmación.
   - Fase 4: tema en admin/MyBooking, pulido, performance, accesibilidad.
3. Hacer commits chicos por fase. Verificar con `npm run dev` y `npm run build` al final de cada una.
4. Si algo requiere tocar el backend o cambiar un contrato de la API, **frenar y avisar** en vez de hacerlo.
