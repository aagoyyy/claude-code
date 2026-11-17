import React from 'react';
import {StorytellingScene, StorytellingSceneProps} from './StorytellingScene';
import {TopDownSurface} from '../backgrounds/TopDownSurface';

/** Pattern: top-down — overhead surface, objects arranged spatially. Pair with cameraPresets.topDown. */
export const TopDownScene: React.FC<Omit<StorytellingSceneProps, 'background'>> = (p) => <StorytellingScene background={<TopDownSurface />} {...p} />;
