"use client";

import { motion } from "framer-motion";
import EmptyState from "@/components/common/EmptyState";
import {
    Phone,
    MapPin,
    Clock,
    AlertCircle,
    ExternalLink,
    Heart,
    Pill,
    Building2,
    Stethoscope
} from "lucide-react";
import type { SaludInitialData } from "@/components/mobile/MobileSalud";
import styles from "./DesktopSalud.module.css";

interface DesktopSaludProps {
    initialData: SaludInitialData;
}

export default function DesktopSalud({ initialData }: DesktopSaludProps) {
    const { healthServices, pharmacies, pharmaciesDate } = initialData;
    const emergencies = healthServices.filter((s: any) => s.type === "URGENCIA");
    const centers = healthServices.filter((s: any) => s.type === "HOSPITAL");
    const caps = healthServices.filter((s: any) => s.type === "CAPS");

    return (
        <main className={styles.container}>
            <header className={styles.hero}>
                <h1>Salud y Urgencias</h1>
                <p>Contactos y centros médicos esenciales en Pergamino. Emergencias, farmacias de turno, hospitales y CAPS.</p>
            </header>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Heart size={20} />
                    Emergencias
                </h2>
                {emergencies.length > 0 ? (
                    <div className={styles.emergenciesGrid}>
                        {emergencies.map((em, i) => (
                            <motion.a
                                href={`tel:${em.number}`}
                                key={i}
                                className={styles.emergencyCard}
                                style={{ borderBottomColor: em.color || 'var(--accent)' }}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <span className={styles.label}>{em.name}</span>
                                <span className={styles.number}>{em.number}</span>
                                <Phone size={20} className={styles.icon} />
                            </motion.a>
                        ))}
                    </div>
                ) : (
                    <p className={styles.noData}>No hay números de emergencia cargados.</p>
                )}
            </section>

            <div className={styles.twoCols}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Pill size={20} />
                        Farmacias de Turno
                    </h2>
                    <div className={styles.pharmBanner}>
                        <AlertCircle size={20} />
                        <p>Las <strong>Farmacias de Turno</strong> son del Colegio de Farmacéuticos local.</p>
                    </div>
                    {pharmacies.length > 0 ? (
                        <>
                            {pharmaciesDate && <div className={styles.pharmDate}>{pharmaciesDate}</div>}
                            <div className={styles.pharmaciesGrid}>
                                {pharmacies.map((ph: any, i) => (
                                    <motion.article
                                        key={i}
                                        className={styles.pharmacyCard}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: Math.min(i * 0.02, 0.2) }}
                                    >
                                        <h4 className={styles.pharmacyName}>{ph.name}</h4>
                                        <div className={styles.pharmacyAddress}>
                                            <MapPin size={12} style={{ flexShrink: 0, marginTop: 2 }} />
                                            <span>{ph.address}</span>
                                        </div>
                                        <a href={`tel:${ph.phone.replace(/\D/g, '')}`} className={styles.pharmacyPhone}>
                                            <Phone size={12} /> {ph.phone}
                                        </a>
                                    </motion.article>
                                ))}
                            </div>
                        </>
                    ) : (
                        <a
                            href="https://www.osam.org.ar/farmacias-de-turno-en-pergamino/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.osamFallback}
                        >
                            <span>No se pudieron cargar. Ver en OSAM Hoy</span>
                            <ExternalLink size={18} />
                        </a>
                    )}
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Building2 size={20} />
                        Centros de Atención
                    </h2>
                    {centers.length > 0 ? (
                        <div className={styles.centersList}>
                            {centers.map((loc, i) => (
                                <motion.article
                                    key={i}
                                    className={styles.centerCard}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: Math.min(i * 0.03, 0.2) }}
                                >
                                    <div className={styles.centerHeader}>
                                        <div>
                                            <div className={styles.centerType}>{loc.type}</div>
                                            <h3 className={styles.centerName}>{loc.name}</h3>
                                        </div>
                                        <span className={styles.centerBadge}>
                                            <Clock size={11} /> Abierto
                                        </span>
                                    </div>
                                    <div className={styles.centerBody}>
                                        <div className={styles.row}>
                                            <MapPin size={12} />
                                            <span>{loc.address}</span>
                                        </div>
                                        <div className={styles.row}>
                                            <Phone size={12} />
                                            <span>{loc.number}</span>
                                        </div>
                                        {loc.details && <p className={styles.centerDetails}>{loc.details}</p>}
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.noData}>No hay centros de atención cargados.</p>
                    )}
                </section>
            </div>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Stethoscope size={20} />
                    CAPS (Centros de Salud Periféricos)
                </h2>
                <p className={styles.capsIntro}>27 centros de atención primaria en barrios y pueblos.</p>
                {caps.length > 0 ? (
                    <div className={styles.capsGrid}>
                        {caps.map((loc: any, i) => (
                            <motion.article
                                key={i}
                                className={styles.capsCard}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: Math.min(i * 0.015, 0.15) }}
                            >
                                <strong>{loc.name}</strong>
                                <span>{loc.address}</span>
                            </motion.article>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyWrapper}>
                        <EmptyState
                            title="Aún no hay CAPS cargados"
                            message="Próximamente se listarán todos los centros de salud periféricos."
                        />
                    </div>
                )}
            </section>
        </main>
    );
}
