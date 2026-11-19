import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.POLLINATIONS_KEY = 'test-key';
const calls = [];
globalThis.fetch = async (url) => { calls.push(String(url)); return new Response(new Uint8Array([1, 2, 3]), { headers: { 'content-type': 'image/jpeg' } }); };
const { default: handler } = await import('../api/render.js');

const call = (query, ip = '10.0.0.1') => new Promise((resolve) => {
  let status = 200; const headers = {};
  const res = { setHeader: (k, v) => { headers[k] = v; }, status(s) { status = s; return this; }, json: (body) => resolve({ status, headers, body }), send: (b) => resolve({ status, headers, bytes: b.length }) };
  handler({ method: 'GET', query, headers: { 'x-forwarded-for': ip } }, res);
});

test('render API validates input and only uses the free model', async () => {
  assert.equal((await call({ prompt: 'hi' })).status, 400);
  assert.equal((await call({ prompt: 'A portrait of [SUBJECT] in a studio' })).status, 400);
  assert.equal((await call({ prompt: 'x'.repeat(1501) })).status, 400);
  const ok = await call({ prompt: 'A lighthouse at dusk, 16:9', w: 5000, h: 10 }, '10.0.0.2');
  assert.equal(ok.status, 200);
  assert.match(ok.headers['Cache-Control'], /s-maxage/);
  const u = new URL(calls.at(-1));
  assert.equal(u.searchParams.get('model'), 'community/scriptsnsenses-sys/lucid-origin:free');
  assert.equal(u.searchParams.get('width'), '1024');
  assert.equal(u.searchParams.get('height'), '256');
});

test('render API rate-limits each visitor', async () => {
  const statuses = [];
  for (let i = 0; i < 10; i++) statuses.push((await call({ prompt: `A quiet harbour at dawn number ${i}` }, '10.9.9.9')).status);
  assert.deepEqual(statuses.slice(-2), [429, 429]);
  assert.equal((await call({ prompt: 'A quiet harbour at dawn again' }, '10.9.9.8')).status, 200);
});
