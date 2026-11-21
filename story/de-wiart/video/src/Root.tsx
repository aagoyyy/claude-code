import React from 'react';
import {Composition} from 'remotion';
import {Boer, BOER_FRAMES, FPS} from './scenes/Boer';
import {Somali, SOMALI_FRAMES} from './scenes/Somali';
import {Ypres, YPRES_FRAMES} from './scenes/Ypres';
import {Cast, CAST_FRAMES} from './scenes/Cast';
import {Boer2, BOER2_FRAMES} from './scenes/Boer2';
import {HeroSide, HEROSIDE_FRAMES} from './scenes/HeroSide';
import {Cast2, CAST2_FRAMES} from './scenes/Cast2';
import {WW2Chapter, WW2_FRAMES, Ww2Crash, WW2_A, Ww2Swim, WW2_B, Ww2Tunnel, WW2_C, Ww2Night, WW2_D, Ww2Castle, WW2_K} from './scenes/WW2';
import {MapTransition, MAP_FRAMES, MedalInsert, MEDAL_FRAMES} from './scenes/Inserts';
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
    <Composition id="Cast2" component={Cast2} durationInFrames={CAST2_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="MapIns" component={() => <MapTransition from={[600, 860, 'Afrika Selatan']} to={[930, 420, 'Somaliland']} y0={1899} y1={1914} sub="SOMALILAND" />} durationInFrames={MAP_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="MedalIns" component={MedalInsert} durationInFrames={MEDAL_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="WW2Chapter" component={WW2Chapter} durationInFrames={WW2_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="Ww2Crash" component={Ww2Crash} durationInFrames={WW2_A} fps={FPS} width={1920} height={1080} />
    <Composition id="Ww2Swim" component={Ww2Swim} durationInFrames={WW2_B} fps={FPS} width={1920} height={1080} />
    <Composition id="Ww2Tunnel" component={Ww2Tunnel} durationInFrames={WW2_C} fps={FPS} width={1920} height={1080} />
    <Composition id="Ww2Castle" component={Ww2Castle} durationInFrames={WW2_K} fps={FPS} width={1920} height={1080} />
    <Composition id="Ww2Night" component={Ww2Night} durationInFrames={WW2_D} fps={FPS} width={1920} height={1080} />
  </>
);
