import React from 'react';
import {INK, SW, SKIN, SkinKey, clamp, lerp} from './tokens';

/** All expression parameters are plain numbers so a Remotion frame can drive them with interpolate(). */
export type Expression = {
  smile: number;      // -1 (frown) .. 1 (big smile)
  mouthOpen: number;  // 0 closed .. 1 open (teeth visible)
  blink: number;      // 0 open .. 1 closed
  brow: number;       // -1 worried/angry .. 1 raised
  look: number;       // -1 left .. 1 right (pupil offset)
};
export const NEUTRAL: Expression = {smile: 0.3, mouthOpen: 0, blink: 0, brow: 0, look: 0};

const Eye: React.FC<{x: number; ex: Expression}> = ({x, ex}) => {
  const ry = lerp(10.5, 1.4, clamp(ex.blink)) + (ex.mouthOpen > 0.6 ? 0.8 : 0);
  const lx = x + ex.look * 3;
  return (
    <g>
      <ellipse cx={lx} cy={-6} rx={8.6} ry={ry} fill={INK} />
      {ex.blink < 0.6 && <circle cx={lx - 2.4} cy={-9.4} r={3} fill="#fff" />}
      {ex.blink < 0.6 && <circle cx={lx + 3} cy={-2} r={1.3} fill="#fff" opacity={0.8} />}
    </g>
  );
};

const Brow: React.FC<{side: 1 | -1; ex: Expression}> = ({side, ex}) => {
  const lift = ex.brow * 7, tilt = ex.brow * -3 * side * 0;
  const y0 = -36 - lift, inner = side * 14, outer = side * 48;
  const inY = y0 + (ex.brow < 0 ? -ex.brow * -5 : 0) + 3, outY = y0 + (ex.brow < 0 ? 4 : 0) + tilt;
  return <path d={`M${inner},${inY} Q${(inner + outer) / 2},${y0 - 7 - Math.max(0, ex.brow) * 2} ${outer},${outY + 2}`} fill="none" stroke={INK} strokeWidth={6.4} strokeLinecap="round" />;
};

const Mouth: React.FC<{ex: Expression}> = ({ex}) => {
  const s = ex.smile, o = ex.mouthOpen, w = 27 + s * 4;
  const corner = 40 - s * 4;                // mouth corners rise with the smile
  const bottom = 46 + o * 22 + Math.max(0, s) * 6;
  if (o < 0.08) {
    return <path d={`M${-w},${corner} Q0,${corner + 12 + s * 10} ${w},${corner}`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />;
  }
  const d = `M${-w},${corner} Q0,${corner + 6} ${w},${corner} Q${w * 0.8},${bottom} 0,${bottom + 4} Q${-w * 0.8},${bottom} ${-w},${corner} Z`;
  const cid = 'mouthclip';
  return (
    <g>
      <clipPath id={cid}><path d={d} /></clipPath>
      <path d={d} fill="#7E2A2C" />
      <g clipPath={`url(#${cid})`}>
        <path d={`M${-w},${corner - 2} Q0,${corner + 4} ${w},${corner - 2} L${w},${corner + 10 + o * 3} Q0,${corner + 16 + o * 3} ${-w},${corner + 10 + o * 3} Z`} fill="#FFFFFF" />
        <ellipse cx={0} cy={bottom + 2} rx={w * 0.55} ry={7 + o * 3} fill="#E36F75" />
      </g>
      <path d={d} fill="none" stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
    </g>
  );
};

/** Head (face + ears + neck). Centre of the face = (0,0); chin y=84, crown y=-100. Hair is a separate layer. */
export const Head: React.FC<{skin?: SkinKey; ex?: Expression; neck?: boolean}> = ({skin = 'light', ex = NEUTRAL, neck = true}) => {
  const c = SKIN[skin];
  const face = 'M-75,-20 C-75,-88 -42,-102 0,-102 C42,-102 75,-88 75,-20 C75,32 50,76 0,86 C-50,76 -75,32 -75,-20 Z';
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {neck && <path d="M-34,52 L-34,120 Q0,138 34,120 L34,52 Z" fill={c.base} stroke={INK} strokeWidth={SW} />}
      {neck && <path d="M-34,86 Q0,112 34,86 L34,120 Q0,138 -34,120 Z" fill={c.shade} opacity={0.9} />}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <ellipse cx={sd * 77} cy={10} rx={12} ry={21} fill={c.base} stroke={INK} strokeWidth={SW} />
          <path d={`M${sd * 75},0 Q${sd * 84},8 ${sd * 77},22`} fill="none" stroke={c.shade} strokeWidth={3.2} />
        </g>
      ))}
      <path d={face} fill={c.base} />
      <clipPath id="faceclip"><path d={face} /></clipPath>
      <g clipPath="url(#faceclip)">
        <path d="M30,-110 Q72,-60 62,10 Q56,60 4,92 L90,92 L90,-110 Z" fill={c.shade} opacity={0.55} />     {/* form shadow, right side (light from upper-left) */}
        <path d="M-60,70 Q0,100 60,70 L60,110 L-60,110 Z" fill={c.shade} opacity={0.5} />                     {/* under-chin */}
        <ellipse cx={-44} cy={26} rx={15} ry={9} fill={c.blush} opacity={0.4} />
        <ellipse cx={44} cy={26} rx={15} ry={9} fill={c.blush} opacity={0.32} />
      </g>
      <path d={face} fill="none" stroke={INK} strokeWidth={SW} />
      <Brow side={-1} ex={ex} /><Brow side={1} ex={ex} />
      <Eye x={-30} ex={ex} /><Eye x={30} ex={ex} />
      <path d="M-3,6 Q-9,20 -1,24 Q5,25 9,20" fill="none" stroke={c.shade} strokeWidth={3.8} />
      <Mouth ex={ex} />
    </g>
  );
};
