-- ========================================================
-- DELULUCRAFTS SUPABASE POSTGRESQL SCHEMA & INITIAL DATA
-- Run this script in the Supabase SQL Editor
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  addresses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  discount_price NUMERIC(12, 2) DEFAULT 0 CHECK (discount_price >= 0),
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sold INT NOT NULL DEFAULT 0,
  ratings NUMERIC(3, 1) DEFAULT 0,
  num_reviews INT DEFAULT 0,
  specifications JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CART TABLE
CREATE TABLE IF NOT EXISTS public.cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 5. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'COD' CHECK (payment_method IN ('COD', 'UPI', 'Card', 'NetBanking')),
  payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed')),
  order_status TEXT NOT NULL DEFAULT 'Processing' CHECK (order_status IN ('Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled')),
  items_price NUMERIC(12, 2) NOT NULL,
  shipping_price NUMERIC(12, 2) DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) optionally or leave public access for backend service role
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (default) and public read on products
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow all service role" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all cart service role" ON public.cart FOR ALL USING (true);
CREATE POLICY "Allow all wishlist service role" ON public.wishlist FOR ALL USING (true);
CREATE POLICY "Allow all orders service role" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow all products service role" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow all reviews service role" ON public.reviews FOR ALL USING (true);

-- ========================================================
-- SEED DATA: ADMIN USER & SAMPLE PRODUCTS
-- Default Admin: admin@delulucrafts.com / admin123 (hashed with bcrypt)
-- ========================================================
INSERT INTO public.users (name, email, password, role)
VALUES (
  'Admin User',
  'admin@delulucrafts.com',
  '$2a$10$eE0m7aG1t0kPq/4c5z5xee2K/aLrqj6hO9tZg/P2C50hXqB7z.Hqq', -- bcrypt for 'admin123'
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- INSERT PRODUCTS
INSERT INTO public.products (name, brand, description, price, discount_price, category, images, stock, is_featured, specifications, tags)
VALUES
(
  'Samsung Galaxy S24 Ultra 5G',
  'Samsung',
  'The Galaxy S24 Ultra is Samsung''s most powerful phone yet, featuring a built-in S Pen, 200MP camera, and the Snapdragon 8 Gen 3 processor with Galaxy AI.',
  134999.00,
  109999.00,
  'Electronics',
  '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  50,
  true,
  '[{"key": "Display", "value": "6.8\" QHD+ Dynamic AMOLED"}, {"key": "Processor", "value": "Snapdragon 8 Gen 3"}, {"key": "RAM", "value": "12 GB"}, {"key": "Camera", "value": "200 MP Main"}]'::jsonb,
  '["smartphone", "5G", "Android", "flagship"]'::jsonb
),
(
  'Apple iPhone 16 Pro Max',
  'Apple',
  'iPhone 16 Pro Max with titanium design, A18 Pro chip, 48MP Ultra Wide camera with autofocus, and custom Camera Control button.',
  179900.00,
  159900.00,
  'Electronics',
  '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  30,
  true,
  '[{"key": "Display", "value": "6.9\" Super Retina XDR OLED"}, {"key": "Chip", "value": "A18 Pro"}, {"key": "Storage", "value": "256 GB"}]'::jsonb,
  '["iphone", "apple", "iOS", "flagship"]'::jsonb
),
(
  'Sony WH-1000XM5 Wireless Headphones',
  'Sony',
  'Industry-leading noise canceling with two processors and eight microphones. Exceptional hi-res sound quality with 30mm precision drivers.',
  34990.00,
  26990.00,
  'Electronics',
  '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  75,
  true,
  '[{"key": "Type", "value": "Over-ear Wireless"}, {"key": "Battery", "value": "30 hours"}, {"key": "ANC", "value": "Dual Processor ANC"}]'::jsonb,
  '["headphones", "wireless", "ANC", "audio"]'::jsonb
),
(
  'MacBook Air 15" M3',
  'Apple',
  'MacBook Air with M3 chip delivers serious performance in a thin, fanless unibody design. 18-hour battery and Liquid Retina display.',
  134900.00,
  124900.00,
  'Electronics',
  '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  25,
  true,
  '[{"key": "Chip", "value": "Apple M3"}, {"key": "RAM", "value": "8 GB"}, {"key": "Storage", "value": "256 GB SSD"}]'::jsonb,
  '["laptop", "apple", "macbook", "M3"]'::jsonb
),
(
  'Nike Air Max 270 React',
  'Nike',
  'The Nike Air Max 270 React combines Nike''s innovative cushioning technologies for an ultra-soft and resilient stride.',
  12995.00,
  8995.00,
  'Fashion',
  '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  120,
  false,
  '[{"key": "Material", "value": "Mesh + Synthetic"}, {"key": "Sole", "value": "React foam + Air Max"}]'::jsonb,
  '["shoes", "sneakers", "running", "Nike"]'::jsonb
),
(
  'Minimalist Ceramic Dinner Set (16 Piece)',
  'Artisan Clay',
  'Handcrafted matte ceramic dinner set with natural stone speckles, food-safe glaze, microwave and dishwasher safe.',
  7499.00,
  4999.00,
  'Home & Kitchen',
  '["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  40,
  true,
  '[{"key": "Pieces", "value": "16"}, {"key": "Material", "value": "Stoneware Ceramic"}]'::jsonb,
  '["ceramic", "kitchen", "dining", "home"]'::jsonb
),
(
  'The Psychology of Money — Morgan Housel',
  'Harriman House',
  'Timeless lessons on wealth, greed, and happiness. Doing well with money isn''t necessarily about what you know. It''s about how you behave.',
  499.00,
  349.00,
  'Books',
  '["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  200,
  false,
  '[{"key": "Author", "value": "Morgan Housel"}, {"key": "Format", "value": "Paperback"}]'::jsonb,
  '["book", "finance", "bestseller"]'::jsonb
),
(
  'Pure Botanical Facial Serum (50ml)',
  'Lumiere Botanics',
  'Cold-pressed botanical oils enriched with squalane, rosehip, and Vitamin C for deeply nourished, radiant skin.',
  2499.00,
  1799.00,
  'Beauty',
  '["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  90,
  true,
  '[{"key": "Volume", "value": "50ml"}, {"key": "Skin Type", "value": "All Skin Types"}]'::jsonb,
  '["skincare", "serum", "organic", "beauty"]'::jsonb
);

