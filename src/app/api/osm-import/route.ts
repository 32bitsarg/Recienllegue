import { NextResponse } from 'next/server'
import { createClient } from 'matecitodb'

/**
 * Importador de comercios desde OpenStreetMap (Overpass API)
 * GET /api/osm-import?secret=ULTIMOS8CHARS[&lat=-33.888&lng=-60.573&radius=2000&dryRun=true]
 *
 * Params:
 *   secret   — últimos 8 chars del SERVICE_KEY (requerido)
 *   lat/lng  — centro de búsqueda (default: centro Pergamino)
 *   radius   — radio en metros (default: 2500)
 *   dryRun   — si es "true", solo muestra qué insertaría sin escribir en DB
 */

// Centro de Pergamino (plaza principal)
const DEFAULT_LAT = -33.8883
const DEFAULT_LNG = -60.5714

// Tipos de amenity/shop que nos interesan
const OVERPASS_QUERY = (lat: number, lng: number, radius: number) => `
[out:json][timeout:30];
(
  node["amenity"~"^(restaurant|cafe|bar|fast_food|bakery|supermarket|kiosk|pub|food_court|ice_cream|pharmacy|bank|atm)$"](around:${radius},${lat},${lng});
  node["shop"~"^(supermarket|convenience|bakery|butcher|greengrocer|deli|pastry|alcohol|beverages|kiosk)$"](around:${radius},${lat},${lng});
  way["amenity"~"^(restaurant|cafe|bar|fast_food|bakery|supermarket|kiosk|pub|food_court|ice_cream|pharmacy|bank|atm)$"](around:${radius},${lat},${lng});
  way["shop"~"^(supermarket|convenience|bakery|butcher|greengrocer|deli|pastry|alcohol|beverages|kiosk)$"](around:${radius},${lat},${lng});
);
out center tags;
`

// Mapeo OSM → categoría interna
const CATEGORY_MAP: Record<string, string> = {
  restaurant:   'Restaurante',
  cafe:         'Cafetería',
  bar:          'Bar',
  pub:          'Bar',
  fast_food:    'Restaurante de comida rápida',
  bakery:       'Panadería',
  pastry:       'Panadería',
  supermarket:  'Supermercado',
  convenience:  'Kiosco',
  kiosk:        'Kiosco',
  butcher:      'Carnicería',
  greengrocer:  'Frutería',
  deli:         'Rotisería',
  food_court:   'Restaurante',
  ice_cream:    'Heladería',
  pharmacy:     'Farmacia',
  bank:         'Banco',
  atm:          'Cajero automático',
  alcohol:      'Licorería',
  beverages:    'Bebidas',
}

function getCategory(tags: Record<string, string>): string {
  const amenity = tags.amenity ?? ''
  const shop    = tags.shop ?? ''
  return CATEGORY_MAP[amenity] ?? CATEGORY_MAP[shop] ?? 'Comercio'
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function walkTimeLabel(meters: number): string {
  const mins = Math.round(meters / 80) // ~80m/min caminando
  if (mins <= 1) return '1 min a pie'
  if (mins < 60) return `${mins} min a pie`
  return `${Math.round(mins / 60)}h a pie`
}

// Normaliza nombre para comparar (minúsculas, sin tildes, sin espacios dobles)
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Dos puntos están a menos de X metros?
function tooClose(lat1: number, lng1: number, lat2: number, lng2: number, thresholdM = 80): boolean {
  return haversineKm(lat1, lng1, lat2, lng2) * 1000 < thresholdM
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  // Auth
  const secret = searchParams.get('secret')
  const expectedSecret = process.env.MATECITODB_SERVICE_KEY?.slice(-8)
  if (!secret || secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const lat     = parseFloat(searchParams.get('lat')    ?? String(DEFAULT_LAT))
  const lng     = parseFloat(searchParams.get('lng')    ?? String(DEFAULT_LNG))
  const radius  = parseInt(searchParams.get('radius')   ?? '2500', 10)
  const dryRun  = searchParams.get('dryRun') === 'true'

  const DB_URL      = process.env.MATECITODB_URL ?? ''
  const SERVICE_KEY = process.env.MATECITODB_SERVICE_KEY ?? ''
  const db = createClient(DB_URL, { apiKey: SERVICE_KEY })

  // 1. Traer todos los comercios existentes (para deduplicar)
  const { data: existing, error: dbErr } = await db.from('comercios').limit(500).find() as any
  if (dbErr) {
    return NextResponse.json({ error: `DB error: ${dbErr.message}` }, { status: 500 })
  }
  const existingList: any[] = existing ?? []

  // 2. Consultar Overpass API
  const overpassUrl = 'https://overpass-api.de/api/interpreter'
  const query = OVERPASS_QUERY(lat, lng, radius)

  let osmData: any
  try {
    const res = await fetch(overpassUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(25000),
    })
    osmData = await res.json()
  } catch (e: any) {
    return NextResponse.json({ error: `Overpass error: ${e.message}` }, { status: 500 })
  }

  const elements: any[] = osmData.elements ?? []

  // 3. Procesar y deduplicar
  const newComercios: any[] = []
  const skipped: string[] = []

  for (const el of elements) {
    const tags = el.tags ?? {}
    const name = tags.name ?? tags['name:es'] ?? ''
    if (!name) continue // sin nombre no sirve

    const elLat = el.lat ?? el.center?.lat
    const elLng = el.lon ?? el.center?.lon
    if (!elLat || !elLng) continue

    const normalizedName = normalize(name)

    // Deduplicar: mismo nombre O mismas coordenadas (±80m)
    const isDuplicate = existingList.some((c: any) => {
      const sameName = normalize(c.name ?? '') === normalizedName
      const sameCoords = c.lat != null && c.lng != null && tooClose(c.lat, c.lng, elLat, elLng)
      return sameName || sameCoords
    })

    if (isDuplicate) {
      skipped.push(name)
      continue
    }

    // También deduplicar contra los que vamos a insertar en esta misma corrida
    const alreadyQueued = newComercios.some((c) =>
      normalize(c.name) === normalizedName || tooClose(c.lat, c.lng, elLat, elLng)
    )
    if (alreadyQueued) continue

    const distanceMeters = Math.round(haversineKm(DEFAULT_LAT, DEFAULT_LNG, elLat, elLng) * 1000)
    const address = [tags['addr:street'], tags['addr:housenumber']]
      .filter(Boolean).join(' ') || tags['addr:full'] || ''

    newComercios.push({
      name,
      category:     getCategory(tags),
      categories:   [],
      rating:       0,
      reviewsCount: 0,
      address:      address ? `${address}, Pergamino` : 'Pergamino',
      phone:        tags.phone ?? tags['contact:phone'] ?? '',
      website:      tags.website ?? tags['contact:website'] ?? '',
      googleMapsUrl: `https://www.openstreetmap.org/node/${el.id}`,
      lat:          elLat,
      lng:          elLng,
      distanceMeters,
      walkTime:     walkTimeLabel(distanceMeters),
      isFeatured:   false,
      isVerified:   false,
      osmId:        String(el.id),
      source:       'osm',
    })
  }

  if (dryRun) {
    return NextResponse.json({
      dryRun:    true,
      osmTotal:  elements.length,
      withName:  elements.filter(e => e.tags?.name).length,
      existing:  existingList.length,
      skipped:   skipped.length,
      toInsert:  newComercios.length,
      preview:   newComercios.slice(0, 20).map(c => ({
        name: c.name, category: c.category, address: c.address,
        lat: c.lat, lng: c.lng, distanceMeters: c.distanceMeters,
      })),
    })
  }

  // 4. Insertar los nuevos
  let inserted = 0
  const errors: string[] = []

  for (const comercio of newComercios) {
    const { error } = await db.from('comercios').insert(comercio)
    if (error) {
      errors.push(`${comercio.name}: ${error.message}`)
    } else {
      inserted++
    }
  }

  return NextResponse.json({
    ok:       true,
    osmTotal: elements.length,
    existing: existingList.length,
    skipped:  skipped.length,
    inserted,
    errors:   errors.slice(0, 10),
  })
}
