import { createServer } from 'http'
import { readFileSync } from 'fs'
import { createRequire } from 'module'

// .env.local 수동 로드
const envContent = readFileSync('/home/user/webapp/.env.local', 'utf8')
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=')
  if (k && v.length) process.env[k.trim()] = v.join('=').trim()
})

// ts-node/register로 api/index.ts 로드
const { register } = await import('ts-node')
register({ project: '/home/user/webapp/tsconfig.json', transpileOnly: true })

const { default: handler } = await import('/home/user/webapp/api/index.ts')

const server = createServer(async (req, res) => {
  const mockReq = Object.assign(req, {
    headers: req.headers,
    method: req.method,
    url: req.url,
    on: req.on.bind(req)
  })
  const mockRes = {
    _headers: {},
    status(code) { res.statusCode = code; return this },
    setHeader(k, v) { res.setHeader(k, v); return this },
    end(buf) { res.end(buf) }
  }
  await handler(mockReq, mockRes)
})

server.listen(3000, '0.0.0.0', () => {
  console.log('Test server running on port 3000')
})
