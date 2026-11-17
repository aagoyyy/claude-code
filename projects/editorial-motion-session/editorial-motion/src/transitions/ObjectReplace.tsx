import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PopIn} from '../animations/PopIn';
import {easings} from '../visual-system/MotionPresets';

/** 6. OBJECT REPLACEMENT — object A shrinks/fades out while object B pops in at the same spot. Same layout, new meaning. */
export const ObjectReplace: React.FC<{at: number; duration?: number; from: React.ReactNode; to: React.ReactNode}> = ({at, duration = 10, from, to}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + duration], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings.in});
  return (
    <div style={{position: 'relative'}}>
      {p < 1 && <div style={{transform: `scale(${1 - 0.55 * p}) rotate(${p * -8}deg)`, opacity: 1 - p}}>{from}</div>}
      {f >= at + duration * 0.4 && <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><PopIn delay={at + duration * 0.4}>{to}</PopIn></div>}
    </div>
  );
};
