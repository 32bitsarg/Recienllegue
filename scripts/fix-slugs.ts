import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

// Función de ayuda para generar slugs (copiada de data.ts para que el script sea independiente)
function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

async function main() {
    console.log('🚀 Iniciando migración de slugs...');

    // Buscamos avisos que tengan slug nulo o vacío
    const notices = await prisma.notice.findMany({
        where: {
            OR: [
                { slug: null },
                { slug: '' }
            ]
        }
    });

    console.log(`📦 Encontrados ${notices.length} avisos sin slug.`);

    for (const notice of notices) {
        const baseSlug = slugify(notice.title);
        const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

        await prisma.notice.update({
            where: { id: notice.id },
            data: { slug: uniqueSlug }
        });

        console.log(`✅ Generado slug para: "${notice.title}" -> ${uniqueSlug}`);
    }

    console.log('✨ Migración finalizada con éxito.');
}

main()
    .catch((e) => {
        console.error('❌ Error durante la migración:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
