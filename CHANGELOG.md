# Changelog — Recienllegue

## [Unreleased]

### 2026-04-17 (continuación)

#### Fix — aside "Tu punto de partida" con partículas visibles (inicio)

- `HomeDesktopAside` primer card: background cambiado de `rgba(22,56,50,0.07)` (casi transparente) a `#eef6f0` (opaco)
- Las partículas globales (z-index:0) eran visibles a través del fondo semitransparente del card
- Causa raíz: stacking context — contenido en z-index:1 no oculta elementos de z-index inferior si tiene bg transparente

#### Fix — hover en cards de acceso rápido (OnboardingSection)

- Eliminado `TiltCard` de las cards de `OnboardingSection` en `/app/inicio`
- Reemplazado por `<a>` plano con los mismos estilos de layout, sin efecto 3D ni glare
- Las cards de comercios destacados y remises conservan `TiltCard` (hover intencional)

#### Rediseño heroes — hospedajes, comercios, transportes, muro (2026-04-17)

- **Todos los heroes de sección**: fondo sólido `#163832` en lugar de `linear-gradient` — consistencia con `/app/inicio`
- **SVG decoration eliminado** de los 4 heroes — reemplazado por `<HeroParticles />` compartido
- **Texto explícito**: `color: '#daf1de'` (título), `'#b8e4bf'` (párrafo), `'#a8ddb5'` (kicker) — sin `opacity` inline
- **Stat boxes en asides**: `var(--surface-soft)` → `#eef6f0` (opaco) para evitar bleeding de partículas globales
- `HeroParticles` importado en: `hospedajes/page.tsx`, `comercios/page.tsx`, `transportes/page.tsx`, `muro/page.tsx`

---

### 2026-04-17

#### app/inicio — Rediseño UI + efectos 3D

**Nueva sección `OnboardingSection`**
- Tarjetas horizontales con scroll ("¿Qué podés hacer acá?") para usuarios nuevos
- Cada card explica una sección principal con emoji, pregunta directa y descripción
- Evita asumir que el usuario conoce la app

**Efectos 3D**
- Hook `useTilt` — mouse tracking con `requestAnimationFrame`, aplica `perspective + rotateX/Y + scale3d` en desktop
- Hook `useTouchTilt` — tilt sutil al arrastrar el dedo en mobile (sin WebGL, sin batería extra)
- Respeta `prefers-reduced-motion`
- Aplicado en: hero carousel, cards de onboarding, comercios destacados, card principal de remises

**Contraste y legibilidad**
- Texto secundario en hero: opacity 0.55 → 0.78 (supera WCAG AA en dark bg)
- Aside desktop: descripción más clara para usuarios sin cuenta
- Cards: sombras con más profundidad para separación visual
- Botones CTA en cada slide del carousel (acción clara, no solo decoración)

**Navegación**
- `AppSectionNav` agregado a inicio (igual que en /transportes, /comercios)
- Sección `QuickAccessSection` eliminada — era duplicado del nav
- Contador de slide en hero (1/3)

**UX general**
- `will-change: transform` en todos los elementos con tilt (compositing GPU)
- `transform: translateZ(0)` en wrapper del hero para evitar clipping en Chrome
- Transiciones suaves en retorno del tilt (`cubic-bezier(0.23,1,0.32,1)`)

#### Fix — hero blanco + tilt invisible (2026-04-17)

**Problema raíz**
- `transformStyle: preserve-3d` + `overflow: hidden` en el mismo div destruye el background en Safari/Chrome
- Sin efecto visual de luz el tilt era imperceptible

**Solución: componente `TiltCard`**
- Arquitectura wrapper/inner: el wrapper aplica `perspective + rotateX/Y`, el inner hace `overflow: hidden` con `border-radius`
- Glare overlay: `radial-gradient` que sigue el cursor/dedo — hace el efecto 3D claramente visible
- Touch-tilt mobile: 40% de la fuerza del desktop, con transición de retorno suave
- Respeta `prefers-reduced-motion`
- Un solo componente reutilizable para hero, onboarding cards, comercios y remis card
- Colores explícitos (`#163832` en lugar de `var(--accent)`) para garantizar render correcto

#### Hero — partículas 3D animadas + remoción del tilt (2026-04-17)

- Eliminado el tilt+glare del hero (mouse tracking y efecto de luz)
- Nuevo componente `HeroParticles` — canvas animado con figuras geométricas cayendo
  - 55 partículas con 6 formas: círculo, punto, línea, arco, cruz, triángulo
  - Profundidad 3D: las partículas del frente son más grandes, más opacas, caen más rápido
  - Velocidad y tamaño proporcional a `z` (0=fondo, 1=frente)
  - `ResizeObserver` para responsividad, cleanup correcto en unmount
  - Misma paleta mint (`#daf1de`) que las decoraciones SVG anteriores
- Hero restructurado: `div` con `background: #163832` garantiza fondo verde en todo el bloque
- Eliminadas `SvgSlide1/2/3` — reemplazadas por el canvas compartido

#### Global — partículas en todo el fondo de la app (2026-04-17)

- Nuevo `GlobalParticles` en `src/components/GlobalParticles.tsx`
- `position: fixed` — cubre todo el viewport detrás del contenido (z-index: 0)
- 70 partículas verde oscuro (`#163832`) muy sutiles sobre el fondo claro (`#f8faf8`)
- Mismas 6 formas que el hero: círculo, punto, línea, arco, cruz, triángulo
- Profundidad 3D por `z`: frente más grande, más opaco, cae más rápido
- Agregado en `app/layout.tsx` — wrapper de contenido en `z-index: 1` para estar encima
- Fix hero strip blanco: removido `display:flex/flex-direction:column` del outer — los slides determinan la altura directamente, sin `flex:1` que dependía de `minHeight` como height

#### Fix 2 — hero strip persistente + partículas más visibles (2026-04-17)

- Hero wrapper: `background: '#163832'` explícito para cubrir cualquier gap sub-pixel entre el wrapper y el carousel
- Hero div: `paddingBottom: 56` — los dots pasan a tener espacio real en el flujo (no flotan sobre el contenido y dejan blanco abajo)
- GlobalParticles: count 70 → 120, opacity 0.03–0.13 → 0.07–0.25, size 4–24 → 6–34, lineWidth 0.8 → 1.1
