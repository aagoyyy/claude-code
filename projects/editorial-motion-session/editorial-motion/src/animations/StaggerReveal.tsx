import React from 'react';
import {PopIn} from './PopIn';
import {SlideIn} from './SlideIn';
import {stagger} from '../visual-system/MotionPresets';
import type {Direction} from '../visual-system/MotionPresets';

export type StaggerRevealProps = {
  delay?: number;
  interval?: number;
  variant?: 'pop' | 'slide';
  from?: Direction;
  distance?: number;
  children: React.ReactNode[];
  itemStyle?: React.CSSProperties[] | React.CSSProperties;
};

/** G. STAGGER REVEAL — children appear one after another with a controlled delay. */
export const StaggerReveal: React.FC<StaggerRevealProps> = ({delay = 0, interval = stagger.normal, variant = 'pop', from = 'top', distance = 500, children, itemStyle}) => (
  <>
    {React.Children.map(children, (child, i) => {
      const d = delay + i * interval;
      const st = Array.isArray(itemStyle) ? itemStyle[i] : itemStyle;
      return variant === 'pop' ? (
        <PopIn delay={d} style={st}>{child}</PopIn>
      ) : (
        <SlideIn delay={d} from={from} distance={distance} overshoot style={st}>{child}</SlideIn>
      );
    })}
  </>
);
