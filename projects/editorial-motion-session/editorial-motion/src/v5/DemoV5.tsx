import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {CameraRig, resolveCamera, CameraKey, cameraShots} from '../camera/CameraMovement';
import {Place} from '../camera/SceneFraming';
import {Packet2} from '../dynamic/v2/Packet';
import {Bowl2} from '../dynamic/v2/Bowl';
import {Droplets} from '../dynamic/v2/Fx';
import {SwingTag2} from '../dynamic/v2/SwingTag2';
import {ProcSteam} from '../dynamic/ProcSteam';
import {Warung} from '../illustrations/Business/Warung';
import {Notebook, Chopsticks} from '../illustrations';
import {squashScale} from '../dynamic/physics';
import {clamp, easeInOutCubic, easeOutCubic, lerp} from '../dynamic/math';
import {Hand2, POSES, blendPose, handTip, PINCH_TIP} from '../v3/Hand2';
import {KitchenEnv, TopDownTable} from '../v3/Environments';
import {TopBowl, TopEgg, TopChoy, TopChili} from '../v3/TopDown';
import {BlackLabel} from '../v3/Graphics';
import {dampSin} from '../v3/motion';
import {InkLineWorld, PaperInk} from '../v4/Ink';
import {progress, wobble} from '../v4/profiles';
import {CostChart, Coin4, CoinColumn} from '../v4/Finance';
import {StreetEnv, RoundTable} from '../v4/WideScene';
import {ObjectTransition} from '../transitions/ObjectTransition';
import {SceneMeta} from '../compositions/CompositionEngine';

export const FPS5 = 24;
export const V5 = {s1: 54, s2From: 46, s2: 46, s3From: 92, s3: 28, total: 120} as const;
export const V5_SCENES: SceneMeta[] = [
  {name: 'S1 kitchen: hand carries + drops the packet into the bowl', kind: 'character-interaction'},
  {name: 'S2 top-down: toppings + financial chart', kind: 'top-down'},
  {name: 'S3 warung: closing payoff', kind: 'wide-environment'},
];

const rad = (d: number) => (d * Math.PI) / 180;
const rot2 = (v: [number, number], deg: number): [number, number] => { const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]; };
const originFor = (tip: [number, number], s: number, r: number, mirror: boolean): [number, number] => {
  const o = handTip(0, 0, s, r, mirror, PINCH_TIP);
  return [tip[0] - o[0], tip[1] - o[1]];
};
const World: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>{children}</svg>;

/* =====================  S1 PHYSICS (precomputed, deterministic)  =====================
 * reach -> contact (pinch) -> grip -> lift (anticipation dip) -> carry (accelerate/decelerate) -> release -> return.
 * The packet hangs from the pinch point as a damped pendulum driven by the hand's acceleration (so it lags, swings, settles).
 * After release it falls with gravity, its rotation follows its trajectory, it hits the broth, then sinks and leans on the rim.
 */
const PK = {x: 300, y: 1030, size: 470};
const PKk = PK.size / 400;
const HANG = 94 * PKk; // pinch (top edge, middle) -> packet centre
const BOWL = {x: 740, y: 1004, size: 640};
const SURF = 962;
const REL = 25;
const PINCH_AT: [number, number] = [PK.x, PK.y - HANG];

const tipAt = (f: number): [number, number] => {
  if (f < 7) { const u = 1 - Math.pow(1 - clamp(f / 7), 3); return [lerp(PINCH_AT[0] + 560, PINCH_AT[0], u), lerp(PINCH_AT[1] + 160, PINCH_AT[1], u)]; }
  if (f < 10) return [PINCH_AT[0], PINCH_AT[1] + 12 * Math.sin(Math.PI * clamp((f - 7) / 3))]; // anticipation: small dip before the lift
  if (f < 15) { const u = easeOutCubic((f - 10) / 5); return [lerp(PINCH_AT[0], 330, u), lerp(PINCH_AT[1], 760, u)]; }
  if (f < REL) { const u = easeInOutCubic((f - 15) / (REL - 15)); return [lerp(330, 712, u), lerp(760, 622, u) - 26 * Math.sin(Math.PI * u)]; }
  const u = easeInOutCubic((f - REL - 1) / 9);
  return [712 + 560 * u, 622 - 330 * u]; // return: up and out (follow-through)
};
type PS = {x: number; y: number; rot: number; phase: 'rest' | 'held' | 'fall' | 'sink'};
const SIM: PS[] = (() => {
  const out: PS[] = [];
  let phi = 0, w = 0, x = 0, y = 0, vx = 0, vy = 0, rot = 0, wr = 0, phase: PS['phase'] = 'rest';
  for (let f = 0; f < 80; f++) {
    const t0 = tipAt(f), t1 = tipAt(f - 1), t2 = tipAt(f - 2);
    const ax = t0[0] - 2 * t1[0] + t2[0];
    if (f < 10) { out.push({x: PK.x, y: PK.y, rot: 0, phase: 'rest'}); continue; }
    if (f <= REL) {
      // damped pendulum about the pinch point, driven by horizontal acceleration
      const acc = -0.16 * phi - 0.2 * w + 0.55 * ax * (f === 10 ? 0 : 1);
      w += acc; phi += w;
      const c = rot2([0, HANG], phi);
      x = t0[0] + c[0]; y = t0[1] + c[1]; rot = phi; phase = 'held';
      if (f === REL) { vx = (t0[0] - t1[0]) * 0.9; vy = (t0[1] - t1[1]) * 0.9; wr = Math.max(-3, Math.min(3, w)) * 0.5; }
      out.push({x, y, rot, phase});
      continue;
    }
    if (phase === 'held' || phase === 'fall') {
      phase = 'fall';
      vy += 3.3; vx *= 0.985;
      x += vx; y += vy;
      const target = Math.max(-18, Math.min(28, 8 + vx * 0.35)); // rotation follows the trajectory: lean into the motion, bounded
      wr += (target - rot) * 0.12; wr *= 0.78; rot += wr;
      if (y >= 790) phase = 'sink'; // bottom meets the broth
      out.push({x, y, rot, phase});
      continue;
    }
    // sink: broth drag, drift to the middle, lean against the rim, damped
    vy *= 0.8; vx += (BOWL.x + 8 - x) * 0.04; vx *= 0.8;
    x += vx; y += vy + (1004 - y) * 0.09;
    wr += -0.1 * (rot - 8) ; wr *= 0.8; rot += wr;
    out.push({x, y, rot, phase});
  }
  return out;
})();
const CF = SIM.findIndex((s) => s.phase === 'sink'); // contact frame
const CAM1: CameraKey[] = [
  {frame: 0, scale: 1.22, x: 442, y: 1020},
  {frame: 10, scale: 1.22, x: 470, y: 1000},
  {frame: REL, scale: 1.3, x: 640, y: 930},
  {frame: CF + 4, scale: 1.42, x: 720, y: 960},
  {frame: 42, scale: 1.5, x: 730, y: 965},
  {frame: 54, scale: 3.1, x: 740, y: 950},
];

const ShotS1: React.FC = () => {
  const f = useCurrentFrame();
  const ps = SIM[Math.min(f, SIM.length - 1)];
  const tip = tipAt(f);
  const rot1 = -8 - ps.rot * 0.25;
  const org = originFor(tip, 1.3, rot1, false);
  const pose = f < REL ? blendPose(POSES.open, POSES.pinch, clamp((f - 5) / 3)) : blendPose(POSES.pinch, POSES.open, clamp((f - REL) / 3));
  const lt = f - CF;
  const bSq = squashScale(wobble('food', f, CF, 0.13));
  const bTilt = dampSin(lt, 1.6, 6, 0.75);
  const wave = 0.1 + (lt >= 0 ? 1.5 * Math.exp(-lt / 9) : 0);
  const bloom = lt < 0 ? 0 : Math.max(0, 1 - Math.exp(-(lt - 2) / 5) * Math.cos((lt - 2) * 0.5)) * (lt >= 2 ? 1 : 0);
  const fill = 0.62 + 0.2 * easeOutCubic(lt / 12);
  const steam = Math.max(0.18, clamp(lt / 10)) * 0.9;
  const shake = lt >= 0 ? 6 * Math.exp(-lt / 4) : 0;
  const strip = {x: 0, y: 0, r: 0, o: 0};
  return (
    <AbsoluteFill style={{transform: `translate(${Math.sin(f * 2.3) * shake}px, ${Math.cos(f * 1.9) * shake * 0.8}px)`}}>
      <InkLineWorld id="ink5-s1">
        <CameraRig keys={CAM1}>
          <KitchenEnv t={f} lite />
          <Place x={BOWL.x} y={BOWL.y} style={{transform: `translate(-50%,-50%) rotate(${bTilt}deg) scale(${bSq.sx},${bSq.sy})`, transformOrigin: '50% 94%'}}>
            <Bowl2 size={BOWL.size} fill={fill} wave={wave} bloom={bloom} jig={lt >= 0 ? Math.exp(-lt / 10) : 0} gloss={0.45} />
          </Place>
          {steam > 0.02 && <Place x={BOWL.x} y={BOWL.y - 290}><ProcSteam size={600} intensity={steam} /></Place>}
          {/* the packet: hidden below the bowl's front rim once it dives in (occlusion) */}
          <div style={{position: 'absolute', inset: 0, clipPath: f >= 17 ? 'inset(0 0 945px 0)' : undefined}}>
            <Place x={ps.x} y={ps.y} style={{transform: `translate(-50%,-50%) rotate(${ps.rot}deg)`}}>
              <Packet2 size={PK.size} open={1} strip={strip} peek={false} />
            </Place>
          </div>
          <World>
            {f < 36 && <Hand2 x={org[0]} y={org[1]} s={1.3} rot={rot1} pose={pose} opacity={f < 31 ? 1 : 1 - clamp((f - 31) / 4)} uid="h1" />}
          </World>
          <Droplets x={BOWL.x} y={SURF} ground={1470} start={CF} count={12} />
        </CameraRig>
      </InkLineWorld>
      <BlackLabel text="Mi instan Rp 3.000" delay={2} size={70} y={310} />
    </AbsoluteFill>
  );
};

/* =====================  S2 top-down + financial chart  ===================== */
const TB = {x: 320, y: 860, R: 245};
const ShotS2: React.FC<{s2Start: number}> = ({s2Start}) => {
  const f = useCurrentFrame();
  const gf = f + s2Start;
  const cam = resolveCamera(CAM1, Math.min(gf, 54));
  const ic: [number, number] = [540 + (BOWL.x - cam.x) * cam.scale, 960 + (950 - cam.y) * cam.scale];
  const ir = interpolate(f, [0, 9], [70, 2600], {extrapolateRight: 'clamp', easing: (t) => t * t * (3 - 2 * t)});
  const k = interpolate(f, [0, 12], [2.4, 1], {extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3)});
  const tx = (1 - clamp(f / 12)) * (ic[0] - TB.x);
  const ty = (1 - clamp(f / 12)) * (ic[1] - TB.y);
  /* egg placed by a hand: reach -> pinch -> carry -> release -> return */
  const eg0 = 4, rel = 13;
  const eTip: [number, number] = f < rel ? [lerp(-160, 252, easeInOutCubic((f - eg0) / 8)), lerp(1000, 770, easeInOutCubic((f - eg0) / 8))] : [252, 770];
  const eRet = easeInOutCubic((f - 15) / 8);
  const eHand: [number, number] = f < rel + 1 ? eTip : [252 - eRet * 520, 770 + eRet * 200];
  const orgE = originFor(eHand, 1.15, 0, true);
  const poseE = blendPose(POSES.pinch, POSES.open, clamp((f - rel) / 3));
  const eggFall = clamp((f - rel) / 4);
  const eggPos: [number, number] = f < rel ? [eHand[0] + 78, eHand[1] - 6] : [lerp(eHand[0] + 78, 290, eggFall), lerp(eHand[1] - 6, 830, eggFall)];
  const eggH = f < rel ? 70 : 70 * (1 - eggFall * eggFall);
  const eggSoft = wobble('food', f, rel + 4, 6);
  const drop = (st: number, h0: number, dur = 5) => (f < st ? null : h0 * (1 - Math.pow(clamp((f - st) / dur), 2)));
  const hCh = drop(15, 420), hCl = drop(18, 420);
  const soft = (st: number, a = 5) => wobble('food', f, st + 5, a);
  const bump = 1 + wobble('food', f, 17, 0.04) + wobble('food', f, 20, 0.03);
  const camKeys = cameraShots.topDown(V5.s2, 540, 960, 0.8);
  return (
    <AbsoluteFill style={{clipPath: `circle(${ir}px at ${ic[0]}px ${ic[1]}px)`}}>
      <InkLineWorld id="ink5-s2">
        <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${k})`, transformOrigin: `${TB.x}px ${TB.y}px`}}>
          <CameraRig keys={camKeys}>
            <TopDownTable />
            <Place x={880} y={1420} style={{transform: 'translate(-50%,-50%) rotate(10deg)'}}><Notebook size={220} /></Place>
            <Place x={300} y={1420} style={{transform: 'translate(-50%,-50%) rotate(-14deg)'}}><Chopsticks size={400} /></Place>
            <World>
              <TopBowl cx={TB.x} cy={TB.y} R={TB.R} bloom={1} ripple={clamp((f - 2) / 14)} jig={Math.exp(-f / 10)} sx={bump} sy={bump} />
              {hCh !== null && <TopChoy x={376} y={790} h={hCh} rot={-18 + soft(15)} s={0.8} />}
              {f >= rel && <TopEgg x={eggPos[0]} y={eggPos[1]} h={eggH} rot={-12 + eggSoft} s={0.78 * (1 + eggSoft * 0.01)} />}
              {hCl !== null && <TopChili x={330} y={930} h={hCl} rot={14 + soft(18)} s={0.9} />}
              {f < rel + 3 && <TopEgg x={eggPos[0]} y={eggPos[1]} h={70} rot={-12} s={0.78} />}
              {f >= eg0 && f < 24 && <Hand2 x={orgE[0]} y={orgE[1]} s={1.15} mirror pose={poseE} opacity={f < 20 ? 1 : 1 - clamp((f - 20) / 3)} uid="h3" />}
            </World>
          </CameraRig>
        </AbsoluteFill>
      </InkLineWorld>
      <BlackLabel text="Modal vs harga jual" delay={9} size={66} y={330} rot={-1.5} />
      <CostChart x={560} y={470} w={430} cost={7000} price={12000} delay={11} rot={2} zoom={1.12} />
    </AbsoluteFill>
  );
};

/* =====================  S3 closing payoff (business environment)  ===================== */
const ShotS3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const keys: CameraKey[] = [{frame: 0, scale: 1.28, x: 660, y: 1120}, {frame: 18, scale: 1.0, x: 540, y: 960}, {frame: 28, scale: 1.0, x: 540, y: 960}];
  const coinPop = (st: number) => progress('coin', f, st, fps);
  const bowlIn = progress('food', f, 0, fps);
  return (
    <AbsoluteFill>
      <InkLineWorld id="ink5-s3">
        <CameraRig keys={keys}>
          <StreetEnv t={f} />
          <Place x={300} y={1018}><Warung size={780} sign="MIE" /></Place>
          <RoundTable x={800} y={1290} w={380} />
          <Place x={800} y={1138} style={{transform: `translate(-50%,-50%) scale(${0.92 + 0.08 * Math.min(1.1, bowlIn)})`, transformOrigin: '50% 90%'}}><Bowl2 size={400} fill={0.85} bloom={1} gloss={0.4} /></Place>
          {[[600, 1270, 4, 3], [1010, 1270, 7, 5]].map(([x, y, st, n], i) => (
            <Place key={i} x={x} y={y - 30} style={{transform: `translate(-50%,-50%) scale(${Math.min(1.12, coinPop(st))})`, transformOrigin: '50% 100%', opacity: coinPop(st) > 0.02 ? 1 : 0}}><CoinColumn n={n} size={140} hopTop={Math.max(0, wobble('coin', f, st + 4, 12))} /></Place>
          ))}
        </CameraRig>
      </InkLineWorld>
      <SwingTag2 text="Rp 12.000" start={1} hx={620} hy={500} width={440} kDelay={4} kInterval={1} />
      <BlackLabel text="Untung Rp 5.000 per mangkuk" delay={5} size={62} y={330} rot={-1.2} />
    </AbsoluteFill>
  );
};

export const DemoV5: React.FC = () => (
  <AbsoluteFill style={{background: '#F5EBD3'}}>
    <Sequence from={0} durationInFrames={V5.s1}><ShotS1 /></Sequence>
    <Sequence from={V5.s2From} durationInFrames={V5.s2}><ShotS2 s2Start={V5.s2From} /></Sequence>
    <Sequence from={V5.s3From} durationInFrames={V5.s3}><ShotS3 /></Sequence>
    <ObjectTransition at={V5.s3From} duration={10} objectWidth={520} panelColor="#E6B94F" y={980}><Coin4 size={520} /></ObjectTransition>
    <PaperInk />
  </AbsoluteFill>
);
