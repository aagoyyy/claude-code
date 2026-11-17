# Reference video analysis (observed vs inferred)

Source: the user-provided reference MP4 ("Banyak yang melihat mi instan cuma sebagai barang murah…", ~80 s). Method: ffprobe, scene-change detection (`select=gt(scene,0.28)`), 1 frame / 2 s contact sheets (40 frames), full-resolution samples at 1 s, 6 s, 20.5 s, 36.5 s, 49 s, 57 s, 8 fps strips around entrances/transitions (0–3.2 s, 8–9.6 s, 17.2–18.8 s, 53.2–54.8 s), pixel sampling of colors, and audio loudness measurement.

## A. Directly observed
**File:** 720×1280, 30 fps, 80.18 s, H.264 + AAC stereo 44.1 kHz. Loudness: mean −17.3 dB, peak −0.8 dB; very few silent gaps (continuous audio). *I did not listen to the audio; I cannot describe voice, music or SFX content.*

**Cuts (scene-detect > 0.28):** 8.5, 17.6, 18.3, 34.8, 53.5, 57.7, 60.0, 65.6, 67.3, 77.0–77.4 s (+ many soft dissolves below the threshold). Shots run ~2–5 s; ~25 distinct shots.

**Illustration look:** semi-flat editorial illustration with thin dark-brown outlines, soft cel shading and subtle gradients; warm, slightly desaturated palette; soft elliptical ground shadows; gold 4-point sparkles; translucent white steam curls. Proportions are friendly and slightly exaggerated (big bowls, big hands).
**Important:** the art shows AI-generation artefacts — garbled text ("RRp 70.000)0", "CLAIMABIE STARTUP GUIde PACKAGE", "Net Step"), morphing/warping during motion, ghosted cross-dissolves. The reference is raster, not clean vector.

**Backgrounds (alternating):**
1. cream/ivory paper with faint graph grid (sampled paper ≈ `#F6F4F0`, grid ≈ `#E8E6E2`);
2. warm cream `#F7F0DE` above a sand table `#EBC58F` with plank lines;
3. illustrated rooms (warung, kitchen, stove) with wooden counters (≈ `#C8905A`);
4. top-down tables / notebook pages;
5. infographic paper with arrows, boxes and numbers;
6. phone / UI mockups for the CTA.

**Recurring objects:** noodle packet, bowl with egg/greens/chili/steam, red hang-tag price labels (sampled ≈ `#D54F48`, white heavy sans text, string loop, tilted ~−5…−10°), coins with "$/Rp", receipts/bills, notebook with a red price pill, warung storefront, wallet, calendar, ice-tea glass, hands (white sleeves), phone with link icon, isometric COST (orange) / VALUE (green) blocks with a curved red arrow and "40%+ MARGIN".

**Typography (overlay):** top-center brand header, small, bold sans, dark, wide tracking (“BEDAH UMKM”); caption = white bold sans on a **black rectangle** below it; bottom-right small watermark text on a dark box. In-scene: price text white on red tag; big dark heavy sans for infographic titles ("Target Minimal Harian", "BEP"); green/red emphasis for numbers.

**Motion seen in strips:** objects start small and *scale up* strongly (≈1× → 2×+ within ~0.5 s); a hand enters from the right and pats the packet; price tag slides/rotates in from lower-left with a settle; sparkles twinkle (scale + rotate); coin drops from above, bounces, sparkles; steam rises; liquid pours (video-model animation); stacks/bars rise; arrows draw on; labels appear after the object they describe.

**Camera:** continuous push-ins (scale up) and pans; top-down and close-up reframings; rarely static for more than ~1 s.

**Transitions:** hard cuts on beat of the narration; soft cross-dissolves/morphs (with warped ghosting); layered overlay of a new infographic over the previous scene (e.g. "PROFIT / BULAN" panel fading over the warung scene).

**Structure (≈80 s):** hook = price contrast (3.000 → 10–15 ribu) → question ("why doesn't a mie stall go broke?") → cost breakdown item by item (egg 2.000, packet 3.500, seasoning/gas → HPP 7.000) → fixed costs (kiosk rent 1.5 jt, utilities) → break-even (BEP: 15 bowls/day) → profit estimate (Rp 5–7 jt/month) → comparison battle (mie vs es teh) → question to audience → CTA (guidebook, "link di bio").

## B. Inferred (not verifiable from footage)
- Palette hexes in the brief are *starting values*; sampled values above are medians of small regions and approximate (frames are compressed and shaded).
- The reference is probably an AI image-to-video workflow with a subtitle/brand overlay added in an editor. The exact tools, easing curves and durations are unknown; the easing in this system (spring + bezier) is a recommendation chosen to look similar.
- Sound design: unknown.

## C. Decisions for this system
- Keep: paper + grid, warm earth palette, ink outline, price tags, sparkles, steam, infographic blocks, push-in/pull-out camera, number-driven storytelling, label-after-object timing.
- Change: render as **clean deterministic vector** (no morph artefacts, no garbled text); soft shading reduced to one flat shade + one highlight per object; the burned-in black caption box is **optional** (`CaptionBox`).
- Do not copy: watermark text, brand names, the reference's exact illustrations.
