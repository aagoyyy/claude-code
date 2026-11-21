import React from 'react';
import {Composition} from 'remotion';
import {Boer, BOER_FRAMES, FPS} from './scenes/Boer';
import {Somali, SOMALI_FRAMES} from './scenes/Somali';

export const Root: React.FC = () => (
  <>
    <Composition id="Boer" component={Boer} durationInFrames={BOER_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="Somali" component={Somali} durationInFrames={SOMALI_FRAMES} fps={FPS} width={1920} height={1080} />
  </>
);
