"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
<<<<<<< HEAD
import Image from "next/image";
=======
>>>>>>> target/main

export function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsVisible(false), 300);
                    return 100;
                }
                const increment = prev < 40 ? 8 : prev < 70 ? 10 : 15;
                return Math.min(prev + increment, 100);
            });
        }, 30);

<<<<<<< HEAD
        // Failsafe: Hide loading screen after 3 seconds no matter what
        const failsafe = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(failsafe);
        };
=======
        return () => clearInterval(interval);
>>>>>>> target/main
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    exit={{ opacity: 0 }}
<<<<<<< HEAD
                    transition={{ duration: 0.3, ease: "easeOut" }}
=======
                    transition={{ duration: 0.4, ease: "easeOut" }}
>>>>>>> target/main
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505]"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
<<<<<<< HEAD
                        transition={{ duration: 0.2 }}
                        className="mb-6 flex flex-col items-center"
                    >
                        <Image
                            src="/assets/af-logo.png"
                            alt="AF Gear"
                            width={224}
                            height={224}
                            className="w-40 md:w-56 h-auto drop-shadow-[0_0_40px_rgba(102,187,106,0.4)]"
                            priority
=======
                        transition={{ duration: 0.3 }}
                        className="mb-6 flex flex-col items-center"
                    >
                        <img
                            src="/assets/af-logo.png"
                            alt="AF Gear"
                            className="w-40 md:w-56 h-auto drop-shadow-[0_0_40px_rgba(102,187,106,0.4)]"
>>>>>>> target/main
                        />
                    </motion.div>

                    <div className="w-56 md:w-72 relative">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[#66BB6A] to-[#81C784] rounded-full shadow-[0_0_20px_rgba(102,187,106,0.5)]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.08, ease: "linear" }}
                            />
                        </div>
                        <motion.p
                            className="text-center text-white/30 text-[10px] font-bold tracking-[0.3em] uppercase mt-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
<<<<<<< HEAD
                            transition={{ delay: 0.1 }}
=======
                            transition={{ delay: 0.2 }}
>>>>>>> target/main
                        >
                            {progress < 100 ? "Loading..." : "Welcome"}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
