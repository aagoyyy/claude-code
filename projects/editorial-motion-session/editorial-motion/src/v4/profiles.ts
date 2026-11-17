import {spring, interpolate, Easing} from 'remotion';

/**
 * MOTION PROFILES (V4) — each object category moves differently. All deterministic, frame based.
 * Timings are authored in SECONDS and converted with the composition fps (demo runs at 24 fps).
 *
 *  hand    : articulated, no bounce. Wind-up -> fast travel -> settle. Critically damped.
 *  food    : soft & organic. Low stiffness, visible jelly wobble, long settle.
 *  coin    : snappy & playful. High stiffness, low damping, 2-3 bounces.
 *  label   : fast pop, one small overshoot, controlled settle (price tags / callouts).
 *  type    : precise. Ease-out cubic, ZERO overshoot, readable immediately.
 *  bg      : subtle / static. Very slow linear drift.
 *  camera  : smooth & purposeful. In-out bezier, no spring.
 */
export type Category = 'hand' | 'food' | 'coin' | 'label' | 'type' | 'bg' | 'camera';

export const springCfg: Record<Exclude<Category, 'type' | 'bg' | 'camera'>, {damping: number; stiffness: number; mass: number}> = {
  hand: {damping: 30, stiffness: 140, mass: 1},
  food: {damping: 8, stiffness: 85, mass: 1.15},
  coin: {damping: 6.5, stiffness: 300, mass: 0.5},
  label: {damping: 13, stiffness: 340, mass: 0.6},
};

export const ease = {
  hand: Easing.bezier(0.45, 0, 0.2, 1),
  type: Easing.bezier(0.16, 1, 0.3, 1),
  camera: Easing.bezier(0.65, 0, 0.35, 1),
  bg: Easing.linear,
  food: Easing.bezier(0.3, 0.7, 0.4, 1),
};

/** progress 0..1 (may overshoot for spring categories) of `cat` at frame f starting at frame `start` */
export const progress = (cat: Category, f: number, start: number, fps: number, durFrames = 12): number => {
  if (f < start) return 0;
  if (cat === 'type') return interpolate(f, [start, start + durFrames], [0, 1], {extrapolateRight: 'clamp', easing: ease.type});
  if (cat === 'bg') return interpolate(f, [start, start + durFrames * 6], [0, 1], {extrapolateRight: 'clamp'});
  if (cat === 'camera') return interpolate(f, [start, start + durFrames], [0, 1], {extrapolateRight: 'clamp', easing: ease.camera});
  return spring({frame: f - start, fps, config: springCfg[cat]});
};

/** secondary motion for a category after an impact at `at` (returns signed offset 0..~amp) */
export const wobble = (cat: 'food' | 'coin' | 'label' | 'hand', f: number, at: number, amp = 1): number => {
  const t = f - at;
  if (t < 0) return 0;
  const p = {food: {k: 9, w: 0.55}, coin: {k: 4, w: 1.15}, label: {k: 6, w: 0.9}, hand: {k: 5, w: 0.5}}[cat];
  return amp * Math.exp(-t / p.k) * Math.cos(t * p.w);
};

export const sec = (s: number, fps: number) => Math.round(s * fps);
