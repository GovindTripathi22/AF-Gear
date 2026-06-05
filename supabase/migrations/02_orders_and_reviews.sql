-- Migration: Orders and Reviews System

-- Create Order Status Enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
    END IF;
END $$;

-- Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_reference TEXT UNIQUE,
    customer_id TEXT, -- Clerk ID
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    items JSONB NOT NULL,
    total_amount NUMERIC NOT NULL,
    status order_status DEFAULT 'pending',
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk ID
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT DEFAULT 'approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies for Orders
CREATE POLICY "Admins have full access to orders" 
ON public.orders 
FOR ALL 
USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (customer_id = current_setting('request.jwt.claim.sub', true));

-- Policies for Reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (user_id = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Admins can manage reviews" 
ON public.reviews 
FOR ALL 
USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
