"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus, MessageSquare, Clock, Flag, ShieldAlert, Sparkles, Send, AlertCircle } from "lucide-react";
import { getNotices, createNotice, reportNotice, updateNotice, deleteNotice } from "@/app/actions/data";
import LoadingScreen from "@/components/common/LoadingScreen";
import styles from "./DesktopAvisos.module.css";
import EmptyState from "@/components/common/EmptyState";
import UserAvatar from "@/components/common/UserAvatar";

const categories = ["Todos", "Vivienda", "Libros", "Eventos", "Otros"];

export interface DesktopAvisosInitialData {
    notices: any[];
}

interface DesktopAvisosProps {
    initialData?: DesktopAvisosInitialData;
}

export default function DesktopAvisos({ initialData }: DesktopAvisosProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [reportedIds, setReportedIds] = useState<string[]>([]);
    const [notices, setNotices] = useState<any[]>(initialData?.notices ?? []);
    const [loading, setLoading] = useState(!initialData);

    // Compose State
    const [isComposing, setIsComposing] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newCategory, setNewCategory] = useState("OTROS");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [composeError, setComposeError] = useState("");

    // Edit State
    const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editCategory, setEditCategory] = useState("OTROS");

    useEffect(() => {
        if (initialData) return;
        const fetchNotices = async () => {
            const data = await getNotices();
            setNotices(data);
            setLoading(false);
        };
        fetchNotices();
    }, [initialData]);

    const filteredAvisos = (activeCategory === "Todos"
        ? notices
        : notices.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase()))
        .filter(a => !reportedIds.includes(a.id));

    const handleComposeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user) return;
        setIsSubmitting(true);
        setComposeError("");
        try {
            const newNotice = await createNotice({
                title: newTitle,
                description: newDescription,
                category: newCategory,
                authorId: (session.user as any).id
            });
            // Update local state without refreshing page, mocking the relations returned by getNotices
            const noticeWithAuthor = {
                ...newNotice,
                author: {
                    name: session.user?.name || "Usuario",
                    image: session.user?.image || null,
                    avatarSeed: (session.user as any).avatarSeed || session.user?.email || "default",
                    username: (session.user as any).username || null
                },
                _count: { comments: 0 }
            };
            setNotices([noticeWithAuthor, ...notices]);
            setIsComposing(false);
            setNewTitle("");
            setNewDescription("");
            setNewCategory("OTROS");
        } catch {
            setComposeError("Hubo un error al publicar tu aviso. Intentá de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReportNotice = async (e: React.MouseEvent, noticeId: string) => {
        e.stopPropagation();
        if (!session?.user) return;

        if (confirm("¿Estás seguro de que querés reportar este aviso? Será revisado por un administrador.")) {
            try {
                const res = await reportNotice(noticeId, (session.user as any).id);
                if (res.success) {
                    setReportedIds(prev => [...prev, noticeId]);
                    alert("Aviso reportado. Gracias por ayudarnos a mantener la comunidad segura.");
                }
            } catch (error) {
                alert("No se pudo procesar el reporte. Intentá de nuevo.");
            }
        }
    };

    const handleDeleteNotice = async (e: React.MouseEvent, noticeId: string) => {
        e.stopPropagation();
        if (!confirm("¿Estás seguro de que querés eliminar este aviso? Esta acción no se puede deshacer.")) return;

        try {
            const res = await deleteNotice(noticeId);
            if (res.success) {
                setNotices(prev => prev.filter(n => n.id !== noticeId));
            }
        } catch (error) {
            alert("No se pudo eliminar el aviso. Intentá de nuevo.");
        }
    };

    const startEditing = (e: React.MouseEvent, aviso: any) => {
        e.stopPropagation();
        setEditingNoticeId(aviso.id);
        setEditTitle(aviso.title);
        setEditDescription(aviso.description);
        setEditCategory(aviso.category);
    };

    const handleUpdateNotice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNoticeId) return;
        setIsSubmitting(true);
        try {
            await updateNotice(editingNoticeId, {
                title: editTitle,
                description: editDescription,
                category: editCategory
            });

            setNotices(prev => prev.map(n =>
                n.id === editingNoticeId
                    ? { ...n, title: editTitle, description: editDescription, category: editCategory }
                    : n
            ));
            setEditingNoticeId(null);
        } catch (error) {
            alert("No se pudo actualizar el aviso.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className={styles.loading}><LoadingScreen /></div>;

    if (!session && status !== "loading") {
        return (
            <div className={styles.guestContainer}>
                <ShieldAlert size={64} color="var(--primary)" />
                <h2>Comunidad Privada</h2>
                <p>Para ver y publicar avisos, necesitás iniciar sesión. Queremos mantener este espacio seguro para todos.</p>
                <button className={styles.primaryBtn} onClick={() => window.location.href = '/login'}>Iniciar Sesión</button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.layout}>

                {/* 1. SIDEBAR IZQUIERDO (Navegación y Filtros) */}
                <aside className={styles.leftSidebar}>
                    <div className={styles.navMenu}>
                        <div className={styles.filterGroup}>
                            <h3 className={styles.sidebarTitle}>Explorar</h3>
                            <div className={styles.filterList}>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`${styles.filterItem} ${activeCategory === cat ? styles.activeFilter : ""}`}
                                        onClick={() => setActiveCategory(cat)}
                                    >
                                        <Sparkles size={20} className={activeCategory === cat ? styles.iconActive : styles.iconMuted} />
                                        <span>{cat}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* 2. MAIN FEED (Muro central) */}
                <main className={styles.feed}>
                    <div className={styles.feedHeader}>
                        <h2>Para ti</h2>
                    </div>

                    {/* Compose Box / Crear Aviso Rápido */}
                    <div className={`${styles.composeBox} ${isComposing ? styles.composeExpanded : ''}`}>
                        <div className={styles.composeAvatar}>
                            <UserAvatar
                                seed={(session?.user as any)?.avatarSeed || session?.user?.email || "default"}
                                size={44}
                                role={(session?.user as any)?.role}
                            />
                        </div>
                        <div className={styles.composeContent}>
                            {composeError && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--foreground)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                                    <AlertCircle size={16} />
                                    <span>{composeError}</span>
                                </div>
                            )}

                            {!isComposing ? (
                                <input
                                    type="text"
                                    className={styles.composeInput}
                                    placeholder="¿Buscás roommate, vendés algo o tenés una duda?"
                                    onClick={() => setIsComposing(true)}
                                    readOnly
                                />
                            ) : (
                                <form onSubmit={handleComposeSubmit} className={styles.composeForm}>
                                    <input
                                        type="text"
                                        className={styles.composeInput}
                                        placeholder="Título (Ej: Busco compañero de depto)"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        required
                                        maxLength={100}
                                        autoFocus
                                    />
                                    <textarea
                                        className={styles.composeTextarea}
                                        placeholder="Contanos más detalles..."
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        required
                                        rows={3}
                                    />

                                    <div className={styles.composeActions}>
                                        <select
                                            className={styles.composeSelect}
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                        >
                                            <option value="VIVIENDA">Vivienda</option>
                                            <option value="LIBROS">Libros y Apuntes</option>
                                            <option value="EVENTOS">Eventos</option>
                                            <option value="OTROS">Otros</option>
                                        </select>

                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                type="button"
                                                className={styles.composeCancelBtn}
                                                onClick={() => setIsComposing(false)}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className={styles.composeBtn}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? "Publicando..." : "Publicar"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className={styles.postList}>
                        {filteredAvisos.length > 0 ? (
                            filteredAvisos.map((aviso, i) => (
                                <motion.div
                                    key={aviso.id}
                                    className={styles.tweet}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    onClick={() => router.push(`/avisos/${aviso.slug || aviso.id}`)}
                                >
                                    <div className={styles.tweetAvatar}>
                                        <UserAvatar
                                            seed={aviso.author?.avatarSeed || aviso.author?.email || "default"}
                                            size={44}
                                            role={aviso.author?.role}
                                        />
                                    </div>

                                    <div className={styles.tweetContent}>
                                        {editingNoticeId === aviso.id ? (
                                            <form onSubmit={handleUpdateNotice} onClick={(e) => e.stopPropagation()} className={styles.editForm}>
                                                <input
                                                    type="text"
                                                    className={styles.composeInput}
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    required
                                                />
                                                <textarea
                                                    className={styles.composeTextarea}
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    required
                                                    rows={3}
                                                />
                                                <div className={styles.composeActions}>
                                                    <select
                                                        className={styles.composeSelect}
                                                        value={editCategory}
                                                        onChange={(e) => setEditCategory(e.target.value)}
                                                    >
                                                        <option value="VIVIENDA">Vivienda</option>
                                                        <option value="LIBROS">Libros y Apuntes</option>
                                                        <option value="EVENTOS">Eventos</option>
                                                        <option value="OTROS">Otros</option>
                                                    </select>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button type="button" className={styles.composeCancelBtn} onClick={() => setEditingNoticeId(null)}>Cancelar</button>
                                                        <button type="submit" className={styles.composeBtn} disabled={isSubmitting}>Guardar</button>
                                                    </div>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div className={styles.tweetHeader}>
                                                    <span className={styles.authorName}>{aviso.author?.name || "Usuario Local"}</span>
                                                    <span className={styles.authorHandle}>
                                                        @{(aviso.author?.username || aviso.author?.name || "usuario").toLowerCase().replace(/\s/g, '')}
                                                    </span>
                                                    <span className={styles.dot}>·</span>
                                                    <span className={styles.time}>{new Date(aviso.createdAt).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })}</span>
                                                    <span className={styles.dot}>·</span>
                                                    <span className={styles.postCategory}>
                                                        <Sparkles size={12} style={{ marginRight: '4px' }} />
                                                        {aviso.category}
                                                    </span>
                                                </div>

                                                <h3 className={styles.postTitle}>{aviso.title}</h3>
                                                <p className={styles.postDesc}>{aviso.description}</p>

                                                <div className={styles.tweetActions}>
                                                    <button
                                                        className={styles.actionBtn}
                                                        title="Comentar"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/avisos/${aviso.slug || aviso.id}`);
                                                        }}
                                                    >
                                                        <div className={styles.iconCircle}><MessageSquare size={18} /></div>
                                                        <span>Comentar</span>
                                                    </button>

                                                    {session?.user && (session.user as any).id === aviso.authorId ? (
                                                        <>
                                                            <button className={styles.actionBtn} title="Editar" onClick={(e) => startEditing(e, aviso)}>
                                                                <div className={styles.iconCircle}><Pencil size={18} /></div>
                                                                <span>Editar</span>
                                                            </button>
                                                            <button className={styles.actionBtn} title="Eliminar" onClick={(e) => handleDeleteNotice(e, aviso.id)}>
                                                                <div className={styles.iconCircle}><Trash2 size={18} /></div>
                                                                <span>Eliminar</span>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            className={styles.actionBtn}
                                                            title="Reportar"
                                                            onClick={(e) => handleReportNotice(e, aviso.id)}
                                                        >
                                                            <div className={styles.iconCircle}><Flag size={18} /></div>
                                                            <span>Reportar</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className={styles.emptyContainer}>
                                <EmptyState title="Tablón vacío" message="Aún no hay avisos en esta categoría. Sé el primero." />
                            </div>
                        )}
                    </div>
                </main>

                {/* 3. SIDEBAR DERECHO (Tendencias / Widgets) */}
                <aside className={styles.rightSidebar}>
                    <div className={styles.widgetCard}>
                        <h3>¿Qué está pasando?</h3>
                        <div className={styles.trendList}>
                            <div className={styles.trendItem}>
                                <span className={styles.trendCategory}>Noticias de la App</span>
                                <h4 className={styles.trendTitle}>¡Nuevo tablón de anuncios!</h4>
                                <span className={styles.trendStats}>Actualización del sistema</span>
                            </div>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}
