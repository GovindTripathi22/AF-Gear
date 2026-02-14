"use client";

import { motion } from "framer-motion";

export function AnnouncementBar() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-black border-b border-white/10 text-center py-2 relative z-50"
        >
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                Free Shipping on Orders Over €100 — <span className="text-primary">AF Gear</span> Premium Teamwear
            </p>
        </motion.div>
    );
}
