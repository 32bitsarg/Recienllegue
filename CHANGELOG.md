# Changelog

Todas las mejoras relevantes del producto se documentan acá con una versión identificable.

## v0.9.0 - Hipatia

### Data Quality and SEO Growth

### Calidad de datos

- Estado visible de calidad en fichas:
  - `Dato confirmado`
  - `Dato publicado`
  - `Pendiente de revisión`
- Última actualización visible en fichas y cards.
- Conteo público de reportes pendientes y resueltos.
- CTA más fuerte de ownership:
  - reclamar comercio
  - sumar hospedaje

### SEO y crecimiento

- Interlinking fuerte entre:
  - landings
  - fichas
  - mapa
  - app
- JSON-LD agregado:
  - `FAQPage`
  - `BreadcrumbList`
  - `LocalBusiness`
  - `LodgingBusiness`
- Nuevas landings por carreras, áreas y necesidades UNNOBA.

## v0.8.0 - Euclides

### Academic and Commerce Landing Expansion

### Landings nuevas

- `/pergamino/carreras-unnoba-pergamino`
- `/pergamino/informatica-unnoba-pergamino`
- `/pergamino/ingenieria-unnoba-pergamino`
- `/pergamino/diseno-unnoba-pergamino`
- `/pergamino/economicas-unnoba-pergamino`
- `/pergamino/juridicas-unnoba-pergamino`
- `/pergamino/salud-unnoba-pergamino`
- `/pergamino/agronomia-alimentos-genetica-unnoba-pergamino`
- `/pergamino/taller-articulacion-unnoba-pergamino`
- `/pergamino/kioscos-cerca-unnoba`
- `/pergamino/panaderias-pergamino`
- `/pergamino/farmacias-pergamino`

### Enfoque

- Contexto académico oficial de UNNOBA convertido en guías prácticas para llegar a Pergamino.
- Mejora del cluster SEO por carrera + necesidad.

## v0.7.0 - Arquímedes

### Internal Detail Pages and Better Maps

### Fichas internas

- Nuevas rutas internas:
  - `/app/comercios/[id]`
  - `/app/hospedajes/[id]`
- El flujo mobile mantiene el bottom nav dentro de la app.

### Fichas públicas e internas

- Rediseño de fichas con:
  - hero más completo
  - mapa integrado
  - teléfono
  - ubicación
  - fotos
  - mejores CTA

### Mapas

- Reemplazo de iframe de Google por mapa propio con Leaflet/CARTO.
- Corrección de SSR con carga dinámica de Leaflet.
- Rediseño visual del mapa combinado con controles y ficha contextual.

## v0.6.0 - Aristóteles

### Favorites, Compare and Availability

### Estudiantes

- `/app/favoritos`
- favoritos para hospedajes y comercios
- comparador de hospedajes
- notas personales
- estados:
  - guardado
  - contacté
  - me respondió
  - descartado

### Hospedajes

- disponibilidad real:
  - disponible
  - ocupado
  - disponible pronto
- fecha estimada
- cupos
- última actualización
- filtro `Solo disponibles`
- CTA para alertas cuando vuelve disponibilidad

### Propietarios

- edición de disponibilidad desde panel propietario
- métricas de clicks y contactos

## v0.5.0 - Galeno

### Notifications and Owner Workflow

### Notificaciones

- push con Firebase Cloud Messaging
- registro de tokens
- notificaciones útiles dentro de la app

### Propietarios

- panel propietario
- reclamos de comercio
- cambios pendientes
- edición de datos
- subida de imágenes
- flujo de aprobación por admin

## v0.4.0 - Pitágoras

### Public Growth Pages and Listing Pages

### Público

- `/soy-propietario`
- páginas de crecimiento por ciudad/servicio
- fichas públicas de:
  - comercios
  - hospedajes
- sitemap corregido para `recienllegue.com`

### SEO

- nuevas páginas estáticas orientadas a búsquedas locales
- mejor estructura de títulos, descripciones y enlaces internos

## v0.3.0 - Sócrates

### PWA, Notifications and Mobile Improvements

- PWA con icono actualizado
- mejora de experiencia mobile
- flujos más claros en notificaciones
- base para alertas y recordatorios

## v0.2.0 - Platón

### Admin, Commerce and Housing Base

- paneles admin para:
  - comercios
  - hospedajes
  - notificaciones
  - reportes
- mejoras de fichas y carga inicial de datos

## v0.1.0 - Heráclito

### Initial Product Foundation

- estructura inicial de app
- inicio, mapa, comercios, hospedajes, muro, transporte y perfil
- base de experiencia para recién llegados a Pergamino
