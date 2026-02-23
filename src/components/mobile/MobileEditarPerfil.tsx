"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TopBar from "@/components/layout/TopBar";
import { ChevronLeft, Save, User, MapPin, Calendar, Phone, FileText, RefreshCw } from "lucide-react";
import Link from "next/link";
import { updateProfile } from "@/app/actions/auth";
import UserAvatar from "@/components/common/UserAvatar";
import styles from "@/app/perfil/editar/EditarPerfil.module.css";

export default function MobileEditarPerfil() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [campus, setCampus] = useState("");
    const [gradYear, setGradYear] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarSeed, setAvatarSeed] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
            setBio((session.user as any).bio || "");
            setCampus((session.user as any).campus || "");
            setGradYear((session.user as any).gradYear?.toString() || "");
            setPhone((session.user as any).phone || "");
            setAvatarSeed((session.user as any).avatarSeed || session.user.email || "default");
        }
    }, [session]);

    const randomizeAvatar = () => setAvatarSeed(Math.random().toString(36).substring(7));

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user) return;
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            const res = await updateProfile((session.user as any).id, { name, bio, campus, gradYear: gradYear ? parseInt(gradYear) : undefined, phone, avatarSeed });
            if (res.error) setError(res.error);
            else {
                setSuccess(true);
                await update({ ...session, user: { ...session.user, name, bio, campus, gradYear: gradYear ? parseInt(gradYear) : undefined, phone, avatarSeed } });
                setTimeout(() => router.push("/perfil"), 1500);
            }
        } catch {
            setError("Error al guardar los cambios");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <main className="safe-bottom">
                <TopBar />
                <div className={styles.container}>
                    <header className={styles.header}>
                        <Link href="/perfil" className={styles.backBtn}><ChevronLeft size={24} /></Link>
                        <h1>Editar Perfil</h1>
                    </header>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarWrapper}>
                            <UserAvatar seed={avatarSeed} size={100} className={styles.avatarMain} />
                            <button type="button" className={styles.refreshBtn} onClick={randomizeAvatar} title="Generar otro avatar">
                                <RefreshCw size={20} />
                            </button>
                        </div>
                        <p className={styles.avatarNote}>Tu avatar se genera automáticamente. <br /> <span>Hacé clic en el icono para cambiarlo.</span></p>
                    </div>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        {error && <div className={styles.errorMsg}>{error}</div>}
                        {success && <div className={styles.successMsg}>¡Perfil actualizado con éxito!</div>}
                        <div className={styles.field}>
                            <label><User size={16} /> Nombre completo</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
                        </div>
                        <div className={styles.field}>
                            <label><FileText size={16} /> Biografía</label>
                            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Contanos un poco sobre vos..." rows={4} />
                        </div>
                        <div className={styles.field}>
                            <label><MapPin size={16} /> Sede / Facultad</label>
                            <input type="text" value={campus} onChange={(e) => setCampus(e.target.value)} placeholder="Ej: Sede Monteagudo - Informática" />
                        </div>
                        <div className={styles.gridFields}>
                            <div className={styles.field}>
                                <label><Calendar size={16} /> Año de egreso</label>
                                <input type="number" value={gradYear} onChange={(e) => setGradYear(e.target.value)} placeholder="Ej: 2028" />
                            </div>
                            <div className={styles.field}>
                                <label><Phone size={16} /> Whatsapp</label>
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+54 2477 ..." />
                            </div>
                        </div>
                        <button className={styles.saveBtn} disabled={loading}>
                            {loading ? "Guardando..." : "Guardar Cambios"}
                            <Save size={18} />
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
