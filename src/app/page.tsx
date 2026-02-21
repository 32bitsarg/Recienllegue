"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "@/components/layout/TopBar";
import EmptyState from "@/components/common/EmptyState";
import styles from "./page.module.css";
import {
  Home as HomeIcon,
  Utensils,
  GraduationCap,
  Bus,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Phone,
  Calendar,
  MapPin,
  Clock,
  X,
  ExternalLink
} from "lucide-react";
import { getNotices, getTips, getFeaturedRestaurants, getCityEvents } from "@/app/actions/data";

export default function Home() {
  const { data: session } = useSession();
  const [latestNotices, setLatestNotices] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [currentTip, setCurrentTip] = useState(0);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const heroSlides = [
    { title: "¿Recién llegaste?", desc: "No te preocupes, acá tenés todo para empezar tu nueva vida universitaria." },
    { title: "Cada día más completa", desc: "Seguimos sumando información, servicios y nuevos comercios constantemente para vos." }
  ];
  const [featuredFood, setFeaturedFood] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [noticesData, tipsData, foodData, eventsData] = await Promise.all([
        getNotices(),
        getTips(),
        getFeaturedRestaurants(),
        getCityEvents()
      ]);
      setLatestNotices(noticesData.slice(0, 2));
      setTips(tipsData);
      setFeaturedFood(foodData);
      setEvents(eventsData.filter((e: any) => e.isFeatured));
      setLoading(false);
    };
    fetchData();
  }, []);

  // Auto-rotate tips every 8 seconds
  useEffect(() => {
    if (tips.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [tips.length]);

  // Auto-rotate hero slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const categories = [
    { icon: <HomeIcon size={24} />, label: "Hospedaje", color: "#6366f1", description: "Residencias y deptos", href: "/hospedaje" },
    { icon: <Utensils size={24} />, label: "Comida & Comercios", color: "#f43f5e", description: "Lugares para comer y comprar", href: "/comida" },
    { icon: <GraduationCap size={24} />, label: "UNNOBA", color: "#10b981", description: "Trámites y sedes", href: "/unnoba" },
    { icon: <Bus size={24} />, label: "Transporte", color: "#06b6d4", description: "Colectivos y remises", href: "/transporte" },
    { icon: <Stethoscope size={24} />, label: "Salud", color: "#8b5cf6", description: "Guardias y farmacias", href: "/salud" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const activeTip = tips.length > 0 ? tips[currentTip] : null;

  const prevTip = () => setCurrentTip(prev => (prev - 1 + tips.length) % tips.length);
  const nextTip = () => setCurrentTip(prev => (prev + 1) % tips.length);

  return (
    <main className="safe-bottom">
      <TopBar />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2>{heroSlides[currentHeroSlide].title}</h2>
              <p>{heroSlides[currentHeroSlide].desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className={styles.heroDots}>
          {heroSlides.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === currentHeroSlide ? styles.activeDot : ''}`}
              onClick={() => setCurrentHeroSlide(i)}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Categorías</h3>
          <div className={styles.scrollHint}>
            <span>Deslizar</span>
            <ChevronRight size={14} />
          </div>
        </div>
        <motion.div
          className={styles.categoryGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((cat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link href={cat.href || "#"} className={styles.categoryCard}>
                <div
                  className={styles.iconWrapper}
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  {cat.icon}
                </div>
                <span className={styles.categoryLabel}>{cat.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Tips Section - Dynamic */}
      {activeTip && (
        <motion.section
          className={styles.section}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className={styles.tipCard}>
            <div className={styles.tipIcon}>{activeTip.emoji || "💡"}</div>
            <div className={styles.tipContent}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4>{activeTip.title}</h4>
                  <p>{activeTip.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            {tips.length > 1 && (
              <div className={styles.tipNav}>
                <button onClick={prevTip} className={styles.tipNavBtn} aria-label="Tip anterior">
                  <ChevronLeft size={16} />
                </button>
                <span className={styles.tipCounter}>{currentTip + 1}/{tips.length}</span>
                <button onClick={nextTip} className={styles.tipNavBtn} aria-label="Siguiente tip">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Events Section */}
      {events.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Eventos en la ciudad</h3>
            <div className={styles.scrollHint} style={{ color: '#d97706', opacity: 0.8 }}>
              <span>Deslizar</span>
              <ChevronRight size={14} />
            </div>
          </div>
          <div className={styles.eventsGrid}>
            {events.map((ev, i) => {
              const content = (
                <>
                  {ev.imageUrl ? (
                    <img src={ev.imageUrl} alt={ev.title} className={styles.eventImage} />
                  ) : (
                    <div className={styles.eventImage} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <Calendar size={48} style={{ opacity: 0.5 }} />
                    </div>
                  )}
                  <div className={styles.eventHeader}>
                    <div className={styles.eventDateBadge}>
                      <Calendar size={12} /> {ev.date}
                    </div>
                  </div>
                  <div className={styles.eventInfo}>
                    <h4 className={styles.eventTitle}>{ev.title}</h4>
                    {ev.description && <p className={styles.eventDesc}>{ev.description}</p>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                      {ev.location && (
                        <div className={styles.eventMeta}>
                          <MapPin size={12} /> {ev.location}
                        </div>
                      )}
                      {ev.time && (
                        <div className={styles.eventMeta}>
                          <Clock size={12} /> {ev.time}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );

              return (
                <div key={ev.id} className={styles.eventCard} onClick={() => setSelectedEvent(ev)}>
                  {content}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {featuredFood.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Sugerencias</h3>
            <Link href="/comida" className={styles.viewAll}>Ver todo <ChevronRight size={14} /></Link>
          </div>
          <div className={styles.featuredFoodGrid}>
            {featuredFood.map((food, i) => (
              <Link href="/comida" key={food.id || i} className={styles.featuredFoodCard}>
                {food.image ? (
                  <img src={food.image} alt={food.name} className={styles.featuredFoodImage} />
                ) : (
                  <div className={styles.featuredFoodFallback} style={{ position: 'relative' }}>
                    <img
                      src={`https://api.dicebear.com/9.x/shapes/svg?seed=${food.id || i}&backgroundColor=f1f5f9,e2e8f0,cbd5e1`}
                      alt="Generated background"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, objectFit: 'cover' }}
                    />
                    <Utensils size={32} style={{ opacity: 0.2, zIndex: 1 }} />
                  </div>
                )}
                <div className={styles.featuredFoodInfo}>
                  <h4>{food.name}</h4>
                  <p>{food.featured || food.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Agencias de Remises</h3>
          <span className={styles.viewAll}>Disponibles 24hs</span>
        </div>
        <div className={styles.remisesGrid}>
          {[
            { nombre: "Remis San José", numero: "02477434000", featured: true, info: "Cerca de UNNOBA y Hospital" },
            { nombre: "Remis Yrigoyen", numero: "02477430072" },
            { nombre: "Remis Stop", numero: "02477430585" }
          ].map((remise, i) => (
            <div key={i} className={`${styles.remiseCard} ${remise.featured ? styles.remiseCardFeatured : ""}`}>
              {remise.featured && <span className={styles.badge}>Recomendado</span>}
              <div className={styles.remiseInfo}>
                <h4>{remise.nombre}</h4>
                <p>{remise.info || remise.numero}</p>
              </div>
              <a href={`tel:${remise.numero}`} className={styles.callBtn}>
                <Phone size={14} />
                Llamar
              </a>
            </div>
          ))}
        </div>
      </section>

      <motion.section
        className={styles.contactSection}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className={styles.contactContent}>
          <h4>¿Querés sumarte?</h4>
          <p>
            Si sos dueño de un alojamiento, comercio, o querés reportar un problema, ¡escribime!
          </p>
        </div>
        <a
          href="https://wa.me/5491124025239?text=Hola!%20Vengo%20desde%20la%20app%20Recién%20Llegué"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactButton}
        >
          <MessageCircle size={20} />
          Contactar por WhatsApp
        </a>
      </motion.section>

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
              className={styles.modalContent}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                {selectedEvent.imageUrl ? (
                  <img src={selectedEvent.imageUrl} alt={selectedEvent.title} />
                ) : (
                  <div className={styles.imageFallback} style={{ height: '100%', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    <Calendar size={48} style={{ opacity: 0.2, color: 'white' }} />
                  </div>
                )}
                <button className={styles.modalCloseBtn} onClick={() => setSelectedEvent(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalCategory} style={{ color: '#d97706', background: 'rgba(217,119,6,0.1)' }}>
                  Evento Destacado
                </div>
                <h2 className={styles.modalTitle}>{selectedEvent.title}</h2>
                <div className={styles.modalDetails} style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                  <div className={styles.modalDetailRow} style={{ color: '#d97706' }}>
                    <Calendar size={16} />
                    <span>{selectedEvent.date}</span>
                  </div>
                  {selectedEvent.time && (
                    <div className={styles.modalDetailRow}>
                      <Clock size={16} />
                      <span>{selectedEvent.time}</span>
                    </div>
                  )}
                  {selectedEvent.location && (
                    <div className={styles.modalDetailRow}>
                      <MapPin size={16} />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
                {selectedEvent.description && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                    {selectedEvent.description}
                  </p>
                )}
                {selectedEvent.link && (
                  <a href={selectedEvent.link} target="_blank" rel="noopener noreferrer" className={styles.eventLinkBtn}>
                    Ver más información <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main >
  );
}
