import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CookingDemoScene} from './CookingDemoScene';

/** Frame-driven wrapper: blink every 48 frames, steam always on. */
export const CookingDemoTest: React.FC = () => {
  const f = useCurrentFrame();
  const blink = f % 48 > 40 && f % 48 < 45;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <CookingDemoScene steam blink={blink} chefExpression="happy" />
    </AbsoluteFill>
  );
};
