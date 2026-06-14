import { createClient } from '@libsql/client/http'
import { readFileSync } from 'fs'

// .env.local 로드
readFileSync('/home/user/webapp/.env.local','utf8').split('\n').forEach(line => {
  const idx = line.indexOf('=')
  if (idx > 0) process.env[line.slice(0,idx).trim()] = line.slice(idx+1).trim()
})

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
})

// 테스트 더미 캠페인 완전 삭제
await db.execute({ sql: "DELETE FROM campaigns WHERE id IN (3,4,5,6)", args: [] })
console.log('✅ 테스트 캠페인 삭제 완료')

// 남은 캠페인 확인
const r = await db.execute({ sql: "SELECT id, title, place_name, status FROM campaigns ORDER BY id", args: [] })
console.log('\n남은 캠페인:')
r.rows.forEach(row => console.log(' ', JSON.stringify(row)))
