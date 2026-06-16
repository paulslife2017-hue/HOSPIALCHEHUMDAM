// ════════════════════════════════════════════
// ADMIN LOGIN
// ════════════════════════════════════════════
export function adminLoginHTML(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Seoul Beauty Trip</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family:'Inter',sans-serif; }
    .serif { font-family:'Playfair Display',serif; }
    input:focus { outline:none; border-color:#c9a035 !important; box-shadow:0 0 0 3px rgba(201,160,53,.15); }
  </style>
</head>
<body class="min-h-screen flex" style="background:linear-gradient(135deg,#0a0a0a 0%,#1a1209 60%,#0d0d0d 100%)">
  <div class="m-auto w-full max-w-sm px-4">
    <div class="text-center mb-8">
      <div class="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center" style="background:linear-gradient(135deg,#c9a035,#e8c16a);box-shadow:0 8px 24px rgba(201,160,53,.3)">
        <i class="fas fa-star text-white text-xl"></i>
      </div>
      <h1 class="serif text-2xl text-white mb-1">Seoul Beauty Trip</h1>
      <p class="text-stone-500 text-sm">Admin Dashboard</p>
    </div>
    <div class="rounded-2xl p-6 border" style="background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.08);backdrop-filter:blur(12px)">
      <form id="loginForm" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-stone-400 mb-1.5">Password</label>
          <input id="pw" type="password" placeholder="••••••••" autocomplete="current-password" class="w-full rounded-xl px-4 py-3 text-white text-sm border transition-all" style="background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.1)">
        </div>
        <div id="loginErr" class="hidden text-red-400 text-xs text-center bg-red-950/50 rounded-xl py-2.5 px-3 border border-red-900/50"></div>
        <button type="submit" class="w-full font-semibold py-3 rounded-xl text-sm text-white transition-all mt-2" style="background:linear-gradient(135deg,#c9a035,#e8c16a)">
          Sign In
        </button>
      </form>
    </div>
    <div class="text-center mt-5">
      <a href="/" class="text-stone-600 hover:text-stone-400 text-xs transition-colors">← Back to site</a>
    </div>
  </div>
  <script>
    document.getElementById('loginForm').addEventListener('submit', async e => {
      e.preventDefault()
      const err = document.getElementById('loginErr')
      err.classList.add('hidden')
      const btn = e.target.querySelector('button')
      btn.disabled = true; btn.textContent = 'Signing in...'
      try {
        const res  = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username: 'admin', password: document.getElementById('pw').value }) })
        const data = await res.json()
        if (data.success) { sessionStorage.setItem('adminToken', data.token); window.location.href = '/admin/dashboard' }
        else { err.textContent = data.error; err.classList.remove('hidden'); btn.disabled=false; btn.textContent='Sign In' }
      } catch { err.textContent='Network error'; err.classList.remove('hidden'); btn.disabled=false; btn.textContent='Sign In' }
    })
  </script>
</body>
</html>`
}
