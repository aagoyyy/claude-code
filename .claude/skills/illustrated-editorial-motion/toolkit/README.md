# toolkit
py/  — SVG illustration generator (run from a dir containing these files)
  kit.py      colour science, organic geometry, light-aware ink, defs registry
  mat.py      steel, ceramic, wood, glass, fabric
  mat2.py     fire, smoke, food
  scene.py    the noodle-stall world (build(doc, anim=True) -> layers)
  topdown.py  top-down scene
  shots.py    camera shots   |  build.py static assembly  |  emit_ts.py -> src/mie/layers/Layers.tsx
ts/  — Remotion side: MieScene.tsx (timeline), Dyn.tsx (flame / bubbles / steam / puffs), morph.ts (path morph engine)
Usage: python3 emit_ts.py   (writes Layers.tsx)  then  npx remotion render src/index.ts MieScene out/x.mp4 --browser-executable=/opt/pw-browsers/chromium
