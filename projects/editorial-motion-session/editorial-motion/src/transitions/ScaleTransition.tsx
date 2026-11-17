import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useTransition} from './useTransition';
import {palette, derived} from '../visual-system/ColorPalette';

/** 4. SCALE — a coloured disc grows from an object (cx,cy) until it covers the frame, then shrinks away revealing the next scene. */
export const ScaleTransition: React.FC<{at: number; duration?: number; cx?: number; cy?: number; color?: string}> = ({at, duration = 20, cx = 540, cy = 1000, color = palette.mustard}) => {
  const {cover, active} = useTransition(at, duration);
  if (!active) return null;
  const r = 2600 * cover;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', background: color, border: `10px solid ${derived.outline}`}} />
    </AbsoluteFill>
  );
};
