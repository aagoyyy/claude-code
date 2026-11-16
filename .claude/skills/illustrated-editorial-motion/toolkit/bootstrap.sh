#!/usr/bin/env bash
# Usage: bash <skill>/toolkit/bootstrap.sh [workdir]   (default ./svg-motion)
# Creates a ready-to-render Remotion project (100% SVG, 24 fps, 1080x1920) from the skill toolkit and renders one verification still.
set -euo pipefail
SK="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
W="${1:-./svg-motion}"; mkdir -p "$W"; cd "$W"; W="$(pwd)"
BROWSER="${BROWSER:-/opt/pw-browsers/chromium}"
[ -f package.json ] || npm init -y >/dev/null
npm i --silent --no-audit --no-fund remotion@4.0.250 @remotion/cli@4.0.250 react@18.3.1 react-dom@18.3.1 typescript@5.5.4 @types/react@18.3.3
mkdir -p src/mie/layers frame out
cp "$SK"/toolkit/py/*.py frame/
cp "$SK/toolkit/ts/MieScene.tsx" src/mie/
cp "$SK/toolkit/ts/Dyn.tsx" "$SK/toolkit/ts/morph.ts" src/mie/layers/
cat > src/index.ts <<'X'
import {registerRoot} from 'remotion';
import {Root} from './Root';
registerRoot(Root);
X
cat > src/Root.tsx <<'X'
import React from 'react';
import {Composition} from 'remotion';
import {MieScene, SCENE} from './mie/MieScene';
export const Root: React.FC = () => (
  <Composition id="MieScene" component={MieScene} durationInFrames={SCENE.total} fps={SCENE.fps} width={1080} height={1920} />
);
X
cat > tsconfig.json <<'X'
{"compilerOptions":{"target":"ES2020","module":"ESNext","moduleResolution":"Node","jsx":"react-jsx","strict":false,"skipLibCheck":true,"esModuleInterop":true,"noEmit":true},"include":["src"]}
X
( cd frame && LAYERS_OUT="$W/src/mie/layers/Layers.tsx" python3 emit_ts.py )
if [ -x "$BROWSER" ]; then
  npx remotion still src/index.ts MieScene out/verify.png --frame=119 --browser-executable="$BROWSER" 2>&1 | tail -3; test -s out/verify.png && echo "OK: verification still -> $W/out/verify.png"
else
  npx remotion still src/index.ts MieScene out/verify.png --frame=119 2>&1 | tail -3; test -s out/verify.png && echo "OK: verification still -> $W/out/verify.png"
fi
echo "Project ready: $W   (render: npx remotion render src/index.ts MieScene out/x.mp4 --concurrency=4 [--browser-executable=$BROWSER])"
