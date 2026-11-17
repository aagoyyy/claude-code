import React from 'react';
import {useSpringProgress} from './useMotion';
import {springs} from '../visual-system/MotionPresets';

export type LabelRevealProps = {
  delay?: number;
  rotate?: number; // final rotation (deg) — labels sit slightly tilted like paper tags
  from?: 'left' | 'right' | 'bottom';
  distance?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** J. LABEL REVEAL — price tags / callouts swing & slide into place with a tiny overshoot. */
export const LabelReveal: React.FC<LabelRevealProps> = ({delay = 0, rotate = -6, from = 'left', distance = 260, style, children}) => {
  const p = useSpringProgress(delay, springs.pop);
  const dx = from === 'left' ? -1 : from === 'right' ? 1 : 0;
  const dy = from === 'bottom' ? 1 : 0;
  const off = (1 - p) * distance;
  return (
    <div style={{transform: `translate(${dx * off}px, ${dy * off}px) rotate(${rotate - (1 - p) * 14 * (dx || 1)}deg) scale(${0.85 + 0.15 * p})`, transformOrigin: '10% 50%', opacity: Math.min(1, p * 3), ...style}}>
      {children}
    </div>
  );
};
