"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    createCityEvent,
    getCityEvents,
    updateCityEvent,
    deleteCityEvent
} from "@/app/actions/data";
import {
    ChevronLeft, Calendar, CheckCircle, Save, Plus, X, Edit3, Trash2
} from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import styles from "../AdminForm.module.css";

export default function AdminEventosPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [events, setEvents] = useState<any[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const emptyForm = {
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        imageUrl: "",
        link: "",
        isFeatured: true
    };

    const [formData, setFormData] = useState(emptyForm);

    const loadEvents = async () => {
        setLoadingList(true);
        const data = await getCityEvents();
        setEvents(data);
        setLoadingList(false);
    };

    useEffect(() => { loadEvents(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await updateCityEvent(editingId, formData);
            } else {
                await createCityEvent(formData);
            }
            setSuccess(true);
            setFormData(emptyForm);
            setShowForm(false);
            setEditingId(null);
            await loadEvents();
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            alert("Error al guardar el evento");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (ev: any) => {
        setFormData({
            title: ev.title,
            description: ev.description,
            date: ev.date,
            time: ev.time || "",
            location: ev.location || "",
            imageUrl: ev.imageUrl || "",
            link: ev.link || "",
            isFeatured: ev.isFeatured
        });
        setEditingId(ev.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este evento?")) return;
        try {
            await deleteCityEvent(id);
            await loadEvents();
        } catch { alert("Error al eliminar"); }
    };

    const handleToggleFeatured = async (id: string, current: boolean) => {
        try {
            await updateCityEvent(id, { isFeatured: !current });
            await loadEvents();
        } catch { alert("Error"); }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/admin" className={styles.backBtn}><ChevronLeft size={24} /></Link>
                <h1>Gestión de Eventos</h1>
            </header>

            {success && (
                <div className={styles.successMsg}>
                    <CheckCircle size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    ¡Evento {editingId ? 'actualizado' : 'creado'} correctamente!
                </div>
            )}

            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Eventos ({events.length})</h3>
                <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(emptyForm); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                        background: showForm ? 'var(--border)' : 'var(--primary)', color: showForm ? 'var(--foreground)' : 'white',
                        fontWeight: 700, fontSize: '0.85rem'
                    }}>
                    {showForm ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> Nuevo Evento</>}
                </button>
            </div>

            {loadingList ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Cargando...</p>
            ) : events.length === 0 && !showForm ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    <Calendar size={40} strokeWidth={1.5} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                    <p>No hay eventos cargados aún.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    {events.map(ev => (
                        <div key={ev.id} style={{
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)', padding: '1rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
                                            borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: '#6366f1'
                                        }}>{ev.date} {ev.time && `- ${ev.time}`}</span>
                                        {ev.isFeatured && (
                                            <span style={{
                                                fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
                                                borderRadius: '4px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b'
                                            }}>⭐ Destacado en Inicio</span>
                                        )}
                                    </div>
                                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ev.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ev.location}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                <button onClick={() => handleToggleFeatured(ev.id, ev.isFeatured)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: ev.isFeatured ? 'rgba(245,158,11,0.15)' : 'var(--background)',
                                        color: ev.isFeatured ? '#f59e0b' : 'var(--text-muted)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}>
                                    <Calendar size={12} /> {ev.isFeatured ? 'Quitar Destacado' : 'Destacar'}
                                </button>
                                <button onClick={() => handleEdit(ev)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: 'var(--background)', color: 'var(--primary)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}>
                                    <Edit3 size={12} /> Editar
                                </button>
                                <button onClick={() => handleDelete(ev.id)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: 'rgba(244,63,94,0.05)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}>
                                    <Trash2 size={12} /> Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>
                        {editingId ? '✏️ Editar Evento' : '➕ Nuevo Evento'}
                    </h3>
                    <div className={styles.field}>
                        <label>Título del Evento</label>
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Recital en Plaza 25 de Mayo" required />
                    </div>
                    <div className={styles.field}>
                        <label>Descripción</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Detalles del evento..." required />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Fecha</label>
                            <input name="date" type="text" value={formData.date} onChange={handleChange} placeholder="Ej: 14 de Marzo, 2026" required />
                        </div>
                        <div className={styles.field}>
                            <label>Horario</label>
                            <input name="time" type="text" value={formData.time} onChange={handleChange} placeholder="Ej: 21:00 hs" />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Ubicación</label>
                        <input name="location" value={formData.location} onChange={handleChange} placeholder="Ej: Teatro Unión / Plaza Centro..." />
                    </div>
                    <div className={styles.field}>
                        <label>Link (Opcional para más info o entradas)</label>
                        <input name="link" value={formData.link} onChange={handleChange} placeholder="https://..." />
                    </div>
                    <div className={styles.field}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
                            Mostrar como destacado en el Home
                        </label>
                    </div>
                    <ImageUpload label="Imagen Promocional (Opcional)" previewUrl={formData.imageUrl}
                        onUpload={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))} />
                    <button className={styles.submitBtn} disabled={loading}>
                        {loading ? "Guardando..." : editingId ? "Actualizar Evento" : "Guardar Evento"}
                        <Save size={20} />
                    </button>
                </form>
            )}
        </div>
    );
}
