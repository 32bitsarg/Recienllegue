import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

const tips = [
    {
        title: "Boleto de Colectivo",
        text: "Tramitá el boleto estudiantil gratuito para moverte por todas las líneas locales sin gastar de más si sos alumno regular.",
        emoji: "🚌"
    },
    {
        title: "Menú Universitario",
        text: "Como estudiante de la UNNOBA, tenés acceso al comedor. ¡Aprovechá porque tiene precios muy económicos!",
        emoji: "🍽️"
    },
    {
        title: "Biblioteca Abierta",
        text: "La biblioteca de la facu es un re lugar para estudiar tranquilo. Y podés usar las compus o el WiFi libre.",
        emoji: "📚"
    },
    {
        title: "Chequeá los Avisos",
        text: "En la pestaña de 'Avisos' los estudiantes publican ventas de libros usados, búsqueda de compañeros y eventos.",
        emoji: "📌"
    },
    {
        title: "Teléfonos Últiles",
        text: "Fijate en la pestaña de 'Salud' si necesitás ubicar la guardia más cercana o el hospital por cualquier urgencia.",
        emoji: "🏥"
    }
];

async function main() {
    console.log("Insertando tips en la base de datos...");

    // Primero, vamos a borrar los anteriores por si quedó alguno suelto o desactualizado
    await prisma.tip.deleteMany({});

    for (const tip of tips) {
        await prisma.tip.create({
            data: tip
        });
        console.log(`✅ Tip insertado: ${tip.title}`);
    }

    console.log("🎉 Todos los tips cargados correctamente.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
