const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function scrapeEventos() {
    console.log('Iniciando scraper...');

    // Iniciar el navegador de Puppeteer
    const browser = await puppeteer.launch({
        headless: 'new', // Usar nuevo modo headless de Chrome o 'new' para la nueva implementación
        defaultViewport: { width: 1280, height: 800 }
    });

    const page = await browser.newPage();

    // Ir a la página de agenda
    console.log('Navegando a la página de la agenda...');
    await page.goto('https://pergamino.tur.ar/agenda/', {
        waitUntil: 'networkidle2', // Esperar hasta que ya no haya (casi) más peticiones de red
        timeout: 60000 // 60 segundos de timeout
    });

    // Esperar a que el contenedor de los eventos (el de EventON) esté en la página
    console.log('Esperando a que el calendario se cargue y renderice eventos...');
    try {
        await page.waitForSelector('.evo_events_list_box', { timeout: 15000 });
        // También esperamos un poco por las dudas si el ajax tarda en procesar el html inyectado, aunque networkidle2 ayuda.
        await new Promise(r => setTimeout(r, 3000));
    } catch (e) {
        console.error('El calendario no apareció en el tiempo esperado. Puede deberse a lentitud de la página o no hay eventos.');
    }

    // Obtener el HTML procesado
    console.log('Extrayendo HTML...');
    const content = await page.content();

    // Pasar a Cheerio para parsear fácilmente
    const $ = cheerio.load(content);

    const events = [];

    // Buscar todos los scripts de tipo application/ld+json que contengan los datos de schema.org/Event
    $('.eventon_list_event').each((index, element) => {
        // En cada evento, buscamos el bloque script con application/ld+json
        const scriptLdJson = $(element).find('script[type="application/ld+json"]').html();

        // También agarramos un elemento clave para ver el status si quieremos
        const isPast = $(element).hasClass('past_event');

        if (scriptLdJson) {
            try {
                const eventData = JSON.parse(scriptLdJson.trim());

                // Limpiar descripción porque a veces viene fea o con tags html indeseados simples
                let description = eventData.description || '';
                // Limpiar HTML simple usando un regex básico para texto plano si se deseara,
                // Pero como nuestro Admin podría mostrar HTML (o podríamos solo limpiarlo un poco para texto)
                const descText = cheerio.load(description).text().trim();

                // Extraemos info de location
                let locationName = '';
                if (eventData.location && Array.isArray(eventData.location) && eventData.location.length > 0) {
                    locationName = eventData.location[0].name || '';
                }
                // Como alternativa o si no está en el JSON, chequear el data-location_name
                if (!locationName) {
                    locationName = $(element).find('.event_location_attrs').attr('data-location_name') || '';
                }

                if (eventData.name) {
                    // Formateo simple de fecha u hora a gusto para nuestro CityEvent
                    // El backend de Prisma usa Strings para date y time, los formateamos un poco
                    const startD = new Date(eventData.startDate);
                    const dateFormatted = startD.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });

                    // Formato de hora (ej. 21:00 hs)
                    const timeFormatted = startD.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs';

                    events.push({
                        title: eventData.name,
                        description: descText,
                        date: dateFormatted,
                        time: timeFormatted,
                        location: locationName,
                        imageUrl: eventData.image || '',
                        link: eventData.url || '',
                        isFeatured: false // Por defecto
                    });
                }

            } catch (e) {
                console.error("Error parseando JSON de un evento", e);
            }
        }
    });

    console.log(`Se encontraron ${events.length} eventos.`);

    await browser.close();

    // Ahora guardamos los eventos en la base de datos de Prisma
    if (events.length > 0) {
        let inserted = 0;
        let skipped = 0;

        console.log('Sincronizando con la base de datos local...');
        for (const ev of events) {
            // Chequear si ya existe por el título y la fecha para evitar duplicados burdos
            const existing = await prisma.cityEvent.findFirst({
                where: {
                    title: ev.title,
                    date: ev.date
                }
            });

            if (!existing) {
                await prisma.cityEvent.create({
                    data: ev
                });
                inserted++;
                console.log(`[+] Creado: ${ev.title}`);
            } else {
                skipped++;
                console.log(`[~] Omitido (ya existe): ${ev.title}`);
            }
        }
        console.log(`=== Proceso finalizado. Creados: ${inserted}, Omitidos: ${skipped} ===`);
    } else {
        console.log('No se guardó nada en la base de datos porque no se extrajeron eventos.');
    }
}

// Controlar posibles errores no capturados
scrapeEventos()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error('Error no capturado:', e);
        prisma.$disconnect();
        process.exit(1);
    });
