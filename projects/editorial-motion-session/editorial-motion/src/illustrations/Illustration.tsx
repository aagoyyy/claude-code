import React from 'react';
import {roughness} from '../visual-system/IllustrationStyle';

/** Shared organic-outline wobble filter. Deterministic (fixed seed). */
export const InkFilter: React.FC = () => (
  <defs>
    <filter id="ink-rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency={roughness.baseFrequency} numOctaves={roughness.octaves} seed={roughness.seed} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={roughness.scale} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
);

/** Set to false (V4) when a screen-level InkLineWorld already provides the hand-drawn wobble: per-object filters get huge under camera zoom. */
export const RoughContext = React.createContext<boolean>(true);

export type IllustrationProps = {
  /** rendered width in px; height follows the viewBox aspect */
  size?: number;
  style?: React.CSSProperties;
  rough?: boolean;
};

type WrapperProps = IllustrationProps & {vbW: number; vbH: number; children: React.ReactNode};

/** Root wrapper: sets viewBox, size, wobble filter. Every illustration renders through this. */
export const Illustration: React.FC<WrapperProps> = ({vbW, vbH, size = 400, style, rough: roughProp, children}) => {
  const ctx = React.useContext(RoughContext);
  const rough = roughProp ?? ctx;
  return (
  <svg width={size} height={(size * vbH) / vbW} viewBox={`0 0 ${vbW} ${vbH}`} style={{overflow: 'visible', display: 'block', ...style}}>
    <InkFilter />
    <g filter={rough ? 'url(#ink-rough)' : undefined}>{children}</g>
  </svg>
  );
};
