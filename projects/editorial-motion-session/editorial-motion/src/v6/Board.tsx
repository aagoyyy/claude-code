import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Bg, Headline, Eyebrow, Callout, ChartFlat} from './Layout';
import {KitchenFlat, StallFlat} from './Envs';
import {PacketFlat, BowlFlat, BowlTopFlat, BrickFlat, SteamFlat, PriceTagFlat, CoinFlat} from './Flat';
import {DATA, fmtRp} from './data';
import {C, TYPE} from './style';

const At: React.FC<{x: number; y: number; rot?: number; z?: number; children: React.ReactNode}> = ({x, y, rot = 0, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`}}>{children}</div>
);
const TOP = {egg: [-80, -40, 0.9] as [number, number, number], choy: [70, -80, 0.85] as [number, number, number], chili: [10, 85, 0.9] as [number, number, number], ball: [105, 45, 0.8] as [number, number, number]};

/** 6 static compositions (no hands): frame index selects the board. */
export const V6Board: React.FC = () => {
  const i = useCurrentFrame();
  if (i === 0) return (
    <Bg surface={1240}>
      <Eyebrow text="BISNIS MIE" />
      <Headline lines={['Mi instan cuma', `${fmtRp(DATA.packet)}`]} accent={[fmtRp(DATA.packet).split(' ')[0], fmtRp(DATA.packet).split(' ')[1]]} y={270} />
      <At x={540} y={940}><PacketFlat size={780} /></At>
      <At x={380} y={1510}><PriceTagFlat text={fmtRp(DATA.packet)} width={640} /></At>
    </Bg>
  );
  if (i === 1) return (
    <AbsoluteFill>
      <KitchenFlat />
      <Headline lines={['Dimasak di warung']} y={250} size={TYPE.headline2 + 6} />
      <At x={720} y={840}><SteamFlat size={380} k={0.9} /></At>
      <At x={560} y={990}><BowlFlat size={720} bloom={1} toppings={3} /></At>
    </AbsoluteFill>
  );
  if (i === 2) return (
    <Bg>
      <Eyebrow text="BAHAN" />
      <Headline lines={['Modal bahan', fmtRp(DATA.modal)]} accent={['Rp', '7.000']} y={270} />
      <At x={540} y={1060}><BowlTopFlat size={800} toppings={TOP} /></At>
    </Bg>
  );
  if (i === 3) return (
    <Bg surface={1330}>
      <Headline lines={['Tuang ke mangkuk']} y={250} />
      <At x={700} y={1090}><BowlFlat size={700} bloom={0.5} /></At>
      <At x={360} y={760} rot={112}><PacketFlat size={430} /></At>
      <At x={620} y={760} rot={105}><BrickFlat size={300} /></At>
    </Bg>
  );
  if (i === 4) return (
    <Bg>
      <Eyebrow text="HITUNG UNTUNG" />
      <Headline lines={['Untung', fmtRp(DATA.profit), 'per mangkuk']} accent={['Rp', '5.000']} y={250} size={TYPE.headline - 6} />
      <ChartFlat modal={DATA.modal} price={DATA.price} />
      <Callout x={400} y={730} text={`+${fmtRp(DATA.profit)}`} solid />
    </Bg>
  );
  return (
    <Bg surface={1360}>
      <Headline lines={['Dijual', fmtRp(DATA.price)]} accent={['Rp', '12.000']} y={250} />
      <StallFlat cx={330} ground={1360} size={780} />
      <At x={820} y={1240}><BowlFlat size={440} bloom={1} toppings={3} /></At>
      <At x={640} y={1560}><PriceTagFlat text={fmtRp(DATA.price)} width={560} /></At>
    </Bg>
  );
};
