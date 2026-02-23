"use client";

import { motion } from "framer-motion";
import {
    GraduationCap,
    MapPin,
    Phone,
    BookOpen,
    Coffee,
    UserPlus,
    HeartHandshake,
    ExternalLink,
    ChevronRight,
    Building2,
    Sparkles
} from "lucide-react";
import type { UNNOBAInitialData } from "@/components/mobile/MobileUNNOBA";
import styles from "./DesktopUNNOBA.module.css";

const IconMap: { [key: string]: React.ReactNode } = {
    GraduationCap: <GraduationCap size={24} />,
    BookOpen: <BookOpen size={24} />,
    Coffee: <Coffee size={24} />,
    UserPlus: <UserPlus size={24} />,
    HeartHandshake: <HeartHandshake size={24} />
};

interface DesktopUNNOBAProps {
    initialData: UNNOBAInitialData;
}

export default function DesktopUNNOBA({ initialData }: DesktopUNNOBAProps) {
    const { sedes, services } = initialData;

    return (
        <main className={styles.container}>
            <header className={styles.hero}>
                <span className={styles.badge}>Oficial</span>
                <h1>Info UNNOBA</h1>
                <p>Tu guía académica y de servicios en la sede Pergamino. Sedes, servicios al estudiante y acceso rápido a SIU Guaraní.</p>
            </header>

            <section className={styles.sedesSection}>
                <h2 className={styles.sectionTitle}>
                    <Building2 size={20} />
                    Sedes en Pergamino
                </h2>
                {sedes.length > 0 ? (
                    <div className={styles.sedesGrid}>
                        {sedes.map((sede, i) => (
                            <motion.article
                                key={i}
                                className={styles.sedeCard}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <div className={styles.sedeHeader}>
                                    <div className={styles.sedeIcon}>
                                        <MapPin size={20} />
                                    </div>
                                    <h3 className={styles.sedeName}>{sede.name}</h3>
                                </div>
                                <p className={styles.sedeAddress}>{sede.address}</p>
                                {sede.details && <p className={styles.sedeDetails}>{sede.details}</p>}
                                {sede.phone && (
                                    <a href={`tel:${sede.phone}`} className={styles.sedePhone}>
                                        <Phone size={16} /> {sede.phone}
                                    </a>
                                )}
                            </motion.article>
                        ))}
                    </div>
                ) : (
                    <p className={styles.noData}>No hay sedes cargadas.</p>
                )}
            </section>

            <section className={styles.servicesSection}>
                <h2 className={styles.sectionTitle}>
                    <Sparkles size={20} />
                    Servicios al Estudiante
                </h2>
                {services.length > 0 ? (
                    <div className={styles.servicesGrid}>
                        {services.map((service, i) => (
                            <motion.article
                                key={i}
                                className={styles.serviceCard}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <div className={styles.serviceIcon}>
                                    {IconMap[service.iconName || "GraduationCap"] || <GraduationCap size={24} />}
                                </div>
                                <h4 className={styles.serviceTitle}>{service.title}</h4>
                                <p className={styles.serviceDesc}>{service.desc}</p>
                                {service.contact && <p className={styles.serviceContact}>{service.contact}</p>}
                                {service.link && (
                                    <a href={service.link} target="_blank" rel="noopener noreferrer" className={styles.serviceLink}>
                                        Abrir portal <ExternalLink size={14} />
                                    </a>
                                )}
                            </motion.article>
                        ))}
                    </div>
                ) : (
                    <p className={styles.noData}>No hay servicios cargados.</p>
                )}
            </section>

            <section>
                <a
                    href="https://guarani.unnoba.edu.ar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.guaraniCta}
                >
                    <div className={styles.guaraniText}>
                        <h4>SIU Guaraní</h4>
                        <p>Inscripción a materias, exámenes y certificados. Accedé desde acá.</p>
                    </div>
                    <span className={styles.guaraniBtn}>
                        <ChevronRight size={28} />
                    </span>
                </a>
            </section>
        </main>
    );
}
