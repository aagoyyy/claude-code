import React from 'react';
import {useCurrentFrame} from 'remotion';

export type FloatProps = {
  amplitude?: number; // px
  period?: number; // frames per cycle
  phase?: number; // frames offset
  sway?: number; // deg of tiny rotation synced to float
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** C. FLOAT — continuous subtle vertical motion. Deterministic (pure sine of frame). */
export const Float: React.FC<FloatProps> = ({amplitude = 10, period = 90, phase = 0, sway = 0, style, children}) => {
  const f = useCurrentFrame();
  const a = ((f + phase) / period) * Math.PI * 2;
  return <div style={{transform: `translateY(${Math.sin(a) * amplitude}px) rotate(${Math.sin(a + 1) * sway}deg)`, ...style}}>{children}</div>;
};
