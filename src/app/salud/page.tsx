"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/layout/TopBar";
import EmptyState from "@/components/common/EmptyState";
import {
    Stethoscope,
    Phone,
    Flame,
    MapPin,
    ChevronRight,
    AlertCircle,
    Clock,
    ExternalLink,
    ShieldAlert
} from "lucide-react";
import styles from "./Salud.module.css";
import { getHealthServices } from "@/app/actions/data";

export default function SaludPage() {
    const [healthServices, setHealthServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHealth = async () => {
            const data = await getHealthServices();
            setHealthServices(data);
            setLoading(false);
        };
        fetchHealth();
    }, []);

    const emergencies = healthServices.filter(s => s.type === "URGENCIA");
    const centers = healthServices.filter(s => s.type === "HOSPITAL");
    const caps = healthServices.filter(s => s.type === "CAPS");
    return (
        <main className="safe-bottom">
            <TopBar />

            <div className={styles.container}>
                <div className={styles.hero}>
                    <h1>Salud y Urgencias</h1>
                    <p>Contactos y centros médicos esenciales en Pergamino.</p>
                </div>

                <section className={styles.emergenciesSection}>
                    <div className={styles.emergencyGrid}>
                        {emergencies.length > 0 ? (
                            emergencies.map((em, i) => (
                                <motion.a
                                    href={`tel:${em.number}`}
                                    key={i}
                                    className={styles.emergencyCard}
                                    style={{ '--accent': em.color } as any}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <span className={styles.emName}>{em.name}</span>
                                    <span className={styles.emNumber}>{em.number}</span>
                                    <Phone size={24} className={styles.emIcon} />
                                </motion.a>
                            ))
                        ) : !loading && (
                            <p className={styles.noData}>No hay números de emergencia cargados.</p>
                        )}
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.infoBox}>
                        <AlertCircle size={20} className={styles.infoIcon} />
                        <p>Las <strong>Farmacias de Turno</strong> cambian diariamente. Se recomienda consultar el diario local o el Colegio de Farmacéuticos.</p>
                    </div>
                    <a href="https://www.osam.org.ar/farmacias-de-turno-en-pergamino/" target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
                        <span>Ver Farmacias de Turno Hoy</span>
                        <ExternalLink size={18} />
                    </a>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Centros de Atención</h3>
                    <div className={styles.locationList}>
                        {centers.length > 0 ? (
                            centers.map((loc, i) => (
                                <motion.div
                                    key={i}
                                    className={styles.locationCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.3 }}
                                >
                                    <div className={styles.locHeader}>
                                        <div>
                                            <span className={styles.locType}>{loc.type}</span>
                                            <h4>{loc.name}</h4>
                                        </div>
                                        <div className={styles.locBadge}>
                                            <Clock size={12} /> Abierto
                                        </div>
                                    </div>
                                    <div className={styles.locBody}>
                                        <div className={styles.locItem}>
                                            <MapPin size={14} />
                                            <span>{loc.address}</span>
                                        </div>
                                        <div className={styles.locItem}>
                                            <Phone size={14} />
                                            <span>{loc.number}</span>
                                        </div>
                                        <p className={styles.locDetails}>{loc.details}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : !loading && (
                            <p className={styles.noData}>No hay centros de atención cargados.</p>
                        )}
                    </div>
                </section>

                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>CAPS (Centros de Salud Periféricos)</h3>
                    <p className={styles.sectionDesc}>Pergamino cuenta con 27 centros de atención primaria distribuidos en barrios y pueblos.</p>
                    <div className={styles.capsGrid}>
                        {caps.length > 0 ? (
                            caps.map((loc, i) => (
                                <motion.div
                                    key={i}
                                    className={styles.capsCard}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.3 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <strong>{loc.name}</strong>
                                    <span>{loc.address}</span>
                                </motion.div>
                            ))
                        ) : !loading && (
                            <div className={styles.emptyContainer}>
                                <EmptyState
                                    title="Aún no hay CAPS cargados"
                                    message="Próximamente se listarán todos los centros de salud periféricos."
                                />
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
