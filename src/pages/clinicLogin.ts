// ════════════════════════════════════════════
// CLINIC LOGIN PAGE  /clinic-login
// 업체가 비밀번호로 로그인해서 자기 신청자 조회
// ════════════════════════════════════════════
export function clinicLoginHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clinic Login – Seoul Beauty Trip</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background: #f4f3f0; }
    input:focus { outline: none; border-color: #c9a035 !important; box-shadow: 0 0 0 3px rgba(201,160,53,.12) !important; }
    .btn-gold { background: linear-gradient(135deg,#c9a035,#e8c16a); }
    .btn-gold:hover { background: linear-gradient(135deg,#b5900a,#d4aa50); }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center px-4 py-12">

  <!-- Logo -->
  <div class="flex items-center gap-2.5 mb-8">
    <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
      <i class="fas fa-seedling text-white text-sm"></i>
    </div>
    <div>
      <p class="font-bold text-gray-900 text-base leading-tight">Seoul Beauty Trip</p>
      <p class="text-xs text-gray-400">Clinic Portal</p>
    </div>
  </div>

  <!-- Card -->
  <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-7 w-full max-w-sm">
    <h1 class="text-lg font-bold text-gray-900 mb-1">Clinic Login</h1>
    <p class="text-xs text-gray-400 mb-6">업체 ID와 비밀번호로 로그인하세요</p>

    <form onsubmit="doLogin(event)" class="space-y-4">
      <!-- 업체 선택 or ID 입력 -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5">Clinic Name / ID</label>
        <input id="clinicId" type="text" placeholder="업체명 또는 캠페인 ID"
          class="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm text-gray-900 bg-white transition">
      </div>

      <!-- 비밀번호 -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
        <div class="relative">
          <input id="clinicPw" type="password" placeholder="비밀번호 입력"
            class="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm text-gray-900 bg-white transition pr-10">
          <button type="button" onclick="togglePw()" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <i id="pwEyeIcon" class="fas fa-eye text-sm"></i>
          </button>
        </div>
      </div>

      <!-- 에러 -->
      <div id="errBox" class="hidden bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
        <p class="text-xs text-red-500 font-medium" id="errMsg"></p>
      </div>

      <!-- 로그인 버튼 -->
      <button type="submit" id="loginBtn"
        class="btn-gold w-full py-2.5 rounded-xl text-white text-sm font-semibold transition flex items-center justify-center gap-2">
        <i class="fas fa-sign-in-alt"></i>
        <span id="loginBtnTxt">Login</span>
      </button>
    </form>

    <p class="text-xs text-gray-400 text-center mt-5">
      비밀번호 문의: <a href="mailto:seoulbeautytrip@gmail.com" class="text-amber-600 hover:underline">seoulbeautytrip@gmail.com</a>
    </p>
  </div>

  <p class="text-xs text-gray-300 mt-6">© 2025 Seoul Beauty Trip</p>

<script>
function togglePw() {
  var inp  = document.getElementById('clinicPw')
  var icon = document.getElementById('pwEyeIcon')
  if (inp.type === 'password') {
    inp.type = 'text'
    icon.className = 'fas fa-eye-slash text-sm'
  } else {
    inp.type = 'password'
    icon.className = 'fas fa-eye text-sm'
  }
}

function showErr(msg) {
  document.getElementById('errMsg').textContent = msg
  document.getElementById('errBox').classList.remove('hidden')
}

async function doLogin(e) {
  e.preventDefault()
  var id  = document.getElementById('clinicId').value.trim()
  var pw  = document.getElementById('clinicPw').value
  if (!id || !pw) { showErr('업체명과 비밀번호를 입력해주세요.'); return }

  var btn    = document.getElementById('loginBtn')
  var btnTxt = document.getElementById('loginBtnTxt')
  btn.disabled = true
  btnTxt.textContent = 'Logging in…'
  document.getElementById('errBox').classList.add('hidden')

  try {
    var res  = await fetch('/api/clinic/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clinic_id: id, password: pw })
    })
    var data = await res.json()
    if (!data.success) {
      showErr(data.error || 'Invalid credentials.')
      btn.disabled = false
      btnTxt.textContent = 'Login'
      return
    }
    // 세션 토큰 저장 후 대시보드로 이동
    localStorage.setItem('clinicToken', data.token)
    localStorage.setItem('clinicCampaignId', data.campaign_id)
    location.href = '/clinic-dashboard'
  } catch(err) {
    showErr('Network error. Please try again.')
    btn.disabled = false
    btnTxt.textContent = 'Login'
  }
}
<\/script>
</body>
</html>`
}
