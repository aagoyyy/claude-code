import React from 'react';
import {Illustration, IllustrationProps} from '../Illustration';
import {ink, inkThin, highlight} from '../../visual-system/IllustrationStyle';
import {palette, derived} from '../../visual-system/ColorPalette';

/** Ceramic bowl with a red band. `filled` adds broth + noodles. `toppings` adds egg, greens, chili. viewBox 500x400. */
export const NoodleBowl: React.FC<IllustrationProps & {filled?: boolean; toppings?: boolean}> = ({filled = true, toppings = false, ...p}) => (
  <Illustration vbW={500} vbH={400} {...p}>
    <defs>
      <clipPath id="bowl-clip">
        <path d="M40,176 Q50,320 150,352 L350,352 Q450,320 460,176 Q250,230 40,176Z" />
      </clipPath>
    </defs>
    <ellipse cx="250" cy="372" rx="190" ry="18" fill={derived.shadow} />
    {/* foot */}
    <path d="M168,350 L332,350 L322,376 Q250,386 178,376Z" fill={derived.white} {...ink} />
    {/* body */}
    <path d="M40,176 Q50,320 150,352 L350,352 Q450,320 460,176 Q250,230 40,176Z" fill={derived.white} {...ink} />
    <g clipPath="url(#bowl-clip)">
      <path d="M30,252 Q250,300 470,252 L470,284 Q250,334 30,284Z" fill={palette.tomato} />
      <path d="M30,252 Q250,300 470,252" fill="none" stroke={derived.outline} strokeWidth={4} />
      <path d="M30,284 Q250,334 470,284" fill="none" stroke={derived.outline} strokeWidth={4} />
      <path d="M300,200 Q470,220 470,300 L470,360 L330,360Z" fill={derived.outline} opacity={0.08} />
      <path d="M60,190 Q70,260 120,300 L100,300 Q60,250 56,190Z" {...highlight} />
    </g>
    {/* rim + interior */}
    <ellipse cx="250" cy="176" rx="210" ry="48" fill={filled ? derived.broth : derived.white} {...ink} />
    {filled && (
      <g>
        <path d="M70,176 Q250,214 430,176 Q430,150 250,146 Q70,150 70,176Z" fill={derived.noodle} {...inkThin} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${100 + i * 52},176 q18,-26 36,0 t36,0`} fill="none" stroke={derived.noodleDeep} strokeWidth={4} strokeLinecap="round" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={'b' + i} d={`M${112 + i * 58},160 q18,-22 34,0 t34,0`} fill="none" stroke={derived.noodleDeep} strokeWidth={3.5} strokeLinecap="round" />
        ))}
      </g>
    )}
    {toppings && (
      <g>
        {/* greens */}
        <path d="M290,158 Q300,86 372,80 Q388,140 330,170 Q308,172 290,158Z" fill={palette.green} {...ink} />
        <path d="M300,156 Q340,124 372,86" fill="none" {...inkThin} />
        <path d="M312,164 Q330,100 380,92 Q384,132 350,160Z" fill={derived.greenLight} opacity={0.5} />
        {/* egg half */}
        <path d="M118,176 Q104,118 160,106 Q222,110 222,172 Q170,196 118,176Z" fill={derived.white} {...ink} />
        <circle cx="166" cy="148" r="26" fill={palette.mustard} {...inkThin} />
        <circle cx="158" cy="140" r="7" fill="#FFFFFF" opacity={0.5} />
        {/* chili */}
        <path d="M234,150 Q276,120 330,136 Q312,150 262,160Z" fill={palette.tomato} {...ink} />
        <path d="M330,136 q12,-10 20,-4" fill="none" {...inkThin} stroke={palette.green} strokeWidth={5} />
        {/* spring onion rings */}
        {[[214, 168], [250, 182], [196, 190]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={8} fill={derived.greenLight} {...inkThin} />
        ))}
      </g>
    )}
  </Illustration>
);
