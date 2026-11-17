import React from 'react'; import {Composition} from 'remotion'; import {MieScene, SCENE} from './mie/MieScene';
import {Part1, PART1} from './mie/Script1';
import {Part2, PART2} from './mie/Script2';
import {FlatTest} from './flat/FlatTest';
import {ChefTest} from './flat/ChefTest';
import {ChefTestV2} from './flat/ChefTestV2';
import {ChefTestV3} from './flat/ChefTestV3';
import {ChefTestMaster} from './flat/ChefTestMaster';
import {ChefTestMasterV2} from './flat/ChefTestMasterV2';
import {CookingDemoTest} from './flat/CookingDemoTest';
import {Story, STORY_TOTAL} from './story/Story';
export const Root: React.FC = () => <><Composition id="MieScene" component={MieScene} durationInFrames={SCENE.total} fps={SCENE.fps} width={1080} height={1920} />
  <Composition id="Part1" component={Part1} durationInFrames={PART1.total} fps={PART1.fps} width={1080} height={1920} />
  <Composition id="Part2" component={Part2} durationInFrames={PART2.total} fps={PART2.fps} width={1080} height={1920} />
  <Composition id="FlatCook" component={FlatTest} durationInFrames={90} fps={24} width={1080} height={1920} />
  <Composition id="ChefTest" component={ChefTest} durationInFrames={96} fps={24} width={1080} height={1920} />
  <Composition id="ChefTestV2" component={ChefTestV2} durationInFrames={96} fps={24} width={1080} height={1920} />
  <Composition id="ChefTestV3" component={ChefTestV3} durationInFrames={96} fps={24} width={1080} height={1920} />
  <Composition id="ChefTestMaster" component={ChefTestMaster} durationInFrames={96} fps={24} width={1080} height={1920} />
  <Composition id="ChefTestMasterV2" component={ChefTestMasterV2} durationInFrames={96} fps={24} width={1080} height={1920} />
  <Composition id="CookingDemo" component={CookingDemoTest} durationInFrames={96} fps={24} width={1080} height={1920} />
  <Composition id="Story" component={Story} durationInFrames={STORY_TOTAL} fps={24} width={1080} height={1920} />
  </>;
