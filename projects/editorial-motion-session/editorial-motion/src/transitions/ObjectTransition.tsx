import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {useTransition} from './useTransition';
import {easings} from '../visual-system/MotionPresets';
import {palette} from '../visual-system/ColorPalette';
import {CANVAS} from '../visual-system/ThemeTokens';

/** 3. OBJECT-DRIVEN — a story object (e.g. a price tag or coin) drags a colour panel across the screen; the scene changes while hidden behind it. */
export const ObjectTransition: React.FC<{at: number; duration?: number; objectWidth?: number; panelColor?: string; y?: number; children: React.ReactNode}> = ({at, duration = 22, objectWidth = 560, panelColor = palette.tomato, y = 960, children}) => {
  const {t, active} = useTransition(at, duration);
  if (!active) return null;
  const W = CANVAS.width;
  const panelW = W + 700;
  const x0 = -objectWidth / 2;
  const x1 = W + panelW + objectWidth / 2;
  const x = interpolate(t, [0, 1], [x0, x1], {easing: easings.inOut});
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 0, bottom: 0, left: x - objectWidth / 2 - panelW, width: panelW, background: panelColor}} />
      <div style={{position: 'absolute', left: x - objectWidth / 2, top: y, transform: 'translateY(-50%) rotate(-4deg)', width: objectWidth}}>{children}</div>
    </AbsoluteFill>
  );
};
