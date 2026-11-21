import React from 'react';
import {Composition} from 'remotion';
import {Boer, BOER_FRAMES, FPS} from './scenes/Boer';
import {Somali, SOMALI_FRAMES} from './scenes/Somali';
import {Ypres, YPRES_FRAMES} from './scenes/Ypres';
import {Cast, CAST_FRAMES} from './scenes/Cast';
import {Boer2, BOER2_FRAMES} from './scenes/Boer2';
import {HeroSide, HEROSIDE_FRAMES} from './scenes/HeroSide';
import {BoerA, BOERA_FRAMES} from './scenes/BoerA';

export const Root: React.FC = () => (
  <>
    <Composition id="Boer" component={Boer} durationInFrames={BOER_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="Somali" component={Somali} durationInFrames={SOMALI_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="Ypres" component={Ypres} durationInFrames={YPRES_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="Cast" component={Cast} durationInFrames={CAST_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="BoerA" component={BoerA} durationInFrames={BOERA_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="Boer2" component={Boer2} durationInFrames={BOER2_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="HeroSide" component={HeroSide} durationInFrames={HEROSIDE_FRAMES} fps={FPS} width={1920} height={1080} />
  </>
);
