import React from 'react';
import {useSpringProgress} from './useMotion';
import {springs} from '../visual-system/MotionPresets';

export type ScaleRevealProps = {delay?: number; from?: number; to?: number; origin?: string; style?: React.CSSProperties; children: React.ReactNode};

/** F. SCALE REVEAL — grows into focus (no overshoot) combined with opacity. */
export const ScaleReveal: React.FC<ScaleRevealProps> = ({delay = 0, from = 0.82, to = 1, origin = '50% 50%', style, children}) => {
  const p = useSpringProgress(delay, springs.soft);
  return <div style={{transform: `scale(${from + (to - from) * p})`, transformOrigin: origin, opacity: Math.min(1, p * 2.2), ...style}}>{children}</div>;
};
