// Assembles every source collection into one normalised prompt library.
// Pure module (no DOM) so it can be unit-tested in Node.

import { FLOW_PRODUCT, MOVIE_FLOW, CAMERA, PROMPT_CODES, HIGGSFIELD } from './data/commands.js';
import { EDITORIAL } from './data/editorial.js';
import * as BIKE from './data/bike.js';
import { COMMERCIALS, FASHION, AD_CONCEPTS, ANIMATION, STARTERS } from './data/longform.js';
import * as P from './data/pools.js';
import { WORKFLOWS } from './data/workflows.js';

export const COLLECTIONS = [
  { id: 'commercials', name: 'Signature Commercials', type: 'video', palette: ['#ff5e3a', '#ff2a68', '#14081f'], blurb: 'Shot-by-shot, 10-second product commercials. Upload one photo, paste, generate.', tools: ['Google Flow', 'Veo', 'Minimax'] },
  { id: 'flow-product', name: 'Flow Product Commands', type: 'video', palette: ['#00c2ff', '#7b61ff', '#080d22'], blurb: '100 slash commands that turn one product photo into reveals, billboards, UGC and worlds.', tools: ['Google Flow', 'Veo'] },
  { id: 'movie-flow', name: 'Movie Flow Commands', type: 'video', palette: ['#ffb800', '#ff5e00', '#1a0d04'], blurb: '120 command-style prompts for product videos and ads.', tools: ['Google Flow', 'Veo', 'Kling'] },
  { id: 'camera', name: 'Cinematic Camera Moves', type: 'video', palette: ['#3ee7c4', '#0091ff', '#03111a'], blurb: '50 camera, lens and motion commands to direct any image-to-video model.', tools: ['Google Flow', 'Veo', 'Kling', 'Runway'] },
  { id: 'editorial', name: 'Editorial Photography', type: 'image', palette: ['#f3d9b1', '#c0785a', '#1f1510'], blurb: '24 magazine-grade editorial looks for portraits and products.', tools: ['ChatGPT', 'Midjourney'] },
  { id: 'prompt-codes', name: 'Prompt Codes', type: 'image', palette: ['#ff6ad5', '#8c52ff', '#110824'], blurb: '51 one-word codes across 7 categories. Type the code, get the transformation.', tools: ['ChatGPT', 'Midjourney', 'Gemini'] },
  { id: 'higgsfield', name: 'Higgsfield Vault', type: 'image', palette: ['#d4ff3a', '#20d68a', '#06150d'], blurb: '120 stackable one-word commands for the Higgsfield plugin in ChatGPT.', tools: ['Higgsfield', 'ChatGPT'] },
  { id: 'bike', name: 'Bike Style', type: 'image', palette: ['#ff8a3d', '#e8364f', '#140808'], blurb: 'A /SHOT/LENS/MOOD photoshoot system: 7 hero shots + 100-command library.', tools: ['ChatGPT'] },
  { id: 'fashion', name: 'Fashion Campaign', type: 'image', palette: ['#f7c6d9', '#a874d6', '#170e22'], blurb: 'One garment photo → a full, consistent fashion campaign.', tools: ['Google Flow', 'Gemini', 'ChatGPT'] },
  { id: 'ad-concepts', name: 'Ad Concepts', type: 'image', palette: ['#ffe14d', '#ff7a45', '#1c1204'], blurb: 'Command-based ad directions: bus-stop, unboxing, celebrity-style, giant product.', tools: ['ChatGPT', 'Gemini', 'Midjourney'] },
  { id: 'animation', name: '3D Animation Shorts', type: 'video', palette: ['#7cf29c', '#28c2ff', '#06171c'], blurb: 'Idea → story → scenes → animation: the viral 3D shorts pipeline.', tools: ['ChatGPT', 'Google Flow', 'Kling'] },
  { id: 'starters', name: 'Starter Prompts', type: 'image', palette: ['#9ab8ff', '#5a6cff', '#0a0d22'], blurb: 'Proven first prompts, helpers and Higgsfield starters.', tools: ['Any model'] },
];

// ---------------------------------------------------------------- utilities

export function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickN(arr, n, r) {
  const pool = arr.slice();
  const out = [];
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  return out;
}
const pick = (arr, r) => arr[Math.floor(r() * arr.length)];

export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const parseLines = (block) => block.trim().split('\n').map((l) => l.split('|').map((x) => x.trim()));

export function productize(text, name) {
  return text
    .replace(/\bthe product's\b/gi, `the ${name}'s`)
    .replace(/\bthe product\b/gi, `the ${name}`)
    .replace(/\byour product\b/gi, `your ${name}`)
    .replace(/\bproducts\b/gi, `${name}s`)
    .replace(/\bproduct's\b/gi, `${name}'s`)
    .replace(/\bproduct\b/gi, name);
}

export function subjectize(text, who) {
  return text
    .replace(/\bThe subject's\b/g, `${cap(who)}'s`)
    .replace(/\bthe subject's\b/g, `${who}'s`)
    .replace(/\bThe subject\b/g, cap(who))
    .replace(/\bthe subject\b/g, who);
}

export function motifFor(text, fallback) {
  const t = text.toLowerCase();
  const rules = [
    [/space|planet|moon|mars|orbit earth|galaxy|astronaut/, 'space'],
    [/billboard|times square|tokyo|dubai|city|subway|street|bus-stop|bus stop|skyscraper|rooftop|london|paris|airport|mall|blimp|building|stadium/, 'city'],
    [/tiny|miniature|lego|diorama|isometric|toy|brick|factory|construction|warehouse/, 'iso'],
    [/water|liquid|splash|underwater|rain|wave|monsoon|ocean|beach|ice|frozen|snow/, 'waves'],
    [/smoke|fog|cloud|mist|dream|sand|dust/, 'mist'],
    [/fire|explosion|burst|shatter|lightning|exploded|impact|drop|glass/, 'burst'],
    [/glitch|hologram|neon|cyber|scan|digital|vhs|pixel|grid|y2k/, 'grid'],
    [/film|vintage|polaroid|analog|1890|noir|retro|disposable|stop-motion|35mm film/, 'film'],
    [/orbit|dolly|crane|pan|zoom|tracking|camera|focus|angle|shot|pov|lens|drone/, 'camera'],
    [/portrait|editorial|fashion|headshot|selfie|beauty|makeup|hair|bride|runway|model|celebrity|ugc|creator|paparazzi|red carpet|grwm|anime|character|superhero|avatar/, 'portrait'],
  ];
  for (const [re, m] of rules) if (re.test(t)) return m;
  return fallback;
}

function exampleMotif(e, fallback) {
  if (e.subject === 'bike') return 'bike';
  const base = e.subject === 'product' ? 'product' : e.subject === 'person' || e.subject === 'animal' ? 'portrait' : fallback;
  // Let the example's own content steer the art so variations look different.
  return motifFor(`${e.title} ${e.prompt.split('\n').slice(1, 3).join(' ')}`, base);
}

// ---------------------------------------------------------------- builders

const out = [];
const seen = new Set();

function add(p) {
  let id = p.id;
  let n = 2;
  while (seen.has(id)) id = `${p.id}-${n++}`;
  seen.add(id);
  const coll = COLLECTIONS.find((c) => c.id === p.collection);
  const prompt = {
    tools: coll.tools,
    tips: [],
    bestFor: [],
    group: coll.name,
    settings: '',
    ...p,
    id,
    type: p.type || coll.type,
  };
  const used = new Set();
  prompt.examples = prompt.examples.map((e, i) => {
    let motif = e.motif || exampleMotif(e, prompt.motif);
    // Keep the three example covers visually distinct.
    if (used.has(motif) && motif !== 'bike') motif = [prompt.motif, 'mist', 'burst', 'waves', 'grid', 'film', 'product', 'portrait'].find((m) => !used.has(m)) || motif;
    used.add(motif);
    return { ...e, id: `${id}-ex${i + 1}`, motif };
  });
  prompt.search = [prompt.title, prompt.cmd, prompt.desc, prompt.group, coll.name, prompt.tools.join(' '), prompt.bestFor.join(' '), prompt.type].join(' ').toLowerCase();
  out.push(prompt);
}

// Video product commands (Flow Product + Movie Flow) ------------------------

const VIDEO_TEMPLATES = {
  reveal: (cmd, desc) => `${cmd} — ${desc}.
Subject: [YOUR PRODUCT] — match the uploaded reference exactly: shape, label, colours and logo.
Scene: [SETTING]
Camera: [CAMERA MOVE]
Lighting: [LIGHTING]
Style: photorealistic premium commercial, physically believable materials, no added text, no watermark.
Format: [DURATION], [ASPECT RATIO].`,
  scene: (cmd, desc) => `${cmd} — ${desc}.
Subject: [YOUR PRODUCT] — match the uploaded reference exactly: shape, label, colours and logo.
Camera: [CAMERA MOVE]
Lighting: [LIGHTING]
Style: photorealistic cinematic commercial, believable scale and physics, no added text, no watermark.
Format: [DURATION], [ASPECT RATIO].`,
  ugc: (cmd, desc) => `${cmd} — ${desc}.
Subject: [YOUR PRODUCT] — match the uploaded reference exactly.
Creator: [CREATOR + LOCATION]
Shot on iPhone, handheld, natural daylight, authentic unpolished feel, real skin texture, natural speech to camera.
Format: [DURATION], 9:16 vertical.`,
  pov: (cmd, desc) => `${cmd} — ${desc}.
Subject: [YOUR PRODUCT] — match the uploaded reference exactly.
POV: the viewer's own hands in frame, first-person perspective, [LOCATION].
Camera: handheld phone at eye height with natural micro-shake.
Format: [DURATION], 9:16 vertical.`,
  viral: (cmd, desc) => `${cmd} — ${desc}.
Subject: [YOUR PRODUCT] — match the uploaded reference exactly.
Hook: [WHAT STOPS THE SCROLL IN SECOND ONE]
Camera: [CAMERA MOVE]
Format: [DURATION], 9:16 vertical, seamless and loopable.`,
};

const HOOKS = [
  'the product drops into frame with a heavy thud and a snap zoom',
  'the product appears somewhere it should not be — then the camera reveals why',
  'a countdown "3…2…1" in hand gestures before the reveal',
  'an oddly satisfying slow-motion squeeze, pour or click',
  'the camera passes through an object and lands on the product',
];
const HOMES = ['a sunny kitchen counter', 'a bathroom vanity with morning light', 'a bedside table at night', 'a busy café table', 'a car passenger seat', 'a minimalist desk'];

function videoExample(flavor, cmd, desc, p, r) {
  const d = cap(productize(desc, p.name));
  const subj = `Subject: ${p.full} — match the uploaded reference exactly: shape, label, colours and logo.`;
  const tail = 'Style: photorealistic premium commercial, physically believable materials, no added text, no watermark.';
  switch (flavor) {
    case 'reveal':
      return `${cmd} — ${d}.\n${subj}\nScene: ${pick(P.STUDIO_SETTINGS, r)}.\nCamera: ${pick(P.VIDEO_CAMERAS, r)}.\nLighting: ${pick(P.LIGHTS, r)}.\n${tail}\nFormat: 8 seconds, ${pick(['9:16 vertical', '16:9 widescreen', '1:1 square'], r)}.`;
    case 'scene':
      return `${cmd} — ${d}.\n${subj}\nCamera: ${pick(P.VIDEO_CAMERAS, r)}.\nLighting: ${pick(P.LIGHTS, r)}.\nStyle: photorealistic cinematic commercial, believable scale and physics, no added text, no watermark.\nFormat: 8 seconds, ${pick(['9:16 vertical', '16:9 widescreen'], r)}.`;
    case 'ugc':
      return `${cmd} — ${d}.\nSubject: ${p.full} — match the uploaded reference exactly.\nCreator: ${pick(P.UGC_CREATORS, r)}.\nShot on iPhone, handheld, natural daylight, authentic unpolished feel, real skin texture, natural speech to camera.\nFormat: 8 seconds, 9:16 vertical.`;
    case 'pov':
      return `${cmd} — ${d}.\nSubject: ${p.full} — match the uploaded reference exactly.\nPOV: the viewer's own hands in frame, first-person perspective, ${pick(HOMES, r)}.\nCamera: handheld phone at eye height with natural micro-shake.\nFormat: 8 seconds, 9:16 vertical.`;
    default:
      return `${cmd} — ${d}.\nSubject: ${p.full} — match the uploaded reference exactly.\nHook: ${pick(HOOKS, r)}.\nCamera: ${pick(P.VIDEO_CAMERAS, r)}.\nFormat: 6 seconds, 9:16 vertical, seamless and loopable.`;
  }
}

function buildVideoCommands(source, collection, settings) {
  for (const g of source) {
    for (const [cmd, desc] of parseLines(g.lines)) {
      const id = `${collection}-${slug(cmd)}`;
      const r = rng(hash(id));
      const products = pickN(P.PRODUCTS, 3, r);
      const title = cmd.startsWith('/') ? cmd.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^3D/, '3D ') : cmd;
      add({
        id, collection, group: g.group, cmd, title: cap(title.replace(/\s+/g, ' ').trim()),
        desc: cap(desc) + '.',
        motif: motifFor(`${cmd} ${desc} ${g.group}`, 'product'),
        settings,
        template: VIDEO_TEMPLATES[g.flavor](cmd, desc),
        bestFor: [g.group],
        tips: ['Put the command at the very start of the prompt, then one short line about your product.', 'If "/" does not autocomplete, Google Flow still reads the plain-English line.', 'Stack up to 3 commands: one reveal + one scene + one style.'],
        examples: products.map((p) => ({ title: cap(p.name), subject: 'product', prompt: videoExample(g.flavor, cmd, desc, p, r) })),
      });
    }
  }
}

// Camera moves -------------------------------------------------------------

function buildCamera() {
  for (const g of CAMERA) {
    for (const [cmd, desc] of parseLines(g.lines)) {
      const id = `camera-${slug(cmd)}`;
      const r = rng(hash(id));
      const scenes = pickN(P.SCENES, 3, r);
      add({
        id, collection: 'camera', group: g.group, cmd, title: cap(cmd.slice(1)),
        desc: desc + '.',
        motif: 'camera',
        settings: 'Image-to-video · upload a still, then direct the camera',
        template: `${cmd}\n${desc}.\nSubject: [YOUR SUBJECT OR UPLOADED IMAGE]\n[CAMERA BODY + LENS]\n[LIGHTING + MOOD + GRADE]`,
        bestFor: [g.group, 'Image-to-video'],
        tips: ["Don't use the command alone — combine it with camera + lens + lighting + movement + mood.", 'One camera move per clip gives the cleanest motion.'],
        examples: scenes.map((s) => ({
          title: cap(s.replace(/^an? /, '')).slice(0, 40), subject: 'scene',
          prompt: `${cmd}\n${desc}.\nSubject: ${s}.\n${pick(P.CINE_CAMERAS, r)}\n${pick(P.CINE_LOOKS, r)}`,
        })),
      });
    }
  }
}

// One-word image codes (Prompt Codes + Higgsfield) ---------------------------

const POSES = ['looking just past the camera', 'mid-stride with natural movement', 'leaning against a textured wall', 'glancing over one shoulder', 'laughing candidly', 'seated with elbows on knees'];
const IMG_LENSES = ['85mm f/1.8 at eye level', '35mm f/2 from a slightly low angle', '50mm f/1.4, chest-up framing', '24mm wide environmental framing'];
const ART_GROUPS = /Art Styles|Character Transformation|Viral Social/;

function imageExample(cmd, desc, kind, group, r) {
  const finish = ART_GROUPS.test(group)
    ? 'Finish: high detail, cohesive styling, consistent character, clean composition, no text, no watermark.'
    : 'Finish: photorealistic, natural texture, true-to-life detail, no text, no watermark.';
  const aspect = pick(P.ASPECTS, r);
  if (kind === 'product') {
    const p = pick(P.PRODUCTS, r);
    return { title: cap(p.name), subject: 'product', prompt: `${cmd} — ${productize(desc, p.name)}.\nSubject: ${p.full} — keep its exact shape, label and logo from the uploaded reference.\nSetting: ${pick(P.STUDIO_SETTINGS, r)}.\nLighting: ${pick(P.LIGHTS, r)}.\nFinish: premium commercial photography, crisp detail, no added text. ${aspect}.` };
  }
  if (kind === 'scene') {
    const s = pick(P.SCENES, r);
    return { title: cap(s.replace(/^an? /, '')).slice(0, 40), subject: 'scene', prompt: `${cmd} — ${subjectize(desc, 'the scene')}.\nSubject: ${s}.\nCamera: ${pick(IMG_LENSES, r)}.\n${finish} ${aspect}.` };
  }
  const who = pick(P.PEOPLE, r);
  return { title: cap(who.replace(/^an? /, '')).slice(0, 40), subject: 'person', prompt: `${cmd} — ${subjectize(desc, 'the subject')}.\nSubject: ${who}, ${pick(POSES, r)}, ${pick(P.IMAGE_SETTINGS, r)}.\nCamera: ${pick(IMG_LENSES, r)}.\n${finish} ${aspect}.` };
}

function buildImageCodes(source, collection, settings, extraTips) {
  for (const g of source) {
    for (const [cmd, desc] of parseLines(g.lines)) {
      const id = `${collection}-${slug(cmd)}`;
      const r = rng(hash(id));
      const kinds = g.subject === 'mixed' ? ['person', 'product', 'scene'] : [g.subject, g.subject, g.subject === 'person' ? 'scene' : 'product'];
      const examples = [];
      const titles = new Set();
      for (const k of kinds) {
        let ex; let guard = 0;
        do { ex = imageExample(cmd, desc, k, g.group, r); } while (titles.has(ex.title) && guard++ < 8);
        titles.add(ex.title);
        examples.push(ex);
      }
      add({
        id, collection, group: g.group, cmd, title: cap(cmd.slice(1)),
        desc: cap(desc) + '.',
        motif: motifFor(`${cmd} ${desc}`, g.subject === 'product' ? 'product' : 'portrait'),
        settings,
        template: `${cmd} — ${desc}.\nSubject: [SUBJECT OR UPLOADED IMAGE]\nSetting: [SETTING]\nCamera: [LENS + ANGLE]\nFinish: [STYLE NOTES], [ASPECT RATIO].`,
        bestFor: [g.group],
        tips: extraTips,
        examples,
      });
    }
  }
}

// Editorial ----------------------------------------------------------------

function buildEditorial() {
  for (const e of EDITORIAL) {
    const id = `editorial-${slug(e.cmd)}`;
    const r = rng(hash(id));
    const isProduct = e.kind === 'product';
    const fill = (who) => (isProduct ? productize(e.example, who) : subjectize(e.example, who));
    const subjects = isProduct ? pickN(P.PRODUCTS, 2, r).map((p) => [cap(p.name), p.full]) : pickN(P.PEOPLE, 2, r).map((p) => [cap(p.replace(/^an? /, '')).slice(0, 40), p]);
    add({
      id, collection: 'editorial', group: isProduct ? 'Product Editorial' : 'Portrait Editorial', cmd: e.cmd, title: e.title,
      desc: e.desc, motif: isProduct ? 'product' : motifFor(e.cmd + ' ' + e.example, 'portrait'),
      settings: 'Upload a reference image, then combine the command with your scene',
      template: `${e.cmd}\n${isProduct ? productize(e.example, '[PRODUCT]') : subjectize(e.example, '[SUBJECT]')}`,
      bestFor: e.bestFor,
      tips: ['These are reusable style labels — keep the full description under the command.', 'Formula: STYLE + SUBJECT + LOCATION + LIGHTING + CAMERA.', 'Try stacking two looks, e.g. /paparazzieditorial + /filmflasheditorial.'],
      examples: [
        { title: 'From the guide', subject: isProduct ? 'product' : 'person', prompt: `${e.cmd}\n${e.example}` },
        ...subjects.map(([t, who]) => ({ title: t, subject: isProduct ? 'product' : 'person', prompt: `${e.cmd}\n${fill(who)}` })),
      ],
    });
  }
}

// Bike Style ---------------------------------------------------------------

function bikeParse(cmd) {
  const parts = cmd.split('/').map((s) => s.trim().toLowerCase()).filter(Boolean);
  return { shot: parts[0], lens: parts[1], moods: parts.slice(2) };
}

export function bikeExpand(cmd, { rider, bike, note } = {}) {
  const { shot, lens, moods } = bikeParse(cmd);
  const ref = rider || bike
    ? `${rider ? `Rider: ${rider}.` : 'Bike only — no rider in frame.'}\nBike: ${bike}.`
    : "Use the uploaded photo as the exact reference: keep the rider's face, hairstyle, skin tone, outfit and helmet, and the exact same motorcycle, paint colour, decals and accessories.";
  return `${ref}\n\nShot: ${BIKE.SHOT[shot] || shot}.\nLens: ${BIKE.LENS[lens] || lens}.\nMood: ${moods.map((m) => BIKE.MOOD[m] || m).join('; ')}.${note ? `\nScene: ${note}.` : ''}\n\nPhotorealistic photograph, true lens behaviour, natural skin texture, real metal and paint reflections, mechanically correct bike. Vertical 9:16. No added text, no watermark, no invented logos.`;
}

function buildBike() {
  const dict = `SLOT 1 - SHOT:\n${Object.entries(BIKE.SHOT).map(([k, v]) => `${k} = ${v}`).join('\n')}\n\nSLOT 2 - LENS:\n${Object.entries(BIKE.LENS).map(([k, v]) => `${k} = ${v}`).join('\n')}\n\nSLOT 3 - MOOD:\n${Object.entries(BIKE.MOOD).map(([k, v]) => `${k} = ${v}`).join('\n')}`;
  add({
    id: 'bike-engine', collection: 'bike', group: 'Setup', cmd: '/setup', title: 'Bike Style Command Engine',
    desc: 'Paste once as the first message of a new ChatGPT chat. Teaches the /SHOT/LENS/MOOD format, the full dictionary and the identity-lock rules.',
    motif: 'bike', settings: 'ChatGPT · first message in a new chat (or Project instructions)',
    template: BIKE.ENGINE.replace('{{DICTIONARY}}', dict),
    bestFor: ['Motorcycle owners', 'Rider brands', 'Carousels & reels'],
    tips: ['19 shots × 14 lenses × 33 moods = 8,700+ combinations.', 'Seated and fullbody shots are the most reliable; POV and riding shots are hardest.', 'Change slot 2 first if every shot looks the same.'],
    examples: [
      { title: '7-shot hero carousel', subject: 'bike', prompt: 'After pasting the engine and uploading your photo, send these one at a time:\n/pov/wide/motionblur\n/birdview/wide/monsoon\n/ultracloseup/bokeh/rain\n/lowangle/35mm/cinematic\n/reflection/85mm/moody\n/silhouette/anamorphic/sunset\n/fullbody/35mm/travel' },
      { title: 'Bike-only showroom set', subject: 'bike', prompt: '/rider off\n/sideprofile/50mm/studio\n/headon/85mm/studio\n/highangle/35mm/studio\n/ultracloseup/macro/studio\n/ratio 4:5' },
      { title: 'Rainy night set', subject: 'bike', prompt: '/lowangle/35mm/neon\n/reflection/85mm/neon\n/dutchangle/24mm/neon/rain\n/rearview/telephoto/lighttrails\n/portrait/bokeh/night\n/again' },
    ],
  });

  for (const h of BIKE.HERO) {
    const id = `bike-hero-${slug(h.cmd)}`;
    const r = rng(hash(id));
    const [b1, b2] = pickN(BIKE.BIKES, 2, r);
    add({
      id, collection: 'bike', group: 'Hero Commands', cmd: h.cmd, title: h.title, desc: h.tagline,
      motif: 'bike', settings: 'ChatGPT · after the engine, send just the command',
      template: h.prompt,
      bestFor: ['Hero Commands'],
      tips: ['With the engine loaded, you only need to type the command.', 'Skipped the setup? Paste this full prompt on its own with your photo.'],
      examples: [
        { title: 'With your reference photo', subject: 'bike', prompt: h.prompt },
        { title: cap(b1.replace(/^an? /, '')).slice(0, 40), subject: 'bike', prompt: bikeExpand(h.cmd, { rider: pick(BIKE.RIDERS, r), bike: b1, note: h.tagline.replace(/\.$/, '') }) },
        { title: 'Bike only: ' + b2.replace(/^an? /, '').split(' with ')[0], subject: 'bike', prompt: bikeExpand(h.cmd, { bike: b2, note: h.tagline.replace(/\.$/, '') }) },
      ],
    });
  }

  const extras = ['night', 'fog', 'rain', 'goldenhour', 'cinematic', 'vintage', 'neon', 'wet'];
  for (const g of BIKE.LIBRARY) {
    for (const [cmd, what] of parseLines(g.lines)) {
      const id = `bike-${slug(cmd)}`;
      const r = rng(hash(id));
      const [b1, b2, b3] = pickN(BIKE.BIKES, 3, r);
      const { moods } = bikeParse(cmd);
      const extra = pick(extras.filter((x) => !moods.includes(x)), r);
      add({
        id, collection: 'bike', group: g.group, cmd, title: what,
        desc: `${what}. ${cap(cmd.split('/').filter(Boolean).map((w) => w.trim()).join(' · '))}.`,
        motif: 'bike', settings: 'ChatGPT · Bike Style engine loaded',
        template: bikeExpand(cmd),
        bestFor: [g.group],
        tips: [`With the engine loaded just send: ${cmd}`, `Stack a 4th word for extra flavour, e.g. ${cmd}/${extra}`],
        examples: [
          { title: cap(b1.replace(/^an? /, '')).slice(0, 40), subject: 'bike', prompt: bikeExpand(cmd, { rider: pick(BIKE.RIDERS, r), bike: b1, note: what }) },
          { title: 'Bike only: ' + b2.replace(/^an? /, '').split(' with ')[0], subject: 'bike', prompt: bikeExpand(cmd, { bike: b2, note: what }) },
          { title: `Stacked +${extra}`, subject: 'bike', prompt: bikeExpand(`${cmd}/${extra}`, { rider: pick(BIKE.RIDERS, r), bike: b3, note: what }) },
        ],
      });
    }
  }
}

// Long-form ------------------------------------------------------------------

function buildLongform(list, collection) {
  for (const p of list) {
    add({
      ...p, collection,
      group: p.group || COLLECTIONS.find((c) => c.id === collection).name,
      examples: p.examples.map((e) => ({ ...e, prompt: e.append ? `${p.template}\n\n${e.prompt}` : e.prompt })),
    });
  }
}

// ---------------------------------------------------------------- assemble

buildLongform(COMMERCIALS, 'commercials');
buildVideoCommands(FLOW_PRODUCT, 'flow-product', 'Google Flow · Frames to Video · upload one product photo');
buildVideoCommands(MOVIE_FLOW, 'movie-flow', 'Google Flow · image-to-video · formula: [Style] + [Product Action]');
buildCamera();
buildEditorial();
buildImageCodes(PROMPT_CODES, 'prompt-codes', 'Any image model · type the code, then describe the subject', ['Codes are style shorthands — keep a short subject line under the code.', 'Combine one code from two different categories for unique looks.']);
buildImageCodes(HIGGSFIELD, 'higgsfield', 'Higgsfield plugin in ChatGPT · stack up to 3 commands', ['Stack commands: /portrait /goldenhour /85mm.', 'Add a reference image to apply the look to a specific photo.', 'Ask ChatGPT to state the credit cost before generating.']);
buildBike();
buildLongform(FASHION, 'fashion');
buildLongform(AD_CONCEPTS, 'ad-concepts');
buildLongform(ANIMATION, 'animation');
buildLongform(STARTERS, 'starters');

export const PROMPTS = out;
export { WORKFLOWS };
export const BIKE_DICT = { SHOT: BIKE.SHOT, LENS: BIKE.LENS, MOOD: BIKE.MOOD };

/** Extract fill-in variables like [YOUR PRODUCT] from a template. */
export function templateVars(template) {
  const vars = [];
  for (const m of template.matchAll(/\[([A-Z0-9][A-Z0-9 /+,&'.\-]*)\]/g)) if (!vars.includes(m[1])) vars.push(m[1]);
  return vars;
}

export function fillTemplate(template, values) {
  return template.replace(/\[([A-Z0-9][A-Z0-9 /+,&'.\-]*)\]/g, (all, k) => (values[k] && values[k].trim() ? values[k].trim() : all));
}

export function stats() {
  const examples = PROMPTS.reduce((n, p) => n + p.examples.length, 0);
  return { prompts: PROMPTS.length, examples, collections: COLLECTIONS.length, video: PROMPTS.filter((p) => p.type === 'video').length, image: PROMPTS.filter((p) => p.type === 'image').length };
}
