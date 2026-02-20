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
  Phone
} from "lucide-react";
import { getNotices, getTips } from "@/app/actions/data";

export default function Home() {
  const { data: session } = useSession();
  const [latestNotices, setLatestNotices] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [currentTip, setCurrentTip] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [noticesData, tipsData] = await Promise.all([
        getNotices(),
        getTips()
      ]);
      setLatestNotices(noticesData.slice(0, 2));
      setTips(tipsData);
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

  const categories = [
    { icon: <HomeIcon size={24} />, label: "Hospedaje", color: "#6366f1", description: "Residencias y deptos", href: "/hospedaje" },
    { icon: <Utensils size={24} />, label: "Comida", color: "#f43f5e", description: "Rotiserías y bares", href: "/comida" },
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

      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.heroContent}>
          <h2>¿Recién llegaste?</h2>
          <p>No te preocupes, acá tenés todo para arrancar.</p>
        </div>
      </motion.section>

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
          href="https://wa.me/54924771124025239?text=Hola!%20Vengo%20desde%20la%20app%20Recién%20Llegué"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactButton}
        >
          <MessageCircle size={20} />
          Contactar por WhatsApp
        </a>
      </motion.section>
    </main >
  );
}
