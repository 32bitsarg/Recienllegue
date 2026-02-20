"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    createUniversitySede, createUniversityService,
    getUniversitySedes, getUniversityServices,
    updateUniversitySede, updateUniversityService,
    deleteUniversitySede, deleteUniversityService
} from "@/app/actions/data";
import {
    ChevronLeft, GraduationCap, Building, BookOpen, Save, CheckCircle, Plus, X, Edit3, Trash2
} from "lucide-react";
import Link from "next/link";
import styles from "../AdminForm.module.css";

export default function AdminUnnobaPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<'SEDE' | 'SERVICE'>('SEDE');
    const [sedes, setSedes] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const emptySedeForm = { name: "", address: "", phone: "", details: "" };
    const emptyServiceForm = { title: "", desc: "", contact: "", link: "", iconName: "GraduationCap" };

    const [sedeForm, setSedeForm] = useState(emptySedeForm);
    const [serviceForm, setServiceForm] = useState(emptyServiceForm);

    const loadData = async () => {
        setLoadingList(true);
        const [sedesData, servicesData] = await Promise.all([
            getUniversitySedes(),
            getUniversityServices()
        ]);
        setSedes(sedesData);
        setServices(servicesData);
        setLoadingList(false);
    };

    useEffect(() => { loadData(); }, []);

    const handleSedeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await updateUniversitySede(editingId, sedeForm);
            } else {
                await createUniversitySede(sedeForm);
            }
            setSuccess("Sede");
            setSedeForm(emptySedeForm);
            setShowForm(false);
            setEditingId(null);
            await loadData();
            setTimeout(() => setSuccess(null), 3000);
        } catch { alert("Error al guardar la sede"); }
        finally { setLoading(false); }
    };

    const handleServiceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await updateUniversityService(editingId, serviceForm);
            } else {
                await createUniversityService(serviceForm);
            }
            setSuccess("Servicio");
            setServiceForm(emptyServiceForm);
            setShowForm(false);
            setEditingId(null);
            await loadData();
            setTimeout(() => setSuccess(null), 3000);
        } catch { alert("Error al guardar el servicio"); }
        finally { setLoading(false); }
    };

    const handleEditSede = (s: any) => {
        setSedeForm({ name: s.name, address: s.address, phone: s.phone || "", details: s.details || "" });
        setEditingId(s.id);
        setShowForm(true);
        setActiveSection('SEDE');
    };

    const handleEditService = (s: any) => {
        setServiceForm({ title: s.title, desc: s.desc, contact: s.contact || "", link: s.link || "", iconName: s.iconName || "GraduationCap" });
        setEditingId(s.id);
        setShowForm(true);
        setActiveSection('SERVICE');
    };

    const handleDeleteSede = async (id: string) => {
        if (!confirm("¿Eliminar esta sede?")) return;
        try { await deleteUniversitySede(id); await loadData(); }
        catch { alert("Error al eliminar"); }
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm("¿Eliminar este servicio?")) return;
        try { await deleteUniversityService(id); await loadData(); }
        catch { alert("Error al eliminar"); }
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingId(null);
        setSedeForm(emptySedeForm);
        setServiceForm(emptyServiceForm);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/admin" className={styles.backBtn}><ChevronLeft size={24} /></Link>
                <h1>Gestión UNNOBA</h1>
            </header>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button onClick={() => { setActiveSection('SEDE'); cancelForm(); }}
                    style={{
                        flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)',
                        background: activeSection === 'SEDE' ? 'var(--primary)' : 'var(--surface)',
                        color: activeSection === 'SEDE' ? 'white' : 'inherit', fontWeight: 700, border: '1px solid var(--border)'
                    }}>Sedes ({sedes.length})</button>
                <button onClick={() => { setActiveSection('SERVICE'); cancelForm(); }}
                    style={{
                        flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)',
                        background: activeSection === 'SERVICE' ? 'var(--primary)' : 'var(--surface)',
                        color: activeSection === 'SERVICE' ? 'white' : 'inherit', fontWeight: 700, border: '1px solid var(--border)'
                    }}>Servicios ({services.length})</button>
            </div>

            {success && (
                <div className={styles.successMsg}>
                    <CheckCircle size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    ¡{success} {editingId ? 'actualizado' : 'cargado'} correctamente!
                </div>
            )}

            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => { showForm ? cancelForm() : setShowForm(true); setEditingId(null); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                        background: showForm ? 'var(--border)' : 'var(--primary)', color: showForm ? 'var(--foreground)' : 'white',
                        fontWeight: 700, fontSize: '0.85rem'
                    }}>
                    {showForm ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> {activeSection === 'SEDE' ? 'Nueva Sede' : 'Nuevo Servicio'}</>}
                </button>
            </div>

            {/* LISTA */}
            {loadingList ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Cargando...</p>
            ) : activeSection === 'SEDE' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    {sedes.length === 0 && !showForm ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                            <Building size={40} strokeWidth={1.5} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                            <p>No hay sedes cargadas aún.</p>
                        </div>
                    ) : sedes.map(s => (
                        <div key={s.id} style={{
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)', padding: '1rem'
                        }}>
                            <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.name}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {s.address}{s.phone ? ` · ${s.phone}` : ''}
                            </p>
                            {s.lat && s.lng && (
                                <span style={{
                                    fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', marginTop: '0.3rem', display: 'inline-block',
                                    borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#10b981'
                                }}>📍 {s.lat}, {s.lng}</span>
                            )}
                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                                <button onClick={() => handleEditSede(s)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: 'var(--background)', color: 'var(--primary)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}>
                                    <Edit3 size={12} /> Editar
                                </button>
                                <button onClick={() => handleDeleteSede(s.id)}
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
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    {services.length === 0 && !showForm ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                            <BookOpen size={40} strokeWidth={1.5} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                            <p>No hay servicios cargados aún.</p>
                        </div>
                    ) : services.map(s => (
                        <div key={s.id} style={{
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)', padding: '1rem'
                        }}>
                            <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.title}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.desc}</p>
                            {s.contact && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {s.contact}</p>}
                            {s.link && <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>🔗 {s.link}</p>}
                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                                <button onClick={() => handleEditService(s)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: 'var(--background)', color: 'var(--primary)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}>
                                    <Edit3 size={12} /> Editar
                                </button>
                                <button onClick={() => handleDeleteService(s.id)}
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

            {/* FORMULARIOS */}
            {showForm && activeSection === 'SEDE' && (
                <form className={styles.form} onSubmit={handleSedeSubmit}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>
                        {editingId ? '✏️ Editar Sede' : '➕ Nueva Sede'}
                    </h3>
                    <div className={styles.field}>
                        <label>Nombre de la Sede</label>
                        <input value={sedeForm.name} onChange={e => setSedeForm({ ...sedeForm, name: e.target.value })} placeholder="Ej: Edificio Reforma" required />
                    </div>
                    <div className={styles.field}>
                        <label>Dirección</label>
                        <input value={sedeForm.address} onChange={e => setSedeForm({ ...sedeForm, address: e.target.value })} placeholder="Ej: Monteagudo 2772" required />
                    </div>
                    <div className={styles.field}>
                        <label>Teléfono</label>
                        <input value={sedeForm.phone} onChange={e => setSedeForm({ ...sedeForm, phone: e.target.value })} placeholder="+54 2477 ..." />
                    </div>
                    <div className={styles.field}>
                        <label>Detalles / Oficinas</label>
                        <textarea value={sedeForm.details} onChange={e => setSedeForm({ ...sedeForm, details: e.target.value })} rows={3} />
                    </div>
                    <button className={styles.submitBtn} disabled={loading}>
                        {loading ? "Guardando..." : editingId ? "Actualizar Sede" : "Guardar Sede"}
                        <Building size={20} />
                    </button>
                </form>
            )}

            {showForm && activeSection === 'SERVICE' && (
                <form className={styles.form} onSubmit={handleServiceSubmit}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>
                        {editingId ? '✏️ Editar Servicio' : '➕ Nuevo Servicio'}
                    </h3>
                    <div className={styles.field}>
                        <label>Título del Servicio</label>
                        <input value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} placeholder="Ej: Comedor Universitario" required />
                    </div>
                    <div className={styles.field}>
                        <label>Descripción</label>
                        <textarea value={serviceForm.desc} onChange={e => setServiceForm({ ...serviceForm, desc: e.target.value })} rows={3} required />
                    </div>
                    <div className={styles.field}>
                        <label>Contacto / Ubicación</label>
                        <input value={serviceForm.contact} onChange={e => setServiceForm({ ...serviceForm, contact: e.target.value })} placeholder="Edificio Monteagudo - Int. 21120" />
                    </div>
                    <div className={styles.field}>
                        <label>Link Externo (Opcional)</label>
                        <input value={serviceForm.link} onChange={e => setServiceForm({ ...serviceForm, link: e.target.value })} placeholder="https://..." />
                    </div>
                    <button className={styles.submitBtn} disabled={loading}>
                        {loading ? "Guardando..." : editingId ? "Actualizar Servicio" : "Guardar Servicio"}
                        <BookOpen size={20} />
                    </button>
                </form>
            )}
        </div>
    );
}
