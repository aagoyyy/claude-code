import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {MieCore, CamFn, SCENE} from './MieScene';

/**
 * SCRIPT PART 1 (24 fps). Uses the locked key visual as the opening (0-120 identical to the master), then the camera travels inside the SAME world:
 *  0-120    KV master: pot boils, lid lifts, bowl rises, toppings, tag "Rp 10.000 - 15.000"
 *  120-216  hook: push in on the bowl: "Kenapa warung mie nggak pernah sepi?" / "Kita bedah bisnisnya"
 *  216-288  tag swaps to Rp 12.000 (first tag lifts away, second drops + swings)
 *  288-456  cost breakdown: camera visits noodles -> egg -> sawi/chili -> stove; one row appears per item
 *  456-528  total HPP Rp 7.000 + margin > 40%
 */
export const PART1 = {fps: 24, total: 528} as const;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eio = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const eo = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** single source of truth for every figure in this part */
export const DATA = {packet: 3000, low: 10000, high: 15000, price: 12000, items: [
  {name: 'Sebungkus mie', v: 3500}, {name: 'Sebutir telur', v: 2000}, {name: 'Sayur & bumbu racik', v: 500}, {name: 'Gas & bumbu kuah', v: 1000},
] as const} as const;
export const HPP = DATA.items.reduce((a, b) => a + b.v, 0);
export const MARGIN = Math.round(((DATA.price - HPP) / DATA.price) * 100);
if (HPP !== 7000 || MARGIN < 40) throw new Error('script data inconsistent');

export const FONT = "'Inter Display','Inter','Helvetica Neue',Arial,sans-serif";
export const INK = '#2E2019', NAVY = '#1F2A37', RED = '#D54F48', GREEN = '#4E8A5A', CREAM = '#FFFBF0';

/* ---------------- camera: every stop is a world point placed at a chosen screen height ---------------- */
type Stop = {f: number; wx: number; wy: number; z: number; sy?: number};
const STOPS: Stop[] = [
  {f: 120, wx: 556, wy: 1040, z: 1.05},
  {f: 150, wx: 600, wy: 1380, z: 1.3, sy: 1150},
  {f: 216, wx: 620, wy: 1450, z: 1.45, sy: 1180},
  {f: 250, wx: 640, wy: 1400, z: 1.2, sy: 1100},
  {f: 288, wx: 640, wy: 1400, z: 1.2, sy: 1100},
  {f: 316, wx: 640, wy: 1540, z: 1.6, sy: 1200},
  {f: 346, wx: 466, wy: 1450, z: 2.1, sy: 1200},
  {f: 384, wx: 790, wy: 1430, z: 2.0, sy: 1200},
  {f: 424, wx: 360, wy: 930, z: 1.5, sy: 1200},
  {f: 456, wx: 360, wy: 930, z: 1.5, sy: 1200},
  {f: 500, wx: 600, wy: 1250, z: 1.05, sy: 1060},
  {f: 528, wx: 600, wy: 1250, z: 1.08, sy: 1060},
];
const cam: CamFn = (f) => {
  let i = 0; while (i < STOPS.length - 2 && f >= STOPS[i + 1].f) i++;
  const a = STOPS[i], b = STOPS[i + 1];
  const t = eio(prog(f, a.f, b.f));
  const z = lerp(a.z, b.z, t);
  const sa = a.sy ?? 960, sb = b.sy ?? 960;
  const sy = lerp(sa, sb, t);
  const wx = lerp(a.wx, b.wx, t), wy = lerp(a.wy, b.wy, t);
  return {cx: wx, cy: wy - (sy - 960) / z, z};
};

/* ---------------- typography (screen space, paper pill so it reads on wood/wall) ---------------- */
export const Pill: React.FC<{lines: [string, string?][]; y: number; o?: number; dy?: number; size?: number}> = ({lines, y, o = 1, dy = 0, size = 64}) => (
  <div style={{position: 'absolute', left: 540, top: y, transform: `translate(-50%,0) translateY(${dy}px)`, opacity: o, background: CREAM, border: `4px solid ${INK}`, borderRadius: 26, padding: '16px 36px', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.08, color: NAVY, whiteSpace: 'nowrap', boxShadow: '0 8px 0 rgba(46,32,25,0.22)'}}>
    {lines.map(([t, hi], i) => <div key={i}>{t}{hi && <span style={{color: RED}}> {hi}</span>}</div>)}
  </div>
);
const Row: React.FC<{name: string; v: number; o: number; dx: number}> = ({name, v, o, dx}) => (
  <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 24, width: 760, opacity: o, transform: `translateX(${dx}px)`, background: CREAM, border: `4px solid ${INK}`, borderRadius: 20, padding: '10px 28px', fontFamily: FONT, color: NAVY}}>
    <span style={{fontWeight: 800, fontSize: 44}}>{name}</span>
    <span style={{fontWeight: 900, fontSize: 58}}>Rp {fmt(v)}</span>
  </div>
);

export const Part1: React.FC = () => {
  const f = useCurrentFrame();
  const fade = (a: number, b: number, c: number, d: number) => prog(f, a, b) * (1 - prog(f, c, d));
  const slide = (a: number) => (1 - prog(f, a, a + 8)) * 24;
  /* cost rows */
  const rowStart = [296, 330, 364, 398];
  const rowsO = rowStart.map((s) => eo(prog(f, s, s + 10)));
  const rowsOut = 1 - prog(f, 452, 462);
  const totalO = eo(prog(f, 462, 474));
  const sum = DATA.items.reduce((acc, it, i) => acc + it.v * eo(prog(f, rowStart[i], rowStart[i] + 14)), 0);
  const marginO = eo(prog(f, 488, 500));
  return (
    <AbsoluteFill>
      <MieCore f={f} cam={cam} tag2={226} />
      {/* beat 1-2 */}
      <Pill lines={[['Mie instan di warung'], ['cuma', 'Rp 3.000']]} y={230} o={fade(4, 12, 52, 60)} dy={slide(4)} />
      <Pill lines={[['Dimasak di warmindo'], ['laku', 'Rp 10.000–15.000']]} y={230} o={fade(74, 84, 150, 158)} dy={slide(74)} size={60} />
      {/* hook */}
      <Pill lines={[['Kenapa warung mie'], ['nggak pernah sepi pembeli?']]} y={230} o={fade(160, 170, 184, 190)} dy={slide(160)} />
      <Pill lines={[['Kita bedah bisnisnya']]} y={230} o={fade(194, 204, 212, 220)} dy={slide(194)} />
      {/* beat 3 */}
      <Pill lines={[['Satu porsi komplit dijual'], ['Rp 12.000']]} y={230} o={fade(226, 236, 282, 290)} dy={slide(226)} />
      {/* beat 4: rows stack at the top, camera works below */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: rowsOut}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: NAVY, background: CREAM, border: `4px solid ${INK}`, borderRadius: 18, padding: '6px 26px', opacity: prog(f, 288, 296)}}>Modal aslinya</div>
        {DATA.items.map((it, i) => <Row key={it.name} name={it.name} v={it.v} o={rowsO[i]} dx={(1 - rowsO[i]) * 140} />)}
      </div>
      {/* total */}
      <div style={{position: 'absolute', left: 540, top: 250, transform: `translate(-50%,0) scale(${0.85 + 0.15 * totalO})`, opacity: totalO, textAlign: 'center'}}>
        <div style={{background: RED, border: `5px solid ${INK}`, borderRadius: 28, padding: '18px 44px', fontFamily: FONT, color: '#fff', boxShadow: '0 8px 0 rgba(46,32,25,0.25)'}}>
          <div style={{fontWeight: 800, fontSize: 44, letterSpacing: 3}}>TOTAL HPP</div>
          <div style={{fontWeight: 900, fontSize: 104, lineHeight: 1}}>Rp {fmt(sum)}</div>
        </div>
        <div style={{marginTop: 18, opacity: marginO, background: GREEN, color: '#fff', border: `5px solid ${INK}`, borderRadius: 22, padding: '10px 34px', fontFamily: FONT, fontWeight: 900, fontSize: 56, display: 'inline-block', whiteSpace: 'nowrap'}}>Margin kotor &gt; {Math.floor(MARGIN / 10) * 10}%</div>
      </div>
    </AbsoluteFill>
  );
};
