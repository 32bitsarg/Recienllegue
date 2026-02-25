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

export async function deleteHealthService(id: string) {
    try {
        await prisma.healthService.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        console.error("Error deleting health service:", error);
        throw new Error("No se pudo eliminar el servicio de salud");
    }
}
