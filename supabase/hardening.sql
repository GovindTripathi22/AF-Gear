-- SECURITY HARDENING SCRIPT
-- Consolidates all tables and enforces strict RLS policies

-- 1. Ensure all tables have RLS enabled
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.saved_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_reservations ENABLE ROW LEVEL SECURITY;

-- 2. Cleanup existing policies to prevent conflicts
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 3. Define Clean, Strict Policies

-- PRODUCTS
-- Anyone can view published products
CREATE POLICY "Products are publicly viewable" ON public.products
FOR SELECT USING (visibility = 'published');

-- Only admins can manage products
CREATE POLICY "Admins manage products" ON public.products
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- PROFILES
-- Users view own
CREATE POLICY "View own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Admins view all
CREATE POLICY "Admins view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- REVIEWS
-- Everyone can view approved reviews
CREATE POLICY "Reviews viewable by public" ON public.reviews
FOR SELECT USING (status = 'approved');

-- Users can insert their own (Clerk/JWT sub mapping)
CREATE POLICY "Users insert own reviews" ON public.reviews
FOR INSERT WITH CHECK (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claim.sub', true));

-- Admins manage all
CREATE POLICY "Admins manage reviews" ON public.reviews
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- CONTACT QUERIES
-- Public can only insert
CREATE POLICY "Public insert queries" ON public.contact_queries
FOR INSERT WITH CHECK (true);

-- No public select/update/delete. Handled via Service Role.

-- ORDERS
-- Users view own orders
CREATE POLICY "Users view own orders" ON public.orders
FOR SELECT USING (customer_id = auth.uid()::text OR customer_id = current_setting('request.jwt.claim.sub', true) OR user_id = auth.uid()::text);

-- No public insert/update/delete. Handled via Service Role for security.

-- SAVED DESIGNS
-- Users handle own designs
CREATE POLICY "Users handle own designs" ON public.saved_designs
FOR ALL USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claim.sub', true));

-- PRODUCT RESERVATIONS
-- Strict lockdown. Only viewable/manageable by users via own ID if we add it, but for now Service Role only.
CREATE POLICY "Users view own reservations" ON public.product_reservations
FOR SELECT USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claim.sub', true));

-- SITE CONTENT
-- Public read
CREATE POLICY "Site content public read" ON public.site_content
FOR SELECT USING (true);

-- Admin manage
CREATE POLICY "Admins manage site content" ON public.site_content
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ========================================
-- DATABASE MIGRATION: Price & Order Fields
-- ========================================

-- Add price_cents (integer) and currency columns to products table
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS price_cents integer;
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS currency text DEFAULT 'eur';

-- Backfill price_cents from existing decimal price column
UPDATE public.products SET price_cents = ROUND(price * 100) WHERE price IS NOT NULL AND price_cents IS NULL;

-- Add paid_at timestamp to orders table
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS paid_at timestamp with time zone;

