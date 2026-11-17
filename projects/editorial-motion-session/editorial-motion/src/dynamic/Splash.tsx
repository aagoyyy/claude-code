import React from 'react';
import {useCurrentFrame} from 'remotion';
import {hash, clamp} from './math';
import {derived} from '../visual-system/ColorPalette';

/** Ballistic splash droplets + expanding surface ripple. Screen-space (1080x1920 layer). */
export const Splash: React.FC<{x: number; y: number; start: number; count?: number; scale?: number}> = ({x, y, start, count = 18, scale = 1}) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t > 40) return null;
  return (
    <g>
      {[0, 1].map((k) => {
        const u = clamp((t - k * 4) / 18);
        if (u <= 0) return null;
        return <ellipse key={k} cx={x} cy={y} rx={(60 + u * 250) * scale} ry={(14 + u * 56) * scale} fill="none" stroke="#FFF6DC" strokeWidth={8 * (1 - u)} opacity={0.85 * (1 - u)} />;
      })}
      {Array.from({length: count}).map((_, i) => {
        const a = -Math.PI / 2 + (hash(i) - 0.5) * 1.9;
        const v = (7 + hash(i + 40) * 10) * scale;
        const life = 20 + hash(i + 7) * 12;
        if (t > life) return null;
        const px = x + Math.cos(a) * v * t + (hash(i + 1) - 0.5) * 30 * scale;
        const py = y + Math.sin(a) * v * t + 0.5 * 1.1 * t * t;
        const r = (5 + hash(i + 11) * 9) * scale * (1 - t / life * 0.6);
        return <circle key={i} cx={px} cy={py} r={r} fill={derived.broth} stroke={derived.outline} strokeWidth={3} />;
      })}
    </g>
  );
};
