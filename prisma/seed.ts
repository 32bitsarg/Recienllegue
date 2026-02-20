import { PrismaClient, Role, PropertyType, Gender, FoodCategory, PriceRange, NoticeCategory, HealthType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create System Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@recienllegue.com' },
        update: {},
        create: {
            email: 'admin@recienllegue.com',
            name: 'System Admin',
            role: Role.ADMIN,
            phone: '2477123456',
        },
    });

    console.log('✅ Admin user created');

    // 2. Clear existing data
    await prisma.savedItem.deleteMany();
    await prisma.property.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.healthService.deleteMany();

    // 3. Housing (Properties)
    const properties = [
        {
            title: "Residencia Universitaria San José",
            description: "Residencia tradicional en el centro de Pergamino, ideal para estudiantes de primer año con ambiente familiar.",
            type: PropertyType.RESIDENCIA,
            price: 85000.00,
            address: "Centro, Pergamino",
            distance: "500m de UNNOBA",
            services: ["WiFi", "Cocina", "Limpieza"],
            verified: true,
            gender: Gender.MIXTO,
            ownerName: "San José",
            ownerPhone: "2477001122",
            mainImage: "https://images.unsplash.com/photo-1555854817-5b2260d50c47?q=80&w=400&h=300&fit=crop",
            ownerId: admin.id,
        },
        {
            title: "Depto Monoambiente Centro",
            description: "Departamento moderno y luminoso, amoblado y listo para entrar a vivir. Ubicación inmejorable.",
            type: PropertyType.DEPARTAMENTO,
            price: 150000.00,
            address: "Bv. Rocha y Centro",
            distance: "1.2km de UNNOBA",
            services: ["Amoblado", "WiFi"],
            verified: false,
            gender: Gender.NA,
            ownerName: "Duenio Directo",
            ownerPhone: "2477334455",
            mainImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&h=300&fit=crop",
            ownerId: admin.id,
        },
        {
            title: "Residencia Femenina Pergamino",
            description: "Espacio exclusivo para mujeres, seguro y tranquilo. Habitaciones amplias y áreas comunes equipadas.",
            type: PropertyType.RESIDENCIA,
            price: 95000.00,
            address: "Barrio Acevedo",
            distance: "800m de UNNOBA",
            services: ["WiFi", "Lavadero", "Seguridad"],
            verified: true,
            gender: Gender.FEMENINO,
            ownerName: "Admin Residencia",
            ownerPhone: "2477556677",
            mainImage: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=400&h=300&fit=crop",
            ownerId: admin.id,
        }
    ];

    for (const p of properties) {
        await prisma.property.create({ data: p });
    }
    console.log('✅ Properties seeded');

    // 4. Food (Restaurants)
    const restaurants = [
        {
            name: "La Birra Pergamino",
            category: FoodCategory.BAR,
            rating: 4.8,
            prepTime: "20-30 min",
            priceRange: PriceRange.MEDIO,
            distance: "300m de UNNOBA",
            image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=400&h=300&fit=crop",
            featured: "Hamburguesas y Cerveza",
            address: "Av. de Mayo",
        },
        {
            name: "Rotisería El Paso",
            category: FoodCategory.ROTISERIA,
            rating: 4.5,
            prepTime: "15-25 min",
            priceRange: PriceRange.BAJO,
            distance: "600m de UNNOBA",
            image: "https://images.unsplash.com/photo-1547573854-74d2a71d0827?q=80&w=400&h=300&fit=crop",
            featured: "Minutas y Viandas",
            address: "San Nicolás 400",
        },
        {
            name: "Café de la Plaza",
            category: FoodCategory.CAFETERIA,
            rating: 4.7,
            prepTime: "10-20 min",
            priceRange: PriceRange.MEDIO,
            distance: "1km de UNNOBA",
            image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=400&h=300&fit=crop",
            featured: "Desayunos y Meriendas",
            address: "Plaza Merced",
        },
        {
            name: "Pizzería Nápoles",
            category: FoodCategory.RESTAURANTE,
            rating: 4.3,
            prepTime: "30-45 min",
            priceRange: PriceRange.MEDIO,
            distance: "450m de UNNOBA",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&h=300&fit=crop",
            featured: "Pizza a la leña",
            address: "Italia 200",
        },
        {
            name: "El Bodegón Pergamino",
            category: FoodCategory.RESTAURANTE,
            rating: 4.6,
            prepTime: "40-60 min",
            priceRange: PriceRange.ALTO,
            distance: "1.2km de UNNOBA",
            image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400&h=300&fit=crop",
            featured: "Parrilla y Pastas",
            address: "Barrio Bombero",
        }
    ];

    for (const r of restaurants) {
        await prisma.restaurant.create({ data: r });
    }
    console.log('✅ Restaurants seeded');

    // 5. Health Services
    const healthServices = [
        { name: "SAME", number: "107", type: HealthType.URGENCIA, color: "#f43f5e", details: "Emergencias Médicas" },
        { name: "Bomberos", number: "100", type: HealthType.URGENCIA, color: "#f97316" },
        { name: "Policía", number: "911", type: HealthType.URGENCIA, color: "#3b82f6" },
        {
            name: "Hospital San José",
            type: HealthType.HOSPITAL,
            address: "Av. Liniers 950",
            details: "Guardia 24 horas. Clínica, Pediatría y Salud Mental.",
            number: "02477-429798",
        },
        {
            name: "Vacunatorio Municipal",
            type: HealthType.CAPS,
            address: "Bv. Marcelino Ugarte 220",
            details: "Calendario oficial y campañas nacionales. Dr. José Caggiano",
            number: "02477-410000",
        }
    ];

    for (const h of healthServices) {
        await prisma.healthService.create({ data: h });
    }
    console.log('✅ Health services seeded');

    console.log('🌱 Seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
