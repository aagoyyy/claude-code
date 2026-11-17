# Storyboard "Bedah bisnis warmindo": 9 panel, 9 lokasi/sudut berbeda

Semua panel = SVG 1080x1920 (`svg/p1..p9.svg`), kit yang sama dengan key visual dapur (`../kit`): satu sumber cahaya kiri-atas, outline tebal-tipis mengikuti cahaya, nada 5 tingkat, tekstur kayu/linen/kaca. Panel 4 = key visual dapur (render Remotion, bukan SVG statis).
Regenerasi: `python3 -I render.py [nomor...]` lalu `node shot.mjs [nomor...]` (PNG di `png/`). Teks dalam gambar hanya teks yang ada di dunia (label, tag harga, papan). Pill/subtitle ditambahkan di Remotion seperti Part1/Part2.

| # | Beat script | Lokasi & sudut kamera | Objek utama | Gerak yang disarankan | Transisi masuk |
|---|---|---|---|---|---|
| 1 | "Mie instan di warung cuma Rp3.000" | Meja kayu, top-down (flat lay) | Bungkus mie, tag Rp 3.000, koin, struk | Bungkus jatuh + miring, tag ayun, koin menyusul | wipe merah |
| 2 | "...di Warmindo bisa laku Rp10.000-15.000" | Jalan malam, wide frontal | Kios WARMINDO, lampu hias, papan menu, 3 pembeli | Lampu berkedip, uap panci, kamera push-in ke jendela | rack |
| 3 | "Kenapa warung mie nggak pernah sepi?" | Dalam warung, eye-level, punggung pembeli di depan | Koki di wajan, 3 mangkuk panas | Api wajan, uap naik, kamera geser ke mangkuk | rack |
| 4 | "Satu porsi komplit Rp12.000" | Dapur (key visual) | Mangkuk + tag Rp 12.000 | Pakai gerak Part1 (beat 3) | flash |
| 5 | "Modal asli ... total HPP Rp7.000" | Top-down di alas linen | Mie, telur, sayur+bumbu, tabung gas, tag per item, plat TOTAL HPP | Item masuk satu per satu, tag mengayun, plat total jatuh terakhir | rack |
| 6 | "Pengeluaran terbesar: sewa kios, listrik & air" | Dinding kios, medium frontal | Meteran listrik, keran+ember, kalender, kunci + tag sewa, catatan | Jarum meteran berputar, tetes air, lingkaran merah di kalender | wipe |
| 7 | "Minimal 15 mangkuk/hari ... tembus 80 + es teh" | Meja, low-angle, bokeh | Tumpukan kecil vs menara mangkuk, 3 es teh, papan "15 / hari" | Tumpukan kecil naik pelan, menara menjulang melewati frame, es teh pop | rack |
| 8 | "Cuan bersih 5-7 juta sebulan" | Laci kasir, top-down 3/4 | Uang 3 pecahan, koin, buku kas, kalkulator, es teh | Lembar uang bertambah, angka kalkulator berhitung, pulpen menulis | rack |
| 9 | CTA "Komen 'mulai'... klik link di bio" | Latar merah, HP tegak | Thread komentar, komentar "mulai" disorot, tombol link | Komentar naik satu per satu, "mulai" membesar + hati | iris |

Catatan: angka ("5.500.000" di kalkulator, "5-7 jt" di buku kas) mengikuti script; angka 5-7 juta belum cocok dengan hitungan 80 mangkuk (lihat HANDOFF).
