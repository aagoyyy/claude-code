# Production checklist

## Before render
- [ ] Storyboard filled; no adjacent identical compositions
- [ ] All colors from `ColorPalette.ts`; new tokens documented
- [ ] New illustrations added to `StyleSheet` and visually matched
- [ ] Safe zone: headline y 220–480, hero within x 60–980 / y 220–1500
- [ ] Composition registered in `Root.tsx` with correct width/height/fps/duration
- [ ] `npx tsc --noEmit` passes

## After render (look at real frames!)
- [ ] ffprobe: 1080×1920, 30 fps, expected duration/frames
- [ ] Frames at every scene start/end and at every transition cut (±3 f)
- [ ] No black edges, no clipped text, no unintended overlaps, no empty first frames after transitions
- [ ] Text readable at phone size (≥ 44 px); prices formatted `Rp 12.000`
- [ ] Motion smooth: no pop-in of finished frames, no jitter, final holds ≥ 12 f
- [ ] Camera clamps ok; ≤ 2 simultaneous camera motions
- [ ] Color consistency across scenes (outline, saturation)
- [ ] Fix → re-render → re-check. Do not report done before this.
