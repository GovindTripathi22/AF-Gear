"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
    useEffect(() => {
        // Disable Lenis on touch devices so mobile/tablet users experience native, light, fluid scroll mechanics
        if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
            return;
        }

        const lenis = new Lenis({
            duration: 0.8, // Snappy duration for a light feel
            easing: (t) => 1 - Math.pow(1 - t, 4), // Quart ease-out for faster scroll responsiveness
            smoothWheel: true,
        });

        let frameId: number;
        function raf(time: number) {
            lenis.raf(time);
            frameId = requestAnimationFrame(raf);
        }
        frameId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(frameId);
            lenis.destroy();
        };
    }, []);

    return null;
}
