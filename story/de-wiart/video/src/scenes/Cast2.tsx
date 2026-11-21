import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Figure, FigureDefs} from '../rig/Figure';
import {Actors, Mounts, Spec} from '../fx/Battle';
import {idlePose, Pal, SideOpts, walkPose} from '../rig/Side';
import {H, W} from '../world/util';

export const CAST2_FRAMES = 60;
const khaki: Pal = {skin: '#e0a880', hair: '#3a2a1c', top: '#a39c66', bottom: '#8e8858', belt: '#6f4122', boots: '#7a4726', puttee: '#948e5c'};
const dying = (id: string, x: number, die: Spec['die'], face: 'left' | 'right' = 'right'): Spec => ({id, o: {pal: khaki, head: 'brodie', hat: '#7c7a5a', gear: 'rifle', face}, x, y: 920, s: 0.3, face, mode: 'run', vx: 3, stopAt: 4, dieAt: 4, die});

export const Cast2: React.FC = () => {
  const f = useCurrentFrame();
  const ph = (f / 36) * Math.PI * 2;
  const people: {o: SideOpts; p: any}[] = [
    {o: {pal: {skin: '#e8b898', hair: '#4a2a18', top: '#f0ece2', bottom: '#4a4a5a', belt: '#3a2a1a', boots: '#241810'}, head: 'nursecap', hat: '#f4f0e6', outfit: 'skirt', apron: true, hairStyle: 'bun', build: 0.88}, p: walkPose(ph, 0.8)},
    {o: {pal: {skin: '#e0a880', hair: '#6a3a22', top: '#7a5a4a', bottom: '#5a4a3a', belt: '#3a2a1a', boots: '#241810'}, head: 'scarf', hat: '#b8a888', outfit: 'skirt', build: 0.9, hairStyle: 'long'}, p: idlePose(f / 8)},
    {o: {pal: {skin: '#d9a07a', hair: '#5a3a22', top: '#6a6a5a', bottom: '#4a4034', belt: '#3a2a1a', boots: '#2a1c12'}, head: 'flatcap', hat: '#5a4a3a', mustache: true, build: 1.0}, p: walkPose(ph + 1, 0.8)},
    {o: {pal: {...khaki, skin: '#d9a07a', hair: '#6a4a30'}, head: 'pith', hat: '#eadfc4', mustache: true, stretch: 1.1, build: 0.9}, p: idlePose(f / 9)},
    {o: {pal: khaki, head: 'slouch', hat: '#8a7448', beard: true, stretch: 0.94, build: 1.3, gear: 'rifle'}, p: walkPose(ph + 2, 0.8)},
  ];
  return (
    <AbsoluteFill style={{background: '#d9b888'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <FigureDefs />
        <rect width={W} height={H} fill="#d9b888" /><rect y={560} width={W} height={4} fill="#a07a50" /><rect y={1010} width={W} height={4} fill="#a07a50" />
        <Mounts f={f} list={[
          {id: 'h1', a: {kind: 'horse', coat: '#7a4a2a', mane: '#241810', tack: true}, x: 380, y: 560, s: 0.36, face: 'right', rider: {pal: {...khaki, hair: '#4a3020'}, head: 'slouch', hat: '#8a7448', hero: true, young: true, mustache: true}},
          {id: 'c1', a: {kind: 'camel', coat: '#b88a58', mane: '#6a4a2a', tack: true}, x: 1000, y: 560, s: 0.3, face: 'left', rider: {pal: {skin: '#7a4a30', hair: '#1a1410', top: '#b2a070', bottom: '#9a8a5c', belt: '#5a3a22', boots: '#5a3a22'}, head: 'turban', hat: '#efe7d0', mustache: true}},
          {id: 'h2', a: {kind: 'horse', coat: '#d8d0c0', mane: '#8a8478'}, x: 1560, y: 560, s: 0.34, face: 'right'},
        ]} />
        {people.map((c, i) => <Figure key={i} uid={`pp${i}`} x={170 + i * 150} y={1000} s={0.3} o={{...c.o, face: 'right'}} p={c.p} />)}
      </svg>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
        <Actors f={f} specs={[dying('d1', 1000, 'back'), dying('d2', 1180, 'forward'), dying('d3', 1360, 'stumble'), dying('d4', 1560, 'crawl')]} />
      </svg>
    </AbsoluteFill>
  );
};
