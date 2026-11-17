import React from 'react';
import {Illustration, IllustrationProps} from '../Illustration';
import {ink, inkThin, highlight} from '../../visual-system/IllustrationStyle';
import {palette, derived} from '../../visual-system/ColorPalette';

/** Whole egg. viewBox 200x240 */
export const Egg: React.FC<IllustrationProps & {cut?: boolean}> = ({cut = false, ...p}) => (
  <Illustration vbW={200} vbH={240} {...p}>
    <ellipse cx="100" cy="226" rx="62" ry="9" fill={derived.shadow} />
    {cut ? (
      <g>
        <path d="M30,120 Q20,50 100,34 Q180,50 170,120 Q150,176 100,176 Q50,176 30,120Z" fill={derived.white} {...ink} />
        <circle cx="100" cy="108" r="36" fill={palette.mustard} {...inkThin} />
        <circle cx="88" cy="96" r="9" fill="#FFFFFF" opacity={0.5} />
      </g>
    ) : (
      <g>
        <path d="M100,22 Q164,34 168,128 Q168,206 100,208 Q32,206 32,128 Q36,34 100,22Z" fill={palette.beige} {...ink} />
        <path d="M60,60 Q72,40 92,38 Q70,56 66,96Z" {...highlight} />
        <path d="M130,70 Q160,120 150,190 Q166,150 150,90Z" fill={derived.outline} opacity={0.1} />
      </g>
    )}
  </Illustration>
);

/** Leafy green. viewBox 240x220 */
export const Greens: React.FC<IllustrationProps> = (p) => (
  <Illustration vbW={240} vbH={220} {...p}>
    <path d="M30,170 Q10,70 110,30 Q220,30 216,120 Q200,196 110,196 Q60,196 30,170Z" fill={palette.green} {...ink} />
    <path d="M40,168 Q96,110 206,52" fill="none" {...inkThin} />
    <path d="M90,126 q-20,-18 -34,-14 M120,100 q-8,-26 -6,-40 M150,84 q18,-16 32,-14" fill="none" {...inkThin} />
    <path d="M44,150 Q40,100 90,60 Q60,100 70,150Z" fill={derived.greenLight} opacity={0.45} />
    <path d="M120,196 Q180,190 212,130 Q200,210 120,200Z" fill={derived.outline} opacity={0.12} />
  </Illustration>
);

/** Red chili. viewBox 260x140 */
export const Chili: React.FC<IllustrationProps> = (p) => (
  <Illustration vbW={260} vbH={140} {...p}>
    <path d="M30,40 Q120,10 220,70 Q246,86 232,108 Q130,130 40,74 Q20,56 30,40Z" fill={palette.tomato} {...ink} />
    <path d="M30,40 Q12,28 16,14 Q34,18 40,34" fill={palette.green} {...ink} />
    <path d="M50,48 Q120,34 190,70" fill="none" opacity={0.4} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />
  </Illustration>
);

/** Spring onion bunch. viewBox 220x200 */
export const SpringOnion: React.FC<IllustrationProps> = (p) => (
  <Illustration vbW={220} vbH={200} {...p}>
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`rotate(${-18 + i * 12} 110 190)`}>
        <rect x={96 + i * 6} y={24} width={20} height={156} rx={10} fill={palette.green} {...ink} />
        <rect x={96 + i * 6} y={130} width={20} height={50} rx={10} fill={derived.greenLight} {...ink} />
      </g>
    ))}
    <rect x="80" y="130" width="60" height="16" rx="6" fill={palette.brown} {...ink} />
  </Illustration>
);

/** Seasoning sachet. viewBox 180x220 */
export const Sachet: React.FC<IllustrationProps & {color?: string}> = ({color = palette.mustard, ...p}) => (
  <Illustration vbW={180} vbH={220} {...p}>
    <path d="M24,28 L156,28 L150,196 L30,196Z" fill={color} {...ink} />
    <path d="M24,28 l10,-12 l10,12 l10,-12 l10,12 l10,-12 l10,12 l10,-12 l10,12 l10,-12 l10,12 l10,-12 l10,12" fill={derived.white} {...inkThin} />
    <circle cx="90" cy="112" r="34" fill={palette.tomato} {...inkThin} />
    <path d="M30,28 L60,28 L44,196 L30,196Z" {...highlight} />
  </Illustration>
);

/** Meatball. viewBox 120x120 */
export const MeatBall: React.FC<IllustrationProps> = (p) => (
  <Illustration vbW={120} vbH={120} {...p}>
    <circle cx="60" cy="62" r="46" fill={palette.brown} {...ink} />
    <path d="M30,44 Q42,26 62,24" fill="none" stroke="#FFFFFF" opacity={0.4} strokeWidth={8} strokeLinecap="round" />
    <path d="M76,98 Q100,84 104,56 Q102,100 70,106Z" fill={derived.outline} opacity={0.14} />
  </Illustration>
);
