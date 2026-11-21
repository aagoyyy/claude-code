import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Boer, BOER_FRAMES} from './Boer';
import {BoerShot1, BoerShot3} from './BoerBattle';
import {Somali, SOMALI_FRAMES} from './Somali';
import {SomaliShot1, SomaliShot3} from './SomaliBattle';
import {Ypres, YPRES_FRAMES} from './Ypres';
import {YpresShot1} from './YpresBattle';
import {MapTransition, MAP_FRAMES, MedalInsert, MEDAL_FRAMES} from './Inserts';
import {WW2Chapter, WW2_FRAMES} from './WW2';
import {clamp} from '../world/util';

const SH = 132;
export const BOERCH = SH + BOER_FRAMES + SH;
export const SOMCH = SH + SOMALI_FRAMES + SH;
export const YPRCH = SH + YPRES_FRAMES;
const OV = 8;                                   // every chapter / insert dissolves into the next over 8 frames (no black dips)

/** start frame of each block in the final film (the audio is timed against these) */
export const STARTS = (() => {
  const b = [BOERCH, MAP_FRAMES, SOMCH, MAP_FRAMES, YPRCH, MEDAL_FRAMES, MAP_FRAMES, WW2_FRAMES];
  const st: number[] = [];
  let t = 0;
  b.forEach((d) => { st.push(t); t += d - OV; });
  return {starts: st, total: st[st.length - 1] + WW2_FRAMES};
})();
export const STORY_FRAMES = STARTS.total;

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

/** the incoming block fades in over the one before it (cross-dissolve) */
const Dis: React.FC<{first?: boolean; children: React.ReactNode}> = ({first, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: first ? 1 : clamp(f / OV)}}>{children}</AbsoluteFill>;
};

export const Story: React.FC = () => {
  const f = useCurrentFrame();
  const S = STARTS.starts;
  const fadeIn = 1 - clamp(f / 14), fadeOut = clamp((f - (STORY_FRAMES - 20)) / 20);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence from={S[0]} durationInFrames={BOERCH}><Dis first><BoerChapter /></Dis></Sequence>
      <Sequence from={S[1]} durationInFrames={MAP_FRAMES}><Dis><MapTransition from={[600, 860, 'Afrika Selatan']} to={[930, 420, 'Somaliland']} y0={1899} y1={1914} sub="SOMALILAND" /></Dis></Sequence>
      <Sequence from={S[2]} durationInFrames={SOMCH}><Dis><SomaliChapter /></Dis></Sequence>
      <Sequence from={S[3]} durationInFrames={MAP_FRAMES}><Dis><MapTransition from={[930, 420, 'Somaliland']} to={[480, -90, 'Ypres, Belgia']} y0={1914} y1={1915} sub="YPRES, BELGIA" /></Dis></Sequence>
      <Sequence from={S[4]} durationInFrames={YPRCH}><Dis><YpresChapter /></Dis></Sequence>
      <Sequence from={S[5]} durationInFrames={MEDAL_FRAMES}><Dis><MedalInsert /></Dis></Sequence>
      <Sequence from={S[6]} durationInFrames={MAP_FRAMES}><Dis><MapTransition from={[480, -90, 'Ypres, Belgia']} to={[590, 150, 'Libya']} y0={1915} y1={1941} sub="LIBYA" /></Dis></Sequence>
      <Sequence from={S[7]} durationInFrames={WW2_FRAMES}><Dis><WW2Chapter /></Dis></Sequence>
      <AbsoluteFill style={{background: '#000', opacity: Math.max(fadeIn, fadeOut), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
