with open('/home/user/webapp/src/pages/adminDashboard.ts', 'rb') as f:
    lines = f.readlines()

changed = 0

# 596번 (idx 595): rescheduleApp pill
i = 595
old = lines[i]
needle_pd = b"JSON.stringify(a.preferred_dates||'')"
rep_pd    = b"JSON.stringify(a.preferred_dates||'').replace(/\"/g,'&quot;')"
needle_sd = b"JSON.stringify(a.scheduled_date||'')"
rep_sd    = b"JSON.stringify(a.scheduled_date||'').replace(/\"/g,'&quot;')"
if needle_pd in old and needle_sd in old:
    lines[i] = old.replace(needle_pd, rep_pd).replace(needle_sd, rep_sd)
    changed += 1
    print('596 rescheduleApp pill ✅')
else:
    print(f'596 - pd:{needle_pd in old} sd:{needle_sd in old}')

# 597번 (idx 596): approveWithDate pill
i = 596
old = lines[i]
if needle_pd in old:
    lines[i] = old.replace(needle_pd, rep_pd)
    changed += 1
    print('597 approveWithDate pill ✅')
else:
    print(f'597 - pd:{needle_pd in old}')

with open('/home/user/webapp/src/pages/adminDashboard.ts', 'wb') as f:
    f.writelines(lines)

print(f'\n총 {changed}/2 완료')
