import React from 'react';
import {Illustration, IllustrationProps} from '../Illustration';
import {ink, inkThin, highlight} from '../../visual-system/IllustrationStyle';
import {palette, derived} from '../../visual-system/ColorPalette';

/** Gold coin, front-facing. viewBox 140x140 */
export const Coin: React.FC<IllustrationProps & {text?: string}> = ({text = 'Rp', ...p}) => (
  <Illustration vbW={140} vbH={140} {...p}>
    <ellipse cx="72" cy="130" rx="46" ry="7" fill={derived.shadow} />
    <circle cx="70" cy="68" r="58" fill={palette.mustard} {...ink} />
    <circle cx="70" cy="68" r="42" fill={derived.mustardLight} {...inkThin} />
    <text x="70" y="82" textAnchor="middle" fontFamily="Inter Display, Inter, Arial" fontWeight={900} fontSize={42} fill={derived.mustardDeep} stroke={derived.outline} strokeWidth={1.6}>
      {text}
    </text>
    <path d="M28,46 Q40,22 70,14" fill="none" stroke="#FFFFFF" opacity={0.55} strokeWidth={7} strokeLinecap="round" />
    <path d="M100,112 Q124,92 126,60 Q128,106 92,122Z" fill={derived.outline} opacity={0.12} />
  </Illustration>
);

/** Stacked coins. viewBox 200x160 */
export const CoinStack: React.FC<IllustrationProps & {count?: number}> = ({count = 4, ...p}) => (
  <Illustration vbW={200} vbH={160} {...p}>
    <ellipse cx="100" cy="148" rx="74" ry="9" fill={derived.shadow} />
    {Array.from({length: count}).map((_, i) => {
      const y = 118 - i * 24;
      const x = 100 + (i % 2 ? 6 : -4);
      return (
        <g key={i}>
          <path d={`M${x - 66},${y} v-16 a66,22 0 0 1 132,0 v16 a66,22 0 0 1 -132,0Z`} fill={derived.mustardDeep} {...ink} />
          <ellipse cx={x} cy={y - 16} rx={66} ry={22} fill={palette.mustard} {...ink} />
          <ellipse cx={x} cy={y - 16} rx={44} ry={13} fill="none" {...inkThin} />
        </g>
      );
    })}
  </Illustration>
);
