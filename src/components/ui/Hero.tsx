"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatedButton } from "./AnimatedButton";
import Image from "next/image";

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
            className="relative min-h-[55vh] sm:min-h-[60vh] md:min-h-screen w-full overflow-hidden flex items-center justify-center bg-background"
        >
            {/* Background Image Container */}
            <motion.div
                style={{ scale: bgScale }}
                className="absolute inset-0 z-0 bg-background"
            >
                <Image
                    src="/assets/premium-bg.png"
                    alt="Premium Sports Background"
                    fill
                    sizes="100vw"
                    className="object-cover opacity-60"
                    priority
                    quality={90}
                />
                {/* Dramatic cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background z-[1]" />
                <div className="absolute inset-0 bg-black/30 z-[1]" />
            </motion.div>

            {/* Central Content */}
            <motion.div
                style={{ y: contentY }}
                className="relative z-10 text-center px-4 sm:px-6 flex flex-col items-center pt-20 sm:pt-24 md:pt-0"
            >
                {/* AF GEAR LOGO */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="mb-5 sm:mb-6 md:mb-8 relative"
                >
                    <Image
                        src="/assets/af-gear-bg.jpg"
                        alt="AF Gear Logo"
                        width={600}
                        height={300}
                        className="w-48 sm:w-64 md:w-[500px] h-auto drop-shadow-[0_0_30px_rgba(102,187,106,0.4)]"
                        style={{ filter: "invert(1) hue-rotate(180deg) brightness(1.1) contrast(1.1)" }}
                        priority
                    />
                    {/* Subtle glow behind logo */}
                    <div className="absolute inset-0 bg-primary/20 blur-[60px] -z-10 rounded-full" />
                </motion.div>

                <div className="text-center mb-3 sm:mb-4">
                    {heroContent?.title && <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2">{heroContent.title}</h1>}
                    {heroContent?.subtitle && <p className="text-base sm:text-lg md:text-xl text-gray-300">{heroContent.subtitle}</p>}
                </div>

                <p className="mt-6 sm:mt-8 text-[10px] sm:text-xs md:text-sm tracking-[0.3em] sm:tracking-[0.5em] uppercase text-muted font-bold border-t border-white/20 pt-6 sm:pt-8">
                    Premium Teamwear. Made to Last.
                </p>

                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-12 md:mt-16 w-full sm:w-auto px-2 sm:px-0"
                >
                    <AnimatedButton href="/#shop" variant="primary" animation="gloss" className="w-full sm:w-auto justify-center min-h-[48px]">
                        Shop Collection <ArrowRight className="w-4 h-4 ml-2" />
                    </AnimatedButton>
                    <AnimatedButton href="/#lookbook" variant="outline" animation="magnetic" className="w-full sm:w-auto justify-center min-h-[48px]">
                        View Lookbook
                    </AnimatedButton>
                </motion.div>
            </motion.div>
        </section>
    );
}
