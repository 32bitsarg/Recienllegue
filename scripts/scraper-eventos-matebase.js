require('dotenv').config({ path: '../.env.local' })

const puppeteer = require('puppeteer')
const cheerio   = require('cheerio')

const { createClient } = require('matecitodb')

const URL         = process.env.MATECITODB_URL || process.env.NEXT_PUBLIC_MATECITODB_URL
const SERVICE_KEY = process.env.MATECITODB_SERVICE_KEY

if (!URL || !SERVICE_KEY) {
  console.error('Faltan variables de entorno: MATECITODB_URL (o NEXT_PUBLIC_MATECITODB_URL), MATECITODB_SERVICE_KEY')
  process.exit(1)
}

// Usa el SDK v2 con serviceKey — misma estructura de datos que lee la home
const db = createClient(URL, {
  apiKey: SERVICE_KEY,
  apiVersion: 'v2',
})

// ─── Scraper ──────────────────────────────────────────────────

async function scrapeEventos() {
  console.log('[scraper] Iniciando...')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
    defaultViewport: { width: 1280, height: 800 },
  })

  const page = await browser.newPage()
  console.log('[scraper] Navegando a pergamino.tur.ar/agenda/')
  await page.goto('https://pergamino.tur.ar/agenda/', { waitUntil: 'networkidle2', timeout: 60000 })

  try {
    await page.waitForSelector('.evo_events_list_box', { timeout: 15000 })
    await new Promise(r => setTimeout(r, 4000))
  } catch {
    console.warn('[scraper] Selector del calendario no encontrado, continuando igual...')
  }

  const content = await page.content()
  await browser.close()

  const $ = cheerio.load(content)
  const events = []

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  $('.eventon_list_event').each((_, element) => {
    const scriptLdJson = $(element).find('script[type="application/ld+json"]').html()
    if (!scriptLdJson) return

    try {
      const eventData = JSON.parse(scriptLdJson.trim())

      // Descartar eventos pasados
      const endDate   = eventData.endDate   ? new Date(eventData.endDate)   : null
      const startDate = eventData.startDate ? new Date(eventData.startDate) : null
      const refDate   = endDate || startDate
      if (refDate && refDate < today) return

      if (!eventData.name) return

      // Formatear fecha: "2025-06-15T09:00" → date: "15/06/2025", time: "09:00 hs"
      const dateRaw  = eventData.startDate || ''
      const datePart = dateRaw.split('T')[0] || ''
      const timePart = dateRaw.split('T')[1] || ''

      let dateFormatted = datePart
      if (datePart) {
        const [y, m, d] = datePart.split('-')
        dateFormatted = `${d}/${m}/${y}`
      }
      const timeFormatted = timePart
        ? timePart.split('-')[0].split('+')[0] + ' hs'
        : ''

      // Location
      let location = ''
      if (Array.isArray(eventData.location) && eventData.location.length > 0) {
        location = eventData.location[0].name || ''
      } else if (eventData.location?.name) {
        location = eventData.location.name
      }
      if (!location) {
        location = $(element).find('.event_location_attrs').attr('data-location_name') || ''
      }

      const description = cheerio.load(eventData.description || '').text().trim()

      events.push({
        title:        eventData.name,
        description,
        date:         dateFormatted,
        dateSortable: datePart,   // ISO YYYY-MM-DD para ordenar/filtrar en queries
        time:         timeFormatted,
        location,
        imageUrl:     eventData.image || '',
        link:         eventData.url   || '',
        isFeatured:   false,
      })
    } catch (e) {
      console.error('[scraper] Error parseando evento:', e.message)
    }
  })

  console.log(`[scraper] Eventos extraídos: ${events.length}`)
  return events
}

// ─── Main ─────────────────────────────────────────────────────

async function main() {
  const scraped = await scrapeEventos()

  if (scraped.length === 0) {
    console.log('[db] No hay eventos para procesar.')
    return
  }

  // ── Limpiar eventos vencidos ───────────────────────────────
  console.log('[db] Buscando eventos vencidos...')
  const todayISO = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD

  // Trae todos los registros existentes (hasta 500 para el cleanup)
  const existing = await db.from('eventos').limit(500).find()
  console.log(`[db] Registros existentes: ${existing.length}`)

  let deleted = 0
  let malformed = 0
  for (const ev of existing) {
    // Si viene anidado en .data, es un registro malformado del script anterior (V1)
    if (ev.data && Object.keys(ev).length <= 4) {
      await db.from('eventos').eq('id', ev.id).hardDelete()
      malformed++
      console.log(`[db] Eliminado (malformado v1): ${ev.id}`)
      continue
    }

    const sortable = ev.dateSortable
    if (sortable && sortable < todayISO) {
      await db.from('eventos').eq('id', ev.id).hardDelete()
      deleted++
      console.log(`[db] Eliminado (vencido): ${ev.title} (${sortable})`)
    }
  }
  console.log(`[db] Eventos vencidos eliminados: ${deleted} | Malformados: ${malformed}`)

  // ── Insertar nuevos, evitando duplicados por title + date ──
  const existingKeys = new Set(
    existing
      .filter(ev => ev.dateSortable >= todayISO) // solo los que sobrevivieron al cleanup
      .map(ev => `${ev.title}__${ev.date}`)
  )

  let inserted = 0
  let skipped  = 0

  for (const ev of scraped) {
    const key = `${ev.title}__${ev.date}`
    if (existingKeys.has(key)) {
      skipped++
      continue
    }
    await db.from('eventos').insert(ev)
    inserted++
    console.log(`[db] Creado: ${ev.title} (${ev.date})`)
  }

  console.log(`\n=== Finalizado. Creados: ${inserted} | Omitidos: ${skipped} | Vencidos eliminados: ${deleted} ===`)
}

main().catch(e => {
  console.error('[error]', e)
  process.exit(1)
})
