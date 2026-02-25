"use client";

import { useState } from "react";
import { User, Lock, ArrowRight, Github, Store } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "../../login/Auth.module.css";

export default function CommerceLoginPage() {
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
                router.push("/unirse");
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
                    Recien<span>Llegue</span> <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, marginLeft: '0.5rem' }}>| Comercios</span>
                </div>
            </header>

            <main className={styles.formContentWrapper}>
                <div className={styles.formSection}>
                    <div className={styles.largeIconContainer}>
                        <div style={{ background: 'var(--primary)', padding: '1.5rem', borderRadius: '50%', color: 'white', marginBottom: '1rem' }}>
                            <Store size={40} />
                        </div>
                    </div>
                    <h1 className={styles.title}>Panel de Comercios</h1>
                    <p className={styles.subtitle} style={{ textAlign: 'center' }}>Iniciá sesión para gestionar tu local y ver tus estadísticas.</p>

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
                            {loading ? "Ingresando..." : "Ingresar al Panel"} <ArrowRight size={20} />
                        </button>
                    </form>
                </div>

                <footer className={styles.footer}>
                    ¿No tenés cuenta de dueño? <Link href="/unirse/registro">Registrá tu comercio</Link>
                </footer>
            </main>
            <aside className={styles.logoPanel}>
                <div style={{ textAlign: 'center' }}>
                    <img src="/assets/icons/Iconrmbg.png" alt="RecienLlegué" style={{ width: '180px', marginBottom: '2rem', filter: 'drop-shadow(0 10px 25px rgba(99, 102, 241, 0.2))' }} />
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--foreground)' }}>Tu negocio, <br /><span style={{ color: '#6366f1' }}>al siguiente nivel.</span></h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '1rem auto', lineHeight: 1.5 }}>
                        Gestiona tu presencia, responde a clientes y destaca promociones especiales desde tu panel.
                    </p>
                </div>
            </aside>
        </div>
    );
}
