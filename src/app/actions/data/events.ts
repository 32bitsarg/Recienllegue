"use server";

import { prisma } from "@/lib/prisma";

const isEventPassed = (dateStr: string, timeStr?: string | null): boolean => {
    if (!dateStr) return false;

    const now = new Date();
    let day = now.getDate();
    let month = now.getMonth();
    let year = now.getFullYear();

    // 1. Try "DD/MM" or "DD/MM/YY" or "DD/MM/YYYY"
    const slashMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
    if (slashMatch) {
        day = parseInt(slashMatch[1], 10);
        month = parseInt(slashMatch[2], 10) - 1;
        if (slashMatch[3]) {
            let yStr = slashMatch[3];
            if (yStr.length === 2) year = 2000 + parseInt(yStr, 10);
            else year = parseInt(yStr, 10);
        }
    } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // 2. Try "YYYY-MM-DD"
        const parts = dateStr.split('-');
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2], 10);
    } else {
        // 3. Fallback text like "14 de Marzo, 2026"
        const numMatch = dateStr.match(/\d{1,2}/);
        if (numMatch) day = parseInt(numMatch[0], 10);

        const lowerStr = dateStr.toLowerCase();
        const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        const foundMonth = months.findIndex(m => lowerStr.includes(m));
        if (foundMonth !== -1) month = foundMonth;

        const yearMatch = dateStr.match(/20\d{2}/);
        if (yearMatch) year = parseInt(yearMatch[0], 10);
    }

    const eventDate = new Date(year, month, day);

    // Add time if provided (it usually indicates the start time)
    if (timeStr) {
        let hour = 23;
        let minute = 59;

        const timeMatch = timeStr.match(/(\d{1,2})(?::(\d{2}))?/);
        if (timeMatch) {
            hour = parseInt(timeMatch[1], 10);
            minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
            if (timeStr.toLowerCase().includes('pm') && hour < 12) hour += 12;
            if (timeStr.toLowerCase().includes('am') && hour === 12) hour = 0;
        }
        eventDate.setHours(hour, minute, 0, 0);

        // Como el horario suele ser el de *inicio* del evento, le sumamos unas 
        // 8 horas de duración estimada para que no se oculte mientras está sucediendo.
        eventDate.setHours(eventDate.getHours() + 8);
    } else {
        eventDate.setHours(23, 59, 59, 999);
    }

    return now > eventDate;
};

export async function getCityEvents() {
    try {
        const events = await prisma.cityEvent.findMany({
            orderBy: { date: 'asc' }
        });

        const checkedEvents = await Promise.all(events.map(async (ev) => {
            if (ev.isFeatured && isEventPassed(ev.date, ev.time)) {
                await prisma.cityEvent.update({
                    where: { id: ev.id },
                    data: { isFeatured: false }
                });
                return { ...ev, isFeatured: false };
            }
            return ev;
        }));

        return checkedEvents;
    } catch {
        return [];
    }
}

export async function createCityEvent(data: any) {
    return await prisma.cityEvent.create({ data });
}

export async function updateCityEvent(id: string, data: any) {
    return await prisma.cityEvent.update({ where: { id }, data });
}

export async function deleteCityEvent(id: string) {
    return await prisma.cityEvent.delete({ where: { id } });
}
