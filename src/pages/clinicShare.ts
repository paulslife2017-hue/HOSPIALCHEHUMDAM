// ════════════════════════════════════════════
// CLINIC SHARE PAGE  /clinic/:slug
// 업체에게 공유하는 지원현황 페이지 (비밀번호 인증)
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
    .btn-gold{background:linear-gradient(135deg,#c9a035,#e8c16a);color:#fff;font-weight:600;border:none;cursor:pointer;}
    .btn-gold:hover{opacity:.9;}
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

  <!-- 비밀번호 입력 화면 -->
  <div id="loginEl" class="hidden">
    <div class="card p-8 max-w-sm mx-auto mt-10 text-center">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
        <i class="fas fa-lock text-white text-xl"></i>
      </div>
      <h2 id="loginTitle" class="font-bold text-gray-900 text-lg mb-1">업체 확인</h2>
      <p class="text-xs text-gray-400 mb-6">비밀번호를 입력하면 신청자 목록을 확인할 수 있습니다</p>
      <div class="relative mb-3">
        <input id="pwInput" type="password" placeholder="비밀번호 입력"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-center tracking-widest focus:outline-none focus:border-amber-400"
          onkeydown="if(event.key==='Enter')doLogin()">
        <button onclick="togglePw()" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <i id="pwEye" class="fas fa-eye text-sm"></i>
        </button>
      </div>
      <div id="loginErr" class="hidden text-xs text-red-500 mb-3 bg-red-50 rounded-lg px-3 py-2"></div>
      <button onclick="doLogin()" class="btn-gold w-full py-3 rounded-xl text-sm">
        <i class="fas fa-arrow-right mr-1.5"></i>확인
      </button>
    </div>
  </div>

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
        <div class="flex items-center gap-3 mt-1.5 flex-wrap">
          <span class="text-xs text-gray-400"><i class="fas fa-users mr-1"></i><span id="clinicCount">0</span> applicants</span>
          <span class="text-xs text-green-600 font-semibold"><i class="fas fa-check-circle mr-1"></i><span id="clinicApproved">0</span> approved</span>
          <span class="text-xs text-red-400 font-semibold"><i class="fas fa-times-circle mr-1"></i><span id="clinicRejected">0</span> rejected</span>
        </div>
      </div>
    </div>

    <!-- 필터 -->
    <div class="flex gap-2 flex-wrap">
      <button onclick="filterApps('all')"      id="f-all"      class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white">전체</button>
      <button onclick="filterApps('pending')"  id="f-pending"  class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">⏳ 대기</button>
      <button onclick="filterApps('approved')" id="f-approved" class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">✅ 승인</button>
      <button onclick="filterApps('rejected')" id="f-rejected" class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">❌ 거절</button>
    </div>

    <!-- 신청자 목록 -->
    <div id="appList" class="space-y-3"></div>
    <p id="emptyEl" class="hidden text-center text-gray-400 text-sm py-10">No applicants yet.</p>
  </div>
</main>

<script>
// URL에서 slug, token 파싱
var _slug  = location.pathname.replace(/^\\/clinic\\//, '').split('?')[0]
var _token = new URLSearchParams(location.search).get('token')
var _campaignId = null
var allApps = []
var currentFilter = 'all'

// 세션 키 (새로고침 유지)
var SESSION_KEY = 'clinic_share_pw_' + _slug

async function init() {
  if (!_slug) { showError('Invalid link.'); return }

  // 저장된 비번 있으면 바로 시도
  var saved = sessionStorage.getItem(SESSION_KEY)
  if (saved) {
    var ok = await tryLoad(saved)
    if (ok) return
    sessionStorage.removeItem(SESSION_KEY)
  }

  // 비밀번호 화면 표시
  document.getElementById('loadingEl').classList.add('hidden')
  document.getElementById('loginEl').classList.remove('hidden')
}

async function tryLoad(password) {
  try {
    var body = { slug: _slug, password: password }
    if (_token) body.token = _token
    var res  = await fetch('/api/clinic/verify', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    var data = await res.json()
    if (!data.success) return false
    _campaignId = data.campaign_id
    allApps = data.applications || []
    var c = data.campaign
    document.getElementById('clinicName').textContent     = c.place_name_ko || c.place_name || c.title
    document.getElementById('clinicTitle').textContent    = c.title
    document.getElementById('headerBadge').textContent    = c.place_name_ko || c.place_name
    document.getElementById('clinicCount').textContent    = allApps.length
    document.getElementById('clinicApproved').textContent = allApps.filter(function(a){ return a.status==='approved' }).length
    document.getElementById('clinicRejected').textContent = allApps.filter(function(a){ return a.status==='rejected' }).length
    document.getElementById('loginTitle').textContent     = c.place_name_ko || c.place_name || c.title
    if (c.place_photo_ref) {
      document.getElementById('clinicThumb').innerHTML = '<img src="/api/places/photo?ref=' + c.place_photo_ref + '" class="w-full h-full object-cover">'
    }
    document.getElementById('loadingEl').classList.add('hidden')
    document.getElementById('loginEl').classList.add('hidden')
    document.getElementById('mainEl').classList.remove('hidden')
    renderList()
    return true
  } catch(e) { return false }
}

async function doLogin() {
  var pw = document.getElementById('pwInput').value.trim()
  if (!pw) return
  var errEl = document.getElementById('loginErr')
  errEl.classList.add('hidden')
  var btn = event.currentTarget || document.querySelector('[onclick="doLogin()"]')
  var origHtml = btn ? btn.innerHTML : ''
  if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i>확인 중…'; btn.disabled = true }
  var ok = await tryLoad(pw)
  if (btn) { btn.innerHTML = origHtml; btn.disabled = false }
  if (ok) {
    sessionStorage.setItem(SESSION_KEY, pw)
  } else {
    errEl.textContent = '비밀번호가 올바르지 않습니다.'
    errEl.classList.remove('hidden')
    document.getElementById('pwInput').value = ''
    document.getElementById('pwInput').focus()
  }
}

function togglePw() {
  var inp = document.getElementById('pwInput')
  var eye = document.getElementById('pwEye')
  if (inp.type === 'password') { inp.type = 'text'; eye.className = 'fas fa-eye-slash text-sm' }
  else { inp.type = 'password'; eye.className = 'fas fa-eye text-sm' }
}

function showError(msg) {
  document.getElementById('loadingEl').classList.add('hidden')
  document.getElementById('loginEl').classList.add('hidden')
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
      ? '<span class="badge badge-approved">✅ 승인</span>'
      : a.status === 'rejected'
      ? '<span class="badge badge-rejected">❌ 거절</span>'
      : '<span class="badge badge-pending">⏳ 대기</span>'
    var instaLink = a.instagram
      ? '<a href="https://instagram.com/' + a.instagram + '" target="_blank" class="text-pink-500 hover:underline text-xs font-semibold"><i class="fab fa-instagram mr-1"></i>@' + a.instagram + '</a>'
      : ''
    var dates = (a.preferred_dates || '').split('/').map(function(d){ return d.trim() }).filter(Boolean)
    var datesHtml = dates.map(function(d){
      return '<span class="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2 py-1">' + d + '</span>'
    }).join('')
    return '<div class="card p-4">' +
      '<div class="flex items-start justify-between gap-3">' +
        '<div class="flex items-center gap-3">' +
          '<div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">' + (i+1) + '</div>' +
          '<div>' +
            '<p class="font-semibold text-gray-900 text-sm">' + (a.applicant_name || '') + '</p>' +
            '<p class="text-xs text-gray-400">' + (a.nationality || '') + '</p>' +
          '</div>' +
        '</div>' +
        statusBadge +
      '</div>' +
      '<div class="mt-3 flex flex-wrap items-center gap-3">' +
        instaLink +
        (a.email ? '<a href="mailto:' + a.email + '" class="text-xs text-blue-500 hover:underline">' + a.email + '</a>' : '') +
        (a.phone ? '<span class="text-xs text-gray-400"><i class="fab fa-whatsapp mr-1 text-green-500"></i>' + a.phone + '</span>' : '') +
      '</div>' +
      (dates.length ? '<div class="mt-3"><p class="text-xs text-gray-400 mb-1.5"><i class="fas fa-calendar mr-1"></i>Available dates</p><div class="flex flex-wrap gap-1.5">' + datesHtml + '</div></div>' : '') +
      (a.message ? '<div class="mt-3 bg-stone-50 rounded-xl px-3 py-2"><p class="text-xs text-gray-500">' + a.message + '</p></div>' : '') +
      '<p class="text-xs text-gray-300 mt-3">' + (a.created_at || '').replace('T',' ').split(' ')[0] + '</p>' +
    '</div>'
  }).join('')
}

init()
<\/script>
</body>
</html>`
}
