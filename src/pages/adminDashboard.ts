// ════════════════════════════════════════════
// ADMIN DASHBOARD
// ════════════════════════════════════════════
export function adminDashboardHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
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
    .modal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999;backdrop-filter:blur(4px);align-items:center;justify-content:center;}
    .modal-bg.open{display:flex;}
    input:focus,select:focus,textarea:focus{outline:none;border-color:#c9a035!important;box-shadow:0 0 0 3px rgba(201,160,53,.12)!important;}
    .btn-gold{background:linear-gradient(135deg,#c9a035,#e8c16a);color:#fff;font-weight:600;border:none;cursor:pointer;transition:all .2s;}
    .btn-gold:hover{background:linear-gradient(135deg,#b5900a,#d4aa50);}
    .row-hover:hover{background:#faf9f7;}
    ::-webkit-scrollbar{width:4px;height:4px;}
    ::-webkit-scrollbar-thumb{background:#d4c4a0;border-radius:4px;}
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
    <button id="tab-apps"  onclick="showTab('apps')"  class="tab-btn on">Applicants</button>
    <button id="tab-cal"   onclick="showTab('cal')"   class="tab-btn"><i class="fas fa-calendar-alt mr-1"></i>Calendar</button>
    <button id="tab-camps" onclick="showTab('camps')" class="tab-btn">Campaigns</button>
    <button id="tab-new"   onclick="showTab('new')"   class="tab-btn">+ New</button>
    <button id="tab-tg"    onclick="showTab('tg')"    class="tab-btn">Telegram</button>
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

  <!-- ── Applicants panel ── -->
  <div id="panel-apps">
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
            <option value="">All clinics</option>
          </select>
          <div class="flex items-center gap-1">
            <button onclick="changeMonth(-1)" class="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-stone-50 text-sm flex items-center justify-center"><i class="fas fa-chevron-left text-xs"></i></button>
            <span id="calMonthLabel" class="text-sm font-semibold text-gray-800 min-w-[120px] text-center"></span>
            <button onclick="changeMonth(1)"  class="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-stone-50 text-sm flex items-center justify-center"><i class="fas fa-chevron-right text-xs"></i></button>
          </div>
          <button onclick="calYear=new Date().getFullYear();calMonth=new Date().getMonth();renderCal()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white hover:bg-stone-50 text-gray-500">Today</button>
        </div>
      </div>
      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-px bg-stone-200 rounded-xl overflow-hidden mb-4">
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-gray-400 py-2">Sun</div>
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-gray-400 py-2">Mon</div>
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-gray-400 py-2">Tue</div>
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-gray-400 py-2">Wed</div>
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-gray-400 py-2">Thu</div>
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-gray-400 py-2">Fri</div>
        <div class="bg-stone-50 text-center text-[11px] font-semibold text-gray-400 py-2">Sat</div>
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
          <select id="nc_category" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
            <option>Clinic</option><option>Beauty Shop</option>
          </select>
        </div>

        <!-- Benefits: 한글 입력 → 영어 자동 번역 -->
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            제공 혜택 <span class="text-gray-300 font-normal normal-case">(한글로 입력하면 자동 번역)</span>
          </label>
          <div class="relative">
            <input id="nc_benefits" type="text" placeholder="예) 무료 상담 + 치아 미백 30% 할인"
              class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm pr-20"
              oninput="onKoreanInput('nc_benefits', 'nc_benefits_translated')">
            <button type="button" onclick="translateField('nc_benefits', 'nc_benefits_translated')"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2.5 py-1 rounded-lg btn-gold">번역</button>
          </div>
          <div id="nc_benefits_translated" class="hidden mt-1.5 text-xs text-gray-500 bg-stone-50 rounded-lg px-3 py-2 border border-stone-100">
            <span class="text-amber-500 font-semibold mr-1">EN</span><span id="nc_benefits_en"></span>
          </div>
          <input type="hidden" id="nc_benefits_final">
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

</main>

<!-- Applicant detail modal -->
<div id="appModal" class="modal-bg">
  <div id="appModalContent" class="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl max-h-[90vh] overflow-y-auto"></div>
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
          <option>Clinic</option><option>Beauty Shop</option>
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
          제공 혜택 <span class="text-gray-300 font-normal normal-case">(한글→영어 번역 가능)</span>
        </label>
        <div class="relative">
          <input id="ec_benefits" type="text" placeholder="e.g. Free consultation + whitening session"
            class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm pr-20"
            oninput="onEcBenInput()">
          <button type="button" onclick="translateEcBen()"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2.5 py-1 rounded-lg btn-gold">번역</button>
        </div>
        <div id="ec_ben_translated" class="hidden mt-1.5 text-xs text-gray-500 bg-stone-50 rounded-lg px-3 py-2 border border-stone-100">
          <span class="text-amber-500 font-semibold mr-1">EN</span><span id="ec_ben_en"></span>
        </div>
        <input type="hidden" id="ec_ben_final">
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
  ['apps','cal','camps','new','tg'].forEach(id => {
    document.getElementById('panel-' + id).classList.toggle('hidden', id !== t)
    document.getElementById('tab-' + id).classList.toggle('on', id === t)
  })
  if (t === 'apps')  loadApps()
  if (t === 'camps') loadCamps()
  if (t === 'cal')   loadCalData()
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
    if (apps.success) {
      document.getElementById('s-total').textContent    = apps.data.length
      document.getElementById('s-pending').textContent  = apps.data.filter(a => a.status === 'pending').length
      document.getElementById('s-approved').textContent = apps.data.filter(a => a.status === 'approved').length
      const sel = document.getElementById('fCamp')
      const cur = sel.value
      sel.innerHTML = '<option value="">All campaigns</option>' +
        camps.data.map(c => \`<option value="\${c.id}" \${cur == c.id ? 'selected' : ''}>\${c.place_name}</option>\`).join('')
      // 달력 업체 필터 동기화
      const calSel = document.getElementById('calCamp')
      if (calSel) {
        const calCur = calSel.value
        calSel.innerHTML = '<option value="">All clinics</option>' +
          camps.data.map(c => \`<option value="\${c.id}" \${calCur == c.id ? 'selected' : ''}>\${c.place_name}</option>\`).join('')
      }
    }
    if (camps.success) {
      document.getElementById('s-camps').textContent = camps.data.filter(c => c.status === 'active').length
    }
  } catch(e) { console.error('loadStats error', e) }
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
    const { success, data } = await (await fetch(url, { headers: H })).json()
    if (!success || !data.length) {
      tb.innerHTML = '<tr><td colspan="6" class="text-center py-10 text-xs text-gray-400">No applicants yet</td></tr>'
      return
    }
    tb.innerHTML = data.map(a => {
      const dates    = (a.preferred_dates || '').split('/').map(d => d.trim()).filter(Boolean)
      const dateHtml = dates.map(d => \`<span style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8;border-radius:6px;padding:1px 7px;font-size:11px;font-weight:500;margin:1px;">\${d}</span>\`).join('')
      return \`<tr class="row-hover transition-colors">
        <td class="px-5 py-3.5">
          <p class="font-semibold text-sm text-gray-900">\${a.applicant_name}</p>
          <p class="text-xs text-gray-400">\${a.nationality}</p>
          <p class="text-xs text-gray-400">\${a.email}</p>
          \${a.phone ? \`<p class="text-xs text-gray-400"><i class="fab fa-whatsapp text-green-500 mr-0.5"></i>\${a.phone}</p>\` : ''}
        </td>
        <td class="px-4 py-3.5 hidden sm:table-cell">
          <p class="text-xs font-semibold text-gray-800">\${a.place_name || ''}</p>
          <p class="text-xs text-gray-400">\${a.campaign_title || ''}</p>
        </td>
        <td class="px-4 py-3.5">
          \${a.instagram
            ? \`<a href="https://instagram.com/\${a.instagram}" target="_blank" class="text-sm text-pink-500 font-semibold hover:underline">@\${a.instagram}</a>\`
            : '<span class="text-xs text-gray-300">—</span>'}
        </td>
        <td class="px-4 py-3.5 hidden lg:table-cell">
          <div class="flex flex-wrap gap-0.5">\${dateHtml || '<span class="text-xs text-gray-300">—</span>'}</div>
        </td>
        <td class="px-4 py-3.5">
          <span class="badge badge-\${a.status}">\${{ pending:'Pending', approved:'Approved', rejected:'Rejected' }[a.status] || a.status}</span>
        </td>
        <td class="px-4 py-3.5 text-center">
          <div class="flex items-center justify-center gap-1">
            <button onclick='openAppDetail(\${JSON.stringify(a).replace(/"/g,"&quot;")})' class="w-7 h-7 rounded-lg bg-stone-100 hover:bg-amber-50 text-gray-500 hover:text-amber-600 flex items-center justify-center text-xs transition" title="Detail">
              <i class="fas fa-eye"></i>
            </button>
            \${a.status !== 'approved' ? \`<button onclick="setStatus(\${a.id},'approved')" class="w-7 h-7 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center text-xs transition" title="Approve"><i class="fas fa-check"></i></button>\` : ''}
            \${a.status !== 'rejected' ? \`<button onclick="setStatus(\${a.id},'rejected')" class="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center text-xs transition" title="Reject"><i class="fas fa-times"></i></button>\` : ''}
          </div>
        </td>
      </tr>\`
    }).join('')
  } catch(e) {
    tb.innerHTML = '<tr><td colspan="6" class="text-center py-10 text-xs text-gray-400">Error loading data</td></tr>'
    console.error('loadApps error', e)
  }
}

async function setStatus(id, status) {
  await fetch('/api/admin/applications/' + id, { method:'PATCH', headers:H, body: JSON.stringify({ status }) })
  loadApps()
  loadStats()
}

function openAppDetail(a) {
  const dates    = (a.preferred_dates || '').split('/').map(d => d.trim()).filter(Boolean)
  const dateHtml = dates.map(d =>
    \`<div class="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
      <i class="far fa-clock text-amber-400 text-xs w-4"></i>
      <span class="text-sm text-gray-700">\${d}</span>
    </div>\`
  ).join('')
  document.getElementById('appModalContent').innerHTML = \`
    <div class="flex items-center justify-between mb-5">
      <h3 class="font-bold text-gray-900">Applicant Detail</h3>
      <button onclick="document.getElementById('appModal').classList.remove('open')" class="text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
    </div>
    <div class="space-y-3 text-sm">
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-stone-50 rounded-xl p-3">
          <p class="text-xs text-gray-400 mb-0.5">Full Name</p>
          <p class="font-semibold">\${a.applicant_name}</p>
        </div>
        <div class="bg-stone-50 rounded-xl p-3">
          <p class="text-xs text-gray-400 mb-0.5">Nationality</p>
          <p class="font-semibold">\${a.nationality}</p>
        </div>
        <div class="bg-stone-50 rounded-xl p-3">
          <p class="text-xs text-gray-400 mb-0.5">Email</p>
          <p class="font-semibold text-blue-600 text-xs break-all">\${a.email}</p>
        </div>
        <div class="bg-stone-50 rounded-xl p-3">
          <p class="text-xs text-gray-400 mb-0.5"><i class="fab fa-whatsapp text-green-500 mr-1"></i>WhatsApp</p>
          <p class="font-semibold text-xs">\${a.phone || '—'}</p>
        </div>
      </div>
      <div class="bg-pink-50 rounded-xl p-3 flex items-center gap-3">
        <i class="fab fa-instagram text-pink-500 text-2xl"></i>
        <div>
          <p class="text-xs text-gray-400 mb-0.5">Instagram</p>
          \${a.instagram
            ? \`<a href="https://instagram.com/\${a.instagram}" target="_blank" class="font-bold text-pink-600 text-base hover:underline">@\${a.instagram}</a>\`
            : '<span class="text-gray-400 text-xs">—</span>'}
        </div>
      </div>
      <div class="bg-amber-50 rounded-xl p-3">
        <p class="text-xs font-semibold text-amber-700 mb-2"><i class="far fa-calendar mr-1"></i>Available Dates</p>
        \${dateHtml || '<p class="text-xs text-gray-400">No dates provided</p>'}
      </div>
      <div class="bg-stone-50 rounded-xl p-3">
        <p class="text-xs text-gray-400 mb-0.5">Campaign</p>
        <p class="font-semibold">\${a.campaign_title || ''}</p>
        <p class="text-xs text-gray-400">\${a.place_name || ''}</p>
      </div>
      \${a.message ? \`<div class="bg-stone-50 rounded-xl p-3"><p class="text-xs text-gray-400 mb-0.5">Message</p><p class="text-sm text-gray-700">\${a.message}</p></div>\` : ''}
      <p class="text-xs text-gray-400">Applied: \${new Date(a.created_at).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}</p>
      <div class="flex items-center justify-between pt-1">
        <span class="badge badge-\${a.status}">\${{ pending:'Pending', approved:'Approved', rejected:'Rejected' }[a.status]}</span>
        <div class="flex gap-2">
          \${a.status !== 'approved' ? \`<button onclick="setStatus(\${a.id},'approved');document.getElementById('appModal').classList.remove('open')" class="bg-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-green-700">Approve</button>\` : ''}
          \${a.status !== 'rejected' ? \`<button onclick="setStatus(\${a.id},'rejected');document.getElementById('appModal').classList.remove('open')" class="bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-red-600">Reject</button>\` : ''}
        </div>
      </div>
    </div>\`
  document.getElementById('appModal').classList.add('open')
}

// ════════════════════════════════════════════
// 4. Campaigns
// ════════════════════════════════════════════
async function loadCamps() {
  const el = document.getElementById('campsContent')
  el.innerHTML = '<p class="text-xs text-gray-400 text-center py-6">Loading…</p>'
  try {
    const { data } = await (await fetch('/api/admin/campaigns', { headers: H })).json()
    if (!data?.length) { el.innerHTML = '<p class="text-xs text-gray-400 text-center py-8">No campaigns</p>'; return }
    el.innerHTML = '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">' + data.map(c => {
      const pct   = Math.min(100, Math.round((c.current_participants / c.max_participants) * 100))
      const thumb = c.place_photo_ref ? \`/api/places/photo?ref=\${c.place_photo_ref}\` : ''
      return \`<div class="border border-stone-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
        <div class="h-28 bg-stone-100">
          \${thumb
            ? \`<img src="\${thumb}" class="w-full h-full object-cover">\`
            : \`<div class="w-full h-full flex items-center justify-center text-stone-200"><i class="fas fa-hospital text-3xl"></i></div>\`}
        </div>
        <div class="p-3">
          <div class="flex items-center justify-between mb-1">
            <p class="font-semibold text-xs text-gray-900 truncate flex-1">\${c.title}</p>
            <span class="text-xs ml-2 \${c.status === 'active' ? 'text-green-500' : 'text-gray-300'}">\${c.status === 'active' ? '●' : '○'}</span>
          </div>
          <p class="text-xs text-gray-400 mb-2">\${c.place_name} · \${c.category}</p>
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span>\${c.current_participants}/\${c.max_participants} applicants</span>
            <span>\${pct}%</span>
          </div>
          <div class="h-1 bg-stone-100 rounded-full mb-2.5">
            <div class="h-full rounded-full" style="width:\${pct}%;background:linear-gradient(90deg,#c9a035,#e8c16a)"></div>
          </div>
          <div class="flex gap-1.5 mt-1">
            <button onclick="openEditCamp(\${JSON.stringify(c).replace(/"/g,'&quot;')})" class="flex-1 text-xs text-amber-600 hover:text-amber-700 border border-amber-100 hover:bg-amber-50 py-1.5 rounded-lg transition font-medium">
              <i class="fas fa-pen text-[10px] mr-0.5"></i>Edit
            </button>
            \${c.status === 'active'
              ? \`<button onclick="deactivate(\${c.id})" class="flex-1 text-xs text-red-400 hover:text-red-500 border border-red-100 hover:bg-red-50 py-1.5 rounded-lg transition">Deactivate</button>\`
              : \`<span class="flex-1 block text-center text-xs text-gray-300 py-1.5">Inactive</span>\`}
          </div>
        </div>
      </div>\`
    }).join('') + '</div>'
  } catch(e) { console.error('loadCamps error', e) }
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

  // ── 기본값 자동세팅 ─────────────────────────────────────
  // 비어있을 때만 채움 (이미 입력된 경우 덮어쓰지 않음)
  const reqEl = document.getElementById('nc_req') as HTMLInputElement
  const benEl = document.getElementById('nc_benefits') as HTMLInputElement
  if (!reqEl.value) {
    const defaultReq = '3,000+ Instagram followers · Travel or beauty content preferred · Post 1 Reel within 3 weeks of visit · Tag @' + p.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
    reqEl.value = defaultReq
    ;(document.getElementById('nc_req_final') as HTMLInputElement).value = defaultReq
  }
  if (!benEl.value) {
    benEl.value = 'Complimentary treatment session · Personalized consultation'
    ;(document.getElementById('nc_benefits_final') as HTMLInputElement).value = benEl.value
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
  document.getElementById('nc_benefits_translated').classList.add('hidden')
  document.getElementById('nc_req_translated').classList.add('hidden')
  document.getElementById('nc_desc_translated').classList.add('hidden')
  document.getElementById('nc_benefits_final').value = ''
  document.getElementById('nc_req_final').value = ''
  document.getElementById('nc_desc_final').value = ''
  document.getElementById('nc_benefits_en').textContent = ''
  document.getElementById('nc_req_en').textContent = ''
  document.getElementById('nc_desc_en').textContent = ''
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
  const rawBen  = document.getElementById('nc_benefits').value.trim()
  const rawReq  = document.getElementById('nc_req').value.trim()
  const rawDesc = document.getElementById('nc_desc').value.trim()
  const benefitsVal = await gtTranslate(rawBen)
  const reqVal      = await gtTranslate(rawReq)
  const descVal     = await gtTranslate(rawDesc)

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

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  label.textContent = monthNames[calMonth] + ' ' + calYear

  const campFilter = document.getElementById('calCamp')?.value || ''

  const dayMap = {}
  calApps.forEach(app => {
    if (campFilter && String(app.campaign_id) !== campFilter) return
    parseApplicantDates(app).forEach(({ dateStr }) => {
      if (!dayMap[dateStr]) dayMap[dateStr] = []
      dayMap[dateStr].push(app)
    })
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
    const dateStr = calYear + '-' + String(calMonth+1).padStart(2,'0') + '-' + String(d).padStart(2,'0')
    const apps    = dayMap[dateStr] || []
    const isToday = dateStr === todayStr
    const hasBk   = apps.length > 0

    const dotColors = ['#c9a035','#3b82f6','#ec4899','#10b981','#f59e0b','#6366f1']
    const dots = apps.slice(0,5).map((a,i) => {
      const color  = dotColors[i % dotColors.length]
      const status = a.status === 'approved' ? '#10b981' : a.status === 'rejected' ? '#ef4444' : color
      return \`<span title="\${a.applicant_name}" style="display:inline-block;width:6px;height:6px;border-radius:50%;background:\${status};margin:0 1px;"></span>\`
    }).join('')

    html += \`<div class="bg-white min-h-[80px] p-1.5 cursor-pointer hover:bg-amber-50 transition-colors \${isToday ? 'ring-2 ring-amber-400 ring-inset' : ''}" onclick="selectDay('\${dateStr}')">
      <div class="text-xs font-semibold \${isToday ? 'text-amber-600' : hasBk ? 'text-gray-900' : 'text-gray-400'} mb-1">\${d}</div>
      \${hasBk ? \`<div class="text-[10px] font-bold text-amber-700 mb-0.5">\${apps.length} appt</div>\` : ''}
      <div>\${dots}</div>
    </div>\`
  }
  grid.innerHTML = html

  if (dayMap[todayStr]) selectDay(todayStr)
  else document.getElementById('calDetail').classList.add('hidden')
}

function selectDay(dateStr) {
  const campFilter = document.getElementById('calCamp')?.value || ''
  const apps = calApps.filter(app => {
    if (campFilter && String(app.campaign_id) !== campFilter) return false
    return parseApplicantDates(app).some(d => d.dateStr === dateStr)
  })

  const detail = document.getElementById('calDetail')
  const title  = document.getElementById('calDetailTitle')
  const list   = document.getElementById('calDetailList')

  if (!apps.length) { detail.classList.add('hidden'); return }

  const d = new Date(dateStr + 'T00:00:00')
  title.textContent = d.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) + ' — ' + apps.length + ' appointment' + (apps.length > 1 ? 's' : '')
  detail.classList.remove('hidden')

  list.innerHTML = apps.map(a => {
    const timeInfo  = parseApplicantDates(a).filter(d => d.dateStr === dateStr).map(d => d.timeStr).join(', ')
    const badgeCls  = a.status === 'approved' ? 'background:#dcfce7;color:#166534' : a.status === 'rejected' ? 'background:#fee2e2;color:#991b1b' : 'background:#fef9c3;color:#854d0e'
    return \`<div class="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-amber-100 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">\${a.applicant_name.charAt(0).toUpperCase()}</div>
        <div>
          <p class="font-semibold text-sm text-gray-900">\${a.applicant_name}</p>
          <p class="text-xs text-gray-400">\${a.nationality} · \${timeInfo || 'Time TBD'}</p>
          <p class="text-xs text-gray-500">\${a.place_name || a.campaign_title || ''}</p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-1.5">
        <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full" style="\${badgeCls}">\${a.status}</span>
        \${a.instagram ? \`<a href="https://instagram.com/\${a.instagram}" target="_blank" class="text-[11px] text-pink-500 hover:underline">@\${a.instagram}</a>\` : ''}
      </div>
    </div>\`
  }).join('')
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
function openEditCamp(c) {
  document.getElementById('ec_id').value       = c.id
  document.getElementById('ec_title').value    = c.title || ''
  document.getElementById('ec_category').value = c.category || 'Clinic'
  // Description
  document.getElementById('ec_desc').value       = c.description || ''
  document.getElementById('ec_desc_final').value = c.description || ''
  document.getElementById('ec_desc_en').textContent = ''
  document.getElementById('ec_desc_translated').classList.add('hidden')
  // Benefits
  document.getElementById('ec_benefits').value  = c.benefits || ''
  document.getElementById('ec_ben_final').value  = c.benefits || ''
  document.getElementById('ec_ben_en').textContent = ''
  document.getElementById('ec_ben_translated').classList.add('hidden')
  // Requirements
  document.getElementById('ec_req').value        = c.requirements || ''
  document.getElementById('ec_req_final').value  = c.requirements || ''
  document.getElementById('ec_req_en').textContent = ''
  document.getElementById('ec_req_translated').classList.add('hidden')
  // 서브타이틀 & 피드백 초기화
  document.getElementById('editCampSubtitle').textContent = (c.place_name || '') + (c.title ? ' · ' + c.title : '')
  document.getElementById('editCampErr').classList.add('hidden')
  document.getElementById('editCampOk').classList.add('hidden')
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

// 한글 감지 — Benefits
function onEcBenInput() {
  const val = document.getElementById('ec_benefits').value
  const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(val)
  if (!hasKorean) {
    document.getElementById('ec_ben_translated').classList.add('hidden')
    document.getElementById('ec_ben_final').value = val
  }
}

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
  const rawBen  = (document.getElementById('ec_benefits').value).trim()
  const rawReq  = (document.getElementById('ec_req').value).trim()
  const descVal = await gtTranslate(rawDesc)
  const benVal  = await gtTranslate(rawBen)
  const reqVal  = await gtTranslate(rawReq)

  btn.textContent = '저장 중…'
  const body = {
    title:        document.getElementById('ec_title').value.trim(),
    category:     document.getElementById('ec_category').value,
    description:  descVal,
    benefits:     benVal,
    requirements: reqVal,
  }

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

// 초기 로딩
loadStats()
loadApps()
<\/script>
</body>
</html>`
}
