import React from 'react';
import {AbsoluteFill} from 'remotion';
import {palette, derived} from '../visual-system/ColorPalette';
import {hash, smoothOpen, Pt} from './math';

/** Wood table surface with gradient, planks, wavy grain and a soft top-edge light. */
export const WoodTable: React.FC<{top?: number}> = ({top = 1180}) => {
  const H = 1920 - top;
  const grains = Array.from({length: 26}).map((_, i) => {
    const y = top + 40 + (H - 60) * (i / 26) + hash(i) * 20;
    const pts: Pt[] = Array.from({length: 9}, (_, k) => [-40 + k * 150, y + Math.sin(k * 0.9 + i) * 7 + (hash(i * 3 + k) - 0.5) * 6] as Pt);
    return {d: smoothOpen(pts), o: 0.1 + hash(i + 5) * 0.12, w: 2 + hash(i + 1) * 2.4};
  });
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="wood-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F0CFA0" />
            <stop offset="0.5" stopColor={palette.beige} />
            <stop offset="1" stopColor="#D9AC76" />
          </linearGradient>
          <linearGradient id="wood-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y={top} width="1080" height={H} fill="url(#wood-g)" />
        <rect x="0" y={top} width="1080" height="46" fill="url(#wood-edge)" />
        {grains.map((g, i) => <path key={i} d={g.d} fill="none" stroke={palette.brown} strokeWidth={g.w} opacity={g.o} strokeLinecap="round" />)}
        {[0.2, 0.46, 0.74].map((k, i) => <path key={i} d={`M0,${top + H * k} H1080`} stroke={derived.brownDeep} strokeWidth={3} opacity={0.22} />)}
        <path d={`M0,${top} H1080`} stroke={derived.outline} strokeWidth={5} opacity={0.85} />
      </svg>
    </AbsoluteFill>
  );
};
