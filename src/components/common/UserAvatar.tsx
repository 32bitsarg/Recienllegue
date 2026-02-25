"use client";

import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { useMemo } from 'react';
import { Store, ShieldCheck } from 'lucide-react';

interface UserAvatarProps {
    seed: string;
    size?: number;
    className?: string;
    role?: string; // "ESTUDIANTE" | "DUENO" | "ADMIN"
}

export default function UserAvatar({ seed, size = 40, className = "", role }: UserAvatarProps) {
    const isDueno = role === 'DUENO';
    const isAdmin = role === 'ADMIN';

    const avatarSvg = useMemo(() => {
        return createAvatar(lorelei, {
            seed: seed,
            size: size,
        }).toString();
    }, [seed, size]);

    return (
        <div
            className={className}
            style={{
                width: size,
                height: size,
                position: 'relative',
                flexShrink: 0,
                display: 'inline-block'
            }}
        >
            {/* Avatar base — siempre el mismo estilo */}
            <div
                style={{
                    width: size,
                    height: size,
                    borderRadius: isDueno ? '30%' : '50%', // cuadrado redondeado para dueños
                    overflow: 'hidden',
                    border: isDueno
                        ? '2px solid #6366f1'
                        : isAdmin
                            ? '2px solid #f59e0b'
                            : 'none',
                    boxSizing: 'border-box'
                }}
                dangerouslySetInnerHTML={{ __html: avatarSvg }}
            />

            {/* Badge de dueño — ícono de tienda en la esquina */}
            {isDueno && (
                <div style={{
                    position: 'absolute',
                    bottom: -3,
                    right: -3,
                    width: Math.max(14, size * 0.36),
                    height: Math.max(14, size * 0.36),
                    background: '#6366f1',
                    borderRadius: '50%',
                    border: `2px solid white`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                }}>
                    <Store size={Math.max(7, size * 0.18)} color="white" />
                </div>
            )}

            {/* Badge de admin */}
            {isAdmin && (
                <div style={{
                    position: 'absolute',
                    bottom: -3,
                    right: -3,
                    width: Math.max(14, size * 0.36),
                    height: Math.max(14, size * 0.36),
                    background: '#f59e0b',
                    borderRadius: '50%',
                    border: `2px solid white`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                }}>
                    <ShieldCheck size={Math.max(7, size * 0.18)} color="white" />
                </div>
            )}
        </div>
    );
}
