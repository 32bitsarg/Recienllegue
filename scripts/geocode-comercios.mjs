/**
 * Geocodifica comercios.json usando Nominatim (OSM, gratis, sin API key)
 * Output: comercios_con_coords.json — listos para seedear
 *
 * Uso: node scripts/geocode-comercios.mjs
 *
 * Rate limit Nominatim: 1 req/segundo (lo respetamos con delay)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Centro UNNOBA Pergamino (punto de referencia para distancias)
const UNNOBA_LAT = -33.8824
const UNNOBA_LNG = -60.5689

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

function walkTimeLabel(meters) {
  const mins = Math.round(meters / 80)
  if (mins <= 1) return '1 min a pie'
  if (mins < 60) return `${mins} min a pie`
  return `${Math.round(mins / 60)}h a pie`
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function geocode(street, city) {
  if (!street) return null

  const query = `${street}, ${city}, Provincia de Buenos Aires, Argentina`
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=ar`

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Recienllegue/1.0 (app estudiantil Pergamino; contacto@recienllegue.com)',
        'Accept-Language': 'es',
      }
    })
    const data = await res.json()
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
  } catch {}
  return null
}

async function main() {
  const inputPath  = path.join(__dirname, 'comercios.json')
  const outputPath = path.join(__dirname, 'comercios_con_coords.json')

  // Cargar existing si hay progreso previo (resume)
  let done = []
  if (fs.existsSync(outputPath)) {
    done = JSON.parse(fs.readFileSync(outputPath, 'utf-8'))
    console.log(`Retomando desde ${done.length} ya procesados`)
  }

  const all = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))
  const doneTitles = new Set(done.map(d => d.title))
  const pending = all.filter(c => !doneTitles.has(c.title))

  console.log(`Total: ${all.length} | Ya procesados: ${done.length} | Pendientes: ${pending.length}`)
  console.log('Velocidad: ~1 req/seg → aprox', Math.ceil(pending.length / 60), 'minutos\n')

  let ok = 0, failed = 0

  for (let i = 0; i < pending.length; i++) {
    const c = pending[i]

    process.stdout.write(`[${i + 1}/${pending.length}] ${c.title.slice(0, 40).padEnd(40)} → `)

    const coords = await geocode(c.street, c.city || 'Pergamino')

    let enriched
    if (coords) {
      const distM = Math.round(haversineM(UNNOBA_LAT, UNNOBA_LNG, coords.lat, coords.lng))
      enriched = {
        ...c,
        lat:            coords.lat,
        lng:            coords.lng,
        distanceMeters: distM,
        walkTime:       walkTimeLabel(distM),
      }
      ok++
      process.stdout.write(`✓ ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)} (${distM}m)\n`)
    } else {
      enriched = { ...c, lat: null, lng: null, distanceMeters: null, walkTime: '' }
      failed++
      process.stdout.write(`✗ sin coords\n`)
    }

    done.push(enriched)

    // Guardar progreso cada 10 registros (resume si se interrumpe)
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync(outputPath, JSON.stringify(done, null, 2))
    }

    // Respetar rate limit de Nominatim: 1 req/seg
    await sleep(1100)
  }

  fs.writeFileSync(outputPath, JSON.stringify(done, null, 2))

  console.log(`\n=== RESULTADO ===`)
  console.log(`✓ Con coords:  ${ok}`)
  console.log(`✗ Sin coords:  ${failed}`)
  console.log(`Total guardado: ${done.length}`)
  console.log(`Output: ${outputPath}`)
}

main().catch(err => { console.error(err); process.exit(1) })
