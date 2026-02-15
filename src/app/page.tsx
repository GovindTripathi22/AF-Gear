"use client";

import { useEffect } from "react";
import { Hero } from "@/components/Hero";
import { CollectionsShowcase } from "@/components/CollectionsShowcase";
import { SchoolUniformSection } from "@/components/SchoolUniform/SchoolUniformSection";
import { ProductGrid } from "@/components/ProductGrid";
import { Dock } from "@/components/Dock";
import { Footer } from "@/components/Footer";
import { NewsletterSection } from "@/components/NewsletterSection";
import { KitBuilderSection } from "@/components/KitBuilderSection";
import Lenis from "lenis";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <main className="min-h-screen relative selection:bg-primary selection:text-black bg-background">
      <Hero />
      <CollectionsShowcase />
      <SchoolUniformSection />

      <div className="relative z-20 py-16 bg-background">
        <div className="mt-0">
          <ProductGrid filter="All" />
        </div>
      </div>

      <KitBuilderSection />
      <NewsletterSection />
      <Footer />
      <Dock />
    </main>
  );
}
