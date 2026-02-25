"use server";

import { prisma } from "@/lib/prisma";

export async function getTips() {
    try {
        return await prisma.tip.findMany({
            where: { active: true },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching tips:", error);
        return [];
    }
}

export async function getAllTips() {
    try {
        return await prisma.tip.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching all tips:", error);
        return [];
    }
}

export async function createTip(data: { title: string; text: string; emoji?: string }) {
    try {
        return await prisma.tip.create({
            data: {
                title: data.title,
                text: data.text,
                emoji: data.emoji || "💡",
            },
        });
    } catch (error) {
        console.error("Error creating tip:", error);
        throw new Error("No se pudo crear el tip");
    }
}

export async function updateTip(id: string, data: { title?: string; text?: string; emoji?: string; active?: boolean }) {
    try {
        return await prisma.tip.update({
            where: { id },
            data,
        });
    } catch (error) {
        console.error("Error updating tip:", error);
        throw new Error("No se pudo actualizar el tip");
    }
}

export async function deleteTip(id: string) {
    try {
        return await prisma.tip.delete({
            where: { id },
        });
    } catch (error) {
        console.error("Error deleting tip:", error);
        throw new Error("No se pudo eliminar el tip");
    }
}
