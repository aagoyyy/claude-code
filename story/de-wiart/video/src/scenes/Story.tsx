import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Boer, BOER_FRAMES} from './Boer';
import {BoerShot1, BoerShot3} from './BoerBattle';
import {Somali, SOMALI_FRAMES} from './Somali';
import {SomaliShot1, SomaliShot3} from './SomaliBattle';
import {Ypres, YPRES_FRAMES} from './Ypres';
import {YpresShot1} from './YpresBattle';
import {Transition, TRANS_FRAMES} from './Transition';

const SH = 132;
export const BOERCH = SH + BOER_FRAMES + SH;
export const SOMCH = SH + SOMALI_FRAMES + SH;
export const YPRCH = SH + YPRES_FRAMES;
export const STORY_FRAMES = BOERCH + TRANS_FRAMES + SOMCH + TRANS_FRAMES + YPRCH;

export const BoerChapter: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={SH}><BoerShot1 /></Sequence>
    <Sequence from={SH} durationInFrames={BOER_FRAMES}><Boer cut /></Sequence>
    <Sequence from={SH + BOER_FRAMES} durationInFrames={SH}><BoerShot3 /></Sequence>
  </AbsoluteFill>
);
export const SomaliChapter: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={SH}><SomaliShot1 /></Sequence>
    <Sequence from={SH} durationInFrames={SOMALI_FRAMES}><Somali cut /></Sequence>
    <Sequence from={SH + SOMALI_FRAMES} durationInFrames={SH}><SomaliShot3 /></Sequence>
  </AbsoluteFill>
);
export const YpresChapter: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={SH}><YpresShot1 /></Sequence>
    <Sequence from={SH} durationInFrames={YPRES_FRAMES}><Ypres cut /></Sequence>
  </AbsoluteFill>
);

export const Story: React.FC = () => {
  let t = 0;
  const seq = (d: number) => { const from = t; t += d; return from; };
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence from={seq(BOERCH)} durationInFrames={BOERCH}><BoerChapter /></Sequence>
      <Sequence from={seq(TRANS_FRAMES)} durationInFrames={TRANS_FRAMES}><Transition from={1899} to={1914} place="SOMALILAND" /></Sequence>
      <Sequence from={seq(SOMCH)} durationInFrames={SOMCH}><SomaliChapter /></Sequence>
      <Sequence from={seq(TRANS_FRAMES)} durationInFrames={TRANS_FRAMES}><Transition from={1914} to={1915} place="YPRES, BELGIA" /></Sequence>
      <Sequence from={seq(YPRCH)} durationInFrames={YPRCH}><YpresChapter /></Sequence>
    </AbsoluteFill>
  );
};
