import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {EnvironmentScene, TopDownScene} from '../compositions';
import {Place, cameraPresets} from '../camera';
import {PopIn, SlideIn, Float, StaggerReveal} from '../animations';
import {Warung, Vendor, Receipt, Notebook, Chopsticks, Smartphone, CoinStack, Coin, NoodleBowl, Hand} from '../illustrations';
import {Headline, PriceTag, Callout} from '../typography';

/** Exercises the environment + top-down patterns that the 15s demo does not use. 3s environment, 3s top-down. */
export const SceneTemplatesDemo: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={90}>
      <EnvironmentScene
        kind="warung"
        counterY={1180}
        camera={cameraPresets.panX(90, 600, 480, 1.08)}
        overlay={<AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}><Headline text={['Warung kecil,', 'untung besar']} size="headline" by="line" accent={['untung']} /></AbsoluteFill>}
      >
        <Place x={300} y={920}><PopIn delay={4}><Warung size={560} sign="MIE" /></PopIn></Place>
        <Place x={780} y={980}><SlideIn from="right" delay={10} overshoot><Vendor size={360} /></SlideIn></Place>
        <Place x={820} y={1330}><PopIn delay={22}><NoodleBowl size={420} toppings /></PopIn></Place>
        <Place x={300} y={1340}><Callout text="Rp 12.000" width={360} delay={28} /></Place>
      </EnvironmentScene>
    </Sequence>
    <Sequence from={90} durationInFrames={90}>
      <TopDownScene
        camera={cameraPresets.topDown(90)}
        overlay={<AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}><Headline text={['Catat setiap rupiah']} size="section" /></AbsoluteFill>}
      >
        <StaggerReveal delay={4} interval={8} variant="pop">
          {[
            <Place key="n" x={300} y={780}><Float amplitude={4} period={90}><Notebook size={300} /></Float></Place>,
            <Place key="r" x={790} y={780}><Receipt size={300} /></Place>,
            <Place key="c" x={560} y={1330}><Chopsticks size={420} /></Place>,
            <Place key="p" x={220} y={1210}><Smartphone size={210} /></Place>,
            <Place key="s" x={850} y={1200}><CoinStack size={260} count={4} /></Place>,
            <Place key="k" x={540} y={560}><Coin size={150} /></Place>,
          ]}
        </StaggerReveal>
        <Place x={540} y={1010}><PriceTag text="Rp 7.000" width={560} delay={50} rotate={-4} /></Place>
        <Place x={930} y={1400}><SlideIn from="right" delay={30} overshoot><Hand size={240} /></SlideIn></Place>
      </TopDownScene>
    </Sequence>
  </AbsoluteFill>
);
