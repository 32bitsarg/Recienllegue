"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getNotices, deleteNotice } from "@/app/actions/data";
import {
    ChevronLeft, MessageSquare, Trash2, Search, Filter,
    Calendar, User, Tag, ExternalLink
} from "lucide-react";
import Link from "next/link";
import styles from "../AdminForm.module.css";

const CATEGORIES = ["TODOS", "VIVIENDA", "LIBROS", "EVENTOS", "OTROS"];

export default function AdminAvisosPage() {
    const { data: session } = useSession();
    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("TODOS");

    const loadNotices = async () => {
        setLoading(true);
        const data = await getNotices();
        setNotices(data);
        setLoading(false);
    };

    useEffect(() => { loadNotices(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este aviso de forma permanente?")) return;
        try {
            await deleteNotice(id);
            await loadNotices();
        } catch { alert("Error al eliminar aviso"); }
    };

    const filteredNotices = notices.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.description.toLowerCase().includes(search.toLowerCase()) ||
            n.author?.name?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "TODOS" || n.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const categoryLabel: Record<string, string> = {
        VIVIENDA: "🏠 Vivienda",
        LIBROS: "📚 Libros",
        EVENTOS: "🎉 Eventos",
        OTROS: "✨ Otros"
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/admin" className={styles.backBtn}><ChevronLeft size={24} /></Link>
                <h1>Gestión de Avisos</h1>
            </header>

            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className={styles.field} style={{ marginBottom: 0 }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            style={{ paddingLeft: '40px' }}
                            placeholder="Buscar en títulos, descripciones o autores..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700,
                                background: activeCategory === cat ? 'var(--primary)' : 'var(--surface)',
                                color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                                border: '1px solid var(--border)', transition: 'all 0.2s'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando avisos...</p>
            ) : filteredNotices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                    <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No se encontraron avisos.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredNotices.map(n => (
                        <div key={n.id} style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px',
                                            background: 'rgba(99,102,241,0.1)', color: '#6366f1'
                                        }}>
                                            {categoryLabel[n.category] || n.category}
                                        </span>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '2px' }}>
                                            Hace {Math.floor((Date.now() - new Date(n.createdAt).getTime()) / (1000 * 60 * 60 * 24))} días
                                        </span>
                                    </div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{n.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                        {n.description.length > 150 ? n.description.substring(0, 150) + '...' : n.description}
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                paddingTop: '0.75rem', borderTop: '1px solid var(--border)', marginTop: '0.25rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--border)', overflow: 'hidden' }}>
                                        {n.author?.image ? <img src={n.author.image} /> : <User size={14} style={{ padding: '5px' }} />}
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{n.author?.name || 'Usuario'}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>· {n._count.comments} comentarios</span>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link href={`/avisos/${n.id}`} target="_blank" style={{
                                        padding: '0.4rem', borderRadius: '6px', color: 'var(--primary)',
                                        background: 'var(--background)', border: '1px solid var(--border)'
                                    }}>
                                        <ExternalLink size={16} />
                                    </Link>
                                    <button onClick={() => handleDelete(n.id)} style={{
                                        padding: '0.4rem', borderRadius: '6px', color: '#f43f5e',
                                        background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.1)'
                                    }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
