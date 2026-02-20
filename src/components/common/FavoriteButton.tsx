"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { toggleFavorite } from "@/app/actions/data";
import { useRouter } from "next/navigation";
import styles from "./FavoriteButton.module.css";

interface FavoriteButtonProps {
    itemId: string;
    type: 'property' | 'restaurant';
    initialIsSaved?: boolean;
    className?: string;
}

export default function FavoriteButton({ itemId, type, initialIsSaved = false, className = "" }: FavoriteButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [loading, setLoading] = useState(false);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            router.push(`/login?callbackUrl=${window.location.pathname}`);
            return;
        }

        setLoading(true);
        // Optimistic update
        setIsSaved(!isSaved);

        try {
            const result = await toggleFavorite((session.user as any).id, itemId, type);
            if (result.error) {
                // Rollback if error
                setIsSaved(isSaved);
                alert(result.error);
            } else if (result.saved !== undefined) {
                setIsSaved(result.saved);
            }
        } catch (error) {
            setIsSaved(isSaved);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`${styles.favoriteBtn} ${isSaved ? styles.active : ""} ${loading ? styles.loading : ""} ${styles['pos_' + type]} ${className}`}
            onClick={handleToggle}
            disabled={loading}
            aria-label={isSaved ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
            <Heart
                size={18}
                className={styles.icon}
                fill={isSaved ? "currentColor" : "none"}
            />
        </button>
    );
}
