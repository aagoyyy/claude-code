import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clamp, ease, easeOut, H, lerp, mulberry32, W} from '../world/util';
import {VictoriaCross} from '../ui/Callout';

/* ---- stylised map (parchment): Africa + Europe, route pen-drawn between two places, year rolling ---- */
const AFRICA = '300,100 470,80 600,120 700,170 790,230 850,330 980,380 900,470 830,520 800,640 740,760 660,860 580,900 520,860 480,740 420,640 360,540 240,520 180,430 200,330 250,230';
const EUROPE = '300,-150 450,-240 620,-220 740,-130 700,-30 560,10 400,-10 290,-70';
export const MAP_FRAMES = 60;
export const MapTransition: React.FC<{from: [number, number, string]; to: [number, number, string]; y0: number; y1: number; sub: string}> = ({from, to, y0, y1, sub}) => {
  const f = useCurrentFrame();
  const a = clamp(f / 8) * (1 - clamp((f - (MAP_FRAMES - 8)) / 8));
  const p = ease(clamp((f - 8) / 34));
  const x = lerp(from[0], to[0], p), yy = lerp(from[1], to[1], p) - Math.sin(p * Math.PI) * 90;
  const cx = lerp(from[0], to[0], p) * 0.5 + 250, cy = lerp(from[1], to[1], p) * 0.5 + 200;
  const mx = ((from[0] + to[0]) / 2), my = ((from[1] + to[1]) / 2) - 120;
  const yr = Math.round(lerp(y0, y1, p));
  const rg = mulberry32(5);
  return (
    <AbsoluteFill style={{background: '#0a0706'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="parch" cx=".5" cy=".5" r=".75"><stop offset="0" stopColor="#e6cf9c" /><stop offset=".7" stopColor="#c9a86c" /><stop offset="1" stopColor="#7a5a34" /></radialGradient>
          <filter id="parchN"><feTurbulence type="fractalNoise" baseFrequency=".02 .03" numOctaves="3" seed="4" /><feColorMatrix values="0 0 0 0 .3  0 0 0 0 .2  0 0 0 0 .1  0 0 0 .5 0" /></filter>
        </defs>
        <g opacity={a}>
          <rect width={W} height={H} fill="url(#parch)" /><rect width={W} height={H} filter="url(#parchN)" opacity=".5" />
          <g transform={`translate(${W / 2 - cx * 0.78} ${H / 2 - cy * 0.78 + 20}) scale(0.78)`}>
            {[...Array(14)].map((_, i) => <path key={'v' + i} d={`M${i * 90 - 100} -400 L${i * 90 - 100} 1200`} stroke="#8a6a3a" strokeWidth="1" opacity=".25" />)}
            {[...Array(14)].map((_, i) => <path key={'h' + i} d={`M-200 ${i * 90 - 400} L1300 ${i * 90 - 400}`} stroke="#8a6a3a" strokeWidth="1" opacity=".25" />)}
            <polygon points={AFRICA} fill="#d8bd86" stroke="#5a3e1c" strokeWidth="4" strokeLinejoin="round" />
            <polygon points={EUROPE} fill="#d8bd86" stroke="#5a3e1c" strokeWidth="4" strokeLinejoin="round" />
            {[...Array(40)].map((_, i) => <path key={'t' + i} d={`M${300 + rg() * 600} ${150 + rg() * 700} l10 -10 l10 10`} stroke="#8a6a3a" strokeWidth="2" fill="none" opacity=".35" />)}
            <path d={`M${from[0]} ${from[1]} Q${mx} ${my} ${to[0]} ${to[1]}`} stroke="#8a2a1c" strokeWidth="6" strokeDasharray="14 12" fill="none" strokeLinecap="round" pathLength={1} style={{strokeDasharray: '0.012 0.012'}} opacity={0.9} />
            <path d={`M${from[0]} ${from[1]} Q${mx} ${my} ${to[0]} ${to[1]}`} stroke="#c8402a" strokeWidth="7" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
            {[from, to].map((pt, i) => (
              <g key={i}><circle cx={pt[0]} cy={pt[1]} r={12} fill="#2a1a0c" /><circle cx={pt[0]} cy={pt[1]} r={5} fill="#e0b86a" /><text x={pt[0] + 22} y={pt[1] + 10} fontFamily="Georgia, serif" fontStyle="italic" fontSize={34} fill="#3a2410">{pt[2]}</text></g>
            ))}
            <g transform={`translate(${x} ${yy})`}><path d="M0 0 L-16 -44 Q0 -62 16 -44 Z" fill="#b3262a" stroke="#4a0e10" strokeWidth="3" /><circle cx={0} cy={-48} r={9} fill="#e8d2a0" stroke="#4a0e10" strokeWidth="2.5" /></g>
          </g>
          <text x={W / 2} y={H - 150} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={150} fill="#2a1808" opacity=".9" letterSpacing={6}>{yr}</text>
          <text x={W / 2} y={H - 96} textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={36} letterSpacing={8} fill="#5a3a1c">{sub}</text>
          <rect x={30} y={30} width={W - 60} height={H - 60} fill="none" stroke="#5a3e1c" strokeWidth="5" /><rect x={44} y={44} width={W - 88} height={H - 88} fill="none" stroke="#5a3e1c" strokeWidth="1.5" />
        </g>
        <rect width={W} height={H} fill="#10060a" opacity={0} />
      </svg>
    </AbsoluteFill>
  );
};

/* ---- macro insert: the Victoria Cross, rack-focus from blur to sharp, light sweep ---- */
export const MEDAL_FRAMES = 84;
export const MedalInsert: React.FC = () => {
  const f = useCurrentFrame();
  const sharp = easeOut(clamp(f / 30));
  const a = clamp(f / 8) * (1 - clamp((f - (MEDAL_FRAMES - 8)) / 8));
  const sway = 5 * Math.sin(f * 0.11) * (1 - clamp(f / 70) * 0.4);
  const glint = clamp((f - 26) / 28) * (1 - clamp((f - 54) / 6)) + 0.001;
  const rg = mulberry32(8);
  return (
    <AbsoluteFill style={{background: '#080505'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="mSpot" cx=".5" cy=".46" r=".6"><stop offset="0" stopColor="#7a5a38" stopOpacity=".85" /><stop offset=".6" stopColor="#2a1c10" stopOpacity=".5" /><stop offset="1" stopColor="#080505" stopOpacity="0" /></radialGradient>
          <filter id="mBlur"><feGaussianBlur stdDeviation={(1 - sharp) * 18} /></filter>
          <filter id="mBlur2"><feGaussianBlur stdDeviation={6 + (1 - sharp) * 4} /></filter>
        </defs>
        <g opacity={a}>
          <rect width={W} height={H} fill="url(#mSpot)" />
          <g filter="url(#mBlur2)" opacity=".7">{[...Array(26)].map((_, i) => <circle key={i} cx={rg() * W} cy={(rg() * H + f * (1 + rg() * 2)) % H} r={4 + rg() * 20} fill="#e0b86a" opacity={0.15 + rg() * 0.2} />)}</g>
          <g filter="url(#mBlur)" transform={`translate(${W / 2} ${H / 2 + 20})`}><VictoriaCross x={0} y={0} s={6.2} rot={sway} glint={glint} /></g>
          <g opacity={easeOut((f - 34) / 16)} transform={`translate(0 ${(1 - easeOut((f - 34) / 16)) * 20})`}>
            <text x={W / 2} y={H - 170} textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={70} letterSpacing={14} fill="#f1e2bc">VICTORIA CROSS</text>
            <text x={W / 2} y={H - 112} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={42} fill="#d9c7a0">penghargaan tertinggi Inggris · Somme, 1916</text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
