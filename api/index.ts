import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@libsql/client/http'
import { createHash, randomUUID } from 'crypto'

// ── Turso DB (싱글톤 — 요청마다 새 연결 방지) ──
let _db: ReturnType<typeof createClient> | null = null
function getDB() {
  if (!_db) {
    const url   = process.env.TURSO_DATABASE_URL!
    const token = process.env.TURSO_AUTH_TOKEN || ''
    if (!url) throw new Error('TURSO_DATABASE_URL is not set')
    _db = createClient({ url, authToken: token })
  }
  return _db
}

// BigInt 값을 Number/String으로 안전하게 변환
function sanitize(v: any): any {
  if (typeof v === 'bigint') return Number(v)
  if (Array.isArray(v)) return v.map(sanitize)
  if (v !== null && typeof v === 'object') {
    const out: any = {}
    for (const k of Object.keys(v)) out[k] = sanitize(v[k])
    return out
  }
  return v
}

async function dbAll(sql: string, args: any[] = []) {
  const db = getDB()
  const rs = await db.execute({ sql, args })
  if (!rs.rows || rs.rows.length === 0) return []
  const first = rs.rows[0]
  let rows: any[]
  if (typeof first === 'object' && !Array.isArray(first)) {
    rows = rs.rows as any[]
  } else {
    const cols = rs.columns || []
    rows = rs.rows.map((row: any) => {
      const obj: any = {}
      cols.forEach((col: string, i: number) => { obj[col] = row[i] })
      return obj
    })
  }
  return sanitize(rows)
}
async function dbFirst(sql: string, args: any[] = []) {
  const rows = await dbAll(sql, args)
  return rows[0] ?? null
}
async function dbRun(sql: string, args: any[] = []) {
  const db = getDB()
  const rs = await db.execute({ sql, args })
  return {
    lastInsertRowid: rs.lastInsertRowid != null ? Number(rs.lastInsertRowid) : null,
    rowsAffected:    rs.rowsAffected    != null ? Number(rs.rowsAffected)    : 0,
  }
}

// ── 랜덤 비밀번호 생성 ──

// ── 슬러그 생성 (업체명 → URL용) ──────────────
function makeSlug(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}
function genClinicPassword(): string {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789'
  let pw = ''
  for (let i = 0; i < 8; i++) pw += chars[Math.floor(Math.random() * chars.length)]
  return pw
}

// ── SHA-256 / isAdmin ─────────────────────────
function sha256(text: string) {
  return createHash('sha256').update(text).digest('hex')
}
async function isAdmin(c: any): Promise<boolean> {
  const t = c.req.header('X-Admin-Token')
  if (!t?.startsWith('admin-token-')) return false
  const admin = await dbFirst('SELECT id FROM admins WHERE current_token = ?', [t])
  return !!admin
}

// ── 한글 → 영문 이름 추출 ────────────────────
function extractEnglishName(name: string): string {
  if (!name) return ''
  if (!/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(name)) return name
  const parenMatch = name.match(/\(([A-Za-z][^)]+)\)/)
  if (parenMatch) return parenMatch[1].trim()
  const tokens = name.split(/\s+/).filter(t => /^[A-Za-z0-9&'.,-]+$/.test(t))
  if (tokens.length > 0) return tokens.join(' ').trim()
  return name
}

async function fetchPlaceDetails(placeId: string, apiKey: string) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,rating,photos&key=${apiKey}&language=en`
  const res  = await fetch(url)
  const data: any = await res.json()
  const r = data.result
  if (!r) return null
  const name = extractEnglishName(r.name || '')
  return { place_id: r.place_id, name, address: r.formatted_address || '', rating: r.rating || 0, photo: r.photos?.[0]?.photo_reference || '' }
}

// ── Startup Migration ──────────────────────────
async function runMigrations() {
  const migrations = [
    `ALTER TABLE applications ADD COLUMN scheduled_date TEXT`,
    `ALTER TABLE applications ADD COLUMN settlement INTEGER DEFAULT 0`,
    `ALTER TABLE admins ADD COLUMN current_token TEXT`,
  ]
  for (const sql of migrations) {
    try { await dbRun(sql) } catch (_) { /* 이미 컬럼 존재 시 무시 */ }
  }
}
runMigrations().catch(console.error)

// ── HTML imports ──────────────────────────────
import { mainPageHTML }        from '../src/pages/main'
import { adminLoginHTML }      from '../src/pages/adminLogin'
import { adminDashboardHTML }  from '../src/pages/adminDashboard'
import { clinicShareHTML }     from '../src/pages/clinicShare'
import { clinicLoginHTML }     from '../src/pages/clinicLogin'
import { clinicDashboardHTML } from '../src/pages/clinicDashboard'

// ── App ───────────────────────────────────────
const app = new Hono()
app.use('/api/*', cors())
app.get('/favicon.ico', (c) => new Response(null, { status: 204 }))

// Pages
app.get('/', async (c) => {
  try {
    const campaigns = await dbAll('SELECT * FROM campaigns WHERE status = ? ORDER BY created_at DESC', ['active'])
    return c.html(mainPageHTML(campaigns))
  } catch {
    return c.html(mainPageHTML([]))
  }
})
app.get('/admin',            (c) => c.html(adminLoginHTML()))
app.get('/admin/dashboard',  (c) => c.html(adminDashboardHTML()))
app.get('/clinic/:id',       (c) => c.html(clinicShareHTML()))
app.get('/clinic-login',     (c) => c.html(clinicLoginHTML()))
app.get('/clinic-dashboard', (c) => c.html(clinicDashboardHTML()))

// ── Campaigns ─────────────────────────────────
app.get('/api/campaigns', async (c) => {
  try {
    const rows = await dbAll('SELECT * FROM campaigns WHERE status = ? ORDER BY created_at DESC', ['active'])
    return c.json({ success: true, data: rows })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})
app.get('/api/campaigns/:id', async (c) => {
  try {
    const row = await dbFirst('SELECT * FROM campaigns WHERE id = ?', [c.req.param('id')])
    if (!row) return c.json({ success: false, error: 'Not found' }, 404)
    return c.json({ success: true, data: row })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Google Places ─────────────────────────────
app.post('/api/places/resolve', async (c) => {
  const { url } = await c.req.json<{ url: string }>()
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return c.json({ success: false, error: 'Google API key not configured' }, 500)
  let finalUrl = url
  try {
    if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
      const r = await fetch(url, { redirect: 'follow' })
      finalUrl = r.url
    }
    const pidMatch = finalUrl.match(/[?&]place_id=([^&]+)/)
    if (pidMatch) {
      const place = await fetchPlaceDetails(pidMatch[1], apiKey)
      return place ? c.json({ success: true, data: place }) : c.json({ success: false, error: 'Place not found' }, 404)
    }
    const nameMatch = finalUrl.match(/\/place\/([^/@]+)/)
    const q = nameMatch ? decodeURIComponent(nameMatch[1].replace(/\+/g, ' ')) : ''
    if (!q) return c.json({ success: false, error: 'Could not parse URL' }, 400)
    const sRes  = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q)}&key=${apiKey}&language=en`)
    const sData: any = await sRes.json()
    const first = sData.results?.[0]
    if (!first) return c.json({ success: false, error: 'No results found' }, 404)
    const place = await fetchPlaceDetails(first.place_id, apiKey)
    return place ? c.json({ success: true, data: place }) : c.json({ success: false, error: 'Place not found' }, 404)
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})
app.get('/api/places/photo', async (c) => {
  const ref = c.req.query('ref')
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey || !ref) return c.json({ success: false, error: 'Missing params' }, 400)
  const res = await fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${apiKey}`)
  const buf = await res.arrayBuffer()
  return new Response(buf, { headers: { 'Content-Type': res.headers.get('content-type') || 'image/jpeg', 'Cache-Control': 'public, max-age=86400' } })
})

// ── Apply ─────────────────────────────────────
app.post('/api/apply', async (c) => {
  try {
    const body = await c.req.json()
    const { campaign_id, applicant_name, nationality, email, phone, instagram, preferred_dates, message } = body
    if (!campaign_id || !applicant_name || !nationality || !email || !instagram || !preferred_dates)
      return c.json({ success: false, error: 'Please fill in all required fields.' }, 400)

    const existing = await dbFirst(
      'SELECT id FROM applications WHERE campaign_id = ? AND (instagram = ? OR email = ?)',
      [campaign_id, instagram, email]
    )
    if (existing) return c.json({ success: false, error: 'You have already applied to this campaign.' }, 400)

    const campaign: any = await dbFirst('SELECT * FROM campaigns WHERE id = ?', [campaign_id])
    if (!campaign) return c.json({ success: false, error: 'Campaign not found.' }, 404)
    if (campaign.current_participants >= campaign.max_participants)
      return c.json({ success: false, error: 'This campaign is now full.' }, 400)

    await dbRun(
      `INSERT INTO applications (campaign_id,campaign_title,place_name,applicant_name,nationality,email,phone,instagram,preferred_dates,message) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [campaign_id, campaign.title, campaign.place_name, applicant_name, nationality, email, phone||'', instagram, preferred_dates, message||'']
    )
    const updResult = await dbRun(
      'UPDATE campaigns SET current_participants = current_participants + 1 WHERE id = ? AND current_participants < max_participants',
      [campaign_id]
    )
    if (updResult.rowsAffected === 0) {
      await dbRun('DELETE FROM applications WHERE campaign_id = ? AND instagram = ? AND email = ?', [campaign_id, instagram, email])
      return c.json({ success: false, error: 'This campaign is now full.' }, 400)
    }

    const tok = process.env.TELEGRAM_BOT_TOKEN, cid = process.env.TELEGRAM_CHAT_ID
    if (tok && cid) {
      const msg = `🔔 <b>New Application!</b>\n\n📋 <b>Campaign:</b> ${campaign.title}\n👤 <b>Name:</b> ${applicant_name}\n🌏 <b>Nationality:</b> ${nationality}\n📧 <b>Email:</b> ${email}\n📱 <b>WhatsApp:</b> ${phone||'—'}\n📸 <b>Instagram:</b> @${instagram}\n📅 <b>Dates:</b>\n${preferred_dates}${message?'\n💬 '+message:''}`
      fetch(`https://api.telegram.org/bot${tok}/sendMessage`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: cid, text: msg, parse_mode:'HTML' }) }).catch(()=>{})
    }
    return c.json({ success: true, message: 'Thank you for your application! The clinic will review your submission and contact you directly if they decide to proceed.' })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Clinic Share 비밀번호 검증 API ────────────
app.post('/api/clinic/verify', async (c) => {
  try {
    const { slug, password, token } = await c.req.json()
    if (!slug) return c.json({ success: false, error: 'slug required.' }, 400)

    // 슬러그 또는 숫자 ID 또는 share_token으로 캠페인 검색
    let campaign: any = null
    if (/^\d+$/.test(slug)) {
      campaign = await dbFirst('SELECT * FROM campaigns WHERE id = ?', [slug])
    }
    if (!campaign && token) {
      campaign = await dbFirst('SELECT * FROM campaigns WHERE share_token = ?', [token])
    }
    if (!campaign) {
      // 슬러그: place_name_ko 또는 place_name 변환으로 매칭
      const rows = await dbAll("SELECT * FROM campaigns WHERE status = 'active'")
      campaign = rows.find((r: any) => makeSlug(r.place_name_ko || r.place_name) === slug) || null
    }
    if (!campaign) return c.json({ success: false, error: '업체를 찾을 수 없습니다.' }, 404)

    // 비밀번호 확인 (share_token으로 온 경우도 비번 필요)
    if (!campaign.clinic_password) return c.json({ success: false, error: '비밀번호가 설정되지 않았습니다.' }, 403)
    const hashed = sha256(password || '')
    if (campaign.clinic_password !== hashed && campaign.clinic_password_plain !== (password || ''))
      return c.json({ success: false, error: '비밀번호가 올바르지 않습니다.' }, 401)

    const apps = await dbAll(
      'SELECT id,applicant_name,nationality,email,phone,instagram,preferred_dates,message,status,scheduled_date,settlement,created_at FROM applications WHERE campaign_id = ? ORDER BY created_at DESC',
      [campaign.id]
    )
    return c.json({ success: true, campaign_id: campaign.id, campaign: sanitize(campaign), applications: sanitize(apps) })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Clinic Login (업체 로그인) ────────────────
app.post('/api/clinic/login', async (c) => {
  try {
    const { clinic_id, password } = await c.req.json()
    if (!clinic_id || !password) return c.json({ success: false, error: 'clinic_id and password are required.' }, 400)

    let campaign: any = null
    if (/^\d+$/.test(clinic_id)) {
      campaign = await dbFirst('SELECT * FROM campaigns WHERE id = ?', [clinic_id])
    }
    if (!campaign) {
      campaign = await dbFirst(
        "SELECT * FROM campaigns WHERE (place_name_ko = ? OR place_name = ?) AND status = 'active' LIMIT 1",
        [clinic_id, clinic_id]
      )
    }
    if (!campaign) return c.json({ success: false, error: '업체를 찾을 수 없습니다.' }, 404)
    if (!campaign.clinic_password) return c.json({ success: false, error: '이 업체는 아직 로그인 비밀번호가 설정되지 않았습니다.' }, 403)

    const hashed = sha256(password)
    if (campaign.clinic_password !== hashed && campaign.clinic_password !== password)
      return c.json({ success: false, error: '비밀번호가 올바르지 않습니다.' }, 401)

    const token = 'clinic-token-' + randomUUID()
    await dbRun('UPDATE campaigns SET clinic_session_token = ? WHERE id = ?', [token, campaign.id])
    return c.json({ success: true, token, campaign_id: campaign.id })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// 업체 세션 인증 헬퍼
async function isClinic(c: any): Promise<any | null> {
  const t   = c.req.header('X-Clinic-Token')
  const cid = c.req.query('campaign_id')
  if (!t || !cid) return null
  const campaign = await dbFirst('SELECT * FROM campaigns WHERE id = ? AND clinic_session_token = ?', [cid, t])
  return campaign || null
}

// 업체 대시보드 API
app.get('/api/clinic/dashboard', async (c) => {
  try {
    const campaign = await isClinic(c)
    if (!campaign) return c.json({ success: false, error: '세션이 만료되었습니다. 다시 로그인해주세요.' }, 401)
    const apps = await dbAll(
      'SELECT id,applicant_name,nationality,email,phone,instagram,preferred_dates,message,status,scheduled_date,settlement,created_at FROM applications WHERE campaign_id = ? ORDER BY created_at DESC',
      [campaign.id]
    )
    return c.json({ success: true, campaign: sanitize(campaign), applications: sanitize(apps) })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// 업체 신청자 상태 변경 API (approve / reject)
app.patch('/api/clinic/applications/:id', async (c) => {
  try {
    const appId = c.req.param('id')
    const { status, campaign_id } = await c.req.json()
    if (!['approved','rejected','pending'].includes(status))
      return c.json({ success: false, error: 'Invalid status.' }, 400)
    const t = c.req.header('X-Clinic-Token')
    if (!t || !campaign_id) return c.json({ success: false, error: 'Unauthorized.' }, 401)
    const campaign = await dbFirst('SELECT id FROM campaigns WHERE id = ? AND clinic_session_token = ?', [campaign_id, t])
    if (!campaign) return c.json({ success: false, error: '세션이 만료되었습니다.' }, 401)
    const appRow = await dbFirst('SELECT id FROM applications WHERE id = ? AND campaign_id = ?', [appId, campaign_id])
    if (!appRow) return c.json({ success: false, error: 'Application not found.' }, 404)
    await dbRun('UPDATE applications SET status = ? WHERE id = ?', [status, appId])
    return c.json({ success: true })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Clinic Share: 공유링크 신청자 상태 변경 (slug+password 인증) ──
app.patch('/api/clinic/share/applications/:id', async (c) => {
  try {
    const appId = c.req.param('id')
    const { slug, password, status, settlement } = await c.req.json()
    if (!slug || !password) return c.json({ success: false, error: 'slug and password required.' }, 400)
    if (status === undefined && settlement === undefined)
      return c.json({ success: false, error: 'status or settlement required.' }, 400)
    if (status !== undefined && !['approved','rejected','pending'].includes(status))
      return c.json({ success: false, error: 'Invalid status.' }, 400)

    // slug → campaign 검색
    let campaign: any = null
    if (/^\d+$/.test(slug)) {
      campaign = await dbFirst('SELECT * FROM campaigns WHERE id = ?', [slug])
    }
    if (!campaign) {
      const rows = await dbAll("SELECT * FROM campaigns WHERE status = 'active'")
      campaign = rows.find((r: any) => makeSlug(r.place_name_ko || r.place_name) === slug) || null
    }
    if (!campaign) return c.json({ success: false, error: '업체를 찾을 수 없습니다.' }, 404)

    // 비밀번호 확인
    if (!campaign.clinic_password) return c.json({ success: false, error: '비밀번호가 설정되지 않았습니다.' }, 403)
    const hashed = sha256(password)
    if (campaign.clinic_password !== hashed && campaign.clinic_password_plain !== password)
      return c.json({ success: false, error: '비밀번호가 올바르지 않습니다.' }, 401)

    // 신청자가 이 캠페인 소속인지 확인
    const appRow2 = await dbFirst('SELECT id FROM applications WHERE id = ? AND campaign_id = ?', [appId, campaign.id])
    if (!appRow2) return c.json({ success: false, error: 'Application not found.' }, 404)

    if (settlement !== undefined) {
      await dbRun('UPDATE applications SET settlement = ? WHERE id = ?', [settlement ? 1 : 0, appId])
    } else {
      await dbRun('UPDATE applications SET status = ? WHERE id = ?', [status, appId])
    }
    return c.json({ success: true })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Clinic Share ──────────────────────────────
app.get('/api/clinic/:id', async (c) => {
  try {
    const id    = c.req.param('id')
    const token = c.req.query('token')
    if (!token) return c.json({ success: false, error: 'Token required.' }, 401)
    const campaign: any = await dbFirst('SELECT * FROM campaigns WHERE id = ?', [id])
    if (!campaign) return c.json({ success: false, error: 'Campaign not found.' }, 404)
    if (campaign.share_token !== token) return c.json({ success: false, error: 'Invalid token.' }, 401)
    const apps = await dbAll(
      'SELECT a.id,a.applicant_name,a.nationality,a.email,a.phone,a.instagram,a.preferred_dates,a.scheduled_date,a.message,a.status,a.created_at,a.campaign_title,a.place_name,c.place_name_ko FROM applications a LEFT JOIN campaigns c ON a.campaign_id = c.id WHERE a.campaign_id = ? ORDER BY a.created_at DESC',
      [id]
    )
    return c.json({ success: true, campaign: sanitize(campaign), applications: sanitize(apps) })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Admin Login ───────────────────────────────
app.post('/api/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    const hashed = sha256(password)
    let admin = await dbFirst(
      'SELECT * FROM admins WHERE username = ? AND password_hash = ?',
      [username, hashed]
    )
    if (!admin) {
      admin = await dbFirst(
        'SELECT * FROM admins WHERE username = ? AND password_hash = ?',
        [username, password]
      )
      if (admin) await dbRun('UPDATE admins SET password_hash = ? WHERE id = ?', [hashed, admin.id])
    }
    if (!admin) return c.json({ success: false, error: 'Invalid username or password.' }, 401)
    const token = 'admin-token-' + randomUUID()
    await dbRun('UPDATE admins SET current_token = ? WHERE id = ?', [token, admin.id])
    return c.json({ success: true, token })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Admin Applications ────────────────────────
app.get('/api/admin/applications', async (c) => {
  if (!await isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const cid = c.req.query('campaign_id'), st = c.req.query('status')
    let q = 'SELECT a.*, c.place_name_ko FROM applications a LEFT JOIN campaigns c ON a.campaign_id = c.id'
    const params: any[] = [], conds: string[] = []
    if (cid) { conds.push('a.campaign_id = ?'); params.push(cid) }
    if (st)  { conds.push('a.status = ?');      params.push(st) }
    if (conds.length) q += ' WHERE ' + conds.join(' AND ')
    q += ' ORDER BY a.created_at DESC'
    return c.json({ success: true, data: await dbAll(q, params) })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.patch('/api/admin/applications/:id', async (c) => {
  if (!await isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const body = await c.req.json()
    const { status, scheduled_date, settlement } = body
    const id = c.req.param('id')
    // settlement 토글 전용
    if (settlement !== undefined && status === undefined && scheduled_date === undefined) {
      await dbRun('UPDATE applications SET settlement = ? WHERE id = ?', [settlement ? 1 : 0, id])
    } else if (scheduled_date !== undefined) {
      await dbRun(
        'UPDATE applications SET status = ?, scheduled_date = ? WHERE id = ?',
        [status || 'approved', scheduled_date, id]
      )
    } else {
      await dbRun('UPDATE applications SET status = ? WHERE id = ?', [status, id])
    }
    return c.json({ success: true })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Admin Campaigns ───────────────────────────
app.get('/api/admin/campaigns', async (c) => {
  if (!await isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const rows = await dbAll(`SELECT id,title,description,place_id,place_name,place_name_ko,place_address,place_photo_ref,place_rating,category,max_participants,current_participants,deadline,benefits,requirements,status,created_at,share_token,clinic_password,clinic_password_plain FROM campaigns ORDER BY created_at DESC`)
    const safeRows = rows.map((r: any) => ({
      ...r,
      clinic_password: r.clinic_password ? true : false,
      clinic_password_plain: r.clinic_password_plain || null,
    }))
    return c.json({ success: true, data: safeRows })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.post('/api/admin/campaigns', async (c) => {
  if (!await isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const b = await c.req.json()
    const placeName  = extractEnglishName(b.place_name || '')
    const title      = extractEnglishName(b.title || '')
    const shareToken  = 'sbt-' + Date.now() + '-' + Math.random().toString(36).slice(2,8)
    const rawPw        = genClinicPassword()
    const hashedPw     = sha256(rawPw)
    const r = await dbRun(
      `INSERT INTO campaigns (title,description,place_id,place_name,place_address,place_photo_ref,place_rating,category,max_participants,deadline,benefits,requirements,share_token,clinic_password,clinic_password_plain) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [title, b.description||'', b.place_id, placeName, b.place_address||'', b.place_photo_ref||'', b.place_rating||0, b.category||'Clinic', b.max_participants||9999, b.deadline||'', b.benefits||'', b.requirements||'', shareToken, hashedPw, rawPw]
    )
    return c.json({ success: true, id: Number(r.lastInsertRowid), clinic_password: rawPw })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.patch('/api/admin/campaigns/:id', async (c) => {
  if (!await isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const b = await c.req.json()
    const fields: string[] = [], vals: any[] = []
    const allowed = ['title','description','benefits','requirements','category','place_name','deadline','max_participants','status','clinic_password','clinic_password_plain']
    for (const key of allowed) {
      if (key in b) {
        let v: any = b[key]
        if (key === 'place_name' || key === 'title') v = extractEnglishName(String(v))
        if (key === 'clinic_password' && v) {
          const plainPw = String(v)
          fields.push('clinic_password_plain = ?'); vals.push(plainPw)
          v = sha256(plainPw)
        }
        fields.push(`${key} = ?`); vals.push(v)
      }
    }
    if (!fields.length) return c.json({ success: false, error: 'No fields to update' }, 400)
    vals.push(c.req.param('id'))
    await dbRun(`UPDATE campaigns SET ${fields.join(', ')} WHERE id = ?`, vals)
    return c.json({ success: true })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.delete('/api/admin/campaigns/:id', async (c) => {
  if (!await isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    await dbRun('UPDATE campaigns SET status = ? WHERE id = ?', ['inactive', c.req.param('id')])
    return c.json({ success: true })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Admin Telegram test ───────────────────────
app.post('/api/admin/telegram/test', async (c) => {
  if (!await isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const tok = process.env.TELEGRAM_BOT_TOKEN, cid = process.env.TELEGRAM_CHAT_ID
    if (!tok || !cid) return c.json({ success: false, error: 'Telegram not configured' }, 400)
    const msg = `✅ <b>Seoul Beauty Trip</b>\nTelegram connected! 🕐 ${new Date().toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})}`
    const r = await fetch(`https://api.telegram.org/bot${tok}/sendMessage`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: cid, text: msg, parse_mode:'HTML' }) })
    const data: any = await r.json()
    return c.json({ success: data.ok, error: data.description })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Vercel handler ────────────────────────────
export const config = { api: { bodyParser: false } }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url    = `https://${req.headers.host}${req.url}`
  const method = req.method || 'GET'

  const bodyBuf: Buffer = await new Promise((resolve) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
  })

  const fetchReq = new Request(url, {
    method,
    headers: req.headers as Record<string, string>,
    body: ['GET','HEAD'].includes(method) ? undefined : (bodyBuf as unknown as BodyInit),
  })

  const fetchRes = await app.fetch(fetchReq)
  res.status(fetchRes.status)
  fetchRes.headers.forEach((v, k) => res.setHeader(k, v))
  const buf = Buffer.from(await fetchRes.arrayBuffer())
  res.end(buf)
}
