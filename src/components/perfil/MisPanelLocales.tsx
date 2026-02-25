"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyBusinesses, getMyNotifications, markNotificationsRead } from "@/app/actions/data";
import {
    Store, Home, ChevronLeft, BadgeCheck, Crown, Clock,
    AlertCircle, CheckCircle2, XCircle, Bell, BellOff, MapPin, Phone
} from "lucide-react";
import styles from "./MisPanelLocales.module.css";

interface Props {
    userId: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: ReactNode }> = {
    "PENDIENTE": {
        label: "Pendiente de revisión",
        color: "#f59e0b",
        icon: <Clock size={14} />
    },
    "REVISADO": {
        label: "Verificado ✅",
        color: "#10b981",
        icon: <CheckCircle2 size={14} />
    },
    "DESESTIMADO": {
        label: "No aprobado",
        color: "#f43f5e",
        icon: <XCircle size={14} />
    }
};

export default function MisPanelLocales({ userId }: Props) {
    const router = useRouter();
    const [businesses, setBusinesses] = useState<any>({ restaurants: [], properties: [] });
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNotif, setShowNotif] = useState(false);
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        const load = async () => {
            const [biz, notifs] = await Promise.all([
                getMyBusinesses(userId),
                getMyNotifications(userId)
            ]);
            setBusinesses(biz);
            setNotifications(notifs);
            setUnread(notifs.filter((n: any) => !n.read).length);
            setLoading(false);
        };
        load();
    }, [userId]);

    const handleOpenNotif = async () => {
        setShowNotif(true);
        if (unread > 0) {
            await markNotificationsRead(userId);
            setUnread(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    const allBusinesses = [
        ...businesses.restaurants,
        ...businesses.properties
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    <ChevronLeft size={22} />
                </button>
                <div className={styles.headerTitle}>
                    <Store size={22} color="var(--primary)" />
                    <h1>Panel de Comercio</h1>
                </div>
                <button
                    className={styles.notifBtn}
                    onClick={handleOpenNotif}
                    style={{ position: 'relative' }}
                >
                    <Bell size={20} />
                    {unread > 0 && (
                        <span className={styles.badge}>{unread}</span>
                    )}
                </button>
            </div>

            {/* Panel de Notificaciones */}
            {showNotif && (
                <div className={styles.notifPanel}>
                    <div className={styles.notifHeader}>
                        <h3>Notificaciones</h3>
                        <button onClick={() => setShowNotif(false)}><XCircle size={18} /></button>
                    </div>
                    {notifications.length === 0 ? (
                        <div className={styles.emptyNotif}>
                            <BellOff size={28} />
                            <p>No tenés notificaciones aún.</p>
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} className={`${styles.notifItem} ${!n.read ? styles.notifUnread : ''}`}>
                                <div className={styles.notifContent}>
                                    <strong>{n.title}</strong>
                                    <p>{n.body}</p>
                                    <span className={styles.notifDate}>
                                        {new Date(n.createdAt).toLocaleDateString('es-AR')}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* CTA para registrar nuevo */}
            <div className={styles.ctaCard}>
                <div>
                    <strong>¿Tenés otro local?</strong>
                    <p>Podés registrar más comercios o reclamar existentes.</p>
                </div>
                <Link href="/unirse" className={styles.ctaBtn}>
                    + Agregar
                </Link>
            </div>

            {/* Lista de locales */}
            {loading ? (
                <div className={styles.loadingState}>
                    <div className={styles.spinner} />
                    <p>Cargando tus locales...</p>
                </div>
            ) : allBusinesses.length === 0 ? (
                <div className={styles.emptyState}>
                    <Store size={48} className={styles.emptyIcon} />
                    <h3>No tenés locales registrados</h3>
                    <p>Cuando registres o reclames un local, lo vas a ver acá con el estado de verificación.</p>
                    <Link href="/unirse" className={styles.emptyBtn}>Ir al Panel de Unirse</Link>
                </div>
            ) : (
                <div className={styles.list}>
                    {allBusinesses.map((b: any) => {
                        const status = STATUS_CONFIG[b.claimStatus] ?? null;
                        const isRestaurant = b.type === 'RESTAURANT';
                        return (
                            <div key={b.id} className={styles.card}>
                                {/* Image */}
                                <div className={styles.cardImage}>
                                    {b.image ? (
                                        <img src={b.image} alt={b.name || b.title} />
                                    ) : (
                                        <div className={styles.imageFallback}>
                                            {isRestaurant ? <Store size={28} /> : <Home size={28} />}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.cardBody}>
                                    {/* Type + Status */}
                                    <div className={styles.cardMeta}>
                                        <span className={styles.typeChip}>
                                            {isRestaurant ? '🍽️ Restaurante' : '🏠 Hospedaje'}
                                        </span>
                                        <div className={styles.badges}>
                                            {b.isPremium && (
                                                <span className={styles.premiumBadge}>
                                                    <Crown size={10} /> Premium
                                                </span>
                                            )}
                                            {b.isVerified && !b.isPremium && (
                                                <span className={styles.verifiedBadge}>
                                                    <BadgeCheck size={10} /> Verificado
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className={styles.cardName}>{b.name || b.title}</h3>

                                    {b.address && (
                                        <div className={styles.cardDetail}>
                                            <MapPin size={12} />
                                            <span>{b.address}</span>
                                        </div>
                                    )}
                                    {b.phone && (
                                        <div className={styles.cardDetail}>
                                            <Phone size={12} />
                                            <span>{b.phone}</span>
                                        </div>
                                    )}

                                    {/* Claim Status */}
                                    {status && (
                                        <div
                                            className={styles.statusPill}
                                            style={{ color: status.color, background: `${status.color}18` }}
                                        >
                                            {status.icon}
                                            <span>{status.label}</span>
                                        </div>
                                    )}

                                    {b.claimStatus === 'DESESTIMADO' && (
                                        <div className={styles.rejectedNote}>
                                            <AlertCircle size={12} />
                                            <span>Tu solicitud fue rechazada. Podés volver a intentarlo con más información.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
