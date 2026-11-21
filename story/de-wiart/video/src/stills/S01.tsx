import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Character, place} from '../rig/Character';
import {attach, reach} from '../rig/pose';
import {AnimalArt} from '../rig/Animals';
import {idlePose, runPose, walkPose} from '../rig/Side';
import {H, mix, mulberry32, W} from '../world/util';
import {Par, Birds, Clouds, civ, CobbleP, Dirt, Facade, Fig, Fog, Frame, Glow, Grad, khaki, kid, man, Motes, Rays, SkyRect, Sil, Stars, Title, Tree} from './lib';
import {heroOld} from '../scenes/HeroSide';
import {heroYoung} from '../scenes/BoerA';

const young = (face: 'left' | 'right') => ({...heroYoung(face), head: 'none' as const});

/* ============================== CHAPTER 0 : opening ============================== */
const smokeCol = (x: number, base: number, h: number, w: number, c: string, o: number, k: number) => (
  <g key={k} filter="url(#blL)" opacity={o}>
    <path d={`M${x - w / 2} ${base} Q${x - w * 0.9} ${base - h * 0.4} ${x - w * 0.3} ${base - h * 0.7} Q${x + w * 0.4} ${base - h} ${x + w * 0.2} ${base - h * 1.1} Q${x + w * 1.1} ${base - h * 0.5} ${x + w / 2} ${base} Z`} fill={c} />
  </g>
);
const coil = (x: number, y: number, n: number, k: number) => (
  <g key={k} fill="none" stroke="#0c0e16" strokeWidth={2.4}>{Array.from({length: n}, (_, i) => <ellipse key={i} cx={x + i * 22} cy={y} rx={20} ry={15 + (i % 2) * 4} />)}{Array.from({length: n}, (_, i) => <path key={'b' + i} d={`M${x + i * 22 - 8} ${y - 14} l5 -6 M${x + i * 22 + 6} ${y + 14} l5 6`} />)}</g>
);
const warfield = (extra?: React.ReactNode) => {
  const q = mulberry32(12);
  return (
    <>
      <Par d={0.03}><SkyRect id="w0" stops={[[0, '#070c18'], [0.4, '#1f2a42'], [0.7, '#5a4e58'], [1, '#b08a5e']]} h={800} />
      <Stars n={80} seed={3} ymax={380} />
      <Clouds n={6} seed={9} y0={80} y1={300} c="#6a6a88" o={0.35} />
      <Glow id="wg" x={1450} y={740} r={600} c="#ff8a3a" o={0.8} />
      <Glow id="wg2" x={400} y={760} r={380} c="#ff9a4a" o={0.4} /></Par>
<Par d={0.15}>
      {[1500, 1280, 1700, 420].map((x, i) => smokeCol(x, 760, 420 - i * 50, 90 + i * 20, '#3a3440', 0.55, i))}
      <Sil seed={4} base={735} amp={60} fill="#2b3346" o={0.9} />
      <g fill="#10131c" opacity=".85">{[1000, 1060, 1120, 1170, 1240].map((x, i) => <g key={i}><circle cx={x} cy={718 - (i % 2) * 3} r={4} /><rect x={x - 4} y={722 - (i % 2) * 3} width={8} height={22} /><line x1={x + 4} y1={726} x2={x + 16} y2={708} stroke="#10131c" strokeWidth={2} /></g>)}<rect x={740} y={726} width={46} height={16} /><circle cx={750} cy={744} r={9} /><circle cx={778} cy={744} r={9} /></g>
</Par>
<Par d={0.3}>
      <Fog id="wf1" y={620} h={240} c="#8a8f9c" o={0.4} />
      <Sil seed={9} base={806} amp={44} fill="#181c28" />
      {[260, 470, 700, 1290, 1540, 1760].map((x, i) => <g key={i} stroke="#0c0e16" strokeWidth={5}><line x1={x} y1={836} x2={x} y2={756 - (i % 2) * 10} /><line x1={x - 36} y1={796} x2={x + 36} y2={806} strokeWidth={2.5} /></g>)}
      {[190, 880, 1380].map((x, i) => coil(x, 820, 9, i))}
      <g stroke="#0a0c14" strokeWidth={9} fill="none" strokeLinecap="round"><path d="M1660 840 Q1650 700 1668 600 M1664 640 Q1700 600 1740 596 M1660 700 Q1620 660 1590 656 M1668 600 Q1650 560 1664 520" /></g>
      <Birds n={6} seed={4} x0={1500} x1={1800} y0={420} y1={540} c="#0a0c14" s={0.9} />
</Par>
<Par d={0.9}>
      <rect y={850} width={W} height={H - 850} fill="#14161f" />
      <Dirt o={0.8} light={0.2}><rect y={850} width={W} height={H - 850} fill="#6a5a48" /></Dirt>
      <rect y={850} width={W} height={H - 850} fill="url(#aoV)" />
      {[[420, 930, 280], [1180, 990, 340], [1650, 920, 200]].map(([x, y, r], i) => <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 0.14} fill="#050608" /><ellipse cx={x} cy={y + 3} rx={r * 0.86} ry={r * 0.1} fill="#7a6a62" opacity=".55" /><ellipse cx={x + r * 0.2} cy={y + 2} rx={r * 0.4} ry={r * 0.05} fill="#ffb060" opacity=".5" /></g>)}
      {Array.from({length: 7}, (_, i) => <ellipse key={i} cx={1480 + i * 38 + (i % 2) * 12} cy={862 - (i % 2) * 14} rx={28} ry={13} fill={mix('#5a5238', '#000', 0.2 + (i % 3) * 0.08)} />)}
      <Motes n={50} seed={7} x0={1100} x1={1800} y0={420} y1={800} c="#ffa050" o={0.9} r={2.4} />
      <g stroke="#9fb4d8" strokeWidth={1.4} opacity=".18">{Array.from({length: 60}, (_, i) => { const x = q() * W, y = q() * H; return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 38} />; })}</g>
</Par>
      {extra}
    </>
  );
};
const wfgFore = (
  <g filter="url(#blM)" opacity=".92"><g stroke="#05060a" strokeWidth={10}><line x1={80} y1={1080} x2={86} y2={780} /><line x1={20} y1={850} x2={190} y2={870} strokeWidth={5} /></g>{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={1560 + i * 60} cy={1000} rx={34} ry={20} fill="#05060a" />)}</g>
);
const S0_1: React.FC = () => (
  <Frame night grade="contrast(1.12) saturate(.75)">
    {warfield()}
    <Fig id="h1" x={900} y={968} s={0.6} o={heroOld('right', {head: 'cap'})} p={walkPose(1.2, 0.9)} light="night" lit={0.4} />
    <Fog id="wf3" y={880} h={200} c="#8f94a2" o={0.38} />
    {wfgFore}
  </Frame>
);
const S0_2: React.FC = () => {
  const q = mulberry32(5);
  return (
    <Frame night grade="contrast(1.15) saturate(.7)">
      <SkyRect id="m2" stops={[[0, '#141a2a'], [1, '#6a5a48']]} />
      <defs><Grad id="mud2" stops={[[0, '#4a3a2c'], [1, '#14100c']]} /><radialGradient id="pud2"><stop offset="0" stopColor="#c8d4e8" stopOpacity=".75" /><stop offset="1" stopColor="#c8d4e8" stopOpacity="0" /></radialGradient></defs>
      <rect y={540} width={W} height={H - 540} fill="url(#mud2)" />
      <Dirt o={0.9} light={0.25}><rect y={540} width={W} height={H - 540} fill="#5a4a38" /></Dirt>
      {[[380, 900, 280], [1400, 980, 340], [820, 1030, 230]].map(([x, y, r], i) => <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 0.17} fill="url(#pud2)" /><ellipse cx={x} cy={y} rx={r * 0.7} ry={r * 0.09} fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth={2} /><ellipse cx={x} cy={y} rx={r * 0.45} ry={r * 0.05} fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth={2} /></g>)}
      {Array.from({length: 9}, (_, i) => <g key={i} transform={`translate(${200 + q() * 1500} ${860 + q() * 180}) rotate(${q() * 180})`}><rect width={22} height={7} rx={2} fill="#b08a40" /><rect x={20} width={6} height={7} fill="#6a5020" /></g>)}
      <path d="M100 1010 q80 -30 160 0 t160 0 t160 0" stroke="#1a1c24" strokeWidth={4} fill="none" />
      {Array.from({length: 26}, (_, i) => <circle key={i} cx={620 + q() * 800} cy={760 + q() * 220} r={2 + q() * 5} fill="#7a6650" opacity={0.5 + q() * 0.4} />)}
      <Fig id="b1" x={900} y={1000} s={2.5} o={heroOld('right', {head: 'cap'})} p={walkPose(1.9, 1.0)} light="night" lit={0.55} />
      <Fog id="bf" y={600} h={260} c="#8a8f9c" o={0.25} />
      <g filter="url(#blL)"><ellipse cx={120} cy={1060} rx={200} ry={60} fill="#050608" /><ellipse cx={1850} cy={1040} rx={160} ry={50} fill="#050608" /></g>
      <Motes n={36} seed={2} y0={300} y1={900} c="#ffcf9a" o={0.4} r={2.4} />
    </Frame>
  );
};
const cuBg = (id: string) => {
  const q = mulberry32(31);
  return (
    <>
      <defs><radialGradient id={id} cx=".5" cy=".42" r=".8"><stop offset="0" stopColor="#7a5a3c" /><stop offset=".6" stopColor="#2a1c14" /><stop offset="1" stopColor="#0a0706" /></radialGradient></defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
      <g filter="url(#blL)" opacity=".55">{Array.from({length: 16}, (_, i) => <circle key={i} cx={q() * W} cy={q() * H} r={30 + q() * 90} fill={['#ff9a4a', '#ffcf8a', '#8aa4c8'][i % 3]} opacity={0.15 + q() * 0.3} />)}</g>
      <g filter="url(#blM)" opacity=".5"><path d="M0 900 Q300 700 520 800 T1000 760 T1500 840 T1920 760 V1080 H0Z" fill="#0a0808" /></g>
      <Motes n={60} seed={11} c="#ffcf9a" o={0.55} r={3} />
    </>
  );
};
const S0_3: React.FC = () => (
  <Frame night grade="contrast(1.1) saturate(.85)" over={<Character pose={{head: 2, blink: 1, yaw: 12, mouth: 0}} variant={{patch: true, scars: true}} cam={{x: 0, y: 0, zoom: 4.2, px: 797, py: 330}} light={{key: '#ffd9a0', rim: '#ffcf98'}} />}>
    {cuBg('c3')}
  </Frame>
);
const stumpPose = () => { const R = reach('R', 590, 842); return {armR: R.ua, foreR: R.fore, yaw: 0, head: 3}; };
const S0_4: React.FC = () => {
  const p = stumpPose();
  const [hx, hy] = attach('foreR', 700, 1040, p), [sx, sy] = place(hx, hy);
  return (
    <Frame night grade="contrast(1.1) saturate(.85)" over={<Character pose={p} variant={{patch: true, scars: true, stump: true, bandages: true}} cam={{x: 0, y: 0, zoom: 3.4, px: sx - 40, py: sy - 40}} />}>
      {cuBg('c4')}
    </Frame>
  );
};
const S0_5: React.FC = () => (
  <Frame night grade="contrast(1.12) saturate(.75)">
    {warfield(
      <>
        <Glow id="pf" x={620} y={800} r={260} c="#ff7a2a" o={0.55} />
        <g fill="#0e1018" stroke="#0a0c12" strokeWidth={2}>
          <polygon points="240,836 520,770 780,790 820,836 560,852" />
          <polygon points="470,772 424,632 460,628 564,766" />
          <polygon points="650,794 980,722 1004,740 790,826" />
          <path d="M240 836 l-40 -40 l16 -4 l34 26 z M240 836 l-30 42 l16 4 l24 -30 z" />
        </g>
        <g stroke="#2a2e3c" strokeWidth={2} fill="none"><path d="M300 830 L760 800 M340 846 L700 822 M400 788 L420 846 M500 780 L520 850 M600 782 L616 852" /><path d="M700 788 l60 -20 M720 800 l70 -26 M740 810 l76 -30" /></g>
        <g><circle cx={600} cy={812} r={20} fill="#1c2438" /><circle cx={600} cy={812} r={9} fill="#7a2020" /></g>
        <path d="M820 826 q40 -20 70 20" stroke="#0a0c12" strokeWidth={10} fill="none" />
        {smokeCol(640, 790, 360, 70, '#14161e', 0.8, 90)}
        <g fill="#0e1018"><circle cx={1360} cy={866} r={64} /><circle cx={1360} cy={866} r={44} fill="none" stroke="#2a2e3c" strokeWidth={3} />{Array.from({length: 8}, (_, i) => <line key={i} x1={1360} y1={866} x2={1360 + 64 * Math.cos((i * Math.PI) / 4)} y2={866 + 64 * Math.sin((i * Math.PI) / 4)} stroke="#2a2e3c" strokeWidth={3} />)}<rect x={1360} y={822} width={220} height={16} transform="rotate(-18 1360 830)" /><polygon points="1330,790 1400,790 1410,850 1330,850" /></g>
        {Array.from({length: 14}, (_, i) => <rect key={i} x={900 + ((i * 53) % 320)} y={850 + ((i * 29) % 40)} width={12 + (i % 4) * 8} height={5} fill="#0e1018" transform={`rotate(${i * 23} ${900 + ((i * 53) % 320)} 860)`} />)}
      </>,
    )}
    <Fig id="h5" x={1020} y={992} s={0.52} o={heroOld('right', {head: 'cap'})} p={walkPose(0.5, 0.8)} light="night" lit={0.4} />
    <Fog id="wf4" y={880} h={180} c="#8f94a2" o={0.32} />
    {wfgFore}
  </Frame>
);
const RefFlash: React.FC<{src: string; tint: string; label: string}> = ({src, tint, label}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Img src={staticFile(`ref/${src}.png`)} style={{width: W, height: H, filter: 'contrast(1.25) saturate(.8) brightness(.95)'}} />
    <AbsoluteFill style={{background: tint, mixBlendMode: 'multiply' as any}} />
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
      <defs><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .8 0" /></filter><radialGradient id="vg"><stop offset=".55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".7" /></radialGradient></defs>
      <rect width={W} height={H} filter="url(#gr)" opacity=".22" /><rect width={W} height={H} fill="url(#vg)" />
      <rect y={0} width={W} height={110} fill="#000" /><rect y={H - 110} width={W} height={110} fill="#000" />
      <rect x={96} y={30} width={4} height={56} fill="#e0b86a" /><Title x={118} y={76} text={label} size={44} c="#f6e8c8" />
    </svg>
  </AbsoluteFill>
);
const S0_6: React.FC = () => <RefFlash src="boer" tint="#c8a868" label="1899 · AFRIKA SELATAN" />;
const S0_7: React.FC = () => <RefFlash src="ypres" tint="#98a4b0" label="1915 · YPRES" />;
const S0_8: React.FC = () => <RefFlash src="ww2" tint="#7890b8" label="1941 · LIBYA" />;
const S0_9: React.FC = () => {
  const q = mulberry32(8);
  return (
    <Frame grade="contrast(1.05)">
      <rect width={W} height={H} fill="#0b0806" />
      <defs><radialGradient id="tg" cx=".5" cy=".5" r=".65"><stop offset="0" stopColor="#3e2c1e" /><stop offset="1" stopColor="#0b0806" /></radialGradient></defs>
      <rect width={W} height={H} fill="url(#tg)" />
      <Dirt o={0.7} light={0.18}><rect width={W} height={H} fill="#5a4030" opacity=".4" /></Dirt>
      <g fill="none" stroke="#e0b86a" strokeWidth={3}><rect x={70} y={70} width={W - 140} height={H - 140} opacity=".7" /><rect x={90} y={90} width={W - 180} height={H - 180} strokeWidth={1.5} opacity=".5" />{[[70, 70], [W - 70, 70], [70, H - 70], [W - 70, H - 70]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={22} /><circle cx={x} cy={y} r={9} fill="#e0b86a" /></g>)}</g>
      <g transform="translate(960 160)"><rect x={-26} y={-60} width={52} height={90} fill="#7a1a1a" /><rect x={-26} y={-60} width={52} height={90} fill="url(#houseShade)" /><circle cx={0} cy={50} r={32} fill="#b88a40" /><circle cx={0} cy={50} r={22} fill="none" stroke="#6a4a1c" strokeWidth={4} /><path d="M-10 50 h20 M0 40 v20" stroke="#6a4a1c" strokeWidth={6} /></g>
      <Title x={W / 2} y={520} text="ADRIAN" size={150} anchor="middle" ls={26} c="#f6e8c8" />
      <Title x={W / 2} y={660} text="CARTON DE WIART" size={96} anchor="middle" ls={14} c="#f6e8c8" />
      <line x1={400} y1={800} x2={1520} y2={450} stroke="#b01818" strokeWidth={8} strokeLinecap="round" />
      <line x1={400} y1={800} x2={1520} y2={450} stroke="#ff6a4a" strokeWidth={2} strokeLinecap="round" opacity=".6" />
      <Title x={W / 2} y={790} text="prajurit yang tak bisa dibunuh" size={44} anchor="middle" ls={4} serif italic weight={400} c="#d9c7a0" />
      <rect x={560} y={850} width={800} height={3} fill="#e0b86a" />
      <Motes n={70} seed={4} c="#ffa050" o={0.7} r={2.4} y0={300} />
      <g filter="url(#blM)" opacity=".3">{Array.from({length: 5}, (_, i) => <ellipse key={i} cx={q() * W} cy={900 + q() * 120} rx={200} ry={30} fill="#6a5a50" />)}</g>
    </Frame>
  );
};

/* ============================== CHAPTER 1 : childhood ============================== */
const lampPost = (x: number, y: number, h: number, k: number) => (
  <g key={k}>
    <rect x={x - 5} y={y - h} width={10} height={h} fill="#15101a" /><rect x={x - 12} y={y - 14} width={24} height={14} fill="#15101a" /><rect x={x - 16} y={y - h - 30} width={32} height={34} rx={4} fill="#ffe0a0" /><polygon points={`${x - 22},${y - h - 30} ${x},${y - h - 52} ${x + 22},${y - h - 30}`} fill="#15101a" />
    <Glow id={`lg${k}`} x={x} y={y - h - 14} r={170} c="#ffcf8a" o={0.7} />
  </g>
);
const S1_1: React.FC = () => {
  const q = mulberry32(2);
  return (
    <Frame grade="contrast(1.08) saturate(1.12)">
      <SkyRect id="b1" stops={[[0, '#262c58'], [0.35, '#6a5a86'], [0.65, '#e08a62'], [1, '#ffd08a']]} h={760} />
      <Clouds n={9} seed={4} y0={90} y1={420} c="#ffb98a" o={0.5} />
      <Glow id="b1g" x={520} y={650} r={560} c="#ffe0a8" o={0.85} />
      <Birds n={9} seed={3} x0={400} x1={1500} y0={140} y1={420} c="#2a2040" />
      <g fill="#5a4a7a" opacity=".55">{Array.from({length: 26}, (_, i) => { const x = i * 80, h = 70 + q() * 90; return <g key={i}><rect x={x} y={730 - h} width={64} height={h} /><polygon points={`${x - 4},${730 - h} ${x + 32},${730 - h - 36} ${x + 68},${730 - h}`} /></g>; })}</g>
      <g fill="#4a4064" opacity=".9"><polygon points="1480,700 1490,250 1500,700" /><rect x={1440} y={420} width={100} height={300} /><polygon points="1440,420 1490,230 1540,420" /><rect x={1380} y={520} width={60} height={200} /><rect x={1540} y={520} width={60} height={200} /><polygon points="1380,520 1410,450 1440,520" /><polygon points="1540,520 1570,450 1600,520" />{[0, 1, 2].map((i) => <rect key={i} x={1476} y={470 + i * 60} width={28} height={40} rx={14} fill="#2a2040" />)}</g>
      <Fog id="b1f" y={560} h={240} c="#ffb98a" o={0.4} />
      {[0, 1, 2, 3, 4, 5].map((i) => <Facade key={i} x={30 + i * 318} y={830 - (i % 2) * 22} w={290} h={230 + (i % 3) * 40} wall={['#8a5a46', '#946a50', '#7a4e44'][i % 3]} roof={['#3a3446', '#46363c', '#363a4a'][i % 3]} floors={3} cols={3} lit={0.45} seed={20 + i} brick roofH={86} curtain={['#a83a3a', '#3a6aa8', '#c8a040'][i % 3]} />)}
      {[400, 1040, 1620].map((x, i) => <g key={i} filter="url(#blM)"><ellipse cx={x + 20} cy={430 - i * 20} rx={60} ry={26} fill="#ffe0c0" opacity=".3" /><ellipse cx={x + 54} cy={370 - i * 20} rx={80} ry={30} fill="#ffe0c0" opacity=".2" /></g>)}
      <rect y={850} width={W} height={H - 850} fill="#241c28" />
      <CobbleP y0={850} base="#6a5858" seed={3} wet />
      {[300, 880, 1480].map((x, i) => lampPost(x, 1000, 300, i))}
      <Fig id="s11" x={1000} y={1070} s={0.27} o={man('right', '#3a2a30', '#2a1a20', {head: 'flatcap'})} p={walkPose(1.5, 0.8)} lit={0.7} lo />
      <Fig id="s11b" x={1200} y={1050} s={0.24} o={man('left', '#5a3a50', '#2a2030', {head: 'flatcap'})} p={walkPose(0.4, 0.8)} lit={0.7} lo />
      <g filter="url(#blL)"><polygon points="0,1080 0,900 180,940 260,1080" fill="#0c080e" /><polygon points="1920,1080 1920,880 1740,940 1660,1080" fill="#0c080e" /></g>
      <Motes n={50} seed={1} y0={300} y1={900} o={0.4} />
    </Frame>
  );
};
const wheel = (cx: number, r: number) => (
  <g><circle cx={cx} cy={-20} r={r} fill="none" stroke="#1a1012" strokeWidth={13} /><circle cx={cx} cy={-20} r={9} fill="#1a1012" />{[0, 30, 60, 90, 120, 150].map((a) => <line key={a} x1={cx} y1={-20} x2={cx + r * Math.cos((a * Math.PI) / 180)} y2={-20 + r * Math.sin((a * Math.PI) / 180)} stroke="#1a1012" strokeWidth={4} />)}</g>
);
const S1_2: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(1.05)">
    <SkyRect id="b2" stops={[[0, '#6a7ca6'], [0.6, '#c89a84'], [1, '#f2c490']]} h={600} />
    <Clouds n={6} seed={2} y0={40} y1={260} c="#ffd8b8" o={0.4} />
    <Facade x={-60} y={810} w={600} h={620} wall="#8a6a52" roof="#4a3a40" floors={4} cols={3} lit={0.45} seed={3} brick balcony shutter="#3a5a4a" roofH={90} />
    <Facade x={1400} y={810} w={640} h={640} wall="#7a5a4a" roof="#4a3a40" floors={4} cols={3} lit={0.4} seed={7} brick balcony shutter="#5a3a3a" curtain="#c8a040" roofH={90} />
    <Facade x={540} y={770} w={430} h={420} wall="#a08060" roof="#5a4048" floors={3} cols={3} lit={0.35} seed={11} roofH={70} />
    <Facade x={980} y={770} w={400} h={380} wall="#8a7050" roof="#5a4048" floors={3} cols={3} lit={0.3} seed={15} roofH={70} />
    <g><rect x={60} y={640} width={300} height={22} fill="#2a1a10" /><Title x={210} y={657} text="BOULANGERIE" size={16} c="#e0c070" anchor="middle" ls={3} />{Array.from({length: 8}).map((_, i) => <polygon key={i} points={`${60 + i * 38},662 ${98 + i * 38},662 ${104 + i * 38},720 ${66 + i * 38},720`} fill={i % 2 ? '#a83a3a' : '#e8d8b0'} />)}</g>
    <CobbleP y0={810} base="#6a5a54" seed={5} wet />
    {[600, 1340].map((x, i) => lampPost(x, 880, 380, i + 4))}
    <path d="M380 420 Q700 470 1020 400" stroke="#2a1a10" strokeWidth={3} fill="none" />{[480, 620, 760, 900].map((x, i) => <polygon key={i} points={`${x},${448 + Math.sin(i) * 6} ${x + 36},${454} ${x + 32},${504} ${x - 4},${498}`} fill={['#e8e0c8', '#a8c0d8', '#d8a0a0', '#e8e0c8'][i]} />)}
    <g transform="translate(1120 920)">
      <ellipse cx={170} cy={0} rx={200} ry={16} fill="#000" opacity=".35" filter="url(#blM)" />
      <rect x={20} y={-210} width={310} height={156} rx={22} fill="#2a1a1c" /><rect x={20} y={-210} width={310} height={156} rx={22} fill="url(#houseShade)" />
      <rect x={42} y={-186} width={112} height={96} rx={8} fill="#c8b890" opacity=".7" /><rect x={176} y={-186} width={112} height={96} rx={8} fill="#c8b890" opacity=".7" />
      <path d="M20 -210 Q175 -250 330 -210" fill="#1a1012" /><rect x={0} y={-60} width={350} height={20} fill="#1a1012" />
      <rect x={335} y={-232} width={14} height={34} fill="#ffe0a0" />{wheel(90, 66)}{wheel(280, 66)}
    </g>
    <Fig id="drv" x={1180} y={760} s={0.3} o={man('left', '#15121a', '#15121a', {head: 'flatcap'})} p={idlePose(0.4)} lo />
    <Fig id="hz" x={900} y={940} s={0.46} o={{pal: khaki}} p={{}} art={<AnimalArt o={{kind: 'horse', coat: '#5a3a22', mane: '#1e140c', face: 'left', tack: true}} p={{phase: 0.4}} />} />
    <g filter="url(#blL)" opacity=".4">{[0, 1].map((i) => <ellipse key={i} cx={760 - i * 40} cy={820 - i * 20} rx={40 + i * 20} ry={16} fill="#fff" />)}</g>
    <Fig id="s12" x={300} y={980} s={0.45} o={man('right', '#4a3a50', '#2a2030', {head: 'flatcap'})} p={walkPose(2.2, 0.9)} />
    <Fig id="s12b" x={1760} y={1000} s={0.48} o={man('left', '#6a3a3a', '#2a2030', {outfit: 'skirt', head: 'scarf', hairStyle: 'long'})} p={walkPose(0.8, 0.9)} />
    <Fog id="b2f" y={640} h={240} c="#ffd8b0" o={0.22} />
    <Birds n={5} seed={9} x0={200} x1={1700} y0={110} y1={260} />
    <g filter="url(#blL)"><circle cx={140} cy={1030} r={110} fill="#0c080e" /><rect x={1800} y={940} width={150} height={160} fill="#0c080e" /></g>
    <Rays id="b2r" x={1900} y={0} ang={2.1} spread={0.5} len={1300} o={0.1} />
  </Frame>
);
const S1_3: React.FC = () => {
  const q = mulberry32(14);
  return (
    <Frame night grade="contrast(1.08) saturate(.95)">
      <rect width={W} height={H} fill="#1a1218" />
      {Array.from({length: 22}, (_, i) => <rect key={i} x={i * 90} y={0} width={45} height={700} fill="#2a1a24" opacity=".7" />)}
      {Array.from({length: 12}, (_, r) => Array.from({length: 7}, (_, c) => <g key={`${r}${c}`} opacity=".22" fill="#a07a50"><circle cx={90 + c * 140 + (r % 2) * 70} cy={60 + r * 56} r={6} /><ellipse cx={90 + c * 140 + (r % 2) * 70} cy={60 + r * 56 + 12} rx={3} ry={9} /></g>))}
      <rect y={700} width={W} height={380} fill="#3a2418" /><rect y={700} width={W} height={380} fill="url(#woodP)" /><rect y={692} width={W} height={14} fill="#5a3a24" />
      <Dirt o={0.6} light={0.2}><rect width={W} height={H} fill="#000" /></Dirt>
      <defs><Grad id="wnd" stops={[[0, '#2e3a6a'], [0.55, '#a8688a'], [1, '#ffb080']]} /></defs>
      <path d="M1000 180 L1000 960 L1700 960 L1700 180 Q1350 40 1000 180 Z" fill="url(#wnd)" />
      <g filter="url(#blS)">{Array.from({length: 34}, (_, i) => <circle key={i} cx={1020 + q() * 660} cy={560 + q() * 360} r={4 + q() * 10} fill={['#ffd48a', '#ffe8b8', '#ff9a50'][i % 3]} opacity={0.5 + q() * 0.5} />)}</g>
      <g fill="#241a2a" opacity=".85"><polygon points="1000,780 1120,640 1200,700 1320,590 1440,720 1560,650 1700,780 1700,960 1000,960" /><polygon points="1480,680 1490,560 1500,680" /></g>
      {Array.from({length: 70}, (_, i) => { const x = 1010 + q() * 680, y = 200 + q() * 700; return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 46} stroke="#cfe0ff" strokeWidth={2} opacity=".4" />; })}
      {Array.from({length: 26}, (_, i) => <g key={i}><ellipse cx={1020 + q() * 660} cy={220 + q() * 700} rx={4} ry={6} fill="#cfe0ff" opacity=".5" /><ellipse cx={1020 + q() * 660} cy={220 + q() * 700} rx={1.5} ry={2} fill="#fff" opacity=".8" /></g>)}
      <path d="M1000 180 L1000 960 L1700 960 L1700 180 Q1350 40 1000 180 Z" fill="none" stroke="#3a2a22" strokeWidth={30} /><path d="M1000 180 L1000 960 L1700 960 L1700 180 Q1350 40 1000 180 Z" fill="none" stroke="#6a4a34" strokeWidth={6} opacity=".7" />
      <line x1={1350} y1={90} x2={1350} y2={960} stroke="#3a2a22" strokeWidth={16} /><line x1={1000} y1={560} x2={1700} y2={560} stroke="#3a2a22" strokeWidth={16} />
      <rect x={980} y={950} width={740} height={26} fill="#5a3a24" />
      <path d="M800 100 Q900 400 850 1000 L1010 1000 L1010 100 Z" fill="#6a2a3a" />{[860, 900, 940, 980].map((x, i) => <path key={i} d={`M${x} 120 Q${x + 12} 500 ${x - 6} 1000`} stroke="#3a1420" strokeWidth={6} fill="none" opacity=".7" />)}<rect x={780} y={96} width={260} height={20} rx={8} fill="#c8a040" />
      <g><rect x={80} y={180} width={300} height={14} fill="#5a3a24" /><rect x={80} y={380} width={300} height={14} fill="#5a3a24" />{Array.from({length: 10}, (_, i) => <rect key={i} x={96 + i * 28} y={110 + (i % 3) * 8} width={22} height={70 - (i % 3) * 8} fill={['#6a2a2a', '#2a4a6a', '#6a5a2a', '#3a5a3a'][i % 4]} />)}{Array.from({length: 10}, (_, i) => <rect key={i} x={96 + i * 28} y={310 + (i % 2) * 10} width={22} height={70 - (i % 2) * 10} fill={['#3a3a6a', '#6a3a4a', '#4a6a5a'][i % 3]} />)}</g>
      <g><rect x={420} y={150} width={110} height={140} fill="#6a4a2a" /><rect x={430} y={160} width={90} height={120} fill="#a89878" /><circle cx={475} cy={210} r={26} fill="#5a4030" /></g>
      <rect x={60} y={740} width={420} height={30} fill="#5a3a24" /><rect x={90} y={770} width={20} height={180} fill="#4a2e1a" /><rect x={430} y={770} width={20} height={180} fill="#4a2e1a" />
      <g><rect x={200} y={690} width={14} height={50} fill="#e8dcb8" /><ellipse cx={207} cy={684} rx={7} ry={10} fill="#ffb050" /><Glow id="cg" x={207} y={684} r={200} c="#ffb050" o={0.45} /></g>
      <rect x={300} y={716} width={90} height={24} fill="#6a3a2a" /><rect x={310} y={700} width={70} height={16} fill="#2a4a6a" />
      <Fig id="c3k" x={640} y={1640} s={1.9} o={kid('right')} p={idlePose(0.4)} light="indoor" lit={0.8} />
      <Glow id="c3g" x={1300} y={500} r={700} c="#ffbf8a" o={0.25} />
      <Rays id="c3r" x={1350} y={300} ang={2.2} spread={0.7} len={1100} o={0.1} />
      <Motes n={50} seed={9} x0={500} x1={1500} y0={200} y1={900} o={0.45} />
    </Frame>
  );
};

const palm = (x: number, y: number, h: number, k = 1) => {
  const leaves = [-80, -58, -36, -14, 10, 32, 54, 76];
  return (
    <g key={x} transform={`translate(${x} ${y}) scale(${k})`}>
      <path d={`M0 0 Q${h * 0.1} ${-h * 0.5} ${h * 0.04} ${-h}`} fill="none" stroke="#3a2a1c" strokeWidth={h * 0.05} strokeLinecap="round" />
      {Array.from({length: 14}, (_, i) => <path key={i} d={`M${-h * 0.01} ${-h * (i / 14)} q${h * 0.03} ${-h * 0.01} ${h * 0.06} 0`} stroke="#1a1208" strokeOpacity=".5" strokeWidth={2} fill="none" />)}
      {leaves.map((a, i) => { const r = (a * Math.PI) / 180, L = h * 0.5; return (
        <g key={i}><path d={`M${h * 0.04} ${-h} q${Math.sin(r) * L * 0.6} ${-L * 0.3} ${Math.sin(r) * L} ${L * 0.25 + Math.abs(a) * 0.6}`} fill="none" stroke="#2c4a2a" strokeWidth={h * 0.035} strokeLinecap="round" />
          {Array.from({length: 9}, (_, j) => { const t = (j + 1) / 10, px = h * 0.04 + Math.sin(r) * L * (t * 0.95), py = -h + (-L * 0.3 * (1 - (1 - t) * (1 - t)) * 2 * 0.5) + (L * 0.25 + Math.abs(a) * 0.6) * t * t; return <line key={j} x1={px} y1={py} x2={px + (a < 0 ? -1 : 1) * h * 0.012} y2={py + h * 0.07} stroke="#3e6a3a" strokeWidth={h * 0.012} />; })}</g>
      ); })}
    </g>
  );
};
const pyramid = (x: number, y: number, w: number, h: number, c: string) => (
  <g>
    <polygon points={`${x - w / 2},${y} ${x},${y - h} ${x + w / 2},${y}`} fill={c} />
    <polygon points={`${x - w / 2},${y} ${x},${y - h} ${x + w / 2},${y}`} fill="url(#blockP)" opacity=".6" />
    <polygon points={`${x},${y - h} ${x + w / 2},${y} ${x + w * 0.02},${y}`} fill="#3a1a0a" opacity=".38" />
    <polygon points={`${x - w / 2},${y} ${x - w * 0.46},${y} ${x - 4},${y - h + 6} ${x},${y - h}`} fill="#fff" opacity=".12" />
  </g>
);
const kairoSky = (id: string) => (
  <>
    <SkyRect id={id} stops={[[0, '#7fa4d4'], [0.5, '#f0d2ac'], [1, '#ffe2b0']]} h={720} />
    <Clouds n={5} seed={5} y0={60} y1={300} c="#fff" o={0.35} />
  </>
);
const S1_4: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.12)">
    {kairoSky('k4')}
    <Glow id="k4s" x={1450} y={300} r={420} c="#fff2d0" o={0.95} />
    <Birds n={6} seed={7} x0={300} x1={1500} y0={140} y1={330} c="#3a2a1c" />
    {pyramid(560, 710, 560, 350, '#d8b484')}{pyramid(1000, 710, 380, 240, '#cfa878')}
    <g fill="#5a4630" opacity=".75">{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${150 + i * 60} 706 q4 -26 12 -30 q4 -16 12 -8 q6 8 8 18 q4 -4 8 6 l-2 14 z`} />)}</g>
    <Fog id="k4f" y={570} h={210} c="#fff0d0" o={0.55} />
    {[0, 1, 2, 3, 4].map((i) => <Facade key={i} x={30 + i * 390} y={900 - (i % 2) * 30} w={330} h={250 + (i % 3) * 50} wall={['#d8b890', '#c9a47c', '#dcc09a'][i % 3]} roof="#a8845c" floors={3} cols={3} lit={0.12} seed={30 + i} flat arch mash={i % 2 === 0} curtain="#a86a3a" />)}
    {[330, 1180, 1650].map((x, i) => <g key={i}><rect x={x} y={400 - i * 20} width={38} height={320} fill="#e4d0aa" /><rect x={x} y={400 - i * 20} width={38} height={320} fill="url(#houseShade)" /><polygon points={`${x - 8},${400 - i * 20} ${x + 19},${336 - i * 20} ${x + 46},${400 - i * 20}`} fill="#6a9a8a" /><circle cx={x + 19} cy={330 - i * 20} r={5} fill="#e0b050" /><rect x={x - 8} y={470 - i * 20} width={54} height={12} fill="#c9a47c" /><rect x={x - 8} y={560 - i * 20} width={54} height={12} fill="#c9a47c" />{[0, 1].map((j) => <rect key={j} x={x + 11} y={420 + j * 90 - i * 20} width={16} height={36} rx={8} fill="#3a2a1c" />)}</g>)}
    {palm(120, 930, 380, 1)}{palm(1830, 930, 440, 1)}{palm(1000, 910, 270, 0.9)}
    <rect y={900} width={W} height={H - 900} fill="#d4b280" /><Dirt o={0.6} light={0.4}><rect y={900} width={W} height={H - 900} fill="#d4b280" /></Dirt><rect y={900} width={W} height={H - 900} fill="url(#aoV)" />
    {Array.from({length: 14}, (_, i) => <ellipse key={i} cx={200 + i * 130} cy={960 + (i % 3) * 30} rx={20} ry={5} fill="#8a6a40" opacity=".4" />)}
    <Fig id="k4a" x={700} y={1030} s={0.42} o={man('right', '#e8dcc0', '#cdbd98', {head: 'turban'})} p={walkPose(1.1, 0.8)} lo />
    <Fig id="k4b" x={1300} y={1050} s={0.48} o={{pal: khaki, head: 'none', build: 0.9, face: 'left'}} p={{}} art={<AnimalArt o={{kind: 'camel', coat: '#b88a58', mane: '#6a4a2a', face: 'left'}} p={{phase: 0}} />} />
    <Rays id="k4r" x={1450} y={300} ang={1.9} spread={1.2} len={1000} o={0.12} />
    <g filter="url(#blL)"><polygon points="0,0 0,260 300,0" fill="#6a2a1a" opacity=".85" /></g>
    <Motes n={50} seed={6} y0={500} y1={1000} c="#fff0d0" o={0.5} />
  </Frame>
);
const awning = (x: number, y: number, w: number, c1: string, c2: string, k: number) => {
  const q = mulberry32(k * 7 + 1);
  return (
    <g key={x}>
      {Array.from({length: 8}).map((_, i) => <path key={i} d={`M${x + i * (w / 8)} ${y} L${x + (i + 1) * (w / 8)} ${y} Q${x + (i + 1) * (w / 8) + 4} ${y + 36} ${x + (i + 1) * (w / 8) + 8} ${y + 66} L${x + i * (w / 8) + 8} ${y + 66} Q${x + i * (w / 8) + 4} ${y + 36} ${x + i * (w / 8)} ${y} Z`} fill={i % 2 ? c1 : c2} />)}
      <rect x={x} y={y} width={w} height={66} fill="url(#houseShade)" opacity=".6" />
      {Array.from({length: 24}).map((_, i) => <line key={i} x1={x + 8 + i * (w / 24)} y1={y + 66} x2={x + 8 + i * (w / 24)} y2={y + 78} stroke={i % 2 ? c1 : c2} strokeWidth={4} />)}
      <rect x={x + 8} y={y + 66} width={w} height={230} fill="#2a1c10" opacity=".6" />
      <rect x={x + 8} y={y + 280} width={w} height={20} fill="#6a4a2a" />
      {Array.from({length: 5}, (_, i) => { const cx = x + 60 + i * (w / 5.4); const col = ['#c8402c', '#e0a030', '#6a8a3a', '#a86a2c', '#8a2a3a'][(i + k) % 5]; return <g key={i}><ellipse cx={cx} cy={y + 282} rx={48} ry={14} fill="#4a3018" />{Array.from({length: 16}, (_, j) => <circle key={j} cx={cx + (q() - 0.5) * 80} cy={y + 262 - q() * 22} r={9 + q() * 4} fill={col} />)}</g>; })}
      {[0.2, 0.6].map((t, i) => <g key={i}><line x1={x + w * t} y1={y + 66} x2={x + w * t} y2={y + 110} stroke="#1a1208" strokeWidth={2} /><ellipse cx={x + w * t} cy={y + 124} rx={14} ry={18} fill="#ffcf8a" /><Glow id={`al${k}${i}`} x={x + w * t} y={y + 124} r={70} c="#ffb050" o={0.45} /></g>)}
    </g>
  );
};
const S1_5: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.15)">
    {kairoSky('k5')}
    <Fog id="k5f" y={430} h={200} c="#fff0d0" o={0.4} />
    {[40, 560, 1120, 1560].map((x, i) => awning(x, 460, 420, ['#c8402c', '#2c6a8a', '#e0a030', '#6a8a3a'][i], '#f2e4c0', i))}
    <g>{[300, 820, 1380].map((x, i) => <g key={i}><line x1={x} y1={90} x2={x} y2={150} stroke="#2a1a10" strokeWidth={2} /><rect x={x - 70} y={150} width={140} height={190} fill={['#8a2a2a', '#2a4a6a', '#a87a2a'][i]} /><rect x={x - 56} y={166} width={112} height={158} fill="none" stroke="#e8d8a0" strokeWidth={4} />{[0, 1, 2].map((j) => <polygon key={j} points={`${x},${190 + j * 40} ${x + 22},${210 + j * 40} ${x},${230 + j * 40} ${x - 22},${210 + j * 40}`} fill="#e8d8a0" opacity=".7" />)}</g>)}<path d="M0 60 Q480 120 960 70 T1920 80" stroke="#2a1a10" strokeWidth={3} fill="none" />{Array.from({length: 22}, (_, i) => <polygon key={i} points={`${i * 90 + 20},${70 + Math.sin(i * 0.7) * 10} ${i * 90 + 56},${74 + Math.sin(i * 0.7) * 10} ${i * 90 + 38},${116 + Math.sin(i * 0.7) * 10}`} fill={['#c8402c', '#e0a030', '#2c6a8a', '#6a8a3a'][i % 4]} />)}</g>
    <rect y={800} width={W} height={H - 800} fill="#d8b684" /><Dirt o={0.6} light={0.4}><rect y={800} width={W} height={H - 800} fill="#d8b684" /></Dirt><rect y={800} width={W} height={H - 800} fill="url(#aoV)" />
    {Array.from({length: 16}, (_, i) => <ellipse key={i} cx={100 + i * 120} cy={900 + (i % 4) * 40} rx={22} ry={5} fill="#7a5a30" opacity=".35" />)}
    <Fig id="cm" x={1000} y={840} s={0.38} o={{pal: khaki}} p={{}} art={<AnimalArt o={{kind: 'camel', coat: '#a8784a', mane: '#6a4a2a', face: 'right'}} p={{phase: 0}} />} lo />
    {[620, 760, 1060].map((x, i) => <Fig key={i} id={`kb${i}`} x={x} y={850} s={0.3} o={man(i % 2 ? 'left' : 'right', ['#e8dcc0', '#b86a4a', '#8a6a4a'][i], '#6a5a3a', {head: i === 1 ? 'scarf' : 'turban'})} p={idlePose(i)} lit={0.8} lo />)}
    <Fig id="k5a" x={380} y={890} s={0.46} o={man('right', '#e8dcc0', '#cdbd98', {head: 'turban', beard: true})} p={idlePose(0.2)} />
    <Fig id="k5b" x={1400} y={890} s={0.46} o={man('left', '#8a6a4a', '#5a4a3a', {head: 'turban'})} p={idlePose(1.2)} />
    <Fig id="k5c" x={1750} y={910} s={0.5} o={man('left', '#b84a3a', '#6a3a2c', {head: 'scarf', outfit: 'skirt', hairStyle: 'long'})} p={idlePose(2.2)} />
    <Fig id="k5k" x={900} y={1000} s={0.64} o={kid('right', '#c85a3a')} p={runPose(2.3)} />
    <g opacity=".45">{[0, 1, 2, 3].map((i) => <line key={i} x1={640 - i * 50} y1={950 + i * 12} x2={520 - i * 70} y2={950 + i * 12} stroke="#fff0d0" strokeWidth={5} strokeLinecap="round" />)}</g>
    <Rays id="k5r" x={1100} y={0} ang={1.75} spread={0.9} len={1100} o={0.14} />
    <g filter="url(#blL)"><ellipse cx={90} cy={1040} rx={170} ry={90} fill="#3a2410" /><ellipse cx={1850} cy={1050} rx={150} ry={70} fill="#3a2410" /></g>
    <Motes n={80} seed={3} y0={300} y1={1000} c="#fff0d0" o={0.5} />
  </Frame>
);
const S1_6: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.1)">
    <SkyRect id="k6" stops={[[0, '#6a8ab8'], [0.55, '#f0c898'], [1, '#ffd89a']]} h={820} />
    <Clouds n={5} seed={2} y0={80} y1={380} c="#fff" o={0.3} />
    <Glow id="k6s" x={1500} y={420} r={500} c="#fff2d0" o={0.95} />
    {pyramid(1250, 890, 1600, 860, '#d8aa78')}
    <g fill="#4a3620" opacity=".8">{[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${1480 + i * 50} 888 q3 -22 10 -26 q3 -14 10 -7 q5 7 7 15 q3 -3 7 5 l-2 12 z`} />)}</g>
    <Fog id="k6f" y={650} h={230} c="#ffe8c0" o={0.45} />
    <rect y={880} width={W} height={H - 880} fill="#d2ae7c" /><Dirt o={0.5} light={0.45}><rect y={880} width={W} height={H - 880} fill="#d2ae7c" /></Dirt>
    {Array.from({length: 9}, (_, i) => <path key={i} d={`M0 ${900 + i * 22} Q480 ${890 + i * 22 - 10} 960 ${900 + i * 22} T1920 ${900 + i * 22}`} stroke="#8a6a40" strokeOpacity=".28" strokeWidth={3} fill="none" />)}
    <rect y={880} width={W} height={H - 880} fill="url(#aoV)" />
    <Birds n={4} seed={11} x0={600} x1={1700} y0={200} y1={420} c="#3a2a1c" s={1.2} />
    <Fig id="k6k" x={560} y={1520} s={1.8} o={kid('right', '#c85a3a')} p={idlePose(0.9)} />
    <Rays id="k6r" x={1500} y={420} ang={2.4} spread={1.4} len={1200} o={0.1} />
    <Motes n={60} seed={5} y0={300} y1={900} c="#fff0d0" o={0.5} />
  </Frame>
);
const S1_7: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(.98)">
    <SkyRect id="s7" stops={[[0, '#8a9cb8'], [0.6, '#c8d0d8'], [1, '#e8e4d8']]} h={720} />
    <Clouds n={9} seed={4} y0={60} y1={380} c="#fff" o={0.5} />
    <Sil seed={51} base={720} amp={44} fill="#7a8a78" o={0.55} />
    <Facade x={90} y={830} w={620} h={280} wall="#8a4a3a" roof="#3a3a48" floors={2} cols={5} lit={0.5} seed={61} brick arch roofH={96} curtain="#e0d0b0" chimneys={3} />
    <Facade x={1210} y={830} w={620} h={280} wall="#8a4a3a" roof="#3a3a48" floors={2} cols={5} lit={0.4} seed={62} brick arch roofH={96} curtain="#e0d0b0" chimneys={3} />
    <rect x={740} y={300} width={440} height={530} fill="#964e3e" /><rect x={740} y={300} width={440} height={530} fill="url(#brickP)" /><Dirt o={0.5} light={0.25}><rect x={740} y={300} width={440} height={530} fill="#000" /></Dirt><rect x={740} y={300} width={440} height={530} fill="url(#houseShade)" />
    {[0, 1, 2].map((i) => <rect key={i} x={740 + i * 150} y={300} width={20} height={530} fill="#c8b898" opacity=".5" />)}
    <polygon points="720,300 960,60 1200,300" fill="#32323e" /><polygon points="720,300 960,60 1200,300" fill="url(#tileP)" /><rect x={955} y={6} width={8} height={70} fill="#222" /><polygon points="963,10 1010,22 963,36" fill="#a82a2a" />
    {[0, 1].map((i) => <path key={i} d={`M${860 + i * 130} 520 V420 Q${900 + i * 130} 370 ${940 + i * 130} 420 V520 Z`} fill="#2a3448" />)}
    <g><rect x={920} y={400} width={80} height={150} rx={40} fill="#2a3448" /><rect x={920} y={400} width={80} height={150} rx={40} fill="#ffd48a" opacity=".3" />{[0, 1, 2, 3].map((i) => <line key={i} x1={925} y1={430 + i * 28} x2={995} y2={430 + i * 28} stroke="#14100c" strokeWidth={4} />)}</g>
    <circle cx={960} cy={340} r={44} fill="#e8e0c8" /><circle cx={960} cy={340} r={44} fill="none" stroke="#2a2a2a" strokeWidth={5} /><line x1={960} y1={340} x2={960} y2={308} stroke="#222" strokeWidth={4} /><line x1={960} y1={340} x2={984} y2={348} stroke="#222" strokeWidth={4} />
    <g><rect x={860} y={690} width={200} height={140} fill="#2a1a10" /><path d="M860 690 Q960 610 1060 690 Z" fill="#3a2a1c" /><path d="M880 830 V720 Q960 664 1040 720 V830 Z" fill="#1a100a" /></g>
    <rect y={830} width={W} height={H - 830} fill="#5a7a46" />
    {Array.from({length: 22}, (_, i) => <rect key={i} x={i * 90 - 40} y={830} width={45} height={H - 830} fill="#fff" opacity=".045" />)}
    <rect y={830} width={W} height={H - 830} fill="url(#lawn7)" /><defs><Grad id="lawn7" stops={[[0, '#fff', 0.08], [1, '#000', 0.5]]} /></defs>
    {[[400, 900], [520, 930], [1350, 910], [1480, 940]].map(([x, y], i) => <g key={i}>{Array.from({length: 7}, (_, j) => <circle key={j} cx={x + j * 14} cy={y + (j % 2) * 5} r={5} fill={['#e8c030', '#e8e0e8', '#d85a8a'][(i + j) % 3]} />)}</g>)}
    <polygon points="900,840 1020,840 1220,1080 700,1080" fill="#b8a888" /><polygon points="900,840 1020,840 1220,1080 700,1080" fill="url(#aoV)" />
    <Tree x={220} y={880} h={360} seed={3} /><Tree x={1700} y={890} h={400} seed={8} />
    {[0, 1, 2].map((i) => <rect key={i} x={560 + i * 380} y={862} width={140} height={34} rx={14} fill="#3a5a30" />)}
    <Fig id="s7a" x={560} y={1010} s={0.38} o={kid('right', '#2a3a5a')} p={walkPose(0.7, 0.8)} lo />
    <Fig id="s7b" x={690} y={1020} s={0.38} o={kid('right', '#2a3a5a')} p={walkPose(1.9, 0.8)} lo />
    <Fig id="s7c" x={1260} y={1020} s={0.4} o={kid('left', '#2a3a5a')} p={walkPose(2.9, 0.8)} lo />
    <Fig id="s7t" x={1100} y={1000} s={0.46} o={man('left', '#15121a', '#15121a', {pal: civ('#15121a', '#15121a', '#c9c9c4'), beard: true})} p={walkPose(1.3, 0.8)} lo />
    <Birds n={6} seed={4} x0={300} x1={1600} y0={120} y1={300} c="#3a3a48" />
    <Fog id="s7f" y={790} h={150} c="#e8ecf0" o={0.3} />
    <Rays id="s7r" x={100} y={0} ang={0.9} spread={0.5} len={1300} o={0.1} />
  </Frame>
);
const S1_8: React.FC = () => {
  const q = mulberry32(21);
  return (
    <Frame grade="contrast(1.07) saturate(1.1)">
      <SkyRect id="r8" stops={[[0, '#8aa4c8'], [0.6, '#d8d4c4'], [1, '#efe6cc']]} h={600} />
      <Clouds n={8} seed={6} y0={50} y1={300} c="#fff" o={0.55} />
      <Sil seed={71} base={610} amp={36} fill="#6a8a62" o={0.7} />
      <Tree x={160} y={620} h={260} seed={5} /><Tree x={420} y={618} h={200} seed={9} /><Tree x={1780} y={620} h={280} seed={2} />
      <g><rect x={560} y={540} width={720} height={80} fill="#5a4a3a" /><rect x={560} y={540} width={720} height={80} fill="url(#woodP)" opacity=".4" />{Array.from({length: 54}, (_, i) => <g key={i}><circle cx={576 + i * 13} cy={538 - (i % 3) * 6} r={5} fill="#e0a880" /><rect x={571 + i * 13} y={543 - (i % 3) * 6} width={10} height={16} fill={['#8a2a2a', '#2a3a8a', '#e8e0d0', '#3a5a3a'][i % 4]} /></g>)}</g>
      {[[560, 480], [1280, 480]].map(([x, y], i) => <g key={i}><line x1={x} y1={y + 140} x2={x} y2={y} stroke="#2a2a2a" strokeWidth={5} /><polygon points={`${x},${y} ${x + 80},${y + 14} ${x},${y + 36}`} fill={i ? '#2a3a8a' : '#8a1a2a'} /></g>)}
      <rect y={620} width={W} height={H - 620} fill="#5a8a48" />
      {Array.from({length: 11}).map((_, i) => <rect key={i} x={i * 180} y={620} width={90} height={H - 620} fill="#fff" opacity=".04" />)}
      <rect y={620} width={W} height={H - 620} fill="url(#lawn8)" /><defs><Grad id="lawn8" stops={[[0, '#fff', 0.06], [1, '#000', 0.45]]} /></defs>
      <Dirt o={0.4} light={0.2}><rect y={620} width={W} height={H - 620} fill="#5a8a48" /></Dirt>
      <path d="M0 720 L1920 700" stroke="#f4efe0" strokeWidth={6} opacity=".85" /><path d="M600 640 L420 1080" stroke="#f4efe0" strokeWidth={6} opacity=".7" />
      {Array.from({length: 18}, (_, i) => <ellipse key={i} cx={q() * W} cy={760 + q() * 280} rx={26 + q() * 40} ry={6 + q() * 8} fill="#4a3a28" opacity={0.5} />)}
      <g stroke="#f4efe0" strokeWidth={10}><line x1={1530} y1={650} x2={1530} y2={420} /><line x1={1630} y1={650} x2={1630} y2={420} /><line x1={1530} y1={560} x2={1630} y2={560} strokeWidth={8} /></g>
      {[330, 520, 720].map((x, i) => <Fig key={i} id={`r8o${i}`} x={x} y={890 + i * 4} s={0.44} o={man('right', '#fff', '#fff', {pal: civ(['#1a3a8a', '#8a1a2a', '#1a3a8a'][i], '#e8e0d0', '#5a3a22'), build: 1.05})} p={runPose(0.5 + i * 1.9)} />)}
      <Fig id="r8h" x={1000} y={960} s={0.58} o={young('right')} p={runPose(2.7)} />
      <g transform="translate(1150 710) rotate(-20)"><ellipse rx={34} ry={21} fill="#8a4a2a" /><ellipse rx={34} ry={21} fill="none" stroke="#2a1a10" strokeWidth={3} /><line x1={-15} y1={0} x2={15} y2={0} stroke="#e8dcc0" strokeWidth={3} /></g>
      <g opacity=".4">{[0, 1, 2, 3].map((i) => <line key={i} x1={720 - i * 60} y1={830 + i * 26} x2={540 - i * 90} y2={830 + i * 26} stroke="#fff" strokeWidth={5} strokeLinecap="round" />)}</g>
      <g>{Array.from({length: 14}, (_, i) => <circle key={i} cx={760 + q() * 260} cy={930 + q() * 90} r={2 + q() * 5} fill="#6a4a2a" />)}</g>
      <Rays id="r8r" x={200} y={0} ang={1.0} spread={0.6} len={1300} o={0.08} />
    </Frame>
  );
};
const S1_9: React.FC = () => {
  const q = mulberry32(33);
  return (
    <Frame grade="contrast(1.1) saturate(1.1)">
      <SkyRect id="r9" stops={[[0, '#7a9ac4'], [1, '#cfd8c8']]} h={640} />
      <Clouds n={6} seed={3} y0={60} y1={400} c="#fff" o={0.5} />
      <g filter="url(#blL)" opacity=".7"><rect x={0} y={560} width={W} height={120} fill="#5a7a58" />{Array.from({length: 40}, (_, i) => <g key={i}><circle cx={i * 50 + 20} cy={552} r={12} fill="#e0a880" /><rect x={i * 50 + 8} y={564} width={26} height={44} fill={['#8a2a2a', '#2a3a8a', '#e8e0d0'][i % 3]} /></g>)}</g>
      <rect y={620} width={W} height={H - 620} fill="#4e7a3e" /><rect y={620} width={W} height={H - 620} fill="url(#lawn9)" />
      <defs><Grad id="lawn9" stops={[[0, '#fff', 0.1], [1, '#000', 0.6]]} /></defs>
      <Dirt o={0.5} light={0.3}><rect y={620} width={W} height={H - 620} fill="#4e7a3e" /></Dirt>
      <Fig id="r9" x={560} y={1500} s={1.6} o={young('right')} p={{...walkPose(0.2, 1), thN: 38, shN: 12, ftN: -10, thF: -14, shF: 16}} />
      <g transform="translate(1180 570) rotate(-30)"><ellipse rx={150} ry={92} fill="#8a4a2a" /><ellipse rx={150} ry={92} fill="url(#ballsh)" /><ellipse rx={150} ry={92} fill="none" stroke="#2a1a10" strokeWidth={8} /><line x1={-66} y1={0} x2={66} y2={0} stroke="#e8dcc0" strokeWidth={9} />{[-40, -14, 14, 40].map((x) => <line key={x} x1={x} y1={-16} x2={x} y2={16} stroke="#e8dcc0" strokeWidth={6} />)}<path d="M-120 -30 Q0 -60 120 -30" stroke="#fff" strokeOpacity=".25" strokeWidth={6} fill="none" /></g>
      <defs><radialGradient id="ballsh" cx=".3" cy=".3" r=".8"><stop offset="0" stopColor="#fff" stopOpacity=".28" /><stop offset="1" stopColor="#000" stopOpacity=".5" /></radialGradient></defs>
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={1020 - i * 40} y1={610 + i * 36} x2={740 - i * 90} y2={660 + i * 42} stroke="#fff" strokeWidth={6} opacity=".3" strokeLinecap="round" />)}
      {Array.from({length: 60}, (_, i) => <path key={i} d={`M${600 + q() * 700} ${780 + q() * 260} q4 -${24 + q() * 36} ${10 + q() * 8} -${40 + q() * 36}`} stroke={['#6a9a52', '#4e8a3a', '#8aba62'][i % 3]} strokeWidth={3 + q() * 4} fill="none" strokeLinecap="round" />)}
      {Array.from({length: 22}, (_, i) => <g key={i} transform={`translate(${760 + q() * 480} ${660 + q() * 260}) rotate(${q() * 360})`}><ellipse rx={7 + q() * 10} ry={5 + q() * 6} fill="#5a3a22" /><line x1={-14} y1={0} x2={-34 - q() * 20} y2={q() * 8 - 4} stroke="#5a3a22" strokeWidth={3} opacity=".5" /></g>)}
      <Glow id="r9s" x={1500} y={120} r={420} c="#fff6d8" o={0.55} />
    </Frame>
  );
};
const S1_10: React.FC = () => {
  const glass = ['#c8402c', '#2c6a8a', '#e0a030', '#6a8a3a'];
  return (
    <Frame grade="contrast(1.08) saturate(.98)">
      <rect width={W} height={H} fill="#241a12" />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${i * 480 - 240} 0 Q${i * 480} 220 ${i * 480 + 240} 0`} stroke="#4a3a2a" strokeWidth={22} fill="none" />)}
      {[0, 1, 2, 3, 4].map((i) => <g key={i}><rect x={i * 480 - 22} y={80} width={44} height={560} fill="#5a4a38" /><rect x={i * 480 - 22} y={80} width={44} height={560} fill="url(#houseShade)" /><rect x={i * 480 - 34} y={620} width={68} height={24} fill="#6a5a46" /><rect x={i * 480 - 30} y={70} width={60} height={20} fill="#6a5a46" /></g>)}
      {[0, 1, 2, 3].map((i) => <g key={i}>
        <path d={`M${230 + i * 480} 580 L${230 + i * 480} 190 Q${330 + i * 480} 70 ${430 + i * 480} 190 L${430 + i * 480} 580 Z`} fill="#c8d8f0" />
        {Array.from({length: 4}, (_, j) => Array.from({length: 2}, (_, k) => <rect key={`${j}${k}`} x={238 + i * 480 + k * 96} y={200 + j * 90} width={90} height={84} fill={glass[(i + j + k) % 4]} opacity=".5" />))}
        <path d={`M${230 + i * 480} 580 L${230 + i * 480} 190 Q${330 + i * 480} 70 ${430 + i * 480} 190 L${430 + i * 480} 580 Z`} fill="none" stroke="#1a1410" strokeWidth={14} /><line x1={330 + i * 480} y1={100} x2={330 + i * 480} y2={580} stroke="#1a1410" strokeWidth={7} />
      </g>)}
      <Rays id="h10" x={330} y={200} ang={1.25} spread={0.5} len={1100} n={6} o={0.2} />
      <Rays id="h10b" x={1290} y={200} ang={1.2} spread={0.5} len={1100} n={6} o={0.2} seed={9} />
      {[500, 1000, 1500].map((x, i) => <g key={i}><line x1={x} y1={0} x2={x} y2={130} stroke="#1a1410" strokeWidth={3} /><ellipse cx={x} cy={150} rx={56} ry={16} fill="#3a2a1c" />{[-40, -20, 0, 20, 40].map((d) => <g key={d}><rect x={x + d - 3} y={116} width={6} height={22} fill="#e8dcb8" /><ellipse cx={x + d} cy={114} rx={4} ry={7} fill="#ffb050" /></g>)}<Glow id={`ch${i}`} x={x} y={130} r={150} c="#ffb050" o={0.35} /></g>)}
      <g><rect x={700} y={330} width={420} height={250} fill="#1c2a24" stroke="#5a3a24" strokeWidth={14} /><g stroke="#e8e8e0" strokeWidth={3} fill="none" opacity=".85"><circle cx={800} cy={450} r={48} /><circle cx={800} cy={450} r={16} /><path d="M860 400 L1020 400 M860 440 L1000 440 M860 480 L1040 480 M860 520 L980 520" /><path d="M740 380 L780 520" /></g></g>
      <rect y={580} width={W} height={H - 580} fill="#5a3a24" /><rect y={580} width={W} height={H - 580} fill="url(#woodP)" opacity=".6" />{Array.from({length: 8}, (_, i) => <line key={i} x1={0} y1={600 + i * 60} x2={W} y2={600 + i * 60} stroke="#000" strokeOpacity=".2" strokeWidth={2} />)}<rect y={580} width={W} height={H - 580} fill="url(#aoV)" />
      <Dirt o={0.5} light={0.2}><rect width={W} height={H} fill="#000" /></Dirt>
      <Fig id="l10" x={430} y={880} s={0.52} o={man('right', '#15121a', '#15121a', {pal: civ('#15121a', '#15121a', '#c9c9c4'), beard: true, head: 'none'})} p={idlePose(0.3)} />
      <rect x={540} y={690} width={120} height={190} fill="#3a2414" /><rect x={520} y={680} width={160} height={22} fill="#4a2e1a" /><rect x={560} y={660} width={70} height={22} fill="#e8dcb8" />
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => {
        const x = 900 + c * 250 - r * 60, y = 800 + r * 110, top = ['#3a3a4a', '#2a3a3a', '#4a3a3a'][(r + c) % 3];
        return <g key={`${r}${c}`}>
          <Fig id={`st${r}${c}`} x={x} y={y - 18} s={0.35 + r * 0.04} o={man('left', top, '#2a2a30', {pal: civ(top, '#2a2a30', ['#4a3020', '#2a1a10', '#8a6a3a', '#1a1a1a'][(r * 2 + c) % 4])})} p={idlePose(r + c)} lo />
          <rect x={x - 100} y={y - 50} width={200} height={26} fill="#6a4228" /><rect x={x - 100} y={y - 24} width={200} height={90} fill="#4a2e1a" /><rect x={x - 100} y={y - 24} width={200} height={90} fill="url(#woodP)" opacity=".4" />
          <rect x={x - 60} y={y - 58} width={46} height={10} fill="#e8dcb8" /><circle cx={x + 40} cy={y - 56} r={6} fill="#1a1410" />
        </g>;
      }))}
      <Fig id="a10" x={1750} y={820} s={0.48} o={young('left')} p={{...idlePose(0.5), uaN: -64, faN: -128, head: 8, torso: 5}} />
      <rect x={1640} y={640} width={210} height={26} fill="#6a4228" /><rect x={1640} y={666} width={210} height={170} fill="#4a2e1a" />
      <Motes n={90} seed={3} y0={80} y1={700} c="#fff6d8" o={0.55} r={3} />
    </Frame>
  );
};
const S1_11: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.05)">
    <rect width={W} height={H} fill="#241a12" />
    <rect width={W} height={H} fill="url(#woodP)" opacity=".18" />
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
    <g><polygon points="0,900 1920,860 1920,1080 0,1080" fill="#3a2414" /><polygon points="0,900 1920,860 1920,1080 0,1080" fill="url(#woodP)" opacity=".5" /><polygon points="0,900 1920,860 1920,872 0,912" fill="#7a5030" /></g>
    <g transform="translate(1040 900) rotate(-3)"><polygon points="0,0 260,-10 270,70 6,86" fill="#e8dcb8" /><path d="M20 20 H240 M24 42 H244 M28 64 H250" stroke="#6a5a40" strokeWidth={3} opacity=".6" /></g>
    <g transform="translate(1400 884)"><rect x={0} y={0} width={60} height={50} rx={6} fill="#1a1a2a" /><rect x={20} y={-16} width={20} height={18} fill="#1a1a2a" /><path d="M30 -10 q60 -120 130 -150" stroke="#e8dcb8" strokeWidth={5} fill="none" /></g>
    <g transform="translate(1180 930)"><polygon points="0,0 240,-8 250,60 8,70" fill="#6a3a2a" /><polygon points="10,-8 120,-14 124,52 14,60" fill="#e8dcb8" /><polygon points="128,-14 236,-20 244,46 132,52" fill="#d8ccA8" /></g>
    <Fig id="a11" x={600} y={2460} s={1.7} o={young('right')} p={{...idlePose(0.7), head: 12, torso: 6, uaN: -50, faN: -110}} light="indoor" lit={0.9} />
    <Glow id="a11g" x={1370} y={420} r={700} c="#fff2d0" o={0.25} />
    <Motes n={70} seed={5} x0={400} x1={1700} y0={100} y1={900} o={0.55} r={3} />
  </Frame>
);
const S1_12: React.FC = () => {
  const q = mulberry32(26);
  return (
    <Frame grade="contrast(1.12) saturate(.95)">
      <rect width={W} height={H} fill="#5a3a30" />
      {Array.from({length: 14}).map((_, r) => Array.from({length: 12}).map((_, c) => <rect key={`${r}${c}`} x={c * 170 - (r % 2) * 85} y={r * 82} width={162} height={74} fill={mix('#7a4a3a', r % 3 ? '#000' : '#fff', 0.08 + ((r * 7 + c * 3) % 6) * 0.03)} />))}
      <Dirt o={0.7} light={0.25}><rect width={W} height={H} fill="#000" /></Dirt>
      <g><polygon points="140,160 440,150 450,520 130,530" fill="#b8a888" transform="rotate(-4 290 340)" /><polygon points="1500,520 1800,530 1790,940 1490,930" fill="#a89878" transform="rotate(3 1650 730)" /><path d="M170 220 H400 M170 260 H380 M170 300 H410" stroke="#5a4a3a" strokeWidth={5} opacity=".5" transform="rotate(-4 290 340)" /></g>
      <polygon points="560,140 1400,120 1420,1000 540,980" fill="#000" opacity=".4" filter="url(#blM)" />
      <polygon points="540,120 1380,100 1400,980 520,960" fill="#e8dcb8" />
      <Dirt o={0.5} light={0.3}><polygon points="540,120 1380,100 1400,980 520,960" fill="#000" /></Dirt>
      <polygon points="540,120 1380,100 1400,980 520,960" fill="url(#ppr)" />
      <defs><radialGradient id="ppr" cx=".5" cy=".4" r=".8"><stop offset="0" stopColor="#fff" stopOpacity=".1" /><stop offset="1" stopColor="#5a3a20" stopOpacity=".4" /></radialGradient></defs>
      <g stroke="#5a4a30" strokeOpacity=".3" strokeWidth={3} fill="none"><path d="M530 540 L1390 540" /><path d="M960 110 L960 970" /><path d="M700 120 L760 970" strokeWidth={2} /></g>
      <ellipse cx={720} cy={800} rx={90} ry={50} fill="#8a6a30" opacity=".16" /><ellipse cx={1200} cy={300} rx={70} ry={40} fill="#8a6a30" opacity=".14" />
      {[[560, 140], [1360, 120], [540, 940], [1380, 960]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={9} fill="#3a3a40" /><circle cx={x - 2} cy={y - 2} r={3} fill="#9a9aa0" /></g>)}
      <Title x={900} y={270} text="BANGSA" size={108} anchor="middle" c="#8a1a1a" ls={12} />
      <Title x={940} y={366} text="MEMANGGILMU" size={72} anchor="middle" c="#8a1a1a" ls={6} />
      <rect x={640} y={400} width={620} height={5} fill="#2a1a10" />
      <Title x={960} y={470} text="PRAJURIT DICARI" size={52} anchor="middle" c="#2a1a10" ls={6} />
      <Title x={960} y={528} text="PERANG DI AFRIKA SELATAN · 1899" size={30} anchor="middle" c="#2a1a10" ls={3} weight={600} />
      <g fill="#2a1a10"><circle cx={960} cy={650} r={42} /><path d="M936 622 q24 -26 48 0" fill="#2a1a10" /><rect x={918} y={690} width={84} height={190} rx={20} /><rect x={1000} y={640} width={14} height={240} /><polygon points="1000,640 1014,640 1007,614" /></g>
      <path d="M700 920 H1220" stroke="#2a1a10" strokeWidth={3} /><Title x={960} y={950} text="DAFTAR HARI INI" size={22} anchor="middle" c="#2a1a10" ls={4} weight={600} />
      <polygon points="1100,100 1380,100 1400,330 1330,240 1250,260 1180,170" fill="#5a3a30" />
      <path d="M1100 100 L1180 170 L1250 260 L1330 240 L1400 330" fill="none" stroke="#b8a888" strokeWidth={7} strokeLinejoin="round" />
      <path d="M1100 100 L1180 170 L1250 260 L1330 240 L1400 330" fill="none" stroke="#fff" strokeWidth={2} opacity=".5" strokeDasharray="4 7" />
      <g transform="translate(1520 380) rotate(-30)">
        <path d="M0 0 q-70 -10 -150 20 l-20 -50 q10 -40 80 -30 q70 10 110 0 q40 -8 60 20 q10 30 -30 50 z" fill="#e0a880" />
        {[-26, -8, 10, 28].map((y, i) => <path key={i} d={`M-150 ${y + 4} q-40 -${6 - i} -60 ${2 + i * 2}`} stroke="#e0a880" strokeWidth={20} strokeLinecap="round" fill="none" />)}
        <path d="M-150 20 q-30 20 -10 60" stroke="#b07a58" strokeWidth={8} fill="none" /><path d="M20 -26 q40 -8 70 6" stroke="#b07a58" strokeWidth={4} fill="none" opacity=".6" />
        <rect x={20} y={-10} width={230} height={130} fill="#a39c66" /><rect x={20} y={-10} width={230} height={130} fill="url(#houseShade)" /><rect x={20} y={-10} width={36} height={130} fill="#6f4122" />
      </g>
      <g transform="translate(1290 150) rotate(20)"><polygon points="0,0 150,20 120,140 -10,110" fill="#e8dcb8" /><path d="M20 30 H120 M20 60 H110" stroke="#8a1a1a" strokeWidth={5} opacity=".6" /></g>
      {Array.from({length: 7}, (_, i) => <polygon key={i} points={`0,0 ${10 + q() * 16},${q() * 8} ${q() * 12},${12 + q() * 10}`} fill="#e8dcb8" transform={`translate(${1180 + q() * 380} ${380 + q() * 420}) rotate(${q() * 360})`} />)}
    </Frame>
  );
};

export const S01: Record<string, React.FC> = {
  '0.1': S0_1, '0.2': S0_2, '0.3': S0_3, '0.4': S0_4, '0.5': S0_5, '0.6': S0_6, '0.7': S0_7, '0.8': S0_8, '0.9': S0_9,
  '1.1': S1_1, '1.2': S1_2, '1.3': S1_3, '1.4': S1_4, '1.5': S1_5, '1.6': S1_6, '1.7': S1_7, '1.8': S1_8, '1.9': S1_9, '1.10': S1_10, '1.11': S1_11, '1.12': S1_12,
};
