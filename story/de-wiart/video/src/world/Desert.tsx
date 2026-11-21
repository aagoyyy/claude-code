import React, {useMemo} from 'react';
import {clamp, mix, mulberry32, ridge, W} from './util';

const HZ = '#fbe2b4';
export const SUND = {x: 380, y: 150};
export const dcol = (y: number) => mix('#f0cf94', '#9a6a40', clamp((y - 690) / 400));

export const SkyHot: React.FC<{f: number}> = ({f}) => (
  <>
    <defs>
      <linearGradient id="dSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7fa1b6" /><stop offset=".4" stopColor="#b8cdd0" /><stop offset=".72" stopColor="#f2dfb4" /><stop offset="1" stopColor="#fbe7bd" />
      </linearGradient>
      <radialGradient id="dSun" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fffdf0" /><stop offset=".08" stopColor="#fff6d2" stopOpacity=".95" /><stop offset=".3" stopColor="#ffe8a8" stopOpacity=".4" /><stop offset="1" stopColor="#ffe2a0" stopOpacity="0" /></radialGradient>
      <filter id="dCl"><feGaussianBlur stdDeviation="10" /></filter>
    </defs>
    <rect x={-700} y={-400} width={W + 1400} height={1200} fill="url(#dSky)" />
    <circle cx={SUND.x} cy={SUND.y} r={820} fill="url(#dSun)" />
    <circle cx={SUND.x} cy={SUND.y} r={52} fill="#fffef6" />
    {[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={200 + i * 380 + f * (0.1 + i * 0.03)} cy={200 + (i % 3) * 90} rx={140 + i * 20} ry={10 + (i % 2) * 6} fill="#fff6e0" opacity=".45" filter="url(#dCl)" />)}
    {/* lens-flare ghosts along the line sun → screen centre */}
    {[0.25, 0.42, 0.7].map((t, i) => <circle key={i} cx={SUND.x + (960 - SUND.x) * t * 1.6} cy={SUND.y + (540 - SUND.y) * t * 1.6} r={30 + i * 22} fill="#ffe6b0" opacity={0.08 + i * 0.015} />)}
  </>
);

export const Dunes: React.FC<{seed: number; base: number; amp: number; haze: number}> = ({seed, base, amp, haze}) => {
  const rd = ridge(seed, base, amp, [0.0022, 0.006, 0.014]);
  return (
    <>
      <defs>
        <linearGradient id={`dn${seed}`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor={mix('#fbe0a2', HZ, haze)} /><stop offset=".5" stopColor={mix('#d9a868', HZ, haze)} /><stop offset="1" stopColor={mix('#8a5a48', HZ, haze)} />
        </linearGradient>
        <linearGradient id={`dnv${seed}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".18" /><stop offset=".25" stopColor="#7a4a3a" stopOpacity=".0" /><stop offset="1" stopColor={mix('#7a4a3a', HZ, haze)} stopOpacity=".5" /></linearGradient>
      </defs>
      <path d={rd.fill} fill={`url(#dn${seed})`} />
      <path d={rd.fill} fill={`url(#dnv${seed})`} />
      <path d={rd.top} fill="none" stroke="#fff2c8" strokeWidth="2.5" opacity=".6" />
    </>
  );
};

/** mud-brick fort with towers, crenellations, shaded right side and a flapping flag */
export const Fort: React.FC<{x: number; y: number; s: number; f: number; haze: number}> = ({x, y, s, f, haze}) => {
  const lit = mix('#e7c48c', HZ, haze), mid = mix('#c49462', HZ, haze), sh = mix('#7a4e48', HZ, haze * 0.8), dark = mix('#3a2528', HZ, haze * 0.6);
  const cren = (x0: number, w: number, yy: number) => Array.from({length: Math.floor(w / 26)}, (_, i) => <rect key={i} x={x0 + i * 26 + 4} y={yy - 14} width={14} height={16} fill={lit} />);
  const wave = Math.sin(f * 0.22) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={200} cy={6} rx={330} ry={12} fill="#3a2026" opacity={0.3 * (1 - haze)} />
      {/* main wall */}
      <rect x={-140} y={-130} width={420} height={134} fill={mid} />
      <rect x={-140} y={-130} width={170} height={134} fill={lit} />
      <rect x={170} y={-130} width={110} height={134} fill={sh} opacity=".75" />
      {cren(-140, 420, -130)}
      {/* towers */}
      <rect x={-170} y={-210} width={80} height={214} fill={mid} /><rect x={-170} y={-210} width={34} height={214} fill={lit} /><rect x={-118} y={-210} width={28} height={214} fill={sh} opacity=".7" />
      {cren(-170, 80, -210)}
      <rect x={250} y={-190} width={76} height={194} fill={mid} /><rect x={250} y={-190} width={26} height={194} fill={lit} /><rect x={296} y={-190} width={30} height={194} fill={sh} opacity=".8" />
      {cren(250, 76, -190)}
      {/* gate + windows */}
      <path d="M30 4 V-70 Q30 -100 62 -100 Q94 -100 94 -70 V4 Z" fill={dark} />
      {[ -60, 120, 200 ].map((wx, i) => <rect key={i} x={wx} y={-100} width={14} height={26} rx={7} fill={dark} />)}
      <rect x={-146} y={-136} width={432} height={8} fill={lit} opacity=".7" />
      {/* flag */}
      <path d="M-130 -210 V-300" stroke={dark} strokeWidth="4" />
      <path d={`M-128 -296 Q${-90 + wave} ${-300 - wave * 0.6} ${-50 + wave * 1.4} ${-292} L${-50 + wave * 1.4} ${-268} Q${-90 + wave} ${-274 + wave * 0.6} -128 -270 Z`} fill="#b3322a" />
    </g>
  );
};

export const Scrub: React.FC<{seed: number; count: number; y0: number; y1: number; f: number}> = ({seed, count, y0, y1, f}) => {
  const b = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({length: count}, () => ({x: r() * (W + 800) - 400, y: y0 + r() * (y1 - y0), s: 0.5 + r() * 1, ph: r() * 6}));
  }, [seed, count, y0, y1]);
  return (
    <>
      {b.map((p, i) => {
        const k = (p.y - y0) / (y1 - y0), sc = (0.5 + k) * p.s;
        const w = Math.sin(f * 0.06 + p.ph) * 4 * sc;
        return (
          <g key={i} transform={`translate(${p.x} ${p.y}) scale(${sc})`}>
            <ellipse cx={26} cy={2} rx={46} ry={7} fill="#5a3a30" opacity=".28" />
            {[-26, -14, 0, 14, 26].map((dx, j) => <path key={j} d={`M${dx * 0.3} 0 Q${dx} ${-22} ${dx * 1.5 + w} ${-44 - (j % 2) * 10}`} stroke={mix('#6a5a2a', '#c9b060', (j % 3) / 2)} strokeWidth={3.2} fill="none" strokeLinecap="round" />)}
          </g>
        );
      })}
    </>
  );
};

export const SandStreaks: React.FC<{f: number; seed: number; count: number}> = ({f, seed, count}) => {
  const s = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({length: count}, () => ({x: r() * W, y: 600 + r() * 480, l: 80 + r() * 260, v: 8 + r() * 14, a: 0.1 + r() * 0.22}));
  }, [seed, count]);
  return (
    <>
      {s.map((p, i) => {
        const x = ((p.x + f * p.v) % (W + 600)) - 300;
        return <path key={i} d={`M${x} ${p.y} q${p.l * 0.5} -6 ${p.l} 2`} stroke="#fbe3b0" strokeWidth={2 + (i % 3)} opacity={p.a} fill="none" strokeLinecap="round" />;
      })}
    </>
  );
};
