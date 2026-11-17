import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {springs, stagger} from '../visual-system/MotionPresets';

export type TextRevealProps = {
  text: string | string[]; // string => split by `by`; array => explicit lines
  by?: 'word' | 'line';
  delay?: number;
  interval?: number;
  rise?: number; // px each unit rises from
  style?: React.CSSProperties;
  unitStyle?: (unit: string, index: number) => React.CSSProperties | undefined;
};

/** I. TEXT REVEAL — word-by-word or line-by-line (masked rise + fade). */
export const TextReveal: React.FC<TextRevealProps> = ({text, by = 'word', delay = 0, interval = stagger.normal, rise = 36, style, unitStyle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines = Array.isArray(text) ? text : [text];
  let idx = 0;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>
      {lines.map((line, li) => {
        const units = by === 'word' ? line.split(' ') : [line];
        return (
          <div key={li} style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.28em'}}>
            {units.map((u) => {
              const i = idx++;
              const p = spring({frame: frame - delay - i * interval, fps, config: springs.soft});
              return (
                <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - p) * rise}px)`, opacity: Math.min(1, p * 2.5), ...unitStyle?.(u, i)}}>
                  {u}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
