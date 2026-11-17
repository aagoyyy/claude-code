import {easeInOutCubic, easeOutBack, lerp, clamp} from '../dynamic/math';

/**
 * ADVANCED MOTION — every major movement = anticipation (wind-up) -> action (fast, with overshoot) -> rest.
 * act(): returns 0 before `start`, dips to `back` during the wind-up, then travels to 1 with controlled overshoot `os`.
 */
export const act = (f: number, start: number, wind = 5, dur = 9, back = -0.16, os = 1.35): number => {
  if (f < start) return 0;
  if (f < start + wind) return back * easeInOutCubic((f - start) / wind);
  const u = (f - start - wind) / dur;
  return lerp(back, 1, easeOutBack(u, os));
};
/** damped oscillation (secondary motion / follow-through) */
export const dampCos = (t: number, amp: number, k: number, w: number) => (t < 0 ? 0 : amp * Math.exp(-t / k) * Math.cos(t * w));
export const dampSin = (t: number, amp: number, k: number, w: number) => (t < 0 ? 0 : amp * Math.exp(-t / k) * Math.sin(t * w));
/** shadow response to object height h (px above surface): returns {scale, opacity} */
export const shadowResponse = (h: number, max = 420) => {
  const k = 1 - clamp(h / max);
  return {scale: 0.5 + 0.5 * k, opacity: 0.18 + 0.5 * k};
};
/** top-down drop: object height h maps to scale (closer to camera = bigger) */
export const topDownScale = (h: number, max = 420, gain = 0.3) => 1 + gain * clamp(h / max);
/** smooth travel between two points with an ease (returns [x,y]) */
export const travel = (f: number, a: number, b: number, p0: [number, number], p1: [number, number]): [number, number] => {
  const u = easeInOutCubic((f - a) / (b - a));
  return [lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u)];
};
