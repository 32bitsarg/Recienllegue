<p align="center">
  <img src="public/logo.svg" width="120" height="120" alt="Recién Llegué logo" />
</p>

<h1 align="center">Recién Llegué</h1>

<p align="center">
  Guía práctica para estudiantes y recién llegados a Pergamino.
</p>

## Qué es

Recién Llegué concentra alojamiento, comercios, mapa, transporte, farmacias, muro, favoritos, alertas y panel para propietarios en una sola app web/PWA.

Está enfocada en la llegada a Pergamino, con contexto útil para estudiantes de UNNOBA y para dueños de comercios u hospedajes que quieran publicar o reclamar su ficha.

## Stack actual

- Next.js 16
- React 19
- TypeScript
- MatecitoDB SDK v4
- Firebase Cloud Messaging
- Leaflet + React Leaflet
- `@ducanh2912/next-pwa`

## Funcionalidades principales

- Hospedajes con disponibilidad, favoritos, comparador y contacto.
- Comercios con fichas, mapa, guardar y reclamo por propietarios.
- Mapa combinado con hospedajes, comercios, UNNOBA, colectivos y farmacias.
- Farmacias de turno con fallback a fuente externa.
- Muro segmentado para comunidad.
- Notificaciones push e inbox local.
- Panel propietario con altas, reclamos, cambios pendientes y métricas.
- Landings SEO programáticas para Pergamino y perfiles UNNOBA.

## Estructura del proyecto

```text
src/
  app/
    app/                  # App autenticada
    actions/              # Server actions
    api/                  # Endpoints
    [city]/[slug]/        # Landings SEO generadas
    comercios/[id]/       # Ficha pública
    hospedajes/[id]/      # Ficha pública
  components/             # UI compartida
  data/                   # SEO data y growth pages
  hooks/                  # Hooks cliente
  lib/                    # DB, Firebase, helpers
public/
  logo.svg
  manifest.json
  firebase-messaging-sw.js
scripts/
  create-owner-panel-collections.cjs
  owner-panel.sql
  ...scripts de seed, migración y scraping todavía útiles
```

## Desarrollo local

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables en `.env.local`.

3. Levantar desarrollo:

```bash
npm run dev
```

4. Verificar antes de subir:

```bash
npx tsc --noEmit
npm run build
```

## Variables sensibles

No se debe subir a GitHub:

- `.env`, `.env.local` y variantes
- service keys de MatecitoDB
- tokens/cookies de sesión
- credenciales privadas de Firebase Admin o cualquier private key

Notas:

- La config web pública de Firebase puede existir en cliente y en el service worker.
- Si alguna service key quedó expuesta en scripts viejos, hay que rotarla aunque el archivo se elimine del repo actual.

## Scripts

Se dejaron en `scripts/` solo utilidades que todavía pueden servir para:

- crear colecciones/campos
- seeds
- migraciones
- scrapers

Se eliminaron scripts viejos/inseguros con claves hardcodeadas y un `package.json` aislado de `scripts/` que ya no era necesario.

## Roadmap pendiente

- Perfil académico UNNOBA por usuario
- Materias, horarios y alarmas
- Próxima clase en inicio
- Planes de estudio conectados a experiencia diaria

## Estado

Ver [CHANGELOG.md](CHANGELOG.md).
