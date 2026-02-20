import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient({})

async function main() {
    console.log("Limpiando la base de restaurantes en Prisma local...")
    await prisma.restaurant.deleteMany({})

    console.log("Leyendo JSON...")
    const filePath = path.join(process.cwd(), 'public', 'assets', 'jsons', 'locales_con_distancia.json')
    const jsonText = fs.readFileSync(filePath, 'utf-8')
    const locales = JSON.parse(jsonText)

    console.log(`Encontrados ${locales.length} locales. Insertando...`)

    let successCount = 0
    for (const local of locales) {
        if (!local.title || !local.street) continue; // Saltear locales vacíos que vienen de google maps bugs

        // Mapear algunas cosas
        // Image es requerido en el schema, así que usamos un placeholder basado en DiceBear o similar si no hay logo
        const imgSeed = encodeURIComponent(local.title.replace(/\s+/g, '-').toLowerCase())
        const fallbackUrl = `https://api.dicebear.com/9.x/shapes/svg?seed=${imgSeed}&backgroundColor=f1f5f9,e2e8f0,cbd5e1`

        // Distance string mapping
        const finalDistance = local.walkTime || 'A calcular'

        try {
            await prisma.restaurant.create({
                data: {
                    name: local.title.substring(0, 100),
                    category: local.categoryName ? local.categoryName.substring(0, 50) : "Otro",
                    rating: local.totalScore ? parseFloat(local.totalScore) : 0,
                    prepTime: null, // No lo prové google directamente asi de facil
                    priceRange: "MEDIO",
                    distance: finalDistance,
                    image: fallbackUrl,
                    address: local.street.substring(0, 150),
                    isFeaturedHome: false
                }
            });
            successCount++;
        } catch (e) {
            console.log(`\n❌ Error insertando ${local.title}:`, e.message)
        }
    }

    console.log(`\n🎉 Seed finalizado. ${successCount} restaurantes guardados en Base de Datos.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
