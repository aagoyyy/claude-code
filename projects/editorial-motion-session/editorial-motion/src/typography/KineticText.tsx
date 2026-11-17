import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {springs, stagger} from '../visual-system/MotionPresets';
import {textStyle} from '../visual-system/Typography';
import {textColors} from '../visual-system/Typography';

export type KineticTextProps = {
  text: string;
  delay?: number;
  interval?: number;
  size?: number;
  color?: string;
  stroke?: string; // optional outline colour for legibility on dark tags
  tilt?: number; // alternating per-char tilt (deg) that settles to 0
  style?: React.CSSProperties;
};

/** Kinetic typography — characters pop in one by one with tiny alternating tilt + overshoot, then settle. */
export const KineticText: React.FC<KineticTextProps> = ({text, delay = 0, interval = stagger.tight - 1, size = 120, color = textColors.primary, stroke, tilt = 10, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{...textStyle('price', color), fontSize: size, display: 'flex', whiteSpace: 'pre', ...style}}>
      {text.split('').map((ch, i) => {
        const p = spring({frame: frame - delay - i * interval, fps, config: springs.pop});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${(1 - p) * 46}px) scale(${0.4 + 0.6 * p}) rotate(${(i % 2 ? 1 : -1) * tilt * (1 - p)}deg)`,
              opacity: Math.min(1, p * 3),
              WebkitTextStroke: stroke ? `3px ${stroke}` : undefined,
              paintOrder: 'stroke fill',
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};
