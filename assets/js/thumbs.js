// Generative, art-directed SVG thumbnails. Deterministic per seed, so every
// prompt and example always gets the same cover. No network, no image files.

import { hash, rng } from './library.js';

let uid = 0;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f = (n) => Math.round(n * 10) / 10;

function shiftHue(hex, deg) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  h = (h + deg + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
}

// ------------------------------------------------------------------ motifs
// Each motif draws into a 640×400 canvas, focal area around x≈450, y≈190.

const M = {
  product(r, u) {
    const kind = Math.floor(r() * 4);
    const cx = 455;
    let body = '';
    if (kind === 0) { // bottle
      body = `<rect x="${cx - 46}" y="118" width="92" height="168" rx="22" fill="url(#${u}m)"/>
        <rect x="${cx - 20}" y="84" width="40" height="40" rx="7" fill="#fff" fill-opacity=".85"/>
        <rect x="${cx - 34}" y="170" width="68" height="56" rx="6" fill="#fff" fill-opacity=".18"/>
        <rect x="${cx - 36}" y="128" width="10" height="140" rx="5" fill="#fff" fill-opacity=".35"/>`;
    } else if (kind === 1) { // can
      body = `<rect x="${cx - 48}" y="104" width="96" height="182" rx="14" fill="url(#${u}m)"/>
        <ellipse cx="${cx}" cy="106" rx="48" ry="11" fill="#fff" fill-opacity=".7"/>
        <rect x="${cx - 40}" y="124" width="9" height="150" rx="4.5" fill="#fff" fill-opacity=".38"/>
        <path d="M${cx - 48} 190 h96" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>`;
    } else if (kind === 2) { // box
      body = `<path d="M${cx - 80} 150 L${cx} 112 L${cx + 80} 150 L${cx} 188Z" fill="#fff" fill-opacity=".75"/>
        <path d="M${cx - 80} 150 L${cx} 188 L${cx} 286 L${cx - 80} 248Z" fill="url(#${u}m)"/>
        <path d="M${cx + 80} 150 L${cx} 188 L${cx} 286 L${cx + 80} 248Z" fill="url(#${u}m)" fill-opacity=".6"/>`;
    } else { // sphere / jar
      body = `<circle cx="${cx}" cy="206" r="82" fill="url(#${u}m)"/>
        <ellipse cx="${cx - 28}" cy="172" rx="26" ry="16" fill="#fff" fill-opacity=".45"/>`;
    }
    return `<ellipse cx="${cx}" cy="300" rx="150" ry="26" fill="#000" fill-opacity=".35"/>
      <rect x="${cx - 130}" y="286" width="260" height="60" rx="10" fill="#fff" fill-opacity=".08"/>
      <ellipse cx="${cx}" cy="286" rx="130" ry="20" fill="#fff" fill-opacity=".16"/>${body}`;
  },
  space(r, u) {
    let stars = '';
    for (let i = 0; i < 46; i++) stars += `<circle cx="${f(r() * 640)}" cy="${f(r() * 400)}" r="${f(r() * 1.6 + 0.3)}" fill="#fff" fill-opacity="${f(r() * 0.7 + 0.2)}"/>`;
    return `${stars}<circle cx="455" cy="190" r="96" fill="url(#${u}m)"/>
      <ellipse cx="455" cy="190" rx="170" ry="30" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" transform="rotate(-14 455 190)"/>
      <circle cx="${f(560 + r() * 30)}" cy="${f(80 + r() * 20)}" r="14" fill="#fff" fill-opacity=".8"/>`;
  },
  city(r, u) {
    let b = '';
    let x = 230;
    while (x < 650) {
      const w = 34 + r() * 46, h = 90 + r() * 200;
      b += `<rect x="${f(x)}" y="${f(400 - h)}" width="${f(w)}" height="${f(h)}" fill="#05060a" fill-opacity=".72"/>`;
      for (let wy = 400 - h + 12; wy < 390; wy += 16) for (let wx = x + 7; wx < x + w - 8; wx += 12) if (r() > 0.55) b += `<rect x="${f(wx)}" y="${f(wy)}" width="4" height="6" fill="#fff" fill-opacity="${f(0.25 + r() * 0.5)}"/>`;
      x += w + 6;
    }
    return `<rect x="345" y="86" width="210" height="122" rx="6" fill="url(#${u}m)"/>
      <rect x="345" y="86" width="210" height="122" rx="6" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
      <rect x="440" y="208" width="20" height="60" fill="#05060a" fill-opacity=".8"/>${b}`;
  },
  portrait(r, u) {
    const cx = 455 + (r() - 0.5) * 30;
    return `<circle cx="${cx}" cy="168" r="120" fill="url(#${u}g2)" fill-opacity=".9"/>
      <path d="M${cx - 135} 400 C${cx - 125} 290 ${cx - 70} 252 ${cx} 252 C${cx + 70} 252 ${cx + 125} 290 ${cx + 135} 400Z" fill="#06070b" fill-opacity=".88"/>
      <rect x="${cx - 22}" y="200" width="44" height="64" rx="18" fill="#06070b" fill-opacity=".88"/>
      <ellipse cx="${cx}" cy="150" rx="54" ry="64" fill="#06070b" fill-opacity=".9"/>
      <path d="M${cx + 40} 108 C${cx + 70} 140 ${cx + 66} 186 ${cx + 40} 210" fill="none" stroke="url(#${u}m)" stroke-width="5" stroke-linecap="round"/>
      <path d="M${cx + 70} 268 C${cx + 108} 290 ${cx + 124} 330 ${cx + 130} 400" fill="none" stroke="url(#${u}m)" stroke-width="4" stroke-linecap="round"/>`;
  },
  bike(r, u) {
    const y = 278;
    return `<ellipse cx="452" cy="${y + 62}" rx="190" ry="14" fill="#000" fill-opacity=".35"/>
      <rect x="420" y="${y - 58}" width="78" height="52" rx="12" fill="#fff" fill-opacity=".28"/>
      <path d="M440 ${y - 52} v40 M456 ${y - 52} v40 M472 ${y - 52} v40" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>
      <path d="M470 ${y - 8} C500 ${y + 18} 560 ${y + 14} 610 ${y - 8}" fill="none" stroke="url(#${u}m)" stroke-width="10" stroke-linecap="round"/>
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="352" cy="${y}" r="56" stroke="#08080c" stroke-width="18"/>
        <circle cx="352" cy="${y}" r="56" stroke="#fff" stroke-opacity=".9" stroke-width="4"/>
        <circle cx="352" cy="${y}" r="34" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>
        <circle cx="558" cy="${y}" r="56" stroke="#08080c" stroke-width="18"/>
        <circle cx="558" cy="${y}" r="56" stroke="#fff" stroke-opacity=".9" stroke-width="4"/>
        <circle cx="558" cy="${y}" r="34" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>
        <path d="M352 ${y} L418 ${y - 70} L500 ${y - 70} L558 ${y}" stroke="#fff" stroke-opacity=".75" stroke-width="7"/>
        <path d="M418 ${y - 70} L452 ${y - 6} L500 ${y - 70}" stroke="#fff" stroke-opacity=".5" stroke-width="5"/>
        <path d="M512 ${y - 112} L558 ${y}" stroke="#fff" stroke-opacity=".85" stroke-width="7"/>
        <path d="M498 ${y - 120} L536 ${y - 112}" stroke="#fff" stroke-width="7"/>
        <path d="M352 ${y - 12} L300 ${y - 40}" stroke="url(#${u}m)" stroke-width="10"/>
      </g>
      <path d="M408 ${y - 74} C420 ${y - 112} 486 ${y - 116} 506 ${y - 82} L496 ${y - 66} L418 ${y - 66}Z" fill="url(#${u}m)"/>
      <path d="M380 ${y - 72} L420 ${y - 84} L424 ${y - 70} L382 ${y - 64}Z" fill="#fff" fill-opacity=".8"/>
      <circle cx="${528}" cy="${y - 100}" r="11" fill="#fff" fill-opacity=".95"/>`;
  },
  camera(r, u) {
    const t = r() * Math.PI * 2;
    const px = 455 + Math.cos(t) * 170, py = 196 + Math.sin(t) * 56;
    return `<g fill="none" stroke="#fff">
        <ellipse cx="455" cy="196" rx="170" ry="56" stroke-opacity=".7" stroke-width="2.5" stroke-dasharray="2 9" stroke-linecap="round"/>
        <ellipse cx="455" cy="196" rx="120" ry="38" stroke-opacity=".35" stroke-width="2"/>
        <ellipse cx="455" cy="196" rx="70" ry="22" stroke-opacity=".2" stroke-width="2"/>
        <path d="M395 120 h-22 v22 M515 120 h22 v22 M395 272 h-22 v-22 M515 272 h22 v-22" stroke-opacity=".8" stroke-width="3"/>
      </g>
      <circle cx="455" cy="196" r="34" fill="url(#${u}m)"/>
      <circle cx="455" cy="196" r="12" fill="#fff" fill-opacity=".85"/>
      <g transform="translate(${f(px)} ${f(py)})"><rect x="-22" y="-15" width="44" height="30" rx="6" fill="#fff"/><circle r="9" fill="url(#${u}m)"/><path d="M22 -8 L34 -14 L34 14 L22 8Z" fill="#fff"/></g>`;
  },
  iso(r, u) {
    const cube = (x, y, s, a) => `<path d="M${x} ${y} l${s} ${-s / 2} l${s} ${s / 2} l${-s} ${s / 2}Z" fill="#fff" fill-opacity="${0.55 * a + 0.2}"/>
      <path d="M${x} ${y} l${s} ${s / 2} v${s} l${-s} ${-s / 2}Z" fill="url(#${u}m)"/>
      <path d="M${x + 2 * s} ${y} l${-s} ${s / 2} v${s} l${s} ${-s / 2}Z" fill="url(#${u}m)" fill-opacity=".55"/>`;
    let g = '';
    const cells = [[0, 0], [1, 0], [0, 1], [1, 1], [2, 0], [0, 2], [2, 1]];
    for (const [i, j] of cells) {
      const s = 46, x = 390 + (i - j) * s, y = 210 + (i + j) * (s / 2) - Math.floor(r() * 3) * 28;
      g += cube(f(x), f(y), s, r());
    }
    return `<path d="M260 300 L455 200 L650 300 L455 400Z" fill="#fff" fill-opacity=".06"/>${g}`;
  },
  waves(r, u) {
    let p = '';
    for (let i = 0; i < 6; i++) {
      const y = 170 + i * 34, a = 18 + r() * 22, ph = r() * 200;
      p += `<path d="M180 ${y} C${260 + ph / 4} ${y - a} ${340 + ph / 3} ${y + a} 420 ${y} S580 ${y - a} 660 ${y}" fill="none" stroke="${i % 2 ? '#fff' : `url(#${u}m)`}" stroke-opacity="${f(0.85 - i * 0.12)}" stroke-width="${6 - i * 0.6}" stroke-linecap="round"/>`;
    }
    return `${p}<path d="M455 66 C485 110 500 132 500 156 a45 45 0 0 1 -90 0 C410 132 425 110 455 66Z" fill="url(#${u}m)"/>
      <ellipse cx="440" cy="150" rx="9" ry="16" fill="#fff" fill-opacity=".55"/>`;
  },
  burst(r, u) {
    let rays = '';
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2 + r() * 0.1, l1 = 60 + r() * 20, l2 = 120 + r() * 140;
      rays += `<path d="M${f(455 + Math.cos(a) * l1)} ${f(196 + Math.sin(a) * l1)} L${f(455 + Math.cos(a) * l2)} ${f(196 + Math.sin(a) * l2)}" stroke="#fff" stroke-opacity="${f(0.25 + r() * 0.6)}" stroke-width="${f(1 + r() * 3)}" stroke-linecap="round"/>`;
    }
    let shards = '';
    for (let i = 0; i < 9; i++) {
      const a = r() * Math.PI * 2, d = 90 + r() * 110, x = 455 + Math.cos(a) * d, y = 196 + Math.sin(a) * d * 0.8, s = 8 + r() * 18;
      shards += `<path d="M${f(x)} ${f(y - s)} L${f(x + s * 0.8)} ${f(y + s * 0.4)} L${f(x - s * 0.6)} ${f(y + s * 0.7)}Z" fill="#fff" fill-opacity="${f(0.4 + r() * 0.5)}"/>`;
    }
    return `${rays}${shards}<circle cx="455" cy="196" r="58" fill="url(#${u}m)"/><circle cx="455" cy="196" r="24" fill="#fff" fill-opacity=".9"/>`;
  },
  mist(r, u) {
    let e = '';
    for (let i = 0; i < 7; i++) e += `<ellipse cx="${f(330 + r() * 260)}" cy="${f(140 + r() * 180)}" rx="${f(90 + r() * 90)}" ry="${f(26 + r() * 30)}" fill="url(#${u}g1)" fill-opacity="${f(0.35 + r() * 0.4)}"/>`;
    return `${e}<rect x="420" y="150" width="70" height="120" rx="16" fill="url(#${u}m)"/><rect x="438" y="128" width="34" height="26" rx="6" fill="#fff" fill-opacity=".85"/>
      ${Array.from({ length: 4 }, () => `<ellipse cx="${f(360 + r() * 200)}" cy="${f(220 + r() * 90)}" rx="${f(110 + r() * 60)}" ry="${f(20 + r() * 16)}" fill="#fff" fill-opacity="${f(0.08 + r() * 0.12)}"/>`).join('')}`;
  },
  grid(r, u) {
    let g = '';
    for (let i = -9; i <= 9; i++) g += `<path d="M455 210 L${455 + i * 70} 400" stroke="url(#${u}m)" stroke-opacity=".7" stroke-width="1.5"/>`;
    for (let k = 1; k < 8; k++) { const y = 210 + Math.pow(k / 7, 2) * 190; g += `<path d="M180 ${f(y)} H660" stroke="url(#${u}m)" stroke-opacity="${f(0.2 + k * 0.08)}" stroke-width="1.5"/>`; }
    const s = 56 + r() * 16;
    return `${g}<g fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round">
        <path d="M455 ${f(150 - s)} L${f(455 + s)} 150 L455 ${f(150 + s)} L${f(455 - s)} 150Z" stroke-opacity=".95"/>
        <path d="M455 ${f(150 - s)} L455 ${f(150 + s)} M${f(455 - s)} 150 L${f(455 + s)} 150" stroke-opacity=".4"/>
      </g><circle cx="455" cy="150" r="10" fill="url(#${u}m)"/>
      <path d="M180 120 h120 M200 132 h60 M560 96 h80 M580 108 h40" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>`;
  },
  film(r, u) {
    const frame = (x) => `<rect x="${x}" y="134" width="120" height="96" rx="4" fill="url(#${u}m)" fill-opacity="${f(0.55 + r() * 0.45)}"/>`;
    let holes = '';
    for (let x = 216; x < 700; x += 22) holes += `<rect x="${x}" y="110" width="11" height="12" rx="2" fill="#fff" fill-opacity=".7"/><rect x="${x}" y="242" width="11" height="12" rx="2" fill="#fff" fill-opacity=".7"/>`;
    return `<g transform="rotate(-8 455 190)"><rect x="200" y="98" width="500" height="168" fill="#05060a" fill-opacity=".85"/>${holes}${frame(222)}${frame(352)}${frame(482)}${frame(612)}</g>`;
  },
  type(r, u) {
    const glyph = ['Aa', '“', '¶', '{ }', '/'][Math.floor(r() * 5)];
    return `<text x="455" y="250" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="210" font-style="italic" fill="url(#${u}m)">${esc(glyph)}</text>
      <path d="M300 300 h310 M330 322 h250" stroke="#fff" stroke-opacity=".4" stroke-width="4" stroke-linecap="round"/>`;
  },
};

export const MOTIFS = Object.keys(M);

/**
 * @param {object} o
 * @param {string} o.seed     stable seed (prompt or example id)
 * @param {string[]} o.palette [accent1, accent2, base]
 * @param {string} o.motif    one of MOTIFS
 * @param {string} o.label    big label (command)
 * @param {string} [o.kicker] small label at the top
 * @param {boolean} [o.compact] smaller label for example thumbs
 */
export function thumb({ seed, palette, motif, label = '', kicker = '', compact = false }) {
  const r = rng(hash(seed));
  const u = `t${++uid}`;
  const hueShift = (r() - 0.5) * 50;
  const c1 = shiftHue(palette[0], hueShift);
  const c2 = shiftHue(palette[1], hueShift * 0.6);
  const base = palette[2];
  const draw = M[motif] || M.product;
  const gx = f(380 + r() * 200), gy = f(120 + r() * 120);
  let text = String(label);
  if (text.length > 26) text = text.slice(0, 25) + '…';
  const size = compact ? (text.length > 18 ? 26 : 32) : text.length <= 10 ? 50 : text.length <= 16 ? 40 : text.length <= 22 ? 32 : 27;

  return `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(label)}">
  <defs>
    <linearGradient id="${u}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${base}"/><stop offset="1" stop-color="${shiftHue(base, 30)}"/></linearGradient>
    <radialGradient id="${u}g1"><stop offset="0" stop-color="${c1}" stop-opacity=".95"/><stop offset="1" stop-color="${c1}" stop-opacity="0"/></radialGradient>
    <radialGradient id="${u}g2"><stop offset="0" stop-color="${c2}" stop-opacity=".9"/><stop offset="1" stop-color="${c2}" stop-opacity="0"/></radialGradient>
    <linearGradient id="${u}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <linearGradient id="${u}v" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".72"/></linearGradient>
  </defs>
  <rect width="640" height="400" fill="url(#${u}bg)"/>
  <circle cx="${gx}" cy="${gy}" r="260" fill="url(#${u}g1)" opacity=".55"/>
  <circle cx="${f(120 + r() * 160)}" cy="${f(300 + r() * 80)}" r="220" fill="url(#${u}g2)" opacity=".45"/>
  ${draw(r, u)}
  <rect width="640" height="400" fill="url(#${u}v)"/>
  ${kicker ? `<text x="30" y="44" fill="#fff" fill-opacity=".72" font-family="Inter, system-ui, sans-serif" font-size="15" font-weight="600" letter-spacing="2.2">${esc(kicker.toUpperCase())}</text>` : ''}
  ${text ? `<text x="28" y="${compact ? 368 : 362}" fill="#fff" font-family="'Space Grotesk', Inter, system-ui, sans-serif" font-size="${size}" font-weight="700" letter-spacing="-0.5">${esc(text)}</text>` : ''}
</svg>`;
}
