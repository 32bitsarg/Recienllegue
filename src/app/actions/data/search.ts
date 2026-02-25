"use server";

import { prisma } from "@/lib/prisma";

export async function globalSearch(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const [properties, restaurants, health, unnoba, transport, notices] = await Promise.all([
            prisma.property.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { address: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ],
                    active: true
                },
                take: 5
            }),
            prisma.restaurant.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { address: { contains: query, mode: 'insensitive' } },
                        { featured: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: 5
            }),
            prisma.healthService.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { address: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: 5
            }),
            prisma.universitySede.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { address: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: 3
            }),
            prisma.transportLine.findMany({
                where: {
                    name: { contains: query, mode: 'insensitive' }
                },
                take: 3
            }),
            prisma.notice.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: 5
            })
        ]);

        const results: any[] = [
            ...properties.map(p => ({ id: p.id, title: p.title, subtitle: p.address, type: 'Hospedaje', link: `/hospedaje/${p.id}`, iconName: 'Home' })),
            ...restaurants.map(r => ({ id: r.id, title: r.name, subtitle: r.address, type: 'Comida', link: `/comida?id=${r.id}`, iconName: 'Utensils' })),
            ...health.map(h => ({ id: h.id, title: h.name, subtitle: h.address, type: h.type, link: `/salud`, iconName: 'Heart' })),
            ...unnoba.map(u => ({ id: u.id, title: u.name, subtitle: u.address, type: 'UNNOBA', link: `/unnoba`, iconName: 'GraduationCap' })),
            ...transport.map(t => ({ id: t.id, title: t.name, subtitle: `Línea de transporte`, type: 'Transporte', link: `/transporte`, iconName: 'Bus' })),
            ...notices.map(n => ({ id: n.id, title: n.title, subtitle: n.category, type: 'Aviso', link: `/avisos/${n.id}`, iconName: 'MessageSquare' }))
        ];

        return results;
    } catch (error) {
        console.error("Error in globalSearch:", error);
        return [];
    }
}
