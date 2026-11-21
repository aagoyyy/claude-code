import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character, place} from '../rig/Character';
import {aimPose, deadPose, handsUpPose, idlePose, kneelAimPose, runPose, SideOpts, walkPose} from '../rig/Side';
import {H, mix, mulberry32, W} from '../world/util';
import {Rain, Embers, Smoke, Boom, Flash} from './fx';
import {clock} from '../rig/clock';
import {liveFront, arms, BackFig, Birds, Cast, civ, Clouds, Dirt, Fig, Fog, Frame, Glow, Grad, HandCU, khaki, Mat, Motes, Par, Rays, SkyRect, Sil, Title, face} from './lib';
import {P} from './S1';
import {doctor, nurse, Ref} from './S2';
import {german, heroTrench, medic, tommyW1} from '../scenes/YpresA';
import {heroOld} from '../scenes/HeroSide';

export const hTrench = (f: 'left' | 'right', extra: Partial<SideOpts> = {}): SideOpts => ({...heroTrench(f), patch: true, scars: true, head: 'cap', hat: '#6e6c4a', ...extra});
export const tw = (f: 'left' | 'right', skin = '#e0a880', gear: SideOpts['gear'] = 'rifle'): SideOpts => ({...tommyW1(f, skin), gear});
const rain = (n = 90, seed = 3, o = 0.3) => <Rain n={n} seed={seed} o={o} />;

/** a trench in section: revetment wall, sandbag parapet, duckboards, puddles, flares in a wet sky */
export const TrenchBG: React.FC<{dawn?: boolean; seed?: number}> = ({dawn, seed = 1}) => {
  const q = mulberry32(seed);
  return (
    <>
      <Par d={0.03}>
        <SkyRect id={`tr${seed}`} stops={dawn ? [[0, '#6a6a86'], [0.5, '#c8a0a0'], [1, '#f8d8b0']] : [[0, '#0e1a22'], [0.5, '#2a3e4a'], [1, '#6a7a78']]} h={420} />
        <Clouds n={7} seed={seed + 2} y0={20} y1={300} c={dawn ? '#ffd0c0' : '#6a7a88'} o={0.45} />
        {!dawn && <Glow id={`fl${seed}`} x={1300} y={160} r={520} c="#fff0b0" o={0.55} />}
        {dawn && <Glow id={`dw${seed}`} x={320} y={380} r={560} c="#ffe0b0" o={0.8} />}
      </Par>
      <Par d={0.3}>
        <rect x={0} y={90} width={W} height={720} fill="#4a3a2a" /><Mat kind="mud" o={0.7} light={0.2}><rect x={0} y={90} width={W} height={720} fill="#4a3a2a" /></Mat>
        {Array.from({length: 40}, (_, i) => <g key={i}><rect x={i * 50 + 4} y={200} width={42} height={620} fill={mix('#6a5030', '#000000', 0.1 + (i % 3) * 0.1)} stroke="#2a1e12" strokeWidth={2} /><path d={`M${i * 50 + 12} 220 V800`} stroke="#fff" strokeOpacity=".06" strokeWidth={3} /></g>)}
        {[260, 470, 680].map((y) => <rect key={y} x={0} y={y} width={W} height={14} fill="#2a1e12" opacity=".6" />)}
        <rect x={0} y={100} width={W} height={130} fill="#3a2e22" />{Array.from({length: 22}, (_, i) => <ellipse key={i} cx={i * 92 + 30} cy={150 + (i % 2) * 30} rx={52} ry={26} fill={mix('#6a5a3a', '#000000', 0.15 + (i % 4) * 0.08)} stroke="#2a1e12" strokeWidth={3} />)}
        <g stroke="#14100c" strokeWidth={3} fill="none">{[240, 700, 1200, 1660].map((x, i) => <g key={i}><line x1={x} y1={110} x2={x - 10} y2={20} strokeWidth={6} />{Array.from({length: 8}, (_, j) => <ellipse key={j} cx={x - 100 + j * 26} cy={50 + (j % 2) * 8} rx={14} ry={11} />)}</g>)}</g>
        <polygon points="0,780 W,780 0,0" fill="none" />
      </Par>
      <Par d={0.9}>
        <rect y={810} width={W} height={H - 810} fill="#3a2a1c" /><Mat kind="mud" o={0.7} light={0.2}><rect y={810} width={W} height={H - 810} fill="#3a2a1c" /></Mat>
        {Array.from({length: 18}, (_, i) => <g key={i}><rect x={i * 120 - 30} y={870} width={112} height={28} fill="#7a5a30" stroke="#2a1a0c" strokeWidth={3} /><path d={`M${i * 120 - 24} 880 H${i * 120 + 76}`} stroke="#000" strokeOpacity=".25" strokeWidth={2} /></g>)}
        <rect y={810} width={W} height={H - 810} fill="url(#aoV)" />
        {[[300, 1010, 220], [1100, 1040, 300], [1600, 990, 180]].map(([x, y, r], i) => <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 0.14} fill="#101a22" /><ellipse cx={x} cy={y} rx={r * 0.7} ry={r * 0.08} fill="#8aa4b8" opacity=".5" /></g>)}
      </Par>
    </>
  );
};

/* =============================== CHAPTER 6 : Ypres, 1915 =============================== */
const S6_1: React.FC = () => (
  <Frame night grade="contrast(1.12) saturate(.85) hue-rotate(-6deg)" over={<BackFig x={90} y={1290} s={0.78} hat="none" hair="#2a1c14" dark={0.3} />}>
    <TrenchBG seed={1} />
    <Par d={1}>
      {[360, 620, 880, 1140, 1400].map((x, i) => <Fig key={i} id={`t${i}`} x={x} y={1010 - (i % 2) * 6} s={0.54} o={tw('right', i % 2 ? '#c89870' : '#e0a880')} p={P(idlePose(i * 1.2), {head: i % 2 ? -4 : 3})} light="night" lit={0.5} />)}
      <Fig id="t5" x={1680} y={1015} s={0.54} o={tw('left')} p={P(idlePose(2.4), arms.hips, face.bored)} light="night" lit={0.5} />
    </Par>
    <Par d={1}>{rain(120, 5, 0.3)}<Motes n={40} seed={5} c="#cfe0ee" o={0.4} /></Par>
    <Par d={1.7} blur={10}><ellipse cx={80} cy={1050} rx={220} ry={90} fill="#05080c" /><ellipse cx={1860} cy={1040} rx={200} ry={80} fill="#05080c" /></Par>
  </Frame>
);
const S6_2: React.FC = () => (
  <Frame night grade="contrast(1.12) saturate(.85) hue-rotate(-6deg)">
    <TrenchBG seed={2} />
    <Par d={1}>
      <Fig id="q0" x={420} y={1020} s={0.66} o={tw('right', '#c89870')} p={P(idlePose(0.3), arms.crossed, face.bored)} light="night" lit={0.55} />
      <Fig id="q1" x={760} y={1030} s={0.66} o={tw('left')} p={P(idlePose(1.3), arms.explain, face.talk(3), face.smile)} light="night" lit={0.55} />
      <Fig id="q2" x={1120} y={1025} s={0.68} o={hTrench('right', {gear: 'rifle'})} p={P(idlePose(2.1), arms.hips, {smile: 0.35, head: -3})} light="night" lit={0.6} />
      <Fig id="q3" x={1480} y={1030} s={0.66} o={tw('left', '#c89870')} p={P(idlePose(0.9), arms.chin, face.bored)} light="night" lit={0.55} />
      <Fig id="q4" x={1760} y={1020} s={0.66} o={tw('left')} p={P(idlePose(1.8), {head: -18, uaN: -140, faN: -20, handN: 'open'}, face.wonder)} light="night" lit={0.55} />
    </Par>
    <Par d={1}>{rain(110, 6, 0.28)}</Par>
  </Frame>
);
const S6_3: React.FC = () => (
  <Frame night grade="contrast(1.14) saturate(.8)">
    <Par d={0.1}><SkyRect id="b63" stops={[[0, '#141e26'], [1, '#4a4034']]} /></Par>
    <Par d={0.9}>
      <rect y={500} width={W} height={H - 500} fill="#3a2a1c" /><Mat kind="mud" o={0.8} light={0.25}><rect y={500} width={W} height={H - 500} fill="#3a2a1c" /></Mat>
      {[[420, 880, 300], [1300, 960, 360], [860, 1030, 240]].map(([x, y, r], i) => <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 0.16} fill="#101a22" /><ellipse cx={x} cy={y} rx={r * 0.72} ry={r * 0.09} fill="#a8c0d4" opacity=".55" />{[0.3, 0.55].map((k, j) => <ellipse key={j} cx={x} cy={y} rx={r * k} ry={r * k * 0.14} fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth={2} />)}</g>)}
      {Array.from({length: 30}, (_, i) => <circle key={i} cx={500 + (i * 53) % 900} cy={760 + (i * 37) % 260} r={3 + (i % 5) * 2} fill="#6a5238" />)}
    </Par>
    <Par d={1.1}><Fig id="b63" x={900} y={1010} s={2.4} o={tw('right')} p={walkPose(1.9, 1.0)} light="night" lit={0.6} /></Par>
    <Par d={1}>{rain(90, 7, 0.4)}</Par>
  </Frame>
);
/* A-shots from the finished battle (hi-res frames) */
const S6_4: React.FC = () => <Ref src="g1000h" z={1.0} cx={900} cy={540} tint="#9ab0b8" />;
const S6_5: React.FC = () => <Ref src="g1030h" z={1.25} cx={1100} cy={500} tint="#9ab0b8" />;
const S6_6: React.FC = () => <Ref src="g1064h" z={1.0} cx={900} cy={540} tint="#9ab0b8" />;
const S6_7: React.FC = () => <Ref src="g1160h" z={1.5} cx={960} cy={540} tint="#9ab0b8" />;
const S6_8: React.FC = () => <Ref src="g1160h" z={3.2} cx={900} cy={620} tint="#9ab0b8" />;

const S6_9: React.FC = () => (
  <Frame night grade="contrast(1.08) saturate(.95) hue-rotate(6deg)">
    <Par d={0.1}>
      <rect width={W} height={H} fill="#5a4e36" /><Mat kind="cloth" o={0.5} light={0.3}><rect width={W} height={H} fill="#5a4e36" /></Mat>
      {Array.from({length: 12}, (_, i) => <path key={i} d={`M${i * 170 - 40} 0 Q${i * 170 + 40} 400 ${i * 170 - 20} 900`} stroke="#000" strokeOpacity=".18" strokeWidth={10} fill="none" />)}
      <rect y={0} width={W} height={90} fill="#3a3224" />
      {[420, 960, 1500].map((x, i) => <g key={i}><line x1={x} y1={90} x2={x} y2={210} stroke="#14100c" strokeWidth={4} /><rect x={x - 22} y={210} width={44} height={70} rx={8} fill="#ffe0a0" stroke="#14100c" strokeWidth={4} /><Glow id={`hl${i}`} x={x} y={250} r={400} c="#ffc070" o={0.55} /></g>)}
    </Par>
    <Par d={0.9}><rect y={800} width={W} height={H - 800} fill="#3a3020" /><rect y={800} width={W} height={H - 800} fill="url(#aoV)" />
      {[260, 1180].map((x, i) => <g key={i}><rect x={x} y={760} width={420} height={36} fill="#8a8a70" stroke="#2a2a20" strokeWidth={3} /><rect x={x} y={796} width={420} height={14} fill="#000" opacity=".3" /><rect x={x + 10} y={810} width={14} height={80} fill="#3a3a30" /><rect x={x + 396} y={810} width={14} height={80} fill="#3a3a30" /></g>)}
    </Par>
    <Par d={1}>
      <Fig id="p1" x={470} y={760} s={0.5} o={tw('right', '#c89870', 'none')} p={P(idlePose(0.2), {fall: -0.99, head: 14}, face.angry)} lo />
      <Fig id="dr" x={1000} y={1040} s={0.62} o={doctor('left')} p={P(idlePose(0.7), {uaN: -70, faN: -60, handN: 'open'}, {brow: 0.8, wide: 0.5, mouth: 0.15})} light="indoor" lit={0.8} />
      <Fig id="nu" x={1620} y={1050} s={0.6} o={nurse('left')} p={P(idlePose(1.6), arms.press, face.surprise)} light="indoor" lit={0.8} />
      <Fig id="ad" x={680} y={1040} s={0.64} o={hTrench('right', {stump: true, bandages: true, gear: 'none'})} p={P(idlePose(1.1), {uaN: -62, faN: -88, handN: 'relaxed'}, {grimace: 0.8, squint: 0.6, mouth: 0.1, head: 4})} light="indoor" lit={0.9} />
    </Par>
    <Par d={1}><Motes n={50} seed={4} c="#ffd8a0" o={0.5} r={3} /></Par>
  </Frame>
);
const S6_10: React.FC = () => (
  <Frame night grade="contrast(1.1) saturate(.95)">
    <Par d={0.1}><defs><radialGradient id="h610" cx=".5" cy=".4" r=".85"><stop offset="0" stopColor="#d8b080" /><stop offset=".6" stopColor="#5a4430" /><stop offset="1" stopColor="#120c08" /></radialGradient></defs><rect width={W} height={H} fill="url(#h610)" /></Par>
    <Par d={1.1}>
      <Fig id="dc610" x={560} y={2480} s={1.72} o={doctor('right')} p={P(idlePose(0.4), {brow: 0.9, squint: 0.2, mouth: 0.04, head: 6, sweat: 1})} light="indoor" lit={0.85} />
      <g fill="#bfe0ff" opacity=".85"><path d="M780 400 q-10 26 0 40 q12 -14 0 -40 Z" /></g>
      <g transform="translate(1180 760) rotate(-30)"><rect x={-8} y={-260} width={16} height={260} fill="#8a8a90" /><polygon points="-8,0 8,0 22,120 -8,90" fill="#cfd2d8" /><rect x={-18} y={-300} width={36} height={60} rx={8} fill="#3a2a1c" /></g>
      <g transform="translate(1540 720) rotate(150) scale(1.5)"><HandCU kind="relaxed" skin="#e0a880" sleeve="#6e6c4a" id="h610" /></g>
    </Par>
  </Frame>
);
const S6_11: React.FC = () => (
  <Frame night grade="contrast(1.1) saturate(.95)">
    <Par d={0.1}><defs><radialGradient id="h611" cx=".5" cy=".4" r=".85"><stop offset="0" stopColor="#d8b080" /><stop offset=".6" stopColor="#5a4430" /><stop offset="1" stopColor="#120c08" /></radialGradient></defs><rect width={W} height={H} fill="url(#h611)" /><Glow id="g611" x={960} y={500} r={700} c="#ffb060" o={0.3} /></Par>
    <Par d={1.1}>
      <Fig id="ad611" x={760} y={2480} s={1.7} o={hTrench('right', {stump: true, bandages: true, gear: 'none', head: 'none'})} p={P(idlePose(0.6), {grimace: 0.85, squint: 0.7, smile: 0.35, mouth: 0.1, head: 7, uaN: -66, faN: -90, handN: 'relaxed'})} light="indoor" lit={0.9} />
      <Fig id="dr611" x={1500} y={2490} s={1.7} o={doctor('left')} p={P(idlePose(1.2), face.surprise, {head: -8, uaN: -40, faN: -70, handN: 'open'})} light="indoor" lit={0.85} />
    </Par>
  </Frame>
);
export const CUFront: React.FC<{pose?: any; variant?: any; zoom?: number; py?: number; c1?: string; c2?: string; label?: React.ReactNode; fx?: React.ReactNode; grade?: string; night?: boolean}> = ({pose = {}, variant = {patch: true, scars: true}, zoom = 4.3, py = 330, c1 = '#d89060', c2 = '#2a1a14', label, fx, grade = 'contrast(1.12) saturate(.95)', night = true}) => (
  <Frame night={night} grade={grade} over={<Character pose={liveFront({head: 0, blink: 1, ...pose})} variant={variant} cam={{x: 0, y: 0, zoom, px: 797, py}} light={{key: '#ffd9a0', rim: '#ffcf98'}} />}>
    <defs><radialGradient id="cuf" cx=".5" cy=".45" r=".8"><stop offset="0" stopColor={c1} /><stop offset=".6" stopColor={mix(c1, c2, 0.7)} /><stop offset="1" stopColor={c2} /></radialGradient></defs>
    <rect width={W} height={H} fill="url(#cuf)" />
    <g filter="url(#blL)" opacity=".5">{Array.from({length: 14}, (_, i) => <circle key={i} cx={(i * 337) % W} cy={(i * 211) % H} r={40 + (i % 4) * 30} fill={['#ffc080', '#8aa4c8', '#a0607a'][i % 3]} opacity={0.3} />)}</g>
    {fx}
    <Motes n={70} seed={11} c="#ffd8a0" o={0.5} r={3} />
    {label}
  </Frame>
);
const S6_12: React.FC = () => <CUFront pose={{yaw: 8, mouth: 0.04}} variant={{patch: true, scars: true, young: true, stump: true, bandages: true}} c1="#c89060" c2="#1a1410" fx={<g fill="#bfe0ff" opacity=".8"><path d="M900 300 q-8 24 0 38 q10 -14 0 -38 Z" /><path d="M1050 420 q-6 20 0 30 q8 -10 0 -30 Z" /></g>} />;
const S6_13: React.FC = () => (
  <Frame night grade="contrast(1.1) saturate(.85) hue-rotate(-4deg)">
    <TrenchBG seed={13} dawn />
    <Par d={1}>
      <Fig id="a613" x={900} y={1030} s={0.72} o={hTrench('right', {stump: true, bandages: true, gear: 'none'})} p={P(walkPose(1.1, 0.7), {uaN: -50, faN: -84, handN: 'relaxed', head: 2}, {squint: 0.35, brow: -0.2})} light="night" lit={0.7} />
      <Fig id="m613" x={1380} y={1020} s={0.6} o={tw('left')} p={P(idlePose(0.9), {uaN: -146, faN: -134, handN: 'open'}, face.surprise)} light="night" lit={0.5} />
      <Fig id="n613" x={420} y={1040} s={0.6} o={tw('right', '#c89870')} p={P(idlePose(1.9), arms.hips, face.smile)} light="night" lit={0.5} />
    </Par>
    <Par d={1}>{rain(70, 9, 0.2)}</Par>
  </Frame>
);
const S6_14: React.FC = () => (
  <Frame night grade="contrast(1.12) saturate(.85) hue-rotate(-6deg)">
    <TrenchBG seed={14} />
    <Par d={1}>
      <Fig id="a614" x={1040} y={1030} s={0.72} o={hTrench('right', {stump: true, bandages: true, gear: 'rifle'})} p={P(walkPose(0.6, 0.9), {smile: 0.25, squint: 0.3})} light="night" lit={0.7} />
      {[420, 640, 1380, 1620].map((x, i) => <Fig key={i} id={`s614${i}`} x={x} y={1020 + (i % 2) * 8} s={0.58} o={tw(i < 2 ? 'right' : 'left', i % 2 ? '#c89870' : '#e0a880')} p={P(idlePose(i * 1.4), arms.wave, face.smile)} light="night" lit={0.5} />)}
    </Par>
    <Par d={1}>{rain(90, 10, 0.25)}</Par>
  </Frame>
);

/* =============================== CHAPTER 7 : eight wounds =============================== */
const wounds: {t: string; at: [number, number]; r: number}[] = [
  {t: 'KEPALA', at: [500, 640], r: 120}, {t: 'PERUT', at: [505, 1000], r: 120}, {t: 'PINGGUL', at: [580, 1100], r: 110}, {t: 'KAKI', at: [610, 1380], r: 110},
  {t: 'PERGELANGAN', at: [610, 1590], r: 90}, {t: 'TELINGA', at: [420, 672], r: 70}, {t: 'MATA', at: [545, 612], r: 60}, {t: 'TANGAN', at: [335, 1085], r: 100},
];
const S7: React.FC<{k: number}> = ({k}) => {
  const w = wounds[k] ?? wounds[0];
  const [sx, sy] = place(w.at[0], w.at[1]);
  const OFF = 160;
  return (
    <Frame night grade="contrast(1.12) saturate(.9)" over={
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, filter: 'brightness(.1) contrast(1.4)'}}><Character pose={{blink: 1}} variant={{patch: true, scars: true, stump: true, bandages: true}} cam={{x: -OFF, y: 0, zoom: 1.35, px: 960, py: 935}} lit={0.1} /></div>}>
      <defs><radialGradient id="b7" cx=".5" cy=".5" r=".75"><stop offset="0" stopColor="#3a2418" /><stop offset=".6" stopColor="#140c08" /><stop offset="1" stopColor="#050302" /></radialGradient></defs>
      <rect width={W} height={H} fill="url(#b7)" />
      <Rays id="b7r" x={960} y={-60} ang={1.57} spread={0.5} len={1300} n={6} o={0.07} />
      {Array.from({length: 8}, (_, i) => { const [x, y] = place(wounds[i].at[0], wounds[i].at[1]); const X = (x + OFF - 960) * 1.35 + 960, Y = (y - 935) * 1.35 + 935; return i <= k ? <g key={i} opacity={i === k ? 1 : 0.55}><Glow id={`wg${i}`} x={X} y={Y} r={wounds[i].r * 1.35 * (1 + 0.12 * Math.sin(clock.t * 4 + i))} c="#e0301a" o={0.9} /><circle cx={X} cy={Y} r={14 + 3 * Math.sin(clock.t * 5)} fill="#ff6a4a" /></g> : null; })}
      {(() => { const X = (sx + OFF - 960) * 1.35 + 960, Y = (sy - 935) * 1.35 + 935; return <g><circle cx={X} cy={Y} r={wounds[k].r * 0.8 * (1 + 0.1 * Math.sin(clock.t * 4))} fill="none" stroke="#ff6a4a" strokeWidth={4} opacity=".9" /><line x1={X + wounds[k].r * 0.8} y1={Y} x2={X + 340} y2={Y - 60} stroke="#ff6a4a" strokeWidth={3} /></g>; })()}
      <Title x={1480} y={290} text={`LUKA ${k + 1} / 8`} size={34} c="#ff8a6a" ls={8} />
      <Title x={1480} y={350} text={w.t} size={52} c="#f6e8c8" ls={6} />
      <Title x={1480} y={396} text="menurut memoarnya" size={26} c="#c8b898" ls={3} weight={400} serif italic />
    </Frame>
  );
};

/* =============================== CHAPTER 8 : the Somme, 1916 =============================== */
const S8_1: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(.9) hue-rotate(6deg)" over={<BackFig x={1850} y={1290} s={0.78} hat="none" hair="#2a1c14" dark={0.34} />}>
    <TrenchBG seed={21} dawn />
    <Par d={0.4}><Fog id="s81f" y={140} h={260} c="#ffd8c8" o={0.5} /></Par>
    <Par d={1}>
      {Array.from({length: 9}, (_, i) => <Fig key={i} id={`s81${i}`} x={240 + i * 190} y={1010 + (i % 2) * 8} s={0.54} o={{...tw(i === 5 ? 'right' : 'right'), bayonet: true}} p={P(idlePose(i * 0.8), {head: -4}, i % 3 === 0 ? face.bored : {})} light="indoor" lit={0.7} />)}
      <Fig id="sofc" x={1900} y={1010} s={0.58} o={{...tw('left', '#e0a880', 'none'), mustache: true}} p={P(idlePose(1.1), {uaN: -80, faN: -90, handN: 'open'}, {squint: 0.4})} light="indoor" lit={0.7} />
    </Par>
    <Par d={1}><Rays id="s81r" x={320} y={380} ang={0.55} spread={1.1} len={1500} o={0.1} /><Motes n={50} seed={5} c="#ffe8d8" o={0.5} /></Par>
  </Frame>
);
const S8_2: React.FC = () => (
  <Frame night grade="contrast(1.1) saturate(.9)">
    <Par d={0.1}><defs><radialGradient id="w82" cx=".5" cy=".45" r=".8"><stop offset="0" stopColor="#c8a888" /><stop offset=".6" stopColor="#4a3a2c" /><stop offset="1" stopColor="#0e0a08" /></radialGradient></defs><rect width={W} height={H} fill="url(#w82)" /></Par>
    <Par d={1.1}>
      <g transform="translate(960 160) rotate(180) scale(1.7)"><HandCU kind="relaxed" skin="#e0a880" sleeve="#6e6c4a" id="w82h" /></g>
      <g transform="translate(960 640)"><circle r={92} fill="#14100c" stroke="#8a7a5a" strokeWidth={14} /><circle r={78} fill="#ece6d6" stroke="#3a2a1a" strokeWidth={3} />{Array.from({length: 12}, (_, i) => <line key={i} x1={Math.sin((i * Math.PI) / 6) * 66} y1={-Math.cos((i * Math.PI) / 6) * 66} x2={Math.sin((i * Math.PI) / 6) * 74} y2={-Math.cos((i * Math.PI) / 6) * 74} stroke="#14100c" strokeWidth={4} />)}<line x1={0} y1={0} x2={-40} y2={-40} stroke="#14100c" strokeWidth={6} strokeLinecap="round" /><line x1={0} y1={0} x2={10} y2={-62} stroke="#14100c" strokeWidth={4} strokeLinecap="round" /><circle r={7} fill="#14100c" /><path d="M-60 -46 Q-20 -76 30 -66" stroke="#fff" strokeWidth={6} fill="none" opacity=".5" /></g>
    </Par>
    <Par d={1}><Motes n={50} seed={4} c="#ffd8a0" o={0.5} r={3} /></Par>
  </Frame>
);
const S8_3: React.FC = () => (
  <Frame night grade="contrast(1.1) saturate(.9)">
    <Par d={0.1}><defs><radialGradient id="w83" cx=".5" cy=".4" r=".85"><stop offset="0" stopColor="#c8a888" /><stop offset=".6" stopColor="#4a3a2c" /><stop offset="1" stopColor="#0e0a08" /></radialGradient></defs><rect width={W} height={H} fill="url(#w83)" /></Par>
    <Par d={1.1}>
      <Fig id="w83" x={780} y={2480} s={1.75} o={tw('right', '#e0a880', 'none')} p={P(idlePose(0.5), {squint: 0.25, brow: 0.7, wide: 0.4, mouth: 0.04, head: 2})} light="warm" lit={0.8} />
      <g fill="#bfe0ff" opacity=".85"><path d="M900 380 q-10 26 0 40 q12 -14 0 -40 Z" /><path d="M740 300 q-8 20 0 32 q10 -10 0 -32 Z" /></g>
    </Par>
    <Par d={1}><Motes n={60} seed={4} c="#ffd8a0" o={0.5} r={3} /></Par>
  </Frame>
);
const S8_4: React.FC = () => (
  <Frame night grade="contrast(1.1) saturate(.9)">
    <Par d={0.1}><defs><radialGradient id="w84" cx=".5" cy=".4" r=".85"><stop offset="0" stopColor="#d8b898" /><stop offset=".6" stopColor="#5a4a3c" /><stop offset="1" stopColor="#100c0a" /></radialGradient></defs><rect width={W} height={H} fill="url(#w84)" /></Par>
    <Par d={1.1}>
      <Fig id="w84" x={720} y={2490} s={1.75} o={{...tw('right', '#e0a880', 'none'), mustache: true, head: 'brodie', hat: '#6e6c4a'}} p={P(idlePose(0.5), {uaN: -140, faN: -122, handN: 'fist', squint: 0.7, brow: -0.3, mouth: 0.18, head: -2})} light="warm" lit={0.85} />
      <g transform="translate(930 520)"><rect x={0} y={-10} width={70} height={22} rx={10} fill="#c8a040" stroke="#5a4a14" strokeWidth={3} /><circle cx={78} cy={0} r={22} fill="#c8a040" stroke="#5a4a14" strokeWidth={3} /><circle cx={78} cy={0} r={8} fill="#14100c" /></g>
      <g filter="url(#blM)">{[0, 1, 2].map((i) => <ellipse key={i} cx={1100 + i * 160} cy={500 - i * 30} rx={130 + i * 30} ry={80 + i * 18} fill="#fff" opacity={0.8 - i * 0.2} />)}</g>
    </Par>
  </Frame>
);
const S8_5: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(.9) hue-rotate(4deg)">
    <Par d={0.03}><SkyRect id="w85" stops={[[0, '#6a6a8a'], [0.5, '#d0a0a0'], [1, '#f8d8b0']]} h={700} /><Clouds n={8} seed={4} y0={60} y1={420} c="#ffd0c0" o={0.5} /><Glow id="w85g" x={300} y={560} r={600} c="#ffe0b0" o={0.8} /></Par>
    <Par d={0.3}><Sil seed={91} base={700} amp={50} fill="#6a5a5a" o={0.8} /><Fog id="w85f" y={560} h={240} c="#ffd8c8" o={0.5} />
      {[1100, 1300, 1560].map((x, i) => <g key={i}><ellipse cx={x} cy={720} rx={60 + i * 20} ry={22} fill="#2a2018" /><circle cx={x} cy={640 - i * 30} r={26} fill="#5a4a3a" /></g>)}
      <g filter="url(#blL)">{[900, 1500].map((x, i) => <ellipse key={i} cx={x} cy={640} rx={140} ry={160} fill="#3a2e28" opacity=".7" />)}</g>
    </Par>
    <Par d={0.9}><rect y={720} width={W} height={H - 720} fill="#5a4a38" /><Mat kind="mud" o={0.75} light={0.25}><rect y={720} width={W} height={H - 720} fill="#5a4a38" /></Mat><rect y={720} width={W} height={H - 720} fill="url(#aoV)" /></Par>
    <Par d={1}>
      {[0, 1, 2, 3, 4].map((i) => <g key={i}><rect x={i * 340 + 40} y={700} width={22} height={150} fill="#7a5a30" stroke="#2a1a0c" strokeWidth={3} /><path d={`M${i * 340 + 40} ${730 + i * 4} H${i * 340 + 100}`} stroke="#7a5a30" strokeWidth={5} />{Array.from({length: 4}, (_, j) => <rect key={j} x={i * 340 + 40} y={730 + j * 30} width={70} height={7} fill="#7a5a30" />)}</g>)}
      {[200, 540, 880, 1220, 1560].map((x, i) => <Fig key={i} id={`o85${i}`} x={x} y={880 + (i % 2) * 40} s={0.5} o={{...tw('right'), bayonet: true}} p={P(runPose(i * 1.7), {head: -4}, i % 2 ? face.angry : face.smile)} light="indoor" lit={0.7} />)}
      {[300, 700, 1100, 1400].map((x, i) => <ellipse key={i} cx={x} cy={650 + (i % 2) * 40} rx={50} ry={90} fill="#2a2018" opacity=".7" filter="url(#blM)" />)}
    </Par>
    <Par d={1}><Rays id="w85r" x={300} y={560} ang={0.45} spread={1.0} len={1500} o={0.1} /><Motes n={60} seed={5} y0={300} y1={1000} c="#ffd8c0" o={0.5} /></Par>
  </Frame>
);
const S8_6: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(.9) hue-rotate(4deg)">
    <Par d={0.03}><SkyRect id="w86" stops={[[0, '#5a5a7a'], [0.6, '#c89090'], [1, '#f0d0a8']]} h={700} /><Glow id="w86g" x={300} y={560} r={560} c="#ffe0b0" o={0.7} /></Par>
    <Par d={0.25}><Fog id="w86f" y={520} h={260} c="#ffd0c0" o={0.45} /><g fill="#2a1c1c" opacity=".8">{[1100, 1400, 1650].map((x, i) => <ellipse key={i} cx={x} cy={690} rx={20} ry={90 - i * 20} />)}</g></Par>
    <Par d={0.9}><rect y={700} width={W} height={H - 700} fill="#5a4a38" /><Mat kind="mud" o={0.75} light={0.25}><rect y={700} width={W} height={H - 700} fill="#5a4a38" /></Mat><rect y={700} width={W} height={H - 700} fill="url(#aoV)" />
      {[[500, 900, 200], [1300, 960, 260]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.13} fill="#14100c" />)}</Par>
    <Par d={1}>
      {[300, 620, 940, 1260].map((x, i) => <Fig key={i} id={`r86${i}`} x={x} y={990 + (i % 2) * 20} s={0.62} o={{...tw('right'), bayonet: true}} p={P(runPose(i * 1.3), {head: -6}, face.angry, face.talk(i * 2))} light="indoor" lit={0.8} />)}
      <Fig id="a86" x={1620} y={1000} s={0.66} o={hTrench('right', {stump: true, bandages: true, gear: 'none'})} p={P(runPose(0.4), arms.point, face.angry, face.talk(3), {uaN: -80})} light="indoor" lit={0.85} />
      <g fill="#a08a60" opacity=".6" filter="url(#blS)">{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={260 + i * 320} cy={1050} rx={90} ry={16} />)}</g>
    </Par>
    <Par d={1.5} blur={8}>{rain(40, 3, 0.15)}</Par>
  </Frame>
);
const S8_7: React.FC = () => (
  <Frame night grade="contrast(1.14) saturate(.9)">
    <Par d={0.1}><SkyRect id="w87" stops={[[0, '#20242c'], [1, '#4a4038']]} /></Par>
    <Par d={0.9}><rect y={760} width={W} height={H - 760} fill="#3a2c20" /><Mat kind="mud" o={0.8} light={0.2}><rect y={760} width={W} height={H - 760} fill="#3a2c20" /></Mat></Par>
    <Par d={1.1}>
      <Fig id="g87" x={1300} y={1900} s={1.45} o={german('left')} p={P(aimPose(0.2), {squint: 0.8, brow: -0.5, mouth: 0.2})} light="night" lit={0.55} />
      <Flash x={700} y={560} r={190} seed={8} rate={9} angle={180} />
      {Array.from({length: 12}, (_, i) => <line key={i} x1={680 - i * 90} y1={560 + (i % 3) * 20 - 20} x2={380 - i * 90} y2={600 + (i % 4) * 30 - 40} stroke="#ffdc80" strokeWidth={4} opacity={0.8 - i * 0.05} />)}
    </Par>
    <Par d={1}>{rain(70, 4, 0.3)}<Motes n={50} seed={7} c="#ffb060" o={0.7} r={2.4} /></Par>
  </Frame>
);
const S8_8: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(.85) hue-rotate(2deg)">
    <Par d={0.03}><SkyRect id="w88" stops={[[0, '#5a5a6a'], [0.6, '#b89090'], [1, '#e8c8a0']]} h={720} /><g filter="url(#blL)">{[300, 800, 1400].map((x, i) => <ellipse key={i} cx={x} cy={300 - i * 20} rx={300} ry={110} fill="#4a4048" opacity=".6" />)}</g></Par>
    <Par d={0.5}>
      {[[120, 780, 280, 360], [700, 780, 240, 260], [1260, 780, 360, 420], [1700, 780, 240, 300]].map(([x, y, w, h], i) => <g key={i}><polygon points={`${x},${y} ${x},${y - h} ${x + w * 0.4},${y - h - 40} ${x + w * 0.6},${y - h + 30} ${x + w},${y - h * 0.7} ${x + w},${y}`} fill={mix('#8a7a68', '#000000', 0.1 * i)} stroke="#2a2018" strokeWidth={4} /><polygon points={`${x},${y} ${x},${y - h} ${x + w * 0.4},${y - h - 40} ${x + w * 0.6},${y - h + 30} ${x + w},${y - h * 0.7} ${x + w},${y}`} fill="url(#blockP)" opacity=".5" /><Dirt o={0.6} light={0.2}><rect x={x} y={y - h - 40} width={w} height={h + 40} fill="#000" /></Dirt>{[0.25, 0.65].map((k, j) => <path key={j} d={`M${x + w * k} ${y - h * 0.2} V${y - h * 0.55} Q${x + w * (k + 0.07)} ${y - h * 0.7} ${x + w * (k + 0.14)} ${y - h * 0.55} V${y - h * 0.2} Z`} fill="#1a1410" />)}</g>)}
      <g filter="url(#blL)">{[420, 1060, 1580].map((x, i) => <ellipse key={i} cx={x} cy={500 - i * 40} rx={90} ry={200} fill="#3a3238" opacity=".7" />)}</g>
    </Par>
    <Par d={0.9}><rect y={780} width={W} height={H - 780} fill="#6a5a46" /><Mat kind="mud" o={0.75} light={0.25}><rect y={780} width={W} height={H - 780} fill="#6a5a46" /></Mat><rect y={780} width={W} height={H - 780} fill="url(#aoV)" />{Array.from({length: 24}, (_, i) => <rect key={i} x={(i * 211) % W} y={800 + (i * 53) % 220} width={30 + (i % 4) * 20} height={14} fill="#4a3c2c" transform={`rotate(${i * 17} ${(i * 211) % W} 820)`} />)}</Par>
    <Par d={1}>
      {[260, 560, 900, 1420].map((x, i) => <Fig key={i} id={`v88${i}`} x={x} y={1000 + (i % 2) * 14} s={0.58} o={{...tw('right'), bayonet: true}} p={P(walkPose(i * 1.4, 0.9), {head: -4}, face.bored)} light="indoor" lit={0.7} />)}
      <Fig id="v88f" x={1180} y={1060} s={0.42} o={tw('right', '#c89870', 'none')} p={P(idlePose(0.2), {fall: -0.99, head: 12})} lo />
    </Par>
    <Par d={1}>{rain(40, 3, 0.15)}<Motes n={50} seed={8} c="#cfc0b0" o={0.5} r={3} /></Par>
  </Frame>
);
const S8_9: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(.9)">
    <Par d={0.03}><SkyRect id="w89" stops={[[0, '#5a5a6a'], [0.6, '#b89090'], [1, '#e8c8a0']]} h={720} /></Par>
    <Par d={0.9}><rect y={720} width={W} height={H - 720} fill="#6a5a46" /><Mat kind="mud" o={0.75} light={0.25}><rect y={720} width={W} height={H - 720} fill="#6a5a46" /></Mat><rect y={720} width={W} height={H - 720} fill="url(#aoV)" /></Par>
    <Par d={1}>
      <Fig id="of89" x={900} y={1000} s={0.68} o={{...tw('right', '#e0a880', 'none'), mustache: true, hero: false}} p={P(idlePose(0.5), {fall: 0.55, head: 22, uaN: -120, faN: -30, handN: 'open'}, face.surprise)} light="indoor" lit={0.8} />
      <Fig id="m89a" x={560} y={1030} s={0.64} o={tw('right')} p={P(idlePose(1.2), arms.explain, face.surprise)} light="indoor" lit={0.8} />
      <Fig id="m89b" x={1420} y={1040} s={0.64} o={tw('left', '#c89870')} p={P(idlePose(2.2), arms.press, face.surprise)} light="indoor" lit={0.8} />
      <g fill="#c4281c"><circle cx={880} cy={800} r={9} /><circle cx={910} cy={840} r={6} /></g>
    </Par>
    <Par d={1}>{rain(40, 3, 0.12)}<Motes n={50} seed={8} c="#cfc0b0" o={0.5} r={3} /></Par>
  </Frame>
);
const S8_10: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(.9) hue-rotate(2deg)">
    <Par d={0.03}><SkyRect id="w810" stops={[[0, '#5a5a6a'], [0.6, '#c89888'], [1, '#f0d0a8']]} h={720} /><Glow id="w810g" x={300} y={560} r={560} c="#ffe0b0" o={0.7} /><g filter="url(#blL)">{[600, 1300].map((x, i) => <ellipse key={i} cx={x} cy={300} rx={260} ry={100} fill="#4a4048" opacity=".5" />)}</g></Par>
    <Par d={0.5}><polygon points="900,780 1060,660 1280,700 1480,640 1700,780" fill="#6a5a50" stroke="#2a2018" strokeWidth={4} /><Mat kind="stone" o={0.5} light={0.2}><polygon points="900,780 1060,660 1280,700 1480,640 1700,780" fill="#6a5a50" /></Mat></Par>
    <Par d={0.9}><rect y={780} width={W} height={H - 780} fill="#6a5a46" /><Mat kind="mud" o={0.75} light={0.25}><rect y={780} width={W} height={H - 780} fill="#6a5a46" /></Mat><rect y={780} width={W} height={H - 780} fill="url(#aoV)" /></Par>
    <Par d={1}>
      <Fig id="a810" x={760} y={1020} s={0.72} o={hTrench('right', {stump: true, bandages: false, gear: 'none', head: 'cap'})} p={P(idlePose(0.6), {uaN: -88, faN: -6, handN: 'open', uaF: -150, faF: -20, handF: 'open', torso: -6}, face.angry, face.talk(5))} light="indoor" lit={0.9} />
      {[300, 480, 1120, 1330, 1560].map((x, i) => <Fig key={i} id={`g810${i}`} x={x} y={1030 + (i % 2) * 10} s={0.6} o={{...tw(i < 2 ? 'right' : 'left'), bayonet: true}} p={P(idlePose(i * 1.3), {uaN: -120, faN: -24, handN: 'open'}, face.surprise)} light="indoor" lit={0.8} />)}
    </Par>
    <Par d={1}><Rays id="w810r" x={300} y={560} ang={0.5} spread={1.0} len={1500} o={0.1} /><Motes n={50} seed={5} c="#ffd8c0" o={0.5} /></Par>
  </Frame>
);
const S8_11: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(.9)">
    <Par d={0.03}><SkyRect id="w811" stops={[[0, '#5a5a6a'], [0.6, '#c89888'], [1, '#f0d0a8']]} h={720} /></Par>
    <Par d={0.9}><rect y={760} width={W} height={H - 760} fill="#6a5a46" /><Mat kind="mud" o={0.75} light={0.25}><rect y={760} width={W} height={H - 760} fill="#6a5a46" /></Mat><rect y={760} width={W} height={H - 760} fill="url(#aoV)" /></Par>
    <Par d={1}>
      <Fig id="a811" x={820} y={1020} s={0.8} o={hTrench('right', {stump: true, bandages: false, gear: 'none', head: 'cap'})} p={P(idlePose(0.6), {uaN: -172, faN: -40, handN: 'fist', uaF: -30, faF: -80, handF: 'relaxed', torso: -9, head: 6}, face.angry, {mouth: 0.4})} light="indoor" lit={0.9} />
      <g transform="translate(900 120)"><ellipse rx={20} ry={26} fill="#2a2a2a" stroke="#000" strokeWidth={3} /><rect x={-5} y={-36} width={10} height={14} fill="#6a6a6a" /></g>
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${940 + i * 30} ${140 + i * 20} q80 -30 200 -10`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.45 - i * 0.1} strokeLinecap="round" />)}
      {[1300, 1560].map((x, i) => <Fig key={i} id={`gg${i}`} x={x} y={1030} s={0.6} o={german('left')} p={P(idlePose(i * 1.3), {uaN: -130, faN: -40, handN: 'open'}, face.surprise)} light="indoor" lit={0.7} />)}
    </Par>
    <Par d={1}><Motes n={50} seed={5} c="#ffd8c0" o={0.5} /></Par>
  </Frame>
);
const S8_12: React.FC = () => {
  const q = mulberry32(12);
  return (
    <Frame grade="contrast(1.1) saturate(.9) hue-rotate(4deg)">
      <Par d={0.03}><SkyRect id="w812" stops={[[0, '#5a5a7a'], [0.6, '#c89090'], [1, '#f0d0a8']]} h={700} /><Glow id="w812g" x={300} y={560} r={560} c="#ffe0b0" o={0.7} /></Par>
      <Par d={0.25}><Fog id="w812f" y={500} h={260} c="#ffd0c0" o={0.45} /></Par>
      <Par d={0.9}><rect y={700} width={W} height={H - 700} fill="#5a4a38" /><Mat kind="mud" o={0.75} light={0.25}><rect y={700} width={W} height={H - 700} fill="#5a4a38" /></Mat><rect y={700} width={W} height={H - 700} fill="url(#aoV)" /></Par>
      <Par d={1}>
        {[0, 1, 2].map((row) => Array.from({length: 7}, (_, i) => <Fig key={`${row}${i}`} id={`b${row}${i}`} x={1660 - row * 160 - i * 210 + (row % 2) * 60} y={860 + row * 80} s={0.34 + row * 0.1} o={{...tw('right', i % 2 ? '#c89870' : '#e0a880'), bayonet: true}} p={runPose(i * 1.1 + row)} light="indoor" lit={0.7} lo={row === 0} />))}
        <Fig id="a812" x={1780} y={1030} s={0.7} o={hTrench('right', {stump: true, gear: 'none'})} p={P(runPose(2.1), {uaN: -84, faN: -8, handN: 'open'}, face.angry, face.talk(4))} light="indoor" lit={0.9} />
        {[0, 1, 2].map((i) => <g key={i}><line x1={500 + i * 520} y1={820} x2={500 + i * 520} y2={640} stroke="#2a2a2a" strokeWidth={5} /><polygon points={`${500 + i * 520},640 ${590 + i * 520},656 ${500 + i * 520},676`} fill={['#c8201e', '#1a2a6a', '#e8e0d0'][i]} /></g>)}
        {Array.from({length: 14}, (_, i) => <circle key={i} cx={q() * W} cy={820 + q() * 220} r={3 + q() * 7} fill="#6a5238" opacity=".7" />)}
      </Par>
      <Par d={1}><Rays id="w812r" x={300} y={560} ang={0.45} spread={1.0} len={1500} o={0.1} /></Par>
    </Frame>
  );
};
const S8_13: React.FC = () => (
  <Frame night grade="contrast(1.14) saturate(1.0)">
    <Par d={0.1}><SkyRect id="w813" stops={[[0, '#20242c'], [1, '#6a4a38']]} /></Par>
    <Par d={1}>
      <Boom x={960} y={700} t0={0.5} r={300} seed={13} />
      {[300, 520, 1380, 1620].map((x, i) => <g key={i} fill="#05060a" transform={`translate(${x} ${900 + (i % 2) * 40})`}><circle cy={-86} r={26} /><rect x={-24} y={-62} width={48} height={110} rx={12} /><rect x={-70} y={-62} width={50} height={14} transform="rotate(-30 -45 -55)" /></g>)}
      <Embers n={60} seed={4} y0={200} y1={1000} c="#ff9a40" o={0.9} rise={90} />
    </Par>
  </Frame>
);
const S8_14: React.FC = () => <Ref src="g1452h" z={1.0} cx={900} cy={540} tint="#ffe0b0" />;

export const S6: Record<string, React.FC> = {
  '6.1': S6_1, '6.2': S6_2, '6.3': S6_3, '6.4': S6_4, '6.5': S6_5, '6.6': S6_6, '6.7': S6_7, '6.8': S6_8, '6.9': S6_9, '6.10': S6_10, '6.11': S6_11, '6.12': S6_12, '6.13': S6_13, '6.14': S6_14,
  '7.1': () => <S7 k={0} />, '7.2': () => <S7 k={1} />, '7.3': () => <S7 k={2} />, '7.4': () => <S7 k={3} />, '7.5': () => <S7 k={4} />, '7.6': () => <S7 k={5} />, '7.7': () => <S7 k={6} />, '7.8': () => <S7 k={7} />,
  '8.1': S8_1, '8.2': S8_2, '8.3': S8_3, '8.4': S8_4, '8.5': S8_5, '8.6': S8_6, '8.7': S8_7, '8.8': S8_8, '8.9': S8_9, '8.10': S8_10, '8.11': S8_11, '8.12': S8_12, '8.13': S8_13, '8.14': S8_14,
};
