import React from 'react';
import {Character} from '../rig/Character';
import {HandArt, idlePose, runPose, SideOpts, walkPose} from '../rig/Side';
import {AnimalArt} from '../rig/Animals';
import {H, mix, mulberry32, W} from '../world/util';
import {arms, BackFig, Birds, Cast, civ, Clouds, CobbleP, Dirt, Facade, Fig, Fog, Frame, Glow, Grad, khaki, Mat, Motes, Par, Rays, SkyRect, Sil, sc, Title, Tree, face} from './lib';
import {heroYoung} from '../scenes/BoerA';

/* ----------------------------- archetypes ----------------------------- */
export const gent = (f: 'left' | 'right', c = '#2a2a34', hat: SideOpts['head'] = 'top'): SideOpts => ({pal: civ(c, mix(c, '#000000', 0.3), '#6a5a4a'), head: hat, hat: '#14100c', outfit: 'frock', mustache: true, face: f});
export const worker = (f: 'left' | 'right', c = '#5a4a3a'): SideOpts => ({pal: civ(c, '#3a3028', '#3a2a1c'), head: 'flatcap', hat: '#4a3a2a', outfit: 'blazer', face: f});
export const lady = (f: 'left' | 'right', c = '#7a2a3a'): SideOpts => ({pal: civ(c, c, '#4a2a1a'), head: 'scarf', hat: mix(c, '#ffffff', 0.12), outfit: 'dress', hairStyle: 'bun', build: 0.92, face: f});
export const effendi = (f: 'left' | 'right', c = '#e8dcc0'): SideOpts => ({pal: civ(c, c, '#2a1c14', '#c8925e'), head: 'fez', hat: '#a82a1a', outfit: 'thobe', mustache: true, face: f});
export const fellah = (f: 'left' | 'right', c = '#8a6a4a'): SideOpts => ({pal: civ(c, c, '#1a120c', '#b8844e'), head: 'turban', hat: '#e8e0d0', outfit: 'thobe', beard: true, face: f});
export const scholar = (f: 'left' | 'right', hair: string, extra: Partial<SideOpts> = {}): SideOpts => ({pal: civ('#15121a', '#15121a', hair), head: 'none', outfit: 'gown', face: f, ...extra});
export const boy = (f: 'left' | 'right', c = '#2a3a5a', hair = '#4a3020'): SideOpts => ({pal: civ(c, c, hair), head: 'flatcap', hat: c, outfit: 'blazer', build: 0.8, stretch: 0.56, face: f});
export const young = (f: 'left' | 'right'): SideOpts => ({...heroYoung(f), head: 'none', outfit: 'frock', pal: {...heroYoung(f).pal, top: '#3a4a3a', bottom: '#2a2a2a'}});
export const athlete = (f: 'left' | 'right'): SideOpts => ({...heroYoung(f), head: 'none', outfit: 'blazer', pal: {...heroYoung(f).pal, top: '#8a1a2a', bottom: '#e8e0d0', puttee: '#e8e0d0'}});
export const P = (...a: any[]) => Object.assign({}, ...a);

export const lamp = (x: number, y: number, h: number, k: number) => (
  <g key={k}>
    <rect x={x - 5} y={y - h} width={10} height={h} fill="#15101a" /><rect x={x - 13} y={y - 14} width={26} height={14} fill="#15101a" />
    <rect x={x - 16} y={y - h - 30} width={32} height={34} rx={4} fill="#ffe0a0" /><polygon points={`${x - 22},${y - h - 30} ${x},${y - h - 52} ${x + 22},${y - h - 30}`} fill="#15101a" />
    <Glow id={`lg${k}`} x={x} y={y - h - 14} r={190} c="#ffcf8a" o={0.7} />
    <ellipse cx={x} cy={y + 4} rx={90} ry={14} fill="#ffcf8a" opacity=".16" filter="url(#blM)" />
  </g>
);

/* ===== 1.1  Brussels at dusk: a gentleman and a lady talk, a boy passes, the lamplighter works ===== */
const S1_1: React.FC = () => {
  const q = mulberry32(2);
  return (
    <Frame grade="contrast(1.1) saturate(1.22) hue-rotate(-6deg)" over={<BackFig x={70} y={1290} s={0.78} hat="top" dark={0.36} />}>
      <Par d={0.02}>
        <SkyRect id="b1" stops={[[0, '#232a58'], [0.35, '#66568a'], [0.65, '#e08a62'], [1, '#ffd08a']]} h={780} />
        <Clouds n={9} seed={4} y0={90} y1={420} c="#ffb98a" o={0.5} />
        <Glow id="b1g" x={330} y={680} r={640} c="#ffe0a8" o={0.9} />
        <Birds n={9} seed={3} x0={400} x1={1500} y0={140} y1={420} c="#2a2040" />
      </Par>
      <Par d={0.1}>
        <g fill="#5a4a7a" opacity=".55">{Array.from({length: 26}, (_, i) => { const x = i * 80, h = 70 + q() * 90; return <g key={i}><rect x={x} y={740 - h} width={64} height={h} /><polygon points={`${x - 4},${740 - h} ${x + 32},${740 - h - 36} ${x + 68},${740 - h}`} /></g>; })}</g>
        <g fill="#4a4064"><polygon points="1480,720 1490,250 1500,720" /><rect x={1440} y={420} width={100} height={300} /><polygon points="1440,420 1490,230 1540,420" /><rect x={1380} y={520} width={60} height={200} /><rect x={1540} y={520} width={60} height={200} />{[0, 1, 2].map((i) => <rect key={i} x={1476} y={470 + i * 60} width={28} height={40} rx={14} fill="#2a2040" />)}</g>
      </Par>
      <Par d={0.2}><Fog id="b1f" y={560} h={260} c="#ffb98a" o={0.42} /></Par>
      <Par d={0.45}>
        {[0, 1, 2, 3, 4, 5].map((i) => <Facade key={i} x={30 + i * 318} y={840 - (i % 2) * 22} w={290} h={230 + (i % 3) * 40} wall={['#8a5a46', '#946a50', '#7a4e44'][i % 3]} roof={['#3a3446', '#46363c', '#363a4a'][i % 3]} floors={3} cols={3} lit={0.45} seed={20 + i} brick roofH={86} curtain={['#a83a3a', '#3a6aa8', '#c8a040'][i % 3]} />)}
        {[400, 1040, 1620].map((x, i) => <g key={i} filter="url(#blM)"><ellipse cx={x + 20} cy={430 - i * 20} rx={60} ry={26} fill="#ffe0c0" opacity=".3" /><ellipse cx={x + 54} cy={370 - i * 20} rx={80} ry={30} fill="#ffe0c0" opacity=".2" /></g>)}
      </Par>
      <Par d={0.85}>
        <rect y={850} width={W} height={H - 850} fill="#241c28" /><CobbleP y0={850} base="#6a5858" seed={3} wet />
        {[0, 1, 2, 3, 4, 5].map((i) => <Cast key={i} x={30 + i * 318} y={856} w={290} h={150} o={0.3} />)}
      </Par>
      <Par d={1}>
        {[300, 880, 1480].map((x, i) => lamp(x, 1000, 300, i))}
        {/* lamplighter with his pole, far */}
        <g><line x1={1500} y1={900} x2={1530} y2={660} stroke="#2a1a10" strokeWidth={4} /><Fig id="ll" x={1490} y={906} s={sc(906, 700)} o={worker('right', '#3a3028')} p={P(walkPose(0.4, 0.5), {uaN: -120, faN: -30, handN: 'relaxed'})} lit={0.7} lo /></g>
        {/* the talking couple */}
        <Fig id="g1" x={640} y={1020} s={0.5} o={gent('right')} p={P(idlePose(0.4), arms.explain, face.talk(3), face.smile, {head: 3})} />
        <Fig id="l1" x={870} y={1030} s={0.5} o={lady('left')} p={P(idlePose(1.2), arms.offer, face.smile, {head: -3})} />
        {/* a boy hurrying past, glancing back */}
        <Fig id="b11" x={1210} y={1040} s={0.42} o={boy('right', '#5a3a2a')} p={P(runPose(1.3), {head: -14, smile: 0.6})} lit={0.7} />
        <Fig id="b12" x={1430} y={1000} s={0.34} o={worker('left')} p={P(walkPose(2.4, 0.7), arms.behind)} lit={0.7} lo />
      </Par>
      <Par d={1.9} blur={9}><polygon points="1920,1080 1920,880 1740,940 1660,1080" fill="#0c080e" /><rect x={1780} y={820} width={60} height={160} fill="#0c080e" /><rect x={1760} y={800} width={100} height={30} fill="#0c080e" /></Par>
      <Par d={1}><Motes n={50} seed={1} y0={300} y1={900} o={0.4} /></Par>
    </Frame>
  );
};

/* ===== 1.2  a Brussels street: a carriage waits, a gentleman is arguing with the driver ===== */
export const wheel = (cx: number, r: number) => (
  <g><circle cx={cx} cy={-20} r={r} fill="none" stroke="#1a1012" strokeWidth={13} /><circle cx={cx} cy={-20} r={r - 10} fill="none" stroke="#5a3a1c" strokeWidth={5} /><circle cx={cx} cy={-20} r={9} fill="#1a1012" />{[0, 30, 60, 90, 120, 150].map((a) => <line key={a} x1={cx} y1={-20} x2={cx + r * Math.cos((a * Math.PI) / 180)} y2={-20 + r * Math.sin((a * Math.PI) / 180)} stroke="#1a1012" strokeWidth={4} />)}</g>
);
const S1_2: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(1.12) hue-rotate(-4deg)" over={<BackFig x={90} y={1300} s={0.8} hat="bowler" dark={0.34} />}>
    <Par d={0.03}>
      <SkyRect id="b2" stops={[[0, '#5a6c98'], [0.6, '#c8908c'], [1, '#f2c490']]} h={600} />
      <Clouds n={6} seed={2} y0={40} y1={260} c="#ffd8b8" o={0.4} />
      <Glow id="b2g" x={200} y={420} r={500} c="#ffd8a0" o={0.6} />
    </Par>
    <Par d={0.5}>
      <Facade x={-60} y={810} w={600} h={620} wall="#8a6a52" roof="#4a3a40" floors={4} cols={3} lit={0.45} seed={3} brick balcony shutter="#3a5a4a" roofH={90} />
      <Facade x={1400} y={810} w={640} h={640} wall="#7a5a4a" roof="#4a3a40" floors={4} cols={3} lit={0.4} seed={7} brick balcony shutter="#5a3a3a" curtain="#c8a040" roofH={90} />
      <Facade x={540} y={770} w={430} h={420} wall="#a08060" roof="#5a4048" floors={3} cols={3} lit={0.35} seed={11} roofH={70} />
      <Facade x={980} y={770} w={400} h={380} wall="#8a7050" roof="#5a4048" floors={3} cols={3} lit={0.3} seed={15} roofH={70} />
      <g><rect x={60} y={640} width={300} height={22} fill="#2a1a10" /><Title x={210} y={657} text="BOULANGERIE" size={16} c="#e0c070" anchor="middle" ls={3} />{Array.from({length: 8}).map((_, i) => <polygon key={i} points={`${60 + i * 38},662 ${98 + i * 38},662 ${104 + i * 38},720 ${66 + i * 38},720`} fill={i % 2 ? '#a83a3a' : '#e8d8b0'} />)}</g>
    </Par>
    <Par d={0.9}>
      <CobbleP y0={810} base="#6a5a54" seed={5} wet />
      <Cast x={-60} y={816} w={600} h={300} o={0.28} /><Cast x={540} y={816} w={430} h={220} o={0.26} />
    </Par>
    <Par d={1}>
      {[600, 1340].map((x, i) => lamp(x, 880, 380, i + 4))}
      {/* carriage + horse, correct relative size (horse ~ man's height at the withers) */}
      <g transform="translate(1160 930) scale(0.95)">
        <ellipse cx={170} cy={0} rx={220} ry={16} fill="#000" opacity=".35" filter="url(#blM)" />
        <rect x={20} y={-230} width={320} height={176} rx={24} fill="#2a1a1c" /><rect x={20} y={-230} width={320} height={176} rx={24} fill="url(#houseShade)" />
        <rect x={44} y={-204} width={118} height={108} rx={8} fill="#c8b890" opacity=".7" /><rect x={186} y={-204} width={118} height={108} rx={8} fill="#c8b890" opacity=".7" />
        <path d="M20 -230 Q180 -272 340 -230" fill="#1a1012" /><rect x={0} y={-60} width={360} height={20} fill="#1a1012" /><rect x={350} y={-252} width={14} height={34} fill="#ffe0a0" />
        {wheel(90, 70)}{wheel(290, 70)}
      </g>
      <Fig id="hz" x={930} y={950} s={0.52} o={{pal: khaki}} p={{}} art={<AnimalArt o={{kind: 'horse', coat: '#5a3a22', mane: '#1e140c', face: 'left', tack: true}} p={{phase: 0.4, head: 6}} />} />
      <Fig id="drv" x={1640} y={1010} s={0.5} o={worker('left', '#3a3028')} p={P(idlePose(0.4), arms.hips, face.angry, face.talk(5))} />
      {/* the quarrel on the pavement: gentleman pointing at the driver, a lady holding her ears */}
      <Fig id="g2" x={620} y={990} s={0.5} o={gent('right', '#3a2a2a', 'bowler')} p={P(idlePose(0.7), arms.point, face.angry, face.talk(2), {torso: -3})} />
      <Fig id="l2" x={380} y={1000} s={0.49} o={lady('right', '#3a5a6a')} p={P(idlePose(1.4), arms.chin, face.surprise)} />
      <Fig id="b2c" x={1780} y={1010} s={0.46} o={boy('left', '#6a3a3a')} p={P(idlePose(2.2), arms.explain, face.wonder)} />
    </Par>
    <Par d={1}><Motes n={40} seed={4} y0={300} y1={900} o={0.35} /></Par>
    <Par d={0.2}><Fog id="b2f" y={640} h={240} c="#ffd8b0" o={0.2} /></Par>
    <Par d={0.1}><Birds n={5} seed={9} x0={200} x1={1700} y0={110} y1={260} /></Par>
    <Par d={1}><Rays id="b2r" x={140} y={80} ang={0.55} spread={0.45} len={1500} o={0.1} /></Par>
  </Frame>
);

/* ===== 1.3  the boy presses his hand to the rain-streaked window (wonder) ===== */
const S1_3: React.FC = () => {
  const q = mulberry32(14);
  return (
    <Frame night grade="contrast(1.08) saturate(1.0) hue-rotate(-4deg)">
      <Par d={0.1}>
        <rect width={W} height={H} fill="#1c1218" />
        {Array.from({length: 22}, (_, i) => <rect key={i} x={i * 90} y={0} width={45} height={700} fill="#2a1a24" opacity=".7" />)}
        {Array.from({length: 12}, (_, r) => Array.from({length: 7}, (_, c) => <g key={`${r}${c}`} opacity=".22" fill="#a07a50"><circle cx={90 + c * 140 + (r % 2) * 70} cy={60 + r * 56} r={6} /><ellipse cx={90 + c * 140 + (r % 2) * 70} cy={60 + r * 56 + 12} rx={3} ry={9} /></g>))}
        <rect y={700} width={W} height={380} fill="#3a2418" /><rect y={700} width={W} height={380} fill="url(#woodP)" /><rect y={692} width={W} height={14} fill="#5a3a24" />
        <Mat kind="wood" o={0.45} light={0.2}><rect y={700} width={W} height={380} fill="#3a2418" /></Mat>
      </Par>
      <Par d={0.35}>
        <defs><Grad id="wnd" stops={[[0, '#2e3a6a'], [0.55, '#a8688a'], [1, '#ffb080']]} /></defs>
        <path d="M1000 180 L1000 960 L1700 960 L1700 180 Q1350 40 1000 180 Z" fill="url(#wnd)" />
        <g filter="url(#blS)">{Array.from({length: 34}, (_, i) => <circle key={i} cx={1020 + q() * 660} cy={560 + q() * 360} r={4 + q() * 10} fill={['#ffd48a', '#ffe8b8', '#ff9a50'][i % 3]} opacity={0.5 + q() * 0.5} />)}</g>
        <g fill="#241a2a" opacity=".85"><polygon points="1000,780 1120,640 1200,700 1320,590 1440,720 1560,650 1700,780 1700,960 1000,960" /><polygon points="1480,680 1490,560 1500,680" /></g>
        {Array.from({length: 70}, (_, i) => { const x = 1010 + q() * 680, y = 200 + q() * 700; return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 46} stroke="#cfe0ff" strokeWidth={2} opacity=".4" />; })}
        {Array.from({length: 26}, (_, i) => <g key={i}><ellipse cx={1020 + q() * 660} cy={220 + q() * 700} rx={4} ry={6} fill="#cfe0ff" opacity=".5" /><ellipse cx={1021 + q() * 660} cy={222 + q() * 700} rx={1.5} ry={2} fill="#fff" opacity=".8" /></g>)}
        <path d="M1000 180 L1000 960 L1700 960 L1700 180 Q1350 40 1000 180 Z" fill="none" stroke="#3a2a22" strokeWidth={30} /><path d="M1000 180 L1000 960 L1700 960 L1700 180 Q1350 40 1000 180 Z" fill="none" stroke="#6a4a34" strokeWidth={6} opacity=".7" />
        <line x1={1350} y1={90} x2={1350} y2={960} stroke="#3a2a22" strokeWidth={16} /><line x1={1000} y1={560} x2={1700} y2={560} stroke="#3a2a22" strokeWidth={16} />
        <rect x={980} y={950} width={740} height={26} fill="#5a3a24" />
        <path d="M800 100 Q900 400 850 1000 L1010 1000 L1010 100 Z" fill="#6a2a3a" />{[860, 900, 940, 980].map((x, i) => <path key={i} d={`M${x} 120 Q${x + 12} 500 ${x - 6} 1000`} stroke="#3a1420" strokeWidth={6} fill="none" opacity=".7" />)}<rect x={780} y={96} width={260} height={20} rx={8} fill="#c8a040" />
      </Par>
      <Par d={0.7}>
        <g><rect x={80} y={180} width={300} height={14} fill="#5a3a24" /><rect x={80} y={380} width={300} height={14} fill="#5a3a24" />{Array.from({length: 10}, (_, i) => <rect key={i} x={96 + i * 28} y={110 + (i % 3) * 8} width={22} height={70 - (i % 3) * 8} fill={['#6a2a2a', '#2a4a6a', '#6a5a2a', '#3a5a3a'][i % 4]} />)}{Array.from({length: 10}, (_, i) => <rect key={i} x={96 + i * 28} y={310 + (i % 2) * 10} width={22} height={70 - (i % 2) * 10} fill={['#3a3a6a', '#6a3a4a', '#4a6a5a'][i % 3]} />)}</g>
        <g><rect x={420} y={150} width={110} height={140} fill="#6a4a2a" /><rect x={430} y={160} width={90} height={120} fill="#a89878" /><circle cx={475} cy={210} r={26} fill="#5a4030" /></g>
        <rect x={60} y={740} width={420} height={30} fill="#5a3a24" /><rect x={90} y={770} width={20} height={180} fill="#4a2e1a" /><rect x={430} y={770} width={20} height={180} fill="#4a2e1a" />
        <g><rect x={200} y={690} width={14} height={50} fill="#e8dcb8" /><ellipse cx={207} cy={684} rx={7} ry={10} fill="#ffb050" /><Glow id="cg" x={207} y={684} r={220} c="#ffb050" o={0.5} /></g>
        <rect x={300} y={716} width={90} height={24} fill="#6a3a2a" /><rect x={310} y={700} width={70} height={16} fill="#2a4a6a" />
        <g><rect x={600} y={860} width={60} height={50} fill="#8a5a2a" /><ellipse cx={632} cy={848} rx={52} ry={16} fill="#6a4020" /><rect x={650} y={820} width={16} height={46} fill="#6a4020" /></g>
      </Par>
      <Par d={1.05}>
        {/* the boy: hand flat on the glass, eyes wide, a small smile; his breath fogs the pane */}
        <Fig id="c3k" x={640} y={1640} s={1.9} o={{...boy('right', '#6a7a9a', '#5a3a22'), head: 'none'}} p={P(idlePose(0.4), arms.press, face.wonder, {head: -2})} light="indoor" lit={0.8} />
        <ellipse cx={1080} cy={520} rx={110} ry={80} fill="#fff" opacity=".1" filter="url(#blL)" />
      </Par>
      <Par d={1}><Glow id="c3g" x={1300} y={500} r={700} c="#ffbf8a" o={0.25} /><Rays id="c3r" x={1350} y={300} ang={2.2} spread={0.7} len={1100} o={0.08} /><Motes n={50} seed={9} x0={500} x1={1500} y0={200} y1={900} o={0.45} /></Par>
    </Frame>
  );
};

/* ===== Cairo kit ===== */
export const palm = (x: number, y: number, h: number, k = 1) => {
  const leaves = [-80, -58, -36, -14, 10, 32, 54, 76];
  return (
    <g key={x} transform={`translate(${x} ${y}) scale(${k})`}>
      <path d={`M0 0 Q${h * 0.1} ${-h * 0.5} ${h * 0.04} ${-h}`} fill="none" stroke="#3a2a1c" strokeWidth={h * 0.05} strokeLinecap="round" />
      {Array.from({length: 14}, (_, i) => <path key={i} d={`M${-h * 0.01} ${-h * (i / 14)} q${h * 0.03} ${-h * 0.01} ${h * 0.06} 0`} stroke="#1a1208" strokeOpacity=".5" strokeWidth={2} fill="none" />)}
      {leaves.map((a, i) => { const r = (a * Math.PI) / 180, L = h * 0.5; return (
        <g key={i}><path d={`M${h * 0.04} ${-h} q${Math.sin(r) * L * 0.6} ${-L * 0.3} ${Math.sin(r) * L} ${L * 0.25 + Math.abs(a) * 0.6}`} fill="none" stroke="#2c5a34" strokeWidth={h * 0.035} strokeLinecap="round" />
          {Array.from({length: 9}, (_, j) => { const t = (j + 1) / 10, px = h * 0.04 + Math.sin(r) * L * (t * 0.95), py = -h + (-L * 0.3 * (1 - (1 - t) * (1 - t)) * 2 * 0.5) + (L * 0.25 + Math.abs(a) * 0.6) * t * t; return <line key={j} x1={px} y1={py} x2={px + (a < 0 ? -1 : 1) * h * 0.012} y2={py + h * 0.07} stroke="#3e7a44" strokeWidth={h * 0.012} />; })}</g>
      ); })}
    </g>
  );
};
export const pyramid = (x: number, y: number, w: number, h: number, c: string) => (
  <g>
    <polygon points={`${x - w / 2},${y} ${x},${y - h} ${x + w / 2},${y}`} fill={c} />
    <polygon points={`${x - w / 2},${y} ${x},${y - h} ${x + w / 2},${y}`} fill="url(#blockP)" opacity=".6" />
    <polygon points={`${x - w / 2},${y} ${x - w * 0.46},${y} ${x - 4},${y - h + 6} ${x},${y - h}`} fill="#fff" opacity=".14" />
    <polygon points={`${x},${y - h} ${x + w / 2},${y} ${x + w * 0.02},${y}`} fill="#3a1a0a" opacity=".4" />
  </g>
);
export const kairoSky = (id: string) => (
  <>
    <SkyRect id={id} stops={[[0, '#4f9ac8'], [0.5, '#bfe0d8'], [1, '#ffe4b0']]} h={720} />
    <Clouds n={5} seed={5} y0={60} y1={300} c="#fff" o={0.4} />
    <Glow id={id + 's'} x={330} y={300} r={440} c="#fff2d0" o={0.95} />
  </>
);

/* ===== 1.4  Cairo: a fez-wearing merchant bargains with a traveller; the camel is the right size and far back ===== */
const S1_4: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.28) hue-rotate(4deg)" over={<BackFig x={1850} y={1290} s={0.8} hat="none" hair="#1a120c" dark={0.36} />}>
    <Par d={0.03}>{kairoSky('k4')}<Birds n={6} seed={7} x0={300} x1={1500} y0={140} y1={330} c="#3a2a1c" /></Par>
    <Par d={0.12}>
      {pyramid(700, 720, 560, 350, '#d8b484')}{pyramid(1120, 720, 380, 240, '#cfa878')}
      <g fill="#5a4630" opacity=".75">{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${180 + i * 60} 716 q4 -26 12 -30 q4 -16 12 -8 q6 8 8 18 q4 -4 8 6 l-2 14 z`} />)}</g>
    </Par>
    <Par d={0.2}><Fog id="k4f" y={570} h={210} c="#fff0d0" o={0.55} /></Par>
    <Par d={0.5}>
      {[0, 1, 2, 3, 4].map((i) => <Facade key={i} x={30 + i * 390} y={900 - (i % 2) * 30} w={330} h={250 + (i % 3) * 50} wall={['#d8b890', '#c9a47c', '#dcc09a'][i % 3]} roof="#a8845c" floors={3} cols={3} lit={0.12} seed={30 + i} flat arch mash={i % 2 === 0} curtain="#a86a3a" />)}
      {[330, 1180, 1650].map((x, i) => <g key={i}><rect x={x} y={400 - i * 20} width={38} height={320} fill="#e4d0aa" /><rect x={x} y={400 - i * 20} width={38} height={320} fill="url(#houseShade)" /><polygon points={`${x - 8},${400 - i * 20} ${x + 19},${336 - i * 20} ${x + 46},${400 - i * 20}`} fill="#3a9a8a" /><circle cx={x + 19} cy={330 - i * 20} r={5} fill="#e0b050" /><rect x={x - 8} y={470 - i * 20} width={54} height={12} fill="#c9a47c" /><rect x={x - 8} y={560 - i * 20} width={54} height={12} fill="#c9a47c" />{[0, 1].map((j) => <rect key={j} x={x + 11} y={420 + j * 90 - i * 20} width={16} height={36} rx={8} fill="#3a2a1c" />)}</g>)}
      {palm(120, 930, 380, 1)}{palm(1830, 930, 440, 1)}{palm(1000, 910, 270, 0.9)}
    </Par>
    <Par d={0.9}>
      <rect y={900} width={W} height={H - 900} fill="#d4b280" /><Mat kind="sand" o={0.5} light={0.4}><rect y={900} width={W} height={H - 900} fill="#d4b280" /></Mat><rect y={900} width={W} height={H - 900} fill="url(#aoV)" />
      {Array.from({length: 14}, (_, i) => <ellipse key={i} cx={200 + i * 130} cy={960 + (i % 3) * 30} rx={20} ry={5} fill="#8a6a40" opacity=".4" />)}
      <Cast x={30} y={906} w={330} h={260} o={0.28} /><Cast x={420} y={906} w={330} h={240} o={0.26} /><Cast x={810} y={906} w={330} h={260} o={0.26} />
    </Par>
    <Par d={1}>
      {/* camel far back, scaled to its ground line */}
      <Fig id="k4b" x={1380} y={925} s={0.3} o={{pal: khaki, head: 'none', face: 'left'}} p={{}} art={<AnimalArt o={{kind: 'camel', coat: '#b88a58', mane: '#6a4a2a', face: 'left'}} p={{phase: 0}} />} lo />
      <Fig id="k4m" x={760} y={1030} s={0.5} o={effendi('right')} p={P(idlePose(0.5), arms.offer, face.talk(2), face.smile)} />
      <Fig id="k4t" x={1040} y={1040} s={0.5} o={P(young('left'), {outfit: 'frock', head: 'boater', hat: '#e8dcc0'})} p={P(idlePose(1.6), arms.crossed, face.bored, {head: 2})} />
      <Fig id="k4k" x={420} y={1000} s={0.3} o={boy('right', '#e8dcc0')} p={P(runPose(0.4), {smile: 1})} lit={0.8} lo />
    </Par>
    <Par d={1}><Rays id="k4r" x={330} y={300} ang={0.8} spread={1.0} len={1300} o={0.1} /><Motes n={50} seed={6} y0={500} y1={1000} c="#fff0d0" o={0.5} /></Par>
  </Frame>
);

const awning = (x: number, y: number, w: number, c1: string, c2: string, k: number) => {
  const q = mulberry32(k * 7 + 1);
  return (
    <g key={x}>
      {Array.from({length: 8}).map((_, i) => <path key={i} d={`M${x + i * (w / 8)} ${y} L${x + (i + 1) * (w / 8)} ${y} Q${x + (i + 1) * (w / 8) + 4} ${y + 36} ${x + (i + 1) * (w / 8) + 8} ${y + 66} L${x + i * (w / 8) + 8} ${y + 66} Q${x + i * (w / 8) + 4} ${y + 36} ${x + i * (w / 8)} ${y} Z`} fill={i % 2 ? c1 : c2} />)}
      <rect x={x} y={y} width={w} height={66} fill="url(#houseShade)" opacity=".6" />
      {Array.from({length: 24}).map((_, i) => <line key={i} x1={x + 8 + i * (w / 24)} y1={y + 66} x2={x + 8 + i * (w / 24)} y2={y + 78} stroke={i % 2 ? c1 : c2} strokeWidth={4} />)}
      <rect x={x + 8} y={y + 66} width={w} height={230} fill="#2a1c10" opacity=".6" /><rect x={x + 8} y={y + 280} width={w} height={20} fill="#6a4a2a" />
      {Array.from({length: 5}, (_, i) => { const cx = x + 60 + i * (w / 5.4); const col = ['#c8402c', '#e0a030', '#6a8a3a', '#a86a2c', '#8a2a3a'][(i + k) % 5]; return <g key={i}><ellipse cx={cx} cy={y + 282} rx={48} ry={14} fill="#4a3018" />{Array.from({length: 16}, (_, j) => <circle key={j} cx={cx + (q() - 0.5) * 80} cy={y + 262 - q() * 22} r={9 + q() * 4} fill={col} />)}</g>; })}
      {[0.2, 0.6].map((t, i) => <g key={i}><line x1={x + w * t} y1={y + 66} x2={x + w * t} y2={y + 110} stroke="#1a1208" strokeWidth={2} /><ellipse cx={x + w * t} cy={y + 124} rx={14} ry={18} fill="#ffcf8a" /><Glow id={`al${k}${i}`} x={x + w * t} y={y + 124} r={70} c="#ffb050" o={0.45} /></g>)}
    </g>
  );
};

/* ===== 1.5  the bazaar: a theft, a haggle, a customer pointing at fruit — a story in every corner ===== */
const S1_5: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.25) hue-rotate(3deg)" over={<BackFig x={60} y={1290} s={0.8} hat="none" hair="#1a120c" dark={0.36} />}>
    <Par d={0.03}>{kairoSky('k5')}</Par>
    <Par d={0.2}><Fog id="k5f" y={430} h={200} c="#fff0d0" o={0.4} /></Par>
    <Par d={0.5}>
      {[40, 560, 1120, 1560].map((x, i) => awning(x, 460, 420, ['#c8402c', '#2c6a8a', '#e0a030', '#2a8a6a'][i], '#f2e4c0', i))}
      <g>{[300, 820, 1380].map((x, i) => <g key={i}><line x1={x} y1={90} x2={x} y2={150} stroke="#2a1a10" strokeWidth={2} /><rect x={x - 70} y={150} width={140} height={190} fill={['#8a2a2a', '#2a4a6a', '#a87a2a'][i]} /><rect x={x - 56} y={166} width={112} height={158} fill="none" stroke="#e8d8a0" strokeWidth={4} />{[0, 1, 2].map((j) => <polygon key={j} points={`${x},${190 + j * 40} ${x + 22},${210 + j * 40} ${x},${230 + j * 40} ${x - 22},${210 + j * 40}`} fill="#e8d8a0" opacity=".7" />)}</g>)}<path d="M0 60 Q480 120 960 70 T1920 80" stroke="#2a1a10" strokeWidth={3} fill="none" />{Array.from({length: 22}, (_, i) => <polygon key={i} points={`${i * 90 + 20},${70 + Math.sin(i * 0.7) * 10} ${i * 90 + 56},${74 + Math.sin(i * 0.7) * 10} ${i * 90 + 38},${116 + Math.sin(i * 0.7) * 10}`} fill={['#c8402c', '#e0a030', '#2c6a8a', '#2a8a6a'][i % 4]} />)}</g>
    </Par>
    <Par d={0.9}>
      <rect y={800} width={W} height={H - 800} fill="#d8b684" /><Mat kind="sand" o={0.55} light={0.4}><rect y={800} width={W} height={H - 800} fill="#d8b684" /></Mat><rect y={800} width={W} height={H - 800} fill="url(#aoV)" />
      {Array.from({length: 16}, (_, i) => <ellipse key={i} cx={100 + i * 120} cy={900 + (i % 4) * 40} rx={22} ry={5} fill="#7a5a30" opacity=".35" />)}
      {[40, 560, 1120, 1560].map((x) => <Cast key={x} x={x} y={812} w={420} h={260} o={0.26} />)}
    </Par>
    <Par d={1}>
      <Fig id="cm" x={1000} y={846} s={0.3} o={{pal: khaki}} p={{}} art={<AnimalArt o={{kind: 'camel', coat: '#a8784a', mane: '#6a4a2a', face: 'right'}} p={{phase: 0}} />} lo />
      {[600, 740, 1080].map((x, i) => <Fig key={i} id={`kb${i}`} x={x} y={856} s={0.3} o={i === 1 ? lady('left', '#b86a4a') : fellah(i % 2 ? 'left' : 'right')} p={P(idlePose(i), i === 1 ? arms.offer : arms.crossed)} lit={0.8} lo />)}
      {/* left stall: vendor holds up a fruit, a customer points at it, both smiling */}
      <Fig id="v1" x={330} y={900} s={0.5} o={effendi('right', '#d8c8a0')} p={P(idlePose(0.2), arms.offer, face.talk(3), face.smile)} />
      <Fig id="c1" x={560} y={910} s={0.5} o={lady('left', '#2a6a8a')} p={P(idlePose(1.0), arms.point, face.smile, {head: 4})} />
      {/* right stall: two men haggle — open hands against folded arms */}
      <Fig id="h1" x={1420} y={900} s={0.5} o={fellah('left', '#7a5a3a')} p={P(idlePose(0.9), arms.explain, face.angry, face.talk(7))} />
      <Fig id="h2" x={1190} y={906} s={0.5} o={effendi('right', '#b8c8d8')} p={P(idlePose(2.0), arms.crossed, face.bored, {head: -2})} />
      {/* the thief: a boy racing off with an orange; the fruit-seller chases, shouting and pointing */}
      <Fig id="k5k" x={940} y={1010} s={0.6} o={boy('right', '#c85a3a', '#2a1a10')} p={P(runPose(2.3), face.laugh, {head: -8})} />
      <g transform="translate(1010 760)"><circle r={14} fill="#e8802a" /><circle r={14} fill="none" stroke="#a85a1a" strokeWidth={2} /><ellipse cx={-4} cy={-5} rx={4} ry={3} fill="#fff" opacity=".4" /></g>
      <Fig id="ch" x={1750} y={1030} s={0.55} o={fellah('left', '#6a4a2a')} p={P(runPose(0.5), arms.point, face.angry, face.talk(9))} />
      <g opacity=".4">{[0, 1, 2, 3].map((i) => <line key={i} x1={760 - i * 50} y1={970 + i * 12} x2={640 - i * 70} y2={970 + i * 12} stroke="#fff0d0" strokeWidth={5} strokeLinecap="round" />)}</g>
    </Par>
    <Par d={1}><Rays id="k5r" x={300} y={0} ang={1.1} spread={0.7} len={1300} o={0.14} /><Motes n={80} seed={3} y0={300} y1={1000} c="#fff0d0" o={0.5} /></Par>
    <Par d={1.8} blur={10}><ellipse cx={1850} cy={1050} rx={170} ry={80} fill="#3a2410" /></Par>
  </Frame>
);

/* ===== 1.6  the boy gazes at the pyramid: low sun, long shadows, small caravan ===== */
const S1_6: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.2) hue-rotate(2deg)">
    <Par d={0.03}>
      <SkyRect id="k6" stops={[[0, '#3f8ac4'], [0.55, '#e8d0a0'], [1, '#ffd89a']]} h={820} />
      <Clouds n={5} seed={2} y0={80} y1={380} c="#fff" o={0.3} />
      <Glow id="k6s" x={260} y={440} r={560} c="#fff2d0" o={0.95} />
    </Par>
    <Par d={0.2}>
      {pyramid(1250, 890, 1600, 860, '#d8aa78')}
      <g fill="#4a3620" opacity=".8">{[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${1480 + i * 50} 888 q3 -22 10 -26 q3 -14 10 -7 q5 7 7 15 q3 -3 7 5 l-2 12 z`} />)}</g>
      <Fog id="k6f" y={650} h={230} c="#ffe8c0" o={0.45} />
    </Par>
    <Par d={0.8}>
      <rect y={880} width={W} height={H - 880} fill="#d2ae7c" /><Mat kind="sand" o={0.5} light={0.45}><rect y={880} width={W} height={H - 880} fill="#d2ae7c" /></Mat>
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M0 ${900 + i * 22} Q480 ${890 + i * 22 - 10} 960 ${900 + i * 22} T1920 ${900 + i * 22}`} stroke="#8a6a40" strokeOpacity=".28" strokeWidth={3} fill="none" />)}
      <rect y={880} width={W} height={H - 880} fill="url(#aoV)" />
      <polygon points="560,990 1900,940 2000,1010 700,1060" fill="#3a2410" opacity=".25" filter="url(#blM)" />
    </Par>
    <Par d={1}><Birds n={4} seed={11} x0={600} x1={1700} y0={200} y1={420} c="#3a2a1c" s={1.2} /></Par>
    <Par d={1.1}><Fig id="k6k" x={560} y={1520} s={1.8} o={boy('right', '#c85a3a', '#5a3a22')} p={P(idlePose(0.9), face.wonder, {handN: 'relaxed', head: -6, uaN: 6})} /></Par>
    <Par d={1}><Rays id="k6r" x={260} y={440} ang={0.35} spread={1.2} len={1500} o={0.1} /><Motes n={60} seed={5} y0={300} y1={900} c="#fff0d0" o={0.5} /></Par>
  </Frame>
);

/* ===== 1.7  school: boys at play, a master crossing the lawn, a lad watching from behind ===== */
const S1_7: React.FC = () => (
  <Frame grade="contrast(1.05) saturate(.85) hue-rotate(10deg)" over={<BackFig x={70} y={1290} s={0.78} hat="cap" hair="#3a2a1c" dark={0.38} />}>
    <Par d={0.03}><SkyRect id="s7" stops={[[0, '#8a9cb8'], [0.6, '#c8d4d8'], [1, '#e8ece0']]} h={720} /><Clouds n={9} seed={4} y0={60} y1={380} c="#fff" o={0.5} /><Glow id="s7g" x={260} y={320} r={420} c="#fff6e0" o={0.5} /></Par>
    <Par d={0.1}><Sil seed={51} base={720} amp={44} fill="#7a8a78" o={0.55} /></Par>
    <Par d={0.5}>
      <Facade x={90} y={830} w={620} h={280} wall="#8a4a3a" roof="#3a3a48" floors={2} cols={5} lit={0.5} seed={61} brick arch roofH={96} curtain="#e0d0b0" chimneys={3} />
      <Facade x={1210} y={830} w={620} h={280} wall="#8a4a3a" roof="#3a3a48" floors={2} cols={5} lit={0.4} seed={62} brick arch roofH={96} curtain="#e0d0b0" chimneys={3} />
      <rect x={740} y={300} width={440} height={530} fill="#964e3e" /><rect x={740} y={300} width={440} height={530} fill="url(#brickP)" /><Dirt o={0.5} light={0.25}><rect x={740} y={300} width={440} height={530} fill="#000" /></Dirt><rect x={740} y={300} width={440} height={530} fill="url(#houseShade)" />
      {[0, 1, 2].map((i) => <rect key={i} x={740 + i * 150} y={300} width={20} height={530} fill="#c8b898" opacity=".5" />)}
      <polygon points="720,300 960,60 1200,300" fill="#32323e" /><polygon points="720,300 960,60 1200,300" fill="url(#tileP)" /><rect x={955} y={6} width={8} height={70} fill="#222" /><polygon points="963,10 1010,22 963,36" fill="#a82a2a" />
      {[0, 1].map((i) => <path key={i} d={`M${860 + i * 130} 520 V420 Q${900 + i * 130} 370 ${940 + i * 130} 420 V520 Z`} fill="#2a3448" />)}
      <circle cx={960} cy={340} r={44} fill="#e8e0c8" /><circle cx={960} cy={340} r={44} fill="none" stroke="#2a2a2a" strokeWidth={5} /><line x1={960} y1={340} x2={960} y2={308} stroke="#222" strokeWidth={4} /><line x1={960} y1={340} x2={984} y2={348} stroke="#222" strokeWidth={4} />
      <g><rect x={860} y={690} width={200} height={140} fill="#2a1a10" /><path d="M860 690 Q960 610 1060 690 Z" fill="#3a2a1c" /><path d="M880 830 V720 Q960 664 1040 720 V830 Z" fill="#1a100a" /></g>
      <Tree x={240} y={880} h={380} seed={3} /><Tree x={1700} y={890} h={410} seed={8} />
    </Par>
    <Par d={0.9}>
      <rect y={830} width={W} height={H - 830} fill="#5a7a46" />
      {Array.from({length: 22}, (_, i) => <rect key={i} x={i * 90 - 40} y={830} width={45} height={H - 830} fill="#fff" opacity=".045" />)}
      <Mat kind="grass" o={0.5} light={0.3}><rect y={830} width={W} height={H - 830} fill="#5a7a46" /></Mat>
      <rect y={830} width={W} height={H - 830} fill="url(#aoV)" />
      <polygon points="900,840 1020,840 1220,1080 700,1080" fill="#b8a888" /><polygon points="900,840 1020,840 1220,1080 700,1080" fill="url(#aoV)" />
      {[[400, 900], [520, 930], [1350, 910], [1480, 940]].map(([x, y], i) => <g key={i}>{Array.from({length: 7}, (_, j) => <circle key={j} cx={x + j * 14} cy={y + (j % 2) * 5} r={5} fill={['#e8c030', '#e8e0e8', '#d85a8a'][(i + j) % 3]} />)}</g>)}
      <Cast x={90} y={836} w={620} h={260} o={0.28} /><Cast x={740} y={836} w={440} h={420} o={0.28} /><Cast x={1210} y={836} w={620} h={260} o={0.26} />
    </Par>
    <Par d={1}>
      {/* two boys laughing together, one rolling a hoop, a master with a book */}
      <Fig id="s7a" x={520} y={1010} s={0.5} o={boy('right', '#2a3a5a')} p={P(idlePose(0.7), arms.explain, face.laugh, face.talk(4))} />
      <Fig id="s7b" x={720} y={1020} s={0.5} o={boy('left', '#3a2a5a', '#2a1a10')} p={P(idlePose(1.9), arms.hips, face.laugh)} />
      <Fig id="s7c" x={1300} y={1030} s={0.5} o={boy('left', '#2a3a5a', '#8a6a3a')} p={P(runPose(2.9), face.smile)} />
      <g><ellipse cx={1180} cy={1010} rx={50} ry={50} fill="none" stroke="#6a4a2a" strokeWidth={6} /></g>
      <Fig id="s7t" x={1110} y={1000} s={0.5} o={scholar('left', '#c9c9c4', {head: 'mortar', hat: '#15121a', beard: true})} p={P(walkPose(1.3, 0.7), {uaN: -48, faN: -94, handN: 'relaxed'}, face.smile)} />
    </Par>
    <Par d={0.1}><Birds n={6} seed={4} x0={300} x1={1600} y0={120} y1={300} c="#3a3a48" /></Par>
    <Par d={0.25}><Fog id="s7f" y={790} h={150} c="#e8ecf0" o={0.3} /></Par>
    <Par d={1}><Rays id="s7r" x={260} y={320} ang={0.65} spread={0.6} len={1400} o={0.08} /></Par>
  </Frame>
);

/* ===== 1.8  rugby: the young man hurtles ahead, teeth set; the opponents shout, the stands roar ===== */
const S1_8: React.FC = () => {
  const q = mulberry32(21);
  return (
    <Frame grade="contrast(1.07) saturate(1.3) hue-rotate(6deg)">
      <Par d={0.03}><SkyRect id="r8" stops={[[0, '#6a9cd0'], [0.6, '#cfe0e0'], [1, '#f2ecd0']]} h={620} /><Clouds n={8} seed={6} y0={50} y1={300} c="#fff" o={0.6} /><Glow id="r8g" x={240} y={330} r={420} c="#fff6d8" o={0.6} /></Par>
      <Par d={0.15}><Sil seed={71} base={620} amp={36} fill="#6a8a62" o={0.7} /><Tree x={160} y={630} h={260} seed={5} /><Tree x={420} y={628} h={200} seed={9} /><Tree x={1780} y={630} h={280} seed={2} /></Par>
      <Par d={0.4}>
        <g><rect x={560} y={540} width={720} height={80} fill="#5a4a3a" /><rect x={560} y={540} width={720} height={80} fill="url(#woodP)" opacity=".4" />{Array.from({length: 54}, (_, i) => <g key={i}><circle cx={576 + i * 13} cy={536 - (i % 3) * 6} r={5} fill="#e0a880" /><rect x={571 + i * 13} y={541 - (i % 3) * 6} width={10} height={16} fill={['#8a2a2a', '#2a3a8a', '#e8e0d0', '#3a5a3a'][i % 4]} />{i % 4 === 0 && <line x1={576 + i * 13} y1={541 - (i % 3) * 6} x2={570 + i * 13} y2={518 - (i % 3) * 6} stroke="#e0a880" strokeWidth={3} strokeLinecap="round" />}</g>)}</g>
        {[[560, 480], [1280, 480]].map(([x, y], i) => <g key={i}><line x1={x} y1={y + 140} x2={x} y2={y} stroke="#2a2a2a" strokeWidth={5} /><polygon points={`${x},${y} ${x + 80},${y + 14} ${x},${y + 36}`} fill={i ? '#2a3a8a' : '#8a1a2a'} /></g>)}
        <g stroke="#f4efe0" strokeWidth={10}><line x1={1530} y1={650} x2={1530} y2={420} /><line x1={1630} y1={650} x2={1630} y2={420} /><line x1={1530} y1={560} x2={1630} y2={560} strokeWidth={8} /></g>
      </Par>
      <Par d={0.9}>
        <rect y={620} width={W} height={H - 620} fill="#4f8f3e" />{Array.from({length: 11}).map((_, i) => <rect key={i} x={i * 180} y={620} width={90} height={H - 620} fill="#fff" opacity=".05" />)}
        <Mat kind="grass" o={0.5} light={0.3}><rect y={620} width={W} height={H - 620} fill="#4f8f3e" /></Mat><rect y={620} width={W} height={H - 620} fill="url(#aoV)" />
        <path d="M0 720 L1920 700" stroke="#f4efe0" strokeWidth={6} opacity=".85" /><path d="M600 640 L420 1080" stroke="#f4efe0" strokeWidth={6} opacity=".7" />
        {Array.from({length: 18}, (_, i) => <ellipse key={i} cx={q() * W} cy={760 + q() * 280} rx={26 + q() * 40} ry={6 + q() * 8} fill="#4a3a28" opacity={0.5} />)}
      </Par>
      <Par d={1}>
        {[260, 460, 660].map((x, i) => <Fig key={i} id={`r8o${i}`} x={x} y={890 + i * 6} s={0.46} o={{pal: civ(['#1a3a8a', '#8a1a2a', '#1a3a8a'][i], '#e8e0d0', ['#5a3a22', '#2a1a10', '#8a6a3a'][i]), head: 'none', build: 1.05, face: 'right', outfit: 'blazer'}} p={P(runPose(0.5 + i * 1.9), face.angry, face.talk(i * 2), i === 1 ? arms.point : {})} />)}
        <Fig id="r8h" x={1040} y={965} s={0.6} o={athlete('right')} p={P(runPose(2.7), face.angry, {mouth: 0.35, squint: 0.5, brow: -0.7, uaN: -42, faN: -105, handN: 'fist'})} />
        <g transform="translate(1160 720) rotate(-20)"><ellipse rx={36} ry={22} fill="#8a4a2a" /><ellipse rx={36} ry={22} fill="none" stroke="#2a1a10" strokeWidth={3} /><line x1={-16} y1={0} x2={16} y2={0} stroke="#e8dcc0" strokeWidth={3} /></g>
        <g opacity=".4">{[0, 1, 2, 3].map((i) => <line key={i} x1={720 - i * 60} y1={830 + i * 26} x2={540 - i * 90} y2={830 + i * 26} stroke="#fff" strokeWidth={5} strokeLinecap="round" />)}</g>
        {Array.from({length: 14}, (_, i) => <circle key={i} cx={760 + q() * 260} cy={930 + q() * 90} r={2 + q() * 5} fill="#6a4a2a" />)}
      </Par>
      <Par d={1}><Rays id="r8r" x={240} y={330} ang={0.7} spread={0.7} len={1500} o={0.08} /></Par>
    </Frame>
  );
};

/* ===== 1.9  the kick: boot, turf, ball, a roaring crowd out of focus ===== */
const S1_9: React.FC = () => {
  const q = mulberry32(33);
  return (
    <Frame grade="contrast(1.1) saturate(1.3) hue-rotate(6deg)">
      <Par d={0.03}><SkyRect id="r9" stops={[[0, '#6a9cd0'], [1, '#d8e4d8']]} h={640} /><Clouds n={6} seed={3} y0={60} y1={400} c="#fff" o={0.5} /><Glow id="r9s" x={300} y={140} r={460} c="#fff6d8" o={0.55} /></Par>
      <Par d={0.3} blur={8}><rect x={0} y={560} width={W} height={120} fill="#5a7a58" />{Array.from({length: 40}, (_, i) => <g key={i}><circle cx={i * 50 + 20} cy={552} r={12} fill="#e0a880" /><rect x={i * 50 + 8} y={564} width={26} height={44} fill={['#8a2a2a', '#2a3a8a', '#e8e0d0'][i % 3]} /><line x1={i * 50 + 20} y1={564} x2={i * 50 + 6} y2={524} stroke="#e0a880" strokeWidth={5} strokeLinecap="round" /></g>)}</Par>
      <Par d={0.9}>
        <rect y={620} width={W} height={H - 620} fill="#4e8a3e" />
        <Mat kind="grass" o={0.55} light={0.3}><rect y={620} width={W} height={H - 620} fill="#4e8a3e" /></Mat><rect y={620} width={W} height={H - 620} fill="url(#aoV)" />
      </Par>
      <Par d={1.1}>
        <Fig id="r9" x={560} y={1500} s={1.6} o={athlete('right')} p={P({...walkPose(0.2, 1), thN: 38, shN: 12, ftN: -10, thF: -14, shF: 16}, face.angry, {mouth: 0.3})} />
        <g transform="translate(1180 570) rotate(-30)"><ellipse rx={150} ry={92} fill="#8a4a2a" /><ellipse rx={150} ry={92} fill="url(#ballsh)" /><ellipse rx={150} ry={92} fill="none" stroke="#2a1a10" strokeWidth={8} /><line x1={-66} y1={0} x2={66} y2={0} stroke="#e8dcc0" strokeWidth={9} />{[-40, -14, 14, 40].map((x) => <line key={x} x1={x} y1={-16} x2={x} y2={16} stroke="#e8dcc0" strokeWidth={6} />)}<path d="M-120 -30 Q0 -60 120 -30" stroke="#fff" strokeOpacity=".25" strokeWidth={6} fill="none" /></g>
        <defs><radialGradient id="ballsh" cx=".3" cy=".3" r=".8"><stop offset="0" stopColor="#fff" stopOpacity=".28" /><stop offset="1" stopColor="#000" stopOpacity=".5" /></radialGradient></defs>
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={1020 - i * 40} y1={610 + i * 36} x2={740 - i * 90} y2={660 + i * 42} stroke="#fff" strokeWidth={6} opacity=".3" strokeLinecap="round" />)}
        {Array.from({length: 60}, (_, i) => <path key={i} d={`M${600 + q() * 700} ${780 + q() * 260} q4 -${24 + q() * 36} ${10 + q() * 8} -${40 + q() * 36}`} stroke={['#6aaa52', '#4e9a3a', '#8aca62'][i % 3]} strokeWidth={3 + q() * 4} fill="none" strokeLinecap="round" />)}
        {Array.from({length: 22}, (_, i) => <g key={i} transform={`translate(${760 + q() * 480} ${660 + q() * 260}) rotate(${q() * 360})`}><ellipse rx={7 + q() * 10} ry={5 + q() * 6} fill="#5a3a22" /><line x1={-14} y1={0} x2={-34 - q() * 20} y2={q() * 8 - 4} stroke="#5a3a22" strokeWidth={3} opacity=".5" /></g>)}
      </Par>
    </Frame>
  );
};

/* ===== 1.10  Oxford lecture hall: a yawning student, whisperers, a raised hand, a sleeper, the lecturer at the board ===== */
const S1_10: React.FC = () => {
  const glass = ['#c8402c', '#2c6a8a', '#e0a030', '#2a8a6a'];
  return (
    <Frame grade="contrast(1.08) saturate(.85) hue-rotate(14deg)">
      <Par d={0.1}>
        <rect width={W} height={H} fill="#202a30" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${i * 480 - 240} 0 Q${i * 480} 220 ${i * 480 + 240} 0`} stroke="#4a5a60" strokeWidth={22} fill="none" />)}
        {[0, 1, 2, 3, 4].map((i) => <g key={i}><rect x={i * 480 - 22} y={80} width={44} height={560} fill="#58666a" /><rect x={i * 480 - 22} y={80} width={44} height={560} fill="url(#houseShade)" /><rect x={i * 480 - 34} y={620} width={68} height={24} fill="#6a787a" /><rect x={i * 480 - 30} y={70} width={60} height={20} fill="#6a787a" /></g>)}
        <Mat kind="stone" o={0.5} light={0.25}><rect width={W} height={600} fill="#202a30" /></Mat>
        {[0, 1, 2, 3].map((i) => <g key={i}>
          <path d={`M${230 + i * 480} 580 L${230 + i * 480} 190 Q${330 + i * 480} 70 ${430 + i * 480} 190 L${430 + i * 480} 580 Z`} fill="#cfe0f4" />
          {Array.from({length: 4}, (_, j) => Array.from({length: 2}, (_, k) => <rect key={`${j}${k}`} x={238 + i * 480 + k * 96} y={200 + j * 90} width={90} height={84} fill={glass[(i + j + k) % 4]} opacity=".5" />))}
          <path d={`M${230 + i * 480} 580 L${230 + i * 480} 190 Q${330 + i * 480} 70 ${430 + i * 480} 190 L${430 + i * 480} 580 Z`} fill="none" stroke="#14181a" strokeWidth={14} /><line x1={330 + i * 480} y1={100} x2={330 + i * 480} y2={580} stroke="#14181a" strokeWidth={7} />
        </g>)}
        <Rays id="h10" x={330} y={200} ang={1.25} spread={0.5} len={1100} n={6} o={0.22} />
        <Rays id="h10b" x={1290} y={200} ang={1.2} spread={0.5} len={1100} n={6} o={0.22} seed={9} />
        {[500, 1000, 1500].map((x, i) => <g key={i}><line x1={x} y1={0} x2={x} y2={130} stroke="#14181a" strokeWidth={3} /><ellipse cx={x} cy={150} rx={56} ry={16} fill="#3a3a30" />{[-40, -20, 0, 20, 40].map((d) => <g key={d}><rect x={x + d - 3} y={116} width={6} height={22} fill="#e8dcb8" /><ellipse cx={x + d} cy={114} rx={4} ry={7} fill="#ffb050" /></g>)}<Glow id={`ch${i}`} x={x} y={130} r={150} c="#ffb050" o={0.35} /></g>)}
        <g><rect x={700} y={330} width={420} height={250} fill="#1c2a24" stroke="#5a3a24" strokeWidth={14} /><g stroke="#e8e8e0" strokeWidth={3} fill="none" opacity=".85"><circle cx={800} cy={450} r={48} /><circle cx={800} cy={450} r={16} /><path d="M860 400 L1020 400 M860 440 L1000 440 M860 480 L1040 480 M860 520 L980 520" /><path d="M740 380 L780 520" /></g></g>
      </Par>
      <Par d={0.8}>
        <rect y={580} width={W} height={H - 580} fill="#5a3a24" /><rect y={580} width={W} height={H - 580} fill="url(#woodP)" opacity=".6" />{Array.from({length: 8}, (_, i) => <line key={i} x1={0} y1={600 + i * 60} x2={W} y2={600 + i * 60} stroke="#000" strokeOpacity=".2" strokeWidth={2} />)}
        <Mat kind="wood" o={0.5} light={0.2}><rect y={580} width={W} height={H - 580} fill="#5a3a24" /></Mat><rect y={580} width={W} height={H - 580} fill="url(#aoV)" />
      </Par>
      <Par d={1}>
        {/* the lecturer at the board, pointer raised, mid-sentence */}
        <Fig id="l10" x={450} y={880} s={0.55} o={scholar('right', '#c9c9c4', {beard: true})} p={P(idlePose(0.3), arms.point, face.talk(1), {uaN: -102, faN: -8})} />
        <rect x={540} y={690} width={120} height={190} fill="#3a2414" /><rect x={520} y={680} width={160} height={22} fill="#4a2e1a" /><rect x={560} y={660} width={70} height={22} fill="#e8dcb8" />
        {/* students, front row first: writing, whispering pair, a hand up */}
        {[
          {r: 2, c: 0, hair: '#4a3020', act: P(arms.write, face.bored)},
          {r: 2, c: 1, hair: '#2a1a10', act: P(arms.chin, {smile: 0.3, head: -4})},
          {r: 2, c: 2, hair: '#8a6a3a', act: P(arms.hips, face.wonder)},
          {r: 2, c: 3, hair: '#1a1a1a', act: P(arms.wave, face.smile)},
          {r: 1, c: 0, hair: '#6a4a2a', act: P(arms.write)},
          {r: 1, c: 1, hair: '#3a2a1a', act: P(arms.crossed, {head: 22, torso: 9, blink: 0.12})},
          {r: 1, c: 2, hair: '#9a7a4a', act: P(arms.explain, face.talk(4), {head: -2})},
          {r: 1, c: 3, hair: '#2a1a10', act: P(arms.chin, face.bored)},
          {r: 0, c: 0, hair: '#5a3a22', act: P(arms.write)},
          {r: 0, c: 1, hair: '#1a1210', act: P(arms.crossed, face.bored)},
          {r: 0, c: 2, hair: '#7a5a3a', act: P(arms.chin)},
        ].map(({r, c, hair, act}, i) => {
          const x = 900 + c * 250 - r * 60 + (i % 2) * 14, y = 800 + r * 110;
          return <g key={i}>
            <Fig id={`st${i}`} x={x} y={y - 18} s={0.38 + r * 0.045} o={scholar('left', hair, {build: 0.95})} p={P(idlePose(i * 1.3), act)} lo />
            <rect x={x - 100} y={y - 50} width={200} height={26} fill="#6a4228" /><rect x={x - 100} y={y - 24} width={200} height={90} fill="#4a2e1a" /><rect x={x - 100} y={y - 24} width={200} height={90} fill="url(#woodP)" opacity=".4" />
            <rect x={x - 60} y={y - 58} width={46} height={10} fill="#e8dcb8" /><circle cx={x + 40} cy={y - 56} r={6} fill="#1a1410" />
          </g>;
        })}
        {/* Adrian at the back: a huge yawn, arms stretched up */}
        <Fig id="a10" x={1760} y={830} s={0.52} o={P(young('left'), {outfit: 'gown', pal: {...young('left').pal, top: '#15121a', bottom: '#15121a'}})} p={P(idlePose(0.5), arms.stretch, face.yawn)} />
        <rect x={1630} y={650} width={230} height={26} fill="#6a4228" /><rect x={1630} y={676} width={230} height={170} fill="#4a2e1a" />
      </Par>
      <Par d={1}><Motes n={90} seed={3} y0={80} y1={700} c="#fff6d8" o={0.55} r={3} /></Par>
    </Frame>
  );
};

/* ===== 1.11  Adrian slumped at the window, chin in hand, a drawn-out yawn ===== */
const S1_11: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.0) hue-rotate(6deg)">
    <Par d={0.1}><rect width={W} height={H} fill="#262018" /><rect width={W} height={H} fill="url(#woodP)" opacity=".18" /></Par>
    <Par d={0.4}>
      <path d="M980 140 L980 980 L1760 980 L1760 140 Q1370 20 980 140 Z" fill="#a8d0f0" />
      <defs><Grad id="q11" stops={[[0, '#cfe4ff'], [0.55, '#e8f0d8'], [1, '#9ac07a']]} /></defs>
      <path d="M980 140 L980 980 L1760 980 L1760 140 Q1370 20 980 140 Z" fill="url(#q11)" />
      <Clouds n={4} seed={2} y0={160} y1={420} c="#fff" o={0.6} />
      <Facade x={1010} y={760} w={300} h={230} wall="#8a8a78" roof="#4a4a52" floors={2} cols={3} lit={0.1} seed={5} arch roofH={60} chimneys={1} />
      <Facade x={1380} y={770} w={330} h={260} wall="#9a9a86" roof="#4a4a52" floors={2} cols={3} lit={0.1} seed={9} arch roofH={60} chimneys={1} />
      <ellipse cx={1370} cy={820} rx={420} ry={90} fill="#6a9a50" /><Tree x={1200} y={840} h={220} seed={4} /><Tree x={1600} y={850} h={260} seed={6} />
      <Birds n={5} seed={3} x0={1050} x1={1700} y0={200} y1={400} c="#3a3a48" />
      <path d="M980 140 L980 980 L1760 980 L1760 140 Q1370 20 980 140 Z" fill="none" stroke="#1c140e" strokeWidth={32} /><path d="M980 140 L980 980 L1760 980 L1760 140 Q1370 20 980 140 Z" fill="none" stroke="#6a4a34" strokeWidth={5} opacity=".6" />
      <line x1={1370} y1={70} x2={1370} y2={980} stroke="#1c140e" strokeWidth={18} /><line x1={980} y1={520} x2={1760} y2={520} stroke="#1c140e" strokeWidth={18} />
      <Rays id="q11r" x={1370} y={300} ang={2.0} spread={0.8} len={1300} o={0.16} />
    </Par>
    <Par d={0.9}>
      <g><polygon points="0,900 1920,860 1920,1080 0,1080" fill="#3a2414" /><polygon points="0,900 1920,860 1920,1080 0,1080" fill="url(#woodP)" opacity=".5" /><polygon points="0,900 1920,860 1920,872 0,912" fill="#7a5030" /></g>
      <g transform="translate(1040 900) rotate(-3)"><polygon points="0,0 260,-10 270,70 6,86" fill="#e8dcb8" /><path d="M20 20 H240 M24 42 H244 M28 64 H250" stroke="#6a5a40" strokeWidth={3} opacity=".6" /></g>
      <g transform="translate(1400 884)"><rect x={0} y={0} width={60} height={50} rx={6} fill="#1a1a2a" /><rect x={20} y={-16} width={20} height={18} fill="#1a1a2a" /><path d="M30 -10 q60 -120 130 -150" stroke="#e8dcb8" strokeWidth={5} fill="none" /></g>
      <g transform="translate(1180 930)"><polygon points="0,0 240,-8 250,60 8,70" fill="#6a3a2a" /><polygon points="10,-8 120,-14 124,52 14,60" fill="#e8dcb8" /><polygon points="128,-14 236,-20 244,46 132,52" fill="#d8ccA8" /></g>
    </Par>
    <Par d={1.1}><Fig id="a11" x={600} y={2420} s={1.7} o={P(young('right'), {outfit: 'gown'})} p={P(idlePose(0.7), arms.chin, face.yawn, {head: -6, torso: 6})} light="indoor" lit={0.9} /></Par>
    <Par d={1}><Glow id="a11g" x={1370} y={420} r={700} c="#fff2d0" o={0.25} /><Motes n={70} seed={5} x0={400} x1={1700} y0={100} y1={900} o={0.55} r={3} /></Par>
  </Frame>
);

/* ===== 1.12  the poster is torn from the wall by a real hand ===== */
const S1_12: React.FC = () => {
  const q = mulberry32(26);
  return (
    <Frame grade="contrast(1.12) saturate(1.0) hue-rotate(-4deg)">
      <Par d={0.1}>
        <rect width={W} height={H} fill="#5a3a30" />
        {Array.from({length: 14}).map((_, r) => Array.from({length: 12}).map((_, c) => <rect key={`${r}${c}`} x={c * 170 - (r % 2) * 85} y={r * 82} width={162} height={74} fill={mix('#7a4a3a', r % 3 ? '#000000' : '#ffffff', 0.08 + ((r * 7 + c * 3) % 6) * 0.03)} />))}
        <Mat kind="stone" o={0.6} light={0.25}><rect width={W} height={H} fill="#5a3a30" /></Mat>
        <g><polygon points="140,160 440,150 450,520 130,530" fill="#b8a888" transform="rotate(-4 290 340)" /><polygon points="1500,520 1800,530 1790,940 1490,930" fill="#a89878" transform="rotate(3 1650 730)" /><path d="M170 220 H400 M170 260 H380 M170 300 H410" stroke="#5a4a3a" strokeWidth={5} opacity=".5" transform="rotate(-4 290 340)" /></g>
      </Par>
      <Par d={0.8}>
        <polygon points="560,140 1400,120 1420,1000 540,980" fill="#000" opacity=".4" filter="url(#blM)" />
        <polygon points="540,120 1380,100 1400,980 520,960" fill="#e8dcb8" />
        <Mat kind="cloth" o={0.35} light={0.3}><polygon points="540,120 1380,100 1400,980 520,960" fill="#e8dcb8" /></Mat>
        <polygon points="540,120 1380,100 1400,980 520,960" fill="url(#ppr)" /><defs><radialGradient id="ppr" cx=".5" cy=".4" r=".8"><stop offset="0" stopColor="#fff" stopOpacity=".1" /><stop offset="1" stopColor="#5a3a20" stopOpacity=".4" /></radialGradient></defs>
        <g stroke="#5a4a30" strokeOpacity=".3" strokeWidth={3} fill="none"><path d="M530 540 L1390 540" /><path d="M960 110 L960 970" /><path d="M700 120 L760 970" strokeWidth={2} /></g>
        <ellipse cx={720} cy={800} rx={90} ry={50} fill="#8a6a30" opacity=".16" /><ellipse cx={1200} cy={300} rx={70} ry={40} fill="#8a6a30" opacity=".14" />
        {[[560, 140], [1360, 120], [540, 940], [1380, 960]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={9} fill="#3a3a40" /><circle cx={x - 2} cy={y - 2} r={3} fill="#9a9aa0" /></g>)}
        <Title x={900} y={270} text="BANGSA" size={108} anchor="middle" c="#8a1a1a" ls={12} />
        <Title x={940} y={366} text="MEMANGGILMU" size={72} anchor="middle" c="#8a1a1a" ls={6} />
        <rect x={640} y={400} width={620} height={5} fill="#2a1a10" />
        <Title x={960} y={470} text="PRAJURIT DICARI" size={52} anchor="middle" c="#2a1a10" ls={6} />
        <Title x={960} y={528} text="PERANG DI AFRIKA SELATAN · 1899" size={30} anchor="middle" c="#2a1a10" ls={3} weight={600} />
        <g fill="#2a1a10"><circle cx={960} cy={650} r={42} /><path d="M936 622 q24 -26 48 0" /><rect x={918} y={690} width={84} height={190} rx={20} /><rect x={1000} y={640} width={14} height={240} /><polygon points="1000,640 1014,640 1007,614" /></g>
        <polygon points="1100,100 1380,100 1400,330 1330,240 1250,260 1180,170" fill="#5a3a30" />
        <path d="M1100 100 L1180 170 L1250 260 L1330 240 L1400 330" fill="none" stroke="#b8a888" strokeWidth={7} strokeLinejoin="round" />
        <path d="M1100 100 L1180 170 L1250 260 L1330 240 L1400 330" fill="none" stroke="#fff" strokeWidth={2} opacity=".5" strokeDasharray="4 7" />
      </Par>
      <Par d={1.15}>
        {/* a real hand: sleeve, wrist, thumb and four fingers gripping the torn corner */}
        <g transform="translate(1560 300) rotate(118) scale(1.9)"><rect x={-44} y={-230} width={88} height={240} fill="#3a4a3a" /><rect x={-44} y={-230} width={88} height={240} fill="url(#sideShade)" /><rect x={-48} y={-14} width={96} height={24} fill="#2a3a2a" /><HandArt kind="relaxed" skin="#e0a880" /></g>
        <g transform="translate(1290 160) rotate(20)"><polygon points="0,0 150,20 120,140 -10,110" fill="#e8dcb8" /><path d="M20 30 H120 M20 60 H110" stroke="#8a1a1a" strokeWidth={5} opacity=".6" /></g>
        {Array.from({length: 7}, (_, i) => <polygon key={i} points={`0,0 ${10 + q() * 16},${q() * 8} ${q() * 12},${12 + q() * 10}`} fill="#e8dcb8" transform={`translate(${1180 + q() * 380} ${380 + q() * 420}) rotate(${q() * 360})`} />)}
      </Par>
    </Frame>
  );
};

export const S1: Record<string, React.FC> = {
  '1.1': S1_1, '1.2': S1_2, '1.3': S1_3, '1.4': S1_4, '1.5': S1_5, '1.6': S1_6, '1.7': S1_7, '1.8': S1_8, '1.9': S1_9, '1.10': S1_10, '1.11': S1_11, '1.12': S1_12,
};
