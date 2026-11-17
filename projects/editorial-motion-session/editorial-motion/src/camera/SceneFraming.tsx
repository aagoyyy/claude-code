import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SAFE_RECT} from '../visual-system/ThemeTokens';

/** Position a child by its CENTRE in canvas px (1080x1920). */
export const Place: React.FC<{x: number; y: number; z?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({x, y, z, style, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', zIndex: z, ...style}}>{children}</div>
);

/** Debug overlay for the 9:16 safe zone (render with ?safe or pass `show`). */
export const SafeZoneGuide: React.FC<{show?: boolean}> = ({show = false}) =>
  show ? (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: SAFE_RECT.x, top: SAFE_RECT.y, width: SAFE_RECT.w, height: SAFE_RECT.h, border: '4px dashed #00C853'}} />
    </AbsoluteFill>
  ) : null;
