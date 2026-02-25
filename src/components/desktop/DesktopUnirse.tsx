"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import {
    Search, Store, Home, ArrowRight, CheckCircle2, AlertCircle,
    Camera, Plus, X, Info, Star, ChevronLeft, Utensils
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./DesktopUnirse.module.css";
import {
    searchClaimableBusinesses,
    submitBusinessClaim,
    registerCustomBusiness,
    registerCustomProperty
} from "@/app/actions/data";

const FOOD_CATEGORIES = [
    "Restaurante", "Pizzería", "Hamburguesería", "Cafetería", "Rotisería",
    "Heladería", "Cervecería", "Parrilla", "Comida Vegana", "Bar", "Otro"
];
const PROPERTY_TYPES = [
    { value: "RESIDENCIA", label: "Residencia Estudiantil" },
    { value: "DEPARTAMENTO", label: "Departamento" },
    { value: "CASA", label: "Casa" },
];
const GENDER_OPTIONS = [
    { value: "MIXTO", label: "Mixto" },
    { value: "FEMENINO", label: "Solo Mujeres" },
    { value: "MASCULINO", label: "Solo Varones" },
];
const SERVICES_OPTIONS = [
    "WiFi", "Agua caliente", "Gas natural", "Cocina equipada",
    "Lavarropas", "Estacionamiento", "Seguridad 24hs"
];

type Step = 'search' | 'type-select' | 'register-resto' | 'register-prop' | 'submit' | 'success';

async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url ?? null;
}

// ── Componente de upload múltiple ────────────────────────────────────────────
interface MultiImageUploadProps {
    images: { file: File; preview: string }[];
    coverIndex: number;
    onAdd: (files: FileList) => void;
    onRemove: (i: number) => void;
    onSetCover: (i: number) => void;
}

function MultiImageUpload({ images, coverIndex, onAdd, onRemove, onSetCover }: MultiImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'block' }}>
                Fotos del local <span style={{ fontWeight: 400 }}>— hacé clic en ⭐ para elegir la portada</span>
            </label>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                    <div key={i} style={{ position: 'relative', width: 100, height: 100 }}>
                        <img
                            src={img.preview}
                            alt=""
                            style={{
                                width: 100, height: 100, objectFit: 'cover',
                                borderRadius: 12,
                                border: i === coverIndex ? '3px solid var(--primary)' : '2px solid var(--border)'
                            }}
                        />
                        <button type="button" onClick={() => onSetCover(i)} title="Portada"
                            style={{
                                position: 'absolute', top: 4, left: 4,
                                background: i === coverIndex ? 'var(--primary)' : 'rgba(0,0,0,0.5)',
                                border: 'none', borderRadius: '50%', width: 24, height: 24,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                            <Star size={12} color="white" fill={i === coverIndex ? 'white' : 'none'} />
                        </button>
                        <button type="button" onClick={() => onRemove(i)}
                            style={{
                                position: 'absolute', top: 4, right: 4,
                                background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%',
                                width: 24, height: 24, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                            <X size={12} color="white" />
                        </button>
                        {i === coverIndex && (
                            <div style={{
                                position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                                background: 'var(--primary)', color: 'white', fontSize: '0.55rem',
                                fontWeight: 800, padding: '2px 6px', borderRadius: 99
                            }}>PORTADA</div>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => inputRef.current?.click()}
                    style={{
                        width: 100, height: 100, borderRadius: 12,
                        border: '2px dashed var(--border)', background: 'var(--surface)',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 6,
                        color: 'var(--text-muted)'
                    }}>
                    <Camera size={22} />
                    <span style={{ fontSize: '0.7rem' }}>Agregar foto</span>
                </button>
                <input ref={inputRef} type="file" accept="image/*" multiple hidden
                    onChange={e => e.target.files && onAdd(e.target.files)} />
            </div>
        </div>
    );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function DesktopUnirse() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ restaurants: any[]; properties: any[] }>({ restaurants: [], properties: [] });
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<Step>('search');

    const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
    const [proof, setProof] = useState("");

    // Restaurante
    const [restoData, setRestoData] = useState({
        name: "", address: "", category: "Restaurante",
        phone: "", featured: "", priceRange: "MEDIO"
    });
    const [restoImages, setRestoImages] = useState<{ file: File; preview: string }[]>([]);
    const [restoCoverIdx, setRestoCoverIdx] = useState(0);

    // Hospedaje
    const [propData, setPropData] = useState({
        title: "", description: "", address: "",
        type: "DEPARTAMENTO", price: "", gender: "MIXTO",
        ownerName: (session?.user as any)?.name || "",
        ownerPhone: ""
    });
    const [propImages, setPropImages] = useState<{ file: File; preview: string }[]>([]);
    const [propCoverIdx, setPropCoverIdx] = useState(0);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    // ── Login guard
    if (status === "loading") return (
        <div className={styles.container}>
            <div style={{ textAlign: 'center', padding: '10vh 0', color: 'var(--text-muted)' }}>Cargando...</div>
        </div>
    );

    if (!session) return (
        <div className={styles.container}>
            <div className={styles.successCard}>
                <Store size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                <h2>Panel de Comercios</h2>
                <p>Iniciá sesión para gestionar tus locales o registrar uno nuevo.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href="/unirse/login" className={styles.confirmBtn} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '0.9rem 2rem' }}>
                        Iniciar Sesión
                    </Link>
                    <Link href="/unirse/registro" className={styles.cancelBtn} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.9rem 2rem' }}>
                        Crear cuenta
                    </Link>
                </div>
            </div>
        </div>
    );

    // ── Helpers
    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 2) {
            setLoading(true);
            try { const data = await searchClaimableBusinesses(value); setResults(data); }
            catch { } finally { setLoading(false); }
        } else { setResults({ restaurants: [], properties: [] }); }
    };

    const handleClaim = (business: any, type: 'RESTAURANT' | 'PROPERTY') => {
        setSelectedBusiness({ ...business, type });
        setStep('submit');
    };

    const handleSubmitClaim = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user || !selectedBusiness) return;
        setLoading(true);
        try {
            await submitBusinessClaim({ userId: (session.user as any).id, targetId: selectedBusiness.id, businessType: selectedBusiness.type, proof });
            setStep('success');
        } catch { alert("Error al enviar la solicitud."); }
        finally { setLoading(false); }
    };

    const addImages = (
        current: { file: File; preview: string }[],
        setter: React.Dispatch<React.SetStateAction<{ file: File; preview: string }[]>>,
        files: FileList
    ) => setter([...current, ...Array.from(files).map(f => ({ file: f, preview: URL.createObjectURL(f) }))]);

    const removeImage = (
        current: { file: File; preview: string }[],
        setter: React.Dispatch<React.SetStateAction<{ file: File; preview: string }[]>>,
        coverSetter: React.Dispatch<React.SetStateAction<number>>,
        i: number
    ) => { const next = current.filter((_, idx) => idx !== i); setter(next); coverSetter(p => p >= next.length ? Math.max(0, next.length - 1) : p); };

    const toggleService = (s: string) => setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

    const handleRegisterResto = async (e: React.FormEvent) => {
        e.preventDefault();
        if (restoImages.length === 0) { alert("Agregá al menos una foto."); return; }
        setLoading(true);
        try {
            const urls: string[] = [];
            for (const img of restoImages) { const u = await uploadImage(img.file); if (u) urls.push(u); }
            if (urls.length === 0) { alert("Error al subir imágenes."); return; }
            const mainImage = urls[restoCoverIdx] ?? urls[0];
            const res = await registerCustomBusiness({
                name: restoData.name, address: restoData.address, category: restoData.category,
                phone: restoData.phone, featured: restoData.featured, priceRange: restoData.priceRange,
                image: mainImage, images: urls.filter((_, i) => i !== restoCoverIdx),
                ownerId: (session.user as any).id
            });
            if (res.success) setStep('success'); else alert(res.error);
        } catch { alert("Error al registrar."); } finally { setLoading(false); }
    };

    const handleRegisterProp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (propImages.length === 0) { alert("Agregá al menos una foto."); return; }
        setLoading(true);
        try {
            const urls: string[] = [];
            for (const img of propImages) { const u = await uploadImage(img.file); if (u) urls.push(u); }
            if (urls.length === 0) { alert("Error al subir imágenes."); return; }
            const mainImage = urls[propCoverIdx] ?? urls[0];
            const res = await registerCustomProperty({
                title: propData.title, description: propData.description, address: propData.address,
                type: propData.type, price: parseFloat(propData.price), gender: propData.gender,
                ownerName: propData.ownerName, ownerPhone: propData.ownerPhone,
                mainImage, images: urls.filter((_, i) => i !== propCoverIdx),
                services: selectedServices, ownerId: (session.user as any).id
            });
            if (res.success) setStep('success'); else alert(res.error);
        } catch { alert("Error al registrar."); } finally { setLoading(false); }
    };

    return (
        <div className={styles.container}>
            <AnimatePresence mode="wait">

                {/* ═══ SEARCH ═══════════════════════════════════════════════ */}
                {step === 'search' && (
                    <motion.div key="search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <header className={styles.header}>
                            <h1>Gestioná tu comercio</h1>
                            <p>Buscá tu local en Pergamino para reclamarlo, o registrá uno nuevo.</p>
                        </header>

                        <div className={styles.searchBar}>
                            <Search size={20} color="var(--text-muted)" />
                            <input type="text" placeholder="Nombre de tu local o alojamiento..." value={query} onChange={handleSearch} />
                        </div>

                        {loading && <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Buscando...</div>}

                        <div className={styles.resultsGrid}>
                            {results.restaurants.map(r => (
                                <div key={r.id} className={styles.resultCard}>
                                    <div className={styles.resultInfo}>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>🍽️ Restaurante</span>
                                        <h3>{r.name}</h3>
                                        <p>{r.address}</p>
                                    </div>
                                    <button onClick={() => handleClaim(r, 'RESTAURANT')} className={styles.claimBtn}>
                                        Es mío <ArrowRight size={14} />
                                    </button>
                                </div>
                            ))}
                            {results.properties.map(p => (
                                <div key={p.id} className={styles.resultCard}>
                                    <div className={styles.resultInfo}>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>🏠 Hospedaje</span>
                                        <h3>{p.title}</h3>
                                        <p>{p.address}</p>
                                    </div>
                                    <button onClick={() => handleClaim(p, 'PROPERTY')} className={styles.claimBtn}>
                                        Es mío <ArrowRight size={14} />
                                    </button>
                                </div>
                            ))}

                            {query.length > 2 && results.restaurants.length === 0 && results.properties.length === 0 && !loading && (
                                <motion.div className={styles.noResults} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                    <Store size={40} color="var(--border)" style={{ marginBottom: '1rem' }} />
                                    <h4>¿No encontraste tu local?</h4>
                                    <p>Registralo manualmente para aparecer en la app.</p>
                                    <button onClick={() => setStep('type-select')} className={styles.createBtn}>
                                        Registrar nuevo local
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ═══ SELECTOR DE TIPO ════════════════════════════════════ */}
                {step === 'type-select' && (
                    <motion.div key="type-select" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <header className={styles.header}>
                            <div className={styles.stepBadge}>Paso 1 de 2</div>
                            <h1>¿Qué tipo de local?</h1>
                            <p>Elegí el tipo de comercio que querés registrar.</p>
                        </header>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem', maxWidth: 640 }}>
                            <button onClick={() => setStep('register-resto')} style={{
                                padding: '2rem', borderRadius: 'var(--radius-lg)',
                                border: '2px solid var(--border)', background: 'var(--surface)',
                                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                            }}>
                                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'rgba(244,63,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <Utensils size={28} color="#f43f5e" />
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.4rem' }}>Comercio / Restaurante</div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Pizzerías, bares, cafeterías, rotiserías, etc.</div>
                            </button>

                            <button onClick={() => setStep('register-prop')} style={{
                                padding: '2rem', borderRadius: 'var(--radius-lg)',
                                border: '2px solid var(--border)', background: 'var(--surface)',
                                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                            }}>
                                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <Home size={28} color="#6366f1" />
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.4rem' }}>Alojamiento / Hospedaje</div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Residencias, departamentos, casas para alquilar.</div>
                            </button>
                        </div>

                        <button onClick={() => setStep('search')} className={styles.cancelBtn} style={{ marginTop: '1.5rem' }}>
                            <ChevronLeft size={16} /> Volver a buscar
                        </button>
                    </motion.div>
                )}

                {/* ═══ REGISTRO RESTAURANTE ════════════════════════════════ */}
                {step === 'register-resto' && (
                    <motion.div key="register-resto" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <header className={styles.header}>
                            <div className={styles.stepBadge}>🍽️ Comercio / Restaurante</div>
                            <h1>Alta de Comercio</h1>
                        </header>

                        <div className={styles.formCard}>
                            <form onSubmit={handleRegisterResto} className={styles.formGrid}>
                                <div className={styles.fullWidth}>
                                    <MultiImageUpload
                                        images={restoImages}
                                        coverIndex={restoCoverIdx}
                                        onAdd={files => addImages(restoImages, setRestoImages, files)}
                                        onRemove={i => removeImage(restoImages, setRestoImages, setRestoCoverIdx, i)}
                                        onSetCover={setRestoCoverIdx}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nombre del Comercio *</label>
                                    <input className={styles.input} placeholder="Ej: Pizzería Don Angelo"
                                        value={restoData.name} onChange={e => setRestoData({ ...restoData, name: e.target.value })} required />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Dirección (Pergamino) *</label>
                                    <input className={styles.input} placeholder="Ej: Av. de Mayo 540"
                                        value={restoData.address} onChange={e => setRestoData({ ...restoData, address: e.target.value })} required />
                                    <div className={styles.infoHelper}><Info size={12} /><span>Calculamos la distancia a la UNNOBA.</span></div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Categoría *</label>
                                    <select className={styles.select} value={restoData.category} onChange={e => setRestoData({ ...restoData, category: e.target.value })}>
                                        {FOOD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Precio aprox.</label>
                                    <select className={styles.select} value={restoData.priceRange} onChange={e => setRestoData({ ...restoData, priceRange: e.target.value })}>
                                        <option value="MEDIO">$ Económico</option>
                                        <option value="ALTO">$$ Moderado</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Teléfono</label>
                                    <input className={styles.input} placeholder="2477..."
                                        value={restoData.phone} onChange={e => setRestoData({ ...restoData, phone: e.target.value })} />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Especialidad</label>
                                    <input className={styles.input} placeholder="Ej: Milanesas, Pizzas..."
                                        value={restoData.featured} onChange={e => setRestoData({ ...restoData, featured: e.target.value })} />
                                </div>

                                <div className={`${styles.formActions} ${styles.fullWidth}`}>
                                    <button type="button" onClick={() => setStep('type-select')} className={styles.cancelBtn}>Volver</button>
                                    <button type="submit" disabled={loading} className={styles.confirmBtn}>
                                        {loading ? "Registrando..." : "Crear Comercio"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* ═══ REGISTRO HOSPEDAJE ══════════════════════════════════ */}
                {step === 'register-prop' && (
                    <motion.div key="register-prop" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <header className={styles.header}>
                            <div className={styles.stepBadge}>🏠 Alojamiento</div>
                            <h1>Alta de Hospedaje</h1>
                        </header>

                        <div className={styles.formCard}>
                            <form onSubmit={handleRegisterProp} className={styles.formGrid}>
                                <div className={styles.fullWidth}>
                                    <MultiImageUpload
                                        images={propImages}
                                        coverIndex={propCoverIdx}
                                        onAdd={files => addImages(propImages, setPropImages, files)}
                                        onRemove={i => removeImage(propImages, setPropImages, setPropCoverIdx, i)}
                                        onSetCover={setPropCoverIdx}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nombre / Título *</label>
                                    <input className={styles.input} placeholder="Ej: Depto Centro 2 ambientes"
                                        value={propData.title} onChange={e => setPropData({ ...propData, title: e.target.value })} required />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Dirección (Pergamino) *</label>
                                    <input className={styles.input} placeholder="Ej: Calle San Martín 400"
                                        value={propData.address} onChange={e => setPropData({ ...propData, address: e.target.value })} required />
                                    <div className={styles.infoHelper}><Info size={12} /><span>Calculamos la distancia a la UNNOBA.</span></div>
                                </div>

                                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                                    <label className={styles.label}>Descripción *</label>
                                    <textarea className={styles.textarea} rows={3} placeholder="Contá los detalles: habitaciones, baños, ambientes..."
                                        value={propData.description} onChange={e => setPropData({ ...propData, description: e.target.value })} required />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Tipo *</label>
                                    <select className={styles.select} value={propData.type} onChange={e => setPropData({ ...propData, type: e.target.value })}>
                                        {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Orientado a *</label>
                                    <select className={styles.select} value={propData.gender} onChange={e => setPropData({ ...propData, gender: e.target.value })}>
                                        {GENDER_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Precio mensual (ARS) *</label>
                                    <input className={styles.input} type="number" placeholder="Ej: 150000"
                                        value={propData.price} onChange={e => setPropData({ ...propData, price: e.target.value })} required />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Tu nombre *</label>
                                    <input className={styles.input} placeholder="Nombre de contacto"
                                        value={propData.ownerName} onChange={e => setPropData({ ...propData, ownerName: e.target.value })} required />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Tu teléfono *</label>
                                    <input className={styles.input} placeholder="2477..."
                                        value={propData.ownerPhone} onChange={e => setPropData({ ...propData, ownerPhone: e.target.value })} required />
                                </div>

                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label} style={{ marginBottom: '0.6rem', display: 'block' }}>Servicios incluidos</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {SERVICES_OPTIONS.map(s => (
                                            <button key={s} type="button" onClick={() => toggleService(s)} style={{
                                                padding: '0.4rem 0.85rem', borderRadius: '99px', fontSize: '0.82rem',
                                                fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                                background: selectedServices.includes(s) ? 'var(--primary)' : 'var(--surface)',
                                                color: selectedServices.includes(s) ? 'white' : 'var(--text-muted)',
                                                border: `1.5px solid ${selectedServices.includes(s) ? 'var(--primary)' : 'var(--border)'}`
                                            }}>{s}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className={`${styles.formActions} ${styles.fullWidth}`}>
                                    <button type="button" onClick={() => setStep('type-select')} className={styles.cancelBtn}>Volver</button>
                                    <button type="submit" disabled={loading} className={styles.confirmBtn}>
                                        {loading ? "Registrando..." : "Publicar Hospedaje"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* ═══ CLAIM ═══════════════════════════════════════════════ */}
                {step === 'submit' && (
                    <motion.div key="submit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <header className={styles.header}>
                            <h1>Solicitar Anexión</h1>
                            <p>Estás reclamando: <strong>{selectedBusiness?.name || selectedBusiness?.title}</strong></p>
                        </header>

                        <div className={styles.claimCard}>
                            <form onSubmit={handleSubmitClaim}>
                                <div className={styles.verificationBox}>
                                    <div className={styles.title}><AlertCircle size={16} /><span>Verificación requerida</span></div>
                                    <p>Para confirmar tu propiedad, dejanos tu Instagram, web o teléfono. Un admin lo validará.</p>
                                </div>

                                <textarea className={styles.textarea} value={proof} onChange={e => setProof(e.target.value)}
                                    placeholder="Ej: Soy el dueño, mi Instagram es @local_pergamino..." required rows={5} />

                                <div className={styles.formActions} style={{ marginTop: '1.5rem' }}>
                                    <button type="button" onClick={() => setStep('search')} className={styles.cancelBtn}>Cancelar</button>
                                    <button type="submit" disabled={loading} className={styles.confirmBtn}>
                                        {loading ? "Enviando..." : "Enviar Solicitud"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* ═══ SUCCESS ═════════════════════════════════════════════ */}
                {step === 'success' && (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className={styles.successCard}>
                            <CheckCircle2 size={60} className={styles.successIcon} />
                            <h2>¡Todo listo!</h2>
                            <p>Tu local fue registrado. Un administrador lo revisará pronto y aparecerá en la app una vez aprobado.</p>
                            <button onClick={() => router.push('/')} className={styles.confirmBtn} style={{ width: '100%' }}>
                                Ir al Inicio
                            </button>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
