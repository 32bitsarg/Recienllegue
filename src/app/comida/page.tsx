"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TopBar from "@/components/layout/TopBar";
import EmptyState from "@/components/common/EmptyState";
import { Search, Utensils, Star, Clock, MapPin, ChevronRight, Filter } from "lucide-react";
import styles from "./Comida.module.css";
import { motion } from "framer-motion";
import { getRestaurants, getUserFavorites } from "@/app/actions/data";
import FavoriteButton from "@/components/common/FavoriteButton";

const categories = ["Todos", "Rotisería", "Bar", "Cafetería", "Restaurante"];

export default function ComidaPage() {
    const { data: session } = useSession();
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [data, favorites] = await Promise.all([
                getRestaurants(),
                session?.user ? getUserFavorites((session.user as any).id) : Promise.resolve({ properties: [], restaurants: [] })
            ]);
            setRestaurants(data);
            setSavedIds(favorites.restaurants.map(r => r.id));
            setLoading(false);
        };
        loadData();
    }, [session]);

    const filtered = activeCategory === "Todos"
        ? restaurants
        : restaurants.filter(r => r.category.toLowerCase() === activeCategory.toLowerCase());

    return (
        <main className="safe-bottom">
            <TopBar />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Comida y Ocio</h1>
                    <p>Los mejores lugares para comer cerca de la facu.</p>
                </div>

                <div className={styles.searchSection}>
                    <div className={styles.searchBar}>
                        <Search size={18} color="var(--text-muted)" />
                        <input type="text" placeholder="¿Qué se te antoja?" />
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

                <div className={styles.list}>
                    {loading ? (
                        <div className={styles.loading}>Cargando...</div>
                    ) : filtered.length > 0 ? (
                        filtered.map((res, i) => (
                            <motion.div
                                key={res.id}
                                className={styles.restaurantCard}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className={styles.cardImage}>
                                    <img src={res.image} alt={res.name} />
                                    <div className={styles.ratingBadge}>
                                        <Star size={10} fill="currentColor" />
                                        <span>{res.rating}</span>
                                    </div>
                                    <FavoriteButton
                                        itemId={res.id}
                                        type="restaurant"
                                        initialIsSaved={savedIds.includes(res.id)}
                                    />
                                </div>
                                <div className={styles.cardInfo}>
                                    <div className={styles.mainInfo}>
                                        <h3 className={styles.resName}>{res.name}</h3>
                                        <p className={styles.featuredText}>{res.featured}</p>
                                    </div>
                                    <div className={styles.metaInfo}>
                                        <div className={styles.metaItem}>
                                            <Clock size={14} />
                                            <span>{res.prepTime}</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <MapPin size={14} />
                                            <span>{res.distance}</span>
                                        </div>
                                        <div className={styles.priceTag}>
                                            {res.priceRange === 'BAJO' ? '$' : res.priceRange === 'MEDIO' ? '$$' : '$$$'}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.viewBtn}>
                                    <ChevronRight size={20} />
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <EmptyState
                            title="No hay opciones disponibles"
                            message="En este momento no hay lugares cargados en esta categoría."
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
