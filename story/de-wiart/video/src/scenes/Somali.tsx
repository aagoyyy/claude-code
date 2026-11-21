import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grass, Layer, Motes, Plains, Rock} from '../world/Savanna';
import {Dunes, dcol, Fort, SandStreaks, Scrub, SkyHot} from '../world/Desert';
import {Cam, camXY, clamp, ease, easeOut, easeOutBack, H, lerp, W} from '../world/util';
import {Character, place} from '../rig/Character';
import {attach, kf, Pose, reach} from '../rig/pose';
import {Post} from '../fx/Post';
import {Actors, Tracer} from '../fx/Battle';
import {Figure, FigureDefs} from '../rig/Figure';
import {idlePose} from '../rig/Side';
import {askari, dervish, dervishRifle, officer} from './SomaliA';

export const FPS = 24;
export const SOMALI_FRAMES = 192;
const HIT = 70;
const PIV: [number, number] = [797, 300]; // head, in screen space

const somaliPoseRaw = (f: number): Pose => {
  const t = f / FPS, th = HIT / FPS;
  const b = Math.sin((t * Math.PI * 2) / 2.6);
  return {
    dy: 1.6 * b + kf(t, [[0, 0], [th, 0], [th + 0.08, 11], [th + 0.4, 6], [th + 1.8, 2], [9, 0]]),
    br: 1 + 0.006 * b,
    torso: kf(t, [[0, 0], [th, 0], [th + 0.16, -9], [th + 0.8, -5], [th + 2, -1], [9, 0]]),
    head: kf(t, [[0, 2], [1.4, 9], [th, 9], [th + 0.1, -26], [th + 0.6, -22], [th + 1.4, -8], [th + 2.6, 0], [9, 0]]),
    armL: kf(t, [[0, 0], [th, 0], [th + 0.15, -10], [th + 1, -6], [9, -2]]) + 1.2 * b,
    foreL: kf(t, [[0, 0], [th, 0], [th + 0.15, -26], [th + 1, -14], [9, -4]]),
    armR: kf(t, [[0, 0], [th, 0], [th + 0.12, -8], [th + 1, -4], [9, -1]]) - b,
    foreR: kf(t, [[0, 0], [th, 0], [th + 0.12, -10], [th + 1, -3], [9, 0]]),
    thighL: kf(t, [[0, 0], [th, 0], [th + 0.15, -3], [th + 1.2, -1], [9, 0]]),
    thighR: kf(t, [[0, 0], [th, 0], [th + 0.15, 3], [th + 1.2, 1], [9, 0]]),
    shinL: kf(t, [[0, 0], [th, 0], [th + 0.15, 4], [th + 1.2, 1], [9, 0]]),
    shinR: kf(t, [[0, 0], [th, 0], [th + 0.15, -4], [th + 1.2, -1], [9, 0]]),
    blink: f >= HIT && f < HIT + 30 ? 0.05 : 1 - 0.92 * Math.max(0, 1 - Math.abs(f - 44) / 3), // eye squeezed shut right after the hit
  };
};

export const somaliPose = (f: number): Pose => {
  const p = somaliPoseRaw(f), t = f / FPS, th = HIT / FPS;
  const mixA = (a: number | undefined, b: number, k: number) => (a || 0) * (1 - k) + b * k;
  const k = kf(t, [[0, 0], [th + 0.2, 0], [th + 0.5, 1], [20, 1]]);
  const L = reach('L', 512, 604);
  return {
    ...p,
    yaw: kf(t, [[0, 0], [0.6, 26], [th - 0.1, 26], [th + 0.1, -38], [th + 1.2, -14], [th + 2.6, -4], [20, -4]]),
    turn: kf(t, [[0, 0], [1, 12], [th, 12], [th + 0.3, -12], [th + 2, -4]]),
    mouth: f >= HIT ? 0.7 * k * (0.6 + 0.4 * Math.sin(f * 0.6)) : (f > 10 && f < HIT - 8 ? 0.2 + 0.7 * Math.abs(Math.sin(f * 0.75)) : 0),
    armL: mixA(p.armL, L.ua, k), foreL: mixA(p.foreL, L.fore, k),
  };
};

const Callout: React.FC<{sx: number; sy: number; hs: number; line: number; label: number; lx: number; ly: number; title: string; sub: string; f: number}> = ({sx, sy, hs, line, label, lx, ly, title, sub, f}) => {
  const ex = sx + (lx - 16 - sx) * line, ey = sy + (ly - 14 - sy) * line;
  const pulse = (f * 0.045) % 1;
  return (
    <g>
      {hs > 0 && <>
        <circle cx={sx} cy={sy} r={34 * hs} fill="#e02a1c" opacity=".4" style={{filter: 'blur(9px)'}} />
        <circle cx={sx} cy={sy} r={14 * (1 + pulse * 1.6)} fill="none" stroke="#e0b86a" strokeWidth="2.5" opacity={1 - pulse} />
        <circle cx={sx} cy={sy} r={9 * hs} fill="#2a1a12" stroke="#e0b86a" strokeWidth="2.5" />
        <circle cx={sx} cy={sy} r={3.4 * hs} fill="#e0b86a" />
      </>}
      {line > 0 && <path d={`M${sx} ${sy} L${ex} ${ey}`} stroke="#e0b86a" strokeWidth="2.5" strokeLinecap="round" />}
      <g opacity={label} transform={`translate(${(1 - label) * 24} 0)`}>
        <text x={lx} y={ly} fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={44} letterSpacing={4} fill="#3a2418" stroke="#fbe6bc" strokeWidth={0} >{title}</text>
        <text x={lx} y={ly + 36} fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize={28} fill="#5a3a28">{sub}</text>
      </g>
    </g>
  );
};

export const Somali: React.FC<{cut?: boolean}> = ({cut}) => {
  const f = useCurrentFrame();
  const pose = somaliPose(f);
  const hit = f >= HIT;
  const variant = {young: true, patch: hit, scars: hit};

  const p = f / SOMALI_FRAMES;
  const shake = f >= HIT ? 14 * Math.exp(-(f - HIT) / 5) : 0;
  const punch = ease(clamp((f - (HIT + 4)) / 40));          // punch-in on the face
  const settle = ease(clamp((f - 150) / 40));              // slow pull-back at the end
  const zoom = lerp(1.0, 1.06, ease(clamp(f / HIT))) + punch * 1.5 - settle * 0.55;
  const cam: Cam = {x: lerp(-70, 30, ease(p)) + Math.sin(f * 2.3) * shake, y: Math.cos(f * 2.9) * shake * 0.7, zoom, px: PIV[0], py: PIV[1]};

  const hsp = (rx: number, ry: number) => {
    const [a, b] = attach('head', rx, ry, pose); const [sx, sy] = place(a, b);
    return camXY(cam, 1, sx, sy);
  };
  const eye = hsp(528, 564), ear = hsp(574, 570), face = hsp(556, 618);
  const tm = (start: number) => ({hs: easeOutBack((f - start) / 10), line: easeOut((f - start - 4) / 14), label: easeOut((f - start - 12) / 12)});

  const flashA = f >= 68 && f < 80 ? 0.7 * Math.exp(-(f - 68) / 2.4) : 0;
  const muzzle = f >= HIT - 8 && f < HIT - 3 ? 1 - (f - (HIT - 8)) / 5 : 0;
  const dustT = clamp((f - (HIT + 2)) / 60);
  const capIn = cut ? 0 : easeOut((f - 14) / 12), capOut = 1 - easeOut((f - 60) / 12);
  const fade = 1;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Layer cam={cam} depth={0.02}><SkyHot f={f} /></Layer>
      <Layer cam={cam} depth={0.06} blur={0.6}><Dunes seed={2} base={650} amp={34} haze={0.66} /></Layer>
      <Layer cam={cam} depth={0.12}>
        <Fort x={1450} y={700} s={0.82} f={f} haze={0.52} />
        <FigureDefs />
        {[-70, 10, 90, 170, 250].map((lx, k) => <Figure key={'dw' + k} uid={`dw${k}`} x={1450 + lx * 0.82} y={700 - 130 * 0.82 + 2} s={0.042} o={dervishRifle('left')} p={{...idlePose(f / 7 + k), uaN: -30, faN: -40}} light="desert" lo />)}
        {muzzle > 0 && <circle cx={1450 + 200 * 0.82} cy={700 - 88 * 0.82} r={20 * muzzle + 5} fill="#fff4cc" opacity={muzzle} />}
      </Layer>
      <Layer cam={cam} depth={0.2} blur={0.5}><Dunes seed={5} base={705} amp={44} haze={0.46} /></Layer>
      <Layer cam={cam} depth={0.28}><Plains seed={15} y0={700} y1={800} count={420} haze0={0.55} haze1={0.4} colorAt={dcol} haze="#fbe2b4" /></Layer>
      <Layer cam={cam} depth={0.3}>
        <Rock id="drk1" x={330} y={790} w={110} h={70} seed={21} haze={0.4} />
        <Rock id="drk2" x={1180} y={792} w={80} h={54} seed={22} haze={0.42} />
      </Layer>
      <Layer cam={cam} depth={0.5}><Plains seed={16} y0={770} y1={880} count={460} haze0={0.35} haze1={0.22} fade={1} colorAt={dcol} haze="#fbe2b4" /></Layer>
      <Layer cam={cam} depth={0.52}><Scrub seed={3} count={9} y0={790} y1={870} f={f} /></Layer>
      <Layer cam={cam} depth={0.78}><Plains seed={17} y0={850} y1={960} count={500} haze0={0.18} haze1={0.1} fade={1} colorAt={dcol} haze="#fbe2b4" /></Layer>
      <Layer cam={cam} depth={0.8}><Scrub seed={4} count={7} y0={880} y1={950} f={f} /></Layer>
      <Layer cam={cam} depth={1.0}><Plains seed={18} y0={930} y1={1080} count={520} haze0={0.08} haze1={0.0} fade={1} colorAt={dcol} haze="#fbe2b4" /></Layer>

      <Layer cam={cam} depth={0.82}>
        <Actors f={f} specs={[
          {id: 'c1', o: officer('right'), x: 250, y: 872, s: 0.4, face: 'right', mode: 'aim', fireFrom: 8, period: 13, aim: () => [1500, 640], lo: false},
          {id: 'c2', o: askari('right'), x: 430, y: 872, s: 0.4, face: 'right', mode: 'kneelAim', fireFrom: 14, period: 12, aim: () => [1500, 640], lo: false, flinch: [HIT]},
          {id: 'c3', o: askari('right'), x: 1560, y: 872, s: 0.4, face: 'right', mode: 'kneelAim', fireFrom: 5, period: 11, aim: () => [1500, 640], lo: true, dieAt: HIT + 16, die: 'forward' as const},
          {id: 'c4', o: askari('right'), x: 1740, y: 872, s: 0.4, face: 'right', mode: 'aim', fireFrom: 10, period: 12, aim: () => [1500, 640], lo: false, flinch: [HIT]},
        ]} />
      </Layer>

      <Character
        pose={pose}
        variant={variant}
        cam={cam}
        depth={1}
        lit={0.9}
        under={dustT > 0 ? (
          <>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const dx = (i - 2.5) * 70 * (0.4 + dustT * 0.9);
              return <ellipse key={i} cx={800 + dx} cy={930 - dustT * (20 + i * 6)} rx={40 + dustT * 70} ry={16 + dustT * 34} fill="#f0cf94" opacity={0.55 * (1 - dustT)} style={{filter: 'blur(14px)'}} />;
            })}
          </>
        ) : null}
      />

      <Layer cam={cam} depth={1.3} blur={2}><SandStreaks f={f} seed={5} count={22} /></Layer>
      <Layer cam={cam} depth={1.5} blur={3}><Scrub seed={9} count={4} y0={1050} y1={1110} f={f} /></Layer>
      <Layer cam={cam} depth={1.7} blur={2}><Motes f={f} seed={64} count={24} size={3} speed={1.4} /></Layer>
      <Layer cam={cam} depth={2.6} blur={14}><Motes f={f} seed={65} count={7} size={18} speed={2} /></Layer>

      {/* UI overlay in screen space: lines follow the joints through the camera */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
        <g opacity={capIn * capOut} transform={`translate(${(1 - capIn) * -30} 0)`}>
          <rect x={96} y={866} width={4} height={86} fill="#7a4a2c" />
          <text x={120} y={906} fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={40} letterSpacing={6} fill="#4a2a18">SOMALILAND</text>
          <text x={120} y={946} fontFamily="Georgia, serif" fontStyle="italic" fontSize={32} fill="#6a4630">1914</text>
        </g>
        {(() => { const m = camXY(cam, 0.12, 1450 + 200 * 0.82, 700 - 88 * 0.82); return <Tracer x0={m[0]} y0={m[1]} x1={eye[0]} y1={eye[1]} age={f - (HIT - 8)} dur={8} w={4} />; })()}
        {hit && <>
          <Callout f={f} sx={eye[0]} sy={eye[1]} {...tm(HIT + 14)} lx={1250} ly={230} title="MATA KIRI" sub="Somaliland, 1914" />
          <Callout f={f} sx={ear[0]} sy={ear[1]} {...tm(HIT + 24)} lx={1250} ly={360} title="TELINGA" sub="tertembak" />
          <Callout f={f} sx={face[0]} sy={face[1]} {...tm(HIT + 34)} lx={1250} ly={490} title="WAJAH" sub="tertembak" />
        </>}
      </svg>

      <Post f={f} flash={flashA} fade={fade} />
    </AbsoluteFill>
  );
};
