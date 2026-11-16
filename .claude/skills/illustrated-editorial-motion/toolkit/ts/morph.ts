/** Vector morph engine: closed shapes resampled to N points (clockwise from top-centre) so any two shapes interpolate point-by-point. */
export type Pt = [number, number];
export const N = 320;

export const resample = (pts: Pt[], n = N): Pt[] => {
  const p = [...pts, pts[0]];
  const cum: number[] = [0];
  for (let i = 1; i < p.length; i++) cum.push(cum[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  const total = cum[cum.length - 1];
  const out: Pt[] = [];
  let j = 1;
  for (let k = 0; k < n; k++) {
    const d = (k / n) * total;
    while (j < cum.length - 1 && cum[j] < d) j++;
    const seg = cum[j] - cum[j - 1] || 1;
    const u = (d - cum[j - 1]) / seg;
    out.push([p[j - 1][0] + (p[j][0] - p[j - 1][0]) * u, p[j - 1][1] + (p[j][1] - p[j - 1][1]) * u]);
  }
  return out;
};

export const lerpPts = (a: Pt[], b: Pt[], t: number): Pt[] => a.map((p, i) => [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t] as Pt);

/** smooth closed path through midpoints (quadratic), keeps zig-zag teeth readable at N=320 */
export const toPath = (p: Pt[]): string => {
  const n = p.length;
  const f = (v: number) => v.toFixed(1);
  const mid = (a: Pt, b: Pt) => `${f((a[0] + b[0]) / 2)},${f((a[1] + b[1]) / 2)}`;
  let d = `M${mid(p[n - 1], p[0])}`;
  for (let i = 0; i < n; i++) d += `Q${f(p[i][0])},${f(p[i][1])} ${mid(p[i], p[(i + 1) % n])}`;
  return d + 'Z';
};

/* ---------- shape builders (all start at top-centre, go clockwise on screen) ---------- */
const tri = (x: number) => Math.abs(((x % 2) + 2) % 2 - 1); // triangle wave 0..1

export const roundRect = (w: number, h: number, r: number, cy = 0): Pt[] => {
  const pts: Pt[] = [[0, cy - h / 2]];
  const arc = (cx: number, cyy: number, a0: number) => { for (let i = 0; i <= 10; i++) { const a = a0 + (i / 10) * (Math.PI / 2); pts.push([cx + r * Math.cos(a), cyy + r * Math.sin(a)]); } };
  arc(w / 2 - r, cy - h / 2 + r, -Math.PI / 2);
  arc(w / 2 - r, cy + h / 2 - r, 0);
  arc(-w / 2 + r, cy + h / 2 - r, Math.PI / 2);
  arc(-w / 2 + r, cy - h / 2 + r, Math.PI);
  return resample(pts);
};
export const ellipse = (rx: number, ry: number, cy = 0): Pt[] => {
  const pts: Pt[] = [];
  for (let i = 0; i < 200; i++) { const a = -Math.PI / 2 + (i / 200) * Math.PI * 2; pts.push([rx * Math.cos(a), cy + ry * Math.sin(a)]); }
  return resample(pts);
};

/** instant-noodle packet: pillow sides, crimped top & bottom. local origin = centre; spans y -380..380, x -280..280 */
export const packet = (torn = false): Pt[] => {
  const W = 280, T = -380, Bm = 380, bulge = 16;
  const topY = (x: number) => (torn ? -310 + 22 * tri(x / 34) + 6 * Math.sin(x * 0.21) : T + 15 * tri(x / 18));
  const botY = (x: number) => Bm - 15 * tri(x / 18);
  const pts: Pt[] = [];
  for (let x = 0; x <= W; x += 6) pts.push([x, topY(x)]);
  for (let y = T + 10; y <= Bm - 10; y += 30) pts.push([W + bulge * Math.sin((Math.PI * (y - T)) / (Bm - T)) + (torn && y < -250 ? -6 : 0), y]);
  for (let x = W; x >= -W; x -= 6) pts.push([x, botY(x)]);
  for (let y = Bm - 10; y >= T + 10; y -= 30) pts.push([-W - bulge * Math.sin((Math.PI * (y - T)) / (Bm - T)) - (torn && y < -250 ? -6 : 0), y]);
  for (let x = -W; x < 0; x += 6) pts.push([x, topY(x)]);
  return resample(pts);
};
/** the crimped strip that tears off (separate piece) */
export const strip = (): Pt[] => {
  const W = 280, pts: Pt[] = [];
  for (let x = -W; x <= W; x += 6) pts.push([x, -380 + 15 * tri(x / 18)]);
  for (let x = W; x >= -W; x -= 6) pts.push([x, -310 + 22 * tri(x / 34) + 6 * Math.sin(x * 0.21)]);
  return pts;
};

/** ramen bowl, side view. rim at y=-80, foot at y=380 (same ground line as the packet) */
export const bowl = (): Pt[] => {
  const bez = (p0: Pt, c1: Pt, c2: Pt, p3: Pt, n = 36): Pt[] => Array.from({length: n + 1}, (_, i) => { const t = i / n, u = 1 - t; return [u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p3[1]] as Pt; });
  const right = bez([410, -80], [410, 150], [330, 300], [175, 312]);
  const foot: Pt[] = [[160, 318], [150, 372], [120, 384], [-120, 384], [-150, 372], [-160, 318]];
  const left = right.map((p) => [-p[0], p[1]] as Pt).reverse();
  return resample([[0, -80], ...right, ...foot, ...left]);
};

/* ---------- colour helpers ---------- */
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (a: string, b: string, t: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; };
