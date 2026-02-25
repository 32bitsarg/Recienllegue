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
import { useRouter } from "next/navigation";
import { BadgeCheck as BadgeCheckIcon } from "lucide-react";

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
    const router = useRouter();

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
        const result = restaurants.filter(r => {
            const matchesCategory = activeCategory === "Todos" || normalize(r.category) === normalize(activeCategory);
            const matchesSearch = searchQuery === "" ||
                normalize(r.name).includes(normalize(searchQuery)) ||
                normalize(r.category).includes(normalize(searchQuery));
            return matchesCategory && matchesSearch;
        });

        return [...result].sort((a, b) => {
            if (a.isPremium && !b.isPremium) return -1;
            if (!a.isPremium && b.isPremium) return 1;
            if (a.isVerified && !b.isVerified) return -1;
            if (!a.isVerified && b.isVerified) return 1;
            return 0;
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
                <div className={styles.verifiedBanner} onClick={() => router.push('/unirse')} style={{ cursor: 'pointer' }}>
                    <BadgeCheckIcon size={22} color="var(--primary)" />
                    <span>
                        <strong>¿Sos dueño de un local?</strong> Verificá tu comercio para destacar con insignias y mantener tus datos al día. <strong>Tocá acá para empezar.</strong>
                    </span>
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
                                className={styles.cardWrapper}
                            >
                                <div className={`${styles.card} ${r.isPremium ? styles.premium : ""} ${r.isVerified && !r.isPremium ? styles.verified : ""}`}>
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
                                        <div className={styles.titleRow}>
                                            <h3 className={styles.name}>{r.name}</h3>
                                            {r.isPremium ? (
                                                <BadgeCheckIcon size={20} className={styles.premiumCheck} fill="var(--success)" color="white" />
                                            ) : r.isVerified ? (
                                                <BadgeCheckIcon size={20} className={styles.verifiedCheck} fill="#94a3b8" color="white" />
                                            ) : null}
                                        </div>
                                        <span className={styles.category}>{r.category}</span>
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
                                <div className={styles.modalTitleRow}>
                                    <h2>{selectedRestaurant.name}</h2>
                                    {selectedRestaurant.isPremium ? (
                                        <BadgeCheckIcon size={32} className={styles.premiumCheck} fill="var(--success)" color="white" />
                                    ) : selectedRestaurant.isVerified ? (
                                        <BadgeCheckIcon size={32} className={styles.verifiedCheck} fill="#94a3b8" color="white" />
                                    ) : null}
                                </div>
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
