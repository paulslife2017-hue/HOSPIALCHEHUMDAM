// ════════════════════════════════════════════
// CLINIC DASHBOARD PAGE  /clinic-dashboard
// 업체 전용 신청자 대시보드 (로그인 후 접근)
// ════════════════════════════════════════════
export function clinicDashboardHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clinic Dashboard – Seoul Beauty Trip</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background: #f4f3f0; }
    .card { background: #fff; border-radius: 16px; border: 1px solid #ede9e2; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
    .badge { display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; }
    .badge-pending  { background: #fef9c3; color: #854d0e; }
    .badge-approved { background: #dcfce7; color: #166534; }
    .badge-rejected { background: #fee2e2; color: #991b1b; }
    .filter-btn { transition: all .15s; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #d4c4a0; border-radius: 4px; }
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
      <div>
        <span class="font-bold text-gray-900 text-sm">Seoul Beauty Trip</span>
        <span class="text-stone-300 text-xs ml-1.5">Clinic Portal</span>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <span id="headerClinicName" class="text-xs text-gray-500 font-medium hidden sm:block"></span>
      <button onclick="doLogout()" class="text-xs text-red-400 hover:text-red-500 flex items-center gap-1">
        <i class="fas fa-sign-out-alt text-[10px]"></i>Logout
      </button>
    </div>
  </div>
</header>

<main class="max-w-3xl mx-auto px-5 py-6 space-y-5">

  <!-- Loading -->
  <div id="loadingEl" class="text-center py-20 text-gray-400">
    <i class="fas fa-spinner fa-spin text-2xl mb-3 block"></i>Loading…
  </div>

  <!-- Error / Not logged in -->
  <div id="errorEl" class="hidden text-center py-20">
    <i class="fas fa-lock text-3xl text-gray-300 mb-3 block"></i>
    <p class="text-gray-500 text-sm mb-4" id="errorMsg">Access denied.</p>
    <a href="/clinic-login" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
      <i class="fas fa-sign-in-alt"></i>Go to Login
    </a>
  </div>

  <!-- Main Content -->
  <div id="mainEl" class="hidden space-y-5">

    <!-- 업체 정보 카드 -->
    <div class="card p-5 flex items-center gap-4">
      <div id="clinicThumb" class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 flex items-center justify-center">
        <i class="fas fa-hospital text-2xl text-gray-300"></i>
      </div>
      <div class="flex-1 min-w-0">
        <h1 id="clinicName" class="font-bold text-gray-900 text-lg"></h1>
        <p id="clinicTitle" class="text-sm text-gray-500 mt-0.5"></p>
        <div class="flex flex-wrap items-center gap-3 mt-2">
          <span class="text-xs text-gray-400"><i class="fas fa-users mr-1"></i><span id="cntTotal">0</span> total applicants</span>
          <span class="text-xs text-amber-600 font-semibold"><i class="fas fa-clock mr-1"></i><span id="cntPending">0</span> pending</span>
          <span class="text-xs text-green-600 font-semibold"><i class="fas fa-check-circle mr-1"></i><span id="cntApproved">0</span> approved</span>
        </div>
      </div>
    </div>

    <!-- 필터 탭 -->
    <div class="flex gap-2 flex-wrap">
      <button onclick="filterApps('all')"      id="f-all"      class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white">All</button>
      <button onclick="filterApps('pending')"  id="f-pending"  class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">⏳ Pending</button>
      <button onclick="filterApps('approved')" id="f-approved" class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">✅ Approved</button>
      <button onclick="filterApps('rejected')" id="f-rejected" class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">❌ Rejected</button>
    </div>

    <!-- 검색 -->
    <div class="relative">
      <input id="searchInput" type="text" placeholder="이름, 인스타그램, 이메일로 검색…"
        oninput="renderList()"
        class="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition">
      <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm"></i>
    </div>

    <!-- 신청자 목록 -->
    <div id="appList" class="space-y-3"></div>
    <p id="emptyEl" class="hidden text-center text-gray-400 text-sm py-10">
      <i class="fas fa-inbox text-2xl block mb-2 text-gray-200"></i>No applicants yet.
    </p>

  </div>
</main>

<script>
var allApps = []
var currentFilter = 'all'
var clinicToken = localStorage.getItem('clinicToken')
var clinicCampaignId = localStorage.getItem('clinicCampaignId')

async function load() {
  if (!clinicToken || !clinicCampaignId) {
    showError('로그인이 필요합니다.')
    return
  }
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
    var c   = data.campaign

    // 헤더/업체 정보
    document.getElementById('clinicName').textContent    = c.place_name_ko || c.place_name || c.title
    document.getElementById('clinicTitle').textContent   = c.title
    document.getElementById('headerClinicName').textContent = c.place_name_ko || c.place_name || ''
    document.getElementById('headerClinicName').classList.remove('hidden')
    document.getElementById('cntTotal').textContent    = allApps.length
    document.getElementById('cntPending').textContent  = allApps.filter(function(a){ return a.status === 'pending'  }).length
    document.getElementById('cntApproved').textContent = allApps.filter(function(a){ return a.status === 'approved' }).length

    if (c.place_photo_ref) {
      document.getElementById('clinicThumb').innerHTML =
        '<img src="/api/places/photo?ref=' + c.place_photo_ref + '" class="w-full h-full object-cover">'
    }

    document.getElementById('loadingEl').classList.add('hidden')
    document.getElementById('mainEl').classList.remove('hidden')
    renderList()
  } catch(e) {
    showError('Network error. Please try again.')
  }
}

function showError(msg) {
  document.getElementById('loadingEl').classList.add('hidden')
  document.getElementById('errorMsg').textContent = msg
  document.getElementById('errorEl').classList.remove('hidden')
}

function filterApps(f) {
  currentFilter = f
  document.querySelectorAll('.filter-btn').forEach(function(b) {
    b.className = 'filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200'
  })
  document.getElementById('f-' + f).className = 'filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white'
  renderList()
}

function renderList() {
  var keyword = (document.getElementById('searchInput').value || '').toLowerCase()
  var list = currentFilter === 'all' ? allApps : allApps.filter(function(a){ return a.status === currentFilter })
  if (keyword) {
    list = list.filter(function(a){
      return (a.applicant_name||'').toLowerCase().includes(keyword) ||
             (a.instagram||'').toLowerCase().includes(keyword) ||
             (a.email||'').toLowerCase().includes(keyword) ||
             (a.nationality||'').toLowerCase().includes(keyword)
    })
  }
  var el    = document.getElementById('appList')
  var empty = document.getElementById('emptyEl')
  if (!list.length) { el.innerHTML = ''; empty.classList.remove('hidden'); return }
  empty.classList.add('hidden')

  el.innerHTML = list.map(function(a, i) {
    var statusBadge = a.status === 'approved'
      ? '<span class="badge badge-approved">✅ Approved</span>'
      : a.status === 'rejected'
      ? '<span class="badge badge-rejected">❌ Rejected</span>'
      : '<span class="badge badge-pending">⏳ Pending</span>'

    var instaLink = a.instagram
      ? '<a href="https://instagram.com/' + a.instagram + '" target="_blank" class="text-pink-500 hover:underline text-xs font-medium"><i class="fab fa-instagram mr-1"></i>@' + a.instagram + '</a>'
      : ''

    var dates = (a.preferred_dates || '').split('/').map(function(d){ return d.trim() }).filter(Boolean)
    var datesHtml = dates.map(function(d){
      return '<span class="text-xs bg-green-50 border border-green-100 text-green-700 rounded-lg px-2 py-1">' + d + '</span>'
    }).join('')

    var followerBadge = a.follower_count
      ? '<span class="text-xs text-purple-500 font-semibold"><i class="fas fa-users mr-1"></i>' + Number(a.follower_count).toLocaleString() + ' followers</span>'
      : ''

    // 승인/거절 버튼
    var actionBtns =
      a.status !== 'approved'
        ? '<button onclick="setClinicStatus(' + a.id + ',\'approved\')"
            class="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition"
            style="background:#22c55e">
            <i class="fas fa-check"></i> 승인
           </button>'
        : '<span class="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-green-600 bg-green-50"><i class="fas fa-check"></i> 승인됨</span>'
    actionBtns +=
      a.status !== 'rejected'
        ? '<button onclick="setClinicStatus(' + a.id + ',\'rejected\')"
            class="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition"
            style="background:#ef4444">
            <i class="fas fa-times"></i> 거절
           </button>'
        : '<span class="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-red-500 bg-red-50"><i class="fas fa-times"></i> 거절됨</span>'

    return '<div class="card p-4 transition" id="app-card-' + a.id + '">' +
      '<div class="flex items-start justify-between gap-3">' +
        '<div class="flex items-center gap-3">' +
          '<div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">' +
            (a.applicant_name||'?').charAt(0).toUpperCase() +
          '</div>' +
          '<div>' +
            '<p class="font-semibold text-gray-900 text-sm">' + (a.applicant_name || '') + '</p>' +
            '<p class="text-xs text-gray-400 mt-0.5">' + (a.nationality || '') + '</p>' +
          '</div>' +
        '</div>' +
        statusBadge +
      '</div>' +

      '<div class="mt-3 flex flex-wrap items-center gap-3">' +
        instaLink +
        followerBadge +
        (a.phone ? '<a href="https://wa.me/' + a.phone.replace(/[^0-9]/g,'') + '" target="_blank" class="text-xs text-green-600 font-medium hover:underline"><i class="fab fa-whatsapp mr-1"></i>' + a.phone + '</a>' : '') +
        '<a href="mailto:' + (a.email||'') + '" class="text-xs text-blue-500 hover:underline"><i class="fas fa-envelope mr-1"></i>' + (a.email||'') + '</a>' +
      '</div>' +

      (dates.length ? '<div class="mt-3"><p class="text-xs text-gray-400 mb-1.5"><i class="fas fa-calendar-alt mr-1 text-amber-500"></i>Available Dates</p><div class="flex flex-wrap gap-1.5">' + datesHtml + '</div></div>' : '') +

      (a.message ? '<div class="mt-3 bg-stone-50 rounded-xl px-3 py-2.5"><p class="text-xs text-gray-500 leading-relaxed">' + a.message + '</p></div>' : '') +

      '<div class="mt-3 pt-3 border-t border-stone-100 flex gap-2">' + actionBtns + '</div>' +
    '</div>'
  }).join('')
}

async function setClinicStatus(appId, status) {
  var app = allApps.find(function(a) { return a.id === appId })
  if (!app) return
  try {
    var res = await fetch('/api/clinic/applications/' + appId, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Clinic-Token': clinicToken },
      body: JSON.stringify({ status: status, campaign_id: Number(clinicCampaignId) })
    })
    var data = await res.json()
    if (data.success) {
      app.status = status
      // 카운터 업데이트
      document.getElementById('cntPending').textContent  = allApps.filter(function(a){ return a.status === 'pending'  }).length
      document.getElementById('cntApproved').textContent = allApps.filter(function(a){ return a.status === 'approved' }).length
      renderList()
    } else {
      alert(data.error || '처리 실패')
    }
  } catch(e) {
    alert('Network error')
  }
}

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
