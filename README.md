# Prompt Atlas — Image & Video Prompt Library

**623 prompts · 1,871 copy-ready examples · 13 collections · real example renders · builders · workflows**

Prompt Atlas is a fast, zero-dependency web library of AI image and video prompts for Google Flow (Veo / Omni Flash), ChatGPT, Gemini, Midjourney, Higgsfield, Minimax and Kling. Every image prompt shows real rendered example images, every prompt has a thumbnail, a fill-in template, pro tips, and **at least three complete example prompts** you can copy in one click.

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

- **Search & filter** — ranked, typo-tolerant search across titles, tags and every example prompt, with synonyms (press `/` or `⌘K`), media type, collection, tool, sort (featured / A→Z / collection / shuffle).
- **Prompt detail** — thumbnail, setup notes, best-for tags, pro tips, 3+ example prompts with their own covers, and a **live fill-in template** for every `[BRACKETED]` variable.
- **Builders** — Bike Style command builder, Flow command stacker, Editorial formula, Camera director.
- **Workflows** — six step-by-step playbooks linking straight to the prompts they use.
- **Saved prompts** (stored locally), deep links (`#p-<prompt-id>`), light/dark theme, keyboard navigation (`←` / `→` in the detail view), fully responsive.

## Run it

No framework — static HTML + ES modules, plus a small build step that writes `dist/`.

```bash
npm start            # build, then serve dist/ → http://localhost:5173
npm test             # data integrity, search, build output, images
npm run build        # dist/: app + /p/<id> page per prompt + sitemap.xml + robots.txt
```

Deploys on Vercel from GitHub on every push (`vercel.json`: `npm run build`, output `dist`, clean URLs, cache headers). Set `SITE_URL` for a custom domain so canonical links, Open Graph tags and the sitemap use it.

### Try it (live renders)

`api/render.js` is a Vercel function behind the **Try it free** / **Try** buttons. It renders with a free Pollinations model only (no cost), rejects unfilled `[FIELDS]` and over-long prompts, rate-limits each visitor (8 renders / 10 min per warm instance) and lets Vercel's CDN cache identical requests. It reads the key from the `POLLINATIONS_KEY` environment variable in the Vercel project — never commit the key.

### Per-prompt pages & SEO

Every prompt has its own URL (`/p/<prompt-id>`) with its own title, description, canonical link, Open Graph/Twitter preview (its rendered image) and JSON-LD, plus a no-JavaScript readable version. Opening a prompt in the app updates the URL, so shared links preview correctly. Old `#p-<id>` links redirect.

## Project structure

```
index.html                 App shell
assets/css/styles.css      Design system (tokens, light/dark, components)
assets/js/app.js           UI: grid, filters, modal, builders, workflows
assets/js/library.js       Assembles all sources into one normalised library (pure, testable)
assets/js/thumbs.js        Generative SVG fallback covers (13 motifs)
assets/img/examples/       Real rendered example images (WebP, one per image example)
scripts/generate-images.mjs Renders example images and writes assets/js/data/images.js
scripts/render-prompt.mjs   How an example is reworded into the prompt sent to the image model
scripts/build.mjs           Builds dist/ (prompt pages, render prompts, sitemap)
vercel.json                 Build, clean URLs, cache headers
assets/js/data/*.js        Source prompt data, subject pools and workflows
tests/library.test.mjs     Node test suite
```

### Adding prompts

- **Short commands**: add a line `"/Command|what it does"` to a group in `assets/js/data/commands.js`. Examples, template, thumbnail and search are generated automatically.
- **Long-form prompts**: add an object to `assets/js/data/longform.js` with `template` and an `examples` array (`append: true` appends the example to the master prompt).
- Run `npm test` — it fails if any prompt has fewer than 3 examples, duplicate ids, or broken workflow links.

## Notes

- **Real example images**: every image-prompt example has a real render in `assets/img/examples/<example-id>.webp`, generated from that example's prompt by `scripts/generate-images.mjs` (Pollinations API; Lucid Origin, with Z-Image Turbo as fallback). The prompt's cover is its first concrete example. Video prompts get a rendered key frame of each example video (`--video`). To (re)render, delete an image and run:
  `NODE_USE_ENV_PROXY=1 POLLINATIONS_KEY=sk_... node scripts/generate-images.mjs --video` — it is resumable and rewrites `assets/js/data/images.js`. Never commit the key.
- The renders were made without an uploaded reference, so the "uploaded reference" parts of a prompt are swapped for a concrete subject at render time. Your results with your own photo will follow your reference.
- Slash commands are reusable style labels. If a tool doesn't autocomplete `/`, the plain-English line under the command still works.
- Prompts were curated from the creator guides in the project's Google Drive folder (Google Flow command guides, Higgsfield-in-ChatGPT, Bike Style, Editorial commands, Fashion Campaign, 3D animation shorts and the thefhd.ai commercial prompts).
