"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, FileText, MessageCircle, Plus } from "lucide-react";
import { getUserNotices } from "@/app/actions/data";
import { useSession } from "next-auth/react";

export interface MisAvisosInitialData {
    notices: any[];
}

interface DesktopMisAvisosProps {
    initialData?: MisAvisosInitialData | null;
}

export default function DesktopMisAvisos({ initialData }: DesktopMisAvisosProps) {
    const { data: session, status } = useSession();
    const [notices, setNotices] = useState(initialData?.notices ?? []);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (initialData) return;
        if (session?.user) getUserNotices((session.user as any).id).then(setNotices);
        setLoading(false);
    }, [session?.user, initialData]);

    if (status === "loading" || loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Cargando...</div>;

    return (
        <main style={{ padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
            <Link href="/perfil" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--foreground)', textDecoration: 'none' }}>
                <ChevronLeft size={20} /> Volver al perfil
            </Link>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Mis Publicaciones</h1>
            {notices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    <FileText size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <h3 style={{ marginBottom: '0.5rem' }}>No tenés avisos</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Publicá algo para la comunidad.</p>
                    <Link href="/avisos/nuevo" style={{ color: 'var(--primary)', fontWeight: 700 }}><Plus size={18} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} /> Crear Aviso</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {notices.map((notice) => (
                        <Link key={notice.id} href={`/avisos/${notice.id}`} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: 'rgba(99,102,241,0.1)', padding: '0.2rem 0.5rem', borderRadius: 4 }}>{notice.category}</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(notice.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 style={{ marginBottom: '0.25rem' }}>{notice.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{notice.description}</p>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><MessageCircle size={14} style={{ verticalAlign: 'middle' }} /> {notice._count?.comments ?? 0} comentarios</span>
                        </Link>
                    ))}
                    <Link href="/avisos/nuevo" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 700, textDecoration: 'none', marginTop: '0.5rem' }}>
                        <Plus size={18} /> Publicar otro aviso
                    </Link>
                </div>
            )}
        </main>
    );
}
