"use server";

import { prisma } from "@/lib/prisma";

export async function createUniversitySede(data: any) {
    try {
        return await prisma.universitySede.create({ data });
    } catch (error) {
        console.error("Error creating univ sede:", error);
        throw new Error("No se pudo crear la sede");
    }
}

export async function createUniversityService(data: any) {
    try {
        return await prisma.universityService.create({ data });
    } catch (error) {
        console.error("Error creating univ service:", error);
        throw new Error("No se pudo crear el servicio universitario");
    }
}

export async function getUniversitySedes() {
    try {
        return await prisma.universitySede.findMany({
            orderBy: { name: "asc" }
        });
    } catch (error) {
        console.error("Error fetching univ sedes:", error);
        return [];
    }
}

export async function getUniversityServices() {
    try {
        return await prisma.universityService.findMany({
            orderBy: { title: "asc" }
        });
    } catch (error) {
        console.error("Error fetching univ services:", error);
        return [];
    }
}

export async function updateUniversitySede(id: string, data: any) {
    try {
        return await prisma.universitySede.update({
            where: { id },
            data
        });
    } catch (error) {
        console.error("Error updating univ sede:", error);
        throw new Error("No se pudo actualizar la sede");
    }
}

export async function updateUniversityService(id: string, data: any) {
    try {
        return await prisma.universityService.update({ where: { id }, data });
    } catch (error) {
        console.error("Error updating service:", error);
        throw new Error("No se pudo actualizar el servicio");
    }
}

export async function deleteUniversitySede(id: string) {
    try {
        await prisma.universitySede.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        console.error("Error deleting sede:", error);
        throw new Error("No se pudo eliminar la sede");
    }
}

export async function deleteUniversityService(id: string) {
    try {
        await prisma.universityService.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        console.error("Error deleting service:", error);
        throw new Error("No se pudo eliminar el servicio");
    }
}
