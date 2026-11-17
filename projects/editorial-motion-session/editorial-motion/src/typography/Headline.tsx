import React from 'react';
import {textStyle, textColors, type} from '../visual-system/Typography';
import {TextReveal} from '../animations/TextReveal';

export type HeadlineProps = {
  text: string | string[];
  size?: keyof typeof type;
  color?: string;
  accent?: string[]; // words rendered in tomato
  delay?: number;
  by?: 'word' | 'line';
  align?: 'center' | 'left';
  style?: React.CSSProperties;
};

/** Headline / Subheadline / Section title / Body — one component, driven by `size` (see Typography.ts). */
export const Headline: React.FC<HeadlineProps> = ({text, size = 'headline', color = textColors.primary, accent = [], delay = 0, by = 'word', align = 'center', style}) => (
  <TextReveal
    text={text}
    by={by}
    delay={delay}
    style={{...textStyle(size, color), textAlign: align, alignItems: align === 'center' ? 'center' : 'flex-start', ...style}}
    unitStyle={(u) => (accent.includes(u.replace(/[.,!?]/g, '')) ? {color: textColors.accent} : undefined)}
  />
);
