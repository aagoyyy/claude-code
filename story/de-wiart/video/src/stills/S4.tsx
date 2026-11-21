import React from 'react';
import {Character} from '../rig/Character';
import {aimPose, HandArt, idlePose, kneelAimPose, muzzleOf, ridePose, runPose, SideOpts, walkPose} from '../rig/Side';
import {AnimalArt, saddleHeight} from '../rig/Animals';
import {H, mix, mulberry32, W} from '../world/util';
import {Smoke, Ripples, Flash, Embers, Dust} from './fx';
import {clock} from '../rig/clock';
import {liveFront, HandCU, arms, BackFig, Birds, Cast, civ, Clouds, CobbleP, Dirt, Facade, Fig, Fog, Frame, Glow, Grad, khaki, Mat, Motes, Par, Rays, SkyRect, Sil, Title, Tree, face} from './lib';
import {gent, worker, lady, boy, young, P} from './S1';
import {doctor, nurse, patient, MapArt, Ocean, Ship, Ref, Flag, trooper, sergeant, khakiOfficer, adrianY} from './S2';
import {askari, camelRider, dervish, heroPith, officer} from '../scenes/SomaliA';

export const hero = (f: 'left' | 'right', extra: Partial<SideOpts> = {}): SideOpts => ({...heroPith(f), ...extra});
export const camelMount = (id: string, x: number, y: number, s: number, f: 'left' | 'right', rider: SideOpts, p: any = {}, coat = '#b88a58', phase?: number) => {
  const drop = (saddleHeight('camel') - 666) * s;
  return (
    <g>
      <Fig id={`${id}c`} x={x} y={y} s={s} o={{pal: khaki}} p={{}} art={<AnimalArt o={{kind: 'camel', coat, mane: '#6a4a2a', face: f, tack: true}} p={{phase: phase ?? x / 130, stride: 0.9, speed: 4.2}} />} />
      <Fig id={`${id}r`} x={x + (f === 'right' ? -20 : 20) * s} y={y - drop} s={s} o={{...rider, face: f}} p={{...ridePose(0.3), ...p}} />
    </g>
  );
};
export const desertSky = (id: string) => (
  <>
    <SkyRect id={id} stops={[[0, '#6aa0cc'], [0.5, '#e8d4b0'], [1, '#ffe2b0']]} h={700} />
    <Clouds n={4} seed={3} y0={60} y1={300} c="#fff" o={0.35} />
    <Glow id={id + 'g'} x={300} y={320} r={520} c="#fff2d0" o={0.95} />
  </>
);
export const dune = (seed: number, base: number, amp: number, c: string, o = 1) => <Sil seed={seed} base={base} amp={amp} fill={c} o={o} />;
export const sandGround = (y: number, c = '#d8b684') => (
  <g><rect y={y} width={W} height={H - y} fill={c} /><Mat kind="sand" o={0.55} light={0.4}><rect y={y} width={W} height={H - y} fill={c} /></Mat><rect y={y} width={W} height={H - y} fill="url(#aoV)" />
    {Array.from({length: 8}, (_, i) => <path key={i} d={`M0 ${y + 30 + i * 40} Q480 ${y + 20 + i * 40} 960 ${y + 30 + i * 40} T1920 ${y + 30 + i * 40}`} stroke="#8a6a40" strokeOpacity=".22" strokeWidth={3} fill="none" />)}</g>
);

/* =============================== CHAPTER 4 : Somaliland, 1914 =============================== */
const S4_1: React.FC = () => (
  <Frame grade="contrast(1.05) saturate(1.0)">
    <MapArt focus={[1500, 470, 2.2]} pts={[[1440, 430], [1470, 470], [1500, 480], [1520, 540], [1540, 580], [1580, 590], [1610, 610]]} ship={[1440, 430, 0]} mark={[1610, 610]} year="1914" labels={[{x: 1440, y: 400, t: 'Berbera', s: 22}, {x: 1530, y: 640, t: 'SOMALILAND', s: 34, big: true}, {x: 1420, y: 330, t: 'Teluk Aden', s: 24}, {x: 1700, y: 470, t: 'Laut Arab', s: 22}]} />
  </Frame>
);
const S4_2: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(1.2) hue-rotate(4deg)">
    <Par d={0.03}>{desertSky('d42')}</Par>
    <Par d={0.15}>{dune(81, 700, 50, '#d8b080', 0.8)}<Fog id="d42f" y={600} h={200} c="#fff0d0" o={0.5} /></Par>
    <Par d={0.5}>{dune(82, 780, 60, '#c89a5a')}</Par>
    <Par d={0.9}>{sandGround(820, '#d0a468')}</Par>
    <Par d={1}>
      {camelMount('m1', 420, 900, 0.34, 'right', camelRider('right'), {uaN: -34})}
      {camelMount('m2', 820, 950, 0.4, 'right', hero('right', {gear: 'none'}), {uaN: -34}, '#c89a62')}
      {camelMount('m3', 1260, 925, 0.37, 'right', camelRider('right'), {uaN: -34}, '#a8784a')}
      {camelMount('m4', 1660, 975, 0.43, 'right', camelRider('right'), {uaN: -34}, '#b88a58')}
      <g fill="#d8b070" opacity=".6" filter="url(#blL)">{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={300 + i * 420} cy={960 + (i % 2) * 20} rx={150} ry={34} />)}</g>
    </Par>
    <Par d={1.8} blur={10}><polygon points="1920,1080 1920,860 1700,940 1620,1080" fill="#7a5a2a" opacity=".8" /></Par>
    <Par d={1}><Rays id="d42r" x={300} y={320} ang={0.75} spread={1.0} len={1600} o={0.1} /><Motes n={60} seed={5} y0={500} y1={1000} c="#fff0d0" o={0.5} /></Par>
  </Frame>
);
const S4_3: React.FC = () => {
  const q = mulberry32(3);
  return (
    <Frame grade="contrast(1.1) saturate(1.2)">
      <Par d={0.1}><SkyRect id="d43" stops={[[0, '#6aa0cc'], [1, '#f0d8a8']]} h={600} /><Glow id="d43g" x={280} y={260} r={500} c="#fff2d0" o={0.9} /></Par>
      <Par d={0.8}>{sandGround(600, '#d0a468')}</Par>
      <Par d={1.1}>
        <Fig id="d43c" x={900} y={1180} s={1.75} o={{pal: khaki}} p={{}} art={<AnimalArt o={{kind: 'camel', coat: '#b88a58', mane: '#6a4a2a', face: 'right', tack: true}} p={{phase: 1.1, stride: 0.7, speed: 4}} />} />
        {Array.from({length: 40}, (_, i) => <circle key={i} cx={560 + q() * 700} cy={930 + q() * 140} r={4 + q() * 12} fill="#d8b070" opacity={0.7} />)}
        <g fill="#8a6a30" opacity=".5" filter="url(#blS)">{[0, 1].map((i) => <ellipse key={i} cx={680 + i * 480} cy={1070} rx={160} ry={20} />)}</g>
      </Par>
      <Par d={1}><Motes n={50} seed={6} y0={500} y1={1000} c="#fff0d0" o={0.6} /></Par>
    </Frame>
  );
};
const S4_4: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.2) hue-rotate(4deg)">
    <Par d={0.03}>{desertSky('d44')}</Par>
    <Par d={0.15}>{dune(83, 720, 56, '#d8b080', 0.8)}<Fog id="d44f" y={620} h={200} c="#fff0d0" o={0.5} /></Par>
    <Par d={0.9}>{sandGround(800, '#d0a468')}</Par>
    <Par d={1}>{camelMount('h4', 900, 1050, 0.5, 'right', hero('right', {gear: 'none'}), P({uaN: -30, faN: -64, handN: 'relaxed'}, face.bored, {squint: 0.7, brow: -0.4}), '#c89a62')}</Par>
    <Par d={1}><Rays id="d44r" x={300} y={320} ang={0.7} spread={1.0} len={1600} o={0.1} /><Motes n={60} seed={5} y0={400} y1={1000} c="#fff0d0" o={0.5} /></Par>
    <Par d={1.8} blur={10}><polygon points="0,1080 0,880 180,940 240,1080" fill="#7a5a2a" opacity=".8" /></Par>
  </Frame>
);
const S4_5: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(1.1)">
    <Par d={0.1}><SkyRect id="d45" stops={[[0, '#6aa0cc'], [1, '#f0d8a8']]} h={700} /><rect y={640} width={W} height={440} fill="#d0a468" opacity=".9" filter="url(#blL)" /></Par>
    <Par d={1.1}>
      <Fig id="d45" x={560} y={2500} s={1.75} o={hero('right', {gear: 'none', hat: '#eadfc4'})} p={P(idlePose(0.5), arms.behind, {squint: 0.8, brow: -0.3, head: 2})} light="desert" lit={0.9} />
      <g transform="translate(640 470)"><rect x={0} y={-36} width={170} height={30} rx={11} fill="#1a1a22" stroke="#000" strokeWidth={3} /><rect x={0} y={6} width={170} height={30} rx={11} fill="#1a1a22" stroke="#000" strokeWidth={3} /><rect x={-16} y={-14} width={44} height={34} fill="#2a2a34" /><ellipse cx={170} cy={-21} rx={11} ry={15} fill="#7aaad0" /><ellipse cx={170} cy={21} rx={11} ry={15} fill="#7aaad0" /><path d="M10 -30 H150" stroke="#fff" strokeWidth={3} opacity=".3" /></g>
      <g transform="translate(660 650) rotate(208) scale(1.05)"><HandCU kind="grip" skin="#e0a880" sleeve="#a39c66" /></g>
    </Par>
    <Par d={1}><Glow id="d45s" x={300} y={260} r={500} c="#fff2d0" o={0.4} /><Motes n={60} seed={5} c="#fff0d0" o={0.5} r={3} /></Par>
  </Frame>
);
const S4_6: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.2) hue-rotate(4deg)">
    <Par d={0.03}>{desertSky('d46')}<Birds n={5} seed={4} x0={700} x1={1500} y0={160} y1={340} c="#3a2a1c" /></Par>
    <Par d={0.15}>{dune(84, 640, 40, '#d0a468', 0.8)}<Fog id="d46f" y={560} h={200} c="#fff0d0" o={0.45} /></Par>
    <Par d={0.5}>
      <polygon points="1000,760 1180,380 1460,330 1700,420 1880,760" fill="#a8783e" /><Mat kind="stone" o={0.5} light={0.3}><polygon points="1000,760 1180,380 1460,330 1700,420 1880,760" fill="#a8783e" /></Mat>
      <g><rect x={1220} y={170} width={460} height={250} fill="#d8c098" /><rect x={1220} y={170} width={460} height={250} fill="url(#blockP)" opacity=".6" /><rect x={1220} y={170} width={460} height={250} fill="url(#houseShade)" />{Array.from({length: 9}, (_, i) => <rect key={i} x={1212 + i * 56} y={146} width={30} height={30} fill="#d8c098" />)}
        {[1180, 1600].map((x, i) => <g key={i}><rect x={x} y={90} width={100} height={330} fill="#d0b88e" /><rect x={x} y={90} width={100} height={330} fill="url(#houseShade)" />{[0, 1, 2].map((j) => <rect key={j} x={x + 40} y={150 + j * 80} width={20} height={42} fill="#2a1a10" />)}{Array.from({length: 4}, (_, j) => <rect key={j} x={x - 6 + j * 36} y={64} width={26} height={30} fill="#d0b88e" />)}</g>)}
        <path d="M1380 420 V300 Q1450 230 1520 300 V420 Z" fill="#2a1a10" /><path d="M1450 90 V30" stroke="#4a3a28" strokeWidth={7} /><polygon points="1454,30 1530,48 1454,66" fill="#2a8a4a" />
        {Array.from({length: 7}, (_, i) => <g key={i} transform={`translate(${1250 + i * 62} 160)`}><circle r={14} fill="#6a4028" /><rect x={-14} y={-28} width={28} height={14} fill="#e8dcc0" /><line x1={8} y1={8} x2={28} y2={-18} stroke="#3a2a1a" strokeWidth={5} /></g>)}</g>
      <polygon points="1000,760 1180,380 1220,420 1100,760" fill="#fff" opacity=".1" />
    </Par>
    <Par d={0.9}>{sandGround(760, '#d0a468')}<Cast x={1000} y={766} w={880} h={480} o={0.26} /></Par>
    <Par d={1}>
      {[300, 440, 600].map((x, i) => <Fig key={i} id={`cs${i}`} x={x} y={1020 + i * 8} s={0.3} o={askari('right')} p={walkPose(i * 1.3, 0.8)} lo />)}
      <Fig id="cs3" x={760} y={1020} s={0.34} o={khakiOfficer('right')} p={P(idlePose(0.4), arms.point)} lo />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={330 + i * 330} cy={1050 + i * 8} rx={150} ry={22} fill="#7a5a2a" opacity=".3" filter="url(#blM)" />)}
    </Par>
    <Par d={1.8} blur={11}>{Array.from({length: 5}, (_, i) => <ellipse key={i} cx={100 + i * 440} cy={1060} rx={120} ry={60} fill="#7a5a2a" opacity=".8" />)}</Par>
    <Par d={1}><Rays id="d46r" x={300} y={320} ang={0.7} spread={1.0} len={1600} o={0.1} /><Motes n={60} seed={5} y0={400} y1={1000} c="#fff0d0" o={0.5} /></Par>
  </Frame>
);
const S4_7: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.15)">
    <Par d={0.03}>{desertSky('d47')}</Par>
    <Par d={0.15}>{dune(85, 700, 50, '#d8b080', 0.75)}<Fog id="d47f" y={620} h={200} c="#fff0d0" o={0.5} /></Par>
    <Par d={0.9}>{sandGround(800, '#d0a468')}</Par>
    <Par d={1}>
      <Fig id="a47" x={760} y={1030} s={0.62} o={hero('right', {gear: 'none'})} p={P(idlePose(0.5), arms.point, face.angry, face.talk(6), {torso: -4, head: 3})} />
      {[330, 150].map((x, i) => <Fig key={i} id={`as${i}`} x={x} y={1050 + i * 10} s={0.58} o={askari('right')} p={P(idlePose(i * 1.7), {uaN: -40, faN: -70, uaF: -36, faF: -66}, face.angry)} />)}
      <Fig id="of7" x={1180} y={1010} s={0.56} o={khakiOfficer('left')} p={P(idlePose(1.1), arms.hips, face.bored)} />
      <Fig id="as9" x={1560} y={1030} s={0.55} o={askari('left')} p={P(walkPose(0.8, 1), face.angry)} />
    </Par>
    <Par d={1}><Rays id="d47r" x={300} y={320} ang={0.7} spread={1.0} len={1600} o={0.1} /><Motes n={60} seed={5} y0={400} y1={1000} c="#fff0d0" o={0.5} /></Par>
  </Frame>
);
const S4_8: React.FC = () => <Ref src="f492" z={1.0} cx={900} cy={540} tint="#fff0d0" />;
const S4_9: React.FC = () => {
  const pose = kneelAimPose(0.3);
  const [mx, my] = muzzleOf(pose);
  const x = 560, y = 2260, s = 1.55;
  return (
    <Frame grade="contrast(1.1) saturate(1.1)">
      <Par d={0.1}><SkyRect id="d49" stops={[[0, '#6aa0cc'], [1, '#f0d8a8']]} h={700} /><rect y={700} width={W} height={380} fill="#d0a468" /><Glow id="d49g" x={300} y={260} r={500} c="#fff2d0" o={0.7} /></Par>
      <Par d={1.1}>
        <Fig id="a49" x={x} y={y} s={s} o={askari('right', 'rifle')} p={P(aimPose(0.3), {squint: 0.85, brow: -0.4, mouth: 0.05})} light="desert" lit={0.9} />
        <Flash x={x + mx * s} y={y + my * s} r={170} seed={9} rate={5} />
      </Par>
      <Par d={1}><Motes n={50} seed={8} c="#ffe0a0" o={0.5} /></Par>
    </Frame>
  );
};
const S4_10: React.FC = () => <Ref src="f564" z={1.0} cx={900} cy={540} tint="#fff0d0" />;
const S4_11: React.FC = () => <Ref src="f658h" z={1.5} cx={420} cy={480} tint="#fff0d0" />;
const S4_12: React.FC = () => (
  <Frame grade="contrast(1.12) saturate(1.0)" over={<Character pose={liveFront({head: 8, blink: 0.04, yaw: 10, mouth: 0.7})} variant={{young: true, patch: true, scars: true}} cam={{x: 0, y: 0, zoom: 4.3, px: 797, py: 330}} light={{key: '#ffd9a0', rim: '#ffcf98'}}>
    <g transform="translate(850 360)"><path d="M0 0 q-6 40 4 80 q10 -30 -4 -80 Z" fill="#a8101a" opacity=".85" /><path d="M-40 -10 q4 30 -6 50" stroke="#a8101a" strokeWidth={8} fill="none" opacity=".7" strokeLinecap="round" /></g></Character>}>
    <defs><radialGradient id="b412" cx=".5" cy=".45" r=".8"><stop offset="0" stopColor="#d89060" /><stop offset=".6" stopColor="#5a2a28" /><stop offset="1" stopColor="#140a0a" /></radialGradient></defs>
    <rect width={W} height={H} fill="url(#b412)" />
    <Motes n={80} seed={11} c="#ffd8a0" o={0.6} r={3} />
  </Frame>
);
const S4_13: React.FC = () => <Ref src="f836" z={1.0} cx={900} cy={540} tint="#fff0d0" />;
const S4_14: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(0.95) hue-rotate(6deg)">
    <Par d={0.1}><defs><radialGradient id="h414" cx=".5" cy=".4" r=".85"><stop offset="0" stopColor="#d8d4c0" /><stop offset=".6" stopColor="#6a6a58" /><stop offset="1" stopColor="#1a1a14" /></radialGradient></defs><rect width={W} height={H} fill="url(#h414)" /><Rays id="h414r" x={1500} y={0} ang={2.0} spread={0.6} len={1300} o={0.14} /></Par>
    <Par d={1.1}>
      <Fig id="p414" x={760} y={2500} s={1.75} o={hero('right', {gear: 'none', patch: false, head: 'none'})} p={P(idlePose(0.6), face.angry, {grimace: 0.9, mouth: 0.2, head: 6})} light="indoor" lit={0.9} />
      {/* gauze wound around the head and over the eye */}
      <g fill="#ece8d8" stroke="#8a8676" strokeWidth={3}>
        <path d="M570 380 Q720 330 860 400 L850 450 Q720 400 575 440 Z" /><path d="M590 470 Q730 430 870 520 L850 566 Q730 480 600 520 Z" /><path d="M640 330 Q780 340 830 450 L790 470 Q760 380 650 370 Z" />
        <ellipse cx={780} cy={500} rx={72} ry={62} />
      </g>
      <path d="M720 490 q10 22 -2 40" stroke="#c4281c" strokeWidth={14} fill="none" opacity=".6" strokeLinecap="round" />
      <path d="M580 400 L860 440 M590 450 L860 500 M610 500 L840 540" stroke="#aaa392" strokeWidth={2} fill="none" />
      {/* the nurse's hands winding the roll */}
      <g transform="translate(1330 330) rotate(100) scale(1.25)"><HandCU kind="relaxed" skin="#e8b48a" sleeve="#f2f0e8" /></g>
      <g transform="translate(1370 700) rotate(80) scale(1.2)"><HandCU kind="open" skin="#e8b48a" sleeve="#f2f0e8" /></g>
      <path d="M860 420 Q1000 400 1080 520" stroke="#ece8d8" strokeWidth={30} fill="none" strokeLinecap="round" />
    </Par>
  </Frame>
);
const S4_15: React.FC = () => (
  <Frame grade="contrast(1.06) saturate(.9) hue-rotate(8deg)">
    <Par d={0.1}>
      <rect width={W} height={H} fill="#b8b49c" /><Mat kind="stone" o={0.4} light={0.3}><rect width={W} height={680} fill="#b8b49c" /></Mat>
      {[0, 1, 2, 3].map((i) => <g key={i}><path d={`M${160 + i * 460} 600 V240 Q${270 + i * 460} 120 ${380 + i * 460} 240 V600 Z`} fill="#cfe0f0" /><path d={`M${160 + i * 460} 600 V240 Q${270 + i * 460} 120 ${380 + i * 460} 240 V600 Z`} fill="none" stroke="#3a3a30" strokeWidth={14} /><line x1={270 + i * 460} y1={150} x2={270 + i * 460} y2={600} stroke="#3a3a30" strokeWidth={7} /><line x1={160 + i * 460} y1={380} x2={380 + i * 460} y2={380} stroke="#3a3a30" strokeWidth={7} /></g>)}
      <Rays id="h415" x={270} y={200} ang={1.3} spread={0.5} len={1100} n={6} o={0.22} /><Rays id="h415b" x={1190} y={200} ang={1.25} spread={0.5} len={1100} n={6} o={0.22} seed={7} />
      {[500, 1000, 1500].map((x, i) => <g key={i}><line x1={x} y1={0} x2={x} y2={100} stroke="#2a2a20" strokeWidth={3} /><ellipse cx={x} cy={120} rx={30} ry={20} fill="#ffe0a0" /><Glow id={`g415${i}`} x={x} y={120} r={140} c="#ffd890" o={0.4} /></g>)}
    </Par>
    <Par d={0.8}>
      <rect y={600} width={W} height={H - 600} fill="#8a8470" />{Array.from({length: 24}, (_, i) => Array.from({length: 8}, (_, j) => <rect key={`${i}${j}`} x={i * 100 - (j % 2) * 50} y={620 + j * 60} width={50} height={30} fill={(i + j) % 2 ? '#7a7460' : '#9a9480'} opacity=".5" />))}<rect y={600} width={W} height={H - 600} fill="url(#aoV)" />
    </Par>
    <Par d={1}>
      {/* beds in rows, patients lying, nurses between them */}
      {[0, 1, 2, 3].map((i) => {
        const x = 280 + i * 420, y = 900 + (i % 2) * 20;
        return <g key={i}>
          <rect x={x - 150} y={y - 90} width={300} height={16} fill="#2a2a30" /><rect x={x - 150} y={y - 74} width={300} height={44} fill="#f2f0e8" stroke="#8a8676" strokeWidth={3} /><rect x={x - 150} y={y - 110} width={14} height={110} fill="#2a2a30" /><rect x={x + 136} y={y - 110} width={14} height={110} fill="#2a2a30" />
          <Fig id={`pb${i}`} x={x - 60} y={y - 76} s={0.5} o={patient(i % 2 ? 'left' : 'right')} p={P(idlePose(i), {fall: -0.99, head: 14})} lo />
          <rect x={x - 150} y={y - 66} width={300} height={30} fill="#e8e4d8" opacity=".55" />
        </g>;
      })}
      <Fig id="nu1" x={500} y={1040} s={0.55} o={nurse('right')} p={P(idlePose(0.5), arms.offer, face.smile)} />
      <Fig id="nu2" x={1480} y={1050} s={0.56} o={nurse('left')} p={P(walkPose(0.9, 0.5), {uaN: -34, faN: -80, handN: 'relaxed'})} />
      <Fig id="dr1" x={1000} y={1060} s={0.58} o={doctor('right')} p={P(idlePose(1.4), arms.explain, face.talk(3))} />
    </Par>
    <Par d={1}><Motes n={70} seed={3} y0={80} y1={800} c="#fff6d8" o={0.5} r={3} /></Par>
  </Frame>
);
const glassEye = (x: number, y: number, r: number) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#f4f0e4" stroke="#8a8676" strokeWidth={r * 0.08} /><circle r={r * 0.55} fill="#4a86b8" /><circle r={r * 0.55} fill="url(#ballsh2)" /><circle r={r * 0.26} fill="#0a1218" /><circle cx={-r * 0.2} cy={-r * 0.2} r={r * 0.14} fill="#fff" />
    <path d={`M${-r * 0.8} ${-r * 0.3} q${r * 0.3} ${-r * 0.5} ${r * 0.8} ${-r * 0.4}`} stroke="#c8b8a8" strokeWidth={r * 0.06} fill="none" opacity=".6" />
    <defs><radialGradient id="ballsh2" cx=".3" cy=".3" r=".8"><stop offset="0" stopColor="#fff" stopOpacity=".3" /><stop offset="1" stopColor="#000" stopOpacity=".5" /></radialGradient></defs>
  </g>
);
const S4_16: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(.95) hue-rotate(8deg)">
    <Par d={0.1}><rect width={W} height={H} fill="#bcb8a0" /><Mat kind="stone" o={0.4} light={0.3}><rect width={W} height={760} fill="#bcb8a0" /></Mat>
      <rect x={140} y={120} width={380} height={460} fill="#cfe0f0" stroke="#3a3a30" strokeWidth={14} /><line x1={330} y1={120} x2={330} y2={580} stroke="#3a3a30" strokeWidth={8} /><line x1={140} y1={350} x2={520} y2={350} stroke="#3a3a30" strokeWidth={8} />
      <Rays id="h416" x={330} y={200} ang={1.15} spread={0.6} len={1200} n={6} o={0.2} />
      <g><rect x={1300} y={160} width={420} height={380} fill="#e8e4d4" stroke="#8a8676" strokeWidth={5} /><path d="M1330 220 H1690 M1330 280 H1690 M1330 340 H1650" stroke="#6a6a5a" strokeWidth={3} /><g transform="translate(1510 460)"><circle r={40} fill="none" stroke="#6a6a5a" strokeWidth={4} /><circle r={14} fill="#4a86b8" /></g></g>
    </Par>
    <Par d={0.8}><rect y={760} width={W} height={H - 760} fill="#8a8470" /><rect y={760} width={W} height={H - 760} fill="url(#aoV)" /></Par>
    <Par d={1}>
      <Fig id="d416" x={700} y={1050} s={0.85} o={doctor('right')} p={P(idlePose(0.5), {uaN: -76, faN: -50, handN: 'point', squint: 0.4, brow: -0.2, head: 4, uaF: -20, faF: -60, handF: 'relaxed'})} lit={0.9} />
      <Fig id="a416" x={1180} y={1060} s={0.88} o={hero('left', {gear: 'none', patch: true, head: 'none'})} p={P(idlePose(1.3), arms.behind, {squint: 0.5, brow: -0.2, grimace: 0.5, head: -2})} lit={0.9} />
      {glassEye(1000, 420, 28)}
      <g stroke="#9aa0a8" strokeWidth={5} strokeLinecap="round"><line x1={960} y1={440} x2={1020} y2={408} /><line x1={960} y1={452} x2={1020} y2={416} /></g>
    </Par>
    <Par d={1}><Motes n={60} seed={3} y0={80} y1={800} c="#fff6d8" o={0.5} r={3} /></Par>
  </Frame>
);
const S4_17: React.FC = () => {
  const q = mulberry32(17);
  return (
    <Frame night grade="contrast(1.1) saturate(1.05) hue-rotate(-4deg)">
      <Par d={0.1}>
        <SkyRect id="t417" stops={[[0, '#2a3258'], [0.6, '#a8688a'], [1, '#ffb080']]} h={1080} />
        <g filter="url(#blL)" opacity=".8">{Array.from({length: 30}, (_, i) => <circle key={i} cx={q() * W} cy={400 + q() * 500} r={14 + q() * 38} fill={['#ffd48a', '#ffe8b8', '#ff9a50', '#a0c8ff'][i % 4]} opacity={0.4 + q() * 0.5} />)}</g>
        <g filter="url(#blM)" fill="#2a1a2a" opacity=".85">{Array.from({length: 8}, (_, i) => <rect key={i} x={i * 260 - 30} y={520 + (i % 3) * 40} width={220} height={560} />)}</g>
        {Array.from({length: 80}, (_, i) => { const x = q() * W, y = q() * 700; return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 50} stroke="#cfe0ff" strokeWidth={2} opacity=".35" />; })}
      </Par>
      <Par d={0.7}>
        {/* the cab: window frame, sill, leather */}
        <path d="M80 80 L80 800 L1100 800 L1100 80 Q590 -20 80 80 Z" fill="none" stroke="#14100c" strokeWidth={60} /><line x1={590} y1={20} x2={590} y2={800} stroke="#14100c" strokeWidth={20} />
        <rect x={0} y={780} width={W} height={300} fill="#2a1a14" /><Mat kind="cloth" o={0.5} light={0.2}><rect y={780} width={W} height={300} fill="#2a1a14" /></Mat>
        <rect x={0} y={770} width={1160} height={26} fill="#5a3a24" />
        <rect x={1300} y={0} width={620} height={1080} fill="#14100c" /><rect x={1300} y={0} width={620} height={1080} fill="url(#houseShade)" opacity=".5" />
      </Par>
      <Par d={1.1}><Fig id="a417" x={1010} y={2440} s={1.65} o={hero('left', {gear: 'none', patch: true, head: 'none'})} p={P(idlePose(0.6), {uaN: -30, faN: -96, handN: 'relaxed'}, {squint: 0.4, brow: -0.2, head: -4, torso: 4})} light="indoor" lit={0.7} /></Par>
      <Par d={1}><Glow id="t417g" x={500} y={420} r={600} c="#ffb080" o={0.25} /></Par>
    </Frame>
  );
};
const S4_18: React.FC = () => {
  const q = mulberry32(18);
  return (
    <Frame night grade="contrast(1.1) saturate(1.05)">
      <Par d={0.1}>
        <SkyRect id="t418" stops={[[0, '#2a3258'], [0.6, '#a8688a'], [1, '#ffb080']]} h={1080} />
        <g filter="url(#blL)">{Array.from({length: 26}, (_, i) => <circle key={i} cx={q() * W} cy={300 + q() * 600} r={14 + q() * 38} fill={['#ffd48a', '#ffe8b8', '#ff9a50'][i % 3]} opacity={0.4 + q() * 0.5} />)}</g>
        <path d="M0 780 L1920 700 L1920 1080 L0 1080 Z" fill="#3a3a44" /><g stroke="#6a6a74" strokeWidth={4} opacity=".6">{Array.from({length: 14}, (_, i) => <line key={i} x1={i * 150} y1={800} x2={i * 150 - 80} y2={1080} />)}</g>
      </Par>
      <Par d={0.8}><path d="M1100 0 L1100 1080 L1920 1080 L1920 0 Z" fill="#14100c" /><rect x={1060} y={720} width={880} height={50} fill="#5a3a24" /></Par>
      <Par d={1.15}>
        <g transform="translate(1250 260) rotate(100) scale(1.74)"><HandCU kind="open" skin="#e0a880" sleeve="#3a4a3a" /></g>
        {glassEye(640, 440, 40)}
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${760 + i * 20} ${380 + i * 20} q-120 20 -300 100`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.5 - i * 0.08} strokeLinecap="round" />)}
      </Par>
      <Par d={1}><Motes n={40} seed={4} c="#ffd8a0" o={0.5} r={3} /></Par>
    </Frame>
  );
};
const S4_19: React.FC = () => (
  <Frame grade="contrast(1.12) saturate(1.0) hue-rotate(-4deg)">
    <Par d={0.1}><SkyRect id="c419" stops={[[0, '#3a3a5a'], [1, '#a8688a']]} h={500} /><CobbleP y0={460} base="#6a5a5a" seed={7} wet /><Glow id="c419g" x={400} y={500} r={700} c="#ffb080" o={0.35} /></Par>
    <Par d={1.1}>
      {/* a gentleman's boot, a puddle, and a glass eye bouncing across the stones */}
      <path d="M1380 100 L1500 100 L1500 640 Q1700 650 1760 720 L1760 800 L1330 800 L1340 640 Z" fill="#1a1210" stroke="#000" strokeWidth={6} /><path d="M1380 100 L1500 100 L1500 640" fill="url(#sideShade)" /><path d="M1340 760 L1760 760" stroke="#000" strokeWidth={14} />
      <ellipse cx={760} cy={880} rx={420} ry={90} fill="#8aa4c0" opacity=".55" /><Ripples x={760} y={880} rx={420} ry={90} n={3} />
      {glassEye(880, 740, 56)}
      {[0, 1, 2].map((i) => <path key={i} d={`M${1040 + i * 40} ${560 - i * 10} Q${960 + i * 40} ${700} ${900 + i * 20} ${730}`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.4 - i * 0.1} strokeLinecap="round" strokeDasharray="10 14" />)}
      {Array.from({length: 14}, (_, i) => <circle key={i} cx={760 + Math.cos(i * 1.3) * (120 + (i % 4) * 40)} cy={860 - (i % 5) * 26} r={4 + (i % 3) * 3} fill="#e8f4ff" opacity=".8" />)}
    </Par>
  </Frame>
);
const S4_20: React.FC = () => (
  <Frame night grade="contrast(1.14) saturate(.95)" over={<Character pose={liveFront({head: -2, blink: 1, yaw: 14, mouth: 0.03})} variant={{patch: true, scars: true}} cam={{x: 0, y: 0, zoom: 4.4, px: 797, py: 330}} light={{key: '#ffd9a0', rim: '#ffcf98'}} />}>
    <defs><radialGradient id="p420" cx=".6" cy=".4" r=".8"><stop offset="0" stopColor="#7a5a40" /><stop offset=".5" stopColor="#2a1c14" /><stop offset="1" stopColor="#070504" /></radialGradient></defs>
    <rect width={W} height={H} fill="url(#p420)" />
    <Glow id="p420g" x={1300} y={300} r={600} c="#ffb070" o={0.4} />
    <Motes n={60} seed={11} c="#ffcf9a" o={0.5} r={3} />
  </Frame>
);

/* =============================== CHAPTER 5 : back to war, 1914 =============================== */
export const loco = (x: number, y: number, s: number) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={380} ry={14} fill="#000" opacity=".4" filter="url(#blM)" />
    <rect x={-300} y={-250} width={420} height={170} rx={80} fill="#1e2a2a" stroke="#0a1010" strokeWidth={6} /><rect x={-300} y={-250} width={420} height={170} rx={80} fill="url(#sideShade)" />
    <rect x={-330} y={-370} width={60} height={130} fill="#14100c" /><path d="M-340 -370 L-260 -370 L-276 -400 L-324 -400 Z" fill="#14100c" /><rect x={-170} y={-290} width={70} height={50} rx={30} fill="#c8a040" />
    <rect x={120} y={-330} width={170} height={250} fill="#2a3a3a" stroke="#0a1010" strokeWidth={6} /><rect x={150} y={-300} width={100} height={90} fill="#14202a" /><rect x={110} y={-340} width={200} height={20} fill="#14100c" />
    <rect x={-300} y={-100} width={600} height={30} fill="#a8201e" />
    {[-210, -110, 0, 180, 250].map((cx, i) => <g key={i}><circle cx={cx} cy={-40} r={i === 2 ? 70 : 56} fill="#14100c" stroke="#555" strokeWidth={5} /><circle cx={cx} cy={-40} r={i === 2 ? 14 : 10} fill="#999" /></g>)}
    <line x1={-210} y1={-40} x2={0} y2={-40} stroke="#999" strokeWidth={8} />
    <Smoke x={-300} y={-420} w={64} h={520} c="#f4f4f4" o={0.85} puffs={10} seed={5} drift={-240} />
  </g>
);
export const carriage = (x: number, y: number, s: number, c = '#2a4a3a') => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={0} y={-260} width={460} height={190} fill={c} stroke="#0a1010" strokeWidth={5} /><rect x={0} y={-260} width={460} height={190} fill="url(#houseShade)" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={26 + i * 108} y={-230} width={80} height={80} fill="#c8d8e0" stroke="#14100c" strokeWidth={4} />)}
    <rect x={0} y={-80} width={460} height={20} fill="#14100c" />{[70, 390].map((cx) => <circle key={cx} cx={cx} cy={-40} r={44} fill="#14100c" stroke="#555" strokeWidth={4} />)}
  </g>
);
const S5_1: React.FC = () => {
  const q = mulberry32(51);
  return (
    <Frame grade="contrast(1.08) saturate(.95) hue-rotate(6deg)" over={<BackFig x={90} y={1290} s={0.78} hat="bowler" dark={0.36} />}>
      <Par d={0.05}><rect width={W} height={H} fill="#8a9aa8" /><Glow id="s51g" x={400} y={200} r={900} c="#fff2d8" o={0.55} /></Par>
      <Par d={0.3}>
        {Array.from({length: 9}, (_, i) => <path key={i} d={`M${i * 260 - 100} 640 Q${i * 260 + 30} 120 ${i * 260 + 160} 640`} fill="none" stroke="#2a2a30" strokeWidth={14} />)}
        <rect y={90} width={W} height={20} fill="#2a2a30" />{Array.from({length: 24}, (_, i) => <line key={i} x1={i * 90} y1={110} x2={i * 90 + 40} y2={520} stroke="#2a2a30" strokeWidth={4} opacity=".5" />)}
        <g><circle cx={960} cy={260} r={80} fill="#e8e0c8" stroke="#1a1a1a" strokeWidth={10} /><line x1={960} y1={260} x2={960} y2={196} stroke="#222" strokeWidth={7} /><line x1={960} y1={260} x2={1000} y2={280} stroke="#222" strokeWidth={7} /></g>
        <Rays id="s51r" x={500} y={80} ang={1.4} spread={1.2} len={1200} n={8} o={0.2} />
      </Par>
      <Par d={0.6}>{loco(1500, 800, 0.8)}{carriage(1860, 800, 0.8)}{carriage(1280, 800, 0.0, '#2a4a3a')}</Par>
      <Par d={0.9}><rect y={800} width={W} height={H - 800} fill="#8a8478" /><Mat kind="stone" o={0.5} light={0.3}><rect y={800} width={W} height={H - 800} fill="#8a8478" /></Mat><rect y={800} width={W} height={H - 800} fill="url(#aoV)" /><rect y={800} width={W} height={14} fill="#f4efe0" /></Par>
      <Par d={1}>
        {[240, 440, 620].map((x, i) => <Fig key={i} id={`pl${i}`} x={x} y={990 + i * 8} s={0.52} o={i === 1 ? lady('right', '#2a6a8a') : gent('right', '#3a3a44', i ? 'bowler' : 'top')} p={P(idlePose(i * 1.1), arms.wave, face.smile)} />)}
        {[860, 1000, 1140].map((x, i) => <Fig key={i} id={`sd${i}`} x={x} y={1010 + i * 6} s={0.53} o={trooper('right', i === 1 ? '#c89870' : '#e0a880')} p={P(walkPose(i * 1.2 + 0.4, 0.9), face.smile)} />)}
        <Fig id="adr5" x={1330} y={1030} s={0.56} o={hero('right', {gear: 'rifle+pack', patch: true})} p={P(walkPose(2.3, 0.9), {smile: 0.5})} />
        <Fig id="kd" x={1700} y={1050} s={0.4} o={boy('left', '#6a3a2a')} p={P(idlePose(2.2), arms.wave, face.laugh)} />
        {Array.from({length: 24}, (_, i) => <polygon key={i} points="0,0 20,4 0,14" fill={['#c8201e', '#fff', '#1a2a6a'][i % 3]} transform={`translate(${200 + q() * 1500} ${860 + q() * 100})`} />)}
      </Par>
      <Par d={1}><Motes n={60} seed={4} y0={100} y1={900} c="#fff6d8" o={0.45} r={3} /></Par>
    </Frame>
  );
};
const S5_2: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(.95) hue-rotate(4deg)">
    <Par d={0.1}><defs><radialGradient id="s52" cx=".5" cy=".4" r=".85"><stop offset="0" stopColor="#dcdcd0" /><stop offset=".6" stopColor="#7a8a90" /><stop offset="1" stopColor="#1a2024" /></radialGradient></defs><rect width={W} height={H} fill="url(#s52)" /><g filter="url(#blL)" opacity=".5">{Array.from({length: 10}, (_, i) => <circle key={i} cx={(i * 313) % W} cy={(i * 197) % 700} r={50 + (i % 3) * 40} fill="#fff" opacity={0.4} />)}</g></Par>
    <Par d={1.1}>
      <Fig id="sm" x={760} y={2500} s={1.75} o={{...gent('right', '#14202a', 'cap'), head: 'cap', hat: '#14202a'}} p={P(idlePose(0.5), {uaN: -126, faN: -112, handN: 'relaxed', squint: 0.5, mouth: 0.3, brow: 0.1, head: -2})} light="warm" lit={0.8} />
      <g transform="translate(850 560)"><rect x={0} y={-12} width={64} height={24} rx={10} fill="#c8a040" stroke="#5a4a14" strokeWidth={3} /><circle cx={70} cy={0} r={20} fill="#c8a040" stroke="#5a4a14" strokeWidth={3} /></g>
      <g filter="url(#blM)">{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={1000 + i * 190} cy={540 - i * 40} rx={140 + i * 40} ry={90 + i * 20} fill="#fff" opacity={0.85 - i * 0.14} />)}</g>
      <g transform="translate(1500 700) rotate(-20)"><rect x={-6} y={-200} width={12} height={400} fill="#3a2a1c" /><polygon points="6,-190 200,-150 6,-110" fill="#2a8a4a" /></g>
    </Par>
    <Par d={1}><Motes n={60} seed={4} c="#fff" o={0.5} r={3} /></Par>
  </Frame>
);
const S5_3: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(1.0) hue-rotate(6deg)">
    <Par d={0.1}><rect width={W} height={H} fill="#8a9aa8" /><Rays id="s53r" x={400} y={0} ang={1.4} spread={1.0} len={1300} n={7} o={0.18} />{Array.from({length: 7}, (_, i) => <path key={i} d={`M${i * 330 - 100} 400 Q${i * 330 + 60} -40 ${i * 330 + 220} 400`} fill="none" stroke="#2a2a30" strokeWidth={14} />)}</Par>
    <Par d={0.5}><rect x={760} y={120} width={1160} height={900} fill="#2a4a3a" /><rect x={760} y={120} width={1160} height={900} fill="url(#houseShade)" /><rect x={820} y={200} width={400} height={520} fill="#14100c" /><rect x={860} y={240} width={320} height={440} fill="#2a2018" /><rect x={1300} y={200} width={500} height={300} fill="#c8d8e0" stroke="#14100c" strokeWidth={10} /><path d="M1300 200 L1800 500 M1800 200 L1300 500" stroke="#fff" strokeWidth={4} opacity=".3" /><rect x={760} y={760} width={1160} height={30} fill="#14100c" /><Title x={1550} y={620} text="KELAS 3" size={46} anchor="middle" c="#e8dcb0" ls={6} /></Par>
    <Par d={0.9}><rect y={880} width={W} height={200} fill="#8a8478" /><Mat kind="stone" o={0.5} light={0.3}><rect y={880} width={W} height={200} fill="#8a8478" /></Mat><rect y={880} width={W} height={14} fill="#f4efe0" /></Par>
    <Par d={1}>
      <Fig id="a53" x={1000} y={880} s={0.82} o={hero('right', {gear: 'rifle+pack', patch: true})} p={P(idlePose(0.4), arms.behind, {smile: 0.7, head: -4, torso: -3})} lit={0.9} />
      {[1300, 1500].map((x, i) => <Fig key={i} id={`sb${i}`} x={x} y={900} s={0.52} o={trooper('left', i ? '#c89870' : '#e0a880')} p={P(walkPose(i * 1.5, 0.5), face.smile)} lit={0.8} />)}
      {[240, 460, 690].map((x, i) => <Fig key={i} id={`cr${i}`} x={x} y={1040 + i * 12} s={0.62} o={i === 1 ? lady('right', '#2a6a8a') : gent('right', '#3a3a44', 'bowler')} p={P(idlePose(i * 1.3), arms.wave, face.smile)} />)}
      <Fig id="kd53" x={110} y={1060} s={0.44} o={boy('right', '#6a3a2a')} p={P(idlePose(2.0), arms.wave, face.laugh)} />
    </Par>
    <Par d={1}><Motes n={50} seed={4} c="#fff6d8" o={0.4} r={3} /></Par>
  </Frame>
);
export const crane = (x: number, y: number, s: number) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-14} y={-520} width={28} height={520} fill="#3a3a44" /><rect x={-70} y={-10} width={140} height={14} fill="#3a3a44" /><rect x={-20} y={-560} width={440} height={22} fill="#3a3a44" /><path d="M0 -560 L400 -540 M0 -520 L400 -540" stroke="#3a3a44" strokeWidth={4} /><line x1={380} y1={-540} x2={380} y2={-300} stroke="#14100c" strokeWidth={3} /><rect x={350} y={-300} width={60} height={50} fill="#8a5a2a" stroke="#14100c" strokeWidth={3} /></g>
);
const S5_4: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(.95) hue-rotate(-4deg)">
    <Par d={0.03}><SkyRect id="h54" stops={[[0, '#5a6a8a'], [0.5, '#c8a08a'], [1, '#f6d8a8']]} h={640} /><Clouds n={8} seed={3} y0={60} y1={400} c="#ffd8c0" o={0.5} /><Glow id="h54g" x={300} y={560} r={600} c="#ffe0a8" o={0.8} /><Birds n={9} seed={3} x0={400} x1={1600} y0={140} y1={420} c="#2a2a38" /></Par>
    <Par d={0.25}><Ocean y={600} c1="#4a6a8a" c2="#1a2a3a" seed={9} />{[400, 900, 1400].map((x, i) => <g key={i}><Ship x={x} y={660} s={0.28 - i * 0.04} smoke={i < 2} /></g>)}</Par>
    <Par d={0.6}>{crane(260, 800, 0.9)}{crane(1500, 800, 1.0)}{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={680 + i * 120} y={730 + (i % 2) * 10} width={100} height={80} fill={['#8a5a2a', '#5a6a4a', '#8a3a2a'][i % 3]} stroke="#1a1410" strokeWidth={3} />)}</Par>
    <Par d={0.9}><rect y={800} width={W} height={H - 800} fill="#7a7468" /><Mat kind="stone" o={0.5} light={0.3}><rect y={800} width={W} height={H - 800} fill="#7a7468" /></Mat><rect y={800} width={W} height={H - 800} fill="url(#aoV)" />{Array.from({length: 12}, (_, i) => <rect key={i} x={i * 170} y={800} width={6} height={280} fill="#4a4438" opacity=".4" />)}</Par>
    <Par d={1}>
      {Array.from({length: 7}, (_, i) => <Fig key={i} id={`mh${i}`} x={300 + i * 150} y={970 + (i % 2) * 14} s={0.5} o={trooper('right', i % 2 ? '#c89870' : '#e0a880')} p={P(walkPose(i * 0.9, 1), i === 3 ? face.smile : {})} />)}
      <g><polygon points="1500,800 1740,900 1740,930 1500,830" fill="#5a4a38" stroke="#1a1410" strokeWidth={4} /></g>
      {[1580, 1640].map((x, i) => <Fig key={i} id={`og${i}`} x={x} y={880 + i * 20} s={0.4} o={gent('left', '#3a3a44', 'cap')} p={P(idlePose(i), arms.wave, face.smile)} />)}
    </Par>
    <Par d={1}><Rays id="h54r" x={300} y={560} ang={0.35} spread={1.0} len={1600} o={0.1} /></Par>
  </Frame>
);
const S5_5: React.FC = () => (
  <Frame grade="contrast(1.08) saturate(.85) hue-rotate(4deg)">
    <Par d={0.03}><SkyRect id="c55" stops={[[0, '#6a7a8a'], [0.6, '#aab4b8'], [1, '#d8d8d0']]} h={640} /><Clouds n={9} seed={5} y0={60} y1={440} c="#fff" o={0.6} /><Birds n={10} seed={7} x0={300} x1={1700} y0={140} y1={420} c="#3a3a44" s={1.2} /></Par>
    <Par d={0.15}><g><path d="M0 560 L120 520 L260 540 L400 500 L560 560 Z" fill="#e8e8e0" stroke="#bcbcb0" strokeWidth={3} /><path d="M0 560 L560 560 L560 600 L0 600 Z" fill="#6a7a58" /></g></Par>
    <Par d={0.5}><Ocean y={590} c1="#5a7a8a" c2="#1a2a38" seed={11} /></Par>
    <Par d={1}><Ship x={1120} y={780} s={0.95} />{Array.from({length: 14}, (_, i) => <Fig key={i} id={`cd${i}`} x={730 + i * 44} y={680 - (i % 2) * 6} s={0.095} o={trooper('right')} p={idlePose(i)} lo />)}</Par>
    <Par d={1.3}><Ocean y={900} c1="#3a5a6a" c2="#0a1824" seed={13} />{Array.from({length: 20}, (_, i) => <ellipse key={i} cx={(i * 211) % W} cy={900 + (i * 37) % 160} rx={50} ry={6} fill="#fff" opacity=".4" />)}</Par>
  </Frame>
);
const S5_6: React.FC = () => (
  <Frame grade="contrast(1.1) saturate(.9) hue-rotate(4deg)">
    <Par d={0.1}><SkyRect id="c56" stops={[[0, '#6a7a9a'], [0.6, '#c8b8a8'], [1, '#e8dcc0']]} h={720} /><Clouds n={8} seed={3} y0={80} y1={500} c="#fff" o={0.5} /><rect y={640} width={W} height={440} fill="#2a4a62" /><path d="M0 640 H1920" stroke="#e8e8e0" strokeWidth={6} opacity=".7" />{Array.from({length: 22}, (_, i) => <path key={i} d={`M${i * 100} ${700 + (i % 5) * 50} q30 -14 60 0`} stroke="#fff" strokeWidth={4} fill="none" opacity=".4" />)}</Par>
    <Par d={1.1}>
      <Fig id="a56" x={600} y={2510} s={1.75} o={hero('right', {gear: 'none', patch: true, hat: '#8a8458', head: 'slouch'})} p={P(idlePose(0.5), face.bored, {squint: 0.5, brow: -0.25, head: 1, hatLag: 10})} light="desert" lit={0.85} />
      <g stroke="#fff" strokeWidth={3} opacity=".5">{Array.from({length: 24}, (_, i) => <line key={i} x1={300 + (i * 97) % 1400} y1={200 + (i * 53) % 800} x2={460 + (i * 97) % 1400} y2={190 + (i * 53) % 800} />)}</g>
      {Array.from({length: 30}, (_, i) => <circle key={i} cx={(i * 211) % W} cy={500 + (i * 83) % 500} r={2 + (i % 4) * 1.4} fill="#fff" opacity=".6" />)}
    </Par>
  </Frame>
);
const S5_7: React.FC = () => (
  <Frame grade="contrast(1.05) saturate(1.0)">
    <MapArt focus={[560, 200, 1.9]} trenches year="1914" pts={[[640, 70], [620, 110], [600, 150], [580, 190]]} ship={[640, 70, 90]} mark={[580, 200]} labels={[{x: 360, y: 110, t: 'Inggris', s: 30}, {x: 700, y: 170, t: 'Selat', s: 20}, {x: 520, y: 260, t: 'BELGIA', s: 24, big: true}, {x: 760, y: 290, t: 'PRANCIS', s: 28, big: true}, {x: 560, y: 410, t: 'FRONT BARAT', s: 34, big: true}]} />
  </Frame>
);
const S5_8: React.FC = () => (
  <Frame grade="contrast(1.05) saturate(1.0)">
    <MapArt focus={[560, 230, 4.2]} trenches year="1915" labels={[{x: 560, y: 195, t: 'Ypres', s: 22}, {x: 520, y: 250, t: 'BELGIA', s: 18, big: true}, {x: 600, y: 300, t: 'parit Jerman', s: 12}, {x: 520, y: 315, t: 'parit Sekutu', s: 12}]}>
      <g><circle cx={560} cy={202} r={22} fill="none" stroke="#a8321a" strokeWidth={4} /><circle cx={560} cy={202} r={34} fill="none" stroke="#a8321a" strokeWidth={2} opacity=".6" /></g>
    </MapArt>
  </Frame>
);

export const S4: Record<string, React.FC> = {
  '4.1': S4_1, '4.2': S4_2, '4.3': S4_3, '4.4': S4_4, '4.5': S4_5, '4.6': S4_6, '4.7': S4_7, '4.8': S4_8, '4.9': S4_9, '4.10': S4_10,
  '4.11': S4_11, '4.12': S4_12, '4.13': S4_13, '4.14': S4_14, '4.15': S4_15, '4.16': S4_16, '4.17': S4_17, '4.18': S4_18, '4.19': S4_19, '4.20': S4_20,
  '5.1': S5_1, '5.2': S5_2, '5.3': S5_3, '5.4': S5_4, '5.5': S5_5, '5.6': S5_6, '5.7': S5_7, '5.8': S5_8,
};
