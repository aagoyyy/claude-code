import React from 'react';
import {DrawOnPath} from '../../animations/DrawOn';
import {derived} from '../../visual-system/ColorPalette';
import {useCurrentFrame} from 'remotion';

/** Three draw-on steam curls that gently drift. Place above a bowl. viewBox 300x260. */
export const Steam: React.FC<{size?: number; delay?: number}> = ({size = 300, delay = 0}) => {
  const f = useCurrentFrame();
  const drift = (i: number) => Math.sin((f / 40) + i) * 5;
  const curls = [
    'M60,250 C20,200 100,170 60,120 C30,80 80,50 60,10',
    'M150,250 C110,205 200,170 150,115 C120,75 180,45 150,5',
    'M240,250 C200,210 280,175 240,125 C215,90 260,60 240,20',
  ];
  return (
    <svg width={size} height={(size * 260) / 300} viewBox="0 0 300 260" style={{overflow: 'visible'}}>
      {curls.map((d, i) => (
        <g key={i} transform={`translate(${drift(i)},0)`} opacity={0.9}>
          <DrawOnPath d={d} delay={delay + i * 6} duration={28} stroke={derived.steam} strokeWidth={14} />
        </g>
      ))}
    </svg>
  );
};
