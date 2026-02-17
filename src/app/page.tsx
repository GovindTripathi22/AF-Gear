import { createClient } from '@/utils/supabase/server'
import { Hero } from "@/components/Hero";
import { CollectionsShowcase } from "@/components/CollectionsShowcase";
import { SchoolUniformSection } from "@/components/SchoolUniform/SchoolUniformSection";
import { ProductGrid } from "@/components/ProductGrid";
import { Dock } from "@/components/Dock";
import { Footer } from "@/components/Footer";
import { NewsletterSection } from "@/components/NewsletterSection";
import { KitBuilderSection } from "@/components/KitBuilderSection";
import ClientHome from "./client-home"; // Moved client side effects here

export default async function Home() {
  const supabase = await createClient()

  // Fetch products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('visibility', 'published') // Only show published products
    .order('created_at', { ascending: false });

  // Fetch content
  const { data: heroData } = await supabase
    .from('site_content')
    .select('content')
    .eq('key', 'homepage_hero')
    .single();

  return (
    <main className="min-h-screen relative selection:bg-primary selection:text-black bg-background">
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
    </main>
  );
}
