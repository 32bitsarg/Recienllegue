"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    MapPin,
    Clock,
    ArrowLeft,
    ExternalLink,
    Search,
    ChevronRight,
    X,
    Filter
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getCityEvents } from '@/app/actions/data';
import styles from './DesktopEventos.module.css';

interface DesktopEventosProps {
    initialEvents?: any[];
}

export default function DesktopEventos({ initialEvents }: DesktopEventosProps) {
    const [events, setEvents] = useState<any[]>(initialEvents || []);
    const [loading, setLoading] = useState(!initialEvents);
    const [search, setSearch] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    useEffect(() => {
        if (initialEvents) return;
        const load = async () => {
            const data = await getCityEvents();
            setEvents(data);
            setLoading(false);
        };
        load();
    }, []);

    const filtered = events.filter(ev =>
        ev.title.toLowerCase().includes(search.toLowerCase()) ||
        (ev.description && ev.description.toLowerCase().includes(search.toLowerCase())) ||
        (ev.location && ev.location.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className={styles.container}>
            {/* Header / Search Area */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link href="/" className={styles.backButton}>
                            <ArrowLeft size={18} /> Volver al Inicio
                        </Link>
                        <h1>Agenda de la ciudad</h1>
                        <p>Descubrí todo lo que está pasando en Pergamino.</p>
                    </motion.div>

                    <div className={styles.searchWrapper}>
                        <div className={styles.searchBar}>
                            <Search size={22} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Busca por nombre, lugar o descripción..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Area */}
            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loadingState}>
                        <div className={styles.loader}></div>
                        <p>Cargando eventos...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Calendar size={64} opacity={0.1} />
                        <h3>No hay eventos para mostrar</h3>
                        <p>Intentá con otra búsqueda o volvé más tarde.</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {filtered.map((ev, i) => (
                            <motion.div
                                key={ev.id}
                                className={styles.card}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedEvent(ev)}
                            >
                                <div className={styles.cardImg}>
                                    {ev.imageUrl ? (
                                        <Image
                                            src={ev.imageUrl}
                                            alt={ev.title}
                                            fill
                                            sizes="400px"
                                        />
                                    ) : (
                                        <div className={styles.placeholderImg}>
                                            <Calendar size={48} opacity={0.2} />
                                        </div>
                                    )}
                                    <div className={styles.dateOverlay}>
                                        <Calendar size={14} /> {ev.date}
                                    </div>
                                    {ev.isFeatured && <div className={styles.featuredBadge}>Destacado</div>}
                                </div>
                                <div className={styles.cardBody}>
                                    <h3>{ev.title}</h3>
                                    <div className={styles.cardMeta}>
                                        <div className={styles.metaItem}>
                                            <MapPin size={14} /> {ev.location}
                                        </div>
                                        {ev.time && (
                                            <div className={styles.metaItem}>
                                                <Clock size={14} /> {ev.time}
                                            </div>
                                        )}
                                    </div>
                                    <p>{ev.description}</p>
                                    <button className={styles.cardBtn}>
                                        Saber más <ChevronRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Event Detail Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        className={styles.modalShield}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedEvent(null)}
                    >
                        <motion.div
                            className={styles.modalSheet}
                            initial={{ y: 50, scale: 0.9, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: 50, scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className={styles.modalClose} onClick={() => setSelectedEvent(null)}>
                                <X size={24} />
                            </button>

                            <div className={styles.modalImg}>
                                {selectedEvent.imageUrl && (
                                    <Image
                                        src={selectedEvent.imageUrl}
                                        alt={selectedEvent.title}
                                        fill
                                        sizes="800px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                )}
                            </div>

                            <div className={styles.modalPane}>
                                <div className={styles.modalHeader}>
                                    <div className={styles.modalBadges}>
                                        <span className={styles.modalBadge}>
                                            <Calendar size={16} /> {selectedEvent.date}
                                        </span>
                                        {selectedEvent.time && (
                                            <span className={styles.modalBadge}>
                                                <Clock size={16} /> {selectedEvent.time}
                                            </span>
                                        )}
                                    </div>
                                    <h2>{selectedEvent.title}</h2>
                                    <div className={styles.modalLoc}>
                                        <MapPin size={18} /> {selectedEvent.location}
                                    </div>
                                </div>

                                <div className={styles.modalDesc}>
                                    <p>{selectedEvent.description}</p>
                                </div>

                                {selectedEvent.link && (
                                    <div className={styles.modalFooter}>
                                        <Link href={selectedEvent.link} target="_blank" className={styles.primaryBtn}>
                                            Ver sitio oficial <ExternalLink size={18} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
