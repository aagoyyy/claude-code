import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backgroundTokens} from '../visual-system/BackgroundTokens';
import {CANVAS} from '../visual-system/ThemeTokens';
import {GridBackground} from './GridBackground';

/** A. PAPER BACKGROUND — warm ivory + very light grain + faint grid. */
export const PaperBackground: React.FC<{grid?: boolean; tone?: 'ivory' | 'cream'; children?: React.ReactNode}> = ({grid = true, tone = 'ivory', children}) => {
  const base = tone === 'ivory' ? backgroundTokens.paper.base : backgroundTokens.cream.base;
  return (
    <AbsoluteFill style={{background: base}}>
      {grid && <GridBackground />}
      <svg width={CANVAS.width} height={CANVAS.height} style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: backgroundTokens.paper.grain * 5}}>
        <filter id="paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.3  0 0 0 0.55 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" />
      </svg>
      {children}
    </AbsoluteFill>
  );
};
