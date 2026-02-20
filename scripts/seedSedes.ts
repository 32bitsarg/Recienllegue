import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

const sedes = [
    {
        name: "Sede Universitaria (Edificio Dr. Raúl R. Alfonsín)",
        address: "Monteagudo 2772",
        details: "Predio principal y edificio histórico de la UNNOBA en Pergamino (Ruta Nac. N°8 y Monteagudo).",
        phone: "(02477) 409500",
        lat: "-33.913191",
        lng: "-60.588979"
    },
    {
        name: "Edificio Matilde (Extensión Universitaria)",
        address: "Echevarría 549",
        details: "Cultura, cursos de extensión y secretaría de deportes.",
        phone: "(02477) 409500",
        lat: "-33.891300",
        lng: "-60.570911"
    },
    {
        name: "Edificio ECANA",
        address: "Av. Presidente Dr. Arturo Frondizi 2650",
        details: "Escuela de Ciencias Agrarias, Naturales y Ambientales. Pabellones de investigación vinculados al campo.",
        phone: "(02477) 409500",
        lat: "-33.9100",
        lng: "-60.5800"
    },
    {
        name: "CeBio (Centro de Bioinvestigaciones)",
        address: "Ruta Provincial N° 32 - Km 3,5",
        details: "Áreas de laboratorio científico en las afueras de la ciudad para investigadores.",
        phone: "(02477) 409500",
        lat: "-33.9211",
        lng: "-60.5478"
    },
    {
        name: "Pabellón Maíz - INTA",
        address: "Predio Experimental INTA Pergamino",
        details: "Ensayos agropecuarios y aulas especiales compartidas con el INTA.",
        phone: "(02477) 409500",
        lat: "-33.9460",
        lng: "-60.5560"
    }
];

async function main() {
    console.log("Insertando sedes de la UNNOBA en la base de datos...");

    // Eliminar previos
    await prisma.universitySede.deleteMany({});

    for (const sede of sedes) {
        await prisma.universitySede.create({
            data: sede
        });
        console.log(`✅ Sede insertada: ${sede.name}`);
    }

    console.log("🎉 Todas las sedes de la UNNOBA fueron cargadas correctamente.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
