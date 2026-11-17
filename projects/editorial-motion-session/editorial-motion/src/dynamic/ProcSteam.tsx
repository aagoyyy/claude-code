import React from 'react';
import {useCurrentFrame} from 'remotion';
import {smoothOpen, Pt, noise} from './math';

/** Procedural steam: noise-driven curls that rise, sway and fade. intensity 0..1. viewBox 600x500. */
export const ProcSteam: React.FC<{size?: number; intensity?: number}> = ({size = 620, intensity = 1}) => {
  const f = useCurrentFrame();
  const curls = [90, 190, 300, 410, 510];
  return (
    <svg width={size} height={(size * 500) / 600} viewBox="0 0 600 500" style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="steam-fade" gradientUnits="userSpaceOnUse" x1="0" y1="500" x2="0" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.25" stopColor="#FFFFFF" stopOpacity="0.62" />
          <stop offset="0.7" stopColor="#FFFFFF" stopOpacity="0.34" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id="steam-soft" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <g filter="url(#steam-soft)" opacity={intensity}>
        {curls.map((bx, i) => {
          const L = (300 + 70 * noise(i, 3)) * Math.min(1, intensity * 1.2);
          const pts: Pt[] = Array.from({length: 22}, (_, s) => {
            const u = s / 21;
            const y = 500 - L * u;
            const x = bx + (34 * u + 6) * noise(u * 5 + i * 2.1 - f * 0.05, i) + 18 * u * Math.sin(f * 0.05 + i);
            return [x, y];
          });
          return <path key={i} d={smoothOpen(pts)} fill="none" stroke="url(#steam-fade)" strokeWidth={46 - i * 3.4} strokeLinecap="round" />;
        })}
      </g>
    </svg>
  );
};
