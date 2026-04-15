import { Hero } from "@/components/ui/Hero";
import { Dock } from "@/components/ui/Dock";
import { NewsletterSection } from "@/components/ui/NewsletterSection";
import { QueryFormSection } from "@/components/products/QueryFormSection";
import dynamic from "next/dynamic";

const CollectionsShowcase = dynamic(
  () => import("@/components/products/CollectionsShowcase")
    .then(m => ({ default: m.CollectionsShowcase })),
  { loading: () => <div className="h-[600px] md:h-[700px]" /> }
);

const SchoolUniformSection = dynamic(
  () => import("@/components/products/SchoolUniform/SchoolUniformSection")
    .then(m => ({ default: m.SchoolUniformSection })),
  { loading: () => <div className="h-[500px] md:h-[600px]" /> }
);

const PubJerseysSection = dynamic(
  () => import("@/components/products/PubJerseysSection")
    .then(m => ({ default: m.PubJerseysSection })),
  { loading: () => <div className="h-[500px] md:h-[600px]" /> }
);

const ProductGrid = dynamic(
  () => import("@/components/products/ProductGrid")
    .then(m => ({ default: m.ProductGrid })),
  { loading: () => <div className="h-[800px] md:h-[1000px]" /> }
);

const Footer = dynamic(
  () => import("@/components/ui/Footer")
    .then(m => ({ default: m.Footer })),
  { loading: () => <div className="h-[400px]" /> }
);
import ClientHome from "./client-home";
import { productService } from '@/services/productService';
import { createStaticClient } from "@/utils/supabase/static";

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

  return (
    <div className="min-h-screen relative selection:bg-primary selection:text-black bg-background">
      <ClientHome />
      {/* Pass fetched data to components */}
      <Hero heroContent={heroData?.content} />
      <CollectionsShowcase />
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
