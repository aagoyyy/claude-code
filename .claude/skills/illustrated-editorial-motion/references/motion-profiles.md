# Motion profiles (V4)

Different object categories move differently. Never reuse one spring for everything. Source: `src/v4/profiles.ts` (`progress(cat, frame, start, fps)`, `wobble(cat, frame, impactFrame)`, `springCfg`, `ease`). Author timings in **seconds** and convert with the composition fps (the V4 demo runs at **24 fps**).

| Category | Character | Config | Use for |
|---|---|---|---|
| hand | articulated, natural, no bounce: wind-up -> fast travel -> settle | spring {damping 30, stiffness 140, mass 1}; `act()` for anticipation | hands, anything a hand drives |
| food | soft, organic, jelly wobble, long settle | spring {8, 85, 1.15}; `wobble('food')` k=9 w=.55 | bowls, noodles, toppings, liquids |
| coin | snappy, playful, 2–3 bounces | spring {6.5, 300, 0.5}; `wobble('coin')` k=4 w=1.15 | coins, stacks, money |
| label | fast pop, ONE small overshoot, controlled settle | spring {13, 340, 0.6} | price tags, callouts, badges |
| type | precise & readable: ease-out cubic, zero overshoot | bezier (.16,1,.3,1) | headlines, numbers, subtitles |
| bg | subtle or static | linear, very slow | environment drift, steam, clouds |
| camera | smooth & purposeful | bezier in-out (.65,0,.35,1), no spring | all camera moves |

## Every major movement has 4 beats
**Anticipation** (small move opposite the action, 2–4 f) -> **Action** (fast, 4–8 f, controlled overshoot) -> **Follow-through / secondary motion** (damped wobble of parts that lag: wrist, toppings, packet) -> **Settle** (rest pose held ≥ 4 f). Helpers: `act(f, start, wind, dur, back, overshoot)` (`src/v3/motion.ts`), `dampSin`, `dampCos`, `shadowResponse`, `topDownScale`.

## Shadow response
Shadow size/opacity follow object height (smaller + lighter when high); top-down objects scale up with height (`topDownScale`).

## Frame rate
Timings are frames. When changing fps, rescale all start frames (`frame = round(seconds * fps)`); do not just change the fps value. 24 fps looks more filmic but gives fewer keyframes: make each key pose clearer.
