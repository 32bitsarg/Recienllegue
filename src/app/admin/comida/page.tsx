"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    createRestaurant,
    getRestaurants,
    updateRestaurant,
    deleteRestaurant
} from "@/app/actions/data";
import {
    ChevronLeft, Utensils, Star, CheckCircle, Save, Plus, X, Edit3, Trash2, Search
} from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import styles from "../AdminForm.module.css";

const FOOD_CATEGORIES = ["ROTISERIA", "BAR", "CAFETERIA", "RESTAURANTE", "KIOSCO", "CARNICERIA", "FIAMBRERIA", "PANADERIA", "SUPERMERCADO", "DIETETICA", "VERDULERIA", "OTRO"];
const PRICE_RANGES = ["BAJO", "MEDIO", "ALTO"];

export default function AdminComidaPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loadingList, setLoadingList] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("TODOS");

    const emptyForm = {
        name: "",
        category: "ROTISERIA",
        priceRange: "MEDIO",
        rating: "4.5",
        distance: "A 10 min de la UNNOBA",
        image: "",
        featured: "",
        address: "",
        isFeaturedHome: false
    };

    const [formData, setFormData] = useState(emptyForm);

    const loadRestaurants = async () => {
        setLoadingList(true);
        const data = await getRestaurants();
        setRestaurants(data);
        setLoadingList(false);
    };

    useEffect(() => { loadRestaurants(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
                await updateRestaurant(editingId, formData);
            } else {
                await createRestaurant(formData);
            }
            setSuccess(true);
            setFormData(emptyForm);
            setShowForm(false);
            setEditingId(null);
            await loadRestaurants();
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            alert("Error al guardar el restaurante");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (r: any) => {
        setFormData({
            name: r.name,
            category: r.category,
            priceRange: r.priceRange,
            rating: String(r.rating),
            distance: r.distance,
            image: r.image,
            featured: r.featured || "",
            address: r.address,
            isFeaturedHome: r.isFeaturedHome
        });
        setEditingId(r.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este restaurante?")) return;
        try {
            await deleteRestaurant(id);
            await loadRestaurants();
        } catch { alert("Error al eliminar"); }
    };

    const handleToggleFeatured = async (id: string, current: boolean) => {
        try {
            await updateRestaurant(id, { isFeaturedHome: !current });
            await loadRestaurants();
        } catch { alert("Error"); }
    };

    const categoryLabel: Record<string, string> = { ROTISERIA: "Rotisería", BAR: "Bar", CAFETERIA: "Cafetería", RESTAURANTE: "Restaurante", KIOSCO: "Kiosco", CARNICERIA: "Carnicería", FIAMBRERIA: "Fiambrería", PANADERIA: "Panadería", SUPERMERCADO: "Supermercado", DIETETICA: "Dietética", VERDULERIA: "Verdulería", OTRO: "Otro" };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/admin" className={styles.backBtn}><ChevronLeft size={24} /></Link>
                <h1>Gestión de Comida</h1>
            </header>

            {success && (
                <div className={styles.successMsg}>
                    <CheckCircle size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    ¡Restaurante {editingId ? 'actualizado' : 'cargado'} correctamente!
                </div>
            )}

            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Restaurantes ({restaurants.length})</h3>
                <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(emptyForm); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                        background: showForm ? 'var(--border)' : 'var(--primary)', color: showForm ? 'var(--foreground)' : 'white',
                        fontWeight: 700, fontSize: '0.85rem'
                    }}>
                    {showForm ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> Nuevo Restaurante</>}
                </button>
            </div>

            {!showForm && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0 0.75rem' }}>
                        <Search size={16} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.75rem 0.5rem', outline: 'none', color: 'var(--foreground)' }}
                        />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)', outline: 'none', minWidth: '150px' }}
                    >
                        <option value="TODOS">Todas las categorías</option>
                        {Array.from(new Set(restaurants.map(r => r.category).filter(Boolean))).sort().map(cat => (
                            <option key={cat} value={cat}>{categoryLabel[cat] || cat}</option>
                        ))}
                    </select>
                </div>
            )}

            {loadingList ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Cargando...</p>
            ) : restaurants.length === 0 && !showForm ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    <Utensils size={40} strokeWidth={1.5} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                    <p>No hay restaurantes cargados aún.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    {restaurants
                        .filter(r => {
                            const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
                            const matchCategory = filterCategory === "TODOS" || r.category === filterCategory;
                            return matchSearch && matchCategory;
                        })
                        .map(r => (
                            <div key={r.id} style={{
                                background: 'var(--surface)', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)', padding: '1rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                                            <span style={{
                                                fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
                                                borderRadius: '4px', background: 'rgba(244,63,94,0.1)', color: '#f43f5e'
                                            }}>{categoryLabel[r.category] || r.category}</span>
                                            <span style={{
                                                fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
                                                borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: '#6366f1'
                                            }}>{r.priceRange}</span>
                                            {r.isFeaturedHome && (
                                                <span style={{
                                                    fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
                                                    borderRadius: '4px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b'
                                                }}>⭐ Destacado</span>
                                            )}
                                        </div>
                                        <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.name}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.address} · ⭐{r.rating}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                    <button onClick={() => handleToggleFeatured(r.id, r.isFeaturedHome)}
                                        style={{
                                            padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                            background: r.isFeaturedHome ? 'rgba(245,158,11,0.15)' : 'var(--background)',
                                            color: r.isFeaturedHome ? '#f59e0b' : 'var(--text-muted)', border: '1px solid var(--border)',
                                            display: 'flex', alignItems: 'center', gap: '3px'
                                        }}>
                                        <Star size={12} /> {r.isFeaturedHome ? 'Quitar Destacado' : 'Destacar'}
                                    </button>
                                    <button onClick={() => handleEdit(r)}
                                        style={{
                                            padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                            background: 'var(--background)', color: 'var(--primary)', border: '1px solid var(--border)',
                                            display: 'flex', alignItems: 'center', gap: '3px'
                                        }}>
                                        <Edit3 size={12} /> Editar
                                    </button>
                                    <button onClick={() => handleDelete(r.id)}
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
                        {editingId ? '✏️ Editar Restaurante' : '➕ Nuevo Restaurante'}
                    </h3>
                    <div className={styles.field}>
                        <label>Nombre</label>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Pizzería Don Mario" required />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Categoría</label>
                            <input name="category" value={formData.category} onChange={handleChange} placeholder="Ej: Pizzería, Bar..." required />
                        </div>
                        <div className={styles.field}>
                            <label>Rango de Precio</label>
                            <select name="priceRange" value={formData.priceRange} onChange={handleChange}>
                                {PRICE_RANGES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Rating (0-5)</label>
                            <input name="rating" type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={handleChange} />
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
                    <div className={styles.field}>
                        <label>Especialidad</label>
                        <input name="featured" value={formData.featured} onChange={handleChange} placeholder="Ej: Milanesas a la napolitana" />
                    </div>
                    <div className={styles.field}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="checkbox" name="isFeaturedHome" checked={formData.isFeaturedHome} onChange={handleChange} />
                            Mostrar como destacado en el Home
                        </label>
                    </div>
                    <ImageUpload label="Imagen" previewUrl={formData.image}
                        onUpload={(url) => setFormData(prev => ({ ...prev, image: url }))} />
                    <button className={styles.submitBtn} disabled={loading}>
                        {loading ? "Guardando..." : editingId ? "Actualizar Restaurante" : "Guardar Restaurante"}
                        <Save size={20} />
                    </button>
                </form>
            )}
        </div>
    );
}
