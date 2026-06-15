with open('src/pages/main.ts', 'rb') as f:
    data = f.read()

changes = 0

# ============================================================
# 1. Open now → 초록 pill 뱃지
# ============================================================
old1 = b'    var dlBadge = \\\\\\'<span style="font-size:12px;color:#22c55e;font-weight:500">Open now</span>\\\\\\';\\\\n\\' +'
new1 = b'    var dlBadge = \\\\\\'<span style="display:inline-flex;align-items:center;gap:4px;background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a;font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;"><span style="width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block;flex-shrink:0;"></span>Open now</span>\\\\\\';\\\\n\\' +'

if old1 in data:
    data = data.replace(old1, new1, 1)
    changes += 1
    print("✅ 1. Open now pill 교체 완료")
else:
    print("❌ 1. Open now 패턴 불일치")
    print("  찾는 패턴:", repr(old1[:60]))

# ============================================================
# 2. 주소 한글 필터
# ============================================================
old2 = b'      var parts = c.place_address.split(",");\\\\n\\' +\n\\'      shortAddr = parts.slice(-3).join(",").trim();\\\\n\\' +'
new2 = b'      var parts = c.place_address.split(",");\\\\n\\' +\n\\'      var engParts = parts.filter(function(p){ return !/[\\\\uAC00-\\\\uD7A3\\\\u3131-\\\\u314E]/.test(p); });\\\\n\\' +\n\\'      shortAddr = (engParts.length ? engParts : parts).slice(-3).join(",").trim();\\\\n\\' +'

if old2 in data:
    data = data.replace(old2, new2, 1)
    changes += 1
    print("✅ 2. 주소 한글 필터 교체 완료")
else:
    print("❌ 2. 주소 한글 필터 패턴 불일치")

# ============================================================
# 3. 혜택 전체 표시 (split 제거)
# ============================================================
old3 = b'      ? \\\\\\'<div class="card-benefits-mini">&#x1F381; \\\\\\' + c.benefits.split("\\\\\\\\xb7")[0].trim() + (c.benefits.indexOf("\\\\\\\\xb7") >= 0 ? " \\\\\\\\xb7\\\\\\\\xb7\\\\\\\\xb7" : "") + \\\\\\'</div>\\\\\\'\\\\n\\' +'
new3 = b'      ? \\\\\\'<div class="card-benefits-mini">&#x1F381; \\\\\\' + c.benefits.replace(/\\\\\\\\xb7/g,"\\xb7") + \\\\\\'</div>\\\\\\'\\\\n\\' +'

if old3 in data:
    data = data.replace(old3, new3, 1)
    changes += 1
    print("✅ 3. 혜택 전체 표시 교체 완료")
else:
    print("❌ 3. 혜택 split 패턴 불일치")

# ============================================================
# 4. card-footer applyBtn 제거
# ============================================================
old4 = b'class="card-footer">\\\\\\' + dlBadge + applyBtn + \\\\\\'</div>\\\\\\' +'
new4 = b'class="card-footer">\\\\\\' + dlBadge + \\\\\\'</div>\\\\\\' +'

if old4 in data:
    data = data.replace(old4, new4, 1)
    changes += 1
    print("✅ 4. card-footer applyBtn 제거 완료")
else:
    print("❌ 4. card-footer 패턴 불일치")

print(f"\n총 {changes}/4 항목 교체 완료")

with open('src/pages/main.ts', 'wb') as f:
    f.write(data)
print("파일 저장 완료")
