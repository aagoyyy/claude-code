import React from 'react';
import {StorytellingScene, StorytellingSceneProps} from './StorytellingScene';
import {IllustratedEnvironment} from '../backgrounds/IllustratedEnvironment';

/** Pattern: illustrated environment — flat room (warung / kitchen) with a counter surface. */
export const EnvironmentScene: React.FC<Omit<StorytellingSceneProps, 'background'> & {kind?: 'warung' | 'kitchen'; counterY?: number}> = ({kind, counterY, ...p}) => (
  <StorytellingScene background={<IllustratedEnvironment kind={kind} counterY={counterY} />} {...p} />
);
