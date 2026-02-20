"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import TopBar from "@/components/layout/TopBar";
import EmptyState from "@/components/common/EmptyState";
import { Plus, MessageSquare, Clock, Tag as TagIcon, Filter, Flag, ShieldAlert } from "lucide-react";
import styles from "./Avisos.module.css";
import { getNotices } from "@/app/actions/data";

const categories = ["Todos", "Vivienda", "Libros", "Eventos", "Otros"];

export default function AvisosPage() {
    const { data: session, status } = useSession();
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [reportedIds, setReportedIds] = useState<string[]>([]);
    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            const data = await getNotices();
            setNotices(data);
            setLoading(false);
        };
        fetchNotices();
    }, []);

    const handleReport = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("¿Querés reportar este aviso por contenido inapropiado?")) {
            setReportedIds([...reportedIds, id]);
            alert("Gracias por tu reporte. Nuestro equipo lo revisará a la brevedad.");
        }
    };

    const filteredAvisos = (activeCategory === "Todos"
        ? notices
        : notices.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase()))
        .filter(a => !reportedIds.includes(a.id));

    if (status !== "loading" && !session) {
        return (
            <main className="safe-bottom">
                <TopBar />
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h2>Comunidad</h2>
                        <p>Explorá los avisos de la comunidad.</p>
                    </div>
                </div>
                <div className={styles.avisosList}>
                    <motion.div
                        className={styles.guestAvisos}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ShieldAlert size={60} className={styles.guestIcon} />
                        <h3>Contenido Protegido</h3>
                        <p>Solo los miembros verificados pueden interactuar en el tablón de la comunidad.</p>
                    </motion.div>
                </div>
            </main>
        );
    }

    return (
        <main className="safe-bottom">
            <TopBar />

            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h2>Tablón de Avisos</h2>
                    <p>Conectá con otros estudiantes en Pergamino.</p>
                </div>
                <button className={styles.filterBtn}>
                    <Filter size={18} />
                </button>
            </div>

            <div className={styles.categories}>
                {categories.map((cat, i) => (
                    <motion.button
                        key={cat}
                        className={`${styles.catChip} ${activeCategory === cat ? styles.active : ""}`}
                        onClick={() => setActiveCategory(cat)}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        {cat}
                    </motion.button>
                ))}
            </div>

            <div className={styles.avisosList}>
                {loading ? (
                    <div className={styles.loading}>Cargando avisos...</div>
                ) : filteredAvisos.length > 0 ? (
                    filteredAvisos.map((aviso, i) => (
                        <motion.div
                            key={aviso.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07, duration: 0.3 }}
                            whileHover={{ scale: 1.01 }}
                        >
                            <Link href={`/avisos/${aviso.id}`} className={styles.avisoCard}>
                                <div className={styles.avisoHeader}>
                                    <div className={styles.headerLeft}>
                                        <span className={styles.categoryBadge}>{aviso.category}</span>
                                        <span className={styles.time}><Clock size={12} /> {new Date(aviso.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        className={styles.reportBtn}
                                        onClick={(e) => handleReport(e, aviso.id)}
                                        title="Reportar aviso"
                                    >
                                        <Flag size={14} />
                                    </button>
                                </div>
                                <h3 className={styles.avisoTitle}>{aviso.title}</h3>
                                <p className={styles.avisoDesc}>{aviso.description}</p>
                                <div className={styles.avisoFooter}>
                                    <div className={styles.authorInfo}>
                                        <span className={styles.userName}><span>@</span>{aviso.author?.username || aviso.author?.name || "Estudiante"}</span>
                                    </div>
                                    <div className={styles.avisoStats}>
                                        <MessageSquare size={16} />
                                        <span>{aviso._count?.comments || 0}</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                ) : (
                    <EmptyState
                        title="No hay avisos todavía"
                        message="¡Sé el primero en publicar un aviso para la comunidad!"
                    />
                )}
            </div>

            {/* Floating Action Button (FAB) */}
            <Link href="/avisos/nuevo" className={styles.fab} title="Publicar aviso">
                <Plus size={24} color="white" />
            </Link>
        </main>
    );
}
