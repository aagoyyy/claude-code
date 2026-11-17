import React from 'react';
import {StorytellingScene, StorytellingSceneProps} from './StorytellingScene';
import {InfographicBackground} from '../backgrounds/InfographicBackground';

/** Pattern: infographic / comparison / before-after — paper + grid with space for numbers and diagrams. */
export const InfographicScene: React.FC<Omit<StorytellingSceneProps, 'background'>> = (p) => <StorytellingScene background={<InfographicBackground />} {...p} />;
