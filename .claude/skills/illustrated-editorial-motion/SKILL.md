---
name: illustrated-editorial-motion
description: Produce 9:16 "Illustrated Editorial Explainer" motion graphics in Remotion (React + TypeScript + SVG). Use when the user gives a script/story/topic and wants an explainer video with hand-drawn editorial 2D vector illustrations on warm ivory graph paper, price tags, infographics, kinetic typography, object-driven transitions, and storytelling scene planning (money, food, business, UMKM, finance, how-it-works topics). Also use when asked for "gaya video ilustrasi editorial", "bedah UMKM style", or to extend the illustration/animation library of this system. Do NOT use for the ink-puppet character style, 3D, photo-realistic, or screen-recording videos.
---

# Illustrated Editorial Motion

A reusable production system: **reference video defines the look, this skill defines the rules, Remotion executes.**
Output: 1080x1920, **24 fps**, deterministic (frame-based) videos built from **100 % SVG** illustrations and animation components.

> **STANDARD v2 (current) — read `references/svg-production-standard.md` first.** SVG only (no raster/AI/stock), Remotion 24 fps, **no animated human hands**, quality over speed.
> Art direction, materials, shots and the layer/animation pipeline: `references/svg-art-direction.md`, `svg-material-library.md`, `svg-shot-system.md`, `svg-layer-animation-pipeline.md`, `lessons-learned.md`. Reusable code: `toolkit/` (`py/` generator, `ts/` Remotion scene + dynamic components). Anything older below that mentions 30 fps or hands is legacy.

## Activate when
- The user provides a script, topic, or story for a vertical explainer and has not asked for a different visual direction.
- The user asks for illustrations/animations in the "editorial paper + ink outline + price tag" look.

If the user explicitly asks for another style, follow the user and do not apply this skill's visuals.

## First, inspect the project (never overwrite blindly)
1. `ls` the project; find `package.json`, `src/Root.tsx`, `remotion.config.*`.
2. If the visual system already exists (`src/visual-system/ColorPalette.ts`), reuse it. If not, copy it from the template project (`/home/user/editorial-motion/src/*`) **without overwriting** existing files; merge `Root.tsx` by adding compositions, not replacing it.
3. Check Remotion works: `npx remotion render ... --browser-executable=<chromium>` on a 30-frame test. In sandboxes use `/opt/pw-browsers/chromium`.

## Workflow (6 phases — do not skip)
Use the templates in `templates/`.

| Phase | Do | Read first |
|---|---|---|
| 1 Script analysis | narrative structure, main message, tone, key numbers, visual opportunities | `references/storytelling-guidelines.md` |
| 2 Storyboard | one row per scene (duration, script, concept, hero object, composition, background, animation, camera, transition, sound) → fill `templates/storyboard-template.md` | `storytelling-guidelines.md`, `camera-language.md`, `transition-system.md` |
| 3 Asset planning | list illustrations; reuse `src/illustrations/*`; **create only missing ones** in the same SVG rules | `references/illustration-guidelines.md`, `color-system.md` |
| 4 Motion planning | exact frame timings (entrances, exits, text, camera, transitions) → `templates/scene-breakdown-template.md` | `references/motion-language.md` |
| 5 Implement | scenes from `compositions/*` + `animations/*` + `typography/*`; one `<Sequence>` per scene; transitions as overlays on cut frames | `typography-system.md` |
| 6 QC | render, extract frames, run `templates/production-checklist.md`; fix, re-render | all |

## Hard rules
- **Colors only from `visual-system/ColorPalette.ts`.** Add a token (with a reason) before using a new hex.
- **Every illustration** goes through `<Illustration>` (viewBox + ink filter) and spreads `ink` / `inkThin` from `IllustrationStyle.ts`. No raster, 3D, Blender, or AI-image dependencies.
- **Safe zone:** text and hero objects inside x 60–980, y 220–1500 (`SAFE_RECT`). Headlines live in y 220–480; keep environment decor below y 540.
- **Deterministic motion only:** `useCurrentFrame` + `spring`/`interpolate`. No `Math.random`, no `Date`, no CSS transitions/animations.
- **Camera never shows outside the 1080x1920 canvas** (`resolveCamera` clamps; rotation adds overscan). Do not combine more than two camera motions at once.
- **Do not illustrate every sentence literally**; look for a metaphor (see storytelling guidelines). Avoid repeating the same composition in consecutive scenes.
- **Text legible on a phone:** body ≥ 44 px, one idea per screen, numbers/prices are visual elements.
- Never claim something renders or looks right before rendering and looking at frames.

## Building blocks (import paths under `src/`)
- Tokens: `visual-system/{ColorPalette,ThemeTokens,BackgroundTokens,IllustrationStyle,MotionPresets,Typography}.ts`
- Backgrounds: `backgrounds/{PaperBackground,GridBackground,IsolatedBackground,TopDownSurface,IllustratedEnvironment,InfographicBackground}`
- Illustrations: `illustrations/{Food,Finance,Business,Objects,Technology,Characters,Infographics}` (see guidelines for the full list)
- Animation: `PopIn, SlideIn, Float, GentleRotate, DrawOnPath, ScaleReveal, StaggerReveal, ObjectExit, TextReveal, LabelReveal`
- Camera: `CameraRig`, `cameraPresets.{static,pushIn,pullOut,panX,panY,focus,topDown}`, `Place`, `SafeZoneGuide`
- Transitions (overlays on a cut frame): `SlideTransition, ObjectTransition, ScaleTransition, LayeredTransition, GraphicWipe, ObjectReplace` (+ hard cut = adjacent `<Sequence>`s)
- Typography: `Headline, KineticText, PriceTag, NumberHighlight, Callout, CaptionBox`
- Scene templates: `StorytellingScene` (generic), `IsolatedObjectScene, TopDownScene, EnvironmentScene, InfographicScene`
- Examples: `examples/VisualStyleDemo.tsx` (15 s demo), `StyleSheet.tsx` (all illustrations), `SceneTemplatesDemo.tsx`

## Scene recipe
```tsx
<Sequence from={T.s3} durationInFrames={D.s3}>
  <IsolatedObjectScene tableLine={1300} camera={cameraPresets.pushIn(D.s3, 0.06, 540, 900)}
    overlay={<Headline text={['Tambah topping']} accent={['topping']} />}>
    <Place x={540} y={1010}><PopIn delay={4}><NoodleBowl size={820} filled /></PopIn></Place>
  </IsolatedObjectScene>
</Sequence>
<ObjectTransition at={T.s4} duration={22}><PriceTagArt size={620} text="Rp ?" /></ObjectTransition>
```
Backgrounds + objects go in the *world* (children, moved by camera); typography goes in `overlay` (fixed).

## Rendering
```
npx remotion render src/index.ts <CompId> out/<name>.mp4 --browser-executable=/opt/pw-browsers/chromium --concurrency=4
npx remotion still  src/index.ts <CompId> out/frame.png --frame=120 --browser-executable=/opt/pw-browsers/chromium
```
QC: extract frames with ffmpeg at scene starts/ends and at every transition cut; draw the safe-zone box and check.

## Audio
This system produces picture. Sound design is a *recommendation* in the storyboard (soft paper pop for pop-ins, light tick for labels, coin chime for money, whoosh for slides). Voice-over and music are added separately; if VO exists, time scenes to measured sentence durations.

## V4 system (legacy where it conflicts with Standard v2)
- `references/composition-engine.md` — composition kinds, diversity rule, shot sizes, environments
- `references/hands-and-interaction.md` — `Hand2` poses and the rigid hand+object rule (open, grab, pour, place, present)
- `references/motion-profiles.md` — per-category motion (hand/food/coin/label/type/bg/camera) + anticipation/action/follow-through/settle
- `references/object-driven-transitions.md` — camera push-through, bowl->top-down iris, coin wipe
- `references/visual-metaphors.md` — translate meaning into visuals (profit, costs, competition, growth, efficiency)
- Illustration: ink line world + paper texture + matte shading (see `illustration-guidelines.md` V4 section)

- `references/physical-motion-v5.md` — contact chain (reach/grip/lift/release/fall/impact/settle), selective effects, mobile typography hierarchy, payoff composition, timing budget

Extra V5 hard rules:
- Model physical interactions as one precomputed per-frame simulation (hand tip -> pendulum -> fall -> impact -> settle); both objects react at contact.
- Rotation must follow the trajectory but stay bounded (±25°); check frames right after release for tumbling.
- No decorative starbursts/sparkles by default; functional contact effects only.
- One primary message per scene, headline 62–70 px, key numbers ≥ 50 px, no labels < 34 px, nothing animated over key text.
- Closing scene = subject + business context + one big number + controlled pull-out and a hold.
- Demo: `v5/DemoV5.tsx` (24 fps, 120 f).

Extra V4 hard rules:
- Put `InkLineWorld` *outside* `CameraRig` (screen-size filter); never filter a zoomed world.
- Drive the object, derive the hand (rigid system). No independent floating objects when a hand is on screen.
- Pick a motion profile per object; do not reuse one spring.
- Author timing in seconds, convert with fps (V4 demo = 24 fps, 120 f = 5 s).
- Check `checkDiversity` passes; choose a visual metaphor per scene and write it in the storyboard.
- Demos: `v3/DemoV3.tsx` (30 fps), `v4/DemoV4.tsx` (24 fps: kitchen rip+pour -> bowl-to-top-down iris -> financial chart -> coin wipe -> wide street).

## Reference analysis caveat
The reference video's imagery was AI-generated raster art (visible artefacts). This system is a deterministic **vector approximation** of its language, not a copy. Never reproduce the reference's watermark or brand text. See `references/reference-video-analysis.md`.
