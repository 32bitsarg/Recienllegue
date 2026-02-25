"use server";

import { prisma } from "@/lib/prisma";

// Helper to generate slugs
function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

export async function getNotices() {
    try {
        return await prisma.notice.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                        username: true,
                        avatarSeed: true,
                        role: true
                    }
                },
                _count: {
                    select: { comments: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching notices:", error);
        return [];
    }
}

export async function getNoticeById(id: string) {
    try {
        return await prisma.notice.findFirst({
            where: {
                OR: [
                    { id },
                    { slug: id }
                ]
            },
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        avatarSeed: true,
                        image: true,
                        role: true
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: { name: true, username: true, avatarSeed: true, role: true }
                        }
                    },
                    orderBy: { createdAt: "asc" }
                }
            }
        });
    } catch (error) {
        console.error("Error fetching notice:", error);
        return null;
    }
}

export async function createNotice(data: { title: string, description: string, category: string, authorId: string }) {
    try {
        const baseSlug = slugify(data.title);
        // Generar un slug único agregando una parte aleatoria
        const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

        return await prisma.notice.create({
            data: {
                title: data.title,
                slug: slug,
                description: data.description,
                category: data.category as any,
                authorId: data.authorId
            }
        });
    } catch (error) {
        console.error("Error creating notice:", error);
        throw new Error("No se pudo crear el aviso");
    }
}

export async function backfillNoticeSlugs() {
    try {
        const notices = await prisma.notice.findMany({
            where: {
                OR: [
                    { slug: "" },
                    { slug: null as any }
                ]
            }
        });

        for (const notice of notices) {
            const baseSlug = slugify(notice.title);
            const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
            await prisma.notice.update({
                where: { id: notice.id },
                data: { slug }
            });
        }
        return { success: true, count: notices.length };
    } catch (error) {
        console.error("Error backfilling slugs:", error);
        return { success: false, error };
    }
}

export async function getUserNotices(userId: string) {
    try {
        return await prisma.notice.findMany({
            where: { authorId: userId },
            include: {
                _count: {
                    select: { comments: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching user notices:", error);
        return [];
    }
}

export async function deleteNotice(noticeId: string) {
    try {
        await prisma.notice.delete({
            where: { id: noticeId }
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting notice:", error);
        throw new Error("No se pudo eliminar el aviso");
    }
}

export async function reportNotice(noticeId: string, reporterId: string, reason: string = "Contenido inapropiado") {
    try {
        const report = await prisma.report.create({
            data: {
                targetNoticeId: noticeId,
                reporterId: reporterId,
                reason: reason,
                status: "PENDIENTE"
            }
        });

        await prisma.notice.update({
            where: { id: noticeId },
            data: { isReported: true }
        });

        return { success: true, reportId: report.id };
    } catch (error) {
        console.error("Error reporting notice:", error);
        throw new Error("No se pudo procesar el reporte");
    }
}

export async function updateNotice(noticeId: string, data: { title: string, description: string, category: string }) {
    try {
        return await prisma.notice.update({
            where: { id: noticeId },
            data: {
                title: data.title,
                description: data.description,
                category: data.category as any
            }
        });
    } catch (error) {
        console.error("Error updating notice:", error);
        throw new Error("No se pudo actualizar el aviso");
    }
}

export async function addComment(noticeId: string, authorId: string, content: string) {
    try {
        return await prisma.noticeComment.create({
            data: {
                content,
                noticeId,
                authorId
            },
            include: {
                author: {
                    select: { name: true, username: true, avatarSeed: true, role: true }
                }
            }
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        throw new Error("No se pudo publicar el comentario");
    }
}

export async function deleteComment(commentId: string) {
    try {
        await prisma.noticeComment.delete({
            where: { id: commentId }
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw new Error("No se pudo eliminar el comentario");
    }
}
