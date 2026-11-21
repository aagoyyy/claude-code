import React from 'react';
import {clock} from '../rig/clock';
import {blinkNow, idlePose, runPose, SideOpts, SidePose, walkPose} from '../rig/Side';
import {Fig} from './lib';

/** Choreographed characters: a path in time, foot-locked gait from the distance travelled, and timed actions. */
export type Path = [number, number, number][];                    // [t seconds, x, y] — feet position on screen
export type ActFn = (u: number, t: number) => Partial<SidePose>;  // u 0..1 over the act, t seconds since act start
export type Act = {t0: number; t1: number; fn: ActFn; ease?: number; face?: 'left' | 'right'};
const sm = (u: number) => u * u * (3 - 2 * u);
const posAt = (path: Path, t: number, linear = false): [number, number] => {
  if (t <= path[0][0]) return [path[0][1], path[0][2]];
  for (let i = 1; i < path.length; i++) if (t <= path[i][0]) { const [t0, x0, y0] = path[i - 1], [t1, x1, y1] = path[i]; const r = (t - t0) / Math.max(1e-6, t1 - t0), u = linear ? r : sm(r); return [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u]; }
  const l = path[path.length - 1]; return [l[1], l[2]];
};
const distAt = (path: Path, t: number, lin = false) => { let d = 0, prev = posAt(path, 0, lin); const n = Math.max(2, Math.ceil(t * 40)); for (let i = 1; i <= n; i++) { const p = posAt(path, (t * i) / n, lin); d += Math.hypot(p[0] - prev[0], p[1] - prev[1]); prev = p; } return d; };
const blend = (a: SidePose, b: Partial<SidePose>, k: number): SidePose => {
  const out: any = {...a};
  for (const key of Object.keys(b) as (keyof SidePose)[]) {
    const bv: any = b[key], av: any = (a as any)[key];
    if (typeof bv === 'number') out[key] = (typeof av === 'number' ? av : key === 'br' ? 1 : 0) * (1 - k) + bv * k;
    else if (k > 0.5) out[key] = bv;
  }
  return out;
};


const LEG = new Set(['thN', 'shN', 'ftN', 'thF', 'shF', 'ftF', 'phase', 'vx', 'dx', 'dy', 'blink']);
const hs = (id: string) => { let h = 7; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return h; };
/** procedural life for a standing/seated figure with a static pose: gestures while talking, shifting, nodding. */
const life = (id: string, p: any): any => {
  const t = clock.t, h = hs(id), ph = (h % 628) / 100, r = 0.8 + ((h >> 5) % 50) / 100;
  const out = {...p};
  const talking = (p.mouth ?? 0) > 0.12;
  const arm = p.uaN !== undefined && p.handN !== 'grip';
  const sit = p.thN !== undefined && p.thN < -40;
  const amp = p.handN === 'point' ? 1.6 : p.brow < -0.5 ? 1.4 : talking || p.mouth > 0.12 ? 1 : 0.35;
  if (arm) {
    const beat = Math.sin(t * 2.1 * r + ph) * 0.6 + Math.sin(t * 4.3 * r + ph * 2) * 0.4;
    out.uaN = p.uaN + 15 * amp * beat;
    out.faN = (p.faN ?? -30) + 22 * amp * Math.sin(t * 3.1 * r + ph);
    if (p.uaF !== undefined) { out.uaF = p.uaF + 8 * amp * Math.sin(t * 1.7 * r + ph + 1); out.faF = (p.faF ?? -30) + 10 * amp * Math.sin(t * 2.3 * r + ph); }
  }
  out.head = (p.head ?? 0) + (talking ? 3.5 : 1.6) * Math.sin(t * 1.6 * r + ph) + (talking ? 2 * Math.sin(t * 4.1 + ph) : 0);
  out.torso = (p.torso ?? 0) + (sit ? 0.8 : 1.4) * Math.sin(t * 0.9 * r + ph);
  if (talking) out.mouth = 0.12 + 0.55 * Math.abs(Math.sin(t * 8.2 * r + ph)) * (0.5 + 0.5 * Math.abs(Math.sin(t * 1.1 + ph)));
  return out;
};

export const Actor: React.FC<{id: string; x: number; y: number; s?: number; o: SideOpts; path?: Path; acts?: Act[]; base?: any; light?: any; lit?: number; lo?: boolean; sit?: boolean; seed?: number; go?: 'walk' | 'run'; pace?: number}> = ({id, x, y, s = 0.55, o, path, acts = [], base, light = 'warm', lit = 1, lo, seed = 0, go, pace = 1}) => {
  const t = clock.t;
  let linear = false;
  if (go && !path) { const dir = (o.face || 'right') === 'right' ? 1 : -1, v = (go === 'run' ? 1150 : 500) * s * pace, T = clock.dur || 5, D = v * T; path = [[0, x - dir * D / 2, y], [T, x + dir * D / 2, y]]; linear = true; }
  const [px, py] = path ? posAt(path, t, linear) : [x, y];
  const [qx] = path ? posAt(path, t + 0.06, linear) : [x];
  const [rx] = path ? posAt(path, Math.max(0, t - 0.06), linear) : [x];
  const vx = path ? (qx - rx) / (0.06 + Math.min(0.06, t)) : 0, vy = 0;
  const speed = Math.abs(vx);
  const walkV = 560 * s;                                   // px/s of an ordinary walk at this scale
  let face = o.face || 'right';
  if (speed > 12) face = vx > 0 ? 'right' : 'left';
  let pose: SidePose;
  const saved = clock.t;
  if (speed > 12) {
    const run = speed > walkV * 1.5, dist = distAt(path!, t, linear), cyc = (run ? 1720 : 1180) * s;
    clock.t = 0; pose = run ? runPose((dist / cyc) * Math.PI * 2) : walkPose((dist / cyc) * Math.PI * 2, 0.95); clock.t = saved;
    delete (pose as any).vx; (pose as any).blink = blinkNow(seed);
    if (base) for (const k of Object.keys(base)) if (!LEG.has(k) && base[k] !== undefined) (pose as any)[k] = base[k];
  } else {
    pose = {...idlePose(seed + 0.3 * (id.length % 7)), ...(base || {})};
    if (base && !acts.length) pose = life(id, pose);
  }
  for (const a of acts) {
    if (t < a.t0 || t > a.t1) continue;
    const e = a.ease ?? 0.3, k = Math.min(sm(Math.min(1, (t - a.t0) / e)), sm(Math.min(1, (a.t1 - t) / e)));
    pose = blend(pose, a.fn((t - a.t0) / Math.max(1e-6, a.t1 - a.t0), t - a.t0), k);
    if (a.face) face = a.face;
  }
  void vy;
  return <Fig id={id} x={px} y={py} s={s} o={{...o, face}} p={pose} light={light} lit={lit} lo={lo} />;
};

/* ---- action library: each returns a pose fragment (u 0..1, t seconds) ---- */
const w = (t: number, f: number) => Math.abs(Math.sin(t * f));
export const A = {
  talk: (amt = 1): ActFn => (u, t) => ({mouth: (0.12 + 0.5 * w(t, 8.5)) * amt, brow: 0.1 + 0.15 * Math.sin(t * 1.7), uaN: -44 - 14 * Math.sin(t * 3.1) * amt, faN: -64 + 16 * Math.sin(t * 2.3) * amt, handN: 'open', head: 2.5 * Math.sin(t * 2.1)}),
  argue: (): ActFn => (u, t) => ({mouth: 0.15 + 0.55 * w(t, 9.5), brow: -0.9, grimace: 0.7, squint: 0.3, uaN: -70 - 30 * w(t, 3.4), faN: -40 + 25 * Math.sin(t * 6), handN: 'point', torso: -3 + 2 * Math.sin(t * 5), head: 3 * Math.sin(t * 4)}),
  point: (): ActFn => (u, t) => ({uaN: -82, faN: -4, handN: 'point', mouth: 0.2 + 0.3 * w(t, 8), brow: 0.2}),
  wave: (): ActFn => (u, t) => ({uaN: -152 + 8 * Math.sin(t * 9), faN: -22 + 28 * Math.sin(t * 9), handN: 'open', smile: 0.9, mouth: 0.15}),
  laugh: (): ActFn => (u, t) => ({smile: 1, mouth: 0.3 + 0.3 * w(t, 11), squint: 0.7, head: -6 + 3 * Math.sin(t * 11), torso: -3 + 2 * Math.sin(t * 11)}),
  smile: (): ActFn => () => ({smile: 1, squint: 0.2}),
  surprise: (): ActFn => (u) => ({brow: 1, wide: 1, mouth: 0.7, head: -5, uaN: -120 * Math.min(1, u * 4), faN: -30, handN: 'open'}),
  yawn: (): ActFn => (u, t) => ({mouth: 1.15 * Math.min(1, u * 3) * Math.min(1, (1 - u) * 3 + 0.3), squint: 1, brow: 0.3, head: -9 * Math.min(1, u * 3), uaN: -168 * Math.min(1, u * 2.5), faN: -6, uaF: -160 * Math.min(1, u * 2.5), faF: -10, handN: 'open', handF: 'open', torso: -4 * Math.min(1, u * 3)}),
  sit: (): ActFn => (u) => ({thN: -88, shN: 88, ftN: 0, thF: -84, shF: 90, ftF: 0, dy: 300, torso: -2, uaN: 18, faN: -64, uaF: 12, faF: -58}),
  hand: (): ActFn => (u, t) => ({uaN: -150 * Math.min(1, u * 3), faN: -20, handN: 'open', smile: 0.5, mouth: 0.1}),
  cross: (): ActFn => (u, t) => ({uaN: -34, faN: -118, uaF: -30, faF: -112, handN: 'relaxed', handF: 'relaxed', squint: 0.4, brow: -0.2}),
  fall: (dir = -1): ActFn => (u) => ({fall: dir * (0.99 * sm(Math.min(1, u * 1.4))), head: 14 * Math.min(1, u * 2), brow: 0.8, wide: 0.7, mouth: 0.5}),
  press: (): ActFn => (u, t) => ({uaN: -72 * Math.min(1, u * 2.2), faN: -22, handN: 'open', brow: 0.6, wide: 0.6, smile: 0.25}),
  kick: (): ActFn => (u) => ({thN: 38 * Math.sin(Math.min(1, u) * Math.PI * 0.9) - 6, shN: 20 * Math.sin(Math.min(1, u) * Math.PI), torso: 6 * Math.sin(u * 3), uaN: -30, uaF: 30}),
  throwA: (): ActFn => (u) => ({uaN: u < 0.5 ? -170 + 0 * u : -170 + 330 * sm((u - 0.5) * 2) - 160 * 0, faN: u < 0.5 ? -80 : -10, handN: 'open', torso: -8 * Math.sin(u * 3.14), head: 5, mouth: 0.1}),
  look: (deg: number): ActFn => () => ({head: deg}),
  shake: (): ActFn => (u, t) => ({head: 16 * Math.sin(t * 10), mouth: 0.15, brow: -0.2, grimace: 0.4}),
};
