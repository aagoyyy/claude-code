# Technical report — `illustrated-editorial-motion`

## What was built
A reusable production system for 9:16 illustrated editorial explainers: a Claude Code skill (`.claude/skills/illustrated-editorial-motion`) + a Remotion/React/TypeScript/SVG component library (`src/`) + three verified compositions.

| Layer | Files |
|---|---|
| Skill | `SKILL.md`, 9 reference docs (visual identity, color, illustration, motion, camera, transitions, typography, storytelling, **reference-video analysis**), 3 templates |
| Tokens | `visual-system/ColorPalette, ThemeTokens, BackgroundTokens, IllustrationStyle, MotionPresets, Typography` |
| Backgrounds | Paper, Grid, Isolated(+table), TopDownSurface, IllustratedEnvironment (warung/kitchen), Infographic |
| Illustrations (21) | Food: NoodlePacket, NoodleBowl, Steam, Egg, Greens, Chili, SpringOnion, Sachet, MeatBall · Finance: Coin, CoinStack, PriceTagArt, CostLabelArt, Receipt · Business: Warung · Objects: Hand, Notebook, Chopsticks · Technology: Smartphone · Characters: Vendor · Infographics: IsoBlock, ArrowCurve, Sparkle |
| Animation (10) | PopIn, SlideIn, Float, GentleRotate, DrawOnPath, ScaleReveal, StaggerReveal, ObjectExit, TextReveal, LabelReveal |
| Camera | `CameraRig`, 7 presets, `Place`, `SafeZoneGuide` (clamped to canvas, rotation overscan) |
| Transitions | Slide, Scale, Object-driven, Layered, GraphicWipe, ObjectReplace (+ hard cut) |
| Typography | Headline, KineticText, PriceTag, NumberHighlight, Callout, CaptionBox |
| Templates | StorytellingScene, IsolatedObjectScene, TopDownScene, EnvironmentScene, InfographicScene |
| Examples | `VisualStyleDemo` (15 s), `StyleSheet` (still), `SceneTemplatesDemo` (6 s) |

## How to activate in a future project
1. Copy the skill folder to the project (`.claude/skills/`) or to `~/.claude/skills/` for all projects.
2. Copy `src/{visual-system,animations,backgrounds,illustrations,camera,transitions,typography,compositions}` into the project's `src/` (do not overwrite existing files; merge `Root.tsx`).
3. Install: `npm i remotion @remotion/cli react react-dom` (Remotion 4.0.250 was used) and TypeScript.
4. In Claude Code: give a script and say e.g. *"buat video gaya illustrated-editorial-motion dari script ini"*. The skill's six phases run: analysis → storyboard → asset plan → motion plan → implement → QC.
5. Render: `npx remotion render src/index.ts <CompId> out/video.mp4 [--browser-executable=<chromium>]`.

## Verification actually performed
- `npx tsc --noEmit` clean (strict).
- Rendered `NoodleProfitDemo`: 1080×1920, 30 fps, 450 frames = 15.0 s (ffprobe). Inspected frames at every scene and every transition cut; fixed 7 issues found (camera black edges, empty first frame after transition, label overflow, block label placement, kinetic digits overflow, safe-zone breach in scene 4, headline/decor overlap in environments).
- Rendered stills of `StyleSheet` (all illustrations) and `SceneTemplatesDemo` (environment + top-down) — exercises Warung, Vendor, Receipt, Notebook, Chopsticks, Smartphone, TopDownScene, EnvironmentScene.
- Safe-zone box drawn over demo frames; hero objects and text inside x 60–980 / y 220–1500 except decorative table/shadows.
- Used in the demo (so rendered): PopIn, SlideIn, Float, GentleRotate, DrawOn, ScaleReveal, StaggerReveal, ObjectExit, ObjectReplace, TextReveal, LabelReveal, KineticText, CameraRig push/pull/pan/custom keys, Slide/Object/Scale/Layered/GraphicWipe transitions, hard cut.

## Not verified / limitations (be aware)
- No audio was produced or analyzed in the demo; the reference's audio was measured only (loudness), not listened to.
- `cameraPresets.static`, `focus` and `topDown` were only partially exercised (`topDown` in the template demo; `focus` replaced by custom keys in scene 4).
- The reference video is AI-generated raster art with morphing; this library is a flat-vector approximation, so it looks cleaner and simpler (no soft painterly shading, no complex action poses such as pouring or stirring).
- Hand/Vendor illustrations are intentionally simple.
- Remotion Studio (interactive preview) and Three.js were not used or tested. Default engine is 2D SVG as specified.
- Fonts: Inter/Inter Display must exist on the render machine (present in this sandbox); otherwise the stack falls back to Helvetica/Arial.
- Remotion has its own license terms for companies; check before commercial use.

## Extending
Add an illustration → follow `references/illustration-guidelines.md`, add to `StyleSheet`, render the still, compare. Add a transition → implement with `useTransition(at,duration)` and document the use case in `transition-system.md`.
