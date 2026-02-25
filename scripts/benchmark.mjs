import { spawn } from 'child_process'
import {
  readFileSync,
  readdirSync,
  statSync,
  mkdirSync,
  writeFileSync,
} from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { request as httpsRequest } from 'https'
import { request as httpRequest } from 'http'
import { performance } from 'perf_hooks'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const resultsDir = resolve(root, 'benchmark-results')

// --- ユーティリティ ---

const log = (msg) => console.log(`\x1b[36m[benchmark]\x1b[0m ${msg}`)
const error = (msg) => console.error(`\x1b[31m[benchmark]\x1b[0m ${msg}`)

const getTimestamp = () => {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
}

const getDirectorySizeBreakdown = (dirPath) => {
  const breakdown = { js: 0, css: 0, html: 0, other: 0, total: 0 }
  const entries = readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)
    if (entry.isDirectory()) {
      const sub = getDirectorySizeBreakdown(fullPath)
      for (const key of Object.keys(breakdown)) breakdown[key] += sub[key]
    } else {
      const size = statSync(fullPath).size
      breakdown.total += size
      if (entry.name.endsWith('.js')) breakdown.js += size
      else if (entry.name.endsWith('.css')) breakdown.css += size
      else if (entry.name.endsWith('.html')) breakdown.html += size
      else breakdown.other += size
    }
  }
  return breakdown
}

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatMs = (ms) => {
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

const runCommand = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd: root,
      stdio: options.stdio ?? 'inherit',
      ...options,
    })
    proc.on('close', (code) => {
      if (code !== 0) reject(new Error(`${command} exited with code ${code}`))
      else resolve()
    })
    proc.on('error', reject)
  })

const detectFramework = () => {
  try {
    const pkg = JSON.parse(
      readFileSync(resolve(root, 'package.json'), 'utf-8'),
    )
    if (pkg.dependencies?.vinext) return 'vinext'
    return 'next'
  } catch {
    return 'unknown'
  }
}

// --- 計測: ビルド ---

const benchmarkBuild = async () => {
  log('ビルド計測を開始...')
  const outDir = resolve(root, 'out')

  const start = performance.now()
  await runCommand('npm', ['run', 'build'])
  const duration = performance.now() - start

  let breakdown = { js: 0, css: 0, html: 0, other: 0, total: 0 }
  try {
    breakdown = getDirectorySizeBreakdown(outDir)
  } catch {
    error('out/ ディレクトリが見つかりません')
  }

  const result = {
    duration_ms: Math.round(duration),
    output_size_bytes: breakdown.total,
    size_breakdown: {
      js_bytes: breakdown.js,
      css_bytes: breakdown.css,
      html_bytes: breakdown.html,
      other_bytes: breakdown.other,
    },
  }

  log(`ビルド時間: ${formatMs(duration)}`)
  log(`出力サイズ: ${formatBytes(breakdown.total)}`)
  log(`  JS:    ${formatBytes(breakdown.js)}`)
  log(`  CSS:   ${formatBytes(breakdown.css)}`)
  log(`  HTML:  ${formatBytes(breakdown.html)}`)
  log(`  Other: ${formatBytes(breakdown.other)}`)

  return result
}

// --- 計測: dev サーバー起動 ---

const benchmarkDev = async () => {
  log('dev サーバー起動時間を計測...')

  return new Promise((resolve, reject) => {
    const start = performance.now()
    const proc = spawn('npm', ['run', 'dev'], {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let resolved = false
    const timeout = setTimeout(() => {
      proc.kill()
      reject(new Error('dev サーバーが60秒以内に起動しませんでした'))
    }, 60_000)

    const onReady = () => {
      if (resolved) return
      resolved = true
      const startupMs = performance.now() - start
      clearTimeout(timeout)
      proc.kill()
      log(`dev 起動時間: ${formatMs(startupMs)}`)
      resolve({ startup_ms: Math.round(startupMs) })
    }

    proc.stdout.on('data', (data) => {
      // Next.js: "Ready in" / Vinext: "ready" などの出力を検知
      if (/ready/i.test(data.toString())) onReady()
    })

    proc.stderr.on('data', (data) => {
      if (/ready/i.test(data.toString())) onReady()
    })

    proc.on('error', (err) => {
      clearTimeout(timeout)
      reject(err)
    })
  })
}

// --- 計測: TTFB ---

const measureTTFB = (url) =>
  new Promise((resolve, reject) => {
    const reqFn = url.startsWith('https') ? httpsRequest : httpRequest
    const start = performance.now()

    const req = reqFn(url, (res) => {
      const ttfb = performance.now() - start
      res.on('data', () => {})
      res.on('end', () => resolve(ttfb))
    })

    req.on('error', reject)
    req.setTimeout(10_000, () => {
      req.destroy(new Error('TTFB 計測がタイムアウトしました'))
    })
    req.end()
  })

const benchmarkTTFB = async (url, runs = 5) => {
  if (!url) {
    error('URL を指定してください: npm run benchmark ttfb <URL>')
    process.exit(1)
  }

  log(`TTFB 計測: ${url} (${runs} 回実行)`)
  const results = []

  for (let i = 0; i < runs; i++) {
    const ttfb = await measureTTFB(url)
    results.push(Math.round(ttfb))
    log(`  Run ${i + 1}: ${formatMs(ttfb)}`)
  }

  const result = {
    url,
    runs,
    median_ms: median(results),
    min_ms: Math.min(...results),
    max_ms: Math.max(...results),
  }

  log(`中央値: ${formatMs(result.median_ms)}`)

  return result
}

// --- 結果の保存 ---

const saveResults = (results) => {
  mkdirSync(resultsDir, { recursive: true })
  const filename = `${getTimestamp()}.json`
  const filepath = resolve(resultsDir, filename)
  writeFileSync(filepath, JSON.stringify(results, null, 2) + '\n')
  log(`結果を保存: ${filepath}`)
}

// --- メイン ---

const main = async () => {
  const [subcommand, ...args] = process.argv.slice(2)

  if (!subcommand || subcommand === '--help') {
    console.log(`
使い方:
  node scripts/benchmark.mjs build       ビルド時間 + 出力サイズ計測
  node scripts/benchmark.mjs dev         dev サーバー起動時間計測
  node scripts/benchmark.mjs ttfb <URL>  TTFB 計測（複数回実行して中央値）
  node scripts/benchmark.mjs all <URL>   build + dev + ttfb を一括実行
`)
    return
  }

  const nodeVersion = process.version
  const framework = detectFramework()

  const results = {
    timestamp: new Date().toISOString(),
    framework,
    node: nodeVersion,
  }

  switch (subcommand) {
    case 'build':
      results.build = await benchmarkBuild()
      break

    case 'dev':
      results.dev = await benchmarkDev()
      break

    case 'ttfb':
      results.ttfb = await benchmarkTTFB(args[0])
      break

    case 'all': {
      results.build = await benchmarkBuild()
      results.dev = await benchmarkDev()
      if (args[0]) {
        results.ttfb = await benchmarkTTFB(args[0])
      } else {
        log('URL が指定されていないため TTFB 計測をスキップ')
      }
      break
    }

    default:
      error(`不明なサブコマンド: ${subcommand}`)
      process.exit(1)
  }

  saveResults(results)
  console.log('\n' + JSON.stringify(results, null, 2))
}

main().catch((err) => {
  error(err.message)
  process.exit(1)
})
