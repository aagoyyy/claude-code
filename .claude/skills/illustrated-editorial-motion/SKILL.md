---
name: illustrated-editorial-motion
description: Produce 9:16 illustrated editorial explainer motion graphics, 100% SVG in Remotion (24 fps, 1080x1920, no raster, no animated hands). Use when the user gives a script/story/topic and wants a vector-illustrated explainer, a hero frame, a shot, or a 5-10 s animation in the "editorial illustration" look (rich SVG materials, light-aware ink, depth, price tags, infographics, kinetic type, object-driven transitions). Also use for "gaya video ilustrasi editorial", "bedah UMKM style", UMKM/food/finance/business/how-it-works topics, or to extend this illustration/animation library. Do NOT use for ink-puppet characters, 3D, photo-realistic, AI-image, or screen-recording videos.
argument-hint: "<topik / script / brief>  atau  frame | shot <jenis> | animasi <N detik> | qc"
---

# Illustrated Editorial Motion — Standard v2

Reference video defines the *direction*, this skill defines the *rules and the visual bar*, Remotion executes. **100 % SVG, 24 fps, 1080x1920, no animated hands.**

## How to use (called as `/illustrated-editorial-motion <brief>`)
Treat the text after the command as the brief. Pick the mode:

| Brief looks like | Do |
|---|---|
| a topic / script | full workflow below (storyboard → art plan → build → render → QC) |
| `frame <subject>` | one hero still (SVG → PNG) + before/after vs. the benchmark |
| `shot <wide/medium/closeup/xcu/dutch/topdown>` | render that framing from the world (`references/svg-shot-system.md`) |
| `animasi <N detik>` | layer the scene and animate (`references/svg-layer-animation-pipeline.md`) |
| `qc` | score the given work with `references/visual-benchmark.md` |
If the brief is too thin to storyboard, ask at most 2 questions, otherwise make the call and state assumptions.

## Step 0 — Look at the benchmark (mandatory)
`Read` the images in `assets/visual-reference/` (01 hero, 02 before/after, 03 shot system, 04 keyframes; 05 is a 5 s mp4: extract frames with ffmpeg). That is the quality bar. Do not start drawing before you have looked.

## Step 1 — Project
- Existing project with `src/mie/` and `Layers.tsx`: reuse it.
- Otherwise: `bash <this-skill>/toolkit/bootstrap.sh ./svg-motion` (installs Remotion 4.0.250, copies the generator + Remotion scene, emits the layers, renders a verification still). Chromium at `/opt/pw-browsers/chromium` in sandboxes.

## Standard (hard rules)
- **SVG only.** No PNG/JPEG/stock/AI raster, no canvas, no pre-rendered sequences. SVG filters (`feTurbulence`, `feDisplacementMap`, blur, colour matrix) are allowed.
- **Remotion frame-based, 24 fps.** `useCurrentFrame`, `spring`, `interpolate`, `Sequence`. No `setTimeout`, `requestAnimationFrame`, CSS animation, `Math.random` (seeded RNG at generation time only). Same frame ⇒ same pixels.
- **No animated human hands / hand interactions.** Story via objects, environment (steam, fire, boiling, light), camera, typography, infographics, metaphors, object-driven transitions.
- **Quality over speed. Never call it done because it compiles** — look at rendered frames at 100 % and run the scorecard.
- Keep the established direction: no watercolour, sepia, or pencil sketch.

## Art direction in one screen (details: `references/svg-art-direction.md`)
1 colour logic (`tones`, `atm`) · 3 line tiers by depth + light-aware ink · 1 key light (window, upper-left) with contact/cast/AO/bounce · organic `wob()` silhouettes · hero = highest contrast, bg hazed · every prop has a story purpose · diagonal composition, not a centred stack.
Materials (`references/svg-material-library.md`): steel, ceramic, wood, glass, food, fabric, fire, steam/smoke — each with its own SVG technique.

## Workflow
1. **Script → storyboard.** Message, key numbers, one idea per scene, a visual metaphor per scene (`references/storytelling-guidelines.md`, `visual-metaphors.md`, `templates/storyboard-template.md`). Write each prop's story purpose.
2. **Art plan.** World layout (bg / mid / fg tiers, light direction, hero, camera per scene). Reuse the generator (`toolkit/py/scene.py`) or write a new `scene.py` using `kit.py` + `mat*.py`.
3. **Build.** Generate SVG → render the hero still → compare with benchmark 01 → fix → only then animate.
4. **Animate** (24 fps): layers + frame-driven dynamic parts (`Dyn.tsx`) + timeline (`MieScene.tsx`). Anticipation → action → follow-through → settle; short falls; no simultaneous camera move + hero entrance if it gets busy.
5. **Render & QC.** `npx remotion render … --concurrency=4`; `ffprobe`; contact sheet; frame-diff stats; crops at 100 %; scorecard (`references/visual-benchmark.md`).
6. **Deliver** the files + a plain list of remaining weaknesses. Typography/price tags: `references/typography-system.md` (safe zone x 60–980, y 220–1500, body ≥ 44 px).

## Files
- `assets/visual-reference/` benchmark images + 5 s motion clip
- `references/` standards, art direction, materials, shots, pipeline, benchmark, lessons learned (+ legacy v1–v6 docs, do not follow where they conflict)
- `toolkit/py/` generator (kit, mat, mat2, scene, topdown, shots, build, emit_ts) · `toolkit/ts/` Remotion scene + dynamic components · `toolkit/bootstrap.sh`
- `templates/` storyboard, scene breakdown, production checklist
