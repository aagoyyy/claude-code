import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Layer, Motes, Plains, Scroll} from '../world/Savanna';
import {Beams, DeadTree, Flare, flareLight, mcol, NHAZE, Rain, Ruins, Sandbags, SkyNight, Smoke, Wire} from '../world/Trench';
import {Cam, clamp, easeOut, H, W} from '../world/util';
import {Figure, FigureDefs} from '../rig/Figure';
import {idlePose, Pal, SideOpts, walkPose} from '../rig/Side';
import {Post} from '../fx/Post';

export const YPRESA_FRAMES = 132;
const SPEED = 14;
const khaki: Pal = {skin: '#e0a880', hair: '#4a3020', top: '#8e8a62', bottom: '#7a7656', belt: '#5a3a22', boots: '#4a2e1c', puttee: '#7a7650'};
export const heroTrench = (face: 'left' | 'right', extra: Partial<SideOpts> = {}): SideOpts => ({pal: khaki, hero: true, young: true, patch: true, scars: true, head: 'cap', hat: '#6e6c4a', face, ...extra});
export const tommyW1 = (face: 'left' | 'right', skin = '#e0a880', gear: SideOpts['gear'] = 'rifle+pack'): SideOpts => ({pal: {...khaki, skin}, head: 'brodie', hat: '#6a6a50', gear, face});
export const german = (face: 'left' | 'right'): SideOpts => ({pal: {skin: '#d9a07a', hair: '#5a3a22', top: '#5a6a5a', bottom: '#4e5a4e', belt: '#2a1a10', boots: '#1d1109'}, head: 'stahl', hat: '#4a5058', gear: 'rifle', rifle: 'mauser', face});
export const medic = (face: 'left' | 'right'): SideOpts => ({pal: {...khaki, top: '#a9a68a', bottom: '#7a7656'}, head: 'cap', hat: '#bdb99a', gear: 'none', face});

export const FLARES = [
  {x: 1250, y0: 250, t0: -30, drop: 0.9},
  {x: 560, y0: 230, t0: 92, drop: 0.8},
  {x: 1500, y0: 260, t0: 196, drop: 0.9},
];

export const YpresA: React.FC = () => {
  const f = useCurrentFrame();
  const T = f * SPEED;
  const ph = (f / 38) * Math.PI * 2;
  const G = clamp(FLARES.reduce((a, o) => a + flareLight(f - o.t0), 0) * 0.85 + 0.15);
  const camFar: Cam = {x: T, y: 0, zoom: 1.0 + f * 0.0004};
  const cam0: Cam = {x: 0, y: Math.sin(f * 0.33) * 1.5, zoom: 1.0 + f * 0.0004};
  const capIn = easeOut((f - 12) / 12), capOut = 1 - easeOut((f - 100) / 14);
  const fade = clamp(f / 12) * (1 - clamp((f - (YPRESA_FRAMES - 4)) / 4));
  const walkers = [0, 1].map((i) => ({x: 2100 + i * 230 - f * 14.5, ph: ph * 1.05 + i * 2.2}));
  const leaners = [260, 520, 1500, 1720].map((x, i) => ({x: x - f * 0.7, i}));

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Layer cam={camFar} depth={0.02}><SkyNight f={f} glow={G} /></Layer>
      <Layer cam={camFar} depth={0.05} blend="screen" opacity={0.8}><Beams f={f} /></Layer>
      <Layer cam={camFar} depth={0.08}><Ruins haze={0.5} /></Layer>
      <Layer cam={camFar} depth={0.09} blur={9}>
        <Smoke f={f} x={330} y={700} seed={3} w={200} />
        <Smoke f={f + 60} x={1540} y={700} seed={5} w={240} />
      </Layer>
      <Layer cam={camFar} depth={0.1} blur={1.2}>{FLARES.map((o, i) => <Flare key={i} x={o.x} y0={o.y0} t={f - o.t0} drop={o.drop} />)}</Layer>
      <Layer cam={camFar} depth={0.28}><Plains seed={25} y0={700} y1={800} count={380} haze0={0.6} haze1={0.45} colorAt={mcol} haze={NHAZE} /></Layer>
      <Layer cam={camFar} depth={0.3}>
        <Wire y={772} x0={-400} x1={2300} s={0.5} haze={0.6} seed={2} />
        <DeadTree x={280} y={780} s={0.62} haze={0.56} seed={4} />
        <DeadTree x={1560} y={784} s={0.7} haze={0.54} seed={7} />
      </Layer>
      <Layer cam={cam0} depth={0.5}>
        <Scroll off={T * 0.5}><Plains seed={26} y0={770} y1={880} count={420} haze0={0.4} haze1={0.28} fade={1} colorAt={mcol} haze={NHAZE} /></Scroll>
        <Scroll off={T * 0.5} P={3000}><Wire y={846} x0={0} x1={3000} s={0.85} haze={0.4} seed={3} /><DeadTree x={1740} y={850} s={0.9} haze={0.4} seed={9} /><DeadTree x={420} y={850} s={0.8} haze={0.42} seed={10} /></Scroll>
        <FigureDefs />
        {walkers.map((w, i) => <Figure key={i} uid={`yw${i}`} x={w.x} y={846} s={0.3} o={tommyW1('left', i ? '#c89870' : '#e0a880', i ? 'rifle' : 'rifle+pack')} p={walkPose(w.ph, 0.9)} light="night" lit={G} lo />)}
      </Layer>
      <Layer cam={cam0} depth={0.78}>
        <Scroll off={T * 0.78}><Plains seed={27} y0={850} y1={960} count={460} haze0={0.22} haze1={0.12} fade={1} colorAt={mcol} haze={NHAZE} /></Scroll>
      </Layer>
      <Layer cam={cam0} depth={0.8}>
        <FigureDefs />
        {leaners.map((l) => <Figure key={l.i} uid={`yl${l.i}`} x={l.x} y={930} s={0.46} o={tommyW1(l.i < 2 ? 'right' : 'left', l.i % 2 ? '#c89870' : '#e0a880')} p={idlePose(f / 9 + l.i)} light="night" lit={G} lo />)}
      </Layer>
      <Layer cam={cam0} depth={0.82}><Scroll off={T * 0.82} P={2900}><Sandbags y={915} x0={0} x1={2900} rows={2} s={0.9} light={G} seed={11} /></Scroll></Layer>
      <Layer cam={cam0} depth={1.0}>
        <FigureDefs />
        <Scroll off={T}><Plains seed={28} y0={930} y1={1080} count={480} haze0={0.1} haze1={0.0} fade={1} colorAt={mcol} haze={NHAZE} /></Scroll>
        <Figure uid="hero" x={900} y={935} s={0.567} o={heroTrench('right')} p={walkPose(ph, 0.9)} light="night" lit={0.3 + 0.9 * G} />
      </Layer>
      <Layer cam={cam0} depth={1.3} blur={1}><Rain f={f} seed={7} count={70} /></Layer>
      <Layer cam={cam0} depth={1.6} blur={3.5}><Scroll off={T * 1.6} P={2900}><Sandbags y={1130} x0={0} x1={1000} rows={3} s={1.8} light={G * 0.6} seed={21} /><Sandbags y={1130} x0={1600} x1={2900} rows={3} s={1.8} light={G * 0.6} seed={22} /></Scroll></Layer>
      <Layer cam={cam0} depth={1.7} blur={2}><Motes f={f} seed={91} count={22} size={3} speed={2.2} /></Layer>
      <Layer cam={cam0} depth={2.5} blur={14}><Motes f={f} seed={92} count={7} size={18} speed={3.5} /></Layer>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen', opacity: 0.34 * G}}><rect width={W} height={H} fill="#7fd8b8" /></svg>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
        <g opacity={capIn * capOut} transform={`translate(${(1 - capIn) * -30} 0)`}>
          <rect x={96} y={866} width={4} height={86} fill="#e0b86a" />
          <text x={120} y={906} fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={40} letterSpacing={6} fill="#f6e8c8">YPRES, BELGIA</text>
          <text x={120} y={946} fontFamily="Georgia, serif" fontStyle="italic" fontSize={32} fill="#d9c7a0">1915 · Perang Dunia I</text>
        </g>
      </svg>
      <Post f={f} fade={fade} night />
    </AbsoluteFill>
  );
};

export const nurse = (face: 'left' | 'right'): SideOpts => ({pal: {skin: '#e8b898', hair: '#4a2a18', top: '#f0ece2', bottom: '#4a4a5a', belt: '#3a2a1a', boots: '#241810'}, head: 'nursecap', hat: '#f4f0e6', outfit: 'skirt', apron: true, hairStyle: 'bun', build: 0.88, face});
