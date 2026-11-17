import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {Bg, Headline, Eyebrow, Callout, ChartFlat} from './Layout';
import {PacketFlat, BowlFlat, BowlTopFlat, BrickFlat, SteamFlat, PriceTagFlat} from './Flat';
import {DATA, fmtRp} from './data';
import {SceneMeta} from '../compositions/CompositionEngine';

/** V6 clean test: 5 s @ 24 fps. No hands, no textures. Sequential assembly + one object-driven transition (bowl -> top-down -> value column). */
export const V6 = {total: 120, fps: 24} as const;
export const V6_SCENES: SceneMeta[] = [
  {name: 'A packet on surface', kind: 'isolated-object' as never},
  {name: 'B bowl assembly', kind: 'close-up'},
  {name: 'C top-down', kind: 'top-down'},
  {name: 'D infographic', kind: 'infographic'},
];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
const eo = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const eio = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const ei = (t: number) => clamp(t) * clamp(t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eob = (t: number, k = 1.3) => { t = clamp(t) - 1; return 1 + (k + 1) * t * t * t + k * t * t; }; // single, small overshoot (labels only)

const At: React.FC<{x: number; y: number; sc?: number; sx?: number; sy?: number; o?: number; rot?: number; origin?: string; children: React.ReactNode}> = ({x, y, sc = 1, sx = 1, sy = 1, o = 1, rot = 0, origin = '50% 100%', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc * sx},${sc * sy})`, transformOrigin: origin, opacity: o}}>{children}</div>
);

const BOWL = {x: 540, y: 1010, size: 780};
const BROTH: [number, number] = [540, 930];
const TOPF: Record<string, [number, number, number]> = {egg: [-80, -40, 0.9], choy: [70, -80, 0.85], chili: [10, 85, 0.9], ball: [105, 45, 0.8]};

export const DemoV6Core: React.FC<{f: number}> = ({f}) => {
  /* ---------- scene A/B (surface band) ---------- */
  const hA = 1 - prog(f, 34, 40), hAin = prog(f, 4, 12);
  const hB = prog(f, 40, 48) * (1 - prog(f, 66, 72));
  const pkY = lerp(-460, 0, eo(prog(f, 2, 14)));
  const pkSq = f >= 14 ? 1 - 0.045 * Math.exp(-(f - 14) / 3) : 1;
  const pkX = ei(prog(f, 34, 42)) * 900;
  const tagAx = lerp(-720, 0, eo(prog(f, 12, 24))) - ei(prog(f, 34, 42)) * 900;
  const bowlIn = eo(prog(f, 42, 50));
  const brickY = lerp(420, 930, ei(prog(f, 50, 56)));
  const brickO = f < 56 ? (f >= 50 ? 1 : 0) : 1 - prog(f, 56, 60);
  const contact = 56;
  const bowlSq = f >= contact ? 0.05 * Math.exp(-(f - contact) / 4) * Math.cos((f - contact) * 0.9) : 0;
  const bloom = eo(prog(f, 58, 68));
  const ripple = prog(f, 56, 68);
  const steamK = prog(f, 62, 72);
  const tagBx = lerp(-720, 0, eo(prog(f, 62, 72)));
  const push = eio(prog(f, 68, 80)); // camera push into the bowl
  const bowlScale = lerp(1, 2.5, push);
  const uiFade = 1 - prog(f, 66, 72);
  /* ---------- iris reveal of the top-down scene ---------- */
  const ir = f < 72 ? 0 : lerp(40, 2500, eio(prog(f, 72, 86)));
  const cScale = lerp(1.6, 1, eo(prog(f, 72, 86)));
  /* ---------- scene C/D ---------- */
  const hC = prog(f, 78, 86) * (1 - prog(f, 94, 100));
  const hD = prog(f, 98, 106);
  const slide = (a: number, dx: number, dy: number): [number, number] => { const t = 1 - eo(prog(f, a, a + 8)); return [dx * t * 700, dy * t * 700]; };
  const eS = slide(80, -1, 0), cS = slide(84, 0, -1), kS = slide(88, 1, 0), bS = slide(92, 0, 1);
  const tops = {egg: [TOPF.egg[0] + eS[0], TOPF.egg[1] + eS[1], TOPF.egg[2]], choy: [TOPF.choy[0] + cS[0], TOPF.choy[1] + cS[1], TOPF.choy[2]], chili: [TOPF.chili[0] + kS[0], TOPF.chili[1] + kS[1], TOPF.chili[2]], ball: [TOPF.ball[0] + bS[0], TOPF.ball[1] + bS[1], TOPF.ball[2]]} as Record<string, [number, number, number]>;
  const mv = eio(prog(f, 94, 106));
  const topScale = lerp(1, 0.26, mv);
  const topX = lerp(540, 765, mv), topY = lerp(1060, 520, mv);
  const gM = eo(prog(f, 100, 110)), gP = eo(prog(f, 102, 112));
  const arrow = eo(prog(f, 112, 118));
  const calloutS = f < 115 ? 0 : eob(prog(f, 115, 120));
  return (
    <AbsoluteFill>
      {/* ===== A/B ===== */}
      <Bg surface={1240}>
        <Eyebrow text="BISNIS MIE" opacity={uiFade * hAin} />
        <Headline lines={['Mi instan cuma', fmtRp(DATA.packet)]} accent={['Rp', '3.000']} y={270} opacity={hAin * hA} dy={(1 - hAin) * 24} />
        <Headline lines={['Dimasak jadi', 'semangkuk']} accent={['semangkuk']} y={270} opacity={hB} dy={(1 - prog(f, 40, 48)) * 24} />
        <At x={540 + pkX} y={940 + pkY} sy={pkSq} o={f < 42 ? 1 : 0}><PacketFlat size={780} /></At>
        <At x={380 + tagAx} y={1510} rot={-4} o={f < 44 ? 1 : 0}><PriceTagFlat text={fmtRp(DATA.packet)} width={640} /></At>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${bowlScale})`, transformOrigin: `${BROTH[0]}px ${BROTH[1]}px`}}>
          {f >= 42 && <At x={BOWL.x} y={BOWL.y} sc={0.92 + 0.08 * bowlIn} sy={1 - bowlSq} o={bowlIn}><BowlFlat size={BOWL.size} bloom={bloom} /></At>}
          {f >= 50 && brickO > 0.01 && <At x={540} y={brickY} sc={0.9} o={brickO}><BrickFlat size={340} /></At>}
          {steamK > 0.01 && <At x={540} y={690} o={0.9 * steamK}><SteamFlat size={380} k={1} t={f} /></At>}
          {ripple > 0 && ripple < 1 && (
            <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
              <ellipse cx={BROTH[0]} cy={BROTH[1]} rx={80 + 280 * ripple} ry={(80 + 280 * ripple) * 0.2} fill="none" stroke="#FFF1CC" strokeWidth={8 * (1 - ripple)} opacity={1 - ripple} />
            </svg>
          )}
        </div>
      </Bg>
      {/* ===== C/D (revealed by the bowl) ===== */}
      <AbsoluteFill style={{clipPath: `circle(${ir}px at ${BROTH[0]}px ${BROTH[1]}px)`}}>
        <Bg>
          <div style={{position: 'absolute', inset: 0, transform: `scale(${cScale})`, transformOrigin: `${BROTH[0]}px ${BROTH[1]}px`}}>
            <Eyebrow text="BAHAN" opacity={hC} />
            <Headline lines={['Modal bahan', fmtRp(DATA.modal)]} accent={['Rp', '7.000']} y={270} opacity={hC} dy={(1 - prog(f, 78, 86)) * 24} />
            <Eyebrow text="HITUNG UNTUNG" opacity={hD} />
            <Headline lines={['Untung ' + fmtRp(DATA.profit), 'per mangkuk']} accent={['Rp', '5.000']} y={250} size={72} opacity={hD} dy={(1 - hD) * 24} />
            <div style={{position: 'absolute', inset: 0, opacity: hD}}><ChartFlat modal={DATA.modal} price={DATA.price} gModal={gM} gPrice={gP} arrow={arrow} numOpacity={prog(f, 108, 114)} /></div>
            <At x={topX} y={topY} sc={topScale} origin="50% 50%"><BowlTopFlat size={800} ripple={prog(f, 76, 88)} toppings={tops as never} /></At>
            {calloutS > 0 && <Callout x={400} y={730} text={'+' + fmtRp(DATA.profit)} solid scale={calloutS} />}
          </div>
        </Bg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const DemoV6: React.FC = () => <DemoV6Core f={useCurrentFrame()} />;
