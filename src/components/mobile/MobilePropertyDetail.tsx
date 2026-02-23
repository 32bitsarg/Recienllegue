"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    MapPin,
    Wifi,
    ShieldCheck,
    Clock,
    User,
    MessageCircle,
    Share2,
    Heart,
    Phone,
    Building
} from "lucide-react";
import styles from "@/app/hospedaje/[id]/PropertyDetail.module.css";
import EmptyState from "@/components/common/EmptyState";
import { useDragScroll } from "@/hooks/useDragScroll";

export interface PropertyDetailInitialData {
    property: any;
}

interface MobilePropertyDetailProps {
    initialData: PropertyDetailInitialData | null;
}

export default function MobilePropertyDetail({ initialData }: MobilePropertyDetailProps) {
    const galleryScroll = useDragScroll<HTMLDivElement>();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const index = Math.round(target.scrollLeft / target.clientWidth);
        setCurrentImageIndex(index);
    };

    if (!initialData?.property) {
        return (
            <div className="">
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
            </div>
        );
    }

    const property = initialData.property;
    const services = Array.isArray(property.services) ? property.services : [];
    const mainImage = property.mainImage;
    const allImages = Array.isArray(property.images) && property.images.length > 0
        ? property.images
        : (mainImage ? [mainImage] : []);

    return (
        <div className="">
            <main className="safe-bottom">
                <div className={styles.hero}>
                    {allImages.length > 0 ? (
                        <>
                            <div
                                className={styles.imageGallery}
                                onScroll={handleScroll}
                                ref={galleryScroll.ref}
                                onMouseDown={galleryScroll.onMouseDown}
                                onMouseLeave={galleryScroll.onMouseLeave}
                                onMouseUp={galleryScroll.onMouseUp}
                                onMouseMove={galleryScroll.onMouseMove}
                                style={galleryScroll.style}
                            >
                                {allImages.map((img: string, idx: number) => (
                                    <div key={idx} className={styles.gallerySlide}>
                                        <img src={img} alt={`${property.title} - Foto ${idx + 1}`} className={styles.heroImage} />
                                    </div>
                                ))}
                            </div>
                            {allImages.length > 1 && (
                                <>
                                    <div className={styles.galleryDots}>
                                        {allImages.map((_: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className={`${styles.galleryDot} ${currentImageIndex === idx ? styles.galleryDotActive : ''}`}
                                            />
                                        ))}
                                    </div>
                                    <div className={styles.imageCounter}>
                                        {currentImageIndex + 1}/{allImages.length}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className={styles.imageFallback}>
                            <img
                                src={`https://api.dicebear.com/9.x/shapes/svg?seed=${property.id}&backgroundColor=f1f5f9,e2e8f0,cbd5e1`}
                                alt=""
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1 }}
                            />
                            <Building size={64} className={styles.fallbackIcon} />
                        </div>
                    )}
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
                            <span className={styles.priceValue}>
                                {Number(property.price) === 0 ? "Consultar" : `$${Number(property.price).toLocaleString('es-AR')}`}
                            </span>
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
                                {(property.ownerName || property.owner?.name || "E").charAt(0)}
                            </div>
                            <div>
                                <span className={styles.ownerLabel}>Publicado por</span>
                                <span className={styles.ownerName}>{property.ownerName || property.owner?.name}</span>
                            </div>
                        </div>
                        <div className={styles.ownerActions}>
                            {property.ownerPhone && (
                                <>
                                    <a href={`tel:${property.ownerPhone}`} className={styles.contactBtnAlt} title="Llamar">
                                        <Phone size={20} />
                                    </a>
                                    <a
                                        href={`https://wa.me/${property.ownerPhone.replace(/\D/g, '')}?text=Hola!%20Te%20contacté%20desde%20Recién%20Llegué%20por%20el%20hospedaje:%20${encodeURIComponent(property.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.contactBtn}
                                    >
                                        <MessageCircle size={20} /> Contactar
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
