// 1. Cargar dotenv lo primero para que src/lib/prisma tenga DATABASE_URL
import 'dotenv/config';

// 2. Importar prisma desde la app (que usa adapter-pg y SÍ funciona)
import { prisma } from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('🌱 Iniciando carga de restaurantes REALES a la base de datos...');

    const filePath = path.join(process.cwd(), 'public', 'assets', 'jsons', 'locales_con_distancia.json');
    const jsonText = fs.readFileSync(filePath, 'utf-8');
    const locales = JSON.parse(jsonText);

    console.log(`Encontrados ${locales.length} restaurantes. Insertando en entorno de producción mediante PG Adapter...`);

    let successCount = 0;
    for (const local of locales) {
        if (!local.title || !local.street) continue; // Salteamos vacíos

        const imgSeed = encodeURIComponent(local.title.replace(/\s+/g, '-').toLowerCase());
        const fallbackUrl = `https://api.dicebear.com/9.x/shapes/svg?seed=${imgSeed}&backgroundColor=f1f5f9,e2e8f0,cbd5e1`;
        const finalDistance = local.walkTime || 'A calcular';

        try {
            await prisma.restaurant.create({
                data: {
                    name: local.title.substring(0, 100),
                    category: local.categoryName ? local.categoryName.substring(0, 50) : "Otro",
                    rating: local.totalScore ? parseFloat(local.totalScore) : 0,
                    prepTime: null,
                    priceRange: "MEDIO",
                    distance: finalDistance,
                    image: fallbackUrl,
                    address: local.street.substring(0, 150),
                    isFeaturedHome: false
                }
            });
            successCount++;
        } catch (e: any) {
            console.error(`❌ Error insertando ${local.title}:`);
            console.error(e);
            break; // Si falla uno, que pare para ver el error
        }
    }

    console.log(`\n🎉 Carga de datos reales completada exitosamente. ${successCount} restaurantes guardados.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
