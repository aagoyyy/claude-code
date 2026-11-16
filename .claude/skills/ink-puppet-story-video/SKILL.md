---
name: "ink-puppet-story-video"
description: "Bikin video short 9:16 gaya boneka tinta 2D (kepala bulat, outline tebal, suasana malam, kartu hitam, ending polaroid) dari script cerita, lengkap musik, SFX dan VO."
---

# Ink Puppet Story (9:16)

Skill ini bikin video cerita animasi 2D vertikal untuk Reels/TikTok. Ciri-cirinya:
- karakter boneka orisinal berkepala bulat dengan satu outline tinta tebal
- pencahayaan malam dan kamera yang selalu bergerak
- label tulisan tangan yang muncul memantul
- kartu hitam untuk kalimat tajam
- infografis yang menyatu di dunia cerita
- ending polaroid

Gaya visualnya diadaptasi dari skill "Claude 2D Animation Long Form" by aivxer (16:9, skia-python). Di sini ditulis ulang untuk 9:16 dengan engine HTML/SVG + Playwright + ffmpeg, jadi jalan tanpa install paket baru. Credit gaya: aivxer.

Contoh yang sudah terbukti: "Papa & Waktu" (Gratyo), 63,6 detik, 15 shot, November 2026.

## Kapan dipakai
User minta video cerita atau drama pendek, kisah haru, cerita bisnis, "gaya boneka tinta", "gaya aivxer", atau menyebut nama skill ini.

## Aturan keras
- **Karakter selalu desain orisinal.** Tiru gayanya saja, jangan karakter, logo, atau frame dari channel mana pun.
- **Orang nyata** digambar sebagai boneka generik + name tag, bukan dibuat mirip wajahnya.
- **Jangan gambar** maskot brand atau karakter berhak cipta.
- **Cek still** dari momen tersibuk sebelum render penuh. Targetnya satu render penuh per permintaan.
- **Claude tidak bisa mendengar.** Minta user tonton sekali untuk cek timing dan keras-pelan SFX.
- **Lisensi VO:** paket gratis ElevenLabs tidak punya lisensi komersial. Untuk konten brand, sarankan paket berbayar.

## Alur kerja
1. **Bedah script.**
   - Hook harus langsung menohok. Jangan "pernah nggak sih" yang nanya soal orang lain.
   - Ada satu twist visual yang bisa digambar, misalnya papa digambar kecil di pojok.
   - Cukup satu ending, jangan dua.
   - Jembatan ke brand boleh ditaruh di akhir (opsional).
   - Patokan ±150 kata per menit. Durasi ideal 45–65 detik.
2. **Shot list.** Satu visual per kalimat. Jenis shot yang dipakai:
   - set lebar dengan karakter kecil
   - close-up: kepala besar (s≈2.45) di atas set yang diblur
   - top-down prop: kertas atau dokumen
   - kartu hitam dengan teks yang muncul per kata
   - jalan malam
   - kalender atau jam untuk menunjukkan waktu berlalu
   - ending polaroid
   - kartu brand dengan stempel
3. **Bertahap:** 1 frame dulu, lalu 5 detik, baru full (kalau user minta bertahap).
4. **VO.**
   - Pakai connector ElevenLabs: panggil `creative_create_flow` dulu, lalu `creative_generate_speech` (eleven_v4) untuk tiap peran dengan flow_id yang sama.
   - Suara yang cocok (cek ulang dengan `creative_list_voices`):
     - narator cerita haru: Ricky "Soft & Authentic" (2VMRgGhWXuHXWN2xNHM8)
     - papa: Deden Cahya (3rL9ZxRgBgIkh4tcbrEH)
     - anak: Lunetta (uQyqjJGSy9EJK7ZcWe4B)
     - iklan energik: Tio (5U7QzveIXT8fIoBXaoUC)
   - Kalau muncul "free generations busy", jangan coba lagi di giliran yang sama.
   - File ElevenLabs tidak bisa diunduh ke sandbox. Minta user download MP3-nya lalu upload ke chat.
   - Kalau VO belum ada, render dulu pakai durasi perkiraan (±2,4 kata per detik + jeda), lalu sesuaikan nanti.
5. **Timeline.** Format: `TL=[[nama,detik],...]`. Kalau VO sudah ada, durasi shot = panjang kalimat terukur + 0,3 detik di awal + jeda 0,26 detik. Kartu tanpa suara cukup 1,5 detik.
6. **Cek still.** Ambil 1 still per shot di momen tersibuk, susun jadi contact sheet (`tile`), lalu perbaiki framing atau teks yang terpotong.
7. **Render** per shot dengan 2 proses paralel (indeks genap dan ganjil), lalu gabungkan dengan concat `-c copy`. Kecepatan sekitar 0,5 detik per frame per proses, jadi video 60 detik makan 8–10 menit.
8. **Audio.** Musik dan SFX disintesis dengan numpy, di-mix, di-`loudnorm`, lalu di-mux dengan `-c:v copy`. Kalau ada VO, musik di-duck 60% mengikuti envelope suara.
9. **Verifikasi.** Bikin contact sheet frame tiap 2,5 detik dari file akhir.

## Style bible
- **Tinta:** satu outline #18161B setebal ±6 px di semua benda. Isi warna flat, bayangan keras (salinan bentuk yang digeser, di dalam clip).
- **Karakter:**
  - kepala bulat R=100 tanpa leher, badan kapsul selebar kepala
  - kaki berupa garis tanpa telapak, lengan garis melengkung dengan tangan bulat
  - mata: dot, half (bosan/sibuk), wide (kaget), closed (tidur), happy
  - mulut: smile, flat, o, mid, grin, sad, sleep
  - anak: badan lebih pendek, piyama bintang, rambut acak-acakan, pipi merona (blush)
- **Gerak:**
  - pose berganti dengan efek "snap" yang sedikit melewati target (`back()`)
  - squash saat ganti pose, bob saat diam
  - kedip tiap ±2,3 detik
  - mulut berganti bentuk tiap ±3 frame saat bicara
  - walk cycle dengan kaki menyilang
- **Kamera:**
  - setiap shot zoom-in 5–10% (dengan ease)
  - boleh pan ke titik fokus (`cx,cy`)
  - rotasi kecil di shot top-down
  - whip (blur horizontal) di 4–6 frame awal atau akhir shot
  - layar goyang saat stempel jatuh
- **Malam:** urutan lapisannya:
  1. gambar set dalam keadaan terang
  2. timpa dengan `multiply` biru #3E4C8E, pakai mask berlubang untuk lampu, jendela, dan pintu
  3. tambah glow `screen` hangat atau dingin
  4. tambah grain overlay
  5. terakhir vignette
- **Teks:**
  - Label: warna lime #B8F04A atau cream #FFF6DC, Inter Display 900, miring -9°, stroke tinta tebal, muncul dengan `pop()`.
  - Kartu hitam: kata muncul sesuai porsi jumlah hurufnya, kata kunci diberi warna lime.
  - Lower-third: kotak gelap dengan bar emas #F2C14E.
  - Tulisan anak: pakai filter `crayonBig` (feTurbulence + displacement).
- **Prop di dunia cerita:** gambar krayon, kalender sobek dengan coretan merah, jam dinding, HP dengan badge merah, stempel merah #C8242C, dan lingkaran spidol merah yang "digambar" pelan-pelan (pakai stroke-dasharray).
- **Ending:**
  - Polaroid: flash putih, frame membeku jadi polaroid miring -4° dalam bingkai cream, muncul lingkaran merah, lalu kalimat penutup.
  - Kartu brand: stempel muncul dari skala 2.6 ke 1 dalam 0,2 detik, layar goyang + suara thud, lalu logo putih fade-in.
- **Suara:**
  - musik: piano arpeggio Am–F–C–G 70 bpm; music box untuk momen anak
  - di kartu hitam: musik hening + boom 36 Hz
  - SFX:
    - tick jam (dipercepat saat time-lapse)
    - pop di label, thud di stempel, whoosh di whip
    - kertas berdesir, langkah kaki, coretan spidol
    - shutter + bel di polaroid
    - room tone

## Kode: kit karakter (`kit.js`)
```js
const W=1080,H=1920, INK="#18161B";
let defs=[], uid=0; const id=p=>p+(uid++);

// ---------- puppet character (aivxer-style: round head, pill body, stick legs)
function puppet(o){
  const s=o.s, kid=!!o.kid, L=o.light??-1, sp=o.spec;
  const BT=kid?-232:-345, BB=kid?-92:-128, R=100, BW=kid?76:84, HC=BT-74;
  const lw=6.4/s, face=o.face||0;
  let g=`<g transform="translate(${o.x},${o.y}) rotate(${o.rot||0}) scale(${s})" stroke-linecap="round" stroke-linejoin="round">`;
  // legs
  const legs=o.legs||[[-24,0],[24,0]];
  for(const [lx,fx] of legs) g+=`<line x1="${lx}" y1="${BB-8}" x2="${lx+fx}" y2="0" stroke="${INK}" stroke-width="${lw}"/>`;
  g+=`<g transform="translate(0,${-(o.bob||0)}) scale(${1+(o.squash||0)*.6},${1-(o.squash||0)})">`;
  // body
  const bid=id('b'); const body=`<rect x="${-BW}" y="${BT}" width="${2*BW}" height="${BB-BT}" rx="66" ry="72"/>`;
  defs.push(`<clipPath id="${bid}">${body}</clipPath>`);
  g+=`<g clip-path="url(#${bid})"><rect x="-200" y="-600" width="400" height="700" fill="${sp.suit_d}"/>`;
  g+=`<rect x="${-BW+L*16}" y="${BT-5}" width="${2*BW}" height="${BB-BT}" rx="66" ry="72" fill="${sp.suit}"/>`;
  if(!kid){
    g+=`<polygon points="-34,${BT-4} 0,${BT+96} 34,${BT-4}" fill="${sp.shirt}"/>`;
    // loosened tie, slightly askew
    g+=`<polygon points="-4,${BT+30} 14,${BT+28} 22,${BT+86} 8,${BT+102} -6,${BT+86}" fill="${sp.tie}" stroke="${INK}" stroke-width="${lw*.75}" transform="rotate(8 6 ${BT+60})"/>`;
    for(const sx of [-1,1]) g+=`<path d="M${sx*36},${BT-2} L${sx*2},${BT+98} L${sx*2},${BB}" fill="none" stroke="${INK}" stroke-width="${lw*.75}"/>`;
  } else {
    // pyjama: collar, buttons, little stars
    g+=`<path d="M-30,${BT+2} Q0,${BT+40} 30,${BT+2}" fill="${sp.collar}" stroke="${INK}" stroke-width="${lw*.7}"/>`;
    for(let i=0;i<3;i++) g+=`<circle cx="0" cy="${BT+52+i*28}" r="5" fill="${INK}"/>`;
    for(const [sx,sy] of [[-40,BT+70],[42,BT+100],[-30,BT+122],[36,BT+50]]) g+=star(sx,sy,9,sp.dots);
  }
  g+=`</g>${body.replace('/>',` fill="none" stroke="${INK}" stroke-width="${lw}"/>`)}`;
  // arms
  const SH=[-56*(kid?.9:1), BT+54];
  for(const [i,a] of (o.arms||[]).entries()){
    const m=i===0?1:-1, sx=SH[0]*m, sy=SH[1], [ex,ey,hx,hy,show]=a, Ex=ex*m, Hx=hx*m;
    const cx=1.35*Ex-.175*(sx+Hx), cy=1.35*ey-.175*(sy+hy);
    g+=`<path d="M${sx},${sy} Q${cx},${cy} ${Hx},${hy}" fill="none" stroke="${INK}" stroke-width="${lw}"/>`;
    if(show!==false) g+=`<circle cx="${Hx}" cy="${hy}" r="13" fill="${sp.skin}" stroke="${INK}" stroke-width="${lw*.8}"/>`;
  }
  if(o.carry) g+=o.carry(lw);
  // head
  const hid=id('h');
  defs.push(`<clipPath id="${hid}"><circle r="${R}"/></clipPath>`);
  g+=`<g transform="translate(0,${HC}) rotate(${o.tilt||0})">`;
  g+=`<circle r="${R}" fill="${sp.skin}"/>`;
  g+=`<g clip-path="url(#${hid})"><rect x="-120" y="-120" width="240" height="240" fill="${sp.skin_d}"/><circle cx="${L*7}" cy="-17" r="${R}" fill="${sp.skin}"/>`;
  if(o.rim) g+=`<path d="M${-R},${-R} h${2*R} v${2*R} h${-2*R}z M${-L*11+R},4 a${R},${R} 0 1,0 ${-2*R},0 a${R},${R} 0 1,0 ${2*R},0z" fill="${o.rim}" fill-rule="evenodd" opacity=".85"/>`;
  g+=`</g>`;
  // hair
  if(sp.hair==='slick'){
    const fs=face*14;
    g+=`<path d="M${-R-4},-4 A${R+4},${R+4} 0 0 1 ${R+4},-4 C${R-6},-40 ${56+fs},-70 ${4+fs},-62 C${-36+fs},-58 -78,-44 ${-R-4},-4Z" fill="${sp.hair_col}" stroke="${INK}" stroke-width="${lw}"/>`;
  } else if(sp.hair==='messy'){
    g+=`<path d="M${-R-4},-2 A${R+4},${R+4} 0 0 1 ${R+4},-2 L${R-8},-30 L${R-24},-22 L${R-34},-48 L50,-36 L36,-60 L14,-44 L-6,-66 L-22,-44 L-44,-58 L-56,-34 L-80,-40 L-84,-18 Z" fill="${sp.hair_col}" stroke="${INK}" stroke-width="${lw}"/>`;
    g+=`<path d="M-6,${-R-2} q-6,-34 22,-40 q-14,16 -4,38" fill="${sp.hair_col}" stroke="${INK}" stroke-width="${lw*.85}"/>`;
  }
  g+=`<circle r="${R}" fill="none" stroke="${INK}" stroke-width="${lw}"/>`;
  // eyes + brows
  const fx=face*40, ey=-6;
  for(const e0 of [-30,30]){
    const ex=e0+fx, far=(face>0&&e0>0)||(face<0&&e0<0), sq=far?1-.3*Math.abs(face):1;
    if(o.eyes==='happy') g+=`<path d="M${ex-12*sq},${ey+4} Q${ex},${ey-11} ${ex+12*sq},${ey+4}" fill="none" stroke="${INK}" stroke-width="${lw*.8}"/>`;
    else if(o.eyes==='half'){ g+=`<ellipse cx="${ex}" cy="${ey+4}" rx="${6*sq}" ry="6" fill="${INK}"/><line x1="${ex-13*sq}" y1="${ey-2}" x2="${ex+13*sq}" y2="${ey-2}" stroke="${INK}" stroke-width="${lw*.8}"/>`; }
    else if(o.eyes==='closed') g+=`<path d="M${ex-12*sq},${ey} Q${ex},${ey+10} ${ex+12*sq},${ey}" fill="none" stroke="${INK}" stroke-width="${lw*.8}"/>`;
    else if(o.eyes==='wide'){ g+=`<ellipse cx="${ex}" cy="${ey}" rx="${17*sq}" ry="17" fill="#FBFBF7" stroke="${INK}" stroke-width="${lw*.7}"/><circle cx="${ex+(o.pupil||0)*6}" cy="${ey+2}" r="5.8" fill="${INK}"/>`; }
    else g+=`<ellipse cx="${ex}" cy="${ey}" rx="${5.5*sq}" ry="8" fill="${INK}"/><circle cx="${ex+1.5}" cy="${ey-3}" r="1.8" fill="#fff" opacity=".85"/>`;
    const inner=e0<0?1:-1, by=ey-29-(o.brow||0)*9, bt=(o.browTilt||0)*7;
    g+=`<line x1="${ex-13*sq}" y1="${by+(inner<0?bt:-bt)}" x2="${ex+13*sq}" y2="${by+(inner>0?bt:-bt)}" stroke="${INK}" stroke-width="${lw*.78}"/>`;
  }
  if(o.blush) for(const e0 of [-44,44]) g+=`<ellipse cx="${e0+fx}" cy="18" rx="15" ry="8" fill="#E8838A" opacity=".55"/>`;
  const mx=face*34, my=42;
  if(o.mouth==='smile') g+=`<path d="M${mx-15},${my-2} Q${mx},${my+11} ${mx+15},${my-2}" fill="none" stroke="${INK}" stroke-width="${lw*.8}"/>`;
  else if(o.mouth==='flat') g+=`<line x1="${mx-12}" y1="${my+2}" x2="${mx+12}" y2="${my+2}" stroke="${INK}" stroke-width="${lw*.8}"/>`;
  else if(o.mouth==='o') g+=`<ellipse cx="${mx}" cy="${my+1}" rx="8" ry="10" fill="#5A1A1E" stroke="${INK}" stroke-width="${lw*.7}"/>`;
  else if(o.mouth==='mid') g+=`<ellipse cx="${mx}" cy="${my+2}" rx="12" ry="8" fill="#5A1A1E" stroke="${INK}" stroke-width="${lw*.7}"/>`;
  else if(o.mouth==='grin') g+=`<path d="M${mx-20},${my-4} L${mx+20},${my-4} C${mx+19},${my+22} ${mx-19},${my+22} ${mx-20},${my-4}Z" fill="#5A1A1E" stroke="${INK}" stroke-width="${lw*.7}"/><path d="M${mx-18},${my-3} L${mx+18},${my-3} L${mx+16},${my+4} L${mx-16},${my+4}Z" fill="#FAFAF4"/>`;
  else if(o.mouth==='sad') g+=`<path d="M${mx-14},${my+8} Q${mx},${my-4} ${mx+14},${my+8}" fill="none" stroke="${INK}" stroke-width="${lw*.8}"/>`;
  else if(o.mouth==='sleep') g+=`<ellipse cx="${mx}" cy="${my}" rx="6" ry="5" fill="#5A1A1E" stroke="${INK}" stroke-width="${lw*.6}"/>`;
  g+=`</g></g></g>`;
  return g;
}
function star(x,y,r,fill){let p='';for(let i=0;i<10;i++){const rr=i%2?r*.45:r,a=-Math.PI/2+i*Math.PI/5;p+=(i?'L':'M')+(x+rr*Math.cos(a)).toFixed(1)+','+(y+rr*Math.sin(a)).toFixed(1);}return `<path d="${p}Z" fill="${fill}"/>`;}
// cast: invent new looks per video (hair, suit colour, accessories)
const PAPA={skin:'#E2B888',skin_d:'#C4996B',suit:'#3A4258',suit_d:'#283044',shirt:'#EDE6D6',tie:'#A8232B',hair:'slick',hair_col:'#1E1C24'};
const KID ={skin:'#EEC9A0',skin_d:'#D3A97E',suit:'#8FB6DA',suit_d:'#6F95BB',collar:'#F3E9D2',dots:'#FFE38A',hair:'messy',hair_col:'#2A2128'};
function briefcase(lw){
  return `<g transform="translate(108,-150)"><rect x="-44" y="0" width="88" height="66" rx="8" fill="#5A3A26" stroke="${INK}" stroke-width="${lw}"/><path d="M-14,0 v-12 h28 v12" fill="none" stroke="${INK}" stroke-width="${lw*.8}"/><line x1="-44" y1="24" x2="44" y2="24" stroke="${INK}" stroke-width="${lw*.6}"/></g>`;
}
const ease=u=>{u=Math.min(Math.max(u,0),1);return .5-.5*Math.cos(Math.PI*u)};
const easeOut=u=>{u=Math.min(Math.max(u,0),1);return 1-(1-u)**3};
const back=(u,k=1.9)=>{u=Math.min(Math.max(u,0),1)-1;return 1+(k+1)*u**3+k*u**2};
const K=(t,t0,d)=>Math.min(Math.max((t-t0)/d,0),1);
const pop=u=>u<=0?0:u>=1?1:(u<.6?1.15*easeOut(u/.6):1.15-.15*ease((u-.6)/.4));
const walk_legs=ph=>{const a=Math.sin(ph);return [[-10,a*46],[10,-a*46]];};
```

Catatan pemakaian `puppet()`: `x,y` = posisi kaki; `s=1` → kepala radius 100 px (wide shot s≈1–1.4, close-up s≈2.45 dengan kaki di y≈2160). `arms` = 2 entri `[elbowX,elbowY,handX,handY,showHand]` dalam koordinat lokal sisi kiri (lengan kanan otomatis dicerminkan, jadi tangan kanan di +x ditulis dengan handX negatif). `face` -1..1 = putar 3/4. `light` -1 = cahaya dari kiri. `carry(lw)` untuk prop di tangan (tas, HP). `rot` untuk karakter berbaring.

## Kode: frame, label, teks, timeline (`shots.js`)
Set pieces (ruang tamu, kantor, jalan, kalender, gambar krayon, polaroid) ditulis per video sebagai fungsi yang mengembalikan string SVG. Contoh lengkapnya ada di proyek "Papa & Waktu". Pola tiap shot (`room()`, `sofa()` dan set lain adalah fungsi set piece buatan sendiri):
```js
const lerp=(a,b,k)=>a+(b-a)*k;
const LIME='#B8F04A', CREAM='#FFF6DC', GOLD='#F2C14E', RED='#C8242C';

// timeline: [name, seconds]. Re-time these to the VO later; pictures follow.
const TL=[['open',3.0],['card1',3.2] /* ... one entry per shot, re-time to VO */];

function baseDefs(){
  defs.push(`<radialGradient id="hole"><stop offset="0" stop-color="#000"/><stop offset=".5" stop-color="#000" stop-opacity=".75"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>`);
  defs.push(`<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="38"/></filter>`);
  defs.push(`<radialGradient id="warm"><stop offset="0" stop-color="#FFD48A" stop-opacity=".9"/><stop offset=".45" stop-color="#FFB85A" stop-opacity=".35"/><stop offset="1" stop-color="#FFB85A" stop-opacity="0"/></radialGradient>`);
  defs.push(`<radialGradient id="cool"><stop offset="0" stop-color="#BFE3FF" stop-opacity=".85"/><stop offset=".5" stop-color="#7FB8FF" stop-opacity=".3"/><stop offset="1" stop-color="#7FB8FF" stop-opacity="0"/></radialGradient>`);
  defs.push(`<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .4  0 0 0 .55 0"/></filter>`);
  defs.push(`<filter id="crayon" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.5"/></filter>`);
  defs.push(`<filter id="crayonBig" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter>`);
  defs.push(`<filter id="bgblur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="13"/></filter>`);
  defs.push(`<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".45" stop-color="#02030C" stop-opacity="0"/><stop offset="1" stop-color="#02030C" stop-opacity=".72"/></radialGradient>`);
}
// one finished frame: camera move, night pass, glows, whip blur, grain, vignette, overlay text
function frame(t,dur,o){
  const e=ease(t/dur), z=lerp(o.z0??1,o.z1??1.07,e), fx=o.fx??540, fy=o.fy??960, rot=lerp(o.r0||0,o.r1||0,e);
  const [sx,sy]=o.shake?o.shake(t):[0,0];
  const cx=lerp(fx,o.cx??fx,e), cy=lerp(fy,o.cy??fy,e);
  let inner=`<g transform="translate(${cx+sx},${cy+sy}) rotate(${rot}) scale(${z}) translate(${-fx},${-fy})">${o.scene}`;
  if(o.holes!==undefined){
    defs.push(`<mask id="nm" maskUnits="userSpaceOnUse" x="-400" y="-400" width="${W+800}" height="${H+800}"><rect x="-400" y="-400" width="${W+800}" height="${H+800}" fill="#fff"/><g fill="#000">${o.holes}</g></mask>`);
    inner+=`<rect x="-400" y="-400" width="${W+800}" height="${H+800}" fill="${o.ambient||'#3E4C8E'}" mask="url(#nm)" style="mix-blend-mode:multiply"/>`;
  }
  if(o.glow) inner+=`<g style="mix-blend-mode:screen">${o.glow}</g>`;
  if(o.after) inner+=o.after;
  inner+=`</g>`;
  // whip transitions: horizontal smear on first/last frames
  const f=Math.round(t*30), n=Math.round(dur*30); let sig=0, wx=0;
  if(o.whipOut && n-f<=5){ const k=6-(n-f); sig=k*16; wx=-k*k*34; }
  if(o.whipIn && f<4){ const k=4-f; sig=k*18; wx=k*k*52; }
  if(sig){ defs.push(`<filter id="whip" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="${sig} 0.01"/></filter>`); inner=`<g filter="url(#whip)" transform="translate(${wx},0)">${inner}</g>`; }
  let svg=(o.card?`<rect width="${W}" height="${H}" fill="#050507"/>`:'')+inner;
  svg+=`<rect width="${W}" height="${H}" filter="url(#grain)" opacity="${o.card?.10:.16}" style="mix-blend-mode:overlay"/>`;
  if(!o.card) svg+=`<rect width="${W}" height="${H}" fill="url(#vig)"/>`;
  if(o.over) svg+=o.over;
  if(o.fadeIn) svg+=`<rect width="${W}" height="${H}" fill="#000" opacity="${(1-K(t,0,o.fadeIn)).toFixed(3)}"/>`;
  if(o.fadeOut) svg+=`<rect width="${W}" height="${H}" fill="#000" opacity="${K(t,dur-o.fadeOut,o.fadeOut).toFixed(3)}"/>`;
  return svg;
}
// hand-lettered pop label (lime/cream with thick ink stroke)
function popLabel(txt,x,y,size,t,t0,o={}){
  const p=pop(K(t,t0,.3)); if(p<=0) return '';
  const col=o.col||LIME, rot=o.rot??-5;
  return `<g transform="translate(${x},${y}) rotate(${rot+4*(1-Math.min(p,1))}) scale(${p}) skewX(-9)" text-anchor="${o.anchor||'middle'}">
   <text font-family="Inter Display" font-weight="900" font-size="${size}" fill="none" stroke="${INK}" stroke-width="${size*.15}" stroke-linejoin="round">${txt}</text>
   <text font-family="Inter Display" font-weight="900" font-size="${size}" fill="${col}">${txt}</text></g>`;
}
// words revealed one by one in proportion to characters, across [t0, t0+d]
function typed(lines,t,t0,d,o={}){
  const all=lines.join(' '), tot=all.length; let acc=0, out='';
  const size=o.size||92, lh=size*1.22, y0=(o.y??960)-(lines.length-1)*lh/2;
  lines.forEach((ln,li)=>{
    let tsp='';
    ln.split(' ').forEach((w,wi)=>{
      const st=t0+d*acc/tot; acc+=w.length+1;
      const a=K(t,st,.14), hl=(o.hl||[]).includes(w.replace(/[.,:!?]/g,''));
      tsp+=`<tspan fill="${hl?(o.hlCol||LIME):(o.col||'#FFFFFF')}" opacity="${a.toFixed(3)}">${w}${wi<ln.split(' ').length-1?' ':''}</tspan>`;
    });
    out+=`<text x="${o.x??540}" y="${y0+li*lh}" text-anchor="middle" font-family="Inter Display" font-weight="${o.weight||900}" font-size="${size}" ${o.filter?`filter="url(#${o.filter})"`:''} transform="skewX(${o.skew??-7}) translate(${-(y0+li*lh)*Math.tan((o.skew??-7)*Math.PI/180)},0)">${tsp}</text>`;
  });
  return out;
}
function lowerThird(t,t0,title,sub){
  const lt=back(K(t,t0,.45)); if(t<t0) return '';
  return `<g transform="translate(${60-560*(1-lt)},1760)"><rect x="0" y="0" width="460" height="96" fill="#1E1C24" stroke="${INK}" stroke-width="6"/><rect x="0" y="0" width="16" height="96" fill="${GOLD}"/>
     <text x="40" y="44" font-family="Inter Display" font-weight="900" font-size="38" fill="${CREAM}">${title}</text>
     <text x="40" y="78" font-family="Inter" font-weight="600" font-size="24" fill="${GOLD}">${sub}</text></g>`;
}
function sweatDrop(x,y,s=1){ return `<path d="M${x},${y-19*s} C${x+12*s},${y-3*s} ${x+11*s},${y+10*s} ${x},${y+10*s} C${x-11*s},${y+10*s} ${x-12*s},${y-3*s} ${x},${y-19*s}Z" fill="#8FC8EE" stroke="${INK}" stroke-width="5"/>`; }
const SHOTS={
  home(t,d){ let scene=room()+sofa()+puppet({x:930,y:1262,s:1.32,spec:PAPA,eyes:'wide',mouth:'o'});
    return frame(t,d,{scene,z0:1,z1:1.08,fx:640,fy:1060,
      holes:`<circle cx="120" cy="820" r="560" fill="url(#hole)" opacity=".9"/>`,   // lubang cahaya lampu
      glow:`<circle cx="90" cy="800" r="260" fill="url(#warm)"/>`,
      over:popLabel('21.47',540,190,150,t,.4)+lowerThird(t,.9,'RUMAH','pulang lebih cepat')}); },
  card1(t,d){ return frame(t,d,{card:true,scene:'',over:typed(['Kecuali satu hal:','waktu buat anaknya.'],t,.25,2.2,{hl:['waktu']})}); }
};
// ---------- entry
window.render=(name,t)=>{
  defs=[]; uid=0; baseDefs();
  const d=TL.find(x=>x[0]===name)[1];
  const body=SHOTS[name](t,d);
  document.getElementById('root').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs.join('')}</defs>${body}</svg>`;
};
window.TL=TL;
```
Untuk `full.html`, isinya `<div id="root"></div><script src="kit.js"></script><script src="shots.js"></script>` dengan CSS `body{margin:0;background:#000}`.

Trik yang sudah terbukti:
- **Close-up:** gambar set di dalam `<g filter="url(#bgblur)" transform="translate(-300,-420) scale(1.6)">`, karakter s≈2.45 dengan kaki di y 2160.
- **Polaroid:** panggil `frame()` sekali di waktu flash untuk frame beku, taruh dalam clip + bingkai cream, lalu skala 1 ke 0,68 dan miring 0 ke -4°.
- **Lingkaran spidol:** pakai stroke-dasharray = panjang keliling, dan stroke-dashoffset turun dari panjang ke 0.
- **Langit pagi ke malam:** campur dua warna gradient dengan k 0 ke 1, dan opacity lubang mask ikut k.
- **Time-lapse jam:** jarum jam dan label jam dihitung dari k.

## Kode: recorder (`rec.mjs`)
- Still: `node rec.mjs stills open:2 busy:2 ...`
- Render shot: `node rec.mjs render 0 2 4 ...`. Jalankan dua proses, satu untuk indeks genap dan satu untuk ganjil.
- Di sandbox: `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`, Playwright ada di `/opt/npm-tools/node_modules`. Di Mac lokal, ganti import ke `playwright` biasa.
```js
import { chromium } from '/opt/npm-tools/node_modules/playwright/index.mjs';
import { spawn } from 'child_process'; import fs from 'fs';
const mode=process.argv[2]; // "stills name:t name:t ..." or "render i0 i1 ..." (shot indices)
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/full.html'); await p.waitForTimeout(300);
const TL=await p.evaluate(()=>window.TL);
fs.mkdirSync('shots',{recursive:true}); fs.mkdirSync('stills',{recursive:true});
if(mode==='stills'){
  for(const a of process.argv.slice(3)){ const [n,t]=a.split(':'); await p.evaluate(([n,t])=>render(n,t),[n,+t]); await p.screenshot({path:`stills/${n}-${t}.png`}); }
} else {
  for(const i of process.argv.slice(3).map(Number)){
    const [name,dur]=TL[i]; const N=Math.round(dur*30), out=`shots/${String(i).padStart(2,'0')}-${name}.mp4`;
    const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-crf','18','-preset','veryfast','-pix_fmt','yuv420p','-r','30',out+'.tmp.mp4']);
    for(let f=0;f<N;f++){ await p.evaluate(([n,t])=>render(n,t),[name,f/30]); const buf=await p.screenshot({type:'jpeg',quality:92}); if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r)); }
    ff.stdin.end(); const code=await new Promise(r=>ff.on('close',r)); if(code===0) fs.renameSync(out+'.tmp.mp4',out); console.log('done',out);
  }
}
if(errs.length) console.log('ERRORS',errs.slice(0,5));
await b.close();
```
Gabung shot: `ls shots/*.mp4 | sed "s/^/file '/;s/$/'/" > list.txt && ffmpeg -f concat -safe 0 -i list.txt -c copy video.mp4`.

## Kode: audio (`audio.py`, numpy + scipy, tanpa soundfile)
Simpan TL ke `tl.json`, hitung waktu mulai tiap shot (`S[nama]`), lalu taruh musik dan SFX relatif terhadap shot.
```python
import json, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
TL = json.load(open('tl.json'))
starts = {}; acc = 0.0
for n, d in TL: starts[n] = acc; acc += d
TOTAL = acc; S = starts
N = int(SR * TOTAL)
rng = np.random.default_rng(7)
mus = np.zeros((N, 2)); sfx = np.zeros((N, 2))

def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def add(buf, sig, t0, g=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N: return
    n = min(len(sig), N - i)
    buf[i:i+n, 0] += sig[:n] * g * (1 - pan); buf[i:i+n, 1] += sig[:n] * g * (1 + pan)
note = lambda m: 440 * 2 ** ((m - 69) / 12)
def piano(m, dur=2.5, v=.15):
    f = note(m); n = int(dur * SR); x = np.arange(n) / SR
    s = sum((.55 ** h) * np.sin(2 * np.pi * f * (h + 1) * x * (1 + .0004 * h)) * np.exp(-x * (1.0 + h * .9)) for h in range(5))
    a = int(.005 * SR); s[:a] *= np.linspace(0, 1, a); return s * v
def musicbox(m, v=.08):
    f = note(m); n = int(1.8 * SR); x = np.arange(n) / SR
    return (np.sin(2*np.pi*f*x) + .3*np.sin(2*np.pi*f*4.2*x)*np.exp(-x*8)) * np.exp(-x*2.2) * v
def noise(n): return rng.standard_normal(n)

# ---------------- music
BEAT = 60 / 70
CH = {'Am': [45, 57, 60, 64, 69], 'F': [41, 53, 57, 60, 65], 'C': [48, 55, 60, 64, 67], 'G': [43, 55, 59, 62, 67], 'Dm': [50, 57, 62, 65, 69], 'E': [40, 56, 59, 64, 68]}
def arp(chord, t0, bars=1, v=.12, pat=(0, 2, 3, 4, 3, 2, 1, 2)):
    ns = CH[chord]
    add(mus, piano(ns[0], 4, v * 1.4), t0, 1, -.1)
    for b in range(bars):
        for k, idx in enumerate(pat):
            add(mus, piano(ns[idx], 2.2, v), t0 + b * 4 * BEAT + k * BEAT / 2, 1, .15 if k % 2 else -.05)
def section(t0, t1, prog, v=.12, pat=(0, 2, 3, 4, 3, 2, 1, 2)):
    t = t0; i = 0
    while t < t1 - .2:
        arp(prog[i % len(prog)], t, 1, v, pat); t += 4 * BEAT; i += 1
# gain automation: silence under black cards. Call duck() after all music is added, then mus *= g[:,None];
# add music-box notes for the card AFTER that multiply so they stay audible.
g = np.ones(N); tt = np.arange(N) / SR
def duck(a, b, lvl, ramp=.25):
    k = np.clip(np.minimum((tt - a) / ramp, (b - tt) / ramp), 0, 1)
    np.multiply(g, 1 - (1 - lvl) * k, out=g)

# ---------------- sfx
def boom(t0, v=.4):
    n = int(1.8 * SR); x = np.arange(n) / SR; add(sfx, np.sin(2 * np.pi * (36 + 10 * np.exp(-x * 6)) * x) * np.exp(-x * 2.4) * v, t0)
def whoosh(t0, v=.22, dur=.35):
    n = int(dur * SR); w = bp(noise(n), 500, 5000) * np.sin(np.pi * np.arange(n) / n) ** 2 * v; add(sfx, w, t0 - dur * .6, 1, -.3)
def popfx(t0, v=.3):
    n = int(.12 * SR); x = np.arange(n) / SR; f = 900 * np.exp(-x * 22) + 220
    add(sfx, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 30) * v, t0)
def tick(t0, v=.4, hi=3000):
    n = int(.04 * SR); add(sfx, bp(noise(n), hi, 9000) * np.exp(-np.arange(n) / SR / .008) * v, t0, 1, -.3)
def thud(t0, v=.5):
    n = int(.5 * SR); x = np.arange(n) / SR
    add(sfx, np.sin(2 * np.pi * 70 * x) * np.exp(-x * 14) * v + bp(noise(n), 800, 5000) * np.exp(-x * 40) * v * .5, t0)
def rustle(t0, v=.18, dur=.35):
    n = int(dur * SR); add(sfx, bp(noise(n), 1500, 7000) * (np.abs(noise(n)) > 1.2) * np.sin(np.pi * np.arange(n) / n) * v, t0, 1, .2)
def step(t0, v=.22):
    n = int(.09 * SR); x = np.arange(n) / SR; add(sfx, (bp(noise(n), 120, 900) * 1.0 + np.sin(2 * np.pi * 90 * x)) * np.exp(-x * 45) * v, t0, 1, .1)
def scribble(t0, dur, v=.12):
    n = int(dur * SR); x = np.arange(n) / SR
    am = .5 + .5 * np.sin(2 * np.pi * 7 * x) ** 2
    add(sfx, bp(noise(n), 2000, 8000) * am * np.sin(np.pi * x / dur) * v, t0, 1, .25)
def shutter(t0, v=.4):
    for dt in (0, .07):
        n = int(.05 * SR); add(sfx, bp(noise(n), 1500, 9000) * np.exp(-np.arange(n) / SR / .01) * v, t0 + dt)
def bell(t0, m=83, v=.08): add(sfx, piano(m, 2, v), t0, 1, .2)
def roomtone(a, b, v=.010):
    n = int((b - a) * SR); add(sfx, bp(noise(n), 80, 900) * v, a)

# ---------------- contoh pemakaian
# section(S['office'], S['drawing'], ['Am','F','C','G'], .11)
# duck(S['card1']-.05, S['office'], 0.0, .12); mus *= g[:, None]
# boom(S['card1']); whoosh(S['office']); popfx(S['busy']+.15); thud(S['busy']+.25)
# mix = np.tanh((mus*.9 + sfx)*1.2)/1.2  -> wavfile.write('mix.wav', SR, (mix*32767).astype(np.int16))
```
Urutan mix:
1. soft clip dengan `tanh`
2. `wavfile.write` int16
3. `ffmpeg -af loudnorm=I=-15:TP=-1.5:LRA=9`
4. mux dengan `-map 0:v -map 1:a -c:v copy -c:a aac`

## Menyambung VO setelah render tanpa VO
1. Ukur durasi tiap MP3 atau kalimat pakai `ffprobe`. Untuk memecah satu take narator per kalimat, pakai `silencedetect -35dB d=0.3`.
2. Ubah durasi di `TL`, lalu render ulang hanya shot yang durasinya berubah.
3. Taruh tiap kalimat di awal shot + 0,3 detik. Musik di-duck 60% mengikuti envelope VO. Chain VO: highpass 80 Hz, kompresor ringan, loudnorm.

## Penyerahan
Kirim MP4 dengan caption satu kalimat. Sampaikan:
- durasi video
- isi tiap shot secara singkat
- apa yang belum ada (VO atau lisensi)
- minta user menonton sekali untuk cek timing