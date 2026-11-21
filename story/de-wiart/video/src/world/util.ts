export const W = 1920, H = 1080;
export const mulberry32 = (a: number) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeOutBack = (t: number) => { const c1 = 1.70158, c3 = c1 + 1, x = clamp(t) - 1; return 1 + c3 * x * x * x + c1 * x * x; };

const hex = (c: string) => { if (c.length === 4) c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3]; return [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); };
export const mix = (c1: string, c2: string, t: number) => {
  const a = hex(c1), b = hex(c2);
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], t)).toString(16).padStart(2, '0')).join('');
};

export type Cam = { x: number; y: number; zoom: number; px?: number; py?: number };
/** parallax: each layer moves/zooms by its depth factor (far ~0, character plane = 1, foreground > 1) */
export const camT = (cam: Cam, depth: number) =>
  `translate(${cam.px ?? 960} ${cam.py ?? 640}) scale(${(1 + (cam.zoom - 1) * depth).toFixed(5)}) translate(${-(cam.px ?? 960)} ${-(cam.py ?? 640)}) translate(${(-cam.x * depth).toFixed(2)} ${(-cam.y * depth).toFixed(2)})`;

export function ridge(seed: number, base: number, amp: number, freq = [0.0035, 0.009, 0.021], x0 = -600, x1 = 2520, step = 12) {
  const r = mulberry32(seed), ph = freq.map(() => r() * 6.283);
  let top = '';
  for (let x = x0; x <= x1; x += step) {
    let s = 0;
    freq.forEach((f, i) => (s += Math.sin(x * f + ph[i]) / (i + 1)));
    top += (x === x0 ? 'M' : 'L') + x + ' ' + (base - (amp * s) / 1.6).toFixed(1);
  }
  return { top, fill: top + `L${x1} 1500 L${x0} 1500 Z` };
}

/** where a point of a layer ends up on screen (mirror of camT) */
export const camXY = (cam: Cam, depth: number, x: number, y: number): [number, number] => {
  const px = cam.px ?? 960, py = cam.py ?? 640, z = 1 + (cam.zoom - 1) * depth;
  return [px + (x - cam.x * depth - px) * z, py + (y - cam.y * depth - py) * z];
};
