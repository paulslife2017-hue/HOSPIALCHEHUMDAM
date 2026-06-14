// Turso DB 초기화 스크립트 — 테이블 생성 + 초기 데이터 삽입
import { createClient } from '@libsql/client'

const db = createClient({
  url:       process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN || '',
})

const sqls = [
  // ── 테이블 생성 ──────────────────────────────
  `CREATE TABLE IF NOT EXISTS campaigns (
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
  )`,

  `CREATE TABLE IF NOT EXISTS applications (
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
  )`,

  `CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // ── 관리자 계정 ─────────────────────────────
  `INSERT OR IGNORE INTO admins (username, password_hash) VALUES ('admin', '0907')`,

  // ── 샘플 캠페인: 연세미다스 치과 ──────────────
  `INSERT OR IGNORE INTO campaigns
    (id, title, description, place_id, place_name, place_address, place_photo_ref,
     place_rating, category, max_participants, current_participants, deadline, benefits, requirements)
   VALUES (
    1,
    'Premium Dental Care at Incheon Airport',
    'Experience world-class dental treatment steps away from your departure gate. Yonsei Midas offers the full range — from professional whitening and deep cleaning to implants and smile makeovers — all with English-speaking staff and zero wait times. Perfect for travelers wanting to combine their Korea trip with a dental upgrade.',
    'ChIJSSzOPABPZTUR9C-o72ryy2Y',
    'Yonsei Midas Dental Clinic',
    '3F Sun Tower, 127 Gonghang Munhwa-ro, Jung-gu, Incheon International Airport',
    'AaVGc3mvcGWZNFFzxmd2uxtqgvZtCHc5mPzXYPcyPbd_J_XBV_vw0KJQ5MvNLjzqJdsQadHDme39P4FYEU8w7YMrEDw91kJGtPmBOLOtidndmV5m7gDOqrHClSWJ86NGDZcOTymezz9gHNOMDJUVzdYwnKi5iXSo0K1liuKnG6FYmnk_NmIOsLpd8XrHMqzNZkSbPlmHlw8A2TdL_OzA5eFIuP-iN34gxnAGty9CveKuxdz1ij9oeZQhba_MUOyDdzhV8dFYPdXl8NeWaA5ofXiTu95YfwbCq4lFYcDnnewjCzVAKrXKnV-r1qVBk610zDAFgSNaQlHk3CZHtX--zXkYtwXewQUPWN3LId2xfhM7OIHcL7VD1o7_tTA1MkyGerRUBEI4aMbKI_Nq6cEvbrVhowDjZ9641Ea7muDCIFigxTZPsCFPmhb-e7R8WHueaQ',
    5.0, 'Clinic', 10, 0, '2025-12-31',
    'Free consultation + professional cleaning + whitening session (worth ₩250,000)',
    'Any follower count welcome · English content · Post within 3 weeks'
  )`,
]

console.log('🔧 Initializing Turso database...\n')
for (const sql of sqls) {
  const preview = sql.trim().split('\n')[0].slice(0, 60)
  try {
    await db.execute(sql)
    console.log(`✅ ${preview}…`)
  } catch (e) {
    console.error(`❌ ${preview}…\n   ${e.message}`)
  }
}
console.log('\n✅ Done! Database is ready.')
db.close()
