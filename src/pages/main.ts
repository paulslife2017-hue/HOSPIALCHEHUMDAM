// ════════════════════════════════════════════
// MAIN PAGE  — Mobile-first redesign
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
  <meta name="description"        content="Complimentary treatments at Seoul's most prestigious clinics & beauty destinations for international influencers.">
  <link rel="canonical"           href="https://hospialchehumdam.vercel.app">

  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

  <style>
    :root{--gold:#c9a035;--gold-lt:#e8c16a;--dark:#0c0b09;}
    *{-webkit-tap-highlight-color:transparent;}
    body{font-family:'Inter',sans-serif;background:#f6f4f1;color:#1a1a1a;}
    .serif{font-family:'Cormorant Garamond',serif;}

    /* Nav */
    .nav-blur{background:rgba(255,255,255,.94);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);}

    /* ── Campaign Card (mobile-first vertical) ── */
    .camp-card{
      background:#fff;border-radius:20px;overflow:hidden;
      border:1px solid #ede9e2;
      box-shadow:0 2px 12px rgba(0,0,0,.06);
      transition:box-shadow .25s,transform .2s;
      cursor:pointer;
    }
    .camp-card:active{transform:scale(.985);}
    @media(hover:hover){
      .camp-card:hover{box-shadow:0 12px 40px rgba(0,0,0,.12);border-color:#d4c4a0;}
    }
    .camp-img{position:relative;height:200px;overflow:hidden;background:#ede9e4;flex-shrink:0;}
    .camp-img img{width:100%;height:100%;object-fit:cover;display:block;}

    /* Pill */
    .pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;letter-spacing:.3px;}
    .pill-clinic{background:#dbeafe;color:#1d4ed8;}
    .pill-beauty{background:#fce7f3;color:#be185d;}

    /* Filter */
    .f-btn{border:1.5px solid #e2ddd6;color:#888;background:#fff;font-size:13px;font-weight:500;padding:8px 18px;border-radius:99px;cursor:pointer;transition:all .2s;white-space:nowrap;-webkit-tap-highlight-color:transparent;}
    .f-btn.active{border-color:var(--gold);background:#fdf8ef;color:#8a6d3b;font-weight:600;}

    /* Buttons */
    .btn-gold{background:linear-gradient(135deg,#c9a035,#e8c16a);color:#fff;font-weight:600;transition:all .2s;border:none;cursor:pointer;}
    .btn-gold:active{transform:scale(.97);}
    .btn-gold:disabled{background:#e5e7eb;color:#9ca3af;cursor:not-allowed;}

    /* Hero */
    .hero{background:linear-gradient(150deg,#0c0b09 0%,#1c1408 55%,#0e0c09 100%);position:relative;overflow:hidden;}
    .hero-noise{position:absolute;inset:0;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
    .gold-line{height:1px;background:linear-gradient(90deg,transparent,#c9a035 40%,#c9a035 60%,transparent);}

    /* Modal */
    .modal-bg{display:none;position:fixed;inset:0;background:rgba(8,7,6,.6);z-index:999;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);align-items:flex-end;justify-content:center;}
    .modal-bg.open{display:flex;}
    /* 모달 바텀시트 스타일 */
    .sheet{width:100%;max-width:560px;max-height:92vh;overflow-y:auto;background:#fff;border-radius:24px 24px 0 0;}
    @media(min-width:640px){
      .modal-bg{align-items:center;}
      .sheet{border-radius:24px;margin:16px;}
    }

    /* Date chip */
    .chip{display:inline-flex;align-items:center;gap:5px;background:#fdf8ef;border:1px solid #e8d9bf;color:#7a5c2a;border-radius:8px;padding:5px 10px;font-size:12px;font-weight:500;}
    .chip button{color:#c9a96e;background:none;border:none;cursor:pointer;font-size:16px;line-height:1;padding:0 0 0 2px;}

    input:focus,textarea:focus,select:focus{outline:none!important;border-color:#c9a035!important;box-shadow:0 0 0 3px rgba(201,160,53,.12)!important;}

    /* Benefits 박스 */
    .benefit-box{background:linear-gradient(135deg,#fffbef,#fef3c7);border:1px solid #f0d88a;border-radius:14px;padding:14px 16px;}
    .req-box{background:#f8f7f5;border:1px solid #ede9e2;border-radius:14px;padding:14px 16px;}

    /* 스크롤바 */
    ::-webkit-scrollbar{width:4px;height:4px;}
    ::-webkit-scrollbar-thumb{background:#d4b896;border-radius:99px;}

    /* 카드 body 설명 */
    .desc-text{font-size:13.5px;line-height:1.7;color:#555;margin:0;}
  </style>
</head>
<body class="min-h-screen">

<!-- ── Nav ──────────────────────────────────────── -->
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

<!-- ── Hero (모바일 압축) ────────────────────────── -->
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
    <p class="text-stone-400 text-sm leading-relaxed mb-7 max-w-sm">
      Complimentary treatments at Seoul's most prestigious destinations — crafted for international creators.
    </p>
    <div class="flex flex-wrap gap-4 text-xs text-stone-400">
      <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-amber-400"></i>Free treatments</span>
      <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-amber-400"></i>English-speaking staff</span>
      <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-amber-400"></i>All nationalities</span>
    </div>
  </div>
</section>

<div class="gold-line"></div>

<!-- ── Filter bar ───────────────────────────────── -->
<div class="bg-white/95 backdrop-blur-sm border-b border-stone-100 sticky top-14 z-40">
  <div class="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-2 overflow-x-auto" style="scrollbar-width:none;-webkit-overflow-scrolling:touch;">
    <button onclick="filterBy('all')"         data-f="all"         class="f-btn active">All</button>
    <button onclick="filterBy('Clinic')"      data-f="Clinic"      class="f-btn">🏥 Clinic</button>
    <button onclick="filterBy('Beauty Shop')" data-f="Beauty Shop" class="f-btn">💄 Beauty</button>
    <div id="campaignCount" class="ml-auto text-xs text-gray-400 bg-stone-100 px-3 py-1.5 rounded-full flex-shrink-0 whitespace-nowrap"></div>
  </div>
</div>

<!-- ── Card list ─────────────────────────────────── -->
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

<!-- ── Footer ───────────────────────────────────── -->
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

<!-- ── Apply Modal (바텀시트) ───────────────────── -->
<div id="applyModal" class="modal-bg">
  <div class="sheet">
    <!-- 핸들 -->
    <div class="flex justify-center pt-3 pb-1 sm:hidden">
      <div class="w-10 h-1 bg-gray-200 rounded-full"></div>
    </div>
    <div class="px-5 pt-4 pb-4 border-b border-gray-100 flex-shrink-0" style="background:linear-gradient(135deg,#0c0b09,#1c1408)">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="font-semibold text-white text-base">Apply for Program</h3>
          <p id="applySubtitle" class="text-xs text-amber-300/70 mt-0.5 truncate max-w-[260px]"></p>
        </div>
        <button onclick="closeApply()" class="text-white/30 hover:text-white/70 ml-4 text-2xl leading-none">×</button>
      </div>
    </div>
    <form id="applyForm" class="px-5 py-5 space-y-4 overflow-y-auto">
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

      <button type="submit" class="btn-gold w-full py-3.5 rounded-xl text-sm font-semibold">Submit Application</button>
      <p class="text-center text-xs text-gray-300 pb-2">The clinic will reach out to confirm your slot.</p>
    </form>
  </div>
</div>

<!-- ── Detail Modal (바텀시트) ──────────────────── -->
<div id="detailModal" class="modal-bg">
  <div class="sheet">
    <div class="flex justify-center pt-3 pb-1 sm:hidden">
      <div class="w-10 h-1 bg-gray-200 rounded-full"></div>
    </div>
    <div id="detailContent"></div>
  </div>
</div>

<script>
let allCampaigns = []
let selectedDates = []

// ── 로고 3번 클릭 → 관리자
let _lc = 0, _lt = null
function handleLogoClick() {
  _lc++
  if (_lt) clearTimeout(_lt)
  if (_lc >= 3) { _lc = 0; window.location.href = '/admin'; return }
  _lt = setTimeout(() => { _lc = 0 }, 1000)
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
      ? \`<span class="pill pill-clinic"><i class="fas fa-hospital-alt mr-1 text-[10px]"></i>\${c.category}</span>\`
      : \`<span class="pill pill-beauty"><i class="fas fa-spa mr-1 text-[10px]"></i>\${c.category}</span>\`

    // Deadline badge
    let dlBadge = \`<span class="text-xs text-green-500 font-medium">Open now</span>\`
    if (c.deadline) {
      const dlDate   = new Date(c.deadline)
      const today    = new Date(); today.setHours(0,0,0,0)
      const daysLeft = Math.ceil((dlDate - today) / 86400000)
      if (daysLeft < 0)        dlBadge = \`<span class="text-xs text-gray-400">Closed</span>\`
      else if (daysLeft === 0) dlBadge = \`<span class="text-xs font-semibold text-red-500">Last day!</span>\`
      else if (daysLeft <= 7)  dlBadge = \`<span class="text-xs font-semibold text-orange-500">⚡ \${daysLeft} days left</span>\`
      else                     dlBadge = \`<span class="text-xs text-gray-400">\${dlDate.toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>\`
    }

    return \`
    <article class="camp-card" onclick="openDetail(\${c.id})">

      <!-- ① 이미지 영역 -->
      <div class="camp-img">
        \${thumb
          ? \`<img src="\${thumb}" alt="\${c.place_name}" loading="lazy" onerror="this.parentElement.innerHTML='<div style=\\"width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0ede8\\"><i class=\\"fas fa-clinic-medical\\" style=\\"font-size:3rem;color:#d1cdc8\\"></i></div>'">\`
          : \`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0ede8"><i class="fas fa-clinic-medical" style="font-size:3rem;color:#d1cdc8"></i></div>\`}

        <!-- 다크 그라디언트 -->
        <div class="absolute inset-0" style="background:linear-gradient(to bottom,rgba(0,0,0,0) 35%,rgba(0,0,0,.68) 100%)"></div>

        <!-- FULLY BOOKED 오버레이 -->
        \${full ? \`<div class="absolute inset-0 flex items-center justify-center" style="background:rgba(0,0,0,.5)">
          <span style="border:1px solid rgba(255,255,255,.35);color:#fff;font-size:11px;font-weight:700;letter-spacing:2px;padding:7px 20px;border-radius:99px;backdrop-filter:blur(6px);">FULLY BOOKED</span>
        </div>\` : ''}

        <!-- 카테고리 + 별점 (상단) -->
        <div class="absolute top-3 left-3 flex items-center gap-1.5">
          \${catPill}
          \${c.place_rating ? \`<span class="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white" style="background:rgba(0,0,0,.45);backdrop-filter:blur(6px)"><span style="color:#f59e0b">★</span>\${c.place_rating}</span>\` : ''}
        </div>

        <!-- 장소명 + 타이틀 (하단) -->
        <div class="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <p class="text-[11px] text-white/70 mb-1 flex items-center gap-1">
            <i class="fas fa-location-dot text-red-400"></i>\${c.place_name}
          </p>
          <h3 class="text-[17px] font-semibold leading-snug text-white" style="font-family:'Cormorant Garamond',serif;">\${c.title}</h3>
        </div>
      </div>

      <!-- ② 본문 영역 -->
      <div class="px-4 pt-4 pb-4 flex flex-col gap-3">

        <!-- 설명 — 전체 표시, 잘림 없음 -->
        \${c.description
          ? \`<p class="desc-text">\${c.description}</p>\`
          : \`<p class="text-sm text-gray-400 italic">Tap to see details</p>\`}

        <!-- 혜택 박스 -->
        \${c.benefits ? \`
        <div class="benefit-box flex items-start gap-2.5">
          <i class="fas fa-gift text-amber-500 text-sm mt-0.5 flex-shrink-0"></i>
          <div>
            <p class="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">What You Get</p>
            <p class="text-[13px] text-amber-900 leading-relaxed">\${c.benefits}</p>
          </div>
        </div>\` : ''}

        <!-- 지원 조건 -->
        \${c.requirements ? \`
        <div class="req-box flex items-start gap-2.5">
          <i class="fas fa-circle-check text-gray-400 text-sm mt-0.5 flex-shrink-0"></i>
          <div>
            <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Requirements</p>
            <p class="text-[13px] text-gray-600 leading-relaxed">\${c.requirements}</p>
          </div>
        </div>\` : ''}

        <!-- 하단 바: 마감 + 지도 + 신청 버튼 -->
        <div class="flex items-center justify-between pt-1 mt-1 border-t border-stone-100">
          <div class="flex items-center gap-1.5">
            <i class="far fa-calendar text-amber-400 text-xs"></i>
            \${dlBadge}
          </div>
          <div class="flex items-center gap-2">
            \${mapsUrl ? \`<a href="\${mapsUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()"
              class="flex items-center gap-1 text-[12px] text-blue-400 hover:text-blue-600 font-medium"
              style="text-decoration:none">
              <i class="fas fa-map-location-dot text-xs"></i>Map
            </a>\` : ''}
            <button onclick="event.stopPropagation(); openApply(\${c.id})" \${full ? 'disabled' : ''}
              class="btn-gold px-5 py-2 rounded-xl text-xs font-semibold">
              \${full ? 'Full' : 'Apply Now'}
            </button>
          </div>
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
    <div class="relative h-56 sm:h-64">
      \${thumb
        ? \`<img src="\${thumb}" class="w-full h-full object-cover">\`
        : \`<div class="w-full h-full flex items-center justify-center bg-stone-100"><i class="fas fa-clinic-medical text-6xl text-stone-300"></i></div>\`}
      <div class="absolute inset-0" style="background:linear-gradient(to bottom,transparent 25%,rgba(0,0,0,.78) 100%)"></div>
      <button onclick="closeDetail()" class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-white text-lg transition" style="background:rgba(0,0,0,.4);backdrop-filter:blur(6px)">×</button>
      <div class="absolute bottom-0 left-0 right-0 px-5 pb-5">
        <p class="text-white/70 text-xs mb-1.5"><i class="fas fa-location-dot text-red-400 mr-1"></i>\${c.place_name}</p>
        <h2 class="serif text-2xl font-semibold text-white leading-snug">\${c.title}</h2>
      </div>
    </div>

    <div class="px-5 py-5 space-y-4">
      <div class="flex flex-wrap gap-2">
        \${c.category === 'Clinic' ? '<span class="pill pill-clinic">Clinic</span>' : '<span class="pill pill-beauty">Beauty Shop</span>'}
        \${c.place_rating ? \`<span class="pill" style="background:#fef9ee;color:#92620a"><i class="fas fa-star text-amber-400 mr-1 text-xs"></i>\${c.place_rating} · Verified</span>\` : ''}
      </div>

      \${c.place_address ? \`
      <div class="flex items-start gap-3 rounded-xl px-4 py-3" style="background:#f8f7f5;border:1px solid #ede9e2;">
        <i class="fas fa-location-dot text-red-400 text-sm mt-0.5 flex-shrink-0"></i>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-700 leading-relaxed">\${c.place_address}</p>
          \${mapsUrl ? \`<a href="\${mapsUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-xs text-blue-500 font-medium mt-1.5"><i class="fas fa-arrow-up-right-from-square text-[10px]"></i>Open in Google Maps</a>\` : ''}
        </div>
      </div>\` : ''}

      \${c.description ? \`<p class="text-[14px] text-gray-600 leading-[1.8]">\${c.description}</p>\` : ''}

      \${c.benefits ? \`
      <div class="benefit-box">
        <p class="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-2"><i class="fas fa-gift mr-1.5"></i>What You Receive</p>
        <p class="text-sm text-amber-900 leading-relaxed">\${c.benefits}</p>
      </div>\` : ''}

      \${c.requirements ? \`
      <div class="req-box">
        <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2"><i class="fas fa-circle-check mr-1.5"></i>Requirements</p>
        <p class="text-sm text-gray-600 leading-relaxed">\${c.requirements}</p>
      </div>\` : ''}

      <p class="text-xs text-gray-400 flex items-center gap-2">
        <i class="far fa-calendar text-amber-400"></i>Deadline:
        <span class="font-medium text-gray-600">\${dlText}</span>
      </p>

      \${!full
        ? \`<button onclick="closeDetail(); openApply(\${c.id})" class="btn-gold w-full py-4 rounded-2xl text-sm font-semibold tracking-wide">Apply Now — It's Free</button>\`
        : \`<div class="w-full text-center py-4 rounded-2xl text-sm font-medium text-gray-400" style="background:#f3f4f6">This program is fully booked</div>\`}

      <div class="h-4"></div>
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
    campaign_id:    parseInt(document.getElementById('applyCapId').value),
    applicant_name: document.getElementById('fName').value.trim(),
    nationality:    document.getElementById('fNation').value,
    email:          document.getElementById('fEmail').value.trim(),
    phone:          document.getElementById('fPhone').value.trim(),
    instagram:      document.getElementById('fInsta').value.trim().replace(/^@/,''),
    preferred_dates:document.getElementById('fDates').value,
    message:        document.getElementById('fMsg').value.trim(),
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

// 모달 바깥 클릭 or 스와이프 닫기
document.querySelectorAll('.modal-bg').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open') })
})

loadCampaigns()
</script>
</body>
</html>`
}
