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
  category TEXT DEFAULT 'Hospital',
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

-- Sample campaign (Yonsei Midas Dental Clinic — Incheon Airport)
-- place_id from: https://maps.app.goo.gl/8dfo2L1jhz1d8uYr9  (resolved via Places API)
INSERT OR IGNORE INTO campaigns (id, title, description, place_id, place_name, place_address, place_photo_ref, place_rating, category, max_participants, deadline, benefits, requirements) VALUES
(1, 'Yonsei Midas Dental Clinic — Incheon Airport',
 'Get premium dental care right at Incheon International Airport. Free consultation, professional cleaning, and whitening available. Perfect for travelers combining a Korea trip with top-quality dental treatment.',
 'ChIJSSzOPABPZTUR9C-o72ryy2Y',
 'Yonsei Midas Dental Clinic',
 '3F Sun Tower, 127 Gonghang Munhwa-ro, Jung-gu, Incheon (Incheon Intl Airport)',
 'AaVGc3mvcGWZNFFzxmd2uxtqgvZtCHc5mPzXYPcyPbd_J_XBV_vw0KJQ5MvNLjzqJdsQadHDme39P4FYEU8w7YMrEDw91kJGtPmBOLOtidndmV5m7gDOqrHClSWJ86NGDZcOTymezz9gHNOMDJUVzdYwnKi5iXSo0K1liuKnG6FYmnk_NmIOsLpd8XrHMqzNZkSbPlmHlw8A2TdL_OzA5eFIuP-iN34gxnAGty9CveKuxdz1ij9oeZQhba_MUOyDdzhV8dFYPdXl8NeWaA5ofXiTu95YfwbCq4lFYcDnnewjCzVAKrXKnV-r1qVBk610zDAFgSNaQlHk3CZHtX--zXkYtwXewQUPWN3LId2xfhM7OIHcL7VD1o7_tTA1MkyGerRUBEI4aMbKI_Nq6cEvbrVhowDjZ9641Ea7muDCIFigxTZPsCFPmhb-e7R8WHueaQ',
 5.0, 'Clinic', 8, '2025-09-30',
 'Free consultation + professional cleaning + whitening session',
 'Any follower count · English content · Post within 3 weeks');

INSERT OR IGNORE INTO admins (username, password_hash) VALUES ('admin', 'admin1234');
