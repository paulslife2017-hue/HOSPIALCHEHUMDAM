#!/usr/bin/env python3
"""main.ts 전체 수정 - CSS(5) + JS(4) = 9개 교체"""

with open('src/pages/main.ts', 'rb') as f:
    data = f.read()

n = 0

# ─────────────────────────────────────────────────────────────
# CSS 1 : 모바일 이미지 108 → 90px
# ─────────────────────────────────────────────────────────────
old = b'camp-img-wrap{position:relative;flex-shrink:0;width:108px;height:108px;background:#ede9e4;overflow:hidden;}'
new = b'camp-img-wrap{position:relative;flex-shrink:0;width:90px;height:90px;background:#ede9e4;overflow:hidden;}'
if old in data:
    data = data.replace(old, new, 1); n+=1; print("OK CSS1 mobile 108->90px")
else:
    print("MISS CSS1")

# ─────────────────────────────────────────────────────────────
# CSS 2 : benefits nowrap → normal
# ─────────────────────────────────────────────────────────────
old = (b"card-benefits-mini{font-size:10.5px;color:#78350f;background:#fffbef;border:1px solid #f0d88a;border-radius:7px;padding:3px 7px;\\n' +\n"
       b"'      overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}")
new = b"card-benefits-mini{font-size:10px;color:#78350f;background:#fffbef;border:1px solid #f0d88a;border-radius:7px;padding:4px 8px;white-space:normal;line-height:1.5;}"
if old in data:
    data = data.replace(old, new, 1); n+=1; print("OK CSS2 benefits nowrap->normal")
else:
    print("MISS CSS2")

# ─────────────────────────────────────────────────────────────
# CSS 3 : PC height:400px 제거
# ─────────────────────────────────────────────────────────────
old = b'camp-card{flex-direction:column;border-radius:20px;height:400px;}'
new = b'camp-card{flex-direction:column;border-radius:18px;}'
if old in data:
    data = data.replace(old, new, 1); n+=1; print("OK CSS3 PC height:400px removed")
else:
    print("MISS CSS3")

# ─────────────────────────────────────────────────────────────
# CSS 4 : PC 이미지 190 → 160px
# ─────────────────────────────────────────────────────────────
old = b'camp-img-wrap{width:100%;height:190px;flex-shrink:0;}'
new = b'camp-img-wrap{width:100%;height:160px;flex-shrink:0;}'
if old in data:
    data = data.replace(old, new, 1); n+=1; print("OK CSS4 PC img 190->160px")
else:
    print("MISS CSS4")

# ─────────────────────────────────────────────────────────────
# CSS 5 : PC benefits line-clamp + card-footer 분리 규칙 제거
# ─────────────────────────────────────────────────────────────
old = (b"    .card-benefits-mini{font-size:11px;padding:5px 9px;\\n' +\n"
       b"'        white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}\\n' +\n"
       b"'      .card-footer{padding-top:8px;border-top:1px solid #f0ede8;}")
new = (b"    .card-benefits-mini{font-size:11px;padding:5px 9px;\\n' +\n"
       b"'        white-space:normal;line-height:1.5;}")
if old in data:
    data = data.replace(old, new, 1); n+=1; print("OK CSS5 PC line-clamp removed")
else:
    print("MISS CSS5")

# ─────────────────────────────────────────────────────────────
# JS 1 : Open now → 초록 pill 뱃지
# ─────────────────────────────────────────────────────────────
# 원본: b"    var dlBadge = \\'<span style=\"font-size:12px;color:#22c55e;font-weight:500\">Open now</span>\\';\\n' +\n'"
old_js1 = bytes.fromhex(
    '2020202076617220646c4261646765203d205c27'
    '3c7370616e207374796c653d22666f6e742d73697a653a313270783b636f6c6f723a233232633535653b666f6e742d7765696768743a353030223e'
    '4f70656e206e6f773c2f7370616e3e'
    '5c273b5c6e27202b0a27'
)
new_js1 = (
    b"    var dlBadge = \\'"
    b'<span style="display:inline-flex;align-items:center;gap:4px;'
    b'background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a;'
    b'font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;">'
    b'<span style="width:6px;height:6px;border-radius:50%;background:#22c55e;'
    b'display:inline-block;flex-shrink:0;"></span>Open now</span>'
    b"\\';\\n' +\n'"
)
if old_js1 in data:
    data = data.replace(old_js1, new_js1, 1); n+=1; print("OK JS1 Open now -> pill")
else:
    print("MISS JS1")

# ─────────────────────────────────────────────────────────────
# JS 2 : 주소 한글 필터
# ─────────────────────────────────────────────────────────────
old_js2 = bytes.fromhex(
    '0a27202020202020766172207061727473203d20632e706c6163655f616464726573732e73706c697428222c22293b'
    '5c6e27202b0a27'
    '202020202020'
    '73686f727441646472203d2070617274732e736c696365282d33292e6a6f696e28222c22292e7472696d28293b'
    '5c6e27202b'
)
new_js2 = (
    b"\n'      var parts = c.place_address.split(\",\");\\n' +\n"
    b"'      var engParts = parts.filter(function(p){ return !/[\\uAC00-\\uD7A3\\u3131-\\u314E]/.test(p); });\\n' +\n"
    b"'      shortAddr = (engParts.length ? engParts : parts).slice(-3).join(\",\").trim();\\n' +"
)
if old_js2 in data:
    data = data.replace(old_js2, new_js2, 1); n+=1; print("OK JS2 addr Korean filter")
else:
    print("MISS JS2")

# ─────────────────────────────────────────────────────────────
# JS 3 : 혜택 전체 표시 (split·잘림 제거)
# 원본 전체:
#   '    var benefitMini = c.benefits\n' +
#   '      ? \'<div class="card-benefits-mini">&#x1F381; \' + c.benefits.split("\\xb7")[0].trim() + (...) + \'</div>\'\\n' +
#   '      : "";\n' +
# ─────────────────────────────────────────────────────────────
old_js3 = bytes.fromhex(
    '202020207661722062656e656669744d696e69203d20632e62656e65666974735c6e27202b0a'
    '272020202020203f205c273c64697620636c6173733d22636172642d62656e65666974732d6d696e69223e26237831463338313b205c27202b20'
    '632e62656e65666974732e73706c697428225c5c78623722295b305d2e7472696d2829202b20'
    '28632e62656e65666974732e696e6465784f6628225c5c7862372229203e3d2030203f2022205c5c7862375c5c7862375c5c78623722203a20222229202b20'
    '5c273c2f6469763e5c275c6e27202b0a272020202020203a2022223b5c6e27202b'
)
new_js3 = (
    b"    var benefitMini = c.benefits\\n' +\n"
    b"'      ? \\'"
    b'<div class="card-benefits-mini">&#x1F381; '
    b"\\' + c.benefits + \\'"
    b"</div>"
    b"\\';\\n' +\n"
    b"'      : \"\";\\n' +"
)
if old_js3 in data:
    data = data.replace(old_js3, new_js3, 1); n+=1; print("OK JS3 benefits full display")
else:
    print("MISS JS3 — trying fallback")
    # fallback: 핵심 부분만 교체
    old_j3b = bytes.fromhex(
        '632e62656e65666974732e73706c697428225c5c78623722295b305d2e7472696d2829202b20'
        '28632e62656e65666974732e696e6465784f6628225c5c7862372229203e3d2030203f2022205c5c7862375c5c7862375c5c78623722203a20222229202b20'
        '5c273c2f6469763e5c27'
    )
    new_j3b = b"c.benefits + \\'</div>\\'"
    if old_j3b in data:
        data = data.replace(old_j3b, new_j3b, 1); n+=1; print("OK JS3(fallback)")
    else:
        print("MISS JS3 fallback too")

# ─────────────────────────────────────────────────────────────
# JS 4 : card-footer applyBtn 제거
# ─────────────────────────────────────────────────────────────
old_js4 = bytes.fromhex(
    '6173733d22636172642d666f6f746572223e'
    '5c27202b20646c4261646765202b206170706c7942746e202b20'
    '5c273c2f6469763e5c27202b5c6e27202b'
)
new_js4 = bytes.fromhex(
    '6173733d22636172642d666f6f746572223e'
    '5c27202b20646c4261646765202b20'
    '5c273c2f6469763e5c27202b5c6e27202b'
)
if old_js4 in data:
    data = data.replace(old_js4, new_js4, 1); n+=1; print("OK JS4 footer applyBtn removed")
else:
    print("MISS JS4")

print(f"\n총 {n}/9 교체")

with open('src/pages/main.ts', 'wb') as f:
    f.write(data)
print("저장 완료")
