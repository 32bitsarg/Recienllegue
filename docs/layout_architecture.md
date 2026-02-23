# Arquitectura de Layouts: Mobile vs Desktop

Este documento detalla la estrategia de separación de layouts implementada en el proyecto "Recien llegue" para optimizar el rendimiento y la mantenibilidad.

## Estrategia General

Para maximizar el rendimiento (Core Web Vitals) y mejorar la experiencia de usuario, seguimos este patrón:

1.  **Server Components (`page.tsx`)**: Las páginas principales son componentes de servidor. Se encargan de pre-cargar los datos (Prisma/Actions) y pasarlos como props (`initialData`).
2.  **Separación de UI**: El `page.tsx` no contiene lógica de interfaz. Simplemente renderiza dos contenedores:
    *   `<div className="mobile-only">`: Renderiza un componente especializado de `src/components/mobile`.
    *   `<div className="desktop-only">`: Renderiza un componente especializado de `src/components/desktop`.
3.  **Client Components**: Los componentes de Mobile/Desktop son `use client` y manejan su propia interactividad (estados, filtros, animaciones) usando los datos pre-cargados.

---

## Estado Actual de la Implementación (Auditado: 21/02/2026)

### ✅ Páginas con Layouts Separados (Mobile / Desktop)
Todas las páginas principales siguen el patrón: `page.tsx` en servidor, componentes en `src/components/mobile` y `src/components/desktop`.

| Página | Page Type | Mobile Component | Desktop Component | Pre-fetching |
| :--- | :--- | :--- | :--- | :--- |
| **Inicio** (`/`) | Server | `MobileHome.tsx` | `DesktopHome.tsx` | Sí (Noticias, Tips, Eventos, Comida) |
| **Eventos** (`/eventos`) | Server | `MobileEventos.tsx` | `DesktopEventos.tsx` | Sí (Lista completa de eventos) |
| **Hospedaje** (`/hospedaje`) | Server | `MobileHospedaje.tsx` | `DesktopHospedaje.tsx` | Sí (Propiedades y Favoritos) |
| **Comida** (`/comida`) | Server | `MobileComida.tsx` | `DesktopComida.tsx` | Sí (Locales y Favoritos) |
| **Transporte** (`/transporte`) | Server | `MobileTransporte.tsx` | `DesktopTransporte.tsx` | Sí (Líneas urbanas, rutas terminal) |
| **Salud** (`/salud`) | Server | `MobileSalud.tsx` | `DesktopSalud.tsx` | Sí (Servicios de salud, farmacias de turno) |
| **UNNOBA** (`/unnoba`) | Server | `MobileUNNOBA.tsx` | `DesktopUNNOBA.tsx` | Sí (Sedes, servicios) |
| **Buscar** (`/buscar`) | Server | `MobileBuscar.tsx` | `DesktopBuscar.tsx` | No (búsqueda en tiempo real en cliente) |
| **Avisos** (`/avisos`) | Server | `MobileAvisos.tsx` | `DesktopAvisos.tsx` | Sí (Lista de avisos) |

---

### ✅ Más páginas con layouts separados (21/02/2026)

| Página | Page Type | Mobile Component | Desktop Component | Pre-fetching |
| :--- | :--- | :--- | :--- | :--- |
| **Hospedaje detalle** (`/hospedaje/[id]`) | Server | `MobilePropertyDetail.tsx` | `DesktopPropertyDetail.tsx` | Sí (propiedad por id) |
| **Mapa** (`/mapa`) | Server | `MobileMapa.tsx` | `DesktopMapa.tsx` | Sí (POIs: sedes, salud) |
| **Avisos detalle** (`/avisos/[id]`) | Server | `MobileDetalleAviso.tsx` | `DesktopDetalleAviso.tsx` | Sí (aviso por id) |
| **Avisos nuevo** (`/avisos/nuevo`) | Server | `MobileAvisoNuevo.tsx` | `DesktopAvisoNuevo.tsx` | No (formulario) |
| **Perfil** (`/perfil`) | Server | `MobilePerfil.tsx` | `DesktopPerfil.tsx` | Sí (stats) |
| **Favoritos** (`/perfil/favoritos`) | Server | `MobileFavoritos.tsx` | `DesktopFavoritos.tsx` | Sí (favoritos) |
| **Mis Avisos** (`/perfil/mis-avisos`) | Server | `MobileMisAvisos.tsx` | `DesktopMisAvisos.tsx` | Sí (avisos del usuario) |
| **Editar perfil** (`/perfil/editar`) | Server | `MobileEditarPerfil.tsx` | `DesktopEditarPerfil.tsx` | No (formulario) |

### Excluidas del patrón

| Página | Motivo |
| :--- | :--- |
| **Login** (`/login`), **Registro** (`/registro`) | Auth; una sola vista adaptativa. |
| **Admin** (`/admin/*`) | Panel interno; se mantienen como client. |

---

## Guía de Refactorización

Para convertir una página "Pendiente" al nuevo estándar:

1.  Crear `src/components/mobile/MobileView.tsx` y `src/components/desktop/DesktopView.tsx`.
2.  Mover el JSX respectivo y sus `useState/useEffect`.
3.  En el `app/ruta/page.tsx`:
    *   Quitar `"use client"`.
    *   Hacer la función `async`.
    *   Llamar a las acciones de datos (Prisma).
    *   Retornar ambos componentes dentro de sus respectivos divs de CSS (`mobile-only` / `desktop-only`).

---

## Beneficios Logrados
- **LCP (Largest Contentful Paint)** reducido significativamente: el usuario ve contenido real antes de que el Javascript se descargue.
- **Bundle JS separado**: Los usuarios de móvil no descargan el código pesado de los componentes de escritorio.
- **Claridad**: Es mucho más fácil editar el diseño de escritorio sin miedo a romper la vista móvil.
