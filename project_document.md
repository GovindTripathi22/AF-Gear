# Project Architecture & Implementation Document
**Project Name**: AF Gear (Codebase: `high-voltage`)
**Role**: Senior Full-Stack Software Engineer & Project Architect

---

## 1. Project Overview
**AF Gear** is a premium e-commerce platform for custom athletic apparel and teamwear (clubs, schools, squads). It features a modern dark-mode storefront, admin CMS, 3D jersey preview, and a WhatsApp-based order flow.

Key technical priorities:
*   **Security-First Checkout**: Server-side price lookup prevents client-side manipulation.
*   **WhatsApp Checkout**: Orders are logged in Supabase, emails sent via Resend, then customer is redirected to the owner's WhatsApp with a full order summary.
*   **Robust Access Control**: Dual checks (env vars + Clerk roles) protect admin routes.
*   **Advanced Rate Limiting**: In-memory sliding-window filter on checkout endpoint.
*   **ISR with Fallback**: Product pages use Incremental Static Regeneration (60s) with mock data fallbacks.

**Owner WhatsApp**: `+353 86 312 5706` → stored as `WHATSAPP_NUMBER=353863125706`

---

## 2. Tech Stack
*   **Framework**: Next.js 16 (App Router, TypeScript, React 19)
*   **Database**: Supabase (PostgreSQL with RLS and PL/pgSQL triggers)
*   **Authentication**: Clerk (with admin role enforcement)
*   **Order Flow**: WhatsApp direct redirect (`https://wa.me/353863125706`)
*   **Emails**: Resend API
*   **Styling**: Tailwind CSS 4 & PostCSS
*   **Animations/WebGL**: Framer Motion, Lenis Scroll, Three.js, React Three Fiber
*   **UI Icons**: Lucide React

---

## 3. Complete Folder/File Structure

```
/high-voltage
├── tsconfig.json
├── package.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── supabase/
│   ├── schema.sql
│   └── hardening.sql
└── src/
    ├── middleware.ts
    ├── actions/
    │   └── search.ts
    ├── types/
    │   ├── index.ts
    │   └── product.ts
    ├── lib/
    │   └── query-form-config.ts
    ├── services/
    │   ├── categoryService.ts
    │   └── productService.ts
    ├── utils/
    │   ├── auth.ts
    │   ├── cmsMapper.ts
    │   ├── email.ts
    │   ├── productUtils.ts
    │   ├── rateLimiter.ts
    │   └── supabase/
    │       ├── admin.ts
    │       ├── client.ts
    │       ├── middleware.ts
    │       ├── server.ts
    │       └── static.ts
    ├── contexts/
    │   └── CartContext.tsx
    ├── components/
    │   ├── admin/
    │   │   ├── AdminSidebar.tsx
    │   │   ├── CategoryManager.tsx
    │   │   └── ProductForm.tsx
    │   ├── products/
    │   │   ├── AvailabilityBadge.tsx
    │   │   ├── CartDrawer.tsx
    │   │   ├── CollectionsShowcase.tsx
    │   │   ├── FeaturedShop.tsx
    │   │   ├── JerseyPreview.tsx
    │   │   ├── JerseyPreview3D.tsx
    │   │   ├── ProductCard.tsx
    │   │   ├── ProductGrid.tsx
    │   │   ├── ProductImageMagnifier.tsx
    │   │   ├── ProductModal.tsx
    │   │   ├── PubJerseysSection.tsx
    │   │   ├── QueryFormSection.tsx
    │   │   └── ReviewSection.tsx
    │   └── ui/
    │       ├── AnimatedButton.tsx
    │       ├── AnnouncementBar.tsx
    │       ├── AuthButtons.tsx
    │       ├── Dock.tsx
    │       ├── FilterBar.tsx
    │       ├── Footer.tsx
    │       ├── GlobalSearch.tsx
    │       ├── Hero.tsx
    │       ├── LoadingScreen.tsx
    │       ├── Navbar.tsx
    │       ├── NewsletterSection.tsx
    │       ├── SmoothScroll.tsx
    │       └── ThemeProvider.tsx
    └── app/
        ├── globals.css
        ├── layout.tsx
        ├── (public)/
        │   ├── page.tsx
        │   ├── client-home.tsx
        │   ├── about/page.tsx
        │   ├── checkout/page.tsx
        │   ├── collections/[slug]/page.tsx
        │   ├── contact/page.tsx
        │   ├── products/[id]/page.tsx
        │   ├── profile/page.tsx
        │   ├── query-form/page.tsx
        │   ├── query-form/[sport]/page.tsx
        │   ├── school-uniforms/page.tsx
        │   ├── shipping/page.tsx
        │   ├── success/page.tsx
        │   ├── templates/page.tsx
        │   ├── terms/page.tsx
        │   └── track-order/page.tsx
        ├── (admin)/admin/
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── categories/page.tsx
        │   ├── content/page.tsx
        │   ├── orders/page.tsx
        │   ├── queries/page.tsx
        │   ├── reservations/page.tsx
        │   ├── reviews/page.tsx
        │   ├── saved-designs/page.tsx
        │   └── products/
        │       ├── actions.ts
        │       ├── page.tsx
        │       ├── new/page.tsx
        │       └── [id]/page.tsx
        └── api/
            ├── checkout/route.ts
            └── orders/route.ts
```

---

## 4. Codebase Blueprint & File Implementation

---

### `/high-voltage/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": [
    "node_modules",
    "restored_*.tsx",
    "old_*.tsx",
    "source_*.tsx",
    "raw_*.tsx",
    "restored.tsx",
    "restored.txt",
    "restored_admin.tsx",
    "restored_ascii.tsx",
    "restored_final.tsx",
    "restored_raw.tsx",
    "restored_source.tsx",
    "restored_test.tsx",
    "restored_v10.tsx",
    "restored_v2.tsx",
    "restored_v3.tsx",
    "restored_v5.tsx",
    "restored_v6.tsx",
    "restored_v8.tsx",
    "restored_v9.tsx"
  ]
}
```

---

### `/high-voltage/package.json`
```json
{
  "name": "high-voltage",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "security:scan": "gitleaks detect --source . || true",
    "audit": "npm audit --audit-level=moderate",
    "prepare": "husky"
  },
  "dependencies": {
    "@clerk/nextjs": "^6.38.0",
    "@clerk/themes": "^2.4.57",
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.6.0",
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.97.0",
    "@types/three": "^0.183.0",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "dotenv": "^17.3.1",
    "framer-motion": "^12.33.0",
    "lenis": "^1.3.17",
    "lucide-react": "^0.563.0",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "resend": "^6.9.2",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    "three": "^0.183.2",
    "zod": "^4.3.6",
    "server-only": "0.0.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "husky": "^9.1.7",
    "lint-staged": "^15.4.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix"
    ]
  }
}
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": [
    "node_modules",
    "restored_*.tsx",
    "old_*.tsx",
    "source_*.tsx",
    "raw_*.tsx",
    "restored.tsx",
    "restored.txt",
    "restored_admin.tsx",
    "restored_ascii.tsx",
    "restored_final.tsx",
    "restored_raw.tsx",
    "restored_source.tsx",
    "restored_test.tsx",
    "restored_v10.tsx",
    "restored_v2.tsx",
    "restored_v3.tsx",
    "restored_v5.tsx",
    "restored_v6.tsx",
    "restored_v8.tsx",
    "restored_v9.tsx"
  ]
}
```

---

### `/high-voltage/package.json`
```json
{
  "name": "high-voltage",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "security:scan": "gitleaks detect --source . || true",
    "audit": "npm audit --audit-level=moderate",
    "prepare": "husky"
  },
  "dependencies": {
    "@clerk/nextjs": "^6.38.0",
    "@clerk/themes": "^2.4.57",
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.6.0",
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.97.0",
    "@types/three": "^0.183.0",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "dotenv": "^17.3.1",
    "framer-motion": "^12.33.0",
    "lenis": "^1.3.17",
    "lucide-react": "^0.563.0",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "resend": "^6.9.2",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    "three": "^0.183.2",
    "zod": "^4.3.6",
    "server-only": "0.0.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "husky": "^9.1.7",
    "lint-staged": "^15.4.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix"
    ]
  }
}
```

---

### `/high-voltage/postcss.config.mjs`
```mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

---

### `/high-voltage/next.config.ts`
```tsx
import type { NextConfig } from "next";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' blob: https://clerk.af-gear.com https://*.clerk.accounts.dev https://challenges.cloudflare.com;
  worker-src 'self' blob:;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://clerk.af-gear.com https://images.clerk.dev https://*.supabase.co https://img.clerk.com https://images.unsplash.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://clerk.af-gear.com https://clerk-telemetry.com https://*.clerk.accounts.dev https://*.supabase.co;
  frame-src 'self' https://challenges.cloudflare.com;
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 75, 80, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  allowedDevOrigins: ['explosion-donation-forty-statement.trycloudflare.com', 'localhost:3000'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

### `/high-voltage/eslint.config.mjs`
```mjs
import eslintConfigNext from "eslint-config-next";

const config = [
    ...eslintConfigNext,
    {
        ignores: [
            ".agent/**",
            "supabase/**",
            ".next/**"
        ],
        rules: {
            "@typescript-eslint/no-explicit-any": "off"
        }
    }
];

export default config;
```

---

### `/high-voltage/supabase/hardening.sql`
```sql
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
FOR INSERT WITH CHECK (user_id = auth.uid()::text);

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
FOR SELECT USING (customer_id = auth.uid()::text OR user_id = auth.uid()::text);

-- No public insert/update/delete. Handled via Service Role for security.

-- SAVED DESIGNS
-- Users handle own designs
CREATE POLICY "Users handle own designs" ON public.saved_designs
FOR ALL USING (user_id = auth.uid()::text);

-- PRODUCT RESERVATIONS
-- Strict lockdown. Only viewable/manageable by users via own ID if we add it, but for now Service Role only.
CREATE POLICY "Users view own reservations" ON public.product_reservations
FOR SELECT USING (user_id = auth.uid()::text);

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
```

---

### `/high-voltage/supabase/migrations/00_init.sql`
```sql
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
```

---

### `/high-voltage/supabase/migrations/01_saved_designs.sql`
```sql
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
```

---

### `/high-voltage/supabase/migrations/02_orders_and_reviews.sql`
```sql
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
```

---

### `/high-voltage/supabase/migrations/create_missing_tables.sql`
```sql
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
    order_reference TEXT UNIQUE NOT NULL,
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

-- 4. Saved Designs (Query Form)
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
```

---

### `/high-voltage/supabase/migrations/create_product_reservations.sql`
```sql
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
```

---

### `/high-voltage/supabase/migrations/migrate_add_columns.sql`
```sql
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
```

---

### `/high-voltage/supabase/schema.sql`
```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create specific statuses as requested
create type product_status as enum ('available', 'unavailable', 'booking_only');
create type stock_status as enum ('in_stock', 'out_of_stock', 'limited');
create type visibility_status as enum ('published', 'draft', 'hidden');

-- Create products table
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text, -- Rich text content
  images text[] default array[]::text[], -- Array of image URLs
  price numeric,
  status product_status default 'available',
  stock stock_status default 'in_stock',
  category text,
  tags text[] default array[]::text[],
  featured boolean default false,
  visibility visibility_status default 'draft',
  meta_title text,
  meta_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create site_content table for dynamic CMS content
create table site_content (
  key text primary key, -- e.g., 'homepage_hero', 'contact_info'
  content jsonb not null, -- Flexible JSON structure for different content types
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references auth.users(id)
);

-- Create profiles table to manage admin roles (linked to auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  role text default 'user', -- 'admin' or 'user'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table products enable row level security;
alter table site_content enable row level security;
alter table profiles enable row level security;

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user'); -- Default to user, manual update to admin required
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Policies for Products
-- Public read access for published products
create policy "Public products are viewable by everyone"
  on products for select
  using (visibility = 'published');

-- Admins can do everything with products
create policy "Admins can manage products"
  on products for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Policies for Site Content
-- Public read access
create policy "Site content is viewable by everyone"
  on site_content for select
  using (true);

-- Admins can update site content
create policy "Admins can update site content"
  on site_content for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Policies for Profiles
-- Users can read their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on profiles for select
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Storage Bucket Setup (You might need to create the bucket 'product-images' manually in dashboard)
-- Policy to allow public access to images
-- Note: Storage policies are separate in Supabase, but here is the logic.
-- Bucket: product-images
-- Public Access: TRUE

-- SQL to create bucket (if supported by extension, otherwise do in dashboard)
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Public Access to Product Images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

create policy "Admins can upload Product Images"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' and exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

create policy "Admins can update Product Images"
  on storage.objects for update
  using ( bucket_id = 'product-images' and exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

create policy "Admins can delete Product Images"
  on storage.objects for delete
  using ( bucket_id = 'product-images' and exists (select 1 from profiles where id = auth.uid() and role = 'admin') );
```

---

### `/high-voltage/src/actions/search.ts`
```tsx
"use server";

import { createClient } from '@/utils/supabase/server';
import type { Product } from '@/types';

export async function searchProducts(query: string): Promise<Product[]> {
    if (!query) return [];

    const supabase = await createClient();

    // Sanitize query to prevent PostgREST filter injection
    const sanitized = query.replace(/[%_\\(),."']/g, '');
    if (!sanitized) return [];

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('visibility', 'published')
        .or(`name.ilike.%${sanitized}%,category.ilike.%${sanitized}%`)
        .limit(5);

    if (error) {
        console.error('Search error:', error);
        return [];
    }

    return data as Product[];
}
```

---

### `/high-voltage/src/app/(admin)/admin/categories/actions.ts`
```tsx
'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { ensureAdmin } from '@/utils/auth'
import { DEFAULT_CATEGORIES, type Category } from '@/services/categoryService'

const CONTENT_KEY = 'store_categories'

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getSupabase() {
    const supabase = createAdminClient()
    if (!supabase) throw new Error('Database unavailable')
    return supabase
}

async function readCategories(supabase: any): Promise<Category[]> {
    const { data } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', CONTENT_KEY)
        .single()
    if (!data?.content) return DEFAULT_CATEGORIES
    const arr = Array.isArray(data.content) ? data.content : []
    return arr.length > 0 ? arr : DEFAULT_CATEGORIES
}

async function writeCategories(supabase: any, categories: Category[]) {
    const { error } = await supabase
        .from('site_content')
        .upsert(
            {
                key: CONTENT_KEY,
                section_name: 'store_categories',
                content: categories,
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'key' }
        )
    if (error) throw new Error(error.message)
}

// ─── Public Actions ───────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
    try {
        const supabase = await getSupabase()
        return await readCategories(supabase)
    } catch {
        return DEFAULT_CATEGORIES
    }
}

export async function saveCategory(formData: FormData) {
    await ensureAdmin()
    try {
        const supabase = await getSupabase()
        const existing = await readCategories(supabase)

        const id   = (formData.get('id')   as string | null)?.trim() || ''
        const name = (formData.get('name') as string).trim()
        const slug = (formData.get('slug') as string).trim()
            || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        const tagline  = (formData.get('tagline')  as string | null)?.trim() || ''
        const subtitle = (formData.get('subtitle') as string | null)?.trim() || ''
        const crest    = (formData.get('crest')    as string | null)?.trim() || ''
        const image    = (formData.get('image')    as string | null)?.trim() || ''
        const accent   = (formData.get('accent')   as string | null)?.trim() || ''
        const order    = parseInt((formData.get('order') as string) || '99', 10)

        const category: Category = { id: id || slug, name, slug, tagline, subtitle, crest, image, accent, order }

        const idx = existing.findIndex(c => c.id === id)
        let updated: Category[]
        if (idx >= 0) {
            updated = existing.map((c, i) => i === idx ? category : c)
        } else {
            updated = [...existing, category]
        }

        await writeCategories(supabase, updated)
        revalidatePath('/admin/categories')
        revalidatePath('/')
        revalidatePath('/collections/[slug]', 'page')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function deleteCategory(id: string) {
    await ensureAdmin()
    try {
        const supabase = await getSupabase()
        const existing = await readCategories(supabase)
        const updated = existing.filter(c => c.id !== id)
        await writeCategories(supabase, updated)
        revalidatePath('/admin/categories')
        revalidatePath('/')
        revalidatePath('/collections/[slug]', 'page')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function reorderCategories(ordered: string[]) {
    await ensureAdmin()
    try {
        const supabase = await getSupabase()
        const existing = await readCategories(supabase)
        const updated = ordered
            .map((id, idx) => {
                const cat = existing.find(c => c.id === id)
                return cat ? { ...cat, order: idx + 1 } : null
            })
            .filter(Boolean) as Category[]
        await writeCategories(supabase, updated)
        revalidatePath('/admin/categories')
        revalidatePath('/')
        revalidatePath('/collections/[slug]', 'page')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}
```

---

### `/high-voltage/src/app/(admin)/admin/categories/page.tsx`
```tsx
import { getCategories } from './actions'
import CategoryManager from '@/components/admin/CategoryManager'
import { Tags } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <span className="text-[10px] font-bold tracking-[0.3em] text-indigo-600 uppercase mb-2 block">
                        Store Configuration
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-display font-black text-gray-900 uppercase tracking-tight leading-none flex items-center gap-3">
                        <Tags className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                        Categories
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 tracking-wide">
                        Manage store categories. Changes reflect live on the website.{' '}
                        <span className="font-medium text-gray-700">{categories.length} categories</span>
                    </p>
                </div>
            </div>

            <CategoryManager initialCategories={categories} />
        </div>
    )
}
```

---

### `/high-voltage/src/app/(admin)/admin/content/actions.ts`
```tsx
'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { ensureAdmin } from '@/utils/auth'

export async function updateContent(prevState: unknown, formData: FormData) {
    await ensureAdmin()
    const supabase = createAdminClient()

    const section = formData.get('section') as string
    const content = JSON.parse(formData.get('content') as string)

    const { error } = await supabase
        .from('site_content')
        .upsert({ key: section, content })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/content')
    revalidatePath('/', 'layout')
    return { success: true }
}
```

---

### `/high-voltage/src/app/(admin)/admin/content/page.tsx`
```tsx
'use client'

import { useState, useEffect } from 'react'
import { updateContent } from './actions'
import { Loader2, Save, Type, BarChart3, Image as ImageIcon, Link2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@clerk/nextjs'

type HeroContent = {
    title: string
    subtitle: string
    ctaText: string
    ctaLink: string
    backgroundImage: string
}

type StatsContent = {
    happyCustomers: string
    projectsComplete: string
    citiesCovered: string
    energyInstalled: string
}

function InputField({ label, value, onChange, placeholder, icon: Icon, type = 'text' }: {
    label: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    icon?: React.ComponentType<{ className?: string }>
    type?: string
}) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                {Icon && <Icon className="w-3.5 h-3.5 text-indigo-500" />}
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full min-h-[48px] bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder:text-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
            />
        </div>
    )
}

export default function ContentPage() {
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [hero, setHero] = useState<HeroContent>({ title: '', subtitle: '', ctaText: '', ctaLink: '', backgroundImage: '' })
    const [stats, setStats] = useState<StatsContent>({ happyCustomers: '', projectsComplete: '', citiesCovered: '', energyInstalled: '' })

    useEffect(() => {
        async function loadContent() {
            try {
                const clerkToken = await getToken({ template: 'supabase' }) || undefined
                const supabase = createClient(clerkToken)
                const [heroResult, statsResult] = await Promise.all([
                    supabase.from('site_content').select('content').eq('key', 'homepage_hero').single(),
                    supabase.from('site_content').select('content').eq('key', 'statistics').single(),
                ])

                if (heroResult.data?.content) {
                    setHero(prev => ({ ...prev, ...heroResult.data.content }))
                }
                if (statsResult.data?.content) {
                    setStats(prev => ({ ...prev, ...statsResult.data.content }))
                }
            } catch (e) {
                console.error('Error loading content:', e)
            } finally {
                setFetching(false)
            }
        }

        loadContent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSave = async (section: string, data: Record<string, unknown>) => {
        setLoading(true)
        const formData = new FormData()
        formData.append('section', section)
        formData.append('content', JSON.stringify(data))

        const result = await updateContent(null, formData)
        setLoading(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success(`${section.replace('_', ' ')} updated!`)
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Loading Content</span>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 md:space-y-8 px-1">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-display font-black text-gray-900 uppercase tracking-tight">
                    Content Manager
                </h1>
                <p className="text-gray-500 text-sm mt-1">Update your website&apos;s content sections.</p>
            </div>

            {/* Hero Section Card */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-5 md:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <ImageIcon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Homepage Hero</h3>
                        <p className="text-[11px] text-gray-400">Banner text and call-to-action.</p>
                    </div>
                </div>
                <div className="px-5 md:px-6 py-5 md:py-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Title" icon={Type} value={hero.title} onChange={v => setHero({ ...hero, title: v })} placeholder="Main headline" />
                        <InputField label="Subtitle" icon={FileText} value={hero.subtitle} onChange={v => setHero({ ...hero, subtitle: v })} placeholder="Supporting text" />
                        <InputField label="CTA Text" icon={Type} value={hero.ctaText} onChange={v => setHero({ ...hero, ctaText: v })} placeholder="Button label" />
                        <InputField label="CTA Link" icon={Link2} value={hero.ctaLink} onChange={v => setHero({ ...hero, ctaLink: v })} placeholder="/shop or external URL" />
                    </div>
                </div>
                <div className="flex items-center justify-end border-t border-gray-100 px-5 md:px-6 py-4 bg-gray-50/50">
                    <button
                        onClick={() => handleSave('homepage_hero', hero)}
                        disabled={loading}
                        className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-all duration-200 min-h-[44px]"
                    >
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                        Save Hero
                    </button>
                </div>
            </div>

            {/* Stats Section Card */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-5 md:px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <BarChart3 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Statistics</h3>
                        <p className="text-[11px] text-gray-400">Numbers displayed on the website.</p>
                    </div>
                </div>
                <div className="px-5 md:px-6 py-5 md:py-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="Happy Customers" value={stats.happyCustomers} onChange={v => setStats({ ...stats, happyCustomers: v })} placeholder="e.g. 500+" />
                        <InputField label="Projects Complete" value={stats.projectsComplete} onChange={v => setStats({ ...stats, projectsComplete: v })} placeholder="e.g. 200+" />
                        <InputField label="Clubs Partnered" value={stats.citiesCovered} onChange={v => setStats({ ...stats, citiesCovered: v })} placeholder="e.g. 120+" />
                        <InputField label="Garments Manufactured" value={stats.energyInstalled} onChange={v => setStats({ ...stats, energyInstalled: v })} placeholder="e.g. 50,000+" />
                    </div>
                </div>
                <div className="flex items-center justify-end border-t border-gray-100 px-5 md:px-6 py-4 bg-gray-50/50">
                    <button
                        onClick={() => handleSave('statistics', stats)}
                        disabled={loading}
                        className="rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-all duration-200 min-h-[44px]"
                    >
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                        Save Statistics
                    </button>
                </div>
            </div>
        </div>
    )
}
```

---

### `/high-voltage/src/app/(admin)/admin/layout.tsx`
```tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Toaster } from 'sonner'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

import { checkAdmin } from '@/utils/auth'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Only authorized admins can access admin pages
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
        redirect('/')
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 font-sans">
            <Toaster position="top-right" richColors closeButton />
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto focus:outline-none">
                <div className="py-6 px-4 sm:px-6 lg:py-8 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
```

---

### `/high-voltage/src/app/(admin)/admin/orders/page.tsx`
```tsx
"use client";

import { useEffect, useState } from "react";
import { fetchAdminOrdersAction } from "@/app/actions/adminActions";
import { format } from "date-fns";
import { ShoppingCart, Package, Truck, CheckCircle2, Search, X } from "lucide-react";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const { data, error } = await fetchAdminOrdersAction();

                if (data && !error) {
                    setOrders(data);
                } else if (error) {
                    console.error("Failed to fetch orders from action", error);
                }
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const filteredOrders = orders.filter(order =>
        order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_reference?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 uppercase tracking-tight">
                        Order Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Track and manage your store&apos;s sales and shipping status.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Items</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Total</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                            <span>Loading orders...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <ShoppingCart className="w-12 h-12 opacity-10" />
                                            <p>No orders found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                            {format(new Date(order.created_at), "MMM d, yyyy")}
                                            <div className="text-[10px] text-gray-400 mt-0.5">at {format(new Date(order.created_at), "HH:mm")}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-bold text-gray-900 leading-tight">
                                                {order.user_email?.split('@')[0] || "Guest Customer"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {order.user_email}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                {Array.isArray(order.items) && order.items.slice(0, 2).map((item: any, i: number) => (
                                                    <span key={i} className="text-xs text-gray-600 flex items-center gap-2">
                                                        <span className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold">{item.quantity}</span>
                                                        {item.name}
                                                    </span>
                                                ))}
                                                {order.items.length > 2 && (
                                                    <span className="text-[10px] text-indigo-600 font-medium">+{order.items.length - 2} more items</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-black text-gray-900">
                                            €{Number(order.amount).toFixed(2)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 transition-colors shadow-sm"
                                            >
                                                View Full Order
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl p-6 relative">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="border-b border-gray-100 pb-4 mb-6">
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold uppercase tracking-wider px-2 py-1 rounded">
                                Order Details
                            </span>
                            <h2 className="text-xl font-black text-gray-900 mt-2">
                                #{selectedOrder.order_reference}
                            </h2>
                            <p className="text-xs text-gray-400 mt-1">
                                Placed on {format(new Date(selectedOrder.created_at), "MMMM d, yyyy 'at' HH:mm")}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-left">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Customer</h3>
                                <p className="text-sm font-bold text-gray-900">{selectedOrder.customer_name || "Guest Customer"}</p>
                                <p className="text-sm text-gray-600">{selectedOrder.user_email}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Shipping Details</h3>
                                {selectedOrder.shipping_address ? (
                                    <div className="text-sm text-gray-600">
                                        <p className="font-bold text-gray-900">{selectedOrder.shipping_address.name}</p>
                                        <p>{selectedOrder.shipping_address.line1}</p>
                                        <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postal_code}</p>
                                        <p className="uppercase">{selectedOrder.shipping_address.country}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">No shipping address provided</p>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-b border-gray-100 py-4 mb-6 text-left">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Items Ordered</h3>
                            <div className="space-y-3">
                                {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-800">
                                                {item.quantity}
                                            </span>
                                            <div>
                                                <p className="font-bold text-gray-800">{item.name}</p>
                                                {item.size && <p className="text-[10px] text-gray-400 uppercase">Size: {item.size}</p>}
                                            </div>
                                        </div>
                                        <p className="font-black text-gray-900">
                                            €{Number((item.unit_price || 0) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4 text-left">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Status</p>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-white mt-1 ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Total Paid</p>
                                <p className="text-2xl font-black text-indigo-600">
                                    €{Number(selectedOrder.amount).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
```

---

### `/high-voltage/src/app/(admin)/admin/page.tsx`
```tsx
import { createAdminClient } from '@/utils/supabase/admin'
import Link from 'next/link'
import { ArrowUpRight, Package, AlertCircle, CheckCircle2, Clock, TrendingUp, Boxes, Tag, ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const supabase = createAdminClient()

    if (!supabase) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg space-y-4 shadow-sm border border-red-100 max-w-2xl mx-auto my-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-80" />
                <h2 className="text-xl font-bold text-red-700">Database Connection Missing</h2>
                <p className="text-red-600">Please check your environment variables. You need to configure:</p>
                <div className="text-sm space-y-2 font-mono text-left max-w-sm mx-auto bg-white p-4 rounded-md border border-red-200">
                    <div className="text-gray-800">NEXT_PUBLIC_SUPABASE_URL</div>
                    <div className="text-gray-800">SUPABASE_SERVICE_ROLE_KEY</div>
                </div>
                <p className="text-sm text-red-500 mt-4">These need to be set in your <code className="bg-red-100 px-1 py-0.5 rounded">.env.local</code> file.</p>
            </div>
        )
    }

    // Fetch stats in parallel
    const [
        { count: totalProducts },
        { count: availableProducts },
        { count: totalOrders },
        { count: totalReviews },
        { data: recentProducts },
        { data: categories },
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('product_status', 'available'),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('id, name, price, product_status, visibility, images, category, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('category'),
    ])
    const uniqueCategories = new Set(categories?.map((c: { category: string }) => c.category).filter(Boolean))

    const stats = [
        { name: 'Total Products', stat: totalProducts || 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Orders', stat: totalOrders || 0, icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { name: 'Reviews', stat: totalReviews || 0, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
        { name: 'Available', stat: availableProducts || 0, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { name: 'Categories', stat: uniqueCategories.size, icon: Tag, color: 'text-violet-600', bg: 'bg-violet-50' },
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                        Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Overview of your store&apos;s inventory and recent activity.
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors w-full sm:w-auto text-center"
                >
                    + Add Product
                </Link>
            </div>

            {/* Stats Grid */}
            <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="relative overflow-hidden rounded-xl bg-white px-4 py-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <dt className="flex items-center gap-3">
                            <div className={`rounded-lg p-2 ${item.bg}`}>
                                <item.icon className={`h-5 w-5 ${item.color}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-500 truncate">{item.name}</span>
                        </dt>
                        <dd className="mt-3 ml-0">
                            <p className="text-3xl font-bold text-gray-900 tracking-tight">{item.stat}</p>
                        </dd>
                    </div>
                ))}
            </dl>

            {/* Recent Products */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Recent Products</h3>
                        <p className="text-sm text-gray-500">Latest additions to your store.</p>
                    </div>
                    <Link href="/admin/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        View all →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visibility</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentProducts?.map((product: { id: string; name: string; price: number; product_status: string; visibility: string; images: string[]; category: string }) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {product.images?.[0] ? (
                                                    <Image src={product.images[0]} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Package className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-medium text-sm text-gray-900">{product.name}</span>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{product.category || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.product_status === 'available' ? 'bg-emerald-50 text-emerald-700' :
                                            product.product_status === 'booking_only' ? 'bg-amber-50 text-amber-700' :
                                                'bg-red-50 text-red-700'
                                            }`}>
                                            {String(product.product_status || '').replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.visibility === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {product.visibility}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                        {product.price ? `€${Number(product.price).toFixed(2)}` : '—'}
                                    </td>
                                </tr>
                            ))}
                            {(!recentProducts || recentProducts.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                        No products yet. <Link href="/admin/products/new" className="text-indigo-600 font-medium hover:underline">Add your first product.</Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link href="/admin/products/new" className="group relative flex items-center space-x-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:bg-gray-50 hover:border-indigo-300 hover:ring-1 hover:ring-indigo-300">
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            <Package className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-base font-semibold text-gray-900">Add New Product</p>
                        <p className="truncate text-sm text-gray-500 mt-0.5">Create a new product listing</p>
                    </div>
                </Link>
                <Link href="/admin/content" className="group relative flex items-center space-x-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:bg-gray-50 hover:border-indigo-300 hover:ring-1 hover:ring-indigo-300">
                    <div className="flex-shrink-0">
                        <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-fuchsia-50 text-fuchsia-600 group-hover:bg-fuchsia-100 transition-colors">
                            <ArrowUpRight className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-base font-semibold text-gray-900">Update Content</p>
                        <p className="truncate text-sm text-gray-500 mt-0.5">Edit homepage hero and marketing sections</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}
```

---

### `/high-voltage/src/app/(admin)/admin/products/actions.ts`
```tsx
'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { ensureAdmin } from '@/utils/auth'

export type ProductActionState = {
    error?: string;
    success?: boolean;
} | null;

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function revalidateAll() {
    revalidatePath('/admin/products')
    revalidatePath('/admin')
    revalidatePath('/products', 'layout')
    revalidatePath('/collections/[slug]', 'page')
    revalidatePath('/', 'layout')
}

export async function deleteProduct(id: string) {
    await ensureAdmin()
    const supabase = createAdminClient()
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidateAll()
}

export async function upsertProduct(prevState: unknown, formData: FormData): Promise<ProductActionState> {
    await ensureAdmin()
    const supabase = createAdminClient()

    const id = formData.get('id') as string | null
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string) || 0
    const productStatus = formData.get('product_status') as string || 'available'
    const stockStatus = formData.get('stock_status') as string || 'in_stock'
    const visibility = formData.get('visibility') as string || 'draft'
    const category = formData.get('category') as string

    // Validation
    if (!name || name.trim().length < 3) {
        return { error: 'Product name must be at least 3 characters long.' }
    }
    if (price < 0) {
        return { error: 'Price cannot be negative.' }
    }
    if (!category) {
        return { error: 'Category is required.' }
    }

    const tags = (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || []
    const images = (formData.get('image_urls') as string)?.split(',').filter(Boolean) || []
    const slug = formData.get('slug') as string || slugify(name)

    // Use actual DB column names: product_status, stock_status
    const productData: Record<string, unknown> = {
        name,
        slug,
        description,
        price,
        price_cents: Math.round(price * 100),
        product_status: productStatus,
        stock_status: stockStatus,
        visibility,
        category,
        tags,
        images,
    }

    let error: { message: string } | null = null;

    if (id) {
        const { error: updateError } = await supabase
            .from('products')
            .update(productData)
            .eq('id', id)
        error = updateError
    } else {
        const { error: insertError } = await supabase
            .from('products')
            .insert(productData)
        error = insertError
    }

    if (error) {
        console.error("UPSERT FAILED:", error.message);
        return { error: error.message }
    }

    revalidateAll()

    return { success: true }
}

export async function uploadProductImage(formData: FormData) {
    await ensureAdmin()
    const supabase = createAdminClient();
    if (!supabase) return { error: "No Database Connection" };

    const file = formData.get("file") as File;
    if (!file) return { error: "No file provided" };

    try {
        // Ensure bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some((b: { name: string }) => b.name === 'product-images');

        if (!bucketExists) {
            await supabase.storage.createBucket('product-images', {
                public: true,
                allowedMimeTypes: ['image/*'],
            });
        }

        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file, { upsert: true });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return { error: uploadError.message };
        }

        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);

        return { success: true, url: data.publicUrl };
    } catch (err: unknown) {
        console.error("Upload Exception:", err);
        return { error: err instanceof Error ? err.message : "Unknown error during upload" };
    }
}
```

---

### `/high-voltage/src/app/(admin)/admin/products/new/page.tsx`
```tsx
import ProductForm from '@/components/admin/ProductForm'
import { createAdminClient } from '@/utils/supabase/admin'
import { fetchCategories } from '@/services/categoryService'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
    const supabase = createAdminClient()
    const categories = await fetchCategories(supabase)

    return (
        <div className="bg-white shadow sm:rounded-lg p-6">
            <ProductForm categories={categories} />
        </div>
    )
}
```

---

### `/high-voltage/src/app/(admin)/admin/products/page.tsx`
```tsx
import { createAdminClient } from '@/utils/supabase/admin'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Eye, EyeOff, Package, Search } from 'lucide-react'
import { deleteProduct } from './actions'
import { AnimatedButton } from '@/components/ui/AnimatedButton'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
    const supabase = createAdminClient()
    let products: any[] = []

    if (supabase) {
        const { data } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
        products = data || []
    }

    // Fallback block removed to display proper empty state
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-bold tracking-[0.3em] text-indigo-600 uppercase mb-2 block">
                        Inventory Management
                    </span>
                    <h1 className="text-4xl font-display font-black text-gray-900 uppercase tracking-tight leading-none">
                        Products
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 tracking-wide">
                        Manage all products in your store. {products?.length || 0} total.
                    </p>
                </div>
                <AnimatedButton
                    href="/admin/products/new"
                    variant="primary"
                    className="!px-6 !py-3 rounded-sm"
                    animation="gloss"
                >
                    <Plus className="h-4 w-4" />
                    Add Product
                </AnimatedButton>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/80">
                            <tr>
                                <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Visibility
                                </th>
                                <th scope="col" className="px-3 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th scope="col" className="relative py-4 pl-3 pr-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products?.map((product: {
                                id: string; name: string; product_status: string; stock_status: string;
                                visibility: string; price: number | null;
                                images: string[]; category: string
                            }) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                        <Link href={`/admin/products/${product.id}`} className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-sm overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                                {product.images?.[0] ? (
                                                    <Image src={product.images[0]} alt={product.name} width={48} height={48} className="object-cover w-full h-full transition-all duration-300 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm font-bold tracking-wide text-gray-900 group-hover:text-indigo-600 transition-colors">{product.name}</span>
                                        </Link>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-xs font-medium text-gray-500">
                                        {product.category || '—'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <span className={`inline-flex items-center rounded-sm px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${product.product_status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            product.product_status === 'booking_only' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                            {String(product.product_status || 'unknown').replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-xs font-bold text-gray-500">
                                        <span className="uppercase tracking-widest text-[10px]">{String(product.stock_status || 'in_stock').replace('_', ' ')}</span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <div className="flex items-center gap-2">
                                            {product.visibility === 'published' ? (
                                                <Eye className="h-3.5 w-3.5 text-emerald-500" />
                                            ) : (
                                                <EyeOff className="h-3.5 w-3.5 text-gray-400" />
                                            )}
                                            <span className="text-xs font-bold text-gray-500 tracking-wide">{product.visibility}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-black text-gray-900">
                                        {product.price ? `€${Number(product.price).toFixed(2)}` : '—'}
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/products/${product.id}`} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-sm transition-all duration-300" title="Edit">
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <form
                                                action={deleteProduct.bind(null, product.id)}
                                                onSubmit={(e) => {
                                                    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                <button type="submit" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all duration-300 border border-transparent" title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {(!products || products.length === 0) && (
                        <div className="text-center py-20 px-4">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                <Package className="h-8 w-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 tracking-wide uppercase">No Products Found</h3>
                            <p className="mt-2 text-sm text-gray-500 mb-6 max-w-sm mx-auto">Get started by adding your first premium gear to the inventory catalog.</p>
                            <AnimatedButton
                                href="/admin/products/new"
                                variant="outline"
                                className="!px-6 !py-3 rounded-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add First Product
                            </AnimatedButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
```

---

### `/high-voltage/src/app/(admin)/admin/products/[id]/page.tsx`
```tsx
import ProductForm from '@/components/admin/ProductForm'
import { createAdminClient } from '@/utils/supabase/admin'
import { notFound } from 'next/navigation'
import { fetchCategories } from '@/services/categoryService'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = createAdminClient()
    const [{ data: product }, categories] = await Promise.all([
        supabase.from('products').select('*').eq('id', id).single(),
        fetchCategories(supabase),
    ])

    if (!product) {
        notFound()
    }

    return (
        <div>
            <ProductForm product={product} categories={categories} />
        </div>
    )
}
```

---

### `/high-voltage/src/app/(admin)/admin/queries/page.tsx`
```tsx
"use client";

import { useEffect, useState } from "react";
import { fetchAdminQueriesAction, markQueryReadAction } from "@/app/actions/adminActions";
import { format } from "date-fns";
import { MessageSquare, Mail, User, CheckCircle2, Search, Inbox } from "lucide-react";

export default function AdminQueriesPage() {
    const [queries, setQueries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchQueries() {
            try {
                const { data, error } = await fetchAdminQueriesAction();

                if (data && !error) {
                    setQueries(data);
                } else if (error) {
                    console.error("Failed to fetch queries", error);
                }
            } catch (err) {
                console.error("Failed to fetch queries", err);
            } finally {
                setLoading(false);
            }
        }

        fetchQueries();
    }, []);

    const markAsRead = async (id: string) => {
        const { success } = await markQueryReadAction(id);

        if (success) {
            setQueries(queries.map(q => q.id === id ? { ...q, status: 'read' } : q));
        }
    };

    const filteredQueries = queries.filter(query =>
        query.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        if (status === 'unread') {
            return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded text-xs font-bold uppercase">Unread</span>;
        }
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded text-xs font-bold uppercase">Read</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 uppercase tracking-tight">
                        Contact Queries
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        View and manage messages from your customers.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Sender</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Subject</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Message</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 min-w-24">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        Loading messages...
                                    </td>
                                </tr>
                            ) : filteredQueries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Inbox className="w-12 h-12 opacity-10" />
                                            <p>No messages found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredQueries.map((query) => (
                                    <tr key={query.id} className={`transition-colors group ${query.status === 'unread' ? 'bg-indigo-50/10' : 'hover:bg-gray-50/50'}`}>
                                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                            {format(new Date(query.created_at), "MMM d, yyyy")}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                <User className="w-3 h-3 text-gray-400" />
                                                {query.user_name}
                                            </div>
                                            <div className="text-xs text-indigo-600 flex items-center gap-2 mt-1">
                                                <Mail className="w-3 h-3" />
                                                <a href={`mailto:${query.user_email}`} className="hover:underline">{query.user_email}</a>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-gray-900 capitalize">
                                            {query.subject?.replace("-", " ") || "No Subject"}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={query.message}>
                                            {query.message}
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(query.status)}
                                        </td>
                                        <td className="p-4 text-right">
                                            {query.status === 'unread' && (
                                                <button
                                                    onClick={() => markAsRead(query.id)}
                                                    className="text-indigo-600 hover:text-indigo-800 transition-colors p-2 text-xs font-bold uppercase flex items-center justify-end gap-1 w-full"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" /> Mark Read
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
```

---

### `/high-voltage/src/app/(admin)/admin/reservations/page.tsx`
```tsx
import { createAdminClient } from "@/utils/supabase/admin";
import { format } from "date-fns";
import { Package, Search, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage() {
    const supabase = createAdminClient();

    let reservations: any = null;
    let error = null;

    if (supabase) {
        try {
            const { data, error: fetchError } = await supabase
                .from("product_reservations")
                .select("*")
                .order("created_at", { ascending: false });
            reservations = data;
            error = fetchError;
        } catch (e) {
            error = e;
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                        <Package className="w-6 h-6 text-indigo-600" />
                        Product Reservations
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitor group-order reservations. Items go into production once minimum thresholds are met.
                    </p>
                </div>

                {/* Filters - Visual Only for now */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reservations..."
                            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
                        />
                    </div>
                    <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Reservations List */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                {error ? (
                    <div className="p-8 text-center text-red-600 bg-red-50 m-4 rounded-lg border border-red-200">
                        Error loading reservations. Ensure database tables exist.
                    </div>
                ) : !reservations || reservations.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <Package className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 tracking-wide uppercase mb-2">No Reservations Yet</h3>
                        <p className="text-sm text-gray-500">
                            When customers reserve &quot;Coming Soon&quot; or pre-order products, they will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 uppercase text-[10px] tracking-widest font-bold">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Customer Details</th>
                                    <th className="px-6 py-4">Specs</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reservations.map((reservation: any) => (
                                    <tr key={reservation.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900 leading-tight">{reservation.product_name}</div>
                                            <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[150px]">
                                                ID: {reservation.product_id?.split('-')[0]}...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900 leading-tight">
                                                {reservation.user_email?.split('@')[0] || "Guest"}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                {reservation.user_email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded text-gray-700 text-xs font-medium">
                                                    Size: {reservation.size}
                                                </span>
                                                <span className="text-gray-500 text-xs">
                                                    Qty: <strong className="text-gray-900 font-bold">{reservation.quantity}</strong>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
                                                {reservation.status || 'Reserved'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {format(new Date(reservation.created_at), 'MMM d, yyyy')}
                                            <div className="text-[10px] text-gray-400 mt-0.5">
                                                {format(new Date(reservation.created_at), 'HH:mm')}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
```

---

### `/high-voltage/src/app/(admin)/admin/reviews/page.tsx`
```tsx
"use client";

import { useEffect, useState } from "react";
import { fetchAdminReviewsAction, updateReviewStatusAction } from "@/app/actions/adminActions";
import { format } from "date-fns";
import { MessageSquare, Star, Trash2, CheckCircle2 } from "lucide-react";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const { data, error } = await fetchAdminReviewsAction();

                if (data && !error) {
                    setReviews(data);
                } else if (error) {
                    console.error("Failed to fetch reviews", error);
                }
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            } finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, []);

    const updateReviewStatus = async (id: string, status: string) => {
        const { success } = await updateReviewStatusAction(id, status);

        if (success) {
            setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === 'pending') {
            return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded text-xs font-bold uppercase">Pending</span>;
        }
        if (status === 'approved') {
            return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded text-xs font-bold uppercase">Approved</span>;
        }
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded text-xs font-bold uppercase">Rejected</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 uppercase tracking-tight">
                        Product Reviews
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Moderate customer reviews left on products.
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Product</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Rating & Comment</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        Loading reviews...
                                    </td>
                                </tr>
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <MessageSquare className="w-12 h-12 opacity-10" />
                                            <p>No reviews found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                            {format(new Date(review.created_at), "MMM d, yyyy")}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-gray-900">
                                            {review.products?.name || "Unknown Product"}
                                        </td>
                                        <td className="p-4 text-sm text-gray-900 font-medium">
                                            {review.user_name}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-1 mb-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-200'}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-600 max-w-sm">{review.comment}</p>
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(review.status)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {review.status !== 'approved' && (
                                                    <button
                                                        onClick={() => updateReviewStatus(review.id, 'approved')}
                                                        className="text-emerald-600 hover:text-emerald-800 transition-colors p-2"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {review.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => updateReviewStatus(review.id, 'rejected')}
                                                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                                                        title="Reject"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
```

---

### `/high-voltage/src/app/(admin)/admin/saved-designs/page.tsx`
```tsx
"use client";

import { useEffect, useState } from "react";
import { fetchAdminSavedDesignsAction } from "@/app/actions/adminActions";
import { format } from "date-fns";
import { Download, Eye, Inbox } from "lucide-react";

export default function AdminSavedDesignsPage() {
    const [designs, setDesigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAllDesigns() {
            try {
                const { data, error } = await fetchAdminSavedDesignsAction();
                if (data && !error) {
                    setDesigns(data);
                } else if (error) {
                    console.error("Failed to fetch designs", error);
                }
            } catch (err) {
                console.error("Failed to fetch all designs", err);
            } finally {
                setLoading(false);
            }
        }

        fetchAllDesigns();
    }, []);

    const exportToCsv = () => {
        const headers = ["ID", "User Name", "Email", "Design Name", "Sport", "Date"];
        const rows = designs.map(d => [
            d.id,
            d.user_name || 'N/A',
            d.user_email || 'N/A',
            `"${d.design_name}"`,
            d.sport_id,
            format(new Date(d.created_at), "yyyy-MM-dd HH:mm")
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "query_form_submissions.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 uppercase tracking-tight">
                        Query Form Submissions
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        View all inquiries and form submissions from customers.
                    </p>
                </div>
                {designs.length > 0 && (
                    <button
                        onClick={exportToCsv}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                )}
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Sport</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Form / Design Name</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Details</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        Loading designs...
                                    </td>
                                </tr>
                            ) : designs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Inbox className="w-12 h-12 opacity-10" />
                                            <p>No submissions yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                designs.map((design) => (
                                    <tr key={design.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                            {format(new Date(design.created_at), "MMM d, yyyy")}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-bold text-gray-900 leading-tight">
                                                {design.user_name || "Guest User"}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {design.user_email || "No Email"}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-900 capitalize whitespace-nowrap">
                                            {design.sport_id?.replace("-", " ") || "N/A"}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-gray-900">
                                            {design.design_name}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-gray-500 border border-gray-200 px-2 py-0.5 rounded w-fit bg-gray-50">
                                                    Pattern: {design.settings?.pattern || "Unknown"}
                                                </span>
                                                <span className="text-[10px] text-gray-500 border border-gray-200 px-2 py-0.5 rounded w-fit bg-gray-50">
                                                    Colors: {Object.keys(design.settings?.colors || {}).length}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                className="text-indigo-600 hover:text-indigo-800 transition-colors p-2"
                                                title="View Raw JSON (Dev Tool)"
                                                onClick={() => alert(`JSON Configuration:\n\n${JSON.stringify(design.settings, null, 2)}`)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
```

---

### `/high-voltage/src/app/(public)/about/page.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/ui/Footer";
import { Dock } from "@/components/ui/Dock";
import Image from "next/image";
import { Heart, Users, Shield, Sparkles, CheckCircle2 } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.6, ease: "easeOut" as const }
    }
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">

            {/* Hero */}
            <section className="relative pt-40 pb-24 px-4 md:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative max-w-4xl mx-auto text-center"
                >
                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-primary/10 px-5 py-2 rounded-full mb-8 border border-primary/20">
                        Our Story
                    </span>
                    <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase leading-[0.9] mb-6">
                        About <span className="text-primary">AF Gear</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
                        Built for Real Families. Priced Fairly.
                    </p>
                </motion.div>
            </section>

            {/* Mission Statement */}
            <section className="px-4 md:px-8 pb-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-3xl mx-auto"
                >
                    <motion.div variants={fadeUp} custom={0} className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 mb-12">
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
                            AF GEAR was created for one simple reason:
                        </p>
                        <p className="text-3xl md:text-4xl font-display font-black text-primary uppercase leading-tight mb-8">
                            Sport should be accessible to everyone.
                        </p>
                        <p className="text-muted leading-relaxed mb-6">
                            Across Ireland, families are feeling the rising cost of basic sportswear. Jerseys, training tops and half-zips were starting to feel like a luxury — and we didn&apos;t think that was right.
                        </p>
                        <p className="text-white font-bold text-lg">So we built AF GEAR.</p>
                    </motion.div>

                    {/* Values Grid */}
                    <motion.div variants={fadeUp} custom={1} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {[
                            { icon: Sparkles, text: "High-quality sportswear" },
                            { icon: Heart, text: "Fair, honest pricing" },
                            { icon: Shield, text: "No inflated brand tax" },
                            { icon: Users, text: "Built to last" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center group hover:border-primary/30 transition-colors">
                                <item.icon className="w-6 h-6 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                <p className="text-sm text-white/80 font-medium">{item.text}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* Grassroots Section */}
            <section className="px-4 md:px-8 pb-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div variants={fadeUp} custom={0} className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 block">Community First</span>
                            <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase leading-tight mb-6">
                                Grassroots First
                            </h2>
                            <p className="text-muted leading-relaxed mb-4">
                                Sport begins at grassroots level — in schoolyards, parish pitches and local clubs.
                            </p>
                            <div className="space-y-3 text-white/80">
                                <p>That&apos;s where confidence grows.</p>
                                <p>That&apos;s where friendships form.</p>
                                <p>That&apos;s where pride begins.</p>
                            </div>
                            <p className="text-muted leading-relaxed mt-6">
                                AF GEAR is designed for those moments — for the Saturday mornings, the midweek sessions, and the families who make it all happen.
                            </p>
                        </div>
                        <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/assets/1000030808.png')] bg-cover bg-center opacity-30" />
                            <div className="relative text-center px-8">
                                <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
                                <p className="text-white font-display font-black text-2xl uppercase">Community</p>
                                <p className="text-muted text-sm mt-2">At the heart of everything we do</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Giving Back Section */}
            <section className="px-4 md:px-8 pb-32">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="space-y-24"
                    >
                        {/* Intro */}
                        <motion.div variants={fadeUp} custom={0} className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase leading-[0.9] mb-6">
                                Giving Back with <span className="text-primary">AF GEAR 💚</span>
                            </h2>
                            <p className="text-xl text-muted leading-relaxed">
                                At AF GEAR, community isn&apos;t just part of what we do — it&apos;s at the heart of who we are.
                            </p>
                        </motion.div>

                        {/* Story 1: Mullinahone */}
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <motion.div variants={fadeUp} custom={1} className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                                <Image 
                                    src="/assets/mullinahone-jersey.png" 
                                    alt="Mullinahone Christmas Jersey" 
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-white font-display font-black text-2xl uppercase tracking-wider">Mullinahone GAA</p>
                                    <p className="text-primary font-bold uppercase tracking-widest text-xs mt-2">Astro Turf Pitch Project</p>
                                </div>
                            </motion.div>
                            <motion.div variants={fadeUp} custom={2} className="flex flex-col">
                                <h3 className="text-3xl font-display font-black text-white uppercase mb-6">More Than A Jersey</h3>
                                <p className="text-lg text-muted leading-relaxed mb-6">
                                    Two years ago, we created the Mullinahone Christmas Jersey with one simple goal: to give something meaningful back. Every single cent of profit from those jerseys was donated to Mullinahone GAA to help with the development of the new Astro Turf Pitch.
                                </p>
                                <p className="text-lg text-muted leading-relaxed">
                                    Knowing that those funds would help create a space where children could train, grow, and make memories for years to come meant more than any sale ever could.
                                </p>
                            </motion.div>
                        </div>

                        {/* Story 2: Sophie */}
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <motion.div variants={fadeUp} custom={3} className="flex flex-col lg:order-1 order-2">
                                <h3 className="text-3xl font-display font-black text-white uppercase mb-6">Coming Together In Hope</h3>
                                <p className="text-lg text-muted leading-relaxed mb-6">
                                    We also had the honour of designing two very special jerseys for Sophie Quirke during her illness. What started as a design became something much bigger — a community coming together in hope and support.
                                </p>
                                <p className="text-lg text-muted leading-relaxed mb-6">
                                    Every euro of profit from those jerseys went directly to Sophie and her family to help ease the burden of treatment costs.
                                </p>
                                <p className="text-lg text-white font-medium italic">
                                    &ldquo;The strength, generosity, and compassion shown by everyone who supported that campaign will never be forgotten.&rdquo;
                                </p>
                            </motion.div>
                            <motion.div variants={fadeUp} custom={4} className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group lg:order-2 order-1">
                                <Image 
                                    src="/assets/sophies-squad.png" 
                                    alt="Sophie's Support Squad" 
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-white font-display font-black text-2xl uppercase tracking-wider">Sophie&apos;s Support Squad</p>
                                    <p className="text-primary font-bold uppercase tracking-widest text-xs mt-2">Standing With Families</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Conclusion & CTA */}
                        <motion.div variants={fadeUp} custom={5} className="bg-gradient-to-br from-primary/10 via-white/5 to-transparent border border-primary/20 rounded-3xl p-8 md:p-16 text-center mt-16 relative overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
                                <p className="text-2xl md:text-3xl text-white font-black font-display uppercase leading-tight mb-8">
                                    These moments remind us why we started AF GEAR in the first place.
                                </p>
                                <div className="space-y-4 text-xl text-white/80 font-medium mb-12">
                                    <p>It&apos;s never just about sport. It&apos;s never just about jerseys.</p>
                                    <p className="text-white">It&apos;s about standing with your club. Standing with your neighbours. And standing with families when they need it most.</p>
                                </div>

                                <button className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-primary/20 border border-primary/50 rounded-full hover:bg-primary hover:text-black hover:scale-105 active:scale-95 overflow-hidden">
                                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-72 opacity-10"></span>
                                    <span className="relative flex items-center gap-2 uppercase tracking-widest">
                                        When you support AF GEAR, you&apos;re wearing community
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Meet the Founders */}
            <section className="px-4 md:px-8 pb-32">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid lg:grid-cols-2 gap-16 items-center"
                    >
                        {/* Image Side */}
                        <motion.div
                            variants={fadeUp}
                            custom={0}
                            className="relative"
                        >
                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                                <Image
                                    src="/assets/alan-mollie.jpg"
                                    alt="Alan and Mollie - Founders of AF GEAR"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Glass Overlay with Attribution */}
                                <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
                                    <p className="text-white font-display font-black text-xl uppercase tracking-wider">Alan & Mollie</p>
                                    <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mt-1">Founders of AF GEAR</p>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
                        </motion.div>

                        {/* Content Side */}
                        <motion.div
                            variants={fadeUp}
                            custom={1}
                            className="flex flex-col"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full w-fit">
                                Meet the Founders
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white uppercase leading-[0.9] mb-8">
                                A <span className="text-primary">Personal</span> Mission
                            </h2>

                            <div className="space-y-6 text-lg text-muted leading-relaxed">
                                <p>
                                    Hi, my name is Alan, owner of AF GEAR along with my daughter Mollie. I setup this business to help the normal Irish family to be able to afford sportswear.
                                </p>
                                <p>
                                    Crazy markups have put families under added pressure to kit their kids out in their favourite gear and I think it&apos;s very unfair. My aim is to keep prices low while still offering top quality sportswear that is both comfortable and durable.
                                </p>
                                <p>
                                    My daughter Mollie has shown a keen interest in the business and has helped design various products which are attractive to the younger generation.
                                </p>
                                <p className="text-white font-medium italic">
                                    &ldquo;Thanks for visiting our website and helping us grow our little business even more.&rdquo;
                                </p>
                            </div>

                            <div className="mt-12 flex flex-col gap-2">
                                <p className="text-primary font-display font-black text-2xl uppercase tracking-tighter">Alan & Mollie</p>
                                <p className="text-[10px] text-muted uppercase tracking-[0.3em]">AF GEAR Family</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Our Promise */}
            <section className="px-4 md:px-8 pb-32">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-3xl mx-auto"
                >
                    <motion.div variants={fadeUp} custom={0} className="bg-gradient-to-br from-primary/10 via-white/5 to-transparent border border-primary/20 rounded-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-display font-black text-white uppercase mb-8 text-center">Our Promise</h2>
                        <div className="grid sm:grid-cols-2 gap-4 mb-10">
                            {[
                                "Premium-quality materials",
                                "Fair pricing for families",
                                "Built for real life",
                                "Always rooted in community",
                            ].map((promise, i) => (
                                <div key={i} className="flex items-center gap-3 bg-black/30 rounded-lg px-5 py-4">
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                    <span className="text-white font-medium">{promise}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-center border-t border-white/10 pt-8">
                            <p className="text-xl text-white/80 mb-2">AF GEAR isn&apos;t about hype.</p>
                            <p className="text-3xl font-display font-black text-primary uppercase">It&apos;s about heart.</p>
                            <p className="text-muted mt-4">And we&apos;re only getting started.</p>
                        </div>
                    </motion.div>
                </motion.div>
            </section>


            <Footer />
            <Dock />
        </main>
    );
}
```

---

### `/high-voltage/src/app/(public)/checkout/page.tsx`
```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import { ChevronRight, ArrowRight, ShieldCheck, Truck, Package, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function CheckoutPage() {
    const { items, total, isLoaded, clearCart } = useCart();
    const router = useRouter();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const shippingMethod = "standard";

    // Redirect empty carts, but only AFTER hydration is complete and not currently redirecting
    useEffect(() => {
        if (isLoaded && items.length === 0 && !isRedirecting) {
            router.push("/"); // Back to home if the cart is legitimately empty
        }
    }, [items, isLoaded, router, isRedirecting]);

    const shippingCost = shippingMethod === "standard" ? 5.99 : 14.99;
    const finalTotal = total + shippingCost;

    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "IE",
    });

    // Populate Clerk user info if logged in
    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData(prev => ({
                ...prev,
                email: prev.email || user.emailAddresses[0]?.emailAddress || "",
                firstName: prev.firstName || user.firstName || "",
                lastName: prev.lastName || user.lastName || "",
            }));
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Read error from query params (if server redirected back on error)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const err = params.get("error");
            if (err) {
                toast.error(err);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, []);

    const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: items.map(i => ({ id: i.id, quantity: i.quantity, size: i.size })),
                    customerEmail: formData.email,
                    shippingMethod: "standard",
                    shippingAddress: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        address: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        country: formData.country,
                    }
                })
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                toast.error(data.error || "Failed to place order.");
                setIsLoading(false);
                return;
            }

            // Flag redirecting state to prevent empty cart check from redirecting to home
            setIsRedirecting(true);
            
            // Clear the cart
            clearCart();

            // Redirect to success page which shows confirmation then opens WhatsApp
            router.push(`/success?url=${encodeURIComponent(data.url)}&ref=${encodeURIComponent(data.orderRef)}`);
        } catch (err) {
            console.error("Checkout submission failed:", err);
            toast.error("Checkout failed. Please try again.");
            setIsLoading(false);
        }
    };

    if (!isLoaded || items.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-20 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-muted mb-8">
                    <Link href="/#shop" className="hover:text-white transition-colors">Shop</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white font-medium">Checkout</span>
                </nav>

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">

                    {/* Left Column: Checkout Form */}
                    <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            onSubmit={handleCheckout}
                            className="space-y-12"
                        >
                            {/* Hidden field for items serialization */}
                            <input type="hidden" name="items" value={JSON.stringify(items.map(i => ({ id: i.id, quantity: i.quantity, size: i.size })))} />
                            {/* Contact Information */}
                            <section>
                                <h2 className="text-2xl font-display font-black text-white uppercase mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm">1</span>
                                    Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white peer focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-transparent"
                                            placeholder="Email Address"
                                        />
                                        <label className="absolute text-muted text-sm left-4 top-4 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all">
                                            Email Address
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Address */}
                            <section>
                                <h2 className="text-2xl font-display font-black text-white uppercase mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm">2</span>
                                    Shipping Details
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white peer focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-transparent"
                                            placeholder="First Name"
                                        />
                                        <label className="absolute text-muted text-sm left-4 top-4 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all">
                                            First Name
                                        </label>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white peer focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-transparent"
                                            placeholder="Last Name"
                                        />
                                        <label className="absolute text-muted text-sm left-4 top-4 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all">
                                            Last Name
                                        </label>
                                    </div>
                                    <div className="col-span-2 relative group">
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white peer focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-transparent"
                                            placeholder="Address"
                                        />
                                        <label className="absolute text-muted text-sm left-4 top-4 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all">
                                            Address
                                        </label>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white peer focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-transparent"
                                            placeholder="City"
                                        />
                                        <label className="absolute text-muted text-sm left-4 top-4 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all">
                                            City
                                        </label>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="postalCode"
                                            required
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white peer focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-transparent"
                                            placeholder="Postal Code"
                                        />
                                        <label className="absolute text-muted text-sm left-4 top-4 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all">
                                            Postal/Zip Code
                                        </label>
                                    </div>
                                    <div className="col-span-2 relative group">
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                        >
                                            <option value="IE">Ireland</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="US">United States</option>
                                            <option value="AU">Australia</option>
                                        </select>
                                        <label className="absolute text-muted text-sm left-4 top-1 origin-[0] scale-75 transition-all">
                                            Country
                                        </label>
                                    </div>
                                </div>
                            </section>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full group relative inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-black transition-all duration-300 bg-primary rounded-xl overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                                <span className="relative flex items-center justify-center gap-2 uppercase tracking-wide">
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Place Order via WhatsApp
                                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </motion.form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 lg:sticky lg:top-24 backdrop-blur-xl"
                        >
                            <h2 className="text-xl font-display font-black text-white uppercase mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" />
                                Order Summary
                            </h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                                        <div className="relative w-16 h-20 bg-black/40 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                                                </div>
                                            )}
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-black text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#111]">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1 py-1">
                                            <h4 className="text-white font-medium text-sm line-clamp-1">{item.title}</h4>
                                            <p className="text-muted text-xs mt-1">Size: {item.size}</p>
                                            <p className="text-primary font-medium text-sm mt-1">
                                                €{((typeof item.price === "number" ? item.price : parseFloat(item.price.replace(/[^0-9.]/g, ""))) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals Calculation */}
                            <div className="space-y-3 pt-6 border-t border-white/10 mb-6">
                                <div className="flex justify-between text-muted text-sm">
                                    <span>Subtotal</span>
                                    <span className="text-white">€{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted text-sm items-center">
                                    <span>Shipping</span>
                                    <span className="text-white">€{shippingCost.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pt-6 border-t border-white/10 mb-8">
                                <div>
                                    <span className="text-white font-display font-black uppercase tracking-wider block">Total</span>
                                    <span className="text-xs text-muted">Including VAT</span>
                                </div>
                                <span className="text-3xl font-bold text-primary">€{finalTotal.toFixed(2)}</span>
                            </div>


                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
```

---

### `/high-voltage/src/app/(public)/client-home.tsx`
```tsx
"use client";

export default function ClientHome() {
    return null;
}
```

---

### `/high-voltage/src/app/(public)/collections/[slug]/CollectionClient.tsx`
```tsx
"use client";

import { motion, LayoutGroup } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductModal } from "@/components/products/ProductModal";
import { Footer } from "@/components/ui/Footer";
import { Dock } from "@/components/ui/Dock";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { DEFAULT_CATEGORIES, type Category } from "@/services/categoryService";
import { getEffectiveCategory, normalizeCategoryName, productBelongsToCategory } from "@/utils/productUtils";


// ── Fallback static maps (used when no category matches the dynamic list) ──
const STATIC_COLLECTION_MAP: Record<string, string> = {
    club: "Club",
    limerick: "Limerick",
    tipperary: "Tipperary",
    irish: "Gaeilge",
    gaeilge: "Gaeilge",
    "pub-jerseys": "Pub Jerseys",
    "club-sweaters": "Club Sweaters",
};

const STATIC_TAGLINE_MAP: Record<string, string> = {
    club: "CLUB GEAR",
    limerick: "TREATY CITY",
    tipperary: "PREMIER COUNTY",
    irish: "GAEILGE",
    gaeilge: "GAEILGE",
    "pub-jerseys": "SOCIAL GEAR",
};

const STATIC_CREST_MAP: Record<string, string | undefined> = {
    limerick: "/assets/limerick_crest_final.png",
    tipperary: "/assets/tipperary_crest_final.png",
};

interface SelectedProduct {
    id: string | number;
    slug?: string;
    title: string;
    price: string | number;
    image?: string;
    category: string;
    description?: string;
    status?: string;
}

export default function CollectionClient({
    slug,
    products,
    categories,
}: {
    slug: string;
    products: any[];
    categories?: Category[];
}) {
    const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);

    // Build dynamic lookup maps from the categories list
    const allCategories = (categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES);

    // Build a slug -> category.name map (also support the legacy gaeilge -> Irish mapping)
    const COLLECTION_MAP: Record<string, string> = {
        ...STATIC_COLLECTION_MAP,
        irish: "Gaeilge",
        gaeilge: "Gaeilge",
        "club-sweaters": "Club Sweaters",
        ...Object.fromEntries(allCategories.map(c => [c.slug, c.name])),
    };

    const TAGLINE_MAP: Record<string, string> = {
        gaeilge: "GAEILGE",  // legacy alias
        "club-sweaters": "PREMIUM SWEATERS",
        ...Object.fromEntries(allCategories.map(c => [c.slug, c.tagline || c.name.toUpperCase()])),
    };

    const CREST_MAP: Record<string, string | undefined> = {
        ...STATIC_CREST_MAP,  // keep static crests as fallback
        ...Object.fromEntries(allCategories.filter(c => c.crest).map(c => [c.slug, c.crest])),
    };

    const collectionKey = COLLECTION_MAP[slug];
    const normalizedCollectionKey = collectionKey ? normalizeCategoryName(collectionKey) : undefined;
    const crest = CREST_MAP[slug];
    const tagline = TAGLINE_MAP[slug] || "AF GEAR";

    const { scrollY } = useScroll();
    const parallaxY = useTransform(scrollY, [0, 1000], ["0%", "30%"]);
    const titleGlow = useTransform(scrollY, [0, 200], [0.3, 0.6]);

    // Filter products by category - Lenient matching
    const collectionProducts = products
        .filter(p => {
            if (!collectionKey) return true;

            return productBelongsToCategory(p, normalizedCollectionKey || collectionKey || slug);
        })
        .map(p => ({
            id: p.id,
            slug: p.slug,
            title: p.name,
            price: p.price ? `€${p.price}` : 'Contact for Price',
            image: p.images?.[0] || '/placeholder.png',
            category: getEffectiveCategory(p),
            status: p.product_status,
            stockStatus: p.stock_status
        }));

    const collection = {
        title: normalizedCollectionKey || collectionKey || "Collection",
        subtitle: `Premium ${normalizedCollectionKey || collectionKey || ''} Selection`,
        products: collectionProducts
    };

    if (!collectionKey) {
        return (
            <main className="min-h-screen bg-background flex flex-col items-center justify-center">
                <h1 className="text-4xl font-display font-black text-white uppercase mb-4">
                    Collection Not Found
                </h1>
                <Link
                    href="/#shop"
                    className="text-primary font-bold uppercase tracking-widest text-sm hover:text-white transition-colors"
                >
                    ← Back to Shop
                </Link>
            </main>
        );
    }

    return (
        <LayoutGroup>
            <main className="min-h-screen bg-background selection:bg-primary selection:text-black relative">

                {/* Parallax Background Text */}
                <motion.div
                    style={{ y: parallaxY }}
                    className="fixed top-[15%] w-full overflow-hidden whitespace-nowrap opacity-[0.02] select-none pointer-events-none z-0 flex justify-center"
                >
                    <h2 className="text-[25vw] font-display font-black text-white leading-none tracking-tighter">
                        {tagline}
                    </h2>
                </motion.div>

                {/* Kinetic Hero */}
                <section className="relative pt-32 pb-20 px-4 md:px-8 min-h-[55vh] flex flex-col justify-center items-center z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                    <Link
                        href="/#shop"
                        className="absolute top-24 left-4 md:left-8 inline-flex items-center gap-2 text-muted hover:text-white text-xs font-bold uppercase tracking-widest transition-colors z-20 backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </Link>

                    <div className="relative w-full max-w-[1600px] mx-auto flex flex-col items-center">
                        {crest ? (
                            <motion.img
                                src={crest}
                                alt=""
                                className="w-20 h-20 md:w-28 md:h-28 object-contain mb-6 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                        ) : (
                            <div className="h-16" />
                        )}

                        {/* Title - Fully Visible */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                            className="text-6xl md:text-8xl lg:text-[10rem] font-display font-black uppercase leading-[0.85] text-center"
                        >
                            <span className="text-primary drop-shadow-[0_0_60px_rgba(74,222,128,0.3)]">
                                {collection.title}
                            </span>
                        </motion.h1>

                        {/* Subtle outline echo behind */}
                        <motion.div
                            style={{ opacity: titleGlow }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
                        >
                            <h1
                                className="text-7xl md:text-9xl lg:text-[12rem] font-display font-black uppercase leading-[0.85] text-transparent opacity-[0.04] blur-[1px]"
                                style={{ WebkitTextStroke: "2px rgba(255,255,255,0.3)" }}
                            >
                                {collection.title}
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-muted text-lg md:text-2xl mt-6 max-w-2xl text-center font-medium leading-relaxed"
                        >
                            {collection.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="mt-6"
                        >
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-5 py-2.5 rounded-full border border-primary/20">
                                <ShoppingBag className="w-4 h-4 inline mr-2 -translate-y-0.5" />
                                {collection.products.length} Exclusive Items
                            </span>
                        </motion.div>
                    </div>
                </section>

                {/* Product Grid - Magazine Bento */}
                <section className="relative px-4 md:px-8 pb-32 z-10">
                    <div className="max-w-[1600px] mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
                        >
                            {collection.products.map((product, i) => {
                                const isHero = i === 0;
                                const isAccent = i === 3 || i === 6;
                                const spanClass = isHero
                                    ? "col-span-2 row-span-2"
                                    : isAccent
                                        ? "md:col-span-2 lg:col-span-1"
                                        : "";
                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                        viewport={{ once: true, amount: 0.05 }}
                                        transition={{
                                            delay: 0.06 * i,
                                            duration: 0.5,
                                            ease: [0.25, 0.1, 0.25, 1],
                                        }}
                                        className={`${spanClass} group/card relative`}
                                    >
                                        <ProductCard
                                            id={product.id}
                                            slug={product.slug}
                                            title={product.title}
                                            category={product.category}
                                            price={product.price}
                                            image={product.image}
                                            status={product.status}
                                            stockStatus={(product as any).stockStatus}
                                            isHero={isHero}
                                            onQuickAdd={() => setSelectedProduct(product)}
                                        />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>


            </main>

            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
            <Footer />
            <Dock />
        </LayoutGroup>
    );
}
```

---

### `/high-voltage/src/app/(public)/collections/[slug]/page.tsx`
```tsx
import { productService } from "@/services/productService";
import { createStaticClient } from "@/utils/supabase/static";
import { fetchCategories } from "@/services/categoryService";
import CollectionClient from "./CollectionClient";

export const dynamic = 'force-dynamic';

export default async function CollectionPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const supabase = createStaticClient();
    const [products, categories] = await Promise.all([
        productService.getProducts(),
        fetchCategories(supabase),
    ]);

    return <CollectionClient slug={slug} products={products} categories={categories} />;
}
```

---

### `/high-voltage/src/app/(public)/contact/page.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/ui/Footer";
import { Dock } from "@/components/ui/Dock";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { useState, Suspense, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { submitContactQueryAction } from "@/app/actions/contactActions";

// Form Component to handle search params
function ContactForm() {
    const searchParams = useSearchParams();
    const subjectParam = searchParams.get("subject");
    const productParam = searchParams.get("product");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: subjectParam === "interest" ? "interest" : "",
        message: productParam ? `I'm interested in the upcoming launch of: ${productParam}. Please notify me when it's available.` : "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        startTransition(async () => {
            const res = await submitContactQueryAction(formData);
            if (res.error) {
                setErrorMsg(res.error);
                return;
            }
            setSubmitted(true);
            setFormData({ ...formData, message: "" });
            setTimeout(() => setSubmitted(false), 4000);
        });
    };

    const update = (field: string, value: string) =>
        setFormData((prev) => ({ ...prev, [field]: value }));

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-5"
        >
            <h2 className="text-xl font-display font-black text-white uppercase tracking-wide mb-2">
                Send a Message
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2 block">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                        placeholder="John Murphy"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2 block">
                        Email *
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                        placeholder="john@example.com"
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2 block">
                        Phone
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                        placeholder="+353 86 XXX XXXX"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2 block">
                        Subject *
                    </label>
                    <select
                        required
                        value={formData.subject}
                        onChange={(e) => update("subject", e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                    >
                        <option value="" className="bg-[#111]">Select subject...</option>
                        <option value="interest" className="bg-[#111]">Register Interest (Launching Soon)</option>
                        <option value="custom-kit" className="bg-[#111]">Custom Kit Quote</option>
                        <option value="school-uniform" className="bg-[#111]">School Uniforms</option>
                        <option value="bulk-order" className="bg-[#111]">Bulk Order</option>
                        <option value="irish-language" className="bg-[#111]">Irish Language Jerseys</option>
                        <option value="general" className="bg-[#111]">General Enquiry</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2 block">
                    Message *
                </label>
                <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors resize-none"
                    placeholder="Tell us about your requirements..."
                />
            </div>

            <button
                type="submit"
                disabled={submitted || isPending}
                className={`w-full flex items-center justify-center gap-3 font-black uppercase tracking-[0.15em] text-sm py-4 rounded-sm transition-all duration-300 ${submitted || isPending
                    ? "bg-primary/50 text-black/50 cursor-not-allowed"
                    : "bg-primary text-black hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(102,187,106,0.5)]"
                    }`}
            >
                <Send className="w-4 h-4" />
                {isPending ? "Sending..." : submitted ? "Message Sent ✓" : "Send Message"}
            </button>

            {errorMsg && (
                <p className="text-red-400 text-sm text-center font-bold">{errorMsg}</p>
            )}

            {submitted && (
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-primary text-sm text-center font-bold"
                >
                    Thanks! We&apos;ll be in touch within 24 hours.
                </motion.p>
            )}
        </form>
    );
}

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            {/* Hero */}
            <section className="relative pt-40 pb-16 px-4 md:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/8 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative max-w-4xl mx-auto text-center"
                >
                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-primary bg-primary/10 px-5 py-2 rounded-full mb-8 border border-primary/20">
                        Get in Touch
                    </span>
                    <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase leading-[0.9] mb-6">
                        Contact <span className="text-primary">Us</span>
                    </h1>
                    <p className="text-xl text-white/70 max-w-xl mx-auto leading-relaxed">
                        Have a question about custom kits, school uniforms, or bulk orders? We&apos;d love to hear from you.
                    </p>
                </motion.div>
            </section>

            {/* Contact Info Cards + Form */}
            <section className="px-4 md:px-8 pb-24">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
                    {/* Left — Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-2 space-y-4"
                    >
                        {[
                            {
                                icon: Mail,
                                label: "Email",
                                value: "info@afgear.ie",
                                href: "mailto:info@afgear.ie",
                            },
                            {
                                icon: Phone,
                                label: "Phone",
                                value: "+353 86 312 5706",
                                href: "tel:+353863125706",
                            },
                            {
                                icon: MapPin,
                                label: "Location",
                                value: "Ireland",
                                href: null,
                            },
                            {
                                icon: Clock,
                                label: "Hours",
                                value: "Mon – Fri: 9am – 6pm",
                                href: null,
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start gap-4 group hover:border-primary/30 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <item.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-1">
                                        {item.label}
                                    </p>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="text-white font-medium hover:text-primary transition-colors"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="text-white font-medium">{item.value}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {/* Social / Quick Quote */}
                        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl p-6 mt-4">
                            <MessageSquare className="w-6 h-6 text-primary mb-3" />
                            <p className="text-white font-bold mb-1">Quick Quote</p>
                            <p className="text-muted text-sm leading-relaxed">
                                Need a quote for your club or school? Fill out the form and we&apos;ll get back to you within 24 hours.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right — Contact Form (Suspense Wrapper for useSearchParams) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="lg:col-span-3"
                    >
                        <Suspense fallback={<div className="text-white">Loading form...</div>}>
                            <ContactForm />
                        </Suspense>
                    </motion.div>
                </div>
            </section>

            <Footer />
            <Dock />
        </main>
    );
}
```

---

### `/high-voltage/src/app/(public)/page.tsx`
```tsx
import { Hero } from "@/components/ui/Hero";
import { CollectionsShowcase } from "@/components/products/CollectionsShowcase";
import { SchoolUniformSection } from "@/components/products/SchoolUniform/SchoolUniformSection";
import { PubJerseysSection } from "@/components/products/PubJerseysSection";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Dock } from "@/components/ui/Dock";
import { Footer } from "@/components/ui/Footer";
import { NewsletterSection } from "@/components/ui/NewsletterSection";
import { QueryFormSection } from "@/components/products/QueryFormSection";
import ClientHome from "./client-home";
import { productService } from '@/services/productService';
import { createStaticClient } from "@/utils/supabase/static";
import { fetchCategories } from '@/services/categoryService';

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

  // Fetch dynamic categories for the collections showcase
  const categories = await fetchCategories(supabase);

  return (
    <div className="min-h-screen relative selection:bg-primary selection:text-black bg-background">
      {/* Page Background Watermark */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.05]">
        <img 
          src="/assets/af-gear-hero-bg.jpg" 
          alt="" 
          className="w-full h-full object-cover scale-150 rotate-[-10deg]" 
        />
      </div>

      <ClientHome />
      {/* Pass fetched data to components */}
      <Hero heroContent={heroData?.content} />
      <CollectionsShowcase categories={categories} />
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
```

---

### `/high-voltage/src/app/(public)/products/[id]/actions.ts`
```tsx
"use server";

import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Ensure environments variables for Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role client to bypass RLS for inserting reservations
const createAdminClient = () => {
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};

export async function reserveProduct({
    productId,
    productName,
    size,
    quantity
}: {
    productId: string | number;
    productName: string;
    size: string;
    quantity: number;
}) {
    try {
        const user = await currentUser();
        if (!user) {
            return { error: "You must be logged in to reserve an item." };
        }

        const supabase = createAdminClient();

        // Use primary email address
        const userEmail = user.emailAddresses[0]?.emailAddress;

        if (!userEmail) {
            return { error: "User email not found." };
        }

        const { data, error } = await supabase
            .from("product_reservations")
            .insert({
                product_id: productId.toString(),
                product_name: productName,
                user_id: user.id,
                user_email: userEmail,
                size,
                quantity,
                status: "reserved"
            })
            .select()
            .single();

        if (error) {
            console.error("Error inserting reservation:", error);
            return { error: "Failed to reserve the item. Please try again." };
        }

        revalidatePath(`/products/${productId}`);

        return { success: true, data };
    } catch (err: unknown) {
        console.error("Reserve Exception:", err);
        return { error: "An unexpected error occurred." };
    }
}
```

---

### `/high-voltage/src/app/(public)/products/[id]/layout.tsx`
```tsx
import { productService } from "@/services/productService";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await productService.getProductById(id);

    if (!product) {
        return {
            title: "Product Not Found | AF-Gear",
            description: "The requested product does not exist.",
        };
    }

    return {
        title: `${product.name} | AF-Gear`,
        description: `Buy ${product.name} - ${product.category}. Premium teamwear made to last.`,
        openGraph: {
            title: product.name,
            description: `Checkout ${product.name} starting at ${product.price}.`,
            images: [
                {
                    url: product.images?.[0] || '',
                    width: 800,
                    height: 800,
                    alt: product.name,
                }
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: `Checkout ${product.name} starting at ${product.price}.`,
            images: [product.images?.[0] || ''],
        },
    };
}

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
```

---

### `/high-voltage/src/app/(public)/products/[id]/page.tsx`
```tsx
import { productService } from "@/services/productService";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

export default async function ProductPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ type?: string }>;
}) {
    const { id } = await params;
    const { type } = await searchParams;
    const product = await productService.getProductBySlug(id);

    if (!product) {
        notFound();
    }

    // Fetch Reviews
    let reviews: any[] = [];
    try {
        const { createClient } = await import("@/utils/supabase/server");
        const supabase = await createClient();
        if (supabase) {
            const { data } = await supabase
                .from("reviews")
                .select("*")
                .eq("product_id", product.id)
                .order("created_at", { ascending: false });
            if (data) reviews = data;
        }
    } catch (e) {
        console.warn("Could not fetch reviews (likely missing Supabase configuration):", e instanceof Error ? e.message : e);
    }

    const mappedProduct = {
        ...product,
        title: product.name,
        image: product.images?.[0] || '',
        defaultKids: type === 'kids',
    };

    return <ProductClient product={mappedProduct} initialReviews={reviews || []} />;
}
```

---

### `/high-voltage/src/app/(public)/products/[id]/ProductClient.tsx`
```tsx
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Info, ShoppingBag, Plus, Minus, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { ReviewSection } from "@/components/products/ReviewSection";
import { ProductImageMagnifier } from "@/components/products/ProductImageMagnifier";
import { useCart } from "@/contexts/CartContext";
import { reserveProduct } from "./actions";
import { toast } from "sonner";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

const SIZE_CHART_ADULT = "/assets/size-charts/puffer-jacket-adult.png";

const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0, scale: 0.97 }),
};

export default function ProductClient({ product, initialReviews = [] }: { product: any, initialReviews?: any[] }) {
    const { isLoaded, isSignedIn } = useUser();
    const { addToCart } = useCart();

    const [activeTab, setActiveTab] = useState("description");
    const [sizeType, setSizeType] = useState(product?.defaultKids ? "Kids" : "Adults");
    const [selectedSize, setSelectedSize] = useState(product?.defaultKids ? "3-4Y" : "M");
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);

    const isSizeChart = (img: string) => img.includes('size-charts/') || (product?.sizeChart && img === product.sizeChart);

    const priceNum = typeof product?.price === "number" ? product.price : parseFloat((product?.price || "0").replace(/[^0-9.]/g, ""));
    const additionTotal = (priceNum * quantity).toFixed(2);

    // Build thumbnails array
    const thumbnails: string[] = product?.images?.length > 0
        ? [...product.images]
        : (product?.image ? [product.image] : []);

    if (product?.sizeChart) {
        thumbnails.push(product.sizeChart);
    }
    if (sizeType === "Adults") {
        thumbnails.push(SIZE_CHART_ADULT);
    }

    const safeIndex = Math.min(activeIndex, thumbnails.length - 1);
    const activeImage = thumbnails[safeIndex] || product?.image;

    const paginate = useCallback((newDirection: number) => {
        setActiveIndex(([prev]) => {
            const next = prev + newDirection;
            if (next < 0 || next >= thumbnails.length) return [prev, 0];
            return [next, newDirection];
        });
    }, [thumbnails.length]);

    const goToSlide = useCallback((index: number) => {
        setActiveIndex(([prev]) => [index, index > prev ? 1 : -1]);
    }, []);

    // Swipe handlers
    const swipeThreshold = 50;
    const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
        if (info.offset.x > swipeThreshold) paginate(-1);
        else if (info.offset.x < -swipeThreshold) paginate(1);
    };

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            <div className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 md:px-8 max-w-[1400px] mx-auto">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted mb-4 sm:mb-6 md:mb-8 overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/#shop" className="hover:text-primary transition-colors">Shop</Link>
                    <span>/</span>
                    <span className="text-white truncate max-w-[200px]">{product.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">

                    {/* LEFT: Image Gallery with Slider */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-3 sm:space-y-4"
                    >
                        {/* Main Image with Arrows */}
                        <div className="relative aspect-square sm:aspect-[3/4] bg-background-elevated rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 group">
                            
                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                <motion.div
                                    key={safeIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.05}
                                    onDragEnd={handleDragEnd}
                                    className="absolute inset-0"
                                >
                                    <ProductImageMagnifier
                                        src={activeImage}
                                        alt={product.title}
                                        className="w-full h-full"
                                        objectFit={isSizeChart(activeImage) ? 'contain' : 'cover'}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Category Badge */}
                            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 pointer-events-none z-10">
                                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-widest border border-white/10">
                                    {product.category}
                                </span>
                            </div>

                            {/* Prev/Next Arrow Buttons */}
                            {thumbnails.length > 1 && (
                                <>
                                    <button
                                        onClick={() => paginate(-1)}
                                        disabled={safeIndex === 0}
                                        className={`absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                                            safeIndex === 0
                                                ? 'bg-black/20 text-white/20 cursor-not-allowed'
                                                : 'bg-black/50 backdrop-blur-sm text-white hover:bg-primary hover:text-black hover:scale-110 active:scale-95 shadow-lg'
                                        }`}
                                    >
                                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </button>
                                    <button
                                        onClick={() => paginate(1)}
                                        disabled={safeIndex >= thumbnails.length - 1}
                                        className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                                            safeIndex >= thumbnails.length - 1
                                                ? 'bg-black/20 text-white/20 cursor-not-allowed'
                                                : 'bg-black/50 backdrop-blur-sm text-white hover:bg-primary hover:text-black hover:scale-110 active:scale-95 shadow-lg'
                                        }`}
                                    >
                                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </button>
                                </>
                            )}

                            {/* Slide Counter */}
                            {thumbnails.length > 1 && (
                                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
                                    {safeIndex + 1} / {thumbnails.length}
                                </div>
                            )}

                            {/* Dot Indicators (mobile) */}
                            {thumbnails.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 lg:hidden">
                                    {thumbnails.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => goToSlide(i)}
                                            className={`rounded-full transition-all duration-300 ${
                                                i === safeIndex
                                                    ? 'w-6 h-2 bg-primary'
                                                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                            {thumbnails.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => goToSlide(i)}
                                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg border-2 snap-start ${
                                        safeIndex === i ? "border-primary shadow-[0_0_12px_rgba(102,187,106,0.3)]" : "border-white/10"
                                    } bg-background-elevated overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-200 relative`}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${i + 1}`}
                                        width={96}
                                        height={96}
                                        className={`opacity-80 hover:opacity-100 transition-opacity ${isSizeChart(img) ? 'object-contain p-1 bg-black' : 'object-cover'}`}
                                    />
                                    {(product.sizeChart && img === product.sizeChart || img === SIZE_CHART_ADULT) && (
                                        <div className="absolute inset-0 flex items-end justify-center pb-1 bg-gradient-to-t from-black/60 to-transparent">
                                            <span className="text-[7px] sm:text-[8px] font-bold uppercase text-white bg-primary/80 px-1.5 py-0.5 rounded-sm tracking-wider">Size Chart</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT: Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black text-white uppercase leading-tight">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-3 sm:gap-4">
                            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">€{priceNum}</span>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm border ${
                                product.stock_status === 'in_stock' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                product.stock_status === 'out_of_stock' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                                {String(product.stock_status || 'in_stock').replace('_', ' ')}
                            </span>
                        </div>

                        {/* Size Selector */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-3">Select Size</h3>
                            <div className="flex gap-2 mb-3">
                                {["Kids", "Adults"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => { setSizeType(tab); setSelectedSize(tab === "Kids" ? "3-4Y" : "M"); setActiveIndex([0, 0]); }}
                                        className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${
                                            sizeType === tab ? "bg-primary text-black" : "bg-white/5 text-muted hover:text-white border border-white/10"
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(sizeType === "Kids"
                                    ? ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13Y"]
                                    : ["XS", "S", "M", "L", "XL", "2XL"]
                                ).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedSize(s)}
                                        className={`min-w-[44px] sm:min-w-[48px] h-11 sm:h-12 px-3 flex items-center justify-center border font-bold text-sm transition-all rounded-sm ${
                                            selectedSize === s
                                                ? "border-primary bg-primary text-black"
                                                : "border-white/20 text-muted hover:border-white hover:text-white"
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="bg-white/5 border border-primary/30 rounded-xl p-5 sm:p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="relative z-10">
                                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    Premium Quality Guarantee
                                </h3>
                                <p className="text-sm text-muted mb-3">
                                    Every piece of AF Gear teamwear is engineered for performance and durability.
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-muted uppercase tracking-wider">
                                    <Info className="w-3 h-3 text-primary" />
                                    <span>Fast lead times on all orders.</span>
                                </div>
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-3">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className={`w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center border rounded-sm transition-all ${
                                        quantity <= 1 ? 'border-red-500/50 text-red-400 cursor-not-allowed' : 'border-white/20 text-white hover:border-primary hover:text-primary'
                                    }`}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-lg font-bold text-white min-w-[32px] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center border border-white/20 text-white rounded-sm hover:border-primary hover:text-primary transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="flex gap-4">
                            <AnimatedButton
                                onClick={() => {
                                    if (!product) return;
                                    addToCart({
                                        id: product.id,
                                        title: product.title,
                                        price: product.price,
                                        image: product.image,
                                        category: product.category,
                                        size: selectedSize,
                                        quantity,
                                    });
                                    setAddedToCart(true);
                                    toast.success(
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-sm">{quantity}x {product.title}</span>
                                            <span className="text-xs text-muted">Size {selectedSize} added to your cart.</span>
                                        </div>,
                                        { icon: <ShoppingBag className="w-4 h-4 text-primary" />, duration: 3000 }
                                    );
                                    setTimeout(() => setAddedToCart(false), 2000);
                                }}
                                variant="primary"
                                animation="pro-max"
                                className={`flex-1 w-full !py-4 !text-sm sm:!text-base ${addedToCart ? "!bg-green-500 !text-white !border-green-500 !shadow-[0_0_40px_rgba(34,197,94,0.4)]" : ""}`}
                            >
                                {addedToCart ? (
                                    <><Check className="w-5 h-5 animate-[bounce_0.5s_ease-out]" /> Added to Cart</>
                                ) : (
                                    <><ShoppingBag className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" /> Add to Cart — €{additionTotal}</>
                                )}
                            </AnimatedButton>
                        </div>

                        {/* Trust Elements */}
                        <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[9px] sm:text-[10px] text-muted font-medium uppercase tracking-wider">
                            <div className="flex flex-col items-center gap-1">
                                <svg className="w-5 h-5 text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Quality Guarantee
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <svg className="w-5 h-5 text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Secure Checkout
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <svg className="w-5 h-5 text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Fast Delivery
                            </div>
                        </div>

                        {/* Info Tabs */}
                        <div className="space-y-3 sm:space-y-4">
                            {[
                                { id: "description", label: "Description", content: "Engineered for elite performance. Featuring moisture-wicking technology, reinforced stitching for durability, and an athletic cut designed for movement. Perfect for match day or intense training sessions." },
                                { id: "shipping", label: "Shipping & Delivery", content: "Orders are processed within 24 hours. Standard delivery takes 3-5 business days. International shipping available." },
                                { id: "returns", label: "Returns Policy", content: "30-day return window for unworn items in original packaging. Customised teamwear cannot be returned unless faulty." },
                            ].map((tab) => (
                                <div key={tab.id} className="border-b border-white/10 pb-3 sm:pb-4">
                                    <button
                                        onClick={() => setActiveTab(activeTab === tab.id ? "" : tab.id)}
                                        className="w-full flex items-center justify-between text-left group py-1"
                                    >
                                        <span className={`text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === tab.id ? "text-primary" : "text-white group-hover:text-primary"}`}>
                                            {tab.label}
                                        </span>
                                        {activeTab === tab.id ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                                    </button>
                                    <AnimatePresence>
                                        {activeTab === tab.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="pt-3 sm:pt-4 text-muted text-xs sm:text-sm leading-relaxed">
                                                    {tab.content}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <ReviewSection
                    productId={product.id}
                    initialReviews={initialReviews}
                    isSignedIn={!!isSignedIn}
                />
            </div>
        </main>
    );
}
```

---

### `/high-voltage/src/app/(public)/profile/page.tsx`
```tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Play, Mail, Calendar, Settings, Package, ArrowRight, Truck, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useUser, useAuth, useClerk } from "@clerk/nextjs";

export default function ProfilePage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const { openUserProfile } = useClerk();
    const [designs, setDesigns] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingDesigns, setLoadingDesigns] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        async function fetchUserData() {
            if (!isLoaded || !isSignedIn || !user) {
                if (isLoaded && !isSignedIn) {
                    setLoadingDesigns(false);
                    setLoadingOrders(false);
                }
                return;
            }

            try {
                const clerkToken = await getToken({ template: "supabase" }) || undefined;
                const supabase = createClient(clerkToken);
                const [designsRes, ordersRes] = await Promise.all([
                    supabase
                        .from("saved_designs")
                        .select("*")
                        .eq("user_id", user.id)
                        .order("created_at", { ascending: false }),
                    supabase
                        .from("orders")
                        .select("*")
                        .eq("user_email", user.primaryEmailAddress?.emailAddress)
                        .order("created_at", { ascending: false })
                ]);

                if (designsRes.error) throw designsRes.error;
                if (designsRes.data) setDesigns(designsRes.data);

                if (ordersRes.error) throw ordersRes.error;
                if (ordersRes.data) setOrders(ordersRes.data);
            } catch (err) {
                console.error("Failed to fetch user data", err);
            } finally {
                setLoadingDesigns(false);
                setLoadingOrders(false);
            }
        }

        fetchUserData();
    }, [isLoaded, isSignedIn, user]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-display font-black text-white uppercase mb-4">Access Denied</h1>
                <p className="text-muted mb-8 text-center max-w-md">You need to be signed in to view your profile and saved designs.</p>
                <Link href="/" className="bg-primary text-black font-bold uppercase text-xs tracking-widest px-8 py-3 rounded hover:bg-primary/90 transition-colors">
                    Back to Home
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background pt-32 pb-24 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* User Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-primary/20 p-2 relative z-10">
                            <Image
                                src={user.imageUrl}
                                alt={user.fullName || "User"}
                                width={160}
                                height={160}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-20" />
                    </div>

                    {/* User Details */}
                    <div className="flex-grow text-center md:text-left relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-display font-black uppercase text-white tracking-tight mb-2">
                                    {user.firstName} <span className="text-primary">{user.lastName}</span>
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4 text-primary/50" />
                                        <span>{user.primaryEmailAddress?.emailAddress}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-primary/50" />
                                        <span>Joined {format(new Date(user.createdAt!), "MMMM yyyy")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                                <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    {orders.length} Orders
                                </span>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                                <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    {designs.length} Form Queries
                                </span>
                            </div>
                            <button
                                onClick={() => openUserProfile()}
                                className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 px-4 py-2 cursor-pointer bg-transparent border-none outline-none"
                            >
                                <Settings className="w-4 h-4" /> Edit Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* My Orders Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                        <h2 className="text-xl font-display font-black uppercase tracking-tight text-white flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-primary rounded-full" />
                            My Orders
                        </h2>
                    </div>

                    {loadingOrders ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-colors">
                                    {/* Order Info */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-bold text-white uppercase tracking-widest">
                                                Order from {format(new Date(order.created_at), "MMM d, yyyy")}
                                            </span>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    order.status === 'shipped' ? 'bg-primary/10 text-primary border-primary/20' :
                                                        'bg-white/5 text-white/70 border-white/10'
                                                }`}>
                                                {order.status === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
                                                {order.status === 'shipped' && <Truck className="w-3 h-3" />}
                                                {order.status !== 'delivered' && order.status !== 'shipped' && <Package className="w-3 h-3" />}
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted">
                                            {order.items?.length || 0} items • <span className="text-white font-bold">€{Number(order.amount).toFixed(2)}</span>
                                        </p>
                                    </div>

                                    {/* Action */}
                                    <div className="shrink-0 flex items-center gap-3">
                                        <Link
                                            href={`/track-order?id=${order.order_reference}`}
                                            className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-black font-bold uppercase tracking-widest px-6 py-3 rounded text-xs transition-colors flex items-center gap-2"
                                        >
                                            Track Order <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/5">
                            <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
                            <p className="text-muted text-lg mb-4">You haven&apos;t placed any orders yet.</p>
                            <Link
                                href="/#shop"
                                className="inline-block bg-primary text-black font-bold uppercase text-xs tracking-widest px-8 py-4 rounded hover:brightness-110 transition-colors"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                        <h2 className="text-xl font-display font-black uppercase tracking-tight text-white flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-primary rounded-full" />
                            Form Queries
                        </h2>
                    </div>

                    {loadingDesigns ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        </div>
                    ) : designs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {designs.map((design) => (
                                <div key={design.id} className="bg-background-card border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors group">
                                    <h3 className="text-xl font-bold text-white mb-2">{design.design_name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-muted font-bold uppercase tracking-widest mb-6">
                                        <span>{design.sport_id.replace("-", " ")}</span>
                                        <span>•</span>
                                        <Clock className="w-3 h-3" />
                                        <span>{formatDistanceToNow(new Date(design.created_at), { addSuffix: true })}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="text-[10px] uppercase font-bold text-white/50 bg-white/5 px-2 py-1 rounded">
                                            Pattern: {design.settings?.pattern || "solid"}
                                        </span>
                                        <span className="text-[10px] uppercase font-bold text-white/50 bg-white/5 px-2 py-1 rounded">
                                            Colors: {Object.keys(design.settings?.colors || {}).length}
                                        </span>
                                    </div>

                                    {/* Link to Query Form (Ideally this would serialize settings back to state) */}
                                    <Link
                                        href={`/query-form/${design.sport_id}`}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest py-3 rounded flex items-center justify-center gap-2 transition-colors group-hover:bg-primary group-hover:text-black"
                                    >
                                        <Play className="w-4 h-4" /> Load Design
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-background-elevated rounded-xl border border-white/5">
                            <p className="text-muted text-lg mb-4">You haven&apos;t submitted any queries yet.</p>
                            <Link
                                href="/query-form"
                                className="inline-block bg-primary text-black font-bold uppercase text-xs tracking-widest px-8 py-4 rounded hover:bg-primary/90 transition-colors"
                            >
                                Start Query
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
```

---

### `/high-voltage/src/app/(public)/query-form/page.tsx`
```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SPORTS } from "@/lib/query-form-config";
import type { SportConfig } from "@/lib/query-form-config";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getSportIcon } from "@/components/products/QueryFormSection";

function SportCard({ sport, index }: { sport: SportConfig; index: number }) {
    const [imgFailed, setImgFailed] = useState(false);
    const showImage = sport.image && !imgFailed;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link
                href={`/query-form/${sport.id}`}
                className="group relative block rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-all duration-500 active:scale-[0.98]"
            >
                {/* Card Content */}
                <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Sport Image */}
                    {showImage ? (
                        <Image
                            src={sport.image as string}
                            alt={sport.name}
                            fill
                            className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                            onError={() => setImgFailed(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/[0.04] to-transparent">
                            {getSportIcon(sport.id, "w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 text-white/10 group-hover:text-primary/40 transition-colors duration-500")}
                        </div>
                    )}

                    {/* Dark Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Hover Neon Edge */}
                    <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/20 group-hover:shadow-[inset_0_0_30px_rgba(102,187,106,0.05)] transition-all duration-500" />

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6">
                        {/* Sport Icon Badge */}
                        <div className="mb-2 sm:mb-3 flex items-center gap-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                                {getSportIcon(sport.id, "w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60 group-hover:text-primary transition-colors")}
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-primary/60 transition-colors">
                                {sport.garments.length} items
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg sm:text-xl md:text-2xl font-display font-black text-white uppercase tracking-wider leading-tight group-hover:text-primary transition-colors duration-300">
                            {sport.name}
                        </h2>
                        <p className="text-white/30 text-[11px] sm:text-xs mt-1 line-clamp-1 group-hover:text-white/50 transition-colors">
                            {sport.subtitle}
                        </p>

                        {/* CTA Arrow */}
                        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-primary transition-all duration-300">
                            <span>Get a Quote</span>
                            <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Top Right Badge */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                        <div className="bg-primary/90 backdrop-blur-md text-black px-2.5 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-[0_0_20px_rgba(102,187,106,0.3)]">
                            Inquire
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function QueryFormPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            {/* Hero Section */}
            <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 md:px-8 overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[300px] md:h-[400px] bg-primary/[0.04] blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-[1400px] mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-primary/70 bg-primary/[0.08] border border-primary/15 px-4 sm:px-5 py-2 rounded-full mb-5 sm:mb-6 backdrop-blur-sm">
                            <Sparkles className="w-3 h-3" />
                            Custom Teamwear
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase leading-[0.9] tracking-tight">
                            Get Your
                            <br />
                            <span className="text-primary">Perfect Kit</span>
                        </h1>
                        <p className="text-white/30 text-xs sm:text-sm md:text-base max-w-md mx-auto mt-3 sm:mt-4 leading-relaxed px-4">
                            Choose your sport and submit an inquiry. Our team will design a kit you&apos;ll love.
                        </p>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mt-6 sm:mt-8"
                    />
                </div>
            </section>

            {/* Sport Selection Grid */}
            <section className="px-4 md:px-8 pb-20 sm:pb-24">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                        {SPORTS.map((sport, i) => (
                            <SportCard key={sport.id} sport={sport} index={i} />
                        ))}
                    </div>

                    {/* Coming Soon */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: SPORTS.length * 0.1 + 0.2 }}
                        className="mt-10 sm:mt-12 text-center"
                    >
                        <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-full px-5 sm:px-6 py-2.5 sm:py-3">
                            <div className="w-2 h-2 rounded-full bg-white/10 animate-pulse" />
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/20">
                                More Sports Coming Soon
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
```

---

### `/high-voltage/src/app/(public)/query-form/[sport]/page.tsx`
```tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getSportById } from "@/lib/query-form-config";
import {
    ArrowLeft, Send, User, Mail, Phone, Users, Hash,
    Palette, FileText, Upload, CheckCircle, Loader2, Shield
} from "lucide-react";
import { submitQueryForm, uploadCrestAction } from "@/app/actions/queryFormActions";
import { getSportIcon } from "@/components/products/QueryFormSection";

function FormInput({ label, icon: Icon, value, onChange, placeholder, type = "text", required = false }: {
    label: string
    icon: React.ComponentType<{ className?: string }>
    value: string
    onChange: (v: string) => void
    placeholder?: string
    type?: string
    required?: boolean
}) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
                <Icon className="w-3.5 h-3.5 text-primary/60" />
                {label}
                {required && <span className="text-primary">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className="w-full min-h-[48px] bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-200 hover:border-white/15"
            />
        </div>
    );
}

function FormTextarea({ label, icon: Icon, value, onChange, placeholder, rows = 4 }: {
    label: string
    icon: React.ComponentType<{ className?: string }>
    value: string
    onChange: (v: string) => void
    placeholder?: string
    rows?: number
}) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
                <Icon className="w-3.5 h-3.5 text-primary/60" />
                {label}
            </label>
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-200 hover:border-white/15 resize-none"
            />
        </div>
    );
}

function FormSelect({ label, icon: Icon, value, onChange, options, required = false }: {
    label: string
    icon: React.ComponentType<{ className?: string }>
    value: string
    onChange: (v: string) => void
    options: { value: string; label: string }[]
    required?: boolean
}) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
                <Icon className="w-3.5 h-3.5 text-primary/60" />
                {label}
                {required && <span className="text-primary">*</span>}
            </label>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                required={required}
                className="w-full min-h-[48px] bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-200 hover:border-white/15 appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
                <option value="" className="bg-[#111]">Select...</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-[#111]">{opt.label}</option>
                ))}
            </select>
        </div>
    );
}

export default function SportInquiryPage() {
    const params = useParams();
    const sportId = params.sport as string;
    const sport = getSportById(sportId);

    // Form state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [clubName, setClubName] = useState("");
    const [teamLevel, setTeamLevel] = useState("");
    const [quantity, setQuantity] = useState("");
    const [preferredColors, setPreferredColors] = useState("");
    const [requirements, setRequirements] = useState("");
    const [crestFile, setCrestFile] = useState<File | null>(null);

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    if (!sport) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-display font-black text-white uppercase">Sport Not Found</h1>
                    <Link href="/query-form" className="text-primary text-sm mt-4 inline-block hover:underline">
                        ← Back to Query Form
                    </Link>
                </div>
            </main>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!fullName.trim() || !email.trim() || !phone.trim()) {
            setError("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            let uploadedCrestUrl = "";
            if (crestFile) {
                const formData = new FormData();
                formData.append("file", crestFile);
                const uploadRes = await uploadCrestAction(formData);
                if (uploadRes.error) {
                    setError(`Failed to upload crest: ${uploadRes.error}`);
                    setIsSubmitting(false);
                    return;
                }
                uploadedCrestUrl = uploadRes.url || "";
            }

            const result = await submitQueryForm({
                sportId,
                sportName: sport.name,
                fullName: fullName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                clubName: clubName.trim(),
                teamLevel,
                quantity,
                preferredColors: preferredColors.trim(),
                requirements: requirements.trim(),
                crestUrl: uploadedCrestUrl,
            });

            if (result.success) {
                setSubmitted(true);
            } else {
                setError(result.error || "Something went wrong. Please try again.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">

            {/* Header */}
            <header className="bg-black/50 backdrop-blur-md border-b border-white/[0.06] sticky top-16 z-40 px-4 md:px-8 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Link href="/query-form" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            {getSportIcon(sport.id, "w-5 h-5 text-primary")}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest">
                                <span>Query Form</span>
                                <span>/</span>
                                <span className="text-primary font-bold">{sport.name}</span>
                            </div>
                            <h1 className="text-lg md:text-xl font-display font-black text-white uppercase tracking-wide">
                                Form Inquiry
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">

                <AnimatePresence mode="wait">
                    {submitted ? (
                        /* Success State */
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16 md:py-24"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"
                            >
                                <CheckCircle className="w-10 h-10 text-primary" />
                            </motion.div>
                            <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase mb-3">
                                Form <span className="text-primary">Submitted!</span>
                            </h2>
                            <p className="text-white/40 text-sm max-w-md mx-auto mb-8">
                                Thank you for your interest! Our team will review your requirements and get back to you within 24-48 hours.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/query-form"
                                    className="inline-flex items-center justify-center gap-2 bg-white/[0.06] border border-white/[0.08] text-white font-bold uppercase text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-white/10 transition-all min-h-[48px]"
                                >
                                    Browse More Sports
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 bg-primary text-black font-bold uppercase text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-primary/90 transition-all min-h-[48px]"
                                >
                                    Back to Home
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        /* Form */
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Intro */}
                            <div className="text-center mb-8 md:mb-10">
                                <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight mb-2">
                                    {sport.name} <span className="text-primary">Query Form</span>
                                </h2>
                                <p className="text-white/40 text-sm max-w-lg mx-auto">
                                    Fill in your details below and our team will get in touch to discuss your custom {sport.name.toLowerCase()} kit requirements, colours, and design options.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Information */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden"
                                >
                                    <div className="px-5 md:px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Contact Information</h3>
                                            <p className="text-[11px] text-white/30">How can we reach you?</p>
                                        </div>
                                    </div>
                                    <div className="px-5 md:px-6 py-5 md:py-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormInput label="Full Name" icon={User} value={fullName} onChange={setFullName} placeholder="John Murphy" required />
                                            <FormInput label="Email Address" icon={Mail} value={email} onChange={setEmail} placeholder="john@club.ie" type="email" required />
                                            <FormInput label="Phone Number" icon={Phone} value={phone} onChange={setPhone} placeholder="+353 87 123 4567" type="tel" required />
                                            <FormInput label="Club / Organisation" icon={Shield} value={clubName} onChange={setClubName} placeholder="e.g. Limerick GAA" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Kit Requirements */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden"
                                >
                                    <div className="px-5 md:px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <Users className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Kit Requirements</h3>
                                            <p className="text-[11px] text-white/30">Tell us about your kit needs.</p>
                                        </div>
                                    </div>
                                    <div className="px-5 md:px-6 py-5 md:py-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormSelect
                                                label="Team Level"
                                                icon={Users}
                                                value={teamLevel}
                                                onChange={setTeamLevel}
                                                options={[
                                                    { value: "senior", label: "Senior" },
                                                    { value: "junior", label: "Junior" },
                                                    { value: "minor", label: "Minor" },
                                                    { value: "u21", label: "Under 21" },
                                                    { value: "u16", label: "Under 16" },
                                                    { value: "u14", label: "Under 14" },
                                                    { value: "u12", label: "Under 12" },
                                                    { value: "u10", label: "Under 10" },
                                                    { value: "school", label: "School Team" },
                                                    { value: "other", label: "Other" },
                                                ]}
                                            />
                                            <FormSelect
                                                label="Estimated Quantity"
                                                icon={Hash}
                                                value={quantity}
                                                onChange={setQuantity}
                                                options={[
                                                    { value: "1", label: "1 set (Single Item)" },
                                                    { value: "2-5", label: "2 – 5 sets" },
                                                    { value: "5-10", label: "5 – 10 sets" },
                                                    { value: "10-20", label: "10 – 20 sets" },
                                                    { value: "20-30", label: "20 – 30 sets" },
                                                    { value: "30-50", label: "30 – 50 sets" },
                                                    { value: "50-100", label: "50 – 100 sets" },
                                                    { value: "100+", label: "100+ sets" },
                                                ]}
                                            />
                                            <div className="md:col-span-2">
                                                <FormInput label="Preferred Colours" icon={Palette} value={preferredColors} onChange={setPreferredColors} placeholder="e.g. Green and White, Navy and Gold" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <FormTextarea label="Special Requirements" icon={FileText} value={requirements} onChange={setRequirements} placeholder="Tell us about any specific design ideas, patterns, sponsor logos, crests, or deadlines you have in mind..." rows={4} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Crest Upload (Visual Only for now as per original code) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden"
                                >
                                    <div className="px-5 md:px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <Upload className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Club Crest / Logo</h3>
                                            <p className="text-[11px] text-white/30">Optional — upload your crest or logo.</p>
                                        </div>
                                    </div>
                                    <div className="px-5 md:px-6 py-5 md:py-6">
                                        <div className="relative border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center hover:border-primary/30 transition-all duration-300 cursor-pointer group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setCrestFile(file);
                                                }}
                                            />
                                            <Upload className="w-8 h-8 text-white/20 group-hover:text-primary/60 mx-auto mb-3 transition-colors" />
                                            <p className="text-sm font-bold text-white/40 group-hover:text-white/60 transition-colors">
                                                {crestFile ? crestFile.name : "Click to upload crest or logo"}
                                            </p>
                                            <p className="text-[11px] text-white/20 mt-1">PNG, JPG, SVG up to 5MB</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm font-medium"
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-col sm:flex-row items-center gap-4 justify-between"
                                >
                                    <p className="text-[11px] text-white/25 text-center sm:text-left">
                                        We&apos;ll respond within 24-48 hours with design options and a quote.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-black font-black uppercase text-xs tracking-[0.15em] px-8 py-4 rounded-lg hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(102,187,106,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[52px]"
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                                        ) : (
                                            <><Send className="w-4 h-4" /> Submit Inquiry</>
                                        )}
                                    </button>
                                </motion.div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
```

---

### `/high-voltage/src/app/(public)/school-uniforms/page.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/ui/Footer";
import { Dock } from "@/components/ui/Dock";
import Link from "next/link";
import {
    ArrowRight,
    Shield,
    ShoppingBag,
    RefreshCw,
    Palette,
    Heart,
    GraduationCap,
    Trophy,
    Users,
    PartyPopper,
    Swords,
    MessageSquare,
    Package,
    CreditCard,
    Sparkles,
    Globe,
    Store,
    Handshake,
    Mail,
    Phone,
} from "lucide-react";

const WHY_CHOOSE = [
    {
        icon: Shield,
        title: "Built to Last",
        desc: "Reinforced stitching, colourfast fabrics, and durable performance materials designed for repeated washing and active school days.",
    },
    {
        icon: ShoppingBag,
        title: "Easy for Parents",
        desc: "We can create a dedicated online school shop where parents order directly — reducing admin for staff.",
    },
    {
        icon: RefreshCw,
        title: "Consistent Supply",
        desc: "We offer long-term kit continuity, so schools don't have to redesign uniforms every year.",
    },
    {
        icon: Palette,
        title: "Modern & Professional Design",
        desc: "Clean, modern sportswear that students are proud to wear.",
    },
    {
        icon: Heart,
        title: "Inclusive Options",
        desc: "Tag-free labels, comfortable fabrics and inclusive sizing to ensure every student feels confident.",
    },
];

const SCHOOL_RANGE = [
    {
        icon: GraduationCap,
        title: "Primary School PE Uniforms",
        desc: "Comfortable, durable kits built for active school days.",
    },
    {
        icon: Trophy,
        title: "Secondary School Sportswear",
        desc: "Match kits, training wear, half-zips, and performance gear for school teams.",
    },
    {
        icon: Users,
        title: "Staff & Coach Wear",
        desc: "Premium polos, jackets, tracksuits and outerwear for teachers and coaches.",
    },
    {
        icon: PartyPopper,
        title: "TY & Leavers Wear",
        desc: "Custom hoodies and commemorative gear students will actually want to wear.",
    },
    {
        icon: Swords,
        title: "School Teamwear",
        desc: "Custom kits for field sports, soccer, rugby, athletics and multi-sport programmes.",
    },
];

const HOW_IT_WORKS = [
    {
        step: "01",
        title: "Consultation",
        desc: "We discuss your needs, sport requirements, colours and budget.",
    },
    {
        step: "02",
        title: "Design & Approval",
        desc: "We create digital mock-ups for approval.",
    },
    {
        step: "03",
        title: "Sizing & Samples",
        desc: "We provide sizing guides or organise sample fittings where required.",
    },
    {
        step: "04",
        title: "Production",
        desc: "High-quality manufacturing with reliable turnaround times.",
    },
    {
        step: "05",
        title: "Delivery or Online Shop Launch",
        desc: "Bulk delivery to school or launch of your custom online school shop.",
    },
];

const CUSTOM_FEATURES = [
    "Crest embroidery",
    "School motto printing (Irish or English)",
    "House colour options",
    "Student initials",
    "Staff name embroidery",
    "Custom design consultations",
];

const INCLUSIVE_FEATURES = [
    "Inclusive sizing options",
    "Comfortable, sensory-conscious fabrics",
    "Irish-language design options for Gaelscoils",
    "Modern, confidence-building designs",
];

const SHOP_FEATURES = [
    { icon: ShoppingBag, text: "Parents order directly" },
    { icon: CreditCard, text: "Secure payment system" },
    { icon: Package, text: "No stock handling required by school" },
    { icon: RefreshCw, text: "Reorders available year-round" },
];

const TRUST_VALUES = [
    "Reliable delivery timelines",
    "Clear communication",
    "Transparent pricing structures",
    "Long-term school partnerships",
];

export default function SchoolUniformPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            {/* ===== HERO ===== */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted hover:text-primary text-sm font-medium mb-8 transition-colors duration-300"
                    >
                        ← Back to Shop
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
                            Schools &amp; Education
                        </span>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.9]">
                            Performance Wear
                            <br />
                            <span className="text-primary">Built for School Life.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted mt-8 leading-relaxed max-w-2xl">
                            Modern. Durable. Inclusive. Designed for Today&apos;s Students.
                        </p>

                        <p className="text-base text-muted/80 mt-4 leading-relaxed max-w-2xl">
                            At AF GEAR, we supply high-quality school sportswear, PE uniforms, teamwear and staff apparel
                            designed to perform — on the pitch, in the gym and in everyday school life. Whether you&apos;re a
                            primary school, secondary school, Gaelscoil or international academy, we provide complete
                            sportswear solutions with simple ordering and reliable long-term supply.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-10">
                            <a
                                href="mailto:afgearsports@gmail.com?subject=School%20Consultation%20Request"
                                className="inline-flex items-center gap-3 bg-primary text-black font-black uppercase tracking-[0.15em] text-sm px-8 py-4 rounded-sm hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(102,187,106,0.4)] transition-all duration-300"
                            >
                                Book a School Consultation
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="mailto:afgearsports@gmail.com?subject=Schools%20Brochure%20Request"
                                className="inline-flex items-center gap-3 border border-white/20 text-white font-bold uppercase tracking-[0.15em] text-sm px-8 py-4 rounded-sm hover:bg-white/5 hover:border-primary/40 transition-all duration-300"
                            >
                                Download Schools Brochure
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/3 blur-[150px] pointer-events-none" />
                <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            </section>

            {/* ===== WHY SCHOOLS CHOOSE AF GEAR ===== */}
            <section className="py-24 border-t border-white/5">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
                            Why Schools Choose <span className="text-primary">AF Gear</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {WHY_CHOOSE.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500"
                            >
                                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <item.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-white font-display font-black text-lg uppercase tracking-tight mb-3">{item.title}</h3>
                                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== OUR SCHOOL RANGE ===== */}
            <section className="py-24 border-t border-white/5 bg-white/[0.01]">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
                            Our School <span className="text-primary">Range</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SCHOOL_RANGE.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                className="flex items-start gap-5 p-6 rounded-xl border border-white/5 hover:border-primary/15 transition-all duration-300"
                            >
                                <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-white font-display font-bold text-base uppercase tracking-tight mb-2">{item.title}</h3>
                                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CUSTOM DESIGN ===== */}
            <section className="py-24 border-t border-white/5">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
                                Customisation
                            </span>
                            <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight mb-6">
                                Custom Design <span className="text-primary">For Your School</span>
                            </h2>
                            <p className="text-muted text-base leading-relaxed mb-8">
                                Every school has its own identity — your sportswear should reflect that.
                                From traditional to modern, we create kits your students will be proud of.
                            </p>
                            <ul className="space-y-4">
                                {CUSTOM_FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-muted text-base">
                                        <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Inclusive by Design */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-2xl bg-white/[0.02] border border-white/5"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                                <Globe className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-4">
                                Inclusive by <span className="text-primary">Design</span>
                            </h3>
                            <p className="text-muted text-base leading-relaxed mb-6">
                                At AF GEAR, we believe sport is for everyone. Because every student deserves to feel
                                comfortable and confident in their uniform.
                            </p>
                            <ul className="space-y-3">
                                {INCLUSIVE_FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-muted text-sm">
                                        <Heart className="w-4 h-4 text-primary flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-24 border-t border-white/5 bg-white/[0.01]">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
                            How It <span className="text-primary">Works</span>
                        </h2>
                        <p className="text-muted mt-4 text-lg">Simple. Professional. Stress-free.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {HOW_IT_WORKS.map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="relative text-center p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300"
                            >
                                <span className="text-4xl font-display font-black text-primary/20">{item.step}</span>
                                <h3 className="text-white font-display font-bold text-sm uppercase tracking-tight mt-3 mb-2">{item.title}</h3>
                                <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
                                {i < HOW_IT_WORKS.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 text-primary/30">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SCHOOL ONLINE SHOP ===== */}
            <section className="py-24 border-t border-white/5">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                                <Store className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight mb-6">
                                School Online <span className="text-primary">Shop Solution</span>
                            </h2>
                            <p className="text-muted text-base leading-relaxed mb-8">
                                We can build a private online shop exclusively for your school.
                                We handle fulfilment — your staff focus on education.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {SHOP_FEATURES.map((feat) => (
                                    <div key={feat.text} className="flex items-center gap-3 p-4 rounded-lg border border-white/5 bg-white/[0.02]">
                                        <feat.icon className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-sm text-muted">{feat.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Trust & Reliability */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-2xl bg-white/[0.02] border border-white/5"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                                <Handshake className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-4">
                                Trust &amp; <span className="text-primary">Reliability</span>
                            </h3>
                            <p className="text-muted text-base leading-relaxed mb-6">
                                AF GEAR is committed to building lasting relationships with schools.
                                We don&apos;t just supply uniforms — we build partnerships.
                            </p>
                            <ul className="space-y-3">
                                {TRUST_VALUES.map((val) => (
                                    <li key={val} className="flex items-center gap-3 text-muted text-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        {val}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="py-32 border-t border-white/5 relative overflow-hidden">
                <div className="max-w-[900px] mx-auto px-4 md:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight mb-6">
                            Let&apos;s Work <span className="text-primary">Together</span>
                        </h2>
                        <p className="text-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                            Whether you&apos;re reviewing your current supplier or launching a new school sportswear
                            programme, we&apos;d love to speak with you.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:afgearsports@gmail.com?subject=School%20Consultation"
                                className="inline-flex items-center justify-center gap-3 bg-primary text-black font-black uppercase tracking-[0.15em] text-sm px-10 py-4 rounded-sm hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(102,187,106,0.4)] transition-all duration-300"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Book a Consultation
                            </a>
                            <a
                                href="mailto:afgearsports@gmail.com?subject=Quote%20Request"
                                className="inline-flex items-center justify-center gap-3 border border-white/20 text-white font-bold uppercase tracking-[0.15em] text-sm px-10 py-4 rounded-sm hover:bg-white/5 hover:border-primary/40 transition-all duration-300"
                            >
                                <Mail className="w-4 h-4" />
                                Request a Quote
                            </a>
                        </div>

                        <p className="text-muted text-sm mt-8">
                            <Mail className="w-3.5 h-3.5 inline mr-2" />
                            <a href="mailto:afgearsports@gmail.com" className="text-primary hover:text-white transition-colors underline underline-offset-4">
                                afgearsports@gmail.com
                            </a>
                        </p>
                    </motion.div>
                </div>

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
            </section>

            {/* ===== ORDER FORM (kept from original) ===== */}
            <section className="py-24 border-t border-white/5 bg-white/[0.01]" id="order-form">
                <div className="max-w-[900px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
                            School Uniform <span className="text-primary">Order Form</span>
                        </h2>
                        <p className="text-muted mt-4">Fill out the form below and we&apos;ll get back to you.</p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 md:p-12 space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-muted text-xs font-bold uppercase tracking-widest">School Name</label>
                                <input type="text" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors placeholder:text-muted/50" placeholder="Enter school name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-muted text-xs font-bold uppercase tracking-widest">Contact Person</label>
                                <input type="text" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors placeholder:text-muted/50" placeholder="Full name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-muted text-xs font-bold uppercase tracking-widest">Email</label>
                                <input type="email" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors placeholder:text-muted/50" placeholder="Email address" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-muted text-xs font-bold uppercase tracking-widest">Phone</label>
                                <input type="tel" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors placeholder:text-muted/50" placeholder="Phone number" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-muted text-xs font-bold uppercase tracking-widest">School Type</label>
                                <select className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:border-primary outline-none transition-colors">
                                    <option>Select type</option>
                                    <option>Primary School</option>
                                    <option>Secondary School</option>
                                    <option>Gaelscoil</option>
                                    <option>International Academy</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-muted text-xs font-bold uppercase tracking-widest">Estimated Students</label>
                                <select className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:border-primary outline-none transition-colors">
                                    <option>Select range</option>
                                    <option>Under 100</option>
                                    <option>100 – 300</option>
                                    <option>300 – 600</option>
                                    <option>600+</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-muted text-xs font-bold uppercase tracking-widest">What are you looking for?</label>
                            <textarea rows={4} className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors placeholder:text-muted/50 resize-none" placeholder="PE uniforms, school teamwear, staff wear, etc." />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary text-black font-black uppercase tracking-[0.15em] text-sm px-12 py-4 rounded-sm hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(102,187,106,0.4)] transition-all duration-300 cursor-pointer"
                            >
                                Submit Enquiry
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.form>
                </div>
            </section>

            <Footer />
            <Dock />
        </main>
    );
}
```

---

### `/high-voltage/src/app/(public)/shipping/page.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import { Truck, Globe, Package, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const sections = [
    {
        icon: Truck,
        title: "Domestic Shipping (Ireland)",
        content: [
            "We offer a flat rate shipping fee of €6 for all orders within Ireland.",
        ],
        bullets: [
            "Stock items: Processed within 2-3 business days, with delivery typically taking 3-5 business days.",
            "Non-stock/custom items: Processed within 4-5 weeks, with delivery times varying based on production and shipping schedules.",
        ],
    },
    {
        icon: Globe,
        title: "International Shipping",
        content: [
            "For international shipping rates and delivery times, please contact us at afgearsports@gmail.com before placing your order. We will provide a shipping quote based on your location.",
        ],
    },
    {
        icon: Package,
        title: "Order Processing & Tracking",
        content: [
            "Once your order is dispatched, you will receive a confirmation email with tracking details (if applicable). Please ensure your shipping address is correct at checkout, as we are unable to make changes once the order has been shipped.",
        ],
    },
    {
        icon: AlertTriangle,
        title: "Delays & Issues",
        content: [
            "While we aim to meet estimated delivery times, delays may occur due to factors beyond our control, such as customs processing or courier delays. If you experience any issues with your delivery, please reach out to us at afgearsports@gmail.com.",
        ],
    },
];

export default function ShippingPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            {/* Hero Banner */}
            <section className="relative pt-32 pb-20 border-b border-white/5">
                <div className="max-w-[900px] mx-auto px-4 md:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted hover:text-primary text-sm font-medium mb-8 transition-colors duration-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
                            Customer Care
                        </span>
                        <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">
                            Shipping <span className="text-primary">Policy</span>
                        </h1>
                        <p className="text-muted text-lg mt-6 leading-relaxed max-w-lg">
                            Everything you need to know about how we ship your AF Gear orders.
                        </p>
                    </motion.div>
                </div>

                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/5 blur-[120px] pointer-events-none" />
            </section>

            {/* Policy Sections */}
            <section className="py-20">
                <div className="max-w-[900px] mx-auto px-4 md:px-8 space-y-0">
                    {sections.map((section, i) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group py-12 border-b border-white/5 last:border-b-0"
                        >
                            <div className="flex items-start gap-5">
                                {/* Icon */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                                    <section.icon className="w-5 h-5 text-primary" />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight mb-4">
                                        {section.title}
                                    </h2>

                                    {section.content.map((paragraph, j) => (
                                        <p key={j} className="text-muted text-base leading-relaxed mb-4 last:mb-0">
                                            {paragraph}
                                        </p>
                                    ))}

                                    {section.bullets && (
                                        <ul className="space-y-3 mt-4">
                                            {section.bullets.map((bullet, k) => (
                                                <li key={k} className="flex items-start gap-3 text-muted text-base leading-relaxed">
                                                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Thank You */}
            <section className="py-16 border-t border-white/5">
                <div className="max-w-[900px] mx-auto px-4 md:px-8 text-center">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-primary font-display font-black text-2xl uppercase tracking-tight"
                    >
                        Thank you for choosing AF Gear!
                    </motion.p>
                    <p className="text-muted text-sm mt-4">
                        Questions? Reach us at{" "}
                        <a href="mailto:afgearsports@gmail.com" className="text-primary hover:text-white transition-colors duration-300 underline underline-offset-4">
                            afgearsports@gmail.com
                        </a>
                    </p>
                </div>
            </section>
        </main>
    );
}
```

---

### `/high-voltage/src/app/(public)/success/page.tsx`
```tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle, ShoppingBag, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function SuccessContent() {
    const searchParams = useSearchParams();
    const whatsappUrl = searchParams.get("url");
    const orderRef = searchParams.get("ref") || "Processing...";
    const { items, clearCart } = useCart();
    const [mounted, setMounted] = useState(false);
    const [attemptedRedirect, setAttemptedRedirect] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        // Ensure cart is fully cleared when landing on success page
        if (items.length > 0) {
            clearCart();
        }

        if (whatsappUrl && !attemptedRedirect) {
            setAttemptedRedirect(true);
            // Attempt automatic redirect to WhatsApp
            const timer = setTimeout(() => {
                window.location.href = whatsappUrl;
            }, 800); // Small delay so they see the success screen first
            return () => clearTimeout(timer);
        }
    }, [whatsappUrl, attemptedRedirect, clearCart, items.length]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-xl"
            >
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-primary" />
                    </div>

                    <h1 className="text-3xl font-display font-black text-white uppercase mb-2">
                        Order Received!
                    </h1>
                    <p className="text-muted text-sm mb-6">
                        Your order details have been recorded. To complete your order, please send the summary to the shop owner via WhatsApp.
                    </p>

                    {/* Order Reference Box */}
                    <div className="w-full bg-white/5 rounded-lg p-4 mb-6 border border-white/5 text-left">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted">Order Reference:</span>
                            <span className="text-white font-mono font-bold">{orderRef}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted">Checkout Method:</span>
                            <span className="text-primary font-bold">WhatsApp Direct</span>
                        </div>
                    </div>

                    {/* Direct Action Buttons */}
                    <div className="flex flex-col w-full gap-3">
                        {whatsappUrl && (
                            <a
                                href={whatsappUrl}
                                className="w-full bg-primary text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(102,187,106,0.2)]"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Send via WhatsApp
                            </a>
                        )}
                        <Link
                            href="/#shop"
                            className="w-full bg-white/5 text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Continue Shopping <ShoppingBag className="w-4 h-4" />
                        </Link>
                    </div>

                    {whatsappUrl && (
                        <p className="text-[11px] text-muted mt-4">
                            If WhatsApp didn&apos;t open automatically, click the button above.
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
```

---

### `/high-voltage/src/app/(public)/templates/page.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/ui/Footer";
import { Dock } from "@/components/ui/Dock";
import Image from "next/image";
import { Download, Info } from "lucide-react";
import Link from "next/link";

export default function TemplatesPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            {/* Header */}
            <section className="relative pt-32 pb-16 px-4 md:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-display font-black text-foreground uppercase tracking-tight mb-4">
                        Design <span className="text-primary">Templates</span>
                    </h1>
                    <p className="text-muted text-lg max-w-xl mx-auto">
                        High-quality blank templates for visualizing your team&apos;s custom kit.
                        Perfect for sketching initial ideas before our design team takes over.
                    </p>
                </motion.div>
            </section>

            {/* Template Showcase */}
            <section className="px-4 md:px-8 pb-32">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-background-card border border-border rounded-2xl overflow-hidden shadow-[0_8px_40px_var(--color-shadow)]"
                    >
                        {/* Preview Header */}
                        <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">Match Pro Jersey & Shorts Kit</h2>
                                <p className="text-muted text-xs uppercase tracking-widest mt-1">Standard Fit / Front & Back View</p>
                            </div>
                            <a
                                href="/assets/gaa_jersey_template_v1.svg"
                                download="AF_Gear_Jersey_Template.svg"
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold text-xs uppercase tracking-widest rounded-sm hover:brightness-110 transition-all shadow-lg"
                            >
                                <Download className="w-4 h-4" />
                                Download Template
                            </a>
                        </div>

                        {/* Image Preview Area */}
                        <div className="bg-background-elevated p-8 md:p-16 flex items-center justify-center min-h-[500px]">
                            <div className="relative w-full max-w-3xl aspect-video bg-white rounded-lg shadow-sm p-8 flex items-center justify-center border border-border/50">
                                {/* Placeholder for the generated image */}
                                <Image
                                    src="/assets/gaa_jersey_template_v1.svg"
                                    alt="Jersey Template Preview"
                                    width={800}
                                    height={450}
                                    priority
                                    className="w-full h-full object-contain mix-blend-multiply opacity-90"
                                />

                                {/* Watermark/Badge */}
                                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">
                                    AF GEAR • TEMPLATE
                                </div>
                            </div>
                        </div>

                        {/* Info Footer */}
                        <div className="p-6 bg-primary-soft/30 flex items-start gap-3">
                            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-foreground text-sm font-bold uppercase tracking-wide mb-1">How to use</h3>
                                <p className="text-muted text-sm leading-relaxed">
                                    Download this image to sketch your colors and crest placement.
                                    Send it to us via the <Link href="/contact" className="text-primary underline hover:text-primary-glow">Contact Page</Link> to get a production-ready mock-up from our design team.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
            <Dock />
        </main>
    );
}
```

---

### `/high-voltage/src/app/(public)/terms/page.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Scale, Shield, Cookie, RotateCcw, AlertCircle, LucideIcon } from "lucide-react";
import Link from "next/link";

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4 }}
            className="py-10 border-b border-white/5 last:border-b-0"
        >
            <h3 className="text-sm md:text-base font-display font-black text-primary uppercase tracking-wide mb-5">
                {title}
            </h3>
            <div className="space-y-4 text-muted text-sm md:text-base leading-relaxed">
                {children}
            </div>
        </motion.div>
    );
}

function PolicySection({ icon: Icon, title, id, children }: { icon: any; title: string; id: string; children: React.ReactNode }) {
    return (
        <section id={id} className="py-16 border-b border-white/5 last:border-b-0">
            <div className="max-w-[900px] mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-start gap-5 mb-8"
                >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight pt-2">
                        {title}
                    </h2>
                </motion.div>
                {children}
            </div>
        </section>
    );
}

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
            {/* Hero Banner */}
            <section className="relative pt-32 pb-20 border-b border-white/5">
                <div className="max-w-[900px] mx-auto px-4 md:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted hover:text-primary text-sm font-medium mb-8 transition-colors duration-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
                            Legal
                        </span>
                        <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">
                            Terms & <span className="text-primary">Conditions</span>
                        </h1>
                        <p className="text-muted text-base mt-6 leading-relaxed max-w-lg">
                            Last Updated: February 2026
                        </p>

                        {/* Quick Nav */}
                        <div className="flex flex-wrap gap-3 mt-8">
                            {[
                                { label: "Terms", href: "#terms" },
                                { label: "Privacy", href: "#privacy" },
                                { label: "Cookies", href: "#cookies" },
                                { label: "Refunds", href: "#refunds" },
                                { label: "Disclaimer", href: "#disclaimer" },
                            ].map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-muted hover:text-primary hover:border-primary/30 transition-all duration-300"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/5 blur-[120px] pointer-events-none" />
            </section>

            {/* ===== TERMS & CONDITIONS ===== */}
            <PolicySection icon={Scale} title="Terms & Conditions" id="terms">
                <SectionBlock title="1. Introduction">
                    <p>These Terms &amp; Conditions govern your use of the AF GEAR website and the purchase of products from us.</p>
                    <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Business Name: AF GEAR</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Country of Registration: Ireland</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Email: afgearsports@gmail.com</li>
                    </ul>
                    <p>By using this website or placing an order, you agree to these Terms.</p>
                </SectionBlock>

                <SectionBlock title="2. Eligibility">
                    <p>You must be at least 18 years old to place an order. If under 18, you must have parental/guardian consent.</p>
                </SectionBlock>

                <SectionBlock title="3. Products">
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />All products are subject to availability.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />We reserve the right to discontinue products at any time.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Colours may vary slightly due to screen displays.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Minor design changes may occur without prior notice.</li>
                    </ul>
                </SectionBlock>

                <SectionBlock title="4. Pricing & Payment">
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />All prices are listed in &euro; (Euro) unless otherwise stated.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />VAT is included where applicable.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />International customers may be responsible for import duties or customs fees.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />We reserve the right to correct pricing errors.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Payment must be received before order dispatch.</li>
                    </ul>
                </SectionBlock>

                <SectionBlock title="5. Order Acceptance">
                    <p>We reserve the right to:</p>
                    <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Refuse or cancel orders</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Cancel suspected fraudulent transactions</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Limit quantities purchased per customer</li>
                    </ul>
                    <p>If payment has been taken and an order is cancelled, a full refund will be issued.</p>
                </SectionBlock>

                <SectionBlock title="6. Shipping">
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Processing time: 1&ndash;3 business days.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Delivery times are estimates and not guaranteed.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />AF GEAR is not responsible for delays caused by couriers or customs.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Risk passes to the customer upon delivery.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />If a parcel is lost or damaged, contact us within 7 days of expected delivery.</li>
                    </ul>
                </SectionBlock>

                <SectionBlock title="7. Returns & Refunds">
                    <p className="font-bold text-white">EU &amp; Ireland Customers</p>
                    <p>Under EU consumer law, customers have a 14-day cooling-off period from delivery.</p>
                    <p className="font-bold text-white mt-4">To qualify:</p>
                    <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Items must be unworn</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Tags attached</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Returned in original condition</li>
                    </ul>
                    <p>Customers are responsible for return shipping unless the item is faulty. Refunds are processed within 14 days of receiving returned goods.</p>
                    <p className="font-bold text-white mt-4">Non-Returnable Items:</p>
                    <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Customised products</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Worn or damaged items</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Clearance items (if marked final sale)</li>
                    </ul>
                </SectionBlock>

                <SectionBlock title="8. Faulty or Defective Items">
                    <p>If an item is defective:</p>
                    <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Contact us within 14 days of receipt.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Provide photos of the issue.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />We may offer replacement, repair, or refund.</li>
                    </ul>
                </SectionBlock>

                <SectionBlock title="9. Product Use & Liability Disclaimer">
                    <p>AF GEAR products are designed for athletic performance. Customers are responsible for ensuring proper fit and using products appropriately.</p>
                    <p>AF GEAR shall not be liable for injuries, damages, or losses arising from misuse or improper wear. Our liability is limited to the purchase price of the product.</p>
                </SectionBlock>

                <SectionBlock title="10. Intellectual Property">
                    <p>All content including logos, designs, product names, graphics and images are the intellectual property of AF GEAR and may not be reproduced without written consent. Legal action may be taken against infringement.</p>
                </SectionBlock>

                <SectionBlock title="11. Governing Law">
                    <p>These Terms are governed by Irish law. Any disputes shall be subject to the courts of Ireland.</p>
                </SectionBlock>
            </PolicySection>

            {/* ===== PRIVACY POLICY ===== */}
            <PolicySection icon={Shield} title="Privacy Policy (GDPR Compliant)" id="privacy">
                <SectionBlock title="1. Data We Collect">
                    <p>We may collect:</p>
                    <ul className="space-y-2 ml-4">
                        {["Name", "Address", "Email", "Phone number", "Payment details (processed securely via third-party providers)", "IP address", "Website usage data", "Marketing preferences"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{item}</li>
                        ))}
                    </ul>
                </SectionBlock>

                <SectionBlock title="2. Why We Collect Data">
                    <p>We use data to:</p>
                    <ul className="space-y-2 ml-4">
                        {["Process orders", "Deliver products", "Respond to customer service requests", "Improve our website", "Send marketing emails (with consent)"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{item}</li>
                        ))}
                    </ul>
                </SectionBlock>

                <SectionBlock title="3. Legal Basis (GDPR)">
                    <p>We process data based on:</p>
                    <ul className="space-y-2 ml-4">
                        {["Contract (to fulfil orders)", "Consent (marketing)", "Legal obligation (tax records)", "Legitimate business interests"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{item}</li>
                        ))}
                    </ul>
                </SectionBlock>

                <SectionBlock title="4. Data Sharing">
                    <p>We may share data with:</p>
                    <ul className="space-y-2 ml-4">
                        {["Order processing systems (WhatsApp)", "Shipping providers", "Email marketing platforms", "Advertising platforms (Meta / Google)"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{item}</li>
                        ))}
                    </ul>
                    <p className="font-bold text-white">We do not sell personal data.</p>
                </SectionBlock>

                <SectionBlock title="5. Data Retention">
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Order records retained for legal/tax compliance.</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Marketing data retained until consent is withdrawn.</li>
                    </ul>
                </SectionBlock>

                <SectionBlock title="6. Your Rights (EU Residents)">
                    <p>You have the right to:</p>
                    <ul className="space-y-2 ml-4">
                        {["Access your data", "Correct inaccurate data", "Request deletion", "Withdraw consent", "Lodge a complaint with the Data Protection Commission (Ireland)"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{item}</li>
                        ))}
                    </ul>
                    <p>Contact: <a href="mailto:afgearsports@gmail.com" className="text-primary hover:text-white transition-colors underline underline-offset-4">afgearsports@gmail.com</a></p>
                </SectionBlock>

                <SectionBlock title="7. Security">
                    <p>We use secure hosting and SSL encryption to protect customer data.</p>
                </SectionBlock>
            </PolicySection>

            {/* ===== COOKIE POLICY ===== */}
            <PolicySection icon={Cookie} title="Cookie Policy" id="cookies">
                <SectionBlock title="How We Use Cookies">
                    <p>AF GEAR uses cookies to:</p>
                    <ul className="space-y-2 ml-4">
                        {["Enable website functionality", "Analyse traffic (Google Analytics)", "Track ad performance (Meta Pixel)", "Improve user experience"].map((item) => (
                            <li key={item} className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{item}</li>
                        ))}
                    </ul>
                    <p>You may accept or decline non-essential cookies via our cookie banner. Essential cookies cannot be disabled as they are required for checkout functionality.</p>
                </SectionBlock>
            </PolicySection>

            {/* ===== REFUND POLICY ===== */}
            <PolicySection icon={RotateCcw} title="Refund Policy" id="refunds">
                <SectionBlock title="Our Refund Commitment">
                    <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />14-day returns (EU customers)</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Refunds processed within 14 days of receiving returned item</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Exchanges subject to stock availability</li>
                    </ul>
                    <p className="mt-4">Contact: <a href="mailto:afgearsports@gmail.com" className="text-primary hover:text-white transition-colors underline underline-offset-4">afgearsports@gmail.com</a></p>
                </SectionBlock>
            </PolicySection>

            {/* ===== WEBSITE DISCLAIMER ===== */}
            <PolicySection icon={AlertCircle} title="Website Disclaimer" id="disclaimer">
                <SectionBlock title="Important Notice">
                    <p>AF GEAR makes no guarantees regarding:</p>
                    <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Continuous website availability</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Typographical errors</li>
                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />Stock availability accuracy</li>
                    </ul>
                    <p>We reserve the right to modify website content at any time.</p>
                </SectionBlock>
            </PolicySection>

            {/* Bottom Contact */}
            <section className="py-16 border-t border-white/5">
                <div className="max-w-[900px] mx-auto px-4 md:px-8 text-center">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                        <p className="text-muted text-sm">
                            Questions? Contact us at{" "}
                            <a href="mailto:afgearsports@gmail.com" className="text-primary hover:text-white transition-colors duration-300 underline underline-offset-4">
                                afgearsports@gmail.com
                            </a>
                        </p>
                        <p className="text-muted/50 text-xs mt-4 uppercase tracking-widest">
                            Last updated: February 2026
                        </p>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
```

---

### `/high-voltage/src/app/actions/trackOrderAction.ts`
```tsx
"use server";

import { createAdminClient } from "@/utils/supabase/admin";

export async function trackOrderAction(orderRef: string, email: string) {
    if (!orderRef || !orderRef.trim()) {
        return { data: null, error: "Order ID is required" };
    }
    if (!email || !email.trim()) {
        return { data: null, error: "Email is required" };
    }

    const supabase = createAdminClient();
    if (!supabase) {
        return { data: null, error: "Database connection failed" };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOrderRef = orderRef.trim();

    // Support both full order references and suffixes (short forms)
    const query = cleanOrderRef.length > 20
        ? supabase
            .from("orders")
            .select("*")
            .eq("order_reference", cleanOrderRef)
            .eq("user_email", normalizedEmail)
        : supabase
            .from("orders")
            .select("*")
            .ilike("order_reference", `%${cleanOrderRef}%`)
            .eq("user_email", normalizedEmail);

    const { data, error } = await query.maybeSingle();

    if (error) {
        return { data: null, error: error.message };
    }

    return { data, error: null };
}
```

---

### `/high-voltage/src/app/(public)/track-order/page.tsx`
```tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackOrderAction } from "@/app/actions/trackOrderAction";
import { useUser } from "@clerk/nextjs";
import {
    Search,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowRight,
    MapPin,
    Calendar,
    ShoppingBag,
    Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Suspense } from "react";

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const { user, isLoaded } = useUser();
    const initialId = searchParams.get("id") || "";
    const initialEmail = searchParams.get("email") || "";

    const [orderId, setOrderId] = useState(initialId);
    const [email, setEmail] = useState(initialEmail);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Auto-populate email from Clerk once user is loaded
    useEffect(() => {
        if (isLoaded && user?.primaryEmailAddress?.emailAddress && !email) {
            setEmail(user.primaryEmailAddress.emailAddress);
        }
    }, [isLoaded, user, email]);

    const fetchOrderData = async (idToTrack: string, emailToTrack: string) => {
        if (!idToTrack.trim() || !emailToTrack.trim()) return;

        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            const { data, error: fetchError } = await trackOrderAction(idToTrack, emailToTrack);

            if (fetchError || !data) {
                setError("Order not found. Please check your Order ID and email address, and try again.");
            } else {
                setOrder(data);
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const activeEmail = initialEmail || (user?.primaryEmailAddress?.emailAddress);
        if (initialId && activeEmail) {
            fetchOrderData(initialId, activeEmail);
        }
    }, [initialId, initialEmail, user, isLoaded]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrderData(orderId, email);
    };

    const statusSteps = [
        { key: 'pending', label: 'Order Placed', icon: Clock },
        { key: 'processing', label: 'Processing', icon: Package },
        { key: 'shipped', label: 'Shipped', icon: Truck },
        { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
    ];

    const getCurrentStepIndex = () => {
        if (!order) return -1;
        return statusSteps.findIndex(step => step.key === order.status);
    };

    return (
        <main className="min-h-screen bg-background pt-32 pb-24 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase mb-4 tracking-tight">
                        Track Your <span className="text-primary">Order</span>
                    </h1>
                    <p className="text-muted max-w-lg mx-auto">
                        Enter your Order ID (from your confirmation email) to see the live status of your custom gear.
                    </p>
                </div>

                {/* Track Search Box */}
                <form onSubmit={handleTrack} className="bg-background-card border border-white/10 p-6 rounded-2xl shadow-2xl mb-12 max-w-md mx-auto space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                            type="text"
                            placeholder="Order ID (e.g. order_...)"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full bg-background/50 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white pl-12 pr-4 py-4 transition-all"
                            required
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background/50 border border-white/10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white pl-12 pr-4 py-4 transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-black uppercase tracking-widest py-4 rounded-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95 duration-200"
                    >
                        {loading ? "Searching..." : <>Track Order <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 justify-center mb-8"
                        >
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </motion.div>
                    )}

                    {order && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Tracking Visual */}
                            <div className="bg-background-card border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <ShoppingBag className="w-40 h-40 text-white" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                        <div>
                                            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2 block">Current Status</span>
                                            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">
                                                {statusSteps[getCurrentStepIndex()]?.label || order.status}
                                            </h2>
                                        </div>
                                        <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10">
                                            <span className="text-xs text-muted font-bold uppercase tracking-widest">ID: {order.order_reference.slice(-12)}</span>
                                        </div>
                                    </div>

                                    {/* Stepper */}
                                    <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4 mb-12">
                                        {/* Connector Line (Desktop) */}
                                        <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-white/10 -z-0" />

                                        {statusSteps.map((step, index) => {
                                            const isDone = index <= getCurrentStepIndex();
                                            const isActive = index === getCurrentStepIndex();
                                            const Icon = step.icon;

                                            return (
                                                <div key={step.key} className="relative z-10 flex md:flex-col items-center gap-4 md:text-center flex-1">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isDone
                                                        ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(102,187,106,0.4)]'
                                                        : 'bg-background-elevated border-white/10 text-white/20'
                                                        }`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-xs font-bold uppercase tracking-widest ${isDone ? 'text-white' : 'text-white/20'}`}>
                                                            {step.label}
                                                        </span>
                                                        {isActive && <span className="text-[10px] text-primary font-bold animate-pulse">Now</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Order Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" /> Delivery Address
                                    </h3>
                                    <div className="text-muted text-sm space-y-1">
                                        <p className="text-white font-medium">{order.shipping_address?.name}</p>
                                        <p>{order.shipping_address?.address?.line1}</p>
                                        <p>{order.shipping_address?.address?.city}, {order.shipping_address?.address?.postal_code}</p>
                                        <p className="uppercase">{order.shipping_address?.address?.country}</p>
                                    </div>
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" /> Order Info
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Placed on:</span>
                                            <span className="text-white font-medium">{format(new Date(order.created_at), "MMM d, yyyy")}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Total Paid:</span>
                                            <span className="text-white font-black">€{Number(order.amount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
```

---

### `/high-voltage/src/app/actions/adminActions.ts`
```tsx
"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { ensureAdmin } from "@/utils/auth";

// ----------------- FETCH ACTIONS ----------------- //

export async function fetchAdminOrdersAction() {
    await ensureAdmin();
    const supabase = createAdminClient();
    if (!supabase) return { data: [], error: "No DB Connection" };

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    return { data: data || [], error: error?.message };
}

export async function fetchAdminSavedDesignsAction() {
    await ensureAdmin();
    const supabase = createAdminClient();
    if (!supabase) return { data: [], error: "No DB Connection" };

    const { data, error } = await supabase
        .from("saved_designs")
        .select("*")
        .order("created_at", { ascending: false });

    return { data: data || [], error: error?.message };
}

export async function fetchAdminQueriesAction() {
    await ensureAdmin();
    const supabase = createAdminClient();
    if (!supabase) return { data: [], error: "No DB Connection" };

    const { data, error } = await supabase
        .from("contact_queries")
        .select("*")
        .order("created_at", { ascending: false });

    return { data: data || [], error: error?.message };
}

export async function fetchAdminReviewsAction() {
    await ensureAdmin();
    const supabase = createAdminClient();
    if (!supabase) return { data: [], error: "No DB Connection" };

    const { data, error } = await supabase
        .from("reviews")
        .select("*, products(name)")
        .order("created_at", { ascending: false });

    return { data: data || [], error: error?.message };
}

// ----------------- MUTATION ACTIONS ----------------- //

export async function markQueryReadAction(id: string) {
    await ensureAdmin();
    const supabase = createAdminClient();
    if (!supabase) return { success: false };

    const { error } = await supabase
        .from("contact_queries")
        .update({ status: "read" })
        .eq("id", id);

    if (!error) revalidatePath("/admin/queries");
    return { success: !error };
}

export async function updateReviewStatusAction(id: string, status: string) {
    await ensureAdmin();
    const supabase = createAdminClient();
    if (!supabase) return { success: false };

    const { error } = await supabase
        .from("reviews")
        .update({ status })
        .eq("id", id);

    if (!error) revalidatePath("/admin/reviews");
    return { success: !error };
}
```

---

### `/high-voltage/src/app/actions/contactActions.ts`
```tsx
"use server";

import { createAdminClient } from "@/utils/supabase/admin";

import { z } from "zod";

const ContactSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().email("Invalid email address"),
    subject: z.string().max(200).optional(),
    message: z.string().min(1, "Message is required").max(5000),
});
export async function submitContactQueryAction(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) {
    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { success: false, error: firstError ? firstError.message : "Validation error" };
    }
    const validatedData = parsed.data;

    const supabase = createAdminClient();

    const { error } = await supabase.from("contact_queries").insert({
        user_name: validatedData.name,
        user_email: validatedData.email,
        subject: validatedData.subject || "No Subject",
        message: validatedData.message,
    });

    if (error) {
        console.error("Error submitting contact query:", error);
        return { success: false, error: "Failed to send message. Please try again." };
    }

    return { success: true };
}
```

---

### `/high-voltage/src/app/actions/queryFormActions.ts`
```tsx
"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

const SaveDesignSchema = z.object({
    sportId: z.string().min(1),
    designName: z.string().min(1).max(100),
    settings: z.any(),
});

export async function saveDesignAction(data: {
    sportId: string;
    designName: string;
    settings: any;
}) {
    const parsed = SaveDesignSchema.safeParse(data);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { success: false, error: firstError ? firstError.message : "Validation error" };
    }
    const validatedData = parsed.data;

    const user = await currentUser();

    if (!user) {
        return { success: false, error: "You must be signed in to save a design." };
    }

    const userId = user.id;
    const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
    const userEmail = user.emailAddresses[0]?.emailAddress || "no-email@example.com";

    const supabase = createAdminClient();

    const { error } = await supabase.from("saved_designs").insert({
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        design_name: validatedData.designName,
        sport_id: validatedData.sportId,
        settings: validatedData.settings,
    });

    if (error) {
        console.error("Error saving design:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/profile");
    revalidatePath("/admin/saved-designs");

    return { success: true };
}

const InquirySchema = z.object({
    sportId: z.string().min(1),
    sportName: z.string().min(1),
    fullName: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().max(20),
    clubName: z.string().max(100),
    teamLevel: z.string().max(50),
    quantity: z.string().max(10),
    preferredColors: z.string().max(100),
    requirements: z.string().max(2000),
    crestUrl: z.string().optional().or(z.literal("")),
});

export async function submitQueryForm(data: {
    sportId: string;
    sportName: string;
    fullName: string;
    email: string;
    phone: string;
    clubName: string;
    teamLevel: string;
    quantity: string;
    preferredColors: string;
    requirements: string;
    crestUrl?: string;
}) {
    const parsed = InquirySchema.safeParse(data);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { success: false, error: firstError ? firstError.message : "Validation error" };
    }
    const validatedData = parsed.data;

    const supabase = createAdminClient();

    const user = await currentUser();
    const userId = user?.id || "anonymous";

    const { error } = await supabase.from("saved_designs").insert({
        user_id: userId,
        user_name: validatedData.fullName,
        user_email: validatedData.email,
        design_name: `Query Form - ${validatedData.clubName || validatedData.fullName} (${validatedData.sportName})`,
        sport_id: validatedData.sportId,
        settings: {
            type: "query_form",
            fullName: validatedData.fullName,
            email: validatedData.email,
            phone: validatedData.phone,
            clubName: validatedData.clubName,
            teamLevel: validatedData.teamLevel,
            quantity: validatedData.quantity,
            preferredColors: validatedData.preferredColors,
            requirements: validatedData.requirements,
            crestUrl: validatedData.crestUrl || "",
        },
    });

    if (error) {
        console.error("Error submitting query form:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/saved-designs");

    return { success: true };
}

export async function uploadCrestAction(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) return { error: "No file provided" };

    const supabase = createAdminClient();
    if (!supabase) return { error: "No DB connection" };

    try {
        // Ensure bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some((b: { name: string }) => b.name === 'crests');

        if (!bucketExists) {
            await supabase.storage.createBucket('crests', {
                public: true,
                allowedMimeTypes: ['image/*'],
            });
        }

        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('crests')
            .upload(fileName, file, { upsert: true });

        if (uploadError) {
            console.error("Crest upload error:", uploadError);
            return { error: uploadError.message };
        }

        const { data } = supabase.storage.from('crests').getPublicUrl(fileName);

        return { success: true, url: data.publicUrl };
    } catch (err: unknown) {
        console.error("Crest upload exception:", err);
        return { error: err instanceof Error ? err.message : "Unknown error during upload" };
    }
}
```

---

### `/high-voltage/src/app/actions/reviewActions.ts`
```tsx
"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

import { z } from "zod";

const ReviewSchema = z.object({
    productId: z.string().uuid("Invalid product ID"),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1, "Comment is required").max(1000, "Comment is too long"),
});
export async function submitReviewAction(data: {
    productId: string;
    rating: number;
    comment: string;
}) {
    const parsed = ReviewSchema.safeParse(data);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { success: false, error: firstError ? firstError.message : "Validation error" };
    }
    const validatedData = parsed.data;
    const user = await currentUser();

    if (!user) {
        return { success: false, error: "You must be signed in to leave a review." };
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("reviews").insert({
        product_id: validatedData.productId,
        user_id: user.id,
        user_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        rating: validatedData.rating,
        comment: validatedData.comment,
    });

    if (error) {
        console.error("Error submitting review:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/products/${data.productId}`);
    return { success: true };
}
```

---

### `/high-voltage/src/app/api/checkout/route.ts`
```tsx
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/utils/supabase/admin';
import { isRateLimited } from '@/utils/rateLimiter';
import { auth } from '@clerk/nextjs/server';
import { sendOrderConfirmationEmail } from '@/utils/email';

// Validate only IDs & quantities from the client — prices come from DB
const CheckoutSchema = z.object({
    items: z.array(z.object({
        id: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().min(1).max(99),
        size: z.string().max(10),
    })).min(1, 'Cart is empty'),
    customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
    shippingMethod: z.enum(['standard', 'express']).default('standard'),
    shippingAddress: z.object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        address: z.string().min(1, 'Address is required'),
        city: z.string().min(1, 'City is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        country: z.string().min(2, 'Country is required'),
    }).optional(),
});

export async function POST(req: Request) {
    const { userId } = await auth();
    const contentType = req.headers.get('content-type') || '';
    const isFormSubmit = contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data');

    // --- Rate Limiting ---
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(clientIp, 10, 60_000)) {
        const errorMsg = 'Too many requests. Please try again later.';
        if (isFormSubmit) {
            return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
        }
        return NextResponse.json(
            { error: errorMsg },
            { status: 429 }
        );
    }

    // --- Origin Check ---
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL;
    const allowed = (process.env.ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_APP_URL || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    if (origin && !allowed.includes(origin)) {
        const errorMsg = 'Origin not allowed';
        if (isFormSubmit) {
            return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
        }
        return NextResponse.json({ error: errorMsg }, { status: 403 });
    }

    try {
        let body: any;
        if (isFormSubmit) {
            const formData = await req.formData();
            
            let parsedItems = [];
            try {
                const itemsStr = formData.get('items') as string;
                parsedItems = itemsStr ? JSON.parse(itemsStr) : [];
            } catch (e) {
                console.error("Failed to parse items from form input:", e);
            }

            parsedItems = parsedItems.map((item: any) => ({
                ...item,
                quantity: typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : item.quantity
            }));

            body = {
                items: parsedItems,
                customerEmail: formData.get('email') || '',
                shippingMethod: formData.get('shippingMethod') || 'standard',
                shippingAddress: {
                    firstName: formData.get('firstName') || '',
                    lastName: formData.get('lastName') || '',
                    address: formData.get('address') || '',
                    city: formData.get('city') || '',
                    postalCode: formData.get('postalCode') || '',
                    country: formData.get('country') || '',
                }
            };
        } else {
            body = await req.json();
        }

        const parsed = CheckoutSchema.safeParse(body);

        if (!parsed.success) {
            const errorMsg = parsed.error.issues[0].message;
            if (isFormSubmit) {
                return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
            }
            return NextResponse.json(
                { error: errorMsg },
                { status: 400 }
            );
        }

        const { items, customerEmail, shippingMethod, shippingAddress } = parsed.data;

        // --- Server-Side Price Lookup (NEVER trust client prices) ---
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const useMockDb = !supabaseUrl || !serviceRoleKey;
        const productIds = items.map(item => item.id);

        let products: any[] = [];
        if (useMockDb) {
            console.warn("Supabase credentials missing. Running checkout in MOCK mode.");
            // Filter MOCK_PRODUCTS by the requested product IDs or slugs
            const mockSource = (await import('@/services/productService')).MOCK_PRODUCTS;
            products = mockSource.filter(p => productIds.includes(String(p.id)) || productIds.includes(p.slug));
        } else {
            const supabase = createAdminClient();
            const { data, error: dbError } = await supabase
                .from('products')
                .select('id, name, price, price_cents, images, stock_status')
                .eq('visibility', 'published')
                .in('id', productIds);

            if (dbError) {
                console.error('Product lookup failed:', dbError);
                const errorMsg = 'Product lookup failed';
                if (isFormSubmit) {
                    return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
                }
                return NextResponse.json(
                    { error: errorMsg },
                    { status: 500 }
                );
            }
            products = data || [];
        }

        if (!products || products.length === 0) {
            const errorMsg = 'Product lookup failed: No matching products found';
            if (isFormSubmit) {
                return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
            }
            return NextResponse.json({ error: errorMsg }, { status: 400 });
        }

        // Validate all requested products exist in the database
        const priceMap = new Map(products.map((p: any) => [String(p.id), p]));
        for (const item of items) {
            if (!priceMap.has(item.id)) {
                const errorMsg = `Product not found: ${item.id}`;
                if (isFormSubmit) {
                    return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
                }
                return NextResponse.json(
                    { error: errorMsg },
                    { status: 400 }
                );
            }
        }

        // Reject out-of-stock items
        for (const item of items) {
            const product = priceMap.get(item.id);
            if (product?.stock_status === 'out_of_stock') {
                const errorMsg = `${product.name} is currently out of stock.`;
                if (isFormSubmit) {
                    return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
                }
                return NextResponse.json({ error: errorMsg }, { status: 400 });
            }
        }

        // Build line items using AUTHORITATIVE server-side prices
        const validatedItems = items.map((item) => {
            const product = priceMap.get(item.id)!;
            
            // Prefer DB-defined integer price_cents to avoid floating point issues
            let unitAmountCents = product.price_cents;
            if (unitAmountCents === undefined || unitAmountCents === null) {
                const priceNum = Number(product.price);
                if (isNaN(priceNum) || priceNum <= 0) {
                    throw new Error(`Invalid price for product ${product.name}`);
                }
                unitAmountCents = Math.round(priceNum * 100);
            }

            if (unitAmountCents <= 0) {
                throw new Error(`Invalid price for product ${product.name}`);
            }

            return {
                id: item.id,
                name: product.name,
                size: item.size,
                quantity: item.quantity,
                unitPriceCents: unitAmountCents,
            };
        });

        // Shipping cost
        const shippingCost = shippingMethod === 'express' ? 1499 : 599; // cents

        // Calculate totals
        const itemTotalCents = validatedItems.reduce(
            (acc, item) => acc + item.unitPriceCents * item.quantity,
            0
        );
        const amountTotal = (itemTotalCents + shippingCost) / 100;

        // Generate unique order reference (replacing Stripe Session ID)
        const orderRef = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        // --- Save pending order to database ---
        let insertError = null;
        if (!useMockDb) {
            const supabase = createAdminClient();
            const { error } = await supabase.from('orders').insert({
                order_reference: orderRef,
                user_id: userId || null,
                user_email: customerEmail || 'pending_checkout',
                amount: amountTotal,
                items: validatedItems.map(i => ({
                    id: i.id,
                    name: i.name,
                    size: i.size,
                    quantity: i.quantity,
                    unit_price: i.unitPriceCents / 100,
                })),
                status: 'pending',
                ...(shippingAddress ? {
                    customer_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                    shipping_address: {
                        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                        line1: shippingAddress.address,
                        city: shippingAddress.city,
                        postal_code: shippingAddress.postalCode,
                        country: shippingAddress.country
                    }
                } : {})
            });
            insertError = error;
        } else {
            console.log("Mock mode: skipping database insertion for order ref:", orderRef);
        }

        if (insertError) {
            console.error('Failed to log order to database:', insertError);
            const errorMsg = 'An error occurred while creating your order in the database.';
            if (isFormSubmit) {
                return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
            }
            return NextResponse.json(
                { error: errorMsg },
                { status: 500 }
            );
        }

        // --- Send Email Confirmation via Resend ---
        try {
            const emailItems = validatedItems.map(i => ({
                title: i.name,
                quantity: i.quantity,
                amount: (i.unitPriceCents / 100) * i.quantity
            }));
            await sendOrderConfirmationEmail({
                customer_email: customerEmail || 'pending_checkout@af-gear.com',
                customer_name: shippingAddress ? `${shippingAddress.firstName} ${shippingAddress.lastName}` : "Customer",
                total_amount: amountTotal,
                items: emailItems,
                order_reference: orderRef
            });
        } catch (emailErr) {
            console.error("Failed to send order email:", emailErr);
        }

        const rawNumber = process.env.WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '353863125706';
        let whatsappNumber = rawNumber.replace(/[^0-9]/g, '');
        
        // Normalize: if it starts with '0' and has a length of 10 (typical local Irish mobile number like 086...),
        // strip the leading '0' and prepend the '353' country code.
        if (whatsappNumber.startsWith('0') && whatsappNumber.length === 10) {
            whatsappNumber = '353' + whatsappNumber.slice(1);
        }

        let message = `🛍️ *NEW ORDER - AF GEAR*\n`;
        message += `----------------------------------------\n\n`;
        message += `*Order Reference:* #${orderRef}\n`;
        message += `*Status:* ⏳ Pending Processing\n\n`;
        
        if (shippingAddress) {
            message += `👤 *CUSTOMER DETAILS*\n`;
            message += `• *Name:* ${shippingAddress.firstName} ${shippingAddress.lastName}\n`;
            message += `• *Email:* ${customerEmail || 'N/A'}\n\n`;
            
            message += `📍 *SHIPPING DETAILS*\n`;
            message += `• *Address:* ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}\n`;
            message += `• *Method:* Standard Delivery (€${(shippingCost / 100).toFixed(2)})\n\n`;
        } else {
            message += `👤 *CUSTOMER DETAILS*\n`;
            message += `• *Email:* ${customerEmail || 'N/A'}\n\n`;
        }

        message += `📦 *ITEMS ORDERED*\n`;
        message += `----------------------------------------\n`;
        validatedItems.forEach(item => {
            const lineTotal = (item.unitPriceCents / 100) * item.quantity;
            message += `• *${item.name}* (Size: ${item.size}) x ${item.quantity} - €${lineTotal.toFixed(2)}\n`;
        });
        message += `----------------------------------------\n\n`;
        
        message += `💳 *PAYMENT SUMMARY*\n`;
        message += `• *Subtotal:* €${(itemTotalCents / 100).toFixed(2)}\n`;
        message += `• *Shipping:* €${(shippingCost / 100).toFixed(2)}\n`;
        message += `• *Total Amount:* *€${amountTotal.toFixed(2)}*\n\n`;
        message += `----------------------------------------\n`;
        message += `Thank you for shopping with AF Gear! 🇮🇪`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        if (isFormSubmit) {
            return NextResponse.redirect(whatsappUrl, 303);
        }
        return NextResponse.json({ url: whatsappUrl, orderRef });
    } catch (error: unknown) {
        console.error('Checkout Error:', error instanceof Error ? error.stack || error.message : error);
        const errorMsg = 'An unexpected error occurred while processing your checkout. Please try again.';
        if (isFormSubmit) {
            return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(errorMsg)}`, req.url), 303);
        }
        return NextResponse.json(
            { error: errorMsg },
            { status: 500 }
        );
    }
}
```

---

### `/high-voltage/src/app/globals.css`
```css
@import "tailwindcss";

@theme {
  /* ===== AF GEAR THEME — Light Green ===== */

  /* Base Colors */
  --color-background: #0A0A0A;
  /* Ultra Black */
  --color-background-card: #0F0F0F;
  /* Deep Card */
  --color-background-elevated: #141414;
  /* Elevated surfaces */
  --color-foreground: #FFFFFF;
  /* Pure White Text */

  /* Primary Accent: LIGHT GREEN */
  --color-primary: #66BB6A;
  /* Light Green 400 */
  --color-primary-glow: rgba(102, 187, 106, 0.35);
  --color-primary-soft: rgba(102, 187, 106, 0.08);

  /* Secondary: SOFT GREEN */
  --color-secondary: #81C784;
  /* Light Green 300 */
  --color-muted: #A1A1AA;
  /* Zinc 400 */

  /* Category Badge Colors (Green shades) */
  --color-badge-club: #66BB6A;
  /* Green 400 */
  --color-badge-limerick: #81C784;
  /* Green 300 */
  --color-badge-tipperary: #4CAF50;
  /* Green 500 */
  --color-badge-gaeilge: #A5D6A7;
  /* Green 200 */

  /* Price */
  --color-price: #81C784;
  /* Soft green for prices */

  /* Borders & Shadows */
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-hover: rgba(102, 187, 106, 0.5);

  --color-shadow: rgba(0, 0, 0, 0.5);
  --color-shadow-hover: rgba(102, 187, 106, 0.15);

  /* Typography */
  --font-display: var(--font-outfit);
  --font-sans: var(--font-inter);
}

/* Force Dark Mode Default */
:root {
  color-scheme: dark;
}

/* Global Reset & Base Styles */
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  overflow-x: hidden;
}

/* NOTE: Global * transitions REMOVED — they were overriding component-level 
   custom animations (e.g. 600ms hover zoom on ProductCard). 
   Components now control their own transition timing. */

/* Headings */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-display);
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: -0.02em;
}

/* Utilities */
@utility text-glow {
  text-shadow: 0 0 15px var(--color-primary-glow);
}

@utility border-glow {
  box-shadow: 0 0 10px var(--color-primary-glow);
  border-color: var(--color-primary);
}

/* Premium Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--color-background);
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

/* Smooth Scrolling configuration (prevents conflicts with Lenis smooth scrolling library) */
html {
  scroll-behavior: auto !important;
  -webkit-overflow-scrolling: touch;
}

/* Hide scrollbar for horizontally scrolling containers */
@utility hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

/* Tap Highlight (mobile) */
@media (hover: none) {
  * {
    -webkit-tap-highlight-color: rgba(102, 187, 106, 0.1);
  }
}
/* Selection */
::selection {
  background-color: var(--color-primary);
  color: #000;
}
```

---

### `/high-voltage/src/app/layout.tsx`
```tsx
import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Navbar } from "@/components/ui/Navbar";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/products/CartDrawer";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AF Gear — Premium Teamwear",
  description: "Premium teamwear for clubs, schools, and squads. Made to last, made to be affordable.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#66BB6A",
          colorBackground: "#0A0A0A",
          colorInputBackground: "#141414",
          colorText: "#FFFFFF",
        },
        layout: {
          logoImageUrl: "/assets/af-logo.png",
          socialButtonsVariant: "iconButton",
        },
      }}
    >
      <html lang="en" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
        <body className="antialiased bg-background text-foreground font-sans">
          <ThemeProvider>
            <CartProvider>
              <LoadingScreen />
              <SmoothScroll />
              <CartDrawer />
              <Toaster theme="dark" position="bottom-center" toastOptions={{
                className: 'bg-black/80 backdrop-blur-md border border-white/10 text-white font-medium',
              }} />
              <div className="relative flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  {children}
                </main>
                <div id="portal-root" />
              </div>
            </CartProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

---

### `/high-voltage/src/components/admin/AdminSidebar.tsx`
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import {
    Package,
    LayoutDashboard,
    LogOut,
    ShoppingCart,
    Star,
    MessageSquare,
    Bookmark,
    Pencil,
    Menu,
    X,
    CalendarCheck,
    Tags,
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/admin",             label: "Dashboard",    icon: LayoutDashboard },
    { href: "/admin/products",    label: "Products",     icon: Package },
    { href: "/admin/categories",  label: "Categories",   icon: Tags },
    { href: "/admin/orders",      label: "Orders",       icon: ShoppingCart },
    { href: "/admin/reviews",     label: "Reviews",      icon: Star },
    { href: "/admin/queries",     label: "Queries",      icon: MessageSquare },
    { href: "/admin/reservations",label: "Reservations", icon: CalendarCheck },
    { href: "/admin/content",     label: "Content",      icon: Pencil },
    { href: "/admin/saved-designs",label: "Query Forms", icon: Bookmark },
];

interface AdminSidebarProps {
    userEmail?: string | null;
    signoutAction?: () => Promise<void>;
}

export default function AdminSidebar({ userEmail, signoutAction }: AdminSidebarProps = {}) {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    const navLinks = (
        <nav className="mt-6 flex-1 px-3 space-y-0.5">
            {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-150 ${
                            active
                                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                        <item.icon
                            className={`flex-shrink-0 h-5 w-5 transition-colors ${
                                active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                            }`}
                        />
                        <span className="truncate">{item.label}</span>
                        {active && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );

    const sidebarContent = (
        <div className="h-full flex flex-col pt-5 pb-4">
            {/* Logo */}
            <div className="flex items-center justify-between flex-shrink-0 px-5 mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tight text-indigo-600">AF-Gear</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 text-indigo-700">
                        Admin
                    </span>
                </div>
                {/* Close — mobile only */}
                <button
                    onClick={() => setOpen(false)}
                    className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    aria-label="Close sidebar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 mx-5 mb-2" />

            {/* Nav */}
            <div className="flex-1 overflow-y-auto">{navLinks}</div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-gray-100 px-5 pt-4 mt-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-medium text-gray-800 truncate" title={user?.primaryEmailAddress?.emailAddress || undefined}>
                            {user?.primaryEmailAddress?.emailAddress || userEmail || "Admin"}
                        </p>
                    </div>
                    <button
                        onClick={() => signOut({ redirectUrl: "/" })}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0"
                        title="Sign out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* ── Mobile top bar ── */}
            <div className="lg:hidden sticky top-0 z-40 flex items-center gap-3 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
                <button
                    onClick={() => setOpen(true)}
                    className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    aria-label="Open navigation menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <span className="text-lg font-black tracking-tight text-indigo-600">AF-Gear</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-600">
                    Admin
                </span>

                {/* Quick nav pills — visible on mobile without opening menu */}
                <div className="flex-1 overflow-x-auto ml-2">
                    <div className="flex items-center gap-1.5 min-w-max">
                        {NAV_ITEMS.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                                        active
                                            ? "bg-indigo-100 text-indigo-700"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    }`}
                                >
                                    <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Overlay (mobile) ── */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-2xl
                    transform transition-transform duration-300 ease-in-out
                    lg:relative lg:translate-x-0 lg:w-64 lg:shadow-none lg:z-auto
                    ${open ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {sidebarContent}
            </aside>
        </>
    );
}
```

---

### `/high-voltage/src/components/admin/CategoryManager.tsx`
```tsx
'use client'

import { useState, useTransition } from 'react'
import { type Category } from '@/services/categoryService'
import { saveCategory, deleteCategory } from '@/app/(admin)/admin/categories/actions'
import { toast } from 'sonner'
import {
    Plus, Trash2, Edit3, X, Check, GripVertical,
    Tag, Image as ImageIcon, Link as LinkIcon, AlignLeft, Hash, Palette,
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

const slugify = (s: string) =>
    s.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

// ── Sub-components ────────────────────────────────────────────────────────────

interface FieldProps {
    label: string
    icon?: React.ReactNode
    children: React.ReactNode
    hint?: string
}
function Field({ label, icon, children, hint }: FieldProps) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                {icon}
                {label}
            </label>
            {children}
            {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
        </div>
    )
}

const inputClass =
    'block w-full rounded-lg border border-gray-300 py-2 px-3 text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors'

// ── Category Form (modal) ─────────────────────────────────────────────────────

interface CategoryFormProps {
    initial?: Category
    onClose: () => void
    onSaved: (c: Category) => void
}

function CategoryForm({ initial, onClose, onSaved }: CategoryFormProps) {
    const [name, setName]       = useState(initial?.name     || '')
    const [slug, setSlug]       = useState(initial?.slug     || '')
    const [tagline, setTagline] = useState(initial?.tagline  || '')
    const [subtitle, setSubt]   = useState(initial?.subtitle || '')
    const [crest, setCrest]     = useState(initial?.crest    || '')
    const [image, setImage]     = useState(initial?.image    || '')
    const [accent, setAccent]   = useState(initial?.accent   || '')
    const [order, setOrder]     = useState(String(initial?.order ?? 99))
    const [pending, startT]     = useTransition()

    const handleNameChange = (v: string) => {
        setName(v)
        if (!initial) setSlug(slugify(v))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        startT(async () => {
            const res = await saveCategory(fd)
            if ((res as any).error) {
                toast.error((res as any).error)
            } else {
                toast.success(initial ? 'Category updated!' : 'Category created!')
                onSaved({
                    id: initial?.id || slug || slugify(name),
                    name, slug: slug || slugify(name), tagline, subtitle, crest, image, accent,
                    order: parseInt(order, 10),
                })
            }
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-lg font-bold text-gray-900">
                        {initial ? 'Edit Category' : 'Add Category'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input type="hidden" name="id" value={initial?.id || ''} />

                    <Field label="Category Name" icon={<Tag className="w-3 h-3" />}>
                        <input
                            name="name"
                            value={name}
                            onChange={e => handleNameChange(e.target.value)}
                            placeholder="e.g. Pub Jerseys"
                            required
                            className={inputClass}
                        />
                    </Field>

                    <Field label="URL Slug" icon={<LinkIcon className="w-3 h-3" />}
                        hint="Used in the URL: /collections/pub-jerseys">
                        <input
                            name="slug"
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                            placeholder="pub-jerseys"
                            required
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Tagline" icon={<Hash className="w-3 h-3" />}
                        hint="Shown in large text on the collection page (e.g. SOCIAL GEAR)">
                        <input
                            name="tagline"
                            value={tagline}
                            onChange={e => setTagline(e.target.value)}
                            placeholder="SOCIAL GEAR"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Subtitle" icon={<AlignLeft className="w-3 h-3" />}
                        hint="Short description shown below the title">
                        <input
                            name="subtitle"
                            value={subtitle}
                            onChange={e => setSubt(e.target.value)}
                            placeholder="Social gear for your local community"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Crest Image URL" icon={<ImageIcon className="w-3 h-3" />}
                        hint="Path to crest image (e.g. /assets/limerick_crest_final.png)">
                        <input
                            name="crest"
                            value={crest}
                            onChange={e => setCrest(e.target.value)}
                            placeholder="/assets/my_crest.png"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Card Image URL" icon={<ImageIcon className="w-3 h-3" />}
                        hint="Image shown on the homepage collection card">
                        <input
                            name="image"
                            value={image}
                            onChange={e => setImage(e.target.value)}
                            placeholder="/assets/my_collection.jpg"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Accent Colour" icon={<Palette className="w-3 h-3" />}
                        hint="Optional hex colour for the card accent (e.g. #4ade80)">
                        <div className="flex items-center gap-2">
                            <input
                                name="accent"
                                value={accent}
                                onChange={e => setAccent(e.target.value)}
                                placeholder="#4ade80"
                                className={`${inputClass} flex-1`}
                            />
                            {accent && (
                                <span
                                    className="w-9 h-9 rounded-lg border border-gray-300 flex-shrink-0"
                                    style={{ background: accent }}
                                />
                            )}
                        </div>
                    </Field>

                    <Field label="Display Order" icon={<GripVertical className="w-3 h-3" />}
                        hint="Lower numbers appear first">
                        <input
                            name="order"
                            type="number"
                            value={order}
                            onChange={e => setOrder(e.target.value)}
                            min={1}
                            className={`${inputClass} max-w-[120px]`}
                        />
                    </Field>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={pending}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg disabled:opacity-50 flex items-center gap-2 transition-colors shadow-sm"
                        >
                            {pending ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                            {initial ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ── Category Card ─────────────────────────────────────────────────────────────

interface CategoryCardProps {
    cat: Category
    onEdit: () => void
    onDelete: () => void
}
function CategoryCard({ cat, onEdit, onDelete }: CategoryCardProps) {
    return (
        <div className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all">
            <GripVertical className="w-5 h-5 text-gray-300 flex-shrink-0" />

            {/* Colour dot / crest preview */}
            {cat.crest ? (
                <img
                    src={cat.crest}
                    alt=""
                    className="w-10 h-10 object-contain rounded flex-shrink-0 bg-gray-50 border border-gray-100 p-0.5"
                />
            ) : (
                <div
                    className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-lg font-black"
                    style={{ background: cat.accent || '#6366f1' }}
                >
                    {cat.name.charAt(0).toUpperCase()}
                </div>
            )}

            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{cat.name}</p>
                <p className="text-[11px] text-gray-400 font-mono">/collections/{cat.slug}</p>
                {cat.tagline && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mt-0.5">{cat.tagline}</p>
                )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="hidden sm:inline text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded uppercase tracking-wider">
                    #{cat.order ?? '—'}
                </span>
                <button
                    onClick={onEdit}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
    const [categories, setCategories] = useState<Category[]>(initialCategories)
    const [showForm, setShowForm]     = useState(false)
    const [editing, setEditing]       = useState<Category | undefined>(undefined)
    const [, startT]                  = useTransition()

    const openCreate = () => { setEditing(undefined); setShowForm(true) }
    const openEdit   = (c: Category) => { setEditing(c); setShowForm(true) }
    const closeForm  = () => { setShowForm(false); setEditing(undefined) }

    const handleSaved = (cat: Category) => {
        setCategories(prev => {
            const idx = prev.findIndex(c => c.id === cat.id)
            if (idx >= 0) return prev.map((c, i) => i === idx ? cat : c)
            return [...prev, cat]
        })
        closeForm()
    }

    const handleDelete = (id: string) => {
        if (!confirm('Delete this category? Products assigned to it will not be deleted.')) return
        startT(async () => {
            const res = await deleteCategory(id)
            if ((res as any).error) {
                toast.error((res as any).error)
            } else {
                toast.success('Category deleted')
                setCategories(prev => prev.filter(c => c.id !== id))
            }
        })
    }

    const sorted = [...categories].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

    return (
        <>
            {/* List */}
            <div className="space-y-3">
                {/* Add button */}
                <button
                    onClick={openCreate}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-indigo-300 text-indigo-600 font-semibold text-sm rounded-xl py-3 hover:bg-indigo-50 hover:border-indigo-400 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add New Category
                </button>

                {sorted.map(cat => (
                    <CategoryCard
                        key={cat.id}
                        cat={cat}
                        onEdit={() => openEdit(cat)}
                        onDelete={() => handleDelete(cat.id)}
                    />
                ))}

                {sorted.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No categories yet</p>
                        <p className="text-sm">Add your first category above.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showForm && (
                <CategoryForm
                    initial={editing}
                    onClose={closeForm}
                    onSaved={handleSaved}
                />
            )}
        </>
    )
}
```

---

### `/high-voltage/src/components/admin/ProductForm.tsx`
```tsx
'use client'

import { useActionState, useState, useEffect, startTransition } from 'react'
import { upsertProduct, uploadProductImage } from '@/app/(admin)/admin/products/actions'
import { Loader2, X, ImagePlus } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { Category } from '@/services/categoryService'

export default function ProductForm({ product, categories }: { product?: any; categories?: Category[] }) {
    const router = useRouter()
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<string[]>(product?.images || [])

    const [name, setName] = useState(product?.name || '')
    const [slug, setSlug] = useState(product?.slug || '')

    const [state, formAction, isPending] = useActionState(upsertProduct, null);

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        } else if (state?.success) {
            toast.success('Product saved successfully!')
            router.push('/admin/products')
            router.refresh()
        }
    }, [state, router]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setName(val)
        if (!product) {
            setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''))
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = e.target.files[0]

            const formData = new FormData();
            formData.append('file', file);

            const result = await uploadProductImage(formData);

            if (result.error) throw new Error(result.error);
            if (!result.url) throw new Error("No URL returned from upload");

            setImages(prev => [...prev, result.url!])
            toast.success('Image uploaded!')
        } catch (error) {
            toast.error('Error uploading image: ' + (error as Error).message)
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => {
            formAction(formData);
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <input type="hidden" name="id" value={product?.id || ''} />
            <input type="hidden" name="image_urls" value={images.join(',')} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">
                        {product ? 'Edit Product' : 'New Product'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {product ? 'Update the details for this product.' : 'Create a new product listing.'}
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                    {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : null}
                    {isPending ? 'Saving...' : 'Save Product'}
                </button>
            </div>

            {state?.error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-700">{state.error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Basic Information</h4>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                            <input type="text" name="name" id="name" value={name} onChange={handleNameChange} required
                                placeholder="e.g. Club Elite Home Jersey"
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                            <div className="flex items-center">
                                <span className="text-sm text-gray-400 mr-1">/products/</span>
                                <input type="text" name="slug" id="slug" value={slug} onChange={(e) => setSlug(e.target.value)}
                                    placeholder="auto-generated-from-name"
                                    className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea id="description" name="description" rows={4} defaultValue={product?.description || ''}
                                placeholder="Write a detailed description of the product..."
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Images</h4>
                        <div className="flex flex-wrap gap-4">
                            {images.map((url, idx) => (
                                <div key={idx} className="relative w-28 h-28 rounded-lg overflow-hidden border-2 border-gray-200 group hover:border-indigo-400 transition-colors">
                                    <Image src={url} alt="Product" fill className="object-cover" />
                                    <button type="button" onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                        <X className="w-3 h-3" />
                                    </button>
                                    {idx === 0 && (
                                        <span className="absolute bottom-1 left-1 text-[9px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-1.5 py-0.5 rounded">Primary</span>
                                    )}
                                </div>
                            ))}
                            <label htmlFor="image-upload"
                                className={`w-28 h-28 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                {uploading ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                                ) : (
                                    <>
                                        <ImagePlus className="w-6 h-6 text-gray-400" />
                                        <span className="text-[10px] text-gray-400 mt-1 font-medium">Add Image</span>
                                    </>
                                )}
                                <input id="image-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Pricing</h4>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
                            <input type="number" name="price" id="price" step="0.01" min="0"
                                defaultValue={product?.price || ''} placeholder="0.00"
                                className="block w-full max-w-xs rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Status & Visibility */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Status</h4>

                        <div>
                            <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                            <select id="visibility" name="visibility" defaultValue={product?.visibility || 'draft'}
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="published">Published (visible on website)</option>
                                <option value="draft">Draft (hidden)</option>
                                <option value="hidden">Hidden</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="product_status" className="block text-sm font-medium text-gray-700 mb-1">Product Status</label>
                            <select id="product_status" name="product_status" defaultValue={product?.product_status || 'available'}
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="available">🟢 Available for Purchase</option>
                                <option value="coming_soon">⏳ Coming Soon</option>
                                <option value="unavailable">🔴 Unavailable</option>
                                <option value="booking_only">🟠 Booking Only</option>
                            </select>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Organization</h4>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select id="category" name="category" defaultValue={product?.category || ''} required
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="" disabled>Select a category</option>
                                {(categories && categories.length > 0
                                    ? categories
                                    : [
                                        { id: 'club',          name: 'Club' },
                                        { id: 'limerick',      name: 'Limerick' },
                                        { id: 'tipperary',     name: 'Tipperary' },
                                        { id: 'irish',         name: 'Irish' },
                                        { id: 'schooluniform', name: 'School Uniform' },
                                        { id: 'pub-jerseys',   name: 'Pub Jerseys' },
                                    ]
                                ).map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                            <input type="text" name="tags" id="tags" defaultValue={product?.tags?.join(', ') || ''}
                                placeholder="tag1, tag2, tag3"
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Inventory</h4>

                        <div>
                            <label htmlFor="stock_status" className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                            <select id="stock_status" name="stock_status" defaultValue={product?.stock_status || 'in_stock'}
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="in_stock">In Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                                <option value="limited">Limited</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
```

---

### `/high-voltage/src/components/products/AvailabilityBadge.tsx`
```tsx
export default function AvailabilityBadge({ status }: { status: string }) {
    const styles = {
        available: 'bg-green-100 text-green-800 ring-green-600/20',
        unavailable: 'bg-red-100 text-red-800 ring-red-600/20',
        booking_only: 'bg-orange-100 text-orange-800 ring-orange-600/20',
    }

    const labels = {
        available: 'Available',
        unavailable: 'Unavailable',
        booking_only: 'Booking Only',
    }

    const statusKey = status as keyof typeof styles

    if (!styles[statusKey]) return null

    return (
        <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[statusKey]}`}
        >
            {labels[statusKey]}
        </span>
    )
}
```

---

### `/high-voltage/src/components/products/CartDrawer.tsx`
```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import Image from "next/image";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { useRouter } from "next/navigation";

export function CartDrawer() {
    const { items, removeFromCart, updateQuantity, total, isOpen, setIsOpen } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCheckout = () => {
        setIsOpen(false);
        router.push("/checkout");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-md bg-background-card border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-display font-black text-white uppercase flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-primary" />
                                Your Cart <span className="text-primary">({items.length})</span>
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <ShoppingBag className="w-16 h-16 text-white/10" />
                                    <p className="text-muted font-medium">Your cart is empty.</p>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-primary font-bold uppercase tracking-widest text-xs hover:underline"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                        {/* Image */}
                                        <div className="relative w-20 h-24 bg-background-elevated rounded-sm overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-white/5" />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-sm font-bold text-white uppercase line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.size)}
                                                        className="text-white/30 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-muted font-medium mt-1">Size: {item.size}</p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-price">{item.price}</p>

                                                {/* Quantity */}
                                                <div className="flex items-center border border-white/10 rounded-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                        className="p-1 px-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-bold text-white px-2">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                        className="p-1 px-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-background-elevated space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="font-bold text-white text-lg">€{total.toFixed(2)}</span>
                                </div>
                                <p className="text-[10px] text-muted text-center uppercase tracking-widest">
                                    Shipping & taxes calculated at checkout
                                </p>
                                <AnimatedButton
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                    variant="primary"
                                    animation="pro-max"
                                    className="w-full"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>Checkout Now <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </AnimatedButton>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
```

---

### `/high-voltage/src/components/products/Collections/CollectionHeader.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface CollectionHeaderProps {
    title: string;
    subtitle: string;
    crestImage?: string;
}

export function CollectionHeader({ title, subtitle, crestImage }: CollectionHeaderProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
            <div className="flex items-center gap-6 md:gap-8 mb-4">
                {/* Crest Image */}
                {crestImage && (
                    <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center p-3 rounded-2xl bg-primary-soft border-2 border-primary shadow-[0_0_30px_var(--color-primary-glow)]">
                        <Image
                            src={crestImage}
                            alt={`${title} Crest`}
                            fill
                            className="object-contain p-3 relative z-10"
                        />
                    </div>
                )}

                {/* Title */}
                <h2 className="text-4xl md:text-6xl font-display font-black text-foreground italic tracking-tighter uppercase relative z-10">
                    <span className="relative">
                        {title}
                        <span className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-2 md:h-3 skew-x-[-12deg] bg-primary/20 origin-left -z-10" />
                    </span>
                </h2>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 text-primary"
            >
                <div className="h-[1px] w-8 md:w-16 bg-primary/50" />
                <p className="font-sans font-medium text-xs md:text-sm tracking-[0.3em] uppercase">
                    {subtitle}
                </p>
                <div className="h-[1px] w-8 md:w-16 bg-primary/50" />
            </motion.div>
        </div>
    );
}
```

---

### `/high-voltage/src/components/products/Collections/LimerickHeader.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function LimerickHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-full py-20 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 border-y border-white/10 my-10 bg-forest/30 backdrop-blur-sm"
        >
            {/* Crest Image */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0">
                <Image
                    src="/assets/crest.png"
                    alt="Limerick Crest"
                    fill
                    className="object-contain drop-shadow-[0_0_15px_rgba(0,187,109,0.3)]"
                />
            </div>

            {/* Text */}
            <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-6xl font-display font-bold text-white uppercase tracking-tight">
                    The Limerick
                    <span className="block text-primary">Collection</span>
                </h2>
                <p className="mt-2 text-white/60 font-sans max-w-md">
                    Honor the heritage. Elite performance gear for the dedicated.
                </p>
            </div>
        </motion.div>
    );
}
```

---

### `/high-voltage/src/components/products/Collections/PubJerseyHeader.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function PubJerseyHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-full py-20 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 border-y border-white/10 my-10 bg-primary/10 backdrop-blur-sm"
        >
            {/* Crest/Icon Image */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0">
                <Image
                    src="/assets/pub-jerseys/1000038099.png"
                    alt="Pub Jersey Icon"
                    fill
                    className="object-contain drop-shadow-[0_0_15px_rgba(102,187,106,0.3)]"
                />
            </div>

            {/* Text */}
            <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-6xl font-display font-bold text-white uppercase tracking-tight">
                    The Pub Jersey
                    <span className="block text-primary">Collection</span>
                </h2>
                <p className="mt-2 text-white/60 font-sans max-w-md">
                    The new craze. Custom designs for your local community and pub.
                </p>
            </div>
        </motion.div>
    );
}
```

---

### `/high-voltage/src/components/products/CollectionsShowcase.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface CollectionCardProps {
    title: string;
    subtitle: string;
    image: string;
    slug: string;
    accentColor?: string;
}


function CollectionCard({ title, subtitle, image, slug, accentColor = "var(--color-primary)" }: CollectionCardProps) {
    return (
        <Link href={`/collections/${slug}`} className="block">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="relative group cursor-pointer overflow-hidden rounded-xl shadow-[0_2px_12px_var(--color-shadow)]"
            >
                {/* Background Image */}
                <div className="aspect-[4/5] w-full overflow-hidden relative">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        quality={70}
                    />
                    {/* Dark overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p
                        className="text-xs uppercase tracking-[0.2em] mb-2 font-medium"
                        style={{ color: accentColor }}
                    >
                        {subtitle}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-wide">
                        {title}
                    </h3>
                    <div className="mt-4 flex items-center gap-2 text-white/70 text-sm group-hover:text-white transition-colors">
                        <span>View Products</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

export function CollectionsShowcase({ categories }: { categories?: import('@/services/categoryService').Category[] }) {
    // Fallback hardcoded collection cards
    const fallbackCollections = [
        { title: "CLUB",        subtitle: "Before Everything",  image: "/assets/club-1.png",                   slug: "club",        accentColor: "var(--color-primary)" },
        { title: "GAEILGE",     subtitle: "Heritage Collection",image: "/assets/irish-1.png",                  slug: "gaeilge",     accentColor: "#FFFFFF" },
        { title: "PUB JERSEYS", subtitle: "Social Collection",  image: "/assets/pub-jerseys/1000038099.png",   slug: "pub-jerseys", accentColor: "var(--color-primary)" },
        { title: "LIMERICK",    subtitle: "Treaty City",        image: "/assets/limerick-1.png",               slug: "limerick",    accentColor: "var(--color-primary)" },
        { title: "TIPPERARY",   subtitle: "Premier County",     image: "/assets/tipperary-1.png",              slug: "tipperary",   accentColor: "var(--color-primary)" },
    ];

    const collections = categories && categories.length > 0
        ? categories.map(cat => ({
            title:       cat.name.toUpperCase(),
            subtitle:    cat.subtitle || cat.tagline || '',
            image:       cat.image || cat.crest || '/assets/club-1.png',
            slug:        cat.slug,
            accentColor: cat.accent || 'var(--color-primary)',
        }))
        : fallbackCollections;

    return (
        <section id="lookbook" className="py-16 md:py-24 px-4 md:px-8 bg-background-elevated scroll-mt-32">
            <div className="max-w-[1600px] mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-wide">
                        The Collections
                    </h2>
                    <p className="mt-2 text-muted text-sm tracking-wide">
                        Select a category to explore the elite range.
                    </p>
                </motion.div>

                {/* Collections Scrollable Row */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    {collections.map((collection) => (
                        <div key={collection.title} className="snap-start shrink-0 w-[260px] sm:w-[280px] md:w-[300px]">
                            <CollectionCard
                                {...collection}
                            />
                        </div>
                    ))}
                </div>

                {/* Bottom description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 relative overflow-hidden rounded-2xl border border-primary/30"
                >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background-elevated to-background-card" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">🇮🇪</span>
                                <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter">
                                    Promote <span className="text-primary text-glow">Gaeilge</span>
                                </h3>
                            </div>

                            <p className="text-muted text-lg leading-relaxed">
                                Wear the language with pride. We create <strong className="text-white">custom Irish language jerseys</strong> for schools and clubs, complete with your crest and Gaeilge text.
                                <span className="block mt-2 text-primary/80 text-sm font-bold uppercase tracking-widest">
                                    Perfect for Seachtain na Gaeilge & Club Identity
                                </span>
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 min-w-max">
                            <a href="/contact" className="px-8 py-4 bg-primary text-black font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_25px_var(--color-primary-glow)] rounded-sm inline-block text-center">
                                Get a Quote
                            </a>
                            <p className="text-center text-[10px] text-muted uppercase tracking-widest">
                                Special Rates for Schools
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
```

---

### `/high-voltage/src/components/products/FeaturedShop.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const SHOP_COLLECTIONS = [
    { name: "Club Teamwear", href: "#club", count: 8 },
    { name: "Limerick Collection", href: "#limerick", count: 8 },
    { name: "Tipperary Collection", href: "#tipperary", count: 8 },
    { name: "Irish Language Range", href: "#irish", count: 8 },
    { name: "School Uniforms", href: "/school-uniforms", count: 12 },
];

export function FeaturedShop() {
    return (
        <section className="relative py-24 bg-background border-t border-white/5">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
                        Browse Our Store
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">
                        Shop by <span className="text-primary">Collection</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
                    {/* Left Sidebar — Collection Links */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="md:col-span-3"
                    >
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-8 pb-4 border-b border-white/10">
                            Collections
                        </h3>
                        <ul className="space-y-1">
                            {SHOP_COLLECTIONS.map((collection, i) => (
                                <li key={collection.name}>
                                    <Link
                                        href={collection.href}
                                        className="group flex items-center justify-between py-3 px-4 rounded-sm text-muted hover:text-white hover:bg-white/5 transition-all duration-300"
                                    >
                                        <span className="text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                                            {collection.name}
                                        </span>
                                        <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {collection.count}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-12 p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-sm">
                            <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">Custom Orders</p>
                            <p className="text-sm text-muted leading-relaxed mb-4">
                                Need custom jerseys for your school or club? Get in touch.
                            </p>
                            <Link href="/contact" className="text-xs font-bold uppercase tracking-widest text-white hover:text-primary transition-colors flex items-center gap-2">
                                Contact Us <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right — Featured Product Display */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="md:col-span-9"
                    >
                        <div className="relative bg-background-elevated rounded-sm overflow-hidden border border-white/5 group">
                            {/* Large Product Showcase */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                {/* Front View */}
                                <div className="relative aspect-[3/4] md:aspect-auto overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                                    <Image
                                        src="/assets/1000030808.png"
                                        alt="Club Elite Home Jersey - Front"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute bottom-6 left-6 z-10">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                            Front View
                                        </span>
                                    </div>
                                </div>
                                {/* Back View */}
                                <div className="relative aspect-[3/4] md:aspect-auto overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a]">
                                    <Image
                                        src="/assets/1000030809.png"
                                        alt="Club Elite Away Jersey - Back"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute bottom-6 left-6 z-10">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                            Back View
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Product Info Bar */}
                            <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-white/5">
                                <div>
                                    <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Featured Collection</p>
                                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                                        Club Elite Series
                                    </h3>
                                    <p className="text-muted text-sm mt-2">Premium match-day jerseys with breathable performance fabric.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-black text-price">From €54.99</span>
                                    <Link href="/collections/club" className="bg-primary text-black font-black uppercase tracking-widest text-xs px-8 py-4 hover:scale-105 hover:shadow-[0_0_20px_var(--color-primary-glow)] transition-all duration-300 rounded-sm flex items-center gap-2">
                                        Shop Now <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Logo Watermark */}
                            <div className="absolute bottom-8 right-8 opacity-10 pointer-events-none">
                                <Image src="/assets/af-logo.png" alt="" width={96} height={32} className="h-auto" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
```

---

### `/high-voltage/src/components/products/JerseyPreview.tsx`
```tsx
"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { RotateCw } from "lucide-react";

interface JerseyPreviewProps {
    colors: Record<string, string>;
    pattern: string;
    collar: string;
    teamName: string;
    playerName: string;
    playerNumber: string;
    showCrest: boolean;
    sponsorText: string;
    showSponsor: boolean;
    garmentLabel?: string;
    texture?: string;
    sleeveStyle?: string;
    baseImage?: string;
}

export function JerseyPreview({
    colors,
    pattern,
    collar,
    teamName,
    playerName,
    playerNumber,
    showCrest,
    sponsorText,
    showSponsor,
    garmentLabel = "Custom Jersey",
    texture = "smooth",
    sleeveStyle = "short",
    baseImage,
}: JerseyPreviewProps) {
    const [view, setView] = useState<"front" | "back">("front");
    const isBack = view === "back";

    // Colors resolution handling both old and new mapping
    const defaultColor = "#ffffff";
    const bodyColor = colors.frontPiece || colors.body || defaultColor;
    const sleevesColor = colors.sleeves || bodyColor;
    const shouldersColor = colors.shoulders || bodyColor;
    const sidePanelsColor = colors.sidePanels || bodyColor;
    const collarColor = colors.collar || bodyColor;
    const cuffsColor = colors.knittedTube || colors.cuffs || sleevesColor;

    // Sleeve Logic
    const isLong = sleeveStyle === "long";
    const sleeveExt = isLong ? 60 : 0;
    const sleeveW = 250 + sleeveExt;
    const cuffW = isLong ? 20 : 15;

    // ─── PATH DEFINITIONS ───
    // ... (Keep existing definitions)

    // Shoulders (Yoke)
    const shouldersPath = `
        M 80 0 
        L 220 0 
        L 235 15 
        L 220 50 
        Q 150 70 80 50 
        L 65 15 
        Z
    `;

    // Sleeves (Left & Right)
    const sleeveLeftPath = `
        M 65 15 
        L 80 50 
        L 70 110 
        Q ${300 - sleeveW + 10} 100 ${300 - sleeveW} 90 
        L ${300 - sleeveW} 20 
        L 50 20 
        Z
    `;
    const sleeveRightPath = `
        M 235 15 
        L 220 50 
        L 230 110 
        Q ${sleeveW - 10} 100 ${sleeveW} 90
        L ${sleeveW} 20
        L 250 20
        Z
    `;

    const cuffLeftPath = `
        M ${300 - sleeveW} 20
        L ${300 - sleeveW} 90
        L ${300 - sleeveW - cuffW} 85
        L ${300 - sleeveW - cuffW} 20
        Z
    `;

    const cuffRightPath = `
        M ${sleeveW} 20
        L ${sleeveW} 90
        L ${sleeveW + cuffW} 85
        L ${sleeveW + cuffW} 20
        Z
    `;

    // Main Body
    const bodyPath = `
        M 80 50
        Q 150 70 220 50
        L 230 110
        Q 220 250 230 400
        L 70 400
        Q 80 250 70 110
        Z
    `;

    // Side Panels
    const sidePanelLeftPath = `
        M 70 110
        Q 80 250 70 400
        L 85 400
        Q 95 250 85 110
        Z
    `;
    const sidePanelRightPath = `
        M 230 110
        Q 220 250 230 400
        L 215 400
        Q 205 250 215 110
        Z
    `;


    // Pattern ID
    const patternId = isBack ? "jersey-pattern-back" : "jersey-pattern-front";

    const patternDef = (): ReactNode => {
        // ... (Keep existing pattern defs)
        const primaryColor = bodyColor;
        const secondaryColor = shouldersColor;

        const pDef = (id: string) => {
            switch (pattern) {
                // ... (Keep enum cases)
                case "stripes":
                    return (
                        <pattern id={id} width="36" height="10" patternUnits="userSpaceOnUse">
                            <rect width="18" height="10" fill={primaryColor} />
                            <rect x="18" width="18" height="10" fill={secondaryColor} />
                        </pattern>
                    );
                case "hoops":
                    return (
                        <pattern id={id} width="10" height="36" patternUnits="userSpaceOnUse">
                            <rect width="10" height="18" fill={primaryColor} />
                            <rect y="18" width="10" height="18" fill={secondaryColor} />
                        </pattern>
                    );
                case "half-half":
                    return (
                        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="50%" stopColor={primaryColor} />
                            <stop offset="50%" stopColor={secondaryColor} />
                        </linearGradient>
                    );
                case "gradient":
                    return (
                        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={primaryColor} />
                            <stop offset="100%" stopColor={secondaryColor} />
                        </linearGradient>
                    );
                case "chelsea":
                case "chevron":
                    return (
                        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={primaryColor} />
                            <stop offset="30%" stopColor={primaryColor} />
                            <stop offset="50%" stopColor={secondaryColor} />
                            <stop offset="70%" stopColor={primaryColor} />
                            <stop offset="100%" stopColor={primaryColor} />
                        </linearGradient>
                    );
                case "sash":
                    return (
                        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="20%" stopColor={primaryColor} />
                            <stop offset="25%" stopColor={secondaryColor} />
                            <stop offset="75%" stopColor={secondaryColor} />
                            <stop offset="80%" stopColor={primaryColor} />
                        </linearGradient>
                    );
                default:
                    return null;
            }
        };
        return pDef(patternId);
    };

    const fillBody = pattern === "solid" ? bodyColor : `url(#${patternId})`;

    // Texture function
    const textureDef = (): ReactNode => {
        return (
            <pattern id="tex-mesh" width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.5" fill="black" opacity="0.1" />
            </pattern>
        );
    };
    const texId = texture !== "smooth" ? `url(#tex-mesh)` : "none";


    // Generate a unique ID for the mask to prevent collisions
    const maskId = `jersey-mask-${isBack ? 'back' : 'front'}`;

    return (
        <div className="relative w-full h-full group flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden shadow-inner isolate">
            <svg viewBox="0 0 300 450" className="w-full h-full object-contain transform scale-105" preserveAspectRatio="xMidYMid meet">
                <defs>
                    {patternDef()}
                    {/* Define the image as a mask so colors are perfectly clipped to it */}
                    {baseImage && (
                        <mask id={maskId}>
                            <image href={`${baseImage}?v4`} width="300" height="450" />
                        </mask>
                    )}
                </defs>

                {/* 1. LAYER ONE: The Masked Colors */}
                {/* Apply the mask only if we have a base image to mask against */}
                <g mask={baseImage ? `url(#${maskId})` : "none"}>
                    <g style={{ mixBlendMode: 'normal' }}>
                        {/* Zones */}
                        <path d={sleeveLeftPath} fill={sleevesColor} />
                        <path d={sleeveRightPath} fill={sleevesColor} />
                        <path d={sidePanelLeftPath} fill={sidePanelsColor} />
                        <path d={sidePanelRightPath} fill={sidePanelsColor} />
                        <path d={bodyPath} fill={fillBody} />
                        <path d={shouldersPath} fill={shouldersColor} />
                        <path d={cuffLeftPath} fill={cuffsColor} />
                        <path d={cuffRightPath} fill={cuffsColor} />
                    </g>
                </g>

                {/* Collar isn't masked to ensure it stays crisp, though it could be */}
                <g>
                    {isBack ? (
                        <path d="M 80 0 Q 150 15 220 0" fill="none" stroke={collarColor} strokeWidth="6" strokeLinecap="round" />
                    ) : (
                        <path d="M 150 50 L 110 0 L 190 0 L 150 50" fill={collarColor} />
                    )}
                </g>

                {/* 2. LAYER TWO: The Texture Overlay */}
                {/* We place the base image directly in SVG, multiplying it over the colors for shadows/texture */}
                {baseImage && (
                    <image
                        href={`${baseImage}?v4`}
                        width="300"
                        height="450"
                        style={{ mixBlendMode: 'multiply', opacity: 1, pointerEvents: 'none' }}
                    />
                )}
            </svg>


            {/* 3. LOGOS & TEXT LAYER (Top - Unmasked because they might need to "pop" or sit slightly differently) */}
            <div className="absolute inset-0 z-30 pointer-events-none w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 300 450" className="w-full h-full object-contain">

                    {/* ─── CREST ─── */}
                    {!isBack && showCrest && (
                        <g transform="translate(200, 35)">
                            <image href="/assets/af-logo.png" x="0" y="0" width="30" height="30" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
                        </g>
                    )}

                    {/* ─── SPONSOR ─── */}
                    {!isBack && showSponsor && (
                        <g transform="translate(150, 180)">
                            <text textAnchor="middle" fill="white" fontSize={Math.min(28, 200 / (sponsorText.length || 1) * 2)} fontWeight="900" style={{ textTransform: "uppercase", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
                                {sponsorText || "SPONSOR"}
                            </text>
                        </g>
                    )}

                    {/* ─── BACK DETAILS ─── */}
                    {isBack && playerNumber && (
                        <g transform="translate(150, 220)">
                            <text textAnchor="middle" fill="white" fontSize="140" fontWeight="900" style={{ fontFamily: "Impact, sans-serif", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}>
                                {playerNumber}
                            </text>
                        </g>
                    )}

                    {isBack && playerName && (
                        <g transform="translate(150, 100)">
                            <text textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" letterSpacing="2" style={{ textTransform: "uppercase", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
                                {playerName}
                            </text>
                        </g>
                    )}
                </svg>
            </div>

            {/* View Toggle */}
            <button
                onClick={() => setView(view === "front" ? "back" : "front")}
                className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all border border-white/10 z-40 shadow-lg"
                title="Rotate View"
            >
                <RotateCw className="w-5 h-5" />
            </button>
        </div>
    );
}
```

---

### `/high-voltage/src/components/products/JerseyPreview3D.tsx`
```tsx
"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls, ContactShadows, Decal, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/assets/tshirt-model.glb");

// Model bounds: X(-0.2138, 0.2138), Y(-0.5, 0.5), Z(-0.4968, 0.4968)
// X axis = front(+) / back(-), Y axis = up(+) / down(-), Z axis = left(+) / right(-)

function classifyVertex(x: number, y: number, z: number, nx: number, ny: number, nz: number): string {
    const absZ = Math.abs(z);
    const absX = Math.abs(x);

    // ── COLLAR ── Top of neckline opening (Y > 0.40, within neck radius)
    const neckRadius = Math.sqrt(x * x + z * z);
    if (y > 0.40 && neckRadius < 0.16) return "collar";

    // ── NECK BINDING ── Just below collar, inner ring (Y > 0.35, tight radius)
    if (y > 0.35 && neckRadius < 0.13) return "neckBinding";

    // ── KNITTED TUBE: BOTTOM HEM ── Very bottom of the torso
    if (y < -0.42) return "knittedTube";

    // ── KNITTED TUBE: SLEEVE CUFFS ── Outer sleeve ends (far out + below shoulder)
    if (absZ > 0.40 && y < 0.05) return "knittedTube";

    // ── SLEEVES ── Arms extend far on Z axis
    const sleeveThreshold = 0.20 + (y + 0.1) * 0.15; // Dynamic threshold: wider at top
    if (absZ > Math.max(0.22, sleeveThreshold)) return "sleeves";

    // ── SHOULDER AREA ── Top + wide = sleeve territory
    if (y > 0.25 && absZ > 0.15) return "sleeves";

    // ── BACK PIECE ── Improved Logic
    // Simplify back-piece detection using coordinate X rather than relying solely on normals
    // X < -0.02 is safely on the back half of the torso
    if (x < -0.02) return "backPiece";

    // ── FRONT PIECE ── Everything remaining
    return "frontPiece";
}

// Apply a pattern effect to a zone color based on vertex position
// Returns the modified color hex string
function applyPattern(
    pattern: string,
    baseHex: string,
    secondaryHex: string,
    x: number, y: number, z: number,
    zone: string
): string {
    // Patterns only apply to body zones (front, back, sleeves), not to collar/binding/hem
    const isBodyZone = ["frontPiece", "backPiece", "sleeves"].includes(zone);
    if (!isBodyZone || pattern === "solid") return baseHex;

    const tempA = new THREE.Color(baseHex);
    const tempB = new THREE.Color(secondaryHex);

    switch (pattern) {
        case "hoops": {
            // Horizontal bands based on Y position
            const band = Math.floor((y + 0.5) * 8); // 8 bands across height
            return band % 2 === 0 ? baseHex : secondaryHex;
        }
        case "stripes": {
            // Vertical stripes based on Z position
            const stripe = Math.floor((z + 0.5) * 6); // 6 stripes across width
            return stripe % 2 === 0 ? baseHex : secondaryHex;
        }
        case "half-half": {
            // Split down the middle on Z axis
            return z > 0 ? baseHex : secondaryHex;
        }
        case "gradient": {
            // Smooth vertical gradient from top to bottom
            const t = (y + 0.5); // 0 at bottom, 1 at top
            tempA.lerp(tempB, 1 - t);
            return "#" + tempA.getHexString();
        }
        case "chevron": {
            // V-shaped pattern based on Y and Z
            const v = y + Math.abs(z) * 0.8;
            const chevBand = Math.floor((v + 0.5) * 6);
            return chevBand % 2 === 0 ? baseHex : secondaryHex;
        }
        case "camo": {
            // Digital camo: pseudo-random blocks based on position
            const bx = Math.floor((x + 0.5) * 10);
            const by = Math.floor((y + 0.5) * 10);
            const bz = Math.floor((z + 0.5) * 10);
            const hash = ((bx * 73 + by * 37 + bz * 53) % 7);
            if (hash < 3) return baseHex;
            if (hash < 5) return secondaryHex;
            // Third shade — blend
            tempA.lerp(tempB, 0.5);
            return "#" + tempA.getHexString();
        }
        case "block": {
            // Large colour block panels — top vs bottom
            return y > 0 ? baseHex : secondaryHex;
        }
        default:
            return baseHex;
    }
}

export interface JerseyPreview3DProps {
    colors: Record<string, string>;
    title: string;
    pattern?: string;
    customizations?: {
        teamName?: string;
        playerName?: string;
        playerNumber?: string;
        showCrest?: boolean;
        crestImage?: string | null;
        sponsorText?: string;
        sponsorImage?: string | null;
        showSponsor?: boolean;
    };
}

 

function Model({
    zoneColors,
    pattern = "solid",
    customizations = {}
}: {
    zoneColors: Record<string, string>;
    pattern?: string;
    customizations?: JerseyPreview3DProps["customizations"];
}) {
     

    const { nodes, materials } = useGLTF("/assets/tshirt-model.glb") as any;
    const group = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);

    // Zone Colors
    const frontPieceColor = zoneColors.frontPiece || zoneColors.body || "#ffffff";
    const backPieceColor = zoneColors.backPiece || frontPieceColor;
    const sleevesColor = zoneColors.sleeves || frontPieceColor;
    const collarColor = zoneColors.collar || frontPieceColor;
    const neckBindingColor = zoneColors.neckBinding || collarColor;
    const knittedTubeColor = zoneColors.knittedTube || zoneColors.cuffs || sleevesColor;

    const zoneColorMap: Record<string, string> = useMemo(() => ({
        frontPiece: frontPieceColor,
        backPiece: backPieceColor,
        sleeves: sleevesColor,
        collar: collarColor,
        neckBinding: neckBindingColor,
        knittedTube: knittedTubeColor,
    }), [frontPieceColor, backPieceColor, sleevesColor, collarColor, neckBindingColor, knittedTubeColor]);

    // Find the main mesh
    const mainMesh = useMemo(() => {
         

        return Object.values(nodes).find((n: any) => n.isMesh) as THREE.Mesh;
    }, [nodes]);

    // Build a clean geometry with vertex colors
    const coloredGeometry = useMemo(() => {
        if (!mainMesh) return null;
        const srcGeo = mainMesh.geometry;
        const geo = new THREE.BufferGeometry();

        // Extract position data — handle both standard and interleaved attributes
        const srcPos = srcGeo.getAttribute("position");
        if (!srcPos) return null;

        const vertexCount = srcPos.count;
        const posArr = new Float32Array(vertexCount * 3);

        // Safe extraction that works with ANY attribute type
        for (let i = 0; i < vertexCount; i++) {
            posArr[i * 3] = srcPos.getX(i);
            posArr[i * 3 + 1] = srcPos.getY(i);
            posArr[i * 3 + 2] = srcPos.getZ(i);
        }
        geo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));

        // Extract normals
        const srcNorm = srcGeo.getAttribute("normal");
        if (srcNorm) {
            const normArr = new Float32Array(vertexCount * 3);
            for (let i = 0; i < vertexCount; i++) {
                normArr[i * 3] = srcNorm.getX(i);
                normArr[i * 3 + 1] = srcNorm.getY(i);
                normArr[i * 3 + 2] = srcNorm.getZ(i);
            }
            geo.setAttribute("normal", new THREE.BufferAttribute(normArr, 3));
        }

        // Extract UVs
        const srcUv = srcGeo.getAttribute("uv");
        if (srcUv) {
            const uvArr = new Float32Array(vertexCount * 2);
            for (let i = 0; i < vertexCount; i++) {
                uvArr[i * 2] = srcUv.getX(i);
                uvArr[i * 2 + 1] = srcUv.getY(i);
            }
            geo.setAttribute("uv", new THREE.BufferAttribute(uvArr, 2));
        } else {
            // Polyfill uv so DecalGeometry doesn't throw Cannot read properties of undefined (reading 'getX') array index loop
            geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(vertexCount * 2), 2));
        }

        // Copy index
        if (srcGeo.index) {
            geo.setIndex(srcGeo.index.clone());
        }

        if (!geo.getAttribute("normal")) {
            geo.computeVertexNormals();
        }

        // Create vertex colors based on zone classification
        const colorArr = new Float32Array(vertexCount * 3);
        const tempColor = new THREE.Color();

        // Extract normals array for zone classification
        const srcNormAttr = geo.getAttribute("normal") as THREE.BufferAttribute;

        for (let i = 0; i < vertexCount; i++) {
            const x = posArr[i * 3];
            const y = posArr[i * 3 + 1];
            const z = posArr[i * 3 + 2];
            const nx = srcNormAttr ? srcNormAttr.getX(i) : 0;
            const ny = srcNormAttr ? srcNormAttr.getY(i) : 0;
            const nz = srcNormAttr ? srcNormAttr.getZ(i) : 0;
            const zone = classifyVertex(x, y, z, nx, ny, nz);
            const hex = zoneColorMap[zone] || frontPieceColor;
            tempColor.set(hex);
            colorArr[i * 3] = tempColor.r;
            colorArr[i * 3 + 1] = tempColor.g;
            colorArr[i * 3 + 2] = tempColor.b;
        }
        geo.setAttribute("color", new THREE.BufferAttribute(colorArr, 3));

        geo.computeBoundingBox();
        geo.computeBoundingSphere();
        return geo;
    }, [mainMesh, zoneColorMap, frontPieceColor]);

    // Material with vertex colors enabled
    const material = useMemo(() => {
        if (!mainMesh) return null;
        const mat = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.8,
            metalness: 0.1,
        });
        return mat;
    }, [mainMesh]);

    // Derive secondary color for patterns (use backPiece as the secondary, or white if same)
    const secondaryColor = useMemo(() => {
        if (backPieceColor !== frontPieceColor) return backPieceColor;
        if (sleevesColor !== frontPieceColor) return sleevesColor;
        // Default contrast: darken front piece
        const t = new THREE.Color(frontPieceColor);
        t.multiplyScalar(0.6);
        return "#" + t.getHexString();
    }, [frontPieceColor, backPieceColor, sleevesColor]);

    useEffect(() => {
        if (!coloredGeometry) return;
        const posAttr = coloredGeometry.getAttribute("position");
        const normAttr = coloredGeometry.getAttribute("normal");
        const colorAttr = coloredGeometry.getAttribute("color");
        if (!posAttr || !colorAttr) return;

        const tempColor = new THREE.Color();
        const count = posAttr.count;

        for (let i = 0; i < count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const z = posAttr.getZ(i);
            const nx = normAttr ? normAttr.getX(i) : 0;
            const ny = normAttr ? normAttr.getY(i) : 0;
            const nz = normAttr ? normAttr.getZ(i) : 0;
            const zone = classifyVertex(x, y, z, nx, ny, nz);
            const zoneHex = zoneColorMap[zone] || frontPieceColor;
            const finalHex = applyPattern(pattern, zoneHex, secondaryColor, x, y, z, zone);
            tempColor.set(finalHex);
            colorAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
        }
        colorAttr.needsUpdate = true;
    }, [coloredGeometry, zoneColorMap, frontPieceColor, pattern, secondaryColor]);

    // Slow rotation
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    // Load textures safely
    // useTexture throws if the URL is invalid or empty, so we must conditionally call it or load a transparent 1x1 pixel
    const emptyTextureUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const crestTex = useTexture(customizations.showCrest && customizations.crestImage ? customizations.crestImage : emptyTextureUrl);
    const sponsorTex = useTexture(customizations.showSponsor && customizations.sponsorImage ? customizations.sponsorImage : emptyTextureUrl);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        if (crestTex) crestTex.colorSpace = THREE.SRGBColorSpace;
        // eslint-disable-next-line react-hooks/immutability
        if (sponsorTex) sponsorTex.colorSpace = THREE.SRGBColorSpace;
    }, [crestTex, sponsorTex]);

    if (!mainMesh || !coloredGeometry || !material) return null;

    return (
        <group ref={group} dispose={null} scale={10} position={[0, -2, 0]}>
            <mesh ref={meshRef} geometry={coloredGeometry} material={material}>
                {/* Crest Decal (Left Chest - Viewer's Right) */}
                {customizations.showCrest && customizations.crestImage && (
                    <Decal
                        position={[0.08, 0.25, 0.14]} // Z is front/back
                        rotation={[0, 0, 0]}
                        scale={[0.08, 0.08, 0.08]}
                        map={crestTex}
                        depthTest={true}
                    />
                )}

                {/* Team Name Text (Right Chest - Viewer's Left) */}
                {customizations.teamName && (
                    <Text
                        position={[-0.08, 0.25, 0.17]}
                        rotation={[0, 0, 0]} // Face forwards (+Z)
                        fontSize={0.03}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.002}
                        outlineColor="#000000"
                        material-depthTest={false}
                        renderOrder={1} // Force render above mesh
                    >
                        {customizations.teamName.toUpperCase()}
                    </Text>
                )}

                {/* Sponsor Image Decal (Center Stomach) */}
                {customizations.showSponsor && customizations.sponsorImage && (
                    <Decal
                        position={[0, 0.1, 0.16]}
                        rotation={[0, 0, 0]}
                        scale={[0.15, 0.15, 0.15]}
                        map={sponsorTex}
                        depthTest={true}
                    />
                )}

                {/* Sponsor Text (Center Stomach) fallback if no image but text exists */}
                {customizations.showSponsor && !customizations.sponsorImage && customizations.sponsorText && (
                    <Text
                        position={[0, 0.1, 0.18]}
                        rotation={[0, 0, 0]} // Face forwards (+Z)
                        fontSize={0.04}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.002}
                        outlineColor="#000000"
                        material-depthTest={false}
                        renderOrder={1}
                    >
                        {customizations.sponsorText}
                    </Text>
                )}

                {/* Player Name (Upper Back) */}
                {customizations.playerName && (
                    <Text
                        position={[0, 0.25, -0.18]}
                        rotation={[0, Math.PI, 0]} // Face backwards (-Z)
                        fontSize={0.04}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.002}
                        outlineColor="#000000"
                        material-depthTest={false}
                        renderOrder={1}
                    >
                        {customizations.playerName.toUpperCase()}
                    </Text>
                )}

                {/* Player Number (Center Back) */}
                {customizations.playerNumber && (
                    <Text
                        position={[0, 0.05, -0.19]}
                        rotation={[0, Math.PI, 0]} // Face backwards (-Z)
                        fontSize={0.15}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.005}
                        outlineColor="#000000"
                        material-depthTest={false}
                        renderOrder={1}
                    >
                        {customizations.playerNumber}
                    </Text>
                )}
            </mesh>
        </group>
    );
}

export function JerseyPreview3D({ colors, title, pattern = "solid", customizations = {} }: JerseyPreview3DProps) {
    return (
        <div className="w-full h-[400px] md:h-[600px] lg:h-[700px] bg-gradient-to-br from-[#1a1c23] to-black rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
            {/* Top Indicator */}
            <div className="absolute top-4 left-6 z-10">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/50">LIVE 3D PREVIEW</span>
                </div>
                <h3 className="text-white font-bold text-lg leading-tight mt-1">{title}</h3>
            </div>

            {/* Color Legend */}
            <div className="absolute top-4 right-6 z-10 flex gap-1.5">
                {Object.entries(colors).map(([zone, hex]) => (
                    <div
                        key={zone}
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: hex }}
                        title={zone}
                    />
                ))}
            </div>

            {/* Instruction */}
            <div className="absolute bottom-4 left-0 right-0 text-center z-10 pointer-events-none">
                <p className="text-[10px] text-white/50 uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="w-4 h-[1px] bg-white/20" />
                    Drag to rotate &bull; Scroll to zoom
                    <span className="w-4 h-[1px] bg-white/20" />
                </p>
            </div>

            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Environment preset="city" />

                <Model zoneColors={colors} pattern={pattern} customizations={customizations} />

                <OrbitControls
                    enablePan={false}
                    minDistance={4}
                    maxDistance={12}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2 + 0.1}
                />

                <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={15} blur={2} far={4.5} />
            </Canvas>
        </div>
    );
}
```

---

### `/high-voltage/src/components/products/ProductCard.tsx`
```tsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

interface ProductProps {
    id: string | number;
    slug?: string;
    title: string;
    price: string | number;
    image?: string;
    category: string;
    imageStyle?: React.CSSProperties;
    onQuickAdd?: () => void;
    status?: string;
    sizeChart?: string;
    isHero?: boolean;
    isKids?: boolean;
    stockStatus?: string;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
    Club: { bg: "bg-badge-club", text: "text-white" },
    Limerick: { bg: "bg-badge-limerick", text: "text-black" },
    Tipperary: { bg: "bg-badge-tipperary", text: "text-white" },
    Irish: { bg: "bg-badge-gaeilge", text: "text-white" },
    Gaeilge: { bg: "bg-badge-gaeilge", text: "text-white" },
};

export function ProductCard({ id, slug, title, price, image, category, imageStyle, onQuickAdd, status = "live", sizeChart, isHero = false, isKids, stockStatus = "in_stock" }: ProductProps) {
    const isComingSoon = status === "coming_soon";
    const [showSizeChart, setShowSizeChart] = useState(false);
    const hoverTimer = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (!sizeChart) return;
        hoverTimer.current = setTimeout(() => {
            setShowSizeChart(true);
        }, 2800);
    };

    const handleMouseLeave = () => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        setShowSizeChart(false);
    };

    const productHref = isComingSoon
        ? `/contact?subject=interest&product=${encodeURIComponent(title)}`
        : `/products/${encodeURIComponent(slug || String(id))}${isKids ? "?type=kids" : ""}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group relative w-full bg-transparent cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Image Container */}
            <div className={`relative ${isHero ? "aspect-[4/5] lg:aspect-square" : "aspect-[3/4]"} overflow-hidden bg-background-elevated rounded-lg`}>
                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full w-fit">
                        {category}
                    </span>
                    {isComingSoon && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-black bg-[#66BB6A] px-3 py-1.5 rounded-full w-fit">
                            Launching Soon
                        </span>
                    )}
                    {stockStatus !== 'in_stock' && !isComingSoon && (
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit ${stockStatus === 'out_of_stock' ? 'bg-red-500/90 text-white' :
                            'bg-amber-500/90 text-black' // limited
                            }`}>
                            {String(stockStatus).replace('_', ' ')}
                        </span>
                    )}
                </div>

                {/* Product Image — FLIP source with layoutId */}
                <Link href={productHref} className="block w-full h-full">
                    <motion.div
                        layoutId={`product-image-${id}`}
                        transition={{
                            layout: {
                                duration: 0.35,
                                ease: [0.4, 0.0, 0.2, 1],
                            },
                        }}
                        className="w-full h-full"
                    >
                        <div className="w-full h-full transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.08] relative">
                            {image ? (
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                    style={imageStyle}
                                    priority={isHero}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-background-elevated to-background">
                                    <span className="text-muted/40 text-sm font-medium">{title}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </Link>

                {/* Size Chart Overlay */}
                <AnimatePresence>
                    {showSizeChart && sizeChart && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 z-30 bg-background-elevated flex items-center justify-center p-2"
                        >
                            <Image src={sizeChart} alt="Size Chart" fill className="object-contain" />
                            <div className="absolute bottom-2 left-0 right-0 text-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-black bg-white/90 px-2 py-1 rounded-sm">Size Chart</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick View + View Details Buttons */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-gradient-to-t from-black/98 via-black/80 to-transparent pt-12 z-40">
                    <div className="flex flex-col gap-2">
                        <AnimatedButton
                            onClick={() => {
                                if (isComingSoon) {
                                    window.location.href = productHref;
                                } else {
                                    onQuickAdd?.();
                                }
                            }}
                            variant={isComingSoon ? "secondary" : "primary"}
                            animation="gloss"
                            className="w-full !py-3 !px-4 text-xs flex justify-center items-center gap-2"
                        >
                            <Eye className="w-4 h-4" />
                            {isComingSoon ? "Register Interest" : "Quick View"}
                        </AnimatedButton>

                        {!isComingSoon && (
                            <AnimatedButton
                                href={productHref}
                                variant="outline"
                                animation="magnetic"
                                className="w-full !py-3 !px-4 text-xs flex justify-center items-center gap-2 backdrop-blur-sm bg-black/40"
                            >
                                View Details
                                <ArrowRight className="w-3.5 h-3.5" />
                            </AnimatedButton>
                        )}
                    </div>
                </div>

                {/* Border glow */}
                <div className="absolute inset-0 rounded-lg border border-white/0 group-hover:border-primary/30 transition-all duration-500 pointer-events-none z-50" />
            </div>

            {/* Product Info — FLIP source for title */}
            <div className="pt-4 flex items-start justify-between gap-2">
                <div>
                    <motion.div
                        layoutId={`product-title-${id}`}
                        transition={{
                            layout: {
                                duration: 0.35,
                                ease: [0.4, 0.0, 0.2, 1],
                            },
                        }}
                    >
                        <Link
                            href={productHref}
                            className="text-sm font-medium text-white/90 leading-tight mb-1.5 group-hover:text-primary transition-colors duration-300 block"
                        >
                            {title}
                        </Link>
                    </motion.div>
                    <p className="text-price font-bold text-sm tracking-wide">
                        {isComingSoon ? "Coming Soon" : price}
                    </p>
                </div>

                <Link
                    href={productHref}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 text-primary hover:text-white relative overflow-hidden group/arrow"
                    title={isComingSoon ? "Register Interest" : "View Full Details"}
                >
                    <ArrowRight className="w-4 h-4 group-hover/arrow:translate-x-[150%] transition-transform duration-300 ease-in" />
                    <ArrowRight className="w-4 h-4 absolute inset-0 m-auto -translate-x-[150%] group-hover/arrow:translate-x-0 transition-transform duration-300 delay-100 ease-out" />
                </Link>
            </div>

            {/* Mobile links */}
            <div className="md:hidden flex items-center gap-4 mt-2.5">
                {!isComingSoon && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onQuickAdd?.();
                        }}
                        className="text-[11px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-sm flex items-center gap-1 active:scale-95 duration-200"
                    >
                        <span>⚡</span> Quick View
                    </button>
                )}
                <Link
                    href={productHref}
                    className="text-[11px] font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors py-1.5 flex items-center gap-1"
                >
                    {isComingSoon ? "Register Interest →" : "Details →"}
                </Link>
            </div>
        </motion.div>
    );
}
```

---

### `/high-voltage/src/components/products/ProductGrid.tsx`
```tsx
"use client";

import { ProductCard } from "./ProductCard";
import { CollectionHeader } from "./Collections/CollectionHeader";
import { motion, LayoutGroup } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ProductModal } from "./ProductModal";
import Link from "next/link";
import { getEffectiveCategory, slugifyProductPath } from "@/utils/productUtils";

interface ProductGridProps {
    filter: string;
     
    products: any[];
}

interface SelectedProduct {
    id: string;
    slug?: string;
    title: string;
    price: string | number;
    image?: string;
    category: string;
    description: string;
    product_status: string;
    stock_status: string;
    images?: string[];
}

interface Collection {
    title: string;
    subtitle: string;
    products: SelectedProduct[];
}

export function ProductGrid({ filter, products = [] }: ProductGridProps) {
    const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);

    const seenIds = new Set();
    const collections = products.reduce((acc, product) => {
        // Skip literal duplicates by ID
        if (seenIds.has(product.id)) return acc;
        seenIds.add(product.id);

        const category = getEffectiveCategory(product);

        if (!acc[category]) {
            acc[category] = {
                title: category,
                subtitle: `Premium ${category} Collection`,
                products: []
            };
        }

        acc[category].products.push({
            id: product.id,
            title: product.name,
            price: product.price ? `€${product.price}` : 'Contact for Price',
            image: product.images?.[0] || '/placeholder.png',
            category: category, // Use the detected group category
            description: product.description,
            product_status: product.product_status,
            stock_status: product.stock_status,
            images: product.images,
            slug: product.slug,
        });
        return acc;
    }, {} as Record<string, Collection>);


    const collectionOrder = [
        'Gaeilge',
        'Club Sweaters',
        'Pub Jerseys',
        'Club',
        'Limerick',
        'Tipperary'
    ];
    
    const collectionsToShow = (filter === "All"
        ? Object.entries(collections).sort(([a], [b]) => {
            const indexA = collectionOrder.indexOf(a);
            const indexB = collectionOrder.indexOf(b);
            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        })
        : Object.entries(collections).filter(([key]) => key === filter)) as [string, Collection][];

    return (
        <LayoutGroup>
            <div className="w-full max-w-[1920px] mx-auto pb-32 overflow-hidden">
                {collectionsToShow.map(([key, collection]: [string, Collection]) => (
                    <div key={key}>
                        {/* Adult Section */}
                        <section id={slugifyProductPath(key)} className="mb-24 relative scroll-mt-32">
                            <div className="px-4 md:px-8 max-w-[1600px] mx-auto text-center mb-8">
                                <CollectionHeader
                                    title={collection.title}
                                    subtitle={collection.subtitle}
                                    crestImage={
                                        key === "Limerick" ? "/assets/limerick_crest_final.png" :
                                            key === "Tipperary" ? "/assets/tipperary_crest_final.png" :
                                                undefined
                                    }
                                />

                                {/* No Extra Charge Note */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="mt-6 flex flex-col items-center gap-2"
                                >
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] border border-primary/20">
                                        Premium Inclusive Pricing
                                    </span>
                                    <p className="text-muted text-sm max-w-lg mx-auto leading-relaxed">
                                        No extra charge for custom additions like club sponsors, initials, or names on jerseys.
                                    </p>
                                </motion.div>
                            </div>

                            {/* Scrollable Row */}
                            <div className="relative w-full">
                                <div
                                    className="flex gap-6 overflow-x-auto snap-x scrollbar-hide px-4 md:px-8 pb-12 pt-4"
                                    style={{ scrollBehavior: 'smooth' }}
                                >
                                    {collection.products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="min-w-[280px] md:min-w-[320px] snap-start"
                                        >
                                            <ProductCard
                                                id={product.id}
                                                slug={product.slug}
                                                title={product.title}
                                                category={product.category}
                                                price={product.price}
                                                image={product.image}
                                                status={product.product_status}
                                                stockStatus={product.stock_status}
                                                onQuickAdd={() => setSelectedProduct(product)}
                                            />
                                        </div>
                                    ))}

                                    {/* View All Card */}
                                    <div className="min-w-[280px] md:min-w-[320px] snap-start flex items-center justify-center">
                                        <Link href={`/collections/${slugifyProductPath(key)}`} className="group flex flex-col items-center gap-4 p-8 border border-white/10 rounded-sm hover:border-primary/50 transition-colors bg-background-card h-full w-full justify-center">
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <ArrowRight className="w-6 h-6 text-primary" />
                                            </div>
                                            <span className="text-white font-bold uppercase tracking-widest text-sm group-hover:text-primary transition-colors">
                                                View All {key}
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Kids Section removed: Sizes integrated into Quick View */}
                    </div>
                ))}

                {collectionsToShow.length === 0 && (
                    <div className="py-20 text-center text-muted font-display uppercase tracking-widest">
                        No collections found
                    </div>
                )}

                {/* Shop All Products CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center pt-8 pb-16"
                >
                    <Link
                        href="#shop"
                        className="group relative inline-flex items-center gap-3 bg-primary text-black font-black uppercase tracking-[0.15em] text-sm px-12 py-5 rounded-sm hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(102,187,106,0.4)] transition-all duration-300"
                    >
                        Shop All Products
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </motion.div>
            </div>

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </LayoutGroup>
    );
}
```

---

### `/high-voltage/src/components/products/ProductImageMagnifier.tsx`
```tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProductImageMagnifierProps {
    src: string;
    alt: string;
    className?: string;
    objectFit?: 'cover' | 'contain';
}

export function ProductImageMagnifier({ src, alt, className = "", objectFit = "cover" }: ProductImageMagnifierProps) {
    const [zoom, setZoom] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const isContain = objectFit === "contain";

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isContain) return; // No zoom for size charts
        if (typeof window !== "undefined" && window.matchMedia('(pointer: coarse)').matches) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setPos({ x, y });
    };

    return (
        <div
            className={`relative overflow-hidden ${isContain ? 'cursor-default' : 'cursor-crosshair'} group ${className}`}
            onMouseEnter={() => !isContain && typeof window !== "undefined" && !window.matchMedia('(pointer: coarse)').matches && setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
        >
            <motion.img
                src={src}
                alt={alt}
                className={`w-full h-full ${isContain ? 'object-contain p-4' : 'object-cover'}`}
                style={{
                    transformOrigin: `${pos.x}% ${pos.y}%`,
                    transform: zoom ? 'scale(2.5)' : 'scale(1)',
                    transition: 'transform 0.1s ease-out'
                }}
            />
            {/* Optional Hint Overlay when NOT zoomed */}
            {!zoom && !isContain && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="bg-black/60 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                        Hover to Zoom
                    </span>
                </div>
            )}
        </div>
    );
}
```

---

### `/high-voltage/src/components/products/ProductModal.tsx`
```tsx
"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
    id: string | number;
    title: string;
    price: string | number;
    image?: string;
    category: string;
    defaultKids?: boolean;
    description?: string;
}

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

// Reduced motion check
const prefersReducedMotion =
    typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

const FLIP_TRANSITION = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.4, 0.0, 0.2, 1] as const };

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            delayChildren: prefersReducedMotion ? 0 : 0.15,
            staggerChildren: prefersReducedMotion ? 0 : 0.06,
        },
    },
};

const staggerItem = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: [0.0, 0.0, 0.2, 1] as const },
    },
};

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const [size, setSize] = useState("M");
    const [sizeType, setSizeType] = useState("Adults");
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const { addToCart } = useCart();
    const router = useRouter();

    // Reset sizes when a new product is opened
    useEffect(() => {
        if (product) {
            if (product.defaultKids) {
                setSizeType("Kids");
                setSize("3-4Y");
            } else {
                setSizeType("Adults");
                setSize("M");
            }
            setQuantity(1);
        }
    }, [product]);

    // Lock body scroll when modal is open to ensure clean mobile scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!product) return null;

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            size,
            quantity
        });

        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
            onClose();
        }, 1000);
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none p-4 md:p-6"
                    >
                        <div className="bg-background-card pointer-events-auto border border-white/10 w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-white/50 hover:text-white z-20 bg-black/40 hover:bg-black/60 rounded-full p-2 backdrop-blur-sm transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Image Section — FLIP target */}
                            <div className="w-full md:w-1/2 bg-background-elevated aspect-square md:aspect-auto relative overflow-hidden">
                                <motion.div
                                    layoutId={`product-image-${product.id}`}
                                    transition={{ layout: FLIP_TRANSITION }}
                                    className="w-full h-full"
                                >
                                    {product.image ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-muted">No Image</span>
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Details Section — stagger-fade in */}
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="show"
                                className="w-full md:w-1/2 p-8 md:p-12 flex flex-col"
                            >
                                <motion.span variants={staggerItem} className="text-sm font-bold tracking-widest text-primary uppercase mb-2">
                                    {product.category}
                                </motion.span>

                                {/* Title — FLIP target */}
                                <motion.div
                                    layoutId={`product-title-${product.id}`}
                                    transition={{ layout: FLIP_TRANSITION }}
                                >
                                    <h2 className="text-3xl font-display font-black text-white uppercase leading-none mb-4">
                                        {product.title}
                                    </h2>
                                </motion.div>

                                <motion.p variants={staggerItem} className="text-2xl font-bold text-price mb-6">
                                    {product.price}
                                </motion.p>

                                <motion.p variants={staggerItem} className="text-muted leading-relaxed mb-8">
                                    {product.description || "Premium performance fabric designed for elite athletes. Breathable, durable, and built to handle the intensity of the game."}
                                </motion.p>

                                {/* Size Selector */}
                                <motion.div variants={staggerItem} className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-3">
                                        Select Size
                                    </h3>
                                    <div className="flex gap-2 mb-3">
                                        {["Kids", "Adults"].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => { setSizeType(tab); setSize(tab === "Kids" ? "3-4Y" : "M"); }}
                                                className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${sizeType === tab ? "bg-primary text-black" : "bg-white/5 text-muted hover:text-white border border-white/10"}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(sizeType === "Kids"
                                            ? ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13Y"]
                                            : ["XS", "S", "M", "L", "XL", "2XL"]
                                        ).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSize(s)}
                                                className={`min-w-[48px] h-12 px-3 flex items-center justify-center border font-bold text-sm transition-all
                                                    ${size === s
                                                        ? "border-primary bg-primary text-black"
                                                        : "border-white/20 text-muted hover:border-white hover:text-white"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Actions */}
                                <motion.div variants={staggerItem} className="mt-auto space-y-3">
                                    {/* Quantity & Add */}
                                    <div className="flex gap-4">
                                        <div className="flex items-center border border-white/20 rounded-sm">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="p-3 text-white hover:text-primary transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-bold text-white">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="p-3 text-white hover:text-primary transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleAddToCart}
                                            className="flex-1 bg-primary text-black font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-[0_0_20px_rgba(102,187,106,0.3)] flex items-center justify-center gap-2"
                                        >
                                            {isAdded ? "Added!" : (
                                                <>
                                                    <ShoppingBag className="w-4 h-4" />
                                                    Add to Cart
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Buy Now */}
                                    <button
                                        onClick={() => {
                                            if (!product) return;
                                            addToCart({
                                                id: product.id,
                                                title: product.title,
                                                price: product.price,
                                                image: product.image,
                                                category: product.category,
                                                size,
                                                quantity
                                            });
                                            onClose();
                                            router.push("/checkout");
                                        }}
                                        className="w-full bg-[#81C784] text-black font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 py-4 rounded-sm"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Buy via WhatsApp
                                    </button>

                                    {/* View Full Details */}
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-primary transition-colors py-2"
                                    >
                                        View Full Details
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>

                                    {/* Trust Elements */}
                                    <div className="pt-4 mt-2 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px] text-muted font-medium uppercase tracking-wider">
                                        <div className="flex flex-col items-center gap-1">
                                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            Quality Guarantee
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            Secure Checkout
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            Fast Delivery
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
}
```

---

### `/high-voltage/src/components/products/PubJerseysSection.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const pubJerseys = [
    "/assets/pub-jerseys/1000037870.jpg",
    "/assets/pub-jerseys/1000037872.jpg",
    "/assets/pub-jerseys/1000037874.jpg",
    "/assets/pub-jerseys/1000038099.png",
];

export function PubJerseysSection() {
    return (
        <section className="relative py-16 md:py-24 overflow-hidden bg-background">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-primary font-bold uppercase tracking-[0.3em] text-xs md:text-sm"
                        >
                            Past Designs by AF GEAR
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-foreground mt-3 md:mt-4 leading-[0.9]"
                        >
                            PUB <br />
                            <span className="text-muted text-3xl sm:text-4xl md:text-6xl">JERSEYS</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 md:mt-8 space-y-6"
                        >
                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary-soft flex items-center justify-center mt-1 flex-shrink-0">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full" />
                                </div>
                                <div>
                                    <h4 className="text-foreground font-bold text-base md:text-lg lg:text-xl">Proven Excellence</h4>
                                    <p className="text-muted text-sm md:text-lg mt-1 md:mt-2">
                                        Check out some of our past designs. Pub Jerseys have become a huge trend, and we&apos;ve designed some of the most iconic ones in the country.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary-soft flex items-center justify-center mt-1 flex-shrink-0">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full" />
                                </div>
                                <div>
                                    <h3 className="text-foreground font-bold text-base md:text-lg lg:text-xl">Custom for Your Pub</h3>
                                    <p className="text-muted text-sm md:text-lg mt-1 md:mt-2">If you&apos;re a pub owner looking to create a unique identity for your patrons, get in touch today for a custom design!</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 md:gap-6 w-full"
                        >
                            <Link href="/contact" className="w-full sm:w-auto">
                                <button className="w-full px-8 py-4 bg-primary text-black font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-xl rounded-sm cursor-pointer border border-primary">
                                    Start Your Design
                                </button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Images Grid - Show all 4 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="order-1 lg:order-2 grid grid-cols-2 gap-3 sm:gap-4"
                    >
                        {pubJerseys.map((img, idx) => (
                            <div key={idx} className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
                                <Image
                                    src={img}
                                    alt={`Pub Jersey Past Design ${idx + 1}`}
                                    fill
                                    className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-[10px] font-bold uppercase tracking-widest">AF GEAR DESIGN</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Background Accent Glow */}
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-primary/5 blur-[120px] pointer-events-none" />
        </section>
    );
}
```

---

### `/high-voltage/src/components/products/QueryFormSection.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SPORTS } from "@/lib/query-form-config";
import { ArrowRight, Palette, Layers, Shirt, Shield, Trophy, Activity, Target, Flame, Zap } from "lucide-react";

export const getSportIcon = (id: string, className: string) => {
    switch (id) {
        case "field-sports": return <Shield className={className} />;
        case "lgfa-camogie": return <Activity className={className} />;
        case "soccer": return <Target className={className} />;
        case "rugby": return <Trophy className={className} />;
        case "basketball": return <Flame className={className} />;
        case "athletics": return <Zap className={className} />;
        default: return <Shirt className={className} />;
    }
};

export function QueryFormSection() {
    return (
        <section className="relative py-14 sm:py-20 px-4 md:px-8 overflow-hidden bg-background">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[300px] sm:h-[400px] bg-primary/6 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative max-w-[1200px] mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 sm:mb-12"
                >
                    <span className="inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-primary bg-primary/10 px-4 sm:px-5 py-2 rounded-full mb-3 sm:mb-4 border border-primary/20">
                        Custom Teamwear
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-white uppercase leading-tight mb-2 sm:mb-3">
                        Query <span className="text-primary">Form</span>
                    </h2>
                    <p className="text-muted text-xs sm:text-sm md:text-base max-w-lg mx-auto px-4">
                        Get a custom kit for your team. Choose your sport, tell us your requirements, and we&apos;ll handle the rest.
                    </p>
                </motion.div>

                {/* Sport Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4 mb-8 sm:mb-10 w-full max-w-sm sm:max-w-none mx-auto">
                    {SPORTS.map((sport, i) => (
                        <motion.div
                            key={sport.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.06 }}
                        >
                            <Link
                                href={`/query-form/${sport.id}`}
                                className="block relative group bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 md:p-5 text-center transition-all duration-300 overflow-hidden hover:border-primary/40 active:scale-[0.97]"
                            >
                                {/* Glowing Hover Background */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col items-center">
                                    <motion.div
                                        className="mb-2 sm:mb-3 text-white/70 group-hover:text-primary transition-colors duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:drop-shadow-[0_0_15px_rgba(102,187,106,0.4)]"
                                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {getSportIcon(sport.id, "w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11")}
                                    </motion.div>
                                    <p className="text-white font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-wide group-hover:text-primary transition-colors">{sport.name}</p>
                                    <p className="text-muted text-[9px] sm:text-[10px] mt-0.5 sm:mt-1">{sport.garments.length} items</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Features Bar */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-[10px] sm:text-xs text-white/40 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 sm:gap-2"><Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /> 18+ Colours</span>
                    <span className="flex items-center gap-1.5 sm:gap-2"><Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /> Custom Patterns</span>
                    <span className="flex items-center gap-1.5 sm:gap-2"><Shirt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" /> Kids & Adults</span>
                </div>

                {/* CTA */}
                <div className="text-center px-4 sm:px-0">
                    <Link
                        href="/query-form"
                        className="inline-flex items-center gap-2 bg-primary text-black font-black uppercase tracking-[0.15em] px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(102,187,106,0.5)] transition-all text-sm sm:text-base active:scale-[0.98] min-h-[48px]"
                    >
                        Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
```

---

### `/high-voltage/src/components/products/ReviewSection.tsx`
```tsx
"use client";

import { useState } from "react";
import { Star, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitReviewAction } from "@/app/actions/reviewActions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Review {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ReviewSectionProps {
    productId: string;
    initialReviews: Review[];
    isSignedIn: boolean;
}

export function ReviewSection({ productId, initialReviews, isSignedIn }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignedIn) {
            toast.error("Please sign in to leave a review");
            return;
        }

        setIsSubmitting(true);
        const result = await submitReviewAction({ productId, rating, comment });

        if (result.success) {
            toast.success("Review submitted! Thank you.");
            setComment("");
            setShowForm(false);
            // In a real app, revalidatePath handles this, but for instant UI:
            // (Mocking the new review locally)
            const newReview: Review = {
                id: Math.random().toString(),
                user_name: "You",
                rating,
                comment,
                created_at: new Date().toISOString(),
            };
            setReviews([newReview, ...reviews]);
        } else {
            toast.error(result.error || "Failed to submit review");
        }
        setIsSubmitting(false);
    };

    return (
        <section className="mt-24 border-t border-white/10 pt-16">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Stats Summary */}
                <div className="lg:w-1/3">
                    <h2 className="text-3xl font-display font-black text-white uppercase mb-6 flex items-center gap-3">
                        Customer <span className="text-primary">Reviews</span>
                    </h2>

                    <div className="bg-background-elevated border border-white/5 rounded-2xl p-8 text-center lg:text-left">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
                            <span className="text-6xl font-black text-white">{averageRating}</span>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className={`w-5 h-5 ${Number(averageRating) >= s ? 'fill-current' : 'text-white/20'}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-muted mt-1">Based on {reviews.length} reviews</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-primary transition-all duration-300"
                        >
                            {showForm ? "Cancel Review" : "Write a Review"}
                        </button>
                    </div>
                </div>

                {/* Review Feed & Form */}
                <div className="lg:w-2/3">
                    <AnimatePresence>
                        {showForm && (
                            <motion.form
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                onSubmit={handleSubmit}
                                className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12"
                            >
                                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Your Feedback</h3>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-3">Rating</label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                                className="transition-transform hover:scale-125"
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${(hover || rating) >= star ? 'fill-yellow-500 text-yellow-500' : 'text-white/20'}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-3">Comment</label>
                                    <textarea
                                        required
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your experience..."
                                        rows={4}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                    />
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="bg-primary text-black font-black uppercase tracking-widest px-8 py-4 rounded-sm flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Posting..." : <>Post Review <Send className="w-4 h-4" /></>}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="space-y-8">
                        {reviews.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                                <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                <p className="text-muted">No reviews yet. Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            reviews.map((rev) => (
                                <motion.div
                                    layout
                                    key={rev.id}
                                    className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                                                {rev.user_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white">{rev.user_name}</span>
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                                </div>
                                                <span className="text-[10px] text-muted uppercase font-bold tracking-widest">
                                                    {formatDistanceToNow(new Date(rev.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className={`w-3 h-3 ${rev.rating >= s ? 'fill-current' : 'text-white/10'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-white/80 leading-relaxed italic border-l-2 border-primary/20 pl-4">
                                        &quot;{rev.comment}&quot;
                                    </p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
```

---

### `/high-voltage/src/components/products/SchoolUniform/SchoolUniformSection.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function SchoolUniformSection() {
    return (
        <section className="relative py-24 overflow-hidden bg-background-card">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-primary font-bold uppercase tracking-[0.3em] text-sm"
                        >
                            For Schools & Parents
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-display font-black text-foreground mt-4 leading-[0.9]"
                        >
                            STRESS-FREE <br />
                            <span className="text-muted text-4xl md:text-6xl">SCHOOL UNIFORMS</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 space-y-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary-soft flex items-center justify-center mt-1">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                </div>
                                <div>
                                    <h4 className="text-foreground font-bold text-lg">Zero Admin Hassle</h4>
                                    <p className="text-muted">We take all the ordering work away from the school office. Direct to parent service.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary-soft flex items-center justify-center mt-1">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                </div>
                                <div>
                                    <h3 className="text-foreground font-bold text-lg">Free Sample Days</h3>
                                    <p className="text-muted">We visit your school for &quot;Try-on Days&quot; so students find the perfect fit before ordering.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-12 flex flex-wrap gap-6"
                        >
                            <Link href="/school-uniforms">
                                <button className="px-10 py-4 bg-primary text-black font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-xl rounded-sm cursor-pointer">
                                    Service My School
                                </button>
                            </Link>
                            <button className="px-10 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-primary/10 transition-all rounded-sm cursor-pointer">
                                Request Samples
                            </button>
                        </motion.div>
                    </div>

                    {/* Image Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="order-1 lg:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_4px_24px_var(--color-shadow)]"
                    >
                        <Image
                            src="/assets/school_uniform_hero.jpg"
                            alt="School Uniform Showcase"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                        <div className="absolute top-6 left-6 px-4 py-2 bg-background-card/80 backdrop-blur-md border border-border text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                            Premium Craftsmanship
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background Accent Glow */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] pointer-events-none" />
        </section>
    );
}
```

---

### `/high-voltage/src/components/ui/AnimatedButton.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import Link from "next/link";

interface AnimatedButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    animation?: "gloss" | "float" | "magnetic" | "pro-max";
}

export function AnimatedButton({
    children,
    href,
    onClick,
    variant = "primary",
    className = "",
    type = "button",
    disabled = false,
    animation = "gloss"
}: AnimatedButtonProps) {
    const baseClasses = "relative overflow-hidden inline-flex items-center justify-center font-black uppercase tracking-widest text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-black shadow-[0_0_20px_rgba(102,187,106,0.2)] hover:shadow-[0_0_40px_rgba(102,187,106,0.6)] px-8 py-4 border border-transparent hover:border-white/20",
        secondary: "bg-white text-black hover:bg-white/90 px-8 py-4 shadow-lg",
        outline: "border border-white/20 text-white hover:border-primary hover:text-primary px-8 py-4",
        ghost: "text-white/80 hover:text-white hover:bg-white/5 px-6 py-3 rounded-lg"
    };

    const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;

    // Animation Types
    const motionProps = (() => {
        switch (animation) {
            case "float":
                return { whileHover: { y: -4 }, whileTap: { y: 2 } };
            case "magnetic":
                return { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } };
            case "pro-max":
                return {
                    whileHover: { scale: 1.03 },
                    whileTap: { scale: 0.97 },
                    transition: { type: "spring" as const, stiffness: 400, damping: 10 }
                };
            case "gloss":
            default:
                return { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };
        }
    })();

    const content = (
        <>
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>

            {/* Gloss Effect Overlay */}
            {animation === "gloss" && !disabled && (
                <motion.div
                    initial={{ x: "-100%", opacity: 0 }}
                    whileHover={{ x: "100%", opacity: 0.5 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12"
                />
            )}

            {/* Pro Max Liquid Fill */}
            {animation === "pro-max" && !disabled && (
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-[150%] group-hover:h-[400%] opacity-20 z-0" />
            )}

            {/* Primary Glow Effect */}
            {variant === "primary" && !disabled && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 z-0" />
            )}
        </>
    );

    if (href) {
        return (
            <Link href={href} className="block group">
                <motion.div
                    className={combinedClasses}
                    {...motionProps}
                >
                    {content}
                </motion.div>
            </Link>
        );
    }

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${combinedClasses} group`}
            {...motionProps}
        >
            {content}
        </motion.button>
    );
}
```

---

### `/high-voltage/src/components/ui/AnnouncementBar.tsx`
```tsx
"use client";

import { motion } from "framer-motion";

export function AnnouncementBar() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-black border-b border-white/10 text-center py-2 relative z-50"
        >
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                Free Shipping on Orders Over €100 — <span className="text-primary">AF Gear</span> Premium Teamwear
            </p>
        </motion.div>
    );
}
```

---

### `/high-voltage/src/components/ui/AuthButtons.tsx`
```tsx
"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export function AuthButtons() {
    const isAuthEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const { user } = useUser();
    const isAdmin = (user?.publicMetadata as { role?: string })?.role === 'admin';
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/auth');

    if (isAuthPage) return null;

    if (!isAuthEnabled) {
        return (
            <button className="text-white hover:text-primary transition-colors p-2 hidden sm:block" title="Auth not configured">
                <User className="w-5 h-5" />
            </button>
        );
    }

    return (
        <div className="hidden sm:flex items-center gap-4">
            <SignedIn>
                <div className="flex items-center gap-3">
                    {isAdmin && (
                        <Link href="/admin" className="text-primary hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded border border-primary/20">
                            Admin Panel
                        </Link>
                    )}
                    <Link href="/profile" className="text-white hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
                        My Profile
                    </Link>
                    <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8 rounded-full border border-white/20" } }} />
                </div>
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="text-white flex items-center gap-2 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
                        <User className="w-4 h-4" /> Sign In
                    </button>
                </SignInButton>
            </SignedOut>
        </div>
    );
}
```

---

### `/high-voltage/src/components/ui/Dock.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import { Home, Search, ShoppingBag, User, Sun, Moon, LucideIcon } from "lucide-react";
import { useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

function DockItem({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            ref={ref}
            whileHover={{ scale: 1.2, y: -10 }}
            className="relative group cursor-pointer"
            onClick={onClick}
        >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-background-card/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-border shadow-lg group-hover:bg-background-elevated group-hover:border-primary group-hover:shadow-[0_0_20px_var(--color-primary-glow)] transition-all duration-300">
                <Icon className="text-muted group-hover:text-primary w-6 h-6 transition-colors" />
            </div>

            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-background text-primary text-[10px] px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-primary/30 pointer-events-none font-medium tracking-wide uppercase">
                {label}
            </span>
        </motion.div>
    );
}

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <motion.div
            whileHover={{ scale: 1.2, y: -10 }}
            className="relative group cursor-pointer"
            onClick={toggleTheme}
        >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-background-card/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-border shadow-lg group-hover:bg-background-elevated group-hover:border-primary group-hover:shadow-[0_0_20px_var(--color-primary-glow)] transition-all duration-300 overflow-hidden">
                <motion.div
                    initial={false}
                    animate={{ rotate: isDark ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                    {isDark ? (
                        <Moon className="text-primary w-6 h-6" />
                    ) : (
                        <Sun className="text-amber-500 group-hover:text-primary w-6 h-6 transition-colors" />
                    )}
                </motion.div>
            </div>

            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-background text-primary text-[10px] px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-primary/30 pointer-events-none font-medium tracking-wide uppercase">
                {isDark ? "Light Mode" : "Dark Mode"}
            </span>
        </motion.div>
    );
}

export function Dock() {
    return null;
}
```

---

### `/high-voltage/src/components/ui/FilterBar.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { Shirt, Home, MapPin, GraduationCap } from "lucide-react";

interface FilterBarProps {
    currentFilter: string;
    onFilterChange: (filter: string) => void;
}

const FILTERS = [
    { id: "All", label: "All Teams", icon: null },
    { id: "Club", label: "Home Kit", icon: Home },
    { id: "Limerick", label: "Away Kit", icon: MapPin },
    { id: "Tipperary", label: "Training", icon: GraduationCap },
];

export function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
    return (
        <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="sticky top-4 z-30 w-full flex justify-center py-4 pointer-events-none"
        >
            <div className="pointer-events-auto bg-background-card/90 backdrop-blur-2xl border border-border rounded-full px-2 py-2 flex gap-1 shadow-[0_4px_30px_var(--color-shadow)]">
                {FILTERS.map((filter) => {
                    const isActive = currentFilter === filter.id;
                    const Icon = filter.icon;

                    return (
                        <button
                            key={filter.id}
                            onClick={() => onFilterChange(filter.id)}
                            className={clsx(
                                "relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer",
                                isActive
                                    ? "text-black"
                                    : "text-muted hover:text-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeFilterPill"
                                    className="absolute inset-0 bg-primary rounded-full shadow-[0_0_20px_var(--color-primary-glow)]"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                />
                            )}

                            {Icon && (
                                <span className="relative z-10">
                                    <Icon size={16} />
                                </span>
                            )}

                            <span className="relative z-10">{filter.label}</span>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}
```

---

### `/high-voltage/src/components/ui/Footer.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="relative bg-background-elevated pt-32 pb-16 border-t border-white/5">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2">
                        <Image
                            src="/assets/af-logo.png"
                            alt="AF Gear"
                            width={224}
                            height={60}
                            className="h-auto mb-8 drop-shadow-[0_0_30px_var(--color-primary-glow)]"
                        />
                        <p className="text-muted text-lg leading-relaxed max-w-md">
                            Premium teamwear for clubs, schools, and squads. Made to last, made to be affordable.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-10">Collections</h3>
                        <ul className="space-y-6 text-muted text-base">
                            {[
                                { name: "Club Teamwear", slug: "club" },
                                { name: "Limerick Pride", slug: "limerick" },
                                { name: "Tipperary Elite", slug: "tipperary" },
                                { name: "Gaeilge Heritage", slug: "gaeilge" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={`/collections/${item.slug}`} className="hover:text-primary transition-colors flex items-center gap-3 group">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform shadow-[0_0_10px_var(--color-primary)]" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Service */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-10">Customer Care</h3>
                        <ul className="space-y-6 text-muted text-base">
                            {[
                                { name: "Our Size Guide", href: "/size-guide" },
                                { name: "Shipping Policy", href: "/shipping" },
                                { name: "Terms of Service", href: "/terms" },
                                { name: "Template Downloads", href: "/templates" },
                                { name: "Contact Support", href: "mailto:afgearsports@gmail.com" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-primary transition-colors flex items-center gap-3 group">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform shadow-[0_0_10px_var(--color-primary)]" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5">
                    <p className="text-muted/50 text-sm tracking-widest uppercase">
                        © 2026 AF Gear — Premium Teamwear
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-8 mt-8 md:mt-0 items-center">
                        <a
                            href="https://www.instagram.com/afgearsports/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#E1306C] group-hover:text-[#E1306C] group-hover:shadow-[0_0_20px_rgba(225,48,108,0.5)] group-hover:scale-110 transition-all bg-black/50 text-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                </svg>
                            </div>
                        </a>

                        <a
                            href="https://www.tiktok.com/@alanf07?_r=1&_t=ZN-93gyY6PkXJO"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] group-hover:scale-110 transition-all bg-black/50 text-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                </svg>
                            </div>
                        </a>

                        <a
                            href="https://www.facebook.com/share/1KjYruTSK1/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#1877F2] group-hover:text-[#1877F2] group-hover:shadow-[0_0_20px_rgba(24,119,242,0.5)] group-hover:scale-110 transition-all bg-black/50 text-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-primary/5 blur-[150px] pointer-events-none" />
        </footer>
    );
}
```

---

### `/high-voltage/src/components/ui/GlobalSearch.tsx`
```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { searchProducts } from "@/actions/search";
import type { Product } from "@/types";

export function GlobalSearch({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQuery("");
            setResults([]);
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        if (!query) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setResults([]);
            return;
        }

        setIsSearching(true);
        const delay = setTimeout(async () => {
            const data = await searchProducts(query);
            setResults(data);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(delay);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-background-elevated border border-white/10 rounded-xl shadow-2xl z-[101] overflow-hidden"
                    >
                        <div className="flex items-center p-4 border-b border-white/10 relative">
                            <Search className="w-5 h-5 text-muted absolute left-6" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search products, collections..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-white placeholder:text-muted pl-10 pr-10 py-2 text-lg"
                            />
                            <button
                                onClick={onClose}
                                className="absolute right-4 text-muted hover:text-white p-2"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto">
                            {isSearching ? (
                                <div className="flex items-center justify-center p-12 text-muted">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            ) : results.length > 0 ? (
                                <div className="p-2">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.id}`}
                                            onClick={onClose}
                                            className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <div className="w-16 h-16 bg-white/5 rounded-md overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={product.images?.[0] || '/placeholder.png'}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">
                                                    {product.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-primary font-medium tracking-wider">
                                                        {product.category}
                                                    </span>
                                                    <span className="text-muted text-xs">•</span>
                                                    <span className="text-white text-sm font-bold">
                                                        €{product.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    <div className="p-3 text-center border-t border-white/5 mt-2">
                                        <Link
                                            href="/#shop"
                                            onClick={onClose}
                                            className="text-xs font-bold text-primary uppercase tracking-widest hover:text-white transition-colors"
                                        >
                                            View All Results →
                                        </Link>
                                    </div>
                                </div>
                            ) : query ? (
                                <div className="p-12 text-center text-muted">
                                    No products found for &quot;{query}&quot;. Try checking your spelling or using more generic terms.
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted text-sm space-y-4">
                                    <p className="font-bold uppercase tracking-widest text-[10px]">Popular Searches</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {["Jersey", "Hoodie", "Club", "Limerick", "Training"].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setQuery(tag)}
                                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs font-medium transition-colors border border-white/5"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
```

---

### `/high-voltage/src/components/ui/Hero.tsx`
```tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatedButton } from "./AnimatedButton";
import Image from "next/image";

export function Hero({ heroContent }: { heroContent?: { title?: string; subtitle?: string } }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[55vh] sm:min-h-[60vh] md:min-h-screen w-full overflow-hidden flex items-center justify-center bg-background"
        >
            {/* Background Image Container */}
            <motion.div
                style={{ scale: bgScale }}
                className="absolute inset-0 z-0 bg-background"
            >
                <Image
                    src="/assets/af-gear-hero-bg.jpg"
                    alt="AF GEAR Premium Branding"
                    fill
                    sizes="100vw"
                    className="object-cover opacity-100 select-none pointer-events-none"
                    priority
                    quality={95}
                />
                {/* Subtle dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/40 z-[1]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[1]" />
            </motion.div>

            {/* Central Content */}
            <motion.div
                style={{ y: contentY }}
                className="relative z-10 text-center px-4 sm:px-6 flex flex-col items-center pt-20 sm:pt-24 md:pt-0"
            >
                <div className="text-center mb-3 sm:mb-4 pt-10 sm:pt-20 md:pt-32">
                    {heroContent?.title && <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">{heroContent.title}</h1>}
                    {heroContent?.subtitle && <p className="text-base sm:text-lg md:text-xl text-white/90 drop-shadow-md">{heroContent.subtitle}</p>}
                </div>

                <p className="mt-6 sm:mt-8 text-[10px] sm:text-xs md:text-sm tracking-[0.3em] sm:tracking-[0.5em] uppercase text-muted font-bold border-t border-white/20 pt-6 sm:pt-8">
                    Premium Teamwear. Made to Last.
                </p>

                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-12 md:mt-16 w-full sm:w-auto px-2 sm:px-0"
                >
                    <AnimatedButton href="/#shop" variant="primary" animation="gloss" className="w-full sm:w-auto justify-center min-h-[48px]">
                        Shop Collection <ArrowRight className="w-4 h-4 ml-2" />
                    </AnimatedButton>
                    <AnimatedButton href="/#lookbook" variant="outline" animation="magnetic" className="w-full sm:w-auto justify-center min-h-[48px]">
                        View Lookbook
                    </AnimatedButton>
                </motion.div>
            </motion.div>
        </section>
    );
}
```

---

### `/high-voltage/src/components/ui/LoadingScreen.tsx`
```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsVisible(false), 300);
                    return 100;
                }
                const increment = prev < 40 ? 8 : prev < 70 ? 10 : 15;
                return Math.min(prev + increment, 100);
            });
        }, 30);

        // Failsafe: Hide loading screen after 3 seconds no matter what
        const failsafe = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(failsafe);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505]"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="mb-6 flex flex-col items-center"
                    >
                        <Image
                            src="/assets/af-logo.png"
                            alt="AF Gear"
                            width={224}
                            height={224}
                            className="w-40 md:w-56 h-auto drop-shadow-[0_0_40px_rgba(102,187,106,0.4)]"
                            priority
                        />
                    </motion.div>

                    <div className="w-56 md:w-72 relative">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[#66BB6A] to-[#81C784] rounded-full shadow-[0_0_20px_rgba(102,187,106,0.5)]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.08, ease: "linear" }}
                            />
                        </div>
                        <motion.p
                            className="text-center text-white/30 text-[10px] font-bold tracking-[0.3em] uppercase mt-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            {progress < 100 ? "Loading..." : "Welcome"}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
```

---

### `/high-voltage/src/components/ui/Navbar.tsx`
```tsx
"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, Menu, ChevronDown, X, Moon, Sun } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "./ThemeProvider";
import { AuthButtons } from "./AuthButtons";
import { GlobalSearch } from "./GlobalSearch";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Shield } from "lucide-react";

const SHOP_COLLECTIONS = [
    { name: "Club Teamwear", href: "/collections/club" },
    { name: "Limerick Collection", href: "/collections/limerick" },
    { name: "Tipperary Collection", href: "/collections/tipperary" },
    { name: "Irish Language Range", href: "/collections/gaeilge" },
    { name: "School Uniforms", href: "/school-uniforms" },
];

export function Navbar() {
    const [hidden, setHidden] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileShopOpen, setMobileShopOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { scrollY } = useScroll();
    const { items, setIsOpen } = useCart();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const { user } = useUser();
    const isAdmin = (user?.publicMetadata as { role?: string })?.role === 'admin';

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const links = [
        { name: "HOME", href: "/" },
        { name: "ABOUT", href: "/about" },
        { name: "QUERY FORM", href: "/query-form" },
        { name: "TRACK ORDER", href: "/track-order" },
        { name: "CONTACT", href: "/contact" },
    ];

    return (
        <>
            <motion.header
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="sticky top-0 z-50 w-full"
            >
                <div className="bg-background/80 backdrop-blur-md border-b border-white/5">
                    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">

                        {/* LEFT: Mobile Menu & Logo (Mobile) */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="md:hidden text-white hover:text-primary transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <Link href="/" className="md:hidden">
                                <Image src="/assets/af-logo.png" alt="AF Gear" width={40} height={40} className="h-10 w-auto" />
                            </Link>
                        </div>

                        {/* LEFT: Logo (Desktop) */}
                        <Link href="/" className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2">
                            <Image src="/assets/af-logo.png" alt="AF Gear" width={80} height={80} className="h-16 lg:h-20 w-auto transition-transform hover:scale-105 duration-300" />
                        </Link>

                        {/* CENTER: Navigation Links (Desktop) */}
                        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-4 lg:gap-8">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-xs lg:text-sm font-bold tracking-widest text-white/70 hover:text-primary transition-colors uppercase relative group whitespace-nowrap"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}

                            {/* SHOP dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setShopOpen(true)}
                                onMouseLeave={() => setShopOpen(false)}
                            >
                                <button
                                    onClick={() => setShopOpen(!shopOpen)}
                                    className="text-xs lg:text-sm font-bold tracking-widest text-white/70 hover:text-primary transition-colors uppercase relative group flex items-center gap-1"
                                >
                                    SHOP
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${shopOpen ? "rotate-180" : ""}`} />
                                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                                </button>

                                <AnimatePresence>
                                    {shopOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-background-elevated/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
                                        >
                                            <div className="py-2">
                                                {SHOP_COLLECTIONS.map((collection) => (
                                                    <Link
                                                        key={collection.name}
                                                        href={collection.href}
                                                        onClick={() => setShopOpen(false)}
                                                        className="block px-5 py-3 text-sm text-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                                                    >
                                                        {collection.name}
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="border-t border-white/5 px-5 py-3">
                                                <Link
                                                    href="/#shop"
                                                    onClick={() => setShopOpen(false)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors"
                                                >
                                                    View All Products →
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </nav>

                        {/* RIGHT: Icons */}
                        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                            <button onClick={() => setSearchOpen(true)} className="text-white hover:text-primary transition-colors p-2 hidden sm:block">
                                <Search className="w-5 h-5" />
                            </button>

                            <AuthButtons />
                            <button
                                onClick={() => setIsOpen(true)}
                                className="text-white hover:text-primary transition-colors p-2 relative group"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {items.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-black group-hover:scale-110 transition-transform">
                                        {items.length}
                                    </span>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </motion.header>

            {/* ────── MOBILE MENU DRAWER ────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="fixed top-0 left-0 h-full w-[280px] sm:w-[320px] bg-background border-r border-white/10 z-50 flex flex-col overflow-y-auto"
                        >
                            {/* Close + Logo */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10">
                                <Image src="/assets/af-logo.png" alt="AF Gear" width={40} height={40} className="h-10 w-auto" />
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="text-white hover:text-primary transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex flex-col py-4">
                                {links.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="px-6 py-4 text-sm font-bold uppercase tracking-widest text-white/80 hover:text-primary hover:bg-white/5 transition-all border-b border-white/5"
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                {/* Shop Accordion */}
                                <button
                                    onClick={() => setMobileShopOpen(!mobileShopOpen)}
                                    className="px-6 py-4 text-sm font-bold uppercase tracking-widest text-white/80 hover:text-primary hover:bg-white/5 transition-all border-b border-white/5 flex items-center justify-between"
                                >
                                    SHOP
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileShopOpen ? "rotate-180" : ""}`} />
                                </button>

                                <AnimatePresence>
                                    {mobileShopOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden bg-white/5"
                                        >
                                            {SHOP_COLLECTIONS.map((collection) => (
                                                <Link
                                                    key={collection.name}
                                                    href={collection.href}
                                                    onClick={() => setMobileOpen(false)}
                                                    className="block px-8 py-3 text-xs font-medium text-muted hover:text-white hover:bg-white/5 transition-all"
                                                >
                                                    {collection.name}
                                                </Link>
                                            ))}
                                            <Link
                                                href="/#shop"
                                                onClick={() => setMobileOpen(false)}
                                                className="block px-8 py-3 text-xs font-bold text-primary hover:text-white transition-all"
                                            >
                                                View All Products →
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </nav>

                            {/* Bottom Actions */}
                            <div className="mt-auto p-6 border-t border-white/10 space-y-3">
                                <button onClick={() => { setMobileOpen(false); setSearchOpen(true); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                    <Search className="w-4 h-4" /> Search
                                </button>
                                <SignedIn>
                                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                        <User className="w-4 h-4" /> My Profile
                                    </Link>
                                    {isAdmin && (
                                        <Link href="/admin" onClick={() => setMobileOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-primary hover:text-white hover:bg-primary/20 bg-primary/10 rounded-lg transition-all border border-primary/20">
                                            <Shield className="w-4 h-4" /> Admin Panel
                                        </Link>
                                    )}
                                </SignedIn>
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                            <User className="w-4 h-4" /> Sign In
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                >
                                    {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                    {isDark ? "Dark Mode" : "Light Mode"}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
```

---

### `/high-voltage/src/components/ui/NewsletterSection.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

export function NewsletterSection() {
    return (
        <section className="relative py-24 overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 bg-background-elevated z-0" />

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background-elevated to-background z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
                        Stay in the Loop
                    </span>

                    <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tighter mb-6 leading-none">
                        Join the <span className="text-primary text-glow">Squad</span>
                    </h2>

                    <p className="text-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        Sign up for exclusive drops, early access to sales, and insider teamwear news.
                    </p>

                    <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto relative group">
                        <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-white transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full bg-black/50 border border-white/10 rounded-sm py-4 pl-12 pr-4 text-white placeholder:text-muted focus:outline-none focus:border-primary focus:bg-black/80 transition-all font-medium"
                            />
                        </div>
                        <button className="bg-primary text-black font-black uppercase tracking-widest text-xs px-8 py-4 hover:scale-105 hover:shadow-[0_0_20px_var(--color-primary-glow)] transition-all rounded-sm flex items-center justify-center gap-2">
                            Subscribe <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <p className="mt-6 text-[10px] text-muted/50 uppercase tracking-widest">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
```

---

### `/high-voltage/src/components/ui/SmoothScroll.tsx`
```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
    useEffect(() => {
        // Disable Lenis on touch devices so mobile/tablet users experience native, light, fluid scroll mechanics
        if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
            return;
        }

        const lenis = new Lenis({
            duration: 0.8, // Snappy duration for a light feel
            easing: (t) => 1 - Math.pow(1 - t, 4), // Quart ease-out for faster scroll responsiveness
            smoothWheel: true,
        });

        let frameId: number;
        function raf(time: number) {
            lenis.raf(time);
            frameId = requestAnimationFrame(raf);
        }
        frameId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(frameId);
            lenis.destroy();
        };
    }, []);

    return null;
}
```

---

### `/high-voltage/src/components/ui/ThemeProvider.tsx`
```tsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("af-theme") as Theme | null;
        const initial = stored || "light";
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme(initial);
        document.documentElement.classList.toggle("dark", initial === "dark");
        setMounted(true);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            const next = prev === "light" ? "dark" : "light";
            localStorage.setItem("af-theme", next);
            document.documentElement.classList.toggle("dark", next === "dark");
            return next;
        });
    }, []);

    // Prevent flash of wrong theme
    if (!mounted) {
        return <div style={{ visibility: "hidden" }}>{children}</div>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
```

---

### `/high-voltage/src/contexts/CartContext.tsx`
```tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
    id: string | number;
    title: string;
    price: string | number;
    image?: string;
    category?: string;
    size: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string | number, size: string) => void;
    updateQuantity: (id: string | number, size: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load from local storage if needed
    useEffect(() => {
        const savedCart = localStorage.getItem("af-gear-cart");
        if (savedCart) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setItems(JSON.parse(savedCart) as CartItem[]);
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("af-gear-cart", JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = (newItem: CartItem) => {
        setItems((prev) => {
            const existingItem = prev.find(
                (item) => item.id === newItem.id && item.size === newItem.size
            );
            if (existingItem) {
                return prev.map((item) =>
                    item.id === newItem.id && item.size === newItem.size
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...prev, newItem];
        });
        setIsOpen(true); // Open cart when adding
    };

    const removeFromCart = (id: string | number, size: string) => {
        setItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
    };

    const updateQuantity = (id: string | number, size: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id, size);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.id === id && item.size === size ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => {
        let price = 0;
        if (typeof item.price === "string") {
            price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
        } else if (typeof item.price === "number") {
            price = item.price;
        }
        return sum + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total,
                isOpen,
                setIsOpen,
                isLoaded,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
```

---

### `/high-voltage/src/lib/query-form-config.ts`
```tsx
// Sport-specific Query Form configuration
// Each sport has its own garments, colours, patterns, collar options, and features.

export interface GarmentOption {
    id: string;
    name: string;
    basePrice: number;
    description: string;
}

export interface ColorOption {
    name: string;
    hex: string;
}

export interface PatternOption {
    id: string;
    name: string;
    description: string;
}

export interface ZoneOption {
    id: string;
    name: string;
}

export interface SportConfig {
    id: string;
    name: string;
    subtitle: string;
    emoji: string;
    bgGradient: string;
    image?: string;
    baseImage?: string; // Optional realistic base image
    zones: ZoneOption[];
    garments: GarmentOption[];
    patterns: PatternOption[];
    collars: string[];
    features: { id: string; name: string; description: string; price: number }[];
    sizesKids: string[];
    sizesAdults: string[];
    fabrics: { id: string; name: string; description: string; priceAddon: number }[];
}

export const SPORT_COLORS: ColorOption[] = [
    { name: "Black", hex: "#1a1a1a" },
    { name: "White", hex: "#f5f5f5" },
    { name: "Navy", hex: "#1e3a5f" },
    { name: "Royal Blue", hex: "#2563eb" },
    { name: "Sky Blue", hex: "#38bdf8" },
    { name: "Red", hex: "#dc2626" },
    { name: "Maroon", hex: "#7f1d1d" },
    { name: "Green", hex: "#16a34a" },
    { name: "Emerald", hex: "#059669" },
    { name: "Gold", hex: "#ca8a04" },
    { name: "Amber", hex: "#d97706" },
    { name: "Orange", hex: "#ea580c" },
    { name: "Grey", hex: "#6b7280" },
    { name: "Charcoal", hex: "#374151" },
    { name: "Pink", hex: "#ec4899" },
    { name: "Teal", hex: "#14b8a6" },
    { name: "Lime", hex: "#84cc16" },
    { name: "Burgundy", hex: "#881337" },
];

export const SPORTS: SportConfig[] = [
    {
        id: "field-sports",
        name: "Field Sports",
        subtitle: "Premium kits for clubs and teams",
        emoji: "🏑",
        bgGradient: "from-green-600/20 to-emerald-900/20",
        image: "/assets/sports/field-sports.png",
        baseImage: "/assets/tshirt-base-v2.png", // Realistic base
        zones: [
            { id: "frontPiece", name: "Front Piece" },
            { id: "backPiece", name: "Back Piece" },
            { id: "sleeves", name: "Sleeve" },
            { id: "collar", name: "Collar" },
            { id: "neckBinding", name: "Neck Binding" },
            { id: "knittedTube", name: "Knitted Cotton Tube" },
        ],
        garments: [
            { id: "jersey", name: "Match Jersey", basePrice: 54.99, description: "Premium sublimated match-day jersey" },
            { id: "shorts", name: "Match Shorts", basePrice: 29.99, description: "Lightweight performance shorts" },
            { id: "socks", name: "Match Socks", basePrice: 12.99, description: "Cushioned knee-high socks" },
            { id: "half-zip", name: "Half-Zip Top", basePrice: 49.99, description: "Training half-zip with brushed inner" },
            { id: "hoodie", name: "Pullover Hoodie", basePrice: 59.99, description: "Heavyweight fleece hoodie" },
            { id: "skinny-pants", name: "Skinny Pants", basePrice: 39.99, description: "Tapered fit training pants" },
            { id: "training-vest", name: "Training Vest", basePrice: 24.99, description: "Breathable mesh training bib" },
            { id: "polo", name: "Polo Shirt", basePrice: 39.99, description: "Smart casual team polo" },
            { id: "rain-jacket", name: "Rain Jacket", basePrice: 69.99, description: "Waterproof quarter-zip rain jacket" },
            { id: "beanie", name: "Beanie Hat", basePrice: 14.99, description: "Embroidered acrylic beanie" },
            { id: "kitbag", name: "Kit Bag", basePrice: 34.99, description: "Large holdall kit bag" },
        ],
        patterns: [
            { id: "solid", name: "Solid", description: "Clean single colour" },
            { id: "hoops", name: "Hoops", description: "Traditional horizontal hoops" },
            { id: "stripes", name: "Vertical Stripes", description: "Classic vertical stripes" },
            { id: "half-half", name: "Half & Half", description: "Split down the middle" },
            { id: "gradient", name: "Gradient Fade", description: "Smooth colour transition" },
            { id: "pinstripe", name: "Pinstripes", description: "Subtle thin stripes" },
            { id: "chevron", name: "Chevron", description: "V-shaped pattern" },
            { id: "diamond", name: "Diamond Check", description: "Diamond pattern overlay" },
        ],
        collars: ["Crew Neck", "V-Neck", "Grandad Collar", "Half-Zip Collar"],
        features: [
            { id: "club-crest", name: "Club Crest", description: "Embroidered or printed club crest", price: 5 },
            { id: "county-crest", name: "County Crest", description: "Official county crest placement", price: 6 },
            { id: "player-name", name: "Player Name", description: "Heat-pressed name on back", price: 4 },
            { id: "player-number", name: "Player Number", description: "Front and back number", price: 2 },
            { id: "sponsor-front", name: "Front Sponsor", description: "Logo on chest area", price: 3 },
            { id: "sponsor-back", name: "Back Sponsor", description: "Logo on upper back", price: 3 },
            { id: "sponsor-sleeve", name: "Sleeve Sponsor", description: "Logo on sleeve", price: 2 },
            { id: "memorial-text", name: "Memorial Text", description: "In memory text on collar/hem", price: 3 },
            { id: "irish-text", name: "Irish Language Text", description: "Team name in Irish (as Gaeilge)", price: 0 },
            { id: "official-logo", name: "Match Logo", description: "Official tournament logo placement", price: 0 },
        ],
        sizesKids: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13Y"],
        sizesAdults: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
        fabrics: [
            { id: "standard", name: "Standard Poly", description: "150gsm polyester — great value", priceAddon: 0 },
            { id: "pro", name: "Pro Mesh", description: "180gsm micro-mesh — breathable", priceAddon: 5 },
            { id: "elite", name: "Elite Lycra", description: "200gsm 4-way stretch — premium fit", priceAddon: 10 },
        ],
    },
    {
        id: "lgfa-camogie",
        name: "LGFA / Camogie",
        subtitle: "Ladies football and camogie teamwear",
        emoji: "🏐",
        bgGradient: "from-pink-600/20 to-rose-900/20",
        image: "/assets/sports/lgfa-camogie.png",
        zones: [
            { id: "frontPiece", name: "Front Piece" },
            { id: "backPiece", name: "Back Piece" },
            { id: "sleeves", name: "Sleeve" },
            { id: "collar", name: "Collar" },
            { id: "neckBinding", name: "Neck Binding" },
            { id: "knittedTube", name: "Knitted Cotton Tube" },
        ],
        garments: [
            { id: "jersey", name: "Match Jersey", basePrice: 54.99, description: "Women's fit sublimated jersey" },
            { id: "skort", name: "Skort", basePrice: 32.99, description: "Built-in shorts skort" },
            { id: "shorts", name: "Match Shorts", basePrice: 29.99, description: "Women's fit match shorts" },
            { id: "socks", name: "Match Socks", basePrice: 12.99, description: "Cushioned knee-high socks" },
            { id: "half-zip", name: "Half-Zip Top", basePrice: 49.99, description: "Fitted half-zip training top" },
            { id: "hoodie", name: "Pullover Hoodie", basePrice: 59.99, description: "Women's fit fleece hoodie" },
            { id: "leggings", name: "Training Leggings", basePrice: 34.99, description: "High-waist compression leggings" },
            { id: "polo", name: "Polo Shirt", basePrice: 39.99, description: "Women's fit team polo" },
            { id: "rain-jacket", name: "Rain Jacket", basePrice: 69.99, description: "Waterproof quarter-zip" },
            { id: "kitbag", name: "Kit Bag", basePrice: 34.99, description: "Large holdall kit bag" },
        ],
        patterns: [
            { id: "solid", name: "Solid", description: "Clean single colour" },
            { id: "hoops", name: "Hoops", description: "Traditional horizontal hoops" },
            { id: "stripes", name: "Vertical Stripes", description: "Classic vertical stripes" },
            { id: "half-half", name: "Half & Half", description: "Split down the middle" },
            { id: "gradient", name: "Gradient Fade", description: "Smooth colour transition" },
            { id: "chevron", name: "Chevron", description: "V-shaped pattern" },
        ],
        collars: ["Crew Neck", "V-Neck", "Grandad Collar"],
        features: [
            { id: "club-crest", name: "Club Crest", description: "Embroidered or printed club crest", price: 5 },
            { id: "player-name", name: "Player Name", description: "Heat-pressed name on back", price: 4 },
            { id: "player-number", name: "Player Number", description: "Front and back number", price: 2 },
            { id: "sponsor-front", name: "Front Sponsor", description: "Logo on chest area", price: 3 },
            { id: "sponsor-back", name: "Back Sponsor", description: "Logo on upper back", price: 3 },
            { id: "irish-text", name: "Irish Language Text", description: "Team name in Irish", price: 0 },
            { id: "lgfa-logo", name: "LGFA/Camogie Logo", description: "Official logo placement", price: 0 },
        ],
        sizesKids: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13Y"],
        sizesAdults: ["XS", "S", "M", "L", "XL", "2XL"],
        fabrics: [
            { id: "standard", name: "Standard Poly", description: "150gsm polyester", priceAddon: 0 },
            { id: "pro", name: "Pro Mesh", description: "180gsm micro-mesh", priceAddon: 5 },
            { id: "elite", name: "Elite Lycra", description: "200gsm 4-way stretch", priceAddon: 10 },
        ],
    },
    {
        id: "soccer",
        name: "Soccer",
        subtitle: "Football kits for clubs, leagues, and schools",
        emoji: "⚽",
        bgGradient: "from-blue-600/20 to-indigo-900/20",
        image: "/assets/sports/soccer.png",
        zones: [
            { id: "frontPiece", name: "Front Piece" },
            { id: "backPiece", name: "Back Piece" },
            { id: "sleeves", name: "Sleeve" },
            { id: "collar", name: "Collar" },
            { id: "neckBinding", name: "Neck Binding" },
            { id: "knittedTube", name: "Knitted Cotton Tube" },
        ],
        garments: [
            { id: "jersey", name: "Match Jersey", basePrice: 49.99, description: "Sublimated soccer jersey" },
            { id: "gk-jersey", name: "Goalkeeper Jersey", basePrice: 54.99, description: "Padded elbow goalkeeper jersey" },
            { id: "shorts", name: "Match Shorts", basePrice: 27.99, description: "Lightweight match shorts" },
            { id: "socks", name: "Match Socks", basePrice: 11.99, description: "Knee-high football socks" },
            { id: "training-top", name: "Training Top", basePrice: 44.99, description: "Long-sleeve training top" },
            { id: "rain-jacket", name: "Rain Jacket", basePrice: 64.99, description: "Waterproof training jacket" },
            { id: "hoodie", name: "Zip Hoodie", basePrice: 59.99, description: "Full-zip team hoodie" },
            { id: "tracksuit-top", name: "Tracksuit Top", basePrice: 54.99, description: "Woven track jacket" },
            { id: "tracksuit-pants", name: "Tracksuit Pants", basePrice: 44.99, description: "Tapered track pants" },
            { id: "polo", name: "Polo Shirt", basePrice: 39.99, description: "Matchday travel polo" },
            { id: "kitbag", name: "Kit Bag", basePrice: 34.99, description: "Large holdall kit bag" },
        ],
        patterns: [
            { id: "solid", name: "Solid", description: "Clean single colour" },
            { id: "stripes", name: "Vertical Stripes", description: "Classic vertical stripes" },
            { id: "half-half", name: "Half & Half", description: "Split down the middle" },
            { id: "gradient", name: "Gradient Fade", description: "Smooth colour transition" },
            { id: "sash", name: "Diagonal Sash", description: "Diagonal band across chest" },
            { id: "pinstripe", name: "Pinstripes", description: "Subtle thin stripes" },
            { id: "block", name: "Colour Block", description: "Large block sections" },
            { id: "chevron", name: "Chevron", description: "V-shaped pattern" },
        ],
        collars: ["Crew Neck", "V-Neck", "Polo Collar", "Henley Collar", "Mandarin Collar"],
        features: [
            { id: "club-crest", name: "Club Crest", description: "Embroidered or printed club crest", price: 5 },
            { id: "player-name", name: "Player Name", description: "Heat-pressed name on back", price: 4 },
            { id: "player-number", name: "Player Number", description: "Front and back number", price: 2 },
            { id: "captain-armband", name: "Captain Armband", description: "Matching captain armband", price: 8 },
            { id: "sponsor-front", name: "Front Sponsor", description: "Logo on chest area", price: 3 },
            { id: "sponsor-back", name: "Back Sponsor", description: "Logo on upper back", price: 3 },
            { id: "sponsor-sleeve", name: "Sleeve Sponsor", description: "Logo on sleeve", price: 2 },
            { id: "flag-badge", name: "League/Flag Badge", description: "Sleeve league badge", price: 4 },
        ],
        sizesKids: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y"],
        sizesAdults: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
        fabrics: [
            { id: "standard", name: "Standard Poly", description: "150gsm polyester", priceAddon: 0 },
            { id: "pro", name: "Aero Mesh", description: "180gsm perforated mesh", priceAddon: 5 },
            { id: "elite", name: "Dri-Fit Pro", description: "200gsm moisture-wicking premium", priceAddon: 10 },
        ],
    },
    {
        id: "rugby",
        name: "Rugby",
        subtitle: "Reinforced kits built for contact sport",
        emoji: "🏉",
        bgGradient: "from-red-600/20 to-red-900/20",
        image: "/assets/sports/rugby.png",
        zones: [
            { id: "frontPiece", name: "Front Piece" },
            { id: "backPiece", name: "Back Piece" },
            { id: "sleeves", name: "Sleeve" },
            { id: "collar", name: "Collar" },
            { id: "neckBinding", name: "Neck Binding" },
            { id: "knittedTube", name: "Knitted Cotton Tube" },
        ],
        garments: [
            { id: "jersey", name: "Match Jersey", basePrice: 59.99, description: "Reinforced sublimated rugby jersey" },
            { id: "shorts", name: "Match Shorts", basePrice: 29.99, description: "Reinforced seam rugby shorts" },
            { id: "socks", name: "Match Socks", basePrice: 12.99, description: "Cushioned rugby socks" },
            { id: "contact-suit", name: "Contact Suit", basePrice: 44.99, description: "Skin-tight base layer for contact" },
            { id: "training-top", name: "Training Top", basePrice: 49.99, description: "Quarter-zip training top" },
            { id: "hoodie", name: "Pullover Hoodie", basePrice: 59.99, description: "Heavyweight fleece hoodie" },
            { id: "rain-jacket", name: "Rain Jacket", basePrice: 69.99, description: "Waterproof shell jacket" },
            { id: "tracksuit-top", name: "Tracksuit Top", basePrice: 54.99, description: "Full-zip track jacket" },
            { id: "tracksuit-pants", name: "Tracksuit Pants", basePrice: 44.99, description: "Side-zip track pants" },
            { id: "kitbag", name: "Kit Bag", basePrice: 34.99, description: "XL reinforced kit bag" },
        ],
        patterns: [
            { id: "solid", name: "Solid", description: "Clean single colour" },
            { id: "hoops", name: "Hoops", description: "Traditional rugby hoops" },
            { id: "stripes", name: "Vertical Stripes", description: "Classic vertical stripes" },
            { id: "half-half", name: "Half & Half", description: "Split down the middle" },
            { id: "chevron", name: "Chevron", description: "V-shaped pattern" },
            { id: "gradient", name: "Gradient Fade", description: "Colour fade effect" },
        ],
        collars: ["Collar (Traditional)", "Crew Neck", "Grandad Collar"],
        features: [
            { id: "club-crest", name: "Club Crest", description: "Woven or embroidered crest", price: 5 },
            { id: "player-name", name: "Player Name", description: "Heat-pressed name on back", price: 4 },
            { id: "player-number", name: "Player Number", description: "Front and back number", price: 2 },
            { id: "sponsor-front", name: "Front Sponsor", description: "Logo on chest", price: 3 },
            { id: "sponsor-back", name: "Back Sponsor", description: "Logo on back", price: 3 },
            { id: "reinforced-seams", name: "Reinforced Seams", description: "Triple-stitched stress points", price: 5 },
            { id: "grip-strips", name: "Grip Strips", description: "Rubber grip on hem interior", price: 4 },
        ],
        sizesKids: ["5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y"],
        sizesAdults: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
        fabrics: [
            { id: "standard", name: "Standard Poly", description: "150gsm polyester", priceAddon: 0 },
            { id: "pro", name: "Rugby Pro", description: "220gsm reinforced mesh", priceAddon: 8 },
            { id: "elite", name: "Combat Elite", description: "280gsm anti-tear fabric", priceAddon: 15 },
        ],
    },
    {
        id: "basketball",
        name: "Basketball",
        subtitle: "Performance vests and shorts for the court",
        emoji: "🏀",
        bgGradient: "from-orange-600/20 to-amber-900/20",
        image: "/assets/sports/basketball.png",
        zones: [
            { id: "vest", name: "Vest Body" },
            { id: "trim", name: "Neck/Arm Trim" },
            { id: "sidePanels", name: "Side Panels" },
            { id: "shorts", name: "Shorts" },
        ],
        garments: [
            { id: "vest", name: "Match Vest / Singlet", basePrice: 44.99, description: "Sublimated basketball vest" },
            { id: "shorts", name: "Match Shorts", basePrice: 34.99, description: "Knee-length basketball shorts" },
            { id: "reversible-vest", name: "Reversible Vest", basePrice: 54.99, description: "Two-tone reversible training vest" },
            { id: "warm-up-top", name: "Warm-Up Shooting Top", basePrice: 49.99, description: "Long-sleeve warm-up top" },
            { id: "hoodie", name: "Team Hoodie", basePrice: 59.99, description: "Oversized team hoodie" },
            { id: "tracksuit-pants", name: "Breakaway Pants", basePrice: 49.99, description: "Side-button breakaway pants" },
            { id: "kitbag", name: "Kit Bag", basePrice: 34.99, description: "Backpack-style kit bag" },
        ],
        patterns: [
            { id: "solid", name: "Solid", description: "Clean single colour" },
            { id: "stripes", name: "Side Stripes", description: "Racing stripes down sides" },
            { id: "gradient", name: "Gradient Fade", description: "Top-to-bottom fade" },
            { id: "block", name: "Colour Block", description: "Large panel sections" },
            { id: "camo", name: "Camo", description: "Digital camouflage pattern" },
        ],
        collars: ["Scoop Neck", "V-Neck", "Crew Neck"],
        features: [
            { id: "club-crest", name: "Team Logo", description: "Printed or embroidered logo", price: 5 },
            { id: "player-name", name: "Player Name", description: "Heat-pressed name on back", price: 4 },
            { id: "player-number", name: "Player Number", description: "Large front + back number", price: 2 },
            { id: "sponsor-front", name: "Front Sponsor", description: "Logo on chest", price: 3 },
            { id: "sponsor-back", name: "Back Sponsor", description: "Logo on back waistband", price: 3 },
        ],
        sizesKids: ["5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y"],
        sizesAdults: ["S", "M", "L", "XL", "2XL", "3XL"],
        fabrics: [
            { id: "standard", name: "Standard Mesh", description: "150gsm basketball mesh", priceAddon: 0 },
            { id: "pro", name: "Pro Breathe", description: "180gsm micro-perforated", priceAddon: 5 },
            { id: "elite", name: "NBA-Grade", description: "210gsm moisture-control", priceAddon: 12 },
        ],
    },
    {
        id: "athletics",
        name: "Athletics",
        subtitle: "Track & field singlets, shorts, and warm-ups",
        emoji: "🏃",
        bgGradient: "from-yellow-600/20 to-yellow-900/20",
        image: "/assets/sports/athletics.png",
        zones: [
            { id: "torso", name: "Main Torso" },
            { id: "shorts", name: "Shorts/Tights" },
            { id: "accents", name: "Accents" },
        ],
        garments: [
            { id: "singlet", name: "Racing Singlet", basePrice: 39.99, description: "Lightweight sublimated singlet" },
            { id: "crop-top", name: "Crop Top", basePrice: 34.99, description: "Women's athletics crop" },
            { id: "shorts", name: "Running Shorts", basePrice: 27.99, description: "Split-side race shorts" },
            { id: "tights", name: "Running Tights", basePrice: 39.99, description: "Full-length compression tights" },
            { id: "tracksuit-top", name: "Tracksuit Top", basePrice: 54.99, description: "Full-zip warm-up jacket" },
            { id: "tracksuit-pants", name: "Tracksuit Pants", basePrice: 44.99, description: "Tapered warm-up pants" },
            { id: "rain-jacket", name: "Rain Jacket", basePrice: 64.99, description: "Packable waterproof shell" },
            { id: "kitbag", name: "Kit Bag", basePrice: 29.99, description: "Drawstring kit bag" },
        ],
        patterns: [
            { id: "solid", name: "Solid", description: "Clean single colour" },
            { id: "gradient", name: "Gradient Fade", description: "Smooth colour fade" },
            { id: "stripes", name: "Side Stripes", description: "Racing stripes" },
            { id: "block", name: "Colour Block", description: "Panel sections" },
            { id: "lightning", name: "Lightning Bolt", description: "Dynamic bolt graphic" },
        ],
        collars: ["Scoop Neck", "Crew Neck", "Racerback"],
        features: [
            { id: "club-crest", name: "Club Crest", description: "Printed club logo", price: 5 },
            { id: "player-name", name: "Athlete Name", description: "Name on back or hip", price: 4 },
            { id: "player-number", name: "Race Number Panel", description: "Pin-on number panel area", price: 0 },
            { id: "sponsor-front", name: "Front Sponsor", description: "Logo on chest", price: 3 },
            { id: "ai-branding", name: "Athletics Ireland Logo", description: "Official AI logo", price: 0 },
        ],
        sizesKids: ["5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y"],
        sizesAdults: ["XS", "S", "M", "L", "XL", "2XL"],
        fabrics: [
            { id: "standard", name: "Standard Poly", description: "120gsm ultralight", priceAddon: 0 },
            { id: "pro", name: "AeroLite", description: "100gsm perforated race-day", priceAddon: 6 },
            { id: "elite", name: "SpeedSkin", description: "90gsm wind-tunnel tested", priceAddon: 14 },
        ],
    },
];

export function getSportById(id: string): SportConfig | undefined {
    return SPORTS.find(s => s.id === id);
}
```

---

### `/high-voltage/src/middleware.ts`
```tsx
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// We want most of the site to be public. Only protect explicit routes.
const isProtectedRoute = createRouteMatcher([
    '/profile(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
```

---

### `/high-voltage/src/services/categoryService.ts`
```tsx
export interface Category {
    id: string;
    name: string;          // Display name, e.g. "Pub Jerseys"
    slug: string;          // URL slug, e.g. "pub-jerseys"
    tagline?: string;      // CMS tagline, e.g. "SOCIAL GEAR"
    subtitle?: string;     // Subtitle shown on collection page
    crest?: string;        // Path to crest image
    accent?: string;       // Accent colour (hex or tailwind var)
    image?: string;        // Card image
    order?: number;        // Display order
}

/** Default hardcoded categories — used as fallback if DB has no data */
export const DEFAULT_CATEGORIES: Category[] = [
    { id: "club",        name: "Club",         slug: "club",         tagline: "CLUB GEAR",       subtitle: "Before Everything",              image: "/assets/club-1.png",                 order: 1 },
    { id: "irish",       name: "Irish",        slug: "gaeilge",      tagline: "GAEILGE",         subtitle: "Heritage Collection",            image: "/assets/irish-1.png",                accent: "#FFFFFF", order: 2 },
    { id: "pub-jerseys", name: "Pub Jerseys",  slug: "pub-jerseys",  tagline: "SOCIAL GEAR",     subtitle: "Social Collection",              image: "/assets/pub-jerseys/1000038099.png", order: 3 },
    { id: "limerick",    name: "Limerick",     slug: "limerick",     tagline: "TREATY CITY",     subtitle: "Treaty City",                    image: "/assets/limerick-1.png",             crest: "/assets/limerick_crest_final.png",  order: 4 },
    { id: "tipperary",   name: "Tipperary",    slug: "tipperary",    tagline: "PREMIER COUNTY",  subtitle: "Premier County",                 image: "/assets/tipperary-1.png",            crest: "/assets/tipperary_crest_final.png", order: 5 },
];

/**
 * Fetch categories from site_content (key = "store_categories").
 * Falls back to DEFAULT_CATEGORIES when the table is empty or unavailable.
 * This function is safe to call from both server components and API routes.
 */
export async function fetchCategories(
    supabase: { from: (t: string) => any } | null
): Promise<Category[]> {
    if (!supabase) return DEFAULT_CATEGORIES;
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('key', 'store_categories')
            .single();

        if (error || !data?.content) return DEFAULT_CATEGORIES;

        const parsed: Category[] = Array.isArray(data.content) ? data.content : [];
        return parsed.length > 0
            ? parsed.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
            : DEFAULT_CATEGORIES;
    } catch {
        return DEFAULT_CATEGORIES;
    }
}
```

---

### `/high-voltage/src/services/productService.ts`
```tsx
import { createClient } from '@/utils/supabase/server';
import { createStaticClient } from '@/utils/supabase/static';
import type { Product } from '@/types';
import { getEffectiveCategory, normalizeProductToken } from '@/utils/productUtils';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Pro Performance Club Jersey",
        description: "Elite level performance jersey with moisture-wicking technology.",
        price: 45.00,
        images: ["/assets/club-1.png"],
        category: "Club",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "pro-performance-jersey",
        created_at: new Date().toISOString()
    },
    {
        id: "2",
        name: "Squad Training Shorts",
        description: "Durable training shorts designed for maximum mobility.",
        price: 25.00,
        images: ["/assets/club-1.png"],
        category: "Club",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "squad-training-shorts",
        created_at: new Date().toISOString()
    },
    {
        id: "irish-1",
        name: "Gaeilge Heritage Jersey",
        description: "Show your heritage with the premium Gaeilge collection.",
        price: 49.99,
        images: ["/assets/irish-1.png"],
        category: "Irish",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "gaeilge-heritage",
        created_at: new Date().toISOString()
    },
    {
        id: "limerick-1",
        name: "Limerick Treaty Edition",
        description: "Premium Limerick selection for the Treaty City.",
        price: 54.99,
        images: ["/assets/limerick-1.png"],
        category: "Limerick",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "limerick-treaty-edition",
        created_at: new Date().toISOString()
    },
    {
        id: "tipperary-1",
        name: "Tipperary Premier Jersey",
        description: "The Premier County's finest selection.",
        price: 54.99,
        images: ["/assets/tipperary-1.png"],
        category: "Tipperary",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "tipperary-premier",
        created_at: new Date().toISOString()
    },
    {
        id: "pj1",
        name: "Custom Pub Jersey - Design A",
        description: "Bespoke social jersey designed for local pubs and communities.",
        price: 49.99,
        images: ["/assets/pub-jerseys/1000037870.jpg"],
        category: "Pub Jerseys",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "pub-jersey-design-a",
        created_at: new Date().toISOString()
    },
    {
        id: "pj2",
        name: "Custom Pub Jersey - Design B",
        description: "Bespoke social jersey designed for local pubs and communities.",
        price: 49.99,
        images: ["/assets/pub-jerseys/1000037872.jpg"],
        category: "Pub Jerseys",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "pub-jersey-design-b",
        created_at: new Date().toISOString()
    },
    {
        id: "pj3",
        name: "Custom Pub Jersey - Design C",
        description: "Bespoke social jersey designed for local pubs and communities.",
        price: 49.99,
        images: ["/assets/pub-jerseys/1000037874.jpg"],
        category: "Pub Jerseys",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "pub-jersey-design-c",
        created_at: new Date().toISOString()
    },
    {
        id: "pj4",
        name: "Custom Pub Jersey - Design D",
        description: "Bespoke social jersey designed for local pubs and communities.",
        price: 49.99,
        images: ["/assets/pub-jerseys/1000038099.png"],
        category: "Pub Jerseys",
        product_status: "available",
        stock_status: "in_stock",
        visibility: "published",
        slug: "pub-jersey-design-d",
        created_at: new Date().toISOString()
    }
];

function isVisibleProduct(product: Product): boolean {
    const visibility = String(product.visibility || 'published').toLowerCase();
    return !['draft', 'hidden', 'unpublished', 'archived'].includes(visibility);
}

function findMockProduct(identifier: string): Product | null {
    const token = normalizeProductToken(identifier);
    return MOCK_PRODUCTS.find((p) =>
        normalizeProductToken(p.id) === token ||
        normalizeProductToken(p.slug) === token
    ) || null;
}

function mergeMissingBuiltInCollections(products: Product[]): Product[] {
    const existingKeys = new Set(
        products.flatMap((product) => [
            normalizeProductToken(product.id),
            normalizeProductToken(product.slug),
        ])
    );
    const representedCategories = new Set(products.map((product) => getEffectiveCategory(product)));
    const fallbackProducts = MOCK_PRODUCTS.filter((product) =>
        !existingKeys.has(normalizeProductToken(product.id)) &&
        !existingKeys.has(normalizeProductToken(product.slug)) &&
        !representedCategories.has(getEffectiveCategory(product))
    );

    return [...products, ...fallbackProducts];
}

export const productService = {
    async getProducts(): Promise<Product[]> {
        try {
            // Use static client for public listing to support ISR
            const supabase = createStaticClient();
            if (!supabase) return MOCK_PRODUCTS;

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error || !data || data.length === 0) {
                return MOCK_PRODUCTS;
            }

            const visibleProducts = (data as Product[]).filter(isVisibleProduct);
            return visibleProducts.length > 0 ? mergeMissingBuiltInCollections(visibleProducts) : MOCK_PRODUCTS;
        } catch (err) {
            console.error('Error in getProducts:', err);
            return MOCK_PRODUCTS;
        }
    },

    async getProductBySlug(slug: string): Promise<Product | null> {
        try {
            const supabase = createStaticClient();
            if (!supabase) return findMockProduct(slug);

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('slug', slug)
                .maybeSingle();

            if (error || !data) {
                return productService.getProductById(slug);
            }

            return data as Product;
        } catch (err) {
            return findMockProduct(slug);
        }
    },

    async getProductById(id: string): Promise<Product | null> {
        try {
            const supabase = createStaticClient();
            if (!supabase) return findMockProduct(id);

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .maybeSingle();

            if (error || !data) {
                return findMockProduct(id);
            }

            return data as Product;
        } catch (err) {
            return findMockProduct(id);
        }
    },

    async getAllProductsAdmin(): Promise<Product[]> {
        try {
            // Admin operations still use the authenticated server client
            const supabase = await createClient();
            if (!supabase) return MOCK_PRODUCTS;

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error || !data || data.length === 0) {
                return MOCK_PRODUCTS;
            }

            return data as Product[];
        } catch (err) {
            return MOCK_PRODUCTS;
        }
    }
}
```

---

### `/high-voltage/src/types/index.ts`
```tsx
export * from './product';
```

---

### `/high-voltage/src/types/product.ts`
```tsx
export type ProductStatus = 'available' | 'booking_only' | 'unavailable' | 'coming_soon';
export type StockStatus = 'in_stock' | 'out_of_stock' | 'limited';
export type VisibilityStatus = 'published' | 'draft' | 'hidden';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    product_status: ProductStatus;
    stock_status: StockStatus;
    category: string;
    images: string[];
    tags?: string[];
    featured?: boolean;
    visibility: VisibilityStatus;
    created_at: string;
    updated_at?: string;
}
```

---

### `/high-voltage/src/utils/auth.ts`
```tsx
import { currentUser } from '@clerk/nextjs/server';

/**
 * Checks if the current user is an authorized admin.
 * Admins are defined in environment variables:
 * - ADMIN_EMAILS: Comma-separated list of authorized email addresses.
 * - ADMIN_USER_IDS: Comma-separated list of authorized Clerk user IDs.
 */
export async function checkAdmin() {
    const user = await currentUser();
    if (!user) return false;

    const isAdmin = (user.publicMetadata as { role?: string })?.role === 'admin';
    return isAdmin;
}

/**
 * Helper to ensure a user is an admin or throw an error.
 * Useful for server actions.
 */
export async function ensureAdmin() {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required.');
    }
}
```

---

### `/high-voltage/src/utils/cmsMapper.ts`
```tsx
import type { Product } from '@/types/product';

export interface ProductCMSView {
    id: string;
    display_title: string;
    category: string;
    price_label: string;
    price_raw: number;
    health_status: 'ok' | 'alert' | 'warning';
    health_label: string;
    is_live: boolean;
    preview_img: string;
}

export function mapProductToCMSView(product: Product): ProductCMSView {
    // Determine stock health for neon badges
    let health_status: 'ok' | 'alert' | 'warning' = 'ok';
    let health_label = 'In Stock';

    if (product.stock_status === 'out_of_stock') {
        health_status = 'alert';
        health_label = 'Out of Stock';
    } else if (product.stock_status === 'limited') {
        health_status = 'warning';
        health_label = 'Limited';
    } else if (product.product_status === 'coming_soon') {
        health_status = 'warning';
        health_label = 'Coming Soon';
    } else if (product.product_status === 'booking_only') {
        health_status = 'ok';
        health_label = 'Booking Only';
    }

    return {
        id: product.id,
        display_title: product.name,
        category: product.category || 'Uncategorized',
        price_label: `€${(product.price || 0).toFixed(2)}`,
        price_raw: product.price || 0,
        health_status,
        health_label,
        is_live: product.visibility === 'published',
        preview_img: product.images?.[0] || '/assets/placeholder.png'
    };
}
```

---

### `/high-voltage/src/utils/email.ts`
```tsx
import { Resend } from 'resend';

let resend: any = null;

function getResendClient() {
    if (!resend && process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

/**
 * Escape HTML special characters to prevent injection in email templates.
 */
function escapeHtml(str = ''): string {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export async function sendOrderConfirmationEmail(orderData: any) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Skipping email confirmation.');
        return;
    }

    const { customer_email, customer_name, total_amount, items, order_reference } = orderData;

    const safeName = escapeHtml(customer_name);
    const safeReference = escapeHtml(order_reference?.slice(-8));

    const itemsHtml = items.map((item: any) => `
        <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
             <p style="margin: 0; font-weight: bold;">${escapeHtml(item.title)} x ${Number(item.quantity) || 0}</p>
             <p style="margin: 0; color: #666;">Amount: €${Number(item.amount).toFixed(2)}</p>
        </div>
    `).join('');

    try {
        const client = getResendClient();
        if (!client) {
            console.error('Resend client failed to initialize.');
            return;
        }

        await client.emails.send({
            from: `AF Gear <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
            to: [customer_email],
            subject: `Order Confirmed - #${safeReference}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #66BB6A; text-align: center;">Order Confirmed!</h1>
                    <p>Hi ${safeName || 'Customer'},</p>
                    <p>Thank you for your purchase from AF Gear. Your order is being processed.</p>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Order Summary</h3>
                        ${itemsHtml}
                        <div style="text-align: right; font-weight: bold; font-size: 1.2em; margin-top: 20px;">
                            Total: €${Number(total_amount).toFixed(2)}
                        </div>
                    </div>

                    <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">
                        Order tracking will be sent once your items are shipped.
                    </p>
                </div>
            `,
        });

        console.log('Confirmation email sent to:', customer_email);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
}
```

---

### `/high-voltage/src/utils/productUtils.ts`
```tsx
const CATEGORY_ALIASES: Record<string, string> = {
    club: 'Club',
    clubs: 'Club',
    clubcollection: 'Club',
    clubbeforeeverything: 'Club',
    clubsweater: 'Club Sweaters',
    clubsweaters: 'Club Sweaters',
    sweater: 'Club Sweaters',
    sweaters: 'Club Sweaters',
    hoodie: 'Club Sweaters',
    hoodies: 'Club Sweaters',
    irish: 'Gaeilge',
    gaeilge: 'Gaeilge',
    irishlanguage: 'Gaeilge',
    irishlanguagecollection: 'Gaeilge',
    gaeilgecollection: 'Gaeilge',
    pub: 'Pub Jerseys',
    pubjersey: 'Pub Jerseys',
    pubjerseys: 'Pub Jerseys',
    pubjerseycollection: 'Pub Jerseys',
    pubjerseyscollection: 'Pub Jerseys',
    pubjerseydesign: 'Pub Jerseys',
    pubjerseysdesign: 'Pub Jerseys',
    socialgear: 'Pub Jerseys',
    thatch: 'Pub Jerseys',
    limerick: 'Limerick',
    limerik: 'Limerick',
    limerickcollection: 'Limerick',
    limerikcollection: 'Limerick',
    treatycity: 'Limerick',
    tipperary: 'Tipperary',
    tipperarycollection: 'Tipperary',
    premiercounty: 'Tipperary',
};

const CANONICAL_CATEGORY_ORDER = [
    'Gaeilge',
    'Club Sweaters',
    'Pub Jerseys',
    'Limerick',
    'Tipperary',
    'Club',
] as const;

const CATEGORY_MATCHERS: Record<(typeof CANONICAL_CATEGORY_ORDER)[number], string[]> = {
    Gaeilge: ['gaeilge', 'irishlanguage', 'irishcollection', 'irish'],
    'Club Sweaters': ['clubsweater', 'clubsweaters', 'quarterzip', '14zip', 'hoodie', 'hoodies', 'sweater', 'sweaters'],
    'Pub Jerseys': ['pubjersey', 'pubjerseys', 'pubcollection', 'socialgear', 'thatch'],
    Limerick: ['limerick', 'limerik', 'treatycity'],
    Tipperary: ['tipperary', 'premiercounty'],
    Club: ['clubbeforeeverything', 'clubcollection', 'club'],
};

type ProductCategoryInput = {
    name?: string | null;
    category?: string | null;
    slug?: string | null;
};

export function normalizeProductToken(value?: string | null): string {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '');
}

export function slugifyProductPath(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function normalizeCategoryName(category?: string | null): string {
    const token = normalizeProductToken(category);
    return CATEGORY_ALIASES[token] || category?.trim() || 'Uncategorized';
}

function inferCanonicalCategoryFromTokens(tokens: string[]): string | null {
    for (const category of CANONICAL_CATEGORY_ORDER) {
        const matchers = CATEGORY_MATCHERS[category];
        if (tokens.some((token) => matchers.some((matcher) => token.includes(matcher)))) {
            return category;
        }
    }

    return null;
}

/**
 * Shared utility for determining the effective storefront category of a product.
 * It accepts both CMS labels and URL-style slugs so collection pages stay in sync
 * with the home-page grouping.
 */
export function getEffectiveCategory(product: ProductCategoryInput): string {
    const normalizedCategory = normalizeCategoryName(product.category);
    const categoryToken = normalizeProductToken(normalizedCategory);
    const originalCategoryToken = normalizeProductToken(product.category);
    const nameToken = normalizeProductToken(product.name);
    const slugToken = normalizeProductToken(product.slug);

    const directCategory = inferCanonicalCategoryFromTokens([categoryToken, originalCategoryToken]);
    if (directCategory && directCategory !== 'Club') {
        return directCategory;
    }

    const contentCategory = inferCanonicalCategoryFromTokens([nameToken, slugToken]);
    if (contentCategory && contentCategory !== 'Club') {
        return contentCategory;
    }

    return directCategory || normalizedCategory;
}

export function productBelongsToCategory(
    product: ProductCategoryInput,
    targetCategoryOrSlug?: string | null
): boolean {
    const targetCategory = normalizeCategoryName(targetCategoryOrSlug);
    const targetTokens = [
        normalizeProductToken(targetCategoryOrSlug),
        normalizeProductToken(targetCategory),
    ];

    const inferredTarget = inferCanonicalCategoryFromTokens(targetTokens);
    const effectiveCategory = getEffectiveCategory(product);

    if (inferredTarget) {
        return effectiveCategory === inferredTarget;
    }

    const effectiveToken = normalizeProductToken(effectiveCategory);
    return targetTokens.some((targetToken) =>
        Boolean(targetToken) &&
        (effectiveToken === targetToken ||
            effectiveToken.startsWith(targetToken) ||
            targetToken.startsWith(effectiveToken))
    );
}
```

---

### `/high-voltage/src/utils/rateLimiter.ts`
```tsx
/**
 * Simple in-memory rate limiter using a windowed counter.
 * Suitable for single-instance deployments. For production serverless,
 * replace with Redis-based limiter (e.g., @upstash/ratelimit).
 */

const VISIT_MAP = new Map<string, { count: number; firstSeen: number }>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of VISIT_MAP) {
        if (now - entry.firstSeen > windowMs * 2) {
            VISIT_MAP.delete(key);
        }
    }
}

/**
 * Check if the given identifier has exceeded the rate limit.
 * @param identifier - Unique key (e.g., IP address)
 * @param limit - Max requests allowed within the window (default: 10)
 * @param windowMs - Window duration in milliseconds (default: 60 seconds)
 * @returns `true` if rate limit exceeded, `false` otherwise
 */
export function isRateLimited(
    identifier: string,
    limit = 10,
    windowMs = 60_000
): boolean {
    cleanupStaleEntries(windowMs);

    const now = Date.now();
    const entry = VISIT_MAP.get(identifier);

    if (!entry || now - entry.firstSeen > windowMs) {
        VISIT_MAP.set(identifier, { count: 1, firstSeen: now });
        return false;
    }

    entry.count += 1;
    return entry.count > limit;
}
```

---

### `/high-voltage/src/utils/supabase/admin.ts`
```tsx
import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase admin client using the SERVICE_ROLE_KEY.
 * This bypasses Row Level Security (RLS) policies.
 * ONLY use this for admin/server operations (insert, update, delete).
 * NEVER expose this client or its key to the browser.
 */
export function createAdminClient() {
    if (typeof window !== 'undefined') {
        throw new Error(
            'createAdminClient must only be used in server-side code. ' +
            'Do not import this in client components.'
        );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL environment variables. ' +
            'The admin client cannot function without these.'
        );
    }

    return createSupabaseClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
```

---

### `/high-voltage/src/utils/supabase/client.ts`
```tsx
import { createBrowserClient } from '@supabase/ssr'

export function createClient(clerkToken?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set.");
  }

  const options: any = {}
  if (clerkToken) {
    options.global = {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    }
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    options
  )
}
```

---

### `/high-voltage/src/utils/supabase/middleware.ts`
```tsx
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return supabaseResponse
    }

    try {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            request.cookies.set(name, value)
                        )
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // IMPORTANT: DO NOT REMOVE auth.getUser()
        await supabase.auth.getUser()
    } catch (e) {
        console.error('Supabase Middleware Error:', e)
    }

    return supabaseResponse
}
```

---

### `/high-voltage/src/utils/supabase/server.ts`
```tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { auth } from '@clerk/nextjs/server'

export async function createClient() {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set.");
    }

    // Try to retrieve Clerk token if available
    let clerkToken: string | null = null
    try {
        const authData = await auth();
        if (authData && typeof authData.getToken === 'function') {
            clerkToken = await authData.getToken({ template: 'supabase' })
        }
    } catch (e) {
        // auth() might fail if not in a request context (like during build time/static generation)
    }

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
            ...(clerkToken ? {
                global: {
                    headers: {
                        Authorization: `Bearer ${clerkToken}`,
                    },
                },
            } : {}),
        }
    )
}
```

---

### `/high-voltage/src/utils/supabase/static.ts`
```tsx
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Static client for ISR/SSG where cookies are not available.
 * Use this only for public data fetching during build or ISR.
 */
export function createStaticClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return null;
    }

    return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
```

---
---

## 5. Database & API Configuration

### Supabase Initialization
1. Navigate to **Supabase Dashboard** → create a new project.
2. In **SQL Editor**, run `/supabase/schema.sql` to create all tables.
3. Run `/supabase/hardening.sql` to add RLS policies, `price_cents`, `paid_at`, and `shipping_address` columns.
4. Under **Storage**, ensure the `product-images` bucket is **Public**.
5. Copy your **Project URL** and **anon key** into `.env.local`.

### Clerk Authentication
1. Go to **Clerk Console** → create a new application.
2. Save `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to `.env.local`.
3. Add authorized admin emails to `ADMIN_EMAILS` env var.

### WhatsApp Configuration
The checkout API routes all orders to WhatsApp number `+353 86 312 5706`:
- Stored as: `WHATSAPP_NUMBER=353863125706` (E.164 format, no `+`)
- The system auto-sanitizes the number (strips non-digits) before building the `wa.me` URL

### Resend (Email)
1. Create a **Resend** account and generate an API key.
2. Save to `RESEND_API_KEY=re_...`
3. Set your verified sending domain: `RESEND_FROM_EMAIL=orders@af-gear.com`

---

## 6. Setup & Run Instructions

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Type check
```bash
npx tsc --noEmit
```

### Production build
```bash
npm run build
```

### Security scan (optional)
```bash
npm run security:scan
```

---

## 7. WhatsApp Order Flow — Step by Step

1. Customer adds items to cart → opens CartDrawer → clicks **Checkout Now**
2. Customer fills in email, shipping address, and shipping method on `/checkout`
3. On submit, `POST /api/checkout` is called:
   - Validates input with Zod schema
   - Rate-limits by IP (max 10 requests/min)
   - Fetches authoritative product prices from Supabase (never trusts client prices)
   - Calculates totals in integer cents to avoid floating-point bugs
   - Inserts a `pending` order record in `orders` table with unique ref (`order_<timestamp>_<random>`)
   - Sends confirmation email via Resend
   - Builds a URL-encoded WhatsApp message with full order details
   - Returns `{ url: "https://wa.me/353863125706?text=..." }`
4. Frontend clears the cart and redirects to the WhatsApp URL
5. Owner receives WhatsApp message with full order summary

---

## 8. Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `createAdminClient must only be used in server-side code` | Admin client imported in a Client Component | Move the DB operation to a Server Action or API route |
| `Missing SUPABASE_SERVICE_ROLE_KEY` | Env variable not set in `.env.local` | Add the service role key from Supabase Dashboard |
| `Product lookup failed` | Products table empty or `id` mismatch | Ensure products exist in Supabase with correct UUIDs |
| `Database insert failed` | Schema mismatch | Run `/supabase/hardening.sql` to add missing columns |
| WhatsApp URL not opening | Wrong number format | Ensure `WHATSAPP_NUMBER=353863125706` (no `+`, no spaces) |
| Emails not sending | Wrong `RESEND_API_KEY` or unverified domain | Verify your sending domain in Resend dashboard |

---

## 9. Final Notes & Recommendations

- **Production Deployment**: Use Vercel. Set all env variables under Project Settings → Environment Variables.
- **Rate Limiting**: The current in-memory limiter resets on cold starts. For production, use `@upstash/ratelimit` with Redis.
- **WhatsApp Number**: `WHATSAPP_NUMBER=353863125706` (Ireland, +353 86 312 5706). The `0` prefix is dropped per E.164 standard.
- **Price Safety**: Always use `price_cents` (integer) from the database. Never trust client-side prices.
- **Image Uploads**: Product images upload directly to Supabase Storage (`product-images` bucket, public).
- **Admin Access**: Controlled via `ADMIN_EMAILS` environment variable. No database role changes needed to add/remove admins.
