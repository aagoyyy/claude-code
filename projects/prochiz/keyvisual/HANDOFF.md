# Handoff: video Prochiz "strategi gerilya rak roti tawar" (key visual gaya editorial)

Status TERBARU: **v9** (`Prochiz-keyvisual-v9.mp4`, 8,7 MB, 41,7 s): layout `src/board7.py` (kualitas contoh user: judul Archivo Black, coretan kuas merah, foto polaroid berselotip, sorotan produk, label nama dua tingkat, logo), animasi `src/anim9.py` dengan transisi bervariasi per potongan (daftar `TR` di `src/anim9.py`: iris dari titik, zoom tembus, sapuan pita merah, kartu menyusut, geser 4 arah; window 0,52 s, judul scene berikut pre-roll -0,24 s), SFX `src/sfx9.py` -> `assets/sfx_v9.wav`. Foto berwarna. SPG = karakter AI LENGAN PANJANG (`assets/cutouts/spgai_long_*.png`, dipotong `src/cutout2.py`; versi lengan pendek tidak dipakai lagi). Teks layar memakai "ANDA" (bukan "kamu"), scene 11 "KALAU ANDA BUSINESS OWNER", scene penutup hanya SPG (tanpa customer); Agustina hanya di scene 2, 13, 15. 14 scene (scene 14+15 lama digabung: SPG menyodorkan sampel ke customer pemegang roti di lorong roti = inti strategi gerilya). Scene 10: Gold Cheddar + foto roti isi keju (`assets/new/roti_isi_keju.png`), nota dihapus. Latar POLOS tanpa pola (beige #E5E0D1, scene 5 merah #A62F2F).\n\nSebelumnya: **v8** (`Prochiz-keyvisual-v8.mp4`, 14,8 MB, 41,7 s) = gaya referensi, opsi A (satu latar beige kertas milimeter, aksen merah, subjek monokrom + blazer merah, prop artefak asli). Source: `src/board6.py` (15 layout), `src/anim8.py` (animasi). Render: `python3 -I src/anim8.py video _work/out.mp4`, lalu re-encode `ffmpeg -crf 22 -preset slow` (hasil mentah crf16 = 78 MB). Elemen ditangkap satu per satu lewat recorder (selisih piksel per helper) dan dijadwalkan sesuai posisi kata (proporsional suku kata di antara jeda VO; BUKAN transkrip asli). LATAR sekarang opsi B (`bgopts.plus_sparse()`: beige polos + plus jarang 216 px), dipilih user karena grid lama terlalu ramai/bikin pusing; opsi lain (A,C,D,E,F) ada di `src/bgopts.py`. Latar SENGAJA tidak ikut kamera zoom (menyebabkan moire). Tanpa progress bar. SFX tipis: `src/sfx.py` mensintesis `assets/sfx_v8.wav` (83 event dari jadwal anim8: tick judul, slide kartu, whoosh tokoh, thud stempel, zip garis, ping titik, swish antar scene), dicampur ffmpeg `amix` di bawah VO (~13 dB lebih pelan, mix -14,7 LUFS, peak -0,2 dBFS). Garis di scene 13 selebar kata STRATEGI. Belum dikonfirmasi user: merah grafis #D63426 vs brand #A62F2F, beige referensi vs krem brand #FFFAE7, wajah Agustina monokrom.

Riwayat: v6 (di bawah) sebelumnya: **v6 selesai dan sudah dikirim ke user** (`Prochiz-keyvisual-v6.mp4`, 41,7 s, 1080x1920, 30 fps, audio = VO user). v5 (`Prochiz-keyvisual-v5.mp4`) = versi sebelum label nama dan progress bar. Siap dilanjutkan dengan revisi per scene.

Use case: iklan SEMINAR; salah satu pembicara = co-founder Prochiz (**Agustina**, perempuan berbaju merah di video; foto asli yang dipoles AI oleh user). Target market user: owner bisnis menengah-besar (omzet Rp1 M - Rp10 T/tahun). **Info target market itu panduan untuk menilai hook/retention, BUKAN teks untuk ditaruh di video** (sempat salah dimasukkan lalu dihapus).

## Brief user
- Naskah (7 kalimat) tentang Prochiz masuk lewat rak roti tawar, bukan rak keju. VO sudah direkam user: `assets/vo.mp3` (41,7 s).
- Gaya = video referensi "Zuckerberg 13% vs 61%": latar krem bergrid titik SAMA di semua scene, cutout halftone hitam-putih, aksen merah/biru, judul Anton, elemen kecil berlapis. **Variasi ada di tata letak, bukan warna latar** (v3 dengan latar warna-warni ditolak).
- **Tanpa caption bawah** (yang selalu muncul di referensi), tanpa CTA/kartu akhir di belakang. Video berakhir di scene "penetrasi pasar".
- Semua elemen penting di **safe zone** 1080x1920: kiri 72, kanan 120, atas 270, bawah 380 px. Teks di dalam kotak harus proporsional (kotak dihitung dari tinggi huruf).
- Tokoh tidak boleh kecil (>= ~850 px untuk figur utama), gambar tidak boleh "tembus" (lubang di cutout).
- Brand: merah `#A62F2F`, krem `#FFFAE7`, hitam `#252627`. Logo asli dan kemasan Gold Slices / Premium Cheddar dipakai apa adanya (bayangan mengikuti bentuk, bukan kotak).
- Scene 2 memakai TEKS "PROCHIZ" (bukan logo). Logo asli di scene 3, 13, 15; kemasan di scene 7, 10, 12.
- Tanggal Masterclass "Kamis, 10 Desember 2026" (logo Gratyo) hanya relevan untuk video lama `Prochiz-gerilya-full.mp4`, bukan v5.

## Perubahan v6 (dari v5)
- Label nama `Agustina / CO-FOUNDER PROCHIZ` di scene 2 (kemunculan pertama), 13, 15 (`src/board4.py`, fungsi `name_tag`).
- Hook: elemen scene 1 sudah terisi di frame pertama (`base0=-0.28` untuk scene 1 di `src/anim6.py`).
- Progress bar tipis merah di atas layar (y=236..244) yang terisi sampai akhir, untuk retention. Ide Claude, user belum konfirmasi; mudah dihapus di `anim6.py`.
- Tetap: TANPA CTA / kartu akhir (user minta ditunda).

## Struktur
```
keyvisual/
  Prochiz-keyvisual-v5.mp4      hasil final
  HANDOFF.md
  src/    render.py  full.py  full2.py  board.py  board2.py  board3.py  board4.py  anim5.py  anim6.py
  fonts/  Anton.ttf  SpaceMono(.Bold).ttf   (OFL, dari @fontsource)
  assets/ originals/ (13 foto AI dari user: SPG, customer, kerumunan, produk, lorong)
          cutouts/   (cutout transparan hasil potong otomatis)
          aisle/     (foto lorong keju/roti)
          brand/     logo.png, gold_slices.png, premium_cheddar.png (+ file sumber)
          vo.mp3
  frames/ storyboard_v4.png, brand_01..15.png, brand_sheet.png
```

## Cara render ulang
Path sekarang relatif ke repo (`KV` = folder `keyvisual`; output scratch ke `_work/`, git-ignored; buat dulu `mkdir -p _work/prochiz_test`).
```
pip install pillow numpy opencv-python-headless
python3 -I src/board4.py                       # 15 frame statis versi v6 + cek safe zone ("violations: 0")
python3 -I src/anim6.py preview 0.0 0.8 2.6 ... # sheet cuplikan animasi
python3 -I src/anim6.py video _work/out.mp4    # render penuh ~1m50s (4 core), audio dari assets/vo.mp3
```
Arsitektur: `board.py` = 15 tata letak (b01..b15, state akhir), `board2.py` = tata ulang scene tokoh-kecil (n03/n05/n07/n11/n12/n15), `board3.py` = versi brand (m02, m03, m07, m10, m12, m13, m15) + dict `ALL` (urutan final). `board4.py` = v6 (label nama; ALL = urutan final). `anim6.py` (turunan `anim5.py`) mem-patch fungsi gambar di board* sehingga tiap elemen masuk berurutan (judul per kata, kartu pop, tokoh naik, stempel menghantam + shake, titik berdenyut, garis tergambar), kamera zoom pelan, keluar = slide 0,14 s.

## Timeline scene (detik, dari jeda audio VO)
1: 0-1.96 | 2: 1.96-4.24 | 3: 4.24-7.15 | 4: 7.15-9.5 | 5: 9.5-12.3 | 6: 12.3-15.1 | 7: 15.1-17.4 | 8: 17.4-20.1 | 9: 20.1-23.18 | 10: 23.18-26.8 | 11: 26.8-31.78 | 12: 31.78-35.72 | 13: 35.72-38.33 | 14: 38.33-39.95 | 15: 39.95-41.72

## Catatan / belum beres
- **VO belum pernah ditranskrip** (host model Whisper diblokir proxy; tool ElevenLabs tidak bisa terima file lokal). Batas scene dihitung dari jeda sunyi audio + jumlah suku kata; 2 batas tanpa jeda jelas (~9.5 s dan ~39.95 s) masih perkiraan. Elemen dalam scene muncul merata, belum terkunci ke kata.
- Grafik scene 4/5/15 itu ILUSTRASI (bukan data), diberi label.
- SPG di scene 3/7/11 masih memegang nampan keju hasil AI. Opsi: generate ulang SPG memegang kemasan Prochiz asli (prompt P4/P5 sudah dibuat di chat).
- Gold Slices hanya 512 px, agak lembut di scene 10.
- Cutout otomatis (GrabCut + model latar) kadang kasar di sepatu/lantai; kerumunan sengaja dipotong sampai paha lalu fade. Pemotongan neural `@imgly/background-removal-node` sempat ditolak oleh pengaturan izin sesi, jadi belum dipakai.
- Scene 15 hanya 1,8 s; opsi menahan frame terakhir 0,5 s.
- Frame statis hasil v5 ada di `frames/brand_XX.png`.
