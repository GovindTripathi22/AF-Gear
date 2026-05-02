import { Hero } from "@/components/ui/Hero";
import { CollectionsShowcase } from "@/components/products/CollectionsShowcase";
import { SchoolUniformSection } from "@/components/products/SchoolUniform/SchoolUniformSection";
import { PubJerseysSection } from "@/components/products/PubJerseysSection";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Dock } from "@/components/ui/Dock";
import { Footer } from "@/components/ui/Footer";
import { NewsletterSection } from "@/components/ui/NewsletterSection";
import { QueryFormSection } from "@/components/products/QueryFormSection";
import ClientHome from "./client-home";
import { productService } from '@/services/productService';
import { createStaticClient } from "@/utils/supabase/static";
import { fetchCategories } from '@/services/categoryService';

// ISR: revalidate every 60 seconds so the page can be statically generated
export const revalidate = 60;

export default async function Home() {
  const products = await productService.getProducts();

  const supabase = createStaticClient();
  let heroData = null;
  if (supabase) {
    const { data: siteHeroData } = await supabase
      .from('site_content')
      .select('content')
      .eq('key', 'homepage_hero')
      .single();
    heroData = siteHeroData;
  }

  // Fetch dynamic categories for the collections showcase
  const categories = await fetchCategories(supabase);

  return (
    <div className="min-h-screen relative selection:bg-primary selection:text-black bg-background">
      {/* Page Background Watermark */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.05]">
        <img 
          src="/assets/af-gear-hero-bg.jpg" 
          alt="" 
          className="w-full h-full object-cover scale-150 rotate-[-10deg]" 
        />
      </div>

      <ClientHome />
      {/* Pass fetched data to components */}
      <Hero heroContent={heroData?.content} />
      <CollectionsShowcase categories={categories} />
      <SchoolUniformSection />
      <PubJerseysSection />

      <div id="shop" className="relative z-20 py-16 bg-background scroll-mt-32">
        <div className="mt-0">
          <ProductGrid filter="All" products={products || []} />
        </div>
      </div>

      <QueryFormSection />
      <NewsletterSection />
      <Footer />
      <Dock />
    </div>
  );
}
