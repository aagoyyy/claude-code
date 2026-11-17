import React from 'react';
import {derived} from '../visual-system/ColorPalette';
import {lerp} from '../dynamic/math';

/**
 * HUMAN INTERACTION LIBRARY — 2D hand (back-of-hand view, fingers point toward -x) + rolled sleeve.
 * One merged silhouette: all parts are outlined in a single dark pass, then filled with skin (no inner joint lines).
 * Pose = finger curl (0 straight .. 1 curled) + thumb angle + `meet` (0..1: thumb tip solved by IK onto the index tip = pinch).
 */
export type HandPose = {curl: [number, number, number, number]; thumb: number; meet?: number; tb?: number};
export const POSES: Record<string, HandPose> = {
  open: {curl: [0.05, 0.08, 0.12, 0.2], thumb: -0.45},
  pinch: {curl: [0.32, 1, 1, 1], thumb: 0.6, meet: 1, tb: 1},
  hold: {curl: [0.55, 0.62, 0.68, 0.76], thumb: 0.85},
  grip: {curl: [0.72, 0.8, 0.86, 0.92], thumb: 1.05},
  point: {curl: [0, 1, 1, 1], thumb: 0.5},
  present: {curl: [0.1, 0.14, 0.2, 0.26], thumb: -0.3},
  pour: {curl: [0.6, 0.66, 0.74, 0.82], thumb: 0.8},
};
export const blendPose = (a: HandPose, b: HandPose, t: number): HandPose => ({
  curl: a.curl.map((c, i) => lerp(c, b.curl[i], t)) as HandPose['curl'],
  thumb: lerp(a.thumb, b.thumb, t),
  meet: lerp(a.meet ?? 0, b.meet ?? 0, t),
  tb: lerp(a.tb ?? 0, b.tb ?? 0, t),
});

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
type P = [number, number];
const BASE: P[] = [[-86, -16], [-90, 6], [-90, 26], [-84, 44]];
const LEN = [[58, 42, 32], [64, 46, 34], [58, 42, 31], [46, 34, 26]];
const W0 = [30, 31, 29, 25];
const W1 = [22, 23, 21, 18];
const TB_TOP: P = [-74, -26];
const TB_BOT: P = [-64, 30];
const TL = [64, 50];

const chain = (base: P, lens: number[], c: number, k = 0.55): P[] => {
  let [x, y] = base;
  const pts: P[] = [[x, y]];
  lens.forEach((L, i) => { const th = Math.PI - c * k * (i + 1); x += Math.cos(th) * L; y += Math.sin(th) * L; pts.push([x, y]); });
  return pts;
};
const ik2 = (base: P, L1: number, L2: number, target: P): P[] => {
  const dx = target[0] - base[0], dy = target[1] - base[1];
  const d = Math.min(Math.hypot(dx, dy), L1 + L2 - 0.01);
  const a = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const th1 = Math.atan2(dy, dx) + a * 0.7; // elbow bows downward (outer side of the pincer)
  const e: P = [base[0] + L1 * Math.cos(th1), base[1] + L1 * Math.sin(th1)];
  const th2 = Math.atan2(target[1] - e[1], target[0] - e[0]);
  return [base, e, [e[0] + L2 * Math.cos(th2), e[1] + L2 * Math.sin(th2)]];
};
const thumbChain = (pose: HandPose, indexTip: P): P[] => {
  const tbk = pose.tb ?? 0;
  const TB: P = [lerp(TB_TOP[0], TB_BOT[0], tbk), lerp(TB_TOP[1], TB_BOT[1], tbk)];
  const free = chain(TB, TL, pose.thumb, 0.55);
  const m = pose.meet ?? 0;
  if (m <= 0) return free;
  const solved = ik2(TB, TL[0], TL[1], indexTip);
  return free.map((p, i) => [lerp(p[0], solved[i][0], m), lerp(p[1], solved[i][1], m)] as P);
};

/** smooth tapered limb outline around a centre polyline (round tip) */
const limb = (pts: P[], w0: number, w1: number): string => {
  // sample with Catmull-Rom
  const S: P[] = [];
  const n = pts.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
    for (let t = 0; t < 1; t += 0.2) {
      const t2 = t * t, t3 = t2 * t;
      S.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3), 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
    }
  }
  S.push(pts[n - 1]);
  const L: P[] = [], R: P[] = [];
  S.forEach((p, i) => {
    const a = S[Math.max(0, i - 1)], b = S[Math.min(S.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
    const u = i / (S.length - 1);
    const w = lerp(w0, w1, u) / 2;
    L.push([p[0] - ty * w, p[1] + tx * w]);
    R.push([p[0] + ty * w, p[1] - tx * w]);
  });
  const tip = S[S.length - 1], prev = S[S.length - 2];
  const ang = Math.atan2(tip[1] - prev[1], tip[0] - prev[0]);
  const rw = w1 / 2;
  const cap: P[] = [];
  for (let k = 1; k < 8; k++) { const a = ang - Math.PI / 2 + (Math.PI * k) / 8; cap.push([tip[0] + Math.cos(a) * rw, tip[1] + Math.sin(a) * rw]); }
  // order: L side along, cap around tip (from L to R), R side back
  const poly = [...L, ...cap.reverse(), ...R.reverse()];
  return 'M' + poly.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z';
};

const PALM = 'M-94,-42 C-62,-56 -12,-58 16,-50 L76,-36 L76,44 L16,58 C-22,68 -66,64 -98,50 C-108,16 -106,-12 -94,-42Z';

/** world position of the index fingertip for a pose (local space) */
export const indexTip = (pose: HandPose): P => { const c = chain(BASE[0], LEN[0], pose.curl[0]); return c[c.length - 1]; };
export const PINCH_TIP: P = indexTip(POSES.pinch);
export const GRIP: P = [-140, 34];

export const handTip = (x: number, y: number, s: number, rot = 0, mirror = false, local: P = PINCH_TIP): [number, number] => {
  const lx = (mirror ? -local[0] : local[0]) * s, ly = local[1] * s;
  const r = (rot * Math.PI) / 180;
  return [x + lx * Math.cos(r) - ly * Math.sin(r), y + lx * Math.sin(r) + ly * Math.cos(r)];
};

export type Hand2Props = {x: number; y: number; s?: number; rot?: number; mirror?: boolean; pose: HandPose; sleeve?: string; skin?: string; children?: React.ReactNode; opacity?: number; uid?: string};

export const Hand2: React.FC<Hand2Props> = ({x, y, s = 1, rot = 0, mirror = false, pose, sleeve = '#FFFDF8', skin = '#F2CBA2', children, opacity = 1, uid = 'h'}) => {
  const ol = derived.outline;
  const shade = '#D9A678', deep = '#C68E5E', nail = '#FBE6D2';
  const fingers = [0, 1, 2, 3].map((i) => {
    const c = pose.curl[i];
    const fs = i === 0 ? 1 : 1 - 0.5 * clamp01((c - 0.4) / 0.6); // curled fingers are foreshortened (tucked, not hanging)
    return chain([BASE[i][0], BASE[i][1] + (i - 1.5) * 4 * c], LEN[i].map((L) => L * fs), c, i === 0 ? 0.55 : 0.62);
  });
  const iTip = fingers[0][fingers[0].length - 1];
  const thumb = thumbChain(pose, iTip);
  const shapes: {d: string; id: string}[] = [
    {d: PALM, id: 'palm'},
    ...[3, 2, 1].map((i) => ({d: limb(fingers[i], W0[i], W1[i]), id: 'f' + i})),
    {d: limb(fingers[0], W0[0], W1[0]), id: 'f0'},
    {d: limb(thumb, 36, 26), id: 'th'},
  ];
  const cid = `${uid}-clip`;
  const tipInfo = (pts: P[]) => { const a = pts[pts.length - 2], b = pts[pts.length - 1]; return {x: b[0], y: b[1], ang: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI}; };
  const nails = [...fingers.map((f, i) => ({...tipInfo(f), w: W1[i], show: i === 0 ? pose.curl[0] < 0.9 : pose.curl[i] < 0.5})), {...tipInfo(thumb), w: 26, show: true}].filter((n) => n.show);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${mirror ? -s : s},${s})`} opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <clipPath id={cid}>{shapes.map((sh) => <path key={sh.id} d={sh.d} />)}</clipPath>
      </defs>
      {/* 1) merged outline */}
      {shapes.map((sh) => <path key={'o' + sh.id} d={sh.d} fill={ol} stroke={ol} strokeWidth={13} />)}
      {/* 2) skin fill with a vertical warm gradient (light top -> shade underside) */}
      <defs><linearGradient id={uid + '-sk'} gradientUnits="userSpaceOnUse" x1="0" y1="-60" x2="0" y2="90"><stop offset="0" stopColor="#F8D9B6" /><stop offset="0.45" stopColor={skin} /><stop offset="1" stopColor="#D9A072" /></linearGradient></defs>
      {shapes.map((sh) => <path key={'s' + sh.id} d={sh.d} fill={`url(#${uid}-sk)`} />)}
      {/* 3) shading + details, clipped to the silhouette */}
      <g clipPath={`url(#${cid})`}>
        {/* underside shade */}
        {fingers.map((f, i) => (i > 0 && pose.curl[i] > 0.5) ? null : <path key={'sh' + i} d={'M' + f.map((p) => `${p[0]},${p[1] + 8}`).join(' L')} fill="none" stroke={i % 2 ? deep : shade} strokeWidth={W1[i] * 0.55} opacity={0.55} />)}
        <path d={'M' + thumb.map((p) => `${p[0]},${p[1] + 9}`).join(' L')} fill="none" stroke={shade} strokeWidth={14} opacity={0.6} />
        {/* top light */}
        {fingers.map((f, i) => (i > 0 && pose.curl[i] > 0.5) ? null : <path key={'hl' + i} d={'M' + f.map((p) => `${p[0] + 2},${p[1] - 7}`).join(' L')} fill="none" stroke="#FFFFFF" strokeWidth={4.5} opacity={0.38} />)}
        <path d="M-80,-44 C-50,-52 -10,-54 14,-48" fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={0.4} />
        {/* tendons on the back of the hand */}
        {[0, 2].map((i) => <path key={'t' + i} d={`M${BASE[i][0] + 8},${BASE[i][1]} C${-40},${BASE[i][1] * 0.8 + 4} 0,${BASE[i][1] * 0.5 + 4} 40,${BASE[i][1] * 0.3 + 4}`} fill="none" stroke={deep} strokeWidth={2.6} opacity={0.55} />)}
        {/* knuckle shading: soft crescents instead of full circles */}
        {[0, 1, 2, 3].map((i) => <path key={'k' + i} d={`M${BASE[i][0] - 10},${BASE[i][1] - 8} Q${BASE[i][0] + 6},${BASE[i][1] - 14} ${BASE[i][0] + 16},${BASE[i][1] - 4}`} fill="none" stroke={deep} strokeWidth={3} opacity={0.4} />)}
      </g>
      {/* 4) finger joint creases + nails */}
      {fingers.map((f, i) => pose.curl[i] > 0.6 && i > 0 ? null : f.slice(1, 3).map((p, j) => { const a = f[j], b = f[j + 2] ?? f[j + 1]; const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI + 90; return <path key={`c${i}${j}`} d="M-7,0 Q0,-4 7,0" transform={`translate(${p[0]},${p[1]}) rotate(${ang})`} fill="none" stroke={ol} strokeWidth={2.8} opacity={0.7} />; }))}
      {nails.map((n, i) => (
        <g key={'n' + i} transform={`translate(${n.x},${n.y}) rotate(${n.ang})`}>
          <path d={`M${-n.w * 0.62},${-n.w * 0.32} Q${-n.w * 0.2},${-n.w * 0.4} ${n.w * 0.15},${-n.w * 0.28} Q${n.w * 0.28},0 ${n.w * 0.15},${n.w * 0.28} Q${-n.w * 0.2},${n.w * 0.4} ${-n.w * 0.62},${n.w * 0.32}Z`} fill={nail} stroke={ol} strokeWidth={2.4} />
          <path d={`M${-n.w * 0.5},${-n.w * 0.18} L${-n.w * 0.1},${-n.w * 0.2}`} stroke="#FFFFFF" strokeWidth={3} opacity={0.8} />
        </g>
      ))}
      {/* 5) forearm sleeve: rolled cuff + fabric with folds */}
      <path d="M72,-40 C92,-52 112,-56 118,-56 L340,-84 L340,96 L118,66 C110,64 92,56 72,48Z" fill={sleeve} stroke={ol} strokeWidth={6} />
      <path d="M72,-40 C100,-52 120,-56 128,-54 L128,64 C118,66 98,58 72,48 C82,6 82,-18 72,-40Z" fill="#EADFC8" stroke={ol} strokeWidth={5} />
      <path d="M128,-56 L128,66" stroke={ol} strokeWidth={5} />
      <path d="M170,-66 C196,-10 196,34 170,76 M240,-74 C268,-10 268,42 240,86" fill="none" stroke="#CDBFA7" strokeWidth={4} opacity={0.85} />
      <path d="M130,64 L340,92 L340,70 L130,48Z" fill="#CDBFA7" opacity={0.55} />
      <path d="M140,-52 L330,-76" stroke="#FFFFFF" strokeWidth={5} opacity={0.6} />
      {children}
    </g>
  );
};
