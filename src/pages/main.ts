// ════════════════════════════════════════════
// MAIN PAGE  — Mobile-first v2
// ════════════════════════════════════════════
export function mainPageHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seoul Beauty Trip — Influencer Experience Program</title>
  <meta property="og:type"        content="website">
  <meta property="og:title"       content="Seoul Beauty Trip — Influencer Experience Program">
  <meta property="og:description" content="Complimentary treatments at Seoul's most prestigious clinics & beauty destinations — crafted for international creators.">
  <meta property="og:image"       content="https://images.unsplash.com/photo-1607017803290-8d2e5b9c4c7b?w=1200&q=80">
  <meta property="og:url"         content="https://hospialchehumdam.vercel.app">
  <meta name="twitter:card"       content="summary_large_image">
  <meta name="description"        content="Complimentary treatments at Seoul's most prestigious clinics for international influencers.">
  <link rel="canonical"           href="https://hospialchehumdam.vercel.app">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root{--gold:#c9a035;}
    *{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
    body{font-family:'Inter',sans-serif;background:#f6f4f1;color:#1a1a1a;margin:0;}
    .serif{font-family:'Cormorant Garamond',serif;}
    .nav-blur{background:rgba(255,255,255,.94);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);}

    /* ── Card ── */
    .camp-card{background:#fff;border-radius:20px;overflow:hidden;border:1px solid #ede9e2;box-shadow:0 2px 12px rgba(0,0,0,.06);transition:box-shadow .25s,transform .2s;cursor:pointer;}
    .camp-card:active{transform:scale(.985);}
    @media(hover:hover){.camp-card:hover{box-shadow:0 12px 40px rgba(0,0,0,.12);border-color:#d4c4a0;}}

    /* 이미지: aspect-ratio 16/9 → 절대 잘리지 않음 */
    .camp-img-wrap{position:relative;width:100%;padding-top:56.25%;overflow:hidden;background:#ede9e4;}
    .camp-img-wrap img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;}
    .camp-img-wrap .img-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0) 30%,rgba(0,0,0,.72) 100%);}
    .camp-img-wrap .img-top{position:absolute;top:12px;left:12px;display:flex;align-items:center;gap:6px;}
    .camp-img-wrap .img-title{position:absolute;bottom:0;left:0;right:0;padding:0 16px 16px;}
    .camp-img-wrap .img-fb{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#f0ede8;}

    /* Pill */
    .pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;}
    .pill-clinic{background:#dbeafe;color:#1d4ed8;}
    .pill-beauty{background:#fce7f3;color:#be185d;}

    /* Filter */
    .f-btn{border:1.5px solid #e2ddd6;color:#888;background:#fff;font-size:13px;font-weight:500;padding:8px 18px;border-radius:99px;cursor:pointer;transition:all .2s;white-space:nowrap;}
    .f-btn.active{border-color:var(--gold);background:#fdf8ef;color:#8a6d3b;font-weight:600;}

    /* Gold btn */
    .btn-gold{background:linear-gradient(135deg,#c9a035,#e8c16a);color:#fff;font-weight:600;transition:all .2s;border:none;cursor:pointer;}
    .btn-gold:active{transform:scale(.97);}
    .btn-gold:disabled{background:#e5e7eb;color:#9ca3af;cursor:not-allowed;}

    /* Hero */
    .hero{background:linear-gradient(150deg,#0c0b09 0%,#1c1408 55%,#0e0c09 100%);position:relative;overflow:hidden;}
    .hero-noise{position:absolute;inset:0;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
    .gold-line{height:1px;background:linear-gradient(90deg,transparent,#c9a035 40%,#c9a035 60%,transparent);}

    /* Modal / bottomsheet */
    .modal-bg{display:none;position:fixed;inset:0;background:rgba(8,7,6,.6);z-index:999;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);align-items:flex-end;justify-content:center;}
    .modal-bg.open{display:flex;}
    .sheet{width:100%;max-width:560px;max-height:92vh;overflow-y:auto;background:#fff;border-radius:24px 24px 0 0;}
    @media(min-width:640px){.modal-bg{align-items:center;}.sheet{border-radius:24px;margin:16px;}}

    /* Boxes */
    .benefit-box{background:linear-gradient(135deg,#fffbef,#fef3c7);border:1px solid #f0d88a;border-radius:14px;padding:14px 16px;}
    .req-box{background:#f8f7f5;border:1px solid #ede9e2;border-radius:14px;padding:14px 16px;}

    /* Date chip */
    .chip{display:inline-flex;align-items:center;gap:5px;background:#fdf8ef;border:1px solid #e8d9bf;color:#7a5c2a;border-radius:8px;padding:5px 10px;font-size:12px;font-weight:500;}
    .chip button{color:#c9a96e;background:none;border:none;cursor:pointer;font-size:16px;line-height:1;padding:0 0 0 2px;}

    input:focus,textarea:focus,select:focus{outline:none!important;border-color:#c9a035!important;box-shadow:0 0 0 3px rgba(201,160,53,.12)!important;}
    ::-webkit-scrollbar{width:4px;height:4px;}
    ::-webkit-scrollbar-thumb{background:#d4b896;border-radius:99px;}

    /* Venue name row */
    .venue-row{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;padding:12px 16px;background:#f8f7f5;border-bottom:1px solid #f0ede8;}
    .map-btn{flex-shrink:0;display:inline-flex;align-items:center;gap:5px;font-size:11px;color:#3b82f6;font-weight:600;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:5px 10px;text-decoration:none;white-space:nowrap;}
  </style>
</head>
<body class="min-h-screen">

<!-- Nav -->
<nav class="nav-blur border-b border-stone-100 sticky top-0 z-50">
  <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
    <div id="logoBtn" class="flex items-center gap-2.5 cursor-pointer select-none" onclick="handleLogoClick()">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
        <i class="fas fa-seedling text-white text-xs"></i>
      </div>
      <div class="leading-none">
        <div class="text-sm font-bold text-gray-900 tracking-widest uppercase">Seoul Beauty Trip</div>
        <div class="text-[10px] text-gray-400 tracking-wide mt-0.5">Influencer Experience Program</div>
      </div>
    </div>
  </div>
</nav>

<!-- Hero -->
<section class="hero text-white px-4 py-12 sm:py-20">
  <div class="hero-noise"></div>
  <div class="max-w-2xl mx-auto relative z-10">
    <div class="inline-flex items-center gap-2 border rounded-full px-3 py-1 text-xs font-medium text-amber-300 mb-5" style="border-color:rgba(201,160,53,.35);background:rgba(201,160,53,.08);">
      <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
      Exclusive for International Creators
    </div>
    <h1 class="serif text-4xl sm:text-5xl font-semibold leading-[1.15] mb-4">
      Seoul's Finest<br>
      <span style="background:linear-gradient(90deg,#c9a035,#f0d585);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Clinics & Beauty</span>
    </h1>
    <p class="text-stone-400 text-sm leading-relaxed mb-6 max-w-sm">Complimentary treatments at Seoul's most prestigious destinations — crafted for international creators.</p>
    <div class="flex flex-wrap gap-4 text-xs text-stone-400">
      <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-amber-400"></i>Free treatments</span>
      <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-amber-400"></i>English-speaking staff</span>
      <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-amber-400"></i>All nationalities</span>
    </div>
  </div>
</section>

<div class="gold-line"></div>

<!-- Filter bar -->
<div class="bg-white/95 backdrop-blur-sm border-b border-stone-100 sticky top-14 z-40">
  <div class="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-2 overflow-x-auto" style="scrollbar-width:none;-webkit-overflow-scrolling:touch;">
    <button onclick="filterBy('all')"         data-f="all"         class="f-btn active">All</button>
    <button onclick="filterBy('Clinic')"      data-f="Clinic"      class="f-btn">🏥 Clinic</button>
    <button onclick="filterBy('Beauty Shop')" data-f="Beauty Shop" class="f-btn">💄 Beauty</button>
    <div id="campaignCount" class="ml-auto text-xs text-gray-400 bg-stone-100 px-3 py-1.5 rounded-full flex-shrink-0 whitespace-nowrap"></div>
  </div>
</div>

<!-- Card list -->
<main class="max-w-2xl mx-auto px-4 py-6 space-y-5">
  <div id="loading" class="flex flex-col items-center py-24 gap-3">
    <div class="w-7 h-7 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
    <p class="text-sm text-gray-400">Loading programs…</p>
  </div>
  <div id="grid" class="hidden space-y-5"></div>
  <div id="empty" class="hidden text-center py-24">
    <div class="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <i class="fas fa-search text-2xl text-stone-300"></i>
    </div>
    <p class="text-gray-400 font-medium">No programs found</p>
  </div>
</main>

<!-- Footer -->
<footer class="border-t border-stone-200 bg-white mt-2 py-8 px-4">
  <div class="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
    <div class="flex items-center gap-2">
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

<!-- Apply Modal -->
<div id="applyModal" class="modal-bg">
  <div class="sheet">
    <div class="flex justify-center pt-3 pb-1 sm:hidden"><div class="w-10 h-1 bg-gray-200 rounded-full"></div></div>
    <div class="px-5 pt-4 pb-4 border-b border-gray-100" style="background:linear-gradient(135deg,#0c0b09,#1c1408)">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="font-semibold text-white text-base">Apply for Program</h3>
          <p id="applySubtitle" class="text-xs text-amber-300/70 mt-0.5 max-w-[260px]" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></p>
        </div>
        <button onclick="closeApply()" class="text-white/40 hover:text-white ml-4 text-2xl leading-none">×</button>
      </div>
    </div>
    <form id="applyForm" class="px-5 py-5 space-y-4">
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
          <input id="fPhone" type="tel" placeholder="+1-000-0000" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
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
        <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5"><i class="far fa-calendar text-amber-500 mr-1"></i>Available Dates &amp; Times <span class="text-red-400">*</span></label>
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
      <button type="submit" class="btn-gold w-full py-3.5 rounded-xl text-sm font-semibold">Submit Application</button>
      <p class="text-center text-xs text-gray-300 pb-2">The clinic will reach out to confirm your slot.</p>
    </form>
  </div>
</div>

<!-- Detail Modal -->
<div id="detailModal" class="modal-bg">
  <div class="sheet">
    <div class="flex justify-center pt-3 pb-1 sm:hidden"><div class="w-10 h-1 bg-gray-200 rounded-full"></div></div>
    <div id="detailContent"></div>
  </div>
</div>

<script>
let allCampaigns = []
let selectedDates = []

let _lc = 0, _lt = null
function handleLogoClick() {
  _lc++
  if (_lt) clearTimeout(_lt)
  if (_lc >= 3) { _lc = 0; window.location.href = '/admin'; return }
  _lt = setTimeout(function(){ _lc = 0 }, 1000)
}

async function loadCampaigns() {
  try {
    const res = await fetch('/api/campaigns')
    const d = await res.json()
    allCampaigns = d.data || []
    render(allCampaigns)
  } catch(e) {
    document.getElementById('loading').innerHTML = '<p style="color:#f87171;font-size:14px;text-align:center;padding:40px 0">Failed to load programs.</p>'
  }
}

function imgFallback(el) {
  var wrap = el.parentNode
  el.style.display = 'none'
  var fb = document.createElement('div')
  fb.className = 'img-fb'
  fb.innerHTML = '<i class="fas fa-clinic-medical" style="font-size:3rem;color:#d1cdc8"></i>'
  wrap.appendChild(fb)
}

function render(list) {
  document.getElementById('loading').classList.add('hidden')
  var count = document.getElementById('campaignCount')
  count.textContent = list.length + (list.length === 1 ? ' program' : ' programs')
  var grid  = document.getElementById('grid')
  var empty = document.getElementById('empty')
  if (!list.length) {
    grid.classList.add('hidden'); empty.classList.remove('hidden'); return
  }
  empty.classList.add('hidden'); grid.classList.remove('hidden')

  grid.innerHTML = list.map(function(c) {
    var full    = c.current_participants >= c.max_participants
    var thumb   = c.place_photo_ref ? '/api/places/photo?ref=' + c.place_photo_ref : ''
    var mapsUrl = c.place_id ? 'https://www.google.com/maps/place/?q=place_id:' + c.place_id : ''

    var catPill = c.category === 'Clinic'
      ? '<span class="pill pill-clinic"><i class="fas fa-hospital-alt" style="font-size:10px;margin-right:3px"></i>' + c.category + '</span>'
      : '<span class="pill pill-beauty"><i class="fas fa-spa" style="font-size:10px;margin-right:3px"></i>' + c.category + '</span>'

    var ratingBadge = c.place_rating
      ? '<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(0,0,0,.45);backdrop-filter:blur(6px);border-radius:99px;padding:2px 8px;font-size:11px;font-weight:600;color:#fff"><span style="color:#f59e0b">★</span>' + c.place_rating + '</span>'
      : ''

    var dlBadge = '<span style="font-size:12px;color:#22c55e;font-weight:500">Open now</span>'
    if (c.deadline) {
      var dlDate = new Date(c.deadline)
      var today  = new Date(); today.setHours(0,0,0,0)
      var daysLeft = Math.ceil((dlDate - today) / 86400000)
      if (daysLeft < 0)       dlBadge = '<span style="font-size:12px;color:#9ca3af">Closed</span>'
      else if (daysLeft === 0) dlBadge = '<span style="font-size:12px;color:#ef4444;font-weight:600">Last day!</span>'
      else if (daysLeft <= 7) dlBadge = '<span style="font-size:12px;color:#f97316;font-weight:600">⚡ ' + daysLeft + ' days left</span>'
      else                    dlBadge = '<span style="font-size:12px;color:#9ca3af">' + dlDate.toLocaleDateString('en-US',{month:'short',day:'numeric'}) + '</span>'
    }

    // 주소 뒤 2~3 파트만 표시 (너무 길지 않게)
    var shortAddr = ''
    if (c.place_address) {
      var parts = c.place_address.split(',')
      shortAddr = parts.slice(-3).join(',').trim()
    }

    var mapBtnHtml = mapsUrl
      ? '<a href="' + mapsUrl + '" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="map-btn"><i class="fas fa-map-location-dot" style="font-size:11px"></i>Map</a>'
      : ''

    var imgHtml = thumb
      ? '<img src="' + thumb + '" alt="' + c.place_name + '" loading="lazy" onerror="imgFallback(this)">'
      : '<div class="img-fb"><i class="fas fa-clinic-medical" style="font-size:3rem;color:#d1cdc8"></i></div>'

    var bookedOverlay = full
      ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center"><span style="border:1px solid rgba(255,255,255,.35);color:#fff;font-size:11px;font-weight:700;letter-spacing:2px;padding:7px 20px;border-radius:99px;backdrop-filter:blur(6px)">FULLY BOOKED</span></div>'
      : ''

    var benefitsHtml = c.benefits
      ? '<div class="benefit-box" style="display:flex;align-items:flex-start;gap:10px">' +
          '<i class="fas fa-gift" style="color:#f59e0b;font-size:14px;margin-top:2px;flex-shrink:0"></i>' +
          '<div><p style="font-size:11px;font-weight:700;color:#b45309;text-transform:uppercase;letter-spacing:.5px;margin:0 0 4px">What You Get</p>' +
          '<p style="font-size:13px;color:#78350f;line-height:1.6;margin:0">' + c.benefits + '</p></div>' +
        '</div>'
      : ''

    var reqHtml = c.requirements
      ? '<div class="req-box" style="display:flex;align-items:flex-start;gap:10px">' +
          '<i class="fas fa-circle-check" style="color:#9ca3af;font-size:14px;margin-top:2px;flex-shrink:0"></i>' +
          '<div><p style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin:0 0 4px">Requirements</p>' +
          '<p style="font-size:13px;color:#4b5563;line-height:1.6;margin:0">' + c.requirements + '</p></div>' +
        '</div>'
      : ''

    var descHtml = c.description
      ? '<p style="font-size:13.5px;line-height:1.75;color:#555;margin:0">' + c.description + '</p>'
      : ''

    var applyBtn = '<button onclick="event.stopPropagation(); openApply(' + c.id + ')" ' + (full ? 'disabled' : '') +
      ' class="btn-gold" style="padding:10px 20px;border-radius:12px;font-size:12px;font-weight:600">' +
      (full ? 'Full' : 'Apply Now') + '</button>'

    return '<article class="camp-card" onclick="openDetail(' + c.id + ')">' +

      // 이미지 (16:9 비율 유지)
      '<div class="camp-img-wrap">' +
        imgHtml +
        '<div class="img-overlay"></div>' +
        bookedOverlay +
        '<div class="img-top">' + catPill + ratingBadge + '</div>' +
        '<div class="img-title">' +
          '<h3 style="font-family:\'Cormorant Garamond\',serif;font-size:19px;font-weight:600;color:#fff;line-height:1.25;margin:0">' + c.title + '</h3>' +
        '</div>' +
      '</div>' +

      // 업체명 + 주소 + 지도버튼
      '<div class="venue-row">' +
        '<div style="min-width:0">' +
          '<p style="font-size:13px;font-weight:700;color:#1f2937;margin:0;line-height:1.3">' + c.place_name + '</p>' +
          (shortAddr ? '<p style="font-size:11px;color:#9ca3af;margin:3px 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><i class="fas fa-location-dot" style="color:#f87171;margin-right:3px"></i>' + shortAddr + '</p>' : '') +
        '</div>' +
        mapBtnHtml +
      '</div>' +

      // 본문
      '<div style="padding:14px 16px;display:flex;flex-direction:column;gap:12px">' +
        descHtml +
        benefitsHtml +
        reqHtml +
        // 하단 바
        '<div style="display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid #f0ede8">' +
          '<div style="display:flex;align-items:center;gap:6px"><i class="far fa-calendar" style="color:#f59e0b;font-size:12px"></i>' + dlBadge + '</div>' +
          applyBtn +
        '</div>' +
      '</div>' +

    '</article>'
  }).join('')
}

function filterBy(cat) {
  document.querySelectorAll('.f-btn').forEach(function(b){ b.classList.toggle('active', b.dataset.f === cat) })
  render(cat === 'all' ? allCampaigns : allCampaigns.filter(function(c){ return c.category === cat }))
}

async function openDetail(id) {
  var r = await (await fetch('/api/campaigns/' + id)).json()
  var c = r.data
  var full    = c.current_participants >= c.max_participants
  var thumb   = c.place_photo_ref ? '/api/places/photo?ref=' + c.place_photo_ref : ''
  var mapsUrl = c.place_id ? 'https://www.google.com/maps/place/?q=place_id:' + c.place_id : ''

  var dlText = 'Open'
  if (c.deadline) {
    var dlDate = new Date(c.deadline)
    var today  = new Date(); today.setHours(0,0,0,0)
    var daysLeft = Math.ceil((dlDate - today) / 86400000)
    var dlFmt = dlDate.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})
    if (daysLeft < 0)       dlText = 'Closed'
    else if (daysLeft === 0) dlText = 'Last day! (' + dlFmt + ')'
    else if (daysLeft <= 7) dlText = '⚡ ' + daysLeft + ' days left — ' + dlFmt
    else                    dlText = dlFmt
  }

  var imgPart = thumb
    ? '<img src="' + thumb + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\'">'
    : '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#f0ede8"><i class="fas fa-clinic-medical" style="font-size:4rem;color:#d1cdc8"></i></div>'

  var addrPart = c.place_address
    ? '<div style="display:flex;align-items:flex-start;gap:10px;background:#f8f7f5;border:1px solid #ede9e2;border-radius:14px;padding:12px 14px">' +
        '<i class="fas fa-location-dot" style="color:#f87171;font-size:14px;margin-top:2px;flex-shrink:0"></i>' +
        '<div>' +
          '<p style="font-size:13px;color:#374151;line-height:1.6;margin:0">' + c.place_address + '</p>' +
          (mapsUrl ? '<a href="' + mapsUrl + '" target="_blank" rel="noopener" style="font-size:12px;color:#3b82f6;font-weight:500;display:inline-flex;align-items:center;gap:4px;margin-top:6px"><i class="fas fa-arrow-up-right-from-square" style="font-size:10px"></i>Open in Google Maps</a>' : '') +
        '</div>' +
      '</div>'
    : ''

  var ctaHtml = !full
    ? '<button onclick="closeDetail(); openApply(' + c.id + ')" class="btn-gold" style="width:100%;padding:16px;border-radius:16px;font-size:14px;font-weight:600;letter-spacing:.3px">Apply Now — It\'s Free</button>'
    : '<div style="width:100%;text-align:center;padding:16px;border-radius:16px;font-size:14px;font-weight:500;color:#9ca3af;background:#f3f4f6">This program is fully booked</div>'

  var ratingPill = c.place_rating
    ? '<span class="pill" style="background:#fef9ee;color:#92620a"><i class="fas fa-star" style="color:#f59e0b;font-size:10px;margin-right:3px"></i>' + c.place_rating + ' · Verified</span>'
    : ''

  document.getElementById('detailContent').innerHTML =
    // Hero image 16:9
    '<div style="position:relative;width:100%;padding-top:56.25%;background:#ede9e4;overflow:hidden">' +
      imgPart +
      '<div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 25%,rgba(0,0,0,.78) 100%)"></div>' +
      '<button onclick="closeDetail()" style="position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.4);backdrop-filter:blur(6px);border:none;color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center">×</button>' +
      '<div style="position:absolute;bottom:0;left:0;right:0;padding:0 20px 18px">' +
        '<p style="font-size:11px;color:rgba(255,255,255,.7);margin:0 0 6px"><i class="fas fa-location-dot" style="color:#f87171;margin-right:4px"></i>' + c.place_name + '</p>' +
        '<h2 style="font-family:\'Cormorant Garamond\',serif;font-size:24px;font-weight:600;color:#fff;line-height:1.25;margin:0">' + c.title + '</h2>' +
      '</div>' +
    '</div>' +
    // Content
    '<div style="padding:20px 20px 28px;display:flex;flex-direction:column;gap:16px">' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
        (c.category === 'Clinic' ? '<span class="pill pill-clinic">Clinic</span>' : '<span class="pill pill-beauty">Beauty Shop</span>') +
        ratingPill +
      '</div>' +
      addrPart +
      (c.description ? '<p style="font-size:14px;color:#4b5563;line-height:1.8;margin:0">' + c.description + '</p>' : '') +
      (c.benefits ? '<div class="benefit-box"><p style="font-size:11px;font-weight:700;color:#b45309;text-transform:uppercase;letter-spacing:.5px;margin:0 0 6px"><i class="fas fa-gift" style="margin-right:5px"></i>What You Receive</p><p style="font-size:13px;color:#78350f;line-height:1.65;margin:0">' + c.benefits + '</p></div>' : '') +
      (c.requirements ? '<div class="req-box"><p style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin:0 0 6px"><i class="fas fa-circle-check" style="margin-right:5px"></i>Requirements</p><p style="font-size:13px;color:#4b5563;line-height:1.65;margin:0">' + c.requirements + '</p></div>' : '') +
      '<p style="font-size:12px;color:#9ca3af;display:flex;align-items:center;gap:6px;margin:0"><i class="far fa-calendar" style="color:#f59e0b"></i>Deadline: <span style="font-weight:500;color:#374151">' + dlText + '</span></p>' +
      ctaHtml +
      '<div style="height:8px"></div>' +
    '</div>'

  document.getElementById('detailModal').classList.add('open')
}
function closeDetail(){ document.getElementById('detailModal').classList.remove('open') }

async function openApply(id) {
  var r = await (await fetch('/api/campaigns/' + id)).json()
  var c = r.data
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
function closeApply(){ document.getElementById('applyModal').classList.remove('open') }

function addDate() {
  var dateVal = document.getElementById('dateInput').value
  var timeVal = document.getElementById('timeInput').value
  if (!dateVal) { alert('Please select a date.'); return }
  var key = dateVal + '|' + timeVal
  if (selectedDates.find(function(x){ return x.key === key })) return
  if (selectedDates.length >= 5) { alert('You can add up to 5 slots.'); return }
  selectedDates.push({ key:key, date:dateVal, time:timeVal })
  selectedDates.sort(function(a,b){ return a.key.localeCompare(b.key) })
  renderDateChips()
  document.getElementById('dateInput').value = ''
}
function removeDate(key){ selectedDates = selectedDates.filter(function(x){ return x.key !== key }); renderDateChips() }
function fmtTime(t) {
  var parts = t.split(':'); var h = parseInt(parts[0]); var m = parseInt(parts[1])
  var ap = h >= 12 ? 'PM' : 'AM'
  return (h > 12 ? h-12 : h || 12) + ':' + (m < 10 ? '0'+m : m) + ' ' + ap
}
function renderDateChips() {
  var el = document.getElementById('dateChips')
  el.innerHTML = selectedDates.map(function(s) {
    var fmt = new Date(s.date + 'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})
    var ek  = s.key.replace(/'/g, "\\'")
    return '<span class="chip"><i class="far fa-clock" style="color:#f59e0b;font-size:10px"></i>' + fmt + ' ' + fmtTime(s.time) + '<button type="button" onclick="removeDate(\'' + ek + '\')">×</button></span>'
  }).join('')
  document.getElementById('fDates').value = selectedDates.map(function(x){
    return new Date(x.date+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) + ' ' + fmtTime(x.time)
  }).join(' / ')
}

document.getElementById('applyForm').addEventListener('submit', async function(e) {
  e.preventDefault()
  var errEl = document.getElementById('applyErr')
  var okEl  = document.getElementById('applyOk')
  errEl.classList.add('hidden'); okEl.classList.add('hidden')
  if (!selectedDates.length) {
    errEl.textContent = 'Please add at least one available date & time.'
    errEl.classList.remove('hidden'); return
  }
  var body = {
    campaign_id:     parseInt(document.getElementById('applyCapId').value),
    applicant_name:  document.getElementById('fName').value.trim(),
    nationality:     document.getElementById('fNation').value,
    email:           document.getElementById('fEmail').value.trim(),
    phone:           document.getElementById('fPhone').value.trim(),
    instagram:       document.getElementById('fInsta').value.trim().replace(/^@/,''),
    preferred_dates: document.getElementById('fDates').value,
    message:         document.getElementById('fMsg').value.trim(),
  }
  var btn = e.target.querySelector('button[type=submit]')
  btn.disabled = true; btn.textContent = 'Submitting…'
  try {
    var res  = await fetch('/api/apply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    var data = await res.json()
    if (data.success) {
      okEl.innerHTML = '✅ ' + data.message; okEl.classList.remove('hidden')
      btn.textContent = 'Done!'
      setTimeout(function(){ closeApply(); loadCampaigns() }, 2200)
    } else {
      errEl.textContent = data.error; errEl.classList.remove('hidden')
      btn.disabled = false; btn.textContent = 'Submit Application'
    }
  } catch(e) {
    errEl.textContent = 'Network error. Please try again.'
    errEl.classList.remove('hidden'); btn.disabled = false; btn.textContent = 'Submit Application'
  }
})

document.querySelectorAll('.modal-bg').forEach(function(m){
  m.addEventListener('click', function(e){ if (e.target === m) m.classList.remove('open') })
})

loadCampaigns()
</script>
</body>
</html>`
}
