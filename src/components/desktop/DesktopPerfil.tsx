"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Heart, FileText, Edit2, MapPin, GraduationCap, HelpCircle, Store } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import { getUserStats } from "@/app/actions/data";
import styles from "./DesktopPerfil.module.css";

export interface PerfilInitialData {
    stats: { notices: number; favorites: number };
}

interface DesktopPerfilProps {
    initialData?: PerfilInitialData | null;
}

export default function DesktopPerfil({ initialData }: DesktopPerfilProps) {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState(initialData?.stats ?? { notices: 0, favorites: 0 });

    useEffect(() => {
        if (session?.user && !initialData?.stats) {
            getUserStats((session.user as any).id).then(setStats);
        }
    }, [session?.user, initialData?.stats]);

    if (status === "loading") {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '10vh 0' }}>Cargando perfil...</div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className={styles.container}>
                <div className={styles.welcomeGrid}>
                    <main className={styles.guestCard}>
                        <h2>¡Bienvenido! 👋</h2>
                        <p>Iniciá sesión para administrar tu perfil, guardar lugares favoritos y publicar avisos en la comunidad de Pergamino.</p>

                        <div className={styles.guestActions}>
                            <Link href="/login" className={styles.loginBtn}>
                                Iniciar Sesión
                            </Link>
                            <Link href="/registro" className={styles.registerBtn}>
                                Crear una cuenta
                            </Link>
                        </div>
                    </main>

                    <div className={styles.guestBrand}>
                        <img src="/assets/icons/Iconrmbg.png" alt="RecienLlegué" className={styles.guestBrandLogo} />
                        <h3 className={styles.guestBrandTitle}>Recien<span>Llegué</span></h3>
                        <p className={styles.guestBrandSub}>Todo lo que necesitás en Pergamino, en un solo lugar.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.profileHeader}>
                <div className={styles.avatarWrapper}>
                    <UserAvatar seed={(session.user as any).avatarSeed || session.user?.email || "default"} size={120} role={(session.user as any).role} />
                </div>
                <div className={styles.userInfo}>
                    <h1>{session.user?.name}</h1>
                    <p className={styles.userEmail}>{session.user?.email}</p>

                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {(session.user as any).campus && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem', color: 'var(--text-muted)' }}>
                                <MapPin size={18} /> {(session.user as any).campus}
                            </span>
                        )}
                        {(session.user as any).gradYear && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem', color: 'var(--text-muted)' }}>
                                <GraduationCap size={18} /> Egreso {(session.user as any).gradYear}
                            </span>
                        )}
                    </div>
                </div>
                <Link href="/perfil/editar" className={styles.editBtn}>
                    <Edit2 size={16} /> Editar Cuenta
                </Link>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.favorites}</div>
                    <div className={styles.statLabel}>Favoritos guardados</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.notices}</div>
                    <div className={styles.statLabel}>Publicaciones activas</div>
                </div>
            </div>

            <nav className={styles.menuGrid}>
                {(session.user as any).role === "DUENO" && (
                    <Link href="/perfil/mis-locales" className={styles.menuItem} style={{ borderLeft: '4px solid var(--primary)', background: 'rgba(99, 102, 241, 0.05)' }}>
                        <div className={styles.iconCircle}><Store size={24} color="var(--primary)" /></div>
                        <div className={styles.itemInfo}>
                            <h3 style={{ color: 'var(--primary)' }}>Panel de Comercio</h3>
                            <p>Gestioná tus locales y revisá el estado de verificación.</p>
                        </div>
                    </Link>
                )}

                <Link href="/perfil/mis-avisos" className={styles.menuItem}>
                    <div className={styles.iconCircle}><FileText size={24} /></div>
                    <div className={styles.itemInfo}>
                        <h3>Mis Publicaciones</h3>
                        <p>Administrá tus avisos y clasificados.</p>
                    </div>
                </Link>

                <Link href="/perfil/favoritos" className={styles.menuItem}>
                    <div className={styles.iconCircle}><Heart size={24} /></div>
                    <div className={styles.itemInfo}>
                        <h3>Favoritos</h3>
                        <p>Tus lugares y anuncios guardados.</p>
                    </div>
                </Link>

                <Link href="/ayuda" className={styles.menuItem}>
                    <div className={styles.iconCircle}><HelpCircle size={24} /></div>
                    <div className={styles.itemInfo}>
                        <h3>Ayuda y Soporte</h3>
                        <p>Preguntas frecuentes y contacto.</p>
                    </div>
                </Link>
            </nav>

            <button onClick={() => signOut()} className={styles.logoutBtn}>
                <LogOut size={20} /> Cerrar Sesión
            </button>
        </div>
    );
}
