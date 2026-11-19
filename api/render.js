// GET /api/render?prompt=...&w=1024&h=640&seed=123
// Renders a prompt with a free Pollinations model and returns the image.
// Guardrails: free model only (no cost), prompt length cap, per-IP rate limit,
// and identical requests are served from Vercel's CDN cache.

const MODEL = 'community/scriptsnsenses-sys/lucid-origin:free';
const MAX_PROMPT = 1500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map(); // ip -> [timestamps] (per warm instance; best effort)

function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) { hits.set(ip, list); return Math.ceil((WINDOW_MS - (now - list[0])) / 1000); }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return 0;
}

const clampSize = (v, d) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(1024, Math.max(256, Math.round(n / 16) * 16)) : d;
};

export default async function handler(req, res) {
  const send = (status, message, extra = {}) => {
    res.setHeader('Cache-Control', 'no-store');
    res.status(status).json({ error: message, ...extra });
  };
  if (req.method !== 'GET') return send(405, 'Use GET');
  const key = process.env.POLLINATIONS_KEY;
  if (!key) return send(503, 'Live rendering is not configured yet.');

  const prompt = String(req.query.prompt || '').trim();
  if (prompt.length < 10) return send(400, 'Prompt is too short.');
  if (prompt.length > MAX_PROMPT) return send(400, `Prompt is too long (max ${MAX_PROMPT} characters).`);
  if (/\[[A-Z0-9 /+,&'.-]{2,}\]/.test(prompt)) return send(400, 'Fill in the [BRACKETED] fields first.');

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const wait = limited(ip);
  if (wait) { res.setHeader('Retry-After', String(wait)); return send(429, `Too many renders — try again in ${Math.ceil(wait / 60)} min.`, { retryAfter: wait }); }

  const w = clampSize(req.query.w, 1024), h = clampSize(req.query.h, 640);
  const seed = Number.parseInt(req.query.seed, 10) || 1;
  const url = new URL(`https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`);
  url.search = new URLSearchParams({ model: MODEL, width: w, height: h, seed, nologo: 'true', enhance: 'false' });

  try {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(55_000) });
    const type = r.headers.get('content-type') || '';
    if (r.status === 422) return send(422, 'The free model\'s safety filter blocked this prompt. Try rewording it.');
    if (!r.ok || !type.startsWith('image/')) return send(502, 'The image model is busy — try again in a moment.');
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', type);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, immutable');
    return res.status(200).send(buf);
  } catch {
    return send(504, 'The image model took too long — try again.');
  }
}

export const config = { maxDuration: 60 };
