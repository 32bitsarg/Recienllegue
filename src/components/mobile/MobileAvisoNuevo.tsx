"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import TopBar from "@/components/layout/TopBar";
import { ChevronLeft, Send, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createNotice } from "@/app/actions/data";
import styles from "@/app/avisos/nuevo/NuevoAviso.module.css";

export default function MobileAvisoNuevo() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("OTROS");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (status === "unauthenticated") {
        router.push("/login?callbackUrl=/avisos/nuevo");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user) return;
        setLoading(true);
        setError("");
        try {
            await createNotice({ title, description, category, authorId: (session.user as any).id });
            router.push("/avisos");
            router.refresh();
        } catch {
            setError("Hubo un error al publicar tu aviso. Intentá de nuevo.");
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
                        <Link href="/avisos" className={styles.backBtn}>
                            <ChevronLeft size={24} />
                        </Link>
                        <h1>Nuevo Aviso</h1>
                    </header>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        {error && (
                            <div className={styles.errorMsg}>
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}
                        <div className={styles.field}>
                            <label>Título del aviso</label>
                            <input type="text" placeholder="Ej: Busco compañero de depto" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={100} />
                        </div>
                        <div className={styles.field}>
                            <label>Categoría</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="VIVIENDA">Vivienda</option>
                                <option value="LIBROS">Libros y Apuntes</option>
                                <option value="EVENTOS">Eventos</option>
                                <option value="OTROS">Otros</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Descripción</label>
                            <textarea placeholder="Contanos más detalles..." value={description} onChange={(e) => setDescription(e.target.value)} required rows={6} />
                        </div>
                        <button className={styles.submitBtn} disabled={loading}>
                            {loading ? "Publicando..." : "Publicar Ahora"}
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
