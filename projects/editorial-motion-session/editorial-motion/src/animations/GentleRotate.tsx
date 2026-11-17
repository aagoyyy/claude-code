import React from 'react';
import {useCurrentFrame} from 'remotion';

export type GentleRotateProps = {degrees?: number; period?: number; phase?: number; base?: number; style?: React.CSSProperties; children: React.ReactNode};

/** D. GENTLE ROTATION — small natural rotation around the object's own centre. */
export const GentleRotate: React.FC<GentleRotateProps> = ({degrees = 3, period = 120, phase = 0, base = 0, style, children}) => {
  const f = useCurrentFrame();
  const r = base + Math.sin(((f + phase) / period) * Math.PI * 2) * degrees;
  return <div style={{transform: `rotate(${r}deg)`, ...style}}>{children}</div>;
};
