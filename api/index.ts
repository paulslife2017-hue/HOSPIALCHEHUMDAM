import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@libsql/client/http'

// ── Turso DB ──────────────────────────────────
function getDB() {
  const url   = process.env.TURSO_DATABASE_URL!
  const token = process.env.TURSO_AUTH_TOKEN || ''
  if (!url) throw new Error('TURSO_DATABASE_URL is not set')
  return createClient({ url, authToken: token })
}

async function dbAll(sql: string, args: any[] = []) {
  const db = getDB()
  const rs = await db.execute({ sql, args })
  // rows가 객체면 그대로, 배열이면 columns와 매핑해서 객체로 변환
  if (!rs.rows || rs.rows.length === 0) return []
  const first = rs.rows[0]
  if (typeof first === 'object' && !Array.isArray(first)) {
    return rs.rows as any[]
  }
  // 배열 형태일 때 columns로 객체 변환
  const cols = rs.columns || []
  return rs.rows.map((row: any) => {
    const obj: any = {}
    cols.forEach((col: string, i: number) => { obj[col] = row[i] })
    return obj
  })
}
async function dbFirst(sql: string, args: any[] = []) {
  const rows = await dbAll(sql, args)
  return rows[0] ?? null
}
async function dbRun(sql: string, args: any[] = []) {
  const db = getDB()
  return db.execute({ sql, args })
}

// ── HTML imports ──────────────────────────────
import { mainPageHTML }      from '../src/pages/main'
import { adminLoginHTML }    from '../src/pages/adminLogin'
import { adminDashboardHTML } from '../src/pages/adminDashboard'

// ── App ───────────────────────────────────────
const app = new Hono()
app.use('/api/*', cors())
app.get('/favicon.ico', (c) => new Response(null, { status: 204 }))

// Pages
app.get('/',                (c) => c.html(mainPageHTML()))
app.get('/admin',           (c) => c.html(adminLoginHTML()))
app.get('/admin/dashboard', (c) => c.html(adminDashboardHTML()))

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
async function fetchPlaceDetails(placeId: string, apiKey: string) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,rating,photos&key=${apiKey}&language=en`
  const res  = await fetch(url)
  const data: any = await res.json()
  const r = data.result
  if (!r) return null
  return { place_id: r.place_id, name: r.name, address: r.formatted_address || '', rating: r.rating || 0, photo: r.photos?.[0]?.photo_reference || '' }
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

    const existing = await dbFirst('SELECT id FROM applications WHERE campaign_id = ? AND instagram = ?', [campaign_id, instagram])
    if (existing) return c.json({ success: false, error: 'You have already applied to this campaign.' }, 400)

    const campaign: any = await dbFirst('SELECT * FROM campaigns WHERE id = ?', [campaign_id])
    if (!campaign) return c.json({ success: false, error: 'Campaign not found.' }, 404)
    if (campaign.current_participants >= campaign.max_participants)
      return c.json({ success: false, error: 'This campaign is now full.' }, 400)

    await dbRun(
      `INSERT INTO applications (campaign_id,campaign_title,place_name,applicant_name,nationality,email,phone,instagram,preferred_dates,message) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [campaign_id, campaign.title, campaign.place_name, applicant_name, nationality, email, phone||'', instagram, preferred_dates, message||'']
    )
    await dbRun('UPDATE campaigns SET current_participants = current_participants + 1 WHERE id = ?', [campaign_id])

    // Telegram 알림
    const tok = process.env.TELEGRAM_BOT_TOKEN, cid = process.env.TELEGRAM_CHAT_ID
    if (tok && cid) {
      const msg = `🔔 <b>New Application!</b>\n\n📋 <b>Campaign:</b> ${campaign.title}\n👤 <b>Name:</b> ${applicant_name}\n🌏 <b>Nationality:</b> ${nationality}\n📧 <b>Email:</b> ${email}\n📱 <b>WhatsApp:</b> ${phone||'—'}\n📸 <b>Instagram:</b> @${instagram}\n📅 <b>Dates:</b>\n${preferred_dates}${message?'\n💬 '+message:''}`
      fetch(`https://api.telegram.org/bot${tok}/sendMessage`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: cid, text: msg, parse_mode:'HTML' }) }).catch(()=>{})
    }
    return c.json({ success: true, message: 'Application submitted! We will contact you soon.' })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── Admin ─────────────────────────────────────
function isAdmin(c: any) { const t = c.req.header('X-Admin-Token'); return t?.startsWith('admin-token-') }

app.post('/api/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    const admin = await dbFirst('SELECT * FROM admins WHERE username = ? AND password_hash = ?', [username, password])
    if (!admin) return c.json({ success: false, error: 'Invalid username or password.' }, 401)
    return c.json({ success: true, token: 'admin-token-' + Date.now() })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.get('/api/admin/applications', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const cid = c.req.query('campaign_id'), st = c.req.query('status')
    let q = 'SELECT * FROM applications', params: any[] = [], conds: string[] = []
    if (cid) { conds.push('campaign_id = ?'); params.push(cid) }
    if (st)  { conds.push('status = ?');      params.push(st) }
    if (conds.length) q += ' WHERE ' + conds.join(' AND ')
    q += ' ORDER BY created_at DESC'
    return c.json({ success: true, data: await dbAll(q, params) })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.patch('/api/admin/applications/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const { status } = await c.req.json()
    await dbRun('UPDATE applications SET status = ? WHERE id = ?', [status, c.req.param('id')])
    return c.json({ success: true })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.get('/api/admin/campaigns', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try { return c.json({ success: true, data: await dbAll('SELECT * FROM campaigns ORDER BY created_at DESC') }) }
  catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.post('/api/admin/campaigns', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const b = await c.req.json()
    const r = await dbRun(
      `INSERT INTO campaigns (title,description,place_id,place_name,place_address,place_photo_ref,place_rating,category,max_participants,deadline,benefits,requirements) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [b.title, b.description||'', b.place_id, b.place_name, b.place_address||'', b.place_photo_ref||'', b.place_rating||0, b.category||'Clinic', b.max_participants||9999, b.deadline||'', b.benefits||'', b.requirements||'']
    )
    return c.json({ success: true, id: r.lastInsertRowid })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.delete('/api/admin/campaigns/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
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
