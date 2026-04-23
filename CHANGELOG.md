# Changelog

## Unreleased

### Documentación

- README reescrito para reflejar el stack real del proyecto, el logo actual (`public/logo.svg`), la estructura vigente y reglas básicas de seguridad para GitHub.
- Se agregó una sección de roadmap pendiente para perfil académico, materias, horarios y alarmas UNNOBA.

### Limpieza y seguridad

- Se eliminaron scripts obsoletos/inseguros con claves hardcodeadas:
  - `scripts/check_notices.js`
  - `scripts/check_notices.ts`
  - `scripts/fix_users.ts`
- Se eliminó el `package.json` aislado dentro de `scripts/` junto con su `package-lock.json`.
- `.gitignore` se endureció para evitar subir helpers locales y artefactos temporales:
  - `debug_*.ts`
  - `tmp-*.ts`
  - `tmp/`
  - `tsconfig.tsbuildinfo`

### App

- Fichas internas dentro de `/app`:
  - `/app/comercios/[id]`
  - `/app/hospedajes/[id]`
- Las navegaciones internas ahora conservan el bottom nav mobile.
- Fichas públicas e internas mejoradas:
  - información más completa
  - mapa integrado con Leaflet/CARTO
  - llamadas a Maps externas
  - mejor estructura visual
- El mapa combinado de `/app/mapa` recibió un rediseño visual estilo panel flotante con controles más claros y tarjeta contextual de selección.

### Favoritos, alertas y propietarios

- Se agregó `/app/favoritos` para gestionar guardados, notas, estados y accesos rápidos.
- Los hospedajes incorporan disponibilidad real:
  - disponible / ocupado / disponible pronto
  - fecha estimada
  - cupos
  - última actualización
- Se agregaron alertas cuando un hospedaje vuelve a estar disponible.
- Se empezó a medir contacto real para propietarios:
  - llamadas
  - WhatsApp

### SEO y landings

- Nuevas landings programáticas de comercios:
  - `/pergamino/comercios-cerca-unnoba`
  - `/pergamino/kioscos-cerca-unnoba`
  - `/pergamino/panaderias-pergamino`
  - `/pergamino/farmacias-pergamino`
- Nuevas landings por perfil académico UNNOBA:
  - `/pergamino/carreras-unnoba-pergamino`
  - `/pergamino/informatica-unnoba-pergamino`
  - `/pergamino/ingenieria-unnoba-pergamino`
  - `/pergamino/diseno-unnoba-pergamino`
  - `/pergamino/economicas-unnoba-pergamino`
  - `/pergamino/juridicas-unnoba-pergamino`
  - `/pergamino/salud-unnoba-pergamino`
  - `/pergamino/agronomia-alimentos-genetica-unnoba-pergamino`
  - `/pergamino/taller-articulacion-unnoba-pergamino`

### Verificación

- `npx tsc --noEmit` pasando
- `npm run build` pasando
