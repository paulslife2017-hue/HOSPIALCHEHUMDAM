#!/usr/bin/env python3
"""main.ts CSS + JS 수정 스크립트 (hex 기반 정밀 교체)"""

with open('src/pages/main.ts', 'rb') as f:
    data = f.read()

changes = 0

# ══════════════════════════════════════════════════════════════
# CSS 변경 1: 모바일 이미지 108px → 90px
# ══════════════════════════════════════════════════════════════
old = b'camp-img-wrap{position:relative;flex-shrink:0;width:108px;height:108px;background:#ede9e4;overflow:hidden;}'
new = b'camp-img-wrap{position:relative;flex-shrink:0;width:90px;height:90px;background:#ede9e4;overflow:hidden;}'
if old in data:
    data = data.replace(old, new, 1); changes += 1; print("✅ CSS1: 모바일 이미지 108→90px")
else:
    print("❌ CSS1: 108px 패턴 없음")

# ══════════════════════════════════════════════════════════════
# CSS 변경 2: benefits white-space:nowrap → normal
# ══════════════════════════════════════════════════════════════
old = b'card-benefits-mini{font-size:10.5px;color:#78350f;background:#fffbef;border:1px solid #f0d88a;border-radius:7px;padding:3px 7px;\\n' + b"'" + b'      overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}'
new = b'card-benefits-mini{font-size:10px;color:#78350f;background:#fffbef;border:1px solid #f0d88a;border-radius:7px;padding:4px 8px;white-space:normal;line-height:1.5;}'
if old in data:
    data = data.replace(old, new, 1); changes += 1; print("✅ CSS2: benefits nowrap→normal")
else:
    # 대안 패턴
    old2 = b'card-benefits-mini{font-size:10.5px;color:#78350f;background:#fffbef;border:1px solid #f0d88a;border-radius:7px;padding:3px 7px;'
    if old2 in data:
        idx = data.find(old2)
        # 이 줄 끝(white-space:nowrap;} 포함)까지 교체
        end_marker = b'white-space:nowrap;}'
        end_idx = data.find(end_marker, idx)
        if end_idx >= 0:
            old_full = data[idx:end_idx + len(end_marker)]
            new_full = b'card-benefits-mini{font-size:10px;color:#78350f;background:#fffbef;border:1px solid #f0d88a;border-radius:7px;padding:4px 8px;white-space:normal;line-height:1.5;}'
            data = data.replace(old_full, new_full, 1); changes += 1; print("✅ CSS2(alt): benefits nowrap→normal")
        else:
            print("❌ CSS2: end_marker 없음")
    else:
        print("❌ CSS2: 패턴 없음")

# ══════════════════════════════════════════════════════════════
# CSS 변경 3: PC height:400px 제거 + 이미지 190→160px
# ══════════════════════════════════════════════════════════════
old = b'camp-card{flex-direction:column;border-radius:20px;height:400px;}'
new = b'camp-card{flex-direction:column;border-radius:18px;}'
if old in data:
    data = data.replace(old, new, 1); changes += 1; print("✅ CSS3: PC height:400px 제거")
else:
    print("❌ CSS3: height:400px 패턴 없음")

old = b'camp-img-wrap{width:100%;height:190px;flex-shrink:0;}'
new = b'camp-img-wrap{width:100%;height:160px;flex-shrink:0;}'
if old in data:
    data = data.replace(old, new, 1); changes += 1; print("✅ CSS4: PC 이미지 190→160px")
else:
    print("❌ CSS4: 190px 패턴 없음")

# ══════════════════════════════════════════════════════════════
# CSS 변경 4: PC benefits line-clamp 제거
# ══════════════════════════════════════════════════════════════
old = (b"      .card-benefits-mini{font-size:11px;padding:5px 9px;\\n' +\n"
       b"'        white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}\\n' +\n"
       b"'      .card-footer{padding-top:8px;border-top:1px solid #f0ede8;}")
new = (b"      .card-benefits-mini{font-size:11px;padding:5px 9px;\\n' +\n"
       b"'        white-space:normal;line-height:1.5;}")
if old in data:
    data = data.replace(old, new, 1); changes += 1; print("✅ CSS5: PC line-clamp 제거")
else:
    # 단순 패턴
    old2 = b'-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}'
    if old2 in data:
        idx = data.find(old2)
        # .card-benefits-mini{... 시작점 찾기
        start = data.rfind(b'.card-benefits-mini', 0, idx)
        old_full = data[start:idx + len(old2)]
        new_full = b'.card-benefits-mini{font-size:11px;padding:5px 9px;\\n\' +\n\'        white-space:normal;line-height:1.5;}'
        data = data.replace(old_full, new_full, 1); changes += 1; print("✅ CSS5(alt): PC line-clamp 제거")
    else:
        print("❌ CSS5: line-clamp 패턴 없음")

# ══════════════════════════════════════════════════════════════
# JS 변경 1: Open now → 초록 pill 뱃지
# old hex: 2020202076617220646c4261646765203d205c273c7370616e207374796c653d22666f6e742d73697a653a313270783b636f6c6f723a233232633535653b666f6e742d7765696768743a353030223e4f70656e206e6f773c2f7370616e3e5c273b5c6e27202b0a27
# ══════════════════════════════════════════════════════════════
old_js1 = bytes.fromhex(
    '2020202076617220646c4261646765203d205c27'
    '3c7370616e207374796c653d22666f6e742d73697a653a313270783b636f6c6f723a233232633535653b666f6e742d7765696768743a353030223e'
    '4f70656e206e6f773c2f7370616e3e'
    '5c273b5c6e27202b0a27'
)

# 새로운 pill HTML - TS 소스에서의 escape 형식 유지: \\'...\\'
pill_html = b'<span style="display:inline-flex;align-items:center;gap:4px;background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a;font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;"><span style="width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block;flex-shrink:0;"></span>Open now</span>'

# 원본 패턴: '    var dlBadge = \\'...\\';\n' +
# 즉 실제 파일: b"    var dlBadge = \\'...\\';\\n' +\n'"
# TS에서 JS 문자열은 \\'로 이스케이프됨
new_js1 = b"    var dlBadge = \\'" + pill_html + b"\\';\\n' +\n'"

if old_js1 in data:
    data = data.replace(old_js1, new_js1, 1); changes += 1; print("✅ JS1: Open now pill 교체")
else:
    print("❌ JS1: Open now 패턴 불일치")
    # 디버그
    idx = data.find(b'Open now')
    if idx >= 0:
        print("  현재 Open now 주변:", repr(data[idx-40:idx+20]))

# ══════════════════════════════════════════════════════════════
# JS 변경 2: 주소 한글 필터
# old hex: 0a27202020202020766172207061727473...5c6e27202b0a2720202020202073686f727441646472...5c6e27202b
# ══════════════════════════════════════════════════════════════
old_js2 = bytes.fromhex(
    '0a27202020202020766172207061727473203d20632e706c6163655f616464726573732e73706c697428222c22293b'
    '5c6e27202b0a27'
    '202020202020'
    '73686f727441646472203d2070617274732e736c696365282d33292e6a6f696e28222c22292e7472696d28293b'
    '5c6e27202b'
)

# 새로운 JS - engParts 필터 추가 (\\n' + 형식 유지)
# 한글 유니코드 범위: \uAC00-\uD7A3 (가-힣), \u3131-\u314E (ㄱ-ㅎ)
new_js2 = (
    b"\n'      var parts = c.place_address.split(\",\");\\n' +\n'"
    b"      var engParts = parts.filter(function(p){ return !/[\\uAC00-\\uD7A3\\u3131-\\u314E]/.test(p); });\\n' +\n'"
    b"      shortAddr = (engParts.length ? engParts : parts).slice(-3).join(\",\").trim();\\n' +"
)

if old_js2 in data:
    data = data.replace(old_js2, new_js2, 1); changes += 1; print("✅ JS2: 주소 한글 필터 교체")
else:
    print("❌ JS2: shortAddr 패턴 불일치")

# ══════════════════════════════════════════════════════════════
# JS 변경 3: 혜택 전체 표시 (split 제거)
# old hex: 272020202020203f205c273c64697620636c6173733d22636172642d62656e65666974732d6d696e69223e26237831463338313b...
# ══════════════════════════════════════════════════════════════
old_js3 = bytes.fromhex(
    '272020202020203f205c27'
    '3c64697620636c6173733d22636172642d62656e65666974732d6d696e69223e26237831463338313b20'
    '5c27202b20632e62656e65666974732e73706c697428225c5c78623722295b305d2e7472696d2829202b20'
    '2863'  # (c
    '2e62656e65666974732e696e6465784f6628225c5c7862372229203e3d2030203f2022205c5c7862375c5c7862375c5c78623722203a20222229202b20'
    '5c273c2f6469763e5c275c6e27202b'
)

# 새로운 JS: benefits 전체 표시, ·(xb7) 그대로 유지
new_js3 = (
    b"      ? \\'"
    b'<div class="card-benefits-mini">&#x1F381; '
    b"\\' + c.benefits + \\'"
    b"</div>\\'"
    b"\\n' +"
)

if old_js3 in data:
    data = data.replace(old_js3, new_js3, 1); changes += 1; print("✅ JS3: 혜택 전체 표시 교체")
else:
    print("❌ JS3: benefits.split 패턴 불일치")
    idx = data.find(b'benefits.split')
    if idx >= 0:
        print("  현재:", repr(data[idx-40:idx+80]))

# ══════════════════════════════════════════════════════════════
# JS 변경 4: card-footer applyBtn 제거
# old hex: 6173733d22636172642d666f6f746572223e5c27202b20646c4261646765202b206170706c7942746e202b205c273c2f6469763e5c27202b5c6e27
# ══════════════════════════════════════════════════════════════
old_js4 = bytes.fromhex(
    '6173733d22636172642d666f6f746572223e'
    '5c27202b20646c4261646765202b206170706c7942746e202b20'
    '5c273c2f6469763e5c27202b5c6e27'
)
new_js4 = bytes.fromhex(
    '6173733d22636172642d666f6f746572223e'
    '5c27202b20646c4261646765202b20'
    '5c273c2f6469763e5c27202b5c6e27'
)

if old_js4 in data:
    data = data.replace(old_js4, new_js4, 1); changes += 1; print("✅ JS4: card-footer applyBtn 제거")
else:
    print("❌ JS4: card-footer 패턴 불일치")

print(f"\n총 {changes}/8 항목 교체 완료")

with open('src/pages/main.ts', 'wb') as f:
    f.write(data)
print("파일 저장 완료")
