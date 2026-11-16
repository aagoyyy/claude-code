---
name: "story-25d-video"
description: "Bikin video short vertikal 9:16 gaya Cerita 2.5D (karakter ilustrasi berakting, banyak shot, kamera dinamis, teks kinetik, tanpa caption bawah) dari script + logo + VO, lengkap backsound & SFX. Pakai untuk Template 2 / video cerita 2.5D."
---

# Cerita 2.5D (Template 2): video short dari script

Ubah script + logo (+ VO opsional) jadi video MP4 1080×1920 bergaya ilustrasi cerita 2.5D:
- **Karakter bersendi** yang berakting: jalan, nengok, ngangguk, pegang HP/kopi/clipboard, ekspresi berubah, kedip otomatis.
- **Banyak shot per adegan**, dengan kamera yang selalu bergerak: zoom, dolly zoom, goyang tangan, whip pan.
- **Latar berlapis** dengan parallax dan blur kedalaman: aurora, kota, ruangan, panggung, aula.
- **Teks kinetik** di layar: huruf jatuh, neon, stempel, lakban, slot, pita, coret, papan skor, pecah kaca.
- **Tidak ada caption di bawah.** Teks layar hanya kata kunci.

Mesinnya satu halaman HTML (`story.html`) yang menggambar tiap frame. Halaman itu direkam Playwright + ffmpeg lewat `render.mjs`, dan audionya dibuat dengan `story_audio.py`. Kode lengkap ketiganya ada di bawah. Tulis apa adanya, lalu ganti hanya `BRAND` dan adegan (contoh `S_MGR`, `SC_CHANCE`, `SC_CTA` beserta array `SCENES`).

## Alur kerja

1. **Bahan.**
   - Minta script dan logo: PNG untuk latar terang dan gelap. Kalau cuma ada satu, pakai di keduanya.
   - VO opsional, MP3 yang diupload user. Sesi tidak bisa download dari ElevenLabs/MiniMax.
   - Jangan mengarang nama, angka, atau klaim yang tidak ada di script.
2. **Folder kerja.** Tulis `story.html`, `render.mjs`, `story_audio.py`. Salin logo ke `assets/logo-light.png` dan `assets/logo-dark.png`, crop ke isi (`im.crop(im.getbbox())`) dan lebar 1200 px.
3. **Timing.**
   - **Dengan VO:**
     - Geser VO +0,4 detik dan jadikan stereo 48 kHz, loudnorm -16 → `audio/vo48.wav`.
     - Cari jeda dengan `ffmpeg -i vo.mp3 -af silencedetect=n=-38dB:d=0.18 -f null -`, lalu cocokkan tiap kalimat ke rentangnya. Kalau ragu, bandingkan jumlah suku kata dengan puncak energi pita 300–2500 Hz.
     - Potong adegan 0,2 detik sebelum kalimat berikutnya mulai. `dur` tiap adegan = frame antar titik potong.
   - **Tanpa VO:** ±2,6 kata/detik, minimal 60 frame per adegan.
   - Total biasanya 30–60 detik, 8–12 adegan, satu kalimat/ide per adegan.
4. **Tulis adegan.** Bentuk tiap adegan:
   ```
   { dur, shots:[ { f0, f1, cam:{x:[a,b], y?:[a,b], z:[a,b], rot?:[a,b], cy, dolly?}, shake?, shakeFn?(fl), focus, whipOut?, whipIn?, flashFn?(fl), layers(fl,g,F) } ], overlay?(F,g) }
   ```
   - **Shot:** adegan dibagi ke 2–3 shot (wide → medium → close-up). Tiap shot punya rentang frame `f0`–`f1`.
   - **Layer:** `layers` mengembalikan `[{d, svg}]`, dengan `d` = kedalaman 0 (latar jauh) sampai 1 (paling depan, otomatis blur). `focus` = kedalaman yang tajam.
   - **Waktu:** `fl` = frame lokal shot, `g` = frame global (untuk loop latar), `F` = frame adegan.
   - **Kamera:** `z` 1.0→1.1 = zoom pelan. `dolly:true` = dolly zoom (dramatis). `whipOut` di akhir shot + `whipIn` di shot berikutnya = whip pan. `shakeFn` dipakai untuk hentakan saat benda mendarat.
   - **Karakter** `person({x,y,s, shirt,pants,hair, expr, look:[lx,ly], turn, nod, tilt, armL:[bahu,siku], armR, itemL/itemR, walk, lean, squash, sweat, seed, rim:"R"|"W"|"none"}, g)`:
     - Sudut lengan dalam radian: 0 = turun lurus, + = membuka ke luar/atas, − = masuk ke depan badan. Contoh: pegang HP/gelas di depan badan pakai bahu −0.3…−0.75, siku −1.7…−2.2. Tangan di kepala `[2.6, 0.9]`, dadah `[2.5±0.35, 0.4]`.
     - `walk` = fase (mis. `g*0.35`).
     - Ekspresi: worry, neutral, happy, determined, surprised, relief.
     - Animasikan pakai `key(fl, [[f,v],...])` (halus), `step()` (patah), `spring()`.
   - **Latar & properti:**
     - Latar: `skyAurora`, `skyDusk`, `city`, `poles`, `room`, `stageBg`, `hallBg`.
     - Properti: `store`, `walker`, `motor`, `building(g, sign)`, `queue`, `clockProp`, `screenLogo(F, d0, sub)`, `backHeads`.
     - Efek: `beam`, `embers`, `bokeh`, `confetti`.
     - Selalu ada sesuatu yang bergerak di latar.
   - **Teks kinetik.** Pilih yang cocok dengan maknanya:

     | Fungsi | Kapan dipakai |
     |---|---|
     | `dropWord` | judul tegas |
     | `heroNumber` | angka besar 3D |
     | `glitchClock` / `glitchWord` | waktu / rahasia / kaget |
     | `scribble` | garis bawah |
     | `neonWord` | label suasana |
     | `stamp` | keputusan / peran |
     | `tapeLabel` | penanda bab "MATERI 01/04" |
     | `popWords` | poin + centang |
     | `slotRoll` | angka/kata naik |
     | `ribbon` | nama/jabatan |
     | `strikeText` + `xMark` | yang salah |
     | `scoreboard(target, …)` | hitung naik |
     | `shatter` | momen puncak, maks 1 |

     Kalau butuh layar pilihan atau CTA berbasis HTML, pakai `overlay` (contoh di `SC_CTA`).
5. **Aturan desain (wajib):**
   - Teks maks 2 baris, ±12 huruf per baris di ukuran 110–150. Kecilkan ukurannya kalau melebar lebih dari 940 px.
   - Teks di zona y 250–1100. Jangan di bawah 1540 atau di kanan x > 960 (tertutup UI sosmed).
   - Karakter close-up: `y` 1900–2700, `s` 0.9–1.9.
   - Palet: merah #E11D2E, neon #C8FF2E, emas #FFD23F, latar marun/gelap hangat. Kontras teks pakai stroke gelap.
   - Satu adegan = satu ide, teks maks 4 kata sekaligus. Setiap ≤1 detik ada gerakan baru.
   - Flash maks 0,1, goyang hentakan maks 25 px.
6. **Cek frame dulu.**
   - Jalankan `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node render.mjs story.html --stills "0:40,0:100,1:30,..."` (adegan:frame, frame < dur), di momen paling ramai tiap shot.
   - Gabungkan dengan PIL (bukan ffmpeg vstack/hstack untuk banyak gambar besar), lalu lihat pakai Read.
   - Perbaiki teks kepotong/nabrak, tangan menunjuk keluar layar, dan karakter tertutup teks. Error JS (mis. "x is not defined") muncul di log Playwright.
7. **Render penuh.**
   - Jalankan `node render.mjs story.html video-silent.mp4` di background (`nohup ... > render.log &`).
   - Kecepatannya ±0,5 detik per frame (50 detik video ≈ 12 menit). Cek log tiap ~5 menit, sambil mengerjakan audio.
8. **Audio.** Buat `audio/plan.json`:
   - `durs` = dur adegan.
   - `mood` per adegan: `"tense"` (drone gelap, detak berat) atau `"hope"` (terang, lonceng mayor). Pindah dari hope ke tense otomatis dapat riser + hit + jeda musik.
   - `beds` per adegan: `"city"`, `"room"`, `"crowd"`, atau `null`.
   - `cuts`: `[adegan, frame]` tiap ganti shot (whoosh). Ganti adegan otomatis.
   - `events`: `[adegan, frame, nama, gain, arg?]` di frame aksi/teks. Efek yang tersedia:

     | Efek | Kapan dipakai |
     |---|---|
     | `steps` (arg `[frame_akhir, jarak]`) | langkah kaki |
     | `thud` | huruf/badan mendarat |
     | `slap` + `thud` | stempel |
     | `tock` | huruf jatuh per huruf |
     | `tick` | ketik / jam / angka berputar |
     | `swish` | lakban / pita / coretan |
     | `neon` | nyala neon, 5–7× berjarak 0,1 detik |
     | `popw` | kata muncul |
     | `chime` | centang / sukses |
     | `buzzer` + `popw` | xMark |
     | `ring` / `vibrate` | telepon |
     | `rustle` | kertas |
     | `clink` | gelas |
     | `heartbeat` | tegang |
     | `motor` (arg detik) | kendaraan lewat |
     | `buzz_on` | lampu toko menyala |
     | `crack` → `glass` + `hit` | shatter |
     | `popper` + `claps` (arg `[detik, kepadatan]`) | konfeti / tepuk tangan |
     | `riser` (arg detik, berakhir tepat di frame) | membangun ketegangan |
     | `whoosh` | gerakan cepat |

   Jalankan `python3 story_audio.py audio/plan.json`. Lalu rakit **bertahap**, karena satu graph sidechain + amix bisa memotong ekor VO. `TOTAL` = durasi detik:
   ```
   ffmpeg -y -i audio/music.wav -i audio/vo48.wav -filter_complex "[0:a]aformat=channel_layouts=stereo,volume=0.6[m];[1:a]apad=whole_dur=TOTAL[k];[m][k]sidechaincompress=threshold=0.03:ratio=6:attack=25:release=400[d]" -map "[d]" audio/duck.wav
   ffmpeg -y -i audio/vo48.wav -i audio/duck.wav -i audio/sfx.wav -filter_complex "[0:a]apad=whole_dur=TOTAL[v];[2:a]aformat=channel_layouts=stereo,volume=0.55[s];[v][1:a][s]amix=inputs=3:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map "[a]" -ar 48000 -t TOTAL audio/mix.wav
   ffmpeg -y -i video-silent.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart video-final.mp4
   ```
   - Tanpa VO: lewati langkah duck, lalu amix music (volume 0.6) + sfx.
   - Claude tidak bisa mendengar. Cek dengan `ebur128` (target -14 LUFS) dan `showwavespic` (mix vs VO, pastikan VO utuh sampai akhir), lalu minta user mendengarkan.
9. **Kirim.** Ambil 5–6 frame dari MP4 final, gabung, lalu lihat. Kirim lewat SendUserFile. Di jawaban:
   - Ringkas isi visual dan suara.
   - Minta user cek audio.
   - Tawarkan revisi per adegan. Revisi satu adegan = render ulang adegan itu saja, lalu concat ulang. Ganti audio cukup mux ulang `-c:v copy`.

## story.html

```html
<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>html,body{margin:0;background:#000}#stage{position:relative;width:1080px;height:1920px;overflow:hidden}.abs{position:absolute}</style></head>
<body><div id="stage"></div>
<script>
// TEMPLATE 2 "Cerita 2.5D" — ganti BRAND dan adegan; jangan ubah MESIN.
const BRAND = { logoOnLight: "assets/logo-light.png", logoOnDark: "assets/logo-dark.png" };
window.ASSETS = [BRAND.logoOnLight, BRAND.logoOnDark];
const FPS = 30, NEON = "#C8FF2E", GOLD = "#FFD23F", RED = "#E11D2E";
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const outCubic = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (x, [i0, i1], [o0, o1], e = ease) => o0 + (o1 - o0) * e(clamp((x - i0) / (i1 - i0), 0, 1));
// keyframe: key(f, [[f0,v0],[f1,v1],...])
function key(f, ks) { if (f <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) { const [a, va] = ks[i], [b, vb] = ks[i + 1]; if (f <= b) return va + (vb - va) * ease((f - a) / (b - a)); } return ks[ks.length - 1][1]; }
const step = (f, ks) => { let v = ks[0][1]; for (const [a, va] of ks) if (f >= a) v = va; return v; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sp = new Map();
function spring(fr, damping = 12, stiff = 160) { if (fr <= 0) return 0; const k = damping + "|" + stiff; let a = sp.get(k);
  if (!a) { a = [0]; let x = 0, v = 0; for (let f = 1; f < 600; f++) { for (let s = 0; s < 20; s++) { const ac = -stiff * (x - 1) - damping * v; v += ac / 600; x += v / 600; } a.push(x); } sp.set(k, a); }
  return a[Math.min(Math.floor(fr), a.length - 1)]; }
const hash = (n) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };

const DEFS = `
  <radialGradient id="skin" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#f3efec"/><stop offset="0.6" stop-color="#d8cfcb"/><stop offset="1" stop-color="#9c8784"/></radialGradient>
  <linearGradient id="rimR" x1="0" y1="0" x2="1" y2="0"><stop offset="0.66" stop-color="#ff3b4a" stop-opacity="0"/><stop offset="1" stop-color="#ff3b4a" stop-opacity=".5"/></linearGradient>
  <linearGradient id="rimW" x1="0" y1="0" x2="1" y2="0"><stop offset="0.66" stop-color="#ffd9a0" stop-opacity="0"/><stop offset="1" stop-color="#ffd9a0" stop-opacity=".45"/></linearGradient>
  <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".55" stop-color="#000" stop-opacity="0"/></linearGradient>
  <linearGradient id="curtain" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff4b5c" stop-opacity="0"/><stop offset="0.18" stop-color="#ff5566" stop-opacity="0.95"/><stop offset="0.55" stop-color="#ff2b47" stop-opacity="0.45"/><stop offset="1" stop-color="#ff2b47" stop-opacity="0"/></linearGradient>
  <linearGradient id="skyA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12020a"/><stop offset=".28" stop-color="#3d0612"/><stop offset=".48" stop-color="#8e0f1f"/><stop offset=".58" stop-color="#d42a34"/><stop offset=".62" stop-color="#ff6a52"/></linearGradient>
  <linearGradient id="road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a0a12"/><stop offset=".35" stop-color="#2a0509"/><stop offset="1" stop-color="#0d0103"/></linearGradient>
  <radialGradient id="glowR" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff5a4a" stop-opacity=".55"/><stop offset="1" stop-color="#ff5a4a" stop-opacity="0"/></radialGradient>
  <radialGradient id="glowW" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".75"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
  <radialGradient id="glowH" cx="0" cy=".5" r="1"><stop offset="0" stop-color="#fff3c4" stop-opacity=".55"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>
  <filter id="b18"><feGaussianBlur stdDeviation="18"/></filter><filter id="b8"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .06 0"/></filter>`;

// ---------------- KARAKTER (kerangka bersendi) ----------------
// c: {x,y,s, shirt,pants,hair, expr, look:[lx,ly], turn(-1..1), nod(deg), tilt(deg), headY,
//     armL:[bahu,siku], armR:[bahu,siku] (radian; 0 = lurus ke bawah, + = membuka ke luar/atas),
//     itemL/itemR: "phone"|"phoneRing"|"clipboard"|"cup", walk: fase (radian) atau null, squash, sweat, seed, rim, blinkOff}
function person(c, g) {
  const s = c.s || 1, shirt = c.shirt || "#e8762c", pants = c.pants || "#2a1612";
  const walking = c.walk != null, ph = c.walk || 0;
  const bob = walking ? -Math.abs(Math.sin(ph)) * 14 : Math.sin((g + (c.seed || 0) * 13) / 22) * 3;
  const blink = !c.blinkOff && ((g + (c.seed || 0) * 37) % 95) < 4;
  const [lx, ly] = c.look || [0, 0], turn = c.turn || 0, ex = c.expr || "neutral";
  const fx = turn * 42;
  const brows = { worry: `<path d="M-82 -40 Q -52 -58 -22 -48"/><path d="M28 -50 Q 58 -60 88 -42"/>`, neutral: `<path d="M-80 -50 L-24 -52"/><path d="M26 -52 L82 -50"/>`,
    happy: `<path d="M-82 -54 Q -52 -72 -22 -58"/><path d="M24 -58 Q 54 -72 84 -54"/>`, determined: `<path d="M-82 -62 L-26 -44"/><path d="M26 -44 L82 -62"/>`,
    surprised: `<path d="M-80 -74 Q -52 -90 -24 -76"/><path d="M26 -76 Q 54 -90 82 -74"/>`, relief: `<path d="M-82 -48 Q -52 -60 -22 -52"/><path d="M24 -52 Q 54 -60 84 -48"/>` }[ex];
  const mouth = { worry: `<path d="M-22 78 Q 4 64 30 78" stroke="#1d1416" stroke-width="8" stroke-linecap="round" fill="none"/>`, neutral: `<path d="M-20 74 L 26 74" stroke="#1d1416" stroke-width="8" stroke-linecap="round"/>`,
    happy: `<path d="M-36 60 Q 0 104 36 60" stroke="#1d1416" stroke-width="8" stroke-linecap="round" fill="none"/>`, determined: `<path d="M-24 76 Q 2 70 28 76" stroke="#1d1416" stroke-width="9" stroke-linecap="round" fill="none"/>`,
    surprised: `<ellipse cx="2" cy="76" rx="15" ry="20" fill="#1d1416"/>`, relief: `<path d="M-30 66 Q 0 92 30 66 Q 0 78 -30 66 Z" fill="#1d1416"/>` }[ex];
  const closedHappy = ex === "relief";
  const eye = (cx) => (blink || closedHappy) ? `<path d="M${cx - 16 + fx} ${-4 + ly} Q ${cx + fx} ${closedHappy ? -16 : -4} ${cx + 16 + fx} ${-4 + ly}" stroke="#141012" stroke-width="7" stroke-linecap="round" fill="none"/>`
    : `<ellipse cx="${cx + lx + fx}" cy="${-6 + ly}" rx="${17 - Math.abs(turn) * 3}" ry="22" fill="#141012"/><circle cx="${cx + lx + fx + 6}" cy="${-16 + ly}" r="6" fill="#fff"/>`;
  // lengan bersendi
  const limb = (side, ang, item) => {
    const [a1, a2] = ang || [0.12, 0.08], Sx = side * 97, Sy = -625, L1 = 150, L2 = 135;
    const Ex = Sx + side * Math.sin(a1) * L1, Ey = Sy + Math.cos(a1) * L1;
    const Hx = Ex + side * Math.sin(a1 + a2) * L2, Hy = Ey + Math.cos(a1 + a2) * L2;
    const rot = (Math.atan2(Hy - Ey, Hx - Ex) * 180) / Math.PI - 90;
    let it = "";
    if (item === "phone" || item === "phoneRing") { const j = item === "phoneRing" ? Math.sin(g * 2.3) * 9 : 0;
      it = `<g transform="translate(${Hx} ${Hy}) rotate(${j + side * 10})"><rect x="-26" y="-50" width="52" height="92" rx="9" fill="#141014"/><rect x="-20" y="-42" width="40" height="72" rx="5" fill="${item === "phoneRing" ? "#9fe0ff" : "#2b3150"}"/>
        ${item === "phoneRing" ? [0, 1, 2].map((k) => { const p = ((g * 0.8 + k * 9) % 27) / 27; return `<path d="M${30 + p * 30} -40 q ${14 + p * 20} 30 0 60" stroke="#9fe0ff" stroke-width="5" fill="none" opacity="${1 - p}"/>`; }).join("") : ""}</g>`; }
    if (item === "clipboard") it = `<g transform="translate(${Hx} ${Hy}) rotate(${rot * 0.3})"><rect x="-60" y="-80" width="120" height="150" rx="8" fill="#efe9e3"/><rect x="-30" y="-92" width="60" height="22" rx="6" fill="#3a2a26"/><path d="M-42 -40 h84 M-42 -15 h74 M-42 10 h64" stroke="#b9aea8" stroke-width="7"/><path d="M-40 34 l12 12 l24 -26" stroke="${RED}" stroke-width="7" fill="none"/></g>`;
    if (item === "cup") { const sp1 = (g % 45) / 45; it = `<g transform="translate(${Hx} ${Hy})"><rect x="-28" y="-44" width="56" height="66" rx="8" fill="#f2ede8"/><rect x="-28" y="-44" width="56" height="16" fill="${RED}"/><path d="M28 -30 q22 4 0 30" stroke="#f2ede8" stroke-width="7" fill="none"/>
      ${[0, 1].map((k) => { const p = (sp1 + k * 0.5) % 1; return `<path d="M${-8 + k * 14} ${-56 - p * 70} q -12 -16 0 -32 q 12 -16 0 -32" stroke="#fff" stroke-width="5" fill="none" opacity="${0.55 * (1 - p)}"/>`; }).join("")}</g>`; }
    return `<path d="M${Sx} ${Sy} L${Ex} ${Ey} L${Hx} ${Hy}" stroke="#d6ccc8" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M${Sx} ${Sy} L${Sx + (Ex - Sx) * 0.55} ${Sy + (Ey - Sy) * 0.55}" stroke="${shirt}" stroke-width="56" stroke-linecap="round" fill="none"/>
      <circle cx="${Hx}" cy="${Hy}" r="23" fill="#e2d9d5"/>${it}`;
  };
  const sw = walking ? Math.sin(ph) * 0.5 : 0;
  const armL = c.armL || [0.12 - sw * 0.6, 0.1], armR = c.armR || [0.12 + sw * 0.6, 0.1];
  const leg = (side, a) => { const Hx = side * 37, Hy = -350, Fx = Hx + Math.sin(a) * 345, Fy = Hy + Math.cos(a) * 345;
    return `<path d="M${Hx} ${Hy} L${Fx} ${Fy}" stroke="${pants}" stroke-width="54" stroke-linecap="round"/><ellipse cx="${Fx + 10}" cy="${Fy + 4}" rx="38" ry="16" fill="#120b0b"/>`; };
  const sq = c.squash || 1;
  const rim = c.rim === "W" ? "rimW" : c.rim === "none" ? null : "rimR";
  const sweat = c.sweat ? `<path d="M${130 + fx * 0.3} -60 q 14 24 0 34 q -14 -10 0 -34 Z" fill="#bfe8ff" opacity=".9" transform="translate(0 ${((g % 24) / 24) * 30})"/>` : "";
  return `<g transform="translate(${c.x} ${c.y}) scale(${s * (1 + (1 - sq) * 0.6)} ${s * sq})">
    <ellipse cx="0" cy="8" rx="190" ry="34" fill="#000" opacity=".4" filter="url(#b8)"/>
    <g transform="translate(0 ${bob})">
      ${leg(-1, -sw * 0.9)}${leg(1, sw * 0.9)}
      <g transform="rotate(${c.lean || 0} 0 -350)">
      <path d="M-103 -645 Q0 -680 103 -645 L120 -330 Q0 -305 -120 -330 Z" fill="${shirt}"/><path d="M-103 -645 Q0 -680 103 -645 L120 -330 Q0 -305 -120 -330 Z" fill="url(#shade)"/>
      ${limb(-1, armL, c.itemL)}
      <rect x="-23" y="-700" width="46" height="70" rx="18" fill="#bfb2ae"/>
      <g transform="translate(0 ${-850 + (c.headY || 0)}) rotate(${(c.tilt || 0) + (c.nod || 0) * 0.3})">
        <circle r="150" fill="url(#skin)"/>${rim ? `<circle r="150" fill="url(#${rim})"/>` : ""}
        <path d="M-151 -6 C -152 -212 152 -212 151 -6 C ${118 + fx} -84 ${-118 + fx} -84 -151 -6 Z" fill="${c.hair || "#1d1416"}"/>
        <g transform="translate(0 ${(c.nod || 0) * 0.8})">
          <g stroke="#1d1416" stroke-width="11" stroke-linecap="round" fill="none" transform="translate(${fx} 0)">${brows}</g>
          ${eye(-50)}${eye(58)}
          <path d="M${6 + fx * 1.2} 18 Q ${18 + fx * 1.3} 34 ${4 + fx * 1.2} 44" stroke="#8d7a77" stroke-width="6" stroke-linecap="round" fill="none"/>
          <g transform="translate(${fx * 0.9} 0)">${mouth}</g>
        </g>${sweat}
      </g>
      ${limb(1, armR, c.itemR)}
      </g>
    </g></g>`;
}
// siluet pejalan kaki
function walker(x, y, s, col, g, seed, dir = 1) { const ph = g * 0.35 + seed, b = -Math.abs(Math.sin(ph)) * 5, l = Math.sin(ph) * 14;
  return `<g transform="translate(${x} ${y + b}) scale(${s * dir} ${s})" fill="${col}" stroke="${col}"><circle cy="-120" r="20"/><rect x="-17" y="-100" width="34" height="62" rx="12"/><line x1="-6" y1="-40" x2="${-6 - l}" y2="0" stroke-width="12" stroke-linecap="round"/><line x1="6" y1="-40" x2="${6 + l}" y2="0" stroke-width="12" stroke-linecap="round"/></g>`; }
// motor lewat
function motor(x, y, s, g) { const w = (g * 25) % 360;
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M60 -40 L700 -120 L700 40 Z" fill="url(#glowH)"/>
    <circle cx="-60" cy="0" r="34" fill="#0a0203"/><circle cx="60" cy="0" r="34" fill="#0a0203"/><path d="M-70 -20 L-10 -60 L50 -60 L80 -20 Z" fill="#14050a"/>
    <circle cx="-20" cy="-110" r="22" fill="#0a0203"/><rect x="-38" y="-92" width="34" height="56" rx="10" fill="#0a0203"/><circle cx="74" cy="-48" r="9" fill="#fff6d0"/><circle cx="-84" cy="-34" r="7" fill="#ff2a2a"/></g>`; }

// ---------------- latar ----------------
function skyAurora(g, amp = 1) { const sh = (i) => Math.sin(g / 30 + i * 1.7) * 40 * amp;
  return `<rect width="1080" height="1920" fill="url(#skyA)"/>
  <g fill="#fff">${Array.from({ length: 14 }, (_, i) => `<circle cx="${hash(i) * 1080}" cy="${hash(i + 50) * 520}" r="${1.2 + hash(i + 9) * 1.4}" opacity="${0.2 + 0.4 * Math.abs(Math.sin(g / 15 + i))}"/>`).join("")}</g>
  <g filter="url(#b18)" opacity="${0.8 + 0.15 * Math.sin(g / 18)}">
    ${[[-60, 90, 260], [200, 420, 640], [560, 760, 960], [860, 1060, 1180]].map(([a, b, c], i) => `<path transform="translate(${sh(i)} 0) skewX(${Math.sin(g / 40 + i) * 4})" d="M${a} 1150 C ${a + 180} 980 ${b + 60} 640 ${b} 300 L ${c} 300 C ${c + 60} 640 ${c - 40} 980 ${a + 240} 1150 Z" fill="url(#curtain)"/>`).join("")}</g>
  <ellipse cx="540" cy="1170" rx="760" ry="260" fill="url(#glowR)"/>`; }
function city(col = "#24040a") { return `<g fill="${col}"><path d="M0 1290 L0 1110 L70 1110 L70 1080 L150 1080 L150 1120 L230 1120 L250 1095 L340 1095 L340 1130 L430 1130 L430 1100 L520 1100 L540 1125 L620 1125 L620 1090 L700 1090 L700 1115 L790 1115 L810 1085 L900 1085 L900 1120 L980 1120 L980 1095 L1080 1095 L1080 1290 Z"/>
    <rect x="808" y="900" width="110" height="70" rx="10"/><path d="M820 970 L800 1095 M906 970 L926 1095 M830 1010 L896 1010" stroke="${col}" stroke-width="7"/><path d="M812 900 Q863 868 914 900 Z"/></g>`; }
function store(x, y, w, sign, col, g, on) { const h = 330, fl = on ? (on < 1 ? on : 0.88 + 0.12 * Math.sin(g * 0.9 + x) * (hash(Math.floor(g / 3) + x) > 0.93 ? 4 : 1)) : 0;
  const stripes = Array.from({ length: 6 }, (_, i) => `<rect x="${x + (i * w) / 6}" y="${y + 70}" width="${w / 12}" height="54" fill="#fff" opacity=".85"/>`).join("");
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#3a1015"/><rect x="${x + 14}" y="${y + 12}" width="${w - 28}" height="52" rx="8" fill="#14070a"/>
    <text x="${x + w / 2}" y="${y + 49}" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="30" fill="${col}" opacity="${0.25 + 0.75 * clamp(fl, 0, 1)}" style="filter:drop-shadow(0 0 ${8 * clamp(fl, 0, 1)}px ${col})">${esc(sign)}</text>
    <rect x="${x - 8}" y="${y + 70}" width="${w + 16}" height="54" fill="${col}" opacity="${0.4 + 0.6 * clamp(fl, 0, 1)}"/>${stripes}
    <rect x="${x + 20}" y="${y + 140}" width="${w - 40}" height="${h - 160}" fill="#ffb35c" opacity="${0.15 + 0.7 * clamp(fl, 0, 1)}"/>
    <ellipse cx="${x + w / 2}" cy="${y + h + 10}" rx="${w * 0.7}" ry="40" fill="url(#glowW)" opacity="${clamp(fl, 0, 1)}"/>
    <rect x="${x + w / 2 - 28}" y="${y + 190}" width="56" height="${h - 190}" fill="#1a0a0c"/></g>`; }
function embers(g, n = 18, col = "#ff9a6a") { return Array.from({ length: n }, (_, i) => { const p = ((g * (0.6 + hash(i) * 0.8) + hash(i + 3) * 400) % 400) / 400;
  return `<circle cx="${hash(i + 7) * 1080 + Math.sin(g / 20 + i) * 30}" cy="${1700 - p * 1500}" r="${2 + hash(i + 2) * 3}" fill="${col}" opacity="${0.7 * Math.sin(p * Math.PI)}"/>`; }).join(""); }
function bokeh(g, cols, n = 10, y0 = 300, y1 = 1500) { return Array.from({ length: n }, (_, i) => `<circle cx="${hash(i + 20) * 1080 + Math.sin(g / 40 + i) * 20}" cy="${y0 + hash(i + 30) * (y1 - y0)}" r="${40 + hash(i + 40) * 70}" fill="${cols[i % cols.length]}" opacity="${0.18 + 0.12 * Math.sin(g / 12 + i)}"/>`).join(""); }
function room(g, swing = 0) { const a = Math.sin(g / 10) * swing;
  return `<rect width="1080" height="1920" fill="#4a2a22"/><rect y="1280" width="1080" height="640" fill="#22120e"/><rect y="1270" width="1080" height="14" fill="#000" opacity=".35"/>
    <g transform="rotate(${a} 540 0)"><ellipse cx="540" cy="560" rx="640" ry="540" fill="url(#glowW)" opacity=".55"/><line x1="540" y1="0" x2="540" y2="380" stroke="#120806" stroke-width="5"/><path d="M480 380 L600 380 L570 330 L510 330 Z" fill="#120806"/><ellipse cx="540" cy="388" rx="40" ry="10" fill="#ffe2a8"/></g>
    <rect x="140" y="560" width="380" height="250" rx="12" fill="#1c0f0c"/><path d="M175 650 h260 M175 690 h170 M175 730 h230" stroke="#f3d9a8" stroke-width="9" opacity=".8"/><text x="175" y="610" font-family="Inter Display" font-weight="900" font-size="34" fill="${GOLD}">MENU</text>
    <rect x="640" y="560" width="300" height="360" rx="10" fill="#14080a"/><rect x="660" y="580" width="260" height="320" fill="#3a0a12"/><ellipse cx="790" cy="740" rx="160" ry="200" fill="url(#glowR)" opacity=".7"/>`; }
function skyDusk() { return `<linearGradient id="skyD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1036"/><stop offset=".4" stop-color="#5b2150"/><stop offset=".55" stop-color="#c2414a"/><stop offset=".62" stop-color="#ff8a5a"/></linearGradient>
  <rect x="-300" y="-600" width="1680" height="3000" fill="url(#skyD)"/><ellipse cx="540" cy="1170" rx="700" ry="240" fill="url(#glowW)" opacity=".6"/>`; }
function poles(g, col = "#1a0306") { const sw = Math.sin(g / 25) * 6;
  return `<g stroke="${col}" stroke-width="7" fill="none"><line x1="150" y1="760" x2="150" y2="1180"/><line x1="110" y1="790" x2="190" y2="790"/><line x1="980" y1="700" x2="980" y2="1180"/><line x1="935" y1="735" x2="1025" y2="735"/>
    <path d="M110 790 Q 545 ${900 + sw} 935 735" stroke-width="3"/><path d="M190 790 Q 585 ${930 + sw} 1025 735" stroke-width="3"/></g>`; }
function beam(x, y0, y1, w, op = 0.3, col = "#fff3c4") {
  return `<linearGradient id="bm${Math.round(x)}${Math.round(w)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity="${op * 1.6}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient>
    <polygon points="${x - 26},${y0} ${x + 26},${y0} ${x + w / 2},${y1} ${x - w / 2},${y1}" fill="url(#bm${Math.round(x)}${Math.round(w)})"/>
    <ellipse cx="${x}" cy="${y1}" rx="${w / 2}" ry="${w / 9}" fill="${col}" opacity="${op * 0.8}" filter="url(#b18)"/>`;
}
function stageBg(g) {
  return `<rect width="1080" height="1920" fill="#0f0507"/>` +
    Array.from({ length: 12 }, (_, i) => `<rect x="${i * 92}" y="0" width="92" height="1400" fill="${i % 2 ? "#3a0a12" : "#2a060c"}"/>`).join("") +
    `<rect x="0" y="0" width="1080" height="1400" fill="url(#glowR)" opacity=".25"/><rect y="1380" width="1080" height="540" fill="#1c0d0a"/><rect y="1380" width="1080" height="10" fill="#4a2418"/>`;
}
function hallBg(g) {
  return `<rect width="1080" height="1920" fill="#0b0406"/><ellipse cx="540" cy="680" rx="700" ry="520" fill="url(#glowR)" opacity=".55"/>` +
    [0, 1].map((k) => { const a = Math.sin(g / 25 + k * 2) * 22 + (k ? 18 : -18); return `<g transform="rotate(${a} ${k ? 980 : 100} 0)">${beam(k ? 980 : 100, 0, 1500, 360, 0.16)}</g>`; }).join("");
}
function screenLogo(F, d0, sub = "") {
  const p = clamp(spring(F - d0, 10, 160), 0, 1.15);
  return `<rect x="120" y="440" width="840" height="470" rx="20" fill="#1a0a0d" stroke="#ff5a5f" stroke-opacity=".5" stroke-width="5"/>
    <rect x="140" y="460" width="800" height="430" rx="12" fill="${RED}" opacity="${0.35 + 0.6 * clamp(p, 0, 1)}"/>
    <ellipse cx="540" cy="675" rx="${380 * p}" ry="${200 * p}" fill="#fff" opacity="${0.18 * clamp(p, 0, 1)}" filter="url(#b18)"/>
    <g transform="translate(540 650) scale(${p})"><image href="${BRAND.logoOnDark}" x="-250" y="-94" width="500" height="188"/></g>
    <text x="540" y="840" text-anchor="middle" font-family="Inter" font-weight="800" font-size="30" letter-spacing="8" fill="#fff" opacity="${clamp((F - d0 - 8) / 8, 0, 1)}">${esc(sub)}</text>`;
}
function backHeads(y, n, s, col, rimCol, g, seed) {
  let out = "";
  for (let i = 0; i < n; i++) { const x = (i + 0.5) * (1180 / n) - 50 + ((i * seed) % 7) * 6, bob = Math.sin(g / 14 + i * 1.3 + seed) * 3;
    out += `<g transform="translate(${x} ${y + bob}) scale(${s})"><path d="M-70 120 Q-70 40 0 40 Q70 40 70 120 Z" fill="${col}"/><circle cy="-10" r="52" fill="${col}"/><path d="M-30 -58 Q 10 -70 40 -40" stroke="${rimCol}" stroke-width="8" fill="none" opacity=".9"/></g>`; }
  return out;
}
function confetti(F, d0, n = 60) {
  if (F < d0) return ""; const t = F - d0, cols = [RED, GOLD, NEON, "#fff", "#7cf0c8"];
  return Array.from({ length: n }, (_, i) => { const x0 = hash(i) * 1080, vy = 9 + hash(i + 5) * 10, x = x0 + Math.sin(t / 6 + i) * 40, y = -60 + t * vy - hash(i + 9) * 300;
    return y > 1980 ? "" : `<rect x="${x}" y="${y}" width="16" height="26" fill="${cols[i % 5]}" transform="rotate(${t * 12 + i * 37} ${x + 8} ${y + 13})"/>`; }).join("");
}
function clockProp(x, y, r, F) {
  const a = F * 22, b = F * 2.2;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#f2ede8" stroke="#1a0a08" stroke-width="16"/>` + Array.from({ length: 12 }, (_, i) => `<line x1="${x}" y1="${y - r + 18}" x2="${x}" y2="${y - r + 46}" stroke="#1a0a08" stroke-width="8" transform="rotate(${i * 30} ${x} ${y})"/>`).join("") +
    `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * 0.5}" stroke="#1a0a08" stroke-width="16" stroke-linecap="round" transform="rotate(${b} ${x} ${y})"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * 0.78}" stroke="${RED}" stroke-width="9" stroke-linecap="round" transform="rotate(${a} ${x} ${y})"/><circle cx="${x}" cy="${y}" r="16" fill="#1a0a08"/>`;
}
function building(g, sign = "") {
  return `<rect x="420" y="-200" width="640" height="1480" fill="#24142a"/><rect x="460" y="-150" width="560" height="190" rx="12" fill="#311c38"/>` +
    Array.from({ length: 40 }, (_, i) => `<rect x="${470 + (i % 5) * 108}" y="${110 + Math.floor(i / 5) * 140}" width="70" height="86" fill="${hash(i + Math.floor(g / 20)) > 0.75 ? "#ffd27a" : "#3d2a46"}" opacity=".9"/>`).join("") +
    (sign ? neonWord(sign, 740, 10, 66, g, -20, "#b98cff") : "");
}
function queue(n, x0, y, g) { let out = ""; for (let i = 0; i < n; i++) out += walker(x0 + i * 74, y + (i % 2) * 6, 1.25 + (i % 3) * 0.05, "#1a0709", g * 0.2, i * 1.7); return out; }

// ---------------- TIPOGRAFI KINETIK ----------------
const CHW = (ch) => (ch === "I" || ch === "1" ? 0.36 : ch === " " ? 0.4 : ch === "M" || ch === "W" ? 0.92 : ch === "&" ? 0.8 : 0.7);
function charXs(word, x, size, k = 1) { const ws = [...word].map((c) => CHW(c) * size * k), tot = ws.reduce((a, b) => a + b, 0); let cx = x - tot / 2; return ws.map((w) => { const c = cx + w / 2; cx += w; return c; }); }
// huruf jatuh + memantul
function dropWord(word, x, y, size, F, d0, gap, fill, stroke) {
  const xs = charXs(word, x, size, 1.02); let out = "";
  [...word].forEach((ch, i) => {
    const cx = xs[i], t = F - (d0 + i * gap), land = 12;
    const fall = t < land ? -900 * Math.pow(1 - clamp(t / land, 0, 1), 2) : 0;
    const sq = t >= land && t < land + 10 ? 1 - 0.22 * Math.sin(((t - land) / 10) * Math.PI) : 1;
    const op = t < 0 ? 0 : 1;
    const streak = t >= 0 && t < land ? [1, 2, 3].map((k) => `<text x="${cx}" y="${y + fall - k * 70}" font-family="Inter Display" font-weight="900" font-size="${size}" fill="${fill}" opacity="${0.18 / k}" text-anchor="middle">${ch}</text>`).join("") : "";
    out += streak + `<g transform="translate(${cx} ${y + fall}) scale(${1 + (1 - sq) * 0.6} ${sq})" opacity="${op}">
      <text x="6" y="10" font-family="Inter Display" font-weight="900" font-size="${size}" fill="#000" opacity=".45" text-anchor="middle">${ch}</text>
      <text x="0" y="0" font-family="Inter Display" font-weight="900" font-size="${size}" fill="${fill}" stroke="${stroke}" stroke-width="10" paint-order="stroke fill" text-anchor="middle">${ch}</text></g>`;
    if (t >= land && t < land + 8) out += Array.from({ length: 6 }, (_, k) => { const a = (k / 6) * Math.PI + Math.PI, r = (t - land) * 14; return `<circle cx="${cx + Math.cos(a) * r}" cy="${y + 8 + Math.sin(a) * r * 0.3}" r="${6 - (t - land) * 0.6}" fill="${GOLD}"/>`; }).join("");
  });
  return out;
}
// angka hero 3D
function heroNumber(txt, x, y, size, F, d0) {
  const p = clamp(spring(F - d0, 9, 170), 0, 1.3), sc = 0.3 + 0.7 * p, rot = (1 - clamp(p, 0, 1)) * -18;
  const ext = Array.from({ length: 16 }, (_, k) => `<text x="${k * 2.2}" y="${k * 2.6}" font-family="Inter Display" font-weight="900" font-size="${size}" fill="${k < 15 ? "#5a0710" : "#2a0206"}" text-anchor="middle">${txt}</text>`).reverse().join("");
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})">
    <ellipse cx="0" cy="-${size * 0.32}" rx="${size * 0.9}" ry="${size * 0.55}" fill="url(#glowR)" opacity=".9"/>
    ${ext}
    <linearGradient id="heroG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6d6"/><stop offset=".55" stop-color="${GOLD}"/><stop offset="1" stop-color="#ff8a3a"/></linearGradient>
    <text x="0" y="0" font-family="Inter Display" font-weight="900" font-size="${size}" fill="url(#heroG)" stroke="#fff" stroke-width="3" text-anchor="middle">${txt}</text>
    <text x="0" y="0" font-family="Inter Display" font-weight="900" font-size="${size}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" text-anchor="middle" transform="translate(-4 -4)">${txt}</text></g>`;
}
// jam/label glitch RGB
function glitchClock(txt, label, x, y, F, g) {
  const gl = hash(Math.floor(g / 2)) > 0.7, off = gl ? (hash(g) - 0.5) * 18 : 2.5;
  const slice = gl ? `<rect x="-20" y="${-60 + hash(g + 1) * 70}" width="360" height="${8 + hash(g + 2) * 14}" fill="#12020a"/>` : "";
  const typed = label.slice(0, Math.max(0, Math.floor((F - 4) * 0.9)));
  return `<g transform="translate(${x} ${y}) rotate(-4)">
    <rect x="-24" y="-118" width="370" height="170" rx="14" fill="#0b0204" opacity=".78" stroke="#ff5a5f" stroke-opacity=".6" stroke-width="3"/>
    <text x="0" y="-74" font-family="DejaVu Sans Mono" font-weight="700" font-size="26" letter-spacing="5" fill="#ff5a5f">● ${esc(typed)}${F % 16 < 8 ? "▌" : ""}</text>
    <g font-family="DejaVu Sans Mono" font-weight="700" font-size="96">
      <text x="${-off}" y="22" fill="#00e5ff" opacity=".7">${txt}</text><text x="${off}" y="22" fill="#ff2a4a" opacity=".7">${txt}</text><text x="0" y="22" fill="#fff">${txt}</text></g>${slice}
    <g opacity=".25">${Array.from({ length: 9 }, (_, k) => `<rect x="-24" y="${-110 + k * 18}" width="370" height="3" fill="#000"/>`).join("")}</g></g>`;
}
// garis bawah tergambar
function scribble(x, y, w, F, d0) { const p = clamp((F - d0) / 12, 0, 1), L = w * 1.15;
  return `<path d="M${x} ${y} q ${w * 0.25} 18 ${w * 0.5} 4 t ${w * 0.5} 6" stroke="${NEON}" stroke-width="16" stroke-linecap="round" fill="none" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - p)}" style="filter:drop-shadow(0 0 10px ${NEON})"/>`; }
// neon menyala berkedip per huruf
function neonWord(word, x, y, size, F, d0, col) {
  const xs = charXs(word, x, size, 0.98); let out = "";
  [...word].forEach((ch, i) => {
    const t = F - d0 - hash(i + 3) * 14; let on = t < 0 ? 0 : t < 8 ? (hash(Math.floor(F * 1.7) + i) > 0.45 ? 1 : 0.15) : 1;
    if (t > 8 && hash(Math.floor(F / 2) + i * 9) > 0.97) on = 0.3;
    out += `<text x="${xs[i]}" y="${y}" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="${size}" fill="none" stroke="${col}" stroke-width="7" opacity="${0.25 + 0.75 * on}" style="filter:drop-shadow(0 0 ${14 * on}px ${col}) drop-shadow(0 0 ${30 * on}px ${col})">${ch === " " ? "" : esc(ch)}</text>`;
  });
  return out;
}
// stempel dihentakkan
function stamp(text, x, y, F, d0) {
  const t = F - d0; if (t < 0) return "";
  const sc = t < 5 ? 2.6 - 1.6 * (t / 5) : 1 + 0.05 * Math.exp(-(t - 5) / 3) * Math.sin((t - 5) * 2);
  const op = t < 5 ? 0.4 + 0.6 * (t / 5) : 1, wdt = text.length * 70 + 90;
  const dust = t >= 5 && t < 16 ? Array.from({ length: 10 }, (_, k) => { const a = (k / 10) * Math.PI * 2, r = 130 + (t - 5) * 18; return `<circle cx="${Math.cos(a) * r * 1.6}" cy="${Math.sin(a) * r * 0.6}" r="${7 - (t - 5) * 0.5}" fill="#ff5a5f" opacity=".7"/>`; }).join("") : "";
  return `<g transform="translate(${x} ${y}) rotate(-8) scale(${sc})" opacity="${op}">${dust}
    <rect x="${-wdt / 2}" y="-74" width="${wdt}" height="128" rx="12" fill="rgba(225,29,46,.12)" stroke="${RED}" stroke-width="12"/>
    <rect x="${-wdt / 2 + 14}" y="-60" width="${wdt - 28}" height="100" rx="6" fill="none" stroke="${RED}" stroke-width="4"/>
    <text x="0" y="22" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="100" letter-spacing="4" fill="${RED}">${esc(text)}</text></g>`;
}
// label lakban meluncur + ketik
function tapeLabel(text, x, y, F, d0) {
  const p = clamp(spring(F - d0, 13, 200), 0, 1.1), typed = text.slice(0, Math.max(0, Math.floor((F - d0 - 4) * 0.9)));
  return `<g transform="translate(${x - (1 - p) * 700} ${y}) rotate(-5)">
    <path d="M-20 -48 L420 -52 L432 -40 L424 -28 L436 -14 L426 0 L434 14 L422 30 L-14 34 L-26 18 L-16 4 L-28 -12 L-18 -26 L-28 -40 Z" fill="${GOLD}"/>
    <text x="10" y="8" font-family="DejaVu Sans Mono" font-weight="700" font-size="40" letter-spacing="3" fill="#1a0a08">${esc(typed)}</text></g>`;
}
// kata muncul satu-satu + centang tergambar
function popWords(words, x, y, size, F, d0, gap, col) {
  let out = "", yy = y;
  words.forEach((wd, i) => { const s2 = clamp(spring(F - d0 - i * gap, 9, 220), 0, 1.25);
    out += `<g transform="translate(${x} ${yy}) scale(${s2}) rotate(${(1 - clamp(s2, 0, 1)) * (i % 2 ? 12 : -12)})" opacity="${clamp(s2 * 2, 0, 1)}"><text x="0" y="0" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="${size}" fill="${col}" stroke="#12020a" stroke-width="12" paint-order="stroke fill">${esc(wd)}</text></g>`;
    yy += size * 1.02; });
  const p = clamp((F - d0 - words.length * gap - 4) / 8, 0, 1);
  out += `<path d="M${x + 260} ${y - 40} l 34 38 l 70 -86" stroke="${NEON}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-dasharray="200" stroke-dashoffset="${200 * (1 - p)}" style="filter:drop-shadow(0 0 10px ${NEON})"/>`;
  return out;
}
function glitchWord(text, x, y, size, F, g, col = "#fff", d0 = 0) {
  const typed = text.slice(0, Math.max(0, Math.floor((F - d0) * 1.2)));
  const gl = hash(Math.floor(g / 2) + 3) > 0.65, off = gl ? (hash(g) - 0.5) * 26 : 4;
  const slice = gl ? `<rect x="${x - 520}" y="${y - size * 0.8 + hash(g + 1) * size * 0.7}" width="1040" height="${10 + hash(g + 2) * 18}" fill="#0b0204" opacity=".9"/>` : "";
  const T = (dx, c, o) => `<text x="${x + dx}" y="${y}" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="${size}" fill="${c}" opacity="${o}">${esc(typed)}</text>`;
  return T(-off, "#00e5ff", 0.75) + T(off, "#ff2a4a", 0.75) + T(0, col, 1) + slice;
}
function slotRoll(words, x, y, size, F, d0, hold) {
  const idx = clamp(Math.floor((F - d0) / hold), 0, words.length - 1), tIn = (F - d0) - idx * hold;
  const p = idx === 0 ? clamp(spring(F - d0, 12, 220), 0, 1) : clamp(tIn / 6, 0, 1);
  const prev = idx > 0 && tIn < 6 ? `<text x="${x}" y="${y - p * size * 1.2}" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="${size}" fill="#fff" opacity="${1 - p}">${esc(words[idx - 1])}</text>` : "";
  const col = idx === words.length - 1 ? GOLD : "#fff";
  return `<clipPath id="slotc"><rect x="${x - 520}" y="${y - size * 1.05}" width="1040" height="${size * 1.35}"/></clipPath>
    <rect x="${x - 470}" y="${y - size * 1.1}" width="940" height="${size * 1.45}" rx="22" fill="#0b0204" opacity=".7" stroke="${GOLD}" stroke-opacity=".6" stroke-width="4"/>
    <g clip-path="url(#slotc)">${prev}<text x="${x}" y="${y + (1 - p) * size * 1.2}" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="${size}" fill="${col}" style="${idx === words.length - 1 ? `filter:drop-shadow(0 0 14px ${GOLD})` : ""}">${esc(words[idx])}</text></g>`;
}
function ribbon(text, x, y, F, d0, size = 38) {
  const W = text.length * size * 0.66 + 90, p = lerp(F, [d0, d0 + 14], [0, 1], outCubic);
  const tri = (sx) => `<polygon points="${sx},${y - 40} ${sx + (sx < x ? -70 : 70)},${y - 40} ${sx + (sx < x ? -40 : 40)},${y + 4} ${sx + (sx < x ? -70 : 70)},${y + 48} ${sx},${y + 48}" fill="#8e0f1c"/>`;
  return `${p > 0.95 ? tri(x - W / 2) + tri(x + W / 2) : ""}<clipPath id="ribc"><rect x="${x - (W / 2) * p}" y="${y - 60}" width="${W * p}" height="130"/></clipPath>
    <g clip-path="url(#ribc)"><rect x="${x - W / 2}" y="${y - 52}" width="${W}" height="104" fill="${RED}"/><rect x="${x - W / 2}" y="${y - 52}" width="${W}" height="10" fill="#fff" opacity=".18"/>
    <text x="${x}" y="${y + 14}" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="${size}" letter-spacing="2" fill="#fff">${esc(text)}</text></g>`;
}
function strikeText(text, x, y, size, F, d0) {
  const s = clamp(spring(F - d0, 12, 200), 0, 1.1), p = clamp((F - d0 - 10) / 8, 0, 1), W = text.length * size * 0.62;
  return `<g opacity="${clamp(s * 2, 0, 1)}" transform="translate(${x} ${y}) scale(${s})"><text x="0" y="0" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="${size}" fill="#b9aea8" stroke="#12020a" stroke-width="10" paint-order="stroke fill">${esc(text)}</text>
    <line x1="${-W / 2}" y1="${-size * 0.32}" x2="${-W / 2 + W * p}" y2="${-size * 0.36}" stroke="${RED}" stroke-width="16" stroke-linecap="round"/></g>`;
}
function xMark(x, y, F, d0, s = 1) {
  const p = clamp(spring(F - d0, 9, 260), 0, 1.25); if (F < d0) return "";
  return `<g transform="translate(${x} ${y}) scale(${p * s}) rotate(${(1 - clamp(p, 0, 1)) * 40})"><circle r="58" fill="${RED}"/><path d="M-24 -24 L24 24 M24 -24 L-24 24" stroke="#fff" stroke-width="14" stroke-linecap="round"/></g>`;
}
function scoreboard(target, x, y, size, F, d0, dur) {
  const p = clamp((F - d0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3), v = Math.round(target * e).toLocaleString("id-ID") + (p >= 1 ? "+" : "");
  const chars = [...v], tw = size * 0.66, x0 = x - (chars.length * tw) / 2;
  return `<rect x="${x0 - 30}" y="${y - size * 0.95}" width="${chars.length * tw + 60}" height="${size * 1.3}" rx="18" fill="#0b0204" opacity=".8" stroke="${GOLD}" stroke-width="5"/>` +
    chars.map((c, i) => `<rect x="${x0 + i * tw + 4}" y="${y - size * 0.82}" width="${tw - 8}" height="${size * 1.04}" rx="8" fill="${c === "." || c === "+" ? "none" : "#1c0a0d"}"/>
      <text x="${x0 + i * tw + tw / 2}" y="${y}" text-anchor="middle" font-family="DejaVu Sans Mono" font-weight="700" font-size="${size}" fill="${c === "+" ? RED : GOLD}">${c}</text>`).join("") +
    `<line x1="${x0}" y1="${y - size * 0.3}" x2="${x0 + chars.length * tw}" y2="${y - size * 0.3}" stroke="#000" stroke-width="3" opacity=".5"/>`;
}
function shatter(text, x, y, size, F, d0) {
  const t = F - d0; if (t < 0) return "";
  const p = clamp(spring(t, 9, 200), 0, 1.2), crack = clamp((t - 14) / 6, 0, 1), br = t - 22;
  const base = (clip) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="${size}" fill="${GOLD}" stroke="#fff" stroke-width="6" ${clip ? `clip-path="url(#${clip})"` : ""} style="filter:drop-shadow(0 0 30px ${RED})">${esc(text)}</text>`;
  if (br < 0) {
    const cr = crack > 0 ? `<path d="M${x - 40} ${y - size * 0.75} L${x + 10} ${y - size * 0.4} L${x - 30} ${y - size * 0.15} L${x + 30} ${y + 10} M${x + 10} ${y - size * 0.4} L${x + 160} ${y - size * 0.5} M${x - 30} ${y - size * 0.15} L${x - 180} ${y - size * 0.05}" stroke="#fff" stroke-width="7" fill="none" stroke-dasharray="900" stroke-dashoffset="${900 * (1 - crack)}"/>` : "";
    return `<g transform="translate(${x} ${y - size * 0.35}) scale(${p}) translate(${-x} ${-(y - size * 0.35)})">${base()}${cr}</g>`;
  }
  const cx = x, cy = y - size * 0.35, R = size * 1.2;
  const pieces = [[[cx, cy], [cx - R, cy - R], [cx + R * 0.2, cy - R]], [[cx, cy], [cx + R * 0.2, cy - R], [cx + R, cy - R * 0.3]], [[cx, cy], [cx + R, cy - R * 0.3], [cx + R, cy + R]], [[cx, cy], [cx + R, cy + R], [cx - R * 0.3, cy + R]], [[cx, cy], [cx - R * 0.3, cy + R], [cx - R, cy + R * 0.2]], [[cx, cy], [cx - R, cy + R * 0.2], [cx - R, cy - R]]];
  return pieces.map((pts, k) => { const ang = Math.atan2(pts[1][1] + pts[2][1] - 2 * cy, pts[1][0] + pts[2][0] - 2 * cx), d = br * 26, dy = br * br * 1.6;
    return `<clipPath id="shp${k}"><polygon points="${pts.map((q) => q.join(",")).join(" ")}"/></clipPath>
      <g transform="translate(${Math.cos(ang) * d} ${Math.sin(ang) * d + dy}) rotate(${br * (k % 2 ? 9 : -9)} ${cx} ${cy})" opacity="${clamp(1 - br / 24, 0, 1)}">${base("shp" + k)}</g>`; }).join("") +
    (br < 6 ? `<circle cx="${cx}" cy="${cy}" r="${br * 90}" fill="none" stroke="#fff" stroke-width="${14 - br * 2}" opacity="${1 - br / 6}"/>` : "");
}

// ===================== ADEGAN (CONTOH — ganti sesuai script) =====================
// 1) kacau (whipOut) → serah terima + stempel (whipIn) → santai minum kopi + popWords
const S_MGR = { dur: 129, shots: [
  { f0: 0, f1: 48, cam: { x: [0, 0], z: [1.04, 1.12], rot: [1, -1], cy: 1200 }, shake: 6, focus: 0.75, whipOut: true,
    layers(fl, g) {
      const turn = step(fl, [[0, -0.8], [7, 0.8], [14, -0.6], [21, 0.9], [28, -0.9], [36, 0.5]]);
      const phones = [[220, 760, 0], [860, 700, 1], [790, 1080, 2], [260, 1120, 3]].map(([x, y, k]) => { const a = clamp(spring(fl - k * 5, 9, 200), 0, 1.2), j = Math.sin(g * 2 + k) * 10;
        return `<g transform="translate(${x + j} ${y}) scale(${a}) rotate(${j})"><rect x="-40" y="-70" width="80" height="140" rx="14" fill="#141014"/><rect x="-32" y="-58" width="64" height="112" rx="8" fill="#9fe0ff"/>
          ${[0, 1].map((q) => { const p = ((g + q * 10) % 20) / 20; return `<circle r="${70 + p * 60}" fill="none" stroke="#9fe0ff" stroke-width="5" opacity="${0.7 * (1 - p)}"/>`; }).join("")}</g>`; }).join("");
      const papers = Array.from({ length: 7 }, (_, i) => { const p = ((fl * 1.2 + i * 17) % 60) / 60; return `<rect x="${hash(i) * 1000 + Math.sin(fl / 6 + i) * 60}" y="${1500 - p * 1300}" width="70" height="90" fill="#f4efe8" transform="rotate(${fl * 8 + i * 40} ${hash(i) * 1000 + 35} ${1500 - p * 1300 + 45})" opacity="${Math.sin(p * Math.PI)}"/>`; }).join("");
      return [
        { d: 0, svg: room(g, 3) },
        { d: 0.4, svg: [0, 1, 2].map((k) => walker(700 + k * 110, 1300, 1.4, "#2a1612", g, k * 2)).join("") + `<rect x="-40" y="1300" width="1160" height="200" fill="#5a2e22"/><rect x="-40" y="1290" width="1160" height="22" fill="#7a4230"/>` },
        { d: 0.6, svg: tapeLabel("MATERI 01/04", 120, 560, fl, 2) },
        { d: 0.8, svg: person({ x: 540, y: 1960, s: 1.0, expr: "worry", look: [turn * 20, 0], turn, sweat: true, seed: 1, armL: [2.6, 0.9], armR: [2.6, 0.9], squash: 1 + Math.sin(g * 1.5) * 0.015 }, g) },
        { d: 0.95, svg: phones + papers },
      ]; } },
  { f0: 48, f1: 90, cam: { x: [-30, 10], z: [1.0, 1.05], rot: [0, 0], cy: 1300 }, shake: 1.5, focus: 0.62, whipIn: true, shakeFn: (fl) => (fl >= 25 && fl < 33 ? (33 - fl) * 2.2 : 0),
    layers(fl, g) {
      const give = key(fl, [[0, 0.2], [14, 1.35], [22, 1.35], [30, 0.25]]);
      const take = key(fl, [[0, 0.15], [12, 0.15], [18, 1.2], [26, 0.6]]);
      const passed = fl >= 18;
      const nod = key(fl, [[20, 0], [24, 14], [28, 0], [32, 12], [36, 0]]);
      return [
        { d: 0, svg: room(g, 1) },
        { d: 0.3, svg: `<rect x="-40" y="1300" width="1160" height="200" fill="#5a2e22"/><rect x="-40" y="1290" width="1160" height="22" fill="#7a4230"/>` },
        { d: 0.55, svg: stamp("MANAGER", 560, 760, fl, 20) },
        { d: 0.75, svg: person({ x: 330, y: 1940, s: 0.92, expr: fl > 26 ? "relief" : "worry", look: [16, 0], turn: 0.35, seed: 1, armR: [give, 0.2], itemR: passed ? null : "clipboard", lean: give * 2 }, g) +
            person({ x: 780, y: 1960, s: 0.95, shirt: "#2f6b52", pants: "#1a1412", expr: passed ? "determined" : "neutral", look: [-16, 0], turn: -0.35, nod, seed: 8, armL: [take, 0.3], itemL: passed ? "clipboard" : null, rim: "W" }, g) },
      ]; } },
  { f0: 90, f1: 129, cam: { x: [0, 0], z: [1.12, 1.0], rot: [0, 0], cy: 1350 }, shake: 0, focus: 0.7,
    layers(fl, g) {
      const sip = key(fl, [[0, -0.35], [12, -0.35], [20, -0.75], [28, -0.75], [34, -0.35]]), sb = key(fl, [[0, -1.7], [12, -1.7], [20, -2.15], [28, -2.15], [34, -1.7]]);
      return [
        { d: 0, svg: room(g, 1) },
        { d: 0.35, svg: person({ x: 820, y: 1480, s: 0.55, shirt: "#2f6b52", pants: "#1a1412", expr: "determined", look: [-10, 10], seed: 8, armL: [0.9 + Math.sin(g / 5) * 0.2, 0.9], itemL: "clipboard", armR: [0.3, 0.2], rim: "W" }, g) + [0, 1].map((k) => walker(560 + k * 120 + Math.sin(g / 30 + k) * 20, 1320, 1.2, "#2a1612", g, k)).join("") },
        { d: 0.6, svg: `<rect x="-40" y="1560" width="1160" height="400" fill="#5a2e22"/><rect x="-40" y="1550" width="1160" height="24" fill="#7a4230"/>` },
        { d: 0.5, svg: popWords(["BISA", "DIANDALKAN"], 560, 640, 120, fl, 4, 5, "#fff") },
        { d: 0.85, svg: person({ x: 360, y: 2350, s: 1.15, expr: "relief", look: [0, 0], tilt: -5, seed: 2, armL: [sip, sb], itemL: "cup", armR: [-0.25, -1.1], rim: "W" }, g) },
      ]; } },
] };
// 2) close-up kaget + jam cepat → dolly zoom + "2X" pecah (flash + hentakan)
const SC_CHANCE = { dur: 139, shots: [
  { f0: 0, f1: 60, cam: { x: [0, 0], z: [1.0, 1.06], cy: 900 }, shake: 2, focus: 0.9,
    layers(fl, g) { return [{ d: 0, svg: skyAurora(g, 1.6) }, { d: 0.3, svg: clockProp(540, 760, 300, g) },
      { d: 0.55, svg: glitchWord("KESEMPATAN", 540, 470, 120, fl, g, "#fff", 2) },
      { d: 0.9, svg: person({ x: 540, y: 2720, s: 1.85, expr: "surprised", look: [-12, -8], tilt: -4, seed: 6, sweat: true }, g) }]; } },
  { f0: 60, f1: 139, cam: { x: [0, 0], z: [1.0, 1.22], cy: 1100, dolly: true }, shake: 0, focus: 0.9, shakeFn: (fl) => (fl >= 22 && fl < 32 ? (32 - fl) * 2.5 : 0),
    layers(fl, g) { return [{ d: 0, svg: skyAurora(g, 2) }, { d: 0.3, svg: city() },
      { d: 0.55, svg: shatter("2X", 540, 760, 380, fl, 2) + (fl > 40 ? popWords(["DALAM HIDUP", "ANDA"], 540, 520, 96, fl, 40, 6, "#fff").replace(/<path[^>]*stroke-dasharray[^>]*\/>/, "") : "") },
      { d: 0.9, svg: person({ x: 540, y: 2720, s: 1.85, expr: "determined", look: [0, 0], seed: 6 }, g) }]; },
    flashFn: (fl) => (fl >= 24 && fl < 28 ? (28 - fl) * 0.09 : 0) },
] };
// 3) CTA: karakter dadah + kartu pilihan HTML (overlay), tap di F50, konfeti
const SC_CTA = { dur: 128, shots: [
  { f0: 0, f1: 128, cam: { x: [0, 0], z: [1.04, 1.0], cy: 1300 }, shake: 0, focus: 0.75,
    layers(fl, g) { const wv = Math.sin(fl / 3.2) * 0.35;
      return [{ d: 0, svg: room(g, 0.5) }, { d: 0.75, svg: person({ x: 540, y: 1960, s: 0.92, expr: fl > 50 ? "happy" : "neutral", look: [0, -12], seed: 9, armR: fl > 50 ? [2.5 + wv, 0.4] : [0.15, 0.1], rim: "W" }, g) },
        { d: 0.95, svg: confetti(fl, 52, 60) }]; } },
], overlay(F, g) {
  const tap = 50, chosen = F >= tap, card = clamp(spring(F - 4, 14, 180), 0, 1), pulse = 1 + (chosen ? 0.03 * Math.sin(F / 4) : 0);
  const opt = (label, col, on, d) => `<div style="opacity:${clamp(spring(F - d) * 1.5, 0, 1)};transform:translateY(${(1 - clamp(spring(F - d), 0, 1)) * 40}px) scale(${on ? pulse : 1}) rotate(${(1 - clamp(spring(F - d), 0, 1)) * -4}deg);margin:18px auto 0;width:860px;box-sizing:border-box;padding:24px 20px;border-radius:999px;border:4px solid ${col};background:${on ? col : "rgba(10,4,6,.55)"};color:${on ? "#111" : "#fff"};font-family:'Inter Display';font-weight:900;font-size:40px;white-space:nowrap;text-align:center;box-shadow:0 0 30px ${col}88">${label}</div>`;
  return `<div class="abs" style="left:0;right:0;top:0;height:1100px;background:linear-gradient(#000c,#0000)"></div>
    <div class="abs" style="left:0;right:0;top:170px;text-align:center;opacity:${card};transform:translateY(${(1 - card) * -40}px) scale(${0.9 + 0.1 * card})">
      <div style="font-family:'Inter Display';font-weight:900;font-size:86px;color:#fff;-webkit-text-stroke:6px #000;paint-order:stroke fill">APA PILIHANMU?</div>
      ${opt("TETAP TURUN TANGAN SENDIRI", "#ff5a5f", false, 10)}${opt("DAFTAR MASTERCLASS SEKARANG", NEON, chosen, 16)}
      <div style="margin-top:26px;font-family:'Inter';font-weight:700;font-size:26px;letter-spacing:.3em;color:#fff;opacity:${clamp((F - 30) / 10, 0, 0.9)}">KLIK LINK DI BAWAH ↓</div>
      <img src="${BRAND.logoOnDark}" style="margin-top:30px;height:92px;opacity:${clamp((F - 36) / 10, 0, 1)};transform:scale(${chosen ? 1 + 0.08 * clamp(spring(F - tap, 8, 200), 0, 1.2) - 0.08 : 1})"/>
    </div>
    ${!chosen && F > 32 ? `<div class="abs" style="left:${lerp(F, [32, tap], [880, 640])}px;top:${lerp(F, [32, tap], [900, 520])}px;width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,.85);box-shadow:0 0 0 10px rgba(255,255,255,.25)"></div>` : ""}
    ${chosen && F < tap + 12 ? `<div class="abs" style="left:${640 - (F - tap) * 6}px;top:${520 - (F - tap) * 6}px;width:${70 + (F - tap) * 12}px;height:${70 + (F - tap) * 12}px;border-radius:50%;border:5px solid ${NEON};opacity:${1 - (F - tap) / 12}"></div>` : ""}`;
} };
const SCENES = [S_MGR, SC_CHANCE, SC_CTA];

// =====================================================================
// MESIN (jangan diubah)
// =====================================================================
window.setup = () => { let st = 0; SCENES.forEach((sc) => { sc.start = st; st += sc.dur; }); return SCENES.map((s) => s.dur); };
window.draw = (i, F) => {
  const sc = SCENES[i], g = sc.start + F;
  const sh = sc.shots.find((s) => F >= s.f0 && F < s.f1) || sc.shots[sc.shots.length - 1];
  const fl = F - sh.f0, len = sh.f1 - sh.f0, t = clamp(fl / len, 0, 1), cam = sh.cam;
  const cx = cam.x ? cam.x[0] + (cam.x[1] - cam.x[0]) * ease(t) : 0, z = cam.z[0] + (cam.z[1] - cam.z[0]) * ease(t);
  const cyo = cam.y ? cam.y[0] + (cam.y[1] - cam.y[0]) * ease(t) : 0;
  const rot = cam.rot ? cam.rot[0] + (cam.rot[1] - cam.rot[0]) * ease(t) : 0, cy = cam.cy || 1100;
  const shk = (sh.shakeFn ? sh.shakeFn(fl) : 0) + (sh.shake || 0);
  const jx = (hash(g * 1.3) - 0.5) * 2 * shk + Math.sin(g / 7) * shk, jy = (hash(g * 2.1) - 0.5) * 2 * shk + Math.cos(g / 9) * shk;
  // whip pan
  let wx = 0, wb = 0;
  if (sh.whipOut && fl > len - 6) { const p = (fl - (len - 6)) / 6; wx = -p * p * 900; wb = p * 60; }
  if (sh.whipIn && fl < 6) { const p = 1 - fl / 6; wx = p * p * 900; wb = p * 60; }
  let filters = "";
  const layers = sh.layers(fl, g, F).map((L, k) => {
    const s = cam.dolly ? 1 + (z - 1) * (1.7 * (1 - L.d) - 0.05) : 1 + (z - 1) * (0.35 + L.d * 1.3);
    const dof = Math.abs(L.d - (sh.focus ?? 0.8)) * 14;
    const blur = Math.max(0, dof - 2) + (L.d === 1 ? 6 : 0);
    if (blur > 0.5 || wb) filters += `<filter id="f${k}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(blur + wb).toFixed(1)} ${blur.toFixed(1)}"/></filter>`;
    return `<g ${blur > 0.5 || wb ? `filter="url(#f${k})"` : ""} transform="translate(${540 + cx * L.d + jx * (0.3 + L.d) + wx * (0.5 + L.d * 0.8)} ${cy + jy * (0.3 + L.d) + cyo * (0.3 + L.d * 0.7)}) rotate(${rot}) scale(${s}) translate(-540 ${-cy})">${L.svg}</g>`;
  }).join("");
  const cut = (fl < 2 && !sh.whipIn ? 0.12 * (2 - fl) / 2 : 0) + (sh.flashFn ? sh.flashFn(fl) : 0);
  document.getElementById("stage").innerHTML =
    `<svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920"><defs>${DEFS}${filters}</defs>${layers}<rect width="1080" height="1920" filter="url(#grain)"/></svg>
     <div class="abs" style="inset:0;box-shadow:inset 0 0 260px rgba(0,0,0,.6)"></div>
     ${sc.overlay ? sc.overlay(F, g) : ""}
     ${cut ? `<div class="abs" style="inset:0;background:#fff;opacity:${cut}"></div>` : ""}`;
};
</script></body></html>
```

## render.mjs

```js
// node render.mjs story.html --stills "0:45,3:70"   → stills/*.png
// node render.mjs story.html out.mp4                → video
import { createRequire } from "node:module";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

let chromium;
try { ({ chromium } = await import("playwright")); }
catch { ({ chromium } = createRequire("/opt/npm-tools/node_modules/")("playwright")); }

const [pageFile, ...rest] = process.argv.slice(2);
const pagePath = path.resolve(pageFile), dir = path.dirname(pagePath);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on("pageerror", (e) => console.error("JS error:", e.message));
await page.goto("file://" + pagePath);
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => Promise.all((window.ASSETS || []).map((u) => new Promise((r) => { const im = new Image(); im.onload = im.onerror = r; im.src = u; }))));
const durs = await page.evaluate(() => window.setup());
const shot = async (i, f, type = "jpeg") => {
  await page.evaluate(([i, f]) => window.draw(i, f), [i, f]);
  return (await page.$("#stage")).screenshot(type === "jpeg" ? { type, quality: 92 } : { type });
};

if (rest[0] === "--stills") {
  fs.mkdirSync(path.join(dir, "stills"), { recursive: true });
  for (const pair of rest[1].split(",")) {
    const [i, f] = pair.split(":").map(Number);
    fs.writeFileSync(path.join(dir, "stills", `s${i}-f${f}.png`), await shot(i, f, "png"));
  }
  console.log("durasi adegan (frame):", durs.join(", "), "| total detik:", (durs.reduce((a, b) => a + b, 0) / 30).toFixed(1));
} else {
  const out = path.resolve(rest[0] || "out.mp4"), tmp = path.join(dir, "tmp");
  fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
  const parts = [];
  for (let i = 0; i < durs.length; i++) {
    const part = path.join(tmp, `scene-${i}.mp4`), partial = part.replace(".mp4", ".partial.mp4");
    const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-c:v", "mjpeg", "-framerate", "30", "-i", "-",
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", partial], { stdio: ["pipe", "inherit", "inherit"] });
    for (let f = 0; f < durs[i]; f++) { const buf = await shot(i, f); if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r)); }
    ff.stdin.end();
    if ((await new Promise((r) => ff.on("close", r))) !== 0) throw new Error(`ffmpeg gagal di adegan ${i}`);
    fs.renameSync(partial, part); parts.push(part);
    console.log(`adegan ${i} selesai (${durs[i]} frame)`);
  }
  fs.writeFileSync(path.join(tmp, "list.txt"), parts.map((p) => `file '${p}'`).join("\n"));
  const joined = path.join(tmp, "joined.mp4");
  spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", path.join(tmp, "list.txt"), "-c", "copy", joined], { stdio: "inherit" });
  spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", joined, "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
    "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-shortest", "-movflags", "+faststart", out], { stdio: "inherit" });
  console.log("selesai:", out);
}
await browser.close();
```

Revisi satu adegan: render halaman dengan `SCENES` sementara berisi adegan itu saja tidak bisa (frame global `g` bergeser). Cara aman: render penuh ke folder lain, atau tambahkan argumen sendiri yang hanya merekam indeks adegan tertentu ke `tmp/scene-i.mp4`, lalu concat ulang `tmp/list.txt`.

## story_audio.py

```python
"""python3 story_audio.py audio/plan.json → audio/music.wav + audio/sfx.wav (semua bunyi disintesis, bebas royalti)
plan.json: {"durs":[frame per adegan], "mood":["tense"|"hope" per adegan], "beds":[null|"city"|"room"|"crowd" per adegan],
            "cuts":[[adegan,frame],...] (pergantian shot), "events":[[adegan,frame,"nama",gain,arg?],...]}"""
import json, sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

P = json.load(open(sys.argv[1])); out = sys.argv[1].rsplit("/", 1)[0] if "/" in sys.argv[1] else "."
SR, FPS = 48000, 30
DURS = P["durs"]; ST = np.concatenate([[0], np.cumsum(DURS)[:-1]]); TOTAL = sum(DURS) / FPS; N = int(TOTAL * SR) + SR // 2
MOOD = P.get("mood", ["tense"] * len(DURS)); BEDS = P.get("beds", [None] * len(DURS))
rng = np.random.default_rng(9); T = np.arange(N) / SR
fr = lambda sc, f: (ST[sc] + f) / FPS
env = lambda n, tau: np.exp(-np.arange(n) / (tau * SR))
lp = lambda x, f: sosfilt(butter(2, f, btype="low", fs=SR, output="sos"), x)
hp = lambda x, f: sosfilt(butter(2, f, btype="high", fs=SR, output="sos"), x)
bp = lambda x, a, b: sosfilt(butter(2, [a, b], btype="band", fs=SR, output="sos"), x)
noise = lambda d: rng.normal(0, 1, int(d * SR))
saw = lambda f, t: 2 * ((t * f) % 1) - 1
def add(buf, sig, t, g=1.0):
    i = int(t * SR)
    if 0 <= i < len(buf): j = min(len(buf), i + len(sig)); buf[i:j] += sig[: j - i] * g
def win(a, b, fade=0.3): return np.clip((T - a) / fade, 0, 1) * np.clip((b - T) / fade, 0, 1)

# ================= MUSIK: drone gelap (tense) <-> terang (hope), detak, lonceng =================
hope = np.zeros(N)
for i, m in enumerate(MOOD):
    if m == "hope": hope += win(fr(i, 0), fr(i, 0) + DURS[i] / FPS + (0.6 if i < len(DURS) - 1 else 2), 0.8)
hope = np.clip(hope, 0, 1)
dark = sum(w * (saw(f * .997, T) + saw(f * 1.003, T)) for f, w in ((55, 1), (82.41, .6), (110, .5), (130.81, .35)))
bright = sum(w * (saw(f * .998, T) + saw(f * 1.002, T)) for f, w in ((65.41, .8), (98, .5), (130.81, .4), (164.81, .35)))
music = (lp(dark, 700) * (1 - hope) + lp(bright, 1300) * hope) * 0.065
n = int(0.25 * SR); k = np.arange(n) / SR
thump = np.sin(2 * np.pi * np.cumsum(40 + 50 * np.exp(-k * 30)) / SR) * env(n, 0.08)
t = 0.2
while t < TOTAL:
    tense = hope[int(t * SR)] < 0.5
    add(music, thump, t, 0.45 if tense else 0.22); add(music, thump, t + 0.27, 0.28 if tense else 0.12); t += 0.7 if tense else 0.5
t, i = 0.4, 0
while t < TOTAL - 1:
    h = hope[int(t * SR)] > 0.5; notes = [261.63, 329.63, 392.0, 523.25, 440.0, 392.0] if h else [220.0, 261.63, 329.63, 246.94]
    f0 = notes[i % len(notes)]; m = int(2.0 * SR); x = np.arange(m) / SR
    add(music, (np.sin(2 * np.pi * f0 * x) + .4 * np.sin(4 * np.pi * f0 * x)) * env(m, .55), t, 0.075); t += 0.5 if h else 1.4; i += 1

# ================= EFEK =================
def step(): m = int(0.09 * SR); return (lp(noise(0.09), 900) * env(m, 0.015) + np.sin(2 * np.pi * 70 * np.arange(m) / SR) * env(m, 0.02) * 0.6) * 0.8
def buzz_on(): m = int(0.35 * SR); x = np.arange(m) / SR; s = np.sign(np.sin(2 * np.pi * 120 * x)) * 0.25 * env(m, 0.15); s[:int(.03 * SR)] += bp(noise(.03), 2000, 6000) * .8; return s
def motor(d=1.5):
    m = int(d * SR); x = np.linspace(0, 1, m); f = 95 * (1.12 - 0.24 * x)
    return lp(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .5 + np.sin(2 * np.pi * np.cumsum(f * 2) / SR) * .3 + noise(d) * .2, 1400) * np.exp(-((x - .5) ** 2) / .04) * .9
def vibrate(d=0.4): x = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * 170 * x) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 25 * x))) * 0.5
def ring(d=0.55, f1=1250, f2=1550): x = np.arange(int(d * SR)) / SR; f = np.where(np.sin(2 * np.pi * 18 * x) > 0, f1, f2); return np.sin(2 * np.pi * np.cumsum(f) / SR) * .25 * np.minimum(1, x / .01)
def rustle(d=0.25): m = int(d * SR); return bp(noise(d), 2500, 8000) * np.sin(np.linspace(0, np.pi, m)) * 0.35
def whoosh(d=0.3, lo=300, hi=4800):
    m = int(d * SR); nz = noise(d); o = np.zeros(m); y = 0.0; kk = np.linspace(0, 1, m); a = 1 - np.exp(-2 * np.pi * (lo * (hi / lo) ** np.sin(np.pi * kk * .5)) / SR)
    for j in range(m): y += a[j] * (nz[j] - y); o[j] = y
    return o * np.sin(np.pi * kk) ** 1.5
def slap(): m = int(0.12 * SR); return (lp(noise(.12), 2500) * env(m, .02) + np.sin(2 * np.pi * 160 * np.arange(m) / SR) * env(m, .04)) * .8
def clink(): x = np.arange(int(.6 * SR)) / SR; return (np.sin(2 * np.pi * 2600 * x) + .5 * np.sin(2 * np.pi * 3900 * x)) * env(len(x), .12) * .3
def heartbeat(): m = int(.25 * SR); kk = np.arange(m) / SR; return np.sin(2 * np.pi * np.cumsum(38 + 50 * np.exp(-kk * 30)) / SR) * env(m, .09)
def chime():
    s = np.zeros(int(.9 * SR))
    for j, f in enumerate((987.8, 1318.5, 1567.98)): x = np.arange(int(.6 * SR)) / SR; add(s, np.sin(2 * np.pi * f * x) * env(len(x), .18) * .3, j * .08)
    return s
def thud(f0=45): m = int(.5 * SR); kk = np.arange(m) / SR; return np.tanh(np.sin(2 * np.pi * np.cumsum(f0 + 90 * np.exp(-kk * 18)) / SR) * env(m, .15) * 2) * .8
def tock(): m = int(.07 * SR); kk = np.arange(m) / SR; return (np.sin(2 * np.pi * np.cumsum(220 + 300 * np.exp(-kk * 60)) / SR) * env(m, .02) + lp(noise(.07), 3000) * env(m, .01) * .4) * .7
def swish(d=0.22): m = int(d * SR); return bp(noise(d), 3000, 9000) * np.sin(np.linspace(0, np.pi, m)) ** 2 * .5
def neon(): m = int(.12 * SR); x = np.arange(m) / SR; return (np.sign(np.sin(2 * np.pi * 120 * x)) * .3 + bp(noise(.12), 1500, 5000) * .3) * env(m, .05)
def popw(f=300): m = int(.1 * SR); kk = np.arange(m) / SR; return np.sin(2 * np.pi * np.cumsum(f + 700 * np.exp(-kk * 40)) / SR) * env(m, .03) * .6
def tick(): m = int(.025 * SR); return bp(noise(.025), 2000, 6000) * env(m, .004) * .6
def buzzer(): x = np.arange(int(.32 * SR)) / SR; return lp(saw(110, x) + saw(116, x), 1500) * .35 * np.minimum(1, (0.32 - x) / .03)
def riser(d=1.6): m = int(d * SR); kk = np.linspace(0, 1, m); return (bp(noise(d), 800, 6000) * .6 + np.sin(2 * np.pi * np.cumsum(150 + 900 * kk ** 2) / SR) * .3) * kk ** 2.5
def hit(): m = int(1.6 * SR); kk = np.arange(m) / SR; s = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-kk * 7)) / SR) * env(m, .5); s[:3000] += lp(noise(.0625), 2500) * np.linspace(1, 0, 3000); return np.tanh(s * 2) * .9
def glass():
    s = hp(noise(0.9), 3000) * env(int(.9 * SR), .18) * .7
    for j in range(14): f = 2500 + rng.random() * 4500; x = np.arange(int(.25 * SR)) / SR; add(s, np.sin(2 * np.pi * f * x) * env(len(x), .05) * .25, .05 + rng.random() * .6)
    return s
def crack(): m = int(.15 * SR); return hp(noise(.15), 1500) * env(m, .02) * .8
def popper(): m = int(.3 * SR); s = bp(noise(.3), 800, 5000) * env(m, .03); s += hp(noise(.3), 6000) * env(m, .12) * .4; return s
def claps(d=2.0, density=40):
    s = np.zeros(int(d * SR))
    for _ in range(int(d * density)): m = int(.03 * SR); add(s, bp(noise(.03), 900, 5000) * env(m, .006), rng.random() * d, .5 + rng.random() * .5)
    return s
FX = dict(step=step, buzz_on=buzz_on, motor=motor, vibrate=vibrate, ring=ring, rustle=rustle, whoosh=whoosh, slap=slap, clink=clink, heartbeat=heartbeat,
          chime=chime, thud=thud, tock=tock, swish=swish, neon=neon, popw=popw, tick=tick, buzzer=buzzer, riser=riser, hit=hit, glass=glass, crack=crack, popper=popper, claps=claps)

sfx = np.zeros(N)
# suasana latar per adegan
beds = {"city": lp(rng.normal(0, 1, N), 500) * .05 + bp(rng.normal(0, 1, N), 300, 1200) * .02,
        "room": bp(rng.normal(0, 1, N), 200, 900) * .025,
        "crowd": bp(rng.normal(0, 1, N), 250, 900) * .05 * (1 + .4 * np.sin(2 * np.pi * T / 1.7))}
for i, b in enumerate(BEDS):
    if b: sfx += beds[b] * win(fr(i, 0), fr(i, DURS[i]))
# transisi: whoosh tiap ganti adegan & shot; hope->tense dapat riser + hit + musik jeda
for i in range(1, len(DURS)):
    add(sfx, whoosh(.3), fr(i, 0) - .12, .3)
    if MOOD[i] == "tense" and MOOD[i - 1] == "hope":
        add(sfx, riser(1.6), fr(i, 0) - 1.6, .8); add(sfx, hit(), fr(i, 0), .9); music[(T > fr(i, 0) - .5) & (T < fr(i, 0))] *= 0.2
for sc, f in P.get("cuts", []): add(sfx, whoosh(.25), fr(sc, f) - .1, .25)
for ev in P.get("events", []):
    sc, f, name, g = ev[:4]; arg = ev[4] if len(ev) > 4 else None
    if name == "steps":  # arg = [frame_akhir, jarak_frame]
        ff = f
        while ff < arg[0]: add(sfx, step(), fr(sc, ff), g); ff += arg[1]
        continue
    sig = FX[name](*(arg if isinstance(arg, list) else [arg] if arg is not None else []))
    add(sfx, sig, fr(sc, f) - (len(sig) / SR if name == "riser" else 0), g)  # riser berakhir tepat di frame

music[: int(.4 * SR)] *= np.linspace(0, 1, int(.4 * SR)); e = int(TOTAL * SR); music[e - SR:e] *= np.linspace(1, 0, SR); music[e:] = 0
norm = lambda x, p: (x / max(1e-9, np.abs(x).max()) * p).astype(np.float32)
wavfile.write(f"{out}/music.wav", SR, norm(music, 0.8)); wavfile.write(f"{out}/sfx.wav", SR, norm(sfx, 0.9))
print("ok", round(TOTAL, 2), "detik")
```