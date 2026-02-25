"use server";

import { prisma } from "@/lib/prisma";

export async function getAdminReports() {
    try {
        return await prisma.report.findMany({
            include: {
                reporter: {
                    select: { name: true, username: true }
                },
                targetNotice: {
                    select: { title: true, id: true }
                },
                targetComment: {
                    select: { content: true, id: true, noticeId: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        console.error("Error fetching admin reports:", error);
        return [];
    }
}

export async function getAdminStats() {
    try {
        const [pendingReports, totalUsers, totalProperties, totalNotices, pendingClaims] = await Promise.all([
            prisma.report.count({ where: { status: "PENDIENTE" } }),
            prisma.user.count(),
            prisma.property.count(),
            prisma.notice.count(),
            prisma.businessClaim.count({ where: { status: "PENDIENTE" } })
        ]);
        return { pendingReports, totalUsers, totalProperties, totalNotices, pendingClaims };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return { pendingReports: 0, totalUsers: 0, totalProperties: 0, totalNotices: 0, pendingClaims: 0 };
    }
}

export async function updateReportStatus(reportId: string, status: 'PENDIENTE' | 'REVISADO' | 'DESESTIMADO') {
    try {
        return await prisma.report.update({
            where: { id: reportId },
            data: { status }
        });
    } catch (error) {
        console.error("Error updating report status:", error);
        throw new Error("No se pudo actualizar el reporte");
    }
}
