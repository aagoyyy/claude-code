import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PaperBackground} from '../backgrounds/PaperBackground';
import {CameraRig} from '../camera/CameraMovement';
import {Place} from '../camera/SceneFraming';
import {Egg, Greens, Chili} from '../illustrations/Food/Ingredients';
import {Sparkle} from '../illustrations/Infographics/Infographics';
import {DynBowl} from './DynBowl';
import {DynPacket} from './DynPacket';
import {DynBrick} from './DynBrick';
import {ProcSteam} from './ProcSteam';
import {Splash} from './Splash';
import {WoodTable} from './WoodTable';
import {SwingTag} from './SwingTag';
import {dropBounce, squashScale} from './physics';
import {clamp, easeOutBack, easeOutCubic, easeInOutCubic, lerp} from './math';

/** Timeline (30 fps, 150 frames = 5 s) */
export const T = {packetIn: 4, shake: 18, tear: 28, tilt: 36, brick: 44, exitP: 54, hit: 63, egg: 80, greens: 86, chili: 92, tag: 112};

const BOWL = {x: 540, y: 1130, size: 900};
const SURFACE_Y = 1045;

const damp = (ts: number, amp: number, k: number, w: number) => (ts < 0 ? 0 : amp * Math.exp(-ts / k) * Math.cos(ts * w));

export const DynamicPrototype: React.FC = () => {
  const f = useCurrentFrame();

  /* ---- bowl ---- */
  const bowlIn = easeOutBack((f - 0) / 14, 1.2);
  const landEvents = [T.hit, T.egg + 18, T.greens + 18, T.chili + 18];
  const sqAmps = [0.1, 0.035, 0.035, 0.025];
  let bs = 0;
  landEvents.forEach((e, i) => { bs += damp(f - e, sqAmps[i], 6, 0.85); });
  const bowlSq = squashScale(bs);
  const wave = 0.12 + 1.0 * Math.exp(-Math.max(0, f - T.hit) / 15) * (f >= T.hit ? 1 : 0) + (f >= T.egg + 18 ? 0.3 * Math.exp(-(f - T.egg - 18) / 10) : 0) + (f >= T.greens + 18 ? 0.3 * Math.exp(-(f - T.greens - 18) / 10) : 0);
  const noodle = easeOutCubic((f - (T.hit + 2)) / 22);
  const fill = 0.6 + 0.2 * easeOutCubic((f - T.hit) / 18);

  /* ---- packet ---- */
  const pIn = easeOutBack((f - T.packetIn) / 14, 1.1);
  const pY = lerp(-420, 560, pIn);
  const stretch = f < T.packetIn + 14 ? 0.18 * (1 - clamp((f - T.packetIn) / 14)) : 0;
  const landSq = damp(f - (T.packetIn + 12), 0.15, 5, 0.9);
  const pShakeEnv = f >= T.shake && f < T.tilt ? Math.min(1, (f - T.shake) / 3) * Math.min(1, (T.tilt - f) / 3) : 0;
  const pShake = Math.sin(f * 2.6) * 6 * pShakeEnv;
  const open = easeOutCubic((f - T.tear) / 10);
  const tilt = easeInOutCubic((f - T.tilt) / 16) * 168;
  const exitK = easeInOutCubic((f - T.exitP) / 12);
  const pSq = squashScale(landSq);
  const packetVisible = f >= T.packetIn && f < T.exitP + 14;

  /* ---- brick ---- */
  const bt = f - T.brick;
  const brickY = 650 + 3 * bt + 0.95 * bt * bt;
  const brickVy = 3 + 1.9 * bt;
  const brickHitU = clamp((f - T.hit) / 7);
  const brickVisible = f >= T.brick && f < T.hit + 7;
  const brickRot = -8 + bt * 1.15;

  /* ---- toppings ---- */
  const top = (start: number, h: number, g: number) => dropBounce(f, start, h, g, 0.3);
  const egg = top(T.egg, 400, 2.4), greens = top(T.greens, 400, 2.4), chili = top(T.chili, 400, 2.4);

  /* ---- camera + impact shake ---- */
  const ts = f - T.hit;
  const shakeAmp = ts >= 0 ? 10 * Math.exp(-ts / 7) : 0;
  const shx = Math.sin(ts * 2.1) * shakeAmp, shy = Math.cos(ts * 1.7) * shakeAmp * 0.8, shr = Math.sin(ts * 1.4) * shakeAmp * 0.06;

  const steamK = Math.max(0.22 * clamp((f - 8) / 20), clamp((f - (T.hit + 8)) / 26));
  const sparkles: [number, number, number, number][] = [[210, 760, 0, 70], [880, 790, 6, 56], [820, 1170, 12, 62], [250, 1200, 18, 50], [840, 560, 8, 48]];

  return (
    <AbsoluteFill style={{transform: `translate(${shx}px, ${shy}px) rotate(${shr}deg) scale(1.03)`}}>
      <CameraRig keys={[{frame: 0, scale: 1, x: 540, y: 960}, {frame: 150, scale: 1.08, x: 540, y: 1030}]}>
        <PaperBackground tone="cream" />
        <WoodTable top={1180} />
        {/* bowl */}
        <Place x={BOWL.x} y={BOWL.y + (1 - bowlIn) * -40} style={{transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * bowlIn})`, transformOrigin: '50% 90%', opacity: Math.min(1, bowlIn * 3)}}>
          <DynBowl size={BOWL.size} fill={fill} wave={wave} noodle={noodle} sx={bowlSq.sx} sy={bowlSq.sy} />
        </Place>
        {/* steam */}
        {steamK > 0 && (
          <Place x={540} y={762}>
            <ProcSteam size={680} intensity={steamK} />
          </Place>
        )}
        {/* brick (behind packet until it leaves the opening) */}
        {brickVisible && (
          <Place x={540 + Math.sin(bt * 0.2) * 4} y={Math.min(brickY, SURFACE_Y + 10)} style={{transform: `translate(-50%, -50%) rotate(${brickRot}deg) scale(${1 + clamp(brickVy / 90) * 0.04}, ${f >= T.hit ? lerp(1, 0.3, brickHitU) : 1 + clamp(brickVy / 45) * 0.12})`, opacity: f >= T.hit ? 1 - brickHitU : 1}}>
            <DynBrick size={380} wet={clamp((f - T.hit) / 8)} />
          </Place>
        )}
        {/* packet */}
        {packetVisible && (
          <Place x={540 + exitK * 760} y={pY - exitK * 520} style={{transform: `translate(-50%, -50%) rotate(${pShake + tilt + exitK * 80}deg) scale(${(1 - exitK * 0.3) * pSq.sx}, ${(1 - exitK * 0.3) * (pSq.sy + stretch)})`}}>
            <DynPacket size={500} open={open} />
          </Place>
        )}
        {/* soft glow behind the bowl */}
        {/* toppings' shadows on the noodles */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          {[[egg, 392, 1022, 80, 78], [greens, 702, 1000, 86, 90], [chili, 548, 985, 92, 64]].map(([d, x, y, st, rx], i) => {
            const dd = d as ReturnType<typeof dropBounce>;
            if (f < (st as number)) return null;
            const k = 1 - clamp(dd.y / 420);
            return <ellipse key={i} cx={x as number} cy={(y as number) - 4} rx={(rx as number) * (0.55 + 0.45 * k)} ry={14 * (0.55 + 0.45 * k)} fill="rgba(60,30,10,0.35)" opacity={0.25 + 0.5 * k} />;
          })}
        </svg>
        {/* toppings */}
        {f >= T.egg && <Place x={392} y={1022 - 132 - egg.y} style={{transform: `translate(-50%, -50%) scale(${squashScale(egg.squash).sx}, ${squashScale(egg.squash).sy})`, transformOrigin: '50% 95%'}}><Egg size={250} cut /></Place>}
        {f >= T.greens && <Place x={702} y={1000 - 128 - greens.y} style={{transform: `translate(-50%, -50%) rotate(${greens.y * 0.12}deg) scale(${squashScale(greens.squash).sx}, ${squashScale(greens.squash).sy})`, transformOrigin: '50% 95%'}}><Greens size={300} /></Place>}
        {f >= T.chili && <Place x={548} y={985 - 62 - chili.y} style={{transform: `translate(-50%, -50%) rotate(${-8 + chili.y * 0.1}deg) scale(${squashScale(chili.squash).sx}, ${squashScale(chili.squash).sy})`, transformOrigin: '50% 95%'}}><Chili size={230} /></Place>}
        {/* splash + ripple */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          <Splash x={540} y={SURFACE_Y} start={T.hit} />
        </svg>
        {/* sparkles */}
        {sparkles.map(([x, y, d, s], i) => {
          const k = f - (T.tag + 8 + d);
          if (k < 0) return null;
          const pop = easeOutBack(k / 10, 2);
          return (
            <Place key={i} x={x} y={y} style={{transform: `translate(-50%,-50%) scale(${pop * (0.85 + 0.15 * Math.sin(f * 0.35 + i))}) rotate(${f * 3 + i * 30}deg)`}}>
              <Sparkle size={s} />
            </Place>
          );
        })}
        {/* price tag */}
        <SwingTag text="Rp 12.000" start={T.tag} hx={300} hy={300} />
      </CameraRig>
    </AbsoluteFill>
  );
};
