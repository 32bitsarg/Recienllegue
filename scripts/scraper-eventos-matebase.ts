import dotenv from 'dotenv'
dotenv.config({ path: '../.env.local' })

import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import { createClient } from 'matecitodb'

const URL         = process.env.MATECITODB_URL || process.env.NEXT_PUBLIC_MATECITODB_URL
const SERVICE_KEY = process.env.MATECITODB_SERVICE_KEY

if (!URL || !SERVICE_KEY) {
  console.error('Faltan variables de entorno: MATECITODB_URL, MATECITODB_SERVICE_KEY')
  process.exit(1)
}

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

      const endDate   = eventData.endDate   ? new Date(eventData.endDate)   : null
      const startDate = eventData.startDate ? new Date(eventData.startDate) : null
      const refDate   = endDate || startDate
      if (refDate && refDate < today) return

      if (!eventData.name) return

      const dateRaw  = eventData.startDate || ''
      let datePart = dateRaw.split('T')[0] || '' 
      const timePart = dateRaw.split('T')[1] || ''

      let dateFormatted = datePart
      let dateSortableStr = datePart
      if (datePart && datePart.includes('-')) {
        let [y, m, d] = datePart.split('-')
        m = m.padStart(2, '0')
        d = d.padStart(2, '0')
        dateSortableStr = `${y}-${m}-${d}` 
        dateFormatted = `${d}/${m}/${y}`
      }
      
      const timeFormatted = timePart ? timePart.split('-')[0].split('+')[0] + ' hs' : ''

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
        dateSortable: dateSortableStr,
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

  console.log('[db] Obteniendo registros de la DB...')
  const todayISO = new Date().toLocaleDateString('en-CA')

  // Auto-crear colección 'eventos' por las dudas usando la API cruda del admin
  try {
    await fetch(`${URL}/api/v2/collections`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'eventos', type: 'base' })
    })
  } catch(e) {}

  const { data: existingRaw, error: getErr } = await db.from('eventos').limit(500).get()
  if (getErr) throw new Error(`Error obteniendo existentes: ${JSON.stringify(getErr)}`)
  const existing = existingRaw || []
  console.log(`[db] Registros existentes: ${existing.length}`)

  let deleted = 0
  let malformed = 0
  
  for (const ev of existing) {
    if (ev.data && Object.keys(ev).length <= 4) {
      await db.from('eventos').hardDelete(ev.id)
      malformed++
      console.log(`[db] Eliminado (malformado v1): ${ev.id}`)
      continue
    }

    const sortable = ev.dateSortable
    if (sortable) {
      const isPast = new Date(sortable) < new Date(todayISO)
      // O adicionalmente, si el sortable no tiene el formato YYYY-MM-DD correcto (está sin ceros), lo pisamos para regenerarlo bien.
      const isBadFormat = sortable.match(/^\d{4}-\d{1,2}-\d{1,2}$/) && sortable.length < 10

      if (isPast || isBadFormat) {
        await db.from('eventos').hardDelete(ev.id)
        deleted++
        console.log(`[db] Eliminado (vencido o formato mal): ${ev.title} (${sortable})`)
      }
    }
  }
  console.log(`[db] Eventos vencidos eliminados: ${deleted} | Malformados: ${malformed}`)

  const existingKeys = new Set(
    existing
      .filter(ev => {
        if (!ev.dateSortable) return false
        const isBadFormat = ev.dateSortable.length < 10
        const isPast = new Date(ev.dateSortable) < new Date(todayISO)
        return !isPast && !isBadFormat
      }) // solo los que sobrevivieron y están bien estructurados
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
    const { error: insErr } = await db.from('eventos').insert(ev)
    if (insErr) throw new Error(`Fallo al insertar evento: ${JSON.stringify(insErr)}`)
    inserted++
    console.log(`[db] Creado: ${ev.title} (${ev.date})`)
  }

  console.log(`\n=== Finalizado. Creados: ${inserted} | Omitidos: ${skipped} | Vencidos eliminados: ${deleted} ===`)
}

main().catch(e => {
  console.error('[error]', e)
  process.exit(1)
})
