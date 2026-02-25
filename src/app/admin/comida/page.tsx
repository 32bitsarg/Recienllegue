"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    createRestaurant,
    getRestaurants,
    updateRestaurant,
    deleteRestaurant,
    admin_getPendingClaims,
    admin_processClaim,
    admin_toggleVerified,
    admin_setBusinessPremium
} from "@/app/actions/data";
import {
    ChevronLeft, Utensils, Star, CheckCircle, Save, Plus, X, Edit3, Trash2, Search,
    ShieldCheck, BadgeCheck, Crown, Clock, UserCheck, XCircle
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
    const [statusTab, setStatusTab] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'PREMIUM'>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 15;
    const [claims, setClaims] = useState<any[]>([]);
    const [processingClaim, setProcessingClaim] = useState<string | null>(null);

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
        const data = await getRestaurants(true);
        setRestaurants(data);
        setLoadingList(false);
    };

    const loadClaims = async () => {
        const data = await admin_getPendingClaims();
        setClaims(data);
    };

    useEffect(() => { loadRestaurants(); loadClaims(); }, []);

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

    const handleProcessClaim = async (claimId: string, approved: boolean) => {
        setProcessingClaim(claimId);
        try {
            await admin_processClaim(claimId, approved);
            await loadClaims();
            await loadRestaurants();
        } catch { alert("Error al procesar la solicitud"); }
        finally { setProcessingClaim(null); }
    };

    const handleToggleVerified = async (id: string, current: boolean) => {
        try {
            await admin_toggleVerified(id, 'RESTAURANT', !current);
            await loadRestaurants();
        } catch { alert("Error"); }
    };

    const handleTogglePremium = async (id: string, current: boolean) => {
        try {
            await admin_setBusinessPremium(id, 'RESTAURANT', !current);
            await loadRestaurants();
        } catch { alert("Error"); }
    };

    const categoryLabel: Record<string, string> = { ROTISERIA: "Rotisería", BAR: "Bar", CAFETERIA: "Cafetería", RESTAURANTE: "Restaurante", KIOSCO: "Kiosco", CARNICERIA: "Carnicería", FIAMBRERIA: "Fiambrería", PANADERIA: "Panadería", SUPERMERCADO: "Supermercado", DIETETICA: "Dietética", VERDULERIA: "Verdulería", OTRO: "Otro" };

    // Filtrado combinado
    const filteredRestaurants = restaurants.filter(r => {
        const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = filterCategory === "TODOS" || r.category === filterCategory;
        const matchStatus =
            statusTab === 'ALL' ? true :
                statusTab === 'PENDING' ? (!r.isVerified && !r.isPremium) :
                    statusTab === 'VERIFIED' ? (r.isVerified && !r.isPremium) :
                        statusTab === 'PREMIUM' ? r.isPremium : true;
        return matchSearch && matchCategory && matchStatus;
    });

    const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
    const paginatedRestaurants = filteredRestaurants.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Contadores para tabs
    const counts = {
        all: restaurants.length,
        pending: restaurants.filter(r => !r.isVerified && !r.isPremium).length,
        verified: restaurants.filter(r => r.isVerified && !r.isPremium).length,
        premium: restaurants.filter(r => r.isPremium).length
    };

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

            {/* ====== SOLICITUDES PENDIENTES ====== */}
            {claims.length > 0 && (
                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b' }}>
                        <Clock size={18} /> Solicitudes de Comercio Pendientes ({claims.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {claims.map(claim => (
                            <div key={claim.id} style={{
                                background: 'white', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)', padding: '1rem',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                        {claim.businessType === 'RESTAURANT' ? '🍽️ Restaurante' : '🏠 Hospedaje'} · Solicita: {claim.user?.name || claim.user?.username || claim.user?.email}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>ID: {claim.targetId.slice(0, 12)}...</div>
                                    {claim.proof && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>📝 {claim.proof}</p>}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleProcessClaim(claim.id, true)}
                                        disabled={processingClaim === claim.id}
                                        style={{
                                            padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700,
                                            background: '#10b981', color: 'white', border: 'none',
                                            display: 'flex', alignItems: 'center', gap: '4px', opacity: processingClaim === claim.id ? 0.5 : 1
                                        }}>
                                        <UserCheck size={14} /> Aprobar
                                    </button>
                                    <button
                                        onClick={() => handleProcessClaim(claim.id, false)}
                                        disabled={processingClaim === claim.id}
                                        style={{
                                            padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700,
                                            background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)',
                                            display: 'flex', alignItems: 'center', gap: '4px', opacity: processingClaim === claim.id ? 0.5 : 1
                                        }}>
                                        <XCircle size={14} /> Rechazar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {/* Status Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {[
                            { key: 'ALL' as const, label: 'Todos', count: counts.all, color: 'var(--foreground)' },
                            { key: 'PENDING' as const, label: 'Sin verificar', count: counts.pending, color: '#f59e0b' },
                            { key: 'VERIFIED' as const, label: 'Verificados', count: counts.verified, color: '#64748b' },
                            { key: 'PREMIUM' as const, label: 'Premium', count: counts.premium, color: '#10b981' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => { setStatusTab(tab.key); setCurrentPage(1); }}
                                style={{
                                    padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                                    fontSize: '0.85rem', fontWeight: 700,
                                    background: statusTab === tab.key ? `${tab.color}15` : 'var(--background)',
                                    color: statusTab === tab.key ? tab.color : 'var(--text-muted)',
                                    border: `1px solid ${statusTab === tab.key ? tab.color + '40' : 'var(--border)'}`,
                                    display: 'flex', alignItems: 'center', gap: '0.4rem'
                                }}
                            >
                                {tab.label}
                                <span style={{
                                    fontSize: '0.7rem', fontWeight: 800,
                                    background: statusTab === tab.key ? tab.color : 'var(--border)',
                                    color: statusTab === tab.key ? 'white' : 'var(--text-muted)',
                                    padding: '1px 6px', borderRadius: '99px', minWidth: '22px', textAlign: 'center'
                                }}>{tab.count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Search + Category */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0 0.75rem' }}>
                            <Search size={16} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={searchQuery}
                                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.75rem 0.5rem', outline: 'none', color: 'var(--foreground)' }}
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)', outline: 'none', minWidth: '150px' }}
                        >
                            <option value="TODOS">Todas las categorías</option>
                            {Array.from(new Set(restaurants.map(r => r.category).filter(Boolean))).sort().map(cat => (
                                <option key={cat} value={cat}>{categoryLabel[cat] || cat}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Mostrando {paginatedRestaurants.length} de {filteredRestaurants.length} resultados
                    </div>
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
                    {paginatedRestaurants.map(r => (
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
                                        {r.isVerified && (
                                            <span style={{
                                                fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
                                                borderRadius: '4px', background: 'rgba(100,116,139,0.1)', color: '#64748b'
                                            }}>✅ Verificado</span>
                                        )}
                                        {r.isPremium && (
                                            <span style={{
                                                fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px',
                                                borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#10b981'
                                            }}>👑 Premium</span>
                                        )}
                                    </div>
                                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.name}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.address} · ⭐{r.rating}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                <button onClick={() => handleToggleVerified(r.id, r.isVerified)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: r.isVerified ? 'rgba(100,116,139,0.1)' : 'var(--background)',
                                        color: r.isVerified ? '#64748b' : 'var(--text-muted)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}>
                                    <ShieldCheck size={12} /> {r.isVerified ? 'Quitar ✅' : 'Verificar ✅'}
                                </button>
                                <button onClick={() => handleTogglePremium(r.id, r.isPremium)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: r.isPremium ? 'rgba(16,185,129,0.15)' : 'var(--background)',
                                        color: r.isPremium ? '#10b981' : 'var(--text-muted)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}>
                                    <Crown size={12} /> {r.isPremium ? 'Quitar 👑' : 'Premium 👑'}
                                </button>
                                <button onClick={() => handleToggleFeatured(r.id, r.isFeaturedHome)}
                                    style={{
                                        padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                        background: r.isFeaturedHome ? 'rgba(245,158,11,0.15)' : 'var(--background)',
                                        color: r.isFeaturedHome ? '#f59e0b' : 'var(--text-muted)', border: '1px solid var(--border)',
                                        display: 'flex', alignItems: 'center', gap: '3px'
                                    }}>
                                    <Star size={12} /> {r.isFeaturedHome ? 'Quitar ⭐' : 'Destacar ⭐'}
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

            {/* Paginación */}
            {!showForm && totalPages > 1 && (
                <div style={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    gap: '0.5rem', marginBottom: '2rem'
                }}>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{
                            padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.85rem',
                            fontWeight: 700, border: '1px solid var(--border)',
                            background: 'var(--surface)', color: currentPage === 1 ? 'var(--border)' : 'var(--foreground)',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                    >←</button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            style={{
                                padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem',
                                fontWeight: 700, border: '1px solid',
                                borderColor: currentPage === i + 1 ? 'var(--primary)' : 'var(--border)',
                                background: currentPage === i + 1 ? 'var(--primary)' : 'var(--surface)',
                                color: currentPage === i + 1 ? 'white' : 'var(--foreground)',
                                minWidth: '36px'
                            }}
                        >{i + 1}</button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.85rem',
                            fontWeight: 700, border: '1px solid var(--border)',
                            background: 'var(--surface)', color: currentPage === totalPages ? 'var(--border)' : 'var(--foreground)',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                        }}
                    >→</button>
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
