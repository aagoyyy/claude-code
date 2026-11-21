import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Figure, FigureDefs} from '../rig/Figure';
import {Pal, SideOpts, walkPose, idlePose} from '../rig/Side';
import {H, W} from '../world/util';

export const HEROSIDE_FRAMES = 36;
const khaki: Pal = {skin: '#e0a880', hair: '#c9c9c4', top: '#a39c66', bottom: '#8e8858', belt: '#6f4122', boots: '#7a4726', puttee: '#948e5c'};
export const heroOld = (face: 'left' | 'right', extra: Partial<SideOpts> = {}): SideOpts => ({pal: khaki, hero: true, patch: true, scars: true, stump: true, bandages: true, head: 'cap', hat: '#8a8458', face, ...extra});

export const HeroSide: React.FC = () => {
  const f = useCurrentFrame();
  const ph = (f / 36) * Math.PI * 2;
  return (
    <AbsoluteFill style={{background: '#d9b888'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <FigureDefs />
        <rect width={W} height={H} fill="#d9b888" /><rect y={1010} width={W} height={4} fill="#a07a50" />
        <Figure uid="h1" x={560} y={1010} s={0.74} o={heroOld('left')} p={idlePose(f / 6)} light="warm" />
        <Figure uid="h2" x={1360} y={1010} s={0.74} o={heroOld('right', {head: 'none'})} p={walkPose(ph, 1)} light="warm" />
      </svg>
    </AbsoluteFill>
  );
};
