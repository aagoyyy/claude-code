import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Layer, Motes, Plains, Rock, Scroll} from '../world/Savanna';
import {Dunes, dcol, Fort, SandStreaks, Scrub, SkyHot} from '../world/Desert';
import {Cam, clamp, easeOut, H, W} from '../world/util';
import {Figure, FigureDefs} from '../rig/Figure';
import {idlePose, Pal, SideOpts, walkPose} from '../rig/Side';
import {Post} from '../fx/Post';

export const SOMALIA_FRAMES = 120;
const SPEED = 16;
const khaki: Pal = {skin: '#e0a880', hair: '#4a3020', top: '#b2a878', bottom: '#9a9068', belt: '#6f4122', boots: '#7a4726', puttee: '#a29a6a'};
export const heroPith = (face: 'left' | 'right', extra: Partial<SideOpts> = {}): SideOpts => ({pal: khaki, hero: true, young: true, head: 'pith', hat: '#eadfc4', face, ...extra});
export const askari = (face: 'left' | 'right', gear: SideOpts['gear'] = 'rifle+pack'): SideOpts => ({pal: {skin: '#7a4a30', hair: '#1a1410', top: '#b2a070', bottom: '#9a8a5c', belt: '#5a3a22', boots: '#5a3a22', puttee: '#a29a6a'}, head: 'turban', hat: '#efe7d0', gear, face, mustache: true});
export const dervish = (face: 'left' | 'right'): SideOpts => ({pal: {skin: '#6a4028', hair: '#1a1410', top: '#e8dcc0', bottom: '#d8cca8', belt: '#5a3a22', boots: '#5a3a22'}, head: 'turban', hat: '#f2ead6', gear: 'spear', face, mustache: true});
export const officer = (face: 'left' | 'right'): SideOpts => ({pal: {...khaki, skin: '#d9a07a', hair: '#6a4a30'}, head: 'pith', hat: '#eadfc4', gear: 'none', face, mustache: true});

export const SomaliA: React.FC = () => {
  const f = useCurrentFrame();
  const T = f * SPEED;
  const ph = (f / 36) * Math.PI * 2;
  const camFar: Cam = {x: T, y: 0, zoom: 1.0 + f * 0.0009};
  const cam0: Cam = {x: 0, y: Math.sin(f * 0.35) * 1.5, zoom: 1.0 + f * 0.0004};
  const capIn = easeOut((f - 12) / 12), capOut = 1 - easeOut((f - 96) / 14);
  const fade = clamp(f / 12) * (1 - clamp((f - (SOMALIA_FRAMES - 4)) / 4));
  const marching = [0, 1, 2].map((i) => ({x: 650 - i * 190 - f * 0.8, ph: ph + i * 1.9}));
  const wall = [-70, 10, 90, 170, 250].map((lx, i) => ({x: 1450 + lx * 0.82, y: 700 - 130 * 0.82, i}));

  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <Layer cam={camFar} depth={0.02}><SkyHot f={f} /></Layer>
      <Layer cam={camFar} depth={0.06} blur={0.6}><Dunes seed={2} base={650} amp={34} haze={0.66} /></Layer>
      <Layer cam={camFar} depth={0.12}>
        <FigureDefs />
        <Fort x={1450} y={700} s={0.82} f={f} haze={0.52} />
        {wall.map((w) => <Figure key={w.i} uid={`df${w.i}`} x={w.x} y={w.y + 2} s={0.042} o={dervish('left')} p={{...idlePose(f / 7 + w.i), uaN: -30, faN: -40}} light="desert" lo />)}
      </Layer>
      <Layer cam={camFar} depth={0.2} blur={0.5}><Dunes seed={5} base={705} amp={44} haze={0.46} /></Layer>
      <Layer cam={camFar} depth={0.28}><Plains seed={15} y0={700} y1={800} count={420} haze0={0.55} haze1={0.4} colorAt={dcol} haze="#fbe2b4" /></Layer>
      <Layer cam={camFar} depth={0.3}>
        <Rock id="sar1" x={330} y={790} w={110} h={70} seed={21} haze={0.4} />
        <Rock id="sar2" x={1180} y={792} w={80} h={54} seed={22} haze={0.42} />
      </Layer>
      <Layer cam={cam0} depth={0.5}>
        <Scroll off={T * 0.5}><Plains seed={16} y0={770} y1={880} count={460} haze0={0.35} haze1={0.22} fade={1} colorAt={dcol} haze="#fbe2b4" /></Scroll>
        <Scroll off={T * 0.5} P={2720}><Scrub seed={3} count={9} y0={790} y1={870} f={f} /></Scroll>
      </Layer>
      <Layer cam={cam0} depth={0.78}>
        <FigureDefs />
        <Scroll off={T * 0.78}><Plains seed={17} y0={850} y1={960} count={500} haze0={0.18} haze1={0.1} fade={1} colorAt={dcol} haze="#fbe2b4" /></Scroll>
        <Scroll off={T * 0.78} P={2720}><Scrub seed={4} count={7} y0={880} y1={950} f={f} /></Scroll>
        {marching.map((m, i) => <Figure key={i} uid={`sm${i}`} x={m.x} y={896} s={0.44} o={i === 0 ? officer('right') : askari('right')} p={walkPose(m.ph, 0.95)} light="desert" lo />)}
      </Layer>
      <Layer cam={cam0} depth={1.0}>
        <FigureDefs />
        <Scroll off={T}><Plains seed={18} y0={930} y1={1080} count={520} haze0={0.08} haze1={0.0} fade={1} colorAt={dcol} haze="#fbe2b4" /></Scroll>
        <Figure uid="hero" x={900} y={935} s={0.567} o={heroPith('right')} p={walkPose(ph, 1)} light="desert" lit={0.9} />
      </Layer>
      <Layer cam={cam0} depth={1.3} blur={2}><SandStreaks f={f} seed={5} count={22} /></Layer>
      <Layer cam={cam0} depth={1.5} blur={3}><Scroll off={T * 1.5} P={2720}><Scrub seed={9} count={4} y0={1050} y1={1110} f={f} /></Scroll></Layer>
      <Layer cam={cam0} depth={1.7} blur={2}><Motes f={f} seed={64} count={24} size={3} speed={2.4} /></Layer>
      <Layer cam={cam0} depth={2.6} blur={14}><Motes f={f} seed={65} count={7} size={18} speed={4} /></Layer>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
        <g opacity={capIn * capOut} transform={`translate(${(1 - capIn) * -30} 0)`}>
          <rect x={96} y={866} width={4} height={86} fill="#7a4a2c" />
          <text x={120} y={906} fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={40} letterSpacing={6} fill="#4a2a18">SOMALILAND</text>
          <text x={120} y={946} fontFamily="Georgia, serif" fontStyle="italic" fontSize={32} fill="#6a4630">1914</text>
        </g>
      </svg>
      <Post f={f} fade={fade} />
    </AbsoluteFill>
  );
};
