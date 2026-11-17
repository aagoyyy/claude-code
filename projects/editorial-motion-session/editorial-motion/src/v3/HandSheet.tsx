import React from 'react';
import {PaperBackground} from '../backgrounds/PaperBackground';
import {Hand2, POSES} from './Hand2';
export const HandSheet: React.FC = () => (
  <PaperBackground>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {['open', 'pinch', 'hold', 'point'].map((k, i) => (
        <g key={k}>
          <Hand2 x={700} y={260 + i * 430} s={2.0} pose={POSES[k]} />
          <text x={40} y={280 + i * 430} fontFamily="Inter" fontWeight={800} fontSize={44} fill="#202A36">{k}</text>
        </g>
      ))}
    </svg>
  </PaperBackground>
);
