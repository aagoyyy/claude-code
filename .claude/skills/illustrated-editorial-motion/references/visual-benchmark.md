# Visual benchmark — "does it match the standard?"

Look at `assets/visual-reference/` BEFORE drawing and AGAIN before delivering. Always render the new work at the same framing and put it next to the matching reference.

| File | What it fixes in your head |
|---|---|
| `01-hero-frame-1080x1920.jpg` | the quality bar for one frame: value structure, materials, depth, line weight |
| `02-before-after-direction.jpg` | left = rejected (flat, centred, one stroke weight, grid wall); right = accepted direction |
| `03-shot-system-6-shots.jpg` | wide / medium / close-up / extreme close-up (DOF) / dutch / top-down from ONE world |
| `04-animation-8-keyframes.jpg` | pacing of the 5 s sequence (ignite → lid lift → pull-back → bowl rise → drops → tag swing) |
| `05-motion-reference-5s-540p.mp4` | motion feel at 24 fps (watch it, or extract frames with ffmpeg) |

## Scorecard (grade each 0–2, deliver only if every row ≥ 1 and the total ≥ 16)
1. **Line hierarchy** — three weights by depth; thin on lit side, heavy in shadow; no uniform stroke.
2. **Material separation** — steel, ceramic, wood, glass, food, fabric, fire/smoke each use their own technique (see `svg-material-library.md`).
3. **Light consistency** — one key light; contact + cast shadows; bounce light; highlights are warm, shadows violet-brown.
4. **Depth** — fg/mid/bg overlap, atmospheric haze, DOF in close shots, light shaft/vignette.
5. **Hierarchy** — one hero with the top contrast/saturation; no decor without a story purpose (write the purpose).
6. **Background** — environment, not repetitive pattern (no full-frame grids/dots).
7. **Organic shapes** — every silhouette passes through `wob()`; no perfect ellipses/rectangles.
8. **Composition** — not a centred vertical stack; diagonal flow; safe space for type.
9. **Motion** — anticipation, follow-through, settle; no frozen frames; no jumps (frame-diff check); 24 fps timing.
10. **Constraints** — 100 % SVG, no raster, no hands, deterministic, 1080x1920, 24 fps.

## Required deliverables for any new scene
- hero still + before/after (or vs. the reference) side by side
- shot sheet if the brief mentions framing
- `ffprobe` of the mp4 + contact sheet of 8–12 frames + frame-difference stats
- a plain list of remaining weaknesses
