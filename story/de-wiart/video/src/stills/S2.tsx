import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Character} from '../rig/Character';
import {HandArt, idlePose, ridePose, runPose, SideOpts, walkPose, kneelAimPose, aimPose} from '../rig/Side';
import {AnimalArt, saddleHeight} from '../rig/Animals';
import {H, mix, mulberry32, W} from '../world/util';
import {HandCU, arms, BackFig, Birds, Cast, civ, Clouds, CobbleP, Dirt, Facade, Fig, Fog, Frame, Glow, Grad, khaki, Mat, Motes, Par, Rays, SkyRect, Sil, sc, Title, Tree, face} from './lib';
import {gent, worker, lady, boy, young, P, scholar} from './S1';
import {tommy, boer, horseOfficer} from '../scenes/BoerA';
import {officer} from '../scenes/SomaliA';

/* ----------------------------- archetypes (chapters 2-3) ----------------------------- */
export const trooper = (f: 'left' | 'right', skin = '#e0a880'): SideOpts => ({...tommy(f, skin), gear: 'rifle'});
export const sergeant = (f: 'left' | 'right'): SideOpts => ({...tommy(f), gear: 'none', mustache: true, pal: {...tommy(f).pal, hair: '#6a4a2a', top: '#8e8a58'}});
export const recruit = (f: 'left' | 'right', c: string, hat: SideOpts['head'] = 'flatcap'): SideOpts => ({pal: civ(c, mix(c, '#000000', 0.35), '#4a3020'), head: hat, hat: mix(c, '#000000', 0.2), outfit: 'blazer', face: f});
export const adrianY = (f: 'left' | 'right', extra: Partial<SideOpts> = {}): SideOpts => ({...young(f), ...extra});
export const doctor = (f: 'left' | 'right'): SideOpts => ({pal: civ('#f2f0e8', '#f2f0e8', '#6a5a4a'), head: 'none', outfit: 'frock', mustache: true, beard: false, face: f});
export const nurse = (f: 'left' | 'right'): SideOpts => ({pal: civ('#f2f0e8', '#f2f0e8', '#6a3a22'), head: 'nursecap', outfit: 'dress', build: 0.9, face: f});
export const patient = (f: 'left' | 'right'): SideOpts => ({...young(f), outfit: 'blazer', pal: {...young(f).pal, top: '#e8e4d8', bottom: '#d8d4c8'}, bandages: true});
export const khakiOfficer = (f: 'left' | 'right'): SideOpts => ({...officer(f), mustache: true, gear: 'none'});

/* ----------------------------- shared pieces ----------------------------- */
const MapArt: React.FC<{route?: string; labels?: {x: number; y: number; t: string; s?: number; big?: boolean}[]; ship?: [number, number, number]; mark?: [number, number]; year?: string; focus?: [number, number, number]; trenches?: boolean; children?: React.ReactNode}> = ({route, labels = [], ship, mark, year, focus, trenches, children}) => {
  const q = mulberry32(5);
  const land = (pts: number[][], fill = '#e6d8b0') => <path d={'M' + pts.map((p) => p.join(' ')).join(' L') + ' Z'} fill={fill} stroke="#6a5a3a" strokeWidth={4} strokeLinejoin="round" />;
  return (
    <g>
      <rect width={W} height={H} fill="#c4bf9c" />
      <Mat kind="cloth" o={0.5} light={0.4}><rect width={W} height={H} fill="#c4bf9c" /></Mat>
      {Array.from({length: 44}, (_, i) => <path key={i} d={`M0 ${i * 26} Q480 ${i * 26 - 12} 960 ${i * 26} T1920 ${i * 26}`} stroke="#8a9a8a" strokeOpacity=".16" strokeWidth={2} fill="none" />)}
      <g transform={focus ? `translate(960 540) scale(${focus[2]}) translate(${-focus[0]} ${-focus[1]})` : undefined}>
        {land([[420, -40], [1300, -40], [1290, 90], [1180, 150], [1040, 170], [900, 200], [780, 170], [660, 230], [560, 210], [480, 140]], '#eadcb6')}
        {land([[560, 330], [700, 300], [860, 290], [1000, 320], [1130, 300], [1260, 340], [1330, 420], [1500, 430], [1600, 500], [1480, 560], [1400, 640], [1340, 760], [1260, 880], [1130, 980], [1010, 1040], [900, 960], [860, 820], [800, 700], [700, 640], [600, 560], [520, 460]])}
        {land([[1330, 300], [1440, 250], [1600, 300], [1760, 420], [1700, 520], [1560, 470], [1420, 400]], '#e0cfa2')}
        {land([[300, 20], [420, -30], [470, 100], [380, 150], [300, 110]], '#eadcb6')}
        <g stroke="#7a6a48" strokeOpacity=".5" strokeWidth={2} fill="none">{Array.from({length: 22}, (_, i) => <path key={i} d={`M${600 + q() * 700} ${380 + q() * 600} q20 -30 50 -10 t60 -20`} />)}</g>
        <g fill="#7a8a6a" opacity=".35">{[[880, 520], [1040, 640], [960, 760]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={120} ry={60} />)}</g>
        {trenches && <g stroke="#a8321a" strokeWidth={5} fill="none" strokeLinejoin="round"><path d="M520 180 l40 30 l-30 40 l50 30 l-30 50 l60 20 l-20 60 l50 40" /><path d="M600 170 l40 30 l-30 40 l50 30 l-30 50 l60 20 l-20 60 l50 40" stroke="#2a4a8a" /></g>}
        {route && <path d={route} stroke="#a8321a" strokeWidth={6} strokeDasharray="4 16" strokeLinecap="round" fill="none" />}
        {mark && <g transform={`translate(${mark[0]} ${mark[1]})`}><circle r={26} fill="none" stroke="#a8321a" strokeWidth={6} /><path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#a8321a" strokeWidth={6} /></g>}
        {ship && <g transform={`translate(${ship[0]} ${ship[1]}) rotate(${ship[2]})`}><path d="M-44 0 L44 0 L32 22 L-30 22 Z" fill="#3a2a1c" stroke="#1a100a" strokeWidth={3} /><rect x={-10} y={-26} width={22} height={26} fill="#e8e0c8" stroke="#1a100a" strokeWidth={3} /><rect x={-4} y={-46} width={10} height={22} fill="#a8321a" stroke="#1a100a" strokeWidth={3} /><path d="M-60 30 q16 -10 32 0 t32 0 t32 0 t32 0" stroke="#4a6a8a" strokeWidth={3} fill="none" /></g>}
        {children}
        {labels.map((l, i) => <text key={i} x={l.x} y={l.y} fontFamily="Georgia, serif" fontStyle="italic" fontSize={l.s ?? 34} fill="#3a2a14" letterSpacing={l.big ? 12 : 2} textAnchor="middle" opacity=".92">{l.t}</text>)}
      </g>
      {year && <text x={160} y={H - 120} fontFamily="Georgia, serif" fontWeight={700} fontSize={160} fill="#3a2a14" opacity=".22">{year}</text>}
      <g transform="translate(1700 900)"><circle r={90} fill="none" stroke="#3a2a14" strokeWidth={3} /><path d="M0 -110 L18 0 L0 110 L-18 0 Z" fill="#3a2a14" /><path d="M-110 0 L0 -18 L110 0 L0 18 Z" fill="#3a2a14" opacity=".7" /><text y={-124} textAnchor="middle" fontFamily="Georgia, serif" fontSize={30} fill="#3a2a14">U</text></g>
      <rect x={30} y={30} width={W - 60} height={H - 60} fill="none" stroke="#3a2a14" strokeWidth={6} /><rect x={50} y={50} width={W - 100} height={H - 100} fill="none" stroke="#3a2a14" strokeWidth={2} />
      <Dirt o={0.6} light={0.2}><rect width={W} height={H} fill="#000" opacity=".4" /></Dirt>
    </g>
  );
};
export {MapArt};

const Ocean: React.FC<{y: number; c1?: string; c2?: string; seed?: number}> = ({y, c1 = '#2a5a7a', c2 = '#0e2a42', seed = 3}) => {
  const q = mulberry32(seed);
  return (
    <g>
      <defs><Grad id={`oc${seed}`} stops={[[0, c1], [1, c2]]} /></defs>
      <rect y={y} width={W} height={H - y} fill={`url(#oc${seed})`} />
      {Array.from({length: 70}, (_, i) => { const yy = y + Math.pow(q(), 1.4) * (H - y), x = q() * W, w = 30 + (yy - y) * 0.5; return <path key={i} d={`M${x} ${yy} q${w / 4} -${3 + (yy - y) * 0.03} ${w / 2} 0 t${w / 2} 0`} stroke="#fff" strokeOpacity={0.12 + (yy - y) / (H - y) * 0.2} strokeWidth={2 + (yy - y) * 0.01} fill="none" />; })}
      <ellipse cx={330} cy={y + 30} rx={260} ry={12} fill="#ffe6b0" opacity=".28" filter="url(#blM)" />
    </g>
  );
};
const Ship: React.FC<{x: number; y: number; s?: number; hospital?: boolean; smoke?: boolean}> = ({x, y, s = 1, hospital, smoke = true}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={560} ry={16} fill="#06121e" opacity=".5" filter="url(#blM)" />
    <path d="M-520 -90 L500 -90 Q540 -90 560 -150 L520 -10 Q300 24 -440 24 Q-520 0 -520 -90 Z" fill={hospital ? '#f0eee6' : '#2a2a30'} stroke="#101014" strokeWidth={5} />
    <path d="M-520 -90 L500 -90 L560 -150" fill="none" stroke="#14141a" strokeWidth={8} />
    <rect x={-520} y={-48} width={1000} height={12} fill={hospital ? '#c8c4b6' : '#8a2a1c'} />
    {Array.from({length: 22}, (_, i) => <circle key={i} cx={-440 + i * 44} cy={-66} r={10} fill="#14202c" stroke="#ccc" strokeWidth={2} />)}
    <rect x={-420} y={-210} width={760} height={120} fill={hospital ? '#f4f2ea' : '#d8d0b8'} stroke="#101014" strokeWidth={4} />
    <rect x={-420} y={-210} width={760} height={120} fill="url(#houseShade)" />
    {Array.from({length: 14}, (_, i) => <rect key={i} x={-396 + i * 52} y={-190} width={30} height={40} fill="#26384a" stroke="#101014" strokeWidth={2} />)}
    <rect x={-300} y={-300} width={420} height={92} fill={hospital ? '#f4f2ea' : '#c8c0a8'} stroke="#101014" strokeWidth={4} />
    {[[-190, 0], [20, 0]].map(([fx], i) => <g key={i}><path d={`M${fx - 40} -300 L${fx + 40} -300 L${fx + 32} -440 L${fx - 32} -440 Z`} fill={hospital ? '#e8e6de' : '#b8402a'} stroke="#101014" strokeWidth={4} /><rect x={fx - 34} y={-452} width={68} height={16} fill="#14141a" /></g>)}
    {hospital && <g><rect x={-60} y={-190} width={90} height={90} fill="#fff" /><rect x={-34} y={-182} width={38} height={74} fill="#c8201e" /><rect x={-52} y={-164} width={74} height={38} fill="#c8201e" /></g>}
    <line x1={380} y1={-90} x2={380} y2={-400} stroke="#14141a" strokeWidth={6} /><line x1={-480} y1={-90} x2={-480} y2={-330} stroke="#14141a" strokeWidth={6} />
    <path d="M380 -400 L520 -100 M380 -400 L-480 -330" stroke="#14141a" strokeWidth={2} />
    {smoke && [-190, 20].map((fx, i) => <g key={i} filter="url(#blL)"><ellipse cx={fx - 100 - i * 40} cy={-520} rx={100} ry={44} fill="#3a3a44" opacity=".65" /><ellipse cx={fx - 240 - i * 50} cy={-570} rx={140} ry={50} fill="#3a3a44" opacity=".45" /></g>)}
    <path d="M-560 30 q40 -20 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#fff" strokeWidth={6} fill="none" opacity=".6" />
  </g>
);
const desk = (x: number, y: number, w: number, h: number) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#4a2e1a" /><rect x={x} y={y} width={w} height={h} fill="url(#woodP)" opacity=".5" />
    <polygon points={`${x - 20},${y} ${x + w + 20},${y} ${x + w + 40},${y - 24} ${x - 40},${y - 24}`} fill="#7a5030" /><polygon points={`${x - 20},${y} ${x + w + 20},${y} ${x + w + 40},${y - 24} ${x - 40},${y - 24}`} fill="url(#woodP)" opacity=".4" />
    <rect x={x} y={y} width={w} height={8} fill="#000" opacity=".3" />
  </g>
);
const Ref: React.FC<{src: string; z: number; cx: number; cy: number; tint?: string}> = ({src, z, cx, cy, tint}) => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Img src={staticFile(`ref/${src}.${src.endsWith('h') ? 'jpg' : 'png'}`)} style={{width: W, height: H, transform: `scale(${z})`, transformOrigin: `${cx}px ${cy}px`, filter: 'contrast(1.1) saturate(1.1)'}} />
    {tint && <AbsoluteFill style={{background: tint, mixBlendMode: 'soft-light' as any}} />}
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}><defs><radialGradient id="rv"><stop offset=".5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".55" /></radialGradient><filter id="rg"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .8 0" /></filter></defs><rect width={W} height={H} filter="url(#rg)" opacity=".16" /><rect width={W} height={H} fill="url(#rv)" /></svg>
  </AbsoluteFill>
);
const Flag: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 160}) => (
  <g transform={`translate(${x} ${y})`}><rect width={w} height={w * 0.6} fill="#1a2a6a" /><path d={`M0 0 L${w} ${w * 0.6} M${w} 0 L0 ${w * 0.6}`} stroke="#fff" strokeWidth={w * 0.1} /><path d={`M0 0 L${w} ${w * 0.6} M${w} 0 L0 ${w * 0.6}`} stroke="#c8201e" strokeWidth={w * 0.04} /><rect x={w * 0.42} width={w * 0.16} height={w * 0.6} fill="#fff" /><rect y={w * 0.22} width={w} height={w * 0.16} fill="#fff" /><rect x={w * 0.45} width={w * 0.1} height={w * 0.6} fill="#c8201e" /><rect y={w * 0.25} width={w} height={w * 0.1} fill="#c8201e" /></g>
);
const savannaBG = (id: string) => (
  <>
    <SkyRect id={id} stops={[[0, '#3a3a6a'], [0.4, '#a0607a'], [0.7, '#f09060'], [1, '#ffd08a']]} h={760} />
    <Clouds n={7} seed={4} y0={80} y1={380} c="#ffc8a0" o={0.5} />
    <Glow id={id + 'g'} x={300} y={640} r={600} c="#ffe0a0" o={0.9} />
  </>
);

/* =============================== CHAPTER 2 : Boer War =============================== */
/* 2.1 the recruiting office: Adrian stands tallest in the queue; the clerk eyes him */
const S2_1: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(.92) hue-rotate(6deg)" over={<BackFig x={80} y={1290} s={0.78} hat="bowler" dark={0.38} />}>
    <Par d={0.1}>
      <rect width={W} height={H} fill="#6a5e48" /><Mat kind="stone" o={0.5} light={0.25}><rect width={W} height={720} fill="#6a5e48" /></Mat>
      <rect y={480} width={W} height={260} fill="#3a2a1c" /><rect y={480} width={W} height={260} fill="url(#woodP)" opacity=".5" /><rect y={470} width={W} height={14} fill="#7a5a3a" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={i * 480 - 20} y={0} width={36} height={470} fill="#4a3a28" opacity=".5" />)}
      <path d="M220 90 L220 430 Q220 60 520 60 Q820 60 820 90 L820 430" fill="none" /><path d="M120 120 L120 420 L520 420 L520 120 Q320 40 120 120 Z" fill="#cfe2f4" /><path d="M120 120 L120 420 L520 420 L520 120 Q320 40 120 120 Z" fill="none" stroke="#1a140e" strokeWidth={16} /><line x1={320} y1={70} x2={320} y2={420} stroke="#1a140e" strokeWidth={8} /><line x1={120} y1={270} x2={520} y2={270} stroke="#1a140e" strokeWidth={8} />
      <Flag x={700} y={110} w={200} />
      {[1000, 1240].map((x, i) => <g key={i}><rect x={x} y={120} width={190} height={250} fill="#e8dcb8" stroke="#2a1a10" strokeWidth={5} /><Title x={x + 95} y={190} text={i ? 'KERAJAAN' : 'RAJA &'} size={30} anchor="middle" c="#8a1a1a" ls={4} /><Title x={x + 95} y={232} text={i ? 'MEMANGGIL' : 'NEGARA'} size={30} anchor="middle" c="#8a1a1a" ls={4} /><path d={`M${x + 24} 270 H${x + 166} M${x + 24} 296 H${x + 166} M${x + 24} 322 H${x + 130}`} stroke="#2a1a10" strokeWidth={4} /></g>)}
      <g><circle cx={1600} cy={190} r={74} fill="#e8e0c8" stroke="#2a2a2a" strokeWidth={8} /><line x1={1600} y1={190} x2={1600} y2={140} stroke="#222" strokeWidth={6} /><line x1={1600} y1={190} x2={1632} y2={204} stroke="#222" strokeWidth={6} /></g>
      <Rays id="o21" x={320} y={200} ang={0.9} spread={0.5} len={1300} o={0.2} />
    </Par>
    <Par d={0.8}>
      <rect y={720} width={W} height={H - 720} fill="#5a3a24" /><rect y={720} width={W} height={H - 720} fill="url(#woodP)" opacity=".6" /><Mat kind="wood" o={0.45} light={0.2}><rect y={720} width={W} height={H - 720} fill="#5a3a24" /></Mat>{Array.from({length: 9}, (_, i) => <line key={i} x1={0} y1={740 + i * 42} x2={W} y2={740 + i * 42} stroke="#000" strokeOpacity=".22" strokeWidth={2} />)}<rect y={720} width={W} height={H - 720} fill="url(#aoV)" />
    </Par>
    <Par d={1}>
      {/* queue: a short bowler-hat man, a lad, then tall Adrian, boater in hand */}
      <Fig id="q1" x={300} y={990} s={0.5} o={recruit('right', '#5a4a3a', 'bowler')} p={P(idlePose(0.3), arms.crossed, face.bored)} />
      <Fig id="q2" x={560} y={1000} s={0.51} o={recruit('right', '#4a5a6a')} p={P(idlePose(1.3), arms.explain, face.talk(2), face.smile)} />
      <Fig id="q3" x={800} y={1010} s={0.52} o={{...adrianY('right', {head: 'none'}), stretch: 1.06}} p={P(idlePose(2.1), {uaN: -34, faN: -90, handN: 'relaxed'}, {smile: 0.7, wide: 0.3, brow: 0.4, head: -3})} />
      {desk(1130, 800, 600, 220)}
      <Fig id="cl" x={1400} y={820} s={0.52} o={gent('left', '#3a3a44', 'bowler')} p={P(idlePose(0.5), arms.write, {squint: 0.6, brow: -0.5, head: 14})} />
      <Fig id="sg" x={1760} y={1020} s={0.55} o={sergeant('left')} p={P(idlePose(1.8), arms.hips, face.bored, {head: -2})} />
      <g transform="translate(1180 770)"><rect width={150} height={26} fill="#e8dcb8" stroke="#2a1a10" strokeWidth={3} /><polygon points="10,0 150,-8 150,18 10,26" fill="#d8ccA8" /><path d="M20 10 H130" stroke="#6a4a2a" strokeWidth={2} /></g>
      <g transform="translate(1560 774)"><rect width={34} height={22} fill="#1a1410" /><rect x={14} y={-40} width={6} height={44} fill="#e8dcb8" transform="rotate(14 17 -18)" /></g>
    </Par>
    <Par d={1}><Motes n={90} seed={3} y0={80} y1={700} c="#fff6d8" o={0.5} r={3} /></Par>
  </Frame>
);

/* 2.2 CU: the lie — Adrian grins nervously, the clerk raises an eyebrow, the ledger says 25 over 19 */
const S2_2: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(.95)">
    <Par d={0.1}><defs><radialGradient id="o22" cx=".5" cy=".42" r=".8"><stop offset="0" stopColor="#8a6a46" /><stop offset=".6" stopColor="#3a2a1c" /><stop offset="1" stopColor="#120c08" /></radialGradient></defs><rect width={W} height={H} fill="url(#o22)" /><Rays id="o22r" x={200} y={0} ang={1.2} spread={0.6} len={1300} o={0.14} /></Par>
    <Par d={1.1}>
      <Fig id="a22" x={560} y={2500} s={1.75} o={adrianY('right', {head: 'boater', hat: '#e8dcb8'})} p={P(idlePose(0.5), {smile: 0.9, wide: 0.35, brow: 0.6, head: 2, blink: 1})} light="indoor" lit={0.9} />
      <Fig id="c22" x={1380} y={2480} s={1.7} o={gent('left', '#3a3a44', 'bowler')} p={P(idlePose(1.5), {squint: 0.65, brow: 0.9, head: -4, mouth: 0})} light="indoor" lit={0.8} />
      <g fill="#bfe0ff" opacity=".85"><path d="M760 350 q-10 26 0 40 q12 -14 0 -40 Z" /><path d="M740 420 q-8 20 0 32 q10 -10 0 -32 Z" /></g>
    </Par>
    <Par d={1.2}>
      <polygon points="0,880 1920,840 1920,1080 0,1080" fill="#3a2414" /><polygon points="0,880 1920,840 1920,1080 0,1080" fill="url(#woodP)" opacity=".5" />
      <g transform="translate(560 900) rotate(-2)"><polygon points="0,0 800,-30 830,170 20,190" fill="#ece0bc" stroke="#6a5a3a" strokeWidth={3} /><g stroke="#6a5a3a" strokeWidth={2} opacity=".6"><path d="M200 -10 L210 190 M520 -20 L530 180" /><path d="M0 50 L810 20 M10 110 L820 80" /></g>
        <text x={40} y={34} fontFamily="Georgia, serif" fontSize={26} fill="#3a2a14">Nama:</text><text x={210} y={30} fontFamily="'Brush Script MT', cursive" fontSize={40} fill="#1a2a5a">A. Carton</text>
        <text x={40} y={96} fontFamily="Georgia, serif" fontSize={26} fill="#3a2a14">Umur:</text><text x={210} y={96} fontFamily="'Brush Script MT', cursive" fontSize={50} fill="#7a1a1a" opacity=".5" textDecoration="line-through">19</text><path d="M205 84 L260 70" stroke="#7a1a1a" strokeWidth={4} /><text x={300} y={96} fontFamily="'Brush Script MT', cursive" fontSize={54} fill="#1a2a5a">25</text>
        <ellipse cx={420} cy={140} rx={18} ry={10} fill="#1a2a5a" opacity=".8" /></g>
    </Par>
  </Frame>
);

/* 2.3 CU: signing under a false name */
const S2_3: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(.95)">
    <Par d={0.1}><rect width={W} height={H} fill="#3a2414" /><rect width={W} height={H} fill="url(#woodP)" opacity=".6" /><Mat kind="wood" o={0.5} light={0.25}><rect width={W} height={H} fill="#3a2414" /></Mat><Glow id="o23" x={400} y={200} r={900} c="#ffd8a0" o={0.35} /></Par>
    <Par d={1}>
      <polygon points="260,200 1500,150 1580,960 220,1000" fill="#000" opacity=".4" filter="url(#blM)" />
      <polygon points="240,180 1480,130 1560,940 200,980" fill="#ece0bc" /><Mat kind="cloth" o={0.4} light={0.3}><polygon points="240,180 1480,130 1560,940 200,980" fill="#ece0bc" /></Mat>
      <Title x={860} y={290} text="PERJANJIAN DINAS MILITER" size={44} anchor="middle" c="#2a1a10" ls={5} />
      <path d="M300 340 H1440 M300 400 H1440 M300 460 H1380 M300 520 H1440 M300 580 H1300" stroke="#6a5a3a" strokeWidth={3} opacity=".6" />
      <text x={320} y={800} fontFamily="Georgia, serif" fontSize={34} fill="#3a2a14">Tanda tangan prajurit:</text>
      <path d="M760 800 q40 -90 90 -20 q30 40 60 -50 q20 -30 40 10 q40 -60 80 -10 q40 -20 90 -10 q60 -20 110 4" stroke="#1a2a5a" strokeWidth={7} fill="none" strokeLinecap="round" /><text x={760} y={850} fontFamily="Georgia, serif" fontStyle="italic" fontSize={34} fill="#3a2a14">Trooper Carton</text>
      <g transform="translate(1160 560) rotate(-12)"><circle r={120} fill="none" stroke="#8a1a1a" strokeWidth={10} opacity=".7" /><circle r={96} fill="none" stroke="#8a1a1a" strokeWidth={3} opacity=".7" /><Title x={0} y={14} text="TERDAFTAR" size={34} anchor="middle" c="#8a1a1a" ls={4} o={0.8} /></g>
    </Par>
    <Par d={1.15}>
      {/* the signing hand, holding the pen */}
      <g transform="translate(1200 200) rotate(20) scale(1.3)"><g transform="translate(-4 150) rotate(-24)"><rect x={-5} y={-130} width={10} height={250} fill="#1a1410" /><polygon points="-5,120 5,120 0,160" fill="#c8a040" /><rect x={-6} y={-130} width={12} height={40} fill="#c8a040" /></g><HandCU kind="pinch" skin="#e0a880" sleeve="#3a4a3a" /></g>
    </Par>
  </Frame>
);

/* 2.4 barracks: recruits in step, Adrian out of step, the sergeant bellowing */
const tent = (x: number, y: number, w: number, h: number, k: number) => (
  <g key={k}>
    <ellipse cx={x + w / 2 + 40} cy={y + 6} rx={w * 0.6} ry={14} fill="#000" opacity=".3" filter="url(#blM)" />
    <polygon points={`${x},${y} ${x + w / 2},${y - h} ${x + w},${y}`} fill="#e6dcc0" stroke="#6a5a3a" strokeWidth={3} />
    <polygon points={`${x + w / 2},${y - h} ${x + w},${y} ${x + w * 0.6},${y}`} fill="#000" opacity=".22" />
    <polygon points={`${x + w * 0.38},${y} ${x + w / 2},${y - h * 0.55} ${x + w * 0.62},${y}`} fill="#2a1c10" />
    <path d={`M${x + w / 2} ${y - h} L${x - 30} ${y + 6} M${x + w / 2} ${y - h} L${x + w + 30} ${y + 6}`} stroke="#6a4a2a" strokeWidth={2} />
    <rect x={x + w / 2 - 3} y={y - h - 40} width={6} height={44} fill="#4a3a28" /><polygon points={`${x + w / 2 + 3},${y - h - 40} ${x + w / 2 + 40},${y - h - 30} ${x + w / 2 + 3},${y - h - 20}`} fill="#a82a2a" />
  </g>
);
const S2_4: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.1) hue-rotate(4deg)">
    <Par d={0.03}>{savannaBG('b24')}</Par>
    <Par d={0.15}><Sil seed={31} base={700} amp={40} fill="#7a5a6a" o={0.6} /><Fog id="b24f" y={600} h={200} c="#ffc89a" o={0.4} /></Par>
    <Par d={0.45}>{[100, 420, 740, 1060, 1380, 1700].map((x, i) => tent(x, 790 - (i % 2) * 14, 260, 190, i))}{[640, 1280].map((x, i) => <Tree key={i} x={x} y={800} h={320} seed={11 + i} c1="#4a5a30" c2="#9a9a50" />)}</Par>
    <Par d={0.9}>
      <rect y={800} width={W} height={H - 800} fill="#c89a5a" /><Mat kind="sand" o={0.55} light={0.4}><rect y={800} width={W} height={H - 800} fill="#c89a5a" /></Mat><rect y={800} width={W} height={H - 800} fill="url(#aoV)" />
      {Array.from({length: 22}, (_, i) => <ellipse key={i} cx={80 + i * 90} cy={880 + (i % 5) * 36} rx={34} ry={7} fill="#7a5a30" opacity=".35" />)}
      {[100, 420, 740, 1060, 1380, 1700].map((x, i) => <Cast key={i} x={x} y={796} w={260} h={190} o={0.26} />)}
    </Par>
    <Par d={1}>
      {[0, 1, 2].map((i) => <Fig key={i} id={`r${i}`} x={300 + i * 250} y={1000 + i * 8} s={0.55} o={trooper('right', i === 1 ? '#c89870' : '#e0a880')} p={P(walkPose(i * 0.4 + 0.2, 1), face.smile)} />)}
      <Fig id="adr" x={1060} y={1030} s={0.57} o={{...adrianY('right', {head: 'slouch', hat: '#8a7448', gear: 'rifle'}), outfit: 'trousers'}} p={P(walkPose(3.4, 1), {uaN: 24, uaF: -26, head: 12, torso: 5, wide: 0.5, mouth: 0.25, brow: 0.5})} />
      <Fig id="ser" x={1560} y={1010} s={0.58} o={sergeant('left')} p={P(idlePose(0.9), arms.point, face.angry, face.talk(4), {torso: -4})} />
      <g fill="#e6c88a" opacity=".5" filter="url(#blS)">{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={260 + i * 60} cy={1040} rx={50} ry={14} />)}</g>
    </Par>
    <Par d={1}><Rays id="b24r" x={300} y={640} ang={0.35} spread={1.1} len={1500} o={0.1} /><Motes n={60} seed={5} y0={500} y1={1000} c="#ffe0a0" o={0.5} /></Par>
  </Frame>
);

/* 2.5 the map: London to the Cape */
const S2_5: React.FC = () => (
  <Frame grade="contrast(1.05) saturate(1.0)">
    <MapArt route="M640 70 C 420 300 380 700 700 960 C 850 1030 940 1030 1000 1010" ship={[440, 560, 70]} mark={[1000, 1010]} year="1899" labels={[{x: 640, y: 36, t: 'LONDON'}, {x: 1130, y: 1060, t: 'Tanjung Harapan', s: 30}, {x: 1000, y: 620, t: 'AFRIKA', s: 64, big: true}, {x: 760, y: 220, t: 'E R O P A', s: 54, big: true}, {x: 1560, y: 360, t: 'Arabia', s: 34}]} />
  </Frame>
);

/* 2.6 the troopship */
const S2_6: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.15) hue-rotate(2deg)">
    <Par d={0.03}><SkyRect id="s26" stops={[[0, '#2a3a6a'], [0.5, '#c07a7a'], [1, '#ffcf8a']]} h={620} /><Clouds n={8} seed={6} y0={70} y1={420} c="#ffc0a0" o={0.5} /><Glow id="s26g" x={330} y={600} r={620} c="#ffe0a0" o={0.9} /><Birds n={8} seed={9} x0={300} x1={1600} y0={150} y1={420} c="#2a2040" /></Par>
    <Par d={0.5}><Ocean y={600} seed={4} /></Par>
    <Par d={1}>
      <Ship x={1020} y={760} s={1.05} />
      {Array.from({length: 18}, (_, i) => <Fig key={i} id={`d${i}`} x={640 + i * 40} y={656 - (i % 2) * 6} s={0.1} o={trooper('right')} p={idlePose(i)} lo />)}
      <path d="M0 800 Q480 780 960 800 T1920 800" stroke="#fff" strokeWidth={5} fill="none" opacity=".4" />
    </Par>
    <Par d={1.3}><Ocean y={900} c1="#1a4a6a" c2="#06182a" seed={8} /></Par>
    <Par d={1}><Rays id="s26r" x={330} y={600} ang={0.3} spread={1.0} len={1500} o={0.08} /></Par>
  </Frame>
);

/* 2.7  A-shots re-framed from the finished battle frames */
const S2_7: React.FC = () => <Ref src="f40" z={1.0} cx={900} cy={540} tint="#ffb080" />;
const S2_8: React.FC = () => <Ref src="f336h" z={2.3} cx={1230} cy={470} tint="#ffa060" />;
const S2_9: React.FC = () => <Ref src="f125h" z={1.9} cx={1361} cy={498} tint="#ffb080" />;
const S2_10: React.FC = () => <Ref src="f100" z={1.15} cx={900} cy={620} tint="#ff9060" />;

/* 2.11 CU a Boer farmer takes aim */
const S2_11: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(1.1)">
    <Par d={0.03}>{savannaBG('b211')}</Par>
    <Par d={0.3} blur={8}><Sil seed={31} base={720} amp={50} fill="#7a5a6a" o={0.7} /><rect y={720} width={W} height={H - 720} fill="#a8783a" /></Par>
    <Par d={1.1}>
      <Fig id="b211" x={1250} y={2240} s={1.55} o={{...boer('left'), head: 'slouch'}} p={P(aimPose(0.2), {squint: 0.85, brow: -0.5, mouth: 0.12})} lit={0.9} />
      <g><ellipse cx={380} cy={400} rx={140} ry={50} fill="#fff4c0" opacity=".9" /><ellipse cx={380} cy={400} rx={70} ry={26} fill="#fff" /><Glow id="mz" x={380} y={400} r={260} c="#ffb040" o={0.6} /></g>
    </Par>
    <Par d={1}><Motes n={50} seed={8} c="#ffe0a0" o={0.5} /></Par>
  </Frame>
);
const S2_12: React.FC = () => <Ref src="f194h" z={1.5} cx={1020} cy={520} tint="#ffd0a0" />;

/* 2.13 CU: shock — the front rig, wide-eyed and open-mouthed */
const S2_13: React.FC = () => (
  <Frame grade="contrast(1.12) saturate(1.0)" over={<Character pose={{head: 3, blink: 1, yaw: -6, mouth: 0.8}} variant={{young: true}} cam={{x: 0, y: 0, zoom: 4.3, px: 797, py: 330}} light={{key: '#ffd9a0', rim: '#ffcf98'}} />}>
    <defs><radialGradient id="b213" cx=".5" cy=".45" r=".8"><stop offset="0" stopColor="#d89060" /><stop offset=".6" stopColor="#6a3a30" /><stop offset="1" stopColor="#1a0e0c" /></radialGradient></defs>
    <rect width={W} height={H} fill="url(#b213)" />
    <g filter="url(#blL)" opacity=".5">{Array.from({length: 14}, (_, i) => <circle key={i} cx={(i * 337) % W} cy={(i * 211) % H} r={40 + (i % 4) * 30} fill={['#ffc080', '#ff8a4a', '#a0607a'][i % 3]} opacity={0.3} />)}</g>
    <Motes n={80} seed={11} c="#ffd8a0" o={0.6} r={3} />
  </Frame>
);
const S2_14: React.FC = () => <Ref src="f336h" z={1.0} cx={900} cy={540} tint="#ffb080" />;
const S2_15: React.FC = () => <Ref src="f376h" z={1.5} cx={640} cy={700} tint="#ffa070" />;

/* 2.16 the hospital ship */
const S2_16: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.0) hue-rotate(-4deg)">
    <Par d={0.03}><SkyRect id="s216" stops={[[0, '#6a8ab8'], [0.55, '#e8d0b0'], [1, '#ffe8c0']]} h={640} /><Clouds n={9} seed={2} y0={60} y1={420} c="#fff" o={0.6} /><Glow id="s216g" x={300} y={560} r={520} c="#fff2d0" o={0.8} /></Par>
    <Par d={0.5}><Ocean y={620} c1="#4a8aa8" c2="#1a4a6a" seed={5} /></Par>
    <Par d={1}>
      <Ship x={1060} y={780} s={1.0} hospital smoke={false} />
      {[-300, -200, -110, 10, 130, 230].map((x, i) => <Fig key={i} id={`h${i}`} x={1060 + x} y={716} s={0.14} o={i % 2 ? nurse('right') : patient('left')} p={idlePose(i)} lo />)}
    </Par>
    <Par d={1}><Birds n={7} seed={5} x0={400} x1={1700} y0={120} y1={380} c="#3a3a48" /></Par>
  </Frame>
);

/* 2.17 CU: the doctor probes, Adrian winces */
const S2_17: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(.9) hue-rotate(6deg)">
    <Par d={0.1}><defs><radialGradient id="h217" cx=".5" cy=".4" r=".8"><stop offset="0" stopColor="#c8c4b0" /><stop offset=".6" stopColor="#6a6a5a" /><stop offset="1" stopColor="#1a1a14" /></radialGradient></defs><rect width={W} height={H} fill="url(#h217)" /><Rays id="h217r" x={1500} y={0} ang={2.0} spread={0.6} len={1300} o={0.14} /></Par>
    <Par d={1.1}>
      <Fig id="dc" x={520} y={2470} s={1.72} o={doctor('right')} p={P(idlePose(0.4), {squint: 0.45, brow: -0.35, head: 8, mouth: 0.05}, arms.press)} light="indoor" lit={0.8} />
      <Fig id="pt" x={1400} y={2480} s={1.72} o={patient('left')} p={P(idlePose(1.0), face.angry, {grimace: 1, mouth: 0.3, head: 3})} light="indoor" lit={0.85} />
    </Par>
    <Par d={1.2}><polygon points="0,950 1920,900 1920,1080 0,1080" fill="#d8d4c4" /><polygon points="0,950 1920,900 1920,912 0,962" fill="#9a9686" /></Par>
  </Frame>
);

/* 2.18 on deck, looking up at the sky */
const S2_18: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.0) hue-rotate(-4deg)">
    <Par d={0.03}><SkyRect id="s218" stops={[[0, '#5a82b8'], [0.7, '#cfe0ec'], [1, '#f6ecd0']]} h={1080} /><Clouds n={8} seed={4} y0={120} y1={560} c="#fff" o={0.7} /><Glow id="s218g" x={300} y={160} r={480} c="#fff6d8" o={0.8} /><Birds n={5} seed={6} x0={500} x1={1500} y0={180} y1={440} c="#3a3a48" s={1.4} /></Par>
    <Par d={0.7}>
      <rect x={1200} y={0} width={30} height={900} fill="#3a2a1c" /><path d="M1215 0 L520 900 M1215 0 L1900 900" stroke="#3a2a1c" strokeWidth={4} />
      <rect x={1500} y={160} width={300} height={420} fill="#f4f2ea" stroke="#1a1a22" strokeWidth={5} /><rect x={1500} y={160} width={300} height={420} fill="url(#houseShade)" />{[0, 1, 2].map((i) => <rect key={i} x={1530 + i * 90} y={220} width={60} height={80} fill="#26384a" />)}
    </Par>
    <Par d={1}>
      <rect y={880} width={W} height={200} fill="#8a6a44" /><rect y={880} width={W} height={200} fill="url(#woodP)" opacity=".6" /><Mat kind="wood" o={0.5} light={0.25}><rect y={880} width={W} height={200} fill="#8a6a44" /></Mat><rect y={880} width={W} height={10} fill="#3a2a1c" />
      <rect x={220} y={940} width={1100} height={26} fill="#6a5a3a" />
      <Fig id="lay" x={760} y={942} s={0.62} o={patient('right')} p={P(idlePose(0.4), {fall: -0.99, head: 18}, face.wonder)} />
      <Fig id="nur" x={1250} y={1010} s={0.58} o={nurse('left')} p={P(idlePose(1.1), arms.offer, face.smile, {head: -3})} />
      <rect x={300} y={840} width={800} height={46} fill="#e8e4d8" stroke="#8a8676" strokeWidth={3} opacity={0} />
    </Par>
    <Par d={1}><Rays id="s218r" x={300} y={160} ang={0.9} spread={1.2} len={1500} o={0.08} /></Par>
  </Frame>
);

/* 2.19 CU: saluting the officer */
const S2_19: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.0) hue-rotate(4deg)">
    <Par d={0.1}><defs><radialGradient id="t219" cx=".5" cy=".4" r=".85"><stop offset="0" stopColor="#d8b888" /><stop offset=".6" stopColor="#6a5238" /><stop offset="1" stopColor="#1a120c" /></radialGradient></defs><rect width={W} height={H} fill="url(#t219)" /><Rays id="t219r" x={200} y={0} ang={1.15} spread={0.6} len={1300} o={0.14} /></Par>
    <Par d={1.1}>
      <Fig id="of" x={520} y={2480} s={1.72} o={khakiOfficer('right')} p={P(idlePose(0.3), face.smile, {head: 2, brow: 0.2})} light="warm" lit={0.9} />
      <Fig id="ad" x={1400} y={2490} s={1.72} o={{...patient('left'), head: 'slouch', hat: '#8a7448', bandages: true}} p={P(idlePose(1.0), {uaN: -146, faN: -134, handN: 'open', head: 2, torso: -2}, face.smile)} light="warm" lit={0.9} />
    </Par>
    <Par d={1}><Motes n={60} seed={4} c="#ffe0a0" o={0.5} r={3} /></Par>
  </Frame>
);

/* 2.20 officer's tent: Adrian back in uniform and out of the door */
const S2_20: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.1) hue-rotate(4deg)">
    <Par d={0.03}>{savannaBG('t220')}</Par>
    <Par d={0.15}><Sil seed={33} base={720} amp={44} fill="#7a5a6a" o={0.6} /></Par>
    <Par d={0.5}>
      <polygon points="260,820 960,180 1660,820" fill="#e6dcc0" stroke="#6a5a3a" strokeWidth={4} /><polygon points="960,180 1660,820 1180,820" fill="#000" opacity=".22" /><polygon points="760,820 960,420 1160,820" fill="#2a1c10" /><polygon points="760,820 960,420 880,820" fill="#4a3220" />
      <Glow id="t220l" x={960} y={640} r={300} c="#ffb050" o={0.5} /><rect x={950} y={600} width={20} height={36} fill="#ffd890" />
      <g transform="translate(980 780)"><rect x={-110} y={0} width={220} height={20} fill="#6a4a2a" /><rect x={-100} y={20} width={14} height={60} fill="#4a3220" /><rect x={86} y={20} width={14} height={60} fill="#4a3220" /><polygon points="-90,0 80,-20 100,-4 -70,16" fill="#e8dcb8" /></g>
      <path d="M960 180 L960 120" stroke="#4a3a28" strokeWidth={8} /><Flag x={964} y={110} w={120} />
    </Par>
    <Par d={0.9}><rect y={820} width={W} height={H - 820} fill="#c89a5a" /><Mat kind="sand" o={0.55} light={0.4}><rect y={820} width={W} height={H - 820} fill="#c89a5a" /></Mat><rect y={820} width={W} height={H - 820} fill="url(#aoV)" /><Cast x={260} y={826} w={1400} h={300} o={0.24} /></Par>
    <Par d={1}>
      <Fig id="of2" x={560} y={980} s={0.56} o={khakiOfficer('right')} p={P(idlePose(0.6), arms.point, face.talk(2))} />
      <Fig id="ad2" x={1220} y={1000} s={0.57} o={{...adrianY('left', {head: 'slouch', hat: '#8a7448', gear: 'none'}), outfit: 'trousers'}} p={P(idlePose(1.4), {uaN: -146, faN: -134, handN: 'open'}, face.smile, {head: -2})} />
      <Fig id="tr" x={1700} y={1050} s={0.52} o={trooper('left')} p={P(walkPose(1.2, 0.8), face.smile)} />
    </Par>
    <Par d={1}><Rays id="t220r" x={300} y={640} ang={0.35} spread={1.0} len={1500} o={0.1} /><Motes n={60} seed={5} y0={500} y1={1000} c="#ffe0a0" o={0.5} /></Par>
  </Frame>
);

/* =============================== CHAPTER 3 : between the wars =============================== */
/* 3.1 Austrian church, 1908 */
const S3_1: React.FC = () => {
  const q = mulberry32(3);
  return (
    <Frame grade="contrast(1.06) saturate(1.1) hue-rotate(-4deg)" over={<BackFig x={1840} y={1290} s={0.78} hat="top" dark={0.36} />}>
      <Par d={0.03}><SkyRect id="w31" stops={[[0, '#7aa4d4'], [0.6, '#dce8e8'], [1, '#fff0d0']]} h={760} /><Clouds n={8} seed={3} y0={60} y1={400} c="#fff" o={0.7} /><Glow id="w31g" x={300} y={300} r={460} c="#fff6d8" o={0.7} /><Birds n={9} seed={2} x0={400} x1={1500} y0={100} y1={360} c="#3a3a48" /></Par>
      <Par d={0.15}><Sil seed={41} base={720} amp={60} fill="#6a8a78" o={0.55} /></Par>
      <Par d={0.5}>
        <rect x={440} y={260} width={1040} height={600} fill="#e8dcc0" /><rect x={440} y={260} width={1040} height={600} fill="url(#blockP)" opacity=".4" /><Dirt o={0.4} light={0.3}><rect x={440} y={260} width={1040} height={600} fill="#000" /></Dirt><rect x={440} y={260} width={1040} height={600} fill="url(#houseShade)" />
        <polygon points="420,260 960,60 1500,260" fill="#8a3a2a" /><polygon points="420,260 960,60 1500,260" fill="url(#tileP)" />
        {[560, 1260].map((x, i) => <g key={i}><rect x={x} y={120} width={150} height={260} fill="#e8dcc0" /><rect x={x} y={120} width={150} height={260} fill="url(#houseShade)" /><path d={`M${x - 10} 120 Q${x + 75} -40 ${x + 160} 120 Z`} fill="#2a8a6a" /><circle cx={x + 75} cy={-10} r={16} fill="#e0b050" /><rect x={x + 55} y={170} width={40} height={90} rx={20} fill="#2a1a10" /></g>)}
        <g><circle cx={960} cy={310} r={64} fill="#2a3a5a" stroke="#c8b898" strokeWidth={10} />{Array.from({length: 8}, (_, i) => <line key={i} x1={960} y1={310} x2={960 + 64 * Math.cos((i * Math.PI) / 4)} y2={310 + 64 * Math.sin((i * Math.PI) / 4)} stroke="#c8b898" strokeWidth={4} />)}</g>
        {[560, 760, 1160, 1360].map((x) => <path key={x} d={`M${x} 700 V480 Q${x + 50} 400 ${x + 100} 480 V700 Z`} fill="#2a3a5a" stroke="#c8b898" strokeWidth={8} />)}
        <path d="M860 860 V620 Q960 520 1060 620 V860 Z" fill="#3a2414" stroke="#c8b898" strokeWidth={10} /><path d="M860 860 V620 Q960 520 1060 620 V860 Z" fill="url(#woodP)" opacity=".5" />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={600 + i * 120} y={820} width={120 - 4} height={40} fill="#c8b898" />)}
      </Par>
      <Par d={0.9}><rect y={860} width={W} height={H - 860} fill="#a8a090" /><CobbleP y0={860} base="#9a9484" seed={3} /><Cast x={440} y={866} w={1040} h={420} o={0.26} />{[-1, 0, 1].map((i) => <polygon key={i} points={`${760 + i * 100},880 ${1160 + i * 100},880 ${1300 + i * 120},1080 ${620 + i * 80},1080`} fill="#8a1a2a" opacity={i === 0 ? 0.9 : 0} />)}</Par>
      <Par d={1}>
        {/* bride and groom on the steps, guests flinging petals */}
        <Fig id="br" x={1020} y={1040} s={0.55} o={{...lady('left', '#f4efe6'), head: 'scarf', hat: '#ffffff'}} p={P(idlePose(0.4), arms.offer, face.smile)} />
        <Fig id="gr" x={800} y={1040} s={0.56} o={{...gent('right', '#2a2a34'), mustache: true}} p={P(idlePose(1.4), arms.offer, face.smile, {head: 3})} />
        {[360, 520, 1320, 1500, 1700].map((x, i) => <Fig key={i} id={`gs${i}`} x={x} y={1000 + (i % 2) * 20} s={0.5} o={i % 2 ? lady(i < 3 ? 'right' : 'left', ['#2a6a8a', '#8a4a6a', '#6a8a4a'][i % 3]) : gent(i < 3 ? 'right' : 'left', '#3a3a44', i === 2 ? 'bowler' : 'top')} p={P(idlePose(i * 1.3), arms.wave, face.laugh)} />)}
        {Array.from({length: 70}, (_, i) => <ellipse key={i} cx={420 + q() * 1100} cy={500 + q() * 560} rx={7} ry={4} fill={['#ffffff', '#ffd0d8', '#ffe8a0'][i % 3]} transform={`rotate(${q() * 180} ${420 + q() * 1100} ${500 + q() * 560})`} opacity={0.9} />)}
      </Par>
      <Par d={1}><Rays id="w31r" x={300} y={300} ang={0.65} spread={0.8} len={1500} o={0.09} /></Par>
    </Frame>
  );
};

/* 3.2 CU: the ring */
const S3_2: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.1)">
    <Par d={0.1}><defs><radialGradient id="r32" cx=".5" cy=".45" r=".8"><stop offset="0" stopColor="#fff2d8" /><stop offset=".6" stopColor="#c8a888" /><stop offset="1" stopColor="#4a3228" /></radialGradient></defs><rect width={W} height={H} fill="url(#r32)" /><g filter="url(#blL)" opacity=".6">{Array.from({length: 14}, (_, i) => <circle key={i} cx={(i * 313) % W} cy={(i * 197) % 700} r={50 + (i % 3) * 30} fill={['#fff', '#ffd0d8', '#ffe8a0'][i % 3]} opacity={0.5} />)}</g></Par>
    <Par d={1.1}>
      {/* the bride's open hand, lace cuff, ring finger up; the groom's fingers set the ring on */}
      <g transform="translate(700 340) rotate(160) scale(1.9)"><HandCU kind="open" skin="#e8b48a" sleeve="#f4efe6" shirt="#ffffff" id="hl" /></g>
      <g transform="translate(1340 760) rotate(-20) scale(1.61)"><HandCU kind="point" skin="#e0a880" sleeve="#2a2a34" /></g>
      <g transform="translate(1010 690)"><ellipse rx={24} ry={20} fill="none" stroke="#e8b830" strokeWidth={11} /><ellipse rx={24} ry={20} fill="none" stroke="#fff3a0" strokeWidth={3} transform="translate(-3 -3)" opacity=".8" /><polygon points="-9,-24 9,-24 13,-34 -13,-34" fill="#bfe8ff" stroke="#6a8aaa" strokeWidth={2} /></g>
      <g style={{mixBlendMode: 'screen'} as any}><path d="M1010 640 l0 -50 M985 650 l-34 -34 M1035 650 l34 -34" stroke="#fff" strokeWidth={5} strokeLinecap="round" /></g>
    </Par>
    <Par d={1}><Motes n={70} seed={6} c="#fff8e0" o={0.6} r={3} /></Par>
  </Frame>
);

/* 3.3 MS on the steps: vows, beaming guests behind, petals */
const S3_3: React.FC = () => {
  const q = mulberry32(8);
  return (
    <Frame grade="contrast(1.06) saturate(1.1)">
      <Par d={0.1}><SkyRect id="w33" stops={[[0, '#8ab0dc'], [1, '#fff0d0']]} h={1080} /><Clouds n={6} seed={4} y0={80} y1={500} c="#fff" o={0.6} /></Par>
      <Par d={0.45}><rect x={0} y={0} width={W} height={760} fill="#e8dcc0" opacity=".55" /><Mat kind="stone" o={0.4} light={0.25}><rect width={W} height={760} fill="#e8dcc0" /></Mat>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={i * 420 + 60} y={40} width={90} height={720} fill="#d0c4a8" />)}<path d="M0 0 Q480 120 960 0 T1920 0" fill="#c8b898" /></Par>
      <Par d={0.9}><rect y={760} width={W} height={320} fill="#b8b0a0" /><Mat kind="stone" o={0.5} light={0.3}><rect y={760} width={W} height={320} fill="#b8b0a0" /></Mat>{[0, 1, 2].map((i) => <rect key={i} x={0} y={820 + i * 90} width={W} height={24} fill="#9a9484" />)}</Par>
      <Par d={1}>
        {[260, 460, 1500, 1720].map((x, i) => <Fig key={i} id={`gu${i}`} x={x} y={880} s={0.5} o={i % 2 ? lady(i < 2 ? 'right' : 'left', ['#2a6a8a', '#8a4a6a'][i % 2]) : gent(i < 2 ? 'right' : 'left', '#3a3a44', 'top')} p={P(idlePose(i), arms.wave, face.laugh)} />)}
        <Fig id="gr3" x={820} y={1040} s={0.8} o={{...gent('right', '#2a2a34'), mustache: true}} p={P(idlePose(0.4), arms.offer, face.smile, {head: 3})} />
        <Fig id="br3" x={1160} y={1050} s={0.78} o={{...lady('left', '#f4efe6'), hat: '#ffffff'}} p={P(idlePose(1.2), arms.offer, face.smile, {head: -3})} />
        {Array.from({length: 90}, (_, i) => <ellipse key={i} cx={q() * W} cy={q() * H} rx={8} ry={4.5} fill={['#fff', '#ffd0d8', '#ffe8a0'][i % 3]} transform={`rotate(${q() * 180} ${q() * W} ${q() * H})`} opacity={0.85} />)}
      </Par>
      <Par d={1}><Rays id="w33r" x={200} y={0} ang={1.15} spread={0.9} len={1500} o={0.1} /></Par>
    </Frame>
  );
};

/* ------------- India: polo, pig-sticking, the veranda ------------- */
const indiaSky = (id: string) => (
  <>
    <SkyRect id={id} stops={[[0, '#5a9ac8'], [0.55, '#f0d8a8'], [1, '#ffe0a0']]} h={640} />
    <Clouds n={6} seed={7} y0={60} y1={360} c="#fff" o={0.45} />
    <Glow id={id + 'g'} x={300} y={300} r={480} c="#fff2c8" o={0.9} />
  </>
);
const Rider: React.FC<{id: string; x: number; y: number; s: number; face: 'left' | 'right'; o: SideOpts; p?: any; coat?: string}> = ({id, x, y, s, face: f, o, p, coat = '#6a3a22'}) => {
  const sh = (saddleHeight('horse') - 666) * s;
  return (
    <g>
      <Fig id={`${id}h`} x={x} y={y} s={s} o={{pal: khaki}} p={{}} art={<AnimalArt o={{kind: 'horse', coat, mane: '#1e140c', face: f, tack: true}} p={{phase: x / 120, stride: 1}} />} />
      <Fig id={`${id}r`} x={x + (f === 'right' ? -10 : 10) * s} y={y - sh} s={s} o={{...o, face: f}} p={{...ridePose(0.4), ...p}} />
    </g>
  );
};
const S3_4: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.2) hue-rotate(2deg)">
    <Par d={0.03}>{indiaSky('p34')}</Par>
    <Par d={0.15}><Sil seed={61} base={650} amp={30} fill="#7a9a6a" o={0.6} /><Tree x={200} y={660} h={280} seed={6} c1="#2e5a2a" c2="#7aaa4a" /><Tree x={1760} y={660} h={300} seed={9} c1="#2e5a2a" c2="#7aaa4a" /></Par>
    <Par d={0.4}>
      <rect x={520} y={520} width={880} height={130} fill="#e8dcc0" /><rect x={520} y={520} width={880} height={130} fill="url(#houseShade)" />{Array.from({length: 40}, (_, i) => <g key={i}><circle cx={540 + i * 22} cy={540 + (i % 3) * 6} r={6} fill="#c89870" /><rect x={535 + i * 22} y={546 + (i % 3) * 6} width={10} height={18} fill={['#e8e0d0', '#c8402c', '#2a6a8a'][i % 3]} /></g>)}
      <path d="M520 520 Q960 440 1400 520" fill="none" stroke="#c8402c" strokeWidth={8} />{Array.from({length: 22}, (_, i) => <polygon key={i} points={`${540 + i * 40},${500 - Math.sin(i * 0.3) * 20} ${572 + i * 40},${506 - Math.sin(i * 0.3) * 20} ${556 + i * 40},${544 - Math.sin(i * 0.3) * 20}`} fill={['#c8402c', '#e0a030', '#2c6a8a'][i % 3]} />)}
    </Par>
    <Par d={0.9}><rect y={650} width={W} height={H - 650} fill="#5a9a3e" />{Array.from({length: 12}, (_, i) => <rect key={i} x={i * 170} y={650} width={85} height={H - 650} fill="#fff" opacity=".05" />)}<Mat kind="grass" o={0.5} light={0.3}><rect y={650} width={W} height={H - 650} fill="#5a9a3e" /></Mat><rect y={650} width={W} height={H - 650} fill="url(#aoV)" /><g stroke="#f4efe0" strokeWidth={6} opacity=".8"><line x1={0} y1={760} x2={W} y2={740} /></g>
      {Array.from({length: 16}, (_, i) => <ellipse key={i} cx={120 + i * 118} cy={900 + (i % 4) * 36} rx={30} ry={6} fill="#4a3a22" opacity=".4" />)}</Par>
    <Par d={1}>
      <Rider id="p1" x={540} y={900} s={0.34} face="right" o={{...young('right'), outfit: 'blazer', head: 'pith', hat: '#eadfc4', pal: {...young('right').pal, top: '#e8e0d0', bottom: '#e8e0d0'}}} p={{uaN: -40, faN: -40}} coat="#6a3a22" />
      <Rider id="p2" x={940} y={940} s={0.4} face="right" o={{...gent('right', '#c8402c', 'pith'), outfit: 'blazer', hat: '#eadfc4', pal: civ('#c8402c', '#e8e0d0')}} p={{uaN: -120, faN: -30}} coat="#3a2a1c" />
      <Rider id="p3" x={1340} y={920} s={0.37} face="left" o={{...gent('left', '#2a5a9a', 'pith'), outfit: 'blazer', hat: '#eadfc4', pal: civ('#2a5a9a', '#e8e0d0')}} p={{uaN: -90, faN: -50}} coat="#8a6a3a" />
      <Rider id="p4" x={1660} y={880} s={0.31} face="left" o={{...gent('left', '#2a5a9a', 'pith'), outfit: 'blazer', hat: '#eadfc4', pal: civ('#2a5a9a', '#e8e0d0')}} p={{uaN: -60, faN: -60}} coat="#4a3a2a" />
      <g transform="translate(1210 960)"><circle r={14} fill="#f4efe0" stroke="#2a2a2a" strokeWidth={2} /></g>
      <g fill="#e6c88a" opacity=".5" filter="url(#blS)">{[0, 1, 2].map((i) => <ellipse key={i} cx={400 + i * 70} cy={900} rx={60} ry={16} />)}</g>
    </Par>
    <Par d={1}><Rays id="p34r" x={300} y={300} ang={0.7} spread={0.9} len={1600} o={0.09} /><Motes n={50} seed={5} y0={500} y1={1000} c="#fff0d0" o={0.5} /></Par>
  </Frame>
);

/* 3.5 MS: the swing */
const S3_5: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.2) hue-rotate(2deg)">
    <Par d={0.03}>{indiaSky('p35')}</Par>
    <Par d={0.2} blur={6}><Sil seed={61} base={660} amp={30} fill="#7a9a6a" o={0.6} /></Par>
    <Par d={0.9}><rect y={660} width={W} height={H - 660} fill="#5a9a3e" /><Mat kind="grass" o={0.5} light={0.3}><rect y={660} width={W} height={H - 660} fill="#5a9a3e" /></Mat><rect y={660} width={W} height={H - 660} fill="url(#aoV)" /></Par>
    <Par d={1}>
      <Rider id="sw" x={820} y={1010} s={0.62} face="right" o={{...young('right'), outfit: 'blazer', head: 'pith', hat: '#eadfc4', pal: {...young('right').pal, top: '#e8e0d0', bottom: '#e8e0d0'}}} p={P({uaN: -150, faN: -30, uaF: -30, faF: -50, handN: 'open', torso: 6}, face.angry)} coat="#6a3a22" />
      <g transform="translate(1180 520) rotate(40)"><rect x={-6} y={-10} width={12} height={380} fill="#8a5a2a" stroke="#2a1a10" strokeWidth={2} /><rect x={-30} y={350} width={60} height={26} rx={6} fill="#c89a5a" stroke="#2a1a10" strokeWidth={2} /></g>
      <g transform="translate(1520 1000)"><circle r={18} fill="#f4efe0" stroke="#2a2a2a" strokeWidth={2} /></g>
      {Array.from({length: 16}, (_, i) => <path key={i} d={`M${1140 + i * 24} ${660 + (i % 3) * 18} l${16 + i} ${-10}`} stroke="#6aaa52" strokeWidth={4} />)}
      <g opacity=".5">{[0, 1, 2, 3].map((i) => <path key={i} d={`M${1280 + i * 24} ${480 + i * 10} q-80 120 -240 220`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.5 - i * 0.1} />)}</g>
    </Par>
    <Par d={1}><Rays id="p35r" x={300} y={300} ang={0.8} spread={0.9} len={1600} o={0.09} /></Par>
  </Frame>
);

/* 3.6 pig-sticking: a rider chasing a boar through tall grass */
const boar = (x: number, y: number, s: number) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={150} ry={14} fill="#000" opacity=".35" filter="url(#blM)" />
    <path d="M-110 -70 Q-120 -150 -20 -170 Q100 -176 150 -110 Q170 -70 130 -50 L-70 -44 Z" fill="#4a3a30" stroke="#1a1410" strokeWidth={5} /><path d="M-110 -70 Q-120 -150 -20 -170 Q100 -176 150 -110 Q170 -70 130 -50 L-70 -44 Z" fill="url(#sideShade)" />
    {Array.from({length: 22}, (_, i) => <path key={i} d={`M${-90 + i * 10} ${-150 + (i % 3) * 8} l-4 -20`} stroke="#2a1a14" strokeWidth={3} />)}
    <path d="M140 -110 Q220 -100 236 -62 Q226 -44 180 -48 Z" fill="#5a4a40" stroke="#1a1410" strokeWidth={4} /><path d="M200 -56 q18 -24 38 -30" stroke="#f4efe0" strokeWidth={8} fill="none" strokeLinecap="round" /><circle cx={190} cy={-86} r={6} fill="#14100c" /><path d="M120 -150 l-16 -40 l36 20 z" fill="#3a2a22" />
    {[-70, -30, 70, 110].map((lx, i) => <path key={i} d={`M${lx} -48 l${i % 2 ? 14 : -10} 50`} stroke="#2a1a14" strokeWidth={14} strokeLinecap="round" />)}
  </g>
);
const S3_6: React.FC = () => {
  const q = mulberry32(12);
  return (
    <Frame grade="contrast(1.08) saturate(1.2) hue-rotate(4deg)">
      <Par d={0.03}>{indiaSky('p36')}</Par>
      <Par d={0.2}><Sil seed={72} base={640} amp={50} fill="#7a8a58" o={0.6} /><Fog id="p36f" y={560} h={180} c="#fff0d0" o={0.4} /></Par>
      <Par d={0.8}><rect y={640} width={W} height={H - 640} fill="#b8a050" /><Mat kind="grass" o={0.5} light={0.3}><rect y={640} width={W} height={H - 640} fill="#b8a050" /></Mat><rect y={640} width={W} height={H - 640} fill="url(#aoV)" />{Array.from({length: 120}, (_, i) => <path key={i} d={`M${q() * W} ${700 + q() * 380} q6 -${30 + q() * 50} 16 -${60 + q() * 60}`} stroke={['#c8b868', '#9a8a40', '#d8c878'][i % 3]} strokeWidth={4} fill="none" strokeLinecap="round" />)}</Par>
      <Par d={1}>
        {boar(1400, 900, 0.7)}
        <Rider id="ps" x={720} y={960} s={0.58} face="right" o={{...young('right'), outfit: 'blazer', head: 'pith', hat: '#eadfc4', pal: {...young('right').pal, top: '#e8e0d0', bottom: '#e8e0d0'}}} p={P({uaN: -84, faN: -22, uaF: -40, faF: -40, handN: 'relaxed', torso: 10}, face.laugh)} coat="#6a3a22" />
        <g><rect x={910} y={640} width={640} height={8} fill="#6a4a2a" transform="rotate(10 910 644)" /><polygon points="1540,676 1600,692 1540,704" fill="#c8ccd0" stroke="#3a3a3a" strokeWidth={2} /></g>
        <g fill="#c8a860" opacity=".6" filter="url(#blS)">{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={1180 + i * 60} cy={960} rx={60} ry={14} />)}</g>
      </Par>
      <Par d={1.8} blur={9}>{Array.from({length: 28}, (_, i) => <path key={i} d={`M${i * 70} 1080 q10 -80 30 -150`} stroke="#8a7a30" strokeWidth={14} fill="none" strokeLinecap="round" />)}</Par>
      <Par d={1}><Rays id="p36r" x={300} y={300} ang={0.75} spread={0.9} len={1600} o={0.1} /><Motes n={60} seed={6} y0={500} y1={1000} c="#fff0d0" o={0.5} /></Par>
    </Frame>
  );
};

/* 3.7 CU: the spear plunges, hand gripping hard */
const S3_7: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(1.2)">
    <Par d={0.1}><SkyRect id="p37" stops={[[0, '#5a9ac8'], [1, '#f0d8a8']]} h={640} /><rect y={640} width={W} height={440} fill="#b8a050" /><Mat kind="grass" o={0.55} light={0.3}><rect y={640} width={W} height={440} fill="#b8a050" /></Mat></Par>
    <Par d={1.2}>
      <g transform="translate(700 100) rotate(30)"><rect x={-9} y={0} width={18} height={820} fill="#8a5a2a" stroke="#2a1a10" strokeWidth={3} /><polygon points="-26,820 26,820 0,990" fill="#c8ccd0" stroke="#3a3a3a" strokeWidth={4} /><polygon points="0,820 26,820 0,990" fill="#8a9098" /></g>
      <g transform="translate(540 340) rotate(-60) scale(1.5)"><HandCU kind="grip" skin="#e0a880" sleeve="#e8e0d0" /></g>
      <g fill="#c8a860" opacity=".8" filter="url(#blS)">{Array.from({length: 22}, (_, i) => <circle key={i} cx={1180 + (i * 41) % 280} cy={820 + (i * 23) % 120} r={6 + (i % 5) * 3} />)}</g>
      <ellipse cx={1250} cy={900} rx={220} ry={40} fill="#6a5a2a" opacity=".6" filter="url(#blM)" />
    </Par>
    <Par d={1}><Motes n={70} seed={6} y0={500} y1={1000} c="#fff0d0" o={0.5} /></Par>
  </Frame>
);

/* 3.8 the veranda: bored in the afternoon */
const S3_8: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.0) hue-rotate(2deg)">
    <Par d={0.05}><SkyRect id="v38" stops={[[0, '#7aaad4'], [0.6, '#f0dcb0'], [1, '#ffe8b8']]} h={760} /><Clouds n={6} seed={8} y0={60} y1={380} c="#fff" o={0.5} /><Glow id="v38g" x={300} y={380} r={500} c="#fff2c8" o={0.8} /></Par>
    <Par d={0.2}><Tree x={240} y={800} h={420} seed={4} c1="#2e5a2a" c2="#7aaa4a" /><Tree x={1700} y={800} h={380} seed={7} c1="#2e5a2a" c2="#7aaa4a" /><Sil seed={73} base={760} amp={44} fill="#7a9a6a" o={0.6} /></Par>
    <Par d={0.6}>
      <rect x={0} y={0} width={W} height={220} fill="#e8dcc0" /><Mat kind="stone" o={0.4} light={0.25}><rect width={W} height={220} fill="#e8dcc0" /></Mat><rect y={200} width={W} height={26} fill="#a8946a" /><rect y={226} width={W} height={20} fill="url(#corniceSh)" />
      {[120, 560, 1000, 1440, 1840].map((x) => <g key={x}><rect x={x - 30} y={226} width={60} height={620} fill="#f0e8d0" /><rect x={x - 30} y={226} width={60} height={620} fill="url(#houseShade)" /><rect x={x - 42} y={226} width={84} height={26} fill="#d8cca8" /><rect x={x - 42} y={820} width={84} height={26} fill="#d8cca8" /></g>)}
      <rect x={0} y={760} width={W} height={20} fill="#c8b890" />{Array.from({length: 40}, (_, i) => <rect key={i} x={i * 50 + 10} y={780} width={14} height={90} fill="#c8b890" />)}
    </Par>
    <Par d={0.9}><rect y={846} width={W} height={H - 846} fill="#7a5a3a" /><rect y={846} width={W} height={H - 846} fill="url(#woodP)" opacity=".5" /><Mat kind="wood" o={0.5} light={0.2}><rect y={846} width={W} height={H - 846} fill="#7a5a3a" /></Mat><rect y={846} width={W} height={H - 846} fill="url(#aoV)" />{Array.from({length: 6}, (_, i) => <line key={i} x1={0} y1={870 + i * 40} x2={W} y2={870 + i * 40} stroke="#000" strokeOpacity=".22" strokeWidth={2} />)}</Par>
    <Par d={1}>
      <g transform="translate(1250 1000)"><rect x={-140} y={-110} width={280} height={14} fill="#6a4a2a" /><rect x={-120} y={-96} width={14} height={96} fill="#5a3a1a" /><rect x={106} y={-96} width={14} height={96} fill="#5a3a1a" /><ellipse cx={-30} cy={-130} rx={34} ry={20} fill="#f4efe6" stroke="#a8a090" strokeWidth={3} /><rect x={20} y={-160} width={56} height={44} fill="#e8e0c8" stroke="#8a7a5a" strokeWidth={3} /><rect x={74} y={-148} width={20} height={20} rx={9} fill="none" stroke="#8a7a5a" strokeWidth={4} /></g>
      <Fig id="v38" x={760} y={1010} s={0.6} o={{...young('right'), hero: true, head: 'none', outfit: 'blazer', pal: {...young('right').pal, top: '#e8e0d0', bottom: '#d8d0b8'}}} p={P(idlePose(0.7), arms.crossed, face.bored, {torso: 6, head: 8, handN: 'relaxed'})} />
      <g transform="translate(1520 1040)"><ellipse rx={90} ry={26} fill="#000" opacity=".3" filter="url(#blM)" /><path d="M-60 -30 Q-70 -70 -30 -76 Q40 -90 70 -50 Q80 -20 40 -12 L-40 -12 Z" fill="#8a6a42" stroke="#2a1a10" strokeWidth={4} /><path d="M60 -56 q40 -6 50 20 q-10 18 -44 14 Z" fill="#8a6a42" stroke="#2a1a10" strokeWidth={4} /><path d="M-60 -50 q-40 -10 -50 14" stroke="#8a6a42" strokeWidth={10} fill="none" strokeLinecap="round" /></g>
    </Par>
    <Par d={1.8} blur={10}><polygon points="0,0 0,300 220,0" fill="#4a6a3a" opacity=".85" /></Par>
    <Par d={1}><Rays id="v38r" x={300} y={380} ang={0.5} spread={0.9} len={1600} o={0.08} /><Motes n={50} seed={7} y0={300} y1={900} c="#fff0d0" o={0.4} /></Par>
  </Frame>
);

/* 3.9 CU: a pebble skips into the puddle */
const S3_9: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.05)">
    <Par d={0.1}><rect width={W} height={H} fill="#7a5a3a" /><rect width={W} height={H} fill="url(#woodP)" opacity=".4" /><Mat kind="wood" o={0.5} light={0.2}><rect width={W} height={H} fill="#7a5a3a" /></Mat></Par>
    <Par d={1}>
      <defs><radialGradient id="pd39" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#bcd4ea" stopOpacity=".95" /><stop offset="1" stopColor="#7a9ab8" stopOpacity=".7" /></radialGradient></defs>
      <ellipse cx={1200} cy={780} rx={560} ry={170} fill="#000" opacity=".4" filter="url(#blM)" /><ellipse cx={1200} cy={770} rx={540} ry={160} fill="url(#pd39)" />
      {[0.2, 0.4, 0.6, 0.8].map((k, i) => <ellipse key={i} cx={1200} cy={770} rx={540 * k} ry={160 * k} fill="none" stroke="#fff" strokeWidth={4} opacity={0.7 - i * 0.12} />)}
      <ellipse cx={1200} cy={770} rx={60} ry={18} fill="#fff" opacity=".5" />{Array.from({length: 16}, (_, i) => <circle key={i} cx={1200 + Math.cos(i) * (80 + (i % 5) * 20)} cy={740 - (i % 4) * 36} r={5 + (i % 3) * 3} fill="#e8f4ff" opacity=".8" />)}
      <g transform="translate(1200 420)"><ellipse rx={26} ry={18} fill="#5a5a5a" stroke="#2a2a2a" strokeWidth={3} /><ellipse cx={-6} cy={-5} rx={9} ry={5} fill="#fff" opacity=".35" /></g>
      <g transform="translate(700 330) rotate(-35) scale(1.5)"><HandCU kind="open" skin="#e0a880" sleeve="#e8e0d0" /></g>
      <g opacity=".4">{[0, 1, 2].map((i) => <path key={i} d={`M${1010 - i * 20} ${380 + i * 14} q80 20 150 40`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />)}</g>
    </Par>
    <Par d={1}><Motes n={50} seed={6} c="#fff0d0" o={0.4} /></Par>
  </Frame>
);

export const S2: Record<string, React.FC> = {
  '2.1': S2_1, '2.2': S2_2, '2.3': S2_3, '2.4': S2_4, '2.5': S2_5, '2.6': S2_6, '2.7': S2_7, '2.8': S2_8, '2.9': S2_9, '2.10': S2_10,
  '2.11': S2_11, '2.12': S2_12, '2.13': S2_13, '2.14': S2_14, '2.15': S2_15, '2.16': S2_16, '2.17': S2_17, '2.18': S2_18, '2.19': S2_19, '2.20': S2_20,
  '3.1': S3_1, '3.2': S3_2, '3.3': S3_3, '3.4': S3_4, '3.5': S3_5, '3.6': S3_6, '3.7': S3_7, '3.8': S3_8, '3.9': S3_9,
};
export {Ocean, Ship, Ref, Flag, desk, savannaBG, Rider, indiaSky};
