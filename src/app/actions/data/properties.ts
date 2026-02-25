"use server";

import { prisma } from "@/lib/prisma";

export async function getProperties() {
    try {
        const properties = await prisma.property.findMany({
            where: { active: true },
            orderBy: { createdAt: "desc" },
        });
        return properties.map(p => ({
            ...p,
            price: Number(p.price)
        }));
    } catch (error) {
        console.error("Error fetching properties:", error);
        return [];
    }
}

export async function getPropertyById(id: string) {
    try {
        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                owner: {
                    select: { name: true, image: true, phone: true }
                }
            }
        });
        if (!property) return null;
        return {
            ...property,
            price: Number(property.price)
        };
    } catch (error) {
        console.error("Error fetching property:", error);
        return null;
    }
}

export async function createProperty(data: any) {
    try {
        return await prisma.property.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type as any,
                price: Number(data.price),
                address: data.address,
                distance: data.distance || '',
                gender: data.gender as any || 'MIXTO',
                verified: data.verified || false,
                sponsor: data.sponsor || false,
                ownerName: data.ownerName,
                ownerPhone: data.ownerPhone,
                mainImage: data.mainImage || '',
                images: data.images || [],
                services: data.services || [],
                ownerId: data.ownerId
            }
        });
    } catch (error) {
        console.error("Error creating property:", error);
        throw new Error("No se pudo crear la propiedad");
    }
}

export async function getAllProperties() {
    try {
        return await prisma.property.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching all properties:", error);
        return [];
    }
}

export async function updateProperty(id: string, data: any) {
    try {
        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.type !== undefined) updateData.type = data.type;
        if (data.price !== undefined) updateData.price = Number(data.price);
        if (data.address !== undefined) updateData.address = data.address;
        if (data.distance !== undefined) updateData.distance = data.distance;
        if (data.gender !== undefined) updateData.gender = data.gender;
        if (data.verified !== undefined) updateData.verified = data.verified;
        if (data.sponsor !== undefined) updateData.sponsor = data.sponsor;
        if (data.ownerName !== undefined) updateData.ownerName = data.ownerName;
        if (data.ownerPhone !== undefined) updateData.ownerPhone = data.ownerPhone;
        if (data.mainImage !== undefined) updateData.mainImage = data.mainImage;
        if (data.images !== undefined) updateData.images = data.images;
        if (data.services !== undefined) updateData.services = data.services;
        if (data.active !== undefined) updateData.active = data.active;
        return await prisma.property.update({ where: { id }, data: updateData });
    } catch (error) {
        console.error("Error updating property:", error);
        throw new Error("No se pudo actualizar la propiedad");
    }
}

export async function deleteProperty(id: string) {
    try {
        await prisma.savedItem.deleteMany({ where: { propertyId: id } });
        await prisma.property.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        console.error("Error deleting property:", error);
        throw new Error("No se pudo eliminar la propiedad");
    }
}
