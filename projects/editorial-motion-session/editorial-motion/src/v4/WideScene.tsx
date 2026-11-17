import React from 'react';
import {AbsoluteFill} from 'remotion';
import {palette, derived, materials as m} from '../visual-system/ColorPalette';
import {hash} from '../dynamic/math';

const INK = derived.outline;

/** WIDE EXTERIOR — sky, far skyline, street with curb and cobbles. Ground line y=1340. Warung + props are placed by the caller. */
export const StreetEnv: React.FC<{t?: number}> = ({t = 0}) => (
  <AbsoluteFill>
    <svg width={1080} height={1920} viewBox="-160 -100 1400 2120" style={{position: 'absolute', left: -160, top: -100, width: 1400, height: 2120}}>
      <defs>
        <linearGradient id="st4-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CBE3EE" /><stop offset="0.55" stopColor="#F3E9CD" /><stop offset="1" stopColor="#F6DDB0" /></linearGradient>
        <linearGradient id="st4-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B7A488" /><stop offset="1" stopColor="#8A7860" /></linearGradient>
      </defs>
      <rect x="-160" y="-100" width="1400" height="1450" fill="url(#st4-sky)" />
      <circle cx="860" cy="330" r="82" fill="#FFF0BF" opacity={0.9} />
      <circle cx="860" cy="330" r="130" fill="#FFF0BF" opacity={0.25} />
      {[[120, 380, 150], [520, 330, 190], [980, 410, 120]].map(([x, y, w], i) => <ellipse key={i} cx={x + Math.sin(t * 0.02 + i) * 14} cy={y} rx={w} ry={w * 0.22} fill="#FFFDF6" stroke="#E5D9BD" strokeWidth={3} opacity={0.9} />)}
      {/* skyline */}
      {Array.from({length: 11}).map((_, i) => { const w = 90 + hash(i) * 70, h = 160 + hash(i + 4) * 220; const x = -140 + i * 125; return <g key={i}><rect x={x} y={1340 - h} width={w} height={h} fill="#C9B79A" stroke={INK} strokeWidth={4} opacity={0.75} />{Array.from({length: 3}).map((_, r) => <rect key={r} x={x + 14} y={1340 - h + 24 + r * 52} width={w - 28} height={26} fill="#E9DDBF" stroke="#A8957A" strokeWidth={2.5} />)}</g>; })}
      {/* ground */}
      <rect x="-160" y="1340" width="1400" height="720" fill="url(#st4-road)" />
      <rect x="-160" y="1340" width="1400" height="46" fill="#D9C7A4" stroke={INK} strokeWidth={6} />
      {Array.from({length: 16}).map((_, i) => <line key={i} x1={-160 + i * 96} y1={1386} x2={-160 + i * 96} y2={1340} stroke="#A8957A" strokeWidth={4} />)}
      {Array.from({length: 40}).map((_, i) => <ellipse key={i} cx={-140 + hash(i) * 1360} cy={1420 + hash(i + 7) * 480} rx={22 + hash(i + 3) * 26} ry={9 + hash(i + 5) * 8} fill="none" stroke="#7A6A52" strokeWidth={3} opacity={0.4} />)}
      <rect x="-160" y="1340" width="1400" height="720" fill={m.wood.core} opacity={0.06} />
    </svg>
  </AbsoluteFill>
);

/** little round table with a cloth, used as the vendor's counter */
export const RoundTable: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 360}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <ellipse cx={x} cy={y + 70} rx={w * 0.55} ry={16} fill="rgba(58,30,10,0.3)" />
    <path d={`M${x - w / 2},${y} L${x + w / 2},${y} L${x + w * 0.4},${y + 70} L${x - w * 0.4},${y + 70}Z`} fill={palette.tomato} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {[-0.3, -0.1, 0.1, 0.3].map((k, i) => <path key={i} d={`M${x + w * k},${y} L${x + w * k * 0.9},${y + 70}`} stroke="#FFFDF8" strokeWidth={14} opacity={0.35} />)}
    <rect x={x - w / 2 - 10} y={y - 22} width={w + 20} height={26} rx={10} fill={m.wood.light} stroke={INK} strokeWidth={6} />
    <rect x={x - 12} y={y + 70} width={24} height={140} fill={m.wood.base} stroke={INK} strokeWidth={5} />
  </svg>
);
