import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PaperBackground} from './PaperBackground';
import {backgroundTokens} from '../visual-system/BackgroundTokens';

/** D. ISOLATED OBJECT BACKGROUND — cream, soft warm vignette, hero object is the only focus. `tableLine` adds the sand table band (reference scenes). */
export const IsolatedBackground: React.FC<{tableLine?: number; children?: React.ReactNode}> = ({tableLine, children}) => (
  <PaperBackground tone="cream">
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0) 45%, ${backgroundTokens.cream.vignette} 100%)`}} />
    {tableLine !== undefined && (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 0, right: 0, top: tableLine, bottom: 0, background: backgroundTokens.table.top, borderTop: `5px solid ${backgroundTokens.wood.grain}`}} />
        {[0.1, 0.3, 0.52, 0.78].map((k, i) => (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: tableLine + (1920 - tableLine) * k, height: 3, background: backgroundTokens.table.plank, opacity: backgroundTokens.table.plankOpacity}} />
        ))}
      </AbsoluteFill>
    )}
    {children}
  </PaperBackground>
);
