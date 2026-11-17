import React from 'react';
import {PriceTagArt} from '../illustrations/Finance/PriceTag';
import {LabelReveal} from '../animations/LabelReveal';
import {KineticText} from './KineticText';
import {derived, palette} from '../visual-system/ColorPalette';
import {Float} from '../animations/Float';

export type PriceTagProps = {
  text: string;
  width?: number; // px
  delay?: number;
  from?: 'left' | 'right' | 'bottom';
  rotate?: number;
  color?: string;
  kinetic?: boolean; // price digits pop in one by one after the tag lands
  float?: boolean;
};

/** Animated hang-tag. The tag art swings in (LabelReveal); digits can be kinetic. */
export const PriceTag: React.FC<PriceTagProps> = ({text, width = 700, delay = 0, from = 'left', rotate = -6, color = palette.tomato, kinetic = true, float = true}) => {
  const body = (
    <LabelReveal delay={delay} from={from} rotate={rotate}>
      <div style={{position: 'relative', width}}>
        <PriceTagArt size={width} text={kinetic ? '' : text} color={color} />
        {kinetic && (
          <div style={{position: 'absolute', left: (248 / 420) * width, top: (30 / 150) * width * (150 / 420) * 0.0 + width * (150 / 420) * 0.1, transform: 'translateX(-50%)', height: width * (150 / 420) * 0.75, display: 'flex', alignItems: 'center'}}>
            <KineticText text={text} delay={delay + 8} size={width * 0.132} color={derived.white} />
          </div>
        )}
      </div>
    </LabelReveal>
  );
  return float ? <Float amplitude={6} period={110}>{body}</Float> : body;
};
