import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
    console.log('🚍 Iniciando restauración de las líneas de colectivos (A, B, C, D, E)...');

    const colectivosViejos = await prisma.transportLine.findMany();
    if (colectivosViejos.length > 0) {
        console.log(`Borrando ${colectivosViejos.length} líneas previas para evitar duplicados...`);
        await prisma.transportLine.deleteMany();
    }

    const lineas = [
        {
            name: "Línea A",
            color: "#f43f5e", // Rojo/Rosa fuerte
            route: "Recorrido principal cruzando el centro y zonas universitarias.",
            kmlFile: "/assets/colectivos/linea_a.kml",
            frequency: "Aprox. 15-20 min",
            schedule: "Lunes a Viernes: 05:30 - 23:00 | Fines de semana: 06:00 - 22:00"
        },
        {
            name: "Línea B",
            color: "#3b82f6", // Azul
            route: "Conecta Barrio Belgrano con el Hospital y zona sur.",
            kmlFile: "/assets/colectivos/linea_b.kml",
            frequency: "Aprox. 20 min",
            schedule: "Lunes a Viernes: 05:30 - 23:00 | Fines de semana: 06:00 - 22:00"
        },
        {
            name: "Línea C",
            color: "#10b981", // Verde
            route: "Recorre desde el cruce principal hacia el sector oeste de la ciudad.",
            kmlFile: "/assets/colectivos/linea_c.kml",
            frequency: "Aprox. 20-30 min",
            schedule: "Lunes a Viernes: 05:30 - 23:00 | Fines de semana: 06:30 - 21:00"
        },
        {
            name: "Línea D",
            color: "#f59e0b", // Naranja/Amarillo
            route: "Ruta desde la Terminal hacia diversos barrios periféricos.",
            kmlFile: "/assets/colectivos/linea_d.kml",
            frequency: "Aprox. 25 min",
            schedule: "Lunes a Viernes: 06:00 - 22:30 | Fines de semana: 07:00 - 21:30"
        },
        {
            name: "Línea E",
            color: "#8b5cf6", // Violeta
            route: "Ruta que cubre el área industrial y zonas residenciales anexas.",
            kmlFile: "/assets/colectivos/linea_e.kml",
            frequency: "Aprox. 30 min",
            schedule: "Lunes a Viernes: 06:00 - 22:00 | Fines de semana: 07:00 - 21:00"
        }
    ];

    console.log('Insertando datos en la base de datos de producción...');

    for (const linea of lineas) {
        await prisma.transportLine.create({
            data: linea
        });
        console.log(`✅ ${linea.name} restaurada.`);
    }

    console.log('🎉 Todas las líneas de transporte han sido recuperadas exitosamente.');
}

main()
    .catch((e) => {
        console.error('❌ Error al intentar restaurar las líneas:');
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
