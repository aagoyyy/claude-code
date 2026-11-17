import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {IsolatedObjectScene, InfographicScene} from '../compositions';
import {Place, cameraPresets, CameraKey} from '../camera';
import {PopIn, SlideIn, Float, GentleRotate, StaggerReveal, ObjectExit, ScaleReveal, LabelReveal, DrawOnPath} from '../animations';
import {NoodlePacket, NoodleBowl, Steam, Egg, Greens, Chili, SpringOnion, Coin, CoinStack, CostLabelArt, PriceTagArt, Hand, IsoBlock, ArrowCurve, Sparkle} from '../illustrations';
import {Headline, PriceTag, NumberHighlight, Callout, CaptionBox} from '../typography';
import {SlideTransition, ObjectTransition, ScaleTransition, LayeredTransition, GraphicWipe, ObjectReplace} from '../transitions';
import {palette, derived} from '../visual-system/ColorPalette';
import {textStyle} from '../visual-system/Typography';
import {PaperBackground} from '../backgrounds';

/** Timeline (30fps, 450 frames = 15s). Scene boundaries are CUT frames; transitions are overlays centred on them. */
export const T = {s1: 0, s2: 60, s3: 120, s4: 195, s5: 255, s6: 330, s7: 405, end: 450} as const;
const D = {s1: T.s2 - T.s1, s2: T.s3 - T.s2, s3: T.s4 - T.s3, s4: T.s5 - T.s4, s5: T.s6 - T.s5, s6: T.s7 - T.s6, s7: T.end - T.s7};

const BOWL = {x: 540, y: 1010, size: 820};

/* ---------------- Scene 1: packet on cream paper ---------------- */
const Scene1: React.FC = () => (
  <IsolatedObjectScene
    tableLine={1240}
    camera={cameraPresets.pushIn(D.s1, 0.07, 540, 900)}
    overlay={
      <>
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
          <Headline text={['Mi instan cuma', 'Rp 3.000?']} size="headline" accent={['Rp', '3.000?']} delay={6} by="line" />
        </AbsoluteFill>
        <CaptionBox brand="BISNIS MIE" />
      </>
    }
  >
    <Place x={540} y={940}>
      <ObjectExit at={46} duration={12} mode="slide" to="left" distance={900}>
        <PopIn delay={4} from={0.4} rotate={-8}>
          <Float amplitude={9} period={80} sway={1.2}>
            <NoodlePacket size={700} />
          </Float>
        </PopIn>
      </ObjectExit>
    </Place>
    {[[220, 780, 0], [880, 730, 6], [190, 1060, 12], [900, 1000, 4]].map(([x, y, d]) => (
      <Place key={x} x={x} y={y}>
        <PopIn delay={10 + d} from={0.2}>
          <Float amplitude={6} period={50} phase={d * 5}>
            <Sparkle size={56} />
          </Float>
        </PopIn>
      </Place>
    ))}
    <Place x={900} y={1330}>
      <ObjectExit at={40} duration={12} mode="slide" to="right" distance={800}>
        <SlideIn from="right" delay={14} distance={700} overshoot>
          <GentleRotate degrees={3} period={60}>
            <Hand size={420} />
          </GentleRotate>
        </SlideIn>
      </ObjectExit>
    </Place>
    <Place x={430} y={1400}>
      <LabelReveal delay={20} from="left" rotate={-5}>
        <PriceTagArt size={560} text="Rp 3.000" />
      </LabelReveal>
    </Place>
  </IsolatedObjectScene>
);

/* ---------------- Scene 2: bowl scales up ---------------- */
const Scene2: React.FC = () => (
  <IsolatedObjectScene
    tableLine={1300}
    camera={cameraPresets.pullOut(D.s2, 1.1, 540, 1000)}
    overlay={
      <>
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
          <Headline text={['Dimasak jadi', 'semangkuk']} size="headline" delay={8} by="line" accent={['semangkuk']} />
        </AbsoluteFill>
        <CaptionBox brand="BISNIS MIE" />
      </>
    }
  >
    <Place x={BOWL.x} y={BOWL.y - 20}>
      <ObjectReplace
        at={9}
        duration={14}
        from={<NoodlePacket size={700} />}
        to={
          <ScaleReveal from={0.3} delay={0}>
            <Float amplitude={7} period={100}>
              <NoodleBowl size={BOWL.size} filled />
            </Float>
          </ScaleReveal>
        }
      />
    </Place>
    <Place x={BOWL.x} y={660}>
      <Steam size={360} delay={30} />
    </Place>
  </IsolatedObjectScene>
);

/* ---------------- Scene 3: ingredients stagger in ---------------- */
const Scene3: React.FC = () => (
  <IsolatedObjectScene
    tableLine={1300}
    camera={cameraPresets.pushIn(D.s3, 0.06, 540, 900)}
    overlay={
      <>
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
          <Headline text={['Tambah topping']} size="headline" delay={4} by="word" accent={['topping']} />
        </AbsoluteFill>
        <CaptionBox brand="BISNIS MIE" />
      </>
    }
  >
    <Place x={BOWL.x} y={BOWL.y}>
      <Float amplitude={7} period={100} phase={30}>
        <NoodleBowl size={BOWL.size} filled />
      </Float>
    </Place>
    <StaggerReveal delay={10} interval={8} variant="slide" from="top" distance={900}>
      {[
        <Place key="e" x={370} y={870}><Egg size={210} cut /></Place>,
        <Place key="g" x={700} y={850}><Greens size={290} /></Place>,
        <Place key="c" x={560} y={800}><Chili size={250} /></Place>,
        <Place key="s" x={470} y={760}><SpringOnion size={170} /></Place>,
      ]}
    </StaggerReveal>
    <Place x={350} y={1190}>
      <Callout text="Telur" width={300} delay={44} rotate={-6} />
    </Place>
    <Place x={720} y={1190}>
      <Callout text="Sawi" width={300} delay={52} rotate={5} />
    </Place>
  </IsolatedObjectScene>
);

/* ---------------- Scene 4: price tag + kinetic typography ---------------- */
const Scene4: React.FC = () => (
  <IsolatedObjectScene
    tableLine={1300}
    camera={[{frame: 0, scale: 1, x: 540, y: 960}, {frame: 34, scale: 1.1, x: 540, y: 880}]}
    overlay={
      <>
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
          <Headline text={['Dijual semangkuk']} size="section" delay={2} by="word" />
        </AbsoluteFill>
        <CaptionBox brand="BISNIS MIE" />
      </>
    }
  >
    <Place x={BOWL.x} y={BOWL.y + 40}>
      <Float amplitude={6} period={110}>
        <NoodleBowl size={BOWL.size} filled toppings />
      </Float>
    </Place>
    <Place x={540} y={700}>
      <PriceTag text="Rp 12.000" width={880} delay={6} from="left" rotate={-5} />
    </Place>
  </IsolatedObjectScene>
);

/* ---------------- Scene 5: coins + cost labels ---------------- */
const Scene5: React.FC = () => (
  <IsolatedObjectScene
    tableLine={1330}
    camera={cameraPresets.pullOut(D.s5, 1.16, 540, 940)}
    overlay={
      <>
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
          <Headline text={['Modalnya cuma', 'Rp 7.000']} size="headline" delay={4} by="line" accent={['Rp', '7.000']} />
        </AbsoluteFill>
        <CaptionBox brand="BISNIS MIE" />
      </>
    }
  >
    <Place x={540} y={1010}>
      <NoodleBowl size={680} filled toppings />
    </Place>
    <StaggerReveal delay={8} interval={6} variant="pop">
      {[
        <Place key="a" x={200} y={820}><Float amplitude={7} period={70}><CoinStack size={210} count={3} /></Float></Place>,
        <Place key="b" x={880} y={780}><Float amplitude={7} period={64} phase={14}><Coin size={160} /></Float></Place>,
        <Place key="c" x={190} y={1290}><Float amplitude={6} period={72} phase={30}><Coin size={150} /></Float></Place>,
        <Place key="d" x={890} y={1260}><Float amplitude={7} period={80} phase={44}><CoinStack size={200} count={4} /></Float></Place>,
      ]}
    </StaggerReveal>
    <Place x={330} y={640}>
      <Callout text="Mi  Rp 3.500" width={440} delay={30} rotate={-5} from="left" />
    </Place>
    <Place x={780} y={600}>
      <Callout text="Telur  Rp 2.000" width={460} delay={38} rotate={4} from="right" />
    </Place>
    <Place x={540} y={1420}>
      <Callout text="Bumbu  Rp 1.500" width={480} delay={46} rotate={-2} from="bottom" />
    </Place>
  </IsolatedObjectScene>
);

/* ---------------- Scene 6: cost vs selling price infographic ---------------- */
const Scene6: React.FC = () => {
  const costH = 150;
  const priceH = 380;
  return (
    <InfographicScene
      camera={cameraPresets.panY(D.s6, 1020, 960, 1.06)}
      overlay={
        <>
          <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
            <Headline text={['Modal vs harga jual']} size="section" delay={2} />
          </AbsoluteFill>
          <CaptionBox brand="BISNIS MIE" />
        </>
      }
    >
      <GrowBlock x={330} y={1050} height={costH} delay={8} color={palette.mustard} shade={derived.mustardDeep} top={derived.mustardLight} label="MODAL" />
      <GrowBlock x={740} y={1050} height={priceH} delay={18} color={palette.green} shade={derived.greenDeep} top={derived.greenLight} label="JUAL" />
      <Place x={330} y={1250}>
        <Callout text="Rp 7.000" width={330} delay={26} rotate={-4} color={palette.mustard} />
      </Place>
      <Place x={740} y={1250}>
        <Callout text="Rp 12.000" width={360} delay={34} rotate={4} color={palette.green} textColor={derived.white} />
      </Place>
      <Place x={760} y={470}>
        <PopIn delay={40} from={0.6}>
          <Float amplitude={6} period={80}>
            <NoodleBowl size={300} filled toppings />
          </Float>
        </PopIn>
      </Place>
      <Place x={420} y={700}>
        <ArrowCurve delay={30} size={300} />
      </Place>
      <Place x={300} y={560}>
        <NumberHighlight to={42} suffix="%" delay={44} duration={24} size={150} caption="margin kotor" thousands={false} />
      </Place>
    </InfographicScene>
  );
};

const GrowBlock: React.FC<{x: number; y: number; height: number; delay: number; color: string; shade: string; top: string; label: string}> = ({x, y, height, delay, color, shade, top, label}) => {
  // block grows with a spring-like ease; implemented via PopIn wrapper for scale-from-bottom feel
  return (
    <Place x={x} y={y - height / 2}>
      <SlideIn from="bottom" delay={delay} distance={220} overshoot>
        <IsoBlock size={300} height={height} color={color} shadeColor={shade} topColor={top} label={label} />
      </SlideIn>
    </Place>
  );
};

/* ---------------- Scene 7: everything together ---------------- */
const Scene7: React.FC = () => (
  <IsolatedObjectScene
    tableLine={1340}
    camera={cameraPresets.pullOut(D.s7, 1.08, 540, 960)}
    overlay={
      <>
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
          <Headline text={['Semangkuk mi', '= bisnis untung']} size="headline" delay={14} by="line" accent={['untung']} />
        </AbsoluteFill>
        <CaptionBox brand="BISNIS MIE" />
      </>
    }
  >
    <Place x={540} y={1040}>
      <PopIn delay={0} from={0.8}>
        <Float amplitude={6} period={90}>
          <NoodleBowl size={760} filled toppings />
        </Float>
      </PopIn>
    </Place>
    <Place x={540} y={660}><Steam size={340} delay={0} /></Place>
    <Place x={230} y={1330}>
      <PopIn delay={6}><CoinStack size={230} count={4} /></PopIn>
    </Place>
    <Place x={850} y={1340}>
      <PopIn delay={9}><Coin size={170} /></PopIn>
    </Place>
    <Place x={300} y={820}>
      <LabelReveal delay={4} from="left" rotate={-8}><PriceTagArt size={430} text="Rp 12.000" fontSize={58} /></LabelReveal>
    </Place>
    <Place x={810} y={850}>
      <NumberHighlight to={42} suffix="%" delay={8} duration={14} size={120} caption="margin" thousands={false} />
    </Place>
  </IsolatedObjectScene>
);

/* ---------------- Composition ---------------- */
export const VisualStyleDemo: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={T.s1} durationInFrames={D.s1}><Scene1 /></Sequence>
    <Sequence from={T.s2} durationInFrames={D.s2}><Scene2 /></Sequence>
    <Sequence from={T.s3} durationInFrames={D.s3}><Scene3 /></Sequence>
    <Sequence from={T.s4} durationInFrames={D.s4}><Scene4 /></Sequence>
    <Sequence from={T.s5} durationInFrames={D.s5}><Scene5 /></Sequence>
    <Sequence from={T.s6} durationInFrames={D.s6}><Scene6 /></Sequence>
    <Sequence from={T.s7} durationInFrames={D.s7}><Scene7 /></Sequence>

    {/* transitions (overlays centred on cuts; each exercises a different system preset) */}
    <SlideTransition at={T.s2} duration={16} />
    {/* T2: clean hard cut at s3 — bowl persists, so continuity IS the transition */}
    <ObjectTransition at={T.s4} duration={22} objectWidth={620} y={900}>
      <PriceTagArt size={620} text="Rp ?" />
    </ObjectTransition>
    <ScaleTransition at={T.s5} duration={18} cx={540} cy={1000} />
    <LayeredTransition at={T.s6} duration={26} />
    <GraphicWipe at={T.s7} duration={20} />
  </AbsoluteFill>
);
