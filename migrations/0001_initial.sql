-- Experience Program Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  place_id TEXT NOT NULL,
  place_name TEXT NOT NULL,
  place_address TEXT,
  place_photo_ref TEXT,
  place_rating REAL,
  category TEXT DEFAULT 'Clinic',
  max_participants INTEGER DEFAULT 10,
  current_participants INTEGER DEFAULT 0,
  deadline TEXT,
  benefits TEXT,
  requirements TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Applicant table
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  campaign_id INTEGER NOT NULL,
  campaign_title TEXT,
  place_name TEXT,
  applicant_name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  instagram TEXT NOT NULL,
  preferred_dates TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

-- Admin accounts
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Sample Campaigns ──────────────────────────────────────────────────────────

INSERT OR IGNORE INTO campaigns (id, title, description, place_id, place_name, place_address, place_photo_ref, place_rating, category, max_participants, current_participants, deadline, benefits, requirements) VALUES
(1,
 'Premium Dental Care at Incheon Airport',
 'Experience world-class dental treatment steps away from your departure gate. Yonsei Midas offers the full range — from professional whitening and deep cleaning to implants and smile makeovers — all with English-speaking staff and zero wait times. Perfect for travelers wanting to combine their Korea trip with a dental upgrade.',
 'ChIJSSzOPABPZTUR9C-o72ryy2Y',
 'Yonsei Midas Dental Clinic',
 '3F Sun Tower, 127 Gonghang Munhwa-ro, Jung-gu, Incheon International Airport',
 'AaVGc3mvcGWZNFFzxmd2uxtqgvZtCHc5mPzXYPcyPbd_J_XBV_vw0KJQ5MvNLjzqJdsQadHDme39P4FYEU8w7YMrEDw91kJGtPmBOLOtidndmV5m7gDOqrHClSWJ86NGDZcOTymezz9gHNOMDJUVzdYwnKi5iXSo0K1liuKnG6FYmnk_NmIOsLpd8XrHMqzNZkSbPlmHlw8A2TdL_OzA5eFIuP-iN34gxnAGty9CveKuxdz1ij9oeZQhba_MUOyDdzhV8dFYPdXl8NeWaA5ofXiTu95YfwbCq4lFYcDnnewjCzVAKrXKnV-r1qVBk610zDAFgSNaQlHk3CZHtX--zXkYtwXewQUPWN3LId2xfhM7OIHcL7VD1o7_tTA1MkyGerRUBEI4aMbKI_Nq6cEvbrVhowDjZ9641Ea7muDCIFigxTZPsCFPmhb-e7R8WHueaQ',
 5.0, 'Clinic', 10, 2, '2025-09-30',
 'Free consultation + professional cleaning + whitening session (worth ₩250,000)',
 'Any follower count welcome · English content · Post within 3 weeks');

INSERT OR IGNORE INTO campaigns (id, title, description, place_id, place_name, place_address, place_photo_ref, place_rating, category, max_participants, current_participants, deadline, benefits, requirements) VALUES
(2,
 'Luxury Skin Rejuvenation — Gangnam Dermatology',
 'Step into one of Gangnam''s most sought-after skin clinics, trusted by K-pop artists and celebrities. Treatments include laser toning, hydra facials, and custom anti-aging programs tailored for your skin type. Their medical team speaks fluent English and will walk you through every step. Leave Seoul with glass skin.',
 'ChIJN1t_tDeuEmsRUsoyG83frY4',
 'Oracle Skin Clinic Gangnam',
 'B1, 521 Gangnam-daero, Gangnam-gu, Seoul (Exit 1, Sinnonhyeon Station)',
 'AaVGc3pHkL2mRvWqX8nTsYdF5cBjN9oKpQeI7fGhM3lV2uAzXwC4tRsE6nBmJdPo1kYiH8gFaLbNcQvDrEsTuWxZyMnOpRsVbCdEfGhIjKlMnOpQrStUvWxYz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstu',
 4.9, 'Clinic', 8, 1, '2025-10-15',
 'Free laser toning session + hydra facial + skincare kit (worth ₩380,000)',
 'Min. 5K followers · Beauty / lifestyle content · Story + feed post required');

INSERT OR IGNORE INTO campaigns (id, title, description, place_id, place_name, place_address, place_photo_ref, place_rating, category, max_participants, current_participants, deadline, benefits, requirements) VALUES
(3,
 'K-Beauty Masterclass — Myeongdong Flagship',
 'Immerse yourself in authentic Korean beauty culture at the heart of Myeongdong. This flagship store houses 500+ curated K-beauty brands across 4 floors. You''ll receive a personalised skin consultation, a guided product selection by a certified beauty advisor, and an exclusive gift set to take home. The ultimate K-beauty haul experience.',
 'ChIJAQDAOi6ifDUR7pHSXuTtJ9g',
 'Olive Young Myeongdong Town',
 '50 Myeongdong-gil, Jung-gu, Seoul (2 min from Myeongdong Station Exit 6)',
 'AaVGc3rQwErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAsDfGhJkLzXcVbNmQw',
 4.7, 'Beauty Shop', 12, 3, '2025-10-31',
 'Free skin consultation + ₩150,000 product gift set + exclusive member discount card',
 'Any follower count · K-beauty / travel content · Reel or TikTok preferred');

INSERT OR IGNORE INTO campaigns (id, title, description, place_id, place_name, place_address, place_photo_ref, place_rating, category, max_participants, current_participants, deadline, benefits, requirements) VALUES
(4,
 'Nose & Eye Contour Consultation — Apgujeong',
 'Apgujeong Rodeo is Seoul''s epicentre of premium aesthetic medicine, and JW Plastic Surgery stands at the top. This consultation program gives you a private 1-on-1 session with a board-certified surgeon to discuss nose reshaping, double eyelid options, and non-surgical lifting. No pressure — just honest, expert guidance in English.',
 'ChIJrTLr-GyuEmsRBfy61i59si0',
 'JW Plastic Surgery Center',
 '512 Apgujeong-ro, Gangnam-gu, Seoul (Apgujeong Rodeo Station Exit 2)',
 'AaVGc3nMkJhGfDsAzXcVbNmQwErTyUiOpLkJhGfDsAzXcVbNmQwErTyUiOpLkJhGfDsAzXcVbNmQwErTyUiOpLkJhGfDsAzXcVbNmQwErTyUiOpLkJhGfDsAzXcVbNmQwErTyUiOpLkJhGfDsAzXcVbNmQwErTyUiOpL',
 4.8, 'Clinic', 6, 0, '2025-11-15',
 'Free surgeon consultation (1hr) + 3D face analysis + aftercare kit (worth ₩500,000)',
 'Min. 10K followers · Beauty / travel / lifestyle · Content in English or your native language');

INSERT OR IGNORE INTO admins (username, password_hash) VALUES ('admin', 'admin1234');
