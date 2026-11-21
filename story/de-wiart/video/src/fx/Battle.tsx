import React from 'react';
import {Figure, FigureDefs, LightName} from '../rig/Figure';
import {aimPose, deadPose, idlePose, kneelAimPose, kneelPose, muzzleOf, runPose, SideOpts, SidePose, walkPose} from '../rig/Side';
import {clamp, ease, easeOut, mulberry32} from '../world/util';

export type Mode = 'run' | 'walk' | 'aim' | 'kneelAim' | 'kneel' | 'idle';
export type Spec = {
  id: string; o: SideOpts; x: number; y: number; s: number; face: 'left' | 'right'; light?: LightName; lit?: number; lo?: boolean;
  mode: Mode;
  vx?: number;                     // px/frame (signed, layer space) while moving
  stopAt?: number; after?: Mode;   // stop moving at frame, switch to `after`
  fireFrom?: number; fireTo?: number; period?: number;
  target?: [number, number];       // where its bullets land (layer space)
  aim?: (f: number) => [number, number];   // where its bullets land (SCREEN space)
  dieAt?: number; flinch?: number[]; phase?: number;
  pose?: (f: number, base: SidePose) => SidePose;   // custom override
  fixed?: boolean;                 // does not scroll with the camera track (the hero)
};

const hash = (id: string) => { let h = 7; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return (h % 1000) / 1000; };

export type ActorState = {x: number; pose: SidePose; shot: number; shotN: number; muzzle: [number, number] | null; dead: boolean; mode: Mode};

export function actorAt(a: Spec, f: number, camT = 0, depth = 1): ActorState {
  const dir = a.face === 'right' ? 1 : -1;
  const j = hash(a.id);
  const moving = a.stopAt === undefined || f < a.stopAt;
  const x = a.x + (a.vx || 0) * Math.min(f, a.stopAt ?? f) - (a.fixed ? 0 : camT * depth);
  const dead = a.dieAt !== undefined && f >= a.dieAt;
  const mode: Mode = dead ? 'idle' : moving ? a.mode : a.after ?? a.mode;
  const ph = (f / (mode === 'run' ? 17 : 34)) * Math.PI * 2 + (a.phase ?? j * 6);
  let pose: SidePose =
    mode === 'run' ? runPose(ph) : mode === 'walk' ? walkPose(ph, 0.95) : mode === 'aim' ? aimPose(f / 6 + j) :
    mode === 'kneelAim' ? kneelAimPose(f / 7 + j) : mode === 'kneel' ? kneelPose(f / 7 + j) : idlePose(f / 9 + j * 5);
  // gun fire cycle
  let shot = 99, shotN = -1;
  const aiming = mode === 'aim' || mode === 'kneelAim';
  if (aiming && a.fireFrom !== undefined && f >= a.fireFrom && (a.fireTo === undefined || f <= a.fireTo) && !dead) {
    const per = (a.period ?? 14) * (0.8 + 0.5 * j);
    const n = Math.floor((f - a.fireFrom) / per);
    shotN = n; shot = f - (a.fireFrom + n * per);
    const r = Math.exp(-shot / 3);
    pose = {...pose, torso: (pose.torso || 0) - 4 * r, uaN: (pose.uaN || 0) + 7 * r, uaF: (pose.uaF || 0) + 5 * r, head: (pose.head || 0) + 2 * r, dy: (pose.dy || 0) + 3 * r};
  }
  // flinch when hit near / by shell
  (a.flinch || []).forEach((t) => {
    if (f >= t && !dead) { const r = Math.exp(-(f - t) / 5); pose = {...pose, dy: (pose.dy || 0) + 9 * r, torso: (pose.torso || 0) - 6 * r, head: (pose.head || 0) - 8 * r}; }
  });
  // shot dead: fall backwards
  if (dead && a.dieAt !== undefined) {
    const k = clamp((f - a.dieAt) / 13);
    const fall = 1 - (1 - ease(k)) ** 2 + 0.03 * Math.sin(k * 3.14) ;
    pose = {...deadPose(f), fall: clamp(fall, 0, 1.02)};
    if (k < 1) pose = {...pose, uaN: -90 * (1 - k), uaF: -80 * (1 - k)};
  }
  if (a.pose) pose = a.pose(f, pose);
  let muzzle: [number, number] | null = null;
  if (aiming && !dead) { const [mx, my] = muzzleOf(pose); muzzle = [a.x === undefined ? 0 : x + dir * a.s * mx, a.y + a.s * my]; }
  return {x, pose, shot, shotN, muzzle, dead, mode};
}

/* ------------------------------ effects ------------------------------ */
export const Flash: React.FC<{x: number; y: number; dir: number; k: number; r: number}> = ({x, y, dir, k, r}) => {
  if (k <= 0) return null;
  const R = r * (0.7 + 0.5 * k);
  const pts = [[0, 0], [1, -0.18], [2.4, -0.06], [1.2, 0.0], [2.8, 0.1], [1.1, 0.16], [0.4, 0.6], [0.2, 0.14], [0.2, -0.6]].map(([a, b]) => `${a * R * dir},${b * R}`).join(' ');
  return (
    <g transform={`translate(${x} ${y})`} opacity={k}>
      <circle r={R * 1.8} fill="#ffb84a" opacity=".35" style={{filter: `blur(${R * 0.5}px)`}} />
      <polygon points={pts} fill="#ffe29a" stroke="#fff6d8" strokeWidth={R * 0.04} />
      <circle r={R * 0.35} fill="#fff" />
    </g>
  );
};

export const Puff: React.FC<{x: number; y: number; age: number; r: number; dir: number}> = ({x, y, age, r, dir}) => {
  if (age < 0 || age > 46) return null;
  const k = age / 46;
  return <ellipse cx={x + dir * (age * 0.7 * r * 0.06 + 6)} cy={y - age * 0.55 * r * 0.05} rx={(0.3 + k * 1.1) * r} ry={(0.2 + k * 0.8) * r} fill="#e8e0d0" opacity={0.55 * (1 - k)} style={{filter: `blur(${2 + k * 6}px)`}} />;
};

export const Tracer: React.FC<{x0: number; y0: number; x1: number; y1: number; age: number; dur?: number; w?: number}> = ({x0, y0, x1, y1, age, dur = 6, w = 3}) => {
  if (age < 0 || age > dur) return null;
  const t = age / dur, t0 = Math.max(0, t - 0.28);
  const hx = x0 + (x1 - x0) * t, hy = y0 + (y1 - y0) * t, tx = x0 + (x1 - x0) * t0, ty = y0 + (y1 - y0) * t0;
  return (
    <g>
      <line x1={tx} y1={ty} x2={hx} y2={hy} stroke="#ffd27a" strokeWidth={w * 2.4} opacity=".28" strokeLinecap="round" />
      <line x1={tx} y1={ty} x2={hx} y2={hy} stroke="#fff6d0" strokeWidth={w} strokeLinecap="round" />
    </g>
  );
};

export const Impact: React.FC<{x: number; y: number; age: number; r: number; seed?: number}> = ({x, y, age, r, seed = 1}) => {
  if (age < 0 || age > 24) return null;
  const k = age / 24, rg = mulberry32(seed * 977);
  return (
    <g>
      <ellipse cx={x} cy={y - k * r * 0.5} rx={(0.4 + k * 1.2) * r} ry={(0.3 + k * 0.9) * r * 0.7} fill="#cdb48a" opacity={0.7 * (1 - k)} style={{filter: `blur(${3 + k * 6}px)`}} />
      {Array.from({length: 7}, (_, i) => {
        const vx = (rg() - 0.5) * r * 2.2, vy = -(0.6 + rg()) * r * 1.4, t = age * 0.55;
        return <circle key={i} cx={x + vx * t * 0.35} cy={y + vy * t * 0.35 + 0.5 * 1.1 * r * 0.06 * t * t} r={Math.max(0.5, r * 0.07 * (1 - k))} fill="#8a6a44" opacity={1 - k} />;
      })}
    </g>
  );
};

/** artillery shell burst: flash, fireball, shockwave, debris, rising smoke column */
export const Explosion: React.FC<{x: number; y: number; age: number; r?: number; seed?: number}> = ({x, y, age, r = 120, seed = 3}) => {
  if (age < 0 || age > 90) return null;
  const rg = mulberry32(seed * 131);
  const fb = clamp(1 - age / 14);
  return (
    <g>
      {age < 4 && <circle cx={x} cy={y - r * 0.6} r={r * 3.6} fill="#fff3d0" opacity={0.5 * (1 - age / 4)} style={{filter: 'blur(30px)'}} />}
      {age < 16 && <circle cx={x} cy={y - r * 0.7 * easeOut(age / 9)} r={r * (0.7 + easeOut(age / 8) * 1.4)} fill="#ff9a2a" opacity={fb} style={{filter: 'blur(6px)'}} />}
      {age < 12 && <circle cx={x} cy={y - r * 0.7 * easeOut(age / 9)} r={r * (0.2 + easeOut(age / 8) * 0.6)} fill="#fff1b8" opacity={fb} />}
      {age < 18 && <ellipse cx={x} cy={y} rx={age * r * 0.22} ry={age * r * 0.05} fill="none" stroke="#f6e8c8" strokeWidth={3} opacity={1 - age / 18} />}
      {Array.from({length: 16}, (_, i) => {
        const vx = (rg() - 0.5) * 36, vy = -(10 + rg() * 20), t = age;
        return <rect key={i} x={x + vx * t * 0.55} y={y + vy * t * 0.55 + 0.5 * 1.3 * t * t * 0.55} width={r * 0.07} height={r * 0.05} fill={i % 3 ? '#6a4a30' : '#2a1a10'} opacity={clamp(1.2 - age / 50)} transform={`rotate(${i * 40 + age * 17} ${x + vx * t * 0.55} ${y + vy * t * 0.55})`} />;
      })}
      {Array.from({length: 9}, (_, i) => {
        const k = clamp((age - i * 2) / 70);
        return <ellipse key={'s' + i} cx={x + Math.sin(i * 2.1) * r * 0.5 * k * 1.4} cy={y - k * r * 4.4 - i * 8} rx={r * (0.5 + k * 0.9)} ry={r * (0.4 + k * 0.7)} fill="#241d18" opacity={0.7 * (1 - k) * clamp((age - 7) / 10)} style={{filter: 'blur(14px)'}} />;
      })}
    </g>
  );
};

/** screen-shake amplitude from a list of {frame, amp} events */
export const shakeAmp = (f: number, ev: {t: number; a: number}[]) => ev.reduce((s, e) => s + (f >= e.t ? e.a * Math.exp(-(f - e.t) / 6) : 0), 0);

/* ------------------------------ renderer ------------------------------ */
export const Actors: React.FC<{specs: Spec[]; f: number; effects?: boolean; camT?: number; depth?: number; aimShift?: number}> = ({specs, f, effects = true, camT = 0, depth = 1, aimShift = 0}) => {
  const st = specs.map((a) => ({a, st: actorAt(a, f, camT, depth)}));
  return (
    <>
      <FigureDefs />
      {st.map(({a, st: s}) => (
        <Figure key={a.id} uid={`ac${a.id}`} x={s.x} y={a.y} s={a.s} o={{...a.o, face: a.face}} p={s.pose} light={a.light ?? 'warm'} lit={a.lit ?? 1} lo={a.lo} />
      ))}
      {effects && st.map(({a, st: s}) => {
        if (!s.muzzle) return null;
        const dir = a.face === 'right' ? 1 : -1, r = Math.max(18, 75 * a.s);
        const aimP = a.aim ? a.aim(f) : null;
        const tgt: [number, number] = aimP ? [aimP[0] + aimShift, aimP[1]] : a.target ? [a.target[0] - (a.fixed ? 0 : camT * depth), a.target[1]] : [s.muzzle[0] + dir * 1100, s.muzzle[1] + 40];
        return (
          <g key={'fx' + a.id}>
            {[s.shotN - 1, s.shotN].map((n, idx) => {
              if (n < 0) return null;
              const age = idx === 1 ? s.shot : s.shot + ((a.period ?? 14) * (0.8 + 0.5 * hash(a.id)));
              return (
                <g key={n}>
                  <Puff x={s.muzzle![0]} y={s.muzzle![1]} age={age} r={r} dir={dir} />
                  <Tracer x0={s.muzzle![0]} y0={s.muzzle![1]} x1={tgt[0]} y1={tgt[1]} age={age - 1} w={Math.max(2.5, 5 * a.s)} />
                  <Impact x={tgt[0]} y={tgt[1] + 8} age={age - 7} r={Math.max(12, 70 * a.s)} seed={n + 1} />
                </g>
              );
            })}
            <Flash x={s.muzzle[0]} y={s.muzzle[1]} dir={dir} k={s.shot < 3 ? 1 - s.shot / 3 : 0} r={r} />
          </g>
        );
      })}
    </>
  );
};

/** bullets from off-screen / far shooters toward a point, with ground impacts */
export type Volley = {x0: number; y0: number; x1: number; y1: number; t0: number; every: number; until?: number; spread?: number; seed?: number; w?: number; r?: number};
export const Volleys: React.FC<{list: Volley[]; f: number}> = ({list, f}) => (
  <>
    {list.map((v, i) => {
      if (f < v.t0 || (v.until !== undefined && f > v.until)) return null;
      const n = Math.floor((f - v.t0) / v.every);
      const rg = mulberry32((v.seed ?? 1) * 7919 + n * 31 + i);
      return [n - 1, n].map((k) => {
        if (k < 0) return null;
        const rk = mulberry32((v.seed ?? 1) * 7919 + k * 31 + i);
        const dx = (rk() - 0.5) * (v.spread ?? 160), age = f - (v.t0 + k * v.every);
        void rg;
        return (
          <g key={`${i}-${k}`}>
            <Tracer x0={v.x0} y0={v.y0} x1={v.x1 + dx} y1={v.y1} age={age} w={v.w ?? 3} dur={7} />
            <Impact x={v.x1 + dx} y={v.y1 + 8} age={age - 7} r={v.r ?? 22} seed={k + i + 1} />
          </g>
        );
      });
    })}
  </>
);
