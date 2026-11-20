#!/usr/bin/env node
// Renders a real example image for every image-prompt example in the library
// via the Pollinations API, then writes assets/js/data/images.js (the manifest
// the site reads). Resumable: existing images are skipped.
//
//   POLLINATIONS_KEY=sk_... node scripts/generate-images.mjs [--limit N] [--model M]
//
// The key is read from the environment only — never commit it.

import { mkdir, writeFile, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { PROMPTS } from '../assets/js/library.js';

const run = promisify(execFile);
const ROOT = new URL('..', import.meta.url).pathname;
const OUT = `${ROOT}assets/img/examples`;
const TMP = `${ROOT}.img-tmp`;
const MANIFEST = `${ROOT}assets/js/data/images.js`;

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const LIMIT = Number(opt('--limit', Infinity));
const MODEL = opt('--model', 'community/scriptsnsenses-sys/lucid-origin:free');
const FALLBACK = opt('--fallback', 'tongyi-mai/z-image-turbo');
const MAX_FALLBACKS = Number(opt('--max-fallbacks', 40));
const KEY = process.env.POLLINATIONS_KEY;
if (!KEY) { console.error('Set POLLINATIONS_KEY'); process.exit(1); }

import { renderPrompt, sizeFor, STYLISED, isGeneric } from './render-prompt.mjs';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Fingerprint of the prompt each image was rendered from; a changed prompt means a stale image.
const HASHES = `${ROOT}scripts/render-hashes.json`;
const hashes = existsSync(HASHES) ? JSON.parse(readFileSync(HASHES, 'utf8')) : {};
const fingerprint = (p, e) => createHash('sha1').update(renderPrompt(p, e)).digest('hex').slice(0, 12);
const isCurrent = ({ p, e }) => existsSync(`${OUT}/${e.id}.webp`) && (!hashes[e.id] || hashes[e.id] === fingerprint(p, e));

// --------------------------------------------------------------- planning

const image = PROMPTS.filter((p) => p.type === 'image' || args.includes('--video'));
const primaryIdx = (p) => (isGeneric(p.examples[0]) && p.examples.length > 1 ? 1 : 0);
// Thumbnails first (one per prompt), then every other example.
const jobs = [];
for (const p of image) jobs.push({ p, e: p.examples[primaryIdx(p)] });
for (const p of image) p.examples.forEach((e, i) => { if (i !== primaryIdx(p)) jobs.push({ p, e }); });

// --------------------------------------------------------------- generation

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let fallbacks = 0;
let outage = 0;

async function fetchImage(prompt, { w, h }, seed, model) {
  const url = new URL(`https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`);
  url.search = new URLSearchParams({ model, width: w, height: h, seed, nologo: 'true', enhance: 'false' });
  const res = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` }, signal: AbortSignal.timeout(180_000) });
  const type = res.headers.get('content-type') || '';
  if (!res.ok || !type.startsWith('image/')) {
    const body = (await res.text()).slice(0, 200);
    const err = new Error(`${res.status} ${body}`);
    err.status = res.status;
    err.retryAfter = Number(res.headers.get('retry-after')) || 0;
    throw err;
  }
  return Buffer.from(await res.arrayBuffer());
}

async function generate({ p, e }) {
  const dest = `${OUT}/${e.id}.webp`;
  if (isCurrent({ p, e })) return 'skip';
  const prompt = renderPrompt(p, e);
  const size = sizeFor(prompt);
  const seed = Number.parseInt((opt('--seed-salt', '') + e.id).split('').reduce((h, c) => ((h * 31 + c.charCodeAt(0)) >>> 0), 7)) % 1_000_000;
  let buf;
  let safeTried = false;
  for (let attempt = 1; attempt <= 4 && !buf; attempt++) {
    try {
      buf = await fetchImage(prompt, size, seed, MODEL);
      outage = 0;
    } catch (err) {
      if (err.status === 429) { await sleep((err.retryAfter || 20) * 1000); attempt--; continue; }
      // Provider outage (5xx / network): wait it out instead of burning attempts.
      if (!err.status || err.status >= 500) {
        outage++;
        if (outage > 6) { console.warn(`  provider down (${err.message.slice(0, 60)}), pausing 90s`); await sleep(90_000); }
        else await sleep(10_000);
        if (outage < 200) { attempt--; continue; }
      }
      // Safety-filter false positive: retry once with a family-friendly note (sent to the model only).
      if ((err.status === 422 || (err.status === 400 && /safety|nsfw|content/i.test(err.message))) && !safeTried) {
        safeTried = true; console.warn(`  ${e.id}: content filter, retrying with a family-friendly note`);
        try { buf = await fetchImage(`${prompt}\nTasteful, family-friendly, fully clothed, suitable for all audiences.`, size, seed, MODEL); } catch { /* fall through */ }
        break;
      }
      if (err.status === 422 || err.status === 400) { console.warn(`  ${e.id}: blocked by the free model's content filter`); break; }
      console.warn(`  ${e.id} attempt ${attempt}: ${err.message}`);
      await sleep(4000 * attempt);
    }
  }
  if (!buf && fallbacks < MAX_FALLBACKS) {
    try { buf = await fetchImage(prompt, size, seed, FALLBACK); fallbacks++; console.warn(`  ${e.id} used fallback model`); } catch (err) { console.warn(`  ${e.id} fallback failed: ${err.message}`); }
  }
  if (!buf) return 'fail';
  const tmp = `${TMP}/${e.id}.img`;
  await writeFile(tmp, buf);
  // Trim letterbox bars: only when the trim keeps the full width and removes 3–30% of the height.
  const { stdout } = await run('convert', [tmp, '-bordercolor', 'black', '-border', '1', '-fuzz', '4%', '-trim', '-format', '%w %h %X %Y', 'info:']);
  const { stdout: dims } = await run('identify', ['-format', '%w %h', tmp]);
  const [W, H] = dims.split(' ').map(Number);
  const [tw, th, , ty] = stdout.trim().split(' ').map((v) => Number.parseInt(v, 10));
  const crop = tw >= W - 4 && th <= H * 0.97 && th >= H * 0.7 ? ['-crop', `${W}x${th}+0+${Math.max(0, ty - 1)}`, '+repage'] : [];
  await run('convert', [tmp, ...crop, '-resize', '800x800>', '-strip', '-quality', '80', dest]);
  await rm(tmp);
  hashes[e.id] = fingerprint(p, e);
  return 'ok';
}

async function writeManifest() {
  await writeFile(HASHES, `${JSON.stringify(hashes, Object.keys(hashes).sort(), 0).replace(/,"/g, ',\n"')}\n`);
  const files = existsSync(OUT) ? (await readdir(OUT)).filter((f) => f.endsWith('.webp')).sort() : [];
  const ids = files.map((f) => f.slice(0, -5));
  await writeFile(MANIFEST, `// Generated by scripts/generate-images.mjs — ids of examples that have a real rendered image\n// at assets/img/examples/<id>.webp. Do not edit by hand.\nexport const EXAMPLE_IMAGES = ${JSON.stringify(ids, null, 0).replace(/","/g, '",\n"').replace('["', '[\n"').replace('"]', '",\n]')};\n`);
  return ids.length;
}

if (args.includes('--list-stylised')) {
  for (const { p, e } of jobs) { const m = e.prompt.match(/^\/[\w-]+(?:\s+\/[\w-]+)*\s+[—–]\s+(.+)$/m); if (m && STYLISED.test(m[1])) console.log(e.id); }
  process.exit(0);
}

if (args.includes('--record-hashes')) {
  const skip = new Set((opt('--record-hashes', '') || '').split(',').filter(Boolean));
  for (const { p, e } of jobs) if (existsSync(`${OUT}/${e.id}.webp`) && !skip.has(e.id)) hashes[e.id] = fingerprint(p, e);
  await writeManifest();
  console.log(`Recorded ${Object.keys(hashes).length} fingerprints`);
  process.exit(0);
}

if (args.includes('--dry')) {
  const pickIds = (opt('--dry', '') || '').split(',').filter(Boolean);
  const sample = pickIds.length ? jobs.filter(({ e }) => pickIds.some((x) => e.id.startsWith(x))) : jobs.slice(0, 5);
  for (const { p, e } of sample) console.log(`--- ${e.id} ${JSON.stringify(sizeFor(renderPrompt(p, e)))}\n${renderPrompt(p, e)}\n`);
  process.exit(0);
}

await mkdir(OUT, { recursive: true });
await mkdir(TMP, { recursive: true });
const ONLY = (opt('--only', '') || '').split(',').filter(Boolean);
const todo = jobs.filter((j) => !isCurrent(j) && (!ONLY.length || ONLY.some((x) => j.e.id.startsWith(x)))).slice(0, LIMIT);
console.log(`${jobs.length} image examples, ${todo.length} to render with ${MODEL}`);

// Two workers, spaced to stay under the model's 15 requests/minute.
let next = 0, done = 0, failed = 0, lastStart = 0;
async function worker() {
  while (next < todo.length) {
    const job = todo[next++];
    const wait = lastStart + 4200 - Date.now();
    lastStart = Date.now() + Math.max(0, wait);
    if (wait > 0) await sleep(wait);
    const r = await generate(job);
    if (r === 'ok') done++; else if (r === 'fail') failed++;
    if ((done + failed) % 10 === 0) { const n = await writeManifest(); console.log(`  ${done} rendered, ${failed} failed, ${n} total on disk`); }
  }
}
await Promise.all(Array.from({ length: Number(opt('--workers', 1)) }, worker));
const total = await writeManifest();
await rm(TMP, { recursive: true, force: true });
console.log(`Done: ${done} rendered, ${failed} failed, ${fallbacks} via fallback. ${total}/${jobs.length} examples have images.`);
