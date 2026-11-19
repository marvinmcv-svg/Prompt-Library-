// How each library example is reworded into the prompt actually sent to the image
// model: no uploaded reference, a concrete subject, the style effect up front, and
// video prompts turned into a single key frame. Shared by generate-images.mjs and
// build.mjs (which publishes the render prompt next to each image).

import { bikeExpand } from '../assets/js/library.js';

// ------------------------------------------------------------ prompt cleanup

const PERSON = 'a model with sculpted cheekbones and slicked-back dark hair in a tailored ivory suit';
const PRODUCT = 'a faceted glass perfume bottle with a brushed-gold cap';
const RIDER = 'Rider: a rider in a black leather jacket and a matte-black full-face helmet.\nBike: a matte-black café racer with a tan leather seat and round headlight.';

export const STYLISED = /cartoon|pixar|anime|manga|clay|pixel|illustrat|watercolou?r|sketch|comic|lego|painting|oil paint|vector|sticker|low[- ]poly|toy|figurine|chibi|ukiyo|line art|art style|drawing|cel[- ]shad/i;

export const isGeneric = (e) => /^(From the guide|With your reference photo)$/i.test(e.title);

// Video prompts describe motion; turn each into one strong key frame of that video.
function videoStill(src) {
  let t = src;
  const idea = t.match(/(?:My idea|My scenes):\s*([\s\S]+)$/);
  if (idea) {
    const first = idea[1].replace(/^1\)\s*/, '').split(/\s+2\)/)[0].trim().replace(/\.$/, '');
    return `Stylised feature-animation 3D render — a single key frame from a viral animated short: ${first}. Expressive cartoon characters with big eyes, cinematic lighting, rich colour, vertical 9:16, no text.`;
  }
  if (t.length > 1300) {
    const paras = t.split(/\n\s*\n/);
    const intro = paras[0].split('\n').filter((l) => !/^[A-Z0-9 &\-—:]+$/.test(l.trim())).join(' ').split(/(?<=[.!])\s+/).filter((x) => !/upload|input image|reference/i.test(x)).join(' ').slice(0, 650);
    const ex = (t.split(/\n(?:EXAMPLE CUSTOMISATION|EXAMPLE)\n/)[1] || '').trim();
    const aspect = (t.match(/\b(16:9|9:16|4:5|1:1)\b/) || ['16:9'])[0];
    return `A single cinematic key frame from a premium product commercial — the advertised item is the hero, sharp, centred and beautifully lit.\n${ex.replace(/^(?:Uploaded product|Reference|Poster):/gim, 'Product:')}\nLook and feel: ${intro}\n${aspect}, full-frame image edge to edge, no letterbox bars, no black borders, no watermark.`;
  }
  return t
    .replace(/^Starting from the reference image:\s*/i, 'Cinematic film still, frozen mid-action: ')
    .replace(/^Format: \d+ seconds?,\s*/im, 'Format: one cinematic still frame from the video, ')
    .replace(/^Technical: \d+ seconds?,\s*/im, 'Technical: one cinematic still frame, ')
    .replace(/,?\s*realistic motion, \d+ seconds\.?/i, '. Single cinematic still frame.')
    + '\nCaptured as one frozen frame mid-action, cinematic.';
}

export function renderPrompt(p, e) {
  let t = p.type === 'video' ? videoStill(e.prompt) : e.prompt;
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
    line = line.replace(/\s*[—–-]\s*(?:keep its exact shape|match the uploaded reference)[^.]*\.?/gi, '.');
    line = line
      .split(/(?<=[.!])\s+/)
      .filter((x) => !/upload|reference image|exactly as in the (photo|reference)|consistent with the reference|identical to the reference|as in the reference/i.test(x))
      .join(' ');
    out.push(line);
  }
  t = out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  if (!/^Subject:/m.test(t)) t = t.replace(/\bthe subject's\b/gi, `${PERSON}'s`).replace(/\bthe subject\b/gi, PERSON);
  t = t.replace(/\bthe product\b/gi, PRODUCT);
  if (p.collection === 'bike' && isGeneric(e)) t = `${RIDER}\n\n${t}`;
  // Make the code's effect dominate: lead with it, restate it, and drop photorealism for stylised looks.
  const style = t.match(/^Style: (.+)$/m);
  if (style) {
    const fx = style[1].replace(/\.$/, '').replace(/^(?:Converts|Turns|Transforms|Reimagines) .+? into (?:an? )?/i, 'Rendered as ');
    t = t.replace(/^Style: .+\n?/m, '');
    const stylised = STYLISED.test(fx);
    if (stylised) t = t.replace(/photorealistic, natural texture, true-to-life detail, /i, '').replace(/photorealistic,?\s*/gi, '').replace(/^Camera: .+\n?/m, '');
    t = `${fx}${stylised ? ' — an artwork, not a photograph' : ''}.\n${t}\nMost important: ${fx.charAt(0).toLowerCase() + fx.slice(1)} — make this effect bold, dominant and unmistakable in the image.`;
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
