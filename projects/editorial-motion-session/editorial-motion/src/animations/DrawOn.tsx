import React from 'react';
import {useEased} from './useMotion';
import {easings, dur} from '../visual-system/MotionPresets';
import {ink} from '../visual-system/IllustrationStyle';

export type DrawOnPathProps = {
  d: string;
  delay?: number;
  duration?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  opacity?: number;
};

/** E. DRAW ON — SVG path reveals progressively (hand-drawn feel). Use inside an <svg>. */
export const DrawOnPath: React.FC<DrawOnPathProps> = ({d, delay = 0, duration = dur.draw, stroke = ink.stroke, strokeWidth = ink.strokeWidth, fill = 'none', opacity = 1}) => {
  const p = useEased(delay, duration, easings.inOut);
  return (
    <path
      d={d}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
      opacity={p > 0 ? opacity : 0}
    />
  );
};
