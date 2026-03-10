import { createClient } from '@/utils/supabase/server'
import { Hero } from "@/components/ui/Hero";
import { CollectionsShowcase } from "@/components/products/CollectionsShowcase";
import { SchoolUniformSection } from "@/components/products/SchoolUniform/SchoolUniformSection";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Dock } from "@/components/ui/Dock";
import { Footer } from "@/components/ui/Footer";
import { NewsletterSection } from "@/components/ui/NewsletterSection";
import { KitBuilderSection } from "@/components/products/KitBuilderSection";
import ClientHome from "./client-home"; // Moved client side effects here
import { productService } from '@/services/productService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const products = await productService.getProducts();

  const supabase = await createClient();
  let heroData = null;
  if (supabase) {
    const { data: siteHeroData } = await supabase
      .from('site_content')
      .select('content')
      .eq('key', 'homepage_hero')
      .single();
    heroData = siteHeroData;
  }

  return (
    <div className="min-h-screen relative selection:bg-primary selection:text-black bg-background">
      <ClientHome />
      {/* Pass fetched data to components */}
      <Hero heroContent={heroData?.content} />
      <CollectionsShowcase />
      <SchoolUniformSection />

      <div id="shop" className="relative z-20 py-16 bg-background scroll-mt-32">
        <div className="mt-0">
          <ProductGrid filter="All" products={products || []} />
        </div>
      </div>

      <KitBuilderSection />
      <NewsletterSection />
      <Footer />
      <Dock />
    </div>
  );
}
