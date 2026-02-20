"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { Bus, Map as MapIcon, Clock, ArrowRightLeft, ExternalLink, Info, ChevronDown, ChevronUp } from "lucide-react";
import { getTransportLines, getTerminalRoutes } from "@/app/actions/data";
import styles from "./Transporte.module.css";

const SurvivalMap = dynamic(() => import("@/components/map/SurvivalMap"), {
    ssr: false,
    loading: () => (
        <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-hover)', borderRadius: 'var(--radius-lg)' }}>
            <p>Cargando mapa...</p>
        </div>
    )
});

export default function TransportePage() {
    const [activeTab, setActiveTab] = useState("urbano");
    const [urbanLines, setUrbanLines] = useState<any[]>([]);
    const [terminalRoutes, setTerminalRoutes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [activeMapLineId, setActiveMapLineId] = useState<string | null>(null);
    const [activePolyline, setActivePolyline] = useState<{ color: string, path: any[] } | undefined>(undefined);
    const [mapLoading, setMapLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [lines, routes] = await Promise.all([
                getTransportLines(),
                getTerminalRoutes()
            ]);
            setUrbanLines(lines);
            setTerminalRoutes(routes);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleToggleMap = async (line: any) => {
        if (activeMapLineId === line.id) {
            setActiveMapLineId(null);
            setActivePolyline(undefined);
            return;
        }

        setActiveMapLineId(line.id);
        setActivePolyline(undefined);

        if (line.kmlFile) {
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
                console.error("Failed to fetch KML:", e);
            } finally {
                setMapLoading(false);
            }
        }
    };

    return (
        <main className="safe-bottom">
            <TopBar />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Transporte</h1>
                    <p>Movete por Pergamino y zonas cercanas.</p>
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

                {loading ? (
                    <div className={styles.loading}>Cargando información...</div>
                ) : activeTab === "urbano" ? (
                    <div className={styles.section}>
                        <div className={styles.infoBox}>
                            <Info size={18} className={styles.infoIcon} />
                            <p>En Pergamino el transporte urbano es operado por <strong>La Nueva Perla</strong>. Se abona con tarjeta <strong>SUBE</strong>.</p>
                        </div>

                        {urbanLines.length > 0 ? (
                            <div className={styles.list}>
                                {urbanLines.map((line, i) => (
                                    <motion.div
                                        key={line.id}
                                        className={styles.lineCard}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1, duration: 0.3 }}
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <div className={styles.lineHeader}>
                                            <div className={styles.lineIdentity}>
                                                <div className={styles.colorDot} style={{ backgroundColor: line.color }} />
                                                <span className={styles.lineName}>{line.name}</span>
                                            </div>
                                            <span className={styles.frequency}><Clock size={12} /> {line.frequency}</span>
                                        </div>
                                        <div className={styles.lineRoute}>
                                            <MapIcon size={14} color="var(--text-muted)" />
                                            <span>{line.route}</span>
                                        </div>

                                        <button
                                            onClick={() => handleToggleMap(line)}
                                            className={styles.viewRouteBtn}
                                        >
                                            {activeMapLineId === line.id ? "Ocultar recorrido" : "Ver recorrido en el mapa"}
                                            {activeMapLineId === line.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>

                                        <AnimatePresence>
                                            {activeMapLineId === line.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    style={{ overflow: 'hidden', marginTop: '1rem' }}
                                                >
                                                    <div style={{ height: '300px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                                                        {mapLoading && !activePolyline && (
                                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', zIndex: 10 }}>
                                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cargando ruta...</p>
                                                            </div>
                                                        )}
                                                        <SurvivalMap
                                                            activePolyline={activePolyline}
                                                            pois={[]}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.noData}>No hay líneas urbanas cargadas.</p>
                        )}

                        <a
                            href="https://pergamino.efisat.net/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.liveTrackingBtn}
                        >
                            <Bus size={20} /> Seguimiento en Vivo (Efisat)
                        </a>
                    </div>
                ) : (
                    <div className={styles.section}>
                        {terminalRoutes.length > 0 ? (
                            <div className={styles.list}>
                                {terminalRoutes.map((route, i) => (
                                    <motion.div
                                        key={route.id || i}
                                        className={styles.terminalCard}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08, duration: 0.3 }}
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <div className={styles.terminalSide}>
                                            <span className={styles.company}>{route.company}</span>
                                            <span className={styles.destination}>
                                                Pergamino <ArrowRightLeft size={12} /> {route.destination}
                                            </span>
                                        </div>
                                        <div className={styles.terminalInfo}>
                                            <span className={styles.typeBadge}>{route.type}</span>
                                            <span className={styles.terminalFreq}>{route.frequency}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.noData}>No hay rutas de terminal cargadas.</p>
                        )}
                    </div>
                )}
            </div>

            <BottomNav />
        </main>
    );
}
