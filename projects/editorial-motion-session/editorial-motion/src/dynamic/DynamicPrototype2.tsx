import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraRig, resolveCamera, CameraKey} from '../camera/CameraMovement';
import {Place} from '../camera/SceneFraming';
import {Sparkle} from '../illustrations/Infographics/Infographics';
import {Bowl2} from './v2/Bowl';
import {Packet2} from './v2/Packet';
import {Brick2} from './v2/Brick';
import {EggHalf, BokChoy, ChiliPepper, Meatball, ScallionRing} from './v2/Toppings';
import {Stage2} from './v2/Table';
import {MotionBlur, ImpactBurst, Flecks, Droplets, Grade} from './v2/Fx';
import {SwingTag2} from './v2/SwingTag2';
import {ProcSteam} from './ProcSteam';
import {dropBounce, squashScale} from './physics';
import {clamp, easeOutBack, easeOutCubic, easeInOutCubic, lerp, hash} from './math';

/** Timeline @30fps, 150 frames */
export const T2 = {packetIn: 6, coil: 24, tear: 28, windup: 34, swing: 40, brick: 47, exitP: 54, hit: 65, egg: 80, choy: 86, chili: 92, ball1: 96, ball2: 101, scallion: 99, tag: 110};

const BOWL = {x: 540, y: 1130, size: 900};
const SURFACE_Y = 1045;
const GROUND = 1470;

const damp = (ts: number, amp: number, k: number, w: number) => (ts < 0 ? 0 : amp * Math.exp(-ts / k) * Math.cos(ts * w));
const dampSin = (ts: number, amp: number, k: number, w: number) => (ts < 0 ? 0 : amp * Math.exp(-ts / k) * Math.sin(ts * w));

const CAM: CameraKey[] = [
  {frame: 0, scale: 1.0, x: 540, y: 1000},
  {frame: 40, scale: 1.03, x: 540, y: 1010},
  {frame: 61, scale: 0.985, x: 540, y: 1000},
  {frame: 66, scale: 1.04, x: 540, y: 1030},
  {frame: 100, scale: 1.07, x: 540, y: 1040},
  {frame: 150, scale: 1.1, x: 540, y: 1070},
];

type Topping = {st: number; x: number; landY: number; off: number; rock: number};

export const DynamicPrototype2: React.FC = () => {
  const f = useCurrentFrame();

  /* ---------- bowl ---------- */
  const bIn = easeOutBack(f / 12, 2.0);
  const bowlPop = 0.72 + 0.28 * bIn;
  const landFrames = [T2.hit, T2.egg + 17, T2.choy + 17, T2.chili + 17];
  const landAmps = [0.17, 0.045, 0.05, 0.03];
  let bs = damp(f - 10, 0.1, 5, 0.9);
  landFrames.forEach((e, i) => { bs += damp(f - e, landAmps[i], 6, 0.8); });
  const bq = squashScale(bs);
  const tb = f - (T2.hit + 2);
  const bloom = tb < 0 ? 0 : Math.max(0, 1 - Math.exp(-tb / 5) * Math.cos(tb * 0.5));
  const jig = f >= T2.hit ? Math.exp(-(f - T2.hit) / 14) : 0;
  const bump = (st: number) => (f >= st + 17 ? 0.35 * Math.exp(-(f - st - 17) / 10) : 0);
  const wave = 0.1 + (f >= T2.hit ? 1.3 * Math.exp(-(f - T2.hit) / 16) : 0) + bump(T2.egg) + bump(T2.choy) + bump(T2.chili);
  const fill = 0.62 + 0.2 * easeOutCubic((f - T2.hit) / 20);

  /* ---------- packet ---------- */
  const pFall = clamp((f - T2.packetIn) / 10);
  const arrive = T2.packetIn + 10;
  const ts = f - arrive;
  let pY = lerp(-380, 540, pFall * pFall);
  if (f >= arrive) pY = 540 + dampSin(ts, 46, 5, 0.85) + (f > 20 ? Math.sin(f * 0.12) * 4 : 0);
  const fallStretch = f < arrive ? 0.24 * Math.sin(Math.PI * pFall) : 0;
  const landSq = damp(ts, 0.2, 5, 0.9);
  const coilK = f >= T2.coil && f < T2.tear ? easeOutCubic((f - T2.coil) / 4) : 0;
  const pop = f >= T2.tear ? 1 + 0.16 * Math.exp(-(f - T2.tear) / 3.5) : 1 - coilK * 0.12;
  const shake = f >= 20 && f < T2.tear ? Math.sin(f * 3.1) * 4.5 * clamp((f - 20) / 4) : 0;
  const wob = dampSin(ts, 9, 7, 0.55);
  const open = easeOutCubic((f - T2.tear) / 8);
  const windK = easeOutCubic((f - T2.windup) / 6);
  const swingK = f >= T2.swing ? Math.min(1.08, easeOutBack((f - T2.swing) / 10, 1.5)) : 0;
  const pRot = f < T2.windup ? shake + wob : f < T2.swing ? shake - 14 * windK : lerp(-14, 168, swingK);
  const ex = easeInOutCubic((f - T2.exitP) / 12);
  const pSq = squashScale(landSq);
  const pVisible = f >= T2.packetIn && f < T2.exitP + 14;
  const pBlurY = f < arrive ? 18 * Math.sin(Math.PI * pFall) : 0;
  const pBlurX = f >= T2.exitP && f < T2.exitP + 14 ? 30 * Math.sin(Math.PI * clamp((f - T2.exitP) / 12)) : 0;

  /* ---------- brick ---------- */
  const bt = f - T2.brick;
  const bY = 650 + 4 * bt + bt * bt;
  const bVy = 4 + 2 * bt;
  const bHit = clamp((f - T2.hit) / 7);
  const brickOn = f >= T2.brick && f < T2.hit + 7;
  const bRot = -6 + bt * 2.4 + 9 * Math.sin(bt * 0.3);

  /* ---------- toppings ---------- */
  const mk = (st: number, h: number, g: number, e = 0.3) => dropBounce(f, st, h, g, e);
  const egg = mk(T2.egg, 430, 2.5), choy = mk(T2.choy, 430, 2.5), chili = mk(T2.chili, 430, 2.5), b1 = mk(T2.ball1, 430, 2.5), b2 = mk(T2.ball2, 430, 2.5);
  const sink = (d: ReturnType<typeof dropBounce>, amt = 9) => (d.landed ? amt * (1 - Math.exp(-d.sinceImpact / 4)) : 0);
  const rock = (d: ReturnType<typeof dropBounce>, a = 7) => (d.sinceImpact < 90 ? dampSin(d.sinceImpact, a, 8, 0.55) : 0);
  const fallScale = (d: ReturnType<typeof dropBounce>, st: number) => (f - st < 10 ? 0.55 + 0.45 * easeOutBack((f - st) / 10, 1.4) : 1);
  const fallSpin = (d: ReturnType<typeof dropBounce>) => (d.landed ? 0 : d.y * 0.1);
  const tops: {k: string; d: ReturnType<typeof dropBounce>; x: number; landY: number; cOff: number; size: number; node: React.ReactNode; st: number; sh: number}[] = [
    {k: 'egg', d: egg, x: 392, landY: 1034, cOff: 91, size: 250, st: T2.egg, sh: 80, node: <EggHalf size={250} />},
    {k: 'choy', d: choy, x: 704, landY: 1020, cOff: 127, size: 300, st: T2.choy, sh: 92, node: <BokChoy size={300} />},
    {k: 'chili', d: chili, x: 548, landY: 996, cOff: 43, size: 250, st: T2.chili, sh: 66, node: <ChiliPepper size={250} />},
    {k: 'b1', d: b1, x: 468, landY: 1052, cOff: 52, size: 118, st: T2.ball1, sh: 40, node: <Meatball size={118} />},
    {k: 'b2', d: b2, x: 640, landY: 1058, cOff: 52, size: 112, st: T2.ball2, sh: 38, node: <Meatball size={112} />},
  ];

  /* ---------- camera / grade ---------- */
  const cam = resolveCamera(CAM, f);
  const tt = f - T2.hit;
  const shakeA = tt >= 0 ? 12 * Math.exp(-tt / 7) : 0;
  const shx = Math.sin(tt * 2.2) * shakeA, shy = Math.cos(tt * 1.8) * shakeA * 0.8, shr = Math.sin(tt * 1.5) * shakeA * 0.07;
  const punch = tt >= 0 ? 1 + 0.06 * Math.exp(-tt / 5) : 1;
  const flash = tt >= 0 && tt < 5 ? 0.55 * (1 - tt / 5) : 0;
  const par = {x: (cam.x - 540) * 0.1, y: (cam.y - 1000) * 0.1};
  const dof = 1.1 + (cam.scale - 1) * 16;

  const steamK = Math.min(1.15, Math.max(0.2 * clamp((f - 10) / 20), clamp((f - (T2.hit + 8)) / 26)) + (f >= T2.hit ? 0.55 * Math.exp(-(f - T2.hit) / 14) : 0));
  const sparkles: [number, number, number, number][] = [[210, 760, 0, 70], [880, 790, 6, 56], [830, 1180, 12, 62], [250, 1220, 18, 50], [860, 540, 8, 46]];

  return (
    <AbsoluteFill style={{transform: `translate(${shx}px, ${shy}px) rotate(${shr}deg) scale(${1.03 * punch})`, filter: 'saturate(1.2) contrast(1.07)'}}>
      <CameraRig keys={CAM}>
        <div style={{position: 'absolute', inset: 0, transform: `translate(${par.x}px, ${par.y}px) scale(1.04)`}}>
          <Stage2 tableTop={1180} blur={dof} />
        </div>

        <ImpactBurst x={540} y={990} start={T2.hit} size={820} />
        <Place x={BOWL.x} y={BOWL.y + (1 - bIn) * -50} style={{transform: `translate(-50%, -50%) scale(${bowlPop})`, transformOrigin: '50% 90%', opacity: Math.min(1, bIn * 3)}}>
          <Bowl2 size={BOWL.size} fill={fill} wave={wave} bloom={bloom} jig={jig} sx={bq.sx} sy={bq.sy} />
        </Place>

        {steamK > 0.01 && <Place x={540} y={762}><ProcSteam size={680} intensity={steamK} /></Place>}

        {brickOn && (
          <Place x={540 + Math.sin(bt * 0.25) * 6} y={Math.min(bY, SURFACE_Y + 10)} style={{transform: `translate(-50%, -50%) rotate(${bRot}deg) scale(${1 + clamp(bVy / 90) * 0.05}, ${f >= T2.hit ? lerp(1, 0.3, bHit) : 1 + clamp(bVy / 50) * 0.2})`, opacity: f >= T2.hit ? 1 - bHit : 1}}>
            <MotionBlur id="brickblur" bx={0} by={f >= T2.hit ? 0 : clamp((bVy - 10) / 14) * 9}>
              <Brick2 size={380} wet={clamp((f - T2.hit) / 8)} />
            </MotionBlur>
          </Place>
        )}

        {pVisible && (
          <Place x={540 + ex * 860} y={pY - ex * 560} style={{transform: `translate(-50%, -50%) rotate(${pRot + ex * 110}deg) scale(${(1 - ex * 0.35) * pSq.sx * pop}, ${(1 - ex * 0.35) * (pSq.sy + fallStretch) * pop})`}}>
            <MotionBlur id="pkblur" bx={pBlurX} by={pBlurY}>
              <Packet2 size={500} open={open} />
            </MotionBlur>
          </Place>
        )}

        {/* topping shadows */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          {tops.map((t) => {
            if (f < t.st) return null;
            const k = 1 - clamp(t.d.y / 420);
            return <ellipse key={t.k} cx={t.x} cy={t.landY - 2} rx={t.sh * (0.5 + 0.5 * k)} ry={12 * (0.5 + 0.5 * k)} fill="rgba(60,30,10,0.4)" opacity={0.2 + 0.55 * k} />;
          })}
        </svg>
        {tops.map((t) => {
          if (f < t.st) return null;
          const sq = squashScale(t.d.squash);
          const sc = fallScale(t.d, t.st);
          return (
            <Place key={t.k} x={t.x} y={t.landY - t.cOff - t.d.y + sink(t.d)} style={{transform: `translate(-50%, -50%) rotate(${fallSpin(t.d) + rock(t.d)}deg) scale(${sq.sx * sc}, ${sq.sy * sc})`, transformOrigin: '50% 92%'}}>
              {t.node}
            </Place>
          );
        })}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const st = T2.scallion + i * 2;
          const d = mk(st, 340 + hash(i) * 120, 2.6, 0.2);
          if (f < st) return null;
          const x = 430 + hash(i + 4) * 230, y = 1030 + hash(i + 8) * 22;
          return <Place key={i} x={x} y={y - d.y + sink(d, 4)} style={{transform: `translate(-50%, -50%) rotate(${i * 40 + d.y * 0.3}deg)`}}><ScallionRing size={46 + hash(i) * 14} /></Place>;
        })}

        <Flecks x={540} y={470} start={T2.tear} />
        <Droplets x={540} y={SURFACE_Y} ground={GROUND} start={T2.hit} />

        {sparkles.map(([x, y, d, s], i) => {
          const k = f - (T2.tag + 10 + d);
          if (k < 0) return null;
          const p = easeOutBack(k / 10, 2);
          return (
            <Place key={i} x={x} y={y} style={{transform: `translate(-50%,-50%) scale(${p * (0.85 + 0.15 * Math.sin(f * 0.35 + i))}) rotate(${f * 3 + i * 30}deg)`}}>
              <Sparkle size={s} />
            </Place>
          );
        })}
        <SwingTag2 text="Rp 12.000" start={T2.tag} hx={300} hy={300} />
      </CameraRig>
      <Grade />
      {flash > 0 && <AbsoluteFill style={{background: '#FFF8E6', opacity: flash}} />}
    </AbsoluteFill>
  );
};
