"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getAdminUsers, updateUserStatus, updateUserRoleById } from "@/app/actions/data";
import {
    ChevronLeft, User, Shield, ShieldAlert, ShieldCheck,
    Ban, CheckCircle, Search, Mail, Calendar, Hash
} from "lucide-react";
import Link from "next/link";
import styles from "../AdminForm.module.css";

const ROLE_OPTIONS = ["ESTUDIANTE", "DUENO", "ADMIN"];

export default function AdminUsuariosPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const loadUsers = async () => {
        setLoading(true);
        const data = await getAdminUsers();
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => { loadUsers(); }, []);

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        if (!confirm(`¿${currentStatus ? 'Bloquear' : 'Desbloquear'} a este usuario?`)) return;
        try {
            await updateUserStatus(userId, !currentStatus);
            await loadUsers();
        } catch { alert("Error al actualizar estado"); }
    };

    const handleRoleChange = async (userId: string, newRole: any) => {
        try {
            await updateUserRoleById(userId, newRole);
            await loadUsers();
        } catch { alert("Error al cambiar rol"); }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/admin" className={styles.backBtn}><ChevronLeft size={24} /></Link>
                <h1>Gestión de Usuarios</h1>
            </header>

            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div className={styles.field} style={{ flex: 1, marginBottom: 0 }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            style={{ paddingLeft: '40px' }}
                            placeholder="Buscar por nombre, email o username..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando usuarios...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredUsers.map(u => (
                        <div key={u.id} style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            opacity: u.active ? 1 : 0.6
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '50%',
                                        background: 'var(--primary)', color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.25rem', fontWeight: 700,
                                        overflow: 'hidden'
                                    }}>
                                        {u.image ? <img src={u.image} alt={u.name} /> : (u.name?.[0] || 'U')}
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{u.name || 'Sin nombre'}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Mail size={12} /> {u.email}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Hash size={12} /> @{u.username || 'sin_username'}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px',
                                        background: u.role === 'ADMIN' ? 'rgba(244,63,94,0.1)' : u.role === 'DUENO' ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)',
                                        color: u.role === 'ADMIN' ? '#f43f5e' : u.role === 'DUENO' ? '#6366f1' : '#10b981',
                                        display: 'inline-block', marginBottom: '0.5rem'
                                    }}>
                                        {u.role}
                                    </span>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Unido: {new Date(u.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Hospedajes</p>
                                    <p style={{ fontWeight: 700 }}>{u._count.properties}</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Avisos</p>
                                    <p style={{ fontWeight: 700 }}>{u._count.notices}</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Comentarios</p>
                                    <p style={{ fontWeight: 700 }}>{u._count.comments}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1 }}>
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', fontSize: '0.85rem' }}
                                    >
                                        {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <button
                                    onClick={() => handleToggleStatus(u.id, u.active)}
                                    style={{
                                        flex: 1, padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600,
                                        background: u.active ? 'rgba(244,63,94,0.05)' : 'rgba(16,185,129,0.05)',
                                        color: u.active ? '#f43f5e' : '#10b981',
                                        border: `1px solid ${u.active ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                    }}
                                >
                                    {u.active ? <><Ban size={14} /> Bloquear</> : <><CheckCircle size={14} /> Activar</>}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
