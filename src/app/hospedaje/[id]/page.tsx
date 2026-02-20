"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    MapPin,
    Wifi,
    Wind,
    ShieldCheck,
    Clock,
    User,
    MessageCircle,
    Share2,
    Heart,
    Phone
} from "lucide-react";
import styles from "./PropertyDetail.module.css";
import { getPropertyById } from "@/app/actions/data";
import EmptyState from "@/components/common/EmptyState";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            const data = await getPropertyById(id);
            setProperty(data);
            setLoading(false);
        };
        fetchProperty();
    }, [id]);

    if (loading) {
        return (
            <main className="safe-bottom">
                <div className={styles.loadingFull}>
                    <div className={styles.pulseLoader}></div>
                    <p>Cargando detalles...</p>
                </div>
            </main>
        );
    }

    if (!property) {
        return (
            <main className="safe-bottom">
                <div className={styles.topActions} style={{ position: 'relative', background: 'var(--background)', padding: '1rem' }}>
                    <Link href="/hospedaje" className={styles.iconBtn}>
                        <ChevronLeft size={24} />
                    </Link>
                </div>
                <EmptyState
                    title="Propiedad no encontrada"
                    message="Parece que este alojamiento ya no está disponible o el enlace es incorrecto."
                />
            </main>
        );
    }

    // Adapt Json fields (services and images)
    const services = Array.isArray(property.services) ? property.services : [];
    const mainImage = property.mainImage || "https://images.unsplash.com/photo-1555854817-5b2260d50c47?q=80&w=800&fit=crop";

    return (
        <main className="safe-bottom">
            <div className={styles.hero}>
                <img src={mainImage} alt={property.title} className={styles.heroImage} />
                <div className={styles.topActions}>
                    <Link href="/hospedaje" className={styles.iconBtn}>
                        <ChevronLeft size={24} />
                    </Link>
                    <div className={styles.rightActions}>
                        <button className={styles.iconBtn}><Share2 size={20} /></button>
                        <button className={styles.iconBtn}><Heart size={20} /></button>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.typeRow}>
                        <span className={styles.categoryBadge}>{property.type}</span>
                        {property.verified && (
                            <span className={styles.verifiedText}>
                                <ShieldCheck size={14} /> Verificado
                            </span>
                        )}
                    </div>
                    <h1 className={styles.title}>{property.title}</h1>
                    <div className={styles.location}>
                        <MapPin size={16} />
                        <span>{property.address} • {property.distance}</span>
                    </div>
                </div>

                <div className={styles.priceCard}>
                    <div className={styles.priceInfo}>
                        <span className={styles.priceLabel}>Precio Mensual</span>
                        <span className={styles.priceValue}>${Number(property.price).toLocaleString('es-AR')}</span>
                    </div>
                    <div className={styles.genderBadge}>
                        <User size={16} />
                        <span>{property.gender}</span>
                    </div>
                </div>

                <section className={styles.section}>
                    <h3>Descripción</h3>
                    <p className={styles.description}>{property.description}</p>
                </section>

                {services.length > 0 && (
                    <section className={styles.section}>
                        <h3>Lo que ofrece este lugar</h3>
                        <div className={styles.amenitiesGrid}>
                            {services.map((service: string, idx: number) => (
                                <div key={idx} className={styles.amenityItem}>
                                    {service.toLowerCase().includes("wifi") ? <Wifi size={18} /> :
                                        service.toLowerCase().includes("seguridad") ? <ShieldCheck size={18} /> :
                                            service.toLowerCase().includes("cocina") ? <Clock size={18} /> : <div style={{ width: 18 }} />}
                                    <span>{service}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className={styles.ownerCard}>
                    <div className={styles.ownerInfo}>
                        <div className={styles.ownerAvatar}>
                            {(property.owner?.name || property.ownerName || "E").charAt(0)}
                        </div>
                        <div>
                            <span className={styles.ownerLabel}>Publicado por</span>
                            <span className={styles.ownerName}>{property.owner?.name || property.ownerName}</span>
                        </div>
                    </div>
                    <div className={styles.ownerActions}>
                        {property.ownerPhone && (
                            <a href={`tel:${property.ownerPhone}`} className={styles.contactBtnAlt}>
                                <Phone size={20} />
                            </a>
                        )}
                        <button className={styles.contactBtn}>
                            <MessageCircle size={20} /> Contactar
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
