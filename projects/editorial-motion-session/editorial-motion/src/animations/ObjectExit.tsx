import React from 'react';
import {useEased, dirVector} from './useMotion';
import {easings, dur} from '../visual-system/MotionPresets';
import type {Direction} from '../visual-system/MotionPresets';

export type ObjectExitProps = {
  at: number; // frame the exit starts
  duration?: number;
  mode?: 'slide' | 'scale' | 'fade';
  to?: Direction;
  distance?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** H. OBJECT EXIT — smooth slide, scale-down or fade out. */
export const ObjectExit: React.FC<ObjectExitProps> = ({at, duration = dur.exit, mode = 'slide', to = 'right', distance = 900, style, children}) => {
  const p = useEased(at, duration, easings.in);
  const [dx, dy] = dirVector(to);
  const t =
    mode === 'slide' ? `translate(${dx * distance * p}px, ${dy * distance * p}px)` : mode === 'scale' ? `scale(${1 - 0.7 * p})` : 'none';
  return <div style={{transform: t, opacity: mode === 'slide' ? 1 - p * 0.2 : 1 - p, ...style}}>{children}</div>;
};
