import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PaperBackground} from '../backgrounds';
import {NoodlePacket, NoodleBowl, Egg, Greens, Chili, SpringOnion, Sachet, MeatBall, Coin, CoinStack, PriceTagArt, CostLabelArt, Receipt, Warung, Hand, Notebook, Chopsticks, Smartphone, Vendor, IsoBlock, Sparkle} from '../illustrations';
import {palette, derived} from '../visual-system/ColorPalette';
import {textStyle} from '../visual-system/Typography';

const Cell: React.FC<{label: string; children: React.ReactNode; w?: number}> = ({label, children, w = 300}) => (
  <div style={{width: w, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
    <div style={{height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
    <div style={{...textStyle('label', palette.navy), fontSize: 24, letterSpacing: 1}}>{label}</div>
  </div>
);

/** Still-image style sheet: every illustration side by side — used to QC outline/colour/proportion consistency. */
export const StyleSheet: React.FC = () => (
  <PaperBackground>
    <AbsoluteFill style={{padding: '70px 40px', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', gap: '22px 8px'}}>
      <Cell label="NoodlePacket"><NoodlePacket size={280} /></Cell>
      <Cell label="NoodleBowl"><NoodleBowl size={280} toppings /></Cell>
      <Cell label="Egg / cut"><div style={{display: 'flex'}}><Egg size={100} /><Egg size={100} cut /></div></Cell>
      <Cell label="Greens"><Greens size={190} /></Cell>
      <Cell label="Chili"><Chili size={220} /></Cell>
      <Cell label="SpringOnion"><SpringOnion size={170} /></Cell>
      <Cell label="Sachet"><Sachet size={120} /></Cell>
      <Cell label="MeatBall"><MeatBall size={110} /></Cell>
      <Cell label="Coin"><Coin size={130} /></Cell>
      <Cell label="CoinStack"><CoinStack size={200} /></Cell>
      <Cell label="PriceTag"><PriceTagArt size={270} text="Rp 12.000" fontSize={56} /></Cell>
      <Cell label="CostLabel"><CostLabelArt size={250} text="Mi Rp 3.500" fontSize={36} /></Cell>
      <Cell label="Receipt"><Receipt size={150} /></Cell>
      <Cell label="Warung"><Warung size={270} /></Cell>
      <Cell label="Hand"><Hand size={180} /></Cell>
      <Cell label="Notebook"><Notebook size={140} /></Cell>
      <Cell label="Chopsticks"><Chopsticks size={250} /></Cell>
      <Cell label="Smartphone"><Smartphone size={130} /></Cell>
      <Cell label="Vendor"><Vendor size={170} /></Cell>
      <Cell label="IsoBlock"><IsoBlock size={150} height={120} color={palette.green} shadeColor={derived.greenDeep} topColor={derived.greenLight} label="JUAL" /></Cell>
      <Cell label="Sparkle"><Sparkle size={80} /></Cell>
    </AbsoluteFill>
  </PaperBackground>
);
