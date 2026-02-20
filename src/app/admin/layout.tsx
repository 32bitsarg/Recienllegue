"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TopBar from "@/components/layout/TopBar";
import styles from "./Admin.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/admin");
        } else if (status === "authenticated" && (session?.user as any).role !== "ADMIN") {
            router.push("/");
        }
    }, [status, session, router]);

    if (status === "loading") {
        return (
            <main>
                <TopBar />
                <div className={styles.loading}>Verificando credenciales de Admin...</div>
            </main>
        );
    }

    if (!session || (session.user as any).role !== "ADMIN") {
        return (
            <main>
                <TopBar />
                <div className={styles.denied}>
                    <h2>Acceso Denegado</h2>
                    <p>No tenés permisos para ver esta sección.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="safe-bottom">
            <TopBar />
            {children}
        </main>
    );
}
