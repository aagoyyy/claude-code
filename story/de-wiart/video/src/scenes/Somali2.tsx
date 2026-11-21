import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Somali, SOMALI_FRAMES} from './Somali';
import {SomaliA, SOMALIA_FRAMES} from './SomaliA';

export const SOMALI2_FRAMES = SOMALIA_FRAMES + SOMALI_FRAMES;
export const Somali2: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={SOMALIA_FRAMES}><SomaliA /></Sequence>
    <Sequence from={SOMALIA_FRAMES} durationInFrames={SOMALI_FRAMES}><Somali cut /></Sequence>
  </AbsoluteFill>
);
