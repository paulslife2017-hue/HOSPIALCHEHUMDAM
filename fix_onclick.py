with open('/home/user/webapp/src/pages/adminDashboard.ts', 'rb') as f:
    data = f.read()

# 실제 파일에서 정확한 바이트 먼저 출력
lines = data.split(b'\n')
for i, line in enumerate(lines):
    if b'approveWithDate(' in line and b'JSON.stringify' in line and b'status' in line:
        print(f'Line {i+1}: {repr(line[:200])}')
    if b'rescheduleApp(' in line and b'JSON.stringify' in line and b'a.id' in line and b'onclick' in line:
        print(f'Line {i+1}: {repr(line[:200])}')
    if b'approveWithDatePreselect' in line and b'JSON.stringify' in line:
        print(f'Line {i+1}: {repr(line[:250])}')
