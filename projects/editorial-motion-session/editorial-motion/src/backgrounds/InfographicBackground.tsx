import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PaperBackground} from './PaperBackground';
import {palette} from '../visual-system/ColorPalette';

/** E. INFOGRAPHIC BACKGROUND — paper + grid + corner registration marks, leaves space for numbers/diagrams. */
export const InfographicBackground: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <PaperBackground>
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        {[[90, 250], [990, 250], [90, 1500], [990, 1500]].map(([x, y], i) => (
          <path key={i} d={`M${x - 22},${y} h44 M${x},${y - 22} v44`} stroke={palette.grid} strokeWidth={4} strokeLinecap="round" />
        ))}
      </svg>
    </AbsoluteFill>
    {children}
  </PaperBackground>
);
