-- Supabase Phase 2 Schema Migration

-- Create the saved_designs table
CREATE TABLE public.saved_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    user_name TEXT,
    user_email TEXT,
    design_name TEXT NOT NULL,
    sport_id TEXT NOT NULL,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.saved_designs ENABLE ROW LEVEL SECURITY;

-- 1. Users can view their own saved designs
CREATE POLICY "Users can view their own designs" 
ON public.saved_designs 
FOR SELECT 
USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claim.sub', true)); -- fallback for Clerk / Custom JWT

-- 2. Users can insert their own saved designs
CREATE POLICY "Users can insert their own designs" 
ON public.saved_designs 
FOR INSERT 
WITH CHECK (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claim.sub', true));

-- 3. Users can delete their own saved designs
CREATE POLICY "Users can delete their own designs" 
ON public.saved_designs 
FOR DELETE 
USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claim.sub', true));

-- 4. Admin Full Access
CREATE POLICY "Authenticated users have full access to designs" 
ON public.saved_designs 
FOR ALL 
USING (auth.role() = 'authenticated');
