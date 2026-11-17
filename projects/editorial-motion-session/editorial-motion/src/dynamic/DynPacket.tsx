import React from 'react';
import {Illustration} from '../illustrations/Illustration';
import {derived, palette} from '../visual-system/ColorPalette';
import {ink, inkThin} from '../visual-system/IllustrationStyle';
import {lerp, hash, Pt} from './math';

export const PACKET_VB = {w: 400, h: 300};

/** Instant-noodle packet. `open` 0..1: the crimped top strip is torn away (flying off) and the top edge morphs from a regular crimp into a ragged tear. */
export const DynPacket: React.FC<{size?: number; open?: number; sx?: number; sy?: number}> = ({size = 440, open = 0, sx = 1, sy = 1}) => {
  const N = 22;
  const edge = (torn: number): Pt[] =>
    Array.from({length: N + 1}, (_, i) => {
      const x = 36 + (328 * i) / N;
      const bow = -6 * (1 - Math.pow((x - 200) / 164, 2));
      const crimp = (i % 2 ? -1 : 1) * lerp(7, 0, torn);
      const jag = torn * (hash(i + 2) * 16 + (i % 3) * 2);
      return [x, 56 + bow + crimp + jag];
    });
  const top = edge(open);
  const bodyPath = `M${top.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L')} L354,262 Q200,284 46,262 Z`;
  const strip = edge(0);
  const stripPath = `M${strip.map((p) => `${p[0].toFixed(1)},${(p[1] - 28).toFixed(1)}`).join(' L')} L364,${56 - 0} L36,${56 - 0} Z`;
  const flap = {x: open * 150, y: -open * 330, r: open * 62};
  return (
    <Illustration vbW={PACKET_VB.w} vbH={PACKET_VB.h} size={size} style={{transform: `scale(${sx}, ${sy})`, transformOrigin: '50% 90%'}}>
      <defs>
        <clipPath id="dpacket-clip"><path d={bodyPath} /></clipPath>
        <linearGradient id="dpacket-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="0.35" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor={derived.outline} stopOpacity="0.16" />
        </linearGradient>
      </defs>
      <ellipse cx="205" cy="284" rx="150" ry="12" fill={derived.shadow} />
      {/* noodle brick peeking out of the torn opening */}
      {open > 0.05 && <rect x="58" y={44 - open * 6} width="284" height="40" rx="10" fill={derived.noodle} {...ink} />}
      {/* body */}
      <path d={bodyPath} fill={palette.mustard} {...ink} />
      <g clipPath="url(#dpacket-clip)">
        <rect x="20" y="30" width="360" height="98" fill={palette.tomato} />
        <rect x="20" y="226" width="360" height="70" fill={palette.green} />
        <rect x="20" y="214" width="360" height="12" fill={derived.mustardLight} />
        <path d="M20,128 Q200,146 380,128" stroke={derived.outline} strokeWidth={4} fill="none" />
        <rect x="20" y="30" width="360" height="270" fill="url(#dpacket-sheen)" />
      </g>
      <text x="200" y="104" textAnchor="middle" fontFamily="Inter Display, Inter, Arial" fontWeight={900} fontSize={46} fill={derived.white} stroke={derived.outline} strokeWidth={3} paintOrder="stroke">MIE INSTAN</text>
      <ellipse cx="205" cy="188" rx="84" ry="35" fill={derived.noodle} {...inkThin} />
      <path d="M138,184 q14,-14 28,0 t28,0 t28,0 t28,0 M144,198 q14,-14 28,0 t28,0 t28,0" fill="none" {...inkThin} stroke={derived.noodleDeep} />
      <circle cx="170" cy="177" r="12" fill={derived.white} {...inkThin} />
      <circle cx="170" cy="177" r="6" fill={palette.mustard} />
      <path d="M238,171 q20,-4 18,12 q-12,6 -18,-12Z" fill={palette.tomato} {...inkThin} />
      <path d={bodyPath} fill="none" {...ink} />
      {/* torn-off strip */}
      <g transform={`translate(${flap.x},${flap.y}) rotate(${flap.r} 364 56)`} opacity={1 - Math.max(0, open - 0.7) * 3}>
        <path d={stripPath} fill={derived.mustardLight} {...ink} />
      </g>
    </Illustration>
  );
};
