"use client";

import { useState } from "react";
import Link from "next/link";
import {
    MapPin,
    Wifi,
    Wind,
    ShieldCheck,
    Clock,
    User,
    MessageCircle,
    Share2,
    Heart,
    Phone,
    Building,
    CheckCircle,
    ArrowLeft
} from "lucide-react";
import styles from "./DesktopPropertyDetail.module.css";
import EmptyState from "@/components/common/EmptyState";

export interface DesktopPropertyDetailInitialData {
    property: any;
}

interface DesktopPropertyDetailProps {
    initialData: DesktopPropertyDetailInitialData | null;
}

export default function DesktopPropertyDetail({ initialData }: DesktopPropertyDetailProps) {
    if (!initialData?.property) {
        return (
            <div className={styles.container}>
                <Link href="/hospedaje" className={styles.backLink}>
                    <ArrowLeft size={18} /> Volver a los resultados
                </Link>
                <EmptyState title="No encontrado" message="La propiedad no existe." />
            </div>
        );
    }

    const property = initialData.property;
    const services = Array.isArray(property.services) ? property.services : [];
    const images = Array.isArray(property.images) ? property.images : (property.mainImage ? [property.mainImage] : []);
    const defaultMain = property.mainImage || (images[0] as string) || "";
    const [mainImage, setMainImage] = useState(defaultMain);

    return (
        <div className={styles.container}>
            <Link href="/hospedaje" className={styles.backLink}>
                <ArrowLeft size={18} /> Volver a los resultados
            </Link>

            <div className={styles.layout}>
                <div className={styles.leftCol}>
                    <div className={styles.gallery}>
                        <div className={styles.mainImageWrapper}>
                            {(mainImage || defaultMain) ? (
                                <img src={mainImage || defaultMain} alt={property.title} className={styles.mainImage} />
                            ) : (
                                <div className={styles.placeholder}><Building size={64} /></div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className={styles.thumbnails}>
                                {images.map((img: string, i: number) => (
                                    <div
                                        key={i}
                                        className={`${styles.thumb} ${(mainImage || defaultMain) === img ? styles.activeThumb : ""}`}
                                        onClick={() => setMainImage(img)}
                                    >
                                        <img src={img} alt="" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.mainInfo}>
                        <div className={styles.typeRow}>
                            <span className={styles.categoryBadge}>{property.type}</span>
                            {property.verified && (
                                <span className={styles.verifiedText}>
                                    <CheckCircle size={16} /> Verificado por Recién Llegué
                                </span>
                            )}
                        </div>
                        <h1 className={styles.title}>{property.title}</h1>
                        <div className={styles.location}>
                            <MapPin size={18} />
                            <span>{property.address} • {property.distance}</span>
                        </div>

                        <hr className={styles.divider} />

                        <section className={styles.section}>
                            <h3>Acerca de este lugar</h3>
                            <p className={styles.description}>{property.description}</p>
                        </section>

                        <section className={styles.section}>
                            <h3>Características y Servicios</h3>
                            <div className={styles.amenitiesGrid}>
                                {services.map((service: string, idx: number) => (
                                    <div key={idx} className={styles.amenityItem}>
                                        <div className={styles.amenityIcon}>
                                            {service.toLowerCase().includes("wifi") ? <Wifi size={20} /> :
                                                service.toLowerCase().includes("aire") ? <Wind size={20} /> :
                                                    <CheckCircle size={20} />}
                                        </div>
                                        <span>{service}</span>
                                    </div>
                                ))}
                                <div className={styles.amenityItem}>
                                    <div className={styles.amenityIcon}><User size={20} /></div>
                                    <span>Para {property.gender}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <aside className={styles.sidebar}>
                    <div className={styles.priceSticky}>
                        <div className={styles.priceHeader}>
                            <span className={styles.priceLabel}>Precio Mensual</span>
                            <span className={styles.priceValue}>
                                {Number(property.price) === 0 ? "Consulte" : `$${Number(property.price).toLocaleString()}`}
                            </span>
                        </div>

                        <div className={styles.ownerBrief}>
                            <div className={styles.avatar}>
                                {(property.ownerName || "E").charAt(0)}
                            </div>
                            <div>
                                <span className={styles.ownerLabel}>Anfitrión</span>
                                <span className={styles.ownerName}>{property.ownerName || "Estudiante Admin"}</span>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            {property.ownerPhone && (
                                <>
                                    <a
                                        href={`https://wa.me/${property.ownerPhone.replace(/\D/g, '')}?text=Hola!%20Vi%20tu%20hospedaje%20en%20RecienLlegue`}
                                        target="_blank"
                                        className={styles.primaryBtn}
                                    >
                                        <MessageCircle size={20} /> Contactar por WhatsApp
                                    </a>
                                    <a href={`tel:${property.ownerPhone}`} className={styles.secondaryBtn}>
                                        <Phone size={20} /> Llamar al dueño
                                    </a>
                                </>
                            )}
                            <div className={styles.utilityBtns}>
                                <button className={styles.utilBtn}><Share2 size={18} /> Compartir</button>
                                <button className={styles.utilBtn}><Heart size={18} /> Guardar</button>
                            </div>
                        </div>

                        <div className={styles.disclaimer}>
                            Al contactar, mencioná que lo viste en **Recién Llegué**. Nunca envíes dinero antes de visitar el lugar.
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
