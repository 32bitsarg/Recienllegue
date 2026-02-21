require('dotenv').config({ path: '.env.local' });
if (!process.env.DATABASE_URL) {
    require('dotenv').config(); // try default .env
}
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function scrapeEventos() {
    console.log('Iniciando scraper...');
    const browser = await puppeteer.launch({
        headless: 'new',
        defaultViewport: { width: 1280, height: 800 }
    });
    const page = await browser.newPage();
    console.log('Navegando a la página de la agenda...');
    await page.goto('https://pergamino.tur.ar/agenda/', { waitUntil: 'networkidle2', timeout: 60000 });
    console.log('Esperando a que el calendario se cargue y renderice eventos...');
    try {
        await page.waitForSelector('.evo_events_list_box', { timeout: 15000 });
        await new Promise(r => setTimeout(r, 4000));
    } catch (e) {
        console.error('El calendario no apareció en el tiempo esperado.');
    }
    const content = await page.content();
    const $ = cheerio.load(content);
    const events = [];

    const now = new Date();
    // Set now to start of today to only discard events strictly *before* today (or decide logic below)
    // The user said "descartemos los eventos que ya pasaron". 
    // Si un evento es de hoy, sigue sirviendo porque puede ser mas tarde. Excluimos los de ayer o antes.
    now.setHours(0, 0, 0, 0);

    $('.eventon_list_event').each((index, element) => {
        const scriptLdJson = $(element).find('script[type="application/ld+json"]').html();
        if (scriptLdJson) {
            try {
                const eventData = JSON.parse(scriptLdJson.trim());

                // --- Filtro de eventos pasados ---
                // Try closing date first if ending today or later
                let eventEndDate = eventData.endDate ? new Date(eventData.endDate) : null;
                let eventStartDate = eventData.startDate ? new Date(eventData.startDate) : null;

                let referenceDate = eventEndDate || eventStartDate;
                // Si la fecha de finalizacion (o inicio) es estrictamente menor al inicio de hoy, ignorar
                if (referenceDate && referenceDate < now) {
                    return; // Skip this one
                }

                let description = eventData.description || '';
                const descText = cheerio.load(description).text().trim();

                let locationName = '';
                if (eventData.location && Array.isArray(eventData.location) && eventData.location.length > 0) {
                    locationName = eventData.location[0].name || '';
                } else if (eventData.location && typeof eventData.location === 'object') {
                    locationName = eventData.location.name || '';
                }
                if (!locationName) {
                    locationName = $(element).find('.event_location_attrs').attr('data-location_name') || '';
                }

                if (eventData.name) {
                    let dateRaw = eventData.startDate || '';
                    let datePart = dateRaw.split('T')[0] || '';
                    let timePart = dateRaw.split('T')[1] || '';

                    let timeFormatted = '';
                    if (timePart) {
                        timeFormatted = timePart.split('-')[0].split('+')[0] + ' hs'; // "09:00 hs"
                    }

                    let dateFormatted = datePart;
                    if (datePart) {
                        const parts = datePart.split('-');
                        if (parts.length === 3) {
                            const year = parts[0];
                            const month = parts[1].padStart(2, '0');
                            const day = parts[2].padStart(2, '0');
                            dateFormatted = `${day}/${month}/${year}`;
                        }
                    }

                    events.push({
                        title: eventData.name,
                        description: descText,
                        date: dateFormatted,
                        time: timeFormatted,
                        location: locationName,
                        imageUrl: eventData.image || '',
                        link: eventData.url || '',
                        isFeatured: false
                    });
                }
            } catch (e) {
                console.error("Error parseando JSON de un evento", e);
            }
        }
    });

    console.log(`Se extraerán ${events.length} eventos (los pasados fueron descartados).`);
    await browser.close();

    if (events.length > 0) {
        let inserted = 0;
        let skipped = 0;

        console.log('Inyectando a la base de datos de producción...');
        for (const ev of events) {
            const existing = await prisma.cityEvent.findFirst({
                where: {
                    title: ev.title,
                    date: ev.date
                }
            });

            if (!existing) {
                await prisma.cityEvent.create({ data: ev });
                inserted++;
                console.log(`[+] Creado: ${ev.title} (${ev.date})`);
            } else {
                skipped++;
                console.log(`[~] Omitido (ya existe): ${ev.title}`);
            }
        }
        console.log(`=== Proceso finalizado. Creados: ${inserted}, Omitidos: ${skipped} ===`);
    } else {
        console.log('No hay eventos nuevos en curso para subir.');
    }
}

scrapeEventos()
    .then(() => {
        pool.end();
        prisma.$disconnect();
    })
    .catch(e => {
        console.error(e);
        pool.end();
        prisma.$disconnect();
        process.exit(1);
    });
