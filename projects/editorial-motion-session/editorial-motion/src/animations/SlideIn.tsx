import React from 'react';
import {useSpringProgress, dirVector} from './useMotion';
import {springs, Direction} from '../visual-system/MotionPresets';

export type SlideInProps = {
  delay?: number;
  from?: Direction; // side it enters from
  distance?: number; // px
  overshoot?: boolean; // true: spring w/ light overshoot, false: critically damped
  fade?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** B. SLIDE IN — enters from a side, decelerates, optional slight overshoot. */
export const SlideIn: React.FC<SlideInProps> = ({delay = 0, from = 'left', distance = 420, overshoot = false, fade = true, style, children}) => {
  const p = useSpringProgress(delay, overshoot ? springs.slide : springs.soft);
  const [dx, dy] = dirVector(from);
  const o = (1 - p) * distance;
  return (
    <div style={{transform: `translate(${dx * o}px, ${dy * o}px)`, opacity: fade ? Math.min(1, p * 3) : 1, ...style}}>{children}</div>
  );
};
