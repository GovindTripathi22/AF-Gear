-- Migration: Add missing columns to products table
-- Run this in Supabase SQL Editor

ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_price numeric;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight numeric;

-- Make featured column exist (it may already exist from initial schema)
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Ensure the coming_soon status is available
-- Note: You may need to manually add this via Supabase dashboard if ALTER TYPE doesn't work
-- ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'coming_soon';
