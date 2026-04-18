/**
 * Seed de comercios nuevos desde comercios_con_coords.json
 * Deduplica contra los existentes en DB por nombre normalizado y coords (±80m)
 *
 * Uso: node scripts/seed-comercios-new.mjs [--dry-run]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Leer .env.local manualmente
const envPath = path.join(__dirname, '..', '.env.local')
const envVars = fs.readFileSync(envPath, 'utf-8')
  .split('\n')
  .filter(l => l && !l.startsWith('#'))
  .reduce((acc, l) => {
    const [k, ...v] = l.split('=')
    acc[k.trim()] = v.join('=').trim()
    return acc
  }, {})

const DB_URL      = envVars.MATECITODB_URL
const SERVICE_KEY = envVars.MATECITODB_SERVICE_KEY
const ANON_KEY    = envVars.NEXT_PUBLIC_MATECITODB_ANON_KEY
const DRY_RUN     = process.argv.includes('--dry-run')
const OFFSET      = parseInt(process.argv.find(a => a.startsWith('--offset='))?.split('=')[1] ?? '0', 10)

if (!DB_URL || !SERVICE_KEY) {
  console.error('Faltan MATECITODB_URL o MATECITODB_SERVICE_KEY en .env.local')
  process.exit(1)
}

const HEADERS = {
  'Content-Type': 'application/json',
  'x-service-key': SERVICE_KEY,
}

async function apiGet(endpoint) {
  const res = await fetch(`${DB_URL}${endpoint}`, { headers: HEADERS })
  return res.json()
}

async function apiPost(endpoint, body) {
  const res = await fetch(`${DB_URL}${endpoint}`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(body),
  })
  return { status: res.status, data: await res.json().catch(() => null) }
}

function normalize(s) {
  return (s ?? '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function tooClose(lat1, lng1, lat2, lng2) {
  return haversineM(lat1, lng1, lat2, lng2) < 80
}

function fetchAllExisting() {
  // Leer directamente del JSON original (los 120 que ya fueron seeded)
  const p = path.join(__dirname, '..', 'public', 'assets', 'jsons', 'locales_con_distancia.json')
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'))
  // Normalizar al mismo formato que usamos para comparar
  return data.map(c => ({
    name: c.title,
    lat:  c.lat != null ? Number(c.lat) : null,
    lng:  c.lng != null ? Number(c.lng) : null,
  }))
}

async function main() {
  console.log(`\n=== SEED: Comercios nuevos ${DRY_RUN ? '(DRY RUN)' : ''} ===`)
  console.log(`DB: ${DB_URL}\n`)

  // 1. Traer existentes
  console.log('1. Cargando comercios existentes (locales_con_distancia.json)...')
  const existing = fetchAllExisting()
  console.log(`   ${existing.length} comercios existentes\n`)

  // 2. Cargar nuevos con coords
  const inputPath = path.join(__dirname, 'comercios_con_coords.json')
  const allNew = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))
  const withCoords = allNew.filter(c => c.lat != null && c.lng != null)
  console.log(`2. Nuevos con coords: ${withCoords.length} / ${allNew.length}\n`)

  // 3. Deduplicar
  console.log('3. Deduplicando...')
  const toInsert = []
  const skipped = []

  for (const c of withCoords) {
    const normName = normalize(c.title)

    const isDup = existing.some(e => {
      const sameName = normalize(e.name) === normName
      const sameCoords = e.lat != null && e.lng != null && tooClose(e.lat, e.lng, c.lat, c.lng)
      return sameName || sameCoords
    })

    const alreadyQueued = toInsert.some(e =>
      normalize(e.name) === normName || tooClose(e.lat, e.lng, c.lat, c.lng)
    )

    if (isDup || alreadyQueued) {
      skipped.push(c.title)
    } else {
      toInsert.push({
        name:           c.title,
        category:       c.categoryName || c.categories?.[0] || 'Comercio',
        categories:     c.categories ?? [],
        rating:         Number(c.totalScore) || 0,
        reviewsCount:   Number(c.reviewsCount) || 0,
        address:        c.street ? `${c.street}, ${c.city ?? 'Pergamino'}` : 'Pergamino',
        phone:          c.phone || '',
        website:        c.website || '',
        googleMapsUrl:  c.url || '',
        lat:            c.lat,
        lng:            c.lng,
        distanceMeters: c.distanceMeters ?? null,
        walkTime:       c.walkTime || '',
        isFeatured:     false,
        isVerified:     false,
      })
    }
  }

  console.log(`   Duplicados salteados: ${skipped.length}`)
  console.log(`   Para insertar:        ${toInsert.length}\n`)

  const pending = OFFSET > 0 ? toInsert.slice(OFFSET) : toInsert
  if (OFFSET > 0) console.log(`   Saltando primeros ${OFFSET} (--offset=${OFFSET}), quedan: ${pending.length}\n`)

  if (DRY_RUN) {
    console.log('=== DRY RUN — primeros 10 a insertar ===')
    toInsert.slice(0, 10).forEach(c => console.log(`  · ${c.name} (${c.category}) — ${c.address}`))
    console.log('\nCorré sin --dry-run para insertar.')
    return
  }

  // 4. Insertar via API route (usa SDK internamente)
  const secret = SERVICE_KEY.slice(-8)
  const apiUrl = `http://localhost:3002/api/seed-comercios?secret=${secret}`

  console.log(`4. Insertando ${pending.length} comercios via API route...\n`)

  // Enviar en lotes de 20 para no saturar
  const BATCH = 20
  let totalInserted = 0
  let totalErrors = 0

  const failed = []

  for (let i = 0; i < pending.length; i += BATCH) {
    const batch = pending.slice(i, i + BATCH)
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    })
    const data = await res.json()
    totalInserted += data.inserted ?? 0
    const batchErrors = data.errors ?? []
    totalErrors += batchErrors.length
    console.log(`   Lote ${Math.floor(i/BATCH)+1}: ${data.inserted} insertados, ${batchErrors.length} errores`)
    if (batchErrors.length) {
      // Guardar los fallidos para reintentar
      const failedNames = new Set(batchErrors.map((e) => e.split(':')[0].trim()))
      batch.filter(c => failedNames.has(c.name)).forEach(c => failed.push(c))
    }
    // Pausa entre lotes para no saturar el servidor
    if (i + BATCH < pending.length) await new Promise(r => setTimeout(r, 3000))
  }

  // Reintentar fallidos de a 1
  if (failed.length > 0) {
    console.log(`\n   Reintentando ${failed.length} fallidos de a 1...`)
    let retryOk = 0
    for (const c of failed) {
      await new Promise(r => setTimeout(r, 500))
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([c]),
      })
      const data = await res.json()
      if (data.inserted > 0) { retryOk++; totalInserted++; totalErrors-- }
    }
    console.log(`   Reintentados OK: ${retryOk} / ${failed.length}`)
  }

  console.log(`\n=== RESULTADO ===`)
  console.log(`   Insertados: ${totalInserted}`)
  console.log(`   Errores:    ${totalErrors}`)
  console.log(`   Total en DB ahora: ~${120 + OFFSET + totalInserted}\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
