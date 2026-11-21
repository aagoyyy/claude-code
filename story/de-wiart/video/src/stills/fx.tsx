import React from 'react';
import {clock} from '../rig/clock';
import {H, mix, mulberry32, W} from '../world/util';

/* Animated effects driven by the film clock (clock.t seconds since the shot started; 0 = still frame) */
const wrap = (v: number, m: number) => ((v % m) + m) % m;

export const Rain: React.FC<{n?: number; seed?: number; o?: number; speed?: number; len?: number; slant?: number; c?: string}> = ({n = 120, seed = 3, o = 0.3, speed = 1500, len = 56, slant = 14, c = '#cfe0ee'}) => {
  const q = mulberry32(seed), t = clock.t;
  return (
    <g stroke={c} strokeWidth={1.6} opacity={o} strokeLinecap="round">
      {Array.from({length: n}, (_, i) => { const x0 = q() * (W + 200), y0 = q() * (H + 200), sp = speed * (0.8 + q() * 0.5); const y = wrap(y0 + t * sp, H + 200) - 100, x = x0 - (y - y0) * 0 - t * sp * (slant / 56) * 0.25; const xx = wrap(x, W + 200) - 100; return <line key={i} x1={xx} y1={y} x2={xx - slant} y2={y + len} />; })}
    </g>
  );
};

export const Embers: React.FC<{n?: number; seed?: number; x0?: number; x1?: number; y0?: number; y1?: number; c?: string; o?: number; rise?: number; r?: number}> = ({n = 50, seed = 7, x0 = 0, x1 = W, y0 = 300, y1 = H, c = '#ff9a40', o = 0.8, rise = 70, r = 2.6}) => {
  const q = mulberry32(seed), t = clock.t;
  return (
    <g>
      {Array.from({length: n}, (_, i) => { const bx = x0 + q() * (x1 - x0), by = y0 + q() * (y1 - y0), sp = rise * (0.5 + q()), ph = q() * 6.28, rr = 0.8 + q() * r; const y = by - wrap(t * sp, y1 - y0 + 60) + 0; const yy = y0 + wrap(y - y0, y1 - y0 + 60); const x = bx + Math.sin(t * 1.3 + ph) * 22; return <circle key={i} cx={x} cy={yy} r={rr} fill={c} opacity={o * (0.4 + 0.6 * Math.abs(Math.sin(t * 3 + ph)))} />; })}
    </g>
  );
};

export const Dust: React.FC<{n?: number; seed?: number; c?: string; o?: number; speed?: number; y0?: number; y1?: number}> = ({n = 40, seed = 5, c = '#fff0d0', o = 0.4, speed = 24, y0 = 300, y1 = 1000}) => {
  const q = mulberry32(seed), t = clock.t;
  return <g>{Array.from({length: n}, (_, i) => { const x = wrap(q() * W + t * speed * (0.5 + q()), W + 40) - 20, y = y0 + q() * (y1 - y0) + Math.sin(t * 0.8 + i) * 10; return <circle key={i} cx={x} cy={y} r={1.2 + q() * 3.2} fill={c} opacity={o * (0.4 + 0.6 * q())} />; })}</g>;
};

/** a rising, billowing smoke column (looping) */
export const Smoke: React.FC<{x: number; y: number; w?: number; h?: number; c?: string; o?: number; puffs?: number; seed?: number; drift?: number}> = ({x, y, w = 80, h = 400, c = '#3a3440', o = 0.6, puffs = 9, seed = 2, drift = 60}) => {
  const q = mulberry32(seed), t = clock.t;
  return (
    <g filter="url(#blL)">
      {Array.from({length: puffs}, (_, i) => { const ph = (i / puffs + t * 0.12) % 1, age = ph; const px = x + Math.sin(i * 2.1 + t * 0.6) * w * 0.5 * age + drift * age, py = y - h * age; const r = w * (0.5 + age * 1.6); return <circle key={i} cx={px} cy={py} r={r} fill={c} opacity={o * (1 - age) * (0.7 + q() * 0.3)} />; })}
    </g>
  );
};

/** an explosion starting t0 seconds into the shot: flash, fireball, shock ring, debris, smoke */
export const Boom: React.FC<{x: number; y: number; t0?: number; r?: number; seed?: number; smoke?: boolean}> = ({x, y, t0 = 0, r = 260, seed = 3, smoke = true}) => {
  const age = clock.t - t0, q = mulberry32(seed);
  if (clock.t === 0) { // still frame: show the fireball at its peak
    return <Boom x={x} y={y} t0={-0.35} r={r} seed={seed} smoke={smoke} />;
  }
  if (age < 0) return null;
  const k = Math.min(1, age / 0.5), e = 1 - Math.pow(1 - k, 3), fade = Math.max(0, 1 - age / 1.6);
  return (
    <g>
      {age < 0.12 && <rect x={0} y={0} width={W} height={H} fill="#fff4d0" opacity={0.6 * (1 - age / 0.12)} />}
      <circle cx={x} cy={y} r={r * 1.7 * e} fill="none" stroke="#ffe0a0" strokeWidth={8 * (1 - k) + 1} opacity={0.7 * (1 - k)} />
      <g filter="url(#blM)" opacity={fade}>
        <circle cx={x} cy={y - r * 0.2 * e} r={r * 1.1 * e} fill="#ff7a2a" opacity=".85" /><circle cx={x} cy={y - r * 0.3 * e} r={r * 0.7 * e} fill="#ffd070" /><circle cx={x} cy={y - r * 0.35 * e} r={r * 0.36 * e} fill="#fff6d0" />
      </g>
      {Array.from({length: 26}, (_, i) => { const a = q() * 6.283, sp = r * (1.4 + q() * 2.2), px = x + Math.cos(a) * sp * age, py = y + Math.sin(a) * sp * age * 0.8 + 380 * age * age; const rot = q() * 360 + age * 400 * (q() - 0.5); return age < 1.6 ? <rect key={i} x={px} y={py} width={6 + q() * 20} height={4 + q() * 8} fill="#14100c" opacity={Math.max(0, 1 - age / 1.6)} transform={`rotate(${rot} ${px} ${py})`} /> : null; })}
      {Array.from({length: 40}, (_, i) => { const a = q() * 6.283, sp = r * (0.8 + q() * 2.4), px = x + Math.cos(a) * sp * age, py = y + Math.sin(a) * sp * age * 0.8 + 200 * age * age; return <circle key={'s' + i} cx={px} cy={py} r={2 + q() * 5} fill="#ffb040" opacity={Math.max(0, 1 - age / 1.2)} />; })}
      {smoke && <g filter="url(#blL)" opacity={Math.min(0.9, age * 1.4)}>{Array.from({length: 6}, (_, i) => <circle key={i} cx={x + (i - 2.5) * r * 0.25} cy={y - r * (0.5 + age * 0.9) - i * 12} r={r * (0.5 + age * 0.4)} fill="#2a2420" opacity={Math.max(0, 0.7 - age / 3)} />)}</g>}
    </g>
  );
};

export const Splash: React.FC<{x: number; y: number; t0?: number; r?: number; seed?: number}> = ({x, y, t0 = 0, r = 160, seed = 4}) => {
  if (clock.t === 0) return <Splash x={x} y={y} t0={-0.3} r={r} seed={seed} />;
  const age = clock.t - t0, q = mulberry32(seed);
  if (age < 0) return null;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r * (0.4 + age * 1.4)} ry={r * 0.12 * (0.4 + age * 1.4)} fill="none" stroke="#fff" strokeWidth={5} opacity={Math.max(0, 0.8 - age * 0.7)} />
      {Array.from({length: 34}, (_, i) => { const a = -Math.PI / 2 + (q() - 0.5) * 2.2, v = r * (2 + q() * 3.4), px = x + Math.cos(a) * v * age * 0.5, py = y + Math.sin(a) * v * age + 900 * age * age * 0.5; return <circle key={i} cx={px} cy={py} r={2 + q() * 5} fill="#e8f6ff" opacity={Math.max(0, 1 - age / 1.1)} />; })}
      <rect x={x - r * 0.18} y={y - r * 2.2 * Math.min(1, age * 3) * Math.max(0, 1 - age)} width={r * 0.36} height={r * 2.2 * Math.min(1, age * 3) * Math.max(0, 1 - age)} fill="#f4fbff" opacity={Math.max(0, 0.8 - age)} filter="url(#blS)" />
    </g>
  );
};

export const Ripples: React.FC<{x: number; y: number; rx?: number; ry?: number; n?: number; c?: string; speed?: number}> = ({x, y, rx = 300, ry = 40, n = 4, c = '#fff', speed = 0.35}) => {
  const t = clock.t;
  return <g>{Array.from({length: n}, (_, i) => { const ph = (i / n + t * speed) % 1; return <ellipse key={i} cx={x} cy={y} rx={rx * ph} ry={ry * ph} fill="none" stroke={c} strokeWidth={4 * (1 - ph) + 1} opacity={0.8 * (1 - ph)} />; })}</g>;
};

/** muzzle flash that flickers at random intervals */
export const Flash: React.FC<{x: number; y: number; r?: number; seed?: number; rate?: number; angle?: number}> = ({x, y, r = 120, seed = 1, rate = 5, angle = 0}) => {
  const t = clock.t, slot = Math.floor(t * rate), q = mulberry32(seed + slot * 7), on = clock.t === 0 || q() > 0.45;
  const ph = (t * rate) % 1;
  if (!on || (clock.t > 0 && ph > 0.35)) return null;
  const s = clock.t === 0 ? 1 : 1 - ph / 0.35;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`} opacity={s}>
      <ellipse rx={r} ry={r * 0.34} fill="#fff4c0" /><ellipse rx={r * 0.5} ry={r * 0.16} fill="#fff" /><ellipse rx={r * 2} ry={r * 0.9} fill="#ffb040" opacity=".25" filter="url(#blM)" />
    </g>
  );
};

/** low steam / breath puffs */
export const Steam: React.FC<{x: number; y: number; n?: number; c?: string; o?: number; size?: number}> = ({x, y, n = 6, c = '#fff', o = 0.7, size = 60}) => {
  const t = clock.t;
  return <g filter="url(#blM)">{Array.from({length: n}, (_, i) => { const ph = (i / n + t * 0.35) % 1; return <circle key={i} cx={x + ph * 220 + Math.sin(i + t) * 12} cy={y - ph * 140} r={size * (0.4 + ph * 1.3)} fill={c} opacity={o * (1 - ph)} />; })}</g>;
};
