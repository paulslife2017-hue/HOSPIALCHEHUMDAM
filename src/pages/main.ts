// ════════════════════════════════════════════
// MAIN PAGE  — Responsive v4
// Mobile (<1024px): single col + sticky filter bar + bottomsheet modal
// Desktop (≥1024px): fixed sidebar + 2-col card grid + centered modal
// ════════════════════════════════════════════
export function mainPageHTML(campaigns: any[]): string {
  const ssrData = JSON.stringify(campaigns)
    .replace(/<\/script>/gi, '<\\/script>')
    .replace(/<!--/g, '<\\!--')
    .replace(/\\u2028/g, '\\u2028')
    .replace(/\\u2029/g, '\\u2029')

  return '<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'  <meta charset="UTF-8">\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'  <title>Seoul Beauty Trip \u2014 Influencer Experience Program</title>\n' +
'  <meta property="og:type"        content="website">\n' +
'  <meta property="og:title"       content="Seoul Beauty Trip \u2014 Influencer Experience Program">\n' +
'  <meta property="og:description" content="Complimentary treatments at Seoul\'s most prestigious clinics & beauty destinations \u2014 crafted for international creators.">\n' +
'  <meta property="og:image"       content="https://images.unsplash.com/photo-1607017803290-8d2e5b9c4c7b?w=1200&q=80">\n' +
'  <meta property="og:url"         content="https://hospialchehumdam.vercel.app">\n' +
'  <meta name="twitter:card"       content="summary_large_image">\n' +
'  <meta name="description"        content="Complimentary treatments at Seoul\'s most prestigious clinics for international influencers.">\n' +
'  <link rel="canonical"           href="https://hospialchehumdam.vercel.app">\n' +
'\n' +
'  <!-- Google Fonts: 비동기 로드 -->\n' +
'  <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
'  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">\n' +
'  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap"\n' +
'        onload="this.onload=null;this.rel=\'stylesheet\'">\n' +
'  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap"></noscript>\n' +
'  <!-- FontAwesome: 비동기 로드 -->\n' +
'  <link rel="preload" as="style" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"\n' +
'        onload="this.onload=null;this.rel=\'stylesheet\'">\n' +
'  <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"></noscript>\n' +
'\n' +
'  <style>\n' +
'    /* ═══ RESET & TOKENS ═══ */\n' +
'    *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0;}\n' +
'    :root{--gold:#c9a035;--gold2:#e8c16a;--bg:#f6f4f1;--text:#1a1a1a;}\n' +
'    body{font-family:"Inter",system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}\n' +
'\n' +
'    /* ═══ NAV ═══ */\n' +
'    .nav-blur{background:rgba(255,255,255,.94);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid #f0ece6;position:sticky;top:0;z-index:100;}\n' +
'    .nav-inner{max-width:1440px;margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between;}\n' +
'    .logo-wrap{display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none;}\n' +
'    .logo-icon{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;flex-shrink:0;}\n' +
'    .logo-icon svg{width:14px;height:14px;fill:#fff;}\n' +
'    .logo-name{font-size:13px;font-weight:700;color:#111;letter-spacing:.08em;text-transform:uppercase;line-height:1;}\n' +
'    .logo-sub{font-size:10px;color:#aaa;letter-spacing:.06em;margin-top:3px;}\n' +
'    /* PC nav 우측 링크 */\n' +
'    .nav-links{display:none;align-items:center;gap:24px;}\n' +
'    @media(min-width:1024px){.nav-links{display:flex;}}\n' +
'    .nav-links a{font-size:13px;font-weight:500;color:#666;text-decoration:none;transition:color .2s;}\n' +
'    .nav-links a:hover{color:#111;}\n' +
'    .nav-cta{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#fff!important;padding:8px 20px;border-radius:99px;font-weight:600!important;}\n' +
'\n' +
'    /* ═══ HERO ═══ */\n' +
'    .hero{background:linear-gradient(150deg,#0c0b09 0%,#1c1408 55%,#0e0c09 100%);position:relative;overflow:hidden;color:#fff;}\n' +
'    /* 모바일 hero */\n' +
'    .hero{padding:48px 20px 52px;}\n' +
'    .hero-inner{max-width:600px;margin:0 auto;position:relative;z-index:1;}\n' +
'    /* PC hero: 더 넓고 양옆에 여백 */\n' +
'    @media(min-width:1024px){\n' +
'      .hero{padding:80px 60px 88px;}\n' +
'      .hero-inner{max-width:1440px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:60px;}\n' +
'      .hero-right{display:block;}\n' +
'    }\n' +
'    .hero-right{display:none;}\n' +
'    .hero-noise{position:absolute;inset:0;opacity:.04;background-image:url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E");}\n' +
'    .hero-badge{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(201,160,53,.35);background:rgba(201,160,53,.08);border-radius:99px;padding:5px 14px;font-size:12px;font-weight:500;color:#fcd34d;margin-bottom:20px;}\n' +
'    .hero-badge span{width:6px;height:6px;border-radius:50%;background:#fbbf24;animation:pulse 2s infinite;flex-shrink:0;}\n' +
'    @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}\n' +
'    .hero-title{font-family:"Cormorant Garamond",Georgia,serif;font-size:40px;font-weight:600;line-height:1.12;margin-bottom:18px;}\n' +
'    @media(min-width:1024px){.hero-title{font-size:58px;}}\n' +
'    .gold-text{background:linear-gradient(90deg,var(--gold),#f0d585);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}\n' +
'    .hero-desc{color:#a8a29e;font-size:14px;line-height:1.75;margin-bottom:28px;max-width:440px;}\n' +
'    @media(min-width:1024px){.hero-desc{font-size:15px;}}\n' +
'    .hero-chips{display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:#a8a29e;}\n' +
'    .hero-chips span{display:flex;align-items:center;gap:7px;}\n' +
'    .hero-dot{width:14px;height:14px;border-radius:50%;background:rgba(251,191,36,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;}\n' +
'    .hero-dot::after{content:"";width:6px;height:6px;border-radius:50%;background:#fbbf24;}\n' +
'    /* PC hero 우측 스탯 카드 */\n' +
'    .stat-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;}\n' +
'    .stat-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:24px;}\n' +
'    .stat-num{font-family:"Cormorant Garamond",Georgia,serif;font-size:40px;font-weight:600;color:var(--gold2);line-height:1;margin-bottom:6px;}\n' +
'    .stat-label{font-size:12px;color:#a8a29e;line-height:1.5;}\n' +
'    .gold-line{height:1px;background:linear-gradient(90deg,transparent,var(--gold) 40%,var(--gold) 60%,transparent);}\n' +
'\n' +
'    /* ═══ MOBILE-ONLY FILTER BAR ═══ */\n' +
'    .filter-bar{background:rgba(255,255,255,.95);backdrop-filter:blur(8px);border-bottom:1px solid #f0ece6;position:sticky;top:60px;z-index:40;}\n' +
'    @media(min-width:1024px){.filter-bar{display:none;}}\n' +
'    .filter-inner{padding:10px 16px;display:flex;align-items:center;gap:8px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;}\n' +
'    .filter-inner::-webkit-scrollbar{display:none;}\n' +
'    .f-btn{border:1.5px solid #e2ddd6;color:#888;background:#fff;font-size:13px;font-weight:500;padding:8px 18px;border-radius:99px;cursor:pointer;transition:all .2s;white-space:nowrap;font-family:inherit;}\n' +
'    .f-btn.active{border-color:var(--gold);background:#fdf8ef;color:#8a6d3b;font-weight:600;}\n' +
'    .count-badge{margin-left:auto;font-size:12px;color:#aaa;background:#f3f0ec;padding:6px 12px;border-radius:99px;flex-shrink:0;white-space:nowrap;}\n' +
'\n' +
'    /* ═══ MAIN LAYOUT ═══ */\n' +
'    /* 모바일: 단순 single col */\n' +
'    .page-body{max-width:680px;margin:0 auto;padding:24px 16px;}\n' +
'    /* PC: sidebar + content 2-col */\n' +
'    @media(min-width:1024px){\n' +
'      .page-body{max-width:1440px;padding:40px 60px;display:grid;grid-template-columns:260px 1fr;gap:36px;align-items:start;}\n' +
'    }\n' +
'\n' +
'    /* ═══ PC SIDEBAR ═══ */\n' +
'    .sidebar{display:none;}\n' +
'    @media(min-width:1024px){\n' +
'      .sidebar{display:block;position:sticky;top:100px;}\n' +
'      .sidebar-section{background:#fff;border-radius:20px;border:1px solid #ede9e2;padding:20px;margin-bottom:16px;}\n' +
'      .sidebar-title{font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px;}\n' +
'      .sb-btn{display:flex;align-items:center;gap:10px;width:100%;padding:10px 14px;border-radius:12px;border:none;background:transparent;font-family:inherit;font-size:14px;font-weight:500;color:#555;cursor:pointer;transition:all .15s;text-align:left;}\n' +
'      .sb-btn:hover{background:#f8f6f3;color:#111;}\n' +
'      .sb-btn.active{background:#fdf8ef;color:#8a6d3b;font-weight:600;}\n' +
'      .sb-btn.active .sb-dot{background:var(--gold);}\n' +
'      .sb-dot{width:8px;height:8px;border-radius:50%;background:#ddd;flex-shrink:0;transition:background .15s;}\n' +
'      .sb-count{margin-left:auto;font-size:11px;background:#f3f0ec;color:#999;padding:2px 8px;border-radius:99px;}\n' +
'      .sb-btn.active .sb-count{background:rgba(201,160,53,.15);color:#8a6d3b;}\n' +
'      /* 사이드바 통계 */\n' +
'      .sb-stat{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f0ec;}\n' +
'      .sb-stat:last-child{border-bottom:none;}\n' +
'      .sb-stat-label{font-size:12px;color:#9ca3af;}\n' +
'      .sb-stat-val{font-size:13px;font-weight:600;color:#111;}\n' +
'    }\n' +
'\n' +
'    /* ═══ CARD GRID ═══ */\n' +
'    .card-grid{display:flex;flex-direction:column;gap:12px;}\n' +
'    @media(min-width:1024px){\n' +
'      .card-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;}\n' +
'    }\n' +
'    @media(min-width:1400px){.card-grid{grid-template-columns:repeat(3,1fr);}}\n' +
'\n' +
'    /* ═══ CARD BASE (모바일: 가로형) ═══ */\n' +
'    .camp-card{\n' +
'      background:#fff;border-radius:16px;overflow:hidden;\n' +
'      border:1px solid #ede9e2;box-shadow:0 1px 8px rgba(0,0,0,.05);\n' +
'      transition:box-shadow .22s,transform .18s;cursor:pointer;\n' +
'      display:flex;flex-direction:row;align-items:stretch;\n' +
'    }\n' +
'    .camp-card:active{transform:scale(.985);}\n' +
'    @media(hover:hover){.camp-card:hover{box-shadow:0 10px 32px rgba(0,0,0,.12);border-color:#d4c4a0;transform:translateY(-2px);}}\n' +
'\n' +
'    /* 모바일 이미지: 왼쪽 고정 정사각형 */\n' +
'    .camp-img-wrap{position:relative;flex-shrink:0;width:90px;height:90px;background:#ede9e4;overflow:hidden;}\n' +
'    .camp-img-wrap img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;}\n' +
'    .img-overlay{position:absolute;inset:0;pointer-events:none;}\n' +
'    .img-top{position:absolute;top:6px;left:6px;}\n' +
'    .img-title{display:none;}\n' +
'    .img-fb{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#f0ede8;}\n' +
'    .img-fb-icon{font-size:2rem;color:#d1cdc8;}\n' +
'\n' +
'    /* 모바일 콘텐츠 */\n' +
'    .card-content{flex:1;min-width:0;display:flex;flex-direction:column;padding:10px 12px;gap:4px;overflow:hidden;}\n' +
'    .card-title{font-family:"Cormorant Garamond",Georgia,serif;font-size:14px;font-weight:600;color:#1f2937;line-height:1.3;\n' +
'      display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}\n' +
'    .card-venue-row{display:flex;align-items:center;gap:5px;overflow:hidden;}\n' +
'    .venue-name{font-size:11px;font-weight:700;color:#8a6d3b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\n' +
'    .venue-addr{font-size:10px;color:#9ca3af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n' +
'    .card-benefits-mini{font-size:10px;color:#78350f;background:#fffbef;border:1px solid #f0d88a;border-radius:7px;padding:4px 8px;white-space:normal;line-height:1.5;}\n' +
'    .card-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:6px;border-top:1px solid #f5f2ee;gap:6px;}\n' +
'\n' +
'    /* ══ PC: 세로형 + 완전 고정 높이 ══ */\n' +
'    @media(min-width:1024px){\n' +
'      .camp-card{flex-direction:column;border-radius:18px;}\n' +
'      /* 이미지 고정 190px */\n' +
'      .camp-img-wrap{width:100%;height:160px;flex-shrink:0;}\n' +
'      .img-overlay{background:linear-gradient(to bottom,rgba(0,0,0,0) 30%,rgba(0,0,0,.7) 100%);}\n' +
'      .img-top{top:10px;left:10px;}\n' +
'      /* 타이틀은 이미지 위 오버레이 */\n' +
'      .img-title{display:block;position:absolute;bottom:0;left:0;right:0;padding:0 14px 12px;}\n' +
'      .img-title h3{font-family:"Cormorant Garamond",Georgia,serif;font-size:17px;font-weight:600;color:#fff;line-height:1.2;\n' +
'        display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}\n' +
'      .card-title{display:none;}\n' +
'      /* 콘텐츠: 나머지 210px, overflow hidden으로 넘침 차단 */\n' +
'      .card-content{flex:1;overflow:hidden;padding:12px 15px;gap:7px;}\n' +
'      .card-venue-row{gap:6px;}\n' +
'      .venue-name{font-size:12px;color:#1f2937;}\n' +
'      .venue-addr{font-size:11px;}\n' +
'      /* 혜택 2줄 clamp */\n' +
'      .card-benefits-mini{font-size:11px;padding:5px 9px;\n' +
'        white-space:normal;line-height:1.5;}\n' +
'    }\n' +
'\n' +
'    /* pill */\n' +
'    .pill{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:99px;font-size:10px;font-weight:600;}\n' +
'    .pill-clinic{background:rgba(219,234,254,.9);color:#1d4ed8;}\n' +
'    .pill-beauty{background:rgba(252,231,243,.9);color:#be185d;}\n' +
'    /* map btn */\n' +
'    .map-btn{flex-shrink:0;display:inline-flex;align-items:center;gap:3px;font-size:10px;color:#3b82f6;font-weight:600;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:4px 8px;text-decoration:none;white-space:nowrap;}\n' +
'    /* detail modal용 */\n' +
'    .benefit-box{background:linear-gradient(135deg,#fffbef,#fef3c7);border:1px solid #f0d88a;border-radius:14px;padding:13px 15px;display:flex;align-items:flex-start;gap:10px;}\n' +
'    .req-box{background:#f8f7f5;border:1px solid #ede9e2;border-radius:14px;padding:13px 15px;display:flex;align-items:flex-start;gap:10px;}\n' +
'    .box-icon{font-size:13px;margin-top:2px;flex-shrink:0;}\n' +
'    .box-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;}\n' +
'    .box-text{font-size:12px;line-height:1.6;}\n' +
'    .benefit-box .box-label{color:#b45309;}\n' +
'    .benefit-box .box-text{color:#78350f;}\n' +
'    .req-box .box-label{color:#6b7280;}\n' +
'    .req-box .box-text{color:#4b5563;}\n' +
'\n' +
'    /* ═══ PC COUNT HEADER ═══ */\n' +
'    .pc-header{display:none;}\n' +
'    @media(min-width:1024px){\n' +
'      .pc-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}\n' +
'      .pc-header-title{font-size:22px;font-weight:700;color:#111;font-family:"Cormorant Garamond",Georgia,serif;}\n' +
'      .pc-header-count{font-size:13px;color:#aaa;}\n' +
'    }\n' +
'\n' +
'    /* ═══ BUTTONS ═══ */\n' +
'    .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#fff;font-weight:600;transition:all .2s;border:none;cursor:pointer;font-family:inherit;}\n' +
'    .btn-gold:active{transform:scale(.97);}\n' +
'    .btn-gold:disabled{background:#e5e7eb;color:#9ca3af;cursor:not-allowed;transform:none;}\n' +
'    .btn-apply{padding:9px 18px;border-radius:12px;font-size:12px;}\n' +
'\n' +
'    /* ═══ EMPTY ═══ */\n' +
'    .empty-box{text-align:center;padding:80px 0;}\n' +
'    .empty-icon{width:64px;height:64px;background:#f3f0ec;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;color:#ccc;}\n' +
'\n' +
'    /* ═══ FOOTER ═══ */\n' +
'    .site-footer{border-top:1px solid #e9e5df;background:#fff;margin-top:12px;padding:32px 24px;}\n' +
'    .footer-inner{max-width:1440px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:12px;}\n' +
'    @media(min-width:640px){.footer-inner{flex-direction:row;justify-content:space-between;}}\n' +
'    .footer-copy{font-size:12px;color:#ccc;}\n' +
'\n' +
'    /* ═══ MODAL ═══ */\n' +
'    /* 모바일: 바텀시트 */\n' +
'    .modal-bg{display:none;position:fixed;inset:0;background:rgba(8,7,6,.6);z-index:999;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);align-items:flex-end;justify-content:center;}\n' +
'    .modal-bg.open{display:flex;}\n' +
'    .sheet{width:100%;max-width:560px;max-height:92vh;overflow-y:auto;background:#fff;border-radius:24px 24px 0 0;}\n' +
'    .sheet-handle{display:flex;justify-content:center;padding:12px 0 4px;}\n' +
'    .sheet-handle div{width:40px;height:4px;background:#e5e7eb;border-radius:99px;}\n' +
'    /* PC: 중앙 다이얼로그 */\n' +
'    @media(min-width:1024px){\n' +
'      .modal-bg{align-items:center;}\n' +
'      .sheet{border-radius:24px;margin:20px;max-width:620px;max-height:88vh;}\n' +
'      .sheet-handle{display:none;}\n' +
'    }\n' +
'\n' +
'    /* ═══ DATE CHIP ═══ */\n' +
'    .chip{display:inline-flex;align-items:center;gap:5px;background:#fdf8ef;border:1px solid #e8d9bf;color:#7a5c2a;border-radius:8px;padding:5px 10px;font-size:12px;font-weight:500;}\n' +
'    .chip button{color:#c9a96e;background:none;border:none;cursor:pointer;font-size:16px;line-height:1;padding:0 0 0 2px;}\n' +
'\n' +
'    input:focus,textarea:focus,select:focus{outline:none!important;border-color:var(--gold)!important;box-shadow:0 0 0 3px rgba(201,160,53,.12)!important;}\n' +
'    ::-webkit-scrollbar{width:4px;height:4px;}\n' +
'    ::-webkit-scrollbar-thumb{background:#d4b896;border-radius:99px;}\n' +
'  </style>\n' +
'</head>\n' +
'<body>\n' +
'\n' +
'<!-- ═══ NAV ═══ -->\n' +
'<nav class="nav-blur">\n' +
'  <div class="nav-inner">\n' +
'    <div class="logo-wrap" id="logoBtn" onclick="handleLogoClick()">\n' +
'      <div class="logo-icon">\n' +
'        <svg viewBox="0 0 24 24"><path d="M12 2C8.5 2 6 5 6 8c0 4 6 10 6 14 0-4 6-10 6-14 0-3-2.5-6-6-6z"/></svg>\n' +
'      </div>\n' +
'      <div>\n' +
'        <div class="logo-name">Seoul Beauty Trip</div>\n' +
'        <div class="logo-sub">Influencer Experience Program</div>\n' +
'      </div>\n' +
'    </div>\n' +
'    <!-- PC 전용 네비 링크 -->\n' +
'    <div class="nav-links">\n' +
'      <a href="#programs">Programs</a>\n' +
'      <a href="#" onclick="filterBy(\'Clinic\');return false;">Clinics</a>\n' +
'      <a href="#" onclick="filterBy(\'Beauty Shop\');return false;">Beauty</a>\n' +
'      <a href="#" onclick="openApply(allCampaigns[0]&&allCampaigns[0].id);return false;" class="nav-cta btn-gold">Apply Now</a>\n' +
'    </div>\n' +
'  </div>\n' +
'</nav>\n' +
'\n' +
'<!-- ═══ HERO ═══ -->\n' +
'<section class="hero">\n' +
'  <div class="hero-noise"></div>\n' +
'  <div class="hero-inner">\n' +
'    <!-- 좌측 텍스트 -->\n' +
'    <div class="hero-left">\n' +
'      <div class="hero-badge"><span></span>Exclusive for International Creators</div>\n' +
'      <h1 class="hero-title">Seoul\'s Finest<br><span class="gold-text">Clinics &amp; Beauty</span></h1>\n' +
'      <p class="hero-desc">Complimentary treatments at Seoul\'s most prestigious destinations \u2014 crafted for international creators.</p>\n' +
'      <div class="hero-chips">\n' +
'        <span><span class="hero-dot"></span>Free treatments</span>\n' +
'        <span><span class="hero-dot"></span>English-speaking staff</span>\n' +
'        <span><span class="hero-dot"></span>All nationalities welcome</span>\n' +
'      </div>\n' +
'    </div>\n' +
'    <!-- PC 전용 우측 스탯 -->\n' +
'    <div class="hero-right">\n' +
'      <div class="stat-cards">\n' +
'        <div class="stat-card">\n' +
'          <div class="stat-num" id="statPrograms">0</div>\n' +
'          <div class="stat-label">Active<br>Programs</div>\n' +
'        </div>\n' +
'        <div class="stat-card">\n' +
'          <div class="stat-num">100%</div>\n' +
'          <div class="stat-label">Free<br>Treatments</div>\n' +
'        </div>\n' +

'        <div class="stat-card" style="background:linear-gradient(135deg,rgba(201,160,53,.15),rgba(232,193,106,.1));border-color:rgba(201,160,53,.25);">\n' +
'          <div class="stat-num" style="font-size:28px;color:#f0d585;line-height:1.2;">EN<br>spoken</div>\n' +
'          <div class="stat-label">All clinics<br>English-ready</div>\n' +
'        </div>\n' +
'      </div>\n' +
'    </div>\n' +
'  </div>\n' +
'</section>\n' +
'\n' +
'<div class="gold-line"></div>\n' +
'\n' +
'<!-- ═══ 모바일 전용 필터바 ═══ -->\n' +
'<div class="filter-bar" id="mobileFilter">\n' +
'  <div class="filter-inner">\n' +
'    <button onclick="filterBy(\'all\')"         data-f="all"         class="f-btn active">All</button>\n' +
'    <button onclick="filterBy(\'Clinic\')"      data-f="Clinic"      class="f-btn">&#x1F3E5; Clinic</button>\n' +
'    <button onclick="filterBy(\'Beauty Shop\')" data-f="Beauty Shop" class="f-btn">&#x1F484; Beauty</button>\n' +
'    <button onclick="filterBy(\'Dental Clinic\')" data-f="Dental Clinic" class="f-btn">&#x1F9B7; Dental</button>\n' +
'    <button onclick="filterBy(\'Korean Medicine\')" data-f="Korean Medicine" class="f-btn">&#x1F331; Korean Med</button>\n' +
'    <button onclick="filterBy(\'Hair &amp; Scalp Spa\')" data-f="Hair & Scalp Spa" class="f-btn">&#x1F9D6; Hair</button>\n' +
'    <div id="campaignCount" class="count-badge"></div>\n' +
'  </div>\n' +
'</div>\n' +
'\n' +
'<!-- ═══ MAIN BODY ═══ -->\n' +
'<div class="page-body" id="programs">\n' +
'\n' +
'  <!-- PC 전용 사이드바 -->\n' +
'  <aside class="sidebar">\n' +
'    <!-- 필터 -->\n' +
'    <div class="sidebar-section">\n' +
'      <div class="sidebar-title">Category</div>\n' +
'      <button onclick="filterBy(\'all\')" data-f="all" class="sb-btn active">\n' +
'        <span class="sb-dot"></span>All Programs\n' +
'        <span class="sb-count" id="sbCountAll">0</span>\n' +
'      </button>\n' +
'      <button onclick="filterBy(\'Clinic\')" data-f="Clinic" class="sb-btn">\n' +
'        <span class="sb-dot"></span>&#x1F3E5; Clinics\n' +
'        <span class="sb-count" id="sbCountClinic">0</span>\n' +
'      </button>\n' +
'      <button onclick="filterBy(\'Beauty Shop\')" data-f="Beauty Shop" class="sb-btn">\n' +
'        <span class="sb-dot"></span>&#x1F484; Beauty Shops\n' +
'        <span class="sb-count" id="sbCountBeauty">0</span>\n' +
'      </button>\n' +
'      <button onclick="filterBy(\'Dental Clinic\')" data-f="Dental Clinic" class="sb-btn">\n' +
'        <span class="sb-dot"></span>&#x1F9B7; Dental\n' +
'        <span class="sb-count">0</span>\n' +
'      </button>\n' +
'      <button onclick="filterBy(\'Korean Medicine\')" data-f="Korean Medicine" class="sb-btn">\n' +
'        <span class="sb-dot"></span>&#x1F331; Korean Med\n' +
'        <span class="sb-count">0</span>\n' +
'      </button>\n' +
'      <button onclick="filterBy(\'Hair & Scalp Spa\')" data-f="Hair & Scalp Spa" class="sb-btn">\n' +
'        <span class="sb-dot"></span>&#x1F9D6; Hair & Scalp\n' +
'        <span class="sb-count">0</span>\n' +
'      </button>\n' +
'    </div>\n' +

'    <!-- 안내 배너 -->\n' +
'    <div style="background:linear-gradient(135deg,#1c1408,#0c0b09);border-radius:16px;padding:20px;">\n' +
'      <p style="font-size:12px;color:rgba(255,255,255,.5);margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;">How it works</p>\n' +
'      <p style="font-size:13px;color:#e5ddd0;line-height:1.7;">Pick a program, submit your application, and our team will confirm your complimentary visit.</p>\n' +
'      <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px;">\n' +
'        <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#a8a29e;"><span style="width:20px;height:20px;border-radius:50%;background:rgba(201,160,53,.2);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--gold2);flex-shrink:0;">1</span>Choose a program</div>\n' +
'        <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#a8a29e;"><span style="width:20px;height:20px;border-radius:50%;background:rgba(201,160,53,.2);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--gold2);flex-shrink:0;">2</span>Submit application</div>\n' +
'        <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#a8a29e;"><span style="width:20px;height:20px;border-radius:50%;background:rgba(201,160,53,.2);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--gold2);flex-shrink:0;">3</span>Get confirmed &amp; enjoy!</div>\n' +
'      </div>\n' +
'    </div>\n' +
'  </aside>\n' +
'\n' +
'  <!-- 카드 영역 -->\n' +
'  <div class="content-area">\n' +
'    <!-- PC 전용 헤더 -->\n' +
'    <div class="pc-header">\n' +
'      <h2 class="pc-header-title">Available Programs</h2>\n' +
'      <span class="pc-header-count" id="pcCount"></span>\n' +
'    </div>\n' +
'    <!-- 카드 그리드 -->\n' +
'    <div class="card-grid" id="grid"></div>\n' +
'    <div id="empty" style="display:none">\n' +
'      <div class="empty-box">\n' +
'        <div class="empty-icon">&#x1F50D;</div>\n' +
'        <p style="color:#aaa;font-weight:500">No programs found</p>\n' +
'      </div>\n' +
'    </div>\n' +
'  </div>\n' +
'</div>\n' +
'\n' +
'<!-- ═══ FOOTER ═══ -->\n' +
'<footer class="site-footer">\n' +
'  <div class="footer-inner">\n' +
'    <div class="logo-wrap">\n' +
'      <div class="logo-icon" style="width:28px;height:28px;border-radius:8px">\n' +
'        <svg viewBox="0 0 24 24" style="width:11px;height:11px;fill:#fff"><path d="M12 2C8.5 2 6 5 6 8c0 4 6 10 6 14 0-4 6-10 6-14 0-3-2.5-6-6-6z"/></svg>\n' +
'      </div>\n' +
'      <div>\n' +
'        <div class="logo-name" style="font-size:12px">Seoul Beauty Trip</div>\n' +
'        <div class="logo-sub">Influencer Experience Program</div>\n' +
'      </div>\n' +
'    </div>\n' +
'    <p class="footer-copy">\u00a9 2025 Seoul Beauty Trip \u00b7 All rights reserved</p>\n' +
'  </div>\n' +
'</footer>\n' +
'\n' +
'<!-- ═══ APPLY MODAL ═══ -->\n' +
'<div id="applyModal" class="modal-bg">\n' +
'  <div class="sheet">\n' +
'    <div class="sheet-handle"><div></div></div>\n' +
'    <div style="padding:20px 24px 16px;border-bottom:1px solid #f3f0ec;background:linear-gradient(135deg,#0c0b09,#1c1408)">\n' +
'      <div style="display:flex;align-items:flex-start;justify-content:space-between">\n' +
'        <div>\n' +
'          <h3 style="font-weight:600;color:#fff;font-size:16px">Apply for Program</h3>\n' +
'          <p id="applySubtitle" style="font-size:12px;color:rgba(251,191,36,.7);margin-top:4px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></p>\n' +
'        </div>\n' +
'        <button onclick="closeApply()" style="color:rgba(255,255,255,.4);background:none;border:none;font-size:26px;line-height:1;cursor:pointer;padding:0;margin-left:16px">&times;</button>\n' +
'      </div>\n' +
'    </div>\n' +
'    <form id="applyForm" style="padding:20px 24px;display:flex;flex-direction:column;gap:16px">\n' +
'      <input type="hidden" id="applyCapId">\n' +
'      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">\n' +
'        <div>\n' +
'          <label style="display:block;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Full Name <span style="color:#f87171">*</span></label>\n' +
'          <input id="fName" type="text" placeholder="Your name" style="width:100%;border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px;font-size:14px;font-family:inherit" required>\n' +
'        </div>\n' +
'        <div>\n' +
'          <label style="display:block;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Nationality <span style="color:#f87171">*</span></label>\n' +
'          <select id="fNation" style="width:100%;border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px;font-size:14px;font-family:inherit;background:#fff" required>\n' +
'            <option value="">Select</option>\n' +
'            <option>&#x1F1FA;&#x1F1F8; American</option><option>&#x1F1EC;&#x1F1E7; British</option><option>&#x1F1E6;&#x1F1FA; Australian</option>\n' +
'            <option>&#x1F1E8;&#x1F1E6; Canadian</option><option>&#x1F1EF;&#x1F1F5; Japanese</option><option>&#x1F1E8;&#x1F1F3; Chinese</option>\n' +
'            <option>&#x1F1F9;&#x1F1FC; Taiwanese</option><option>&#x1F1ED;&#x1F1F0; Hong Konger</option><option>&#x1F1F9;&#x1F1ED; Thai</option>\n' +
'            <option>&#x1F1FB;&#x1F1F3; Vietnamese</option><option>&#x1F1F5;&#x1F1ED; Filipino</option><option>&#x1F1EE;&#x1F1E9; Indonesian</option>\n' +
'            <option>&#x1F1F2;&#x1F1FE; Malaysian</option><option>&#x1F1F8;&#x1F1EC; Singaporean</option><option>&#x1F1EE;&#x1F1F3; Indian</option>\n' +
'            <option>&#x1F1EB;&#x1F1F7; French</option><option>&#x1F1E9;&#x1F1EA; German</option><option>&#x1F1E7;&#x1F1F7; Brazilian</option>\n' +
'            <option>&#x1F1F2;&#x1F1FD; Mexican</option><option>&#x1F1F7;&#x1F1FA; Russian</option><option>&#x1F1F8;&#x1F1E6; Saudi</option>\n' +
'            <option>&#x1F1F3;&#x1F1F1; Dutch</option><option>&#x1F1EE;&#x1F1F9; Italian</option><option>&#x1F1EA;&#x1F1F8; Spanish</option>\n' +
'            <option>Other</option>\n' +
'          </select>\n' +
'        </div>\n' +
'      </div>\n' +
'      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">\n' +
'        <div>\n' +
'          <label style="display:block;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Email <span style="color:#f87171">*</span></label>\n' +
'          <input id="fEmail" type="email" placeholder="your@email.com" style="width:100%;border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px;font-size:14px;font-family:inherit" required>\n' +
'        </div>\n' +
'        <div>\n' +
'          <label style="display:block;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">WhatsApp</label>\n' +
'          <input id="fPhone" type="tel" placeholder="+1-000-0000" style="width:100%;border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px;font-size:14px;font-family:inherit">\n' +
'        </div>\n' +
'      </div>\n' +
'      <div>\n' +
'        <label style="display:block;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Instagram <span style="color:#f87171">*</span></label>\n' +
'        <div style="display:flex;align-items:center;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">\n' +
'          <span style="padding:10px 12px;color:#9ca3af;font-size:14px;background:#f9fafb;border-right:1px solid #e5e7eb">@</span>\n' +
'          <input id="fInsta" type="text" placeholder="your_handle" style="flex:1;padding:10px 12px;font-size:14px;border:none;outline:none;font-family:inherit" required>\n' +
'        </div>\n' +
'      </div>\n' +
'      <div>\n' +
'        <label style="display:block;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Available Dates &amp; Times <span style="color:#f87171">*</span></label>\n' +
'        <p style="font-size:12px;color:#9ca3af;margin-bottom:8px">Add up to 5 slots \u2014 the clinic will confirm one.</p>\n' +
'        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">\n' +
'          <input id="dateInput" type="date" style="border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px;font-size:14px;flex:1;min-width:140px;font-family:inherit;cursor:pointer">\n' +
'          <select id="timeInput" style="border:1px solid #e5e7eb;border-radius:12px;padding:10px 10px;font-size:14px;background:#fff;font-family:inherit">\n' +
'            <option value="09:00">9:00 AM</option><option value="09:30">9:30 AM</option>\n' +
'            <option value="10:00">10:00 AM</option><option value="10:30">10:30 AM</option>\n' +
'            <option value="11:00">11:00 AM</option><option value="11:30">11:30 AM</option>\n' +
'            <option value="12:00">12:00 PM</option><option value="12:30">12:30 PM</option>\n' +
'            <option value="13:00">1:00 PM</option><option value="13:30">1:30 PM</option>\n' +
'            <option value="14:00">2:00 PM</option><option value="14:30">2:30 PM</option>\n' +
'            <option value="15:00">3:00 PM</option><option value="15:30">3:30 PM</option>\n' +
'            <option value="16:00">4:00 PM</option><option value="16:30">4:30 PM</option>\n' +
'            <option value="17:00">5:00 PM</option><option value="17:30">5:30 PM</option>\n' +
'            <option value="18:00">6:00 PM</option>\n' +
'          </select>\n' +
'          <button type="button" onclick="addDate()" class="btn-gold" style="padding:10px 16px;border-radius:12px;font-size:13px;white-space:nowrap">+ Add</button>\n' +
'        </div>\n' +
'        <div id="dateChips" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;min-height:28px"></div>\n' +
'        <input type="hidden" id="fDates">\n' +
'      </div>\n' +
'      <div>\n' +
'        <label style="display:block;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Message <span style="color:#d1d5db;font-weight:400;text-transform:none">(optional)</span></label>\n' +
'        <textarea id="fMsg" rows="2" placeholder="Any notes for the clinic\u2026" style="width:100%;border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px;font-size:14px;resize:none;font-family:inherit"></textarea>\n' +
'      </div>\n' +
'      <div id="applyErr" style="display:none;background:#fef2f2;color:#dc2626;font-size:13px;border-radius:12px;padding:12px 16px;border:1px solid #fecaca"></div>\n' +
'      <div id="applyOk"  style="display:none;background:#f0fdf4;color:#16a34a;font-size:13px;border-radius:12px;padding:12px 16px;border:1px solid #bbf7d0"></div>\n' +
'      <button type="submit" class="btn-gold" style="width:100%;padding:14px;border-radius:12px;font-size:14px;font-weight:600">Submit Application</button>\n' +
'      <p style="text-align:center;font-size:12px;color:#d1d5db;padding-bottom:8px">The clinic will reach out to confirm your slot.</p>\n' +
'    </form>\n' +
'  </div>\n' +
'</div>\n' +
'\n' +
'<!-- ═══ DETAIL MODAL ═══ -->\n' +
'<div id="detailModal" class="modal-bg">\n' +
'  <div class="sheet" style="max-width:680px">\n' +
'    <div id="detailContent"></div>\n' +
'  </div>\n' +
'</div>\n' +
'\n' +
'<script>\n' +
'// ── SSR 데이터 직접 임베드 ──\n' +
'var allCampaigns = ' + ssrData + ';\n' +
'var selectedDates = [];\n' +
'\n' +
'// 로고 3회 클릭 → /admin\n' +
'var _lc = 0, _lt = null;\n' +
'function handleLogoClick() {\n' +
'  _lc++;\n' +
'  if (_lt) clearTimeout(_lt);\n' +
'  if (_lc >= 3) { _lc = 0; window.location.href = "/admin"; return; }\n' +
'  _lt = setTimeout(function(){ _lc = 0; }, 1000);\n' +
'}\n' +
'\n' +
'function imgFallback(el) {\n' +
'  var wrap = el.parentNode;\n' +
'  el.style.display = "none";\n' +
'  var fb = document.createElement("div");\n' +
'  fb.className = "img-fb";\n' +
'  fb.innerHTML = \'<div class="img-fb-icon">&#x1F3E5;</div>\';\n' +
'  wrap.appendChild(fb);\n' +
'}\n' +
'\n' +
'// 업체명 정리: 한글+영어 혼합 긴 이름 → 짧은 표시명 (전역 함수)\n' +
'function cleanPlaceName(name) {\n' +
'  if (!name) return "";\n' +
'  var engMatch = name.match(/[A-Za-z][A-Za-z0-9 &\x27.,-]*/);\n' +
'  if (engMatch) {\n' +
'    var eng = engMatch[0].trim();\n' +
'    if (eng.length >= 2) return eng;\n' +
'  }\n' +
'  return name;\n' +
'}\n' +
'\n' +
'function render(list) {\n' +
'  // 모바일 count badge\n' +
'  var countEl = document.getElementById("campaignCount");\n' +
'  if (countEl) countEl.textContent = list.length + (list.length === 1 ? " program" : " programs");\n' +
'  // PC count\n' +
'  var pcCountEl = document.getElementById("pcCount");\n' +
'  if (pcCountEl) pcCountEl.textContent = list.length + " programs";\n' +
'\n' +
'  // PC 사이드바 카운트 업데이트\n' +
'  var aEl = document.getElementById("sbCountAll");\n' +
'  if (aEl) aEl.textContent = list.length;\n' +
'  document.querySelectorAll("[data-f]").forEach(function(btn) {\n' +
'    var f = btn.dataset.f;\n' +
'    var sp = btn.querySelector(".sb-count");\n' +
'    if (sp && f && f !== "all") sp.textContent = allCampaigns.filter(function(c){ return c.category === f; }).length;\n' +
'  });\n' +
'\n' +
'  var grid  = document.getElementById("grid");\n' +
'  var empty = document.getElementById("empty");\n' +
'  if (!list.length) {\n' +
'    grid.innerHTML = "";\n' +
'    empty.style.display = "block";\n' +
'    return;\n' +
'  }\n' +
'  empty.style.display = "none";\n' +
'\n' +
'  grid.innerHTML = list.map(function(c) {\n' +
'    var full    = c.current_participants >= c.max_participants;\n' +
'    var thumb   = c.place_photo_ref ? "/api/places/photo?ref=" + c.place_photo_ref : "";\n' +
'    var mapsUrl = c.place_id ? "https://www.google.com/maps/place/?q=place_id:" + c.place_id : "";\n' +
'    var displayName = cleanPlaceName(c.place_name);\n' +
'\n' +
'    var catPill = c.category === "Clinic"\n' +
'      ? \'<span class="pill pill-clinic">&#x1F3E5; \' + c.category + \'</span>\'\n' +
'      : \'<span class="pill pill-beauty">&#x1F484; \' + c.category + \'</span>\';\n' +
'\n' +
'    var ratingBadge = c.place_rating\n' +
'      ? \'<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(0,0,0,.45);backdrop-filter:blur(6px);border-radius:99px;padding:2px 8px;font-size:11px;font-weight:600;color:#fff"><span style="color:#f59e0b">&#9733;</span>\' + c.place_rating + \'</span>\'\n' +
'      : "";\n' +
'\n' +
'    var dlBadge = \'<span style="display:inline-flex;align-items:center;gap:4px;background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a;font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;"><span style="width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block;flex-shrink:0;"></span>Open now</span>\';\n' +
'    if (c.deadline && c.status === "active") {\n' +
'      var dlDate = new Date(c.deadline);\n' +
'      var today  = new Date(); today.setHours(0,0,0,0);\n' +
'      var daysLeft = Math.ceil((dlDate - today) / 86400000);\n' +
'      if (daysLeft === 0)                    dlBadge = \'<span style="font-size:12px;color:#ef4444;font-weight:600">Last day!</span>\';\n' +
'      else if (daysLeft > 0 && daysLeft <= 7) dlBadge = \'<span style="font-size:12px;color:#f97316;font-weight:600">&#x26A1; \' + daysLeft + \' days left</span>\';\n' +
'      else                                    dlBadge = \'<span style="font-size:12px;color:#22c55e;font-weight:500">Open now</span>\';\n' +
'    }\n' +
'\n' +
'    var shortAddr = "";\n' +
'    if (c.place_address) {\n' +
'      var parts = c.place_address.split(",");\n' +
'      var engParts = parts.filter(function(p){ return !/[\uAC00-\uD7A3\u3131-\u314E]/.test(p); });\n' +
'      shortAddr = (engParts.length ? engParts : parts).slice(-3).join(",").trim();\n' +
'    }\n' +
'\n' +
'    var mapBtnHtml = mapsUrl\n' +
'      ? \'<a href="\' + mapsUrl + \'" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="map-btn">&#x1F4CD; Map</a>\'\n' +
'      : "";\n' +
'\n' +
'    var imgInner = thumb\n' +
'      ? \'<img src="\' + thumb + \'" alt="\' + displayName + \'" loading="lazy" onerror="imgFallback(this)">\'\n' +
'      : \'<div class="img-fb"><div class="img-fb-icon">&#x1F3E5;</div></div>\';\n' +
'\n' +
'    var bookedOverlay = full\n' +
'      ? \'<div style="position:absolute;inset:0;background:rgba(0,0,0,.48);display:flex;align-items:center;justify-content:center"><span style="border:1px solid rgba(255,255,255,.35);color:#fff;font-size:10px;font-weight:700;letter-spacing:2px;padding:5px 14px;border-radius:99px;backdrop-filter:blur(6px)">FULL</span></div>\'\n' +
'      : "";\n' +
'\n' +
'    var benefitMini = c.benefits\n' +
'      ? \'<div class="card-benefits-mini">&#x1F381; \' + c.benefits + \'</div>\'\n' +
'      : "";\n' +
'\n' +
'    var applyBtn = \'<button onclick="event.stopPropagation();openApply(\' + c.id + \')" \' + (full ? "disabled" : "") +\n' +
'      \' style="font-size:11px;padding:5px 14px;border-radius:99px;flex-shrink:0" class="btn-gold btn-apply">\' + (full ? "Full" : "Apply") + \'</button>\';\n' +
'\n' +
'    var ratingStr = c.place_rating\n' +
'      ? \'<span style="font-size:10px;color:#f59e0b;font-weight:600;flex-shrink:0">&#9733;\' + c.place_rating + \'</span>\'\n' +
'      : "";\n' +
'\n' +
'    return \'<article class="camp-card" onclick="openDetail(\' + c.id + \')">\' +\n' +
'      \'<div class="camp-img-wrap">\' +\n' +
'        imgInner +\n' +
'        \'<div class="img-overlay"></div>\' +\n' +
'        bookedOverlay +\n' +
'        \'<div class="img-top">\' + catPill + \'</div>\' +\n' +
'        \'<div class="img-title"><h3>\' + c.title + \'</h3></div>\' +\n' +
'      \'</div>\' +\n' +
'      \'<div class="card-content">\' +\n' +
'        \'<div class="card-title">\' + c.title + \'</div>\' +\n' +
'        \'<div class="card-venue-row"><span class="venue-name">\' + displayName + \'</span>\' + ratingStr + \'</div>\' +\n' +
'        (shortAddr ? \'<div class="venue-addr">&#x1F4CD; \' + shortAddr + \'</div>\' : "") +\n' +
'        benefitMini +\n' +
'        \'<div class="card-footer">\' + dlBadge + \'</div>\' +\n' +
'      \'</div>\' +\n' +
'    \'</article>\';\n' +
'  }).join("");\n' +
'}\n' +
'\n' +
'// 필터 (모바일 + PC 사이드바 동시 업데이트)\n' +
'function filterBy(cat) {\n' +
'  // 모바일 필터 버튼\n' +
'  document.querySelectorAll(".f-btn").forEach(function(b){ b.classList.toggle("active", b.dataset.f === cat); });\n' +
'  // PC 사이드바 버튼\n' +
'  document.querySelectorAll(".sb-btn").forEach(function(b){ b.classList.toggle("active", b.dataset.f === cat); });\n' +
'  var filtered = cat === "all" ? allCampaigns : allCampaigns.filter(function(c){ return c.category === cat; });\n' +
'  render(filtered);\n' +
'}\n' +
'\n' +
'// Detail: SSR 캐시 우선\n' +
'function openDetail(id) {\n' +
'  var c = allCampaigns.find(function(x){ return x.id == id; });\n' +
'  if (c) { _renderDetail(c); return; }\n' +
'  fetch("/api/campaigns/" + id).then(function(r){ return r.json(); }).then(function(r){ _renderDetail(r.data); });\n' +
'}\n' +
'\n' +
'function _renderDetail(c) {\n' +
'  var full    = c.current_participants >= c.max_participants;\n' +
'  var thumb   = c.place_photo_ref ? "/api/places/photo?ref=" + c.place_photo_ref : "";\n' +
'  var mapsUrl = c.place_id ? "https://www.google.com/maps/place/?q=place_id:" + c.place_id : "";\n' +
'\n' +
'  var dlText = "Open";\n' +
'  if (c.deadline) {\n' +
'    var dlDate = new Date(c.deadline);\n' +
'    var today  = new Date(); today.setHours(0,0,0,0);\n' +
'    var daysLeft = Math.ceil((dlDate - today) / 86400000);\n' +
'    var dlFmt = dlDate.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});\n' +
'    if (daysLeft === 0)      dlText = "Last day! (" + dlFmt + ")";\n' +
'    else if (daysLeft > 0 && daysLeft <= 7) dlText = "&#x26A1; " + daysLeft + " days left \u2014 " + dlFmt;\n' +
'    else if (daysLeft > 7)  dlText = dlFmt;\n' +
'  }\n' +
'\n' +
'  var imgPart = thumb\n' +
'    ? \'<img src="\' + thumb + \'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" onerror="imgFallback(this)">\'\n' +
'    : \'<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#f0ede8;font-size:4rem;color:#d1cdc8">&#x1F3E5;</div>\';\n' +
'\n' +
'  var addrPart = c.place_address\n' +
'    ? \'<div style="display:flex;align-items:flex-start;gap:10px;background:#f8f7f5;border:1px solid #ede9e2;border-radius:14px;padding:12px 14px">\' +\n' +
'        \'<span style="color:#f87171;font-size:14px;margin-top:2px;flex-shrink:0">&#x1F4CD;</span>\' +\n' +
'        \'<div><p style="font-size:13px;color:#374151;line-height:1.6;margin:0">\' + c.place_address + \'</p>\' +\n' +
'          (mapsUrl ? \'<a href="\' + mapsUrl + \'" target="_blank" rel="noopener" style="font-size:12px;color:#3b82f6;font-weight:500;display:inline-flex;align-items:center;gap:4px;margin-top:6px">&#x2197; Open in Google Maps</a>\' : "") +\n' +
'        \'</div>\' +\n' +
'      \'</div>\'\n' +
'    : "";\n' +
'\n' +
'  var ctaHtml = !full\n' +
'    ? \'<button onclick="closeDetail();openApply(\' + c.id + \')" class="btn-gold" style="width:100%;padding:16px;border-radius:16px;font-size:14px;font-weight:600;letter-spacing:.3px">Apply Now \u2014 It\u2019s Free</button>\'\n' +
'    : \'<div style="width:100%;text-align:center;padding:16px;border-radius:16px;font-size:14px;font-weight:500;color:#9ca3af;background:#f3f4f6">This program is fully booked</div>\';\n' +
'\n' +
'  var ratingPill = c.place_rating\n' +
'    ? \'<span class="pill" style="background:#fef9ee;color:#92620a">&#9733; \' + c.place_rating + \' \xb7 Verified</span>\'\n' +
'    : "";\n' +
'\n' +
'  document.getElementById("detailContent").innerHTML =\n' +
'    \'<div style="position:relative;width:100%;padding-top:56.25%;background:#ede9e4;overflow:hidden">\' +\n' +
'      imgPart +\n' +
'      \'<div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 25%,rgba(0,0,0,.78) 100%);pointer-events:none"></div>\' +\n' +
'      \'<button onclick="closeDetail()" style="position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.4);backdrop-filter:blur(6px);border:none;color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center">&times;</button>\' +\n' +
'      \'<div style="position:absolute;bottom:0;left:0;right:0;padding:0 20px 18px">\' +\n' +
'        \'<p style="font-size:11px;color:rgba(255,255,255,.7);margin:0 0 6px">&#x1F4CD; \' + cleanPlaceName(c.place_name) + \'</p>\' +\n' +
'        \'<h2 style="font-family:Cormorant Garamond,Georgia,serif;font-size:24px;font-weight:600;color:#fff;line-height:1.25;margin:0">\' + c.title + \'</h2>\' +\n' +
'      \'</div>\' +\n' +
'    \'</div>\' +\n' +
'    \'<div style="padding:20px 20px 28px;display:flex;flex-direction:column;gap:16px">\' +\n' +
'      \'<div style="display:flex;flex-wrap:wrap;gap:8px">\' +\n' +
'        (c.category === "Clinic" ? \'<span class="pill pill-clinic">Clinic</span>\' : \'<span class="pill pill-beauty">Beauty Shop</span>\') +\n' +
'        ratingPill +\n' +
'      \'</div>\' +\n' +
'      addrPart +\n' +
'      (c.description ? \'<p style="font-size:14px;color:#4b5563;line-height:1.8;margin:0">\' + c.description + \'</p>\' : "") +\n' +
'      (c.benefits ? \'<div class="benefit-box"><span class="box-icon" style="color:#f59e0b">&#x1F381;</span><div><div class="box-label">What You Receive</div><div class="box-text">\' + c.benefits + \'</div></div></div>\' : "") +\n' +
'      (c.requirements ? \'<div class="req-box"><span class="box-icon" style="color:#9ca3af">&#x2713;</span><div><div class="box-label">Requirements</div><div class="box-text">\' + c.requirements + \'</div></div></div>\' : "") +\n' +
'      \'<p style="font-size:12px;color:#9ca3af;display:flex;align-items:center;gap:6px;margin:0">&#x1F4C5; Deadline: <span style="font-weight:500;color:#374151">\' + dlText + \'</span></p>\' +\n' +
'      ctaHtml +\n' +
'      \'<div style="height:8px"></div>\' +\n' +
'    \'</div>\';\n' +
'\n' +
'  document.getElementById("detailModal").classList.add("open");\n' +
'}\n' +
'function closeDetail(){ document.getElementById("detailModal").classList.remove("open"); }\n' +
'\n' +
'function openApply(id) {\n' +
'  var c = allCampaigns.find(function(x){ return x.id == id; });\n' +
'  if (!c) return;\n' +
'  document.getElementById("applyCapId").value = id;\n' +
'  document.getElementById("applySubtitle").textContent = cleanPlaceName(c.place_name) + "  \xb7  " + c.title;\n' +
'  document.getElementById("applyErr").style.display = "none";\n' +
'  document.getElementById("applyOk").style.display  = "none";\n' +
'  document.getElementById("applyForm").reset();\n' +
'  document.getElementById("applyCapId").value = id;\n' +
'  var submitBtn = document.querySelector("#applyForm button[type=submit]");\n' +
'  if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Submit Application"; }\n' +
'  selectedDates = [];\n' +
'  renderDateChips();\n' +
'  document.getElementById("timeInput").value = "10:00";\n' +
'  var todayStr = new Date().toISOString().slice(0,10);\n' +
'  document.getElementById("dateInput").min = todayStr;\n' +
'  document.getElementById("dateInput").value = "";\n' +
'  document.getElementById("applyModal").classList.add("open");\n' +
'}\n' +
'function closeApply(){ document.getElementById("applyModal").classList.remove("open"); }\n' +
'\n' +
'function fmtDateInput(el) {\n' +
'  var v = el.value.replace(/[^0-9]/g,"");\n' +
'  if (v.length > 4) v = v.slice(0,4) + "-" + v.slice(4);\n' +
'  if (v.length > 7) v = v.slice(0,7) + "-" + v.slice(7);\n' +
'  el.value = v.slice(0,10);\n' +
'}\n' +
'function addDate() {\n' +
'  var dateVal = document.getElementById("dateInput").value;\n' +
'  var timeVal = document.getElementById("timeInput").value;\n' +
'  if (!dateVal) { alert("Please pick a date from the calendar."); return; }\n' +
'  var picked = new Date(dateVal + "T00:00:00"); var today = new Date(); today.setHours(0,0,0,0);\n' +
'  if (picked < today) { alert("Please select today or a future date."); return; }\n' +
'  var key = dateVal + "|" + timeVal;\n' +
'  if (selectedDates.find(function(x){ return x.key === key; })) return;\n' +
'  if (selectedDates.length >= 5) { alert("You can add up to 5 slots."); return; }\n' +
'  selectedDates.push({ key:key, date:dateVal, time:timeVal });\n' +
'  selectedDates.sort(function(a,b){ return a.key.localeCompare(b.key); });\n' +
'  renderDateChips();\n' +
'  document.getElementById("dateInput").value = "";\n' +
'}\n' +
'function removeDate(key){ selectedDates = selectedDates.filter(function(x){ return x.key !== key; }); renderDateChips(); }\n' +
'function fmtTime(t) {\n' +
'  var parts = t.split(":"); var h = parseInt(parts[0]); var m = parseInt(parts[1]);\n' +
'  return (h > 12 ? h-12 : h || 12) + ":" + (m < 10 ? "0"+m : m) + " " + (h >= 12 ? "PM" : "AM");\n' +
'}\n' +
'function renderDateChips() {\n' +
'  var el = document.getElementById("dateChips");\n' +
'  el.innerHTML = selectedDates.map(function(s) {\n' +
'    var fmt = new Date(s.date + "T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});\n' +
'    var ek  = s.key.replace(/\'/g, "\\\'");\n' +
'    return \'<span class="chip">&#x23F0; \' + fmt + " " + fmtTime(s.time) + \'<button type="button" onclick="removeDate(\\\'\' + ek + \'\\\')">&times;</button></span>\';\n' +
'  }).join("");\n' +
'  document.getElementById("fDates").value = selectedDates.map(function(x){\n' +
'    return new Date(x.date+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) + " " + fmtTime(x.time);\n' +
'  }).join(" / ");\n' +
'}\n' +
'\n' +
'document.getElementById("applyForm").addEventListener("submit", async function(e) {\n' +
'  e.preventDefault();\n' +
'  var errEl = document.getElementById("applyErr");\n' +
'  var okEl  = document.getElementById("applyOk");\n' +
'  errEl.style.display = "none"; okEl.style.display = "none";\n' +
'  if (!selectedDates.length) {\n' +
'    errEl.textContent = "Please add at least one available date & time.";\n' +
'    errEl.style.display = "block"; return;\n' +
'  }\n' +
'  var body = {\n' +
'    campaign_id:     parseInt(document.getElementById("applyCapId").value),\n' +
'    applicant_name:  document.getElementById("fName").value.trim(),\n' +
'    nationality:     document.getElementById("fNation").value,\n' +
'    email:           document.getElementById("fEmail").value.trim(),\n' +
'    phone:           document.getElementById("fPhone").value.trim(),\n' +
'    instagram:       document.getElementById("fInsta").value.trim().replace(/^@/,""),\n' +
'    preferred_dates: document.getElementById("fDates").value,\n' +
'    message:         document.getElementById("fMsg").value.trim(),\n' +
'  };\n' +
'  var btn = e.target.querySelector("button[type=submit]");\n' +
'  btn.disabled = true; btn.textContent = "Submitting\u2026";\n' +
'  try {\n' +
'    var res  = await fetch("/api/apply",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});\n' +
'    var data = await res.json();\n' +
'    if (data.success) {\n' +
'      okEl.innerHTML = "\u2705 " + data.message; okEl.style.display = "block";\n' +
'      btn.textContent = "Done!";\n' +
'      var idx = allCampaigns.findIndex(function(x){ return x.id == body.campaign_id; });\n' +
'      if (idx >= 0) allCampaigns[idx].current_participants = (allCampaigns[idx].current_participants || 0) + 1;\n' +
'      setTimeout(function(){ closeApply(); render(allCampaigns); }, 2200);\n' +
'    } else {\n' +
'      errEl.textContent = data.error; errEl.style.display = "block";\n' +
'      btn.disabled = false; btn.textContent = "Submit Application";\n' +
'    }\n' +
'  } catch(err) {\n' +
'    errEl.textContent = "Network error. Please try again.";\n' +
'    errEl.style.display = "block"; btn.disabled = false; btn.textContent = "Submit Application";\n' +
'  }\n' +
'});\n' +
'\n' +
'document.querySelectorAll(".modal-bg").forEach(function(m){\n' +
'  m.addEventListener("click", function(e){ if (e.target === m) m.classList.remove("open"); });\n' +
'});\n' +
'\n' +
'// hero 스탯 카드 숫자 세팅\n' +
'var statEl = document.getElementById("statPrograms");\n' +
'if (statEl) statEl.textContent = allCampaigns.length;\n' +


'\n' +
'// 초기 렌더링\n' +
'render(allCampaigns);\n' +
'</script>\n' +
'</body>\n' +
'</html>'
}
