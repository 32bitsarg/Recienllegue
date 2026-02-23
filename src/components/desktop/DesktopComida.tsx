"use client";

import { useEffect, useState, useMemo, memo } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Search, Utensils, Star, MapPin, Clock, BadgeCheck, Phone, X, ChevronRight, MessageSquare } from "lucide-react";
import { getRestaurants, getUserFavorites } from "@/app/actions/data";
import FavoriteButton from "@/components/common/FavoriteButton";
import LoadingScreen from "@/components/common/LoadingScreen";
import styles from "./DesktopComida.module.css";
import { motion, AnimatePresence } from "framer-motion";

interface DesktopComidaProps {
    initialData?: {
        restaurants: any[];
        savedIds: string[];
    };
}

const DesktopComida = memo(function DesktopComida({ initialData }: DesktopComidaProps) {
    const { data: session } = useSession();
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [searchQuery, setSearchQuery] = useState("");
    const [restaurants, setRestaurants] = useState<any[]>(initialData?.restaurants || []);
    const [savedIds, setSavedIds] = useState<string[]>(initialData?.savedIds || []);
    const [loading, setLoading] = useState(!initialData);
    const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);

    const userId = session?.user ? (session.user as any).id : null;

    useEffect(() => {
        if (initialData) return;
        let isMounted = true;
        const loadData = async () => {
            try {
                const [data, favorites] = await Promise.all([
                    getRestaurants(),
                    userId ? getUserFavorites(userId) : Promise.resolve({ properties: [], restaurants: [] })
                ]);
                if (isMounted) {
                    setRestaurants(data);
                    setSavedIds(favorites.restaurants.map((r: any) => r.id));
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error loading restaurants:", error);
                if (isMounted) setLoading(false);
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, [userId]);

    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const filtered = useMemo(() => {
        return restaurants.filter(r => {
            const matchesCategory = activeCategory === "Todos" || normalize(r.category) === normalize(activeCategory);
            const matchesSearch = searchQuery === "" ||
                normalize(r.name).includes(normalize(searchQuery)) ||
                normalize(r.category).includes(normalize(searchQuery));
            return matchesCategory && matchesSearch;
        });
    }, [restaurants, activeCategory, searchQuery]);

    const categories = useMemo(() => {
        const rawCategories = Array.from(new Set(restaurants.map(r => r.category).filter(Boolean)));
        return ["Todos", ...rawCategories.sort()];
    }, [restaurants]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>Donde Comer & Comprar</h1>
                    <p>Encontrá los mejores lugares de Pergamino recomendados por la comunidad.</p>
                </div>
                <div className={styles.searchBox}>
                    <Search size={22} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, comida o categoría..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <div className={styles.topInfo}>
                <div className={styles.verifiedBanner}>
                    <BadgeCheck size={20} />
                    <span><strong>Locales Verificados:</strong> Los sitios con este icono mantienen sus datos y promociones al día.</span>
                </div>
            </div>

            <section className={styles.filterSection}>
                <div className={styles.categoryGrid}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.categoryTag} ${activeCategory === cat ? styles.activeTag : ""}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            <div className={styles.contentArea}>
                {loading ? (
                    <div className={styles.loadingWrapper}><LoadingScreen /></div>
                ) : (
                    <div className={styles.grid}>
                        {filtered.map((r, i) => (
                            <motion.div
                                key={r.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.02 }}
                                onClick={() => setSelectedRestaurant(r)}
                            >
                                <div className={styles.card}>
                                    <div className={styles.imageSection}>
                                        {r.image ? (
                                            <Image
                                                src={r.image}
                                                alt={r.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Utensils size={40} style={{ opacity: 0.2 }} />
                                            </div>
                                        )}
                                        <FavoriteButton
                                            itemId={r.id}
                                            type="restaurant"
                                            initialIsSaved={savedIds.includes(r.id)}
                                        />
                                    </div>
                                    <div className={styles.cardBody}>
                                        <span className={styles.category}>{r.category}</span>
                                        <h3 className={styles.name}>{r.name}</h3>
                                        <div className={styles.meta}>
                                            <div className={styles.metaRow}><MapPin size={14} /> {r.address}</div>
                                            {r.rating && <div className={styles.metaRow}><Star size={14} fill="var(--warning)" color="var(--warning)" /> {r.rating}</div>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedRestaurant && (
                    <div className={styles.modalOverlay} onClick={() => setSelectedRestaurant(null)}>
                        <motion.div
                            className={styles.modalContent}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                {selectedRestaurant.image && (
                                    <Image
                                        src={selectedRestaurant.image}
                                        alt={selectedRestaurant.name}
                                        fill
                                        sizes="600px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                )}
                                <button className={styles.closeBtn} onClick={() => setSelectedRestaurant(null)}><X size={24} /></button>
                            </div>
                            <div className={styles.modalBody}>
                                <span className={styles.category}>{selectedRestaurant.category}</span>
                                <h2>{selectedRestaurant.name}</h2>
                                <p className={styles.modalDesc}>{selectedRestaurant.description}</p>
                                <div className={styles.modalActions}>
                                    {selectedRestaurant.phone && <a href={`tel:${selectedRestaurant.phone}`} className={styles.callBtn}><Phone size={20} /> Llamar ahora</a>}
                                    {selectedRestaurant.location && <a href={selectedRestaurant.location} target="_blank" className={styles.mapBtn}><MapPin size={20} /> Ver mapa</a>}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default DesktopComida;
