import { useState, useRef, MouseEvent } from 'react';

export function useDragScroll<T extends HTMLElement>() {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const ref = useRef<T>(null);

    const handleMouseDown = (e: MouseEvent) => {
        if (!ref.current) return;
        setIsDragging(true);
        // Para no bloquear la selección de texto si el elemento no tiene el hook
        setStartX(e.pageX - ref.current.offsetLeft);
        setScrollLeft(ref.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !ref.current) return;
        e.preventDefault();
        const x = e.pageX - ref.current.offsetLeft;
        // Multiplicador de velocidad del arrastre
        const walk = (x - startX) * 1.5;
        ref.current.scrollLeft = scrollLeft - walk;
    };

    return {
        ref,
        onMouseDown: handleMouseDown,
        onMouseLeave: handleMouseLeave,
        onMouseUp: handleMouseUp,
        onMouseMove: handleMouseMove,
        style: {
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none' as const, // Prevents text selection while dragging
        }
    };
}
