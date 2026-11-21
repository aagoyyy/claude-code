import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Figure, FigureDefs} from '../rig/Figure';
import {aimPose, idlePose, kneelPose, Pal, SideOpts, walkPose} from '../rig/Side';
import {H, W} from '../world/util';

export const CAST_FRAMES = 48;
const khaki: Pal = {skin: '#e0a880', hair: '#3a2a1c', top: '#a39c66', bottom: '#8e8858', belt: '#6f4122', boots: '#7a4726', puttee: '#948e5c'};
const hero = (extra: Partial<SideOpts> = {}): SideOpts => ({pal: {...khaki, hair: '#c9c9c4'}, hero: true, head: 'cap', hat: '#8a8458', ...extra});
const soldier = (extra: Partial<SideOpts> = {}): SideOpts => ({pal: khaki, head: 'brodie', hat: '#7c7a5a', gear: 'rifle', ...extra});

export const Cast: React.FC = () => {
  const f = useCurrentFrame();
  const ph = (f / 48) * Math.PI * 2;
  const row = (y: number, face: 'left' | 'right', xs: number[]) => {
    const dark = '#5a4e3a';
    const list: {o: SideOpts; p: any}[] = [
      {o: hero({face, patch: true, stump: true, bandages: true}), p: walkPose(ph, 1)},
      {o: soldier({face}), p: walkPose(ph + 1, 0.9)},
      {o: {pal: {...khaki, skin: '#e0a880', hair: '#5a3a22', top: '#8a7a4a', bottom: '#6a5a3a', puttee: undefined}, head: 'slouch', hat: '#7a5a3a', beard: true, gear: 'rifle', face}, p: aimPose(f / 6)},
      {o: {pal: {skin: '#8a5a3a', hair: '#1a1410', top: '#e8dcc0', bottom: '#d8cca8', belt: '#5a3a22', boots: '#5a3a22'}, head: 'turban', hat: '#efe7d0', gear: 'spear', face, mustache: true}, p: walkPose(ph + 2, 1.1)},
      {o: {pal: {...khaki, top: '#5a6a5a', bottom: '#4e5a4e', puttee: undefined, boots: '#1d1109'}, head: 'stahl', hat: '#4a5058', gear: 'rifle+pack', face}, p: walkPose(ph + 3, 0.8)},
      {o: {pal: {...khaki, top: '#6a7a62', bottom: '#58645a', puttee: undefined}, head: 'bustina', hat: '#6a7a62', face}, p: idlePose(f / 8)},
      {o: {pal: {...khaki, top: '#cfc9b8', bottom: '#8e8858'}, head: 'cap', hat: '#d8d2c0', face}, p: kneelPose(f / 8)},
    ];
    return list.map((c, i) => <Figure key={`${face}${i}`} uid={`c${face}${i}`} x={xs[i]} y={y} s={0.3} o={c.o} p={c.p} light="warm" />);
  };
  const xs = [160, 440, 720, 1000, 1280, 1540, 1780];
  return (
    <AbsoluteFill style={{background: '#caa878'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <FigureDefs />
        <rect width={W} height={H} fill="#d9b888" />
        <rect y={440} width={W} height={4} fill="#a07a50" /><rect y={900} width={W} height={4} fill="#a07a50" />
        {row(430, 'right', xs)}
        {row(890, 'left', xs)}
      </svg>
    </AbsoluteFill>
  );
};
