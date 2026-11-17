import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Cook} from './Cook';
import {NEUTRAL} from './Face';

/** Quality test for the flat-vector character system: one cook, frame-driven expression (blink, smile, mouth), no random values. */
export const FlatTest: React.FC = () => {
  const f = useCurrentFrame();
  const blink = interpolate(f % 72, [60, 63, 66], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const mouthOpen = interpolate(f, [0, 20, 40, 60, 90], [0.9, 0.2, 0.9, 0.3, 0.8], {extrapolateRight: 'clamp'});
  const smile = interpolate(f, [0, 90], [0.6, 1]);
  const look = interpolate(f, [0, 45, 90], [0, 0.6, -0.4]);
  const brow = interpolate(f, [0, 30, 60], [0, 0.6, 0.1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#FBEFD9'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        {Array.from({length: 7}, (_, r) => Array.from({length: 7}, (_, c) => (
          <rect key={`${r}-${c}`} x={c * 170 - (r % 2) * 85 - 40} y={470 + r * 98} width={164} height={92} rx={8} fill="#FFF8EA" stroke="#EADDC2" strokeWidth={3} />
        )))}
        <g transform="translate(540 1230) scale(1.45)">
          <Cook ex={{...NEUTRAL, smile, mouthOpen, blink, look, brow}} armRaise={1} sway={Math.sin(f / 14)} />
        </g>
        <rect x={0} y={1230} width={1080} height={30} fill="#D9A15F" stroke="#2B1B17" strokeWidth={4} />
        <rect x={0} y={1260} width={1080} height={660} fill="#C98B4A" />
      </svg>
    </AbsoluteFill>
  );
};
