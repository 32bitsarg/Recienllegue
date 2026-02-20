import fs from 'fs';
import path from 'path';

// Dirección de la sede
const UNNOBA_ADDRESS = "Monteagudo 2772, Pergamino, Buenos Aires, Argentina";

// Para no saturar la API gratuita de OpenStreetMap (Nominatim requiere 1 request/segundo)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function geocode(address) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'es-ES,es;q=0.9'
            }
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP Error: ${response.status} - ${text.substring(0, 100)}`);
        }
        const data = await response.json();
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
        }
    } catch (error) {
        console.log(`[Error] Falló el geocoding para: ${address} | Detalles:`, error.message || error);
    }
    return null;
}

// Fórmula matemática para calcular distancia real entre dos puntos en la tierra
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radio de la tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
}

async function main() {
    console.log("📍 Buscando coordenadas de UNNOBA (Sede Pampa)...");
    let unnobaCoords = await geocode(UNNOBA_ADDRESS);

    if (!unnobaCoords) {
        console.log("⚠️ No se encontró la sede exacta en OSM. Usando coordenadas aproximadas de Monteagudo 2772.");
        // Coordenadas aproximadas si falla la búsqueda para esa esquina
        unnobaCoords = { lat: -33.8821, lon: -60.5843 };
    }
    console.log(`✅ UNNOBA en: Lat ${unnobaCoords.lat}, Lng ${unnobaCoords.lon}`);

    const inputFile = path.join(process.cwd(), 'public', 'assets', 'jsons', 'locales.json');
    const outputFile = path.join(process.cwd(), 'public', 'assets', 'jsons', 'locales_con_distancia.json');

    const rawData = fs.readFileSync(inputFile, 'utf8');
    const locales = JSON.parse(rawData);

    // Limpiar nulos del JSON en bruto
    const validLocales = locales.filter(p => p.title && p.street);

    console.log(`\n🚀 ¡Hay ${validLocales.length} locales para procesar! Esto tardará unos ${(validLocales.length * 1.5 / 60).toFixed(1)} minutos...`);

    const processed = [];

    for (let i = 0; i < validLocales.length; i++) {
        const place = validLocales[i];
        const searchStr = `${place.street}, Pergamino, Provincia de Buenos Aires`;

        const coords = await geocode(searchStr);
        let distanceMeters = null;
        let walkTimeStr = "A calcular";

        if (coords) {
            distanceMeters = haversine(unnobaCoords.lat, unnobaCoords.lon, coords.lat, coords.lon);
            // 80 metros por minuto caminando aprox
            const walkMinutes = Math.round(distanceMeters / 80);
            if (walkMinutes < 60) {
                walkTimeStr = `${walkMinutes} min caminando`;
            } else {
                walkTimeStr = `+1 hr a pie`;
            }
        }

        processed.push({
            ...place,
            lat: coords?.lat || null,
            lng: coords?.lon || null,
            distanceMeters: distanceMeters ? Math.round(distanceMeters) : null,
            walkTime: walkTimeStr
        });

        console.log(`[${i + 1}/${validLocales.length}] ${place.title} -> ${walkTimeStr} ${coords ? '✅' : '❌'}`);

        // Respetar límite de Nominatim para que no baneen nuestra IP
        await delay(1500);
    }

    fs.writeFileSync(outputFile, JSON.stringify(processed, null, 2));
    console.log(`\n🎉 PROCESO COMPLETADO! Los datos listos están en: ${outputFile}`);
}

main();
