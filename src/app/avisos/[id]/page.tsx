"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNoticeById, addComment } from "@/app/actions/data";
import TopBar from "@/components/layout/TopBar";
import { ChevronLeft, MessageSquare, Send, Clock, User } from "lucide-react";
import Link from "next/link";
import UserAvatar from "@/components/common/UserAvatar";
import styles from "./DetalleAviso.module.css";

export default function DetalleAvisoPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [notice, setNotice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [sending, setSending] = useState(false);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/login?callbackUrl=/avisos/${params.id}`);
        }
    }, [status, params.id, router]);

    useEffect(() => {
        async function load() {
            if (params.id) {
                const data = await getNoticeById(params.id as string);
                setNotice(data);
            }
            setLoading(false);
        }
        if (status === "authenticated") {
            load();
        }
    }, [params.id, status]);

    const handleSendComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !session?.user || sending) return;

        setSending(true);
        try {
            const newComment = await addComment(
                notice.id,
                (session.user as any).id,
                comment.trim()
            );

            setNotice({
                ...notice,
                comments: [...notice.comments, newComment]
            });
            setComment("");
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            alert("No se pudo publicar el comentario. Intentá de nuevo.");
        } finally {
            setSending(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <main className="safe-bottom">
                <TopBar />
                <div className={styles.loading}>Cargando aviso...</div>
            </main>
        );
    }

    if (!notice) {
        return (
            <main className="safe-bottom">
                <TopBar />
                <div className={styles.error}>
                    <h2>Aviso no encontrado</h2>
                    <p>El aviso que buscás no existe o fue eliminado.</p>
                    <Link href="/avisos" className={styles.retryBtn}>Volver al tablón</Link>
                </div>
            </main>
        );
    }

    return (
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
                        <span className={styles.categoryTag}>{notice.category}</span>
                        <span className={styles.date}>
                            <Clock size={12} /> {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h2 className={styles.noticeTitle}>{notice.title}</h2>

                    <div className={styles.authorCard}>
                        <UserAvatar
                            seed={notice.author?.avatarSeed || notice.author?.email || "default"}
                            size={40}
                        />
                        <div className={styles.authorInfo}>
                            <h4>{notice.author?.name}</h4>
                            <p>@{notice.author?.username || "estudiante"}</p>
                        </div>
                    </div>

                    <div className={styles.noticeContent}>
                        {notice.description}
                    </div>
                </article>

                <section className={styles.commentsSection}>
                    <h3>
                        <MessageSquare size={20} />
                        Comentarios ({notice.comments.length})
                    </h3>

                    <div className={styles.commentList}>
                        {notice.comments.length === 0 ? (
                            <p className={styles.loading}>No hay comentarios todavía. ¡Sé el primero!</p>
                        ) : (
                            notice.comments.map((c: any) => (
                                <div key={c.id} className={styles.commentItem}>
                                    <UserAvatar
                                        seed={c.author?.avatarSeed || c.author?.email || "default"}
                                        size={32}
                                    />
                                    <div className={styles.commentBubble}>
                                        <div className={styles.commentHeader}>
                                            <span className={styles.commentAuthor}>
                                                {c.author?.name} (@{c.author?.username || "estudiante"})
                                            </span>
                                            <span className={styles.commentDate}>
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </span>
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
                    <textarea
                        className={styles.commentInput}
                        placeholder="Escribí un comentario..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendComment(e);
                            }
                        }}
                        rows={1}
                    />
                    <button
                        type="submit"
                        className={styles.sendBtn}
                        disabled={!comment.trim() || sending}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </main>
    );
}
