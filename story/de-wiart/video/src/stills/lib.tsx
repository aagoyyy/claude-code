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
      <DetailDefs /><HouseDefs /><GroundDefs />
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

/* =============================== DETAIL KIT (v2) =============================== */
/** shared filters/patterns: noise-in-shape overlays, blurs, brick/tile patterns */
export const DetailDefs: React.FC = () => (
  <defs>
    <filter id="nzDark" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".05 .09" numOctaves="4" seed="3" /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.6 -.55" /><feComposite in2="SourceAlpha" operator="in" /></filter>
    <filter id="nzLight" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".12 .2" numOctaves="3" seed="8" /><feColorMatrix values="0 0 0 0 1  0 0 0 0 .94  0 0 0 0 .82  0 0 0 1.5 -.78" /><feComposite in2="SourceAlpha" operator="in" /></filter>
    <filter id="nzFine" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="5" /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.2 -.4" /><feComposite in2="SourceAlpha" operator="in" /></filter>
    <filter id="blS"><feGaussianBlur stdDeviation="2" /></filter>
    <filter id="blM"><feGaussianBlur stdDeviation="6" /></filter>
    <filter id="blL"><feGaussianBlur stdDeviation="16" /></filter>
    <filter id="blXL"><feGaussianBlur stdDeviation="34" /></filter>
    <pattern id="brickP" width="64" height="30" patternUnits="userSpaceOnUse"><rect width="64" height="30" fill="none" /><path d="M0 .5H64M0 15.5H64M0 0V15M32 15V30M64 0V15" stroke="#000" strokeOpacity=".28" strokeWidth="2" /><path d="M2 2H30M34 17H62" stroke="#fff" strokeOpacity=".07" strokeWidth="2" /></pattern>
    <pattern id="tileP" width="26" height="18" patternUnits="userSpaceOnUse"><path d="M0 17.5H26M13 0V9M0 9V18M26 9V18M0 8.5H26" stroke="#000" strokeOpacity=".35" strokeWidth="2" fill="none" /><path d="M2 3H24" stroke="#fff" strokeOpacity=".08" strokeWidth="2" /></pattern>
    <pattern id="blockP" width="120" height="54" patternUnits="userSpaceOnUse"><path d="M0 .5H120M0 27.5H120M0 0V27M60 27V54M120 0V27" stroke="#000" strokeOpacity=".2" strokeWidth="2.5" fill="none" /></pattern>
    <pattern id="woodP" width="40" height="400" patternUnits="userSpaceOnUse"><path d="M0 0V400M20 0V400" stroke="#000" strokeOpacity=".28" strokeWidth="2" /><path d="M8 0C14 120 4 250 10 400M30 0C24 140 34 260 28 400" stroke="#000" strokeOpacity=".1" strokeWidth="3" fill="none" /></pattern>
    <linearGradient id="aoV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset=".7" stopColor="#000" stopOpacity=".08" /><stop offset="1" stopColor="#000" stopOpacity=".45" /></linearGradient>
    <linearGradient id="corniceSh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity=".5" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient>
    <linearGradient id="glassG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a8cb4" /><stop offset="1" stopColor="#2a3450" /></linearGradient>
    <linearGradient id="litG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe6a8" /><stop offset="1" stopColor="#ff9a40" /></linearGradient>
  </defs>
);
/** a shape overlay: grain/dirt variation confined to its own alpha */
export const Dirt: React.FC<{children: React.ReactNode; o?: number; light?: number}> = ({children, o = 0.5, light = 0.25}) => (
  <g>
    <g filter="url(#nzDark)" opacity={o}>{children}</g>
    <g filter="url(#nzLight)" opacity={light}>{children}</g>
  </g>
);

export const Rays: React.FC<{id: string; x: number; y: number; ang: number; spread: number; len: number; n?: number; c?: string; o?: number; seed?: number}> = ({id, x, y, ang, spread, len, n = 7, c = '#fff2c8', o = 0.18, seed = 4}) => {
  const r = mulberry32(seed);
  return (
    <g style={{mixBlendMode: 'screen'} as any}>
      <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x} y1={y} x2={x + Math.cos(ang) * len} y2={y + Math.sin(ang) * len}><stop offset="0" stopColor={c} stopOpacity={o * 2} /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient></defs>
      {Array.from({length: n}, (_, i) => {
        const a0 = ang + (r() - 0.5) * spread, w = 0.02 + r() * 0.05;
        const p = (a: number, l: number) => `${x + Math.cos(a) * l},${y + Math.sin(a) * l}`;
        return <polygon key={i} points={`${x},${y} ${p(a0 - w, len)} ${p(a0 + w, len)}`} fill={`url(#${id})`} opacity={0.5 + r() * 0.5} />;
      })}
    </g>
  );
};

export const Motes: React.FC<{n?: number; seed?: number; x0?: number; x1?: number; y0?: number; y1?: number; c?: string; o?: number; r?: number}> = ({n = 70, seed = 2, x0 = 0, x1 = W, y0 = 0, y1 = H, c = '#fff4d8', o = 0.5, r = 3}) => {
  const q = mulberry32(seed);
  return <g>{Array.from({length: n}, (_, i) => <circle key={i} cx={x0 + q() * (x1 - x0)} cy={y0 + q() * (y1 - y0)} r={0.8 + q() * r} fill={c} opacity={o * (0.3 + q() * 0.7)} filter={q() > 0.7 ? 'url(#blS)' : undefined} />)}</g>;
};

export const Leaves: React.FC<{x: number; y: number; r: number; seed: number; c1: string; c2: string; n?: number}> = ({x, y, r, seed, c1, c2, n = 46}) => {
  const q = mulberry32(seed);
  return <g>{Array.from({length: n}, (_, i) => { const a = q() * 6.283, d = Math.sqrt(q()) * r; const lx = x + Math.cos(a) * d, ly = y + Math.sin(a) * d * 0.82; return <ellipse key={i} cx={lx} cy={ly} rx={r * (0.22 + q() * 0.2)} ry={r * (0.16 + q() * 0.14)} fill={mix(c1, c2, q())} />; })}</g>;
};
export const Tree: React.FC<{x: number; y: number; h: number; seed: number; c1?: string; c2?: string}> = ({x, y, h, seed, c1 = '#2e4a2a', c2 = '#6a8a4a'}) => (
  <g>
    <ellipse cx={x + h * 0.12} cy={y} rx={h * 0.34} ry={h * 0.05} fill="#000" opacity=".28" filter="url(#blM)" />
    <path d={`M${x - h * 0.03} ${y} Q${x - h * 0.02} ${y - h * 0.3} ${x - h * 0.05} ${y - h * 0.5} L${x + h * 0.05} ${y - h * 0.5} Q${x + h * 0.04} ${y - h * 0.3} ${x + h * 0.03} ${y} Z`} fill="#3a2a1c" />
    <Leaves x={x} y={y - h * 0.68} r={h * 0.36} seed={seed} c1={c1} c2={c2} n={60} />
    <Leaves x={x - h * 0.08} y={y - h * 0.78} r={h * 0.2} seed={seed + 1} c1={mix(c1, '#fff', 0.1)} c2={mix(c2, '#fff', 0.25)} n={26} />
  </g>
);

/** perspective cobbles: rows shrink toward the horizon y0 */
export const CobbleP: React.FC<{y0: number; base: string; seed?: number; wet?: boolean}> = ({y0, base, seed = 4, wet}) => {
  const q = mulberry32(seed), out: React.ReactNode[] = [];
  let y = y0, k = 0;
  while (y < H) {
    const t = (y - y0) / (H - y0), hgt = 6 + t * 46, wid = 14 + t * 110;
    for (let x = -((k % 2) * wid * 0.5) - q() * 20; x < W; x += wid) {
      const c = mix(base, q() > 0.5 ? '#000' : '#fff', 0.06 + q() * 0.18);
      out.push(<rect key={`${k}-${x}`} x={x + 1.5} y={y + 1} width={wid - 3} height={hgt - 2} rx={hgt * 0.3} fill={c} />);
      if (q() > 0.55) out.push(<path key={`h${k}-${x}`} d={`M${x + 6} ${y + hgt * 0.3} H${x + wid * 0.45}`} stroke="#fff" strokeOpacity={0.12 + t * 0.12} strokeWidth={1 + t * 2} strokeLinecap="round" />);
    }
    y += hgt; k++;
  }
  return (
    <g>
      <rect y={y0} width={W} height={H - y0} fill={mix(base, '#000', 0.5)} />
      {out}
      <rect y={y0} width={W} height={H - y0} fill="url(#aoV)" />
      {wet && <g opacity=".5" style={{mixBlendMode: 'screen'} as any}>{[0, 1, 2].map((i) => <ellipse key={i} cx={420 + i * 520} cy={y0 + (H - y0) * (0.55 + i * 0.12)} rx={180 + i * 60} ry={16 + i * 6} fill="#ffcf8a" opacity=".22" filter="url(#blM)" />)}</g>}
    </g>
  );
};

/** a detailed building facade (v2) */
export const Facade: React.FC<{x: number; y: number; w: number; h: number; wall: string; roof: string; floors?: number; cols?: number; lit?: number; seed?: number; brick?: boolean; roofH?: number; shutter?: string; balcony?: boolean; curtain?: string; chimneys?: number; flat?: boolean; arch?: boolean; mash?: boolean}> = ({x, y, w, h, wall, roof, floors = 3, cols = 3, lit = 0.3, seed = 1, brick, roofH = 70, shutter, balcony, curtain = '#a83a3a', chimneys = 2, flat, arch, mash}) => {
  const q = mulberry32(seed), fh = h / (floors + 0.7), cw = w / cols;
  const body = <rect x={x} y={y - h} width={w} height={h} fill={wall} />;
  return (
    <g>
      {body}
      {brick && <rect x={x} y={y - h} width={w} height={h} fill="url(#brickP)" />}
      {!brick && <rect x={x} y={y - h} width={w} height={h} fill="url(#blockP)" opacity=".5" />}
      <Dirt o={0.55} light={0.28}><rect x={x} y={y - h} width={w} height={h} fill="#000" /></Dirt>
      <rect x={x} y={y - h} width={w} height={h} fill="url(#houseShade)" />
      <rect x={x} y={y - h} width={w} height={h} fill="url(#aoV)" />
      {/* roof */}
      {!flat ? (
        <g>
          <polygon points={`${x - 12},${y - h} ${x + w * 0.14},${y - h - roofH} ${x + w * 0.86},${y - h - roofH} ${x + w + 12},${y - h}`} fill={roof} />
          <polygon points={`${x - 12},${y - h} ${x + w * 0.14},${y - h - roofH} ${x + w * 0.86},${y - h - roofH} ${x + w + 12},${y - h}`} fill="url(#tileP)" />
          <polygon points={`${x - 12},${y - h} ${x + w + 12},${y - h} ${x + w * 0.86},${y - h - roofH} ${x + w * 0.14},${y - h - roofH}`} fill="url(#houseShade)" opacity=".7" />
          <line x1={x + w * 0.14} y1={y - h - roofH} x2={x + w * 0.86} y2={y - h - roofH} stroke="#fff" strokeOpacity=".25" strokeWidth={3} />
          {Array.from({length: chimneys}).map((_, i) => { const cx = x + w * (0.25 + i * 0.4); return <g key={i}><rect x={cx} y={y - h - roofH - 50} width={34} height={64} fill={mix(wall, '#000', 0.25)} /><rect x={cx - 5} y={y - h - roofH - 58} width={44} height={12} fill={mix(wall, '#000', 0.4)} /></g>; })}
          {/* dormer */}
          <g><rect x={x + w * 0.42} y={y - h - roofH * 0.82} width={w * 0.16} height={roofH * 0.6} fill={mix(wall, '#000', 0.1)} /><polygon points={`${x + w * 0.4},${y - h - roofH * 0.82} ${x + w * 0.5},${y - h - roofH * 1.12} ${x + w * 0.6},${y - h - roofH * 0.82}`} fill={roof} /><rect x={x + w * 0.455} y={y - h - roofH * 0.7} width={w * 0.09} height={roofH * 0.36} fill={q() < lit + 0.2 ? 'url(#litG)' : 'url(#glassG)'} /></g>
        </g>
      ) : (
        <g><rect x={x - 6} y={y - h - 16} width={w + 12} height={20} fill={mix(wall, '#fff', 0.1)} />{Array.from({length: Math.floor(w / 40)}).map((_, i) => <rect key={i} x={x + 6 + i * 40} y={y - h - 34} width={22} height={20} fill={mix(wall, '#fff', 0.1)} />)}<rect x={x - 6} y={y - h + 4} width={w + 12} height={12} fill="url(#corniceSh)" /></g>
      )}
      {/* cornice + string courses */}
      <rect x={x - 6} y={y - h - 2} width={w + 12} height={14} fill={mix(wall, '#fff', 0.18)} /><rect x={x - 6} y={y - h + 12} width={w + 12} height={16} fill="url(#corniceSh)" />
      {Array.from({length: floors - 1}).map((_, i) => <g key={i}><rect x={x} y={y - h + (i + 1) * fh + 20} width={w} height={7} fill={mix(wall, '#fff', 0.16)} /><rect x={x} y={y - h + (i + 1) * fh + 27} width={w} height={10} fill="url(#corniceSh)" opacity=".7" /></g>)}
      {/* windows */}
      {Array.from({length: floors}).map((_, ri) => Array.from({length: cols}).map((_, ci) => {
        const on = q() < lit, wx = x + ci * cw + cw * 0.22, wy = y - h + 30 + ri * fh, ww = cw * 0.56, wh = fh * 0.62;
        const gl = on ? 'url(#litG)' : 'url(#glassG)';
        return (
          <g key={`${ri}-${ci}`}>
            {shutter && <><rect x={wx - ww * 0.36} y={wy} width={ww * 0.34} height={wh} fill={shutter} /><rect x={wx + ww * 1.02} y={wy} width={ww * 0.34} height={wh} fill={shutter} />{[0.25, 0.5, 0.75].map((t) => <g key={t}><line x1={wx - ww * 0.36} y1={wy + wh * t} x2={wx - ww * 0.02} y2={wy + wh * t} stroke="#000" strokeOpacity=".3" strokeWidth={2} /><line x1={wx + ww * 1.02} y1={wy + wh * t} x2={wx + ww * 1.36} y2={wy + wh * t} stroke="#000" strokeOpacity=".3" strokeWidth={2} /></g>)}</>}
            <rect x={wx - 8} y={wy - 14} width={ww + 16} height={14} fill={mix(wall, '#fff', 0.22)} />{!mash && <polygon points={`${wx + ww / 2 - 10},${wy - 14} ${wx + ww / 2 + 10},${wy - 14} ${wx + ww / 2 + 6},${wy - 24} ${wx + ww / 2 - 6},${wy - 24}`} fill={mix(wall, '#fff', 0.3)} />}
            <rect x={wx - 5} y={wy - 3} width={ww + 10} height={wh + 6} fill={mix(wall, '#000', 0.45)} />
            {arch ? <path d={`M${wx} ${wy + wh} V${wy + wh * 0.3} Q${wx + ww / 2} ${wy - wh * 0.2} ${wx + ww} ${wy + wh * 0.3} V${wy + wh} Z`} fill={gl} /> : <rect x={wx} y={wy} width={ww} height={wh} fill={gl} />}
            {on && (<>
              <polygon points={`${wx},${wy} ${wx + ww * 0.28},${wy} ${wx + ww * 0.12},${wy + wh}  ${wx},${wy + wh}`} fill={curtain} opacity=".8" /><polygon points={`${wx + ww},${wy} ${wx + ww * 0.72},${wy} ${wx + ww * 0.88},${wy + wh} ${wx + ww},${wy + wh}`} fill={curtain} opacity=".8" />
              {q() > 0.6 && <g fill="#2a1a10" opacity=".75"><circle cx={wx + ww * 0.5} cy={wy + wh * 0.5} r={ww * 0.1} /><rect x={wx + ww * 0.4} y={wy + wh * 0.58} width={ww * 0.2} height={wh * 0.42} rx={6} /></g>}
              <rect x={wx - 24} y={wy - 20} width={ww + 48} height={wh + 60} fill="#ffb050" opacity=".12" filter="url(#blM)" />
            </>)}
            {!on && <polygon points={`${wx + ww * 0.1},${wy + wh} ${wx + ww * 0.4},${wy} ${wx + ww * 0.55},${wy} ${wx + ww * 0.25},${wy + wh}`} fill="#fff" opacity=".13" />}
            <line x1={wx + ww / 2} y1={wy} x2={wx + ww / 2} y2={wy + wh} stroke="#1a1410" strokeWidth={3} /><line x1={wx} y1={wy + wh * 0.42} x2={wx + ww} y2={wy + wh * 0.42} stroke="#1a1410" strokeWidth={3} />
            <rect x={wx - 10} y={wy + wh + 3} width={ww + 20} height={8} fill={mix(wall, '#fff', 0.25)} /><rect x={wx - 8} y={wy + wh + 11} width={ww + 16} height={9} fill="#000" opacity=".28" />
            {balcony && ri === 1 && <g stroke="#14100c" strokeWidth={3}><rect x={wx - 16} y={wy + wh + 3} width={ww + 32} height={10} fill="#14100c" />{Array.from({length: 9}).map((_, i) => <line key={i} x1={wx - 12 + i * ((ww + 24) / 8)} y1={wy + wh + 3} x2={wx - 12 + i * ((ww + 24) / 8)} y2={wy + wh + 44} />)}<line x1={wx - 16} y1={wy + wh + 44} x2={wx + ww + 16} y2={wy + wh + 44} /></g>}
            {mash && ri > 0 && <g stroke="#3a2210" strokeWidth={2} opacity=".85"><rect x={wx - 14} y={wy + 10} width={ww + 28} height={wh * 0.9} fill="#6a4020" opacity=".75" />{Array.from({length: 7}).map((_, i) => <line key={i} x1={wx - 14 + i * ((ww + 28) / 6)} y1={wy + 10} x2={wx - 14 + i * ((ww + 28) / 6)} y2={wy + 10 + wh * 0.9} />)}{Array.from({length: 6}).map((_, i) => <line key={i} x1={wx - 14} y1={wy + 10 + i * ((wh * 0.9) / 5)} x2={wx + ww + 14} y2={wy + 10 + i * ((wh * 0.9) / 5)} />)}</g>}
          </g>
        );
      }))}
      {/* arched door with steps and lamp */}
      <g><rect x={x + w / 2 - 36} y={y - 34} width={72} height={34} fill="#000" opacity=".2" /><path d={`M${x + w / 2 - 30} ${y} V${y - 80} Q${x + w / 2} ${y - 118} ${x + w / 2 + 30} ${y - 80} V${y} Z`} fill="#2a1a10" /><path d={`M${x + w / 2 - 30} ${y} V${y - 80} Q${x + w / 2} ${y - 118} ${x + w / 2 + 30} ${y - 80} V${y} Z`} fill="url(#woodP)" opacity=".5" /><circle cx={x + w / 2 + 18} cy={y - 40} r={3.5} fill="#e0b050" /><rect x={x + w / 2 - 42} y={y - 6} width={84} height={6} fill={mix(wall, '#fff', 0.2)} /><rect x={x + w / 2 - 50} y={y} width={100} height={7} fill={mix(wall, '#fff', 0.1)} /></g>
    </g>
  );
};

export const Birds: React.FC<{n?: number; seed?: number; x0?: number; x1?: number; y0?: number; y1?: number; c?: string; s?: number}> = ({n = 7, seed = 6, x0 = 300, x1 = 1600, y0 = 120, y1 = 360, c = '#1a1420', s = 1}) => {
  const q = mulberry32(seed);
  return <g>{Array.from({length: n}, (_, i) => { const x = x0 + q() * (x1 - x0), y = y0 + q() * (y1 - y0), k = (10 + q() * 16) * s; return <path key={i} d={`M${x - k} ${y} Q${x - k / 2} ${y - k * 0.6} ${x} ${y} Q${x + k / 2} ${y - k * 0.6} ${x + k} ${y}`} stroke={c} strokeWidth={2.4 * s} fill="none" strokeLinecap="round" />; })}</g>;
};
export const Clouds: React.FC<{n?: number; seed?: number; y0?: number; y1?: number; c?: string; o?: number}> = ({n = 8, seed = 3, y0 = 60, y1 = 360, c = '#fff', o = 0.5}) => {
  const q = mulberry32(seed);
  return <g filter="url(#blM)">{Array.from({length: n}, (_, i) => { const x = q() * W, y = y0 + q() * (y1 - y0), r = 90 + q() * 160; return <g key={i} opacity={o * (0.4 + q() * 0.6)}><ellipse cx={x} cy={y} rx={r} ry={r * 0.17} fill={c} /><ellipse cx={x + r * 0.3} cy={y - r * 0.07} rx={r * 0.55} ry={r * 0.16} fill={c} /></g>; })}</g>;
};
