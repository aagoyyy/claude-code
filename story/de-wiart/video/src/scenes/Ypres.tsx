import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Layer, Motes, Plains} from '../world/Savanna';
import {Beams, DeadTree, Flare, flareLight, mcol, NHAZE, Rain, Ruins, Sandbags, SkyNight, Smoke, Wire} from '../world/Trench';
import {Cam, camXY, clamp, ease, easeOut, easeOutBack, H, lerp, W} from '../world/util';
import {Character, place} from '../rig/Character';
import {attach, kf, Pose} from '../rig/pose';
import {Callout, VictoriaCross} from '../ui/Callout';
import {Post} from '../fx/Post';

export const FPS = 24;
export const YPRES_FRAMES = 336;
const HIT = 84;        // hand shot off
const MONT = 140;      // wound montage starts
const VC = 250;        // Victoria Cross beat
const imp = (f: number, t0: number) => (f < t0 ? 0 : Math.exp(-(f - t0) / 4.5));

export const ypresPose = (f: number): Pose => {
  const t = f / FPS, th = HIT / FPS;
  const b = Math.sin((t * Math.PI * 2) / 2.2);                     // heavy breathing
  const fl = [150, 162, 174, 186].reduce((a, k, i) => a + imp(f, k) * (i % 2 ? -1 : 1), 0);   // flinch per wound
  const sal = kf(t, [[VC / 24 + 0.2, 0], [VC / 24 + 1.1, 1], [VC / 24 + 3.8, 1], [VC / 24 + 4.8, 0]]);
  return {
    dy: 1.8 * b + 7 * imp(f, HIT) + 5 * Math.abs(fl),
    br: 1 + 0.009 * b,
    torso: kf(t, [[0, 0], [th, 0], [th + 0.1, -8], [th + 1.2, -4], [th + 2.4, -1.5], [20, 0]]) + 3 * fl,
    head: kf(t, [[0, 6], [1.2, -8], [2.4, 8], [th, 8], [th + 0.1, 16], [th + 1, 10], [th + 2.5, 0], [20, 0]]) - 5 * fl - 4 * sal,
    armL: 80 * sal + kf(t, [[0, 0], [th, 0], [th + 0.1, -6], [th + 1.5, -3], [20, -1]]) * (1 - sal),
    foreL: 145 * sal + kf(t, [[0, 0], [th, 0], [th + 0.1, -14], [th + 1.5, -6], [20, 0]]) * (1 - sal),
    armR: kf(t, [[0, 0], [th, 0], [th + 0.1, -38], [th + 0.6, -22], [th + 1.8, -9], [20, -5]]) - b,
    foreR: kf(t, [[0, 0], [th, 0], [th + 0.1, -40], [th + 0.6, -18], [th + 1.8, -6], [20, -3]]),
    thighL: kf(t, [[0, 0], [th, 0], [th + 0.12, -4], [th + 1.5, -2], [20, 0]]) + 2 * fl,
    thighR: kf(t, [[0, 0], [th, 0], [th + 0.12, 4], [th + 1.5, 2], [20, 0]]) - 2 * fl,
    shinL: kf(t, [[0, 0], [th, 0], [th + 0.12, 5], [th + 1.5, 2], [20, 0]]),
    shinR: kf(t, [[0, 0], [th, 0], [th + 0.12, -5], [th + 1.5, -2], [20, 0]]),
    blink: 1 - 0.92 * (Math.max(0, 1 - Math.abs(f - 50) / 3) + Math.max(0, 1 - Math.abs(f - 210) / 3)),
  };
};

export const Ypres: React.FC = () => {
  const f = useCurrentFrame();
  const pose = ypresPose(f);
  const variant = {young: true, patch: true, scars: true, stump: f >= HIT + 2, bandages: f >= 174};

  // ---- light: illumination flares + muzzle/impact flashes
  const FL = [
    {x: 1250, y0: 250, t0: -30, drop: 0.9},
    {x: 560, y0: 230, t0: 92, drop: 0.8},
    {x: 1500, y0: 260, t0: 196, drop: 0.9},
  ];
  const G = clamp(FL.reduce((a, o) => a + flareLight(f - o.t0), 0) * 0.85 + 0.35 * imp(f, HIT) + 0.12 * imp(f, 150) + 0.12 * imp(f, 174));

  // ---- camera
  const p = f / YPRES_FRAMES;
  const shake = (imp(f, HIT) * 14 + imp(f, 150) * 5 + imp(f, 162) * 5 + imp(f, 174) * 5 + imp(f, 186) * 5);
  const punch = ease(clamp((f - (HIT + 4)) / 22)) - ease(clamp((f - 118) / 26));
  const vcZ = ease(clamp((f - VC) / 60));
  const cam: Cam = {
    x: lerp(-60, 40, ease(p)) + punch * 90 + Math.sin(f * 2.3) * shake,
    y: Math.cos(f * 2.9) * shake * 0.7 - punch * 10,
    zoom: lerp(1.0, 1.12, ease(clamp(f / 130))) + punch * 0.42 + vcZ * 0.12,
    px: 800, py: 560,
  };

  const pt = (part: string, x: number, y: number) => {
    const [a, b] = attach(part, x, y, pose); const [sx, sy] = place(a, b);
    return camXY(cam, 1, sx, sy);
  };
  const tm = (s: number) => ({hs: easeOutBack((f - s) / 10), line: easeOut((f - s - 4) / 12), label: easeOut((f - s - 10) / 10)});
  const dim = (s: number) => ({hs: easeOutBack((f - s) / 8), r: 0.7});

  const hand = pt('foreR', 696, 1078), head = pt('head', 484, 486), hip = pt('torso', 352, 1052), leg = pt('thighL', 448, 1288), ank = pt('shinL', 452, 1607);
  const eyeP = pt('head', 528, 564), earP = pt('head', 574, 570), faceP = pt('head', 556, 618), bellyP = pt('torso', 482, 906);

  // wound counter
  const count = f >= 186 ? 8 : f >= 174 ? 7 : f >= 162 ? 6 : f >= 150 ? 5 : 0;
  const cT = [150, 162, 174, 186].reduce((a, k) => (f >= k ? f - k : a), 99);
  const cScale = 1 + 0.35 * Math.exp(-cT / 4);

  // Victoria Cross
  const medalAnchor = pt('torso', 606, 808);
  const mp = ease(clamp((f - (VC + 22)) / 34));
  const mx = lerp(960, medalAnchor[0], mp), my = lerp(250, medalAnchor[1] + 34, mp);
  const ms = lerp(2.6, 1.05, mp);
  const swing = f > VC + 56 ? 14 * Math.exp(-(f - VC - 56) / 14) * Math.cos((f - VC - 56) * 0.5) : 0;
  const glint = clamp((f - (VC + 62)) / 20) * (1 - clamp((f - (VC + 82)) / 6)) + 0.001;
  const vcShow = clamp((f - (VC + 14)) / 8);
  const vcText = easeOut((f - (VC + 62)) / 14);

  const capIn = easeOut((f - 14) / 12), capOut = 1 - easeOut((f - 66) / 12);
  const fade = clamp(f / 14) * (1 - clamp((f - (YPRES_FRAMES - 14)) / 14));
  const flash = 0.7 * imp(f, HIT) * (f >= HIT && f < HIT + 12 ? 1 : 0);

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Layer cam={cam} depth={0.02}><SkyNight f={f} glow={G} /></Layer>
      <Layer cam={cam} depth={0.05} blend="screen" opacity={0.8}><Beams f={f} /></Layer>
      <Layer cam={cam} depth={0.08}>
        <Ruins haze={0.5} />
      </Layer>
      <Layer cam={cam} depth={0.09} blur={9}>
        <Smoke f={f} x={330} y={700} seed={3} w={200} />
        <Smoke f={f + 60} x={1540} y={700} seed={5} w={240} />
      </Layer>
      <Layer cam={cam} depth={0.1} blur={1.2}>{FL.map((o, i) => <Flare key={i} x={o.x} y0={o.y0} t={f - o.t0} drop={o.drop} />)}</Layer>

      <Layer cam={cam} depth={0.28}><Plains seed={25} y0={700} y1={800} count={380} haze0={0.6} haze1={0.45} colorAt={mcol} haze={NHAZE} /></Layer>
      <Layer cam={cam} depth={0.3}>
        <Wire y={772} x0={-400} x1={2300} s={0.5} haze={0.6} seed={2} />
        <DeadTree x={280} y={780} s={0.62} haze={0.56} seed={4} />
        <DeadTree x={1560} y={784} s={0.7} haze={0.54} seed={7} />
      </Layer>
      <Layer cam={cam} depth={0.5}><Plains seed={26} y0={770} y1={880} count={420} haze0={0.4} haze1={0.28} fade={1} colorAt={mcol} haze={NHAZE} /></Layer>
      <Layer cam={cam} depth={0.52}>
        <Wire y={846} x0={-400} x1={2300} s={0.85} haze={0.4} seed={3} />
        <DeadTree x={1740} y={850} s={0.9} haze={0.4} seed={9} />
      </Layer>
      <Layer cam={cam} depth={0.78}><Plains seed={27} y0={850} y1={960} count={460} haze0={0.22} haze1={0.12} fade={1} colorAt={mcol} haze={NHAZE} /></Layer>
      <Layer cam={cam} depth={0.82}><Sandbags y={915} x0={-300} x1={2300} rows={2} s={0.9} light={G} seed={11} /></Layer>
      <Layer cam={cam} depth={1.0}><Plains seed={28} y0={930} y1={1080} count={480} haze0={0.1} haze1={0.0} fade={1} colorAt={mcol} haze={NHAZE} /></Layer>

      <Character
        pose={pose}
        variant={variant}
        cam={cam}
        depth={1}
        lit={0.3 + 0.9 * G}
        light={{rim: '#cfeedd', key: '#d8ffe8', bounce: '#6a6a50', haze: '#2a3d58', skew: -0.45, shadow: 0.25 + 0.4 * G, halo: '#9fd8c0'}}
      />

      <Layer cam={cam} depth={1.3} blur={1}><Rain f={f} seed={7} count={70} /></Layer>
      <Layer cam={cam} depth={1.6} blur={3.5}><Sandbags y={1130} x0={-420} x1={520} rows={3} s={1.8} light={G * 0.6} seed={21} /><Sandbags y={1130} x0={1380} x1={2400} rows={3} s={1.8} light={G * 0.6} seed={22} /></Layer>
      <Layer cam={cam} depth={1.7} blur={2}><Motes f={f} seed={91} count={22} size={3} speed={1.1} /></Layer>
      <Layer cam={cam} depth={2.5} blur={14}><Motes f={f} seed={92} count={7} size={18} speed={1.8} /></Layer>

      {/* flare light washing over the whole frame */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen', opacity: 0.34 * G}}>
        <rect width={W} height={H} fill="#7fd8b8" />
      </svg>

      {/* overlay UI */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}>
        <g opacity={capIn * capOut} transform={`translate(${(1 - capIn) * -30} 0)`}>
          <rect x={96} y={866} width={4} height={86} fill="#e0b86a" />
          <text x={120} y={906} fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={40} letterSpacing={6} fill="#f6e8c8">YPRES, BELGIA</text>
          <text x={120} y={946} fontFamily="Georgia, serif" fontStyle="italic" fontSize={32} fill="#d9c7a0">1915 · Perang Dunia I</text>
        </g>

        {f >= HIT + 8 && <Callout f={f} sx={hand[0]} sy={hand[1]} {...tm(HIT + 8)} lx={1290} ly={640} title="TANGAN KIRI" sub="putus, Ypres 1915" />}
        {f >= MONT && f < 150 + 30 && null}
        {f >= MONT && <>
          <Callout f={f} sx={eyeP[0]} sy={eyeP[1]} {...dim(MONT)} />
          <Callout f={f} sx={earP[0]} sy={earP[1]} {...dim(MONT + 3)} />
          <Callout f={f} sx={faceP[0]} sy={faceP[1]} {...dim(MONT + 6)} />
          <Callout f={f} sx={bellyP[0]} sy={bellyP[1]} {...dim(MONT + 9)} />
        </>}
        {f >= 150 && <Callout f={f} sx={head[0]} sy={head[1]} {...tm(150)} lx={1290} ly={300} title="KEPALA" sub="tertembak" />}
        {f >= 162 && <Callout f={f} sx={hip[0]} sy={hip[1]} {...tm(162)} side="left" lx={520} ly={620} title="PANGGUL" sub="tertembak" />}
        {f >= 174 && <Callout f={f} sx={leg[0]} sy={leg[1]} {...tm(174)} side="left" lx={520} ly={800} title="KAKI" sub="tertembak" />}
        {f >= 186 && <Callout f={f} sx={ank[0]} sy={ank[1]} {...tm(186)} side="left" lx={520} ly={960} title="GELANGAN KAKI" sub="tertembak" />}

        {count > 0 && (
          <g transform={`translate(1560 930) scale(${cScale})`}>
            <text textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={900} fontSize={150} fill="#f6e8c8" stroke="#e0b86a" strokeWidth={2}>{count}×</text>
            <text y={44} textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={30} letterSpacing={5} fill="#d9c7a0">TERLUKA</text>
          </g>
        )}

        {vcShow > 0 && <g opacity={vcShow}><VictoriaCross x={mx} y={my} s={ms} rot={swing} glint={glint} /></g>}
        {vcText > 0 && (
          <g opacity={vcText} transform={`translate(${(1 - vcText) * 30} 0)`}>
            <rect x={1290} y={310} width={4} height={96} fill="#e0b86a" />
            <text x={1312} y={350} fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight={800} fontSize={44} letterSpacing={4} fill="#f6e8c8">VICTORIA CROSS</text>
            <text x={1312} y={394} fontFamily="Georgia, serif" fontStyle="italic" fontSize={32} fill="#d9c7a0">Somme, 1916</text>
          </g>
        )}
      </svg>

      <Post f={f} flash={flash} fade={fade} night />
    </AbsoluteFill>
  );
};
