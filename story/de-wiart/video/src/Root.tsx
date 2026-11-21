import React from 'react';
import {Composition} from 'remotion';
import {Boer, BOER_FRAMES, FPS} from './scenes/Boer';
import {Somali, SOMALI_FRAMES} from './scenes/Somali';
import {Ypres, YPRES_FRAMES} from './scenes/Ypres';
import {Cast, CAST_FRAMES} from './scenes/Cast';
import {Boer2, BOER2_FRAMES} from './scenes/Boer2';
import {HeroSide, HEROSIDE_FRAMES} from './scenes/HeroSide';
import {Somali2, SOMALI2_FRAMES} from './scenes/Somali2';
import {Ypres2, YPRES2_FRAMES} from './scenes/Ypres2';
import {Story, STORY_FRAMES, BoerChapter, BOERCH, SomaliChapter, SOMCH, YpresChapter, YPRCH} from './scenes/Story';
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
    <Composition id="Somali2" component={Somali2} durationInFrames={SOMALI2_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="Ypres2" component={Ypres2} durationInFrames={YPRES2_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="BoerChapter" component={BoerChapter} durationInFrames={BOERCH} fps={FPS} width={1920} height={1080} />
    <Composition id="SomaliChapter" component={SomaliChapter} durationInFrames={SOMCH} fps={FPS} width={1920} height={1080} />
    <Composition id="YpresChapter" component={YpresChapter} durationInFrames={YPRCH} fps={FPS} width={1920} height={1080} />
    <Composition id="Story" component={Story} durationInFrames={STORY_FRAMES} fps={FPS} width={1920} height={1080} />
  </>
);
