import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Layer, Motes, Plains, Scroll} from '../world/Savanna';
import {Dunes} from '../world/Desert';
import {SeaBand, SeaSky, Splash, Wellington} from '../world/Coast';
import {Castle, Cypress, nightGround, NightSky, nightRidge, Sweep, TunnelBG, TunnelDark} from '../world/Prison';
import {Cam, clamp, ease, easeOut, H, lerp, W} from '../world/util';
import {Actors, shakeAmp, Spec, talk} from '../fx/Battle';
import {Figure, FigureDefs} from '../rig/Figure';
import {digPose, handsUpPose, Pal, SideOpts, swimPose} from '../rig/Side';
import {kf} from '../rig/pose';
import {Post} from '../fx/Post';
import {ChapterCaption} from '../ui/Type';

const khaki: Pal = {skin: '#e0a880', hair: '#c9c9c4', top: '#a39c66', bottom: '#8e8858', belt: '#6f4122', boots: '#5a3a22'};
/** General de Wiart in 1941: grey, one eye, one hand — scars healed, no dressings */
export const heroWW2 = (face: 'left' | 'right', extra: Partial<SideOpts> = {}): SideOpts => ({pal: khaki, hero: true, patch: true, scars: true, stump: true, bandages: false, head: 'cap', hat: '#8a8458', mustache: true, gear: 'none', face, ...extra});
export const general2 = (face: 'left' | 'right', extra: Partial<SideOpts> = {}): SideOpts => ({pal: {...khaki, skin: '#d9a07a', hair: '#8a8a86', top: '#9a9468'}, head: 'cap', hat: '#8a8458', mustache: true, gear: 'none', face, stretch: 1.08, build: 0.92, ...extra});
export const italian = (face: 'left' | 'right'): SideOpts => ({pal: {skin: '#d9a07a', hair: '#2a1c14', top: '#7a8670', bottom: '#5e6a58', belt: '#2a1a10', boots: '#1d1109', puttee: '#6a7660'}, head: 'bustina', hat: '#6a7a62', gear: 'rifle', rifle: 'mauser', face, mustache: true});

const FPS = 24;
export const WW2_A = 120, WW2_B = 156, WW2_C = 132, WW2_D = 150;
export const WW2_FRAMES = WW2_A + WW2_B + WW2_C + WW2_D;

const Root: React.FC<{f: number; flash?: number; fadeIn?: boolean; fadeOut?: boolean; frames: number; grade?: string; night?: boolean; children: React.ReactNode}> = ({f, flash = 0, fadeIn, fadeOut, frames, grade, night, children}) => (
  <AbsoluteFill style={{background: '#000', filter: grade}}>
    {children}
    <Post f={f} flash={flash} night={night} fade={(fadeIn ? clamp(f / 12) : 1) * (fadeOut ? 1 - clamp((f - (frames - 8)) / 8) : 1)} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ A: Wellington ditches off Libya ------------------------------------------------------------------ */
export const Ww2Crash: React.FC = () => {
  const f = useCurrentFrame();
  const HIT = 84;
  const sh = shakeAmp(f, [{t: HIT, a: 16}]);
  const z = kf(f, [[0, 1.0], [HIT, 1.05], [WW2_A, 1.12]]);
  const cam: Cam = {x: Math.sin(f * 2.3) * sh, y: Math.cos(f * 2.9) * sh * 0.7, zoom: z, px: 1000, py: 720};
  const t = clamp(f / HIT), post = Math.max(0, f - HIT);
  const px = f < HIT ? lerp(-420, 1010, ease(t * 0.96 + 0.04 * t)) : 1010 + post * 1.2;
  const py = f < HIT ? lerp(300, 704, t * t * 0.7 + t * 0.3) : 704 + Math.min(post, 40) * 0.5 + Math.max(0, post - 40) * 1.6;
  const pitch = f < HIT ? lerp(3, 17, t) : lerp(17, 34, clamp(post / 40)) + Math.max(0, post - 40) * 0.2;
  const fire = clamp(1 - Math.max(0, post - 24) / 40);
  return (
    <Root f={f} frames={WW2_A} fadeIn grade="contrast(1.08) saturate(1.1)" flash={f >= HIT && f < HIT + 8 ? 0.4 * Math.exp(-(f - HIT) / 2) : 0}>
      <Layer cam={cam} depth={0.02}><SeaSky f={f} /></Layer>
      <Layer cam={cam} depth={0.05} blur={0.8}><Dunes seed={2} base={640} amp={20} haze={0.7} /></Layer>
      <Layer cam={cam} depth={0.1}><SeaBand f={f} y0={640} y1={692} k={0.02} off={f * 0.6} /></Layer>
      <Layer cam={cam} depth={0.2}><SeaBand f={f} y0={690} y1={760} k={0.25} off={f * 1.2} /></Layer>
      <Layer cam={cam} depth={0.35}><SeaBand f={f} y0={758} y1={850} k={0.45} off={f * 2} /></Layer>
      <Layer cam={cam} depth={0.5}>
        <g transform={`translate(${px} ${py}) rotate(${pitch}) scale(0.55)`}><Wellington f={f} fire={1} /></g>
        <Splash x={1090} y={742} age={f - HIT} r={150} />
        {f >= HIT + 10 && <g transform="translate(1400 772)"><Figure uid="sw0" x={0} y={0} s={0.1} o={heroWW2('right')} p={swimPose(f)} light="warm" lo shadow={0} /></g>}
      </Layer>
      <Layer cam={cam} depth={0.9}><FigureDefs /><SeaBand f={f} y0={812} y1={1100} k={0.85} off={f * 3} speed={1.4} /></Layer>
      <Layer cam={cam} depth={1.6} blur={3}><SeaBand f={f} y0={1030} y1={1200} k={1} off={f * 5} speed={1.8} /></Layer>
      <Layer cam={cam} depth={1.8} blur={2}><Motes f={f} seed={7} count={14} size={3} speed={2} /></Layer>
      <ChapterCaption f={f} title="LIBYA" sub="1941 · pesawatnya jatuh di laut" from={14} to={82} />
    </Root>
  );
};

/* ------------------------------------------------------------------ B: swims ashore and surrenders ------------------------------------------------------------------ */
export const Ww2Swim: React.FC = () => {
  const f = useCurrentFrame();
  const T = kf(f, [[0, 0], [70, 360], [132, 700], [200, 700]], false);
  const dT = (kf(f + 1, [[0, 0], [70, 360], [132, 700], [200, 700]], false) - kf(f - 1, [[0, 0], [70, 360], [132, 700], [200, 700]], false)) / 2;
  const cam: Cam = {x: 0, y: Math.sin(f * 0.35) * 2, zoom: 1.0 + f * 0.0003};
  const shore = 2250 - T * 1.0;
  const water = lerp(868, 1018, ease(clamp((f - 70) / 34)));
  const hero: Spec = {
    id: 'hero', o: heroWW2('right'), x: 620, y: 962, s: 0.567, face: 'right', mode: 'walk', fixed: true,
    pose: (ff, b) => {
      const sw = {...swimPose(ff), dy: 0};
      if (ff < 70) return sw;
      const k = ease(clamp((ff - 70) / 20));
      if (ff < 132) return {...b, fall: -(1 - k), uaN: (sw.uaN || 0) * (1 - k) + (b.uaN || 0) * k, uaF: (sw.uaF || 0) * (1 - k) + (b.uaF || 0) * k, head: (b.head || 0) - 10 * (1 - k), sling: false};
      const up = ease(clamp((ff - 132) / 10));
      return {...b, uaN: (b.uaN || 0) * (1 - up) + (-168) * up, faN: (b.faN || 0) * (1 - up) - 6 * up, uaF: (b.uaF || 0) * (1 - up) + (-160) * up, faF: (b.faF || 0) * (1 - up) - 10 * up, thN: (b.thN || 0) * (1 - up), thF: (b.thF || 0) * (1 - up), shN: (b.shN || 0) * (1 - up), shF: (b.shF || 0) * (1 - up), dy: 0, mouth: 0.1, sling: false};
    },
  };
  const guards: Spec[] = [2100, 2250, 2400, 2560].map((x, i) => ({id: `it${i}`, o: {...italian('left'), build: [0.95, 1.12, 0.88, 1.05][i], stretch: [1, 0.95, 1.06, 0.98][i]}, x, y: 962 - (i % 2) * 6, s: 0.567, face: 'left' as const, mode: 'aim' as const, fireFrom: i === 1 ? 108 : 118 + i * 3, fireTo: i === 1 ? 118 : 160, period: 16, aim: () => (i === 1 ? [900, 250] : [800, 900]) as [number, number]}));
  return (
    <Root f={f} frames={WW2_B} grade="contrast(1.08) saturate(1.05)" fadeOut>
      <Layer cam={cam} depth={0.02}><SeaSky f={f} /></Layer>
      <Layer cam={cam} depth={0.05}><Dunes seed={2} base={640} amp={22} haze={0.7} /></Layer>
      <Layer cam={cam} depth={0.1}><SeaBand f={f} y0={640} y1={692} k={0.02} off={T * 0.1} /></Layer>
      <Layer cam={cam} depth={0.2}><SeaBand f={f} y0={690} y1={760} k={0.25} off={T * 0.3} /></Layer>
      <Layer cam={cam} depth={0.35}><SeaBand f={f} y0={758} y1={850} k={0.45} off={T * 0.55} /></Layer>
      <Layer cam={cam} depth={0.6}><SeaBand f={f} y0={840} y1={940} k={0.62} off={T * 0.8} /></Layer>
      {/* the beach: wet sand, foam line at the water's edge */}
      <Layer cam={cam} depth={0.9}>
        <defs><linearGradient id="sand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#caa26a" /><stop offset=".2" stopColor="#e6c88c" /><stop offset="1" stopColor="#e9d09a" /></linearGradient></defs>
        <path d={`M${shore} 700 Q${shore - 60} 800 ${shore - 20} 900 Q${shore - 90} 1000 ${shore} 1100 L${W + 1400} 1100 L${W + 1400} 700 Z`} fill="url(#sand)" />
        <path d={`M${shore - 6} 700 Q${shore - 66} 800 ${shore - 26} 900 Q${shore - 96} 1000 ${shore - 6} 1100`} stroke="#f4fafc" strokeWidth="14" fill="none" opacity=".75" />
        <path d={`M${shore + 20} 720 Q${shore - 40} 810 ${shore} 900 Q${shore - 60} 1000 ${shore + 14} 1090`} stroke="#8a6a44" strokeWidth="10" fill="none" opacity=".35" />
      </Layer>
      <Layer cam={cam} depth={1.0}><Actors specs={[hero, ...guards]} f={f} camT={T} depth={1} dT={dT} lights={[]} /></Layer>
      <Layer cam={cam} depth={1.0} opacity={0.62}><SeaBand f={f} y0={water} y1={1200} k={0.92} off={T} speed={1.5} /></Layer>
      <Layer cam={cam} depth={1.7} blur={3}><SeaBand f={f} y0={1040} y1={1200} k={1} off={T * 1.4} speed={2} /></Layer>
      <ChapterCaption f={f} title="DITAWAN" sub="berenang ke pantai, ditangkap tentara Italia" from={96} to={150} />
    </Root>
  );
};

/* ------------------------------------------------------------------ C: the tunnel ------------------------------------------------------------------ */
export const Ww2Tunnel: React.FC = () => {
  const f = useCurrentFrame();
  const BREAK = 98;
  const cam: Cam = {x: 0, y: 0, zoom: 1.0 + f * 0.0004, px: 980, py: 640};
  const diggers: Spec[] = [
    {id: 'h', o: heroWW2('right', {gear: 'spade'}), x: 1420, y: 1004, s: 0.5, face: 'right', mode: 'kneel', pose: (ff, b) => ({...digPose(ff, 0), mouth: talk(ff, 60, 96), head: ff > BREAK ? -18 : 14, brow: -0.3})},
    {id: 'g2', o: general2('right', {gear: 'spade'}), x: 1040, y: 1004, s: 0.5, face: 'right', mode: 'kneel', pose: (ff) => ({...digPose(ff, 2.2), head: ff > BREAK ? -16 : 14})},
    {id: 'c1', o: general2('left'), x: 0, y: 1012, s: 0.5, face: 'left', mode: 'idle', dieAt: -100, die: 'crawl', xf: (ff) => 880 - ff * 2.4, lo: false},
    {id: 'c2', o: heroWW2('left', {stump: false, patch: false, young: false}), x: 0, y: 1012, s: 0.5, face: 'left', mode: 'idle', dieAt: -100, die: 'crawl', xf: (ff) => 520 - ff * 2.4, lo: false},
  ];
  const rg = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;
  return (
    <Root f={f} frames={WW2_C} grade="contrast(1.12) saturate(.9) sepia(.12)" fadeIn fadeOut night>
      <Layer cam={cam} depth={0.9}><TunnelBG f={f} scroll={f * 0.4} /></Layer>
      {/* the face being dug: soil wall that crumbles at the breakthrough */}
      <Layer cam={cam} depth={1}>
        <path d={`M1700 470 L${2300} 470 L2300 1010 L1700 1010 Z`} fill="#3a281a" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M${1700 + rg(i) * 200} ${500 + i * 62} l${60 + rg(i + 3) * 120} ${rg(i + 1) * 20 - 10}`} stroke="#6a5038" strokeWidth="5" opacity=".6" />)}
        {f >= BREAK && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => { const a = f - BREAK, vx = (rg(i) - 0.2) * -9, vy = -(4 + rg(i + 5) * 10); return <rect key={'ch' + i} x={1700 + rg(i + 2) * 90 + vx * a} y={560 + rg(i + 1) * 360 + vy * a + 0.5 * 1.3 * a * a} width={30 + rg(i) * 40} height={22 + rg(i + 4) * 30} fill={i % 2 ? '#5a4128' : '#3a281a'} opacity={clamp(1.4 - a / 40)} transform={`rotate(${a * (rg(i) * 14 - 4)} ${1720} ${700})`} />; })}
        <Actors specs={diggers} f={f} />
        {Array.from({length: 22}, (_, i) => { const k = ((f * 0.9 + i * 11) % 60) / 60; return <circle key={'dr' + i} cx={1500 + rg(i) * 200} cy={500 + k * 420} r={1.6 + rg(i + 2) * 2} fill="#8a6a46" opacity={0.7 * (1 - k)} />; })}
      </Layer>
      {f >= BREAK && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen'}}>
          <defs><linearGradient id="brk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e6f0ff" stopOpacity=".95" /><stop offset="1" stopColor="#e6f0ff" stopOpacity="0" /></linearGradient></defs>
          <polygon points={`1740,0 1880,0 ${1900 + (f - BREAK) * 2},760 1680,760`} fill="url(#brk)" opacity={easeOut((f - BREAK) / 10)} />
        </svg>
      )}
      <TunnelDark f={f} />
      <Layer cam={cam} depth={1.5} blur={3}><Motes f={f} seed={14} count={18} size={3} speed={0.6} /></Layer>
      <ChapterCaption f={f} title="ITALIA" sub="penjara kastil · terowongan sepanjang berbulan-bulan" from={10} to={88} />
    </Root>
  );
};

/* ------------------------------------------------------------------ D: the escape and the recapture ------------------------------------------------------------------ */
export const Ww2Night: React.FC = () => {
  const f = useCurrentFrame();
  const STOP = 86;
  const T = kf(f, [[0, 0], [STOP, 800], [200, 800]], false);
  const dT = (kf(f + 1, [[0, 0], [STOP, 800], [200, 800]], false) - kf(f - 1, [[0, 0], [STOP, 800], [200, 800]], false)) / 2;
  const sh = shakeAmp(f, [{t: 90, a: 8}]);
  const camFar: Cam = {x: T + Math.sin(f * 2.3) * sh, y: Math.cos(f * 2.9) * sh * 0.6, zoom: 1.0 + f * 0.0003};
  const cam0: Cam = {x: Math.sin(f * 2.3) * sh, y: Math.sin(f * 0.35) * 1.5, zoom: 1.0 + f * 0.0003};
  const ridgeA = nightRidge(7, 690, 36, 0.7), ridgeB = nightRidge(13, 712, 44, 0.5);
  const spotOn = clamp((f - 78) / 8);
  const runners: Spec[] = [
    {id: 'hero', o: heroWW2('right', {head: 'cap'}), x: 760, y: 962, s: 0.567, face: 'right', mode: 'run', fixed: true, stopAt: STOP, after: 'idle', pose: (ff, b) => (ff >= 96 ? {...b, ...handsUpPose(ff / 8), mouth: 0.1} : ff >= STOP ? {...b, sling: false} : {...b, torso: (b.torso || 0) + 8, sling: false})},
    {id: 'o2', o: general2('right'), x: 540, y: 962, s: 0.567, face: 'right', mode: 'run', fixed: true, stopAt: STOP - 3, after: 'idle', pose: (ff, b) => (ff >= 98 ? {...b, ...handsUpPose(ff / 8 + 1)} : {...b, sling: false, torso: (b.torso || 0) + 8})},
  ];
  const chasers: Spec[] = [0, 1, 2].map((i) => ({id: `ch${i}`, o: {...italian('right'), build: [1.0, 1.12, 0.9][i], stretch: [1, 0.96, 1.05][i]}, x: -300 - i * 150, y: 962, s: 0.567, face: 'right' as const, mode: 'run' as const, vx: 14.2 - i * 0.2, fixed: false, stopAt: STOP + 6, after: 'aim' as const, fireFrom: 92 + i * 4, period: 15, aim: () => [900, 250] as [number, number], pose: (_ff: number, b: any) => ({...b, sling: false})}));
  const blockers: Spec[] = [2150, 2330].map((x, i) => ({id: `bl${i}`, o: {...italian('left'), build: [1.08, 0.92][i]}, x, y: 962, s: 0.567, face: 'left' as const, mode: 'aim' as const, fireFrom: 90 + i * 5, period: 16, aim: () => [1000, 260] as [number, number]}));
  return (
    <Root f={f} frames={WW2_D} fadeIn fadeOut night grade="contrast(1.14) saturate(.85) hue-rotate(-4deg)" flash={0}>
      <Layer cam={camFar} depth={0.02}><NightSky f={f} /></Layer>
      <Layer cam={camFar} depth={0.1} blur={0.8}><Castle f={f} x={420} y={760} s={0.8} haze={0.62} /></Layer>
      <Layer cam={camFar} depth={0.1} blend="screen" opacity={0.9}><Sweep f={f} x={420 - 40} y={760 - 400} phase={0} spread={0.55} /><Sweep f={f} x={420 + 160} y={760 - 330} phase={2.2} spread={0.5} /></Layer>
      <Layer cam={camFar} depth={0.18}><path d={ridgeA.rd.fill} fill={ridgeA.fill} /><path d={ridgeA.rd.top} stroke={ridgeA.rim} strokeWidth="1.5" fill="none" opacity=".35" /></Layer>
      <Layer cam={camFar} depth={0.26}><path d={ridgeB.rd.fill} fill={ridgeB.fill} /><path d={ridgeB.rd.top} stroke={ridgeB.rim} strokeWidth="1.5" fill="none" opacity=".3" /></Layer>
      <Layer cam={camFar} depth={0.28}><Plains seed={31} y0={700} y1={800} count={360} haze0={0.6} haze1={0.45} colorAt={nightGround} haze="#1a2840" /></Layer>
      <Layer cam={cam0} depth={0.5}>
        <Scroll off={T * 0.5}><Plains seed={32} y0={770} y1={880} count={380} haze0={0.4} haze1={0.28} fade={1} colorAt={nightGround} haze="#1a2840" /></Scroll>
        <Scroll off={T * 0.5} P={3000}>{[260, 700, 1180, 1700, 2300].map((x, i) => <Cypress key={i} x={x} y={846} s={0.7 + (i % 2) * 0.2} haze={0.4} seed={i + 3} />)}</Scroll>
      </Layer>
      <Layer cam={cam0} depth={0.78}><Scroll off={T * 0.78}><Plains seed={33} y0={850} y1={960} count={420} haze0={0.2} haze1={0.1} fade={1} colorAt={nightGround} haze="#1a2840" /></Scroll></Layer>
      <Layer cam={cam0} depth={1.0}>
        <Scroll off={T}><Plains seed={34} y0={930} y1={1080} count={420} haze0={0.1} haze1={0} fade={1} colorAt={nightGround} haze="#1a2840" /></Scroll>
        <Actors specs={[...chasers, ...runners, ...blockers]} f={f} camT={T} depth={1} dT={dT} lights={f >= 78 ? [{x: 760, y: 700, k: 0.95 * spotOn, color: '#dfe8ff'}] : []} />
      </Layer>
      {/* searchlight finds them: a pool of white light on the ground and the figures */}
      {spotOn > 0 && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen'}}>
          <defs><radialGradient id="pool" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#eaf0ff" stopOpacity=".7" /><stop offset="1" stopColor="#c8d6ff" stopOpacity="0" /></radialGradient></defs>
          <ellipse cx={700} cy={990} rx={720} ry={150} fill="url(#pool)" opacity={spotOn} />
          <polygon points="600,0 800,0 960,990 460,990" fill="#e6eeff" opacity={0.12 * spotOn} style={{filter: 'blur(20px)'}} />
        </svg>
      )}
      <Layer cam={cam0} depth={1.6} blur={4}><Scroll off={T * 1.6}>{[400, 1500, 2600].map((x, i) => <Cypress key={i} x={x} y={1120} s={1.8} haze={0.1} seed={i + 9} />)}</Scroll></Layer>
      <Layer cam={cam0} depth={1.7} blur={2}><Motes f={f} seed={19} count={16} size={3} speed={1.4} /></Layer>
      <ChapterCaption f={f} title="HARI KE-8" sub="tertangkap kembali di perbukitan Italia" from={96} to={146} />
    </Root>
  );
};

export const WW2Chapter: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={WW2_A}><Ww2Crash /></Sequence>
    <Sequence from={WW2_A} durationInFrames={WW2_B}><Ww2Swim /></Sequence>
    <Sequence from={WW2_A + WW2_B} durationInFrames={WW2_C}><Ww2Tunnel /></Sequence>
    <Sequence from={WW2_A + WW2_B + WW2_C} durationInFrames={WW2_D}><Ww2Night /></Sequence>
  </AbsoluteFill>
);
void FPS; void easeOut;
