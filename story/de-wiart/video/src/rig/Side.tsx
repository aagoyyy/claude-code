import React from 'react';
import {mix} from '../world/util';

/** Side-view (profile) rig. Local space: feet on y=0, figure faces +x, ~1270 tall. Mirror with `face='left'`. */
export type Pal = {skin: string; hair: string; top: string; bottom: string; belt: string; boots: string; puttee?: string; metal?: string};
export type Head = 'none' | 'brodie' | 'pith' | 'slouch' | 'cap' | 'turban' | 'stahl' | 'bustina' | 'flatcap' | 'scarf' | 'nursecap';
export type SidePose = Partial<Record<'torso' | 'head' | 'uaN' | 'faN' | 'uaF' | 'faF' | 'thN' | 'shN' | 'ftN' | 'thF' | 'shF' | 'ftF', number>> & {dx?: number; dy?: number; br?: number; blink?: number; fall?: number; grip?: boolean; sling?: boolean; mouth?: number; brow?: number; squint?: number; grimace?: number};

export type SideOpts = {
  pal: Pal;
  head?: Head;
  face?: 'left' | 'right';
  hero?: boolean;                 // Sam Browne strap, ribbons, mustache, scars...
  patch?: boolean; stump?: boolean; young?: boolean; bandages?: boolean;
  gear?: 'none' | 'rifle' | 'pack' | 'rifle+pack' | 'spear';
  mustache?: boolean; beard?: boolean;
  build?: number;                 // width multiplier of the torso/limbs
  hat?: string;                   // headgear colour
  scars?: boolean;
  bayonet?: boolean;
  outfit?: 'trousers' | 'skirt';   // long skirt for women
  hairStyle?: 'bun' | 'long';
  stretch?: number;               // height multiplier (tall / short people)
  apron?: boolean;
  rifle?: 'enfield' | 'mauser' | 'martini';   // model: British Lee-Enfield, German Gewehr 98, Martini-Henry (dervishes)
  fine?: boolean;                 // full-detail (cloth grain, AO blurs); false for far/background figures
};

const sh = (c: string, t: number) => mix(c, '#000000', t);
const hl = (c: string, t: number) => mix(c, '#ffffff', t);

let UID = 0;
const nid = () => `sx${++UID}`;

export const SideDefs: React.FC = () => (
  <defs>
    <linearGradient id="sideShade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fff" stopOpacity=".2" /><stop offset=".3" stopColor="#fff" stopOpacity="0" /><stop offset=".65" stopColor="#000" stopOpacity=".12" /><stop offset="1" stopColor="#000" stopOpacity=".46" />
    </linearGradient>
    <linearGradient id="sideShadeV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity=".28" /><stop offset=".25" stopColor="#000" stopOpacity="0" /><stop offset=".8" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".3" />
    </linearGradient>
    <filter id="sBlur3"><feGaussianBlur stdDeviation="3" /></filter>
    <filter id="sBlur6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" /></filter>
    <pattern id="weaveS" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 .5 H5 M.5 0 V5" stroke="#000" strokeWidth=".6" opacity=".16" /></pattern>
    <filter id="clothS" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1 .8" numOctaves="2" seed="3" /><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.1 -.35" /></filter>
    <pattern id="putteeS" width="44" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
      <rect width="44" height="24" fill="#948e5c" /><rect width="44" height="6" fill="#5a5534" /><rect y="6" width="44" height="3" fill="#b4ae7c" /><rect y="15" width="44" height="1.5" fill="#6e6942" opacity=".6" />
    </pattern>
    <linearGradient id="goldS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f3d57a" /><stop offset=".5" stopColor="#c9a24c" /><stop offset="1" stopColor="#8a6a22" /></linearGradient>
    <linearGradient id="leatherS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8d5732" /><stop offset=".5" stopColor="#6f4122" /><stop offset="1" stopColor="#4b2b18" /></linearGradient>
    <linearGradient id="gauzeS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fbf8ee" /><stop offset=".6" stopColor="#ebe5d3" /><stop offset="1" stopColor="#b9b3a0" /></linearGradient>
    <radialGradient id="shineS" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
  </defs>
);

const OUT = '#2a2418';

/** cloth texture + grain, clipped to the host shape (same material treatment as the front rig) */
const Tex: React.FC<{clip: string; x: number; y: number; w: number; h: number; fine?: boolean; grain?: number}> = ({clip, x, y, w, h, fine = true, grain = 0.22}) => (
  <g clipPath={`url(#${clip})`}>
    <rect x={x} y={y} width={w} height={h} fill="url(#weaveS)" />
    {fine && <rect x={x} y={y} width={w} height={h} filter="url(#clothS)" opacity={grain} />}
  </g>
);

/** limb segment hanging down from its pivot, with round caps, shading, cloth grain and clipped detail children */
const Seg: React.FC<{len: number; w0: number; w1: number; c: string; out?: string; fine?: boolean; tex?: boolean; seam?: boolean; children?: React.ReactNode; over?: React.ReactNode}> = ({len, w0, w1, c, out = OUT, fine = true, tex = true, seam = true, children, over}) => {
  const id = nid();
  const d = `M${-w0 / 2} 0 L${w0 / 2} 0 L${w1 / 2} ${len} L${-w1 / 2} ${len} Z`;
  const wm = Math.max(w0, w1);
  return (
    <g>
      <defs><clipPath id={id}><path d={d} /><circle cx={0} cy={0} r={w0 / 2} /><circle cx={0} cy={len} r={w1 / 2} /></clipPath></defs>
      <path d={d} fill={c} stroke={out} strokeWidth="3" strokeLinejoin="round" />
      <circle cx={0} cy={len} r={w1 / 2} fill={c} /><circle cx={0} cy={0} r={w0 / 2} fill={c} />
      <g clipPath={`url(#${id})`}>
        {tex && <rect x={-wm} y={-wm / 2} width={wm * 2} height={len + wm} fill="url(#weaveS)" />}
        <rect x={-wm} y={-wm / 2} width={wm * 2} height={len + wm} fill="url(#sideShade)" />
        <rect x={-wm} y={-wm / 2} width={wm * 2} height={len + wm} fill="url(#sideShadeV)" opacity=".6" />
        {fine && tex && <rect x={-wm} y={-wm / 2} width={wm * 2} height={len + wm} filter="url(#clothS)" opacity=".22" />}
        {fine && <path d={`M${w0 * 0.34} ${len * 0.06} L${w1 * 0.34} ${len * 0.96}`} stroke="#000" strokeWidth={Math.max(8, w1 * 0.2)} opacity=".26" filter="url(#sBlur3)" />}
        {children}
      </g>
      {seam && <path d={`M${-w0 * 0.32} ${len * 0.04} L${-w1 * 0.32} ${len * 0.96}`} fill="none" stroke={sh(c, 0.5)} strokeWidth="1.8" strokeDasharray="5 4" opacity=".7" />}
      <path d={`M${-w0 * 0.3} ${len * 0.05} L${-w1 * 0.3} ${len * 0.95}`} stroke="#fff" strokeWidth="3" opacity=".16" strokeLinecap="round" />
      {over}
    </g>
  );
};

const Button: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 5.5}) => (
  <g><circle cx={x} cy={y} r={r} fill="url(#goldS)" stroke="#6b5214" strokeWidth="1.2" /><circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.32} fill="#fff6c8" /></g>
);

const HeadArt: React.FC<{o: SideOpts; near: boolean; blink: number; mouth?: number; brow?: number; squint?: number; grimace?: number}> = ({o, near, blink, mouth = 0, brow = 0, squint = 0, grimace = 0}) => {
  const {pal} = o;
  const fine = o.fine !== false;
  const skinD = sh(pal.skin, 0.3), skinL = hl(pal.skin, 0.22), skinM = sh(pal.skin, 0.12);
  const hatC = o.hat || '#9a9462';
  const cid = nid();
  const faceP = 'M-70 -20 C-80 -90 -40 -100 10 -98 C50 -96 66 -66 66 -44 L69 -30 L66 -10 Q92 14 77 26 L63 31 L61 46 L63 56 Q61 76 48 82 L20 86 Q-20 92 -44 66 L-62 30 Q-78 10 -70 -20 Z';
  const hairP = 'M-72 -14 C-86 -92 -40 -108 12 -104 C46 -102 62 -80 66 -58 Q40 -80 14 -78 Q-20 -74 -34 -54 Q-44 -30 -40 -4 Q-52 10 -58 36 Q-80 20 -72 -14 Z';
  const hairless = o.head === 'turban';
  const old = !o.young && o.hero;
  return (
    <g>
      <defs><clipPath id={cid}><path d={faceP} /></clipPath></defs>
      {/* neck: shaded, wrinkled, shadowed under the jaw */}
      <path d="M-34 56 L38 56 L36 124 L-44 124 Z" fill={skinM} stroke={OUT} strokeWidth="3" />
      <path d="M-34 56 L38 56 L36 124 L-44 124 Z" fill="url(#sideShade)" />
      <path d="M-30 78 Q2 92 34 78 M-32 98 Q2 112 34 98" stroke={skinD} strokeWidth="2" fill="none" opacity=".5" />
      <path d="M-34 60 Q2 98 38 62 V92 Q2 128 -34 94 Z" fill="#000" opacity=".28" filter="url(#sBlur3)" />
      {/* ear: helix + antihelix */}
      <ellipse cx={-14} cy={8} rx={15} ry={24} fill={skinL} stroke={OUT} strokeWidth="2.5" />
      <path d="M-20 -6 Q-4 -2 -8 14 Q-10 22 -18 22" stroke={skinD} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx={-14} cy={10} rx={6} ry={9} fill={skinD} opacity=".35" />
      {/* face */}
      <path d={faceP} fill={pal.skin} stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <g clipPath={`url(#${cid})`}>
        <rect x={-100} y={-110} width={200} height={210} fill="url(#sideShade)" />
        <rect x={-100} y={-110} width={200} height={210} fill="url(#sideShadeV)" opacity=".6" />
        {fine && <path d="M-40 66 Q10 100 60 60" stroke="#000" strokeWidth="22" fill="none" opacity=".2" filter="url(#sBlur6)" />}
        {fine && <path d="M-50 -66 Q10 -88 62 -60" stroke="#000" strokeWidth="14" fill="none" opacity=".22" filter="url(#sBlur6)" />}
        <ellipse cx={34} cy={36} rx={22} ry={14} fill="#d0705a" opacity=".3" filter="url(#sBlur3)" />
        <ellipse cx={-6} cy={30} rx={18} ry={12} fill="#c0604c" opacity=".14" filter="url(#sBlur3)" />
        {/* forehead wrinkles, crow's feet, eye bag, folds */}
        <path d="M-6 -72 Q22 -80 54 -72 M0 -62 Q26 -68 54 -60" stroke={skinD} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity={old ? 0.55 : 0.25} />
        <path d="M18 -34 l-12 -6 M18 -27 l-13 2 M20 -20 l-10 8" stroke={skinD} strokeWidth="2" strokeLinecap="round" opacity={old ? 0.6 : 0.3} />
        <path d="M30 -18 Q44 -10 58 -18" stroke={skinD} strokeWidth="2.2" fill="none" opacity={old ? 0.6 : 0.3} />
        <path d="M36 12 Q22 28 26 52" stroke={skinD} strokeWidth="2.6" fill="none" strokeLinecap="round" opacity={old ? 0.55 : 0.3} />
        <path d="M-52 40 Q-30 56 -10 56" stroke={skinD} strokeWidth="2" fill="none" opacity=".35" />
      </g>
      {/* nose: bridge highlight, nostril, wing shade */}
      <path d="M66 -10 Q92 14 77 26" stroke="#9c6544" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".6" />
      <path d="M62 -8 Q70 8 70 16" stroke="#fff" strokeWidth="3" fill="none" opacity=".28" strokeLinecap="round" />
      <path d="M64 24 Q70 28 76 26" stroke="#6b3f24" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx={72} cy={24} rx={3.4} ry={2.6} fill="#4a2a18" opacity=".7" />
      {/* hair / sideburn / strands */}
      {!hairless && <path d={hairP} fill={pal.hair} stroke={sh(pal.hair, 0.45)} strokeWidth="2.5" />}
      {!hairless && <path d={hairP} fill="url(#sideShade)" />}
      {!hairless && <path d="M-62 -60 Q-20 -92 24 -88 M-66 -30 Q-50 -64 -20 -78 M-48 -4 Q-60 10 -56 30 M-30 -84 Q10 -98 44 -84" stroke={sh(pal.hair, 0.35)} strokeWidth="2" fill="none" opacity=".7" strokeLinecap="round" />}
      {!hairless && <path d="M-58 -64 Q-18 -96 26 -92" stroke="#fff" strokeWidth="4" opacity=".4" fill="none" strokeLinecap="round" />}
      {!hairless && <path d="M-44 -4 Q-38 20 -30 36 Q-46 26 -50 4 Z" fill={sh(pal.hair, 0.12)} stroke={sh(pal.hair, 0.5)} strokeWidth="1.5" />}
      {/* brow (hairs), eyelid, lashes, eye */}
      <g transform={`translate(0 ${-8 * brow}) rotate(${-10 * brow + 8 * grimace} 42 -52)`}>
        <path d="M26 -52 Q42 -62 58 -50" stroke={sh(pal.hair, 0.15)} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M30 -54 l4 -6 M38 -58 l3 -6 M46 -58 l3 -5" stroke={sh(pal.hair, 0.3)} strokeWidth="1.8" strokeLinecap="round" />
      </g>
      {!(o.hero && o.patch && near) && (
        <g transform={`translate(42 -32) scale(1 ${blink * (1 - 0.55 * squint)}) translate(-42 32)`}>
          <ellipse cx={42} cy={-32} rx={13} ry={8} fill="#fbfbf6" stroke="#6b3f24" strokeWidth="1.5" />
          <circle cx={46} cy={-32} r={6} fill="#4a86b8" /><circle cx={47} cy={-32} r={2.8} fill="#0f1822" /><circle cx={49} cy={-34} r={1.6} fill="#fff" />
          <path d="M30 -34 Q42 -44 56 -34" stroke="#4a2a18" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M54 -36 l7 -3 M55 -32 l8 0" stroke="#4a2a18" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}
      <path d="M26 -22 Q42 -14 58 -24" stroke={skinD} strokeWidth="2" fill="none" opacity=".5" />
      {/* mouth, lips, chin */}
      {mouth > 0.04 && (
        <g>
          <path d={`M62 56 Q50 ${60 + 18 * mouth} 38 56 Z`} fill="#3a1410" stroke="#7a2a1c" strokeWidth="1.5" />
          <rect x={44} y={56} width={16} height={4.5} fill="#f1e9d8" opacity=".9" />
          <ellipse cx={50} cy={56 + 12 * mouth} rx={8} ry={3 + 3 * mouth} fill="#b0504a" opacity=".85" />
        </g>
      )}
      <path d={`M62 ${56 - 3 * grimace} Q50 ${61 - 2 * grimace} 38 ${56 + 2 * grimace}`} stroke="#a85c46" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d={`M60 ${64 + 14 * mouth} Q52 ${70 + 16 * mouth} 42 ${66 + 14 * mouth}`} stroke="#b9705a" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7" />
      {grimace > 0.05 && <path d="M64 30 Q74 40 66 52 M30 28 Q40 46 36 58" stroke={skinD} strokeWidth="3" fill="none" strokeLinecap="round" opacity={0.7 * grimace} />}
      <path d="M50 78 Q56 76 58 70" stroke={skinD} strokeWidth="2" fill="none" opacity=".5" />
      {(o.mustache ?? o.hero) && (
        <g>
          <path d="M64 34 Q80 36 84 50 Q76 58 62 52 Q40 52 30 46 Q40 36 64 34 Z" fill={sh(pal.hair, 0.1)} stroke={sh(pal.hair, 0.55)} strokeWidth="2.2" />
          <path d="M44 42 q10 6 24 2 M42 50 q12 4 26 0 M54 38 q8 4 18 0 M70 46 q6 4 10 8" stroke={sh(pal.hair, 0.45)} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M40 40 Q58 34 76 40" stroke="#fff" strokeWidth="3" fill="none" opacity=".35" strokeLinecap="round" />
        </g>
      )}
      {o.beard && <g><path d="M20 66 Q50 100 62 56 Q50 70 20 66 Z M40 52 Q62 88 66 52 Z" fill={sh(pal.hair, 0.1)} stroke={sh(pal.hair, 0.5)} strokeWidth="2" /><path d="M30 70 q8 12 18 8 M44 62 q8 10 16 4" stroke={sh(pal.hair, 0.4)} strokeWidth="1.6" fill="none" /></g>}
      {o.scars && <g stroke="#c8604a" strokeWidth="3.4" fill="none" strokeLinecap="round" opacity=".75"><path d="M46 -64 Q56 -50 52 -38" /><path d="M54 12 Q62 26 58 42" /></g>}
      {/* eyepatch + strap (with stitching and sheen) */}
      {o.hero && o.patch && (
        <g>
          <path d="M64 -54 Q8 -72 -68 -46" stroke="#111" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M62 -56 Q8 -75 -66 -49" stroke="#4a4a4a" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".7" />
          {near && <ellipse cx={44} cy={-28} rx={27} ry={23} fill="#000" opacity=".35" />}
          {near && <ellipse cx={42} cy={-30} rx={27} ry={23} fill="#151515" stroke="#000" strokeWidth="2" />}
          {near && <ellipse cx={42} cy={-30} rx={22} ry={18} fill="none" stroke="#3a3a3a" strokeWidth="1.5" strokeDasharray="3 3" />}
          {near && <ellipse cx={34} cy={-38} rx={11} ry={6} fill="#fff" opacity=".16" />}
          {near && <path d="M16 -36 Q-20 -48 -62 -42" stroke="#111" strokeWidth="7" fill="none" strokeLinecap="round" />}
        </g>
      )}
      {o.hairStyle === 'bun' && <g><circle cx={-74} cy={-34} r={24} fill={pal.hair} stroke={sh(pal.hair, 0.5)} strokeWidth="2.5" /><path d="M-86 -40 Q-74 -52 -62 -40" stroke={hl(pal.hair, 0.4)} strokeWidth="3" fill="none" opacity=".6" /></g>}
      {o.hairStyle === 'long' && <path d="M-70 -50 Q-110 20 -84 120 L-44 110 Q-60 40 -40 -10 Z" fill={pal.hair} stroke={sh(pal.hair, 0.5)} strokeWidth="2.5" />}
      <HeadGear kind={o.head || 'none'} c={hatC} />
    </g>
  );
};

const HeadGear: React.FC<{kind: Head; c: string}> = ({kind, c}) => {
  const d = sh(c, 0.3), l = hl(c, 0.25);
  switch (kind) {
    case 'brodie':
      return (<g><path d="M-92 -36 Q-84 -128 6 -134 Q92 -128 104 -40 L112 -32 L-100 -30 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-92 -36 Q-84 -128 6 -134 Q92 -128 104 -40 L112 -32 L-100 -30 Z" fill="url(#sideShade)" /><path d="M-60 -92 Q-10 -124 50 -112" stroke={l} strokeWidth="4" fill="none" opacity=".5" strokeLinecap="round" /><path d="M-20 -30 Q10 40 40 40" stroke={d} strokeWidth="3" fill="none" /></g>);
    case 'pith':
      return (<g><path d="M-86 -50 Q-86 -140 10 -150 Q96 -140 92 -50 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-86 -50 Q-86 -140 10 -150 Q96 -140 92 -50 Z" fill="url(#sideShade)" /><ellipse cx={4} cy={-48} rx={118} ry={16} fill={l} stroke={OUT} strokeWidth="3" /><ellipse cx={4} cy={-46} rx={118} ry={16} fill="url(#sideShade)" /><rect x={-86} y={-66} width={178} height={14} fill={d} opacity=".7" /></g>);
    case 'slouch':
      return (<g><path d="M-70 -56 Q-70 -126 6 -130 Q82 -126 78 -56 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-150 -44 Q-70 -78 6 -62 Q82 -76 150 -66 Q150 -48 100 -44 Q10 -36 -150 -44 Z" fill={l} stroke={OUT} strokeWidth="3" /><path d="M-70 -70 H78" stroke={d} strokeWidth="10" /><path d="M-70 -56 Q-70 -126 6 -130 Q82 -126 78 -56 Z" fill="url(#sideShade)" /></g>);
    case 'cap':
      return (<g><path d="M-80 -50 Q-80 -122 8 -126 Q84 -120 86 -52 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-80 -50 Q-80 -122 8 -126 Q84 -120 86 -52 Z" fill="url(#sideShade)" /><rect x={-82} y={-62} width={170} height={14} fill={d} /><path d="M86 -52 Q124 -52 130 -42 Q110 -38 84 -44 Z" fill="#14100c" stroke={OUT} strokeWidth="2.5" /><circle cx={60} cy={-56} r={6} fill="#d9b24c" /></g>);
    case 'turban':
      return (<g>{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={4 - i * 3} cy={-62 - i * 22} rx={84 - i * 6} ry={26} fill={i % 2 ? l : c} stroke={OUT} strokeWidth="2.5" transform={`rotate(${-6 + i * 4} 0 ${-62 - i * 22})`} />)}<path d="M-78 -44 Q-100 -10 -88 40 Q-60 10 -64 -30 Z" fill={c} stroke={OUT} strokeWidth="2.5" /></g>);
    case 'stahl':
      return (<g><path d="M-96 -20 Q-96 -130 0 -136 Q90 -130 98 -40 L108 -22 L-90 -6 Q-104 4 -98 24 L-70 22 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-96 -20 Q-96 -130 0 -136 Q90 -130 98 -40 L108 -22 L-90 -6 Z" fill="url(#sideShade)" /></g>);
    case 'flatcap':
      return (<g><path d="M-84 -48 Q-70 -106 10 -108 Q80 -104 100 -52 Q50 -66 -84 -48 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-84 -48 Q-70 -106 10 -108 Q80 -104 100 -52 Q50 -66 -84 -48 Z" fill="url(#sideShade)" /><path d="M60 -56 Q104 -54 116 -44 Q90 -40 62 -48 Z" fill={d} stroke={OUT} strokeWidth="2.5" /><path d="M-40 -96 Q10 -108 60 -90" stroke={l} strokeWidth="3" fill="none" opacity=".5" /></g>);
    case 'scarf':
      return (<g><path d="M-92 40 Q-100 -70 -10 -110 Q70 -120 92 -50 L70 -34 Q10 -80 -40 -40 L-50 70 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-92 40 Q-100 -70 -10 -110 Q70 -120 92 -50 L70 -34 Q10 -80 -40 -40 L-50 70 Z" fill="url(#sideShade)" /><path d="M-60 -70 Q0 -104 60 -84 M-70 -30 Q-76 10 -66 50" stroke={l} strokeWidth="3" fill="none" opacity=".45" /></g>);
    case 'nursecap':
      return (<g><path d="M-90 -30 Q-96 -100 -10 -112 Q70 -112 86 -58 L60 -34 Q10 -60 -40 -30 L-54 60 L-92 40 Z" fill="#f4f0e6" stroke={OUT} strokeWidth="3" /><path d="M-90 -30 Q-96 -100 -10 -112 Q70 -112 86 -58 L60 -34 Q10 -60 -40 -30 L-54 60 L-92 40 Z" fill="url(#sideShade)" /><rect x={-10} y={-100} width={30} height={9} fill="#b3262a" /><rect x={0} y={-110} width={10} height={30} fill="#b3262a" /></g>);
    case 'bustina':
      return (<g><path d="M-76 -56 Q-60 -118 20 -112 Q70 -96 76 -50 Z" fill={c} stroke={OUT} strokeWidth="3" /><path d="M-76 -56 Q-60 -118 20 -112 Q70 -96 76 -50 Z" fill="url(#sideShade)" /><path d="M-40 -100 L-10 -64" stroke={d} strokeWidth="4" /></g>);
    default:
      return null;
  }
};


/** Lee-Enfield style bolt-action rifle. Axis along +y (butt at -300, muzzle at +490); sights on +x, magazine on -x. */
const Rifle: React.FC<{metal: string; bayonet?: boolean; fine?: boolean; kind?: 'enfield' | 'mauser' | 'martini'}> = ({metal, bayonet, fine = true, kind = 'enfield'}) => {
  const steel = '#3b3f47', steelL = '#7d848f';
  return (
    <g>
      <defs>
        <linearGradient id="rfWood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b57a45" /><stop offset=".5" stopColor="#8a5428" /><stop offset="1" stopColor="#4e2c14" /></linearGradient>
        <linearGradient id="rfWood2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d6a064" /><stop offset=".5" stopColor="#a8683a" /><stop offset="1" stopColor="#6a3c1c" /></linearGradient>
        <linearGradient id="rfWood3" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8a5a38" /><stop offset=".5" stopColor="#5e3820" /><stop offset="1" stopColor="#331c0e" /></linearGradient>
        <linearGradient id="rfSteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8a919c" /><stop offset=".5" stopColor="#4a4f58" /><stop offset="1" stopColor="#23262c" /></linearGradient>
      </defs>
      {/* sling */}
      <path d="M-14 -240 Q-70 -60 -16 190" stroke="#3a2414" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M-14 -240 Q-66 -60 -14 190" stroke="#8a5a32" strokeWidth="2" fill="none" opacity=".6" strokeDasharray="8 6" />
      {/* butt stock: curved profile, butt plate, grain */}
      <path d="M-20 -304 L22 -304 L25 -262 Q27 -190 14 -150 L8 -120 L-10 -120 Q-20 -200 -22 -250 Z" fill="url(#rfWood)" stroke={OUT} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M-20 -304 L22 -304 L24 -290 L-21 -290 Z" fill={steel} stroke={OUT} strokeWidth="2" />
      <path d="M-14 -280 Q-12 -200 -8 -130 M2 -282 Q6 -200 8 -140" stroke="#5a3418" strokeWidth="1.6" fill="none" opacity=".6" />
      <path d="M-18 -300 Q-20 -220 -10 -126" stroke="#e0b078" strokeWidth="3" fill="none" opacity=".4" />
      {/* wrist + receiver + bolt */}
      <path d="M-12 -126 L12 -126 L14 -10 L-12 -10 Z" fill="url(#rfWood)" stroke={OUT} strokeWidth="2.4" />
      <rect x={-11} y={-108} width={22} height={86} fill="url(#rfSteel)" stroke={OUT} strokeWidth="2.4" />
      <rect x={-8} y={-96} width={14} height={30} fill="#1a1c21" opacity=".5" />
      {kind === 'enfield' && (<g><path d="M10 -84 L40 -92" stroke={steel} strokeWidth="6" strokeLinecap="round" /><circle cx={44} cy={-93} r={9} fill={steel} stroke={OUT} strokeWidth="2" /><circle cx={41} cy={-96} r={3} fill={steelL} opacity=".8" /></g>)}
      {kind === 'mauser' && (<g><path d="M10 -84 L30 -88 L40 -70" stroke={steel} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" /><circle cx={41} cy={-66} r={8} fill={steel} stroke={OUT} strokeWidth="2" /></g>)}
      {kind === 'enfield' && (<g>
      <path d="M-11 -90 L-30 -90 L-30 -26 L-11 -26 Z" fill="url(#rfSteel)" stroke={OUT} strokeWidth="2.2" />
      <path d="M-14 -4 Q-46 -2 -42 -44 Q-42 -60 -14 -60" fill="none" stroke={steel} strokeWidth="4" strokeLinecap="round" />
      <path d="M-18 -32 L-26 -18" stroke={steel} strokeWidth="3.5" strokeLinecap="round" />
      </g>)}
      {kind === 'mauser' && (<g>
        <path d="M-11 -70 L-22 -70 L-22 -36 L-11 -36 Z" fill="url(#rfSteel)" stroke={OUT} strokeWidth="2" />
        <path d="M-14 -4 Q-40 -2 -38 -40 Q-38 -54 -14 -54" fill="none" stroke={steel} strokeWidth="4" strokeLinecap="round" />
      </g>)}
      {kind === 'martini' && (<g>
        <path d="M-12 -4 Q-52 4 -50 -48 Q-50 -66 -12 -62" fill="none" stroke="#c9a24c" strokeWidth="5" strokeLinecap="round" />
        <path d="M-12 -60 Q-34 -86 -30 -112" stroke="#c9a24c" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx={-30} cy={-114} r={7} fill="#c9a24c" stroke="#5e4614" strokeWidth="1.5" />
        <path d="M11 -96 L30 -110 L34 -102 L14 -86 Z" fill={steel} stroke={OUT} strokeWidth="2" />
      </g>)}
      {/* rear sight ladder */}
      <path d="M11 20 L26 14 L26 52 L11 46 Z" fill={steel} stroke={OUT} strokeWidth="2" />
      <path d="M26 20 V48 M18 24 V46" stroke={steelL} strokeWidth="1.4" opacity=".8" />
      {kind === 'mauser' && (<g>
        <path d="M-11 -10 L12 -10 L11 420 L-10 420 Z" fill="url(#rfWood2)" stroke={OUT} strokeWidth="2.4" />
        <path d="M-5 -4 L-5 414 M4 -4 L4 414" stroke="#7a4624" strokeWidth="1.4" opacity=".5" />
        {[110, 250, 405].map((y) => <rect key={y} x={-12} y={y} width={25} height={8} fill="#7d848f" stroke={OUT} strokeWidth="1.4" />)}
        <rect x={-4.5} y={420} width={9} height={50} fill="url(#rfSteel)" stroke={OUT} strokeWidth="1.6" />
        <path d="M-7 454 L9 450 L9 472 L-7 476 Z" fill={steel} stroke={OUT} strokeWidth="1.6" /><path d="M-8 452 L-8 474" stroke={steelL} strokeWidth="2" opacity=".7" />
        <circle cx={0} cy={476} r={5.5} fill="#15171a" stroke={OUT} strokeWidth="1.5" />
      </g>)}
      {kind === 'martini' && (<g>
        <path d="M-10 -10 L11 -10 L10 200 L-9 200 Z" fill="url(#rfWood3)" stroke={OUT} strokeWidth="2.4" />
        <rect x={-11} y={96} width={23} height={8} fill="#c9a24c" stroke="#5e4614" strokeWidth="1.4" /><rect x={-11} y={190} width={23} height={8} fill="#c9a24c" stroke="#5e4614" strokeWidth="1.4" />
        <rect x={-4.5} y={198} width={9} height={296} fill="url(#rfSteel)" stroke={OUT} strokeWidth="1.8" />
        {[250, 330, 410].map((y) => <rect key={y} x={-6} y={y} width={12} height={7} fill="#c9a24c" stroke="#5e4614" strokeWidth="1.2" />)}
        <path d="M5 470 L18 466 L18 486 L5 490 Z" fill={steel} stroke={OUT} strokeWidth="1.6" />
        <circle cx={0} cy={494} r={5.5} fill="#15171a" stroke={OUT} strokeWidth="1.5" />
        <path d="M-20 -304 L-26 -300 L-26 -282 L-20 -280 Z" fill="#c9a24c" stroke="#5e4614" strokeWidth="1.2" />
      </g>)}
      {kind === 'enfield' && (<g>
      {/* fore-end with brass band, wooden handguard over the barrel */}
      <path d="M-11 -10 L12 -10 L13 270 L-12 270 Z" fill="url(#rfWood)" stroke={OUT} strokeWidth="2.4" />
      <path d="M-4 -4 L-4 262 M4 -4 L4 262" stroke="#5a3418" strokeWidth="1.4" opacity=".5" />
      <path d="M-9 0 L-10 262" stroke="#e0b078" strokeWidth="3" opacity=".4" />
      <rect x={-12} y={118} width={26} height={9} fill="#c9a24c" stroke="#5e4614" strokeWidth="1.4" />
      <path d="M12 270 L14 340 L-4 340 L-12 270 Z" fill="url(#rfWood)" stroke={OUT} strokeWidth="2.2" />
      {/* barrel, nose cap, front-sight blade, muzzle crown */}
      <rect x={-5} y={338} width={11} height={152} fill="url(#rfSteel)" stroke={OUT} strokeWidth="2" />
      <rect x={-8} y={330} width={17} height={14} rx={2} fill={steel} stroke={OUT} strokeWidth="2" />
      <path d="M6 462 L22 458 L22 482 L6 486 Z" fill={steel} stroke={OUT} strokeWidth="1.6" />
      <circle cx={0} cy={490} r={6.5} fill="#15171a" stroke={OUT} strokeWidth="1.5" /><circle cx={0} cy={490} r={2.4} fill="#000" />
      <path d="M-2 340 V486" stroke="#d7dde6" strokeWidth="2" opacity=".55" />
      </g>)}
      {bayonet && (
        <g>
          <rect x={-9} y={474} width={18} height={20} fill={steel} stroke={OUT} strokeWidth="2" />
          <path d="M-6 494 L6 494 L2 650 L-2 662 Z" fill="#c5ccd6" stroke={OUT} strokeWidth="2" />
          <path d="M-3 496 L-1 652" stroke="#fff" strokeWidth="2" opacity=".7" /><path d="M2 500 L1 640" stroke="#7a8290" strokeWidth="2" />
        </g>
      )}
    </g>
  );
};

const dirA = (deg: number): [number, number] => [-Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)];
/** far arm reaches the rifle fore-end held by the near arm (angles in the arm convention, 0 = hanging down) */
const gripAngles = (uaN: number, faN: number): [number, number] => {
  const a1 = uaN, a2 = uaN + faN - 3;
  const u1 = dirA(a1), u2 = dirA(a2);
  const th = (a2 * Math.PI) / 180;
  const P: [number, number] = [175 * u1[0] + 354 * u2[0] - 15 * Math.cos(th), 175 * u1[1] + 354 * u2[1] - 15 * Math.sin(th)];
  const L1 = 175, L2 = 226;
  const d = Math.min(L1 + L2 - 2, Math.hypot(P[0], P[1]));
  const phi = (Math.atan2(-P[0], P[1]) * 180) / Math.PI;
  const al = (Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)))) * 180) / Math.PI;
  const be = (Math.acos(Math.max(-1, Math.min(1, (L2 * L2 + d * d - L1 * L1) / (2 * L2 * d)))) * 180) / Math.PI;
  const A1 = phi + al, A2 = phi - be;
  return [A1, A2 - A1];
};

export const SideArt: React.FC<{o: SideOpts; p: SidePose}> = ({o, p}) => {
  const {pal} = o;
  const flip = o.face === 'left';
  const B = o.build ?? 1;
  const fine = o.fine !== false;
  const top = pal.top, bot = pal.bottom;
  const metal = pal.metal || '#6b6a62';
  const nearIsLeftArm = flip;
  const stumpNear = o.hero && o.stump && nearIsLeftArm, stumpFar = o.hero && o.stump && !nearIsLeftArm;
  const rot = (a?: number) => `rotate(${(a || 0).toFixed(2)})`;
  const stitchC = sh(top, 0.5);
  const hasRifle = o.gear === 'rifle' || o.gear === 'rifle+pack';
  const sling = !!p.sling && hasRifle;
  const rk = o.rifle || 'enfield';
  const fg = p.grip && hasRifle && !sling ? gripAngles(p.uaN || 0, p.faN || 0) : null;
  const uaF = fg ? fg[0] : p.uaF, faF = fg ? fg[1] : p.faF;
  const tid = nid();
  const torsoP = 'M-34 -352 L44 -352 Q100 -336 120 -270 Q134 -190 130 -110 Q126 -50 104 -4 L-92 -4 Q-112 -60 -114 -130 Q-118 -230 -104 -296 Q-90 -340 -34 -352 Z';

  const Arm: React.FC<{near: boolean; ua?: number; fa?: number; stump?: boolean}> = ({near, ua, fa, stump}) => {
    const c = near ? top : sh(top, 0.22);
    const sc = sh(c, 0.5);
    return (
      <g transform={`translate(0 -666) ${rot(p.torso)} translate(-6 -300) ${rot(ua)}`}>
        <Seg len={175} w0={64 * B} w1={56 * B} c={c} fine={fine}>
          {/* sleeve cap shadow + elbow creases + sleeve folds */}
          <ellipse cx={0} cy={-6} rx={44} ry={26} fill="#000" opacity=".28" filter="url(#sBlur6)" />
          <path d="M-26 128 Q0 144 26 128 M-24 146 Q0 160 24 146 M-26 108 Q0 118 26 106" stroke={sc} strokeWidth="2.8" fill="none" opacity=".5" strokeLinecap="round" />
          <path d="M-22 40 Q0 52 22 40 M-22 70 Q0 80 22 70" stroke={sc} strokeWidth="2.4" fill="none" opacity=".35" />
        </Seg>
        <g transform={`translate(0 175) ${rot(fa)}`}>
          <Seg len={190} w0={54 * B} w1={44 * B} c={c} fine={fine} over={
            <g>
              {/* cuff: band + stitching + button */}
              <rect x={-27 * B} y={150} width={54 * B} height={24} rx={4} fill={sh(c, 0.18)} stroke={OUT} strokeWidth="2.5" />
              <rect x={-27 * B} y={150} width={54 * B} height={24} rx={4} fill="url(#sideShade)" />
              <path d={`M${-23 * B} 156 H${23 * B} M${-23 * B} 168 H${23 * B}`} stroke={sc} strokeWidth="1.5" strokeDasharray="4 3" opacity=".75" />
              <Button x={-12 * B} y={162} r={4} />
            </g>
          }>
            <path d="M-24 34 Q0 50 24 34 M-22 60 Q0 72 22 58 M-20 96 Q0 108 20 96" stroke={sc} strokeWidth="2.6" fill="none" opacity=".45" strokeLinecap="round" />
            <path d="M-18 8 Q-6 90 -14 150" stroke="#fff" strokeWidth="5" fill="none" opacity=".12" filter="url(#sBlur3)" />
          </Seg>
          {stump ? (
            <g transform="translate(0 196)">
              <path d="M-26 -16 L26 -16 Q38 30 20 62 Q0 74 -20 62 Q-38 30 -26 -16 Z" fill="url(#gauzeS)" stroke="#7d7767" strokeWidth="2.5" />
              <path d="M-30 -2 Q0 8 30 -2 M-31 14 Q0 24 31 14 M-31 30 Q0 40 31 30 M-28 46 Q0 56 28 46" stroke="#aaa392" strokeWidth="2" fill="none" />
              <path d="M-26 -16 L26 -16 Q38 30 20 62 Q0 74 -20 62 Q-38 30 -26 -16 Z" fill="url(#sideShade)" opacity=".6" />
              <path d="M-26 -16 L26 -16 Q38 30 20 62 Q0 74 -20 62 Q-38 30 -26 -16 Z" fill="url(#sideShadeV)" opacity=".5" />
              <ellipse cx={4} cy={40} rx={16} ry={18} fill="#c4281c" opacity=".55" filter="url(#sBlur3)" />
              <path d="M-14 66 l6 22 l12 -16 z" fill="#ebe5d3" stroke="#7d7767" strokeWidth="1.5" />
            </g>
          ) : (
            <g transform="translate(0 200)">
              {/* fist: palm, four curled fingers with knuckles, thumb, wrist crease */}
              <path d="M-22 -4 Q-34 20 -30 46 Q-12 66 18 60 Q36 40 30 6 Q22 -8 -22 -4 Z" fill={pal.skin} stroke="#6b3f24" strokeWidth="3" />
              <path d="M-22 -4 Q-34 20 -30 46 Q-12 66 18 60 Q36 40 30 6 Q22 -8 -22 -4 Z" fill="url(#sideShade)" />
              {[8, 24, 40].map((y) => <path key={y} d={`M-27 ${y} Q2 ${y + 8} 32 ${y}`} stroke="#9c6b46" strokeWidth="3" fill="none" strokeLinecap="round" />)}
              {[-14, 2, 18].map((x) => <circle key={x} cx={x} cy={4} r={5.5} fill={hl(pal.skin, 0.2)} opacity=".6" />)}
              <ellipse cx={22} cy={26} rx={11} ry={20} fill={hl(pal.skin, 0.06)} stroke="#6b3f24" strokeWidth="2.5" transform="rotate(10 22 26)" />
              <path d="M-18 -2 Q2 4 22 -2" stroke={sh(pal.skin, 0.4)} strokeWidth="2.4" fill="none" opacity=".6" />
              <path d="M-16 56 Q0 62 14 56" stroke="#fff" strokeWidth="3" fill="none" opacity=".22" />
            </g>
          )}
          {near && hasRifle && !sling && (
            <g transform="translate(0 204) rotate(-3)"><Rifle metal={metal} bayonet={o.bayonet} fine={fine} kind={rk} /></g>
          )}
          {near && o.gear === 'spear' && (
            <g transform="translate(0 220)"><rect x={-5} y={-420} width={10} height={720} fill="#6a4a2a" stroke={OUT} strokeWidth="2" /><path d="M0 -520 L18 -420 L-18 -420 Z" fill="#aab0b8" stroke={OUT} strokeWidth="2" /><path d="M-1 -515 L-1 -425" stroke="#fff" strokeWidth="2" opacity=".6" /></g>
          )}
        </g>
      </g>
    );
  };

  const Leg: React.FC<{near: boolean; th?: number; shn?: number; ft?: number}> = ({near, th, shn, ft}) => {
    const c = near ? bot : sh(bot, 0.24), bc = near ? pal.boots : sh(pal.boots, 0.25);
    const pt = pal.puttee;
    const cc = sh(c, 0.5);
    return (
      <g transform={`translate(0 -666) ${rot(th)}`}>
        <Seg len={300} w0={134 * B} w1={96 * B} c={c} fine={fine} over={
          o.hero && o.bandages && near ? (
            <g>
              <rect x={-52} y={150} width={104} height={86} rx={6} fill="url(#gauzeS)" stroke="#7d7767" strokeWidth="2" />
              <path d="M-52 168 Q0 176 52 168 M-52 186 Q0 194 52 186 M-52 204 Q0 212 52 204 M-52 222 Q0 230 52 222" stroke="#aaa392" strokeWidth="2" fill="none" />
              <rect x={-52} y={150} width={104} height={86} rx={6} fill="url(#sideShade)" opacity=".5" />
              <ellipse cx={4} cy={196} rx={26} ry={22} fill="#c4281c" opacity=".5" filter="url(#sBlur3)" />
            </g>
          ) : undefined
        }>
          {/* hip/thigh creases, knee creases, front crease line, highlight + inner shadow */}
          <path d="M-56 36 Q0 58 56 34 M-54 64 Q0 82 52 62 M-48 92 Q0 106 46 90" stroke={cc} strokeWidth="3" fill="none" opacity=".42" strokeLinecap="round" />
          <path d="M-40 252 Q0 272 42 250 M-38 272 Q0 286 40 270" stroke={cc} strokeWidth="3" fill="none" opacity=".45" strokeLinecap="round" />
          <path d="M-30 20 Q-22 150 -26 290" stroke="#fff" strokeWidth="9" fill="none" opacity=".16" filter="url(#sBlur3)" />
          <path d="M34 10 Q30 150 24 290" stroke={cc} strokeWidth="14" fill="none" opacity=".2" filter="url(#sBlur6)" />
        </Seg>
        <g transform={`translate(0 300) ${rot(shn)}`}>
          <Seg len={260} w0={94 * B} w1={66 * B} c={pt ? (near ? pt : sh(pt, 0.22)) : c} fine={fine} tex={!pt} seam={!pt}>
            {pt ? (
              <g>
                <rect x={-60} y={30} width={120} height={230} fill="url(#putteeS)" />
                <rect x={-60} y={30} width={120} height={230} fill="url(#sideShade)" />
                <rect x={-60} y={30} width={120} height={230} fill="url(#sideShadeV)" opacity=".5" />
                <rect x={-60} y={30} width={120} height={12} fill="#3a3720" />
                <rect x={-60} y={246} width={120} height={10} fill="#3a3720" />
                <path d="M30 80 q6 60 -6 140" stroke="#e8e0c0" strokeWidth="3" fill="none" opacity=".45" />
                <path d="M-40 40 Q0 52 40 40" stroke="#000" strokeWidth="10" fill="none" opacity=".28" filter="url(#sBlur3)" />
              </g>
            ) : (
              <g>
                <path d="M-34 20 Q0 36 34 20 M-30 60 Q0 72 30 58" stroke={cc} strokeWidth="2.6" fill="none" opacity=".4" />
                <path d="M26 10 Q22 120 18 250" stroke={cc} strokeWidth="12" fill="none" opacity=".2" filter="url(#sBlur6)" />
              </g>
            )}
          </Seg>
          <g transform={`translate(0 260) ${rot(ft)}`}>
            {/* boot: leather gradient, heel block, toe-cap seam, welt stitching, laces + eyelets, wrinkles, sole */}
            <path d="M-46 -20 L38 -20 L44 38 Q150 40 178 70 L180 106 L-62 106 L-62 20 Z" fill={bc} stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
            <path d="M-46 -20 L38 -20 L44 38 Q150 40 178 70 L180 106 L-62 106 L-62 20 Z" fill="url(#sideShade)" />
            <path d="M-46 -20 L38 -20 L44 38 Q150 40 178 70 L180 106 L-62 106 L-62 20 Z" fill="url(#sideShadeV)" opacity=".7" />
            <path d="M-62 56 L-62 106 L-12 106 L-12 66 Q-34 62 -62 56 Z" fill="#000" opacity=".22" />
            <path d="M92 52 Q118 66 124 106" stroke={sh(bc, 0.55)} strokeWidth="3" fill="none" opacity=".75" />
            <path d="M44 38 Q112 40 152 66" stroke={hl(bc, 0.3)} strokeWidth="3" fill="none" opacity=".55" />
            <path d="M-56 98 H176" stroke={hl(bc, 0.35)} strokeWidth="2" strokeDasharray="6 5" opacity=".55" />
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <circle cx={14 + i * 14} cy={-6 + i * 11} r={3.2} fill="#14100a" />
                <path d={`M${6 + i * 14} ${-8 + i * 11} l22 6`} stroke="#e5c89a" strokeWidth="2.6" strokeLinecap="round" opacity=".85" />
              </g>
            ))}
            <path d="M-40 8 Q-4 22 36 14 M-44 30 Q-6 40 40 36" stroke={sh(bc, 0.5)} strokeWidth="2.6" fill="none" opacity=".5" />
            <rect x={-62} y={98} width={244} height={12} rx={4} fill="#17100a" />
            <path d="M-58 100 H176" stroke="#5a4a3a" strokeWidth="1.5" opacity=".7" />
            <rect x={-62} y={92} width={46} height={14} fill="#241810" />
            <ellipse cx={92} cy={62} rx={34} ry={10} fill="url(#shineS)" opacity=".55" />
            {o.hero && o.bandages && near && (
              <g>
                <rect x={-44} y={-34} width={86} height={34} rx={4} fill="url(#gauzeS)" stroke="#7d7767" strokeWidth="2" />
                <path d="M-44 -24 H42 M-44 -14 H42 M-44 -4 H42" stroke="#aaa392" strokeWidth="1.8" />
                <ellipse cx={0} cy={-16} rx={22} ry={11} fill="#c4281c" opacity=".55" filter="url(#sBlur3)" />
              </g>
            )}
          </g>
        </g>
      </g>
    );
  };

  const art = (
    <g>
      <Arm near={false} ua={uaF} fa={faF} stump={stumpFar} />
      <Leg near={false} th={p.thF} shn={p.shF} ft={p.ftF} />
      <Leg near th={p.thN} shn={p.shN} ft={p.ftN} />
      {o.outfit === 'skirt' && (
        <g transform={`translate(0 -690) ${rot(p.torso)}`}>
          <path d={`M-92 0 L96 0 Q${150 + (p.thN || 0) * 1.5} 280 ${160 + (p.thN || 0) * 2} 560 L${-150 + (p.thF || 0) * 2} 560 Q${-140 + (p.thF || 0)} 280 -92 0 Z`} fill={bot} stroke={OUT} strokeWidth="3" />
          <path d="M-92 0 L96 0 Q150 280 160 560 L-150 560 Q-140 280 -92 0 Z" fill="url(#sideShade)" opacity=".8" />
          <path d="M-40 40 Q-50 300 -70 556 M20 40 Q22 300 24 556 M70 30 Q90 300 110 556" stroke={sh(bot, 0.45)} strokeWidth="3" fill="none" opacity=".45" />
          {o.apron && <path d="M-70 -10 L80 -10 L120 520 L-110 520 Z" fill="#f1ede2" stroke={OUT} strokeWidth="2.5" opacity=".96" />}
        </g>
      )}
      {(o.gear === 'pack' || o.gear === 'rifle+pack') && (
        <g transform={`translate(0 -666) ${rot(p.torso)}`}>
          <rect x={-200} y={-330} width={110} height={250} rx={26} fill={sh('#8a8458', 0.2)} stroke={OUT} strokeWidth="3" />
          <rect x={-200} y={-330} width={110} height={250} rx={26} fill="url(#sideShade)" />
          <rect x={-200} y={-330} width={110} height={250} rx={26} fill="url(#weaveS)" />
          <path d="M-190 -250 H-96 M-190 -170 H-96" stroke={OUT} strokeWidth="3" opacity=".5" />
          <path d="M-150 -330 V-80" stroke={OUT} strokeWidth="2" opacity=".35" strokeDasharray="6 5" />
          <rect x={-176} y={-350} width={70} height={28} rx={12} fill="#6a6040" stroke={OUT} strokeWidth="2.5" />
          <rect x={-168} y={-232} width={26} height={20} rx={3} fill="url(#goldS)" stroke="#6b5214" strokeWidth="1.5" />
          <path d="M-90 -320 Q-60 -330 -30 -330" stroke="#5a4a2a" strokeWidth="10" fill="none" />
        </g>
      )}
      {sling && (
        <g transform={`translate(0 -666) ${rot(p.torso)}`}><g transform="translate(-118 -150) rotate(192)"><Rifle metal={metal} bayonet={o.bayonet} fine={fine} kind={rk} /></g></g>
      )}
      <g transform={`translate(0 -666) ${rot(p.torso)} scale(1 ${p.br || 1})`}>
        <ellipse cx={0} cy={0} rx={96 * B} ry={64} fill={bot} stroke={OUT} strokeWidth="3" />
        <path d={torsoP} fill={top} stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
        <defs><clipPath id={tid}><path d={torsoP} /></clipPath></defs>
        <g clipPath={`url(#${tid})`}>
          <rect x={-130} y={-360} width={270} height={360} fill="url(#weaveS)" />
          <rect x={-130} y={-360} width={270} height={360} fill="url(#sideShade)" />
          <rect x={-130} y={-360} width={270} height={360} fill="url(#sideShadeV)" opacity=".7" />
          {fine && <ellipse cx={20} cy={-336} rx={70} ry={24} fill="#000" opacity=".4" filter="url(#sBlur6)" />}
          {fine && <path d="M124 -300 Q132 -160 108 -20" stroke="#000" strokeWidth="20" fill="none" opacity=".3" filter="url(#sBlur6)" />}
          {fine && <rect x={-130} y={-44} width={270} height={22} fill="#000" opacity=".3" filter="url(#sBlur6)" />}
          {fine && <path d="M-96 -300 Q-112 -160 -92 -30" stroke="#fff" strokeWidth="8" fill="none" opacity=".16" filter="url(#sBlur3)" />}
          <path d="M-92 -196 Q-20 -164 70 -196 M-100 -128 Q-10 -100 100 -128 M-60 -260 Q-10 -242 40 -262 M-90 -64 Q-10 -48 90 -66" stroke={sh(top, 0.45)} strokeWidth="3" fill="none" opacity=".4" strokeLinecap="round" />
          <path d="M104 -332 Q116 -170 108 -20" stroke={stitchC} strokeWidth="3" opacity=".55" fill="none" />
          <path d="M96 -332 Q108 -170 100 -20" stroke={hl(top, 0.3)} strokeWidth="1.5" opacity=".6" fill="none" />
          <path d="M-84 -334 Q-10 -354 56 -346" stroke={stitchC} strokeWidth="1.8" strokeDasharray="5 4" opacity=".7" fill="none" />
          {fine && <rect x={-130} y={-360} width={270} height={360} filter="url(#clothS)" opacity=".22" />}
        </g>
        <path d={torsoP} fill="none" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
        {/* tunic hem */}
        <path d="M-92 -4 L104 -4" stroke={stitchC} strokeWidth="1.8" strokeDasharray="5 4" opacity=".7" />
        {/* folded collar (+ tie for the hero) */}
        {o.hero && <g><path d="M70 -326 L90 -322 L96 -236 L84 -218 L72 -236 Z" fill="#1f3d2c" stroke="#0f2418" strokeWidth="2" /><path d="M76 -318 L82 -240 M86 -318 L88 -240" stroke="#3a6a4c" strokeWidth="1.5" opacity=".7" /></g>}
        <path d="M24 -354 L72 -352 L92 -330 L62 -308 L20 -336 Z" fill={hl(top, 0.1)} stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M24 -354 L72 -352 L92 -330 L62 -308 L20 -336 Z" fill="url(#sideShade)" opacity=".7" />
        <path d="M28 -346 L66 -343 L82 -328 M26 -338 L60 -316" stroke={stitchC} strokeWidth="1.5" strokeDasharray="4 3" opacity=".75" fill="none" />
        {o.hero && <path d="M66 -334 L92 -330 L90 -312 L70 -316 Z" fill="#1f3d2c" stroke="#0f2418" strokeWidth="1.8" />}
        {/* epaulette on the near shoulder, seen edge-on */}
        <g transform="rotate(-8 -10 -340)"><rect x={-56} y={-352} width={84} height={20} rx={5} fill={sh(top, 0.1)} stroke={OUT} strokeWidth="2.5" /><rect x={-56} y={-352} width={84} height={7} rx={3} fill={hl(top, 0.18)} opacity=".6" /><path d="M-50 -338 H22" stroke={stitchC} strokeWidth="1.4" strokeDasharray="4 3" opacity=".7" /></g>
        <Button x={-34} y={-342} r={4.2} /><Button x={-6} y={-345} r={4.2} />
        {/* chest pocket with flap, stitching, pleat, button + cast shadow */}
        <g>
          <rect x={26} y={-256} width={68} height={60} rx={6} fill="#000" opacity=".38" filter="url(#sBlur3)" transform="translate(3 5)" />
          <rect x={22} y={-262} width={68} height={60} rx={6} fill={hl(top, 0.06)} stroke={OUT} strokeWidth="2.5" />
          <path d="M26 -232 Q56 -224 86 -232" stroke={sh(top, 0.4)} strokeWidth="2" fill="none" opacity=".4" />
          <rect x={22} y={-262} width={68} height={24} rx={6} fill={sh(top, 0.1)} stroke={OUT} strokeWidth="2.5" />
          <path d="M26 -238 H86" stroke="#000" strokeWidth="4" opacity=".25" filter="url(#sBlur3)" />
          <rect x={28} y={-256} width={56} height={13} rx={3} fill="none" stroke={stitchC} strokeWidth="1.6" strokeDasharray="4 3" opacity=".8" />
          <path d="M52 -240 L56 -226 L60 -240 Z" fill={sh(top, 0.1)} stroke={OUT} strokeWidth="1.5" />
          <Button x={56} y={-242} />
        </g>
        {/* lower patch pocket */}
        <g>
          <rect x={6} y={-132} width={84} height={48} rx={5} fill={hl(top, 0.04)} stroke={OUT} strokeWidth="2.5" />
          <rect x={12} y={-126} width={72} height={13} fill="none" stroke={stitchC} strokeWidth="1.5" strokeDasharray="4 3" opacity=".75" />
          <Button x={48} y={-110} r={4.5} />
        </g>
        {[-228, -160, -92, -50].map((y) => <Button key={y} x={y > -100 ? 112 : 116} y={y} r={5} />)}
        {o.hero && (
          <g>
            {/* Sam Browne cross strap: shadow, edge highlight, double stitching, keeper loop */}
            <path d="M-62 -340 L-28 -350 L128 -150 L120 -108 Z" fill="#000" opacity=".35" filter="url(#sBlur3)" transform="translate(5 7)" />
            <path d="M-62 -340 L-28 -350 L128 -150 L120 -108 Z" fill="url(#leatherS)" stroke="#2a170c" strokeWidth="3" />
            <path d="M-62 -340 L-28 -350 L128 -150 L120 -108 Z" fill="url(#sideShade)" opacity=".5" />
            <path d="M-54 -338 L116 -126" stroke="#d9ab78" strokeWidth="2" strokeDasharray="9 6" opacity=".85" />
            <path d="M-34 -346 L122 -148" stroke="#d9ab78" strokeWidth="2" strokeDasharray="9 6" opacity=".6" />
            <path d="M-60 -338 L118 -112" stroke="#ffd7a0" strokeWidth="2.5" opacity=".25" />
            <path d="M-46 -346 L-18 -356 L-6 -340 L-34 -330 Z" fill="#5a3320" stroke="#2a170c" strokeWidth="2" />
            {/* medal ribbons with sheen */}
            <rect x={46} y={-280} width={64} height={30} rx={2} fill="#2a2a2a" opacity=".45" transform="translate(2 3)" />
            <rect x={44} y={-282} width={16} height={28} fill="#8c1f2a" /><rect x={60} y={-282} width={16} height={28} fill="#2a4a9a" /><rect x={76} y={-282} width={16} height={28} fill="#2a4a9a" /><rect x={92} y={-282} width={16} height={28} fill="#e6c53c" />
            <rect x={44} y={-282} width={64} height={9} fill="#fff" opacity=".22" /><rect x={44} y={-282} width={64} height={28} fill="none" stroke="#2b2412" strokeWidth="1.5" />
          </g>
        )}
        {/* waist belt: leather gradient, holes, double stitching, keepers, bevelled buckle with prong */}
        <rect x={-96 * B} y={-20} width={206 * B} height={32} fill="#000" opacity=".4" filter="url(#sBlur3)" />
        <rect x={-96 * B} y={-26} width={206 * B} height={32} fill="url(#leatherS)" stroke={OUT} strokeWidth="3" />
        <path d={`M${-92 * B} -20 H${106 * B} M${-92 * B} 0 H${106 * B}`} stroke="#d9ab78" strokeWidth="1.8" strokeDasharray="7 5" opacity=".7" />
        <path d={`M${-94 * B} -24 H${108 * B}`} stroke="#ffd7a0" strokeWidth="2" opacity=".28" />
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={(-40 + i * 24) * B} cy={-10} r={3} fill="#1d1109" />)}
        <rect x={-60 * B} y={-30} width={14} height={40} rx={2} fill="#5a3320" stroke={OUT} strokeWidth="2" /><rect x={32 * B} y={-30} width={14} height={40} rx={2} fill="#5a3320" stroke={OUT} strokeWidth="2" />
        <rect x={86 * B} y={-34} width={32} height={46} rx={5} fill="url(#goldS)" stroke="#5e4614" strokeWidth="3" />
        <rect x={92 * B} y={-26} width={20} height={30} rx={2} fill="#3a2a0c" stroke="#8a6a22" strokeWidth="1.5" />
        <rect x={96 * B} y={-14} width={12} height={5} fill="#d8b559" /><path d={`M${88 * B} -30 H${116 * B}`} stroke="#fff3bd" strokeWidth="2" opacity=".7" />
        {sling && (<g><path d="M-40 -350 Q-92 -276 -112 -176" stroke="#3a2414" strokeWidth="11" fill="none" strokeLinecap="round" /><path d="M-40 -350 Q-90 -276 -110 -178" stroke="#8a5a32" strokeWidth="2" fill="none" strokeDasharray="7 5" opacity=".7" /><rect x={-58} y={-346} width={16} height={22} rx={3} fill="url(#goldS)" stroke="#6b5214" strokeWidth="1.5" transform="rotate(-18 -50 -335)" /></g>)}
        {/* head */}
        <g transform={`translate(5 -352) ${rot(p.head)}`}>
          <g transform="translate(10 -106)"><HeadArt o={o} near={nearIsLeftArm} blink={p.blink === undefined ? 1 : p.blink} mouth={p.mouth} brow={p.brow} squint={p.squint} grimace={p.grimace} /></g>
        </g>
      </g>
      <Arm near ua={p.uaN} fa={p.faN} stump={stumpNear} />
    </g>
  );
  const fk = p.fall || 0;
  const fa = Math.abs(fk);
  return <g transform={`translate(${(p.dx || 0).toFixed(1)} ${(p.dy || 0).toFixed(1)}) ${flip ? 'scale(-1 1)' : ''} translate(0 ${(-(fk > 0 ? 114 : 130) * fa).toFixed(1)}) rotate(${(-88 * fk).toFixed(2)}) scale(1 ${o.stretch ?? 1})`}>{art}</g>;
};

/** walking cycle (phase in radians); stride scales the swing */
export const walkPose = (phase: number, stride = 1): SidePose => {
  const s = Math.sin(phase), c = Math.cos(phase), sF = Math.sin(phase + Math.PI), cF = Math.cos(phase + Math.PI);
  const leg = (sv: number, cv: number) => ({th: -27 * stride * sv, sh: 8 + 46 * stride * Math.max(0, cv) ** 2, ft: 0});
  const n = leg(s, c), f = leg(sF, cF);
  return {
    thN: n.th, shN: n.sh, ftN: -(n.th + n.sh) * 0.7, thF: f.th, shF: f.sh, ftF: -(f.th + f.sh) * 0.7,
    uaN: 24 * stride * s, faN: -22 - 10 * Math.max(0, -s), uaF: -24 * stride * s, faF: -22 - 10 * Math.max(0, s),
    torso: -2.5 * s, head: 1.5 * s, dy: -9 * Math.abs(s) * stride, sling: true,
  };
};
export const idlePose = (t: number): SidePose => ({torso: 0.6 * Math.sin(t), br: 1 + 0.006 * Math.sin(t), head: 0.8 * Math.sin(t * 0.7), uaN: 3, faN: -12, uaF: -2, faF: -10, shN: 3, shF: 3});
export const aimPose = (t: number): SidePose => ({grip: true, torso: -3, head: 4, uaN: -78, faN: -14, uaF: -70, faF: -30, thN: -4, thF: 6, shN: 6, shF: 4, br: 1 + 0.004 * Math.sin(t)});
export const kneelPose = (t: number): SidePose => ({torso: -8, head: 10, thN: -88, shN: 88, ftN: 0, thF: 0, shF: 90, ftF: -70, uaN: -45, faN: -50, uaF: -38, faF: -40, dy: 316, br: 1 + 0.005 * Math.sin(t)});

export const runPose = (phase: number): SidePose => {
  const s = Math.sin(phase), c = Math.cos(phase), sF = Math.sin(phase + Math.PI), cF = Math.cos(phase + Math.PI);
  const leg = (sv: number, cv: number) => ({th: -48 * sv, sh: 18 + 78 * Math.max(0, cv) ** 1.5});
  const n = leg(s, c), f = leg(sF, cF);
  return {
    thN: n.th, shN: n.sh, ftN: -(n.th + n.sh) * 0.5, thF: f.th, shF: f.sh, ftF: -(f.th + f.sh) * 0.5,
    uaN: 36 * s, faN: -74 - 10 * Math.max(0, -s), uaF: -36 * s, faF: -74 - 10 * Math.max(0, s),   // arms pump; rifle slung on the shoulder
    torso: 11 + 2 * s, head: -4, dy: -22 * Math.abs(s) - 6, sling: true,
  };
};
export const kneelAimPose = (t: number): SidePose => ({...kneelPose(t), grip: true, torso: -2, head: 2, uaN: -80, faN: -12, uaF: -72, faF: -28});
export const deadPose = (t: number): SidePose => ({thN: -6, shN: 14, ftN: 20, thF: 8, shF: 6, ftF: 30, uaN: -48, faN: -10, uaF: -62, faF: -4, head: -16, torso: 0});

/** where the muzzle is, in the figure's own (unflipped, right-facing) space; rifle carried by the near arm */
export const muzzleOf = (p: SidePose): [number, number] => {
  const rad = (d: number) => (d * Math.PI) / 180;
  const t = rad(p.torso || 0);
  const sx = -6, sy = -300;                                   // shoulder rel. hip
  const rx = sx * Math.cos(t) - sy * Math.sin(t), ry = sx * Math.sin(t) + sy * Math.cos(t);
  const a1 = rad(p.uaN || 0), a2 = rad((p.uaN || 0) + (p.faN || 0)) - rad(3);
  const mx = rx + 175 * -Math.sin(a1 + t) + 694 * -Math.sin(a2 + t), my = ry + 175 * Math.cos(a1 + t) + 694 * Math.cos(a2 + t);
  return [mx, -666 + my + (p.dy || 0)];
};

export const ridePose = (t: number): SidePose => ({thN: -30, shN: 44, ftN: 18, thF: -26, shF: 40, ftF: 18, torso: 1, head: 0, uaN: -34, faN: -76, uaF: -30, faF: -80, br: 1 + 0.005 * Math.sin(t)});
