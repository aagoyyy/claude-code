---
name: "museum-doc-video"
description: "Bikin video short 9:16 gaya Museum Dokumenter (Template 3): foto/bingkai emas terbang antar set galeri, teks tegas diketik, parallax + tekstur, VO + backsound + SFX. Pakai untuk Template 3 / gaya dokumenter museum."
---

# Museum Dokumenter (Template 3)

Ubah script + logo + foto (+ VO) jadi MP4 1080×1920 bergaya **documentary / history storytelling edit**.

Ciri visualnya:
- **Benda utama ikut "jalan" dari set ke set.** Benda di sini bisa bingkai emas berisi foto, ilustrasi, atau poster, foto polaroid, atau potongan foto orang.
- **Ada beberapa set yang bergantian:**
  - `gallery`: dinding museum cokelat dengan lampu sorot
  - `white`: dinding putih
  - `mat`: meja potong hijau tampak atas
  - `dark`: ruang gelap dengan lampu sorot
  - `blue`: ruang gelap bernuansa biru
- **Hampir tanpa potongan keras.** Benda terbang, berputar, lalu mendarat (ada hentakan); lampu menyala; kamera terus bergerak.
- **Teks tegas.** Inter Display Black kapital diketik huruf per huruf. Kata utama merah/emas dengan outline gelap, kata pengantar kecil krem berjarak lebar. Ditambah lakban kuning, stempel, coretan, dan papan skor.
- **Parallax + tekstur otomatis.** Kamera melayang dan tiap lapisan bergerak beda. Ada benda depan yang blur sesuai set (tali beludru + tiang kuningan, daun, pensil + penggaris, bokeh). Dinding bertekstur plester atau goresan, isi bingkai bertekstur kertas, ditambah butiran film, debu, goresan film, dan light leak.

Template ini memakai `render.mjs` dan `story_audio.py` dari skill **story-25d-video**. Tulis keduanya dari skill itu tanpa diubah. Kode `template3.html` dan `make_textures.py` ada di bawah. Ganti hanya `BRAND`, foto di `assets/`, dan adegan (`S3_OPEN`, `S3_COACH`, `S3_RECRUIT`, `S3_CHANCE`, `S3_CTA` + array `SCENES`). Jangan ubah bagian MESIN.

## Alur kerja

1. **Bahan.**
   - Script dan logo: versi warna + putih.
   - Foto pembicara: PNG transparan kalau mau dipotong dan berdiri di depan dinding; foto biasa cukup untuk dipajang dalam bingkai.
   - Poster atau foto produk/outlet kalau ada.
   - VO MP3 kalau ada.
   - Nama, jabatan, angka, tanggal, dan lokasi **hanya dari script/poster**. Jangan menebak siapa orang di foto; tanya kalau tidak tertulis.
   - Foto potret bisa di-crop dari poster dengan PIL lalu dipakai dalam bingkai.
2. **Folder kerja.**
   - Tulis `template3.html`, `make_textures.py`, serta `render.mjs` dan `story_audio.py` (dari story-25d-video).
   - Jalankan `python3 make_textures.py` untuk membuat `assets/tex-*`.
   - Salin logo ke `assets/logo-red.png` dan `assets/logo-white.png`. Foto ke `assets/` (mis. `coach.png`, `vivin.jpg`, `poster-small.jpg` 540×960).
   - Untuk `cutout()`, `ratio` = tinggi/lebar foto PNG.
3. **Timing.** Sama seperti story-25d-video:
   - VO digeser +0,4 detik → `audio/vo48.wav`.
   - `silencedetect` untuk batas kalimat. Potong adegan 0,2 detik sebelum kalimat berikutnya.
   - Perkiraan waktu kata = bagi rata per suku kata dalam rentang kalimat. Taruh animasi teks pas di frame kata itu diucapkan.
4. **Tulis adegan.** Bentuk adegan sama dengan Template 2:
   ```
   { set, dur, shots:[{ f0, f1, set?, cam:{x?, z, cy, dolly?, rot?}, focus, shakeFn?, flashFn?, whipIn?, layers(fl,g,F) }] }
   ```
   - `layers` mengembalikan `[{d, svg}]`. Layer pertama = dinding/set (d 0). Benda d 0.4–0.5. Teks d 0.6–0.7. Tekstur dan benda depan ditambah otomatis menurut `set`.
   - `cam.x` kosong atau `[0,0]` = kamera melayang otomatis, arahnya bergantian tiap shot.
   - **Set:** `galleryWall(g, on)`, `whiteWall`, `cuttingMat`, `darkRoom(g, warna, on, [posisi lampu])`.
   - **Benda:**
     - `goldFrame(cx, cy, skala, rotasi, isi, ghost, idUnik, W, H)`. Isi digambar di 0..W×0..H. `ghost` = jejak gerak saat terbang. `idUnik` harus beda tiap bingkai.
     - `polaroid(...)`, `cutout(href, x, y, w, ratio)`.
     - Isi bingkai: `photo(href)`, `storefront`, `bust`, `memberCard`, `folder`/`orgChart` + `scanner` (reveal ala X-ray), `mapArt` + pin, `tower`, `chairArt`, `clockArt`.
     - Grid: `crowdWall`.
   - **Pola terbang mendarat:** `t = clamp(fl/14)`, `e = 1-(1-t)^3`, posisi dari luar layar ke target dengan `lerp(..., () => e)`, rotasi `(1-e)*40`, `ghost = 1-t`. Tambahkan `shakeFn` di frame mendarat.
   - **Teks:**
     - `T(teks, x, y, ukuran, fl, d0, warna, kecepatan, anchor, w)`: diketik; `w<700` = teks kecil berjarak.
     - `tape()` = lakban nama.
     - `tapeLabel()` = penanda "MATERI 01/04".
     - `bigNumber()` = angka besar + garis merah.
     - `pinLabel()` = label kecil dengan garis putus.
     - Lainnya: `stamp`, `strikeText`, `xMark`, `slotRoll`, `scoreboard(target, …)`, `glitchWord`, `shatter`, `popWords` (hapus centang dengan `.replace(/<path[^>]*stroke-dasharray[^>]*\/>/, "")` kalau tidak perlu), `dropWord`, `button`, `confetti`.
   - **Warna:** `RED`, `GOLD`, `CREAM`, `INK` (teks di dinding putih).
5. **Aturan desain (wajib):**
   - Kata utama maks ±8 huruf di ukuran 130–150. Lebih panjang = pecah 2 baris atau kecilkan.
   - Teks di zona y 250–800. Benda di y 800–1500. Tidak ada teks penting di y > 1540 (CTA maks ±1600).
   - Kamera zoom/melayang memotong ±60 px tepi, jadi jauhkan teks dari tepi kiri/kanan.
   - Satu ide per shot, 2–3 shot per adegan. Ganti set tiap 1–2 adegan. Satu benda utama per shot.
6. **Cek frame.**
   - Jalankan `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node render.mjs template3.html --stills "0:100,1:120,..."`.
   - Gabungkan dengan PIL dan lihat. Perbaiki teks kepotong atau nabrak.
   - Kalau tekstur bikin dinding jadi abu-abu, berarti blend tidak satu grup dengan dinding. Mesin sudah menggabungkannya ke layer pertama, jadi jangan pindahkan.
7. **Render penuh** di background: `nohup node render.mjs template3.html video-silent.mp4 > render.log &`. Kecepatan ±0,7 detik/frame (±50 detik video ≈ 18 menit). Kerjakan audio sambil menunggu.
8. **Audio.**
   - Buat `audio/plan.json` untuk `story_audio.py`: durs, mood tense/hope per adegan, beds, cuts = frame ganti shot, events di frame aksi.
   - Pola efek di template ini:
     - ketik = `tick` tiap 2 frame (teks besar `tock`)
     - mendarat = `thud`
     - lakban = `slap` + `swish`
     - lampu = `buzz_on`
     - terbang = `whoosh`
     - pop = `popw`
     - scanner = `riser` + `chime`
     - xMark = `buzzer`
     - stempel = `slap` + `thud` (+5 frame)
     - shatter = `crack` → `glass` + `hit`
     - skor = `tick` beruntun + `chime` + `popper` + `claps`
   - Mix bertahap (duck musik dengan VO, lalu amix + loudnorm -14 LUFS), lalu mux `-c:v copy`. Perintahnya sama dengan story-25d-video.
9. **Kirim** MP4 lewat SendUserFile. Ringkas per adegan, minta user cek audio, dan tawarkan revisi per adegan.

## make_textures.py

```python
"""python3 make_textures.py → assets/tex-plaster.jpg, tex-paper.png, tex-scratch.png, tex-dust0..2.png"""
import os
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
os.makedirs("assets", exist_ok=True); rng = np.random.default_rng(3)
def fbm(w, h, octaves=6, base=8):
    out = np.zeros((h, w)); amp = 1; tot = 0
    for o in range(octaves):
        s = base * 2 ** o; n = rng.random((max(2, h * s // w + 2), s + 2))
        out += np.asarray(Image.fromarray((n * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), dtype=float) / 255 * amp; tot += amp; amp *= 0.55
    return out / tot
W, H = 1080, 1920
# plester dinding (abu-abu tengah, dipakai overlay/multiply) + retak halus
pl = 128 + (fbm(W, H, 7, 6) - .5) * 120 + rng.normal(0, 1, (H, W)) * 10
img = Image.fromarray(np.clip(pl, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(img)
for _ in range(18):
    x, y = rng.random() * W, rng.random() * H; pts = [(x, y)]
    for k in range(int(8 + rng.random() * 14)): x += rng.normal(0, 14); y += rng.normal(0, 14) + 4; pts.append((x, y))
    d.line(pts, fill=88, width=1)
img.filter(ImageFilter.GaussianBlur(.6)).save("assets/tex-plaster.jpg", quality=88)
# kertas/kanvas (multiply): serat + tepi menguning
w, h = 600, 720
pp = 235 + (fbm(w, h, 6, 5) - .5) * 40 + rng.normal(0, 1, (h, w)) * 6
img = Image.fromarray(np.clip(pp, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(img)
for _ in range(260):
    x, y = rng.random() * w, rng.random() * h; a = rng.random() * np.pi; L = 6 + rng.random() * 22
    d.line([(x, y), (x + np.cos(a) * L, y + np.sin(a) * L)], fill=int(200 + rng.random() * 25), width=1)
yy, xx = np.mgrid[0:h, 0:w]; e = np.minimum(np.minimum(xx, w - xx), np.minimum(yy, h - yy))
Image.fromarray(np.clip(np.asarray(img, dtype=float) - np.clip(30 - e, 0, 30) * 1.2, 0, 255).astype(np.uint8)).save("assets/tex-paper.png")
# goresan meja potong (screen)
img = Image.new("L", (W, H), 0); d = ImageDraw.Draw(img)
for _ in range(220):
    x, y = rng.random() * W, rng.random() * H; a = rng.random() * np.pi; L = 20 + rng.random() * 160
    d.line([(x, y), (x + np.cos(a) * L, y + np.sin(a) * L)], fill=int(40 + rng.random() * 70), width=1)
for _ in range(40):
    x, y = rng.random() * W, rng.random() * H; r = 8 + rng.random() * 40; d.ellipse([x - r, y - r, x + r, y + r], fill=int(15 + rng.random() * 20))
img.filter(ImageFilter.GaussianBlur(.5)).save("assets/tex-scratch.png")
# debu & goresan film (screen), 3 varian bergantian
for v in range(3):
    img = Image.new("L", (W, H), 0); d = ImageDraw.Draw(img)
    for _ in range(70):
        x, y = rng.random() * W, rng.random() * H; r = rng.random() * 2.5 + .5; d.ellipse([x - r, y - r, x + r, y + r], fill=int(120 + rng.random() * 120))
    for _ in range(5):
        x, y = rng.random() * W, rng.random() * H; pts = [(x, y)]
        for k in range(6): x += rng.normal(0, 10); y += rng.normal(0, 10); pts.append((x, y))
        d.line(pts, fill=170, width=1)
    if v == 1: x = rng.random() * W; d.line([(x, 0), (x + 6, H)], fill=90, width=1)
    img.save(f"assets/tex-dust{v}.png")
print("tekstur ok")
```

## template3.html

```html
<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>html,body{margin:0;background:#000}#stage{position:relative;width:1080px;height:1920px;overflow:hidden}.abs{position:absolute}</style></head>
<body><div id="stage"></div>
<script>
// TEMPLATE 3 "Museum Dokumenter" — ganti BRAND, foto, dan adegan; jangan ubah MESIN.
const BRAND = { logoOnLight: "assets/logo-red.png", logoOnDark: "assets/logo-white.png" };
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
  <filter id="b18"><feGaussianBlur stdDeviation="18"/></filter><filter id="b8"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .06 0"/></filter>`;
function embers(g, n = 18, col = "#ff9a6a") { return Array.from({ length: n }, (_, i) => { const p = ((g * (0.6 + hash(i) * 0.8) + hash(i + 3) * 400) % 400) / 400;
  return `<circle cx="${hash(i + 7) * 1080 + Math.sin(g / 20 + i) * 30}" cy="${1700 - p * 1500}" r="${2 + hash(i + 2) * 3}" fill="${col}" opacity="${0.7 * Math.sin(p * Math.PI)}"/>`; }).join(""); }

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
function beam(x, y0, y1, w, op = 0.3, col = "#fff3c4") {
  return `<linearGradient id="bm${Math.round(x)}${Math.round(w)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity="${op * 1.6}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient>
    <polygon points="${x - 26},${y0} ${x + 26},${y0} ${x + w / 2},${y1} ${x - w / 2},${y1}" fill="url(#bm${Math.round(x)}${Math.round(w)})"/>
    <ellipse cx="${x}" cy="${y1}" rx="${w / 2}" ry="${w / 9}" fill="${col}" opacity="${op * 0.8}" filter="url(#b18)"/>`;
}
function confetti(F, d0, n = 60) {
  if (F < d0) return ""; const t = F - d0, cols = [RED, GOLD, NEON, "#fff", "#7cf0c8"];
  return Array.from({ length: n }, (_, i) => { const x0 = hash(i) * 1080, vy = 9 + hash(i + 5) * 10, x = x0 + Math.sin(t / 6 + i) * 40, y = -60 + t * vy - hash(i + 9) * 300;
    return y > 1980 ? "" : `<rect x="${x}" y="${y}" width="16" height="26" fill="${cols[i % 5]}" transform="rotate(${t * 12 + i * 37} ${x + 8} ${y + 13})"/>`; }).join("");
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
function clockProp(x, y, r, F) {
  const a = F * 22, b = F * 2.2;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#f2ede8" stroke="#1a0a08" stroke-width="16"/>` + Array.from({ length: 12 }, (_, i) => `<line x1="${x}" y1="${y - r + 18}" x2="${x}" y2="${y - r + 46}" stroke="#1a0a08" stroke-width="8" transform="rotate(${i * 30} ${x} ${y})"/>`).join("") +
    `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * 0.5}" stroke="#1a0a08" stroke-width="16" stroke-linecap="round" transform="rotate(${b} ${x} ${y})"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * 0.78}" stroke="${RED}" stroke-width="9" stroke-linecap="round" transform="rotate(${a} ${x} ${y})"/><circle cx="${x}" cy="${y}" r="16" fill="#1a0a08"/>`;
}

// ===================== SET MUSEUM + BENDA =====================
const CREAM = "#f4e8d8", INK = "#1a1210";
function galleryWall(g, on = 1) {
  const fl = on * (0.92 + 0.08 * Math.sin(g / 9));
  return `<linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a170f"/><stop offset=".35" stop-color="#5b3826"/><stop offset=".8" stop-color="#3e2519"/><stop offset="1" stop-color="#22130c"/></linearGradient>
  <radialGradient id="gl" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".9"/><stop offset=".45" stop-color="#ffb870" stop-opacity=".18"/><stop offset="1" stop-color="#ffb870" stop-opacity="0"/></radialGradient>
  <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1309"/><stop offset="1" stop-color="#0e0603"/></linearGradient>
  <rect x="-300" y="-300" width="1680" height="2520" fill="url(#gw)"/>
  <rect x="-300" y="-300" width="1680" height="2520" fill="#000" opacity="${0.55 * (1 - on)}"/>
  <g fill="none" stroke="#1d0f09" stroke-opacity=".55" stroke-width="5">
    ${[-470, 60, 590, 1120].map((x) => `<rect x="${x}" y="230" width="430" height="900" rx="6"/><rect x="${x}" y="1210" width="430" height="360" rx="6"/>`).join("")}</g>
  <g fill="none" stroke="#a87650" stroke-opacity=".22" stroke-width="2">
    ${[-466, 64, 594, 1124].map((x) => `<rect x="${x}" y="234" width="430" height="900" rx="6"/><rect x="${x}" y="1214" width="430" height="360" rx="6"/>`).join("")}</g>
  <rect x="-300" y="1170" width="1680" height="16" fill="#1d0f09" opacity=".6"/><rect x="-300" y="1166" width="1680" height="4" fill="#b98a5e" opacity=".35"/>
  <ellipse cx="540" cy="60" rx="760" ry="1100" fill="url(#gl)" opacity="${fl}"/>
  <rect x="470" y="40" width="140" height="22" rx="8" fill="#140a06"/><rect x="530" y="-300" width="20" height="344" fill="#140a06"/>
  <ellipse cx="540" cy="66" rx="64" ry="8" fill="#fff1cf" opacity="${on}" filter="url(#b8)"/>
  <rect x="-300" y="1620" width="1680" height="600" fill="url(#gf)"/><rect x="-300" y="1612" width="1680" height="14" fill="#140804"/>
  ${on > 0.5 ? embers(g, 16, "#ffe2b0") : ""}`;
}
function whiteWall(g) {
  return `<linearGradient id="ww" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d4ce"/><stop offset=".4" stop-color="#f1eeea"/><stop offset="1" stop-color="#d6d0c9"/></linearGradient>
    <rect x="-300" y="-300" width="1680" height="2520" fill="url(#ww)"/>
    ${Array.from({ length: 70 }, (_, i) => `<line x1="${-300 + i * 24}" y1="-300" x2="${-300 + i * 24}" y2="2220" stroke="#000" stroke-opacity=".025" stroke-width="2"/>`).join("")}
    <ellipse cx="540" cy="-60" rx="900" ry="700" fill="#fff" opacity=".55" filter="url(#b18)"/>`;
}
function cuttingMat(g) {
  return `<rect x="-300" y="-300" width="1680" height="2520" fill="#1f6a4e"/>
    ${Array.from({ length: 64 }, (_, i) => `<line x1="${-300 + i * 40}" y1="-300" x2="${-300 + i * 40}" y2="2220" stroke="#bfe8d6" stroke-opacity="${i % 5 === 0 ? 0.28 : 0.1}" stroke-width="${i % 5 === 0 ? 2.5 : 1.5}"/><line x1="-300" y1="${-300 + i * 40}" x2="1380" y2="${-300 + i * 40}" stroke="#bfe8d6" stroke-opacity="${i % 5 === 0 ? 0.28 : 0.1}" stroke-width="${i % 5 === 0 ? 2.5 : 1.5}"/>`).join("")}
    ${Array.from({ length: 12 }, (_, i) => `<text x="${20 + i * 200}" y="40" font-family="Inter" font-weight="700" font-size="20" fill="#bfe8d6" opacity=".45">${i}</text>`).join("")}
    <radialGradient id="mv" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient><rect x="-300" y="-300" width="1680" height="2520" fill="url(#mv)"/>`;
}
function darkRoom(g, col = "#ffd9a0", on = 1, spots = [540]) {
  return `<rect x="-300" y="-300" width="1680" height="2520" fill="#0c0807"/>
    <radialGradient id="dr" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="${col}" stop-opacity="${0.16 * on}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient><rect x="-300" y="-300" width="1680" height="2520" fill="url(#dr)"/>
    ${spots.map((x) => beam(x, -40, 1500, 760, 0.17 * on, col)).join("")}
    <rect x="-300" y="1620" width="1680" height="600" fill="#050302"/>
    ${on > 0.5 ? embers(g, 12, col) : ""}`;
}
// asap/awan yang tersibak (transisi pembuka)
function smoke(p) {
  if (p >= 1) return "";
  return `<filter id="b40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter><g filter="url(#b40)">` +
    Array.from({ length: 14 }, (_, i) => { const side = i % 2 ? 1 : -1, x = hash(i) * 1080 + side * p * p * 900, y = hash(i + 5) * 1920 - p * 300;
      return `<circle cx="${x}" cy="${y}" r="${260 + hash(i + 9) * 220}" fill="${i % 3 ? "#e9e4df" : "#cfc7c0"}" opacity="${(1 - p) * 0.95}"/>`; }).join("") + `</g>` +
    `<rect width="1080" height="1920" fill="#e9e4df" opacity="${clamp(1 - p * 2.2, 0, 1)}"/>`;
}
// ilustrasi toko (300x360)
function storefront(sign, awn, seed, g, lit = 1) {
  const stripes = Array.from({ length: 8 }, (_, i) => `<polygon points="${24 + i * 31.5},152 ${55.5 + i * 31.5},152 ${55.5 + i * 33.5 + 4},200 ${24 + i * 33.5 - 10},200" fill="${i % 2 ? "#f6efe6" : awn}"/>`).join("");
  const scal = Array.from({ length: 9 }, (_, i) => `<circle cx="${14 + i * 34}" cy="200" r="17" fill="${i % 2 ? "#f6efe6" : awn}"/>`).join("");
  const ppl = [0, 1, 2].map((k) => { const x = 62 + k * 44, b = Math.sin(g / 8 + k + seed) * 2; return `<circle cx="${x}" cy="${262 + b}" r="10" fill="#3a1d10" opacity=".7"/><rect x="${x - 12}" y="${272 + b}" width="24" height="30" rx="8" fill="#3a1d10" opacity=".7"/>`; }).join("");
  return `<linearGradient id="sk${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2340"/><stop offset="1" stop-color="#d8794e"/></linearGradient>
    <rect width="300" height="360" fill="url(#sk${seed})"/>
    <rect x="20" y="88" width="260" height="272" fill="#e2cdb3"/>
    ${Array.from({ length: 9 }, (_, r) => `<line x1="20" y1="${100 + r * 30}" x2="280" y2="${100 + r * 30}" stroke="#c9ad8c" stroke-width="2"/>`).join("")}
    <rect x="38" y="98" width="224" height="48" rx="6" fill="#1d1210"/>
    <text x="150" y="133" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="30" letter-spacing="3" fill="${GOLD}" style="filter:drop-shadow(0 0 ${6 * lit}px ${GOLD})">${esc(sign)}</text>
    ${stripes}${scal}
    <rect x="38" y="222" width="140" height="104" fill="#ffcf86" opacity="${0.35 + 0.65 * lit}"/>${ppl}
    <rect x="38" y="222" width="140" height="104" fill="none" stroke="#5a3a24" stroke-width="6"/><line x1="108" y1="222" x2="108" y2="326" stroke="#5a3a24" stroke-width="4"/>
    <rect x="194" y="222" width="68" height="138" fill="#4a2c1a"/><rect x="204" y="234" width="48" height="60" fill="#ffcf86" opacity="${0.3 + 0.5 * lit}"/><circle cx="246" cy="300" r="4" fill="${GOLD}"/>
    <rect x="0" y="342" width="300" height="18" fill="#7a6a5c"/>
    <ellipse cx="150" cy="360" rx="${150 * lit}" ry="30" fill="#ffcf86" opacity="${0.35 * lit}" filter="url(#b8)"/>`;
}
// bingkai emas berisi konten (isi digambar di 0..W x 0..H) + tekstur kertas
function goldFrame(cx, cy, s, rot, inner, ghost = 0, seed = 0, W = 300, H = 360) {
  const B = 22;
  const gr = `<linearGradient id="gd${seed}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7d77a"/><stop offset=".45" stop-color="#b8862e"/><stop offset=".7" stop-color="#ffe7a0"/><stop offset="1" stop-color="#8a5f1c"/></linearGradient>`;
  const body = `<rect x="${-W / 2 - B + 22}" y="${-H / 2 - B + 34}" width="${W + 2 * B}" height="${H + 2 * B}" fill="#000" opacity=".45" filter="url(#b18)"/>
    <rect x="${-W / 2 - B}" y="${-H / 2 - B}" width="${W + 2 * B}" height="${H + 2 * B}" rx="5" fill="url(#gd${seed})"/>
    <rect x="${-W / 2 - 6}" y="${-H / 2 - 6}" width="${W + 12}" height="${H + 12}" fill="#5a3c12"/>
    <g transform="translate(${-W / 2} ${-H / 2})">${inner}<image href="assets/tex-paper.png" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none" style="mix-blend-mode:multiply" opacity=".7"/><rect width="${W}" height="${H}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="10"/></g>
    <rect x="${-W / 2 - B}" y="${-H / 2 - B}" width="${W + 2 * B}" height="${H + 2 * B}" rx="5" fill="none" stroke="#fff3c8" stroke-opacity=".55" stroke-width="3"/>`;
  const gh = ghost > 0.02 ? [1, 2].map((k) => `<g opacity="${0.25 / k * ghost}" transform="translate(${cx + ghost * k * 140} ${cy - ghost * k * 90}) rotate(${rot + ghost * k * 8}) scale(${s})"><rect x="${-W / 2 - B}" y="${-H / 2 - B}" width="${W + 2 * B}" height="${H + 2 * B}" fill="#d9a441" filter="url(#b18)"/></g>`).join("") : "";
  return gr + gh + `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})">${body}</g>`;
}
// teks tegas diketik (kapital, tetap rata tengah selama diketik); w<700 = teks kecil berjarak
function typeSerif(text, x, y, size, F, d0, col, rate = 1, anchor = "middle", w = 700) {
  text = text.toUpperCase(); const n = clamp(Math.floor((F - d0) * rate), 0, text.length); if (F < d0) return "";
  const cur = n < text.length || F - d0 - text.length / rate < 10 ? (F % 14 < 8 ? `<tspan fill="${CREAM}">|</tspan>` : "") : "";
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter Display" font-weight="${w >= 700 ? 900 : 700}" letter-spacing="${w >= 700 ? "0" : "0.14em"}" font-size="${size}" fill="${col}" ${w >= 700 ? `stroke="#140806" stroke-width="${size * 0.05}" paint-order="stroke fill"` : ""} style="filter:drop-shadow(0 6px 20px rgba(0,0,0,.5))">${esc(text.slice(0, n))}${cur}<tspan fill-opacity="0">${esc(text.slice(n))}</tspan></text>`;
}
const T = typeSerif;
// lakban kuning ditempel
function tape(text, x, y, size, F, d0, rot = -5) {
  if (F < d0) return ""; const p = clamp(spring(F - d0, 11, 260), 0, 1.15), w = text.length * size * 0.66 + 70;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${0.6 + 0.4 * p} ${p})"><rect x="${-w / 2 + 8}" y="${-size * 0.8 + 10}" width="${w}" height="${size * 1.4}" fill="#000" opacity=".35" filter="url(#b8)"/>
    <path d="M${-w / 2} ${-size * 0.8} L${w / 2} ${-size * 0.84} L${w / 2 - 10} ${-size * 0.4} L${w / 2 + 6} 0 L${w / 2 - 8} ${size * 0.6} L${-w / 2 + 6} ${size * 0.62} L${-w / 2 - 6} ${size * 0.2} L${-w / 2 + 6} ${-size * 0.3} Z" fill="${GOLD}"/>
    <text x="0" y="${size * 0.22}" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="${size}" fill="#1a0a08">${esc(text)}</text></g>`;
}
// angka tebal + garis merah tumbuh
function bigNumber(txt, x, y, size, F, d0) {
  if (F < d0) return ""; const p = clamp(spring(F - d0, 10, 200), 0, 1.2), u = clamp((F - d0 - 4) / 8, 0, 1), w = txt.length * size * 0.62;
  return `<g transform="translate(${x} ${y}) scale(${p})"><text x="0" y="0" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="${size}" fill="${CREAM}" style="filter:drop-shadow(0 10px 30px rgba(0,0,0,.6))">${esc(txt)}</text>
    <rect x="${-w / 2}" y="${size * 0.1}" width="${w * u}" height="${size * 0.09}" fill="${RED}"/></g>`;
}
// label kecil + garis putus ke titik
function pinLabel(text, x, y, tx, ty, F, d0) {
  if (F < d0) return ""; const p = clamp((F - d0) / 8, 0, 1), L = Math.hypot(tx - x, ty - y);
  return `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${CREAM}" stroke-width="3" stroke-dasharray="7 9" opacity=".8" style="stroke-dasharray:${L * p} ${L}"/>
    <circle cx="${tx}" cy="${ty}" r="${7 * p}" fill="${CREAM}"/>` + typeSerif(text, x, y - 12, 36, F, d0, CREAM, 1.2, x < tx ? "end" : "start", 600);
}
const photo = (href, W = 300, H = 360) => `<image href="${href}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>`;
// foto orang PNG transparan berdiri di depan dinding + bayangan di dinding (ratio = tinggi/lebar)
function cutout(href, x, y, w, ratio, op = 1) {
  const h = w * ratio;
  return `<filter id="silh" x="-20%" y="-20%" width="140%" height="140%"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"/><feGaussianBlur stdDeviation="22"/></filter>
    <g opacity="${op}"><image href="${href}" x="${x + 48}" y="${y + 20}" width="${w}" height="${h}" filter="url(#silh)"/><image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}"/></g>`;
}
function bust(col, seed, tie = false) {
  return `<linearGradient id="bs${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}"/><stop offset="1" stop-color="#1a0f0c"/></linearGradient>
    <rect width="300" height="360" fill="url(#bs${seed})"/><ellipse cx="150" cy="120" rx="120" ry="90" fill="#fff" opacity=".12"/>
    <circle cx="150" cy="145" r="62" fill="#20120e"/><path d="M40 360 Q 40 235 150 228 Q 260 235 260 360 Z" fill="#20120e"/>
    ${tie ? `<path d="M150 232 L136 250 L150 330 L164 250 Z" fill="${RED}"/><path d="M118 232 L150 262 L182 232" stroke="#f4e8d8" stroke-width="10" fill="none"/>` : ""}`;
}
function memberCard(role, col, seed) {
  return bust(col, seed) + `<rect x="0" y="292" width="300" height="68" fill="#120a08" opacity=".85"/><text x="150" y="338" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="30" letter-spacing="2" fill="${CREAM}">${esc(role)}</text>`;
}
function polaroid(cx, cy, s, rot, inner, cap, seed) {
  return `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})"><rect x="-150" y="-178" width="330" height="440" fill="#000" opacity=".35" filter="url(#b18)" transform="translate(14 22)"/>
    <rect x="-170" y="-200" width="340" height="460" fill="#f7f3ec"/><g transform="translate(-150 -180)">${inner}<image href="assets/tex-paper.png" x="0" y="0" width="300" height="360" preserveAspectRatio="none" style="mix-blend-mode:multiply" opacity=".6"/></g><image href="assets/tex-paper.png" x="-170" y="-200" width="340" height="460" preserveAspectRatio="none" style="mix-blend-mode:multiply" opacity=".5"/>
    <text x="0" y="230" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="34" fill="${INK}">${esc(cap)}</text></g>`;
}
// pemindai ala X-ray: bagian kiri sinar = isi rahasia, kanan = sampul
function scanner(x, y, w, h, p, revealInner, coverInner, id) {
  const sx = x + w * p;
  return `<clipPath id="cl${id}"><rect x="${x}" y="${y}" width="${w * p}" height="${h}"/></clipPath><clipPath id="cr${id}"><rect x="${sx}" y="${y}" width="${w * (1 - p)}" height="${h}"/></clipPath>
    <g clip-path="url(#cr${id})">${coverInner}</g><g clip-path="url(#cl${id})">${revealInner}</g>
    ${p > 0 && p < 1 ? `<rect x="${sx - 26}" y="${y - 40}" width="52" height="${h + 80}" rx="26" fill="#f2f2f2" stroke="#ff2a3a" stroke-width="4" style="filter:drop-shadow(0 0 24px #ff2a3a)"/><rect x="${sx - 4}" y="${y - 30}" width="8" height="${h + 60}" fill="#ff2a3a"/>` : ""}`;
}
function folder(seed) {
  return `<rect width="300" height="360" fill="#c9a77a"/><rect x="0" y="0" width="300" height="360" fill="#8a6a3f" opacity=".25"/>
    <path d="M30 40 h120 l20 20 h100 v260 h-240 Z" fill="#e2c48f"/><rect x="60" y="150" width="180" height="70" fill="none" stroke="${RED}" stroke-width="8" transform="rotate(-10 150 185)"/>
    <text x="150" y="200" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="38" fill="${RED}" transform="rotate(-10 150 185)">RAHASIA</text>`;
}
function orgChart() {
  const node = (x, y, c) => `<circle cx="${x}" cy="${y}" r="30" fill="${c}"/><circle cx="${x}" cy="${y - 6}" r="11" fill="#fff"/><path d="M${x - 16} ${y + 18} q16 -20 32 0" fill="#fff"/>`;
  return `<rect width="300" height="360" fill="#140c0a"/><g stroke="#ff5a5f" stroke-width="5" fill="none"><path d="M150 90 V150 M60 150 H240 M60 150 V200 M150 150 V200 M240 150 V200 M150 230 V270 M100 270 H200 M100 270 V300 M200 270 V300"/></g>
    ${node(150, 70, RED)}${node(60, 215, "#c46a2a")}${node(150, 215, "#2f6b52")}${node(240, 215, "#6b3f8a")}${node(100, 310, "#8a7a6c")}${node(200, 310, "#8a7a6c")}
    <text x="150" y="30" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="22" letter-spacing="3" fill="${GOLD}">SUPERTEAM</text>`;
}
function tower(seed) {
  return `<linearGradient id="tw${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5566"/><stop offset="1" stop-color="#1c222c"/></linearGradient><rect width="300" height="360" fill="#9aa6b5"/>
    <rect x="70" y="30" width="160" height="330" fill="url(#tw${seed})"/>${Array.from({ length: 24 }, (_, i) => `<rect x="${86 + (i % 4) * 36}" y="${50 + Math.floor(i / 4) * 48}" width="22" height="30" fill="#c9d6e6" opacity=".5"/>`).join("")}
    <text x="150" y="25" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="22" letter-spacing="2" fill="#1c222c">BRAND BESAR</text>`;
}
// peta (600x420) + pin bermunculan
function mapArt(g, F, d0) {
  const isl = `<g fill="#cdb48a" stroke="#8a6a3f" stroke-width="3">
    <path d="M40 120 C 70 140 120 200 150 250 C 140 262 120 255 100 230 C 70 190 45 150 40 120 Z"/>
    <path d="M160 268 C 220 270 300 278 360 290 C 360 300 300 300 240 292 C 200 288 170 285 160 268 Z"/>
    <path d="M210 110 C 260 90 320 110 330 160 C 320 210 270 230 230 210 C 205 185 195 140 210 110 Z"/>
    <path d="M370 130 C 395 120 400 160 385 190 C 410 190 425 200 420 210 C 400 210 385 220 380 245 C 368 230 372 200 360 185 C 352 165 358 140 370 130 Z"/>
    <path d="M470 170 C 520 160 570 175 580 210 C 560 240 510 245 480 225 C 465 210 460 185 470 170 Z"/></g>`;
  const pins = [[90, 180], [140, 240], [200, 282], [280, 288], [340, 292], [250, 150], [300, 190], [385, 180], [395, 230], [520, 200], [60, 140], [230, 275]];
  return `<rect width="600" height="420" fill="#efe2c6"/><rect width="600" height="420" fill="#8a6a3f" opacity=".08"/>${Array.from({ length: 10 }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="420" stroke="#8a6a3f" stroke-opacity=".15"/>`).join("")}${isl}` +
    pins.map(([x, y], i) => { const p = clamp(spring(F - d0 - i * 3, 9, 240), 0, 1.25); return p <= 0 ? "" : `<g transform="translate(${x} ${y}) scale(${p})"><ellipse cx="0" cy="2" rx="9" ry="4" fill="#000" opacity=".3"/><path d="M0 0 C -14 -16 -14 -36 0 -40 C 14 -36 14 -16 0 0 Z" fill="${RED}"/><circle cx="0" cy="-26" r="6" fill="#fff"/></g>`; }).join("");
}
function chairArt(g) {
  const st = (g % 45) / 45;
  return `<rect width="300" height="360" fill="#e9dccb"/><rect x="0" y="250" width="300" height="110" fill="#b99a74"/>
    <rect x="80" y="70" width="140" height="150" rx="16" fill="#2a1a14"/><rect x="70" y="205" width="160" height="34" rx="10" fill="#3a241a"/><rect x="88" y="236" width="12" height="90" fill="#2a1a14"/><rect x="200" y="236" width="12" height="90" fill="#2a1a14"/>
    <rect x="96" y="120" width="108" height="34" rx="4" fill="${GOLD}"/><text x="150" y="145" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="24" fill="${INK}">OWNER</text>
    <rect x="232" y="228" width="40" height="44" rx="6" fill="#fff"/><rect x="232" y="228" width="40" height="10" fill="${RED}"/>
    ${[0, 1].map((k) => { const p = (st + k * 0.5) % 1; return `<path d="M${244 + k * 14} ${222 - p * 60} q -8 -12 0 -24 q 8 -12 0 -24" stroke="#fff" stroke-width="4" fill="none" opacity="${0.8 * (1 - p)}"/>`; }).join("")}`;
}
function clockArt(F) { return `<rect width="300" height="360" fill="#1b2433"/>` + clockProp(150, 180, 120, F); }
// dinding penuh potret kecil (bukti sosial)
function crowdWall(F, d0) {
  let o = ""; const cols = ["#c46a2a", "#2f6b52", "#6b3f8a", RED, "#8a7a6c", "#3a6b8a"];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 7; c++) { const i = r * 7 + c, x = 90 + c * 150, y = 760 + r * 150, p = clamp(spring(F - d0 - (r + c) * 1.6, 10, 240), 0, 1.15);
    if (p <= 0) continue;
    o += `<g transform="translate(${x} ${y}) scale(${p * 0.38})"><rect x="-162" y="-192" width="324" height="384" fill="#c9a24a"/><g transform="translate(-150 -180)">${bust(cols[i % 6], 100 + i)}</g></g>`; }
  return o;
}
function button(text, x, y, w, F, d0, pressed) {
  if (F < d0) return ""; const p = clamp(spring(F - d0, 11, 220), 0, 1.1), sc = pressed ? 0.94 + 0.06 * clamp((F - d0) / 30, 0, 1) : 1;
  return `<g transform="translate(${x} ${y}) scale(${p * sc})"><rect x="${-w / 2}" y="-58" width="${w}" height="116" rx="58" fill="${RED}" style="filter:drop-shadow(0 12px 30px rgba(225,29,46,.6))"/>
    <text x="0" y="16" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="46" fill="#fff">${esc(text)}</text></g>`;
}

// ===================== TEKSTUR + PARALLAX (otomatis per set) =====================
const TEX = { gallery: ["assets/tex-plaster.jpg", "overlay", 0.55], white: ["assets/tex-plaster.jpg", "multiply", 0.35], dark: ["assets/tex-plaster.jpg", "overlay", 0.45], mat: ["assets/tex-scratch.png", "screen", 0.55] };
function texLayer(set) { const t = TEX[set] || TEX.gallery; return `<image href="${t[0]}" x="-300" y="-300" width="1680" height="2520" preserveAspectRatio="none" style="mix-blend-mode:${t[1]}" opacity="${t[2]}"/>`; }
function bokehFg(g, col, n = 7) { return Array.from({ length: n }, (_, i) => { const x = (hash(i + 70) * 1400 - 160 + g * (0.6 + hash(i) * 0.8)) % 1400 - 160, y = 200 + hash(i + 80) * 1600 + Math.sin(g / 30 + i) * 30;
  return `<circle cx="${x}" cy="${y}" r="${30 + hash(i + 90) * 60}" fill="${col}" opacity="${0.08 + 0.06 * Math.sin(g / 15 + i)}"/>`; }).join(""); }
function stanchion(x) { return `<rect x="${x - 16}" y="1480" width="32" height="520" fill="#b8862e"/><rect x="${x - 10}" y="1480" width="8" height="520" fill="#ffe7a0" opacity=".6"/><ellipse cx="${x}" cy="1476" rx="34" ry="22" fill="#d9a441"/><ellipse cx="${x}" cy="2000" rx="90" ry="26" fill="#8a5f1c"/>`; }
function foreground(set, g) {
  if (set === "gallery") return bokehFg(g, "#ffd9a0") + `<path d="M-60 1560 Q 540 1760 1140 1560" stroke="#7a0a14" stroke-width="44" fill="none"/><path d="M-60 1552 Q 540 1745 1140 1552" stroke="#c02030" stroke-width="10" fill="none" opacity=".6"/>` + stanchion(30) + stanchion(1050);
  if (set === "white") return `<g fill="#1d3a2a" opacity=".9">${[[-80, 1500, 40], [-40, 1650, -10], [40, 1780, 30], [1100, 1580, 200], [1150, 1720, 170]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="190" ry="70" transform="rotate(${r} ${x} ${y})"/>`).join("")}</g>` + bokehFg(g, "#ffffff", 5);
  if (set === "mat") return `<g transform="rotate(-28 980 1700)"><rect x="700" y="1660" width="620" height="54" fill="#f2c230"/><polygon points="700,1660 620,1687 700,1714" fill="#e8c9a0"/><polygon points="640,1680 620,1687 640,1694" fill="#222"/><rect x="1240" y="1660" width="60" height="54" fill="#d9d9d9"/></g>` +
    `<g transform="rotate(12 120 300)"><rect x="-200" y="230" width="560" height="90" fill="#e9eef2" opacity=".85"/>${Array.from({ length: 28 }, (_, i) => `<line x1="${-190 + i * 20}" y1="230" x2="${-190 + i * 20}" y2="${i % 5 ? 252 : 268}" stroke="#333" stroke-width="3"/>`).join("")}</g>`;
  return bokehFg(g, set === "blue" ? "#9fd8ff" : "#ffd9a0", 9);
}

// ===================== ADEGAN CONTOH (Gratyo — ganti sesuai script) =====================
const SIGNS = [["KOPI", RED], ["BAKMI", "#2f6b52"], ["BAKERY", "#c46a2a"], ["RESTO", "#8e0f1c"], ["BOBA", "#6b3f8a"]];
// Pembuka: asap tersibak + lampu nyala → bingkai toko terbang mendarat + lakban + label → 5 bingkai + angka besar
const S3_OPEN = { set: "gallery", dur: 163, shots: [
  { f0: 0, f1: 60, cam: { x: [0, 0], z: [1.12, 1.02], cy: 900 }, focus: 0.6,
    layers(fl, g, F) { const on = step(fl, [[0, 0], [8, 1], [10, 0.2], [13, 1]]);
      return [{ d: 0, svg: galleryWall(g, on) },
        { d: 0.6, svg: T("khusus untuk", 540, 610, 46, F, 14, CREAM, 0.9, "middle", 500) + T("pebisnis", 540, 790, 150, F, 40, RED, 0.75) },
        { d: 0.95, svg: smoke(clamp(fl / 26, 0, 1)) }]; } },
  { f0: 60, f1: 112, cam: { x: [0, 0], z: [1.0, 1.08], cy: 1000 }, focus: 0.6, shakeFn: (fl) => (fl >= 14 && fl < 22 ? (22 - fl) * 2.2 : 0),
    layers(fl, g, F) { const t = clamp(fl / 14, 0, 1), e = 1 - Math.pow(1 - t, 3);
      const fx = lerp(t, [0, 1], [1250, 540], () => e), fy = lerp(t, [0, 1], [260, 1080], () => e), rot = (1 - e) * 48 - 4 + (t >= 1 ? Math.sin((fl - 14) / 3) * Math.exp(-(fl - 14) / 6) * 4 : 0);
      return [{ d: 0, svg: galleryWall(g, 1) },
        { d: 0.45, svg: goldFrame(fx, fy + 70, 1.5 * (0.7 + 0.3 * e), rot, storefront("KOPI", RED, 1, g, clamp((fl - 16) / 6, 0, 1)), (1 - t), 1) },
        { d: 0.6, svg: T("khusus untuk", 540, 400, 44, F, 14, CREAM, 0.9, "middle", 500) + T("pebisnis", 540, 560, 140, F, 40, RED, 0.75) + tape("F&B", 790, 660, 84, fl, 2, -7) +
            pinLabel("kopi", 250, 980, 300, 1060, fl, 20) + pinLabel("resto", 840, 1100, 790, 1150, fl, 26) + pinLabel("bakery", 310, 1520, 330, 1420, fl, 32) }]; } },
  { f0: 112, f1: 163, cam: { x: [0, 0], z: [1.1, 1.0], cy: 1000 }, focus: 0.55, shakeFn: (fl) => (fl >= 22 && fl < 30 ? (30 - fl) * 2 : 0),
    layers(fl, g, F) { const pos = [[215, 1075], [540, 1050], [865, 1075], [378, 1450], [702, 1450]];
      const frames = pos.map(([x, y], i) => { const p = clamp(spring(fl - i * 4, 10, 220), 0, 1.15);
        return p <= 0 ? "" : goldFrame(x, y + (1 - clamp(p, 0, 1)) * -120, 0.86 * p, [-3, 2, -2, 3, -1][i], storefront(SIGNS[i][0], SIGNS[i][1], i + 2, g, clamp((fl - i * 4 - 6) / 5, 0, 1)), 0, i + 10); }).join("");
      return [{ d: 0, svg: galleryWall(g, 1) }, { d: 0.45, svg: frames },
        { d: 0.62, svg: T("lebih dari", 540, 350, 46, fl, 0, CREAM, 1, "middle", 500) + bigNumber("5+", 540, 610, 270, fl, 22) + T("outlet", 540, 800, 140, F, 146, RED, 0.6) }]; } },
] };
// Pembicara: foto PNG naik dari bawah + lakban nama + grafik terbang → whip ke bingkai potret orang kedua
const S3_COACH = { set: "gallery", dur: 207, shots: [
  { f0: 0, f1: 150, cam: { x: [0, 0], z: [1.0, 1.08], cy: 1100 }, focus: 0.6, shakeFn: (fl) => (fl >= 64 && fl < 72 ? (72 - fl) * 1.8 : 0),
    layers(fl, g, F) { const rise = clamp(spring(fl - 2, 13, 140), 0, 1.05), t = clamp((fl - 50) / 14, 0, 1), e = 1 - Math.pow(1 - t, 3);
      return [{ d: 0, svg: galleryWall(g, 1) },
        { d: 0.4, svg: fl >= 50 ? goldFrame(lerp(t, [0, 1], [1300, 850], () => e), lerp(t, [0, 1], [300, 860], () => e), 0.85, (1 - e) * 40 - 9, `<rect width="300" height="360" fill="#1b1210"/><line x1="26" y1="320" x2="280" y2="320" stroke="#f3e6d2" stroke-opacity=".35" stroke-width="3"/>
          ${[[38, 62, "#8a7a6c"], [98, 110, "#a8968a"], [158, 170, "#d0bfae"], [218, 270, RED]].map(([x, h, c], i) => `<rect x="${x}" y="${320 - h * clamp((fl - 64 - i * 4) / 10, 0, 1)}" width="44" height="${h * clamp((fl - 64 - i * 4) / 10, 0, 1)}" fill="${c}"/>`).join("")}
          <path d="M46 250 L120 200 L180 140 L256 30" stroke="${GOLD}" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="320" stroke-dashoffset="${320 * (1 - clamp((fl - 80) / 20, 0, 1))}"/>`, 1 - t, 30) : "" },
        { d: 0.62, svg: cutout("assets/coach.png", 40, 740 + (1 - rise) * 900, 960, 1049 / 864) },
        { d: 0.7, svg: T("business", 540, 330, 130, fl, 6, CREAM, 0.8) + T("coach", 540, 470, 130, fl, 16, RED, 0.8) + (fl >= 76 ? slotRoll(["PULUHAN MILIAR", "TRILIUNAN"], 540, 640, 76, fl, 76, 40) : "") + tape("YOHANES G. PAULY", 350, 1300, 50, fl, 26, -4) +
            (fl >= 34 ? `<g transform="translate(130 1380) rotate(-2)"><rect x="0" y="0" width="${430 * clamp((fl - 34) / 8, 0, 1)}" height="54" fill="#141014"/><text x="20" y="38" font-family="Inter Display" font-weight="700" font-size="26" letter-spacing="3" fill="${CREAM}" opacity="${clamp((fl - 40) / 4, 0, 1)}">FOUNDER OF GRATYO®</text></g>` : "") }]; } },
  { f0: 150, f1: 207, cam: { x: [-20, 20], z: [1.02, 1.08], cy: 1000 }, focus: 0.55, whipIn: true, shakeFn: (fl) => (fl >= 12 && fl < 20 ? (20 - fl) * 2 : 0),
    layers(fl, g, F) { const t = clamp(fl / 12, 0, 1), e = 1 - Math.pow(1 - t, 3);
      return [{ d: 0, svg: galleryWall(g, 1) },
        { d: 0.45, svg: goldFrame(540, lerp(t, [0, 1], [-400, 960], () => e), 1.75, (1 - e) * -25 + 2, photo("assets/vivin.jpg"), 1 - t, 31) },
        { d: 0.65, svg: T("dan", 540, 380, 52, fl, 0, CREAM, 1, "middle", 500) + tape("VIVIN SUHARJA", 540, 1430, 56, fl, 12, -3) +
            (fl >= 20 ? `<g transform="translate(540 1520) rotate(-1)"><rect x="${-300 * clamp((fl - 20) / 8, 0, 1)}" y="-30" width="${600 * clamp((fl - 20) / 8, 0, 1)}" height="60" fill="#141014"/><text x="0" y="12" text-anchor="middle" font-family="Inter Display" font-weight="700" font-size="28" letter-spacing="3" fill="${CREAM}" opacity="${clamp((fl - 26) / 4, 0, 1)}">CO-FOUNDER SANCHA ARTISAN TEA</text></g>` : "") }]; } },
] };
// Meja potong tampak atas: polaroid kandidat, satu dilingkari, dua dicoret & dilempar
const CANDS = [["#c46a2a", "KANDIDAT A"], ["#2f6b52", "KANDIDAT B"], ["#6b3f8a", "KANDIDAT C"]];
const S3_RECRUIT = { set: "mat", dur: 167, shots: [
  { f0: 0, f1: 167, cam: { x: [0, 0], z: [1.04, 1.12], rot: [-1, 1], cy: 1100 }, focus: 0.55, shakeFn: (fl) => (fl >= 120 && fl < 126 ? (126 - fl) * 1.6 : 0),
    layers(fl, g, F) {
      const pol = [[250, 1250, -8], [540, 1180, 3], [830, 1260, 9]].map(([x, y, r], i) => { const p = clamp(spring(fl - 4 - i * 6, 12, 200), 0, 1.1);
        const out = i !== 1 && fl > 136 ? Math.pow((fl - 136) / 20, 2) * 1400 * (i === 0 ? -1 : 1) : 0;
        return p <= 0 ? "" : polaroid(x + out + (1 - clamp(p, 0, 1)) * (i - 1) * 600, y - (1 - clamp(p, 0, 1)) * 500, 0.78 * (i === 1 && fl > 56 ? 1 + 0.08 * clamp((fl - 56) / 10, 0, 1) : 1), r, bust(CANDS[i][0], 70 + i), CANDS[i][1], 70 + i) +
          (i !== 1 ? `<g transform="translate(${x + out} ${y - 40})">${xMark(0, 0, fl, i === 0 ? 112 : 120, 1.3)}</g>` : ""); }).join("");
      const ring = clamp((fl - 52) / 12, 0, 1);
      return [{ d: 0, svg: cuttingMat(g) },
        { d: 0.45, svg: pol + `<ellipse cx="540" cy="1190" rx="230" ry="290" fill="none" stroke="${RED}" stroke-width="12" stroke-linecap="round" stroke-dasharray="1700" stroke-dashoffset="${1700 * (1 - ring)}" transform="rotate(-6 540 1190)"/>` +
            (fl > 64 ? `<path d="M690 960 l34 38 l70 -86" stroke="${GOLD}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-dasharray="200" stroke-dashoffset="${200 * (1 - clamp((fl - 64) / 8, 0, 1))}"/>` : "") },
        { d: 0.65, svg: tapeLabel("MATERI 02/04", 260, 250, fl, 2) +
            (fl < 74 ? T("merekrut", 540, 420, 52, fl, 8, CREAM, 1, "middle", 600) + T("orang yang", 540, 560, 104, fl, 24, CREAM, 0.8) + T("tepat", 540, 700, 130, fl, 40, GOLD, 0.8) :
              T("bukan sekadar", 540, 420, 52, fl, 74, CREAM, 1, "middle", 600) + strikeText("MENGISI POSISI", 540, 600, 96, fl, 92)) }]; } },
] };
// Ruang biru: jam berdetak + glitch → dolly zoom + "2X" pecah (flash + hentakan)
const S3_CHANCE = { set: "blue", dur: 139, shots: [
  { f0: 0, f1: 64, cam: { x: [0, 0], z: [1.0, 1.08], cy: 1100 }, focus: 0.5, shake: 1.5,
    layers(fl, g, F) { return [{ d: 0, svg: darkRoom(g, "#9fd8ff", 1, [540]) },
      { d: 0.45, svg: goldFrame(540, 1180, 1.5, 0, clockArt(g * 3), 0, 91) },
      { d: 0.65, svg: glitchWord("KESEMPATAN", 540, 480, 120, fl, g, "#fff", 2) + T("ini tidak akan datang", 540, 600, 46, fl, 30, "#cfe9ff", 1.2, "middle", 600) }]; } },
  { f0: 64, f1: 139, cam: { x: [0, 0], z: [1.0, 1.25], cy: 1100, dolly: true }, focus: 0.5, shakeFn: (fl) => (fl >= 22 && fl < 32 ? (32 - fl) * 2.5 : 0),
    flashFn: (fl) => (fl >= 24 && fl < 28 ? (28 - fl) * 0.09 : 0),
    layers(fl, g, F) { return [{ d: 0, svg: darkRoom(g, "#9fd8ff", 1, [300, 780]) },
      { d: 0.45, svg: goldFrame(540, 1180, 1.5, 0, clockArt(g * 3), 0, 92) },
      { d: 0.6, svg: shatter("2X", 540, 860, 380, fl, 2) + (fl > 36 ? popWords(["DALAM", "HIDUP ANDA"], 540, 420, 100, fl, 36, 6, "#fff").replace(/<path[^>]*stroke-dasharray[^>]*\/>/, "") : "") }]; } },
] };
// CTA: poster terbang ke dinding + lakban tanggal/lokasi + tombol ditekan + konfeti
const S3_CTA = { set: "gallery", dur: 128, shots: [
  { f0: 0, f1: 128, cam: { x: [0, 0], z: [1.06, 1.0], cy: 1000 }, focus: 0.5,
    layers(fl, g, F) { const t = clamp(fl / 14, 0, 1), e = 1 - Math.pow(1 - t, 3), tap = 70;
      return [{ d: 0, svg: galleryWall(g, 1) },
        { d: 0.45, svg: goldFrame(lerp(t, [0, 1], [1500, 540], () => e), 1010, 0.95, (1 - e) * 40 + 2, `<image href="assets/poster-small.jpg" x="0" y="0" width="300" height="533" preserveAspectRatio="xMidYMid slice"/>`, 1 - t, 95, 300, 533) },
        { d: 0.65, svg: T("daftarkan bisnis anda", 540, 300, 52, fl, 4, CREAM, 1.2, "middle", 600) + T("sekarang!", 540, 450, 140, fl, 22, RED, 0.8) +
            tape("19 NOV 2026 · NOVOTEL NORTH JAKARTA", 540, 1350, 40, fl, 40, -2) + button("DAFTAR MASTERCLASS", 540, 1490, 760, fl, 54, fl >= tap) +
            (fl >= tap && fl < tap + 14 ? `<circle cx="760" cy="1490" r="${30 + (fl - tap) * 14}" fill="none" stroke="#fff" stroke-width="6" opacity="${1 - (fl - tap) / 14}"/>` : "") +
            (fl > 46 && fl < tap ? `<circle cx="${lerp(fl, [46, tap], [960, 760])}" cy="${lerp(fl, [46, tap], [1700, 1490])}" r="36" fill="#fff" opacity=".85"/>` : "") +
            T("klik link di bawah", 540, 1600, 34, fl, 84, CREAM, 1.2, "middle", 600) + confetti(fl, tap + 2, 50) }]; } },
] };
const SCENES = [S3_OPEN, S3_COACH, S3_RECRUIT, S3_CHANCE, S3_CTA];

// =====================================================================
// MESIN (jangan diubah): kamera melayang + DOF + tekstur & benda depan otomatis + debu/light leak
// =====================================================================
window.setup = () => { let st = 0; SCENES.forEach((sc) => { sc.start = st; st += sc.dur; }); return SCENES.map((s) => s.dur); };
window.draw = (i, F) => {
  const sc = SCENES[i], g = sc.start + F;
  const sh = sc.shots.find((s) => F >= s.f0 && F < s.f1) || sc.shots[sc.shots.length - 1];
  const fl = F - sh.f0, len = sh.f1 - sh.f0, t = clamp(fl / len, 0, 1), cam = sh.cam;
  const si = sc.shots.indexOf(sh), auto = !cam.x || (cam.x[0] === 0 && cam.x[1] === 0);
  const cx = auto ? (si % 2 ? 1 : -1) * (-55 + 110 * ease(t)) : cam.x[0] + (cam.x[1] - cam.x[0]) * ease(t), z = cam.z[0] + (cam.z[1] - cam.z[0]) * ease(t);
  const cyo = cam.y ? cam.y[0] + (cam.y[1] - cam.y[0]) * ease(t) : -25 + 50 * ease(t);
  const rot = cam.rot ? cam.rot[0] + (cam.rot[1] - cam.rot[0]) * ease(t) : 0, cy = cam.cy || 1100;
  const shk = (sh.shakeFn ? sh.shakeFn(fl) : 0) + (sh.shake || 0);
  const jx = (hash(g * 1.3) - 0.5) * 2 * shk + Math.sin(g / 7) * shk, jy = (hash(g * 2.1) - 0.5) * 2 * shk + Math.cos(g / 9) * shk;
  let wx = 0, wb = 0;
  if (sh.whipOut && fl > len - 6) { const p = (fl - (len - 6)) / 6; wx = -p * p * 900; wb = p * 60; }
  if (sh.whipIn && fl < 6) { const p = 1 - fl / 6; wx = p * p * 900; wb = p * 60; }
  let filters = "";
  const set = sh.set || sc.set || "gallery", raw = sh.layers(fl, g, F);
  const LL = [{ d: raw[0].d, svg: raw[0].svg + texLayer(set) }, ...raw.slice(1), { d: 1, svg: foreground(set, g) }];
  const layers = LL.map((L, k) => {
    const s = cam.dolly ? 1 + (z - 1) * (1.7 * (1 - L.d) - 0.05) : 1 + (z - 1) * (0.35 + L.d * 1.3);
    const dof = Math.abs(L.d - (sh.focus ?? 0.8)) * 14;
    const blur = Math.max(0, dof - 2) + (L.d === 1 ? 6 : 0);
    if (blur > 0.5 || wb) filters += `<filter id="f${k}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(blur + wb).toFixed(1)} ${blur.toFixed(1)}"/></filter>`;
    return `<g ${blur > 0.5 || wb ? `filter="url(#f${k})"` : ""} transform="translate(${540 + cx * (L.d * 1.5 - 0.35) + jx * (0.3 + L.d) + wx * (0.5 + L.d * 0.8)} ${cy + jy * (0.3 + L.d) + cyo * (0.3 + L.d * 0.7)}) rotate(${rot}) scale(${s}) translate(-540 ${-cy})">${L.svg}</g>`;
  }).join("");
  const cut = (fl < 2 && !sh.whipIn ? 0.12 * (2 - fl) / 2 : 0) + (sh.flashFn ? sh.flashFn(fl) : 0);
  document.getElementById("stage").innerHTML =
    `<svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920"><defs>${DEFS}${filters}</defs>${layers}<rect width="1080" height="1920" filter="url(#grain)"/></svg>
     <img class="abs" src="assets/tex-dust${Math.floor(g / 2) % 3}.png" style="left:${(hash(g) - .5) * 30}px;top:${(hash(g + 1) - .5) * 30}px;width:1080px;height:1920px;mix-blend-mode:screen;opacity:.35"/>
     <div class="abs" style="inset:0;mix-blend-mode:screen;opacity:${0.18 + 0.1 * Math.sin(g / 23)};background:radial-gradient(ellipse at ${20 + 60 * (0.5 + 0.5 * Math.sin(g / 40))}% 0%,rgba(255,150,70,.55),rgba(0,0,0,0) 55%)"></div>
     <div class="abs" style="inset:0;box-shadow:inset 0 0 260px rgba(0,0,0,.6)"></div>
     ${sc.overlay ? sc.overlay(F, g) : ""}
     ${cut ? `<div class="abs" style="inset:0;background:#fff;opacity:${cut}"></div>` : ""}`;
};
</script></body></html>
```