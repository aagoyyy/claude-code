# Motion language

Frame-based, deterministic (Remotion). 30 fps. Presets live in `animations/` and `visual-system/MotionPresets.ts`.

| Preset | Component | Behavior | Typical params |
|---|---|---|---|
| A Pop in | `PopIn` | scale from ~0.5 with one soft overshoot, settle ≈ 12–14 f | `delay, from, rotate, config=springs.pop` |
| B Slide in | `SlideIn` | enter from side, decelerate; `overshoot` for light bounce | `from, distance 400–900, overshoot` |
| C Float | `Float` | sine vertical drift, ±6–10 px, period 70–110 f | `amplitude, period, phase, sway` |
| D Gentle rotation | `GentleRotate` | ±2–4° sine rotation | `degrees, period, base` |
| E Draw on | `DrawOnPath` | stroke reveal via `pathLength`, 22–28 f | `delay, duration, stroke` |
| F Scale reveal | `ScaleReveal` | 0.82→1 (no overshoot) + opacity; use for hero objects | `from, to, delay` |
| G Stagger | `StaggerReveal` | children appear every 5–8 f (`stagger.tight/normal/loose`) | `variant pop|slide, interval` |
| H Exit | `ObjectExit` | slide / scale / fade, 12 f, ease-in | `at, mode, to, distance` |
| I Text reveal | `TextReveal`, `Headline` | word or line rise + fade (36 px) | `by word|line, interval` |
| J Label reveal | `LabelReveal`, `PriceTag`, `Callout` | slide + tilted settle (−3…−8°), tiny overshoot | `from, rotate, distance` |
| Kinetic | `KineticText` | per-character pop with alternating tilt | `interval 2 f, size` |
| Count | `NumberHighlight` | eased count-up + pop | `to, duration 24–26` |

## Springs & easing
`springs.pop {damping 11, stiffness 190, mass .7}` · `springs.soft {20,120,.9}` · bezier `out (0.22,1,0.36,1)` for entrances, `inOut (0.65,0,0.35,1)` for camera/transitions, `in` for exits.

## Timing rules (observed pattern + recommendation)
- Object lands first, **label/price follows 8–20 f later**, sparkles 6–12 f after the object.
- Stagger 5–8 f; never more than 6 simultaneous entrances.
- Hold the final state ≥ 12 f before the next exit/transition so the viewer can read.
- Max one overshoot; no elastic wobble loops. Ambient motion (Float/Rotate/steam) runs the whole scene at low amplitude.
- Every scene has one hero motion; everything else supports it.
