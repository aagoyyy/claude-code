import React from 'react';
import {useCurrentFrame} from 'remotion';
import {materials as m, palette, derived} from '../visual-system/ColorPalette';
import {hash, smoothOpen, Pt} from '../dynamic/math';

const INK = derived.outline;

/** Top-down bowl (world svg group). bloom 0..1 grows noodle strands; ripple 0..1 animates rings. */
export const TopBowl: React.FC<{cx: number; cy: number; R: number; bloom?: number; ripple?: number; jig?: number; sx?: number; sy?: number}> = ({cx, cy, R, bloom = 0, ripple = 0, jig = 0, sx = 1, sy = 1}) => {
  const f = useCurrentFrame();
  const r2 = R * 0.8;
  const strands = Array.from({length: 58}).map((_, i) => {
    const a0 = hash(i) * 6.283, rr = Math.sqrt(hash(i + 9)) * r2 * 0.92;
    const x0 = Math.cos(a0) * rr, y0 = Math.sin(a0) * rr;
    const ang = hash(i + 3) * 6.283, L = (50 + hash(i + 5) * 90) * (0.3 + 0.7 * bloom);
    const ph = hash(i + 33) * 6.28 + f * (0.05 + 0.03 * hash(i)) + jig * Math.sin(f * 0.8 + i);
    const pts: Pt[] = Array.from({length: 11}, (_, k) => {
      const u = k / 10 - 0.5;
      let px = x0 + Math.cos(ang) * u * L + Math.sin(u * 8 + ph) * 8 * bloom;
      let py = y0 + Math.sin(ang) * u * L + Math.cos(u * 7 + ph) * 8 * bloom;
      const d = Math.hypot(px, py); if (d > r2 * 0.96) { px *= (r2 * 0.96) / d; py *= (r2 * 0.96) / d; }
      return [px, py] as Pt;
    });
    return {d: smoothOpen(pts), t: i % 3};
  });
  const tones = [m.noodle.light, m.noodle.base, m.noodle.hi];
  return (
    <g transform={`translate(${cx},${cy}) scale(${sx},${sy})`}>
      <defs>
        <radialGradient id="tb-cer" cx="0.38" cy="0.34" r="0.9"><stop offset="0" stopColor={m.ceramic.hi} /><stop offset="0.6" stopColor={m.ceramic.base} /><stop offset="1" stopColor={m.ceramic.core} /></radialGradient>
        <radialGradient id="tb-broth" cx="0.4" cy="0.35" r="0.85"><stop offset="0" stopColor={m.broth.hi} /><stop offset="0.5" stopColor={m.broth.light} /><stop offset="1" stopColor={m.broth.shade} /></radialGradient>
        <clipPath id="tb-clip"><circle r={r2 * 0.97} /></clipPath>
        <filter id="tb-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <ellipse cx={R * 0.16} cy={R * 0.2} rx={R * 1.04} ry={R * 1.0} fill="rgba(58,30,10,0.4)" filter="url(#tb-soft)" />
      <circle r={R} fill="url(#tb-cer)" stroke={INK} strokeWidth={7} />
      <circle r={R * 0.93} fill="none" stroke={palette.tomato} strokeWidth={R * 0.07} />
      <circle r={R * 0.93 + R * 0.035} fill="none" stroke={INK} strokeWidth={3.5} />
      <circle r={R * 0.93 - R * 0.035} fill="none" stroke={INK} strokeWidth={3.5} />
      <circle r={R * 0.86} fill="none" stroke={m.ceramic.core} strokeWidth={4} opacity={0.6} />
      <circle r={r2} fill="url(#tb-broth)" stroke={INK} strokeWidth={5} />
      <path d={`M${-R * 0.7},${-R * 0.2} A${R * 0.72},${R * 0.72} 0 0 1 ${-R * 0.2},${-R * 0.7}`} fill="none" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" opacity={0.45} />
      {[0.42, 0.6, 0.78].map((k, i) => ripple > 0 ? <circle key={i} r={r2 * k * (0.7 + 0.5 * ripple)} fill="none" stroke="#FFF1CC" strokeWidth={6 * (1 - ripple)} opacity={0.9 * (1 - ripple)} /> : null)}
      {Array.from({length: 18}).map((_, i) => { const a = hash(i) * 6.28, r = Math.sqrt(hash(i + 20)) * r2 * 0.85; const x = Math.cos(a) * r, y = Math.sin(a) * r; const k = i % 3; return k === 0 ? <rect key={i} x={x} y={y} width={9} height={4} transform={`rotate(${hash(i) * 180} ${x} ${y})`} fill={m.chili.base} opacity={0.85 * (1 - bloom * 0.6)} /> : k === 1 ? <circle key={i} cx={x} cy={y} r={3.6} fill={m.leaf.light} opacity={0.9 * (1 - bloom * 0.6)} /> : <circle key={i} cx={x} cy={y} r={5} fill="none" stroke="#FFF3D0" strokeWidth={1.8} opacity={0.7 * (1 - bloom * 0.6)} />; })}
      <g clipPath="url(#tb-clip)">
        {strands.map((s, i) => (
          <g key={i} opacity={Math.min(1, bloom * 2.2)}>
            <path d={s.d} fill="none" stroke={m.noodle.core} strokeWidth={17} strokeLinecap="round" transform="translate(3,4)" opacity={0.7} />
            <path d={s.d} fill="none" stroke={m.noodle.shade} strokeWidth={14} strokeLinecap="round" />
            <path d={s.d} fill="none" stroke={tones[s.t]} strokeWidth={10.5} strokeLinecap="round" />
            <path d={s.d} fill="none" stroke={m.noodle.hi} strokeWidth={3} strokeLinecap="round" opacity={0.85} transform="translate(-1.5,-2.5)" />
          </g>
        ))}
      </g>
    </g>
  );
};

/** Top-down toppings (world svg groups, centred on x,y). `h` = height above the bowl (px) -> scale + shadow. */
const SH: React.FC<{rx: number; ry: number; h: number}> = ({rx, ry, h}) => {
  const k = Math.max(0, Math.min(1, h / 420));
  return <ellipse cx={14 + h * 0.12} cy={16 + h * 0.2} rx={rx * (1 - 0.15 * k)} ry={ry * (1 - 0.15 * k)} fill="rgba(58,30,10,0.45)" opacity={0.55 * (1 - 0.6 * k)} />;
};
export const TopEgg: React.FC<{x: number; y: number; h?: number; rot?: number; s?: number}> = ({x, y, h = 0, rot = 0, s = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s * (1 + 0.3 * Math.min(1, h / 420))})`}>
    <SH rx={74} ry={62} h={h} />
    <path d="M-72,6 C-78,-48 -30,-70 18,-64 C70,-58 84,-14 70,28 C56,64 6,72 -36,60 C-62,52 -70,30 -72,6Z" fill={m.eggWhite.base} stroke={INK} strokeWidth={5.5} />
    <path d="M-60,16 C-56,50 -20,62 20,58 C-12,52 -48,40 -60,16Z" fill={m.eggWhite.shade} opacity={0.7} />
    <circle cx={0} cy={-2} r={32} fill={m.yolk.base} stroke={INK} strokeWidth={4} />
    <path d="M-20,-12 C-18,-28 -4,-34 10,-32" fill="none" stroke={m.yolk.hi} strokeWidth={5} strokeLinecap="round" />
    <circle cx={10} cy={14} r={9} fill={m.yolk.shade} opacity={0.5} />
  </g>
);
export const TopChoy: React.FC<{x: number; y: number; h?: number; rot?: number; s?: number}> = ({x, y, h = 0, rot = 0, s = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s * (1 + 0.3 * Math.min(1, h / 420))})`}>
    <SH rx={90} ry={70} h={h} />
    <path d="M-86,10 C-96,-48 -34,-86 20,-78 C80,-70 104,-16 90,34 C72,82 8,92 -40,74 C-70,62 -82,36 -86,10Z" fill={m.leaf.base} stroke={INK} strokeWidth={5.5} />
    <path d="M-70,16 C-72,-30 -30,-60 14,-58 C-20,-30 -34,10 -22,56 C-50,48 -66,36 -70,16Z" fill={m.leaf.light} stroke={INK} strokeWidth={3.5} />
    <path d="M-20,60 C-4,10 30,-30 72,-52 M-6,54 C20,34 56,26 84,34" fill="none" stroke={m.leaf.core} strokeWidth={3.5} opacity={0.7} strokeLinecap="round" />
    <path d="M30,64 C40,86 66,84 74,66" fill={m.stalk.base} stroke={INK} strokeWidth={4} />
  </g>
);
export const TopChili: React.FC<{x: number; y: number; h?: number; rot?: number; s?: number}> = ({x, y, h = 0, rot = 0, s = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s * (1 + 0.3 * Math.min(1, h / 420))})`}>
    <SH rx={74} ry={22} h={h} />
    <path d="M-64,-8 C-30,-30 36,-22 70,8 C74,20 62,26 50,24 C14,32 -40,20 -62,6 C-70,2 -70,-4 -64,-8Z" fill={m.chili.base} stroke={INK} strokeWidth={5} />
    <path d="M-64,-8 C-80,-16 -82,-32 -74,-38 C-66,-30 -58,-20 -54,-10Z" fill={m.leaf.base} stroke={INK} strokeWidth={4} />
    <path d="M-30,-10 C4,-18 34,-10 52,6" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.4} />
  </g>
);
export const TopBall: React.FC<{x: number; y: number; h?: number; s?: number}> = ({x, y, h = 0, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s * (1 + 0.3 * Math.min(1, h / 420))})`}>
    <SH rx={40} ry={38} h={h} />
    <circle r={38} fill={m.meat.base} stroke={INK} strokeWidth={5} />
    {Array.from({length: 9}).map((_, i) => <circle key={i} cx={(hash(i) - 0.5) * 50} cy={(hash(i + 8) - 0.5) * 50} r={2 + hash(i + 3) * 2.4} fill={m.meat.core} opacity={0.5} />)}
    <path d="M-22,-16 C-14,-28 0,-32 12,-30" fill="none" stroke={m.meat.hi} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
  </g>
);
/** Brick of dry noodles seen from above */
export const TopBrick: React.FC<{x: number; y: number; h?: number; rot?: number; s?: number}> = ({x, y, h = 0, rot = 0, s = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s * (1 + 0.3 * Math.min(1, h / 420))})`}>
    <SH rx={150} ry={100} h={h} />
    <rect x={-146} y={-92} width={292} height={184} rx={34} fill={m.noodle.base} stroke={INK} strokeWidth={6} />
    {Array.from({length: 10}).map((_, i) => { const yy = -74 + i * 17; const pts: Pt[] = Array.from({length: 9}, (_, k) => [-130 + k * 32.5, yy + Math.sin(k * 1.6 + i) * 4] as Pt); return <g key={i}><path d={smoothOpen(pts)} fill="none" stroke={m.noodle.core} strokeWidth={9} strokeLinecap="round" transform="translate(0,2)" opacity={0.8} /><path d={smoothOpen(pts)} fill="none" stroke={i % 2 ? m.noodle.light : m.noodle.hi} strokeWidth={6.5} strokeLinecap="round" /></g>; })}
  </g>
);
