// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════
export function mainPageHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seoul Beauty Trip — Influencer Experience Program</title>

  <!-- OG / SNS 미리보기 태그 -->
  <meta property="og:type"        content="website">
  <meta property="og:title"       content="Seoul Beauty Trip — Influencer Experience Program">
  <meta property="og:description" content="Complimentary treatments at Seoul's most prestigious clinics & beauty destinations — crafted for international creators. Apply now for free dental, skincare & beauty experiences!">
  <meta property="og:image"       content="https://images.unsplash.com/photo-1607017803290-8d2e5b9c4c7b?w=1200&q=80">
  <meta property="og:image:width"  content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url"         content="https://hospialchehumdam.vercel.app">
  <meta property="og:site_name"   content="Seoul Beauty Trip">
  <meta property="og:locale"      content="en_US">

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="Seoul Beauty Trip — Free Treatments for International Creators">
  <meta name="twitter:description" content="Get complimentary dental, skincare & beauty treatments in Seoul. English-speaking staff, all nationalities welcome. Apply free!">
  <meta name="twitter:image"       content="https://images.unsplash.com/photo-1607017803290-8d2e5b9c4c7b?w=1200&q=80">

  <!-- 검색엔진 -->
  <meta name="description" content="Complimentary treatments at Seoul's most prestigious clinics & beauty destinations for international influencers. Free dental, skincare & beauty experiences in Korea.">
  <meta name="keywords"    content="Seoul beauty, Korea clinic, dental whitening, influencer, free treatment, medical tourism, K-beauty">
  <link rel="canonical"    href="https://hospialchehumdam.vercel.app">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root{--gold:#c9a035;--gold-lt:#e8c16a;--dark:#0c0b09;}
    body{font-family:'Inter',sans-serif;background:#faf9f7;color:#1a1a1a;}
    .serif{font-family:'Cormorant Garamond',serif;}
    /* Nav */
    .nav-blur{background:rgba(255,255,255,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);}
    /* Cards */
    .card{background:#fff;border-radius:20px;overflow:hidden;border:1px solid #ede9e2;transition:box-shadow .3s,border-color .3s;display:flex;flex-direction:column;}
    .card:hover{box-shadow:0 16px 48px rgba(0,0,0,.10);border-color:#d4c4a0;}
    .card-img-wrap{position:relative;height:220px;overflow:hidden;background:#f0ede8;flex-shrink:0;}
    .card-img-wrap img{width:100%;height:100%;object-fit:cover;}
    /* Pill */
    .pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;letter-spacing:.3px;}
    .pill-clinic{background:#dbeafe;color:#1d4ed8;}
    .pill-beauty{background:#fce7f3;color:#be185d;}
    /* Filter */
    .f-btn{border:1.5px solid #e2ddd6;color:#888;background:#fff;font-size:13px;font-weight:500;padding:7px 18px;border-radius:99px;cursor:pointer;transition:all .2s;white-space:nowrap;}
    .f-btn.active{border-color:var(--gold);background:#fdf8ef;color:#8a6d3b;}
    /* Gold button */
    .btn-gold{background:linear-gradient(135deg,#c9a035,#e8c16a);color:#fff;font-weight:600;transition:all .2s;border:none;cursor:pointer;}
    .btn-gold:hover{background:linear-gradient(135deg,#b5900a,#d4aa50);box-shadow:0 4px 18px rgba(181,147,90,.4);}
    .btn-gold:disabled{background:#e5e7eb;color:#9ca3af;cursor:not-allowed;box-shadow:none;}
    /* Progress */
    .pbar{height:3px;background:#ede9e2;border-radius:99px;overflow:hidden;}
    .pbar-fill{height:100%;background:linear-gradient(90deg,#c9a035,#e8c16a);border-radius:99px;}
    /* Modal */
    .modal-bg{display:none;position:fixed;inset:0;background:rgba(8,7,6,.65);z-index:999;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);align-items:center;justify-content:center;}
    .modal-bg.open{display:flex;}
    /* Date chip */
    .chip{display:inline-flex;align-items:center;gap:5px;background:#fdf8ef;border:1px solid #e8d9bf;color:#7a5c2a;border-radius:8px;padding:4px 10px;font-size:12px;font-weight:500;}
    .chip button{color:#c9a96e;background:none;border:none;cursor:pointer;font-size:15px;line-height:1;padding:0 0 0 2px;}
    input:focus,textarea:focus,select:focus{outline:none!important;border-color:#c9a035!important;box-shadow:0 0 0 3px rgba(201,160,53,.12)!important;}
    /* Hero */
    .hero{background:linear-gradient(150deg,#0c0b09 0%,#1c1408 55%,#0e0c09 100%);position:relative;overflow:hidden;}
    .hero-noise{position:absolute;inset:0;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
    /* Divider line */
    .gold-line{height:1px;background:linear-gradient(90deg,transparent,#c9a035 40%,#c9a035 60%,transparent);}
    /* Scrollbar */
    ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#f1ede8;}::-webkit-scrollbar-thumb{background:#d4b896;border-radius:99px;}
  </style>
</head>
<body class="min-h-screen">

<!-- ── Nav ─────────────────────────────────── -->
<nav class="nav-blur border-b border-stone-100 sticky top-0 z-50">
  <div class="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
    <div id="logoBtn" class="flex items-center gap-3 cursor-pointer select-none" onclick="handleLogoClick()">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
        <i class="fas fa-seedling text-white text-xs"></i>
      </div>
      <div class="leading-none">
        <div class="text-sm font-bold text-gray-900 tracking-widest uppercase">Seoul Beauty Trip</div>
        <div class="text-[10px] text-gray-400 tracking-wide mt-0.5 hidden sm:block">Influencer Experience Program</div>
      </div>
    </div>
    <div class="w-4"></div>
  </div>
</nav>

<!-- ── Hero ─────────────────────────────────── -->
<section class="hero text-white py-24 sm:py-32 px-5">
  <div class="hero-noise"></div>
  <div class="max-w-6xl mx-auto relative z-10">
    <div class="max-w-xl">
      <div class="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-xs font-medium text-amber-300 mb-7" style="border-color:rgba(201,160,53,.35);background:rgba(201,160,53,.08);">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
        Exclusive for International Creators
      </div>
      <h1 class="serif text-5xl sm:text-6xl font-semibold leading-[1.12] mb-6">
        Seoul's Finest<br>
        <span style="background:linear-gradient(90deg,#c9a035,#f0d585);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Clinics & Beauty</span>
      </h1>
      <p class="text-stone-400 text-[15px] leading-relaxed mb-9 max-w-md">
        Complimentary treatments at Seoul's most prestigious medical and beauty destinations — crafted for international creators ready to share authentic experiences.
      </p>
      <div class="flex flex-wrap gap-6 text-[13px] text-stone-400">
        <span class="flex items-center gap-2"><i class="fas fa-check-circle text-amber-400"></i>Complimentary treatments</span>
        <span class="flex items-center gap-2"><i class="fas fa-check-circle text-amber-400"></i>English-speaking staff</span>
        <span class="flex items-center gap-2"><i class="fas fa-check-circle text-amber-400"></i>All nationalities</span>
      </div>
    </div>
  </div>
</section>

<div class="gold-line"></div>

<!-- ── Filter bar ───────────────────────────── -->
<div class="bg-white/95 backdrop-blur-sm border-b border-stone-100 sticky top-16 z-40">
  <div class="max-w-6xl mx-auto px-5 py-3 flex items-center gap-2.5 overflow-x-auto" style="scrollbar-width:none;">
    <button onclick="filterBy('all')"          data-f="all"          class="f-btn active">All Programs</button>
    <button onclick="filterBy('Clinic')"       data-f="Clinic"       class="f-btn">🏥 Clinic</button>
    <button onclick="filterBy('Beauty Shop')"  data-f="Beauty Shop"  class="f-btn">💄 Beauty Shop</button>
    <div id="campaignCount" class="ml-auto text-xs text-gray-400 bg-stone-100 px-3 py-1.5 rounded-full flex-shrink-0"></div>
  </div>
</div>

<!-- ── Grid ─────────────────────────────────── -->
<main class="max-w-6xl mx-auto px-5 py-12">
  <div id="loading" class="flex flex-col items-center py-28 gap-3">
    <div class="w-7 h-7 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
    <p class="text-sm text-gray-400">Loading programs…</p>
  </div>
  <div id="grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-7 hidden"></div>
  <div id="empty" class="hidden text-center py-28">
    <div class="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <i class="fas fa-search text-2xl text-stone-300"></i>
    </div>
    <p class="text-gray-400 font-medium">No programs found</p>
  </div>
</main>

<!-- ── Footer ───────────────────────────────── -->
<footer class="border-t border-stone-200 bg-white mt-4 py-10 px-5">
  <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
        <i class="fas fa-seedling text-white" style="font-size:9px"></i>
      </div>
      <div>
        <div class="text-sm font-bold text-gray-800 tracking-wide">Seoul Beauty Trip</div>
        <div class="text-[10px] text-gray-400">Influencer Experience Program</div>
      </div>
    </div>
    <p class="text-xs text-gray-300">© 2025 Seoul Beauty Trip · All rights reserved</p>
  </div>
</footer>

<!-- ── Apply Modal ───────────────────────────── -->
<div id="applyModal" class="modal-bg">
  <div class="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
    <div class="px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0" style="background:linear-gradient(135deg,#0c0b09,#1c1408)">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="font-semibold text-white text-base tracking-wide">Apply for Program</h3>
          <p id="applySubtitle" class="text-xs text-amber-300/70 mt-0.5 truncate max-w-xs"></p>
        </div>
        <button onclick="closeApply()" class="text-white/30 hover:text-white/70 ml-4 transition-colors text-lg leading-none">×</button>
      </div>
    </div>
    <form id="applyForm" class="px-6 py-5 space-y-4 overflow-y-auto flex-1">
      <input type="hidden" id="applyCapId">

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name <span class="text-red-400">*</span></label>
          <input id="fName" type="text" placeholder="Your name" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nationality <span class="text-red-400">*</span></label>
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
          <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email <span class="text-red-400">*</span></label>
          <input id="fEmail" type="email" placeholder="your@email.com" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5"><i class="fab fa-whatsapp text-green-500 mr-1"></i>WhatsApp</label>
          <input id="fPhone" type="text" placeholder="+1-000-0000" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
        </div>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5"><i class="fab fa-instagram text-pink-500 mr-1"></i>Instagram <span class="text-red-400">*</span></label>
        <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-amber-500">
          <span class="px-3 text-gray-400 text-sm bg-gray-50 border-r border-gray-200 py-2.5 select-none">@</span>
          <input id="fInsta" type="text" placeholder="your_handle" class="flex-1 px-3 py-2.5 text-sm border-none outline-none bg-white" required>
        </div>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5"><i class="far fa-calendar text-amber-500 mr-1"></i>Available Dates & Times <span class="text-red-400">*</span></label>
        <p class="text-xs text-gray-400 mb-2">Add up to 5 slots — the clinic will confirm one.</p>
        <div class="flex gap-2 items-center flex-wrap">
          <input id="dateInput" type="date" class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm flex-1 min-w-[130px]">
          <select id="timeInput" class="border border-gray-200 rounded-xl px-2.5 py-2.5 text-sm bg-white">
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
          <button type="button" onclick="addDate()" class="btn-gold px-4 py-2.5 rounded-xl text-sm whitespace-nowrap">+ Add</button>
        </div>
        <div id="dateChips" class="flex flex-wrap gap-2 mt-2.5 min-h-[28px]"></div>
        <input type="hidden" id="fDates">
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Message <span class="text-gray-300 font-normal normal-case">(optional)</span></label>
        <textarea id="fMsg" rows="2" placeholder="Any notes for the clinic…" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"></textarea>
      </div>

      <div id="applyErr" class="hidden bg-red-50 text-red-600 text-xs rounded-xl px-4 py-3 border border-red-100"></div>
      <div id="applyOk"  class="hidden bg-green-50 text-green-700 text-xs rounded-xl px-4 py-3 border border-green-100"></div>

      <button type="submit" class="btn-gold w-full py-3 rounded-xl text-sm">Submit Application</button>
      <p class="text-center text-xs text-gray-300">The clinic will reach out to confirm your slot.</p>
    </form>
  </div>
</div>

<!-- ── Detail Modal ───────────────────────────── -->
<div id="detailModal" class="modal-bg">
  <div class="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[92vh] overflow-y-auto shadow-2xl">
    <div id="detailContent"></div>
  </div>
</div>

<script>
let allCampaigns = []
let selectedDates = []

// ── 로고 3번 클릭 → 관리자 이동 ─────────────
let _logoClicks = 0, _logoTimer = null
function handleLogoClick() {
  _logoClicks++
  if (_logoTimer) clearTimeout(_logoTimer)
  if (_logoClicks >= 3) {
    _logoClicks = 0
    window.location.href = '/admin'
    return
  }
  // 1초 안에 3번 클릭
  _logoTimer = setTimeout(() => { _logoClicks = 0 }, 1000)
}

async function loadCampaigns() {
  try {
    const res = await fetch('/api/campaigns')
    const { data } = await res.json()
    allCampaigns = data || []
    render(allCampaigns)
  } catch {
    document.getElementById('loading').innerHTML = '<p class="text-red-400 text-sm text-center py-10">Failed to load programs.</p>'
  }
}

function render(list) {
  const loading = document.getElementById('loading')
  const grid    = document.getElementById('grid')
  const empty   = document.getElementById('empty')
  const count   = document.getElementById('campaignCount')
  loading.classList.add('hidden')
  count.textContent = list.length + (list.length === 1 ? ' program' : ' programs')
  if (!list.length) { grid.classList.add('hidden'); empty.classList.remove('hidden'); return }
  empty.classList.add('hidden'); grid.classList.remove('hidden')

  grid.innerHTML = list.map(c => {
    const full    = c.current_participants >= c.max_participants
    const thumb   = c.place_photo_ref ? \`/api/places/photo?ref=\${c.place_photo_ref}\` : ''
    const mapsUrl = c.place_id ? \`https://www.google.com/maps/place/?q=place_id:\${c.place_id}\` : ''
    const catPill = c.category === 'Clinic'
      ? \`<span class="pill pill-clinic">\${c.category}</span>\`
      : \`<span class="pill pill-beauty">\${c.category}</span>\`

    // Deadline
    let dlBadge = ''
    if (c.deadline) {
      const dlDate   = new Date(c.deadline)
      const today    = new Date(); today.setHours(0,0,0,0)
      const daysLeft = Math.ceil((dlDate - today) / 86400000)
      if (daysLeft < 0)        dlBadge = \`<span class="text-xs text-gray-400">Closed</span>\`
      else if (daysLeft === 0) dlBadge = \`<span class="text-xs font-semibold text-red-500">Last day</span>\`
      else if (daysLeft <= 7)  dlBadge = \`<span class="text-xs font-semibold text-orange-500">\${daysLeft}d left</span>\`
      else                     dlBadge = \`<span class="text-xs text-gray-400">\${dlDate.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>\`
    }

    // Short description (first sentence)
    const shortDesc = c.description ? c.description.split('.')[0] + '.' : ''

    return \`
    <article class="card cursor-pointer" onclick="openDetail(\${c.id})">
      <!-- Image -->
      <div class="card-img-wrap">
        \${thumb
          ? \`<img src="\${thumb}" alt="\${c.place_name}" loading="lazy" onerror="this.style.display='none'">\`
          : \`<div class="w-full h-full flex items-center justify-center"><i class="fas fa-clinic-medical text-5xl text-stone-300"></i></div>\`}
        <!-- Gradient -->
        <div class="absolute inset-0" style="background:linear-gradient(to bottom, rgba(0,0,0,.0) 40%, rgba(0,0,0,.62) 100%)"></div>
        <!-- Fully booked overlay -->
        \${full ? '<div class="absolute inset-0 flex items-center justify-center" style="background:rgba(0,0,0,.52)"><span style="border:1px solid rgba(255,255,255,.3);color:#fff;font-size:11px;font-weight:700;letter-spacing:2px;padding:6px 18px;border-radius:99px;backdrop-filter:blur(6px);">FULLY BOOKED</span></div>' : ''}
        <!-- Top badges -->
        <div class="absolute top-3 left-3 flex items-center gap-1.5">
          \${catPill}
          \${c.place_rating ? \`<span class="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white" style="background:rgba(0,0,0,.45);backdrop-filter:blur(6px)"><span style="color:#f59e0b">★</span>\${c.place_rating}</span>\` : ''}
        </div>
        <!-- Bottom: place + map btn -->
        <div class="absolute bottom-0 left-0 right-0 px-4 pb-3.5 flex items-end justify-between">
          <div class="text-white">
            <p class="text-[11px] text-white/70 mb-0.5"><i class="fas fa-location-dot text-red-400 mr-1"></i>\${c.place_name}</p>
            <h3 class="text-base font-semibold leading-snug" style="font-family:'Cormorant Garamond',serif;letter-spacing:.2px;">\${c.title}</h3>
          </div>
          \${mapsUrl ? \`<a href="\${mapsUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="flex-shrink-0 ml-3 flex items-center gap-1.5 text-white text-[11px] font-medium rounded-full px-3 py-1.5 border transition-colors" style="border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.12);backdrop-filter:blur(8px);" onmouseover="this.style.background='rgba(255,255,255,.22)'" onmouseout="this.style.background='rgba(255,255,255,.12)'"><i class="fas fa-map-location-dot text-xs"></i>Map</a>\` : ''}
        </div>
      </div>

      <!-- Body -->
      <div class="px-5 py-4 flex flex-col flex-1">
        <!-- Description -->
        <p class="text-[13px] text-gray-500 leading-relaxed mb-3 line-clamp-2">\${shortDesc}</p>

        <!-- Benefits -->
        \${c.benefits ? \`<div class="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-4">
          <i class="fas fa-gift text-amber-400 text-xs mt-0.5 flex-shrink-0"></i>
          <p class="text-xs text-amber-800 leading-relaxed line-clamp-2">\${c.benefits}</p>
        </div>\` : ''}

        <!-- Footer row -->
        <div class="flex items-center justify-between mt-auto pt-2 border-t border-stone-100">
          <div class="flex items-center gap-1.5 text-xs text-gray-400">
            <i class="far fa-calendar text-amber-400"></i>
            \${dlBadge}
          </div>
          <button onclick="event.stopPropagation(); openApply(\${c.id})" \${full ? 'disabled' : ''} class="btn-gold px-5 py-2 rounded-xl text-xs font-semibold">
            \${full ? 'Full' : 'Apply Now'}
          </button>
        </div>
      </div>
    </article>\`
  }).join('')
}

function filterBy(cat) {
  document.querySelectorAll('.f-btn').forEach(b => b.classList.toggle('active', b.dataset.f === cat))
  render(cat === 'all' ? allCampaigns : allCampaigns.filter(c => c.category === cat))
}

async function openDetail(id) {
  const { data: c } = await (await fetch('/api/campaigns/' + id)).json()
  const full    = c.current_participants >= c.max_participants
  const thumb   = c.place_photo_ref ? \`/api/places/photo?ref=\${c.place_photo_ref}\` : ''
  const mapsUrl = c.place_id ? \`https://www.google.com/maps/place/?q=place_id:\${c.place_id}\` : ''

  let dlText = 'Open'
  if (c.deadline) {
    const dlDate   = new Date(c.deadline)
    const today    = new Date(); today.setHours(0,0,0,0)
    const daysLeft = Math.ceil((dlDate - today) / 86400000)
    const dlFmt    = dlDate.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})
    if (daysLeft < 0)        dlText = 'Closed'
    else if (daysLeft === 0) dlText = \`Last day! (\${dlFmt})\`
    else if (daysLeft <= 7)  dlText = \`⚡ \${daysLeft} days left — \${dlFmt}\`
    else                     dlText = dlFmt
  }

  document.getElementById('detailContent').innerHTML = \`
    <!-- Hero image -->
    <div class="relative h-64">
      \${thumb
        ? \`<img src="\${thumb}" class="w-full h-full object-cover">\`
        : \`<div class="w-full h-full flex items-center justify-center bg-stone-100"><i class="fas fa-clinic-medical text-6xl text-stone-300"></i></div>\`}
      <div class="absolute inset-0" style="background:linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.75) 100%)"></div>
      <button onclick="closeDetail()" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-white text-sm transition" style="background:rgba(0,0,0,.4);backdrop-filter:blur(6px)">×</button>
      <div class="absolute bottom-0 left-0 right-0 px-6 pb-5">
        <p class="text-white/70 text-xs mb-1.5"><i class="fas fa-location-dot text-red-400 mr-1"></i>\${c.place_name}</p>
        <h2 class="serif text-2xl font-semibold text-white leading-snug">\${c.title}</h2>
      </div>
    </div>

    <!-- Content -->
    <div class="px-6 py-6 space-y-5">

      <!-- Pills row -->
      <div class="flex flex-wrap gap-2">
        \${c.category === 'Clinic' ? '<span class="pill pill-clinic">Clinic</span>' : '<span class="pill pill-beauty">Beauty Shop</span>'}
        \${c.place_rating ? \`<span class="pill" style="background:#fef9ee;color:#92620a"><i class="fas fa-star text-amber-400 mr-1 text-xs"></i>\${c.place_rating} · Verified</span>\` : ''}
      </div>

      <!-- Address + map -->
      \${c.place_address ? \`
      <div class="flex items-start gap-3 rounded-xl px-4 py-3" style="background:#f8f7f5;border:1px solid #ede9e2;">
        <i class="fas fa-location-dot text-red-400 text-sm mt-0.5 flex-shrink-0"></i>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-700 leading-relaxed">\${c.place_address}</p>
          \${mapsUrl ? \`<a href="\${mapsUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 font-medium mt-1.5"><i class="fas fa-arrow-up-right-from-square text-[10px]"></i>Open in Google Maps</a>\` : ''}
        </div>
      </div>\` : ''}

      <!-- Description -->
      \${c.description ? \`<p class="text-[14px] text-gray-600 leading-[1.75]">\${c.description}</p>\` : ''}

      <!-- Benefits -->
      \${c.benefits ? \`
      <div class="rounded-xl p-4" style="background:#fdf8ef;border:1px solid #e8d9bf;">
        <p class="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-2"><i class="fas fa-gift mr-1.5"></i>What You Receive</p>
        <p class="text-sm text-amber-900 leading-relaxed">\${c.benefits}</p>
      </div>\` : ''}

      <!-- Requirements -->
      \${c.requirements ? \`
      <div class="rounded-xl p-4" style="background:#f8f7f5;border:1px solid #ede9e2;">
        <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2"><i class="fas fa-circle-check mr-1.5"></i>Requirements</p>
        <p class="text-sm text-gray-600 leading-relaxed">\${c.requirements}</p>
      </div>\` : ''}

      <!-- Deadline -->
      <p class="text-xs text-gray-400 flex items-center gap-2"><i class="far fa-calendar text-amber-400"></i>Application deadline: <span class="font-medium text-gray-600">\${dlText}</span></p>

      <!-- CTA -->
      \${!full
        ? \`<button onclick="closeDetail(); openApply(\${c.id})" class="btn-gold w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide">Apply Now — It's Free</button>\`
        : \`<div class="w-full text-center py-3.5 rounded-xl text-sm font-medium text-gray-400" style="background:#f3f4f6">This program is fully booked</div>\`}
    </div>\`

  document.getElementById('detailModal').classList.add('open')
}
function closeDetail() { document.getElementById('detailModal').classList.remove('open') }

async function openApply(id) {
  const { data: c } = await (await fetch('/api/campaigns/' + id)).json()
  document.getElementById('applyCapId').value = id
  document.getElementById('applySubtitle').textContent = c.place_name + '  ·  ' + c.title
  document.getElementById('applyErr').classList.add('hidden')
  document.getElementById('applyOk').classList.add('hidden')
  document.getElementById('applyForm').reset()
  document.getElementById('applyCapId').value = id
  selectedDates = []
  renderDateChips()
  document.getElementById('dateInput').min = new Date().toISOString().split('T')[0]
  document.getElementById('timeInput').value = '10:00'
  document.getElementById('applyModal').classList.add('open')
}
function closeApply() { document.getElementById('applyModal').classList.remove('open') }

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
function removeDate(key) { selectedDates = selectedDates.filter(x => x.key !== key); renderDateChips() }
function fmtTime(t) {
  const [h,m] = t.split(':').map(Number)
  const ap = h >= 12 ? 'PM' : 'AM'
  return (h > 12 ? h-12 : h || 12) + ':' + String(m).padStart(2,'0') + ' ' + ap
}
function renderDateChips() {
  const el = document.getElementById('dateChips')
  el.innerHTML = selectedDates.map(({ key, date, time }) => {
    const fmt = new Date(date + 'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})
    const ek  = key.replace(/'/g,"\\'")
    return \`<span class="chip"><i class="far fa-clock text-amber-500 text-[10px]"></i>\${fmt} \${fmtTime(time)}<button type="button" onclick="removeDate('\${ek}')">×</button></span>\`
  }).join('')
  document.getElementById('fDates').value = selectedDates.map(x =>
    new Date(x.date+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) + ' ' + fmtTime(x.time)
  ).join(' / ')
}

document.getElementById('applyForm').addEventListener('submit', async e => {
  e.preventDefault()
  const errEl = document.getElementById('applyErr')
  const okEl  = document.getElementById('applyOk')
  errEl.classList.add('hidden'); okEl.classList.add('hidden')
  if (!selectedDates.length) {
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
    preferred_dates: document.getElementById('fDates').value,
    message: document.getElementById('fMsg').value.trim(),
  }
  const btn = e.target.querySelector('button[type=submit]')
  btn.disabled = true; btn.textContent = 'Submitting…'
  try {
    const res  = await fetch('/api/apply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    const data = await res.json()
    if (data.success) {
      okEl.innerHTML = '✅ ' + data.message; okEl.classList.remove('hidden')
      btn.textContent = 'Done!'
      setTimeout(() => { closeApply(); loadCampaigns() }, 2200)
    } else {
      errEl.textContent = data.error; errEl.classList.remove('hidden')
      btn.disabled = false; btn.textContent = 'Submit Application'
    }
  } catch {
    errEl.textContent = 'Network error. Please try again.'
    errEl.classList.remove('hidden'); btn.disabled = false; btn.textContent = 'Submit Application'
  }
})

document.querySelectorAll('.modal-bg').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open') }))
loadCampaigns()
</script>
</body>
</html>`
}
