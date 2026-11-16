# SVG material recipes (see toolkit/py/mat.py, mat2.py)

| Material | Technique |
|---|---|
| Stainless steel | cylindrical horizontal ramp (dark edge → bright → mid → core), ~3 px brushed lines (random white/dark, low opacity), tall window reflection **with the muntin bar** gap, thin 2nd reflection, core shadow on shade side, warm table bounce at the bottom, rolled bands, soot + flame glow at the base. Lids: radial ramp + concentric lathe arcs. Reduce reflection opacity with depth. |
| Ceramic | glaze ramp (white → cream → shade), lower shade rect, terminator on the far side, warm bounce, hand-painted bands (wobbling polylines, edge tints), window-shaped specular with gap, crackle hairlines, unglazed speckled foot ring. |
| Wood | perspective planks via a vanishing point (`xat`), plank tone variation, wavy grain paths, **anisotropic `feTurbulence`** (baseFrequency high in x / low in y for vertical grain) multiplied in as dark + light layers, seams with highlight, knots with rings, scratches, AO at the wall. |
| Glass | faint tint, far-rim ellipse, content (liquid ramp, meniscus ellipse, refracted offset line), ice cubes (rounded squares, translucent, bubbles), fresnel dark edges, vertical specular strips, condensation drops (highlight + tiny tail), near-rim ellipse, tinted cast shadow + caustic patch on the table. |
| Food | noodles: occlusion stroke, shade stroke, body stroke, lit crest stroke, sauce glints, depth-sorted by y; egg: translucent white ramp, yolk radial ramp + specular + pepper; leaf: ramp + backlit margin + vein network; meatball: bumpy outline + pore dots + dull specular; chili: seeds; scallion: ring with inner translucency. |
| Fabric | thread weave from two perpendicular `feTurbulence` layers, soft fold ridge/valley (blurred), stitched hem, tinted border, frayed edge fibres, cast shadow. |
| Fire | layered tongues (blue shell → light blue → white-hot core) sorted by y, per-tongue flicker/lean from frame, radial glow, ignition pop with overshoot. |
| Steam / smoke | thick white strokes → `feTurbulence` + `feDisplacementMap` + blur (organic edges), second thinner core pass, shadowed rim line; animate by drifting baseFrequency with the frame, `strokeDashoffset` flow, sway, grow-from-base; puffs are displaced circles. |
