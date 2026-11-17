import {Easing} from 'remotion';

/** Spring presets (Remotion spring config). All deterministic, all editorial: low bounce. */
export const springs = {
  pop: {damping: 11, stiffness: 190, mass: 0.7}, // slight overshoot, fast settle
  soft: {damping: 20, stiffness: 120, mass: 0.9}, // no visible overshoot
  slide: {damping: 16, stiffness: 140, mass: 0.8},
  settle: {damping: 14, stiffness: 100, mass: 1},
} as const;

/** Bezier easings (use with interpolate({easing})). */
export const easings = {
  out: Easing.bezier(0.22, 1, 0.36, 1), // decelerate (entrances)
  inOut: Easing.bezier(0.65, 0, 0.35, 1), // camera moves
  in: Easing.bezier(0.5, 0, 0.9, 0.4), // exits
  linear: Easing.linear,
} as const;

/** Standard durations in frames @30fps */
export const dur = {
  pop: 14,
  slide: 18,
  reveal: 20,
  exit: 12,
  camera: 40,
  transition: 16,
  draw: 24,
} as const;

export const stagger = {tight: 3, normal: 5, loose: 8} as const;

export type Direction = 'left' | 'right' | 'top' | 'bottom';
