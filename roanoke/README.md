# The Lost Colony of Roanoke (Three.js visual test)

```
roanoke/
├── script.md              naskah lengkap (versi asli dari user, tidak diubah)
├── scene-test/            scene Three.js (index.html + main.js)
├── tools/
│   ├── shots.cjs          screenshot di waktu tertentu: node shots.cjs 3 15.8 24.5
│   └── render.cjs         render frame-by-frame ke MP4 (Playwright + ffmpeg)
└── out/                   hasil render
```

## Isi scene test (27 detik)

| Detik | Adegan | Baris script |
|---|---|---|
| 0–9 | Kapal John White mendekat lewat kabut pagi, bendera St George | "In August 1590, he finally returned to Roanoke." |
| 9–15 | Kamera meluncur rendah di atas pantai ke permukiman kosong | "No people waiting for him. No welcoming signals." |
| 13–18 | Rangka rumah, cerobong tersisa, pagar patah, tong dan peti | "The houses and fortifications had been dismantled." |
| 18–22 | Tiang gerbang, huruf CROATOAN menyala satu per satu | "A word carved into a wooden post" |
| 22–27 | Judul, "no cross", fade out | "But there was no cross beside the word." |

Counter **COLONISTS FOUND 0 / 115** di pojok kanan atas adalah motif visual yang bisa dipakai
sepanjang video (tetap 0).

## Jalankan preview interaktif

```bash
cd scene-test && npm install && python3 -m http.server 8766
# buka http://localhost:8766/index.html  (klik / spasi = pause, panah = +/-1 detik)
```

## Render MP4

Scene harus sedang di-serve (perintah di atas), lalu:

```bash
cd tools && node render.cjs 24
```

Setiap frame adalah fungsi murni dari waktu `t`, jadi hasilnya deterministik.

## Catatan fakta untuk script (cek sebelum rekam)

- **Judul Chapter 4 "The Word on the Tree"** tapi isinya "wooden post". Menurut catatan John White,
  ada dua temuan: tiga huruf **"CRO"** di sebuah pohon, dan kata **"CROATOAN"** di tiang pagar.
  Pilih satu konsisten, atau sebut keduanya.
- **"Around 115 colonists"**: angka yang sering dipakai 115–117 (termasuk bayi yang lahir di sana).
  "Around 115" aman.
- **Tanggal kembalinya White**: 18 Agustus 1590, yaitu ulang tahun ke-3 Virginia Dare. Detail ini
  bagus untuk emosi di Chapter 3/4 kalau mau dipakai.
- **Estimasi durasi**: script ±1.700 kata, kira-kira 11–12 menit kalau dibaca 150 wpm.
  Penanda waktu di script (sampai 15:00) mengasumsikan tempo lebih lambat atau banyak jeda visual.
- **Skala visual**: pohon, rumah, dan kapal adalah representasi low-poly bergaya, bukan rekonstruksi
  arkeologis. Kalau mau dipakai sebagai "rekonstruksi", sebut jelas di video.
