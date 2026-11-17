import {interpolate, useCurrentFrame} from 'remotion';
import {easings} from '../visual-system/MotionPresets';

/**
 * Transitions are overlays centred on a CUT frame (`at`). The outgoing scene ends at `at`, the incoming starts at `at`.
 * `cover` runs 0 -> 1 (first half, everything hidden at `at`) -> 0 (second half).
 * `t` is 0..1 across the whole transition.
 */
export const useTransition = (at: number, duration: number) => {
  const frame = useCurrentFrame();
  const start = at - duration / 2;
  const t = interpolate(frame, [start, start + duration], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cover = interpolate(frame, [start, at, start + duration], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.inOut});
  const active = frame >= start && frame <= start + duration;
  return {t, cover, active, frame};
};
