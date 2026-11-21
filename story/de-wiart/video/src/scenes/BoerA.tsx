import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Acacia, Grass, Hills, Layer, Motes, Mountains, Plains, Rays, Rock, Scroll, Sky} from '../world/Savanna';
import {Cam, clamp, easeOut, H, W} from '../world/util';
import {Figure, FigureDefs} from '../rig/Figure';
import {aimPose, Pal, SideOpts, walkPose} from '../rig/Side';
import {Post} from '../fx/Post';

export const BOERA_FRAMES = 120;
const SPEED = 16;     // px/frame of the depth-1 plane
const khaki: Pal = {skin: '#e0a880', hair: '#3a2a1c', top: '#a39c66', bottom: '#8e8858', belt: '#6f4122', boots: '#7a4726', puttee: '#948e5c'};
export const heroYoung = (face: 'left' | 'right'): SideOpts => ({pal: {...khaki, hair: '#4a3020'}, hero: true, young: true, head: 'slouch', hat: '#8a7448', face});
export const tommy = (face: 'left' | 'right', skin = '#e0a880'): SideOpts => ({pal: {...khaki, skin, hair: '#3a2a1c'}, head: 'slouch', hat: '#8a7448', gear: 'rifle+pack', face});
export const boer = (face: 'left' | 'right'): SideOpts => ({pal: {skin: '#d9a07a', hair: '#5a3a22', top: '#7a6a48', bottom: '#5a4a34', belt: '#3a2a1a', boots: '#3a2a1a'}, head: 'slouch', hat: '#6a5030', beard: true, gear: 'rifle', face});

export const BoerA: React.FC = () => {
  const f = useCurrentFrame();
  const T = f * SPEED;
  const ph = (f / 36) * Math.PI * 2;
  const camFar: Cam = {x: T, y: 0, zoom: 1.0 + f * 0.0004};
  const cam0: Cam = {x: 0, y: Math.sin(f * 0.35) * 1.5, zoom: 1.0 + f * 0.0004};
  const capIn = easeOut((f - 12) / 12), capOut = 1 - easeOut((f - 96) / 14);
  const fade = clamp(f / 12) * (1 - clamp((f - (BOERA_FRAMES - 4)) / 4));
  const marching = [0, 1, 2].map((i) => ({x: 640 - i * 190 - f * 0.9, ph: ph + i * 1.7}));
  const oncoming = [0, 1, 2, 3].map((i) => ({x: 2300 + i * 190 - f * 16, ph: ph * 1.05 + i * 2.1}));

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Layer cam={camFar} depth={0.02}><Sky f={f} /></Layer>
      <Layer cam={camFar} depth={0.06}>
        <Mountains />
      </Layer>
      <Layer cam={camFar} depth={0.12} blend="screen" opacity={0.9}><Rays f={f} /></Layer>
      <Layer cam={camFar} depth={0.12} blur={0.8}><Hills seed={21} base={668} amp={34} haze={0.62} /></Layer>
      <Layer cam={camFar} depth={0.2} blur={0.5}><Hills seed={33} base={702} amp={42} haze={0.46} /></Layer>
      <Layer cam={camFar} depth={0.28} blur={0.4}><Plains seed={5} y0={690} y1={800} count={700} haze0={0.55} haze1={0.4} sunPatch /></Layer>
      <Layer cam={camFar} depth={0.3}>
        <Rock id="rka" x={1480} y={786} w={150} h={96} seed={4} haze={0.3} />
        <Rock id="rkb" x={1610} y={790} w={100} h={140} seed={9} haze={0.3} />
        <Rock id="rkc" x={250} y={780} w={90} h={60} seed={19} haze={0.34} />
      </Layer>
      <Layer cam={camFar} depth={0.3}>
        <FigureDefs />
        <Figure uid="mk" x={1700} y={790} s={0.2} o={boer('left')} p={aimPose(f / 6)} light="warm" lo />
      </Layer>

      <Layer cam={cam0} depth={0.5}>
        <FigureDefs />
        <Scroll off={T * 0.5}><Plains seed={6} y0={770} y1={880} count={800} haze0={0.35} haze1={0.22} fade={1} /></Scroll>
        <Scroll off={T * 0.5 * 1.0} P={3000}>
          <Acacia x={1560} y={812} s={0.95} seed={31} haze={0.3} />
          <Acacia x={300} y={806} s={0.62} seed={32} haze={0.36} />
          <Acacia x={2300} y={808} s={0.8} seed={33} haze={0.32} />
        </Scroll>
        {oncoming.map((o, i) => <Figure key={i} uid={`on${i}`} x={o.x} y={830} s={0.3} o={tommy('left', i % 2 ? '#c89870' : '#e0a880')} p={walkPose(o.ph, 0.9)} light="warm" lo />)}
      </Layer>
      <Layer cam={cam0} depth={0.78}>
        <FigureDefs />
        <Scroll off={T * 0.78}><Plains seed={7} y0={850} y1={960} count={900} haze0={0.18} haze1={0.1} fade={1} /></Scroll>
        <Scroll off={T * 0.78}><Grass f={f} seed={41} count={160} yMin={860} yMax={955} hMin={30} hMax={70} cDark="#6a5a2a" cLite="#d9b868" sway={0.8} /></Scroll>
        {marching.map((m, i) => <Figure key={i} uid={`mr${i}`} x={m.x} y={896} s={0.44} o={tommy('right', i === 1 ? '#c89870' : '#e0a880')} p={walkPose(m.ph, 0.95)} light="warm" lo />)}
      </Layer>
      <Layer cam={cam0} depth={1.0}>
        <FigureDefs />
        <Scroll off={T}><Plains seed={8} y0={930} y1={1080} count={900} haze0={0.08} haze1={0.0} fade={1} /></Scroll>
        <Figure uid="hero" x={900} y={935} s={0.567} o={heroYoung('right')} p={walkPose(ph, 1)} light="warm" />
      </Layer>
      <Layer cam={cam0} depth={1.5} blur={2.4}>
        <Scroll off={T * 1.5}><Grass f={f} seed={51} count={150} yMin={1040} yMax={1100} hMin={140} hMax={300} cDark="#3a2f16" cLite="#a98a46" sway={1.4} /></Scroll>
      </Layer>
      <Layer cam={cam0} depth={1.7} blur={2}><Motes f={f} seed={61} count={26} size={3} speed={2.4} /></Layer>
      <Layer cam={cam0} depth={2.6} blur={14}><Motes f={f} seed={72} count={8} size={16} speed={4} /></Layer>
      <Layer cam={cam0} depth={0.5} blur={0.6}><Motes f={f} seed={62} count={60} size={1.8} speed={1.2} /></Layer>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
        <g opacity={capIn * capOut} transform={`translate(${(1 - capIn) * -30} 0)`}>
          <rect x={96} y={866} width={4} height={86} fill="#e0b86a" />
          <text x={120} y={906} fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={40} letterSpacing={6} fill="#f6e8c8">AFRIKA SELATAN</text>
          <text x={120} y={946} fontFamily="Georgia, serif" fontStyle="italic" fontSize={32} fill="#d9c7a0">1899 · Perang Boer</text>
        </g>
      </svg>
      <Post f={f} fade={fade} />
    </AbsoluteFill>
  );
};
