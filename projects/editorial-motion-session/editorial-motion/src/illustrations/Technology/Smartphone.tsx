import React from 'react';
import {Illustration, IllustrationProps} from '../Illustration';
import {ink, inkThin} from '../../visual-system/IllustrationStyle';
import {palette, derived} from '../../visual-system/ColorPalette';

/** Smartphone with a simple bar-chart screen. viewBox 300x560 */
export const Smartphone: React.FC<IllustrationProps & {screen?: React.ReactNode}> = ({screen, ...p}) => (
  <Illustration vbW={300} vbH={560} {...p}>
    <ellipse cx="150" cy="544" rx="104" ry="10" fill={derived.shadow} />
    <rect x="30" y="20" width="240" height="510" rx="40" fill={palette.navy} {...ink} />
    <rect x="46" y="56" width="208" height="438" rx="20" fill={palette.ivory} {...inkThin} />
    <rect x="112" y="30" width="76" height="12" rx="6" fill={derived.navySoft} />
    {screen ?? (
      <g>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={72 + i * 44} y={420 - (60 + i * 52)} width={30} height={60 + i * 52} rx={6} fill={i === 3 ? palette.green : palette.mustard} {...inkThin} />
        ))}
        <path d="M70,150 L150,110 L220,86" fill="none" stroke={palette.tomato} strokeWidth={6} strokeLinecap="round" />
      </g>
    )}
  </Illustration>
);
