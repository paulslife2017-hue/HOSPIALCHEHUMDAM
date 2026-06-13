import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database
  GOOGLE_PLACES_API_KEY: string
  ADMIN_PASSWORD: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './' }))

// favicon 처리
app.get('/favicon.ico', (c) => {
  return new Response(null, { status: 204 })
})

// ─────────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────────
app.get('/', (c) => {
  return c.html(mainPageHTML())
})

// ─────────────────────────────────────────────
// 체험단 상세 페이지
// ─────────────────────────────────────────────
app.get('/campaign/:id', (c) => {
  const id = c.req.param('id')
  return c.html(campaignDetailHTML(id))
})

// ─────────────────────────────────────────────
// 관리자 페이지
// ─────────────────────────────────────────────
app.get('/admin', (c) => {
  return c.html(adminLoginHTML())
})

app.get('/admin/dashboard', (c) => {
  return c.html(adminDashboardHTML())
})

// ─────────────────────────────────────────────
// API: 캠페인 목록
// ─────────────────────────────────────────────
app.get('/api/campaigns', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM campaigns WHERE status = ? ORDER BY created_at DESC'
    ).bind('active').all()
    return c.json({ success: true, data: results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

app.get('/api/campaigns/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const campaign = await c.env.DB.prepare(
      'SELECT * FROM campaigns WHERE id = ?'
    ).bind(id).first()
    if (!campaign) return c.json({ success: false, error: 'Not found' }, 404)
    return c.json({ success: true, data: campaign })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ─────────────────────────────────────────────
// API: Google Places 검색 (프록시)
// ─────────────────────────────────────────────
app.get('/api/places/search', async (c) => {
  const query = c.req.query('q')
  if (!query) return c.json({ success: false, error: 'Query required' }, 400)

  const apiKey = c.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return c.json({
      success: false,
      error: 'Google Places API key not configured. Please set GOOGLE_PLACES_API_KEY in .dev.vars'
    }, 500)
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}&language=ko`
    const resp = await fetch(url)
    const data: any = await resp.json()
    return c.json({ success: true, data })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

app.get('/api/places/details/:placeId', async (c) => {
  const placeId = c.req.param('placeId')
  const apiKey = c.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return c.json({ success: false, error: 'API key not configured' }, 500)

  try {
    const fields = 'name,rating,formatted_address,photos,types,reviews,formatted_phone_number,website,opening_hours'
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}&language=ko`
    const resp = await fetch(url)
    const data: any = await resp.json()
    return c.json({ success: true, data })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

app.get('/api/places/photo', async (c) => {
  const ref = c.req.query('ref')
  const maxWidth = c.req.query('maxwidth') || '600'
  const apiKey = c.env.GOOGLE_PLACES_API_KEY
  if (!apiKey || !ref) return c.json({ success: false, error: 'Missing params' }, 400)

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${ref}&key=${apiKey}`
  const resp = await fetch(url)
  const buffer = await resp.arrayBuffer()
  const contentType = resp.headers.get('content-type') || 'image/jpeg'
  return new Response(buffer, {
    headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400' }
  })
})

// ─────────────────────────────────────────────
// API: 지원 제출
// ─────────────────────────────────────────────
app.post('/api/apply', async (c) => {
  try {
    const body = await c.req.json()
    const { campaign_id, name, nationality, email, phone, instagram, youtube, followers, message } = body

    if (!campaign_id || !name || !nationality || !email) {
      return c.json({ success: false, error: '필수 항목을 모두 입력해주세요.' }, 400)
    }

    // 중복 지원 체크
    const existing = await c.env.DB.prepare(
      'SELECT id FROM applications WHERE campaign_id = ? AND email = ?'
    ).bind(campaign_id, email).first()
    if (existing) {
      return c.json({ success: false, error: '이미 이 캠페인에 지원하셨습니다.' }, 400)
    }

    // 캠페인 정보 가져오기
    const campaign: any = await c.env.DB.prepare(
      'SELECT * FROM campaigns WHERE id = ?'
    ).bind(campaign_id).first()
    if (!campaign) return c.json({ success: false, error: 'Campaign not found' }, 404)

    // 정원 초과 체크
    if (campaign.current_participants >= campaign.max_participants) {
      return c.json({ success: false, error: '모집이 마감되었습니다.' }, 400)
    }

    await c.env.DB.prepare(
      `INSERT INTO applications (campaign_id, campaign_title, place_name, applicant_name, nationality, email, phone, instagram, youtube, followers, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(campaign_id, campaign.title, campaign.place_name, name, nationality, email, phone || '', instagram || '', youtube || '', followers || 0, message || '').run()

    await c.env.DB.prepare(
      'UPDATE campaigns SET current_participants = current_participants + 1 WHERE id = ?'
    ).bind(campaign_id).run()

    return c.json({ success: true, message: '지원이 완료되었습니다! 검토 후 연락드리겠습니다.' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ─────────────────────────────────────────────
// API: 관리자 로그인
// ─────────────────────────────────────────────
app.post('/api/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    const admin: any = await c.env.DB.prepare(
      'SELECT * FROM admins WHERE username = ? AND password_hash = ?'
    ).bind(username, password).first()
    if (!admin) return c.json({ success: false, error: '아이디 또는 비밀번호가 틀렸습니다.' }, 401)
    return c.json({ success: true, token: 'admin-token-' + Date.now() })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ─────────────────────────────────────────────
// API: 관리자 - 전체 지원자 목록
// ─────────────────────────────────────────────
app.get('/api/admin/applications', async (c) => {
  const auth = c.req.header('X-Admin-Token')
  if (!auth || !auth.startsWith('admin-token-')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }
  try {
    const campaign_id = c.req.query('campaign_id')
    const status = c.req.query('status')
    let query = 'SELECT * FROM applications'
    const params: any[] = []
    const conditions: string[] = []
    if (campaign_id) { conditions.push('campaign_id = ?'); params.push(campaign_id) }
    if (status) { conditions.push('status = ?'); params.push(status) }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ')
    query += ' ORDER BY created_at DESC'

    const stmt = c.env.DB.prepare(query)
    const { results } = await (params.length ? stmt.bind(...params) : stmt).all()
    return c.json({ success: true, data: results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ─────────────────────────────────────────────
// API: 관리자 - 지원 상태 변경
// ─────────────────────────────────────────────
app.patch('/api/admin/applications/:id', async (c) => {
  const auth = c.req.header('X-Admin-Token')
  if (!auth || !auth.startsWith('admin-token-')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }
  try {
    const id = c.req.param('id')
    const { status } = await c.req.json()
    await c.env.DB.prepare(
      'UPDATE applications SET status = ? WHERE id = ?'
    ).bind(status, id).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ─────────────────────────────────────────────
// API: 관리자 - 캠페인 관리
// ─────────────────────────────────────────────
app.get('/api/admin/campaigns', async (c) => {
  const auth = c.req.header('X-Admin-Token')
  if (!auth || !auth.startsWith('admin-token-')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM campaigns ORDER BY created_at DESC'
    ).all()
    return c.json({ success: true, data: results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

app.post('/api/admin/campaigns', async (c) => {
  const auth = c.req.header('X-Admin-Token')
  if (!auth || !auth.startsWith('admin-token-')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }
  try {
    const body = await c.req.json()
    const { title, description, place_id, place_name, place_address, place_photo_ref, place_rating, place_types, category, max_participants, deadline } = body
    const result = await c.env.DB.prepare(
      `INSERT INTO campaigns (title, description, place_id, place_name, place_address, place_photo_ref, place_rating, place_types, category, max_participants, deadline)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(title, description, place_id, place_name, place_address, place_photo_ref || '', place_rating || 0, place_types || '', category || '맛집', max_participants || 10, deadline).run()
    return c.json({ success: true, id: result.meta.last_row_id })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

app.delete('/api/admin/campaigns/:id', async (c) => {
  const auth = c.req.header('X-Admin-Token')
  if (!auth || !auth.startsWith('admin-token-')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }
  try {
    const id = c.req.param('id')
    await c.env.DB.prepare('UPDATE campaigns SET status = ? WHERE id = ?').bind('inactive', id).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ─────────────────────────────────────────────
// HTML 페이지 함수들
// ─────────────────────────────────────────────
function mainPageHTML(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Korea Experience — 외국인 체험단</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
    body { font-family: 'Noto Sans KR', sans-serif; }
    .hero-gradient { background: linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 50%, #e8505b 100%); }
    .card-hover { transition: all 0.3s ease; }
    .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
    .badge { display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .progress-bar { height: 6px; background: #e5e7eb; border-radius: 999px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #8b5cf6); border-radius: 999px; transition: width 0.5s ease; }
    .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1000; backdrop-filter: blur(4px); }
    .modal-overlay.active { display: flex; align-items: center; justify-content: center; }
    .photo-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; border-radius: 12px; overflow: hidden; }
    .photo-gallery img { width: 100%; height: 120px; object-fit: cover; }
    .star-rating { color: #f59e0b; }
    input, textarea, select { transition: border-color 0.2s; }
    input:focus, textarea:focus, select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
    .tab-btn.active { background: #2563eb; color: white; }
    .filter-btn.active { background: #1e40af; color: white; }
    ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f5f9; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">

<!-- 네비게이션 -->
<nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
          <i class="fas fa-globe-asia text-white text-sm"></i>
        </div>
        <div>
          <div class="font-bold text-gray-900 text-lg leading-tight">Korea Experience</div>
          <div class="text-xs text-gray-400">외국인 체험단 모집</div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button onclick="openSearchModal()" class="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">
          <i class="fas fa-search"></i>
          <span class="hidden sm:inline">장소 검색</span>
        </button>
        <a href="/admin" class="text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
          <i class="fas fa-shield-alt mr-1"></i>관리자
        </a>
      </div>
    </div>
  </div>
</nav>

<!-- 히어로 섹션 -->
<section class="hero-gradient text-white py-20 px-4">
  <div class="max-w-4xl mx-auto text-center">
    <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm">
      <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
      현재 모집 중인 체험단이 있습니다
    </div>
    <h1 class="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
      한국을 직접 경험하고<br>
      <span class="text-yellow-300">SNS에 공유하세요! 🇰🇷</span>
    </h1>
    <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
      음식, 문화, 관광 등 다양한 한국 체험 기회를 외국인 인플루언서에게 제공합니다
    </p>
    <div class="flex flex-wrap justify-center gap-6 text-sm">
      <div class="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
        <i class="fas fa-utensils text-yellow-300"></i> 맛집 체험
      </div>
      <div class="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
        <i class="fas fa-landmark text-yellow-300"></i> 문화 관광
      </div>
      <div class="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
        <i class="fas fa-coffee text-yellow-300"></i> 카페 체험
      </div>
      <div class="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
        <i class="fas fa-spa text-yellow-300"></i> 뷰티/웰니스
      </div>
    </div>
  </div>
</section>

<!-- 카테고리 필터 -->
<section class="bg-white border-b border-gray-100 py-4 px-4 sticky top-16 z-40 shadow-sm">
  <div class="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
    <span class="text-sm text-gray-500 whitespace-nowrap font-medium">필터:</span>
    <button onclick="filterCampaigns('all')" class="filter-btn active whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 transition-colors" data-filter="all">전체</button>
    <button onclick="filterCampaigns('맛집')" class="filter-btn whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 transition-colors" data-filter="맛집">🍽️ 맛집</button>
    <button onclick="filterCampaigns('문화')" class="filter-btn whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 transition-colors" data-filter="문화">🏛️ 문화</button>
    <button onclick="filterCampaigns('카페')" class="filter-btn whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 transition-colors" data-filter="카페">☕ 카페</button>
    <button onclick="filterCampaigns('쇼핑')" class="filter-btn whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 transition-colors" data-filter="쇼핑">🛍️ 쇼핑</button>
    <button onclick="filterCampaigns('뷰티')" class="filter-btn whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 transition-colors" data-filter="뷰티">💄 뷰티</button>
    <button onclick="filterCampaigns('숙박')" class="filter-btn whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 transition-colors" data-filter="숙박">🏨 숙박</button>
  </div>
</section>

<!-- 캠페인 목록 -->
<main class="max-w-7xl mx-auto px-4 py-10">
  <div class="flex items-center justify-between mb-8">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">현재 모집 중</h2>
      <p class="text-gray-500 text-sm mt-1">지금 지원 가능한 체험단 목록입니다</p>
    </div>
    <span id="campaign-count" class="text-sm text-gray-400"></span>
  </div>

  <div id="loading" class="flex flex-col items-center justify-center py-20">
    <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p class="text-gray-500">캠페인을 불러오는 중...</p>
  </div>

  <div id="campaigns-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 hidden"></div>

  <div id="empty-state" class="hidden flex flex-col items-center justify-center py-20 text-gray-400">
    <i class="fas fa-search text-5xl mb-4 text-gray-200"></i>
    <p class="text-lg font-medium">해당 카테고리에 캠페인이 없습니다</p>
  </div>
</main>

<!-- 장소 검색 모달 -->
<div id="searchModal" class="modal-overlay">
  <div class="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900"><i class="fas fa-map-marker-alt text-red-500 mr-2"></i>Google Places 장소 검색</h3>
        <button onclick="closeSearchModal()" class="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="flex gap-2">
        <input id="searchInput" type="text" placeholder="장소명을 영어로 검색하세요 (예: Gyeongbokgung Palace, Myeongdong...)"
          class="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm"
          onkeydown="if(event.key==='Enter') searchPlaces()">
        <button onclick="searchPlaces()" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors">
          <i class="fas fa-search mr-1"></i>검색
        </button>
      </div>
      <p class="text-xs text-gray-400 mt-2">* Google Places API 키가 설정되어 있어야 검색이 가능합니다</p>
    </div>
    <div id="searchResults" class="p-4 overflow-y-auto flex-1">
      <div class="text-center text-gray-400 py-12">
        <i class="fas fa-search text-4xl mb-3 text-gray-200"></i>
        <p>검색어를 입력하면 Google Places에서<br>장소 정보를 가져옵니다</p>
      </div>
    </div>
  </div>
</div>

<!-- 체험단 지원 모달 -->
<div id="applyModal" class="modal-overlay">
  <div class="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
    <div class="p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900"><i class="fas fa-paper-plane text-blue-500 mr-2"></i>체험단 지원하기</h3>
        <button onclick="closeApplyModal()" class="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div id="applyModalPlace" class="mt-3 p-3 bg-blue-50 rounded-xl flex items-center gap-3">
        <div id="applyModalThumb" class="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden flex-shrink-0">
          <i class="fas fa-image"></i>
        </div>
        <div>
          <div id="applyModalTitle" class="font-semibold text-gray-900 text-sm"></div>
          <div id="applyModalSubtitle" class="text-xs text-gray-500 mt-0.5"></div>
        </div>
      </div>
    </div>
    <form id="applyForm" class="p-6 space-y-4">
      <input type="hidden" id="applyCapId" name="campaign_id">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">이름 (Name) <span class="text-red-500">*</span></label>
          <input type="text" id="applyName" placeholder="Full Name" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">국적 (Nationality) <span class="text-red-500">*</span></label>
          <select id="applyNationality" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
            <option value="">Select Country</option>
            <option>🇺🇸 USA</option><option>🇬🇧 UK</option><option>🇯🇵 Japan</option>
            <option>🇨🇳 China</option><option>🇹🇼 Taiwan</option><option>🇭🇰 Hong Kong</option>
            <option>🇹🇭 Thailand</option><option>🇻🇳 Vietnam</option><option>🇵🇭 Philippines</option>
            <option>🇮🇩 Indonesia</option><option>🇲🇾 Malaysia</option><option>🇸🇬 Singapore</option>
            <option>🇦🇺 Australia</option><option>🇨🇦 Canada</option><option>🇩🇪 Germany</option>
            <option>🇫🇷 France</option><option>🇮🇳 India</option><option>🇧🇷 Brazil</option>
            <option>🇲🇽 Mexico</option><option>🇷🇺 Russia</option><option>🇸🇦 Saudi Arabia</option>
            <option>🇺🇦 Ukraine</option><option>🇳🇱 Netherlands</option><option>🇮🇹 Italy</option>
            <option>🇪🇸 Spain</option><option>🇵🇱 Poland</option><option>Other</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">이메일 (Email) <span class="text-red-500">*</span></label>
        <input type="email" id="applyEmail" placeholder="your@email.com" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">연락처 (Phone)</label>
        <input type="text" id="applyPhone" placeholder="+82-10-0000-0000" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
      </div>
      <div class="border border-gray-100 rounded-xl p-4 bg-gray-50">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">SNS 계정 (하나 이상 필수)</p>
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <i class="fab fa-instagram text-pink-500 w-5"></i>
            <input type="text" id="applyInstagram" placeholder="@instagram_handle" class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          </div>
          <div class="flex items-center gap-2">
            <i class="fab fa-youtube text-red-500 w-5"></i>
            <input type="text" id="applyYoutube" placeholder="YouTube Channel URL" class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-users text-blue-500 w-5"></i>
            <input type="number" id="applyFollowers" placeholder="총 팔로워 수" class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          </div>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">지원 동기 (Message)</label>
        <textarea id="applyMessage" rows="3" placeholder="한국 체험에 관심을 갖게 된 이유나 SNS 활동 내용을 알려주세요..." class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"></textarea>
      </div>
      <div id="applyError" class="hidden bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm"></div>
      <div id="applySuccess" class="hidden bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm"></div>
      <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all text-sm">
        <i class="fas fa-paper-plane mr-2"></i>지원 제출하기
      </button>
      <p class="text-xs text-center text-gray-400">제출 후 이메일로 결과를 안내드립니다</p>
    </form>
  </div>
</div>

<!-- 캠페인 상세 모달 -->
<div id="detailModal" class="modal-overlay">
  <div class="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
    <div id="detailContent"></div>
  </div>
</div>

<footer class="bg-gray-900 text-gray-400 py-12 mt-16">
  <div class="max-w-7xl mx-auto px-4 text-center">
    <div class="flex items-center justify-center gap-3 mb-4">
      <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
        <i class="fas fa-globe-asia text-white text-xs"></i>
      </div>
      <span class="text-white font-bold">Korea Experience</span>
    </div>
    <p class="text-sm">외국인 체험단 모집 플랫폼 · Powered by Google Places API</p>
    <p class="text-xs mt-2">© 2025 Korea Experience. All rights reserved.</p>
  </div>
</footer>

<script>
let allCampaigns = []
let currentFilter = 'all'
let currentCampaignId = null

// ── 캠페인 목록 로드 ──────────────────────────
async function loadCampaigns() {
  try {
    const res = await fetch('/api/campaigns')
    const data = await res.json()
    if (data.success) {
      allCampaigns = data.data
      renderCampaigns(allCampaigns)
    }
  } catch(e) {
    document.getElementById('loading').innerHTML = '<p class="text-red-500">데이터를 불러오지 못했습니다.</p>'
  }
}

function renderCampaigns(campaigns) {
  const grid = document.getElementById('campaigns-grid')
  const loading = document.getElementById('loading')
  const empty = document.getElementById('empty-state')
  const count = document.getElementById('campaign-count')

  loading.classList.add('hidden')

  if (!campaigns.length) {
    grid.classList.add('hidden')
    empty.classList.remove('hidden')
    count.textContent = ''
    return
  }

  empty.classList.add('hidden')
  grid.classList.remove('hidden')
  count.textContent = campaigns.length + '개 캠페인'

  grid.innerHTML = campaigns.map(c => {
    const pct = Math.round((c.current_participants / c.max_participants) * 100)
    const isFull = c.current_participants >= c.max_participants
    const thumbUrl = c.place_photo_ref ? '/api/places/photo?ref=' + c.place_photo_ref + '&maxwidth=600' : ''
    const categoryEmoji = { '맛집':'🍽️', '문화':'🏛️', '카페':'☕', '쇼핑':'🛍️', '뷰티':'💄', '숙박':'🏨' }[c.category] || '📍'
    const deadline = c.deadline ? new Date(c.deadline).toLocaleDateString('ko-KR', {month:'long',day:'numeric'}) : '미정'
    const stars = '⭐'.repeat(Math.round(c.place_rating || 0))

    return \`<article class="card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer" onclick="openDetail(\${c.id})">
      <div class="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200">
        \${thumbUrl
          ? \`<img src="\${thumbUrl}" class="w-full h-full object-cover" alt="\${c.place_name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">\`
          : ''}
        <div class="\${thumbUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center flex-col text-gray-400" style="display:\${thumbUrl ? 'none' : 'flex'}">
          <i class="fas fa-image text-4xl mb-2 text-gray-300"></i>
          <span class="text-sm">\${c.place_name}</span>
        </div>
        <div class="absolute top-3 left-3">
          <span class="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2 py-1 rounded-full shadow">\${categoryEmoji} \${c.category}</span>
        </div>
        \${isFull ? '<div class="absolute inset-0 bg-black/50 flex items-center justify-center"><span class="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full">마감</span></div>' : ''}
      </div>
      <div class="p-5">
        <h3 class="font-bold text-gray-900 text-base mb-1 line-clamp-1">\${c.title}</h3>
        <div class="flex items-center gap-1 text-sm text-gray-500 mb-1">
          <i class="fas fa-map-marker-alt text-red-400 text-xs"></i>
          <span class="line-clamp-1">\${c.place_name}</span>
        </div>
        \${c.place_rating ? \`<div class="text-xs text-yellow-500 mb-3">⭐ \${c.place_rating} / 5.0</div>\` : '<div class="mb-3"></div>'}
        <p class="text-xs text-gray-500 line-clamp-2 mb-4">\${c.description || ''}</p>
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-xs text-gray-500">
            <span>모집 현황</span>
            <span class="font-semibold \${isFull ? 'text-red-500' : 'text-blue-600'}">\${c.current_participants} / \${c.max_participants}명</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:\${pct}%"></div></div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-400"><i class="far fa-clock mr-1"></i>마감 \${deadline}</span>
          <button onclick="event.stopPropagation(); openApply(\${c.id})" \${isFull ? 'disabled' : ''} class="\${isFull ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'} px-4 py-2 rounded-xl text-xs font-semibold transition-colors">
            \${isFull ? '마감됨' : '지원하기'}
          </button>
        </div>
      </div>
    </article>\`
  }).join('')
}

function filterCampaigns(filter) {
  currentFilter = filter
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter)
    if (!btn.classList.contains('active')) {
      btn.classList.add('bg-gray-100', 'text-gray-700')
      btn.classList.remove('bg-gray-100')
    }
  })
  const filtered = filter === 'all' ? allCampaigns : allCampaigns.filter(c => c.category === filter)
  renderCampaigns(filtered)
}

// ── 상세 모달 ──────────────────────────────────
async function openDetail(id) {
  const res = await fetch('/api/campaigns/' + id)
  const { data: c } = await res.json()
  const pct = Math.round((c.current_participants / c.max_participants) * 100)
  const isFull = c.current_participants >= c.max_participants
  const thumbUrl = c.place_photo_ref ? '/api/places/photo?ref=' + c.place_photo_ref + '&maxwidth=800' : ''

  document.getElementById('detailContent').innerHTML = \`
    <div class="sticky top-0 z-10">
      <div class="relative h-64 bg-gray-200">
        \${thumbUrl ? \`<img src="\${thumbUrl}" class="w-full h-full object-cover">\` : \`<div class="w-full h-full flex items-center justify-center text-gray-400"><i class="fas fa-image text-5xl"></i></div>\`}
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button onclick="closeDetailModal()" class="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors">
          <i class="fas fa-times"></i>
        </button>
        <div class="absolute bottom-4 left-4 text-white">
          <h2 class="text-xl font-bold">\${c.title}</h2>
          <p class="text-sm text-white/80 mt-1"><i class="fas fa-map-marker-alt mr-1"></i>\${c.place_name}</p>
        </div>
      </div>
    </div>
    <div class="p-6">
      <div class="flex flex-wrap gap-3 mb-5">
        <div class="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
          <i class="fas fa-tag text-blue-500"></i> \${c.category}
        </div>
        \${c.place_rating ? \`<div class="flex items-center gap-1 text-sm text-gray-600 bg-yellow-50 rounded-full px-3 py-1">⭐ \${c.place_rating} 평점</div>\` : ''}
        <div class="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1">
          <i class="fas fa-users text-green-500"></i> \${c.current_participants}/\${c.max_participants}명
        </div>
        \${c.deadline ? \`<div class="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1"><i class="far fa-calendar text-red-500"></i> \${new Date(c.deadline).toLocaleDateString('ko-KR')}</div>\` : ''}
      </div>
      \${c.place_address ? \`<p class="text-sm text-gray-500 mb-4"><i class="fas fa-location-dot text-red-400 mr-2"></i>\${c.place_address}</p>\` : ''}
      <div class="space-y-2 mb-5">
        <div class="flex justify-between text-sm text-gray-600">
          <span>모집 현황</span>
          <span class="font-bold \${isFull ? 'text-red-500' : 'text-blue-600'}">\${pct}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:\${pct}%"></div></div>
      </div>
      <div class="bg-gray-50 rounded-xl p-4 mb-5">
        <h4 class="font-semibold text-gray-800 mb-2 text-sm">캠페인 소개</h4>
        <p class="text-sm text-gray-600 leading-relaxed">\${c.description || '상세 설명이 없습니다.'}</p>
      </div>
      \${!isFull
        ? \`<button onclick="closeDetailModal(); openApply(\${c.id})" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"><i class="fas fa-paper-plane mr-2"></i>지금 지원하기</button>\`
        : \`<div class="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-bold text-sm text-center">모집이 마감되었습니다</div>\`}
    </div>\`

  document.getElementById('detailModal').classList.add('active')
}

function closeDetailModal() {
  document.getElementById('detailModal').classList.remove('active')
}

// ── 지원 모달 ──────────────────────────────────
async function openApply(id) {
  currentCampaignId = id
  const res = await fetch('/api/campaigns/' + id)
  const { data: c } = await res.json()
  document.getElementById('applyCapId').value = id
  document.getElementById('applyModalTitle').textContent = c.title
  document.getElementById('applyModalSubtitle').textContent = c.place_name + (c.place_address ? ' · ' + c.place_address : '')
  const thumb = document.getElementById('applyModalThumb')
  if (c.place_photo_ref) {
    thumb.innerHTML = \`<img src="/api/places/photo?ref=\${c.place_photo_ref}&maxwidth=120" class="w-full h-full object-cover">\`
  } else {
    thumb.innerHTML = '<i class="fas fa-store text-gray-400 text-lg"></i>'
  }
  document.getElementById('applyError').classList.add('hidden')
  document.getElementById('applySuccess').classList.add('hidden')
  document.getElementById('applyForm').reset()
  document.getElementById('applyCapId').value = id
  document.getElementById('applyModal').classList.add('active')
}

function closeApplyModal() {
  document.getElementById('applyModal').classList.remove('active')
}

document.getElementById('applyForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const errEl = document.getElementById('applyError')
  const sucEl = document.getElementById('applySuccess')
  errEl.classList.add('hidden')
  sucEl.classList.add('hidden')

  const body = {
    campaign_id: parseInt(document.getElementById('applyCapId').value),
    name: document.getElementById('applyName').value,
    nationality: document.getElementById('applyNationality').value,
    email: document.getElementById('applyEmail').value,
    phone: document.getElementById('applyPhone').value,
    instagram: document.getElementById('applyInstagram').value,
    youtube: document.getElementById('applyYoutube').value,
    followers: parseInt(document.getElementById('applyFollowers').value) || 0,
    message: document.getElementById('applyMessage').value,
  }

  const btn = e.target.querySelector('button[type="submit"]')
  btn.disabled = true
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>제출 중...'

  try {
    const res = await fetch('/api/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.success) {
      sucEl.textContent = '✅ ' + data.message
      sucEl.classList.remove('hidden')
      btn.innerHTML = '<i class="fas fa-check mr-2"></i>지원 완료!'
      btn.classList.remove('from-blue-600', 'to-purple-600')
      btn.classList.add('from-green-500', 'to-green-600')
      setTimeout(() => { closeApplyModal(); loadCampaigns() }, 2500)
    } else {
      errEl.textContent = '❌ ' + data.error
      errEl.classList.remove('hidden')
      btn.disabled = false
      btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>지원 제출하기'
    }
  } catch(ex) {
    errEl.textContent = '네트워크 오류가 발생했습니다.'
    errEl.classList.remove('hidden')
    btn.disabled = false
    btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>지원 제출하기'
  }
})

// ── Google Places 검색 ──────────────────────────
function openSearchModal() { document.getElementById('searchModal').classList.add('active') }
function closeSearchModal() { document.getElementById('searchModal').classList.remove('active') }

async function searchPlaces() {
  const q = document.getElementById('searchInput').value.trim()
  if (!q) return
  const el = document.getElementById('searchResults')
  el.innerHTML = '<div class="flex items-center justify-center py-12"><div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>'
  try {
    const res = await fetch('/api/places/search?q=' + encodeURIComponent(q))
    const data = await res.json()
    if (!data.success || !data.data.results?.length) {
      el.innerHTML = '<div class="text-center text-gray-400 py-12"><i class="fas fa-map-marker-alt text-3xl mb-2 text-gray-200"></i><p>검색 결과가 없습니다</p><p class="text-xs mt-1">API 키가 설정되어 있는지 확인하세요</p></div>'
      return
    }
    el.innerHTML = data.data.results.slice(0, 8).map(p => {
      const photo = p.photos?.[0]?.photo_reference
      const imgSrc = photo ? '/api/places/photo?ref=' + photo + '&maxwidth=120' : ''
      return \`<div class="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-blue-100" onclick='selectPlace(\${JSON.stringify({place_id: p.place_id, name: p.name, address: p.formatted_address, rating: p.rating, types: (p.types||[]).join(","), photo: photo||""}).replace(/'/g, "&#39;")})'>
        <div class="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
          \${imgSrc ? \`<img src="\${imgSrc}" class="w-full h-full object-cover" onerror="this.style.display='none'">\` : '<i class="fas fa-image text-gray-300 text-lg"></i>'}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-sm text-gray-900 truncate">\${p.name}</div>
          <div class="text-xs text-gray-400 truncate mt-0.5">\${p.formatted_address || ''}</div>
          \${p.rating ? \`<div class="text-xs text-yellow-500 mt-1">⭐ \${p.rating}</div>\` : ''}
        </div>
        <div class="text-blue-400 text-xs">선택 →</div>
      </div>\`
    }).join('')
  } catch(e) {
    el.innerHTML = '<div class="text-center text-red-400 py-12">검색 오류가 발생했습니다</div>'
  }
}

function selectPlace(place) {
  window._selectedPlace = place
  closeSearchModal()
  alert('장소가 선택되었습니다: ' + place.name + '\\n관리자 페이지에서 캠페인을 생성하세요.')
}

// 모달 외부 클릭 닫기
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('active')
  })
})

// 초기 로드
loadCampaigns()
</script>
</body>
</html>`
}

function campaignDetailHTML(id: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><script>window.location.href='/?campaign=${id}'</script></head></html>`
}

function adminLoginHTML(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>관리자 로그인 — Korea Experience</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700&display=swap');
    body { font-family: 'Noto Sans KR', sans-serif; }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
        <i class="fas fa-shield-alt text-white text-2xl"></i>
      </div>
      <h1 class="text-2xl font-bold text-white">관리자 로그인</h1>
      <p class="text-blue-300 text-sm mt-1">Korea Experience Admin</p>
    </div>
    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
      <form id="loginForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-blue-200 mb-2">아이디</label>
          <div class="relative">
            <i class="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-sm"></i>
            <input type="text" id="username" value="admin" class="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-blue-300 text-sm focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-blue-200 mb-2">비밀번호</label>
          <div class="relative">
            <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-sm"></i>
            <input type="password" id="password" placeholder="비밀번호 입력" class="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-blue-300 text-sm focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all">
          </div>
        </div>
        <div id="loginError" class="hidden bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl p-3 text-sm text-center"></div>
        <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-xl font-bold transition-all text-sm shadow-lg">
          <i class="fas fa-sign-in-alt mr-2"></i>로그인
        </button>
      </form>
      <p class="text-center text-blue-400 text-xs mt-4">기본 계정: admin / admin1234</p>
    </div>
    <div class="text-center mt-4">
      <a href="/" class="text-blue-400 hover:text-blue-300 text-sm transition-colors">
        <i class="fas fa-arrow-left mr-1"></i>메인으로 돌아가기
      </a>
    </div>
  </div>
  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault()
      const errEl = document.getElementById('loginError')
      errEl.classList.add('hidden')
      const btn = e.target.querySelector('button')
      btn.disabled = true
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>로그인 중...'
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: document.getElementById('username').value, password: document.getElementById('password').value })
        })
        const data = await res.json()
        if (data.success) {
          sessionStorage.setItem('adminToken', data.token)
          window.location.href = '/admin/dashboard'
        } else {
          errEl.textContent = data.error
          errEl.classList.remove('hidden')
          btn.disabled = false
          btn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>로그인'
        }
      } catch(e) {
        errEl.textContent = '로그인 중 오류가 발생했습니다'
        errEl.classList.remove('hidden')
        btn.disabled = false
        btn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>로그인'
      }
    })
  </script>
</body>
</html>`
}

function adminDashboardHTML(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>관리자 대시보드 — Korea Experience</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
    body { font-family: 'Noto Sans KR', sans-serif; background: #f8fafc; }
    .tab-btn { transition: all 0.2s; }
    .tab-btn.active { border-bottom: 3px solid #2563eb; color: #2563eb; font-weight: 700; }
    .status-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-approved { background: #d1fae5; color: #065f46; }
    .status-rejected { background: #fee2e2; color: #991b1b; }
    .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; backdrop-filter: blur(4px); }
    .modal-overlay.active { display: flex; align-items: center; justify-content: center; }
    input, textarea, select { transition: border-color 0.2s; }
    input:focus, textarea:focus, select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
    .stat-card { background: linear-gradient(135deg, var(--from), var(--to)); }
  </style>
</head>
<body class="min-h-screen">

<!-- 관리자 헤더 -->
<header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
        <i class="fas fa-shield-alt text-white text-sm"></i>
      </div>
      <div>
        <div class="font-bold text-gray-900">Admin Dashboard</div>
        <div class="text-xs text-gray-400">Korea Experience 관리자</div>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <a href="/" target="_blank" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
        <i class="fas fa-external-link-alt"></i><span class="hidden sm:inline">사이트 보기</span>
      </a>
      <button onclick="logout()" class="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
        <i class="fas fa-sign-out-alt"></i><span class="hidden sm:inline">로그아웃</span>
      </button>
    </div>
  </div>
</header>

<!-- 탭 네비게이션 -->
<div class="bg-white border-b border-gray-200 sticky top-16 z-40">
  <div class="max-w-7xl mx-auto px-4 flex gap-1">
    <button onclick="showTab('applications')" class="tab-btn active px-5 py-4 text-sm text-gray-600" id="tab-applications">
      <i class="fas fa-users mr-2"></i>지원자 관리
    </button>
    <button onclick="showTab('campaigns')" class="tab-btn px-5 py-4 text-sm text-gray-600" id="tab-campaigns">
      <i class="fas fa-bullhorn mr-2"></i>캠페인 관리
    </button>
    <button onclick="showTab('create')" class="tab-btn px-5 py-4 text-sm text-gray-600" id="tab-create">
      <i class="fas fa-plus-circle mr-2"></i>캠페인 등록
    </button>
  </div>
</div>

<main class="max-w-7xl mx-auto px-4 py-8">

  <!-- ── 통계 카드 ── -->
  <div id="statsCards" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow">
      <div class="text-3xl font-bold" id="stat-total">-</div>
      <div class="text-blue-100 text-sm mt-1">전체 지원자</div>
      <i class="fas fa-users text-blue-200 text-2xl mt-2"></i>
    </div>
    <div class="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 text-white shadow">
      <div class="text-3xl font-bold" id="stat-pending">-</div>
      <div class="text-amber-100 text-sm mt-1">검토 대기중</div>
      <i class="fas fa-hourglass-half text-amber-200 text-2xl mt-2"></i>
    </div>
    <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow">
      <div class="text-3xl font-bold" id="stat-approved">-</div>
      <div class="text-green-100 text-sm mt-1">승인됨</div>
      <i class="fas fa-check-circle text-green-200 text-2xl mt-2"></i>
    </div>
    <div class="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow">
      <div class="text-3xl font-bold" id="stat-campaigns">-</div>
      <div class="text-purple-100 text-sm mt-1">활성 캠페인</div>
      <i class="fas fa-bullhorn text-purple-200 text-2xl mt-2"></i>
    </div>
  </div>

  <!-- ── 지원자 관리 탭 ── -->
  <div id="panel-applications">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 class="font-bold text-gray-900"><i class="fas fa-users text-blue-500 mr-2"></i>지원자 목록</h2>
        <div class="flex gap-2 flex-wrap">
          <select id="appFilterCampaign" onchange="loadApplications()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">전체 캠페인</option>
          </select>
          <select id="appFilterStatus" onchange="loadApplications()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">전체 상태</option>
            <option value="pending">검토중</option>
            <option value="approved">승인</option>
            <option value="rejected">거절</option>
          </select>
          <button onclick="loadApplications()" class="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase">지원자</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase hidden sm:table-cell">캠페인</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase hidden md:table-cell">SNS</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase">상태</th>
              <th class="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase hidden lg:table-cell">지원일</th>
              <th class="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase">액션</th>
            </tr>
          </thead>
          <tbody id="applicationsTable" class="divide-y divide-gray-50">
            <tr><td colspan="6" class="text-center py-12 text-gray-400"><i class="fas fa-spinner fa-spin text-2xl"></i></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ── 캠페인 관리 탭 ── -->
  <div id="panel-campaigns" class="hidden">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 class="font-bold text-gray-900"><i class="fas fa-bullhorn text-purple-500 mr-2"></i>캠페인 목록</h2>
        <button onclick="showTab('create')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 font-medium">
          <i class="fas fa-plus mr-1"></i>새 캠페인
        </button>
      </div>
      <div id="campaignsTable" class="p-4">
        <div class="text-center py-12 text-gray-400"><i class="fas fa-spinner fa-spin text-2xl"></i></div>
      </div>
    </div>
  </div>

  <!-- ── 캠페인 등록 탭 ── -->
  <div id="panel-create" class="hidden">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 class="font-bold text-gray-900 mb-6"><i class="fas fa-plus-circle text-green-500 mr-2"></i>새 캠페인 등록</h2>

      <!-- Google Places 검색 -->
      <div class="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <h3 class="text-sm font-semibold text-blue-800 mb-3"><i class="fab fa-google text-blue-600 mr-2"></i>Google Places로 장소 찾기</h3>
        <div class="flex gap-2">
          <input id="placeSearchInput" type="text" placeholder="장소 이름 검색 (예: Myeongdong, Bukchon Hanok...)" class="flex-1 border border-blue-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:border-blue-500">
          <button onclick="searchPlacesForCreate()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium">
            <i class="fas fa-search mr-1"></i>검색
          </button>
        </div>
        <div id="placeSearchResults" class="mt-3 max-h-60 overflow-y-auto space-y-2"></div>
      </div>

      <form id="createCampaignForm" class="space-y-4">
        <input type="hidden" id="cf_place_id">
        <input type="hidden" id="cf_photo_ref">
        <input type="hidden" id="cf_rating">
        <input type="hidden" id="cf_types">

        <div id="selectedPlacePreview" class="hidden p-3 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3">
          <div id="selectedPlaceThumb" class="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0"></div>
          <div>
            <div id="selectedPlaceName" class="font-semibold text-sm text-gray-900"></div>
            <div id="selectedPlaceAddr" class="text-xs text-gray-500"></div>
          </div>
          <div class="ml-auto">
            <span class="text-xs text-green-600 font-medium"><i class="fas fa-check-circle mr-1"></i>선택됨</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">캠페인 제목 <span class="text-red-500">*</span></label>
            <input type="text" id="cf_title" placeholder="예: 강남 한식 체험단" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">장소명 <span class="text-red-500">*</span></label>
            <input type="text" id="cf_place_name" placeholder="장소 이름" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">주소</label>
          <input type="text" id="cf_address" placeholder="장소 주소" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">캠페인 설명 <span class="text-red-500">*</span></label>
          <textarea id="cf_description" rows="4" placeholder="체험단 모집 내용, 혜택, 조건 등을 상세히 입력해주세요..." class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none" required></textarea>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <select id="cf_category" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
              <option>맛집</option><option>문화</option><option>카페</option>
              <option>쇼핑</option><option>뷰티</option><option>숙박</option><option>기타</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">모집 인원</label>
            <input type="number" id="cf_max" value="10" min="1" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
          </div>
          <div class="col-span-2 sm:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">마감일</label>
            <input type="date" id="cf_deadline" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
          </div>
        </div>

        <div id="createError" class="hidden bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm"></div>
        <div id="createSuccess" class="hidden bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm"></div>
        <div class="flex gap-3">
          <button type="submit" class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white py-3 rounded-xl font-bold text-sm transition-all">
            <i class="fas fa-save mr-2"></i>캠페인 등록
          </button>
          <button type="button" onclick="resetCreateForm()" class="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-sm">초기화</button>
        </div>
      </form>
    </div>
  </div>

</main>

<!-- 지원자 상세 모달 -->
<div id="appDetailModal" class="modal-overlay">
  <div class="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
    <div id="appDetailContent" class="p-6"></div>
  </div>
</div>

<script>
const token = sessionStorage.getItem('adminToken')
if (!token) window.location.href = '/admin'

function logout() {
  sessionStorage.removeItem('adminToken')
  window.location.href = '/admin'
}

const headers = { 'Content-Type': 'application/json', 'X-Admin-Token': token }

// ── 탭 전환 ──────────────────────────────────
function showTab(tab) {
  ['applications', 'campaigns', 'create'].forEach(t => {
    document.getElementById('panel-' + t).classList.toggle('hidden', t !== tab)
    document.getElementById('tab-' + t).classList.toggle('active', t === tab)
  })
  if (tab === 'applications') loadApplications()
  if (tab === 'campaigns') loadCampaigns()
}

// ── 통계 로드 ─────────────────────────────────
async function loadStats() {
  try {
    const [appRes, campRes] = await Promise.all([
      fetch('/api/admin/applications', { headers }),
      fetch('/api/admin/campaigns', { headers })
    ])
    const apps = await appRes.json()
    const camps = await campRes.json()
    if (apps.success) {
      document.getElementById('stat-total').textContent = apps.data.length
      document.getElementById('stat-pending').textContent = apps.data.filter(a => a.status === 'pending').length
      document.getElementById('stat-approved').textContent = apps.data.filter(a => a.status === 'approved').length
    }
    if (camps.success) {
      document.getElementById('stat-campaigns').textContent = camps.data.filter(c => c.status === 'active').length
      const sel = document.getElementById('appFilterCampaign')
      sel.innerHTML = '<option value="">전체 캠페인</option>' + camps.data.map(c => \`<option value="\${c.id}">\${c.place_name} - \${c.title}</option>\`).join('')
    }
  } catch(e) {}
}

// ── 지원자 목록 ──────────────────────────────
async function loadApplications() {
  const tbody = document.getElementById('applicationsTable')
  tbody.innerHTML = '<tr><td colspan="6" class="text-center py-12 text-gray-400"><i class="fas fa-spinner fa-spin text-2xl"></i></td></tr>'
  const cid = document.getElementById('appFilterCampaign').value
  const st = document.getElementById('appFilterStatus').value
  let url = '/api/admin/applications?'
  if (cid) url += 'campaign_id=' + cid + '&'
  if (st) url += 'status=' + st
  try {
    const res = await fetch(url, { headers })
    const data = await res.json()
    if (!data.success) { tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-red-400">데이터 로드 실패</td></tr>'; return }
    if (!data.data.length) { tbody.innerHTML = '<tr><td colspan="6" class="text-center py-12 text-gray-400"><i class="fas fa-inbox text-3xl mb-2 block text-gray-200"></i>지원자가 없습니다</td></tr>'; return }
    tbody.innerHTML = data.data.map(a => {
      const snsInfo = [a.instagram ? '📸' + a.instagram : '', a.youtube ? '▶️' : ''].filter(Boolean).join(' ')
      return \`<tr class="hover:bg-gray-50 transition-colors">
        <td class="px-4 py-3">
          <div class="font-semibold text-gray-900 text-sm">\${a.applicant_name}</div>
          <div class="text-xs text-gray-400">\${a.nationality} · \${a.email}</div>
        </td>
        <td class="px-4 py-3 hidden sm:table-cell">
          <div class="text-sm text-gray-700 font-medium">\${a.place_name || ''}</div>
          <div class="text-xs text-gray-400">\${a.campaign_title || ''}</div>
        </td>
        <td class="px-4 py-3 hidden md:table-cell">
          <div class="text-xs text-gray-600">\${a.instagram ? '<span class="text-pink-500">@' + a.instagram + '</span>' : ''}</div>
          <div class="text-xs text-gray-400">\${a.followers ? a.followers.toLocaleString() + ' followers' : ''}</div>
        </td>
        <td class="px-4 py-3">
          <span class="status-badge status-\${a.status}">\${{ pending: '검토중', approved: '승인', rejected: '거절' }[a.status] || a.status}</span>
        </td>
        <td class="px-4 py-3 hidden lg:table-cell">
          <div class="text-xs text-gray-400">\${new Date(a.created_at).toLocaleDateString('ko-KR')}</div>
        </td>
        <td class="px-4 py-3 text-center">
          <div class="flex items-center justify-center gap-1">
            <button onclick="openAppDetail(\${JSON.stringify(a).replace(/"/g,'&quot;')})" class="w-8 h-8 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-lg flex items-center justify-center text-xs transition-colors" title="상세보기">
              <i class="fas fa-eye"></i>
            </button>
            \${a.status !== 'approved' ? \`<button onclick="updateStatus(\${a.id},'approved')" class="w-8 h-8 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xs transition-colors" title="승인"><i class="fas fa-check"></i></button>\` : ''}
            \${a.status !== 'rejected' ? \`<button onclick="updateStatus(\${a.id},'rejected')" class="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center text-xs transition-colors" title="거절"><i class="fas fa-times"></i></button>\` : ''}
          </div>
        </td>
      </tr>\`
    }).join('')
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-red-400">오류: ' + e.message + '</td></tr>'
  }
}

function openAppDetail(a) {
  document.getElementById('appDetailContent').innerHTML = \`
    <div class="flex items-center justify-between mb-5">
      <h3 class="font-bold text-gray-900 text-lg"><i class="fas fa-user-circle text-blue-500 mr-2"></i>지원자 상세</h3>
      <button onclick="document.getElementById('appDetailModal').classList.remove('active')" class="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"><i class="fas fa-times"></i></button>
    </div>
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-gray-50 rounded-xl p-3">
          <div class="text-xs text-gray-400 mb-1">이름</div>
          <div class="font-semibold text-sm">\${a.applicant_name}</div>
        </div>
        <div class="bg-gray-50 rounded-xl p-3">
          <div class="text-xs text-gray-400 mb-1">국적</div>
          <div class="font-semibold text-sm">\${a.nationality}</div>
        </div>
        <div class="bg-gray-50 rounded-xl p-3">
          <div class="text-xs text-gray-400 mb-1">이메일</div>
          <div class="font-semibold text-sm text-blue-600">\${a.email}</div>
        </div>
        <div class="bg-gray-50 rounded-xl p-3">
          <div class="text-xs text-gray-400 mb-1">연락처</div>
          <div class="font-semibold text-sm">\${a.phone || '-'}</div>
        </div>
      </div>
      <div class="bg-blue-50 rounded-xl p-3">
        <div class="text-xs text-gray-400 mb-1">지원 캠페인</div>
        <div class="font-semibold text-sm">\${a.campaign_title}</div>
        <div class="text-xs text-gray-500">\${a.place_name}</div>
      </div>
      <div class="bg-gray-50 rounded-xl p-3">
        <div class="text-xs text-gray-400 mb-2">SNS 계정</div>
        \${a.instagram ? \`<div class="text-sm text-pink-600"><i class="fab fa-instagram mr-1"></i>\${a.instagram}</div>\` : ''}
        \${a.youtube ? \`<div class="text-sm text-red-600 mt-1"><i class="fab fa-youtube mr-1"></i>\${a.youtube}</div>\` : ''}
        \${a.followers ? \`<div class="text-xs text-gray-500 mt-1"><i class="fas fa-users mr-1"></i>\${parseInt(a.followers).toLocaleString()} 팔로워</div>\` : ''}
      </div>
      \${a.message ? \`<div class="bg-gray-50 rounded-xl p-3"><div class="text-xs text-gray-400 mb-1">지원 동기</div><div class="text-sm text-gray-700 leading-relaxed">\${a.message}</div></div>\` : ''}
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xs text-gray-400">현재 상태</div>
          <span class="status-badge status-\${a.status} mt-1">\${{ pending:'검토중',approved:'승인',rejected:'거절' }[a.status]}</span>
        </div>
        <div class="flex gap-2">
          \${a.status !== 'approved' ? \`<button onclick="updateStatus(\${a.id},'approved'); document.getElementById('appDetailModal').classList.remove('active')" class="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700"><i class="fas fa-check mr-1"></i>승인</button>\` : ''}
          \${a.status !== 'rejected' ? \`<button onclick="updateStatus(\${a.id},'rejected'); document.getElementById('appDetailModal').classList.remove('active')" class="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600"><i class="fas fa-times mr-1"></i>거절</button>\` : ''}
        </div>
      </div>
    </div>\`
  document.getElementById('appDetailModal').classList.add('active')
}

async function updateStatus(id, status) {
  try {
    const res = await fetch('/api/admin/applications/' + id, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status })
    })
    const data = await res.json()
    if (data.success) {
      loadApplications()
      loadStats()
    }
  } catch(e) { alert('오류: ' + e.message) }
}

// ── 캠페인 목록 ──────────────────────────────
async function loadCampaigns() {
  const el = document.getElementById('campaignsTable')
  el.innerHTML = '<div class="text-center py-12 text-gray-400"><i class="fas fa-spinner fa-spin text-2xl"></i></div>'
  try {
    const res = await fetch('/api/admin/campaigns', { headers })
    const data = await res.json()
    if (!data.data?.length) { el.innerHTML = '<div class="text-center py-12 text-gray-400">등록된 캠페인이 없습니다</div>'; return }
    el.innerHTML = '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">' + data.data.map(c => {
      const thumbUrl = c.place_photo_ref ? '/api/places/photo?ref=' + c.place_photo_ref + '&maxwidth=300' : ''
      const pct = Math.round((c.current_participants / c.max_participants) * 100)
      return \`<div class="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
        <div class="h-32 bg-gray-100 relative">
          \${thumbUrl ? \`<img src="\${thumbUrl}" class="w-full h-full object-cover">\` : \`<div class="w-full h-full flex items-center justify-center text-gray-300"><i class="fas fa-image text-3xl"></i></div>\`}
          <div class="absolute top-2 right-2">
            <span class="\${c.status === 'active' ? 'bg-green-500' : 'bg-gray-400'} text-white text-xs px-2 py-0.5 rounded-full">\${c.status === 'active' ? '모집중' : '마감'}</span>
          </div>
        </div>
        <div class="p-3">
          <div class="font-semibold text-sm text-gray-900 mb-1 truncate">\${c.title}</div>
          <div class="text-xs text-gray-400 mb-2">\${c.place_name} · \${c.category}</div>
          <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>\${c.current_participants}/\${c.max_participants}명</span>
            <span>\${pct}%</span>
          </div>
          <div class="h-1.5 bg-gray-100 rounded-full mb-3">
            <div class="h-full bg-blue-500 rounded-full" style="width:\${pct}%"></div>
          </div>
          <button onclick="deactivateCampaign(\${c.id})" class="w-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50 py-1.5 rounded-lg transition-colors border border-red-100">
            <i class="fas fa-ban mr-1"></i>비활성화
          </button>
        </div>
      </div>\`
    }).join('') + '</div>'
  } catch(e) {
    el.innerHTML = '<div class="text-center py-8 text-red-400">오류: ' + e.message + '</div>'
  }
}

async function deactivateCampaign(id) {
  if (!confirm('이 캠페인을 비활성화하시겠습니까?')) return
  const res = await fetch('/api/admin/campaigns/' + id, { method: 'DELETE', headers })
  const data = await res.json()
  if (data.success) loadCampaigns()
}

// ── 캠페인 등록 ──────────────────────────────
async function searchPlacesForCreate() {
  const q = document.getElementById('placeSearchInput').value.trim()
  if (!q) return
  const el = document.getElementById('placeSearchResults')
  el.innerHTML = '<div class="flex items-center gap-2 text-sm text-gray-400 py-2"><i class="fas fa-spinner fa-spin"></i> 검색 중...</div>'
  try {
    const res = await fetch('/api/places/search?q=' + encodeURIComponent(q))
    const data = await res.json()
    if (!data.success || !data.data.results?.length) {
      el.innerHTML = '<p class="text-sm text-gray-400 py-2">검색 결과가 없습니다. API 키를 확인하세요.</p>'
      return
    }
    el.innerHTML = data.data.results.slice(0, 6).map(p => {
      const photo = p.photos?.[0]?.photo_reference
      const imgSrc = photo ? '/api/places/photo?ref=' + photo + '&maxwidth=80' : ''
      return \`<div class="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-blue-200"
        onclick='fillPlaceInfo({"place_id":"\${p.place_id}","name":\${JSON.stringify(p.name)},"address":\${JSON.stringify(p.formatted_address||"")},"rating":\${p.rating||0},"types":"\${(p.types||[]).slice(0,3).join(',')}","photo":"\${photo||""}"})'>
        <div class="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
          \${imgSrc ? \`<img src="\${imgSrc}" class="w-full h-full object-cover">\` : '<i class="fas fa-image text-gray-300 text-xs"></i>'}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-sm truncate">\${p.name}</div>
          <div class="text-xs text-gray-400 truncate">\${p.formatted_address || ''}</div>
        </div>
        <i class="fas fa-plus text-blue-400 text-xs flex-shrink-0"></i>
      </div>\`
    }).join('')
  } catch(e) {
    el.innerHTML = '<p class="text-sm text-red-400">검색 오류가 발생했습니다</p>'
  }
}

function fillPlaceInfo(place) {
  document.getElementById('cf_place_id').value = place.place_id
  document.getElementById('cf_place_name').value = place.name
  document.getElementById('cf_address').value = place.address
  document.getElementById('cf_photo_ref').value = place.photo
  document.getElementById('cf_rating').value = place.rating
  document.getElementById('cf_types').value = place.types
  if (!document.getElementById('cf_title').value) {
    document.getElementById('cf_title').value = place.name + ' 체험단'
  }

  const preview = document.getElementById('selectedPlacePreview')
  document.getElementById('selectedPlaceName').textContent = place.name
  document.getElementById('selectedPlaceAddr').textContent = place.address
  const thumb = document.getElementById('selectedPlaceThumb')
  if (place.photo) {
    thumb.innerHTML = \`<img src="/api/places/photo?ref=\${place.photo}&maxwidth=80" class="w-full h-full object-cover">\`
  } else {
    thumb.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><i class="fas fa-store text-gray-400 text-sm"></i></div>'
  }
  preview.classList.remove('hidden')
  document.getElementById('placeSearchResults').innerHTML = ''
}

function resetCreateForm() {
  document.getElementById('createCampaignForm').reset()
  document.getElementById('selectedPlacePreview').classList.add('hidden')
  document.getElementById('placeSearchResults').innerHTML = ''
  document.getElementById('createError').classList.add('hidden')
  document.getElementById('createSuccess').classList.add('hidden')
}

document.getElementById('createCampaignForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const errEl = document.getElementById('createError')
  const sucEl = document.getElementById('createSuccess')
  errEl.classList.add('hidden')
  sucEl.classList.add('hidden')

  const place_id = document.getElementById('cf_place_id').value
  if (!place_id) {
    errEl.textContent = '장소를 검색하여 선택해주세요.'
    errEl.classList.remove('hidden')
    return
  }

  const btn = e.target.querySelector('button[type="submit"]')
  btn.disabled = true
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>등록 중...'

  const body = {
    title: document.getElementById('cf_title').value,
    description: document.getElementById('cf_description').value,
    place_id,
    place_name: document.getElementById('cf_place_name').value,
    place_address: document.getElementById('cf_address').value,
    place_photo_ref: document.getElementById('cf_photo_ref').value,
    place_rating: parseFloat(document.getElementById('cf_rating').value) || 0,
    place_types: document.getElementById('cf_types').value,
    category: document.getElementById('cf_category').value,
    max_participants: parseInt(document.getElementById('cf_max').value) || 10,
    deadline: document.getElementById('cf_deadline').value,
  }

  try {
    const res = await fetch('/api/admin/campaigns', { method: 'POST', headers, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.success) {
      sucEl.textContent = '✅ 캠페인이 성공적으로 등록되었습니다! (ID: ' + data.id + ')'
      sucEl.classList.remove('hidden')
      btn.innerHTML = '<i class="fas fa-check mr-2"></i>등록 완료!'
      setTimeout(() => { resetCreateForm(); showTab('campaigns'); btn.disabled = false; btn.innerHTML = '<i class="fas fa-save mr-2"></i>캠페인 등록' }, 2000)
    } else {
      errEl.textContent = data.error
      errEl.classList.remove('hidden')
      btn.disabled = false
      btn.innerHTML = '<i class="fas fa-save mr-2"></i>캠페인 등록'
    }
  } catch(ex) {
    errEl.textContent = '네트워크 오류: ' + ex.message
    errEl.classList.remove('hidden')
    btn.disabled = false
    btn.innerHTML = '<i class="fas fa-save mr-2"></i>캠페인 등록'
  }
})

// 모달 외부 클릭 닫기
document.getElementById('appDetailModal').addEventListener('click', function(e) {
  if (e.target === this) this.classList.remove('active')
})

// 초기화
loadStats()
loadApplications()
</script>
</body>
</html>`
}

export default app
