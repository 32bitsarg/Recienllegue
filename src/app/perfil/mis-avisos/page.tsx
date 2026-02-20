"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserNotices } from "@/app/actions/data";
import TopBar from "@/components/layout/TopBar";
import { ChevronLeft, FileText, MessageCircle, Clock, Plus } from "lucide-react";
import Link from "next/link";
import styles from "../ContenidoPerfil.module.css";

export default function MyNoticesPage() {
    const { data: session, status } = useSession();
    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (session?.user) {
                const data = await getUserNotices((session.user as any).id);
                setNotices(data);
            }
            setLoading(false);
        }
        if (status !== "loading") {
            load();
        }
    }, [session, status]);

    if (status === "loading" || loading) {
        return (
            <main className="safe-bottom">
                <TopBar />
                <div className={styles.loading}>Cargando tus publicaciones...</div>
            </main>
        );
    }

    return (
        <main className="safe-bottom">
            <TopBar />

            <div className={styles.container}>
                <header className={styles.header}>
                    <Link href="/perfil" className={styles.backBtn}>
                        <ChevronLeft size={24} />
                    </Link>
                    <h1>Mis Publicaciones</h1>
                </header>

                {notices.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <FileText size={80} />
                        </div>
                        <h3>No tenés avisos</h3>
                        <p>Publicá algo para que la comunidad pueda ayudarte o informarse.</p>
                        <Link href="/avisos/nuevo" className={styles.actionBtn}>
                            <Plus size={18} /> Crear Aviso
                        </Link>
                    </div>
                ) : (
                    <div className={styles.list}>
                        {notices.map((notice) => (
                            <div key={notice.id} className={styles.noticeCard}>
                                <div className={styles.noticeTop}>
                                    <span className={styles.categoryTag}>{notice.category}</span>
                                    <span className={styles.date}>
                                        {new Date(notice.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3>{notice.title}</h3>
                                <p>{notice.description}</p>
                                <div className={styles.noticeFooter}>
                                    <div className={styles.footerItem}>
                                        <MessageCircle size={14} />
                                        <span>{notice._count.comments} comentarios</span>
                                    </div>
                                    <div className={styles.footerItem}>
                                        <Clock size={14} />
                                        <span>En revisión</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Link href="/avisos/nuevo" className={styles.actionBtn} style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <Plus size={18} /> Publicar otro aviso
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
