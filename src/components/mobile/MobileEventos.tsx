"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    MapPin,
    Clock,
    Search,
    X,
    ExternalLink
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import LoadingScreen from "@/components/common/LoadingScreen";
import EmptyState from "@/components/common/EmptyState";
import { getCityEvents } from "@/app/actions/data";
import styles from "@/app/eventos/eventos.module.css";

interface MobileEventosProps {
    initialEvents?: any[];
}

export default function MobileEventos({ initialEvents }: MobileEventosProps) {
    const [events, setEvents] = useState<any[]>(initialEvents || []);
    const [loading, setLoading] = useState(!initialEvents);
    const [search, setSearch] = useState("");
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
        <>
            <TopBar />

            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Agenda de la ciudad</h1>
                    <p>Descubrí todo lo que está pasando en Pergamino.</p>
                </header>

                <div className={styles.searchBar}>
                    <Search size={20} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Buscar eventos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className={styles.grid}>
                    {loading ? (
                        <LoadingScreen />
                    ) : filtered.length > 0 ? (
                        filtered.map((ev, i) => (
                            <motion.div
                                key={ev.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedEvent(ev)}
                            >
                                <div className={styles.card}>
                                    <div className={styles.cardImg}>
                                        {ev.imageUrl ? (
                                            <img src={ev.imageUrl} alt={ev.title} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Calendar size={48} color="white" opacity={0.3} />
                                            </div>
                                        )}
                                        <div className={styles.dateBadge}>
                                            <Calendar size={12} /> {ev.date}
                                        </div>
                                    </div>
                                    <div className={styles.cardBody}>
                                        <h3>{ev.title}</h3>
                                        <div className={styles.meta}>
                                            <div className={styles.metaItem}>
                                                <MapPin size={12} /> {ev.location}
                                            </div>
                                            {ev.time && (
                                                <div className={styles.metaItem}>
                                                    <Clock size={12} /> {ev.time}
                                                </div>
                                            )}
                                        </div>
                                        <p className={styles.desc}>{ev.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <EmptyState
                            title="No hay eventos"
                            message="No encontramos eventos para tu búsqueda."
                        />
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedEvent(null)}
                    >
                        <motion.div
                            className={styles.modalSheet}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className={styles.modalClose} onClick={() => setSelectedEvent(null)}>
                                <X size={20} />
                            </button>

                            <div className={styles.modalImg}>
                                {selectedEvent.imageUrl && <img src={selectedEvent.imageUrl} alt="" />}
                            </div>

                            <div className={styles.modalBody}>
                                <h2>{selectedEvent.title}</h2>
                                <div className={styles.modalMeta}>
                                    <div className={styles.modalMetaItem}><Calendar size={18} /> {selectedEvent.date}</div>
                                    <div className={styles.modalMetaItem}><MapPin size={18} /> {selectedEvent.location}</div>
                                    {selectedEvent.time && <div className={styles.modalMetaItem}><Clock size={18} /> {selectedEvent.time}</div>}
                                </div>
                                <div className={styles.modalDesc}>
                                    {selectedEvent.description}
                                </div>

                                {selectedEvent.link && (
                                    <a href={selectedEvent.link} target="_blank" rel="noopener noreferrer" className={styles.modalAction}>
                                        Ver más información <ExternalLink size={18} />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
