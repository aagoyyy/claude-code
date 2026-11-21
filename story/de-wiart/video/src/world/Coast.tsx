import React from 'react';
import {clamp, easeOut, lerp, mix, mulberry32, W, H} from './util';

export const HORIZON = 640;
const SUN = {x: 420, y: 600};

export const SeaSky: React.FC<{f: number}> = ({f}) => (
  <>
    <defs>
      <linearGradient id="sSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#26324e" /><stop offset=".35" stopColor="#6a5478" /><stop offset=".62" stopColor="#e0825e" /><stop offset=".86" stopColor="#ffb870" /><stop offset="1" stopColor="#ffdca0" />
      </linearGradient>
      <radialGradient id="sSun" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff4d6" /><stop offset=".15" stopColor="#ffd08a" stopOpacity=".9" /><stop offset=".45" stopColor="#ff9a5a" stopOpacity=".38" /><stop offset="1" stopColor="#ff8a4a" stopOpacity="0" /></radialGradient>
      <filter id="sCl"><feGaussianBlur stdDeviation="9" /></filter>
    </defs>
    <rect x={-800} y={-400} width={W + 1600} height={1060} fill="url(#sSky)" />
    <circle cx={SUN.x} cy={SUN.y} r={680} fill="url(#sSun)" opacity=".9" />
    <circle cx={SUN.x} cy={SUN.y} r={58} fill="#fff6dc" />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => {
      const x = ((i * 410 + f * (0.15 + i * 0.03)) % (W + 700)) - 300, y = 140 + (i % 4) * 90;
      return <g key={i} opacity={0.5}><ellipse cx={x} cy={y + 10} rx={220 + i * 14} ry={20} fill="#9a5a78" filter="url(#sCl)" /><ellipse cx={x - 30} cy={y - 4} rx={170} ry={11} fill="#ffc890" filter="url(#sCl)" opacity=".8" /></g>;
    })}
  </>
);

/** one band of sea: wavy surface, sun glitter column, foam crests. y0..y1 = band extent, k = 0 (far) .. 1 (near) */
export const SeaBand: React.FC<{f: number; y0: number; y1: number; k: number; speed?: number; off?: number}> = ({f, y0, y1, k, speed = 1, off = 0}) => {
  const top = mix('#4a6a88', '#1a3a54', k), bot = mix('#2a4a68', '#0a1c2c', k);
  const amp = 4 + k * 22, wl = 120 + k * 380;
  let d = `M-900 ${y1 + 200} L-900 ${y0}`;
  for (let x = -900; x <= W + 900; x += 24) d += ` L${x} ${(y0 + Math.sin((x + off) / wl * 6.283 + f * 0.06 * speed) * amp + Math.sin((x + off) / (wl * 0.43) * 6.283 - f * 0.09 * speed) * amp * 0.4).toFixed(1)}`;
  d += ` L${W + 900} ${y1 + 200} Z`;
  const rg = mulberry32(Math.round(y0));
  return (
    <>
      <defs><linearGradient id={`sb${Math.round(y0)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bot} /></linearGradient></defs>
      <path d={d} fill={`url(#sb${Math.round(y0)})`} />
      {/* sun glitter column */}
      {Array.from({length: 16}, (_, i) => <ellipse key={i} cx={SUN.x + (rg() - 0.5) * (80 + k * 260) + Math.sin(f * 0.1 + i) * 8} cy={y0 + (y1 - y0) * rg()} rx={12 + k * 60 * rg()} ry={1.6 + k * 3} fill="#ffe2a8" opacity={0.2 + 0.5 * rg() * (1 - k * 0.3)} />)}
      {/* wave crests */}
      {Array.from({length: 14}, (_, i) => { const x = ((rg() * 3000 + off + f * 1.2 * speed * (0.3 + k)) % 3200) - 600; return <path key={'c' + i} d={`M${x} ${y0 + (y1 - y0) * rg()} q${20 + k * 50} ${-4 - k * 6} ${40 + k * 100} 0`} stroke="#d8ecf6" strokeWidth={1.5 + k * 2.5} fill="none" opacity={0.15 + 0.3 * k} strokeLinecap="round" />; })}
    </>
  );
};

/** Vickers Wellington (side view, facing +x): geodetic fuselage, nacelle with spinning prop, fin, roundel; flame + smoke when `fire` > 0 */
export const Wellington: React.FC<{f: number; fire?: number}> = ({f, fire = 0}) => (
  <g>
    <defs>
      <linearGradient id="wBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8e9684" /><stop offset=".5" stopColor="#6a7262" /><stop offset="1" stopColor="#3e4638" /></linearGradient>
      <clipPath id="wClip"><path d="M-700 0 Q-720 -70 -560 -90 L420 -110 Q640 -110 720 -20 Q690 70 520 90 L-520 70 Q-690 60 -700 0 Z" /></clipPath>
      <radialGradient id="wFire" cx=".3" cy=".5"><stop offset="0" stopColor="#fff2b0" /><stop offset=".35" stopColor="#ffb02a" /><stop offset=".75" stopColor="#d8431a" /><stop offset="1" stopColor="#6a1a08" stopOpacity="0" /></radialGradient>
    </defs>
    {/* tail fin + tailplane */}
    <path d="M-600 -84 L-740 -330 L-520 -300 L-410 -100 Z" fill="#6a7262" stroke="#1f241a" strokeWidth="4" />
    <path d="M-740 -330 L-700 -296 L-540 -286 L-520 -300 Z" fill="#8e9684" opacity=".6" />
    <path d="M-640 -10 L-840 -26 L-840 4 L-640 24 Z" fill="#4e564a" stroke="#1f241a" strokeWidth="3" />
    {/* wing (edge-on) + nacelle */}
    <path d="M-120 36 L360 40 L380 76 L-120 70 Z" fill="#555d4c" stroke="#1f241a" strokeWidth="4" />
    <ellipse cx={90} cy={92} rx={150} ry={54} fill="#6a7262" stroke="#1f241a" strokeWidth="4" />
    <ellipse cx={90} cy={92} rx={150} ry={54} fill="url(#wBody)" opacity=".6" />
    {/* fuselage */}
    <path d="M-700 0 Q-720 -70 -560 -90 L420 -110 Q640 -110 720 -20 Q690 70 520 90 L-520 70 Q-690 60 -700 0 Z" fill="url(#wBody)" stroke="#1f241a" strokeWidth="5" />
    <g clipPath="url(#wClip)" stroke="#2a3024" strokeWidth="2" opacity=".5">
      {Array.from({length: 40}, (_, i) => <path key={i} d={`M${-720 + i * 38} -120 L${-640 + i * 38} 100 M${-640 + i * 38} -120 L${-720 + i * 38} 100`} />)}
    </g>
    <path d="M-560 -86 L400 -104" stroke="#d8dfcc" strokeWidth="5" opacity=".35" />
    {/* cockpit glazing, front gun turret, roundel, code letters */}
    <path d="M360 -108 Q520 -190 640 -90 L560 -70 Q470 -128 380 -100 Z" fill="#a8c8d8" stroke="#1f241a" strokeWidth="4" opacity=".85" />
    <path d="M400 -112 Q480 -160 560 -120" stroke="#fff" strokeWidth="5" opacity=".5" fill="none" />
    <circle cx={-220} cy={-6} r={74} fill="#1c3d8a" stroke="#1f241a" strokeWidth="3" /><circle cx={-220} cy={-6} r={56} fill="#f4f0e6" /><circle cx={-220} cy={-6} r={40} fill="#b3262a" /><circle cx={-220} cy={-6} r={18} fill="#f4f0e6" />
    <text x={-470} y={22} fontFamily="'Helvetica Neue', Arial" fontWeight={800} fontSize={86} fill="#d8d4c4" opacity=".85" letterSpacing={10}>WS</text>
    <path d="M-700 0 Q-780 -6 -820 -30" stroke="#1f241a" strokeWidth="6" fill="none" />
    {/* propeller disc (blurred) on the nacelle nose */}
    <ellipse cx={248} cy={92} rx={16} ry={150} fill="#222" opacity={0.5} style={{filter: 'blur(5px)'}} />
    {[0, 1, 2].map((i) => { const a = (f * 1.6 + i * 2.09) % 6.283; return <path key={i} d={`M248 92 L${248 + Math.sin(a) * 6} ${92 - Math.cos(a) * 150}`} stroke="#1a1a1a" strokeWidth="14" strokeLinecap="round" opacity=".6" />; })}
    {/* burning engine */}
    {fire > 0 && (
      <g opacity={clamp(fire)}>
        {Array.from({length: 10}, (_, i) => { const k = ((f * 0.22 + i * 0.1) % 1); return <ellipse key={'sm' + i} cx={30 - k * 760 - i * 20} cy={92 - k * 60 + Math.sin(f * 0.3 + i) * 12} rx={46 + k * 120} ry={32 + k * 80} fill="#161210" opacity={0.7 * (1 - k)} style={{filter: 'blur(14px)'}} />; })}
        {[0, 1, 2, 3, 4].map((i) => <path key={'fl' + i} d={`M${230 - i * 18} ${92 + (i % 2) * 14} Q${40 - 40 * Math.sin(f * 0.6 + i)} ${52 - i * 12} ${-170 - i * 38} ${92 + Math.sin(f * 0.8 + i) * 22} Q${40} ${128 + i * 8} ${230 - i * 18} ${92 + (i % 2) * 14} Z`} fill="url(#wFire)" opacity=".85" />)}
      </g>
    )}
  </g>
);

/** water column + spray + rings at an impact point */
export const Splash: React.FC<{x: number; y: number; age: number; r?: number}> = ({x, y, age, r = 140}) => {
  if (age < 0 || age > 90) return null;
  const rg = mulberry32(11);
  const up = easeOut(age / 14), k = clamp(age / 70);
  return (
    <g>
      {age < 50 && <path d={`M${x - r * 0.9} ${y} Q${x - r * 0.5} ${y - r * 4 * up} ${x} ${y - r * 5 * up} Q${x + r * 0.5} ${y - r * 4 * up} ${x + r * 0.9} ${y} Z`} fill="#e6f4fa" opacity={0.85 * (1 - clamp(age / 50))} style={{filter: 'blur(5px)'}} />}
      {Array.from({length: 36}, (_, i) => { const vx = (rg() - 0.5) * 60, vy = -(14 + rg() * 30), t = age * 0.55; return <circle key={i} cx={x + vx * t * 0.8} cy={y + vy * t + 0.5 * 1.4 * t * t} r={Math.max(1.5, r * 0.04 * (1 - k))} fill="#f2fafc" opacity={clamp(1.4 - age / 50)} />; })}
      {[0, 1, 2].map((i) => <ellipse key={i} cx={x} cy={y + 6} rx={r * (0.5 + (age - i * 6) * 0.07)} ry={r * (0.08 + (age - i * 6) * 0.012)} fill="none" stroke="#e6f4fa" strokeWidth={4} opacity={clamp(1 - (age - i * 6) / 60) * (age > i * 6 ? 1 : 0)} />)}
      {age < 30 && <ellipse cx={x} cy={y - r * 1.5 * up} rx={r * 0.9} ry={r * 1.6} fill="#fff" opacity={0.35 * (1 - age / 30)} style={{filter: 'blur(20px)'}} />}
    </g>
  );
};
export const lerpPt = (a: [number, number], b: [number, number], t: number): [number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
void H;
