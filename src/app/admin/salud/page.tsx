"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    createHealthService,
    getHealthServices,
    updateHealthService,
    deleteHealthService
} from "@/app/actions/data";
import {
    ChevronLeft, Stethoscope, Save, CheckCircle, Plus, X, Edit3, Trash2
} from "lucide-react";
import Link from "next/link";
import styles from "../AdminForm.module.css";

const HEALTH_TYPES = [
    { value: "URGENCIA", label: "🚨 Urgencia" },
    { value: "HOSPITAL", label: "🏥 Hospital" },
    { value: "CAPS", label: "🏥 CAPS" }
];

export default function AdminSaludPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [services, setServices] = useState<any[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const emptyForm = {
        name: "",
        type: "CAPS",
        address: "",
        phone: "",
        hours: "",
        description: "",
        lat: "-33.89",
        lng: "-60.57"
    };

    const [formData, setFormData] = useState(emptyForm);

    const loadServices = async () => {
        setLoadingList(true);
        const data = await getHealthServices();
        setServices(data);
        setLoadingList(false);
    };

    useEffect(() => { loadServices(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                type: formData.type,
                address: formData.address,
                number: formData.phone,
                details: formData.description
                    ? `${formData.hours ? 'Horario: ' + formData.hours + '\n' : ''}${formData.description}`
                    : (formData.hours || ''),
                lat: formData.lat || undefined,
                lng: formData.lng || undefined
            };
            if (editingId) {
                await updateHealthService(editingId, payload);
            } else {
                await createHealthService(payload);
            }
            setSuccess(true);
            setFormData(emptyForm);
            setShowForm(false);
            setEditingId(null);
            await loadServices();
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            alert("Error al guardar el servicio de salud");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (s: any) => {
        setFormData({
            name: s.name,
            type: s.type,
            address: s.address || "",
            phone: s.number || "",
            hours: "",
            description: s.details || "",
            lat: s.lat || "-33.89",
            lng: s.lng || "-60.57"
        });
        setEditingId(s.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este servicio de salud?")) return;
        try {
            await deleteHealthService(id);
            await loadServices();
        } catch { alert("Error al eliminar"); }
    };

    const typeLabel: Record<string, string> = { URGENCIA: "🚨 Urgencia", HOSPITAL: "🏥 Hospital", CAPS: "🏥 CAPS" };
    const typeColor: Record<string, string> = { URGENCIA: "#f43f5e", HOSPITAL: "#6366f1", CAPS: "#10b981" };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/admin" className={styles.backBtn}><ChevronLeft size={24} /></Link>
                <h1>Gestión de Salud</h1>
            </header>

            {success && (
                <div className={styles.successMsg}>
                    <CheckCircle size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    ¡Servicio de salud {editingId ? 'actualizado' : 'cargado'} correctamente!
                </div>
            )}

            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Servicios de salud ({services.length})</h3>
                <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(emptyForm); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                        background: showForm ? 'var(--border)' : 'var(--primary)', color: showForm ? 'var(--foreground)' : 'white',
                        fontWeight: 700, fontSize: '0.85rem'
                    }}>
                    {showForm ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> Nuevo Servicio</>}
                </button>
            </div>

            {loadingList ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Cargando...</p>
            ) : services.length === 0 && !showForm ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    <Stethoscope size={40} strokeWidth={1.5} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                    <p>No hay servicios de salud cargados aún.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    {services.map(s => (
                        <div key={s.id} style={{
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)', padding: '1rem'
                        }}>
                            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem' }}>
                                <span style={{
                                    fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
                                    borderRadius: '4px', background: `${typeColor[s.type]}15`, color: typeColor[s.type]
                                }}>{typeLabel[s.type]}</span>
                                {s.lat && s.lng && (
                                    <span style={{
                                        fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
                                        borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#10b981'
                                    }}>📍 Con coordenadas</span>
                                )}
                            </div>
                            <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.name}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {s.address || 'Sin dirección'} {s.number ? `· Tel: ${s.number}` : ''}
                            </p>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                <button onClick={() => handleEdit(s)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: 'var(--background)', color: 'var(--primary)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}>
                                    <Edit3 size={12} /> Editar
                                </button>
                                <button onClick={() => handleDelete(s.id)}
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
                        {editingId ? '✏️ Editar Servicio' : '➕ Nuevo Servicio de Salud'}
                    </h3>
                    <div className={styles.field}>
                        <label>Nombre</label>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Hospital San José" required />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Tipo</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                {HEALTH_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Teléfono</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="2477-123456" required />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Dirección</label>
                        <input name="address" value={formData.address} onChange={handleChange} placeholder="Ej: Av. de Mayo 123" />
                    </div>
                    <div className={styles.field}>
                        <label>Horario</label>
                        <input name="hours" value={formData.hours} onChange={handleChange} placeholder="Ej: 24hs / Lun a Vie 8-20hs" />
                    </div>
                    <div className={styles.field}>
                        <label>Descripción / Detalles</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={2} />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Latitud</label>
                            <input name="lat" value={formData.lat} onChange={handleChange} />
                        </div>
                        <div className={styles.field}>
                            <label>Longitud</label>
                            <input name="lng" value={formData.lng} onChange={handleChange} />
                        </div>
                    </div>
                    <button className={styles.submitBtn} disabled={loading}>
                        {loading ? "Guardando..." : editingId ? "Actualizar Servicio" : "Guardar Servicio"}
                        <Stethoscope size={20} />
                    </button>
                </form>
            )}
        </div>
    );
}
