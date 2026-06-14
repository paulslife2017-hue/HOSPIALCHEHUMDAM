import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database
  GOOGLE_PLACES_API_KEY: string
  TELEGRAM_BOT_TOKEN: string
  TELEGRAM_CHAT_ID: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './' }))
app.get('/favicon.ico', (c) => new Response(null, { status: 204 }))

// ── Pages ─────────────────────────────────────
app.get('/', (c) => c.html(mainPageHTML()))
app.get('/admin', (c) => c.html(adminLoginHTML()))
app.get('/admin/dashboard', (c) => c.html(adminDashboardHTML()))

// ── API: Campaigns ────────────────────────────
app.get('/api/campaigns', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM campaigns WHERE status = ? ORDER BY created_at DESC'
    ).bind('active').all()
    return c.json({ success: true, data: results })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.get('/api/campaigns/:id', async (c) => {
  try {
    const campaign = await c.env.DB.prepare('SELECT * FROM campaigns WHERE id = ?').bind(c.req.param('id')).first()
    if (!campaign) return c.json({ success: false, error: 'Not found' }, 404)
    return c.json({ success: true, data: campaign })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── API: Google Places ────────────────────────

// Extract place_id from any Google Maps URL (short or full)
async function resolvePlaceIdFromUrl(mapsUrl: string, apiKey: string): Promise<{ place_id: string; name: string; address: string; rating: number; photo: string } | null> {
  try {
    // Follow redirects to get final URL
    let finalUrl = mapsUrl
    if (mapsUrl.includes('maps.app.goo.gl') || mapsUrl.includes('goo.gl/maps')) {
      const r = await fetch(mapsUrl, { redirect: 'follow' })
      finalUrl = r.url
    }

    // Try to extract place_id from URL directly
    const pidMatch = finalUrl.match(/[?&]place_id=([^&]+)/)
    if (pidMatch) {
      return await fetchPlaceDetails(pidMatch[1], apiKey)
    }

    // Extract coordinates or place name from URL
    const coordMatch = finalUrl.match(/@(-?[\d.]+),(-?[\d.]+)/)
    const nameMatch  = finalUrl.match(/\/place\/([^/@]+)/)
    
    let searchQuery = ''
    if (nameMatch) {
      searchQuery = decodeURIComponent(nameMatch[1].replace(/\+/g, ' '))
    } else if (coordMatch) {
      searchQuery = `${coordMatch[1]},${coordMatch[2]}`
    }
    if (!searchQuery) return null

    // Search by name/coords
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}&language=en`
    const sRes  = await fetch(searchUrl)
    const sData: any = await sRes.json()
    const first = sData.results?.[0]
    if (!first) return null
    return await fetchPlaceDetails(first.place_id, apiKey)
  } catch { return null }
}

async function fetchPlaceDetails(placeId: string, apiKey: string) {
  const fields = 'place_id,name,formatted_address,rating,photos'
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}&language=en`
  const res  = await fetch(url)
  const data: any = await res.json()
  const r = data.result
  if (!r) return null
  return {
    place_id: r.place_id,
    name:     r.name,
    address:  r.formatted_address || '',
    rating:   r.rating || 0,
    photo:    r.photos?.[0]?.photo_reference || '',
  }
}

// POST /api/places/resolve  body: { url: "https://maps.app.goo.gl/..." }
app.post('/api/places/resolve', async (c) => {
  const { url } = await c.req.json<{ url: string }>()
  if (!url) return c.json({ success: false, error: 'URL required' }, 400)
  const apiKey = c.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return c.json({ success: false, error: 'Google API key not configured' }, 500)
  const place = await resolvePlaceIdFromUrl(url, apiKey)
  if (!place) return c.json({ success: false, error: 'Could not resolve place from this URL' }, 400)
  return c.json({ success: true, data: place })
})

app.get('/api/places/photo', async (c) => {
  const ref = c.req.query('ref')
  const apiKey = c.env.GOOGLE_PLACES_API_KEY
  if (!apiKey || !ref) return c.json({ success: false, error: 'Missing params' }, 400)
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${apiKey}`
  const res = await fetch(url)
  const buf = await res.arrayBuffer()
  return new Response(buf, {
    headers: { 'Content-Type': res.headers.get('content-type') || 'image/jpeg', 'Cache-Control': 'public, max-age=86400' }
  })
})

// ── Telegram helper ───────────────────────────
async function sendTelegram(token: string, chatId: string, text: string) {
  if (!token || !chatId) return
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    })
  } catch {}
}

// ── API: Apply ────────────────────────────────
app.post('/api/apply', async (c) => {
  try {
    const body = await c.req.json()
    const { campaign_id, applicant_name, nationality, email, phone, instagram, preferred_dates, message } = body

    if (!campaign_id || !applicant_name || !nationality || !email || !instagram || !preferred_dates) {
      return c.json({ success: false, error: 'Please fill in all required fields.' }, 400)
    }

    const existing = await c.env.DB.prepare(
      'SELECT id FROM applications WHERE campaign_id = ? AND instagram = ?'
    ).bind(campaign_id, instagram).first()
    if (existing) return c.json({ success: false, error: 'You have already applied to this campaign.' }, 400)

    const campaign: any = await c.env.DB.prepare('SELECT * FROM campaigns WHERE id = ?').bind(campaign_id).first()
    if (!campaign) return c.json({ success: false, error: 'Campaign not found.' }, 404)
    if (campaign.current_participants >= campaign.max_participants) {
      return c.json({ success: false, error: 'This campaign is now full.' }, 400)
    }

    await c.env.DB.prepare(
      `INSERT INTO applications (campaign_id, campaign_title, place_name, applicant_name, nationality, email, phone, instagram, preferred_dates, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(campaign_id, campaign.title, campaign.place_name, applicant_name, nationality, email, phone || '', instagram, preferred_dates, message || '').run()

    await c.env.DB.prepare('UPDATE campaigns SET current_participants = current_participants + 1 WHERE id = ?').bind(campaign_id).run()

    // 텔레그램 알림 전송
    const tgMsg = `🔔 <b>New Application!</b>\n\n` +
      `📋 <b>Campaign:</b> ${campaign.title}\n` +
      `🏥 <b>Place:</b> ${campaign.place_name}\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👤 <b>Name:</b> ${applicant_name}\n` +
      `🌏 <b>Nationality:</b> ${nationality}\n` +
      `📧 <b>Email:</b> ${email}\n` +
      `📱 <b>WhatsApp:</b> ${phone || '—'}\n` +
      `📸 <b>Instagram:</b> @${instagram}\n` +
      `📅 <b>Available Dates:</b>\n${preferred_dates}\n` +
      (message ? `💬 <b>Message:</b> ${message}\n` : '') +
      `━━━━━━━━━━━━━━━\n` +
      `🕐 ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`

    await sendTelegram(c.env.TELEGRAM_BOT_TOKEN, c.env.TELEGRAM_CHAT_ID, tgMsg)

    return c.json({ success: true, message: 'Application submitted! We will contact you soon.' })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── API: Admin login ──────────────────────────
app.post('/api/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    const admin = await c.env.DB.prepare(
      'SELECT * FROM admins WHERE username = ? AND password_hash = ?'
    ).bind(username, password).first()
    if (!admin) return c.json({ success: false, error: 'Invalid username or password.' }, 401)
    return c.json({ success: true, token: 'admin-token-' + Date.now() })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── API: Admin applications ───────────────────
app.get('/api/admin/applications', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const cid = c.req.query('campaign_id')
    const st  = c.req.query('status')
    let q = 'SELECT * FROM applications'
    const params: any[] = []
    const conds: string[] = []
    if (cid) { conds.push('campaign_id = ?'); params.push(cid) }
    if (st)  { conds.push('status = ?');      params.push(st) }
    if (conds.length) q += ' WHERE ' + conds.join(' AND ')
    q += ' ORDER BY created_at DESC'
    const stmt = c.env.DB.prepare(q)
    const { results } = await (params.length ? stmt.bind(...params) : stmt).all()
    return c.json({ success: true, data: results })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.patch('/api/admin/applications/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const { status } = await c.req.json()
    await c.env.DB.prepare('UPDATE applications SET status = ? WHERE id = ?').bind(status, c.req.param('id')).run()
    return c.json({ success: true })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// ── API: Admin campaigns ──────────────────────
app.get('/api/admin/campaigns', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM campaigns ORDER BY created_at DESC').all()
    return c.json({ success: true, data: results })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.post('/api/admin/campaigns', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const b = await c.req.json()
    const r = await c.env.DB.prepare(
      `INSERT INTO campaigns (title, description, place_id, place_name, place_address, place_photo_ref, place_rating, category, max_participants, deadline, benefits, requirements)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(b.title, b.description, b.place_id, b.place_name, b.place_address||'', b.place_photo_ref||'', b.place_rating||0, b.category||'Clinic', b.max_participants||10, b.deadline, b.benefits||'', b.requirements||'').run()
    return c.json({ success: true, id: r.meta.last_row_id })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

app.delete('/api/admin/campaigns/:id', async (c) => {
  if (!isAdmin(c)) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    await c.env.DB.prepare('UPDATE campaigns SET status = ? WHERE id = ?').bind('inactive', c.req.param('id')).run()
    return c.json({ success: true })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

function isAdmin(c: any) {
  const t = c.req.header('X-Admin-Token')
  return t && t.startsWith('admin-token-')
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════
function mainPageHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seoul Beauty & Medical — Influencer Program</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family:'Inter',sans-serif; background:#f8f7f5; }
    .serif { font-family:'Playfair Display',serif; }
    .card-hover { transition:transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s; }
    .card-hover:hover { transform:translateY(-6px); box-shadow:0 24px 48px rgba(0,0,0,.10); }
    .modal-overlay { display:none; position:fixed; inset:0; background:rgba(10,10,10,.6); z-index:999; backdrop-filter:blur(6px); }
    .modal-overlay.active { display:flex; align-items:center; justify-content:center; }
    .progress-bar { height:4px; background:#e5e7eb; border-radius:99px; overflow:hidden; }
    .progress-fill { height:100%; background:linear-gradient(90deg,#b5935a,#d4af7a); border-radius:99px; }
    .pill { display:inline-block; padding:3px 11px; border-radius:99px; font-size:11px; font-weight:600; letter-spacing:.3px; }
    .filter-btn { border:1.5px solid #e2ddd6; color:#888; transition:all .2s; background:#fff; font-size:13px; }
    .filter-btn.active { border-color:#b5935a; background:#fdf8f0; color:#8a6d3b; }
    .date-chip { display:inline-flex; align-items:center; gap:4px; background:#fdf8f0; border:1px solid #e8d9bf; color:#8a6d3b; border-radius:8px; padding:4px 10px; font-size:12px; font-weight:500; }
    .date-chip button { color:#c9a96e; line-height:1; background:none; border:none; cursor:pointer; font-size:14px; padding:0 0 0 2px; }
    .time-select { border:1px solid #e2ddd6; border-radius:8px; padding:7px 8px; font-size:12px; color:#374151; background:#fff; cursor:pointer; }
    .time-select:focus { outline:none; border-color:#b5935a; }
    input:focus, textarea:focus, select:focus { outline:none; border-color:#b5935a !important; box-shadow:0 0 0 3px rgba(181,147,90,.12); }
    .btn-gold { background:linear-gradient(135deg,#c9a035,#e8c16a); color:#fff; font-weight:600; transition:all .2s; }
    .btn-gold:hover { background:linear-gradient(135deg,#b5900a,#d4aa50); box-shadow:0 4px 16px rgba(181,147,90,.35); }
    .hero-bg { background:linear-gradient(135deg,#0a0a0a 0%,#1a1209 50%,#0d0d0d 100%); }
    ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#f1f1f1; } ::-webkit-scrollbar-thumb { background:#d4b896; border-radius:99px; }
  </style>
</head>
<body class="min-h-screen">

<!-- Nav -->
<nav class="bg-white/95 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50 shadow-sm">
  <div class="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
        <i class="fas fa-star text-white text-xs"></i>
      </div>
      <div>
        <span class="font-bold text-gray-900 text-sm tracking-wide">SEOUL BEAUTY TRIP</span>
        <span class="hidden sm:inline text-gray-300 mx-2">·</span>
        <span class="hidden sm:inline text-xs text-gray-400">Influencer Experience Program</span>
      </div>
    </a>
    <a href="/admin" class="text-xs text-gray-300 hover:text-gray-500 transition-colors">Admin</a>
  </div>
</nav>

<!-- Hero -->
<section class="hero-bg text-white py-20 px-5 relative overflow-hidden">
  <div class="absolute inset-0 opacity-5" style="background-image:url('data:image/svg+xml,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M30 5 L55 20 L55 40 L30 55 L5 40 L5 20Z\" fill=\"none\" stroke=\"white\" stroke-width=\"0.5\"/></svg>'); background-size:60px;"></div>
  <div class="max-w-6xl mx-auto relative">
    <div class="max-w-2xl">
      <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium text-amber-300 mb-6 backdrop-blur-sm">
        <span class="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
        Exclusive for International Creators
      </div>
      <h1 class="serif text-4xl sm:text-5xl font-bold leading-tight mb-5">
        Experience Seoul's<br>
        <span style="background:linear-gradient(90deg,#c9a035,#f0d080);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Premium Clinics</span>
      </h1>
      <p class="text-stone-300 text-base leading-relaxed mb-8 max-w-lg">
        Get complimentary treatments at Seoul's top-rated medical &amp; wellness clinics. Share your authentic experience with your audience.
      </p>
      <div class="flex flex-wrap gap-5 text-sm text-stone-300">
        <div class="flex items-center gap-2"><i class="fas fa-check-circle text-amber-400"></i> Free treatments</div>
        <div class="flex items-center gap-2"><i class="fas fa-check-circle text-amber-400"></i> English support</div>
        <div class="flex items-center gap-2"><i class="fas fa-check-circle text-amber-400"></i> All nationalities welcome</div>
      </div>
    </div>
  </div>
</section>

<!-- Filter -->
<div class="bg-white border-b border-stone-100 sticky top-16 z-40 shadow-sm">
  <div class="max-w-6xl mx-auto px-5 py-3 flex gap-2 overflow-x-auto scrollbar-none">
    <button onclick="filterBy('all')" data-f="all" class="filter-btn active whitespace-nowrap px-4 py-2 rounded-full font-medium">All</button>
    <button onclick="filterBy('Clinic')" data-f="Clinic" class="filter-btn whitespace-nowrap px-4 py-2 rounded-full font-medium">🏥 Clinic</button>
    <button onclick="filterBy('Beauty Shop')" data-f="Beauty Shop" class="filter-btn whitespace-nowrap px-4 py-2 rounded-full font-medium">💄 Beauty Shop</button>
  </div>
</div>

<!-- Campaigns -->
<main class="max-w-6xl mx-auto px-5 py-10">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2 class="text-lg font-bold text-gray-900">Open Programs</h2>
      <p class="text-sm text-gray-400 mt-0.5">Apply now — limited spots available</p>
    </div>
    <div id="campaignCount" class="text-xs text-gray-400 bg-stone-100 px-3 py-1.5 rounded-full"></div>
  </div>
  <div id="loading" class="flex flex-col items-center justify-center py-24 gap-3">
    <div class="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
    <p class="text-sm text-gray-400">Loading programs...</p>
  </div>
  <div id="grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 hidden"></div>
  <div id="empty" class="hidden text-center py-24">
    <div class="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <i class="fas fa-search text-2xl text-stone-300"></i>
    </div>
    <p class="text-gray-400 font-medium">No programs found</p>
    <p class="text-sm text-gray-300 mt-1">Try a different category</p>
  </div>
</main>

<!-- Footer -->
<footer class="border-t border-stone-200 bg-white mt-8 py-8 px-5">
  <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
    <div class="flex items-center gap-2">
      <div class="w-6 h-6 rounded-md flex items-center justify-center" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
        <i class="fas fa-star text-white text-xs" style="font-size:8px"></i>
      </div>
      <span class="text-sm font-semibold text-gray-700">Seoul Beauty Trip</span>
    </div>
    <p class="text-xs text-gray-400">© 2025 Seoul Beauty Trip · Influencer Experience Program</p>
  </div>
</footer>

<!-- Apply Modal -->
<div id="applyModal" class="modal-overlay">
  <div class="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
    <div class="px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0" style="background:linear-gradient(135deg,#0a0a0a,#1a1209)">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="font-bold text-white text-base">Apply for Program</h3>
          <p id="applySubtitle" class="text-xs text-amber-300/80 mt-0.5 truncate max-w-xs"></p>
        </div>
        <button onclick="closeApply()" class="text-white/40 hover:text-white/80 ml-4 transition-colors">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    <form id="applyForm" class="px-6 py-5 space-y-4 overflow-y-auto flex-1">
      <input type="hidden" id="applyCapId">

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1.5">Full Name <span class="text-red-400">*</span></label>
          <input id="fName" type="text" placeholder="Your name" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1.5">Nationality <span class="text-red-400">*</span></label>
          <select id="fNation" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
            <option value="">Select</option>
            <option>🇺🇸 American</option><option>🇬🇧 British</option><option>🇦🇺 Australian</option>
            <option>🇨🇦 Canadian</option><option>🇯🇵 Japanese</option><option>🇨🇳 Chinese</option>
            <option>🇹🇼 Taiwanese</option><option>🇭🇰 Hong Konger</option><option>🇹🇭 Thai</option>
            <option>🇻🇳 Vietnamese</option><option>🇵🇭 Filipino</option><option>🇮🇩 Indonesian</option>
            <option>🇲🇾 Malaysian</option><option>🇸🇬 Singaporean</option><option>🇮🇳 Indian</option>
            <option>🇫🇷 French</option><option>🇩🇪 German</option><option>🇧🇷 Brazilian</option>
            <option>🇲🇽 Mexican</option><option>🇷🇺 Russian</option><option>🇸🇦 Saudi</option>
            <option>🇳🇱 Dutch</option><option>🇮🇹 Italian</option><option>🇪🇸 Spanish</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1.5">Email <span class="text-red-400">*</span></label>
          <input id="fEmail" type="email" placeholder="your@email.com" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1.5"><i class="fab fa-whatsapp text-green-500 mr-1"></i>WhatsApp</label>
          <input id="fPhone" type="text" placeholder="+1-000-0000" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-500 mb-1.5"><i class="fab fa-instagram text-pink-500 mr-1"></i>Instagram <span class="text-red-400">*</span></label>
        <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2" style="focus-within:border-color:#b5935a">
          <span class="px-3 text-gray-400 text-sm bg-gray-50 border-r border-gray-200 py-2.5 select-none">@</span>
          <input id="fInsta" type="text" placeholder="your_handle" class="flex-1 px-3 py-2.5 text-sm border-none outline-none" required>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-500 mb-1.5"><i class="far fa-calendar text-amber-500 mr-1"></i>Available Dates &amp; Times <span class="text-red-400">*</span></label>
        <p class="text-xs text-gray-400 mb-2">Add up to 5 slots — clinic will confirm one.</p>
        <div class="flex gap-2 items-center flex-wrap">
          <input id="dateInput" type="date" class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm" style="flex:1;min-width:130px">
          <select id="timeInput" class="time-select">
            <option value="09:00">9:00 AM</option><option value="09:30">9:30 AM</option>
            <option value="10:00">10:00 AM</option><option value="10:30">10:30 AM</option>
            <option value="11:00">11:00 AM</option><option value="11:30">11:30 AM</option>
            <option value="12:00">12:00 PM</option><option value="12:30">12:30 PM</option>
            <option value="13:00">1:00 PM</option><option value="13:30">1:30 PM</option>
            <option value="14:00">2:00 PM</option><option value="14:30">2:30 PM</option>
            <option value="15:00">3:00 PM</option><option value="15:30">3:30 PM</option>
            <option value="16:00">4:00 PM</option><option value="16:30">4:30 PM</option>
            <option value="17:00">5:00 PM</option><option value="17:30">5:30 PM</option>
            <option value="18:00">6:00 PM</option>
          </select>
          <button type="button" onclick="addDate()" class="btn-gold px-4 py-2 rounded-xl text-sm whitespace-nowrap">+ Add</button>
        </div>
        <div id="dateChips" class="flex flex-wrap gap-2 mt-2 min-h-[28px]"></div>
        <input type="hidden" id="fDates">
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-500 mb-1.5">Message <span class="text-gray-300 font-normal">(optional)</span></label>
        <textarea id="fMsg" rows="2" placeholder="Any notes for the clinic..." class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"></textarea>
      </div>

      <div id="applyErr" class="hidden bg-red-50 text-red-600 text-xs rounded-xl px-4 py-3 border border-red-100"></div>
      <div id="applyOk"  class="hidden bg-green-50 text-green-700 text-xs rounded-xl px-4 py-3 border border-green-100"></div>

      <button type="submit" class="btn-gold w-full py-3 rounded-xl text-sm">Submit Application</button>
      <p class="text-center text-xs text-gray-300">The clinic will reach out to confirm your slot.</p>
    </form>
  </div>
</div>

<!-- Detail Modal -->
<div id="detailModal" class="modal-overlay">
  <div class="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
    <div id="detailContent"></div>
  </div>
</div>

<script>
let allCampaigns = []
let selectedDates = []

async function loadCampaigns() {
  try {
    const res = await fetch('/api/campaigns')
    const { data } = await res.json()
    allCampaigns = data || []
    render(allCampaigns)
  } catch {
    document.getElementById('loading').innerHTML = '<p class="text-red-400 text-sm text-center py-10">Failed to load.</p>'
  }
}

function render(list) {
  const loading = document.getElementById('loading')
  const grid    = document.getElementById('grid')
  const empty   = document.getElementById('empty')
  const count   = document.getElementById('campaignCount')
  loading.classList.add('hidden')
  count.textContent = list.length + ' program' + (list.length !== 1 ? 's' : '')
  if (!list.length) { grid.classList.add('hidden'); empty.classList.remove('hidden'); return }
  empty.classList.add('hidden'); grid.classList.remove('hidden')

  const catColors = {
    Clinic:         { bg:'#dbeafe', text:'#1d4ed8' },
    'Beauty Shop':  { bg:'#fce7f3', text:'#be185d' },
  }

  grid.innerHTML = list.map(c => {
    const full  = c.current_participants >= c.max_participants
    const pct   = Math.min(100, Math.round((c.current_participants / c.max_participants) * 100))
    const thumb = c.place_photo_ref ? \`/api/places/photo?ref=\${c.place_photo_ref}\` : ''
    const col   = catColors[c.category] || { bg:'#f3f4f6', text:'#374151' }
    const dl    = c.deadline ? new Date(c.deadline).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : 'Open'
    const spotsLeft = c.max_participants - c.current_participants
    return \`
    <article class="card-hover bg-white rounded-2xl overflow-hidden border border-stone-100 cursor-pointer group" onclick="openDetail(\${c.id})">
      <div class="relative h-48 bg-stone-100 overflow-hidden">
        \${thumb
          ? \`<img src="\${thumb}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="\${c.place_name}" onerror="this.parentElement.innerHTML='<div class=\\"w-full h-full flex items-center justify-center bg-stone-100\\"><i class=\\"fas fa-clinic-medical text-5xl text-stone-300\\"></i></div>'">\`
          : \`<div class="w-full h-full flex items-center justify-center bg-stone-100"><i class="fas fa-clinic-medical text-5xl text-stone-300"></i></div>\`}
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        \${full ? '<div class="absolute inset-0 bg-black/50 flex items-center justify-center"><span class="bg-white/20 backdrop-blur text-white text-xs font-bold px-4 py-1.5 rounded-full border border-white/30">FULLY BOOKED</span></div>' : ''}
        <div class="absolute top-3 left-3">
          <span class="pill text-xs" style="background:\${col.bg};color:\${col.text}">\${c.category}</span>
        </div>
        \${c.place_rating ? \`<div class="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1"><span class="text-amber-400 text-xs">★</span><span class="text-white text-xs font-semibold">\${c.place_rating}</span></div>\` : ''}
      </div>
      <div class="p-5">
        <p class="text-xs text-gray-400 mb-1 flex items-center gap-1"><i class="fas fa-map-marker-alt text-red-400"></i>\${c.place_name}</p>
        <h3 class="font-semibold text-gray-900 text-sm mb-3 line-clamp-2 leading-snug">\${c.title}</h3>
        \${c.benefits ? \`<p class="text-xs text-stone-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3 line-clamp-1"><i class="fas fa-gift text-amber-500 mr-1.5"></i>\${c.benefits}</p>\` : ''}
        <div class="space-y-1.5 mb-4">
          <div class="flex justify-between text-xs">
            <span class="text-gray-400">\${c.current_participants}/\${c.max_participants} applicants</span>
            <span class="font-semibold \${full?'text-red-400':'text-amber-600'}">\${full?'Full':spotsLeft+' left'}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:\${pct}%"></div></div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1 text-xs text-gray-400">
            <i class="far fa-calendar"></i>
            <span>Until \${dl}</span>
          </div>
          <button onclick="event.stopPropagation(); openApply(\${c.id})" \${full?'disabled':''} class="\${full?'bg-gray-100 text-gray-300 cursor-not-allowed':'btn-gold'} px-4 py-1.5 rounded-xl text-xs font-semibold transition-all">
            \${full ? 'Full' : 'Apply Now'}
          </button>
        </div>
      </div>
    </article>\`
  }).join('')
}

function filterBy(cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.f === cat))
  render(cat === 'all' ? allCampaigns : allCampaigns.filter(c => c.category === cat))
}

async function openDetail(id) {
  const { data: c } = await (await fetch('/api/campaigns/' + id)).json()
  const full  = c.current_participants >= c.max_participants
  const pct   = Math.min(100, Math.round((c.current_participants / c.max_participants) * 100))
  const thumb = c.place_photo_ref ? \`/api/places/photo?ref=\${c.place_photo_ref}\` : ''
  const dl    = c.deadline ? new Date(c.deadline).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) : 'Open'
  document.getElementById('detailContent').innerHTML = \`
    <div class="relative">
      <div class="h-56 bg-stone-100">
        \${thumb ? \`<img src="\${thumb}" class="w-full h-full object-cover">\` : \`<div class="w-full h-full flex items-center justify-center bg-stone-100"><i class="fas fa-clinic-medical text-6xl text-stone-300"></i></div>\`}
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      </div>
      <button onclick="closeDetail()" class="absolute top-4 right-4 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition">
        <i class="fas fa-times text-sm"></i>
      </button>
      <div class="absolute bottom-4 left-5 text-white">
        <p class="text-xs text-white/70 mb-1"><i class="fas fa-map-marker-alt mr-1 text-red-400"></i>\${c.place_name}</p>
        <h2 class="font-bold text-xl leading-tight">\${c.title}</h2>
      </div>
    </div>
    <div class="p-6 space-y-5">
      <div class="flex flex-wrap gap-2">
        <span class="pill bg-stone-100 text-stone-600">\${c.category}</span>
        \${c.place_rating ? \`<span class="pill bg-amber-50 text-amber-700">★ \${c.place_rating}</span>\` : ''}
        <span class="pill bg-stone-100 text-stone-500">\${c.current_participants}/\${c.max_participants} spots</span>
      </div>
      \${c.place_address ? \`<p class="text-sm text-gray-500 flex items-start gap-2"><i class="fas fa-location-dot text-red-400 mt-0.5"></i><span>\${c.place_address}</span></p>\` : ''}
      <div>
        <div class="flex justify-between text-xs mb-1.5"><span class="text-gray-400">Spots filled</span><span class="font-semibold \${full?'text-red-400':'text-amber-600'}">\${pct}%</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:\${pct}%"></div></div>
      </div>
      <p class="text-sm text-gray-600 leading-relaxed">\${c.description || ''}</p>
      \${c.benefits ? \`<div class="bg-amber-50 border border-amber-100 rounded-xl p-4"><p class="text-xs font-semibold text-amber-800 mb-1.5"><i class="fas fa-gift mr-1.5"></i>What You Get</p><p class="text-sm text-amber-900">\${c.benefits}</p></div>\` : ''}
      \${c.requirements ? \`<div class="bg-stone-50 rounded-xl p-4"><p class="text-xs font-semibold text-stone-500 mb-1.5"><i class="fas fa-circle-check mr-1.5"></i>Requirements</p><p class="text-sm text-stone-600">\${c.requirements}</p></div>\` : ''}
      <div class="flex items-center gap-2 text-xs text-gray-400 pb-1"><i class="far fa-calendar text-amber-500"></i>Application deadline: <span class="font-medium text-gray-600">\${dl}</span></div>
      \${!full
        ? \`<button onclick="closeDetail(); openApply(\${c.id})" class="btn-gold w-full py-3 rounded-xl text-sm">Apply Now</button>\`
        : \`<div class="w-full bg-stone-100 text-stone-400 font-semibold py-3 rounded-xl text-sm text-center">This program is fully booked</div>\`}
    </div>\`
  document.getElementById('detailModal').classList.add('active')
}
function closeDetail() { document.getElementById('detailModal').classList.remove('active') }

async function openApply(id) {
  const { data: c } = await (await fetch('/api/campaigns/' + id)).json()
  document.getElementById('applyCapId').value = id
  document.getElementById('applySubtitle').textContent = c.place_name + ' · ' + c.title
  document.getElementById('applyErr').classList.add('hidden')
  document.getElementById('applyOk').classList.add('hidden')
  document.getElementById('applyForm').reset()
  document.getElementById('applyCapId').value = id
  selectedDates = []
  renderDateChips()
  document.getElementById('dateInput').min = new Date().toISOString().split('T')[0]
  document.getElementById('timeInput').value = '10:00'
  document.getElementById('applyModal').classList.add('active')
}
function closeApply() { document.getElementById('applyModal').classList.remove('active') }

function addDate() {
  const dateVal = document.getElementById('dateInput').value
  const timeVal = document.getElementById('timeInput').value
  if (!dateVal) { alert('Please select a date.'); return }
  const key = dateVal + '|' + timeVal
  if (selectedDates.find(x => x.key === key)) return
  if (selectedDates.length >= 5) { alert('You can add up to 5 slots.'); return }
  selectedDates.push({ key, date: dateVal, time: timeVal })
  selectedDates.sort((a, b) => a.key.localeCompare(b.key))
  renderDateChips()
  document.getElementById('dateInput').value = ''
}
function removeDate(key) {
  selectedDates = selectedDates.filter(x => x.key !== key)
  renderDateChips()
}
function fmtTime(t) {
  const [hStr, mStr] = t.split(':')
  let h = parseInt(hStr), m = mStr
  const ampm = h >= 12 ? 'PM' : 'AM'
  if (h > 12) h -= 12
  if (h === 0) h = 12
  return h + ':' + m + ' ' + ampm
}
function renderDateChips() {
  const el = document.getElementById('dateChips')
  el.innerHTML = selectedDates.map(({ key, date, time }) => {
    const dateFmt = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
    const escapedKey = key.replace(/'/g, "\\\\'")
    return \`<span class="date-chip"><i class="far fa-clock text-amber-500 text-xs"></i>\${dateFmt} \${fmtTime(time)}<button type="button" onclick="removeDate('\${escapedKey}')" aria-label="remove">×</button></span>\`
  }).join('')
  document.getElementById('fDates').value = selectedDates.map(x => {
    const dateFmt = new Date(x.date + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
    return dateFmt + ' ' + fmtTime(x.time)
  }).join(' / ')
}

document.getElementById('applyForm').addEventListener('submit', async e => {
  e.preventDefault()
  const errEl = document.getElementById('applyErr')
  const okEl  = document.getElementById('applyOk')
  errEl.classList.add('hidden'); okEl.classList.add('hidden')
  if (selectedDates.length === 0) {
    errEl.textContent = 'Please add at least one available date & time.'
    errEl.classList.remove('hidden'); return
  }
  const body = {
    campaign_id: parseInt(document.getElementById('applyCapId').value),
    applicant_name: document.getElementById('fName').value.trim(),
    nationality: document.getElementById('fNation').value,
    email: document.getElementById('fEmail').value.trim(),
    phone: document.getElementById('fPhone').value.trim(),
    instagram: document.getElementById('fInsta').value.trim().replace(/^@/,''),
    preferred_dates: selectedDates.map(x => {
      const dateFmt = new Date(x.date + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
      return dateFmt + ' ' + fmtTime(x.time)
    }).join(' / '),
    message: document.getElementById('fMsg').value.trim(),
  }
  const btn = e.target.querySelector('button[type=submit]')
  btn.disabled = true; btn.textContent = 'Submitting...'
  try {
    const res  = await fetch('/api/apply', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.success) {
      okEl.innerHTML = '✅ ' + data.message
      okEl.classList.remove('hidden')
      btn.textContent = 'Done!'
      setTimeout(() => { closeApply(); loadCampaigns() }, 2200)
    } else {
      errEl.textContent = data.error; errEl.classList.remove('hidden')
      btn.disabled = false; btn.textContent = 'Submit Application'
    }
  } catch {
    errEl.textContent = 'Network error. Please try again.'
    errEl.classList.remove('hidden')
    btn.disabled = false; btn.textContent = 'Submit Application'
  }
})

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('active') })
})

loadCampaigns()
</script>
</body>
</html>`
}

// ════════════════════════════════════════════
// ADMIN LOGIN
// ════════════════════════════════════════════
function adminLoginHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Seoul Beauty Trip</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family:'Inter',sans-serif; }
    .serif { font-family:'Playfair Display',serif; }
    input:focus { outline:none; border-color:#c9a035 !important; box-shadow:0 0 0 3px rgba(201,160,53,.15); }
  </style>
</head>
<body class="min-h-screen flex" style="background:linear-gradient(135deg,#0a0a0a 0%,#1a1209 60%,#0d0d0d 100%)">
  <div class="m-auto w-full max-w-sm px-4">
    <div class="text-center mb-8">
      <div class="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center" style="background:linear-gradient(135deg,#c9a035,#e8c16a);box-shadow:0 8px 24px rgba(201,160,53,.3)">
        <i class="fas fa-star text-white text-xl"></i>
      </div>
      <h1 class="serif text-2xl text-white mb-1">Seoul Beauty Trip</h1>
      <p class="text-stone-500 text-sm">Admin Dashboard</p>
    </div>
    <div class="rounded-2xl p-6 border" style="background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.08);backdrop-filter:blur(12px)">
      <form id="loginForm" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-stone-400 mb-1.5">Username</label>
          <input id="uname" type="text" value="admin" class="w-full rounded-xl px-4 py-3 text-white text-sm border transition-all" style="background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.1)">
        </div>
        <div>
          <label class="block text-xs font-medium text-stone-400 mb-1.5">Password</label>
          <input id="pw" type="password" placeholder="••••••••" class="w-full rounded-xl px-4 py-3 text-white text-sm border transition-all" style="background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.1)">
        </div>
        <div id="loginErr" class="hidden text-red-400 text-xs text-center bg-red-950/50 rounded-xl py-2.5 px-3 border border-red-900/50"></div>
        <button type="submit" class="w-full font-semibold py-3 rounded-xl text-sm text-white transition-all mt-2" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
          Sign In
        </button>
      </form>
    </div>
    <div class="text-center mt-5">
      <a href="/" class="text-stone-600 hover:text-stone-400 text-xs transition-colors">← Back to site</a>
    </div>
  </div>
  <script>
    document.getElementById('loginForm').addEventListener('submit', async e => {
      e.preventDefault()
      const err = document.getElementById('loginErr')
      err.classList.add('hidden')
      const btn = e.target.querySelector('button')
      btn.disabled = true; btn.textContent = 'Signing in...'
      try {
        const res  = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username: document.getElementById('uname').value, password: document.getElementById('pw').value }) })
        const data = await res.json()
        if (data.success) { sessionStorage.setItem('adminToken', data.token); window.location.href = '/admin/dashboard' }
        else { err.textContent = data.error; err.classList.remove('hidden'); btn.disabled=false; btn.textContent='Sign In' }
      } catch { err.textContent='Network error'; err.classList.remove('hidden'); btn.disabled=false; btn.textContent='Sign In' }
    })
  </script>
</body>
</html>`
}

// ════════════════════════════════════════════
// ADMIN DASHBOARD
// ════════════════════════════════════════════
function adminDashboardHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { font-family:'Inter',sans-serif; }
    .tab-active { border-bottom:2px solid #2563eb; color:#2563eb; font-weight:600; }
    .s-pending  { background:#fef9c3; color:#854d0e; }
    .s-approved { background:#dcfce7; color:#166534; }
    .s-rejected { background:#fee2e2; color:#991b1b; }
    .modal-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:999; backdrop-filter:blur(3px); }
    .modal-overlay.active { display:flex; align-items:center; justify-content:center; }
    input:focus,select:focus,textarea:focus { outline:none; border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,.1); }
    .date-pill { display:inline-block; background:#eff6ff; border:1px solid #bfdbfe; color:#1d4ed8; border-radius:6px; padding:2px 8px; font-size:11px; font-weight:500; margin:2px; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">

<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
        <i class="fas fa-plus text-white text-xs"></i>
      </div>
      <span class="font-bold text-gray-900">Admin Dashboard</span>
    </div>
    <div class="flex items-center gap-3">
      <a href="/" target="_blank" class="text-xs text-gray-400 hover:text-gray-600">View site ↗</a>
      <button onclick="logout()" class="text-xs text-red-400 hover:text-red-500">Sign out</button>
    </div>
  </div>
</header>

<div class="bg-white border-b border-gray-200 sticky top-14 z-40">
  <div class="max-w-7xl mx-auto px-4 flex">
    <button id="tab-apps"  onclick="showTab('apps')"  class="tab-active px-5 py-3.5 text-sm text-gray-600 border-b-2">Applicants</button>
    <button id="tab-camps" onclick="showTab('camps')" class="px-5 py-3.5 text-sm text-gray-600 border-b-2 border-transparent">Campaigns</button>
    <button id="tab-new"   onclick="showTab('new')"   class="px-5 py-3.5 text-sm text-gray-600 border-b-2 border-transparent">+ New Campaign</button>
    <button id="tab-tg"    onclick="showTab('tg')"    class="px-5 py-3.5 text-sm text-gray-600 border-b-2 border-transparent">🤖 Telegram</button>
  </div>
</div>

<main class="max-w-7xl mx-auto px-4 py-6">

  <!-- Stats -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
    <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div class="text-2xl font-bold text-gray-900" id="s-total">-</div>
      <div class="text-xs text-gray-400 mt-0.5">Total Applicants</div>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div class="text-2xl font-bold text-amber-500" id="s-pending">-</div>
      <div class="text-xs text-gray-400 mt-0.5">Pending Review</div>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div class="text-2xl font-bold text-green-600" id="s-approved">-</div>
      <div class="text-xs text-gray-400 mt-0.5">Approved</div>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div class="text-2xl font-bold text-blue-600" id="s-camps">-</div>
      <div class="text-xs text-gray-400 mt-0.5">Active Campaigns</div>
    </div>
  </div>

  <!-- Applicants panel -->
  <div id="panel-apps">
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 class="font-semibold text-gray-900 text-sm">Applicants</h2>
        <div class="flex gap-2 flex-wrap">
          <select id="fCamp" onchange="loadApps()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs">
            <option value="">All campaigns</option>
          </select>
          <select id="fStatus" onchange="loadApps()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs">
            <option value="">All status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onclick="loadApps()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs hover:bg-gray-50">
            <i class="fas fa-sync-alt text-gray-400"></i>
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th class="text-left px-4 py-3">Applicant</th>
              <th class="text-left px-4 py-3 hidden sm:table-cell">Campaign</th>
              <th class="text-left px-4 py-3">Instagram</th>
              <th class="text-left px-4 py-3 hidden lg:table-cell">Available Dates</th>
              <th class="text-left px-4 py-3">Status</th>
              <th class="text-center px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody id="appsTable" class="divide-y divide-gray-50">
            <tr><td colspan="6" class="text-center py-10 text-xs text-gray-400">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Campaigns panel -->
  <div id="panel-camps" class="hidden">
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 class="font-semibold text-gray-900 text-sm">Campaigns</h2>
        <button onclick="showTab('new')" class="bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700">+ New</button>
      </div>
      <div id="campsContent" class="p-4"></div>
    </div>
  </div>

  <!-- New campaign panel -->
  <div id="panel-new" class="hidden">
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl">
      <h2 class="font-semibold text-gray-900 mb-1">New Campaign</h2>
      <p class="text-xs text-gray-400 mb-5">Paste a Google Maps link to auto-fill the place info.</p>

      <!-- Step 1: Google Maps URL -->
      <div class="mb-5">
        <label class="block text-xs font-semibold text-gray-600 mb-1">
          <i class="fab fa-google text-blue-500 mr-1"></i>Google Maps Link <span class="text-red-400">*</span>
        </label>
        <div class="flex gap-2">
          <input id="nc_maps_url" type="text" placeholder="https://maps.app.goo.gl/..." class="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white" oninput="onMapsUrlChange()">
          <button id="nc_resolve_btn" onclick="resolveMapsUrl()" class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 whitespace-nowrap flex items-center gap-1.5">
            <i class="fas fa-search text-xs"></i> Fetch
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-1">e.g. <span class="text-blue-500 cursor-pointer underline" onclick="document.getElementById('nc_maps_url').value='https://maps.app.goo.gl/8dfo2L1jhz1d8uYr9'">https://maps.app.goo.gl/8dfo2L1jhz1d8uYr9</span></p>
        <div id="nc_resolve_status" class="hidden mt-2 text-xs rounded-lg px-3 py-2"></div>
      </div>

      <!-- Place Preview Card (shown after fetch) -->
      <div id="placePreview" class="hidden mb-5 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4">
        <div id="previewThumb" class="w-16 h-16 rounded-xl bg-white overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-300 border border-gray-200 shadow-sm">
          <i class="fas fa-hospital text-2xl"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p id="previewName" class="font-bold text-gray-900 text-sm"></p>
          <p id="previewAddr" class="text-xs text-gray-500 mt-0.5 truncate"></p>
          <div class="flex items-center gap-2 mt-1.5">
            <span id="previewRating" class="text-xs text-amber-500 font-semibold"></span>
            <span class="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100">✓ Place confirmed</span>
          </div>
        </div>
        <button onclick="clearPlace()" class="text-gray-300 hover:text-red-400 text-xs flex-shrink-0"><i class="fas fa-times"></i></button>
      </div>

      <!-- Step 2: Campaign details (revealed after place confirmed) -->
      <form id="newCampForm" class="space-y-4">
        <input type="hidden" id="nc_place_id">
        <input type="hidden" id="nc_photo_ref">
        <input type="hidden" id="nc_rating">
        <input type="hidden" id="nc_place_name">
        <input type="hidden" id="nc_address">

        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Campaign Title <span class="text-red-400">*</span></label>
          <input id="nc_title" type="text" placeholder="e.g. Yonsei Midas Dental Experience" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Category</label>
            <select id="nc_category" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              <option>Clinic</option><option>Beauty Shop</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Max Applicants</label>
            <input id="nc_max" type="number" value="10" min="1" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Deadline</label>
          <input id="nc_deadline" type="date" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Description <span class="text-red-400">*</span></label>
          <textarea id="nc_desc" rows="3" placeholder="Describe the experience for applicants..." class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none" required></textarea>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Benefits</label>
          <input id="nc_benefits" type="text" placeholder="e.g. Free consultation + 30% off" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Requirements</label>
          <input id="nc_req" type="text" placeholder="e.g. Min. 3K followers" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
        </div>

        <div id="newCampErr" class="hidden bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100"></div>
        <div id="newCampOk"  class="hidden bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 border border-green-100"></div>
        <div class="flex gap-3">
          <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm">Create Campaign</button>
          <button type="button" onclick="resetNewForm()" class="px-5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium">Reset</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Telegram panel -->
  <div id="panel-tg" class="hidden">
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-xl">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
          <i class="fab fa-telegram text-white text-lg"></i>
        </div>
        <div>
          <h2 class="font-bold text-gray-900">Telegram Bot Setup</h2>
          <p class="text-xs text-gray-400">Get notified instantly when someone applies</p>
        </div>
      </div>

      <div class="space-y-4 mb-6">
        <div class="flex gap-3 p-3 bg-gray-50 rounded-xl">
          <div class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
          <div>
            <p class="text-sm font-medium text-gray-800">Create a bot</p>
            <p class="text-xs text-gray-500 mt-0.5">Open Telegram → search <code class="bg-gray-200 px-1 rounded">@BotFather</code> → send <code class="bg-gray-200 px-1 rounded">/newbot</code> → follow steps → copy the <b>Bot Token</b></p>
          </div>
        </div>
        <div class="flex gap-3 p-3 bg-gray-50 rounded-xl">
          <div class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
          <div>
            <p class="text-sm font-medium text-gray-800">Get your Chat ID</p>
            <p class="text-xs text-gray-500 mt-0.5">Send any message to your new bot → open <code class="bg-gray-200 px-1 rounded text-xs">https://api.telegram.org/bot<b>TOKEN</b>/getUpdates</code> → find <code class="bg-gray-200 px-1 rounded">chat.id</code></p>
          </div>
        </div>
        <div class="flex gap-3 p-3 bg-gray-50 rounded-xl">
          <div class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
          <div>
            <p class="text-sm font-medium text-gray-800">Add to .dev.vars</p>
            <p class="text-xs text-gray-500 mt-0.5">Add these two lines to your <code class="bg-gray-200 px-1 rounded">.dev.vars</code> file:</p>
            <pre class="bg-gray-900 text-green-400 rounded-lg p-3 text-xs mt-2 overflow-x-auto">TELEGRAM_BOT_TOKEN=7123456789:AAF...
TELEGRAM_CHAT_ID=123456789</pre>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-5">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Test Connection</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Bot Token</label>
            <input id="tgToken" type="text" placeholder="7123456789:AAFxxxx..." class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Chat ID</label>
            <input id="tgChatId" type="text" placeholder="123456789" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
          </div>
          <div id="tgResult" class="hidden text-sm rounded-xl px-4 py-3"></div>
          <button onclick="testTelegram()" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
            <i class="fab fa-telegram mr-2"></i>Send Test Message
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-3">* For production deployment, set these as Cloudflare secrets using <code>wrangler secret put</code></p>
      </div>
    </div>
  </div>

</main>

<!-- Applicant detail modal -->
<div id="appModal" class="modal-overlay">
  <div id="appModalContent" class="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl max-h-[90vh] overflow-y-auto"></div>
</div>

<script>
const token = sessionStorage.getItem('adminToken')
if (!token) window.location.href = '/admin'
const H = { 'Content-Type':'application/json', 'X-Admin-Token': token }

function logout() { sessionStorage.removeItem('adminToken'); window.location.href = '/admin' }

// ── Tabs ──────────────────────────────────────
function showTab(t) {
  ['apps','camps','new','tg'].forEach(id => {
    document.getElementById('panel-' + id).classList.toggle('hidden', id !== t)
    const btn = document.getElementById('tab-' + id)
    btn.classList.toggle('tab-active', id === t)
    btn.classList.toggle('border-transparent', id !== t)
    btn.classList.toggle('border-blue-600', id === t)
  })
  if (t === 'apps')  { loadStats(); loadApps() }
  if (t === 'camps') loadCamps()
}

// ── Stats ─────────────────────────────────────
async function loadStats() {
  try {
    const [ar, cr] = await Promise.all([
      fetch('/api/admin/applications', { headers: H }),
      fetch('/api/admin/campaigns',    { headers: H }),
    ])
    const apps  = await ar.json()
    const camps = await cr.json()
    if (apps.success) {
      document.getElementById('s-total').textContent    = apps.data.length
      document.getElementById('s-pending').textContent  = apps.data.filter(a => a.status==='pending').length
      document.getElementById('s-approved').textContent = apps.data.filter(a => a.status==='approved').length
      const sel = document.getElementById('fCamp')
      const cur = sel.value
      sel.innerHTML = '<option value="">All campaigns</option>' + camps.data.map(c => \`<option value="\${c.id}" \${cur==c.id?'selected':''}>\${c.place_name}</option>\`).join('')
    }
    if (camps.success) document.getElementById('s-camps').textContent = camps.data.filter(c=>c.status==='active').length
  } catch {}
}

// ── Applicants ────────────────────────────────
async function loadApps() {
  const tb = document.getElementById('appsTable')
  tb.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-xs text-gray-400">Loading...</td></tr>'
  const cid = document.getElementById('fCamp').value
  const st  = document.getElementById('fStatus').value
  let url = '/api/admin/applications?'
  if (cid) url += 'campaign_id=' + cid + '&'
  if (st)  url += 'status=' + st
  const { success, data } = await (await fetch(url, { headers: H })).json()
  if (!success || !data.length) {
    tb.innerHTML = '<tr><td colspan="6" class="text-center py-10 text-xs text-gray-400">No applicants found</td></tr>'; return
  }
  tb.innerHTML = data.map(a => {
    const dates = (a.preferred_dates || '').split('/').map(d => d.trim()).filter(Boolean)
    const dateHtml = dates.map(d => \`<span class="date-pill">\${d}</span>\`).join('')
    return \`<tr class="hover:bg-gray-50 transition-colors">
      <td class="px-4 py-3">
        <p class="font-medium text-sm text-gray-900">\${a.applicant_name}</p>
        <p class="text-xs text-gray-400">\${a.nationality}</p>
        <p class="text-xs text-gray-400">\${a.email}</p>
      </td>
      <td class="px-4 py-3 hidden sm:table-cell">
        <p class="text-xs text-gray-700 font-medium">\${a.place_name||''}</p>
        <p class="text-xs text-gray-400">\${a.campaign_title||''}</p>
      </td>
      <td class="px-4 py-3">
        \${a.instagram ? \`<a href="https://instagram.com/\${a.instagram}" target="_blank" class="text-sm text-pink-500 font-semibold hover:underline">@\${a.instagram}</a>\` : '<span class="text-xs text-gray-300">—</span>'}
      </td>
      <td class="px-4 py-3 hidden lg:table-cell">
        <div class="flex flex-wrap gap-0">\${dateHtml || '<span class="text-xs text-gray-300">—</span>'}</div>
      </td>
      <td class="px-4 py-3">
        <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold s-\${a.status}">\${{pending:'Pending',approved:'Approved',rejected:'Rejected'}[a.status]||a.status}</span>
      </td>
      <td class="px-4 py-3 text-center">
        <div class="flex items-center justify-center gap-1">
          <button onclick='openAppDetail(\${JSON.stringify(a).replace(/"/g,"&quot;")})' class="w-7 h-7 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 flex items-center justify-center text-xs transition" title="Detail">
            <i class="fas fa-eye"></i>
          </button>
          \${a.status!=='approved' ? \`<button onclick="setStatus(\${a.id},'approved')" class="w-7 h-7 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center text-xs transition" title="Approve"><i class="fas fa-check"></i></button>\` : ''}
          \${a.status!=='rejected' ? \`<button onclick="setStatus(\${a.id},'rejected')" class="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center text-xs transition" title="Reject"><i class="fas fa-times"></i></button>\` : ''}
        </div>
      </td>
    </tr>\`
  }).join('')
}

function openAppDetail(a) {
  const dates = (a.preferred_dates||'').split('/').map(d=>d.trim()).filter(Boolean)
  const dateHtml = dates.map(d => {
    return \`<div class="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0"><i class="far fa-clock text-blue-400 text-xs w-4"></i><span class="text-sm text-gray-700">\${d}</span></div>\`
  }).join('')

  document.getElementById('appModalContent').innerHTML = \`
    <div class="flex items-center justify-between mb-5">
      <h3 class="font-bold text-gray-900">Applicant Detail</h3>
      <button onclick="document.getElementById('appModal').classList.remove('active')" class="text-gray-300 hover:text-gray-500"><i class="fas fa-times"></i></button>
    </div>
    <div class="space-y-3 text-sm">
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-gray-50 rounded-xl p-3">
          <p class="text-xs text-gray-400 mb-0.5">Name</p>
          <p class="font-semibold">\${a.applicant_name}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-3">
          <p class="text-xs text-gray-400 mb-0.5">Nationality</p>
          <p class="font-semibold">\${a.nationality}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-3">
          <p class="text-xs text-gray-400 mb-0.5">Email</p>
          <p class="font-semibold text-blue-600 text-xs break-all">\${a.email}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-3">
          <p class="text-xs text-gray-400 mb-0.5"><i class="fab fa-whatsapp text-green-500 mr-1"></i>WhatsApp</p>
          <p class="font-semibold text-xs">\${a.phone||'—'}</p>
        </div>
      </div>
      <div class="bg-pink-50 rounded-xl p-3 flex items-center gap-3">
        <i class="fab fa-instagram text-pink-500 text-2xl"></i>
        <div>
          <p class="text-xs text-gray-400 mb-0.5">Instagram</p>
          \${a.instagram ? \`<a href="https://instagram.com/\${a.instagram}" target="_blank" class="font-bold text-pink-600 text-base hover:underline">@\${a.instagram}</a>\` : '<span class="text-gray-400 text-xs">—</span>'}
        </div>
      </div>
      <div class="bg-blue-50 rounded-xl p-3">
        <p class="text-xs font-semibold text-blue-700 mb-2"><i class="far fa-calendar mr-1"></i>Available Dates</p>
        \${dateHtml || '<p class="text-xs text-gray-400">No dates provided</p>'}
      </div>
      <div class="bg-gray-50 rounded-xl p-3">
        <p class="text-xs text-gray-400 mb-0.5">Campaign</p>
        <p class="font-semibold">\${a.campaign_title||''}</p>
        <p class="text-xs text-gray-400">\${a.place_name||''}</p>
      </div>
      \${a.message ? \`<div class="bg-gray-50 rounded-xl p-3"><p class="text-xs text-gray-400 mb-0.5">Message</p><p class="text-sm text-gray-700">\${a.message}</p></div>\` : ''}
      <p class="text-xs text-gray-400">Applied: \${new Date(a.created_at).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}</p>
      <div class="flex items-center justify-between pt-1">
        <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold s-\${a.status}">\${{pending:'Pending',approved:'Approved',rejected:'Rejected'}[a.status]}</span>
        <div class="flex gap-2">
          \${a.status!=='approved' ? \`<button onclick="setStatus(\${a.id},'approved');document.getElementById('appModal').classList.remove('active')" class="bg-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-green-700">Approve</button>\` : ''}
          \${a.status!=='rejected' ? \`<button onclick="setStatus(\${a.id},'rejected');document.getElementById('appModal').classList.remove('active')" class="bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-red-600">Reject</button>\` : ''}
        </div>
      </div>
    </div>\`
  document.getElementById('appModal').classList.add('active')
}

async function setStatus(id, status) {
  await fetch('/api/admin/applications/'+id, { method:'PATCH', headers:H, body: JSON.stringify({status}) })
  loadStats(); loadApps()
}

// ── Campaigns ─────────────────────────────────
async function loadCamps() {
  const el = document.getElementById('campsContent')
  el.innerHTML = '<p class="text-xs text-gray-400 text-center py-6">Loading...</p>'
  const { data } = await (await fetch('/api/admin/campaigns',{headers:H})).json()
  if (!data?.length) { el.innerHTML='<p class="text-xs text-gray-400 text-center py-8">No campaigns</p>'; return }
  el.innerHTML = '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">' + data.map(c => {
    const pct   = Math.min(100, Math.round((c.current_participants/c.max_participants)*100))
    const thumb = c.place_photo_ref ? \`/api/places/photo?ref=\${c.place_photo_ref}\` : ''
    return \`<div class="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div class="h-28 bg-gray-100">\${thumb?\`<img src="\${thumb}" class="w-full h-full object-cover">\`:\`<div class="w-full h-full flex items-center justify-center text-gray-200"><i class="fas fa-hospital text-3xl"></i></div>\`}</div>
      <div class="p-3">
        <div class="flex items-center justify-between mb-1">
          <p class="font-semibold text-xs text-gray-900 truncate flex-1">\${c.title}</p>
          <span class="text-xs ml-2 \${c.status==='active'?'text-green-500':'text-gray-300'}">\${c.status==='active'?'●':'○'}</span>
        </div>
        <p class="text-xs text-gray-400 mb-2">\${c.place_name} · \${c.category}</p>
        <div class="flex justify-between text-xs text-gray-400 mb-1"><span>\${c.current_participants}/\${c.max_participants}</span><span>\${pct}%</span></div>
        <div class="h-1 bg-gray-100 rounded-full mb-2"><div class="h-full bg-blue-500 rounded-full" style="width:\${pct}%"></div></div>
        \${c.status==='active'?\`<button onclick="deactivate(\${c.id})" class="w-full text-xs text-red-400 hover:text-red-500 border border-red-100 hover:bg-red-50 py-1.5 rounded-lg transition">Deactivate</button>\`:\`<span class="block text-center text-xs text-gray-300 py-1.5">Inactive</span>\`}
      </div>
    </div>\`
  }).join('') + '</div>'
}

async function deactivate(id) {
  if (!confirm('Deactivate this campaign?')) return
  await fetch('/api/admin/campaigns/'+id,{method:'DELETE',headers:H})
  loadCamps(); loadStats()
}

// ── New campaign ──────────────────────────────
function onMapsUrlChange() {
  const v = document.getElementById('nc_maps_url').value.trim()
  // Auto-trigger if it looks like a complete URL
  if (v.startsWith('http') && v.length > 20) {
    document.getElementById('nc_resolve_status').classList.add('hidden')
  }
}

async function resolveMapsUrl() {
  const url = document.getElementById('nc_maps_url').value.trim()
  const statusEl = document.getElementById('nc_resolve_status')
  const btn = document.getElementById('nc_resolve_btn')
  if (!url) { showResolveStatus('error', 'Please paste a Google Maps URL.'); return }

  btn.disabled = true
  btn.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i> Fetching...'
  showResolveStatus('loading', 'Looking up place info...')

  try {
    const res  = await fetch('/api/places/resolve', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    const data = await res.json()
    if (!data.success) {
      showResolveStatus('error', data.error || 'Could not find place.')
      btn.disabled = false
      btn.innerHTML = '<i class="fas fa-search text-xs"></i> Fetch'
      return
    }
    fillPlace(data.data)
    showResolveStatus('success', 'Place found!')
  } catch (e) {
    showResolveStatus('error', 'Network error. Please try again.')
  }
  btn.disabled = false
  btn.innerHTML = '<i class="fas fa-search text-xs"></i> Fetch'
}

function showResolveStatus(type, msg) {
  const el = document.getElementById('nc_resolve_status')
  el.classList.remove('hidden','bg-red-50','text-red-600','bg-green-50','text-green-700','bg-blue-50','text-blue-600')
  if (type === 'error')   { el.className = 'mt-2 text-xs rounded-lg px-3 py-2 bg-red-50 text-red-600 border border-red-100' }
  if (type === 'success') { el.className = 'mt-2 text-xs rounded-lg px-3 py-2 bg-green-50 text-green-700 border border-green-100' }
  if (type === 'loading') { el.className = 'mt-2 text-xs rounded-lg px-3 py-2 bg-blue-50 text-blue-600' }
  el.textContent = msg
}

function fillPlace(p) {
  document.getElementById('nc_place_id').value   = p.place_id
  document.getElementById('nc_place_name').value = p.name
  document.getElementById('nc_address').value    = p.address
  document.getElementById('nc_photo_ref').value  = p.photo
  document.getElementById('nc_rating').value     = p.rating
  if (!document.getElementById('nc_title').value) {
    document.getElementById('nc_title').value = p.name + ' Experience'
  }
  // Update preview card
  document.getElementById('previewName').textContent = p.name
  document.getElementById('previewAddr').textContent = p.address
  document.getElementById('previewRating').textContent = p.rating ? '★ ' + p.rating : ''
  const th = document.getElementById('previewThumb')
  th.innerHTML = p.photo
    ? \`<img src="/api/places/photo?ref=\${p.photo}" class="w-full h-full object-cover">\`
    : '<i class="fas fa-hospital text-2xl text-gray-300"></i>'
  document.getElementById('placePreview').classList.remove('hidden')
}

function clearPlace() {
  document.getElementById('nc_place_id').value = ''
  document.getElementById('nc_place_name').value = ''
  document.getElementById('nc_address').value = ''
  document.getElementById('nc_photo_ref').value = ''
  document.getElementById('nc_rating').value = ''
  document.getElementById('nc_maps_url').value = ''
  document.getElementById('placePreview').classList.add('hidden')
  document.getElementById('nc_resolve_status').classList.add('hidden')
}

function resetNewForm() {
  document.getElementById('newCampForm').reset()
  clearPlace()
  document.getElementById('newCampErr').classList.add('hidden')
  document.getElementById('newCampOk').classList.add('hidden')
}

document.getElementById('newCampForm').addEventListener('submit', async e => {
  e.preventDefault()
  const errEl = document.getElementById('newCampErr')
  const okEl  = document.getElementById('newCampOk')
  errEl.classList.add('hidden'); okEl.classList.add('hidden')
  if (!document.getElementById('nc_place_id').value) {
    errEl.textContent = 'Please paste a Google Maps link and click Fetch first.'; errEl.classList.remove('hidden'); return
  }
  const btn = e.target.querySelector('button[type=submit]')
  btn.disabled=true; btn.textContent='Creating...'
  const body = {
    title: document.getElementById('nc_title').value, description: document.getElementById('nc_desc').value,
    place_id: document.getElementById('nc_place_id').value, place_name: document.getElementById('nc_place_name').value,
    place_address: document.getElementById('nc_address').value, place_photo_ref: document.getElementById('nc_photo_ref').value,
    place_rating: parseFloat(document.getElementById('nc_rating').value)||0, category: document.getElementById('nc_category').value,
    max_participants: parseInt(document.getElementById('nc_max').value)||10, deadline: document.getElementById('nc_deadline').value,
    benefits: document.getElementById('nc_benefits').value, requirements: document.getElementById('nc_req').value,
  }
  try {
    const res  = await fetch('/api/admin/campaigns',{method:'POST',headers:H,body:JSON.stringify(body)})
    const data = await res.json()
    if (data.success) {
      okEl.textContent='✅ Campaign created!'; okEl.classList.remove('hidden'); btn.textContent='Created!'
      setTimeout(()=>{ resetNewForm(); showTab('camps'); btn.disabled=false; btn.textContent='Create Campaign' }, 1800)
    } else { errEl.textContent=data.error; errEl.classList.remove('hidden'); btn.disabled=false; btn.textContent='Create Campaign' }
  } catch { errEl.textContent='Network error'; errEl.classList.remove('hidden'); btn.disabled=false; btn.textContent='Create Campaign' }
})

// ── Telegram test ─────────────────────────────
async function testTelegram() {
  const tToken  = document.getElementById('tgToken').value.trim()
  const tChatId = document.getElementById('tgChatId').value.trim()
  const resEl   = document.getElementById('tgResult')
  resEl.classList.remove('hidden','bg-green-50','bg-red-50','text-green-700','text-red-600','border-green-100','border-red-100')

  if (!tToken || !tChatId) {
    resEl.className = 'text-sm rounded-xl px-4 py-3 border bg-red-50 text-red-600 border-red-100'
    resEl.textContent = 'Please enter both Bot Token and Chat ID.'; return
  }

  const msg = \`✅ <b>Korea Medical Experience</b>\\n\\nTelegram bot is connected!\\n🕐 \${new Date().toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})}\`
  try {
    const res  = await fetch(\`https://api.telegram.org/bot\${tToken}/sendMessage\`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ chat_id: tChatId, text: msg, parse_mode:'HTML' })
    })
    const data = await res.json()
    if (data.ok) {
      resEl.className = 'text-sm rounded-xl px-4 py-3 border bg-green-50 text-green-700 border-green-100'
      resEl.textContent = '✅ Message sent! Check your Telegram.'
    } else {
      resEl.className = 'text-sm rounded-xl px-4 py-3 border bg-red-50 text-red-600 border-red-100'
      resEl.textContent = '❌ Error: ' + (data.description || 'Unknown error')
    }
  } catch {
    resEl.className = 'text-sm rounded-xl px-4 py-3 border bg-red-50 text-red-600 border-red-100'
    resEl.textContent = '❌ Network error. Check token format.'
  }
}

document.getElementById('appModal').addEventListener('click', e => { if(e.target===document.getElementById('appModal')) document.getElementById('appModal').classList.remove('active') })

loadStats(); loadApps()
</script>
</body>
</html>`
}

export default app
