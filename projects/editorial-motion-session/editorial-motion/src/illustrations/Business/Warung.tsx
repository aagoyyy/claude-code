import React from 'react';
import {Illustration, IllustrationProps} from '../Illustration';
import {ink, inkThin} from '../../visual-system/IllustrationStyle';
import {palette, derived} from '../../visual-system/ColorPalette';
import {theme} from '../../visual-system/ThemeTokens';

/** Small food stall (warung) with striped awning, counter and stools. viewBox 520x470 */
export const Warung: React.FC<IllustrationProps & {sign?: string}> = ({sign = 'WARUNG', ...p}) => (
  <Illustration vbW={520} vbH={470} {...p}>
    <ellipse cx="260" cy="452" rx="220" ry="14" fill={derived.shadow} />
    {/* back wall */}
    <rect x="70" y="150" width="380" height="250" fill={palette.beige} {...ink} />
    {/* roof */}
    <path d="M40,150 L260,36 L480,150Z" fill={palette.brown} {...ink} />
    <path d="M110,126 L260,50 M180,126 L260,70" stroke={derived.brownDeep} strokeWidth={4} fill="none" />
    {/* sign */}
    <rect x="190" y="104" width="140" height="44" rx="8" fill={derived.white} {...ink} />
    <text x="260" y="136" textAnchor="middle" fontFamily={theme.font.display} fontWeight={900} fontSize={28} fill={palette.navy}>{sign}</text>
    {/* awning */}
    {Array.from({length: 8}).map((_, i) => (
      <path key={i} d={`M${48 + i * 53},160 h53 v34 q-26.5,22 -53,0Z`} fill={i % 2 ? derived.white : palette.tomato} {...inkThin} />
    ))}
    {/* counter */}
    <rect x="70" y="300" width="380" height="100" fill={palette.brown} {...ink} />
    <rect x="58" y="284" width="404" height="22" rx="6" fill={derived.brownLight} {...ink} />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${100 + i * 76},312 v78`} stroke={derived.brownDeep} strokeWidth={3} />
    ))}
    {/* bowls stack */}
    <path d="M110,284 q30,34 60,0Z" fill={derived.white} {...ink} />
    <path d="M118,266 q22,26 44,0Z" fill={derived.white} {...ink} />
    <path d="M350,284 q40,40 80,0Z" fill={derived.white} {...ink} />
    <path d="M350,284 q40,-14 80,0" fill="none" {...inkThin} />
    {/* stools */}
    {[110, 410].map((x) => (
      <g key={x}>
        <rect x={x - 28} y={410} width={56} height={14} rx={6} fill={palette.brown} {...ink} />
        <path d={`M${x - 20},424 l-8,28 M${x + 20},424 l8,28`} stroke={derived.outline} strokeWidth={6} strokeLinecap="round" />
      </g>
    ))}
  </Illustration>
);
