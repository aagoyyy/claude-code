import React from 'react';
import {Illustration, IllustrationProps} from '../Illustration';
import {ink, inkThin} from '../../visual-system/IllustrationStyle';
import {palette, derived} from '../../visual-system/ColorPalette';

/** Closed notebook with elastic band. viewBox 260x340 */
export const Notebook: React.FC<IllustrationProps> = (p) => (
  <Illustration vbW={260} vbH={340} {...p}>
    <ellipse cx="136" cy="330" rx="100" ry="8" fill={derived.shadow} />
    <rect x="40" y="24" width="190" height="290" rx="14" fill={palette.brown} {...ink} />
    <rect x="26" y="34" width="26" height="272" rx="8" fill={derived.brownDeep} {...ink} />
    <rect x="178" y="24" width="18" height="290" fill={palette.mustard} {...inkThin} />
    <path d="M62,40 H160 M62,60 H140" stroke="#FFFFFF" opacity={0.3} strokeWidth={6} strokeLinecap="round" />
  </Illustration>
);

/** Pair of chopsticks. viewBox 400x120 */
export const Chopsticks: React.FC<IllustrationProps> = (p) => (
  <Illustration vbW={400} vbH={120} {...p}>
    <path d="M20,30 L380,86" stroke={derived.outline} strokeWidth={22} strokeLinecap="round" />
    <path d="M20,30 L380,86" stroke={palette.beige} strokeWidth={13} strokeLinecap="round" />
    <path d="M30,74 L376,60" stroke={derived.outline} strokeWidth={22} strokeLinecap="round" />
    <path d="M30,74 L376,60" stroke={palette.brown} strokeWidth={13} strokeLinecap="round" />
  </Illustration>
);
