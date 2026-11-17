import React from 'react';
import {Illustration, IllustrationProps} from '../Illustration';
import {ink, inkThin} from '../../visual-system/IllustrationStyle';
import {derived, palette} from '../../visual-system/ColorPalette';

/** Open hand with white sleeve, fingers pointing up-left. viewBox 360x420 */
export const Hand: React.FC<IllustrationProps> = (p) => (
  <Illustration vbW={360} vbH={420} {...p}>
    {/* sleeve */}
    <path d="M200,420 L330,420 L350,280 Q300,250 230,270Z" fill={derived.white} {...ink} />
    <path d="M232,274 Q290,262 344,286" fill="none" {...inkThin} />
    {/* fingers */}
    {[
      {x: 66, y: 40, r: -16, l: 130},
      {x: 118, y: 16, r: -6, l: 150},
      {x: 172, y: 24, r: 6, l: 142},
      {x: 222, y: 52, r: 16, l: 120},
    ].map((f, i) => (
      <rect key={i} x={f.x} y={f.y} width={42} height={f.l} rx={21} transform={`rotate(${f.r} ${f.x + 21} ${f.y + f.l})`} fill={derived.skin} {...ink} />
    ))}
    {/* palm */}
    <path d="M64,150 Q60,260 140,300 Q210,320 250,282 Q272,230 250,150 Q160,120 64,150Z" fill={derived.skin} {...ink} />
    {/* thumb */}
    <path d="M70,210 Q16,200 22,168 Q40,150 84,176Z" fill={derived.skin} {...ink} />
    <path d="M110,300 Q170,310 232,284 Q200,330 130,320Z" fill={derived.skinShade} opacity={0.5} />
  </Illustration>
);
