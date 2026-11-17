import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ChefCharacter, ChefExpression} from './ChefCharacter';

/** Visual test of the pasted ChefCharacter: a 2x3 sheet of its expressions, plus frame-driven blink / mouth / arm / head (no random). */
const EXPS: ChefExpression[] = ['happy', 'neutral', 'sad', 'angry', 'surprised', 'happy'];
export const ChefTest: React.FC = () => {
  const f = useCurrentFrame();
  const blink = f % 48 > 40 && f % 48 < 45;
  const mouthOpen = Math.floor(f / 8) % 2 === 0;
  const arm = interpolate(f, [0, 24, 48], [0, -14, 0], {extrapolateRight: 'extend'});
  const head = interpolate(f % 48, [0, 24, 48], [-3, 3, -3]);
  return (
    <AbsoluteFill style={{background: '#FBEFD9'}}>
      <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, 1fr)'}}>
        {EXPS.map((e, i) => (
          <div key={i} style={{position: 'relative', overflow: 'hidden', borderRight: '2px solid #E6D4B4', borderBottom: '2px solid #E6D4B4'}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%'}}>
              <ChefCharacter expression={e} blink={i === 5 ? blink : false} mouthOpen={i === 5 ? mouthOpen : false} headRotation={i === 5 ? head : 0} armRotation={i === 5 ? arm : 0} />
            </div>
            <div style={{position: 'absolute', left: 16, top: 12, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 30, color: '#8A7F72'}}>{i === 5 ? 'happy + anim' : e}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
