import React from 'react';
import {INK, SW, HAIR, HairKey, RED, RED_DARK} from './tokens';

/** Layered vector hair: base mass + mid layer + highlight strokes. Origin = face centre. */
export const HairMessy: React.FC<{tone?: HairKey; band?: boolean}> = ({tone = 'black', band = true}) => {
  const h = HAIR[tone];
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {/* back mass behind ears */}
      <path d="M-80,-30 C-96,-70 -80,-124 -34,-136 C-10,-146 24,-146 50,-136 C92,-122 100,-70 80,-30 C80,-60 60,-84 0,-88 C-60,-86 -80,-60 -80,-30 Z" fill={h.base} stroke={INK} strokeWidth={SW} />
      {/* spiky top tufts */}
      <path d="M-70,-84 C-84,-122 -56,-150 -22,-150 C-30,-164 0,-172 16,-158 C30,-176 60,-166 62,-148 C86,-148 98,-122 82,-92 C70,-104 50,-110 30,-108 C10,-116 -30,-116 -48,-106 C-58,-104 -66,-98 -70,-84 Z" fill={h.base} stroke={INK} strokeWidth={SW} />
      <path d="M-52,-112 C-40,-136 -10,-146 14,-138 C40,-146 66,-132 72,-110 C54,-120 34,-122 14,-118 C-12,-124 -36,-122 -52,-112 Z" fill={h.mid} />
      {/* highlight strokes */}
      <path d="M-40,-132 C-24,-142 -4,-142 8,-136" fill="none" stroke={h.hi} strokeWidth={4} opacity={0.9} />
      <path d="M22,-142 C34,-146 48,-142 56,-134" fill="none" stroke={h.hi} strokeWidth={3.4} opacity={0.8} />
      <path d="M-62,-104 C-70,-116 -66,-128 -56,-134" fill="none" stroke={h.hi} strokeWidth={3} opacity={0.7} />
      {/* sideburns */}
      <path d="M-74,-34 C-73,-46 -69,-54 -64,-58 L-64,-30 Z" fill={h.base} stroke={INK} strokeWidth={SW} />
      <path d="M74,-34 C73,-46 69,-54 64,-58 L64,-30 Z" fill={h.base} stroke={INK} strokeWidth={SW} />
      {band && (
        <g>
          <path d="M-80,-62 C-40,-76 40,-76 80,-62 L80,-40 C40,-54 -40,-54 -80,-40 Z" fill={RED} stroke={INK} strokeWidth={SW} />
          <clipPath id="bandclip"><path d="M-80,-62 C-40,-76 40,-76 80,-62 L80,-40 C40,-54 -40,-54 -80,-40 Z" /></clipPath>
          <g clipPath="url(#bandclip)" fill="none" stroke="#FBF1E4" strokeWidth={2.6} strokeLinecap="round">
            {Array.from({length: 9}, (_, i) => (
              <g key={i} transform={`translate(${-72 + i * 18} ${-58 + Math.abs(i - 4) * 0.9})`}>
                <path d="M0,-4 L5,0 L0,4 L-5,0 Z" /><path d="M-8,8 L8,-8" opacity={0.0} /><circle cx={0} cy={9} r={1.4} fill="#FBF1E4" />
              </g>
            ))}
            <path d="M-80,-50 C-40,-64 40,-64 80,-50" opacity={0.8} />
            <path d="M-80,-46 L80,-46" opacity={0} />
          </g>
          <path d="M-80,-40 C-40,-54 40,-54 80,-40" fill="none" stroke={RED_DARK} strokeWidth={3} opacity={0.6} />
        </g>
      )}
    </g>
  );
};
