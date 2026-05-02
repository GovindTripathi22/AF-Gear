"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function PubJerseyHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-full py-20 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 border-y border-white/10 my-10 bg-primary/10 backdrop-blur-sm"
        >
            {/* Crest/Icon Image */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0">
                <Image
                    src="/assets/pub-jerseys/1000038099.png"
                    alt="Pub Jersey Icon"
                    fill
                    className="object-contain drop-shadow-[0_0_15px_rgba(102,187,106,0.3)]"
                />
            </div>

            {/* Text */}
            <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-6xl font-display font-bold text-white uppercase tracking-tight">
                    The Pub Jersey
                    <span className="block text-primary">Collection</span>
                </h2>
                <p className="mt-2 text-white/60 font-sans max-w-md">
                    The new craze. Custom designs for your local community and pub.
                </p>
            </div>
        </motion.div>
    );
}
