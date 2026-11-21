import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Post} from '../fx/Post';
import {H, mix, mulberry32, ridge, W} from '../world/util';
import {Figure, FigureDefs, LightName} from '../rig/Figure';
import {Pal, SideOpts} from '../rig/Side';

/** one full-frame still: svg children + grading/grain/vignette */
export const Frame: React.FC<{grade?: string; night?: boolean; children: React.ReactNode; over?: React.ReactNode}> = ({grade, night, children, over}) => (
  <AbsoluteFill style={{background: '#000', filter: grade}}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
      <FigureDefs />
      {children}
    </svg>
    {over}
    <Post f={3} fade={1} night={night} />
  </AbsoluteFill>
);

export const Grad: React.FC<{id: string; stops: [number, string, number?][]; dir?: 'v' | 'h'}> = ({id, stops, dir = 'v'}) => (
  <linearGradient id={id} x1="0" y1="0" x2={dir === 'h' ? 1 : 0} y2={dir === 'v' ? 1 : 0}>
    {stops.map(([o, c, a], i) => <stop key={i} offset={o} stopColor={c} stopOpacity={a ?? 1} />)}
  </linearGradient>
);

export const SkyRect: React.FC<{id: string; stops: [number, string][]; h?: number}> = ({id, stops, h = H}) => (
  <><defs><Grad id={id} stops={stops} /></defs><rect width={W} height={h} fill={`url(#${id})`} /></>
);

export const Sil: React.FC<{seed: number; base: number; amp: number; fill: string; o?: number; freq?: number[]}> = ({seed, base, amp, fill, o = 1, freq}) => (
  <path d={ridge(seed, base, amp, freq).fill} fill={fill} opacity={o} />
);

export const Fog: React.FC<{id: string; y: number; h: number; c: string; o?: number}> = ({id, y, h, c, o = 0.5}) => (
  <><defs><Grad id={id} stops={[[0, c, 0], [0.5, c, o], [1, c, 0]]} /></defs><rect x={-40} y={y} width={W + 80} height={h} fill={`url(#${id})`} /></>
);

export const Glow: React.FC<{id: string; x: number; y: number; r: number; c: string; o?: number}> = ({id, x, y, r, c, o = 1}) => (
  <><defs><radialGradient id={id}><stop offset="0" stopColor={c} stopOpacity={o} /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient></defs><circle cx={x} cy={y} r={r} fill={`url(#${id})`} /></>
);

export const Stars: React.FC<{n?: number; seed?: number; ymax?: number}> = ({n = 90, seed = 5, ymax = 520}) => {
  const r = mulberry32(seed);
  return <>{Array.from({length: n}, (_, i) => <circle key={i} cx={r() * W} cy={r() * ymax} r={0.6 + r() * 1.6} fill="#fff" opacity={0.3 + r() * 0.6} />)}</>;
};

/** a flat-fronted building with a roof, rows of windows and a door */
export const House: React.FC<{x: number; y: number; w: number; h: number; wall: string; roof: string; lit?: number; seed?: number; rows?: number; cols?: number; roofH?: number; mansard?: boolean; shutters?: string}> = ({x, y, w, h, wall, roof, lit = 0.3, seed = 1, rows = 3, cols = 3, roofH = 60, mansard, shutters}) => {
  const r = mulberry32(seed);
  const cw = w / cols, rh = h / (rows + 0.6);
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={wall} />
      <rect x={x} y={y - h} width={w} height={h} fill="url(#houseShade)" />
      <polygon points={mansard ? `${x - 8},${y - h} ${x + 24},${y - h - roofH} ${x + w - 24},${y - h - roofH} ${x + w + 8},${y - h}` : `${x - 10},${y - h} ${x + w / 2},${y - h - roofH} ${x + w + 10},${y - h}`} fill={roof} />
      {Array.from({length: rows}).map((_, ri) => Array.from({length: cols}).map((_, ci) => {
        const on = r() < lit;
        const wx = x + ci * cw + cw * 0.25, wy = y - h + 18 + ri * rh, ww = cw * 0.5, wh = rh * 0.62;
        return (
          <g key={`${ri}-${ci}`}>
            {shutters && <><rect x={wx - ww * 0.32} y={wy} width={ww * 0.3} height={wh} fill={shutters} /><rect x={wx + ww * 1.02} y={wy} width={ww * 0.3} height={wh} fill={shutters} /></>}
            <rect x={wx - 3} y={wy - 3} width={ww + 6} height={wh + 6} fill={mix(wall, '#000', 0.35)} />
            <rect x={wx} y={wy} width={ww} height={wh} fill={on ? '#ffd48a' : '#2a3448'} />
            {on && <rect x={wx} y={wy} width={ww} height={wh} fill="#ffb050" opacity=".35" />}
            <line x1={wx + ww / 2} y1={wy} x2={wx + ww / 2} y2={wy + wh} stroke="#1a1410" strokeWidth={2} /><line x1={wx} y1={wy + wh / 2} x2={wx + ww} y2={wy + wh / 2} stroke="#1a1410" strokeWidth={2} />
          </g>
        );
      }))}
      <rect x={x + w / 2 - 16} y={y - 70} width={32} height={70} fill="#2a1a10" />
    </g>
  );
};
export const HouseDefs: React.FC = () => (
  <defs>
    <linearGradient id="houseShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity=".12" /><stop offset=".6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".35" /></linearGradient>
  </defs>
);

export const Cobbles: React.FC<{y: number; base: string; seed?: number}> = ({y, base, seed = 3}) => {
  const r = mulberry32(seed);
  return (
    <g>
      <rect x={0} y={y} width={W} height={H - y} fill={base} />
      {Array.from({length: 240}, (_, i) => {
        const yy = y + Math.pow(r(), 1.6) * (H - y), s = 8 + (yy - y) * 0.09;
        return <ellipse key={i} cx={r() * W} cy={yy} rx={s * 1.5} ry={s * 0.6} fill={mix(base, r() > 0.5 ? '#000' : '#fff', 0.1 + r() * 0.14)} />;
      })}
      <rect x={0} y={y} width={W} height={H - y} fill="url(#groundDark)" />
    </g>
  );
};
export const GroundDefs: React.FC = () => (
  <defs><linearGradient id="groundDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".05" /><stop offset="1" stopColor="#000" stopOpacity=".4" /></linearGradient></defs>
);

/** commonly used palettes */
export const khaki: Pal = {skin: '#e0a880', hair: '#3a2a1c', top: '#a39c66', bottom: '#8e8858', belt: '#6f4122', boots: '#7a4726', puttee: '#948e5c'};
export const civ = (top: string, bottom: string, hair = '#3a2a1c', skin = '#e0a880'): Pal => ({skin, hair, top, bottom, belt: '#2a1a10', boots: '#241810'});
export const kid = (face: 'left' | 'right', top = '#6a7a9a'): SideOpts => ({pal: civ(top, '#3a3a4a', '#5a3a22'), head: 'none', build: 0.78, stretch: 0.52, face});
export const man = (face: 'left' | 'right', top: string, bottom: string, extra: Partial<SideOpts> = {}): SideOpts => ({pal: civ(top, bottom), head: 'none', face, ...extra});

export const Fig: React.FC<{id: string; x: number; y: number; s?: number; o: SideOpts; p: any; light?: LightName; lit?: number; lo?: boolean; alpha?: number; art?: React.ReactNode}> = ({id, x, y, s = 0.567, o, p, light = 'warm', lit = 1, lo, alpha, art}) => (
  <Figure uid={id} x={x} y={y} s={s} o={o} p={p} light={light} lit={lit} lo={lo} alpha={alpha} art={art} />
);

export const Title: React.FC<{x: number; y: number; text: string; size?: number; c?: string; anchor?: 'start' | 'middle' | 'end'; ls?: number; weight?: number; serif?: boolean; italic?: boolean; o?: number}> = ({x, y, text, size = 40, c = '#f6e8c8', anchor = 'start', ls = 6, weight = 800, serif, italic, o = 1}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={serif ? 'Georgia, serif' : "'Helvetica Neue', Arial, sans-serif"} fontWeight={weight} fontStyle={italic ? 'italic' : 'normal'} fontSize={size} letterSpacing={ls} fill={c} opacity={o}>{text}</text>
);
