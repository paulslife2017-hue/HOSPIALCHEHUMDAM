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

-- Sample campaign (Yonsei Midas Dental — Incheon Airport)
-- place_id from: https://maps.app.goo.gl/8dfo2L1jhz1d8uYr9
INSERT OR IGNORE INTO campaigns (id, title, description, place_id, place_name, place_address, place_rating, category, max_participants, deadline, benefits, requirements) VALUES
(1, 'Yonsei Midas Dental — Incheon Airport Experience',
 'Get premium dental care right at Incheon International Airport! Consultation, cleaning, and whitening available. Perfect for travelers who want to combine a Korea trip with quality dental treatment.',
 '0x35654f003cce2c49:0x66cbf26aefa82ff4',
 'Yonsei Midas Dental - Incheon Airport',
 'Incheon International Airport, Incheon, South Korea',
 4.8, 'Dental', 8, '2025-09-30',
 'Free consultation + teeth cleaning + whitening session',
 'Any follower count · English content · Post within 3 weeks');

INSERT OR IGNORE INTO admins (username, password_hash) VALUES ('admin', 'admin1234');
