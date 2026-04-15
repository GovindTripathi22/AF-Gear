"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatedButton } from "./AnimatedButton";
import Image from "next/image";

interface HeroContent {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

export function Hero({ heroContent }: { heroContent?: HeroContent }) {
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
                className="absolute inset-0 z-0 bg-transparent"
            >
                {(() => {
                    const backgroundSrc = heroContent?.backgroundImage || "/assets/logo-hero.png";
                    const isExternal = backgroundSrc.startsWith("http");

                    return isExternal ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={backgroundSrc}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover object-top"
                        />
                    ) : (
                        <Image
                            src={backgroundSrc}
                            alt="AF GEAR Proud Gear Partners"
                            fill
                            sizes="100vw"
                            className="object-cover object-top"
                            priority
                            quality={75}
                        />
                    );
                })()}
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70 z-[1]" />
            </motion.div>

            {/* Central Content */}
            <motion.div
                style={{ y: contentY }}
                className="relative z-10 text-center px-4 sm:px-6 flex flex-col items-center pt-20 sm:pt-24 md:pt-0"
            >
                {/* AF LOGO */}
                <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-5 sm:mb-6 md:mb-8"
                >
                    <Image
                        src="/assets/af-logo.png"
                        alt="AF Gear Logo"
                        width={256}
                        height={256}
                        className="w-32 sm:w-40 md:w-64 h-auto drop-shadow-[0_0_50px_var(--color-primary-glow)]"
                        priority
                    />
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
                    <AnimatedButton href={heroContent?.ctaLink || "/#shop"} variant="primary" animation="gloss" className="w-full sm:w-auto justify-center min-h-[48px]">
                        {heroContent?.ctaText || "Shop Collection"} <ArrowRight className="w-4 h-4 ml-2" />
                    </AnimatedButton>
                    <AnimatedButton href="/#lookbook" variant="outline" animation="magnetic" className="w-full sm:w-auto justify-center min-h-[48px]">
                        View Lookbook
                    </AnimatedButton>
                </motion.div>
            </motion.div>
        </section>
    );
}
