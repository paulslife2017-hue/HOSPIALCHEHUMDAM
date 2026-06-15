#!/usr/bin/env python3
import json, urllib.request, sys

TURSO_URL   = "https://seoul-beauty-trip-werwe.aws-ap-northeast-1.turso.io"
TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODE0MjAzNzcsImlkIjoiMDE5ZWM0ZWQtYTYwMS03NjA5LTljYzQtOTYzZTVhOWUzM2U2IiwicmlkIjoiMDIwYWQ5NWEtZDFlMC00ZTVmLWIzNDgtMjFlMmY5NWMxMDk5In0.uVaG_hHWne4wtCeSiQ7cmiC_1gekUyTJdM0BtqpBSYBIKZ8irkbWoin1NQVIWp5m8_Wlg4LCWUtlA3YlqKDoBg"

def query(sql, args=None):
    stmt = {"sql": sql}
    if args:
        stmt["args"] = args
    payload = json.dumps({"requests": [{"type": "execute", "stmt": stmt}]}).encode()
    req = urllib.request.Request(
        f"{TURSO_URL}/v2/pipeline",
        data=payload,
        headers={"Authorization": f"Bearer {TURSO_TOKEN}", "Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        d = json.loads(resp.read())
    res = d["results"][0]
    if res.get("type") == "error":
        raise Exception(res["error"])
    result = res["response"]["result"]
    cols = [c["name"] for c in result["cols"]]
    rows = [{c: v.get("value") for c, v in zip(cols, row)} for row in result["rows"]]
    return rows

# 전체 캠페인 title/id 조회
rows = query("SELECT id, title, place_name, category FROM campaigns")
for r in rows:
    print(f"id={r['id']}  place={r['place_name']}  title={r['title'][:50]}")
