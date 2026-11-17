import React from 'react';
import {AbsoluteFill} from 'remotion';
import {hash} from '../dynamic/math';

/** Hand-drawn wobble: low-frequency displacement gives organic, slightly uneven outlines (varied apparent line weight). Wrap WORLD layers (not typography). */
export const InkWorld: React.FC<{id?: string; amount?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({id = 'ink-wob', amount = 4.5, children, style}) => (
  <>
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <filter id={id} x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence type="fractalNoise" baseFrequency="0.011 0.014" numOctaves={2} seed={5} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={amount} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
    <div style={{position: 'absolute', inset: 0, filter: `url(#${id})`, ...style}}>{children}</div>
  </>
);

/** Reusable hatch / stipple pattern defs. Use fill="url(#hatch)" overlays inside shapes for controlled illustrated shading. */
export const HatchDefs: React.FC = () => (
  <defs>
    <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
      <line x1="0" y1="0" x2="0" y2="9" stroke="#3A2B22" strokeWidth="1.6" opacity="0.45" />
    </pattern>
    <pattern id="hatch-fine" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="#3A2B22" strokeWidth="1.1" opacity="0.4" />
    </pattern>
    <pattern id="stipple" width="40" height="40" patternUnits="userSpaceOnUse">
      {Array.from({length: 18}).map((_, i) => <circle key={i} cx={hash(i) * 40} cy={hash(i + 31) * 40} r={0.9 + hash(i + 7) * 0.9} fill="#3A2B22" opacity={0.5} />)}
    </pattern>
  </defs>
);

/** Whole-frame grade: warm vignette + stipple + paper grain (multiply / overlay). */
export const GradeV3: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 52% 46%, rgba(0,0,0,0) 46%, rgba(110,64,28,0.32) 100%)', mixBlendMode: 'multiply'}} />
    <AbsoluteFill style={{background: 'radial-gradient(circle at 16% 10%, rgba(255,240,205,0.5), rgba(255,240,205,0) 55%)', mixBlendMode: 'soft-light', opacity: 0.6}} />
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.32}}>
      <HatchDefs />
      <rect width="100%" height="100%" fill="url(#stipple)" />
    </svg>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.18}}>
      <filter id="g3-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" /><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.9 0" /></filter>
      <rect width="100%" height="100%" filter="url(#g3-grain)" />
    </svg>
  </AbsoluteFill>
);
