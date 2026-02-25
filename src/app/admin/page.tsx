"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ShieldAlert,
    Home,
    Utensils,
    Stethoscope,
    GraduationCap,
    Map as MapIcon,
    PlusCircle,
    BarChart3,
    Lightbulb,
    Bus,
    Loader2,
    User,
    MessageSquare,
    Store,
    AlertTriangle
} from "lucide-react";
import styles from "./Admin.module.css";
import { getAdminStats } from "@/app/actions/data";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        getAdminStats().then(setStats);
    }, []);

    return (
        <div className={styles.adminContainer}>
            <header className={styles.header}>
                <h1>Panel de Control</h1>
                <p>Gestión completa de la plataforma Recién Llegué.</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span>Reportes Pendientes</span>
                    <div className={styles.statValue}>
                        {stats ? stats.pendingReports : <Loader2 size={18} className="spin" />}
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span>Usuarios</span>
                    <div className={styles.statValue}>
                        {stats ? stats.totalUsers : <Loader2 size={18} className="spin" />}
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span>Hospedajes</span>
                    <div className={styles.statValue}>
                        {stats ? stats.totalProperties : <Loader2 size={18} className="spin" />}
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span>Avisos Activos</span>
                    <div className={styles.statValue}>
                        {stats ? stats.totalNotices : <Loader2 size={18} className="spin" />}
                    </div>
                </div>
            </div>

            {/* Alerta de Solicitudes Pendientes */}
            {stats && stats.pendingClaims > 0 && (
                <Link href="/admin/comida" style={{ textDecoration: 'none' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '1.25rem 1.5rem', marginBottom: '1.5rem',
                        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
                        borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 'var(--radius-md)',
                            background: 'rgba(245,158,11,0.15)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0
                        }}>
                            <Store size={22} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#b45309' }}>
                                {stats.pendingClaims} solicitud{stats.pendingClaims > 1 ? 'es' : ''} de comercio pendiente{stats.pendingClaims > 1 ? 's' : ''}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                Hay comercios esperando tu aprobación. Tocá para revisarlos.
                            </div>
                        </div>
                        <AlertTriangle size={20} color="#f59e0b" />
                    </div>
                </Link>
            )}

            <div className={styles.menuGrid}>
                <Link href="/admin/moderacion" className={styles.menuItem}>
                    <div className={styles.iconWrapper} style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}>
                        <ShieldAlert size={24} />
                    </div>
                    <div className={styles.menuInfo}>
                        <h3>Moderación</h3>
                        <p>Revisá avisos y comentarios reportados.</p>
                    </div>
                </Link>

                <Link href="/admin/usuarios" className={styles.menuItem}>
                    <div className={styles.iconWrapper} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                        <User size={24} />
                    </div>
                    <div className={styles.menuInfo}>
                        <h3>Usuarios</h3>
                        <p>Gestioná roles, permisos y bloqueos de usuarios.</p>
                    </div>
                </Link>

                <Link href="/admin/hospedaje" className={styles.menuItem}>
                    <div className={styles.iconWrapper}>
                        <Home size={24} />
                    </div>
                    <div className={styles.menuInfo}>
                        <h3>Hospedajes</h3>
                        <p>Publicá residencias y departamentos.</p>
                    </div>
                </Link>

                <Link href="/admin/comida" className={styles.menuItem}>
                    <div className={styles.iconWrapper} style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}>
                        <Utensils size={24} />
                    </div>
                    <div className={styles.menuInfo}>
                        <h3>Comida y Ocio</h3>
                        <p>Cargá rotiserías, bares y cafeterías.</p>
                    </div>
                </Link>

                <Link href="/admin/avisos" className={styles.menuItem}>
                    <div className={styles.iconWrapper} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <MessageSquare size={24} />
                    </div>
                    <div className={styles.menuInfo}>
                        <h3>Avisos</h3>
                        <p>Moderá todos los avisos clasificados activos.</p>
                    </div>
                </Link>

                <Link href="/admin/salud" className={styles.menuItem}>
                    <div className={styles.iconWrapper} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <Stethoscope size={24} />
                    </div>
                    <div className={styles.menuInfo}>
                        <h3>Salud</h3>
                        <p>Gestioná centros médicos y CAPS.</p>
                    </div>
                </Link>

                <Link href="/admin/unnoba" className={styles.menuItem}>
                    <div className={styles.iconWrapper} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <GraduationCap size={24} />
                    </div>
                    <div className={styles.menuInfo}>
                        <h3>UNNOBA</h3>
                        <p>Actualizá servicios y sedes de la facultad.</p>
                    </div>
                </Link>

                <Link href="/admin/mapa" className={styles.menuItem}>
                    <div className={styles.iconWrapper} style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                        <MapIcon size={24} />
                    </div>
                    <div className={styles.menuInfo}>
                        <h3>Mapa y POIs</h3>
                        <p>Ajustá ubicaciones y coordenadas en tiempo real.</p>
                    </div>
                </Link>

                <Link href="/admin/transporte" className={styles.menuItem}>
                    <div className={styles.iconWrapper} style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                        <Bus size={24} />
                    </div>
                    <div className={styles.menuInfo}>
                        <h3>Transporte</h3>
                        <p>Cargá líneas de colectivo y rutas de terminal.</p>
                    </div>
                </Link>

                <Link href="/admin/tips" className={styles.menuItem}>
                    <div className={styles.iconWrapper} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        <Lightbulb size={24} />
                    </div>
                    <div className={styles.menuInfo}>
                        <h3>Tips del Día</h3>
                        <p>Gestioná los tips que se muestran en la pantalla principal.</p>
                    </div>
                </Link>

                <Link href="/admin/eventos" className={styles.menuItem}>
                    <div className={styles.iconWrapper} style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}>
                        <BarChart3 size={24} />
                    </div>
                    <div className={styles.menuInfo}>
                        <h3>Eventos</h3>
                        <p>Agregá y gestioná eventos de la ciudad.</p>
                    </div>
                </Link>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <Link href="/" className={styles.menuInfo} style={{ textDecoration: 'underline' }}>
                    <p>Volver a la App Principal</p>
                </Link>
            </div>
        </div>
    );
}
