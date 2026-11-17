import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ChefCharacterV2, ChefExpression} from './ChefCharacterV2';

const EXPS: ChefExpression[] = ['happy', 'neutral', 'sad', 'surprised', 'happy', 'happy'];
export const ChefTestV2: React.FC = () => {
  const f = useCurrentFrame();
  const blink = f % 48 > 40 && f % 48 < 45;
  const mouthOpen = Math.floor(f / 8) % 2 === 0;
  const spat = interpolate(f % 48, [0, 24, 48], [-10, 12, -10]);
  const head = interpolate(f % 48, [0, 24, 48], [-3, 3, -3]);
  const labels = ['happy', 'neutral', 'sad', 'surprised', 'happy + mouthOpen', 'anim: blink/mouth/head/spatula'];
  return (
    <AbsoluteFill style={{background: '#FBEFD9'}}>
      <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, 1fr)'}}>
        {EXPS.map((e, i) => (
          <div key={i} style={{position: 'relative', overflow: 'hidden', borderRight: '2px solid #E6D4B4', borderBottom: '2px solid #E6D4B4'}}>
            <div style={{position: 'absolute', inset: 0}}>
              <ChefCharacterV2 expression={e} mouthOpen={i === 4 || (i === 5 && mouthOpen)} blink={i === 5 ? blink : false} headRotation={i === 5 ? head : 0} spatulaRotation={i === 5 ? spat : 0} />
            </div>
            <div style={{position: 'absolute', left: 16, top: 12, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 26, color: '#8A7F72'}}>{labels[i]}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
