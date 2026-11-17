import React from 'react'; import {Composition} from 'remotion'; import {MieScene, SCENE} from './mie/MieScene';
import {Part1, PART1} from './mie/Script1';
import {Part2, PART2} from './mie/Script2';
import {FlatTest} from './flat/FlatTest';
export const Root: React.FC = () => <><Composition id="MieScene" component={MieScene} durationInFrames={SCENE.total} fps={SCENE.fps} width={1080} height={1920} />
  <Composition id="Part1" component={Part1} durationInFrames={PART1.total} fps={PART1.fps} width={1080} height={1920} />
  <Composition id="Part2" component={Part2} durationInFrames={PART2.total} fps={PART2.fps} width={1080} height={1920} />
  <Composition id="FlatCook" component={FlatTest} durationInFrames={90} fps={24} width={1080} height={1920} />
  </>;
