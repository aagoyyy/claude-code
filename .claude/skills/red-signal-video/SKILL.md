---
name: "red-signal-video"
description: "Bikin video short vertikal 9:16 gaya Red Signal (merah dominan, kartu UI, fokus blur, penanda bab) dari script dan logo, dirender jadi MP4 lengkap dengan backsound dan efek suara. Pakai saat diminta bikin video Red Signal atau iklan/promo short dari script dengan style ini."
---

# Red Signal — video short dari script

Ubah script + logo jadi video MP4 1080×1920 bergaya Red Signal: latar terang hangat, merah #E11D2E sebagai warna utama (±30% layar), judul kapital tebal dengan kotak sorotan bersiku, kartu jendela UI, elemen masuk dari blur ke tajam, penanda bab "01 / 06", transisi sapuan merah, kilat, dan iris gelap.

Mesin = satu halaman HTML (`redsignal.html`) yang menggambar tiap frame, direkam Playwright + ffmpeg (`render.mjs`). Kode lengkap keduanya ada di bawah. Tulis apa adanya, lalu ganti hanya blok `BRAND` dan array `SCENES`.

## Alur kerja

1. **Bahan.** Minta script dan logo. Idealnya 2 versi PNG transparan: untuk latar terang (warna) dan latar gelap (putih). Cuma ada 1 logo → pakai di keduanya. Foto pembicara/produk (PNG transparan) opsional. Jangan mengarang nama, angka, atau klaim yang tidak ada di script. Kalau script ambigu (typo angka dll.), pakai tafsiran paling masuk akal dan sebutkan di jawaban akhir.
2. **Siapkan folder kerja** (mis. `rs-video/`): tulis `redsignal.html` dan `render.mjs` dari kode di bawah. Salin logo ke `assets/logo-light.png` dan `assets/logo-dark.png`, crop ke area isi dan kecilkan ke lebar 1200 px (Pillow: `im.crop(im.getbbox())`).
3. **Pecah script jadi 6 bab, 8–12 adegan, total 30–50 detik.** Satu ide per adegan.
   | Bab | Isi | Latar / transisi masuk |
   |---|---|---|
   | 01 Hook | Siapa target / pertanyaan kaget | light, `wipe` (adegan pertama) |
   | 02 Masalah / Kredibilitas | Masalah yang relate, atau siapa pembicaranya | light, `rack`; layar punch: `red` + `flash` |
   | 03–04 Isi / Solusi | Poin-poin materi/fitur, 1 poin = 1 adegan dengan visualnya sendiri | adegan pertama bab 03 `wipe`, sisanya `rack` |
   | 05 Bukti | Angka, peserta, testimoni (hanya dari script) | light, `rack` |
   | 06 Penutup | Urgensi lalu CTA | `dark` + `iris`, CTA `rack` |
4. **Tulis SCENES.** Tiap adegan `{ ch, bg: "light"|"red"|"dark", enter: "wipe"|"rack"|"flash"|"iris", narration, minF?, render(f, dur) }`. `narration` = potongan kalimat script apa adanya (jadi subtitle, durasi otomatis ±2,6 kata/detik). Pakai komponen: `label()`, `title(lines, hl)`, `highlight()`, `windowCard()`, `icon()` (store, person, check, cross, pin, star4), `blurIn()`, `pop()`. Konten di dalam kotak 920×1040 (`.ctr`): label di top 0, judul di top 64, visual mulai ±400.
   Pilih visual sesuai isi, jangan cuma teks. Resep yang ada di contoh:
   - grid ikon pop-in (jumlah)
   - kartu profil + bar progres (kredibilitas)
   - layar punch kata raksasa + ikon (momen kunci, maks 2 per video)
   - bagan organisasi dengan centang (tim, struktur)
   - kartu swap makin cepat lalu ✓ (memilih, mencoba-coba)
   - grafik batang menyalip (bersaing, tumbuh)
   - peta pin bertambah (ekspansi, cabang)
   - counter angka + grid orang (bukti sosial)
   - judul tengah di latar gelap (urgensi)
   - kartu logo + tombol pill + panah (CTA)
   Buat visual baru dengan pola yang sama kalau butuh.
5. **Aturan desain (wajib):**
   - Judul maks 2 baris, maks ±12 karakter per baris di ukuran 118–128 (kalau lebih panjang turunkan ke 100). Baris yang disorot = kata kunci.
   - Maks 1 kotak sorotan per layar, maks 7 kata di layar selain subtitle.
   - Teks penting tidak di zona kanan (x > 960) dan bawah (y > 1540). Subtitle di y 1310.
   - Warna hanya palet: Signal Red #E11D2E, Deep Red #8E0F1C, Blush #FCE4E4, Paper #F5EFEA, Ink #141414, Stone #8A8480, Night #140808, putih.
   - Selalu ada gerakan tiap ≤1 detik.
6. **Cek frame dulu.** `node render.mjs redsignal.html --stills "0:45,1:80,..."` (adegan:frame, pilih momen paling ramai di tiap adegan, frame < durasi). Gabungkan jadi satu lembar dengan ffmpeg `hstack`, lihat pakai Read. Perbaiki teks yang turun 3 baris, nabrak, kepotong, atau nutup subtitle. Jangan render penuh sebelum semua adegan bersih.
7. **Render penuh.** `node render.mjs redsignal.html nama-video.mp4`. Butuh ±0,4 detik per frame (45 detik video ≈ 9 menit), jadi jalankan di background dan cek log tiap ~5 menit. Lalu ambil beberapa frame dari MP4 untuk cek transisi, dan kirim file ke user.
8. **Audio: backsound + efek suara (selalu dibuat).** Tulis `make_audio.py` dari kode di bawah, lalu buat `audio/plan.json`:
   - `durs`: angka "durasi adegan" yang dicetak render.mjs (atau `TIMING.durs` kalau pakai VO).
   - `enters`: sama dengan `SCENES[i].enter`.
   - `hl`: frame klik kotak sorotan per adegan = `d` judul + 10 (biasanya 14), `null` kalau adegan tanpa judul bersorot.
   - `events`: efek per animasi, pakai frame delay animasinya. `pop` untuk ikon/kartu yang pop-in, `tick` untuk kartu swap atau counter, `success`/`ding` saat centang atau tombol CTA muncul.
   Transisi (whoosh di sapuan, swish di rack, boom di punch, riser + boom di iris) dan musik 120 BPM (intro tipis, jeda + boom saat masuk iris, outro ringan) dibuat otomatis. Jalankan `python3 make_audio.py audio/plan.json`, lalu gabungkan:
   ```
   ffmpeg -i audio/music.wav -i audio/sfx.wav -filter_complex "[0:a]volume=0.55[m];[1:a]volume=0.9[s];[m][s]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map "[a]" -ar 48000 audio/mix.wav
   ffmpeg -i video.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart video-final.mp4
   ```
   Ganti audio tidak perlu render ulang video. Claude tidak bisa mendengar hasilnya: cek level dengan filter `ebur128` (target ±-14 LUFS) dan gambar `showwavespic`, lalu minta user mendengarkan.
9. **VO (opsional).** Sesi tidak bisa download dari server ElevenLabs/MiniMax/dll (koneksi diblokir), jadi VO dibuat lewat connector atau web, lalu user mengupload MP3-nya ke chat.
   - Cari jeda: `ffmpeg -i vo.mp3 -af silencedetect=n=-38dB:d=0.18 -f null -`. Cocokkan tiap `narration` ke rentang waktu di VO. Kalau ragu, bandingkan jumlah suku kata kalimat dengan jumlah puncak energi (pita 300–2500 Hz) di rentang itu. Jeda di tengah kalimat itu normal.
   - Geser VO +0,4 detik. Buat `TIMING = { durs, caps }`: `durs` = frame antar titik potong adegan (potong 0,2 detik sebelum kalimat mulai), `caps` = [mulai, selesai] detik tiap kalimat. Di `window.setup` pakai `TIMING.durs`, dan ganti `captions(sc.narration, f - LEAD, sc.speech, sc.bg)` dengan subtitle global yang mencari kalimat aktif dari `TIMING.caps` berdasarkan `g / FPS`. Kalimat yang terlalu pendek untuk animasinya boleh dapat adegan lebih lama, subtitle tetap ikut VO.
   - Buat plan audio dengan `durs` baru, lalu rakit **bertahap** (satu graph sidechain + amix sekaligus bisa memotong ekor VO). `TOTAL` = durasi video dalam detik:
   ```
   ffmpeg -i vo.mp3 -af "aresample=48000,aformat=channel_layouts=stereo,adelay=400|400,highpass=f=80,acompressor=threshold=-20dB:ratio=3,loudnorm=I=-16:TP=-2" audio/vo48.wav
   ffmpeg -i audio/music.wav -i audio/vo48.wav -filter_complex "[0:a]aformat=channel_layouts=stereo,volume=0.42[m];[1:a]apad=whole_dur=TOTAL[k];[m][k]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=350[d]" -map "[d]" audio/duck.wav
   ffmpeg -i audio/vo48.wav -i audio/duck.wav -i audio/sfx.wav -filter_complex "[0:a]apad=whole_dur=TOTAL[v];[2:a]aformat=channel_layouts=stereo,volume=0.55[s];[v][1:a][s]amix=inputs=3:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map "[a]" -ar 48000 audio/mix.wav
   ```
   Bandingkan `showwavespic` mix dengan VO: ekor VO harus utuh sampai kalimat terakhir.
10. **Laporan akhir singkat:** isi tiap adegan (1 baris), asumsi yang diambil, apa yang perlu user cek (dengarkan audio, timing subtitle), dan apa yang bisa ditambah (foto pembicara, VO).

Lingkungan: butuh Node, Playwright + Chromium, ffmpeg, font "Inter Display" & "Inter". Di sandbox Claude: `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`, Playwright ada di `/opt/npm-tools/node_modules` (render.mjs otomatis mencari di sana). Cek dengan `fc-list | grep -i inter`. Kalau font tidak ada, ganti nama font ke yang tersedia.

## redsignal.html

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  html, body { margin: 0; padding: 0; background: #000; }
  #stage { position: relative; width: 1080px; height: 1920px; overflow: hidden; font-family: 'Inter Display', sans-serif; }
  .abs { position: absolute; }
  .ctr { position: absolute; left: 80px; top: 200px; width: 920px; height: 1040px; }
</style>
</head>
<body>
<div id="stage"></div>
<script>
// ============================================================
// RED SIGNAL — mesin style (lihat dokumen blueprint)
// ============================================================
// ---------- GANTI PER BRAND ----------
const BRAND = { logoOnLight: "assets/logo-light.png", logoOnDark: "assets/logo-dark.png" };
window.ASSETS = [BRAND.logoOnLight, BRAND.logoOnDark];
// --------------------------------------
const FPS = 30, LEAD = 6, TAIL = 14, WPS = 2.6;
const C = { red: "#E11D2E", deep: "#8E0F1C", blush: "#FCE4E4", paper: "#F5EFEA", ink: "#141414", stone: "#8A8480", night: "#140808", white: "#FFFFFF" };

// ---------- helper animasi ----------
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
function lerp(x, [i0, i1], [o0, o1], ease) { let t = clamp((x - i0) / (i1 - i0), 0, 1); if (ease) t = ease(t); return o0 + (o1 - o0) * t; }
const outCubic = (t) => 1 - Math.pow(1 - t, 3), inCubic = (t) => t * t * t, inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const springCache = new Map();
function spring(frame, { damping = 12, stiffness = 120 } = {}) {
  if (frame <= 0) return 0;
  const key = damping + "|" + stiffness; let arr = springCache.get(key);
  if (!arr) { arr = [0]; let x = 0, v = 0; const sub = 20, dt = 1 / FPS / sub;
    for (let f = 1; f < 1500; f++) { for (let s = 0; s < sub; s++) { const a = -stiffness * (x - 1) - damping * v; v += a * dt; x += v * dt; } arr.push(x); }
    springCache.set(key, arr); }
  const f = Math.min(frame, arr.length - 1), lo = Math.floor(f), hi = Math.min(lo + 1, arr.length - 1);
  return arr[lo] + (arr[hi] - arr[lo]) * (f - lo);
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Masuk dari blur → tajam (ciri utama)
function blurIn(f, d = 0, dur = 12) {
  const t = lerp(f - d, [0, dur], [0, 1], outCubic);
  return `opacity:${t};filter:blur(${(1 - t) * 24}px);transform:scale(${1.08 - 0.08 * t})`;
}
function pop(f, d = 0, damping = 12) {
  const s = spring(f - d, { damping, stiffness: 160 });
  return `opacity:${clamp(s * 2, 0, 1)};transform:scale(${s});filter:blur(${Math.max(0, (1 - clamp(s, 0, 1)) * 10)}px)`;
}

// ---------- komponen ----------
// Judul: lines = ["SUDAH PUNYA", "5+ OUTLET?"], hl = index baris yang disorot
function title(lines, hl, f, { size = 124, d = 0, align = "left", color = C.ink, boxColor = C.red, bracket = C.ink } = {}) {
  return `<div style="display:flex;flex-direction:column;align-items:${align === "center" ? "center" : "flex-start"};gap:14px;font-family:'Inter Display';font-weight:900;font-size:${size}px;line-height:1;letter-spacing:-0.03em;text-transform:uppercase">
    ${lines.map((ln, li) => {
      const ld = d + li * 6;
      if (li !== hl) return `<div style="color:${color};${blurIn(f, ld)}">${esc(ln)}</div>`;
      return highlight(ln, f, ld + 4, { boxColor, bracket });
    }).join("")}</div>`;
}
// Kotak sorotan bersiku
function highlight(text, f, d, { boxColor = C.red, bracket = C.ink, textColor = "#fff" } = {}) {
  const bar = lerp(f - d, [0, 8], [0, 1], outCubic);
  const txt = lerp(f - d, [6, 12], [0, 1], outCubic);
  const br = spring(f - d - 9, { damping: 14, stiffness: 220 });
  const corner = (pos) => {
    const [v, h] = pos; const off = -14 - (1 - clamp(br, 0, 1)) * 18;
    return `<div class="abs" style="${v}:${off}px;${h}:${off}px;width:28px;height:28px;border-${v}:6px solid ${bracket};border-${h}:6px solid ${bracket};opacity:${clamp(br * 2, 0, 1)}"></div>`;
  };
  return `<div style="position:relative;display:inline-block;padding:10px 22px 12px">
    <div class="abs" style="inset:0;background:${boxColor};transform-origin:left;transform:scaleX(${bar})"></div>
    <div style="position:relative;color:${textColor};opacity:${txt};filter:blur(${(1 - txt) * 12}px)">${esc(text)}</div>
    ${corner(["top", "left"])}${corner(["top", "right"])}${corner(["bottom", "left"])}${corner(["bottom", "right"])}
  </div>`;
}
const label = (t, f, d = 0, color = C.red, size = 30) =>
  `<div style="font-family:'Inter';font-weight:700;font-size:${size}px;letter-spacing:0.25em;text-transform:uppercase;color:${color};${blurIn(f, d)}">${esc(t)}</div>`;

// Kartu jendela
function windowCard(file, inner, { w = 920, pad = 36, dark = false } = {}) {
  return `<div style="width:${w}px;box-sizing:border-box;border-radius:28px;background:${dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.92)"};border:1px solid ${dark ? "rgba(255,255,255,.12)" : "rgba(20,20,20,.06)"};box-shadow:0 30px 60px rgba(20,8,8,${dark ? 0.4 : 0.12})">
    <div style="display:flex;align-items:center;gap:12px;padding:22px 30px;border-bottom:1px solid ${dark ? "rgba(255,255,255,.08)" : "rgba(20,20,20,.07)"}">
      <div style="width:16px;height:16px;border-radius:50%;background:${C.red}"></div><div style="width:16px;height:16px;border-radius:50%;background:#D6CFC9"></div><div style="width:16px;height:16px;border-radius:50%;background:#D6CFC9"></div>
      <div style="margin-left:14px;font-family:'Inter';font-weight:600;font-size:22px;letter-spacing:0.18em;color:${C.stone}">${esc(file)}</div>
    </div><div style="padding:${pad}px">${inner}</div></div>`;
}

// Ikon SVG (viewBox 200)
function icon(name, size, o = {}) {
  const fg = o.fg || C.red, bg = o.bg || "#fff", ink = o.ink || C.ink;
  let b = "";
  if (name === "store") {
    const scal = [32, 66, 100, 134, 168].map((x, i) => `<circle cx="${x}" cy="86" r="17" fill="${i % 2 ? "#fff" : fg}"/>`).join("");
    b = `<rect x="34" y="80" width="132" height="98" rx="6" fill="#fff" stroke="${ink}" stroke-width="8"/>
      <rect x="84" y="116" width="32" height="62" fill="${ink}"/><rect x="48" y="104" width="26" height="26" rx="3" fill="${C.blush}" stroke="${ink}" stroke-width="5"/><rect x="126" y="104" width="26" height="26" rx="3" fill="${C.blush}" stroke="${ink}" stroke-width="5"/>
      <polygon points="30,42 170,42 185,86 15,86" fill="${fg}"/><polygon points="58,42 86,42 83,86 49,86" fill="#fff"/><polygon points="114,42 142,42 151,86 117,86" fill="#fff"/>${scal}`;
  } else if (name === "person") {
    b = `<circle cx="100" cy="70" r="38" fill="${fg}"/><path d="M28 182 Q28 122 100 122 Q172 122 172 182 Z" fill="${fg}"/>`;
  } else if (name === "check") {
    b = `<circle cx="100" cy="100" r="92" fill="${fg}"/><path d="M58 102 L88 132 L144 72" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else if (name === "cross") {
    b = `<circle cx="100" cy="100" r="92" fill="${ink}"/><path d="M66 66 L134 134 M134 66 L66 134" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round"/>`;
  } else if (name === "pin") {
    b = `<path d="M100 192 C62 134 38 112 38 80 A62 62 0 1 1 162 80 C162 112 138 134 100 192Z" fill="${fg}"/><circle cx="100" cy="80" r="24" fill="#fff"/>`;
  } else if (name === "star4") {
    b = `<path d="M100 10 C108 80 120 92 190 100 C120 108 108 120 100 190 C92 120 80 108 10 100 C80 92 92 80 100 10Z" fill="${fg}"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 200 200" style="overflow:visible;display:block">${b}</svg>`;
}

// ---------- latar ----------
function background(kind, g) {
  const base = kind === "red" ? C.red : kind === "dark" ? C.night : C.paper;
  const orbit = kind === "red" ? "#FFFFFF" : C.red, oOp = kind === "red" ? 0.35 : kind === "dark" ? 0.55 : 0.5;
  const d1 = Math.sin(g / 70) * 80, d2 = Math.cos(g / 90) * 70;
  const blobA = kind === "red" ? C.deep : kind === "dark" ? C.red : C.blush;
  const blobB = kind === "red" ? "#FF5A66" : kind === "dark" ? C.deep : "#CFC6BF";
  const sp = [[905, 430, 26], [150, 1190, 18], [975, 1180, 22], [610, 245, 14]].map(([x, y, s], i) => {
    const k = 0.6 + 0.4 * Math.abs(Math.sin(g / 13 + i * 1.7));
    return `<div class="abs" style="left:${x - s}px;top:${y - s}px;transform:scale(${k}) rotate(${g * 0.6 + i * 20}deg)">${icon("star4", s * 2, { fg: kind === "red" ? "#fff" : C.red })}</div>`;
  }).join("");
  return `<div class="abs" style="inset:0;background:${base}"></div>
    <div class="abs" style="width:900px;height:900px;border-radius:50%;left:${-260 + d1}px;top:${560 + d2}px;background:${blobA};opacity:${kind === "light" ? 0.9 : 0.35};filter:blur(170px)"></div>
    <div class="abs" style="width:760px;height:760px;border-radius:50%;left:${520 - d2}px;top:${1100 + d1}px;background:${blobB};opacity:${kind === "light" ? 0.55 : 0.3};filter:blur(170px)"></div>
    <svg class="abs" style="left:0;top:0" width="1080" height="1920">
      <circle cx="-160" cy="2080" r="1300" fill="none" stroke="${orbit}" stroke-opacity="${oOp}" stroke-width="2.5" stroke-dasharray="1300 260 420 380" transform="rotate(${g * 0.14} -160 2080)"/>
      <circle cx="-160" cy="2080" r="1720" fill="none" stroke="${orbit}" stroke-opacity="${oOp * 0.6}" stroke-width="2" stroke-dasharray="900 500 260 300" transform="rotate(${-g * 0.09} -160 2080)"/>
    </svg>${sp}
    <div class="abs" style="inset:0;box-shadow:inset 0 0 220px rgba(20,8,8,${kind === "light" ? 0.10 : 0.35})"></div>`;
}

// ---------- HUD ----------
function hud(ch, kind, g) {
  const light = kind === "light", col = light ? C.ink : "#fff";
  const blink = Math.floor(g / 15) % 2 ? 0.35 : 1;
  return `<div class="abs" style="left:64px;top:70px;display:flex;align-items:center;gap:14px;padding:12px 22px;border-radius:999px;background:${light ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.08)"};border:1px solid ${light ? "rgba(20,20,20,.08)" : "rgba(255,255,255,.15)"};font-family:'Inter';font-weight:700;font-size:26px;letter-spacing:0.12em;color:${col}">
      <div style="width:14px;height:14px;border-radius:50%;background:${kind === "red" ? "#fff" : C.red};opacity:${blink}"></div>${String(ch).padStart(2, "0")}<span style="opacity:.45">/ ${String(TOTAL).padStart(2, "0")}</span></div>
    <img class="abs" src="${light ? BRAND.logoOnLight : BRAND.logoOnDark}" style="right:64px;top:66px;height:58px"/>`;
}

// ---------- caption ----------
function captions(text, f, speech, kind) {
  const words = text.split(/\s+/).filter(Boolean);
  const wts = words.map((w) => w.length + 2), tot = wts.reduce((a, b) => a + b, 0);
  const st = []; let acc = 0; for (const w of wts) { st.push((acc / tot) * speech); acc += w; }
  if (f < 0 || f > speech + 20) return "";
  let idx = 0; st.forEach((s, i) => { if (f >= s) idx = i; });
  const N = 4, c0 = Math.floor(idx / N) * N;
  const dark = kind !== "light";
  const pillBg = dark ? "rgba(255,255,255,0.95)" : "rgba(20,20,20,0.92)", txt = dark ? C.ink : "#fff";
  const enter = spring(f - st[c0], { damping: 16, stiffness: 260 });
  return `<div class="abs" style="left:60px;right:60px;top:1310px;display:flex;justify-content:center">
    <div style="padding:20px 32px;border-radius:22px;background:${pillBg};font-family:'Inter Display';font-weight:700;font-size:52px;line-height:1.25;text-align:center;max-width:900px;transform:translateY(${(1 - enter) * 18}px);box-shadow:0 14px 40px rgba(0,0,0,.18)">
      ${words.slice(c0, c0 + N).map((w, i) => { const wi = c0 + i, on = wi === idx;
        return `<span style="color:${on ? C.red : txt};opacity:${f >= st[wi] - 2 ? 1 : 0.4}">${esc(w)}</span>`; }).join(" ")}
    </div></div>`;
}

// ============================================================
// ADEGAN — GANTI PER VIDEO (contoh: iklan masterclass F&B, 10 adegan / 6 bab)
// ============================================================
const SCENES = [
  { // 1. HOOK
    ch: 1, bg: "light", enter: "wipe",
    narration: "Khusus untuk pebisnis F&B yang sudah punya lebih dari 5 outlet!",
    render(f) {
      const stores = [0, 1, 2, 3, 4, 5].map((i) => {
        const x = (i % 3) * 300 + 20, y = Math.floor(i / 3) * 270;
        const plus = i === 5 ? `<div class="abs" style="right:-6px;top:-10px;width:86px;height:86px;border-radius:50%;background:${C.ink};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:54px;${pop(f, 52, 9)}">+</div>` : "";
        return `<div class="abs" style="left:${x}px;top:${y}px;width:250px;height:240px;border-radius:28px;background:rgba(255,255,255,.9);box-shadow:0 20px 40px rgba(20,8,8,.10);display:flex;align-items:center;justify-content:center;${pop(f, 20 + i * 5)}">${icon("store", 170)}${plus}</div>`;
      }).join("");
      return `<div class="abs" style="left:0;top:0">${label("Khusus pebisnis F&B", f, 0)}</div>
        <div class="abs" style="left:0;top:64px">${title(["Sudah punya", "5+ outlet?"], 1, f, { d: 4, size: 128 })}</div>
        <div class="abs" style="left:0;top:470px;width:920px;height:540px">${stores}</div>`;
    },
  },
  { // 2. SPEAKER
    ch: 2, bg: "light", enter: "rack",
    narration: "Business Coach-nya pemilik bisnis omset puluhan miliar hingga triliunan dan Co-Founder Sancha Artisan Tea",
    render(f, dur) {
      const bar = lerp(f, [40, 40 + dur * 0.4], [0.08, 1], inOut);
      const inner = `<div style="display:flex;gap:36px;align-items:center">
          <div style="flex:0 0 auto;width:210px;height:210px;border-radius:50%;background:${C.red};display:flex;align-items:flex-end;justify-content:center;overflow:hidden;${pop(f, 14)}">${icon("person", 180, { fg: "#fff" })}</div>
          <div style="display:flex;flex-direction:column;gap:14px">
            ${label("Business coach", f, 18, C.stone, 24)}
            <div style="font-weight:800;font-size:44px;line-height:1.15;color:${C.ink};${blurIn(f, 22)}">Pemilik bisnis beromset<br/>puluhan miliar–triliunan</div>
            <div style="align-self:flex-start;padding:10px 18px;border:3px solid ${C.red};border-radius:12px;font-family:'Inter';font-weight:700;font-size:23px;letter-spacing:0.08em;color:${C.red};${blurIn(f, 30)}">CO-FOUNDER SANCHA ARTISAN TEA</div>
          </div></div>
        <div style="margin-top:40px;${blurIn(f, 36)}">
          <div style="display:flex;justify-content:space-between;font-family:'Inter';font-weight:700;font-size:22px;letter-spacing:0.18em;color:${C.stone};margin-bottom:12px"><span>PULUHAN MILIAR</span><span>TRILIUNAN</span></div>
          <div style="height:26px;border-radius:13px;background:#ECE6E1;overflow:hidden"><div style="height:100%;width:${bar * 100}%;background:${C.red};border-radius:13px"></div></div>
        </div>`;
      return `<div class="abs" style="left:0;top:0">${label("Langsung dari", f, 0)}</div>
        <div class="abs" style="left:0;top:64px">${title(["Praktisi", "bisnis besar"], 1, f, { d: 4, size: 124 })}</div>
        <div class="abs" style="left:0;top:420px;${blurIn(f, 10, 14)}">${windowCard("SPEAKER_PROFILE.PNG", inner)}</div>`;
    },
  },
  { // 3. PUNCH — SuperTEAM
    ch: 2, bg: "red", enter: "flash",
    narration: "akan share langsung rahasia bisnis punya SuperTEAM yang bisa membuat bisnis Anda sukses ekspansi.",
    render(f) {
      const s = lerp(f, [2, 7], [1.4, 1], outCubic), o = lerp(f, [2, 5], [0, 1]);
      const shake = f > 2 && f < 12 ? (f % 2 ? 6 : -6) * (12 - f) / 10 : 0;
      const team = [0, 1, 2, 3, 4].map((i) => {
        const big = i === 2, sz = big ? 170 : 120;
        return `<div style="${pop(f, 16 + Math.abs(i - 2) * 5, 10)}">${icon("person", sz, { fg: "#fff" })}</div>`;
      }).join("");
      return `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;transform:translateX(${shake}px)">
        ${label("Rahasia bisnis", f, 0, "#fff", 32)}
        <div style="font-family:'Inter Display';font-weight:900;font-size:168px;letter-spacing:-0.045em;line-height:1;color:#fff;opacity:${o};transform:scale(${s})">SuperTEAM</div>
        <div style="display:flex;align-items:flex-end;gap:26px;margin-top:20px">${team}</div>
        <div style="font-weight:700;font-size:46px;color:#fff;opacity:.92;${blurIn(f, 30)}">kunci bisnis sukses ekspansi</div>
      </div>`;
    },
  },
  { // 4. MANAGER ANDALAN
    ch: 3, bg: "light", enter: "wipe",
    narration: "Anda akan belajar cara: punya manager yang bisa diandalkan,",
    render(f) {
      const xs = [150, 460, 770], line = lerp(f, [16, 30], [0, 1], outCubic);
      const mgr = xs.map((x, i) => `
        <div class="abs" style="left:${x - 75}px;top:250px;width:150px;text-align:center;${pop(f, 22 + i * 4)}">
          <div style="position:relative;width:150px;height:150px;border-radius:50%;background:#fff;box-shadow:0 14px 30px rgba(20,8,8,.12);display:flex;align-items:flex-end;justify-content:center;overflow:hidden">${icon("person", 120)}</div>
          <div class="abs" style="right:-14px;top:-8px;${pop(f, 38 + i * 6, 9)}">${icon("check", 62)}</div>
          <div style="margin-top:14px;font-family:'Inter';font-weight:700;font-size:22px;letter-spacing:0.18em;color:${C.stone}">MANAGER</div>
        </div>
        <div class="abs" style="left:${x - 105}px;top:470px;display:flex;gap:10px">
          <div style="${pop(f, 52 + i * 4)}">${icon("store", 100)}</div><div style="${pop(f, 56 + i * 4)}">${icon("store", 100)}</div></div>`).join("");
      const lines = `<svg class="abs" style="left:0;top:0;overflow:visible" width="920" height="600">
        <g fill="none" stroke="${C.ink}" stroke-width="5" stroke-opacity=".35" stroke-dasharray="600" stroke-dashoffset="${600 * (1 - line)}">
          <path d="M460 160 V205 H150 V250"/><path d="M460 160 V250"/><path d="M460 205 H770 V250"/></g></svg>`;
      return `<div class="abs" style="left:0;top:0">${label("Anda akan belajar cara", f, 0)}</div>
        <div class="abs" style="left:0;top:64px">${title(["Punya manager", "andalan"], 1, f, { d: 4, size: 100 })}</div>
        <div class="abs" style="left:0;top:380px;width:920px;height:620px">
          ${lines}
          <div class="abs" style="left:385px;top:0;width:150px;text-align:center;${pop(f, 12)}">
            <div style="width:150px;height:150px;border-radius:50%;background:${C.ink};display:flex;align-items:flex-end;justify-content:center;overflow:hidden;margin:0 auto">${icon("person", 120, { fg: "#fff" })}</div>
          </div>
          <div class="abs" style="left:560px;top:52px;font-family:'Inter';font-weight:700;font-size:22px;letter-spacing:0.18em;color:${C.stone};${blurIn(f, 16)}">OWNER</div>
          ${mgr}
        </div>`;
    },
  },
  { // 5. REKRUT ORANG TEPAT — kartu swap
    ch: 3, bg: "light", enter: "rack", minF: 130,
    narration: "merekrut orang yang tepat, bukan sekadar mengisi posisi saja,",
    render(f, dur) {
      const gaps = [9, 8, 7, 6, 5, 4, 3, 3, 2, 2], tStart = 14;
      let k = 0, t = tStart; while (k < gaps.length && f >= t + gaps[k]) { t += gaps[k]; k++; }
      const done = k >= gaps.length, ver = String(Math.min(k + 1, 11)).padStart(2, "0");
      const shake = !done && f > tStart ? (k % 2 ? 3 : -3) : 0;
      const fit = done ? lerp(f - t, [0, 14], [0.2, 1], outCubic) : [0.3, 0.15, 0.4, 0.25, 0.35, 0.2, 0.45, 0.3, 0.38, 0.22].at(k % 10);
      const badge = done ? `<div style="${pop(f - t, 0, 9)}">${icon("check", 96)}</div>` : `<div>${icon("cross", 96)}</div>`;
      const avatarCol = done ? C.red : ["#B9B0A9", "#9E958E", "#C9C0B9"].at(k % 3);
      const inner = `<div style="display:flex;gap:30px;align-items:center">
          <div style="flex:0 0 auto;width:170px;height:170px;border-radius:24px;background:${done ? C.blush : "#EFEAE6"};display:flex;align-items:flex-end;justify-content:center;overflow:hidden">${icon("person", 140, { fg: avatarCol })}</div>
          <div style="flex:1;display:flex;flex-direction:column;gap:16px">
            <div style="font-family:'Inter';font-weight:700;font-size:22px;letter-spacing:0.18em;color:${C.stone}">KANDIDAT</div>
            <div style="font-weight:900;font-size:64px;color:${C.ink};letter-spacing:-0.02em">v${ver}</div>
            <div style="height:14px;width:${done ? 300 : 200 + (k * 37) % 120}px;border-radius:7px;background:#E3DDD8"></div>
            <div style="height:14px;width:${done ? 220 : 140 + (k * 53) % 110}px;border-radius:7px;background:#E3DDD8"></div>
          </div>${badge}</div>
        <div style="margin-top:34px;display:flex;align-items:center;gap:20px">
          <div style="font-family:'Inter';font-weight:700;font-size:22px;letter-spacing:0.18em;color:${C.stone}">COCOK</div>
          <div style="flex:1;height:22px;border-radius:11px;background:#ECE6E1;overflow:hidden"><div style="height:100%;width:${fit * 100}%;background:${done ? C.red : C.stone}"></div></div>
          <div style="font-weight:900;font-size:40px;color:${done ? C.red : C.stone};width:110px;text-align:right">${Math.round(fit * 100)}%</div></div>`;
      const cardPop = done ? 1 + 0.04 * Math.sin(clamp((f - t) / 10, 0, 1) * Math.PI) : 1;
      return `<div class="abs" style="left:0;top:0">${label("Anda akan belajar cara", f, 0)}</div>
        <div class="abs" style="left:0;top:64px">${title(["Rekrut orang", "yang tepat"], 1, f, { d: 4, size: 118 })}</div>
        <div class="abs" style="left:0;top:420px;transform:translateX(${shake}px) scale(${cardPop});${blurIn(f, 8, 14)}">${windowCard(`KANDIDAT_V${ver}.PDF`, inner)}</div>
        <div class="abs" style="left:0;top:860px;font-weight:700;font-size:44px;color:${C.stone};${blurIn(f, 30)}">Bukan sekadar <span style="color:${C.ink};text-decoration:line-through;text-decoration-color:${C.red};text-decoration-thickness:6px">mengisi posisi</span></div>`;
    },
  },
  { // 6. MENANG LAWAN BRAND BESAR
    ch: 4, bg: "light", enter: "rack", minF: 110,
    narration: "menang bersaing dengan brand besar,",
    render(f, dur) {
      const big = lerp(f, [10, 30], [0, 400], outCubic);
      const mine = lerp(f, [26, Math.max(50, dur * 0.65)], [0, 500], inOut);
      const won = mine > 400;
      const bar = (x, h, col, lab, labCol) => `<div class="abs" style="left:${x}px;bottom:80px;width:260px;height:${h}px;border-radius:22px 22px 6px 6px;background:${col}"></div>
        <div class="abs" style="left:${x}px;bottom:20px;width:260px;text-align:center;font-family:'Inter';font-weight:700;font-size:24px;letter-spacing:0.16em;color:${labCol}">${lab}</div>`;
      return `<div class="abs" style="left:0;top:0">${label("Anda akan belajar cara", f, 0)}</div>
        <div class="abs" style="left:0;top:64px">${title(["Menang lawan", "brand besar"], 1, f, { d: 4, size: 100 })}</div>
        <div class="abs" style="left:0;top:400px;width:920px;height:640px;${blurIn(f, 6)}">
          <div class="abs" style="left:40px;right:40px;bottom:80px;height:4px;background:${C.ink};opacity:.2"></div>
          <div class="abs" style="left:40px;right:40px;bottom:${80 + 400}px;border-top:4px dashed ${C.stone};opacity:${big >= 399 ? 0.6 : 0}"></div>
          ${bar(120, big, "#CFC6BF", "BRAND BESAR", C.stone)}
          ${bar(540, mine, C.red, "BISNIS ANDA", C.red)}
          <div class="abs" style="left:${670 - 45}px;bottom:${80 + mine + 20}px;${won ? pop(f, Math.max(50, dur * 0.65) - 18, 8) : "opacity:0"}">${icon("star4", 90)}</div>
        </div>`;
    },
  },
  { // 7. EKSPANSI MASIF
    ch: 4, bg: "light", enter: "rack",
    narration: "ekspansi masif tanpa owner harus turun tangan terus-menerus.",
    render(f, dur) {
      const pts = [[400, 210], [180, 120], [640, 110], [120, 300], [700, 300], [300, 80], [520, 330], [250, 380], [780, 180], [60, 180], [580, 220], [360, 330], [470, 70], [160, 220], [690, 390], [320, 200]];
      const hub = [420, 210];
      const span = Math.max(60, dur * 0.7);
      const pins = pts.map(([x, y], i) => {
        const d = 14 + (i / pts.length) * (span - 14);
        const lo = lerp(f - d, [0, 10], [0, 1]);
        return `<line x1="${hub[0]}" y1="${hub[1]}" x2="${x}" y2="${y + 30}" stroke="${C.red}" stroke-width="3" stroke-opacity="${0.35 * lo}" stroke-dasharray="6 8"/>
          <foreignObject x="${x - 30}" y="${y - 30}" width="60" height="70" style="overflow:visible"><div style="${pop(f, d, 9)}">${icon("pin", 60)}</div></foreignObject>`;
      }).join("");
      const inner = `<div style="position:relative;height:440px;border-radius:18px;background-color:#F7F3F0;background-image:radial-gradient(${C.stone}55 2px, transparent 2px);background-size:34px 34px;overflow:hidden">
          <svg width="848" height="440" style="position:absolute;left:0;top:0;overflow:visible">${pins}
            <foreignObject x="${hub[0] - 45}" y="${hub[1] - 45}" width="90" height="90"><div style="width:90px;height:90px;border-radius:50%;background:${C.ink};display:flex;align-items:flex-end;justify-content:center;overflow:hidden;${pop(f, 8)}">${icon("person", 74, { fg: "#fff" })}</div></foreignObject></svg>
        </div>`;
      return `<div class="abs" style="left:0;top:0">${label("Anda akan belajar cara", f, 0)}</div>
        <div class="abs" style="left:0;top:64px">${title(["Ekspansi", "masif"], 1, f, { d: 4, size: 124 })}</div>
        <div class="abs" style="left:0;top:368px;font-weight:700;font-size:42px;color:${C.stone};${blurIn(f, 14)}">tanpa owner turun tangan terus</div>
        <div class="abs" style="left:0;top:450px;${blurIn(f, 8, 14)}">${windowCard("PETA_OUTLET.MAP", inner, { pad: 36 })}</div>`;
    },
  },
  { // 8. SOCIAL PROOF
    ch: 5, bg: "light", enter: "rack",
    narration: "Hanya di Gratyo Business Owner Masterclass yang sudah diikuti lebih dari 250.000 pemilik bisnis di Indonesia",
    render(f, dur) {
      const p = lerp(f, [10, Math.max(55, dur * 0.55)], [0, 1], (t) => 1 - Math.pow(1 - t, 4));
      const n = Math.round(250000 * p).toLocaleString("id-ID");
      const total = 60, lit = Math.floor(p * total);
      const dots = Array.from({ length: total }, (_, i) => `<div style="width:62px;height:62px;border-radius:50%;background:${i < lit ? C.red : "#E3DDD8"};transform:scale(${i < lit ? 1 : 0.8});display:flex;align-items:flex-end;justify-content:center;overflow:hidden">${i < lit ? icon("person", 52, { fg: "#fff" }) : ""}</div>`).join("");
      return `<div class="abs" style="left:0;top:0">${label("Sudah diikuti lebih dari", f, 0)}</div>
        <div class="abs" style="left:-6px;top:56px;font-family:'Inter Display';font-weight:900;font-size:210px;letter-spacing:-0.05em;line-height:1;color:${C.ink};font-variant-numeric:tabular-nums;${blurIn(f, 4)}">${n}<span style="color:${C.red}">+</span></div>
        <div class="abs" style="left:0;top:290px;font-weight:800;font-size:52px;color:${C.ink};${blurIn(f, 14)}">pemilik bisnis di Indonesia</div>
        <div class="abs" style="left:0;top:400px;width:920px;display:grid;grid-template-columns:repeat(12,62px);gap:14px;justify-content:space-between;${blurIn(f, 10)}">${dots}</div>
        <div class="abs" style="left:0;top:${400 + 5 * 76 + 30}px;${blurIn(f, 26, 14)}">${windowCard("MASTERCLASS.EXE", `<div style="display:flex;align-items:center;gap:30px"><img src="${BRAND.logoOnLight}" style="height:84px"/><div style="font-family:'Inter';font-weight:800;font-size:28px;letter-spacing:0.14em;line-height:1.3;color:${C.ink}">BUSINESS OWNER<br/>MASTERCLASS</div></div>`, { pad: 28 })}</div>`;
    },
  },
  { // 9. PENUTUP GELAP — kesempatan
    ch: 6, bg: "dark", enter: "iris",
    narration: "Kesempatan ini tidak akan datang 2x dalam hidup Anda!",
    render(f) {
      return `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;text-align:center">
        <div style="font-weight:700;font-size:50px;color:#fff;opacity:.85;${blurIn(f, 4)}">Kesempatan ini</div>
        ${title(["Tidak akan", "datang 2x"], 1, f, { d: 10, size: 140, align: "center", color: "#fff", bracket: "#fff" })}
        <div style="font-family:'Inter';font-weight:700;font-size:28px;letter-spacing:0.3em;color:#fff;opacity:.75;${blurIn(f, 30)}">DALAM HIDUP ANDA</div>
      </div>`;
    },
  },
  { // 10. CTA
    ch: 6, bg: "dark", enter: "rack",
    narration: "Daftarkan bisnis Anda sekarang juga!",
    render(f) {
      const bounce = Math.abs(Math.sin(f / 7.6)) * 16;
      return `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:46px;text-align:center">
        ${title(["Daftar", "sekarang"], 1, f, { d: 0, size: 130, align: "center", color: "#fff", bracket: "#fff" })}
        <div style="${blurIn(f, 14, 14)}">${windowCard("MASTERCLASS.EXE", `<div style="display:flex;flex-direction:column;align-items:center;gap:18px"><img src="${BRAND.logoOnDark}" style="height:120px"/><div style="font-family:'Inter';font-weight:700;font-size:24px;letter-spacing:0.3em;color:#fff;opacity:.7">BUSINESS OWNER MASTERCLASS</div></div>`, { w: 760, pad: 40, dark: true })}</div>
        <div style="${pop(f, 26, 11)}"><div style="display:flex;align-items:center;gap:20px;padding:30px 50px;border-radius:999px;background:#fff;font-family:'Inter Display';font-weight:900;font-size:50px;color:${C.ink};box-shadow:0 20px 60px rgba(225,29,46,.35)">
          <div style="width:20px;height:20px;border-radius:50%;background:${C.red}"></div>DAFTARKAN BISNIS ANDA ↓</div></div>
        <div style="font-family:'Inter';font-weight:700;font-size:26px;letter-spacing:0.32em;color:#fff;opacity:.85;${blurIn(f, 34)}">KLIK LINK DI BAWAH</div>
        <div style="margin-top:-20px;transform:translateY(${bounce}px);${blurIn(f, 38)}"><svg width="60" height="60" viewBox="0 0 60 60"><path d="M30 8 V48 M12 32 L30 50 L48 32" fill="none" stroke="${C.red}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      </div>`;
    },
  },
];

// ============================================================
// TRANSISI
// ============================================================
function wipePanel(p) { // p: -1 (kiri, belum masuk) → 0 (menutup) → 1 (keluar kanan)
  const x = p * 2600;
  return `<div class="abs" style="left:-760px;top:-700px;width:2600px;height:3400px;transform:translateX(${x}px) rotate(25deg);transform-origin:center">
    <div class="abs" style="inset:0;background:${C.red}"></div>
    <div class="abs" style="top:0;bottom:0;right:-10px;width:10px;background:#fff"></div>
    <div class="abs" style="top:0;bottom:0;left:-10px;width:10px;background:#fff"></div></div>`;
}

const TOTAL = Math.max(...SCENES.map((s) => s.ch));
window.setup = () => {
  let start = 0;
  for (const sc of SCENES) {
    const words = sc.narration.split(/\s+/).length;
    sc.speech = Math.ceil(Math.max(1.6, words / WPS) * FPS);
    sc.dur = Math.max(sc.minF || 0, LEAD + sc.speech + TAIL, 80);
    sc.start = start; start += sc.dur;
  }
  return SCENES.map((s) => s.dur);
};
window.draw = (i, f) => {
  const sc = SCENES[i], next = SCENES[i + 1], g = sc.start + f, dur = sc.dur;
  // keluar: blur-out 7 frame terakhir
  const outT = lerp(f, [dur - 7, dur], [0, 1], inCubic);
  // masuk: rack-focus untuk seluruh konten
  const inT = lerp(f, [0, 8], [0, 1], outCubic);
  const zoom = lerp(f, [0, dur], [1, 1.03]);
  let overlay = "";
  // masuk
  if (sc.enter === "wipe" && f < 8) overlay += wipePanel(lerp(f, [0, 8], [0, 1], inCubic));
  if (sc.enter === "flash" && f < 3) overlay += `<div class="abs" style="inset:0;background:#fff;opacity:${(3 - f) / 3 * 0.9}"></div>`;
  // keluar → siapkan transisi bab berikutnya
  if (next && next.enter === "wipe" && f >= dur - 8) overlay += wipePanel(lerp(f, [dur - 8, dur], [-1, 0], outCubic));
  if (next && next.enter === "iris" && f >= dur - 14) {
    const r = lerp(f, [dur - 14, dur], [0, 1500], inCubic);
    overlay += `<div class="abs" style="left:${540 - r}px;top:${1500 - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:${C.night}"></div>`;
  }
  document.getElementById("stage").innerHTML =
    background(sc.bg, g) +
    `<div class="abs" style="inset:0;opacity:${Math.min(inT, 1 - outT)};filter:blur(${(1 - inT) * 10 + outT * 18}px)">
       <div class="ctr" style="transform:scale(${zoom});transform-origin:center top">${sc.render(f, dur)}</div>
     </div>` +
    hud(sc.ch, sc.bg, g) +
    captions(sc.narration, f - LEAD, sc.speech, sc.bg) +
    overlay;
};
</script>
</body>
</html>
```

## render.mjs

```js
// node render.mjs redsignal.html --stills "0:45,3:70"   → stills/*.png
// node render.mjs redsignal.html out.mp4                → video
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

## make_audio.py

```python
"""Backsound 120 BPM + efek suara, disintesis dari nol (orisinal, bebas royalti).
Pakai: python3 make_audio.py plan.json   → music.wav + sfx.wav (48 kHz) di folder plan.json
plan.json:
{
  "durs":   [147, 182, ...],                # frame per adegan (dari output render.mjs --stills / TIMING)
  "enters": ["wipe", "rack", "flash", ...], # sama dengan SCENES[i].enter
  "hl":     [14, 14, null, ...],            # frame klik kotak sorotan per adegan (d + 10), null = tidak ada
  "events": [{"scene": 0, "frame": 20, "type": "pop", "gain": 0.45}, ...]
}
type event: pop, tick, click, ding, success, hit, whoosh, swish, riser (riser berakhir di frame-nya).
"""
import json, os, sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

plan = json.load(open(sys.argv[1]))
OUT = os.path.dirname(os.path.abspath(sys.argv[1]))
SR, FPS = 48000, 30
DURS, ENTERS = plan["durs"], plan["enters"]
STARTS = np.concatenate([[0], np.cumsum(DURS)[:-1]])
TOTAL = sum(DURS) / FPS
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(7)
fr = lambda sc, f: (STARTS[sc] + f) / FPS
env = lambda n, tau: np.exp(-np.arange(n) / (tau * SR))
bp = lambda x, lo, hi: sosfilt(butter(2, [lo, hi], btype="band", fs=SR, output="sos"), x)
hp = lambda x, f: sosfilt(butter(2, f, btype="high", fs=SR, output="sos"), x)
lp = lambda x, f: sosfilt(butter(2, f, btype="low", fs=SR, output="sos"), x)


def add(buf, sig, t, g=1.0):
    i = int(t * SR)
    if 0 <= i < len(buf):
        j = min(len(buf), i + len(sig)); buf[i:j] += sig[: j - i] * g


def sweep(f0, f1, dur, curve=3.0):
    k = np.linspace(0, 1, int(dur * SR))
    f = f1 + (f0 - f1) * np.exp(-k * curve * 4) if f0 > f1 else f0 + (f1 - f0) * k ** curve
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


# ---------- instrumen ----------
def kick():
    n = int(0.35 * SR); k = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(45 + 95 * np.exp(-k * 28)) / SR) * env(n, 0.11)
    s[:200] += rng.normal(0, 0.3, 200) * np.linspace(1, 0, 200)
    return np.tanh(s * 1.6)


def clap():
    n = int(0.22 * SR); e = env(n, 0.05)
    for d in (0.0, 0.012, 0.024):
        i = int(d * SR); e[i:] += env(n - i, 0.008) * 0.6
    return bp(rng.normal(0, 1, n), 900, 4000) * e * 0.5


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    return hp(rng.normal(0, 1, n), 7000) * env(n, 0.06 if open_ else 0.012) * 0.25


def bass(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.15 * np.sign(np.sin(2 * np.pi * f * t))
    return lp(s, 600) * np.minimum(1, t / 0.01) * np.minimum(1, (dur - t) / 0.05) * 0.45


def pad(freqs, dur):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for d in (-0.6, 0.6): s += np.sin(2 * np.pi * (f + d) * t) + 0.3 * np.sin(2 * np.pi * (2 * f + d) * t)
    return lp(s / (len(freqs) * 2), 1800) * np.minimum(1, t / 0.4) * np.minimum(1, (dur - t) / 0.4) * 0.18


def pluck(f, dur=0.25):
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(6 * np.pi * f * t)) * env(n, 0.07) * 0.16


# ---------- efek suara ----------
def whoosh(dur=0.45, lo=250, hi=5000):
    n = int(dur * SR); noise = rng.normal(0, 1, n); out = np.zeros(n); y = 0.0
    k = np.linspace(0, 1, n); a = 1 - np.exp(-2 * np.pi * (lo * (hi / lo) ** np.sin(np.pi * k * 0.5)) / SR)
    for i in range(n): y += a[i] * (noise[i] - y); out[i] = y
    return out * np.sin(np.pi * k) ** 1.5 * 0.9


def click():
    n = int(0.06 * SR); s = np.sin(2 * np.pi * 1800 * np.arange(n) / SR) * env(n, 0.008)
    s[:120] += rng.normal(0, 0.6, 120); return s * 0.8


pop = lambda: sweep(900, 320, 0.09) * env(int(0.09 * SR), 0.025) * 0.55
tick = lambda: np.sin(2 * np.pi * 3200 * np.arange(int(0.03 * SR)) / SR) * env(int(0.03 * SR), 0.005) * 0.5


def hit():
    n = int(1.2 * SR); k = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(32 + 70 * np.exp(-k * 9)) / SR) * env(n, 0.35)
    s[:2400] += lp(rng.normal(0, 1, 2400), 3000) * np.linspace(1, 0, 2400) * 0.8
    return np.tanh(s * 2.2) * 0.9


def riser(dur=1.3):
    n = int(dur * SR); k = np.linspace(0, 1, n)
    return (sweep(180, 1400, dur, 2.0) * 0.4 + bp(rng.normal(0, 1, n), 1500, 7000) * 0.5) * k ** 2.5 * 0.8


def ding():
    t = np.arange(int(1.4 * SR)) / SR
    s = np.sin(2 * np.pi * 1318.5 * t) + 0.6 * np.sin(2 * np.pi * 1975.5 * t) + 0.3 * np.sin(2 * np.pi * 2637 * t)
    return s * env(len(t), 0.35) * 0.35


def success():
    s = np.zeros(int(0.8 * SR))
    for i, f in enumerate((987.8, 1318.5)):
        t = np.arange(int(0.6 * SR)) / SR; add(s, np.sin(2 * np.pi * f * t) * env(len(t), 0.18) * 0.35, i * 0.09)
    return s


# ---------- musik ----------
music = np.zeros(N); beat = 0.5; nb = int(TOTAL / beat) + 1
prog = [(110.0, [220.0, 261.6, 329.6]), (87.31, [174.6, 220.0, 261.6]), (130.8, [261.6, 329.6, 392.0]), (98.0, [196.0, 246.9, 293.7])]
iris = [i for i, e in enumerate(ENTERS) if e == "iris"]
iris_t = fr(iris[0], 0) if iris else TOTAL + 99           # jeda + boom saat masuk penutup gelap
cta_t = fr(iris[0] + 1, 0) if iris and iris[0] + 1 < len(DURS) else TOTAL + 99
intro_end = min(2.0, TOTAL / 4)
K, CL, HC, HO = kick(), clap(), hat(), hat(True)
for b in range(nb):
    t = b * beat; brk = iris_t - 1.4 <= t < iris_t; outro = t >= iris_t
    root, chord = prog[(b // 4) % 4]
    if b % 4 == 0: add(music, pad(chord, beat * 4), t, 0.6 if brk else 1.0)
    if brk: continue
    if t >= intro_end and not (outro and t < cta_t):
        add(music, K, t, 0.9)
        if b % 2: add(music, CL, t, 0.7)
    elif t < intro_end and b % 2 == 0: add(music, K, t, 0.5)
    if t >= 1.0:
        for h in range(2): add(music, HO if (h and b % 4 == 3) else HC, t + h * beat / 2, 0.5 if outro else 0.8)
    if t >= intro_end:
        for h, on in enumerate((1, 0, 1, 1)):
            if on: add(music, bass(root, beat / 4 * 0.9), t + h * beat / 4, 0.7 if outro else 1.0)
        if b % 2 == 0: add(music, pluck(chord[(b // 2) % 3] * 2), t + beat / 2)
pump = np.ones(N)
for b in range(nb):
    i, m = int(b * beat * SR), int(0.18 * SR)
    if i + m < N: pump[i:i + m] = np.minimum(pump[i:i + m], 0.55 + 0.45 * np.linspace(0, 1, m) ** 0.7)
music *= pump
fi, end, fo = int(0.3 * SR), int(TOTAL * SR), int(1.2 * SR)
music[:fi] *= np.linspace(0, 1, fi); music[end - fo:end] *= np.linspace(1, 0, fo); music[end:] = 0

# ---------- efek suara: transisi otomatis + event ----------
sfx = np.zeros(N)
W, Ws = whoosh(), whoosh(0.3, 400, 3500)
for i, e in enumerate(ENTERS):
    if e == "wipe": add(sfx, W, max(0, fr(i, 0) - (8 / FPS if i else 0)), 0.9)
    elif e == "rack" and i: add(sfx, Ws, fr(i, 0) - 0.12, 0.35)
    elif e == "flash": add(sfx, hit(), fr(i, 2), 1.0)
    elif e == "iris": add(sfx, riser(1.3), fr(i, 0) - 1.3, 0.9); add(sfx, hit(), fr(i, 0), 0.9)
for i, h in enumerate(plan.get("hl", [])):
    if h is not None: add(sfx, click(), fr(i, h), 0.6)
GEN = {"pop": pop, "tick": tick, "click": click, "ding": ding, "success": success, "hit": hit, "whoosh": whoosh, "swish": lambda: whoosh(0.3, 400, 3500)}
for ev in plan.get("events", []):
    t, g = fr(ev["scene"], ev["frame"]), ev.get("gain", 0.5)
    if ev["type"] == "riser": d = ev.get("dur", 1.3); add(sfx, riser(d), t - d, g)
    else: add(sfx, GEN[ev["type"]](), t, g)

norm = lambda x, p: (x / max(1e-9, np.abs(x).max()) * p).astype(np.float32)
wavfile.write(os.path.join(OUT, "music.wav"), SR, norm(music, 0.8))
wavfile.write(os.path.join(OUT, "sfx.wav"), SR, norm(sfx, 0.9))
print("music.wav + sfx.wav,", round(TOTAL, 2), "detik")
```