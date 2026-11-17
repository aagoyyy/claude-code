import React from 'react';
import {Illustration, IllustrationProps} from '../Illustration';
import {ink, inkThin, highlight} from '../../visual-system/IllustrationStyle';
import {palette, derived} from '../../visual-system/ColorPalette';

/** Instant-noodle packet. viewBox 400x300. */
export const NoodlePacket: React.FC<IllustrationProps & {label?: string}> = ({label = 'MIE INSTAN', ...p}) => (
  <Illustration vbW={400} vbH={300} {...p}>
    <defs>
      <clipPath id="packet-clip">
        <path d="M34,46 Q200,24 366,46 L354,262 Q200,284 46,262 Z" />
      </clipPath>
    </defs>
    <g transform="rotate(-5 200 150)">
      <ellipse cx="205" cy="286" rx="150" ry="12" fill={derived.shadow} />
      <path d="M34,46 Q200,24 366,46 L354,262 Q200,284 46,262 Z" fill={palette.mustard} {...ink} />
      <g clipPath="url(#packet-clip)">
        <rect x="20" y="20" width="360" height="104" fill={palette.tomato} />
        <rect x="20" y="226" width="360" height="70" fill={palette.green} />
        <rect x="20" y="214" width="360" height="12" fill={derived.mustardLight} />
        <path d="M20,124 Q200,140 380,124" stroke={derived.outline} strokeWidth={4} fill="none" />
        <polygon points="40,40 150,36 70,262 40,262" {...highlight} />
        <path d="M200,60 L360,60 L350,262 L210,262Z" fill={derived.outline} opacity={0.07} />
      </g>
      {/* crimped seal */}
      <path d="M34,46 l12,-10 l12,10 l12,-10 l12,10 l12,-10 l12,10 l12,-10 l12,10 l12,-10 l12,10 l12,-10 l12,10 l12,-10 l12,10 l12,-10 l12,10 l12,-10 l12,10 l12,-10 l12,10 l12,-10 l12,10 l12,-10" fill={derived.mustardLight} {...inkThin} />
      <text x="200" y="96" textAnchor="middle" fontFamily="Inter Display, Inter, Arial" fontWeight={900} fontSize={46} fill={derived.white} stroke={derived.outline} strokeWidth={3} paintOrder="stroke">
        {label}
      </text>
      {/* picture bowl */}
      <ellipse cx="205" cy="186" rx="82" ry="34" fill={derived.noodle} {...inkThin} />
      <path d="M140,182 q14,-14 28,0 t28,0 t28,0 t28,0 M146,196 q14,-14 28,0 t28,0 t28,0" fill="none" {...inkThin} stroke={derived.noodleDeep} />
      <circle cx="170" cy="176" r="12" fill={derived.white} {...inkThin} />
      <circle cx="170" cy="176" r="6" fill={palette.mustard} />
      <path d="M236,170 q20,-4 18,12 q-12,6 -18,-12Z" fill={palette.tomato} {...inkThin} />
    </g>
  </Illustration>
);
