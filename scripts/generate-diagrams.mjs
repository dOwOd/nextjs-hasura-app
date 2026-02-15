import { writeFileSync } from 'fs'
import {
  siNextdotjs,
  siCloudflare,
  siPostgresql,
  siApollographql,
  siHasura,
  siDirectus,
  siVercel,
} from 'simple-icons'

// ---------------------------------------------------------------------------
// Shared SVG helpers
// ---------------------------------------------------------------------------

const FONT_IMPORT =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap"

const svgStyle = () => `
<style>
  @import url('${FONT_IMPORT}');
  text { font-family: 'Inter', system-ui, sans-serif; }
  svg {
    --_text:          var(--fg);
    --_text-sec:      var(--muted, color-mix(in srgb, var(--fg) 60%, var(--bg)));
    --_text-muted:    var(--muted, color-mix(in srgb, var(--fg) 40%, var(--bg)));
    --_text-faint:    color-mix(in srgb, var(--fg) 25%, var(--bg));
    --_line:          var(--line, color-mix(in srgb, var(--fg) 30%, var(--bg)));
    --_arrow:         var(--accent, color-mix(in srgb, var(--fg) 50%, var(--bg)));
    --_node-fill:     var(--surface, color-mix(in srgb, var(--fg) 3%, var(--bg)));
    --_node-stroke:   var(--border, color-mix(in srgb, var(--fg) 20%, var(--bg)));
    --_group-fill:    var(--bg);
    --_group-hdr:     color-mix(in srgb, var(--fg) 5%, var(--bg));
    --_inner-stroke:  color-mix(in srgb, var(--fg) 12%, var(--bg));
    --_key-badge:     color-mix(in srgb, var(--fg) 10%, var(--bg));
  }
</style>`

const svgDefs = (prefix = '') => `
<defs>
  <marker id="${prefix}arrowhead" markerWidth="8" markerHeight="4.8" refX="8" refY="2.4" orient="auto">
    <polygon points="0 0, 8 2.4, 0 4.8" fill="var(--_arrow)" />
  </marker>
</defs>`

// Render a service icon (24x24 viewBox) inside a <g> at the given position
const icon = (si, x, y, size = 20) => {
  if (!si) return ''
  return `<g transform="translate(${x},${y})">
    <svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="#${si.hex}">
      <path d="${si.path}" />
    </svg>
  </g>`
}

// Person icon (simple silhouette)
const personIcon = (x, y, size = 20) => {
  return `<g transform="translate(${x},${y})">
    <svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="var(--_text-sec)">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  </g>`
}

// Rounded rect node with optional icon
const nodeCard = (x, y, w, h, label, si = null, usePerson = false) => {
  const rx = 6
  const iconSize = 20
  const hasIcon = si || usePerson
  const iconAreaW = hasIcon ? iconSize + 8 : 0
  const textX = x + (hasIcon ? iconAreaW + (w - iconAreaW) / 2 : w / 2)
  const textY = y + h / 2
  const iconX = x + 10
  const iconY = y + (h - iconSize) / 2

  let out = ''
  out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${rx}" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="1" />`
  if (si) out += icon(si, iconX, iconY, iconSize)
  if (usePerson) out += personIcon(iconX, iconY, iconSize)
  out += `<text x="${textX}" y="${textY}" text-anchor="middle" dy="0.35em" font-size="13" font-weight="500" fill="var(--_text)">${escXml(label)}</text>`
  return out
}

// Group box background (drawn first, under arrows)
const groupBoxBg = (x, y, w, h) => {
  const hdrH = 28
  const rx = 8
  let out = ''
  out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${rx}" fill="var(--_group-fill)" stroke="var(--_node-stroke)" stroke-width="1" stroke-dasharray="6 3" />`
  out += `<rect x="${x}" y="${y}" width="${w}" height="${hdrH}" rx="${rx}" ry="${rx}" fill="var(--_group-hdr)" stroke="var(--_node-stroke)" stroke-width="1" stroke-dasharray="6 3" />`
  out += `<rect x="${x}" y="${y + hdrH - 8}" width="${w}" height="8" fill="var(--_group-hdr)" />`
  return out
}

// Group box header label (drawn after arrows, on top)
const groupBoxLabel = (x, y, w, label, si = null) => {
  const hdrH = 28
  const iconSize = 16
  const hasIcon = !!si
  const textXPos = x + (hasIcon ? iconSize + 16 : 12)
  const iconX = x + 10
  const iconY = y + (hdrH - iconSize) / 2
  let out = ''
  if (si) out += icon(si, iconX, iconY, iconSize)
  out += `<text x="${textXPos}" y="${y + hdrH / 2}" dy="0.35em" font-size="12" font-weight="600" fill="var(--_text-sec)">${escXml(label)}</text>`
  return out
}

// Group box with header label and optional icon (all-in-one for simple cases)
const groupBox = (x, y, w, h, label, si = null) => {
  return groupBoxBg(x, y, w, h) + groupBoxLabel(x, y, w, label, si)
}

// Arrow as polyline with optional label
// labelPos: { x, y } for absolute position, or [dx, dy] for offset from midpoint
const arrow = (points, label = '', prefix = '', labelPos = null) => {
  const pts = points.map((p) => `${p[0]},${p[1]}`).join(' ')
  let out = `<polyline points="${pts}" fill="none" stroke="var(--_line)" stroke-width="1" marker-end="url(#${prefix}arrowhead)" />`
  if (label) {
    const mid = pathMidpoint(points)
    let lx, ly
    if (labelPos && !Array.isArray(labelPos)) {
      // Absolute position
      lx = labelPos.x ?? mid[0]
      ly = labelPos.y ?? mid[1]
    } else if (Array.isArray(labelPos)) {
      // Offset from midpoint
      lx = mid[0] + labelPos[0]
      ly = mid[1] + labelPos[1]
    } else {
      lx = mid[0]
      ly = mid[1]
    }
    out += `<rect x="${lx - labelWidth(label) / 2 - 6}" y="${ly - 13}" width="${labelWidth(label) + 12}" height="20" rx="4" ry="4" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="0.5" />`
    out += `<text x="${lx}" y="${ly - 3}" text-anchor="middle" dy="0.35em" font-size="11" font-weight="400" fill="var(--_text-muted)">${escXml(label)}</text>`
  }
  return out
}

const pathMidpoint = (points) => {
  // Calculate total length and find midpoint along the polyline
  let totalLen = 0
  const segs = []
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1][0] - points[i][0]
    const dy = points[i + 1][1] - points[i][1]
    const len = Math.sqrt(dx * dx + dy * dy)
    segs.push({ from: points[i], to: points[i + 1], len })
    totalLen += len
  }
  let target = totalLen / 2
  for (const seg of segs) {
    if (target <= seg.len) {
      const t = target / seg.len
      return [
        seg.from[0] + (seg.to[0] - seg.from[0]) * t,
        seg.from[1] + (seg.to[1] - seg.from[1]) * t,
      ]
    }
    target -= seg.len
  }
  return points[points.length - 1]
}

// Approximate label width for font-size 11
const labelWidth = (text) => {
  let w = 0
  for (const ch of text) {
    // CJK characters are wider
    w += ch.charCodeAt(0) > 0x2e80 ? 11 : 6.5
  }
  return w
}

const escXml = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Approximate node label width for font-size 13
const nodeLabelWidth = (text) => {
  let w = 0
  for (const ch of text) {
    w += ch.charCodeAt(0) > 0x2e80 ? 13 : 7.5
  }
  return w
}

// Auto-calculate node width from label + icon
const nodeWidth = (label, hasIcon = false) => {
  const padding = 24
  const iconArea = hasIcon ? 28 : 0
  return Math.max(nodeLabelWidth(label) + padding + iconArea, 80)
}

// ---------------------------------------------------------------------------
// BEFORE diagram
// ---------------------------------------------------------------------------

const generateBefore = () => {
  // Node dimensions
  const NH = 40 // node height

  // --- Nodes (left to right) ---

  // Actors (outside system)
  const readerW = nodeWidth('閲覧者', true)
  const adminW = nodeWidth('管理者', true)

  // Cloudflare CDN
  const cfW = nodeWidth('Cloudflare CDN', true)

  // Vercel > Next.js 15 group containing ISR, NextAuth, Articles
  const isrW = nodeWidth('ISR')
  const nextAuthW = nodeWidth('NextAuth 認証')
  const articlesW = nodeWidth('記事管理')

  // Apollo, Hasura, PG
  const apolloW = nodeWidth('Apollo Client 3', true)
  const hasuraW = nodeWidth('Hasura GraphQL', true)
  const pgW = nodeWidth('PostgreSQL', true)

  // Layout calculation (left to right)
  const PAD = 40 // horizontal gap between nodes
  const VPAD = 20 // vertical padding inside groups

  // X positions
  const startX = 40

  // Actors column
  const actorX = startX
  const actorColW = Math.max(readerW, adminW)

  // CF column
  const cfX = actorX + actorColW + PAD
  const cfCenterX = cfX + cfW / 2

  // Vercel/Next.js group
  const innerNodesW = Math.max(isrW, nextAuthW + PAD + articlesW)
  const innerPadX = 20
  const nextjsGroupW = innerNodesW + innerPadX * 2
  const vercelPadX = 16
  const vercelGroupW = nextjsGroupW + vercelPadX * 2

  const vercelX = cfX + cfW + PAD
  const nextjsGroupX = vercelX + vercelPadX

  // Inner nodes of Next.js group
  const innerStartX = nextjsGroupX + innerPadX

  // ISR on top row
  const isrX = innerStartX + (innerNodesW - isrW) / 2
  // NextAuth + Articles on bottom row
  const nextAuthX = innerStartX
  const articlesX = nextAuthX + nextAuthW + PAD

  // Apollo column
  const apolloX = vercelX + vercelGroupW + PAD

  // Hasura column
  const hasuraX = apolloX + apolloW + PAD

  // PG column
  const pgX = hasuraX + hasuraW + PAD

  const totalW = pgX + pgW + startX

  // Y positions
  const topY = 40
  const vercelHdrH = 28
  const nextjsHdrH = 28
  const innerTopPad = 16

  // Group heights
  const innerRowGap = 12
  const nextjsInnerH = NH + innerRowGap + NH + innerTopPad + VPAD
  const nextjsGroupH = nextjsHdrH + nextjsInnerH
  const vercelGroupH = vercelHdrH + nextjsGroupH + VPAD * 2

  const vercelY = topY
  const nextjsGroupY = vercelY + vercelHdrH + VPAD

  // Inner node Y positions
  const isrY = nextjsGroupY + nextjsHdrH + innerTopPad
  const nextAuthY = isrY + NH + innerRowGap
  const articlesY = nextAuthY

  // Y center for the main flow line
  const mainFlowY = vercelY + vercelGroupH / 2
  const topFlowY = isrY + NH / 2
  const bottomFlowY = nextAuthY + NH / 2

  // Actor Y positions
  const readerY = topFlowY - NH / 2
  const adminY = bottomFlowY - NH / 2

  // CF Y position centered between the two flows
  const cfY = mainFlowY - NH / 2

  // Apollo, Hasura, PG Y centered
  const apolloY = mainFlowY - NH / 2
  const hasuraY = mainFlowY - NH / 2
  const pgY = mainFlowY - NH / 2

  const totalH = vercelY + vercelGroupH + topY

  // --- Build SVG ---
  let svg = ''

  // 1. Group backgrounds (under arrows)
  svg += groupBoxBg(vercelX, vercelY, vercelGroupW, vercelGroupH)
  svg += groupBoxBg(nextjsGroupX, nextjsGroupY, nextjsGroupW, nextjsGroupH)

  // 2. Arrows
  // Reader -> CF
  svg += arrow([
    [actorX + readerW, readerY + NH / 2],
    [cfX, cfY + NH / 2],
  ])
  // Admin -> CF
  svg += arrow([
    [actorX + adminW, adminY + NH / 2],
    [cfX, cfY + NH / 2],
  ])
  // CF -> ISR (reader path)
  svg += arrow([
    [cfX + cfW, cfY + NH / 2],
    [cfX + cfW + (PAD * 0.4), cfY + NH / 2],
    [cfX + cfW + (PAD * 0.4), isrY + NH / 2],
    [isrX, isrY + NH / 2],
  ])
  // CF -> NextAuth (admin path)
  svg += arrow([
    [cfX + cfW, cfY + NH / 2],
    [cfX + cfW + (PAD * 0.6), cfY + NH / 2],
    [cfX + cfW + (PAD * 0.6), nextAuthY + NH / 2],
    [nextAuthX, nextAuthY + NH / 2],
  ])
  // NextAuth -> Articles
  svg += arrow([
    [nextAuthX + nextAuthW, nextAuthY + NH / 2],
    [articlesX, articlesY + NH / 2],
  ])
  // ISR -> Apollo
  svg += arrow([
    [isrX + isrW, isrY + NH / 2],
    [vercelX + vercelGroupW - vercelPadX / 2, isrY + NH / 2],
    [vercelX + vercelGroupW - vercelPadX / 2, apolloY + NH / 2],
    [apolloX, apolloY + NH / 2],
  ])
  // Articles -> Apollo
  svg += arrow([
    [articlesX + articlesW, articlesY + NH / 2],
    [vercelX + vercelGroupW - vercelPadX / 2 + 6, articlesY + NH / 2],
    [vercelX + vercelGroupW - vercelPadX / 2 + 6, apolloY + NH / 2],
    [apolloX, apolloY + NH / 2],
  ])
  // Apollo -> Hasura
  svg += arrow([
    [apolloX + apolloW, apolloY + NH / 2],
    [hasuraX, hasuraY + NH / 2],
  ])
  // Hasura -> PG
  svg += arrow([
    [hasuraX + hasuraW, hasuraY + NH / 2],
    [pgX, pgY + NH / 2],
  ])

  // 3. Group header labels (on top of arrows)
  svg += groupBoxLabel(vercelX, vercelY, vercelGroupW, 'Vercel (Hobby)', siVercel)
  svg += groupBoxLabel(nextjsGroupX, nextjsGroupY, nextjsGroupW, 'Next.js 15', siNextdotjs)

  // 4. Nodes
  svg += nodeCard(actorX, readerY, readerW, NH, '閲覧者', null, true)
  svg += nodeCard(actorX, adminY, adminW, NH, '管理者', null, true)
  svg += nodeCard(cfX, cfY, cfW, NH, 'Cloudflare CDN', siCloudflare)
  svg += nodeCard(isrX, isrY, isrW, NH, 'ISR')
  svg += nodeCard(nextAuthX, nextAuthY, nextAuthW, NH, 'NextAuth 認証')
  svg += nodeCard(articlesX, articlesY, articlesW, NH, '記事管理')
  svg += nodeCard(apolloX, apolloY, apolloW, NH, 'Apollo Client 3', siApollographql)
  svg += nodeCard(hasuraX, hasuraY, hasuraW, NH, 'Hasura GraphQL', siHasura)
  svg += nodeCard(pgX, pgY, pgW, NH, 'PostgreSQL', siPostgresql)

  // Wrap in SVG
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}" style="--bg:#FFFFFF;--fg:#27272A;background:var(--bg)">
${svgStyle()}
${svgDefs()}
${svg}
</svg>`
}

// ---------------------------------------------------------------------------
// AFTER diagram
// ---------------------------------------------------------------------------

const generateAfter = () => {
  const NH = 40

  // Node widths
  const adminW = nodeWidth('管理者', true)
  const directusW = nodeWidth('Directus CMS', true)
  const hooksW = nodeWidth('Deploy Hooks', true)
  const r2W = nodeWidth('R2 (assets.dowo.dev)', true)
  const pagesW = nodeWidth('Pages (dowo.dev)', true)
  const nextjsW = nodeWidth('Next.js 16', true)
  const apolloW = nodeWidth('Apollo Client 4', true)
  const hasuraW = nodeWidth('Hasura GraphQL', true)
  const pgW = nodeWidth('PostgreSQL', true)
  const readerW = nodeWidth('閲覧者', true)

  const PAD = 50
  const GPAD = 20 // group internal padding
  const GHDR = 28 // group header height

  // Layout (top-to-bottom rows, left-to-right flow):
  //
  // Row 1 (top):    Admin -> [CMS: Directus] -> [Build: Next.js, Apollo] -> [Data: Hasura, PG]
  // Row 2 (bottom): ............[CF: Deploy Hooks, R2, Pages (dowo.dev)] -> Reader
  //
  // Directus has arrows down to CF group (Hooks, R2) and right to Data group (PG)

  const startX = 40
  const topY = 40
  const rowGap = 30 // gap between row 1 and row 2

  // --- Row 1 ---

  // Admin (actor)
  const adminX = startX

  // CMS group
  const cmsGroupX = adminX + adminW + PAD
  const cmsGroupW = directusW + GPAD * 2
  const cmsGroupH = GHDR + NH + GPAD * 2
  const directusX = cmsGroupX + GPAD
  const directusY = topY + GHDR + GPAD

  // Build group: Next.js + Apollo side by side
  const buildInnerW = nextjsW + PAD + apolloW
  const buildGroupW = buildInnerW + GPAD * 2
  const buildGroupH = GHDR + NH + GPAD * 2
  const buildGroupX = cmsGroupX + cmsGroupW + PAD
  const buildGroupY = topY
  const nextjsX = buildGroupX + GPAD
  const nextjsY = buildGroupY + GHDR + GPAD
  const apolloX = nextjsX + nextjsW + PAD
  const apolloY = nextjsY

  // Data group: Hasura + PG stacked
  const cfRowGap = 16
  const dataGap = 100 // wider gap for "ビルド時 Query" label
  const col3X = buildGroupX + buildGroupW + dataGap
  const dataGroupW = Math.max(hasuraW, pgW) + GPAD * 2
  const dataGroupH = GHDR + NH + cfRowGap + NH + GPAD * 2
  const dataGroupY = topY
  const hasuraX = col3X + GPAD
  const hasuraY = dataGroupY + GHDR + GPAD
  const pgX = col3X + GPAD + (Math.max(hasuraW, pgW) - pgW) / 2
  const pgY = hasuraY + NH + cfRowGap

  // Admin Y: aligned with directus
  const adminY = directusY

  // --- Row 2 ---

  const row1Bottom = Math.max(topY + cmsGroupH, buildGroupY + buildGroupH)
  const row2TopY = row1Bottom + rowGap + 50 // extra space for "リビルド" label
  const gapCenterY = (row1Bottom + row2TopY) / 2 // center between groups for labels

  // Cloudflare group: Hooks, R2 stacked left + Pages right
  const cfLeftColW = Math.max(hooksW, r2W)
  const cfInnerW = cfLeftColW + PAD + pagesW
  const cfGroupW = cfInnerW + GPAD * 2
  const cfGroupH = GHDR + NH + cfRowGap + NH + GPAD * 2
  const cfGroupX = buildGroupX // align with build group left
  const cfGroupY = row2TopY

  const hooksX = cfGroupX + GPAD
  const hooksY = cfGroupY + GHDR + GPAD
  const r2X = cfGroupX + GPAD
  const r2Y = hooksY + NH + cfRowGap
  const pagesX = hooksX + cfLeftColW + PAD
  const pagesY = cfGroupY + GHDR + GPAD + (NH + cfRowGap) / 2

  // Reader (actor): to the right of CF group, aligned with Pages
  const readerX = cfGroupX + cfGroupW + PAD
  const readerY = pagesY

  const totalW = Math.max(col3X + dataGroupW, readerX + readerW) + startX
  const totalH = cfGroupY + cfGroupH + topY

  // --- Build SVG ---
  let svg = ''

  // 1. Group backgrounds (under arrows)
  svg += groupBoxBg(cmsGroupX, topY, cmsGroupW, cmsGroupH)
  svg += groupBoxBg(buildGroupX, buildGroupY, buildGroupW, buildGroupH)
  svg += groupBoxBg(cfGroupX, cfGroupY, cfGroupW, cfGroupH)
  svg += groupBoxBg(col3X, dataGroupY, dataGroupW, dataGroupH)

  const prefix = 'after-'

  // 2. Arrows
  // Admin -> Directus
  svg += arrow(
    [
      [adminX + adminW, adminY + NH / 2],
      [directusX, directusY + NH / 2],
    ],
    '',
    prefix
  )

  // Directus -> PG (書き込み): right from Directus, through build group area, to PG
  const writeMidX = cmsGroupX + cmsGroupW + PAD / 2
  svg += arrow(
    [
      [directusX + directusW, directusY + NH / 2],
      [writeMidX, directusY + NH / 2],
      [writeMidX, pgY + NH / 2],
      [pgX, pgY + NH / 2],
    ],
    '書き込み',
    prefix,
    [40, 0]
  )

  // Directus -> R2 (画像): down from Directus to R2 in CF group
  svg += arrow(
    [
      [directusX + directusW / 2 - 20, topY + cmsGroupH],
      [directusX + directusW / 2 - 20, r2Y + NH / 2],
      [r2X, r2Y + NH / 2],
    ],
    '画像',
    prefix
  )

  // Directus -> Hooks (記事公開): down from Directus to Hooks in CF group
  svg += arrow(
    [
      [directusX + directusW / 2 + 20, topY + cmsGroupH],
      [directusX + directusW / 2 + 20, hooksY + NH / 2],
      [hooksX, hooksY + NH / 2],
    ],
    '記事公開',
    prefix
  )

  // Hooks -> Next.js (リビルド): up from Hooks to Next.js in Build group
  svg += arrow(
    [
      [hooksX + hooksW, hooksY + NH / 2],
      [nextjsX + nextjsW / 2, hooksY + NH / 2],
      [nextjsX + nextjsW / 2, nextjsY + NH],
    ],
    'リビルド',
    prefix,
    { y: gapCenterY }
  )

  // Next.js -> Apollo
  svg += arrow(
    [
      [nextjsX + nextjsW, nextjsY + NH / 2],
      [apolloX, apolloY + NH / 2],
    ],
    '',
    prefix
  )

  // Apollo -> Hasura (ビルド時 Query)
  svg += arrow(
    [
      [apolloX + apolloW, apolloY + NH / 2],
      [hasuraX, hasuraY + NH / 2],
    ],
    'データ取得',
    prefix
  )

  // Hasura -> PG
  svg += arrow(
    [
      [hasuraX + hasuraW / 2, hasuraY + NH],
      [hasuraX + hasuraW / 2, pgY],
    ],
    '',
    prefix
  )

  // Next.js -> Pages (out/): route right of Deploy Hooks card to avoid crossing it
  const outPathX = hooksX + hooksW + 20 // clear Deploy Hooks right edge
  svg += arrow(
    [
      [nextjsX + nextjsW, nextjsY + NH / 2 + 8],
      [outPathX, nextjsY + NH / 2 + 8],
      [outPathX, pagesY + NH / 2],
      [pagesX, pagesY + NH / 2],
    ],
    'out/',
    prefix,
    { y: gapCenterY }
  )

  // Pages -> Reader
  svg += arrow(
    [
      [pagesX + pagesW, pagesY + NH / 2],
      [readerX, readerY + NH / 2],
    ],
    '',
    prefix
  )

  // 3. Group header labels (on top of arrows)
  svg += groupBoxLabel(cmsGroupX, topY, cmsGroupW, 'CMS', siDirectus)
  svg += groupBoxLabel(buildGroupX, buildGroupY, buildGroupW, 'ビルド時')
  svg += groupBoxLabel(cfGroupX, cfGroupY, cfGroupW, 'Cloudflare', siCloudflare)
  svg += groupBoxLabel(col3X, dataGroupY, dataGroupW, 'データ層')

  // 4. Nodes
  svg += nodeCard(adminX, adminY, adminW, NH, '管理者', null, true)
  svg += nodeCard(directusX, directusY, directusW, NH, 'Directus CMS', siDirectus)
  svg += nodeCard(hooksX, hooksY, hooksW, NH, 'Deploy Hooks', siCloudflare)
  svg += nodeCard(r2X, r2Y, r2W, NH, 'R2 (assets.dowo.dev)', siCloudflare)
  svg += nodeCard(pagesX, pagesY, pagesW, NH, 'Pages (dowo.dev)', siCloudflare)
  svg += nodeCard(nextjsX, nextjsY, nextjsW, NH, 'Next.js 16', siNextdotjs)
  svg += nodeCard(apolloX, apolloY, apolloW, NH, 'Apollo Client 4', siApollographql)
  svg += nodeCard(hasuraX, hasuraY, hasuraW, NH, 'Hasura GraphQL', siHasura)
  svg += nodeCard(pgX, pgY, pgW, NH, 'PostgreSQL', siPostgresql)
  svg += nodeCard(readerX, readerY, readerW, NH, '閲覧者', null, true)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}" style="--bg:#FFFFFF;--fg:#27272A;background:var(--bg)">
${svgStyle()}
${svgDefs(prefix)}
${svg}
</svg>`
}

// ---------------------------------------------------------------------------
// Generate
// ---------------------------------------------------------------------------

const beforeSvg = generateBefore()
writeFileSync('public/images/isr-to-ssg/architecture-before.svg', beforeSvg)

const afterSvg = generateAfter()
writeFileSync('public/images/isr-to-ssg/architecture-after.svg', afterSvg)

console.log('Generated:')
console.log('  public/images/isr-to-ssg/architecture-before.svg')
console.log('  public/images/isr-to-ssg/architecture-after.svg')
