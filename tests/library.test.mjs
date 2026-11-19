import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PROMPTS, COLLECTIONS, WORKFLOWS, templateVars, fillTemplate, stats, bikeExpand, searchPrompts } from '../assets/js/library.js';
import { thumb, MOTIFS } from '../assets/js/thumbs.js';
import { EXAMPLE_IMAGES } from '../assets/js/data/images.js';
import { existsSync } from 'node:fs';

test('library has the expected scale', () => {
  const s = stats();
  assert.ok(s.prompts >= 590, `expected 590+ prompts, got ${s.prompts}`);
  assert.ok(s.examples >= s.prompts * 3, 'every prompt should average at least 3 examples');
  assert.equal(s.collections, 13);
});

test('collection counts match the source guides', () => {
  const count = (id) => PROMPTS.filter((p) => p.collection === id).length;
  assert.equal(count('flow-product'), 100);
  assert.equal(count('movie-flow'), 120);
  assert.equal(count('camera'), 50);
  assert.equal(count('editorial'), 24);
  assert.equal(count('prompt-codes'), 51);
  assert.equal(count('higgsfield'), 120);
  assert.equal(count('bike'), 108); // engine + 7 hero + 100 library
  assert.equal(count('use-cases'), 24); // 6 packs × 4
});

test('every prompt is complete and has 3+ distinct examples', () => {
  const ids = new Set();
  for (const p of PROMPTS) {
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`);
    ids.add(p.id);
    for (const k of ['title', 'cmd', 'desc', 'template', 'collection', 'motif']) assert.ok(p[k] && String(p[k]).trim(), `${p.id} missing ${k}`);
    assert.ok(['image', 'video'].includes(p.type), `${p.id} bad type`);
    assert.ok(COLLECTIONS.some((c) => c.id === p.collection), `${p.id} unknown collection`);
    assert.ok(MOTIFS.includes(p.motif), `${p.id} unknown motif ${p.motif}`);
    assert.ok(p.examples.length >= 3, `${p.id} has ${p.examples.length} examples`);
    const prompts = new Set(p.examples.map((e) => e.prompt));
    assert.equal(prompts.size, p.examples.length, `${p.id} has duplicate example prompts`);
    for (const e of p.examples) {
      assert.ok(e.title && e.prompt.length > 40, `${p.id} weak example`);
      assert.ok(!/undefined|\[object Object\]/.test(e.prompt), `${p.id} example has a rendering bug`);
    }
  }
});

test('workflow links resolve to real prompts', () => {
  const ids = new Set(PROMPTS.map((p) => p.id));
  for (const w of WORKFLOWS) for (const id of w.prompts) assert.ok(ids.has(id), `${w.id} → missing ${id}`);
});

test('template variables can be filled', () => {
  const tpl = 'Shoot [YOUR PRODUCT] on [SETTING], [SETTING] again.';
  assert.deepEqual(templateVars(tpl), ['YOUR PRODUCT', 'SETTING']);
  assert.equal(fillTemplate(tpl, { 'YOUR PRODUCT': 'a watch', SETTING: '' }), 'Shoot a watch on [SETTING], [SETTING] again.');
});

test('bike commands expand every slot from the dictionary', () => {
  const out = bikeExpand('/lowangle/35mm/cinematic/night');
  assert.match(out, /a few centimetres off the ground/);
  assert.match(out, /35mm/);
  assert.match(out, /teal-orange/);
  assert.match(out, /sodium and LED/);
});

test('thumbnails render deterministic, escaped SVG', () => {
  const a = thumb({ seed: 'x', palette: ['#ff0000', '#00ff00', '#000000'], motif: 'product', label: '<b>&' });
  const b = thumb({ seed: 'x', palette: ['#ff0000', '#00ff00', '#000000'], motif: 'product', label: '<b>&' });
  assert.match(a, /^<svg/);
  assert.ok(a.includes('&lt;b&gt;&amp;'));
  assert.equal(a.replace(/t\d+/g, ''), b.replace(/t\d+/g, ''));
  for (const m of MOTIFS) assert.match(thumb({ seed: m, palette: ['#123456', '#654321', '#000000'], motif: m, label: m }), /<\/svg>$/);
});

test('rendered example images resolve to real examples and files', () => {
  const examples = new Map(PROMPTS.flatMap((p) => p.examples.map((e) => [e.id, e])));
  for (const id of EXAMPLE_IMAGES) {
    assert.ok(examples.has(id), `image for unknown example ${id}`);
    assert.ok(existsSync(new URL(`../assets/img/examples/${id}.webp`, import.meta.url)), `missing file for ${id}`);
    assert.equal(examples.get(id).img, `assets/img/examples/${id}.webp`);
  }
  for (const p of PROMPTS) if (p.examples.some((e) => e.img)) assert.ok(p.img, `${p.id} has example images but no cover`);
});

test('search ranks title matches first and tolerates typos and spelling variants', () => {
  assert.equal(searchPrompts(PROMPTS, 'perfume ad')[0].title, 'Perfume Ad');
  assert.ok(searchPrompts(PROMPTS, 'sunglases').length > 0, 'one-letter typo should still match');
  const uk = searchPrompts(PROMPTS, 'jewellery').map((p) => p.title);
  assert.ok(uk.some((t) => /jewel/i.test(t)), 'UK spelling should find jewelry prompts');
  assert.ok(!uk.some((t) => /rain/i.test(t)), 'synonyms must match whole words only');
  assert.equal(searchPrompts(PROMPTS, '').length, PROMPTS.length);
  assert.equal(searchPrompts(PROMPTS, 'zzqqxx').length, 0);
});
