// Bespoke editorial artwork generator for BTH Expert.
// Produces deterministic premium "topographic strata" SVGs in the brand palette
// (deep green base, gold + cream contour lines), one distinct image per slug.
// No dependencies, no external service. Run: `node scripts/gen-art.mjs`.
//
// Used as decorative band/card backgrounds (CSS background-image) across the
// interior pages — the dark punctuation register that the light editorial
// heroes breathe against. Re-run to regenerate.

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const W = 1600;
const H = 900;
const CREAM = "#F5F0E8";
const GOLD = "#C9A96E";

// ── deterministic PRNG seeded from the slug ──────────────────────────
function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── smooth path through points (Catmull-Rom → cubic bézier) ──────────
function smooth(points) {
  const p = points;
  if (p.length < 2) return "";
  let d = `M ${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p[i + 1];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function line(baseY, comps, tilt) {
  const pts = [];
  for (let x = -60; x <= W + 60; x += 46) {
    let y = baseY + x * tilt;
    for (const [A, f, ph] of comps) y += A * Math.sin(x * f + ph);
    pts.push([x, y]);
  }
  return pts;
}

function makeArt(slug) {
  const rnd = mulberry32(hashStr(slug));
  const r = (a, b) => a + (b - a) * rnd();

  const glowX = r(0.18, 0.82);
  const glowY = r(0.08, 0.46);
  const horizonY = r(0.44, 0.64) * H;
  const goldDom = rnd() > 0.45;
  const NL = Math.round(r(27, 33));

  let paths = "";
  let ridge = "";
  for (let i = 0; i < NL; i++) {
    const t = i / (NL - 1);
    const baseY = -60 + t * (H + 120);
    const bell = Math.sin(Math.PI * t); // calmer at edges, livelier mid-frame
    const ampMax = r(11, 27) * (0.4 + 0.85 * bell);
    const comps = [];
    for (let k = 0; k < 3; k++) comps.push([r(5, ampMax), r(0.0016, 0.0072), r(0, Math.PI * 2)]);
    const tilt = r(-0.05, 0.05);
    const pts = line(baseY, comps, tilt);
    const accent = i % 4 === 1;
    if (accent) {
      paths += `<path d="${smooth(pts)}" stroke="${goldDom ? GOLD : CREAM}" stroke-width="1.5" stroke-opacity="${r(0.16, 0.27).toFixed(3)}" fill="none" stroke-linecap="round"/>`;
    } else {
      paths += `<path d="${smooth(pts)}" stroke="${CREAM}" stroke-width="1" stroke-opacity="${r(0.045, 0.092).toFixed(3)}" fill="none" stroke-linecap="round"/>`;
    }
    // one translucent gold ridge fill for depth, just below the horizon band
    if (ridge === "" && baseY > horizonY + 60) {
      const fillPts = [...pts, [W + 60, H + 60], [-60, H + 60]];
      ridge = `<path d="${smooth(fillPts)} Z" fill="${GOLD}" fill-opacity="0.028"/>`;
    }
  }

  // brighter horizon accent line
  const hComps = [
    [r(6, 14), r(0.0014, 0.003), r(0, Math.PI * 2)],
    [r(3, 8), r(0.004, 0.008), r(0, Math.PI * 2)],
  ];
  const horizon = `<path d="${smooth(line(horizonY, hComps, r(-0.02, 0.02)))}" stroke="${GOLD}" stroke-width="2" stroke-opacity="0.5" fill="none" stroke-linecap="round"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b160f"/><stop offset="1" stop-color="#15271b"/></linearGradient>
<radialGradient id="glow" cx="${glowX.toFixed(3)}" cy="${glowY.toFixed(3)}" r="0.75"><stop offset="0" stop-color="${GOLD}" stop-opacity="0.15"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></radialGradient>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${ridge}
<g>${paths}</g>
${horizon}
<rect width="${W}" height="${H}" fill="url(#vig)"/>
<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.05"/>
</svg>`;
}

const SLUGS = [
  "sector-industrie-petrochimie",
  "sector-energie-hydrocarbures",
  "sector-infrastructures-btp",
  "sector-agriculture-hydraulique",
  "projet-complexe-petrochimique-arzew",
  "projet-cimenterie-ouest-algerien",
  "projet-perimetre-irrigue-plaine-mina",
  "section-services",
  "section-secteurs",
  "section-projets",
  "section-oran",
  "section-apropos",
  "section-equipe",
];

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "generated");
mkdirSync(outDir, { recursive: true });
for (const slug of SLUGS) {
  writeFileSync(join(outDir, `${slug}.svg`), makeArt(slug), "utf8");
  console.log("wrote", `public/generated/${slug}.svg`);
}
console.log(`\n${SLUGS.length} artworks generated.`);
