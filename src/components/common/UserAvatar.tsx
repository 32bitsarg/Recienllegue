"use client";

import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { useMemo } from 'react';

interface UserAvatarProps {
    seed: string;
    size?: number;
    className?: string;
}

export default function UserAvatar({ seed, size = 40, className = "" }: UserAvatarProps) {
    const avatarSvg = useMemo(() => {
        return createAvatar(lorelei, {
            seed: seed,
            size: size,
            // You can add more customization here
        }).toString();
    }, [seed, size]);

    return (
        <div
            className={className}
            style={{ width: size, height: size }}
            dangerouslySetInnerHTML={{ __html: avatarSvg }}
        />
    );
}
