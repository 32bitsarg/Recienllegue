"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import Link from "next/link";
import { LogOut, Heart, FileText, Edit2, MapPin, GraduationCap, HelpCircle, Store } from "lucide-react";
import styles from "@/app/perfil/Perfil.module.css";
import UserAvatar from "@/components/common/UserAvatar";
import { getUserStats } from "@/app/actions/data";

export interface PerfilInitialData {
    stats: { notices: number; favorites: number };
}

interface MobilePerfilProps {
    initialData?: PerfilInitialData | null;
}

export default function MobilePerfil({ initialData }: MobilePerfilProps) {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState(initialData?.stats ?? { notices: 0, favorites: 0 });

    useEffect(() => {
        if (session?.user && !initialData?.stats) {
            getUserStats((session.user as any).id).then(setStats);
        }
    }, [session?.user, initialData?.stats]);

    const loading = status === "loading";

    if (loading) {
        return (
            <div className="">
                <main className="safe-bottom">
                    <TopBar />
                    <div className={styles.loading}>Cargando perfil...</div>
                </main>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="">
                <main className="safe-bottom">
                    <TopBar />
                    <div className={styles.guestContainer}>
                        <div className={styles.avatarPlaceholder}>
                            <img src="/assets/icons/Iconrmbg.png" alt="Recien Llegue" className={styles.guestIcon} />
                        </div>
                        <h2>Hola, Invitado</h2>
                        <p>Iniciá sesión para guardar tus favoritos y publicar en la comunidad.</p>
                        <div className={styles.authButtons}>
                            <Link href="/login" className={styles.loginBtn}>Iniciar Sesión</Link>
                            <Link href="/registro" className={styles.registerBtn}>Crear Cuenta</Link>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="">
            <main className="safe-bottom">
                <TopBar />
                <div className={styles.profileContainer}>
                    <div className={styles.profileHeader}>
                        <UserAvatar seed={(session.user as any).avatarSeed || session.user?.email || "default"} size={80} role={(session.user as any).role} className={styles.avatar} />
                        <div className={styles.profileInfo}>
                            <h2>{session.user?.name}</h2>
                            <p>{session.user?.email}</p>
                            <Link href="/perfil/editar" className={styles.editLink}>
                                <Edit2 size={12} /> Editar Perfil
                            </Link>
                        </div>
                    </div>
                    {(session.user as any).bio && (
                        <div className={styles.bioSection}>
                            <p>{(session.user as any).bio}</p>
                        </div>
                    )}
                    <div className={styles.detailsRow}>
                        {(session.user as any).campus && (
                            <div className={styles.detailItem}>
                                <MapPin size={14} />
                                <span>{(session.user as any).campus}</span>
                            </div>
                        )}
                        {(session.user as any).gradYear && (
                            <div className={styles.detailItem}>
                                <GraduationCap size={14} />
                                <span>Egreso {(session.user as any).gradYear}</span>
                            </div>
                        )}
                    </div>
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <strong>{stats.favorites}</strong>
                            <span>Favoritos</span>
                        </div>
                        <div className={styles.statItem}>
                            <strong>{stats.notices}</strong>
                            <span>Avisos</span>
                        </div>
                    </div>
                    <div className={styles.menu}>
                        {(session.user as any).role === "DUENO" && (
                            <Link href="/perfil/mis-locales" className={styles.menuItem} style={{ borderLeft: '4px solid var(--primary)', background: 'rgba(99, 102, 241, 0.05)' }}>
                                <Store size={20} color="var(--primary)" />
                                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Panel de Comercio</span>
                            </Link>
                        )}
                        <Link href="/perfil/mis-avisos" className={styles.menuItem}>
                            <FileText size={20} />
                            <span>Mis Publicaciones</span>
                        </Link>
                        <Link href="/perfil/favoritos" className={styles.menuItem}>
                            <Heart size={20} />
                            <span>Mis Favoritos</span>
                        </Link>
                        <Link href="/ayuda" className={styles.menuItem}>
                            <HelpCircle size={20} />
                            <span>Ayuda y Soporte</span>
                        </Link>
                        <button onClick={() => signOut()} className={styles.logoutBtn}>
                            <LogOut size={20} />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
