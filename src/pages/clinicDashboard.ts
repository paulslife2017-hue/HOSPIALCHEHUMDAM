// ════════════════════════════════════════════
// CLINIC DASHBOARD PAGE  /clinic-dashboard
// ════════════════════════════════════════════
export function clinicDashboardHTML(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clinic Dashboard – Seoul Beauty Trip</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family:'Inter',sans-serif; background:#f4f3f0; }
    .card { background:#fff; border-radius:16px; border:1px solid #ede9e2; box-shadow:0 1px 4px rgba(0,0,0,.04); }
    ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#d4c4a0;border-radius:4px;}
    .filter-btn { transition:all .15s; cursor:pointer; }
  </style>
</head>
<body class="min-h-screen">

<!-- Header -->
<header class="bg-white border-b border-stone-200 sticky top-0 z-50">
  <div class="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
        <i class="fas fa-seedling text-white text-xs"></i>
      </div>
      <span class="font-bold text-gray-900 text-sm">Seoul Beauty Trip</span>
      <span class="text-stone-300 text-xs ml-1">Clinic</span>
    </div>
    <div class="flex items-center gap-3">
      <span id="headerName" class="text-xs text-gray-500 font-medium"></span>
      <button onclick="doLogout()" class="text-xs text-red-400 hover:text-red-500 flex items-center gap-1.5">
        <i class="fas fa-sign-out-alt text-[10px]"></i>로그아웃
      </button>
    </div>
  </div>
</header>

<main class="max-w-3xl mx-auto px-5 py-6 space-y-4">

  <!-- 로딩 -->
  <div id="loadingEl" class="text-center py-24 text-gray-400">
    <i class="fas fa-spinner fa-spin text-3xl mb-3 block"></i>
    <p class="text-sm">Loading…</p>
  </div>

  <!-- 에러 -->
  <div id="errorEl" class="hidden text-center py-24">
    <i class="fas fa-lock text-4xl text-gray-200 mb-4 block"></i>
    <p class="text-gray-500 text-sm mb-5" id="errorMsg">접근 권한이 없습니다.</p>
    <a href="/clinic-login"
       class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
       style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
      <i class="fas fa-sign-in-alt"></i>로그인하러 가기
    </a>
  </div>

  <!-- 메인 -->
  <div id="mainEl" class="hidden space-y-4">

    <!-- 업체 정보 -->
    <div class="card p-5 flex items-center gap-4">
      <div id="clinicThumb" class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 flex items-center justify-center">
        <i class="fas fa-hospital text-2xl text-gray-300"></i>
      </div>
      <div class="flex-1 min-w-0">
        <h1 id="clinicName" class="font-bold text-gray-900 text-lg leading-tight"></h1>
        <p id="clinicTitle" class="text-xs text-gray-400 mt-0.5"></p>
        <div class="flex flex-wrap gap-3 mt-2">
          <span class="text-xs text-gray-500"><i class="fas fa-users mr-1 text-amber-500"></i>전체 <b id="cntTotal">0</b>명</span>
          <span class="text-xs text-amber-600 font-semibold"><i class="fas fa-clock mr-1"></i>대기 <b id="cntPending">0</b>명</span>
          <span class="text-xs text-green-600 font-semibold"><i class="fas fa-check-circle mr-1"></i>승인 <b id="cntApproved">0</b>명</span>
          <span class="text-xs text-red-400 font-semibold"><i class="fas fa-times-circle mr-1"></i>거절 <b id="cntRejected">0</b>명</span>
        </div>
      </div>
    </div>

    <!-- 필터 + 검색 -->
    <div class="flex flex-wrap gap-2">
      <button id="f-all"      onclick="setFilter('all')"      class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white">전체</button>
      <button id="f-pending"  onclick="setFilter('pending')"  class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">⏳ 대기</button>
      <button id="f-approved" onclick="setFilter('approved')" class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">✅ 승인</button>
      <button id="f-rejected" onclick="setFilter('rejected')" class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">❌ 거절</button>
    </div>
    <div class="relative">
      <input id="searchInput" type="text" placeholder="이름, 인스타그램, 이메일 검색…" oninput="renderList()"
        class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition">
      <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
    </div>

    <!-- 신청자 목록 -->
    <div id="appList" class="space-y-3"></div>
    <div id="emptyEl" class="hidden text-center py-16 text-gray-300">
      <i class="fas fa-inbox text-3xl block mb-2"></i>
      <p class="text-sm">신청자가 없습니다</p>
    </div>

  </div>
</main>

<script>
var allApps = []
var currentFilter = 'all'
var clinicToken      = localStorage.getItem('clinicToken')
var clinicCampaignId = localStorage.getItem('clinicCampaignId')

// ── 로드 ──────────────────────────────────────
async function load() {
  if (!clinicToken || !clinicCampaignId) { showError('로그인이 필요합니다.'); return }
  try {
    var res  = await fetch('/api/clinic/dashboard?campaign_id=' + clinicCampaignId, {
      headers: { 'X-Clinic-Token': clinicToken }
    })
    var data = await res.json()
    if (!data.success) {
      localStorage.removeItem('clinicToken')
      localStorage.removeItem('clinicCampaignId')
      showError(data.error || '세션이 만료되었습니다. 다시 로그인해주세요.')
      return
    }
    allApps = data.applications || []
    var camp = data.campaign

    document.getElementById('clinicName').textContent  = camp.place_name_ko || camp.place_name || camp.title
    document.getElementById('clinicTitle').textContent = camp.title || ''
    document.getElementById('headerName').textContent  = camp.place_name_ko || camp.place_name || ''
    if (camp.place_photo_ref) {
      document.getElementById('clinicThumb').innerHTML =
        '<img src="/api/places/photo?ref=' + camp.place_photo_ref + '" class="w-full h-full object-cover">'
    }

    updateCounts()
    document.getElementById('loadingEl').classList.add('hidden')
    document.getElementById('mainEl').classList.remove('hidden')
    renderList()
  } catch(e) { showError('네트워크 오류가 발생했습니다.') }
}

function showError(msg) {
  document.getElementById('loadingEl').classList.add('hidden')
  document.getElementById('errorMsg').textContent = msg
  document.getElementById('errorEl').classList.remove('hidden')
}

function updateCounts() {
  document.getElementById('cntTotal').textContent    = allApps.length
  document.getElementById('cntPending').textContent  = allApps.filter(function(a){ return a.status==='pending'  }).length
  document.getElementById('cntApproved').textContent = allApps.filter(function(a){ return a.status==='approved' }).length
  document.getElementById('cntRejected').textContent = allApps.filter(function(a){ return a.status==='rejected' }).length
}

// ── 필터 ──────────────────────────────────────
function setFilter(f) {
  currentFilter = f
  document.querySelectorAll('.filter-btn').forEach(function(b) {
    b.className = 'filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200'
  })
  document.getElementById('f-' + f).className = 'filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white'
  renderList()
}

// ── 렌더 ──────────────────────────────────────
function renderList() {
  var kw   = (document.getElementById('searchInput').value || '').toLowerCase()
  var list = currentFilter === 'all' ? allApps : allApps.filter(function(a){ return a.status === currentFilter })
  if (kw) list = list.filter(function(a){
    return (a.applicant_name||'').toLowerCase().includes(kw) ||
           (a.instagram||'').toLowerCase().includes(kw) ||
           (a.email||'').toLowerCase().includes(kw)
  })

  var el    = document.getElementById('appList')
  var empty = document.getElementById('emptyEl')
  if (!list.length) { el.innerHTML = ''; empty.classList.remove('hidden'); return }
  empty.classList.add('hidden')

  el.innerHTML = list.map(function(a) {
    // 상태 뱃지
    var badge =
      a.status === 'approved' ? '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">✅ 승인</span>' :
      a.status === 'rejected' ? '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">❌ 거절</span>' :
                                '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">⏳ 대기</span>'

    // 희망 날짜
    var dates    = (a.preferred_dates || '').split('/').map(function(d){ return d.trim() }).filter(Boolean)
    var datesHtml = dates.map(function(d){
      return '<span class="text-[11px] bg-green-50 border border-green-100 text-green-700 rounded-lg px-2 py-0.5">' + d + '</span>'
    }).join('')

    // 액션 버튼 (data-id, data-status 속성으로 이벤트 위임)
    var approveBtn =
      a.status !== 'approved'
        ? '<button class="action-btn flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white" style="background:#22c55e" data-id="' + a.id + '" data-status="approved"><i class="fas fa-check mr-1"></i>승인</button>'
        : '<div class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-green-50 text-green-600 border border-green-100"><i class="fas fa-check mr-1"></i>승인됨</div>'

    var rejectBtn =
      a.status !== 'rejected'
        ? '<button class="action-btn flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white" style="background:#ef4444" data-id="' + a.id + '" data-status="rejected"><i class="fas fa-times mr-1"></i>거절</button>'
        : '<div class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-500 border border-red-100"><i class="fas fa-times mr-1"></i>거절됨</div>'

    return '<div class="card p-4" id="card-' + a.id + '">' +

      // 상단: 이름 + 뱃지
      '<div class="flex items-start justify-between gap-2 mb-3">' +
        '<div class="flex items-center gap-2.5">' +
          '<div class="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm text-white" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">' +
            (a.applicant_name||'?').charAt(0).toUpperCase() +
          '</div>' +
          '<div>' +
            '<p class="font-bold text-gray-900 text-sm">' + (a.applicant_name||'') + '</p>' +
            '<p class="text-xs text-gray-400">' + (a.nationality||'') + '</p>' +
          '</div>' +
        '</div>' +
        badge +
      '</div>' +

      // 연락처 행
      '<div class="flex flex-wrap gap-2 mb-3">' +
        (a.instagram ? '<a href="https://instagram.com/' + a.instagram + '" target="_blank" class="inline-flex items-center gap-1 text-xs font-semibold text-pink-500 hover:text-pink-600 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg transition"><i class="fab fa-instagram"></i>@' + a.instagram + '</a>' : '') +
        (a.phone    ? '<a href="https://wa.me/' + a.phone.replace(/[^0-9]/g,'') + '" target="_blank" class="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition"><i class="fab fa-whatsapp"></i>' + a.phone + '</a>' : '') +
        '<a href="mailto:' + (a.email||'') + '" class="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition"><i class="fas fa-envelope"></i>' + (a.email||'') + '</a>' +
      '</div>' +

      // 선택 시술
      (a.selected_benefit ? '<div class="mb-3"><p class="text-[11px] text-gray-400 mb-1"><i class="fas fa-star mr-1 text-amber-400"></i>신청 시술</p><div class="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 inline-block">' + a.selected_benefit + '</div></div>' : '') +

      // 희망 날짜
      (dates.length ? '<div class="mb-3"><p class="text-[11px] text-gray-400 mb-1"><i class="fas fa-calendar-alt mr-1 text-amber-400"></i>희망 날짜</p><div class="flex flex-wrap gap-1">' + datesHtml + '</div></div>' : '') +

      // 메시지
      (a.message ? '<div class="mb-3 bg-stone-50 rounded-xl px-3 py-2"><p class="text-xs text-gray-500 leading-relaxed">' + a.message + '</p></div>' : '') +

      // 신청일
      '<p class="text-[11px] text-gray-300 text-right mb-3">신청일: ' + (a.created_at||'').replace('T',' ').split('.')[0] + '</p>' +

      // 승인/거절 버튼
      '<div class="flex gap-2 pt-2 border-t border-stone-100">' + approveBtn + rejectBtn + '</div>' +

    '</div>'
  }).join('')
}

// ── 이벤트 위임: .action-btn 클릭 처리 ───────
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.action-btn')
  if (!btn) return
  var appId  = Number(btn.getAttribute('data-id'))
  var status = btn.getAttribute('data-status')
  changeStatus(appId, status)
})

async function changeStatus(appId, status) {
  var app = allApps.find(function(a){ return a.id === appId })
  if (!app) return

  // 해당 카드 버튼 일시 비활성화
  var card = document.getElementById('card-' + appId)
  var btns = card ? card.querySelectorAll('.action-btn') : []
  btns.forEach(function(b){ b.disabled = true; b.style.opacity = '0.5' })

  try {
    var res  = await fetch('/api/clinic/applications/' + appId, {
      method: 'PATCH',
      headers: { 'Content-Type':'application/json', 'X-Clinic-Token': clinicToken },
      body: JSON.stringify({ status: status, campaign_id: Number(clinicCampaignId) })
    })
    var data = await res.json()
    if (data.success) {
      app.status = status
      updateCounts()
      renderList()
    } else {
      btns.forEach(function(b){ b.disabled = false; b.style.opacity = '' })
      alert(data.error || '처리 실패')
    }
  } catch(e) {
    btns.forEach(function(b){ b.disabled = false; b.style.opacity = '' })
    alert('네트워크 오류')
  }
}

// ── 로그아웃 ──────────────────────────────────
function doLogout() {
  localStorage.removeItem('clinicToken')
  localStorage.removeItem('clinicCampaignId')
  location.href = '/clinic-login'
}

load()
<\/script>
</body>
</html>`
}
