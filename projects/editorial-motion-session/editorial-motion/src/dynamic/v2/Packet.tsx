import React from 'react';
import {Illustration} from '../../illustrations/Illustration';
import {materials as m, derived, palette} from '../../visual-system/ColorPalette';
import {ink, inkThin} from '../../visual-system/IllustrationStyle';
import {hash, lerp, Pt} from '../math';

/** Detailed noodle packet: foil sheen, folds, print graphics, crimp, torn-edge morph. `open` 0..1. viewBox 400x300 */
export const Packet2: React.FC<{size?: number; open?: number; sx?: number; sy?: number; strip?: {x: number; y: number; r: number; o?: number}; peek?: boolean}> = ({size = 500, open = 0, sx = 1, sy = 1, strip: stripOverride, peek = true}) => {
  const N = 24;
  const edge = (torn: number): Pt[] =>
    Array.from({length: N + 1}, (_, i) => {
      const x = 36 + (328 * i) / N;
      const bow = -7 * (1 - Math.pow((x - 200) / 164, 2));
      const crimp = (i % 2 ? -1 : 1) * lerp(7, 0, torn);
      const jag = torn * (hash(i + 2) * 18 + (i % 3) * 2);
      return [x, 56 + bow + crimp + jag];
    });
  const top = edge(open);
  const bodyPath = `M${top.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L')} L356,262 Q200,286 44,262 Z`;
  const strip = edge(0);
  const stripPath = `M${strip.map((p) => `${p[0].toFixed(1)},${(p[1] - 30).toFixed(1)}`).join(' L')} L364,56 L36,56 Z`;
  const flap = stripOverride ?? {x: open * 160, y: -open * 340, r: open * 66};
  return (
    <Illustration vbW={400} vbH={300} size={size} style={{transform: `scale(${sx}, ${sy})`, transformOrigin: '50% 90%'}}>
      <defs>
        <clipPath id="pk2-clip"><path d={bodyPath} /></clipPath>
        <filter id="pk2-blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="7" /></filter>
        <linearGradient id="pk2-red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={derived.tomatoLight} /><stop offset="0.5" stopColor={palette.tomato} /><stop offset="1" stopColor={derived.tomatoDeep} /></linearGradient>
        <linearGradient id="pk2-yel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={derived.mustardLight} /><stop offset="0.55" stopColor={palette.mustard} /><stop offset="1" stopColor={derived.mustardDeep} /></linearGradient>
        <linearGradient id="pk2-grn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={derived.greenLight} /><stop offset="0.5" stopColor={palette.green} /><stop offset="1" stopColor={derived.greenDeep} /></linearGradient>
        <linearGradient id="pk2-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.62" /><stop offset="0.28" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.62" stopColor="#FFFFFF" stopOpacity="0.18" /><stop offset="0.7" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor={derived.outline} stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="pk2-crimp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={m.packet.foil} /><stop offset="1" stopColor={m.packet.foilShade} /></linearGradient>
      </defs>
      <ellipse cx="206" cy="290" rx="160" ry="14" fill="rgba(70,36,14,0.3)" filter="url(#pk2-blur)" />
      {open > 0.05 && peek && (
        <g>
          <rect x="56" y={42 - open * 8} width="288" height="46" rx="10" fill={m.noodle.base} {...ink} />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M64,${54 - open * 8 + i * 9} q20,-8 40,0 t40,0 t40,0 t40,0 t40,0 t40,0`} fill="none" stroke={m.noodle.shade} strokeWidth={4} opacity={0.8} />)}
        </g>
      )}
      <path d={bodyPath} fill="url(#pk2-yel)" {...ink} />
      <g clipPath="url(#pk2-clip)">
        <rect x="20" y="30" width="360" height="102" fill="url(#pk2-red)" />
        <rect x="20" y="224" width="360" height="76" fill="url(#pk2-grn)" />
        <rect x="20" y="212" width="360" height="12" fill={derived.mustardLight} />
        {/* print: burst + stripes */}
        <polygon points={Array.from({length: 24}).map((_, i) => { const a = (i / 24) * 6.283, r = i % 2 ? 66 : 84; return `${(200 + Math.cos(a) * r).toFixed(1)},${(172 + Math.sin(a) * r * 0.55).toFixed(1)}`; }).join(' ')} fill={derived.mustardLight} opacity={0.9} />
        <path d="M20,132 Q200,150 380,132 L380,142 Q200,160 20,142Z" fill={m.ceramic.hi} opacity={0.9} />
        <path d="M20,132 Q200,150 380,132" fill="none" stroke={derived.outline} strokeWidth={3.5} />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={20 + i * 66} y={228} width={30} height={6} fill="#FFFFFF" opacity={0.22} transform={`skewX(-20)`} />)}
        {/* folds */}
        <path d="M120,40 Q132,150 112,276" fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={0.35} strokeLinecap="round" />
        <path d="M268,48 Q282,160 262,272" fill="none" stroke={derived.outline} strokeWidth={4} opacity={0.14} strokeLinecap="round" />
        <rect x="20" y="30" width="360" height="270" fill="url(#pk2-sheen)" />
      </g>
      <text x="200" y="106" textAnchor="middle" fontFamily="Inter Display, Inter, Arial" fontWeight={900} fontSize={47} fill={derived.white} stroke={derived.outline} strokeWidth={3.4} paintOrder="stroke">MIE INSTAN</text>
      <ellipse cx="205" cy="190" rx="82" ry="34" fill={m.ceramic.base} {...inkThin} />
      <ellipse cx="205" cy="186" rx="72" ry="26" fill={m.broth.light} {...inkThin} />
      <path d="M140,184 q14,-14 28,0 t28,0 t28,0 t28,0 M146,196 q14,-14 28,0 t28,0 t28,0" fill="none" stroke={m.noodle.base} strokeWidth={5} strokeLinecap="round" />
      <circle cx="172" cy="178" r="12" fill={m.eggWhite.hi} {...inkThin} /><circle cx="172" cy="178" r="6" fill={m.yolk.base} />
      <path d="M236,172 q20,-4 18,12 q-12,6 -18,-12Z" fill={m.chili.base} {...inkThin} />
      <path d={bodyPath} fill="none" {...ink} />
      <g transform={`translate(${flap.x},${flap.y}) rotate(${flap.r} 364 56)`} opacity={stripOverride ? (stripOverride.o ?? 1) : 1 - Math.max(0, open - 0.7) * 3}>
        <path d={stripPath} fill="url(#pk2-crimp)" {...ink} />
        {Array.from({length: 12}).map((_, i) => <line key={i} x1={48 + i * 26} y1={30} x2={48 + i * 26} y2={54} stroke={derived.outline} strokeWidth={2} opacity={0.35} />)}
      </g>
    </Illustration>
  );
};
