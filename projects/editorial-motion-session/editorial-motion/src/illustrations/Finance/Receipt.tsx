import React from 'react';
import {Illustration, IllustrationProps} from '../Illustration';
import {ink, inkThin} from '../../visual-system/IllustrationStyle';
import {palette, derived} from '../../visual-system/ColorPalette';
import {theme} from '../../visual-system/ThemeTokens';

/** Paper receipt with zig-zag bottom. viewBox 300x400 */
export const Receipt: React.FC<IllustrationProps & {title?: string; lines?: [string, string][]; total?: string}> = ({title = 'STRUK', lines = [['Mi', '3.500'], ['Telur', '2.000'], ['Bumbu', '1.500']], total = '7.000', ...p}) => (
  <Illustration vbW={300} vbH={400} {...p}>
    <path d="M30,20 H270 V360 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-20,-18 l-20,18 l-10,-18Z" fill={derived.white} {...ink} />
    <text x="150" y="70" textAnchor="middle" fontFamily={theme.font.display} fontWeight={900} fontSize={34} fill={palette.navy}>{title}</text>
    <path d="M56,90 H244" stroke={palette.grid} strokeWidth={4} strokeDasharray="10 8" />
    {lines.map(([a, b], i) => (
      <g key={i}>
        <text x="56" y={134 + i * 44} fontFamily={theme.font.body} fontWeight={700} fontSize={26} fill={palette.navy}>{a}</text>
        <text x="244" y={134 + i * 44} textAnchor="end" fontFamily={theme.font.body} fontWeight={700} fontSize={26} fill={palette.navy}>{b}</text>
      </g>
    ))}
    <path d="M56,278 H244" stroke={palette.navy} strokeWidth={3} />
    <text x="56" y="322" fontFamily={theme.font.display} fontWeight={900} fontSize={28} fill={palette.tomato}>TOTAL</text>
    <text x="244" y="322" textAnchor="end" fontFamily={theme.font.display} fontWeight={900} fontSize={28} fill={palette.tomato}>{total}</text>
  </Illustration>
);
