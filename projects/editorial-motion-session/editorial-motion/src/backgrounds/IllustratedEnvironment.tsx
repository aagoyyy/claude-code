import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backgroundTokens} from '../visual-system/BackgroundTokens';
import {palette, derived} from '../visual-system/ColorPalette';
import {ink, inkThin} from '../visual-system/IllustrationStyle';

/** B. ILLUSTRATED ENVIRONMENT — flat 2D room. RULE: decor stays below y=540 so the headline zone (220-480) is always clear. `kind`: 'warung' (counter + shelf) | 'kitchen' (tiles + stove line). */
export const IllustratedEnvironment: React.FC<{kind?: 'warung' | 'kitchen'; counterY?: number; children?: React.ReactNode}> = ({kind = 'warung', counterY = 1180, children}) => (
  <AbsoluteFill style={{background: backgroundTokens.environmentWall.base}}>
    <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      {/* wall tiles */}
      {Array.from({length: 11}).map((_, x) =>
        Array.from({length: 14}).map((__, y) => (
          <rect key={x + '-' + y} x={x * 100 - 10} y={y * 100 - 10} width={100} height={100} fill="none" stroke={backgroundTokens.environmentWall.tile} strokeWidth={3} opacity={0.6} />
        ))
      )}
      {kind === 'warung' && (
        <g>
          <rect x="60" y="680" width="420" height="22" rx="6" fill={palette.brown} {...ink} />
          <rect x="60" y="860" width="420" height="22" rx="6" fill={palette.brown} {...ink} />
          {[90, 180, 270, 360].map((x) => (
            <path key={x} d={`M${x},680 q30,-70 60,0Z`} fill={derived.white} {...inkThin} />
          ))}
          <rect x="640" y="620" width="300" height="260" rx="14" fill="#BFD7DF" {...ink} />
          <path d="M790,620 v260 M640,750 h300" stroke={derived.outline} strokeWidth={6} />
          <rect x="560" y="560" width="460" height="40" fill={palette.tomato} {...ink} />
        </g>
      )}
      {kind === 'kitchen' && (
        <g>
          <rect x="120" y="640" width="360" height="240" rx="10" fill={derived.white} {...ink} />
          <path d="M150,680 h300 M150,730 h300" stroke={palette.grid} strokeWidth={5} />
          <rect x="600" y="640" width="340" height="230" rx="14" fill={derived.navySoft} {...ink} />
        </g>
      )}
      {/* counter surface */}
      <rect x="-20" y={counterY} width="1120" height={1920 - counterY + 40} fill={palette.beige} stroke={derived.outline} strokeWidth={6} />
      {[0.12, 0.34, 0.6, 0.86].map((k, i) => (
        <path key={i} d={`M-20,${counterY + (1920 - counterY) * k} h1120`} stroke={palette.brown} strokeWidth={3} opacity={0.28} />
      ))}
    </svg>
    {children}
  </AbsoluteFill>
);
