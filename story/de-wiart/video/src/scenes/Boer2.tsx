import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Boer, BOER_FRAMES} from './Boer';
import {BoerA, BOERA_FRAMES} from './BoerA';

export const BOER2_FRAMES = BOERA_FRAMES + BOER_FRAMES;
export const Boer2: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={BOERA_FRAMES}><BoerA /></Sequence>
    <Sequence from={BOERA_FRAMES} durationInFrames={BOER_FRAMES}><Boer cut /></Sequence>
  </AbsoluteFill>
);
