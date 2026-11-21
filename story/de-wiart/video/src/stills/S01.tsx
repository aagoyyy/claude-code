import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Character, place} from '../rig/Character';
import {attach, reach} from '../rig/pose';
import {AnimalArt} from '../rig/Animals';
import {idlePose, runPose, walkPose} from '../rig/Side';
import {H, mix, mulberry32, W} from '../world/util';
import {Cobbles, civ, Fig, Fog, Frame, Glow, GroundDefs, Grad, House, HouseDefs, khaki, kid, man, SkyRect, Sil, Stars, Title} from './lib';
import {heroOld} from '../scenes/HeroSide';
import {heroYoung} from '../scenes/BoerA';

/* ----------------------------- CHAPTER 0 : opening ----------------------------- */
const warfield = (extra?: React.ReactNode) => (
  <>
    <SkyRect id="w0" stops={[[0, '#0b1220'], [0.45, '#27324a'], [0.75, '#6a5a58'], [1, '#b08a5e']]} h={780} />
    <Stars n={60} seed={3} ymax={380} />
    <Glow id="wg" x={1450} y={730} r={520} c="#ff9a4a" o={0.75} />
    <Sil seed={4} base={730} amp={60} fill="#2b3346" o={0.85} />
    <Fog id="wf1" y={600} h={260} c="#8a8f9c" o={0.4} />
    <Sil seed={9} base={800} amp={44} fill="#1b2030" />
    <Fog id="wf2" y={740} h={200} c="#7d8290" o={0.45} />
    {[260, 470, 700, 1290, 1540, 1760].map((x, i) => <g key={i} stroke="#10131c" strokeWidth={5}><line x1={x} y1={830} x2={x} y2={760 - (i % 2) * 10} /><line x1={x - 36} y1={790} x2={x + 36} y2={800} strokeWidth={2.5} /></g>)}
    <rect y={850} width={W} height={H - 850} fill="#14161f" />
    <rect y={850} width={W} height={H - 850} fill="url(#wmud)" />
    <defs><Grad id="wmud" stops={[[0, '#6a5a48', 0.5], [1, '#000', 0.8]]} /></defs>
    {extra}
  </>
);
const S0_1: React.FC = () => (
  <Frame night grade="contrast(1.12) saturate(.75)">
    {warfield()}
    <Fig id="h1" x={900} y={960} s={0.58} o={heroOld('right', {head: 'cap'})} p={walkPose(1.2, 0.9)} light="night" lit={0.35} />
    <Fog id="wf3" y={880} h={200} c="#8f94a2" o={0.35} />
  </Frame>
);
const S0_2: React.FC = () => (
  <Frame night grade="contrast(1.15) saturate(.7)">
    <SkyRect id="m2" stops={[[0, '#1a2030'], [1, '#6a5a48']]} />
    <defs><Grad id="mud2" stops={[[0, '#4a3a2c'], [1, '#18110c']]} /><radialGradient id="pud2"><stop offset="0" stopColor="#a8b4c8" stopOpacity=".7" /><stop offset="1" stopColor="#a8b4c8" stopOpacity="0" /></radialGradient></defs>
    <rect y={560} width={W} height={H - 560} fill="url(#mud2)" />
    {[[380, 880, 260], [1380, 960, 330], [820, 1010, 220]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.16} fill="url(#pud2)" />)}
    <Fig id="b1" x={900} y={1000} s={2.5} o={heroOld('right', {head: 'cap'})} p={walkPose(1.9, 1.0)} light="night" lit={0.5} />
    <Fog id="bf" y={600} h={260} c="#8a8f9c" o={0.25} />
  </Frame>
);

const cuBg = (id: string, c1 = '#241a14', c2 = '#7a6246') => (
  <>
    <defs><radialGradient id={id} cx=".5" cy=".42" r=".75"><stop offset="0" stopColor={c2} /><stop offset="1" stopColor={c1} /></radialGradient></defs>
    <rect width={W} height={H} fill={`url(#${id})`} />
  </>
);
const S0_3: React.FC = () => (
  <Frame night grade="contrast(1.1) saturate(.85)" over={
    <Character pose={{head: 2, blink: 1, yaw: 12, mouth: 0}} variant={{patch: true, scars: true, young: false}} cam={{x: 0, y: 0, zoom: 4.2, px: 797, py: 330}} light={{key: '#ffd9a0', rim: '#ffcf98'}} />
  }>
    {cuBg('c3', '#0f0b09', '#6a4a30')}
    <Fog id="c3f" y={0} h={H} c="#8a8f9c" o={0.12} />
  </Frame>
);
const stumpPose = () => { const R = reach('R', 590, 842); return {armR: R.ua, foreR: R.fore, yaw: 0, head: 3}; };
const S0_4: React.FC = () => {
  const p = stumpPose();
  const [hx, hy] = attach('foreR', 700, 1070, p), [sx, sy] = place(hx, hy);
  return (
    <Frame night grade="contrast(1.1) saturate(.85)" over={<Character pose={p} variant={{patch: true, scars: true, stump: true, bandages: true}} cam={{x: 0, y: 0, zoom: 3.6, px: sx, py: sy}} />}>
      {cuBg('c4', '#0f0b09', '#5a3f2a')}
    </Frame>
  );
};
const S0_5: React.FC = () => (
  <Frame night grade="contrast(1.12) saturate(.75)">
    {warfield(
      <>
        {/* crashed plane: broken wing and tail fin */}
        <g fill="#0e1018" stroke="#0e1018">
          <polygon points="260,830 520,770 760,790 800,830 560,846" />
          <polygon points="470,770 428,640 456,636 560,764" />
          <polygon points="640,792 960,730 990,744 780,820" />
          <circle cx={300} cy={846} r={30} fill="#1a1c24" />
        </g>
        <g fill="#0e1018"><circle cx={1340} cy={860} r={58} /><rect x={1340} y={820} width={190} height={14} transform="rotate(-18 1340 827)" /><rect x={1330} y={800} width={56} height={60} /></g>
      </>,
    )}
    <Fig id="h5" x={1000} y={985} s={0.5} o={heroOld('right', {head: 'cap'})} p={walkPose(0.5, 0.8)} light="night" lit={0.35} />
    <Fog id="wf4" y={880} h={180} c="#8f94a2" o={0.3} />
  </Frame>
);
const RefFlash: React.FC<{src: string; tint: string; label: string}> = ({src, tint, label}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Img src={staticFile(`ref/${src}.png`)} style={{width: W, height: H, filter: 'contrast(1.25) saturate(.8) brightness(.95)'}} />
    <AbsoluteFill style={{background: tint, mixBlendMode: 'multiply' as any}} />
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
      <rect y={0} width={W} height={110} fill="#000" /><rect y={H - 110} width={W} height={110} fill="#000" />
      <Title x={96} y={76} text={label} size={44} c="#f6e8c8" />
    </svg>
  </AbsoluteFill>
);
const S0_6: React.FC = () => <RefFlash src="boer" tint="#c8a868" label="1899 · AFRIKA SELATAN" />;
const S0_7: React.FC = () => <RefFlash src="ypres" tint="#98a4b0" label="1915 · YPRES" />;
const S0_8: React.FC = () => <RefFlash src="ww2" tint="#7890b8" label="1941 · LIBYA" />;
const S0_9: React.FC = () => (
  <Frame grade="contrast(1.05)">
    <rect width={W} height={H} fill="#0b0806" />
    <defs><radialGradient id="tg" cx=".5" cy=".5" r=".6"><stop offset="0" stopColor="#3a2a1c" /><stop offset="1" stopColor="#0b0806" /></radialGradient></defs>
    <rect width={W} height={H} fill="url(#tg)" />
    <Title x={W / 2} y={500} text="ADRIAN" size={150} anchor="middle" ls={26} c="#f6e8c8" />
    <Title x={W / 2} y={640} text="CARTON DE WIART" size={96} anchor="middle" ls={14} c="#f6e8c8" />
    <line x1={420} y1={780} x2={1500} y2={440} stroke="#b01818" strokeWidth={7} strokeLinecap="round" />
    <Title x={W / 2} y={760} text="prajurit yang tak bisa dibunuh" size={44} anchor="middle" ls={4} serif italic weight={400} c="#d9c7a0" />
    <rect x={560} y={820} width={800} height={3} fill="#e0b86a" />
  </Frame>
);

/* ----------------------------- CHAPTER 1 : childhood ----------------------------- */
const gable = (x: number, y: number, w: number, h: number, wall: string, seed: number, lit = 0.35) => {
  const r = mulberry32(seed), steps = 4, sw = w / (steps * 2);
  let pts = `${x},${y} ${x},${y - h}`;
  for (let i = 0; i < steps; i++) pts += ` ${x + i * sw},${y - h - i * 26 - 26} ${x + (i + 1) * sw},${y - h - i * 26 - 26} ${x + (i + 1) * sw},${y - h - (i + 1) * 26}`;
  pts = `${x},${y} ${x},${y - h}`;
  for (let i = 0; i < steps; i++) pts += ` ${x + i * sw},${y - h - i * 30} ${x + i * sw + 4},${y - h - i * 30 - 30}`;
  const mid = x + w / 2;
  pts = `${x},${y} ${x},${y - h} ${x + w * 0.12},${y - h - 28} ${x + w * 0.2},${y - h - 28} ${x + w * 0.28},${y - h - 56} ${x + w * 0.36},${y - h - 56} ${mid},${y - h - 96} ${x + w * 0.64},${y - h - 56} ${x + w * 0.72},${y - h - 56} ${x + w * 0.8},${y - h - 28} ${x + w * 0.88},${y - h - 28} ${x + w},${y - h} ${x + w},${y}`;
  return (
    <g key={seed}>
      <polygon points={pts} fill={wall} />
      <polygon points={pts} fill="url(#houseShade)" />
      {Array.from({length: 3}).map((_, ri) => Array.from({length: 3}).map((_, ci) => {
        const on = r() < lit, wx = x + w * 0.14 + ci * w * 0.28, wy = y - h + 16 + ri * (h / 3.2);
        return <g key={`${ri}${ci}`}><rect x={wx} y={wy} width={w * 0.14} height={h / 5.2} fill={on ? '#ffd48a' : '#2a3448'} />{on && <rect x={wx} y={wy} width={w * 0.14} height={h / 5.2} fill="#ffb050" opacity=".4" />}</g>;
      }))}
    </g>
  );
};
const S1_1: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.1)">
    <HouseDefs />
    <SkyRect id="b1" stops={[[0, '#2c3560'], [0.4, '#7a5a82'], [0.7, '#e28a60'], [1, '#ffcf8a']]} h={760} />
    <Glow id="b1g" x={520} y={640} r={460} c="#ffdca0" o={0.8} />
    {/* cathedral spire */}
    <g fill="#4a4064" opacity=".85"><polygon points="1480,700 1490,300 1500,700" /><rect x={1440} y={420} width={100} height={300} /><polygon points="1440,420 1490,250 1540,420" /><rect x={1380} y={520} width={60} height={200} /><rect x={1540} y={520} width={60} height={200} /></g>
    <Sil seed={14} base={720} amp={30} fill="#59487a" o={0.6} />
    <Fog id="b1f" y={560} h={220} c="#ffb98a" o={0.35} />
    {[0, 1, 2, 3, 4, 5].map((i) => gable(60 + i * 310, 820 - (i % 2) * 24, 270, 190 + (i % 3) * 36, ['#7a5a4c', '#8a6a52', '#6a4e48'][i % 3], 20 + i))}
    {/* chimney smoke */}
    {[400, 1040, 1620].map((x, i) => <g key={i}><rect x={x} y={560 - i * 20} width={36} height={80} fill="#3a2a30" /><ellipse cx={x + 20} cy={520 - i * 20} rx={46} ry={22} fill="#ffe0c0" opacity=".25" /><ellipse cx={x + 50} cy={470 - i * 20} rx={64} ry={26} fill="#ffe0c0" opacity=".16" /></g>)}
    <rect y={850} width={W} height={H - 850} fill="#2a2030" />
    <rect y={850} width={W} height={H - 850} fill="url(#groundDark)" /><GroundDefs />
    <Fig id="s11" x={1000} y={1060} s={0.25} o={man('right', '#3a2a30', '#2a1a20', {head: 'flatcap'})} p={walkPose(1.5, 0.8)} lit={0.6} lo />
  </Frame>
);
const S1_2: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(1.05)">
    <HouseDefs /><GroundDefs />
    <SkyRect id="b2" stops={[[0, '#6a7ca6'], [0.6, '#c89a84'], [1, '#f2c490']]} h={600} />
    <House x={-60} y={800} w={560} h={560} wall="#8a6a52" roof="#4a3a40" rows={4} cols={3} lit={0.4} seed={3} />
    <House x={1420} y={800} w={600} h={600} wall="#7a5a4a" roof="#4a3a40" rows={4} cols={3} lit={0.35} seed={7} />
    <House x={520} y={760} w={420} h={400} wall="#a08060" roof="#5a4048" rows={3} cols={3} lit={0.3} seed={11} />
    <Cobbles y={800} base="#6a5a54" seed={5} />
    {/* lamp posts */}
    {[560, 1360].map((x, i) => <g key={i}><rect x={x} y={460} width={9} height={340} fill="#1c1418" /><rect x={x - 14} y={444} width={38} height={26} rx={5} fill="#ffd48a" /><Glow id={`lp${i}`} x={x + 5} y={456} r={110} c="#ffcf8a" o={0.6} /></g>)}
    {/* carriage */}
    <g transform="translate(1100 900)">
      <rect x={20} y={-200} width={300} height={150} rx={20} fill="#2a1a1c" /><rect x={40} y={-176} width={110} height={90} rx={8} fill="#c8b890" opacity=".7" /><rect x={170} y={-176} width={110} height={90} rx={8} fill="#c8b890" opacity=".7" />
      <rect x={0} y={-60} width={340} height={20} fill="#1a1012" />
      {[70, 270].map((cx) => <g key={cx}><circle cx={cx} cy={-20} r={62} fill="none" stroke="#1a1012" strokeWidth={12} /><circle cx={cx} cy={-20} r={8} fill="#1a1012" />{[0, 45, 90, 135].map((a) => <line key={a} x1={cx} y1={-20} x2={cx + 62 * Math.cos((a * Math.PI) / 180)} y2={-20 + 62 * Math.sin((a * Math.PI) / 180)} stroke="#1a1012" strokeWidth={4} />)}</g>)}
    </g>
    <Fig id="hz" x={900} y={930} s={0.44} o={{pal: khaki}} p={{}} art={<AnimalArt o={{kind: 'horse', coat: '#5a3a22', mane: '#1e140c', face: 'left', tack: true}} p={{phase: 0.4}} />} />
    <Fog id="b2f" y={620} h={240} c="#ffd8b0" o={0.25} />
    <Fig id="s12" x={330} y={960} s={0.42} o={man('right', '#4a3a50', '#2a2030', {head: 'flatcap'})} p={walkPose(2.2, 0.9)} />
  </Frame>
);
const S1_3: React.FC = () => (
  <Frame night grade="contrast(1.08) saturate(.95)">
    <rect width={W} height={H} fill="#1a1218" />
    {/* window with dusk view */}
    <defs><Grad id="wnd" stops={[[0, '#3a4a7a'], [0.6, '#b8789a'], [1, '#ffbf8a']]} /></defs>
    <path d="M1000 180 L1000 960 L1700 960 L1700 180 Q1350 40 1000 180 Z" fill="url(#wnd)" />
    <g fill="#241a2a" opacity=".85"><polygon points="1000,760 1120,640 1200,700 1320,600 1440,720 1560,660 1700,760 1700,960 1000,960" /></g>
    {[0, 1, 2, 3].map((i) => <rect key={i} x={1030 + i * 60} y={640 - i * 12} width={22} height={34} fill="#ffd48a" opacity=".8" />)}
    <path d="M1000 180 L1000 960 L1700 960 L1700 180 Q1350 40 1000 180 Z" fill="none" stroke="#3a2a22" strokeWidth={26} />
    <line x1={1350} y1={90} x2={1350} y2={960} stroke="#3a2a22" strokeWidth={14} /><line x1={1000} y1={560} x2={1700} y2={560} stroke="#3a2a22" strokeWidth={14} />
    {Array.from({length: 46}, (_, i) => { const r = mulberry32(i + 9); const x = 1010 + r() * 680, y = 200 + r() * 700; return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 46} stroke="#cfe0ff" strokeWidth={2} opacity=".35" />; })}
    <path d="M820 120 Q900 400 860 1000 L1000 1000 L1000 120 Z" fill="#6a2a3a" /><path d="M820 120 Q900 400 860 1000" fill="none" stroke="#3a1420" strokeWidth={6} />
    <rect y={960} width={W} height={120} fill="#2a1a14" />
    <Fig id="c3k" x={640} y={1640} s={1.9} o={kid('right')} p={idlePose(0.4)} light="indoor" lit={0.8} />
    <Glow id="c3g" x={1300} y={500} r={620} c="#ffbf8a" o={0.28} />
  </Frame>
);

const palm = (x: number, y: number, h: number, k = 1) => (
  <g key={x} transform={`translate(${x} ${y}) scale(${k})`}>
    <path d={`M0 0 Q${h * 0.1} ${-h * 0.5} ${h * 0.04} ${-h}`} fill="none" stroke="#3a2a1c" strokeWidth={h * 0.045} strokeLinecap="round" />
    {[-70, -40, -10, 20, 50, 80].map((a, i) => <path key={i} d={`M${h * 0.04} ${-h} q${Math.sin((a * Math.PI) / 180) * h * 0.4} ${-h * 0.2 + Math.abs(a) * 0.6} ${Math.sin((a * Math.PI) / 180) * h * 0.55} ${h * 0.14 + Math.abs(a) * 0.5}`} fill="none" stroke="#2c4a2a" strokeWidth={h * 0.03} strokeLinecap="round" />)}
  </g>
);
const pyramid = (x: number, y: number, w: number, h: number, c: string) => (
  <g><polygon points={`${x - w / 2},${y} ${x},${y - h} ${x + w / 2},${y}`} fill={c} /><polygon points={`${x},${y - h} ${x + w / 2},${y} ${x + 6},${y}`} fill="#000" opacity=".25" /></g>
);
const kairoSky = (id: string) => <SkyRect id={id} stops={[[0, '#8fb0d8'], [0.5, '#f2d6b0'], [1, '#ffe2b0']]} h={700} />;
const S1_4: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.1)">
    <HouseDefs /><GroundDefs />
    {kairoSky('k4')}
    <Glow id="k4s" x={1450} y={300} r={340} c="#fff2d0" o={0.9} />
    {pyramid(560, 700, 520, 330, '#d8b484')}{pyramid(960, 700, 360, 230, '#cfa878')}
    <Fog id="k4f" y={560} h={200} c="#fff0d0" o={0.5} />
    {[0, 1, 2, 3, 4].map((i) => <House key={i} x={40 + i * 400} y={860 - (i % 2) * 30} w={320} h={210 + (i % 3) * 40} wall={['#d8b890', '#c9a47c', '#dcc09a'][i % 3]} roof="#a8845c" rows={2} cols={3} lit={0.1} seed={30 + i} roofH={14} />)}
    {[330, 1180, 1650].map((x, i) => <g key={i}><rect x={x} y={420 - i * 20} width={36} height={300} fill="#e4d0aa" /><polygon points={`${x - 8},${420 - i * 20} ${x + 18},${360 - i * 20} ${x + 44},${420 - i * 20}`} fill="#7a9a8a" /><rect x={x - 6} y={500 - i * 20} width={48} height={12} fill="#c9a47c" /></g>)}
    {palm(120, 900, 360, 1)}{palm(1830, 900, 420, 1)}{palm(1000, 880, 260, 0.9)}
    <rect y={880} width={W} height={H - 880} fill="#d4b280" /><rect y={880} width={W} height={H - 880} fill="url(#groundDark)" />
    <Fig id="k4a" x={700} y={1020} s={0.4} o={man('right', '#e8dcc0', '#cdbd98', {head: 'turban'})} p={walkPose(1.1, 0.8)} lo />
    <Fig id="k4b" x={1300} y={1040} s={0.46} o={{pal: khaki, head: 'none', build: 0.9, face: 'left'}} p={{}} art={<AnimalArt o={{kind: 'camel', coat: '#b88a58', mane: '#6a4a2a', face: 'left'}} p={{phase: 0}} />} />
  </Frame>
);
const awning = (x: number, y: number, w: number, c1: string, c2: string) => (
  <g key={x}>
    {Array.from({length: 8}).map((_, i) => <polygon key={i} points={`${x + i * (w / 8)},${y} ${x + (i + 1) * (w / 8)},${y} ${x + (i + 1) * (w / 8) + 8},${y + 64} ${x + i * (w / 8) + 8},${y + 64}`} fill={i % 2 ? c1 : c2} />)}
    <rect x={x + 8} y={y + 64} width={w} height={220} fill="#3a2a1c" opacity=".55" />
    {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={x + 70 + i * (w / 4.4)} cy={y + 270} rx={46} ry={16} fill={['#c8402c', '#e0a030', '#6a8a3a', '#a86a2c'][i]} />)}
  </g>
);
const S1_5: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.15)">
    <GroundDefs /><HouseDefs />
    {kairoSky('k5')}
    <Fog id="k5f" y={430} h={200} c="#fff0d0" o={0.4} />
    {[40, 560, 1120, 1560].map((x, i) => awning(x, 470, 420, ['#c8402c', '#2c6a8a', '#e0a030', '#6a8a3a'][i], '#f2e4c0'))}
    <rect y={800} width={W} height={H - 800} fill="#d8b684" /><rect y={800} width={W} height={H - 800} fill="url(#groundDark)" />
    <Fig id="k5a" x={380} y={880} s={0.45} o={man('right', '#e8dcc0', '#cdbd98', {head: 'turban', beard: true})} p={idlePose(0.2)} />
    <Fig id="k5b" x={1400} y={880} s={0.45} o={man('left', '#8a6a4a', '#5a4a3a', {head: 'turban'})} p={idlePose(1.2)} />
    <Fig id="k5c" x={1750} y={900} s={0.5} o={man('left', '#b84a3a', '#6a3a2c', {head: 'scarf', outfit: 'skirt', hairStyle: 'long'})} p={idlePose(2.2)} />
    <Fig id="k5k" x={900} y={990} s={0.62} o={kid('right', '#c85a3a')} p={runPose(2.3)} />
    <g opacity=".4">{[0, 1, 2].map((i) => <line key={i} x1={640 - i * 50} y1={940 + i * 12} x2={540 - i * 70} y2={940 + i * 12} stroke="#fff0d0" strokeWidth={5} strokeLinecap="round" />)}</g>
  </Frame>
);
const S1_6: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.1)">
    <SkyRect id="k6" stops={[[0, '#6a8ab8'], [0.55, '#f0c898'], [1, '#ffd89a']]} h={800} />
    <Glow id="k6s" x={1500} y={420} r={420} c="#fff2d0" o={0.9} />
    {pyramid(1250, 880, 1500, 820, '#d8aa78')}
    <Fog id="k6f" y={640} h={220} c="#ffe8c0" o={0.4} />
    <rect y={870} width={W} height={H - 870} fill="#d2ae7c" />
    <Fig id="k6k" x={560} y={1520} s={1.8} o={kid('right', '#c85a3a')} p={idlePose(0.9)} />
  </Frame>
);
const S1_7: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(.95)">
    <HouseDefs />
    <SkyRect id="s7" stops={[[0, '#8a9cb8'], [0.6, '#c8d0d8'], [1, '#e8e4d8']]} h={700} />
    <Sil seed={51} base={700} amp={40} fill="#7a8a78" o={0.6} />
    {/* school: wings + central tower */}
    <House x={120} y={820} w={560} h={250} wall="#8a4a3a" roof="#3a3a48" rows={2} cols={5} lit={0.5} seed={61} roofH={90} />
    <House x={1240} y={820} w={560} h={250} wall="#8a4a3a" roof="#3a3a48" rows={2} cols={5} lit={0.4} seed={62} roofH={90} />
    <rect x={760} y={330} width={400} height={490} fill="#964e3e" /><rect x={760} y={330} width={400} height={490} fill="url(#houseShade)" />
    <polygon points="740,330 960,100 1180,330" fill="#32323e" /><rect x={940} y={40} width={8} height={70} fill="#222" />
    <rect x={900} y={430} width={120} height={200} rx={60} fill="#2a3448" /><rect x={900} y={430} width={120} height={200} rx={60} fill="#ffd48a" opacity=".28" />
    <rect x={870} y={690} width={180} height={130} fill="#2a1a10" /><path d="M870 690 Q960 620 1050 690 Z" fill="#3a2a1c" />
    <circle cx={960} cy={350} r={42} fill="#e8e0c8" /><line x1={960} y1={350} x2={960} y2={320} stroke="#222" strokeWidth={4} /><line x1={960} y1={350} x2={982} y2={356} stroke="#222" strokeWidth={4} />
    <rect y={820} width={W} height={H - 820} fill="#5a7a46" /><rect y={820} width={W} height={H - 820} fill="url(#lawn)" />
    <defs><Grad id="lawn" stops={[[0, '#fff', 0.08], [1, '#000', 0.5]]} /></defs>
    <polygon points="900,830 1020,830 1200,1080 720,1080" fill="#b8a888" opacity=".85" />
    {[220, 1700].map((x, i) => <g key={i}><rect x={x - 12} y={760} width={24} height={110} fill="#3a2a1c" /><ellipse cx={x} cy={710} rx={120} ry={110} fill="#3e5a34" /><ellipse cx={x - 20} cy={690} rx={80} ry={70} fill="#4e6e42" /></g>)}
    <Fig id="s7a" x={560} y={1000} s={0.36} o={kid('right', '#2a3a5a')} p={walkPose(0.7, 0.8)} lo />
    <Fig id="s7b" x={680} y={1010} s={0.36} o={kid('right', '#2a3a5a')} p={walkPose(1.9, 0.8)} lo />
    <Fog id="s7f" y={780} h={140} c="#e8ecf0" o={0.3} />
  </Frame>
);
const S1_8: React.FC = () => (
  <Frame grade="contrast(1.07) saturate(1.1)">
    <SkyRect id="r8" stops={[[0, '#8aa4c8'], [0.6, '#d8d4c4'], [1, '#efe6cc']]} h={600} />
    <Sil seed={71} base={600} amp={30} fill="#6a8a62" o={0.7} />
    <rect y={620} width={W} height={H - 620} fill="#5a8a48" />
    {Array.from({length: 11}).map((_, i) => <rect key={i} x={i * 180} y={620} width={90} height={H - 620} fill="#fff" opacity=".035" />)}
    <rect y={620} width={W} height={H - 620} fill="url(#lawn)" /><defs><Grad id="lawn" stops={[[0, '#fff', 0.06], [1, '#000', 0.45]]} /></defs>
    <g stroke="#f4efe0" strokeWidth={10}><line x1={1530} y1={640} x2={1530} y2={420} /><line x1={1630} y1={640} x2={1630} y2={420} /><line x1={1530} y1={560} x2={1630} y2={560} strokeWidth={8} /></g>
    {[330, 520, 720].map((x, i) => <Fig key={i} id={`r8o${i}`} x={x} y={880 + i * 4} s={0.42} o={man('right', ['#1a3a8a', '#8a1a2a', '#1a3a8a'][i], '#e8e0d0', {pal: civ(['#1a3a8a', '#8a1a2a', '#1a3a8a'][i], '#e8e0d0', '#5a3a22'), build: 1.05})} p={runPose(0.5 + i * 1.9)} />)}
    <Fig id="r8h" x={1000} y={950} s={0.56} o={{...heroYoung('right'), head: 'none'}} p={runPose(2.7)} />
    <g transform="translate(1140 700) rotate(-20)"><ellipse rx={32} ry={20} fill="#8a4a2a" /><ellipse rx={32} ry={20} fill="none" stroke="#2a1a10" strokeWidth={3} /><line x1={-14} y1={0} x2={14} y2={0} stroke="#e8dcc0" strokeWidth={3} /></g>
    <g opacity=".35">{[0, 1, 2].map((i) => <line key={i} x1={720 - i * 60} y1={820 + i * 26} x2={560 - i * 90} y2={820 + i * 26} stroke="#fff" strokeWidth={5} strokeLinecap="round" />)}</g>
  </Frame>
);
const S1_9: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(1.1)">
    <SkyRect id="r9" stops={[[0, '#7a9ac4'], [1, '#cfd8c8']]} h={620} />
    <rect y={600} width={W} height={H - 600} fill="#4e7a3e" /><rect y={600} width={W} height={H - 600} fill="url(#lawn9)" />
    <defs><Grad id="lawn9" stops={[[0, '#fff', 0.1], [1, '#000', 0.6]]} /></defs>
    <Fig id="r9" x={560} y={1500} s={1.6} o={{...heroYoung('right'), head: 'none'}} p={{...walkPose(0.2, 1), thN: 38, shN: 12, ftN: -10, thF: -14, shF: 16}} />
    <g transform="translate(1180 560) rotate(-30)"><ellipse rx={150} ry={92} fill="#8a4a2a" /><ellipse rx={150} ry={92} fill="url(#ballsh)" /><ellipse rx={150} ry={92} fill="none" stroke="#2a1a10" strokeWidth={8} /><line x1={-66} y1={0} x2={66} y2={0} stroke="#e8dcc0" strokeWidth={9} />{[-40, -14, 14, 40].map((x) => <line key={x} x1={x} y1={-16} x2={x} y2={16} stroke="#e8dcc0" strokeWidth={6} />)}</g>
    <defs><radialGradient id="ballsh" cx=".3" cy=".3" r=".8"><stop offset="0" stopColor="#fff" stopOpacity=".28" /><stop offset="1" stopColor="#000" stopOpacity=".5" /></radialGradient></defs>
    {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={1020 - i * 40} y1={600 + i * 38} x2={760 - i * 90} y2={650 + i * 44} stroke="#fff" strokeWidth={6} opacity=".28" strokeLinecap="round" />)}
    {Array.from({length: 18}, (_, i) => { const r = mulberry32(i + 70); return <path key={i} d={`M${700 + r() * 500} ${760 + r() * 220} q4 -${24 + r() * 30} 14 -${40 + r() * 30}`} stroke="#6a9a52" strokeWidth={5} fill="none" strokeLinecap="round" />; })}
  </Frame>
);
const S1_10: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(.95)">
    <HouseDefs />
    <rect width={W} height={H} fill="#2a2018" />
    {/* hall: arched windows with light */}
    {[0, 1, 2, 3].map((i) => <g key={i}><path d={`M${210 + i * 450} 560 L${210 + i * 450} 160 Q${300 + i * 450} 60 ${390 + i * 450} 160 L${390 + i * 450} 560 Z`} fill="#c8d8f0" opacity=".9" /><path d={`M${210 + i * 450} 560 L${210 + i * 450} 160 Q${300 + i * 450} 60 ${390 + i * 450} 160 L${390 + i * 450} 560 Z`} fill="none" stroke="#1a1410" strokeWidth={12} /><line x1={300 + i * 450} y1={90} x2={300 + i * 450} y2={560} stroke="#1a1410" strokeWidth={6} /></g>)}
    {[0, 1, 2, 3].map((i) => <polygon key={i} points={`${210 + i * 450},560 ${390 + i * 450},560 ${520 + i * 450},1000 ${40 + i * 450},1000`} fill="#fff6d8" opacity=".13" />)}
    <rect y={560} width={W} height={H - 560} fill="#5a3a24" /><rect y={560} width={W} height={H - 560} fill="url(#hallf)" />
    <defs><Grad id="hallf" stops={[[0, '#000', 0.4], [1, '#000', 0.1]]} /></defs>
    {/* lectern + lecturer */}
    <Fig id="l10" x={430} y={860} s={0.5} o={man('right', '#15121a', '#15121a', {pal: civ('#15121a', '#15121a', '#c9c9c4'), beard: true, head: 'none'})} p={idlePose(0.3)} />
    <rect x={540} y={700} width={110} height={160} fill="#3a2414" /><rect x={520} y={690} width={150} height={20} fill="#4a2e1a" />
    {/* students at desks */}
    {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => {
      const x = 900 + c * 250 - r * 60, y = 800 + r * 110;
      return <g key={`${r}${c}`}>
        <Fig id={`st${r}${c}`} x={x} y={y - 18} s={0.34 + r * 0.04} o={man('left', ['#3a3a4a', '#2a3a3a', '#4a3a3a'][(r + c) % 3], '#2a2a30', {pal: civ(['#3a3a4a', '#2a3a3a', '#4a3a3a'][(r + c) % 3], '#2a2a30', '#4a3020')})} p={idlePose(r + c)} lo />
        <rect x={x - 100} y={y - 50} width={200} height={26} fill="#6a4228" /><rect x={x - 100} y={y - 24} width={200} height={90} fill="#4a2e1a" />
      </g>;
    }))}
    {/* Adrian at the back, chin on hand */}
    <Fig id="a10" x={1750} y={820} s={0.46} o={{...heroYoung('left'), head: 'none'}} p={{...idlePose(0.5), uaN: -64, faN: -128, head: 8, torso: 5}} />
    <rect x={1640} y={640} width={210} height={26} fill="#6a4228" /><rect x={1640} y={666} width={210} height={170} fill="#4a2e1a" />
  </Frame>
);
const S1_11: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.05)">
    <rect width={W} height={H} fill="#241a12" />
    <path d="M980 140 L980 980 L1760 980 L1760 140 Q1370 20 980 140 Z" fill="#a8d0f0" />
    <defs><Grad id="q11" stops={[[0, '#cfe4ff'], [0.55, '#e8f0d8'], [1, '#9ac07a']]} /></defs>
    <path d="M980 140 L980 980 L1760 980 L1760 140 Q1370 20 980 140 Z" fill="url(#q11)" />
    <g fill="#8a8a7a" opacity=".7"><rect x={1060} y={520} width={220} height={230} /><polygon points="1050,520 1170,440 1290,520" /><rect x={1420} y={560} width={260} height={200} /></g>
    <ellipse cx={1370} cy={800} rx={420} ry={90} fill="#6a9a50" opacity=".9" />
    <path d="M980 140 L980 980 L1760 980 L1760 140 Q1370 20 980 140 Z" fill="none" stroke="#1c140e" strokeWidth={30} /><line x1={1370} y1={70} x2={1370} y2={980} stroke="#1c140e" strokeWidth={16} />
    <polygon points="980,980 1760,980 1360,1080 700,1080" fill="#fff6d8" opacity=".09" />
    <Fig id="a11" x={600} y={2460} s={1.7} o={{...heroYoung('right'), head: 'none'}} p={{...idlePose(0.7), head: 12, torso: 6, uaN: -50, faN: -110}} light="indoor" lit={0.9} />
    <Glow id="a11g" x={1370} y={420} r={640} c="#fff2d0" o={0.25} />
  </Frame>
);
const S1_12: React.FC = () => (
  <Frame grade="contrast(1.12) saturate(.95)">
    <rect width={W} height={H} fill="#5a3a30" />
    {Array.from({length: 14}).map((_, r) => Array.from({length: 12}).map((_, c) => <rect key={`${r}${c}`} x={c * 170 - (r % 2) * 85} y={r * 82} width={162} height={74} fill={mix('#7a4a3a', r % 3 ? '#000' : '#fff', 0.1 + ((r * 7 + c * 3) % 5) * 0.03)} />))}
    <polygon points="540,120 1380,100 1400,980 520,960" fill="#e8dcb8" /><polygon points="540,120 1380,100 1400,980 520,960" fill="url(#ppr)" />
    <defs><radialGradient id="ppr" cx=".5" cy=".4" r=".8"><stop offset="0" stopColor="#fff" stopOpacity=".1" /><stop offset="1" stopColor="#5a3a20" stopOpacity=".35" /></radialGradient></defs>
    <Title x={900} y={270} text="BANGSA" size={104} anchor="middle" c="#8a1a1a" ls={12} />
    <Title x={940} y={360} text="MEMANGGILMU" size={70} anchor="middle" c="#8a1a1a" ls={6} />
    <rect x={620} y={400} width={680} height={5} fill="#2a1a10" />
    <Title x={960} y={470} text="PRAJURIT DICARI" size={52} anchor="middle" c="#2a1a10" ls={6} />
    <Title x={960} y={530} text="PERANG DI AFRIKA SELATAN · 1899" size={30} anchor="middle" c="#2a1a10" ls={3} weight={600} />
    <g fill="#2a1a10"><circle cx={960} cy={650} r={42} /><rect x={918} y={690} width={84} height={190} rx={20} /><rect x={1000} y={640} width={14} height={240} /></g>
    {/* the torn corner + a hand pulling */}
    <polygon points="1100,100 1380,100 1400,330 1330,240 1250,260 1180,170" fill="#5a3a30" />
    <polygon points="1100,100 1180,170 1250,260 1330,240 1400,330 1380,100" fill="#e8dcb8" opacity="0" />
    <path d="M1100 100 L1180 170 L1250 260 L1330 240 L1400 330" fill="none" stroke="#b8a888" strokeWidth={6} />
    <g transform="translate(1500 360) rotate(-30)"><path d="M0 0 q-70 -10 -150 20 l-20 -50 q10 -40 80 -30 q70 10 110 0 q40 -8 60 20 q10 30 -30 50 z" fill="#e0a880" /><path d="M-150 20 q-30 20 -10 60" stroke="#b07a58" strokeWidth={8} fill="none" /><rect x={20} y={-10} width={220} height={120} fill="#a39c66" /></g>
    <g transform="translate(1300 160) rotate(20)"><polygon points="0,0 150,20 120,140 -10,110" fill="#e8dcb8" /></g>
  </Frame>
);

export const S01: Record<string, React.FC> = {
  '0.1': S0_1, '0.2': S0_2, '0.3': S0_3, '0.4': S0_4, '0.5': S0_5, '0.6': S0_6, '0.7': S0_7, '0.8': S0_8, '0.9': S0_9,
  '1.1': S1_1, '1.2': S1_2, '1.3': S1_3, '1.4': S1_4, '1.5': S1_5, '1.6': S1_6, '1.7': S1_7, '1.8': S1_8, '1.9': S1_9, '1.10': S1_10, '1.11': S1_11, '1.12': S1_12,
};
