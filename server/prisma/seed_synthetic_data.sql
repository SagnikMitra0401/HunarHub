-- Synthetic Business Data Seed Script for HunarHub (Supabase PostgreSQL)
-- All users share default password: Password123!

-- 1. Ensure Categories exist
INSERT INTO "Category" (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Cobbler'),
  ('22222222-2222-2222-2222-222222222222', 'Potter (Kumhar)'),
  ('33333333-3333-3333-3333-333333333333', 'Tailor'),
  ('44444444-4444-4444-4444-444444444444', 'Artisan'),
  ('55555555-5555-5555-5555-555555555555', 'Small Vendor')
ON CONFLICT (name) DO NOTHING;

-- 2. Create Micro-Entrepreneurs & Customers
-- Password for all accounts: Password123!
INSERT INTO "User" (id, name, email, "passwordHash", role, phone, location) VALUES
  -- Micro-Entrepreneurs
  ('a1111111-1111-1111-1111-111111111111', 'Ramesh Kumar Kumhar', 'ramesh.pottery@gmail.com', '$2a$12$.zqmOO3ltzh7PSCMmrcT2e6wb04Zqj9ieGgNlLiudIf2sPZ9XQi7.', 'ENTREPRENEUR', '+91 9810123456', 'Khurja, Uttar Pradesh'),
  ('a2222222-2222-2222-2222-222222222222', 'Sunita Devi', 'sunita.tailoring@yahoo.com', '$2a$12$.zqmOO3ltzh7PSCMmrcT2e6wb04Zqj9ieGgNlLiudIf2sPZ9XQi7.', 'ENTREPRENEUR', '+91 9820234567', 'Jaipur, Rajasthan'),
  ('a3333333-3333-3333-3333-333333333333', 'Mohammad Iqbal', 'iqbal.leathercraft@gmail.com', '$2a$12$.zqmOO3ltzh7PSCMmrcT2e6wb04Zqj9ieGgNlLiudIf2sPZ9XQi7.', 'ENTREPRENEUR', '+91 9830345678', 'Agra, Uttar Pradesh'),
  ('a4444444-4444-4444-4444-444444444444', 'Lakshmi Narayan', 'lakshmi.carvings@gmail.com', '$2a$12$.zqmOO3ltzh7PSCMmrcT2e6wb04Zqj9ieGgNlLiudIf2sPZ9XQi7.', 'ENTREPRENEUR', '+91 9840456789', 'Varanasi, Uttar Pradesh'),
  ('a5555555-5555-5555-5555-555555555555', 'Rajesh Sharma', 'rajesh.spices@gmail.com', '$2a$12$.zqmOO3ltzh7PSCMmrcT2e6wb04Zqj9ieGgNlLiudIf2sPZ9XQi7.', 'ENTREPRENEUR', '+91 9850567890', 'Chandni Chowk, Old Delhi'),

  -- Customers
  ('b1111111-1111-1111-1111-111111111111', 'Ananya Roy', 'ananya.roy92@gmail.com', '$2a$12$.zqmOO3ltzh7PSCMmrcT2e6wb04Zqj9ieGgNlLiudIf2sPZ9XQi7.', 'CUSTOMER', '+91 9710112233', 'Kolkata, West Bengal'),
  ('b2222222-2222-2222-2222-222222222222', 'Vikram Malhotra', 'vikram.malhotra@outlook.com', '$2a$12$.zqmOO3ltzh7PSCMmrcT2e6wb04Zqj9ieGgNlLiudIf2sPZ9XQi7.', 'CUSTOMER', '+91 9720223344', 'New Delhi'),
  ('b3333333-3333-3333-3333-333333333333', 'Priya Nair', 'priya.nair@gmail.com', '$2a$12$.zqmOO3ltzh7PSCMmrcT2e6wb04Zqj9ieGgNlLiudIf2sPZ9XQi7.', 'CUSTOMER', '+91 9730334455', 'Bengaluru, Karnataka')
ON CONFLICT (email) DO NOTHING;

-- 3. Create Entrepreneur Profiles (Mix of Verified & Pending Verification)
INSERT INTO "Entrepreneur" (id, "userId", "categoryId", bio, location, "priceRange", "isVerified", "isAvailable") VALUES
  ('e1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', (SELECT id FROM "Category" WHERE name = 'Potter (Kumhar)'), 'Third-generation potter specializing in terracotta kitchenware, hand-painted vases, and eco-friendly diyas.', 'Khurja, Uttar Pradesh', '₹150 - ₹1,500', true, true),
  ('e2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', (SELECT id FROM "Category" WHERE name = 'Tailor'), 'Expert in traditional Rajasthani embroidery, saree alteration, custom kurti tailoring, and wedding outfits.', 'Jaipur, Rajasthan', '₹300 - ₹3,000', true, true),
  ('e3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', (SELECT id FROM "Category" WHERE name = 'Cobbler'), 'Master cobbler with 20 years experience crafting genuine leather mojaris, boots, and shoe repairs.', 'Agra, Uttar Pradesh', '₹200 - ₹2,500', true, true),
  ('e4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', (SELECT id FROM "Category" WHERE name = 'Artisan'), 'Hand-carved wooden decorative artifacts, brass inlay boxes, and traditional wooden crafts.', 'Varanasi, Uttar Pradesh', '₹400 - ₹4,500', false, true), -- PENDING VERIFICATION
  ('e5555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555555', (SELECT id FROM "Category" WHERE name = 'Small Vendor'), 'Authentic stone-ground Indian spices, homemade pickles, and herbal tea blends.', 'Chandni Chowk, Old Delhi', '₹100 - ₹800', false, true)  -- PENDING VERIFICATION
ON CONFLICT ("userId") DO NOTHING;

-- 4. Products for Entrepreneurs
INSERT INTO "Product" (id, "entrepreneurId", name, description, price, "imageUrl") VALUES
  ('p1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'Terracotta Water Jug (Surahi)', 'Natural cooling unglazed earthenware water jug handcrafted from Khurja clay.', 350.00, 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80'),
  ('p2222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', 'Hand-Painted Decorative Clay Pot', 'Vibrant traditional floral art painted on seasoned clay pot.', 550.00, 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80'),
  ('p3333333-3333-3333-3333-333333333333', 'e2222222-2222-2222-2222-222222222222', 'Hand-Embroidered Cotton Anarkali Kurti', 'Pure cotton kurti featuring hand-crafted Gota Patti embroidery from Jaipur.', 1450.00, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'),
  ('p4444444-4444-4444-4444-444444444444', 'e3333333-3333-3333-3333-333333333333', 'Genuine Leather Ethnic Jutti / Mojari', 'Hand-stitched pure leather ethnic footwear with comfortable inner cushioning.', 1250.00, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80'),
  ('p5555555-5555-5555-5555-555555555555', 'e4444444-4444-4444-4444-444444444444', 'Hand-Carved Wooden Jewelry Box', 'Intricate Sheesham wood jewelry organizer box with brass inlay work.', 750.00, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- 5. Service Requests
INSERT INTO "ServiceRequest" (id, "customerId", "entrepreneurId", description, status) VALUES
  ('sr111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'e2222222-2222-2222-2222-222222222222', 'Need alteration and designer blouse stitching for silk saree.', 'ACCEPTED'),
  ('sr222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'e3333333-3333-3333-3333-333333333333', 'Resole and heel reinforcement for formal leather boots.', 'COMPLETED'),
  ('sr333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 'e1111111-1111-1111-1111-111111111111', 'Bulk request: 30 custom terracotta planters for terrace garden.', 'PENDING')
ON CONFLICT (id) DO NOTHING;

-- 6. Product Orders
INSERT INTO "Order" (id, "customerId", "productId", quantity, "totalPrice", status) VALUES
  ('o1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 2, 700.00, 'COMPLETED'),
  ('o2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'p4444444-4444-4444-4444-444444444444', 1, 1250.00, 'COMPLETED'),
  ('o3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 'p3333333-3333-3333-3333-333333333333', 1, 1450.00, 'CONFIRMED')
ON CONFLICT (id) DO NOTHING;

-- 7. Reviews
INSERT INTO "Review" (id, "customerId", "entrepreneurId", "orderId", "serviceRequestId", rating, comment) VALUES
  ('r1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'o1111111-1111-1111-1111-111111111111', NULL, 5, 'The terracotta water jug cools water naturally and looks beautiful! Excellent craftsmanship.'),
  ('r2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'e3333333-3333-3333-3333-333333333333', NULL, 'sr222222-2222-2222-2222-222222222222', 5, 'Mohammad repaired my boots within 2 days. The leather sole stitching is top quality.')
ON CONFLICT (id) DO NOTHING;
