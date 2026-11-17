import React from 'react';
import {INK, SW, SKIN, SkinKey} from './tokens';

/** Fist gripping a vertical handle: four finger blocks + thumb, readable at mobile size. Origin = centre of the grip. */
export const GripHand: React.FC<{skin?: SkinKey}> = ({skin = 'light'}) => {
  const c = SKIN[skin];
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M-22,-30 L26,-34 Q34,-14 28,40 L-18,44 Q-30,6 -22,-30 Z" fill={c.base} stroke={INK} strokeWidth={SW} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={-24} y={-32 + i * 17} width={50} height={17} rx={8.5} fill={c.base} stroke={INK} strokeWidth={SW} />
          <path d={`M${-18},${-28 + i * 17} L${14},${-28 + i * 17}`} stroke="#fff" strokeWidth={2.4} opacity={0.35} />
          <path d={`M${12},${-30 + i * 17} Q${20},${-23.5 + i * 17} ${12},${-17 + i * 17}`} fill="none" stroke={c.shade} strokeWidth={2.4} />
        </g>
      ))}
      <path d="M-18,-14 C-40,-22 -46,6 -28,20 C-18,28 -10,22 -12,12 Z" fill={c.base} stroke={INK} strokeWidth={SW} />
      <path d="M-30,-4 Q-38,6 -30,14" fill="none" stroke={c.shade} strokeWidth={2.4} />
    </g>
  );
};

/** Open hand resting flat (fingers forward), origin = wrist. */
export const RestHand: React.FC<{skin?: SkinKey}> = ({skin = 'light'}) => {
  const c = SKIN[skin];
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M-24,0 Q-30,36 -22,58 L28,58 Q34,34 26,0 Z" fill={c.base} stroke={INK} strokeWidth={SW} />
      {[-18, -6, 6, 18].map((x, i) => (
        <path key={i} d={`M${x - 5},52 L${x - 5},${86 - Math.abs(i - 1.5) * 4} Q${x},${94 - Math.abs(i - 1.5) * 4} ${x + 5},${86 - Math.abs(i - 1.5) * 4} L${x + 5},52 Z`} fill={c.base} stroke={INK} strokeWidth={SW} />
      ))}
      <path d="M-24,24 C-44,28 -50,50 -34,62 L-22,50 Z" fill={c.base} stroke={INK} strokeWidth={SW} />
    </g>
  );
};
