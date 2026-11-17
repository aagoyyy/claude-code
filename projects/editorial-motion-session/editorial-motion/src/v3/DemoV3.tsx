import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {CameraRig, cameraShots} from '../camera/CameraMovement';
import {Place} from '../camera/SceneFraming';
import {Packet2} from '../dynamic/v2/Packet';
import {Bowl2} from '../dynamic/v2/Bowl';
import {EggHalf, BokChoy, ChiliPepper, Meatball, ScallionRing} from '../dynamic/v2/Toppings';
import {Flecks, ImpactBurst} from '../dynamic/v2/Fx';
import {SwingTag2} from '../dynamic/v2/SwingTag2';
import {ProcSteam} from '../dynamic/ProcSteam';
import {Sparkle} from '../illustrations/Infographics/Infographics';
import {Notebook, Chopsticks} from '../illustrations';
import {squashScale} from '../dynamic/physics';
import {clamp, easeInOutCubic, easeOutCubic, lerp, hash} from '../dynamic/math';
import {Hand2, POSES, blendPose, handTip, PINCH_TIP, GRIP} from './Hand2';
import {KitchenEnv, TopDownTable} from './Environments';
import {TopBowl, TopEgg, TopChoy, TopChili, TopBall, TopBrick} from './TopDown';
import {InkWorld, GradeV3} from './Texture';
import {BlackLabel, Subtitle, CategoryLabel, InfoPanel, ArrowDraw} from './Graphics';
import {act, dampSin, dampCos} from './motion';
import {SceneMeta} from '../compositions/CompositionEngine';

export const V3 = {A: 50, B: 55, C: 45, total: 150} as const;
export const V3_SCENES: SceneMeta[] = [
  {name: 'A kitchen — hand opens packet', kind: 'character-interaction'},
  {name: 'B top-down — pour & place', kind: 'top-down'},
  {name: 'C close-up — presented bowl', kind: 'close-up'},
];

const World: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>{children}</svg>
);
const originFor = (tip: [number, number], s: number, rot: number, mirror: boolean, local = PINCH_TIP): [number, number] => {
  const o = handTip(0, 0, s, rot, mirror, local);
  return [tip[0] - o[0], tip[1] - o[1]];
};

/** whip-pan between shots: horizontal blur + slide on the first/last frames */
const Whip: React.FC<{dur: number; inn?: boolean; out?: boolean; children: React.ReactNode}> = ({dur, inn, out, children}) => {
  const f = useCurrentFrame();
  let k = 0, dir = 1;
  if (inn && f < 4) { k = (4 - f) / 4; dir = 1; }
  if (out && f >= dur - 4) { k = (f - (dur - 4) + 1) / 4; dir = -1; }
  return (
    <AbsoluteFill style={{transform: `translateX(${dir * k * k * 120}px)`, filter: k > 0 ? `blur(${k * 14}px)` : undefined}}>{children}</AbsoluteFill>
  );
};

/* ================= SHOT A — kitchen, side view, hand opens the packet ================= */
const PK = {cx: 390, cy: 1030, size: 470};
const PKk = PK.size / 400;
const ShotA: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = PK;
  // packet corner (strip) world position at rest
  const corner: [number, number] = [t0.cx + (364 - 200) * PKk, t0.cy + (56 - 150) * PKk];
  const rip = act(f, 12, 4, 9, -0.2, 1.25); // anticipation (<0) -> rip (to 1) with overshoot
  const exitK = easeInOutCubic((f - 27) / 14);
  const pull: [number, number] = [rip * 110 + exitK * 330, rip * -200 + exitK * -520]; // vb units
  const stripOff = {x: pull[0], y: pull[1], r: Math.max(0, rip) * 52 + exitK * 40, o: 1 - clamp((f - 36) / 6)};
  const open = clamp((rip - 0.12) / 0.7);
  const tip: [number, number] = [corner[0] + pull[0] * PKk, corner[1] + pull[1] * PKk];
  const enter = easeOutCubicHand(f);
  const hs = 1.3;
  const handRot = -8 + Math.max(0, rip) * -14;
  const tipNow: [number, number] = f < 10 ? [lerp(corner[0] + 520, corner[0], enter), lerp(corner[1] + 150, corner[1], enter)] : tip;
  const org = originFor(tipNow, hs, handRot, false);
  const q = clamp((f - 7) / 4);
  const pose = blendPose(POSES.open, POSES.pinch, q);
  // packet reactions: coil during wind-up, pop at rip, damped wobble after
  const coil = rip < 0 ? -rip : 0;
  const pop = f >= 16 ? 0.1 * Math.exp(-(f - 16) / 3.5) : 0;
  const wob = dampSin(f - 18, 5, 8, 0.7);
  const sq = squashScale(coil * 0.2 - pop * 0.6);
  const shadowK = 1;
  void shadowK;
  return (
    <Whip dur={V3.A} out>
      <CameraRig keys={cameraShots.frame('medium', 600, 1030, V3.A, 0.07, -40, 8)}>
        <InkWorld id="ink-a" amount={4}>
          <KitchenEnv t={f} />
          <Place x={t0.cx} y={t0.cy} style={{transform: `translate(-50%,-50%) rotate(${wob}deg) scale(${sq.sx * (1 + pop)},${sq.sy * (1 + pop)})`, transformOrigin: '50% 90%'}}>
            <Packet2 size={t0.size} open={open} strip={stripOff} />
          </Place>
          <World>
            <Hand2 x={org[0]} y={org[1]} s={hs} rot={handRot} pose={pose} />
          </World>
          <Flecks x={corner[0]} y={corner[1]} start={16} count={16} />
          <ImpactBurst x={t0.cx} y={t0.cy - 80} start={16} size={300} />
        </InkWorld>
      </CameraRig>
      <SwingTag2 text="Rp 3.000" start={26} hx={330} hy={430} width={480} />
      <BlackLabel text="Mi instan cuma Rp 3.000" delay={2} size={54} y={300} />
      {[[170, 700, 22, 60], [900, 640, 28, 48]].map(([x, y, d, s], i) => f >= d && <Place key={i} x={x} y={y} style={{transform: `translate(-50%,-50%) scale(${Math.min(1, (f - d) / 6)}) rotate(${f * 4}deg)`}}><Sparkle size={s} /></Place>)}
    </Whip>
  );
};
const easeOutCubicHand = (f: number) => 1 - Math.pow(1 - clamp(f / 10), 3);

/* ================= SHOT B — top-down, hand pours noodles, second hand places egg ================= */
const BOWL = {x: 400, y: 900, R: 290};
const ShotB: React.FC = () => {
  const f = useCurrentFrame();
  /* brick (right hand) */
  const rel = 13; // release frame
  const backPull = f < 4 ? 0 : 0;
  void backPull;
  const hA = f < 4 ? [lerp(960, 985, f / 4), lerp(470, 455, f / 4)] : f < 11 ? [lerp(985, 575, easeInOutCubic((f - 4) / 7)), lerp(455, 650, easeInOutCubic((f - 4) / 7))] : [lerp(575, 575, 1), 650];
  const retr = easeInOutCubic((f - 15) / 11);
  const handA: [number, number] = f < rel + 2 ? [hA[0], hA[1]] : [575 + retr * 520, 650 - retr * 420];
  const poseA = blendPose(POSES.hold, POSES.open, clamp((f - rel) / 3));
  const sA = 1.2, rotA = 24;
  const brickLocal: [number, number] = [-196, 26];
  const orgA = originFor(handA, sA, rotA, false, GRIP);
  const rr = (rotA * Math.PI) / 180;
  const brickAtHand: [number, number] = [handA[0] + (brickLocal[0] - GRIP[0]) * sA * Math.cos(rr) - (brickLocal[1] - GRIP[1]) * sA * Math.sin(rr), handA[1] + (brickLocal[0] - GRIP[0]) * sA * Math.sin(rr) + (brickLocal[1] - GRIP[1]) * sA * Math.cos(rr)];
  const fall = clamp((f - rel) / 6);
  const brickH = f < rel ? 40 : 40 + 160 * (1 - fall * fall) * (fall < 1 ? 1 : 0) - 0;
  const bx = f < rel ? brickAtHand[0] : lerp(brickAtHand[0], BOWL.x + 10, fall * fall);
  const by = f < rel ? brickAtHand[1] : lerp(brickAtHand[1], BOWL.y + 10, fall * fall);
  const landed = rel + 6;
  const sink = clamp((f - landed) / 7);
  const brickOn = f < landed + 8;
  const hBrick = f < rel ? 90 : fall < 1 ? 90 * (1 - fall * fall) : 0;
  void brickH;
  /* bowl response */
  const bloom = f < landed ? 0 : Math.max(0, 1 - Math.exp(-(f - landed) / 5) * Math.cos((f - landed) * 0.5));
  const ripple = f < landed ? 0 : clamp((f - landed) / 16);
  const bump = (st: number, a: number) => dampCos(f - st, a, 6, 0.9);
  const bscale = 1 + bump(landed, 0.05) + bump(37, 0.02) + bump(44, 0.025);
  const jig = f >= landed ? Math.exp(-(f - landed) / 14) : 0;
  /* egg (left hand, mirrored) */
  const eg0 = 20, egRel = 32;
  const eTip: [number, number] = f < eg0 ? [-160, 1010] : f < 29 ? [lerp(-160, 296, easeInOutCubic((f - eg0) / 9)), lerp(1010, 830, easeInOutCubic((f - eg0) / 9))] : [296, 830];
  const eRet = easeInOutCubic((f - 34) / 10);
  const eHand: [number, number] = f < egRel ? eTip : [296 - eRet * 500, 830 + eRet * 180];
  const sE = 1.15;
  const orgE = originFor(eHand, sE, 0, true);
  const poseE = blendPose(POSES.pinch, POSES.open, clamp((f - egRel) / 3));
  const eggAt: [number, number] = f < egRel ? [eHand[0] + 78, eHand[1] - 6] : [378, 870];
  const eggFallK = clamp((f - egRel) / 5);
  const eggPos: [number, number] = f < egRel ? eggAt : [lerp(eggAt[0], 345, eggFallK), lerp(eggAt[1], 860, eggFallK)];
  const eggH = f < egRel ? 70 : 70 * (1 - eggFallK * eggFallK);
  const eggRock = f > egRel + 5 ? dampSin(f - egRel - 5, 7, 7, 0.6) : 0;
  const drop = (st: number, h0: number) => (f < st ? null : Math.max(0, h0 * (1 - Math.pow(clamp((f - st) / 7), 2))));
  const hChoy = drop(36, 420), hChili = drop(42, 420), hB1 = drop(46, 420), hB2 = drop(49, 420);
  const settleRock = (st: number, a: number) => (f > st + 7 ? dampSin(f - st - 7, a, 7, 0.65) : 0);
  const sc = (h: number | null, lo = 0.0) => (h === null ? 0 : 1 + lo);
  void sc;
  /* shake on impact */
  const shk = f >= landed ? 7 * Math.exp(-(f - landed) / 5) : 0;
  return (
    <Whip dur={V3.B} inn out>
      <CameraRig keys={cameraShots.topDown(V3.B, 540 + Math.sin(f * 2.2) * shk * 0.5, 960 + Math.cos(f * 1.9) * shk * 0.5)}>
        <InkWorld id="ink-b" amount={4}>
          <TopDownTable />
          <Place x={860} y={1340} style={{transform: 'translate(-50%,-50%) rotate(10deg)'}}><Notebook size={250} /></Place>
          <Place x={480} y={1440} style={{transform: 'translate(-50%,-50%) rotate(-14deg)'}}><Chopsticks size={430} /></Place>
          <World>
            <TopBowl cx={BOWL.x} cy={BOWL.y} R={BOWL.R} bloom={bloom} ripple={ripple} jig={jig} sx={bscale} sy={bscale} />
            {f >= 36 && hChoy !== null && <TopChoy x={470 + (hash(1) - 0.5) * 8} y={820} h={hChoy} rot={-18 + settleRock(36, 5)} s={0.95} />}
            {f >= egRel && <TopEgg x={eggPos[0]} y={eggPos[1]} h={eggH} rot={-12 + eggRock} s={0.92} />}
            {f >= 42 && hChili !== null && <TopChili x={405} y={985} h={hChili} rot={14 + settleRock(42, 6)} s={1} />}
            {f >= 46 && hB1 !== null && <TopBall x={498} y={935} h={hB1} s={0.95} />}
            {f >= 49 && hB2 !== null && <TopBall x={318} y={966} h={hB2} s={0.9} />}
            {brickOn && <g opacity={f >= landed ? 1 - sink : 1}><TopBrick x={bx} y={by} h={hBrick} rot={rotA - 20 + fall * -4} s={0.82 * (f >= landed ? 1 - sink * 0.4 : 1)} /></g>}
            {f < egRel + 3 && <TopEgg x={eggAt[0]} y={eggAt[1]} h={70} rot={-12} s={0.92} />}
            <Hand2 x={orgA[0]} y={orgA[1]} s={sA} rot={rotA} pose={poseA} opacity={f < 28 ? 1 : 1 - clamp((f - 28) / 4)} />
            {f >= eg0 && f < 45 && <Hand2 x={orgE[0]} y={orgE[1]} s={sE} mirror pose={poseE} opacity={f < 40 ? 1 : 1 - clamp((f - 40) / 4)} />}
          </World>
          <Flecks x={BOWL.x} y={BOWL.y} start={landed} count={14} colors={['#EEC25F', '#F8DA84', '#FFF2BF']} />
        </InkWorld>
      </CameraRig>
      <CategoryLabel no="02." text="SIAPKAN PORSI" delay={2} x={90} y={250} />
      <BlackLabel text="Hitung modal per mangkuk" delay={6} size={46} y={400} rot={1.5} />
      <InfoPanel x={715} y={560} w={325} title="BAHAN" rows={[['Mi', 3500], ['Telur', 2000], ['Bumbu', 1500]]} total={7000} totalLabel="HPP" delay={8} rot={3} />
    </Whip>
  );
};

/* ================= SHOT C — close-up, hand slides the finished bowl into frame ================= */
const BW = 640;
const ShotC: React.FC = () => {
  const f = useCurrentFrame();
  const x0 = -230, x1 = 640;
  const mv = act(f, 0, 3, 12, -0.08, 1.15);
  const bx = lerp(x0, x1, mv) + (f > 14 ? dampSin(f - 14, 8, 8, 0.6) : 0);
  const vel = (act(f, 0, 3, 12, -0.08, 1.15) - act(f - 1, 0, 3, 12, -0.08, 1.15)) * (x1 - x0);
  const lean = Math.max(-7, Math.min(7, vel * -0.18)) + (f > 14 ? dampSin(f - 14, 3, 7, 0.7) : 0);
  const stopSq = f >= 14 ? 0.05 * Math.exp(-(f - 14) / 5) * Math.cos((f - 14) * 0.9) : 0;
  const sqz = squashScale(stopSq);
  const cy = 1004;
  const rimL: [number, number] = [bx - 267 * (BW / 600), cy - 62];
  const gripTip: [number, number] = [rimL[0] + 22, rimL[1] + 6];
  const retr = easeInOutCubic((f - 15) / 10);
  const handTipPos: [number, number] = [gripTip[0] - retr * 420, gripTip[1] + retr * 70];
  const pose = blendPose(POSES.grip, POSES.open, clamp((f - 13) / 4));
  const org = originFor(handTipPos, 1.2, 0, true, GRIP);
  const k = BW / 900;
  const jig = (ph: number, a = 5) => (f > 14 ? dampSin(f - 14 - ph, a, 8, 0.7) : 0);
  const tops: {x: number; y: number; w: number; node: React.ReactNode; ph: number}[] = [
    {x: -105, y: -133, w: 178, node: <EggHalf size={178} />, ph: 0},
    {x: 115, y: -169, w: 213, node: <BokChoy size={213} />, ph: 2},
    {x: 6, y: -134, w: 178, node: <ChiliPepper size={178} />, ph: 1},
    {x: -51, y: -92, w: 84, node: <Meatball size={84} />, ph: 3},
    {x: 71, y: -88, w: 80, node: <Meatball size={80} />, ph: 4},
  ];
  void k;
  const steamK = clamp((f - 8) / 16);
  return (
    <Whip dur={V3.C} inn>
      <CameraRig keys={cameraShots.frame('medium', 560, 1010, V3.C, 0.1, 40, -26)}>
        <InkWorld id="ink-c" amount={4}>
          <KitchenEnv blur={7} t={f + 100} />
          <Place x={bx} y={cy} style={{transform: `translate(-50%,-50%) rotate(${lean}deg) scale(${sqz.sx},${sqz.sy})`, transformOrigin: '50% 94%'}}>
            <div style={{position: 'relative'}}>
              <Bowl2 size={BW} fill={0.82} wave={0.12 + (f > 14 ? 0.5 * Math.exp(-(f - 14) / 8) : 0)} bloom={1} jig={f > 14 ? Math.exp(-(f - 14) / 10) : 0} gloss={0.45} />
              {tops.map((t, i) => (
                <div key={i} style={{position: 'absolute', left: BW / 2 + t.x, top: (BW * 480) / 600 / 2 + t.y - jig(t.ph, 4) * 0.6, transform: `translate(-50%,-50%) rotate(${jig(t.ph, 3)}deg)`}}>{t.node}</div>
              ))}
            </div>
          </Place>
          <World><Hand2 x={org[0]} y={org[1]} s={1.2} mirror pose={pose} opacity={f > 25 ? 1 - clamp((f - 25) / 4) : 1}>{null}</Hand2></World>
          {steamK > 0.02 && <Place x={bx} y={cy - 300}><ProcSteam size={600} intensity={steamK} /></Place>}
        </InkWorld>
      </CameraRig>
      <SwingTag2 text="Rp 12.000" start={8} hx={250} hy={430} width={520} />
      <BlackLabel text="Dijual semangkuk" delay={3} size={56} y={300} rot={-2} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        <ArrowDraw d="M610,660 C700,700 760,740 790,810" head="M742,790 L794,816 L796,758" delay={22} />
      </svg>
      <Subtitle text="Modal Rp 7.000 → untung Rp 5.000" delay={26} y={1430} />
      {[[880, 560, 28, 56], [160, 900, 31, 46], [900, 1200, 33, 50]].map(([x, y, d, s], i) => f >= d && <Place key={i} x={x} y={y} style={{transform: `translate(-50%,-50%) scale(${Math.min(1, (f - d) / 6)}) rotate(${f * 4}deg)`}}><Sparkle size={s} /></Place>)}
    </Whip>
  );
};

export const DemoV3: React.FC = () => (
  <AbsoluteFill style={{background: '#F5EBD3'}}>
    <Sequence from={0} durationInFrames={V3.A}><ShotA /></Sequence>
    <Sequence from={V3.A} durationInFrames={V3.B}><ShotB /></Sequence>
    <Sequence from={V3.A + V3.B} durationInFrames={V3.C}><ShotC /></Sequence>
    <GradeV3 />
  </AbsoluteFill>
);
