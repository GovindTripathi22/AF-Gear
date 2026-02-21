-- Supabase Phase 1 Schema Migration

-- Create the products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    product_status TEXT NOT NULL DEFAULT 'coming_soon' CHECK (product_status IN ('available', 'booking_only', 'unavailable', 'coming_soon')),
    stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock', 'limited')),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    visibility TEXT NOT NULL DEFAULT 'draft' CHECK (visibility IN ('published', 'draft', 'hidden')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Product Policies
-- 1. Public Read (Only published products)
CREATE POLICY "Public can view published products" 
ON public.products 
FOR SELECT 
USING (visibility = 'published');

-- 2. Admin Full Access
-- Assumes you have some admin role or claim setup, or you're using the service_role key 
-- In a basic setup without advanced custom claims, authenticated users often need a specific role table.
-- For now, if the user is authenticated via Supabase auth, we'll allow full access (Adjust based on exact auth setup later).
CREATE POLICY "Authenticated users have full access" 
ON public.products 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create the site content table (for hero texts, strings, etc)
CREATE TABLE public.site_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    section_name TEXT NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site content" 
ON public.site_content 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Authenticated users can edit site content" 
ON public.site_content
FOR ALL 
USING (auth.role() = 'authenticated');

-- Function to auto-update stock_status to out_of_stock when stock_quantity reaches 0
CREATE OR REPLACE FUNCTION update_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_quantity <= 0 THEN
        NEW.stock_status := 'out_of_stock';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock_status
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_stock_status();
