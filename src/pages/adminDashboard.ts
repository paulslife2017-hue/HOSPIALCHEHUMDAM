// ════════════════════════════════════════════
// ADMIN DASHBOARD
// ════════════════════════════════════════════
export function adminDashboardHTML(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin · Seoul Beauty Trip</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body{font-family:'Inter',sans-serif;background:#f4f3f0;}
    .tab-btn{padding:10px 20px;font-size:13px;font-weight:500;color:#6b7280;border-bottom:2px solid transparent;cursor:pointer;white-space:nowrap;transition:all .15s;}
    .tab-btn.on{color:#c9a035;border-bottom-color:#c9a035;font-weight:600;}
    .card{background:#fff;border-radius:16px;border:1px solid #ede9e2;box-shadow:0 1px 4px rgba(0,0,0,.04);}
    .badge{display:inline-flex;align-items:center;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:600;}
    .badge-pending {background:#fef9c3;color:#854d0e;}
    .badge-approved{background:#dcfce7;color:#166534;}
    .badge-rejected{background:#fee2e2;color:#991b1b;}
    .modal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999;backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:16px;}
    .modal-bg.open{display:flex;}
    .modal-bg .sheet{max-height:90vh;overflow-y:auto;}
    input:focus,select:focus,textarea:focus{outline:none;border-color:#c9a035!important;box-shadow:0 0 0 3px rgba(201,160,53,.12)!important;}
    .btn-gold{background:linear-gradient(135deg,#c9a035,#e8c16a);color:#fff;font-weight:600;border:none;cursor:pointer;transition:all .2s;}
    .btn-gold:hover{background:linear-gradient(135deg,#b5900a,#d4aa50);}
    .row-hover:hover{background:#faf9f7;}
    ::-webkit-scrollbar{width:4px;height:4px;}
    ::-webkit-scrollbar-thumb{background:#d4c4a0;border-radius:4px;}
    /* ── 혜택 태그 칩 UI ── */
    .ben-tag-wrap{display:flex;flex-wrap:wrap;gap:6px;padding:8px 10px;min-height:44px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;cursor:text;transition:border-color .15s;}
    .ben-tag-wrap:focus-within{border-color:#c9a035;box-shadow:0 0 0 3px rgba(201,160,53,.12);}
    .ben-tag{display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,#fffbef,#fef3c7);border:1px solid #f0d88a;border-radius:99px;padding:3px 10px 3px 10px;font-size:12px;font-weight:500;color:#78350f;white-space:nowrap;max-width:280px;}
    .ben-tag span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .ben-tag button{background:none;border:none;cursor:pointer;color:#a16207;font-size:11px;padding:0;line-height:1;flex-shrink:0;width:14px;height:14px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .1s;}
    .ben-tag button:hover{background:#f59e0b22;}
    .ben-tag-input{border:none;outline:none;font-size:12px;color:#374151;min-width:140px;flex:1;background:transparent;padding:2px 4px;}
    .ben-tag-input::placeholder{color:#d1d5db;}
    .ben-add-btn{display:inline-flex;align-items:center;gap:4px;background:#f9f5ec;border:1px dashed #d4c4a0;border-radius:99px;padding:3px 10px;font-size:11px;font-weight:600;color:#a16207;cursor:pointer;transition:all .15s;white-space:nowrap;}
    .ben-add-btn:hover{background:#fef3c7;border-color:#f0d88a;}
  </style>
</head>
<body class="min-h-screen">

<!-- Header -->
<header class="bg-white border-b border-stone-200 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
        <i class="fas fa-seedling text-white text-xs"></i>
      </div>
      <span class="font-bold text-gray-900 text-sm">Seoul Beauty Trip</span>
      <span class="text-stone-300 text-xs ml-1">Admin</span>
    </div>
    <div class="flex items-center gap-4">
      <a href="/" target="_blank" class="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"><i class="fas fa-arrow-up-right-from-square text-[10px]"></i>View site</a>
      <button onclick="logout()" class="text-xs text-red-400 hover:text-red-500 flex items-center gap-1"><i class="fas fa-sign-out-alt text-[10px]"></i>Sign out</button>
    </div>
  </div>
</header>

<!-- Tabs -->
<div class="bg-white border-b border-stone-200 sticky top-14 z-40">
  <div class="max-w-7xl mx-auto px-5 flex overflow-x-auto" style="scrollbar-width:none;">
    <button id="tab-overview" onclick="showTab('overview')" class="tab-btn on"><i class="fas fa-chart-pie mr-1"></i>한눈에 보기</button>
    <button id="tab-apps"     onclick="showTab('apps')"     class="tab-btn">Applicants</button>
    <button id="tab-cal"      onclick="showTab('cal')"      class="tab-btn"><i class="fas fa-calendar-alt mr-1"></i>Calendar</button>
    <button id="tab-approved" onclick="showTab('approved')" class="tab-btn"><i class="fas fa-layer-group mr-1"></i>업체별 현황</button>
    <button id="tab-camps"    onclick="showTab('camps')"    class="tab-btn">Campaigns</button>
    <button id="tab-new"      onclick="showTab('new')"      class="tab-btn">+ New</button>
    <button id="tab-tg"       onclick="showTab('tg')"       class="tab-btn">Telegram</button>
  </div>
</div>

<main class="max-w-7xl mx-auto px-5 py-6 space-y-5">

  <!-- Stats row -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <div class="card p-4">
      <div class="text-2xl font-bold text-gray-900" id="s-total">—</div>
      <div class="text-xs text-gray-400 mt-0.5">Total Applicants</div>
    </div>
    <div class="card p-4">
      <div class="text-2xl font-bold text-amber-500" id="s-pending">—</div>
      <div class="text-xs text-gray-400 mt-0.5">Pending</div>
    </div>
    <div class="card p-4">
      <div class="text-2xl font-bold text-green-600" id="s-approved">—</div>
      <div class="text-xs text-gray-400 mt-0.5">Approved</div>
    </div>
    <div class="card p-4">
      <div class="text-2xl font-bold" style="color:#c9a035" id="s-camps">—</div>
      <div class="text-xs text-gray-400 mt-0.5">Active Campaigns</div>
    </div>
  </div>

  <!-- ── Overview panel ── -->
  <div id="panel-overview">

    <!-- 오늘 요약 카드 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      <div class="card p-4 cursor-pointer hover:shadow-md transition" onclick="showTab('apps')">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">오늘 신규 지원</span>
          <div class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:#fef3c7;">
            <i class="fas fa-user-plus text-amber-500 text-sm"></i>
          </div>
        </div>
        <div class="text-3xl font-black text-gray-900" id="ov-today">—</div>
        <div class="text-xs text-gray-400 mt-1">오늘 접수된 지원서</div>
      </div>
      <div class="card p-4 cursor-pointer hover:shadow-md transition" onclick="ovGoFilter('pending')">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">업체 검토 대기</span>
          <div class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:#fef9c3;">
            <i class="fas fa-hourglass-half text-yellow-500 text-sm"></i>
          </div>
        </div>
        <div class="text-3xl font-black text-amber-500" id="ov-pending">—</div>
        <div class="text-xs text-gray-400 mt-1">업체 승인 대기 중</div>
      </div>
      <div class="card p-4 cursor-pointer hover:shadow-md transition" onclick="ovGoFilter('approved')">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">총 승인</span>
          <div class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:#dcfce7;">
            <i class="fas fa-check-circle text-green-500 text-sm"></i>
          </div>
        </div>
        <div class="text-3xl font-black text-green-600" id="ov-approved">—</div>
        <div class="text-xs text-gray-400 mt-1">정산미완료 <span id="ov-unsettled" class="text-orange-500 font-bold"></span></div>
      </div>
      <div class="card p-4 cursor-pointer hover:shadow-md transition" onclick="showTab('camps')">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">활성 업체</span>
          <div class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:#ede9e2;">
            <i class="fas fa-hospital text-stone-500 text-sm"></i>
          </div>
        </div>
        <div class="text-3xl font-black" style="color:#c9a035" id="ov-active-camps">—</div>
        <div class="text-xs text-gray-400 mt-1">모집 중인 캠페인</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <!-- 왼쪽: 오늘 신규 지원자 -->
      <div class="card overflow-hidden">
        <div class="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900 text-sm">
              <i class="fas fa-star text-amber-400 mr-1.5"></i>오늘 지원자
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">오늘 접수된 신규 지원서</p>
          </div>
          <span id="ov-today-date" class="text-xs text-gray-400 font-medium"></span>
        </div>
        <div id="ov-today-list" class="divide-y divide-stone-50">
          <div class="text-center py-10 text-gray-300 text-xs">
            <i class="fas fa-spinner fa-spin text-xl mb-2 block"></i>불러오는 중…
          </div>
        </div>
      </div>

      <!-- 오른쪽: 업체 검토 대기 중인 신청 -->
      <div class="card overflow-hidden">
        <div class="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900 text-sm">
              <i class="fas fa-exclamation-circle text-amber-500 mr-1.5"></i>업체 승인 대기 중
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">업체가 아직 승인/거절 안 한 신청자</p>
          </div>
          <button onclick="loadOverview()" class="text-xs text-gray-400 hover:text-gray-600">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
        <div id="ov-pending-list" class="divide-y divide-stone-50">
          <div class="text-center py-10 text-gray-300 text-xs">
            <i class="fas fa-spinner fa-spin text-xl mb-2 block"></i>불러오는 중…
          </div>
        </div>
      </div>

    </div>

    <!-- 업체별 한줄 요약 -->
    <div class="card overflow-hidden mt-4">
      <div class="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h3 class="font-bold text-gray-900 text-sm">
            <i class="fas fa-layer-group text-stone-400 mr-1.5"></i>업체별 현황 요약
          </h3>
          <p class="text-xs text-gray-400 mt-0.5">업체별 대기 · 승인 · 거절 총계</p>
        </div>
        <button onclick="showTab('approved')" class="text-xs text-blue-500 hover:text-blue-700 font-semibold">
          전체 보기 →
        </button>
      </div>
      <div id="ov-clinic-summary" class="divide-y divide-stone-50">
        <div class="text-center py-10 text-gray-300 text-xs">
          <i class="fas fa-spinner fa-spin text-xl mb-2 block"></i>불러오는 중…
        </div>
      </div>
    </div>

  </div>

  <!-- ── Applicants panel ── -->
  <div id="panel-apps" class="hidden">
    <div class="card overflow-hidden">
      <div class="px-5 py-3.5 border-b border-stone-100 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <h2 class="font-semibold text-gray-900 text-sm">Applicants</h2>
        <div class="flex gap-2 flex-wrap">
          <select id="fCamp" onchange="loadApps()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white">
            <option value="">All campaigns</option>
          </select>
          <select id="fStatus" onchange="loadApps()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white">
            <option value="">All status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onclick="loadApps()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white hover:bg-stone-50 text-gray-500">
            <i class="fas fa-rotate-right"></i>
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[640px]">
          <thead class="bg-stone-50 text-[11px] text-gray-500 uppercase tracking-wide">
            <tr>
              <th class="text-left px-5 py-3">Applicant</th>
              <th class="text-left px-4 py-3 hidden sm:table-cell">Campaign</th>
              <th class="text-left px-4 py-3">Instagram</th>
              <th class="text-left px-4 py-3 hidden lg:table-cell">Available Dates</th>
              <th class="text-left px-4 py-3">Status</th>
              <th class="text-center px-4 py-3">복사</th>
              <th class="text-center px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody id="appsTable" class="divide-y divide-stone-50">
            <tr><td colspan="6" class="text-center py-10 text-xs text-gray-400">Loading…</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ── Calendar panel ── -->
  <div id="panel-cal" class="hidden">
    <div class="card p-5">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-5">
        <h2 class="font-semibold text-gray-900 text-sm"><i class="fas fa-calendar-alt mr-1.5 text-amber-500"></i>Booking Calendar</h2>
        <div class="flex gap-2 flex-wrap items-center">
          <select id="calCamp" onchange="renderCal()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white">
            <option value="">전체 업체</option>
          </select>
          <div class="flex items-center gap-1">
            <button onclick="changeMonth(-1)" class="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-stone-50 text-sm flex items-center justify-center"><i class="fas fa-chevron-left text-xs"></i></button>
            <span id="calMonthLabel" class="text-sm font-semibold text-gray-800 min-w-[120px] text-center"></span>
            <button onclick="changeMonth(1)"  class="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-stone-50 text-sm flex items-center justify-center"><i class="fas fa-chevron-right text-xs"></i></button>
          </div>
          <button onclick="calYear=new Date().getFullYear();calMonth=new Date().getMonth();renderCal()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white hover:bg-stone-50 text-gray-500">오늘</button>
        </div>
      </div>
      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-px bg-stone-200 rounded-xl overflow-hidden mb-4">
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-red-400 py-2">일</div>
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-gray-500 py-2">월</div>
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-gray-500 py-2">화</div>
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-gray-500 py-2">수</div>
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-gray-500 py-2">목</div>
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-gray-500 py-2">금</div>
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-blue-400 py-2">토</div>
        <div id="calGrid" class="contents"></div>
      </div>
      <!-- Selected day detail -->
      <div id="calDetail" class="hidden rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h3 id="calDetailTitle" class="font-semibold text-amber-900 text-sm mb-3"></h3>
        <div id="calDetailList" class="space-y-2"></div>
      </div>
    </div>
  </div>

  <!-- ── Campaigns panel ── -->
  <div id="panel-camps" class="hidden">
    <div class="card overflow-hidden">
      <div class="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
        <h2 class="font-semibold text-gray-900 text-sm">Campaigns</h2>
        <button onclick="showTab('new')" class="btn-gold text-xs px-3 py-1.5 rounded-lg">+ New</button>
      </div>
      <div id="campsContent" class="p-5"></div>
    </div>
  </div>

  <!-- ── New campaign panel ── -->
  <div id="panel-new" class="hidden">
    <div class="card p-6 max-w-2xl">
      <h2 class="font-bold text-gray-900 mb-0.5">New Campaign</h2>
      <p class="text-xs text-gray-400 mb-5">Paste a Google Maps link to auto-fill place info.</p>

      <!-- Step 1: Maps URL -->
      <div class="mb-5">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          <i class="fab fa-google text-blue-500 mr-1"></i>Google Maps Link <span class="text-red-400">*</span>
        </label>
        <div class="flex gap-2">
          <input id="nc_maps_url" type="text" placeholder="https://maps.app.goo.gl/…"
            class="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white" oninput="onMapsUrlChange()">
          <button id="nc_resolve_btn" onclick="resolveMapsUrl()"
            class="btn-gold px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5 whitespace-nowrap">
            <i class="fas fa-magnifying-glass text-xs"></i>Fetch
          </button>
        </div>
        <div id="nc_resolve_status" class="hidden mt-2 text-xs rounded-lg px-3 py-2"></div>
      </div>

      <!-- Place preview -->
      <div id="placePreview" class="hidden mb-5 rounded-xl p-4 flex items-center gap-4" style="background:#f0f7ff;border:1px solid #bfdbfe;">
        <div id="previewThumb" class="w-14 h-14 rounded-xl bg-white overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-300 border border-gray-200">
          <i class="fas fa-hospital text-xl"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p id="previewName" class="font-bold text-gray-900 text-sm"></p>
          <p id="previewAddr" class="text-xs text-gray-500 mt-0.5 truncate"></p>
          <span id="previewRating" class="text-xs text-amber-500 font-semibold"></span>
          <span class="text-xs text-green-600 font-medium ml-2">✓ Confirmed</span>
        </div>
        <button onclick="clearPlace()" class="text-gray-300 hover:text-red-400 text-xs"><i class="fas fa-times"></i></button>
      </div>

      <!-- Campaign form -->
      <form id="newCampForm" class="space-y-4">
        <input type="hidden" id="nc_place_id">
        <input type="hidden" id="nc_photo_ref">
        <input type="hidden" id="nc_rating">
        <input type="hidden" id="nc_place_name">
        <input type="hidden" id="nc_address">

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Campaign Title <span class="text-red-400">*</span></label>
          <input id="nc_title" type="text" placeholder="e.g. Yonsei Midas Dental Experience"
            class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
          <select id="nc_category" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white" onchange="onCategoryChange()">
            <option>Clinic</option><option>Beauty Shop</option><option>Dental Clinic</option><option>Korean Medicine</option><option>Hair & Scalp Spa</option>
          </select>
        </div>

        <!-- Benefits: 태그 칩 UI -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            제공 혜택 서비스 <span class="text-gray-300 font-normal normal-case">(항목별로 추가, 한글 자동번역)</span>
          </label>
          <div id="nc_ben_tags" class="ben-tag-wrap" onclick="document.getElementById('nc_ben_input').focus()">
            <!-- 태그들이 여기 동적 추가됨 -->
            <input id="nc_ben_input" class="ben-tag-input" placeholder="서비스 입력 후 Enter 또는 + 클릭"
              onkeydown="ncBenKeydown(event)" oninput="ncBenInputChange(this)">
          </div>
          <div class="flex items-center gap-2 mt-1.5">
            <button type="button" onclick="ncBenAddCurrent()" class="ben-add-btn">
              <i class="fas fa-plus" style="font-size:9px;"></i> 항목 추가
            </button>
            <span class="text-xs text-gray-400">예: <span class="text-amber-600 cursor-pointer" onclick="ncBenAddSample('무료 침 30분')">무료 침 30분</span> · <span class="text-amber-600 cursor-pointer" onclick="ncBenAddSample('추나치료')">추나치료</span> · <span class="text-amber-600 cursor-pointer" onclick="ncBenAddSample('부항')">부항</span></span>
          </div>
          <input type="hidden" id="nc_benefits" value="">
          <input type="hidden" id="nc_benefits_final" value="">
          <div id="nc_benefits_translated" class="hidden"></div>
          <div id="nc_benefits_en" style="display:none"></div>
        </div>

        <!-- Requirements: 한글 입력 → 영어 자동 번역 -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            지원 조건 <span class="text-gray-300 font-normal normal-case">(한글로 입력하면 자동 번역)</span>
          </label>
          <div class="relative">
            <input id="nc_req" type="text" placeholder="예) 팔로워 3천명 이상, 여행 콘텐츠 계정"
              class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm pr-20"
              oninput="onKoreanInput('nc_req', 'nc_req_translated')">
            <button type="button" onclick="translateField('nc_req', 'nc_req_translated')"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2.5 py-1 rounded-lg btn-gold">번역</button>
          </div>
          <div id="nc_req_translated" class="hidden mt-1.5 text-xs text-gray-500 bg-stone-50 rounded-lg px-3 py-2 border border-stone-100">
            <span class="text-amber-500 font-semibold mr-1">EN</span><span id="nc_req_en"></span>
          </div>
          <input type="hidden" id="nc_req_final">
        </div>

        <!-- Description: 한글 입력 → 영어 자동 번역 -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            업체 설명 <span class="text-gray-300 font-normal normal-case">(신청자에게 표시 · 한글→영어 자동번역)</span>
          </label>
          <div class="relative">
            <textarea id="nc_desc" rows="3" placeholder="예) 인천공항 근처 프리미엄 치과로, 외국인 전문 영어 상담 가능. 미백·교정 등 다양한 시술 제공."
              class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
              oninput="onKoreanInputDesc()"></textarea>
            <button type="button" onclick="translateDesc()"
              class="absolute right-2 bottom-2 text-xs px-2.5 py-1 rounded-lg btn-gold">번역</button>
          </div>
          <div id="nc_desc_translated" class="hidden mt-1.5 text-xs text-gray-500 bg-stone-50 rounded-lg px-3 py-2 border border-stone-100">
            <span class="text-amber-500 font-semibold mr-1">EN</span><span id="nc_desc_en"></span>
          </div>
          <input type="hidden" id="nc_desc_final">
        </div>

        <div id="newCampErr" class="hidden bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100"></div>
        <div id="newCampOk"  class="hidden bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 border border-green-100"></div>
        <div class="flex gap-3">
          <button type="submit" class="btn-gold flex-1 py-2.5 rounded-xl text-sm">캠페인 만들기</button>
          <button type="button" onclick="resetNewForm()"
            class="px-5 bg-stone-100 hover:bg-stone-200 text-gray-600 rounded-xl text-sm font-medium">초기화</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ── Telegram panel ── -->
  <div id="panel-tg" class="hidden">
    <div class="card p-6 max-w-xl">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
          <i class="fab fa-telegram text-white text-lg"></i>
        </div>
        <div>
          <h2 class="font-bold text-gray-900 text-sm">Telegram Notifications</h2>
          <p class="text-xs text-gray-400">Get notified instantly when someone applies</p>
        </div>
      </div>
      <div class="space-y-3 mb-6">
        <div class="flex gap-3 p-3 bg-stone-50 rounded-xl">
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5" style="background:#c9a035">1</div>
          <div>
            <p class="text-sm font-medium text-gray-800">Create a bot via @BotFather</p>
            <p class="text-xs text-gray-500 mt-0.5">Search <code class="bg-gray-100 px-1 rounded">@BotFather</code> → <code class="bg-gray-100 px-1 rounded">/newbot</code> → copy your <b>Bot Token</b></p>
          </div>
        </div>
        <div class="flex gap-3 p-3 bg-stone-50 rounded-xl">
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5" style="background:#c9a035">2</div>
          <div>
            <p class="text-sm font-medium text-gray-800">Get your Chat ID</p>
            <p class="text-xs text-gray-500 mt-0.5">Send a message to your bot → open <code class="bg-gray-100 px-1 rounded">api.telegram.org/bot<b>TOKEN</b>/getUpdates</code> → find <code class="bg-gray-100 px-1 rounded">chat.id</code></p>
          </div>
        </div>
        <div class="flex gap-3 p-3 bg-stone-50 rounded-xl">
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5" style="background:#c9a035">3</div>
          <div>
            <p class="text-sm font-medium text-gray-800">Add to .dev.vars</p>
            <pre class="bg-gray-900 text-green-400 rounded-lg p-3 text-xs mt-2">TELEGRAM_BOT_TOKEN=7123…
TELEGRAM_CHAT_ID=123456789</pre>
          </div>
        </div>
      </div>
      <div class="border-t border-stone-100 pt-5 space-y-3">
        <h3 class="text-sm font-semibold text-gray-700">Test Connection</h3>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Bot Token</label>
          <input id="tgToken" type="text" placeholder="7123456789:AAFxxxx…" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Chat ID</label>
          <input id="tgChatId" type="text" placeholder="123456789" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
        </div>
        <div id="tgResult" class="hidden text-sm rounded-xl px-4 py-3"></div>
        <button onclick="testTelegram()" class="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-xl text-sm">
          <i class="fab fa-telegram mr-2"></i>Send Test Message
        </button>
      </div>
    </div>
  </div>

  <!-- ── 업체 승인 내역 panel ── -->
  <div id="panel-approved" class="hidden">

    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div>
        <h2 class="font-bold text-gray-900 text-base"><i class="fas fa-layer-group text-amber-500 mr-2"></i>업체별 신청 현황</h2>
        <p class="text-xs text-gray-400 mt-0.5">업체별로 대기·승인·거절 신청자를 한눈에 확인합니다</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="loadApproved()" class="text-xs btn-gold px-3 py-2 rounded-xl flex items-center gap-1.5"><i class="fas fa-sync-alt"></i>새로고침</button>
        <button onclick="exportApproved()" class="text-xs bg-white border border-stone-200 text-gray-600 font-semibold px-3 py-2 rounded-xl hover:bg-stone-50 transition flex items-center gap-1.5"><i class="fas fa-file-csv text-green-500"></i>CSV</button>
      </div>
    </div>

    <div id="approvedLoading" class="text-center py-20 text-gray-400">
      <i class="fas fa-spinner fa-spin text-2xl mb-2 block"></i>불러오는 중…
    </div>
    <div id="approvedList" class="space-y-4 hidden"></div>
    <p id="approvedEmpty" class="hidden text-center text-gray-400 text-sm py-20">
      <i class="fas fa-inbox text-3xl block mb-3 text-gray-200"></i>승인된 신청자가 없습니다
    </p>

  </div>

</main>

<!-- Applicant detail modal -->
<div id="appModal" class="modal-bg">
  <div id="appModalContent" class="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl max-h-[90vh] overflow-y-auto"></div>
</div>

<!-- Date-pick modal (승인/일정수정 공용) -->
<div id="datePickModal" class="modal-bg">
  <div class="bg-white rounded-2xl w-full max-w-sm mx-4 shadow-xl" style="max-height:92vh;overflow-y:auto;">
    <div class="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
      <div>
        <h3 id="datePickTitle" class="font-bold text-gray-900 text-sm"><i class="fas fa-calendar-check mr-1.5 text-green-500"></i>방문 날짜 선택</h3>
        <p id="datePickSubtitle" class="text-xs text-gray-400 mt-0.5"></p>
      </div>
      <button onclick="document.getElementById('datePickModal').classList.remove('open')" class="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-gray-400 flex items-center justify-center text-xl leading-none">&times;</button>
    </div>

    <!-- 지원자 제안 날짜 버튼 목록 -->
    <div class="px-5 pt-4 pb-2">
      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">지원자 희망 날짜</p>
      <div id="datePickList" class="space-y-1.5"></div>
    </div>

    <!-- 시간 선택 (날짜 선택 후 활성화) -->
    <div id="datePickTimeRow" class="px-5 pb-3 hidden">
      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">시간 선택</p>
      <div class="flex items-center gap-2">
        <select id="datePickHour" onchange="updateDatePickPreview()" class="flex-1 border border-amber-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300">
          <option value="">시</option>
          <option>09</option><option>10</option><option>11</option>
          <option>12</option><option>13</option><option>14</option>
          <option>15</option><option>16</option><option>17</option>
          <option>18</option><option>19</option>
        </select>
        <span class="text-gray-400 font-bold">:</span>
        <select id="datePickMin" onchange="updateDatePickPreview()" class="flex-1 border border-amber-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300">
          <option value="">분</option>
          <option>00</option><option>15</option><option>30</option><option>45</option>
        </select>
      </div>
      <p id="datePickPreview" class="text-xs text-green-600 font-semibold mt-2 hidden"></p>
    </div>

    <!-- 구분선 -->
    <div class="mx-5 border-t border-gray-100 my-1"></div>

    <!-- 직접 입력 -->
    <div class="px-5 pb-4">
      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">직접 입력</p>
      <input id="datePickCustom" type="text" placeholder="예: Jun 20, 2026 2:00 PM"
        oninput="onDatePickCustomInput()"
        class="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300">
    </div>

    <!-- 확인 버튼 -->
    <div class="px-5 pb-5 flex gap-2">
      <button onclick="document.getElementById('datePickModal').classList.remove('open')" class="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-500 hover:bg-stone-50">취소</button>
      <button id="datePickConfirm" onclick="confirmDateApprove()" class="flex-1 px-3 py-2.5 rounded-xl bg-green-600 text-white text-xs font-semibold hover:bg-green-700 flex items-center justify-center gap-1.5">
        <i class="fas fa-check"></i><span id="datePickConfirmLabel">이 날짜로 승인</span>
      </button>
    </div>
  </div>
</div>

<!-- Campaign Edit modal -->
<div id="editCampModal" class="modal-bg">
  <div class="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl max-h-[92vh] overflow-y-auto">
    <div class="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
      <div>
        <h3 class="font-bold text-gray-900 text-base">Edit Campaign</h3>
        <p id="editCampSubtitle" class="text-xs text-gray-400 mt-0.5"></p>
      </div>
      <button onclick="closeEditCamp()" class="text-gray-300 hover:text-gray-500 text-xl leading-none">×</button>
    </div>
    <form id="editCampForm" class="px-6 py-5 space-y-4">
      <input type="hidden" id="ec_id">

      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Campaign Title <span class="text-red-400">*</span></label>
        <input id="ec_title" type="text" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" required>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
        <select id="ec_category" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
          <option>Clinic</option><option>Dental Clinic</option><option>Beauty Shop</option><option>Korean Medicine</option><option>Hair &amp; Scalp Spa</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          업체 설명 <span class="text-gray-300 font-normal normal-case">(영어로 표시됨 · 한글→영어 번역 가능)</span>
        </label>
        <div class="relative">
          <textarea id="ec_desc" rows="4" placeholder="Describe the clinic/beauty shop for applicants…"
            class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none"
            oninput="onEcDescInput()"></textarea>
          <button type="button" onclick="translateEcDesc()"
            class="absolute right-2 bottom-2 text-xs px-2.5 py-1 rounded-lg btn-gold">번역</button>
        </div>
        <div id="ec_desc_translated" class="hidden mt-1.5 text-xs text-gray-500 bg-stone-50 rounded-lg px-3 py-2 border border-stone-100">
          <span class="text-amber-500 font-semibold mr-1">EN</span><span id="ec_desc_en"></span>
        </div>
        <input type="hidden" id="ec_desc_final">
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          제공 혜택 서비스 <span class="text-gray-300 font-normal normal-case">(항목별로 추가, 한글 자동번역)</span>
        </label>
        <div id="ec_ben_tags" class="ben-tag-wrap" onclick="document.getElementById('ec_ben_input').focus()">
          <!-- 태그들 동적 추가 -->
          <input id="ec_ben_input" class="ben-tag-input" placeholder="서비스 입력 후 Enter 또는 + 클릭"
            onkeydown="ecBenKeydown(event)" oninput="ecBenInputChange(this)">
        </div>
        <div class="flex items-center gap-2 mt-1.5">
          <button type="button" onclick="ecBenAddCurrent()" class="ben-add-btn">
            <i class="fas fa-plus" style="font-size:9px;"></i> 항목 추가
          </button>
          <button type="button" onclick="ecBenTranslateAll()" class="ben-add-btn" style="border-color:#c9a035;color:#92400e;">
            <i class="fas fa-language" style="font-size:10px;"></i> 전체 번역
          </button>
          <span id="ec_ben_translate_status" class="text-xs text-gray-400"></span>
        </div>
        <input type="hidden" id="ec_benefits" value="">
        <input type="hidden" id="ec_ben_final" value="">
        <div id="ec_ben_translated" class="hidden"></div>
        <div id="ec_ben_en" style="display:none"></div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          지원 조건 <span class="text-gray-300 font-normal normal-case">(한글→영어 번역 가능)</span>
        </label>
        <div class="relative">
          <input id="ec_req" type="text" placeholder="e.g. 3,000+ followers · travel content"
            class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm pr-20"
            oninput="onEcReqInput()">
          <button type="button" onclick="translateEcReq()"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2.5 py-1 rounded-lg btn-gold">번역</button>
        </div>
        <div id="ec_req_translated" class="hidden mt-1.5 text-xs text-gray-500 bg-stone-50 rounded-lg px-3 py-2 border border-stone-100">
          <span class="text-amber-500 font-semibold mr-1">EN</span><span id="ec_req_en"></span>
        </div>
        <input type="hidden" id="ec_req_final">
      </div>

      <!-- 업체 로그인 비밀번호 -->
      <div class="border-t border-stone-100 pt-4">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          <i class="fas fa-key mr-1 text-amber-500"></i>Clinic Login Password
          <span class="text-gray-300 font-normal normal-case ml-1">(업체가 /clinic-login 으로 로그인할 때 사용)</span>
        </label>
        <div class="flex gap-2">
          <input id="ec_clinic_pw" type="text" placeholder="비워두면 변경 안 됨"
            class="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
          <button type="button" onclick="genClinicPw()" title="랜덤 비밀번호 생성"
            class="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-gray-600 rounded-xl text-xs font-semibold whitespace-nowrap">
            <i class="fas fa-dice mr-1"></i>랜덤
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-1">
          설정된 비밀번호: <span id="ec_pw_status" class="font-medium text-gray-600">확인 중…</span>
          &nbsp;·&nbsp; 로그인 URL: <a id="ec_login_url" href="/clinic-login" target="_blank" class="text-blue-500 hover:underline">/clinic-login</a>
        </p>
      </div>

      <div id="editCampErr" class="hidden bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100"></div>
      <div id="editCampOk"  class="hidden bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 border border-green-100"></div>

      <div class="flex gap-3 pt-1">
        <button type="submit" class="btn-gold flex-1 py-2.5 rounded-xl text-sm">저장</button>
        <button type="button" onclick="closeEditCamp()"
          class="px-5 bg-stone-100 hover:bg-stone-200 text-gray-600 rounded-xl text-sm font-medium">취소</button>
      </div>
    </form>
  </div>
</div>

<script>
// ════════════════════════════════════════════
// 1. 전역 변수
// ════════════════════════════════════════════
const token = sessionStorage.getItem('adminToken')
if (!token) window.location.href = '/admin'
const H = { 'Content-Type':'application/json', 'X-Admin-Token': token }

// 달력 전역 변수
let calYear  = new Date().getFullYear()
let calMonth = new Date().getMonth()
let calApps  = []

// ════════════════════════════════════════════
// 2. 탭 / 로그아웃
// ════════════════════════════════════════════
function logout() {
  sessionStorage.removeItem('adminToken')
  window.location.href = '/admin'
}

function showTab(t) {
  ['overview','apps','cal','approved','camps','new','tg'].forEach(id => {
    document.getElementById('panel-' + id).classList.toggle('hidden', id !== t)
    document.getElementById('tab-' + id).classList.toggle('on', id === t)
  })
  if (t === 'overview') loadOverview()
  if (t === 'apps')     loadApps()
  if (t === 'camps')    loadCamps()
  if (t === 'cal')      loadCalData()
  if (t === 'approved') loadApproved()
}

// 한눈에보기에서 Applicants 탭으로 이동하며 필터 적용
function ovGoFilter(status) {
  showTab('apps')
  setTimeout(function() {
    var sel = document.getElementById('fStatus')
    if (sel) { sel.value = status; loadApps() }
  }, 100)
}

// ════════════════════════════════════════════
// 3. Stats & Applicants
// ════════════════════════════════════════════
async function loadStats() {
  try {
    const [ar, cr] = await Promise.all([
      fetch('/api/admin/applications', { headers: H }),
      fetch('/api/admin/campaigns',    { headers: H })
    ])
    const apps  = await ar.json()
    const camps = await cr.json()
    // token 만료/무효 시 재로그인
    if (!apps.success && apps.error === 'Unauthorized') { window.location.href = '/admin'; return }
    if (apps.success && apps.data) {
      document.getElementById('s-total').textContent    = apps.data.length
      document.getElementById('s-pending').textContent  = apps.data.filter(function(a){ return a.status === 'pending'  }).length
      document.getElementById('s-approved').textContent = apps.data.filter(function(a){ return a.status === 'approved' }).length
    }
    if (camps.success && camps.data) {
      document.getElementById('s-camps').textContent = camps.data.filter(function(c){ return c.status === 'active' }).length
      const sel = document.getElementById('fCamp')
      const cur = sel.value
      sel.innerHTML = '<option value="">All campaigns</option>' +
        camps.data.map(function(c){ return '<option value="' + c.id + '"' + (cur == c.id ? ' selected' : '') + '>' + (c.place_name_ko || c.place_name) + '</option>' }).join('')
      const calSel = document.getElementById('calCamp')
      if (calSel) {
        const calCur = calSel.value
        calSel.innerHTML = '<option value="">All clinics</option>' +
          camps.data.map(function(c){ return '<option value="' + c.id + '"' + (calCur == c.id ? ' selected' : '') + '>' + (c.place_name_ko || c.place_name) + '</option>' }).join('')
      }
    }
  } catch(e) { console.error('loadStats error', e) }
}

// ════════════════════════════════════════════
// Overview (한눈에 보기)
// ════════════════════════════════════════════
async function loadOverview() {
  try {
    var [appRes, campRes] = await Promise.all([
      fetch('/api/admin/applications', { headers: H }),
      fetch('/api/admin/campaigns',    { headers: H })
    ])
    var appJson  = await appRes.json()
    var campJson = await campRes.json()
    if (!appJson.success && appJson.error === 'Unauthorized') { window.location.href = '/admin'; return }

    var allApps  = appJson.data  || []
    var campData = campJson.data || []

    // KST(UTC+9) 기준 오늘 날짜
    var kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000)
    var todayStr   = kstNow.toISOString().slice(0,10)
    // created_at은 UTC로 저장되므로 +9시간 변환 후 날짜/시간 비교
    function toKstDate(utcStr) {
      if (!utcStr) return ''
      return new Date(new Date(utcStr.replace(' ','T')+'Z').getTime() + 9*60*60*1000).toISOString().slice(0,10)
    }
    function toKstTime(utcStr) {
      if (!utcStr) return ''
      return new Date(new Date(utcStr.replace(' ','T')+'Z').getTime() + 9*60*60*1000).toISOString().slice(11,16)
    }
    function toKstDateTime(utcStr) {
      if (!utcStr) return ''
      var kst = new Date(new Date(utcStr.replace(' ','T')+'Z').getTime() + 9*60*60*1000)
      return kst.toISOString().slice(0,16).replace('T',' ')
    }
    var todayApps  = allApps.filter(function(a){ return toKstDate(a.created_at) === todayStr })
    var pendingAll = allApps.filter(function(a){ return a.status === 'pending' })
    var approvedAll= allApps.filter(function(a){ return a.status === 'approved' })
    var unsettled  = approvedAll.filter(function(a){ return !a.settlement }).length
    var activeCamps= campData.filter(function(c){ return c.status === 'active' }).length

    // ── 상단 숫자 카드
    document.getElementById('ov-today').textContent        = String(todayApps.length)
    document.getElementById('ov-pending').textContent      = String(pendingAll.length)
    document.getElementById('ov-approved').textContent     = String(approvedAll.length)
    document.getElementById('ov-unsettled').textContent    = unsettled ? unsettled + '명 미정산' : '모두 정산완료'
    document.getElementById('ov-active-camps').textContent = String(activeCamps)
    document.getElementById('ov-today-date').textContent   = todayStr

    // ── 오늘 지원자 목록
    var todayEl = document.getElementById('ov-today-list')
    if (!todayApps.length) {
      todayEl.innerHTML = '<div style="text-align:center;padding:32px;color:#d1d5db;font-size:12px;"><i class="fas fa-inbox" style="font-size:28px;display:block;margin-bottom:8px;"></i>오늘 접수된 지원서가 없습니다</div>'
    } else {
      // 최신순 정렬
      var sorted = todayApps.slice().sort(function(a,b){ return (b.created_at||'').localeCompare(a.created_at||'') })
      todayEl.innerHTML = sorted.map(function(a) {
        var campName = (function(){
          var c = campData.find(function(c){ return String(c.id) === String(a.campaign_id) })
          return c ? (c.place_name_ko || c.place_name || c.title || '') : (a.campaign_title || '')
        })()
        var timeStr   = toKstTime(a.created_at)
        var statusBadge =
          a.status === 'approved' ? '<span style="background:#dcfce7;color:#166534;border-radius:99px;padding:1px 8px;font-size:10px;font-weight:700;">✅ 승인</span>'
        : a.status === 'rejected' ? '<span style="background:#fee2e2;color:#991b1b;border-radius:99px;padding:1px 8px;font-size:10px;font-weight:700;">❌ 거절</span>'
        : '<span style="background:#fef9c3;color:#92400e;border-radius:99px;padding:1px 8px;font-size:10px;font-weight:700;">⏳ 대기</span>'
        var instaLink = a.instagram
          ? '<a href="https://instagram.com/' + a.instagram + '" target="_blank" style="color:#ec4899;font-size:11px;font-weight:600;text-decoration:none;"><i class="fab fa-instagram" style="margin-right:2px;"></i>@' + a.instagram + '</a>'
          : ''
        return '<div style="display:flex;align-items:center;gap:10px;padding:10px 16px;transition:background .1s;" onmouseover="this.style.background=&quot;#faf9f7&quot;" onmouseout="this.style.background=&quot;transparent&quot;">' +
          '<div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#c9a035,#e8c16a);font-size:12px;font-weight:700;color:#fff;flex-shrink:0;">' +
            (a.applicant_name||'?').slice(0,1) +
          '</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">' +
              '<span style="font-weight:700;font-size:13px;color:#111827;">' + (a.applicant_name||'') + '</span>' +
              statusBadge +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:8px;margin-top:2px;flex-wrap:wrap;">' +
              '<span style="font-size:11px;color:#9ca3af;">' + campName + '</span>' +
              instaLink +
            '</div>' +
          '</div>' +
          '<div style="text-align:right;flex-shrink:0;">' +
            '<div style="font-size:12px;font-weight:700;color:#6b7280;">' + timeStr + '</div>' +
            '<div style="font-size:10px;color:#d1d5db;">' + (a.nationality||'') + '</div>' +
          '</div>' +
        '</div>'
      }).join('')
    }

    // ── 업체 승인 대기 목록 (pending 전체, 업체명 기준 그룹)
    var pendingEl = document.getElementById('ov-pending-list')
    if (!pendingAll.length) {
      pendingEl.innerHTML = '<div style="text-align:center;padding:32px;color:#d1d5db;font-size:12px;"><i class="fas fa-check-circle" style="font-size:28px;display:block;margin-bottom:8px;color:#bbf7d0;"></i>대기 중인 신청이 없습니다 🎉</div>'
    } else {
      // 업체별로 그룹
      var pendingByCamp = {}
      pendingAll.forEach(function(a) {
        var cid = String(a.campaign_id)
        if (!pendingByCamp[cid]) pendingByCamp[cid] = []
        pendingByCamp[cid].push(a)
      })
      var pendingHtml = ''
      Object.keys(pendingByCamp).forEach(function(cid) {
        var group = pendingByCamp[cid]
        var c = campData.find(function(c){ return String(c.id) === cid })
        var campName = c ? (c.place_name_ko || c.place_name || c.title || '') : (group[0].campaign_title || '알 수 없음')
        var clinicSlug = c ? (makeSlug(c.place_name_ko || c.place_name || '') || cid) : cid
        // 업체 헤더
        pendingHtml += '<div style="padding:8px 16px;background:#fefce8;border-bottom:1px solid #fef08a;display:flex;align-items:center;justify-content:space-between;">' +
          '<span style="font-size:12px;font-weight:700;color:#92400e;"><i class="fas fa-hospital" style="font-size:10px;margin-right:5px;color:#a16207;"></i>' + campName + '</span>' +
          '<div style="display:flex;align-items:center;gap:6px;">' +
            '<span style="background:#f59e0b;color:#fff;border-radius:99px;padding:1px 8px;font-size:10px;font-weight:700;">' + group.length + '명 대기</span>' +
            '<a href="/clinic/' + clinicSlug + '" target="_blank" style="color:#2563eb;font-size:10px;font-weight:600;text-decoration:none;background:#eff6ff;border:1px solid #bfdbfe;border-radius:5px;padding:2px 6px;">링크↗</a>' +
          '</div>' +
        '</div>'
        // 해당 업체 신청자들
        group.sort(function(a,b){ return (b.created_at||'').localeCompare(a.created_at||'') }).forEach(function(a) {
          var timeStr = toKstDateTime(a.created_at)
          var isNew   = (Date.now() - new Date((a.created_at||'').replace(' ','T')).getTime()) < 86400000
          var newBadge= isNew ? '<span style="background:#ef4444;color:#fff;border-radius:99px;padding:1px 5px;font-size:9px;font-weight:700;margin-left:3px;">NEW</span>' : ''
          var instaLink = a.instagram
            ? '<a href="https://instagram.com/' + a.instagram + '" target="_blank" style="color:#ec4899;font-size:11px;font-weight:600;text-decoration:none;"><i class="fab fa-instagram" style="font-size:10px;margin-right:2px;"></i>@' + a.instagram + '</a>'
            : ''
          pendingHtml += '<div style="display:flex;align-items:center;gap:10px;padding:9px 16px 9px 28px;border-bottom:1px solid #f9fafb;transition:background .1s;" onmouseover="this.style.background=&quot;#fffbeb&quot;" onmouseout="this.style.background=&quot;transparent&quot;">' +
            '<div style="flex:1;min-width:0;">' +
              '<div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">' +
                '<span style="font-weight:700;font-size:12px;color:#111827;">' + (a.applicant_name||'') + '</span>' +
                '<span style="font-size:10px;color:#9ca3af;">' + (a.nationality||'') + '</span>' +
                newBadge +
              '</div>' +
              '<div style="margin-top:2px;">' + instaLink + '</div>' +
            '</div>' +
            '<div style="text-align:right;flex-shrink:0;">' +
              '<div style="font-size:10px;color:#9ca3af;">' + timeStr + '</div>' +
            '</div>' +
          '</div>'
        })
      })
      pendingEl.innerHTML = pendingHtml
    }

    // ── 업체별 한줄 요약
    var summaryEl = document.getElementById('ov-clinic-summary')
    if (!campData.length) {
      summaryEl.innerHTML = '<div style="text-align:center;padding:24px;color:#d1d5db;font-size:12px;">캠페인 없음</div>'
    } else {
      summaryEl.innerHTML = campData.map(function(camp) {
        var cid    = String(camp.id)
        var apps   = allApps.filter(function(a){ return String(a.campaign_id) === cid })
        var pCnt   = apps.filter(function(a){ return a.status === 'pending'  }).length
        var aCnt   = apps.filter(function(a){ return a.status === 'approved' }).length
        var rCnt   = apps.filter(function(a){ return a.status === 'rejected' }).length
        var cName  = camp.place_name_ko || camp.place_name || camp.title || ('캠페인 ' + cid)
        var isInactive = camp.status === 'inactive'
        var todayCnt = apps.filter(function(a){ return toKstDate(a.created_at) === todayStr }).length

        var urgentBg = pCnt > 0 ? 'background:#fffbeb;' : ''
        var mouseoutBg = pCnt > 0 ? '#fffbeb' : 'transparent'
        return '<div style="display:flex;align-items:center;gap:8px;padding:11px 16px;' + urgentBg + 'transition:background .1s;cursor:pointer;" onclick="showTab(&quot;approved&quot;)" onmouseover="this.style.background=&quot;#faf9f7&quot;" onmouseout="this.style.background=&quot;' + mouseoutBg + '&quot;">' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">' +
              '<span style="font-weight:700;font-size:13px;color:' + (isInactive?'#9ca3af':'#111827') + ';">' + cName + '</span>' +
              (isInactive ? '<span style="background:#f3f4f6;color:#9ca3af;border-radius:99px;padding:1px 6px;font-size:9px;font-weight:600;">모집중단</span>' : '') +
              (todayCnt > 0 ? '<span style="background:#eff6ff;color:#2563eb;border-radius:99px;padding:1px 7px;font-size:10px;font-weight:700;">오늘 +' + todayCnt + '</span>' : '') +
            '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">' +
            '<div style="text-align:center;">' +
              '<div style="font-size:16px;font-weight:800;color:#92400e;">' + pCnt + '</div>' +
              '<div style="font-size:9px;color:#a16207;font-weight:600;">⏳ 대기</div>' +
            '</div>' +
            '<div style="text-align:center;">' +
              '<div style="font-size:16px;font-weight:800;color:#166534;">' + aCnt + '</div>' +
              '<div style="font-size:9px;color:#15803d;font-weight:600;">✅ 승인</div>' +
            '</div>' +
            '<div style="text-align:center;">' +
              '<div style="font-size:16px;font-weight:800;color:#991b1b;">' + rCnt + '</div>' +
              '<div style="font-size:9px;color:#b91c1c;font-weight:600;">❌ 거절</div>' +
            '</div>' +
            '<div style="width:1px;height:28px;background:#f0ece4;margin:0 2px;"></div>' +
            '<div style="text-align:center;min-width:32px;">' +
              '<div style="font-size:16px;font-weight:800;color:#374151;">' + apps.length + '</div>' +
              '<div style="font-size:9px;color:#9ca3af;font-weight:600;">총</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      }).join('')
    }

  } catch(e) {
    console.error('loadOverview error', e)
  }
}

async function loadApps() {
  const tb  = document.getElementById('appsTable')
  tb.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-xs text-gray-400">Loading…</td></tr>'
  const cid = document.getElementById('fCamp').value
  const st  = document.getElementById('fStatus').value
  let url   = '/api/admin/applications?'
  if (cid) url += 'campaign_id=' + cid + '&'
  if (st)  url += 'status=' + st
  try {
    const res  = await fetch(url, { headers: H })
    const json = await res.json()
    if (!json.success && json.error === 'Unauthorized') { window.location.href = '/admin'; return }
    const data = json.data || []
    // stats 실시간 업데이트
    document.getElementById('s-total').textContent    = data.length
    document.getElementById('s-pending').textContent  = data.filter(function(a){ return a.status === 'pending'  }).length
    document.getElementById('s-approved').textContent = data.filter(function(a){ return a.status === 'approved' }).length
    if (!data.length) {
      tb.innerHTML = '<tr><td colspan="7" class="text-center py-10 text-xs text-gray-400">No applicants yet</td></tr>'
      return
    }
    // 메시지 맵 초기화
    var _appMsgMap = {}
    tb.innerHTML = data.map(function(a) {
      const dates    = (a.preferred_dates || '').split('/').map(function(d){ return d.trim() }).filter(Boolean)
      // 날짜 버튼: 클릭 → 승인 or 일정수정 모달 바로 오픈
      const dateHtml = dates.map(function(d){
        var safeD  = d.replace(/&/g,'&amp;').replace(/"/g,'&quot;')
        var isApproved = a.status === 'approved'
        var btnStyle = isApproved
          ? 'display:inline-flex;align-items:center;gap:3px;background:#fef3c7;border:1px solid #fde68a;color:#92400e;border-radius:6px;padding:2px 8px;font-size:11px;font-weight:500;margin:1px;cursor:pointer;'
          : 'display:inline-flex;align-items:center;gap:3px;background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;border-radius:6px;padding:2px 8px;font-size:11px;font-weight:500;margin:1px;cursor:pointer;'
        var btnTitle = isApproved ? '이 날짜로 일정 변경' : '이 날짜로 승인'
        var icon = isApproved ? 'fa-calendar-pen' : 'fa-calendar-check'
        return '<button type="button" data-appid="' + a.id + '" data-dated="' + safeD + '" data-mode="' + (isApproved ? 'reschedule' : 'approve') + '" data-pd="' + (a.preferred_dates||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;') + '" onclick="quickApproveDate(this)" title="' + btnTitle + '" style="' + btnStyle + '">'
          + '<i class="far ' + icon + '" style="font-size:9px;opacity:0.7;"></i>' + safeD + '</button>'
      }).join('')
      const statusKo = a.status === 'approved' ? '✅ 승인' : a.status === 'rejected' ? '❌ 거절' : '⏳ 대기'
      var scheduledLine = a.scheduled_date
        ? '\\n📅 확정 날짜: ' + a.scheduled_date + '\\n'
        : (dates.length ? '\\n🗓 희망 날짜:\\n' + dates.map(function(d,i){ return '  ' + (i+1) + '. ' + d }).join('\\n') + '\\n' : '')
      const msg = '━━━━━━━━━━━━━━━━━━━━━━━━\\n'
        + '📋 방문 신청자 정보\\n'
        + '━━━━━━━━━━━━━━━━━━━━━━━━\\n'
        + '\\n🏥 업체: ' + (a.place_name_ko || a.place_name || a.campaign_title || '') + '\\n'
        + '\\n👤 이름: ' + a.applicant_name + '\\n'
        + '🌏 국적: ' + (a.nationality || '—') + '\\n'
        + '\\n📧 이메일: ' + a.email + '\\n'
        + (a.phone ? '💬 WhatsApp: ' + a.phone + '\\n' : '')
        + (a.instagram ? '📸 인스타: @' + a.instagram + '\\n    → instagram.com/' + a.instagram + '\\n' : '')
        + scheduledLine
        + (a.message ? '\\n💬 메모: ' + a.message + '\\n' : '')
        + '\\n' + statusKo
        + '\\n━━━━━━━━━━━━━━━━━━━━━━━━'
      _appMsgMap[a.id] = msg
      return \`<tr class="row-hover transition-colors">
        <td class="px-5 py-3.5">
          <p class="font-semibold text-sm text-gray-900">\${a.applicant_name}</p>
          <p class="text-xs text-gray-400">\${a.nationality}</p>
          <p class="text-xs text-gray-400">\${a.email}</p>
          \${a.phone ? \`<p class="text-xs text-gray-400"><i class="fab fa-whatsapp text-green-500 mr-0.5"></i>\${a.phone}</p>\` : ''}
        </td>
        <td class="px-4 py-3.5 hidden sm:table-cell">
          <p class="text-xs font-semibold text-gray-800">\${a.place_name_ko || a.place_name || ''}</p>
          <p class="text-xs text-gray-400">\${a.campaign_title || ''}</p>
        </td>
        <td class="px-4 py-3.5">
          \${a.instagram
            ? \`<a href="https://instagram.com/\${a.instagram}" target="_blank" class="inline-flex items-center gap-1 text-xs text-pink-500 font-semibold hover:text-pink-700 hover:underline"><i class="fab fa-instagram"></i>@\${a.instagram}<i class="fas fa-arrow-up-right-from-square text-[8px] opacity-60"></i></a>\`
            : '<span class="text-xs text-gray-300">—</span>'}
        </td>
        <td class="px-4 py-3.5 hidden lg:table-cell">
          \${a.scheduled_date
            ? \`<div class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold" style="background:#dcfce7;color:#166534"><i class="fas fa-calendar-check text-[10px]"></i>\${a.scheduled_date}</div>\`
            : \`<div class="flex flex-wrap gap-0.5">\${dateHtml || '<span class="text-xs text-gray-300">—</span>'}</div>\`}
        </td>
        <td class="px-4 py-3.5">
          <span class="badge badge-\${a.status}">\${{ pending:'⏳ 대기', approved:'✅ 승인', rejected:'❌ 거절' }[a.status] || a.status}</span>
        </td>
        <td class="px-3 py-3.5 text-center">
          <button id="copybtn-\${a.id}" onclick="copyAppMsg(\${a.id},this)" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold btn-gold whitespace-nowrap" title="업체 전달용 메시지 복사">
            <i class="fas fa-copy text-[10px]"></i>복사
          </button>
        </td>
        <td class="px-4 py-3.5 text-center">
          <div class="flex items-center justify-center gap-1">
            <button onclick='openAppDetail(\${JSON.stringify(a).replace(/"/g,"&quot;")})' class="w-7 h-7 rounded-lg bg-stone-100 hover:bg-amber-50 text-gray-500 hover:text-amber-600 flex items-center justify-center text-xs transition" title="상세">
              <i class="fas fa-eye"></i>
            </button>

          </div>
        </td>
      </tr>\`
    }).join('')
    window._appMsgMap = _appMsgMap
  } catch(e) {
    tb.innerHTML = '<tr><td colspan="6" class="text-center py-10 text-xs text-gray-400">Error loading data</td></tr>'
    console.error('loadApps error', e)
  }
}

// ─── 날짜/시간 선택 모달 (승인 & 일정수정 공용) ─────────────────────
var _datePickAppId    = null
var _datePickSelected = null   // 날짜 문자열 (시간 제외)
var _datePickMode     = 'approve'  // 'approve' | 'reschedule'

function _openDatePickModal(id, preferredDatesRaw, mode, currentScheduled) {
  _datePickAppId    = id
  _datePickSelected = null
  _datePickMode     = mode || 'approve'

  // 모달 타이틀/버튼 라벨
  var isReschedule = (_datePickMode === 'reschedule')
  document.getElementById('datePickTitle').innerHTML =
    '<i class="fas fa-' + (isReschedule ? 'calendar-pen' : 'calendar-check') + ' mr-1.5 text-' + (isReschedule ? 'amber' : 'green') + '-500"></i>'
    + (isReschedule ? '일정 수정' : '방문 날짜 선택')
  document.getElementById('datePickConfirmLabel').textContent = isReschedule ? '일정 수정 완료' : '이 날짜로 승인'
  document.getElementById('datePickConfirm').className = document.getElementById('datePickConfirm').className
    .replace(/bg-green-600 hover:bg-green-700|bg-amber-500 hover:bg-amber-600/g, '')
    + ' ' + (isReschedule ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700')

  // 현재 확정 날짜 표시
  document.getElementById('datePickSubtitle').textContent =
    currentScheduled ? '현재: ' + currentScheduled : ''

  // 시간 초기화
  document.getElementById('datePickHour').value = ''
  document.getElementById('datePickMin').value  = ''
  document.getElementById('datePickTimeRow').classList.add('hidden')
  document.getElementById('datePickPreview').classList.add('hidden')
  document.getElementById('datePickCustom').value = ''

  // 희망 날짜 목록
  var dates = (preferredDatesRaw || '').split('/').map(function(s){ return s.trim() }).filter(Boolean)
  var listEl = document.getElementById('datePickList')
  if (!dates.length) {
    listEl.innerHTML = '<p class="text-xs text-gray-400 italic py-1">제안된 날짜 없음 — 아래에 직접 입력하세요.</p>'
  } else {
    listEl.innerHTML = dates.map(function(d, i) {
      // 날짜·시간 분리: "Jun 22, 2026 1:30 PM" → datePart="Jun 22, 2026", timePart="1:30 PM"
      // 정규식 대신 연도(4자리) 위치로 분리 — 백슬래시 이스케이프 문제 회피
      d = d.trim()
      var yearIdx = -1
      for (var ci = 0; ci < d.length - 3; ci++) {
        var y = parseInt(d.slice(ci, ci+4))
        if (y >= 2020 && y <= 2099 && (ci === 0 || d[ci-1] === ' ')) { yearIdx = ci; break }
      }
      var datePart = yearIdx >= 0 ? d.slice(0, yearIdx + 4).trim() : d
      var timePart = yearIdx >= 0 && yearIdx + 4 < d.length ? d.slice(yearIdx + 4).trim() : ''
      // data 속성으로 값 전달 — onclick 인수 escape 문제 완전 우회
      var safeDate = datePart.replace(/&/g,'&amp;').replace(/"/g,'&quot;')
      var safeTime = timePart.replace(/&/g,'&amp;').replace(/"/g,'&quot;')
      return '<button type="button"'
        + ' data-dp="' + safeDate + '"'
        + ' data-tp="' + safeTime + '"'
        + ' onclick="selectDateOption(this)"'
        + ' class="dp-date-btn w-full text-left px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-700 hover:border-amber-400 hover:bg-amber-50 transition">'
        + '<div class="flex items-center justify-between">'
        + '<span><i class="far fa-calendar-alt mr-1.5 text-amber-400"></i><span class="font-semibold">' + datePart + '</span></span>'
        + (timePart ? '<span class="text-gray-400 text-[11px] bg-stone-100 px-2 py-0.5 rounded-lg"><i class="far fa-clock mr-0.5"></i>' + timePart + '</span>' : '')
        + '</div>'
        + '</button>'
    }).join('')
  }

  document.getElementById('datePickModal').classList.add('open')
}

async function approveWithDate(id, preferredDatesRaw) {
  await setStatus(id, 'approved')
}

// 달력 카드에서 호출 — 즉시 승인 처리
async function approveWithDatePreselect(id, preferredDatesRaw, preTimeInfo) {
  await setStatus(id, 'approved')
}

// 날짜 버튼 클릭 → 해당 날짜로 즉시 승인/일정변경
async function quickApproveDate(btn) {
  var appId     = btn.getAttribute('data-appid')
  var dated     = btn.getAttribute('data-dated')
  var mode      = btn.getAttribute('data-mode')   // 'approve' | 'reschedule'
  var pd        = btn.getAttribute('data-pd') || ''
  if (!appId || !dated) return

  var isReschedule = (mode === 'reschedule')
  var label = isReschedule ? '이 날짜로 일정 변경' : '이 날짜로 승인'

  if (!confirm(dated + String.fromCharCode(10) + label + '할까요?')) return

  var origHtml = btn.innerHTML
  btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size:10px"></i>'
  btn.disabled = true

  try {
    var payload = isReschedule
      ? { scheduled_date: dated }
      : { status: 'approved', scheduled_date: dated }
    var res = await fetch('/api/admin/applications/' + appId, {
      method: 'PATCH', headers: H, body: JSON.stringify(payload)
    })
    var data = await res.json()
    if (data.success || res.ok) {
      // 모달 열려있으면 닫기
      document.getElementById('appModal').classList.remove('open')
      loadApps()
      loadStats()
    } else {
      alert(data.error || '오류가 발생했습니다.')
      btn.innerHTML = origHtml
      btn.disabled = false
    }
  } catch(e) {
    alert('네트워크 오류')
    btn.innerHTML = origHtml
    btn.disabled = false
  }
}

function rescheduleApp(id, preferredDatesRaw, currentScheduled) {
  _openDatePickModal(id, preferredDatesRaw, 'reschedule', currentScheduled)
}

function selectDateOption(btnEl) {
  // data 속성에서 날짜·시간 읽기 (onclick 인수 escape 문제 우회)
  var datePart = btnEl.getAttribute('data-dp') || ''
  var timePart = btnEl.getAttribute('data-tp') || ''

  // 버튼 선택 표시
  var all = document.querySelectorAll('.dp-date-btn')
  for (var i = 0; i < all.length; i++) {
    all[i].classList.remove('border-green-500', 'bg-green-50', 'border-amber-500', 'bg-amber-50')
    all[i].classList.add('border-gray-200')
  }
  btnEl.classList.remove('border-gray-200')
  btnEl.classList.add(_datePickMode === 'reschedule' ? 'border-amber-500' : 'border-green-500',
                      _datePickMode === 'reschedule' ? 'bg-amber-50' : 'bg-green-50')

  // 체크 아이콘 표시
  all = document.querySelectorAll('.dp-date-btn .dp-check')
  for (var j = 0; j < all.length; j++) all[j].remove()
  var chk = document.createElement('span')
  chk.className = 'dp-check'
  chk.innerHTML = ' <i class="fas fa-check-circle text-green-500" style="font-size:13px"></i>'
  btnEl.querySelector('div').appendChild(chk)

  _datePickSelected = datePart
  document.getElementById('datePickCustom').value = ''

  // 시간 행 표시 — 기존 시간 힌트 채워주기
  document.getElementById('datePickTimeRow').classList.remove('hidden')
  var hr = document.getElementById('datePickHour')
  var mn = document.getElementById('datePickMin')

  if (timePart) {
    // "1:30 PM" → 13:30 파싱
    var tm = timePart.match(/([0-9]+):([0-9]+)[ ]*(AM|PM)?/i)
    if (tm) {
      var h = parseInt(tm[1])
      var m = tm[2]
      var ampm = (tm[3] || '').toUpperCase()
      if (ampm === 'PM' && h < 12) h += 12
      if (ampm === 'AM' && h === 12) h = 0
      var hStr = String(h).padStart(2, '0')
      // 가장 가까운 옵션 선택
      for (var oi = 0; oi < hr.options.length; oi++) {
        if (hr.options[oi].value === hStr) { hr.value = hStr; break }
      }
      // 분 15단위 반올림
      var mNum = parseInt(m)
      var mRound = String(Math.round(mNum / 15) * 15).padStart(2, '0')
      if (mRound === '60') mRound = '45'
      for (var oj = 0; oj < mn.options.length; oj++) {
        if (mn.options[oj].value === mRound) { mn.value = mRound; break }
      }
    }
  }
  updateDatePickPreview()
}

function onDatePickCustomInput() {
  // 직접 입력 시 버튼 선택 해제
  if (document.getElementById('datePickCustom').value.trim()) {
    var all = document.querySelectorAll('.dp-date-btn')
    for (var i = 0; i < all.length; i++) {
      all[i].classList.remove('border-green-500','bg-green-50','border-amber-500','bg-amber-50')
      all[i].classList.add('border-gray-200')
    }
    _datePickSelected = null
    document.getElementById('datePickTimeRow').classList.add('hidden')
    document.getElementById('datePickPreview').classList.add('hidden')
  }
}

function updateDatePickPreview() {
  if (!_datePickSelected) return
  var h = document.getElementById('datePickHour').value
  var m = document.getElementById('datePickMin').value
  var prev = document.getElementById('datePickPreview')
  if (h && m) {
    var hNum = parseInt(h)
    var ampm = hNum >= 12 ? 'PM' : 'AM'
    var h12  = hNum > 12 ? hNum - 12 : (hNum === 0 ? 12 : hNum)
    prev.textContent = '✅ ' + _datePickSelected + ' ' + h12 + ':' + m + ' ' + ampm
    prev.classList.remove('hidden')
  } else {
    prev.classList.add('hidden')
  }
}

function _buildScheduledString() {
  var custom = document.getElementById('datePickCustom').value.trim()
  if (custom) return custom
  if (!_datePickSelected) return null
  var h = document.getElementById('datePickHour').value
  var m = document.getElementById('datePickMin').value
  if (!h || !m) return _datePickSelected   // 시간 없이 날짜만
  var hNum = parseInt(h)
  var ampm = hNum >= 12 ? 'PM' : 'AM'
  var h12  = hNum > 12 ? hNum - 12 : (hNum === 0 ? 12 : hNum)
  return _datePickSelected + ' ' + h12 + ':' + m + ' ' + ampm
}

async function confirmDateApprove() {
  if (!_datePickAppId) return
  var scheduled = _buildScheduledString()
  if (!scheduled) { alert('날짜를 선택하거나 직접 입력해주세요.'); return }
  var btn = document.getElementById('datePickConfirm')
  btn.disabled = true
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>처리 중\u2026'
  try {
    var payload = _datePickMode === 'reschedule'
      ? { scheduled_date: scheduled }
      : { status: 'approved', scheduled_date: scheduled }
    await fetch('/api/admin/applications/' + _datePickAppId, {
      method: 'PATCH', headers: H, body: JSON.stringify(payload)
    })
    document.getElementById('datePickModal').classList.remove('open')
    _datePickAppId = null; _datePickSelected = null
    loadApps(); loadStats()
    setTimeout(function(){ showTab('cal'); loadCalData() }, 400)
  } finally {
    btn.disabled = false
    btn.innerHTML = '<i class="fas fa-check mr-1"></i><span id="datePickConfirmLabel">'
      + (_datePickMode === 'reschedule' ? '일정 수정 완료' : '이 날짜로 승인') + '</span>'
  }
}

async function setStatus(id, status) {
  await fetch('/api/admin/applications/' + id, { method:'PATCH', headers:H, body: JSON.stringify({ status }) })
  loadApps()
  loadStats()
}

function buildClinicMsg(a) {
  const dates = (a.preferred_dates || '').split('/').map(function(d){ return d.trim() }).filter(Boolean)
  var dateSection = ''
  if (a.scheduled_date) {
    dateSection = '\\n📅 Confirmed Date: ' + a.scheduled_date + '\\n'
  } else if (dates.length) {
    dateSection = '\\n🗓 Preferred Visit Dates:\\n' + dates.map(function(d,i){ return '  ' + (i+1) + '. ' + d }).join('\\n') + '\\n'
  } else {
    dateSection = '\\n📅 Visit Date: TBD\\n'
  }
  return '━━━━━━━━━━━━━━━━━━━━━━━━\\n'
    + '📢 Seoul Beauty Trip — Influencer Visit\\n'
    + '━━━━━━━━━━━━━━━━━━━━━━━━\\n'
    + '\\n👤 Name: ' + a.applicant_name + '\\n'
    + '🌏 Nationality: ' + (a.nationality || '—') + '\\n'
    + '\\n📧 Email: ' + a.email + '\\n'
    + (a.phone ? '💬 WhatsApp: ' + a.phone + '\\n' : '')
    + (a.instagram ? '📸 Instagram: @' + a.instagram + '\\n    → instagram.com/' + a.instagram + '\\n' : '')
    + dateSection
    + (a.message ? '\\n💬 Note: ' + a.message + '\\n' : '')
    + '\\n' + (a.scheduled_date
      ? '✅ Date confirmed — please prepare for the visit.'
      : 'Please confirm one of the available dates with the applicant.')
    + '\\n\\nThank you!\\n━━━━━━━━━━━━━━━━━━━━━━━━'
}

function copyToClipboard(text, btnEl) {
  navigator.clipboard.writeText(text).then(function() {
    const orig = btnEl.innerHTML
    btnEl.innerHTML = '<i class="fas fa-check mr-1"></i>복사됨!'
    btnEl.style.background = '#16a34a'
    setTimeout(function() { btnEl.innerHTML = orig; btnEl.style.background = '' }, 2000)
  })
}

function copyAppMsg(id, btnEl) {
  var msg = (window._appMsgMap || {})[id] || ''
  copyToClipboard(msg, btnEl)
}

function openAppDetail(a) {
  const dates    = (a.preferred_dates || '').split('/').map(d => d.trim()).filter(Boolean)
  // 상세 모달 내 날짜 버튼: 클릭 → 모달 닫고 날짜선택 모달 오픈
  const isApproved = a.status === 'approved'
  const dateHtml = dates.map(d => {
    var safeD = d.replace(/&/g,'&amp;').replace(/"/g,'&quot;')
    var btnLabel = isApproved ? '일정 변경' : '이 날짜로 승인'
    var btnColor = isApproved
      ? 'background:#fef3c7;border:1px solid #fde68a;color:#92400e;'
      : 'background:#dcfce7;border:1px solid #bbf7d0;color:#166534;'
    var btnIcon = isApproved ? 'fa-calendar-pen' : 'fa-check'
    return '<div class="w-full flex items-center gap-2 py-2 px-2 rounded-xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/30 transition">'
      + '<i class="far fa-calendar-alt text-amber-400 text-xs w-4 flex-shrink-0"></i>'
      + '<span class="text-sm text-gray-700 flex-1 font-medium">' + safeD + '</span>'
      + '<button type="button"'
      + ' data-appid="' + a.id + '"'
      + ' data-dated="' + safeD + '"'
      + ' data-mode="' + (isApproved ? 'reschedule' : 'approve') + '"'
      + ' data-pd="' + (a.preferred_dates||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;') + '"'
      + ' onclick="quickApproveDate(this)"'
      + ' style="flex-shrink:0;' + btnColor + 'border-radius:8px;padding:3px 10px;font-size:11px;font-weight:600;cursor:pointer;">'
      + '<i class="fas ' + btnIcon + ' mr-1" style="font-size:10px;"></i>' + btnLabel
      + '</button>'
      + '</div>'
  }).join('')
  const clinicMsg = buildClinicMsg(a)
  const instaUrl  = a.instagram ? 'https://instagram.com/' + a.instagram : ''
  document.getElementById('appModalContent').innerHTML = \`
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-gray-900 text-base">Applicant Detail</h3>
      <button onclick="document.getElementById('appModal').classList.remove('open')" class="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-gray-400 flex items-center justify-center text-xl leading-none">×</button>
    </div>

    <div class="grid grid-cols-2 gap-2 mb-3">
      <div class="bg-stone-50 rounded-xl p-3">
        <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Full Name</p>
        <p class="font-bold text-sm text-gray-900">\${a.applicant_name}</p>
      </div>
      <div class="bg-stone-50 rounded-xl p-3">
        <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Nationality</p>
        <p class="font-bold text-sm text-gray-900">\${a.nationality || '—'}</p>
      </div>
    </div>

    <div class="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3">
      <p class="text-[10px] font-semibold text-blue-500 uppercase tracking-wide mb-2">Contact</p>
      <div class="space-y-1.5">
        <div class="flex items-center gap-2">
          <i class="fas fa-envelope text-blue-400 w-4 text-xs flex-shrink-0"></i>
          <a href="mailto:\${a.email}" class="text-xs font-semibold text-blue-700 hover:underline break-all flex-1">\${a.email}</a>
          <button onclick="copyToClipboard('\${a.email}',this)" class="text-[10px] px-2 py-0.5 rounded-lg btn-gold flex-shrink-0"><i class="fas fa-copy mr-0.5"></i>Copy</button>
        </div>
        \${a.phone ? \`<div class="flex items-center gap-2">
          <i class="fab fa-whatsapp text-green-500 w-4 text-xs flex-shrink-0"></i>
          <a href="https://wa.me/\${a.phone.replace(/[^0-9]/g,'')}" target="_blank" class="text-xs font-semibold text-green-700 hover:underline flex-1">\${a.phone}</a>
          <button onclick="copyToClipboard('\${a.phone}',this)" class="text-[10px] px-2 py-0.5 rounded-lg btn-gold flex-shrink-0"><i class="fas fa-copy mr-0.5"></i>Copy</button>
        </div>\` : ''}
      </div>
    </div>

    <div class="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-xl p-3 mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <i class="fab fa-instagram text-pink-500 text-xl"></i>
        <div>
          <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Instagram</p>
          \${instaUrl
            ? \`<a href="\${instaUrl}" target="_blank" class="font-bold text-pink-600 text-sm hover:underline">@\${a.instagram} <i class="fas fa-arrow-up-right-from-square text-[9px]"></i></a>\`
            : '<span class="text-gray-400 text-xs">—</span>'}
        </div>
      </div>
      \${instaUrl ? \`<a href="\${instaUrl}" target="_blank" class="text-xs px-3 py-1.5 rounded-xl btn-gold flex items-center gap-1 flex-shrink-0"><i class="fab fa-instagram mr-1"></i>Open</a>\` : ''}
    </div>

    <div class="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-3">
      <p class="text-[10px] font-semibold text-amber-700 uppercase tracking-wide mb-2"><i class="far fa-calendar mr-1"></i>Available Dates</p>
      \${dateHtml || '<p class="text-xs text-gray-400">No dates provided</p>'}
    </div>

    <div class="bg-stone-50 rounded-xl p-3 mb-3">
      <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Campaign</p>
      <p class="font-semibold text-sm text-gray-900">\${a.campaign_title || '—'}</p>
      <p class="text-xs text-gray-500">\${a.place_name_ko || a.place_name || ''}</p>
    </div>

    \${a.message ? \`<div class="bg-stone-50 rounded-xl p-3 mb-3"><p class="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Message</p><p class="text-sm text-gray-700">\${a.message}</p></div>\` : ''}

    <div class="border-2 border-dashed border-amber-200 rounded-xl p-3 mb-4 bg-amber-50/40">
      <div class="flex items-center justify-between mb-2">
        <p class="text-[10px] font-bold text-amber-700 uppercase tracking-wide"><i class="fas fa-check mr-1"></i>Message to Clinic</p>
        <button onclick="copyToClipboard(document.getElementById('clinicMsgText').value,this)" class="text-[10px] px-2.5 py-1 rounded-lg btn-gold flex items-center gap-1"><i class="fas fa-copy mr-0.5"></i>Copy All</button>
      </div>
      <textarea id="clinicMsgText" rows="8" readonly style="width:100%;font-size:11px;line-height:1.6;background:#fff;border:1px solid #fde68a;border-radius:8px;padding:10px;resize:none;font-family:monospace;color:#374151;">\${clinicMsg}</textarea>
    </div>

    <div class="flex items-center justify-between pt-1">
      <div>
        <span class="badge badge-\${a.status} mr-2">\${{ pending:'⏳ 대기', approved:'✅ 승인', rejected:'❌ 거절' }[a.status]}</span>
        <span class="text-[10px] text-gray-400">\${new Date(a.created_at).toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'})}</span>
      </div>
      <div class="flex gap-1.5 flex-wrap">
        \${a.status !== 'approved' ? \`<button onclick="setStatus(\${a.id},'approved');document.getElementById('appModal').classList.remove('open')" style="background:#dcfce7;border:1px solid #bbf7d0;color:#166534;border-radius:8px;padding:5px 12px;font-size:11px;font-weight:600;cursor:pointer;"><i class="fas fa-check mr-1"></i>승인</button>\` : ''}
        \${a.status !== 'rejected' ? \`<button onclick="setStatus(\${a.id},'rejected');document.getElementById('appModal').classList.remove('open')" style="background:#fee2e2;border:1px solid #fecaca;color:#991b1b;border-radius:8px;padding:5px 12px;font-size:11px;font-weight:600;cursor:pointer;"><i class="fas fa-times mr-1"></i>거절</button>\` : ''}
        \${a.status !== 'pending' ? \`<button onclick="setStatus(\${a.id},'pending');document.getElementById('appModal').classList.remove('open')" style="background:#fef9c3;border:1px solid #fde68a;color:#854d0e;border-radius:8px;padding:5px 12px;font-size:11px;font-weight:600;cursor:pointer;"><i class="fas fa-undo mr-1"></i>대기</button>\` : ''}
      </div>
    </div>\`
  document.getElementById('appModal').classList.add('open')
}

// ════════════════════════════════════════════
// 4. Campaigns
// ════════════════════════════════════════════
// ════════════════════════════════════════════
// 4-A. 업체 승인 내역
// ── 업체 승인 내역 ──────────────────────────────
var _approvedData = []

async function loadApproved() {
  var loadEl  = document.getElementById('approvedLoading')
  var listEl  = document.getElementById('approvedList')
  var emptyEl = document.getElementById('approvedEmpty')
  loadEl.classList.remove('hidden')
  listEl.classList.add('hidden')
  emptyEl.classList.add('hidden')
  try {
    // 전체 신청자 + 캠페인 목록 동시 로드
    var [appRes, campRes] = await Promise.all([
      fetch('/api/admin/applications', { headers: H }),
      fetch('/api/admin/campaigns',    { headers: H })
    ])
    var appJson  = await appRes.json()
    var campJson = await campRes.json()
    if (!appJson.success && appJson.error === 'Unauthorized') { window.location.href = '/admin'; return }

    var allData  = appJson.data  || []
    var campData = campJson.data || []
    _approvedData = allData.filter(function(a){ return a.status === 'approved' })
    loadEl.classList.add('hidden')
    if (!campData.length) { emptyEl.classList.remove('hidden'); return }

    // 캠페인 기준으로 그룹 (신청자 없는 업체도 표시)
    listEl.innerHTML = campData.map(function(camp) {
      var cid  = String(camp.id)
      var apps = allData.filter(function(a){ return String(a.campaign_id) === cid })
      var pendingApps  = apps.filter(function(a){ return a.status === 'pending'  })
      var approvedApps = apps.filter(function(a){ return a.status === 'approved' })
      var rejectedApps = apps.filter(function(a){ return a.status === 'rejected' })
      var settledCnt   = approvedApps.filter(function(a){ return !!a.settlement }).length

      var clinicName = camp.place_name_ko || camp.place_name || camp.title || ('업체 ' + cid)
      var clinicSlug = makeSlug(camp.place_name_ko || camp.place_name || '') || cid
      var shareUrl   = location.origin + '/clinic/' + clinicSlug
      var isInactive = camp.status === 'inactive'

      // 신청자 행 렌더링 함수
      function makeRow(a) {
        var statusBadge =
          a.status === 'approved' ? '<span style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;border-radius:99px;padding:2px 9px;font-size:10px;font-weight:700;">✅ 승인</span>'
        : a.status === 'rejected' ? '<span style="background:#fee2e2;color:#991b1b;border:1px solid #fecaca;border-radius:99px;padding:2px 9px;font-size:10px;font-weight:700;">❌ 거절</span>'
        : '<span style="background:#fef9c3;color:#92400e;border:1px solid #fcd34d;border-radius:99px;padding:2px 9px;font-size:10px;font-weight:700;">⏳ 대기</span>'
        var instaLink = a.instagram
          ? '<a href="https://instagram.com/' + a.instagram + '" target="_blank" style="color:#ec4899;font-size:11px;font-weight:600;text-decoration:none;"><i class="fab fa-instagram" style="margin-right:2px;"></i>@' + a.instagram + '</a>'
          : '<span style="color:#d1d5db;font-size:11px;">—</span>'
        var dateChip = a.scheduled_date
          ? '<span style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;border-radius:6px;padding:1px 7px;font-size:10px;font-weight:600;"><i class="fas fa-calendar-check" style="font-size:9px;margin-right:2px;"></i>' + a.scheduled_date + '</span>'
          : '<span style="color:#d1d5db;font-size:10px;">—</span>'
        // 신청일 + NEW 배지 (24시간 이내)
        var createdRaw = a.created_at || ''
        var createdStr = toKstDateTime(createdRaw)
        var isToday    = new Date(new Date(createdRaw.replace(' ','T')+'Z').getTime() + 9*60*60*1000).toISOString().slice(0,10) === new Date(Date.now() + 9*60*60*1000).toISOString().slice(0,10)
        var isNew      = (Date.now() - new Date(createdRaw.replace(' ','T')).getTime()) < 86400000
        var newBadge   = isNew ? '<span style="background:#ef4444;color:#fff;border-radius:99px;padding:1px 6px;font-size:9px;font-weight:700;margin-left:4px;">NEW</span>' : ''
        var todayMark  = isToday ? '<span style="color:#f59e0b;font-size:9px;font-weight:700;margin-left:3px;">오늘</span>' : ''
        var createdChip = '<span style="display:inline-flex;align-items:center;gap:3px;background:#f3f4f6;border-radius:6px;padding:2px 7px;font-size:10px;color:#6b7280;white-space:nowrap;"><i class="far fa-clock" style="font-size:9px;"></i>' + createdStr + todayMark + '</span>' + newBadge
        // 승인된 경우만 정산·취소 버튼
        var actionBtns = ''
        if (a.status === 'approved') {
          var isSettled = !!a.settlement
          var settleBtn = '<button type="button" data-appid="' + a.id + '" data-settled="' + (isSettled?'1':'0') + '" onclick="toggleSettlement(this)" style="background:' + (isSettled?'#dcfce7':'#f3f4f6') + ';border:1px solid ' + (isSettled?'#bbf7d0':'#e5e7eb') + ';color:' + (isSettled?'#166534':'#6b7280') + ';border-radius:7px;padding:3px 9px;font-size:10px;font-weight:600;cursor:pointer;white-space:nowrap;">' + (isSettled?'✅ 정산완료':'□ 미정산') + '</button>'
          var cancelBtn = '<button type="button" onclick="approvedCancel(' + a.id + ',this)" style="background:#fee2e2;border:1px solid #fecaca;color:#991b1b;border-radius:7px;padding:3px 9px;font-size:10px;font-weight:600;cursor:pointer;">취소</button>'
          actionBtns = settleBtn + ' ' + cancelBtn
        }
        var rowBg = a.status === 'approved' ? '#f8fffe' : a.status === 'rejected' ? '#fffafa' : '#fffdf4'
        return '<tr style="border-bottom:1px solid #f3f4f6;background:' + rowBg + ';">' +
          '<td style="padding:9px 10px;">' + statusBadge + '</td>' +
          '<td style="padding:9px 10px;white-space:nowrap;">' +
            '<p style="font-weight:600;font-size:12px;color:#111827;margin:0;">' + (a.applicant_name||'') + '</p>' +
            '<p style="font-size:10px;color:#9ca3af;margin:2px 0 0;">' + (a.nationality||'') + '</p>' +
          '</td>' +
          '<td style="padding:9px 10px;">' + createdChip + '</td>' +
          '<td style="padding:9px 10px;">' + instaLink + '</td>' +
          '<td style="padding:9px 10px;">' + dateChip + '</td>' +
          '<td style="padding:9px 10px;text-align:right;white-space:nowrap;">' + actionBtns + '</td>' +
        '</tr>'
      }

      // 대기→승인→거절 순으로 정렬해서 표시
      var sortedApps = pendingApps.concat(approvedApps).concat(rejectedApps)
      var rows = sortedApps.map(makeRow).join('')
      var noApps = apps.length === 0

      return '<div class="card p-0 overflow-hidden mb-4">' +
        // ── 업체 헤더
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 16px;background:' + (isInactive?'#f9fafb':'#fafaf9') + ';border-bottom:1px solid #f0ece4;">' +
          '<div style="min-width:0;flex:1;">' +
            '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">' +
              '<p style="font-weight:700;font-size:14px;color:' + (isInactive?'#9ca3af':'#111827') + ';margin:0;">' + clinicName + '</p>' +
              (isInactive ? '<span style="background:#f3f4f6;color:#9ca3af;border:1px solid #e5e7eb;border-radius:99px;padding:1px 7px;font-size:10px;font-weight:600;">모집중단</span>' : '') +
              '<a href="' + shareUrl + '" target="_blank" style="display:inline-flex;align-items:center;gap:3px;background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;border-radius:6px;padding:2px 7px;font-size:10px;font-weight:600;text-decoration:none;" title="업체 공유링크"><i class="fas fa-external-link-alt" style="font-size:8px;"></i>링크</a>' +
            '</div>' +
            '<div style="display:flex;gap:10px;margin-top:5px;flex-wrap:wrap;">' +
              '<span style="font-size:11px;color:#92400e;font-weight:600;">⏳ 대기 ' + pendingApps.length + '명</span>' +
              '<span style="font-size:11px;color:#166534;font-weight:600;">✅ 승인 ' + approvedApps.length + '명</span>' +
              '<span style="font-size:11px;color:#991b1b;font-weight:600;">❌ 거절 ' + rejectedApps.length + '명</span>' +
              (approvedApps.length ? '<span style="font-size:11px;color:#6b7280;">· 정산완료 ' + settledCnt + '/' + approvedApps.length + '</span>' : '') +
            '</div>' +
          '</div>' +
          '<span style="background:' + (noApps?'#f3f4f6':'#fef3c7') + ';color:' + (noApps?'#9ca3af':'#92400e') + ';border:1px solid ' + (noApps?'#e5e7eb':'#fcd34d') + ';border-radius:99px;padding:3px 11px;font-size:11px;font-weight:700;white-space:nowrap;">총 ' + apps.length + '명</span>' +
        '</div>' +
        // ── 신청자 테이블
        (noApps
          ? '<p style="text-align:center;color:#d1d5db;font-size:12px;padding:20px;">신청자 없음</p>'
          : '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;min-width:480px;">' +
              '<thead><tr style="border-bottom:1px solid #f0ece4;background:#fafaf9;">' +
                '<th style="padding:6px 10px;font-size:10px;color:#9ca3af;font-weight:500;text-align:left;white-space:nowrap;">상태</th>' +
                '<th style="padding:6px 10px;font-size:10px;color:#9ca3af;font-weight:500;text-align:left;">신청자</th>' +
                '<th style="padding:6px 10px;font-size:10px;color:#9ca3af;font-weight:500;text-align:left;white-space:nowrap;">신청일시</th>' +
                '<th style="padding:6px 10px;font-size:10px;color:#9ca3af;font-weight:500;text-align:left;">인스타그램</th>' +
                '<th style="padding:6px 10px;font-size:10px;color:#9ca3af;font-weight:500;text-align:left;white-space:nowrap;">확정날짜</th>' +
                '<th style="padding:6px 10px;font-size:10px;color:#9ca3af;font-weight:500;text-align:right;">액션</th>' +
              '</tr></thead>' +
              '<tbody>' + rows + '</tbody>' +
            '</table></div>'
        ) +
      '</div>'
    }).join('')

    listEl.classList.remove('hidden')
  } catch(e) {
    loadEl.classList.add('hidden')
    emptyEl.textContent = '데이터를 불러오지 못했습니다.'
    emptyEl.classList.remove('hidden')
  }
}

async function toggleSettlement(btn) {
  var appId     = btn.getAttribute('data-appid')
  var wasSettled = btn.getAttribute('data-settled') === '1'
  var newVal    = wasSettled ? 0 : 1
  var origHTML  = btn.innerHTML
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
  btn.disabled  = true
  try {
    var res = await fetch('/api/admin/applications/' + appId, {
      method: 'PATCH', headers: H, body: JSON.stringify({ settlement: newVal })
    })
    var json = await res.json()
    if (!json.success) throw new Error(json.error || 'failed')
    // 버튼 UI 갱신 (페이지 전체 reload 없이 즉시 반영)
    btn.setAttribute('data-settled', String(newVal))
    if (newVal) {
      btn.style.background = '#dcfce7'; btn.style.borderColor = '#bbf7d0'; btn.style.color = '#166534'
      btn.innerHTML = '&#x2705; 정산완료'
    } else {
      btn.style.background = '#f3f4f6'; btn.style.borderColor = '#e5e7eb'; btn.style.color = '#6b7280'
      btn.innerHTML = '&#x25a1; 미정산'
    }
    btn.disabled = false
    // 헤더 카운트 동기화를 위해 전체 reload
    loadApproved()
  } catch(e) { btn.innerHTML = origHTML; btn.disabled = false; alert('정산 상태 변경 중 오류가 발생했습니다.') }
}

async function approvedCancel(id, btn) {
  if (!confirm('이 승인을 취소하시겠습니까?')) return
  var orig = btn.innerHTML
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
  btn.disabled = true
  try {
    await fetch('/api/admin/applications/' + id, { method:'PATCH', headers:H, body: JSON.stringify({ status:'pending' }) })
    loadApproved()
    loadStats()
  } catch(e) { btn.innerHTML = orig; btn.disabled = false; alert('오류가 발생했습니다.') }
}

function exportApproved() {
  if (!_approvedData.length) { alert('내보낼 데이터가 없습니다.'); return }
  var rows = [['업체명','신청자명','국적','이메일','WhatsApp','인스타그램','확정날짜','희망날짜','정산여부','신청일시']]
  _approvedData.forEach(function(a) {
    rows.push([
      a.place_name_ko || a.place_name || a.campaign_title || '',
      a.applicant_name || '',
      a.nationality || '',
      a.email || '',
      a.phone || '',
      a.instagram ? '@' + a.instagram : '',
      a.scheduled_date || '',
      (a.preferred_dates || '').split('/').join(' / '),
      a.settlement ? '완료' : '미완료',
      toKstDateTime(a.created_at || '')
    ])
  })
  var NL = String.fromCharCode(10)
  var csv = rows.map(function(r){
    return r.map(function(cell){ return '"' + String(cell).split('"').join('""') + '"' }).join(',')
  }).join(NL)
  var blob = new Blob(['\uFEFF' + csv], { type:'text/csv;charset=utf-8;' })
  var url  = URL.createObjectURL(blob)
  var dl   = document.createElement('a')
  dl.href = url; dl.download = 'approved_' + new Date().toISOString().slice(0,10) + '.csv'; dl.click()
  URL.revokeObjectURL(url)
}

// ════════════════════════════════════════════
// 4. Campaigns (업체별 신청자 보기 포함)
// ════════════════════════════════════════════
var _campAppsCache = {}

async function toggleCampStatus(id, newStatus, btn) {
  var label = newStatus === 'inactive' ? '모집을 중단하시겠습니까?' : '모집을 재개하시겠습니까?'
  if (!confirm(label)) return
  var orig = btn.innerHTML; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; btn.disabled = true
  try {
    var res  = await fetch('/api/admin/campaigns/' + id, { method:'PATCH', headers:H, body: JSON.stringify({ status: newStatus }) })
    var json = await res.json()
    if (!json.success) throw new Error(json.error || 'failed')
    loadCamps()
    loadStats()
  } catch(e) { btn.innerHTML = orig; btn.disabled = false; alert('오류가 발생했습니다.') }
}

async function loadCamps() {
  const el = document.getElementById('campsContent')
  el.innerHTML = '<p class="text-xs text-gray-400 text-center py-6">Loading…</p>'
  try {
    const [campRes, appRes] = await Promise.all([
      fetch('/api/admin/campaigns',    { headers: H }),
      fetch('/api/admin/applications', { headers: H })
    ])
    const campJson = await campRes.json()
    const appJson  = await appRes.json()
    if (!campJson.success && campJson.error === 'Unauthorized') { window.location.href = '/admin'; return }
    if (!campJson.success) { el.innerHTML = '<p class="text-xs text-red-400 text-center py-8">오류: ' + (campJson.error || 'unknown') + '</p>'; return }
    const camps = campJson.data || []
    const apps  = appJson.data  || []
    if (!camps.length) { el.innerHTML = '<p class="text-xs text-gray-400 text-center py-8">캠페인이 없습니다</p>'; return }

    // 캠페인별 신청자 캐싱
    _campAppsCache = {}
    ;(apps || []).forEach(function(a) {
      if (!_campAppsCache[a.campaign_id]) _campAppsCache[a.campaign_id] = []
      _campAppsCache[a.campaign_id].push(a)
    })

    el.innerHTML = '<div class="space-y-3">' + camps.map(function(c) {
      const pct        = Math.min(100, Math.round((c.current_participants / c.max_participants) * 100))
      const thumb      = c.place_photo_ref ? \`/api/places/photo?ref=\${c.place_photo_ref}\` : ''
      const campApps   = _campAppsCache[c.id] || []
      const pendingCnt  = campApps.filter(function(a){ return a.status === 'pending'  }).length
      const approvedCnt = campApps.filter(function(a){ return a.status === 'approved' }).length
      const rejectedCnt = campApps.filter(function(a){ return a.status === 'rejected' }).length
      const totalCnt    = campApps.length
      const pwPlain    = c.clinic_password_plain || ''
      const hasPw      = !!c.clinic_password

      return \`<div class="border border-stone-100 rounded-2xl overflow-hidden bg-white shadow-sm">
        <!-- 업체 헤더 -->
        <div class="flex items-center gap-3 p-4 cursor-pointer hover:bg-stone-50 transition" onclick="toggleCampApps(\${c.id})">
          <div class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 flex items-center justify-center">
            \${thumb
              ? \`<img src="\${thumb}" class="w-full h-full object-cover">\`
              : \`<i class="fas fa-hospital text-xl text-stone-300"></i>\`}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <p class="font-bold text-sm text-gray-900 truncate">\${c.place_name_ko || c.place_name}</p>
              <span class="text-xs \${c.status === 'active' ? 'text-green-500' : 'text-gray-300'}">\${c.status === 'active' ? '● 모집중' : '○ 종료'}</span>
            </div>
            <p class="text-xs text-gray-400 truncate">\${c.title}</p>
            <div class="flex items-center gap-3 mt-1.5 flex-wrap">
              <span class="text-xs font-semibold text-amber-600"><i class="fas fa-users mr-1"></i>\${totalCnt}명 신청</span>
              \${pendingCnt  ? \`<span class="text-xs text-amber-500">⏳ 대기 \${pendingCnt}</span>\` : ''}
              \${approvedCnt ? \`<span class="text-xs text-blue-500">✅ 승인 \${approvedCnt}</span>\` : ''}
              \${rejectedCnt ? \`<span class="text-xs text-red-400">❌ 거절 \${rejectedCnt}</span>\` : ''}
            </div>
            <!-- 비밀번호 배지 -->
            <div class="flex items-center gap-1.5 mt-1.5">
              \${hasPw && pwPlain
                ? \`<span class="inline-flex items-center gap-1 text-[11px] font-mono font-semibold bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-2 py-0.5" id="pw-badge-\${c.id}">\${pwPlain}</span>
                   <button onclick="event.stopPropagation();copyPw('\${pwPlain}',this)" class="text-[10px] text-gray-400 hover:text-amber-600 transition" title="비밀번호 복사"><i class="fas fa-copy"></i></button>\`
                : \`<span class="inline-flex items-center gap-1 text-[11px] text-gray-300"><i class="fas fa-lock-open mr-0.5"></i>비번 미설정</span>\`}
            </div>
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            \${c.status === 'active'
              ? \`<button onclick="event.stopPropagation();toggleCampStatus(\${c.id},'inactive',this)" class="text-xs text-red-400 hover:text-red-600 border border-red-100 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition font-medium" title="모집 중단">
                  <i class="fas fa-pause text-[10px] mr-0.5"></i>중단
                </button>\`
              : \`<button onclick="event.stopPropagation();toggleCampStatus(\${c.id},'active',this)" class="text-xs text-green-500 hover:text-green-700 border border-green-100 hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition font-medium" title="모집 재개">
                  <i class="fas fa-play text-[10px] mr-0.5"></i>재개
                </button>\`}
            <button onclick="event.stopPropagation();openEditCamp(\${JSON.stringify(c).replace(/"/g,'&quot;')})" class="text-xs text-amber-600 hover:text-amber-700 border border-amber-100 hover:bg-amber-50 px-2.5 py-1.5 rounded-lg transition font-medium" title="수정">
              <i class="fas fa-pen text-[10px]"></i>
            </button>
            \${c.share_token
              ? \`<button onclick="event.stopPropagation();copyShareLink(\${c.id},'\${c.share_token}',this)" data-name="\${c.place_name_ko||c.place_name||''}" data-pw="\${c.clinic_password_plain||''}" class="text-xs text-blue-500 hover:text-blue-600 border border-blue-100 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition font-medium" title="공유 링크 + 비밀번호 복사">
                  <i class="fas fa-link text-[10px] mr-0.5"></i>링크+비번
                </button>\`
              : ''}
            <i id="camp-chevron-\${c.id}" class="fas fa-chevron-down text-gray-300 text-xs ml-1 transition-transform"></i>
          </div>
        </div>

        <!-- 진행도 바 -->
        <div class="px-4 pb-3">
          <div class="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>\${c.current_participants} / \${c.max_participants === 9999 ? '∞' : c.max_participants}</span>
            <span>\${c.max_participants === 9999 ? '' : pct + '%'}</span>
          </div>
          <div class="h-1 bg-stone-100 rounded-full">
            <div class="h-full rounded-full transition-all" style="width:\${c.max_participants === 9999 ? 0 : pct}%;background:linear-gradient(90deg,#c9a035,#e8c16a)"></div>
          </div>
        </div>

        <!-- 신청자 목록 (접힘) -->
        <div id="camp-apps-\${c.id}" class="hidden border-t border-stone-100">
          \${totalCnt === 0
            ? \`<p class="text-center text-xs text-gray-400 py-6">아직 신청자가 없습니다</p>\`
            : \`<div class="p-3 space-y-2" id="camp-apps-list-\${c.id}"></div>\`}
        </div>
      </div>\`
    }).join('') + '</div>'

    // 신청자 있는 첫번째 캠페인 자동 펼치기
    const firstWithApps = camps.find(function(c){ return (_campAppsCache[c.id] || []).length > 0 })
    if (firstWithApps) toggleCampApps(firstWithApps.id, true)

  } catch(e) { console.error('loadCamps error', e) }
}

function toggleCampApps(campId, forceOpen) {
  const panel   = document.getElementById('camp-apps-' + campId)
  const chevron = document.getElementById('camp-chevron-' + campId)
  if (!panel) return
  const isHidden = panel.classList.contains('hidden')
  const open     = forceOpen !== undefined ? forceOpen : isHidden
  if (open) {
    panel.classList.remove('hidden')
    if (chevron) chevron.style.transform = 'rotate(180deg)'
    renderCampApps(campId)
  } else {
    panel.classList.add('hidden')
    if (chevron) chevron.style.transform = ''
  }
}

function renderCampApps(campId) {
  const listEl = document.getElementById('camp-apps-list-' + campId)
  if (!listEl) return
  const apps = _campAppsCache[campId] || []
  if (!apps.length) return

  // 필터 버튼
  const filterHtml = \`<div class="flex gap-1.5 mb-3">
    <button onclick="filterCampApps(\${campId},'all')"      id="cf-\${campId}-all"      class="camp-filter-\${campId} px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-800 text-white">전체 \${apps.length}</button>
    <button onclick="filterCampApps(\${campId},'pending')"  id="cf-\${campId}-pending"  class="camp-filter-\${campId} px-3 py-1 rounded-full text-[11px] font-semibold bg-white text-gray-500 border border-gray-200">⏳ 대기 \${apps.filter(function(a){ return a.status==='pending' }).length}</button>
    <button onclick="filterCampApps(\${campId},'approved')" id="cf-\${campId}-approved" class="camp-filter-\${campId} px-3 py-1 rounded-full text-[11px] font-semibold bg-white text-gray-500 border border-gray-200">✅ 승인 \${apps.filter(function(a){ return a.status==='approved' }).length}</button>
    <button onclick="filterCampApps(\${campId},'rejected')" id="cf-\${campId}-rejected" class="camp-filter-\${campId} px-3 py-1 rounded-full text-[11px] font-semibold bg-white text-gray-500 border border-gray-200">❌ 거절 \${apps.filter(function(a){ return a.status==='rejected' }).length}</button>
  </div>\`

  listEl.innerHTML = filterHtml + \`<div id="camp-apps-rows-\${campId}"></div>\`
  renderCampAppRows(campId, 'all')
}

function filterCampApps(campId, filter) {
  // 버튼 스타일 토글
  document.querySelectorAll('.camp-filter-' + campId).forEach(function(b) {
    b.className = \`camp-filter-\${campId} px-3 py-1 rounded-full text-[11px] font-semibold bg-white text-gray-500 border border-gray-200\`
  })
  const activeBtn = document.getElementById('cf-' + campId + '-' + filter)
  if (activeBtn) activeBtn.className = \`camp-filter-\${campId} px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-800 text-white\`
  renderCampAppRows(campId, filter)
}

function renderCampAppRows(campId, filter) {
  const rowsEl = document.getElementById('camp-apps-rows-' + campId)
  if (!rowsEl) return
  const all  = _campAppsCache[campId] || []
  const list = filter === 'all' ? all : all.filter(function(a){ return a.status === filter })

  if (!list.length) {
    rowsEl.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">해당 신청자 없음</p>'
    return
  }

  rowsEl.innerHTML = list.map(function(a) {
    const statusMap = { pending: '⏳ 대기', approved: '✅ 승인', rejected: '❌ 거절' }
    const badgeStyle = {
      pending:  'background:#fef9c3;color:#854d0e',
      approved: 'background:#dbeafe;color:#1e40af',
      rejected: 'background:#fee2e2;color:#991b1b'
    }
    const dates = (a.preferred_dates || '').split('/').map(function(d){ return d.trim() }).filter(Boolean)
    const datesHtml = dates.slice(0,3).map(function(d){
      return \`<span style="background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;border-radius:6px;padding:2px 7px;font-size:10px;">\${d}</span>\`
    }).join('') + (dates.length > 3 ? \`<span style="font-size:10px;color:#9ca3af;">+\${dates.length-3}개</span>\` : '')

    return \`<div class="bg-stone-50 rounded-xl p-3 flex items-start gap-3">
      <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">\${(a.applicant_name||'?').charAt(0).toUpperCase()}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-0.5 flex-wrap">
          <p class="font-bold text-sm text-gray-900">\${a.applicant_name}</p>
          <span style="\${badgeStyle[a.status]};display:inline-block;padding:1px 8px;border-radius:99px;font-size:10px;font-weight:700;">\${statusMap[a.status]||a.status}</span>
        </div>
        <p class="text-xs text-gray-400">\${a.nationality || ''}</p>
        <div class="flex flex-wrap items-center gap-2 mt-1.5">
          \${a.instagram ? \`<a href="https://instagram.com/\${a.instagram}" target="_blank" class="text-xs text-pink-500 font-semibold hover:underline"><i class="fab fa-instagram mr-0.5"></i>@\${a.instagram}</a>\` : ''}
          <a href="mailto:\${a.email}" class="text-xs text-blue-500 hover:underline">\${a.email}</a>
          \${a.phone ? \`<span class="text-xs text-gray-400"><i class="fab fa-whatsapp text-green-500 mr-0.5"></i>\${a.phone}</span>\` : ''}
        </div>
        \${dates.length ? \`<div class="flex flex-wrap gap-1 mt-1.5">\${datesHtml}</div>\` : ''}
        \${a.message ? \`<p class="text-xs text-gray-500 mt-1 bg-white rounded-lg px-2 py-1 border border-stone-100">\${a.message}</p>\` : ''}
      </div>
      <div class="flex-shrink-0">
        <span class="text-[10px] font-bold px-2 py-1 rounded-lg" style="\${{ pending:'background:#fef9c3;color:#854d0e', approved:'background:#dcfce7;color:#166534', rejected:'background:#fee2e2;color:#991b1b' }[a.status]}">\${{ pending:'⏳ 대기', approved:'✅ 승인', rejected:'❌ 거절' }[a.status]||a.status}</span>
      </div>
    </div>\`
  }).join('')
}

function copyPw(pw, btn) {
  navigator.clipboard.writeText(pw).then(function() {
    var orig = btn.innerHTML
    btn.innerHTML = '<i class="fas fa-check text-green-500"></i>'
    setTimeout(function() { btn.innerHTML = orig }, 1500)
  }).catch(function() {
    prompt('비밀번호를 복사하세요:', pw)
  })
}

function makeSlug(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/, '')
    .slice(0, 60)
}

function copyShareLink(id, token, btn) {
  var name = btn.getAttribute('data-name') || String(id)
  var slug = makeSlug(name) || String(id)
  var url  = location.origin + '/clinic/' + slug
  navigator.clipboard.writeText(url).then(function() {
    var orig = btn.innerHTML
    btn.innerHTML = '<i class="fas fa-check text-[10px] mr-0.5"></i>복사됨!'
    btn.classList.add('text-green-600','border-green-200','bg-green-50')
    btn.classList.remove('text-blue-500','border-blue-100')
    setTimeout(function() { btn.innerHTML = orig; btn.classList.remove('text-green-600','border-green-200','bg-green-50'); btn.classList.add('text-blue-500','border-blue-100') }, 2000)
  }).catch(function() {
    prompt('링크를 복사하세요:', url)
  })
}

async function deactivate(id) {
  if (!confirm('Deactivate this campaign?')) return
  await fetch('/api/admin/campaigns/' + id, { method:'DELETE', headers:H })
  loadCamps()
  loadStats()
}

// ════════════════════════════════════════════
// 5. New Campaign Form
// ════════════════════════════════════════════

function onMapsUrlChange() {
  const v = document.getElementById('nc_maps_url').value.trim()
  if (v.startsWith('http') && v.length > 20) document.getElementById('nc_resolve_status').classList.add('hidden')
}

// ── 번역 공통 헬퍼 (Google Translate 비공식 API) ──────────────────────────
async function gtTranslate(text) {
  // 한글 없으면 원문 그대로
  if (!/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text)) return text
  try {
    // Google Translate 비공식 endpoint (브라우저에서 직접 호출 가능)
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=en&dt=t&q=' + encodeURIComponent(text)
    const res  = await fetch(url)
    const json = await res.json()
    // 결과 구조: [[['translated','original',...], ...], ...]
    const parts = json[0]
    if (!Array.isArray(parts)) return text
    return parts.map((p) => (p[0] || '')).join('').trim() || text
  } catch {
    return text
  }
}

// 한글 포함 여부 감지 → 번역 힌트 표시
function onKoreanInput(inputId, previewId) {
  const val = document.getElementById(inputId).value
  const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(val)
  if (!hasKorean) {
    document.getElementById(previewId).classList.add('hidden')
    const finalId = inputId === 'nc_benefits' ? 'nc_benefits_final' : 'nc_req_final'
    document.getElementById(finalId).value = val
  }
}

// Description: 한글 포함 여부 감지
function onKoreanInputDesc() {
  const val = document.getElementById('nc_desc').value
  const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(val)
  if (!hasKorean) {
    document.getElementById('nc_desc_translated').classList.add('hidden')
    document.getElementById('nc_desc_final').value = val
  }
}

// Description: 한글 → 영어 번역
async function translateDesc() {
  const val = document.getElementById('nc_desc').value.trim()
  if (!val) return
  const btn = event.target
  btn.textContent = '...'
  btn.disabled = true
  const translated = await gtTranslate(val)
  document.getElementById('nc_desc_en').textContent = translated
  document.getElementById('nc_desc_final').value = translated
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(val)) {
    document.getElementById('nc_desc_translated').classList.remove('hidden')
  }
  btn.textContent = '번역'
  btn.disabled = false
}

// Benefits / Requirements: 한글 → 영어 번역
async function translateField(inputId, previewId) {
  const val = document.getElementById(inputId).value.trim()
  if (!val) return
  const btn = event.target
  btn.textContent = '...'
  btn.disabled = true
  const translated = await gtTranslate(val)
  const enSpanId = inputId === 'nc_benefits' ? 'nc_benefits_en' : 'nc_req_en'
  const finalId  = inputId === 'nc_benefits' ? 'nc_benefits_final' : 'nc_req_final'
  document.getElementById(enSpanId).textContent = translated
  document.getElementById(finalId).value = translated
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(val)) {
    document.getElementById(previewId).classList.remove('hidden')
  } else {
    document.getElementById(previewId).classList.add('hidden')
  }
  btn.textContent = '번역'
  btn.disabled = false
}

async function resolveMapsUrl() {
  const url = document.getElementById('nc_maps_url').value.trim()
  const btn = document.getElementById('nc_resolve_btn')
  if (!url) { showResolveStatus('error', 'Please paste a Google Maps URL.'); return }
  btn.disabled = true
  btn.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i> Fetching…'
  showResolveStatus('loading', 'Looking up place info…')
  try {
    const res  = await fetch('/api/places/resolve', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ url }) })
    const data = await res.json()
    if (!data.success) { showResolveStatus('error', data.error || 'Could not find place.') }
    else { fillPlace(data.data); showResolveStatus('success', '✓ Place found!') }
  } catch { showResolveStatus('error', 'Network error.') }
  btn.disabled = false
  btn.innerHTML = '<i class="fas fa-magnifying-glass text-xs"></i> Fetch'
}

function showResolveStatus(type, msg) {
  const el = document.getElementById('nc_resolve_status')
  el.classList.remove('hidden')
  const styles = { error:'bg-red-50 text-red-600 border border-red-100', success:'bg-green-50 text-green-700 border border-green-100', loading:'bg-blue-50 text-blue-600' }
  el.className = 'mt-2 text-xs rounded-lg px-3 py-2 ' + (styles[type] || '')
  el.textContent = msg
}

// 카테고리별 description 템플릿 (API 호출 없이 즉시 생성)
function autoDescription(name, category, address) {
  var district = ''
  if (/gangnam|강남/i.test(address))      district = 'in the heart of Gangnam'
  else if (/sinsa|신사/i.test(address))   district = 'in Sinsa-dong, Gangnam'
  else if (/jamsil|잠실/i.test(address))  district = 'in Jamsil'
  else if (/hongdae|홍대/i.test(address)) district = 'in Hongdae'
  else if (/itaewon|이태원/i.test(address)) district = 'in Itaewon'
  else if (/incheon|인천/i.test(address)) district = 'at Incheon'
  else district = 'in Seoul'

  var cat = (category || '').toLowerCase()
  var nameL = (name || '').toLowerCase()
  // 이름에서 업종 먼저 감지 (카테고리보다 우선)
  var isDental = cat.includes('dental') || cat.includes('dent') ||
    /dental|dentist|치과|dent clinic/i.test(nameL)
  var isSkin = cat.includes('derm') || cat.includes('skin') ||
    /dermatol|skin clinic|피부과|피부 클리닉/i.test(nameL)
  var isPlasticSurg = cat.includes('plastic') || cat.includes('surgery') ||
    /plastic|성형외과|성형|rhinoplast/i.test(nameL)

  if (isDental) {
    return name + ' is a leading dental clinic ' + district + ', providing world-class Korean dentistry services including professional scaling, teeth whitening, cosmetic dentistry, and smile makeovers. Board-certified dentists speak fluent English and offer a full suite of treatments with state-of-the-art 3D digital imaging. Walk in and fly out with a brighter, healthier smile — no long waits, no language barriers.'
  }
  if (isPlasticSurg) {
    return name + ' is a renowned plastic surgery and aesthetic clinic ' + district + ', delivering precision cosmetic procedures including rhinoplasty, facial contouring, eye surgery, and non-surgical lifting treatments. Board-certified plastic surgeons provide thorough English consultations, reviewing your goals in detail before recommending a personalized treatment plan. Known for natural-looking results and meticulous aftercare, ' + name + ' is a trusted destination for international clients seeking transformative K-aesthetic care.'
  }
  if (isSkin || cat === 'clinic') {
    return name + ' is a premier dermatology clinic ' + district + ', offering cutting-edge aesthetic treatments including skin boosters, lifting procedures, laser therapy, and personalized anti-aging solutions. Staffed by board-certified dermatologists, the clinic welcomes international visitors with full English consultations and a calm, private atmosphere. Whether you are looking to refresh your skin, try the latest K-beauty clinical treatments, or receive expert care tailored to your skin type, ' + name + ' delivers results-driven dermatology with a distinctly personal touch.'
  }
  if (cat.includes('korean medicine') || cat.includes('한의')) {
    return name + ' is a renowned Korean traditional medicine clinic ' + district + ', blending centuries-old healing traditions with modern clinical expertise. Specializing in acupuncture, cupping therapy, manual therapy, and bespoke herbal medicine, the clinic welcomes international visitors with full English consultations and a warm, unhurried atmosphere. Each session begins with a one-on-one diagnostic consultation to craft a personalized treatment plan tailored to your needs.'
  }
  if (cat.includes('spa') || cat.includes('scalp') || cat.includes('hair')) {
    return name + ' is Seoul\u2019s premier head spa and scalp care destination ' + district + ', trusted by thousands of clients for its advanced scalp diagnosis and deeply restorative treatments. Each session begins with a thorough scalp analysis before moving into a relaxing sequence of aromatherapy, steam treatment, exfoliating scaling, and targeted RF therapy. With private rooms and English-speaking staff, ' + name + ' is the ultimate self-care experience for any traveler in Seoul.'
  }
  if (cat.includes('micro') || cat.includes('brow') || cat.includes('tattoo') || cat.includes('beauty')) {
    return name + ' is a premium beauty studio ' + district + ', specializing in professional aesthetic treatments and personalized beauty services. Staffed by certified specialists with extensive experience serving international clients, all consultations are conducted in English. Whether you are exploring K-beauty for the first time or looking for a specific treatment, ' + name + ' delivers a clean, comfortable, and professional experience tailored to your style and preferences.'
  }
  // 기본 (Beauty Shop 등)
  return name + ' is a top-rated beauty destination ' + district + ', offering a curated selection of premium aesthetic services in a welcoming, English-friendly environment. Known for its skilled specialists and personalized approach, ' + name + ' is a must-visit for travelers seeking authentic K-beauty experiences in Seoul.'
}

function fillPlace(p) {
  document.getElementById('nc_place_id').value   = p.place_id
  document.getElementById('nc_place_name').value = p.name
  document.getElementById('nc_address').value    = p.address
  document.getElementById('nc_photo_ref').value  = p.photo
  document.getElementById('nc_rating').value     = p.rating
  if (!document.getElementById('nc_title').value) document.getElementById('nc_title').value = p.name + ' Experience'
  document.getElementById('previewName').textContent   = p.name
  document.getElementById('previewAddr').textContent   = p.address
  document.getElementById('previewRating').textContent = p.rating ? '★ ' + p.rating : ''
  const th = document.getElementById('previewThumb')
  th.innerHTML = p.photo
    ? \`<img src="/api/places/photo?ref=\${p.photo}" class="w-full h-full object-cover">\`
    : '<i class="fas fa-hospital text-xl text-gray-300"></i>'
  document.getElementById('placePreview').classList.remove('hidden')

  // ── 기본값 자동세팅 (비어있을 때만 채움) ────────────────
  const reqEl  = document.getElementById('nc_req')
  const descEl = document.getElementById('nc_desc')
  const cat    = document.getElementById('nc_category').value

  if (!reqEl.value) {
    const handle = p.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const defaultReq = '3,000+ Instagram followers · Travel or beauty content preferred · Post 1 Reel within 3 weeks of visit · Tag @' + handle
    reqEl.value = defaultReq
    document.getElementById('nc_req_final').value = defaultReq
  }
  // 혜택 태그 기본값: 태그가 없을 때만 세팅
  if (!benTagsGet('nc_ben_tags').length) {
    benTagsLoad('nc_ben_tags', 'nc_benefits', 'nc_benefits_final',
      'Complimentary treatment session · Personalized English consultation · Tailored care plan')
  }
  if (!descEl.value) {
    const autoDesc = autoDescription(p.name, cat, p.address)
    descEl.value = autoDesc
    document.getElementById('nc_desc_final').value = autoDesc
  }
}

function clearPlace() {
  ['nc_place_id','nc_place_name','nc_address','nc_photo_ref','nc_rating','nc_maps_url'].forEach(id => document.getElementById(id).value = '')
  document.getElementById('placePreview').classList.add('hidden')
  document.getElementById('nc_resolve_status').classList.add('hidden')
}

function resetNewForm() {
  document.getElementById('newCampForm').reset()
  clearPlace()
  document.getElementById('newCampErr').classList.add('hidden')
  document.getElementById('newCampOk').classList.add('hidden')
  // 혜택 태그 초기화
  var ncWrap = document.getElementById('nc_ben_tags')
  Array.from(ncWrap.querySelectorAll('.ben-tag')).forEach(function(t){ t.remove() })
  document.getElementById('nc_ben_input').value = ''
  document.getElementById('nc_benefits').value = ''
  document.getElementById('nc_benefits_final').value = ''
  // 기타 초기화
  document.getElementById('nc_req_translated').classList.add('hidden')
  document.getElementById('nc_desc_translated').classList.add('hidden')
  document.getElementById('nc_req_final').value = ''
  document.getElementById('nc_desc_final').value = ''
  document.getElementById('nc_req_en').textContent = ''
  document.getElementById('nc_desc_en').textContent = ''
}

// 카테고리 변경 시 description 자동 갱신
function onCategoryChange() {
  const placeId = document.getElementById('nc_place_id').value
  if (!placeId) return  // place 미선택 시 무시
  const name    = document.getElementById('nc_place_name').value
  const address = document.getElementById('nc_address').value
  const cat     = document.getElementById('nc_category').value
  const descEl  = document.getElementById('nc_desc')
  // 이미 직접 입력한 경우 덮어쓰지 않음 (자동생성 결과와 다를 때만 갱신)
  const autoDesc = autoDescription(name, cat, address)
  descEl.value = autoDesc
  document.getElementById('nc_desc_final').value = autoDesc
  document.getElementById('nc_desc_translated').classList.add('hidden')
}

document.getElementById('newCampForm').addEventListener('submit', async e => {
  e.preventDefault()
  const errEl = document.getElementById('newCampErr')
  const okEl  = document.getElementById('newCampOk')
  errEl.classList.add('hidden')
  okEl.classList.add('hidden')
  if (!document.getElementById('nc_place_id').value) {
    errEl.textContent = 'Please fetch a Google Maps place first.'
    errEl.classList.remove('hidden')
    return
  }
  const btn = e.target.querySelector('button[type=submit]')
  btn.disabled = true
  btn.textContent = '번역 중…'

  // 한글이 있으면 저장 전 자동 번역
  const rawReq  = document.getElementById('nc_req').value.trim()
  const rawDesc = document.getElementById('nc_desc').value.trim()
  const reqVal  = await gtTranslate(rawReq)
  const descVal = await gtTranslate(rawDesc)
  // 혜택: 태그 칩 UI — 한글 태그 개별 번역
  const ncBenTags = benTagsGet('nc_ben_tags')
  var translatedBenTags = []
  for (var bi = 0; bi < ncBenTags.length; bi++) {
    translatedBenTags.push(/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(ncBenTags[bi]) ? await gtTranslate(ncBenTags[bi]) : ncBenTags[bi])
  }
  const benefitsVal = translatedBenTags.join(' \xb7 ')

  btn.textContent = 'Creating…'
  const body = {
    title:            document.getElementById('nc_title').value,
    description:      descVal,
    place_id:         document.getElementById('nc_place_id').value,
    place_name:       document.getElementById('nc_place_name').value,
    place_address:    document.getElementById('nc_address').value,
    place_photo_ref:  document.getElementById('nc_photo_ref').value,
    place_rating:     parseFloat(document.getElementById('nc_rating').value) || 0,
    category:         document.getElementById('nc_category').value,
    max_participants: 9999,
    deadline:         '',
    benefits:         benefitsVal,
    requirements:     reqVal,
  }
  try {
    const res  = await fetch('/api/admin/campaigns', { method:'POST', headers:H, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.success) {
      okEl.textContent = '✅ Campaign created!'
      okEl.classList.remove('hidden')
      btn.textContent = 'Created!'
      setTimeout(() => { resetNewForm(); showTab('camps'); btn.disabled = false; btn.textContent = 'Create Campaign' }, 1800)
    } else {
      errEl.textContent = data.error
      errEl.classList.remove('hidden')
      btn.disabled = false
      btn.textContent = 'Create Campaign'
    }
  } catch {
    errEl.textContent = 'Network error'
    errEl.classList.remove('hidden')
    btn.disabled = false
    btn.textContent = 'Create Campaign'
  }
})

// ════════════════════════════════════════════
// 6. Calendar
// ════════════════════════════════════════════
function changeMonth(delta) {
  calMonth += delta
  if (calMonth > 11) { calMonth = 0; calYear++ }
  if (calMonth < 0)  { calMonth = 11; calYear-- }
  renderCal()
}

async function loadCalData() {
  try {
    const { success, data } = await (await fetch('/api/admin/applications', { headers: H })).json()
    calApps = success ? data : []
    renderCal()
  } catch(e) {
    console.error('loadCalData error', e)
    calApps = []
    renderCal()
  }
}

function parseApplicantDates(app) {
  var raw = (app.preferred_dates || '')
  var out = ''
  for (var ci = 0; ci < raw.length; ci++) {
    var code = raw.charCodeAt(ci)
    if (code === 10 || code === 13 || raw[ci] === ',') {
      out += '|'
    } else {
      out += raw[ci]
    }
  }
  var lines = out.split('|').map(function(s) { return s.trim() }).filter(Boolean)
  var dates = []
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i]
    for (var j = 0; j <= line.length - 10; j++) {
      var sub = line.slice(j, j + 10)
      if (sub[4] === '-' && sub[7] === '-') {
        var y = parseInt(sub.slice(0,4)), mo = parseInt(sub.slice(5,7)), d = parseInt(sub.slice(8,10))
        if (y > 2000 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31) {
          dates.push({ dateStr: sub, timeStr: line.replace(sub, '').trim() })
          break
        }
      }
    }
  }
  return dates
}

function renderCal() {
  const label = document.getElementById('calMonthLabel')
  const grid  = document.getElementById('calGrid')
  if (!label || !grid) return

  const monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
  label.textContent = calYear + '년 ' + monthNames[calMonth]

  const campFilter = document.getElementById('calCamp')?.value || ''

  // dayMap: { 'YYYY-MM-DD': [ { app, isScheduled } ] }
  // approved + scheduled_date → 확정 날짜(초록) / pending → preferred_dates(노란)
  const dayMap = {}
  calApps.forEach(function(app) {
    if (campFilter && String(app.campaign_id) !== campFilter) return
    if (app.status === 'approved' && app.scheduled_date) {
      // 확정된 날짜 — scheduled_date에서 YYYY-MM-DD 추출
      var sd = app.scheduled_date
      var dateMatch = sd.match(/([0-9]{4}-[0-9]{2}-[0-9]{2})/)
      var key = null
      if (dateMatch) {
        key = dateMatch[1]
      } else {
        // "Jun 20, 2026" 같은 형식이면 Date 파싱
        try {
          var dt = new Date(sd)
          if (!isNaN(dt.getTime())) {
            key = dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0')
          }
        } catch(e) {}
      }
      if (key) {
        if (!dayMap[key]) dayMap[key] = []
        dayMap[key].push({ app: app, isScheduled: true })
      }
    } else if (app.status !== 'rejected') {
      // pending(또는 approved지만 scheduled_date 없는 경우) → preferred_dates 표시
      parseApplicantDates(app).forEach(function(pd) {
        if (!dayMap[pd.dateStr]) dayMap[pd.dateStr] = []
        dayMap[pd.dateStr].push({ app: app, isScheduled: false })
      })
    }
  })

  const firstDay    = new Date(calYear, calMonth, 1).getDay()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const today       = new Date()
  const todayStr    = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0')

  let html = ''
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="bg-white min-h-[80px] p-1.5"></div>'
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr  = calYear + '-' + String(calMonth+1).padStart(2,'0') + '-' + String(d).padStart(2,'0')
    const entries  = dayMap[dateStr] || []
    const isToday  = dateStr === todayStr
    const hasBk    = entries.length > 0
    const approved = entries.filter(function(e){ return e.isScheduled }).length
    const pending  = entries.filter(function(e){ return !e.isScheduled }).length

    const dots = entries.slice(0,5).map(function(e) {
      // 확정(초록) vs 대기(골드)
      const bg = e.isScheduled ? '#10b981' : '#c9a035'
      return '<span title="' + e.app.applicant_name + '" style="display:inline-block;width:6px;height:6px;border-radius:50%;background:' + bg + ';margin:0 1px;"></span>'
    }).join('')

    const countHtml = hasBk
      ? (approved ? \`<span style="color:#10b981;font-size:10px;font-weight:700;">\${approved}✓</span>\` : '')
        + (pending && approved ? \`<span style="color:#9ca3af;font-size:9px;"> / </span>\` : '')
        + (pending ? \`<span style="color:#c9a035;font-size:10px;font-weight:700;">\${pending}⏳</span>\` : '')
      : ''

    html += \`<div class="bg-white min-h-[80px] p-1.5 cursor-pointer hover:bg-amber-50 transition-colors \${isToday ? 'ring-2 ring-amber-400 ring-inset' : ''}" onclick="selectDay('\${dateStr}')">
      <div class="text-xs font-semibold \${isToday ? 'text-amber-600' : hasBk ? 'text-gray-900' : 'text-gray-400'} mb-0.5">\${d}</div>
      \${hasBk ? \`<div class="flex gap-0.5 flex-wrap mb-0.5">\${countHtml}</div>\` : ''}
      <div>\${dots}</div>
    </div>\`
  }
  grid.innerHTML = html

  if (dayMap[todayStr]) selectDay(todayStr)
  else document.getElementById('calDetail').classList.add('hidden')
}

function selectDay(dateStr) {
  var campFilter = (document.getElementById('calCamp') || {}).value || ''
  // entries: { app, isScheduled }
  var dayMap2 = {}
  calApps.forEach(function(app) {
    if (campFilter && String(app.campaign_id) !== campFilter) return
    var key = null
    var isScheduled = false
    if (app.status === 'approved' && app.scheduled_date) {
      var m = app.scheduled_date.match(/([0-9]{4}-[0-9]{2}-[0-9]{2})/)
      if (m) { key = m[1]; isScheduled = true }
      else {
        try {
          var dt = new Date(app.scheduled_date)
          if (!isNaN(dt.getTime())) {
            key = dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0')
            isScheduled = true
          }
        } catch(e) {}
      }
    }
    if (!key && app.status !== 'rejected') {
      parseApplicantDates(app).forEach(function(pd) {
        if (!dayMap2[pd.dateStr]) dayMap2[pd.dateStr] = []
        dayMap2[pd.dateStr].push({ app: app, isScheduled: false, timeStr: pd.timeStr })
      })
      return
    }
    if (key) {
      if (!dayMap2[key]) dayMap2[key] = []
      dayMap2[key].push({ app: app, isScheduled: isScheduled, timeStr: '' })
    }
  })

  var entries = dayMap2[dateStr] || []
  var detail  = document.getElementById('calDetail')
  var title   = document.getElementById('calDetailTitle')
  var list    = document.getElementById('calDetailList')

  if (!entries.length) { detail.classList.add('hidden'); return }

  var d     = new Date(dateStr + 'T00:00:00')
  var koDay = ['\uc77c','\uc6d4','\ud654','\uc218','\ubaa9','\uae08','\ud1a0'][d.getDay()]
  title.textContent = calYear + '\ub144 ' + (calMonth+1) + '\uc6d4 ' + d.getDate() + '\uc77c (' + koDay + ') \u2014 ' + entries.length + '\uac74'
  detail.classList.remove('hidden')

  list.innerHTML = entries.map(function(e) {
    var a           = e.app
    var isScheduled = e.isScheduled
    var timeInfo    = isScheduled ? (a.scheduled_date || '') : (e.timeStr || '')
    var badgeCls    = a.status === 'approved' ? 'background:#dbeafe;color:#1e40af'
                      : a.status === 'rejected' ? 'background:#fee2e2;color:#991b1b'
                      : 'background:#fef9c3;color:#854d0e'
    var statusKo    = a.status === 'approved' ? '\u2705 \uc804\ub2ec \uc644\ub8cc' : a.status === 'rejected' ? '\u274c \uac70\uc808' : '\u23f3 \ub300\uae30'
    var instaUrl    = a.instagram ? 'https://instagram.com/' + a.instagram : ''
    var msgLines    = '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\\n'
      + '\ud83d\udccb \ubc29\ubb38 \uc2e0\uccad\uc790 \uc815\ubcf4\\n'
      + '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\\n'
      + (isScheduled
          ? '\\n\ud83d\udcc5 \ud655\uc815 \ub0a0\uc9dc: ' + timeInfo + '\\n'
          : '\\n\ud83d\uddd3 \uc2e0\uccad \ub0a0\uc9dc: ' + dateStr + (timeInfo ? ' ' + timeInfo : '') + '\\n')
      + '\ud83c\udfe5 \uc5c5\uccb4: ' + (a.place_name_ko || a.place_name || a.campaign_title || '') + '\\n'
      + '\\n\ud83d\udc64 \uc774\ub984: ' + a.applicant_name + '\\n'
      + '\ud83c\udf0f \uad6d\uc801: ' + (a.nationality || '\u2014') + '\\n'
      + '\\n\ud83d\udce7 \uc774\uba54\uc77c: ' + a.email + '\\n'
      + (a.phone ? '\ud83d\udcac WhatsApp: ' + a.phone + '\\n' : '')
      + (a.instagram ? '\ud83d\udcf8 \uc778\uc2a4\ud0c0: @' + a.instagram + '\\n    \u2192 instagram.com/' + a.instagram + '\\n' : '')
      + (a.message ? '\\n\ud83d\udcac \uba54\ubaa8: ' + a.message + '\\n' : '')
      + '\\n' + statusKo
      + '\\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501'
    storeCalMsg(a.id, dateStr, msgLines)
    var borderCls = isScheduled ? 'border-green-100' : 'border-amber-100'
    return '<div class="bg-white rounded-xl border ' + borderCls + ' shadow-sm overflow-hidden mb-1">'
      + '<div class="flex items-center gap-3 px-4 py-3">'
      + '<div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style="background:linear-gradient(135deg,' + (isScheduled ? '#10b981,#34d399' : '#c9a035,#e8c16a') + ')">' + a.applicant_name.charAt(0).toUpperCase() + '</div>'
      + '<div class="flex-1 min-w-0">'
      + '<div class="flex items-center gap-2 flex-wrap">'
      + '<p class="font-bold text-sm text-gray-900">' + a.applicant_name + '</p>'
      + '<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full" style="' + badgeCls + '">' + statusKo + '</span>'
      + '</div>'
      + '<p class="text-xs text-gray-500 mt-0.5">' + (a.nationality || '') + ' \u00b7 ' + (timeInfo ? timeInfo : '\uc2dc\uac04 \ubbf8\uc815') + '</p>'
      + '<p class="text-xs text-gray-400">' + (a.place_name_ko || a.place_name || a.campaign_title || '') + '</p>'
      + '</div></div>'
      + '<div class="px-4 pb-3 flex flex-wrap gap-1.5 items-center border-t border-stone-50 pt-2.5">'
      + '<a href="mailto:' + a.email + '" class="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"><i class="fas fa-envelope text-[10px]"></i> ' + a.email + '</a>'
      + (a.phone ? '<a href="https://wa.me/' + a.phone.replace(/[^0-9]/g,'') + '" target="_blank" class="text-[11px] text-green-600 hover:underline flex items-center gap-0.5"><i class="fab fa-whatsapp text-[10px]"></i> ' + a.phone + '</a>' : '')
      + (instaUrl ? '<a href="' + instaUrl + '" target="_blank" class="text-[11px] text-pink-500 hover:underline flex items-center gap-0.5"><i class="fab fa-instagram text-[10px]"></i> @' + a.instagram + '</a>' : '')
      + '<button data-appid="' + a.id + '" data-datestr="' + dateStr + '" onclick="var b=this;copyCalMsg(b.dataset.appid,b.dataset.datestr,b)" class="ml-auto text-[11px] px-2.5 py-1 rounded-lg btn-gold flex items-center gap-1"><i class="fas fa-copy text-[10px]"></i>\uc5c5\uccb4 \uc804\ub2ec \ubcf5\uc0ac</button>'
      + '</div>'
      + '<div class="px-4 pb-3 border-t border-stone-50 pt-2.5 flex gap-2">'
      + (a.status !== 'approved'
          ? '<button class="dp-action-btn flex-1 text-xs bg-blue-600 text-white rounded-xl py-2 font-semibold hover:bg-blue-700 flex items-center justify-center gap-1.5 shadow-sm"' + ' data-act="approve" data-aid="' + a.id + '" data-pd="" data-sd="">' + '<i class="fas fa-check"></i>승인</button>'
          : '<span class="flex-1 text-xs text-center text-blue-600 font-semibold">✅ 승인</span>')
      + '</div>'
      + '</div>'
  }).join('')
}

var _calMsgMap = {}

function storeCalMsg(appId, dateStr, msg) {
  _calMsgMap[appId + '_' + dateStr] = msg
}

function copyCalMsg(appId, dateStr, btnEl) {
  var msg = _calMsgMap[appId + '_' + dateStr] || ''
  copyToClipboard(msg, btnEl)
}

// ════════════════════════════════════════════
// 7. Telegram
// ════════════════════════════════════════════
async function testTelegram() {
  const tToken = document.getElementById('tgToken').value.trim()
  const tChat  = document.getElementById('tgChatId').value.trim()
  const resEl  = document.getElementById('tgResult')
  if (!tToken || !tChat) {
    resEl.className = 'text-sm rounded-xl px-4 py-3 border bg-red-50 text-red-600 border-red-100'
    resEl.textContent = 'Enter both token and chat ID.'
    resEl.classList.remove('hidden')
    return
  }
  const msg = \`✅ <b>Seoul Beauty Trip</b>\\nTelegram connected! 🕐 \${new Date().toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})}\`
  try {
    const res  = await fetch(\`https://api.telegram.org/bot\${tToken}/sendMessage\`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id:tChat, text:msg, parse_mode:'HTML' }) })
    const data = await res.json()
    resEl.classList.remove('hidden')
    if (data.ok) {
      resEl.className = 'text-sm rounded-xl px-4 py-3 border bg-green-50 text-green-700 border-green-100'
      resEl.textContent = '✅ Message sent!'
    } else {
      resEl.className = 'text-sm rounded-xl px-4 py-3 border bg-red-50 text-red-600 border-red-100'
      resEl.textContent = '❌ ' + (data.description || 'Error')
    }
  } catch {
    resEl.className = 'text-sm rounded-xl px-4 py-3 border bg-red-50 text-red-600 border-red-100'
    resEl.textContent = '❌ Network error.'
    resEl.classList.remove('hidden')
  }
}

// ════════════════════════════════════════════
// 7-1. Edit Campaign 함수
// ════════════════════════════════════════════
function genClinicPw() {
  var chars = 'abcdefghijkmnpqrstuvwxyz23456789'
  var pw = ''
  for (var i = 0; i < 8; i++) pw += chars[Math.floor(Math.random() * chars.length)]
  document.getElementById('ec_clinic_pw').value = pw
}

function openEditCamp(c) {
  document.getElementById('ec_id').value       = c.id
  document.getElementById('ec_title').value    = c.title || ''
  document.getElementById('ec_category').value = c.category || 'Clinic'
  // Description
  document.getElementById('ec_desc').value       = c.description || ''
  document.getElementById('ec_desc_final').value = c.description || ''
  document.getElementById('ec_desc_en').textContent = ''
  document.getElementById('ec_desc_translated').classList.add('hidden')
  // Benefits — 태그 칩 UI 로드
  benTagsLoad('ec_ben_tags', 'ec_benefits', 'ec_ben_final', c.benefits || '')
  document.getElementById('ec_ben_input').value = ''
  document.getElementById('ec_ben_translate_status').textContent = ''
  // Requirements
  document.getElementById('ec_req').value        = c.requirements || ''
  document.getElementById('ec_req_final').value  = c.requirements || ''
  document.getElementById('ec_req_en').textContent = ''
  document.getElementById('ec_req_translated').classList.add('hidden')
  // 서브타이틀 & 피드백 초기화
  document.getElementById('editCampSubtitle').textContent = (c.place_name_ko || c.place_name || '') + (c.title ? ' · ' + c.title : '')
  document.getElementById('editCampErr').classList.add('hidden')
  document.getElementById('editCampOk').classList.add('hidden')
  // 비밀번호 필드 초기화
  document.getElementById('ec_clinic_pw').value = ''
  document.getElementById('ec_pw_status').textContent = c.clinic_password_plain
    ? '현재: ' + c.clinic_password_plain
    : (c.clinic_password ? '✅ 설정됨 (평문 미확인)' : '❌ 미설정')
  document.getElementById('editCampModal').classList.add('open')
}

function closeEditCamp() {
  document.getElementById('editCampModal').classList.remove('open')
}

// 한글 감지 — Description
function onEcDescInput() {
  const val = document.getElementById('ec_desc').value
  const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(val)
  if (!hasKorean) {
    document.getElementById('ec_desc_translated').classList.add('hidden')
    document.getElementById('ec_desc_final').value = val
  }
}

// ════════════════════════════════════════════
// 혜택 태그 칩 UI — 공통 헬퍼
// ════════════════════════════════════════════
function benTagsGet(wrapId) {
  var wrap = document.getElementById(wrapId)
  return Array.from(wrap.querySelectorAll('.ben-tag')).map(function(t) { return t.dataset.val || '' }).filter(Boolean)
}

function benTagsSync(wrapId, hiddenId, finalId) {
  var tags = benTagsGet(wrapId)
  var joined = tags.join(' \xb7 ')
  document.getElementById(hiddenId).value = joined
  if (finalId) document.getElementById(finalId).value = joined
}

function benTagRender(wrapId, hiddenId, finalId, val) {
  val = (val || '').trim()
  if (!val) return
  var wrap = document.getElementById(wrapId)
  var inputEl = wrap.querySelector('.ben-tag-input')
  // 중복 체크
  var existing = benTagsGet(wrapId)
  if (existing.indexOf(val) >= 0) { if(inputEl) inputEl.value = ''; return }
  // 태그 요소 — DOM API로 생성 (innerHTML 따옴표 충돌 방지)
  var tag = document.createElement('span')
  tag.className = 'ben-tag'
  tag.dataset.val = val
  var labelEl = document.createElement('span')
  labelEl.title = val
  labelEl.textContent = val
  var delBtn = document.createElement('button')
  delBtn.type = 'button'
  delBtn.title = '삭제'
  delBtn.textContent = '×'
  delBtn.addEventListener('click', function() {
    tag.remove()
    benTagsSync(wrapId, hiddenId, finalId)
  })
  tag.appendChild(labelEl)
  tag.appendChild(delBtn)
  // input 앞에 삽입
  wrap.insertBefore(tag, inputEl)
  if(inputEl) inputEl.value = ''
  benTagsSync(wrapId, hiddenId, finalId)
}

function benTagRemove(btn, wrapId, hiddenId, finalId) {
  btn.closest('.ben-tag').remove()
  benTagsSync(wrapId, hiddenId, finalId)
}

function benTagsLoad(wrapId, hiddenId, finalId, rawVal) {
  // 기존 태그 모두 제거
  var wrap = document.getElementById(wrapId)
  Array.from(wrap.querySelectorAll('.ben-tag')).forEach(function(t){ t.remove() })
  if (!rawVal) return
  // 번호목록(1. 2.) / 중간점(·) / 쉼표(,) 순서로 파싱
  var s = rawVal.trim(); var items;
  if (/\d+\.\s/.test(s)) {
    items = s.split(/\d+\.\s+/).map(function(x){ return x.trim() }).filter(Boolean)
  } else if (s.indexOf(String.fromCharCode(183)) >= 0) {
    items = s.split(String.fromCharCode(183)).map(function(x){ return x.trim() }).filter(Boolean)
  } else if (s.indexOf(',') >= 0) {
    items = s.split(',').map(function(x){ return x.trim() }).filter(Boolean)
  } else {
    items = s ? [s] : []
  }
  items.forEach(function(item) { benTagRender(wrapId, hiddenId, finalId, item) })
}

// ── 새 캠페인 폼 혜택 태그 ──
function ncBenKeydown(e) {
  if (e.key === 'Enter') { e.preventDefault(); ncBenAddCurrent(); }
  if (e.key === 'Backspace' && !e.target.value) {
    var tags = document.querySelectorAll('#nc_ben_tags .ben-tag')
    if (tags.length) { tags[tags.length-1].remove(); benTagsSync('nc_ben_tags','nc_benefits','nc_benefits_final'); }
  }
}
function ncBenInputChange(inp) {
  if (inp.value.indexOf(String.fromCharCode(183)) >= 0 || inp.value.indexOf(String.fromCharCode(10)) >= 0) {
    var parts = inp.value.split(String.fromCharCode(183)).join("|").split("|").map(function(s){ return s.trim() }).filter(Boolean)
    parts.forEach(function(p){ benTagRender('nc_ben_tags','nc_benefits','nc_benefits_final', p) })
    inp.value = ''
  }
}
function ncBenAddCurrent() {
  var inp = document.getElementById('nc_ben_input')
  benTagRender('nc_ben_tags','nc_benefits','nc_benefits_final', inp.value)
}
function ncBenAddSample(text) {
  benTagRender('nc_ben_tags','nc_benefits','nc_benefits_final', text)
}

// ── 수정 폼 혜택 태그 ──
function ecBenKeydown(e) {
  if (e.key === 'Enter') { e.preventDefault(); ecBenAddCurrent(); }
  if (e.key === 'Backspace' && !e.target.value) {
    var tags = document.querySelectorAll('#ec_ben_tags .ben-tag')
    if (tags.length) { tags[tags.length-1].remove(); benTagsSync('ec_ben_tags','ec_benefits','ec_ben_final'); }
  }
}
function ecBenInputChange(inp) {
  if (inp.value.indexOf(String.fromCharCode(183)) >= 0 || inp.value.indexOf(String.fromCharCode(10)) >= 0) {
    var parts = inp.value.split(String.fromCharCode(183)).join("|").split("|").map(function(s){ return s.trim() }).filter(Boolean)
    parts.forEach(function(p){ benTagRender('ec_ben_tags','ec_benefits','ec_ben_final', p) })
    inp.value = ''
  }
}
function ecBenAddCurrent() {
  var inp = document.getElementById('ec_ben_input')
  benTagRender('ec_ben_tags','ec_benefits','ec_ben_final', inp.value)
}
async function ecBenTranslateAll() {
  var tags = benTagsGet('ec_ben_tags')
  if (!tags.length) return
  var statusEl = document.getElementById('ec_ben_translate_status')
  statusEl.textContent = '번역 중…'
  var translated = []
  for (var i = 0; i < tags.length; i++) {
    var t = tags[i]
    var hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(t)
    translated.push(hasKorean ? await gtTranslate(t) : t)
  }
  // 기존 태그 교체
  var wrap = document.getElementById('ec_ben_tags')
  Array.from(wrap.querySelectorAll('.ben-tag')).forEach(function(el){ el.remove() })
  translated.forEach(function(item){ benTagRender('ec_ben_tags','ec_benefits','ec_ben_final', item) })
  statusEl.textContent = '✅ 번역완료'
  setTimeout(function(){ statusEl.textContent = '' }, 2000)
}

// 구버전 호환 (더 이상 직접 호출 안 됨)
function onEcBenInput() {}

// 한글 감지 — Requirements
function onEcReqInput() {
  const val = document.getElementById('ec_req').value
  const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(val)
  if (!hasKorean) {
    document.getElementById('ec_req_translated').classList.add('hidden')
    document.getElementById('ec_req_final').value = val
  }
}

// Edit Camp 번역 공통 헬퍼 (Google Translate)
async function _ecTranslate(inputId, enSpanId, finalId, previewId, btn) {
  const val = document.getElementById(inputId).value.trim()
  if (!val) return
  const origText = btn.textContent
  btn.textContent = '...'
  btn.disabled = true
  const translated = await gtTranslate(val)
  document.getElementById(enSpanId).textContent = translated
  document.getElementById(finalId).value = translated
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(val)) {
    document.getElementById(previewId).classList.remove('hidden')
  } else {
    document.getElementById(previewId).classList.add('hidden')
  }
  btn.textContent = origText
  btn.disabled = false
}

async function translateEcDesc() {
  await _ecTranslate('ec_desc', 'ec_desc_en', 'ec_desc_final', 'ec_desc_translated', event.target)
}

async function translateEcBen() {
  await _ecTranslate('ec_benefits', 'ec_ben_en', 'ec_ben_final', 'ec_ben_translated', event.target)
}

async function translateEcReq() {
  await _ecTranslate('ec_req', 'ec_req_en', 'ec_req_final', 'ec_req_translated', event.target)
}

// Edit Campaign submit
document.getElementById('editCampForm').addEventListener('submit', async e => {
  e.preventDefault()
  const errEl = document.getElementById('editCampErr')
  const okEl  = document.getElementById('editCampOk')
  errEl.classList.add('hidden')
  okEl.classList.add('hidden')

  const id = document.getElementById('ec_id').value
  if (!id) { errEl.textContent = 'Campaign ID missing.'; errEl.classList.remove('hidden'); return }

  const btn = e.target.querySelector('button[type=submit]')
  btn.disabled = true
  btn.textContent = '번역 중…'

  // 한글이 있으면 저장 전 자동 번역
  const rawDesc = (document.getElementById('ec_desc').value).trim()
  const rawReq  = (document.getElementById('ec_req').value).trim()
  const descVal = await gtTranslate(rawDesc)
  const reqVal  = await gtTranslate(rawReq)
  // 혜택은 태그 칩 UI에서 이미 개별 처리됨 — 현재 태그 목록을 ' · '로 합쳐서 저장
  const benTags = benTagsGet('ec_ben_tags')
  const rawBen  = document.getElementById('ec_benefits').value.trim()
  // 한글 태그가 있으면 각각 번역
  var benVal = rawBen
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(rawBen)) {
    var translatedTags = []
    for (var i = 0; i < benTags.length; i++) {
      translatedTags.push(/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(benTags[i]) ? await gtTranslate(benTags[i]) : benTags[i])
    }
    benVal = translatedTags.join(' \xb7 ')
  }

  btn.textContent = '저장 중…'
  const newPw = document.getElementById('ec_clinic_pw').value.trim()
  const body = {
    title:        document.getElementById('ec_title').value.trim(),
    category:     document.getElementById('ec_category').value,
    description:  descVal,
    benefits:     benVal,
    requirements: reqVal,
  }
  if (newPw) body.clinic_password = newPw

  try {
    const res  = await fetch('/api/admin/campaigns/' + id, { method:'PATCH', headers:H, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.success) {
      okEl.textContent = '✅ 저장되었습니다!'
      okEl.classList.remove('hidden')
      btn.textContent = '저장됨!'
      setTimeout(() => {
        closeEditCamp()
        loadCamps()
        loadStats()
        btn.disabled = false
        btn.textContent = '저장'
      }, 1200)
    } else {
      errEl.textContent = data.error || 'Failed to update.'
      errEl.classList.remove('hidden')
      btn.disabled = false
      btn.textContent = '저장'
    }
  } catch {
    errEl.textContent = 'Network error'
    errEl.classList.remove('hidden')
    btn.disabled = false
    btn.textContent = '저장'
  }
})

// editCampModal 배경 클릭 닫기
document.getElementById('editCampModal').addEventListener('click', e => {
  if (e.target === document.getElementById('editCampModal')) closeEditCamp()
})

// ════════════════════════════════════════════
// 8. 이벤트 리스너 & 초기화
// ════════════════════════════════════════════
document.getElementById('appModal').addEventListener('click', e => {
  if (e.target === document.getElementById('appModal')) {
    document.getElementById('appModal').classList.remove('open')
  }
})

var _dpModal = document.getElementById('datePickModal')
if (_dpModal) {
  _dpModal.addEventListener('click', function(e) {
    if (e.target === _dpModal) _dpModal.classList.remove('open')
  })
}

// 초기 로딩 - 한눈에 보기 탭이 기본
loadStats()
loadOverview()

// dp-action-btn event delegation handler
// Uses data-act / data-aid / data-pd / data-sd instead of onclick
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.dp-action-btn')
  if (!btn) return
  e.stopPropagation()
  var act  = btn.dataset.act
  var aid  = parseInt(btn.dataset.aid, 10)
  var pd   = btn.dataset.pd   || ''
  var sd   = btn.dataset.sd   || ''
  var pre  = btn.dataset.preselect || ''
  var closeModal = btn.dataset.closeModal
  if (closeModal) {
    var m = document.getElementById(closeModal)
    if (m) m.classList.remove('open')
  }
  if (act === 'approve') {
    if (pre) approveWithDatePreselect(aid, pd, pre)
    else     approveWithDate(aid, pd)
  }
})
<\/script>
</body>
</html>`
}
