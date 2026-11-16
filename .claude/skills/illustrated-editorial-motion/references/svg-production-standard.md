# SVG production standard (v2 — current, supersedes older fps / hand / raster notes)

Mandatory for every new piece unless the user explicitly overrides it.

- **100 % SVG.** Every illustration, environment, chart, typographic graphic and decoration is native SVG or a React SVG component.
  Forbidden: PNG/JPEG/stock/AI-generated raster, pre-rendered sequences, canvas drawing, rasterising during composition.
  SVG filters (`feTurbulence`, `feDisplacementMap`, `feGaussianBlur`, `feColorMatrix`) ARE allowed: they are SVG-native and deterministic.
- **Remotion, frame-based.** 1080x1920, 9:16, **24 fps**. `useCurrentFrame`, `useVideoConfig`, `interpolate`, `spring`, `Sequence`.
  Never `setTimeout`, `requestAnimationFrame`, CSS animation, `Math.random`. Same frame => same pixels (seeded RNG only, at generation time).
- **No animated human hands or hand interactions.** Tell the story with object motion, object-to-object interaction, environment (steam, fire,
  boiling, light), camera, typography, infographics, metaphors and object-driven transitions. (e.g. a lid is lifted by steam pressure.)
- **Quality over speed.** SVG-only does not mean icons: layered Bezier silhouettes, controlled line weight, material rendering, lighting.
- **QC = look at rendered frames** at the real spec. "It compiles" is not done. Check outline consistency, hierarchy, timing, smoothness,
  transitions, phone readability. Compute frame-to-frame difference to catch frozen or jumping frames.
- Preserve the established art direction; do not drift to watercolour, sepia, pencil sketch.
- Old documents in this skill that mention 30 fps, `Hand2`, hand rigs, raster/AI references: treat as **legacy**.
