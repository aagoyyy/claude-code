import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Ypres, YPRES_FRAMES} from './Ypres';
import {YpresA, YPRESA_FRAMES} from './YpresA';

export const YPRES2_FRAMES = YPRESA_FRAMES + YPRES_FRAMES;
export const Ypres2: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={YPRESA_FRAMES}><YpresA /></Sequence>
    <Sequence from={YPRESA_FRAMES} durationInFrames={YPRES_FRAMES}><Ypres cut /></Sequence>
  </AbsoluteFill>
);
