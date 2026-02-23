"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Heart, Home as HomeIcon, Utensils, ChevronRight, CheckCircle } from "lucide-react";
import { getUserFavorites } from "@/app/actions/data";
import { useSession } from "next-auth/react";

export interface FavoritosInitialData {
    favorites: { properties: any[]; restaurants: any[] };
}

interface DesktopFavoritosProps {
    initialData?: FavoritosInitialData | null;
}

export default function DesktopFavoritos({ initialData }: DesktopFavoritosProps) {
    const { data: session, status } = useSession();
    const [favorites, setFavorites] = useState(initialData?.favorites ?? { properties: [], restaurants: [] });
    const [loading, setLoading] = useState(!initialData);
    const [activeTab, setActiveTab] = useState<"properties" | "restaurants">("properties");

    useEffect(() => {
        if (initialData) return;
        if (session?.user) getUserFavorites((session.user as any).id).then(setFavorites);
        setLoading(false);
    }, [session?.user, initialData]);

    if (status === "loading" || loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Cargando favoritos...</div>;

    const current = activeTab === "properties" ? favorites.properties : favorites.restaurants;

    return (
        <main style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
            <Link href="/perfil" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--foreground)', textDecoration: 'none' }}>
                <ChevronLeft size={20} /> Volver al perfil
            </Link>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Mis Favoritos</h1>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button onClick={() => setActiveTab('properties')} style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: activeTab === 'properties' ? 'var(--primary)' : 'var(--surface)', color: activeTab === 'properties' ? 'white' : 'var(--foreground)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HomeIcon size={16} /> Hospedajes
                </button>
                <button onClick={() => setActiveTab('restaurants')} style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: activeTab === 'restaurants' ? 'var(--primary)' : 'var(--surface)', color: activeTab === 'restaurants' ? 'white' : 'var(--foreground)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Utensils size={16} /> Comida
                </button>
            </div>
            {current.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    <Heart size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <h3 style={{ marginBottom: '0.5rem' }}>Aún no tenés favoritos</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Guardá los lugares que más te gusten.</p>
                    <Link href={activeTab === 'properties' ? "/hospedaje" : "/comida"} style={{ color: 'var(--primary)', fontWeight: 700 }}>Explorar {activeTab === 'properties' ? "Hospedajes" : "Comida"}</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {activeTab === 'properties' && favorites.properties.map((h) => (
                        <Link key={h.id} href={`/hospedaje/${h.id}`} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ height: 160, background: 'var(--surface-hover)', position: 'relative' }}>
                                {h.mainImage && <img src={h.mainImage} alt={h.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                {h.verified && <span style={{ position: 'absolute', top: 8, left: 8, background: 'var(--primary)', color: 'white', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: 4, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={12} /> Verificado</span>}
                                <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'var(--primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>${Number(h.price).toLocaleString()}/mes</span>
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.type} · {h.distance}</span>
                                <h3 style={{ marginTop: '0.25rem', fontSize: '1rem' }}>{h.title}</h3>
                            </div>
                        </Link>
                    ))}
                    {activeTab === 'restaurants' && favorites.restaurants.map((res: any) => (
                        <Link key={res.id} href="/comida" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'flex' }}>
                            <div style={{ width: 100, height: 100, background: 'var(--surface-hover)', flexShrink: 0 }}>
                                {res.image ? <img src={res.image} alt={res.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                            </div>
                            <div style={{ padding: '0.75rem', flex: 1 }}>
                                <h3 style={{ fontSize: '1rem' }}>{res.name}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{res.featured || res.category}</p>
                            </div>
                            <ChevronRight size={20} style={{ alignSelf: 'center', color: 'var(--text-muted)' }} />
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
