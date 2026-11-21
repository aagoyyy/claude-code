import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Acacia, Grass, Hills, Layer, Motes, Mountains, Plains, Rays, Rock, Scroll, Sky} from '../world/Savanna';
import {ChapterCaption} from '../ui/Type';
import {Dunes, dcol, Fort, SandStreaks, Scrub, SkyHot} from '../world/Desert';
import {Beams, DeadTree, Flare, flareLight, mcol, NHAZE, Puddles, Rain, Ruins, Sandbags, SkyNight, Smoke, Wire} from '../world/Trench';
import {Cam, camXY, clamp, easeOut, H, W} from '../world/util';
import {Actors, Crater, Explosion, Mounts, MountSpec, shakeAmp, Spec, Volley, Volleys} from '../fx/Battle';
import {LightName} from '../rig/Figure';
import {Post} from '../fx/Post';

export type Slot = {specs?: Spec[]; volleys?: Volley[]; mounts?: MountSpec[]; booms?: {x: number; y: number; t: number; r?: number}[]};
export type Props = {
  kind: 'savanna' | 'desert' | 'trench';
  T: (f: number) => number;                 // camera travel in depth-1 pixels
  zoom?: (f: number) => number;
  far?: Slot; mid?: Slot; back?: Slot; hero?: Slot;
  shake?: {t: number; a: number}[];
  flash?: (f: number) => number;
  caption?: {title: string; sub: string; from: number; to: number};
  fadeIn?: boolean; fadeOut?: boolean; frames: number;
  flares?: {x: number; y0: number; t0: number; drop: number}[];
  bagHits?: {x: number; t: number}[];
  roll?: (f: number) => number;              // dutch tilt (degrees)
  grade?: string;                            // CSS filter colour grade
  fortHit?: number;                          // frame a shell wrecks the fort
  focus?: (f: number) => number;            // rack focus: depth that is sharp
};

const LIGHT: Record<string, LightName> = {savanna: 'warm', desert: 'desert', trench: 'night'};

const FxCtx = React.createContext<{fb: (d: number) => number; bx: number}>({fb: () => 0, bx: 0});
const LF: React.FC<React.ComponentProps<typeof Layer>> = (q) => {
  const c = React.useContext(FxCtx);
  return <Layer {...q} blur={(q.blur || 0) + c.fb(q.depth)} bx={c.bx} />;
};

export const ProfileBattle: React.FC<Props> = (P) => {
  const f = useCurrentFrame();
  const T = P.T(f);
  const z = P.zoom ? P.zoom(f) : 1 + f * 0.0004;
  const sh = shakeAmp(f, P.shake || []);
  const jx = Math.sin(f * 2.3) * sh, jy = Math.cos(f * 2.9) * sh * 0.7;
  const camFar: Cam = {x: T + jx, y: jy, zoom: z};
  const cam0: Cam = {x: jx, y: jy + Math.sin(f * 0.35) * 1.5, zoom: z};
  const dT = (P.T(f + 1) - P.T(f - 1)) / 2;
  const wireHits = (d: number) => (P.bagHits || []).map((h) => ({x: h.x - P.T(h.t) * 0.82 + P.T(h.t) * d, t: h.t}));
  const grade = P.grade ?? (P.kind === 'savanna' ? 'contrast(1.07) saturate(1.16) sepia(.06)' : P.kind === 'desert' ? 'contrast(1.1) saturate(.84) brightness(1.04)' : 'contrast(1.13) saturate(.8) hue-rotate(-6deg)');
  const FL = P.flares || [{x: 1250, y0: 250, t0: -30, drop: 0.9}, {x: 560, y0: 230, t0: 92, drop: 0.8}, {x: 1500, y0: 260, t0: 196, drop: 0.9}];
  const G = P.kind === 'trench' ? clamp(FL.reduce((a, o) => a + flareLight(f - o.t0), 0) * 0.85 + 0.15 + 0.2 * (P.flash ? P.flash(f) : 0)) : 1;
  const L = LIGHT[P.kind];
  const lit = P.kind === 'trench' ? 0.3 + 0.9 * G : 1;
  const mk = (slot: Slot | undefined, depth: number, scrollT: number, lo: boolean, aimShift = 0) => {
    if (!slot) return null;
    const hh = (id: string, k: number) => { let h = k; for (let i = 0; i < id.length; i++) h = (h * 33 + id.charCodeAt(i)) >>> 0; return (h % 1000) / 1000; };
    const specs = (slot.specs || []).map((a) => ({...a, o: a.id === 'hero' ? a.o : {...a.o, build: a.o.build ?? 0.92 + 0.22 * hh(a.id, 3), stretch: a.o.stretch ?? 0.95 + 0.1 * hh(a.id, 7)}, light: a.light ?? L, lit: a.lit ?? lit, lo: a.lo ?? lo}));
    return (
      <>
        {slot.mounts && <Mounts list={slot.mounts.map((m) => ({...m, light: m.light ?? L, lit: m.lit ?? lit, lo: m.lo ?? lo}))} f={f} camT={scrollT} depth={depth} />}
        {slot.booms?.map((b, i) => <Crater key={'c' + i} x={b.x - scrollT * depth} y={b.y} age={f - b.t} r={b.r} />)}
        <Actors specs={specs} f={f} camT={scrollT} depth={depth} aimShift={aimShift} dT={dT} lights={(slot.booms || []).filter((b) => f - b.t >= 0 && f - b.t < 16).map((b) => ({x: b.x - scrollT * depth, y: b.y - 60, k: 1.1 * (1 - (f - b.t) / 16)}))} />
        {slot.volleys && <Volleys list={slot.volleys} f={f} />}
        {slot.booms?.map((b, i) => <Explosion key={i} x={b.x - scrollT * depth} y={b.y} age={f - b.t} r={b.r} seed={i + 2} />)}
      </>
    );
  };
  const mbf = (d: number) => Math.min(18, Math.abs(dT) * d * 0.55);
  const fb = (d: number) => (P.focus ? Math.max(0, Math.abs(d - P.focus(f)) - 0.25) * 8 : 0);
  const cIn = P.caption ? easeOut((f - P.caption.from) / 12) : 0, cOut = P.caption ? 1 - easeOut((f - P.caption.to) / 14) : 1;
  const fade = (P.fadeIn ? clamp(f / 12) : 1) * (P.fadeOut ? 1 - clamp((f - (P.frames - 6)) / 6) : 1);
  const dark = P.kind === 'trench';
  const inkH = dark ? '#f6e8c8' : P.kind === 'desert' ? '#4a2a18' : '#f6e8c8';
  const inkS = dark ? '#d9c7a0' : P.kind === 'desert' ? '#6a4630' : '#d9c7a0';

  return (
    <FxCtx.Provider value={{fb, bx: Math.min(10, sh * 0.6)}}>
    <AbsoluteFill style={{background: '#000', filter: grade, transform: P.roll ? `rotate(${P.roll(f)}deg) scale(1.08)` : undefined}}>
      {P.kind === 'savanna' && <>
        <LF cam={camFar} depth={0.02}><Sky f={f} /></LF>
        <LF cam={camFar} depth={0.06}><Mountains /></LF>
        <LF cam={camFar} depth={0.12} blend="screen" opacity={0.9}><Rays f={f} /></LF>
        <LF cam={camFar} depth={0.12} blur={0.8}><Hills seed={21} base={668} amp={34} haze={0.62} /></LF>
        <LF cam={camFar} depth={0.2} blur={0.5}><Hills seed={33} base={702} amp={42} haze={0.46} /></LF>
        <LF cam={camFar} depth={0.28} blur={0.4}><Plains seed={5} y0={690} y1={800} count={700} haze0={0.55} haze1={0.4} sunPatch /></LF>
        <LF cam={camFar} depth={0.3}>
          <Rock id="pb1" x={1480} y={786} w={150} h={96} seed={4} haze={0.3} /><Rock id="pb2" x={1610} y={790} w={100} h={140} seed={9} haze={0.3} /><Rock id="pb3" x={250} y={780} w={90} h={60} seed={19} haze={0.34} />
        </LF>
        <LF cam={camFar} depth={0.33}>{mk(P.far, 0.33, 0, true, T * 0.33)}</LF>
        <LF cam={cam0} depth={0.5}>
          <Scroll off={T * 0.5} mb={mbf(0.5)}><Plains seed={6} y0={770} y1={880} count={800} haze0={0.35} haze1={0.22} fade={1} /></Scroll>
          <Scroll off={T * 0.5} P={3000} mb={mbf(0.5)}><Acacia x={1560} y={812} s={0.95} seed={31} haze={0.3} /><Acacia x={300} y={806} s={0.62} seed={32} haze={0.36} /><Acacia x={2300} y={808} s={0.8} seed={33} haze={0.32} /></Scroll>
          {mk(P.mid, 0.5, T, true)}
        </LF>
        <LF cam={cam0} depth={0.78}>
          <Scroll off={T * 0.78} mb={mbf(0.78)}><Plains seed={7} y0={850} y1={960} count={900} haze0={0.18} haze1={0.1} fade={1} /></Scroll>
          <Scroll off={T * 0.78} mb={mbf(0.78)}><Grass f={f} seed={41} count={160} yMin={860} yMax={955} hMin={30} hMax={70} cDark="#6a5a2a" cLite="#d9b868" sway={0.8} /></Scroll>
          {mk(P.back, 0.78, T, false)}
        </LF>
        <LF cam={cam0} depth={1.0}>
          <Scroll off={T} mb={mbf(1)}><Plains seed={8} y0={930} y1={1080} count={900} haze0={0.08} haze1={0.0} fade={1} /></Scroll>
          {mk(P.hero, 1, T, false)}
        </LF>
        <LF cam={cam0} depth={1.5} blur={2.4}><Scroll off={T * 1.5} mb={mbf(1.5)}><Grass f={f} seed={51} count={150} yMin={1040} yMax={1100} hMin={140} hMax={300} cDark="#3a2f16" cLite="#a98a46" sway={1.4} /></Scroll></LF>
        <LF cam={cam0} depth={1.7} blur={2}><Motes f={f} seed={61} count={26} size={3} speed={2.4} /></LF>
        <LF cam={cam0} depth={2.6} blur={14}><Motes f={f} seed={72} count={8} size={16} speed={4} /></LF>
      </>}
      {P.kind === 'desert' && <>
        <LF cam={camFar} depth={0.02}><SkyHot f={f} /></LF>
        <svg width={0} height={0} style={{position: 'absolute'}}><filter id="heat" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="turbulence" baseFrequency={`0.005 ${0.03 + 0.006 * Math.sin(f * 0.07)}`} numOctaves={2} seed={4} /><feDisplacementMap in="SourceGraphic" scale="9" /></filter></svg>
        <LF cam={camFar} depth={0.06} blur={0.6} fx="url(#heat)"><Dunes seed={2} base={650} amp={34} haze={0.66} /></LF>
        <LF cam={camFar} depth={0.12} fx="url(#heat)"><Fort x={1450} y={700} s={0.82} f={f} haze={0.52} hit={P.fortHit} />{mk(P.far, 0.12, 0, true, T * 0.12)}</LF>
        <LF cam={camFar} depth={0.2} blur={0.5}><Dunes seed={5} base={705} amp={44} haze={0.46} /></LF>
        <LF cam={camFar} depth={0.28}><Plains seed={15} y0={700} y1={800} count={420} haze0={0.55} haze1={0.4} colorAt={dcol} haze="#fbe2b4" /></LF>
        <LF cam={camFar} depth={0.3}><Rock id="pd1" x={330} y={790} w={110} h={70} seed={21} haze={0.4} /><Rock id="pd2" x={1180} y={792} w={80} h={54} seed={22} haze={0.42} /></LF>
        <LF cam={cam0} depth={0.5}>
          <Scroll off={T * 0.5} mb={mbf(0.5)}><Plains seed={16} y0={770} y1={880} count={460} haze0={0.35} haze1={0.22} fade={1} colorAt={dcol} haze="#fbe2b4" /></Scroll>
          <Scroll off={T * 0.5} P={2720} mb={mbf(0.5)}><Scrub seed={3} count={9} y0={790} y1={870} f={f} /></Scroll>
          {mk(P.mid, 0.5, T, true)}
        </LF>
        <LF cam={cam0} depth={0.78}>
          <Scroll off={T * 0.78} mb={mbf(0.78)}><Plains seed={17} y0={850} y1={960} count={500} haze0={0.18} haze1={0.1} fade={1} colorAt={dcol} haze="#fbe2b4" /></Scroll>
          <Scroll off={T * 0.78} P={2720} mb={mbf(0.78)}><Scrub seed={4} count={7} y0={880} y1={950} f={f} /></Scroll>
          {mk(P.back, 0.78, T, false)}
        </LF>
        <LF cam={cam0} depth={1.0}>
          <Scroll off={T} mb={mbf(1)}><Plains seed={18} y0={930} y1={1080} count={520} haze0={0.08} haze1={0.0} fade={1} colorAt={dcol} haze="#fbe2b4" /></Scroll>
          {mk(P.hero, 1, T, false)}
        </LF>
        <LF cam={cam0} depth={1.3} blur={2}><SandStreaks f={f} seed={5} count={22} /></LF>
        <LF cam={cam0} depth={1.7} blur={2}><Motes f={f} seed={64} count={24} size={3} speed={2.4} /></LF>
        <LF cam={cam0} depth={2.6} blur={14}><Motes f={f} seed={65} count={7} size={18} speed={4} /></LF>
      </>}
      {P.kind === 'trench' && <>
        <LF cam={camFar} depth={0.02}><SkyNight f={f} glow={G} /></LF>
        <LF cam={camFar} depth={0.05} blend="screen" opacity={0.8}><Beams f={f} /></LF>
        <LF cam={camFar} depth={0.08}><Ruins haze={0.5} /></LF>
        <LF cam={camFar} depth={0.09} blur={9}><Smoke f={f} x={330} y={700} seed={3} w={200} /><Smoke f={f + 60} x={1540} y={700} seed={5} w={240} /></LF>
        <LF cam={camFar} depth={0.1} blur={1.2}>{FL.map((o, i) => <Flare key={i} x={o.x} y0={o.y0} t={f - o.t0} drop={o.drop} />)}</LF>
        <LF cam={camFar} depth={0.28}><Plains seed={25} y0={700} y1={800} count={380} haze0={0.6} haze1={0.45} colorAt={mcol} haze={NHAZE} /></LF>
        <LF cam={camFar} depth={0.3}><Wire y={772} x0={-400} x1={2300} s={0.5} haze={0.6} seed={2} f={f} hits={wireHits(0.3)} /><DeadTree x={280} y={780} s={0.62} haze={0.56} seed={4} /><DeadTree x={1560} y={784} s={0.7} haze={0.54} seed={7} /></LF>
        <LF cam={camFar} depth={0.33}>{mk(P.far, 0.33, 0, true, T * 0.33)}</LF>
        <LF cam={cam0} depth={0.5}>
          <Scroll off={T * 0.5} mb={mbf(0.5)}><Plains seed={26} y0={770} y1={880} count={420} haze0={0.4} haze1={0.28} fade={1} colorAt={mcol} haze={NHAZE} /></Scroll>
          <Scroll off={T * 0.5} P={3000} mb={mbf(0.5)}><Wire y={846} x0={0} x1={3000} s={0.85} haze={0.4} seed={3} f={f} hits={wireHits(0.5)} /><DeadTree x={1740} y={850} s={0.9} haze={0.4} seed={9} /><DeadTree x={420} y={850} s={0.8} haze={0.42} seed={10} /></Scroll>
          {mk(P.mid, 0.5, T, true)}
        </LF>
        <LF cam={cam0} depth={0.78}><Scroll off={T * 0.78} mb={mbf(0.78)}><Plains seed={27} y0={850} y1={960} count={460} haze0={0.22} haze1={0.12} fade={1} colorAt={mcol} haze={NHAZE} /><Puddles f={f} seed={5} y0={872} y1={950} glow={G} /></Scroll></LF>
        <LF cam={cam0} depth={0.8}>{mk(P.back, 0.8, T, false)}</LF>
        <LF cam={cam0} depth={0.82}><Scroll off={T * 0.82} P={2900} mb={mbf(0.82)}><Sandbags y={915} x0={0} x1={2900} rows={2} s={0.9} light={G} seed={11} f={f} hits={P.bagHits} /></Scroll></LF>
        <LF cam={cam0} depth={1.0}>
          <Scroll off={T} mb={mbf(1)}><Plains seed={28} y0={930} y1={1080} count={480} haze0={0.1} haze1={0.0} fade={1} colorAt={mcol} haze={NHAZE} /><Puddles f={f} seed={9} y0={960} y1={1060} glow={G} count={6} /></Scroll>
          {mk(P.hero, 1, T, false)}
        </LF>
        <LF cam={cam0} depth={1.3} blur={1}><Rain f={f} seed={7} count={70} /></LF>
        <LF cam={cam0} depth={1.6} blur={3.5}><Scroll off={T * 1.6} P={2900} mb={mbf(1.6)}><Sandbags y={1130} x0={0} x1={1000} rows={3} s={1.8} light={G * 0.6} seed={21} /><Sandbags y={1130} x0={1600} x1={2900} rows={3} s={1.8} light={G * 0.6} seed={22} /></Scroll></LF>
        <LF cam={cam0} depth={1.7} blur={2}><Motes f={f} seed={91} count={22} size={3} speed={2.2} /></LF>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen', opacity: 0.34 * G}}><rect width={W} height={H} fill="#7fd8b8" /></svg>
      </>}
      {[P.far, P.mid, P.back, P.hero].flatMap((sl, si) => (sl?.booms || []).map((b, i) => ({b, depth: [0.33, 0.5, 0.8, 1][si], key: `${si}-${i}`}))).filter(({b}) => f - b.t >= 0 && f - b.t < 22).map(({b, depth, key}) => {
        const [bx2, by2] = camXY(cam0, depth, b.x - (depth > 0.4 ? T * depth : 0), b.y - 60); const k = 1 - (f - b.t) / 22;
        return <svg key={key} width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen'}}><defs><radialGradient id={`bl${key}`}><stop offset="0" stopColor="#ffd08a" stopOpacity={0.9 * k} /><stop offset=".4" stopColor="#ff8a2a" stopOpacity={0.4 * k} /><stop offset="1" stopColor="#ff6a1a" stopOpacity="0" /></radialGradient></defs><circle cx={bx2} cy={by2} r={(b.r || 100) * 11} fill={`url(#bl${key})`} /></svg>;
      })}
      {P.caption && <ChapterCaption f={f} title={P.caption.title} sub={P.caption.sub} from={P.caption.from} to={P.caption.to} dark={dark} desert={P.kind === 'desert'} />}
      <Post f={f} fade={fade} flash={P.flash ? Math.min(0.5, 0.45 * P.flash(f)) : 0} night={dark} />
    </AbsoluteFill>
    </FxCtx.Provider>
  );
};
