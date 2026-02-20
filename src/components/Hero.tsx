"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
            className="relative min-h-[60vh] md:min-h-screen w-full overflow-hidden flex items-center justify-center bg-background"
        >
            {/* Background Image Container */}
            <motion.div
                style={{ scale: bgScale }}
                className="absolute inset-0 z-0 bg-transparent"
            >
                <img
                    src="/assets/homepage-hero.png"
                    alt="AF GEAR Proud Gear Partners"
                    className="absolute inset-0 w-full h-full object-cover object-center z-0"
                    loading="eager"
                />
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
                    className="flex flex-col sm:flex-row gap-4 mt-16"
                >
                    <Link href="/#shop" className="group relative overflow-hidden px-10 py-3 bg-primary text-black font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all duration-300 rounded-sm text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(102,187,106,0.2)] hover:shadow-[0_0_30px_rgba(102,187,106,0.6)]">
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-black">Shop Collection</span>
                        <ArrowRight className="w-4 h-4 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 relative z-10" />
                        {/* Shine effect */}
                        <div className="absolute inset-0 w-[200%] -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/60 to-transparent z-0 skew-x-12" />
                    </Link>
                    <Link href="/#lookbook" className="group relative overflow-hidden px-10 py-3 border border-white/30 text-white font-bold uppercase tracking-widest text-sm hover:border-white hover:scale-[1.03] transition-all duration-300 rounded-sm text-center block">
                        <span className="relative z-10 group-hover:text-black transition-colors duration-300">View Lookbook</span>
                        {/* Fill effect from bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-0 bg-white group-hover:h-full transition-all duration-300 ease-out z-0" />
                    </Link>
                </motion.div>
            </motion.div>
        </section >
    );
}
