const addresses = [
    "Monteagudo 2772, Pergamino, Buenos Aires, Argentina",
    "Echevarría 549, Pergamino, Buenos Aires, Argentina",
    "Avenida Presidente Dr. Arturo Frondizi 2650, Pergamino, Buenos Aires, Argentina",
    "Ruta Provincial N 32 km 3, Pergamino, Buenos Aires, Argentina",
    "Dorrego 636, Pergamino, Buenos Aires, Argentina",
    "Castelli 460, Pergamino, Buenos Aires, Argentina",
    "Tucumán 260, Pergamino, Buenos Aires, Argentina",
    "Avenida de Mayo, Pergamino, Buenos Aires, Argentina",
    "Pte. Illia y Bv. Liniers, Pergamino, Buenos Aires, Argentina",
    "Luzuriaga 234, Pergamino, Buenos Aires, Argentina",
    "San Martín 158, Pergamino, Buenos Aires, Argentina",
    "Florida 804, Pergamino, Buenos Aires, Argentina",
    "Pico 850, Pergamino, Buenos Aires, Argentina",
    "Vicente López y Balboa, Pergamino, Buenos Aires, Argentina",
];

async function geocode(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'RecienLlegueApp/1.0' } });
        const data = await response.json();
        if (data && data.length > 0) {
            console.log(`✅ [${address}] -> Lat: ${data[0].lat}, Lng: ${data[0].lon}`);
        } else {
            console.log(`❌ [${address}] -> No encontrado`);
        }
    } catch (e) {
        console.error(`Error con ${address}:`, e.message);
    }
    // Respect API rate limits
    await new Promise(r => setTimeout(r, 1500));
}

async function main() {
    console.log("Buscando coordenadas exactas en Nominatim...");
    for (const addr of addresses) {
        await geocode(addr);
    }
}

main();
