#!/bin/bash
# resumable chunked render of the animated Film (silent, half-res, 12 fps)
cd "$(dirname "$0")"
TOTAL=7860; N=12; SZ=$(( (TOTAL + N - 1) / N ))
for i in $(seq 0 $((N-1))); do
  a=$((i*SZ)); b=$((a+SZ-1)); [ $b -ge $TOTAL ] && b=$((TOTAL-1)); f=out/film/c$i.mp4
  [ -s $f ] && continue
  for try in 1 2 3; do
    timeout 900 npx remotion render src/index.ts Film $f.tmp.mp4 --frames=$a-$b --scale=0.5 --concurrency=4 --timeout=240000 --browser-executable=/opt/pw-browsers/chromium --log=error > out/film/c$i.log 2>&1 && mv $f.tmp.mp4 $f && break
    pkill -f chrom; sleep 2
  done
done
echo ALLDONE > out/film/done.txt
