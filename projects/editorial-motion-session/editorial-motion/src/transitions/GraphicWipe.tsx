import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {useTransition} from './useTransition';
import {easings} from '../visual-system/MotionPresets';
import {palette, derived} from '../visual-system/ColorPalette';
import {CANVAS} from '../visual-system/ThemeTokens';

/** 7. GRAPHIC WIPE — diagonal paper wipe with an ink-line leading edge (top-left -> bottom-right). */
export const GraphicWipe: React.FC<{at: number; duration?: number; color?: string}> = ({at, duration = 20, color = palette.beige}) => {
  const {t, active} = useTransition(at, duration);
  if (!active) return null;
  const W = CANVAS.width;
  const H = CANVAS.height;
  const span = W + H;
  const lead = interpolate(t, [0, 1], [0, span * 2], {easing: easings.inOut});
  // polygon covering the band between trailing and leading diagonal edges
  const trail = Math.max(0, lead - span);
  const pt = (d: number) => `${Math.min(d, W)}px ${Math.max(0, d - W)}px`;
  const d1 = Math.min(lead, span);
  const poly = `polygon(${trail > 0 ? `${Math.max(0, trail - H)}px ${Math.min(H, trail)}px` : '0px 0px'}, ${Math.min(W, trail)}px ${Math.max(0, trail - W)}px, ${Math.min(W, d1)}px ${Math.max(0, d1 - W)}px, ${Math.max(0, d1 - H)}px ${Math.min(H, d1)}px)`;
  void pt;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', inset: 0, background: color, clipPath: poly}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <line x1={Math.max(0, d1 - H)} y1={Math.min(H, d1)} x2={Math.min(W, d1)} y2={Math.max(0, d1 - W)} stroke={palette.tomato} strokeWidth={16} />
        <line x1={Math.max(0, d1 - H) - 26} y1={Math.min(H, d1) + 26} x2={Math.min(W, d1) - 26} y2={Math.max(0, d1 - W) + 26} stroke={derived.outline} strokeWidth={6} />
      </svg>
    </AbsoluteFill>
  );
};
