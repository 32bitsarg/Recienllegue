"use client";

import { useState, useEffect, useRef } from "react";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import {
    Search, Home, Utensils, Heart, GraduationCap,
    Bus, MessageSquare, ChevronRight, X, Loader2, ArrowLeft
} from "lucide-react";
import { globalSearch } from "@/app/actions/data";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const IconMap: Record<string, any> = {
    Home,
    Utensils,
    Heart,
    GraduationCap,
    Bus,
    MessageSquare
};

export default function SearchPage() {
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

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const clearSearch = () => {
        setQuery("");
        setResults([]);
    };

    return (
        <main className="safe-bottom" style={{ background: 'var(--background)', minHeight: '100vh' }}>
            <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--background)' }}>
                <div style={{ padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/" style={{ color: 'var(--foreground)', padding: '0.25rem' }}>
                        <ArrowLeft size={22} />
                    </Link>
                    <div style={{
                        flex: 1,
                        background: 'var(--surface)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}>
                        <Search size={18} style={{ color: query ? 'var(--primary)' : 'var(--text-muted)' }} />
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
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: 'var(--foreground)'
                            }}
                        />
                        {query && (
                            <button onClick={clearSearch} style={{ color: 'var(--text-muted)', display: 'flex' }}>
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 1rem 2rem' }}>
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}
                        >
                            <Loader2 size={32} className="spin" style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                            <p style={{ fontSize: '0.9rem' }}>Buscando lo mejor para vos...</p>
                        </motion.div>
                    ) : query.length < 2 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            style={{ padding: '2rem 1rem' }}
                        >
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Tendencias en Pergamino</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { t: "Residencias cerca de UNNOBA", icon: "Home" },
                                    { t: "Hospedajes femeninos", icon: "Home" },
                                    { t: "Rotiserías abiertas", icon: "Utensils" },
                                    { t: "Hospital San José", icon: "Heart" }
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setQuery(item.t)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                                            border: '1px solid var(--border)', textAlign: 'left', width: '100%'
                                        }}
                                    >
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '8px',
                                            background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {item.icon === "Home" ? <Home size={16} /> : <Utensils size={16} />}
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.t}</span>
                                        <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.3 }} />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : results.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                        >
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '1rem 0 0.5rem 0.5rem' }}>
                                Se encontraron {results.length} resultados
                            </p>
                            {results.map((res) => {
                                const Icon = IconMap[res.iconName] || Search;
                                return (
                                    <Link
                                        key={`${res.type}-${res.id}`}
                                        href={res.link}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                            padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                                            border: '1px solid var(--border)', transition: 'transform 0.2s',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                        }}
                                    >
                                        <div style={{
                                            width: '44px', height: '44px', borderRadius: '12px',
                                            background: 'var(--background)', border: '1px solid var(--border)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--primary)', flexShrink: 0
                                        }}>
                                            <Icon size={20} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.2rem' }}>
                                                <span style={{
                                                    fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase',
                                                    padding: '2px 6px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: '#6366f1'
                                                }}>{res.type}</span>
                                            </div>
                                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {res.title}
                                            </h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {res.subtitle}
                                            </p>
                                        </div>
                                        <ChevronRight size={18} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                                    </Link>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ textAlign: 'center', padding: '5rem 1.5rem', color: 'var(--text-muted)' }}
                        >
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%', background: 'var(--surface)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                            }}>
                                <Search size={32} style={{ opacity: 0.2 }} />
                            </div>
                            <h3 style={{ color: 'var(--foreground)', marginBottom: '0.5rem', fontWeight: 700 }}>No encontramos resultados</h3>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                                Probá buscando con otras palabras o revisá que no haya errores de ortografía.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <BottomNav />
        </main>
    );
}
