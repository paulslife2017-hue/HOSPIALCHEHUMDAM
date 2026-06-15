// ════════════════════════════════════════════
// CLINIC SHARE PAGE  /clinic/:id
// 업체에게 공유하는 지원현황 페이지 (토큰 인증)
// ════════════════════════════════════════════
export function clinicShareHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Applicants – Seoul Beauty Trip</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f3f0;}
    .card{background:#fff;border-radius:16px;border:1px solid #ede9e2;box-shadow:0 1px 4px rgba(0,0,0,.04);}
    .badge{display:inline-flex;align-items:center;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:600;}
    .badge-pending {background:#fef9c3;color:#854d0e;}
    .badge-approved{background:#dcfce7;color:#166534;}
    .badge-rejected{background:#fee2e2;color:#991b1b;}
    ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#d4c4a0;border-radius:4px;}
  </style>
</head>
<body class="min-h-screen">

<header class="bg-white border-b border-stone-200 sticky top-0 z-50">
  <div class="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
        <i class="fas fa-seedling text-white text-xs"></i>
      </div>
      <span class="font-bold text-gray-900 text-sm">Seoul Beauty Trip</span>
    </div>
    <span id="headerBadge" class="text-xs text-gray-400"></span>
  </div>
</header>

<main class="max-w-3xl mx-auto px-5 py-6">
  <!-- 로딩 -->
  <div id="loadingEl" class="text-center py-20 text-gray-400">
    <i class="fas fa-spinner fa-spin text-2xl mb-3 block"></i>Loading…
  </div>
  <!-- 에러 -->
  <div id="errorEl" class="hidden text-center py-20">
    <i class="fas fa-lock text-3xl text-gray-300 mb-3 block"></i>
    <p class="text-gray-500 text-sm" id="errorMsg">Access denied.</p>
  </div>
  <!-- 메인 컨텐츠 -->
  <div id="mainEl" class="hidden space-y-5">
    <!-- 업체 헤더 -->
    <div class="card p-5 flex items-center gap-4">
      <div id="clinicThumb" class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 flex items-center justify-center">
        <i class="fas fa-hospital text-2xl text-gray-300"></i>
      </div>
      <div class="flex-1 min-w-0">
        <h1 id="clinicName" class="font-bold text-gray-900 text-lg"></h1>
        <p id="clinicTitle" class="text-sm text-gray-500 mt-0.5"></p>
        <div class="flex items-center gap-3 mt-1.5">
          <span class="text-xs text-gray-400"><i class="fas fa-users mr-1"></i><span id="clinicCount">0</span> applicants</span>
          <span class="text-xs text-gray-400"><i class="fas fa-check-circle mr-1 text-green-500"></i><span id="clinicApproved">0</span> approved</span>
        </div>
      </div>
    </div>

    <!-- 필터 -->
    <div class="flex gap-2 flex-wrap">
      <button onclick="filterApps('all')"      id="f-all"      class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white">All</button>
      <button onclick="filterApps('pending')"  id="f-pending"  class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">Pending</button>
      <button onclick="filterApps('approved')" id="f-approved" class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">Approved</button>
    </div>

    <!-- 신청자 목록 -->
    <div id="appList" class="space-y-3"></div>
    <p id="emptyEl" class="hidden text-center text-gray-400 text-sm py-10">No applicants yet.</p>
  </div>
</main>

<script>
var _pathParts = location.pathname.split('/clinic/')
var campaignId = _pathParts.length > 1 ? _pathParts[1].split('?')[0].split('/')[0] : null
var token = new URLSearchParams(location.search).get('token')
var allApps = []
var currentFilter = 'all'

async function load() {
  if (!campaignId || !token) { showError('Invalid link.'); return }
  try {
    var res  = await fetch('/api/clinic/' + campaignId + '?token=' + encodeURIComponent(token))
    var data = await res.json()
    if (!data.success) { showError(data.error || 'Access denied.'); return }
    allApps = data.applications || []
    var c   = data.campaign
    // 헤더
    document.getElementById('clinicName').textContent  = c.place_name || c.title
    document.getElementById('clinicTitle').textContent = c.title
    document.getElementById('headerBadge').textContent = c.place_name
    document.getElementById('clinicCount').textContent    = allApps.length
    document.getElementById('clinicApproved').textContent = allApps.filter(function(a){ return a.status === 'approved' }).length
    if (c.place_photo_ref) {
      document.getElementById('clinicThumb').innerHTML = '<img src="/api/places/photo?ref=' + c.place_photo_ref + '" class="w-full h-full object-cover">'
    }
    document.getElementById('loadingEl').classList.add('hidden')
    document.getElementById('mainEl').classList.remove('hidden')
    renderList()
  } catch(e) { showError('Network error.') }
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
  var list = currentFilter === 'all' ? allApps : allApps.filter(function(a){ return a.status === currentFilter })
  var el   = document.getElementById('appList')
  var empty = document.getElementById('emptyEl')
  if (!list.length) { el.innerHTML = ''; empty.classList.remove('hidden'); return }
  empty.classList.add('hidden')
  el.innerHTML = list.map(function(a, i) {
    var statusBadge = a.status === 'approved'
      ? '<span class="badge badge-approved">Approved</span>'
      : a.status === 'rejected'
      ? '<span class="badge badge-rejected">Rejected</span>'
      : '<span class="badge badge-pending">Pending</span>'
    var instaLink = a.instagram
      ? '<a href="https://instagram.com/' + a.instagram + '" target="_blank" class="text-pink-500 hover:underline text-xs"><i class="fab fa-instagram mr-1"></i>@' + a.instagram + '</a>'
      : ''
    var dates = (a.preferred_dates || '').split('/').map(function(d){ return d.trim() }).filter(Boolean)
    var datesHtml = dates.map(function(d){
      return '<span class="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1">' + d + '</span>'
    }).join('')
    return '<div class="card p-4">' +
      '<div class="flex items-start justify-between gap-3">' +
        '<div class="flex items-center gap-3">' +
          '<div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm flex-shrink-0">' + (i+1) + '</div>' +
          '<div>' +
            '<p class="font-semibold text-gray-900 text-sm">' + (a.applicant_name || '') + '</p>' +
            '<p class="text-xs text-gray-400">' + (a.nationality || '') + ' · ' + (a.email || '') + '</p>' +
          '</div>' +
        '</div>' +
        statusBadge +
      '</div>' +
      '<div class="mt-3 flex flex-wrap items-center gap-3">' +
        instaLink +
        (a.phone ? '<span class="text-xs text-gray-400"><i class="fab fa-whatsapp mr-1 text-green-500"></i>' + a.phone + '</span>' : '') +
      '</div>' +
      (dates.length ? '<div class="mt-3"><p class="text-xs text-gray-400 mb-1.5"><i class="fas fa-calendar mr-1"></i>Available dates</p><div class="flex flex-wrap gap-1.5">' + datesHtml + '</div></div>' : '') +
      (a.message ? '<div class="mt-3 bg-stone-50 rounded-xl px-3 py-2"><p class="text-xs text-gray-500">' + a.message + '</p></div>' : '') +
      '<p class="text-xs text-gray-300 mt-3">' + (a.created_at || '').replace('T',' ').split(' ')[0] + '</p>' +
    '</div>'
  }).join('')
}

load()
<\/script>
</body>
</html>`
}
