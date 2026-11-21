import React from 'react';
import {W, H} from '../world/util';

export const Post: React.FC<{f: number; flash?: number; fade?: number}> = ({f, flash = 0, fade = 1}) => (
  <>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <radialGradient id="vig" cx=".5" cy=".52" r=".78"><stop offset=".5" stopColor="#10060a" stopOpacity="0" /><stop offset="1" stopColor="#10060a" stopOpacity=".72" /></radialGradient>
        <linearGradient id="gradeTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2a5a" stopOpacity=".22" /><stop offset=".45" stopColor="#2a2a5a" stopOpacity="0" /><stop offset="1" stopColor="#ff9a40" stopOpacity=".12" /></linearGradient>
        <filter id="grainF" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed={f % 11} />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="url(#gradeTop)" />
      <rect width={W} height={H} fill="url(#vig)" />
      <rect width={W} height={H} filter="url(#grainF)" opacity=".16" />
      {flash > 0 && <rect width={W} height={H} fill="#fff4dc" opacity={flash} />}
      <rect width={W} height={H} fill="#000" opacity={1 - fade} />
    </svg>
  </>
);
