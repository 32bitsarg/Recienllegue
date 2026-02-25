"use server";

import { prisma } from "@/lib/prisma";

export async function getMyBusinesses(ownerId: string) {
    try {
        const [restaurants, properties, claims] = await Promise.all([
            prisma.restaurant.findMany({
                where: { ownerId },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.property.findMany({
                where: { ownerId },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.businessClaim.findMany({
                where: { userId: ownerId },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        // Enriquecer con estado del claim
        const restaurantsWithClaim = restaurants.map(r => {
            const claim = claims.find(c => c.targetId === r.id);
            return { ...r, claimStatus: claim?.status ?? null, type: 'RESTAURANT' as const };
        });

        const propertiesWithClaim = properties.map(p => {
            const claim = claims.find(c => c.targetId === p.id);
            return { ...p, claimStatus: claim?.status ?? null, type: 'PROPERTY' as const };
        });

        return { restaurants: restaurantsWithClaim, properties: propertiesWithClaim };
    } catch (error) {
        console.error("Error fetching my businesses:", error);
        return { restaurants: [], properties: [] };
    }
}
