"use server";

import { prisma } from "@/lib/prisma";

export async function getMyNotifications(userId: string) {
    try {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
}

export async function markNotificationsRead(userId: string) {
    try {
        await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true }
        });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
    }
}

export async function getUnreadNotificationCount(userId: string) {
    try {
        return await prisma.notification.count({
            where: { userId, read: false }
        });
    } catch (error) {
        console.error("Error counting notifications:", error);
        return 0;
    }
}
