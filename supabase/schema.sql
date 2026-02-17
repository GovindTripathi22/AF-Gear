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
