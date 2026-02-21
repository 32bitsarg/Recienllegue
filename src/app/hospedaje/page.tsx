"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import EmptyState from "@/components/common/EmptyState";
import { Search, Map as MapIcon, Wifi, User, CheckCircle, ChevronRight, Filter, Star, Building } from "lucide-react";
import styles from "./Hospedaje.module.css";
import { motion } from "framer-motion";
import { getProperties, getUserFavorites } from "@/app/actions/data";
import FavoriteButton from "@/components/common/FavoriteButton";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function HospedajePage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("Residencia");
    const [search, setSearch] = useState("");
    const [hospedajes, setHospedajes] = useState<any[]>([]);
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [data, favorites] = await Promise.all([
                getProperties(),
                session?.user ? getUserFavorites((session.user as any).id) : Promise.resolve({ properties: [], restaurants: [] })
            ]);
            setHospedajes(data);
            setSavedIds(favorites.properties.map(p => p.id));
            setLoading(false);
        };
        loadData();
    }, [session]);

    const filtered = hospedajes.filter(h => {
        const typeMatch = h.type.toLowerCase() === activeTab.toLowerCase();
        const searchMatch = h.title.toLowerCase().includes(search.toLowerCase()) ||
            (h.services as string[] || []).some(s => s.toLowerCase().includes(search.toLowerCase()));
        return typeMatch && searchMatch;
    }).sort((a, b) => {
        // Sponsors first
        if (a.sponsor && !b.sponsor) return -1;
        if (!a.sponsor && b.sponsor) return 1;
        // Then verified
        if (a.verified && !b.verified) return -1;
        if (!a.verified && b.verified) return 1;
        return 0;
    });

    return (
        <main className="safe-bottom">
            <TopBar />

            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Hospedaje</h1>
                    <p>Encontrá tu lugar en Pergamino.</p>
                </header>

                <div className={styles.searchBar}>
                    <Search size={20} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o servicio (ej: wifi)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className={styles.filterBtn}>
                        <Filter size={20} />
                    </button>
                </div>

                <div className={styles.tabs}>
                    {["Residencia", "Departamento", "Casa"].map(tab => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className={styles.list}>
                    {loading ? (
                        <LoadingScreen />
                    ) : filtered.length > 0 ? (
                        filtered.map((h, i) => (
                            <motion.div
                                key={h.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className={`${styles.card} ${h.sponsor ? styles.sponsorCard : ''}`}>
                                    <div className={styles.imageWrapper}>
                                        {h.mainImage ? (
                                            <img src={h.mainImage} alt={h.title} />
                                        ) : (
                                            <div className={styles.imageFallback}>
                                                <img
                                                    src={`https://api.dicebear.com/9.x/shapes/svg?seed=${h.id}&backgroundColor=f1f5f9,e2e8f0,cbd5e1`}
                                                    alt="Generated background"
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1 }}
                                                />
                                                <Building size={48} className={styles.fallbackIcon} />
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Sin imagen disponible</span>
                                            </div>
                                        )}

                                        <div className={styles.badgeList}>
                                            {h.verified && (
                                                <div className={styles.verifiedBadge}>
                                                    <CheckCircle size={12} /> Verificado
                                                </div>
                                            )}
                                            {h.sponsor && (
                                                <div className={styles.sponsorBadge}>
                                                    <Star size={12} fill="white" /> Sponsor
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.priceBadge}>
                                            {Number(h.price) === 0 ? "Consultar precio" : `$${Number(h.price).toLocaleString()} /mes`}
                                        </div>

                                        <FavoriteButton
                                            itemId={h.id}
                                            type="property"
                                            initialIsSaved={savedIds.includes(h.id)}
                                        />
                                    </div>
                                    <Link href={`/hospedaje/${h.id}`} className={styles.cardContent}>
                                        <div className={styles.cardInfo}>
                                            <span className={styles.typeTag}>{h.type}</span>
                                            <span className={styles.distanceTag}>{h.distance}</span>
                                        </div>
                                        <h3 className={styles.cardTitle}>{h.title}</h3>
                                        <p className={styles.cardDescription}>{h.description}</p>
                                        <div className={styles.services}>
                                            <div className={styles.genderItem}>
                                                <User size={12} /> {h.gender}
                                            </div>
                                            {(h.services as string[] || []).map((s: string, idx: number) => (
                                                <span key={idx} className={styles.serviceItem}>{s}</span>
                                            ))}
                                        </div>
                                    </Link>
                                    <div className={styles.cardAction}>
                                        <ChevronRight size={20} color="var(--primary)" />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <EmptyState
                            title="No encontramos hospedajes"
                            message="Probá cambiando el filtro o buscá en otra categoría."
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
