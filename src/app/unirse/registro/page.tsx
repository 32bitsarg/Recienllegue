"use client";

import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Store, StoreIcon } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";
import styles from "../../login/Auth.module.css";

export default function CommerceRegisterPage() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        try {
            const res = await registerUser({
                name,
                username,
                email,
                password,
                confirmPassword,
                role: "DUENO"
            });

            if (res.error) {
                setError(res.error);
            } else {
                const authRes = await signIn("credentials", {
                    identifier: username,
                    password: password,
                    redirect: false,
                });

                if (authRes?.error) {
                    router.push("/login");
                } else {
                    router.push("/unirse");
                    router.refresh();
                }
            }
        } catch (err) {
            setError("Error al registrar el comercio");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.containerCompact}>
            <header className={styles.headerSmall}>
                <Link href="/" className={styles.backButton}>✕</Link>
                <div className={styles.logoSmall}>
                    Recien<span>Llegue</span> <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, marginLeft: '0.5rem' }}>| Comercios</span>
                </div>
            </header>

            <main className={styles.formContentWrapper}>
                <div className={styles.formSectionCompact}>
                    <div className={styles.largeIconContainerSmall}>
                        <div style={{ background: 'var(--primary)', padding: '1.5rem', borderRadius: '50%', color: 'white', marginBottom: '1rem' }}>
                            <Store size={40} />
                        </div>
                    </div>
                    <h1 className={styles.titleSmall}>Registrar mi Comercio</h1>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        Crea tu perfil de dueño para gestionar tus locales y destacar en la app.
                    </p>

                    {error && <div className={styles.errorBannerSmall}>{error}</div>}

                    <form className={styles.formCompact} onSubmit={handleSubmit}>
                        <div className={styles.inputGroupSmall}>
                            <User size={18} className={styles.inputIcon} />
                            <input
                                type="text"
                                placeholder="Tu Nombre y Apellido"
                                className={styles.inputSmall}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroupSmall}>
                            <User size={18} className={styles.inputIcon} />
                            <input
                                type="text"
                                placeholder="Nombre de usuario"
                                className={styles.inputSmall}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroupSmall}>
                            <Mail size={18} className={styles.inputIcon} />
                            <input
                                type="email"
                                placeholder="Email corporativo / personal"
                                className={styles.inputSmall}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroupSmall}>
                            <Lock size={18} className={styles.inputIcon} />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                className={styles.inputSmall}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroupSmall}>
                            <Lock size={18} className={styles.inputIcon} />
                            <input
                                type="password"
                                placeholder="Confirmar contraseña"
                                className={styles.inputSmall}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button className={styles.primaryButtonSmall} disabled={loading}>
                            {loading ? "Registrando..." : "Continuar a mi local"} <ArrowRight size={18} />
                        </button>
                    </form>
                </div>

                <footer className={styles.footerSmall}>
                    ¿Ya tenés cuenta de dueño? <Link href="/login">Iniciá sesión</Link>
                </footer>
            </main>
            <aside className={styles.logoPanel}>
                <div style={{ textAlign: 'center' }}>
                    <img src="/assets/icons/Iconrmbg.png" alt="RecienLlegué" style={{ width: '160px', marginBottom: '2rem', filter: 'drop-shadow(0 10px 25px rgba(99, 102, 241, 0.2))' }} />
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--foreground)' }}>Destaqué <span style={{ color: '#6366f1' }}>su negocio.</span></h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '1rem auto', lineHeight: 1.5 }}>
                        Únete a la red de comercios más grande de Pergamino y llega a miles de estudiantes y vecinos todos los días.
                    </p>
                </div>
            </aside>
        </div>
    );
}
