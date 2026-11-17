import React from 'react';
import {AbsoluteFill} from 'remotion';
import {textStyle} from '../visual-system/Typography';
import {derived, palette} from '../visual-system/ColorPalette';

/**
 * Reference-style burned-in caption: small brand header + white text on a dark box (observed in the reference).
 * Optional — use when the user wants captions. Sits inside the top safe margin.
 */
export const CaptionBox: React.FC<{brand?: string; text?: string; top?: number}> = ({brand = 'BISNIS MIE', text, top = 232}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', pointerEvents: 'none'}}>
    <div style={{marginTop: top, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
      <div style={{...textStyle('label', palette.navy), fontSize: 36, letterSpacing: 3}}>{brand}</div>
      {text && <div style={{...textStyle('body', derived.white), background: palette.navy, padding: '8px 22px', borderRadius: 6}}>{text}</div>}
    </div>
  </AbsoluteFill>
);
