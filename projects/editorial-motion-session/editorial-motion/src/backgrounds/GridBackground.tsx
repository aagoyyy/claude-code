import React from 'react';
import {AbsoluteFill} from 'remotion';
import {backgroundTokens} from '../visual-system/BackgroundTokens';
import {CANVAS} from '../visual-system/ThemeTokens';

/** Subtle graph-paper grid. Every `majorEvery` lines are slightly stronger (matches the reference's faint grid). */
export const GridBackground: React.FC<{opacity?: number; size?: number}> = ({opacity = 1, size = backgroundTokens.grid.size}) => {
  const g = backgroundTokens.grid;
  const lines: React.ReactNode[] = [];
  for (let x = 0; x <= CANVAS.width; x += size) lines.push(<line key={'v' + x} x1={x} y1={0} x2={x} y2={CANVAS.height} stroke={g.color} strokeWidth={(x / size) % g.majorEvery === 0 ? g.lineWidth + 0.6 : g.lineWidth} opacity={(x / size) % g.majorEvery === 0 ? g.majorOpacity : g.opacity} />);
  for (let y = 0; y <= CANVAS.height; y += size) lines.push(<line key={'h' + y} x1={0} y1={y} x2={CANVAS.width} y2={y} stroke={g.color} strokeWidth={(y / size) % g.majorEvery === 0 ? g.lineWidth + 0.6 : g.lineWidth} opacity={(y / size) % g.majorEvery === 0 ? g.majorOpacity : g.opacity} />);
  return (
    <AbsoluteFill style={{opacity}}>
      <svg width={CANVAS.width} height={CANVAS.height}>{lines}</svg>
    </AbsoluteFill>
  );
};
