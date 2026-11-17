import {clamp} from './math';

export type DropState = {
  /** height above ground (px, >= 0) */
  y: number;
  /** vertical velocity (px/frame, positive = downward) */
  vy: number;
  /** squash amount (-stretch .. +squash), ready for sx/sy */
  squash: number;
  /** frames since the last impact (large if none) */
  sinceImpact: number;
  landed: boolean;
};

/**
 * Deterministic ball drop with restitution. `h` start height above ground, `g` gravity px/frame^2.
 * Returns position + squash & stretch (stretch while falling fast, squash right after impacts).
 */
export const dropBounce = (frame: number, start: number, h: number, g = 1.6, e = 0.36): DropState => {
  let t = frame - start;
  if (t < 0) return {y: h, vy: 0, squash: 0, sinceImpact: 999, landed: false};
  let hh = h;
  const tf = Math.sqrt((2 * hh) / g);
  if (t < tf) {
    const vy = g * t;
    return {y: hh - 0.5 * g * t * t, vy, squash: -clamp(vy / 40) * 0.12, sinceImpact: 999, landed: false};
  }
  t -= tf;
  let impactSpeed = g * tf;
  for (let i = 0; i < 6; i++) {
    const v = impactSpeed * e;
    const up = (2 * v) / g;
    const ts = t;
    const imp = clamp(impactSpeed / 28) * 0.26 * Math.exp(-ts / 4.2) * Math.cos(ts * 0.9 + 0.0);
    if (v < 1.2) return {y: 0, vy: 0, squash: imp, sinceImpact: ts, landed: true};
    if (t < up) {
      const y = v * t - 0.5 * g * t * t;
      const vy = -(v - g * t);
      return {y, vy, squash: Math.max(imp, 0) * 0.6 - clamp(Math.abs(vy) / 40) * 0.08, sinceImpact: ts, landed: false};
    }
    t -= up;
    impactSpeed = v;
    hh = hh * e * e;
  }
  return {y: 0, vy: 0, squash: 0, sinceImpact: 999, landed: true};
};

/** scale factors from squash value s (volume-preserving-ish) */
export const squashScale = (s: number) => ({sx: 1 + s * 0.65, sy: 1 - s});

/** decaying oscillation: amp * exp(-k t) * cos(w t) for t >= 0 */
export const dampedSwing = (t: number, amp: number, k: number, w: number) => (t < 0 ? 0 : amp * Math.exp(-k * t) * Math.cos(w * t));
