import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ChefMasterV2, ChefExpression} from './ChefMasterV2';

const EXPS: ChefExpression[] = ['happy', 'worried', 'sad', 'surprised', 'happy', 'happy'];
export const ChefTestMasterV2: React.FC = () => {
  const f = useCurrentFrame();
  const blink = f % 48 > 40 && f % 48 < 45;
  const mouthOpen = Math.floor(f / 8) % 2 === 0;
  const spat = interpolate(f % 48, [0, 24, 48], [-10, 12, -10]);
  const head = interpolate(f % 48, [0, 24, 48], [-3, 3, -3]);
  const arm = interpolate(f % 48, [0, 24, 48], [0, 14, 0]);
  const labels = ['happy', 'worried', 'sad', 'surprised', 'happy + mouthOpen + steam', 'anim: blink/mouth/head/spatula/left arm'];
  return (
    <AbsoluteFill style={{background: '#FBEFD9'}}>
      <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, 1fr)'}}>
        {EXPS.map((e, i) => (
          <div key={i} style={{position: 'relative', overflow: 'hidden', borderRight: '2px solid #E6D4B4', borderBottom: '2px solid #E6D4B4'}}>
            <div style={{position: 'absolute', inset: 0}}>
              <ChefMasterV2 expression={e} mouthOpen={i === 4 || (i === 5 && mouthOpen)} blink={i === 5 ? blink : false} headRotation={i === 5 ? head : 0} spatulaRotation={i === 5 ? spat : 0} leftArmRotation={i === 5 ? arm : 0} showSteam={i === 4} />
            </div>
            <div style={{position: 'absolute', left: 16, top: 12, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 24, color: '#8A7F72'}}>{labels[i]}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
