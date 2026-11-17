import React from 'react';
import {CostLabelArt} from '../illustrations/Finance/PriceTag';
import {LabelReveal} from '../animations/LabelReveal';
import {palette} from '../visual-system/ColorPalette';

export type CalloutProps = {text: string; delay?: number; width?: number; color?: string; textColor?: string; rotate?: number; from?: 'left' | 'right' | 'bottom'};

/** Information box / cost label: paper-card with ink outline that slides into place. */
export const Callout: React.FC<CalloutProps> = ({text, delay = 0, width = 420, color = palette.ivory, textColor = palette.navy, rotate = -3, from = 'bottom'}) => (
  <LabelReveal delay={delay} rotate={rotate} from={from} distance={160}>
    <CostLabelArt size={width} text={text} color={color} textColor={textColor} fontSize={Math.min(44, 318 / (text.length * 0.6))} />
  </LabelReveal>
);
