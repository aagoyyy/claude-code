import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {MieCore, CamFn} from './MieScene';
import {PART1, DATA, HPP, Pill, fmt, FONT, INK, NAVY, RED, GREEN, CREAM} from './Script1';

/**
 * SCRIPT PART 2 (24 fps), continues Part1 in the SAME world (MieCore runs at f = PART1.total + local).
 *  0-168    beat 5: "Kuncinya perputaran & jam buka" -> sewa kios, listrik+air -> operasional ~Rp 70.000/hari (camera at the stove)
 *  168-336  beat 6: min 15 mangkuk/hari (counter), lalu 80 mangkuk + es teh (camera to the glass)
 *  336-528  beat 7: cuan bersih 5-7 jt/bulan, CTA
 */
export const PART2 = {fps: 24, total: 528} as const;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eio = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const eo = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

/** figures of this part: only what the script states; derived values are checked, not invented */
export const DATA2 = {rent: 1500000, utilities: 500000, opsDaily: 70000, minBowls: 15, peakBowls: 80, profitLow: 5, profitHigh: 7} as const;
const MARGIN_RP = DATA.price - HPP;                                 // 5.000 per mangkuk
if (DATA2.minBowls * MARGIN_RP < DATA2.opsDaily) throw new Error('15 mangkuk tidak menutup operasional harian');

type Stop = {f: number; wx: number; wy: number; z: number; sy?: number};
const STOPS: Stop[] = [
  {f: 0, wx: 600, wy: 1250, z: 1.08, sy: 1060},
  {f: 24, wx: 600, wy: 1250, z: 1.08, sy: 1060},
  {f: 62, wx: 360, wy: 930, z: 1.5, sy: 1200},
  {f: 150, wx: 360, wy: 930, z: 1.5, sy: 1200},
  {f: 190, wx: 600, wy: 1380, z: 1.3, sy: 1150},
  {f: 252, wx: 600, wy: 1380, z: 1.3, sy: 1150},
  {f: 290, wx: 915, wy: 1064, z: 1.7, sy: 1150},
  {f: 336, wx: 915, wy: 1064, z: 1.7, sy: 1150},
  {f: 384, wx: 600, wy: 1250, z: 1.08, sy: 1060},
  {f: 528, wx: 600, wy: 1250, z: 1.0, sy: 1020},
];
const cam: CamFn = (g) => {
  const f = g - PART1.total;
  let i = 0; while (i < STOPS.length - 2 && f >= STOPS[i + 1].f) i++;
  const a = STOPS[i], b = STOPS[i + 1];
  const t = eio(prog(f, a.f, b.f));
  const z = lerp(a.z, b.z, t), sy = lerp(a.sy ?? 960, b.sy ?? 960, t);
  const wx = lerp(a.wx, b.wx, t), wy = lerp(a.wy, b.wy, t);
  return {cx: wx, cy: wy - (sy - 960) / z, z};
};

const Row2: React.FC<{name: string; v: string; unit: string; o: number}> = ({name, v, unit, o}) => (
  <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 24, width: 800, opacity: o, transform: `translateX(${(1 - o) * 140}px)`, background: CREAM, border: `4px solid ${INK}`, borderRadius: 20, padding: '10px 28px', fontFamily: FONT, color: NAVY}}>
    <span style={{fontWeight: 800, fontSize: 44}}>{name}</span>
    <span><span style={{fontWeight: 900, fontSize: 56}}>{v}</span><span style={{fontWeight: 700, fontSize: 32}}> {unit}</span></span>
  </div>
);
const Badge: React.FC<{bg: string; top: string; main: string; sub?: string; o: number; y: number; size?: number}> = ({bg, top, main, sub, o, y, size = 96}) => (
  <div style={{position: 'absolute', left: 540, top: y, transform: `translate(-50%,0) scale(${0.85 + 0.15 * o})`, opacity: o, textAlign: 'center', whiteSpace: 'nowrap'}}>
    <div style={{background: bg, border: `5px solid ${INK}`, borderRadius: 28, padding: '18px 44px', fontFamily: FONT, color: '#fff', boxShadow: '0 8px 0 rgba(46,32,25,0.25)'}}>
      <div style={{fontWeight: 800, fontSize: 42, letterSpacing: 3}}>{top}</div>
      <div style={{fontWeight: 900, fontSize: size, lineHeight: 1.05}}>{main}</div>
      {sub && <div style={{fontWeight: 700, fontSize: 38, opacity: 0.95}}>{sub}</div>}
    </div>
  </div>
);

export const Part2: React.FC = () => {
  const f = useCurrentFrame();
  const fade = (a: number, b: number, c: number, d: number) => prog(f, a, b) * (1 - prog(f, c, d));
  const slide = (a: number) => (1 - prog(f, a, a + 8)) * 24;
  /* beat 5 */
  const r1 = eo(prog(f, 56, 66)), r2 = eo(prog(f, 84, 94)), rowsOut = 1 - prog(f, 120, 130);
  const opsO = eo(prog(f, 128, 140)) * (1 - prog(f, 160, 168));
  /* beat 6 */
  const n = Math.round(DATA2.minBowls * eo(prog(f, 186, 232)));
  const cntO = fade(180, 190, 252, 262);
  const peak = Math.round(DATA2.peakBowls * eo(prog(f, 268, 310)));
  const peakO = fade(262, 272, 326, 336);
  /* beat 7 */
  const cuanO = eo(prog(f, 344, 358)) * (1 - prog(f, 430, 440));
  return (
    <AbsoluteFill>
      <MieCore f={PART1.total + f} cam={cam} tag2={226} />
      {/* beat 5 */}
      <Pill lines={[['Kuncinya ada di'], ['perputaran', '& jam buka']]} y={230} o={fade(4, 12, 50, 58)} dy={slide(4)} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: rowsOut}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: NAVY, background: CREAM, border: `4px solid ${INK}`, borderRadius: 18, padding: '6px 26px', opacity: prog(f, 52, 60)}}>Pengeluaran terbesar</div>
        <Row2 name="Sewa kios" v={`Rp ${fmt(DATA2.rent)}`} unit="/ bulan" o={r1} />
        <Row2 name="Listrik & air" v={`Rp ${fmt(DATA2.utilities)}`} unit="/ bulan" o={r2} />
      </div>
      <Badge bg={RED} top="BIAYA OPERASIONAL" main={`± Rp ${fmt(DATA2.opsDaily)}`} sub="per hari" o={opsO} y={240} />
      {/* beat 6 */}
      <Pill lines={[['Jual minimal'], ['15 mangkuk', 'per hari']]} y={230} o={fade(172, 182, 252, 260)} dy={slide(172)} />
      <div style={{position: 'absolute', left: 540, top: 470, transform: 'translate(-50%,0)', opacity: cntO, fontFamily: FONT, fontWeight: 900, fontSize: 64, color: NAVY, background: CREAM, border: `4px solid ${INK}`, borderRadius: 22, padding: '10px 34px', whiteSpace: 'nowrap'}}>
        {n} / {DATA2.minBowls} mangkuk{n >= DATA2.minBowls && <span style={{color: GREEN}}> ✓ tutup biaya</span>}
      </div>
      <Pill lines={[['Ramai? Tembus'], [`${DATA2.peakBowls} mangkuk`, '+ es teh manis']]} y={230} o={fade(262, 272, 326, 336)} dy={slide(262)} size={58} />
      <div style={{position: 'absolute', left: 540, top: 490, transform: 'translate(-50%,0)', opacity: peakO, fontFamily: FONT, fontWeight: 900, fontSize: 80, color: RED, background: CREAM, border: `4px solid ${INK}`, borderRadius: 22, padding: '6px 40px'}}>{peak}</div>
      {/* beat 7 */}
      <Badge bg={GREEN} top="CUAN BERSIH" main={`Rp ${DATA2.profitLow}–${DATA2.profitHigh} juta`} sub="per bulan" o={cuanO} y={240} size={92} />
      <Pill lines={[['Lebih cuan mana?'], ['Warmindo', 'atau es teh?']]} y={230} o={fade(440, 450, 484, 492)} dy={slide(440)} />
      <Pill lines={[['Komen “mulai”'], ['untuk panduan']]} y={230} o={fade(490, 500, 528, 529)} dy={slide(490)} />
      <Pill lines={[['atau klik link di bio']]} y={470} o={fade(504, 512, 528, 529)} dy={slide(504)} size={52} />
    </AbsoluteFill>
  );
};
