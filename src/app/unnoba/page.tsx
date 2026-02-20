"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/layout/TopBar";
import {
    GraduationCap,
    MapPin,
    Phone,
    Clock,
    BookOpen,
    Coffee,
    UserPlus,
    HeartHandshake,
    ExternalLink,
    ChevronRight
} from "lucide-react";
import { getUniversitySedes, getUniversityServices } from "@/app/actions/data";
import styles from "./UNNOBA.module.css";

const IconMap: { [key: string]: any } = {
    GraduationCap: <GraduationCap size={20} />,
    BookOpen: <BookOpen size={20} />,
    Coffee: <Coffee size={20} />,
    UserPlus: <UserPlus size={20} />,
    HeartHandshake: <HeartHandshake size={20} />
};

export default function UNNOBAPage() {
    const [sedes, setSedes] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [sedesData, servicesData] = await Promise.all([
                getUniversitySedes(),
                getUniversityServices()
            ]);
            setSedes(sedesData);
            setServices(servicesData);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <main className="safe-bottom">
            <TopBar />

            <div className={styles.container}>
                <div className={styles.hero}>
                    <div className={styles.badge}>Oficial</div>
                    <h1>Info UNNOBA</h1>
                    <p>Tu guía académica y de servicios en la sede Pergamino.</p>
                </div>

                {loading ? (
                    <div className={styles.loading}>Cargando información...</div>
                ) : (
                    <>
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>Sedes en Pergamino</h3>
                            {sedes.length > 0 ? (
                                <div className={styles.sedesList}>
                                    {sedes.map((sede, i) => (
                                        <motion.div
                                            key={i}
                                            className={styles.sedeCard}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1, duration: 0.3 }}
                                        >
                                            <div className={styles.sedeHeader}>
                                                <MapPin size={18} className={styles.iconPrimary} />
                                                <h4>{sede.name}</h4>
                                            </div>
                                            <p className={styles.address}>{sede.address}</p>
                                            <p className={styles.details}>{sede.details}</p>
                                            {sede.phone && (
                                                <div className={styles.phone}>
                                                    <Phone size={14} /> <span>{sede.phone}</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.noData}>No hay sedes cargadas.</p>
                            )}
                        </section>

                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>Servicios al Estudiante</h3>
                            {services.length > 0 ? (
                                <div className={styles.servicesGrid}>
                                    {services.map((service, i) => (
                                        <motion.div
                                            key={i}
                                            className={styles.serviceCard}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.08, duration: 0.3 }}
                                            whileHover={{ scale: 1.02, y: -4 }}
                                        >
                                            <div className={styles.serviceIcon}>
                                                {IconMap[service.iconName || "GraduationCap"] || <GraduationCap size={20} />}
                                            </div>
                                            <h5>{service.title}</h5>
                                            <p>{service.desc}</p>
                                            {service.contact && <span className={styles.contactInfo}>{service.contact}</span>}
                                            {service.link && (
                                                <a href={service.link} target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
                                                    Abrir Portal <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.noData}>No hay servicios cargados.</p>
                            )}
                        </section>
                    </>
                )}

                <section className={styles.actionSection}>
                    <div className={styles.actionCard}>
                        <div className={styles.actionText}>
                            <h4>SIU Guaraní</h4>
                            <p>Inscripción a materias, exámenes y certificados.</p>
                        </div>
                        <a href="https://guarani.unnoba.edu.ar" target="_blank" rel="noopener noreferrer" className={styles.actionBtn}>
                            <ChevronRight size={24} />
                        </a>
                    </div>
                </section>
            </div>
        </main>
    );
}
