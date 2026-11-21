import React from 'react';
import {Composition} from 'remotion';
import {Boer, BOER_FRAMES, FPS} from './scenes/Boer';

export const Root: React.FC = () => (
  <>
    <Composition id="Boer" component={Boer} durationInFrames={BOER_FRAMES} fps={FPS} width={1920} height={1080} />
  </>
);
