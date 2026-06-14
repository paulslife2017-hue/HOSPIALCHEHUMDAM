import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'src/index.tsx',
      output: {
        format: 'esm',
        entryFileNames: 'index.js'
      },
      external: [
        '@libsql/client',
        '@hono/node-server',
        'dotenv',
        'node:*',
        'path',
        'fs',
        'crypto',
        'os',
        'stream',
        'buffer',
        'events',
        'util',
        'url',
        'http',
        'https',
        'net',
        'tls',
        'zlib'
      ]
    },
    ssr: true,
    target: 'node18',
    minify: false
  }
})
