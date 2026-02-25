"use server";

import { prisma } from "@/lib/prisma";

export async function getUserFavorites(userId: string) {
    try {
        const favorites = await prisma.savedItem.findMany({
            where: { userId },
            include: {
                property: true,
                restaurant: true
            },
            orderBy: { createdAt: "desc" },
        });

        return {
            properties: favorites.filter(f => f.property).map(f => f.property!),
            restaurants: favorites.filter(f => f.restaurant).map(f => f.restaurant!)
        };
    } catch (error) {
        console.error("Error fetching user favorites:", error);
        return { properties: [], restaurants: [] };
    }
}

export async function getUserStats(userId: string) {
    try {
        const [noticesCount, favoritesCount] = await Promise.all([
            prisma.notice.count({ where: { authorId: userId } }),
            prisma.savedItem.count({ where: { userId } })
        ]);

        return {
            notices: noticesCount,
            favorites: favoritesCount
        };
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return { notices: 0, favorites: 0 };
    }
}

export async function toggleFavorite(userId: string, itemId: string, type: 'property' | 'restaurant') {
    try {
        const where = {
            userId,
            [type === 'property' ? 'propertyId' : 'restaurantId']: itemId
        };

        const existing = await prisma.savedItem.findFirst({ where });

        if (existing) {
            await prisma.savedItem.delete({ where: { id: existing.id } });
            return { saved: false };
        } else {
            await prisma.savedItem.create({
                data: {
                    userId,
                    [type === 'property' ? 'propertyId' : 'restaurantId']: itemId
                }
            });
            return { saved: true };
        }
    } catch (error) {
        console.error("Error toggling favorite:", error);
        return { error: "Error al actualizar favoritos" };
    }
}

export async function getAdminUsers() {
    try {
        return await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: {
                        properties: true,
                        notices: true,
                        comments: true
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error fetching admin users:", error);
        return [];
    }
}

export async function updateUserStatus(userId: string, active: boolean) {
    try {
        return await prisma.user.update({
            where: { id: userId },
            data: { active }
        });
    } catch (error) {
        console.error("Error updating user status:", error);
        throw new Error("No se pudo actualizar el estado del usuario");
    }
}

export async function updateUserRoleById(userId: string, role: "ESTUDIANTE" | "DUENO" | "ADMIN") {
    try {
        return await prisma.user.update({
            where: { id: userId },
            data: { role }
        });
    } catch (error) {
        console.error("Error updating user role:", error);
        throw new Error("No se pudo actualizar el rol del usuario");
    }
}

export async function setUserRole(email: string, role: "ESTUDIANTE" | "DUENO" | "ADMIN") {
    try {
        return await prisma.user.update({
            where: { email },
            data: { role },
        });
    } catch (error) {
        console.error("Error updating user role:", error);
        throw new Error("No se pudo actualizar el rol del usuario");
    }
}
