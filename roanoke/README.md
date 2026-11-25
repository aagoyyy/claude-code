# The Lost Colony of Roanoke (Three.js visual test v2)

```
roanoke/
├── script.md              naskah lengkap (versi asli dari user, tidak diubah)
├── scene-test/            scene Three.js (index.html + main.js)
├── tools/
│   ├── shots.cjs          screenshot di waktu tertentu: node shots.cjs 3 15.8 24.5
│   └── render.cjs         render frame-by-frame ke MP4 (Playwright + ffmpeg)
└── out/                   hasil render (v1 = 27 detik, v2 = 50 detik)
```

## v2: 10 shot (50 detik)

| # | Detik | Shot | Baris script |
|---|---|---|---|
| 1 | 0–7 | Wide laut: kapal John White, burung camar, kolom asap tipis jauh di balik hutan | "August 1590. John White finally returns to Roanoke." |
| 2 | 7–11 | **POV dari haluan kapal** menghadap pulau | "There is no sign of the settlement he remembered." |
| 3 | 11–15.5 | Meluncur rendah lewat ombak pecah, rangka rumah mulai kelihatan di atas pagar | "No people waiting for him. No welcoming signals." |
| 4 | 15.5–20 | **INSERT: jejak kaki** di pasir, busa ombak menyapu | "Only an abandoned colony." |
| 5 | 20–25 | **Aerial** permukiman: pagar, rangka rumah, jejak kaki menuju gerbang | "The houses and fortifications had been dismantled." |
| 6 | 25–30 | Plaza, rangka rumah jadi siluet melawan matahari, burung gagak | "No obvious evidence of a violent struggle..." |
| 7 | 30–34 | **INSERT: barang tertinggal** (boneka kayu, helm, buku catatan, pot pecah, bangku terbalik) | "No clear explanation for the disappearance." |
| 8 | 34–40 | Mendekati tiang gerbang | "But then, White found something..." |
| 9 | 40–43.5 | **INSERT: ukiran huruf** menyala satu per satu, kamera turun mengikuti kata | (tanpa caption) |
| 10 | 43.5–50 | Komposisi akhir + judul CROATOAN, fade out | "But there was no cross beside the word." |

### Gerakan hidup
Burung camar dan gagak (kepakan sayap, mengitari), asap tipis dari api yang sudah dingin dan satu kolom
asap jauh di cakrawala, rumput dan pohon bergoyang tertiup angin, ombak yang datang dan pecah di pantai
(busa), kabut tipis yang bergeser, bendera kapal berkibar.

### Cerita lewat objek
Jejak kaki keluar dari tiap rumah menuju gerbang, lalu turun ke pantai dan menyusuri garis pantai.
Rumah berupa rangka kayu (tiang, rangka atap, balok bubungan, sisa papan dinding, sisa atap jerami),
cerobong batu yang masih berdiri, dan barang yang tertinggal.

## Jalankan preview interaktif

```bash
cd scene-test && npm install && python3 -m http.server 8766
# buka http://localhost:8766/index.html  (klik / spasi = pause, panah = +/-1 detik)
```

## Render MP4

Scene harus sedang di-serve (perintah di atas), lalu:

```bash
cd tools && node render.cjs 24 ../out/hasil.mp4
```

Setiap frame adalah fungsi murni dari waktu `t`, jadi hasilnya deterministik. Render 50 detik di
mesin tanpa GPU makan sekitar 5-6 menit.

## Catatan fakta untuk script (cek sebelum rekam)

- **Judul Chapter 4 "The Word on the Tree"** tapi isinya "wooden post". Menurut catatan John White,
  ada dua temuan: tiga huruf **"CRO"** di sebuah pohon, dan kata **"CROATOAN"** di tiang pagar.
  Pilih satu konsisten, atau sebut keduanya.
- **"Around 115 colonists"**: angka yang sering dipakai 115–117 (termasuk bayi yang lahir di sana).
- **Tanggal kembalinya White**: 18 Agustus 1590, yaitu ulang tahun ke-3 Virginia Dare.
- **Estimasi durasi**: script ±1.700 kata, kira-kira 11–12 menit kalau dibaca 150 wpm.
- **Kolom asap di cakrawala** adalah elemen fiksi visual (isyarat bahwa mungkin ada yang masih hidup di
  luar sana). Tidak ada di script dan bukan klaim sejarah. Hapus kalau terlalu mengarahkan.
- **Visual** adalah representasi low-poly bergaya, bukan rekonstruksi arkeologis.
