"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProductImageMagnifierProps {
    src: string;
    alt: string;
<<<<<<< HEAD
    className?: string;
    objectFit?: 'cover' | 'contain';
}

export function ProductImageMagnifier({ src, alt, className = "", objectFit = "cover" }: ProductImageMagnifierProps) {
    const [zoom, setZoom] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const isContain = objectFit === "contain";

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isContain) return; // No zoom for size charts
=======
    className?: string; // Allow passing className for aspect ratio etc
}

export function ProductImageMagnifier({ src, alt, className = "" }: ProductImageMagnifierProps) {
    const [zoom, setZoom] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
>>>>>>> target/main
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setPos({ x, y });
    };

    return (
        <div
<<<<<<< HEAD
            className={`relative overflow-hidden ${isContain ? 'cursor-default' : 'cursor-crosshair'} group ${className}`}
            onMouseEnter={() => !isContain && setZoom(true)}
=======
            className={`relative overflow-hidden cursor-crosshair group ${className}`}
            onMouseEnter={() => setZoom(true)}
>>>>>>> target/main
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
        >
            <motion.img
                src={src}
                alt={alt}
<<<<<<< HEAD
                className={`w-full h-full ${isContain ? 'object-contain p-4' : 'object-cover'}`}
=======
                className="w-full h-full object-cover"
>>>>>>> target/main
                style={{
                    transformOrigin: `${pos.x}% ${pos.y}%`,
                    transform: zoom ? 'scale(2.5)' : 'scale(1)',
                    transition: 'transform 0.1s ease-out'
                }}
            />
            {/* Optional Hint Overlay when NOT zoomed */}
<<<<<<< HEAD
            {!zoom && !isContain && (
=======
            {!zoom && (
>>>>>>> target/main
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="bg-black/60 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                        Hover to Zoom
                    </span>
                </div>
            )}
        </div>
    );
}
<<<<<<< HEAD

=======
>>>>>>> target/main
