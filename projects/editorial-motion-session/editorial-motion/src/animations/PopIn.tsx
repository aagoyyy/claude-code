import React from 'react';
import {useSpringProgress} from './useMotion';
import {springs} from '../visual-system/MotionPresets';

export type PopInProps = {
  delay?: number;
  from?: number; // starting scale
  rotate?: number; // starting rotation (deg) that settles to 0
  config?: {damping: number; stiffness: number; mass: number};
  origin?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** A. POP IN — scale up with slight overshoot, then settle. */
export const PopIn: React.FC<PopInProps> = ({delay = 0, from = 0.5, rotate = 0, config = springs.pop, origin = '50% 60%', style, children}) => {
  const p = useSpringProgress(delay, config);
  const s = from + (1 - from) * p;
  const opacity = Math.min(1, p * 4);
  return (
    <div style={{transform: `scale(${s}) rotate(${rotate * (1 - p)}deg)`, transformOrigin: origin, opacity, ...style}}>
      {children}
    </div>
  );
};
