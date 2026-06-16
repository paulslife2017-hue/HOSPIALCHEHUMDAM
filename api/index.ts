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
    // 배열 형태일 때 columns로 객체 변환
    const cols = rs.columns || []
    rows = rs.rows.map((row: any) => {
      const obj: any = {}
      cols.forEach((col: string, i: number) => { obj[col] = row[i] })
      return obj
    })
  }
  // BigInt 포함 값 모두 안전하게 변환
  return sanitize(rows)
}
async function dbFirst(sql: string, args: any[] = []) {
  const rows = await dbAll(sql, args)
  return rows[0] ?? null
}
async function dbRun(sql: string, args: any[] = []) {
  const db = getDB()
  const rs = await db.execute({ sql, args })
  // Turso는 lastInsertRowid / rowsAffected 를 BigInt로 반환 → Number 변환
  return {
    lastInsertRowid: rs.lastInsertRowid != null ? Number(rs.lastInsertRowid) : null,
    rowsAffected:    rs.rowsAffected    != null ? Number(rs.rowsAffected)    : 0,
  }
}

// ── HTML imports ──────────────────────────────
import { mainPageHTML }      from '../src/pages/main'
import { adminLoginHTML }    from '../src/pages/adminLogin'
import { adminDashboardHTML } from '../src/pages/adminDashboard'
import { clinicShareHTML }   from '../src/pages/clinicShare'

// ── App ───────────────────────────────────────
const app = new Hono()
app.use('/api/*', cors())
app.get('/favicon.ico', (c) => new Response(null, { status: 204 }))

// Pages
app.get('/', async (c) => {
  // SSR: 캠페인 데이터를 HTML에 직접 임베드 → 클라이언트 API 왕복 제거
  try {
    const campaigns = await dbAll('SELECT * FROM campaigns WHERE status = ? ORDER BY created_at DESC', ['active'])
    return c.html(mainPageHTML(campaigns))
  } catch {
    return c.html(mainPageHTML([]))
  }
})
app.get('/admin',           (c) => c.html(adminLoginHTML()))
app.get('/admin/dashboard', (c) => c.html(adminDashboardHTML()))
app.get('/clinic/:id',      (c) => c.html(clinicShareHTML()))

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

// 한글 포함 이름에서 영문 부분만 추출
function extractEnglishName(name: string): string {
  if (!name) return ''
  // 한글 없으면 그대로
  if (!/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(name)) return name
  // 괄호 안 영문 우선 추출: e.g. "리을 피부과의원(Lieul Dermatology Clinic)"
  const parenMatch = name.match(/\(([A-Za-z][^)]+)\)/)
  if (parenMatch) return parenMatch[1].trim()
  // 공백 기준으로 영문 토큰만 이어붙이기
  const tokens = name.split(/\s+/).filter(t => /^[A-Za-z0-9&'.,-]+$/.test(t))
  if (tokens.length > 0) return tokens.join(' ').trim()
  return name
}

// 한글 주소 → 영문 주소 (language=en 으로 재조회)
async function fetchPlaceDetails(placeId: string, apiKey: string) {
  // language=en 으로 영문 데이터 조회
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,rating,photos&key=${apiKey}&language=en`
  const res  = await fetch(url)
  const data: any = await res.json()
  const r = data.result
  if (!r) return null
  const rawName = r.name || ''
  const name = extractEnglishName(rawName)
  return { place_id: r.place_id, name, address: r.formatted_address || '', rating: r.rating || 0, photo: r.photos?.[0]?.photo_reference || '' }
}

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

    // 중복 신청: instagram 또는 email 기준으로 체크
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
    // Race condition 방지: current_participants < max_participants 조건부 UPDATE
    const updResult = await dbRun(
      'UPDATE campaigns SET current_participants = current_participants + 1 WHERE id = ? AND current_participants < max_participants',
      [campaign_id]
    )
    if (updResult.rowsAffected === 0) {
      // 방금 삽입한 신청 롤백 (선착순 초과)
      await dbRun('DELETE FROM applications WHERE campaign_id = ? AND instagram = ? AND email = ?', [campaign_id, instagram, email])
      return c.json({ success: false, error: 'This campaign is now full.' }, 400)
    }

    // Telegram 알림
    const tok = process.env.TELEGRAM_BOT_TOKEN, cid = process.env.TELEGRAM_CHAT_ID
    if (tok && cid) {
      const msg = `🔔 <b>New Application!</b>\n\n📋 <b>Campaign:</b> ${campaign.title}\n👤 <b>Name:</b> ${applicant_name}\n🌏 <b>Nationality:</b> ${nationality}\n📧 <b>Email:</b> ${email}\n📱 <b>WhatsApp:</b> ${phone||'—'}\n📸 <b>Instagram:</b> @${instagram}\n📅 <b>Dates:</b>\n${preferred_dates}${message?'\n💬 '+message:''}`
      fetch(`https://api.telegram.org/bot${tok}/sendMessage`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: cid, text: msg, parse_mode:'HTML' }) }).catch(()=>{})
    }
    return c.json({ success: true, message: 'Thank you for your application! The clinic will review your submission and contact you directly if they decide to proceed.' })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Clinic Share (공유 링크용, 토큰 인증) ──────
app.get('/api/clinic/:id', async (c) => {
  try {
    const id    = c.req.param('id')
    const token = c.req.query('token')
    if (!token) return c.json({ success: false, error: 'Token required.' }, 401)
    const campaign: any = await dbFirst('SELECT * FROM campaigns WHERE id = ?', [id])
    if (!campaign) return c.json({ success: false, error: 'Campaign not found.' }, 404)
    if (campaign.share_token !== token) return c.json({ success: false, error: 'Invalid token.' }, 401)
    const apps = await dbAll('SELECT a.id,a.applicant_name,a.nationality,a.email,a.phone,a.instagram,a.preferred_dates,a.scheduled_date,a.message,a.status,a.created_at,a.campaign_title,a.place_name,c.place_name_ko FROM applications a LEFT JOIN campaigns c ON a.campaign_id = c.id WHERE a.campaign_id = ? ORDER BY a.created_at DESC', [id])
    return c.json({ success: true, campaign: sanitize(campaign), applications: sanitize(apps) })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Admin ─────────────────────────────────────
// SHA-256 헬퍼: 비밀번호 해싱에 사용
function sha256(text: string) {
  return createHash('sha256').update(text).digest('hex')
}

// isAdmin: X-Admin-Token 헤더를 DB에 저장된 토큰과 대조
async function isAdmin(c: any): Promise<boolean> {
  const t = c.req.header('X-Admin-Token')
  if (!t?.startsWith('admin-token-')) return false
  // DB의 current_token 컬럼과 정확히 일치해야 통과
  const admin = await dbFirst('SELECT id FROM admins WHERE current_token = ?', [t])
  return !!admin
}

app.post('/api/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    // password_hash 컬럼은 SHA-256 해시값으로 저장된다고 가정
    // (기존 DB가 평문이라면 sha256() 제거하고 점진적으로 마이그레이션)
    const hashed = sha256(password)
    // 해시 비교 우선, 실패 시 평문 비교(마이그레이션 기간 호환성 유지)
    let admin = await dbFirst(
      'SELECT * FROM admins WHERE username = ? AND password_hash = ?',
      [username, hashed]
    )
    if (!admin) {
      // 평문으로도 한 번 더 시도 (기존 레코드 마이그레이션 기간)
      admin = await dbFirst(
        'SELECT * FROM admins WHERE username = ? AND password_hash = ?',
        [username, password]
      )
      if (admin) {
        // 평문으로 로그인 성공 → DB를 해시값으로 업그레이드
        await dbRun('UPDATE admins SET password_hash = ? WHERE id = ?', [hashed, admin.id])
      }
    }
    if (!admin) return c.json({ success: false, error: 'Invalid username or password.' }, 401)
    // 토큰: 예측 불가한 UUID 사용
    const token = 'admin-token-' + randomUUID()
    // 토큰을 DB에 저장 (isAdmin에서 DB 대조)
    await dbRun('UPDATE admins SET current_token = ? WHERE id = ?', [token, admin.id])
    return c.json({ success: true, token })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.get('/api/admin/applications', async (c) => {
  if (!await isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const cid = c.req.query('campaign_id'), st = c.req.query('status')
    let q = 'SELECT a.*, c.place_name_ko FROM applications a LEFT JOIN campaigns c ON a.campaign_id = c.id', params: any[] = [], conds: string[] = []
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
    const { status, scheduled_date } = body
    if (scheduled_date !== undefined) {
      // 날짜 확정 + 승인 동시 처리
      await dbRun(
        'UPDATE applications SET status = ?, scheduled_date = ? WHERE id = ?',
        [status || 'approved', scheduled_date, c.req.param('id')]
      )
    } else {
      await dbRun('UPDATE applications SET status = ? WHERE id = ?', [status, c.req.param('id')])
    }
    return c.json({ success: true })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.get('/api/admin/campaigns', async (c) => {
  if (!await isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try { return c.json({ success: true, data: await dbAll('SELECT * FROM campaigns ORDER BY created_at DESC') }) }
  catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.post('/api/admin/campaigns', async (c) => {
  if (!await isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const b = await c.req.json()
    // 한글 업체명/타이틀 → 무조건 영문으로 저장
    const placeName = extractEnglishName(b.place_name || '')
    const title     = extractEnglishName(b.title || '')
    const shareToken = 'sbt-' + Date.now() + '-' + Math.random().toString(36).slice(2,8)
    const r = await dbRun(
      `INSERT INTO campaigns (title,description,place_id,place_name,place_address,place_photo_ref,place_rating,category,max_participants,deadline,benefits,requirements,share_token) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [title, b.description||'', b.place_id, placeName, b.place_address||'', b.place_photo_ref||'', b.place_rating||0, b.category||'Clinic', b.max_participants||9999, b.deadline||'', b.benefits||'', b.requirements||'', shareToken]
    )
    return c.json({ success: true, id: Number(r.lastInsertRowid) })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.patch('/api/admin/campaigns/:id', async (c) => {
  if (!await isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const b = await c.req.json()
    const fields: string[] = []
    const vals:   any[]    = []
    const allowed = ['title','description','benefits','requirements','category','place_name','deadline','max_participants','status']
    for (const key of allowed) {
      if (key in b) {
        // place_name, title 한글 포함 시 영문 추출
        const v = (key === 'place_name' || key === 'title') ? extractEnglishName(String(b[key])) : b[key]
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
  try { await dbRun('UPDATE campaigns SET status = ? WHERE id = ?', ['inactive', c.req.param('id')]); return c.json({ success: true }) }
  catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Vercel handler ────────────────────────────
export const config = { api: { bodyParser: false } }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url    = `https://${req.headers.host}${req.url}`
  const method = req.method || 'GET'

  // body를 Buffer로 읽기
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
