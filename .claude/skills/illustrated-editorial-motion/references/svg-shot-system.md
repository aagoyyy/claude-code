# Shot system (toolkit/py/shots.py, build.py)

Draw the world ONCE in world coordinates (larger than the frame: wall x -1200..2400, table to y 1810, counter front below). A camera = `(cx, cy, zoom, roll°)` becomes the SVG `viewBox`.

| Shot | camera (cx, cy, zoom, roll) | depth of field (wall, mid blur) |
|---|---|---|
| Hero three-quarter | 540, 960, 1.0, 0 | none |
| Wide establishing | 560, 800, .72, 0 | none |
| Medium | 470, 1020, 1.45, 0 | 2.5, 0 |
| Close-up | 640, 1470, 2.0, 0 | 6, 4 |
| Extreme close-up (yolk) | 450, 1445, 4.2, 0 | 9, 7 |
| Dynamic / dutch | 520, 1260, 1.5, -7 | 3, 2 |

Top-down is a separate builder (`topdown.py`) reusing the materials: planks parallel (vanishing point at infinity), circles instead of ellipses, soft lit bloom instead of steam wisps.
For animation use the same idea as a `<g transform="translate(540 960) scale(z) translate(-cx -cy)">` and interpolate cx, cy, z over time.
