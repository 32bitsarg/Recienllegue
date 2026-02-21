"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TopBar from "@/components/layout/TopBar";
import EmptyState from "@/components/common/EmptyState";
import { Search, Utensils, Star, Clock, MapPin, ChevronRight, Filter, X, Phone, BadgeCheck } from "lucide-react";
import styles from "./Comida.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { getRestaurants, getUserFavorites } from "@/app/actions/data";
import FavoriteButton from "@/components/common/FavoriteButton";
import LoadingScreen from "@/components/common/LoadingScreen";



export default function ComidaPage() {
    const { data: session } = useSession();
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, searchQuery]);

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

    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const filtered = restaurants.filter(r => {
        const matchesCategory = activeCategory === "Todos" || normalize(r.category) === normalize(activeCategory);
        const matchesSearch = searchQuery === "" ||
            normalize(r.name).includes(normalize(searchQuery)) ||
            normalize(r.category).includes(normalize(searchQuery));
        return matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Obtener las categorías únicas de los restaurantes reales
    const rawCategories = Array.from(new Set(restaurants.map(r => r.category).filter(Boolean)));
    const categories = ["Todos", ...rawCategories.sort()];

    return (
        <main className="safe-bottom">
            <TopBar />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Comercios</h1>
                    <p>Explorá restaurantes y locales en Pergamino.</p>
                </div>

                <div className={styles.infoBanner}>
                    <BadgeCheck size={20} className={styles.infoIcon} />
                    <p>
                        Información obtenida automáticamente de <strong>Google Maps</strong>.
                        Los locales que muestren este icono <BadgeCheck size={14} style={{ display: 'inline', color: 'var(--secondary)', verticalAlign: 'middle' }} /> indican que su dueño <strong>verificó y actualizó</strong> sus datos en nuestra app.
                    </p>
                </div>

                <div className={styles.searchSection}>
                    <div className={styles.searchBar}>
                        <Search size={18} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="¿Qué se te antoja?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className={styles.filterBtn}>
                        <Filter size={18} />
                    </button>
                </div>

                <div className={styles.sectionHeader}>
                    <h3>Filtros</h3>
                    <div className={styles.scrollHint}>
                        <span>Deslizar</span>
                        <ChevronRight size={14} />
                    </div>
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
                        <LoadingScreen />
                    ) : currentItems.length > 0 ? (
                        currentItems.map((res, i) => (
                            <motion.div
                                key={res.id}
                                className={styles.restaurantCard}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.01 }}
                                onClick={() => setSelectedRestaurant(res)}
                            >
                                <div className={styles.cardImage}>
                                    {res.image ? (
                                        <img src={res.image} alt={res.name} />
                                    ) : (
                                        <div className={styles.imageFallback}>
                                            <img
                                                src={`https://api.dicebear.com/9.x/shapes/svg?seed=${res.id}&backgroundColor=f1f5f9,e2e8f0,cbd5e1`}
                                                alt="Generated background"
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1 }}
                                            />
                                            <Utensils size={32} style={{ opacity: 0.2 }} />
                                        </div>
                                    )}
                                    <div className={styles.ratingBadge}>
                                        <Star size={10} fill="currentColor" />
                                        <span>{res.rating}</span>
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <FavoriteButton
                                            itemId={res.id}
                                            type="restaurant"
                                            initialIsSaved={savedIds.includes(res.id)}
                                        />
                                    </div>
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

                {!loading && totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.pageBtn}
                            disabled={currentPage === 1}
                            onClick={() => {
                                setCurrentPage(p => p - 1);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePage : ''}`}
                                onClick={() => {
                                    setCurrentPage(i + 1);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className={styles.pageBtn}
                            disabled={currentPage === totalPages}
                            onClick={() => {
                                setCurrentPage(p => p + 1);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedRestaurant && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedRestaurant(null)}
                    >
                        <motion.div
                            className={styles.modalContent}
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                {selectedRestaurant.image ? (
                                    <img src={selectedRestaurant.image} alt={selectedRestaurant.name} />
                                ) : (
                                    <div className={styles.imageFallback} style={{ height: '100%' }}>
                                        <Utensils size={48} style={{ opacity: 0.2 }} />
                                    </div>
                                )}
                                <button className={styles.modalCloseBtn} onClick={() => setSelectedRestaurant(null)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.modalCategory}>{selectedRestaurant.category || "General"}</div>
                                <h2 className={styles.modalTitle}>{selectedRestaurant.name}</h2>
                                {selectedRestaurant.featured && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{selectedRestaurant.featured}</p>}

                                <div className={styles.modalDetails}>
                                    {selectedRestaurant.address && (
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedRestaurant.address + ", Pergamino, Buenos Aires")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.modalDetailRow}
                                            style={{ textDecoration: 'none', cursor: 'pointer' }}
                                        >
                                            <MapPin size={16} />
                                            <span style={{ textDecoration: 'underline' }}>{selectedRestaurant.address}</span>
                                        </a>
                                    )}
                                    {selectedRestaurant.phone && (
                                        <a
                                            href={`tel:${selectedRestaurant.phone.replace(/\D/g, '')}`}
                                            className={styles.modalDetailRow}
                                            style={{ textDecoration: 'none', cursor: 'pointer' }}
                                        >
                                            <Phone size={16} />
                                            <span style={{ textDecoration: 'underline' }}>Llamar ({selectedRestaurant.phone})</span>
                                        </a>
                                    )}
                                    {selectedRestaurant.distance && (
                                        <div className={styles.modalDetailRow}>
                                            <Clock size={16} />
                                            <span>A {selectedRestaurant.distance} de la facu</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
