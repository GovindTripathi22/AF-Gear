"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsVisible(false), 600);
                    return 100;
                }
                // Accelerate towards the end
                const increment = prev < 60 ? 2 : prev < 85 ? 3 : 5;
                return Math.min(prev + increment, 100);
            });
        }, 40);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505]"
                >
                    {/* AF Text — Reveals with the progress bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 flex flex-col items-center"
                    >
                        <img
                            src="/assets/af-logo.png"
                            alt="AF Gear"
                            className="w-48 md:w-64 h-auto drop-shadow-[0_0_40px_rgba(102,187,106,0.4)]"
                            style={{ filter: "brightness(0) invert(1)" }}
                        />
                    </motion.div>

                    {/* Progress Bar */}
                    <div className="w-64 md:w-80 relative">
                        {/* Track */}
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            {/* Fill */}
                            <motion.div
                                className="h-full bg-gradient-to-r from-[#66BB6A] to-[#81C784] rounded-full shadow-[0_0_20px_rgba(102,187,106,0.5)]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1, ease: "linear" }}
                            />
                        </div>

                        {/* Percentage */}
                        <motion.p
                            className="text-center text-white/40 text-xs font-bold tracking-[0.3em] uppercase mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {progress < 100 ? "Loading Experience..." : "Welcome"}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
