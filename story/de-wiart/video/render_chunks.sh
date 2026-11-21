#!/bin/bash
# resumable chunked render of the Story composition (silent, half-res)
cd "$(dirname "$0")"
for i in 0 1 2 3 4 5 6 7; do
  a=$((i*284)); b=$((a+283)); f=out/chunks/c$i.mp4
  [ -s $f ] && continue
  npx remotion render src/index.ts Story $f.tmp.mp4 --frames=$a-$b --scale=0.5 --concurrency=4 --timeout=420000 --browser-executable=/opt/pw-browsers/chromium --log=error > out/chunks/c$i.log 2>&1 && mv $f.tmp.mp4 $f
done
echo ALLDONE > out/chunks/done.txt
