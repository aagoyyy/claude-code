import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {useTransition} from './useTransition';
import {easings} from '../visual-system/MotionPresets';
import {palette, derived} from '../visual-system/ColorPalette';
import {CANVAS} from '../visual-system/ThemeTokens';

/** 5. LAYERED REVEAL — three palette bands sweep in with a stagger and peel away in the same order. */
export const LayeredTransition: React.FC<{at: number; duration?: number; colors?: string[]}> = ({at, duration = 26, colors = [palette.mustard, palette.tomato, palette.green]}) => {
  const {t, active} = useTransition(at, duration);
  if (!active) return null;
  const W = CANVAS.width;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {colors.map((c, i) => {
        const lag = i * 0.1;
        const tt = Math.min(1, Math.max(0, (t - lag) / (1 - lag * 2)));
        const x = interpolate(tt, [0, 1], [-W - 40, W + 40], {easing: easings.inOut});
        return <div key={i} style={{position: 'absolute', top: 0, bottom: 0, left: x, width: W + 40, background: c, borderRight: `8px solid ${derived.outline}`}} />;
      })}
    </AbsoluteFill>
  );
};
