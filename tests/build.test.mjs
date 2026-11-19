import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { PROMPTS } from '../assets/js/library.js';

const root = new URL('..', import.meta.url);
const dist = (p) => new URL(`dist/${p}`, root);

test('build emits a page, render prompts and sitemap entry for every prompt', () => {
  execFileSync('node', ['scripts/build.mjs'], { cwd: root, env: { ...process.env, SITE_URL: 'https://example.test' } });
  assert.equal(readdirSync(dist('p')).length, PROMPTS.length);
  const sitemap = readFileSync(dist('sitemap.xml'), 'utf8');
  for (const p of PROMPTS) assert.ok(sitemap.includes(`https://example.test/p/${p.id}<`), `sitemap missing ${p.id}`);
  const p = PROMPTS.find((x) => x.id === 'editorial-zerogravityeditorial');
  const html = readFileSync(dist(`p/${p.id}/index.html`), 'utf8');
  assert.match(html, /<base href="\/" \/>/);
  assert.match(html, new RegExp(`<link rel="canonical" href="https://example.test/p/${p.id}" />`));
  assert.match(html, /<meta property="og:image" content="https:\/\/example.test\/assets\/img\/examples\//);
  assert.match(html, /id="prerender"/);
  assert.equal((html.match(/<title>/g) || []).length, 1, 'exactly one <title>');
  const renders = JSON.parse(readFileSync(dist(`assets/renders/${p.id}.json`), 'utf8'));
  for (const e of p.examples) if (e.img) assert.ok(renders[e.id]?.length > 40, `render prompt for ${e.id}`);
  assert.ok(existsSync(dist('robots.txt')));
});
