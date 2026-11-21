import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Layer, Motes, Plains, Scroll} from '../world/Savanna';
import {Dunes} from '../world/Desert';
import {SeaBand, SeaSky, Splash, SwimFx, Wellington} from '../world/Coast';
import {Castle, Cypress, LightPool, nightGround, NightSky, nightRidge, Sweep, TunnelBG, TunnelDark} from '../world/Prison';
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
export const WW2_A = 120, WW2_H = 60, WW2_B = 180, WW2_K = 60, WW2_C = 132, WW2_D = 180;
export const WW2_FRAMES = WW2_A + WW2_H + WW2_B + WW2_K + WW2_C + WW2_D;

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
      </Layer>
      <Layer cam={cam} depth={0.9}><SeaBand f={f} y0={812} y1={1100} k={0.85} off={f * 3} speed={1.4} /></Layer>
      <Layer cam={cam} depth={1.6} blur={3}><SeaBand f={f} y0={1030} y1={1200} k={1} off={f * 5} speed={1.8} /></Layer>
      <Layer cam={cam} depth={1.8} blur={2}><Motes f={f} seed={7} count={14} size={3} speed={2} /></Layer>
      <ChapterCaption f={f} title="LIBYA" sub="1941 · pesawatnya mendarat darurat di laut" from={14} to={82} />
    </Root>
  );
};

/* ------------------------------------------------------------------ H: close-up — the General pulls himself out of the hatch ------------------------------------------------------------------ */
export const Ww2Hatch: React.FC = () => {
  const f = useCurrentFrame();
  const sh = 3 + 2 * Math.sin(f * 0.4);
  const cam: Cam = {x: Math.sin(f * 1.9) * 2.2, y: Math.cos(f * 2.3) * 2.2, zoom: 1.0 + f * 0.0006, px: 960, py: 700};
  const rise = (ff: number) => 330 * (1 - ease(clamp((ff - 4) / 26)));
  const walk = kf(f, [[0, 0], [38, 0], [58, 360]], true);
  const hero: Spec = {
    id: 'hero', o: heroWW2('right'), x: 0, y: 804, s: 0.62, face: 'right', mode: 'walk', vx: 4, stopAt: 60, xf: () => 820 + walk,
    pose: (ff, b) => {
      if (ff < 36) {
        const k = clamp((ff - 4) / 26), kn = clamp((ff - 20) / 8) * (1 - clamp((ff - 34) / 4));
        return {dy: rise(ff), torso: 10 * k, head: -6 + 12 * Math.sin(ff * 0.2), uaN: -140 + 100 * k, faN: -10 - 22 * k, uaF: -120 + 80 * k, faF: -20 - 30 * k, thN: -72 * kn, shN: 84 * kn, thF: 4 * (1 - kn), shF: 10, ftN: 0, mouth: 0.4 + 0.3 * Math.sin(ff * 0.8), grimace: 0.6, squint: 0.3, sling: false} as any;
      }
      return {...b, torso: (b.torso || 0) + 6, mouth: ff < 60 ? 0.35 : 0.1, brow: -0.5, grimace: 0.3, sling: false} as any;
    },
  };
  const rg = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;
  return (
    <Root f={f} frames={WW2_H} fadeIn grade="contrast(1.08) saturate(1.1)">
      <Layer cam={cam} depth={0.02}><SeaSky f={f} /></Layer>
      <Layer cam={cam} depth={0.1}><SeaBand f={f} y0={640} y1={700} k={0.05} off={f} /></Layer>
      <Layer cam={cam} depth={0.3}><SeaBand f={f} y0={700} y1={800} k={0.3} off={f * 2} /></Layer>
      {/* black smoke from the engine behind him */}
      <Layer cam={cam} depth={0.4} blur={6}>{Array.from({length: 8}, (_, i) => { const k = ((f * 0.5 + i * 11) % 90) / 90; return <ellipse key={i} cx={200 + k * 380} cy={620 - k * 300} rx={70 + k * 160} ry={50 + k * 110} fill="#171210" opacity={0.75 * (1 - k)} />; })}</Layer>
      <Layer cam={cam} depth={0.85}><SeaBand f={f} y0={880} y1={1100} k={0.7} off={f * 3} speed={1.3} /></Layer>
      {/* the fuselage top filling the foreground: hatch, rivets, lattice, a wing root, waves washing over its flank */}
      <Layer cam={cam} depth={1.0}>
        <defs><linearGradient id="hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8b09a" /><stop offset=".25" stopColor="#7a826c" /><stop offset="1" stopColor="#323a2c" /></linearGradient><clipPath id="hullc"><path d="M-300 1100 L-300 840 Q500 770 1000 800 Q1700 830 2300 900 L2300 1100 Z" /></clipPath></defs>
        <path d="M-300 1100 L-300 840 Q500 770 1000 800 Q1700 830 2300 900 L2300 1100 Z" fill="url(#hull)" stroke="#161a12" strokeWidth="6" />
        <g clipPath="url(#hullc)" stroke="#1e2418" strokeWidth="3" opacity=".5">{Array.from({length: 60}, (_, i) => <path key={i} d={`M${-300 + i * 56} 760 L${-220 + i * 56} 1100 M${-220 + i * 56} 760 L${-300 + i * 56} 1100`} />)}</g>
        <path d="M-300 846 Q500 776 1000 806 Q1700 836 2300 904" stroke="#e8eedc" strokeWidth="6" fill="none" opacity=".45" />
        <path d="M-300 900 Q500 830 1000 860 Q1700 890 2300 960" stroke="#000" strokeWidth="30" fill="none" opacity=".2" style={{filter: 'blur(8px)'}} />
        <ellipse cx={820} cy={804} rx={120} ry={22} fill="#0a0e08" stroke="#2a3024" strokeWidth="8" />
        <circle cx={1500} cy={880} r={92} fill="#1c3d8a" stroke="#161a12" strokeWidth="4" /><circle cx={1500} cy={880} r={70} fill="#f4f0e6" /><circle cx={1500} cy={880} r={50} fill="#b3262a" /><circle cx={1500} cy={880} r={22} fill="#f4f0e6" />
        {/* the hatch hides his legs while he is still inside */}
        <Actors specs={[hero]} f={f} />
        {f < 36 && <path d="M700 806 Q820 842 940 806 L960 1100 L680 1100 Z" fill="url(#hull)" stroke="#161a12" strokeWidth="5" />}
        {f < 36 && <path d="M700 806 Q820 790 940 806" stroke="#2a3024" strokeWidth="10" fill="none" />}
        {/* spray and foam as the sea slaps the hull */}
        {Array.from({length: 24}, (_, i) => { const k = ((f * 0.6 + i * 7) % 40) / 40; return <circle key={i} cx={-200 + rg(i) * 2200} cy={930 + rg(i + 3) * 140 - k * 70} r={3 + rg(i) * 7} fill="#eaf6fa" opacity={0.7 * (1 - k)} />; })}
      </Layer>
      <Layer cam={cam} depth={1.6} blur={4}><SeaBand f={f} y0={1030} y1={1200} k={1} off={f * 5} speed={1.8} /></Layer>
      <Layer cam={cam} depth={1.8} blur={2}><Motes f={f} seed={12} count={14} size={3} speed={2} /></Layer>
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
  // a scattered crowd over three depths with different roles and poses (positions given as final screen x; world = screen + T·depth)
  const Wd = (sx: number, d: number) => sx + 430 * d;
  const come = (sx: number, d: number, from: number, start: number, dur: number) => (ff: number) => Wd(sx, d) + from * (1 - ease(clamp((ff - start) / dur)));
  const near: Spec[] = [
    {id: 'n0', o: {...italian('left'), build: 0.96}, x: 0, y: 986, s: 0.6, face: 'left', mode: 'aim', fireFrom: 118, fireTo: 124, period: 22, aim: () => [900, 900], xf: (ff) => Wd(1730, 1) - Math.max(0, ff - 100) * 0.4, lo: false},
    {id: 'n1', o: {...italian('left'), build: 1.08, stretch: 0.97}, x: 0, y: 972, s: 0.58, face: 'left', mode: 'walk', vx: 1.5, stopAt: 160, after: 'idle', xf: come(1470, 1, 640, 92, 70), lo: false, pose: (ff, b) => ({...b, sling: ff < 160, mouth: talk(ff, 110, 170)})},
  ];
  const mid: Spec[] = [
    {id: 'm0', o: {...italian('left'), build: 0.92}, x: 0, y: 930, s: 0.44, face: 'left', mode: 'kneelAim', fireFrom: 130, period: 26, aim: () => [900, 930], xf: () => Wd(1370, 0.78), lo: false},
    {id: 'm1', o: {...italian('left'), build: 1.04, stretch: 1.04}, x: 0, y: 936, s: 0.45, face: 'left', mode: 'run', vx: -8, stopAt: 150, after: 'aim', fireFrom: 154, period: 24, aim: () => [880, 920], xf: come(1210, 0.78, 760, 96, 56), lo: false},
    {id: 'm2', o: {...italian('left', ), head: 'cap', hat: '#6a7a62', gear: 'none', build: 1.0, stretch: 1.06}, x: 0, y: 924, s: 0.46, face: 'left', mode: 'idle', xf: () => Wd(1780, 0.78), lo: false, pose: (ff, b) => ({...b, uaN: -92, faN: -12, uaF: 8, mouth: talk(ff, 100, 170, 1), brow: -0.5, torso: (b.torso || 0) - 4})},
  ];
  const far: Spec[] = [
    {id: 'f0', o: italian('left'), x: 0, y: 872, s: 0.3, face: 'left', mode: 'aim', fireFrom: 112, period: 26, aim: () => [860, 900], xf: () => Wd(1280, 0.5), lo: true},
    {id: 'f1', o: italian('left'), x: 0, y: 878, s: 0.3, face: 'left', mode: 'idle', xf: () => Wd(1450, 0.5), lo: true},
    {id: 'f2', o: italian('left'), x: 0, y: 868, s: 0.3, face: 'left', mode: 'kneelAim', fireFrom: 120, period: 30, aim: () => [880, 900], xf: () => Wd(1610, 0.5), lo: true},
    {id: 'f3', o: italian('left'), x: 0, y: 874, s: 0.3, face: 'left', mode: 'run', vx: -6, stopAt: 140, after: 'idle', xf: come(1380, 0.5, 520, 100, 40), lo: true},
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
            <Layer cam={cam} depth={0.5}><Actors specs={far} f={f} camT={T} depth={0.5} dT={dT} /></Layer>
      <Layer cam={cam} depth={0.78}><Actors specs={mid} f={f} camT={T} depth={0.78} dT={dT} /></Layer>
      <Layer cam={cam} depth={1.0}><Actors specs={[hero, ...near]} f={f} camT={T} depth={1} dT={dT} /></Layer>
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
  const guards: Spec[] = [
    {id: 'w0', o: {...italian('right'), gear: 'rifle'}, x: 0, y: 456, s: 0.12, face: 'right', mode: 'walk', vx: 0.6, xf: (ff) => 520 + ((ff * 1.6) % 360), lo: false},
    {id: 'w1', o: {...italian('left'), gear: 'rifle'}, x: 0, y: 456, s: 0.12, face: 'left', mode: 'walk', vx: 0.6, xf: (ff) => 1010 - ((ff * 1.5 + 90) % 380), lo: false},
    {id: 'w2', o: {...italian('right'), gear: 'rifle'}, x: 0, y: 456, s: 0.12, face: 'right', mode: 'idle', xf: () => 780, lo: false},
  ];
  return (
    <Root f={f} frames={WW2_K} night fadeIn fadeOut grade="contrast(1.12) saturate(.85)">
      <Layer cam={cam} depth={0.02}><NightSky f={f} /></Layer>
      <Layer cam={cam} depth={0.3}>
        <Castle f={f} x={760} y={900} s={1.5} haze={0.5} />
        <Sweep f={f} x={760 - 70} y={900 - 560} phase={0} spread={0.6} /><Sweep f={f} x={760 + 190} y={900 - 480} phase={2.2} spread={0.5} />
        <FigureDefs />
        <Actors specs={guards} f={f} lights={[{x: 610, y: 470, k: 0.6, color: '#ffb25a'}, {x: 850, y: 470, k: 0.6, color: '#ffb25a'}]} />
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
  const SH = 250;                                   // x of the shaft
  const HAUL = 5.4, hx0 = 880;                      // crawl speed, start x of the loaded hauler
  const hx = (ff: number) => Math.max(SH, hx0 - ff * HAUL);              // loaded man crawling left
  const arrive = (hx0 - SH) / HAUL;                                       // frame he reaches the shaft
  const back = (ff: number) => SH + Math.max(0, ff - arrive - 4) * 5.2;    // the same man, empty-handed, crawling back
  const loaded = (ff: number) => (ff < arrive + 2 ? 1 : 0), empty = (ff: number) => (ff >= arrive + 2 ? 1 : 0);
  const diggers: Spec[] = [
    {id: 'h', o: heroWW2('right', {gear: 'spade'}), x: 1430, y: 1004, s: 0.5, face: 'right', mode: 'kneel', pose: (ff) => ({...digPose(ff, 0), mouth: talk(ff, 64, 100), head: ff > BREAK ? -20 : 12, brow: -0.3})},
    {id: 'g2', o: general2('right', {gear: 'spade'}), x: 1190, y: 1004, s: 0.5, face: 'right', mode: 'kneel', pose: (ff) => ({...digPose(ff, 2.4), head: ff > BREAK ? -18 : 12})},
    {id: 'ld', o: general2('right', {stretch: 1.0}), x: 930, y: 1004, s: 0.5, face: 'right', mode: 'kneel', pose: (ff) => ({...kneelPoseLoad(ff)})},
    {id: 'c1', o: heroWW2('left', {stump: false, patch: false, young: false, mustache: false}), x: 0, y: 1012, s: 0.5, face: 'left', mode: 'idle', dieAt: -100, die: 'crawl', xf: hx, vis: loaded, lo: false},
    {id: 'c2', o: heroWW2('right', {stump: false, patch: false, young: false, mustache: false}), x: 0, y: 1012, s: 0.5, face: 'right', mode: 'idle', dieAt: -100, die: 'crawl', xf: back, vis: empty, lo: false},
  ];
  const sackBob = 3.5 * Math.sin(f * 0.9), sackRot = 7 * Math.sin(f * 0.55);
  const sackX = hx(f) + 250, atShaft = f >= arrive;
  const hoist = clamp((f - arrive) / 26);                       // the sack is clipped to the rope and hauled up
  return (
    <Root f={f} frames={WW2_C} grade="contrast(1.06) saturate(.95) sepia(.1)" fadeIn fadeOut night>
      <Layer cam={cam} depth={0.9}><TunnelBG f={f} scroll={f * 0.4} /></Layer>
      <Layer cam={cam} depth={1}>
        {/* pulley at the top of the shaft; the rope runs down to the sack, which stays on the floor until the hauler reaches it, then goes up */}
        <circle cx={110} cy={60} r={24} fill="#3a2a1a" stroke="#120a04" strokeWidth="4" /><circle cx={110} cy={60} r={7} fill="#8a6a3a" />
        <path d={`M112 84 V${atShaft ? 430 - 480 * ease(hoist) : 410}`} stroke="#8a6a3a" strokeWidth="5" />
        {atShaft && <g transform={`translate(${110 + 10 * Math.sin(f * 0.2)} ${470 - 480 * ease(hoist)}) rotate(${6 * Math.sin(f * 0.3)})`}><ellipse cx={0} cy={0} rx={44} ry={56} fill="#a08a62" stroke="#2a1c10" strokeWidth="3" /><path d="M-18 -46 Q0 -64 18 -46" stroke="#2a1c10" strokeWidth="4" fill="none" /><path d="M-30 -10 L30 -4 M-28 14 L28 20" stroke="#6a5a3a" strokeWidth="3" opacity=".6" /></g>}
        {/* the face being dug: solid earth that crumbles at the breakthrough */}
        <path d="M1700 470 L2300 470 L2300 1010 L1700 1010 Z" fill="#3a281a" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M${1700 + rg(i) * 200} ${500 + i * 62} l${60 + rg(i + 3) * 120} ${rg(i + 1) * 20 - 10}`} stroke="#6a5038" strokeWidth="5" opacity=".6" />)}
        {/* heap of loose soil between diggers and loader, with sacks stacked beside it */}
        <path d="M1040 1008 Q1090 930 1170 920 Q1250 934 1300 1008 Z" fill="#4a3624" stroke="#1a1008" strokeWidth="3" />
        {[0, 1, 2].map((i) => <g key={i}><ellipse cx={780 + i * 46} cy={982 - (i % 2) * 22} rx={34} ry={26} fill="#a08a62" stroke="#2a1c10" strokeWidth="3" /><path d={`M${766 + i * 46} ${962 - (i % 2) * 22} q14 -14 28 0`} stroke="#2a1c10" strokeWidth="3" fill="none" /></g>)}
        {f >= BREAK && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => { const a = f - BREAK, vx = (rg(i) - 0.2) * -9, vy = -(4 + rg(i + 5) * 10); return <rect key={'ch' + i} x={1700 + rg(i + 2) * 90 + vx * a} y={560 + rg(i + 1) * 360 + vy * a + 0.5 * 1.3 * a * a} width={30 + rg(i) * 40} height={22 + rg(i + 4) * 30} fill={i % 2 ? '#5a4128' : '#3a281a'} opacity={clamp(1.4 - a / 40)} transform={`rotate(${a * (rg(i) * 14 - 4)} ${1720} ${700})`} />; })}
        {/* the full sack trails behind the loaded man on a rope: it bounces, rocks, and kicks up a dust trail */}
        {!atShaft && (
          <g>
            <path d={`M${hx(f) + 70} 1000 Q${hx(f) + 160} ${1012 + sackBob} ${sackX - 56} ${992 + sackBob}`} stroke="#6a5030" strokeWidth="5" fill="none" />
            {Array.from({length: 10}, (_, i) => <ellipse key={i} cx={sackX + 70 + i * 34} cy={1004 - (i % 3) * 4} rx={26 + i * 4} ry={7 + i} fill="#a08868" opacity={0.42 * (1 - i / 10)} style={{filter: 'blur(6px)'}} />)}
            <g transform={`translate(${sackX} ${976 + sackBob}) rotate(${sackRot})`}><ellipse rx={74} ry={40} fill="#a08a62" stroke="#2a1c10" strokeWidth="3" /><path d="M-40 -22 Q-10 -42 20 -26" stroke="#2a1c10" strokeWidth="4" fill="none" /><path d="M-46 4 L40 -6 M-40 20 L44 14" stroke="#6a5a3a" strokeWidth="3" opacity=".6" /></g>
          </g>
        )}
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
  const rise = (ff: number, start: number) => 360 * (1 - ease(clamp((ff - start) / 28)));
  const climb = (ff: number, start: number, sd: number) => {
    const k = clamp((ff - start) / 28), kn = clamp((ff - start - 14) / 8) * (1 - clamp((ff - start - 26) / 8));
    return {dy: rise(ff, start), torso: 14 * k * (1 - clamp((ff - start - 28) / 8)), head: -6 + 12 * Math.sin(ff * 0.22 + sd) - 6 * k, uaN: -84 + 40 * k, faN: -6 - 26 * k, uaF: -66 + 30 * k, faF: -40, thN: -76 * kn, shN: 88 * kn, thF: 0, shF: 6, sling: false};
  };
  const runners: Spec[] = [
    {id: 'hero', o: heroWW2('right'), x: 0, y: 962, s: 0.567, face: 'right', mode: 'run', fixed: false, xf: (ff) => HOLE + 60 + Tf(ff), stopAt: STOP, after: 'idle',
      pose: (ff, b) => (ff < GO - 6 ? ({...b, ...climb(ff, 10, 0)} as any) : ff >= 124 ? {...b, ...handsUpPose(ff / 8), mouth: 0.1} : {...b, sling: false, torso: (b.torso || 0) + 8})},
    {id: 'o2', o: general2('right'), x: 0, y: 962, s: 0.567, face: 'right', mode: 'run', fixed: false, xf: (ff) => HOLE - 70 + Tf(ff), stopAt: STOP - 3, after: 'idle',
      pose: (ff, b) => (ff < GO - 10 ? ({...b, ...climb(ff, 2, 1.7)} as any) : ff >= 126 ? {...b, ...handsUpPose(ff / 8 + 1)} : {...b, sling: false, torso: (b.torso || 0) + 8})},
  ];
  const chasers: Spec[] = [
    {id: 'ch0', o: {...italian('right'), build: 1.0}, x: -420, y: 968, s: 0.567, face: 'right', mode: 'run', vx: 12, stopAt: STOP + 14, after: 'aim', fireFrom: 120, period: 15, aim: () => [900, 250], pose: (ff: number, b: any) => ({...b, sling: false, mouth: ff > 70 && ff < 118 ? 0.6 : 0})},
    {id: 'ch1', o: {...italian('right'), build: 1.12, stretch: 0.96, head: 'cap', hat: '#6a7a62', gear: 'none'}, x: -640, y: 950, s: 0.5, face: 'right', mode: 'run', vx: 11, stopAt: STOP + 22, after: 'idle', pose: (ff: number, b: any) => (ff >= STOP + 22 ? {...b, uaN: -92, faN: -12, uaF: 8, mouth: talk(ff, 100, 170), brow: -0.5} : {...b, mouth: ff > 60 ? 0.7 : 0, uaN: -92, faN: -14, sling: false})},
    {id: 'ch2', o: {...italian('right'), build: 0.9, stretch: 1.05}, x: -820, y: 936, s: 0.44, face: 'right', mode: 'run', vx: 10, stopAt: STOP + 30, after: 'kneelAim', fireFrom: 124, period: 17, aim: () => [900, 250], pose: (_ff: number, b: any) => ({...b, sling: false})},
    {id: 'ch3', o: {...italian('right'), build: 1.04}, x: -300, y: 904, s: 0.36, face: 'right', mode: 'run', vx: 9, stopAt: STOP + 10, after: 'aim', fireFrom: 128, period: 20, aim: () => [900, 250], pose: (_ff: number, b: any) => ({...b, sling: false})},
  ];
  const blockers: Spec[] = [
    {id: 'bl0', o: {...italian('left'), build: 1.08}, x: 2240, y: 972, s: 0.58, face: 'left', mode: 'aim', fireFrom: 118, period: 17, aim: () => [1000, 260]},
    {id: 'bl1', o: {...italian('left'), build: 0.92, stretch: 1.04}, x: 2480, y: 940, s: 0.47, face: 'left', mode: 'kneelAim', fireFrom: 124, period: 19, aim: () => [1000, 260]},
    {id: 'bl2', o: {...italian('left'), head: 'cap', hat: '#6a7a62', gear: 'none', build: 1.02}, x: 2370, y: 912, s: 0.4, face: 'left', mode: 'idle', pose: (ff: number, b: any) => ({...b, uaN: -96, faN: -10, uaF: 10, mouth: talk(ff, 100, 170, 2), brow: -0.5})},
    {id: 'bl3', o: {...italian('left'), build: 0.96}, x: 2700, y: 902, s: 0.34, face: 'left', mode: 'run', vx: -7, stopAt: 140, after: 'aim', fireFrom: 150, period: 22, aim: () => [1000, 260]},
  ];
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
        <Actors specs={[...chasers, ...runners, ...blockers]} f={f} camT={T} depth={1} dT={dT} lights={f >= 96 ? [{x: lerp(hx - 760, hx + 20, ease(lock)), y: 760, k: 0.42 * spotOn, color: '#cfdcff'}] : []} />
        {f > 6 && f < 54 && Array.from({length: 14}, (_, i) => { const a = f - 6, vx = (((i * 53) % 17) - 8) * 0.6, k = ((a * 0.8 + i * 5) % 30) / 30; return <rect key={'cr' + i} x={HOLE - T - 140 + ((i * 37) % 280) + vx * k * 10} y={958 + k * 70} width={7 + (i % 3) * 4} height={6 + (i % 2) * 4} fill="#2a3450" opacity={0.9 * (1 - k)} />; })}
        {[14, 26].map((t, i) => f >= t && f < t + 14 ? <ellipse key={'dp' + i} cx={HOLE - T + (i ? 80 : -70)} cy={968} rx={40 + (f - t) * 5} ry={10 + (f - t) * 1.6} fill="#6a7a9a" opacity={0.5 * (1 - (f - t) / 14)} style={{filter: 'blur(6px)'}} /> : null)}
        {/* soil mound in front of the hole hides the legs of the men still climbing out */}
        {f < 84 && <g transform={`translate(${HOLE - T} 0)`}><path d="M-230 1100 L-230 1004 Q-120 962 0 960 Q120 962 230 1004 L230 1100 Z" fill="#06090f" /><path d="M-190 1012 Q-110 966 0 964 Q110 966 190 1012" fill="none" stroke="#3a4660" strokeWidth="8" /><path d="M-110 988 Q-40 968 20 968" stroke="#5a6a8a" strokeWidth="4" fill="none" opacity=".5" /></g>}
      </Layer>
      {spotOn > 0 && <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0}}><LightPool f={f} x={lerp(hx - 760, hx + 20, ease(lock))} y={990} k={spotOn} w={620} /></svg>}
      <Layer cam={cam0} depth={1.6} blur={4}><Scroll off={T * 1.6}>{[400, 1500, 2600].map((x, i) => <Cypress key={i} x={x} y={1120} s={1.8} haze={0.1} seed={i + 9} />)}</Scroll></Layer>
      <Layer cam={cam0} depth={1.7} blur={2}><Motes f={f} seed={19} count={16} size={3} speed={1.4} /></Layer>
      <ChapterCaption f={f} title="HARI KE-8" sub="tertangkap kembali di perbukitan Italia" from={124} to={174} />
    </Root>
  );
};

export const WW2Chapter: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={WW2_A}><Ww2Crash /></Sequence>
    <Sequence from={WW2_A} durationInFrames={WW2_H}><Ww2Hatch /></Sequence>
    <Sequence from={WW2_A + WW2_H} durationInFrames={WW2_B}><Ww2Swim /></Sequence>
    <Sequence from={WW2_A + WW2_H + WW2_B} durationInFrames={WW2_K}><Ww2Castle /></Sequence>
    <Sequence from={WW2_A + WW2_H + WW2_B + WW2_K} durationInFrames={WW2_C}><Ww2Tunnel /></Sequence>
    <Sequence from={WW2_A + WW2_H + WW2_B + WW2_K + WW2_C} durationInFrames={WW2_D}><Ww2Night /></Sequence>
  </AbsoluteFill>
);
void FPS; void easeOut;
