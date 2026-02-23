"use client";

import { useState, useEffect, memo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home as HomeIcon,
    Utensils,
    GraduationCap,
    Bus,
    Stethoscope,
    Calendar,
    MapPin,
    ArrowRight,
    ArrowUpRight,
    Plus,
    Compass,
    Map as MapIcon,
    MessageSquare,
    MessageCircle,
    Phone,
    Building2,
    Zap
} from "lucide-react";
import { getNotices, getTips, getFeaturedRestaurants, getCityEvents, getRestaurants } from "@/app/actions/data";
import styles from "./DesktopHome.module.css";

const CATEGORIES = [
    { icon: <HomeIcon size={24} />, label: "Hospedaje", desc: "Donde vivir", color: "#6366f1", href: "/hospedaje" },
    { icon: <Utensils size={24} />, label: "Comida & Comercios", desc: "Qué comprar", color: "#f43f5e", href: "/comida" },
    { icon: <GraduationCap size={24} />, label: "UNNOBA", desc: "Vida académica", color: "#10b981", href: "/unnoba" },
    { icon: <Bus size={24} />, label: "Transporte", desc: "Cómo viajar", color: "#06b6d4", href: "/transporte" },
    { icon: <Stethoscope size={24} />, label: "Salud", desc: "Emergencias", color: "#8b5cf6", href: "/salud" },
];

interface DesktopHomeProps {
    initialData?: {
        tips: any[];
        featuredFood: any[];
        events: any[];
        noticesCount: number;
    };
}

const DesktopHome = memo(function DesktopHome({ initialData }: DesktopHomeProps) {
    const { data: session } = useSession();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [events, setEvents] = useState<any[]>(initialData?.events || []);
    const [featuredFood, setFeaturedFood] = useState<any[]>(initialData?.featuredFood || []);
    const [tips, setTips] = useState<any[]>(initialData?.tips || []);
    const [noticesCount, setNoticesCount] = useState(initialData?.noticesCount || 0);
    const [loading, setLoading] = useState(!initialData);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const heroSlides = [
        {
            title: session?.user?.name ? `Hola, ${session.user.name.split(' ')[0]}.` : "¿Qué buscamos hoy?",
            subtitle: "Todo lo que necesitás, en un solo lugar.",
            desc: "La guía definitiva para sobrevivir y disfrutar en Pergamino. Encontrá hospedaje, comida, horarios de transporte y mantenete al tanto de lo que pasa en la ciudad."
        },
        {
            title: "¿Recién llegaste?",
            subtitle: "No te preocupes, te ayudamos.",
            desc: "Mudarse es un desafío. Por eso reunimos toda la información útil sobre residencias, trámites universitarios y servicios esenciales para que te sientas como en casa."
        },
        {
            title: "Comunidad Vibrante",
            subtitle: "Enterate de cada novedad.",
            desc: "Desde eventos culturales hasta avisos de otros estudiantes. Recién Llegué es el punto de encuentro para todos los que formamos parte de la vida en esta ciudad."
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    useEffect(() => {
        if (initialData) return; // Skip if we have initial data from server

        let isMounted = true;
        const fetchData = async () => {
            try {
                const [tipsData, featuredFoodData, eventsData, noticesData] = await Promise.all([
                    getTips(),
                    getFeaturedRestaurants(),
                    getCityEvents(),
                    getNotices()
                ]);

                if (isMounted) {
                    setTips(tipsData);
                    setEvents(eventsData.filter((e: any) => e.isFeatured));
                    setNoticesCount(noticesData.length);

                    // If we don't have enough featured restaurants, pick some random ones
                    if (featuredFoodData.length < 3) {
                        const allRestaurants = await getRestaurants();
                        const available = allRestaurants.filter(r => !featuredFoodData.some(f => f.id === r.id));
                        const randoms = available.sort(() => 0.5 - Math.random()).slice(0, 4 - featuredFoodData.length);
                        setFeaturedFood([...featuredFoodData, ...randoms]);
                    } else {
                        setFeaturedFood(featuredFoodData);
                    }

                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching desktop home data:", error);
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    return (
        <>
            <div className={`${styles.container} ${loading ? styles.loadingState : styles.loadedState}`}>
                {/* 1. HERO SECTION */}
                <section className={styles.hero}>
                    <motion.div
                        className={styles.statusPill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 2s infinite' }} />
                        Pergamino, Argentina • {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </motion.div>

                    <div className={styles.heroSlider}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={styles.slide}
                            >
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    {heroSlides[currentSlide].title}<br />
                                    <span>{heroSlides[currentSlide].subtitle}</span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {heroSlides[currentSlide].desc}
                                </motion.p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className={styles.heroDots}>
                        {heroSlides.map((_, i) => (
                            <button
                                key={i}
                                className={`${styles.dot} ${i === currentSlide ? styles.activeDot : ""}`}
                                onClick={() => setCurrentSlide(i)}
                                aria-label={`Ir al slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </section>

                {/* 2. CATEGORY NAVIGATION CARDS */}
                <section className={styles.navSection}>
                    {CATEGORIES.map((cat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 + 0.5 }}
                        >
                            <Link href={cat.href} className={styles.navCard}>
                                <div className={styles.catIconWrapper} style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                                    {cat.icon}
                                </div>
                                <div>
                                    <span className={styles.catLabel}>{cat.label}</span>
                                    <p className={styles.catDesc}>{cat.desc}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </section>

                {/* 3. PREMIUM EVENTS SECTION */}
                <section>
                    <div className={styles.sectionHeader}>
                        <h2>Agenda Destacada</h2>
                        <Link href="/eventos" className={styles.viewAll}>Ver cartelera completa</Link>
                    </div>

                    <div className={styles.eventStrip}>
                        {events.map((ev, i) => (
                            <motion.div
                                key={ev.id}
                                className={styles.eventCard}
                                onClick={() => setSelectedEvent(ev)}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 + 0.8 }}
                            >
                                <div className={styles.eventImgFrame}>
                                    {ev.imageUrl && (
                                        <Image
                                            src={ev.imageUrl}
                                            alt={ev.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 400px"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    )}
                                </div>
                                <div className={styles.eventDetails}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        <Compass size={14} /> {ev.location}
                                    </div>
                                    <h3>{ev.title}</h3>
                                    <div className={styles.eventTime}>
                                        <Calendar size={16} />
                                        <span>{ev.date}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 4. SPLIT GRID (FOOD & REMISES) */}
                <div className={styles.splitGrid}>
                    <section className={styles.foodSection}>
                        <div className={styles.sectionHeader}>
                            <div>
                                <h2>Sabores de la ciudad</h2>
                                <p className={styles.sectionSubtitle}>Los favoritos de la comunidad en Pergamino.</p>
                            </div>
                            <Link href="/comida" className={styles.viewMoreLink}>
                                Explorar gastronomía <ArrowUpRight size={18} />
                            </Link>
                        </div>

                        <div className={styles.foodGrid}>
                            {featuredFood.slice(0, 4).map((food, i) => (
                                <motion.div
                                    key={food.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link href="/comida" className={styles.foodCard}>
                                        <div className={styles.foodImgWrapper}>
                                            {food.image ? (
                                                <Image
                                                    src={food.image}
                                                    alt={food.name}
                                                    fill
                                                    sizes="120px"
                                                    className={styles.foodImg}
                                                />
                                            ) : (
                                                <div className={styles.foodPlaceholder}>
                                                    <Utensils size={32} opacity={0.2} />
                                                </div>
                                            )}
                                            {food.isFeaturedHome && <div className={styles.foodBadge}>Destacado</div>}
                                        </div>
                                        <div className={styles.foodCardInfo}>
                                            <h4>{food.name}</h4>
                                            <p>{food.category}</p>
                                            <div className={styles.foodRating}>
                                                <span style={{ color: '#f59e0b' }}>★</span> {food.rating || '4.5'}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <section className={styles.remisesSection}>
                        <div className={styles.sectionHeader}>
                            <div>
                                <h2>Agencias de Remis</h2>
                                <p className={styles.sectionSubtitle}>Viajá seguro en la ciudad.</p>
                            </div>
                        </div>

                        <div className={styles.remisesFullList}>
                            {[
                                { nombre: "Remis San José", numero: "02477434000", info: "Cerca de UNNOBA", icon: <Building2 size={24} /> },
                                { nombre: "Remis Yrigoyen", numero: "02477430072", info: "Zona Centro", icon: <MapPin size={24} /> },
                                { nombre: "Remis Stop", numero: "02477430585", info: "Rápido y Seguro", icon: <Zap size={24} /> }
                            ].map((remise, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={styles.remiseCard}
                                >
                                    <div className={styles.remiseAvatar}>{remise.icon}</div>
                                    <div className={styles.remiseContent}>
                                        <strong>{remise.nombre}</strong>
                                        <span>{remise.info}</span>
                                    </div>
                                    <a href={`tel:${remise.numero}`} className={styles.callBtnMain}>
                                        <Phone size={18} />
                                        <span>Llamar</span>
                                    </a>
                                </motion.div>
                            ))}
                        </div>

                    </section>
                </div>
            </div>

            {/* 5. CONTACT SECTION (Premium Desktop Adaptation) - Outside container for full width */}
            <motion.section
                className={`${styles.contactBanner} ${loading ? styles.loadingState : styles.loadedState}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className={styles.contactFooterContent}>
                    <div className={styles.contactContent}>
                        <h2>¿Tenés algo para contarnos?</h2>
                        <p>
                            Si querés sumar tu comercio, sos dueño de un alojamiento o encontraste algo que no funciona bien,
                            estamos a un mensaje de distancia. Ayudanos a hacer de este el mejor lugar para los que llegan.
                        </p>
                        <div className={styles.contactActions}>
                            <a href="https://wa.me/5491124025239" target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
                                <MessageCircle size={22} />
                                <span>Contactar por WhatsApp</span>
                            </a>
                            <span className={styles.contactNote}>Respondemos rápido</span>
                        </div>
                    </div>
                    <div className={styles.contactVisual}>
                        <div className={styles.floatingBubble}>
                            <MessageSquare size={32} />
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* 6. MODAL REFINEMENT */}
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
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.modalImgSection}>
                                {selectedEvent.imageUrl && (
                                    <Image
                                        src={selectedEvent.imageUrl}
                                        alt={selectedEvent.title}
                                        fill
                                        sizes="600px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                            <div className={styles.modalPane}>
                                <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapIcon size={16} /> {selectedEvent.location} • {selectedEvent.date}
                                </div>
                                <h2>{selectedEvent.title}</h2>
                                <div className={styles.modalCopy}>{selectedEvent.description}</div>
                                <div style={{ marginTop: 'auto' }}>
                                    <Link href={selectedEvent.link} target="_blank" className={styles.btnPrimary} style={{ textDecoration: 'none', display: 'block' }}>
                                        Ver sitio oficial del evento
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
});

export default DesktopHome;
