import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

const healthServices = [
    // Urgencias / Emergencias Vitales
    {
        name: "SAME (Emergencias Médicas)",
        number: "107",
        address: "Toda la ciudad",
        details: "Servicio de ambulancias y urgencias médicas las 24hs. Gratuito y de respuesta rápida para la vía pública.",
        type: "URGENCIA",
        color: "#f43f5e",
        lat: "-33.8900",
        lng: "-60.5700"
    },
    {
        name: "Emergencias Policiales / 911",
        number: "911",
        address: "Comisaría 1ra: Dorrego 636",
        details: "Atención centralizada para seguridad, delitos o accidentes graves.",
        type: "URGENCIA",
        color: "#3b82f6",
        lat: "-33.89680",
        lng: "-60.57469"
    },
    {
        name: "Bomberos Voluntarios",
        number: "100",
        address: "Castelli 460",
        details: "Cuartel central de bomberos para incendios, rescates y siniestros (Teléfono alternativo: 02477 42-2222).",
        type: "URGENCIA",
        color: "#dc2626",
        lat: "-33.90081",
        lng: "-60.57367"
    },
    {
        name: "Defensa Civil",
        number: "103",
        address: "Tucumán 260",
        details: "Para denunciar árboles a punto de caer, cables caídos, inundaciones o temporales fuertes.",
        type: "URGENCIA",
        color: "#f59e0b",
        lat: "-33.89103",
        lng: "-60.56045"
    },
    {
        name: "Medic/Car (Emergencias Privadas)",
        number: "02477 43-2222",
        address: "Av. de Mayo",
        details: "Sistema privado de emergencias médicas por afiliación o pago particular.",
        type: "URGENCIA",
        color: "#f43f5e",
        lat: "-33.89253",
        lng: "-60.57381"
    },

    // Hospitales y Clínicas de Alta Complejidad
    {
        name: "Hospital Interzonal General de Agudos 'San José'",
        number: "(02477) 42-9792",
        address: "Bv. Liniers 950 (Esq. Pte Illia)",
        details: "Hospital público provincial cabecera de Pergamino. Guardia de emergencias 24hs. Gratuito.",
        type: "HOSPITAL",
        color: "#10b981",
        lat: "-33.8824",
        lng: "-60.5599"
    },
    {
        name: "Clínica Centro (Privada)",
        number: "(02477) 43-2223",
        address: "Luzuriaga 234",
        details: "Centro privado con internación, terapia intensiva y consultorios. Solo prepagas y particular.",
        type: "HOSPITAL",
        color: "#8b5cf6",
        lat: "-33.89217",
        lng: "-60.56941"
    },
    {
        name: "Clínica Pergamino (Privada)",
        number: "(02477) 43-2000",
        address: "San Martín 158",
        details: "Sanatorio privado, atención por obra social y particulares.",
        type: "HOSPITAL",
        color: "#6366f1",
        lat: "-33.8930",
        lng: "-60.5740"
    },
    {
        name: "Clínica La Pequeña Familia",
        number: "(02477) 41-3333",
        address: "Florida 804",
        details: "Delegación pergaminense y consultorios ambulatorios/alta especialidad médica.",
        type: "HOSPITAL",
        color: "#0ea5e9",
        lat: "-33.89684",
        lng: "-60.57645"
    },

    // CAPS (Centros de Atención Primaria) - Los más cercanos a zona céntrica y UNNOBA
    {
        name: "CAPS '2 de Abril'",
        number: "(02477) 43-2947",
        address: "Pico 850 (Barrio Acevedo)",
        details: "Atención primaria, clínica médica, vacunatorio y enfermería. Ideal para consultas simples diarias.",
        type: "CAPS",
        color: "#14b8a6",
        lat: "-33.88216",
        lng: "-60.56917"
    },
    {
        name: "CAPS 'Oscar Otero'",
        number: "(02477) 43-7764",
        address: "Calle 101 entre 106 y 104",
        details: "Vacunación, ginegología, clínica general, pediatría. Muy cerca del cruce de rutas.",
        type: "CAPS",
        color: "#14b8a6",
        lat: "-33.8750",
        lng: "-60.5600"
    },
    {
        name: "CAPS 'Salvador Mazza'",
        number: "(02477) 41-4500",
        address: "Balboa y Vicente López (Barrio Belgrano)",
        details: "Consultorios clínicos y atención de primera mano gratuita.",
        type: "CAPS",
        color: "#14b8a6",
        lat: "-33.8950",
        lng: "-60.5650"
    },
    {
        name: "CAPS 'Barrio 12 de Octubre'",
        number: "Ir presencialmente",
        address: "Dean Funes y Florida",
        details: "Posta sanitaria primaria de barrio muy estratégica hacia el sudoeste.",
        type: "CAPS",
        color: "#14b8a6",
        lat: "-33.8980",
        lng: "-60.5850"
    },
    {
        name: "CAPS 'Ramón Carrillo'",
        number: "(02477) 44-5566",
        address: "Costa Rica y Dean Funes (Barrio Güemes)",
        details: "Servicio de vacunación pediátrica, clínica y control de salud gratuito municipal.",
        type: "CAPS",
        color: "#14b8a6",
        lat: "-33.9100",
        lng: "-60.5680"
    }
];

async function main() {
    console.log("Insertando red de salud y emergencias de Pergamino...");

    // Primero, limpiamos los registros anteriores
    await prisma.healthService.deleteMany({});

    for (const service of healthServices) {
        await prisma.healthService.create({
            data: {
                ...service,
                type: service.type as any
            }
        });
        console.log(`✅ Ingresado: ${service.name} (${service.type})`);
    }

    console.log("🎉 Toda la red de salud local se cargó exitosamente.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
