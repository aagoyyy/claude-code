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

## Bootstrap in a fresh session (no project yet)
```bash
mkdir -p work && cd work && npm init -y
npm i remotion@4.0.250 @remotion/cli@4.0.250 react@18.3.1 react-dom@18.3.1 typescript @types/react
mkdir -p src/mie/layers frame
cp <skill>/toolkit/py/*.py frame/            # generator
cp <skill>/toolkit/ts/MieScene.tsx src/mie/  # timeline
cp <skill>/toolkit/ts/Dyn.tsx <skill>/toolkit/ts/morph.ts src/mie/layers/
# edit emit_ts.py: set the output path to src/mie/layers/Layers.tsx and the sys.path to ./frame
python3 frame/emit_ts.py
cat > src/index.ts <<'X'
import {registerRoot} from 'remotion'; import {Root} from './Root'; registerRoot(Root);
X
cat > src/Root.tsx <<'X'
import React from 'react'; import {Composition} from 'remotion'; import {MieScene, SCENE} from './mie/MieScene';
export const Root: React.FC = () => <Composition id="MieScene" component={MieScene} durationInFrames={SCENE.total} fps={SCENE.fps} width={1080} height={1920} />;
X
npx remotion render src/index.ts MieScene out/x.mp4 --browser-executable=/opt/pw-browsers/chromium --concurrency=4
```
Python needs only the standard library (no Pillow/numpy). `MieScene.tsx` imports `./layers/Layers` and `./layers/Dyn`.
To make a different scene, copy `py/scene.py`, change the props/geometry, keep the layer names ↔ timeline in sync.
