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

-- Sample campaigns
INSERT OR IGNORE INTO campaigns (id, title, description, place_id, place_name, place_address, place_rating, category, max_participants, deadline, benefits, requirements) VALUES
(1, 'Gangnam Plastic Surgery Review',
 'Visit one of Seoul''s top plastic surgery clinics and share your honest experience. Consultation and selected treatments provided.',
 'ChIJN1t_tDeuEmsRUsoyG83frY4', 'Gangnam Aesthetic Clinic', '123 Teheran-ro, Gangnam-gu, Seoul',
 4.8, 'Hospital', 6, '2025-08-31', 'Free consultation + 30% off selected procedures', 'Min. 5K followers · Post within 2 weeks'),
(2, 'Seoul Dental Clinic Experience',
 'Experience premium dental care in Seoul. Checkup, cleaning, and whitening included.',
 'ChIJgUZiEVKifDURqFxnFCVKqxI', 'Seoul Smile Dental', '45 Sinchon-ro, Mapo-gu, Seoul',
 4.7, 'Hospital', 8, '2025-09-15', 'Free checkup + cleaning + whitening', 'Min. 3K followers · English content'),
(3, 'K-Dermatology Skin Treatment',
 'Try Korean dermatology — laser, skin boosters, anti-aging. Document your skin journey.',
 'ChIJAWV_rsSlfDURbXzXfCHxOHs', 'Myeongdong Skin Clinic', '88 Myeongdong-gil, Jung-gu, Seoul',
 4.6, 'Hospital', 10, '2025-09-30', '2 laser sessions + skincare kit', 'Any follower count · Before/after content'),
(4, 'Luxury Head Spa Experience',
 'Relax at a premium head spa. Scalp treatment, deep conditioning, and relaxation therapy.',
 'ChIJ_headspa_1', 'Seoul Head Spa & Scalp Clinic', '33 Apgujeong-ro, Gangnam-gu, Seoul',
 4.9, 'Head Spa', 8, '2025-09-10', 'Full head spa session (90 min) + scalp care kit', 'Wellness/beauty creators preferred'),
(5, 'Oriental Medicine & Acupuncture',
 'Experience authentic Korean traditional medicine. Acupuncture, cupping, and herbal consultations.',
 'ChIJ_oriental_1', 'Jongno Korean Medicine Clinic', '12 Jongno-ro, Jongno-gu, Seoul',
 4.5, 'Hospital', 12, '2025-10-15', '3 acupuncture sessions + herbal tea set', 'Open to all nationalities');

INSERT OR IGNORE INTO admins (username, password_hash) VALUES ('admin', 'admin1234');
