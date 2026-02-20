"use server";

import { prisma } from "@/lib/prisma";
import * as cheerio from "cheerio";

export async function getOndutyPharmacies() {
    try {
        const url = "http://www.ampergamino.com.ar/index.php?seccion_generica_id=1430";
        const res = await fetch(url, { next: { revalidate: 14400 } }); // Cache for 4 hours (14400s) para interceptar el cambio de la mañana
        const buffer = await res.arrayBuffer();
        const decoder = new TextDecoder('iso-8859-1');
        const text = decoder.decode(buffer);
        const $ = cheerio.load(text);

        let pharmacies: { name: string, address: string, phone: string }[] = [];
        let dateInfo = "";

        // The date is usually in a td containing "El turno comienza"
        $('td').each((_, el) => {
            const content = $(el).text().trim().replace(/\s+/g, ' ');
            if (content.includes("El turno comienza")) {
                const match = content.match(/.*?El turno comienza.*?siguiente\.?/i);
                dateInfo = match ? match[0].trim() : content;
            } else if (content.includes("Tel. (02477)") || content.includes("Tel.") || content.includes("Tel: (02477)")) {
                // Ignore the general footer info
                if (content.includes("comunicacion@ampergamino.com.ar")) return;

                // Usually "NAME Address Tel. (02477) 123456"
                // Split by "Tel."
                const parts = content.split(/Tel\.? /i);
                if (parts.length >= 2) {
                    const nameAndAddress = parts[0].trim();
                    const phone = "Tel. " + parts[1].trim();

                    // The name is usually uppercase. Let's split by the first space after uppercase words
                    // Simple approach: the first word or two are uppercase for name.
                    const words = nameAndAddress.split(' ');
                    let nameParts = [];
                    let addressParts = [];
                    let foundAddress = false;

                    for (const word of words) {
                        if (!foundAddress && word === word.toUpperCase() && word.length > 2) {
                            nameParts.push(word);
                        } else {
                            foundAddress = true;
                            addressParts.push(word);
                        }
                    }

                    if (nameParts.length === 0) {
                        nameParts = [words[0]];
                        addressParts = words.slice(1);
                    }

                    pharmacies.push({
                        name: nameParts.join(' '),
                        address: addressParts.join(' '),
                        phone: phone
                    });
                }
            }
        });

        // if the basic simple parser fails, grab explicit elements
        // Many times they are consecutive lines in the table. 
        // We ensure uniqueness by checking address.
        const uniquePharmacies = Array.from(new Map(pharmacies.map(p => [p.name + p.address, p])).values());

        return {
            date: dateInfo,
            pharmacies: uniquePharmacies
        };
    } catch (error) {
        console.error("Error fetching on-duty pharmacies:", error);
        return { date: "", pharmacies: [] };
    }
}

export async function getProperties() {
    try {
        return await prisma.property.findMany({
            where: { active: true },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching properties:", error);
        return [];
    }
}

export async function getRestaurants() {
    try {
        return await prisma.restaurant.findMany({
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

export async function getHealthServices() {
    try {
        return await prisma.healthService.findMany({
            orderBy: { type: "asc" },
        });
    } catch (error) {
        console.error("Error fetching health services:", error);
        return [];
    }
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
                        avatarSeed: true
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

export async function getPropertyById(id: string) {
    try {
        return await prisma.property.findUnique({
            where: { id },
            include: {
                owner: {
                    select: { name: true, image: true, phone: true }
                }
            }
        });
    } catch (error) {
        console.error("Error fetching property:", error);
        return null;
    }
}
export async function getNoticeById(id: string) {
    try {
        return await prisma.notice.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        avatarSeed: true,
                        image: true
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                name: true,
                                username: true,
                                avatarSeed: true,
                                image: true
                            }
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
        return await prisma.notice.create({
            data: {
                title: data.title,
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
                    select: { name: true, username: true, avatarSeed: true }
                }
            }
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        throw new Error("No se pudo publicar el comentario");
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
        const [pendingReports, totalUsers, totalProperties, totalNotices] = await Promise.all([
            prisma.report.count({ where: { status: "PENDIENTE" } }),
            prisma.user.count(),
            prisma.property.count(),
            prisma.notice.count()
        ]);
        return { pendingReports, totalUsers, totalProperties, totalNotices };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return { pendingReports: 0, totalUsers: 0, totalProperties: 0, totalNotices: 0 };
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
                isFeaturedHome: Boolean(data.isFeaturedHome)
            }
        });
    } catch (error) {
        console.error("Error creating restaurant:", error);
        throw new Error("No se pudo crear el restaurante");
    }
}

export async function createHealthService(data: any) {
    try {
        return await prisma.healthService.create({
            data: {
                name: data.name,
                number: data.number,
                type: data.type as any,
                address: data.address || null,
                details: data.details || null,
                lat: data.lat || null,
                lng: data.lng || null
            }
        });
    } catch (error) {
        console.error("Error creating health service:", error);
        throw new Error("No se pudo crear el servicio de salud");
    }
}

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

export async function updateHealthService(id: string, data: any) {
    try {
        return await prisma.healthService.update({
            where: { id },
            data
        });
    } catch (error) {
        console.error("Error updating health service:", error);
        throw new Error("No se pudo actualizar el servicio");
    }
}

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

// ============== PROPERTY UPDATE/DELETE ==============

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

// ============== RESTAURANT UPDATE/DELETE ==============

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

// ============== HEALTH SERVICE DELETE ==============

export async function deleteHealthService(id: string) {
    try {
        await prisma.healthService.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        console.error("Error deleting health service:", error);
        throw new Error("No se pudo eliminar el servicio de salud");
    }
}

// ============== UNIVERSITY SEDE/SERVICE DELETE ==============

export async function deleteUniversitySede(id: string) {
    try {
        await prisma.universitySede.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        console.error("Error deleting sede:", error);
        throw new Error("No se pudo eliminar la sede");
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

export async function deleteUniversityService(id: string) {
    try {
        await prisma.universityService.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        console.error("Error deleting service:", error);
        throw new Error("No se pudo eliminar el servicio");
    }
}

// ============== TRANSPORT UPDATE/DELETE ==============

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

// ============== TIPS ==============

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

// ============== USER MANAGEMENT ==============

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

// ============== GLOBAL SEARCH ==============

export async function globalSearch(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const [properties, restaurants, health, unnoba, transport, notices] = await Promise.all([
            prisma.property.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { address: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ],
                    active: true
                },
                take: 5
            }),
            prisma.restaurant.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { address: { contains: query, mode: 'insensitive' } },
                        { featured: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: 5
            }),
            prisma.healthService.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { address: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: 5
            }),
            prisma.universitySede.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { address: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: 3
            }),
            prisma.transportLine.findMany({
                where: {
                    name: { contains: query, mode: 'insensitive' }
                },
                take: 3
            }),
            prisma.notice.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: 5
            })
        ]);

        const results: any[] = [
            ...properties.map(p => ({ id: p.id, title: p.title, subtitle: p.address, type: 'Hospedaje', link: `/hospedaje/${p.id}`, iconName: 'Home' })),
            ...restaurants.map(r => ({ id: r.id, title: r.name, subtitle: r.address, type: 'Comida', link: `/comida?id=${r.id}`, iconName: 'Utensils' })),
            ...health.map(h => ({ id: h.id, title: h.name, subtitle: h.address, type: h.type, link: `/salud`, iconName: 'Heart' })),
            ...unnoba.map(u => ({ id: u.id, title: u.name, subtitle: u.address, type: 'UNNOBA', link: `/unnoba`, iconName: 'GraduationCap' })),
            ...transport.map(t => ({ id: t.id, title: t.name, subtitle: `Línea de transporte`, type: 'Transporte', link: `/transporte`, iconName: 'Bus' })),
            ...notices.map(n => ({ id: n.id, title: n.title, subtitle: n.category, type: 'Aviso', link: `/avisos/${n.id}`, iconName: 'MessageSquare' }))
        ];

        return results;
    } catch (error) {
        console.error("Error in globalSearch:", error);
        return [];
    }
}

