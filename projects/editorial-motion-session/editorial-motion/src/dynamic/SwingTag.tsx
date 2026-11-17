import React from 'react';
import {useCurrentFrame} from 'remotion';
import {PriceTagArt} from '../illustrations/Finance/PriceTag';
import {KineticText} from '../typography/KineticText';
import {derived} from '../visual-system/ColorPalette';
import {dampedSwing} from './physics';
import {easeOutBack} from './math';

/** Price tag on a string: pendulum swing (damped), drops in from above, kinetic digits. Hook point at (hx, hy) in canvas px. */
export const SwingTag: React.FC<{text: string; start: number; hx?: number; hy?: number; stringLen?: number; width?: number}> = ({text, start, hx = 300, hy = 300, stringLen = 150, width = 560}) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0) return null;
  const drop = easeOutBack(t / 12, 1.4);
  const ang = dampedSwing(t, 34, 0.085, 0.36) - 3;
  const hole = {x: (76 / 420) * width, y: (75 / 150) * (width * 150 / 420)};
  return (
    <div style={{position: 'absolute', left: hx, top: hy - (1 - drop) * 360, width: 0, height: 0, transform: `rotate(${ang}deg)`, transformOrigin: '0 0'}}>
      <svg width={6} height={stringLen} style={{position: 'absolute', left: -3, top: 0, overflow: 'visible'}}>
        <line x1="3" y1="0" x2="3" y2={stringLen} stroke={derived.outline} strokeWidth={5} strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: -hole.x, top: stringLen - hole.y + 4, width}}>
        <PriceTagArt size={width} text="" />
        <div style={{position: 'absolute', left: (248 / 420) * width, top: width * (150 / 420) * 0.1, transform: 'translateX(-50%)', height: width * (150 / 420) * 0.75, display: 'flex', alignItems: 'center'}}>
          <KineticText text={text} delay={start + 10} size={width * 0.132} color={derived.white} />
        </div>
      </div>
      <div style={{position: 'absolute', left: -9, top: -9, width: 18, height: 18, borderRadius: 9, background: derived.outline}} />
    </div>
  );
};
