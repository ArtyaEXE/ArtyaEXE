// Generates the profile's animated header, assets/header.svg: node tools/gen-svg.js .
const fs = require('fs')
const path = require('path')
const OUT = process.argv[2]

const SANS = "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Cascadia Mono', 'SF Mono', Consolas, Menlo, 'DejaVu Sans Mono', monospace"
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ---------- header ----------
function header() {
  const W = 1200, H = 330
  const phrases = [
    'shipping web apps that feel instant',
    'building Telegram bots & Mini Apps',
    'teaching Claude Code to live on Windows',
    '13 open-source mods → ArtyaEXE/claude-mods',
  ]
  const CYCLE = 18, slot = 1 / phrases.length, CH = 12.1
  const typeX = 92, typeY = 262
  const typing = phrases.map((p, i) => {
    const w = p.length * CH, s = i * slot
    const t = k => (s + k * slot).toFixed(4)
    // in: typed over 35% of the slot, held, wiped at the end of the slot
    const kt = `0;${t(0)};${t(0.38)};${t(0.9)};${t(0.96)};1`
    return `<clipPath id="tc${i}"><rect x="${typeX}" y="${typeY - 24}" height="34" width="0">
  <animate attributeName="width" dur="${CYCLE}s" repeatCount="indefinite" calcMode="linear" keyTimes="${kt}" values="0;0;${w};${w};0;0"/></rect></clipPath>
<g clip-path="url(#tc${i})"><text x="${typeX}" y="${typeY}" textLength="${w}" lengthAdjust="spacingAndGlyphs" class="mono type">${esc(p)}</text></g>
<rect y="${typeY - 19}" width="11" height="24" rx="2" fill="#d97757" opacity="0">
  <animate attributeName="x" dur="${CYCLE}s" repeatCount="indefinite" keyTimes="${kt}" values="${typeX};${typeX};${typeX + w + 4};${typeX + w + 4};${typeX};${typeX}"/>
  <animate attributeName="opacity" dur="${CYCLE}s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;${t(0)};${t(0.96)};1" values="0;1;0;0"/>
</rect>`
  }).join('\n')

  // The little terminal on the right: Claude Code with the claude-mods HUD.
  const tx = 760, ty = 46, tw = 390, th = 238
  const line = (y, parts, delay) => `<text x="${tx + 18}" y="${ty + y}" class="mono t" opacity="0">${parts}<animate attributeName="opacity" from="0" to="1" begin="${delay}s" dur="0.4s" fill="freeze"/></text>`
  const term = `
<g filter="url(#shadow)">
  <rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="12" fill="#0d1117" stroke="#30363d"/>
  <circle cx="${tx + 18}" cy="${ty + 17}" r="5.5" fill="#ff5f57"/><circle cx="${tx + 36}" cy="${ty + 17}" r="5.5" fill="#febc2e"/><circle cx="${tx + 54}" cy="${ty + 17}" r="5.5" fill="#28c840"/>
  <text x="${tx + tw / 2}" y="${ty + 21}" text-anchor="middle" class="sans small" fill="#7d8590">claude — my-app</text>
  <line x1="${tx}" y1="${ty + 33}" x2="${tx + tw}" y2="${ty + 33}" stroke="#21262d"/>
</g>
${line(60, '<tspan fill="#3fb950">●</tspan><tspan fill="#e6edf3" font-weight="700"> Edit</tspan><tspan fill="#c9d1d9">(src/export.ts)</tspan>', 0.6)}
${line(82, '<tspan fill="#7d8590">  ⎿ +12 −3</tspan>', 1.0)}
${line(104, '<tspan fill="#3fb950">✓ npm test: 42 passed in 4 s</tspan>', 1.6)}
${line(136, '<tspan fill="#bc8cff">❯ </tspan><tspan fill="#e6edf3">;review</tspan><tspan fill="#7d8590">  @mockup.png</tspan>', 2.2)}
<line x1="${tx + 14}" y1="${ty + 150}" x2="${tx + tw - 14}" y2="${ty + 150}" stroke="#21262d"/>
${line(172, '<tspan fill="#39c5cf" font-weight="700">Opus 5.5</tspan><tspan fill="#7d8590"> │ </tspan><tspan fill="#e6edf3">⎇ main</tspan><tspan fill="#d29922"> ●3</tspan><tspan fill="#39c5cf"> ↑1</tspan><tspan fill="#7d8590"> │ </tspan><tspan fill="#e6edf3">shot · files</tspan>', 2.8)}
<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="3.1s" dur="0.4s" fill="freeze"/>
  <text x="${tx + 18}" y="${ty + 194}" class="mono t" fill="#7d8590">Context</text>
  <rect x="${tx + 92}" y="${ty + 183}" width="120" height="13" rx="2" fill="#21262d"/>
  <rect x="${tx + 92}" y="${ty + 183}" width="0" height="13" rx="2" fill="#3fb950"><animate attributeName="width" from="0" to="50" begin="3.3s" dur="1.2s" fill="freeze"/></rect>
  <text x="${tx + 222}" y="${ty + 194}" class="mono t" fill="#3fb950">42%</text>
  <text x="${tx + 268}" y="${ty + 194}" class="mono t" fill="#3fb950">cache 47m</text>
</g>
${line(218, '<tspan fill="#7d8590">? for shortcuts</tspan>', 3.4)}
<g opacity="0" filter="url(#shadow)">
  <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.3;0.34;0.82;0.86;1" dur="9s" begin="4s" repeatCount="indefinite"/>
  <animateTransform attributeName="transform" type="translate" values="30 0;30 0;0 0;0 0;0 0;30 0" keyTimes="0;0.3;0.34;0.82;0.86;1" dur="9s" begin="4s" repeatCount="indefinite"/>
  <rect x="${tx + 150}" y="${ty + th - 40}" width="262" height="58" rx="9" fill="#2b2b2b" stroke="#444"/>
  <text x="${tx + 164}" y="${ty + th - 20}" class="sans small" fill="#bbb">Windows PowerShell</text>
  <text x="${tx + 164}" y="${ty + th}" class="sans" font-size="14" font-weight="600" fill="#f3f3f3">Claude Code: Done in 3 min 12 s</text>
</g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Artur Arutyunyan — full-stack developer: web apps, Telegram bots and Mini Apps, tools for Claude Code">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f1319"/><stop offset="1" stop-color="#171b22"/></linearGradient>
  <radialGradient id="g1"><stop offset="0" stop-color="#d97757" stop-opacity=".55"/><stop offset="1" stop-color="#d97757" stop-opacity="0"/></radialGradient>
  <radialGradient id="g2"><stop offset="0" stop-color="#8b5cf6" stop-opacity=".45"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient>
  <linearGradient id="name" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#ffe2d6"/><stop offset="1" stop-color="#f0a78c"/></linearGradient>
  <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#ffffff" opacity=".055"/></pattern>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000" flood-opacity=".55"/></filter>
  <clipPath id="frame"><rect width="${W}" height="${H}" rx="22"/></clipPath>
  <style>
    .sans{font-family:${SANS}}
    .mono{font-family:${MONO}}
    .small{font-size:13px}
    .t{font-size:15px}
    .type{font-size:20px;fill:#e6edf3}
  </style>
</defs>
<g clip-path="url(#frame)">
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <circle cx="140" cy="40" r="300" fill="url(#g1)"><animate attributeName="r" values="280;330;280" dur="10s" repeatCount="indefinite"/></circle>
  <circle cx="1080" cy="330" r="320" fill="url(#g2)"><animate attributeName="r" values="330;280;330" dur="12s" repeatCount="indefinite"/></circle>
  <rect width="${W}" height="${H}" rx="22" fill="none" stroke="#30363d"/>
</g>
<text x="64" y="86" class="mono" font-size="17" fill="#d97757" opacity="0">hi there, I'm<animate attributeName="opacity" from="0" to="1" dur="0.6s" fill="freeze"/></text>
<text x="62" y="148" class="sans" font-size="58" font-weight="800" fill="url(#name)" letter-spacing="-1" opacity="0">Artur Arutyunyan<animate attributeName="opacity" from="0" to="1" begin="0.2s" dur="0.8s" fill="freeze"/></text>
<text x="64" y="190" class="sans" font-size="22" fill="#c9d1d9" opacity="0">Full-stack developer · Svelte · Vue · TypeScript · Node<animate attributeName="opacity" from="0" to="1" begin="0.5s" dur="0.8s" fill="freeze"/></text>
<rect x="64" y="226" width="640" height="52" rx="10" fill="#0d1117" fill-opacity=".75" stroke="#30363d"/>
<text x="74" y="${typeY}" class="mono" font-size="20" font-weight="700" fill="#bc8cff">❯</text>
${typing}
${term}
</svg>`
}

fs.writeFileSync(path.join(OUT, 'assets/header.svg'), header())
console.log('ok')
