import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Acacia, Grass, Hills, Layer, Motes, Mountains, Plains, Rays, Rock, Sky} from '../world/Savanna';
import {Cam, camXY, clamp, easeOut, easeOutBack, ease, H, W} from '../world/util';
import {Character, place} from '../rig/Character';
import {attach, kf, Pose, reach} from '../rig/pose';
import {Post} from '../fx/Post';
import {Figure, FigureDefs} from '../rig/Figure';
import {aimPose, idlePose} from '../rig/Side';
import {boer, tommy} from './BoerA';
import {Actors, Tracer} from '../fx/Battle';

export const FPS = 24;
export const BOER_FRAMES = 144;
const HIT = 60; // frame of the gunshot

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const boerPoseRaw = (f: number): Pose => {
  const t = f / FPS, th = HIT / FPS;
  const b = Math.sin((t * Math.PI * 2) / 2.6);
  return {
    dy: 1.6 * b + kf(t, [[0, 0], [th, 0], [th + 0.08, 12], [th + 0.35, 7], [th + 1.4, 2], [6, 0]]),
    br: 1 + 0.006 * b - kf(t, [[0, 0], [th, 0], [th + 0.08, 0.035], [th + 0.8, 0.01], [6, 0]]),
    torso: kf(t, [[0, 0], [th, 0], [th + 0.17, -7], [th + 0.6, -4.5], [th + 1.6, -1.5], [6, 0]]),
    head: kf(t, [[0, 3], [th, 3], [th + 0.1, -11], [th + 0.7, -13], [th + 1.6, -4], [4.6, 5], [6, 2]]),
    armL: kf(t, [[0, 0], [th, 0], [th + 0.15, -12], [th + 0.8, -8], [th + 1.8, -3], [6, 0]]) + 1.2 * b,
    foreL: kf(t, [[0, 0], [th, 0], [th + 0.15, -32], [th + 0.9, -20], [th + 2, -6], [6, 0]]),
    armR: kf(t, [[0, 0], [th, 0], [th + 0.12, -9], [th + 1.0, -5], [6, -1]]) - 1 * b,
    foreR: kf(t, [[0, 0], [th, 0], [th + 0.12, -12], [th + 1.2, -4], [6, 0]]),
    thighL: kf(t, [[0, 0], [th, 0], [th + 0.15, -3], [th + 1.2, -1], [6, 0]]),
    thighR: kf(t, [[0, 0], [th, 0], [th + 0.15, 3], [th + 1.2, 1], [6, 0]]),
    shinL: kf(t, [[0, 0], [th, 0], [th + 0.15, 4], [th + 1.2, 1], [6, 0]]),
    shinR: kf(t, [[0, 0], [th, 0], [th + 0.15, -4], [th + 1.2, -1], [6, 0]]),
    blink: 1 - 0.92 * (Math.max(0, 1 - Math.abs(f - 36) / 3) + Math.max(0, 1 - Math.abs(f - 104) / 3)),
  };
};

export const boerPose = (f: number): Pose => {
  const p = boerPoseRaw(f), t = f / FPS, th = HIT / FPS;
  const mixA = (a: number | undefined, b: number, k: number) => (a || 0) * (1 - k) + b * k;
  const k = kf(t, [[0, 0], [th + 0.12, 0], [th + 0.42, 1], [20, 1]]);
  const L = reach('L', 452, 918), R = reach('R', 548, 912);
  return {
    ...p,
    yaw: kf(t, [[0, 0], [0.5, -24], [1.3, -24], [1.9, 24], [th - 0.15, 24], [th + 0.08, -34], [th + 0.9, -12], [th + 2.2, 0], [20, 0]]),
    turn: kf(t, [[0, 0], [1.9, 10], [th, 10], [th + 0.4, -14], [th + 2, 0]]),
    armL: mixA(p.armL, L.ua, k), foreL: mixA(p.foreL, L.fore, k), armR: mixA(p.armR, R.ua, k), foreR: mixA(p.foreR, R.fore, k),
    torso: (p.torso || 0) + 10 * k, dx: 10 * Math.sin(Math.min(1, Math.max(0, (t - th) / 0.6)) * 3) * k,
  };
};

export const Boer: React.FC<{cut?: boolean}> = ({cut}) => {
  const f = useCurrentFrame();
  const pose = boerPose(f);

  // camera: slow dolly (pan + push-in), shake on impact
  const p = f / BOER_FRAMES;
  const shake = f >= HIT ? 12 * Math.exp(-(f - HIT) / 5) : 0;
  const cam: Cam = {
    x: lerp(-80, 70, ease(p)) + Math.sin(f * 2.3) * shake,
    y: Math.cos(f * 2.9) * shake * 0.7,
    zoom: lerp(1.0, 1.085, ease(p)),
  };

  // hotspot + label timing
  const mScr = camXY(cam, 0.54, 1062, 600);
  const tr0: [number, number] = [960 + (mScr[0] - 960) / cam.zoom + cam.x, 640 + (mScr[1] - 640) / cam.zoom + cam.y];
  const hs = easeOutBack((f - (HIT + 6)) / 10);
  const line = easeOut((f - (HIT + 10)) / 14);
  const label = easeOut((f - (HIT + 18)) / 12);
  const [hx, hy] = (() => {
    const [rx, ry] = attach('torso', 482, 906, pose);
    return place(rx, ry);
  })();
  const LX = 1170, LY = 400; // label anchor on the right
  const lineEnd = [hx + (LX - 20 - hx) * line, hy + (LY - 14 - hy) * line];

  // dust kicked up by the recoil
  const dustT = clamp((f - (HIT + 2)) / 60);
  const flashA = f >= 58 && f < 70 ? 0.55 * Math.exp(-(f - 58) / 2.2) : 0;
  const muzzle = f >= HIT - 8 && f < HIT - 3 ? 1 - (f - (HIT - 8)) / 5 : 0;
  const smoke = clamp((f - (HIT - 7)) / 70);

  const capIn = cut ? 0 : easeOut((f - 14) / 12), capOut = 1 - easeOut((f - 104) / 14);
  const fade = (cut ? 1 : clamp(f / 14)) * (1 - clamp((f - (BOER_FRAMES - 10)) / 10));

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Layer cam={cam} depth={0.02}><Sky f={f} /></Layer>
      <Layer cam={cam} depth={0.06}>
        <Mountains />
      </Layer>
      <Layer cam={cam} depth={0.12} blend="screen" opacity={0.9}><Rays f={f} /></Layer>
      <Layer cam={cam} depth={0.12} blur={0.8}><Hills seed={21} base={668} amp={34} haze={0.62} /></Layer>
      <Layer cam={cam} depth={0.2} blur={0.5}><Hills seed={33} base={702} amp={42} haze={0.46} /></Layer>

      {/* ground slices at increasing depth so the plane keeps perspective while the camera moves */}
      <Layer cam={cam} depth={0.28} blur={0.4}><Plains seed={5} y0={690} y1={800} count={700} haze0={0.55} haze1={0.4} sunPatch /></Layer>
      <Layer cam={cam} depth={0.3}>
        <Rock id="rk1" x={1480} y={786} w={150} h={96} seed={4} haze={0.3} />
        <Rock id="rk2" x={1610} y={790} w={100} h={140} seed={9} haze={0.3} />
        <Rock id="rk3" x={1350} y={792} w={80} h={56} seed={14} haze={0.32} />
        <Rock id="rk4" x={250} y={780} w={90} h={60} seed={19} haze={0.34} />
      </Layer>
      <Layer cam={cam} depth={0.5}><Plains seed={6} y0={770} y1={880} count={800} haze0={0.35} haze1={0.22} fade={1} /></Layer>
      <Layer cam={cam} depth={0.52}>
        <Acacia x={1560} y={812} s={0.95} seed={31} haze={0.3} />
        <Acacia x={300} y={806} s={0.62} seed={32} haze={0.36} />
      </Layer>
      <Layer cam={cam} depth={0.54}>
        <FigureDefs />
        <Figure uid="mk" x={1130} y={812} s={0.22} o={boer('left')} p={aimPose(f / 6)} light="warm" lo />
        {muzzle > 0 && <circle cx={1062} cy={600} r={16 * muzzle + 4} fill="#fff1c4" opacity={muzzle} />}
        {smoke > 0 && <ellipse cx={1062 - smoke * 40} cy={598 - smoke * 36} rx={10 + smoke * 50} ry={8 + smoke * 24} fill="#d9c7b0" opacity={0.5 * (1 - smoke)} />}
      </Layer>
      <Layer cam={cam} depth={0.78}><Plains seed={7} y0={850} y1={960} count={900} haze0={0.18} haze1={0.1} fade={1} /></Layer>
      <Layer cam={cam} depth={0.8}><Grass f={f} seed={41} count={160} yMin={860} yMax={955} hMin={30} hMax={70} cDark="#6a5a2a" cLite="#d9b868" sway={0.8} /></Layer>
      <Layer cam={cam} depth={1.0}><Plains seed={8} y0={930} y1={1080} count={900} haze0={0.08} haze1={0.0} fade={1} /></Layer>

      <Layer cam={cam} depth={0.82}>
        <Actors f={f} specs={[
          {id: 'c1', o: tommy('right'), x: 250, y: 872, s: 0.4, face: 'right', mode: 'kneelAim', fireFrom: 8, period: 12, aim: () => [1170, 600], lo: false},
          {id: 'c2', o: tommy('right', '#c89870'), x: 430, y: 872, s: 0.4, face: 'right', mode: 'aim', fireFrom: 14, period: 13, aim: () => [1170, 600], lo: false, flinch: [HIT]},
          {id: 'c3', o: tommy('right'), x: 1560, y: 872, s: 0.4, face: 'right', mode: 'kneelAim', fireFrom: 5, period: 11, aim: () => [1180, 604], lo: false, dieAt: HIT + 14, die: 'stumble' as const},
          {id: 'c4', o: tommy('right', '#c89870'), x: 1740, y: 872, s: 0.4, face: 'right', mode: 'aim', fireFrom: 10, period: 12, aim: () => [1180, 604], lo: false, flinch: [HIT]},
        ]} />
      </Layer>
      {/* character plane */}
      <Character
        pose={pose}
        variant={{young: true}}
        cam={cam}
        depth={1}
        under={
          <>
            {/* recoil dust cloud around the boots */}
            {dustT > 0 && [0, 1, 2, 3, 4, 5].map((i) => {
              const dx = (i - 2.5) * 70 * (0.4 + dustT * 0.9);
              return <ellipse key={i} cx={800 + dx} cy={930 - dustT * (20 + i * 6)} rx={40 + dustT * 70} ry={16 + dustT * 34} fill="#d9a870" opacity={0.5 * (1 - dustT)} style={{filter: 'blur(14px)'}} />;
            })}
          </>
        }
      >
        {/* wound hotspot attached to the torso joint */}
        {hs > 0 && (
          <g transform={`translate(${hx} ${hy})`}>
            <circle r={62 * hs} fill="#e02a1c" opacity=".35" style={{filter: 'blur(14px)'}} />
            <circle r={22 * (1 + ((f * 0.045) % 1) * 1.6)} fill="none" stroke="#e0b86a" strokeWidth="2.5" opacity={1 - ((f * 0.045) % 1)} />
            <circle r={13 * hs} fill="#2a1a12" stroke="#e0b86a" strokeWidth="3" />
            <circle r={5 * hs} fill="#e0b86a" />
          </g>
        )}
        <Tracer x0={tr0[0]} y0={tr0[1]} x1={hx} y1={hy} age={f - (HIT - 8)} dur={8} w={4} />
        {line > 0 && <path d={`M${hx} ${hy} L${lineEnd[0]} ${lineEnd[1]}`} stroke="#e0b86a" strokeWidth="2.5" strokeLinecap="round" fill="none" />}
        <g opacity={label} transform={`translate(${(1 - label) * 24} 0)`}>
          <text x={LX} y={LY} fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={44} letterSpacing={4} fill="#f6e8c8">PERUT</text>
          <text x={LX} y={LY + 38} fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize={30} fill="#d9c7a0">Perang Boer, 1899</text>
        </g>
      </Character>

      {/* foreground: swaying grass + bokeh dust, with depth-of-field blur */}
      <Layer cam={cam} depth={1.5} blur={2.4}>
        <Grass f={f} seed={51} count={150} yMin={1040} yMax={1100} hMin={140} hMax={300} cDark="#3a2f16" cLite="#a98a46" sway={1.4} />
      </Layer>
      <Layer cam={cam} depth={1.7} blur={2}><Motes f={f} seed={61} count={26} size={3} speed={0.9} /></Layer>
      <Layer cam={cam} depth={2.6} blur={14}>
        <Grass f={f} seed={71} count={26} yMin={1110} yMax={1150} hMin={380} hMax={620} xMin={-200} xMax={W + 200} cDark="#1d1608" cLite="#5e4a22" sway={1.8} />
        <Motes f={f} seed={72} count={8} size={16} speed={1.6} />
      </Layer>
      <Layer cam={cam} depth={0.5} blur={0.6}><Motes f={f} seed={62} count={60} size={1.8} speed={0.5} /></Layer>

      {/* caption */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
        <g opacity={capIn * capOut} transform={`translate(${(1 - capIn) * -30} 0)`}>
          <rect x={96} y={866} width={4} height={86} fill="#e0b86a" />
          <text x={120} y={906} fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={40} letterSpacing={6} fill="#f6e8c8">AFRIKA SELATAN</text>
          <text x={120} y={946} fontFamily="Georgia, serif" fontStyle="italic" fontSize={32} fill="#d9c7a0">1899 · Perang Boer</text>
        </g>
      </svg>

      <Post f={f} flash={flashA} fade={fade} />
    </AbsoluteFill>
  );
};
