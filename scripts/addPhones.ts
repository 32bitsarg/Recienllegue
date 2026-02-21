import { prisma } from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
    const dataPath = path.join(process.cwd(), 'public', 'assets', 'jsons', 'locales_con_distancia.json');
    const locales = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    let updated = 0;
    for (const local of locales) {
        if (local.phone) {
            // Buscamos si existe con ese nombre
            const existing = await prisma.restaurant.findFirst({
                where: { name: local.title }
            });

            if (existing && !existing.phone) {
                await prisma.restaurant.update({
                    where: { id: existing.id },
                    data: { phone: local.phone }
                });
                updated++;
                console.log(`Updated phone for ${local.title}`);
            }
        }
    }

    console.log(`Total restaurants updated: ${updated}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
