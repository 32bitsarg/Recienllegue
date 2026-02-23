"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { Search, Info } from "lucide-react";
import { getTransportLines } from "@/app/actions/data";
import type { MapPOI } from "@/components/map/SurvivalMap";

const SurvivalMap = dynamic(() => import("@/components/map/SurvivalMap"), {
    ssr: false,
    loading: () => (
        <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-hover)', borderRadius: 'var(--radius-lg)' }}>
            <p>Cargando mapa interactivo...</p>
        </div>
    )
});

export interface MapaInitialData {
    pois: MapPOI[];
}

interface MobileMapaProps {
    initialData: MapaInitialData;
}

function MobileMapaContent({ initialData }: MobileMapaProps) {
    const searchParams = useSearchParams();
    const activeLine = searchParams.get('line') || undefined;
    const [pois, setPois] = useState<MapPOI[]>(initialData.pois);
    const [searchQuery, setSearchQuery] = useState("");
    const [activePolyline, setActivePolyline] = useState<{ color: string; path: any[] } | undefined>(undefined);

    useEffect(() => {
        setPois(initialData.pois);
    }, [initialData.pois]);

    useEffect(() => {
        if (!activeLine) return;
        const loadKML = async () => {
            const lines = await getTransportLines();
            const line = lines.find((l: any) => l.id === activeLine);
            if (line?.kmlFile) {
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
                                    if (parts.length >= 2) return [parseFloat(parts[1]), parseFloat(parts[0])] as [number, number];
                                    return null;
                                }).filter((p: any) => p !== null && !isNaN(p[0]) && !isNaN(p[1])) as [number, number][];
                                if (points.length > 0) allPaths.push(points);
                            });
                            if (allPaths.length > 0) setActivePolyline({ color: line.color, path: allPaths });
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch KML:", e);
                }
            }
        };
        loadKML();
    }, [activeLine]);

    const filteredPois = searchQuery.trim()
        ? pois.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : pois;

    return (
        <div className="">
            <main className="safe-bottom" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <TopBar />
                <div style={{ padding: '0 1.5rem 1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                        {activeLine ? `Recorrido Línea ${activeLine}` : "Guía de Supervivencia"}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {activeLine ? "Visualizando ruta en el mapa." : pois.length > 0 ? `${pois.length} puntos de interés en el mapa.` : "Puntos clave para tu día a día en Pergamino."}
                    </p>
                </div>
                <div style={{ flex: 1, padding: '0 1rem', marginBottom: '1rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', right: '1rem', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
                        <div style={{ flex: 1, background: 'white', borderRadius: 'var(--radius-full)', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
                            <Search size={16} color="var(--text-muted)" />
                            <input type="text" placeholder="Buscar lugar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                        </div>
                    </div>
                    <div style={{ height: 'calc(100% - 10px)', borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                        <SurvivalMap activeLine={activeLine} pois={filteredPois} activePolyline={activePolyline} />
                    </div>
                    <div style={{ position: 'absolute', bottom: '2rem', left: '1rem', background: 'white', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, zIndex: 10 }}>
                        <Info size={14} color="var(--primary)" />
                        {pois.length > 0 ? "Tocá un marcador para más info" : "Sin POIs cargados aún"}
                    </div>
                </div>
                <BottomNav />
            </main>
        </div>
    );
}

export default function MobileMapa(props: MobileMapaProps) {
    return (
        <Suspense fallback={<div className="" style={{ padding: '2rem', textAlign: 'center' }}>Cargando mapa...</div>}>
            <MobileMapaContent {...props} />
        </Suspense>
    );
}
