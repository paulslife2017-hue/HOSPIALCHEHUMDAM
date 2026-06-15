#!/usr/bin/env python3
import json, urllib.request

TURSO_URL   = "https://seoul-beauty-trip-werwe.aws-ap-northeast-1.turso.io"
TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODE0MjAzNzcsImlkIjoiMDE5ZWM0ZWQtYTYwMS03NjA5LTljYzQtOTYzZTVhOWUzM2U2IiwicmlkIjoiMDIwYWQ5NWEtZDFlMC00ZTVmLWIzNDgtMjFlMmY5NWMxMDk5In0.uVaG_hHWne4wtCeSiQ7cmiC_1gekUyTJdM0BtqpBSYBIKZ8irkbWoin1NQVIWp5m8_Wlg4LCWUtlA3YlqKDoBg"

# 수정할 내용
NEW_DESC = (
    "The Square Dental Clinic is a premier dental clinic in the heart of Seoul's Jongno District. "
    "Specializing in cosmetic and general dentistry, the clinic offers professional teeth whitening, "
    "precision scaling, comprehensive oral examinations, and personalized dental care. "
    "Staffed by experienced dentists, the clinic welcomes international visitors with full English "
    "consultations and a calm, comfortable atmosphere. Whether you are looking for a routine check-up, "
    "a brighter smile, or advanced cosmetic dental treatments, The Square Dental Clinic delivers "
    "results-driven care with a distinctly personal touch."
)

# 주소에서 한글 제거: 'Jong-ro 3-gil, 17, D Tower, Jongno District, Seoul'
NEW_ADDR = "Jong-ro 3-gil 17, D Tower, Jongno District, Seoul, South Korea"

payload = json.dumps({
    "requests": [{
        "type": "execute",
        "stmt": {
            "sql": "UPDATE campaigns SET description=?, place_address=? WHERE id=13",
            "args": [
                {"type": "text", "value": NEW_DESC},
                {"type": "text", "value": NEW_ADDR}
            ]
        }
    }]
}).encode()

req = urllib.request.Request(
    f"{TURSO_URL}/v2/pipeline",
    data=payload,
    headers={"Authorization": f"Bearer {TURSO_TOKEN}", "Content-Type": "application/json"},
    method="POST"
)
with urllib.request.urlopen(req) as resp:
    d = json.loads(resp.read())

res = d["results"][0]
if res.get("type") == "ok":
    affected = res["response"]["result"]["affected_row_count"]
    print(f"✅ UPDATE 성공: {affected}행 수정")
    print(f"   description: 치과 전용으로 수정")
    print(f"   place_address: 한글 제거 → {NEW_ADDR}")
else:
    print("❌ 오류:", res)
