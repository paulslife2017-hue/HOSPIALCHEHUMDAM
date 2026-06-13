-- 체험단 캠페인 테이블
CREATE TABLE IF NOT EXISTS campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  place_id TEXT NOT NULL,
  place_name TEXT NOT NULL,
  place_address TEXT,
  place_photo_ref TEXT,
  place_rating REAL,
  place_types TEXT,
  category TEXT DEFAULT '맛집',
  max_participants INTEGER DEFAULT 10,
  current_participants INTEGER DEFAULT 0,
  deadline TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 지원자 테이블
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  campaign_id INTEGER NOT NULL,
  campaign_title TEXT,
  place_name TEXT,
  applicant_name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  instagram TEXT,
  youtube TEXT,
  followers INTEGER DEFAULT 0,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

-- 관리자 계정 테이블
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 기본 캠페인 데이터
INSERT OR IGNORE INTO campaigns (id, title, description, place_id, place_name, place_address, place_photo_ref, place_rating, place_types, category, max_participants, deadline) VALUES
(1, '강남 맛집 SNS 체험단', '서울 강남의 유명 한식 레스토랑에서 외국인 SNS 체험단을 모집합니다. 방문 후 인스타그램에 후기를 남겨주세요!', 'ChIJN1t_tDeuEmsRUsoyG83frY4', '모범 한식당', '서울 강남구 테헤란로 123', '', 4.5, 'restaurant,food', '맛집', 8, '2025-07-31'),
(2, '경복궁 문화 체험단', '유네스코 세계문화유산 경복궁에서 특별한 한국 문화를 경험해보세요. 한복 체험 포함!', 'ChIJgUZiEVKifDURqFxnFCVKqxI', '경복궁', '서울 종로구 사직로 161', '', 4.7, 'tourist_attraction,museum', '문화', 15, '2025-08-15'),
(3, '홍대 카페 체험단', '트렌디한 홍대 카페에서 특별한 디저트와 음료를 체험해보세요!', 'ChIJAWV_rsSlfDURbXzXfCHxOHs', '홍대 아트카페', '서울 마포구 와우산로 123', '', 4.3, 'cafe,food', '카페', 10, '2025-07-20');

-- 기본 관리자 계정 (비밀번호: admin1234)
INSERT OR IGNORE INTO admins (username, password_hash) VALUES 
('admin', 'admin1234');
