"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import {
    Search, Store, Home, ArrowRight, CheckCircle2, AlertCircle,
    Camera, Plus, X, Info, Star, ChevronLeft, Utensils
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import styles from "@/app/unirse/Comercial.module.css";
import {
    searchClaimableBusinesses,
    submitBusinessClaim,
    registerCustomBusiness,
    registerCustomProperty
} from "@/app/actions/data";

// ─── Listas de opciones ────────────────────────────────────────────────────
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

// ─── Tipo de registro ───────────────────────────────────────────────────────
type BusinessType = 'RESTAURANT' | 'PROPERTY';
type Step = 'search' | 'type-select' | 'register-resto' | 'register-prop' | 'submit' | 'success';

// ─── Ayuda para upload de imágenes ─────────────────────────────────────────
async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url ?? null;
}

// ─── Componente de upload múltiple ─────────────────────────────────────────
interface MultiImageUploadProps {
    images: { file: File; preview: string; url?: string }[];
    coverIndex: number;
    onAdd: (files: FileList) => void;
    onRemove: (i: number) => void;
    onSetCover: (i: number) => void;
}

function MultiImageUpload({ images, coverIndex, onAdd, onRemove, onSetCover }: MultiImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                Fotos del local <span style={{ fontWeight: 400 }}>(la 1ª con ⭐ es la portada)</span>
            </label>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                    <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                        <img
                            src={img.preview}
                            alt=""
                            style={{
                                width: 80, height: 80, objectFit: 'cover',
                                borderRadius: 10,
                                border: i === coverIndex ? '3px solid var(--primary)' : '2px solid var(--border)'
                            }}
                        />
                        {/* Botón portada */}
                        <button
                            type="button"
                            onClick={() => onSetCover(i)}
                            style={{
                                position: 'absolute', top: 2, left: 2,
                                background: i === coverIndex ? 'var(--primary)' : 'rgba(0,0,0,0.45)',
                                border: 'none', borderRadius: '50%',
                                width: 20, height: 20, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            title="Usar como portada"
                        >
                            <Star size={10} color="white" fill={i === coverIndex ? 'white' : 'none'} />
                        </button>
                        {/* Botón eliminar */}
                        <button
                            type="button"
                            onClick={() => onRemove(i)}
                            style={{
                                position: 'absolute', top: 2, right: 2,
                                background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%',
                                width: 20, height: 20, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <X size={10} color="white" />
                        </button>
                    </div>
                ))}
                {/* Botón agregar */}
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    style={{
                        width: 80, height: 80, borderRadius: 10,
                        border: '2px dashed var(--border)', background: 'var(--surface)',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 4,
                        color: 'var(--text-muted)', fontSize: '0.65rem'
                    }}
                >
                    <Camera size={20} />
                    <span>Agregar</span>
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={e => e.target.files && onAdd(e.target.files)}
                />
            </div>
        </div>
    );
}

// ─── Componente principal ───────────────────────────────────────────────────
export default function MobileUnirse() {
    const { data: session } = useSession();
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ restaurants: any[]; properties: any[] }>({ restaurants: [], properties: [] });
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<Step>('search');

    // Reclamo
    const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
    const [proof, setProof] = useState("");

    // Registro — Restaurante
    const [restoData, setRestoData] = useState({
        name: "", address: "", category: "Restaurante",
        phone: "", featured: "", priceRange: "MEDIO"
    });
    const [restoImages, setRestoImages] = useState<{ file: File; preview: string }[]>([]);
    const [restoCoverIdx, setRestoCoverIdx] = useState(0);

    // Registro — Hospedaje
    const [propData, setPropData] = useState({
        title: "", description: "", address: "",
        type: "DEPARTAMENTO", price: "", gender: "MIXTO",
        ownerName: (session?.user as any)?.name || "",
        ownerPhone: ""
    });
    const [propImages, setPropImages] = useState<{ file: File; preview: string }[]>([]);
    const [propCoverIdx, setPropCoverIdx] = useState(0);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    // ── Handlers generales ──────────────────────────────────────────────────
    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 2) {
            setLoading(true);
            try {
                const data = await searchClaimableBusinesses(value);
                setResults(data);
            } catch { } finally { setLoading(false); }
        } else {
            setResults({ restaurants: [], properties: [] });
        }
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
            await submitBusinessClaim({
                userId: (session.user as any).id,
                targetId: selectedBusiness.id,
                businessType: selectedBusiness.type,
                proof
            });
            setStep('success');
        } catch { alert("Error al enviar la solicitud."); }
        finally { setLoading(false); }
    };

    // ── Handlers de imágenes ────────────────────────────────────────────────
    const addImages = (
        current: { file: File; preview: string }[],
        setter: React.Dispatch<React.SetStateAction<{ file: File; preview: string }[]>>,
        files: FileList
    ) => {
        const newImgs = Array.from(files).map(f => ({
            file: f,
            preview: URL.createObjectURL(f)
        }));
        setter([...current, ...newImgs]);
    };

    const removeImage = (
        current: { file: File; preview: string }[],
        setter: React.Dispatch<React.SetStateAction<{ file: File; preview: string }[]>>,
        coverSetter: React.Dispatch<React.SetStateAction<number>>,
        i: number
    ) => {
        const next = current.filter((_, idx) => idx !== i);
        setter(next);
        coverSetter(prev => (prev >= next.length ? Math.max(0, next.length - 1) : prev));
    };

    const toggleService = (s: string) => {
        setSelectedServices(prev =>
            prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
        );
    };

    // ── Handler — Registrar Restaurante ─────────────────────────────────────
    const handleRegisterResto = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user || restoImages.length === 0) {
            alert("Agregá al menos una foto del comercio.");
            return;
        }
        setLoading(true);
        try {
            // Subir todas las imágenes
            const urls: string[] = [];
            for (const img of restoImages) {
                const url = await uploadImage(img.file);
                if (url) urls.push(url);
            }
            if (urls.length === 0) { alert("Error al subir las imágenes."); return; }

            const mainImage = urls[restoCoverIdx] ?? urls[0];
            const otherImages = urls.filter((_, i) => i !== restoCoverIdx);

            const res = await registerCustomBusiness({
                name: restoData.name,
                address: restoData.address,
                category: restoData.category,
                phone: restoData.phone,
                featured: restoData.featured,
                priceRange: restoData.priceRange,
                image: mainImage,
                images: otherImages,
                ownerId: (session.user as any).id
            });

            if (res.success) setStep('success');
            else alert(res.error);
        } catch { alert("Error al registrar el comercio."); }
        finally { setLoading(false); }
    };

    // ── Handler — Registrar Hospedaje ───────────────────────────────────────
    const handleRegisterProp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user || propImages.length === 0) {
            alert("Agregá al menos una foto del alojamiento.");
            return;
        }
        setLoading(true);
        try {
            const urls: string[] = [];
            for (const img of propImages) {
                const url = await uploadImage(img.file);
                if (url) urls.push(url);
            }
            if (urls.length === 0) { alert("Error al subir las imágenes."); return; }

            const mainImage = urls[propCoverIdx] ?? urls[0];
            const otherImages = urls.filter((_, i) => i !== propCoverIdx);

            const res = await registerCustomProperty({
                title: propData.title,
                description: propData.description,
                address: propData.address,
                type: propData.type,
                price: parseFloat(propData.price),
                gender: propData.gender,
                ownerName: propData.ownerName,
                ownerPhone: propData.ownerPhone,
                mainImage,
                images: otherImages,
                services: selectedServices,
                ownerId: (session.user as any).id
            });

            if (res.success) setStep('success');
            else alert(res.error);
        } catch { alert("Error al registrar el alojamiento."); }
        finally { setLoading(false); }
    };

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div className={styles.container}>
            <div style={{ marginBottom: '1rem' }}>
                <TopBar />
            </div>

            <AnimatePresence mode="wait">

                {/* ═══ STEP: SEARCH ════════════════════════════════════════ */}
                {step === 'search' && (
                    <motion.div key="search" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        <header className={styles.header}>
                            <h1>Tu local en Pergamino</h1>
                            <p>Buscá tu comercio o alojamiento para gestionarlo.</p>
                        </header>

                        <div className={styles.searchSection}>
                            <div className={styles.searchBar}>
                                <Search size={20} color="var(--text-muted)" />
                                <input
                                    type="text"
                                    placeholder="Nombre de tu local..."
                                    value={query}
                                    onChange={handleSearch}
                                />
                            </div>
                            {loading && <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Buscando...</div>}
                        </div>

                        <div className={styles.resultsSection}>
                            {results.restaurants.map(r => (
                                <div key={r.id} className={styles.businessCard}>
                                    <div className={styles.businessInfo}>
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
                                <div key={p.id} className={styles.businessCard}>
                                    <div className={styles.businessInfo}>
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
                                    <p>Si no aparece, registralo manualmente.</p>
                                    <button onClick={() => setStep('type-select')} className={styles.createBtn}>
                                        Registrar nuevo local
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ═══ STEP: SELECTOR DE TIPO ══════════════════════════════ */}
                {step === 'type-select' && (
                    <motion.div key="type-select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <header className={styles.header}>
                            <div className={styles.stepBadge}>Paso 1 de 2</div>
                            <h1>¿Qué tipo de local?</h1>
                            <p>Elegí el tipo de comercio que querés registrar.</p>
                        </header>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => setStep('register-resto')}
                                style={{
                                    padding: '1.5rem', borderRadius: 'var(--radius-lg)',
                                    border: '1.5px solid var(--border)', background: 'var(--surface)',
                                    cursor: 'pointer', textAlign: 'left',
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'rgba(244,63,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Utensils size={26} color="#f43f5e" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>Comercio / Restaurante</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                        Pizzerías, bares, cafeterías, rotiserías, etc.
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => setStep('register-prop')}
                                style={{
                                    padding: '1.5rem', borderRadius: 'var(--radius-lg)',
                                    border: '1.5px solid var(--border)', background: 'var(--surface)',
                                    cursor: 'pointer', textAlign: 'left',
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Home size={26} color="#6366f1" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>Alojamiento / Hospedaje</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                        Residencias, departamentos, casas para alquilar.
                                    </div>
                                </div>
                            </button>

                            <button onClick={() => setStep('search')} className={styles.cancelBtn}>
                                <ChevronLeft size={16} /> Volver
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ═══ STEP: REGISTRO RESTAURANTE ══════════════════════════ */}
                {step === 'register-resto' && (
                    <motion.div key="register-resto" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <header className={styles.header}>
                            <div className={styles.stepBadge}>🍽️ Comercio / Restaurante</div>
                            <h1>Datos del Comercio</h1>
                        </header>

                        <form onSubmit={handleRegisterResto} className={styles.submitForm} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

                            {/* Fotos */}
                            <MultiImageUpload
                                images={restoImages}
                                coverIndex={restoCoverIdx}
                                onAdd={(files) => addImages(restoImages, setRestoImages, files)}
                                onRemove={(i) => removeImage(restoImages, setRestoImages, setRestoCoverIdx, i)}
                                onSetCover={setRestoCoverIdx}
                            />

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nombre del Comercio *</label>
                                <input className={styles.input} placeholder="Ej: Pizzería Don Angelo"
                                    value={restoData.name} onChange={e => setRestoData({ ...restoData, name: e.target.value })} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Dirección en Pergamino *</label>
                                <input className={styles.input} placeholder="Ej: Av. de Mayo 540"
                                    value={restoData.address} onChange={e => setRestoData({ ...restoData, address: e.target.value })} required />
                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                    <Info size={12} /><span>Calculamos automáticamente el tiempo a la UNNOBA.</span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Categoría *</label>
                                    <select className={styles.select} value={restoData.category}
                                        onChange={e => setRestoData({ ...restoData, category: e.target.value })}>
                                        {FOOD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Precio aprox.</label>
                                    <select className={styles.select} value={restoData.priceRange}
                                        onChange={e => setRestoData({ ...restoData, priceRange: e.target.value })}>
                                        <option value="MEDIO">$ Económico</option>
                                        <option value="ALTO">$$ Moderado</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Teléfono</label>
                                    <input className={styles.input} placeholder="2477..."
                                        value={restoData.phone} onChange={e => setRestoData({ ...restoData, phone: e.target.value })} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Especialidad</label>
                                    <input className={styles.input} placeholder="Ej: Milanesas"
                                        value={restoData.featured} onChange={e => setRestoData({ ...restoData, featured: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button type="button" onClick={() => setStep('type-select')} className={styles.cancelBtn}>Volver</button>
                                <button type="submit" disabled={loading} className={styles.confirmBtn}>
                                    {loading ? "Registrando..." : "Crear Comercio"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* ═══ STEP: REGISTRO HOSPEDAJE ════════════════════════════ */}
                {step === 'register-prop' && (
                    <motion.div key="register-prop" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <header className={styles.header}>
                            <div className={styles.stepBadge}>🏠 Alojamiento</div>
                            <h1>Datos del Hospedaje</h1>
                        </header>

                        <form onSubmit={handleRegisterProp} className={styles.submitForm} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

                            {/* Fotos */}
                            <MultiImageUpload
                                images={propImages}
                                coverIndex={propCoverIdx}
                                onAdd={(files) => addImages(propImages, setPropImages, files)}
                                onRemove={(i) => removeImage(propImages, setPropImages, setPropCoverIdx, i)}
                                onSetCover={setPropCoverIdx}
                            />

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nombre / Título *</label>
                                <input className={styles.input} placeholder="Ej: Depto Centro 2 ambientes"
                                    value={propData.title} onChange={e => setPropData({ ...propData, title: e.target.value })} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Descripción *</label>
                                <textarea className={styles.textarea} rows={3} placeholder="Contá los detalles: habitaciones, baños, ubicación..."
                                    value={propData.description} onChange={e => setPropData({ ...propData, description: e.target.value })} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Dirección en Pergamino *</label>
                                <input className={styles.input} placeholder="Ej: Calle San Martín 400"
                                    value={propData.address} onChange={e => setPropData({ ...propData, address: e.target.value })} required />
                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                    <Info size={12} /><span>Calculamos automáticamente el tiempo a la UNNOBA.</span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Tipo *</label>
                                    <select className={styles.select} value={propData.type}
                                        onChange={e => setPropData({ ...propData, type: e.target.value })}>
                                        {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Orientado a *</label>
                                    <select className={styles.select} value={propData.gender}
                                        onChange={e => setPropData({ ...propData, gender: e.target.value })}>
                                        {GENDER_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Precio mensual (ARS) *</label>
                                <input className={styles.input} type="number" placeholder="Ej: 150000"
                                    value={propData.price} onChange={e => setPropData({ ...propData, price: e.target.value })} required />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
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
                            </div>

                            {/* Servicios */}
                            <div>
                                <label className={styles.label} style={{ marginBottom: '0.5rem', display: 'block' }}>Servicios incluidos</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {SERVICES_OPTIONS.map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => toggleService(s)}
                                            style={{
                                                padding: '0.35rem 0.75rem', borderRadius: '99px', fontSize: '0.78rem',
                                                fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                                background: selectedServices.includes(s) ? 'var(--primary)' : 'var(--surface)',
                                                color: selectedServices.includes(s) ? 'white' : 'var(--text-muted)',
                                                border: `1.5px solid ${selectedServices.includes(s) ? 'var(--primary)' : 'var(--border)'}`
                                            }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button type="button" onClick={() => setStep('type-select')} className={styles.cancelBtn}>Volver</button>
                                <button type="submit" disabled={loading} className={styles.confirmBtn}>
                                    {loading ? "Registrando..." : "Publicar Hospedaje"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* ═══ STEP: SUBMIT CLAIM ══════════════════════════════════ */}
                {step === 'submit' && (
                    <motion.div key="submit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <header className={styles.header}>
                            <h1>Solicitar Anexión</h1>
                            <p>Estás reclamando: <strong>{selectedBusiness?.name || selectedBusiness?.title}</strong></p>
                        </header>

                        <form onSubmit={handleSubmitClaim} className={styles.submitForm}>
                            <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                                    <AlertCircle size={16} />
                                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Verificación requerida</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                    Para confirmar tu propiedad, dejanos tu Instagram, web o teléfono. Un admin lo validará.
                                </p>
                            </div>

                            <textarea
                                className={styles.textarea}
                                value={proof}
                                onChange={e => setProof(e.target.value)}
                                placeholder="Ej: Soy el dueño, mi Instagram es @local_pergamino..."
                                required
                                rows={5}
                            />

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setStep('search')} className={styles.cancelBtn}>Cancelar</button>
                                <button type="submit" disabled={loading} className={styles.confirmBtn}>
                                    {loading ? "Enviando..." : "Enviar Solicitud"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* ═══ STEP: SUCCESS ═══════════════════════════════════════ */}
                {step === 'success' && (
                    <motion.div key="success" className={styles.successCard} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <CheckCircle2 size={60} className={styles.successIcon} />
                        <h2>¡Todo listo!</h2>
                        <p>Tu local fue registrado. Un administrador lo revisará pronto y aparecerá en la app una vez aprobado.</p>
                        <button onClick={() => router.push('/')} className={styles.confirmBtn} style={{ width: '100%' }}>
                            Ir al Inicio
                        </button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
