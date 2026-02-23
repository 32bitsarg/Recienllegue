"use client";

import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import { ChevronLeft, MessageSquare, Send, Clock } from "lucide-react";
import Link from "next/link";
import UserAvatar from "@/components/common/UserAvatar";
import styles from "@/app/avisos/[id]/DetalleAviso.module.css";
import { addComment } from "@/app/actions/data";

export interface DetalleAvisoInitialData {
    notice: any;
}

interface MobileDetalleAvisoProps {
    initialData: DetalleAvisoInitialData | null;
}

export default function MobileDetalleAviso({ initialData }: MobileDetalleAvisoProps) {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [notice, setNotice] = useState<any>(initialData?.notice ?? null);
    const [comment, setComment] = useState("");
    const [sending, setSending] = useState(false);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/login?callbackUrl=/avisos/${params.id}`);
        }
    }, [status, params.id, router]);

    useEffect(() => {
        if (initialData?.notice) setNotice(initialData.notice);
    }, [initialData?.notice]);

    const scrollToBottom = () => commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });

    const handleSendComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !session?.user || sending || !notice) return;
        setSending(true);
        try {
            const newComment = await addComment(notice.id, (session.user as any).id, comment.trim());
            setNotice({ ...notice, comments: [...notice.comments, newComment] });
            setComment("");
            setTimeout(scrollToBottom, 100);
        } catch {
            alert("No se pudo publicar el comentario. Intentá de nuevo.");
        } finally {
            setSending(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="">
                <main className="safe-bottom">
                    <TopBar />
                    <div className={styles.loading}>Cargando aviso...</div>
                </main>
            </div>
        );
    }

    if (status === "unauthenticated") return null;

    if (!notice) {
        return (
            <div className="">
                <main className="safe-bottom">
                    <TopBar />
                    <div className={styles.error}>
                        <h2>Aviso no encontrado</h2>
                        <p>El aviso que buscás no existe o fue eliminado.</p>
                        <Link href="/avisos" className={styles.retryBtn}>Volver al tablón</Link>
                    </div>
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
                        <Link href="/avisos" className={styles.backBtn}>
                            <ChevronLeft size={24} />
                        </Link>
                        <h1>Detalle del Aviso</h1>
                    </header>
                    <article className={styles.noticeCard}>
                        <div className={styles.noticeMeta}>
                            <div className={styles.authorCard} style={{ margin: 0, padding: 0, background: 'none' }}>
                                <UserAvatar seed={notice.author?.avatarSeed || notice.author?.email || "default"} size={36} />
                                <div className={styles.authorInfo} style={{ marginLeft: '0.5rem' }}>
                                    <h4 style={{ fontSize: '0.85rem' }}>{notice.author?.name}</h4>
                                    <p style={{ fontSize: '0.75rem' }}>@{notice.author?.username || "estudiante"}</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className={styles.categoryTag}>{notice.category}</span>
                                <div className={styles.date} style={{ marginTop: '0.2rem' }}><Clock size={10} /> {new Date(notice.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <h2 className={styles.noticeTitle} style={{ marginTop: '1rem' }}>{notice.title}</h2>
                        <div className={styles.noticeContent}>{notice.description}</div>
                    </article>
                    <section className={styles.commentsSection}>
                        <h3><MessageSquare size={20} /> Comentarios ({notice.comments?.length ?? 0})</h3>
                        <div className={styles.commentList}>
                            {(!notice.comments || notice.comments.length === 0) ? (
                                <p className={styles.loading}>No hay comentarios todavía. ¡Sé el primero!</p>
                            ) : (
                                notice.comments.map((c: any) => (
                                    <div key={c.id} className={styles.commentItem}>
                                        <UserAvatar seed={c.author?.avatarSeed || c.author?.email || "default"} size={32} />
                                        <div className={styles.commentBubble}>
                                            <div className={styles.commentHeader}>
                                                <span className={styles.commentAuthor}>{c.author?.name} (@{c.author?.username || "estudiante"})</span>
                                                <span className={styles.commentDate}>{new Date(c.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className={styles.commentText}>{c.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={commentsEndRef} />
                        </div>
                    </section>
                    <form className={styles.commentForm} onSubmit={handleSendComment}>
                        <textarea className={styles.commentInput} placeholder="Escribí un comentario..." value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendComment(e); } }} rows={1} />
                        <button type="submit" className={styles.sendBtn} disabled={!comment.trim() || sending}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
