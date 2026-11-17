import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {easings, springs, Direction} from '../visual-system/MotionPresets';

type SpringCfg = {damping: number; stiffness: number; mass: number};

/** 0 -> 1 spring progress starting at `delay` (frames, relative to the enclosing Sequence). */
export const useSpringProgress = (delay = 0, config: SpringCfg = springs.pop): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config});
};

/** 0 -> 1 eased linear-time progress over [delay, delay+duration]. */
export const useEased = (delay: number, duration: number, easing: (t: number) => number = easings.out): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
};

export const dirVector = (d: Direction): [number, number] =>
  d === 'left' ? [-1, 0] : d === 'right' ? [1, 0] : d === 'top' ? [0, -1] : [0, 1];
