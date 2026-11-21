import React from 'react';
import {Figure, FigureDefs, LightName} from '../rig/Figure';
import {AnimalArt, AnimalOpts, saddleHeight} from '../rig/Animals';
import {aimPose, deadPose, idlePose, kneelAimPose, kneelPose, muzzleOf, ridePose, runPose, SideOpts, SidePose, walkPose} from '../rig/Side';
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
  die?: 'back' | 'forward' | 'stumble' | 'crawl';   // how the actor goes down at dieAt
  xf?: (f: number) => number;      // custom x (e.g. a body being dragged)
};

const hash = (id: string) => { let h = 7; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return (h % 1000) / 1000; };

export type ActorState = {x: number; pose: SidePose; shot: number; shotN: number; muzzle: [number, number] | null; dead: boolean; mode: Mode};

export function actorAt(a: Spec, f: number, camT = 0, depth = 1): ActorState {
  const dir = a.face === 'right' ? 1 : -1;
  const j = hash(a.id);
  const moving = a.stopAt === undefined || f < a.stopAt;
  let x = a.x + (a.vx || 0) * Math.min(f, a.stopAt ?? f) - (a.fixed ? 0 : camT * depth);
  if (a.xf) x = a.xf(f) - (a.fixed ? 0 : camT * depth);
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
  // going down: four different ways
  if (dead && a.dieAt !== undefined) {
    const tt = f - a.dieAt, kind = a.die ?? 'back';
    if (kind === 'back') {
      const k = clamp(tt / 13);
      pose = {...deadPose(f), fall: clamp(1 - (1 - ease(k)) ** 2 + 0.03 * Math.sin(k * 3.14), 0, 1.02)};
      if (k < 1) pose = {...pose, uaN: -90 * (1 - k), uaF: -80 * (1 - k)};
    } else if (kind === 'forward') {
      const k = clamp(tt / 12);
      pose = {...deadPose(f), fall: -clamp(ease(k) * 1.01, 0, 1), uaN: 50 * (1 - k) - 20, uaF: 40 * (1 - k) - 10, head: 10, thN: 4, shN: 6, thF: -4, shF: 6};
    } else if (kind === 'stumble') {
      const kn = ease(clamp((tt - 4) / 10)), fk = ease(clamp((tt - 16) / 12));
      const kp = kneelPose(f);
      const stag: SidePose = {torso: -10 * Math.sin(tt * 1.1), head: -16, uaN: -70 + 30 * Math.sin(tt * 0.9), uaF: 40 * Math.sin(tt * 1.3), faN: -30, faF: -20, thN: -10 * Math.sin(tt), thF: 10 * Math.sin(tt), shN: 20, shF: 20, dy: 4 * Math.sin(tt * 2)};
      const mix2 = (key: keyof SidePose) => ((stag as any)[key] || 0) * (1 - kn) + ((kp as any)[key] || 0) * kn;
      pose = {torso: mix2('torso') + 22 * fk, head: mix2('head') + 10 * fk, uaN: mix2('uaN'), uaF: mix2('uaF'), faN: mix2('faN'), faF: mix2('faF'), thN: mix2('thN'), thF: mix2('thF'), shN: mix2('shN'), shF: mix2('shF'), ftN: kp.ftN, ftF: kp.ftF, dy: mix2('dy'), fall: -fk};
    } else {
      // crawl: drops prone, then drags itself forward on its elbows
      const k = ease(clamp(tt / 8)), cr = clamp((tt - 8) / 70);
      const w = (f / 5) * Math.PI;
      pose = {...deadPose(f), fall: -k, uaN: 70 * Math.sin(w) * cr - 20, uaF: -70 * Math.sin(w) * cr - 10, faN: -30, faF: -30, thN: 24 * Math.sin(w + 1) * cr, thF: -24 * Math.sin(w + 1) * cr, shN: 30, shF: 30, head: 20};
      x += dir * 1.1 * Math.max(0, tt - 8) * Math.max(0, 1 - tt / 90);
    }
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

/** artillery shell burst: flash, volumetric fireball, tapered dirt column, trailing debris, lit smoke plume, ground dust */
export const Explosion: React.FC<{x: number; y: number; age: number; r?: number; seed?: number}> = ({x, y, age, r = 120, seed = 3}) => {
  if (age < 0 || age > 130) return null;
  const rg = mulberry32(seed * 131);
  const fb = clamp(1 - age / 18), col = clamp(age / 70);
  const id = `ex${seed}`;
  return (
    <g>
      <defs>
        <radialGradient id={`${id}f`}><stop offset="0" stopColor="#fff6c8" /><stop offset=".3" stopColor="#ffc24a" /><stop offset=".65" stopColor="#e2561a" /><stop offset="1" stopColor="#5a1a08" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}s`} cx=".3" cy=".3"><stop offset="0" stopColor="#6a5a50" /><stop offset=".55" stopColor="#2c2420" /><stop offset="1" stopColor="#14100e" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}d`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#7a5a3a" /><stop offset="1" stopColor="#3a2a1c" stopOpacity="0" /></linearGradient>
      </defs>
      {age < 3 && <rect x={x - 2400} y={y - 1400} width={4800} height={2000} fill="#fff3d0" opacity={0.28 * (1 - age / 3)} />}
      {age < 5 && <circle cx={x} cy={y - r * 0.6} r={r * 4.2} fill="#fff3d0" opacity={0.55 * (1 - age / 5)} style={{filter: 'blur(34px)'}} />}
      {/* ground dust ring racing outward */}
      {age < 60 && <ellipse cx={x} cy={y + 4} rx={r * (0.4 + easeOut(age / 40) * 3.6)} ry={r * (0.1 + easeOut(age / 40) * 0.5)} fill="#c8aa80" opacity={0.55 * (1 - age / 60)} style={{filter: 'blur(14px)'}} />}
      {/* tapered column of dirt thrown up */}
      {age < 40 && (() => {
        const h = r * 4.4 * easeOut(age / 14), w0 = r * 1.2 * (1 + age / 30), w1 = r * 0.3;
        return <path d={`M${x - w0} ${y} Q${x - w0 * 0.6} ${y - h * 0.5} ${x - w1} ${y - h} L${x + w1} ${y - h} Q${x + w0 * 0.6} ${y - h * 0.5} ${x + w0} ${y} Z`} fill={`url(#${id}d)`} opacity={clamp(1.2 - age / 36)} style={{filter: 'blur(5px)'}} />;
      })()}
      {/* fireball made of several lobes */}
      {age < 22 && [0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2 + seed, rad = r * (0.2 + easeOut(age / 10) * 0.7) * (0.6 + 0.4 * ((i % 3) / 2));
        return <circle key={i} cx={x + Math.cos(a) * rad * 0.9} cy={y - r * 0.85 * easeOut(age / 10) + Math.sin(a) * rad * 0.7} r={r * (0.35 + easeOut(age / 8) * 0.8)} fill={`url(#${id}f)`} opacity={fb} />;
      })}
      {age < 16 && <circle cx={x} cy={y - r * 0.8} r={r * (0.25 + easeOut(age / 7) * 0.5)} fill="#fff4c0" opacity={fb} />}
      {age < 20 && <ellipse cx={x} cy={y} rx={age * r * 0.26} ry={age * r * 0.06} fill="none" stroke="#f6e8c8" strokeWidth={3.5} opacity={1 - age / 20} />}
      {/* debris with motion trails */}
      {Array.from({length: 22}, (_, i) => {
        const vx = (rg() - 0.5) * 44, vy = -(12 + rg() * 24), t = age * 0.55;
        const px = x + vx * t, py = y + vy * t + 0.5 * 1.3 * t * t, ox = x + vx * (t - 1.2), oy = y + vy * (t - 1.2) + 0.5 * 1.3 * (t - 1.2) ** 2;
        return (
          <g key={i} opacity={clamp(1.3 - age / 55)}>
            <line x1={ox} y1={oy} x2={px} y2={py} stroke={i % 3 ? '#8a6a44' : '#2a1a10'} strokeWidth={r * 0.035} strokeLinecap="round" opacity=".5" />
            <rect x={px - r * 0.035} y={py - r * 0.025} width={r * 0.07 + (i % 4) * 2} height={r * 0.05} fill={i % 3 ? '#6a4a30' : '#1c120a'} transform={`rotate(${i * 40 + age * 19} ${px} ${py})`} />
          </g>
        );
      })}
      {/* smoke plume: lit on one side, drifting with the wind, lingering */}
      {Array.from({length: 14}, (_, i) => {
        const k = clamp((age - 6 - i * 2.4) / 110);
        return <circle key={'s' + i} cx={x + Math.sin(i * 1.9) * r * 0.5 * (0.4 + k * 1.6) + k * r * 1.1} cy={y - r * 0.7 - k * r * 5 - i * r * 0.22} r={r * (0.5 + k * 1.1 + (i % 3) * 0.1)} fill={`url(#${id}s)`} opacity={0.88 * (1 - col * 0.2) * (1 - k)} style={{filter: 'blur(9px)'}} />;
      })}
    </g>
  );
};

/** persistent crater + scorch left behind after a shell lands */
export const Crater: React.FC<{x: number; y: number; age: number; r?: number; dust?: string}> = ({x, y, age, r = 120, dust = '#8a6a44'}) => {
  if (age < 4) return null;
  const k = clamp((age - 4) / 8);
  return (
    <g opacity={k}>
      <ellipse cx={x} cy={y + 6} rx={r * 1.25} ry={r * 0.26} fill="#1a1008" opacity=".55" style={{filter: 'blur(3px)'}} />
      <ellipse cx={x} cy={y + 4} rx={r * 1.0} ry={r * 0.18} fill="#0e0804" opacity=".8" />
      <ellipse cx={x - r * 0.1} cy={y - 2} rx={r * 1.18} ry={r * 0.22} fill="none" stroke={dust} strokeWidth={r * 0.06} opacity=".8" />
      <ellipse cx={x} cy={y + 14} rx={r * 1.6} ry={r * 0.3} fill="#2a1c10" opacity=".3" style={{filter: 'blur(10px)'}} />
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

/* ------------------------------ mounts (horse / camel + rider) ------------------------------ */
export type MountSpec = {id: string; a: AnimalOpts; x: number; y: number; s: number; face: 'left' | 'right'; vx?: number; stopAt?: number; rider?: SideOpts; light?: LightName; lit?: number; lo?: boolean; stride?: number; phaseOff?: number};
export const Mounts: React.FC<{list: MountSpec[]; f: number; camT?: number; depth?: number}> = ({list, f, camT = 0, depth = 1}) => (
  <>
    <FigureDefs />
    {list.map((m) => {
      const moving = m.stopAt === undefined || f < m.stopAt;
      const x = m.x + (m.vx || 0) * Math.min(f, m.stopAt ?? f) - camT * depth;
      const ph = moving ? (f / 18) * Math.PI * 2 + (m.phaseOff || 0) : 0;
      const bob = moving ? -6 * Math.abs(Math.sin(ph)) : 0;
      const st = moving ? m.stride ?? 1 : 0.02;
      return (
        <g key={m.id}>
          <Figure uid={`mt${m.id}`} x={x} y={m.y} s={m.s} o={{pal: {skin: '', hair: '', top: '', bottom: '', belt: '', boots: ''}}} p={{}} art={<AnimalArt o={{...m.a, face: m.face}} p={{phase: ph, stride: st, dy: bob, head: 4 * Math.sin(ph)}} />} box={[-640, -1900, 1500, 1960]} light={m.light ?? 'warm'} lit={m.lit ?? 1} lo={m.lo} />
          {m.rider && (
            <Figure uid={`rd${m.id}`} x={x} y={m.y - m.s * (saddleHeight(m.a.kind) + 12 - 666) + bob * m.s} s={m.s} o={{...m.rider, face: m.face}} p={{...ridePose(f / 8), dy: 0, torso: moving ? 2 * Math.sin(ph) : 0}} light={m.light ?? 'warm'} lit={m.lit ?? 1} lo={m.lo} />
          )}
        </g>
      );
    })}
  </>
);

/** mouth opening for speaking/shouting between frames a..b (0 outside) */
export const talk = (f: number, a: number, b: number, seed = 0) => (f < a || f > b ? 0 : 0.18 + 0.82 * Math.abs(Math.sin(f * 0.8 + seed)) * (0.6 + 0.4 * Math.abs(Math.sin(f * 0.23 + seed))));
