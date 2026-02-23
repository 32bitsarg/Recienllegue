"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Search,
    Home,
    Utensils,
    ChevronRight,
    X,
    Loader2
} from "lucide-react";
import { globalSearch } from "@/app/actions/data";
import { motion, AnimatePresence } from "framer-motion";

const IconMap: Record<string, any> = {
    Home,
    Utensils,
    Heart: Utensils,
    GraduationCap: Home,
    Bus: Home,
    MessageSquare: Home
};

export default function DesktopBuscar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setLoading(true);
                const data = await globalSearch(query);
                setResults(data);
                setLoading(false);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const clearSearch = () => {
        setQuery("");
        setResults([]);
    };

    const trends = [
        { t: "Residencias cerca de UNNOBA", icon: "Home" },
        { t: "Hospedajes femeninos", icon: "Home" },
        { t: "Rotiserías abiertas", icon: "Utensils" },
        { t: "Hospital San José", icon: "Utensils" }
    ];

    return (
        <main style={{ padding: '2rem', maxWidth: 640, margin: '0 auto', minHeight: '100vh' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', textDecoration: 'none' }}>
                    ← Volver al inicio
                </Link>
                <div style={{
                    background: 'var(--surface)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center',
                    boxShadow: 'var(--shadow)'
                }}>
                    <Search size={20} style={{ color: query ? 'var(--primary)' : 'var(--text-muted)' }} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="¿Qué estás buscando en Pergamino?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            flex: 1,
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: 'var(--foreground)'
                        }}
                    />
                    {query && (
                        <button onClick={clearSearch} style={{ color: 'var(--text-muted)', display: 'flex', cursor: 'pointer', background: 'none', border: 'none' }}>
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}
                    >
                        <Loader2 size={36} className="spin" style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                        <p style={{ fontSize: '0.95rem' }}>Buscando...</p>
                    </motion.div>
                ) : query.length < 2 ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Tendencias en Pergamino</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {trends.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => setQuery(item.t)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        padding: '1.25rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--border)', textAlign: 'left', width: '100%',
                                        cursor: 'pointer',
                                        transition: 'box-shadow 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 'var(--radius-md)',
                                        background: 'rgba(99,102,241,0.1)', color: 'var(--primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {item.icon === "Home" ? <Home size={20} /> : <Utensils size={20} />}
                                    </div>
                                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>{item.t}</span>
                                    <ChevronRight size={18} style={{ marginLeft: 'auto', opacity: 0.3 }} />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : results.length > 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Se encontraron {results.length} resultados
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {results.map((res) => {
                                const Icon = IconMap[res.iconName] || Search;
                                return (
                                    <Link
                                        key={`${res.type}-${res.id}`}
                                        href={res.link}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                            padding: '1.25rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                                            border: '1px solid var(--border)', textDecoration: 'none', color: 'inherit',
                                            transition: 'box-shadow 0.2s', boxShadow: 'var(--shadow-sm)'
                                        }}
                                    >
                                        <div style={{
                                            width: 48, height: 48, borderRadius: 'var(--radius-md)',
                                            background: 'var(--background)', border: '1px solid var(--border)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--primary)', flexShrink: 0
                                        }}>
                                            <Icon size={22} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <span style={{
                                                fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase',
                                                padding: '2px 6px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)'
                                            }}>{res.type}</span>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.25rem' }}>{res.title}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{res.subtitle}</p>
                                        </div>
                                        <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}
                    >
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%', background: 'var(--surface)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                        }}>
                            <Search size={40} style={{ opacity: 0.2 }} />
                        </div>
                        <h3 style={{ color: 'var(--foreground)', marginBottom: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>No encontramos resultados</h3>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                            Probá buscando con otras palabras o revisá que no haya errores de ortografía.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
