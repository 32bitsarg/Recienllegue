"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Bus, Map as MapIcon, Clock, ArrowRightLeft, Info } from "lucide-react";
import type { TransporteInitialData } from "@/components/mobile/MobileTransporte";
import styles from "./DesktopTransporte.module.css";

const SurvivalMap = dynamic(() => import("@/components/map/SurvivalMap"), {
    ssr: false,
    loading: () => (
        <div className={styles.mapLoading}>Cargando mapa...</div>
    )
});

interface DesktopTransporteProps {
    initialData: TransporteInitialData;
}

export default function DesktopTransporte({ initialData }: DesktopTransporteProps) {
    const [activeTab, setActiveTab] = useState<"urbano" | "terminal">("urbano");
    const { urbanLines, terminalRoutes } = initialData;

    const [activeMapLineId, setActiveMapLineId] = useState<string | null>(null);
    const [activePolyline, setActivePolyline] = useState<{ color: string; path: any[] } | undefined>(undefined);
    const [mapLoading, setMapLoading] = useState(false);

    const handleSelectLine = async (line: any) => {
        const isSame = activeMapLineId === line.id;
        setActiveMapLineId(isSame ? null : line.id);
        setActivePolyline(undefined);

        if (isSame || !line.kmlFile) return;

        setMapLoading(true);
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
                        if (points.length > 0) allPaths.push(points);
                    });
                    if (allPaths.length > 0) {
                        setActivePolyline({ color: line.color, path: allPaths });
                    }
                }
            }
        } catch (e) {
            console.error("Failed to fetch KML:", e);
        } finally {
            setMapLoading(false);
        }
    };

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerText}>
                    <h1>Transporte</h1>
                    <p>Colectivos urbanos y rutas desde la terminal.</p>
                </div>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === "urbano" ? styles.active : ""}`}
                        onClick={() => setActiveTab("urbano")}
                    >
                        Urbano (Colectivos)
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "terminal" ? styles.active : ""}`}
                        onClick={() => setActiveTab("terminal")}
                    >
                        Terminal (Viajes)
                    </button>
                </div>
            </header>

            {activeTab === "urbano" ? (
                <div className={styles.contentArea}>
                    <div className={styles.infoBanner}>
                        <Info size={22} />
                        <p>En Pergamino el transporte urbano es operado por <strong>La Nueva Perla</strong>. Se abona con tarjeta <strong>SUBE</strong>.</p>
                    </div>

                    {urbanLines.length > 0 ? (
                        <div className={styles.urbanoLayout}>
                            <div className={styles.linesList}>
                                {urbanLines.map((line, i) => (
                                    <motion.button
                                        key={line.id}
                                        type="button"
                                        className={`${styles.lineCard} ${activeMapLineId === line.id ? styles.active : ""}`}
                                        onClick={() => handleSelectLine(line)}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                    >
                                        <div className={styles.lineCardHeader}>
                                            <span className={styles.lineName}>
                                                <span className={styles.colorDot} style={{ backgroundColor: line.color }} />
                                                {line.name}
                                            </span>
                                            <span className={styles.frequency}>
                                                <Clock size={12} /> {line.frequency}
                                            </span>
                                        </div>
                                        <div className={styles.lineRoute}>
                                            <MapIcon size={14} />
                                            <span>{line.route}</span>
                                        </div>
                                    </motion.button>
                                ))}

                                <a
                                    href="https://pergamino.efisat.net/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.efisatCta}
                                >
                                    <Bus size={22} /> Seguimiento en Vivo (Efisat)
                                </a>
                            </div>

                            <div className={styles.mapPanel}>
                                <AnimatePresence mode="wait">
                                    {!activeMapLineId ? (
                                        <motion.div
                                            key="placeholder"
                                            className={styles.mapPlaceholder}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <MapIcon size={64} />
                                            <p><strong>Seleccioná una línea</strong></p>
                                            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Hacé clic en una línea de la lista para ver su recorrido en el mapa.</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={activeMapLineId}
                                            className={styles.mapWrapper}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            {mapLoading && !activePolyline && (
                                                <div className={styles.mapLoading}>Cargando ruta...</div>
                                            )}
                                            <SurvivalMap activePolyline={activePolyline} pois={[]} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.noData}>No hay líneas urbanas cargadas.                        </div>
                    )}
                </div>
            ) : (
                <div className={`${styles.contentArea} ${styles.terminalLayout}`}>
                    {terminalRoutes.length > 0 ? (
                        <div className={styles.terminalGrid}>
                            {terminalRoutes.map((route, i) => (
                                <motion.div
                                    key={route.id || i}
                                    className={styles.terminalCard}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <div className={styles.terminalMain}>
                                        <span className={styles.terminalCompany}>{route.company}</span>
                                        <span className={styles.terminalRoute}>
                                            Pergamino <ArrowRightLeft size={14} /> {route.destination}
                                        </span>
                                    </div>
                                    <div className={styles.terminalMeta}>
                                        <span className={styles.terminalType}>{route.type}</span>
                                        <span className={styles.terminalFreq}>{route.frequency}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noData}>No hay rutas de terminal cargadas.</div>
                    )}
                </div>
            )}
        </main>
    );
}
