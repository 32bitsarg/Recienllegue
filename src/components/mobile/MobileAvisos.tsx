"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TopBar from "@/components/layout/TopBar";
import EmptyState from "@/components/common/EmptyState";
import { Plus, MessageSquare, Clock, Filter, Flag, ShieldAlert, Pencil, Trash2, Send, X } from "lucide-react";
import styles from "@/app/avisos/Avisos.module.css";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useDragScroll } from "@/hooks/useDragScroll";
import { updateNotice, deleteNotice, reportNotice } from "@/app/actions/data";

const categories = ["Todos", "Vivienda", "Libros", "Eventos", "Otros"];

export interface AvisosInitialData {
    notices: any[];
}

interface MobileAvisosProps {
    initialData?: AvisosInitialData;
}

export default function MobileAvisos({ initialData }: MobileAvisosProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const categoriesScroll = useDragScroll<HTMLDivElement>();
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [reportedIds, setReportedIds] = useState<string[]>([]);
    const [notices, setNotices] = useState<any[]>(initialData?.notices ?? []);
    const [loading, setLoading] = useState(!initialData);

    // Edit State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [editCat, setEditCat] = useState("OTROS");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReport = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!session?.user) return;
        if (confirm("¿Querés reportar este aviso por contenido inapropiado?")) {
            try {
                await reportNotice(id, (session.user as any).id);
                setReportedIds([...reportedIds, id]);
                alert("Gracias por tu reporte. Nuestro equipo lo revisará a la brevedad.");
            } catch (error) {
                alert("No se pudo enviar el reporte.");
            }
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("¿Estás seguro de que querés eliminar este aviso?")) {
            try {
                await deleteNotice(id);
                setNotices(notices.filter(n => n.id !== id));
            } catch (error) {
                alert("No se pudo eliminar el aviso.");
            }
        }
    };

    const startEditing = (e: React.MouseEvent, aviso: any) => {
        e.stopPropagation();
        setEditingId(aviso.id);
        setEditTitle(aviso.title);
        setEditDesc(aviso.description);
        setEditCat(aviso.category);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) return;
        setIsSubmitting(true);
        try {
            await updateNotice(editingId, {
                title: editTitle,
                description: editDesc,
                category: editCat
            });
            setNotices(notices.map(n => n.id === editingId ? { ...n, title: editTitle, description: editDesc, category: editCat } : n));
            setEditingId(null);
        } catch (error) {
            alert("Error al actualizar el aviso.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredAvisos = (activeCategory === "Todos"
        ? notices
        : notices.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase()))
        .filter(a => !reportedIds.includes(a.id));

    if (status !== "loading" && !session) {
        return (
            <div className="">
                <TopBar />
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <h2>Comunidad</h2>
                        <p>Explorá los avisos de la comunidad.</p>
                    </div>
                </div>
                <div className={styles.avisosList}>
                    <motion.div
                        className={styles.guestAvisos}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ShieldAlert size={60} className={styles.guestIcon} />
                        <h3>Contenido Protegido</h3>
                        <p>Solo los miembros verificados pueden interactuar en el tablón de la comunidad.</p>
                        <div className={styles.authButtons}>
                            <button onClick={() => signIn()} className={styles.loginBtn}>Iniciar Sesión</button>
                            <button onClick={() => router.push("/registro")} className={styles.registerBtn}>Crear Cuenta</button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <TopBar />

            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h2>Tablón de Avisos</h2>
                    <p>Conectá con otros estudiantes en Pergamino.</p>
                </div>
                <button className={styles.filterBtn}>
                    <Filter size={18} />
                </button>
            </div>

            <div
                className={styles.categories}
                ref={categoriesScroll.ref}
                onMouseDown={categoriesScroll.onMouseDown}
                onMouseLeave={categoriesScroll.onMouseLeave}
                onMouseUp={categoriesScroll.onMouseUp}
                onMouseMove={categoriesScroll.onMouseMove}
                style={categoriesScroll.style}
            >
                {categories.map((cat, i) => (
                    <motion.button
                        key={cat}
                        className={`${styles.catChip} ${activeCategory === cat ? styles.active : ""}`}
                        onClick={() => setActiveCategory(cat)}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        {cat}
                    </motion.button>
                ))}
            </div>

            <div className={styles.avisosList}>
                {loading ? (
                    <LoadingScreen />
                ) : filteredAvisos.length > 0 ? (
                    filteredAvisos.map((aviso, i) => (
                        <motion.div
                            key={aviso.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07, duration: 0.3 }}
                            className={styles.avisoCard}
                            onClick={() => !editingId && router.push(`/avisos/${aviso.slug || aviso.id}`)}
                        >
                            {editingId === aviso.id ? (
                                <form onSubmit={handleUpdate} onClick={(e) => e.stopPropagation()} className={styles.editForm}>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className={styles.editInput}
                                        required
                                    />
                                    <textarea
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        className={styles.editTextarea}
                                        rows={4}
                                        required
                                    />
                                    <div className={styles.editActions}>
                                        <select value={editCat} onChange={(e) => setEditCat(e.target.value)} className={styles.editSelect}>
                                            <option value="VIVIENDA">Vivienda</option>
                                            <option value="LIBROS">Libros</option>
                                            <option value="EVENTOS">Eventos</option>
                                            <option value="OTROS">Otros</option>
                                        </select>
                                        <div className={styles.btnGroup}>
                                            <button type="button" onClick={() => setEditingId(null)} className={styles.cancelBtn}><X size={18} /></button>
                                            <button type="submit" disabled={isSubmitting} className={styles.saveBtn}>
                                                {isSubmitting ? "..." : <Send size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className={styles.avisoHeader}>
                                        <div className={styles.headerLeft}>
                                            <span className={styles.categoryBadge}>{aviso.category}</span>
                                            <span className={styles.time}><Clock size={12} /> {new Date(aviso.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className={styles.headerActions}>
                                            {session?.user && (session.user as any).id === aviso.authorId ? (
                                                <div className={styles.ownerActions}>
                                                    <button className={styles.editBtn} onClick={(e) => startEditing(e, aviso)}>
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button className={styles.deleteBtn} onClick={(e) => handleDelete(e, aviso.id)}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className={styles.reportBtn}
                                                    onClick={(e) => handleReport(e, aviso.id)}
                                                    title="Reportar aviso"
                                                >
                                                    <Flag size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <h3 className={styles.avisoTitle}>{aviso.title}</h3>
                                    <p className={styles.avisoDesc}>{aviso.description}</p>
                                    <div className={styles.avisoFooter}>
                                        <div className={styles.authorInfo}>
                                            <span className={styles.userName}><span>@</span>{aviso.author?.username || aviso.author?.name || "Estudiante"}</span>
                                        </div>
                                        <div className={styles.avisoStats}>
                                            <MessageSquare size={16} />
                                            <span>{aviso._count?.comments || 0}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <EmptyState
                        title="No hay avisos todavía"
                        message="¡Sé el primero en publicar un aviso para la comunidad!"
                    />
                )}
            </div>

            <button onClick={() => router.push("/avisos/nuevo")} className={styles.fab} title="Publicar aviso">
                <Plus size={24} color="white" />
            </button>
        </div>
    );
}
