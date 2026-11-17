import React from 'react';
import {Illustration} from '../illustrations/Illustration';
import {derived} from '../visual-system/ColorPalette';
import {ink} from '../visual-system/IllustrationStyle';
import {smoothOpen, Pt} from './math';
import {useCurrentFrame} from 'remotion';

/** Dry noodle brick; strands wobble. `wet` 0..1 relaxes the strands (more wavy, darker). */
export const DynBrick: React.FC<{size?: number; wet?: number; sx?: number; sy?: number}> = ({size = 320, wet = 0, sx = 1, sy = 1}) => {
  const f = useCurrentFrame();
  const rows = 8;
  return (
    <Illustration vbW={320} vbH={200} size={size} style={{transform: `scale(${sx}, ${sy})`}}>
      <defs>
        <linearGradient id="dbrick" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F7DB93" />
          <stop offset="1" stopColor={derived.noodleDeep} />
        </linearGradient>
        <clipPath id="dbrick-clip"><rect x="14" y="14" width="292" height="172" rx="30" /></clipPath>
      </defs>
      <rect x="14" y="14" width="292" height="172" rx="30" fill="url(#dbrick)" {...ink} />
      <g clipPath="url(#dbrick-clip)">
        {Array.from({length: rows}).map((_, i) => {
          const y = 34 + i * 20;
          const pts: Pt[] = Array.from({length: 12}, (_, k) => [10 + k * 27, y + Math.sin(k * 1.6 + i * 1.3 + f * 0.04) * (4 + wet * 8)] as Pt);
          const d = smoothOpen(pts);
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={derived.noodleDeep} strokeWidth={9} strokeLinecap="round" transform="translate(0,2.5)" />
              <path d={d} fill="none" stroke="#FBE6A9" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
            </g>
          );
        })}
        <path d="M24,30 Q150,18 290,34" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.45} />
      </g>
    </Illustration>
  );
};
