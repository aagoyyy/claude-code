# Handoff: editorial motion / script mie (sesi 2026-11-16..17)

Dua proyek Remotion (React + TS + SVG), 24 fps, 1080x1920. Video hasil render TIDAK ikut di repo (ada di chat sesi asal).

## 1. `mie-kv/`: ARAH TERAKHIR YANG DIPAKAI (key visual dapur mie + script bagian 1)
- World/art = skill `mie-kitchen-keyvisual` (+ toolkit `illustrated-editorial-motion/toolkit/py`; md5 kit 840ad7f0..., mat aeed755c..., mat2 6790ea12..., scene 35aa753b...). Folder `kit/` sudah disalin di sini.
- Layer SVG di-generate (tidak ada di repo, 730 KB x2). Regenerasi:
  ```
  npm i
  python3 -I tools/emit_layers.py kit src/mie/layers/Layers.tsx
  python3 -I tools/emit_layers.py kit src/mie/layers/Layers12.tsx "Rp 12.000"
  npx remotion render src/index.ts MieScene out/mie.mp4 --browser-executable=<chrome-headless-shell> --concurrency=$(nproc)   # master 5 s
  npx remotion render src/index.ts Part1 out/part1.mp4 --browser-executable=<chrome-headless-shell> --concurrency=$(nproc)   # 22 s, beat 1-4
  ```
- `src/mie/Script1.tsx` = timeline beat 1-4 (0-5 s identik master, lalu kamera pindah ke tiap bahan). Angka dari objek `DATA`; build gagal kalau HPP != 7.000 atau margin < 40%.
- BELUM dibuat: beat 5-7 (biaya operasional, 15 vs 80 mangkuk + es teh, cuan 5-7 jt, CTA) dan audio/VO.

## 2. `editorial-motion/`: library V1-V6 (banyak eksperimen)
- `src/v6/` = gaya BERSIH ivory-grid, tanpa tangan dan tanpa tekstur (`data.ts` sumber angka, `Board.tsx` papan 6 komposisi, `Demo.tsx`, `Full.tsx` 15 s, `Open.tsx` pembuka script).
- `src/v3` sampai `src/v5` = tangan (`Hand2`), environment bertekstur, fisika. Ditolak user sebagai arah visual (terlalu cokelat dan bertekstur); disimpan sebagai referensi komponen.
- `skill-references/` = dokumen skill versi sesi ini (motion-profiles, hands, transitions, metaphors, physical-motion-v5). Skill resmi ada di `.claude/skills/` repo ini.
- Render: `npm i remotion@4.0.250 @remotion/cli@4.0.250 react@18.3.1 react-dom@18.3.1 typescript @types/react`, lalu `npx remotion render src/index.ts FullV6 out/full.mp4`. Filter tinta (`v4/Ink.tsx`) harus di luar kamera dan di-clip, kalau tidak frame yang di-zoom bisa makan menit.

## Catatan penting
- Arahan user terakhir: gaya = key visual dapur mie. Sebelumnya user minta V6 bersih. Tanyakan lagi kalau ragu.
- Aset gambar AI: kuota gambar Google AI Studio habis (429); plugin Blueprint Studio Asset Generator butuh otorisasi OAuth akun dan host `tools.blueprintstudio.ai` diizinkan di environment.
- Transkrip script ada di `script-transcript.md`.
