"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import TopBar from "@/components/layout/TopBar";
import { ChevronLeft, FileText, MessageCircle, Clock, Plus } from "lucide-react";
import Link from "next/link";
import styles from "@/app/perfil/ContenidoPerfil.module.css";
import { getUserNotices } from "@/app/actions/data";

export interface MisAvisosInitialData {
    notices: any[];
}

interface MobileMisAvisosProps {
    initialData?: MisAvisosInitialData | null;
}

export default function MobileMisAvisos({ initialData }: MobileMisAvisosProps) {
    const { data: session, status } = useSession();
    const [notices, setNotices] = useState(initialData?.notices ?? []);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (initialData) return;
        if (session?.user) getUserNotices((session.user as any).id).then(setNotices);
        setLoading(false);
    }, [session?.user, initialData]);

    if (status === "loading" || loading) {
        return (
            <div className="">
                <main className="safe-bottom">
                    <TopBar />
                    <div className={styles.loading}>Cargando tus publicaciones...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="">
            <main className="safe-bottom">
                <TopBar />
                <div className={styles.container}>
                    <header className={styles.header}>
                        <Link href="/perfil" className={styles.backBtn}><ChevronLeft size={24} /></Link>
                        <h1>Mis Publicaciones</h1>
                    </header>
                    {notices.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}><FileText size={80} /></div>
                            <h3>No tenés avisos</h3>
                            <p>Publicá algo para que la comunidad pueda ayudarte o informarse.</p>
                            <Link href="/avisos/nuevo" className={styles.actionBtn}><Plus size={18} /> Crear Aviso</Link>
                        </div>
                    ) : (
                        <div className={styles.list}>
                            {notices.map((notice) => (
                                <Link key={notice.id} href={`/avisos/${notice.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className={styles.noticeCard}>
                                        <div className={styles.noticeTop}>
                                            <span className={styles.categoryTag}>{notice.category}</span>
                                            <span className={styles.date}>{new Date(notice.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3>{notice.title}</h3>
                                        <p>{notice.description}</p>
                                        <div className={styles.noticeFooter}>
                                            <div className={styles.footerItem}>
                                                <MessageCircle size={14} />
                                                <span>{notice._count?.comments ?? 0} comentarios</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            <Link href="/avisos/nuevo" className={styles.actionBtn} style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <Plus size={18} /> Publicar otro aviso
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
