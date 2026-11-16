# Generator → layers → animation (toolkit/)

Fastest start: `bash toolkit/bootstrap.sh ./svg-motion` (installs Remotion, copies the toolkit, generates `Layers.tsx`, renders a verification still).

1. `py/scene.py: build(doc, anim=True)` returns `(LAYERS, META)`: ordered named layers (wall, table, stove, pot, flame, lid, glass, placemat, bowl, noodles,
   each topping, lip, chopsticks, tag, fx) and the pivot position of each topping. Dynamic things (flame, steam, bubbles, puffs) are **omitted** in anim mode.
2. `py/emit_ts.py` converts every layer to JSX (`stroke-width`→`strokeWidth` …) → `src/mie/layers/Layers.tsx` (`Defs`, `LAYERS`, `META`).
3. `ts/Dyn.tsx` — frame-driven React SVG: `Flame`, `Bubbles`, `Steam` (animated turbulence), `Puffs`.
4. `ts/MieScene.tsx` — timeline: camera path, spring-driven rigs, drops with squash, pendulum tag, steam envelopes.

Motion patterns that worked at 24 fps (120 frames = 5 s):
- ignition pop: `1 - e^{-t/2.6}·cos(0.9t)`; flicker = sum of two sines per tongue;
- lid: anticipation dip (−3 frames) → rattle ramp (|sin|·5 px) → `spring({damping 9, stiffness 70})` lift with small overshoot → slow hover;
- bowl rig: spring rise + decaying squash (`0.06·e^{-t/4}·cos(0.9t)`) at pivot on the ground line;
- noodles: scaleY spring from .08 + `feDisplacementMap` scale 46→0 (liquid settle) — only mount the filter while scale > .5 (render cost);
- drops: `fall = 1 - u²` (u = t/7 frames), squash `0.2·e^{-t/3.2}·cos(0.95t)`, one bounce, spin decays to 0; **keep fall distance short (~250–330 px)** or objects cross unrelated props;
- tag: pendulum `26°·e^{-t/9}·cos(0.62t)` about the eyelet;
- camera: slow push in the first shot, eased pull-back (cubic in/out) to the hero framing, slow push at the end. Don't start the bowl rise and the pull-back in the same frames if the result feels busy (frames 55–70 had the largest frame diff).

QC script (do this every time): render mp4 → `ffprobe` (1080x1920, 24 fps, nb_frames) → sample 8–12 frames into a contact sheet → mean absolute difference between consecutive frames
(look for 0 = frozen, spikes = jumps) → inspect crops at 100 %.

Performance: `feTurbulence`/`feDisplacementMap` are heavy; one 120-frame render of the full scene ≈ several minutes at concurrency 4. Wall/table plaster+grain filters are static but re-evaluated per frame.
