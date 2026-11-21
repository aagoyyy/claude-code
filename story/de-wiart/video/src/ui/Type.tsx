import React from 'react';
import {easeOut, H, W} from '../world/util';

/** one caption style for every chapter: gold bar, heavy sans title, serif italic sub, soft plate */
export const ChapterCaption: React.FC<{f: number; title: string; sub: string; from: number; to: number; dark?: boolean; desert?: boolean}> = ({f, title, sub, from, to, dark = true, desert}) => {
  const a = easeOut((f - from) / 12) * (1 - easeOut((f - to) / 14));
  const ink = desert ? '#4a2a18' : '#f6e8c8', ink2 = desert ? '#6a4630' : '#d9c7a0';
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
      <g opacity={a} transform={`translate(${(1 - a) * -30} 0)`}>
        <rect x={80} y={846} width={Math.max(title.length * 29, sub.length * 17) + 78} height={118} rx={10} fill={desert ? '#f6e8c8' : '#0c0806'} opacity=".42" />
        <rect x={96} y={866} width={4} height={86} fill={desert ? '#7a4a2c' : '#e0b86a'} />
        <text x={120} y={906} fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={40} letterSpacing={6} fill={ink}>{title}</text>
        <text x={120} y={946} fontFamily="Georgia, serif" fontStyle="italic" fontSize={32} fill={ink2}>{sub}</text>
      </g>
    </svg>
  );
};
