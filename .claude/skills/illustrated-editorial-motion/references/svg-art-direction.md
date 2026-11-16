# SVG art direction system (one visual language across foreground / midground / background)

Implemented in `toolkit/py/kit.py`.

1. **One colour logic.** `tones(base)` returns spec / light / mid / shade / core / bounce. Highlights drift to warm cream (`KEY`), shadows drift to
   violet-brown (`SHADOW`), bounce light is warm orange from the table. Never hand-pick a shade; derive it.
2. **Atmospheric depth.** `atm(colour, d)` pushes far objects to haze and desaturates (d: fg 0, mid .35, bg .8). Background keeps the SAME shapes and
   line language, only fewer layers and lower contrast.
3. **Line hierarchy by depth tier** (`TIER`): fg ≈ 6.4 px, mid ≈ 4.4, bg ≈ 2.8; interior detail ≈ half, hairlines ≈ quarter; background line colour is lightened.
4. **Light-aware ink** (`ink()`): outline width is modulated by the normal vs. light direction (thin on lit side, heavy on shadow side) + tiny hand noise.
   On hero objects also over-paint a lighter stroke on the lit contour so the outline "breaks".
5. **One light.** Key light = window, upper-left (`LD`); shadows fall down-right (`CAST`). Every object gets: contact shadow, cast shadow (sheared,
   blurred silhouette), AO, a material-specific highlight, warm bounce on the underside, a light shaft over the scene.
6. **Organic shapes.** All silhouettes go through `wob()` (periodic low-frequency noise along the normal, 1.5–3.5 px). Never ship a perfect ellipse/rectangle.
7. **Hierarchy.** The story subject has the highest contrast + saturation + a warm spotlight; vignette darkens the periphery; midground is calmer;
   background is hazed. Remove props that have no story purpose (write the purpose in a comment above each prop).
8. **Composition.** Avoid centred vertical stacks. Use diagonals (e.g. midground upper-left → hero lower-right), overlap fg/mid/bg, vary scale.
