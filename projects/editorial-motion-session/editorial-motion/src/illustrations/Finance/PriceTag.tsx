import React from 'react';
import {Illustration, IllustrationProps} from '../Illustration';
import {ink, inkThin, highlight} from '../../visual-system/IllustrationStyle';
import {palette, derived} from '../../visual-system/ColorPalette';
import {theme} from '../../visual-system/ThemeTokens';

/** Hang-tag price label (string + eyelet). viewBox 420x150. `text` rendered in white. */
export const PriceTagArt: React.FC<IllustrationProps & {text: string; color?: string; fontSize?: number}> = ({text, color = palette.tomato, fontSize = 64, ...p}) => (
  <Illustration vbW={420} vbH={150} {...p}>
    <path d="M22,74 C-8,54 12,14 44,34 C58,44 62,58 58,70" fill="none" {...ink} />
    <path d="M44,75 L84,22 H394 Q410,22 410,38 V112 Q410,128 394,128 H84Z" fill={color} {...ink} />
    <path d="M90,30 H390 Q402,30 402,40 V48 H100Z" {...highlight} />
    <circle cx="76" cy="75" r="12" fill={palette.ivory} {...inkThin} />
    <text x="248" y="98" textAnchor="middle" fontFamily={theme.font.display} fontWeight={900} fontSize={fontSize} fill={derived.white}>
      {text}
    </text>
  </Illustration>
);

/** Square label with text (cost labels). viewBox 360x120 */
export const CostLabelArt: React.FC<IllustrationProps & {text: string; color?: string; textColor?: string; fontSize?: number}> = ({text, color = palette.ivory, textColor = palette.navy, fontSize = 44, ...p}) => (
  <Illustration vbW={360} vbH={120} {...p}>
    <rect x="8" y="12" width="344" height="96" rx="22" fill={color} {...ink} />
    <path d="M26,20 H334" stroke="#FFFFFF" opacity={0.6} strokeWidth={6} strokeLinecap="round" />
    <text x="180" y="78" textAnchor="middle" fontFamily={theme.font.display} fontWeight={900} fontSize={fontSize} fill={textColor}>
      {text}
    </text>
  </Illustration>
);
