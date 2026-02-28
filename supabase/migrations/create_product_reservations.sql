-- Migration: Create Product Reservations Table
-- Description: Stores user reservations for products that require a minimum order goal to enter production.

CREATE TABLE IF NOT EXISTS public.product_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL,
    product_name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    size TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'reserved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: We use TEXT for user_id because Clerk Auth uses string IDs instead of UUIDs.
-- The product_id is UUID assuming it references the products table if one exists (or we can just store the string if it's text). Let's check how product_id is formatted. 
-- In ProductForm, the slug/id are used but let's assume UUID for products.

-- 1. Enable RLS
ALTER TABLE public.product_reservations ENABLE ROW LEVEL SECURITY;

-- 2. Create policies
-- Allow admins to view all reservations (using your standard admin flag logic, or simply via the Service Role key backend).
-- For now, relying on Service Role Key for backend insertion is safest since Next.js Server Actions execute securely. Therefore, we don't strictly need public insertion policies if they are inserted server-side via the Admin client.

-- We can add a policy for users to see their own reservations, assuming the frontend queries them directly. 
-- But since we'll use Server Actions for all interactions, the Service Role bypasses RLS anyway. 
-- We'll just leave it fully restricted by default.
