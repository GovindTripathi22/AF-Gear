"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export function LoadingScreen() {
  // Initialize from sessionStorage to avoid flash and lint issues
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("af-loaded");
    }
    return true;
  });

  useEffect(() => {
    if (!isVisible) return;

    // Faster timeout on mobile
    const isMobile = window.innerWidth < 768;
    const timeout = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("af-loaded", "1");
    }, isMobile ? 800 : 1500);

    return () => clearTimeout(timeout);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]"
        >
          <Image
            src="/assets/af-logo.png"
            alt="AF Gear"
            width={160}
            height={160}
            className="w-28 md:w-40 h-auto drop-shadow-[0_0_40px_rgba(102,187,106,0.4)]"
            priority
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
