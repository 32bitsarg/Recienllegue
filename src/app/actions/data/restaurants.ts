"use server";

import { prisma } from "@/lib/prisma";

export async function getRestaurants(includeAll = false) {
    try {
        return await prisma.restaurant.findMany({
            where: includeAll ? {} : {
                OR: [
                    { ownerId: null },     // Cargados por el admin (sin dueño)
                    { isVerified: true },  // Aprobados por el admin
                ]
            },
            orderBy: { rating: "desc" },
        });
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return [];
    }
}

export async function getFeaturedRestaurants() {
    try {
        return await prisma.restaurant.findMany({
            where: { isFeaturedHome: true },
            orderBy: { rating: "desc" },
        });
    } catch (error) {
        console.error("Error fetching featured restaurants:", error);
        return [];
    }
}

export async function getPremiumRestaurants() {
    try {
        return await prisma.restaurant.findMany({
            where: { isPremium: true },
            orderBy: { rating: "desc" },
        });
    } catch (error) {
        console.error("Error fetching premium restaurants:", error);
        return [];
    }
}

export async function createRestaurant(data: any) {
    try {
        return await prisma.restaurant.create({
            data: {
                name: data.name,
                category: data.category as any,
                rating: Number(data.rating) || 0,
                priceRange: data.priceRange as any || 'MEDIO',
                distance: data.distance || '',
                image: data.image || '',
                featured: data.featured || null,
                address: data.address,
                phone: data.phone || null,
                isFeaturedHome: Boolean(data.isFeaturedHome)
            }
        });
    } catch (error) {
        console.error("Error creating restaurant:", error);
        throw new Error("No se pudo crear el restaurante");
    }
}

export async function updateRestaurant(id: string, data: any) {
    try {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.rating !== undefined) updateData.rating = Number(data.rating);
        if (data.priceRange !== undefined) updateData.priceRange = data.priceRange;
        if (data.distance !== undefined) updateData.distance = data.distance;
        if (data.image !== undefined) updateData.image = data.image;
        if (data.featured !== undefined) updateData.featured = data.featured;
        if (data.address !== undefined) updateData.address = data.address;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.isFeaturedHome !== undefined) updateData.isFeaturedHome = data.isFeaturedHome;
        return await prisma.restaurant.update({ where: { id }, data: updateData });
    } catch (error) {
        console.error("Error updating restaurant:", error);
        throw new Error("No se pudo actualizar el restaurante");
    }
}

export async function deleteRestaurant(id: string) {
    try {
        await prisma.savedItem.deleteMany({ where: { restaurantId: id } });
        await prisma.restaurant.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        console.error("Error deleting restaurant:", error);
        throw new Error("No se pudo eliminar el restaurante");
    }
}
