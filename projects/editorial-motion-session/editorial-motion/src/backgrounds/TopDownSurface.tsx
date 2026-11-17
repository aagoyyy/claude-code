import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backgroundTokens} from '../visual-system/BackgroundTokens';

/** C. TOP-DOWN SURFACE — overhead wooden table with planks and grain. Objects are arranged on top. */
export const TopDownSurface: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const w = backgroundTokens.wood;
  const grains = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <AbsoluteFill style={{background: w.base}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 270} y={0} width={270} height={1920} fill={i % 2 ? '#E2BE8E' : w.base} stroke={w.grain} strokeWidth={3} opacity={0.95} />
        ))}
        {grains.map((i) => (
          <path key={i} d={`M${60 + (i % 4) * 270 + (i * 37) % 120},${80 + Math.floor(i / 4) * 620} q30,160 0,320 t6,300`} fill="none" stroke={w.dark} strokeWidth={3} opacity={0.22} strokeLinecap="round" />
        ))}
      </svg>
      {children}
    </AbsoluteFill>
  );
};
