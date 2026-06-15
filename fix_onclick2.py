with open('/home/user/webapp/src/pages/adminDashboard.ts', 'rb') as f:
    data = f.read()

changed = 0

# ── 652번: loadApps 승인 버튼 ──────────────────────────────────
# 원본: onclick="approveWithDate(\${a.id},\${JSON.stringify(a.preferred_dates||'')})\"
# 수정: JSON.stringify(...).replace(/\"/g,'&quot;')
old = (b'onclick="approveWithDate(\\${a.id},'
       b"\\${JSON.stringify(a.preferred_dates||'')})\""
       b' class="w-7 h-7 rounded-lg bg-green-50')
new = (b'onclick="approveWithDate(\\${a.id},'
       b"\\${JSON.stringify(a.preferred_dates||'').replace(/\\\"/g,'&quot;')})\""
       b' class="w-7 h-7 rounded-lg bg-green-50')
if old in data:
    data = data.replace(old, new); changed += 1; print('652 loadApps 승인 ✅')
else:
    print('652 loadApps 승인 ❌')

# ── 653번: loadApps 일정수정 버튼 ──────────────────────────────
old = (b'onclick="rescheduleApp(\\${a.id},'
       b"\\${JSON.stringify(a.preferred_dates||'')},"
       b"\\${JSON.stringify(a.scheduled_date||'')})\""
       b' class="w-7 h-7 rounded-lg bg-amb')
new = (b'onclick="rescheduleApp(\\${a.id},'
       b"\\${JSON.stringify(a.preferred_dates||'').replace(/\\\"/g,'&quot;')},"
       b"\\${JSON.stringify(a.scheduled_date||'').replace(/\\\"/g,'&quot;')})\""
       b' class="w-7 h-7 rounded-lg bg-amb')
if old in data:
    data = data.replace(old, new); changed += 1; print('653 loadApps 일정수정 ✅')
else:
    print('653 loadApps 일정수정 ❌')

# ── 1018번: openAppDetail 승인 버튼 ────────────────────────────
old = (b"onclick=\"approveWithDate(\\${a.id},\\${JSON.stringify(a.preferred_dates||'')});"
       b"document.getElementById(\\'appModal\\').classList.remove(\\'open\\')\\\"`")
new = (b"onclick=\"approveWithDate(\\${a.id},\\${JSON.stringify(a.preferred_dates||'').replace(/\\\\\"/g,'&quot;')});"
       b"document.getElementById(\\'appModal\\').classList.remove(\\'open\\')\\\"`")
if old in data:
    data = data.replace(old, new); changed += 1; print('1018 openAppDetail 승인 ✅')
else:
    print('1018 openAppDetail 승인 ❌')

# ── 1019번: openAppDetail 일정수정 버튼 ────────────────────────
old = (b"onclick=\"rescheduleApp(\\${a.id},\\${JSON.stringify(a.preferred_dates||'')},"
       b"\\${JSON.stringify(a.scheduled_date||'')});"
       b"document.getElementById(\\'appModal\\').classList.remove(\\'open\\')\\\"`")
new = (b"onclick=\"rescheduleApp(\\${a.id},\\${JSON.stringify(a.preferred_dates||'').replace(/\\\\\"/g,'&quot;')},"
       b"\\${JSON.stringify(a.scheduled_date||'').replace(/\\\\\"/g,'&quot;')});"
       b"document.getElementById(\\'appModal\\').classList.remove(\\'open\\')\\\"`")
if old in data:
    data = data.replace(old, new); changed += 1; print('1019 openAppDetail 일정수정 ✅')
else:
    print('1019 openAppDetail 일정수정 ❌')

# ── 1613번: renderCal 일정수정 버튼 ────────────────────────────
old = (b"? '<button onclick=\"rescheduleApp(' + a.id + ',' + JSON.stringify(a.preferred_dates||'') + ',' + JSON.stringify(a.scheduled_date||'') + ')\"")
new = (b"? '<button onclick=\"rescheduleApp(' + a.id + ',' + JSON.stringify(a.preferred_dates||'').replace(/\"/g,'&quot;') + ',' + JSON.stringify(a.scheduled_date||'').replace(/\"/g,'&quot;') + ')\"")
if old in data:
    data = data.replace(old, new); changed += 1; print('1613 renderCal 일정수정 ✅')
else:
    print('1613 renderCal 일정수정 ❌')

# ── 1614번: renderCal 승인 버튼 ────────────────────────────────
old = (b": '<button onclick=\"approveWithDatePreselect(' + a.id + ',' + JSON.stringify(a.preferred_dates||'') + ',' + JSON.stringify(timeInfo||'') + ')\"")
new = (b": '<button onclick=\"approveWithDatePreselect(' + a.id + ',' + JSON.stringify(a.preferred_dates||'').replace(/\"/g,'&quot;') + ',' + JSON.stringify(timeInfo||'').replace(/\"/g,'&quot;') + ')\"")
if old in data:
    data = data.replace(old, new); changed += 1; print('1614 renderCal 승인 ✅')
else:
    print('1614 renderCal 승인 ❌')

with open('/home/user/webapp/src/pages/adminDashboard.ts', 'wb') as f:
    f.write(data)

print(f'\n총 {changed}/6 완료')
