// Joint model for the de Wiart rig (coordinates = rig space of de-wiart-rig.svg, 1080x1920).
export type JointName =
  | 'torso' | 'head' | 'armL' | 'foreL' | 'armR' | 'foreR'
  | 'thighL' | 'shinL' | 'footL' | 'thighR' | 'shinR' | 'footR';

export type Pose = Partial<Record<JointName, number>> & {dx?: number; dy?: number; br?: number; blink?: number};

export const PIVOT: Record<JointName | 'root', [number, number]> = {
  root: [505, 1040], torso: [505, 1030], head: [500, 675],
  armL: [352, 738], foreL: [335, 890], armR: [650, 738], foreR: [673, 892],
  thighL: [437, 1040], shinL: [448, 1340], footL: [452, 1600],
  thighR: [587, 1040], shinR: [600, 1320], footR: [610, 1560],
};

// parent chain (root first)
export const CHAIN: Record<string, (JointName | 'root')[]> = {
  torso: ['root', 'torso'], head: ['root', 'torso', 'head'],
  armL: ['root', 'torso', 'armL'], foreL: ['root', 'torso', 'armL', 'foreL'],
  armR: ['root', 'torso', 'armR'], foreR: ['root', 'torso', 'armR', 'foreR'],
  thighL: ['root', 'thighL'], shinL: ['root', 'thighL', 'shinL'], footL: ['root', 'thighL', 'shinL', 'footL'],
  thighR: ['root', 'thighR'], shinR: ['root', 'thighR', 'shinR'], footR: ['root', 'thighR', 'shinR', 'footR'],
};

export type RigTransforms = Record<JointName | 'root' | 'blink', string>;

const f = (n: number) => +n.toFixed(3);

export function transforms(p: Pose): RigTransforms {
  const t: any = {};
  (Object.keys(PIVOT) as (JointName | 'root')[]).forEach((k) => {
    const [cx, cy] = PIVOT[k];
    const a = (p as any)[k] || 0;
    if (k === 'root') t[k] = `translate(${f(p.dx || 0)} ${f(p.dy || 0)})`;
    else if (k === 'torso')
      t[k] = `rotate(${f(a)} ${cx} ${cy}) translate(${cx} ${cy}) scale(1 ${f(p.br || 1)}) translate(${-cx} ${-cy})`;
    else t[k] = `rotate(${f(a)} ${cx} ${cy})`;
  });
  const b = p.blink === undefined ? 1 : p.blink;
  t.blink = `translate(474 565) scale(1 ${f(b)}) translate(-474 -565)`;
  return t;
}

// ---- 2D affine helpers, to attach UI (hotspots) to joints without the DOM
type M = [number, number, number, number, number, number];
const mul = (a: M, b: M): M => [
  a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5],
];
const T = (x: number, y: number): M => [1, 0, 0, 1, x, y];
const R = (deg: number): M => {
  const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  return [c, s, -s, c, 0, 0];
};
const S = (sx: number, sy: number): M => [sx, 0, 0, sy, 0, 0];

function jointMatrix(k: JointName | 'root', p: Pose): M {
  const [cx, cy] = PIVOT[k];
  const a = (p as any)[k] || 0;
  if (k === 'root') return T(p.dx || 0, p.dy || 0);
  let m = mul(T(cx, cy), R(a));
  if (k === 'torso') m = mul(m, S(1, p.br || 1));
  return mul(m, T(-cx, -cy));
}

/** rig-space position of local point (x,y) of `part` under pose p */
export function attach(part: string, x: number, y: number, p: Pose): [number, number] {
  let m: M = [1, 0, 0, 1, 0, 0];
  CHAIN[part].forEach((j) => (m = mul(m, jointMatrix(j, p))));
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

// ---- tiny keyframe helper (ease in/out)
export function kf(t: number, pts: [number, number][], ease = true): number {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i][0]) {
      const [t0, v0] = pts[i - 1], [t1, v1] = pts[i];
      let u = (t - t0) / (t1 - t0);
      if (ease) u = u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);
      return v0 + (v1 - v0) * u;
    }
  }
  return pts[pts.length - 1][1];
}
