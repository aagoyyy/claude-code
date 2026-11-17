import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {easings} from '../visual-system/MotionPresets';
import {textStyle} from '../visual-system/Typography';
import {palette, derived} from '../visual-system/ColorPalette';
import {PopIn} from '../animations/PopIn';

export const formatId = (n: number): string => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export type NumberHighlightProps = {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  duration?: number;
  size?: number;
  color?: string;
  caption?: string;
  thousands?: boolean;
};

/** Number highlight — counts up with easing, pops in, optional caption. Numbers are first-class visual elements. */
export const NumberHighlight: React.FC<NumberHighlightProps> = ({to, from = 0, prefix = '', suffix = '', delay = 0, duration = 26, size = 150, color = palette.green, caption, thousands = true}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [delay, delay + duration], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.out});
  return (
    <PopIn delay={delay} from={0.7}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{...textStyle('price', color), fontSize: size, WebkitTextStroke: `4px ${derived.outline}`, paintOrder: 'stroke fill'}}>
          {prefix}
          {thousands ? formatId(v) : Math.round(v)}
          {suffix}
        </div>
        {caption && <div style={{...textStyle('label', palette.navy), marginTop: 6}}>{caption}</div>}
      </div>
    </PopIn>
  );
};
