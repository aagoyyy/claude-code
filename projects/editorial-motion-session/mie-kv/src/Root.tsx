import React from 'react'; import {Composition} from 'remotion'; import {MieScene, SCENE} from './mie/MieScene';
import {Part1, PART1} from './mie/Script1';
export const Root: React.FC = () => <><Composition id="MieScene" component={MieScene} durationInFrames={SCENE.total} fps={SCENE.fps} width={1080} height={1920} />
  <Composition id="Part1" component={Part1} durationInFrames={PART1.total} fps={PART1.fps} width={1080} height={1920} />
  </>;
