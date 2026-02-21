"use client";

import { motion } from "framer-motion";

export function LimerickHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-full py-20 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 border-y border-white/10 my-10 bg-forest/30 backdrop-blur-sm"
        >
            {/* Crest Image */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0">
                <img
                    src="/assets/crest.png"
                    alt="Limerick Crest"
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,187,109,0.3)]"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.classList.add('bg-white/5', 'rounded-full', 'border', 'border-white/10', 'flex', 'items-center', 'justify-center');
                        e.currentTarget.parentElement!.innerHTML += '<span class="text-xs text-center text-white/50">Add crest.png</span>';
                    }}
                />
            </div>

            {/* Text */}
            <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-6xl font-display font-bold text-white uppercase tracking-tight">
                    The Limerick
                    <span className="block text-primary">Collection</span>
                </h2>
                <p className="mt-2 text-white/60 font-sans max-w-md">
                    Honor the heritage. Elite performance gear for the dedicated.
                </p>
            </div>
        </motion.div>
    );
}
