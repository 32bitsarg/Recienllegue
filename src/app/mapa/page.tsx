"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { Search, Info } from "lucide-react";
import { getUniversitySedes, getHealthServices, getTransportLines } from "@/app/actions/data";
import type { MapPOI } from "@/components/map/SurvivalMap";

const SurvivalMap = dynamic(() => import("@/components/map/SurvivalMap"), {
    ssr: false,
    loading: () => (
        <div style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--surface-hover)',
            borderRadius: 'var(--radius-lg)'
        }}>
            <p>Cargando mapa interactivo...</p>
        </div>
    )
});

function MapContent() {
    const searchParams = useSearchParams();
    const activeLine = searchParams.get('line') || undefined;
    const [pois, setPois] = useState<MapPOI[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activePolyline, setActivePolyline] = useState<{ color: string, path: any[] } | undefined>(undefined);

    useEffect(() => {
        const fetchPOIs = async () => {
            const [sedes, health, lines] = await Promise.all([
                getUniversitySedes(),
                getHealthServices(),
                getTransportLines()
            ]);

            const mapPois: MapPOI[] = [];

            // Only add items that have valid coordinates assigned from admin
            sedes.forEach((sede: any) => {
                if (sede.lat && sede.lng && sede.lat !== "0" && sede.lng !== "0") {
                    mapPois.push({
                        id: sede.id,
                        name: sede.name,
                        description: sede.address + (sede.phone ? ` | Tel: ${sede.phone}` : ''),
                        position: [parseFloat(sede.lat), parseFloat(sede.lng)],
                        category: 'university'
                    });
                }
            });

            health.forEach((h: any) => {
                if (h.lat && h.lng && h.lat !== "0" && h.lng !== "0") {
                    mapPois.push({
                        id: h.id,
                        name: h.name,
                        description: (h.address || '') + (h.number ? ` | Tel: ${h.number}` : ''),
                        position: [parseFloat(h.lat), parseFloat(h.lng)],
                        category: 'health'
                    });
                }
            });

            setPois(mapPois);

            if (activeLine) {
                const line: any = lines.find((l: any) => l.id === activeLine);
                if (line && line.kmlFile) {
                    try {
                        const res = await fetch(line.kmlFile);
                        if (res.ok) {
                            const text = await res.text();
                            const matches = [...text.matchAll(/<coordinates>([\s\S]*?)<\/coordinates>/g)];
                            if (matches.length > 0) {
                                const allPaths: [number, number][][] = [];
                                matches.forEach(match => {
                                    const coordsStr = match[1].trim();
                                    const points = coordsStr.split(/\s+/).map((p: string) => {
                                        const parts = p.split(",");
                                        if (parts.length >= 2) {
                                            return [parseFloat(parts[1]), parseFloat(parts[0])] as [number, number];
                                        }
                                        return null;
                                    }).filter((p: any) => p !== null && !isNaN(p[0]) && !isNaN(p[1])) as [number, number][];

                                    if (points.length > 0) {
                                        allPaths.push(points);
                                    }
                                });

                                if (allPaths.length > 0) {
                                    setActivePolyline({ color: line.color, path: allPaths });
                                }
                            }
                        }
                    } catch (e) {
                        console.error("Failed to fetch or parse KML:", e);
                    }
                }
            }
        };

        fetchPOIs();
    }, [activeLine]);

    const filteredPois = searchQuery.trim()
        ? pois.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : pois;

    return (
        <main className="safe-bottom" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <TopBar />

            <div style={{ padding: '0 1.5rem 1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    {activeLine ? `Recorrido Línea ${activeLine}` : "Guía de Supervivencia"}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {activeLine
                        ? "Visualizando ruta en el mapa."
                        : pois.length > 0
                            ? `${pois.length} puntos de interés en el mapa.`
                            : "Puntos clave para tu día a día en Pergamino."
                    }
                </p>
            </div>

            <div style={{ flex: 1, padding: '0 1rem', marginBottom: '1rem', position: 'relative' }}>
                {/* Map Controls Overlay */}
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '2rem',
                    right: '2rem',
                    zIndex: 10,
                    display: 'flex',
                    gap: '0.5rem'
                }}>
                    <div style={{
                        flex: 1,
                        background: 'white',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.6rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: 'var(--shadow)',
                        border: '1px solid var(--border)'
                    }}>
                        <Search size={16} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Buscar lugar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                        />
                    </div>
                </div>

                <div style={{ height: 'calc(100% - 10px)', borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                    <SurvivalMap activeLine={activeLine} pois={filteredPois} activePolyline={activePolyline} />
                </div>

                {/* Legend */}
                <div style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '2rem',
                    background: 'white',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    zIndex: 10
                }}>
                    <Info size={14} color="var(--primary)" />
                    {pois.length > 0 ? "Tocá un marcador para más info" : "Sin POIs cargados aún"}
                </div>
            </div>

            <BottomNav />
        </main>
    );
}

export default function MapPage() {
    return (
        <Suspense fallback={<div>Cargando mapa...</div>}>
            <MapContent />
        </Suspense>
    );
}
