# What If the Sun Vanished? (Three.js)

Episode pilot untuk channel space what-if.

```
sun-vanishes/
├── script.md              naskah VO (English) + visual notes + fact-check
├── scene-test/            scene Three.js (index.html + main.js)
├── tools/
│   ├── shots.cjs          screenshot di waktu tertentu: node shots.cjs 2 8 12.3
│   └── render.cjs         render frame-by-frame ke MP4 (Playwright + ffmpeg)
└── out/                   hasil render (di-gitignore kecuali MP4 preview)
```

## Jalankan preview interaktif

```bash
cd scene-test && npm install && python3 -m http.server 8765
# buka http://localhost:8765/index.html
# klik / spasi = pause, panah kiri/kanan = mundur/maju 1 detik
```

## Render MP4

Scene harus sedang di-serve di port 8765 (perintah di atas), lalu:

```bash
cd tools && node render.cjs 24
```

Setiap frame adalah fungsi murni dari waktu `t` (`window.__setTime(t)`), jadi hasilnya
deterministik dan tidak bergantung FPS komputer.

## Catatan skala

Ukuran dan kecepatan sengaja dilebih-lebihkan supaya terbaca di layar. Di dunia nyata Bumi
hanya bergeser ~15.000 km selama 8 menit 20 detik itu. Satu detik di test = ±62 detik
story-time pada fase 4–12 s.
