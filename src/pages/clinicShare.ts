// ════════════════════════════════════════════
// CLINIC SHARE PAGE  /clinic/:slug
// 업체에게 공유하는 지원현황 페이지 (비밀번호 인증)
// ════════════════════════════════════════════
export function clinicShareHTML(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>신청자 현황 – Seoul Beauty Trip</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f3f0;}
    .card{background:#fff;border-radius:16px;border:1px solid #ede9e2;box-shadow:0 1px 4px rgba(0,0,0,.04);}
    .btn-gold{background:linear-gradient(135deg,#c9a035,#e8c16a);color:#fff;font-weight:600;border:none;cursor:pointer;}
    .btn-gold:hover{opacity:.9;}
    .filter-btn{transition:all .15s;}
    .badge{display:inline-flex;align-items:center;padding:2px 9px;border-radius:99px;font-size:11px;font-weight:600;}
    .badge-pending {background:#fef9c3;color:#854d0e;}
    .badge-approved{background:#dcfce7;color:#166534;}
    .badge-rejected{background:#fee2e2;color:#991b1b;}
    .settle-done{display:inline-flex;align-items:center;gap:3px;background:#dbeafe;color:#1e40af;border:1px solid #bfdbfe;border-radius:8px;padding:3px 9px;font-size:11px;font-weight:600;}
    .settle-pending{display:inline-flex;align-items:center;gap:3px;background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;border-radius:8px;padding:3px 9px;font-size:11px;font-weight:600;}
    .row-approved{background:#f8fdf9;}
    .btn-approve{background:#dcfce7;color:#166534;border:1px solid #bbf7d0;font-size:11px;font-weight:600;padding:4px 10px;border-radius:8px;cursor:pointer;transition:all .15s;}
    .btn-approve:hover{background:#166534;color:#fff;}
    .btn-reject{background:#fee2e2;color:#991b1b;border:1px solid #fecaca;font-size:11px;font-weight:600;padding:4px 10px;border-radius:8px;cursor:pointer;transition:all .15s;}
    .btn-reject:hover{background:#991b1b;color:#fff;}
    .btn-reset{background:#f3f4f6;color:#6b7280;border:1px solid #e5e7eb;font-size:11px;font-weight:600;padding:4px 10px;border-radius:8px;cursor:pointer;transition:all .15s;}
    .btn-reset:hover{background:#6b7280;color:#fff;}
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
    <span id="headerBadge" class="text-xs text-gray-400 font-medium"></span>
  </div>
</header>

<main class="max-w-3xl mx-auto px-5 py-6 space-y-4">

  <!-- 비밀번호 입력 -->
  <div id="loginEl" class="hidden">
    <div class="card p-8 max-w-sm mx-auto mt-10 text-center">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
        <i class="fas fa-lock text-white text-xl"></i>
      </div>
      <h2 id="loginTitle" class="font-bold text-gray-900 text-lg mb-1">업체 확인</h2>
      <p class="text-xs text-gray-400 mb-6">비밀번호를 입력하면 신청자 현황을 확인할 수 있습니다</p>
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

  <!-- ── 메인 컨텐츠 ── -->
  <div id="mainEl" class="hidden space-y-4">

    <!-- 업체 헤더 카드 -->
    <div class="card p-5">
      <div class="flex items-center gap-4">
        <div id="clinicThumb" class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 flex items-center justify-center">
          <i class="fas fa-hospital text-2xl text-gray-300"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h1 id="clinicName" class="font-bold text-gray-900 text-base leading-tight"></h1>
          <p id="clinicTitle" class="text-xs text-gray-400 mt-0.5 truncate"></p>
        </div>
      </div>
    </div>

    <!-- 필터 탭 -->
    <div class="flex gap-2 flex-wrap">
      <button onclick="filterApps('all')"       id="f-all"       class="filter-btn px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white">전체</button>
      <button onclick="filterApps('approved')"  id="f-approved"  class="filter-btn px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">✅ 승인</button>
      <button onclick="filterApps('pending')"   id="f-pending"   class="filter-btn px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">⏳ 대기</button>
      <button onclick="filterApps('rejected')"  id="f-rejected"  class="filter-btn px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200">❌ 거절</button>
    </div>

    <!-- 신청자 목록 -->
    <div id="appList" class="space-y-2.5"></div>
    <p id="emptyEl" class="hidden text-center text-gray-400 text-sm py-10">해당 신청자가 없습니다.</p>
  </div>

</main>

<script>
var _pathParts = location.pathname.split('/')
var _slug  = decodeURIComponent(_pathParts[_pathParts.length - 1].split('?')[0])
var _token = new URLSearchParams(location.search).get('token')
var _campaignId = null
var allApps = []
var currentFilter = 'all'
var SESSION_KEY = 'clinic_share_pw_' + _slug

// ── 초기화 ──────────────────────────────────
async function init() {
  if (!_slug) { showError('Invalid link.'); return }
  var saved = sessionStorage.getItem(SESSION_KEY)
  if (saved) {
    var ok = await tryLoad(saved)
    if (ok) return
    sessionStorage.removeItem(SESSION_KEY)
  }
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
    document.getElementById('clinicName').textContent  = c.place_name_ko || c.place_name || c.title
    document.getElementById('clinicTitle').textContent = c.title
    document.getElementById('headerBadge').textContent = c.place_name_ko || c.place_name
    document.getElementById('loginTitle').textContent  = c.place_name_ko || c.place_name || c.title
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

// ── 필터 ────────────────────────────────────
function filterApps(f) {
  currentFilter = f
  document.querySelectorAll('.filter-btn').forEach(function(b) {
    b.className = 'filter-btn px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-500 border border-gray-200'
  })
  document.getElementById('f-' + f).className = 'filter-btn px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white'
  renderList()
}

// ── 목록 렌더 ────────────────────────────────
function renderList() {
  var list
  if (currentFilter === 'all') {
    list = allApps
  } else {
    list = allApps.filter(function(a){ return a.status === currentFilter })
  }

  var el    = document.getElementById('appList')
  var empty = document.getElementById('emptyEl')
  if (!list.length) { el.innerHTML = ''; empty.classList.remove('hidden'); return }
  empty.classList.add('hidden')

  el.innerHTML = list.map(function(a, i) {
    var isApproved = a.status === 'approved'
    var isSettled  = isApproved && !!a.settlement

    // ── 상태 배지
    var statusBadge = isApproved
      ? '<span class="badge badge-approved">✅ 승인</span>'
      : a.status === 'rejected'
      ? '<span class="badge badge-rejected">❌ 거절</span>'
      : '<span class="badge badge-pending">⏳ 대기</span>'

    // ── 인스타그램
    var instaLink = a.instagram
      ? '<a href="https://instagram.com/' + a.instagram + '" target="_blank" style="color:#ec4899;font-size:11px;font-weight:600;text-decoration:none;"><i class="fab fa-instagram" style="margin-right:2px;"></i>@' + a.instagram + '</a>'
      : '<span style="color:#d1d5db;font-size:11px;">—</span>'

    // ── 승인된 사람: 확정날짜 + 정산여부 인라인 표시
    var approvedRow = ''
    if (isApproved) {
      var dateChip = a.scheduled_date
        ? '<span style="display:inline-flex;align-items:center;gap:3px;background:#dcfce7;color:#166534;border:1px solid #bbf7d0;border-radius:7px;padding:3px 8px;font-size:11px;font-weight:600;"><i class="fas fa-calendar-check" style="font-size:9px;"></i>' + a.scheduled_date + '</span>'
        : '<span style="display:inline-flex;align-items:center;gap:3px;background:#fef9c3;color:#854d0e;border:1px solid #fde68a;border-radius:7px;padding:3px 8px;font-size:11px;font-weight:500;"><i class="far fa-calendar" style="font-size:9px;"></i>날짜 미정</span>'
      var settleBadge = isSettled
        ? '<span class="settle-done"><i class="fas fa-check-double" style="font-size:9px;"></i>정산완료</span>'
        : '<span class="settle-pending"><i class="fas fa-exclamation-circle" style="font-size:9px;"></i>정산미완료</span>'
      approvedRow = '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:8px;">' + dateChip + settleBadge + '</div>'
    }

    // ── 희망날짜 (미승인 상태만)
    var datesHtml = ''
    if (!isApproved) {
      var dates = (a.preferred_dates || '').split('/').map(function(d){ return d.trim() }).filter(Boolean)
      if (dates.length) {
        datesHtml = '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;">' +
          dates.map(function(d){ return '<span style="font-size:10px;background:#f5f5f4;border:1px solid #e7e5e4;border-radius:6px;padding:2px 7px;color:#78716c;">' + d + '</span>' }).join('') +
        '</div>'
      }
    }

    // ── 액션 버튼
    var actionBtns = ''
    if (a.status === 'pending') {
      actionBtns = '<div style="display:flex;gap:6px;margin-top:10px;">' +
        '<button class="btn-approve" data-id="' + a.id + '" data-action="approved"><i class="fas fa-check" style="margin-right:3px;"></i>승인</button>' +
        '<button class="btn-reject"  data-id="' + a.id + '" data-action="rejected"><i class="fas fa-times" style="margin-right:3px;"></i>거절</button>' +
      '</div>'
    } else if (a.status === 'approved') {
      actionBtns = '<div style="display:flex;gap:6px;margin-top:10px;">' +
        '<button class="btn-reject" data-id="' + a.id + '" data-action="rejected"><i class="fas fa-times" style="margin-right:3px;"></i>거절로 변경</button>' +
        '<button class="btn-reset"  data-id="' + a.id + '" data-action="pending"><i class="fas fa-undo" style="margin-right:3px;"></i>대기로 변경</button>' +
      '</div>'
    } else if (a.status === 'rejected') {
      actionBtns = '<div style="display:flex;gap:6px;margin-top:10px;">' +
        '<button class="btn-approve" data-id="' + a.id + '" data-action="approved"><i class="fas fa-check" style="margin-right:3px;"></i>승인으로 변경</button>' +
        '<button class="btn-reset"   data-id="' + a.id + '" data-action="pending"><i class="fas fa-undo" style="margin-right:3px;"></i>대기로 변경</button>' +
      '</div>'
    }

    // ── 카드 배경: 승인+정산완료=초록 tint / 승인+미완료=주황 tint
    var cardBg = isApproved ? (isSettled ? 'background:#f8fdf9;border-color:#d1fae5;' : 'background:#fff9f5;border-color:#fed7aa;') : ''

    return '<div style="background:#fff;border-radius:14px;border:1px solid #ede9e2;' + cardBg + 'box-shadow:0 1px 3px rgba(0,0,0,.04);padding:14px 16px;">' +
      // 헤더 행: 번호 + 이름 + 상태배지
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">' +
        '<div style="display:flex;align-items:center;gap:10px;">' +
          '<div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;background:linear-gradient(135deg,#c9a035,#e8c16a);">' + (i+1) + '</div>' +
          '<div>' +
            '<p style="font-weight:700;font-size:13px;color:#111827;margin:0;">' + (a.applicant_name || '') + '</p>' +
            '<p style="font-size:11px;color:#9ca3af;margin:1px 0 0;">' + (a.nationality || '') + '</p>' +
          '</div>' +
        '</div>' +
        statusBadge +
      '</div>' +
      // 연락처 행
      '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:8px;">' +
        instaLink +
        (a.email ? '<a href="mailto:' + a.email + '" style="color:#3b82f6;font-size:11px;text-decoration:none;">' + a.email + '</a>' : '') +
        (a.phone ? '<span style="font-size:11px;color:#6b7280;"><i class="fab fa-whatsapp" style="color:#22c55e;margin-right:2px;"></i>' + a.phone + '</span>' : '') +
      '</div>' +
      // 승인 정보 (날짜 + 정산) or 희망날짜
      approvedRow +
      datesHtml +
      // 메시지
      (a.message ? '<div style="margin-top:8px;background:#f9fafb;border-radius:8px;padding:7px 10px;"><p style="font-size:11px;color:#6b7280;margin:0;">' + a.message + '</p></div>' : '') +
      // 액션 버튼
      actionBtns +
      // 신청일
      '<p style="font-size:10px;color:#d1d5db;margin:8px 0 0;">' + (a.created_at || '').replace('T',' ').slice(0,16) + '</p>' +
    '</div>'
  }).join('')
}

// ── 상태 변경 (이벤트 위임) ──────────────────
document.addEventListener('click', async function(e) {
  var btn = e.target.closest('[data-action]')
  if (!btn) return
  var appId  = btn.getAttribute('data-id')
  var action = btn.getAttribute('data-action')
  if (!appId || !action) return

  var pw = sessionStorage.getItem(SESSION_KEY)
  if (!pw) { alert('세션이 만료되었습니다. 페이지를 새로고침해주세요.'); return }

  var origHtml = btn.innerHTML
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
  btn.disabled  = true

  try {
    var res = await fetch('/api/clinic/share/applications/' + appId, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: _slug, password: pw, status: action })
    })
    var data = await res.json()
    if (data.success) {
      var idx = allApps.findIndex(function(a) { return String(a.id) === String(appId) })
      if (idx !== -1) allApps[idx].status = action
      renderList()
    } else {
      btn.innerHTML = origHtml; btn.disabled = false
      alert(data.error || '오류가 발생했습니다.')
    }
  } catch(err) {
    btn.innerHTML = origHtml; btn.disabled = false
    alert('네트워크 오류가 발생했습니다.')
  }
})

init()
<\/script>
</body>
</html>`
}
