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
import { PROMPTS, bikeExpand } from '../assets/js/library.js';

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

// ------------------------------------------------------------ prompt cleanup

const PERSON = 'a model with sculpted cheekbones and slicked-back dark hair in a tailored ivory suit';
const PRODUCT = 'a faceted glass perfume bottle with a brushed-gold cap';
const RIDER = 'Rider: a rider in a black leather jacket and a matte-black full-face helmet.\nBike: a matte-black café racer with a tan leather seat and round headlight.';

const isGeneric = (e) => /^(From the guide|With your reference photo)$/i.test(e.title);

export function renderPrompt(p, e) {
  let t = e.prompt;
  // Bike engine examples are lists of commands — render the first one as a real scene.
  if (p.id === 'bike-engine') {
    const first = t.split('\n').find((l) => /^\/[a-z]+\/[a-z0-9]+\//i.test(l.trim()));
    t = bikeExpand(first.trim(), { rider: 'a rider in a black leather jacket and a matte-black full-face helmet', bike: 'a gloss-red sport bike with white race decals' });
  }
  const lines = t.split('\n');
  const out = [];
  for (let line of lines) {
    const s = line.trim();
    // "/command — what it does" → plain style line; bare "/command" lines are dropped.
    const m = s.match(/^\/[\w-]+(?:\s+\/[\w-]+)*\s+[—–]\s+(.+)$/);
    if (m) { out.push(`Style: ${m[1]}`); continue; }
    if (/^\/[\w\- /]+$/.test(s)) continue;
    if (/^After pasting the engine/i.test(s)) continue;
    line = line.replace(/^Reference:/, 'Outfit:');
    line = line.replace(/Using the uploaded (?:product|image|photo) as the (?:exact|primary) reference,\s*(\w)/gi, (_, c) => c.toUpperCase());
    // Strip "keep it like the uploaded reference" clauses: there is no upload here.
    line = line.replace(/\s*[—–-]\s*keep its exact shape[^.]*\.?/gi, '.');
    line = line
      .split(/(?<=[.!])\s+/)
      .filter((x) => !/upload|reference image|exactly as in the (photo|reference)|consistent with the reference|identical to the reference|as in the reference/i.test(x))
      .join(' ');
    out.push(line);
  }
  t = out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  t = t.replace(/\bthe subject's\b/gi, `${PERSON}'s`).replace(/\bthe subject\b/gi, PERSON).replace(/\bthe product\b/gi, PRODUCT);
  if (p.collection === 'bike' && isGeneric(e)) t = `${RIDER}\n\n${t}`;
  // Make the code's effect dominate: lead with it, restate it, and drop photorealism for stylised looks.
  const style = t.match(/^Style: (.+)$/m);
  if (style) {
    const fx = style[1].replace(/\.$/, '');
    t = t.replace(/^Style: .+\n?/m, '');
    if (/cartoon|pixar|anime|manga|clay|pixel|illustrat|watercolou?r|sketch|comic|lego|painting|oil paint|vector|sticker|low[- ]poly|toy|figurine|chibi|ukiyo|line art/i.test(fx)) t = t.replace(/photorealistic, natural texture, true-to-life detail, /i, '').replace(/photorealistic,?\s*/gi, '');
    t = `${fx}.\n${t}\nMost important: ${fx.charAt(0).toLowerCase() + fx.slice(1)} — make this effect bold, dominant and unmistakable in the image.`;
  }
  t = t.replace(/\bthe (an?) /gi, '$1 ').replace(/\.\./g, '.');
  t = t.charAt(0).toUpperCase() + t.slice(1);
  if (t.length > 1400) t = t.slice(0, 1400);
  return t;
}

export function sizeFor(text) {
  const m = text.match(/\b(16:9|9:16|4:5|5:4|1:1|3:4|4:3|2:3|3:2|21:9)\b/);
  const r = m ? m[1] : '16:10';
  const [a, b] = r.split(':').map(Number);
  const long = 1024;
  return a >= b ? { w: long, h: Math.round((long * b) / a / 16) * 16 } : { w: Math.round((long * a) / b / 16) * 16, h: long };
}

// --------------------------------------------------------------- planning

const image = PROMPTS.filter((p) => p.type === 'image');
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
  if (existsSync(dest)) return 'skip';
  const prompt = renderPrompt(p, e);
  const size = sizeFor(prompt);
  const seed = Number.parseInt(e.id.split('').reduce((h, c) => ((h * 31 + c.charCodeAt(0)) >>> 0), 7)) % 1_000_000;
  let buf;
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
      if (err.status === 422) { console.warn(`  ${e.id}: blocked by the free model's content filter, using fallback`); break; }
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
  await run('convert', [tmp, '-resize', '800x800>', '-strip', '-quality', '80', dest]);
  await rm(tmp);
  return 'ok';
}

async function writeManifest() {
  const files = existsSync(OUT) ? (await readdir(OUT)).filter((f) => f.endsWith('.webp')).sort() : [];
  const ids = files.map((f) => f.slice(0, -5));
  await writeFile(MANIFEST, `// Generated by scripts/generate-images.mjs — ids of examples that have a real rendered image\n// at assets/img/examples/<id>.webp. Do not edit by hand.\nexport const EXAMPLE_IMAGES = ${JSON.stringify(ids, null, 0).replace(/","/g, '",\n"').replace('["', '[\n"').replace('"]', '",\n]')};\n`);
  return ids.length;
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
const todo = jobs.filter(({ e }) => !existsSync(`${OUT}/${e.id}.webp`) && (!ONLY.length || ONLY.some((x) => e.id.startsWith(x)))).slice(0, LIMIT);
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
