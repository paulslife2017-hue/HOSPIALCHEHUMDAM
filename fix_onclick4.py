with open('/home/user/webapp/src/pages/adminDashboard.ts', 'rb') as f:
    lines = f.readlines()

changed = 0

# 1018번 (idx 1017): JSON.stringify(a.preferred_dates||'')  (single-quote, not escaped)
i = 1017
old = lines[i]
needle = b"JSON.stringify(a.preferred_dates||'')}"
rep    = b"JSON.stringify(a.preferred_dates||'').replace(/\"/g,'&quot;')}"
if needle in old:
    lines[i] = old.replace(needle, rep)
    changed += 1
    print('1018 ✅')
else:
    print(f'1018 needle 없음')

# 1019번 (idx 1018): preferred + scheduled
i = 1018
old = lines[i]
needle_pd = b"JSON.stringify(a.preferred_dates||'')}"
rep_pd    = b"JSON.stringify(a.preferred_dates||'').replace(/\"/g,'&quot;')}"
needle_sd = b"JSON.stringify(a.scheduled_date||'')}"
rep_sd    = b"JSON.stringify(a.scheduled_date||'').replace(/\"/g,'&quot;')}"
if needle_pd in old and needle_sd in old:
    lines[i] = old.replace(needle_pd, rep_pd).replace(needle_sd, rep_sd)
    changed += 1
    print('1019 ✅')
else:
    print(f'1019 - pd: {needle_pd in old}, sd: {needle_sd in old}')
    idx = old.find(b'JSON.stringify')
    print('1019 context:', repr(old[idx:idx+80]))

with open('/home/user/webapp/src/pages/adminDashboard.ts', 'wb') as f:
    f.writelines(lines)

print(f'\n총 {changed}/2 완료')
