import * as http from 'http'
import * as fs from 'fs'

// .env.local 로드
const envPath = '/home/user/webapp/.env.local'
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const idx = line.indexOf('=')
    if (idx > 0) {
      const k = line.slice(0, idx).trim()
      const v = line.slice(idx + 1).trim()
      if (k) process.env[k] = v
    }
  })
}

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@libsql/client/http'
import { mainPageHTML } from './src/pages/main'
import { adminLoginHTML } from './src/pages/adminLogin'
import { adminDashboardHTML } from './src/pages/adminDashboard'

function getDB() {
  const url   = process.env.TURSO_DATABASE_URL!
  const token = process.env.TURSO_AUTH_TOKEN || ''
  if (!url) throw new Error('TURSO_DATABASE_URL is not set')
  return createClient({ url, authToken: token })
}

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

const app = new Hono()
app.use('/api/*', cors())
app.get('/favicon.ico', (c) => new Response(null, { status: 204 }))

app.get('/', async (c) => {
  try {
    const campaigns = await dbAll('SELECT * FROM campaigns WHERE status = ? ORDER BY created_at DESC', ['active'])
    return c.html(mainPageHTML(campaigns))
  } catch {
    return c.html(mainPageHTML([]))
  }
})
app.get('/admin',           (c) => c.html(adminLoginHTML()))
app.get('/admin/dashboard', (c) => c.html(adminDashboardHTML()))

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

function isAdmin(c: any) { const t = c.req.header('X-Admin-Token'); return t?.startsWith('admin-token-') }

app.post('/api/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    const admin = await dbFirst('SELECT * FROM admins WHERE username = ? AND password_hash = ?', [username, password])
    if (!admin) return c.json({ success: false, error: 'Invalid credentials.' }, 401)
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
      [b.title, b.description, b.place_id, b.place_name, b.place_address||'', b.place_photo_ref||'', b.place_rating||0, b.category||'Clinic', b.max_participants||10, b.deadline, b.benefits||'', b.requirements||'']
    )
    return c.json({ success: true, id: r.lastInsertRowid })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.delete('/api/admin/campaigns/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try { await dbRun('UPDATE campaigns SET status = ? WHERE id = ?', ['inactive', c.req.param('id')]); return c.json({ success: true }) }
  catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

async function fetchPlaceDetails(placeId: string, apiKey: string) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,rating,photos&key=${apiKey}&language=en`
  const res = await fetch(url)
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
    const sRes = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q)}&key=${apiKey}&language=en`)
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
    return c.json({ success: true, message: 'Application submitted!' })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// HTTP 서버
const server = http.createServer(async (req: any, res: any) => {
  const url    = `http://localhost:3000${req.url}`
  const method = req.method || 'GET'
  const bodyBuf: Buffer = await new Promise((resolve) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
  })
  const fetchReq = new Request(url, {
    method,
    headers: req.headers as Record<string, string>,
    body: ['GET','HEAD'].includes(method) ? undefined : (bodyBuf.length ? bodyBuf : undefined) as any,
  })
  const fetchRes = await app.fetch(fetchReq)
  res.statusCode = fetchRes.status
  fetchRes.headers.forEach((v: string, k: string) => res.setHeader(k, v))
  const buf = Buffer.from(await fetchRes.arrayBuffer())
  res.end(buf)
})

server.listen(3000, '0.0.0.0', () => {
  console.log('Seoul Beauty Trip running on http://localhost:3000')
})
