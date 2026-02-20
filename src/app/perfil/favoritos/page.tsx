"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserFavorites } from "@/app/actions/data";
import TopBar from "@/components/layout/TopBar";
import { ChevronLeft, Heart, Home as HomeIcon, Utensils, ChevronRight, CheckCircle, Star } from "lucide-react";
import Link from "next/link";
import styles from "../ContenidoPerfil.module.css";
// We reuse some card styles from original pages by necessity or reimplement them here
import hStyles from "../../hospedaje/Hospedaje.module.css";
import cStyles from "../../comida/Comida.module.css";

export default function FavoritesPage() {
    const { data: session, status } = useSession();
    const [favorites, setFavorites] = useState<{ properties: any[], restaurants: any[] }>({ properties: [], restaurants: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("properties");

    useEffect(() => {
        async function load() {
            if (session?.user) {
                const data = await getUserFavorites((session.user as any).id);
                setFavorites(data);
            }
            setLoading(false);
        }
        if (status !== "loading") {
            load();
        }
    }, [session, status]);

    if (status === "loading" || loading) {
        return (
            <main className="safe-bottom">
                <TopBar />
                <div className={styles.loading}>Cargando favoritos...</div>
            </main>
        );
    }

    const currentItems = activeTab === "properties" ? favorites.properties : favorites.restaurants;

    return (
        <main className="safe-bottom">
            <TopBar />

            <div className={styles.container}>
                <header className={styles.header}>
                    <Link href="/perfil" className={styles.backBtn}>
                        <ChevronLeft size={24} />
                    </Link>
                    <h1>Mis Favoritos</h1>
                </header>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'properties' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('properties')}
                    >
                        <HomeIcon size={16} /> Hospedajes
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'restaurants' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('restaurants')}
                    >
                        <Utensils size={16} /> Comida
                    </button>
                </div>

                {currentItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <Heart size={80} />
                        </div>
                        <h3>Aún no tenés favoritos</h3>
                        <p>Guardá los lugares que más te gusten para tenerlos a mano.</p>
                        <Link href={activeTab === 'properties' ? "/hospedaje" : "/comida"} className={styles.actionBtn}>
                            Explorar {activeTab === 'properties' ? "Hospedajes" : "Comida"}
                        </Link>
                    </div>
                ) : (
                    <div className={styles.list}>
                        {activeTab === 'properties' ? (
                            favorites.properties.map((h) => (
                                <Link key={h.id} href={`/hospedaje/${h.id}`} className={hStyles.card}>
                                    <div className={hStyles.imageWrapper}>
                                        <img src={h.mainImage} alt={h.title} />
                                        {h.verified && (
                                            <div className={hStyles.verifiedBadge}>
                                                <CheckCircle size={12} /> Verificado
                                            </div>
                                        )}
                                        <div className={hStyles.priceBadge}>${Number(h.price).toLocaleString()} /mes</div>
                                    </div>
                                    <div className={hStyles.cardContent}>
                                        <div className={hStyles.cardInfo}>
                                            <span className={hStyles.typeTag}>{h.type}</span>
                                            <span className={hStyles.distanceTag}>{h.distance}</span>
                                        </div>
                                        <h3 className={hStyles.cardTitle}>{h.title}</h3>
                                    </div>
                                    <div className={hStyles.cardAction}>
                                        <ChevronRight size={20} color="var(--primary)" />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            favorites.restaurants.map((r) => (
                                <Link key={r.id} href={`/comida/${r.id}`} className={cStyles.restaurantCard}>
                                    <img src={r.image} alt={r.name} className={cStyles.restaurantImage} />
                                    <div className={cStyles.restaurantInfo}>
                                        <div className={cStyles.restaurantHeader}>
                                            <h3 className={cStyles.restaurantName}>{r.name}</h3>
                                            <div className={cStyles.rating}>
                                                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                                <span>{r.rating}</span>
                                            </div>
                                        </div>
                                        <p className={cStyles.restaurantCategory}>{r.category} • {r.distance}</p>
                                        <div className={cStyles.restaurantFooter}>
                                            <span className={cStyles.prepTime}>{r.prepTime}</span>
                                            <span className={cStyles.priceRange}>{"$".repeat(r.priceRange === "ALTO" ? 3 : r.priceRange === "MEDIO" ? 2 : 1)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
