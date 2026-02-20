"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { Bus, Map as MapIcon, Clock, ArrowRightLeft, ExternalLink, Info } from "lucide-react";
import { getTransportLines, getTerminalRoutes } from "@/app/actions/data";
import styles from "./Transporte.module.css";

export default function TransportePage() {
    const [activeTab, setActiveTab] = useState("urbano");
    const [urbanLines, setUrbanLines] = useState<any[]>([]);
    const [terminalRoutes, setTerminalRoutes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                                        <Link href={`/mapa?line=${line.id}`} className={styles.viewRouteBtn}>
                                            Ver recorrido en el mapa <ExternalLink size={14} />
                                        </Link>
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
