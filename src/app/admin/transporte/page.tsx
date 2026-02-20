"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    createTransportLine, getTransportLines, updateTransportLine, deleteTransportLine,
    createTerminalRoute, getTerminalRoutes, updateTerminalRoute, deleteTerminalRoute
} from "@/app/actions/data";
import {
    ChevronLeft, Bus, Train, Save, CheckCircle, Plus, X, Edit3, Trash2
} from "lucide-react";
import Link from "next/link";
import styles from "../AdminForm.module.css";

export default function AdminTransportePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<'LINES' | 'ROUTES'>('LINES');
    const [lines, setLines] = useState<any[]>([]);
    const [routes, setRoutes] = useState<any[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const emptyLineForm = { name: "", color: "#10b981", schedule: "", route: "", frequency: "" };
    const emptyRouteForm = { destination: "", company: "", schedule: "", estimatedTime: "", price: "" };

    const [lineForm, setLineForm] = useState(emptyLineForm);
    const [routeForm, setRouteForm] = useState(emptyRouteForm);

    const loadData = async () => {
        setLoadingList(true);
        const [linesData, routesData] = await Promise.all([
            getTransportLines(),
            getTerminalRoutes()
        ]);
        setLines(linesData);
        setRoutes(routesData);
        setLoadingList(false);
    };

    useEffect(() => { loadData(); }, []);

    const handleLineSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await updateTransportLine(editingId, lineForm);
            } else {
                await createTransportLine(lineForm);
            }
            setSuccess("Línea");
            setLineForm(emptyLineForm);
            setShowForm(false);
            setEditingId(null);
            await loadData();
            setTimeout(() => setSuccess(null), 3000);
        } catch { alert("Error al guardar la línea"); }
        finally { setLoading(false); }
    };

    const handleRouteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await updateTerminalRoute(editingId, routeForm);
            } else {
                await createTerminalRoute(routeForm);
            }
            setSuccess("Ruta");
            setRouteForm(emptyRouteForm);
            setShowForm(false);
            setEditingId(null);
            await loadData();
            setTimeout(() => setSuccess(null), 3000);
        } catch { alert("Error al guardar la ruta"); }
        finally { setLoading(false); }
    };

    const handleEditLine = (l: any) => {
        setLineForm({ name: l.name, color: l.color, schedule: l.schedule, route: l.route, frequency: l.frequency || "" });
        setEditingId(l.id);
        setShowForm(true);
        setActiveSection('LINES');
    };

    const handleEditRoute = (r: any) => {
        setRouteForm({
            destination: r.destination, company: r.company,
            schedule: r.schedule, estimatedTime: r.estimatedTime || "", price: r.price || ""
        });
        setEditingId(r.id);
        setShowForm(true);
        setActiveSection('ROUTES');
    };

    const handleDeleteLine = async (id: string) => {
        if (!confirm("¿Eliminar esta línea?")) return;
        try { await deleteTransportLine(id); await loadData(); }
        catch { alert("Error al eliminar"); }
    };

    const handleDeleteRoute = async (id: string) => {
        if (!confirm("¿Eliminar esta ruta?")) return;
        try { await deleteTerminalRoute(id); await loadData(); }
        catch { alert("Error al eliminar"); }
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingId(null);
        setLineForm(emptyLineForm);
        setRouteForm(emptyRouteForm);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/admin" className={styles.backBtn}><ChevronLeft size={24} /></Link>
                <h1>Gestión de Transporte</h1>
            </header>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button onClick={() => { setActiveSection('LINES'); cancelForm(); }}
                    style={{
                        flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)',
                        background: activeSection === 'LINES' ? 'var(--primary)' : 'var(--surface)',
                        color: activeSection === 'LINES' ? 'white' : 'inherit', fontWeight: 700, border: '1px solid var(--border)'
                    }}>🚌 Líneas ({lines.length})</button>
                <button onClick={() => { setActiveSection('ROUTES'); cancelForm(); }}
                    style={{
                        flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)',
                        background: activeSection === 'ROUTES' ? 'var(--primary)' : 'var(--surface)',
                        color: activeSection === 'ROUTES' ? 'white' : 'inherit', fontWeight: 700, border: '1px solid var(--border)'
                    }}>🚐 Rutas Terminal ({routes.length})</button>
            </div>

            {success && (
                <div className={styles.successMsg}>
                    <CheckCircle size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    ¡{success} guardada correctamente!
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
                    {showForm ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> {activeSection === 'LINES' ? 'Nueva Línea' : 'Nueva Ruta'}</>}
                </button>
            </div>

            {/* LISTA */}
            {loadingList ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Cargando...</p>
            ) : activeSection === 'LINES' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    {lines.length === 0 && !showForm ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                            <Bus size={40} strokeWidth={1.5} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                            <p>No hay líneas de colectivo cargadas aún.</p>
                        </div>
                    ) : lines.map(l => (
                        <div key={l.id} style={{
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)', padding: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                <span style={{
                                    width: '14px', height: '14px', borderRadius: '50%',
                                    background: l.color, display: 'inline-block', flexShrink: 0
                                }} />
                                <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{l.name}</h4>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l.route}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏰ {l.schedule} · cada {l.frequency}</p>
                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                                <button onClick={() => handleEditLine(l)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: 'var(--background)', color: 'var(--primary)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}>
                                    <Edit3 size={12} /> Editar
                                </button>
                                <button onClick={() => handleDeleteLine(l.id)}
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
                    {routes.length === 0 && !showForm ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                            <Train size={40} strokeWidth={1.5} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                            <p>No hay rutas de terminal cargadas aún.</p>
                        </div>
                    ) : routes.map(r => (
                        <div key={r.id} style={{
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)', padding: '1rem'
                        }}>
                            <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.destination}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                🚐 {r.company} · ⏱ {r.estimatedTime}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                📅 {r.schedule} {r.price ? `· 💲${r.price}` : ''}
                            </p>
                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                                <button onClick={() => handleEditRoute(r)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: 'var(--background)', color: 'var(--primary)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}>
                                    <Edit3 size={12} /> Editar
                                </button>
                                <button onClick={() => handleDeleteRoute(r.id)}
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
            {showForm && activeSection === 'LINES' && (
                <form className={styles.form} onSubmit={handleLineSubmit}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>
                        {editingId ? '✏️ Editar Línea' : '➕ Nueva Línea de Colectivo'}
                    </h3>
                    <div className={styles.field}>
                        <label>Nombre de la Línea</label>
                        <input value={lineForm.name} onChange={e => setLineForm({ ...lineForm, name: e.target.value })} placeholder="Ej: Línea A - Verde" required />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Color (hex)</label>
                            <input type="color" value={lineForm.color} onChange={e => setLineForm({ ...lineForm, color: e.target.value })} />
                        </div>
                        <div className={styles.field}>
                            <label>Frecuencia</label>
                            <input value={lineForm.frequency} onChange={e => setLineForm({ ...lineForm, frequency: e.target.value })} placeholder="Ej: 20 min" required />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Recorrido</label>
                        <input value={lineForm.route} onChange={e => setLineForm({ ...lineForm, route: e.target.value })} placeholder="Ej: Terminal → Centro → UNNOBA" required />
                    </div>
                    <div className={styles.field}>
                        <label>Horarios</label>
                        <input value={lineForm.schedule} onChange={e => setLineForm({ ...lineForm, schedule: e.target.value })} placeholder="Ej: 6:30 a 22:00" required />
                    </div>
                    <button className={styles.submitBtn} disabled={loading}>
                        {loading ? "Guardando..." : editingId ? "Actualizar Línea" : "Guardar Línea"}
                        <Bus size={20} />
                    </button>
                </form>
            )}

            {showForm && activeSection === 'ROUTES' && (
                <form className={styles.form} onSubmit={handleRouteSubmit}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>
                        {editingId ? '✏️ Editar Ruta' : '➕ Nueva Ruta de Terminal'}
                    </h3>
                    <div className={styles.field}>
                        <label>Destino</label>
                        <input value={routeForm.destination} onChange={e => setRouteForm({ ...routeForm, destination: e.target.value })} placeholder="Ej: Buenos Aires (Retiro)" required />
                    </div>
                    <div className={styles.field}>
                        <label>Empresa</label>
                        <input value={routeForm.company} onChange={e => setRouteForm({ ...routeForm, company: e.target.value })} placeholder="Ej: Pullman General Belgrano" required />
                    </div>
                    <div className={styles.field}>
                        <label>Horarios / Frecuencia</label>
                        <input value={routeForm.schedule} onChange={e => setRouteForm({ ...routeForm, schedule: e.target.value })} placeholder="Ej: Lun a Vie 6:00, 10:00, 15:00" required />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Tiempo estimado</label>
                            <input value={routeForm.estimatedTime} onChange={e => setRouteForm({ ...routeForm, estimatedTime: e.target.value })} placeholder="Ej: 4 hs" />
                        </div>
                        <div className={styles.field}>
                            <label>Precio aprox.</label>
                            <input value={routeForm.price} onChange={e => setRouteForm({ ...routeForm, price: e.target.value })} placeholder="Ej: $12.000" />
                        </div>
                    </div>
                    <button className={styles.submitBtn} disabled={loading}>
                        {loading ? "Guardando..." : editingId ? "Actualizar Ruta" : "Guardar Ruta"}
                        <Train size={20} />
                    </button>
                </form>
            )}
        </div>
    );
}
