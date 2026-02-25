"use server";

import { prisma } from "@/lib/prisma";

export async function createTransportLine(data: any) {
    try {
        return await prisma.transportLine.create({ data });
    } catch (error) {
        console.error("Error creating transport line:", error);
        throw new Error("No se pudo crear la línea de transporte");
    }
}

export async function getTransportLines() {
    try {
        return await prisma.transportLine.findMany({
            orderBy: { name: "asc" }
        });
    } catch (error) {
        console.error("Error fetching transport lines:", error);
        return [];
    }
}

export async function createTerminalRoute(data: any) {
    try {
        return await prisma.terminalRoute.create({ data });
    } catch (error) {
        console.error("Error creating terminal route:", error);
        throw new Error("No se pudo crear la ruta de terminal");
    }
}

export async function getTerminalRoutes() {
    try {
        return await prisma.terminalRoute.findMany({
            orderBy: { destination: "asc" }
        });
    } catch (error) {
        console.error("Error fetching terminal routes:", error);
        return [];
    }
}

export async function updateTransportLine(id: string, data: any) {
    try {
        return await prisma.transportLine.update({ where: { id }, data });
    } catch (error) {
        console.error("Error updating transport line:", error);
        throw new Error("No se pudo actualizar la línea");
    }
}

export async function deleteTransportLine(id: string) {
    try {
        await prisma.transportLine.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        console.error("Error deleting transport line:", error);
        throw new Error("No se pudo eliminar la línea");
    }
}

export async function updateTerminalRoute(id: string, data: any) {
    try {
        return await prisma.terminalRoute.update({ where: { id }, data });
    } catch (error) {
        console.error("Error updating terminal route:", error);
        throw new Error("No se pudo actualizar la ruta");
    }
}

export async function deleteTerminalRoute(id: string) {
    try {
        await prisma.terminalRoute.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        console.error("Error deleting terminal route:", error);
        throw new Error("No se pudo eliminar la ruta");
    }
}
