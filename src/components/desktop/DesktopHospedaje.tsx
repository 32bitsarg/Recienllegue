"use client";

import { useEffect, useState, useMemo, memo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, User, CheckCircle, Star, Building, Filter, ChevronRight } from "lucide-react";
import { getProperties, getUserFavorites } from "@/app/actions/data";
import FavoriteButton from "@/components/common/FavoriteButton";
import LoadingScreen from "@/components/common/LoadingScreen";
import styles from "./DesktopHospedaje.module.css";
import { motion } from "framer-motion";

interface DesktopHospedajeProps {
    initialData?: {
        properties: any[];
        savedIds: string[];
    };
}

const DesktopHospedaje = memo(function DesktopHospedaje({ initialData }: DesktopHospedajeProps) {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("Residencia");
    const [search, setSearch] = useState("");
    const [hospedajes, setHospedajes] = useState<any[]>(initialData?.properties || []);
    const [savedIds, setSavedIds] = useState<string[]>(initialData?.savedIds || []);
    const [loading, setLoading] = useState(!initialData);

    const userId = session?.user ? (session.user as any).id : null;

    useEffect(() => {
        if (initialData) return;
        let isMounted = true;
        const loadData = async () => {
            try {
                const [data, favorites] = await Promise.all([
                    getProperties(),
                    userId ? getUserFavorites(userId) : Promise.resolve({ properties: [], restaurants: [] })
                ]);
                if (isMounted) {
                    setHospedajes(data);
                    setSavedIds(favorites.properties.map((p: any) => p.id));
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error loading properties:", error);
                if (isMounted) setLoading(false);
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, [userId]);

    const filtered = useMemo(() => {
        return hospedajes.filter(h => {
            const typeMatch = h.type.toLowerCase() === activeTab.toLowerCase();
            const searchMatch = h.title.toLowerCase().includes(search.toLowerCase()) ||
                (h.services as string[] || []).some(s => s.toLowerCase().includes(search.toLowerCase()));
            return typeMatch && searchMatch;
        }).sort((a, b) => {
            if (a.sponsor && !b.sponsor) return -1;
            if (!a.sponsor && b.sponsor) return 1;
            if (a.verified && !b.verified) return -1;
            if (!a.verified && b.verified) return 1;
            return 0;
        });
    }, [hospedajes, activeTab, search]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>Hospedaje Universitario</h1>
                    <p>Encontrá tu próximo hogar en Pergamino. Filtrado por {activeTab}s.</p>
                </div>
                <div className={styles.controls}>
                    <div className={styles.searchBox}>
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por zona, nombre o servicios..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className={styles.topInfo}>
                <div className={styles.infoBanner}>
                    <CheckCircle size={20} color="var(--primary)" />
                    <span><strong>Consejo:</strong> Las residencias suelen incluir servicios (luz, agua, gas) en el precio final. Consultá siempre antes de señar.</span>
                </div>
            </div>

            <section className={styles.filterSection}>
                <div className={styles.categoryGrid}>
                    {["Residencia", "Departamento", "Casa"].map(tab => (
                        <button
                            key={tab}
                            className={`${styles.filterTag} ${activeTab === tab ? styles.activeTag : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}s
                        </button>
                    ))}
                </div>
            </section>

            <div className={styles.contentArea}>
                {loading ? (
                    <div className={styles.loadingWrapper}><LoadingScreen /></div>
                ) : (
                    <div className={styles.grid}>
                        {filtered.map((h, i) => (
                            <motion.div
                                key={h.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                            >
                                <div className={styles.card}>
                                    <div className={styles.imageSection}>
                                        {h.mainImage ? (
                                            <Image
                                                src={h.mainImage}
                                                alt={h.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className={styles.placeholder}>
                                                <Building size={48} style={{ opacity: 0.2 }} />
                                            </div>
                                        )}
                                        <FavoriteButton
                                            itemId={h.id}
                                            type="property"
                                            initialIsSaved={savedIds.includes(h.id)}
                                        />
                                    </div>
                                    <Link href={`/hospedaje/${h.id}`} className={styles.cardBody}>
                                        <span className={styles.price}>
                                            {Number(h.price) === 0 ? "CONSULTAR" : `$${Number(h.price).toLocaleString()}`}
                                        </span>
                                        <h3 className={styles.title}>{h.title}</h3>
                                        <div className={styles.location}><MapPin size={14} /> {h.address}</div>
                                        <div className={styles.tags}>
                                            {(h.services as string[] || []).slice(0, 3).map((s, idx) => (
                                                <span key={idx} className={styles.tag}>{s}</span>
                                            ))}
                                        </div>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

export default DesktopHospedaje;
