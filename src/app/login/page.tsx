"use client";

import { useState } from "react";
import { User, Lock, ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./Auth.module.css";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                identifier,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Usuario/Email o contraseña incorrectos");
            } else {
                router.push("/perfil");
                router.refresh();
            }
        } catch (err) {
            setError("Ocurrió un error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/" className={styles.backButton}>✕</Link>
                <div className={styles.logo}>
                    Recien<span>Llegue</span>
                </div>
            </header>

            <main className={styles.formSection}>
                <div className={styles.largeIconContainer}>
                    <img src="/assets/icons/Iconrmbg.png" alt="Logo" className={styles.largeIcon} />
                </div>
                <h1 className={styles.title}>¡Hola de nuevo!</h1>
                <p className={styles.subtitle}>Iniciá sesión para guardar tus lugares favoritos y publicar avisos.</p>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <User size={20} className={styles.inputIcon} />
                        <input
                            type="text"
                            placeholder="Email o Nombre de usuario"
                            className={styles.input}
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <Lock size={20} className={styles.inputIcon} />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className={styles.primaryButton} disabled={loading}>
                        {loading ? "Ingresando..." : "Ingresar"} <ArrowRight size={20} />
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>o continuar con</span>
                </div>

                <div className={styles.socialGrid}>
                    <button className={styles.socialButton} onClick={() => signIn("github")}>
                        <Github size={20} /> GitHub
                    </button>
                    <button className={styles.socialButton} onClick={() => signIn("google")}>
                        Google
                    </button>
                </div>
            </main>

            <footer className={styles.footer}>
                ¿No tenés cuenta? <Link href="/registro">Registrate</Link>
            </footer>
        </div>
    );
}
