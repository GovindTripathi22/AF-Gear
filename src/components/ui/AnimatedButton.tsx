"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import Link from "next/link";

interface AnimatedButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    animation?: "gloss" | "float" | "magnetic";
}

export function AnimatedButton({
    children,
    href,
    onClick,
    variant = "primary",
    className = "",
    type = "button",
    disabled = false,
    animation = "gloss"
}: AnimatedButtonProps) {
    const baseClasses = "relative overflow-hidden inline-flex items-center justify-center font-black uppercase tracking-widest text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-black shadow-[0_0_20px_rgba(102,187,106,0.2)] hover:shadow-[0_0_30px_rgba(102,187,106,0.4)] px-8 py-4",
        secondary: "bg-white text-black hover:bg-white/90 px-8 py-4",
        outline: "border border-white/20 text-white hover:border-primary hover:text-primary px-8 py-4",
        ghost: "text-white/80 hover:text-white hover:bg-white/5 px-6 py-3 rounded-lg"
    };

    const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;

    // Animation Types
    const motionProps = (() => {
        switch (animation) {
            case "float":
                return { whileHover: { y: -4 }, whileTap: { y: 2 } };
            case "magnetic":
                return { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } };
            case "gloss":
            default:
                return { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };
        }
    })();

    const content = (
        <>
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>

            {/* Gloss Effect Overlay */}
            {animation === "gloss" && !disabled && (
                <motion.div
                    initial={{ x: "-100%", opacity: 0 }}
                    whileHover={{ x: "100%", opacity: 0.5 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12"
                />
            )}

            {/* Primary Glow Effect */}
            {variant === "primary" && !disabled && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 z-0" />
            )}
        </>
    );

    if (href) {
        return (
            <Link href={href} className="block group">
                <motion.div
                    className={combinedClasses}
                    {...motionProps}
                >
                    {content}
                </motion.div>
            </Link>
        );
    }

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${combinedClasses} group`}
            {...motionProps}
        >
            {content}
        </motion.button>
    );
}
