"use client";

import { motion } from "framer-motion";

interface CollectionHeaderProps {
    title: string;
    subtitle: string;
    crestImage?: string;
}

export function CollectionHeader({ title, subtitle, crestImage }: CollectionHeaderProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
            <div className="flex items-center gap-6 md:gap-8 mb-4">
                {/* Crest Image */}
                {crestImage && (
                    <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center p-3 rounded-2xl bg-primary-soft border-2 border-primary shadow-[0_0_30px_var(--color-primary-glow)]">
                        <img
                            src={crestImage}
                            alt={`${title} Crest`}
                            className="w-full h-full object-contain relative z-10"
                        />
                    </div>
                )}

                {/* Title */}
                <h2 className="text-4xl md:text-6xl font-display font-black text-foreground italic tracking-tighter uppercase relative z-10">
                    <span className="relative">
                        {title}
                        <span className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-2 md:h-3 skew-x-[-12deg] bg-primary/20 origin-left -z-10" />
                    </span>
                </h2>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 text-primary"
            >
                <div className="h-[1px] w-8 md:w-16 bg-primary/50" />
                <p className="font-sans font-medium text-xs md:text-sm tracking-[0.3em] uppercase">
                    {subtitle}
                </p>
                <div className="h-[1px] w-8 md:w-16 bg-primary/50" />
            </motion.div>
        </div>
    );
}
