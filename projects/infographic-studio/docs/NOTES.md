# Infographic Studio: catatan

Fase 1, tes 01 (`scenes/test01_calculator.html`): adegan 8 detik, 60 fps, 9:16.

Struktur:
- `rig/rig.js`: easing (termasuk overshoot), track keyframe, kick (follow-through), kedip, sendi FK, wajah (kelopak, pupil, alis), mulut parametrik (10 viseme), dan tangan dengan jari.
- `characters/human.js`: builder manusia generik (tampak depan) dan karakter #1 BOSS.
- `sets/office.js`: set kantor 3 lapis (bg, mid, fg) untuk parallax.
- `props/calculator.js`: kalkulator dengan layar hidup.
- `infographics/cards.js`: kartu judul, label sumber, garis kejut.
- `engine/render.mjs`: Playwright ke ffmpeg 60 fps, render paralel per potongan lalu concat. Juga mode stills.
- `engine/contact_sheet.py`: contact sheet 6x5.

Render:
    node engine/render.mjs video scenes/test01_calculator.html projects/test01/out.mp4 60 4 18
    python3 -I engine/contact_sheet.py projects/test01/out.mp4 projects/test01/contact_sheet.png

Belum ada: tampak 3/4 atau samping, kaki yang terlihat di adegan, lip-sync dari VO, audio, dan karakter #2 dan seterusnya.
