"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    createProperty,
    getAllProperties,
    updateProperty,
    deleteProperty
} from "@/app/actions/data";
import {
    ChevronLeft,
    Plus,
    CheckCircle,
    Home,
    Save,
    Trash2,
    Edit3,
    X,
    BadgeCheck,
    Star,
    Eye,
    EyeOff
} from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import styles from "../AdminForm.module.css";

const SERVICE_OPTIONS = ["WiFi", "Lavandería", "Cocina", "Limpieza", "Climatización", "Muebles"];

export default function AdminHospedajePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [properties, setProperties] = useState<any[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const emptyForm = {
        title: "",
        description: "",
        type: "RESIDENCIA",
        price: "",
        address: "",
        distance: "A 5 min de la UNNOBA",
        gender: "MIXTO",
        ownerName: "",
        ownerPhone: "",
        mainImage: "",
        images: [] as string[],
        services: [] as string[],
        verified: false,
        sponsor: false
    };

    const [formData, setFormData] = useState(emptyForm);

    const loadProperties = async () => {
        setLoadingList(true);
        const data = await getAllProperties();
        setProperties(data);
        setLoadingList(false);
    };

    useEffect(() => {
        loadProperties();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const toggleService = (service: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await updateProperty(editingId, {
                    ...formData,
                    price: Number(formData.price)
                });
            } else {
                await createProperty({
                    ...formData,
                    ownerId: (session?.user as any)?.id,
                    price: Number(formData.price)
                });
            }
            setSuccess(true);
            setFormData(emptyForm);
            setShowForm(false);
            setEditingId(null);
            await loadProperties();
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            alert("Error al guardar la propiedad");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (prop: any) => {
        setFormData({
            title: prop.title,
            description: prop.description,
            type: prop.type,
            price: String(prop.price),
            address: prop.address,
            distance: prop.distance,
            gender: prop.gender,
            ownerName: prop.ownerName,
            ownerPhone: prop.ownerPhone,
            mainImage: prop.mainImage,
            images: (prop.images as string[]) || [],
            services: (prop.services as string[]) || [],
            verified: prop.verified || false,
            sponsor: prop.sponsor || false
        });
        setEditingId(prop.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás SEGURO de eliminar esta propiedad? Se borrarán también los favoritos asociados.")) return;
        try {
            await deleteProperty(id);
            await loadProperties();
        } catch {
            alert("Error al eliminar");
        }
    };

    const handleToggleBadge = async (id: string, field: 'verified' | 'sponsor', currentValue: boolean) => {
        try {
            await updateProperty(id, { [field]: !currentValue });
            await loadProperties();
        } catch {
            alert("Error al actualizar badge");
        }
    };

    const handleToggleActive = async (id: string, currentValue: boolean) => {
        try {
            await updateProperty(id, { active: !currentValue });
            await loadProperties();
        } catch {
            alert("Error al cambiar estado");
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/admin" className={styles.backBtn}>
                    <ChevronLeft size={24} />
                </Link>
                <h1>Gestión de Hospedajes</h1>
            </header>

            {success && (
                <div className={styles.successMsg}>
                    <CheckCircle size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    ¡Propiedad {editingId ? 'actualizada' : 'cargada'} correctamente!
                </div>
            )}

            {/* LISTA DE PROPIEDADES */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                    Propiedades cargadas ({properties.length})
                </h3>
                <button
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(emptyForm); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                        background: showForm ? 'var(--border)' : 'var(--primary)', color: showForm ? 'var(--foreground)' : 'white',
                        fontWeight: 700, fontSize: '0.85rem'
                    }}
                >
                    {showForm ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> Nueva Propiedad</>}
                </button>
            </div>

            {loadingList ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Cargando...</p>
            ) : properties.length === 0 && !showForm ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    <Home size={40} strokeWidth={1.5} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                    <p>No hay propiedades cargadas aún.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    {properties.map(prop => (
                        <div key={prop.id} style={{
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)', padding: '1rem',
                            opacity: prop.active ? 1 : 0.5
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <div>
                                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
                                            borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: '#6366f1'
                                        }}>{prop.type}</span>
                                        {prop.verified && (
                                            <span style={{
                                                fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
                                                borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#10b981',
                                                display: 'flex', alignItems: 'center', gap: '2px'
                                            }}>
                                                <BadgeCheck size={10} /> Verificado
                                            </span>
                                        )}
                                        {prop.sponsor && (
                                            <span style={{
                                                fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
                                                borderRadius: '4px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
                                                display: 'flex', alignItems: 'center', gap: '2px'
                                            }}>
                                                <Star size={10} /> Sponsor
                                            </span>
                                        )}
                                        {!prop.active && (
                                            <span style={{
                                                fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
                                                borderRadius: '4px', background: 'rgba(244,63,94,0.1)', color: '#f43f5e'
                                            }}>Inactivo</span>
                                        )}
                                    </div>
                                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{prop.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{prop.address} · ${Number(prop.price).toLocaleString()}/mes</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                <button onClick={() => handleToggleBadge(prop.id, 'verified', prop.verified)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: prop.verified ? 'rgba(16,185,129,0.15)' : 'var(--background)',
                                        color: prop.verified ? '#10b981' : 'var(--text-muted)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}
                                >
                                    <BadgeCheck size={12} /> {prop.verified ? 'Quitar Verificado' : 'Verificar'}
                                </button>
                                <button onClick={() => handleToggleBadge(prop.id, 'sponsor', prop.sponsor)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: prop.sponsor ? 'rgba(245,158,11,0.15)' : 'var(--background)',
                                        color: prop.sponsor ? '#f59e0b' : 'var(--text-muted)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}
                                >
                                    <Star size={12} /> {prop.sponsor ? 'Quitar Sponsor' : 'Sponsor'}
                                </button>
                                <button onClick={() => handleToggleActive(prop.id, prop.active)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: 'var(--background)', color: 'var(--text-muted)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}
                                >
                                    {prop.active ? <><EyeOff size={12} /> Desactivar</> : <><Eye size={12} /> Activar</>}
                                </button>
                                <button onClick={() => handleEdit(prop)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: 'var(--background)', color: 'var(--primary)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}
                                >
                                    <Edit3 size={12} /> Editar
                                </button>
                                <button onClick={() => handleDelete(prop.id)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: 'rgba(244,63,94,0.05)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}
                                >
                                    <Trash2 size={12} /> Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* FORMULARIO */}
            {showForm && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>
                        {editingId ? '✏️ Editar Propiedad' : '➕ Nueva Propiedad'}
                    </h3>
                    <div className={styles.field}>
                        <label>Título</label>
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Residencia Don Bosco" required />
                    </div>
                    <div className={styles.field}>
                        <label>Descripción</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Tipo</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="RESIDENCIA">Residencia</option>
                                <option value="DEPARTAMENTO">Departamento</option>
                                <option value="CASA">Casa</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Género</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="MIXTO">Mixto</option>
                                <option value="FEMENINO">Femenino</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="NA">N/A</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Precio ($/mes)</label>
                            <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="150000" required />
                        </div>
                        <div className={styles.field}>
                            <label>Distancia</label>
                            <input name="distance" value={formData.distance} onChange={handleChange} />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Dirección</label>
                        <input name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Nombre Dueño</label>
                            <input name="ownerName" value={formData.ownerName} onChange={handleChange} required />
                        </div>
                        <div className={styles.field}>
                            <label>Teléfono</label>
                            <input name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Servicios</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {SERVICE_OPTIONS.map(s => (
                                <button key={s} type="button" onClick={() => toggleService(s)}
                                    style={{
                                        padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600,
                                        background: formData.services.includes(s) ? 'var(--primary)' : 'var(--surface)',
                                        color: formData.services.includes(s) ? 'white' : 'var(--foreground)',
                                        border: '1px solid var(--border)'
                                    }}>{s}</button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" name="verified" checked={formData.verified} onChange={handleChange} />
                                <BadgeCheck size={16} color={formData.verified ? '#10b981' : 'var(--text-muted)'} />
                                Propiedad Verificada
                            </label>
                        </div>
                        <div className={styles.field}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" name="sponsor" checked={formData.sponsor} onChange={handleChange} />
                                <Star size={16} color={formData.sponsor ? '#f59e0b' : 'var(--text-muted)'} fill={formData.sponsor ? '#f59e0b' : 'none'} />
                                Es Sponsor (Destacado)
                            </label>
                        </div>
                    </div>

                    <ImageUpload label="Imagen Principal" previewUrl={formData.mainImage}
                        onUpload={(url) => setFormData(prev => ({ ...prev, mainImage: url }))} />
                    <button className={styles.submitBtn} disabled={loading}>
                        {loading ? "Guardando..." : editingId ? "Actualizar Propiedad" : "Guardar Propiedad"}
                        <Save size={20} />
                    </button>
                </form>
            )}
        </div>
    );
}
