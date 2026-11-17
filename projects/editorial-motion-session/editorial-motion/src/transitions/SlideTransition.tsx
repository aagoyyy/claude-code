import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {useTransition} from './useTransition';
import {easings} from '../visual-system/MotionPresets';
import {palette, derived} from '../visual-system/ColorPalette';
import {CANVAS} from '../visual-system/ThemeTokens';

/** 2. SLIDE — a paper panel with a tomato leading edge sweeps across (left -> right). */
export const SlideTransition: React.FC<{at: number; duration?: number; color?: string}> = ({at, duration = 18, color = palette.ivory}) => {
  const {t, active} = useTransition(at, duration);
  if (!active) return null;
  const W = CANVAS.width;
  const x = interpolate(t, [0, 1], [-W - 80, W + 80], {easing: easings.inOut});
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 0, bottom: 0, left: x, width: W + 80, background: color, borderRight: `22px solid ${palette.tomato}`, boxShadow: `-30px 0 0 ${palette.mustard}, -52px 0 0 ${derived.outline}`}} />
    </AbsoluteFill>
  );
};
