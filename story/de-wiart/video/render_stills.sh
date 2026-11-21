#!/bin/bash
# usage: render_stills.sh id1 id2 ...   (renders out/stills/<id>.png at 960x540)
cd "$(dirname "$0")"
for id in "$@"; do
  npx remotion still src/index.ts Still out/stills/$id.png --props="{\"id\":\"$id\"}" --scale=0.5 --timeout=120000 --browser-executable=/opt/pw-browsers/chromium --log=error 2>&1 | grep -i "error" | head -3
done
