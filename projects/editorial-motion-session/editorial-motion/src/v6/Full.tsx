import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {DemoV6Core} from './Demo';
import {Bg, Headline, Eyebrow} from './Layout';
import {BowlFlat, PriceTagFlat, CoinFlat, SteamFlat} from './Flat';
import {StallFlat} from './Envs';
import {CoinFlat as Coin} from './Flat';
import {DATA, fmtRp} from './data';
import {ObjectTransition} from '../transitions/ObjectTransition';

/** FULL 15 s @ 24 fps = 360 f.  0-216: the approved V6 sequence slowed x1.5 then held (so every figure has screen time).  216-360: stall closing. */
export const FULL = {fps: 24, total: 360, slow: 1.5, cut: 216} as const;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
const eo = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const eio = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const eob = (t: number) => { t = clamp(t) - 1; return 1 + 2.3 * t * t * t + 1.3 * t * t; };
const At: React.FC<{x: number; y: number; sc?: number; o?: number; rot?: number; children: React.ReactNode}> = ({x, y, sc = 1, o = 1, rot = 0, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})`, transformOrigin: '50% 100%', opacity: o}}>{children}</div>
);

const Part1: React.FC = () => <DemoV6Core f={Math.min(useCurrentFrame() / FULL.slow, 119.99)} />;

const Closing: React.FC = () => {
  const f = useCurrentFrame();
  const stall = eo(prog(f, 4, 22));
  const bowl = eo(prog(f, 22, 36));
  const tag = eo(prog(f, 40, 56));
  const coins = [0, 1, 2].map((i) => eob(prog(f, 56 + i * 7, 68 + i * 7)));
  const head2 = prog(f, 86, 96);
  const head1out = prog(f, 78, 84);
  const steam = prog(f, 40, 60);
  const push = eio(prog(f, 96, 140));
  return (
    <AbsoluteFill>
      <Bg surface={1360}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + 0.05 * push})`, transformOrigin: '50% 60%'}}>
          <Eyebrow text="BISNIS MIE" opacity={prog(f, 2, 12)} />
          <Headline lines={['Dijual', fmtRp(DATA.price)]} accent={['Rp', '12.000']} y={270} opacity={(1 - head1out) * prog(f, 4, 14)} dy={(1 - prog(f, 4, 14)) * 24} />
          <Headline lines={['Untung ' + fmtRp(DATA.profit), 'per mangkuk']} accent={['Rp', '5.000']} y={270} opacity={head2} dy={(1 - head2) * 24} />
          <div style={{opacity: stall, transform: `translateX(${(1 - stall) * -160}px)`}}><StallFlat cx={330} ground={1360} size={780} /></div>
          {bowl > 0 && <At x={820} y={1228} sc={0.9 + 0.1 * bowl} o={bowl}><BowlFlat size={440} bloom={1} toppings={3} /></At>}
          {steam > 0 && <At x={820} y={1020} o={0.9 * steam}><SteamFlat size={260} k={1} t={f} /></At>}
          {tag > 0 && <At x={640} y={1560} rot={-4} sc={0.6 + 0.4 * tag} o={tag}><PriceTagFlat text={fmtRp(DATA.price)} width={560} /></At>}
          {coins.map((c, i) => c > 0.01 && <At key={i} x={130 + i * 105} y={1560 - (i % 2) * 14} sc={Math.min(1.1, c)} o={1}><Coin size={96} /></At>)}
        </div>
      </Bg>
    </AbsoluteFill>
  );
};

export const FullV6: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={FULL.cut + 8}><Part1 /></Sequence>
    <Sequence from={FULL.cut} durationInFrames={FULL.total - FULL.cut}><Closing /></Sequence>
    <Sequence from={FULL.cut - 9} durationInFrames={18}>
      <ObjectTransition at={9} duration={18} objectWidth={520} panelColor="#E8B93C" y={980}><Coin size={520} /></ObjectTransition>
    </Sequence>
  </AbsoluteFill>
);
