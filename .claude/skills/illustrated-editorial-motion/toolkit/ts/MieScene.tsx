import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Defs, LAYERS, META} from './layers/Layers';
import {Flame, Bubbles, Steam, Puffs, Wisp} from './layers/Dyn';

/**
 * 5 s @ 24 fps, 1080x1920, 100 % SVG, no hands.
 *  0-44   medium shot: flame ignites, water boils, lid rattles, steam lifts it (no hand)
 *  44-78  camera pulls back to the hero framing
 *  46-100 placemat + bowl rise, noodles settle (turbulence deformation), toppings drop in sequence
 *  94-120 chopsticks slide in, tag swings, bowl steam builds, slow push-in
 */
export const SCENE = {total: 120, fps: 24} as const;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eio = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const eo = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

/* ---- timeline (frames) ---- */
const T = {flame: 3, boil: 8, rattle: 14, lift: 30, camA: 44, camB: 78, mat: 46, bowl: 52, noodle: 66, chop: 94, tag: 100, steamBowl: 90};
const DROPS: Record<string, {at: number; dx: number; dist: number; spin: number}> = {
  egg:   {at: 76, dx: -140, dist: 300, spin: -110},
  sawi:  {at: 81, dx: 160,  dist: 330, spin: 100},
  ball1: {at: 86, dx: 90,   dist: 280, spin: 80},
  ball2: {at: 89, dx: -60,  dist: 270, spin: -90},
  chili0: {at: 88, dx: 30,  dist: 260, spin: 90}, chili1: {at: 90, dx: -40, dist: 260, spin: -90}, chili2: {at: 92, dx: 50, dist: 250, spin: 70},
  chili3: {at: 94, dx: -20, dist: 250, spin: -70}, chili4: {at: 96, dx: 60, dist: 250, spin: 60},
  scal0: {at: 90, dx: 20, dist: 240, spin: 60}, scal1: {at: 91.5, dx: -30, dist: 240, spin: -80}, scal2: {at: 93, dx: 40, dist: 240, spin: 50},
  scal3: {at: 94.5, dx: -50, dist: 240, spin: -60}, scal4: {at: 96, dx: 30, dist: 240, spin: 70}, scal5: {at: 97.5, dx: -20, dist: 240, spin: -50},
};
const TOP_ORDER = ['egg', 'sawi', 'ball1', 'ball2', 'chili0', 'chili1', 'chili2', 'chili3', 'chili4', 'scal0', 'scal1', 'scal2', 'scal3', 'scal4', 'scal5'];

const G: React.FC<{x?: number; y?: number; rot?: number; sx?: number; sy?: number; px?: number; py?: number; o?: number; children: React.ReactNode}> =
  ({x = 0, y = 0, rot = 0, sx = 1, sy = 1, px = 0, py = 0, o = 1, children}) => (
    <g opacity={o} transform={`translate(${x + px} ${y + py}) rotate(${rot}) scale(${sx} ${sy}) translate(${-px} ${-py})`}>{children}</g>
  );
const Layer: React.FC<{n: string}> = ({n}) => { const C = LAYERS[n]; return <C />; };

/** an ingredient falls in with acceleration, lands with squash, bounces once and settles */
const Drop: React.FC<{name: string; f: number}> = ({name, f}) => {
  const d = DROPS[name]; const [cx, cy] = META[name];
  const t = f - d.at;
  if (t < 0) return null;
  const dur = 7, u = clamp(t / dur);
  const fall = 1 - u * u;                                          // distance left, accelerating
  const after = Math.max(0, t - dur);
  const sq = after > 0 ? 0.2 * Math.exp(-after / 3.2) * Math.cos(after * 0.95) : 0;
  const bounce = after > 0 ? -Math.abs(Math.sin(after * 0.7)) * Math.exp(-after / 4) * 12 : 0;
  const stretch = t < dur ? 0.08 * u : 0;
  return (
    <G x={d.dx * fall} y={-d.dist * fall + bounce} rot={d.spin * fall} sx={1 + sq * 0.7 - stretch * 0.5} sy={1 - sq + stretch} px={cx} py={cy + 36} o={clamp(t / 2)}>
      <Layer n={name} />
    </G>
  );
};

export const MieScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = (start: number, damping: number, stiffness: number, mass = 1) => spring({frame: f - start, fps, config: {damping, stiffness, mass}});

  /* ---------- camera ---------- */
  let cx: number, cy: number, z: number;
  if (f < T.camA) { const p = prog(f, 0, T.camA); cx = lerp(400, 430, p); cy = lerp(1010, 1005, p); z = lerp(1.4, 1.48, p); }
  else if (f < T.camB) { const p = eio(prog(f, T.camA, T.camB)); cx = lerp(430, 540, p); cy = lerp(1005, 975, p); z = lerp(1.48, 1.0, p); }
  else { const p = eio(prog(f, T.camB, SCENE.total)); cx = lerp(540, 556, p); cy = lerp(975, 1040, p); z = lerp(1.0, 1.05, p); }

  /* ---------- lid (steam pressure lifts it) ---------- */
  const rattleA = prog(f, T.rattle, T.lift - 1) * (f < T.lift ? 1 : 0);
  const rattleY = -Math.abs(Math.sin(f * 1.9)) * 5 * rattleA;
  const rattleR = Math.sin(f * 2.4) * 1.6 * rattleA;
  const antic = f >= T.lift - 3 && f < T.lift ? 3 * eio(prog(f, T.lift - 3, T.lift)) : 0;
  const lp = sp(T.lift, 9, 70, 1.1);                                                     // lifts with small overshoot, then floats
  const lidX = 8 * lp, lidY = lerp(80, -62, lp) + rattleY + antic;
  const lidRot = -9 * lp + rattleR;
  const hover = f > T.lift + 14 ? Math.sin((f - T.lift) * 0.16) * 2.4 : 0;

  /* ---------- bowl rig ---------- */
  const matP = sp(T.mat, 15, 90);
  const bowlP = sp(T.bowl, 13, 85, 1.0);
  const bowlDy = (1 - bowlP) * 640;
  const settle = f > T.bowl + 14 ? 0.06 * Math.exp(-(f - T.bowl - 14) / 4) * Math.cos((f - T.bowl - 14) * 0.9) : 0;
  const bowlSx = 1 + settle * 0.6, bowlSy = 1 - settle;
  const bump = f >= T.noodle + 10 ? 0.03 * Math.exp(-(f - T.noodle - 10) / 3.5) * Math.cos((f - T.noodle - 10) * 1.0) : 0;
  const nP = sp(T.noodle, 12, 70, 1.0);                                                  // noodles rise and fill
  const nDef = f >= T.noodle ? Math.max(0, 46 * (1 - prog(f, T.noodle, T.noodle + 22))) : 0;   // liquid deformation that settles to zero
  const nSy = lerp(0.08, 1, clamp(nP, 0, 1.12));

  /* ---------- chopsticks + tag ---------- */
  const chopP = sp(T.chop, 12, 80);
  const tagT = f - T.tag;
  const tagIn = tagT < 0 ? 0 : clamp(tagT / 6);
  const tagY = (1 - eo(tagIn)) * -420;
  const tagRot = tagT < 0 ? 0 : 26 * Math.exp(-tagT / 9) * Math.cos(tagT * 0.62);

  /* ---------- steam ---------- */
  const potWisps: Wisp[] = [{x: 255, y: 662, h: 190, w: 28, start: 6}, {x: 455, y: 662, h: 165, w: 26, start: 9}, {x: 360, y: 668, h: 230, w: 32, start: 12}];
  const bowlWisps: Wisp[] = [{x: 540, y: 1372, h: 240, w: 40, start: T.steamBowl}, {x: 672, y: 1364, h: 280, w: 44, start: T.steamBowl + 3}, {x: 792, y: 1376, h: 220, w: 36, start: T.steamBowl + 6}];

  return (
    <AbsoluteFill style={{background: '#EADCC3'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <Defs />
        <g transform={`translate(540 960) scale(${z}) translate(${-cx} ${-cy})`}>
          <Layer n="wall" />
          <Layer n="table" />
          <Layer n="stove" />
          <Layer n="pot" />
          <Bubbles f={f} start={T.boil} />
          <Flame f={f} at={T.flame} />
          <Steam f={f} id="potS" wisps={potWisps} op={0.7} seed={3} />
          <Puffs f={f} start={T.lift - 2} lidY={lidY} />
          {/* lid */}
          <G x={lidX} y={lidY + hover} rot={lidRot} px={360} py={600}><Layer n="lid" /></G>
          <Layer n="glass" />

          {/* placemat slides in, then the bowl rig rises */}
          <G y={(1 - matP) * 520} o={clamp((f - T.mat) / 4)}><Layer n="placemat" /></G>
          <G y={bowlDy} sx={bowlSx} sy={bowlSy} px={640} py={1796} o={clamp((f - T.bowl) / 3)}>
            <Layer n="bowl" />
            <G sx={1 + bump * 0.5} sy={nSy * (1 - bump)} px={640} py={1560} o={clamp((f - T.noodle) / 3)}>
              {nDef > 0.5 ? (
                <g filter="url(#dynNoodle)">
                  <defs>
                    <filter id="dynNoodle" x="-10%" y="-20%" width="120%" height="140%" colorInterpolationFilters="sRGB">
                      <feTurbulence type="fractalNoise" baseFrequency={`${0.012 + 0.003 * Math.sin(f * 0.4)} 0.02`} numOctaves={2} seed={2} result="n" />
                      <feDisplacementMap in="SourceGraphic" in2="n" scale={nDef} xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                  </defs>
                  <Layer n="noodles" />
                </g>
              ) : <Layer n="noodles" />}
            </G>
            {TOP_ORDER.map((n) => <Drop key={n} name={n} f={f} />)}
            {f >= 98 && <G o={clamp((f - 98) / 6)}><Layer n="garnish" /></G>}
            <Layer n="lip" />
            <Steam f={f} id="bowlS" wisps={bowlWisps} op={0.62} th={26} scale={52} seed={9} fade={clamp((f - T.steamBowl) / 8)} />
          </G>
          <G x={(1 - chopP) * -560} y={(1 - chopP) * 40} o={clamp((f - T.chop) / 3)}><Layer n="chopsticks" /></G>
          <G y={tagY} rot={tagRot} px={606} py={1720} o={tagIn > 0 ? 1 : 0}><Layer n="tag" /></G>
          <Layer n="fx" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
