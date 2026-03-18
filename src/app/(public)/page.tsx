<<<<<<< HEAD
=======
import { createClient } from '@/utils/supabase/server'
>>>>>>> target/main
import { Hero } from "@/components/ui/Hero";
import { CollectionsShowcase } from "@/components/products/CollectionsShowcase";
import { SchoolUniformSection } from "@/components/products/SchoolUniform/SchoolUniformSection";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Dock } from "@/components/ui/Dock";
import { Footer } from "@/components/ui/Footer";
import { NewsletterSection } from "@/components/ui/NewsletterSection";
import { KitBuilderSection } from "@/components/products/KitBuilderSection";
<<<<<<< HEAD
import ClientHome from "./client-home";
import { productService } from '@/services/productService';
import { createStaticClient } from "@/utils/supabase/static";

// ISR: revalidate every 60 seconds so the page can be statically generated
export const revalidate = 60;
=======
import ClientHome from "./client-home"; // Moved client side effects here
import { productService } from '@/services/productService';
>>>>>>> target/main

export default async function Home() {
  const products = await productService.getProducts();

<<<<<<< HEAD
  const supabase = createStaticClient();
=======
  const supabase = await createClient();
>>>>>>> target/main
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
