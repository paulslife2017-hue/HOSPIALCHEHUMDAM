with open('/home/user/webapp/src/pages/adminDashboard.ts', 'rb') as f:
    lines = f.readlines()

changed = 0

# 라인 인덱스(0-based)로 직접 수정
# 934번 (idx 933): rescheduleApp onclickFn
i = 933
if b'rescheduleApp' in lines[i] and b'appModal' in lines[i] and b'JSON.stringify' in lines[i]:
    old = lines[i]
    new = old.replace(
        b"JSON.stringify(a.preferred_dates||'')}",
        b"JSON.stringify(a.preferred_dates||'').replace(/\\\"/g,'&quot;')}"
    ).replace(
        b"JSON.stringify(a.scheduled_date||'')}",
        b"JSON.stringify(a.scheduled_date||'').replace(/\\\"/g,'&quot;')}"
    )
    lines[i] = new
    changed += 1
    print(f'934 reschedule onclickFn: {"✅" if old != new else "변경없음"}')
else:
    print(f'934 조건 불일치: {repr(lines[i][:80])}')

# 935번 (idx 934): approveWithDate onclickFn
i = 934
if b'approveWithDate' in lines[i] and b'appModal' in lines[i] and b'JSON.stringify' in lines[i]:
    old = lines[i]
    new = old.replace(
        b"JSON.stringify(a.preferred_dates||'')}",
        b"JSON.stringify(a.preferred_dates||'').replace(/\\\"/g,'&quot;')}"
    )
    lines[i] = new
    changed += 1
    print(f'935 approve onclickFn: {"✅" if old != new else "변경없음"}')
else:
    print(f'935 조건 불일치: {repr(lines[i][:80])}')

# 1018번 (idx 1017): openAppDetail Approve 버튼
i = 1017
if b'approveWithDate' in lines[i] and b'appModal' in lines[i] and b'JSON.stringify' in lines[i]:
    old = lines[i]
    new = old.replace(
        b"JSON.stringify(a.preferred_dates||'\\'')}",
        b"JSON.stringify(a.preferred_dates||'\\'').replace(/\\\\\"/g,'&quot;')}"
    )
    lines[i] = new
    changed += 1
    print(f'1018 Approve btn: {"✅" if old != new else "변경없음"}')
else:
    print(f'1018 조건 불일치: {repr(lines[i][:100])}')

# 1019번 (idx 1018): openAppDetail 일정수정 버튼
i = 1018
if b'rescheduleApp' in lines[i] and b'appModal' in lines[i] and b'JSON.stringify' in lines[i]:
    old = lines[i]
    new = old.replace(
        b"JSON.stringify(a.preferred_dates||'\\'')}",
        b"JSON.stringify(a.preferred_dates||'\\'').replace(/\\\\\"/g,'&quot;')}"
    ).replace(
        b"JSON.stringify(a.scheduled_date||'\\'')}",
        b"JSON.stringify(a.scheduled_date||'\\'').replace(/\\\\\"/g,'&quot;')}"
    )
    lines[i] = new
    changed += 1
    print(f'1019 Reschedule btn: {"✅" if old != new else "변경없음"}')
else:
    print(f'1019 조건 불일치: {repr(lines[i][:100])}')

with open('/home/user/webapp/src/pages/adminDashboard.ts', 'wb') as f:
    f.writelines(lines)

print(f'\n총 {changed}/4 완료')
