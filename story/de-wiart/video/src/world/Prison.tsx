import React from 'react';
import {clamp, mix, mulberry32, ridge, W, H} from './util';

export const LANT = {x: 980, y: 560};

/** side cut-away of the escape tunnel: soil strata, roots, timber props, plank ceiling, spoil heaps */
export const TunnelBG: React.FC<{f: number; scroll?: number}> = ({f, scroll = 0}) => {
  const rg = mulberry32(21);
  const flick = 0.82 + 0.18 * Math.sin(f * 0.7) * Math.sin(f * 0.23 + 1);
  return (
    <>
      <defs>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2c2016" /><stop offset=".5" stopColor="#3e2c1e" /><stop offset="1" stopColor="#1e1510" /></linearGradient>
        <linearGradient id="tun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#120c08" /><stop offset=".55" stopColor="#2a1c12" /><stop offset="1" stopColor="#46341f" /></linearGradient>
        <radialGradient id="lamp" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#ffe2a0" stopOpacity={0.95 * flick} /><stop offset=".25" stopColor="#ffb050" stopOpacity={0.5 * flick} /><stop offset="1" stopColor="#ff8a2a" stopOpacity="0" /></radialGradient>
        <linearGradient id="shaftL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dfe8f4" stopOpacity=".75" /><stop offset="1" stopColor="#dfe8f4" stopOpacity="0" /></linearGradient>
      </defs>
      <rect x={-300} y={-100} width={W + 600} height={H + 300} fill="url(#soil)" />
      {Array.from({length: 40}, (_, i) => <path key={i} d={`M${rg() * 2400 - 200} ${rg() * 1100} q${40 + rg() * 120} ${-6 + rg() * 12} ${80 + rg() * 220} 0`} stroke={rg() > 0.5 ? '#5a4230' : '#1a120c'} strokeWidth={2 + rg() * 4} opacity={0.35} fill="none" strokeLinecap="round" />)}
      {Array.from({length: 26}, (_, i) => <ellipse key={'s' + i} cx={rg() * 2300 - 150} cy={rg() > 0.5 ? 60 + rg() * 360 : 1030 + rg() * 90} rx={12 + rg() * 40} ry={8 + rg() * 24} fill={mix('#6a5a48', '#1a140e', rg())} opacity=".8" />)}
      {Array.from({length: 9}, (_, i) => { const x = rg() * 2200 - 100; return <path key={'r' + i} d={`M${x} 380 Q${x + 30} ${430 + rg() * 60} ${x - 10} ${480}`} stroke="#6a4a2a" strokeWidth={3 + rg() * 3} fill="none" opacity=".8" />; })}
      {/* the tunnel itself */}
      <path d="M-300 470 L2300 470 L2300 1010 L-300 1010 Z" fill="url(#tun)" />
      <rect x={-300} y={470} width={W + 600} height={26} fill="#1a1108" />
      {Array.from({length: 40}, (_, i) => <path key={'pl' + i} d={`M${i * 70 - 100 - (scroll % 70)} 470 V496`} stroke="#050302" strokeWidth="3" />)}
      {[240, 690, 1140, 1590, 2040].map((x, i) => { const xx = x - ((scroll * 0.9) % 450) + (x - 240 < 0 ? 0 : 0); return (
        <g key={i}>
          <rect x={xx - 18} y={470} width={36} height={540} fill="#5a3c22" stroke="#1a1008" strokeWidth="3" /><rect x={xx - 18} y={470} width={14} height={540} fill="#8a5c34" opacity=".7" />
          <rect x={xx - 120} y={470} width={240} height={34} fill="#6a4628" stroke="#1a1008" strokeWidth="3" /><rect x={xx - 120} y={470} width={240} height={10} fill="#9a6a3a" opacity=".7" />
          <path d={`M${xx - 18} 600 L${xx - 100} 480 M${xx + 18} 600 L${xx + 100} 480`} stroke="#4a2e18" strokeWidth="16" />
        </g>); })}
      {/* spoil heaps, sacks of earth */}
      {[300, 1500, 1850].map((x, i) => <g key={'h' + i}><path d={`M${x - 160} 1010 Q${x - 70} 880 ${x} 860 Q${x + 90} 880 ${x + 170} 1010 Z`} fill="#4a3624" stroke="#1a1008" strokeWidth="3" /><path d={`M${x - 90} 990 Q${x - 30} 910 ${x} 900`} stroke="#8a6a46" strokeWidth="6" fill="none" opacity=".5" /></g>)}
      <rect x={-300} y={996} width={W + 600} height={20} fill="#6a5238" opacity=".7" />
      {/* light shaft from the surface at the left + ladder */}
      <polygon points="40,-100 190,-100 260,470 -30,470" fill="url(#shaftL)" opacity=".8" />
      <rect x={30} y={-100} width={170} height={580} fill="none" />
      <g stroke="#6a4628" strokeWidth="8"><path d="M70 100 V470 M150 100 V470" />{Array.from({length: 8}, (_, i) => <path key={i} d={`M70 ${130 + i * 46} H150`} />)}</g>
      {/* hanging lantern with flicker */}
      <path d={`M${LANT.x} 496 V${LANT.y - 18}`} stroke="#2a1a0c" strokeWidth="4" />
      <g transform={`translate(${LANT.x} ${LANT.y})`}><rect x={-16} y={-18} width={32} height={42} rx={5} fill="#3a2a1a" stroke="#120a04" strokeWidth="3" /><rect x={-10} y={-10} width={20} height={28} fill="#ffd27a" opacity={flick} /><path d="M-16 -18 L0 -34 L16 -18 Z" fill="#2a1a0c" /></g>
      <circle cx={LANT.x} cy={LANT.y} r={900} fill="url(#lamp)" style={{mixBlendMode: 'screen' as any}} />
      <path d="M1560 496 V560" stroke="#2a1a0c" strokeWidth="4" /><g transform="translate(1560 574)"><rect x={-14} y={-16} width={28} height={36} rx={5} fill="#3a2a1a" stroke="#120a04" strokeWidth="3" /><rect x={-8} y={-9} width={16} height={24} fill="#ffd27a" opacity={flick} /></g>
      <circle cx={1560} cy={574} r={620} fill="url(#lamp)" style={{mixBlendMode: 'screen' as any}} />
    </>
  );
};

/** darkness around the lantern light, drawn above the cast so the tunnel really feels lit by one flame */
export const TunnelDark: React.FC<{f: number}> = ({f}) => {
  const fl = 0.85 + 0.15 * Math.sin(f * 0.7) * Math.sin(f * 0.23 + 1);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
      <defs><radialGradient id="tdark" cx={LANT.x / W} cy={LANT.y / H} r={0.62 * fl}><stop offset=".25" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#030201" stopOpacity=".9" /></radialGradient></defs>
      <rect width={W} height={H} fill="url(#tdark)" opacity={0.7} />
    </svg>
  );
};

/** night countryside: moon, stars, castle on a hill with lit windows, sweeping searchlight, cypresses */
export const NightSky: React.FC<{f: number}> = ({f}) => {
  const rg = mulberry32(5);
  return (
    <>
      <defs>
        <linearGradient id="nSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050a16" /><stop offset=".6" stopColor="#101c34" /><stop offset="1" stopColor="#24334e" /></linearGradient>
        <radialGradient id="moon" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#f4f6ff" /><stop offset=".15" stopColor="#dfe6ff" stopOpacity=".9" /><stop offset=".5" stopColor="#8fa4d8" stopOpacity=".25" /><stop offset="1" stopColor="#6a80b8" stopOpacity="0" /></radialGradient>
      </defs>
      <rect x={-800} y={-300} width={W + 1600} height={1000} fill="url(#nSk)" />
      {Array.from({length: 110}, (_, i) => <circle key={i} cx={rg() * (W + 800) - 400} cy={rg() * 520} r={0.6 + rg() * 1.6} fill="#dfe8ff" opacity={0.3 + 0.5 * Math.sin(f * 0.07 + i) ** 2} />)}
      <circle cx={1500} cy={230} r={520} fill="url(#moon)" /><circle cx={1500} cy={230} r={46} fill="#f6f8ff" />
    </>
  );
};
export const Castle: React.FC<{f: number; x: number; y: number; s: number; haze: number}> = ({f, x, y, s, haze}) => {
  const c = mix('#141e3a', '#2a3a58', haze), c2 = mix('#1c2850', '#3a4c74', haze), lite = mix('#6a7ca8', '#9ab0dc', haze), lit = '#ffb25a';
  const rg = mulberry32(17);
  const crn = (x0: number, w: number, yy: number) => Array.from({length: Math.floor(w / 24)}, (_, i) => <g key={i}><rect x={x0 + i * 24 + 3} y={yy - 14} width={14} height={16} fill={c} /><rect x={x0 + i * 24 + 13} y={yy - 14} width={4} height={16} fill={lite} opacity=".7" /><rect x={x0 + i * 24 + 3} y={yy - 14} width={14} height={3} fill={lite} opacity=".5" /></g>);
  /** masonry block with courses, offset joints, weathering and moonlit right edge */
  const blk = (x0: number, y0: number, w: number, h: number, k: number) => (
    <g>
      <rect x={x0} y={y0} width={w} height={h} fill={c} />
      {Array.from({length: Math.floor(h / 22)}, (_, r) => <g key={r}><path d={`M${x0} ${y0 + 12 + r * 22} h${w}`} stroke="#060b1a" strokeWidth="2" opacity=".55" />{Array.from({length: Math.floor(w / 34)}, (_, q) => <path key={q} d={`M${x0 + ((r % 2) * 17) + q * 34 + 6} ${y0 + r * 22} v12`} stroke="#060b1a" strokeWidth="1.6" opacity=".45" />)}</g>)}
      {Array.from({length: 14}, (_, i) => <rect key={'b' + i} x={x0 + rg() * (w - 20)} y={y0 + rg() * (h - 16)} width={14 + rg() * 24} height={8 + rg() * 8} fill={rg() > 0.5 ? c2 : '#0a1226'} opacity=".5" />)}
      <rect x={x0 + w * 0.55} y={y0} width={w * 0.45} height={h} fill="#050a18" opacity=".28" />
      <rect x={x0 + w - 7} y={y0} width={7} height={h} fill={lite} opacity=".8" />
      <rect x={x0} y={y0} width={w} height={5} fill={lite} opacity={0.5 + k * 0.2} />
    </g>
  );
  const torch = (tx: number, ty: number, ph: number) => (
    <g transform={`translate(${tx} ${ty})`}><rect x={-3} y={0} width={6} height={26} fill="#3a2410" />
      <circle cx={0} cy={-8} r={46} fill="#ffb25a" opacity={0.22 + 0.1 * Math.sin(f * 0.5 + ph)} style={{filter: 'blur(14px)'}} />
      <path d={`M0 0 Q${-9 + 3 * Math.sin(f * 0.6 + ph)} -16 0 -28 Q${9 + 3 * Math.sin(f * 0.7 + ph)} -16 0 0 Z`} fill="#ffcf6a" /><path d="M0 0 Q-4 -10 0 -18 Q4 -10 0 0 Z" fill="#fff2b0" /></g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* the rock the castle stands on: jagged face with strata, moonlit lip */}
      <path d="M-640 60 L-520 0 L-470 -50 L-380 -34 L-300 -90 L-210 -70 L-120 -92 L120 -92 L220 -70 L320 -100 L420 -60 L520 -20 L600 30 L680 60 Z" fill={mix('#0c1428', '#2a3a58', haze * 0.8)} />
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M${-560 + i * 30} ${-50 + i * 14} Q0 ${-70 + i * 12} ${640 - i * 40} ${-20 + i * 10}`} stroke="#060b18" strokeWidth="3" fill="none" opacity=".45" />)}
      <path d="M-520 0 L-470 -50 L-380 -34 L-300 -90 L-210 -70 L-120 -92 L120 -92 L220 -70 L320 -100 L420 -60 L520 -20" fill="none" stroke={lite} strokeWidth="3" opacity=".7" />
      {blk(-210, -300, 420, 230, 0)}{crn(-210, 420, -300)}
      {blk(-250, -420, 90, 350, 1)}{crn(-250, 90, -420)}
      {blk(160, -380, 96, 310, 1)}{crn(160, 96, -380)}
      {blk(-40, -470, 80, 170, 1)}<path d="M-52 -470 L0 -540 L52 -470 Z" fill={c} /><path d="M0 -540 L52 -470" stroke={lite} strokeWidth="4" opacity=".7" />
      <path d="M0 -540 V-600" stroke="#050a18" strokeWidth="3" /><path d={`M2 -598 Q${26 + 6 * Math.sin(f * 0.2)} -590 ${44 + 8 * Math.sin(f * 0.2)} -594 L${44 + 8 * Math.sin(f * 0.2)} -574 Q${26} -578 2 -580 Z`} fill="#8a1c22" />
      <path d="M-70 -70 Q-70 -140 -30 -140 Q10 -140 10 -70 Z" fill="#05080f" /><path d="M-62 -70 Q-62 -128 -30 -128" stroke="#2a3558" strokeWidth="3" fill="none" />
      {[[-220, -360], [-200, -250], [190, -330], [-20, -420], [60, -240], [-100, -230], [120, -250], [-20, -170]].map(([wx, wy], i) => (
        <g key={i}><circle cx={wx + 8} cy={wy + 13} r={30} fill={lit} opacity={0.18 + 0.14 * Math.sin(f * 0.1 + i * 2) ** 2} style={{filter: 'blur(8px)'}} /><rect x={wx} y={wy} width={16} height={26} rx={7} fill={lit} opacity={0.6 + 0.35 * Math.sin(f * 0.1 + i * 2) ** 2} /></g>
      ))}
      {torch(-150, -300, 0)}{torch(60, -300, 2)}{torch(-210, -300, 4)}
    </g>
  );
};
export const sweepAngle = (f: number, phase: number, spread: number, aim?: {x: number; y: number; k: number}, x = 0, y = 0) => {
  const nat = -1.05 + Math.sin(f * 0.035 + phase) * spread;
  return aim ? nat + (Math.atan2(aim.y - y, aim.x - x) - nat) * aim.k : nat;
};
export const Sweep: React.FC<{f: number; x: number; y: number; phase?: number; spread?: number; aim?: {x: number; y: number; k: number}}> = ({f, x, y, phase = 0, spread = 0.5, aim}) => {
  const a = sweepAngle(f, phase, spread, aim, x, y);
  const L = 2600, w = 0.07, rg = mulberry32(31 + Math.round(phase * 10));
  const ux = Math.cos(a), uy = Math.sin(a);
  return (
    <g style={{mixBlendMode: 'screen' as any}}>
      <defs>
        <linearGradient id={`sw${phase}`} gradientUnits="userSpaceOnUse" x1={x} y1={y} x2={x + ux * L} y2={y + uy * L}><stop offset="0" stopColor="#f2f6ff" stopOpacity=".72" /><stop offset=".7" stopColor="#dce6ff" stopOpacity=".16" /><stop offset="1" stopColor="#dce6ff" stopOpacity="0" /></linearGradient>
        <filter id="swb"><feGaussianBlur stdDeviation="9" /></filter>
        <radialGradient id="swlamp"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#cfdcff" stopOpacity="0" /></radialGradient>
      </defs>
      <polygon filter="url(#swb)" points={`${x},${y} ${x + Math.cos(a - w) * L},${y + Math.sin(a - w) * L} ${x + Math.cos(a + w) * L},${y + Math.sin(a + w) * L}`} fill={`url(#sw${phase})`} />
      <polygon points={`${x},${y} ${x + Math.cos(a - w * 0.3) * L},${y + Math.sin(a - w * 0.3) * L} ${x + Math.cos(a + w * 0.3) * L},${y + Math.sin(a + w * 0.3) * L}`} fill={`url(#sw${phase})`} opacity=".5" />
      {/* motes of dust and mist glittering inside the beam */}
      {Array.from({length: 46}, (_, i) => { const d = (0.06 + rg() * 0.8) * L, off = (rg() - 0.5) * 2 * Math.tan(w) * d * 0.9, tw = 0.4 + 0.6 * Math.sin(f * 0.15 + i * 2) ** 2; return <circle key={i} cx={x + ux * d - uy * off} cy={y + uy * d + ux * off + Math.sin(f * 0.05 + i) * 6} r={1.4 + rg() * 3} fill="#fff" opacity={0.55 * tw * (1 - d / L)} />; })}
      <circle cx={x} cy={y} r={34} fill="url(#swlamp)" />
    </g>
  );
};
/** pool of light where the beam meets the ground, plus low mist that catches the light */
export const LightPool: React.FC<{f: number; x: number; y: number; k: number; w?: number}> = ({f, x, y, k, w = 640}) => (
  <g style={{mixBlendMode: 'screen' as any}} opacity={k}>
    <defs>
      <radialGradient id="lpool"><stop offset="0" stopColor="#e6eeff" stopOpacity=".62" /><stop offset=".55" stopColor="#c8d8ff" stopOpacity=".3" /><stop offset="1" stopColor="#b0c4ff" stopOpacity="0" /></radialGradient>
      <filter id="lmist"><feGaussianBlur stdDeviation="16" /></filter>
    </defs>
    <ellipse cx={x} cy={y} rx={w} ry={w * 0.19} fill="url(#lpool)" />
    <ellipse cx={x} cy={y} rx={w * 0.55} ry={w * 0.1} fill="#f2f6ff" opacity=".2" />
    {Array.from({length: 9}, (_, i) => { const dx = ((f * (0.4 + (i % 3) * 0.25) + i * 150) % (w * 2.4)) - w * 1.2; const lit = Math.max(0, 1 - Math.abs(dx) / w); return <ellipse key={i} cx={x + dx} cy={y - 24 - (i % 4) * 22} rx={150 + (i % 3) * 40} ry={20 + (i % 2) * 10} fill="#dce6ff" opacity={0.34 * lit} filter="url(#lmist)" />; })}
  </g>
);
export const Cypress: React.FC<{x: number; y: number; s: number; haze: number; seed: number}> = ({x, y, s, haze, seed}) => {
  const c = mix('#07100e', '#2a3a48', haze), r = mulberry32(seed);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-5 * s} y={-30 * s} width={10 * s} height={30 * s} fill="#1a1008" />
      <path d={`M0 ${-300 * s} Q${70 * s} ${-170 * s} ${58 * s} ${-30 * s} L${-58 * s} ${-30 * s} Q${-70 * s} ${-170 * s} 0 ${-300 * s} Z`} fill={c} />
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M${(r() - 0.5) * 30 * s} ${(-260 + i * 34) * s} q${14 * s} ${14 * s} ${(r() - 0.3) * 26 * s} ${30 * s}`} stroke="#8aa0c0" strokeWidth={2 * s} fill="none" opacity={0.14 * (1 - haze)} />)}
    </g>
  );
};
export const nightGround = (y: number) => mix('#27344c', '#0a1018', clamp((y - 690) / 400));
export const nightRidge = (seed: number, base: number, amp: number, haze: number) => {
  const rd = ridge(seed, base, amp, [0.004, 0.011, 0.028]);
  return {rd, fill: mix('#070d18', '#2a3a58', haze), rim: '#8aa4d8'};
};
