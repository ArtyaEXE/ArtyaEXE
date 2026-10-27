// Draws assets/tech.svg from data/tech.json: node tools/gen-tech.js .
// data/tech.json holds aggregates only (no project names), counted from my own commits across GitHub and GitLab:
// languages by the lines I added, tools by the projects where I made 10+ commits or 3,000+ lines.
const fs = require('fs')
const path = require('path')
const ROOT = process.argv[2] || '.'
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/tech.json'), 'utf8'))

const SANS = "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Cascadia Mono', 'SF Mono', Consolas, Menlo, 'DejaVu Sans Mono', monospace"
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const W = 1200, PAD = 48
const COLORS = { Svelte: '#ff3e00', JavaScript: '#f1e05a', Vue: '#41b883', TypeScript: '#3178c6', CSS: '#a371f7', Other: '#6e7681' }

// Languages: the top five, the rest as Other.
const total = Object.values(data.langLines).reduce((a, b) => a + b, 0)
const sorted = Object.entries(data.langLines).sort((a, b) => b[1] - a[1])
const top = sorted.slice(0, 5)
const rest = sorted.slice(5)
const langs = [...top, ['Other', rest.reduce((a, [, v]) => a + v, 0)]].map(([k, v]) => ({ k, pct: (100 * v) / total }))
const otherNames = rest.slice(0, 5).map(([k]) => k).join(', ')

const barY = 150, barW = W - 2 * PAD, barH = 14
let x = PAD
const segs = langs.map((l, i) => {
  const w = (barW * l.pct) / 100
  const s = `<rect x="${x.toFixed(1)}" y="${barY}" width="${w.toFixed(1)}" height="${barH}" fill="${COLORS[l.k]}"><animate attributeName="width" from="0" to="${w.toFixed(1)}" begin="${(0.15 * i).toFixed(2)}s" dur="0.9s" fill="freeze" calcMode="spline" keySplines=".2 .8 .2 1" keyTimes="0;1"/></rect>`
  x += w
  return s
}).join('')
const slot = barW / langs.length
const legend = langs.map((l, i) => {
  const lx = PAD + i * slot
  return `<circle cx="${lx + 6}" cy="${barY + 44}" r="6" fill="${COLORS[l.k]}"/><text x="${lx + 18}" y="${barY + 49}" class="sans" font-size="15" fill="#e6edf3">${esc(l.k)}</text><text x="${lx + slot - 30}" y="${barY + 49}" class="mono" font-size="14" fill="#7d8590" text-anchor="end">${l.pct.toFixed(1)}%</text>`
}).join('')

// Tools in four groups, each a list with a bar for the number of projects.
const GROUPS = [
  ['Frontend', '#ff7b54', ['Svelte', 'Vue', 'Vite', 'Swiper', 'i18n', 'Pinia', 'Three.js', 'Sass', 'SvelteKit', 'Astro', 'PixiJS']],
  ['Backend & data', '#58a6ff', ['Meteor', 'SQL', 'Node.js', 'PostgreSQL', 'Drizzle', 'MongoDB', 'Hono', 'Fastify', 'Redis', 'WebSocket']],
  ['Telegram & AI', '#39c5cf', ['Telegram Bot API', 'Telegram Mini Apps', 'Claude Code plugins', 'PyTorch', 'NumPy', 'ethers.js']],
  ['Infra & quality', '#bc8cff', ['Docker', 'Docker Compose', 'Vitest', 'GitLab CI', 'GitHub Actions', 'Zod', 'ESLint', 'Prettier', 'Puppeteer']],
]
const max = Math.max(...Object.values(data.techProjects))
const colW = (W - 2 * PAD) / 4
const gy = 262, rowH = 27
const ROWS = 9
let maxRows = 0
const groups = GROUPS.map(([title, color, names], gi) => {
  const gx = PAD + gi * colW
  const items = names.filter(n => data.techProjects[n]).sort((a, b) => data.techProjects[b] - data.techProjects[a]).slice(0, ROWS)
  maxRows = Math.max(maxRows, items.length)
  const rows = items.map((n, i) => {
    const c = data.techProjects[n], y = gy + 40 + i * rowH, bw = 10 + (60 * c) / max
    return `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${(0.6 + gi * 0.12 + i * 0.05).toFixed(2)}s" dur="0.4s" fill="freeze"/>
<text x="${gx}" y="${y}" class="sans" font-size="15" fill="#e6edf3">${esc(n)}</text>
<rect x="${gx + colW - 124}" y="${y - 10}" width="${bw.toFixed(1)}" height="8" rx="4" fill="${color}" fill-opacity=".85"/>
<text x="${gx + colW - 28}" y="${y}" class="mono" font-size="13" fill="#7d8590" text-anchor="end">${c}</text></g>`
  }).join('')
  return `<text x="${gx}" y="${gy}" class="mono" font-size="13" letter-spacing="1.5" fill="${color}">${esc(title.toUpperCase())}</text>
<line x1="${gx}" y1="${gy + 12}" x2="${gx + colW - 28}" y2="${gy + 12}" stroke="#30363d"/>${rows}`
}).join('')

const H = gy + 40 + maxRows * rowH + 46
const commits = Math.floor(data.myCommits / 100) * 100
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="What I ship with: ${langs.map(l => `${l.k} ${l.pct.toFixed(0)}%`).join(', ')}; across ${data.projects} projects and ${commits}+ commits on GitHub and GitLab">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f1319"/><stop offset="1" stop-color="#161b22"/></linearGradient>
  <radialGradient id="glow" cx="0" cy="0" r="1"><stop offset="0" stop-color="#d97757" stop-opacity=".16"/><stop offset=".5" stop-color="#d97757" stop-opacity="0"/></radialGradient>
  <clipPath id="bar"><rect x="${PAD}" y="${barY}" width="${barW}" height="${barH}" rx="7"/></clipPath>
  <style>.sans{font-family:${SANS}}.mono{font-family:${MONO}}</style>
</defs>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="20" fill="url(#bg)" stroke="#30363d"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="20" fill="url(#glow)"/>
<text x="${PAD}" y="66" class="sans" font-size="30" font-weight="800" fill="#f0f6fc">What I ship with</text>
<text x="${PAD}" y="98" class="sans" font-size="16" fill="#9da7b3">${data.projects} projects · ${commits.toLocaleString('en-US')}+ commits · ${data.sources.github} on GitHub, ${data.sources.gitlab} on GitLab · private and commercial work included</text>
<text x="${W - PAD}" y="66" class="mono" font-size="13" fill="#7d8590" text-anchor="end">by lines I wrote</text>
<g clip-path="url(#bar)"><rect x="${PAD}" y="${barY}" width="${barW}" height="${barH}" fill="#21262d"/>${segs}</g>
${legend}
${groups}
<text x="${PAD}" y="${H - 22}" class="sans" font-size="13" fill="#6e7681">Other languages: ${esc(otherNames)}. Numbers: projects where I used the tool and made 10+ commits or wrote 3,000+ lines. Counted from my own commits, ${esc(data.updated)}.</text>
</svg>`
fs.writeFileSync(path.join(ROOT, 'assets/tech.svg'), svg)
console.log('ok', W, H)
