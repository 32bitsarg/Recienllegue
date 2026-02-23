"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import TopBar from "@/components/layout/TopBar";
import { ChevronLeft, Heart, Home as HomeIcon, Utensils, ChevronRight, CheckCircle, Star, Clock, MapPin, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import styles from "@/app/perfil/ContenidoPerfil.module.css";
import hStyles from "@/app/hospedaje/Hospedaje.module.css";
import cStyles from "@/app/comida/Comida.module.css";
import { getUserFavorites } from "@/app/actions/data";

export interface FavoritosInitialData {
    favorites: { properties: any[]; restaurants: any[] };
}

interface MobileFavoritosProps {
    initialData?: FavoritosInitialData | null;
}

export default function MobileFavoritos({ initialData }: MobileFavoritosProps) {
    const { data: session, status } = useSession();
    const [favorites, setFavorites] = useState(initialData?.favorites ?? { properties: [], restaurants: [] });
    const [loading, setLoading] = useState(!initialData);
    const [activeTab, setActiveTab] = useState("properties");
    const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);

    useEffect(() => {
        if (initialData) return;
        if (session?.user) {
            getUserFavorites((session.user as any).id).then(setFavorites);
        }
        setLoading(false);
    }, [session?.user, initialData]);

    if (status === "loading" || loading) {
        return (
            <div className="">
                <main className="safe-bottom">
                    <TopBar />
                    <div className={styles.loading}>Cargando favoritos...</div>
                </main>
            </div>
        );
    }

    const currentItems = activeTab === "properties" ? favorites.properties : favorites.restaurants;

    return (
        <div className="">
            <main className="safe-bottom">
                <TopBar />
                <div className={styles.container}>
                    <header className={styles.header}>
                        <Link href="/perfil" className={styles.backBtn}><ChevronLeft size={24} /></Link>
                        <h1>Mis Favoritos</h1>
                    </header>
                    <div className={styles.tabs}>
                        <button className={`${styles.tab} ${activeTab === 'properties' ? styles.activeTab : ''}`} onClick={() => setActiveTab('properties')}>
                            <HomeIcon size={16} /> Hospedajes
                        </button>
                        <button className={`${styles.tab} ${activeTab === 'restaurants' ? styles.activeTab : ''}`} onClick={() => setActiveTab('restaurants')}>
                            <Utensils size={16} /> Comida
                        </button>
                    </div>
                    {currentItems.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}><Heart size={80} /></div>
                            <h3>Aún no tenés favoritos</h3>
                            <p>Guardá los lugares que más te gusten para tenerlos a mano.</p>
                            <Link href={activeTab === 'properties' ? "/hospedaje" : "/comida"} className={styles.actionBtn}>
                                Explorar {activeTab === 'properties' ? "Hospedajes" : "Comida"}
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.list}>
                            {activeTab === 'properties' && favorites.properties.map((h) => (
                                <Link key={h.id} href={`/hospedaje/${h.id}`} className={hStyles.card}>
                                    <div className={hStyles.imageWrapper}>
                                        <img src={h.mainImage} alt={h.title} />
                                        {h.verified && <div className={hStyles.verifiedBadge}><CheckCircle size={12} /> Verificado</div>}
                                        <div className={hStyles.priceBadge}>${Number(h.price).toLocaleString()} /mes</div>
                                    </div>
                                    <div className={hStyles.cardContent}>
                                        <div className={hStyles.cardInfo}>
                                            <span className={hStyles.typeTag}>{h.type}</span>
                                            <span className={hStyles.distanceTag}>{h.distance}</span>
                                        </div>
                                        <h3 className={hStyles.cardTitle}>{h.title}</h3>
                                    </div>
                                    <div className={hStyles.cardAction}><ChevronRight size={20} color="var(--primary)" /></div>
                                </Link>
                            ))}
                            {activeTab === 'restaurants' && favorites.restaurants.map((res: any) => (
                                <div key={res.id} className={cStyles.restaurantCard} onClick={() => setSelectedRestaurant(res)}>
                                    <div className={cStyles.cardImage}>
                                        {res.image ? <img src={res.image} alt={res.name} /> : <div className={cStyles.imageFallback}><Utensils size={32} style={{ opacity: 0.2 }} /></div>}
                                        <div className={cStyles.ratingBadge}><Star size={10} fill="currentColor" /><span>{res.rating}</span></div>
                                    </div>
                                    <div className={cStyles.cardInfo}>
                                        <div className={cStyles.mainInfo}>
                                            <h3 className={cStyles.resName}>{res.name}</h3>
                                            <p className={cStyles.featuredText}>{res.featured || res.category}</p>
                                        </div>
                                        <div className={cStyles.metaInfo}>
                                            <div className={cStyles.metaItem}><Clock size={14} /><span>{res.prepTime}</span></div>
                                            <div className={cStyles.metaItem}><MapPin size={14} /><span>{res.distance}</span></div>
                                        </div>
                                    </div>
                                    <div className={cStyles.viewBtn}><ChevronRight size={20} /></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <AnimatePresence>
                {selectedRestaurant && (
                    <motion.div className={cStyles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRestaurant(null)}>
                        <motion.div className={cStyles.modalContent} initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                            <div className={cStyles.modalHeader}>
                                {selectedRestaurant.image ? <img src={selectedRestaurant.image} alt={selectedRestaurant.name} /> : <div className={cStyles.imageFallback} style={{ height: '100%' }}><Utensils size={48} style={{ opacity: 0.2 }} /></div>}
                                <button className={cStyles.modalCloseBtn} onClick={() => setSelectedRestaurant(null)}><X size={20} /></button>
                            </div>
                            <div className={cStyles.modalBody}>
                                <div className={cStyles.modalCategory}>{selectedRestaurant.category || "General"}</div>
                                <h2 className={cStyles.modalTitle}>{selectedRestaurant.name}</h2>
                                {selectedRestaurant.featured && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{selectedRestaurant.featured}</p>}
                                <div className={cStyles.modalDetails}>
                                    {selectedRestaurant.address && (
                                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedRestaurant.address + ", Pergamino, Buenos Aires")}`} target="_blank" rel="noopener noreferrer" className={cStyles.modalDetailRow} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                            <MapPin size={16} /><span style={{ textDecoration: 'underline' }}>{selectedRestaurant.address}</span>
                                        </a>
                                    )}
                                    {selectedRestaurant.phone && (
                                        <a href={`tel:${selectedRestaurant.phone.replace(/\D/g, '')}`} className={cStyles.modalDetailRow} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                            <Phone size={16} /><span style={{ textDecoration: 'underline' }}>Llamar ({selectedRestaurant.phone})</span>
                                        </a>
                                    )}
                                    {selectedRestaurant.distance && (
                                        <div className={cStyles.modalDetailRow}><Clock size={16} /><span>A {selectedRestaurant.distance} de la facu</span></div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
