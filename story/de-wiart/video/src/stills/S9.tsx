import React from 'react';
import {aimPose, handsUpPose, idlePose, runPose, SideOpts, swimPose, walkPose} from '../rig/Side';
import {H, mix, mulberry32, W} from '../world/util';
import {arms, BackFig, Birds, Cast, civ, Clouds, CobbleP, Dirt, Facade, Fig, Fog, Frame, Glow, Grad, HandCU, khaki, Mat, Motes, Par, Rays, SkyRect, Sil, Stars, Title, Tree, face} from './lib';
import {P, gent, lady} from './S1';
import {doctor, nurse, MapArt, Ocean, Ship, Ref, Flag, trooper, khakiOfficer, desk} from './S2';
import {loco, carriage, crane} from './S4';
import {CUFront, tw, hTrench} from './S6';
import {heroWW2, general2, italian} from '../scenes/WW2';
import {heroOld} from '../scenes/HeroSide';

export const oldA = (f: 'left' | 'right', extra: Partial<SideOpts> = {}): SideOpts => ({...heroWW2(f), ...extra});
export const polish = (f: 'left' | 'right'): SideOpts => ({...general2(f), pal: {...general2(f).pal, top: '#7a8a68', bottom: '#6a7a58', skin: '#d9a07a', hair: '#4a3a2a'}, hat: '#6a7a58', mustache: true, gear: 'none'});
export const chiang = (f: 'left' | 'right'): SideOpts => ({pal: {skin: '#d9a880', hair: '#14100c', top: '#8a8a5a', bottom: '#7a7a4a', belt: '#3a2a14', boots: '#1d1109'}, head: 'cap', hat: '#6a6a48', mustache: true, gear: 'none', face: f});
export const suit = (f: 'left' | 'right', c = '#2a2a34'): SideOpts => ({pal: civ(c, mix(c, '#000000', 0.3), '#3a2a1c'), head: 'none', outfit: 'frock', mustache: true, face: f});

/* =============================== CHAPTER 9 : Poland and Norway =============================== */
const reeds = (seed: number, y: number, n = 90, c = '#6a7a48') => {
  const q = mulberry32(seed);
  return <g>{Array.from({length: n}, (_, i) => { const x = q() * W, h = 70 + q() * 160; return <path key={i} d={`M${x} ${y} q${(q() - 0.5) * 24} ${-h * 0.5} ${(q() - 0.5) * 50} ${-h}`} stroke={mix(c, q() > 0.5 ? '#000000' : '#ffffff', 0.15 + q() * 0.2)} strokeWidth={3 + q() * 3} fill="none" strokeLinecap="round" />; })}</g>;
};
const birch = (x: number, y: number, h: number, k: number) => (
  <g key={k}>
    <rect x={x - h * 0.03} y={y - h} width={h * 0.06} height={h} fill="#e8e4d8" stroke="#8a8676" strokeWidth={2} />
    {Array.from({length: 9}, (_, i) => <rect key={i} x={x - h * 0.03} y={y - h + i * (h / 9) + 6} width={h * 0.06} height={h * 0.02} fill="#1a1a1a" opacity=".7" />)}
    <g filter="url(#blS)">{Array.from({length: 18}, (_, i) => <ellipse key={i} cx={x + ((i * 37) % 90) - 45} cy={y - h - 10 + ((i * 23) % 60) - 30} rx={36} ry={20} fill={['#9aaa58', '#b8c070', '#7a8a48'][i % 3]} opacity=".85" />)}</g>
  </g>
);
const marshBG = (seed = 1) => (
  <>
    <Par d={0.03}><SkyRect id={`m${seed}`} stops={[[0, '#9ab0b0'], [0.6, '#d8dccc'], [1, '#f2ecd6']]} h={560} /><Clouds n={6} seed={seed} y0={50} y1={360} c="#fff" o={0.55} /><Glow id={`mg${seed}`} x={400} y={400} r={520} c="#fff6d8" o={0.6} /></Par>
    <Par d={0.2}><Sil seed={110 + seed} base={540} amp={30} fill="#7a8a68" o={0.6} />{[200, 600, 1000, 1500, 1800].map((x, i) => birch(x, 560, 300 + (i % 3) * 60, i))}<Fog id={`mf${seed}`} y={430} h={220} c="#f2f0e0" o={0.6} /></Par>
    <Par d={0.6}><defs><Grad id={`mw${seed}`} stops={[[0, '#7a9890'], [1, '#2a4a4a']]} /></defs><rect y={560} width={W} height={H - 560} fill={`url(#mw${seed})`} />{Array.from({length: 40}, (_, i) => <path key={i} d={`M${(i * 97) % W} ${600 + (i * 41) % 440} q40 -8 80 0`} stroke="#fff" strokeOpacity=".2" strokeWidth={3} fill="none" />)}{reeds(seed, 640, 70)}</Par>
  </>
);
const punt = (x: number, y: number, s: number) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse cx={0} cy={16} rx={340} ry={22} fill="#0a1a1a" opacity=".4" filter="url(#blM)" /><path d="M-320 -30 L300 -30 Q360 -40 400 -90 L330 10 L-280 10 Z" fill="#4a3220" stroke="#1a100a" strokeWidth={5} /><path d="M-320 -30 L300 -30 Q360 -40 400 -90" fill="none" stroke="#7a5a3a" strokeWidth={6} /><rect x={-320} y={-30} width={620} height={8} fill="url(#woodP)" opacity=".6" /><path d="M-360 24 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" stroke="#fff" strokeWidth={4} fill="none" opacity=".5" /></g>
);
const S9_1: React.FC = () => (
  <Frame grade="contrast(1.05) saturate(.95) hue-rotate(6deg)" over={<BackFig x={1850} y={1290} s={0.78} hat="none" hair="#2a1c14" dark={0.34} />}>
    {marshBG(1)}
    <Par d={1}>
      {punt(900, 860, 1)}
      <Fig id="a91" x={780} y={850} s={0.5} o={oldA('right', {head: 'flatcap', hat: '#5a4a3a', gear: 'rifle', stump: true})} p={P(idlePose(0.3), {uaN: -34, faN: -64, handN: 'relaxed', head: 3}, {squint: 0.3})} light="indoor" lit={0.8} />
      <Fig id="p91" x={1120} y={850} s={0.46} o={{...polish('left'), head: 'flatcap', hat: '#6a5a3a', outfit: 'blazer'}} p={P(idlePose(1.2), arms.point, face.smile)} light="indoor" lit={0.8} />
      {Array.from({length: 7}, (_, i) => <g key={i} transform={`translate(${300 + i * 180} ${230 + (i % 3) * 50})`}><path d="M-22 0 q22 -22 44 0 q-22 -8 -44 0 Z" fill="#14100c" /><path d="M-12 -4 l-26 -16 M12 -4 l26 -16" stroke="#14100c" strokeWidth={5} strokeLinecap="round" /></g>)}
    </Par>
    <Par d={1.4}>{reeds(7, 1090, 40, '#4a5a30')}</Par>
    <Par d={1}><Rays id="m1r" x={400} y={400} ang={0.55} spread={1.0} len={1500} o={0.08} /><Motes n={50} seed={3} c="#fff6d8" o={0.5} /></Par>
  </Frame>
);
const S9_2: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.0) hue-rotate(6deg)">
    <Par d={0.1}><defs><Grad id="m92" stops={[[0, '#6a8a88'], [1, '#1a3a3a']]} /></defs><rect width={W} height={H} fill="url(#m92)" /><Glow id="m92g" x={300} y={200} r={700} c="#fff6d8" o={0.35} />{Array.from({length: 60}, (_, i) => <path key={i} d={`M${(i * 131) % W} ${(i * 67) % H} q60 -10 120 0`} stroke="#fff" strokeOpacity=".22" strokeWidth={3} fill="none" />)}</Par>
    <Par d={1.1}>
      <path d="M-80 640 L1100 560 Q1240 540 1360 470 L1240 700 L-80 800 Z" fill="#4a3220" stroke="#1a100a" strokeWidth={8} /><path d="M-80 640 L1100 560 Q1240 540 1360 470" fill="none" stroke="#8a6a44" strokeWidth={10} />
      {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={1250 + i * 70} cy={700 + i * 36} rx={200 + i * 70} ry={34 + i * 12} fill="none" stroke="#fff" strokeWidth={5} opacity={0.7 - i * 0.14} />)}
      {Array.from({length: 22}, (_, i) => <circle key={i} cx={1180 + Math.cos(i) * (80 + (i % 5) * 50)} cy={690 - (i % 6) * 28} r={4 + (i % 3) * 3} fill="#e8f8ff" opacity=".8" />)}
    </Par>
    <Par d={1.5} blur={9}>{reeds(9, 1100, 50, '#2a3a20')}</Par>
  </Frame>
);
const S9_3: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(.95) hue-rotate(6deg)">
    {marshBG(3)}
    <Par d={1}>
      <Fig id="a93" x={760} y={1040} s={0.7} o={oldA('right', {head: 'flatcap', hat: '#5a4a3a', gear: 'rifle', stump: true})} p={P(aimPose(0.3), {squint: 0.7, brow: -0.3, head: 6, uaN: -112, uaF: -104})} light="indoor" lit={0.9} />
      {Array.from({length: 6}, (_, i) => <g key={i} transform={`translate(${1150 + i * 120} ${160 + (i % 3) * 40 - i * 8}) rotate(-20)`}><path d="M-24 0 q24 -26 48 0 q-24 -8 -48 0 Z" fill="#14100c" /><path d="M-14 -4 l-28 -18 M14 -4 l28 -18" stroke="#14100c" strokeWidth={5} strokeLinecap="round" /></g>)}
      {[0, 1, 2].map((i) => <path key={i} d={`M${1060 + i * 30} ${400 - i * 40} Q${1100 + i * 30} ${340 - i * 40} ${1130 + i * 30} ${300 - i * 40}`} stroke="#ffe8b0" strokeWidth={4} fill="none" opacity={0.6 - i * 0.15} strokeLinecap="round" strokeDasharray="8 14" />)}
    </Par>
    <Par d={1.4}>{reeds(12, 1090, 40, '#4a5a30')}</Par>
    <Par d={1}><Rays id="m3r" x={400} y={400} ang={0.55} spread={1.0} len={1500} o={0.08} /></Par>
  </Frame>
);
const S9_4: React.FC = () => (
  <Frame night grade="contrast(1.08) saturate(.95) hue-rotate(6deg)">
    <Par d={0.1}>
      <rect width={W} height={H} fill="#4a3220" /><rect width={W} height={H} fill="url(#woodP)" opacity=".5" /><Mat kind="wood" o={0.5} light={0.2}><rect width={W} height={H} fill="#4a3220" /></Mat>
      <rect x={1100} y={160} width={700} height={420} fill="#bcd0dc" /><g clipPath="inset(0)">{Array.from({length: 22}, (_, i) => <rect key={i} x={1100 + ((i * 97 + 40) % 700)} y={200 + (i % 4) * 90} width={90} height={30} fill={['#4a6a3a', '#2a4a2a', '#6a8a4a'][i % 3]} opacity=".7" />)}</g><rect x={1100} y={160} width={700} height={420} fill="none" stroke="#1a100a" strokeWidth={22} /><line x1={1450} y1={160} x2={1450} y2={580} stroke="#1a100a" strokeWidth={12} />
      {[300, 760].map((x, i) => <g key={i}><line x1={x} y1={0} x2={x} y2={110} stroke="#14100c" strokeWidth={4} /><rect x={x - 28} y={110} width={56} height={84} rx={10} fill="#ffe0a0" stroke="#14100c" strokeWidth={4} /><Glow id={`tl${i}`} x={x} y={160} r={420} c="#ffc070" o={0.5} /></g>)}
    </Par>
    <Par d={0.9}><rect y={860} width={W} height={H - 860} fill="#3a2414" /><rect y={860} width={W} height={H - 860} fill="url(#woodP)" opacity=".5" /><rect y={860} width={W} height={H - 860} fill="url(#aoV)" /></Par>
    <Par d={1}>
      {desk(380, 800, 800, 200)}
      <g transform="translate(560 760)"><polygon points="0,0 560,-16 580,30 14,48" fill="#e8dcb8" stroke="#6a5a3a" strokeWidth={3} /><path d="M60 14 L240 -2 L420 10 L520 4 M120 40 L300 20 L480 34" stroke="#6a5a3a" strokeWidth={3} fill="none" /><path d="M140 20 L420 8" stroke="#a8201e" strokeWidth={5} /><circle cx={420} cy={8} r={8} fill="#a8201e" /></g>
      <Fig id="a94" x={1330} y={1040} s={0.7} o={oldA('left', {hat: '#6a7a58'})} p={P(idlePose(0.4), arms.point, face.talk(3), {brow: 0.2})} light="indoor" lit={0.9} />
      <Fig id="p94a" x={300} y={1040} s={0.66} o={polish('right')} p={P(idlePose(1.0), arms.hips, {squint: 0.4, brow: -0.2})} light="indoor" lit={0.85} />
      <Fig id="p94b" x={1660} y={1050} s={0.66} o={polish('left')} p={P(idlePose(1.8), arms.chin, face.bored)} light="indoor" lit={0.85} />
    </Par>
    <Par d={1}><Motes n={50} seed={4} c="#ffd8a0" o={0.5} r={3} /></Par>
  </Frame>
);
const S9_5: React.FC = () => (
  <Frame night grade="contrast(1.1) saturate(.95)">
    <Par d={0.1}><rect width={W} height={H} fill="#3a2414" /><rect width={W} height={H} fill="url(#woodP)" opacity=".6" /><Glow id="m95" x={900} y={300} r={900} c="#ffc880" o={0.35} /></Par>
    <Par d={1}>
      <polygon points="240,180 1560,150 1620,980 220,1010" fill="#000" opacity=".4" filter="url(#blM)" /><polygon points="220,160 1540,130 1600,960 200,990" fill="#e8dcb8" /><Mat kind="cloth" o={0.4} light={0.3}><polygon points="220,160 1540,130 1600,960 200,990" fill="#e8dcb8" /></Mat>
      <path d="M420 340 L700 280 L1100 300 L1420 380 L1360 640 L1200 820 L800 860 L520 780 L380 560 Z" fill="#cfd8b0" stroke="#6a5a3a" strokeWidth={5} />
      <path d="M520 400 Q760 560 700 840 M900 300 Q1000 560 1120 820 M600 600 Q900 640 1300 560" stroke="#6a9ac8" strokeWidth={6} fill="none" opacity=".8" />
      <Title x={880} y={520} text="POLANDIA" size={64} anchor="middle" c="#4a3a1a" ls={14} o={0.7} />
      {[[500, 700], [1220, 460], [1040, 780]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={14} fill="#a8201e" /><line x1={x} y1={y} x2={x} y2={y + 34} stroke="#3a3a3a" strokeWidth={4} /></g>)}
      <path d="M420 280 L760 460" stroke="#a8201e" strokeWidth={14} strokeLinecap="round" /><polygon points="760,460 704,462 740,420" fill="#a8201e" /><path d="M1500 360 L1220 560" stroke="#2a4a8a" strokeWidth={14} strokeLinecap="round" /><polygon points="1220,560 1276,556 1244,600" fill="#2a4a8a" />
    </Par>
    <Par d={1.15}>
      <g transform="translate(760 400) rotate(12) scale(1.5)"><HandCU kind="point" skin="#e0a880" sleeve="#7a8a68" id="m95a" /></g>
      <g transform="translate(1330 470) rotate(-10) scale(1.5)"><HandCU kind="relaxed" skin="#d9a07a" sleeve="#6a7a58" id="m95b" /></g>
    </Par>
  </Frame>
);
const S9_6: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.05) hue-rotate(-4deg)">
    <Par d={0.03}><SkyRect id="t96" stops={[[0, '#3a4a7a'], [0.5, '#c88a7a'], [1, '#ffcf8a']]} h={680} /><Clouds n={8} seed={3} y0={60} y1={420} c="#ffb090" o={0.55} /><Glow id="t96g" x={300} y={600} r={600} c="#ffe0a8" o={0.9} /><Birds n={14} seed={2} x0={400} x1={1600} y0={120} y1={380} c="#2a2038" /></Par>
    <Par d={0.25}><Sil seed={121} base={680} amp={40} fill="#5a4a6a" o={0.8} /></Par>
    <Par d={0.6}><rect y={690} width={W} height={H - 690} fill="#5a6a3a" /><Mat kind="grass" o={0.55} light={0.25}><rect y={690} width={W} height={H - 690} fill="#5a6a3a" /></Mat><rect y={690} width={W} height={H - 690} fill="url(#aoV)" />{[0, 1, 2, 3, 4].map((i) => <g key={i}><rect x={160 + i * 440} y={430} width={12} height={290} fill="#2a1c10" /><rect x={110 + i * 440} y={450} width={112} height={10} fill="#2a1c10" /><path d={`M${116 + i * 440} 456 Q${330 + i * 440} 500 ${546 + i * 440} 456`} stroke="#14100c" strokeWidth={3} fill="none" /></g>)}</Par>
    <Par d={0.9}><rect y={800} width={W} height={H - 800} fill="#3a2c20" /><rect y={800} width={W} height={14} fill="#8a8a90" /><rect y={850} width={W} height={14} fill="#8a8a90" />{Array.from({length: 40}, (_, i) => <rect key={i} x={i * 56} y={812} width={14} height={40} fill="#4a3a28" />)}</Par>
    <Par d={1}>{loco(1400, 836, 0.72)}{carriage(1700, 836, 0.7, '#2a4a3a')}{carriage(1160, 836, 0.7, '#2a4a3a')}{carriage(620, 836, 0.7, '#2a4a3a')}{carriage(80, 836, 0.7, '#2a4a3a')}</Par>
    <Par d={1}><Rays id="t96r" x={300} y={600} ang={0.3} spread={1.0} len={1600} o={0.1} /></Par>
  </Frame>
);
const S9_7: React.FC = () => (
  <Frame grade="contrast(1.05) saturate(1.0)">
    <MapArt focus={[820, 150, 2.0]} year="1939" route="M740 140 C 820 160 900 140 980 190" mark={[980, 190]} labels={[{x: 720, y: 110, t: 'POLANDIA', s: 28, big: true}, {x: 1000, y: 150, t: 'RUMANIA', s: 26, big: true}, {x: 900, y: 80, t: 'EROPA', s: 22}, {x: 880, y: 230, t: 'Laut Hitam', s: 20}]} />
  </Frame>
);
const S9_8: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(.85) hue-rotate(-6deg)">
    <Par d={0.03}><SkyRect id="f98" stops={[[0, '#6a7a8a'], [0.6, '#aab8c0'], [1, '#d8dcd8']]} h={700} /><Clouds n={9} seed={4} y0={40} y1={400} c="#e8ecf0" o={0.6} /></Par>
    <Par d={0.2}><polygon points="0,700 0,180 220,80 460,260 640,120 820,520 900,700" fill="#5a6a78" /><polygon points="1100,700 1260,260 1480,60 1700,220 1920,100 1920,700" fill="#5a6a78" /><polygon points="0,180 220,80 300,200 160,300 60,260" fill="#f4f6f8" /><polygon points="1260,260 1480,60 1560,180 1420,320" fill="#f4f6f8" /><Fog id="f98f" y={420} h={260} c="#d8e0e8" o={0.6} /></Par>
    <Par d={0.4}><polygon points="0,700 0,360 260,300 520,420 700,700" fill="#3a4a58" /><polygon points="1200,700 1360,420 1600,340 1920,420 1920,700" fill="#3a4a58" />{Array.from({length: 60}, (_, i) => <path key={i} d={`M${(i * 53) % 700} ${500 + (i * 29) % 160} l8 -30 l8 30 Z`} fill="#1a2a30" opacity=".7" />)}</Par>
    <Par d={0.7}><defs><Grad id="fw98" stops={[[0, '#6a8aa0'], [1, '#14283a']]} /></defs><rect y={690} width={W} height={H - 690} fill="url(#fw98)" />{Array.from({length: 50}, (_, i) => <path key={i} d={`M${(i * 89) % W} ${720 + (i * 41) % 340} q40 -8 80 0`} stroke="#fff" strokeOpacity=".25" strokeWidth={3} fill="none" />)}</Par>
    <Par d={1}><Ship x={1000} y={860} s={0.7} smoke={false} />{[300, 1500].map((x, i) => <Ship key={i} x={x} y={780 + i * 40} s={0.32 + i * 0.1} />)}</Par>
    <Par d={1}><Motes n={60} seed={4} c="#fff" o={0.5} r={3} /></Par>
  </Frame>
);
const S9_9: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(.9) hue-rotate(-4deg)">
    <Par d={0.03}><SkyRect id="q99" stops={[[0, '#6a7a8a'], [0.6, '#b0bcc4'], [1, '#e0e4e0']]} h={640} /><Clouds n={7} seed={6} y0={50} y1={380} c="#f0f4f8" o={0.6} /></Par>
    <Par d={0.2}><polygon points="0,640 0,220 300,120 640,300 900,640" fill="#5a6a78" /><polygon points="900,640 1200,360 1500,200 1920,320 1920,640" fill="#5a6a78" /><polygon points="0,220 300,120 380,230 200,320" fill="#f4f6f8" /><Fog id="q99f" y={420} h={240} c="#dce4ec" o={0.55} /></Par>
    <Par d={0.5}>{[220, 560, 900, 1240, 1580].map((x, i) => <g key={i}><rect x={x} y={560 - (i % 2) * 20} width={220} height={140} fill={['#8a2a1c', '#a8301e', '#7a3a2a'][i % 3]} stroke="#2a100a" strokeWidth={3} /><polygon points={`${x - 10},${560 - (i % 2) * 20} ${x + 110},${470 - (i % 2) * 20} ${x + 230},${560 - (i % 2) * 20}`} fill="#3a3a44" /><polygon points={`${x - 10},${560 - (i % 2) * 20} ${x + 110},${470 - (i % 2) * 20} ${x + 230},${560 - (i % 2) * 20}`} fill="#f4f6f8" opacity=".7" /><rect x={x + 90} y={620 - (i % 2) * 20} width={40} height={80} fill="#2a1a10" /></g>)}</Par>
    <Par d={0.7}><defs><Grad id="qw99" stops={[[0, '#6a8aa0'], [1, '#14283a']]} /></defs><rect y={700} width={W} height={H - 700} fill="url(#qw99)" /><rect y={820} width={W} height={H - 820} fill="#8a8478" /><Mat kind="stone" o={0.5} light={0.3}><rect y={820} width={W} height={H - 820} fill="#8a8478" /></Mat><rect y={820} width={W} height={H - 820} fill="url(#aoV)" />{[0, 1, 2].map((i) => <ellipse key={i} cx={300 + i * 700} cy={780} rx={160} ry={40} fill="#14202a" opacity=".5" />)}</Par>
    <Par d={1}>
      {[0, 1, 2].map((i) => <g key={i}><path d={`M${160 + i * 640} 800 L${420 + i * 640} 800 L${470 + i * 640} 740 L${110 + i * 640} 740 Z`} fill="#3a3a3a" stroke="#1a1a1a" strokeWidth={4} /></g>)}
      {[260, 420, 740, 1060, 1380, 1560].map((x, i) => <Fig key={i} id={`l99${i}`} x={x} y={900 + (i % 3) * 36} s={0.5} o={{...tw(i % 2 ? 'right' : 'right', i % 2 ? '#c89870' : '#e0a880', 'rifle+pack'), head: 'brodie'}} p={P(walkPose(i * 1.3, 0.9))} light="night" lit={0.6} />)}
      <Fig id="a99" x={1700} y={960} s={0.62} o={oldA('left', {gear: 'none'})} p={P(idlePose(0.5), arms.point, face.talk(3))} light="night" lit={0.7} />
      {[[300, 520], [1100, 440]].map(([x, y], i) => crane(x, y + 380, 0.5 + i * 0.1))}
    </Par>
    <Par d={1}>{Array.from({length: 40}, (_, i) => <line key={i} x1={(i * 211) % W} y1={(i * 83) % 700} x2={(i * 211) % W - 8} y2={(i * 83) % 700 + 30} stroke="#fff" strokeWidth={2} opacity=".5" />)}</Par>
  </Frame>
);
const S9_10: React.FC = () => (
  <Frame night grade="contrast(1.12) saturate(.85)">
    <Par d={0.1}><SkyRect id="b910" stops={[[0, '#5a6a7a'], [0.6, '#c8c8c0'], [1, '#f0ecd8']]} /><Glow id="b910g" x={1400} y={260} r={620} c="#fff8e0" o={0.95} /><Clouds n={8} seed={5} y0={40} y1={700} c="#fff" o={0.5} /></Par>
    <Par d={1}>
      <g fill="#14161c"><polygon points="260,420 1060,360 1520,300 1700,360 1500,440 1060,470 260,520" /><polygon points="900,420 1180,300 1460,236 1500,260 1240,380 1010,470" /><ellipse cx={760} cy={540} rx={120} ry={30} /><polygon points="1560,300 1700,200 1720,300" /><polygon points="1560,340 1700,420 1720,360" /><ellipse cx={540} cy={470} rx={96} ry={26} /></g>
      <g><circle cx={900} cy={440} r={26} fill="#fff" stroke="#14161c" strokeWidth={6} /><path d="M884 440 H916 M900 424 V456" stroke="#14161c" strokeWidth={8} /></g>
      <g><circle cx={1200} cy={390} r={22} fill="#fff" stroke="#14161c" strokeWidth={6} /><path d="M1186 390 H1214 M1200 376 V404" stroke="#14161c" strokeWidth={7} /></g>
      <g opacity=".7">{[0, 1, 2].map((i) => <ellipse key={i} cx={1650 + i * 160} cy={420 - i * 20} rx={120} ry={22} fill="#fff" />)}</g>
    </Par>
  </Frame>
);
const S9_11: React.FC = () => (
  <Frame grade="contrast(1.12) saturate(.85) hue-rotate(-4deg)">
    <Par d={0.03}><SkyRect id="b911" stops={[[0, '#5a6a7a'], [0.6, '#b8b8b0'], [1, '#e0dcc8']]} h={640} /><Clouds n={8} seed={5} y0={40} y1={400} c="#fff" o={0.5} /></Par>
    <Par d={0.6}><defs><Grad id="w911" stops={[[0, '#6a8aa0'], [1, '#14283a']]} /></defs><rect y={640} width={W} height={H - 640} fill="url(#w911)" /><rect y={820} width={W} height={H - 820} fill="#8a8478" /><rect y={820} width={W} height={H - 820} fill="url(#aoV)" /></Par>
    <Par d={1}>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${520 + i * 380} ${60 + i * 60}) rotate(${12 - i * 8})`}><ellipse rx={24} ry={64} fill="#2a2a30" stroke="#0a0a0e" strokeWidth={4} /><polygon points="-18,50 18,50 12,100 -12,100" fill="#2a2a30" /><path d="M-22 -30 H22" stroke="#d8c060" strokeWidth={5} /><path d="M0 -60 V-240" stroke="#fff" strokeWidth={4} opacity=".3" /></g>)}
      <g filter="url(#blL)"><ellipse cx={1460} cy={740} rx={160} ry={300} fill="#e8f0f8" opacity=".85" /><ellipse cx={1460} cy={560} rx={110} ry={160} fill="#fff" opacity=".7" /></g>
      {[420, 760, 1080].map((x, i) => <Fig key={i} id={`b911${i}`} x={x} y={960 + (i % 2) * 24} s={0.56} o={{...tw('right', i % 2 ? '#c89870' : '#e0a880', 'rifle+pack'), head: 'brodie'}} p={P(idlePose(i * 1.1), {fall: 0.5 + i * 0.1, head: 20}, face.surprise)} light="night" lit={0.7} />)}
      <Fig id="a911" x={1700} y={990} s={0.64} o={oldA('left', {gear: 'none'})} p={P(idlePose(0.5), {uaN: -140, faN: -30, handN: 'point', head: -12}, face.angry)} light="night" lit={0.75} />
      {Array.from({length: 40}, (_, i) => <circle key={i} cx={1300 + (i * 61) % 360} cy={560 + (i * 37) % 340} r={3 + (i % 4) * 2} fill="#e8f4ff" opacity=".8" />)}
    </Par>
  </Frame>
);
const S9_12: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(1.0) hue-rotate(-6deg)">
    <Par d={0.03}><SkyRect id="r912" stops={[[0, '#2a3a5a'], [0.5, '#8a5a5a'], [1, '#f0903a']]} h={640} /><Clouds n={9} seed={7} y0={40} y1={440} c="#ff9a60" o={0.5} /><Glow id="r912g" x={1500} y={620} r={800} c="#ff7a2a" o={0.8} /></Par>
    <Par d={0.25}><polygon points="1100,640 1300,420 1500,380 1920,500 1920,640" fill="#3a2a2a" /><g fill="#14100c">{[1250, 1420, 1580, 1740].map((x, i) => <g key={i}><rect x={x} y={560 - (i % 2) * 20} width={110} height={90} /><polygon points={`${x - 8},${560 - (i % 2) * 20} ${x + 55},${510 - (i % 2) * 20} ${x + 118},${560 - (i % 2) * 20}`} /></g>)}</g><g filter="url(#blL)">{[1300, 1500, 1700].map((x, i) => <ellipse key={i} cx={x} cy={420 - i * 30} rx={120} ry={200} fill="#2a2020" opacity=".8" />)}</g><Glow id="r912f" x={1500} y={600} r={380} c="#ffb040" o={0.9} /></Par>
    <Par d={0.6}><defs><Grad id="w912" stops={[[0, '#8a5a4a'], [1, '#14182a']]} /></defs><rect y={640} width={W} height={H - 640} fill="url(#w912)" />{Array.from({length: 40}, (_, i) => <path key={i} d={`M${(i * 97) % W} ${680 + (i * 41) % 380} q40 -8 80 0`} stroke="#ffb070" strokeOpacity=".3" strokeWidth={3} fill="none" />)}<ellipse cx={1500} cy={760} rx={420} ry={30} fill="#ff9a40" opacity=".4" filter="url(#blM)" /></Par>
    <Par d={1}><Ship x={720} y={880} s={0.9} smoke />{Array.from({length: 14}, (_, i) => <Fig key={i} id={`d912${i}`} x={380 + i * 54} y={742 - (i % 2) * 6} s={0.11} o={tw('right')} p={idlePose(i)} lo />)}</Par>
  </Frame>
);
const S9_13: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(.9) hue-rotate(-6deg)">
    <Par d={0.03}><SkyRect id="r913" stops={[[0, '#2a3a5a'], [0.5, '#8a6a6a'], [1, '#e8903a']]} h={700} /><Glow id="r913g" x={1500} y={640} r={700} c="#ff8a30" o={0.7} /><g filter="url(#blL)">{[1200, 1500, 1750].map((x, i) => <ellipse key={i} cx={x} cy={460 - i * 30} rx={130} ry={190} fill="#2a2020" opacity=".7" />)}</g></Par>
    <Par d={0.6}><defs><Grad id="w913" stops={[[0, '#8a5a4a'], [1, '#14182a']]} /></defs><rect y={690} width={W} height={H - 690} fill="url(#w913)" />{Array.from({length: 30}, (_, i) => <path key={i} d={`M${(i * 97) % W} ${720 + (i * 41) % 340} q40 -8 80 0`} stroke="#ffb070" strokeOpacity=".3" strokeWidth={3} fill="none" />)}</Par>
    <Par d={1}>
      <rect x={0} y={800} width={W} height={26} fill="#3a2a1c" /><rect x={0} y={826} width={W} height={H - 826} fill="#2a1e14" />{[200, 700, 1200, 1700].map((x) => <rect key={x} x={x} y={620} width={14} height={190} fill="#2a1e14" />)}<path d="M0 640 H1920" stroke="#2a1e14" strokeWidth={10} />
      <Fig id="a913" x={640} y={1000} s={0.84} o={oldA('left', {gear: 'none'})} p={P(idlePose(0.5), {uaN: 24, faN: -90, handN: 'relaxed'}, {squint: 0.35, brow: 0.15, head: -4, mouth: 0.03})} light="night" lit={0.8} />
    </Par>
    <Par d={1}><Motes n={50} seed={5} c="#ffb060" o={0.7} r={2.4} /></Par>
  </Frame>
);

/* =============================== CHAPTER 10 : Libya and Italy, 1941 =============================== */
const S10_1: React.FC = () => (
  <Frame night grade="contrast(1.1) saturate(.9) hue-rotate(4deg)">
    <Par d={0.1}>
      <rect width={W} height={H} fill="#3a3a30" />
      {Array.from({length: 14}, (_, i) => <path key={i} d={`M${i * 150 - 40} 0 Q${i * 150 + 60} 540 ${i * 150 - 40} 1080`} stroke="#8a8a78" strokeWidth={10} fill="none" opacity=".5" />)}
      {Array.from({length: 8}, (_, i) => <path key={i} d={`M0 ${i * 150} Q960 ${i * 150 + 60} 1920 ${i * 150}`} stroke="#8a8a78" strokeWidth={7} fill="none" opacity=".4" />)}
      <rect x={1180} y={220} width={380} height={260} rx={150} fill="#bcd0e0" stroke="#14140e" strokeWidth={16} /><g>{Array.from({length: 10}, (_, i) => <ellipse key={i} cx={1240 + i * 36} cy={330 + (i % 3) * 30} rx={60} ry={14} fill="#fff" opacity=".5" />)}</g>
      {[300, 700].map((x, i) => <g key={i}><rect x={x - 22} y={90} width={44} height={50} rx={8} fill="#ffe0a0" stroke="#14100c" strokeWidth={4} /><Glow id={`k1${i}`} x={x} y={120} r={340} c="#ffc070" o={0.45} /></g>)}
    </Par>
    <Par d={0.9}><rect y={880} width={W} height={H - 880} fill="#2a2a22" /><rect y={880} width={W} height={H - 880} fill="url(#aoV)" /></Par>
    <Par d={1}>
      <rect x={160} y={800} width={440} height={200} fill="#4a4a40" stroke="#14140e" strokeWidth={5} /><rect x={1260} y={790} width={440} height={210} fill="#4a4a40" stroke="#14140e" strokeWidth={5} />
      <Fig id="a101" x={1040} y={1020} s={0.7} o={oldA('right', {gear: 'none', head: 'cap'})} p={P(idlePose(0.4), {uaN: -48, faN: -84, handN: 'relaxed'}, {squint: 0.3, head: 6})} light="indoor" lit={0.8} />
      {[420, 1480].map((x, i) => <Fig key={i} id={`c101${i}`} x={x} y={820 + i * 6} s={0.46} o={{...tw(i ? 'left' : 'right', '#e0a880', 'none'), head: 'cap', hat: '#4a4a3a', outfit: 'blazer'}} p={P(idlePose(i * 1.4), arms.hips, face.bored)} light="indoor" lit={0.7} />)}
      <g transform="translate(900 700)"><polygon points="0,0 280,-20 300,60 20,80" fill="#e8dcb8" stroke="#6a5a3a" strokeWidth={3} /><path d="M40 20 L140 0 L260 20" stroke="#a8201e" strokeWidth={4} fill="none" /></g>
    </Par>
    <Par d={1}><Motes n={40} seed={4} c="#ffd8a0" o={0.4} r={3} /></Par>
  </Frame>
);
const S10_2: React.FC = () => (
  <Frame night grade="contrast(1.1) saturate(.9)">
    <Par d={0.1}><rect width={W} height={H} fill="#2a2a22" /><Glow id="k102" x={900} y={400} r={800} c="#ffc880" o={0.3} /></Par>
    <Par d={1}>
      <polygon points="260,200 1500,160 1560,980 240,1000" fill="#000" opacity=".4" filter="url(#blM)" /><polygon points="240,180 1480,140 1540,960 220,980" fill="#e8dcb8" /><Mat kind="cloth" o={0.4} light={0.3}><polygon points="240,180 1480,140 1540,960 220,980" fill="#e8dcb8" /></Mat>
      <path d="M420 300 Q700 240 980 300 Q1260 360 1380 520 L1300 760 Q1000 840 640 780 Q420 640 420 300 Z" fill="#cfd8b0" stroke="#6a5a3a" strokeWidth={5} /><path d="M520 400 Q760 500 700 760" stroke="#6a9ac8" strokeWidth={6} fill="none" /><Title x={900} y={560} text="LIBYA" size={70} anchor="middle" c="#4a3a1a" ls={16} o={0.7} />
      <path d="M320 800 Q900 440 1320 340" stroke="#a8201e" strokeWidth={8} strokeDasharray="4 18" strokeLinecap="round" fill="none" />
    </Par>
    <Par d={1.15}><g transform="translate(700 -140) rotate(180) scale(1.5)"><HandCU kind="point" skin="#e0a880" sleeve="#8a8458" id="k102h" /></g></Par>
  </Frame>
);
const S10_3: React.FC = () => (
  <Frame night grade="contrast(1.12) saturate(.9)">
    <Par d={0.1}><SkyRect id="k103" stops={[[0, '#2a3a5a'], [0.6, '#a8707a'], [1, '#f0a050']]} /><Clouds n={8} seed={4} y0={40} y1={700} c="#ffb090" o={0.4} /></Par>
    <Par d={1}>
      <g><rect x={0} y={400} width={1100} height={360} rx={160} fill="#3a4a3a" stroke="#14140e" strokeWidth={8} /><rect x={0} y={400} width={1100} height={360} rx={160} fill="url(#houseShade)" />{Array.from({length: 10}, (_, i) => <circle key={i} cx={100 + i * 100} cy={420} r={6} fill="#14140e" />)}</g>
      <g transform="translate(1100 580)"><ellipse rx={120} ry={170} fill="#2a2a2a" stroke="#0a0a0a" strokeWidth={8} /><ellipse rx={100} ry={150} fill="#1a1a1a" />{[0, 1, 2, 3].map((i) => <path key={i} d={`M0 0 L${Math.cos(i * 1.57) * 400} ${Math.sin(i * 1.57) * 110}`} stroke="#3a3a3a" strokeWidth={30} strokeLinecap="round" opacity=".7" />)}</g>
      <g filter="url(#blL)">{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={1300 + i * 150} cy={560 - i * 60} rx={80 + i * 36} ry={50 + i * 20} fill="#14100c" opacity={0.85 - i * 0.12} />)}</g>
      <g><Glow id="e103" x={1100} y={620} r={360} c="#ff7a2a" o={0.8} /><path d="M1060 560 q30 -80 70 -10 q-20 -50 50 -40 q-30 40 -40 90 Z" fill="#ffd070" opacity=".9" /></g>
    </Par>
    <Par d={1}><Motes n={50} seed={4} c="#ffa060" o={0.8} r={2.4} /></Par>
  </Frame>
);
const S10_4: React.FC = () => <Ref src="g1600h" z={1.0} cx={900} cy={540} tint="#a8b0d0" />;
const S10_5: React.FC = () => <Ref src="g1690h" z={1.0} cx={900} cy={540} tint="#a8b0d0" />;
const S10_6: React.FC = () => <Ref src="g1800h" z={1.0} cx={900} cy={540} tint="#a8b0d0" />;
const S10_7: React.FC = () => (
  <CUFront night pose={{head: -6, blink: 0.5, yaw: 6, mouth: 0.5}} variant={{patch: true, scars: true, stump: true}} c1="#6a8aa0" c2="#0a1a2a" zoom={4.2} py={380}
    fx={<g><rect x={0} y={640} width={W} height={440} fill="#2a5a7a" opacity=".85" />{Array.from({length: 8}, (_, i) => <path key={i} d={`M${i * 260 - 40} ${650 + (i % 3) * 18} q60 -26 120 0 t120 0`} stroke="#fff" strokeWidth={6} fill="none" opacity=".6" />)}{Array.from({length: 26}, (_, i) => <circle key={i} cx={600 + (i * 71) % 760} cy={300 + (i * 37) % 360} r={3 + (i % 5) * 3} fill="#e8f8ff" opacity=".85" />)}</g>} />
);
const S10_8: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(.95) hue-rotate(-4deg)">
    <Par d={0.03}><SkyRect id="b108" stops={[[0, '#4a6a9a'], [0.6, '#e0b0a0'], [1, '#ffe0b0']]} h={640} /><Clouds n={7} seed={3} y0={50} y1={380} c="#ffd8c0" o={0.5} /><Glow id="b108g" x={300} y={600} r={560} c="#ffe8b8" o={0.9} /></Par>
    <Par d={0.4}><defs><Grad id="s108" stops={[[0, '#3a6a8a'], [1, '#1a3a5a']]} /></defs><rect y={620} width={W} height={160} fill="url(#s108)" />{Array.from({length: 26}, (_, i) => <path key={i} d={`M${(i * 131) % W} ${640 + (i * 29) % 120} q40 -8 80 0`} stroke="#fff" strokeOpacity=".35" strokeWidth={3} fill="none" />)}</Par>
    <Par d={0.9}><rect y={760} width={W} height={H - 760} fill="#d8c090" /><Mat kind="sand" o={0.55} light={0.4}><rect y={760} width={W} height={H - 760} fill="#d8c090" /></Mat><rect y={760} width={W} height={H - 760} fill="url(#aoV)" /><path d="M0 780 Q480 740 960 780 T1920 780" stroke="#fff" strokeWidth={14} fill="none" opacity=".7" /></Par>
    <Par d={1}>
      <Fig id="a108" x={420} y={900} s={0.62} o={oldA('right', {gear: 'none'})} p={P(walkPose(2.2, 0.5), {torso: 10, head: 14, uaN: 20, uaF: 24, handN: 'relaxed'}, {squint: 0.6, grimace: 0.5, mouth: 0.3})} light="desert" lit={0.9} />
      {[900, 1130, 1360, 1600].map((x, i) => <Fig key={i} id={`i108${i}`} x={x} y={960 + (i % 2) * 30} s={0.56} o={italian('left')} p={P(idlePose(i * 1.3), {...aimPose(i)}, i % 2 ? face.angry : {})} light="desert" lit={0.9} />)}
      <g opacity=".5" filter="url(#blS)">{[0, 1].map((i) => <ellipse key={i} cx={420 + i * 40} cy={920} rx={140} ry={20} fill="#fff" />)}</g>
    </Par>
    <Par d={1}><Rays id="b108r" x={300} y={600} ang={0.3} spread={1.0} len={1600} o={0.1} /></Par>
  </Frame>
);
const S10_9: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(.95)">
    <Par d={0.03}><SkyRect id="c109" stops={[[0, '#4a6a9a'], [0.6, '#e0b0a0'], [1, '#ffe0b0']]} h={700} /><Glow id="c109g" x={300} y={620} r={560} c="#ffe8b8" o={0.8} /></Par>
    <Par d={0.9}><rect y={700} width={W} height={H - 700} fill="#d8c090" /><Mat kind="sand" o={0.55} light={0.4}><rect y={700} width={W} height={H - 700} fill="#d8c090" /></Mat><rect y={700} width={W} height={H - 700} fill="url(#aoV)" /></Par>
    <Par d={1}>
      <Fig id="a109" x={900} y={1020} s={0.8} o={oldA('right', {gear: 'none'})} p={P(handsUpPose(0.4), {head: 4}, {squint: 0.5, smile: 0.25, mouth: 0.05})} light="desert" lit={0.9} />
      {[1320, 1640].map((x, i) => <Fig key={i} id={`i109${i}`} x={x} y={1030 + i * 14} s={0.74} o={italian('left')} p={P(aimPose(i * 1.2), face.angry, {mouth: 0.35})} light="desert" lit={0.9} />)}
      <Fig id="i109c" x={420} y={1000} s={0.7} o={{...italian('right'), head: 'bustina', mustache: true, gear: 'none'}} p={P(idlePose(1.6), arms.point, face.angry, face.talk(5))} light="desert" lit={0.9} />
    </Par>
    <Par d={1}><Rays id="c109r" x={300} y={620} ang={0.3} spread={1.0} len={1600} o={0.1} /><Motes n={50} seed={3} c="#fff0d0" o={0.5} /></Par>
  </Frame>
);
const S10_10: React.FC = () => <Ref src="g1930h" z={1.0} cx={900} cy={540} tint="#a8b0d0" />;
const S10_11: React.FC = () => (
  <Frame night grade="contrast(1.08) saturate(.9) hue-rotate(6deg)">
    <Par d={0.1}>
      <rect width={W} height={H} fill="#6a6252" /><Mat kind="stone" o={0.7} light={0.3}><rect width={W} height={760} fill="#6a6252" /></Mat>
      {Array.from({length: 12}, (_, r) => Array.from({length: 14}, (_, c) => <rect key={`${r}${c}`} x={c * 150 - (r % 2) * 75} y={r * 70} width={142} height={62} fill={mix('#7a7260', r % 3 ? '#000000' : '#ffffff', 0.08 + ((r * 5 + c * 3) % 5) * 0.03)} opacity=".6" />))}
      <path d="M1300 180 V560 Q1300 120 1620 120 Q1900 120 1900 560 V180" fill="none" /><rect x={1320} y={170} width={280} height={360} rx={140} fill="#2a3a5a" /><rect x={1320} y={170} width={280} height={360} rx={140} fill="none" stroke="#1a1a14" strokeWidth={14} />{[0, 1, 2, 3].map((i) => <line key={i} x1={1360 + i * 66} y1={200} x2={1360 + i * 66} y2={520} stroke="#0a0a0a" strokeWidth={9} />)}<Glow id="k11w" x={1460} y={340} r={380} c="#a8c0e8" o={0.35} />
      <g><line x1={520} y1={0} x2={520} y2={200} stroke="#14100c" strokeWidth={4} /><rect x={496} y={200} width={48} height={70} rx={10} fill="#ffe0a0" stroke="#14100c" strokeWidth={4} /><Glow id="k11l" x={520} y={240} r={460} c="#ffc070" o={0.55} /></g>
    </Par>
    <Par d={0.9}><rect y={800} width={W} height={H - 800} fill="#3a342a" /><Mat kind="stone" o={0.6} light={0.3}><rect y={800} width={W} height={H - 800} fill="#3a342a" /></Mat><rect y={800} width={W} height={H - 800} fill="url(#aoV)" /></Par>
    <Par d={1}>
      <g><rect x={1080} y={740} width={500} height={34} fill="#4a3a2a" /><rect x={1090} y={774} width={420} height={30} fill="#3a2a1a" /><rect x={1100} y={720} width={380} height={20} fill="#6a5a3a" /></g>
      <Fig id="a1011" x={760} y={1040} s={0.7} o={oldA('right', {gear: 'none', hat: '#6e6a4a'})} p={P(idlePose(0.4), arms.explain, face.talk(4), {brow: 0.1})} light="indoor" lit={0.85} />
      <Fig id="o1011a" x={420} y={1050} s={0.66} o={general2('right', {})} p={P(idlePose(1.3), arms.chin, {squint: 0.4})} light="indoor" lit={0.8} />
      <Fig id="o1011b" x={1220} y={1060} s={0.66} o={{...general2('left'), pal: {...general2('left').pal, skin: '#c89870'}, hat: '#7a7458'}} p={P(idlePose(2.0), arms.crossed, face.smile)} light="indoor" lit={0.8} />
      <g transform="translate(1290 690)"><rect x={-4} y={-50} width={8} height={50} fill="#e8dcb8" /><ellipse cx={0} cy={-56} rx={6} ry={10} fill="#ffb050" /></g>
    </Par>
    <Par d={1}><Motes n={50} seed={4} c="#ffd8a0" o={0.5} r={3} /></Par>
  </Frame>
);
const S10_12: React.FC = () => (
  <Frame night grade="contrast(1.1) saturate(.9)">
    <Par d={0.1}><rect width={W} height={H} fill="#2a2418" /><Glow id="k1012" x={800} y={500} r={900} c="#ffb860" o={0.45} /></Par>
    <Par d={1}>
      <polygon points="240,200 1500,170 1560,980 220,1000" fill="#000" opacity=".4" filter="url(#blM)" /><polygon points="220,180 1480,150 1540,960 200,980" fill="#e8dcb8" /><Mat kind="cloth" o={0.4} light={0.3}><polygon points="220,180 1480,150 1540,960 200,980" fill="#e8dcb8" /></Mat>
      <g stroke="#3a2a1a" strokeWidth={5} fill="none"><path d="M360 700 L1100 640 L1300 480" /><path d="M360 700 L360 560 L700 520 L700 640" /><path d="M1100 640 L1100 760 L1300 760" strokeDasharray="10 8" /></g>
      <Title x={820} y={290} text="DENAH TEROWONGAN" size={46} anchor="middle" c="#4a3a1a" ls={6} /><g fill="#a8201e"><circle cx={1300} cy={480} r={16} /><path d="M1280 480 L1320 480 M1300 460 L1300 500" stroke="#fff" strokeWidth={5} /></g>
      <Title x={620} y={900} text="dari sel → luar tembok" size={30} anchor="middle" c="#4a3a1a" ls={3} weight={400} serif italic />
    </Par>
    <Par d={1.15}>
      <g transform="translate(840 500) rotate(8) scale(1.6)"><g transform="translate(-4 150) rotate(-24)"><rect x={-5} y={-130} width={10} height={250} fill="#d8b050" /><polygon points="-5,120 5,120 0,160" fill="#3a3a3a" /></g><HandCU kind="pinch" skin="#e0a880" sleeve="#8a8458" id="k1012h" /></g>
      <g><rect x={1620} y={500} width={34} height={140} fill="#e8dcb8" stroke="#8a7a5a" strokeWidth={3} /><ellipse cx={1637} cy={490} rx={12} ry={20} fill="#ffb050" /><Glow id="k1012c" x={1637} y={490} r={280} c="#ffb050" o={0.55} /></g>
    </Par>
  </Frame>
);
const S10_13: React.FC = () => <Ref src="g2020h" z={1.0} cx={900} cy={540} tint="#c8c0a8" />;
const S10_14: React.FC = () => <Ref src="g2020h" z={2.3} cx={620} cy={640} tint="#c8c0a8" />;
const S10_15: React.FC = () => <Ref src="g2060h" z={2.3} cx={1200} cy={700} tint="#c8c0a8" />;
const S10_16: React.FC = () => <Ref src="g2060h" z={1.2} cx={960} cy={540} tint="#c8c0a8" />;
const S10_17: React.FC = () => <Ref src="g2152h" z={1.0} cx={900} cy={540} tint="#a8b8d8" />;
const S10_18: React.FC = () => <Ref src="g2200h" z={1.0} cx={900} cy={540} tint="#a8b8d8" />;
const S10_19: React.FC = () => (
  <Frame night grade="contrast(1.14) saturate(.9)">
    <Par d={0.1}><rect width={W} height={H} fill="#06080c" /><g filter="url(#blL)">{Array.from({length: 6}, (_, i) => <rect key={i} x={i * 330} y={300 + (i % 3) * 60} width={240} height={780} fill="#10141c" />)}</g></Par>
    <Par d={1}>
      <polygon points="1480,300 160,150 160,700" fill="#fff8d0" opacity=".38" filter="url(#blM)" /><polygon points="1480,320 300,260 300,560" fill="#fff8d0" opacity=".5" filter="url(#blS)" />
      <g transform="translate(1520 330)"><rect x={-20} y={-60} width={170} height={120} rx={20} fill="#2a2a30" stroke="#0a0a0e" strokeWidth={5} /><circle cx={-20} cy={0} r={74} fill="#fff8d0" /><circle cx={-20} cy={0} r={52} fill="#fff" /><Glow id="tg" x={-20} y={0} r={300} c="#fff4c0" o={0.8} /></g>
      <g transform="translate(560 640) rotate(-120) scale(1.6)"><HandCU kind="relaxed" skin="#e0a880" sleeve="#4a4a3a" id="k19h" /></g>
      <Fig id="a1019" x={760} y={1010} s={0.75} o={oldA('right', {gear: 'none'})} p={P(idlePose(0.6), {uaN: -140, faN: -20, handN: 'open'}, face.surprise)} light="night" lit={0.15} />
    </Par>
    <Par d={1}><Motes n={80} seed={4} c="#fff8d0" o={0.5} r={3} /></Par>
  </Frame>
);
const S10_20: React.FC = () => (
  <Frame night grade="contrast(1.12) saturate(.9) hue-rotate(-4deg)">
    <Par d={0.03}><SkyRect id="v1020" stops={[[0, '#0a1020'], [0.6, '#2a3a5a'], [1, '#6a5a6a']]} h={700} /><Stars n={80} seed={3} ymax={400} /><Glow id="v1020g" x={1500} y={240} r={380} c="#dce8ff" o={0.7} /><circle cx={1500} cy={240} r={54} fill="#f4f0e0" /></Par>
    <Par d={0.5}>
      {[[60, 380], [520, 340], [980, 400], [1440, 360]].map(([x, h], i) => <Facade key={i} x={x} y={820} w={420} h={h} wall={['#6a5a4a', '#7a6a50', '#5a4a40', '#6a5a4a'][i]} roof="#3a2a2a" floors={3} cols={3} lit={0.15} seed={140 + i} roofH={80} shutter="#2a3a3a" />)}
    </Par>
    <Par d={0.9}><rect y={820} width={W} height={H - 820} fill="#3a342a" /><CobbleP y0={820} base="#4a4438" seed={9} wet /></Par>
    <Par d={1}>
      {[300, 520, 1500, 1720].map((x, i) => <Fig key={i} id={`c1020${i}`} x={x} y={1010 + (i % 2) * 14} s={0.6} o={italian(i < 2 ? 'right' : 'left')} p={P(walkPose(i * 1.3, 0.9), {uaN: -60, faN: -20})} light="night" lit={0.4} />)}
      <Fig id="a1020" x={960} y={1020} s={0.62} o={oldA('right', {gear: 'none'})} p={P(walkPose(1.2, 0.8), {torso: 6, head: -8})} light="night" lit={0.5} />
      <g transform="translate(1100 1000)"><polygon points="0,-60 600,-300 600,100 0,40" fill="#fff8d0" opacity=".18" filter="url(#blM)" /></g>
    </Par>
    <Par d={1}><Motes n={40} seed={4} c="#cfe0ff" o={0.4} r={3} /></Par>
  </Frame>
);
const S10_21: React.FC = () => (
  <Frame night grade="contrast(1.12) saturate(.9) hue-rotate(-4deg)">
    <Par d={0.03}><SkyRect id="v1021" stops={[[0, '#0a1020'], [0.6, '#2a3a5a'], [1, '#6a5a6a']]} h={700} /><Stars n={80} seed={3} ymax={400} /></Par>
    <Par d={0.9}><rect y={760} width={W} height={H - 760} fill="#3a342a" /><CobbleP y0={760} base="#4a4438" seed={9} wet /></Par>
    <Par d={1}>
      <Fig id="a1021" x={960} y={1030} s={0.78} o={oldA('right', {gear: 'none'})} p={P(handsUpPose(0.5), {head: 4}, {squint: 0.4, smile: 0.3})} light="night" lit={0.55} />
      <Fig id="o1021" x={600} y={1040} s={0.7} o={general2('right', {})} p={P(handsUpPose(1.2), face.bored)} light="night" lit={0.5} />
      <Fig id="o1021b" x={1300} y={1040} s={0.7} o={{...general2('left'), hat: '#7a7458'}} p={P(handsUpPose(2.0), face.smile)} light="night" lit={0.5} />
      {[220, 400, 1620, 1780].map((x, i) => <Fig key={i} id={`s1021${i}`} x={x} y={1020 + (i % 2) * 20} s={0.7} o={italian(i < 2 ? 'right' : 'left')} p={P(aimPose(i * 1.1), face.angry)} light="night" lit={0.5} />)}
      <g><polygon points="1000,300 1920,200 1920,600 1000,480" fill="#fff8d0" opacity=".14" filter="url(#blM)" /></g>
    </Par>
    <Par d={1}><Motes n={40} seed={4} c="#cfe0ff" o={0.4} r={3} /></Par>
  </Frame>
);
const S10_22: React.FC = () => <CUFront pose={{yaw: 14, mouth: 0.0, head: 3}} variant={{patch: true, scars: true, stump: true}} c1="#9a7050" c2="#0a0806" fx={<g stroke="#c8c8c0" strokeWidth={2} opacity=".15">{Array.from({length: 12}, (_, i) => <line key={i} x1={i * 180} y1={0} x2={i * 180 - 200} y2={1080} />)}</g>} />;

/* =============================== CHAPTER 11 : the end, and home =============================== */
const S11_1: React.FC = () => (
  <Frame night grade="contrast(1.06) saturate(.95) hue-rotate(6deg)">
    <Par d={0.1}>
      <rect width={W} height={H} fill="#5a4a3a" /><Mat kind="wood" o={0.5} light={0.25}><rect width={W} height={760} fill="#5a4a3a" /></Mat>
      {[0, 1, 2, 3, 4].map((i) => <g key={i}><rect x={120 + i * 380} y={120} width={150} height={520} fill="#d8c8a0" opacity=".8" /><rect x={120 + i * 380} y={120} width={150} height={520} fill="none" stroke="#6a5a3a" strokeWidth={10} /></g>)}
      {[480, 960, 1440].map((x, i) => <g key={i}><line x1={x} y1={0} x2={x} y2={120} stroke="#14100c" strokeWidth={4} /><ellipse cx={x} cy={150} rx={90} ry={26} fill="#3a2a1c" />{[-60, -30, 0, 30, 60].map((d) => <g key={d}><rect x={x + d - 3} y={110} width={6} height={22} fill="#e8dcb8" /><ellipse cx={x + d} cy={106} rx={4} ry={8} fill="#ffb050" /></g>)}<Glow id={`s11${i}`} x={x} y={130} r={300} c="#ffc070" o={0.45} /></g>)}
      <Flag x={160} y={160} w={160} />
    </Par>
    <Par d={0.9}><rect y={760} width={W} height={H - 760} fill="#3a2a1c" /><rect y={760} width={W} height={H - 760} fill="url(#woodP)" opacity=".5" /><rect y={760} width={W} height={H - 760} fill="url(#aoV)" /></Par>
    <Par d={1}>
      <rect x={300} y={800} width={1320} height={60} fill="#6a4a2a" /><rect x={300} y={800} width={1320} height={60} fill="url(#woodP)" opacity=".5" /><polygon points="260,800 1660,800 1700,760 220,760" fill="#8a6a40" />
      {[[480, 'right', '#2a2a34'], [800, 'right', '#3a2a2a'], [1360, 'left', '#2a2a34'], [1620, 'left', '#2a3a34']].map(([x, f, c], i) => <Fig key={i} id={`d11${i}`} x={x as number} y={960 + (i % 2) * 10} s={0.56} o={suit(f as any, c as string)} p={P(idlePose(i * 1.3), i % 2 ? arms.explain : arms.hips, face.talk(i))} light="indoor" lit={0.85} />)}
      <Fig id="a111" x={1080} y={1000} s={0.6} o={oldA('left', {gear: 'none', hat: '#6e6a4a'})} p={P(idlePose(0.5), arms.crossed, {squint: 0.4, brow: -0.1})} light="indoor" lit={0.9} />
      <g transform="translate(700 740)"><polygon points="0,0 220,-8 230,24 8,34" fill="#e8dcb8" /><polygon points="260,-4 480,-12 490,20 270,32" fill="#e8dcb8" /></g>
    </Par>
    <Par d={1}><Motes n={50} seed={4} c="#ffd8a0" o={0.5} r={3} /></Par>
  </Frame>
);
const S11_2: React.FC = () => (
  <Frame night grade="contrast(1.1) saturate(.95)">
    <Par d={0.1}><rect width={W} height={H} fill="#3a2414" /><rect width={W} height={H} fill="url(#woodP)" opacity=".6" /><Glow id="s112" x={900} y={300} r={900} c="#ffc880" o={0.35} /></Par>
    <Par d={1}>
      <polygon points="260,180 1500,150 1560,980 240,1010" fill="#000" opacity=".4" filter="url(#blM)" /><polygon points="240,160 1480,130 1540,960 220,990" fill="#ece0bc" /><Mat kind="cloth" o={0.4} light={0.3}><polygon points="240,160 1480,130 1540,960 220,990" fill="#ece0bc" /></Mat>
      <Title x={860} y={260} text="PERJANJIAN GENCATAN SENJATA" size={40} anchor="middle" c="#2a1a10" ls={4} />
      <path d="M320 330 H1420 M320 390 H1420 M320 450 H1380 M320 510 H1420 M320 570 H1300 M320 630 H1400" stroke="#6a5a3a" strokeWidth={3} opacity=".6" />
      {[[420, 840], [960, 860]].map(([x, y], i) => <g key={i}><path d={`M${x} ${y} q40 -80 90 -20 q30 40 60 -50 q20 -30 40 10 q40 -60 80 -10`} stroke="#1a2a5a" strokeWidth={7} fill="none" strokeLinecap="round" /><path d={`M${x} ${y + 24} H${x + 300}`} stroke="#3a2a14" strokeWidth={3} /></g>)}
      <g transform="translate(1240 560) rotate(-12)"><circle r={110} fill="none" stroke="#2a4a2a" strokeWidth={9} opacity=".75" /><Title x={0} y={12} text="1943" size={46} anchor="middle" c="#2a4a2a" ls={4} o={0.8} /></g>
    </Par>
    <Par d={1.15}><g transform="translate(1180 160) rotate(20) scale(1.3)"><g transform="translate(-4 150) rotate(-24)"><rect x={-5} y={-130} width={10} height={250} fill="#1a1410" /><polygon points="-5,120 5,120 0,160" fill="#c8a040" /><rect x={-6} y={-130} width={12} height={40} fill="#c8a040" /></g><HandCU kind="pinch" skin="#e0a880" sleeve="#8a8458" id="s112h" /></g></Par>
  </Frame>
);
const S11_3: React.FC = () => (
  <Frame night grade="contrast(1.08) saturate(.9)">
    <Par d={0.1}><rect width={W} height={H} fill="#5a4a3a" /><rect x={1000} y={120} width={700} height={640} rx={300} fill="#bcd0e0" stroke="#1a100a" strokeWidth={22} /><line x1={1350} y1={80} x2={1350} y2={760} stroke="#1a100a" strokeWidth={12} /><g fill="#4a6a5a" opacity=".6">{Array.from({length: 10}, (_, i) => <ellipse key={i} cx={1060 + i * 64} cy={640 + (i % 3) * 30} rx={70} ry={50} />)}</g><Glow id="s113" x={1350} y={400} r={700} c="#fff0d0" o={0.35} /></Par>
    <Par d={0.9}><rect y={800} width={W} height={H - 800} fill="#3a2a1c" /><rect y={800} width={W} height={H - 800} fill="url(#woodP)" opacity=".5" /><rect y={800} width={W} height={H - 800} fill="url(#aoV)" /></Par>
    <Par d={1}>
      <g transform="translate(500 1000)"><rect x={-110} y={-210} width={220} height={20} fill="#6a4a2a" /><rect x={-100} y={-190} width={20} height={190} fill="#4a3220" /><rect x={80} y={-190} width={20} height={190} fill="#4a3220" /><rect x={-110} y={-420} width={220} height={220} fill="#6a4a2a" stroke="#2a1a0a" strokeWidth={4} /></g>
      <Fig id="a113" x={1000} y={1030} s={0.8} o={oldA('right', {gear: 'none', hat: '#6e6a4a', head: 'cap'})} p={P(idlePose(0.5), arms.crossed, {squint: 0.45, brow: -0.15, head: 5, torso: 3})} light="indoor" lit={0.9} />
    </Par>
    <Par d={1}><Rays id="s113r" x={1350} y={300} ang={2.0} spread={0.8} len={1300} o={0.14} /><Motes n={50} seed={4} c="#ffd8a0" o={0.5} r={3} /></Par>
  </Frame>
);
const S11_4: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.1) hue-rotate(-4deg)">
    <Par d={0.03}><SkyRect id="k114" stops={[[0, '#3a4a7a'], [0.5, '#c88a7a'], [1, '#ffcf8a']]} h={700} /><Clouds n={8} seed={3} y0={60} y1={420} c="#ffb090" o={0.55} /><Glow id="k114g" x={300} y={600} r={620} c="#ffe0a8" o={0.9} /><Birds n={10} seed={2} x0={400} x1={1600} y0={120} y1={380} c="#2a2038" /></Par>
    <Par d={0.5}><Ocean y={640} c1="#4a6a8a" c2="#14283a" seed={21} /></Par>
    <Par d={1}>
      <Ship x={1000} y={780} s={0.9} hospital smoke />
      {[[300, 700, 0.5], [1600, 740, 0.4]].map(([x, y, s], i) => <g key={i} transform={`translate(${x} ${y}) scale(${s})`}><path d="M-200 0 Q0 40 200 0 L160 -40 L-160 -40 Z" fill="#3a2418" stroke="#14100c" strokeWidth={6} /><line x1={0} y1={-40} x2={0} y2={-340} stroke="#2a1a10" strokeWidth={10} /><path d="M0 -330 L180 -300 L170 -90 L0 -80 Z" fill="#8a2a1a" stroke="#2a1a10" strokeWidth={5} />{[-210, -160, -110].map((y2) => <line key={y2} x1={0} y1={y2 + 20} x2={175} y2={y2 + 36} stroke="#2a1a10" strokeWidth={4} />)}</g>)}
    </Par>
    <Par d={1}><Rays id="k114r" x={300} y={600} ang={0.35} spread={1.0} len={1600} o={0.1} /></Par>
  </Frame>
);
const S11_5: React.FC = () => (
  <Frame night grade="contrast(1.06) saturate(1.0) hue-rotate(4deg)">
    <Par d={0.1}>
      <rect width={W} height={H} fill="#7a5a3a" /><Mat kind="wood" o={0.5} light={0.25}><rect width={W} height={800} fill="#7a5a3a" /></Mat>
      <g transform="translate(960 300)"><rect x={-300} y={-160} width={600} height={400} fill="#c8201e" stroke="#4a1a10" strokeWidth={8} /><rect x={-300} y={-160} width={300} height={200} fill="#1a2a8a" /><g fill="#fff">{Array.from({length: 12}, (_, i) => <polygon key={i} points="0,-70 14,0 -14,0" transform={`translate(-150 -60) rotate(${i * 30}) translate(0 -2)`} />)}<circle cx={-150} cy={-60} r={40} fill="#fff" /></g></g>
      {[300, 1620].map((x, i) => <g key={i}><line x1={x} y1={0} x2={x} y2={110} stroke="#14100c" strokeWidth={4} /><rect x={x - 24} y={110} width={48} height={74} rx={10} fill="#ffe0a0" stroke="#14100c" strokeWidth={4} /><Glow id={`ch${i}`} x={x} y={150} r={420} c="#ffc070" o={0.5} /></g>)}
    </Par>
    <Par d={0.9}><rect y={820} width={W} height={H - 820} fill="#4a3a28" /><rect y={820} width={W} height={H - 820} fill="url(#woodP)" opacity=".5" /><rect y={820} width={W} height={H - 820} fill="url(#aoV)" /></Par>
    <Par d={1}>
      <Fig id="a115" x={700} y={1040} s={0.8} o={oldA('right', {gear: 'none', hat: '#6e6a4a'})} p={P(idlePose(0.4), arms.offer, face.smile)} light="indoor" lit={0.9} />
      <Fig id="c115" x={1260} y={1040} s={0.78} o={chiang('left')} p={P(idlePose(1.2), arms.offer, {smile: 0.45, squint: 0.2})} light="indoor" lit={0.9} />
      {[400, 1620].map((x, i) => <Fig key={i} id={`g115${i}`} x={x} y={1050} s={0.66} o={{...chiang(i ? 'left' : 'right'), head: 'cap'}} p={P(idlePose(i * 1.7), arms.hips, face.bored)} light="indoor" lit={0.8} />)}
    </Par>
    <Par d={1}><Motes n={50} seed={4} c="#ffd8a0" o={0.5} r={3} /></Par>
  </Frame>
);
const S11_6: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.05) hue-rotate(6deg)">
    <Par d={0.03}><SkyRect id="i116" stops={[[0, '#7a9ab8'], [0.6, '#cfd8d0'], [1, '#f0ecd8']]} h={640} /><Clouds n={9} seed={4} y0={50} y1={420} c="#fff" o={0.6} /><Glow id="i116g" x={300} y={400} r={520} c="#fff6d8" o={0.55} /></Par>
    <Par d={0.2}><Sil seed={131} base={620} amp={60} fill="#7a9a70" o={0.7} /><Sil seed={132} base={660} amp={44} fill="#5a8a58" o={0.9} /><Fog id="i116f" y={520} h={200} c="#e8f0e0" o={0.45} /></Par>
    <Par d={0.6}><defs><Grad id="lk116" stops={[[0, '#8aa8b0'], [1, '#3a5a68']]} /></defs><rect y={680} width={W} height={H - 680} fill="url(#lk116)" />{Array.from({length: 30}, (_, i) => <path key={i} d={`M${(i * 97) % W} ${720 + (i * 41) % 340} q40 -8 80 0`} stroke="#fff" strokeOpacity=".25" strokeWidth={3} fill="none" />)}</Par>
    <Par d={0.8}>
      <rect x={1100} y={520} width={420} height={220} fill="#8a8478" stroke="#3a342a" strokeWidth={5} /><rect x={1100} y={520} width={420} height={220} fill="url(#blockP)" opacity=".6" /><Dirt o={0.5} light={0.2}><rect x={1100} y={520} width={420} height={220} fill="#000" /></Dirt><polygon points="1070,520 1310,390 1550,520" fill="#5a5048" /><polygon points="1070,520 1310,390 1550,520" fill="url(#tileP)" /><rect x={1210} y={420} width={50} height={80} fill="#7a7468" /><rect x={1260} y={610} width={80} height={130} fill="#3a2414" /><rect x={1130} y={580} width={70} height={70} fill="#ffd890" /><rect x={1400} y={580} width={70} height={70} fill="#ffd890" /><g filter="url(#blM)"><ellipse cx={1250} cy={380} rx={60} ry={30} fill="#d8d8d0" opacity=".5" /></g>
      <Tree x={1000} y={740} h={340} seed={7} c1="#2e5a2a" c2="#7aaa4a" /><Tree x={1640} y={740} h={300} seed={9} c1="#2e5a2a" c2="#7aaa4a" />
      {[300, 480, 620].map((x, i) => <g key={i} transform={`translate(${x} 780)`}><ellipse cy={0} rx={60} ry={34} fill="#f4f0e4" stroke="#8a8676" strokeWidth={3} /><circle cx={50} cy={-10} r={22} fill="#2a2a2a" /><rect x={-30} y={20} width={8} height={30} fill="#2a2a2a" /><rect x={20} y={20} width={8} height={30} fill="#2a2a2a" /></g>)}
    </Par>
    <Par d={0.9}><rect y={740} width={W} height={H - 740} fill="#5a8a48" /><Mat kind="grass" o={0.55} light={0.3}><rect y={740} width={W} height={H - 740} fill="#5a8a48" /></Mat><rect y={740} width={W} height={H - 740} fill="url(#aoV)" /></Par>
    <Par d={1}><Rays id="i116r" x={300} y={400} ang={0.65} spread={1.0} len={1500} o={0.08} /></Par>
  </Frame>
);
const S11_7: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.0) hue-rotate(4deg)" over={<BackFig x={90} y={1290} s={0.78} hat="none" hair="#dcdcd8" dark={0.34} />}>
    <Par d={0.03}><SkyRect id="i117" stops={[[0, '#4a5a8a'], [0.55, '#c8a090'], [1, '#ffd8a0']]} h={680} /><Clouds n={8} seed={4} y0={50} y1={420} c="#ffd0b0" o={0.55} /><Glow id="i117g" x={1500} y={600} r={620} c="#ffe0a8" o={0.9} /><Birds n={7} seed={6} x0={400} x1={1500} y0={140} y1={360} c="#2a2a3a" /></Par>
    <Par d={0.2}><Sil seed={133} base={640} amp={50} fill="#4a5a6a" o={0.8} /></Par>
    <Par d={0.6}><defs><Grad id="lk117" stops={[[0, '#c88a7a'], [0.4, '#6a7a90'], [1, '#1a2a3a']]} /></defs><rect y={650} width={W} height={H - 650} fill="url(#lk117)" /><ellipse cx={1500} cy={760} rx={420} ry={34} fill="#ffcf8a" opacity=".5" filter="url(#blM)" />{Array.from({length: 30}, (_, i) => <path key={i} d={`M${(i * 97) % W} ${700 + (i * 41) % 360} q40 -8 80 0`} stroke="#fff" strokeOpacity=".22" strokeWidth={3} fill="none" />)}</Par>
    <Par d={1}>
      <rect x={300} y={880} width={1000} height={36} fill="#5a4026" /><rect x={300} y={880} width={1000} height={36} fill="url(#woodP)" opacity=".6" />{[320, 700, 1080, 1260].map((x) => <rect key={x} x={x} y={916} width={20} height={160} fill="#3a2a16" />)}
      <Fig id="a117" x={760} y={880} s={0.6} o={oldA('right', {gear: 'none', head: 'flatcap', hat: '#6a5a3a'})} p={P(idlePose(0.5), {uaN: -62, faN: -50, handN: 'relaxed', uaF: -50, faF: -60, handF: 'relaxed', torso: 4, head: 5}, {squint: 0.3, smile: 0.2})} light="warm" lit={0.8} />
      <g><line x1={840} y1={640} x2={1240} y2={500} stroke="#3a2a1a" strokeWidth={5} /><path d="M1240 500 Q1260 700 1250 780" stroke="#fff" strokeWidth={2} fill="none" opacity=".7" /><circle cx={1250} cy={790} r={10} fill="#a8201e" /></g>
      <ellipse cx={1250} cy={800} rx={90} ry={16} fill="none" stroke="#fff" strokeWidth={3} opacity=".5" />
    </Par>
    <Par d={1}><Rays id="i117r" x={1500} y={600} ang={2.7} spread={1.0} len={1500} o={0.1} /></Par>
  </Frame>
);
const S11_8: React.FC = () => <CUFront pose={{yaw: 10, mouth: 0.02, head: 4}} variant={{patch: true, scars: true, stump: true}} c1="#b89070" c2="#0e0a08" zoom={4.4} fx={<g><Glow id="c118" x={1300} y={300} r={700} c="#ffd8b0" o={0.4} /></g>} />;
const S11_9: React.FC = () => (
  <Frame grade="contrast(1.05)">
    <rect width={W} height={H} fill="#0b0806" /><defs><radialGradient id="tg9" cx=".5" cy=".5" r=".65"><stop offset="0" stopColor="#3e2c1e" /><stop offset="1" stopColor="#0b0806" /></radialGradient></defs><rect width={W} height={H} fill="url(#tg9)" />
    <Dirt o={0.7} light={0.18}><rect width={W} height={H} fill="#5a4030" opacity=".4" /></Dirt>
    <g fill="none" stroke="#e0b86a" strokeWidth={3}><rect x={70} y={70} width={W - 140} height={H - 140} opacity=".7" /><rect x={90} y={90} width={W - 180} height={H - 180} strokeWidth={1.5} opacity=".5" /></g>
    <Title x={W / 2} y={420} text="ADRIAN CARTON DE WIART" size={78} anchor="middle" ls={10} c="#f6e8c8" />
    <Title x={W / 2} y={510} text="1880 – 1963" size={52} anchor="middle" ls={12} c="#e0b86a" />
    <rect x={560} y={560} width={800} height={3} fill="#e0b86a" />
    <Title x={W / 2} y={680} text="“Jujur saja, aku menikmati perang.”" size={46} anchor="middle" ls={2} serif italic weight={400} c="#d9c7a0" />
    <Motes n={50} seed={4} c="#ffa050" o={0.6} r={2.4} y0={300} />
  </Frame>
);
const S11_10: React.FC = () => (
  <Frame grade="contrast(1.05)">
    <rect width={W} height={H} fill="#050403" />
    <line x1={620} y1={620} x2={1300} y2={460} stroke="#b01818" strokeWidth={4} strokeLinecap="round" opacity=".5" />
    <Title x={W / 2} y={560} text="TAMAT" size={40} anchor="middle" ls={20} c="#6a5a46" o={0.7} />
  </Frame>
);

export const S9: Record<string, React.FC> = {
  '9.1': S9_1, '9.2': S9_2, '9.3': S9_3, '9.4': S9_4, '9.5': S9_5, '9.6': S9_6, '9.7': S9_7, '9.8': S9_8, '9.9': S9_9, '9.10': S9_10, '9.11': S9_11, '9.12': S9_12, '9.13': S9_13,
  '10.1': S10_1, '10.2': S10_2, '10.3': S10_3, '10.4': S10_4, '10.5': S10_5, '10.6': S10_6, '10.7': S10_7, '10.8': S10_8, '10.9': S10_9, '10.10': S10_10, '10.11': S10_11, '10.12': S10_12, '10.13': S10_13, '10.14': S10_14, '10.15': S10_15, '10.16': S10_16, '10.17': S10_17, '10.18': S10_18, '10.19': S10_19, '10.20': S10_20, '10.21': S10_21, '10.22': S10_22,
  '11.1': S11_1, '11.2': S11_2, '11.3': S11_3, '11.4': S11_4, '11.5': S11_5, '11.6': S11_6, '11.7': S11_7, '11.8': S11_8, '11.9': S11_9, '11.10': S11_10,
};
