import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clamp, ease, H, lerp, W} from '../world/util';

export const TRANS_FRAMES = 36;
/** year roll between chapters — keeps the story reading as one continuous timeline */
export const Transition: React.FC<{from: number; to: number; place: string}> = ({from, to, place}) => {
  const f = useCurrentFrame();
  const a = clamp(f / 8) * (1 - clamp((f - (TRANS_FRAMES - 8)) / 8));
  const y = Math.round(lerp(from, to, ease(clamp((f - 4) / 22))));
  return (
    <AbsoluteFill style={{background: '#0a0706'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs><radialGradient id="trG" cx=".5" cy=".5" r=".6"><stop offset="0" stopColor="#3a2a1a" stopOpacity=".8" /><stop offset="1" stopColor="#0a0706" stopOpacity="0" /></radialGradient></defs>
        <rect width={W} height={H} fill="url(#trG)" />
        <g opacity={a}>
          <text x={W / 2} y={H / 2 + 40} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={220} fill="#e9d9b0" letterSpacing={8}>{y}</text>
          <rect x={W / 2 - 120} y={H / 2 + 80} width={240} height={3} fill="#e0b86a" />
          <text x={W / 2} y={H / 2 + 140} textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={40} letterSpacing={8} fill="#d9c7a0">{place}</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
