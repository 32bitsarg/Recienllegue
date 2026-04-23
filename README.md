<p align="center">
  <img src="public/logo.svg" width="128" height="128" alt="Recién Llegué" />
</p>

<h1 align="center">Recién Llegué</h1>

<p align="center">
  Plataforma web y PWA para ayudar a estudiantes y recién llegados a instalarse en Pergamino.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/PWA-ready-0F172A?style=for-the-badge" alt="PWA ready" />
  <img src="https://img.shields.io/badge/Firebase-FCM-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase FCM" />
  <img src="https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
</p>

## Overview

**Recién Llegué** centraliza la información que más impacto tiene durante la llegada a Pergamino:

- hospedajes
- comercios
- mapa combinado
- transporte
- farmacias
- muro comunitario
- favoritos y alertas
- panel para propietarios
- landings SEO orientadas a búsquedas locales y a perfiles de estudiantes de UNNOBA

El objetivo no es ser un directorio genérico. El producto está diseñado para reducir fricción en la primera etapa de instalación en la ciudad y mejorar la calidad de decisión con contexto local real.

## Product Scope

### Experiencia para estudiantes

- búsqueda y comparación de hospedajes
- favoritos y notas personales
- alertas por disponibilidad
- comercios útiles para la vida diaria
- fichas con mapa, contacto y estado del dato
- mapa de referencia con capas
- acceso rápido desde PWA

### Experiencia para propietarios

- carga y reclamo de comercios u hospedajes
- actualización de datos, imágenes y disponibilidad
- panel de seguimiento
- flujo de revisión por admin

### Experiencia para administración

- gestión de hospedajes y comercios
- revisión de reportes
- flujos de aprobación para propietarios
- notificaciones y mensajes destacados

## Key Features

### Hospedajes

- disponibilidad real
- estados visibles
- precio, capacidad, contacto y fotos
- comparador de opciones
- vista interna dentro de `/app`

### Comercios

- fichas detalladas con ubicación y contacto
- guardado en favoritos
- reclamo por dueños
- integración con mapa y páginas SEO

### Calidad de datos

- estado público del dato
- timestamps visibles de actualización
- reportes públicos en fichas
- ownership más claro para mejorar fichas vacías o incompletas

### SEO programático

- landings por necesidad local
- landings por áreas y carreras UNNOBA
- interlinking entre landings, fichas, mapa y app
- datos estructurados para snippets

## Tech Stack

| Area | Technology |
| :--- | :--- |
| Framework | Next.js 16 |
| UI | React 19 |
| Language | TypeScript |
| Data | MatecitoDB SDK v4 |
| Maps | Leaflet + React Leaflet |
| Push | Firebase Cloud Messaging |
| PWA | `@ducanh2912/next-pwa` |
| Icons | Lucide React |

## Architecture

```text
src/
  app/
    actions/              # Server actions
    api/                  # Route handlers
    app/                  # App autenticada
    comercios/[id]/       # Fichas públicas
    hospedajes/[id]/      # Fichas públicas
    pergamino/[growthSlug]# Landings SEO
  components/             # Componentes reutilizables
  data/                   # Datos de SEO y growth pages
  hooks/                  # Hooks de cliente
  lib/                    # DB, Firebase, helpers
public/
  logo.svg
  manifest.json
  firebase-messaging-sw.js
```

## Current Functional Areas

- `/app/inicio`
- `/app/hospedajes`
- `/app/comercios`
- `/app/mapa`
- `/app/farmacias`
- `/app/muro`
- `/app/favoritos`
- `/app/alertas`
- `/app/propietario`
- `/app/adm/*`

## Data and Trust Layer

Uno de los focos del proyecto es hacer visible la calidad del dato:

- dato confirmado
- dato publicado
- pendiente de revisión
- reportes públicos
- timestamps de actualización

Eso permite que el usuario entienda mejor qué tan confiable es una ficha y que el propietario tenga incentivos concretos para mantenerla al día.

## SEO and Discovery

El crecimiento orgánico se apoya en tres grupos de páginas:

1. landings locales por necesidad
2. landings por barrios
3. landings por perfiles académicos y áreas de UNNOBA

Ejemplos:

- hospedajes para estudiantes
- comercios cerca de UNNOBA
- kioscos cerca de UNNOBA
- panaderías en Pergamino
- carreras UNNOBA en Pergamino
- informática / ingeniería / diseño / salud / económicas / jurídicas

## Product Direction

Los próximos pasos del producto están orientados a:

- mejorar calidad y frescura del dato
- profundizar personalización para estudiantes
- sumar más contexto académico útil para UNNOBA
- cerrar mejor el loop entre búsqueda, decisión, contacto y retención

## Status

El detalle de versiones y evolución del producto está en [CHANGELOG.md](CHANGELOG.md).
=======
## Roadmap pendiente

- Perfil académico UNNOBA por usuario
- Materias, horarios y alarmas
- Próxima clase en inicio
- Planes de estudio conectados a experiencia diaria

## Estado

Ver [CHANGELOG.md](CHANGELOG.md).
