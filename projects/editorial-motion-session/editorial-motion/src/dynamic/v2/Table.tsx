import React from 'react';
import {AbsoluteFill} from 'remotion';
import {materials as m, palette} from '../../visual-system/ColorPalette';
import {hash, smoothOpen, Pt} from '../math';

/** Paper wall with light falloff + grid, and a wood table with 4 planks, grain, knots, light pool and edge highlight. */
export const Stage2: React.FC<{tableTop?: number; blur?: number}> = ({tableTop = 1180, blur = 0}) => {
  const H = 1920 - tableTop;
  const planks = [0, 1, 2, 3, 4];
  const tones = [m.wood.base, m.wood.shade, m.wood.base, m.wood.light, m.wood.shade];
  return (
    <AbsoluteFill style={{filter: blur > 0 ? `blur(${blur}px)` : undefined}}>
      <svg width={1080} height={1920} viewBox="-60 -60 1200 2040" style={{position: 'absolute', left: -60, top: -60, width: 1200, height: 2040}}>
        <defs>
          <radialGradient id="st-wall" cx="0.28" cy="0.18" r="0.95">
            <stop offset="0" stopColor="#FCF2DA" /><stop offset="0.5" stopColor="#EEDDB8" /><stop offset="1" stopColor="#D5BC92" />
          </radialGradient>
          <linearGradient id="st-edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" stopOpacity="0.7" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" /></linearGradient>
          <linearGradient id="st-dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={m.wood.core} stopOpacity="0.0" /><stop offset="1" stopColor={m.wood.core} stopOpacity="0.62" /></linearGradient>
          <radialGradient id="st-pool" cx="0.5" cy="0.2" r="0.7"><stop offset="0" stopColor="#FFF3D0" stopOpacity="0.6" /><stop offset="1" stopColor="#FFF3D0" stopOpacity="0" /></radialGradient>
          <filter id="st-shadow" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
        </defs>
        <rect x="-60" y="-60" width="1200" height={tableTop + 60} fill="url(#st-wall)" />
        {Array.from({length: 24}).map((_, i) => <line key={'v' + i} x1={-60 + i * 54} y1={-60} x2={-60 + i * 54} y2={tableTop} stroke={palette.grid} strokeWidth={i % 4 === 0 ? 2.8 : 1.8} opacity={i % 4 === 0 ? 0.7 : 0.42} />)}
        {Array.from({length: 38}).map((_, i) => <line key={'h' + i} x1={-60} y1={-60 + i * 54} x2={1140} y2={-60 + i * 54} stroke={palette.grid} strokeWidth={i % 4 === 0 ? 2.8 : 1.8} opacity={i % 4 === 0 ? 0.7 : 0.42} />)}
        {/* wall shadow cast on the table back edge */}
        <rect x="-60" y={tableTop - 4} width="1200" height="36" fill={m.wood.core} opacity={0.35} filter="url(#st-shadow)" />
        {planks.map((p, i) => <rect key={i} x={-60 + p * 250} y={tableTop} width={252} height={H + 60} fill={tones[i]} />)}
        {planks.map((p, i) => <line key={'s' + i} x1={-60 + p * 250} y1={tableTop} x2={-60 + p * 250} y2={1980} stroke={m.wood.core} strokeWidth={4} opacity={0.4} />)}
        {Array.from({length: 40}).map((_, i) => {
          const y = tableTop + 30 + ((H - 20) * i) / 40 + hash(i) * 14;
          const pts: Pt[] = Array.from({length: 9}, (_, k) => [-60 + k * 150, y + Math.sin(k * 0.8 + i * 0.6) * 6 + (hash(i * 3 + k) - 0.5) * 5] as Pt);
          return <path key={i} d={smoothOpen(pts)} fill="none" stroke={m.wood.core} strokeWidth={1.6 + hash(i + 1) * 2.4} opacity={0.18 + hash(i + 5) * 0.2} strokeLinecap="round" />;
        })}
        {[[210, tableTop + 360], [820, tableTop + 520], [560, tableTop + 680]].map(([kx, ky], i) => (
          <g key={i} opacity={0.5}>
            {[34, 24, 15, 7].map((r, j) => <ellipse key={j} cx={kx} cy={ky} rx={r * 1.8} ry={r * 0.9} fill="none" stroke={m.wood.core} strokeWidth={2.4} />)}
          </g>
        ))}
        <rect x="-60" y={tableTop} width="1200" height="52" fill="url(#st-edge)" />
        <rect x="-60" y={tableTop + 60} width="1200" height={H} fill="url(#st-dark)" />
        <ellipse cx="540" cy={tableTop + 220} rx="620" ry="260" fill="url(#st-pool)" />
        <line x1="-60" y1={tableTop} x2="1140" y2={tableTop} stroke="#3A2B22" strokeWidth={5} opacity={0.9} />
      </svg>
    </AbsoluteFill>
  );
};
