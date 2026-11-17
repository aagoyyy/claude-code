# Physical motion & storytelling polish (V5)

Principle: **one physical system, not independent animations.** When object A touches object B, both react.

## Contact chain (example: packet enters bowl — `src/v5/DemoV5.tsx`)
1. **Reach** the hand enters (hand ease) · **Contact** pinch closes · **Grip** held
2. **Anticipation** a small dip before the lift (`tipAt`, f7–10)
3. **Lift + carry** accelerate then decelerate (ease-in-out); the object **hangs from the pinch point as a damped pendulum driven by the hand's acceleration** (`SIM` precompute): it lags, swings, settles
4. **Release** `pinch -> open`; the packet inherits the hand's velocity
5. **Fall** gravity; **rotation follows the trajectory** (lean into motion, bounded to ±~25°; never let it tumble)
6. **Contact** with the target: bowl squashes + tilts a little (damped), broth ripples, droplets, steam puff, noodles bloom (secondary), camera shake (small, decays)
7. **Occlusion & settle** the object dives behind the bowl's front rim (clip), drifts to the middle, leans on the rim, damped
8. **Return** the hand leaves up/out with follow-through and fades

Implement by **precomputing the simulation per frame** (arrays) so every frame is deterministic and scenes can read `SIM[f]`.

## Selective graphic effects
No decorative starbursts or sparkles by default. Allowed: functional droplets/ripples at real contact, one subtle shake, steam. A burst/flash is allowed once per video for the single biggest impact, if at all.

## Typography hierarchy (mobile, 1080x1920)
- **One primary message per scene**: a `BlackLabel` at 62–70 px (S1 "Mi instan Rp 3.000", S2 "Modal vs harga jual", S3 "Untung Rp 5.000 per mangkuk").
- **Big numbers**: chart values 50 px, profit tag 60 px, price tag ≥ 0.13 × width.
- No tiny labels (<34 px at 1080 wide); no category tabs / subtitles unless they carry new information.
- Moving elements (tags, hands) must not cover the headline or the numbers: tags exit before the action (S1 has no tag), text layers sit above the world layer.
- Timing: text appears 2–10 frames after the object it describes and stays through the hold.

## Story payoff / closing composition
Main subject (the bowl, large, on the vendor table), supporting business elements (warung, coin columns), clear headline (the profit number), balanced thirds (warung left, bowl right, tag above), controlled final camera: pull-out 1.28 -> 1.0 then **hold ≥ 8 frames**.

## Timing budget
5 s is dense. Give each idea ≥ 1.2 s (≈ 30 f @24fps) to be understood; if the brief lists more ideas than the duration allows, merge them (e.g. financial infographic inside the top-down scene) rather than shortening each beat.
