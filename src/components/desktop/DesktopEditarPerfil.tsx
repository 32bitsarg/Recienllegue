"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Save, User, MapPin, Calendar, Phone, FileText, RefreshCw } from "lucide-react";
import { updateProfile } from "@/app/actions/auth";
import UserAvatar from "@/components/common/UserAvatar";
import styles from "./DesktopEditarPerfil.module.css";

export default function DesktopEditarPerfil() {
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
            const res = await updateProfile((session.user as any).id, {
                name,
                bio,
                campus,
                gradYear: gradYear ? parseInt(gradYear) : undefined,
                phone,
                avatarSeed
            });
            if (res.error) setError(res.error);
            else {
                setSuccess(true);
                await update({
                    ...session,
                    user: {
                        ...session.user,
                        name,
                        bio,
                        campus,
                        gradYear: gradYear ? parseInt(gradYear) : undefined,
                        phone,
                        avatarSeed
                    }
                });
                setTimeout(() => router.push("/perfil"), 1500);
            }
        } catch {
            setError("Error al guardar los cambios");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Link href="/perfil" className={styles.backLink}>
                <ChevronLeft size={20} /> Volver a mi perfil
            </Link>

            <main className={styles.editCard}>
                <header className={styles.header}>
                    <h1>Editar Perfil</h1>
                    <p>Actualizá tu información personal para la comunidad.</p>
                </header>

                <div className={styles.avatarSection}>
                    <div className={styles.avatarContainer}>
                        <UserAvatar seed={avatarSeed} size={150} />
                        <button
                            type="button"
                            onClick={randomizeAvatar}
                            className={styles.randomizeBtn}
                            title="Cambiar avatar"
                        >
                            <RefreshCw size={24} />
                        </button>
                    </div>
                    <div className={styles.avatarInfo}>
                        <h3>Identidad Visual</h3>
                        <p>
                            Tu avatar se genera dinámicamente. Hacé clic en el icono para descubrir nuevas versiones.
                        </p>
                    </div>
                </div>

                <div className={styles.formArea}>
                    <form onSubmit={handleSubmit} className={styles.formGrid}>
                        {error && <div className={styles.errorMsg}>{error}</div>}
                        {success && <div className={styles.successMsg}>¡Perfil actualizado correctamente! Redirigiendo...</div>}

                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label className={styles.inputLabel}>
                                <User size={16} className={styles.inputIcon} /> Nombre completo
                            </label>
                            <input
                                type="text"
                                className={styles.inputField}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Juan Pérez"
                                required
                            />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label className={styles.inputLabel}>
                                <FileText size={16} className={styles.inputIcon} /> Biografía
                            </label>
                            <textarea
                                className={styles.textareaField}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Contanos sobre tus estudios o intereses..."
                            />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label className={styles.inputLabel}>
                                <MapPin size={16} className={styles.inputIcon} /> Sede / Facultad
                            </label>
                            <input
                                type="text"
                                className={styles.inputField}
                                value={campus}
                                onChange={(e) => setCampus(e.target.value)}
                                placeholder="Ej: Sede Monteagudo - Informática"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>
                                <Calendar size={16} className={styles.inputIcon} /> Año de Egreso
                            </label>
                            <input
                                type="number"
                                className={styles.inputField}
                                value={gradYear}
                                onChange={(e) => setGradYear(e.target.value)}
                                placeholder="2028"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>
                                <Phone size={16} className={styles.inputIcon} /> WhatsApp
                            </label>
                            <input
                                type="tel"
                                className={styles.inputField}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+54 2477 ..."
                            />
                        </div>

                        <div className={`${styles.actions} ${styles.fullWidth}`}>
                            <button
                                type="submit"
                                disabled={loading}
                                className={styles.saveBtn}
                            >
                                {loading ? "Guardando..." : "Guardar Cambios"}
                                <Save size={24} />
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
