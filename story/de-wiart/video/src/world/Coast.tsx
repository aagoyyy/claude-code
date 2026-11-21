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

/** Vickers Wellington, 3/4 view (fuselage in profile, near wing sweeping toward the viewer, far wing behind), facing +x */
export const Wellington: React.FC<{f: number; fire?: number}> = ({f, fire = 0}) => (
  <g>
    <defs>
      <linearGradient id="wBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9aa28c" /><stop offset=".5" stopColor="#6e7666" /><stop offset="1" stopColor="#3e4638" /></linearGradient>
      <linearGradient id="wWing" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a7262" /><stop offset="1" stopColor="#434b3d" /></linearGradient>
      <clipPath id="wClip"><path d="M-760 14 Q-760 -26 -620 -64 L300 -112 Q520 -118 640 -70 Q700 -40 690 8 Q650 70 470 96 L-540 82 Q-740 70 -760 14 Z" /></clipPath>
      <radialGradient id="wFire" cx=".3" cy=".5"><stop offset="0" stopColor="#fff2b0" /><stop offset=".35" stopColor="#ffb02a" /><stop offset=".75" stopColor="#d8431a" /><stop offset="1" stopColor="#6a1a08" stopOpacity="0" /></radialGradient>
    </defs>
    {/* far wing, far engine and far tailplane (behind the fuselage) */}
    <path d="M60 -90 L360 -100 L260 -330 L10 -300 Z" fill="#555d4c" stroke="#1f241a" strokeWidth="4" opacity=".92" />
    <ellipse cx={150} cy={-250} rx={78} ry={30} fill="#4a5242" stroke="#1f241a" strokeWidth="3" />
    <ellipse cx={226} cy={-250} rx={9} ry={92} fill="#222" opacity=".42" style={{filter: 'blur(4px)'}} />
    <path d="M-640 -40 L-560 -170 L-760 -190 L-780 -70 Z" fill="#4e564a" stroke="#1f241a" strokeWidth="3" />
    {/* tail fin */}
    <path d="M-560 -60 L-690 -330 L-470 -310 L-370 -92 Z" fill="#6e7666" stroke="#1f241a" strokeWidth="4" />
    <path d="M-690 -330 L-650 -296 L-520 -288 L-470 -310 Z" fill="#9aa28c" opacity=".55" />
    {/* near tailplane */}
    <path d="M-640 24 L-420 36 L-520 160 L-780 130 Z" fill="url(#wWing)" stroke="#1f241a" strokeWidth="3" />
    {/* fuselage: round nose turret, geodetic lattice, tapering tail */}
    <path d="M-760 14 Q-760 -26 -620 -64 L300 -112 Q520 -118 640 -70 Q700 -40 690 8 Q650 70 470 96 L-540 82 Q-740 70 -760 14 Z" fill="url(#wBody)" stroke="#1f241a" strokeWidth="5" />
    <g clipPath="url(#wClip)" stroke="#2a3024" strokeWidth="2" opacity=".5">
      {Array.from({length: 40}, (_, i) => <path key={i} d={`M${-780 + i * 38} -130 L${-700 + i * 38} 110 M${-700 + i * 38} -130 L${-780 + i * 38} 110`} />)}
    </g>
    <path d="M-600 -52 L300 -98" stroke="#e0e6d4" strokeWidth="5" opacity=".35" />
    <path d="M-700 46 Q-100 80 470 76" stroke="#000" strokeWidth="14" fill="none" opacity=".22" />
    {/* near wing sweeping toward the viewer with engine + prop disc */}
    <path d="M40 50 L410 62 L250 420 L-120 380 Z" fill="url(#wWing)" stroke="#1f241a" strokeWidth="5" />
    <path d="M40 50 L410 62 L394 96 L50 84 Z" fill="#8a9280" opacity=".5" />
    <path d="M-20 160 L330 172 M-60 270 L290 282" stroke="#2a3024" strokeWidth="3" opacity=".5" />
    <ellipse cx={170} cy={246} rx={120} ry={48} fill="#6e7666" stroke="#1f241a" strokeWidth="4" />
    <ellipse cx={170} cy={246} rx={120} ry={48} fill="url(#wBody)" opacity=".55" />
    <ellipse cx={278} cy={246} rx={15} ry={130} fill="#222" opacity={0.5} style={{filter: 'blur(5px)'}} />
    {[0, 1, 2].map((i) => { const a = (f * 1.6 + i * 2.09) % 6.283; return <path key={i} d={`M278 246 L${278 + Math.sin(a) * 5} ${246 - Math.cos(a) * 130}`} stroke="#1a1a1a" strokeWidth="13" strokeLinecap="round" opacity=".6" />; })}
    {/* glazed nose, roundel, code letters */}
    <path d="M330 -112 Q520 -200 650 -80 L560 -64 Q480 -126 350 -96 Z" fill="#a8c8d8" stroke="#1f241a" strokeWidth="4" opacity=".88" />
    <path d="M380 -118 Q470 -160 560 -112" stroke="#fff" strokeWidth="5" opacity=".5" fill="none" />
    <circle cx={-250} cy={-10} r={74} fill="#1c3d8a" stroke="#1f241a" strokeWidth="3" /><circle cx={-250} cy={-10} r={56} fill="#f4f0e6" /><circle cx={-250} cy={-10} r={40} fill="#b3262a" /><circle cx={-250} cy={-10} r={18} fill="#f4f0e6" />
    <text x={-520} y={20} fontFamily="'Helvetica Neue', Arial" fontWeight={800} fontSize={86} fill="#d8d4c4" opacity=".85" letterSpacing={10}>WS</text>
    {/* burning engine on the near wing: fire, then black smoke streaming back */}
    {fire > 0 && (
      <g opacity={clamp(fire)}>
        {Array.from({length: 10}, (_, i) => { const k = ((f * 0.22 + i * 0.1) % 1); return <ellipse key={'sm' + i} cx={90 - k * 760 - i * 20} cy={246 - k * 120 + Math.sin(f * 0.3 + i) * 12} rx={46 + k * 120} ry={32 + k * 80} fill="#161210" opacity={0.7 * (1 - k)} style={{filter: 'blur(14px)'}} />; })}
        {[0, 1, 2, 3, 4].map((i) => <path key={'fl' + i} d={`M${240 - i * 18} ${246 + (i % 2) * 14} Q${60 - 40 * Math.sin(f * 0.6 + i)} ${206 - i * 12} ${-110 - i * 38} ${246 + Math.sin(f * 0.8 + i) * 22} Q${60} ${284 + i * 8} ${240 - i * 18} ${246 + (i % 2) * 14} Z`} fill="url(#wFire)" opacity=".85" />)}
      </g>
    )}
  </g>
);

/** a ditching / impact in water: ragged foam crown, fine mist, droplets with trails, bow wave and a long foam wake; no clean column */
export const Splash: React.FC<{x: number; y: number; age: number; r?: number; dir?: number}> = ({x, y, age, r = 140, dir = 1}) => {
  if (age < 0 || age > 110) return null;
  const rg = mulberry32(11);
  const up = easeOut(age / 12), k = clamp(age / 90);
  return (
    <g>
      {/* long foam wake left behind on the surface */}
      {age > 2 && Array.from({length: 22}, (_, i) => <ellipse key={'w' + i} cx={x - dir * (i * r * 0.55 + 20)} cy={y + 8 + (i % 3) * 3} rx={r * (0.5 + (i % 4) * 0.12)} ry={r * 0.05} fill="#e8f4f8" opacity={clamp(0.7 - i * 0.03 - age / 150) * clamp((age - i * 0.5) / 6)} style={{filter: 'blur(3px)'}} />)}
      {/* crown of ragged foam: many overlapping blobs that rise and collapse */}
      {Array.from({length: 26}, (_, i) => {
        const a = (i / 26) * Math.PI - Math.PI * 0.05, rr = r * (0.4 + rg() * 0.9), h = r * (0.6 + rg() * 2.1) * up * (1 - clamp((age - 8 - rg() * 12) / 44));
        return <circle key={'f' + i} cx={x + Math.cos(a) * rr * 1.3 * (0.6 + up * 0.5)} cy={y - Math.max(0, Math.sin(a) * h)} r={r * (0.1 + rg() * 0.18) * (1 + up * 0.6)} fill="#f2fafc" opacity={0.82 * (1 - clamp((age - 10) / 50))} style={{filter: 'blur(2px)'}} />;
      })}
      {/* mist */}
      {age < 60 && <ellipse cx={x} cy={y - r * 1.2 * up} rx={r * 1.8} ry={r * 1.1} fill="#fff" opacity={0.32 * (1 - age / 60)} style={{filter: 'blur(22px)'}} />}
      {/* droplets with short trails */}
      {Array.from({length: 46}, (_, i) => {
        const vx = (rg() - 0.5) * 70, vy = -(14 + rg() * 34), t = age * 0.55, px = x + vx * t * 0.9, py = y + vy * t + 0.5 * 1.5 * t * t, ox = x + vx * (t - 1) * 0.9, oy = y + vy * (t - 1) + 0.5 * 1.5 * (t - 1) ** 2;
        return py > y + 4 ? null : <g key={'d' + i} opacity={clamp(1.4 - age / 46)}><line x1={ox} y1={oy} x2={px} y2={py} stroke="#e2f2f8" strokeWidth={2.2} strokeLinecap="round" opacity=".6" /><circle cx={px} cy={py} r={Math.max(1.4, r * 0.035 * (1 - k))} fill="#f6fcff" /></g>;
      })}
      {[0, 1, 2, 3].map((i) => <ellipse key={'r' + i} cx={x} cy={y + 6} rx={r * (0.5 + (age - i * 7) * 0.08)} ry={r * (0.08 + (age - i * 7) * 0.014)} fill="none" stroke="#e6f4fa" strokeWidth={3.5} opacity={clamp(1 - (age - i * 7) / 70) * (age > i * 7 ? 1 : 0)} />)}
    </g>
  );
};

/** swimmer: ripple rings at the body, foam trail behind, spray where each arm enters and where the feet kick */
export const SwimFx: React.FC<{x: number; y: number; f: number; dir?: number; s?: number}> = ({x, y, f, dir = 1, s = 1}) => (
  <g>
    {Array.from({length: 14}, (_, i) => <ellipse key={'t' + i} cx={x - dir * (60 + i * 34) * s} cy={y + 8 + (i % 2) * 4} rx={(26 + i * 6) * s} ry={4 * s} fill="#eaf6fa" opacity={clamp(0.65 - i * 0.045)} style={{filter: 'blur(2px)'}} />)}
    {[0, 1, 2].map((i) => { const p = ((f * 0.05 + i / 3) % 1); return <ellipse key={'r' + i} cx={x} cy={y + 8} rx={(110 + p * 200) * s} ry={(12 + p * 22) * s} fill="none" stroke="#dff0f6" strokeWidth={3 * s} opacity={0.6 * (1 - p)} />; })}
    {/* arm entry spray (alternates) and flutter-kick splashes */}
    {[0, 1].map((i) => { const ph = ((f * 20 + i * 180) % 360) / 360; const on = ph > 0.45 && ph < 0.6; return on ? <g key={'a' + i} opacity={1 - Math.abs(ph - 0.52) * 10}>{Array.from({length: 7}, (_, j) => <circle key={j} cx={x + dir * (150 + j * 6) * s + (j - 3) * 8} cy={y - (10 + (j % 3) * 14) * s} r={3.2 * s} fill="#f4fbff" />)}</g> : null; })}
    {Array.from({length: 9}, (_, i) => { const t = (f * 0.25 + i * 0.37) % 1; return <circle key={'k' + i} cx={x - dir * (250 + i * 8) * s + (i - 4) * 6} cy={y - t * 40 * s} r={(3 + (i % 3)) * s} fill="#f4fbff" opacity={0.8 * (1 - t)} />; })}
  </g>
);
export const lerpPt = (a: [number, number], b: [number, number], t: number): [number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
void H;
