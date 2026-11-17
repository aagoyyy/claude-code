import React from 'react';
import {Illustration, IllustrationProps} from '../Illustration';
import {ink, inkThin} from '../../visual-system/IllustrationStyle';
import {palette, derived} from '../../visual-system/ColorPalette';

/** Simple warung vendor (bust) — round head, cap, apron. Same outline rules as every object. viewBox 300x380 */
export const Vendor: React.FC<IllustrationProps & {happy?: boolean}> = ({happy = true, ...p}) => (
  <Illustration vbW={300} vbH={380} {...p}>
    <ellipse cx="150" cy="366" rx="100" ry="10" fill={derived.shadow} />
    {/* body */}
    <path d="M44,372 Q40,250 110,226 L190,226 Q260,250 256,372Z" fill={derived.white} {...ink} />
    {/* apron */}
    <path d="M96,246 L204,246 L214,372 L86,372Z" fill={palette.green} {...ink} />
    <rect x="124" y="296" width="52" height="40" rx="8" fill={derived.greenDeep} {...inkThin} />
    {/* head */}
    <circle cx="150" cy="140" r="86" fill={derived.skin} {...ink} />
    <path d="M82,116 Q90,36 150,34 Q212,36 220,116 Q150,90 82,116Z" fill={palette.navy} {...ink} />
    <rect x="76" y="106" width="148" height="16" rx="8" fill={palette.tomato} {...ink} />
    <circle cx="116" cy="150" r="8" fill={palette.navy} />
    <circle cx="184" cy="150" r="8" fill={palette.navy} />
    <path d={happy ? 'M118,186 Q150,214 182,186' : 'M118,196 L182,196'} fill="none" {...ink} />
    <ellipse cx="96" cy="176" rx="12" ry="7" fill={palette.tomato} opacity={0.28} />
    <ellipse cx="204" cy="176" rx="12" ry="7" fill={palette.tomato} opacity={0.28} />
  </Illustration>
);
