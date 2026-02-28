-- Insert Starter Products into AF-Gear Database
INSERT INTO public.products (title, slug, description, price, category, images, features, status, visibility)
VALUES 
(
  'Pro Elite Jersey', 
  'pro-elite-jersey', 
  'Our top-tier performance jersey engineered for professional athletes. Features advanced moisture-wicking fabric, reinforced stitching flatlock seams, and an athletic tailored fit for maximum mobility on the pitch. Made entirely from recycled polyester.', 
  45.00, 
  'jersey', 
  ARRAY['/products/p1-front.png', '/products/p1-back.png'], 
  ARRAY['Moisture-wicking technology', 'Athletic fit', '100% Recycled polyester', 'Reinforced stitching'], 
  'in-stock', 
  'published'
),
(
  'Classic Training Top', 
  'classic-training-top', 
  'The essential mid-layer for every training session. Brushed interior for warmth without bulk, quarter-zip collar for temperature regulation, and thumbholes to keep sleeves securely in place during high-intensity drills.', 
  35.00, 
  'training', 
  ARRAY['/products/p2-front.png'], 
  ARRAY['Quarter-zip design', 'Brushed fleece interior', 'Thumb loops', 'Breathable side panels'], 
  'in-stock', 
  'published'
),
(
  'Performance Shorts', 
  'performance-shorts', 
  'Lightweight, unrestrictive performance shorts designed for speed and agility. Features a mesh-lined elastic waistband with internal drawcord, laser-cut ventilation holes, and hidden zip pockets for secure storage.', 
  25.00, 
  'shorts', 
  ARRAY['/products/p3-front.png'], 
  ARRAY['4-way stretch fabric', 'Hidden zip pockets', 'Laser-cut ventilation', 'Internal drawcord'], 
  'in-stock', 
  'published'
),
(
  'Match Day Full Kit', 
  'match-day-full-kit', 
  'The complete setup for match day. Includes the Pro Elite Jersey, Performance Shorts, and compression socks. Everything your team needs to look unified and play at their highest level. Custom cresting included.', 
  85.00, 
  'bundle', 
  ARRAY['/products/p4-bundle.png'], 
  ARRAY['Complete 3-piece kit', 'Custom cresting included', 'Team discounts available', 'Premium materials'], 
  'pre-order', 
  'published'
),
(
  'Sideline Jacket', 
  'sideline-jacket', 
  'Stay warm and dry on the sidelines with our weather-resistant jacket. Features a DWR water-repellent finish, lightweight thermal insulation, adjustable storm hood, and deep fleece-lined pockets.', 
  75.00, 
  'outerwear', 
  ARRAY['/products/p5-jacket.png'], 
  ARRAY['Water-resistant (DWR)', 'Thermal insulation', 'Adjustable hood', 'Fleece-lined pockets'], 
  'coming-soon', 
  'published'
);
