#!/usr/bin/env node
// Builds the deployable site into dist/:
//   - copies the app (index.html + assets/)
//   - one real page per prompt at /p/<id> with its own <title>, description, canonical URL,
//     Open Graph / Twitter preview (its rendered image) and JSON-LD, plus a readable
//     no-JavaScript version of the prompt that the app replaces on boot
//   - assets/renders/<id>.json: the exact prompt sent to the image model for each example image
//   - sitemap.xml and robots.txt
//
//   SITE_URL=https://example.com node scripts/build.mjs

import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { PROMPTS, COLLECTIONS } from '../assets/js/library.js';
import { renderPrompt } from './render-prompt.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = `${ROOT}dist`;
const SITE = (process.env.SITE_URL || 'https://prompt-library-seven-theta.vercel.app').replace(/\/$/, '');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const collName = new Map(COLLECTIONS.map((c) => [c.id, c.name]));

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });
await cp(`${ROOT}assets`, `${DIST}/assets`, { recursive: true });
const shell = await readFile(`${ROOT}index.html`, 'utf8');

function headFor({ title, description, url, image, jsonld }) {
  const tags = [
    `<base href="/" />`,
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Prompt Atlas" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    image ? `<meta property="og:image" content="${image}" />` : '',
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    image ? `<meta name="twitter:image" content="${image}" />` : '',
    jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>` : '',
  ].filter(Boolean).join('\n  ');
  return shell
    .replace(/<title>[^<]*<\/title>\s*/, '')
    .replace(/<meta name="description"[^>]*>/, tags);
}

// Home page
const homeImage = PROMPTS.find((p) => p.id === 'editorial-zerogravityeditorial')?.img;
await writeFile(`${DIST}/index.html`, headFor({
  title: 'Prompt Atlas — AI image & video prompt library',
  description: shell.match(/<meta name="description" content="([^"]*)"/)[1],
  url: `${SITE}/`,
  image: homeImage && `${SITE}/${homeImage}`,
  jsonld: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Prompt Atlas', url: `${SITE}/` },
}));

// Prompt pages + render prompts
await mkdir(`${DIST}/assets/renders`, { recursive: true });
for (const p of PROMPTS) {
  const url = `${SITE}/p/${p.id}`;
  const coll = collName.get(p.collection);
  const title = `${p.title} (${p.cmd}) — ${p.type === 'video' ? 'AI video' : 'AI image'} prompt | Prompt Atlas`;
  const description = clip(`${p.desc} ${p.examples.length} copy-ready ${p.type} prompt examples for ${p.tools.join(', ')}. ${coll}.`, 160);
  const image = p.img && `${SITE}/${p.img}`;
  const body = `<section id="prerender" class="wrap prerender">
    <p><a href="/">← All prompts</a> · ${esc(coll)}</p>
    <h1>${esc(p.title)}</h1>
    <p><code>${esc(p.cmd)}</code> — ${esc(p.desc)}</p>
    ${p.img ? `<img src="/${p.img}" alt="${esc(p.title)} example render" width="800" />` : ''}
    <h2>Original prompt</h2>
    <pre>${esc(p.template)}</pre>
    <h2>Examples</h2>
    ${p.examples.map((e) => `<article><h3>${esc(e.title)}</h3>${e.img ? `<img src="/${e.img}" alt="${esc(e.title)} render" loading="lazy" width="400" />` : ''}<pre>${esc(e.prompt)}</pre></article>`).join('\n    ')}
  </section>`;
  const html = headFor({
    title, description, url, image,
    jsonld: { '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, alternateName: p.cmd, description: p.desc, url, image, genre: coll, isPartOf: { '@type': 'WebSite', name: 'Prompt Atlas', url: `${SITE}/` } },
  }).replace('</header>', `</header>\n  ${body}`);
  await mkdir(`${DIST}/p/${p.id}`, { recursive: true });
  await writeFile(`${DIST}/p/${p.id}/index.html`, html);

  const renders = {};
  for (const e of p.examples) if (e.img) renders[e.id] = renderPrompt(p, e);
  if (Object.keys(renders).length) await writeFile(`${DIST}/assets/renders/${p.id}.json`, JSON.stringify(renders));
}

// Sitemap + robots
const today = new Date().toISOString().slice(0, 10);
await writeFile(`${DIST}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[`${SITE}/`, ...PROMPTS.map((p) => `${SITE}/p/${p.id}`)].map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
await writeFile(`${DIST}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Built ${PROMPTS.length} prompt pages, sitemap and robots.txt into dist/ for ${SITE}`);
