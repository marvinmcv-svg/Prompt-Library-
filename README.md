# Prompt Atlas — Image & Video Prompt Library

**599 prompts · 1,799 copy-ready examples · 12 collections · generative thumbnails · builders · workflows**

Prompt Atlas is a fast, zero-dependency web library of AI image and video prompts for Google Flow (Veo / Omni Flash), ChatGPT, Gemini, Midjourney, Higgsfield, Minimax and Kling. Every prompt has an art-directed thumbnail, a fill-in template, pro tips, and **at least three complete example prompts** you can copy in one click.

## Collections

| Collection | Prompts | Type | What's inside |
|---|---:|---|---|
| Signature Commercials | 6 | Video | Shot-by-shot 10s commercials: analog hyper-kinetic, neon cyber, poster→3D, elemental, flying-car delivery, 3D menu pop-up |
| Flow Product Commands | 100 | Video | `/MagneticReveal`, `/DubaiBillboardAd`, `/UGCUnboxing`, `/TinyWorkers`, `/ProductInSpace` … |
| Movie Flow Commands | 120 | Video | Reveals, marketing scenes, UGC, POV, miniature worlds, camera shots, luxury, viral, surreal |
| Cinematic Camera Moves | 50 | Video | `/orbit 360`, `/rack focus`, `/speed ramp`, `/hero shot`, `/parallax` … |
| Editorial Photography | 24 | Image | `/zerogravityeditorial`, `/paparazzieditorial`, `/1890`, `/raineditorial` … |
| Prompt Codes | 51 | Image | 7 categories: cinematic, camera, product, ads, character, viral, VFX |
| Higgsfield Vault | 120 | Image | Stackable one-word commands (`/portrait /goldenhour /85mm`) |
| Bike Style | 108 | Image | `/SHOT/LENS/MOOD` engine, 7 hero shots, 100-command library |
| Fashion Campaign | 5 | Image | One garment photo → a full, consistent campaign |
| Ad Concepts | 4 | Image | Bus-stop, unboxing, celebrity-style, giant product |
| 3D Animation Shorts | 5 | Video | Idea → story → character sheet → scenes → animation → finish |
| Starter Prompts | 6 | Mixed | Proven first prompts, prompt helper, Higgsfield starters |

## Features

- **Search & filter** — full-text search (press `/` or `⌘K`), media type, collection, tool, sort (featured / A→Z / collection / shuffle).
- **Prompt detail** — thumbnail, setup notes, best-for tags, pro tips, 3+ example prompts with their own covers, and a **live fill-in template** for every `[BRACKETED]` variable.
- **Builders** — Bike Style command builder, Flow command stacker, Editorial formula, Camera director.
- **Workflows** — six step-by-step playbooks linking straight to the prompts they use.
- **Saved prompts** (stored locally), deep links (`#p=<prompt-id>`), light/dark theme, keyboard navigation (`←` / `→` in the detail view), fully responsive.

## Run it

No build step — it's static HTML + ES modules.

```bash
npm start            # python3 -m http.server 5173 → http://localhost:5173
npm test             # node --test: data integrity, examples, templates, thumbnails
```

Deploy by pointing GitHub Pages, Vercel or Netlify at the repository root.

## Project structure

```
index.html                 App shell
assets/css/styles.css      Design system (tokens, light/dark, components)
assets/js/app.js           UI: grid, filters, modal, builders, workflows
assets/js/library.js       Assembles all sources into one normalised library (pure, testable)
assets/js/thumbs.js        Deterministic generative SVG thumbnails (13 motifs)
assets/js/data/*.js        Source prompt data, subject pools and workflows
tests/library.test.mjs     Node test suite
```

### Adding prompts

- **Short commands**: add a line `"/Command|what it does"` to a group in `assets/js/data/commands.js`. Examples, template, thumbnail and search are generated automatically.
- **Long-form prompts**: add an object to `assets/js/data/longform.js` with `template` and an `examples` array (`append: true` appends the example to the master prompt).
- Run `npm test` — it fails if any prompt has fewer than 3 examples, duplicate ids, or broken workflow links.

## Notes

- Thumbnails are generative art-direction covers, not model outputs. To use real renders, add a `thumbUrl` to a prompt and swap it in `promptThumb()` in `app.js`.
- Slash commands are reusable style labels. If a tool doesn't autocomplete `/`, the plain-English line under the command still works.
- Prompts were curated from the creator guides in the project's Google Drive folder (Google Flow command guides, Higgsfield-in-ChatGPT, Bike Style, Editorial commands, Fashion Campaign, 3D animation shorts and the thefhd.ai commercial prompts).
