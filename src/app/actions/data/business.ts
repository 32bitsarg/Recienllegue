"use server";

import { prisma } from "@/lib/prisma";

// ============== BUSINESS CLAIMING ACTIONS ==============

export async function searchClaimableBusinesses(query: string) {
    try {
        const [restaurants, properties] = await Promise.all([
            prisma.restaurant.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { address: { contains: query, mode: 'insensitive' } }
                    ],
                    isVerified: false
                },
                take: 10
            }),
            prisma.property.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { address: { contains: query, mode: 'insensitive' } }
                    ],
                    isVerified: false
                },
                take: 10
            })
        ]);
        return { restaurants, properties };
    } catch (error: any) {
        console.error("Error searching claimable businesses:", error);
        return { restaurants: [], properties: [] };
    }
}

export async function submitBusinessClaim(data: { userId: string, targetId: string, businessType: 'RESTAURANT' | 'PROPERTY', proof: string }) {
    try {
        return await prisma.businessClaim.create({
            data: {
                userId: data.userId,
                targetId: data.targetId,
                businessType: data.businessType,
                proof: data.proof,
                status: 'PENDIENTE'
            }
        });
    } catch (error) {
        console.error("Error submitting business claim:", error);
        throw new Error("No se pudo enviar la solicitud de anexión");
    }
}

export async function admin_getPendingClaims() {
    try {
        const claims = await prisma.businessClaim.findMany({
            where: { status: 'PENDIENTE' },
            include: {
                user: {
                    select: { name: true, username: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Enriquecer con el nombre del negocio
        const enriched = await Promise.all(claims.map(async (claim) => {
            let businessName = `ID: ${claim.targetId.slice(0, 8)}...`;
            let businessAddress = '';
            try {
                if (claim.businessType === 'RESTAURANT') {
                    const r = await prisma.restaurant.findUnique({
                        where: { id: claim.targetId },
                        select: { name: true, address: true }
                    });
                    if (r) { businessName = r.name; businessAddress = r.address; }
                } else {
                    const p = await prisma.property.findUnique({
                        where: { id: claim.targetId },
                        select: { title: true, address: true }
                    });
                    if (p) { businessName = p.title; businessAddress = p.address; }
                }
            } catch { }
            return { ...claim, businessName, businessAddress };
        }));

        return enriched;
    } catch (error) {
        console.error("Error fetching pending claims:", error);
        return [];
    }
}

export async function admin_processClaim(claimId: string, approved: boolean, adminNote?: string) {
    try {
        const claim = await prisma.businessClaim.findUnique({
            where: { id: claimId },
            include: { user: { select: { name: true } } }
        });

        if (!claim) throw new Error("Solicitud no encontrada");

        let businessName = 'tu local';

        if (approved) {
            if (claim.businessType === 'RESTAURANT') {
                const r = await prisma.restaurant.update({
                    where: { id: claim.targetId },
                    data: { ownerId: claim.userId, isVerified: true }
                });
                businessName = r.name;
            } else {
                const p = await prisma.property.update({
                    where: { id: claim.targetId },
                    data: { ownerId: claim.userId, isVerified: true }
                });
                businessName = p.title;
            }

            // Promover a DUENO si era ESTUDIANTE
            const user = await prisma.user.findUnique({ where: { id: claim.userId } });
            if (user && user.role === 'ESTUDIANTE') {
                await prisma.user.update({
                    where: { id: claim.userId },
                    data: { role: 'DUENO' }
                });
            }

            // Notificación de aprobación
            await prisma.notification.create({
                data: {
                    userId: claim.userId,
                    type: 'CLAIM_APPROVED',
                    title: '✅ ¡Tu local fue aprobado!',
                    body: `"${businessName}" fue verificado exitosamente. Ya aparece en la app con el sello de verificado.${adminNote ? `\n\nNota del admin: ${adminNote}` : ''}`,
                    link: '/comida'
                }
            });
        } else {
            // Al rechazar, buscar el nombre antes de eliminarlo
            if (claim.businessType === 'RESTAURANT') {
                try {
                    const restaurant = await prisma.restaurant.findUnique({ where: { id: claim.targetId } });
                    if (restaurant) {
                        businessName = restaurant.name;
                        if (!restaurant.isVerified) {
                            await prisma.savedItem.deleteMany({ where: { restaurantId: claim.targetId } });
                            await prisma.restaurant.delete({ where: { id: claim.targetId } });
                        }
                    }
                } catch (deleteError) {
                    console.error("Error cleaning up rejected restaurant:", deleteError);
                }
            } else {
                try {
                    const property = await prisma.property.findUnique({ where: { id: claim.targetId } });
                    if (property) {
                        businessName = property.title;
                        if (!property.isVerified) {
                            await prisma.savedItem.deleteMany({ where: { propertyId: claim.targetId } });
                            await prisma.property.delete({ where: { id: claim.targetId } });
                        }
                    }
                } catch (deleteError) {
                    console.error("Error cleaning up rejected property:", deleteError);
                }
            }

            // Notificación de rechazo
            await prisma.notification.create({
                data: {
                    userId: claim.userId,
                    type: 'CLAIM_REJECTED',
                    title: '❌ Solicitud no aprobada',
                    body: `La solicitud para "${businessName}" no fue aprobada.${adminNote ? `\n\nMotivo: ${adminNote}` : ' Por favor, revisá los datos y volvé a intentarlo.'}`,
                    link: '/unirse'
                }
            });
        }

        return await prisma.businessClaim.update({
            where: { id: claimId },
            data: {
                status: approved ? 'REVISADO' : 'DESESTIMADO',
                adminNote: adminNote ?? null
            }
        });
    } catch (error) {
        console.error("Error processing claim:", error);
        throw new Error("No se pudo procesar la solicitud");
    }
}

export async function admin_toggleVerified(id: string, type: 'RESTAURANT' | 'PROPERTY', isVerified: boolean) {
    try {
        if (type === 'RESTAURANT') {
            return await prisma.restaurant.update({
                where: { id },
                data: { isVerified }
            });
        } else {
            return await prisma.property.update({
                where: { id },
                data: { isVerified }
            });
        }
    } catch (error) {
        console.error("Error toggling verified status:", error);
        throw new Error("No se pudo actualizar el estado de verificación");
    }
}

export async function admin_setBusinessPremium(id: string, type: 'RESTAURANT' | 'PROPERTY', isPremium: boolean) {
    try {
        if (type === 'RESTAURANT') {
            return await prisma.restaurant.update({
                where: { id },
                data: { isPremium }
            });
        } else {
            return await prisma.property.update({
                where: { id },
                data: { isPremium }
            });
        }
    } catch (error) {
        console.error("Error setting business premium:", error);
        throw new Error("No se pudo actualizar el estado premium");
    }
}

// ============== BUSINESS CREATION ACTIONS ==============

const UNNOBA_COORDS = { lat: -33.913191, lng: -60.588979 };

function calculateWalkingTime(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km

    // We assume a walking speed of 4.5 km/h and a street density factor of 1.4
    const walkingDist = d * 1.4;
    const timeMinutes = Math.round((walkingDist / 4.5) * 60);

    if (timeMinutes < 1) return "Menos de 1 min";
    return `${timeMinutes} min caminando`;
}

export async function registerCustomBusiness(data: {
    name: string,
    address: string,
    category: string,
    image: string,
    images?: string[],   // fotos adicionales
    ownerId: string,
    phone?: string,
    featured?: string,
    priceRange?: string
}) {
    try {
        const searchQuery = `${data.address}, Pergamino, Buenos Aires, Argentina`;
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`, {
            headers: { 'User-Agent': 'ElEstudianteApp/1.0' }
        });
        const geoData = await geoRes.json();

        let lat = UNNOBA_COORDS.lat;
        let lng = UNNOBA_COORDS.lng;
        let distanceStr = "A calcular";

        if (geoData && geoData.length > 0) {
            lat = parseFloat(geoData[0].lat);
            lng = parseFloat(geoData[0].lon);
            distanceStr = calculateWalkingTime(lat, lng, UNNOBA_COORDS.lat, UNNOBA_COORDS.lng);
        }

        const restaurant = await prisma.restaurant.create({
            data: {
                name: data.name,
                category: data.category,
                address: data.address,
                image: data.image,
                images: data.images && data.images.length > 0 ? data.images : [],
                ownerId: data.ownerId,
                distance: distanceStr,
                phone: data.phone,
                featured: data.featured,
                priceRange: (data.priceRange as any) || "MEDIO",
                lat,
                lng,
                isVerified: false,
                rating: 0,
            }
        });

        // Crear BusinessClaim para que el admin lo vea como pendiente
        await prisma.businessClaim.create({
            data: {
                userId: data.ownerId,
                targetId: restaurant.id,
                businessType: "RESTAURANT",
                proof: `Registro nuevo: ${data.name} - ${data.address}`,
                status: "PENDIENTE"
            }
        });

        return { success: true, restaurant };
    } catch (error: any) {
        console.error("Error registering custom business:", error);
        return { error: "No pudimos guardar tu comercio. Intentá de nuevo." };
    }
}

export async function registerCustomProperty(data: {
    title: string,
    description: string,
    address: string,
    type: string,          // RESIDENCIA | DEPARTAMENTO | CASA
    price: number,
    gender: string,        // MIXTO | FEMENINO | MASCULINO
    ownerName: string,
    ownerPhone: string,
    mainImage: string,
    images?: string[],
    services?: string[],
    ownerId: string,
}) {
    try {
        const searchQuery = `${data.address}, Pergamino, Buenos Aires, Argentina`;
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`, {
            headers: { 'User-Agent': 'ElEstudianteApp/1.0' }
        });
        const geoData = await geoRes.json();

        let lat: number | null = null;
        let lng: number | null = null;
        let distanceStr = "A calcular";

        if (geoData && geoData.length > 0) {
            lat = parseFloat(geoData[0].lat);
            lng = parseFloat(geoData[0].lon);
            distanceStr = calculateWalkingTime(lat, lng, UNNOBA_COORDS.lat, UNNOBA_COORDS.lng);
        }

        const property = await prisma.property.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type as any,
                price: data.price,
                address: data.address,
                distance: distanceStr,
                gender: data.gender as any,
                ownerName: data.ownerName,
                ownerPhone: data.ownerPhone,
                mainImage: data.mainImage,
                images: data.images && data.images.length > 0 ? data.images : [],
                services: data.services || [],
                ownerId: data.ownerId,
                lat,
                lng,
                isVerified: false,
                active: true,
            }
        });

        // Crear BusinessClaim para revisión del admin
        await prisma.businessClaim.create({
            data: {
                userId: data.ownerId,
                targetId: property.id,
                businessType: "PROPERTY",
                proof: `Registro nuevo hospedaje: ${data.title} - ${data.address}`,
                status: "PENDIENTE"
            }
        });

        return { success: true, property };
    } catch (error: any) {
        console.error("Error registering custom property:", error);
        return { error: "No pudimos guardar el alojamiento. Intentá de nuevo." };
    }
}
