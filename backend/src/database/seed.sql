-- ─────────────────────────────────────────────────────────────────
--  Auraè Jewellery — Seed Data
--  Run AFTER schema.sql
-- ─────────────────────────────────────────────────────────────────

USE aurae_jewellery;

-- ─────────────────────────────────────────
--  ADMIN USER
--  Password: Admin@123  (bcrypt hash — update in prod!)
-- ─────────────────────────────────────────
INSERT IGNORE INTO users (name, email, phone, password_hash, role, email_verified) VALUES
('Auraè Admin',   'admin@aurae.in',  '9000000001', '$2b$12$5yEHIY/9jIO4.Mvr4me1POPuZR7o5env9QGTcYpIWNNMAYsPCaXl2', 'admin', 1),
('Priya Sharma',  'priya@example.com', '9876543210', '$2b$12$5yEHIY/9jIO4.Mvr4me1POPuZR7o5env9QGTcYpIWNNMAYsPCaXl2', 'user', 1),
('Rahul Mehta',   'rahul@example.com', '9123456789', '$2b$12$5yEHIY/9jIO4.Mvr4me1POPuZR7o5env9QGTcYpIWNNMAYsPCaXl2', 'user', 1);

-- ─────────────────────────────────────────
--  CATEGORIES
-- ─────────────────────────────────────────
INSERT IGNORE INTO categories (id, name, slug, description, sort_order) VALUES
(1,  'Rings',       'rings',       'Gold, diamond and gemstone rings for every occasion', 1),
(2,  'Necklaces',   'necklaces',   'Elegant necklaces, pendants and chains',              2),
(3,  'Earrings',    'earrings',    'Studs, drops, hoops and chandelier earrings',         3),
(4,  'Bangles',     'bangles',     'Traditional and contemporary bangles & bracelets',    4),
(5,  'Bracelets',   'bracelets',   'Delicate and statement bracelets',                   5),
(6,  'Mangalsutras','mangalsutras','Traditional and modern mangalsutras',                 6),
(7,  'Nose Pins',   'nose-pins',   'Classic and designer nose pins',                     7),
(8,  'Pendants',    'pendants',    'Gold and diamond pendants',                           8);

-- Sub-categories
INSERT IGNORE INTO categories (name, slug, parent_id, sort_order) VALUES
('Gold Rings',      'gold-rings',         1, 1),
('Diamond Rings',   'diamond-rings',      1, 2),
('Engagement Rings','engagement-rings',   1, 3),
('Gold Necklaces',  'gold-necklaces',     2, 1),
('Diamond Necklaces','diamond-necklaces', 2, 2);

-- ─────────────────────────────────────────
--  PRODUCTS  (10 showcase products)
-- ─────────────────────────────────────────
INSERT INTO products
  (name, slug, sku, description, short_desc, category_id, material, purity,
   weight_gm, price, mrp, stock, thumbnail, images, tags, occasion, gender,
   is_featured, is_new_arrival, is_bestseller, avg_rating, review_count, sold_count,
   specs)
VALUES
(
  'Royal Solitaire Diamond Ring',
  'royal-solitaire-diamond-ring',
  'RNG-DIA-001',
  'A magnificent solitaire diamond ring set in 18K yellow gold. The GIA-certified round brilliant diamond of 0.75 carats is prong-set to maximise light brilliance. An eternal symbol of love and elegance.',
  'GIA certified 0.75ct round brilliant diamond in 18K gold.',
  2, 'Gold', '18K', 3.200,
  185000.00, 199000.00, 12,
  '/uploads/products/rng-dia-001-thumb.webp',
  JSON_ARRAY('/uploads/products/rng-dia-001-1.webp', '/uploads/products/rng-dia-001-2.webp'),
  JSON_ARRAY('ring','diamond','solitaire','18k','engagement','gold'),
  'Wedding', 'women', 1, 1, 1, 4.90, 48, 210,
  JSON_OBJECT('Stone','Diamond','Carat','0.75 ct','Cut','Round Brilliant','Clarity','VS1','Colour','F','Certification','GIA','Setting','4-Prong')
),
(
  'Eternity Gold Bangle Set',
  'eternity-gold-bangle-set',
  'BNG-GLD-001',
  'A classic set of four 22K gold bangles with intricate hand-engraved floral motifs. Timeless craftsmanship that celebrates the art of Indian jewellery making.',
  'Set of 4 hand-engraved 22K gold bangles.',
  4, 'Gold', '22K', 28.500,
  142000.00, 155000.00, 8,
  '/uploads/products/bng-gld-001-thumb.webp',
  JSON_ARRAY('/uploads/products/bng-gld-001-1.webp'),
  JSON_ARRAY('bangles','gold','22k','traditional','set','festive'),
  'Festive', 'women', 1, 0, 1, 4.80, 32, 89,
  JSON_OBJECT('Purity','22K BIS Hallmarked','Set Of','4 Bangles','Size','2/4 (adjustable)','Finish','Hand Engraved')
),
(
  'Lumière Diamond Necklace',
  'lumiere-diamond-necklace',
  'NCK-DIA-001',
  'French for "light", the Lumière necklace features 64 brilliant-cut diamonds totalling 1.20 carats, pavé-set along an 18K white gold chain. The graceful gradient design catches light from every angle.',
  '64 brilliant-cut diamonds (1.20 ct TW) in 18K white gold.',
  5, 'Gold', '18K', 7.800,
  320000.00, 349000.00, 5,
  '/uploads/products/nck-dia-001-thumb.webp',
  JSON_ARRAY('/uploads/products/nck-dia-001-1.webp', '/uploads/products/nck-dia-001-2.webp'),
  JSON_ARRAY('necklace','diamond','white-gold','18k','luxury','pavé'),
  'Anniversary', 'women', 1, 1, 0, 4.95, 21, 43,
  JSON_OBJECT('Total Carat Weight','1.20 ct','Stone Count','64','Setting','Pavé','Chain Length','18 inch','Clasp','Lobster Claw')
),
(
  'Heritage Pearl Drop Earrings',
  'heritage-pearl-drop-earrings',
  'EAR-PRL-001',
  'South Sea cultured pearls (10–11 mm) suspended from rose gold leverback hooks. The understated luxury of perfectly round, high-lustre pearls makes these ideal for both formal evenings and intimate occasions.',
  'South Sea cultured pearls with 18K rose gold.',
  3, 'Gold', '18K', 4.200,
  68000.00, 74000.00, 20,
  '/uploads/products/ear-prl-001-thumb.webp',
  JSON_ARRAY('/uploads/products/ear-prl-001-1.webp'),
  JSON_ARRAY('earrings','pearl','rose-gold','18k','drop','luxury'),
  'Party', 'women', 0, 1, 0, 4.70, 15, 67,
  JSON_OBJECT('Pearl Type','South Sea Cultured','Pearl Size','10–11 mm','Lustre','AAA','Gold','18K Rose Gold','Closure','Leverback')
),
(
  'Floral Diamond Mangalsutra',
  'floral-diamond-mangalsutra',
  'MNG-DIA-001',
  'A modern take on the sacred mangalsutra — 18K yellow and black gold with 0.50 ct diamond-encrusted floral pendants on a delicate 18-inch chain. Blends tradition with contemporary design.',
  '0.50 ct diamonds in yellow & black 18K gold.',
  6, 'Gold', '18K', 6.100,
  98000.00, 109000.00, 15,
  '/uploads/products/mng-dia-001-thumb.webp',
  JSON_ARRAY('/uploads/products/mng-dia-001-1.webp'),
  JSON_ARRAY('mangalsutra','diamond','18k','modern','wedding','black-gold'),
  'Wedding', 'women', 1, 0, 1, 4.85, 27, 112,
  JSON_OBJECT('Diamond Weight','0.50 ct TW','Chain Length','18 inch','Gold Type','Yellow + Black Gold','Closure','Spring Ring')
),
(
  'Men''s Platinum Wedding Band',
  'mens-platinum-wedding-band',
  'RNG-PLT-001',
  'Sculpted in 950 platinum, this 6mm comfort-fit wedding band features a satin-brushed centre with polished bevelled edges. Hypoallergenic and designed for a lifetime of wear.',
  '6mm 950 platinum comfort-fit band with brushed finish.',
  1, 'Platinum', '950', 8.500,
  52000.00, 58000.00, 25,
  '/uploads/products/rng-plt-001-thumb.webp',
  JSON_ARRAY('/uploads/products/rng-plt-001-1.webp'),
  JSON_ARRAY('ring','platinum','men','wedding','band','950'),
  'Wedding', 'men', 0, 0, 1, 4.75, 19, 93,
  JSON_OBJECT('Metal','950 Platinum','Width','6 mm','Fit','Comfort Fit','Finish','Brushed Centre / Polished Edge','Hypoallergenic','Yes')
),
(
  'Kundan Choker Necklace',
  'kundan-choker-necklace',
  'NCK-KUN-001',
  'An heirloom-worthy kundan choker with Polki diamonds, meenakari enamel work in peacock motifs, and a hand-strung ruby bead string at the back. Crafted by artisans in Jaipur using 500-year-old techniques.',
  'Polki diamonds & meenakari enamel — Jaipur artisan crafted.',
  2, 'Gold', '22K', 35.000,
  245000.00, 275000.00, 4,
  '/uploads/products/nck-kun-001-thumb.webp',
  JSON_ARRAY('/uploads/products/nck-kun-001-1.webp', '/uploads/products/nck-kun-001-2.webp'),
  JSON_ARRAY('necklace','kundan','choker','polki','meenakari','jaipur','bridal'),
  'Bridal', 'women', 1, 0, 0, 4.95, 9, 18,
  JSON_OBJECT('Technique','Kundan Setting','Stones','Polki Diamond + Ruby','Enamel','Meenakari','Origin','Jaipur','Gold','22K')
),
(
  'Diamond Tennis Bracelet',
  'diamond-tennis-bracelet',
  'BRC-DIA-001',
  'A timeless line bracelet featuring 45 round brilliant diamonds totalling 2.00 carats, prong-set in 18K white gold. The safety clasp ensures secure, worry-free wear.',
  '45 diamonds, 2.00 ct TW, in 18K white gold.',
  5, 'Gold', '18K', 9.200,
  410000.00, 449000.00, 3,
  '/uploads/products/brc-dia-001-thumb.webp',
  JSON_ARRAY('/uploads/products/brc-dia-001-1.webp'),
  JSON_ARRAY('bracelet','diamond','tennis','18k','white-gold','luxury'),
  'Anniversary', 'women', 1, 1, 0, 4.90, 12, 29,
  JSON_OBJECT('Total Carat Weight','2.00 ct','Stone Count','45','Cut','Round Brilliant','Clarity','VS2','Colour','G','Length','7 inch')
),
(
  'Gold Kadas for Kids',
  'gold-kadas-kids',
  'BNG-KID-001',
  'Adorable 22K gold kadas for little ones, featuring playful elephant motifs. BIS hallmarked and made without sharp edges, these are the perfect first jewellery for your child.',
  'BIS hallmarked 22K gold kids kadas with elephant motif.',
  4, 'Gold', '22K', 5.800,
  28500.00, 31000.00, 30,
  '/uploads/products/bng-kid-001-thumb.webp',
  JSON_ARRAY('/uploads/products/bng-kid-001-1.webp'),
  JSON_ARRAY('bangles','kids','gold','22k','kada','gift'),
  'Birthday', 'kids', 0, 1, 0, 4.80, 22, 78,
  JSON_OBJECT('Purity','22K BIS Hallmarked','Weight','5.8 gm','Set Of','2','Motif','Elephant','Safety','Rounded Edges')
),
(
  'Vintage Sapphire Ring',
  'vintage-sapphire-ring',
  'RNG-SAP-001',
  'Inspired by Victorian-era jewellery, this ring centres a 1.50-carat Ceylon sapphire encircled by old-mine-cut diamonds in a milgrain-edged 18K yellow gold mounting. Unique and extraordinarily detailed.',
  '1.50 ct Ceylon sapphire with old-mine-cut diamonds, 18K gold.',
  1, 'Gold', '18K', 4.500,
  225000.00, 248000.00, 6,
  '/uploads/products/rng-sap-001-thumb.webp',
  JSON_ARRAY('/uploads/products/rng-sap-001-1.webp', '/uploads/products/rng-sap-001-2.webp'),
  JSON_ARRAY('ring','sapphire','diamond','18k','vintage','victorian','blue'),
  'Anniversary', 'women', 0, 1, 0, 4.85, 7, 14,
  JSON_OBJECT('Centre Stone','Ceylon Sapphire','Carat','1.50 ct','Side Stones','Old-Mine-Cut Diamonds','Setting','Milgrain Halo','Era','Victorian Inspired')
);

-- ─────────────────────────────────────────
--  COUPONS
-- ─────────────────────────────────────────
INSERT INTO coupons (code, type, value, min_order_amt, max_discount, max_uses, per_user_limit, valid_until, description) VALUES
('WELCOME10',  'percent', 10.00,  5000.00, 2500.00,  500, 1, DATE_ADD(NOW(), INTERVAL 1 YEAR), 'Welcome 10% off on your first order'),
('AURAE500',   'flat',   500.00, 10000.00,   NULL,   200, 2, DATE_ADD(NOW(), INTERVAL 6 MONTH), 'Flat ₹500 off on orders above ₹10,000'),
('FESTIVE15',  'percent', 15.00, 15000.00, 5000.00,  100, 1, DATE_ADD(NOW(), INTERVAL 3 MONTH), 'Festive season 15% off'),
('DIAMOND20',  'percent', 20.00, 50000.00,10000.00,   50, 1, DATE_ADD(NOW(), INTERVAL 2 MONTH), '20% off on diamond jewellery');

-- ─────────────────────────────────────────
--  BANNERS
-- ─────────────────────────────────────────
INSERT INTO banners (title, subtitle, image, cta_text, cta_link, position, sort_order) VALUES
('The Lumière Collection', 'Where Light Meets Luxury', '/uploads/banners/hero-1.webp', 'Explore Now', '/shop?category=necklaces', 'hero', 1),
('Bridal Season 2025',     'Adorn Your Love Story',   '/uploads/banners/hero-2.webp', 'Shop Bridal', '/shop?occasion=Bridal',    'hero', 2),
('Diamond Essentials',     'Timeless. Brilliant.',    '/uploads/banners/hero-3.webp', 'Discover',    '/shop?material=Diamond',    'hero', 3),
('Festive Edit',           'Celebrate in Gold',       '/uploads/banners/mid-1.webp',  'Shop Now',    '/shop?occasion=Festive',   'mid',  1);

-- ─────────────────────────────────────────
--  SAMPLE BLOGS
-- ─────────────────────────────────────────
INSERT INTO blogs (title, slug, excerpt, content, author_id, tags, category, is_published, view_count, read_time, published_at) VALUES
(
  'How to Choose the Perfect Engagement Ring',
  'how-to-choose-perfect-engagement-ring',
  'A complete guide to choosing the right diamond, setting, and metal for the most important ring you will ever buy.',
  '<h2>Understanding the 4Cs</h2><p>When selecting a diamond, the four Cs — Cut, Clarity, Colour, and Carat — are your guiding framework...</p><h2>Choosing the Right Setting</h2><p>The setting determines how your diamond is secured and showcased...</p>',
  1,
  JSON_ARRAY('engagement','diamond','guide','ring','buying-guide'),
  'Guides', 1, 1240, 8,
  DATE_SUB(NOW(), INTERVAL 15 DAY)
),
(
  'The Art of Hallmarking: Why BIS Mark Matters',
  'art-of-hallmarking-bis-mark',
  'Understanding India''s Bureau of Indian Standards hallmarking system and why it''s the only guarantee of gold purity.',
  '<h2>What is Hallmarking?</h2><p>Hallmarking is the accurate determination and official recording of the proportionate content of precious metal in jewellery...</p>',
  1,
  JSON_ARRAY('hallmark','bis','gold','purity','guide'),
  'Education', 1, 892, 5,
  DATE_SUB(NOW(), INTERVAL 30 DAY)
),
(
  'Kundan vs Polki: Decoding India''s Finest Jewellery Arts',
  'kundan-vs-polki-indias-finest-jewellery',
  'Two of India''s most celebrated jewellery traditions — discover what sets them apart and why both deserve a place in your collection.',
  '<h2>Kundan Jewellery</h2><p>Originating in the royal courts of Rajasthan and Mughal India, Kundan is a technique of gem-setting...</p><h2>Polki Diamonds</h2><p>Polki refers to uncut diamonds in their natural, raw form...</p>',
  1,
  JSON_ARRAY('kundan','polki','bridal','jaipur','traditional','indian-jewellery'),
  'Heritage', 1, 2150, 6,
  DATE_SUB(NOW(), INTERVAL 7 DAY)
);
