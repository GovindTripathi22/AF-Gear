-- Migration: Rename stripe_session_id to order_reference in orders table
-- Run this in your Supabase SQL Editor if you have an existing database

ALTER TABLE IF EXISTS orders 
RENAME COLUMN stripe_session_id TO order_reference;
