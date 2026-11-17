import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Illustration} from '../../illustrations/Illustration';
import {derived, palette, materials as m} from '../../visual-system/ColorPalette';
import {ink, inkThin} from '../../visual-system/IllustrationStyle';
import {KineticText} from '../../typography/KineticText';
import {dampedSwing} from '../physics';
import {clamp} from '../math';
import {MotionBlur} from './Fx';

/** Detailed hang-tag: paper gloss, inner dashed border, metal eyelet, twisted string; swings on a damped pendulum. */
export const SwingTag2: React.FC<{text: string; start: number; hx?: number; hy?: number; stringLen?: number; width?: number; kDelay?: number; kInterval?: number}> = ({text, start, hx = 300, hy = 300, stringLen = 150, width = 600, kDelay = 8, kInterval = 2}) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0) return null;
  const fall = clamp(t / 9);
  const ease = 1 - Math.pow(1 - fall, 3);
  const over = fall >= 1 ? 0 : 0;
  void over;
  const ang = dampedSwing(t, 38, 0.08, 0.38) - 3;
  const speed = Math.abs(dampedSwing(t, 38, 0.08, 0.38) - dampedSwing(t - 1, 38, 0.08, 0.38));
  const hole = {x: (76 / 420) * width, y: (75 / 150) * (width * 150 / 420)};
  const h = (width * 150) / 420;
  return (
    <div style={{position: 'absolute', left: hx, top: hy - (1 - ease) * 420, width: 0, height: 0, transform: `rotate(${ang}deg)`, transformOrigin: '0 0'}}>
      <svg width={14} height={stringLen} style={{position: 'absolute', left: -7, top: 0, overflow: 'visible'}}>
        <line x1="7" y1="0" x2="7" y2={stringLen} stroke={derived.outline} strokeWidth={6.5} strokeLinecap="round" />
        <line x1="7" y1="0" x2="7" y2={stringLen} stroke={m.wood.hi} strokeWidth={3} strokeDasharray="6 5" strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: -hole.x, top: stringLen - hole.y + 4, width}}>
        <MotionBlur id="tagblur" bx={speed * 0.5} by={(1 - ease) * 10}>
          <Illustration vbW={420} vbH={150} size={width}>
            <defs>
              <linearGradient id="tg-red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={derived.tomatoLight} /><stop offset="0.45" stopColor={palette.tomato} /><stop offset="1" stopColor={derived.tomatoDeep} /></linearGradient>
              <radialGradient id="tg-metal" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.5" stopColor="#E8E1D0" /><stop offset="1" stopColor="#9A9078" /></radialGradient>
            </defs>
            <path d="M44,75 L84,22 H394 Q410,22 410,38 V112 Q410,128 394,128 H84Z" fill="url(#tg-red)" {...ink} />
            <path d="M92,34 H396 Q402,34 402,40 V44 H100Z" fill="#FFFFFF" opacity={0.42} />
            <path d="M92,38 H392 Q398,38 398,44 V106 Q398,112 392,112 H92 L60,75Z" fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeDasharray="7 6" opacity={0.7} />
            <path d="M44,75 L84,22 L100,24 L62,75 L100,126 L84,128Z" fill={derived.outline} opacity={0.12} />
            <circle cx="76" cy="75" r="15" fill="url(#tg-metal)" {...inkThin} />
            <circle cx="76" cy="75" r="7.5" fill={derived.outline} opacity={0.85} />
            <path d="M64,66 Q70,60 80,60" fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" opacity={0.9} />
          </Illustration>
        </MotionBlur>
        <div style={{position: 'absolute', left: (248 / 420) * width, top: h * 0.1, transform: 'translateX(-50%)', height: h * 0.75, display: 'flex', alignItems: 'center'}}>
          <KineticText text={text} delay={start + kDelay} interval={kInterval} size={width * 0.132} color={derived.white} stroke={derived.tomatoDeep} />
        </div>
      </div>
      <div style={{position: 'absolute', left: -10, top: -10, width: 20, height: 20, borderRadius: 10, background: derived.outline, boxShadow: '0 0 0 4px #E8E1D0'}} />
    </div>
  );
};
