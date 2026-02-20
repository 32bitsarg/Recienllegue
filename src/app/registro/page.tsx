"use client";

import { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";
import styles from "../login/Auth.module.css";

export default function RegisterPage() {
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
            const res = await registerUser({ name, username, email, password, confirmPassword });

            if (res.error) {
                setError(res.error);
            } else {
                // Auto login using identifier (username/email supported in lib/auth.ts)
                const authRes = await signIn("credentials", {
                    identifier: username,
                    password: password,
                    redirect: false,
                });

                if (authRes?.error) {
                    router.push("/login");
                } else {
                    router.push("/perfil");
                    router.refresh();
                }
            }
        } catch (err) {
            setError("Error al registrar el usuario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.containerCompact}>
            <header className={styles.headerSmall}>
                <Link href="/" className={styles.backButton}>✕</Link>
                <div className={styles.logoSmall}>
                    Recien<span>Llegue</span>
                </div>
            </header>

            <main className={styles.formSectionCompact}>
                <div className={styles.largeIconContainerSmall}>
                    <img src="/assets/icons/Iconrmbg.png" alt="Logo" className={styles.largeIconSmall} />
                </div>
                <h1 className={styles.titleSmall}>Crear cuenta</h1>

                {error && <div className={styles.errorBannerSmall}>{error}</div>}

                <form className={styles.formCompact} onSubmit={handleSubmit}>
                    <div className={styles.inputGroupSmall}>
                        <User size={18} className={styles.inputIcon} />
                        <input
                            type="text"
                            placeholder="Nombre completo"
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
                            placeholder="Email"
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

                    <p className={styles.termsCompact}>
                        Al registrarte aceptas los Términos y la Política.
                    </p>

                    <button className={styles.primaryButtonSmall} disabled={loading}>
                        {loading ? "Registrando..." : "Registrarme"} <ArrowRight size={18} />
                    </button>
                </form>
            </main>

            <footer className={styles.footerSmall}>
                ¿Ya tenés cuenta? <Link href="/login">Iniciá sesión</Link>
            </footer>
        </div>
    );
}
