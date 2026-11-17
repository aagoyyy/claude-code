import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Illustration} from '../../illustrations/Illustration';
import {materials as m} from '../../visual-system/ColorPalette';
import {ink} from '../../visual-system/IllustrationStyle';
import {smoothOpen, Pt} from '../math';

/** Dry noodle brick made of many curly strands. viewBox 320x200 */
export const Brick2: React.FC<{size?: number; wet?: number; sx?: number; sy?: number}> = ({size = 380, wet = 0, sx = 1, sy = 1}) => {
  const f = useCurrentFrame();
  const rows = 11;
  return (
    <Illustration vbW={320} vbH={200} size={size} style={{transform: `scale(${sx}, ${sy})`}}>
      <defs>
        <linearGradient id="br2-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={m.noodle.hi} /><stop offset="0.5" stopColor={m.noodle.base} /><stop offset="1" stopColor={m.noodle.shade} /></linearGradient>
        <clipPath id="br2-clip"><rect x="14" y="14" width="292" height="172" rx="30" /></clipPath>
      </defs>
      <rect x="14" y="14" width="292" height="172" rx="30" fill="url(#br2-g)" {...ink} />
      <g clipPath="url(#br2-clip)">
        {Array.from({length: rows}).map((_, i) => {
          const y = 26 + i * 15;
          const pts: Pt[] = Array.from({length: 13}, (_, k) => [8 + k * 25, y + Math.sin(k * 1.7 + i * 1.2 + f * 0.05) * (3.5 + wet * 9)] as Pt);
          const d = smoothOpen(pts);
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={m.noodle.core} strokeWidth={8} strokeLinecap="round" transform="translate(0,2.6)" opacity={0.8} />
              <path d={d} fill="none" stroke={i % 2 ? m.noodle.light : m.noodle.base} strokeWidth={6} strokeLinecap="round" />
              <path d={d} fill="none" stroke={m.noodle.hi} strokeWidth={1.8} strokeLinecap="round" opacity={0.9} transform="translate(-1,-1.6)" />
            </g>
          );
        })}
        <path d="M24,30 Q150,16 292,34" fill="none" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" opacity={0.4} />
        <path d="M200,178 Q270,172 304,120 L304,186 L200,186Z" fill="#000" opacity={0.1} />
      </g>
    </Illustration>
  );
};
