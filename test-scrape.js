import * as cheerio from 'cheerio';

async function testFetch() {
    const url = "http://www.ampergamino.com.ar/index.php?seccion_generica_id=1430";
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const decoder = new TextDecoder('iso-8859-1'); // site is mostly iso-8859-1 since accents broke
    const text = decoder.decode(buffer);

    const $ = cheerio.load(text);

    // They use lots of tables. The one with actual info seems to be the one containing "El turno comienza" 
    const result = [];

    // Find paragraphs or table cells containing pharmacy details
    $('table td').each((i, el) => {
        const text = $(el).text().trim().replace(/\s+/g, ' ');
        // usually pharmacy format is "NAME address ... Tel. (...)"
        if (text.includes('Tel.') || text.includes('y Sarmiento')) {
            // It's a pharmacy row
            console.log("Found row:", text);
        }
    });

    // Let's just find the table that has 'VIERNES' or 'turno'
    const turnTables = $('table').filter((i, el) => $(el).text().includes('comienza 08:30')).get();
    if (turnTables.length > 0) {
        console.log("Turn table text:", $(turnTables[0]).text().replace(/\s+/g, ' '));
        // Look at its tr elements
        $(turnTables[0]).find('tr').each((i, tr) => {
            console.log("TR:", $(tr).text().replace(/\s+/g, ' '));
        });
    }
}

testFetch();
