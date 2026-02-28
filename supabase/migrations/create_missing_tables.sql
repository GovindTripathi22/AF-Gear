-- 1. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk uses String IDs, not UUIDs
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews
CREATE POLICY "Public reviews are viewable by everyone" ON reviews
    FOR SELECT USING (status = 'approved');
-- Admins and Authors will bypass RLS via Service Role Key (createAdminClient)

-- 2. Contact Queries Table
CREATE TABLE IF NOT EXISTS contact_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread', -- unread, read, replied
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE contact_queries ENABLE ROW LEVEL SECURITY;

-- Allow public inserts from the Contact Form. Admins bypass RLS for reading via Service Role.
CREATE POLICY "Anyone can insert contact queries" ON contact_queries
    FOR INSERT WITH CHECK (true);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stripe_session_id TEXT UNIQUE NOT NULL,
    user_id TEXT, -- Clerk uses String IDs
    user_email TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    items JSONB NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, paid, shipped, fulfilled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- No public RLS policies. Orders are highly sensitive. 
-- User lookups and Admin reads will happen via Service Role Server Actions to ensure security.

-- 4. Saved Designs (Kit Builder)
CREATE TABLE IF NOT EXISTS saved_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Clerk uses String IDs
    user_name TEXT NOT NULL,
    user_email TEXT,
    design_name TEXT NOT NULL,
    sport_id TEXT NOT NULL,
    settings JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE saved_designs ENABLE ROW LEVEL SECURITY;
-- No public queries. Handled securely via backend Service Role.
