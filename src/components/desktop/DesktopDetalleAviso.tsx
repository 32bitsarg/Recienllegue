"use client";

import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MessageSquare, Send, Clock, AlertCircle, Pencil, Trash2, Flag, Sparkles } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import { addComment, deleteNotice, updateNotice, reportNotice } from "@/app/actions/data";
import styles from "./DesktopDetalleAviso.module.css";

export interface DetalleAvisoInitialData {
    notice: any;
}

interface DesktopDetalleAvisoProps {
    initialData: DetalleAvisoInitialData | null;
}

export default function DesktopDetalleAviso({ initialData }: DesktopDetalleAvisoProps) {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [notice, setNotice] = useState<any>(initialData?.notice ?? null);
    const [comment, setComment] = useState("");
    const [sending, setSending] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/login?callbackUrl=/avisos/${params.slug || params.id}`);
        }
    }, [status, params.id, params.slug, router]);

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
            setNotice({ ...notice, comments: [...(notice.comments || []), newComment] });
            setComment("");
            setTimeout(scrollToBottom, 100);
        } catch {
            alert("No se pudo publicar el comentario. Intentá de nuevo.");
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async () => {
        if (!notice || !confirm("¿Estás seguro de que querés eliminar este aviso? Esta acción no se puede deshacer.")) return;
        try {
            await deleteNotice(notice.id);
            router.push("/avisos");
        } catch (error) {
            alert("Error al eliminar el aviso");
        }
    };

    const handleReport = async () => {
        if (!notice || !confirm("¿Querés reportar este aviso por contenido inapropiado?")) return;
        try {
            await reportNotice(notice.id, (session?.user as any).id);
            alert("Gracias por tu reporte. Lo revisaremos a la brevedad.");
            router.push("/avisos");
        } catch (error) {
            alert("Error al enviar el reporte");
        }
    };

    const startEditing = () => {
        setEditTitle(notice.title);
        setEditDescription(notice.description);
        setEditCategory(notice.category);
        setIsEditing(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!notice || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const updated = await updateNotice(notice.id, {
                title: editTitle,
                description: editDescription,
                category: editCategory
            });
            setNotice({ ...notice, ...updated });
            setIsEditing(false);
        } catch (error) {
            alert("No se pudo actualizar el aviso");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading") return <div style={{ padding: '10rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}>Cargando aviso premium...</div>;
    if (status === "unauthenticated") return null;

    if (!notice) {
        return (
            <div className={styles.notFound}>
                <AlertCircle size={64} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                <h2>Aviso no encontrado</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    El aviso que buscás no existe o fue eliminado de la comunidad.
                </p>
                <Link href="/avisos" className={styles.backLink}>
                    <ChevronLeft size={20} /> Volver al tablón
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Link href="/avisos" className={styles.backLink}>
                <ChevronLeft size={20} /> Volver al tablón
            </Link>

            <article className={styles.noticeCard}>
                <header className={styles.noticeHeader}>
                    <div className={styles.authorWrapper}>
                        <UserAvatar seed={notice.author?.avatarSeed || notice.author?.email || "default"} size={52} />
                        <div className={styles.authorMeta}>
                            <h4>{notice.author?.name}</h4>
                            <p>@{notice.author?.username || "estudiante"}</p>
                        </div>
                    </div>
                    <div className={styles.headerRight}>
                        <span className={styles.categoryBadge}>{notice.category}</span>
                        <span className={styles.dateInfo}>
                            <Clock size={16} />
                            {new Date(notice.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                </header>

                <main className={styles.noticeBody}>
                    {isEditing ? (
                        <form onSubmit={handleUpdate} className={styles.editForm}>
                            <input
                                type="text"
                                className={styles.composeInput}
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                required
                                style={{ width: '100%', marginBottom: '1rem', borderBottom: '1.5px solid var(--border)' }}
                            />
                            <textarea
                                className={styles.composeTextarea}
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                required
                                rows={5}
                                style={{ width: '100%', marginBottom: '1rem', border: '1.5px solid var(--border)', padding: '1rem', borderRadius: '1rem' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <select
                                    className={styles.composeSelect}
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value)}
                                    style={{ border: '1.5px solid var(--border)' }}
                                >
                                    <option value="VIVIENDA">Vivienda</option>
                                    <option value="LIBROS">Libros y Apuntes</option>
                                    <option value="EVENTOS">Eventos</option>
                                    <option value="OTROS">Otros</option>
                                </select>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="button" className={styles.composeCancelBtn} onClick={() => setIsEditing(false)}>Cancelar</button>
                                    <button type="submit" className={styles.composeBtn} disabled={isSubmitting}>
                                        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h1 className={styles.title}>{notice.title}</h1>
                            <div className={styles.description}>
                                {notice.description}
                            </div>
                        </>
                    )}

                    <div className={styles.detailActions}>
                        {session?.user && (session.user as any).id === notice.authorId ? (
                            <>
                                <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={startEditing}>
                                    <div className={styles.iconCircle}><Pencil size={20} /></div>
                                    <span>Editar mi aviso</span>
                                </button>
                                <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={handleDelete}>
                                    <div className={styles.iconCircle}><Trash2 size={20} /></div>
                                    <span>Eliminar aviso</span>
                                </button>
                            </>
                        ) : (
                            <button className={`${styles.actionBtn} ${styles.reportBtn}`} onClick={handleReport}>
                                <div className={styles.iconCircle}><Flag size={20} /></div>
                                <span>Reportar contenido</span>
                            </button>
                        )}
                    </div>
                </main>
            </article>

            <section className={styles.commentsSection}>
                <h3 className={styles.commentsHeader}>
                    <MessageSquare size={24} />
                    Comentarios ({(notice.comments?.length ?? 0)})
                </h3>

                <div className={styles.commentList}>
                    {(!notice.comments || notice.comments.length === 0) ? (
                        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: '1.5rem', color: 'var(--text-muted)' }}>
                            <p>No hay comentarios todavía. ¡Sé el primero en participar!</p>
                        </div>
                    ) : (
                        notice.comments.map((c: any) => (
                            <div key={c.id} className={styles.commentItem}>
                                <UserAvatar seed={c.author?.avatarSeed || c.author?.email || "default"} size={40} />
                                <div className={styles.commentBubble}>
                                    <div className={styles.commentMeta}>
                                        <span className={styles.commentAuthor}>
                                            {c.author?.name} <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.4rem' }}>@{c.author?.username || "usuario"}</span>
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

                <form onSubmit={handleSendComment} className={styles.commentForm}>
                    <textarea
                        placeholder="Escribí un comentario constructivo..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className={styles.textarea}
                        rows={1}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!comment.trim() || sending}
                        className={styles.sendBtn}
                    >
                        {sending ? "Enviando..." : "Comentar"}
                        <Send size={20} />
                    </button>
                </form>
            </section>
        </div>
    );
}
