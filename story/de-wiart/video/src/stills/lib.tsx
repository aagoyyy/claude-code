import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Post} from '../fx/Post';
import {Cam, camT, H, mix, mulberry32, ridge, W} from '../world/util';
import {Character} from '../rig/Character';
import {SidePose} from '../rig/Side';
import {Figure, FigureDefs, LightName} from '../rig/Figure';
import {Pal, SideOpts} from '../rig/Side';

/** one full-frame still: svg children + grading/grain/vignette */
export const CamCtx = React.createContext<Cam>({x: 0, y: 0, zoom: 1});
export const Frame: React.FC<{grade?: string; night?: boolean; children: React.ReactNode; over?: React.ReactNode; cam?: Cam}> = ({grade, night, children, over, cam = {x: 0, y: 0, zoom: 1}}) => (
  <AbsoluteFill style={{background: '#000', filter: grade}}>
    <CamCtx.Provider value={cam}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
      <FigureDefs />
      <DetailDefs /><MatDefs /><HouseDefs /><GroundDefs />
      {children}
    </svg>
    {over}
    </CamCtx.Provider>
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

/* =============================== v3 additions =============================== */
/** a parallax plane: moves/zooms with the camera by `d` (far ~0, character plane 1, foreground >1) and can be defocused */
export const Par: React.FC<{d: number; blur?: number; o?: number; children: React.ReactNode}> = ({d, blur = 0, o = 1, children}) => {
  const cam = React.useContext(CamCtx);
  return <g transform={camT(cam, d)} style={blur ? {filter: `blur(${blur}px)`} : undefined} opacity={o}>{children}</g>;
};
/** perspective: figure scale from its ground y (adult ~0.567 at y=935 with the horizon at 620) */
export const sc = (y: number, hz = 620, k = 0.0018) => Math.max(0.12, (y - hz) * k);
/** soft cast shadow on the ground, falling to the right (sun low at left) */
export const Cast: React.FC<{x: number; y: number; w: number; h: number; k?: number; o?: number}> = ({x, y, w, h, k = 0.55, o = 0.3}) => (
  <polygon points={`${x},${y} ${x + w},${y} ${x + w + h * k},${y + h * 0.12} ${x + h * k},${y + h * 0.12}`} fill="#06040a" opacity={o} filter="url(#blM)" />
);
/** material noise: kind picks the grain (stone, wood grain, sand, grass, mud, cloth) */
export const Mat: React.FC<{kind: 'stone' | 'wood' | 'sand' | 'grass' | 'mud' | 'cloth'; o?: number; light?: number; children: React.ReactNode}> = ({kind, o = 0.5, light = 0.25, children}) => (
  <g><g filter={`url(#nz_${kind}D)`} opacity={o}>{children}</g><g filter={`url(#nz_${kind}L)`} opacity={light}>{children}</g></g>
);
export const MatDefs: React.FC = () => {
  const spec: Record<string, [string, number, number]> = {stone: ['.018 .02', 5, 1], wood: ['.004 .14', 3, 2], sand: ['.5 .5', 2, 3], grass: ['.06 .5', 3, 4], mud: ['.03 .035', 5, 5], cloth: ['.7 .7', 1, 6]};
  return (
    <defs>
      {Object.entries(spec).map(([k, [f, oc, sd]]) => (
        <React.Fragment key={k}>
          <filter id={`nz_${k}D`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency={f} numOctaves={oc} seed={sd} /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.8 -.6" /><feComposite in2="SourceAlpha" operator="in" /></filter>
          <filter id={`nz_${k}L`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency={f} numOctaves={oc} seed={sd + 9} /><feColorMatrix values="0 0 0 0 1  0 0 0 0 .95  0 0 0 0 .84  0 0 0 1.6 -.85" /><feComposite in2="SourceAlpha" operator="in" /></filter>
        </React.Fragment>
      ))}
    </defs>
  );
};

/** a figure seen from behind, as a dark foreground silhouette (front rig + hair/hat cover) */
export const BackFig: React.FC<{x: number; y: number; s: number; hat?: 'bowler' | 'top' | 'cap' | 'none'; hair?: string; dark?: number; pose?: any}> = ({x, y, s, hat = 'bowler', hair = '#2a1c14', dark = 0.32, pose = {}}) => {
  const z = s / 0.567;
  const hx = 797, hy = 331;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, filter: `brightness(${dark}) saturate(.55) blur(3px)`}}>
      <Character pose={{head: 0, ...pose}} variant={{}} cam={{x: (800 - x) / z, y: (935 - y) / z, zoom: z, px: 800, py: 935}} lit={0.2}>
        <ellipse cx={hx} cy={hy + 10} rx={64} ry={84} fill={hair} />
        <ellipse cx={hx - 3} cy={hy - 4} rx={58} ry={70} fill={mix(hair, '#000000', 0.25)} opacity=".5" />
        {hat === 'bowler' && <g><ellipse cx={hx} cy={hy - 46} rx={96} ry={13} fill="#14100c" /><path d={`M${hx - 62} ${hy - 46} Q${hx - 64} ${hy - 128} ${hx} ${hy - 130} Q${hx + 64} ${hy - 128} ${hx + 62} ${hy - 46} Z`} fill="#14100c" /></g>}
        {hat === 'top' && <g><ellipse cx={hx} cy={hy - 46} rx={86} ry={12} fill="#14100c" /><path d={`M${hx - 56} ${hy - 46} L${hx - 50} ${hy - 190} Q${hx} ${hy - 200} ${hx + 50} ${hy - 190} L${hx + 56} ${hy - 46} Z`} fill="#14100c" /></g>}
        {hat === 'cap' && <g><path d={`M${hx - 68} ${hy - 40} Q${hx - 60} ${hy - 112} ${hx} ${hy - 114} Q${hx + 62} ${hy - 110} ${hx + 68} ${hy - 40} Z`} fill="#14100c" /></g>}
      </Character>
    </div>
  );
};

/* ---- acting presets (spread into a SidePose) ---- */
export const face = {
  yawn: {mouth: 1.15, squint: 1, brow: 0.3, head: -9} as SidePose,
  bored: {squint: 0.5, brow: -0.25, head: 6, torso: 3} as SidePose,
  surprise: {brow: 1, wide: 1, mouth: 0.65, head: -4} as SidePose,
  angry: {brow: -1, grimace: 0.9, squint: 0.35, mouth: 0.45, head: 3} as SidePose,
  smile: {smile: 1, squint: 0.2} as SidePose,
  laugh: {smile: 1, mouth: 0.6, squint: 0.7, head: -5} as SidePose,
  wonder: {wide: 0.6, brow: 0.6, smile: 0.25, head: -4} as SidePose,
  talk: (f: number): SidePose => ({mouth: 0.15 + 0.5 * Math.abs(Math.sin(f * 0.9)), brow: 0.1}),
};
export const arms = {
  point: {uaN: -82, faN: -4, handN: 'point'} as SidePose,
  explain: {uaN: -52, faN: -64, handN: 'open', uaF: -20, faF: -50, handF: 'relaxed'} as SidePose,
  offer: {uaN: -58, faN: -28, handN: 'open'} as SidePose,
  wave: {uaN: -150, faN: -26, handN: 'open'} as SidePose,
  stretch: {uaN: -168, faN: -6, uaF: -160, faF: -10, handN: 'open', handF: 'open', torso: -4} as SidePose,
  chin: {uaN: -64, faN: -128, handN: 'relaxed'} as SidePose,
  crossed: {uaN: -34, faN: -118, uaF: -30, faF: -112, handN: 'relaxed', handF: 'relaxed'} as SidePose,
  hips: {uaN: 28, faN: -104, handN: 'relaxed', uaF: 24, faF: -100, handF: 'relaxed'} as SidePose,
  behind: {uaN: 22, faN: -8, uaF: 18, faF: -6, handN: 'relaxed'} as SidePose,
  press: {uaN: -72, faN: -22, handN: 'open'} as SidePose,
  write: {uaN: -36, faN: -88, handN: 'relaxed', head: 16, torso: 5} as SidePose,
};

/* =============================== detailed close-up hand (back of the hand) =============================== */
/** wrist at (0,0), fingers toward +y. kind: open | relaxed | point | grip | pinch. Sleeve runs up to y=-300. */
export const HandCU: React.FC<{kind?: 'open' | 'relaxed' | 'point' | 'grip' | 'pinch'; skin?: string; sleeve?: string; cuff?: string; shirt?: string; id?: string}> = ({kind = 'relaxed', skin = '#e0a880', sleeve = '#3a4a3a', cuff, shirt = '#ece6d6', id = 'hc'}) => {
  const d = mix(skin, '#000000', 0.32), l = mix(skin, '#ffffff', 0.22), m = mix(skin, '#000000', 0.14), ln = mix(skin, '#000000', 0.55);
  const sd = mix(sleeve, '#000000', 0.4), sl = mix(sleeve, '#ffffff', 0.12);
  // finger: three tapered phalanges with joint creases, a nail on the back
  const finger = (x: number, len: number, rot: number, w: number, curl: number[], k: number, nail = true) => {
    const L = [len * 0.42, len * 0.33, len * 0.25];
    const seg = (i: number): React.ReactNode => {
      if (i > 2) return null;
      const w0 = w * (1 - i * 0.1), w1 = w * (1 - (i + 1) * 0.1), l = L[i];
      return (
        <g transform={i === 0 ? undefined : `rotate(${curl[i]})`}>
          <path d={`M${-w0 / 2} 0 L${-w1 / 2} ${l} Q0 ${l + w1 * 0.45} ${w1 / 2} ${l} L${w0 / 2} 0 Z`} fill={`url(#${id}F)`} stroke={ln} strokeWidth="2.4" strokeLinejoin="round" />
          <path d={`M${-w0 * 0.22} ${l * 0.1} L${-w1 * 0.22} ${l * 0.92}`} stroke="#fff" strokeWidth="2.6" opacity=".22" strokeLinecap="round" />
          <path d={`M${-w1 * 0.4} ${l - 3} Q0 ${l + 4} ${w1 * 0.4} ${l - 3}`} stroke={d} strokeWidth="2" fill="none" opacity=".7" />
          {i === 2 && nail && <g><path d={`M${-w1 * 0.34} ${l * 0.18} L${-w1 * 0.3} ${l * 0.84} Q0 ${l * 0.98} ${w1 * 0.3} ${l * 0.84} L${w1 * 0.34} ${l * 0.18} Z`} fill="#f2cdb6" stroke={m} strokeWidth="1.6" /><path d={`M${-w1 * 0.2} ${l * 0.28} L${-w1 * 0.18} ${l * 0.7}`} stroke="#fff" strokeWidth="2" opacity=".6" strokeLinecap="round" /></g>}
          {i < 2 && <g transform={`translate(0 ${l})`}>{seg(i + 1)}</g>}
        </g>
      );
    };
    return <g key={k} transform={`translate(${x} 78) rotate(${rot})`}>{seg(0)}<ellipse cx={0} cy={4} rx={w * 0.62} ry={w * 0.42} fill={m} opacity=".55" /><ellipse cx={-w * 0.12} cy={2} rx={w * 0.3} ry={w * 0.18} fill={l} opacity=".35" /></g>;
  };
  const F = {open: [[-30, 94, 9, 22, [0, 4, 3, 2]], [-10, 112, 3, 23, [0, 3, 2, 2]], [11, 104, -3, 22, [0, 3, 2, 2]], [30, 82, -10, 20, [0, 4, 3, 3]]],
    relaxed: [[-30, 80, 12, 22, [0, 24, 26, 20]], [-10, 90, 6, 23, [0, 30, 30, 24]], [11, 86, 1, 22, [0, 30, 32, 24]], [30, 70, -4, 20, [0, 32, 30, 24]]],
    point: [[-10, 112, 3, 23, [0, 2, 2, 2]], [11, 70, -2, 22, [0, 70, 68, 40]], [30, 60, -6, 20, [0, 74, 70, 44]], [-30, 66, 8, 22, [0, 70, 66, 40]]],
    grip: [[-30, 84, 6, 22, [0, 56, 60, 50]], [-10, 94, 3, 23, [0, 58, 62, 52]], [11, 90, 0, 22, [0, 60, 62, 52]], [30, 76, -4, 20, [0, 60, 60, 50]]],
    pinch: [[-10, 104, -2, 23, [0, 28, 36, 20]], [11, 78, -2, 22, [0, 66, 70, 40]], [30, 66, -6, 20, [0, 72, 72, 42]], [-30, 72, 8, 22, [0, 70, 70, 40]]]}[kind] as any[];
  const thumb = kind === 'pinch' ? {r: 26, len: 82, c: [0, 20]} : kind === 'point' || kind === 'grip' ? {r: 38, len: 74, c: [0, 40]} : {r: 44, len: 86, c: [0, 14]};
  return (
    <g>
      <defs>
        <linearGradient id={`${id}F`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={l} /><stop offset=".45" stopColor={skin} /><stop offset="1" stopColor={d} /></linearGradient>
        <linearGradient id={`${id}B`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={l} /><stop offset=".5" stopColor={skin} /><stop offset="1" stopColor={d} /></linearGradient>
        <linearGradient id={`${id}S`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={sl} /><stop offset=".55" stopColor={sleeve} /><stop offset="1" stopColor={sd} /></linearGradient>
      </defs>
      {/* sleeve: tube with folds, weave, stitched cuff, button, shirt cuff beneath */}
      <path d="M-58 -304 L-48 0 L48 0 L58 -304 Z" fill={`url(#${id}S)`} stroke={mix(sleeve, '#000000', 0.6)} strokeWidth="3" />
      <rect x={-58} y={-304} width={116} height={304} fill="url(#weaveS)" opacity=".7" />
      {[[-34, -240, 4], [-6, -190, 5], [26, -130, 4], [-40, -90, 3], [14, -60, 3]].map(([fx, fy, w], i) => <path key={i} d={`M${fx} ${fy} q${18} ${26} ${4} ${70}`} stroke={sd} strokeWidth={w * 2.2} fill="none" opacity=".35" strokeLinecap="round" />)}
      {[[-30, -250], [10, -200], [36, -150], [-14, -110]].map(([fx, fy], i) => <path key={i} d={`M${fx} ${fy} q-10 22 -2 52`} stroke="#fff" strokeWidth="5" fill="none" opacity=".1" strokeLinecap="round" />)}
      <rect x={-52} y={-34} width={104} height={30} fill={shirt} stroke="#8a8676" strokeWidth="2.5" /><rect x={-52} y={-34} width={104} height={30} fill="url(#sideShade)" opacity=".7" />
      <path d="M-50 -88 L-46 -34 L46 -34 L50 -88 Z" fill={cuff ?? sleeve} stroke={mix(sleeve, '#000000', 0.6)} strokeWidth="2.5" /><path d="M-48 -84 H48" stroke="#d9ab78" strokeWidth="2" strokeDasharray="6 5" opacity=".7" /><path d="M-47 -40 H47" stroke={sd} strokeWidth="3" opacity=".6" />
      <circle cx={30} cy={-62} r={8} fill="#b0903a" stroke="#4a3a14" strokeWidth="2" /><circle cx={28} cy={-64} r={3} fill="#fff" opacity=".5" />
      <ellipse cx={0} cy={-34} rx={54} ry={9} fill="#000" opacity=".25" filter="url(#blS)" />
      {/* thumb (behind the back of the hand) */}
      <g transform={`translate(-34 40) rotate(${thumb.r})`}>
        <path d={`M-18 0 Q-24 30 -14 ${thumb.len * 0.5} L14 ${thumb.len * 0.5} Q22 30 18 0 Z`} fill={m} stroke={ln} strokeWidth="2.4" />
        <g transform={`translate(0 ${thumb.len * 0.5}) rotate(${thumb.c[1]})`}><path d={`M-15 0 L-12 ${thumb.len * 0.5} Q0 ${thumb.len * 0.55 + 10} 12 ${thumb.len * 0.5} L15 0 Z`} fill={`url(#${id}F)`} stroke={ln} strokeWidth="2.4" strokeLinejoin="round" /><path d={`M-9 ${thumb.len * 0.12} L-7 ${thumb.len * 0.44} Q0 ${thumb.len * 0.5} 8 ${thumb.len * 0.44} L9 ${thumb.len * 0.12} Z`} fill="#f2cdb6" stroke={m} strokeWidth="1.6" /></g>
      </g>
      {/* back of the hand: knuckles, tendons, a vein, wrist crease */}
      <path d="M-36 0 Q-56 44 -52 90 Q0 108 52 90 Q56 44 36 0 Z" fill={`url(#${id}B)`} stroke={ln} strokeWidth="3" />
      <path d="M-14 8 Q-18 50 -26 86 M6 6 Q4 52 -2 92 M24 8 Q28 52 30 88" stroke={d} strokeWidth="2.6" fill="none" opacity=".4" strokeLinecap="round" />
      <path d="M-20 16 q16 20 10 50 q10 -16 22 -10" stroke="#7a6a9a" strokeWidth="3.4" fill="none" opacity=".28" strokeLinecap="round" />
      {[-30, -10, 11, 30].map((kx, i) => <ellipse key={i} cx={kx} cy={84 - (i === 1 ? 4 : 0)} rx={13} ry={9} fill={l} opacity=".45" />)}
      <path d="M-34 6 Q0 18 34 6" stroke={d} strokeWidth="2.6" fill="none" opacity=".5" />
      {F.map(([x, len, rot, w, curl]: any, i: number) => finger(x, len, rot, w, curl, i))}
    </g>
  );
};
