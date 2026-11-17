import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Bg, Headline, Eyebrow} from './Layout';
import {PacketFlat, BowlFlat, SteamFlat, PriceTagFlat} from './Flat';
import {DATA, fmtRp, fmtRange} from './data';

/** Script beat 1-2 (5 s @ 24fps): "Mie instan di warung harganya cuma Rp3.000, tapi dimasak di warmindo bisa laku Rp10.000-15.000 semangkuk." */
export const OPEN = {fps: 24, total: 120} as const;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
const eo = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const ei = (t: number) => clamp(t) * clamp(t);
const eio = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const eob = (t: number) => { t = clamp(t) - 1; return 1 + 2.1 * t * t * t + 1.1 * t * t; }; // label pop: one small overshoot
const At: React.FC<{x: number; y: number; sc?: number; sx?: number; sy?: number; o?: number; rot?: number; children: React.ReactNode}> = ({x, y, sc = 1, sx = 1, sy = 1, o = 1, rot = 0, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc * sx},${sc * sy})`, transformOrigin: '50% 100%', opacity: o}}>{children}</div>
);

export const OpenV6: React.FC = () => {
  const f = useCurrentFrame();
  /* beat 1: packet + Rp 3.000 */
  const h1 = prog(f, 4, 12) * (1 - prog(f, 52, 58));
  const pkDrop = eo(prog(f, 2, 16));
  const pkSq = f >= 16 ? 1 - 0.045 * Math.exp(-(f - 16) / 3) : 1;
  const pkExit = ei(prog(f, 50, 60));
  const tag1In = eo(prog(f, 14, 28));
  const tag1Out = ei(prog(f, 50, 58));
  /* beat 2: bowl + Rp 10.000-15.000 */
  const bowlIn = eo(prog(f, 56, 70));
  const bowlSq = f >= 70 ? 1 + 0.035 * Math.exp(-(f - 70) / 4) * Math.cos((f - 70) * 0.8) : 1;
  const steam = prog(f, 72, 84);
  const h2 = prog(f, 62, 72);
  const tag2 = eob(prog(f, 74, 88));
  const push = eio(prog(f, 90, 120));
  return (
    <AbsoluteFill>
      <Bg surface={1240}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + 0.035 * push})`, transformOrigin: '50% 55%'}}>
          <Eyebrow text="BEDAH BISNIS MIE" opacity={prog(f, 2, 10)} />
          <Headline lines={['Mie instan di warung', 'cuma ' + fmtRp(DATA.packet)]} accent={['Rp', '3.000']} y={270} size={78} opacity={h1} dy={(1 - prog(f, 4, 12)) * 24} />
          <Headline lines={['Dimasak di warmindo', 'laku ' + fmtRange(DATA.rangeLow, DATA.rangeHigh)]} accent={['Rp', '10.000–15.000']} y={270} size={74} opacity={h2} dy={(1 - h2) * 24} />
          <At x={540 - pkExit * 900} y={940 - (1 - pkDrop) * 520} sy={pkSq} o={f < 62 ? 1 : 0}><PacketFlat size={780} /></At>
          <At x={380 - tag1Out * 900} y={1510 - (1 - tag1In) * 0} rot={-4} o={f < 60 ? tag1In : 0}><div style={{transform: `translateX(${(1 - tag1In) * -700}px)`}}><PriceTagFlat text={fmtRp(DATA.packet)} width={640} /></div></At>
          {f >= 56 && <At x={540} y={1010} sc={0.92 + 0.08 * bowlIn} sx={bowlSq} sy={2 - bowlSq} o={bowlIn}><BowlFlat size={780} bloom={1} toppings={3} /></At>}
          {steam > 0 && <At x={540} y={700} o={0.9 * steam}><SteamFlat size={380} k={1} t={f} /></At>}
          {tag2 > 0 && <At x={540} y={1530} rot={-3} sc={0.55 + 0.45 * Math.min(1.08, tag2)} o={Math.min(1, tag2 * 2)}><PriceTagFlat text={fmtRange(DATA.rangeLow, DATA.rangeHigh)} width={780} fs={33} /></At>}
        </div>
      </Bg>
    </AbsoluteFill>
  );
};
