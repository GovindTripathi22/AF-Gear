"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero({ heroContent }: { heroContent?: { title?: string; subtitle?: string } }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-background"
        >
            {/* Background Image */}
            <motion.div
                style={{ scale: bgScale }}
                className="absolute inset-0 z-0 bg-black"
            >
                <img
                    src="/assets/homepage-main-bg.jpg"
                    alt="AF GEAR Proud Gear Partners"
                    className="w-full h-full object-cover opacity-80 mix-blend-normal"
                />

                {/* Gradient Overlays — Lighter for better visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-background)_80%)]" />
            </motion.div>

            {/* Central Content */}
            <motion.div
                style={{ y: contentY }}
                className="relative z-10 text-center px-4 flex flex-col items-center"
            >
                {/* AF LOGO */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <img
                        src="/assets/af-logo.png"
                        alt="AF Gear Logo"
                        className="w-48 h-auto md:w-64 drop-shadow-[0_0_50px_var(--color-primary-glow)]"
                    />
                </motion.div>

                <div className="text-center mb-4">
                    {heroContent?.title && <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{heroContent.title}</h1>}
                    {heroContent?.subtitle && <p className="text-xl text-gray-300">{heroContent.subtitle}</p>}
                </div>

                <p className="mt-8 text-xs md:text-sm tracking-[0.5em] uppercase text-muted font-bold border-t border-white/20 pt-8">
                    Premium Teamwear. Made to Last.
                </p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-4 mt-16"
                >
                    <button className="px-10 py-3 bg-primary text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-sm">
                        Shop Collection
                    </button>
                    <button className="px-10 py-3 border border-white/30 text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors rounded-sm">
                        View Lookbook
                    </button>
                </motion.div>
            </motion.div>
        </section >
    );
}
