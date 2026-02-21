"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProductImageMagnifierProps {
    src: string;
    alt: string;
    className?: string; // Allow passing className for aspect ratio etc
}

export function ProductImageMagnifier({ src, alt, className = "" }: ProductImageMagnifierProps) {
    const [zoom, setZoom] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setPos({ x, y });
    };

    return (
        <div
            className={`relative overflow-hidden cursor-crosshair group ${className}`}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
        >
            <motion.img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                style={{
                    transformOrigin: `${pos.x}% ${pos.y}%`,
                    transform: zoom ? 'scale(2.5)' : 'scale(1)',
                    transition: 'transform 0.1s ease-out'
                }}
            />
            {/* Optional Hint Overlay when NOT zoomed */}
            {!zoom && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="bg-black/60 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                        Hover to Zoom
                    </span>
                </div>
            )}
        </div>
    );
}
