import React from 'react';
import {StorytellingScene, StorytellingSceneProps} from './StorytellingScene';
import {IsolatedBackground} from '../backgrounds/IsolatedBackground';

/** Pattern: isolated object — cream background, one hero object (optional table line). */
export const IsolatedObjectScene: React.FC<Omit<StorytellingSceneProps, 'background'> & {tableLine?: number}> = ({tableLine, ...p}) => (
  <StorytellingScene background={<IsolatedBackground tableLine={tableLine} />} {...p} />
);
