import React from 'react';
import {INK, SW, WHITE, WHITE_SHADE, RED, RED_DARK, BRASS, SkinKey, SKIN, HairKey} from './tokens';
import {Head, Expression, NEUTRAL} from './Face';
import {HairMessy} from './Hair';
import {GripHand, RestHand} from './Hand';

export type CookProps = {
  skin?: SkinKey; hair?: HairKey; ex?: Expression;
  armRaise?: number;     // 0..1 raises the spatula arm
  sway?: number;         // -1..1 body lean (px-level, deterministic)
};

const Spatula: React.FC = () => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <rect x={-8} y={-10} width={16} height={190} rx={7} fill="#9A5B2E" stroke={INK} strokeWidth={SW} />
    <path d="M-4,4 L-4,168" stroke="#C98550" strokeWidth={3} opacity={0.8} />
    <path d="M-9,-8 L9,-8 L14,-40 L-14,-40 Z" fill="#8E979F" stroke={INK} strokeWidth={SW} />
    <path d="M-16,-40 L16,-40 L38,-62 Q40,-66 40,-72 L38,-136 Q38,-150 24,-150 L-24,-150 Q-38,-150 -38,-136 L-40,-72 Q-40,-66 -38,-62 Z" fill="#BCC3CA" stroke={INK} strokeWidth={SW} />
    <path d="M-30,-70 L-31,-138 Q-31,-143 -26,-143 L-18,-143 L-19,-70 Z" fill="#E6EAED" opacity={0.95} />
    <path d="M22,-62 Q30,-66 33,-72 L32,-136 Q32,-142 26,-143 L20,-143 L21,-62 Z" fill="#9BA4AC" opacity={0.75} />
    {[-14, 0, 14].map((x) => <rect key={x} x={x - 3.5} y={-128} width={7} height={46} rx={3.5} fill="#8A939B" stroke={INK} strokeWidth={2} />)}
  </g>
);

/** Frontal waist-up cook. Origin = centre of the waist line (y=0), neck at y=-306, face centre at y=-410. */
export const Cook: React.FC<CookProps> = ({skin = 'light', hair = 'black', ex = NEUTRAL, armRaise = 1, sway = 0}) => {
  const c = SKIN[skin];
  const ang = (1 - armRaise) * 38;
  return (
    <g strokeLinejoin="round" strokeLinecap="round" transform={`translate(${sway * 4} 0)`}>
      {/* viewer-left arm: hangs, hand rests on the counter */}
      <g>
        <path d="M-96,-262 C-136,-246 -156,-170 -150,-96 C-148,-70 -140,-48 -126,-30 L-84,-34 C-96,-70 -92,-130 -70,-200 Z" fill={WHITE} stroke={INK} strokeWidth={SW} />
        <path d="M-150,-96 C-148,-70 -140,-48 -126,-30 L-100,-34 C-112,-60 -118,-84 -118,-110 Z" fill={WHITE_SHADE} />
        <path d="M-150,-110 Q-126,-100 -104,-112" fill="none" stroke={WHITE_SHADE} strokeWidth={3} />
        <path d="M-128,-34 L-84,-38 L-80,6 L-126,10 Z" fill={c.base} stroke={INK} strokeWidth={SW} />
        <g transform="translate(-102 8)"><RestHand skin={skin} /></g>
      </g>
      {/* jacket */}
      <path d="M-112,0 C-118,-80 -122,-170 -112,-236 C-108,-270 -70,-298 -36,-306 L36,-306 C70,-298 108,-270 112,-236 C122,-170 118,-80 112,0 Z" fill={WHITE} stroke={INK} strokeWidth={SW} />
      <path d="M62,-298 C96,-270 112,-250 112,-236 C122,-170 118,-80 112,0 L84,0 C92,-90 90,-210 62,-298 Z" fill={WHITE_SHADE} />
      {/* collar (stand collar with V) */}
      <path d="M-40,-318 L-6,-262 L-42,-250 L-64,-298 Z" fill={WHITE} stroke={INK} strokeWidth={SW} />
      <path d="M40,-318 L6,-262 L42,-250 L64,-298 Z" fill={WHITE} stroke={INK} strokeWidth={SW} />
      <path d="M-26,-316 L0,-268 L26,-316 Z" fill={c.shade} />
      {/* apron */}
      <path d="M-40,-300 L-58,-238 M40,-300 L58,-238" stroke={INK} strokeWidth={14} />
      <path d="M-40,-300 L-58,-238 M40,-300 L58,-238" stroke={RED} strokeWidth={9} />
      <path d="M-66,-236 Q-66,-246 -54,-246 L54,-246 Q66,-246 66,-236 L74,0 L-74,0 Z" fill={RED} stroke={INK} strokeWidth={SW} />
      <path d="M30,-244 L66,-236 L74,0 L40,0 Z" fill={RED_DARK} opacity={0.55} />
      {[-58, 58].map((x) => (
        <g key={x}><rect x={x - 9} y={-250} width={18} height={20} rx={4} fill={BRASS} stroke={INK} strokeWidth={SW} /><rect x={x - 3.5} y={-244} width={7} height={8} rx={2} fill="#7A4F1E" /></g>
      ))}
      <rect x={-34} y={-130} width={68} height={62} rx={8} fill={RED} stroke={INK} strokeWidth={SW} />
      <path d="M-34,-120 L34,-120" stroke={RED_DARK} strokeWidth={3} opacity={0.7} />
      {/* double-breasted buttons on the jacket, peeking beside the apron */}
      {[-96, -60].map((y, i) => <circle key={i} cx={-84} cy={y - 100} r={5} fill="#EFE7DA" stroke={INK} strokeWidth={2} />)}
      {/* viewer-right arm raised with the spatula: sleeve (shoulder->elbow), rolled cuff, bare forearm, fist */}
      <g transform={`rotate(${ang} 100 -250)`}>
        <path d="M84,-272 C132,-286 190,-248 198,-192 L160,-168 C150,-196 128,-208 96,-206 Z" fill={WHITE} stroke={INK} strokeWidth={SW} />
        <path d="M198,-192 L160,-168 C158,-178 154,-186 148,-192 C168,-196 188,-198 198,-192 Z" fill={WHITE_SHADE} />
        <path d="M120,-262 C140,-250 150,-232 150,-214" fill="none" stroke={WHITE_SHADE} strokeWidth={3} />
        <path d="M150,-168 L206,-196 L214,-176 L164,-148 Z" fill={WHITE} stroke={INK} strokeWidth={SW} />
        <path d="M158,-160 L210,-186" stroke={WHITE_SHADE} strokeWidth={3} />
        <path d="M168,-152 L208,-182 L206,-250 L170,-250 Z" fill={c.base} stroke={INK} strokeWidth={SW} />
        <path d="M196,-182 L206,-250 L194,-250 L190,-190 Z" fill={c.shade} opacity={0.6} />
        <g transform="translate(188 -270) rotate(2)"><g transform="translate(0 -176)"><Spatula /></g><GripHand skin={skin} /></g>
      </g>
      {/* head */}
      <g transform="translate(0 -418) scale(1.1)"><Head skin={skin} ex={ex} /><HairMessy tone={hair} /></g>
    </g>
  );
};
