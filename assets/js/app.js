import { PROMPTS, COLLECTIONS, WORKFLOWS, BIKE_DICT, bikeExpand, templateVars, fillTemplate, stats, slug } from './library.js';
import { thumb } from './thumbs.js';
import { CINE_CAMERAS, CINE_LOOKS, LIGHTS } from './data/pools.js';

// ------------------------------------------------------------------ helpers
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const byId = new Map(PROMPTS.map((p) => [p.id, p]));
const collById = new Map(COLLECTIONS.map((c) => [c.id, c]));
const fmt = (n) => n.toLocaleString('en-US');
const PAGE = 36;

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

const icons = {
  copy: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
  heart: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.6C12 6.1 13.4 5 15.4 5c3.4 0 5.4 3.6 4.1 6.8C19.5 16.4 12 21 12 21z"/></svg>',
  x: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  left: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  right: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
  link: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
  dice: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
};

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('show'), 1600);
}

async function copy(text, label = 'Copied to clipboard') {
  try { await navigator.clipboard.writeText(text); } catch {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch { /* ignore */ }
    ta.remove();
  }
  toast(label);
}

const highlight = (text) => esc(text).replace(/\[([A-Z0-9][A-Z0-9 /+,&'.\-]*)\]/g, '<mark>[$1]</mark>');

function photo(src, alt, { label = '', kicker = '' } = {}) {
  return `<img class="photo" src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async" />${kicker || label ? `<span class="ov">${kicker ? `<span class="ov__k">${esc(kicker)}</span>` : ''}${label ? `<span class="ov__l">${esc(label)}</span>` : ''}</span>` : ''}`;
}

function promptThumb(p, { compact = false, kicker = true } = {}) {
  const c = collById.get(p.collection);
  if (p.img) return photo(p.img, `${p.title} — example render`, { label: p.cmd, kicker: kicker ? c.name : '' });
  return thumb({ seed: p.id, palette: c.palette, motif: p.motif, label: p.cmd, kicker: kicker ? c.name : '', compact });
}
const kickerText = (p) => { const c = collById.get(p.collection); return p.group && p.group !== c.name ? `${c.name} · ${p.group}` : c.name; };

// ------------------------------------------------------------------ state
const state = { q: '', type: 'all', collection: 'all', tool: 'all', sort: 'featured', saved: false, shown: 0, list: [] };
const saved = new Set(store.get('pa:saved', []));

const FEATURED = [
  'analog-hyperkinetic-commercial', 'bike-hero-lowangle-35mm-cinematic', 'flow-product-magneticreveal', 'editorial-zerogravityeditorial',
  'camera-orbit-360', 'fashion-campaign-master', 'neon-cyber-commercial', 'flow-product-dubaibillboardad', 'higgsfield-glambot',
  'prompt-codes-dimensionrift', 'miniature-3d-menu', 'flow-product-tinyworkers', 'ad-giant-product', 'bike-hero-silhouette-anamorphic-sunset',
  'movie-flow-smoke-reveal', 'editorial-raineditorial', 'poster-to-3d-motion', 'flow-product-productinspace', 'anim-story-generator', 'flying-car-delivery',
];

const featuredOrder = (() => {
  const rank = new Map(FEATURED.map((id, i) => [id, i]));
  const head = FEATURED.map((id) => byId.get(id)).filter(Boolean);
  const buckets = COLLECTIONS.map((c) => PROMPTS.filter((p) => p.collection === c.id && !rank.has(p.id)));
  const tail = [];
  for (let i = 0; buckets.some((b) => i < b.length); i++) for (const b of buckets) if (b[i]) tail.push(b[i]);
  return [...head, ...tail];
})();

function filtered() {
  const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
  let list = state.sort === 'featured' ? featuredOrder : PROMPTS.slice();
  list = list.filter((p) =>
    (state.type === 'all' || p.type === state.type) &&
    (state.collection === 'all' || p.collection === state.collection) &&
    (state.tool === 'all' || p.tools.includes(state.tool)) &&
    (!state.saved || saved.has(p.id)) &&
    terms.every((t) => p.search.includes(t) || p.examples.some((e) => e.title.toLowerCase().includes(t))));
  if (state.sort === 'az') list = list.slice().sort((a, b) => a.title.localeCompare(b.title));
  if (state.sort === 'collection') list = list.slice().sort((a, b) => COLLECTIONS.findIndex((c) => c.id === a.collection) - COLLECTIONS.findIndex((c) => c.id === b.collection));
  if (state.sort === 'random') list = list.slice().sort(() => Math.random() - 0.5);
  return list;
}

// ------------------------------------------------------------------ cards
function cardHTML(p) {
  const c = collById.get(p.collection);
  const isSaved = saved.has(p.id);
  return `<article class="card" data-id="${p.id}">
    <button class="card__open" type="button" data-open="${p.id}" aria-label="Open ${esc(p.title)}">
      <div class="thumb">${promptThumb(p, { kicker: false })}
        <div class="badges"><span class="badge badge--${p.type}"><span class="dot"></span>${p.type}</span><span class="badge">${p.examples.length} examples</span></div>
      </div>
      <div class="card__body">
        <span class="kicker">${esc(kickerText(p))}</span>
        <h3>${esc(p.title)}</h3>
        <code class="cmd">${esc(p.cmd)}</code>
        <p class="desc">${esc(p.desc)}</p>
      </div>
    </button>
    <div class="card__foot">
      <span class="card__tools">${esc(p.tools.join(' · '))}</span>
      <button class="iconbtn" type="button" data-copy="${p.id}" title="Copy first example" aria-label="Copy first example of ${esc(p.title)}">${icons.copy}</button>
      <button class="iconbtn" type="button" data-save="${p.id}" aria-pressed="${isSaved}" title="${isSaved ? 'Remove from saved' : 'Save'}" aria-label="Save ${esc(p.title)}">${icons.heart}</button>
    </div>
  </article>`;
}

function renderMore() {
  const grid = $('#grid');
  const next = state.list.slice(state.shown, state.shown + PAGE);
  grid.insertAdjacentHTML('beforeend', next.map(cardHTML).join(''));
  state.shown += next.length;
}

function render() {
  state.list = filtered();
  state.shown = 0;
  $('#grid').innerHTML = '';
  renderMore();
  const n = state.list.length;
  const ex = state.list.reduce((s, p) => s + p.examples.length, 0);
  $('#resultCount').textContent = `${fmt(n)} prompt${n === 1 ? '' : 's'} · ${fmt(ex)} examples`;
  $('#empty').hidden = n > 0;
  renderActive();
}

function renderActive() {
  const pills = [];
  if (state.q) pills.push(['q', `“${state.q}”`]);
  if (state.type !== 'all') pills.push(['type', state.type === 'image' ? 'Image' : 'Video']);
  if (state.collection !== 'all') pills.push(['collection', collById.get(state.collection).name]);
  if (state.tool !== 'all') pills.push(['tool', state.tool]);
  if (state.saved) pills.push(['saved', 'Saved only']);
  $('#activeFilters').innerHTML = pills.map(([k, v]) => `<span class="pill">${esc(v)}<button type="button" data-clear="${k}" aria-label="Remove filter ${esc(v)}">${icons.x}</button></span>`).join('');
}

function setFilter(patch, { scroll = false } = {}) {
  Object.assign(state, patch);
  $('#q').value = state.q;
  $('#collectionSel').value = state.collection;
  $('#toolSel').value = state.tool;
  $('#sortSel').value = state.sort;
  document.querySelectorAll('#typeSeg button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.type === state.type)));
  $('#savedBtn').setAttribute('aria-pressed', String(state.saved));
  render();
  if (scroll) $('#library').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleSave(id) {
  if (saved.has(id)) saved.delete(id); else saved.add(id);
  store.set('pa:saved', [...saved]);
  $('#savedCount').textContent = saved.size;
  document.querySelectorAll(`[data-save="${id}"]`).forEach((b) => b.setAttribute('aria-pressed', String(saved.has(id))));
  toast(saved.has(id) ? 'Saved' : 'Removed from saved');
  if (state.saved) render();
}

// ------------------------------------------------------------------ modal
let current = null;

function openPrompt(id, { push = true } = {}) {
  const p = byId.get(id);
  if (!p) return;
  current = p;
  const c = collById.get(p.collection);
  const vars = templateVars(p.template);
  const isSaved = saved.has(p.id);
  const body = $('#modalBody');
  body.innerHTML = `
    <div class="m-top">
      <div class="m-bar">
        <div class="group">
          <button class="glassbtn" type="button" data-nav="-1" aria-label="Previous prompt">${icons.left}</button>
          <button class="glassbtn" type="button" data-nav="1" aria-label="Next prompt">${icons.right}</button>
        </div>
        <div class="group">
          <button class="glassbtn" type="button" data-share aria-label="Copy link to this prompt">${icons.link}</button>
          <button class="glassbtn" type="button" data-save="${p.id}" aria-pressed="${isSaved}" aria-label="Save prompt">${icons.heart}</button>
          <button class="glassbtn" type="button" data-close aria-label="Close">${icons.x}</button>
        </div>
      </div>
    </div>
    <div class="m-body">
      <aside class="m-meta">
        <div class="thumb m-thumb">${promptThumb(p)}</div>
        <span class="kicker">${esc(kickerText(p))}</span>
        <h2 id="mTitle">${esc(p.title)}</h2>
        <code class="cmd">${esc(p.cmd)}</code>
        <p class="desc" style="margin-top:12px">${esc(p.desc)}</p>
        <dl class="facts">
          <div><dt>Type</dt><dd>${p.type === 'video' ? 'Video' : 'Image'}</dd></div>
          <div><dt>Tools</dt><dd>${esc(p.tools.join(', '))}</dd></div>
          ${p.settings ? `<div><dt>Setup</dt><dd>${esc(p.settings)}</dd></div>` : ''}
          <div><dt>Examples</dt><dd>${p.examples.length} copy-ready variations</dd></div>
        </dl>
        ${p.bestFor.length ? `<p class="m-h">Best for</p><div class="tags">${p.bestFor.map((b) => `<span class="tag">${esc(b)}</span>`).join('')}</div>` : ''}
        ${p.tips.length ? `<p class="m-h">Pro tips</p><ul class="tips">${p.tips.map((t) => `<li><span>${esc(t)}</span></li>`).join('')}</ul>` : ''}
      </aside>
      <div class="m-main">
        <div class="tabs" role="tablist">
          <button role="tab" type="button" aria-selected="true" data-mtab="examples">Examples (${p.examples.length})</button>
          <button role="tab" type="button" aria-selected="false" data-mtab="template">Template${vars.length ? ` · ${vars.length} field${vars.length === 1 ? '' : 's'}` : ''}</button>
        </div>
        <div data-mpanel="examples" class="examples">
          ${p.examples.map((e, i) => `
            <div class="ex">
              ${e.img
                ? `<a class="thumb thumb--photo" href="${e.img}" target="_blank" rel="noopener" title="Open full image">${photo(e.img, `${e.title} — rendered example`, { kicker: `Example ${i + 1}` })}</a>`
                : `<div class="thumb">${thumb({ seed: e.id, palette: c.palette, motif: e.motif, label: e.title, kicker: `Example ${i + 1}`, compact: true })}</div>`}
              <div class="ex__main">
                <div class="ex__head"><h4>${esc(e.title)}</h4>
                  <button class="btn btn--sm" type="button" data-copyex="${i}">${icons.copy}Copy</button></div>
                <pre>${esc(e.prompt)}</pre>
              </div>
            </div>`).join('')}
        </div>
        <div data-mpanel="template" hidden>
          ${vars.length ? `<div class="vars">${vars.map((v) => `<label class="field">${esc(v.toLowerCase())}<input data-var="${esc(v)}" placeholder="${esc(v.toLowerCase())}" /></label>`).join('')}</div>` : ''}
          <div class="codebox">
            <div class="codebox__bar"><span>${vars.length ? 'Fill the fields — the prompt updates live' : 'Master prompt'}</span>
              <button class="btn btn--sm btn--primary" type="button" data-copytpl>${icons.copy}Copy prompt</button></div>
            <pre id="tplOut">${highlight(p.template)}</pre>
          </div>
        </div>
      </div>
    </div>`;
  const modal = $('#modal');
  if (!modal.open) modal.showModal();
  body.scrollTop = 0;
  if (push) history.replaceState(null, '', `#p-${p.id}`);
}

function closeModal() {
  const modal = $('#modal');
  if (modal.open) modal.close();
}

function onModalClosed() {
  current = null;
  if (location.hash.startsWith('#p-')) history.replaceState(null, '', location.pathname + location.search);
}

function navModal(dir) {
  if (!current) return;
  const list = state.list.length ? state.list : PROMPTS;
  let i = list.findIndex((p) => p.id === current.id);
  if (i === -1) i = 0;
  openPrompt(list[(i + dir + list.length) % list.length].id);
}

function bindModal() {
  const modal = $('#modal');
  modal.addEventListener('close', onModalClosed);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) return closeModal();
    const t = e.target.closest('button');
    if (!t || !current) return;
    if (t.hasAttribute('data-close')) closeModal();
    else if (t.dataset.nav) navModal(+t.dataset.nav);
    else if (t.dataset.save) toggleSave(t.dataset.save);
    else if (t.hasAttribute('data-share')) copy(location.href, 'Link copied');
    else if (t.dataset.copyex) copy(current.examples[+t.dataset.copyex].prompt, 'Example copied');
    else if (t.hasAttribute('data-copytpl')) copy(currentFilled(), 'Prompt copied');
    else if (t.dataset.mtab) {
      modal.querySelectorAll('[data-mtab]').forEach((b) => b.setAttribute('aria-selected', String(b === t)));
      modal.querySelectorAll('[data-mpanel]').forEach((pn) => { pn.hidden = pn.dataset.mpanel !== t.dataset.mtab; });
    }
  });
  modal.addEventListener('input', (e) => {
    if (e.target.matches('[data-var]')) $('#tplOut').innerHTML = highlight(currentFilled());
  });
}

function currentFilled() {
  const values = {};
  document.querySelectorAll('#modal [data-var]').forEach((i) => { values[i.dataset.var] = i.value; });
  return fillTemplate(current.template, values);
}

// ------------------------------------------------------------------ static sections
function renderHero() {
  const s = stats();
  $('#heroStats').innerHTML = `<b>${fmt(s.prompts)}</b> prompts · <b>${fmt(s.examples)}</b> examples · <b>${s.collections}</b> collections`;
  $('#q').placeholder = `Search ${fmt(s.prompts)} prompts — “smoke reveal”, “billboard”, “rain”…`;
  const chips = ['Product reveal', 'UGC', 'Billboard', 'Editorial', 'Orbit', 'Neon', 'Miniature', 'Rain', 'Luxury'];
  $('#quickChips').innerHTML = chips.map((c) => `<button class="chip" type="button" data-q="${esc(c)}">${esc(c)}</button>`).join('');
  const mosaicIds = ['analog-hyperkinetic-commercial', 'bike-hero-silhouette-anamorphic-sunset', 'flow-product-productinspace', 'editorial-zerogravityeditorial', 'camera-orbit-360', 'flow-product-dubaibillboardad', 'neon-cyber-commercial', 'miniature-3d-menu', 'higgsfield-neon'];
  const photoIds = ['editorial-zerogravityeditorial', 'bike-hero-silhouette-anamorphic-sunset', 'higgsfield-neon', 'prompt-codes-dimensionrift', 'editorial-raineditorial', 'ad-giant-product', 'fashion-campaign-master', 'bike-hero-lowangle-35mm-cinematic', 'editorial-paparazzieditorial'];
  const withPhotos = photoIds.filter((id) => byId.get(id)?.img);
  const tiles = [...withPhotos, ...mosaicIds].filter((id, i, a) => a.indexOf(id) === i).slice(0, 9);
  $('#mosaic').innerHTML = tiles.map((id) => byId.get(id)).filter(Boolean).map((p) => `<div class="tile" data-open="${p.id}">${promptThumb(p)}</div>`).join('');
}

function renderCollections() {
  $('#collectionGrid').innerHTML = COLLECTIONS.map((c) => {
    const n = PROMPTS.filter((p) => p.collection === c.id).length;
    const first = PROMPTS.find((p) => p.collection === c.id);
    const cover = PROMPTS.find((p) => p.collection === c.id && p.img);
    return `<button class="coll" type="button" data-coll="${c.id}">
      <div class="thumb">${cover ? photo(cover.img, `${c.name} cover`, { label: c.name, kicker: `${n} prompts · ${c.type}` }) : thumb({ seed: `coll-${c.id}`, palette: c.palette, motif: first.motif, label: c.name, kicker: `${n} prompts · ${c.type}` })}</div>
      <div class="coll__body"><div class="coll__top"><h3>${esc(c.name)}</h3><span class="coll__n">${n}</span></div><p>${esc(c.blurb)}</p></div>
    </button>`;
  }).join('');
}

function renderSelects() {
  $('#collectionSel').innerHTML = `<option value="all">All collections</option>${COLLECTIONS.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}`;
  const tools = [...new Set(PROMPTS.flatMap((p) => p.tools))].sort();
  $('#toolSel').innerHTML = `<option value="all">All tools</option>${tools.map((t) => `<option value="${esc(t)}">${esc(t)}</option>`).join('')}`;
}

function renderWorkflows() {
  $('#workflowGrid').innerHTML = WORKFLOWS.map((w) => `
    <article class="wf">
      <div class="wf__meta"><span class="tag">${esc(w.tool)}</span><span class="tag">⏱ ${esc(w.time)}</span></div>
      <h3>${esc(w.title)}</h3>
      <p>${esc(w.summary)}</p>
      <ol>${w.steps.map(([h, d]) => `<li><span><strong>${esc(h)}</strong>${esc(d)}</span></li>`).join('')}</ol>
      <div class="wf__links">${w.prompts.map((id) => byId.get(id)).filter(Boolean).map((p) => `<button class="linkchip" type="button" data-open="${p.id}">${esc(p.cmd)}</button>`).join('')}</div>
    </article>`).join('');
}

// ------------------------------------------------------------------ builders
const opt = (arr, sel) => arr.map(([v, l]) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(l)}</option>`).join('');
const field = (label, inner) => `<label class="field">${esc(label)}${inner}</label>`;
const pickRand = (a) => a[Math.floor(Math.random() * a.length)];

const BUILDERS = {
  bike: {
    html() {
      const k = (o) => Object.keys(o).map((x) => [x, x]);
      return `<div class="panel">
        <h3>Bike Style builder</h3>
        <p>Pick one word per slot. Load the engine prompt once in ChatGPT, then send just the command — or copy the full stand-alone prompt.</p>
        ${field('Slot 1 · Shot', `<select data-b="shot">${opt(k(BIKE_DICT.SHOT), 'lowangle')}</select>`)}
        ${field('Slot 2 · Lens', `<select data-b="lens">${opt(k(BIKE_DICT.LENS), '35mm')}</select>`)}
        ${field('Slot 3 · Mood', `<select data-b="mood">${opt(k(BIKE_DICT.MOOD), 'cinematic')}</select>`)}
        ${field('Extra mood (optional)', `<select data-b="extra">${opt([['', '— none —'], ...k(BIKE_DICT.MOOD)], '')}</select>`)}
        ${field('Your bike (optional — leave empty to use your photo)', '<input data-b="bike" placeholder="e.g. a matte-black café racer" />')}
        <div class="row"><button class="btn" type="button" data-random>${icons.dice}Randomise</button><button class="btn btn--ghost" type="button" data-openid="bike-engine">Get the engine prompt</button></div>
      </div>
      <div class="panel">
        <span class="kicker">Command</span>
        <div class="out-cmd" data-out="cmd"></div>
        <div class="row"><button class="btn btn--sm" type="button" data-copyout="cmd">${icons.copy}Copy command</button></div>
        <div class="codebox"><div class="codebox__bar"><span>Stand-alone prompt</span><button class="btn btn--sm btn--primary" type="button" data-copyout="prompt">${icons.copy}Copy prompt</button></div><pre data-out="prompt"></pre></div>
      </div>`;
    },
    compute(v) {
      const cmd = `/${v.shot}/${v.lens}/${v.mood}${v.extra ? `/${v.extra}` : ''}`;
      return { cmd, prompt: bikeExpand(cmd, v.bike ? { bike: v.bike, rider: 'the rider from the uploaded photo, same face, outfit and helmet' } : {}) };
    },
    random(root) {
      const set = (k, o) => { $(`[data-b="${k}"]`, root).value = pickRand(Object.keys(o)); };
      set('shot', BIKE_DICT.SHOT); set('lens', BIKE_DICT.LENS); set('mood', BIKE_DICT.MOOD);
    },
  },
  stack: {
    html() {
      const g = (group) => PROMPTS.filter((p) => p.collection === 'flow-product' && p.group === group).map((p) => [p.id, p.cmd]);
      const scenes = [...g('Cinematic Environments & Studio'), ...g('Miniature & Creative Worlds'), ...g('Advertising & Billboards')];
      return `<div class="panel">
        <h3>Command stacker</h3>
        <p>One reveal + one scene + one style = a full product ad. Keep it to three commands so Google Flow knows what to prioritise.</p>
        ${field('Reveal', `<select data-b="reveal">${opt(g('Reveal & Transformation'), 'flow-product-magneticreveal')}</select>`)}
        ${field('Scene / world', `<select data-b="scene">${opt(scenes, 'flow-product-blackvoid')}</select>`)}
        ${field('Style', `<select data-b="style">${opt([['', '— none —'], ...g('Advertising & Billboards')], 'flow-product-luxuryad')}</select>`)}
        ${field('Your product', '<input data-b="product" value="the watch" />')}
        ${field('What happens (one line)', '<textarea data-b="line">pieces fly in and snap together in a pure black space, lit with soft gold rim light like a luxury campaign</textarea>')}
        <div class="row"><button class="btn" type="button" data-random>${icons.dice}Randomise</button></div>
      </div>
      <div class="panel">
        <span class="kicker">Stacked command</span>
        <div class="out-cmd" data-out="cmd"></div>
        <div class="codebox"><div class="codebox__bar"><span>Full prompt</span><button class="btn btn--sm btn--primary" type="button" data-copyout="prompt">${icons.copy}Copy prompt</button></div><pre data-out="prompt"></pre></div>
      </div>`;
    },
    compute(v) {
      const parts = [v.reveal, v.scene, v.style].filter(Boolean).map((id) => byId.get(id));
      const cmd = parts.map((p) => p.cmd).join(' ');
      const product = v.product.trim() || 'the product';
      const prompt = `${cmd} — ${product} ${v.line.trim()}.\n\nDirection:\n${parts.map((p) => `• ${p.cmd}: ${p.desc}`).join('\n')}\n\nKeep ${product}'s exact shape, label, colours and logo from the uploaded reference. Photorealistic premium commercial, no added text, no watermark. 8 seconds, 9:16 vertical.`;
      return { cmd, prompt };
    },
    random(root) {
      for (const k of ['reveal', 'scene', 'style']) { const s = $(`[data-b="${k}"]`, root); s.selectedIndex = Math.floor(Math.random() * s.options.length); }
    },
  },
  editorial: {
    html() {
      const styles = PROMPTS.filter((p) => p.collection === 'editorial').map((p) => [p.cmd, p.cmd]);
      return `<div class="panel">
        <h3>Editorial formula</h3>
        <p>STYLE + SUBJECT + LOCATION + LIGHTING + CAMERA. Upload your reference image first, then paste.</p>
        ${field('Style', `<select data-b="style">${opt(styles, '/filmflasheditorial')}</select>`)}
        ${field('Subject', '<input data-b="subject" value="a fashion portrait of the subject" />')}
        ${field('Location', '<input data-b="location" value="standing outside a luxury hotel at midnight" />')}
        ${field('Lighting', `<select data-b="light">${opt([['direct flash, subtle motion blur', 'Direct flash'], ['soft directional window light', 'Window light'], ['hard sunlight with architectural shadows', 'Hard sunlight'], ['neon signage glow', 'Neon'], ['large softbox with a gentle rim', 'Softbox'], ['dramatic single spotlight', 'Spotlight']], 'direct flash, subtle motion blur')}</select>`)}
        ${field('Camera', `<select data-b="camera">${opt([['35mm film photography', '35mm film'], ['85mm portrait lens, shallow depth of field', '85mm portrait'], ['overhead top-down', 'Overhead'], ['low angle, 24mm wide', 'Low angle wide'], ['full-body wide shot, 50mm', 'Full body 50mm'], ['extreme close-up, 100mm macro', 'Close-up macro']], '35mm film photography')}</select>`)}
      </div>
      <div class="panel">
        <span class="kicker">Your editorial prompt</span>
        <div class="codebox"><div class="codebox__bar"><span>Ready to paste</span><button class="btn btn--sm btn--primary" type="button" data-copyout="prompt">${icons.copy}Copy prompt</button></div><pre data-out="prompt"></pre></div>
      </div>`;
    },
    compute(v) {
      return { prompt: `${v.style}\n\n${v.subject.trim()} ${v.location.trim()}.\n\n${v.camera}, ${v.light},\nnatural skin texture, realistic imperfections,\ncinematic composition, high-fashion magazine aesthetic.` };
    },
  },
  camera: {
    html() {
      const moves = PROMPTS.filter((p) => p.collection === 'camera').map((p) => [p.id, `${p.cmd} — ${p.group}`]);
      return `<div class="panel">
        <h3>Camera director</h3>
        <p>Don't send the command alone — direct camera + lens + lighting + movement + mood.</p>
        ${field('Camera move', `<select data-b="move">${opt(moves, 'camera-orbit-360')}</select>`)}
        ${field('Subject', '<input data-b="subject" value="the subject from the uploaded image" />')}
        ${field('Camera body & lens', `<select data-b="body">${opt(CINE_CAMERAS.map((c) => [c, c.replace(/^Shot on /, '').replace(/\.$/, '')]), CINE_CAMERAS[0])}</select>`)}
        ${field('Look', `<select data-b="look">${opt(CINE_LOOKS.map((c) => [c, c.split('.').slice(-2, -1)[0].trim()]), CINE_LOOKS[0])}</select>`)}
        ${field('Extra light (optional)', `<select data-b="light">${opt([['', '— none —'], ...LIGHTS.map((l) => [l, l])], '')}</select>`)}
        <div class="row"><button class="btn" type="button" data-random>${icons.dice}Randomise</button></div>
      </div>
      <div class="panel">
        <span class="kicker">Command</span>
        <div class="out-cmd" data-out="cmd"></div>
        <div class="codebox"><div class="codebox__bar"><span>Directed prompt</span><button class="btn btn--sm btn--primary" type="button" data-copyout="prompt">${icons.copy}Copy prompt</button></div><pre data-out="prompt"></pre></div>
      </div>`;
    },
    compute(v) {
      const m = byId.get(v.move);
      return { cmd: m.cmd, prompt: `${m.cmd}\n\n${m.desc.replace(/\.$/, '')} — ${v.subject.trim()}.\n\n${v.body}\n${v.look.split('. ').join('.\n')}${v.light ? `\nLighting: ${v.light}.` : ''}` };
    },
    random(root) {
      for (const k of ['move', 'body', 'look']) { const s = $(`[data-b="${k}"]`, root); s.selectedIndex = Math.floor(Math.random() * s.options.length); }
    },
  },
};

let builderKey = 'bike';
let builderOut = {};

function renderBuilder(key = builderKey) {
  builderKey = key;
  const root = $('#builder');
  root.innerHTML = BUILDERS[key].html();
  updateBuilder();
}

function updateBuilder() {
  const root = $('#builder');
  const v = {};
  root.querySelectorAll('[data-b]').forEach((el) => { v[el.dataset.b] = el.value; });
  builderOut = BUILDERS[builderKey].compute(v);
  root.querySelectorAll('[data-out]').forEach((el) => { el.textContent = builderOut[el.dataset.out] || ''; });
}

function bindBuilders() {
  $('#builderTabs').addEventListener('click', (e) => {
    const t = e.target.closest('[data-tab]');
    if (!t) return;
    document.querySelectorAll('#builderTabs [data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b === t)));
    renderBuilder(t.dataset.tab);
  });
  const root = $('#builder');
  root.addEventListener('input', updateBuilder);
  root.addEventListener('change', updateBuilder);
  root.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.hasAttribute('data-random')) { BUILDERS[builderKey].random?.(root); updateBuilder(); }
    if (t.dataset.copyout) copy(builderOut[t.dataset.copyout], t.dataset.copyout === 'cmd' ? 'Command copied' : 'Prompt copied');
    if (t.dataset.openid) openPrompt(t.dataset.openid);
  });
}

// ------------------------------------------------------------------ theme
function initTheme() {
  const saved = store.get('pa:theme', null);
  if (saved) document.documentElement.dataset.theme = saved;
  $('#themeBtn').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    store.set('pa:theme', next);
  });
}

// ------------------------------------------------------------------ wiring
function bindGlobal() {
  let qTimer;
  $('#q').addEventListener('input', (e) => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => setFilter({ q: e.target.value.trim() }), 120);
  });
  $('#q').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#library').scrollIntoView({ behavior: 'smooth' }); });
  $('#typeSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-type]'); if (b) setFilter({ type: b.dataset.type }); });
  $('#collectionSel').addEventListener('change', (e) => setFilter({ collection: e.target.value }));
  $('#toolSel').addEventListener('change', (e) => setFilter({ tool: e.target.value }));
  $('#sortSel').addEventListener('change', (e) => setFilter({ sort: e.target.value }));
  $('#savedBtn').addEventListener('click', () => setFilter({ saved: !state.saved }, { scroll: true }));
  $('#clearBtn').addEventListener('click', () => setFilter({ q: '', type: 'all', collection: 'all', tool: 'all', saved: false }));
  $('#activeFilters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-clear]');
    if (!b) return;
    const k = b.dataset.clear;
    setFilter({ [k]: k === 'q' ? '' : k === 'saved' ? false : 'all' });
  });

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-open],[data-copy],[data-save],[data-coll],[data-q]');
    if (!t || t.closest('#modal')) return;
    if (t.dataset.open) openPrompt(t.dataset.open);
    else if (t.dataset.copy) copy(byId.get(t.dataset.copy).examples[0].prompt, 'Example copied');
    else if (t.dataset.save) toggleSave(t.dataset.save);
    else if (t.dataset.coll) setFilter({ collection: t.dataset.coll, q: '' }, { scroll: true });
    else if (t.dataset.q) setFilter({ q: t.dataset.q }, { scroll: true });
  });

  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
    if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
      e.preventDefault(); closeModal(); $('#q').focus(); $('#q').scrollIntoView({ block: 'center' });
    }
    if ($('#modal').open && !typing) {
      if (e.key === 'ArrowRight') navModal(1);
      if (e.key === 'ArrowLeft') navModal(-1);
    }
  });

  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && state.shown < state.list.length) renderMore();
  }, { rootMargin: '800px' }).observe($('#sentinel'));

  window.addEventListener('hashchange', routeHash);
}

function routeHash() {
  const m = location.hash.match(/^#p-([a-z0-9-]+)$/);
  if (m) openPrompt(decodeURIComponent(m[1]), { push: false });
}

function init() {
  initTheme();
  renderHero();
  renderCollections();
  renderSelects();
  renderWorkflows();
  renderBuilder('bike');
  $('#savedCount').textContent = saved.size;
  bindGlobal();
  bindModal();
  bindBuilders();
  render();
  routeHash();
}

init();

// Exposed for debugging in the console.
window.PromptAtlas = { PROMPTS, COLLECTIONS, slug };
