import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Layer, Motes, Plains, Scroll} from '../world/Savanna';
import {Dunes} from '../world/Desert';
import {SeaBand, SeaSky, Splash, SwimFx, Wellington} from '../world/Coast';
import {Castle, Cypress, nightGround, NightSky, nightRidge, Sweep, TunnelBG, TunnelDark} from '../world/Prison';
import {Cam, clamp, ease, easeOut, H, lerp, W} from '../world/util';
import {Actors, shakeAmp, Spec, talk} from '../fx/Battle';
import {Figure, FigureDefs} from '../rig/Figure';
import {digPose, handsUpPose, kneelPose, Pal, SideOpts, swimPose} from '../rig/Side';
import {kf} from '../rig/pose';
import {Post} from '../fx/Post';
import {ChapterCaption} from '../ui/Type';

const khaki: Pal = {skin: '#e0a880', hair: '#c9c9c4', top: '#a39c66', bottom: '#8e8858', belt: '#6f4122', boots: '#5a3a22'};
/** General de Wiart in 1941: grey, one eye, one hand — scars healed, no dressings */
export const heroWW2 = (face: 'left' | 'right', extra: Partial<SideOpts> = {}): SideOpts => ({pal: khaki, hero: true, patch: true, scars: true, stump: true, bandages: false, head: 'cap', hat: '#8a8458', mustache: true, gear: 'none', face, ...extra});
export const general2 = (face: 'left' | 'right', extra: Partial<SideOpts> = {}): SideOpts => ({pal: {...khaki, skin: '#d9a07a', hair: '#8a8a86', top: '#9a9468'}, head: 'cap', hat: '#8a8458', mustache: true, gear: 'none', face, stretch: 1.08, build: 0.92, ...extra});
export const italian = (face: 'left' | 'right'): SideOpts => ({pal: {skin: '#d9a07a', hair: '#2a1c14', top: '#7a8670', bottom: '#5e6a58', belt: '#2a1a10', boots: '#1d1109', puttee: '#6a7660'}, head: 'bustina', hat: '#6a7a62', gear: 'rifle', rifle: 'mauser', face, mustache: true});

const FPS = 24;
export const WW2_A = 120, WW2_B = 180, WW2_K = 60, WW2_C = 132, WW2_D = 180;
export const WW2_FRAMES = WW2_A + WW2_B + WW2_K + WW2_C + WW2_D;

const Root: React.FC<{f: number; flash?: number; fadeIn?: boolean; fadeOut?: boolean; frames: number; grade?: string; night?: boolean; children: React.ReactNode}> = ({f, flash = 0, fadeIn, fadeOut, frames, grade, night, children}) => (
  <AbsoluteFill style={{background: '#000', filter: grade}}>
    {children}
    <Post f={f} flash={flash} night={night} fade={(fadeIn ? clamp(f / 12) : 1) * (fadeOut ? 1 - clamp((f - (frames - 8)) / 8) : 1)} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ A: the Wellington ditches (flat touchdown, slides, floats, the crew climbs out) ------------------------------------------------------------------ */
export const Ww2Crash: React.FC = () => {
  const f = useCurrentFrame();
  const HIT = 84;
  const sh = shakeAmp(f, [{t: HIT, a: 14}]);
  const cam: Cam = {x: Math.sin(f * 2.3) * sh, y: Math.cos(f * 2.9) * sh * 0.7, zoom: kf(f, [[0, 1.0], [HIT, 1.04], [WW2_A, 1.1]]), px: 1000, py: 720};
  const t = clamp(f / HIT), post = Math.max(0, f - HIT);
  const slide = 190 * (1 - Math.exp(-post / 16));                                   // skids along the surface, slowing down
  const px = f < HIT ? lerp(-460, 860, ease(t)) : 860 + slide;
  const py = f < HIT ? lerp(330, 716, Math.pow(t, 1.5)) : 716 + Math.max(0, post - 34) * 0.9;
  const pitch = f < HIT ? lerp(2, 7, t) : 7 + Math.min(1, Math.max(0, post - 30) / 60) * 16;   // flares, then the tail sinks first
  const fire = clamp(1 - Math.max(0, post - 30) / 40);
  // the crew climbs out onto the wing, then drops into the water and starts to swim
  const climb = clamp((post - 12) / 26), drop = clamp((post - 40) / 8);
  const sx = lerp(px + 20, px + 150, climb) + drop * 190, sy = lerp(py - 90 * 0.55, py + 150 * 0.55, climb) + drop * 20;
  return (
    <Root f={f} frames={WW2_A} fadeIn grade="contrast(1.08) saturate(1.1)" flash={f >= HIT && f < HIT + 6 ? 0.28 * Math.exp(-(f - HIT) / 2) : 0}>
      <Layer cam={cam} depth={0.02}><SeaSky f={f} /></Layer>
      <Layer cam={cam} depth={0.05} blur={0.8}><Dunes seed={2} base={640} amp={20} haze={0.7} /></Layer>
      <Layer cam={cam} depth={0.1}><SeaBand f={f} y0={640} y1={692} k={0.02} off={f * 0.6} /></Layer>
      <Layer cam={cam} depth={0.2}><SeaBand f={f} y0={690} y1={760} k={0.25} off={f * 1.2} /></Layer>
      <Layer cam={cam} depth={0.35}><SeaBand f={f} y0={758} y1={850} k={0.45} off={f * 2} /></Layer>
      <Layer cam={cam} depth={0.5}>
        <g transform={`translate(${px} ${py}) rotate(${pitch}) scale(0.55)`}><Wellington f={f} fire={fire > 0 ? 1 : 0} /></g>
        <Splash x={px + 150} y={752} age={f - HIT} r={130} />
        {f >= HIT + 12 && <g transform={`translate(${sx} ${sy})`}><Figure uid="sw0" x={0} y={0} s={0.12} o={heroWW2('right')} p={drop > 0 ? swimPose(f) : {...handsUpPose(f), uaN: -70, uaF: -60}} light="warm" lo shadow={0} /></g>}
        {drop > 0 && <SwimFx x={sx + 40} y={sy + 6} f={f} s={0.2} />}
      </Layer>
      <Layer cam={cam} depth={0.9}><SeaBand f={f} y0={812} y1={1100} k={0.85} off={f * 3} speed={1.4} /></Layer>
      <Layer cam={cam} depth={1.6} blur={3}><SeaBand f={f} y0={1030} y1={1200} k={1} off={f * 5} speed={1.8} /></Layer>
      <Layer cam={cam} depth={1.8} blur={2}><Motes f={f} seed={7} count={14} size={3} speed={2} /></Layer>
      <ChapterCaption f={f} title="LIBYA" sub="1941 · pesawatnya mendarat darurat di laut" from={14} to={82} />
    </Root>
  );
};

/* ------------------------------------------------------------------ B: swims to the beach, wades in, is surrounded and surrenders ------------------------------------------------------------------ */
export const Ww2Swim: React.FC = () => {
  const f = useCurrentFrame();
  const Tf = (ff: number) => kf(ff, [[0, 0], [88, 430], [400, 430]], false);
  const T = Tf(f), dT = (Tf(f + 1) - Tf(f - 1)) / 2;
  const cam: Cam = {x: 0, y: Math.sin(f * 0.35) * 2, zoom: 1.0 + f * 0.0003};
  const shore = 1760 - T;                                           // world sand edge on screen
  const SW = 884;                                                   // waterline while swimming (body centre line)
  const water = lerp(SW, 1024, ease(clamp((f - 84) / 26)));
  const walkX = kf(f, [[0, 0], [100, 0], [150, 470], [400, 470]], true);
  const hx = 620 + walkX;
  const hero: Spec = {
    id: 'hero', o: heroWW2('right'), x: 0, y: 962, s: 0.567, face: 'right', mode: 'walk', vx: 3.6, stopAt: 150, after: 'idle',
    xf: (ff) => 620 + Tf(ff) + kf(ff, [[0, 0], [100, 0], [150, 470], [400, 470]], true),
    pose: (ff, b) => {
      const sw = {...swimPose(ff), dy: 0};
      if (ff < 84) return {...sw, mouth: ff % 30 < 6 ? 0.5 : 0};
      const k = ease(clamp((ff - 84) / 18));
      if (ff < 132) return {...b, fall: -(1 - k), uaN: (sw.uaN || 0) * (1 - k) + (b.uaN || 0) * k, uaF: (sw.uaF || 0) * (1 - k) + (b.uaF || 0) * k, head: (b.head || 0) - 10 * (1 - k) + 6, sling: false, brow: -0.2, mouth: 0.25 * (1 - k)};
      const up = ease(clamp((ff - 132) / 10));
      return {...b, uaN: (b.uaN || 0) * (1 - up) - 168 * up, faN: (b.faN || 0) * (1 - up) - 6 * up, uaF: (b.uaF || 0) * (1 - up) - 160 * up, faF: (b.faF || 0) * (1 - up) - 10 * up, thN: (b.thN || 0) * (1 - up), thF: (b.thF || 0) * (1 - up), shN: (b.shN || 0) * (1 - up), shF: (b.shF || 0) * (1 - up), dy: 0, mouth: 0.12, grimace: 0.3, sling: false};
    },
  };
  // a ragged group on the sand — an officer shouting, two covering him, one warning shot, one walking up with his rifle slung
  const adv = (x0: number, v = 1.5) => (ff: number) => x0 - Math.max(0, ff - 96) * v * 1.6;
  const guards: Spec[] = [
    {id: 'it0', o: {...italian('left'), build: 0.96}, x: 0, y: 958, s: 0.56, face: 'left', mode: 'aim', fireFrom: 118, fireTo: 124, period: 22, aim: () => [900, 880], xf: adv(1990), lo: false},
    {id: 'it1', o: {...italian('left'), build: 1.12, stretch: 0.96}, x: 0, y: 972, s: 0.58, face: 'left', mode: 'aim', fireFrom: 106, fireTo: 112, period: 30, aim: () => [820, 230], xf: adv(2120, 1.2), lo: false},
    {id: 'it2', o: {...italian('left'), build: 0.9, stretch: 1.05, head: 'cap'}, x: 0, y: 966, s: 0.57, face: 'left', mode: 'idle', xf: adv(2260, 1.0), lo: false, pose: (ff, b) => ({...b, uaN: -84, faN: -14, uaF: 10, mouth: talk(ff, 96, 160), brow: -0.4})},
    {id: 'it3', o: {...italian('left'), build: 1.04}, x: 0, y: 960, s: 0.56, face: 'left', mode: 'walk', vx: 1.5, xf: adv(2060, 1.8), stopAt: 170, after: 'aim', fireFrom: 400, period: 20, lo: false, aim: () => [900, 900], pose: (ff, b) => (ff < 170 ? b : {...b, sling: false})},
    {id: 'it4', o: {...italian('left'), build: 0.92, stretch: 1.03}, x: 0, y: 975, s: 0.58, face: 'left', mode: 'aim', fireFrom: 130, period: 24, aim: () => [880, 900], xf: adv(2380, 0.9), lo: false},
  ];
  return (
    <Root f={f} frames={WW2_B} grade="contrast(1.08) saturate(1.05)" fadeOut>
      <Layer cam={cam} depth={0.02}><SeaSky f={f} /></Layer>
      {/* the burning wreck far behind: black smoke still rising from the sea */}
      <Layer cam={cam} depth={0.1}>
        {Array.from({length: 8}, (_, i) => { const k = ((f * 0.35 + i * 18) % 144) / 144; return <ellipse key={i} cx={160 + k * 90 + Math.sin(i) * 20 - T * 0.02} cy={650 - k * 330} rx={30 + k * 100} ry={24 + k * 70} fill="#1a1412" opacity={0.7 * (1 - k)} style={{filter: 'blur(12px)'}} />; })}
        <circle cx={160 - T * 0.02} cy={648} r={14} fill="#ff9a3a" opacity={0.7} style={{filter: 'blur(4px)'}} />
      </Layer>
      <Layer cam={cam} depth={0.05}><Dunes seed={2} base={640} amp={22} haze={0.7} /></Layer>
      <Layer cam={cam} depth={0.1}><SeaBand f={f} y0={640} y1={692} k={0.02} off={T * 0.1} /></Layer>
      <Layer cam={cam} depth={0.2}><SeaBand f={f} y0={690} y1={760} k={0.25} off={T * 0.3} /></Layer>
      <Layer cam={cam} depth={0.35}><SeaBand f={f} y0={758} y1={850} k={0.45} off={T * 0.55} /></Layer>
      <Layer cam={cam} depth={0.6}><SeaBand f={f} y0={840} y1={940} k={0.62} off={T * 0.8} /></Layer>
      {/* the beach: dry sand, darker wet strip, foam line that follows the water's edge; soldiers' boots stand on the dry sand */}
      <Layer cam={cam} depth={0.9}>
        <defs><linearGradient id="sand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b8905a" /><stop offset=".08" stopColor="#d6b47c" /><stop offset=".3" stopColor="#e6c88c" /><stop offset="1" stopColor="#e9d09a" /></linearGradient></defs>
        <path d={`M${shore} 660 Q${shore - 40} 780 ${shore - 10} 880 Q${shore - 70} 990 ${shore - 6} 1100 L${W + 1400} 1100 L${W + 1400} 660 Z`} fill="url(#sand)" />
        <path d={`M${shore} 660 Q${shore - 40} 780 ${shore - 10} 880 Q${shore - 70} 990 ${shore - 6} 1100 L${shore + 90} 1100 Q${shore + 20} 990 ${shore + 80} 880 Q${shore + 50} 780 ${shore + 70} 660 Z`} fill="#8a6a44" opacity=".35" />
        <path d={`M${shore - 6} 660 Q${shore - 46} 780 ${shore - 16} 880 Q${shore - 76} 990 ${shore - 12} 1100`} stroke="#f4fafc" strokeWidth="13" fill="none" opacity=".8" />
      </Layer>
      <Layer cam={cam} depth={1.0}><Actors specs={[hero, ...guards]} f={f} camT={T} depth={1} dT={dT} /></Layer>
      {/* swimmer's wake, then the water in front of the body (half-submerged) */}
      {f < 96 && <Layer cam={cam} depth={1.0}><SwimFx x={hx + 60} y={SW + 4} f={f} s={1} /></Layer>}
      <Layer cam={cam} depth={1.0} opacity={0.74}>
        <defs><linearGradient id="wfront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4f7a96" /><stop offset="1" stopColor="#12304a" /></linearGradient></defs>
        <rect x={-900} y={water - 4} width={W + 1800 - (W - shore) * 0} height={Math.max(0, 1200 - water)} fill="url(#wfront)" opacity={0} />
        <SeaBand f={f} y0={water} y1={1200} k={0.92} off={T} speed={1.5} />
        <path d={`M-900 ${water} ${Array.from({length: 60}, (_, i) => `L${-900 + i * 60} ${water + Math.sin(i * 0.9 + f * 0.18) * 5}`).join(' ')}`} stroke="#eaf6fa" strokeWidth="5" fill="none" opacity=".75" />
      </Layer>
      {f >= 96 && <Layer cam={cam} depth={1.0}><SwimFx x={hx + 20} y={1004} f={f} s={0.5} /></Layer>}
      <Layer cam={cam} depth={1.7} blur={3}><SeaBand f={f} y0={1040} y1={1200} k={1} off={T * 1.4} speed={2} /></Layer>
      <ChapterCaption f={f} title="DITAWAN" sub="berenang ke pantai, dikepung tentara Italia" from={110} to={168} />
    </Root>
  );
};

/* ------------------------------------------------------------------ K: the castle they are taken to ------------------------------------------------------------------ */
export const Ww2Castle: React.FC = () => {
  const f = useCurrentFrame();
  const rise = ease(clamp(f / WW2_K));
  const cam: Cam = {x: lerp(-60, 40, rise), y: lerp(160, -120, rise), zoom: lerp(1.0, 1.1, rise)};
  const wall = Array.from({length: 4}, (_, i) => ({x: 300 + i * 360 + ((f * 1.2 + i * 90) % 140), i}));
  return (
    <Root f={f} frames={WW2_K} night fadeIn fadeOut grade="contrast(1.12) saturate(.85)">
      <Layer cam={cam} depth={0.02}><NightSky f={f} /></Layer>
      <Layer cam={cam} depth={0.3}>
        <Castle f={f} x={760} y={900} s={1.5} haze={0.5} />
        <Sweep f={f} x={760 - 70} y={900 - 560} phase={0} spread={0.6} /><Sweep f={f} x={760 + 190} y={900 - 480} phase={2.2} spread={0.5} />
        <FigureDefs />
        {wall.map((w) => <Figure key={w.i} uid={`pt${w.i}`} x={560 + (w.x % 520)} y={900 - 450 * 1.5 * 0.5 + 6} s={0.07} o={italian(w.i % 2 ? 'right' : 'left')} p={{thN: 18 * Math.sin(f * 0.2 + w.i), thF: -18 * Math.sin(f * 0.2 + w.i), uaN: -30, faN: -20}} light="night" lo shadow={0} />)}
      </Layer>
      <Layer cam={cam} depth={0.8}><path d="M-900 1100 Q500 960 1900 1010 L2800 1100 Z" fill="#0b1322" /><path d="M-900 1100 Q500 960 1900 1010" stroke="#5a6c98" strokeWidth="4" fill="none" opacity=".5" /></Layer>
      <Layer cam={cam} depth={1.2} blur={3}>{[300, 1500].map((x, i) => <Cypress key={i} x={x} y={1180} s={2.2} haze={0.1} seed={i + 4} />)}</Layer>
      <ChapterCaption f={f} title="KASTIL VINCIGLIATA" sub="Italia · 1941 – 1943, tawanan perang" from={10} to={52} />
    </Root>
  );
};

/* ------------------------------------------------------------------ C: the tunnel — diggers at the face, a loader behind them, sacks hauled to the shaft and hoisted up ------------------------------------------------------------------ */
export const Ww2Tunnel: React.FC = () => {
  const f = useCurrentFrame();
  const BREAK = 104;
  const cam: Cam = {x: 0, y: 0, zoom: 1.0 + f * 0.0004, px: 980, py: 640};
  const rg = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;
  const cyc = (ff: number, per: number, off = 0) => ((ff * 2.6 + off) % per);
  const lit = {pal: undefined as any};
  void lit;
  const diggers: Spec[] = [
    {id: 'h', o: heroWW2('right', {gear: 'spade'}), x: 1430, y: 1004, s: 0.5, face: 'right', mode: 'kneel', pose: (ff) => ({...digPose(ff, 0), mouth: talk(ff, 64, 100), head: ff > BREAK ? -20 : 12, brow: -0.3})},
    {id: 'g2', o: general2('right', {gear: 'spade'}), x: 1190, y: 1004, s: 0.5, face: 'right', mode: 'kneel', pose: (ff) => ({...digPose(ff, 2.4), head: ff > BREAK ? -18 : 12})},
    // loader: kneels at the heap and fills a sack with what the diggers pass back
    {id: 'ld', o: general2('right', {stretch: 1.0}), x: 930, y: 1004, s: 0.5, face: 'right', mode: 'kneel', pose: (ff) => ({...kneelPoseLoad(ff)})},
    // hauler 1: crawls LEFT towards the shaft dragging a full sack; hauler 2: crawls RIGHT back with an empty one
    {id: 'c1', o: heroWW2('left', {stump: false, patch: false, young: false, mustache: false}), x: 0, y: 1012, s: 0.5, face: 'left', mode: 'idle', dieAt: -100, die: 'crawl', xf: (ff) => 860 - cyc(ff, 680), lo: false},
    {id: 'c2', o: general2('right'), x: 0, y: 1012, s: 0.5, face: 'right', mode: 'idle', dieAt: -100, die: 'crawl', xf: (ff) => 180 + cyc(ff, 680, 300), lo: false},
  ];
  const sackY = ((f * 3.2) % 520);
  return (
    <Root f={f} frames={WW2_C} grade="contrast(1.06) saturate(.95) sepia(.1)" fadeIn fadeOut night>
      <Layer cam={cam} depth={0.9}><TunnelBG f={f} scroll={f * 0.4} /></Layer>
      <Layer cam={cam} depth={1}>
        {/* sack going up the shaft on its rope */}
        <path d="M110 -100 V" stroke="#6a4a2a" strokeWidth="4" />
        <g transform={`translate(110 ${440 - sackY})`}><path d="M0 -600 V-28" stroke="#8a6a3a" strokeWidth="5" /><ellipse cx={0} cy={0} rx={34} ry={44} fill="#a08a62" stroke="#2a1c10" strokeWidth="3" /><path d="M-14 -34 Q0 -48 14 -34" stroke="#2a1c10" strokeWidth="3" fill="none" /></g>
        {/* the face being dug: solid earth that crumbles at the breakthrough */}
        <path d="M1700 470 L2300 470 L2300 1010 L1700 1010 Z" fill="#3a281a" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M${1700 + rg(i) * 200} ${500 + i * 62} l${60 + rg(i + 3) * 120} ${rg(i + 1) * 20 - 10}`} stroke="#6a5038" strokeWidth="5" opacity=".6" />)}
        {/* heap of loose soil between diggers and loader, with sacks stacked beside it */}
        <path d="M1040 1008 Q1090 930 1170 920 Q1250 934 1300 1008 Z" fill="#4a3624" stroke="#1a1008" strokeWidth="3" />
        {[0, 1, 2].map((i) => <g key={i}><ellipse cx={780 + i * 46} cy={982 - (i % 2) * 22} rx={34} ry={26} fill="#a08a62" stroke="#2a1c10" strokeWidth="3" /><path d={`M${766 + i * 46} ${962 - (i % 2) * 22} q14 -14 28 0`} stroke="#2a1c10" strokeWidth="3" fill="none" /></g>)}
        {f >= BREAK && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => { const a = f - BREAK, vx = (rg(i) - 0.2) * -9, vy = -(4 + rg(i + 5) * 10); return <rect key={'ch' + i} x={1700 + rg(i + 2) * 90 + vx * a} y={560 + rg(i + 1) * 360 + vy * a + 0.5 * 1.3 * a * a} width={30 + rg(i) * 40} height={22 + rg(i + 4) * 30} fill={i % 2 ? '#5a4128' : '#3a281a'} opacity={clamp(1.4 - a / 40)} transform={`rotate(${a * (rg(i) * 14 - 4)} ${1720} ${700})`} />; })}
        {/* sacks dragged behind the hauler going left (full) and the empty one coming back */}
        <g transform={`translate(${860 - cyc(f, 680) + 150} 984)`}><ellipse rx={64} ry={32} fill="#a08a62" stroke="#2a1c10" strokeWidth="3" /><path d="M-30 -16 q30 -16 60 0" stroke="#2a1c10" strokeWidth="3" fill="none" /></g>
        <g transform={`translate(${180 + cyc(f, 680, 300) - 150} 996)`}><ellipse rx={50} ry={9} fill="#8a7650" stroke="#2a1c10" strokeWidth="3" opacity=".8" /></g>
        <Actors specs={diggers} f={f} lights={[{x: 1100, y: 600, k: 0.5}, {x: 1560, y: 600, k: 0.5}]} />
        {Array.from({length: 24}, (_, i) => { const k = ((f * 0.9 + i * 11) % 60) / 60; return <circle key={'dr' + i} cx={1480 + rg(i) * 220} cy={500 + k * 420} r={1.6 + rg(i + 2) * 2} fill="#8a6a46" opacity={0.7 * (1 - k)} />; })}
      </Layer>
      {f >= BREAK && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen'}}>
          <defs><linearGradient id="brk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e6f0ff" stopOpacity=".9" /><stop offset="1" stopColor="#e6f0ff" stopOpacity="0" /></linearGradient></defs>
          <polygon points={`1740,0 1880,0 ${1900 + (f - BREAK) * 2},760 1680,760`} fill="url(#brk)" opacity={0.8 * easeOut((f - BREAK) / 10)} />
        </svg>
      )}
      <TunnelDark f={f} />
      <Layer cam={cam} depth={1.5} blur={3}><Motes f={f} seed={14} count={18} size={3} speed={0.6} /></Layer>
      <ChapterCaption f={f} title="TEROWONGAN" sub="digali berbulan-bulan dengan sendok dan sekop" from={10} to={88} />
    </Root>
  );
};
const kneelPoseLoad = (f: number) => {
  const s = (Math.sin(f * 0.22) + 1) / 2;
  return {...kneelPose(f), torso: 10 + 14 * s, head: 16, uaN: -50 - 20 * s, faN: -70 + 40 * s, uaF: -46 - 14 * s, faF: -80 + 30 * s};
};

/* ------------------------------------------------------------------ D: out of the exit hole, the chase, the searchlight finds them ------------------------------------------------------------------ */
export const Ww2Night: React.FC = () => {
  const f = useCurrentFrame();
  const GO = 44, STOP = 112;
  const Tf = (ff: number) => kf(ff, [[0, 0], [GO, 0], [STOP, 820], [400, 820]], false);
  const T = Tf(f), dT = (Tf(f + 1) - Tf(f - 1)) / 2;
  const sh = shakeAmp(f, [{t: 116, a: 7}]);
  const camFar: Cam = {x: T + Math.sin(f * 2.3) * sh, y: Math.cos(f * 2.9) * sh * 0.6, zoom: 1.0 + f * 0.0003};
  const cam0: Cam = {x: Math.sin(f * 2.3) * sh, y: Math.sin(f * 0.35) * 1.5, zoom: 1.0 + f * 0.0003};
  const ridgeA = nightRidge(7, 690, 36, 0.7), ridgeB = nightRidge(13, 712, 44, 0.5);
  const lock = ease(clamp((f - 96) / 20));
  const spotOn = clamp((f - 100) / 12);
  const HOLE = 560;
  const rise = (ff: number, start: number) => 360 * (1 - ease(clamp((ff - start) / 26)));
  const runners: Spec[] = [
    {id: 'hero', o: heroWW2('right'), x: 0, y: 962, s: 0.567, face: 'right', mode: 'run', fixed: false, xf: (ff) => HOLE + 60 + Tf(ff) * 1 + Math.max(0, ff - GO) * 0, stopAt: STOP, after: 'idle',
      pose: (ff, b) => (ff < GO ? {...b, dy: rise(ff, 8), torso: 8, head: -8 + 14 * Math.sin(ff * 0.22), uaN: -62, faN: -42, uaF: -50, faF: -50, thN: 0, thF: 0, shN: 0, shF: 0, sling: false} : ff >= 124 ? {...b, ...handsUpPose(ff / 8), mouth: 0.1} : {...b, sling: false, torso: (b.torso || 0) + 8})},
    {id: 'o2', o: general2('right'), x: 0, y: 962, s: 0.567, face: 'right', mode: 'run', fixed: false, xf: (ff) => HOLE - 60 + Tf(ff), stopAt: STOP - 3, after: 'idle',
      pose: (ff, b) => (ff < GO - 6 ? {...b, dy: rise(ff, 0), torso: 6, head: -6 + 12 * Math.sin(ff * 0.2 + 1), uaN: -58, faN: -46, uaF: -46, faF: -52, thN: 0, thF: 0, shN: 0, shF: 0, sling: false} : ff >= 126 ? {...b, ...handsUpPose(ff / 8 + 1)} : {...b, sling: false, torso: (b.torso || 0) + 8})},
  ];
  const chasers: Spec[] = [0, 1, 2].map((i) => ({id: `ch${i}`, o: {...italian('right'), build: [1.0, 1.12, 0.9][i], stretch: [1, 0.96, 1.05][i]}, x: -420 - i * 170, y: 962 + i * 6, s: 0.567, face: 'right' as const, mode: 'run' as const, vx: 12 - i * 0.3, stopAt: STOP + 14, after: 'aim' as const, fireFrom: 120 + i * 5, period: 15, aim: () => [900, 250] as [number, number], pose: (_ff: number, b: any) => ({...b, sling: false, mouth: _ff > 70 && _ff < 118 ? 0.6 : 0})}));
  const blockers: Spec[] = [2240, 2400].map((x, i) => ({id: `bl${i}`, o: {...italian('left'), build: [1.08, 0.92][i]}, x, y: 962 + i * 8, s: 0.567, face: 'left' as const, mode: 'aim' as const, fireFrom: 118 + i * 6, period: 17, aim: () => [1000, 260] as [number, number]}));
  const hx = 760;
  return (
    <Root f={f} frames={WW2_D} fadeIn fadeOut night grade="contrast(1.1) saturate(.9) hue-rotate(-4deg)">
      <Layer cam={camFar} depth={0.02}><NightSky f={f} /></Layer>
      <Layer cam={camFar} depth={0.1} blur={0.8}><Castle f={f} x={420} y={760} s={0.8} haze={0.62} /></Layer>
      <Layer cam={camFar} depth={0.1} blend="screen" opacity={0.85}>
        <Sweep f={f} x={420 - 40} y={760 - 400} phase={0} spread={0.55} aim={{x: hx + T * 0.1, y: 800, k: lock}} />
        <Sweep f={f} x={420 + 160} y={760 - 330} phase={2.2} spread={0.5} aim={{x: hx + T * 0.1 + 60, y: 800, k: lock * 0.85}} />
      </Layer>
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
        {/* the tunnel exit: a dark hole in the ground at the foot of the castle wall */}
        <g transform={`translate(${HOLE - T} 0)`}><ellipse cx={0} cy={992} rx={150} ry={26} fill="#020306" /><ellipse cx={0} cy={986} rx={160} ry={30} fill="none" stroke="#3a4660" strokeWidth="6" opacity=".6" /></g>
        <Actors specs={[...chasers, ...runners, ...blockers]} f={f} camT={T} depth={1} dT={dT} lights={f >= 100 ? [{x: hx, y: 700, k: 0.42 * spotOn, color: '#cfdcff'}] : []} />
        {/* soil mound in front of the hole hides the legs of the men still climbing out */}
        {f < 78 && <g transform={`translate(${HOLE - T} 0)`}><path d="M-230 1100 L-230 1004 Q-120 962 0 960 Q120 962 230 1004 L230 1100 Z" fill="#06090f" /><path d="M-190 1012 Q-110 966 0 964 Q110 966 190 1012" fill="none" stroke="#3a4660" strokeWidth="8" /><path d="M-110 988 Q-40 968 20 968" stroke="#5a6a8a" strokeWidth="4" fill="none" opacity=".5" /></g>}
      </Layer>
      {/* the beam has swung onto them: a pool of cold light, kept soft so the uniforms keep their shape */}
      {spotOn > 0 && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen'}}>
          <defs><radialGradient id="pool" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#dce6ff" stopOpacity=".38" /><stop offset="1" stopColor="#bcd0ff" stopOpacity="0" /></radialGradient></defs>
          <ellipse cx={780} cy={990} rx={640} ry={130} fill="url(#pool)" opacity={spotOn} />
        </svg>
      )}
      <Layer cam={cam0} depth={1.6} blur={4}><Scroll off={T * 1.6}>{[400, 1500, 2600].map((x, i) => <Cypress key={i} x={x} y={1120} s={1.8} haze={0.1} seed={i + 9} />)}</Scroll></Layer>
      <Layer cam={cam0} depth={1.7} blur={2}><Motes f={f} seed={19} count={16} size={3} speed={1.4} /></Layer>
      <ChapterCaption f={f} title="HARI KE-8" sub="tertangkap kembali di perbukitan Italia" from={124} to={174} />
    </Root>
  );
};

export const WW2Chapter: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={WW2_A}><Ww2Crash /></Sequence>
    <Sequence from={WW2_A} durationInFrames={WW2_B}><Ww2Swim /></Sequence>
    <Sequence from={WW2_A + WW2_B} durationInFrames={WW2_K}><Ww2Castle /></Sequence>
    <Sequence from={WW2_A + WW2_B + WW2_K} durationInFrames={WW2_C}><Ww2Tunnel /></Sequence>
    <Sequence from={WW2_A + WW2_B + WW2_K + WW2_C} durationInFrames={WW2_D}><Ww2Night /></Sequence>
  </AbsoluteFill>
);
void FPS; void easeOut;
