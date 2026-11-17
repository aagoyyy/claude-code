import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {CameraRig, resolveCamera, CameraKey, cameraShots} from '../camera/CameraMovement';
import {Place} from '../camera/SceneFraming';
import {Packet2} from '../dynamic/v2/Packet';
import {Bowl2} from '../dynamic/v2/Bowl';
import {Brick2} from '../dynamic/v2/Brick';
import {Flecks, ImpactBurst, Droplets} from '../dynamic/v2/Fx';
import {SwingTag2} from '../dynamic/v2/SwingTag2';
import {ProcSteam} from '../dynamic/ProcSteam';
import {Sparkle} from '../illustrations/Infographics/Infographics';
import {Warung} from '../illustrations/Business/Warung';
import {Vendor} from '../illustrations/Characters/Vendor';
import {Notebook, Chopsticks} from '../illustrations';
import {squashScale} from '../dynamic/physics';
import {clamp, easeInOutCubic, easeOutCubic, lerp} from '../dynamic/math';
import {Hand2, POSES, blendPose, handTip, PINCH_TIP, GRIP} from '../v3/Hand2';
import {KitchenEnv, TopDownTable} from '../v3/Environments';
import {TopBowl, TopEgg, TopChoy, TopChili, TopBall} from '../v3/TopDown';
import {BlackLabel, CategoryLabel, Subtitle} from '../v3/Graphics';
import {act, dampSin} from '../v3/motion';
import {InkLineWorld, PaperInk} from './Ink';
import {progress, wobble} from './profiles';
import {CostChart, Coin4, CoinColumn} from './Finance';
import {StreetEnv, RoundTable} from './WideScene';
import {EggHalf, BokChoy, ChiliPepper, Meatball} from '../dynamic/v2/Toppings';
import {ObjectTransition} from '../transitions/ObjectTransition';
import {SceneMeta} from '../compositions/CompositionEngine';

export const FPS4 = 24;
export const V4 = {s1: 62, s2From: 54, s2: 38, s3From: 92, s3: 28, total: 120} as const;
export const V4_SCENES: SceneMeta[] = [
  {name: 'S1 kitchen: hand rips + pours (medium -> close-up)', kind: 'character-interaction'},
  {name: 'S2 top-down: place toppings + financial chart', kind: 'top-down'},
  {name: 'S3 wide street closing', kind: 'wide-environment'},
];

/* ---------------- shared math ---------------- */
const rad = (d: number) => (d * Math.PI) / 180;
const rot2 = (v: [number, number], deg: number): [number, number] => { const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]; };
const originFor = (tip: [number, number], s: number, r: number, mirror: boolean, local: [number, number] = PINCH_TIP): [number, number] => {
  const o = handTip(0, 0, s, r, mirror, local);
  return [tip[0] - o[0], tip[1] - o[1]];
};
const World: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>{children}</svg>;

/* ---------------- S1 choreography (module-level, deterministic) ---------------- */
const PK = {x: 300, y: 1030, size: 470};
const PKk = PK.size / 400;
const BOWL = {x: 740, y: 1004, size: 640};
const SURF = 962; // broth surface y
const HS = 1.2;
const PC_VEC: [number, number] = [(166 - GRIP[0]) * HS, (GRIP[1] - 44) * HS]; // origin -> packet centre (mirrored hand, unrotated)

const poseR = (f: number) => 104 * act(f, 31, 2, 10, -0.1, 1.12); // pour rotation (deg)
const packetC = (f: number): [number, number] => {
  if (f < 20) return [PK.x, PK.y];
  if (f < 25) { const u = easeInOutCubic((f - 20) / 5); return [PK.x, lerp(PK.y, 900, u)]; }
  const u = easeInOutCubic((f - 25) / 7);
  return [lerp(PK.x, 585, u), lerp(900, 770, u) - 34 * Math.sin(Math.PI * u)];
};
const slide = (f: number) => 300 * Math.pow(clamp((poseR(f) - 40) / 50), 1.4);
const EXIT_F = (() => { for (let f = 30; f < 80; f++) if (slide(f) >= 245) return f; return 44; })();
const FALL_V = 11, FALL_G = 6.5;
const exitPos = (): [number, number] => { const c = packetC(EXIT_F), r = poseR(EXIT_F); const o = rot2([0, 20 - 245], r); return [c[0] + o[0], c[1] + o[1]]; };
const brickFree = (t: number): [number, number] => { const e = exitPos(); const r = poseR(EXIT_F); const d = rot2([0, -1], r); return [e[0] + d[0] * FALL_V * t, e[1] + d[1] * FALL_V * t + 0.5 * FALL_G * t * t]; };
const LAND_F = (() => { for (let t = 0; t < 40; t++) if (brickFree(t)[1] >= SURF) return EXIT_F + t; return EXIT_F + 6; })();

const CAM1: CameraKey[] = [
  {frame: 0, scale: 1.22, x: 442, y: 1020},
  {frame: 20, scale: 1.22, x: 470, y: 1010},
  {frame: 30, scale: 1.3, x: 620, y: 930},
  {frame: 40, scale: 1.45, x: 700, y: 950},
  {frame: LAND_F + 2, scale: 1.5, x: 720, y: 960},
  {frame: 62, scale: 3.2, x: 740, y: 950},
];

const Whip: React.FC = () => null;
void Whip;

const ShotS1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const corner: [number, number] = [PK.x + (364 - 200) * PKk, PK.y + (56 - 150) * PKk];
  /* --- right hand: pinch + rip (hand profile: wind-up, fast pull, release) --- */
  const rip = act(f, 4, 3, 6, -0.2, 1.25);
  const rel = f >= 13;
  const pull: [number, number] = [rip * 110, rip * -200];
  const fly = Math.max(0, f - 13);
  const stripOff = {x: pull[0] + fly * 34, y: pull[1] - fly * 18 + fly * fly * 3.2, r: Math.max(0, rip) * 52 + fly * 14, o: 1 - clamp(fly / 7)};
  const open = clamp((rip - 0.12) / 0.7);
  const tipR: [number, number] = [corner[0] + pull[0] * PKk, corner[1] + pull[1] * PKk];
  const enter = 1 - Math.pow(1 - clamp(f / 4), 3);
  const retreat = easeInOutCubic((f - 13) / 6);
  const tip1: [number, number] = f < 4 ? [lerp(corner[0] + 520, corner[0], enter), lerp(corner[1] + 150, corner[1], enter)] : f < 13 ? tipR : [tipR[0] + retreat * 540, tipR[1] - retreat * 380];
  const rot1 = -8 + Math.max(0, rip) * -14;
  const org1 = originFor(tip1, 1.3, rot1, false);
  const pose1 = blendPose(POSES.open, POSES.pinch, clamp((f - 2) / 3));
  /* --- packet --- */
  const gripped = f >= 17;
  const C = packetC(f);
  const r = f < 20 ? 0 : poseR(f) + (f < 31 ? -3 * easeInOutCubic((f - 20) / 5) : 0);
  const coil = rip < 0 ? -rip : 0;
  const pop = f >= 9 ? 0.1 * Math.exp(-(f - 9) / 3) : 0;
  const liftSq = f >= 17 && f < 22 ? -0.04 * Math.sin(Math.PI * clamp((f - 17) / 5)) : 0;
  const sq = squashScale(coil * 0.2 - pop * 0.6 + liftSq);
  const wob = dampSin(f - 11, 4, 7, 0.8);
  /* --- left hand: grip + carry + pour (rigid with packet) --- */
  const s2 = HS;
  const O2: [number, number] = (() => { const rv = rot2(PC_VEC, r); return [C[0] - rv[0], C[1] - rv[1]]; })();
  const approach = f < 17 ? easeInOutCubic((f - 11) / 6) : 1;
  const org2: [number, number] = f < 11 ? [-600, 1000] : [lerp(O2[0] - 480, O2[0], approach), lerp(O2[1] + 90, O2[1], approach)];
  const pose2 = blendPose(POSES.open, POSES.grip, clamp((f - 15) / 4));
  const retreat2 = f > 50 ? easeInOutCubic((f - 50) / 6) : 0;
  const hand2 = f >= 11;
  /* --- brick --- */
  const d = f < 31 ? 0 : slide(f);
  const sliding = f >= 33 && f < EXIT_F;
  const brickLocal = rot2([0, 20 - d], r);
  const free = f >= EXIT_F && f < LAND_F;
  const fT = f - EXIT_F;
  const bp: [number, number] = free ? brickFree(fT) : [C[0] + brickLocal[0], C[1] + brickLocal[1]];
  const bR = free ? poseR(EXIT_F) + fT * 6 : r;
  const brickOn = f >= 33 && f < LAND_F + 1;
  const lt = f - LAND_F;
  /* --- bowl (FOOD profile: soft wobble) --- */
  const bloom = lt < 0 ? 0 : Math.max(0, 1 - Math.exp(-lt / 4) * Math.cos(lt * 0.45));
  const bSq = squashScale(wobble('food', f, LAND_F, 0.1));
  const fill = 0.62 + 0.2 * easeOutCubic(lt / 12);
  const wave = 0.1 + (lt >= 0 ? 1.2 * Math.exp(-lt / 9) : 0);
  const steam = clamp((f - LAND_F) / 10) * 0.9;
  const shake = lt >= 0 ? 9 * Math.exp(-lt / 4) : 0;
  const camBlur = clamp((resolveCamera(CAM1, f).scale - 1.2) * 4);
  return (
    <AbsoluteFill style={{transform: `translate(${Math.sin(f * 2.3) * shake}px, ${Math.cos(f * 1.9) * shake * 0.8}px)`}}>
      <InkLineWorld id="ink-s1">
      <CameraRig keys={CAM1}>
          <KitchenEnv t={f} lite />
          <Place x={BOWL.x} y={BOWL.y} style={{transform: `translate(-50%,-50%) scale(${bSq.sx},${bSq.sy})`, transformOrigin: '50% 94%'}}>
            <Bowl2 size={BOWL.size} fill={fill} wave={wave} bloom={bloom} jig={lt >= 0 ? Math.exp(-lt / 10) : 0} gloss={0.45} />
          </Place>
          {steam > 0.02 && <Place x={BOWL.x} y={BOWL.y - 290}><ProcSteam size={600} intensity={steam} /></Place>}
          {brickOn && (
            <Place x={bp[0]} y={bp[1]} style={{transform: `translate(-50%,-50%) rotate(${bR}deg)`}}>
              <Brick2 size={330} wet={clamp(lt / 6)} />
            </Place>
          )}
          <Place x={C[0]} y={C[1]} style={{transform: `translate(-50%,-50%) rotate(${r + wob}deg) scale(${sq.sx * (1 + pop)},${sq.sy * (1 + pop)})`, transformOrigin: '50% 90%'}}>
            <Packet2 size={PK.size} open={open} strip={f < 20 ? stripOff : {...stripOff, o: 0}} peek={f < 31} />
          </Place>
          <World>
            {f < 22 && <Hand2 x={org1[0]} y={org1[1]} s={1.3} rot={rot1} pose={pose1} uid="h1" />}
            {hand2 && <Hand2 x={org2[0] - retreat2 * 500} y={org2[1]} s={s2} rot={r} mirror pose={pose2} uid="h2" />}
          </World>
          <Flecks x={corner[0]} y={corner[1]} start={9} count={14} />
          <ImpactBurst x={corner[0] - 80} y={corner[1] + 60} start={9} size={260} />
          <Droplets x={BOWL.x} y={SURF} ground={1470} start={LAND_F} count={18} />
          <ImpactBurst x={BOWL.x} y={SURF - 20} start={LAND_F} size={520} />
      </CameraRig>
      </InkLineWorld>
      {/* typography: TYPE profile = precise, no overshoot */}
      <BlackLabel text="Mi instan Rp 3.000" delay={2} size={54} y={300} />
      {[[150, 700, 14, 56], [930, 640, 20, 46]].map(([x, y, dl, s], i) => f >= dl && f < 40 && <Place key={i} x={x} y={y} style={{transform: `translate(-50%,-50%) scale(${Math.min(1, (f - dl) / 5)}) rotate(${f * 5}deg)`}}><Sparkle size={s} /></Place>)}
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${-easeInOutCubic((f - 30) / 6) * 700}px)`}}><SwingTag2 text="Rp 3.000" start={16} hx={310} hy={430} width={500} /></div>
      <Subtitle text="Tuang ke mangkuk" delay={30} y={1440} />
    </AbsoluteFill>
  );
};

/* ---------------- S2: top-down ---------------- */
const TB = {x: 320, y: 860, R: 245};
const ShotS2: React.FC<{s2Start: number}> = ({s2Start}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gf = f + s2Start;
  /* iris from the bowl: centre follows the S1 camera */
  const cam = resolveCamera(CAM1, Math.min(gf, 62));
  const ic: [number, number] = [540 + (BOWL.x - cam.x) * cam.scale, 960 + (950 - cam.y) * cam.scale];
  const ir = interpolate(f, [0, 9], [70, 2600], {extrapolateRight: 'clamp', easing: (t) => t * t * (3 - 2 * t)});
  const k = interpolate(f, [0, 12], [2.4, 1], {extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3)});
  const tx = (1 - clamp(f / 12)) * (ic[0] - TB.x * 1);
  const ty = (1 - clamp(f / 12)) * (ic[1] - TB.y * 1);
  /* egg: hand places it (HAND + FOOD profiles) */
  const eg0 = 3, rel = 10;
  const eTip: [number, number] = f < rel ? [lerp(-160, 252, easeInOutCubic((f - eg0) / 6)), lerp(1000, 770, easeInOutCubic((f - eg0) / 6))] : [252, 770];
  const eRet = easeInOutCubic((f - 12) / 6);
  const eHand: [number, number] = f < rel + 1 ? eTip : [252 - eRet * 520, 770 + eRet * 200];
  const orgE = originFor(eHand, 1.15, 0, true);
  const poseE = blendPose(POSES.pinch, POSES.open, clamp((f - rel) / 3));
  const eggFall = clamp((f - rel) / 3);
  const eggPos: [number, number] = f < rel ? [eHand[0] + 78, eHand[1] - 6] : [lerp(eHand[0] + 78, 290, eggFall), lerp(eHand[1] - 6, 830, eggFall)];
  const eggH = f < rel ? 70 : 70 * (1 - eggFall * eggFall);
  const eggSoft = wobble('food', f, rel + 3, 6);
  const drop = (st: number, h0: number, dur = 5) => (f < st ? null : h0 * (1 - Math.pow(clamp((f - st) / dur), 2)));
  const hCh = drop(10, 420), hCl = drop(12, 420), hB1 = drop(14, 420), hB2 = drop(16, 420);
  const soft = (st: number, a = 5) => wobble('food', f, st + 5, a);
  const bump = 1 + wobble('food', f, 13, 0.04) + wobble('food', f, 17, 0.03);
  const camKeys = cameraShots.topDown(V4.s2, 540, 960, 0.9);
  return (
    <AbsoluteFill style={{clipPath: `circle(${ir}px at ${ic[0]}px ${ic[1]}px)`}}>
      <InkLineWorld id="ink-s2">
        <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${k})`, transformOrigin: `${TB.x}px ${TB.y}px`}}>
          <CameraRig keys={camKeys}>
            <TopDownTable />
            <Place x={880} y={1390} style={{transform: 'translate(-50%,-50%) rotate(10deg)'}}><Notebook size={230} /></Place>
            <Place x={300} y={1400} style={{transform: 'translate(-50%,-50%) rotate(-14deg)'}}><Chopsticks size={420} /></Place>
            <World>
              <TopBowl cx={TB.x} cy={TB.y} R={TB.R} bloom={1} ripple={clamp((f - 2) / 14)} jig={Math.exp(-f / 10)} sx={bump} sy={bump} />
              {hCh !== null && <TopChoy x={376} y={790} h={hCh} rot={-18 + soft(10)} s={0.8} />}
              {f >= rel && <TopEgg x={eggPos[0]} y={eggPos[1]} h={eggH} rot={-12 + eggSoft} s={0.78 * (1 + eggSoft * 0.01)} />}
              {hCl !== null && <TopChili x={330} y={930} h={hCl} rot={14 + soft(12)} s={0.9} />}
              {hB1 !== null && <TopBall x={410} y={880} h={hB1} s={0.85} />}
              {hB2 !== null && <TopBall x={246} y={900} h={hB2} s={0.8} />}
              {f < rel + 3 && <TopEgg x={eggPos[0]} y={eggPos[1]} h={70} rot={-12} s={0.78} />}
              {f >= eg0 && f < 20 && <Hand2 x={orgE[0]} y={orgE[1]} s={1.15} mirror pose={poseE} opacity={f < 16 ? 1 : 1 - clamp((f - 16) / 3)} uid="h3" />}
            </World>
          </CameraRig>
        </AbsoluteFill>
      </InkLineWorld>
      <CategoryLabel no="03." text="HITUNG UNTUNGNYA" delay={6} x={90} y={250} />
      <BlackLabel text="Modal Rp 7.000, jual Rp 12.000" delay={9} size={42} y={400} rot={1.5} />
      <CostChart x={585} y={560} w={430} cost={7000} price={12000} delay={8} rot={2.5} />
    </AbsoluteFill>
  );
};

/* ---------------- S3: wide closing ---------------- */
const ShotS3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const keys: CameraKey[] = [{frame: 0, scale: 1.3, x: 640, y: 1090}, {frame: 28, scale: 1.0, x: 540, y: 960}];
  const popStaff = (st: number) => progress('coin', f, st, fps);
  return (
    <AbsoluteFill>
      <InkLineWorld id="ink-s3">
      <CameraRig keys={keys}>
          <StreetEnv t={f} />
          <Place x={330} y={1018}><Warung size={800} sign="MIE" /></Place>
          <Place x={880} y={1160}><Vendor size={300} /></Place>
          <RoundTable x={880} y={1290} w={340} />
          <Place x={880} y={1220} style={{transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * progress('food', f, 2, fps)})`, transformOrigin: '50% 90%'}}><Bowl2 size={250} fill={0.85} bloom={1} gloss={0.4} /></Place>
          {[[670, 1262, 3, 3], [740, 1262, 6, 5], [1050, 1262, 9, 4]].map(([x, y, st, n], i) => (
            <Place key={i} x={x} y={y - 30} style={{transform: `translate(-50%,-50%) scale(${Math.min(1.15, popStaff(st))})`, transformOrigin: '50% 100%', opacity: popStaff(st) > 0.02 ? 1 : 0}}><CoinColumn n={n} size={130} hopTop={Math.max(0, wobble('coin', f, st + 4, 12))} /></Place>
          ))}
          {[[620, 560, 8, 62], [140, 640, 11, 50], [980, 800, 13, 58]].map(([x, y, st, s], i) => f >= st && <Place key={i} x={x} y={y} style={{transform: `translate(-50%,-50%) scale(${Math.min(1, (f - st) / 5)}) rotate(${f * 5}deg)`}}><Sparkle size={s} /></Place>)}
      </CameraRig>
      </InkLineWorld>
      <SwingTag2 text="Rp 12.000" start={2} hx={290} hy={420} width={520} />
      <BlackLabel text="Untung Rp 5.000 per mangkuk" delay={6} size={46} y={300} rot={-1.5} />
    </AbsoluteFill>
  );
};

export const DemoV4: React.FC = () => (
  <AbsoluteFill style={{background: '#F5EBD3'}}>
    <Sequence from={0} durationInFrames={V4.s1}><ShotS1 /></Sequence>
    <Sequence from={V4.s2From} durationInFrames={V4.s2}><ShotS2 s2Start={V4.s2From} /></Sequence>
    <Sequence from={V4.s3From} durationInFrames={V4.s3}><ShotS3 /></Sequence>
    <ObjectTransition at={V4.s3From} duration={10} objectWidth={520} panelColor="#E6B94F" y={980}><Coin4 size={520} /></ObjectTransition>
    <PaperInk />
  </AbsoluteFill>
);
