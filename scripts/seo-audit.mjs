#!/usr/bin/env node
/**
 * SEO self-check for aibodyeditor.net (see /seo-checklist.md).
 *
 * Crawls a running instance and writes a Markdown report:
 *   node scripts/seo-audit.mjs [baseUrl] [outFile]
 *   node scripts/seo-audit.mjs http://localhost:7001 seo-audit-report.md
 *
 * Content pages = the sitemap whitelist. Checks per page: status, unique
 * title / description / canonical / h1, robots, no meta keywords, JSON-LD
 * types, internal links in <main> (+ keyword anchors), footer site nav.
 * Also checks noindex pages, 404 status codes and canonical redirects.
 * Exit code 1 when any check fails.
 */
import fs from 'node:fs'

const BASE = (process.argv[2] || 'http://localhost:7001').replace(/\/$/, '')
const OUT = process.argv[3] || 'seo-audit-report.md'
const SITE = 'https://aibodyeditor.net'

/** Core keyword per content page: the only valid anchor text for links to it. */
const KEYWORDS = {
  '/': 'ai body editor',
  '/body-editor': 'body editor',
  '/skinny-filter': 'skinny filter',
  '/breast-expansion': 'ai breast expansion',
  '/ai-muscle-generator': 'ai muscle generator',
  '/leg-lengthener': 'leg lengthener',
  '/waist-slimmer': 'waist slimmer',
}

/** Required in-body links: page -> paths it must link to from <main>. */
const REQUIRED_LINKS = {
  '/': ['/body-editor', '/skinny-filter', '/breast-expansion', '/ai-muscle-generator', '/leg-lengthener', '/waist-slimmer'],
  '/body-editor': ['/', '/skinny-filter', '/breast-expansion'],
  '/skinny-filter': ['/', '/body-editor'],
  '/breast-expansion': ['/', '/body-editor'],
  '/ai-muscle-generator': ['/', '/waist-slimmer'],
  '/leg-lengthener': ['/', '/body-editor'],
  '/waist-slimmer': ['/', '/skinny-filter'],
}

const NOINDEX_PAGES = ['/dashboard', '/admin', '/signin', '/signup', '/forgot-password', '/reset-password', '/payment-success', '/payment-cancel']
const NOT_FOUND_PROBES = ['/this-page-does-not-exist', '/virtual-try-on', '/zh-CN', '/de/body-editor', '/body-editor/extra']
const REDIRECT_PROBES = [
  ['/en', '/'],
  ['/en/body-editor', '/body-editor'],
  ['/body-editor/', '/body-editor'],
  ['/skinny-filter/?utm_source=x', '/skinny-filter?utm_source=x'],
]

const decode = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

const all = (html, re) => [...html.matchAll(re)]

async function get(path, init = {}) {
  const res = await fetch(BASE + path, { redirect: 'manual', ...init })
  const body = init.method === 'HEAD' ? '' : await res.text()
  return { status: res.status, headers: res.headers, body }
}

function analyze(path, html) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? ''
  const main = html.match(/<main>([\s\S]*?)<\/main>/)?.[1] ?? ''
  const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? ''
  const header = html.match(/<header[\s\S]*?<\/header>/)?.[0] ?? ''
  const titles = all(head, /<title>([\s\S]*?)<\/title>/g).map((m) => decode(m[1]))
  const descriptions = all(head, /<meta name="description" content="([^"]*)"/g).map((m) => decode(m[1]))
  const canonicals = all(head, /<link rel="canonical" href="([^"]*)"/g).map((m) => m[1])
  const robots = all(head, /<meta name="robots" content="([^"]*)"/g).map((m) => m[1])
  const keywords = all(head, /<meta name="keywords"/g).length
  const h1s = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g).map((m) => decode(m[1]))
  const jsonLd = all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g).map((m) => {
    try {
      return JSON.parse(m[1])['@type']
    } catch {
      return 'INVALID_JSON'
    }
  })
  const links = (scope) =>
    all(scope, /<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)
      .map((m) => ({ href: m[1], anchor: decode(m[2]) }))
      .filter((l) => l.href.startsWith('/'))
  const mainLinks = links(main)
  const contentLinks = mainLinks.filter((l) => !l.href.includes('#') && KEYWORDS[l.href.split('?')[0]] !== undefined)
  const otherLinks = mainLinks.filter((l) => !contentLinks.includes(l))
  const footerLinks = links(footer).filter((l) => !l.href.includes('#'))
  const headerLinks = links(header)
  const words = decode(main.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')).split(' ').filter((w) => /[a-z]/i.test(w)).length
  return { path, titles, descriptions, canonicals, robots, keywords, h1s, jsonLd, contentLinks, otherLinks, footerLinks, headerLinks, words }
}

const issues = []
const issue = (page, msg) => issues.push(`\`${page}\`: ${msg}`)

// ---- sitemap ------------------------------------------------------------
const sitemap = await get('/sitemap.xml')
const sitemapPaths = all(sitemap.body, /<loc>([^<]+)<\/loc>/g).map((m) => {
  const p = m[1].replace(SITE, '')
  return p === '' ? '/' : p
})
const robotsTxt = (await get('/robots.txt')).body

// ---- content pages --------------------------------------------------------
const pages = []
for (const path of sitemapPaths) {
  const res = await get(path)
  const a = analyze(path, res.body)
  a.status = res.status
  a.xRobots = res.headers.get('x-robots-tag')
  pages.push(a)

  const expectedCanonical = path === '/' ? SITE : SITE + path
  if (res.status !== 200) issue(path, `status ${res.status} (sitemap URL must return 200)`)
  if (a.titles.length !== 1) issue(path, `${a.titles.length} <title> tags`)
  if (a.descriptions.length !== 1) issue(path, `${a.descriptions.length} meta descriptions`)
  if (a.canonicals.length !== 1) issue(path, `${a.canonicals.length} canonical tags`)
  else if (a.canonicals[0] !== expectedCanonical) issue(path, `canonical ${a.canonicals[0]} ≠ ${expectedCanonical}`)
  if (a.h1s.length !== 1) issue(path, `${a.h1s.length} <h1> tags`)
  if (a.keywords) issue(path, 'outputs meta keywords')
  if (!a.robots.some((r) => r.startsWith('index'))) issue(path, `robots = ${a.robots.join(', ') || 'missing'}`)
  if (a.xRobots) issue(path, `X-Robots-Tag: ${a.xRobots} on an indexable page`)

  const kw = KEYWORDS[path]
  if (kw && !a.titles[0]?.toLowerCase().startsWith(kw)) issue(path, `title does not start with "${kw}"`)
  if (kw && a.h1s[0]?.toLowerCase() !== kw) issue(path, `h1 "${a.h1s[0]}" ≠ core keyword "${kw}"`)

  for (const link of a.contentLinks) {
    const target = link.href.split('?')[0]
    if (link.anchor.toLowerCase() !== KEYWORDS[target]) issue(path, `link to ${target} uses anchor "${link.anchor}" (expected "${KEYWORDS[target]}")`)
  }
  for (const required of REQUIRED_LINKS[path] ?? []) {
    if (!a.contentLinks.some((l) => l.href === required)) issue(path, `no in-body link to ${required}`)
  }
  for (const target of sitemapPaths) {
    if (!a.footerLinks.some((l) => l.href === target)) issue(path, `footer site nav missing ${target}`)
  }

  // Header: links every tool page with its keyword; no non-keyword links to content pages.
  // Legal pages are linked in the footer, not in the Tools menu.
  for (const target of sitemapPaths.filter((p) => p !== '/' && KEYWORDS[p] !== undefined)) {
    if (!a.headerLinks.some((l) => l.href === target)) issue(path, `header nav missing ${target}`)
  }
  for (const link of a.headerLinks) {
    const target = link.href.split(/[?#]/)[0]
    if (KEYWORDS[target] === undefined) continue
    if (link.href.includes('#')) {
      // Non-editor pages legitimately send their edit CTA back to the homepage.
      if (!(KEYWORDS[path] === undefined && link.href === '/#try')) issue(path, `header has cross-page hash link ${link.href} "${link.anchor}"`)
    }
    else if (link.anchor.toLowerCase() !== KEYWORDS[target]) issue(path, `header link to ${target} uses anchor "${link.anchor}"`)
  }
}

// cross-page uniqueness
for (const field of ['titles', 'descriptions', 'canonicals', 'h1s']) {
  const seen = new Map()
  for (const p of pages) {
    const value = p[field][0]
    if (!value) continue
    if (seen.has(value)) issue(p.path, `duplicate ${field.replace(/s$/, '')} with ${seen.get(value)}: "${value}"`)
    else seen.set(value, p.path)
  }
}

// ---- noindex pages ----------------------------------------------------------
const noindexRows = []
for (const path of NOINDEX_PAGES) {
  const res = await get(path)
  const a = analyze(path, res.body)
  const metaNoindex = a.robots.some((r) => r.includes('noindex'))
  const headerNoindex = (res.headers.get('x-robots-tag') || '').includes('noindex')
  const inSitemap = sitemapPaths.includes(path)
  const robotsDisallow = new RegExp(`^Disallow: ${path}$`, 'm').test(robotsTxt)
  noindexRows.push({ path, status: res.status, metaNoindex, headerNoindex, inSitemap, robotsDisallow })
  if (!metaNoindex) issue(path, 'missing <meta name="robots" content="noindex">')
  if (!headerNoindex) issue(path, 'missing X-Robots-Tag: noindex header')
  if (inSitemap) issue(path, 'noindex page is in the sitemap')
}

// ---- 404 + redirects ----------------------------------------------------------
const notFoundRows = []
for (const path of NOT_FOUND_PROBES) {
  const res = await get(path)
  const a = analyze(path, res.body)
  const noindex = a.robots.length > 0 && a.robots.every((r) => r.includes('noindex'))
  notFoundRows.push({ path, status: res.status, noindex, canonical: a.canonicals.length, titles: a.titles.length })
  if (res.status !== 404) issue(path, `expected 404, got ${res.status}`)
  if (!noindex) issue(path, `404 page robots = ${a.robots.join(' | ') || 'missing'} (must be noindex only)`)
  if (a.canonicals.length) issue(path, `404 page outputs canonical ${a.canonicals.join(' ')}`)
  if (a.titles.length !== 1) issue(path, `404 page has ${a.titles.length} <title> tags`)
}
const redirectRows = []
for (const [path, expected] of REDIRECT_PROBES) {
  const res = await get(path)
  const location = (res.headers.get('location') || '').replace(BASE, '')
  redirectRows.push({ path, status: res.status, location })
  if (res.status !== 301 || location !== expected) issue(path, `expected 301 → ${expected}, got ${res.status} → ${location || '-'}`)
}

// ---- report ---------------------------------------------------------------
const yes = (b) => (b ? '✅' : '❌')
const lines = []
lines.push('# SEO 自查报告', '', `- 站点：\`${BASE}\`（canonical 域 \`${SITE}\`）`, `- 时间：${new Date().toISOString()}`, `- 结论：${issues.length ? `❌ ${issues.length} 个问题` : '✅ 全部通过'}`, '')
lines.push('## 1. 内容页（= sitemap 白名单）', '')
lines.push('| 路径 | 状态 | title | h1 | canonical | 正文内链（指向内容页） | footer 导航 | 正文词数 | JSON-LD | 进 sitemap |')
lines.push('|---|---|---|---|---|---|---|---|---|---|')
for (const p of pages) {
  const linkSummary = Object.entries(
    p.contentLinks.reduce((acc, l) => ((acc[`${l.href} "${l.anchor}"`] = (acc[`${l.href} "${l.anchor}"`] || 0) + 1), acc), {}),
  )
    .map(([k, n]) => `${k}×${n}`)
    .join('<br>')
  lines.push(
    `| \`${p.path}\` | ${p.status} | ${p.titles.join(' / ')} | ${p.h1s.join(' / ')} | ${p.canonicals.join(' ')} | **${p.contentLinks.length}**<br>${linkSummary} | ${p.footerLinks.length} 条 | ${p.words} | ${p.jsonLd.join(', ')} | ✅ |`,
  )
}
lines.push('', '### description', '')
for (const p of pages) lines.push(`- \`${p.path}\`（${p.descriptions[0]?.length ?? 0} 字符）：${p.descriptions.join(' / ')}`)
lines.push('', '### 头部导航', '')
for (const p of pages) {
  const h = [...new Set(p.headerLinks.map((l) => `${l.href} "${l.anchor}"`))]
  lines.push(`- \`${p.path}\`：${h.join('，') || '无'}`)
}
lines.push('', '### 其他内链（导航锚点 / CTA，非关键词锚文本，仅供参考）', '')
for (const p of pages) {
  const others = [...new Set(p.otherLinks.map((l) => `${l.href} "${l.anchor}"`))]
  lines.push(`- \`${p.path}\`：${others.length ? others.join('，') : '无'}`)
}
lines.push('', '## 2. noindex 页面', '', '| 路径 | 状态 | meta noindex | X-Robots-Tag | 不在 sitemap | robots.txt Disallow |', '|---|---|---|---|---|---|')
for (const r of noindexRows) lines.push(`| \`${r.path}\` | ${r.status} | ${yes(r.metaNoindex)} | ${yes(r.headerNoindex)} | ${yes(!r.inSitemap)} | ${r.robotsDisallow ? '✅' : '—'} |`)
lines.push('', '## 3. 404', '', '| 路径 | 状态码 | 仅 noindex | 无 canonical | 唯一 title |', '|---|---|---|---|---|')
for (const r of notFoundRows) lines.push(`| \`${r.path}\` | ${r.status} | ${yes(r.noindex)} | ${yes(!r.canonical)} | ${yes(r.titles === 1)} |`)
lines.push('', '## 4. 301 规范化', '', '| 请求 | 状态 | Location |', '|---|---|---|')
for (const r of redirectRows) lines.push(`| \`${r.path}\` | ${r.status} | \`${r.location}\` |`)
lines.push('', '## 5. 问题清单（重复 / 缺失 / 违规）', '')
lines.push(...(issues.length ? issues.map((i) => `- ❌ ${i}`) : ['- 无']))
lines.push('')

const report = lines.join('\n')
fs.writeFileSync(OUT, report)
console.log(report)
process.exit(issues.length ? 1 : 0)
